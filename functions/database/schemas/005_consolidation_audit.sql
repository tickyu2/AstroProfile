-- ============================================================================
-- GENESIS 4-BRAIN MEMORY ARCHITECTURE
-- Migration 005: Consolidation Audit Tables
-- ============================================================================
-- Adds audit logging for memory promotions, anchor strengthening,
-- and pending promotions for human review.
--
-- Created: December 23, 2025
-- Mission: JOIE DE VIVRE - Transparent, auditable memory operations
-- ============================================================================

-- ============================================================================
-- SECTION 1: MEMORY PROMOTION AUDIT LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_promotion_log (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    stm_id UUID NOT NULL,
    ltm_id UUID,
    reason TEXT,
    score REAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 2: ANCHOR STRENGTH LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS anchor_strength_log (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    anchor_id UUID NOT NULL,
    previous_strength REAL,
    new_strength REAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 3: PENDING PROMOTIONS (for human review)
-- ============================================================================

-- Mid-score items (0.45-0.65) go here for manual review
CREATE TABLE IF NOT EXISTS pending_promotions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    stm_ids UUID[] NOT NULL,
    proposed_content TEXT NOT NULL,
    proposed_embedding vector(768),
    score REAL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending'
    -- Status: pending, approved, rejected
);

-- ============================================================================
-- SECTION 4: HAPPINESS ANCHORS (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS happiness_anchors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    content TEXT NOT NULL,
    anchor_type VARCHAR(50) DEFAULT 'happiness_anchor',
    embedding vector(768),
    strength REAL DEFAULT 1.0,
    recall_count INTEGER DEFAULT 0,
    last_recalled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 5: INDEXES
-- ============================================================================

-- STM consolidation optimization
CREATE INDEX IF NOT EXISTS idx_user_stm_consolidated
    ON user_stm (consolidated, created_at);

CREATE INDEX IF NOT EXISTS idx_user_ltm_user
    ON user_ltm (user_id);

-- Promotion log indexes
CREATE INDEX IF NOT EXISTS idx_promotion_log_user
    ON memory_promotion_log(user_id, profile_id, created_at DESC);

-- Anchor indexes
CREATE INDEX IF NOT EXISTS idx_anchor_log_anchor
    ON anchor_strength_log(anchor_id);

CREATE INDEX IF NOT EXISTS idx_happiness_anchors_user
    ON happiness_anchors(user_id, profile_id);

CREATE INDEX IF NOT EXISTS idx_happiness_anchors_strength
    ON happiness_anchors(strength DESC);

-- Pending promotions index
CREATE INDEX IF NOT EXISTS idx_pending_promotions_status
    ON pending_promotions(status, created_at DESC);

-- ============================================================================
-- SECTION 6: ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================================

-- Add mention_count and emotional_weight to user_stm if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_stm' AND column_name = 'mention_count'
    ) THEN
        ALTER TABLE user_stm ADD COLUMN mention_count INTEGER DEFAULT 1;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_stm' AND column_name = 'emotional_weight'
    ) THEN
        ALTER TABLE user_stm ADD COLUMN emotional_weight REAL DEFAULT 0.5;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_stm' AND column_name = 'consolidated_to'
    ) THEN
        ALTER TABLE user_stm ADD COLUMN consolidated_to UUID;
    END IF;
END $$;

-- Add notes column to consolidation_runs if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'consolidation_runs' AND column_name = 'notes'
    ) THEN
        ALTER TABLE consolidation_runs ADD COLUMN notes TEXT;
    END IF;
END $$;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
