-- ============================================================================
-- WEEK 6: EFFECTIVENESS FEEDBACK LOOP TABLES
-- ============================================================================
-- Phase 2 Week 2: Luna Learns What Works
--
-- Tables:
-- 1. luna_approach_effectiveness - Pattern storage for learning
--
-- Created: December 31, 2025
-- ============================================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION 1: APPROACH EFFECTIVENESS PATTERNS
-- ============================================================================
-- Stores effectiveness patterns for Luna's learning system
-- Uses 50D state vectors for pattern matching

CREATE TABLE IF NOT EXISTS luna_approach_effectiveness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,

    -- User state at time of approach
    user_state JSONB NOT NULL, -- Full state object
    user_state_vector vector(50), -- 50D vector for similarity search

    -- Constitutional context
    constitutional_context JSONB DEFAULT '{}'::JSONB,

    -- Temporal context
    temporal_context JSONB DEFAULT '{}'::JSONB,
    -- {time_of_day, day_of_week, season, is_weekend, time_period}

    -- Approach used
    approach_type VARCHAR(50) NOT NULL, -- '3-stack', 'advice', 'question', etc.
    approach_details JSONB DEFAULT '{}'::JSONB,
    goal VARCHAR(100) DEFAULT 'reduce_sadness',

    -- User response (from ResponseDetector)
    user_response JSONB DEFAULT '{}'::JSONB,

    -- Effectiveness result (from EffectivenessCalculator)
    effectiveness DECIMAL(4,3) NOT NULL CHECK (effectiveness BETWEEN 0 AND 1),
    verdict VARCHAR(20) NOT NULL CHECK (verdict IN ('WORKED', 'NEUTRAL', 'FAILED')),

    -- Learning output
    lesson TEXT,
    recommendation TEXT,

    -- Pattern status
    status VARCHAR(20) DEFAULT 'TESTING' CHECK (status IN ('TESTING', 'PROVEN', 'DEPRECATED')),
    times_used INTEGER DEFAULT 1,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SECTION 2: APPROACH STATISTICS (Aggregated)
-- ============================================================================
-- Aggregated statistics for each approach type per user

CREATE TABLE IF NOT EXISTS luna_approach_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    approach_type VARCHAR(50) NOT NULL,

    -- Aggregate statistics
    total_uses INTEGER DEFAULT 0,
    total_worked INTEGER DEFAULT 0,
    total_neutral INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,

    -- Effectiveness metrics
    avg_effectiveness DECIMAL(4,3) DEFAULT 0.5,
    max_effectiveness DECIMAL(4,3) DEFAULT 0,
    min_effectiveness DECIMAL(4,3) DEFAULT 1,

    -- Success rate
    success_rate DECIMAL(4,3) DEFAULT 0, -- (worked / total_uses)

    -- Best contexts (learned over time)
    best_for_states JSONB DEFAULT '[]'::JSONB, -- States where this works well
    avoid_for_states JSONB DEFAULT '[]'::JSONB, -- States where this doesn't work
    best_time_periods JSONB DEFAULT '[]'::JSONB, -- Time periods where this works

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- One row per user-approach combination
    CONSTRAINT luna_approach_stats_unique UNIQUE (user_id, approach_type)
);

-- ============================================================================
-- SECTION 3: INDEXES
-- ============================================================================

-- Approach effectiveness indexes
CREATE INDEX IF NOT EXISTS idx_approach_eff_user ON luna_approach_effectiveness(user_id);
CREATE INDEX IF NOT EXISTS idx_approach_eff_type ON luna_approach_effectiveness(user_id, approach_type);
CREATE INDEX IF NOT EXISTS idx_approach_eff_verdict ON luna_approach_effectiveness(user_id, verdict);
CREATE INDEX IF NOT EXISTS idx_approach_eff_effectiveness ON luna_approach_effectiveness(user_id, effectiveness DESC);
CREATE INDEX IF NOT EXISTS idx_approach_eff_status ON luna_approach_effectiveness(status);

