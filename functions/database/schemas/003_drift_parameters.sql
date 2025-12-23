-- ═══════════════════════════════════════════════════════════════════════════════
-- DRIFT PARAMETERS SCHEMA
-- Personality drift tracking for Luna's slow evolution
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Personality drift allows Luna to slowly evolve her base personality
-- within safe bounds based on accumulated interaction signals.
--
-- Key concepts:
-- - Global drift affects all users (Luna's overall personality evolution)
-- - Per-user drift allows individual relationship-specific adaptation
-- - All drift values are bounded to prevent extreme personality changes
--
-- Created: December 21, 2025
-- ═══════════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════════
-- GLOBAL DRIFT CONFIGURATION
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS global_drift_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Singleton table

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- CURRENT DRIFT VALUES (global Luna personality)
  -- ═══════════════════════════════════════════════════════════════════════════════

  warmth_delta REAL DEFAULT 0.0 CHECK (warmth_delta >= -0.3 AND warmth_delta <= 0.3),
  advice_bias_delta REAL DEFAULT 0.0 CHECK (advice_bias_delta >= -0.3 AND advice_bias_delta <= 0.3),
  pace_delta REAL DEFAULT 0.0 CHECK (pace_delta >= -0.3 AND pace_delta <= 0.3),
  responsiveness_delta REAL DEFAULT 0.0 CHECK (responsiveness_delta >= -0.3 AND responsiveness_delta <= 0.3),
  backchannel_delta REAL DEFAULT 0.0 CHECK (backchannel_delta >= -0.3 AND backchannel_delta <= 0.3),
  mirroring_delta REAL DEFAULT 0.0 CHECK (mirroring_delta >= -0.3 AND mirroring_delta <= 0.3),

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- ACCUMULATED SIGNALS (pending application)
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Signals accumulated since last drift update
  accumulated_signals JSONB DEFAULT '{
    "warmthPositive": 0,
    "warmthNegative": 0,
    "advicePositive": 0,
    "adviceNegative": 0,
    "pacePositive": 0,
    "paceNegative": 0,
    "responsivenessPositive": 0,
    "responsivenessNegative": 0,
    "backchannelPositive": 0,
    "backchannelNegative": 0,
    "mirroringPositive": 0,
    "mirroringNegative": 0
  }'::jsonb,

  -- Total signals since last drift application
  signal_count INTEGER DEFAULT 0,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- DRIFT CONFIGURATION
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Rate at which drift is applied (0-1, higher = faster adaptation)
  drift_rate REAL DEFAULT 0.02 CHECK (drift_rate >= 0 AND drift_rate <= 0.1),

  -- Minimum signals required before applying drift
  min_signals_for_drift INTEGER DEFAULT 50,

  -- Interval between drift applications (milliseconds)
  drift_interval_ms INTEGER DEFAULT 1800000, -- 30 minutes

  -- Whether drift is enabled
  is_enabled BOOLEAN DEFAULT TRUE,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- BOUNDS CONFIGURATION
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- JSON object with bounds for each parameter
  bounds JSONB DEFAULT '{
    "warmth": { "min": -0.3, "max": 0.3 },
    "adviceBias": { "min": -0.3, "max": 0.3 },
    "pace": { "min": -0.3, "max": 0.3 },
    "responsiveness": { "min": -0.2, "max": 0.2 },
    "backchannel": { "min": -0.3, "max": 0.3 },
    "mirroring": { "min": -0.3, "max": 0.3 }
  }'::jsonb,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- METADATA
  -- ═══════════════════════════════════════════════════════════════════════════════

  last_drift_applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default global config
