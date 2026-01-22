"""
Diary Ingester for GENESIS - Reagan Diaries ePub Ingestion

Creates DiaryEntry nodes in Neo4j with:
- Date relationships
- Person mentions (MENTIONS)
- Topic tags (DISCUSSES)
- Source attribution (WROTE)

NEW: 20% Overlap Chunking for RAG
- Long entries are split into overlapping chunks (DiaryChunk nodes)
- Each chunk INHERITS the date metadata from parent DiaryEntry
- This ensures the AI never loses context of WHEN something happened
- Prevents "snapping" anecdotes in half (e.g., assassination attempt story)

Uses epub_parser.py for extraction and enrichment.py for embeddings.
"""

import logging
import hashlib
from typing import List, Dict, Optional, Tuple
from dataclasses import asdict

from .epub_parser import EpubParser, DiaryEntry, parse_reagan_diaries
from .enrichment import BiographyEnricher
from .perspective import (
    Perspective, PerspectiveMetadata, PERSPECTIVE_WEIGHTS,
    get_perspective_prompt, get_known_source, infer_perspective_from_title
)

# Import text splitter for 20% overlap chunking
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    CHUNKER_AVAILABLE = True
except ImportError:
    CHUNKER_AVAILABLE = False

logger = logging.getLogger(__name__)

# Chunking constants (Hello History recommended settings)
CHUNK_SIZE = 1000       # ~250 words per chunk
CHUNK_OVERLAP = 200     # 20% overlap (200 chars / 1000 chars)
MIN_CHUNK_SIZE = 100    # Don't create chunks smaller than this


class DiaryIngester:
    """
    Ingests diary entries from ePub files into Neo4j.

    Creates graph structure:
    (Person)-[:WROTE]->(DiaryEntry)-[:MENTIONS]->(Person)
                                 -[:DISCUSSES]->(Topic)
                                 -[:ON_DATE]->(Date)
                                 -[:HAS_CHUNK]->(DiaryChunk)

    DiaryChunk nodes inherit metadata from parent DiaryEntry:
    - date_text, date_parsed, year (CRITICAL for RAG context)
    - 20% overlap ensures anecdotes aren't split mid-thought
    """

    def __init__(self, neo4j_driver, openai_api_key: Optional[str] = None):
        self.driver = neo4j_driver
        self.parser = EpubParser()
        self.enricher = BiographyEnricher(api_key=openai_api_key) if openai_api_key else None

        # Initialize text splitter for 20% overlap chunking
        if CHUNKER_AVAILABLE:
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=CHUNK_SIZE,
                chunk_overlap=CHUNK_OVERLAP,
                separators=["\n\n", "\n", ". ", " ", ""],  # Try paragraph first
                length_function=len
            )
            logger.info(f"Text splitter initialized: {CHUNK_SIZE} chars, {CHUNK_OVERLAP} overlap (20%)")
        else:
            self.text_splitter = None
            logger.warning("langchain-text-splitters not available, using full entry storage")

    def ingest_epub(
        self,
        epub_path: str,
        author_name: str = "Ronald Reagan",
        source_title: str = "The Reagan Diaries",
        perspective: str = "SELF",
        perspective_subject: str = "ronald_reagan",
        reliability_weight: float = None
    ) -> Dict:
        """
        Ingest an entire ePub diary into Neo4j.

        Args:
            epub_path: Path to the ePub file
            author_name: Name of the diary author
            source_title: Title of the source book
            perspective: SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
            perspective_subject: Who the content is ABOUT
            reliability_weight: Override default weight (auto-calculated from perspective if None)

        Returns:
            Dictionary with ingestion results
        """
        # Auto-calculate reliability weight from perspective if not provided
        if reliability_weight is None:
            try:
                reliability_weight = PERSPECTIVE_WEIGHTS.get(Perspective(perspective), 0.5)
            except ValueError:
                reliability_weight = 0.5

        results = {
            "entries_parsed": 0,
            "entries_stored": 0,
            "chunks_created": 0,
            "people_linked": 0,
            "topics_linked": 0,
            "chunking_enabled": self.text_splitter is not None,
            "perspective": perspective,
            "perspective_subject": perspective_subject,
            "reliability_weight": reliability_weight,
            "errors": []
        }

        try:
            # Parse the ePub
            logger.info(f"Parsing ePub: {epub_path}")
            full_text, chapters = self.parser.parse_epub(epub_path)

            # Extract diary entries with perspective
            entries = self.parser.extract_diary_entries(
                full_text,
                perspective=perspective,
                perspective_subject=perspective_subject,
                source_author=author_name,
                source_title=source_title,
                reliability_weight=reliability_weight
            )
            results["entries_parsed"] = len(entries)
            logger.info(f"Extracted {len(entries)} diary entries with perspective={perspective}")

            # Ensure author exists in graph
            self._ensure_author(author_name)

            # Store each entry with perspective
            for i, entry in enumerate(entries):
                try:
                    entry_hash, chunks_count = self._store_entry(
                        entry, author_name, source_title, i,
                        perspective=perspective,
                        perspective_subject=perspective_subject,
                        reliability_weight=reliability_weight
                    )
                    if entry_hash:
                        results["entries_stored"] += 1
                        results["chunks_created"] += chunks_count
                        results["people_linked"] += len(entry.mentioned_people or [])
                        results["topics_linked"] += len(entry.mentioned_topics or [])
                except Exception as e:
                    error_msg = f"Entry {i} ({entry.date_text}): {str(e)}"
                    results["errors"].append(error_msg)
                    logger.error(error_msg)

            logger.info(f"Ingestion complete: {results['entries_stored']}/{results['entries_parsed']} entries, {results['chunks_created']} chunks")

        except Exception as e:
            results["errors"].append(f"Ingestion failed: {str(e)}")
            logger.error(f"Ingestion failed: {str(e)}")

        return results

    def ingest_epub_bytes(
        self,
        epub_bytes: bytes,
        author_name: str = "Ronald Reagan",
        source_title: str = "The Reagan Diaries",
        perspective: str = "SELF",
        perspective_subject: str = "ronald_reagan",
        reliability_weight: float = None
    ) -> Dict:
        """
        Ingest ePub from bytes (for Cloud Function uploads).

        Args:
            epub_bytes: ePub file as bytes
            author_name: Name of the diary author
            source_title: Title of the source book
            perspective: SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
            perspective_subject: Who the content is ABOUT
            reliability_weight: Trust weight (auto-calculated from perspective if None)
        """
        # Auto-calculate reliability weight from perspective if not provided
        if reliability_weight is None:
            try:
                reliability_weight = PERSPECTIVE_WEIGHTS.get(Perspective(perspective), 0.5)
            except ValueError:
                reliability_weight = 0.5

        results = {
            "entries_parsed": 0,
            "entries_stored": 0,
            "chunks_created": 0,
            "people_linked": 0,
            "topics_linked": 0,
            "chunking_enabled": self.text_splitter is not None,
            "perspective": perspective,
            "perspective_subject": perspective_subject,
            "reliability_weight": reliability_weight,
            "errors": []
        }

        try:
            # Parse the ePub from bytes
            logger.info(f"Parsing ePub from bytes with perspective={perspective}")
            full_text, chapters = self.parser.parse_epub_bytes(epub_bytes)

            # Extract diary entries with perspective
            entries = self.parser.extract_diary_entries(
                full_text,
                perspective=perspective,
                perspective_subject=perspective_subject,
                source_author=author_name,
                source_title=source_title,
                reliability_weight=reliability_weight
            )
            results["entries_parsed"] = len(entries)
            logger.info(f"Extracted {len(entries)} diary entries with perspective={perspective}")

            # Ensure author exists in graph
            self._ensure_author(author_name)

            # Store each entry with perspective
            for i, entry in enumerate(entries):
                try:
                    entry_hash, chunks_count = self._store_entry(
                        entry, author_name, source_title, i,
                        perspective=perspective,
                        perspective_subject=perspective_subject,
                        reliability_weight=reliability_weight
                    )
                    if entry_hash:
                        results["entries_stored"] += 1
                        results["chunks_created"] += chunks_count
                        results["people_linked"] += len(entry.mentioned_people or [])
                        results["topics_linked"] += len(entry.mentioned_topics or [])
                except Exception as e:
                    error_msg = f"Entry {i} ({entry.date_text}): {str(e)}"
                    results["errors"].append(error_msg)
                    logger.error(error_msg)

            logger.info(f"Ingestion complete: {results['entries_stored']}/{results['entries_parsed']} entries, {results['chunks_created']} chunks")

        except Exception as e:
            results["errors"].append(f"Ingestion failed: {str(e)}")
            logger.error(f"Ingestion failed: {str(e)}")

        return results

    def _ensure_author(self, author_name: str):
        """Ensure the author Person node exists."""
        with self.driver.session() as session:
            session.run("""
                MERGE (p:Person {name: $name})
                ON CREATE SET p.created_at = datetime()
            """, name=author_name)
            logger.info(f"Ensured author exists: {author_name}")

    def _store_entry(
        self,
        entry: DiaryEntry,
        author_name: str,
        source_title: str,
        index: int,
        perspective: str = "SELF",
        perspective_subject: str = "ronald_reagan",
        reliability_weight: float = 1.0
    ) -> Tuple[str, int]:
        """
        Store a single diary entry in Neo4j with 20% overlap chunking.

        Creates:
        - DiaryEntry node with text, date, metadata, and PERSPECTIVE
        - DiaryChunk nodes with INHERITED date + perspective metadata (critical for RAG)
        - WROTE relationship from author
        - HAS_CHUNK relationship to chunks
        - MENTIONS relationships to people
        - DISCUSSES relationships to topics
        - ON_DATE relationship to Date node

        Perspective fields prevent Rashomon Effect (AI speaking others' words as own):
        - perspective: SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
        - perspective_subject: Who the content is ABOUT
        - reliability_weight: Trust weight (0.0-1.0)

        Returns:
            Tuple of (entry_hash, chunks_created_count)
        """
        # Generate unique hash for the entry
        entry_hash = hashlib.sha256(
            f"{author_name}:{entry.date_parsed or entry.date_text}:{entry.text[:100]}".encode()
        ).hexdigest()[:16]

        chunks_created = 0

        with self.driver.session() as session:
            # Create the DiaryEntry node (parent record) with perspective
            session.run("""
                MERGE (d:DiaryEntry {entry_hash: $entry_hash})
                ON CREATE SET
                    d.date_text = $date_text,
                    d.date_parsed = $date_parsed,
                    d.year = $year,
                    d.text = $text,
                    d.word_count = $word_count,
                    d.source = $source,
                    d.entry_index = $index,
                    // PERSPECTIVE FIELDS (Rashomon Effect prevention)
                    d.perspective = $perspective,
                    d.perspective_subject = $perspective_subject,
                    d.source_author = $source_author,
                    d.reliability_weight = $reliability_weight,
                    d.created_at = datetime()
                ON MATCH SET
                    d.updated_at = datetime()

                WITH d
                MATCH (author:Person {name: $author_name})
                MERGE (author)-[:WROTE]->(d)
            """,
                entry_hash=entry_hash,
                date_text=entry.date_text,
                date_parsed=entry.date_parsed,
                year=entry.year,
                text=entry.text,
                word_count=entry.word_count,
                source=source_title,
                index=index,
                author_name=author_name,
                # Perspective fields
                perspective=perspective,
                perspective_subject=perspective_subject,
                source_author=author_name,
                reliability_weight=reliability_weight
            )

            # Create Date node and relationship
            if entry.date_parsed:
                session.run("""
                    MERGE (date:Date {value: $date_value})
                    ON CREATE SET
                        date.year = $year,
                        date.display = $date_text
                    WITH date
                    MATCH (d:DiaryEntry {entry_hash: $entry_hash})
                    MERGE (d)-[:ON_DATE]->(date)
                """,
                    date_value=entry.date_parsed,
                    year=entry.year,
                    date_text=entry.date_text,
                    entry_hash=entry_hash
                )

            # Create MENTIONS relationships to people
            for person_name in (entry.mentioned_people or []):
                normalized = self._normalize_person_name(person_name)
                session.run("""
                    MERGE (p:Person {name: $person_name})
                    WITH p
                    MATCH (d:DiaryEntry {entry_hash: $entry_hash})
                    MERGE (d)-[:MENTIONS]->(p)
                """, person_name=normalized, entry_hash=entry_hash)

            # Create DISCUSSES relationships to topics
            for topic in (entry.mentioned_topics or []):
                session.run("""
                    MERGE (t:Topic {name: $topic})
                    WITH t
                    MATCH (d:DiaryEntry {entry_hash: $entry_hash})
                    MERGE (d)-[:DISCUSSES]->(t)
                """, topic=topic, entry_hash=entry_hash)

            # ================================================================
            # 20% OVERLAP CHUNKING - CRITICAL FOR RAG
            # Each chunk INHERITS date metadata from parent DiaryEntry
            # ================================================================
            if self.text_splitter and len(entry.text) > MIN_CHUNK_SIZE:
                # Split into overlapping chunks
                chunks = self.text_splitter.create_documents([entry.text])

                for chunk_idx, chunk in enumerate(chunks):
                    chunk_text = chunk.page_content

                    # Skip very small chunks
                    if len(chunk_text) < MIN_CHUNK_SIZE:
                        continue

                    # Generate chunk hash
                    chunk_hash = hashlib.sha256(
                        f"{entry_hash}:{chunk_idx}:{chunk_text[:50]}".encode()
                    ).hexdigest()[:16]

                    # Generate embedding for chunk (better RAG retrieval)
                    chunk_embedding = None
                    if self.enricher:
                        try:
                            chunk_embedding = self.enricher.generate_embedding(chunk_text)
                        except Exception as e:
                            logger.warning(f"Chunk embedding failed: {e}")

                    # Create DiaryChunk node with INHERITED metadata + perspective
                    # CRITICAL: Chunk inherits WHEN it happened AND WHO said it
                    session.run("""
                        MERGE (c:DiaryChunk {chunk_hash: $chunk_hash})
                        ON CREATE SET
                            c.text = $text,
                            c.chunk_index = $chunk_index,
                            c.total_chunks = $total_chunks,
                            // INHERITED METADATA (critical for RAG context)
                            c.date_text = $date_text,
                            c.date_parsed = $date_parsed,
                            c.year = $year,
                            c.source = $source,
                            c.type = 'personal_reflection',
                            // INHERITED PERSPECTIVE (Rashomon Effect prevention)
                            c.perspective = $perspective,
                            c.perspective_subject = $perspective_subject,
                            c.source_author = $source_author,
                            c.reliability_weight = $reliability_weight,
                            c.created_at = datetime()
                        ON MATCH SET
                            c.updated_at = datetime()

                        WITH c
                        MATCH (d:DiaryEntry {entry_hash: $entry_hash})
                        MERGE (d)-[:HAS_CHUNK]->(c)
                    """,
                        chunk_hash=chunk_hash,
                        text=chunk_text,
                        chunk_index=chunk_idx,
                        total_chunks=len(chunks),
                        date_text=entry.date_text,
                        date_parsed=entry.date_parsed,
                        year=entry.year,
                        source=source_title,
                        entry_hash=entry_hash,
                        # Perspective fields
                        perspective=perspective,
                        perspective_subject=perspective_subject,
                        source_author=author_name,
                        reliability_weight=reliability_weight
                    )

                    # Store chunk embedding
                    if chunk_embedding:
                        session.run("""
                            MATCH (c:DiaryChunk {chunk_hash: $chunk_hash})
                            SET c.embedding = $embedding
                        """, chunk_hash=chunk_hash, embedding=chunk_embedding)

                    chunks_created += 1

                logger.debug(f"Created {chunks_created} chunks for {entry.date_text}")

            else:
                # Entry is short enough - store full text embedding on DiaryEntry
                if self.enricher:
                    try:
                        embedding = self.enricher.generate_embedding(entry.text)
                        session.run("""
                            MATCH (d:DiaryEntry {entry_hash: $entry_hash})
                            SET d.embedding = $embedding
                        """, entry_hash=entry_hash, embedding=embedding)
                    except Exception as e:
                        logger.warning(f"Entry embedding failed: {e}")

        return entry_hash, chunks_created

    def _normalize_person_name(self, name: str) -> str:
        """Normalize person names for consistent graph storage."""
        # Map nicknames/variations to canonical names
        name_map = {
            "Mommy": "Nancy Reagan",
            "Nancy": "Nancy Reagan",
            "Gorbachev": "Mikhail Gorbachev",
            "Mikhail": "Mikhail Gorbachev",
            "Thatcher": "Margaret Thatcher",
            "Margaret Thatcher": "Margaret Thatcher",
            "Bush": "George H.W. Bush",
            "George Bush": "George H.W. Bush",
            "O'Neill": "Tip O'Neill",
            "Tip O'Neill": "Tip O'Neill",
            "Regan": "Don Regan",
            "Don Regan": "Don Regan",
            "Deaver": "Mike Deaver",
            "Mike Deaver": "Mike Deaver",
            "Meese": "Ed Meese",
            "Ed Meese": "Ed Meese",
            "Weinberger": "Cap Weinberger",
            "Cap Weinberger": "Cap Weinberger",
            "Shultz": "George Shultz",
            "George Shultz": "George Shultz",
            "Patti": "Patti Davis",
            "Ron Jr.": "Ron Reagan Jr.",
            "Ron Jr": "Ron Reagan Jr.",
            "Maureen": "Maureen Reagan",
            "Michael": "Michael Reagan"
        }
        return name_map.get(name, name)


