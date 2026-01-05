-- ============================================================================
-- MIGRATION 004: PATTERN LEARNING
-- ============================================================================
-- Creates tables for Week 7: Pattern Learning & Aggregation
--
-- Tables:
--   - luna_learned_patterns: Aggregated patterns from effectiveness records
--
-- Created: December 31, 2025
-- Week 7: Pattern Learning - Phase 2 Week 3
-- ============================================================================

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABLE: luna_learned_patterns
-- ============================================================================
-- Stores aggregated patterns from luna_approach_effectiveness.
-- Each pattern represents a cluster of similar user states with
-- ranked approaches based on historical effectiveness.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_learned_patterns (
  id SERIAL PRIMARY KEY,

  -- User identification
  user_id VARCHAR(255) NOT NULL,

  -- State signature (human-readable description)
  -- Format: { emotionalState, dominantEmotion, context, timeOfDay, description }
  user_state_signature JSONB NOT NULL,

  -- 50D state vector for similarity search
  -- Uses pgvector for efficient cosine similarity queries
  user_state_vector vector(50),

  -- Approach rankings (sorted by effectiveness)
  -- Format: [{ approachType, avgEffectiveness, sampleSize, confidence, successRate, verdict }]
  approach_rankings JSONB NOT NULL,

  -- Recommended approach based on rankings
  recommended_approach VARCHAR(100),

  -- Approaches to avoid (low effectiveness, non-low confidence)
  avoid_approaches TEXT[],

  -- Overall confidence level (LOW, MODERATE, HIGH)
  confidence VARCHAR(20) DEFAULT 'LOW',

  -- Total sample size across all approaches
  sample_size INTEGER DEFAULT 0,

  -- Status of this pattern
  -- TESTING: Still being validated
  -- PROVEN: Consistent results across many attempts
  -- DEPRECATED: No longer reliable
  status VARCHAR(20) DEFAULT 'TESTING',

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_learned_patterns_user_id
ON luna_learned_patterns(user_id);

-- Index for vector similarity search (IVFFlat for approximate nearest neighbor)
CREATE INDEX IF NOT EXISTS idx_learned_patterns_vector
ON luna_learned_patterns USING ivfflat (user_state_vector vector_cosine_ops)
WITH (lists = 100);

-- Index for confidence level filtering
CREATE INDEX IF NOT EXISTS idx_learned_patterns_confidence
ON luna_learned_patterns(confidence);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_learned_patterns_status
ON luna_learned_patterns(status);

-- GIN index for JSONB signature queries
CREATE INDEX IF NOT EXISTS idx_learned_patterns_signature
ON luna_learned_patterns USING GIN (user_state_signature);

-- ============================================================================
-- UPDATE TRIGGER
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_learned_patterns_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on update
DROP TRIGGER IF EXISTS trigger_update_learned_patterns_timestamp ON luna_learned_patterns;
CREATE TRIGGER trigger_update_learned_patterns_timestamp
  BEFORE UPDATE ON luna_learned_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_learned_patterns_timestamp();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: High confidence patterns
CREATE OR REPLACE VIEW high_confidence_patterns AS
SELECT
  user_id,
  user_state_signature->>'description' as state_description,
  recommended_approach,
  confidence,
  sample_size,
  approach_rankings
FROM luna_learned_patterns
WHERE confidence = 'HIGH'
ORDER BY sample_size DESC;

-- View: Pattern statistics per user
CREATE OR REPLACE VIEW user_pattern_stats AS
SELECT
  user_id,
  COUNT(*) as total_patterns,
  SUM(CASE WHEN confidence = 'HIGH' THEN 1 ELSE 0 END) as high_confidence_patterns,
  SUM(CASE WHEN confidence = 'MODERATE' THEN 1 ELSE 0 END) as moderate_confidence_patterns,
  SUM(sample_size) as total_samples,
  MAX(updated_at) as last_updated
FROM luna_learned_patterns
GROUP BY user_id;

-- ============================================================================
-- HELPFUL QUERIES
-- ============================================================================

-- Find similar patterns using vector similarity:
--
-- SELECT
--   id,
--   user_state_signature->>'description' as description,
--   recommended_approach,
--   confidence,
--   1 - (user_state_vector <=> '[0.5,0.3,...]'::vector) as similarity
-- FROM luna_learned_patterns
-- WHERE user_id = 'user123'
-- ORDER BY user_state_vector <=> '[0.5,0.3,...]'::vector
-- LIMIT 5;

-- Get top approaches for a state:
--
-- SELECT
--   elem->>'approachType' as approach,
--   (elem->>'avgEffectiveness')::float as effectiveness,
--   (elem->>'sampleSize')::int as samples,
--   elem->>'confidence' as confidence
-- FROM luna_learned_patterns,
--   LATERAL jsonb_array_elements(approach_rankings) as elem
-- WHERE user_id = 'user123'
--   AND id = (
--     SELECT id FROM luna_learned_patterns
--     WHERE user_id = 'user123'
--     ORDER BY user_state_vector <=> '[...]'::vector
--     LIMIT 1
--   )
-- ORDER BY (elem->>'avgEffectiveness')::float DESC;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration
DO $$
BEGIN
  RAISE NOTICE 'Migration 004: Pattern Learning tables created successfully';
  RAISE NOTICE 'Tables: luna_learned_patterns';
  RAISE NOTICE 'Views: high_confidence_patterns, user_pattern_stats';
END $$;
