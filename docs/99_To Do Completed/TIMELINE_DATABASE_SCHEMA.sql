-- ============================================================================
-- GENESIS TIMELINE CONSOLE - DATABASE SCHEMA
-- ============================================================================
-- Database: genesismemory (PostgreSQL 17)
-- Created: December 21, 2025
-- Purpose: Timeline navigation, cultural context, memory capture
-- 
-- Tables:
--   1. timeline_summaries - AI-generated period summaries
--   2. cultural_context - Movies, music, news, events for memory triggers
--   3. memory_triggers - Track which contexts unlock which memories
--
-- Dependencies:
--   - long_term_memory table (already exists)
-- ============================================================================

-- ============================================================================
-- TABLE 1: timeline_summaries
-- ============================================================================
-- Stores AI-generated summaries for each time period
-- Supports zoom levels: decade, 5year, year, quarter, month

CREATE TABLE IF NOT EXISTS timeline_summaries (
  -- Primary key
  id SERIAL PRIMARY KEY,
  
  -- User identification
  user_id VARCHAR(255) NOT NULL,
  profile_id VARCHAR(255) NOT NULL,
  
  -- Period identification
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('decade', '5year', 'year', 'quarter', 'month')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_label VARCHAR(100),  -- Human-readable: '2015-2024', 'Q2 2024', 'May 2024'
  
  -- Summary content (3 versions for different contexts)
  summary_short TEXT,      -- 1-2 sentences (hover preview)
  summary_medium TEXT,     -- 1 paragraph (card display)
  summary_long TEXT,       -- 2-3 paragraphs (detail view)
  
  -- Key highlights (JSON structure)
  highlights JSONB DEFAULT '{}',
  /*
    Example structure:
    {
      "emma_birth": {
        "date": "2020-04-12",
        "title": "Emma Rose born",
        "description": "Everything changed",
        "significance": "transformative",
        "happiness_impact": 1.2,
        "related_memory_ids": [123, 456, 789]
      },
      "career_pivot": {
        "date": "2021-06-15",
        "title": "Left corporate for AI",
        "description": "Following fire instead of fear",
        "significance": "high",
        "happiness_impact": 0.8,
        "related_memory_ids": [234, 567]
      }
    }
  */
  
  -- Metrics
  total_memories INTEGER DEFAULT 0,
  memory_breakdown JSONB DEFAULT '{}',  -- {"conversations": 547, "photos": 234, "journals": 89}
  avg_happiness DECIMAL(3,2),
  happiness_trend VARCHAR(20) CHECK (happiness_trend IN ('increasing', 'stable', 'decreasing', 'volatile')),
  happiness_start DECIMAL(3,2),  -- Happiness at period start
  happiness_end DECIMAL(3,2),    -- Happiness at period end
  happiness_change DECIMAL(3,2), -- Change over period
  
  -- Emotional signature
  dominant_emotions JSONB DEFAULT '[]',  -- ["joy", "growth", "connection"]
  neurochemical_avg JSONB DEFAULT '{}',  -- {"oxytocin": 4.2, "dopamine": 3.8, "serotonin": 4.1, "vasopressin": 3.5}
  
  -- AI generation metadata
  generated_by VARCHAR(50) DEFAULT 'claude-sonnet-4',
  generated_at TIMESTAMP DEFAULT NOW(),
  confidence_score DECIMAL(3,2) DEFAULT 0.8 CHECK (confidence_score BETWEEN 0 AND 1),
  generation_prompt_version VARCHAR(20) DEFAULT 'v1.0',
  
  -- Source memories
  source_memory_ids INTEGER[] DEFAULT '{}',  -- Array of top memory IDs used
  source_memory_count INTEGER DEFAULT 0,     -- Total memories in period
  
  -- Version control
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one summary per user/profile/period
  UNIQUE(user_id, profile_id, period_type, period_start)
);

-- Indexes for timeline_summaries
CREATE INDEX IF NOT EXISTS idx_timeline_summaries_user 
  ON timeline_summaries(user_id, profile_id);

