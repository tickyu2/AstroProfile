-- Universal matchmaking tables

CREATE TABLE IF NOT EXISTS match_runs (
  id BIGSERIAL PRIMARY KEY,
  profile_id TEXT NOT NULL,
  run_type TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error TEXT
);

CREATE TABLE IF NOT EXISTS match_candidates (
  profile_id TEXT NOT NULL,
  candidate_profile_id TEXT NOT NULL,
  score NUMERIC(6,4) NOT NULL,
  score_breakdown JSONB NOT NULL,
  reasons JSONB NOT NULL,
  mutual_eligible BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (profile_id, candidate_profile_id)
);
CREATE INDEX IF NOT EXISTS idx_match_candidates_score ON match_candidates(profile_id, score DESC);

CREATE TABLE IF NOT EXISTS match_notifications (
  id BIGSERIAL PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  candidate_profile_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  next_attempt_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_match_notifications_pending ON match_notifications(status, next_attempt_at);
