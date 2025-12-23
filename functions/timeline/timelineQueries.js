/**
 * ============================================================================
 * TIMELINE CONSOLE - DATABASE QUERIES
 * ============================================================================
 * Centralized PostgreSQL queries for timeline operations
 *
 * Provides:
 * - Timeline overview and navigation queries
 * - Period summary storage and retrieval
 * - Cultural context management
 * - Memory trigger tracking
 *
 * Created: December 21, 2025
 * Mission: JOIE DE VIVRE
 */

const pgClient = require('../database/pgClient');

// ============================================================================
// TIMELINE DATA QUERIES
// ============================================================================

/**
 * Get timeline overview for a user (all years with memory counts)
 * Used for the decade/year navigation view
 */
async function getTimelineOverview(userId, profileId) {
  const pool = pgClient.getPool();

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
 * Used for generating summaries and detail views
 */
async function getMemoriesForPeriod(userId, profileId, startDate, endDate, limit = 100) {
  const pool = pgClient.getPool();

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
 * Used for day-level detail view
 */
async function getMemoriesForDay(userId, profileId, date) {
  const pool = pgClient.getPool();

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
 * Used for year-level heatmap visualization
 */
async function getMonthlyMemoryCounts(userId, profileId, year) {
  const pool = pgClient.getPool();

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
 * Used for suggesting exploration opportunities
 */
async function findMemoryGaps(userId, profileId, threshold = 10) {
  const pool = pgClient.getPool();

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
 * Used for "no memories on this date, showing closest..."
 */
async function findClosestMemories(userId, profileId, date) {
  const pool = pgClient.getPool();

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

/**
 * Get timeline statistics for dashboard
 * Overall timeline health metrics
 */
async function getTimelineStats(userId, profileId) {
  const pool = pgClient.getPool();

  const result = await pool.query(`
    SELECT
      COUNT(*) as total_memories,
      MIN(timestamp) as first_memory,
      MAX(timestamp) as last_memory,
      AVG(happiness_score) as avg_happiness,
      COUNT(DISTINCT DATE_TRUNC('month', timestamp)) as months_with_memories,
      COUNT(DISTINCT DATE_TRUNC('year', timestamp)) as years_with_memories
    FROM long_term_memory
    WHERE user_id = $1
      AND profile_id = $2
  `, [userId, profileId]);

  return result.rows[0];
}

/**
 * Search timeline by keyword (full-text search)
 * Used for timeline search feature
 */
async function searchTimelineByKeyword(userId, profileId, searchTerm, limit = 20) {
  const pool = pgClient.getPool();

  const result = await pool.query(`
    SELECT
      id,
      timestamp,
      content,
      memory_type,
      happiness_score
    FROM long_term_memory
    WHERE user_id = $1
      AND profile_id = $2
      AND to_tsvector('english', content) @@ plainto_tsquery('english', $3)
    ORDER BY timestamp DESC
    LIMIT $4
  `, [userId, profileId, searchTerm, limit]);

  return result.rows;
}

// ============================================================================
// SUMMARY QUERIES
// ============================================================================

/**
 * Get existing summary for a period
 */
async function getSummary(userId, profileId, periodType, periodStart) {
  const pool = pgClient.getPool();

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
 * Get all summaries for a user (for timeline navigation)
 */
async function getAllSummaries(userId, profileId, periodType = null) {
  const pool = pgClient.getPool();

  let query = `
    SELECT
      id, period_type, period_start, period_end, period_label,
      summary_short, total_memories, avg_happiness, happiness_trend,
      dominant_emotions, generated_at, confidence_score
    FROM timeline_summaries
    WHERE user_id = $1
      AND profile_id = $2
  `;
  const params = [userId, profileId];

  if (periodType) {
    query += ` AND period_type = $3`;
    params.push(periodType);
  }

  query += ` ORDER BY period_start DESC`;

  const result = await pool.query(query, params);
  return result.rows;
}

/**
 * Store generated summary
 */
async function storeSummary(summaryData) {
  const pool = pgClient.getPool();

  const result = await pool.query(`
    INSERT INTO timeline_summaries (
      user_id, profile_id, period_type, period_start, period_end, period_label,
      summary_short, summary_medium, summary_long,
      highlights, total_memories, memory_breakdown, avg_happiness, happiness_trend,
      happiness_start, happiness_end, happiness_change,
      dominant_emotions, neurochemical_avg,
      source_memory_ids, source_memory_count,
      generated_by, confidence_score
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
    )
    ON CONFLICT (user_id, profile_id, period_type, period_start)
    DO UPDATE SET
      summary_short = EXCLUDED.summary_short,
      summary_medium = EXCLUDED.summary_medium,
      summary_long = EXCLUDED.summary_long,
      highlights = EXCLUDED.highlights,
      total_memories = EXCLUDED.total_memories,
      memory_breakdown = EXCLUDED.memory_breakdown,
      avg_happiness = EXCLUDED.avg_happiness,
      happiness_trend = EXCLUDED.happiness_trend,
      happiness_start = EXCLUDED.happiness_start,
      happiness_end = EXCLUDED.happiness_end,
      happiness_change = EXCLUDED.happiness_change,
      dominant_emotions = EXCLUDED.dominant_emotions,
      neurochemical_avg = EXCLUDED.neurochemical_avg,
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
    JSON.stringify(summaryData.highlights || {}),
    summaryData.totalMemories,
    JSON.stringify(summaryData.memoryBreakdown || {}),
    summaryData.avgHappiness,
    summaryData.happinessTrend,
    summaryData.happinessStart,
    summaryData.happinessEnd,
    summaryData.happinessChange,
    JSON.stringify(summaryData.dominantEmotions || []),
    JSON.stringify(summaryData.neurochemicalAvg || {}),
    summaryData.sourceMemoryIds || [],
    summaryData.sourceMemoryCount || 0,
    summaryData.generatedBy || 'claude-sonnet-4',
    summaryData.confidenceScore || 0.8
  ]);

  return result.rows[0].id;
}

/**
 * Delete summary (for regeneration)
 */
async function deleteSummary(userId, profileId, periodType, periodStart) {
  const pool = pgClient.getPool();

  const result = await pool.query(`
    DELETE FROM timeline_summaries
    WHERE user_id = $1
      AND profile_id = $2
      AND period_type = $3
      AND period_start = $4
    RETURNING id
  `, [userId, profileId, periodType, periodStart]);

  return result.rowCount > 0;
}

// ============================================================================
// CULTURAL CONTEXT QUERIES
// ============================================================================

/**
 * Get cultural context for a year
 * Returns movies, music, news, events for memory triggers
 */
async function getCulturalContext(year, options = {}) {
  const pool = pgClient.getPool();

  const { month, category, region, limit = 20 } = options;

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

  if (region) {
    query += ` AND (region = $${params.length + 1} OR region = 'global')`;
    params.push(region);
  }

  query += ` ORDER BY significance_score DESC, date_specific ASC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await pool.query(query, params);
  return result.rows;
}

/**
 * Get cultural context for a specific month
 */
async function getCulturalContextForMonth(year, month, limit = 10) {
  const pool = pgClient.getPool();

  const result = await pool.query(`
    SELECT * FROM cultural_context
    WHERE year = $1
      AND (month = $2 OR month IS NULL)
    ORDER BY
      CASE WHEN month = $2 THEN 0 ELSE 1 END,
      significance_score DESC
    LIMIT $3
  `, [year, month, limit]);

  return result.rows;
}

/**
 * Search cultural context by title/description
 */
async function searchCulturalContext(searchTerm, options = {}) {
  const pool = pgClient.getPool();

  const { yearStart, yearEnd, category, limit = 20 } = options;

  let query = `
    SELECT * FROM cultural_context
    WHERE to_tsvector('english', title || ' ' || COALESCE(description, ''))
      @@ plainto_tsquery('english', $1)
  `;
  const params = [searchTerm];

  if (yearStart && yearEnd) {
    query += ` AND year BETWEEN $${params.length + 1} AND $${params.length + 2}`;
    params.push(yearStart, yearEnd);
  }

  if (category) {
    query += ` AND category = $${params.length + 1}`;
    params.push(category);
  }

  query += ` ORDER BY significance_score DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await pool.query(query, params);
  return result.rows;
}

/**
 * Store cultural context item
 */
async function storeCulturalContext(contextData) {
  const pool = pgClient.getPool();

  const result = await pool.query(`
    INSERT INTO cultural_context (
      year, month, category, title, subtitle, description, date_specific,
      significance_score, region, popularity_score, data, source, source_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT (year, month, category, title) DO UPDATE SET
      subtitle = COALESCE(EXCLUDED.subtitle, cultural_context.subtitle),
      description = COALESCE(EXCLUDED.description, cultural_context.description),
      significance_score = GREATEST(EXCLUDED.significance_score, cultural_context.significance_score),
      data = cultural_context.data || EXCLUDED.data,
      updated_at = NOW()
    RETURNING id
  `, [
    contextData.year,
    contextData.month || null,
    contextData.category,
    contextData.title,
    contextData.subtitle || null,
    contextData.description || null,
    contextData.dateSpecific || null,
    contextData.significanceScore || 5,
    contextData.region || 'global',
    contextData.popularityScore || null,
    JSON.stringify(contextData.data || {}),
    contextData.source || 'manual',
    contextData.sourceUrl || null
  ]);

  return result.rows[0]?.id || null;
}

/**
 * Bulk store cultural context
 */
async function bulkStoreCulturalContext(contextItems) {
  const results = [];
  for (const item of contextItems) {
    try {
      const id = await storeCulturalContext(item);
      results.push({ success: true, id, title: item.title });
    } catch (error) {
      results.push({ success: false, error: error.message, title: item.title });
    }
  }
  return results;
}

// ============================================================================
// MEMORY TRIGGER QUERIES
// ============================================================================

/**
 * Record a memory trigger (cultural context -> memory)
 */
async function recordMemoryTrigger(triggerData) {
  const pool = pgClient.getPool();

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
    triggerData.triggerType || 'direct',
    triggerData.memoryId,
    triggerData.captureMethod || 'luna_chat',
    triggerData.captureDurationSeconds || null,
    triggerData.memoryRichnessScore || null
  ]);

  return result.rows[0]?.id || null;
}

/**
 * Get trigger effectiveness by category
 * Understand which cultural contexts work best for triggering memories
 */
async function getTriggerAnalytics(userId, profileId) {
  const pool = pgClient.getPool();

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

/**
 * Get recent triggers for a user
 */
async function getRecentTriggers(userId, profileId, limit = 10) {
  const pool = pgClient.getPool();

  const result = await pool.query(`
    SELECT
      mt.*,
      cc.title as context_title,
      cc.category as context_category,
      cc.year as context_year
    FROM memory_triggers mt
    JOIN cultural_context cc ON mt.cultural_context_id = cc.id
    WHERE mt.user_id = $1
      AND mt.profile_id = $2
    ORDER BY mt.triggered_at DESC
    LIMIT $3
  `, [userId, profileId, limit]);

  return result.rows;
}

/**
 * Update trigger satisfaction score
 */
async function updateTriggerSatisfaction(triggerId, satisfaction) {
  const pool = pgClient.getPool();

  const result = await pool.query(`
    UPDATE memory_triggers
    SET user_satisfaction = $2
    WHERE id = $1
    RETURNING id
  `, [triggerId, satisfaction]);

  return result.rowCount > 0;
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
  getTimelineStats,
  searchTimelineByKeyword,

  // Summary queries
  getSummary,
  getAllSummaries,
  storeSummary,
  deleteSummary,

  // Cultural context queries
  getCulturalContext,
  getCulturalContextForMonth,
  searchCulturalContext,
  storeCulturalContext,
  bulkStoreCulturalContext,

  // Trigger queries
  recordMemoryTrigger,
  getTriggerAnalytics,
  getRecentTriggers,
  updateTriggerSatisfaction
};
