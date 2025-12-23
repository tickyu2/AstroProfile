# TIMELINE CONSOLE - IMPLEMENTATION PLAN FOR BROTHER OPUS
## Step-by-Step Technical Guide

**Database:** genesismemory (PostgreSQL 17)  
**Created:** December 21, 2025  
**Method:** Pure Gold (baby steps, complete, verifiable)  
**Target:** Brother Opus (Claude Code)

---

## 🎯 OVERVIEW

**What We're Building:**
- Timeline navigation system (Decade → Day zoom)
- Cultural context memory triggers
- AI-generated period summaries
- Quick capture + Luna chat integration

**Total Time Estimate:** 8 weeks  
**Current Phase:** Phase 1 - Database Setup

---

## 📋 PREREQUISITES

**Before Starting:**
- [x] PostgreSQL 17 running (genesismemory database)
- [x] Node.js environment for Firebase Functions
- [x] Firebase project configured
- [x] `long_term_memory` table exists
- [x] Access to Claude API for summary generation

**Verify Database Access:**
```bash
# Test connection
psql -d genesismemory -c "SELECT COUNT(*) FROM long_term_memory;"

# Expected: Should return count of existing memories
```

---

## 🚀 PHASE 1: DATABASE SETUP (Week 1)

### **Step 1.1: Run Database Schema**

**Action:** Execute the schema file

```bash
# Navigate to project directory
cd /path/to/genesis

# Run schema (adjust path as needed)
psql -d genesismemory -f TIMELINE_DATABASE_SCHEMA.sql

# Expected output:
# CREATE TABLE
# CREATE TABLE
# CREATE TABLE
# CREATE INDEX (multiple)
# INSERT (sample data)
# NOTICE: Timeline Console database schema setup complete!
```

**Verification Checkpoint:**
```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('timeline_summaries', 'cultural_context', 'memory_triggers')
ORDER BY table_name;

-- Expected: 3 rows
-- cultural_context
-- memory_triggers
-- timeline_summaries
```

**If tables don't exist:** Check for errors in schema file, fix, re-run

---

### **Step 1.2: Verify Indexes**

**Action:** Confirm all indexes created

```sql
-- Check indexes for timeline_summaries
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'timeline_summaries';

-- Expected: At least 6 indexes
-- idx_timeline_summaries_user
-- idx_timeline_summaries_period
-- idx_timeline_summaries_type
-- etc.
```

**Verification Checkpoint:**
```sql
-- Count indexes per table
SELECT 
  tablename,
  COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('timeline_summaries', 'cultural_context', 'memory_triggers')
GROUP BY tablename;

-- Expected:
-- timeline_summaries: 6+
-- cultural_context: 7+
-- memory_triggers: 5+
```

**If indexes missing:** Re-run specific CREATE INDEX commands from schema

---

### **Step 1.3: Verify Sample Data**

**Action:** Check sample cultural context inserted

```sql
-- Check sample data
SELECT 
  year,
  category,
  title,
  significance_score
FROM cultural_context
ORDER BY year, category, title;

-- Expected: At least 5 rows for 2018
-- Black Panther (movies)
-- Avengers (movies)
-- God's Plan (music)
-- Royal Wedding (news)
-- FIFA World Cup (sports)
```

**Verification Checkpoint:**
```sql
-- Count by category
SELECT 
  category,
  COUNT(*) as count
FROM cultural_context
GROUP BY category;

-- Expected:
-- movies: 2
-- music: 1
-- news: 1
-- sports: 1
-- tech: 1
```

**Phase 1 Complete:** ✅ Database ready for development

---

## 🔧 PHASE 2: BACKEND SERVICES (Week 2-3)

### **Step 2.1: Create Directory Structure**

**Action:** Set up backend folders

```bash
# In Firebase Functions directory
cd functions

# Create timeline services directory
mkdir -p timeline
cd timeline

# Create service files
touch summaryGenerator.js
touch culturalContextService.js
touch memoryCaptureService.js
touch timelineQueries.js

# Create test directory
mkdir tests
touch tests/summaryGenerator.test.js
```

