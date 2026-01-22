#!/usr/bin/env python3
"""
GENESIS Profile Ingester - Full Pipeline

Combines profile conversion with database ingestion:
1. Reads JavaScript profiles from src/profiles/
2. Converts to text chunks with semantic chunking (20% overlap)
3. Generates embeddings (OpenAI text-embedding-3-small)
4. Stores in PostgreSQL (pgvector) and/or Neo4j

Usage:
    # Preview what would be ingested
    python ingest_profiles.py --dry-run

    # Ingest to PostgreSQL only
    python ingest_profiles.py --target postgres

    # Ingest to both PostgreSQL and Neo4j
    python ingest_profiles.py --target all

    # Ingest specific profile
    python ingest_profiles.py --profile ronaldReagan --target postgres
"""

import os
import sys
import json
import hashlib
import argparse
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

# Add parent directory for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from scripts.convert_profiles_to_chunks import ProfileConverter

# Optional imports - gracefully handle missing dependencies
try:
    import psycopg2
    from psycopg2.extras import execute_values
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False
    print("Warning: psycopg2 not installed. PostgreSQL ingestion disabled.")

try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False
    print("Warning: openai not installed. Embedding generation disabled.")

try:
    from neo4j import GraphDatabase
    HAS_NEO4J = True
except ImportError:
    HAS_NEO4J = False
    print("Warning: neo4j not installed. Neo4j ingestion disabled.")


