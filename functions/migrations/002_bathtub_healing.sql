-- ============================================================================
-- WEEK 5: BATHTUB HEALING ALGORITHM TABLES
-- ============================================================================
-- Phase 2 Week 1: Therapeutic Mathematics
--
-- Tables:
-- 1. user_emotional_bathtub - Salt/water state per user
-- 2. happiness_anchors - Joy moments for recall
-- 3. emotion_detections - Plutchik emotion history
-- 4. healing_sessions - Track healing effectiveness
--
-- Created: December 31, 2025
-- ============================================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION 1: USER EMOTIONAL BATHTUB
-- ============================================================================
-- The bathtub metaphor: Salt (grief) + Water (happiness) = Concentration (state)
-- Salt never disappears, but can be diluted with water (happiness memories)

CREATE TABLE IF NOT EXISTS user_emotional_bathtub (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,

    -- Bathtub state
    salt_amount INTEGER NOT NULL DEFAULT 20, -- Grief units (never decreases from healing)
    water_volume INTEGER NOT NULL DEFAULT 80, -- Happiness units
    concentration DECIMAL(5,2) NOT NULL DEFAULT 20.0, -- salt / (salt + water) × 100

    -- Current state
    state VARCHAR(20) NOT NULL DEFAULT 'CONTENT',
    -- States: THRIVING (0-10%), HAPPY (10-20%), CONTENT (20-30%),
    --         SAD (30-40%), VERY_SAD (40-50%), DEPRESSED (50%+)

    -- Tracking
    last_healing TIMESTAMP WITH TIME ZONE,
    last_salt_event TIMESTAMP WITH TIME ZONE,
    total_stacks_received INTEGER DEFAULT 0,
    total_water_added INTEGER DEFAULT 0,

    -- History (JSONB array of state changes)
    history JSONB DEFAULT '[]'::JSONB,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- One bathtub per user
    CONSTRAINT user_emotional_bathtub_unique UNIQUE (user_id)
);

-- ============================================================================
-- SECTION 2: HAPPINESS ANCHORS
-- ============================================================================
-- Joy moments stored for bathtub healing recall
-- Categories: achievement, connection, delight (stacking order)

CREATE TABLE IF NOT EXISTS happiness_anchors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,

    -- Core content
    event VARCHAR(255) NOT NULL, -- Short description
    user_quote TEXT, -- Original message

    -- Plutchik emotion data
    primary_emotion VARCHAR(20),
    primary_intensity INTEGER CHECK (primary_intensity BETWEEN 1 AND 10),
    compounds JSONB DEFAULT '[]'::JSONB, -- [{type, confidence}]
    plutchik_vector vector(8), -- [joy, trust, fear, surprise, sadness, disgust, anger, anticipation]

    -- Category for stacking
    category VARCHAR(20) NOT NULL DEFAULT 'other',
    -- Categories: achievement, connection, delight, other

    -- Constitutional tagging (Week 4)
    element_activated VARCHAR(20), -- Fire, Wood, Water, Metal, Earth
    pillar_touched VARCHAR(20), -- Year, Month, Day, Hour

    -- Bathtub contribution
    water_contribution INTEGER DEFAULT 10,
    stacking_bonus DECIMAL(3,2) DEFAULT 1.0,
    effective_water INTEGER DEFAULT 10, -- water_contribution × stacking_bonus

    -- Semantic search
    embedding vector(768),
    tags TEXT[] DEFAULT '{}',

    -- Effectiveness tracking
    user_value DECIMAL(3,2) DEFAULT 0.8, -- Significance score 0-1
    intensity_score DECIMAL(3,2) DEFAULT 0.5,
    authenticity_score DECIMAL(3,2) DEFAULT 0.8, -- Voice congruence

    -- Usage tracking
    recall_count INTEGER DEFAULT 0,
    last_recalled_at TIMESTAMP WITH TIME ZONE,
    effectiveness_history JSONB DEFAULT '[]'::JSONB, -- Track how well it worked

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SECTION 3: EMOTION DETECTIONS
-- ============================================================================
-- Track all emotion detections for constitutional balance calculation

CREATE TABLE IF NOT EXISTS emotion_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    session_id VARCHAR(128),

    -- Plutchik primary emotion
    primary_emotion VARCHAR(20) NOT NULL,
    primary_intensity INTEGER CHECK (primary_intensity BETWEEN 1 AND 10),

    -- Full Plutchik vector
    plutchik_vector vector(8),

    -- Compound emotions detected
    compounds JSONB DEFAULT '[]'::JSONB,

    -- Voice analysis (Week 3)
    has_voice_data BOOLEAN DEFAULT FALSE,
    voice_emotion VARCHAR(20),
    congruence_score DECIMAL(3,2),
    authenticity_score DECIMAL(3,2),
    hidden_emotion VARCHAR(20),
    masking_pattern VARCHAR(50),

    -- Constitutional context (Week 4)
    element VARCHAR(20), -- Mapped from primary emotion
    pillar VARCHAR(20), -- Detected from content

    -- Source message
    message_excerpt VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SECTION 4: HEALING SESSIONS
