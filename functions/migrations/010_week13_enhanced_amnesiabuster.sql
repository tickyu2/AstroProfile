-- ============================================================================
-- WEEK 13 ENHANCED: BIOGRAPHY BUILDER & PREFERENCE ENGINE
-- The Complete Life Documentation & Conversational Intelligence System
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PREFERENCE DISCOVERY SYSTEM
-- Store ALL user preferences discovered naturally from conversation
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- What preference
  category TEXT NOT NULL, -- food, drink, music, movies, activities, people, places
  subcategory TEXT, -- beverages, fast_food, genres, etc
  item TEXT NOT NULL, -- "Coke", "Pizza Hut", "Rock music"

  -- Preference strength
  preference_type TEXT, -- loves, likes, dislikes, hates, neutral
  confidence NUMERIC DEFAULT 0.5, -- 0-1, how sure we are

  -- Discovery context
  discovered_from TEXT, -- The conversation where we learned this
  discovery_method TEXT, -- direct_statement, indirect_mention, rejection, enthusiasm
  first_discovered TIMESTAMP DEFAULT NOW(),

  -- Usage tracking
  last_mentioned TIMESTAMP,
  mention_count INTEGER DEFAULT 1,
  used_in_conversation BOOLEAN DEFAULT false, -- Have we used this as can opener?
  last_used_as_opener TIMESTAMP,

  -- Related data
  context_tags TEXT[], -- ["after workout", "with friends", "comfort food"]
  associated_people TEXT[], -- Who they do this with
  associated_places TEXT[], -- Where they do this
  associated_emotions TEXT[], -- How they feel about it

  -- Biography relevance
  biography_worthy BOOLEAN DEFAULT false, -- Important enough for life story?
  significance_score NUMERIC DEFAULT 0.5, -- 0-1, how important to user

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, category, item)
);

CREATE INDEX IF NOT EXISTS idx_user_prefs_user ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_prefs_category ON user_preferences(category);
CREATE INDEX IF NOT EXISTS idx_user_prefs_confidence ON user_preferences(confidence);
CREATE INDEX IF NOT EXISTS idx_user_prefs_biography ON user_preferences(biography_worthy);
CREATE INDEX IF NOT EXISTS idx_user_prefs_type ON user_preferences(preference_type);

-- ============================================================================
-- PREFERENCE OPENERS TRACKING
-- Track preference-based conversation openers and their effectiveness
-- ============================================================================

CREATE TABLE IF NOT EXISTS preference_openers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  preference_id UUID REFERENCES user_preferences(id) ON DELETE CASCADE,

  -- The opener
  opener_text TEXT NOT NULL, -- "Have you had any Coke lately?"
  opener_type TEXT, -- direct_question, casual_mention, comparison, story_trigger

  -- When used
  used_at TIMESTAMP DEFAULT NOW(),

  -- How effective
  user_engaged BOOLEAN, -- Did user respond with story?
  conversation_depth INTEGER, -- How many messages did it generate?
  new_discoveries INTEGER DEFAULT 0, -- How many new things learned?

  -- What was discovered
  discovered_items TEXT[] -- New preferences/facts learned from this opener
);

CREATE INDEX IF NOT EXISTS idx_pref_openers_user ON preference_openers(user_id);
CREATE INDEX IF NOT EXISTS idx_pref_openers_pref ON preference_openers(preference_id);
CREATE INDEX IF NOT EXISTS idx_pref_openers_engaged ON preference_openers(user_engaged);

-- ============================================================================
-- BIOGRAPHY / LIFE STORY BUILDING
-- Document user's life story organized by life periods
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_biography (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Life period
  period_type TEXT NOT NULL, -- childhood, teenage, young_adult, adult, current
  age_range TEXT, -- "5-12", "13-19", "20-29", etc
  years_range TEXT, -- "1995-2002", etc

  -- Chapter title (generated)
  chapter_title TEXT, -- "Growing Up in Chicago", "My College Years", etc

  -- Content
  summary TEXT, -- High-level summary of this period
  key_events TEXT[], -- Major events in this period
  important_people TEXT[], -- People who mattered in this period

  -- Preferences during this time
  favorite_things JSONB, -- {music: ["..."], food: ["..."], activities: ["..."]}

  -- Emotional significance
  emotional_tone TEXT, -- happy, challenging, transformative, etc
  formative_experiences TEXT[], -- What shaped them during this time

  -- Documentation
  stories_count INTEGER DEFAULT 0, -- How many stories from this period
  completeness_score NUMERIC DEFAULT 0.0, -- 0-1, how complete is this chapter

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, period_type)
);

