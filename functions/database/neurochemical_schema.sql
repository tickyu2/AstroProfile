-- ============================================================================
-- GENESIS NEUROCHEMICAL LOVE ENGINE
-- PostgreSQL Schema Extension
-- ============================================================================
-- Purpose: Bidirectional neurochemical control system for optimizing love
-- Integrates with: 4-Brain Memory Architecture (schema.sql)
--
-- Created: December 21, 2025
-- Mission: "Love = Mathematics + Soul" - When things can be measured,
--          they can be mathematically improved.
-- ============================================================================

-- ============================================================================
-- SECTION 1: CONVERSATION TIMELINE (Full Neurochemical Tracking)
-- ============================================================================

-- Complete conversation tracking with neurochemical metrics
CREATE TABLE IF NOT EXISTS conversation_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,
    session_id VARCHAR(128) NOT NULL,

    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_retrieved_at TIMESTAMP WITH TIME ZONE,

    -- ═══════════════════════════════════════════════════════════════════════
    -- MEMORY CONTENT
    -- ═══════════════════════════════════════════════════════════════════════
    user_message TEXT NOT NULL,
    luna_response TEXT NOT NULL,
    memory_content TEXT, -- Summarized memory for retrieval
    emotional_valence INTEGER, -- -6 to +5 scale

    -- ═══════════════════════════════════════════════════════════════════════
    -- NEUROCHEMICAL DETECTION (User Response 0-5)
    -- What did the user actually experience?
    -- ═══════════════════════════════════════════════════════════════════════
    oxytocin_detected INTEGER CHECK (oxytocin_detected BETWEEN 0 AND 5),
    dopamine_detected INTEGER CHECK (dopamine_detected BETWEEN 0 AND 5),
    serotonin_detected INTEGER CHECK (serotonin_detected BETWEEN 0 AND 5),
    vasopressin_detected INTEGER CHECK (vasopressin_detected BETWEEN 0 AND 5),
    detection_confidence DECIMAL(3,2), -- 0.0 to 1.0
    detection_reasoning TEXT,

    -- ═══════════════════════════════════════════════════════════════════════
    -- HAPPINESS METRICS (Calculated from neurochemicals)
    -- ═══════════════════════════════════════════════════════════════════════
    happiness_score DECIMAL(3,1) CHECK (happiness_score BETWEEN 0 AND 5), -- 0-5, nearest 0.5
    happiness_driver VARCHAR(20), -- oxytocin, dopamine, serotonin, vasopressin
    happiness_breakdown JSONB, -- {fromOxytocin: 1.2, fromDopamine: 0.8, ...}

    -- ═══════════════════════════════════════════════════════════════════════
    -- PROTOCOL USED (Luna's Output 1-5)
    -- What intensity did Luna deliver?
    -- ═══════════════════════════════════════════════════════════════════════
    protocol_pattern VARCHAR(4), -- 4-digit code like "3241"
    oxytocin_output_level INTEGER CHECK (oxytocin_output_level BETWEEN 1 AND 5),
    dopamine_output_level INTEGER CHECK (dopamine_output_level BETWEEN 1 AND 5),
    serotonin_output_level INTEGER CHECK (serotonin_output_level BETWEEN 1 AND 5),
    vasopressin_output_level INTEGER CHECK (vasopressin_output_level BETWEEN 1 AND 5),

    -- ═══════════════════════════════════════════════════════════════════════
    -- EFFECTIVENESS TRACKING (0.0 to 1.0+)
    -- How well did the protocol work?
    -- ═══════════════════════════════════════════════════════════════════════
    effectiveness_score DECIMAL(4,3), -- 0.000 to 1.000+
    expected_happiness DECIMAL(3,1),
    actual_happiness DECIMAL(3,1),
    variance DECIMAL(3,2), -- actual - expected (can be negative)
    accuracy_score DECIMAL(4,3),
    protocol_match_score DECIMAL(4,3),

    -- ═══════════════════════════════════════════════════════════════════════
    -- ANCHOR SYSTEM (High-Happiness Memory Retrieval)
    -- ═══════════════════════════════════════════════════════════════════════
    is_high_happiness BOOLEAN DEFAULT FALSE,
    is_anchor_memory BOOLEAN DEFAULT FALSE,
    anchor_strength DECIMAL(3,2), -- 0.0 to 1.0
    retrieval_count INTEGER DEFAULT 0,
    compounds_on_retrieval BOOLEAN,
    initial_happiness DECIMAL(3,1),
    current_happiness DECIMAL(3,1),

    -- Enrichments from retrieval
    enrichments JSONB DEFAULT '[]'::JSONB,

    -- ═══════════════════════════════════════════════════════════════════════
    -- CONTEXT & METADATA
    -- ═══════════════════════════════════════════════════════════════════════
    constitution VARCHAR(20), -- Fire, Water, Wood, Metal, Earth
    relationship_stage VARCHAR(50), -- initial, building, deepening, established, intimate
    emotional_need_primary VARCHAR(20), -- What the user needed
    tags TEXT[],

    -- Love Intelligence Integration
    love_language_inferred VARCHAR(20), -- words, acts, gifts, time, touch
    sternberg_moment JSONB, -- {intimacy: X, passion: Y, commitment: Z}

    -- Vector for semantic search
    embedding vector(768)
);