-- Vector index for state similarity search
CREATE INDEX IF NOT EXISTS idx_approach_eff_vector ON luna_approach_effectiveness
    USING hnsw (user_state_vector vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Approach stats indexes
CREATE INDEX IF NOT EXISTS idx_approach_stats_user ON luna_approach_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_approach_stats_success ON luna_approach_stats(user_id, success_rate DESC);

-- ============================================================================
-- SECTION 4: HELPER FUNCTIONS
-- ============================================================================

-- Function to find similar patterns using vector similarity
CREATE OR REPLACE FUNCTION find_similar_patterns(
    p_user_id VARCHAR(128),
    p_state_vector vector(50),
    p_limit INTEGER DEFAULT 5,
    p_similarity_threshold DECIMAL DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    approach_type VARCHAR(50),
    approach_details JSONB,
    effectiveness DECIMAL,
    verdict VARCHAR(20),
    lesson TEXT,
    recommendation TEXT,
    similarity DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        lae.id,
        lae.approach_type,
        lae.approach_details,
        lae.effectiveness,
        lae.verdict,
        lae.lesson,
        lae.recommendation,
        (1 - (lae.user_state_vector <=> p_state_vector))::DECIMAL as similarity
    FROM luna_approach_effectiveness lae
    WHERE lae.user_id = p_user_id
      AND (1 - (lae.user_state_vector <=> p_state_vector)) >= p_similarity_threshold
    ORDER BY lae.user_state_vector <=> p_state_vector
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get best approach for current state
CREATE OR REPLACE FUNCTION get_best_approach(
    p_user_id VARCHAR(128),
    p_state_vector vector(50),
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    approach_type VARCHAR(50),
    avg_effectiveness DECIMAL,
    times_used BIGINT,
    recommendation TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        lae.approach_type,
        AVG(lae.effectiveness)::DECIMAL as avg_eff,
        COUNT(*) as times,
        MAX(lae.recommendation) as rec
    FROM luna_approach_effectiveness lae
    WHERE lae.user_id = p_user_id
      AND lae.verdict = 'WORKED'
      AND (1 - (lae.user_state_vector <=> p_state_vector)) >= 0.6
    GROUP BY lae.approach_type
    ORDER BY avg_eff DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to update approach stats after recording a pattern
CREATE OR REPLACE FUNCTION update_approach_stats(
    p_user_id VARCHAR(128),
    p_approach_type VARCHAR(50),
    p_effectiveness DECIMAL,
    p_verdict VARCHAR(20)
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO luna_approach_stats (
        user_id, approach_type,
        total_uses, total_worked, total_neutral, total_failed,
        avg_effectiveness, max_effectiveness, min_effectiveness, success_rate
    ) VALUES (
        p_user_id, p_approach_type,
        1,
        CASE WHEN p_verdict = 'WORKED' THEN 1 ELSE 0 END,
        CASE WHEN p_verdict = 'NEUTRAL' THEN 1 ELSE 0 END,
        CASE WHEN p_verdict = 'FAILED' THEN 1 ELSE 0 END,
        p_effectiveness,
        p_effectiveness,
        p_effectiveness,
        CASE WHEN p_verdict = 'WORKED' THEN 1.0 ELSE 0.0 END
    )
    ON CONFLICT (user_id, approach_type)
    DO UPDATE SET
        total_uses = luna_approach_stats.total_uses + 1,
        total_worked = luna_approach_stats.total_worked + CASE WHEN p_verdict = 'WORKED' THEN 1 ELSE 0 END,
        total_neutral = luna_approach_stats.total_neutral + CASE WHEN p_verdict = 'NEUTRAL' THEN 1 ELSE 0 END,
        total_failed = luna_approach_stats.total_failed + CASE WHEN p_verdict = 'FAILED' THEN 1 ELSE 0 END,
        avg_effectiveness = (luna_approach_stats.avg_effectiveness * luna_approach_stats.total_uses + p_effectiveness) / (luna_approach_stats.total_uses + 1),
        max_effectiveness = GREATEST(luna_approach_stats.max_effectiveness, p_effectiveness),
        min_effectiveness = LEAST(luna_approach_stats.min_effectiveness, p_effectiveness),
        success_rate = (luna_approach_stats.total_worked + CASE WHEN p_verdict = 'WORKED' THEN 1 ELSE 0 END)::DECIMAL / (luna_approach_stats.total_uses + 1),
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF EFFECTIVENESS LOOP SCHEMA
-- ============================================================================
--
-- This migration implements:
-- 1. luna_approach_effectiveness - Pattern storage with 50D vectors
-- 2. luna_approach_stats - Aggregated statistics per approach
-- 3. Vector similarity search for finding similar patterns
-- 4. Helper functions for pattern matching and stats updates
--
-- Week 6 Complete: Luna can now learn what works.
-- ============================================================================
