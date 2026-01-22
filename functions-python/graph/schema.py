"""
Neo4j Schema Initialization for GENESIS
Run once to set up indexes, constraints, and base data
"""

from neo4j import GraphDatabase
import os


ZODIAC_SIGNS = [
    {"name": "Aries", "element": "fire", "modality": "cardinal", "ruler": "Mars"},
    {"name": "Taurus", "element": "earth", "modality": "fixed", "ruler": "Venus"},
    {"name": "Gemini", "element": "air", "modality": "mutable", "ruler": "Mercury"},
    {"name": "Cancer", "element": "water", "modality": "cardinal", "ruler": "Moon"},
    {"name": "Leo", "element": "fire", "modality": "fixed", "ruler": "Sun"},
    {"name": "Virgo", "element": "earth", "modality": "mutable", "ruler": "Mercury"},
    {"name": "Libra", "element": "air", "modality": "cardinal", "ruler": "Venus"},
    {"name": "Scorpio", "element": "water", "modality": "fixed", "ruler": "Pluto"},
    {"name": "Sagittarius", "element": "fire", "modality": "mutable", "ruler": "Jupiter"},
    {"name": "Capricorn", "element": "earth", "modality": "cardinal", "ruler": "Saturn"},
    {"name": "Aquarius", "element": "air", "modality": "fixed", "ruler": "Uranus"},
    {"name": "Pisces", "element": "water", "modality": "mutable", "ruler": "Neptune"}
]

ELEMENTS = [
    {"name": "fire", "quality": "active", "temperament": "hot_dry"},
    {"name": "earth", "quality": "passive", "temperament": "cold_dry"},
    {"name": "air", "quality": "active", "temperament": "hot_wet"},
    {"name": "water", "quality": "passive", "temperament": "cold_wet"}
]


