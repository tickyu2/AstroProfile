"""
Neo4j Graph Service for GENESIS
Soul Family Discovery, Synastry Relationships, and Knowledge Graphs

Includes:
- Direct Cypher queries via Neo4j Python driver
- Neo4j Aura Agent API for natural language queries
"""

import os
import requests
from typing import Dict, List, Optional
from neo4j import GraphDatabase
import logging

logger = logging.getLogger(__name__)


# =============================================================================
# NEO4J AURA AGENT CLIENT
# =============================================================================

class Neo4jAgentClient:
    """
    Client for Neo4j Aura AI Agent API.
    Enables natural language queries against the Soul Family graph.
    Uses OAuth2 client credentials for authentication.
    """

    TOKEN_URL = "https://api.neo4j.io/oauth/token"

    def __init__(self, agent_url: str = None, client_id: str = None, client_secret: str = None):
        """
        Initialize agent client.

        Environment variables (if not provided):
        - NEO4J_AGENT_URL: Full agent invoke URL
        - NEO4J_CLIENT_ID: OAuth2 client ID
        - NEO4J_CLIENT_SECRET: OAuth2 client secret
        """
        self.agent_url = agent_url or os.environ.get("NEO4J_AGENT_URL")
        self.client_id = client_id or os.environ.get("NEO4J_CLIENT_ID")
        self.client_secret = client_secret or os.environ.get("NEO4J_CLIENT_SECRET")
        self._access_token = None

    def is_configured(self) -> bool:
        """Check if agent is configured"""
        return bool(self.agent_url and self.client_id and self.client_secret)

    def _get_basic_auth(self) -> str:
        """Get Basic auth header value"""
        import base64
        credentials = f"{self.client_id}:{self.client_secret}"
        return base64.b64encode(credentials.encode()).decode()

    def query(self, message: str, context: Dict = None) -> Dict:
        """
        Send a natural language query to the agent.

        Args:
            message: Natural language query
            context: Optional context (userId, userProfile, etc.)

        Returns:
            Agent response with generated answer
        """
        if not self.is_configured():
            logger.warning("Neo4j Agent not configured")
            return {
                "success": False,
                "error": "Agent not configured",
                "message": "Set NEO4J_AGENT_URL, NEO4J_CLIENT_ID, and NEO4J_CLIENT_SECRET"
            }

        try:
            # Try Bearer token with client_secret
            response = requests.post(
                self.agent_url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.client_secret}"
                },
                json={
                    "message": message,
                    "context": context or {}
                },
                timeout=30
            )

            if not response.ok:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}",
                    "message": response.text
                }

            data = response.json()
            return {
                "success": True,
                "response": data.get("response") or data.get("message") or data,
                "metadata": data.get("metadata", {})
            }

        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": "timeout",
                "message": "Agent request timed out"
            }
        except Exception as e:
            logger.error(f"Agent query failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "message": "Agent query failed"
            }

    def find_compatible_profiles(self, day_master: str, limit: int = 10) -> Dict:
        """Find profiles compatible with a given Day Master"""
        return self.query(
            f"Find up to {limit} profiles compatible with Day Master: {day_master}"
        )

    def get_synastry_insights(self, user1_id: str, user2_id: str) -> Dict:
        """Get synastry insights between two users"""
        return self.query(
            f"Analyze synastry between users {user1_id} and {user2_id}. "
            f"What are their elemental dynamics and compatibility strengths?"
        )

    def search_by_element(self, element: str, limit: int = 20) -> Dict:
        """Search profiles by dominant element"""
        return self.query(
            f"Find up to {limit} profiles with dominant {element} element"
        )


