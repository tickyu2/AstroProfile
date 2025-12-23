-- ═══════════════════════════════════════════════════════════════════════════════
-- INTERACTION PROFILES SCHEMA
-- Long-term interaction memory for Luna voice conversations
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Stores how users interact with Luna over time:
-- - Timing patterns (pause duration, turn length)
-- - Cue preferences (backchannel tolerance)
-- - Conversational style preferences
-- - Emotional baseline distribution
--
-- Created: December 21, 2025
-- ═══════════════════════════════════════════════════════════════════════════════

-- User interaction profiles (per-user long-term patterns)
CREATE TABLE IF NOT EXISTS user_interaction_profile (
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL DEFAULT 'default',

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- INTERACTION TIMING
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Average inter-turn pause in milliseconds
  avg_pause_ms REAL DEFAULT 1000.0,

  -- Average sentences/segments per turn
  avg_turn_length REAL DEFAULT 3.0,

  -- Fraction of Luna turns interrupted (0-1)
  interrupt_rate REAL DEFAULT 0.0,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- CUE/BACKCHANNEL PREFERENCES
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- User's tolerance for backchannels: -1 (hates) to +1 (loves)
  backchannel_tolerance REAL DEFAULT 0.0 CHECK (backchannel_tolerance >= -1 AND backchannel_tolerance <= 1),

  -- Preferred backchannel intensity (0-1)
  preferred_backchannel_intensity REAL DEFAULT 0.3 CHECK (preferred_backchannel_intensity >= 0 AND preferred_backchannel_intensity <= 1),

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- CONVERSATIONAL STYLE
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Preferred tone: Warm, Gentle, Thoughtful, Playful, Neutral, Reflective
  preferred_tone TEXT DEFAULT NULL,

  -- Preferred Luna style: present, nurturing, playful, sage, mystic, friend, challenger
  preferred_style TEXT DEFAULT NULL,

  -- Advice preference: 0 = pure reflection, 1 = direct advice
  preferred_advice_bias REAL DEFAULT 0.5 CHECK (preferred_advice_bias >= 0 AND preferred_advice_bias <= 1),

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- EMOTIONAL PATTERNS
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Emotional baseline as JSON: { "neutral": 0.6, "happy": 0.2, "anxious": 0.1, ... }
  emotional_baseline JSONB DEFAULT '{"neutral": 0.5, "happy": 0.2, "sad": 0.05, "anxious": 0.1, "angry": 0.02, "excited": 0.05, "tender": 0.03, "fearful": 0.02, "surprised": 0.03}'::jsonb,

  -- How much their emotions swing per turn (variance)
  emotional_variance REAL DEFAULT 0.0,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- CLUSTERING
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Assigned interaction cluster (e.g., FastTalker, SlowThinker, Emotional)
  cluster_id TEXT DEFAULT NULL,

  -- Confidence of cluster assignment (0-1)
  cluster_confidence REAL DEFAULT 0.0,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- METADATA
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Total voice sessions with this user
  session_count INTEGER DEFAULT 0,

  -- Total conversation turns
  turn_count INTEGER DEFAULT 0,

  -- Interaction count for EMA calculations
  interaction_count INTEGER DEFAULT 0,

  -- Session history as JSON array (last 20 sessions)
  session_history JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  PRIMARY KEY (user_id, profile_id)
);

-- Index for cluster queries
CREATE INDEX IF NOT EXISTS idx_profile_cluster ON user_interaction_profile(cluster_id);

-- Index for recent updates
CREATE INDEX IF NOT EXISTS idx_profile_updated ON user_interaction_profile(last_updated DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SESSION SNAPSHOTS (optional - for detailed analysis)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS interaction_session_snapshot (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL DEFAULT 'default',
  session_id TEXT NOT NULL,

  -- Session metrics
  turn_count INTEGER DEFAULT 0,
  avg_pause_ms REAL,
  interrupt_count INTEGER DEFAULT 0,
  backchannel_played INTEGER DEFAULT 0,
  backchannel_appreciated INTEGER DEFAULT 0,
  backchannel_rejected INTEGER DEFAULT 0,

  -- Emotion distribution for this session
  emotion_counts JSONB DEFAULT '{}'::jsonb,
  primary_emotion TEXT,

  -- Duration
  duration_ms INTEGER,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user session lookup
CREATE INDEX IF NOT EXISTS idx_session_user ON interaction_session_snapshot(user_id, profile_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRIGGER: Auto-update last_updated timestamp
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_interaction_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profile_timestamp ON user_interaction_profile;

CREATE TRIGGER trigger_update_profile_timestamp
  BEFORE UPDATE ON user_interaction_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_interaction_profile_timestamp();