CREATE INDEX IF NOT EXISTS idx_timeline_summaries_period 
  ON timeline_summaries(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_timeline_summaries_type 
  ON timeline_summaries(period_type);

CREATE INDEX IF NOT EXISTS idx_timeline_summaries_generated 
  ON timeline_summaries(generated_at DESC);

CREATE INDEX IF NOT EXISTS idx_timeline_summaries_happiness 
  ON timeline_summaries(avg_happiness);

-- GIN index for JSON fields (fast JSONB queries)
CREATE INDEX IF NOT EXISTS idx_timeline_summaries_highlights 
  ON timeline_summaries USING gin(highlights);

CREATE INDEX IF NOT EXISTS idx_timeline_summaries_emotions 
  ON timeline_summaries USING gin(dominant_emotions);

-- Comment
COMMENT ON TABLE timeline_summaries IS 'AI-generated summaries for each time period (decade/year/month)';

-- ============================================================================
-- TABLE 2: cultural_context
-- ============================================================================
-- Stores cultural events, movies, music, news that can trigger memories

CREATE TABLE IF NOT EXISTS cultural_context (
  -- Primary key
  id SERIAL PRIMARY KEY,
  
  -- Time identification
  year INTEGER NOT NULL CHECK (year BETWEEN 1900 AND 2100),
  month INTEGER CHECK (month BETWEEN 1 AND 12),  -- NULL for yearly context
  
  -- Category
  category VARCHAR(50) NOT NULL CHECK (category IN ('news', 'music', 'movies', 'tv', 'tech', 'culture', 'sports', 'books', 'games')),
  
  -- Content
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  date_specific DATE,
  
  -- Metadata
  significance_score INTEGER DEFAULT 5 CHECK (significance_score BETWEEN 1 AND 10),
  region VARCHAR(50) DEFAULT 'global',  -- 'us', 'uk', 'global', 'asia', etc.
  popularity_score DECIMAL(3,2) CHECK (popularity_score BETWEEN 0 AND 1),
  
  -- Rich data (JSON structure varies by category)
  data JSONB DEFAULT '{}',
  /*
    Example for movies:
    {
      "type": "movie",
      "director": "Ryan Coogler",
      "cast": ["Chadwick Boseman", "Lupita Nyongo"],
      "boxOffice": "$1.3B",
      "imdb": 7.3,
      "rottenTomatoes": 96,
      "poster_url": "https://...",
      "trailer_url": "https://...",
      "themes": ["afrofuturism", "representation"]
    }
    
    Example for music:
    {
      "type": "song",
      "artist": "Drake",
      "album": "Scorpion",
      "weeks_at_1": 11,
      "spotify_url": "https://...",
      "genre": ["hip-hop", "rap"],
      "themes": ["success", "gratitude"]
    }
    
    Example for news:
    {
      "type": "news_event",
      "location": "Windsor Castle, UK",
      "people": ["Prince Harry", "Meghan Markle"],
      "image_url": "https://...",
      "grokipedia_url": "https://grokipedia.com/page/..."
    }
  */
  
  -- Source tracking
  source VARCHAR(100),  -- 'grokipedia', 'wikipedia', 'tmdb', 'spotify', 'manual'
  source_url TEXT,
  last_verified TIMESTAMP DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique entries
  UNIQUE(year, month, category, title)
);

-- Indexes for cultural_context
CREATE INDEX IF NOT EXISTS idx_cultural_context_year 
  ON cultural_context(year);

CREATE INDEX IF NOT EXISTS idx_cultural_context_year_month 
  ON cultural_context(year, month);

CREATE INDEX IF NOT EXISTS idx_cultural_context_category 
  ON cultural_context(category);

CREATE INDEX IF NOT EXISTS idx_cultural_context_significance 
  ON cultural_context(significance_score DESC);

CREATE INDEX IF NOT EXISTS idx_cultural_context_region 
  ON cultural_context(region);

CREATE INDEX IF NOT EXISTS idx_cultural_context_date 
  ON cultural_context(date_specific);

-- Full-text search on title and description
CREATE INDEX IF NOT EXISTS idx_cultural_context_search 
  ON cultural_context USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- GIN index for JSON data
CREATE INDEX IF NOT EXISTS idx_cultural_context_data 
  ON cultural_context USING gin(data);

-- Comment
COMMENT ON TABLE cultural_context IS 'Cultural events, movies, music, news that trigger memories';

-- ============================================================================
-- TABLE 3: memory_triggers
-- ============================================================================
-- Tracks which cultural contexts triggered which memories

CREATE TABLE IF NOT EXISTS memory_triggers (
  -- Primary key
  id SERIAL PRIMARY KEY,
  
  -- User identification
  user_id VARCHAR(255) NOT NULL,
  profile_id VARCHAR(255) NOT NULL,
  
  -- The trigger
  cultural_context_id INTEGER REFERENCES cultural_context(id) ON DELETE CASCADE,
  trigger_type VARCHAR(50) CHECK (trigger_type IN ('direct', 'suggested', 'auto_detected')),
  
  -- The result
  memory_id INTEGER REFERENCES long_term_memory(id) ON DELETE CASCADE,
  
  -- Capture details
  capture_method VARCHAR(50) CHECK (capture_method IN ('quick_text', 'luna_chat', 'voice', 'auto_import')),
  capture_duration_seconds INTEGER CHECK (capture_duration_seconds > 0),
  
  -- Effectiveness metrics
  memory_richness_score DECIMAL(3,2) CHECK (memory_richness_score BETWEEN 0 AND 1),
  user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 5),
  
  -- Timestamps
  triggered_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique trigger-memory pairs
  UNIQUE(user_id, profile_id, cultural_context_id, memory_id)
);

