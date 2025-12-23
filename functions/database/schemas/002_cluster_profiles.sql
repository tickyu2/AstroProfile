-- ═══════════════════════════════════════════════════════════════════════════════
-- CLUSTER PROFILES SCHEMA
-- Interaction style clusters for behavior adaptation
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Clusters describe typical interaction styles that Luna can adapt to.
-- Users are classified into clusters based on their interaction patterns.
--
-- Available clusters:
-- - FastTalker: Quick responses, high energy, may interrupt
-- - SlowThinker: Long pauses, reflective, appreciates space
-- - Emotional: High variance, responds to empathy
-- - Analytical: Low variance, prefers structured responses
-- - Storyteller: Long turns, detailed narratives
-- - Minimalist: Short responses, direct communication
--
-- Created: December 21, 2025
-- ═══════════════════════════════════════════════════════════════════════════════

-- Cluster definitions (global, system-level)
CREATE TABLE IF NOT EXISTS interaction_clusters (
  cluster_id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- CLASSIFICATION CRITERIA (for matching users to clusters)
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Criteria as JSON for flexibility
  -- Example: { "minAvgPauseMs": 1400, "maxInterruptRate": 0.15, "minTurnLength": 5 }
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- BEHAVIOR OVERRIDES (how Luna adapts for this cluster)
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Behavior modifications as JSON
  -- Example: { "timingScale": 1.3, "backchannelFrequencyDelta": 0.1, "tonePreference": "Gentle" }
  behavior_overrides JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- CLUSTER BEHAVIOR MODIFIERS (explicit columns for fast queries)
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Timing scale: < 1 = faster, > 1 = slower
  timing_scale REAL DEFAULT 1.0,

  -- Response length multiplier
  response_length_scale REAL DEFAULT 1.0,

  -- Backchannel frequency modifier (-1 to +1)
  backchannel_frequency_delta REAL DEFAULT 0.0,

  -- Warmth modifier
  warmth_modifier REAL DEFAULT 0.0,

  -- Pace modifier
  pace_modifier REAL DEFAULT 0.0,

  -- Preferred tones (JSON array)
  preferred_tones JSONB DEFAULT '[]'::jsonb,

  -- Preferred styles (JSON array)
  preferred_styles JSONB DEFAULT '[]'::jsonb,

  -- ═══════════════════════════════════════════════════════════════════════════════
  -- METADATA
  -- ═══════════════════════════════════════════════════════════════════════════════

  -- Whether this cluster is active
  is_active BOOLEAN DEFAULT TRUE,

  -- Priority for classification (higher = checked first)
  priority INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- USER CLUSTER ASSIGNMENTS (for multi-cluster support)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_cluster_assignment (
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL DEFAULT 'default',
  cluster_id TEXT NOT NULL,

  -- How confident we are in this assignment (0-1)
  confidence REAL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),

  -- Classification scores for each cluster (for debugging)
  all_scores JSONB DEFAULT '{}'::jsonb,

  -- Whether this is the primary cluster
  is_primary BOOLEAN DEFAULT FALSE,

  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  PRIMARY KEY (user_id, profile_id, cluster_id),
  FOREIGN KEY (cluster_id) REFERENCES interaction_clusters(cluster_id) ON DELETE CASCADE
);

