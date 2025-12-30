-- ═══════════════════════════════════════════════════════════════════════════
-- GENESIS MCP - Optional PostgreSQL Schema
-- ═══════════════════════════════════════════════════════════════════════════
--
-- OPTIONAL: Adds MCP-related tables to your existing Cloud SQL PostgreSQL
-- Integrates with your existing cultural_memory and user_timeline tables
--
-- Benefits:
-- - Faster querying for audit logs (vs Firestore)
-- - Vector embeddings for MCP query patterns
-- - Analytics on MCP usage
-- - Joins with existing timeline data
--
-- Run this AFTER your existing schema (cultural_memory, user_timeline)
--
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable pgvector extension (you already have this)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- ═══════════════════════════════════════════════════════════════════════════
-- MCP Audit Log Table (Alternative to Firestore)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mcp_audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    tool_name VARCHAR(128) NOT NULL,
    ai_client VARCHAR(64) NOT NULL DEFAULT 'claude-sonnet-4',
    
    -- Request details
    request_id UUID DEFAULT gen_random_uuid(),
    session_id VARCHAR(128),
    ip_address INET,
    
    -- Response details
    success BOOLEAN NOT NULL,
    response_time_ms INTEGER,
    error_message TEXT,
    
    -- Rate limiting
    rate_limit_current INTEGER,
    rate_limit_max INTEGER,
    rate_limit_reset_at TIMESTAMPTZ,
    
    -- Metadata
    request_metadata JSONB DEFAULT '{}',
    response_metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_mcp_audit_user_time (user_id, created_at DESC),
    INDEX idx_mcp_audit_tool_time (tool_name, created_at DESC),
    INDEX idx_mcp_audit_client (ai_client),
    INDEX idx_mcp_audit_success (success, created_at DESC)
);

-- Add comments for documentation
COMMENT ON TABLE mcp_audit_log IS 'MCP server access audit log - alternative to Firestore collection';
COMMENT ON COLUMN mcp_audit_log.user_id IS 'Firebase user ID from users collection';
COMMENT ON COLUMN mcp_audit_log.tool_name IS 'MCP tool that was called (e.g., get_user_constitution)';
COMMENT ON COLUMN mcp_audit_log.response_time_ms IS 'Response time in milliseconds for performance monitoring';

-- ═══════════════════════════════════════════════════════════════════════════
-- MCP Query Patterns Table (For learning AI query patterns)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mcp_query_patterns (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    
    -- Query analysis
    query_text TEXT,
    query_intent VARCHAR(128),
    tools_called TEXT[] DEFAULT '{}',
    
    -- Vector embedding for semantic similarity
    query_embedding vector(1536), -- OpenAI ada-002 dimensions
    
    -- Results
    result_summary TEXT,
    user_satisfaction_score FLOAT, -- 0-1, if we collect feedback
    
    -- Context
    conversation_id VARCHAR(128),
    previous_queries_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_mcp_patterns_user (user_id, created_at DESC),
    INDEX idx_mcp_patterns_intent (query_intent)
);

-- Vector similarity index (requires pgvector)
CREATE INDEX idx_mcp_patterns_embedding 
    ON mcp_query_patterns 
    USING ivfflat (query_embedding vector_cosine_ops)
    WITH (lists = 100);

COMMENT ON TABLE mcp_query_patterns IS 'Stores MCP query patterns for learning and improving AI responses';
COMMENT ON COLUMN mcp_query_patterns.query_embedding IS 'Vector embedding of query for semantic similarity search';

-- ═══════════════════════════════════════════════════════════════════════════
-- MCP Usage Statistics Table (Aggregated analytics)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mcp_usage_stats (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Tool usage counts
    total_requests INTEGER DEFAULT 0,
    successful_requests INTEGER DEFAULT 0,
    failed_requests INTEGER DEFAULT 0,
    
    -- Per-tool breakdown (JSONB for flexibility)
    tool_counts JSONB DEFAULT '{}',
    -- Example: {"get_user_constitution": 45, "get_birth_chart": 23, ...}
    
    -- Performance metrics
    avg_response_time_ms FLOAT,
    p95_response_time_ms FLOAT,
    p99_response_time_ms FLOAT,
    
    -- Rate limiting
    rate_limit_hits INTEGER DEFAULT 0,
    
    -- Timestamps
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, date),
    
    -- Indexes
    INDEX idx_mcp_stats_user_date (user_id, date DESC),
    INDEX idx_mcp_stats_date (date DESC)
);

COMMENT ON TABLE mcp_usage_stats IS 'Daily aggregated MCP usage statistics per user';

-- ═══════════════════════════════════════════════════════════════════════════
-- Integration with Existing Timeline Tables
-- ═══════════════════════════════════════════════════════════════════════════

-- Add MCP context to user_timeline (optional column)
ALTER TABLE user_timeline 
    ADD COLUMN IF NOT EXISTS mcp_query_id BIGINT REFERENCES mcp_query_patterns(id);

COMMENT ON COLUMN user_timeline.mcp_query_id IS 'Links timeline event to originating MCP query';

-- ═══════════════════════════════════════════════════════════════════════════
-- Views for Common Queries
-- ═══════════════════════════════════════════════════════════════════════════

