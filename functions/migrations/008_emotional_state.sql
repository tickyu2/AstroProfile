-- ============================================================================
-- MIGRATION 008: EMOTIONAL STATE TRACKING
-- ============================================================================
-- Persistent emotional states across sessions.
-- Provides emotional continuity - Luna remembers how user has been feeling.
--
-- States Tracked:
--   - affection: Warmth and care toward user (0-10)
--   - concern: Worry about user's wellbeing (0-10)
--   - trust: Level of established trust (0-10)
--   - curiosity: Interest in learning about user (0-10)
--
-- Features:
--   - Automatic decay over time (configurable)
--   - State history tracking
--   - Integration with emotion detection
--
-- Created: December 31, 2025
-- Week 11: Enhancement Week - Emotional State Tracking
-- ============================================================================

-- ============================================================================
-- TABLE: user_emotional_state
-- ============================================================================
-- Stores persistent emotional states for each user.
-- States decay over time to prevent infinite growth.
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_emotional_state (
  -- Primary key is user_id (one state per user)
  user_id TEXT PRIMARY KEY,

  -- Core emotional states (0-10 scale)
  affection NUMERIC DEFAULT 5.0 CHECK (affection >= 0 AND affection <= 10),
  concern NUMERIC DEFAULT 0.0 CHECK (concern >= 0 AND concern <= 10),
  trust NUMERIC DEFAULT 5.0 CHECK (trust >= 0 AND trust <= 10),
  curiosity NUMERIC DEFAULT 3.0 CHECK (curiosity >= 0 AND curiosity <= 10),

  -- Timestamps
  last_updated TIMESTAMP DEFAULT NOW(),
  last_interaction TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),

  -- State history (JSONB for tracking significant changes)
  state_history JSONB DEFAULT '[]'::jsonb
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS user_emotional_state_user_idx
  ON user_emotional_state(user_id);

-- Index for finding users needing decay (batch processing)
CREATE INDEX IF NOT EXISTS user_emotional_state_last_interaction_idx
  ON user_emotional_state(last_interaction);

-- ============================================================================
-- FUNCTION: apply_emotional_decay
-- ============================================================================
-- Applies time-based decay to emotional states.
-- Called when user returns after absence.
-- ============================================================================

CREATE OR REPLACE FUNCTION apply_emotional_decay(
  p_user_id TEXT,
  p_days_since_last INTEGER DEFAULT 1
) RETURNS TABLE (
  old_affection NUMERIC,
  new_affection NUMERIC,
  old_concern NUMERIC,
  new_concern NUMERIC,
  old_trust NUMERIC,
  new_trust NUMERIC,
  old_curiosity NUMERIC,
  new_curiosity NUMERIC
) AS $$
DECLARE
  decay_rate_standard NUMERIC := 0.5;  -- 0.5 points per day
  decay_rate_trust NUMERIC := 0.2;     -- Trust decays slower
  current_state RECORD;
BEGIN
  -- Get current state
  SELECT * INTO current_state
  FROM user_emotional_state
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Calculate decayed values
  old_affection := current_state.affection;
  new_affection := GREATEST(0, current_state.affection - (decay_rate_standard * p_days_since_last));

  old_concern := current_state.concern;
  new_concern := GREATEST(0, current_state.concern - (decay_rate_standard * p_days_since_last));

  old_trust := current_state.trust;
  new_trust := GREATEST(0, current_state.trust - (decay_rate_trust * p_days_since_last));

  old_curiosity := current_state.curiosity;
  new_curiosity := GREATEST(0, current_state.curiosity - (decay_rate_standard * p_days_since_last));

  -- Update the state
  UPDATE user_emotional_state
  SET
    affection = new_affection,
    concern = new_concern,
    trust = new_trust,
    curiosity = new_curiosity,
    last_updated = NOW()
  WHERE user_id = p_user_id;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION apply_emotional_decay IS
  'Applies time-based decay to emotional states. Trust decays slower (0.2/day) than others (0.5/day).';

-- ============================================================================
-- FUNCTION: record_state_change
-- ============================================================================
-- Records significant state changes in history for analysis.
-- ============================================================================

