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
        "errors": []
    }

    driver = GraphDatabase.driver(uri, auth=(user, password))

    try:
        with driver.session() as session:
            # Create constraints
            constraints = [
                ("profile_userId", "CREATE CONSTRAINT profile_userId IF NOT EXISTS FOR (p:Profile) REQUIRE p.userId IS UNIQUE"),
                ("sign_name", "CREATE CONSTRAINT sign_name IF NOT EXISTS FOR (s:Sign) REQUIRE s.name IS UNIQUE"),
                ("element_name", "CREATE CONSTRAINT element_name IF NOT EXISTS FOR (e:Element) REQUIRE e.name IS UNIQUE")
            ]

            for name, query in constraints:
                try:
                    session.run(query)
                    results["constraints"].append({"name": name, "success": True})
                except Exception as e:
                    results["constraints"].append({"name": name, "success": False, "error": str(e)})

            # Create indexes
            indexes = [
                ("profile_dominant", "CREATE INDEX profile_dominant IF NOT EXISTS FOR (p:Profile) ON (p.dominantElement)"),
                ("profile_sunSign", "CREATE INDEX profile_sunSign IF NOT EXISTS FOR (p:Profile) ON (p.sunSign)"),
                ("profile_moonSign", "CREATE INDEX profile_moonSign IF NOT EXISTS FOR (p:Profile) ON (p.moonSign)"),
                ("sign_element", "CREATE INDEX sign_element IF NOT EXISTS FOR (s:Sign) ON (s.element)")
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