-- View: Recent MCP activity per user
CREATE OR REPLACE VIEW mcp_recent_activity AS
SELECT 
    user_id,
    tool_name,
    ai_client,
    success,
    response_time_ms,
    created_at,
    CASE 
        WHEN success THEN '✅'
        ELSE '❌'
    END as status_icon
FROM mcp_audit_log
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- View: MCP tool performance
CREATE OR REPLACE VIEW mcp_tool_performance AS
SELECT 
    tool_name,
    COUNT(*) as total_calls,
    COUNT(*) FILTER (WHERE success) as successful_calls,
    COUNT(*) FILTER (WHERE NOT success) as failed_calls,
    ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_ms,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_ms,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_ms
FROM mcp_audit_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY tool_name
ORDER BY total_calls DESC;

-- View: MCP user engagement
CREATE OR REPLACE VIEW mcp_user_engagement AS
SELECT 
    user_id,
    COUNT(*) as total_queries,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    MIN(created_at) as first_query,
    MAX(created_at) as last_query,
    ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_ms
FROM mcp_audit_log
GROUP BY user_id
ORDER BY total_queries DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- Functions for Analytics
-- ═══════════════════════════════════════════════════════════════════════════

-- Function: Get similar MCP queries using vector search
CREATE OR REPLACE FUNCTION find_similar_mcp_queries(
    query_embedding_input vector(1536),
    similarity_threshold FLOAT DEFAULT 0.8,
    max_results INT DEFAULT 10
)
RETURNS TABLE (
    id BIGINT,
    user_id VARCHAR,
    query_text TEXT,
    query_intent VARCHAR,
    similarity_score FLOAT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        qp.id,
        qp.user_id,
        qp.query_text,
        qp.query_intent,
        1 - (qp.query_embedding <=> query_embedding_input) as similarity_score,
        qp.created_at
    FROM mcp_query_patterns qp
    WHERE 1 - (qp.query_embedding <=> query_embedding_input) > similarity_threshold
    ORDER BY qp.query_embedding <=> query_embedding_input
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function: Update usage stats (called by cron job or trigger)
CREATE OR REPLACE FUNCTION update_mcp_usage_stats()
RETURNS void AS $$
BEGIN
    INSERT INTO mcp_usage_stats (
        user_id,
        date,
        total_requests,
        successful_requests,
        failed_requests,
        tool_counts,
        avg_response_time_ms,
        p95_response_time_ms,
        p99_response_time_ms,
        rate_limit_hits
    )
    SELECT 
        user_id,
        DATE(created_at) as date,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE success) as successful_requests,
        COUNT(*) FILTER (WHERE NOT success) as failed_requests,
        jsonb_object_agg(
            tool_name, 
            COUNT(*)
        ) as tool_counts,
        AVG(response_time_ms) as avg_response_time_ms,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time_ms,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_time_ms,
        COUNT(*) FILTER (WHERE error_message LIKE '%rate limit%') as rate_limit_hits
    FROM mcp_audit_log
    WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
    GROUP BY user_id, DATE(created_at)
    ON CONFLICT (user_id, date) 
    DO UPDATE SET
        total_requests = EXCLUDED.total_requests,
        successful_requests = EXCLUDED.successful_requests,
        failed_requests = EXCLUDED.failed_requests,
        tool_counts = EXCLUDED.tool_counts,
        avg_response_time_ms = EXCLUDED.avg_response_time_ms,
        p95_response_time_ms = EXCLUDED.p95_response_time_ms,
        p99_response_time_ms = EXCLUDED.p99_response_time_ms,
        rate_limit_hits = EXCLUDED.rate_limit_hits,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- Sample Queries for Testing
-- ═══════════════════════════════════════════════════════════════════════════

-- Get user's MCP usage for last 7 days
-- SELECT * FROM mcp_recent_activity WHERE user_id = 'user_ticky_123';

-- Get tool performance metrics
-- SELECT * FROM mcp_tool_performance;

-- Get most engaged users
-- SELECT * FROM mcp_user_engagement LIMIT 10;

-- Find similar queries (requires embedding)
-- SELECT * FROM find_similar_mcp_queries('[vector here]'::vector, 0.8, 5);

-- Daily stats aggregation (run via cron)
-- SELECT update_mcp_usage_stats();

-- ═══════════════════════════════════════════════════════════════════════════
-- Migration Notes
-- ═══════════════════════════════════════════════════════════════════════════

-- OPTION 1: Use PostgreSQL for audit logs (better for analytics)
-- - Update server.js to write to PostgreSQL instead of Firestore
-- - Faster queries, better joins with timeline data
-- - More expensive ($49/month Cloud SQL vs free Firestore)

-- OPTION 2: Use Firestore for audit logs (simpler, cheaper)
-- - Keep current server.js implementation
-- - Use this schema only if you need advanced analytics later
-- - Can migrate data from Firestore to PostgreSQL later

-- RECOMMENDATION: Start with Firestore (Phase 1), migrate to PostgreSQL in Phase 3
-- when you want advanced analytics and timeline integration.

-- ═══════════════════════════════════════════════════════════════════════════