CREATE OR REPLACE FUNCTION record_state_change(
  p_user_id TEXT,
  p_state_name TEXT,
  p_old_value NUMERIC,
  p_new_value NUMERIC,
  p_reason TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE user_emotional_state
  SET state_history = state_history || jsonb_build_object(
    'timestamp', to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS'),
    'state', p_state_name,
    'old_value', p_old_value,
    'new_value', p_new_value,
    'change', p_new_value - p_old_value,
    'reason', p_reason
  )
  WHERE user_id = p_user_id;

  -- Trim history to last 100 entries to prevent unbounded growth
  UPDATE user_emotional_state
  SET state_history = (
    SELECT jsonb_agg(elem)
    FROM (
      SELECT elem
      FROM jsonb_array_elements(state_history) AS elem
      ORDER BY (elem->>'timestamp')::timestamp DESC
      LIMIT 100
    ) sub
  )
  WHERE user_id = p_user_id
    AND jsonb_array_length(state_history) > 100;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION record_state_change IS
  'Records state changes in history. Keeps last 100 entries.';

-- ============================================================================
-- FUNCTION: update_emotional_state
-- ============================================================================
-- Updates emotional state with delta values.
-- Automatically records significant changes.
-- ============================================================================

CREATE OR REPLACE FUNCTION update_emotional_state(
  p_user_id TEXT,
  p_affection_delta NUMERIC DEFAULT 0,
  p_concern_delta NUMERIC DEFAULT 0,
  p_trust_delta NUMERIC DEFAULT 0,
  p_curiosity_delta NUMERIC DEFAULT 0,
  p_reason TEXT DEFAULT 'interaction'
) RETURNS user_emotional_state AS $$
DECLARE
  current_state user_emotional_state;
  result user_emotional_state;
BEGIN
  -- Get or create current state
  SELECT * INTO current_state
  FROM user_emotional_state
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_emotional_state (user_id)
    VALUES (p_user_id)
    RETURNING * INTO current_state;
  END IF;

  -- Calculate new values (capped at 0-10)
  UPDATE user_emotional_state
  SET
    affection = GREATEST(0, LEAST(10, affection + p_affection_delta)),
    concern = GREATEST(0, LEAST(10, concern + p_concern_delta)),
    trust = GREATEST(0, LEAST(10, trust + p_trust_delta)),
    curiosity = GREATEST(0, LEAST(10, curiosity + p_curiosity_delta)),
    last_updated = NOW(),
    last_interaction = NOW()
  WHERE user_id = p_user_id
  RETURNING * INTO result;

  -- Record significant changes (> 0.5)
  IF ABS(p_affection_delta) > 0.5 THEN
    PERFORM record_state_change(p_user_id, 'affection', current_state.affection, result.affection, p_reason);
  END IF;

  IF ABS(p_concern_delta) > 0.5 THEN
    PERFORM record_state_change(p_user_id, 'concern', current_state.concern, result.concern, p_reason);
  END IF;

  IF ABS(p_trust_delta) > 0.5 THEN
    PERFORM record_state_change(p_user_id, 'trust', current_state.trust, result.trust, p_reason);
  END IF;

  IF ABS(p_curiosity_delta) > 0.5 THEN
    PERFORM record_state_change(p_user_id, 'curiosity', current_state.curiosity, result.curiosity, p_reason);
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_emotional_state IS
  'Updates emotional state with deltas. Records significant changes (>0.5) in history.';

-- ============================================================================
-- VIEW: user_emotional_summary
-- ============================================================================
-- Provides a summary view of emotional states with interpretations.
-- ============================================================================

CREATE OR REPLACE VIEW user_emotional_summary AS
SELECT
  user_id,
  affection,
  CASE
    WHEN affection >= 8 THEN 'very high'
    WHEN affection >= 6 THEN 'high'
    WHEN affection >= 4 THEN 'moderate'
    WHEN affection >= 2 THEN 'low'
    ELSE 'very low'
  END AS affection_level,
  concern,
  CASE
    WHEN concern >= 8 THEN 'very high'
    WHEN concern >= 6 THEN 'high'
    WHEN concern >= 4 THEN 'moderate'
    WHEN concern >= 2 THEN 'low'
    ELSE 'very low'
  END AS concern_level,
  trust,
  CASE
    WHEN trust >= 8 THEN 'very high'
    WHEN trust >= 6 THEN 'high'
    WHEN trust >= 4 THEN 'moderate'
    WHEN trust >= 2 THEN 'low'
    ELSE 'very low'
  END AS trust_level,
  curiosity,
  CASE
    WHEN curiosity >= 8 THEN 'very high'
    WHEN curiosity >= 6 THEN 'high'
    WHEN curiosity >= 4 THEN 'moderate'
    WHEN curiosity >= 2 THEN 'low'
    ELSE 'very low'
  END AS curiosity_level,
  EXTRACT(DAY FROM NOW() - last_interaction)::INTEGER AS days_since_interaction,
  last_interaction,
  last_updated
FROM user_emotional_state;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_emotional_state IS
  'Persistent emotional states across sessions. Provides emotional continuity.';

COMMENT ON COLUMN user_emotional_state.affection IS
  'Warmth and care toward user (0-10). Grows with positive interactions.';

COMMENT ON COLUMN user_emotional_state.concern IS
  'Worry about user wellbeing (0-10). Rises with sadness/distress.';

COMMENT ON COLUMN user_emotional_state.trust IS
  'Level of established trust (0-10). Decays slower than other states.';

COMMENT ON COLUMN user_emotional_state.curiosity IS
  'Interest in learning more about user (0-10). Rises with new information.';

COMMENT ON COLUMN user_emotional_state.state_history IS
  'JSONB array of significant state changes. Limited to 100 entries.';

-- ============================================================================
-- HELPFUL QUERIES
-- ============================================================================

-- Get emotional summary for a user:
--
-- SELECT * FROM user_emotional_summary WHERE user_id = 'test-user';

-- Update emotional state:
--
-- SELECT * FROM update_emotional_state(
--   'test-user',
--   1.0,   -- affection_delta
--   2.0,   -- concern_delta
--   0.5,   -- trust_delta
--   0.0,   -- curiosity_delta
--   'user_shared_sadness'
-- );

-- Apply decay for 3 days absence:
--
-- SELECT * FROM apply_emotional_decay('test-user', 3);

-- Get state history:
--
-- SELECT user_id, jsonb_array_length(state_history) AS history_count,
--        state_history->0 AS most_recent_change
-- FROM user_emotional_state
-- WHERE user_id = 'test-user';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 008: Emotional State Tracking created successfully';
  RAISE NOTICE 'Table: user_emotional_state';
  RAISE NOTICE 'Functions: apply_emotional_decay(), record_state_change(), update_emotional_state()';
  RAISE NOTICE 'View: user_emotional_summary';
  RAISE NOTICE 'States: affection, concern, trust, curiosity (0-10 scale)';
  RAISE NOTICE 'Decay: 0.5/day (standard), 0.2/day (trust)';
END $$;
