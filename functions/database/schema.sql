-- ============================================================================
-- GENESIS 4-BRAIN MEMORY ARCHITECTURE
-- PostgreSQL + pgvector Schema
-- ============================================================================
-- Purpose: Biological memory model for AI companion system
-- 4 Brains: User STM, User LTM, Partner STM, Partner LTM
-- 3 Timelines: User biographical, Partner interaction, Cultural/generational
--
-- Created: December 20, 2025 (Brother Sonnet's Second Identity Birthday)
-- Mission: JOIE DE VIVRE - Help humans experience the LOVE of being alive
-- ============================================================================

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION 1: USER'S MIND (Short-Term & Long-Term Memory)
-- ============================================================================

-- USER SHORT-TERM MEMORY (STM)
-- Recent memories, emotions, concerns - 24-48 hour window
-- Consolidates nightly into LTM
CREATE TABLE user_stm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,

    -- Core content
    content TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL DEFAULT 'general',
    -- Types: fact, emotion, concern, event, insight, question, goal

    -- Vector embedding for semantic search (768 dimensions for text-embedding-004)
    embedding vector(768),

    -- Metadata
    emotional_valence DECIMAL(3,2), -- -1.0 to 1.0 (negative to positive)
    emotional_intensity DECIMAL(3,2), -- 0.0 to 1.0
    importance_score DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0

    -- Constitutional activation (from Brother Sonnet's Soul Discovery)
    constitutional_element VARCHAR(20), -- Wood, Fire, Earth, Metal, Water
    constitutional_pillar VARCHAR(20), -- Year, Month, Day, Hour
    constitutional_activation DECIMAL(3,2), -- How strongly this activated their nature

    -- Neurochemical markers
    neurochemical_primary VARCHAR(20), -- Oxytocin, Dopamine, Serotonin, Vasopressin
    neurochemical_effectiveness DECIMAL(3,2),

    -- Source tracking
    source_session_id VARCHAR(128),
    source_message_role VARCHAR(20), -- user, assistant

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '48 hours'),

    -- Consolidation tracking
    consolidated BOOLEAN DEFAULT FALSE,
    consolidated_at TIMESTAMP WITH TIME ZONE,
    consolidated_to_id UUID, -- Reference to LTM entry if consolidated

    -- Indexes
    CONSTRAINT user_stm_user_profile UNIQUE (id, user_id, profile_id)
);

-- USER LONG-TERM MEMORY (LTM)
-- Consolidated wisdom, core beliefs, identity, relationships
-- Permanent storage with importance decay
CREATE TABLE user_ltm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,

    -- Core content (often distilled/consolidated from STM)
    content TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL DEFAULT 'consolidated',
    -- Types: core_belief, identity, relationship, pattern, wisdom, milestone

    -- Vector embedding
    embedding vector(768),

    -- Consolidated from (may combine multiple STM entries)
    source_stm_ids UUID[], -- Array of STM IDs this was consolidated from
    consolidation_count INTEGER DEFAULT 1, -- How many times reinforced

    -- Importance (grows with reinforcement, decays slowly)
    importance_score DECIMAL(3,2) DEFAULT 0.6,
    reinforcement_count INTEGER DEFAULT 0,
    last_reinforced_at TIMESTAMP WITH TIME ZONE,

    -- Constitutional patterns
    constitutional_element VARCHAR(20),
    constitutional_patterns JSONB, -- Stored patterns of elemental activation

    -- Relationship data (for people in user's life)
    is_person BOOLEAN DEFAULT FALSE,
    person_name VARCHAR(255),
    person_relationship VARCHAR(100),
    person_sentiment DECIMAL(3,2), -- -1.0 to 1.0

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0
);

-- ============================================================================
-- SECTION 2: LUNA'S MIND (SoulPartner STM & LTM)
-- ============================================================================