def ingest_reagan_diaries_to_neo4j(epub_path: str, neo4j_driver,
                                    openai_api_key: Optional[str] = None) -> Dict:
    """
    Convenience function to ingest The Reagan Diaries into Neo4j.

    Args:
        epub_path: Path to the ePub file
        neo4j_driver: Neo4j driver instance
        openai_api_key: Optional OpenAI API key for embeddings

    Returns:
        Ingestion results dictionary
    """
    ingester = DiaryIngester(neo4j_driver, openai_api_key)
    return ingester.ingest_epub(
        epub_path=epub_path,
        author_name="Ronald Reagan",
        source_title="The Reagan Diaries"
    )


# Query helpers for retrieving diary data

def get_entries_by_date_range(neo4j_driver, start_date: str, end_date: str) -> List[Dict]:
    """Get diary entries within a date range."""
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (d:DiaryEntry)-[:ON_DATE]->(date:Date)
            WHERE date.value >= $start_date AND date.value <= $end_date
            RETURN d.date_text as date, d.text as text,
                   d.word_count as word_count, d.year as year
            ORDER BY date.value
        """, start_date=start_date, end_date=end_date)
        return [dict(record) for record in result]


def get_entries_mentioning_person(neo4j_driver, person_name: str) -> List[Dict]:
    """Get diary entries that mention a specific person."""
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (d:DiaryEntry)-[:MENTIONS]->(p:Person)
            WHERE p.name CONTAINS $person_name
            RETURN d.date_text as date, d.date_parsed as iso_date,
                   d.text as text, p.name as mentioned_person
            ORDER BY d.date_parsed
        """, person_name=person_name)
        return [dict(record) for record in result]