def initialize_schema(uri: str, user: str, password: str) -> dict:
    """
    Initialize the Neo4j schema with constraints, indexes, and base data.

    Args:
        uri: Neo4j connection URI
        user: Neo4j username
        password: Neo4j password

    Returns:
        Dictionary with initialization results
    """
    results = {
        "constraints": [],
        "indexes": [],
        "signs": [],
        "elements": [],
        "graphrag": [],
        "errors": []
    }

    driver = GraphDatabase.driver(uri, auth=(user, password))

    try:
        with driver.session() as session:
            # Create constraints (original + GraphRAG + Diary)
            constraints = [
                ("profile_userId", "CREATE CONSTRAINT profile_userId IF NOT EXISTS FOR (p:Profile) REQUIRE p.userId IS UNIQUE"),
                ("sign_name", "CREATE CONSTRAINT sign_name IF NOT EXISTS FOR (s:Sign) REQUIRE s.name IS UNIQUE"),
                ("element_name", "CREATE CONSTRAINT element_name IF NOT EXISTS FOR (e:Element) REQUIRE e.name IS UNIQUE"),
                # GraphRAG constraints (Hello History pattern)
                ("guest_profile_id", "CREATE CONSTRAINT guest_profile_id IF NOT EXISTS FOR (g:GuestProfile) REQUIRE g.profile_id IS UNIQUE"),
                ("chunk_hash", "CREATE CONSTRAINT chunk_hash IF NOT EXISTS FOR (c:BiographyChunk) REQUIRE c.chunk_hash IS UNIQUE"),
                ("topic_name", "CREATE CONSTRAINT topic_name IF NOT EXISTS FOR (t:Topic) REQUIRE t.name IS UNIQUE"),
                ("entity_name", "CREATE CONSTRAINT entity_name IF NOT EXISTS FOR (e:Entity) REQUIRE e.name IS UNIQUE"),
                ("theme_name", "CREATE CONSTRAINT theme_name IF NOT EXISTS FOR (th:ConstitutionalTheme) REQUIRE th.name IS UNIQUE"),
                ("dynamic_name", "CREATE CONSTRAINT dynamic_name IF NOT EXISTS FOR (d:RelationshipDynamic) REQUIRE d.name IS UNIQUE"),
                # Reagan Diaries constraints
                ("diary_entry_hash", "CREATE CONSTRAINT diary_entry_hash IF NOT EXISTS FOR (d:DiaryEntry) REQUIRE d.entry_hash IS UNIQUE"),
                ("diary_chunk_hash", "CREATE CONSTRAINT diary_chunk_hash IF NOT EXISTS FOR (c:DiaryChunk) REQUIRE c.chunk_hash IS UNIQUE"),
                ("person_name", "CREATE CONSTRAINT person_name IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE"),
                ("date_value", "CREATE CONSTRAINT date_value IF NOT EXISTS FOR (d:Date) REQUIRE d.value IS UNIQUE")
            ]

            for name, query in constraints:
                try:
                    session.run(query)
                    results["constraints"].append({"name": name, "success": True})
                except Exception as e:
                    results["constraints"].append({"name": name, "success": False, "error": str(e)})

            # Create indexes (original + GraphRAG + Diary)
            indexes = [
                ("profile_dominant", "CREATE INDEX profile_dominant IF NOT EXISTS FOR (p:Profile) ON (p.dominantElement)"),
                ("profile_sunSign", "CREATE INDEX profile_sunSign IF NOT EXISTS FOR (p:Profile) ON (p.sunSign)"),
                ("profile_moonSign", "CREATE INDEX profile_moonSign IF NOT EXISTS FOR (p:Profile) ON (p.moonSign)"),
                ("sign_element", "CREATE INDEX sign_element IF NOT EXISTS FOR (s:Sign) ON (s.element)"),
                # GraphRAG indexes (Hello History pattern)
                ("guest_name", "CREATE INDEX guest_name IF NOT EXISTS FOR (g:GuestProfile) ON (g.name)"),
                ("chunk_index", "CREATE INDEX chunk_index IF NOT EXISTS FOR (c:BiographyChunk) ON (c.chunk_index)"),
                ("chunk_sentiment", "CREATE INDEX chunk_sentiment IF NOT EXISTS FOR (c:BiographyChunk) ON (c.sentiment)"),
                ("topic_name_idx", "CREATE INDEX topic_name_idx IF NOT EXISTS FOR (t:Topic) ON (t.name)"),
                ("entity_name_idx", "CREATE INDEX entity_name_idx IF NOT EXISTS FOR (e:Entity) ON (e.name)"),
                ("theme_name_idx", "CREATE INDEX theme_name_idx IF NOT EXISTS FOR (th:ConstitutionalTheme) ON (th.name)"),
                # Reagan Diaries indexes
                ("diary_date", "CREATE INDEX diary_date IF NOT EXISTS FOR (d:DiaryEntry) ON (d.date_parsed)"),
                ("diary_year", "CREATE INDEX diary_year IF NOT EXISTS FOR (d:DiaryEntry) ON (d.year)"),
                ("diary_source", "CREATE INDEX diary_source IF NOT EXISTS FOR (d:DiaryEntry) ON (d.source)"),
                ("person_name_idx", "CREATE INDEX person_name_idx IF NOT EXISTS FOR (p:Person) ON (p.name)"),
                ("date_year", "CREATE INDEX date_year IF NOT EXISTS FOR (d:Date) ON (d.year)"),
                # DiaryChunk indexes (20% overlap chunking for RAG)
                ("chunk_date", "CREATE INDEX chunk_date IF NOT EXISTS FOR (c:DiaryChunk) ON (c.date_parsed)"),
                ("chunk_year", "CREATE INDEX chunk_year IF NOT EXISTS FOR (c:DiaryChunk) ON (c.year)"),
                ("chunk_index", "CREATE INDEX chunk_idx IF NOT EXISTS FOR (c:DiaryChunk) ON (c.chunk_index)")
            ]

            for name, query in indexes:
                try:
                    session.run(query)
                    results["indexes"].append({"name": name, "success": True})
                except Exception as e:
                    results["indexes"].append({"name": name, "success": False, "error": str(e)})

            # Create Element nodes
            for element in ELEMENTS:
                try:
                    session.run("""
                        MERGE (e:Element {name: $name})
                        SET e.quality = $quality,
                            e.temperament = $temperament
                    """, **element)
                    results["elements"].append({"name": element["name"], "success": True})
                except Exception as e:
                    results["elements"].append({"name": element["name"], "success": False, "error": str(e)})

            # Create Sign nodes with relationships to Elements
            for sign in ZODIAC_SIGNS:
                try:
                    session.run("""
                        MERGE (s:Sign {name: $name})
                        SET s.element = $element,
                            s.modality = $modality,
                            s.ruler = $ruler
                        WITH s
                        MATCH (e:Element {name: $element})
                        MERGE (s)-[:BELONGS_TO_ELEMENT]->(e)
                    """, **sign)
                    results["signs"].append({"name": sign["name"], "success": True})
                except Exception as e:
                    results["signs"].append({"name": sign["name"], "success": False, "error": str(e)})

            # Create element compatibility relationships
            compatibilities = [
                ("fire", "air", 0.85, "amplification"),
                ("fire", "fire", 0.90, "kindred"),
                ("earth", "water", 0.85, "grounding"),
                ("earth", "earth", 0.90, "kindred"),
                ("air", "air", 0.90, "kindred"),
                ("water", "water", 0.90, "kindred"),
                ("fire", "earth", 0.60, "growth"),
                ("fire", "water", 0.50, "challenge"),
                ("earth", "air", 0.60, "growth"),
                ("air", "water", 0.60, "growth")
            ]

            for elem1, elem2, score, relationship_type in compatibilities:
                try:
                    session.run("""
                        MATCH (e1:Element {name: $elem1})
                        MATCH (e2:Element {name: $elem2})
                        MERGE (e1)-[r:COMPATIBLE_WITH]-(e2)
                        SET r.score = $score,
                            r.type = $type
                    """, elem1=elem1, elem2=elem2, score=score, type=relationship_type)
                except Exception as e:
                    results["errors"].append(f"Compatibility {elem1}-{elem2}: {str(e)}")

    except Exception as e:
        results["errors"].append(f"Connection error: {str(e)}")
    finally:
        driver.close()

    return results