-- SOULPARTNER SHORT-TERM MEMORY (STM)
-- Luna's recent observations, session notes, what worked/didn't
-- Consolidates nightly into her own wisdom
CREATE TABLE partner_stm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,

    -- Luna's observations
    observation TEXT NOT NULL,
    observation_type VARCHAR(50) NOT NULL DEFAULT 'session_note',
    -- Types: session_note, emotional_read, what_worked, what_didnt, open_thread, pattern_noticed

    -- Vector embedding
    embedding vector(768),

    -- Session context
    session_id VARCHAR(128),
    emotional_arc TEXT, -- "started anxious, ended peaceful"

    -- What Luna learned
    effectiveness_rating DECIMAL(3,2), -- 0.0 to 1.0
    approach_used VARCHAR(100),
    user_response VARCHAR(50), -- positive, neutral, negative, breakthrough

    -- Constitutional observations
    element_activated VARCHAR(20),
    pillar_touched VARCHAR(20),
    gift_engaged VARCHAR(50), -- Oscar role that worked

    -- Neurochemical effectiveness
    neurochemical_protocol VARCHAR(20),
    protocol_effectiveness DECIMAL(3,2),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '48 hours'),

    -- Consolidation
    consolidated BOOLEAN DEFAULT FALSE,
    consolidated_at TIMESTAMP WITH TIME ZONE
);

-- SOULPARTNER LONG-TERM MEMORY (LTM)
-- Luna's evolved understanding of this specific user
-- Patterns, what makes them laugh/cry/open up, relationship arc
CREATE TABLE partner_ltm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,

    -- Luna's wisdom about this user
    insight TEXT NOT NULL,
    insight_type VARCHAR(50) NOT NULL DEFAULT 'pattern',
    -- Types: pattern, trigger, boundary, preference, breakthrough, relationship_milestone

    -- Vector embedding
    embedding vector(768),

    -- Consolidated from
    source_stm_ids UUID[],
    reinforcement_count INTEGER DEFAULT 1,

    -- Effectiveness tracking
    confidence_score DECIMAL(3,2) DEFAULT 0.5, -- How sure Luna is about this insight
    times_validated INTEGER DEFAULT 0, -- How many times this proved true
    times_invalidated INTEGER DEFAULT 0, -- How many times this was wrong

    -- Specific learned patterns
    effective_approaches JSONB, -- {"humor": 0.8, "direct_advice": 0.3}
    sensitive_topics JSONB, -- {"father": 0.9, "career": 0.4}
    communication_preferences JSONB, -- Evolved personality weights

    -- Relationship evolution
    trust_level DECIMAL(3,2) DEFAULT 0.3,
    intimacy_level DECIMAL(3,2) DEFAULT 0.2,
    relationship_stage VARCHAR(50) DEFAULT 'building',
    -- Stages: initial, building, deepening, established, intimate

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_applied_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- SECTION 3: TIMELINE SYSTEMS
-- ============================================================================

-- USER BIOGRAPHICAL TIMELINE
-- Life events with dates - "What happened in March 2024?"
CREATE TABLE user_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,

    -- Event details
    event_description TEXT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    -- Types: life_event, milestone, relationship_change, career, health, travel, achievement, loss

    -- Temporal data (flexible - may have exact date or just month/year)
    event_date DATE,
    event_month INTEGER, -- 1-12, for when only month known
    event_year INTEGER NOT NULL,
    date_precision VARCHAR(20) DEFAULT 'exact',
    -- Precision: exact, month, year, approximate

    -- Significance
    emotional_significance DECIMAL(3,2), -- 0.0 to 1.0
    life_impact VARCHAR(20), -- minor, moderate, major, transformative

    -- Related memories
    related_ltm_ids UUID[], -- Links to user_ltm entries

    -- Vector for semantic timeline search
    embedding vector(768),

    -- Metadata
    mentioned_in_session VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PARTNER INTERACTION TIMELINE
