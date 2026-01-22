"""
Vector Similarity Search for GENESIS Biography RAG

Performs semantic search against pgvector to retrieve relevant biography chunks
for context injection into LLM prompts.

Features:
- Semantic similarity search using OpenAI embeddings
- Profile-filtered search
- Topic/sentiment filtering
- Hybrid search (vector + metadata)
"""

import os
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class SearchResult:
    """A single search result from vector search"""
    chunk_id: int
    profile_id: str
    profile_name: str
    content: str
    similarity: float
    topics: List[str]
    sentiment: str
    entities: List[str]
    constitutional_themes: List[str]
    metadata: Dict


class VectorSearchService:
    """
    Semantic search against pgvector for biography chunks.

    Usage:
        service = VectorSearchService(postgres_connection, openai_api_key)
        results = service.search("How did Reagan handle the Cold War?",
                                 profile_id="historical_ronald_reagan")
    """

    def __init__(
        self,
        postgres_connection: str = None,
        openai_api_key: str = None,
        embedding_model: str = "text-embedding-3-small"
    ):
        """
        Initialize vector search service.

        Args:
            postgres_connection: PostgreSQL connection string (or use DATABASE_URL env)
            openai_api_key: OpenAI API key (or use OPENAI_API_KEY env)
            embedding_model: OpenAI embedding model to use
        """
        self.postgres_connection = postgres_connection or os.environ.get("DATABASE_URL")
        self.openai_api_key = openai_api_key or os.environ.get("OPENAI_API_KEY")
        self.embedding_model = embedding_model
        self._pg_conn = None
        self._openai_client = None

    def _get_pg_connection(self):
        """Lazy load PostgreSQL connection"""
        if self._pg_conn is None and self.postgres_connection:
            try:
                import psycopg2
                self._pg_conn = psycopg2.connect(self.postgres_connection)
            except ImportError:
                logger.error("psycopg2 not installed")
            except Exception as e:
                logger.error(f"PostgreSQL connection failed: {e}")
        return self._pg_conn

    def _get_openai_client(self):
        """Lazy load OpenAI client"""
        if self._openai_client is None and self.openai_api_key:
            try:
                from openai import OpenAI
                self._openai_client = OpenAI(api_key=self.openai_api_key)
            except ImportError:
                logger.error("OpenAI package not installed")
        return self._openai_client

    def _get_embedding(self, text: str) -> List[float]:
        """Generate embedding for search query"""
        client = self._get_openai_client()
        if not client:
            raise ValueError("OpenAI client not available")

        response = client.embeddings.create(
            model=self.embedding_model,
            input=text
        )
        return response.data[0].embedding

    def search(
        self,
        query: str,
        profile_id: str = None,
        topics: List[str] = None,
        sentiment: str = None,
        limit: int = 5,
        similarity_threshold: float = 0.7
    ) -> List[SearchResult]:
        """
        Semantic search for relevant biography chunks.

        Args:
            query: Search query text
            profile_id: Filter to specific profile
            topics: Filter to chunks with specific topics
            sentiment: Filter by sentiment
            limit: Maximum results to return
            similarity_threshold: Minimum similarity score (0-1)

        Returns:
            List of SearchResult ordered by similarity
        """
        conn = self._get_pg_connection()
        if not conn:
            logger.warning("No database connection, returning empty results")
            return []

        # Generate query embedding
        query_embedding = self._get_embedding(query)

        # Build SQL query with filters
        sql = """
            SELECT
                id,
                profile_id,
                profile_name,
                content,
                1 - (embedding <=> %s::vector) as similarity,
                topics,
                sentiment,
                entities,
                constitutional_themes,
                metadata
            FROM biography_chunks
            WHERE 1 - (embedding <=> %s::vector) > %s
        """
        params = [query_embedding, query_embedding, similarity_threshold]

        # Add profile filter
        if profile_id:
            sql += " AND profile_id = %s"
            params.append(profile_id)

        # Add topic filter (any match)
        if topics:
            sql += " AND topics && %s"
            params.append(topics)

        # Add sentiment filter
        if sentiment:
            sql += " AND sentiment = %s"
            params.append(sentiment)

        # Order by similarity and limit
        sql += " ORDER BY similarity DESC LIMIT %s"
        params.append(limit)

        try:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            cursor.close()

            results = []
            for row in rows:
                results.append(SearchResult(
                    chunk_id=row[0],
                    profile_id=row[1],
                    profile_name=row[2],
                    content=row[3],
                    similarity=float(row[4]),
                    topics=row[5] or [],
                    sentiment=row[6],
                    entities=row[7] or [],
                    constitutional_themes=row[8] or [],
                    metadata=row[9] or {}
                ))

            return results

        except Exception as e:
            logger.error(f"Search query failed: {e}")
            return []

    def search_hybrid(
        self,
        query: str,
        extracted_topics: List[str] = None,
        extracted_entities: List[str] = None,
        profile_id: str = None,
        limit: int = 5
    ) -> List[SearchResult]:
        """
        Hybrid search combining vector similarity with metadata matching.

        Boosts results that match extracted topics/entities.

        Args:
            query: Search query text
            extracted_topics: Topics extracted from query
            extracted_entities: Entities extracted from query
            profile_id: Filter to specific profile
            limit: Maximum results to return

        Returns:
            List of SearchResult with boosted relevance
        """
        conn = self._get_pg_connection()
        if not conn:
            return []

        query_embedding = self._get_embedding(query)

        # Hybrid scoring: vector similarity + topic/entity bonus
        sql = """
            WITH vector_scores AS (
                SELECT
                    id,
                    profile_id,
                    profile_name,
                    content,
                    1 - (embedding <=> %s::vector) as vector_sim,
                    topics,
                    sentiment,
                    entities,
                    constitutional_themes,
                    metadata
                FROM biography_chunks
                WHERE 1 - (embedding <=> %s::vector) > 0.5
        """
        params = [query_embedding, query_embedding]

        if profile_id:
            sql += " AND profile_id = %s"
            params.append(profile_id)

        sql += """
            )
            SELECT
                id,
                profile_id,
                profile_name,
                content,
                vector_sim +
                    COALESCE(0.1 * array_length(array(SELECT unnest(topics) INTERSECT SELECT unnest(%s::text[])), 1), 0) +
                    COALESCE(0.15 * array_length(array(SELECT unnest(entities) INTERSECT SELECT unnest(%s::text[])), 1), 0)
                    as combined_score,
                topics,
                sentiment,
                entities,
                constitutional_themes,
                metadata
            FROM vector_scores
            ORDER BY combined_score DESC
            LIMIT %s
        """
        params.extend([extracted_topics or [], extracted_entities or [], limit])

        try:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            cursor.close()

            results = []
            for row in rows:
                results.append(SearchResult(
                    chunk_id=row[0],
                    profile_id=row[1],
                    profile_name=row[2],
                    content=row[3],
                    similarity=float(row[4]),
                    topics=row[5] or [],
                    sentiment=row[6],
                    entities=row[7] or [],
                    constitutional_themes=row[8] or [],
                    metadata=row[9] or {}
                ))

            return results

        except Exception as e:
            logger.error(f"Hybrid search failed: {e}")
            return []

    def format_for_prompt(self, results: List[SearchResult], max_tokens: int = 2000) -> str:
        """
        Format search results for injection into LLM prompt.

        Args:
            results: List of search results
            max_tokens: Approximate max token budget

        Returns:
            Formatted context string
        """
        if not results:
            return ""

        lines = ["[RELEVANT BIOGRAPHY PASSAGES]", ""]
        char_budget = max_tokens * 4  # ~4 chars per token
        current_chars = 0

        for i, result in enumerate(results, 1):
            passage = f"[{i}] {result.profile_name}"
            if result.topics:
                passage += f" | Topics: {', '.join(result.topics[:3])}"
            if result.sentiment:
                passage += f" | Tone: {result.sentiment}"
            passage += f"\n\"{result.content}\""
            passage += f"\n(Relevance: {result.similarity:.0%})\n"

            if current_chars + len(passage) > char_budget:
                break

            lines.append(passage)
            current_chars += len(passage)

        # Add constitutional themes if present
        all_themes = set()
        for result in results:
            all_themes.update(result.constitutional_themes)

        if all_themes:
            lines.append(f"\nCONSTITUTIONAL THEMES: {', '.join(list(all_themes)[:5])}")

        return "\n".join(lines)

    def close(self):
        """Close database connection"""
        if self._pg_conn:
            self._pg_conn.close()
            self._pg_conn = None


