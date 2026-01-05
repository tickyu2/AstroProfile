-- ============================================================================
-- MIGRATION 009: WEEK 13 - INTIMACY & MEMORY EXPANSION
-- ============================================================================
-- ConversationStarter + AmnesiaBuster modules database schema.
--
-- Tables:
--   - conversation_threads: Track unresolved stories, gossip, funny moments
--   - conversation_initiatives: Track Luna's initiative effectiveness
--   - user_interests: Track topics user finds interesting
--   - curiosity_queue: Luna's questions to ask
--   - user_firsts: Track user's "first" memories
--   - era_technology: Era-specific tech references
--   - cultural_references: Cultural references by decade
--
-- Created: Week 13 - Intimacy & Memory Expansion
-- ============================================================================

-- ============================================================================
-- TABLE: conversation_threads
-- ============================================================================
-- Track unresolved conversation threads for follow-up

CREATE TABLE IF NOT EXISTS conversation_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  thread_type TEXT NOT NULL, -- story, gossip, funny_moment, deep_topic
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, followed_up, resolved

  -- Priority (1-10, higher = more important)
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),

  -- Timestamps
  first_mentioned TIMESTAMP DEFAULT NOW(),
  last_mentioned TIMESTAMP DEFAULT NOW(),
  mention_count INTEGER DEFAULT 1,

  -- Content
  summary TEXT,
  key_people TEXT[] DEFAULT '{}',
  emotional_valence NUMERIC DEFAULT 0, -- -1 to 1
  user_investment NUMERIC DEFAULT 0.5 CHECK (user_investment >= 0 AND user_investment <= 1),

  -- Follow-up tracking
  last_followup TIMESTAMP,
  followup_count INTEGER DEFAULT 0,
  needs_followup BOOLEAN DEFAULT true,
  followup_suggestions TEXT[] DEFAULT '{}',

  -- Luna's perspective
  luna_opinion TEXT,
  luna_curiosity NUMERIC DEFAULT 0.5 CHECK (luna_curiosity >= 0 AND luna_curiosity <= 1),

  UNIQUE(user_id, topic)
);

CREATE INDEX IF NOT EXISTS idx_threads_user ON conversation_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_threads_status ON conversation_threads(status);
CREATE INDEX IF NOT EXISTS idx_threads_priority ON conversation_threads(priority DESC);
CREATE INDEX IF NOT EXISTS idx_threads_followup ON conversation_threads(needs_followup);

-- ============================================================================
-- TABLE: conversation_initiatives
-- ============================================================================
-- Track Luna's conversation initiatives and their effectiveness

CREATE TABLE IF NOT EXISTS conversation_initiatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  initiated_at TIMESTAMP DEFAULT NOW(),

  initiative_type TEXT, -- thread_followup, curiosity_question, funny_recall, opinion_share
  thread_id UUID REFERENCES conversation_threads(id) ON DELETE SET NULL,

  -- What Luna said
  opening_message TEXT,

  -- User response
  user_engaged BOOLEAN DEFAULT false,
  engagement_score NUMERIC DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 1),
  response_length INTEGER DEFAULT 0,

  -- Effectiveness
  led_to_depth BOOLEAN DEFAULT false,
  intimacy_gained NUMERIC DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_initiatives_user ON conversation_initiatives(user_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_type ON conversation_initiatives(initiative_type);
CREATE INDEX IF NOT EXISTS idx_initiatives_engaged ON conversation_initiatives(user_engaged);

-- ============================================================================
-- TABLE: user_interests
-- ============================================================================
-- Track topics user finds interesting

CREATE TABLE IF NOT EXISTS user_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  interest_category TEXT, -- hobbies, people, events, ideas, humor
  specific_topic TEXT NOT NULL,

  interest_level NUMERIC DEFAULT 0.5 CHECK (interest_level >= 0 AND interest_level <= 1),
  discovered_from TEXT,

  last_discussed TIMESTAMP DEFAULT NOW(),
  discuss_count INTEGER DEFAULT 1,

  UNIQUE(user_id, specific_topic)
);

CREATE INDEX IF NOT EXISTS idx_interests_user ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_interests_level ON user_interests(interest_level DESC);