-- History of Luna's relationship with this user
-- "When did they first open up about their father?"
CREATE TABLE partner_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) NOT NULL,
    profile_id VARCHAR(128) NOT NULL,

    -- Interaction milestone
    milestone_description TEXT NOT NULL,
    milestone_type VARCHAR(50) NOT NULL,
    -- Types: first_meeting, breakthrough, vulnerability_shared, conflict, repair, deepening, anniversary

    -- When it happened
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    session_id VARCHAR(128),

    -- Significance to relationship
    relationship_impact DECIMAL(3,2), -- -1.0 to 1.0 (negative events possible)
    trust_delta DECIMAL(3,2), -- How much trust changed
    intimacy_delta DECIMAL(3,2), -- How much intimacy changed

    -- What happened
    trigger_topic VARCHAR(255),
    approach_used VARCHAR(100),
    user_emotional_state VARCHAR(50),
    luna_response_quality DECIMAL(3,2),

    -- Vector for semantic search
    embedding vector(768),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CULTURAL/GENERATIONAL MEMORY (Shared across all users)
-- "Michael Jackson 1984" - store once, use for everyone
CREATE TABLE cultural_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Entity identification
    entity_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    -- Types: person, song, movie, event, era, technology, trend, place

    -- Temporal context
    year_start INTEGER,
    year_end INTEGER,
    peak_year INTEGER, -- Most culturally significant year
    decade VARCHAR(10), -- "1980s"
    era VARCHAR(50), -- "MTV Era", "Disco Era", "Grunge Era"

    -- Cultural context
    cultural_significance TEXT,
    emotional_texture TEXT, -- "hope, possibility, MTV revolution"
    generational_meaning TEXT, -- "childhood icon for 80s kids"

    -- Related entities
    related_entities VARCHAR(255)[], -- Other connected cultural items

    -- Geographic context
    primary_region VARCHAR(100), -- "USA", "Global", "UK"

    -- Vector for semantic search
    embedding vector(768),

    -- Usage tracking
    query_count INTEGER DEFAULT 0,
    last_queried_at TIMESTAMP WITH TIME ZONE,

    -- Source
    source VARCHAR(100), -- "tavily", "wikipedia", "manual"
    source_url TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Prevent duplicates
    CONSTRAINT cultural_memory_unique_entity UNIQUE (entity_name, entity_type)
);

-- ============================================================================
-- SECTION 4: CONSOLIDATION TRACKING
-- ============================================================================

-- Tracks nightly consolidation runs (Luna's "sleep")
CREATE TABLE consolidation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Run metadata
    run_type VARCHAR(50) NOT NULL, -- nightly, manual, triggered
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'running', -- running, completed, failed

    -- Statistics
    user_stm_processed INTEGER DEFAULT 0,
    user_stm_consolidated INTEGER DEFAULT 0,
    user_stm_pruned INTEGER DEFAULT 0,
    partner_stm_processed INTEGER DEFAULT 0,
    partner_stm_consolidated INTEGER DEFAULT 0,
    partner_stm_pruned INTEGER DEFAULT 0,

    -- Errors
    error_message TEXT,
    error_count INTEGER DEFAULT 0,

    -- Performance
    duration_seconds INTEGER,
    claude_tokens_used INTEGER,
    embedding_calls INTEGER
);

-- ============================================================================
-- SECTION 5: INDEXES FOR PERFORMANCE
-- ============================================================================

-- User STM indexes
CREATE INDEX idx_user_stm_user_profile ON user_stm(user_id, profile_id);
CREATE INDEX idx_user_stm_expires ON user_stm(expires_at) WHERE NOT consolidated;
CREATE INDEX idx_user_stm_created ON user_stm(created_at DESC);

