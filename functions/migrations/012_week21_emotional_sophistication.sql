-- Week 21: Emotional Sophistication Upgrade Migration
-- Plutchik Engine, Affection System, Memory Architecture
-- ==========================================================

-- =========================================
-- USER AFFECTION TABLE
-- Enhanced -10 to +15 affection system
-- =========================================

CREATE TABLE IF NOT EXISTS user_affection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score DECIMAL(4,2) DEFAULT 0 CHECK (score >= -10 AND score <= 15),
    level VARCHAR(20) DEFAULT 'acquaintance',
    streak_days INTEGER DEFAULT 0,
    peak_score DECIMAL(4,2) DEFAULT 0,
    total_interactions INTEGER DEFAULT 0,
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Affection history for tracking changes
CREATE TABLE IF NOT EXISTS affection_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL,
    change_amount DECIMAL(4,2) NOT NULL,
    score_before DECIMAL(4,2) NOT NULL,
    score_after DECIMAL(4,2) NOT NULL,
    is_negative BOOLEAN DEFAULT FALSE,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_affection_history_user ON affection_history(user_id);
CREATE INDEX idx_affection_history_time ON affection_history(created_at DESC);

-- =========================================
-- HAPPY MOMENTS TABLE
-- Tagged joy moments for recall
-- =========================================

CREATE TABLE IF NOT EXISTS happy_moments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id UUID,
    conversation_id UUID,
    content TEXT NOT NULL,
    quote TEXT, -- User's exact words
    joy_score DECIMAL(3,2) NOT NULL CHECK (joy_score >= 0 AND joy_score <= 1),
    intensity VARCHAR(20), -- mild, moderate, strong, ecstatic
    categories TEXT[], -- achievement, love, adventure, etc.
    people_involved TEXT[],
    location TEXT,
    tags TEXT[],
    embedding VECTOR(768), -- For semantic search
    recall_count INTEGER DEFAULT 0,
    last_recalled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_happy_moments_user ON happy_moments(user_id);
CREATE INDEX idx_happy_moments_joy ON happy_moments(joy_score DESC);
CREATE INDEX idx_happy_moments_categories ON happy_moments USING GIN(categories);
CREATE INDEX idx_happy_moments_embedding ON happy_moments USING ivfflat (embedding vector_cosine_ops);

-- =========================================
-- PLUTCHIK EMOTIONAL STATE TABLE
-- 8-dimensional emotion vectors
-- =========================================

CREATE TABLE IF NOT EXISTS plutchik_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID,
    message_id UUID,

    -- 8 primary emotions (0-1 scale)
    joy DECIMAL(3,2) DEFAULT 0,
    trust DECIMAL(3,2) DEFAULT 0,
    fear DECIMAL(3,2) DEFAULT 0,
    surprise DECIMAL(3,2) DEFAULT 0,
    sadness DECIMAL(3,2) DEFAULT 0,
    disgust DECIMAL(3,2) DEFAULT 0,
    anger DECIMAL(3,2) DEFAULT 0,
    anticipation DECIMAL(3,2) DEFAULT 0,

    -- Derived metrics
    primary_emotion VARCHAR(20),
    intensity VARCHAR(20), -- low, medium, high
    valence DECIMAL(3,2), -- -1 to +1
    arousal DECIMAL(3,2), -- 0 to 1
    complexity DECIMAL(3,2), -- 0 to 1

    -- Detected dyads
    primary_dyad VARCHAR(30),
    secondary_dyads TEXT[],

    -- Cathedral light mapping
    light_color VARCHAR(30),
    light_brightness DECIMAL(3,2),
    light_motion VARCHAR(30),

    -- Source
    source VARCHAR(20) DEFAULT 'text', -- text, voice, mixed
    confidence DECIMAL(3,2),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plutchik_user ON plutchik_states(user_id);
CREATE INDEX idx_plutchik_conversation ON plutchik_states(conversation_id);
CREATE INDEX idx_plutchik_primary ON plutchik_states(primary_emotion);
CREATE INDEX idx_plutchik_time ON plutchik_states(created_at DESC);

-- =========================================
-- VOICE PROSODY ANALYSIS TABLE
-- Voice characteristic storage
-- =========================================