class ProfileIngester:
    """
    Full ingestion pipeline for GENESIS profiles.

    Converts JS profiles -> chunks -> embeddings -> storage
    """

    def __init__(
        self,
        postgres_url: str = None,
        openai_api_key: str = None,
        neo4j_uri: str = None,
        neo4j_user: str = None,
        neo4j_password: str = None,
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ):
        """
        Initialize the ingester.

        Args:
            postgres_url: PostgreSQL connection string
            openai_api_key: OpenAI API key for embeddings
            neo4j_uri: Neo4j connection URI
            neo4j_user: Neo4j username
            neo4j_password: Neo4j password
            chunk_size: Target chunk size (default 1000)
            chunk_overlap: Overlap size (default 200 = 20%)
        """
        # Load from environment if not provided
        self.postgres_url = postgres_url or os.getenv('DATABASE_URL')
        self.openai_api_key = openai_api_key or os.getenv('OPENAI_API_KEY')
        self.neo4j_uri = neo4j_uri or os.getenv('NEO4J_URI')
        self.neo4j_user = neo4j_user or os.getenv('NEO4J_USER', 'neo4j')
        self.neo4j_password = neo4j_password or os.getenv('NEO4J_PASSWORD')

        # Initialize converter
        self.converter = ProfileConverter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )

        # Initialize OpenAI client
        self.openai_client = None
        if HAS_OPENAI and self.openai_api_key:
            self.openai_client = openai.OpenAI(api_key=self.openai_api_key)

        # Stats tracking
        self.stats = {
            'profiles_processed': 0,
            'chunks_created': 0,
            'chunks_stored_postgres': 0,
            'chunks_stored_neo4j': 0,
            'embeddings_generated': 0,
            'errors': []
        }

    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding using OpenAI text-embedding-3-small"""
        if not self.openai_client:
            return None

        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text[:8000]  # Truncate if too long
            )
            self.stats['embeddings_generated'] += 1
            return response.data[0].embedding
        except Exception as e:
            self.stats['errors'].append(f"Embedding error: {e}")
            return None

    def store_to_postgres(self, chunks: List[Dict]) -> int:
        """Store chunks with embeddings to PostgreSQL"""
        if not HAS_POSTGRES or not self.postgres_url:
            print("PostgreSQL not configured")
            return 0

        try:
            conn = psycopg2.connect(self.postgres_url)
            cur = conn.cursor()

            # Prepare data for bulk insert
            rows = []
            for chunk in chunks:
                metadata = chunk.get('metadata', {})

                # Generate embedding
                embedding = self.generate_embedding(chunk['text'])

                # Extract arrays for filtering
                topics = metadata.get('detected_topics', [])
                entities = metadata.get('detected_entities', [])
                themes = metadata.get('constitutional_themes', [])
                dynamics = metadata.get('relationship_dynamics', [])

                rows.append((
                    chunk.get('chunk_hash'),
                    metadata.get('profile_id'),
                    metadata.get('profile_name'),
                    chunk.get('chunk_index', 0),
                    chunk['text'],
                    topics if isinstance(topics, list) else [],
                    metadata.get('sentiment'),
                    entities if isinstance(entities, list) else [],
                    themes if isinstance(themes, list) else [],
                    dynamics if isinstance(dynamics, list) else [],
                    json.dumps(metadata),
                    embedding
                ))

            # Bulk insert with ON CONFLICT
            insert_sql = """
                INSERT INTO biography_chunks (
                    chunk_hash, profile_id, profile_name, chunk_index,
                    content, topics, sentiment, entities,
                    constitutional_themes, relationship_dynamics,
                    metadata, embedding
                ) VALUES %s
                ON CONFLICT (chunk_hash) DO UPDATE SET
                    content = EXCLUDED.content,
                    topics = EXCLUDED.topics,
                    sentiment = EXCLUDED.sentiment,
                    entities = EXCLUDED.entities,
                    constitutional_themes = EXCLUDED.constitutional_themes,
                    relationship_dynamics = EXCLUDED.relationship_dynamics,
                    metadata = EXCLUDED.metadata,
                    embedding = EXCLUDED.embedding,
                    updated_at = CURRENT_TIMESTAMP
            """

            execute_values(cur, insert_sql, rows, template="""(
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s::vector
            )""")

            conn.commit()
            cur.close()
            conn.close()

            self.stats['chunks_stored_postgres'] = len(rows)
            return len(rows)

        except Exception as e:
            self.stats['errors'].append(f"PostgreSQL error: {e}")
            print(f"PostgreSQL error: {e}")
            return 0

    def store_to_neo4j(self, chunks: List[Dict]) -> int:
        """Store chunks to Neo4j graph database"""
        if not HAS_NEO4J or not self.neo4j_uri:
            print("Neo4j not configured")
            return 0

        try:
            driver = GraphDatabase.driver(
                self.neo4j_uri,
                auth=(self.neo4j_user, self.neo4j_password)
            )

            stored = 0

            with driver.session() as session:
                for chunk in chunks:
                    metadata = chunk.get('metadata', {})

                    # Create or merge BiographyChunk node
                    session.run("""
                        MERGE (c:BiographyChunk {chunk_hash: $hash})
                        SET c.text = $text,
                            c.chunk_index = $index,
                            c.profile_id = $profile_id,
                            c.profile_name = $profile_name,
                            c.section_type = $section_type,
                            c.section_title = $section_title,
                            c.word_count = $word_count,
                            c.updated_at = datetime()
                    """, {
                        'hash': chunk.get('chunk_hash'),
                        'text': chunk['text'],
                        'index': chunk.get('chunk_index', 0),
                        'profile_id': metadata.get('profile_id'),
                        'profile_name': metadata.get('profile_name'),
                        'section_type': metadata.get('section_type'),
                        'section_title': metadata.get('section_title'),
                        'word_count': metadata.get('word_count', 0)
                    })

                    # Link to GuestProfile
                    profile_id = metadata.get('profile_id')
                    if profile_id:
                        session.run("""
                            MATCH (c:BiographyChunk {chunk_hash: $hash})
                            MERGE (p:GuestProfile {profile_id: $profile_id})
                            SET p.name = $name
                            MERGE (p)-[:HAS_BIOGRAPHY_CHUNK]->(c)
                        """, {
                            'hash': chunk.get('chunk_hash'),
                            'profile_id': profile_id,
                            'name': metadata.get('profile_name')
                        })

                    # Create topic nodes and relationships
                    topics = metadata.get('detected_topics', [])
                    for topic in topics:
                        if topic:
                            session.run("""
                                MATCH (c:BiographyChunk {chunk_hash: $hash})
                                MERGE (t:Topic {name: $topic})
                                MERGE (c)-[:DISCUSSES]->(t)
                            """, {'hash': chunk.get('chunk_hash'), 'topic': topic})

                    stored += 1

            driver.close()
            self.stats['chunks_stored_neo4j'] = stored
            return stored

        except Exception as e:
            self.stats['errors'].append(f"Neo4j error: {e}")
            print(f"Neo4j error: {e}")
            return 0

    def ingest_all_profiles(
        self,
        target: str = 'all',
        dry_run: bool = False,
        verbose: bool = True
    ) -> Dict:
        """
        Ingest all profiles.

        Args:
            target: 'postgres', 'neo4j', or 'all'
            dry_run: Preview without storing
            verbose: Print progress

        Returns:
            Stats dictionary
        """
        if verbose:
            print("="*60)
            print("GENESIS Profile Ingestion Pipeline")
            print("="*60)
            print(f"Target: {target}")
            print(f"Dry run: {dry_run}")
            print()

        # Convert all profiles to chunks
        chunks = self.converter.convert_all_profiles(
            dry_run=False,
            verbose=verbose
        )

        self.stats['chunks_created'] = len(chunks)

        if dry_run:
            if verbose:
                print(f"\nDry run: Would ingest {len(chunks)} chunks")
                print("\nSample chunks:")
                for chunk in chunks[:3]:
                    print(f"  - {chunk['metadata'].get('profile_name')}: {chunk['metadata'].get('section_title')}")
            return self.stats

        # Store to targets
        if target in ['postgres', 'all']:
            if verbose:
                print(f"\nStoring to PostgreSQL...")
            stored = self.store_to_postgres(chunks)
            if verbose:
                print(f"  Stored {stored} chunks")

        if target in ['neo4j', 'all']:
            if verbose:
                print(f"\nStoring to Neo4j...")
            stored = self.store_to_neo4j(chunks)
            if verbose:
                print(f"  Stored {stored} chunks")

        # Summary
        if verbose:
            print("\n" + "="*60)
            print("INGESTION COMPLETE")
            print("="*60)
            print(f"Chunks created: {self.stats['chunks_created']}")
            print(f"PostgreSQL: {self.stats['chunks_stored_postgres']}")
            print(f"Neo4j: {self.stats['chunks_stored_neo4j']}")
            print(f"Embeddings: {self.stats['embeddings_generated']}")
            if self.stats['errors']:
                print(f"Errors: {len(self.stats['errors'])}")
                for err in self.stats['errors'][:5]:
                    print(f"  - {err}")

        return self.stats

    def ingest_single_profile(
        self,
        profile_name: str,
        target: str = 'all',
        verbose: bool = True
    ) -> Dict:
        """Ingest a single profile by name"""
        if verbose:
            print(f"Ingesting profile: {profile_name}")

        chunks = self.converter.convert_single_profile(profile_name, verbose=verbose)
        self.stats['chunks_created'] = len(chunks)

        if target in ['postgres', 'all']:
            self.store_to_postgres(chunks)

        if target in ['neo4j', 'all']:
            self.store_to_neo4j(chunks)

        return self.stats


def main():
    parser = argparse.ArgumentParser(
        description="Ingest GENESIS profiles to database"
    )
    parser.add_argument(
        '--target',
        type=str,
        choices=['postgres', 'neo4j', 'all'],
        default='postgres',
        help="Target database(s)"
    )
    parser.add_argument(
        '--profile',
        type=str,
        help="Ingest single profile by name"
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help="Preview without storing"
    )
    parser.add_argument(
        '--chunk-size',
        type=int,
        default=1000,
        help="Target chunk size"
    )
    parser.add_argument(
        '--overlap',
        type=int,
        default=200,
        help="Chunk overlap (20%% = 200)"
    )
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        default=True,
        help="Verbose output"
    )

    args = parser.parse_args()

    # Check environment
    if not args.dry_run:
        if args.target in ['postgres', 'all'] and not os.getenv('DATABASE_URL'):
            print("Warning: DATABASE_URL not set. PostgreSQL storage will be skipped.")
        if not os.getenv('OPENAI_API_KEY'):
            print("Warning: OPENAI_API_KEY not set. Embeddings will be skipped.")
        if args.target in ['neo4j', 'all'] and not os.getenv('NEO4J_URI'):
            print("Warning: NEO4J_URI not set. Neo4j storage will be skipped.")

    ingester = ProfileIngester(
        chunk_size=args.chunk_size,
        chunk_overlap=args.overlap
    )

    if args.profile:
        stats = ingester.ingest_single_profile(
            args.profile,
            target=args.target,
            verbose=args.verbose
        )
    else:
        stats = ingester.ingest_all_profiles(
            target=args.target,
            dry_run=args.dry_run,
            verbose=args.verbose
        )

    # Exit with error code if there were errors
    if stats.get('errors'):
        sys.exit(1)


if __name__ == "__main__":
    main()
