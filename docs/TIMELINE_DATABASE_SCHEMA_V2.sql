-- ============================================================================
-- TIMELINE DATABASE SCHEMA V2
-- ============================================================================
-- Unified schema for biographical timeline intelligence
--
-- Architecture:
--   Firestore: Real-time operational store (life_events docs)
--   Postgres:  Analytics, RAG retrieval, and consolidation layer
--
-- Data Flow:
--   Conversation → biographyExtractor → timeline_event → user_timeline → summaries
--
-- Created: December 22, 2025
-- Mission: JOIE DE VIVRE - Curating Life Stories
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";        -- pgvector for embeddings

-- ============================================================================
-- PART 1: CORE TIMELINE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1.1 TIMELINE_PERSON
-- Who the story is about (Amy, Mom, Partner, self, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_person (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(128) NOT NULL,
  profile_id VARCHAR(128) NOT NULL,

  -- Identity
  name VARCHAR(255) NOT NULL,
  relationship_to_user VARCHAR(100),          -- daughter, mother, self, friend, spouse

  -- Birth data (for age calculations & astrology)
  birth_year INTEGER,
  birth_date DATE,
  birth_city VARCHAR(255),
  birth_state VARCHAR(100),
  birth_country VARCHAR(100),

  -- Astrological data (if known)
  western_sun_sign VARCHAR(32),
  western_moon_sign VARCHAR(32),
  western_rising VARCHAR(32),
  chinese_zodiac_animal VARCHAR(32),
  chinese_zodiac_element VARCHAR(32),
  bazi_day_master VARCHAR(32),

  -- Status
  is_living BOOLEAN DEFAULT TRUE,
  deceased_year INTEGER,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, profile_id, name)
);

CREATE INDEX idx_timeline_person_user ON timeline_person(user_id, profile_id);
CREATE INDEX idx_timeline_person_relationship ON timeline_person(relationship_to_user);

COMMENT ON TABLE timeline_person IS 'People in the user''s life story - enables tracking multiple biographical subjects';


-- ----------------------------------------------------------------------------
-- 1.2 TIMELINE_EVENT
-- Core biographic events (normalized from Firestore life_events)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(128) NOT NULL,
  profile_id VARCHAR(128) NOT NULL,
  person_id UUID REFERENCES timeline_person(id) ON DELETE SET NULL,

  -- Firestore sync
  firestore_doc_id VARCHAR(128),              -- links to Firestore life_events/{docId}

  -- Core event data
  event_type VARCHAR(50) NOT NULL,            -- education, career, relocation, relationship,
                                              -- family, health, achievement, travel, loss,
                                              -- milestone, spiritual, creative, financial
  title VARCHAR(500) NOT NULL,
  description TEXT,

  -- Temporal data (flexible precision)
  event_date DATE,                            -- exact date if known
  event_year INTEGER,                         -- year (most common)
  event_month SMALLINT CHECK (event_month BETWEEN 1 AND 12),
  event_day SMALLINT CHECK (event_day BETWEEN 1 AND 31),
  date_precision VARCHAR(20) DEFAULT 'unknown'
    CHECK (date_precision IN ('exact', 'year', 'decade', 'approximate', 'unknown')),
  age_at_event REAL,                          -- calculated from person.birth_date

  -- Location
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  location_precision VARCHAR(20) DEFAULT 'unknown'
    CHECK (location_precision IN ('exact', 'city', 'state', 'country', 'unknown')),

  -- Emotions (array for multi-valued)
  emotions TEXT[],                            -- ['joy', 'pride', 'bittersweet']

  -- Life chapter classification
  chapter_id VARCHAR(50),                     -- childhood, adolescence, early_adulthood,
                                              -- midlife, mature_adulthood, elder_years
  chapter_name VARCHAR(100),

  -- AI extraction metadata
  confidence REAL DEFAULT 0.8 CHECK (confidence BETWEEN 0 AND 1),
  mention_count INTEGER DEFAULT 1,
  verified BOOLEAN DEFAULT FALSE,

  -- Source tracking
  source_type VARCHAR(50) DEFAULT 'conversation',  -- conversation, import, manual, ai_inferred
  conversation_id VARCHAR(128),
  message_id VARCHAR(128),
  extracted_at TIMESTAMPTZ,

  -- Vector embedding for semantic search
  embedding VECTOR(768),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_timeline_event_user ON timeline_event(user_id, profile_id);