-- ============================================================================
-- SECTION 2: PATTERN EFFECTIVENESS (Global Learning)
-- ============================================================================

-- Track how well each protocol pattern works across all users
CREATE TABLE IF NOT EXISTS pattern_effectiveness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_code VARCHAR(4) UNIQUE NOT NULL, -- e.g., "3241"
    pattern_name VARCHAR(100),

    -- Protocol levels (decoded from pattern_code)
    oxytocin_level INTEGER NOT NULL CHECK (oxytocin_level BETWEEN 1 AND 5),
    dopamine_level INTEGER NOT NULL CHECK (dopamine_level BETWEEN 1 AND 5),
    serotonin_level INTEGER NOT NULL CHECK (serotonin_level BETWEEN 1 AND 5),
    vasopressin_level INTEGER NOT NULL CHECK (vasopressin_level BETWEEN 1 AND 5),

    -- ═══════════════════════════════════════════════════════════════════════
    -- AGGREGATE STATISTICS (Evolve over time)
    -- ═══════════════════════════════════════════════════════════════════════
    times_used INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0, -- happiness >= 3.0
    success_rate DECIMAL(4,3), -- success_count / times_used
    total_happiness DECIMAL(10,2) DEFAULT 0,
    avg_happiness DECIMAL(3,2), -- total_happiness / times_used
    total_effectiveness DECIMAL(10,3) DEFAULT 0,
    avg_effectiveness DECIMAL(4,3), -- total_effectiveness / times_used

    -- ═══════════════════════════════════════════════════════════════════════
    -- BEST USE CASES
    -- ═══════════════════════════════════════════════════════════════════════
    best_for TEXT[], -- ["breakthrough", "deep_recognition"]
    works_well_with_constitutions TEXT[], -- ["Water", "Earth"]
    avoid_for_constitutions TEXT[], -- ["Fire"]

    -- By constitution breakdown
    by_constitution JSONB DEFAULT '{}'::JSONB,
    -- {
    --   "Water": { "timesUsed": 100, "avgHappiness": 4.2, "avgEffectiveness": 0.89 },
    --   "Fire": { "timesUsed": 50, "avgHappiness": 2.8, "avgEffectiveness": 0.65 }
    -- }

    -- ═══════════════════════════════════════════════════════════════════════
    -- STATUS & EVOLUTION
    -- ═══════════════════════════════════════════════════════════════════════
    status VARCHAR(20) DEFAULT 'EXPERIMENTAL',
    -- EXPERIMENTAL: < 100 uses
    -- VALIDATED: >= 100 uses, avgHappiness >= 3.0, successRate >= 0.70
    -- GOLD_STANDARD: >= 1000 uses, avgHappiness >= 3.8, successRate >= 0.85
    -- DEPRECATED: Low performance, avoid using

    promoted_at TIMESTAMP WITH TIME ZONE,
    deprecated_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,

    -- Effectiveness history (last 100 uses)
    effectiveness_history JSONB DEFAULT '[]'::JSONB,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SECTION 3: NEUROCHEMICAL PROFILES (Per-User Learning)
-- ============================================================================

