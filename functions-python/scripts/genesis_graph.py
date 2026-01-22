"""
Genesis Graph: Pre-Seed the Reagan Universe in Neo4j

This script creates the "invariant" nodes and relationships before
ingesting any diary entries. This prevents duplicate nodes and ensures
clean graph linking during ingestion.

Run ONCE before ingesting The Reagan Diaries.

Usage:
    python genesis_graph.py

Or from Cloud Function:
    POST /seed_reagan_universe
"""

import os
import sys
from typing import Dict

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from neo4j import GraphDatabase
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_neo4j_driver():
    """Get Neo4j driver from environment variables"""
    uri = os.environ.get("NEO4J_URI")
    user = os.environ.get("NEO4J_USER", "neo4j")
    password = os.environ.get("NEO4J_PASSWORD")

    if not uri or not password:
        raise ValueError("NEO4J_URI and NEO4J_PASSWORD environment variables required")

    return GraphDatabase.driver(uri, auth=(user, password))


def pre_seed_reagan_universe(driver) -> Dict:
    """
    Create the permanent fixtures of Reagan's world.

    This includes:
    - Core people (Ronald, Nancy, Staff, Advisors, World Leaders)
    - Relationship dynamics (The Nancy Protocol basis)
    - Sacred locations (Pilgrimage sites)
    - Historical events (Summits, Ceremonies)
    - Air Force One context

    Returns:
        Dict with seeding results
    """
    results = {
        "people": 0,
        "locations": 0,
        "events": 0,
        "relationships": 0,
        "errors": []
    }

    with driver.session() as session:

        # =================================================================
        # 1. CORE PEOPLE - The Reagan Inner Circle
        # =================================================================
        logger.info("Seeding Core People...")

        people_query = """
        // The President and First Lady
        MERGE (r:Person {id: "historical_ronald_reagan"})
        SET r.name = "Ronald Reagan",
            r.role = "40th President of the United States",
            r.birth_date = "1911-02-06",
            r.death_date = "2004-06-05",
            r.day_master = "Yang Fire",
            r.profile_type = "historical"

        MERGE (n:Person {id: "historical_nancy_reagan"})
        SET n.name = "Nancy Reagan",
            n.role = "First Lady",
            n.birth_date = "1921-07-06",
            n.death_date = "2016-03-06",
            n.day_master = "Yin Water",
            n.nickname = "Mommy",
            n.profile_type = "historical"

        // White House Staff (Inner Circle)
        MERGE (dr:Person {id: "donald_regan"})
        SET dr.name = "Donald Regan",
            dr.role = "Chief of Staff (1985-1987)",
            dr.perspective = "INNER_CIRCLE",
            dr.memoir = "For the Record"

        MERGE (md:Person {id: "michael_deaver"})
        SET md.name = "Michael Deaver",
            md.role = "Deputy Chief of Staff",
            md.perspective = "INNER_CIRCLE",
            md.memoir = "Behind the Scenes"

        MERGE (jb:Person {id: "james_baker"})
        SET jb.name = "James Baker",
            jb.role = "Chief of Staff (1981-1985), Treasury Secretary",
            jb.perspective = "INNER_CIRCLE"

        MERGE (es:Person {id: "ed_meese"})
        SET es.name = "Ed Meese",
            es.role = "Counselor, Attorney General",
            es.perspective = "INNER_CIRCLE"

        // The Friend (Astrologer) - White House Shadow Advisor
        MERGE (jq:Person {id: "historical_joan_quigley"})
        SET jq.name = "Joan Quigley",
            jq.role = "White House Astrologer & Shadow Presidential Advisor",
            jq.perspective = "INNER_CIRCLE",
            jq.specialty = "Mathematical Astrology (Swiss Ephemeris)",
            jq.secret_code = "The Friend in San Francisco",
            jq.birth_date = "1927-04-10",
            jq.death_date = "2014-10-21",
            jq.day_master = "Yang Metal",
            jq.retainer = "$3,000/month (1981-1988)",
            jq.profile_type = "historical",
            jq.betrayal_wound = "Nancy promised acknowledgment - received silence"

        // World Leaders (Allies)
        MERGE (mt:Person {id: "margaret_thatcher"})
        SET mt.name = "Margaret Thatcher",
            mt.role = "British Prime Minister",
            mt.perspective = "ALLY",
            mt.nickname = "The Iron Lady",
            mt.memoir = "The Downing Street Years"

        MERGE (ghb:Person {id: "george_hw_bush"})
        SET ghb.name = "George H.W. Bush",
            ghb.role = "Vice President, 41st President",
            ghb.perspective = "ALLY"

        MERGE (pope:Person {id: "pope_john_paul_ii"})
        SET pope.name = "Pope John Paul II",
            pope.role = "Head of Catholic Church",
            pope.perspective = "ALLY"

        // World Leaders (Adversaries - Important Perspectives)
        MERGE (mg:Person {id: "mikhail_gorbachev"})
        SET mg.name = "Mikhail Gorbachev",
            mg.role = "Soviet General Secretary",
            mg.perspective = "ADVERSARY",
            mg.memoir = "Memoirs",
            mg.relationship_arc = "Adversary to Negotiating Partner"

        MERGE (ton:Person {id: "tip_oneill"})
        SET ton.name = "Tip O'Neill",
            ton.role = "Speaker of the House",
            ton.perspective = "ADVERSARY",
            ton.relationship_note = "Political adversary but personal friend"

        // Military/Security
        MERGE (br:Person {id: "bob_ruddick"})
        SET br.name = "Col. Bob Ruddick",
            br.role = "Personal Pilot, Air Force One",
            br.tail_number = "SAM 27000"

        RETURN count(*) as people_count
        """

        result = session.run(people_query)
        results["people"] = result.single()["people_count"]
        logger.info(f"  Created/updated {results['people']} people nodes")

        # =================================================================
        # 2. RELATIONSHIP DYNAMICS - The Nancy Protocol
        # =================================================================
        logger.info("Seeding Relationship Dynamics...")

        # Execute relationship queries separately (Neo4j requires WITH between MERGE and MATCH)
        relationship_queries = [
            # The Reagan Marriage (Water Protects Fire)
            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (n:Person {id: "historical_nancy_reagan"})
            MERGE (r)-[:MARRIED_TO {
                dynamic: "Water Protects Fire",
                start_date: "1952-03-04",
                note: "She was his anchor. He was her sun."
            }]->(n)
            """,

            # Nancy's Consultation Network - The Nancy Protocol
            """
            MATCH (n:Person {id: "historical_nancy_reagan"})
            MATCH (jq:Person {id: "historical_joan_quigley"})
            MERGE (n)-[:CONSULTS {
                topic: "Presidential Scheduling",
                secret: true,
                duration: "1981-1988",
                frequency: "Daily/near-daily calls",
                note: "Color-coded calendar: Red=Bad, Yellow=Iffy, Green=Good",
                trigger: "March 30, 1981 assassination attempt",
                control_scope: "Air Force One, Summits, Speeches, Press Conferences, Debates"
            }]->(jq)
            """,

            # Joan's Betrayal
            """
            MATCH (jq:Person {id: "historical_joan_quigley"})
            MATCH (n:Person {id: "historical_nancy_reagan"})
            MERGE (jq)-[:BETRAYED_BY {
                date: "1988-05",
                trigger: "Donald Regan memoir exposure",
                response: "Nancy never spoke to Joan again",
                wound: "Promised acknowledgment, received silence"
            }]->(n)
            """,

            # Nancy's Protective Dynamics
            """
            MATCH (n:Person {id: "historical_nancy_reagan"})
            MATCH (dr:Person {id: "donald_regan"})
            MERGE (n)-[:BLOCKED {
                reason: "Conflict over access to the President",
                result: "Don Regan resigned 1987"
            }]->(dr)
            """,

            # Reagan's Staff Relationships
            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (dr:Person {id: "donald_regan"})
            MERGE (r)-[:EMPLOYED {role: "Chief of Staff", years: "1985-1987"}]->(dr)
            """,

            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (md:Person {id: "michael_deaver"})
            MERGE (r)-[:EMPLOYED {role: "Deputy Chief of Staff", trusted: true}]->(md)
            """,

            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (jb:Person {id: "james_baker"})
            MERGE (r)-[:EMPLOYED {role: "Chief of Staff", years: "1981-1985"}]->(jb)
            """,

            # Diplomatic Relationships
            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (mt:Person {id: "margaret_thatcher"})
            MERGE (r)-[:ALLIED_WITH {
                type: "Special Relationship",
                note: "Ideological soulmates"
            }]->(mt)
            """,

            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (mg:Person {id: "mikhail_gorbachev"})
            MERGE (r)-[:NEGOTIATED_WITH {
                evolution: "Cold War adversary to peace partner",
                summits: ["Geneva 1985", "Reykjavik 1986", "Washington 1987", "Moscow 1988"]
            }]->(mg)
            """,

            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (br:Person {id: "bob_ruddick"})
            MERGE (br)-[:PILOTED_FOR {
                aircraft: "SAM 27000",
                ritual: "Every landing: 'You did it again, Bob'"
            }]->(r)
            """
        ]

        rel_count = 0
        for query in relationship_queries:
            session.run(query)
            rel_count += 1
        results["relationships"] = rel_count
        logger.info(f"  Created/updated {results['relationships']} relationships")

        # =================================================================
        # 3. SACRED LOCATIONS - Pilgrimage Sites
        # =================================================================
        logger.info("Seeding Sacred Locations...")

        # Location creation queries (MERGE + SET together is fine)
        location_create_query = """
        MERGE (lib:Location {id: "reagan_library"})
        SET lib.name = "Ronald Reagan Presidential Library",
            lib.city = "Simi Valley",
            lib.state = "California",
            lib.type = "Presidential Library",
            lib.opened = "1991-11-04",
            lib.grave_site = true,
            lib.vibe = "Pilgrimage",
            lib.sunset_view = "Pacific Ocean to the west",
            lib.prompt_injection = "You are resting here peacefully. Mommy is beside you."

        MERGE (plane:Location {id: "sam_27000"})
        SET plane.name = "Air Force One",
            plane.tail_number = "SAM 27000",
            plane.type = "Boeing VC-137C",
            plane.nickname = "The Flying White House",
            plane.service_years = "1972-2001",
            plane.notable_flights = ["Geneva Summit", "Reykjavik Summit", "Berlin Wall Speech"],
            plane.current_location = "Reagan Library Pavilion",
            plane.jelly_beans = true,
            plane.vibe = "Sanctuary",
            plane.prompt_injection = "This was your mobile office. You wrote diary entries crossing the Atlantic."

        MERGE (ranch:Location {id: "rancho_del_cielo"})
        SET ranch.name = "Rancho del Cielo",
            ranch.translation = "Ranch of the Sky",
            ranch.city = "Santa Barbara",
            ranch.state = "California",
            ranch.type = "Private Ranch",
            ranch.purchased = "1974",
            ranch.vibe = "Fireside",
            ranch.activities = ["Horseback riding", "Clearing brush", "Fireside conversations"],
            ranch.prompt_injection = "This is your true home. Jeans and boots. Fire crackling."

        MERGE (wh:Location {id: "white_house"})
        SET wh.name = "The White House",
            wh.city = "Washington",
            wh.state = "D.C.",
            wh.type = "Executive Residence",
            wh.residence_years = "1981-1989",
            wh.vibe = "Presidential"
        """
        session.run(location_create_query)

        # Location relationship queries (separate because MERGE then MATCH needs separate transactions)
        location_rel_queries = [
            """
            MATCH (plane:Location {id: "sam_27000"})
            MATCH (lib:Location {id: "reagan_library"})
            MERGE (plane)-[:DOCKED_AT {since: "2005", exhibit: "Air Force One Pavilion"}]->(lib)
            """,
            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (lib:Location {id: "reagan_library"})
            MERGE (r)-[:RESTS_AT]->(lib)
            """,
            """
            MATCH (n:Person {id: "historical_nancy_reagan"})
            MATCH (lib:Location {id: "reagan_library"})
            MERGE (n)-[:RESTS_AT]->(lib)
            """,
            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (ranch:Location {id: "rancho_del_cielo"})
            MERGE (r)-[:OWNED]->(ranch)
            """,
            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (plane:Location {id: "sam_27000"})
            MERGE (r)-[:FLEW_ON]->(plane)
            """
        ]

        for query in location_rel_queries:
            session.run(query)
        results["locations"] = 4 + len(location_rel_queries)
        logger.info(f"  Created/updated {results['locations']} location nodes")

        # =================================================================
        # 4. HISTORICAL EVENTS - Major Milestones
        # =================================================================
        logger.info("Seeding Historical Events...")

        # Event creation queries (executed separately to avoid Neo4j issues)
        event_create_queries = [
            """
            MERGE (e:Event {id: "assassination_attempt_1981"})
            SET e.name = "Assassination Attempt",
                e.date = "1981-03-30",
                e.location = "Washington Hilton",
                e.significance = "Nancy began consulting Joan Quigley after this",
                e.emotional_impact = "Near-death experience",
                e.reagan_quote = "Honey, I forgot to duck"
            """,
            """
            MERGE (e:Event {id: "geneva_summit_1985"})
            SET e.name = "Geneva Summit",
                e.date = "1985-11-19",
                e.location = "Geneva, Switzerland",
                e.counterpart = "Mikhail Gorbachev",
                e.significance = "First Reagan-Gorbachev meeting",
                e.joan_calendar = "Green Day",
                e.plane_flight = true
            """,
            """
            MERGE (e:Event {id: "reykjavik_summit_1986"})
            SET e.name = "Reykjavik Summit",
                e.date = "1986-10-11",
                e.location = "Reykjavik, Iceland",
                e.counterpart = "Mikhail Gorbachev",
                e.significance = "Nearly eliminated all nuclear weapons",
                e.outcome = "Walked away over SDI",
                e.joan_calendar = "Green Day",
                e.plane_flight = true
            """,
            """
            MERGE (e:Event {id: "berlin_wall_speech_1987"})
            SET e.name = "Berlin Wall Speech",
                e.date = "1987-06-12",
                e.location = "Berlin, Germany",
                e.significance = "Tear Down This Wall",
                e.famous_quote = "Mr. Gorbachev, tear down this wall!",
                e.plane_flight = true
            """,
            """
            MERGE (e:Event {id: "inf_treaty_1987"})
            SET e.name = "INF Treaty Signing",
                e.date = "1987-12-08",
                e.location = "White House",
                e.counterpart = "Mikhail Gorbachev",
                e.significance = "First treaty to reduce nuclear arsenal",
                e.reagan_quote = "Trust, but verify"
            """,
            """
            MERGE (e:Event {id: "challenger_disaster_1986"})
            SET e.name = "Challenger Disaster",
                e.date = "1986-01-28",
                e.significance = "National tragedy, Reagan's comforting speech",
                e.famous_quote = "Slipped the surly bonds of earth to touch the face of God"
            """
        ]
        for query in event_create_queries:
            session.run(query)

        # Event relationship queries (separate to avoid MERGE/MATCH issues)
        event_rel_queries = [
            """
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (e:Event)
            MERGE (r)-[:PARTICIPATED_IN]->(e)
            """,
            """
            MATCH (mg:Person {id: "mikhail_gorbachev"})
            MATCH (e:Event)
            WHERE e.counterpart = "Mikhail Gorbachev"
            MERGE (mg)-[:PARTICIPATED_IN]->(e)
            """,
            """
            MATCH (plane:Location {id: "sam_27000"})
            MATCH (e:Event)
            WHERE e.plane_flight = true
            MERGE (plane)-[:TRANSPORTED_TO]->(e)
            """
        ]

        for query in event_rel_queries:
            session.run(query)
        results["events"] = 6 + len(event_rel_queries)
        logger.info(f"  Created/updated {results['events']} event nodes")

        # =================================================================
        # 5. ASTROLOGICAL CALENDAR - Joan Quigley's Red/Green Days
        # =================================================================
        logger.info("Seeding Astrological Rules (Nancy Protocol basis)...")

        # Astrology Rules creation query
        astrology_create_query = """
        MERGE (red:AstrologyRule {status: "RED"})
        SET red.instruction = "Stay at White House. No Travel. Cancel public appearances.",
            red.nancy_action = "Reschedule everything",
            red.joan_marking = "Red ink on calendar"

        MERGE (green:AstrologyRule {status: "GREEN"})
        SET green.instruction = "Propitious day. Travel and speak freely.",
            green.nancy_action = "Proceed with schedule",
            green.joan_marking = "Green ink on calendar"

        MERGE (yellow:AstrologyRule {status: "YELLOW"})
        SET yellow.instruction = "Proceed with caution. Minor activities only.",
            yellow.nancy_action = "Keep it light",
            yellow.joan_marking = "Yellow ink on calendar"

        MERGE (g1985:GreenDay {date: "1985-11-19"})
        SET g1985.event = "Geneva Summit",
            g1985.note = "Joan marked this green for diplomacy"

        MERGE (g1986:GreenDay {date: "1986-10-11"})
        SET g1986.event = "Reykjavik Summit",
            g1986.note = "Stars aligned for bold moves"

        MERGE (g1987:GreenDay {date: "1987-06-12"})
        SET g1987.event = "Berlin Wall Speech",
            g1987.note = "Tear down this wall - perfect timing"
        """
        session.run(astrology_create_query)

        # Link Joan to her rules (separate query)
        astrology_rel_query = """
        MATCH (j:Person {id: "historical_joan_quigley"})
        MATCH (r:AstrologyRule)
        MERGE (j)-[:CREATED_RULE]->(r)
        """
        session.run(astrology_rel_query)
        astro_count = 6  # 3 rules + 3 green days
        logger.info(f"  Created {astro_count} astrology rule nodes")

        # =================================================================
        # 6. CREATE INDEXES FOR FAST QUERIES
        # =================================================================
        logger.info("Creating indexes...")

        indexes = [
            "CREATE INDEX person_id IF NOT EXISTS FOR (p:Person) ON (p.id)",
            "CREATE INDEX person_name IF NOT EXISTS FOR (p:Person) ON (p.name)",
            "CREATE INDEX location_id IF NOT EXISTS FOR (l:Location) ON (l.id)",
            "CREATE INDEX location_name IF NOT EXISTS FOR (l:Location) ON (l.name)",
            "CREATE INDEX event_id IF NOT EXISTS FOR (e:Event) ON (e.id)",
            "CREATE INDEX event_date IF NOT EXISTS FOR (e:Event) ON (e.date)",
            "CREATE INDEX diary_entry_id IF NOT EXISTS FOR (d:DiaryEntry) ON (d.id)",
            "CREATE INDEX diary_entry_date IF NOT EXISTS FOR (d:DiaryEntry) ON (d.date_parsed)",
            "CREATE INDEX diary_entry_year IF NOT EXISTS FOR (d:DiaryEntry) ON (d.year)",
            "CREATE INDEX diary_entry_perspective IF NOT EXISTS FOR (d:DiaryEntry) ON (d.perspective)",
        ]

        for idx_query in indexes:
            try:
                session.run(idx_query)
            except Exception as e:
                if "already exists" not in str(e).lower():
                    results["errors"].append(str(e))

        logger.info("  Indexes created")

    return results


