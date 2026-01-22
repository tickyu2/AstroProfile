"""
GENESIS RAG Migration - Cloud Function

Deploy once to run the biography_chunks migration on Cloud SQL.

Deploy:
    gcloud functions deploy run_rag_migration \
        --runtime python311 \
        --trigger-http \
        --allow-unauthenticated \
        --region us-central1 \
        --set-env-vars CLOUD_SQL_CONNECTION_NAME=astroprofile-391e6:us-central1:genesismemory,PG_USER=postgres,PG_PASSWORD=YOUR_PASSWORD,PG_DATABASE=genesis_memory

Trigger:
    curl https://us-central1-astroprofile-391e6.cloudfunctions.net/run_rag_migration
"""

import os
import functions_framework
import pg8000
import sqlalchemy
from sqlalchemy import text

# Migration SQL
MIGRATION_SQL = """
-- Enable pgvector extension
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_biography_chunks_profile_id ON biography_chunks(profile_id);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_topics ON biography_chunks USING GIN(topics);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_entities ON biography_chunks USING GIN(entities);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_themes ON biography_chunks USING GIN(constitutional_themes);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_biography_chunks_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_biography_chunks_timestamp ON biography_chunks;
CREATE TRIGGER trigger_update_biography_chunks_timestamp
    BEFORE UPDATE ON biography_chunks
    FOR EACH ROW
    EXECUTE FUNCTION update_biography_chunks_timestamp();
"""


def get_db_connection():
    """Create Cloud SQL connection using Unix socket"""
    db_user = os.environ.get("PG_USER", "postgres")
    db_pass = os.environ.get("PG_PASSWORD", "")
    db_name = os.environ.get("PG_DATABASE", "genesis_memory")
    instance_connection_name = os.environ.get("CLOUD_SQL_CONNECTION_NAME")

    if not instance_connection_name:
        raise ValueError("CLOUD_SQL_CONNECTION_NAME not set")

    unix_socket_path = f"/cloudsql/{instance_connection_name}"

    pool = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL.create(
            drivername="postgresql+pg8000",
            username=db_user,
            password=db_pass,
            database=db_name,
            query={"unix_sock": f"{unix_socket_path}/.s.PGSQL.5432"}
        ),
        pool_size=1,
        max_overflow=0
    )

    return pool


@functions_framework.http
def run_rag_migration(request):
    """HTTP Cloud Function to run RAG migration"""
    try:
        pool = get_db_connection()

        with pool.connect() as conn:
            # Run migration
            conn.execute(text(MIGRATION_SQL))
            conn.commit()

            # Verify
            result = conn.execute(text("""
                SELECT
                    (SELECT COUNT(*) FROM biography_chunks) as row_count,
                    (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'biography_chunks') as index_count
            """))
            row = result.fetchone()

        return {
            "success": True,
            "message": "Migration completed successfully",
            "table": "biography_chunks",
            "rows": row[0] if row else 0,
            "indexes": row[1] if row else 0
        }, 200

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }, 500