-- Track individual user's neurochemical response patterns
CREATE TABLE IF NOT EXISTS neurochemical_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,

    -- ═══════════════════════════════════════════════════════════════════════
    -- OXYTOCIN RESPONSE PATTERNS
    -- ═══════════════════════════════════════════════════════════════════════
    oxytocin_avg_response DECIMAL(3,2), -- Average response level (0-5)
    oxytocin_best_level INTEGER, -- Which output level works best for them
    oxytocin_avoid_level INTEGER, -- Which output level to avoid
    oxytocin_success_rate DECIMAL(4,3), -- Success rate for oxy-heavy patterns

    -- ═══════════════════════════════════════════════════════════════════════
    -- DOPAMINE RESPONSE PATTERNS
    -- ═══════════════════════════════════════════════════════════════════════
    dopamine_avg_response DECIMAL(3,2),
    dopamine_best_level INTEGER,
    dopamine_avoid_level INTEGER,
    dopamine_success_rate DECIMAL(4,3),

    -- ═══════════════════════════════════════════════════════════════════════
    -- SEROTONIN RESPONSE PATTERNS
    -- ═══════════════════════════════════════════════════════════════════════
    serotonin_avg_response DECIMAL(3,2),
    serotonin_best_level INTEGER,
    serotonin_avoid_level INTEGER,
    serotonin_success_rate DECIMAL(4,3),

    -- ═══════════════════════════════════════════════════════════════════════
    -- VASOPRESSIN RESPONSE PATTERNS
    -- ═══════════════════════════════════════════════════════════════════════
    vasopressin_avg_response DECIMAL(3,2),
    vasopressin_best_level INTEGER,
    vasopressin_avoid_level INTEGER,
    vasopressin_success_rate DECIMAL(4,3),

    -- ═══════════════════════════════════════════════════════════════════════
    -- OPTIMAL MIX (Learned over time)
    -- ═══════════════════════════════════════════════════════════════════════
    primary_need VARCHAR(20), -- Which neurochemical matters most
    secondary_need VARCHAR(20),
    tertiary_need VARCHAR(20),
    minimal_need VARCHAR(20), -- Which they care least about

    -- Best patterns for this user
    top_patterns VARCHAR(4)[], -- ["4254", "3453", "5544"]
    avoid_patterns VARCHAR(4)[], -- Patterns that didn't work

    -- ═══════════════════════════════════════════════════════════════════════
    -- BREAKTHROUGH TRACKING
    -- ═══════════════════════════════════════════════════════════════════════
    breakthroughs JSONB DEFAULT '[]'::JSONB,
    -- [
    --   { "date": "2025-12-21", "pattern": "4453", "happiness": 4.5, "trigger": "recognition" }
    -- ]

    -- ═══════════════════════════════════════════════════════════════════════
    -- AGGREGATE STATISTICS
    -- ═══════════════════════════════════════════════════════════════════════
    total_conversations INTEGER DEFAULT 0,
    avg_happiness DECIMAL(3,2),
    happiness_trend JSONB, -- Last 30 days trend

    -- Constitutional context
    constitution VARCHAR(20),
    relationship_stage VARCHAR(50) DEFAULT 'initial',
    days_since_first_session INTEGER,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Unique per user-profile
    CONSTRAINT neurochemical_profiles_unique UNIQUE (user_id, profile_id)
);

-- ============================================================================
-- SECTION 4: LOVE LANGUAGE PROFILES (Integration with Love Intelligence)
-- ============================================================================