CREATE INDEX IF NOT EXISTS idx_user_bio_user ON user_biography(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bio_period ON user_biography(period_type);
CREATE INDEX IF NOT EXISTS idx_user_bio_completeness ON user_biography(completeness_score);

-- ============================================================================
-- LIFE STORIES
-- Individual memories and stories that make up the biography
-- ============================================================================

CREATE TABLE IF NOT EXISTS life_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  biography_id UUID REFERENCES user_biography(id) ON DELETE SET NULL,

  -- The story
  title TEXT, -- "The Summer I Learned to Drive"
  story_text TEXT NOT NULL, -- The full story in user's words

  -- Context
  age_when_happened INTEGER,
  year_when_happened INTEGER,
  location TEXT,
  season TEXT, -- spring, summer, fall, winter

  -- Who was there
  people_involved TEXT[],

  -- Emotional data
  emotions TEXT[], -- What they felt
  significance TEXT, -- Why this matters

  -- Preferences revealed in story
  preferences_revealed TEXT[], -- What we learned about their likes/dislikes

  -- Categorization
  story_type TEXT, -- funny, sad, formative, achievement, love, loss, adventure
  tags TEXT[],

  -- Legacy
  legacy_worthy BOOLEAN DEFAULT false, -- Share with future generations?
  lessons_learned TEXT, -- What did this teach them?

  shared_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_life_stories_user ON life_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_life_stories_bio ON life_stories(biography_id);
CREATE INDEX IF NOT EXISTS idx_life_stories_type ON life_stories(story_type);
CREATE INDEX IF NOT EXISTS idx_life_stories_legacy ON life_stories(legacy_worthy);
CREATE INDEX IF NOT EXISTS idx_life_stories_age ON life_stories(age_when_happened);

-- ============================================================================
-- USER LEGACY
-- Complete life documentation for future generations
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_legacy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,

  -- Legacy content
  full_biography TEXT, -- Complete life story (generated from all stories)
  key_lessons TEXT[], -- Wisdom to pass down
  important_values TEXT[], -- What matters to them

  -- For future generations
  letter_to_children TEXT, -- Personal message
  letter_to_grandchildren TEXT,

  -- Multimedia
  favorite_quotes TEXT[],
  life_philosophy TEXT,

  -- Metadata
  generated_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  completeness NUMERIC DEFAULT 0.0, -- 0-1, how complete

  -- Version tracking
  version INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_user_legacy_user ON user_legacy(user_id);
CREATE INDEX IF NOT EXISTS idx_user_legacy_completeness ON user_legacy(completeness);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get user preferences by category
CREATE OR REPLACE FUNCTION get_user_preferences(
  p_user_id TEXT,
  p_category TEXT DEFAULT NULL,
  p_min_confidence NUMERIC DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  category TEXT,
  item TEXT,
  preference_type TEXT,
  confidence NUMERIC,
  mention_count INTEGER,
  context_tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    up.id,
    up.category,
    up.item,
    up.preference_type,
    up.confidence,
    up.mention_count,
    up.context_tags
  FROM user_preferences up
  WHERE up.user_id = p_user_id
    AND up.confidence >= p_min_confidence
    AND (p_category IS NULL OR up.category = p_category)
  ORDER BY up.confidence DESC, up.mention_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Get preferences suitable for conversation openers
CREATE OR REPLACE FUNCTION get_opener_candidates(
  p_user_id TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  category TEXT,
  item TEXT,
  preference_type TEXT,
  confidence NUMERIC,
  last_used_as_opener TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    up.id,
    up.category,
    up.item,
    up.preference_type,
    up.confidence,
    up.last_used_as_opener
  FROM user_preferences up
  WHERE up.user_id = p_user_id
    AND up.confidence >= 0.7
    AND up.preference_type IN ('loves', 'likes')
  ORDER BY up.last_used_as_opener NULLS FIRST, up.confidence DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get biography completeness summary
CREATE OR REPLACE FUNCTION get_biography_summary(p_user_id TEXT)
RETURNS TABLE (
  total_chapters INTEGER,
  total_stories INTEGER,
  avg_completeness NUMERIC,
  legacy_stories INTEGER,
  has_legacy_document BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM user_biography WHERE user_id = p_user_id),
    (SELECT COUNT(*)::INTEGER FROM life_stories WHERE user_id = p_user_id),
    (SELECT COALESCE(AVG(completeness_score), 0.0) FROM user_biography WHERE user_id = p_user_id),
    (SELECT COUNT(*)::INTEGER FROM life_stories WHERE user_id = p_user_id AND legacy_worthy = true),
    (SELECT EXISTS(SELECT 1 FROM user_legacy WHERE user_id = p_user_id));
END;
$$ LANGUAGE plpgsql;

-- Update preference on new mention
CREATE OR REPLACE FUNCTION update_preference_mention(
  p_preference_id UUID,
  p_new_context TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_preferences
  SET
    last_mentioned = NOW(),
    mention_count = mention_count + 1,
    confidence = LEAST(confidence + 0.05, 1.0),
    context_tags = CASE
      WHEN p_new_context IS NOT NULL
      THEN array_append(context_tags, p_new_context)
      ELSE context_tags
    END,
    updated_at = NOW()
  WHERE id = p_preference_id;
END;
$$ LANGUAGE plpgsql;

-- Mark preference as used for opener
CREATE OR REPLACE FUNCTION mark_opener_used(p_preference_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE user_preferences
  SET
    last_used_as_opener = NOW(),
    used_in_conversation = true,
    updated_at = NOW()
  WHERE id = p_preference_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_preferences IS 'User preferences discovered naturally through conversation';
COMMENT ON TABLE preference_openers IS 'Tracking effectiveness of preference-based conversation starters';
COMMENT ON TABLE user_biography IS 'Life story organized by periods (childhood, teenage, etc)';
COMMENT ON TABLE life_stories IS 'Individual memories and stories shared by user';
COMMENT ON TABLE user_legacy IS 'Complete life documentation for future generations';

-- ============================================================================
-- Week 13 Enhanced Migration Complete
-- ============================================================================