CREATE INDEX idx_timeline_event_person ON timeline_event(person_id);
CREATE INDEX idx_timeline_event_year ON timeline_event(user_id, profile_id, event_year);
CREATE INDEX idx_timeline_event_type ON timeline_event(event_type);
CREATE INDEX idx_timeline_event_chapter ON timeline_event(chapter_id);
CREATE INDEX idx_timeline_event_firestore ON timeline_event(firestore_doc_id);
CREATE INDEX idx_timeline_event_embedding ON timeline_event
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

COMMENT ON TABLE timeline_event IS 'Biographical events - normalized from Firestore life_events for analytics and RAG';


-- ----------------------------------------------------------------------------
-- 1.3 TIMELINE_EVENT_PEOPLE
-- Many-to-many: people involved in each event
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_event_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES timeline_event(id) ON DELETE CASCADE,

  -- Person reference (can be normalized or just name)
  person_id UUID REFERENCES timeline_person(id) ON DELETE SET NULL,
  person_name VARCHAR(255) NOT NULL,          -- always store name for quick access

  -- Role in event
  role VARCHAR(100),                          -- protagonist, family, friend, colleague, witness
  is_primary BOOLEAN DEFAULT FALSE,           -- main person this event is about

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, person_name)
);

CREATE INDEX idx_event_people_event ON timeline_event_people(event_id);
CREATE INDEX idx_event_people_person ON timeline_event_people(person_id);
CREATE INDEX idx_event_people_name ON timeline_event_people(person_name);

COMMENT ON TABLE timeline_event_people IS 'People involved in each event - enables relationship mapping';


-- ----------------------------------------------------------------------------
-- 1.4 TIMELINE_EVENT_QUESTIONS (Neural Pathways)
-- Questions to explore - gaps in the life story
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_event_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(128) NOT NULL,
  profile_id VARCHAR(128) NOT NULL,
  person_id UUID REFERENCES timeline_person(id) ON DELETE CASCADE,
  event_id UUID REFERENCES timeline_event(id) ON DELETE CASCADE,

  -- Question content
  question TEXT NOT NULL,
  reason TEXT,                                -- "Missing birth year for Amy"

  -- Classification
  category VARCHAR(50),                       -- time, location, education, career,
                                              -- relationship, experience, emotion
  priority REAL DEFAULT 0.5 CHECK (priority BETWEEN 0 AND 1),

  -- Status
  answered BOOLEAN DEFAULT FALSE,
  answered_at TIMESTAMPTZ,
  answered_in_conversation_id VARCHAR(128),

  -- AI metadata
  auto_generated BOOLEAN DEFAULT TRUE,
  confidence REAL DEFAULT 0.8,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_questions_user ON timeline_event_questions(user_id, profile_id);
CREATE INDEX idx_event_questions_person ON timeline_event_questions(person_id);
CREATE INDEX idx_event_questions_event ON timeline_event_questions(event_id);
CREATE INDEX idx_event_questions_unanswered ON timeline_event_questions(user_id, profile_id, answered, priority DESC)
  WHERE answered = FALSE;
CREATE INDEX idx_event_questions_category ON timeline_event_questions(category);

COMMENT ON TABLE timeline_event_questions IS 'Neural Pathways - questions to explore gaps in life story';


-- ----------------------------------------------------------------------------
-- 1.5 TIMELINE_EVENT_LINKS
-- Relations between events (duplicates, refinements, causation)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_event_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(128) NOT NULL,
  profile_id VARCHAR(128) NOT NULL,

  from_event_id UUID NOT NULL REFERENCES timeline_event(id) ON DELETE CASCADE,
  to_event_id UUID NOT NULL REFERENCES timeline_event(id) ON DELETE CASCADE,

  -- Link type
  link_type VARCHAR(50) NOT NULL              -- duplicate_of, refines, caused_by,
    CHECK (link_type IN (                     -- related_to, preceded_by, followed_by
      'duplicate_of',
      'refines',
      'caused_by',
      'related_to',
      'preceded_by',
      'followed_by',
      'same_person'
    )),

  -- Metadata
  confidence REAL DEFAULT 0.8 CHECK (confidence BETWEEN 0 AND 1),
  notes TEXT,
  auto_detected BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(from_event_id, to_event_id, link_type)
);

CREATE INDEX idx_event_links_user ON timeline_event_links(user_id, profile_id);
CREATE INDEX idx_event_links_from ON timeline_event_links(from_event_id);
CREATE INDEX idx_event_links_to ON timeline_event_links(to_event_id);
CREATE INDEX idx_event_links_type ON timeline_event_links(link_type);

COMMENT ON TABLE timeline_event_links IS 'Links between events - for deduplication, refinement tracking, and story connections';


-- ============================================================================
-- PART 2: SUMMARY & ANALYTICS TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 TIMELINE_SUMMARIES (Period Summaries)
-- AI-generated summaries for time periods
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_summaries (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  profile_id VARCHAR(255) NOT NULL,
  person_id UUID REFERENCES timeline_person(id) ON DELETE CASCADE,

  -- Period identification
  period_type VARCHAR(20) NOT NULL            -- decade, 5year, year, quarter, month, chapter
    CHECK (period_type IN ('decade', '5year', 'year', 'quarter', 'month', 'chapter')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_label VARCHAR(100),                  -- "2015-2024", "Q2 2024", "Childhood"

  -- Summary content (3 lengths)
  summary_short TEXT,                         -- 1-2 sentences
  summary_medium TEXT,                        -- 1 paragraph
  summary_long TEXT,                          -- 2-3 paragraphs

  -- Highlights
  highlights JSONB,                           -- [{title, year, significance}]
  key_people JSONB,                           -- [{name, role, mention_count}]
  key_locations JSONB,                        -- [{city, state, country, event_count}]

  -- Metrics
  total_events INTEGER DEFAULT 0,
  event_breakdown JSONB,                      -- {education: 3, career: 5, family: 2}

  -- Emotional analysis
  avg_emotional_valence DECIMAL(3,2),         -- -1.0 to 1.0
  dominant_emotions JSONB,                    -- ["joy", "growth", "connection"]
  emotional_arc TEXT,                         -- "rising", "falling", "stable", "turbulent"

  -- AI metadata
  generated_by VARCHAR(50) DEFAULT 'gemini',
  generated_at TIMESTAMPTZ,
  confidence_score DECIMAL(3,2),

  -- Source tracking
  source_event_ids UUID[],                    -- events used to generate summary
  source_event_count INTEGER,

  -- Version control
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, profile_id, person_id, period_type, period_start)
);

CREATE INDEX idx_timeline_summaries_user ON timeline_summaries(user_id, profile_id);
CREATE INDEX idx_timeline_summaries_person ON timeline_summaries(person_id);
CREATE INDEX idx_timeline_summaries_period ON timeline_summaries(period_type, period_start);
CREATE INDEX idx_timeline_summaries_highlights ON timeline_summaries USING GIN (highlights);

COMMENT ON TABLE timeline_summaries IS 'AI-generated summaries for time periods - powers Timeline Console views';


-- ----------------------------------------------------------------------------
-- 2.2 TIMELINE_CHAPTERS
-- Life chapter definitions and boundaries
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(128) NOT NULL,
  profile_id VARCHAR(128) NOT NULL,
  person_id UUID REFERENCES timeline_person(id) ON DELETE CASCADE,

  -- Chapter identification
  chapter_id VARCHAR(50) NOT NULL,            -- childhood, adolescence, early_adulthood, etc.
  chapter_name VARCHAR(100) NOT NULL,         -- "Childhood", "The College Years", custom name

  -- Boundaries
  start_year INTEGER,
  end_year INTEGER,
  start_age REAL,
  end_age REAL,

  -- Content
  description TEXT,
  themes JSONB,                               -- ["exploration", "identity", "growth"]
  defining_events UUID[],                     -- key event IDs

  -- Metadata
  is_custom BOOLEAN DEFAULT FALSE,            -- user-defined vs auto-generated
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, profile_id, person_id, chapter_id)
);

CREATE INDEX idx_timeline_chapters_user ON timeline_chapters(user_id, profile_id);
CREATE INDEX idx_timeline_chapters_person ON timeline_chapters(person_id);

COMMENT ON TABLE timeline_chapters IS 'Life chapter definitions - for organizing biography into meaningful periods';


-- ============================================================================
-- PART 3: CONTEXT & TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 CULTURAL_CONTEXT
-- Movies, music, news that trigger memories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cultural_context (
  id SERIAL PRIMARY KEY,

  -- Time identification
  year INTEGER NOT NULL CHECK (year BETWEEN 1900 AND 2100),
  month INTEGER CHECK (month BETWEEN 1 AND 12),

  -- Category
  category VARCHAR(50) NOT NULL               -- news, music, movies, tv, tech, culture, sports
    CHECK (category IN ('news', 'music', 'movies', 'tv', 'tech', 'culture', 'sports', 'books', 'games')),

  -- Content
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  date_specific DATE,

  -- Metadata
  significance_score INTEGER CHECK (significance_score BETWEEN 1 AND 10),
  region VARCHAR(50) DEFAULT 'global',        -- us, uk, global, asia, etc.
  popularity_score DECIMAL(3,2),              -- 0.0 to 1.0

  -- Rich data (varies by category)
  data JSONB,                                 -- type-specific: {director, cast, boxOffice} for movies

  -- Source tracking
  source VARCHAR(100),                        -- wikipedia, tmdb, spotify, manual
  source_url TEXT,
  last_verified TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(year, month, category, title)
);

CREATE INDEX idx_cultural_context_year ON cultural_context(year);
CREATE INDEX idx_cultural_context_category ON cultural_context(category);
CREATE INDEX idx_cultural_context_year_cat ON cultural_context(year, category);
CREATE INDEX idx_cultural_context_data ON cultural_context USING GIN (data);

COMMENT ON TABLE cultural_context IS 'Cultural touchstones - movies, music, news for memory triggers';


-- ----------------------------------------------------------------------------
-- 3.2 MEMORY_TRIGGERS
-- Tracks which cultural contexts triggered which memories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_triggers (
  id SERIAL PRIMARY KEY,

  user_id VARCHAR(255) NOT NULL,
  profile_id VARCHAR(255) NOT NULL,

  -- The trigger
  cultural_context_id INTEGER REFERENCES cultural_context(id) ON DELETE SET NULL,
  trigger_type VARCHAR(50),                   -- direct, suggested, auto_detected

  -- The result
  event_id UUID REFERENCES timeline_event(id) ON DELETE SET NULL,

  -- Capture details
  capture_method VARCHAR(50),                 -- quick_text, luna_chat, voice, auto_import
  capture_duration_seconds INTEGER,

  -- Effectiveness metrics
  memory_richness_score DECIMAL(3,2),         -- 0.0 to 1.0
  user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 5),

  triggered_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, profile_id, cultural_context_id, event_id)
);

CREATE INDEX idx_memory_triggers_user ON memory_triggers(user_id, profile_id);
CREATE INDEX idx_memory_triggers_context ON memory_triggers(cultural_context_id);
CREATE INDEX idx_memory_triggers_event ON memory_triggers(event_id);

COMMENT ON TABLE memory_triggers IS 'Links cultural context to memories - tracks trigger effectiveness';


-- ============================================================================
-- PART 4: GENERATIONAL CONTEXT
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 GENERATIONAL_PROFILES
-- Pre-computed generational context for birth years
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS generational_profiles (
  id SERIAL PRIMARY KEY,

  birth_year INTEGER NOT NULL UNIQUE CHECK (birth_year BETWEEN 1900 AND 2030),

  -- Generation classification
  generation_name VARCHAR(50) NOT NULL,       -- Baby Boomer, Gen X, Millennial, Gen Z, Gen Alpha
  generation_start_year INTEGER,
  generation_end_year INTEGER,

  -- Key periods
  childhood_start INTEGER,                    -- birth_year + 5
  childhood_end INTEGER,                      -- birth_year + 12
  teen_start INTEGER,                         -- birth_year + 13
  teen_end INTEGER,                           -- birth_year + 19
  young_adult_start INTEGER,                  -- birth_year + 20
  young_adult_end INTEGER,                    -- birth_year + 30

  -- Formative context (AI-generated, cached)
  formative_events JSONB,                     -- [{year, event, significance}]
  cultural_touchstones JSONB,                 -- {music: [], movies: [], tv: [], tech: []}
  economic_context TEXT,
  generational_traits JSONB,                  -- ["entrepreneurial", "digital native"]

  -- AI metadata
  context_summary TEXT,                       -- Full narrative summary
  generated_at TIMESTAMPTZ,
  generated_by VARCHAR(50) DEFAULT 'gemini',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generational_profiles_year ON generational_profiles(birth_year);
CREATE INDEX idx_generational_profiles_gen ON generational_profiles(generation_name);

COMMENT ON TABLE generational_profiles IS 'Cached generational context - avoids re-computing for common birth years';


-- ============================================================================
-- PART 5: HELPER FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Calculate age at event
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_age_at_event(
  p_birth_date DATE,
  p_event_date DATE,
  p_event_year INTEGER
) RETURNS REAL AS $$
BEGIN
  IF p_birth_date IS NULL THEN
    RETURN NULL;
  END IF;

  IF p_event_date IS NOT NULL THEN
    RETURN EXTRACT(YEAR FROM age(p_event_date, p_birth_date)) +
           EXTRACT(MONTH FROM age(p_event_date, p_birth_date)) / 12.0;
  ELSIF p_event_year IS NOT NULL THEN
    RETURN p_event_year - EXTRACT(YEAR FROM p_birth_date);
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ----------------------------------------------------------------------------
-- Determine life chapter from age
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_life_chapter(p_age REAL)
RETURNS TABLE(chapter_id VARCHAR, chapter_name VARCHAR) AS $$
BEGIN
  IF p_age IS NULL THEN
    RETURN QUERY SELECT 'unknown'::VARCHAR, 'Unknown'::VARCHAR;
  ELSIF p_age <= 12 THEN
    RETURN QUERY SELECT 'childhood'::VARCHAR, 'Childhood'::VARCHAR;
  ELSIF p_age <= 19 THEN
    RETURN QUERY SELECT 'adolescence'::VARCHAR, 'Adolescence'::VARCHAR;
  ELSIF p_age <= 35 THEN
    RETURN QUERY SELECT 'early_adulthood'::VARCHAR, 'Early Adulthood'::VARCHAR;
  ELSIF p_age <= 55 THEN
    RETURN QUERY SELECT 'midlife'::VARCHAR, 'Midlife'::VARCHAR;
  ELSIF p_age <= 70 THEN
    RETURN QUERY SELECT 'mature_adulthood'::VARCHAR, 'Mature Adulthood'::VARCHAR;
  ELSE
    RETURN QUERY SELECT 'elder_years'::VARCHAR, 'Elder Years'::VARCHAR;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ----------------------------------------------------------------------------
-- Get generation name from birth year
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_generation(p_birth_year INTEGER)
RETURNS VARCHAR AS $$
BEGIN
  IF p_birth_year < 1928 THEN
    RETURN 'Greatest Generation';
  ELSIF p_birth_year <= 1945 THEN
    RETURN 'Silent Generation';
  ELSIF p_birth_year <= 1964 THEN
    RETURN 'Baby Boomer';
  ELSIF p_birth_year <= 1980 THEN
    RETURN 'Generation X';
  ELSIF p_birth_year <= 1996 THEN
    RETURN 'Millennial';
  ELSIF p_birth_year <= 2012 THEN
    RETURN 'Generation Z';
  ELSE
    RETURN 'Generation Alpha';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- ============================================================================
-- PART 6: VIEWS FOR COMMON QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Full event view with person and chapter info
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW timeline_event_full AS
SELECT
  e.*,
  p.name AS person_name,
  p.relationship_to_user,
  p.birth_year AS person_birth_year,
  get_generation(p.birth_year) AS person_generation,
  COALESCE(
    e.chapter_name,
    (SELECT chapter_name FROM get_life_chapter(e.age_at_event))
  ) AS computed_chapter_name
FROM timeline_event e
LEFT JOIN timeline_person p ON e.person_id = p.id;

COMMENT ON VIEW timeline_event_full IS 'Events with person details and computed chapter';

-- ----------------------------------------------------------------------------
-- Unanswered questions (Neural Pathways)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW neural_pathways_active AS
SELECT
  q.*,
  e.title AS event_title,
  e.event_year,
  e.event_type,
  p.name AS person_name,
  p.relationship_to_user
FROM timeline_event_questions q
LEFT JOIN timeline_event e ON q.event_id = e.id
LEFT JOIN timeline_person p ON q.person_id = p.id
WHERE q.answered = FALSE
ORDER BY q.priority DESC, q.created_at ASC;

COMMENT ON VIEW neural_pathways_active IS 'Active Neural Pathways - unanswered questions to explore';

-- ----------------------------------------------------------------------------
-- Person timeline summary
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW person_timeline_summary AS
SELECT
  p.id AS person_id,
  p.user_id,
  p.profile_id,
  p.name,
  p.relationship_to_user,
  p.birth_year,
  get_generation(p.birth_year) AS generation,
  COUNT(DISTINCT e.id) AS total_events,
  MIN(e.event_year) AS earliest_year,
  MAX(e.event_year) AS latest_year,
  COUNT(DISTINCT e.chapter_id) AS chapters_documented,
  COUNT(DISTINCT q.id) FILTER (WHERE q.answered = FALSE) AS open_questions,
  array_agg(DISTINCT e.event_type) FILTER (WHERE e.event_type IS NOT NULL) AS event_types
FROM timeline_person p
LEFT JOIN timeline_event e ON p.id = e.person_id
LEFT JOIN timeline_event_questions q ON p.id = q.person_id
GROUP BY p.id;

COMMENT ON VIEW person_timeline_summary IS 'Summary stats for each person in the timeline';


-- ============================================================================
-- PART 7: FIRESTORE SYNC TRACKING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Track sync status between Firestore and Postgres
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS firestore_sync_log (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  profile_id VARCHAR(128) NOT NULL,

  -- Sync details
  collection_path VARCHAR(255) NOT NULL,      -- users/{userId}/biography/{profileId}/life_events
  last_sync_at TIMESTAMPTZ,
  last_doc_id VARCHAR(128),
  docs_synced INTEGER DEFAULT 0,

  -- Status
  sync_status VARCHAR(20) DEFAULT 'pending'
    CHECK (sync_status IN ('pending', 'running', 'completed', 'failed')),
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, profile_id, collection_path)
);

CREATE INDEX idx_firestore_sync_user ON firestore_sync_log(user_id, profile_id);
CREATE INDEX idx_firestore_sync_status ON firestore_sync_log(sync_status);

COMMENT ON TABLE firestore_sync_log IS 'Tracks sync status between Firestore life_events and Postgres timeline_event';


-- ============================================================================
-- MAPPING REFERENCE: Firestore ↔ Postgres
-- ============================================================================
/*
Firestore: users/{userId}/biography/{profileId}/life_events/{docId}

{
  event_type           → timeline_event.event_type
  title                → timeline_event.title
  description          → timeline_event.description
  date.year            → timeline_event.event_year
  date.month           → timeline_event.event_month
  date.day             → timeline_event.event_day
  date.precision       → timeline_event.date_precision
  date.age_at_event    → timeline_event.age_at_event
  location.city        → timeline_event.city
  location.state       → timeline_event.state
  location.country     → timeline_event.country
  people_involved[]    → timeline_event_people (multiple rows)
  emotions[]           → timeline_event.emotions (array)
  confidence           → timeline_event.confidence
  neural_pathways[]    → timeline_event_questions (multiple rows)
  chapter.id           → timeline_event.chapter_id
  chapter.name         → timeline_event.chapter_name
  source.type          → timeline_event.source_type
  source.conversationId → timeline_event.conversation_id
  source.messageId     → timeline_event.message_id
  source.extractedAt   → timeline_event.extracted_at
  mentionCount         → timeline_event.mention_count
  verified             → timeline_event.verified
  createdAt            → timeline_event.created_at
  updatedAt            → timeline_event.updated_at
  (docId)              → timeline_event.firestore_doc_id
}

Data Flow:
  1. Conversation happens in chat
  2. biographyExtractor.js extracts events → Firestore life_events
  3. Nightly sync job → Postgres timeline_event
  4. Summary generator → timeline_summaries
  5. RAG queries → timeline_event (vector search)
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
