#!/usr/bin/env python3
"""
GENESIS Database Migration Runner

Runs PostgreSQL migrations for Cloud SQL.
Supports both direct connection (via proxy) and Unix socket (in Cloud).

Usage:
    # With Cloud SQL Proxy running locally:
    python run_migration.py --host localhost --port 5432

    # With Unix socket (Cloud Functions/Cloud Run):
    python run_migration.py --socket /cloudsql/PROJECT:REGION:INSTANCE

    # Using environment variables:
    python run_migration.py --from-env
"""

import os
import sys
import argparse
from pathlib import Path
from urllib.parse import quote_plus

try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
except ImportError:
    print("Error: psycopg2 not installed. Run: pip install psycopg2-binary")
    sys.exit(1)


# Migration SQL for biography_chunks table with pgvector
MIGRATION_SQL = """
-- Enable pgvector extension (Cloud SQL supports this)
CREATE EXTENSION IF NOT EXISTS vector;

-- Biography chunks table for RAG
CREATE TABLE IF NOT EXISTS biography_chunks (
    id SERIAL PRIMARY KEY,
    chunk_hash VARCHAR(64) UNIQUE,
    profile_id VARCHAR(255) NOT NULL,
    profile_name VARCHAR(255),
    chunk_index INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    topics TEXT[],
    sentiment VARCHAR(50),
    entities TEXT[],
    constitutional_themes TEXT[],
    relationship_dynamics TEXT[],
    metadata JSONB,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_biography_chunks_profile_id
    ON biography_chunks(profile_id);

CREATE INDEX IF NOT EXISTS idx_biography_chunks_topics
    ON biography_chunks USING GIN(topics);

CREATE INDEX IF NOT EXISTS idx_biography_chunks_entities
    ON biography_chunks USING GIN(entities);

CREATE INDEX IF NOT EXISTS idx_biography_chunks_themes
    ON biography_chunks USING GIN(constitutional_themes);

CREATE INDEX IF NOT EXISTS idx_biography_chunks_dynamics
    ON biography_chunks USING GIN(relationship_dynamics);

-- Vector similarity index (IVFFlat for production scale)
-- Note: IVFFlat requires data to build - start with exact search, add IVFFlat later
CREATE INDEX IF NOT EXISTS idx_biography_chunks_embedding
    ON biography_chunks USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Function to update timestamp on changes
CREATE OR REPLACE FUNCTION update_biography_chunks_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamp
DROP TRIGGER IF EXISTS trigger_update_biography_chunks_timestamp ON biography_chunks;
CREATE TRIGGER trigger_update_biography_chunks_timestamp
    BEFORE UPDATE ON biography_chunks
    FOR EACH ROW
    EXECUTE FUNCTION update_biography_chunks_timestamp();

-- Verification query
SELECT
    'biography_chunks' as table_name,
    (SELECT COUNT(*) FROM biography_chunks) as row_count,
    (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'biography_chunks') as index_count;
"""


def load_env_file(env_path: str = None):
    """Load environment variables from .env file"""
    if env_path is None:
        # Try common locations
        possible_paths = [
            Path(__file__).parent.parent.parent / "functions" / ".env",
            Path(__file__).parent.parent / ".env",
            Path.cwd() / ".env"
        ]
        for p in possible_paths:
            if p.exists():
                env_path = str(p)
                break

    if env_path and Path(env_path).exists():
        print(f"Loading environment from: {env_path}")
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
        return True
    return False


def get_connection_params(args) -> dict:
    """Build connection parameters from arguments or environment"""
    params = {}

    if args.from_env or args.host is None:
        # Load from environment
        load_env_file()

        params['database'] = os.getenv('PG_DATABASE', 'genesis_memory')
        params['user'] = os.getenv('PG_USER', 'postgres')
        params['password'] = os.getenv('PG_PASSWORD', '')

        # Check for socket vs host connection
        socket_path = os.getenv('CLOUD_SQL_CONNECTION_NAME')
        if socket_path and args.socket:
            params['host'] = f"/cloudsql/{socket_path}"
        elif args.host:
            params['host'] = args.host
            params['port'] = args.port or 5432
        else:
            # Default to localhost (assumes proxy is running)
            params['host'] = 'localhost'
            params['port'] = 5432
    else:
        params['host'] = args.host
        params['port'] = args.port or 5432
        params['database'] = args.database
        params['user'] = args.user
        params['password'] = args.password

    return params


def run_migration(params: dict, dry_run: bool = False) -> bool:
    """Execute the migration SQL"""
    print("\n" + "="*60)
    print("GENESIS RAG Migration Runner")
    print("="*60)

    print(f"\nConnecting to: {params.get('host')}:{params.get('port', 'socket')}")
    print(f"Database: {params.get('database')}")
    print(f"User: {params.get('user')}")

    if dry_run:
        print("\n[DRY RUN] Would execute migration SQL:")
        print("-"*40)
        print(MIGRATION_SQL[:500] + "...")
        return True

    try:
        # Connect to database
        conn = psycopg2.connect(**params)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        print("\nConnected successfully!")
        print("\nRunning migration...")

        # Execute migration
        cur.execute(MIGRATION_SQL)

        # Fetch verification results
        results = cur.fetchall()

        print("\n" + "-"*40)
        print("Migration completed successfully!")
        print("-"*40)

        for row in results:
            print(f"Table: {row[0]}")
            print(f"  Rows: {row[1]}")
            print(f"  Indexes: {row[2]}")

        cur.close()
        conn.close()

        return True

    except psycopg2.OperationalError as e:
        print(f"\n❌ Connection error: {e}")
        print("\nTroubleshooting:")
        print("  1. Ensure Cloud SQL Proxy is running:")
        print("     cloud_sql_proxy -instances=astroprofile-391e6:us-central1:genesismemory=tcp:5432")
        print("  2. Or use socket connection in Cloud Functions/Run")
        return False

    except psycopg2.Error as e:
        print(f"\n❌ Database error: {e}")
        return False

    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Run GENESIS RAG database migration"
    )
    parser.add_argument(
        '--host',
        type=str,
        help="Database host (default: localhost with proxy)"
    )
    parser.add_argument(
        '--port',
        type=int,
        default=5432,
        help="Database port (default: 5432)"
    )
    parser.add_argument(
        '--database',
        type=str,
        default='genesis_memory',
        help="Database name"
    )
    parser.add_argument(
        '--user',
        type=str,
        default='postgres',
        help="Database user"
    )
    parser.add_argument(
        '--password',
        type=str,
        help="Database password"
    )
    parser.add_argument(
        '--socket',
        action='store_true',
        help="Use Unix socket connection (for Cloud)"
    )
    parser.add_argument(
        '--from-env',
        action='store_true',
        help="Load connection params from environment/functions/.env"
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help="Show what would be executed without running"
    )

    args = parser.parse_args()

    params = get_connection_params(args)
    success = run_migration(params, dry_run=args.dry_run)

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