-- Indexes for memory_triggers
CREATE INDEX IF NOT EXISTS idx_memory_triggers_user 
  ON memory_triggers(user_id, profile_id);

CREATE INDEX IF NOT EXISTS idx_memory_triggers_context 
  ON memory_triggers(cultural_context_id);

CREATE INDEX IF NOT EXISTS idx_memory_triggers_memory 
  ON memory_triggers(memory_id);

CREATE INDEX IF NOT EXISTS idx_memory_triggers_time 
  ON memory_triggers(triggered_at DESC);

CREATE INDEX IF NOT EXISTS idx_memory_triggers_method 
  ON memory_triggers(capture_method);

-- Comment
COMMENT ON TABLE memory_triggers IS 'Tracks which cultural contexts triggered which memories';

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Sample cultural context for 2018
INSERT INTO cultural_context (year, month, category, title, subtitle, date_specific, significance_score, region, data, source, source_url)
VALUES 
  -- Movies
  (2018, 2, 'movies', 'Black Panther', 'Wakanda Forever', '2018-02-16', 9, 'global',
   '{"type": "movie", "director": "Ryan Coogler", "cast": ["Chadwick Boseman", "Lupita Nyongo", "Michael B. Jordan"], "boxOffice": "$1.3B", "imdb": 7.3, "rottenTomatoes": 96, "themes": ["afrofuturism", "representation", "technology"], "poster_url": "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg"}',
   'tmdb', 'https://www.themoviedb.org/movie/284054-black-panther')
  
ON CONFLICT (year, month, category, title) DO NOTHING;

INSERT INTO cultural_context (year, month, category, title, subtitle, date_specific, significance_score, region, data, source, source_url)
VALUES 
  (2018, 4, 'movies', 'Avengers: Infinity War', 'An entire universe. Once and for all.', '2018-04-27', 9, 'global',
   '{"type": "movie", "director": "Russo Brothers", "cast": ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], "boxOffice": "$2.0B", "imdb": 8.4, "themes": ["sacrifice", "loss", "epic"]}',
   'tmdb', 'https://www.themoviedb.org/movie/299536-avengers-infinity-war')
  
ON CONFLICT (year, month, category, title) DO NOTHING;

-- Music
INSERT INTO cultural_context (year, month, category, title, subtitle, date_specific, significance_score, region, data, source)
VALUES 
  (2018, 1, 'music', 'God''s Plan', 'Drake', '2018-01-19', 8, 'global',
   '{"type": "song", "artist": "Drake", "album": "Scorpion", "weeks_at_1": 11, "spotify_url": "https://open.spotify.com/track/6DCZcSspjsKoFjzjrWoCdn", "genre": ["hip-hop", "rap"], "themes": ["success", "gratitude"]}',
   'spotify')
  
ON CONFLICT (year, month, category, title) DO NOTHING;