-- ============================================================================
-- TABLE: curiosity_queue
-- ============================================================================
-- Luna's curiosity queue - questions to ask user

CREATE TABLE IF NOT EXISTS curiosity_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  question TEXT NOT NULL,
  question_type TEXT, -- followup, new_topic, funny_recall, opinion_elicit
  priority INTEGER DEFAULT 5,

  context_thread_id UUID REFERENCES conversation_threads(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  asked_at TIMESTAMP,
  status TEXT DEFAULT 'pending', -- pending, asked, answered, skipped

  user_answer TEXT,
  answer_quality NUMERIC,

  UNIQUE(user_id, question)
);

CREATE INDEX IF NOT EXISTS idx_curiosity_user ON curiosity_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_curiosity_status ON curiosity_queue(status);
CREATE INDEX IF NOT EXISTS idx_curiosity_priority ON curiosity_queue(priority DESC);

-- ============================================================================
-- TABLE: user_firsts
-- ============================================================================
-- Track user's "first" memories (first crush, first kiss, etc.)

CREATE TABLE IF NOT EXISTS user_firsts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  first_type TEXT NOT NULL, -- first_crush, first_love, first_kiss, first_heartbreak, etc
  age_when_happened INTEGER,
  year_when_happened INTEGER,

  -- Details
  person_name TEXT,
  location TEXT,
  context TEXT,

  -- Emotional data
  emotion_at_time TEXT,
  emotion_now TEXT,

  -- Memory quality
  vividness NUMERIC DEFAULT 0.5 CHECK (vividness >= 0 AND vividness <= 1),
  significance NUMERIC DEFAULT 0.7 CHECK (significance >= 0 AND significance <= 1),

  -- Story
  story TEXT,
  shared_date TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, first_type)
);

CREATE INDEX IF NOT EXISTS idx_firsts_user ON user_firsts(user_id);
CREATE INDEX IF NOT EXISTS idx_firsts_type ON user_firsts(first_type);
CREATE INDEX IF NOT EXISTS idx_firsts_significance ON user_firsts(significance DESC);

-- ============================================================================
-- TABLE: era_technology
-- ============================================================================
-- Era-specific technology references for nostalgia prompts

CREATE TABLE IF NOT EXISTS era_technology (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decade TEXT NOT NULL UNIQUE,
  year_start INTEGER,
  year_end INTEGER,

  -- Technology
  primary_music_format TEXT,
  video_format TEXT,
  phone_type TEXT,
  gaming_console TEXT[] DEFAULT '{}',
  computer_type TEXT,

  -- Internet/Social
  internet_era TEXT,
  social_media TEXT[] DEFAULT '{}',
  messaging_platform TEXT[] DEFAULT '{}',

  -- Entertainment
  tv_watching TEXT,
  movie_rental TEXT,
  music_discovery TEXT,

  -- Cultural markers
  fashion_trend TEXT[] DEFAULT '{}',
  slang_words TEXT[] DEFAULT '{}',
  iconic_events TEXT[] DEFAULT '{}'
);