# Convenience function for quick search
def quick_search(
    query: str,
    profile_id: str = None,
    limit: int = 5
) -> str:
    """
    Quick semantic search returning formatted context.

    Args:
        query: Search query
        profile_id: Optional profile filter
        limit: Max results

    Returns:
        Formatted context string for prompt injection
    """
    service = VectorSearchService()
    results = service.search(query, profile_id=profile_id, limit=limit)
    formatted = service.format_for_prompt(results)
    service.close()
    return formatted


# Combined search with topic extraction
def search_with_extraction(
    query: str,
    profile_id: str = None,
    limit: int = 5
) -> Tuple[str, Dict]:
    """
    Extract topics from query and perform hybrid search.

    Args:
        query: User query
        profile_id: Optional profile filter
        limit: Max results

    Returns:
        Tuple of (formatted_context, extraction_info)
    """
    from .topic_extractor import TopicExtractor

    # Extract topics and entities
    extractor = TopicExtractor(use_ai=False)
    extracted = extractor.extract(query)

    # Hybrid search
    service = VectorSearchService()
    results = service.search_hybrid(
        query=query,
        extracted_topics=extracted.topics,
        extracted_entities=extracted.entities,
        profile_id=profile_id,
        limit=limit
    )
    formatted = service.format_for_prompt(results)
    service.close()

    return formatted, {
        'topics': extracted.topics,
        'entities': extracted.entities,
        'themes': extracted.themes,
        'intent': extracted.intent
    }
