"""
Graph endpoints — Neo4j graph operations, GraphRAG retrieval, and graph seeding.

Endpoints:
  - find_soul_family
  - calculate_synastry
  - store_profile_node
  - graphrag_context
  - graphrag_topic_context
  - graphrag_entity_connections
  - graphrag_sentiment_patterns
  - graphrag_shared_themes
  - graphrag_timeline
  - seed_reagan_universe
  - query_person_relationships
"""

from firebase_functions import https_fn, options
import json
import os
from datetime import datetime

from astro.calculator import SwissEphemerisCalculator
from routes.shared import (
    NEO4J_URI_SECRET,
    NEO4J_PASSWORD_SECRET,
    OPENAI_API_KEY_SECRET,
    get_neo4j_service,
    get_graphrag_service,
)


# =============================================================================
# NEO4J GRAPH ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def find_soul_family(req: https_fn.Request) -> https_fn.Response:
    """
    Find Soul Family connections using Neo4j graph queries

    POST body:
    {
        "userId": "user123",
        "elementalProfile": {
            "fire": 25,
            "earth": 30,
            "air": 20,
            "water": 25
        },
        "limit": 10
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        neo4j_service = get_neo4j_service()
        matches = neo4j_service.find_soul_family(
            user_id=data.get("userId"),
            elemental_profile=data.get("elementalProfile", {}),
            limit=data.get("limit", 10)
        )
        neo4j_service.close()

        return https_fn.Response(
            json.dumps(matches),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def calculate_synastry(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate synastry (compatibility) between two natal charts

    POST body:
    {
        "chart1": { ... natal chart data ... },
        "chart2": { ... natal chart data ... }
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        calculator = SwissEphemerisCalculator()
        synastry = calculator.calculate_synastry(
            chart1=data.get("chart1", {}),
            chart2=data.get("chart2", {})
        )

        return https_fn.Response(
            json.dumps(synastry),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def store_profile_node(req: https_fn.Request) -> https_fn.Response:
    """
    Store a user profile as a node in Neo4j graph

    POST body:
    {
        "userId": "user123",
        "profile": {
            "sunSign": "Taurus",
            "moonSign": "Cancer",
            "risingSign": "Leo",
            "elements": { "fire": 25, "earth": 30, "air": 20, "water": 25 }
        }
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        neo4j_service = get_neo4j_service()
        result = neo4j_service.create_profile_node(
            user_id=data.get("userId"),
            profile=data.get("profile", {})
        )
        neo4j_service.close()

        return https_fn.Response(
            json.dumps(result),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# GRAPHRAG ENDPOINTS (Hello History Pattern)
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_context(req: https_fn.Request) -> https_fn.Response:
    """
    Get comprehensive GraphRAG context for RAG augmentation.

    Combines topic-based, entity-based, and theme-based retrieval
    into structured context for LLM prompt injection.

    POST body:
    {
        "topics": ["loyalty", "leadership"],
        "entities": ["Nancy Reagan", "Gorbachev"],
        "profileId": "historical_ronald_reagan",
        "maxChunks": 5,
        "includeTimeline": true,
        "includeConnections": true
    }

    Returns:
    {
        "context": {
            "chunks": [...],
            "entities_mentioned": [...],
            "themes_found": [...],
            "timeline": [...],
            "connections": [...],
            "summary": "..."
        },
        "formatted": "... formatted string for prompt injection ..."
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        topics = data.get("topics", [])
        entities = data.get("entities", [])
        profile_id = data.get("profileId")
        max_chunks = data.get("maxChunks", 5)

        if not topics and not entities:
            return https_fn.Response(
                json.dumps({"error": "Must provide at least one topic or entity"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()

        # Get comprehensive RAG context
        context = service.get_rag_context(
            query_topics=topics,
            query_entities=entities,
            profile_id=profile_id,
            max_chunks=max_chunks
        )

        # Format for prompt injection
        formatted = service.format_context_for_prompt(context)

        service.close()

        return https_fn.Response(
            json.dumps({
                "context": {
                    "chunks": context.chunks,
                    "entities_mentioned": context.entities_mentioned,
                    "themes_found": context.themes_found,
                    "timeline": context.timeline if data.get("includeTimeline", True) else [],
                    "connections": context.connections if data.get("includeConnections", True) else [],
                    "summary": context.summary
                },
                "formatted": formatted
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_topic_context(req: https_fn.Request) -> https_fn.Response:
    """
    Get chunks discussing a specific topic.

    POST body:
    {
        "topic": "leadership",
        "profileId": "historical_ronald_reagan",
        "limit": 5
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        topic = data.get("topic")

        if not topic:
            return https_fn.Response(
                json.dumps({"error": "topic is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        results = service.get_topic_context(
            topic_name=topic,
            profile_id=data.get("profileId"),
            limit=data.get("limit", 5)
        )
        service.close()

        return https_fn.Response(
            json.dumps({"results": results}),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_entity_connections(req: https_fn.Request) -> https_fn.Response:
    """
    Find all profiles that mention a specific entity.

    Example: "Who mentions Nancy Reagan?"

    POST body:
    {
        "entity": "Nancy Reagan",
        "limit": 10
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        entity = data.get("entity")

        if not entity:
            return https_fn.Response(
                json.dumps({"error": "entity is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        results = service.find_entity_connections(
            entity_name=entity,
            limit=data.get("limit", 10)
        )
        service.close()

        return https_fn.Response(
            json.dumps({"connections": results}),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_sentiment_patterns(req: https_fn.Request) -> https_fn.Response:
    """
    Analyze sentiment patterns for a profile.

    Example: "What does Reagan say when angry?" or
             "How does Reagan feel about Gorbachev?"

    POST body:
    {
        "profileId": "historical_ronald_reagan",
        "entity": "Gorbachev"  // Optional
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        profile_id = data.get("profileId")

        if not profile_id:
            return https_fn.Response(
                json.dumps({"error": "profileId is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        patterns = service.find_sentiment_patterns(
            profile_id=profile_id,
            entity_name=data.get("entity")
        )
        service.close()

        return https_fn.Response(
            json.dumps({"patterns": patterns}),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_shared_themes(req: https_fn.Request) -> https_fn.Response:
    """
    Find constitutional themes shared between two profiles.

    Useful for couple compatibility analysis.

    POST body:
    {
        "profileId1": "historical_ronald_reagan",
        "profileId2": "historical_nancy_reagan"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        profile_id_1 = data.get("profileId1")
        profile_id_2 = data.get("profileId2")

        if not profile_id_1 or not profile_id_2:
            return https_fn.Response(
                json.dumps({"error": "profileId1 and profileId2 are required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        themes = service.find_shared_themes(profile_id_1, profile_id_2)
        service.close()

        return https_fn.Response(
            json.dumps(themes),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_timeline(req: https_fn.Request) -> https_fn.Response:
    """
    Get chronological mentions of a topic.

    Useful for: "How did Reagan's view on communism evolve?"

    POST body:
    {
        "topic": "communism",
        "profileId": "historical_ronald_reagan"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        topic = data.get("topic")

        if not topic:
            return https_fn.Response(
                json.dumps({"error": "topic is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        timeline = service.get_topic_timeline(
            topic_name=topic,
            profile_id=data.get("profileId")
        )
        service.close()

        return https_fn.Response(
            json.dumps({"timeline": timeline}),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# NEO4J GRAPH SEEDING ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=120,  # 2 minutes for seeding
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def seed_reagan_universe(req: https_fn.Request) -> https_fn.Response:
    """
    Pre-seed the Reagan Universe in Neo4j.

    Creates the invariant nodes and relationships:
    - Core people (Ronald, Nancy, Staff, Advisors, World Leaders)
    - Relationship dynamics (The Nancy Protocol basis)
    - Sacred locations (Library, Ranch, Air Force One)
    - Historical events (Summits, Speeches)
    - Astrological calendar rules (Joan Quigley)

    POST body (optional):
    {
        "verify_only": false  // If true, only verify existing data
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json() or {}
        verify_only = data.get("verify_only", False)

        # Import genesis graph functions
        from scripts.genesis_graph import pre_seed_reagan_universe, verify_universe
        from neo4j import GraphDatabase

        # Get Neo4j credentials from secrets
        uri = os.environ.get("NEO4J_URI")
        password = os.environ.get("NEO4J_PASSWORD")
        user = os.environ.get("NEO4J_USER", "neo4j")

        if not uri or not password:
            return https_fn.Response(
                json.dumps({
                    "error": "Neo4j credentials not configured",
                    "message": "Set NEO4J_URI and NEO4J_PASSWORD secrets"
                }),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Connect to Neo4j
        driver = GraphDatabase.driver(uri, auth=(user, password))

        try:
            if verify_only:
                # Just verify existing data
                verification = verify_universe(driver)
                return https_fn.Response(
                    json.dumps({
                        "success": True,
                        "action": "verify",
                        "verification": verification
                    }),
                    status=200,
                    headers={"Content-Type": "application/json"}
                )
            else:
                # Seed the universe
                results = pre_seed_reagan_universe(driver)
                verification = verify_universe(driver)

                return https_fn.Response(
                    json.dumps({
                        "success": True,
                        "action": "seed",
                        "seeding_results": results,
                        "verification": verification
                    }),
                    status=200,
                    headers={"Content-Type": "application/json"}
                )
        finally:
            driver.close()

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def query_person_relationships(req: https_fn.Request) -> https_fn.Response:
    """
    Query relationships for a person in the Reagan Universe graph.

    GET/POST with query param or body:
    ?person_id=historical_joan_quigley
    or {"person_id": "historical_joan_quigley"}
    """
    try:
        from neo4j import GraphDatabase

        # Get person_id from query params or body
        person_id = req.args.get("person_id")
        if not person_id and req.method == "POST":
            data = req.get_json() or {}
            person_id = data.get("person_id")

        if not person_id:
            return https_fn.Response(
                json.dumps({"error": "person_id required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Get Neo4j credentials
        uri = os.environ.get("NEO4J_URI")
        password = os.environ.get("NEO4J_PASSWORD")
        user = os.environ.get("NEO4J_USER", "neo4j")

        if not uri or not password:
            return https_fn.Response(
                json.dumps({"error": "Neo4j not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        driver = GraphDatabase.driver(uri, auth=(user, password))

        try:
            with driver.session() as session:
                # Query outgoing relationships
                outgoing = session.run("""
                    MATCH (p:Person {id: $person_id})-[r]->(target)
                    RETURN type(r) as relationship_type,
                           properties(r) as relationship_props,
                           labels(target) as target_labels,
                           target.id as target_id,
                           target.name as target_name
                """, person_id=person_id)

                outgoing_rels = [dict(record) for record in outgoing]

                # Query incoming relationships
                incoming = session.run("""
                    MATCH (source)-[r]->(p:Person {id: $person_id})
                    RETURN type(r) as relationship_type,
                           properties(r) as relationship_props,
                           labels(source) as source_labels,
                           source.id as source_id,
                           source.name as source_name
                """, person_id=person_id)

                incoming_rels = [dict(record) for record in incoming]

                # Get person info
                person_result = session.run("""
                    MATCH (p:Person {id: $person_id})
                    RETURN p.name as name, p.role as role, properties(p) as props
                """, person_id=person_id)

                person_record = person_result.single()
                person_info = dict(person_record) if person_record else None

                return https_fn.Response(
                    json.dumps({
                        "success": True,
                        "person_id": person_id,
                        "person": person_info,
                        "outgoing_relationships": outgoing_rels,
                        "incoming_relationships": incoming_rels
                    }),
                    status=200,
                    headers={"Content-Type": "application/json"}
                )
        finally:
            driver.close()

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )
