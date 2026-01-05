-- ============================================================================
-- GENESIS Luna - Week 13 Part 2 Migration
-- MatingCall, FlirtationVoice, EnhancedGossip, InteractionSummaries
-- ============================================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- MATINGCALL MODULE TABLES
-- Sexual/Romantic Preference Learning with Privacy & Consent
-- ============================================================================

-- Sexual/Romantic Preference Discovery
CREATE TABLE IF NOT EXISTS sexual_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- What preference
  category TEXT NOT NULL,
  subcategory TEXT,
  value TEXT NOT NULL,

  -- Confidence & learning
  confidence NUMERIC DEFAULT 0.5,
  discovery_method TEXT,
  learned_from TEXT,
  first_discovered TIMESTAMP DEFAULT NOW(),

  -- Validation
  confirmed BOOLEAN DEFAULT false,
  confirmation_count INTEGER DEFAULT 0,
  last_confirmed TIMESTAMP,

  -- Usage
  last_mentioned TIMESTAMP,
  mention_count INTEGER DEFAULT 1,
  positive_reactions INTEGER DEFAULT 0,
  negative_reactions INTEGER DEFAULT 0,

  -- Privacy
  encrypted BOOLEAN DEFAULT true,
  user_visible BOOLEAN DEFAULT true,

  UNIQUE(user_id, category, value)
);

CREATE INDEX IF NOT EXISTS idx_sexual_prefs_user ON sexual_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_sexual_prefs_category ON sexual_preferences(category);
CREATE INDEX IF NOT EXISTS idx_sexual_prefs_confidence ON sexual_preferences(confidence);

-- Boundaries & Consent
CREATE TABLE IF NOT EXISTS intimacy_boundaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Boundary type
  boundary_type TEXT NOT NULL,
  topic TEXT NOT NULL,

  -- Context
  discovered_from TEXT,
  explicit_statement BOOLEAN DEFAULT false,

  -- Enforcement
  enforce_strictly BOOLEAN DEFAULT true,
  last_violated TIMESTAMP,
  violation_count INTEGER DEFAULT 0,

  -- User control
  user_set BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, topic)
);

CREATE INDEX IF NOT EXISTS idx_intimacy_boundaries_user ON intimacy_boundaries(user_id);

-- Relationship Progression (Intimacy Levels)
CREATE TABLE IF NOT EXISTS intimacy_progression (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Current state
  intimacy_level INTEGER DEFAULT 0,
  relationship_level INTEGER DEFAULT 0,

  -- Milestones
  first_flirtation TIMESTAMP,
  first_romantic_conversation TIMESTAMP,
  first_intimate_conversation TIMESTAMP,
  consent_given_for_intimacy TIMESTAMP,

  -- Progression tracking
  flirtation_count INTEGER DEFAULT 0,
  romantic_conversations INTEGER DEFAULT 0,
  intimate_conversations INTEGER DEFAULT 0,

  -- User control
  intimacy_enabled BOOLEAN DEFAULT false,
  current_comfort_level TEXT DEFAULT 'platonic',

  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Intimacy Contexts
CREATE TABLE IF NOT EXISTS intimacy_contexts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Context
  context_type TEXT,
  time_of_day TEXT[],
  mood_states TEXT[],

  -- Environment
  typical_location TEXT,
  alone BOOLEAN DEFAULT true,

  -- Preferences
  initiation_preference TEXT,
  escalation_pace TEXT,

  -- Tracking
  successful_contexts INTEGER DEFAULT 0,
  uncomfortable_contexts INTEGER DEFAULT 0,

  updated_at TIMESTAMP DEFAULT NOW()
);

-- Intimacy Response Quality
CREATE TABLE IF NOT EXISTS intimacy_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- What Luna said/did
  luna_approach TEXT,
  luna_message TEXT,
  context TEXT,

  -- User reaction
  user_response TEXT,
  user_reaction TEXT,
  engagement_score NUMERIC,

  -- Learning
  approach_effectiveness NUMERIC DEFAULT 0.5,
  repeat_approach BOOLEAN DEFAULT true,

  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intimacy_responses_user ON intimacy_responses(user_id);

-- Privacy & Consent Logs
CREATE TABLE IF NOT EXISTS intimacy_consent_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Consent event
  event_type TEXT,
  details TEXT,

  -- User action
  explicit_action BOOLEAN DEFAULT true,

  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intimacy_consent_user ON intimacy_consent_log(user_id);

-- ============================================================================
-- FLIRTATION VOICE MODULE TABLES
-- Prosody Control: Pitch, Pace, Breathiness, Non-Verbal Sounds
-- ============================================================================

-- User Voice Preferences
CREATE TABLE IF NOT EXISTS flirtation_voice_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Flirtation settings
  flirtation_enabled BOOLEAN DEFAULT false,
  flirtation_level INTEGER DEFAULT 0,

  -- Voice style preferences
  preferred_voice_style TEXT DEFAULT 'balanced',
  pitch_preference TEXT DEFAULT 'natural',
  pace_preference TEXT DEFAULT 'natural',

  -- Prosody levels (0-1)
  breathiness_level NUMERIC DEFAULT 0.3,
  warmth_level NUMERIC DEFAULT 0.7,
  expressiveness NUMERIC DEFAULT 0.8,

  -- Non-verbal sounds
  use_giggles BOOLEAN DEFAULT true,
  use_sighs BOOLEAN DEFAULT false,
  use_mmm BOOLEAN DEFAULT false,
  use_breaths BOOLEAN DEFAULT true,
  use_laughs BOOLEAN DEFAULT true,

  -- Context preferences
  voice_context JSONB DEFAULT '{}',

  -- Learning
  learned_from_reactions BOOLEAN DEFAULT true,

  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_flirtation_voice_user ON flirtation_voice_profiles(user_id);

-- Voice Performance Tracking
CREATE TABLE IF NOT EXISTS voice_performances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- What Luna said (voice)
  message_text TEXT,
  voice_style TEXT,

  -- Prosody parameters used
  pitch_adjustment NUMERIC,
  pace_adjustment NUMERIC,
  breathiness NUMERIC,
  warmth NUMERIC,

  -- Non-verbal sounds included
  non_verbals TEXT[],

  -- User reaction
  user_response TEXT,
  user_reaction TEXT,
  engagement_score NUMERIC,

  -- Learning
  repeat_style BOOLEAN,

  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_performances_user ON voice_performances(user_id);

-- ============================================================================
-- ENHANCED GOSSIP MODULE TABLES
-- Social Network Tracking & Integration
-- ============================================================================

-- User's Social Network
CREATE TABLE IF NOT EXISTS user_social_network (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Person details
  person_name TEXT NOT NULL,
  relationship_type TEXT,
  relationship_closeness INTEGER DEFAULT 5,

  -- Discovery
  first_mentioned TIMESTAMP DEFAULT NOW(),
  last_mentioned TIMESTAMP DEFAULT NOW(),
  mention_count INTEGER DEFAULT 1,

  -- Sentiment
  user_sentiment_toward_person NUMERIC DEFAULT 0.5,
  luna_opinion_of_person TEXT,

  -- Person characteristics
  personality_traits TEXT[],
  interests TEXT[],
  problems TEXT[],
  strengths TEXT[],

  -- Contact frequency
  user_sees_person TEXT,
  last_user_interaction_with_person TEXT,

  -- Tracking
  active BOOLEAN DEFAULT true,

  UNIQUE(user_id, person_name)
);

CREATE INDEX IF NOT EXISTS idx_social_network_user ON user_social_network(user_id);
CREATE INDEX IF NOT EXISTS idx_social_network_type ON user_social_network(relationship_type);
CREATE INDEX IF NOT EXISTS idx_social_network_closeness ON user_social_network(relationship_closeness);

-- Social Events & Drama
CREATE TABLE IF NOT EXISTS social_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Event details
  event_type TEXT,
  title TEXT,
  summary TEXT,

  -- People involved
  people_involved TEXT[],

  -- User's perspective
  user_emotion_about_event TEXT,
  user_involvement TEXT,

  -- Status
  event_status TEXT DEFAULT 'ongoing',
  last_update TEXT,

  -- Tracking
  first_mentioned TIMESTAMP DEFAULT NOW(),
  last_mentioned TIMESTAMP DEFAULT NOW(),
  mention_count INTEGER DEFAULT 1,

  -- Luna's perspective
  luna_opinion TEXT,
  luna_advice_given TEXT,

  -- Follow-up
  needs_followup BOOLEAN DEFAULT true,
  followup_priority INTEGER DEFAULT 5,
  last_followup TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_social_events_user ON social_events(user_id);
CREATE INDEX IF NOT EXISTS idx_social_events_status ON social_events(event_status);
CREATE INDEX IF NOT EXISTS idx_social_events_followup ON social_events(needs_followup);

-- Relationship Dynamics (between people in network)
CREATE TABLE IF NOT EXISTS relationship_dynamics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- The two people
  person_a TEXT NOT NULL,
  person_b TEXT NOT NULL,

  -- Relationship type
  dynamic_type TEXT,

  -- Assessment
  compatibility TEXT,
  luna_assessment TEXT,

  -- History
  relationship_status TEXT,
  status_changes TEXT[],

  -- Tracking
  first_mentioned TIMESTAMP DEFAULT NOW(),
  last_mentioned TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, person_a, person_b)
);

CREATE INDEX IF NOT EXISTS idx_relationship_dynamics_user ON relationship_dynamics(user_id);

-- Gossip Topics
CREATE TABLE IF NOT EXISTS gossip_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Topic
  topic TEXT NOT NULL,
  category TEXT,

  -- People involved
  main_person TEXT,
  related_people TEXT[],

  -- Spiciness level
  gossip_level INTEGER DEFAULT 5,
  urgency INTEGER DEFAULT 5,

  -- User engagement
  user_interest_level NUMERIC DEFAULT 0.5,

  -- Status
  topic_status TEXT DEFAULT 'active',

  -- Tracking
  first_mentioned TIMESTAMP DEFAULT NOW(),
  last_mentioned TIMESTAMP DEFAULT NOW(),
  update_count INTEGER DEFAULT 1,

  -- Luna's engagement
  luna_curiosity INTEGER DEFAULT 5,
  luna_investment TEXT
);

CREATE INDEX IF NOT EXISTS idx_gossip_topics_user ON gossip_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_gossip_topics_status ON gossip_topics(topic_status);

-- ============================================================================
-- INTERACTION SUMMARIES MODULE TABLES
-- Scrollable Timeline + Session Summarization
-- ============================================================================

-- Session Summaries
CREATE TABLE IF NOT EXISTS session_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,

  -- When
  session_date DATE NOT NULL,
  session_start TIMESTAMP NOT NULL,
  session_end TIMESTAMP NOT NULL,
  duration_minutes INTEGER,

  -- Summary
  title TEXT,
  summary TEXT NOT NULL,
  detailed_summary TEXT,

  -- Content
  key_topics TEXT[],
  people_mentioned TEXT[],
  emotions TEXT[],
  highlights TEXT[],

  -- Metadata
  message_count INTEGER DEFAULT 0,
  user_engagement_score NUMERIC DEFAULT 0.5,

  -- Categories
  conversation_type TEXT,
  breakthrough BOOLEAN DEFAULT false,

  -- For timeline
  thumbnail_emoji TEXT,
  color_theme TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_summaries_user ON session_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_session_summaries_date ON session_summaries(session_date);
CREATE INDEX IF NOT EXISTS idx_session_summaries_type ON session_summaries(conversation_type);
CREATE INDEX IF NOT EXISTS idx_session_summaries_breakthrough ON session_summaries(breakthrough);

-- Session Highlights
CREATE TABLE IF NOT EXISTS session_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES session_summaries(id),
  user_id TEXT NOT NULL,

  -- The highlight
  highlight_type TEXT,
  content TEXT,
  context TEXT,

  -- Emotional significance
  emotional_impact NUMERIC DEFAULT 0.7,

  -- User can favorite
  user_favorited BOOLEAN DEFAULT false,

  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_highlights_user ON session_highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_session_highlights_session ON session_highlights(session_id);

-- Timeline Milestones
CREATE TABLE IF NOT EXISTS timeline_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Milestone
  milestone_type TEXT,
  title TEXT,
  description TEXT,

  -- When
  occurred_at TIMESTAMP NOT NULL,
  session_id UUID REFERENCES session_summaries(id),

  -- Significance
  significance_score NUMERIC DEFAULT 0.8,

  -- UI
  icon TEXT,
  display_priority INTEGER DEFAULT 5
);

CREATE INDEX IF NOT EXISTS idx_timeline_milestones_user ON timeline_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_milestones_type ON timeline_milestones(milestone_type);

-- Search Index
CREATE TABLE IF NOT EXISTS conversation_search_index (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  session_id UUID REFERENCES session_summaries(id),

  -- Searchable content
  keywords TEXT[],
  phrases TEXT[],
  entities TEXT[],

  -- Full text
  full_text TEXT,

  -- For search ranking
  relevance_boost NUMERIC DEFAULT 1.0
);

CREATE INDEX IF NOT EXISTS idx_search_user ON conversation_search_index(user_id);
CREATE INDEX IF NOT EXISTS idx_search_keywords ON conversation_search_index USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_search_entities ON conversation_search_index USING GIN(entities);

-- User Favorites
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- What's favorited
  favorite_type TEXT,
  reference_id UUID,

  -- User notes
  user_note TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to increment intimacy counts
CREATE OR REPLACE FUNCTION increment_intimacy_count(p_user_id TEXT, p_field TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE intimacy_progression SET %I = COALESCE(%I, 0) + 1, updated_at = NOW() WHERE user_id = $1', p_field, p_field)
  USING p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMPLETION
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Week 13 Part 2 Migration Complete!';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - sexual_preferences';
  RAISE NOTICE '  - intimacy_boundaries';
  RAISE NOTICE '  - intimacy_progression';
  RAISE NOTICE '  - intimacy_contexts';
  RAISE NOTICE '  - intimacy_responses';
  RAISE NOTICE '  - intimacy_consent_log';
  RAISE NOTICE '  - flirtation_voice_profiles';
  RAISE NOTICE '  - voice_performances';
  RAISE NOTICE '  - user_social_network';
  RAISE NOTICE '  - social_events';
  RAISE NOTICE '  - relationship_dynamics';
  RAISE NOTICE '  - gossip_topics';
  RAISE NOTICE '  - session_summaries';
  RAISE NOTICE '  - session_highlights';
  RAISE NOTICE '  - timeline_milestones';
  RAISE NOTICE '  - conversation_search_index';
  RAISE NOTICE '  - user_favorites';
END $$;