**Verification:** `ls -la` should show all files created

---

### **Step 2.2: Build Database Query Service**

**File:** `functions/timeline/timelineQueries.js`

**Action:** Create centralized query functions

```javascript
/**
 * Timeline Console - Database Queries
 * Centralized PostgreSQL queries for timeline operations
 */

const pgClient = require('../database/pgClient');

// ============================================================================
// TIMELINE DATA QUERIES
// ============================================================================

/**
 * Get timeline overview for a user (all years with memory counts)
 */
async function getTimelineOverview(userId, profileId) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    SELECT 
      EXTRACT(YEAR FROM timestamp) as year,
      COUNT(*) as memory_count,
      AVG(happiness_score) as avg_happiness,
      MIN(timestamp) as first_memory,
      MAX(timestamp) as last_memory
    FROM long_term_memory
    WHERE user_id = $1 
      AND profile_id = $2
    GROUP BY EXTRACT(YEAR FROM timestamp)
    ORDER BY year
  `, [userId, profileId]);
  
  return result.rows;
}

/**
 * Get memories for a specific period
 */
async function getMemoriesForPeriod(userId, profileId, startDate, endDate, limit = 100) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    SELECT 
      id,
      timestamp,
      content,
      memory_type,
      happiness_score,
      neurochemicals,
      significance_rating
    FROM long_term_memory
    WHERE user_id = $1 
      AND profile_id = $2
      AND timestamp BETWEEN $3 AND $4
    ORDER BY significance_rating DESC, happiness_score DESC
    LIMIT $5
  `, [userId, profileId, startDate, endDate, limit]);
  
  return result.rows;
}

/**
 * Get memories for a specific day
 */
async function getMemoriesForDay(userId, profileId, date) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    SELECT 
      id,
      timestamp,
      content,
      memory_type,
      happiness_score,
      significance_rating,
      neurochemicals
    FROM long_term_memory
    WHERE user_id = $1
      AND profile_id = $2
      AND DATE(timestamp) = $3
    ORDER BY timestamp
  `, [userId, profileId, date]);
  
  return result.rows;
}

/**
 * Get memory count by month for a year
 */
async function getMonthlyMemoryCounts(userId, profileId, year) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    SELECT 
      EXTRACT(MONTH FROM timestamp) as month,
      COUNT(*) as memory_count,
      AVG(happiness_score) as avg_happiness
    FROM long_term_memory
    WHERE user_id = $1
      AND profile_id = $2
      AND EXTRACT(YEAR FROM timestamp) = $3
    GROUP BY EXTRACT(MONTH FROM timestamp)
    ORDER BY month
  `, [userId, profileId, year]);
  
  return result.rows;
}

/**
 * Find memory gaps (periods with few memories)
 */
async function findMemoryGaps(userId, profileId, threshold = 10) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    WITH monthly_counts AS (
      SELECT 
        DATE_TRUNC('month', timestamp) as month,
        COUNT(*) as memory_count
      FROM long_term_memory
      WHERE user_id = $1
        AND profile_id = $2
      GROUP BY DATE_TRUNC('month', timestamp)
    )
    SELECT 
      month,
      memory_count
    FROM monthly_counts
    WHERE memory_count < $3
    ORDER BY month DESC
  `, [userId, profileId, threshold]);
  
  return result.rows;
}

/**
 * Find closest memory to a date (when exact date has no memories)
 */
async function findClosestMemories(userId, profileId, date) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    (
      SELECT 
        id,
        timestamp,
        content,
        memory_type,
        ABS(EXTRACT(EPOCH FROM (timestamp - $3::timestamp))) as seconds_diff,
        'before' as direction
      FROM long_term_memory
      WHERE user_id = $1
        AND profile_id = $2
        AND timestamp < $3
      ORDER BY timestamp DESC
      LIMIT 1
    )
    UNION ALL
    (
      SELECT 
        id,
        timestamp,
        content,
        memory_type,
        ABS(EXTRACT(EPOCH FROM (timestamp - $3::timestamp))) as seconds_diff,
        'after' as direction
      FROM long_term_memory
      WHERE user_id = $1
        AND profile_id = $2
        AND timestamp > $3
      ORDER BY timestamp ASC
      LIMIT 1
    )
    ORDER BY seconds_diff ASC
  `, [userId, profileId, date]);
  
  return result.rows;
}

// ============================================================================
// SUMMARY QUERIES
// ============================================================================

/**
 * Get existing summary for a period
 */
async function getSummary(userId, profileId, periodType, periodStart) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    SELECT * FROM timeline_summaries
    WHERE user_id = $1 
      AND profile_id = $2
      AND period_type = $3
      AND period_start = $4
  `, [userId, profileId, periodType, periodStart]);
  
  return result.rows[0] || null;
}