def get_entries_by_topic(neo4j_driver, topic: str) -> List[Dict]:
    """Get diary entries discussing a specific topic."""
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (d:DiaryEntry)-[:DISCUSSES]->(t:Topic {name: $topic})
            RETURN d.date_text as date, d.date_parsed as iso_date,
                   d.text as text, t.name as topic
            ORDER BY d.date_parsed
        """, topic=topic)
        return [dict(record) for record in result]


def get_diary_statistics(neo4j_driver, author_name: str = "Ronald Reagan") -> Dict:
    """Get statistics about the diary entries."""
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (author:Person {name: $author_name})-[:WROTE]->(d:DiaryEntry)
            WITH count(d) as entry_count, sum(d.word_count) as total_words,
                 min(d.year) as first_year, max(d.year) as last_year

            OPTIONAL MATCH (d:DiaryEntry)-[:MENTIONS]->(p:Person)
            WITH entry_count, total_words, first_year, last_year,
                 count(DISTINCT p) as people_mentioned

            OPTIONAL MATCH (d:DiaryEntry)-[:DISCUSSES]->(t:Topic)
            WITH entry_count, total_words, first_year, last_year,
                 people_mentioned, count(DISTINCT t) as topics_covered

            OPTIONAL MATCH (c:DiaryChunk)
            RETURN entry_count, total_words, first_year, last_year,
                   people_mentioned, topics_covered, count(c) as chunks_count
        """, author_name=author_name)

        record = result.single()
        if record:
            return dict(record)
        return {"entry_count": 0, "error": "No entries found"}