-- News
INSERT INTO cultural_context (year, month, category, title, subtitle, date_specific, significance_score, region, data, source, source_url)
VALUES 
  (2018, 5, 'news', 'Royal Wedding', 'Prince Harry and Meghan Markle', '2018-05-19', 7, 'global',
   '{"type": "news_event", "location": "Windsor Castle, UK", "people": ["Prince Harry", "Meghan Markle"], "event_type": "royal_wedding", "grokipedia_url": "https://grokipedia.com/page/Wedding_of_Prince_Harry_and_Meghan_Markle"}',
   'grokipedia', 'https://grokipedia.com/page/Wedding_of_Prince_Harry_and_Meghan_Markle')
  
ON CONFLICT (year, month, category, title) DO NOTHING;

-- Sports
INSERT INTO cultural_context (year, month, category, title, subtitle, date_specific, significance_score, region, data, source, source_url)
VALUES 
  (2018, 6, 'sports', 'FIFA World Cup', 'Russia 2018', '2018-06-14', 9, 'global',
   '{"type": "sports_event", "location": "Russia", "winner": "France", "dates": "June 14 - July 15", "highlights": ["France wins", "Croatia runner-up"]}',
   'grokipedia', 'https://grokipedia.com/page/2018_FIFA_World_Cup')
  
ON CONFLICT (year, month, category, title) DO NOTHING;

-- Technology
INSERT INTO cultural_context (year, category, title, subtitle, significance_score, region, data, source)
VALUES 
  (2018, 'tech', 'iPhone X Launch', 'Apple''s 10th Anniversary iPhone', 7, 'global',
   '{"type": "product_launch", "company": "Apple", "price": "$999", "features": ["Face ID", "OLED display", "No home button"], "release_date": "2017-11-03"}',
   'manual')
  
ON CONFLICT (year, month, category, title) DO NOTHING;

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Query 1: Get timeline data for a user (all years with memory counts)
-- USAGE: Shows overview of user's timeline
/*
SELECT 
  EXTRACT(YEAR FROM timestamp) as year,
  COUNT(*) as memory_count,
  AVG(happiness_score) as avg_happiness,
  ARRAY_AGG(DISTINCT memory_type) as memory_types
FROM long_term_memory
WHERE user_id = 'USER_ID_HERE' 
  AND profile_id = 'PROFILE_ID_HERE'
GROUP BY EXTRACT(YEAR FROM timestamp)
ORDER BY year;
*/

-- Query 2: Get summary for a specific period
-- USAGE: Display summary when user clicks on a period
/*
SELECT 
  period_label,
  summary_short,
  summary_medium,
  summary_long,
  highlights,
  total_memories,
  avg_happiness,
  happiness_trend,
  dominant_emotions
FROM timeline_summaries
WHERE user_id = 'USER_ID_HERE'
  AND profile_id = 'PROFILE_ID_HERE'
  AND period_type = 'year'
  AND period_start = '2024-01-01';
*/

-- Query 3: Get cultural context for a year
-- USAGE: Show context cards for memory triggers
/*
SELECT 
  id,
  category,
  title,
  subtitle,
  date_specific,
  significance_score,
  data
FROM cultural_context
WHERE year = 2018
ORDER BY significance_score DESC, date_specific ASC
LIMIT 20;
*/

-- Query 4: Get memories for a specific day
-- USAGE: Day view showing all memories
/*
SELECT 
  id,
  timestamp,
  content,
  memory_type,
  happiness_score,
  significance_rating
FROM long_term_memory
WHERE user_id = 'USER_ID_HERE'
  AND profile_id = 'PROFILE_ID_HERE'
  AND DATE(timestamp) = '2024-05-15'
ORDER BY timestamp;
*/

-- Query 5: Get trigger effectiveness analytics
-- USAGE: Understand which contexts work best
/*
SELECT 
  cc.category,
  COUNT(*) as trigger_count,
  AVG(mt.memory_richness_score) as avg_richness,
  AVG(mt.capture_duration_seconds) as avg_duration,
  AVG(mt.user_satisfaction) as avg_satisfaction
FROM memory_triggers mt
JOIN cultural_context cc ON mt.cultural_context_id = cc.id
WHERE mt.user_id = 'USER_ID_HERE'
  AND mt.profile_id = 'PROFILE_ID_HERE'
GROUP BY cc.category
ORDER BY trigger_count DESC;
*/

