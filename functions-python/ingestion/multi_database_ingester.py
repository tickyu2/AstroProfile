"""
Multi-Database Ingester for GENESIS - Reagan Diaries

Pushes diary chunks to THREE databases simultaneously:
1. Firebase Firestore - Brain storage for app UI (b2_memories)
2. pgvector (PostgreSQL) - RAG vector search
3. Neo4j - Knowledge Graph for timeline/relationship queries

This powers the complete Soul architecture:
- Firebase: Source cards and raw text display
- pgvector: "How did he feel about the Cold War?" (semantic search)
- Neo4j: "What happened in January 1984?" (graph traversal)

Based on Hello History multi-DB pattern, enhanced with 20% overlap chunking.
"""

import os
import json
import logging
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass

# Import perspective system for Rashomon Effect prevention
try:
    from .perspective import Perspective, PERSPECTIVE_WEIGHTS, get_perspective_prompt
    PERSPECTIVE_AVAILABLE = True
except ImportError:
    PERSPECTIVE_AVAILABLE = False

logger = logging.getLogger(__name__)

# Import text splitter for 20% overlap chunking
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    CHUNKER_AVAILABLE = True
except ImportError:
    CHUNKER_AVAILABLE = False

# Chunking constants
CHUNK_SIZE = 1000       # ~250 words per chunk
CHUNK_OVERLAP = 200     # 20% overlap
MIN_CHUNK_SIZE = 100
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536


@dataclass
class IngestionConfig:
    """Configuration for multi-database ingestion."""
    # Firebase
    firebase_project_id: Optional[str] = None
    firestore_collection: str = "profiles"
    firestore_subcollection: str = "b2_memories"
    profile_id: str = "historical_ronald_reagan"

    # PostgreSQL (pgvector)
    postgres_conn_string: Optional[str] = None
    postgres_table: str = "reagan_diaries"

    # Neo4j
    neo4j_uri: Optional[str] = None
    neo4j_user: str = "neo4j"
    neo4j_password: Optional[str] = None

    # OpenAI
    openai_api_key: Optional[str] = None

    # Processing
    batch_size: int = 50
    generate_embeddings: bool = True

    # Perspective (Rashomon Effect prevention)
    perspective: str = "SELF"              # SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
    perspective_subject: str = "ronald_reagan"  # Who the content is ABOUT
    source_author: str = "Ronald Reagan"   # Who WROTE the content
    source_title: str = "The Reagan Diaries"  # Book/document title
    reliability_weight: Optional[float] = None  # Auto-calculated from perspective if None