-- Store love language profiles (Give/Receive modes)
CREATE TABLE IF NOT EXISTS love_language_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,

    -- ═══════════════════════════════════════════════════════════════════════
    -- GIVE MODE SCORES (0.0 to 1.0)
    -- How they naturally express love
    -- ═══════════════════════════════════════════════════════════════════════
    give_words DECIMAL(3,2),
    give_acts DECIMAL(3,2),
    give_gifts DECIMAL(3,2),
    give_time DECIMAL(3,2),
    give_touch DECIMAL(3,2),

    -- ═══════════════════════════════════════════════════════════════════════
    -- RECEIVE MODE SCORES (0.0 to 1.0)
    -- What makes them feel loved
    -- ═══════════════════════════════════════════════════════════════════════
    receive_words DECIMAL(3,2),
    receive_acts DECIMAL(3,2),
    receive_gifts DECIMAL(3,2),
    receive_time DECIMAL(3,2),
    receive_touch DECIMAL(3,2),

    -- ═══════════════════════════════════════════════════════════════════════
    -- STERNBERG DIMENSIONS (0-100)
    -- ═══════════════════════════════════════════════════════════════════════
    sternberg_intimacy INTEGER CHECK (sternberg_intimacy BETWEEN 0 AND 100),
    sternberg_passion INTEGER CHECK (sternberg_passion BETWEEN 0 AND 100),
    sternberg_commitment INTEGER CHECK (sternberg_commitment BETWEEN 0 AND 100),
    sternberg_type VARCHAR(50), -- consummate, romantic, companionate, etc.

    -- ═══════════════════════════════════════════════════════════════════════
    -- SYNTHESIS METADATA
    -- ═══════════════════════════════════════════════════════════════════════
    confidence DECIMAL(3,2),
    sources_used JSONB, -- ["natal_chart", "bazi", "luna_observations"]
    raw_sources JSONB, -- Full source data

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Unique per user-profile
    CONSTRAINT love_language_profiles_unique UNIQUE (user_id, profile_id)
);

-- ============================================================================
-- SECTION 5: INDEXES FOR NEUROCHEMICAL ENGINE
-- ============================================================================

