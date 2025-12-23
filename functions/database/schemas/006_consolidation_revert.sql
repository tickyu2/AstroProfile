-- ============================================================================
-- 006_consolidation_revert.sql
-- Add revert capability for memory consolidation rollbacks
--
-- Created: December 23, 2025
-- Mission: JOIE DE VIVRE
-- ============================================================================

-- Add revert marker columns to LTM table
ALTER TABLE user_ltm
  ADD COLUMN IF NOT EXISTS reverted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reverted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reverted_by TEXT;

-- Create revert audit log table
CREATE TABLE IF NOT EXISTS consolidation_revert_log (
  id SERIAL PRIMARY KEY,
  actor TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ltm_ids UUID[] NOT NULL,
  restored_stm_ids UUID[] NOT NULL,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  before_snapshot JSONB,
  after_snapshot JSONB,
  request_id TEXT
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_revert_log_created_at
  ON consolidation_revert_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_revert_log_user_id
  ON consolidation_revert_log(user_id);

CREATE INDEX IF NOT EXISTS idx_revert_log_actor
  ON consolidation_revert_log(actor);

CREATE INDEX IF NOT EXISTS idx_ltm_reverted
  ON user_ltm(reverted) WHERE reverted = TRUE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE consolidation_revert_log IS
  'Immutable audit log of all consolidation rollbacks for compliance and debugging';

COMMENT ON COLUMN consolidation_revert_log.before_snapshot IS
  'JSON snapshot of LTM and STM state before revert for full auditability';

COMMENT ON COLUMN consolidation_revert_log.after_snapshot IS
  'JSON snapshot of LTM and STM state after revert for verification';

COMMENT ON COLUMN user_ltm.reverted IS
  'Soft delete flag - true if this LTM entry was rolled back';
