"""
GENESIS Biography Ingestion Pipeline
Semantic chunking, enrichment, and storage for historical documents.

Based on Hello History RAG architecture, enhanced for Constitutional AI.
"""

from .chunking import SemanticChunker, create_sliding_chunks, chunk_biography
from .enrichment import TopicEnricher, EnrichedChunk, enrich_chunk_to_dict
from .biography_ingester import BiographyIngester, IngestionResult, quick_ingest_biography
from .topic_extractor import TopicExtractor, ExtractedQuery, quick_extract, extract_and_query_graph
from .vector_search import VectorSearchService, SearchResult, quick_search, search_with_extraction

# ePub & Diary Ingestion (Reagan Diaries)
from .epub_parser import EpubParser, DiaryEntry, parse_reagan_diaries
from .diary_ingester import (
    DiaryIngester,
    ingest_reagan_diaries_to_neo4j,
    # Entry-level queries
    get_entries_by_date_range,
    get_entries_mentioning_person,
    get_entries_by_topic,
    get_diary_statistics,
    # Chunk-level queries (20% overlap RAG)
    get_chunks_by_date_range,
    search_chunks_by_topic,
    search_chunks_by_person,
    get_chunks_with_embeddings
)

# Multi-Database Ingestion (Firebase + pgvector + Neo4j)
from .multi_database_ingester import (
    MultiDatabaseIngester,
    IngestionConfig,
    ingest_diary_chunks_multi_db,
    ingest_reagan_diaries_complete
)

# Perspective Labels (Rashomon Effect Prevention)
from .perspective import (
    Perspective,
    PerspectiveMetadata,
    PERSPECTIVE_WEIGHTS,
    PERSPECTIVE_PROMPTS,
    KNOWN_SOURCES,
    get_perspective_prompt,
    get_reliability_weight,
    get_known_source,
    infer_perspective_from_title,
    build_perspective_context,
    # Identity Wall Validation (Baby Step 3)
    PerspectiveValidationError,
    validate_chunk_metadata,
    batch_validate_chunks
)

__all__ = [
    # Chunking
    'SemanticChunker',
    'create_sliding_chunks',
    'chunk_biography',
    # Enrichment
    'TopicEnricher',
    'EnrichedChunk',
    'enrich_chunk_to_dict',
    # Ingestion
    'BiographyIngester',
    'IngestionResult',
    'quick_ingest_biography',
    # Topic Extraction
    'TopicExtractor',
    'ExtractedQuery',
    'quick_extract',
    'extract_and_query_graph',
    # Vector Search
    'VectorSearchService',
    'SearchResult',
    'quick_search',
    'search_with_extraction',
    # ePub Parsing
    'EpubParser',
    'DiaryEntry',
    'parse_reagan_diaries',
    # Diary Ingestion
    'DiaryIngester',
    'ingest_reagan_diaries_to_neo4j',
    'get_entries_by_date_range',
    'get_entries_mentioning_person',
    'get_entries_by_topic',
    'get_diary_statistics',
    # Chunk Queries (20% overlap RAG)
    'get_chunks_by_date_range',
    'search_chunks_by_topic',
    'search_chunks_by_person',
    'get_chunks_with_embeddings',
    # Multi-Database Ingestion
    'MultiDatabaseIngester',
    'IngestionConfig',
    'ingest_diary_chunks_multi_db',
    'ingest_reagan_diaries_complete',
    # Perspective Labels (Rashomon Effect Prevention)
    'Perspective',
    'PerspectiveMetadata',
    'PERSPECTIVE_WEIGHTS',
    'PERSPECTIVE_PROMPTS',
    'KNOWN_SOURCES',
    'get_perspective_prompt',
    'get_reliability_weight',
    'get_known_source',
    'infer_perspective_from_title',
    'build_perspective_context',
    # Identity Wall Validation
    'PerspectiveValidationError',
    'validate_chunk_metadata',
    'batch_validate_chunks'
]