-- Query 6: Find memory gaps (periods with few memories)
-- USAGE: Suggest periods for exploration
/*
WITH monthly_counts AS (
  SELECT 
    DATE_TRUNC('month', timestamp) as month,
    COUNT(*) as memory_count
  FROM long_term_memory
  WHERE user_id = 'USER_ID_HERE'
    AND profile_id = 'PROFILE_ID_HERE'
  GROUP BY DATE_TRUNC('month', timestamp)
)
SELECT 
  month,
  memory_count
FROM monthly_counts
WHERE memory_count < 10  -- Threshold for "sparse"
ORDER BY month DESC;
*/

-- Query 7: Get top memories for summary generation
-- USAGE: Input to AI summary generation
/*
SELECT 
  id,
  timestamp,
  content,
  memory_type,
  happiness_score,
  neurochemicals,
  significance_rating
FROM long_term_memory
WHERE user_id = 'USER_ID_HERE'
  AND profile_id = 'PROFILE_ID_HERE'
  AND timestamp BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY significance_rating DESC, happiness_score DESC
LIMIT 100;
*/

-- Query 8: Search timeline by keyword
-- USAGE: User searches for specific events
/*
SELECT 
  id,
  timestamp,
  content,
  memory_type,
  happiness_score
FROM long_term_memory
WHERE user_id = 'USER_ID_HERE'
  AND profile_id = 'PROFILE_ID_HERE'
  AND to_tsvector('english', content) @@ plainto_tsquery('english', 'SEARCH_TERM_HERE')
ORDER BY timestamp DESC
LIMIT 20;
*/

-- Query 9: Get closest memory to a date (when exact date has no memories)
-- USAGE: "No memories on this date, showing closest..."
/*
(
  SELECT 
    id,
    timestamp,
    content,
    ABS(EXTRACT(EPOCH FROM (timestamp - '2024-01-01 00:00:00'))) as seconds_diff,
    'before' as direction
  FROM long_term_memory
  WHERE user_id = 'USER_ID_HERE'
    AND profile_id = 'PROFILE_ID_HERE'
    AND timestamp < '2024-01-01'
  ORDER BY timestamp DESC
  LIMIT 1
)
UNION ALL
(
  SELECT 
    id,
    timestamp,
    content,
    ABS(EXTRACT(EPOCH FROM (timestamp - '2024-01-01 00:00:00'))) as seconds_diff,
    'after' as direction
  FROM long_term_memory
  WHERE user_id = 'USER_ID_HERE'
    AND profile_id = 'PROFILE_ID_HERE'
    AND timestamp > '2024-01-01'
  ORDER BY timestamp ASC
  LIMIT 1
)
ORDER BY seconds_diff ASC;
*/

-- Query 10: Timeline statistics for dashboard
-- USAGE: Show overall timeline health
/*
SELECT 
  COUNT(*) as total_memories,
  MIN(timestamp) as first_memory,
  MAX(timestamp) as last_memory,
  AVG(happiness_score) as avg_happiness,
  COUNT(DISTINCT DATE_TRUNC('month', timestamp)) as months_with_memories,
  COUNT(DISTINCT DATE_TRUNC('year', timestamp)) as years_with_memories
FROM long_term_memory
WHERE user_id = 'USER_ID_HERE'
  AND profile_id = 'PROFILE_ID_HERE';
*/

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_timeline_summaries_updated_at
  BEFORE UPDATE ON timeline_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cultural_context_updated_at
  BEFORE UPDATE ON cultural_context
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES (Run after setup)
-- ============================================================================

-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('timeline_summaries', 'cultural_context', 'memory_triggers')
ORDER BY table_name;

-- Verify indexes
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('timeline_summaries', 'cultural_context', 'memory_triggers')
ORDER BY tablename, indexname;

-- Verify sample data
SELECT 
  year,
  category,
  COUNT(*) as count
FROM cultural_context
GROUP BY year, category
ORDER BY year, category;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Timeline Console database schema setup complete!';
  RAISE NOTICE 'Tables created: timeline_summaries, cultural_context, memory_triggers';
  RAISE NOTICE 'Sample data inserted for 2018';
  RAISE NOTICE 'Ready for implementation!';
END $$;
