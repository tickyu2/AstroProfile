#!/bin/bash
# =============================================================================
# GENESIS RAG Complete Setup Script
# Run this from Google Cloud Shell: https://console.cloud.google.com/cloudshell
# =============================================================================

set -e

PROJECT_ID="astroprofile-391e6"
REGION="us-central1"
INSTANCE_NAME="genesismemory"
DATABASE="genesis_memory"
USER="postgres"

echo "============================================"
echo "GENESIS RAG Database Setup"
echo "============================================"

# Authenticate and set project
echo ""
echo "Step 1: Setting project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo ""
echo "Step 2: Enabling APIs..."
gcloud services enable sqladmin.googleapis.com
gcloud services enable cloudfunctions.googleapis.com

# Check if Cloud SQL instance exists
echo ""
echo "Step 3: Checking Cloud SQL instance..."
gcloud sql instances describe $INSTANCE_NAME --format="value(name)" || {
    echo "ERROR: Cloud SQL instance '$INSTANCE_NAME' not found"
    exit 1
}

# Run migration via Cloud SQL connect
echo ""
echo "Step 4: Running RAG migration..."
echo "Creating biography_chunks table with pgvector..."

# Create migration SQL file
cat > /tmp/rag_migration.sql << 'EOF'
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

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_biography_chunks_profile_id ON biography_chunks(profile_id);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_topics ON biography_chunks USING GIN(topics);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_entities ON biography_chunks USING GIN(entities);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_themes ON biography_chunks USING GIN(constitutional_themes);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_dynamics ON biography_chunks USING GIN(relationship_dynamics);

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

-- Verification
SELECT 'Migration Complete' as status,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'biography_chunks') as table_exists,
       (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'biography_chunks') as index_count;
EOF

# Connect and run migration
echo ""
echo "Connecting to Cloud SQL and running migration..."
echo "(You may be prompted for the database password)"
gcloud sql connect $INSTANCE_NAME --database=$DATABASE --user=$USER < /tmp/rag_migration.sql

echo ""
echo "============================================"
echo "RAG Migration Complete!"
echo "============================================"
echo ""
echo "Next step: Run profile ingestion locally with:"
echo "  export DATABASE_URL='postgresql://postgres:PASSWORD@localhost:5432/genesis_memory'"
echo "  export OPENAI_API_KEY='sk-...'"
echo "  python functions-python/scripts/ingest_profiles.py --target postgres"
echo ""
echo "Or use Cloud SQL Proxy:"
echo "  cloud_sql_proxy -instances=$PROJECT_ID:$REGION:$INSTANCE_NAME=tcp:5432 &"
echo "  python functions-python/scripts/ingest_profiles.py --target postgres"