# =============================================================================
# RAG CHUNK RETRIEVAL (for semantic search)
# =============================================================================

def get_chunks_by_date_range(neo4j_driver, start_date: str, end_date: str,
                              limit: int = 50) -> List[Dict]:
    """
    Get diary chunks within a date range for RAG retrieval.
    Returns chunks with inherited date metadata.
    """
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (c:DiaryChunk)
            WHERE c.date_parsed >= $start_date AND c.date_parsed <= $end_date
            RETURN c.text as text,
                   c.date_text as date,
                   c.date_parsed as iso_date,
                   c.year as year,
                   c.chunk_index as chunk_index,
                   c.total_chunks as total_chunks,
                   c.source as source
            ORDER BY c.date_parsed, c.chunk_index
            LIMIT $limit
        """, start_date=start_date, end_date=end_date, limit=limit)
        return [dict(record) for record in result]


def search_chunks_by_topic(neo4j_driver, topic: str, limit: int = 20) -> List[Dict]:
    """
    Find diary chunks that discuss a specific topic.
    Traverses DiaryEntry -> DiaryChunk for topic-filtered retrieval.
    """
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (d:DiaryEntry)-[:DISCUSSES]->(t:Topic {name: $topic})
            MATCH (d)-[:HAS_CHUNK]->(c:DiaryChunk)
            RETURN c.text as text,
                   c.date_text as date,
                   c.date_parsed as iso_date,
                   c.year as year,
                   t.name as topic
            ORDER BY c.date_parsed
            LIMIT $limit
        """, topic=topic, limit=limit)
        return [dict(record) for record in result]