INSERT INTO global_drift_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PER-USER DRIFT (relationship-specific adaptation)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_personality_drift (
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL DEFAULT 'default',

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- CURRENT DRIFT VALUES (per-user overrides)
  -- ═══════════════════════════════════════════════════════════════════════════════

  warmth_delta REAL DEFAULT 0.0 CHECK (warmth_delta >= -0.5 AND warmth_delta <= 0.5),
  advice_bias_delta REAL DEFAULT 0.0 CHECK (advice_bias_delta >= -0.5 AND advice_bias_delta <= 0.5),
  pace_delta REAL DEFAULT 0.0 CHECK (pace_delta >= -0.5 AND pace_delta <= 0.5),
  responsiveness_delta REAL DEFAULT 0.0 CHECK (responsiveness_delta >= -0.3 AND responsiveness_delta <= 0.3),
  backchannel_delta REAL DEFAULT 0.0 CHECK (backchannel_delta >= -0.5 AND backchannel_delta <= 0.5),
  mirroring_delta REAL DEFAULT 0.0 CHECK (mirroring_delta >= -0.5 AND mirroring_delta <= 0.5),

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- ACCUMULATED SIGNALS (per-user)
  -- ═══════════════════════════════════════════════════════════════════════════════

  accumulated_signals JSONB DEFAULT '{
    "warmthPositive": 0,
    "warmthNegative": 0,
    "advicePositive": 0,
    "adviceNegative": 0,
    "pacePositive": 0,
    "paceNegative": 0,
    "responsivenessPositive": 0,
    "responsivenessNegative": 0,
    "backchannelPositive": 0,
    "backchannelNegative": 0,
    "mirroringPositive": 0,
    "mirroringNegative": 0
  }'::jsonb,

  signal_count INTEGER DEFAULT 0,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- PER-USER DRIFT SETTINGS
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- User-specific drift rate (can be different from global)
  drift_rate REAL DEFAULT 0.02 CHECK (drift_rate >= 0 AND drift_rate <= 0.1),

  -- Whether user-specific drift is enabled (can override global)
  is_enabled BOOLEAN DEFAULT TRUE,

  -- Total interactions used for drift calculation
  total_interactions INTEGER DEFAULT 0,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- RELATIONSHIP QUALITY METRICS
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Overall relationship sentiment (-1 to 1)
  relationship_sentiment REAL DEFAULT 0.0 CHECK (relationship_sentiment >= -1 AND relationship_sentiment <= 1),

  -- Engagement score (0-1)
  engagement_score REAL DEFAULT 0.5 CHECK (engagement_score >= 0 AND engagement_score <= 1),

  -- Comfort level (0-1)
  comfort_level REAL DEFAULT 0.5 CHECK (comfort_level >= 0 AND comfort_level <= 1),

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- METADATA
  -- ═══════════════════════════════════════════════════════════════════════════════

  last_drift_applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  PRIMARY KEY (user_id, profile_id)
);

-- Index for finding users by engagement
CREATE INDEX IF NOT EXISTS idx_user_drift_engagement ON user_personality_drift(engagement_score DESC);