-- ============================================================================
-- Track each healing session for effectiveness learning

CREATE TABLE IF NOT EXISTS healing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,

    -- Session type
    session_type VARCHAR(20) NOT NULL DEFAULT '3-stack',
    -- Types: 3-stack, partial-stack, single-anchor

    -- Anchors used
    anchors_used JSONB NOT NULL, -- [{id, category, event}]

    -- State before/after
    before_state VARCHAR(20) NOT NULL,
    after_state VARCHAR(20) NOT NULL,
    before_concentration DECIMAL(5,2) NOT NULL,
    after_concentration DECIMAL(5,2) NOT NULL,

    -- Effectiveness metrics
    water_added INTEGER NOT NULL,
    improvement DECIMAL(5,2) NOT NULL, -- Concentration reduction
    state_improved BOOLEAN DEFAULT FALSE,
    states_jumped INTEGER DEFAULT 0,

    -- Timing
    total_duration_seconds INTEGER DEFAULT 30,

    -- User feedback (optional, for learning)
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    user_feedback TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SECTION 5: INDEXES
-- ============================================================================

-- Bathtub indexes
CREATE INDEX IF NOT EXISTS idx_bathtub_user ON user_emotional_bathtub(user_id);
CREATE INDEX IF NOT EXISTS idx_bathtub_state ON user_emotional_bathtub(state);

-- Happiness anchors indexes
CREATE INDEX IF NOT EXISTS idx_anchors_user ON happiness_anchors(user_id);
CREATE INDEX IF NOT EXISTS idx_anchors_category ON happiness_anchors(user_id, category);
CREATE INDEX IF NOT EXISTS idx_anchors_element ON happiness_anchors(user_id, element_activated);
CREATE INDEX IF NOT EXISTS idx_anchors_value ON happiness_anchors(user_id, user_value DESC);

-- Vector index for anchor similarity search
CREATE INDEX IF NOT EXISTS idx_anchors_embedding ON happiness_anchors
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Emotion detections indexes
CREATE INDEX IF NOT EXISTS idx_emotions_user ON emotion_detections(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emotions_element ON emotion_detections(user_id, element);

-- Healing sessions indexes
CREATE INDEX IF NOT EXISTS idx_healing_user ON healing_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_healing_effectiveness ON healing_sessions(user_id, improvement DESC);

-- ============================================================================
-- SECTION 6: HELPER FUNCTIONS
-- ============================================================================

-- Function to get user's element balance from emotion history
CREATE OR REPLACE FUNCTION get_element_balance(
    p_user_id VARCHAR(128),
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    element VARCHAR(20),
    total_weight DECIMAL,
    percentage DECIMAL
) AS $$
DECLARE
    v_total_weight DECIMAL;
BEGIN
    -- Calculate total weight
    SELECT SUM(primary_intensity)
    INTO v_total_weight
    FROM (
        SELECT primary_intensity
        FROM emotion_detections
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT p_limit
    ) recent;

    -- Return element breakdown
    RETURN QUERY
    SELECT
        ed.element,
        SUM(ed.primary_intensity)::DECIMAL as total_weight,
        CASE
            WHEN v_total_weight > 0 THEN ROUND(SUM(ed.primary_intensity)::DECIMAL / v_total_weight * 100, 1)
            ELSE 20.0
        END as percentage
    FROM emotion_detections ed
    WHERE ed.user_id = p_user_id
      AND ed.element IS NOT NULL
      AND ed.id IN (
          SELECT id FROM emotion_detections
          WHERE user_id = p_user_id
          ORDER BY created_at DESC
          LIMIT p_limit
      )
    GROUP BY ed.element
    ORDER BY total_weight DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get best anchors for healing
CREATE OR REPLACE FUNCTION get_healing_anchors(
    p_user_id VARCHAR(128),
    p_category VARCHAR(20) DEFAULT NULL,
    p_element VARCHAR(20) DEFAULT NULL,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    event VARCHAR(255),
    category VARCHAR(20),
    element_activated VARCHAR(20),
    user_value DECIMAL,
    recall_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ha.id,
        ha.event,
        ha.category,
        ha.element_activated,
        ha.user_value,
        ha.recall_count
    FROM happiness_anchors ha
    WHERE ha.user_id = p_user_id
      AND (p_category IS NULL OR ha.category = p_category)
      AND (p_element IS NULL OR ha.element_activated = p_element)
    ORDER BY ha.user_value DESC, ha.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF BATHTUB HEALING SCHEMA
-- ============================================================================
--
-- This migration implements:
-- 1. user_emotional_bathtub - Salt/water state tracking
-- 2. happiness_anchors - Joy memory storage for recall
-- 3. emotion_detections - Emotion history for constitutional balance
-- 4. healing_sessions - Track healing effectiveness
--
-- The bathtub algorithm:
-- - Grief (salt) never disappears
-- - But can be diluted with happiness (water)
-- - State = concentration = salt / (salt + water)
--
-- Week 5 Complete: Luna can now heal broken hearts.
-- ============================================================================