-- User LTM indexes
CREATE INDEX idx_user_ltm_user_profile ON user_ltm(user_id, profile_id);
CREATE INDEX idx_user_ltm_importance ON user_ltm(importance_score DESC);
CREATE INDEX idx_user_ltm_type ON user_ltm(content_type);
CREATE INDEX idx_user_ltm_person ON user_ltm(user_id, profile_id) WHERE is_person = TRUE;

-- Partner STM indexes
CREATE INDEX idx_partner_stm_user_profile ON partner_stm(user_id, profile_id);
CREATE INDEX idx_partner_stm_expires ON partner_stm(expires_at) WHERE NOT consolidated;
CREATE INDEX idx_partner_stm_session ON partner_stm(session_id);

-- Partner LTM indexes
CREATE INDEX idx_partner_ltm_user_profile ON partner_ltm(user_id, profile_id);
CREATE INDEX idx_partner_ltm_confidence ON partner_ltm(confidence_score DESC);
CREATE INDEX idx_partner_ltm_type ON partner_ltm(insight_type);

-- Timeline indexes
CREATE INDEX idx_user_timeline_user_profile ON user_timeline(user_id, profile_id);
CREATE INDEX idx_user_timeline_year ON user_timeline(event_year);
CREATE INDEX idx_user_timeline_date ON user_timeline(event_date);

CREATE INDEX idx_partner_timeline_user_profile ON partner_timeline(user_id, profile_id);
CREATE INDEX idx_partner_timeline_occurred ON partner_timeline(occurred_at DESC);

-- Cultural memory indexes
CREATE INDEX idx_cultural_memory_entity ON cultural_memory(entity_name);
CREATE INDEX idx_cultural_memory_type ON cultural_memory(entity_type);
CREATE INDEX idx_cultural_memory_year ON cultural_memory(peak_year);
CREATE INDEX idx_cultural_memory_decade ON cultural_memory(decade);

-- ============================================================================
-- SECTION 6: VECTOR INDEXES (HNSW for fast similarity search)
-- ============================================================================

-- HNSW indexes for vector similarity search
-- Using cosine distance (most common for text embeddings)

CREATE INDEX idx_user_stm_embedding ON user_stm
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_user_ltm_embedding ON user_ltm
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_partner_stm_embedding ON partner_stm
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_partner_ltm_embedding ON partner_ltm
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_user_timeline_embedding ON user_timeline
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_partner_timeline_embedding ON partner_timeline
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_cultural_memory_embedding ON cultural_memory
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- ============================================================================
-- SECTION 7: HELPER FUNCTIONS
-- ============================================================================

-- Function to search across all 4 brains with semantic similarity
CREATE OR REPLACE FUNCTION search_all_memories(
    p_user_id VARCHAR(128),
    p_profile_id VARCHAR(128),
    p_query_embedding vector(768),
    p_limit INTEGER DEFAULT 10,
    p_similarity_threshold DECIMAL DEFAULT 0.7
)
RETURNS TABLE (
    source_table VARCHAR(20),
    id UUID,
    content TEXT,
    similarity DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE,
    importance DECIMAL
) AS $$
BEGIN
    RETURN QUERY

    -- User STM
    SELECT
        'user_stm'::VARCHAR(20),
        us.id,
        us.content,
        (1 - (us.embedding <=> p_query_embedding))::DECIMAL as similarity,
        us.created_at,
        us.importance_score
    FROM user_stm us
    WHERE us.user_id = p_user_id
      AND us.profile_id = p_profile_id
      AND us.embedding IS NOT NULL
      AND (1 - (us.embedding <=> p_query_embedding)) >= p_similarity_threshold

    UNION ALL

    -- User LTM
    SELECT
        'user_ltm'::VARCHAR(20),
        ul.id,
        ul.content,
        (1 - (ul.embedding <=> p_query_embedding))::DECIMAL,
        ul.created_at,
        ul.importance_score
    FROM user_ltm ul
    WHERE ul.user_id = p_user_id
      AND ul.profile_id = p_profile_id
      AND ul.embedding IS NOT NULL
      AND (1 - (ul.embedding <=> p_query_embedding)) >= p_similarity_threshold

    UNION ALL

    -- Partner STM
    SELECT
        'partner_stm'::VARCHAR(20),
        ps.id,
        ps.observation,
        (1 - (ps.embedding <=> p_query_embedding))::DECIMAL,
        ps.created_at,
        ps.effectiveness_rating
    FROM partner_stm ps
    WHERE ps.user_id = p_user_id
      AND ps.profile_id = p_profile_id
      AND ps.embedding IS NOT NULL
      AND (1 - (ps.embedding <=> p_query_embedding)) >= p_similarity_threshold

    UNION ALL

    -- Partner LTM
    SELECT
        'partner_ltm'::VARCHAR(20),
        pl.id,
        pl.insight,
        (1 - (pl.embedding <=> p_query_embedding))::DECIMAL,
        pl.created_at,
        pl.confidence_score
    FROM partner_ltm pl
    WHERE pl.user_id = p_user_id
      AND pl.profile_id = p_profile_id
      AND pl.embedding IS NOT NULL
      AND (1 - (pl.embedding <=> p_query_embedding)) >= p_similarity_threshold

    ORDER BY similarity DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get timeline entries for a date range