def verify_universe(driver) -> Dict:
    """Verify the seeded universe is correct"""
    with driver.session() as session:
        verification = {}

        # Count nodes by type
        result = session.run("""
            MATCH (p:Person) RETURN 'Person' as label, count(p) as count
            UNION ALL
            MATCH (l:Location) RETURN 'Location' as label, count(l) as count
            UNION ALL
            MATCH (e:Event) RETURN 'Event' as label, count(e) as count
        """)

        for record in result:
            verification[record["label"]] = record["count"]

        # Count relationships
        result = session.run("MATCH ()-[r]->() RETURN count(r) as rel_count")
        verification["Relationships"] = result.single()["rel_count"]

        # Verify core entities exist
        result = session.run("""
            MATCH (r:Person {id: "historical_ronald_reagan"})
            MATCH (n:Person {id: "historical_nancy_reagan"})
            MATCH (plane:Location {id: "sam_27000"})
            MATCH (lib:Location {id: "reagan_library"})
            RETURN r.name as reagan, n.name as nancy,
                   plane.name as plane, lib.name as library
        """)

        record = result.single()
        if record:
            verification["core_entities"] = {
                "reagan": record["reagan"],
                "nancy": record["nancy"],
                "plane": record["plane"],
                "library": record["library"]
            }
            verification["verified"] = True
        else:
            verification["verified"] = False
            verification["error"] = "Core entities not found"

        return verification