-- Index for finding users by cluster
CREATE INDEX IF NOT EXISTS idx_cluster_assignment_cluster ON user_cluster_assignment(cluster_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- CLUSTER ANALYTICS (for monitoring cluster distribution)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS cluster_analytics (
  id SERIAL PRIMARY KEY,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Distribution snapshot
  distribution JSONB NOT NULL, -- { "FastTalker": 12, "SlowThinker": 8, ... }

  -- Total users analyzed
  total_users INTEGER DEFAULT 0,

  -- Average confidence per cluster
  avg_confidence_per_cluster JSONB DEFAULT '{}'::jsonb
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- INSERT DEFAULT CLUSTERS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO interaction_clusters (cluster_id, label, description, criteria, behavior_overrides, timing_scale, response_length_scale, backchannel_frequency_delta, warmth_modifier, pace_modifier, preferred_tones, preferred_styles, priority)
VALUES
  (
    'fast_talker',
    'Fast Talker',
    'Quick responses, high energy, frequent interruptions. Prefers snappy, energetic conversation.',
    '{"maxAvgPauseMs": 700, "minInterruptRate": 0.15}'::jsonb,
    '{"timingScale": 0.85, "backchannelFrequencyDelta": -0.1, "tonePreference": "Playful"}'::jsonb,
    0.85, 0.7, -0.2, 0.0, 0.3,
    '["Playful", "Warm"]'::jsonb,
    '["friend", "challenger"]'::jsonb,
    10
  ),
  (
    'slow_thinker',
    'Slow Thinker',
    'Long pauses, reflective, appreciates space to think. Prefers gentle, unhurried conversation.',
    '{"minAvgPauseMs": 1400, "maxInterruptRate": 0.1}'::jsonb,
    '{"timingScale": 1.3, "backchannelFrequencyDelta": 0.1, "tonePreference": "Gentle"}'::jsonb,
    1.4, 1.1, 0.1, 0.1, -0.2,
    '["Warm", "Reflective"]'::jsonb,
    '["sage", "nurturer"]'::jsonb,
    10
  ),
  (
    'emotional',
    'Emotional',
    'High emotional variance, responds well to empathy and validation. Needs supportive responses.',
    '{"minEmotionalVariance": 0.35}'::jsonb,
    '{"warmthDelta": 0.2, "backchannelFrequencyDelta": 0.15, "adviceBiasDelta": -0.2}'::jsonb,
    1.0, 1.0, 0.2, 0.2, 0.0,
    '["Warm", "Tender"]'::jsonb,
    '["nurturer", "friend"]'::jsonb,
    15
  ),
  (
    'analytical',
    'Analytical',
    'Low emotional variance, prefers structured, logical responses. Appreciates clarity over warmth.',
    '{"maxEmotionalVariance": 0.15, "minNeutralBaseline": 0.5}'::jsonb,
    '{"warmthDelta": -0.1, "adviceBiasDelta": 0.15}'::jsonb,
    1.1, 1.2, -0.1, -0.1, -0.1,
    '["Reflective", "Neutral"]'::jsonb,
    '["sage", "challenger"]'::jsonb,
    10
  ),
  (
    'storyteller',
    'Storyteller',
    'Long turns, detailed narratives. Likes to share and be heard. Appreciates engaged listening.',
    '{"minTurnLength": 5.0, "maxInterruptRate": 0.1}'::jsonb,
    '{"responseLengthScale": 1.4, "backchannelFrequencyDelta": 0.05}'::jsonb,
    1.2, 1.4, 0.0, 0.2, -0.15,
    '["Warm", "Reflective"]'::jsonb,
    '["friend", "sage"]'::jsonb,
    10
  ),
  (
    'minimalist',
    'Minimalist',
    'Short responses, direct communication. Values efficiency over elaboration.',
    '{"maxTurnLength": 2.5, "maxAvgPauseMs": 900}'::jsonb,
    '{"responseLengthScale": 0.6, "backchannelFrequencyDelta": -0.15}'::jsonb,
    0.7, 0.6, -0.3, 0.0, 0.1,
    '["Neutral", "Playful"]'::jsonb,
    '["challenger", "friend"]'::jsonb,
    10
  )
ON CONFLICT (cluster_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRIGGER: Auto-update timestamp
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_cluster_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_cluster_timestamp ON interaction_clusters;

CREATE TRIGGER trigger_update_cluster_timestamp
  BEFORE UPDATE ON interaction_clusters
  FOR EACH ROW
  EXECUTE FUNCTION update_cluster_timestamp();
