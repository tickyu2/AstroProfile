-- ============================================
-- GENESIS Migration 013: RAG Biography Chunks
-- ============================================
-- Creates the biography_chunks table for Hello History RAG
-- Stores chunked biography text with vector embeddings
--
-- Prerequisites:
--   - PostgreSQL 15+
--   - pgvector extension installed
--
-- Usage:
--   psql -d genesis -f 013_rag_biography_chunks.sql
-- ============================================

-- Ensure pgvector is installed
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- Table: biography_chunks
-- ============================================
-- Stores chunked biography text with embeddings for semantic search

CREATE TABLE IF NOT EXISTS biography_chunks (
    id SERIAL PRIMARY KEY,

    -- Unique hash for deduplication
    chunk_hash VARCHAR(64) UNIQUE,

    -- Profile identification
    profile_id VARCHAR(255) NOT NULL,
    profile_name VARCHAR(255),

    -- Chunk ordering
    chunk_index INTEGER,

    -- Content
    content TEXT NOT NULL,

    -- AI-extracted metadata (arrays for efficient filtering)
    topics TEXT[],
    sentiment VARCHAR(50),
    entities TEXT[],
    constitutional_themes TEXT[],
    relationship_dynamics TEXT[],

    -- Additional metadata (JSONB for flexibility)
    metadata JSONB DEFAULT '{}',

    -- Vector embedding (1536 dimensions for OpenAI text-embedding-3-small)
    embedding vector(1536),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes for efficient querying
-- ============================================

-- Profile filtering
CREATE INDEX IF NOT EXISTS idx_biography_profile
    ON biography_chunks(profile_id);

-- Array containment queries (GIN indexes)
CREATE INDEX IF NOT EXISTS idx_biography_topics
    ON biography_chunks USING GIN(topics);

CREATE INDEX IF NOT EXISTS idx_biography_entities
    ON biography_chunks USING GIN(entities);

CREATE INDEX IF NOT EXISTS idx_biography_themes
    ON biography_chunks USING GIN(constitutional_themes);

CREATE INDEX IF NOT EXISTS idx_biography_dynamics
    ON biography_chunks USING GIN(relationship_dynamics);

-- Sentiment filtering
CREATE INDEX IF NOT EXISTS idx_biography_sentiment
    ON biography_chunks(sentiment);

-- JSONB metadata queries
CREATE INDEX IF NOT EXISTS idx_biography_metadata
    ON biography_chunks USING GIN(metadata);

-- ============================================
-- Vector similarity index (IVFFlat)
-- ============================================
-- IVFFlat is faster for production with many rows
-- Lists = sqrt(rows), start with 100 for up to 10k chunks

CREATE INDEX IF NOT EXISTS idx_biography_embedding
    ON biography_chunks
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- ============================================
-- Update timestamp trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_biography_chunks_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_biography_chunks_timestamp ON biography_chunks;
CREATE TRIGGER trigger_biography_chunks_timestamp
    BEFORE UPDATE ON biography_chunks
    FOR EACH ROW
    EXECUTE FUNCTION update_biography_chunks_timestamp();

-- ============================================
-- Useful functions
-- ============================================

-- Search by topic
CREATE OR REPLACE FUNCTION search_biography_by_topic(
    search_topic TEXT,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id INTEGER,
    profile_id VARCHAR,
    profile_name VARCHAR,
    content TEXT,
    topics TEXT[],
    sentiment VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bc.id,
        bc.profile_id,
        bc.profile_name,
        bc.content,
        bc.topics,
        bc.sentiment
    FROM biography_chunks bc
    WHERE search_topic = ANY(bc.topics)
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Search by entity mention
CREATE OR REPLACE FUNCTION search_biography_by_entity(
    entity_name TEXT,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id INTEGER,
    profile_id VARCHAR,
    profile_name VARCHAR,
    content TEXT,
    entities TEXT[],
    sentiment VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bc.id,
        bc.profile_id,
        bc.profile_name,
        bc.content,
        bc.entities,
        bc.sentiment
    FROM biography_chunks bc
    WHERE entity_name = ANY(bc.entities)
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Verification
-- ============================================

DO $$
BEGIN
    RAISE NOTICE 'Migration 013: RAG Biography Chunks - COMPLETE';
    RAISE NOTICE 'Tables created: biography_chunks';
    RAISE NOTICE 'Indexes created: profile, topics, entities, themes, dynamics, sentiment, embedding';
    RAISE NOTICE 'Functions created: search_biography_by_topic, search_biography_by_entity';
END;
$$;

-- Show table structure
\d biography_chunks