class MultiDatabaseIngester:
    """
    Ingests diary chunks to Firebase, pgvector, and Neo4j simultaneously.

    Creates synchronized storage:
    - Firebase: Raw text + metadata (for UI display)
    - pgvector: Embeddings + text (for semantic RAG)
    - Neo4j: Graph structure (for timeline/relationship queries)
    """

    def __init__(self, config: IngestionConfig):
        self.config = config
        self._openai_client = None
        self._firestore_client = None
        self._postgres_conn = None
        self._neo4j_driver = None

        # Initialize text splitter
        if CHUNKER_AVAILABLE:
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=CHUNK_SIZE,
                chunk_overlap=CHUNK_OVERLAP,
                separators=["\n\n", "\n", ". ", " ", ""]
            )
        else:
            self.text_splitter = None
            logger.warning("Text splitter not available")

    def _get_openai_client(self):
        """Lazy-load OpenAI client."""
        if self._openai_client is None and self.config.openai_api_key:
            try:
                from openai import OpenAI
                self._openai_client = OpenAI(api_key=self.config.openai_api_key)
            except ImportError:
                logger.warning("OpenAI not available")
        return self._openai_client

    def _get_firestore_client(self):
        """Lazy-load Firestore client."""
        if self._firestore_client is None:
            try:
                import firebase_admin
                from firebase_admin import firestore

                if not firebase_admin._apps:
                    firebase_admin.initialize_app()

                self._firestore_client = firestore.client()
            except Exception as e:
                logger.warning(f"Firestore not available: {e}")
        return self._firestore_client

    def _get_postgres_conn(self):
        """Lazy-load PostgreSQL connection."""
        if self._postgres_conn is None and self.config.postgres_conn_string:
            try:
                import psycopg2
                from pgvector.psycopg2 import register_vector

                self._postgres_conn = psycopg2.connect(self.config.postgres_conn_string)
                register_vector(self._postgres_conn)

                # Ensure table exists
                cur = self._postgres_conn.cursor()
                cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
                cur.execute(f"""
                    CREATE TABLE IF NOT EXISTS {self.config.postgres_table} (
                        id SERIAL PRIMARY KEY,
                        chunk_id TEXT UNIQUE,
                        content TEXT,
                        metadata JSONB,
                        embedding vector({EMBEDDING_DIMENSIONS})
                    );
                """)
                self._postgres_conn.commit()
                cur.close()
            except Exception as e:
                logger.warning(f"PostgreSQL not available: {e}")
        return self._postgres_conn

    def _get_neo4j_driver(self):
        """Lazy-load Neo4j driver."""
        if self._neo4j_driver is None and self.config.neo4j_uri and self.config.neo4j_password:
            try:
                from neo4j import GraphDatabase
                self._neo4j_driver = GraphDatabase.driver(
                    self.config.neo4j_uri,
                    auth=(self.config.neo4j_user, self.config.neo4j_password)
                )
            except Exception as e:
                logger.warning(f"Neo4j not available: {e}")
        return self._neo4j_driver

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a batch of texts."""
        client = self._get_openai_client()
        if not client:
            return [[0.0] * EMBEDDING_DIMENSIONS] * len(texts)

        try:
            # Clean texts
            clean_texts = [t.replace("\n", " ")[:8000] for t in texts]

            response = client.embeddings.create(
                input=clean_texts,
                model=EMBEDDING_MODEL
            )
            return [data.embedding for data in response.data]
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            return [[0.0] * EMBEDDING_DIMENSIONS] * len(texts)

    def ingest_chunks(self, chunks: List[Dict]) -> Dict:
        """
        Ingest chunks to all three databases.

        Args:
            chunks: List of dicts with keys:
                - chunk_id: Unique identifier
                - text: The text content
                - metadata: Dict with date, source, etc.

        Returns:
            Dict with results for each database
        """
        results = {
            "total_chunks": len(chunks),
            "firebase": {"success": 0, "errors": []},
            "postgres": {"success": 0, "errors": []},
            "neo4j": {"success": 0, "errors": []},
            "embeddings_generated": 0
        }

        logger.info(f"Starting multi-DB ingestion of {len(chunks)} chunks")

        # Process in batches
        for batch_start in range(0, len(chunks), self.config.batch_size):
            batch_end = min(batch_start + self.config.batch_size, len(chunks))
            batch = chunks[batch_start:batch_end]

            logger.info(f"Processing batch {batch_start} to {batch_end}...")

            # 1. Generate embeddings for batch
            embeddings = []
            if self.config.generate_embeddings:
                batch_texts = [c['text'] for c in batch]
                embeddings = self.generate_embeddings_batch(batch_texts)
                results["embeddings_generated"] += len([e for e in embeddings if e[0] != 0.0])

            # 2. Process each chunk
            for idx, chunk in enumerate(batch):
                chunk_id = chunk['chunk_id']
                text = chunk['text']
                metadata = chunk.get('metadata', {})
                embedding = embeddings[idx] if embeddings else None

                # A. Firebase (Brain Storage)
                try:
                    self._ingest_to_firebase(chunk_id, text, metadata)
                    results["firebase"]["success"] += 1
                except Exception as e:
                    results["firebase"]["errors"].append(f"{chunk_id}: {str(e)}")

                # B. PostgreSQL/pgvector (RAG Storage)
                try:
                    self._ingest_to_postgres(chunk_id, text, metadata, embedding)
                    results["postgres"]["success"] += 1
                except Exception as e:
                    results["postgres"]["errors"].append(f"{chunk_id}: {str(e)}")

                # C. Neo4j (Graph Storage)
                try:
                    self._ingest_to_neo4j(chunk_id, text, metadata)
                    results["neo4j"]["success"] += 1
                except Exception as e:
                    results["neo4j"]["errors"].append(f"{chunk_id}: {str(e)}")

            # Commit PostgreSQL batch
            postgres = self._get_postgres_conn()
            if postgres:
                postgres.commit()

        logger.info(f"Multi-DB ingestion complete: {results}")
        return results

    def _ingest_to_firebase(self, chunk_id: str, text: str, metadata: Dict):
        """Store chunk in Firebase Firestore with perspective."""
        firestore = self._get_firestore_client()
        if not firestore:
            raise Exception("Firestore not available")

        from firebase_admin import firestore as fs

        doc_ref = firestore.collection(self.config.firestore_collection) \
            .document(self.config.profile_id) \
            .collection(self.config.firestore_subcollection) \
            .document(chunk_id)

        doc_ref.set({
            'content': text,
            'metadata': metadata,
            'embedding_generated': True,
            'source': metadata.get('source', self.config.source_title),
            'date': metadata.get('date', 'Unknown'),
            # Perspective fields (Rashomon Effect prevention)
            'perspective': metadata.get('perspective', self.config.perspective),
            'perspective_subject': metadata.get('perspective_subject', self.config.perspective_subject),
            'source_author': metadata.get('source_author', self.config.source_author),
            'reliability_weight': metadata.get('reliability_weight', self.config.reliability_weight or 1.0),
            'timestamp': fs.SERVER_TIMESTAMP
        })

    def _ingest_to_postgres(self, chunk_id: str, text: str, metadata: Dict,
                           embedding: Optional[List[float]]):
        """Store chunk in PostgreSQL with pgvector and perspective."""
        postgres = self._get_postgres_conn()
        if not postgres:
            raise Exception("PostgreSQL not available")

        # Ensure perspective fields are in metadata
        enriched_metadata = {
            **metadata,
            'perspective': metadata.get('perspective', self.config.perspective),
            'perspective_subject': metadata.get('perspective_subject', self.config.perspective_subject),
            'source_author': metadata.get('source_author', self.config.source_author),
            'reliability_weight': metadata.get('reliability_weight', self.config.reliability_weight or 1.0),
        }

        cur = postgres.cursor()

        # Upsert (insert or update)
        cur.execute(f"""
            INSERT INTO {self.config.postgres_table} (chunk_id, content, metadata, embedding)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (chunk_id) DO UPDATE
            SET content = EXCLUDED.content,
                metadata = EXCLUDED.metadata,
                embedding = EXCLUDED.embedding;
        """, (chunk_id, text, json.dumps(enriched_metadata), embedding))

        cur.close()

    def _ingest_to_neo4j(self, chunk_id: str, text: str, metadata: Dict):
        """Store chunk in Neo4j with graph relationships and perspective."""
        driver = self._get_neo4j_driver()
        if not driver:
            raise Exception("Neo4j not available")

        date_value = metadata.get('date_parsed') or metadata.get('date', 'Unknown')
        date_text = metadata.get('date_text') or metadata.get('date', 'Unknown')
        year = metadata.get('year')
        source = metadata.get('source', self.config.source_title)

        # Perspective fields
        perspective = metadata.get('perspective', self.config.perspective)
        perspective_subject = metadata.get('perspective_subject', self.config.perspective_subject)
        source_author = metadata.get('source_author', self.config.source_author)
        reliability_weight = metadata.get('reliability_weight', self.config.reliability_weight or 1.0)

        with driver.session() as session:
            session.run("""
                // Ensure author exists
                MERGE (p:Person {name: $source_author})

                // Create or get Date node
                MERGE (d:Date {value: $date_value})
                ON CREATE SET d.display = $date_text, d.year = $year

                // Create DiaryEntry (or DiaryChunk) with perspective
                MERGE (e:DiaryEntry {id: $chunk_id})
                SET e.text = $text,
                    e.source = $source,
                    e.date_text = $date_text,
                    e.date_parsed = $date_value,
                    e.year = $year,
                    // PERSPECTIVE FIELDS (Rashomon Effect prevention)
                    e.perspective = $perspective,
                    e.perspective_subject = $perspective_subject,
                    e.source_author = $source_author,
                    e.reliability_weight = $reliability_weight

                // Link Entry to Author (Ownership)
                MERGE (p)-[:WROTE]->(e)

                // Link Entry to Date (Timeline)
                MERGE (e)-[:ON_DATE]->(d)

                // Link Date to Author (Timeline presence)
                MERGE (p)-[:WAS_ACTIVE_ON]->(d)
            """, {
                "chunk_id": chunk_id,
                "text": text,
                "date_value": date_value,
                "date_text": date_text,
                "year": year,
                "source": source,
                "source_author": source_author,
                "perspective": perspective,
                "perspective_subject": perspective_subject,
                "reliability_weight": reliability_weight
            })

    def close(self):
        """Close all database connections."""
        if self._postgres_conn:
            self._postgres_conn.close()
        if self._neo4j_driver:
            self._neo4j_driver.close()


def ingest_diary_chunks_multi_db(
    chunks: List[Dict],
    config: Optional[IngestionConfig] = None,
    **kwargs
) -> Dict:
    """
    Convenience function to ingest diary chunks to all databases.

    Args:
        chunks: List of chunk dicts
        config: IngestionConfig or None to use environment variables
        **kwargs: Override config values

    Returns:
        Dict with ingestion results
    """
    if config is None:
        config = IngestionConfig(
            firebase_project_id=os.environ.get("FIREBASE_PROJECT_ID"),
            postgres_conn_string=os.environ.get("DATABASE_URL"),
            neo4j_uri=os.environ.get("NEO4J_URI"),
            neo4j_password=os.environ.get("NEO4J_PASSWORD"),
            openai_api_key=os.environ.get("OPENAI_API_KEY"),
            **kwargs
        )

    ingester = MultiDatabaseIngester(config)
    try:
        results = ingester.ingest_chunks(chunks)
    finally:
        ingester.close()

    return results


# =============================================================================
# COMPLETE PIPELINE: Parse ePub → Chunk → Multi-DB Ingest
# =============================================================================

def ingest_reagan_diaries_complete(
    epub_path_or_bytes,
    config: Optional[IngestionConfig] = None,
    author_name: str = "Ronald Reagan",
    source_title: str = "The Reagan Diaries",
    perspective: str = "SELF",
    perspective_subject: str = "ronald_reagan",
    reliability_weight: float = None
) -> Dict:
    """
    Complete pipeline: ePub → Parse → Chunk → Multi-DB Ingest

    This is the ONE function to call for full Reagan Diaries ingestion.
    Now with PERSPECTIVE support to prevent Rashomon Effect.

    Args:
        epub_path_or_bytes: Path to ePub file or bytes
        config: IngestionConfig (or uses environment variables)
        author_name: Author name for metadata
        source_title: Source title for metadata
        perspective: SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
        perspective_subject: Who the content is ABOUT (e.g., "ronald_reagan")
        reliability_weight: Trust weight (auto-calculated from perspective if None)

    Returns:
        Dict with complete ingestion results
    """
    # Auto-calculate reliability weight from perspective if not provided
    if reliability_weight is None and PERSPECTIVE_AVAILABLE:
        try:
            reliability_weight = PERSPECTIVE_WEIGHTS.get(Perspective(perspective), 0.5)
        except (ValueError, KeyError):
            reliability_weight = 0.5
    elif reliability_weight is None:
        reliability_weight = 1.0 if perspective == "SELF" else 0.5
    from .epub_parser import EpubParser

    results = {
        "parsing": {},
        "chunking": {},
        "ingestion": {},
        # Perspective tracking in results
        "perspective": perspective,
        "perspective_subject": perspective_subject,
        "source_author": author_name,
        "reliability_weight": reliability_weight
    }

    # 1. Parse ePub
    parser = EpubParser()
    if isinstance(epub_path_or_bytes, bytes):
        full_text, chapters = parser.parse_epub_bytes(epub_path_or_bytes)
    else:
        full_text, chapters = parser.parse_epub(epub_path_or_bytes)

    # 2. Extract diary entries with perspective
    entries = parser.extract_diary_entries(
        full_text,
        perspective=perspective,
        perspective_subject=perspective_subject,
        source_author=author_name,
        source_title=source_title,
        reliability_weight=reliability_weight
    )
    results["parsing"] = {
        "entries_found": len(entries),
        "total_words": sum(e.word_count for e in entries),
        "perspective": perspective
    }

    # 3. Create chunks with 20% overlap and inherited metadata + perspective
    chunks = []

    if CHUNKER_AVAILABLE:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

        for entry in entries:
            if len(entry.text) < MIN_CHUNK_SIZE:
                # Short entry - single chunk
                chunks.append({
                    "chunk_id": f"{entry.date_parsed or entry.date_text}_0",
                    "text": entry.text,
                    "metadata": {
                        "date": entry.date_text,
                        "date_parsed": entry.date_parsed,
                        "year": entry.year,
                        "source": source_title,
                        "type": "personal_reflection",
                        "mentioned_people": entry.mentioned_people or [],
                        "mentioned_topics": entry.mentioned_topics or [],
                        # PERSPECTIVE FIELDS (Rashomon Effect prevention)
                        "perspective": perspective,
                        "perspective_subject": perspective_subject,
                        "source_author": author_name,
                        "reliability_weight": reliability_weight
                    }
                })
            else:
                # Long entry - split with overlap
                split_chunks = text_splitter.create_documents([entry.text])
                for idx, chunk in enumerate(split_chunks):
                    if len(chunk.page_content) < MIN_CHUNK_SIZE:
                        continue

                    chunks.append({
                        "chunk_id": f"{entry.date_parsed or entry.date_text}_{idx}",
                        "text": chunk.page_content,
                        "metadata": {
                            # INHERITED from parent entry
                            "date": entry.date_text,
                            "date_parsed": entry.date_parsed,
                            "year": entry.year,
                            "source": source_title,
                            "type": "personal_reflection",
                            "chunk_index": idx,
                            "total_chunks": len(split_chunks),
                            # People/topics from parent entry
                            "mentioned_people": entry.mentioned_people or [],
                            "mentioned_topics": entry.mentioned_topics or [],
                            # INHERITED PERSPECTIVE (Rashomon Effect prevention)
                            "perspective": perspective,
                            "perspective_subject": perspective_subject,
                            "source_author": author_name,
                            "reliability_weight": reliability_weight
                        }
                    })
    else:
        # No chunker - store full entries
        for entry in entries:
            chunks.append({
                "chunk_id": f"{entry.date_parsed or entry.date_text}_0",
                "text": entry.text,
                "metadata": {
                    "date": entry.date_text,
                    "date_parsed": entry.date_parsed,
                    "year": entry.year,
                    "source": source_title,
                    "type": "personal_reflection",
                    # PERSPECTIVE FIELDS (Rashomon Effect prevention)
                    "perspective": perspective,
                    "perspective_subject": perspective_subject,
                    "source_author": author_name,
                    "reliability_weight": reliability_weight
                }
            })

    results["chunking"] = {
        "chunks_created": len(chunks),
        "overlap_enabled": CHUNKER_AVAILABLE
    }

    # 4. Ingest to all databases
    results["ingestion"] = ingest_diary_chunks_multi_db(chunks, config)

    return results