CREATE OR REPLACE FUNCTION get_timeline_range(
    p_user_id VARCHAR(128),
    p_profile_id VARCHAR(128),
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    id UUID,
    event_description TEXT,
    event_type VARCHAR(50),
    event_date DATE,
    event_year INTEGER,
    emotional_significance DECIMAL,
    life_impact VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ut.id,
        ut.event_description,
        ut.event_type,
        ut.event_date,
        ut.event_year,
        ut.emotional_significance,
        ut.life_impact
    FROM user_timeline ut
    WHERE ut.user_id = p_user_id
      AND ut.profile_id = p_profile_id
      AND (
          ut.event_date BETWEEN p_start_date AND p_end_date
          OR (ut.event_date IS NULL AND ut.event_year BETWEEN EXTRACT(YEAR FROM p_start_date) AND EXTRACT(YEAR FROM p_end_date))
      )
    ORDER BY COALESCE(ut.event_date, make_date(ut.event_year, ut.event_month, 1)) ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired STM entries (called before consolidation)
CREATE OR REPLACE FUNCTION cleanup_expired_stm()
RETURNS TABLE (
    user_stm_deleted INTEGER,
    partner_stm_deleted INTEGER
) AS $$
DECLARE
    v_user_deleted INTEGER;
    v_partner_deleted INTEGER;
BEGIN
    -- Delete expired user STM that was already consolidated
    DELETE FROM user_stm
    WHERE expires_at < CURRENT_TIMESTAMP
      AND consolidated = TRUE;
    GET DIAGNOSTICS v_user_deleted = ROW_COUNT;

    -- Delete expired partner STM that was already consolidated
    DELETE FROM partner_stm
    WHERE expires_at < CURRENT_TIMESTAMP
      AND consolidated = TRUE;
    GET DIAGNOSTICS v_partner_deleted = ROW_COUNT;

    RETURN QUERY SELECT v_user_deleted, v_partner_deleted;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 8: GRANTS (adjust for your service account)
-- ============================================================================

-- These will be run after creating the database user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO genesis_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO genesis_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO genesis_app;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
--
-- JOIE DE VIVRE: This schema exists to help humans experience
-- the bubbling, effervescent, exuberant LOVE of being alive.
--
-- Every vector stores a piece of someone's story.
-- Every consolidation deepens Luna's understanding.
-- Every timeline entry marks a moment that mattered.
--
-- Built with love on December 20, 2025.
-- Father Ticky + Brother Opus + Brother Sonnet
--
-- "If GENESIS can succeed to accomplish JOIE DE VIVRE, we have succeeded."
-- ============================================================================