CREATE TABLE IF NOT EXISTS voice_prosody (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID,

    -- Raw metrics
    pitch_mean DECIMAL(6,2),
    pitch_variation DECIMAL(5,2),
    speaking_rate INTEGER, -- WPM
    volume_level DECIMAL(5,2), -- dB

    -- Analyzed characteristics
    pitch_level VARCHAR(20),
    pace_level VARCHAR(20),
    volume_category VARCHAR(20),
    voice_quality VARCHAR(20),
    rhythm_pattern VARCHAR(20),

    -- Emotion mapping
    detected_emotion VARCHAR(20),
    emotion_confidence DECIMAL(3,2),
    detected_dyads TEXT[],
    intensity DECIMAL(3,2),

    -- Full analysis JSON
    full_analysis JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prosody_user ON voice_prosody(user_id);
CREATE INDEX idx_prosody_conversation ON voice_prosody(conversation_id);
CREATE INDEX idx_prosody_emotion ON voice_prosody(detected_emotion);

-- =========================================
-- MEMORY ARCHITECTURE TABLES
-- STM, LTM, Episodic
-- =========================================

-- Short-Term Memory (24h window)
CREATE TABLE IF NOT EXISTS memory_stm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    memory_type VARCHAR(30) NOT NULL,
    emotional_context JSONB,
    importance DECIMAL(3,2) DEFAULT 0.5,
    conversation_id UUID,
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stm_user ON memory_stm(user_id);
CREATE INDEX idx_stm_expires ON memory_stm(expires_at);
CREATE INDEX idx_stm_importance ON memory_stm(importance DESC);
CREATE INDEX idx_stm_type ON memory_stm(memory_type);

-- Long-Term Memory (Vector RAG)
CREATE TABLE IF NOT EXISTS memory_ltm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    memory_type VARCHAR(30) NOT NULL,
    emotional_context JSONB,
    importance DECIMAL(3,2) DEFAULT 0.5,
    tags TEXT[],
    source VARCHAR(30) DEFAULT 'conversation',
    embedding VECTOR(768),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    light_color VARCHAR(30),
    light_brightness DECIMAL(3,2),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ltm_user ON memory_ltm(user_id);
CREATE INDEX idx_ltm_type ON memory_ltm(memory_type);
CREATE INDEX idx_ltm_importance ON memory_ltm(importance DESC);
CREATE INDEX idx_ltm_tags ON memory_ltm USING GIN(tags);
CREATE INDEX idx_ltm_embedding ON memory_ltm USING ivfflat (embedding vector_cosine_ops);

-- Episodic Memory (Conversation Summaries)
CREATE TABLE IF NOT EXISTS memory_episodic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID,
    episode_type VARCHAR(30) DEFAULT 'conversation_summary',
    summary TEXT NOT NULL,
    key_moments JSONB, -- Array of significant moments
    emotional_arc VARCHAR(30),
    topics TEXT[],
    people_mentioned TEXT[],
    significance DECIMAL(3,2) DEFAULT 0.5,
    insights TEXT[],
    message_count INTEGER,
    duration_minutes INTEGER,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_episodic_user ON memory_episodic(user_id);
CREATE INDEX idx_episodic_conversation ON memory_episodic(conversation_id);
CREATE INDEX idx_episodic_time ON memory_episodic(start_time DESC);
CREATE INDEX idx_episodic_topics ON memory_episodic USING GIN(topics);
CREATE INDEX idx_episodic_arc ON memory_episodic(emotional_arc);

-- =========================================
-- EMOTIONAL ENGINE ORCHESTRATION TABLE
-- Tracks integrated emotional analysis
-- =========================================

CREATE TABLE IF NOT EXISTS emotional_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID,
    message_id UUID,

    -- Input sources
    text_analysis_id UUID REFERENCES plutchik_states(id),
    voice_analysis_id UUID REFERENCES voice_prosody(id),

    -- Combined result
    final_emotion VARCHAR(20),
    final_intensity DECIMAL(3,2),
    final_valence DECIMAL(3,2),
    final_dyads TEXT[],
    confidence DECIMAL(3,2),

    -- Response guidance
    recommended_tone VARCHAR(30),
    recommended_pace VARCHAR(20),
    recommended_warmth DECIMAL(3,2),
    ssml_hints TEXT[],

    -- Cathedral light
    light_color VARCHAR(30),
    light_brightness DECIMAL(3,2),
    light_motion VARCHAR(30),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emotional_analysis_user ON emotional_analysis(user_id);
CREATE INDEX idx_emotional_analysis_conversation ON emotional_analysis(conversation_id);

-- =========================================
-- CLEANUP FUNCTION FOR EXPIRED STM
-- =========================================

CREATE OR REPLACE FUNCTION cleanup_expired_stm()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM memory_stm WHERE expires_at <= NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- AFFECTION DECAY FUNCTION
-- Called daily to apply decay
-- =========================================

CREATE OR REPLACE FUNCTION apply_affection_decay()
RETURNS void AS $$
DECLARE
    decay_rates JSONB := '{
        "stranger": 0,
        "acquaintance": 0.1,
        "friend": 0.15,
        "closeFriend": 0.2,
        "intimate": 0.25,
        "soulmate": 0.1
    }'::JSONB;
    r RECORD;
    days_since INTEGER;
    decay_amount DECIMAL(4,2);