-- Insert era data
INSERT INTO era_technology (decade, year_start, year_end, primary_music_format, video_format, phone_type, gaming_console, internet_era, social_media, messaging_platform, music_discovery)
VALUES
  ('1980s', 1980, 1989, 'Cassette', 'VHS', 'Landline', ARRAY['Atari', 'NES'], 'None', ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radio/MTV'),
  ('1990s', 1990, 1999, 'CD', 'VHS/DVD', 'Landline/Pager', ARRAY['SNES', 'PlayStation', 'N64'], 'Dial-up', ARRAY['Forums'], ARRAY['AIM', 'ICQ', 'MSN'], 'Radio/MTV'),
  ('2000s', 2000, 2009, 'MP3/iPod', 'DVD', 'Flip phone/Blackberry', ARRAY['PS2', 'Xbox', 'GameCube', 'Wii'], 'Broadband', ARRAY['MySpace', 'Facebook'], ARRAY['AIM', 'MSN', 'BBM'], 'iPod/iTunes/LimeWire'),
  ('2010s', 2010, 2019, 'Streaming', 'Streaming', 'iPhone/Smartphone', ARRAY['PS4', 'Xbox One', 'Switch'], 'Mobile/4G', ARRAY['Facebook', 'Instagram', 'Snapchat'], ARRAY['WhatsApp', 'iMessage'], 'Spotify/YouTube'),
  ('2020s', 2020, 2029, 'Streaming', 'Streaming', 'Smartphone', ARRAY['PS5', 'Xbox Series X', 'Switch'], '5G', ARRAY['TikTok', 'Instagram', 'BeReal'], ARRAY['iMessage', 'WhatsApp', 'Discord'], 'TikTok/Spotify')
ON CONFLICT (decade) DO NOTHING;

-- ============================================================================
-- TABLE: cultural_references
-- ============================================================================
-- Cultural references by decade for nostalgia prompts

CREATE TABLE IF NOT EXISTS cultural_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decade TEXT NOT NULL,
  category TEXT NOT NULL, -- movie, tv_show, cartoon, song, artist, toy, game, tech
  title TEXT NOT NULL,
  year INTEGER,

  target_age_group TEXT, -- kids, teens, young_adults, adults
  genre TEXT,

  nostalgia_score NUMERIC DEFAULT 0.7 CHECK (nostalgia_score >= 0 AND nostalgia_score <= 1),
  emotional_impact TEXT,
  typical_memory_triggers TEXT[] DEFAULT '{}',

  UNIQUE(decade, category, title)
);

CREATE INDEX IF NOT EXISTS idx_cultural_decade ON cultural_references(decade);
CREATE INDEX IF NOT EXISTS idx_cultural_category ON cultural_references(category);
CREATE INDEX IF NOT EXISTS idx_cultural_nostalgia ON cultural_references(nostalgia_score DESC);

-- Insert sample cultural references
INSERT INTO cultural_references (decade, category, title, year, target_age_group, nostalgia_score, emotional_impact, typical_memory_triggers)
VALUES
  -- 1990s
  ('1990s', 'cartoon', 'Rugrats', 1991, 'kids', 0.9, 'innocence', ARRAY['Saturday mornings', 'After school']),
  ('1990s', 'cartoon', 'Pokemon', 1997, 'kids', 0.95, 'excitement', ARRAY['Trading cards', 'Game Boy']),
  ('1990s', 'movie', 'The Lion King', 1994, 'kids', 0.95, 'sadness/joy', ARRAY['Mufasas death', 'First theater']),
  ('1990s', 'tv_show', 'Friends', 1994, 'teens', 0.9, 'joy', ARRAY['Thursday nights', 'NYC dreams']),
  ('1990s', 'song', 'I Want It That Way', 1999, 'teens', 0.95, 'innocence', ARRAY['First slow dance', 'Boy bands']),

  -- 2000s
  ('2000s', 'cartoon', 'SpongeBob SquarePants', 2000, 'kids', 0.9, 'joy', ARRAY['After school', 'Quoting with friends']),
  ('2000s', 'movie', 'Mean Girls', 2004, 'teens', 0.95, 'joy', ARRAY['Pink Wednesdays', 'High school']),
  ('2000s', 'tv_show', 'The OC', 2003, 'teens', 0.85, 'excitement', ARRAY['Thursday nights', 'Teen drama']),
  ('2000s', 'tech', 'iPod', 2001, 'teens', 0.95, 'excitement', ARRAY['First iPod', 'Making playlists']),
  ('2000s', 'song', 'Since U Been Gone', 2004, 'teens', 0.9, 'empowerment', ARRAY['Breakup anthem', 'Singing loud']),

  -- 2010s
  ('2010s', 'movie', 'Frozen', 2013, 'kids', 0.9, 'joy', ARRAY['Let It Go obsession', 'Sister bonding']),
  ('2010s', 'tv_show', 'Stranger Things', 2016, 'teens', 0.85, 'excitement', ARRAY['Binge watching', '80s nostalgia']),
  ('2010s', 'song', 'Call Me Maybe', 2012, 'teens', 0.9, 'joy', ARRAY['Summer anthem', 'Phone numbers']),
  ('2010s', 'tech', 'Instagram', 2010, 'teens', 0.85, 'excitement', ARRAY['First post', 'Filters'])
