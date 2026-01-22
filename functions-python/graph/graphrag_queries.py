"""
GraphRAG Queries for GENESIS

Advanced Cypher queries for surfacing hidden connections and context from Neo4j.
Based on Gemini's Hello History GraphRAG patterns.

Features:
- Topic-based retrieval across profiles
- Timeline queries (how opinions evolved)
- Hidden connection discovery (who talks about whom)
- Constitutional theme analysis
- Relationship dynamic patterns
"""

import os
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from neo4j import GraphDatabase

logger = logging.getLogger(__name__)


@dataclass
class GraphContext:
    """Context retrieved from the graph for RAG"""
    chunks: List[Dict]
    entities_mentioned: List[str]
    themes_found: List[str]
    timeline: List[Dict]
    connections: List[Dict]
    summary: str


class GraphRAGService:
    """
    GraphRAG Query Service for GENESIS.

    Provides structured context retrieval from Neo4j to augment
    vector search results with relationship-aware insights.
    """

    def __init__(
        self,
        uri: str = None,
        user: str = None,
        password: str = None
    ):
        """
        Initialize GraphRAG service.

        Uses environment variables if not provided:
        - NEO4J_URI
        - NEO4J_USER
        - NEO4J_PASSWORD
        """
        self.uri = uri or os.environ.get("NEO4J_URI")
        self.user = user or os.environ.get("NEO4J_USER", "neo4j")
        self.password = password or os.environ.get("NEO4J_PASSWORD")

        self._driver = None

    def _get_driver(self):
        """Lazy load Neo4j driver"""
        if self._driver is None and self.uri:
            try:
                self._driver = GraphDatabase.driver(
                    self.uri,
                    auth=(self.user, self.password)
                )
            except Exception as e:
                logger.error(f"Failed to connect to Neo4j: {e}")
        return self._driver

    def close(self):
        """Close the driver connection"""
        if self._driver:
            self._driver.close()

    # =========================================================================
    # TOPIC-BASED RETRIEVAL
    # =========================================================================

    def get_topic_context(
        self,
        topic_name: str,
        profile_id: str = None,
        limit: int = 5
    ) -> List[Dict]:
        """
        Get all chunks discussing a specific topic.

        Args:
            topic_name: Topic to search for (e.g., "loyalty", "leadership")
            profile_id: Optional filter to specific profile
            limit: Maximum chunks to return

        Returns:
            List of chunks with speaker, year, and related context
        """
        driver = self._get_driver()
        if not driver:
            return []

        if profile_id:
            query = """
            MATCH (t:Topic {name: $topic})<-[:DISCUSSES]-(c:BiographyChunk)<-[:HAS_BIOGRAPHY_CHUNK]-(p:GuestProfile)
            WHERE p.profile_id = $profile_id
            OPTIONAL MATCH (c)-[:MENTIONS]->(e:Entity)
            OPTIONAL MATCH (c)-[:EXPRESSES]->(th:ConstitutionalTheme)
            RETURN
                p.name AS speaker,
                c.text AS quote,
                c.sentiment AS sentiment,
                c.chunk_index AS chunk_index,
                collect(DISTINCT e.name) AS entities,
                collect(DISTINCT th.name) AS themes
            ORDER BY c.chunk_index ASC
            LIMIT $limit
            """
        else:
            query = """
            MATCH (t:Topic {name: $topic})<-[:DISCUSSES]-(c:BiographyChunk)<-[:HAS_BIOGRAPHY_CHUNK]-(p:GuestProfile)
            OPTIONAL MATCH (c)-[:MENTIONS]->(e:Entity)
            OPTIONAL MATCH (c)-[:EXPRESSES]->(th:ConstitutionalTheme)
            RETURN
                p.name AS speaker,
                p.profile_id AS profile_id,
                c.text AS quote,
                c.sentiment AS sentiment,
                c.chunk_index AS chunk_index,
                collect(DISTINCT e.name) AS entities,
                collect(DISTINCT th.name) AS themes
            ORDER BY p.name, c.chunk_index ASC
            LIMIT $limit
            """

        with driver.session() as session:
            result = session.run(
                query,
                topic=topic_name.lower(),
                profile_id=profile_id,
                limit=limit
            )
            return [dict(record) for record in result]

    def get_theme_context(
        self,
        theme_name: str,
        limit: int = 10
    ) -> List[Dict]:
        """
        Get chunks expressing a constitutional theme.

        Args:
            theme_name: Theme to search (e.g., "devotion", "protection")
            limit: Maximum chunks to return

        Returns:
            List of chunks with speaker and related dynamics
        """
        driver = self._get_driver()
        if not driver:
            return []

        query = """
        MATCH (th:ConstitutionalTheme {name: $theme})<-[:EXPRESSES]-(c:BiographyChunk)<-[:HAS_BIOGRAPHY_CHUNK]-(p:GuestProfile)
        OPTIONAL MATCH (c)-[:DEMONSTRATES]->(d:RelationshipDynamic)
        RETURN
            p.name AS speaker,
            p.profile_id AS profile_id,
            c.text AS quote,
            c.sentiment AS sentiment,
            collect(DISTINCT d.name) AS dynamics
        ORDER BY p.name
        LIMIT $limit
        """

        with driver.session() as session:
            result = session.run(query, theme=theme_name.lower(), limit=limit)
            return [dict(record) for record in result]

    # =========================================================================
    # HIDDEN CONNECTION DISCOVERY
    # =========================================================================

    def find_entity_connections(
        self,
        entity_name: str,
        limit: int = 10
    ) -> List[Dict]:
        """
        Find all profiles that mention a specific entity.

        Example: "Who mentions Nancy Reagan?"

        Args:
            entity_name: Entity to search for
            limit: Maximum results

        Returns:
            List of profiles and their mentions
        """
        driver = self._get_driver()
        if not driver:
            return []

        query = """
        MATCH (e:Entity)<-[:MENTIONS]-(c:BiographyChunk)<-[:HAS_BIOGRAPHY_CHUNK]-(p:GuestProfile)
        WHERE toLower(e.name) CONTAINS toLower($entity)
        RETURN
            p.name AS speaker,
            p.profile_id AS profile_id,
            e.name AS entity_mentioned,
            c.sentiment AS sentiment,
            c.text AS quote,
            count(*) AS mention_count
        ORDER BY mention_count DESC
        LIMIT $limit
        """

        with driver.session() as session:
            result = session.run(query, entity=entity_name, limit=limit)
            return [dict(record) for record in result]

    def find_sentiment_patterns(
        self,
        profile_id: str,
        entity_name: str = None
    ) -> Dict:
        """
        Analyze sentiment patterns for a profile.

        Example: "What does Reagan say when angry?" or
                 "How does Reagan feel about Gorbachev?"

        Args:
            profile_id: Profile to analyze
            entity_name: Optional entity filter

        Returns:
            Sentiment distribution and examples
        """
        driver = self._get_driver()
        if not driver:
            return {}

        if entity_name:
            query = """
            MATCH (p:GuestProfile {profile_id: $profile_id})-[:HAS_BIOGRAPHY_CHUNK]->(c:BiographyChunk)-[:MENTIONS]->(e:Entity)
            WHERE toLower(e.name) CONTAINS toLower($entity)
            WITH c.sentiment AS sentiment, c.text AS quote, e.name AS entity
            RETURN
                sentiment,
                count(*) AS count,
                collect(quote)[0..3] AS sample_quotes
            ORDER BY count DESC
            """
            params = {"profile_id": profile_id, "entity": entity_name}
        else:
            query = """
            MATCH (p:GuestProfile {profile_id: $profile_id})-[:HAS_BIOGRAPHY_CHUNK]->(c:BiographyChunk)
            WITH c.sentiment AS sentiment, c.text AS quote
            RETURN
                sentiment,
                count(*) AS count,
                collect(quote)[0..3] AS sample_quotes
            ORDER BY count DESC
            """
            params = {"profile_id": profile_id}

        with driver.session() as session:
            result = session.run(query, **params)
            patterns = {}
            for record in result:
                patterns[record["sentiment"]] = {
                    "count": record["count"],
                    "samples": record["sample_quotes"]
                }
            return patterns

    def find_shared_themes(
        self,
        profile_id_1: str,
        profile_id_2: str
    ) -> Dict:
        """
        Find constitutional themes shared between two profiles.

        Useful for couple compatibility analysis.

        Args:
            profile_id_1: First profile
            profile_id_2: Second profile

        Returns:
            Shared themes and unique themes for each
        """
        driver = self._get_driver()
        if not driver:
            return {}

        query = """
        // Get themes for profile 1
        MATCH (p1:GuestProfile {profile_id: $profile1})-[:HAS_BIOGRAPHY_CHUNK]->(c1:BiographyChunk)-[:EXPRESSES]->(th1:ConstitutionalTheme)
        WITH collect(DISTINCT th1.name) AS themes1

        // Get themes for profile 2
        MATCH (p2:GuestProfile {profile_id: $profile2})-[:HAS_BIOGRAPHY_CHUNK]->(c2:BiographyChunk)-[:EXPRESSES]->(th2:ConstitutionalTheme)
        WITH themes1, collect(DISTINCT th2.name) AS themes2

        // Calculate intersection and differences
        RETURN
            [x IN themes1 WHERE x IN themes2] AS shared_themes,
            [x IN themes1 WHERE NOT x IN themes2] AS unique_to_profile1,
            [x IN themes2 WHERE NOT x IN themes1] AS unique_to_profile2
        """

        with driver.session() as session:
            result = session.run(
                query,
                profile1=profile_id_1,
                profile2=profile_id_2
            )
            record = result.single()
            if record:
                return {
                    "shared_themes": record["shared_themes"],
                    "unique_to_profile1": record["unique_to_profile1"],
                    "unique_to_profile2": record["unique_to_profile2"]
                }
            return {}

    # =========================================================================
    # RELATIONSHIP NETWORK QUERIES
    # =========================================================================

    def get_relationship_network(
        self,
        profile_id: str,
        depth: int = 2
    ) -> Dict:
        """
        Get the relationship network around a profile.

        Shows connections through:
        - Direct relationships (MARRIED_TO, etc.)
        - Shared entities (both mention same person)
        - Shared themes

        Args:
            profile_id: Center profile
            depth: How many hops to traverse

        Returns:
            Network of connected profiles with relationship types
        """
        driver = self._get_driver()
        if not driver:
            return {}

        query = """
        MATCH (center:GuestProfile {profile_id: $profile_id})

        // Direct relationships
        OPTIONAL MATCH (center)-[r1:MARRIED_TO|PARTNER_OF|ALLIED_WITH|OPPOSED_TO]-(direct:GuestProfile)

        // Shared entity connections
        OPTIONAL MATCH (center)-[:HAS_BIOGRAPHY_CHUNK]->(:BiographyChunk)-[:MENTIONS]->(e:Entity)<-[:MENTIONS]-(:BiographyChunk)<-[:HAS_BIOGRAPHY_CHUNK]-(shared_entity:GuestProfile)
        WHERE shared_entity <> center

        // Shared theme connections
        OPTIONAL MATCH (center)-[:HAS_BIOGRAPHY_CHUNK]->(:BiographyChunk)-[:EXPRESSES]->(th:ConstitutionalTheme)<-[:EXPRESSES]-(:BiographyChunk)<-[:HAS_BIOGRAPHY_CHUNK]-(shared_theme:GuestProfile)
        WHERE shared_theme <> center

        RETURN
            center.name AS center_name,
            collect(DISTINCT {
                profile: direct.name,
                profile_id: direct.profile_id,
                relationship: type(r1)
            }) AS direct_connections,
            collect(DISTINCT {
                profile: shared_entity.name,
                profile_id: shared_entity.profile_id,
                shared_via: 'entity'
            }) AS entity_connections,
            collect(DISTINCT {
                profile: shared_theme.name,
                profile_id: shared_theme.profile_id,
                shared_via: 'theme'
            }) AS theme_connections
        """

        with driver.session() as session:
            result = session.run(query, profile_id=profile_id)
            record = result.single()
            if record:
                return {
                    "center": record["center_name"],
                    "direct_connections": [c for c in record["direct_connections"] if c["profile"]],
                    "entity_connections": [c for c in record["entity_connections"] if c["profile"]],
                    "theme_connections": [c for c in record["theme_connections"] if c["profile"]]
                }
            return {}

    def find_couple_dynamics(
        self,
        couple_profile_id: str
    ) -> Dict:
        """
        Analyze relationship dynamics for a couple profile.

        Returns themes, patterns, and teaching points from their biography chunks.

        Args:
            couple_profile_id: Couple profile ID (e.g., "couple_ronald_nancy_reagan")

        Returns:
            Analysis of their relationship patterns
        """
        driver = self._get_driver()
        if not driver:
            return {}

        query = """
        // Find the couple's individual profiles
        MATCH (couple:CoupleProfile {profile_id: $couple_id})-[:PARTNER_OF]->(p:GuestProfile)

        // Get their biography chunks and dynamics
        MATCH (p)-[:HAS_BIOGRAPHY_CHUNK]->(c:BiographyChunk)
        OPTIONAL MATCH (c)-[:DEMONSTRATES]->(d:RelationshipDynamic)
        OPTIONAL MATCH (c)-[:EXPRESSES]->(th:ConstitutionalTheme)

        WITH p,
             collect(DISTINCT d.name) AS dynamics,
             collect(DISTINCT th.name) AS themes,
             collect({text: c.text, sentiment: c.sentiment})[0..5] AS sample_chunks

        RETURN
            p.name AS partner_name,
            p.profile_id AS partner_id,
            dynamics,
            themes,
            sample_chunks
        """

        with driver.session() as session:
            result = session.run(query, couple_id=couple_profile_id)
            partners = []
            for record in result:
                partners.append({
                    "name": record["partner_name"],
                    "profile_id": record["partner_id"],
                    "dynamics": record["dynamics"],
                    "themes": record["themes"],
                    "samples": record["sample_chunks"]
                })

            # Find shared dynamics
            if len(partners) == 2:
                shared_dynamics = set(partners[0]["dynamics"]) & set(partners[1]["dynamics"])
                shared_themes = set(partners[0]["themes"]) & set(partners[1]["themes"])
            else:
                shared_dynamics = set()
                shared_themes = set()

            return {
                "partners": partners,
                "shared_dynamics": list(shared_dynamics),
                "shared_themes": list(shared_themes)
            }

    # =========================================================================
    # TIMELINE QUERIES
    # =========================================================================

    def get_topic_timeline(
        self,
        topic_name: str,
        profile_id: str = None
    ) -> List[Dict]:
        """
        Get chronological mentions of a topic.

        Useful for: "How did Reagan's view on communism evolve?"

        Args:
            topic_name: Topic to track
            profile_id: Optional filter to specific profile

        Returns:
            Chronological list of mentions with context
        """
        driver = self._get_driver()
        if not driver:
            return []

        query = """
        MATCH (t:Topic)<-[:DISCUSSES]-(c:BiographyChunk)<-[:HAS_BIOGRAPHY_CHUNK]-(p:GuestProfile)
        WHERE toLower(t.name) CONTAINS toLower($topic)
        """ + ("""AND p.profile_id = $profile_id""" if profile_id else "") + """
        WITH p, c, t
        ORDER BY c.chunk_index ASC
        RETURN
            p.name AS speaker,
            t.name AS topic,
            c.chunk_index AS sequence,
            c.sentiment AS sentiment,
            c.text AS quote
        LIMIT 20
        """

        with driver.session() as session:
            result = session.run(
                query,
                topic=topic_name,
                profile_id=profile_id
            )
            return [dict(record) for record in result]

    # =========================================================================
    # CONTEXT AGGREGATION FOR RAG
    # =========================================================================

    def get_rag_context(
        self,
        query_topics: List[str],
        query_entities: List[str] = None,
        profile_id: str = None,
        max_chunks: int = 5
    ) -> GraphContext:
        """
        Get comprehensive context for RAG augmentation.

        Combines topic, entity, and theme-based retrieval into
        a structured context object for the LLM.

        Args:
            query_topics: Topics extracted from user query
            query_entities: Entities extracted from user query
            profile_id: Optional filter to specific profile
            max_chunks: Maximum chunks to retrieve

        Returns:
            GraphContext with structured information
        """
        chunks = []
        entities_mentioned = set()
        themes_found = set()
        connections = []

        # Get topic-based chunks
        for topic in query_topics:
            topic_results = self.get_topic_context(
                topic,
                profile_id=profile_id,
                limit=max_chunks
            )
            for r in topic_results:
                chunks.append({
                    "source": "topic",
                    "topic": topic,
                    "speaker": r.get("speaker"),
                    "quote": r.get("quote"),
                    "sentiment": r.get("sentiment")
                })
                entities_mentioned.update(r.get("entities", []))
                themes_found.update(r.get("themes", []))

        # Get entity-based connections
        if query_entities:
            for entity in query_entities:
                entity_results = self.find_entity_connections(
                    entity,
                    limit=3
                )
                for r in entity_results:
                    connections.append({
                        "entity": entity,
                        "mentioned_by": r.get("speaker"),
                        "sentiment": r.get("sentiment")
                    })

        # Get timeline if specific profile
        timeline = []
        if profile_id and query_topics:
            timeline = self.get_topic_timeline(
                query_topics[0],
                profile_id=profile_id
            )

        # Build summary
        summary_parts = []
        if chunks:
            summary_parts.append(f"Found {len(chunks)} relevant passages")
        if themes_found:
            summary_parts.append(f"Themes: {', '.join(list(themes_found)[:5])}")
        if connections:
            summary_parts.append(f"Connected to {len(connections)} entities")

        return GraphContext(
            chunks=chunks[:max_chunks],
            entities_mentioned=list(entities_mentioned),
            themes_found=list(themes_found),
            timeline=timeline[:10],
            connections=connections,
            summary=". ".join(summary_parts) if summary_parts else "No context found"
        )

    def format_context_for_prompt(self, context: GraphContext) -> str:
        """
        Format GraphContext into a string for LLM prompt injection.

        Args:
            context: GraphContext from get_rag_context()

        Returns:
            Formatted string for system prompt
        """
        lines = ["[GRAPH CONTEXT FROM NEO4J]", ""]

        if context.chunks:
            lines.append("RELEVANT PASSAGES:")
            for i, chunk in enumerate(context.chunks, 1):
                lines.append(f"\n[{i}] Speaker: {chunk.get('speaker', 'Unknown')}")
                lines.append(f"    Topic: {chunk.get('topic', 'N/A')}")
                lines.append(f"    Sentiment: {chunk.get('sentiment', 'N/A')}")
                lines.append(f"    Quote: \"{chunk.get('quote', '')[:500]}...\"")

        if context.themes_found:
            lines.append(f"\nCONSTITUTIONAL THEMES: {', '.join(context.themes_found)}")

        if context.connections:
            lines.append("\nENTITY CONNECTIONS:")
            for conn in context.connections[:5]:
                lines.append(f"  - {conn.get('entity')} mentioned by {conn.get('mentioned_by')} ({conn.get('sentiment')})")

        if context.timeline:
            lines.append("\nTIMELINE:")
            for entry in context.timeline[:5]:
                lines.append(f"  [{entry.get('sequence')}] {entry.get('speaker')}: \"{entry.get('quote', '')[:100]}...\"")

        lines.append(f"\nSUMMARY: {context.summary}")
        lines.append("")

        return "\n".join(lines)


# Convenience functions
def get_topic_context_formatted(
    topic: str,
    profile_id: str = None
) -> str:
    """
    Quick helper to get formatted topic context.

    Uses environment variables for Neo4j connection.
    """
    service = GraphRAGService()
    context = service.get_rag_context(
        query_topics=[topic],
        profile_id=profile_id
    )
    formatted = service.format_context_for_prompt(context)
    service.close()
    return formatted
