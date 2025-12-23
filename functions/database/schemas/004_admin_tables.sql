-- ═══════════════════════════════════════════════════════════════════════════════
-- ADMIN TABLES SCHEMA
-- Tables for admin dashboard, audit logging, and job tracking
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Created: December 22, 2025
-- Mission: JOIE DE VIVRE
-- ═══════════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════════
-- AUDIT LOG
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Actor info
  actor_uid TEXT NOT NULL,
  actor_email TEXT NOT NULL,

  -- Action info
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,

  -- State changes
  before_state JSONB,
  after_state JSONB,

  -- Context
  reason TEXT,
  request_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_actor ON admin_audit_log(actor_uid);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_target ON admin_audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_request ON admin_audit_log(request_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- JOB LOG
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS admin_job_log (
  id SERIAL PRIMARY KEY,

  -- Job info
  type TEXT NOT NULL,
  triggered_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),

  -- Results
  result JSONB,
  error TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for job log
CREATE INDEX IF NOT EXISTS idx_job_type ON admin_job_log(type);
CREATE INDEX IF NOT EXISTS idx_job_status ON admin_job_log(status);
CREATE INDEX IF NOT EXISTS idx_job_started ON admin_job_log(started_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TIMELINE EVENT LINKS (for merge candidates)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS timeline_event_links (
  id SERIAL PRIMARY KEY,

  -- Link info
  from_event_id UUID NOT NULL REFERENCES timeline_event(id) ON DELETE CASCADE,
  to_event_id UUID NOT NULL REFERENCES timeline_event(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('duplicate_of', 'related_to', 'follows', 'precedes')),

  -- Confidence and status
  confidence REAL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'merged', 'split', 'ignored')),

  -- Resolution
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(from_event_id, to_event_id)
);

-- Indexes for event links
CREATE INDEX IF NOT EXISTS idx_links_status ON timeline_event_links(status);
CREATE INDEX IF NOT EXISTS idx_links_confidence ON timeline_event_links(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_links_from ON timeline_event_links(from_event_id);
CREATE INDEX IF NOT EXISTS idx_links_to ON timeline_event_links(to_event_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ADMIN VIEWS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Full event view with person info
CREATE OR REPLACE VIEW admin_timeline_event_full AS
SELECT
  e.*,
  p.name as person_name,
  p.user_id,
  p.profile_id,
  p.birth_year as person_birth_year,
  p.is_main_subject
FROM timeline_event e
JOIN timeline_person p ON e.person_id = p.id;

-- Pending merges with event details
CREATE OR REPLACE VIEW admin_pending_merges AS
SELECT
  m.id as candidate_id,
  m.confidence,
  m.status,
  m.created_at,
  e1.id as from_id,
  e1.title as from_title,
  e1.description as from_description,
  e1.event_year as from_year,
  e2.id as to_id,
  e2.title as to_title,
  e2.description as to_description,
  e2.event_year as to_year,
  p.name as person_name,
  p.user_id
FROM timeline_event_links m
JOIN timeline_event e1 ON m.from_event_id = e1.id
JOIN timeline_event e2 ON m.to_event_id = e2.id
JOIN timeline_person p ON e1.person_id = p.id
WHERE m.link_type = 'duplicate_of' AND m.status = 'pending'
ORDER BY m.confidence DESC, m.created_at ASC;

-- Open questions view
CREATE OR REPLACE VIEW admin_open_questions AS
SELECT
  q.*,
  e.title as event_title,
  e.event_year,
  e.event_type,
  p.name as person_name,
  p.user_id
FROM timeline_event_questions q
JOIN timeline_event e ON q.event_id = e.id
JOIN timeline_person p ON q.person_id = p.id
WHERE q.answered = false AND q.skipped = false
ORDER BY q.priority DESC, q.created_at ASC;

-- User drift summary
CREATE OR REPLACE VIEW admin_user_drift_summary AS
SELECT
  user_id,
  profile_id,
  warmth_delta,
  advice_bias_delta,
  pace_delta,
  responsiveness_delta,
  backchannel_delta,
  mirroring_delta,
  signal_count,
  total_interactions,
  engagement_score,
  relationship_sentiment,
  comfort_level,
  is_enabled,
  last_drift_applied_at,
  updated_at
FROM user_personality_drift
ORDER BY total_interactions DESC;

-- Drift analytics summary
CREATE OR REPLACE VIEW admin_drift_analytics AS
SELECT
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_enabled = true) as active_users,
  AVG(warmth_delta) as avg_warmth_delta,
  AVG(advice_bias_delta) as avg_advice_delta,
  AVG(pace_delta) as avg_pace_delta,
  AVG(engagement_score) as avg_engagement,
  AVG(relationship_sentiment) as avg_sentiment,
  SUM(total_interactions) as total_interactions,
  SUM(signal_count) as pending_signals
FROM user_personality_drift;

-- Recent audit activity
CREATE OR REPLACE VIEW admin_recent_audit AS
SELECT
  id,
  actor_email,
  action,
  target_type,
  target_id,
  reason,
  created_at
FROM admin_audit_log
ORDER BY created_at DESC
LIMIT 100;

-- ═══════════════════════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Function to get KPIs for dashboard
CREATE OR REPLACE FUNCTION get_admin_kpis()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'activeUsers', (SELECT COUNT(*) FROM user_personality_drift WHERE updated_at > NOW() - INTERVAL '7 days'),
    'pendingMerges', (SELECT COUNT(*) FROM timeline_event_links WHERE status = 'pending'),
    'openQuestions', (SELECT COUNT(*) FROM timeline_event_questions WHERE answered = false AND skipped = false),
    'totalEvents', (SELECT COUNT(*) FROM timeline_event),
    'driftAppliedToday', (SELECT COUNT(*) FROM drift_history WHERE recorded_at > NOW() - INTERVAL '1 day'),
    'jobsRunToday', (SELECT COUNT(*) FROM admin_job_log WHERE started_at > NOW() - INTERVAL '1 day'),
    'globalDriftEnabled', (SELECT is_enabled FROM global_drift_config WHERE id = 1)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(p_user_id TEXT, p_profile_id TEXT DEFAULT 'default')
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'drift', (SELECT row_to_json(d) FROM user_personality_drift d WHERE user_id = p_user_id AND profile_id = p_profile_id),
    'eventCount', (SELECT COUNT(*) FROM timeline_event e JOIN timeline_person p ON e.person_id = p.id WHERE p.user_id = p_user_id AND p.profile_id = p_profile_id),
    'questionCount', (SELECT COUNT(*) FROM timeline_event_questions q JOIN timeline_person p ON q.person_id = p.id WHERE p.user_id = p_user_id AND p.profile_id = p_profile_id AND q.answered = false),
    'recentSignals', (SELECT COUNT(*) FROM drift_signal_log WHERE user_id = p_user_id AND profile_id = p_profile_id AND recorded_at > NOW() - INTERVAL '24 hours')
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