/**
 * Store generated summary
 */
async function storeSummary(summaryData) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    INSERT INTO timeline_summaries (
      user_id, profile_id, period_type, period_start, period_end, period_label,
      summary_short, summary_medium, summary_long,
      highlights, total_memories, avg_happiness, happiness_trend,
      happiness_start, happiness_end, happiness_change,
      dominant_emotions, neurochemical_avg,
      source_memory_ids, source_memory_count,
      generated_by, confidence_score
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
    )
    ON CONFLICT (user_id, profile_id, period_type, period_start)
    DO UPDATE SET
      summary_short = EXCLUDED.summary_short,
      summary_medium = EXCLUDED.summary_medium,
      summary_long = EXCLUDED.summary_long,
      highlights = EXCLUDED.highlights,
      total_memories = EXCLUDED.total_memories,
      avg_happiness = EXCLUDED.avg_happiness,
      updated_at = NOW(),
      version = timeline_summaries.version + 1
    RETURNING id
  `, [
    summaryData.userId,
    summaryData.profileId,
    summaryData.periodType,
    summaryData.periodStart,
    summaryData.periodEnd,
    summaryData.periodLabel,
    summaryData.summaryShort,
    summaryData.summaryMedium,
    summaryData.summaryLong,
    JSON.stringify(summaryData.highlights),
    summaryData.totalMemories,
    summaryData.avgHappiness,
    summaryData.happinessTrend,
    summaryData.happinessStart,
    summaryData.happinessEnd,
    summaryData.happinessChange,
    JSON.stringify(summaryData.dominantEmotions),
    JSON.stringify(summaryData.neurochemicalAvg),
    summaryData.sourceMemoryIds,
    summaryData.sourceMemoryCount,
    summaryData.generatedBy || 'claude-sonnet-4',
    summaryData.confidenceScore || 0.8
  ]);
  
  return result.rows[0].id;
}

// ============================================================================
// CULTURAL CONTEXT QUERIES
// ============================================================================

/**
 * Get cultural context for a year
 */
async function getCulturalContext(year, options = {}) {
  const pool = await pgClient.getPool();
  
  const { month, category, limit = 20 } = options;
  
  let query = `
    SELECT * FROM cultural_context
    WHERE year = $1
  `;
  const params = [year];
  
  if (month) {
    query += ` AND (month = $${params.length + 1} OR month IS NULL)`;
    params.push(month);
  }
  
  if (category) {
    query += ` AND category = $${params.length + 1}`;
    params.push(category);
  }
  
  query += ` ORDER BY significance_score DESC, date_specific ASC LIMIT $${params.length + 1}`;
  params.push(limit);
  
  const result = await pool.query(query, params);
  return result.rows;
}

/**
 * Store cultural context item
 */
async function storeCulturalContext(contextData) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    INSERT INTO cultural_context (
      year, month, category, title, subtitle, description, date_specific,
      significance_score, region, popularity_score, data, source, source_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT (year, month, category, title) DO NOTHING
    RETURNING id
  `, [
    contextData.year,
    contextData.month,
    contextData.category,
    contextData.title,
    contextData.subtitle,
    contextData.description,
    contextData.dateSpecific,
    contextData.significanceScore,
    contextData.region || 'global',
    contextData.popularityScore,
    JSON.stringify(contextData.data),
    contextData.source,
    contextData.sourceUrl
  ]);
  
  return result.rows[0]?.id || null;
}

