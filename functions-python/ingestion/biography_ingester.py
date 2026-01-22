"""
GENESIS Biography Ingestion Pipeline

Complete pipeline for:
1. Reading PDFs/text files
2. Cleaning and chunking with semantic awareness
3. Enriching with AI-generated metadata (topics, sentiment, entities)
4. Generating vector embeddings
5. Storing in PostgreSQL (pgvector) and Neo4j

Based on Gemini's Hello History tutorial, enhanced for Constitutional AI.
"""

import os
import re
import json
import hashlib
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime

from .chunking import SemanticChunker, Chunk
from .enrichment import TopicEnricher, EnrichedChunk, enrich_chunk_to_dict

logger = logging.getLogger(__name__)


@dataclass
class IngestionResult:
    """Result of a biography ingestion"""
    success: bool
    profile_id: str
    chunks_created: int
    chunks_stored_pgvector: int
    chunks_stored_neo4j: int
    errors: List[str]
    processing_time_seconds: float


class BiographyIngester:
    """
    Complete biography ingestion pipeline for GENESIS.

    Usage:
        ingester = BiographyIngester(
            neo4j_uri="bolt://...",
            neo4j_user="neo4j",
            neo4j_password="...",
            postgres_connection="postgresql://...",
            openai_api_key="sk-..."
        )

        result = ingester.ingest_pdf(
            pdf_path="reagan_biography.pdf",
            profile_id="historical_ronald_reagan",
            profile_name="Ronald Reagan"
        )
    """

    def __init__(
        self,
        neo4j_uri: str = None,
        neo4j_user: str = None,
        neo4j_password: str = None,
        postgres_connection: str = None,
        openai_api_key: str = None,
        embedding_model: str = "text-embedding-3-small"
    ):
        """
        Initialize the biography ingester.

        Args:
            neo4j_uri: Neo4j connection URI
            neo4j_user: Neo4j username
            neo4j_password: Neo4j password
            postgres_connection: PostgreSQL connection string
            openai_api_key: OpenAI API key for embeddings and enrichment
            embedding_model: OpenAI embedding model to use
        """
        # Neo4j configuration
        self.neo4j_uri = neo4j_uri or os.environ.get("NEO4J_URI")
        self.neo4j_user = neo4j_user or os.environ.get("NEO4J_USER", "neo4j")
        self.neo4j_password = neo4j_password or os.environ.get("NEO4J_PASSWORD")

        # PostgreSQL configuration
        self.postgres_connection = postgres_connection or os.environ.get("POSTGRES_CONNECTION")

        # OpenAI configuration
        self.openai_api_key = openai_api_key or os.environ.get("OPENAI_API_KEY")
        self.embedding_model = embedding_model

        # Initialize components
        self.chunker = SemanticChunker(
            chunk_size=1000,
            chunk_overlap=200,
            respect_paragraphs=True,
            detect_speakers=True
        )

        self.enricher = TopicEnricher(
            api_key=self.openai_api_key,
            model="gpt-4o-mini"
        )

        # Lazy-loaded connections
        self._neo4j_driver = None
        self._postgres_conn = None
        self._openai_client = None

    def _get_neo4j_driver(self):
        """Lazy load Neo4j driver"""
        if self._neo4j_driver is None and self.neo4j_uri:
            try:
                from neo4j import GraphDatabase
                self._neo4j_driver = GraphDatabase.driver(
                    self.neo4j_uri,
                    auth=(self.neo4j_user, self.neo4j_password)
                )
            except Exception as e:
                logger.error(f"Failed to connect to Neo4j: {e}")
        return self._neo4j_driver

    def _get_postgres_conn(self):
        """Lazy load PostgreSQL connection"""
        if self._postgres_conn is None and self.postgres_connection:
            try:
                import psycopg2
                from pgvector.psycopg2 import register_vector
                self._postgres_conn = psycopg2.connect(self.postgres_connection)
                register_vector(self._postgres_conn)
            except Exception as e:
                logger.error(f"Failed to connect to PostgreSQL: {e}")
        return self._postgres_conn

    def _get_openai_client(self):
        """Lazy load OpenAI client"""
        if self._openai_client is None:
            if not self.openai_api_key:
                logger.info("No OpenAI API key, embeddings will use zero vectors")
                return None
            try:
                from openai import OpenAI
                self._openai_client = OpenAI(api_key=self.openai_api_key)
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {e}")
        return self._openai_client

    def close(self):
        """Close all connections"""
        if self._neo4j_driver:
            self._neo4j_driver.close()
        if self._postgres_conn:
            self._postgres_conn.close()

    # =========================================================================
    # STEP 1: INGEST (Read PDF/Text)
    # =========================================================================

    def read_pdf(self, pdf_path: str) -> str:
        """
        Read text from a PDF file.

        Uses PyMuPDF (fitz) for better text extraction.
        """
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(pdf_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except ImportError:
            logger.warning("PyMuPDF not installed, trying pdfplumber")
            try:
                import pdfplumber
                with pdfplumber.open(pdf_path) as pdf:
                    text = ""
                    for page in pdf.pages:
                        text += page.extract_text() or ""
                return text
            except ImportError:
                raise ImportError("Please install PyMuPDF (fitz) or pdfplumber for PDF reading")

    def read_text_file(self, file_path: str, encoding: str = 'utf-8') -> str:
        """Read text from a plain text file"""
        with open(file_path, 'r', encoding=encoding) as f:
            return f.read()

    # =========================================================================
    # STEP 2: CLEAN (Remove Artifacts)
    # =========================================================================

    def clean_text(self, text: str) -> str:
        """Clean raw text using the chunker's cleaning method"""
        return self.chunker.clean_text(text)

    # =========================================================================
    # STEP 3: CHUNK (Semantic Splitting)
    # =========================================================================

    def chunk_text(
        self,
        text: str,
        profile_id: str,
        profile_name: str,
        source_file: str = None
    ) -> List[Chunk]:
        """
        Chunk text with semantic awareness.

        Args:
            text: Cleaned text to chunk
            profile_id: GENESIS profile ID
            profile_name: Display name
            source_file: Original filename for tracking

        Returns:
            List of Chunk objects
        """
        base_metadata = {
            'profile_id': profile_id,
            'profile_name': profile_name,
            'source_file': source_file,
            'ingested_at': datetime.utcnow().isoformat()
        }

        return self.chunker.chunk_text(text, base_metadata)

    # =========================================================================
    # STEP 4: ENRICH (AI Tagging)
    # =========================================================================

    def enrich_chunks(
        self,
        chunks: List[Chunk],
        profile_context: str = None,
        progress_callback=None
    ) -> List[EnrichedChunk]:
        """
        Enrich chunks with AI-generated metadata.

        Args:
            chunks: List of Chunk objects
            profile_context: Context about the profile
            progress_callback: Optional callback(current, total)

        Returns:
            List of EnrichedChunk objects
        """
        chunk_dicts = [
            {'text': c.text, 'metadata': c.metadata}
            for c in chunks
        ]

        return self.enricher.enrich_batch(
            chunk_dicts,
            profile_context=profile_context,
            progress_callback=progress_callback
        )

    # =========================================================================
    # STEP 5a: GENERATE EMBEDDINGS
    # =========================================================================

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding vector for text using OpenAI.

        Returns:
            List of 1536 floats (for text-embedding-3-small)
        """
        client = self._get_openai_client()
        if not client:
            raise ValueError("OpenAI client not available")

        text = text.replace("\n", " ")
        response = client.embeddings.create(
            input=[text],
            model=self.embedding_model
        )
        return response.data[0].embedding

    def generate_embeddings_batch(
        self,
        texts: List[str],
        batch_size: int = 100
    ) -> List[List[float]]:
        """Generate embeddings for multiple texts in batches"""
        client = self._get_openai_client()
        if not client:
            raise ValueError("OpenAI client not available")

        all_embeddings = []

        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            batch = [t.replace("\n", " ") for t in batch]

            response = client.embeddings.create(
                input=batch,
                model=self.embedding_model
            )

            for item in response.data:
                all_embeddings.append(item.embedding)

        return all_embeddings

    # =========================================================================
    # STEP 5b: STORE IN PGVECTOR
    # =========================================================================

    def setup_pgvector_table(self):
        """Create the pgvector table if it doesn't exist"""
        conn = self._get_postgres_conn()
        if not conn:
            return False

        cur = conn.cursor()
        try:
            # Enable pgvector extension
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector")

            # Create table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS biography_chunks (
                    id SERIAL PRIMARY KEY,
                    chunk_hash VARCHAR(64) UNIQUE,
                    profile_id VARCHAR(255),
                    profile_name VARCHAR(255),
                    chunk_index INTEGER,
                    content TEXT,
                    topics TEXT[],
                    sentiment VARCHAR(50),
                    entities TEXT[],
                    constitutional_themes TEXT[],
                    relationship_dynamics TEXT[],
                    metadata JSONB,
                    embedding vector(1536),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX IF NOT EXISTS idx_biography_profile_id
                ON biography_chunks(profile_id);

                CREATE INDEX IF NOT EXISTS idx_biography_topics
                ON biography_chunks USING GIN(topics);

                CREATE INDEX IF NOT EXISTS idx_biography_themes
                ON biography_chunks USING GIN(constitutional_themes);
            """)

            conn.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to setup pgvector table: {e}")
            conn.rollback()
            return False
        finally:
            cur.close()

    def store_in_pgvector(
        self,
        enriched_chunks: List[EnrichedChunk],
        embeddings: List[List[float]]
    ) -> int:
        """
        Store enriched chunks with embeddings in PostgreSQL.

        Returns:
            Number of chunks stored
        """
        conn = self._get_postgres_conn()
        if not conn:
            logger.warning("PostgreSQL not available, skipping pgvector storage")
            return 0

        cur = conn.cursor()
        stored = 0

        try:
            for chunk, embedding in zip(enriched_chunks, embeddings):
                # Create unique hash for chunk
                chunk_hash = hashlib.sha256(chunk.text.encode()).hexdigest()

                cur.execute("""
                    INSERT INTO biography_chunks
                    (chunk_hash, profile_id, profile_name, chunk_index, content,
                     topics, sentiment, entities, constitutional_themes,
                     relationship_dynamics, metadata, embedding)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (chunk_hash) DO UPDATE SET
                        topics = EXCLUDED.topics,
                        sentiment = EXCLUDED.sentiment,
                        entities = EXCLUDED.entities,
                        constitutional_themes = EXCLUDED.constitutional_themes,
                        relationship_dynamics = EXCLUDED.relationship_dynamics,
                        metadata = EXCLUDED.metadata,
                        embedding = EXCLUDED.embedding
                """, (
                    chunk_hash,
                    chunk.original_metadata.get('profile_id'),
                    chunk.original_metadata.get('profile_name'),
                    chunk.chunk_index,
                    chunk.text,
                    chunk.topics,
                    chunk.sentiment,
                    chunk.entities,
                    chunk.constitutional_themes,
                    chunk.relationship_dynamics,
                    json.dumps(chunk.original_metadata),
                    embedding
                ))
                stored += 1

            conn.commit()
            return stored

        except Exception as e:
            logger.error(f"Failed to store in pgvector: {e}")
            conn.rollback()
            return 0
        finally:
            cur.close()

    # =========================================================================
    # STEP 5c: STORE IN NEO4J
    # =========================================================================

    def store_in_neo4j(self, enriched_chunks: List[EnrichedChunk]) -> int:
        """
        Store enriched chunks in Neo4j for GraphRAG.

        Creates:
        - Chunk nodes linked to Profile
        - Topic nodes linked to Chunks
        - Entity nodes linked to Chunks
        - Theme nodes linked to Chunks

        Returns:
            Number of chunks stored
        """
        driver = self._get_neo4j_driver()
        if not driver:
            logger.warning("Neo4j not available, skipping graph storage")
            return 0

        stored = 0

        cypher_query = """
        // Create or get the Profile node
        MERGE (p:GuestProfile {profile_id: $profile_id})
        SET p.name = $profile_name

        // Create the Chunk node
        MERGE (c:BiographyChunk {chunk_hash: $chunk_hash})
        SET c.text = $text,
            c.chunk_index = $chunk_index,
            c.sentiment = $sentiment,
            c.created_at = datetime()

        // Link Chunk to Profile
        MERGE (p)-[:HAS_BIOGRAPHY_CHUNK]->(c)

        // Create and link Topic nodes
        FOREACH (topic_name IN $topics |
            MERGE (t:Topic {name: topic_name})
            MERGE (c)-[:DISCUSSES]->(t)
        )

        // Create and link Entity nodes
        FOREACH (entity_name IN $entities |
            MERGE (e:Entity {name: entity_name})
            MERGE (c)-[:MENTIONS]->(e)
        )

        // Create and link Constitutional Theme nodes
        FOREACH (theme_name IN $themes |
            MERGE (th:ConstitutionalTheme {name: theme_name})
            MERGE (c)-[:EXPRESSES]->(th)
        )

        // Create and link Relationship Dynamic nodes
        FOREACH (dynamic_name IN $dynamics |
            MERGE (d:RelationshipDynamic {name: dynamic_name})
            MERGE (c)-[:DEMONSTRATES]->(d)
        )
        """

        with driver.session() as session:
            for chunk in enriched_chunks:
                try:
                    chunk_hash = hashlib.sha256(chunk.text.encode()).hexdigest()

                    session.run(
                        cypher_query,
                        profile_id=chunk.original_metadata.get('profile_id'),
                        profile_name=chunk.original_metadata.get('profile_name'),
                        chunk_hash=chunk_hash,
                        text=chunk.text[:5000],  # Limit text size in Neo4j
                        chunk_index=chunk.chunk_index,
                        sentiment=chunk.sentiment,
                        topics=chunk.topics,
                        entities=chunk.entities[:20],  # Limit entities
                        themes=chunk.constitutional_themes,
                        dynamics=chunk.relationship_dynamics
                    )
                    stored += 1

                except Exception as e:
                    logger.error(f"Failed to store chunk {chunk.chunk_index} in Neo4j: {e}")

        return stored

    # =========================================================================
    # MAIN INGESTION PIPELINE
    # =========================================================================

    def ingest_pdf(
        self,
        pdf_path: str,
        profile_id: str,
        profile_name: str,
        profile_context: str = None,
        progress_callback=None
    ) -> IngestionResult:
        """
        Complete PDF ingestion pipeline.

        Args:
            pdf_path: Path to PDF file
            profile_id: GENESIS profile ID
            profile_name: Display name
            profile_context: Additional context for enrichment
            progress_callback: Optional callback(stage, current, total)

        Returns:
            IngestionResult with statistics
        """
        start_time = datetime.utcnow()
        errors = []

        try:
            # Stage 1: Read PDF
            if progress_callback:
                progress_callback("reading", 0, 1)
            raw_text = self.read_pdf(pdf_path)
            if progress_callback:
                progress_callback("reading", 1, 1)

            return self._ingest_text(
                text=raw_text,
                profile_id=profile_id,
                profile_name=profile_name,
                profile_context=profile_context,
                source_file=os.path.basename(pdf_path),
                progress_callback=progress_callback,
                start_time=start_time
            )

        except Exception as e:
            errors.append(str(e))
            logger.error(f"PDF ingestion failed: {e}")
            return IngestionResult(
                success=False,
                profile_id=profile_id,
                chunks_created=0,
                chunks_stored_pgvector=0,
                chunks_stored_neo4j=0,
                errors=errors,
                processing_time_seconds=(datetime.utcnow() - start_time).total_seconds()
            )

    def ingest_text(
        self,
        text: str,
        profile_id: str,
        profile_name: str,
        profile_context: str = None,
        source_file: str = "direct_input",
        progress_callback=None
    ) -> IngestionResult:
        """
        Complete text ingestion pipeline.

        Args:
            text: Raw text to ingest
            profile_id: GENESIS profile ID
            profile_name: Display name
            profile_context: Additional context for enrichment
            source_file: Source identifier
            progress_callback: Optional callback(stage, current, total)

        Returns:
            IngestionResult with statistics
        """
        start_time = datetime.utcnow()

        return self._ingest_text(
            text=text,
            profile_id=profile_id,
            profile_name=profile_name,
            profile_context=profile_context,
            source_file=source_file,
            progress_callback=progress_callback,
            start_time=start_time
        )

    def _ingest_text(
        self,
        text: str,
        profile_id: str,
        profile_name: str,
        profile_context: str,
        source_file: str,
        progress_callback,
        start_time: datetime
    ) -> IngestionResult:
        """Internal text ingestion implementation"""
        errors = []

        try:
            # Stage 2: Clean
            if progress_callback:
                progress_callback("cleaning", 0, 1)
            clean_text = self.clean_text(text)
            if progress_callback:
                progress_callback("cleaning", 1, 1)

            # Stage 3: Chunk
            if progress_callback:
                progress_callback("chunking", 0, 1)
            chunks = self.chunk_text(
                clean_text,
                profile_id,
                profile_name,
                source_file
            )
            chunks_created = len(chunks)
            if progress_callback:
                progress_callback("chunking", 1, 1)

            logger.info(f"Created {chunks_created} chunks for {profile_name}")

            # Stage 4: Enrich
            def enrich_progress(current, total):
                if progress_callback:
                    progress_callback("enriching", current, total)

            enriched_chunks = self.enrich_chunks(
                chunks,
                profile_context=profile_context or f"{profile_name} historical biography",
                progress_callback=enrich_progress
            )

            # Stage 5a: Generate embeddings
            if progress_callback:
                progress_callback("embedding", 0, len(enriched_chunks))

            texts = [c.text for c in enriched_chunks]
            try:
                embeddings = self.generate_embeddings_batch(texts)
            except Exception as e:
                logger.warning(f"Embedding generation failed: {e}")
                errors.append(f"Embedding failed: {e}")
                embeddings = [[0.0] * 1536 for _ in texts]  # Zero vectors as fallback

            if progress_callback:
                progress_callback("embedding", len(enriched_chunks), len(enriched_chunks))

            # Stage 5b: Store in pgvector
            if progress_callback:
                progress_callback("storing_pgvector", 0, 1)

            self.setup_pgvector_table()
            chunks_stored_pgvector = self.store_in_pgvector(enriched_chunks, embeddings)

            if progress_callback:
                progress_callback("storing_pgvector", 1, 1)

            # Stage 5c: Store in Neo4j
            if progress_callback:
                progress_callback("storing_neo4j", 0, 1)

            chunks_stored_neo4j = self.store_in_neo4j(enriched_chunks)

            if progress_callback:
                progress_callback("storing_neo4j", 1, 1)

            processing_time = (datetime.utcnow() - start_time).total_seconds()

            return IngestionResult(
                success=True,
                profile_id=profile_id,
                chunks_created=chunks_created,
                chunks_stored_pgvector=chunks_stored_pgvector,
                chunks_stored_neo4j=chunks_stored_neo4j,
                errors=errors,
                processing_time_seconds=processing_time
            )

        except Exception as e:
            errors.append(str(e))
            logger.error(f"Text ingestion failed: {e}")
            return IngestionResult(
                success=False,
                profile_id=profile_id,
                chunks_created=0,
                chunks_stored_pgvector=0,
                chunks_stored_neo4j=0,
                errors=errors,
                processing_time_seconds=(datetime.utcnow() - start_time).total_seconds()
            )


# =========================================================================
# CONVENIENCE FUNCTIONS
# =========================================================================

def quick_ingest_biography(
    text: str,
    profile_id: str,
    profile_name: str
) -> Dict:
    """
    Quick helper for one-off biography ingestion.

    Uses environment variables for configuration.
    """
    ingester = BiographyIngester()

    result = ingester.ingest_text(
        text=text,
        profile_id=profile_id,
        profile_name=profile_name
    )

    ingester.close()

    return asdict(result)