-- Index for finding users by relationship sentiment
CREATE INDEX IF NOT EXISTS idx_user_drift_sentiment ON user_personality_drift(relationship_sentiment DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- DRIFT HISTORY (for inspection and rollback)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS drift_history (
  id SERIAL PRIMARY KEY,

  -- Whether this is global or user-specific drift
  scope TEXT NOT NULL CHECK (scope IN ('global', 'user')),

  -- User ID (NULL for global drift)
  user_id TEXT DEFAULT NULL,
  profile_id TEXT DEFAULT 'default',

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- SNAPSHOT OF DRIFT VALUES AT THIS POINT
  -- ═══════════════════════════════════════════════════════════════════════════════

  warmth_delta REAL NOT NULL,
  advice_bias_delta REAL NOT NULL,
  pace_delta REAL NOT NULL,
  responsiveness_delta REAL NOT NULL,
  backchannel_delta REAL NOT NULL,
  mirroring_delta REAL NOT NULL,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- CONTEXT
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Signals that triggered this drift change
  trigger_signals JSONB DEFAULT '{}'::jsonb,

  -- Total signals accumulated before this change
  signal_count INTEGER DEFAULT 0,

  -- Reason for the drift change
  reason TEXT DEFAULT 'scheduled_update',

  -- Optional notes
  notes TEXT DEFAULT NULL,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- METADATA
  -- ═══════════════════════════════════════════════════════════════════════════════

  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for finding drift history by user
CREATE INDEX IF NOT EXISTS idx_drift_history_user ON drift_history(user_id, profile_id, recorded_at DESC);

-- Index for finding global drift history
CREATE INDEX IF NOT EXISTS idx_drift_history_global ON drift_history(scope, recorded_at DESC) WHERE scope = 'global';

-- ═══════════════════════════════════════════════════════════════════════════════
-- DRIFT SIGNALS LOG (for debugging and analysis)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS drift_signal_log (
  id SERIAL PRIMARY KEY,

  user_id TEXT NOT NULL,
  profile_id TEXT DEFAULT 'default',

  -- Signal type (warmthPositive, adviceNegative, etc.)
  signal_type TEXT NOT NULL,

  -- Signal weight (-1 to 1)
  weight REAL DEFAULT 1.0 CHECK (weight >= -1 AND weight <= 1),

  -- Source of the signal
  source TEXT DEFAULT 'unknown',

  -- Additional context
  context JSONB DEFAULT '{}'::jsonb,

  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for finding signals by user
CREATE INDEX IF NOT EXISTS idx_signal_log_user ON drift_signal_log(user_id, profile_id, recorded_at DESC);

-- Partial index for recent signals (last 24 hours)
CREATE INDEX IF NOT EXISTS idx_signal_log_recent ON drift_signal_log(recorded_at DESC)
  WHERE recorded_at > NOW() - INTERVAL '24 hours';

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRIGGER: Auto-update timestamps
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_drift_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_global_drift_timestamp ON global_drift_config;
DROP TRIGGER IF EXISTS trigger_update_user_drift_timestamp ON user_personality_drift;

CREATE TRIGGER trigger_update_global_drift_timestamp
  BEFORE UPDATE ON global_drift_config
  FOR EACH ROW
  EXECUTE FUNCTION update_drift_timestamp();

CREATE TRIGGER trigger_update_user_drift_timestamp
  BEFORE UPDATE ON user_personality_drift
  FOR EACH ROW
  EXECUTE FUNCTION update_drift_timestamp();

-- ═══════════════════════════════════════════════════════════════════════════════
-- FUNCTION: Apply drift from accumulated signals
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION apply_drift(
  p_scope TEXT,
  p_user_id TEXT DEFAULT NULL,
  p_profile_id TEXT DEFAULT 'default'
)
RETURNS JSONB AS $$
DECLARE
  v_signals JSONB;
  v_drift_rate REAL;
  v_bounds JSONB;
  v_old_values JSONB;
  v_new_values JSONB;
  v_delta REAL;
BEGIN
  IF p_scope = 'global' THEN
    -- Get global config
    SELECT accumulated_signals, drift_rate, bounds,
           jsonb_build_object(
             'warmth', warmth_delta,
             'adviceBias', advice_bias_delta,
             'pace', pace_delta,
             'responsiveness', responsiveness_delta,
             'backchannel', backchannel_delta,
             'mirroring', mirroring_delta
           )
    INTO v_signals, v_drift_rate, v_bounds, v_old_values
    FROM global_drift_config WHERE id = 1;

    -- Calculate new values with drift
    v_new_values := jsonb_build_object(
      'warmth', LEAST(GREATEST(
        COALESCE((v_old_values->>'warmth')::REAL, 0) +
        v_drift_rate * (
          COALESCE((v_signals->>'warmthPositive')::REAL, 0) -
          COALESCE((v_signals->>'warmthNegative')::REAL, 0)
        ) / NULLIF(
          COALESCE((v_signals->>'warmthPositive')::REAL, 0) +
          COALESCE((v_signals->>'warmthNegative')::REAL, 0), 0
        ),
        COALESCE((v_bounds->'warmth'->>'min')::REAL, -0.3)
      ), COALESCE((v_bounds->'warmth'->>'max')::REAL, 0.3))
    );
    -- Add other parameters...

    -- Update global config
    UPDATE global_drift_config SET
      warmth_delta = COALESCE((v_new_values->>'warmth')::REAL, warmth_delta),
      accumulated_signals = '{}'::jsonb,
      signal_count = 0,
      last_drift_applied_at = NOW()
    WHERE id = 1;

  ELSE
    -- Per-user drift (similar logic)
    -- Implementation for user-specific drift...
    NULL;
  END IF;

  -- Log the drift change
  INSERT INTO drift_history (scope, user_id, profile_id, warmth_delta, advice_bias_delta, pace_delta, responsiveness_delta, backchannel_delta, mirroring_delta, trigger_signals, reason)
  SELECT
    p_scope,
    p_user_id,
    p_profile_id,
    COALESCE((v_new_values->>'warmth')::REAL, 0),
    COALESCE((v_new_values->>'adviceBias')::REAL, 0),
    COALESCE((v_new_values->>'pace')::REAL, 0),
    COALESCE((v_new_values->>'responsiveness')::REAL, 0),
    COALESCE((v_new_values->>'backchannel')::REAL, 0),
    COALESCE((v_new_values->>'mirroring')::REAL, 0),
    v_signals,
    'scheduled_update';

  RETURN jsonb_build_object(
    'success', true,
    'scope', p_scope,
    'oldValues', v_old_values,
    'newValues', v_new_values
  );
END;
$$ LANGUAGE plpgsql;