def search_chunks_by_person(neo4j_driver, person_name: str, limit: int = 20) -> List[Dict]:
    """
    Find diary chunks from entries that mention a specific person.
    Useful for: "What did Reagan write about Gorbachev?"
    """
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (d:DiaryEntry)-[:MENTIONS]->(p:Person)
            WHERE p.name CONTAINS $person_name
            MATCH (d)-[:HAS_CHUNK]->(c:DiaryChunk)
            RETURN c.text as text,
                   c.date_text as date,
                   c.date_parsed as iso_date,
                   c.year as year,
                   p.name as mentioned_person
            ORDER BY c.date_parsed
            LIMIT $limit
        """, person_name=person_name, limit=limit)
        return [dict(record) for record in result]


def get_chunks_with_embeddings(neo4j_driver, limit: int = 100) -> List[Dict]:
    """
    Get chunks that have embeddings stored (for vector search).
    """
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (c:DiaryChunk)
            WHERE c.embedding IS NOT NULL
            RETURN c.chunk_hash as id,
                   c.text as text,
                   c.date_text as date,
                   c.date_parsed as iso_date,
                   c.year as year,
                   c.embedding as embedding
            ORDER BY c.date_parsed
            LIMIT $limit
        """, limit=limit)
        return [dict(record) for record in result]