def main():
    """Run the Genesis Graph seeding"""
    print("=" * 60)
    print("GENESIS GRAPH: Pre-Seeding Reagan Universe")
    print("=" * 60)

    try:
        driver = get_neo4j_driver()
        print("\nConnected to Neo4j")

        # Seed the universe
        print("\n--- Seeding Universe ---")
        results = pre_seed_reagan_universe(driver)

        print(f"\nSeeding Complete:")
        print(f"  People:        {results['people']}")
        print(f"  Locations:     {results['locations']}")
        print(f"  Events:        {results['events']}")
        print(f"  Relationships: {results['relationships']}")

        if results["errors"]:
            print(f"\nWarnings: {len(results['errors'])}")
            for err in results["errors"]:
                print(f"  - {err}")

        # Verify
        print("\n--- Verification ---")
        verification = verify_universe(driver)

        print(f"\nGraph Contents:")
        for label, count in verification.items():
            if label not in ["verified", "error", "core_entities"]:
                print(f"  {label}: {count}")

        if verification.get("verified"):
            print("\nCore Entities Verified:")
            for key, value in verification.get("core_entities", {}).items():
                print(f"  {key}: {value}")
            print("\n" + "=" * 60)
            print("SUCCESS: Universe seeded. Ready for Diary ingestion.")
            print("=" * 60)
        else:
            print(f"\nERROR: {verification.get('error')}")

        driver.close()

    except Exception as e:
        print(f"\nERROR: {e}")
        raise


if __name__ == "__main__":
    main()