class Neo4jService:
    """
    Neo4j Graph Database Service for GENESIS.
    Handles Soul Family matching, Synastry relationships, and profile graphs.
    """

    def __init__(self, uri: str = None, user: str = None, password: str = None):
        """
        Initialize Neo4j connection.

        Uses environment variables if not provided:
        - NEO4J_URI: Connection URI (e.g., "neo4j+s://xxxxx.databases.neo4j.io")
        - NEO4J_USER: Username (usually "neo4j")
        - NEO4J_PASSWORD: Password
        """
        self.uri = uri or os.environ.get("NEO4J_URI")
        self.user = user or os.environ.get("NEO4J_USER", "neo4j")
        self.password = password or os.environ.get("NEO4J_PASSWORD")

        if self.uri and self.password:
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
        else:
            self.driver = None
            logger.warning("Neo4j credentials not configured - running in mock mode")

    def close(self):
        """Close the Neo4j connection"""
        if self.driver:
            self.driver.close()

    def _verify_connectivity(self) -> bool:
        """Verify Neo4j connection is working"""
        if not self.driver:
            return False
        try:
            self.driver.verify_connectivity()
            return True
        except Exception as e:
            logger.error(f"Neo4j connection failed: {e}")
            return False

    # =========================================================================
    # PROFILE NODE OPERATIONS
    # =========================================================================

    def create_profile_node(self, user_id: str, profile: Dict) -> Dict:
        """
        Create or update a user profile node in Neo4j.

        Args:
            user_id: Unique user identifier
            profile: Profile data including astrological information

        Returns:
            Created/updated node data
        """
        if not self.driver:
            return self._mock_create_profile(user_id, profile)

        query = """
        MERGE (p:Profile {userId: $userId})
        SET p.sunSign = $sunSign,
            p.moonSign = $moonSign,
            p.risingSign = $risingSign,
            p.fireElement = $fire,
            p.earthElement = $earth,
            p.airElement = $air,
            p.waterElement = $water,
            p.dominantElement = $dominantElement,
            p.updatedAt = datetime()
        RETURN p
        """

        elements = profile.get("elements", {})

        with self.driver.session() as session:
            result = session.run(
                query,
                userId=user_id,
                sunSign=profile.get("sunSign", ""),
                moonSign=profile.get("moonSign", ""),
                risingSign=profile.get("risingSign", ""),
                fire=elements.get("fire", 0),
                earth=elements.get("earth", 0),
                air=elements.get("air", 0),
                water=elements.get("water", 0),
                dominantElement=elements.get("dominant", {}).get("element", "")
            )
            record = result.single()

            # Create sign nodes and relationships
            self._create_sign_relationships(session, user_id, profile)

            return {
                "success": True,
                "userId": user_id,
                "message": "Profile node created/updated"
            }

    def _create_sign_relationships(self, session, user_id: str, profile: Dict):
        """Create relationships between Profile and Sign nodes"""
        # Create SUN sign relationship
        if profile.get("sunSign"):
            session.run("""
                MERGE (s:Sign {name: $sign})
                WITH s
                MATCH (p:Profile {userId: $userId})
                MERGE (p)-[:HAS_SUN_IN]->(s)
            """, sign=profile["sunSign"], userId=user_id)

        # Create MOON sign relationship
        if profile.get("moonSign"):
            session.run("""
                MERGE (s:Sign {name: $sign})
                WITH s
                MATCH (p:Profile {userId: $userId})
                MERGE (p)-[:HAS_MOON_IN]->(s)
            """, sign=profile["moonSign"], userId=user_id)

        # Create RISING sign relationship
        if profile.get("risingSign"):
            session.run("""
                MERGE (s:Sign {name: $sign})
                WITH s
                MATCH (p:Profile {userId: $userId})
                MERGE (p)-[:HAS_RISING_IN]->(s)
            """, sign=profile["risingSign"], userId=user_id)

    def _mock_create_profile(self, user_id: str, profile: Dict) -> Dict:
        """Mock profile creation when Neo4j is not configured"""
        return {
            "success": True,
            "userId": user_id,
            "message": "Profile node created (mock mode)",
            "mock": True
        }

    # =========================================================================
    # SOUL FAMILY DISCOVERY
    # =========================================================================

    def find_soul_family(
        self,
        user_id: str,
        elemental_profile: Dict,
        limit: int = 10
    ) -> Dict:
        """
        Find Soul Family matches based on elemental compatibility.

        Soul Family members are those with complementary elemental profiles:
        - Fire + Air = Amplification
        - Earth + Water = Grounding
        - Same dominant element = Understanding
        - Opposite dominant element = Growth

        Args:
            user_id: Current user's ID
            elemental_profile: User's elemental percentages
            limit: Maximum matches to return

        Returns:
            List of Soul Family matches with compatibility scores
        """
        if not self.driver:
            return self._mock_find_soul_family(user_id, elemental_profile, limit)

        # Determine dominant element
        elements = elemental_profile
        dominant = max(elements.items(), key=lambda x: x[1])[0] if elements else "fire"

        # Define complementary elements
        complements = {
            "fire": ["air", "fire"],
            "earth": ["water", "earth"],
            "air": ["fire", "air"],
            "water": ["earth", "water"]
        }

        query = """
        MATCH (target:Profile)
        WHERE target.userId <> $userId

        // Calculate elemental similarity score
        WITH target,
             abs(target.fireElement - $fire) as fireDiff,
             abs(target.earthElement - $earth) as earthDiff,
             abs(target.airElement - $air) as airDiff,
             abs(target.waterElement - $water) as waterDiff

        WITH target,
             100 - ((fireDiff + earthDiff + airDiff + waterDiff) / 4) as similarityScore

        // Boost score for complementary elements
        WITH target, similarityScore,
             CASE
                WHEN target.dominantElement IN $complementary THEN similarityScore + 15
                ELSE similarityScore
             END as adjustedScore

        RETURN target.userId as userId,
               target.sunSign as sunSign,
               target.moonSign as moonSign,
               target.risingSign as risingSign,
               target.dominantElement as dominantElement,
               adjustedScore as compatibilityScore
        ORDER BY adjustedScore DESC
        LIMIT $limit
        """

        with self.driver.session() as session:
            result = session.run(
                query,
                userId=user_id,
                fire=elements.get("fire", 25),
                earth=elements.get("earth", 25),
                air=elements.get("air", 25),
                water=elements.get("water", 25),
                complementary=complements.get(dominant, []),
                limit=limit
            )

            matches = []
            for record in result:
                matches.append({
                    "userId": record["userId"],
                    "sunSign": record["sunSign"],
                    "moonSign": record["moonSign"],
                    "risingSign": record["risingSign"],
                    "dominantElement": record["dominantElement"],
                    "compatibilityScore": round(record["compatibilityScore"], 1),
                    "connectionType": self._determine_connection_type(
                        dominant, record["dominantElement"]
                    )
                })

            return {
                "success": True,
                "matches": matches,
                "totalFound": len(matches),
                "searchCriteria": {
                    "dominantElement": dominant,
                    "complementaryElements": complements.get(dominant, [])
                }
            }

    def _determine_connection_type(self, elem1: str, elem2: str) -> str:
        """Determine the type of Soul Family connection"""
        if elem1 == elem2:
            return "kindred_spirit"  # Same element = deep understanding

        amplification = [("fire", "air"), ("air", "fire")]
        grounding = [("earth", "water"), ("water", "earth")]

        pair = (elem1, elem2)
        if pair in amplification:
            return "amplifier"  # Fire + Air = mutual boost
        elif pair in grounding:
            return "anchor"  # Earth + Water = stability
        else:
            return "growth_catalyst"  # Opposite elements = learning

    def _mock_find_soul_family(self, user_id: str, elemental_profile: Dict, limit: int) -> Dict:
        """Mock Soul Family discovery when Neo4j is not configured"""
        return {
            "success": True,
            "matches": [
                {
                    "userId": "mock_user_1",
                    "sunSign": "Leo",
                    "moonSign": "Sagittarius",
                    "risingSign": "Aries",
                    "dominantElement": "fire",
                    "compatibilityScore": 85.5,
                    "connectionType": "kindred_spirit"
                },
                {
                    "userId": "mock_user_2",
                    "sunSign": "Gemini",
                    "moonSign": "Libra",
                    "risingSign": "Aquarius",
                    "dominantElement": "air",
                    "compatibilityScore": 78.2,
                    "connectionType": "amplifier"
                }
            ],
            "totalFound": 2,
            "mock": True,
            "message": "Neo4j not configured - returning mock data"
        }

    # =========================================================================
    # SYNASTRY RELATIONSHIPS
    # =========================================================================

    def create_synastry_relationship(
        self,
        user1_id: str,
        user2_id: str,
        synastry_data: Dict
    ) -> Dict:
        """
        Create a synastry relationship between two profiles.

        Args:
            user1_id: First user's ID
            user2_id: Second user's ID
            synastry_data: Calculated synastry data including compatibility score

        Returns:
            Created relationship data
        """
        if not self.driver:
            return {
                "success": True,
                "mock": True,
                "message": "Synastry relationship created (mock mode)"
            }

        query = """
        MATCH (p1:Profile {userId: $user1Id})
        MATCH (p2:Profile {userId: $user2Id})
        MERGE (p1)-[r:SYNASTRY_WITH]-(p2)
        SET r.compatibilityScore = $score,
            r.aspectCount = $aspectCount,
            r.elementalDynamic = $elementalDynamic,
            r.interpretation = $interpretation,
            r.calculatedAt = datetime()
        RETURN r
        """

        with self.driver.session() as session:
            result = session.run(
                query,
                user1Id=user1_id,
                user2Id=user2_id,
                score=synastry_data.get("overallScore", 0),
                aspectCount=synastry_data.get("aspectCount", 0),
                elementalDynamic=synastry_data.get("elementalCompatibility", {}).get("dynamic", ""),
                interpretation=synastry_data.get("interpretation", {}).get("overall", "")
            )

            return {
                "success": True,
                "user1": user1_id,
                "user2": user2_id,
                "compatibilityScore": synastry_data.get("overallScore", 0)
            }

    def get_user_connections(self, user_id: str) -> Dict:
        """
        Get all Soul Family connections for a user.

        Returns all profiles this user has synastry relationships with.
        """
        if not self.driver:
            return {"success": True, "connections": [], "mock": True}

        query = """
        MATCH (p:Profile {userId: $userId})-[r:SYNASTRY_WITH]-(other:Profile)
        RETURN other.userId as userId,
               other.sunSign as sunSign,
               other.moonSign as moonSign,
               other.dominantElement as dominantElement,
               r.compatibilityScore as compatibilityScore,
               r.elementalDynamic as elementalDynamic
        ORDER BY r.compatibilityScore DESC
        """

        with self.driver.session() as session:
            result = session.run(query, userId=user_id)
            connections = [dict(record) for record in result]

            return {
                "success": True,
                "userId": user_id,
                "connections": connections,
                "totalConnections": len(connections)
            }

    # =========================================================================
    # GRAPH ANALYTICS
    # =========================================================================

    def get_elemental_distribution(self) -> Dict:
        """Get distribution of dominant elements across all profiles"""
        if not self.driver:
            return {
                "success": True,
                "distribution": {
                    "fire": 25, "earth": 25, "air": 25, "water": 25
                },
                "mock": True
            }

        query = """
        MATCH (p:Profile)
        WHERE p.dominantElement IS NOT NULL
        RETURN p.dominantElement as element, count(*) as count
        """

        with self.driver.session() as session:
            result = session.run(query)
            distribution = {record["element"]: record["count"] for record in result}

            total = sum(distribution.values())
            percentages = {k: round((v / total) * 100, 1) for k, v in distribution.items()} if total > 0 else {}

            return {
                "success": True,
                "distribution": distribution,
                "percentages": percentages,
                "totalProfiles": total
            }

    def get_sign_popularity(self) -> Dict:
        """Get popularity of sun signs across all profiles"""
        if not self.driver:
            return {"success": True, "signs": {}, "mock": True}

        query = """
        MATCH (p:Profile)
        WHERE p.sunSign IS NOT NULL
        RETURN p.sunSign as sign, count(*) as count
        ORDER BY count DESC
        """

        with self.driver.session() as session:
            result = session.run(query)
            signs = {record["sign"]: record["count"] for record in result}

            return {
                "success": True,
                "signs": signs
            }

    # =========================================================================
    # SCHEMA SETUP
    # =========================================================================

    def setup_schema(self) -> Dict:
        """
        Set up Neo4j schema with indexes and constraints.
        Run this once during initial setup.
        """
        if not self.driver:
            return {"success": False, "error": "Neo4j not configured"}

        queries = [
            # Unique constraint on Profile userId
            "CREATE CONSTRAINT profile_userId IF NOT EXISTS FOR (p:Profile) REQUIRE p.userId IS UNIQUE",

            # Unique constraint on Sign name
            "CREATE CONSTRAINT sign_name IF NOT EXISTS FOR (s:Sign) REQUIRE s.name IS UNIQUE",

            # Index on Profile dominant element for faster queries
            "CREATE INDEX profile_dominant IF NOT EXISTS FOR (p:Profile) ON (p.dominantElement)",

            # Index on Profile sun sign
            "CREATE INDEX profile_sunSign IF NOT EXISTS FOR (p:Profile) ON (p.sunSign)"
        ]

        results = []
        with self.driver.session() as session:
            for query in queries:
                try:
                    session.run(query)
                    results.append({"query": query[:50] + "...", "success": True})
                except Exception as e:
                    results.append({"query": query[:50] + "...", "success": False, "error": str(e)})

        return {
            "success": all(r["success"] for r in results),
            "results": results
        }