def verify_schema(uri: str, user: str, password: str) -> dict:
    """
    Verify the schema was created correctly.
    """
    driver = GraphDatabase.driver(uri, auth=(user, password))

    try:
        with driver.session() as session:
            # Count nodes
            sign_count = session.run("MATCH (s:Sign) RETURN count(s) as count").single()["count"]
            element_count = session.run("MATCH (e:Element) RETURN count(e) as count").single()["count"]

            # Check constraints
            constraints = list(session.run("SHOW CONSTRAINTS"))

            # Check indexes
            indexes = list(session.run("SHOW INDEXES"))

            return {
                "success": True,
                "signs": sign_count,
                "elements": element_count,
                "constraints": len(constraints),
                "indexes": len(indexes),
                "ready": sign_count == 12 and element_count == 4
            }
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        driver.close()


if __name__ == "__main__":
    # For local testing
    import dotenv
    dotenv.load_dotenv()

    uri = os.environ.get("NEO4J_URI")
    user = os.environ.get("NEO4J_USER", "neo4j")
    password = os.environ.get("NEO4J_PASSWORD")

    if not uri or not password:
        print("Error: NEO4J_URI and NEO4J_PASSWORD must be set")
        exit(1)

    print("Initializing Neo4j schema...")
    results = initialize_schema(uri, user, password)
    print(f"Results: {results}")

    print("\nVerifying schema...")
    verification = verify_schema(uri, user, password)
    print(f"Verification: {verification}")
