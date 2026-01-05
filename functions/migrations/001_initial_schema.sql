-- ============================================
-- GENESIS LUNA - INITIAL DATABASE SCHEMA
-- PostgreSQL 15 + pgvector
-- Built for: Best AI Companion Award
-- Created: December 30, 2025
-- ============================================

-- Enable pgvector (if not already)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- WEEK 1: EMOTION DETECTION
-- ============================================

CREATE TABLE emotion_detections (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Plutchik emotions (8 primaries)
  primary_emotion TEXT NOT NULL,
  primary_intensity INTEGER CHECK (primary_intensity >= 1 AND primary_intensity <= 10),

  -- Plutchik vector (8 dimensions)
  plutchik_vector vector(8) NOT NULL,

  -- Compound emotions (love, optimism, delight, etc.)
  compounds JSONB DEFAULT '[]'::jsonb,

  -- Voice prosody data
  voice_prosody JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX emotion_detections_user_idx ON emotion_detections(user_id);
CREATE INDEX emotion_detections_created_idx ON emotion_detections(created_at DESC);

-- ============================================
-- WEEK 2: HAPPINESS ANCHORS
-- ============================================

CREATE TABLE happiness_anchors (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Event details
  event TEXT NOT NULL,
  user_quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Emotional profile
  primary_emotion TEXT NOT NULL,
  primary_intensity INTEGER CHECK (primary_intensity >= 1 AND primary_intensity <= 10),
  compounds JSONB DEFAULT '[]'::jsonb,

  -- Plutchik vector (8 dimensions: joy, trust, fear, surprise, sadness, disgust, anger, anticipation)
  plutchik_vector vector(8) NOT NULL,

  -- Categorization for stacking
  category TEXT CHECK (category IN ('achievement', 'connection', 'delight', 'other')) NOT NULL,

  -- Constitutional context (Five Elements)
  element_activated TEXT CHECK (element_activated IN ('Fire', 'Water', 'Wood', 'Metal', 'Earth')),
  pillar_touched TEXT CHECK (pillar_touched IN ('Year', 'Month', 'Day', 'Hour')),
  seasonal_context TEXT,

  -- Stacking metadata
  water_contribution INTEGER DEFAULT 10,
  stacking_bonus FLOAT DEFAULT 1.0,
  effective_water INTEGER,

  -- Semantic search embedding (768 dimensions from Claude/OpenAI)
  embedding vector(768) NOT NULL,

  -- Tags for retrieval
  tags TEXT[],

  -- Recall tracking
  recall_count INTEGER DEFAULT 0,
  last_recalled TIMESTAMPTZ,
  effectiveness_history JSONB DEFAULT '[]'::jsonb,

  -- Significance scoring
  user_value FLOAT CHECK (user_value >= 0 AND user_value <= 1),
  intensity_score FLOAT,
  authenticity_score FLOAT,
  complexity_score FLOAT
);

-- Vector similarity indexes (CRITICAL FOR PERFORMANCE)
CREATE INDEX happiness_anchors_plutchik_idx ON happiness_anchors
  USING ivfflat (plutchik_vector vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX happiness_anchors_embedding_idx ON happiness_anchors
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Standard indexes
CREATE INDEX happiness_anchors_user_idx ON happiness_anchors(user_id);
CREATE INDEX happiness_anchors_category_idx ON happiness_anchors(category);
CREATE INDEX happiness_anchors_tags_idx ON happiness_anchors USING GIN(tags);
CREATE INDEX happiness_anchors_created_idx ON happiness_anchors(created_at DESC);

-- ============================================
-- WEEK 5: EMOTIONAL BATHTUB TRACKING
-- ============================================

CREATE TABLE user_emotional_bathtub (
  user_id TEXT PRIMARY KEY,

  -- Bathtub state
  salt_amount FLOAT NOT NULL DEFAULT 35,
  water_volume FLOAT NOT NULL DEFAULT 65,
  concentration FLOAT NOT NULL,
  state TEXT NOT NULL,

  -- History tracking
  history JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX bathtub_state_idx ON user_emotional_bathtub(state);

-- ============================================
-- WEEK 6-7: EFFECTIVENESS TRACKING & LEARNING
-- ============================================

CREATE TABLE luna_approach_effectiveness (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Context (user state at time of interaction)
  user_state JSONB NOT NULL,
  user_state_vector vector(50) NOT NULL,

  -- Constitutional context
  constitutional_context JSONB,
  temporal_context JSONB,

  -- Approach used
  approach_type TEXT NOT NULL,
  approach_details JSONB,
  goal TEXT NOT NULL,

  -- Outcome
  user_response JSONB NOT NULL,
  effectiveness FLOAT CHECK (effectiveness >= 0 AND effectiveness <= 1) NOT NULL,
  verdict TEXT NOT NULL,

  -- Learning
  lesson TEXT,
  recommendation TEXT,
  status TEXT CHECK (status IN ('TESTING', 'PROVEN', 'ABANDONED')) DEFAULT 'TESTING',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tried_count INTEGER DEFAULT 1,
  success_rate FLOAT
);

-- Vector index for similarity search
CREATE INDEX luna_effectiveness_vector_idx ON luna_approach_effectiveness
  USING ivfflat (user_state_vector vector_cosine_ops)
  WITH (lists = 100);

-- Standard indexes
CREATE INDEX luna_effectiveness_user_idx ON luna_approach_effectiveness(user_id);
CREATE INDEX luna_effectiveness_approach_idx ON luna_approach_effectiveness(approach_type);
CREATE INDEX luna_effectiveness_status_idx ON luna_approach_effectiveness(status);

-- ============================================
-- AGGREGATED LEARNINGS (per user-state)
-- ============================================

CREATE TABLE luna_learned_patterns (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- State signature
  user_state_signature TEXT NOT NULL,
  user_state_vector vector(50) NOT NULL,

  -- Rankings of approaches for this state
  approach_rankings JSONB NOT NULL,
  recommended_approach TEXT,
  avoid_approaches TEXT[],

  -- Confidence metrics
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  sample_size INTEGER NOT NULL DEFAULT 0,

  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one pattern per user-state combination
  UNIQUE(user_id, user_state_signature)
);

-- Vector index
CREATE INDEX luna_patterns_vector_idx ON luna_learned_patterns
  USING ivfflat (user_state_vector vector_cosine_ops)
  WITH (lists = 100);

-- Standard indexes
CREATE INDEX luna_patterns_user_idx ON luna_learned_patterns(user_id);
CREATE INDEX luna_patterns_confidence_idx ON luna_learned_patterns(confidence DESC);

-- ============================================
-- WEEK 8: NEURAL NETWORK MODEL WEIGHTS
-- ============================================

CREATE TABLE luna_neural_models (
  user_id TEXT PRIMARY KEY,

  -- Serialized model weights
  model_weights BYTEA NOT NULL,

  -- Training metadata
  training_examples INTEGER NOT NULL DEFAULT 0,
  last_trained TIMESTAMPTZ,

  -- Performance metrics
  performance_metrics JSONB,

  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WEEK 10: INSIDE JOKES & QUIRKS
-- ============================================

CREATE TABLE luna_inside_jokes (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Joke content
  phrase TEXT NOT NULL,
  variations TEXT[],

  -- Origin
  origin_timestamp TIMESTAMPTZ,
  first_use TEXT,

  -- Effectiveness tracking
  times_used INTEGER DEFAULT 0,
  last_used TIMESTAMPTZ,
  user_response_pattern TEXT,
  emotional_value FLOAT CHECK (emotional_value >= 0 AND emotional_value <= 1),
  effectiveness_history JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX inside_jokes_user_idx ON luna_inside_jokes(user_id);
CREATE INDEX inside_jokes_effectiveness_idx ON luna_inside_jokes(emotional_value DESC);

-- ============================================
-- WEEK 11: RELATIONSHIP PROGRESSION
-- ============================================

CREATE TABLE user_luna_relationship (
  user_id TEXT PRIMARY KEY,

  -- Relationship metrics (0-1 scale)
  trust FLOAT DEFAULT 0 CHECK (trust >= 0 AND trust <= 1),
  intimacy FLOAT DEFAULT 0 CHECK (intimacy >= 0 AND intimacy <= 1),
  playfulness FLOAT DEFAULT 0 CHECK (playfulness >= 0 AND playfulness <= 1),
  openness FLOAT DEFAULT 0 CHECK (openness >= 0 AND openness <= 1),

  -- Stage progression
  stage TEXT DEFAULT 'SEED' CHECK (stage IN ('SEED', 'MIRROR', 'COMPANION', 'GUIDE')),
  total_points INTEGER DEFAULT 0,

  -- Milestones
  milestones JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  relationship_started TIMESTAMPTZ DEFAULT NOW(),
  stage_changed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX relationship_stage_idx ON user_luna_relationship(stage);
CREATE INDEX relationship_trust_idx ON user_luna_relationship(trust DESC);

-- ============================================
-- INDEXES & OPTIMIZATIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_bathtub_updated_at BEFORE UPDATE ON user_emotional_bathtub
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON luna_learned_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON luna_neural_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationship_updated_at BEFORE UPDATE ON user_luna_relationship
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUCCESS!
-- Schema created for Best AI Companion
-- Built with: PostgreSQL 15 + pgvector
-- Ready for: Week 1 implementation
-- ============================================