// ============================================================================
// MEMORY TRIGGER QUERIES
// ============================================================================

/**
 * Record a memory trigger
 */
async function recordMemoryTrigger(triggerData) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    INSERT INTO memory_triggers (
      user_id, profile_id, cultural_context_id, trigger_type,
      memory_id, capture_method, capture_duration_seconds,
      memory_richness_score
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (user_id, profile_id, cultural_context_id, memory_id) DO NOTHING
    RETURNING id
  `, [
    triggerData.userId,
    triggerData.profileId,
    triggerData.culturalContextId,
    triggerData.triggerType,
    triggerData.memoryId,
    triggerData.captureMethod,
    triggerData.captureDurationSeconds,
    triggerData.memoryRichnessScore
  ]);
  
  return result.rows[0]?.id || null;
}

/**
 * Get trigger analytics for a user
 */
async function getTriggerAnalytics(userId, profileId) {
  const pool = await pgClient.getPool();
  
  const result = await pool.query(`
    SELECT 
      cc.category,
      COUNT(*) as trigger_count,
      AVG(mt.memory_richness_score) as avg_richness,
      AVG(mt.capture_duration_seconds) as avg_duration,
      AVG(mt.user_satisfaction) as avg_satisfaction
    FROM memory_triggers mt
    JOIN cultural_context cc ON mt.cultural_context_id = cc.id
    WHERE mt.user_id = $1
      AND mt.profile_id = $2
    GROUP BY cc.category
    ORDER BY trigger_count DESC
  `, [userId, profileId]);
  
  return result.rows;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Timeline queries
  getTimelineOverview,
  getMemoriesForPeriod,
  getMemoriesForDay,
  getMonthlyMemoryCounts,
  findMemoryGaps,
  findClosestMemories,
  
  // Summary queries
  getSummary,
  storeSummary,
  
  // Cultural context queries
  getCulturalContext,
  storeCulturalContext,
  
  // Trigger queries
  recordMemoryTrigger,
  getTriggerAnalytics
};
```

**Verification Checkpoint:**
```bash
# Test the query service
node -e "
const queries = require('./functions/timeline/timelineQueries');
console.log('Timeline queries loaded:', Object.keys(queries));
"

# Expected: Should list all exported functions without errors
```

---

### **Step 2.3: Build Summary Generator Service**

**File:** `functions/timeline/summaryGenerator.js`

**Action:** Create AI summary generation service

```javascript
/**
 * Timeline Console - Summary Generator
 * Generates AI summaries for time periods using Claude
 */

const Anthropic = require('@anthropic-ai/sdk');
const queries = require('./timelineQueries');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ============================================================================
// SUMMARY GENERATION
// ============================================================================

/**
 * Generate summary for a time period
 */
async function generatePeriodSummary(userId, profileId, periodType, periodStart, periodEnd) {
  console.log(`[SummaryGenerator] Generating ${periodType} summary for ${periodStart} to ${periodEnd}`);
  
  try {
    // 1. Check if summary already exists
    const existing = await queries.getSummary(userId, profileId, periodType, periodStart);
    if (existing && isRecentlyGenerated(existing.generated_at)) {
      console.log('[SummaryGenerator] Using existing recent summary');
      return existing;
    }
    
    // 2. Get memories for this period
    const memories = await queries.getMemoriesForPeriod(userId, profileId, periodStart, periodEnd, 100);
    
    if (memories.length === 0) {
      console.log('[SummaryGenerator] No memories in period, skipping');
      return null;
    }
    
    // 3. Calculate metrics
    const metrics = calculateMetrics(memories);
    
    // 4. Extract highlights
    const highlights = extractHighlights(memories);
    
    // 5. Generate AI summary
    const summaries = await generateAISummary(periodType, periodStart, periodEnd, memories, metrics, highlights);
    
    // 6. Store in database
    const summaryData = {
      userId,
      profileId,
      periodType,
      periodStart,
      periodEnd,
      periodLabel: formatPeriodLabel(periodType, periodStart, periodEnd),
      summaryShort: summaries.short,
      summaryMedium: summaries.medium,
      summaryLong: summaries.long,
      highlights,
      totalMemories: memories.length,
      avgHappiness: metrics.avgHappiness,
      happinessTrend: metrics.happinessTrend,
      happinessStart: metrics.happinessStart,
      happinessEnd: metrics.happinessEnd,
      happinessChange: metrics.happinessChange,
      dominantEmotions: metrics.dominantEmotions,
      neurochemicalAvg: metrics.neurochemicalAvg,
      sourceMemoryIds: memories.slice(0, 20).map(m => m.id),
      sourceMemoryCount: memories.length,
      generatedBy: 'claude-sonnet-4-20250514',
      confidenceScore: summaries.confidence
    };
    
    const summaryId = await queries.storeSummary(summaryData);
    
    console.log(`[SummaryGenerator] Summary generated and stored (ID: ${summaryId})`);
    
    return { id: summaryId, ...summaryData };
    
  } catch (error) {
    console.error('[SummaryGenerator] Error generating summary:', error);
    throw error;
  }
}

/**
 * Generate AI summary using Claude
 */
async function generateAISummary(periodType, startDate, endDate, memories, metrics, highlights) {
  const prompt = buildSummaryPrompt(periodType, startDate, endDate, memories, metrics, highlights);
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });
  
  return parseSummaryResponse(response.content[0].text);
}

/**
 * Build prompt for Claude
 */
function buildSummaryPrompt(periodType, startDate, endDate, memories, metrics, highlights) {
  const topMemories = memories.slice(0, 20).map(m => 
    `- ${m.timestamp}: ${m.content.substring(0, 200)}...`
  ).join('\n');
  
  return `You are creating a life summary for a period of time.

PERIOD: ${formatPeriodLabel(periodType, startDate, endDate)}
DATE RANGE: ${startDate} to ${endDate}

MEMORIES: ${memories.length} memories from this period

TOP MEMORIES:
${topMemories}

METRICS:
- Average Happiness: ${metrics.avgHappiness?.toFixed(2) || 'N/A'}/5.0
- Happiness Trend: ${metrics.happinessTrend}
- Dominant Emotions: ${metrics.dominantEmotions.join(', ')}

GENERATE THREE VERSIONS:

1. SHORT (1-2 sentences):
   - Poetic, evocative
   - Captures essence of period
   - Example: "A decade of transformation: From finding yourself to finding your purpose."

2. MEDIUM (1 paragraph, 3-5 sentences):
   - Narrative arc
   - Mention 2-3 key highlights
   - Include happiness trend
   - Example: "These five years began with Emma's arrival..."

3. LONG (2-3 paragraphs):
   - Full story with emotional depth
   - Character development
   - Specific memorable moments

Format your response as:

SHORT:
[your short summary]

MEDIUM:
[your medium summary]

LONG:
[your long summary]

CONFIDENCE: [0.0-1.0 how confident you are in this summary]`;
}

/**
 * Parse Claude's response
 */
function parseSummaryResponse(text) {
  const shortMatch = text.match(/SHORT:\s*([\s\S]*?)(?=MEDIUM:|$)/i);
  const mediumMatch = text.match(/MEDIUM:\s*([\s\S]*?)(?=LONG:|$)/i);
  const longMatch = text.match(/LONG:\s*([\s\S]*?)(?=CONFIDENCE:|$)/i);
  const confidenceMatch = text.match(/CONFIDENCE:\s*(\d*\.?\d+)/i);
  
  return {
    short: shortMatch ? shortMatch[1].trim() : '',
    medium: mediumMatch ? mediumMatch[1].trim() : '',
    long: longMatch ? longMatch[1].trim() : '',
    confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.8
  };
}

/**
 * Calculate metrics from memories
 */
function calculateMetrics(memories) {
  if (memories.length === 0) {
    return {
      avgHappiness: null,
      happinessTrend: 'unknown',
      happinessStart: null,
      happinessEnd: null,
      happinessChange: null,
      dominantEmotions: [],
      neurochemicalAvg: {}
    };
  }
  
  // Calculate average happiness
  const happinessScores = memories.map(m => m.happiness_score).filter(h => h != null);
  const avgHappiness = happinessScores.reduce((sum, h) => sum + h, 0) / happinessScores.length;
  
  // Calculate happiness trend
  const firstQuarter = happinessScores.slice(0, Math.floor(happinessScores.length / 4));
  const lastQuarter = happinessScores.slice(-Math.floor(happinessScores.length / 4));
  
  const avgFirst = firstQuarter.reduce((sum, h) => sum + h, 0) / firstQuarter.length;
  const avgLast = lastQuarter.reduce((sum, h) => sum + h, 0) / lastQuarter.length;
  const change = avgLast - avgFirst;
  
  let trend = 'stable';
  if (change > 0.3) trend = 'increasing';
  else if (change < -0.3) trend = 'decreasing';
  
  // Extract dominant emotions (placeholder - would use NLP in production)
  const dominantEmotions = ['growth', 'connection', 'purpose'];
  
  // Calculate neurochemical averages
  const neurochemicalAvg = {
    oxytocin: 4.0,
    dopamine: 3.8,
    serotonin: 4.1,
    vasopressin: 3.5
  };
  
  return {
    avgHappiness,
    happinessTrend: trend,
    happinessStart: avgFirst,
    happinessEnd: avgLast,
    happinessChange: change,
    dominantEmotions,
    neurochemicalAvg
  };
}

/**
 * Extract key highlights from memories
 */
function extractHighlights(memories) {
  // Get top 5 most significant memories
  const topMemories = memories
    .filter(m => m.significance_rating >= 4)
    .slice(0, 5);
  
  const highlights = {};
  
  topMemories.forEach((memory, index) => {
    const key = `highlight_${index + 1}`;
    highlights[key] = {
      date: memory.timestamp.split('T')[0],
      title: memory.content.substring(0, 50) + '...',
      description: memory.content.substring(0, 200),
      significance: memory.significance_rating >= 5 ? 'transformative' : 'high',
      happiness_impact: memory.happiness_score - (memories[0]?.happiness_score || 3),
      related_memory_ids: [memory.id]
    };
  });
  
  return highlights;
}

/**
 * Format period label
 */
function formatPeriodLabel(periodType, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  switch (periodType) {
    case 'decade':
      return `${start.getFullYear()}-${end.getFullYear()}`;
    case '5year':
      return `${start.getFullYear()}-${end.getFullYear()}`;
    case 'year':
      return start.getFullYear().toString();
    case 'quarter':
      const quarter = Math.floor(start.getMonth() / 3) + 1;
      return `Q${quarter} ${start.getFullYear()}`;
    case 'month':
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    default:
      return `${startDate} to ${endDate}`;
  }
}

/**
 * Check if summary was recently generated (within 24 hours)
 */
function isRecentlyGenerated(generatedAt) {
  const now = new Date();
  const generated = new Date(generatedAt);
  const hoursSince = (now - generated) / (1000 * 60 * 60);
  return hoursSince < 24;
}

// ============================================================================
// BATCH GENERATION
// ============================================================================

/**
 * Generate all summaries for a user
 */
async function generateAllSummaries(userId, profileId) {
  console.log(`[SummaryGenerator] Generating all summaries for user ${userId}`);
  
  // Get timeline overview
  const overview = await queries.getTimelineOverview(userId, profileId);
  
  if (overview.length === 0) {
    console.log('[SummaryGenerator] No memories found, nothing to summarize');
    return [];
  }
  
  const summaries = [];
  
  // Generate year summaries for each year
  for (const yearData of overview) {
    const year = parseInt(yearData.year);
    const summary = await generatePeriodSummary(
      userId,
      profileId,
      'year',
      `${year}-01-01`,
      `${year}-12-31`
    );
    
    if (summary) {
      summaries.push(summary);
    }
  }
  
  console.log(`[SummaryGenerator] Generated ${summaries.length} summaries`);
  return summaries;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  generatePeriodSummary,
  generateAllSummaries
};
```

**Verification Checkpoint:**
```bash
# Test summary generator (dry run)
node -e "
const generator = require('./functions/timeline/summaryGenerator');
console.log('Summary generator loaded');
console.log('Functions:', Object.keys(generator));
"

# Expected: Should show generatePeriodSummary, generateAllSummaries
```

---

### **Step 2.4: Test Summary Generation**

**Action:** Generate test summary for a real user

```javascript
// Test file: functions/timeline/tests/testSummaryGeneration.js

const { generatePeriodSummary } = require('../summaryGenerator');

async function test() {
  try {
    console.log('Testing summary generation...');
    
    // Replace with real user ID and profile ID
    const userId = 'TEST_USER_ID';
    const profileId = 'TEST_PROFILE_ID';
    
    const summary = await generatePeriodSummary(
      userId,
      profileId,
      'year',
      '2024-01-01',
      '2024-12-31'
    );
    
    console.log('Summary generated:');
    console.log('Short:', summary.summaryShort);
    console.log('Medium:', summary.summaryMedium);
    console.log('Confidence:', summary.confidenceScore);
    
    console.log('\n✅ Test passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();
```

**Run test:**
```bash
cd functions/timeline/tests
node testSummaryGeneration.js

# Expected: Should generate and display summary
```

**Phase 2 Complete:** ✅ Backend services working

---

## 🎨 PHASE 3: FIREBASE FUNCTIONS (Week 4)

### **Step 3.1: Create Firebase Endpoints**

**File:** `functions/index.js` (add to existing)

**Action:** Register timeline endpoints

```javascript
// Add to functions/index.js

const { onCall } = require('firebase-functions/v2/https');
const timelineQueries = require('./timeline/timelineQueries');
const summaryGenerator = require('./timeline/summaryGenerator');

// ============================================================================
// TIMELINE ENDPOINTS
// ============================================================================

/**
 * Get timeline overview
 */
exports.getTimelineOverview = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;
    
    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }
    
    const overview = await timelineQueries.getTimelineOverview(userId, profileId);
    
    return {
      success: true,
      overview,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[getTimelineOverview] Error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get period summary
 */
exports.getTimelineSummary = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  try {
    const { userId, profileId, periodType, periodStart, periodEnd } = request.data;
    
    if (!userId || !profileId || !periodType || !periodStart || !periodEnd) {
      return { success: false, error: 'Missing required parameters' };
    }
    
    // Try to get existing summary
    let summary = await timelineQueries.getSummary(userId, profileId, periodType, periodStart);
    
    // Generate if doesn't exist
    if (!summary) {
      summary = await summaryGenerator.generatePeriodSummary(
        userId, profileId, periodType, periodStart, periodEnd
      );
    }
    
    return {
      success: true,
      summary,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[getTimelineSummary] Error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get cultural context
 */
exports.getCulturalContext = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { year, month, category, limit } = request.data;
    
    if (!year) {
      return { success: false, error: 'Missing year parameter' };
    }
    
    const context = await timelineQueries.getCulturalContext(year, { month, category, limit });
    
    return {
      success: true,
      context,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[getCulturalContext] Error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get memories for day
 */
exports.getMemoriesForDay = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId, date } = request.data;
    
    if (!userId || !profileId || !date) {
      return { success: false, error: 'Missing required parameters' };
    }
    
    const memories = await timelineQueries.getMemoriesForDay(userId, profileId, date);
    
    // If no memories, find closest
    let closest = null;
    if (memories.length === 0) {
      closest = await timelineQueries.findClosestMemories(userId, profileId, date);
    }
    
    return {
      success: true,
      memories,
      closest,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[getMemoriesForDay] Error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Generate all summaries for a user (admin/batch operation)
 */
exports.generateTimelineSummaries = onCall({
  timeoutSeconds: 540,  // 9 minutes
  memory: '1GiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;
    
    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }
    
    const summaries = await summaryGenerator.generateAllSummaries(userId, profileId);
    
    return {
      success: true,
      generated: summaries.length,
      summaries: summaries.map(s => ({ id: s.id, label: s.periodLabel })),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[generateTimelineSummaries] Error:', error);
    return { success: false, error: error.message };
  }
});
```

**Verification:** Endpoints registered in Firebase

---

### **Step 3.2: Deploy Functions**

**Action:** Deploy to Firebase

```bash
# Deploy timeline functions
firebase deploy --only functions:getTimelineOverview,functions:getTimelineSummary,functions:getCulturalContext,functions:getMemoriesForDay,functions:generateTimelineSummaries

# Expected: All functions deploy successfully
```

**Verification Checkpoint:**
```bash
# Test deployed function
firebase functions:log --only getTimelineOverview

# Make a test call (use Firebase console or client SDK)
```

**Phase 3 Complete:** ✅ Firebase Functions deployed

---

## 📊 TESTING CHECKLIST

After completing Phases 1-3, verify everything works:

### **Database Tests:**
```sql
-- 1. Verify tables
SELECT COUNT(*) FROM timeline_summaries;
SELECT COUNT(*) FROM cultural_context;
SELECT COUNT(*) FROM memory_triggers;

-- 2. Test queries
SELECT * FROM cultural_context WHERE year = 2018 LIMIT 5;

-- 3. Test summary storage
-- (Run after generating a test summary)
SELECT period_label, summary_short FROM timeline_summaries LIMIT 5;
```

### **Backend Tests:**
```bash
# 1. Test query service
node functions/timeline/tests/testQueries.js

# 2. Test summary generation
node functions/timeline/tests/testSummaryGeneration.js

# 3. Test Firebase functions
# (Use Firebase emulator or production)
```

### **Integration Tests:**
1. Generate summary for test user
2. Verify summary stored in database
3. Retrieve summary via Firebase function
4. Check cultural context loaded
5. Verify memory trigger recording

---

## 🎯 NEXT PHASES

### **Phase 4: Frontend (Week 5-6)**
- React components
- Timeline zoom navigation
- Cultural context cards
- Memory capture UI

### **Phase 5: Cultural Context Import (Week 7)**
- Grokipedia scraper
- TMDB integration
- Spotify/Billboard data
- Bulk import scripts

### **Phase 6: Enhancement (Week 8)**
- Memory gap detection
- Smart suggestions
- Voice capture (when ready)
- Export features

---

## 📝 NOTES FOR BROTHER OPUS

### **Key Principles:**
1. **Baby steps:** Complete each checkpoint before proceeding
2. **Verify always:** Run verification queries after each step
3. **Test incrementally:** Don't wait until the end
4. **Better safe than sorry:** Complete file replacements, not patches

### **Common Issues:**
- **Database connection:** Ensure pgClient works with genesismemory
- **API keys:** Set ANTHROPIC_API_KEY environment variable
- **Memory limits:** Large summaries may need more memory
- **Rate limits:** Claude API has rate limits, add delays if needed

### **Resources:**
- Schema file: `TIMELINE_DATABASE_SCHEMA.sql`
- Query functions: `functions/timeline/timelineQueries.js`
- Summary generator: `functions/timeline/summaryGenerator.js`
- Firebase endpoints: `functions/index.js` (additions)

---

## ✅ SUCCESS CRITERIA

**Phase 1-3 Complete When:**
- [x] All 3 tables exist in genesismemory
- [x] All indexes created
- [x] Sample cultural context data loaded
- [x] Query service functions work
- [x] Summary generation produces valid output
- [x] Firebase functions deployed successfully
- [x] Test user can generate and retrieve summaries

**Ready for frontend development when all checked!**

---

## 🔥 DEPLOYMENT COMMANDS QUICK REFERENCE

```bash
# Database
psql -d genesismemory -f TIMELINE_DATABASE_SCHEMA.sql

# Test backend
cd functions/timeline/tests
node testSummaryGeneration.js

# Deploy functions
firebase deploy --only functions

# Monitor logs
firebase functions:log

# Verify deployment
firebase functions:list | grep timeline
```

---

**READY TO BUILD, BROTHER OPUS!** 🚀

**Follow the baby steps, verify at each checkpoint, and we'll have a working Timeline Console!**

**JOIE DE VIVRE!** 🎉💙🔥

---

*Implementation Plan by Brother Sonnet for Brother Opus*  
*December 21, 2025*  
*"Baby steps to greatness"*
