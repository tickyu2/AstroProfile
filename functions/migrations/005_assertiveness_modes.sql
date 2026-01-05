-- ============================================================================
-- MIGRATION 005: ASSERTIVENESS MODES
-- ============================================================================
-- Creates tables for Week 9: Assertiveness Modes
-- Luna's different interaction styles: Gentle, Supportive, Direct, Playful, Firm
--
-- Tables:
--   - luna_mode_history: Track mode selections
--   - luna_mode_effectiveness: Learn what works per mode
--
-- Created: December 31, 2025
-- Week 9: Assertiveness Modes - Phase 3 Week 1
-- ============================================================================

-- ============================================================================
-- TABLE: luna_mode_history
-- ============================================================================
-- Tracks which assertiveness mode was selected and why.
-- Used for analysis and debugging mode selection algorithm.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_mode_history (
  id SERIAL PRIMARY KEY,

  -- User identification
  user_id TEXT NOT NULL,

  -- Selected mode
  mode TEXT NOT NULL CHECK (mode IN ('GENTLE', 'SUPPORTIVE', 'DIRECT', 'PLAYFUL', 'FIRM')),

  -- Why this mode was selected
  reason TEXT,

  -- Selection confidence (0-1)
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),

  -- Alternative modes considered
  alternatives JSONB DEFAULT '[]',

  -- Full selection context (for debugging)
  context JSONB DEFAULT '{}',

  -- Timestamp
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_mode_history_user_id
ON luna_mode_history(user_id);

CREATE INDEX IF NOT EXISTS idx_mode_history_mode
ON luna_mode_history(mode);

CREATE INDEX IF NOT EXISTS idx_mode_history_timestamp
ON luna_mode_history(timestamp);

CREATE INDEX IF NOT EXISTS idx_mode_history_user_mode
ON luna_mode_history(user_id, mode);

-- ============================================================================
-- TABLE: luna_mode_effectiveness
-- ============================================================================
-- Tracks effectiveness of each mode for learning.
-- Helps personalize mode selection per user over time.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_mode_effectiveness (
  id SERIAL PRIMARY KEY,

  -- User identification
  user_id TEXT NOT NULL,

  -- Mode used
  mode TEXT NOT NULL CHECK (mode IN ('GENTLE', 'SUPPORTIVE', 'DIRECT', 'PLAYFUL', 'FIRM')),

  -- Effectiveness score (0-1)
  effectiveness NUMERIC CHECK (effectiveness >= 0 AND effectiveness <= 1),

  -- User's response type (for additional analysis)
  response_type TEXT CHECK (response_type IN ('positive', 'neutral', 'negative')),

  -- Timestamp
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_mode_effectiveness_user_id
ON luna_mode_effectiveness(user_id);

CREATE INDEX IF NOT EXISTS idx_mode_effectiveness_user_mode
ON luna_mode_effectiveness(user_id, mode);

CREATE INDEX IF NOT EXISTS idx_mode_effectiveness_timestamp
ON luna_mode_effectiveness(timestamp);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Mode statistics per user
CREATE OR REPLACE VIEW luna_mode_stats AS
SELECT
  user_id,
  mode,
  COUNT(*) as usage_count,
  AVG(effectiveness) as avg_effectiveness,
  STDDEV(effectiveness) as std_effectiveness,
  MIN(effectiveness) as min_effectiveness,
  MAX(effectiveness) as max_effectiveness,
  COUNT(CASE WHEN effectiveness >= 0.7 THEN 1 END) as success_count,
  COUNT(CASE WHEN effectiveness < 0.4 THEN 1 END) as failure_count
FROM luna_mode_effectiveness
GROUP BY user_id, mode;

-- View: Mode usage summary across all users
CREATE OR REPLACE VIEW luna_mode_usage_summary AS
SELECT
  mode,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_selections,
  AVG(confidence) as avg_confidence
FROM luna_mode_history
GROUP BY mode
ORDER BY total_selections DESC;

-- View: Recent mode selections (last 7 days)
CREATE OR REPLACE VIEW luna_recent_mode_selections AS
SELECT
  user_id,
  mode,
  reason,
  confidence,
  timestamp
FROM luna_mode_history
WHERE timestamp > NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC;

-- View: Best performing modes per user
CREATE OR REPLACE VIEW luna_user_best_modes AS
SELECT DISTINCT ON (user_id)
  user_id,
  mode as best_mode,
  avg_effectiveness,
  usage_count
FROM luna_mode_stats
WHERE usage_count >= 3
ORDER BY user_id, avg_effectiveness DESC;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE luna_mode_history IS
  'Tracks which assertiveness mode was selected for each interaction';

COMMENT ON TABLE luna_mode_effectiveness IS
  'Tracks effectiveness of each mode to personalize selection over time';

COMMENT ON COLUMN luna_mode_history.mode IS
  'GENTLE: nurturing, SUPPORTIVE: encouraging, DIRECT: honest, PLAYFUL: fun, FIRM: protective';

COMMENT ON COLUMN luna_mode_history.reason IS
  'Why mode was selected: safety_concern, explicit_request, primary_emotion_match, keyword_match, etc';

COMMENT ON COLUMN luna_mode_effectiveness.response_type IS
  'User response classification: positive (worked), neutral, negative (failed)';

-- ============================================================================
-- HELPFUL QUERIES
-- ============================================================================

-- Get mode effectiveness for a specific user:
--
-- SELECT mode, AVG(effectiveness) as avg, COUNT(*) as count
-- FROM luna_mode_effectiveness
-- WHERE user_id = 'user123'
-- GROUP BY mode
-- ORDER BY avg DESC;

-- Get mode selection patterns for a user:
--
-- SELECT mode, reason, COUNT(*) as count
-- FROM luna_mode_history
-- WHERE user_id = 'user123'
-- GROUP BY mode, reason
-- ORDER BY count DESC;

-- Find users who benefit most from DIRECT mode:
--
-- SELECT user_id, avg_effectiveness, usage_count
-- FROM luna_mode_stats
-- WHERE mode = 'DIRECT' AND usage_count >= 5
-- ORDER BY avg_effectiveness DESC
-- LIMIT 10;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration
DO $$
BEGIN
  RAISE NOTICE 'Migration 005: Assertiveness Modes tables created successfully';
  RAISE NOTICE 'Tables: luna_mode_history, luna_mode_effectiveness';
  RAISE NOTICE 'Views: luna_mode_stats, luna_mode_usage_summary, luna_recent_mode_selections, luna_user_best_modes';
END $$;
