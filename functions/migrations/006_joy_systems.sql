-- ============================================================================
-- MIGRATION 006: JOY & CONNECTION SYSTEMS
-- ============================================================================
-- Creates tables for Week 10: Joy & Connection
-- Inside jokes, banter, metaphors, milestones, and personality observations
--
-- Tables:
--   - luna_inside_jokes: Personalized humor storage
--   - luna_metaphor_library: Shared metaphor collection
--   - luna_metaphor_user_effectiveness: User-specific metaphor tracking
--   - luna_relationship_milestones: Relationship celebration markers
--   - luna_personality_observations: Luna's personality per user
--   - luna_banter_effectiveness: Banter style tracking
--
-- Created: December 31, 2025
-- Week 10: Joy & Connection - Phase 3 Week 2
-- ============================================================================

-- ============================================================================
-- TABLE: luna_inside_jokes
-- ============================================================================
-- Stores personalized humor that deepens connection over time.
-- Jokes evolve from candidates to confirmed based on user reaction.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_inside_jokes (
  id SERIAL PRIMARY KEY,

  -- User identification
  user_id TEXT NOT NULL,

  -- Joke category
  category TEXT NOT NULL CHECK (category IN (
    'nickname',           -- Pet names for things ("brown motivation juice")
    'creative_phrase',    -- Original expressions user coins
    'memorable_moment',   -- Shared experiences that became funny
    'shared_reference',   -- Movies, songs, cultural references
    'recurring_character' -- Pets, people with notable names
  )),

  -- The joke content
  content TEXT NOT NULL,

  -- Original context where joke was detected
  original_context JSONB,

  -- Detection confidence (0-1)
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),

  -- Joke status
  status TEXT DEFAULT 'candidate' CHECK (status IN (
    'candidate',  -- Detected, not yet confirmed
    'confirmed',  -- User reacted positively when Luna used it
    'retired'     -- No longer getting good reactions
  )),

  -- Usage tracking
  use_count INTEGER DEFAULT 0,
  first_seen TIMESTAMP DEFAULT NOW(),
  last_used TIMESTAMP,

  -- User reaction tracking
  user_reaction TEXT CHECK (user_reaction IN ('positive', 'neutral', 'negative'))
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_inside_jokes_user_status
ON luna_inside_jokes(user_id, status);

CREATE INDEX IF NOT EXISTS idx_inside_jokes_category
ON luna_inside_jokes(user_id, category);

CREATE INDEX IF NOT EXISTS idx_inside_jokes_use_count
ON luna_inside_jokes(user_id, use_count DESC);

