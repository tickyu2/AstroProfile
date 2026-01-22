"""
Test Neo4j Biography Ingestion

Ingests a sample biography to test the GraphRAG pipeline.
Run from functions-python directory:
    python -m scripts.test_neo4j_ingestion
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

from ingestion.biography_ingester import BiographyIngester

# Sample Ronald Reagan biography text for testing
REAGAN_SAMPLE_TEXT = """
Ronald Wilson Reagan was the 40th President of the United States, serving from 1981 to 1989.
Born on February 6, 1911, in Tampico, Illinois, Reagan's journey from small-town America to
the White House is a quintessential American success story.

Before entering politics, Reagan had a successful career in Hollywood, appearing in over 50 films.
His experience as an actor gave him exceptional communication skills, earning him the nickname
"The Great Communicator." His ability to connect with the American public was unparalleled.

Reagan married Nancy Davis in 1952, and their partnership became one of the most devoted
marriages in presidential history. Nancy was fiercely protective of her husband, serving as
his closest advisor and confidante. Their bond was described as "a love affair that lasted
a lifetime."

During his presidency, Reagan faced numerous challenges, including the Cold War with the Soviet Union.
His leadership style emphasized optimism, American exceptionalism, and a strong stance against
communism. He famously challenged Soviet leader Mikhail Gorbachev to "tear down this wall"
at the Berlin Wall in 1987.

The assassination attempt on March 30, 1981, tested both Reagan's resilience and the Reagans'
marriage. Nancy's devotion during his recovery became legendary, and she never left his side
during his hospital stay. Reagan's humor in the face of danger - telling Nancy "Honey, I forgot
to duck" - revealed his character and their intimate partnership.

Reagan's economic policies, known as "Reaganomics," focused on tax cuts, deregulation, and
reduced government spending. While controversial, these policies shaped American economic
policy for decades.

In his later years, Reagan was diagnosed with Alzheimer's disease. He disclosed his diagnosis
in a handwritten letter to the American people in 1994, displaying the same grace that had
defined his public life. Nancy became his devoted caregiver until his death on June 5, 2004.

Their love story endures as a testament to partnership, loyalty, and devotion. As Nancy
once said, "My life really began when I married my husband."
"""

def main():
    print("=" * 60)
    print("GENESIS Neo4j Biography Ingestion Test")
    print("=" * 60)

    # Check for Neo4j credentials
    neo4j_uri = os.environ.get("NEO4J_URI")
    neo4j_password = os.environ.get("NEO4J_PASSWORD")

    if not neo4j_uri or not neo4j_password:
        print("\nERROR: Neo4j credentials not found in environment.")
        print("Please set NEO4J_URI and NEO4J_PASSWORD environment variables.")
        print("\nAlternatively, you can set them in .env file:")
        print("  NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io")
        print("  NEO4J_PASSWORD=your-password")
        return

    print(f"\nNeo4j URI: {neo4j_uri[:50]}...")
    print(f"Neo4j User: {os.environ.get('NEO4J_USER', 'neo4j')}")

    # Initialize ingester (Neo4j only for this test - skip pgvector)
    print("\nInitializing BiographyIngester...")
    ingester = BiographyIngester(
        neo4j_uri=neo4j_uri,
        neo4j_user=os.environ.get("NEO4J_USER", "neo4j"),
        neo4j_password=neo4j_password,
        openai_api_key=os.environ.get("OPENAI_API_KEY")  # Optional for enrichment
    )

    # Progress callback
    def progress(stage, current, total):
        print(f"  [{stage}] {current}/{total}")

    # Run ingestion
    print("\nIngesting Ronald Reagan sample biography...")
    print("-" * 40)

    result = ingester.ingest_text(
        text=REAGAN_SAMPLE_TEXT,
        profile_id="historical_ronald_reagan",
        profile_name="Ronald Reagan",
        profile_context="Ronald Reagan, 40th President of the United States, married to Nancy Reagan",
        source_file="test_sample.txt",
        progress_callback=progress
    )

    # Print results
    print("-" * 40)
    print("\nIngestion Results:")
    print(f"  Success: {result.success}")
    print(f"  Profile ID: {result.profile_id}")
    print(f"  Chunks Created: {result.chunks_created}")
    print(f"  Chunks Stored in pgvector: {result.chunks_stored_pgvector}")
    print(f"  Chunks Stored in Neo4j: {result.chunks_stored_neo4j}")
    print(f"  Processing Time: {result.processing_time_seconds:.2f} seconds")

    if result.errors:
        print(f"  Errors: {result.errors}")

    # Cleanup
    ingester.close()

    print("\n" + "=" * 60)
    if result.chunks_stored_neo4j > 0:
        print("SUCCESS! Neo4j now has BiographyChunk data.")
        print("Test the GraphRAG endpoint again:")
        print('  curl -X POST https://us-central1-astroprofile-391e6.cloudfunctions.net/graphrag_topic_context \\')
        print('    -H "Content-Type: application/json" \\')
        print('    -d \'{"topic": "leadership", "profileId": "historical_ronald_reagan", "limit": 3}\'')
    else:
        print("No data stored in Neo4j. Check credentials and errors above.")
    print("=" * 60)


if __name__ == "__main__":
    main()