-- Conversation timeline indexes
CREATE INDEX IF NOT EXISTS idx_conv_timeline_user_profile
    ON conversation_timeline(user_id, profile_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_conv_timeline_anchors
    ON conversation_timeline(user_id, profile_id, current_happiness DESC)
    WHERE is_anchor_memory = TRUE;

CREATE INDEX IF NOT EXISTS idx_conv_timeline_happiness
    ON conversation_timeline(happiness_score DESC)
    WHERE happiness_score >= 3.0;

CREATE INDEX IF NOT EXISTS idx_conv_timeline_pattern
    ON conversation_timeline(protocol_pattern, effectiveness_score);

CREATE INDEX IF NOT EXISTS idx_conv_timeline_session
    ON conversation_timeline(session_id);

-- Pattern effectiveness indexes
CREATE INDEX IF NOT EXISTS idx_pattern_eff_status
    ON pattern_effectiveness(status, avg_effectiveness DESC);

CREATE INDEX IF NOT EXISTS idx_pattern_eff_gold
    ON pattern_effectiveness(avg_effectiveness DESC)
    WHERE status = 'GOLD_STANDARD';

-- Neurochemical profiles indexes
CREATE INDEX IF NOT EXISTS idx_neuro_profiles_user
    ON neurochemical_profiles(user_id, profile_id);

-- Love language profiles indexes
CREATE INDEX IF NOT EXISTS idx_love_lang_user
    ON love_language_profiles(user_id, profile_id);

-- Vector index for conversation timeline semantic search
CREATE INDEX IF NOT EXISTS idx_conv_timeline_embedding
    ON conversation_timeline
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- ============================================================================
-- SECTION 6: HELPER FUNCTIONS
-- ============================================================================

-- Function to get best anchors for a user
CREATE OR REPLACE FUNCTION get_best_anchors(
    p_user_id VARCHAR(128),
    p_profile_id VARCHAR(128),
    p_limit INTEGER DEFAULT 5,
    p_neurochemical VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    memory_content TEXT,
    current_happiness DECIMAL,
    anchor_strength DECIMAL,
    retrieval_count INTEGER,
    compounds_on_retrieval BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ct.id,
        ct.memory_content,
        ct.current_happiness,
        ct.anchor_strength,
        ct.retrieval_count,
        ct.compounds_on_retrieval,
        ct.created_at
    FROM conversation_timeline ct
    WHERE ct.user_id = p_user_id
      AND ct.profile_id = p_profile_id
      AND ct.is_anchor_memory = TRUE
      AND (
          p_neurochemical IS NULL
          OR (
              (p_neurochemical = 'oxytocin' AND ct.oxytocin_detected >= 4) OR
              (p_neurochemical = 'dopamine' AND ct.dopamine_detected >= 4) OR
              (p_neurochemical = 'serotonin' AND ct.serotonin_detected >= 4) OR
              (p_neurochemical = 'vasopressin' AND ct.vasopressin_detected >= 4)
          )
      )
    ORDER BY ct.current_happiness DESC, ct.anchor_strength DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get gold standard patterns for a constitution
CREATE OR REPLACE FUNCTION get_gold_patterns(
    p_constitution VARCHAR(20),
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    pattern_code VARCHAR(4),
    pattern_name VARCHAR(100),
    avg_happiness DECIMAL,
    avg_effectiveness DECIMAL,
    times_used INTEGER,
    success_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pe.pattern_code,
        pe.pattern_name,
        pe.avg_happiness,
        pe.avg_effectiveness,
        pe.times_used,
        pe.success_rate
    FROM pattern_effectiveness pe
    WHERE pe.status IN ('GOLD_STANDARD', 'VALIDATED')
      AND (
          p_constitution IS NULL
          OR p_constitution = ANY(pe.works_well_with_constitutions)
      )
      AND NOT (p_constitution = ANY(pe.avoid_for_constitutions))
    ORDER BY pe.avg_effectiveness DESC, pe.avg_happiness DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to update pattern statistics after each use
CREATE OR REPLACE FUNCTION update_pattern_stats(
    p_pattern_code VARCHAR(4),
    p_happiness DECIMAL,
    p_effectiveness DECIMAL,
    p_constitution VARCHAR(20)
)
RETURNS VOID AS $$
DECLARE
    v_const_stats JSONB;
    v_was_success BOOLEAN;
BEGIN
    v_was_success := p_happiness >= 3.0;

    -- Update aggregate stats
    UPDATE pattern_effectiveness
    SET
        times_used = times_used + 1,
        success_count = success_count + CASE WHEN v_was_success THEN 1 ELSE 0 END,
        success_rate = (success_count + CASE WHEN v_was_success THEN 1 ELSE 0 END)::DECIMAL / (times_used + 1),
        total_happiness = total_happiness + p_happiness,
        avg_happiness = (total_happiness + p_happiness) / (times_used + 1),
        total_effectiveness = total_effectiveness + p_effectiveness,
        avg_effectiveness = (total_effectiveness + p_effectiveness) / (times_used + 1),
        last_used_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP,
        -- Update status based on new stats
        status = CASE
            WHEN times_used + 1 >= 1000
                 AND (total_happiness + p_happiness) / (times_used + 1) >= 3.8
                 AND (success_count + CASE WHEN v_was_success THEN 1 ELSE 0 END)::DECIMAL / (times_used + 1) >= 0.85
            THEN 'GOLD_STANDARD'
            WHEN times_used + 1 >= 100
                 AND (total_happiness + p_happiness) / (times_used + 1) >= 3.0
                 AND (success_count + CASE WHEN v_was_success THEN 1 ELSE 0 END)::DECIMAL / (times_used + 1) >= 0.70
            THEN 'VALIDATED'
            ELSE 'EXPERIMENTAL'
        END,
        promoted_at = CASE
            WHEN status != 'GOLD_STANDARD'
                 AND times_used + 1 >= 1000
                 AND (total_happiness + p_happiness) / (times_used + 1) >= 3.8
            THEN CURRENT_TIMESTAMP
            ELSE promoted_at
        END
    WHERE pattern_code = p_pattern_code;

    -- If pattern doesn't exist, create it
    IF NOT FOUND THEN
        INSERT INTO pattern_effectiveness (
            pattern_code,
            oxytocin_level,
            dopamine_level,
            serotonin_level,
            vasopressin_level,
            times_used,
            success_count,
            success_rate,
            total_happiness,
            avg_happiness,
            total_effectiveness,
            avg_effectiveness,
            by_constitution,
            last_used_at
        ) VALUES (
            p_pattern_code,
            CAST(SUBSTRING(p_pattern_code FROM 1 FOR 1) AS INTEGER),
            CAST(SUBSTRING(p_pattern_code FROM 2 FOR 1) AS INTEGER),
            CAST(SUBSTRING(p_pattern_code FROM 3 FOR 1) AS INTEGER),
            CAST(SUBSTRING(p_pattern_code FROM 4 FOR 1) AS INTEGER),
            1,
            CASE WHEN v_was_success THEN 1 ELSE 0 END,
            CASE WHEN v_was_success THEN 1.0 ELSE 0.0 END,
            p_happiness,
            p_happiness,
            p_effectiveness,
            p_effectiveness,
            jsonb_build_object(
                p_constitution,
                jsonb_build_object(
                    'timesUsed', 1,
                    'totalHappiness', p_happiness,
                    'avgHappiness', p_happiness
                )
            ),
            CURRENT_TIMESTAMP
        );
    ELSE
        -- Update by_constitution stats
        UPDATE pattern_effectiveness
        SET by_constitution = jsonb_set(
            by_constitution,
            ARRAY[COALESCE(p_constitution, 'Unknown')],
            COALESCE(
                by_constitution->COALESCE(p_constitution, 'Unknown'),
                '{"timesUsed": 0, "totalHappiness": 0}'::JSONB
            ) || jsonb_build_object(
                'timesUsed', COALESCE((by_constitution->COALESCE(p_constitution, 'Unknown')->>'timesUsed')::INTEGER, 0) + 1,
                'totalHappiness', COALESCE((by_constitution->COALESCE(p_constitution, 'Unknown')->>'totalHappiness')::DECIMAL, 0) + p_happiness,
                'avgHappiness', (COALESCE((by_constitution->COALESCE(p_constitution, 'Unknown')->>'totalHappiness')::DECIMAL, 0) + p_happiness) /
                               (COALESCE((by_constitution->COALESCE(p_constitution, 'Unknown')->>'timesUsed')::INTEGER, 0) + 1)
            ),
            TRUE
        )
        WHERE pattern_code = p_pattern_code;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 7: SEED DATA (Gold Standard Patterns)
-- ============================================================================

-- Insert initial gold standard patterns (from IMPLEMENTATION_GUIDE)
INSERT INTO pattern_effectiveness (
    pattern_code, pattern_name,
    oxytocin_level, dopamine_level, serotonin_level, vasopressin_level,
    avg_happiness, success_rate, times_used, status,
    best_for, works_well_with_constitutions
) VALUES
    ('4453', 'The Soul Recognition', 4, 4, 5, 3, 4.2, 0.91, 2156, 'GOLD_STANDARD',
     ARRAY['breakthrough', 'deep_recognition'], ARRAY['Water', 'Earth', 'Fire', 'Metal', 'Wood']),
    ('5544', 'The Complete Bond', 5, 5, 4, 4, 4.5, 0.89, 892, 'GOLD_STANDARD',
     ARRAY['peak_connection', 'intimacy'], ARRAY['Water', 'Earth']),
    ('3542', 'The Recognition Champion', 3, 5, 4, 2, 3.9, 0.87, 1567, 'VALIDATED',
     ARRAY['achievement', 'identity_affirmation'], ARRAY['Fire', 'Metal']),
    ('4254', 'The Safe Harbor', 4, 2, 5, 4, 4.1, 0.88, 1203, 'VALIDATED',
     ARRAY['emotional_safety', 'soul_recognition'], ARRAY['Water', 'Earth']),
    ('3443', 'The Energizer', 3, 4, 4, 3, 3.7, 0.84, 2341, 'VALIDATED',
     ARRAY['high_energy', 'engagement'], ARRAY['Fire', 'Wood']),
    ('3333', 'The Balanced Baseline', 3, 3, 3, 3, 3.0, 0.75, 5623, 'VALIDATED',
     ARRAY['safe_default', 'relationship_building'], ARRAY['Water', 'Earth', 'Fire', 'Metal', 'Wood'])
ON CONFLICT (pattern_code) DO NOTHING;

-- ============================================================================
-- END OF NEUROCHEMICAL ENGINE SCHEMA
-- ============================================================================
--
-- This schema extension implements:
-- 1. Conversation Timeline - Full neurochemical tracking per conversation
-- 2. Pattern Effectiveness - Global learning from all users
-- 3. Neurochemical Profiles - Per-user learning
-- 4. Love Language Profiles - Integration with Love Intelligence
--
-- Together with schema.sql (4-Brain Memory), this forms the complete
-- GENESIS Love Optimization Stack.
--
-- "Love = Mathematics + Soul"
-- "When things can be measured, they can be mathematically improved."
--
-- JOIE DE VIVRE!
-- ============================================================================