-- ============================================================================
-- TABLE: luna_metaphor_library
-- ============================================================================
-- Shared library of metaphors and analogies for explaining concepts.
-- These are pre-populated and tracked for effectiveness.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_metaphor_library (
  id SERIAL PRIMARY KEY,

  -- Metaphor categorization
  category TEXT NOT NULL CHECK (category IN (
    'emotion',       -- Emotional states (anxiety, depression, joy)
    'situation',     -- Life situations (work, relationships, adulting)
    'growth',        -- Personal development
    'explanation'    -- Making complex ideas simple
  )),

  subcategory TEXT,  -- More specific (anxiety, dating, career, etc.)

  -- The metaphor itself
  metaphor TEXT NOT NULL,

  -- Global effectiveness tracking
  effectiveness_avg NUMERIC DEFAULT 0 CHECK (effectiveness_avg >= 0 AND effectiveness_avg <= 1),
  use_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for category lookup
CREATE INDEX IF NOT EXISTS idx_metaphor_category
ON luna_metaphor_library(category, subcategory);

-- ============================================================================
-- TABLE: luna_metaphor_user_effectiveness
-- ============================================================================
-- Tracks which metaphors work best for specific users.
-- Enables personalized metaphor selection.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_metaphor_user_effectiveness (
  id SERIAL PRIMARY KEY,

  -- User identification
  user_id TEXT NOT NULL,

  -- Reference to metaphor
  metaphor_id INTEGER REFERENCES luna_metaphor_library(id),

  -- Effectiveness for this user (0-1)
  effectiveness NUMERIC CHECK (effectiveness >= 0 AND effectiveness <= 1),

  -- Timestamp
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Index for user-specific metaphor queries
CREATE INDEX IF NOT EXISTS idx_metaphor_user_effectiveness
ON luna_metaphor_user_effectiveness(user_id, metaphor_id);

-- ============================================================================
-- TABLE: luna_relationship_milestones
-- ============================================================================
-- Tracks and celebrates special moments in the relationship.
-- Creates shared history and recognizes growing bond.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_relationship_milestones (
  id SERIAL PRIMARY KEY,

  -- User identification
  user_id TEXT NOT NULL,

  -- Milestone type
  milestone_type TEXT NOT NULL,

  -- Additional milestone data
  milestone_data JSONB,

  -- Whether Luna has celebrated this milestone with user
  celebrated BOOLEAN DEFAULT FALSE,

  -- When milestone was achieved
  achieved_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for milestone queries
CREATE INDEX IF NOT EXISTS idx_milestones_user
ON luna_relationship_milestones(user_id, celebrated);

CREATE INDEX IF NOT EXISTS idx_milestones_type
ON luna_relationship_milestones(user_id, milestone_type);

-- ============================================================================
-- TABLE: luna_personality_observations
-- ============================================================================
-- Stores observations about how Luna's personality manifests with each user.
-- Allows personality customization and consistency tracking.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_personality_observations (
  id SERIAL PRIMARY KEY,

  -- User identification
  user_id TEXT NOT NULL,

  -- Observation type
  observation_type TEXT NOT NULL CHECK (observation_type IN (
    'quirk',       -- Personality quirk manifestation
    'preference',  -- Luna's stated preferences in context
    'opinion',     -- Luna's opinions shared with user
    'callback'     -- Reference to previous conversation
  )),

  -- The observation content
  content TEXT NOT NULL,

  -- Context where observation was made
  context JSONB,

  -- Strength of this trait with this user (0-1)
  strength NUMERIC DEFAULT 1.0 CHECK (strength >= 0 AND strength <= 1),

  -- Timestamp
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Index for user personality queries
CREATE INDEX IF NOT EXISTS idx_personality_user
ON luna_personality_observations(user_id, observation_type);

-- ============================================================================
-- TABLE: luna_banter_effectiveness
-- ============================================================================
-- Tracks effectiveness of different banter styles per user.
-- Enables personalized humor selection.
-- ============================================================================

CREATE TABLE IF NOT EXISTS luna_banter_effectiveness (
  id SERIAL PRIMARY KEY,

  -- User identification
  user_id TEXT NOT NULL,

  -- Banter style used
  banter_style TEXT NOT NULL CHECK (banter_style IN (
    'AFFECTIONATE_TEASING',
    'ABSURD_ESCALATION',
    'PLAYFUL_CONTRADICTION',
    'CLEVER_OBSERVATION',
    'COLLABORATIVE_BUILD'
  )),

  -- Effectiveness score (0-1)
  effectiveness NUMERIC CHECK (effectiveness >= 0 AND effectiveness <= 1),

  -- User's reaction
  user_reaction TEXT CHECK (user_reaction IN ('positive', 'neutral', 'negative')),

  -- Timestamp
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for banter queries
CREATE INDEX IF NOT EXISTS idx_banter_user_style
ON luna_banter_effectiveness(user_id, banter_style);

CREATE INDEX IF NOT EXISTS idx_banter_effectiveness
ON luna_banter_effectiveness(user_id, effectiveness DESC);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Active inside jokes per user (confirmed, sorted by popularity)
CREATE OR REPLACE VIEW luna_active_jokes AS
SELECT
  user_id,
  category,
  content,
  use_count,
  last_used,
  first_seen
FROM luna_inside_jokes
WHERE status = 'confirmed'
ORDER BY user_id, use_count DESC;

-- View: Joke statistics per user
CREATE OR REPLACE VIEW luna_joke_stats AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_jokes,
  COUNT(*) FILTER (WHERE status = 'candidate') as candidate_jokes,
  MAX(use_count) as max_use_count,
  AVG(use_count) FILTER (WHERE status = 'confirmed') as avg_use_count
FROM luna_inside_jokes
GROUP BY user_id;

-- View: Best performing banter styles per user
CREATE OR REPLACE VIEW luna_banter_stats AS
SELECT
  user_id,
  banter_style,
  COUNT(*) as count,
  AVG(effectiveness) as avg_effectiveness,
  COUNT(*) FILTER (WHERE user_reaction = 'positive') as positive_count
FROM luna_banter_effectiveness
GROUP BY user_id, banter_style
ORDER BY user_id, avg_effectiveness DESC;

-- View: Milestone summary per user
CREATE OR REPLACE VIEW luna_milestone_summary AS
SELECT
  user_id,
  COUNT(*) as total_milestones,
  COUNT(*) FILTER (WHERE celebrated = TRUE) as celebrated_count,
  COUNT(*) FILTER (WHERE celebrated = FALSE) as uncelebrated_count,
  MIN(achieved_at) as first_milestone,
  MAX(achieved_at) as latest_milestone
FROM luna_relationship_milestones
GROUP BY user_id;

-- View: Most effective metaphors globally
CREATE OR REPLACE VIEW luna_top_metaphors AS
SELECT
  id,
  category,
  subcategory,
  metaphor,
  effectiveness_avg,
  use_count
FROM luna_metaphor_library
WHERE use_count >= 5
ORDER BY effectiveness_avg DESC
LIMIT 50;

-- ============================================================================
-- SEED DATA: Initial metaphor library
-- ============================================================================

INSERT INTO luna_metaphor_library (category, subcategory, metaphor) VALUES
  -- Anxiety metaphors
  ('emotion', 'anxiety', 'Your mind is like a browser with 47 tabs open, all playing different music'),
  ('emotion', 'anxiety', 'Anxiety is your brain''s overprotective parent who thinks walking to the mailbox requires a hazmat suit'),
  ('emotion', 'anxiety', 'It''s like your thoughts are popcorn and someone turned the heat up too high'),

  -- Depression metaphors
  ('emotion', 'depression', 'Depression is like trying to run through water - everything takes more effort than it should'),
  ('emotion', 'depression', 'Your brain''s happiness factory is on strike. Not your fault. The workers will be back.'),
  ('emotion', 'depression', 'It''s like someone turned down the color saturation on life'),

  -- Overwhelm metaphors
  ('emotion', 'overwhelm', 'You''re juggling flaming chainsaws while people keep throwing more chainsaws and asking why you''re stressed'),
  ('emotion', 'overwhelm', 'Your to-do list is like a hydra - finish one task, two more appear'),
  ('emotion', 'overwhelm', 'You''re trying to drink from a fire hose of responsibilities'),

  -- Relationship metaphors
  ('situation', 'dating', 'Dating is like fishing. Except the fish can lie, ghost you, and somehow owe you money'),
  ('situation', 'ex', 'Your ex texting you is like a spam email - block and move on, no matter how ''great'' the offer sounds'),
  ('situation', 'communication', 'You two communicate like you''re playing charades but in different languages'),

  -- Work metaphors
  ('situation', 'job_hunting', 'Job hunting is like dating but somehow more rejection and less free dinners'),
  ('situation', 'boss', 'Your boss''s expectations are like GPS directions to a place that doesn''t exist'),
  ('situation', 'networking', 'Networking is just making friends but with ulterior motives and worse snacks'),

  -- Growth metaphors
  ('growth', 'therapy', 'Therapy is like debugging yourself. Turns out, most of your problems are features, not bugs'),
  ('growth', 'adulting', 'Growing up is realizing that adults are just kids with bills and anxiety'),
  ('growth', 'self_improvement', 'Self-improvement is great until you realize your old self was funnier'),

  -- Explanation metaphors
  ('explanation', 'mixed_feelings', 'Your emotions are like a blender where someone threw in feelings at random and hit ''frappe'''),
  ('explanation', 'patterns', 'Your brain found a solution that worked once in 2008 and now plays it on repeat like it''s your favorite song'),
  ('explanation', 'progress', 'Progress is like downloading a file - it jumps from 0% to 99% then sits there forever, but you ARE downloading')

ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE luna_inside_jokes IS
  'Stores personalized humor that deepens connection over time';

COMMENT ON TABLE luna_metaphor_library IS
  'Shared library of metaphors/analogies for explaining concepts delightfully';

COMMENT ON TABLE luna_metaphor_user_effectiveness IS
  'Tracks which metaphors resonate most with each user';

COMMENT ON TABLE luna_relationship_milestones IS
  'Tracks and celebrates special moments in the relationship';

COMMENT ON TABLE luna_personality_observations IS
  'Records how Luna''s personality manifests with each user';

COMMENT ON TABLE luna_banter_effectiveness IS
  'Tracks effectiveness of different banter styles per user';

COMMENT ON COLUMN luna_inside_jokes.status IS
  'candidate: detected, confirmed: user liked it, retired: stopped working';

COMMENT ON COLUMN luna_inside_jokes.category IS
  'nickname: pet names, creative_phrase: original expressions, memorable_moment: shared experiences';

-- ============================================================================
-- HELPFUL QUERIES
-- ============================================================================

-- Get all active inside jokes for a user:
--
-- SELECT * FROM luna_active_jokes
-- WHERE user_id = 'user123';

-- Get user's best performing banter style:
--
-- SELECT banter_style, avg_effectiveness
-- FROM luna_banter_stats
-- WHERE user_id = 'user123'
-- ORDER BY avg_effectiveness DESC
-- LIMIT 1;

-- Get uncelebrated milestones:
--
-- SELECT * FROM luna_relationship_milestones
-- WHERE user_id = 'user123' AND celebrated = FALSE;

-- Get metaphors for anxiety:
--
-- SELECT metaphor FROM luna_metaphor_library
-- WHERE category = 'emotion' AND subcategory = 'anxiety'
-- ORDER BY effectiveness_avg DESC;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 006: Joy & Connection Systems created successfully';
  RAISE NOTICE 'Tables: luna_inside_jokes, luna_metaphor_library, luna_metaphor_user_effectiveness';
  RAISE NOTICE 'Tables: luna_relationship_milestones, luna_personality_observations, luna_banter_effectiveness';
  RAISE NOTICE 'Views: luna_active_jokes, luna_joke_stats, luna_banter_stats, luna_milestone_summary, luna_top_metaphors';
  RAISE NOTICE 'Seed data: 21 metaphors inserted into luna_metaphor_library';
END $$;