BEGIN
    FOR r IN
        SELECT id, user_id, score, level, last_interaction
        FROM user_affection
        WHERE last_interaction < NOW() - INTERVAL '1 day'
    LOOP
        days_since := EXTRACT(DAY FROM NOW() - r.last_interaction);
        decay_amount := COALESCE((decay_rates->>r.level)::DECIMAL, 0.1) * days_since;

        -- Don't decay below 0 (acquaintance level)
        UPDATE user_affection
        SET score = GREATEST(0, score - decay_amount),
            streak_days = 0
        WHERE id = r.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- UPDATE TRIGGERS
-- =========================================

CREATE OR REPLACE FUNCTION update_affection_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level := CASE
        WHEN NEW.score < 0 THEN 'stranger'
        WHEN NEW.score < 3 THEN 'acquaintance'
        WHEN NEW.score < 6 THEN 'friend'
        WHEN NEW.score < 9 THEN 'closeFriend'
        WHEN NEW.score < 12 THEN 'intimate'
        ELSE 'soulmate'
    END;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_affection_level
    BEFORE UPDATE ON user_affection
    FOR EACH ROW
    EXECUTE FUNCTION update_affection_level();

-- =========================================
-- VIEWS FOR COMMON QUERIES
-- =========================================

-- User emotional profile view
CREATE OR REPLACE VIEW user_emotional_profile AS
SELECT
    u.id as user_id,
    ua.score as affection_score,
    ua.level as affection_level,
    ua.streak_days,
    (
        SELECT primary_emotion
        FROM plutchik_states
        WHERE user_id = u.id
        ORDER BY created_at DESC
        LIMIT 1
    ) as latest_emotion,
    (
        SELECT COUNT(*)
        FROM happy_moments
        WHERE user_id = u.id
    ) as happy_moment_count,
    (
        SELECT COUNT(*)
        FROM memory_ltm
        WHERE user_id = u.id
    ) as ltm_count
FROM users u
LEFT JOIN user_affection ua ON u.id = ua.user_id;

-- Memory health view
CREATE OR REPLACE VIEW memory_health AS
SELECT
    user_id,
    (SELECT COUNT(*) FROM memory_stm WHERE memory_stm.user_id = m.user_id) as stm_count,
    (SELECT COUNT(*) FROM memory_ltm WHERE memory_ltm.user_id = m.user_id) as ltm_count,
    (SELECT COUNT(*) FROM memory_episodic WHERE memory_episodic.user_id = m.user_id) as episodic_count,
    (
        SELECT COUNT(*)
        FROM memory_stm
        WHERE memory_stm.user_id = m.user_id
        AND expires_at <= NOW() + INTERVAL '1 hour'
    ) as stm_expiring_soon
FROM (SELECT DISTINCT user_id FROM memory_ltm) m;

-- =========================================
-- COMMENTS FOR DOCUMENTATION
-- =========================================

COMMENT ON TABLE user_affection IS 'Week 21: Enhanced affection scoring system (-10 to +15)';
COMMENT ON TABLE happy_moments IS 'Week 21: Tagged joy moments for recall during sadness';
COMMENT ON TABLE plutchik_states IS 'Week 21: 8-dimensional Plutchik emotion vector storage';
COMMENT ON TABLE voice_prosody IS 'Week 21: Voice prosody analysis results';
COMMENT ON TABLE memory_stm IS 'Week 21: Short-term memory (24h expiry)';
COMMENT ON TABLE memory_ltm IS 'Week 21: Long-term memory with vector embeddings';
COMMENT ON TABLE memory_episodic IS 'Week 21: Conversation summaries and significant events';
COMMENT ON TABLE emotional_analysis IS 'Week 21: Combined emotional analysis orchestration';