ON CONFLICT (decade, category, title) DO NOTHING;

-- ============================================================================
-- FUNCTION: get_user_era
-- ============================================================================
-- Calculate user's formative era based on age

CREATE OR REPLACE FUNCTION get_user_era(user_age INTEGER)
RETURNS TABLE (
  birth_year INTEGER,
  teenage_start INTEGER,
  teenage_end INTEGER,
  primary_decade TEXT
) AS $$
DECLARE
  current_year INTEGER := EXTRACT(YEAR FROM NOW())::INTEGER;
BEGIN
  birth_year := current_year - user_age;
  teenage_start := birth_year + 13;
  teenage_end := birth_year + 19;
  primary_decade := (FLOOR(teenage_start / 10) * 10)::TEXT || 's';

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: get_nostalgia_prompts
-- ============================================================================
-- Get nostalgia prompts for a user based on their age

CREATE OR REPLACE FUNCTION get_nostalgia_prompts(
  p_user_age INTEGER,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  prompt_type TEXT,
  prompt_text TEXT,
  reference_title TEXT,
  decade TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_era AS (
    SELECT * FROM get_user_era(p_user_age)
  )
  SELECT
    cr.category AS prompt_type,
    'Do you remember ' || cr.title || '? ' ||
    CASE
      WHEN cr.category = 'cartoon' THEN 'What was your favorite episode?'
      WHEN cr.category = 'movie' THEN 'Do you have memories of watching it?'
      WHEN cr.category = 'tv_show' THEN 'Did you have a favorite character?'
      WHEN cr.category = 'song' THEN 'Where were you when you first heard it?'
      WHEN cr.category = 'tech' THEN 'Tell me about your experience with it!'
      ELSE 'What memories does it bring back?'
    END AS prompt_text,
    cr.title AS reference_title,
    cr.decade
  FROM cultural_references cr
  CROSS JOIN user_era ue
  WHERE cr.decade = ue.primary_decade
    OR cr.decade = ((FLOOR((ue.teenage_start - 5) / 10) * 10)::TEXT || 's')
  ORDER BY cr.nostalgia_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEW: user_conversation_overview
-- ============================================================================
-- Overview of user's conversation threads and intimacy level

CREATE OR REPLACE VIEW user_conversation_overview AS
SELECT
  ct.user_id,
  COUNT(*) AS total_threads,
  COUNT(*) FILTER (WHERE ct.status = 'open') AS open_threads,
  COUNT(*) FILTER (WHERE ct.needs_followup) AS needs_followup,
  AVG(ct.priority)::NUMERIC(3,1) AS avg_priority,
  MAX(ct.last_mentioned) AS last_activity,
  COALESCE(SUM(ci.intimacy_gained), 0)::NUMERIC(4,2) AS total_intimacy_gained
FROM conversation_threads ct
LEFT JOIN conversation_initiatives ci ON ci.thread_id = ct.id
GROUP BY ct.user_id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE conversation_threads IS 'Track unresolved stories, gossip, and funny moments for follow-up';
COMMENT ON TABLE conversation_initiatives IS 'Track Luna''s conversation initiatives and effectiveness';
COMMENT ON TABLE user_firsts IS 'Track user''s "first" memories (crush, kiss, love, etc.)';
COMMENT ON TABLE era_technology IS 'Era-specific technology for nostalgia prompts';
COMMENT ON TABLE cultural_references IS 'Cultural references by decade for nostalgia bonding';

COMMENT ON FUNCTION get_user_era IS 'Calculate user''s formative era based on current age';
COMMENT ON FUNCTION get_nostalgia_prompts IS 'Get era-specific nostalgia prompts for a user';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 009: Week 13 Intimacy & Memory Expansion created successfully';
  RAISE NOTICE 'Tables: conversation_threads, conversation_initiatives, user_interests';
  RAISE NOTICE 'Tables: curiosity_queue, user_firsts, era_technology, cultural_references';
  RAISE NOTICE 'Functions: get_user_era(), get_nostalgia_prompts()';
  RAISE NOTICE 'View: user_conversation_overview';
END $$;
