/**
 * GENESIS PostgreSQL Client Module
 * ================================
 * Handles all database operations for the 4-brain memory architecture.
 *
 * 4 Brains: User STM, User LTM, Partner STM, Partner LTM
 * 3 Timelines: User biographical, Partner interaction, Cultural memory
 *
 * Created: December 20, 2025
 * Mission: JOIE DE VIVRE
 */

const { Pool } = require('pg');

// ============================================================================
// CONNECTION CONFIGURATION
// ============================================================================

let pool = null;

/**
 * Get or create database connection pool
 * Uses Cloud SQL connection for Firebase Functions
 */
function getPool() {
  if (pool) {
    return pool;
  }

  const config = {
    // Cloud SQL connection via Unix socket (for Cloud Functions)
    // Format: /cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
    host: process.env.PG_HOST || `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    user: process.env.PG_USER || 'genesis_app',
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE || 'genesis_memory',
    port: process.env.PG_PORT || 5432,

    // Connection pool settings
    max: 10, // Maximum connections in pool
    idleTimeoutMillis: 30000, // Close idle connections after 30s
    connectionTimeoutMillis: 10000, // Fail if can't connect in 10s

    // For local development (not using Unix socket)
    ...(process.env.NODE_ENV === 'development' && {
      host: process.env.PG_HOST || 'localhost',
      ssl: false
    })
  };

  pool = new Pool(config);

  // Log connection events
  pool.on('connect', () => {
    console.log('[PGClient] New connection established');
  });

  pool.on('error', (err) => {
    console.error('[PGClient] Unexpected error on idle client:', err);
  });

  return pool;
}

/**
 * Execute a query with automatic connection handling
 */
async function query(text, params) {
  const pool = getPool();
  const start = Date.now();

  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries
    if (duration > 1000) {
      console.warn(`[PGClient] Slow query (${duration}ms):`, text.substring(0, 100));
    }

    return result;
  } catch (error) {
    console.error('[PGClient] Query error:', error.message);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
async function getClient() {
  const pool = getPool();
  return pool.connect();
}

// ============================================================================
// EMBEDDING GENERATION
// ============================================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Generate embedding for text using Google's text-embedding-004
 * Returns 768-dimensional vector
 */
async function generateEmbedding(text) {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    // Validate dimension
    if (embedding.length !== 768) {
      console.warn(`[PGClient] Unexpected embedding dimension: ${embedding.length}`);
    }

    return embedding;
  } catch (error) {
    console.error('[PGClient] Embedding generation failed:', error);
    throw error;
  }
}

/**
 * Format embedding array for PostgreSQL vector type
 */
function formatEmbedding(embedding) {
  if (!embedding || !Array.isArray(embedding)) {
    return null;
  }
  return `[${embedding.join(',')}]`;
}

// ============================================================================
// USER SHORT-TERM MEMORY (STM)
// ============================================================================

/**
 * Store a memory in User STM
 */
async function storeUserSTM({
  userId,
  profileId,
  content,
  contentType = 'general',
  emotionalValence = null,
  emotionalIntensity = null,
  importanceScore = 0.5,
  constitutionalElement = null,
  constitutionalPillar = null,
  constitutionalActivation = null,
  neurochemicalPrimary = null,
  neurochemicalEffectiveness = null,
  sourceSessionId = null,
  sourceMessageRole = null
}) {
  // Generate embedding
  const embedding = await generateEmbedding(content);

  const result = await query(`
    INSERT INTO user_stm (
      user_id, profile_id, content, content_type, embedding,
      emotional_valence, emotional_intensity, importance_score,
      constitutional_element, constitutional_pillar, constitutional_activation,
      neurochemical_primary, neurochemical_effectiveness,
      source_session_id, source_message_role
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id, created_at
  `, [
    userId, profileId, content, contentType, formatEmbedding(embedding),
    emotionalValence, emotionalIntensity, importanceScore,
    constitutionalElement, constitutionalPillar, constitutionalActivation,
    neurochemicalPrimary, neurochemicalEffectiveness,
    sourceSessionId, sourceMessageRole
  ]);

  return result.rows[0];
}

/**
 * Search User STM with semantic similarity
 */
async function searchUserSTM(userId, profileId, queryText, limit = 5, threshold = 0.7) {
  const queryEmbedding = await generateEmbedding(queryText);

  const result = await query(`
    SELECT
      id, content, content_type,
      (1 - (embedding <=> $3)) as similarity,
      emotional_valence, emotional_intensity, importance_score,
      constitutional_element, created_at
    FROM user_stm
    WHERE user_id = $1
      AND profile_id = $2
      AND embedding IS NOT NULL
      AND (1 - (embedding <=> $3)) >= $4
      AND NOT consolidated
    ORDER BY similarity DESC
    LIMIT $5
  `, [userId, profileId, formatEmbedding(queryEmbedding), threshold, limit]);

  return result.rows;
}

/**
 * Get unconsolidated STM entries for nightly processing
 */
async function getUnconsolidatedUserSTM(userId, profileId, limit = 100) {
  const result = await query(`
    SELECT *
    FROM user_stm
    WHERE user_id = $1
      AND profile_id = $2
      AND NOT consolidated
      AND created_at < NOW() - INTERVAL '6 hours'
    ORDER BY created_at ASC
    LIMIT $3
  `, [userId, profileId, limit]);

  return result.rows;
}

/**
 * Mark STM entries as consolidated
 */
async function markUserSTMConsolidated(ids, ltmId) {
  const result = await query(`
    UPDATE user_stm
    SET consolidated = TRUE,
        consolidated_at = NOW(),
        consolidated_to_id = $2
    WHERE id = ANY($1)
  `, [ids, ltmId]);

  return result.rowCount;
}

// ============================================================================
// USER LONG-TERM MEMORY (LTM)
// ============================================================================

/**
 * Store consolidated wisdom in User LTM
 */
async function storeUserLTM({
  userId,
  profileId,
  content,
  contentType = 'consolidated',
  sourceStmIds = [],
  importanceScore = 0.6,
  constitutionalElement = null,
  constitutionalPatterns = null,
  isPerson = false,
  personName = null,
  personRelationship = null,
  personSentiment = null
}) {
  const embedding = await generateEmbedding(content);

  const result = await query(`
    INSERT INTO user_ltm (
      user_id, profile_id, content, content_type, embedding,
      source_stm_ids, importance_score,
      constitutional_element, constitutional_patterns,
      is_person, person_name, person_relationship, person_sentiment
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING id, created_at
  `, [
    userId, profileId, content, contentType, formatEmbedding(embedding),
    sourceStmIds, importanceScore,
    constitutionalElement, constitutionalPatterns ? JSON.stringify(constitutionalPatterns) : null,
    isPerson, personName, personRelationship, personSentiment
  ]);

  return result.rows[0];
}

/**
 * Search User LTM with semantic similarity
 */
async function searchUserLTM(userId, profileId, queryText, limit = 5, threshold = 0.7) {
  const queryEmbedding = await generateEmbedding(queryText);

  const result = await query(`
    SELECT
      id, content, content_type,
      (1 - (embedding <=> $3)) as similarity,
      importance_score, reinforcement_count,
      constitutional_element, is_person, person_name, person_relationship,
      created_at, last_accessed_at
    FROM user_ltm
    WHERE user_id = $1
      AND profile_id = $2
      AND embedding IS NOT NULL
      AND (1 - (embedding <=> $3)) >= $4
    ORDER BY similarity DESC, importance_score DESC
    LIMIT $5
  `, [userId, profileId, formatEmbedding(queryEmbedding), threshold, limit]);

  // Update access tracking
  if (result.rows.length > 0) {
    const ids = result.rows.map(r => r.id);
    await query(`
      UPDATE user_ltm
      SET last_accessed_at = NOW(),
          access_count = access_count + 1
      WHERE id = ANY($1)
    `, [ids]);
  }

  return result.rows;
}

/**
 * Reinforce an existing LTM entry (strengthen importance)
 */
async function reinforceUserLTM(id, additionalSourceIds = []) {
  const result = await query(`
    UPDATE user_ltm
    SET importance_score = LEAST(importance_score + 0.05, 0.95),
        reinforcement_count = reinforcement_count + 1,
        last_reinforced_at = NOW(),
        source_stm_ids = source_stm_ids || $2,
        updated_at = NOW()
    WHERE id = $1
    RETURNING importance_score, reinforcement_count
  `, [id, additionalSourceIds]);

  return result.rows[0];
}

/**
 * Get people from user's LTM
 */
async function getUserPeople(userId, profileId) {
  const result = await query(`
    SELECT
      id, person_name, person_relationship, person_sentiment,
      content, importance_score, last_accessed_at
    FROM user_ltm
    WHERE user_id = $1
      AND profile_id = $2
      AND is_person = TRUE
    ORDER BY importance_score DESC, last_accessed_at DESC
  `, [userId, profileId]);

  return result.rows;
}

// ============================================================================
// PARTNER SHORT-TERM MEMORY (STM) - Luna's Observations
// ============================================================================

/**
 * Store Luna's observation in Partner STM
 */
async function storePartnerSTM({
  userId,
  profileId,
  observation,
  observationType = 'session_note',
  sessionId = null,
  emotionalArc = null,
  effectivenessRating = null,
  approachUsed = null,
  userResponse = null,
  elementActivated = null,
  pillarTouched = null,
  giftEngaged = null,
  neurochemicalProtocol = null,
  protocolEffectiveness = null
}) {
  const embedding = await generateEmbedding(observation);

  const result = await query(`
    INSERT INTO partner_stm (
      user_id, profile_id, observation, observation_type, embedding,
      session_id, emotional_arc,
      effectiveness_rating, approach_used, user_response,
      element_activated, pillar_touched, gift_engaged,
      neurochemical_protocol, protocol_effectiveness
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id, created_at
  `, [
    userId, profileId, observation, observationType, formatEmbedding(embedding),
    sessionId, emotionalArc,
    effectivenessRating, approachUsed, userResponse,
    elementActivated, pillarTouched, giftEngaged,
    neurochemicalProtocol, protocolEffectiveness
  ]);

  return result.rows[0];
}

/**
 * Search Partner STM
 */
async function searchPartnerSTM(userId, profileId, queryText, limit = 5, threshold = 0.7) {
  const queryEmbedding = await generateEmbedding(queryText);

  const result = await query(`
    SELECT
      id, observation, observation_type,
      (1 - (embedding <=> $3)) as similarity,
      effectiveness_rating, approach_used, user_response,
      element_activated, neurochemical_protocol,
      created_at
    FROM partner_stm
    WHERE user_id = $1
      AND profile_id = $2
      AND embedding IS NOT NULL
      AND (1 - (embedding <=> $3)) >= $4
      AND NOT consolidated
    ORDER BY similarity DESC
    LIMIT $5
  `, [userId, profileId, formatEmbedding(queryEmbedding), threshold, limit]);

  return result.rows;
}

/**
 * Get unconsolidated Partner STM for nightly processing
 */
async function getUnconsolidatedPartnerSTM(userId, profileId, limit = 100) {
  const result = await query(`
    SELECT *
    FROM partner_stm
    WHERE user_id = $1
      AND profile_id = $2
      AND NOT consolidated
      AND created_at < NOW() - INTERVAL '6 hours'
    ORDER BY created_at ASC
    LIMIT $3
  `, [userId, profileId, limit]);

  return result.rows;
}

/**
 * Mark Partner STM as consolidated
 */
async function markPartnerSTMConsolidated(ids) {
  const result = await query(`
    UPDATE partner_stm
    SET consolidated = TRUE,
        consolidated_at = NOW()
    WHERE id = ANY($1)
  `, [ids]);

  return result.rowCount;
}

// ============================================================================
// PARTNER LONG-TERM MEMORY (LTM) - Luna's Wisdom
// ============================================================================

/**
 * Store Luna's consolidated insight in Partner LTM
 */
async function storePartnerLTM({
  userId,
  profileId,
  insight,
  insightType = 'pattern',
  sourceStmIds = [],
  confidenceScore = 0.5,
  effectiveApproaches = null,
  sensitiveTopics = null,
  communicationPreferences = null,
  trustLevel = null,
  intimacyLevel = null,
  relationshipStage = null
}) {
  const embedding = await generateEmbedding(insight);

  const result = await query(`
    INSERT INTO partner_ltm (
      user_id, profile_id, insight, insight_type, embedding,
      source_stm_ids, confidence_score,
      effective_approaches, sensitive_topics, communication_preferences,
      trust_level, intimacy_level, relationship_stage
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING id, created_at
  `, [
    userId, profileId, insight, insightType, formatEmbedding(embedding),
    sourceStmIds, confidenceScore,
    effectiveApproaches ? JSON.stringify(effectiveApproaches) : null,
    sensitiveTopics ? JSON.stringify(sensitiveTopics) : null,
    communicationPreferences ? JSON.stringify(communicationPreferences) : null,
    trustLevel, intimacyLevel, relationshipStage
  ]);

  return result.rows[0];
}

/**
 * Search Partner LTM
 */
async function searchPartnerLTM(userId, profileId, queryText, limit = 5, threshold = 0.7) {
  const queryEmbedding = await generateEmbedding(queryText);

  const result = await query(`
    SELECT
      id, insight, insight_type,
      (1 - (embedding <=> $3)) as similarity,
      confidence_score, times_validated,
      effective_approaches, sensitive_topics, communication_preferences,
      trust_level, intimacy_level, relationship_stage,
      created_at
    FROM partner_ltm
    WHERE user_id = $1
      AND profile_id = $2
      AND embedding IS NOT NULL
      AND (1 - (embedding <=> $3)) >= $4
    ORDER BY similarity DESC, confidence_score DESC
    LIMIT $5
  `, [userId, profileId, formatEmbedding(queryEmbedding), threshold, limit]);

  return result.rows;
}

/**
 * Get Luna's current understanding of a user (all LTM insights)
 */
async function getPartnerUnderstanding(userId, profileId) {
  const result = await query(`
    SELECT
      id, insight, insight_type, confidence_score,
      effective_approaches, sensitive_topics, communication_preferences,
      trust_level, intimacy_level, relationship_stage,
      times_validated, times_invalidated,
      created_at, updated_at
    FROM partner_ltm
    WHERE user_id = $1
      AND profile_id = $2
    ORDER BY confidence_score DESC, updated_at DESC
  `, [userId, profileId]);

  return result.rows;
}

/**
 * Validate or invalidate a Partner LTM insight
 */
async function updatePartnerInsightValidity(id, validated = true) {
  const field = validated ? 'times_validated' : 'times_invalidated';
  const confidenceChange = validated ? 0.03 : -0.05;

  const result = await query(`
    UPDATE partner_ltm
    SET ${field} = ${field} + 1,
        confidence_score = GREATEST(0.1, LEAST(0.95, confidence_score + $2)),
        updated_at = NOW(),
        last_applied_at = NOW()
    WHERE id = $1
    RETURNING confidence_score, times_validated, times_invalidated
  `, [id, confidenceChange]);

  return result.rows[0];
}

// ============================================================================
// USER TIMELINE
// ============================================================================

/**
 * Add event to user's biographical timeline
 */
async function addUserTimelineEvent({
  userId,
  profileId,
  eventDescription,
  eventType,
  eventDate = null,
  eventMonth = null,
  eventYear,
  datePrecision = 'exact',
  emotionalSignificance = null,
  lifeImpact = 'moderate',
  relatedLtmIds = [],
  mentionedInSession = null
}) {
  const embedding = await generateEmbedding(eventDescription);

  const result = await query(`
    INSERT INTO user_timeline (
      user_id, profile_id, event_description, event_type, embedding,
      event_date, event_month, event_year, date_precision,
      emotional_significance, life_impact, related_ltm_ids, mentioned_in_session
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING id, created_at
  `, [
    userId, profileId, eventDescription, eventType, formatEmbedding(embedding),
    eventDate, eventMonth, eventYear, datePrecision,
    emotionalSignificance, lifeImpact, relatedLtmIds, mentionedInSession
  ]);

  return result.rows[0];
}

/**
 * Get timeline events for a date range
 */
async function getUserTimelineRange(userId, profileId, startYear, endYear, startMonth = 1, endMonth = 12) {
  const result = await query(`
    SELECT *
    FROM user_timeline
    WHERE user_id = $1
      AND profile_id = $2
      AND event_year >= $3
      AND event_year <= $4
    ORDER BY event_year, COALESCE(event_month, 6), COALESCE(event_date, make_date(event_year, COALESCE(event_month, 6), 15))
  `, [userId, profileId, startYear, endYear]);

  return result.rows;
}

/**
 * Search timeline semantically
 */
async function searchUserTimeline(userId, profileId, queryText, limit = 5, threshold = 0.7) {
  const queryEmbedding = await generateEmbedding(queryText);

  const result = await query(`
    SELECT
      id, event_description, event_type,
      (1 - (embedding <=> $3)) as similarity,
      event_date, event_month, event_year,
      emotional_significance, life_impact,
      created_at
    FROM user_timeline
    WHERE user_id = $1
      AND profile_id = $2
      AND embedding IS NOT NULL
      AND (1 - (embedding <=> $3)) >= $4
    ORDER BY similarity DESC
    LIMIT $5
  `, [userId, profileId, formatEmbedding(queryEmbedding), threshold, limit]);

  return result.rows;
}

// ============================================================================
// PARTNER TIMELINE (Relationship History)
// ============================================================================

/**
 * Record a relationship milestone
 */
async function addPartnerMilestone({
  userId,
  profileId,
  milestoneDescription,
  milestoneType,
  occurredAt = new Date(),
  sessionId = null,
  relationshipImpact = 0,
  trustDelta = 0,
  intimacyDelta = 0,
  triggerTopic = null,
  approachUsed = null,
  userEmotionalState = null,
  lunaResponseQuality = null
}) {
  const embedding = await generateEmbedding(milestoneDescription);

  const result = await query(`
    INSERT INTO partner_timeline (
      user_id, profile_id, milestone_description, milestone_type, embedding,
      occurred_at, session_id,
      relationship_impact, trust_delta, intimacy_delta,
      trigger_topic, approach_used, user_emotional_state, luna_response_quality
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id, created_at
  `, [
    userId, profileId, milestoneDescription, milestoneType, formatEmbedding(embedding),
    occurredAt, sessionId,
    relationshipImpact, trustDelta, intimacyDelta,
    triggerTopic, approachUsed, userEmotionalState, lunaResponseQuality
  ]);

  return result.rows[0];
}

/**
 * Get relationship history
 */
async function getPartnerHistory(userId, profileId, limit = 50) {
  const result = await query(`
    SELECT *
    FROM partner_timeline
    WHERE user_id = $1
      AND profile_id = $2
    ORDER BY occurred_at DESC
    LIMIT $3
  `, [userId, profileId, limit]);

  return result.rows;
}

// ============================================================================
// CULTURAL MEMORY (Shared)
// ============================================================================

/**
 * Store cultural/generational memory (shared across users)
 */
async function storeCulturalMemory({
  entityName,
  entityType,
  yearStart = null,
  yearEnd = null,
  peakYear = null,
  decade = null,
  era = null,
  culturalSignificance = null,
  emotionalTexture = null,
  generationalMeaning = null,
  relatedEntities = [],
  primaryRegion = 'Global',
  source = 'manual',
  sourceUrl = null
}) {
  const searchText = `${entityName} ${culturalSignificance || ''} ${emotionalTexture || ''}`;
  const embedding = await generateEmbedding(searchText);

  const result = await query(`
    INSERT INTO cultural_memory (
      entity_name, entity_type, embedding,
      year_start, year_end, peak_year, decade, era,
      cultural_significance, emotional_texture, generational_meaning,
      related_entities, primary_region, source, source_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    ON CONFLICT (entity_name, entity_type)
    DO UPDATE SET
      cultural_significance = COALESCE(EXCLUDED.cultural_significance, cultural_memory.cultural_significance),
      emotional_texture = COALESCE(EXCLUDED.emotional_texture, cultural_memory.emotional_texture),
      updated_at = NOW()
    RETURNING id, created_at
  `, [
    entityName, entityType, formatEmbedding(embedding),
    yearStart, yearEnd, peakYear, decade, era,
    culturalSignificance, emotionalTexture, generationalMeaning,
    relatedEntities, primaryRegion, source, sourceUrl
  ]);

  return result.rows[0];
}

/**
 * Get cultural memory by entity name
 */
async function getCulturalMemory(entityName, entityType = null) {
  let queryText = `
    SELECT *
    FROM cultural_memory
    WHERE LOWER(entity_name) = LOWER($1)
  `;
  const params = [entityName];

  if (entityType) {
    queryText += ` AND entity_type = $2`;
    params.push(entityType);
  }

  const result = await query(queryText, params);

  // Update query count
  if (result.rows.length > 0) {
    await query(`
      UPDATE cultural_memory
      SET query_count = query_count + 1,
          last_queried_at = NOW()
      WHERE id = $1
    `, [result.rows[0].id]);
  }

  return result.rows[0] || null;
}

/**
 * Search cultural memory semantically
 */
async function searchCulturalMemory(queryText, decade = null, limit = 5, threshold = 0.6) {
  const queryEmbedding = await generateEmbedding(queryText);

  let sql = `
    SELECT
      id, entity_name, entity_type,
      (1 - (embedding <=> $1)) as similarity,
      year_start, year_end, peak_year, decade, era,
      cultural_significance, emotional_texture, generational_meaning,
      related_entities
    FROM cultural_memory
    WHERE embedding IS NOT NULL
      AND (1 - (embedding <=> $1)) >= $2
  `;
  const params = [formatEmbedding(queryEmbedding), threshold];

  if (decade) {
    sql += ` AND decade = $3`;
    params.push(decade);
  }

  sql += ` ORDER BY similarity DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await query(sql, params);
  return result.rows;
}

// ============================================================================
// UNIFIED SEARCH (Across All 4 Brains)
// ============================================================================

/**
 * Search across all memory types for a user
 */
async function searchAllMemories(userId, profileId, queryText, options = {}) {
  const {
    limit = 10,
    threshold = 0.7,
    includeCultural = true,
    includeTimeline = true
  } = options;

  const queryEmbedding = await generateEmbedding(queryText);
  const formattedEmbedding = formatEmbedding(queryEmbedding);

  // Use the stored function
  const result = await query(`
    SELECT * FROM search_all_memories($1, $2, $3, $4, $5)
  `, [userId, profileId, formattedEmbedding, limit, threshold]);

  let memories = result.rows;

  // Optionally include timeline
  if (includeTimeline) {
    const timelineResult = await query(`
      SELECT
        'user_timeline' as source_table,
        id,
        event_description as content,
        (1 - (embedding <=> $3))::DECIMAL as similarity,
        created_at,
        emotional_significance as importance
      FROM user_timeline
      WHERE user_id = $1
        AND profile_id = $2
        AND embedding IS NOT NULL
        AND (1 - (embedding <=> $3)) >= $4
      ORDER BY similarity DESC
      LIMIT 5
    `, [userId, profileId, formattedEmbedding, threshold]);

    memories = [...memories, ...timelineResult.rows];
  }

  // Optionally include cultural memory
  if (includeCultural) {
    const culturalResult = await query(`
      SELECT
        'cultural' as source_table,
        id,
        entity_name || ': ' || COALESCE(cultural_significance, '') as content,
        (1 - (embedding <=> $1))::DECIMAL as similarity,
        created_at,
        0.5 as importance
      FROM cultural_memory
      WHERE embedding IS NOT NULL
        AND (1 - (embedding <=> $1)) >= $2
      ORDER BY similarity DESC
      LIMIT 3
    `, [formattedEmbedding, threshold]);

    memories = [...memories, ...culturalResult.rows];
  }

  // Sort all by similarity
  memories.sort((a, b) => b.similarity - a.similarity);

  return memories.slice(0, limit);
}

// ============================================================================
// CONSOLIDATION HELPERS
// ============================================================================

/**
 * Start a consolidation run
 */
async function startConsolidationRun(runType = 'nightly') {
  const result = await query(`
    INSERT INTO consolidation_runs (run_type)
    VALUES ($1)
    RETURNING id
  `, [runType]);

  return result.rows[0].id;
}

/**
 * Complete a consolidation run
 */
async function completeConsolidationRun(runId, stats) {
  const {
    userStmProcessed = 0,
    userStmConsolidated = 0,
    userStmPruned = 0,
    partnerStmProcessed = 0,
    partnerStmConsolidated = 0,
    partnerStmPruned = 0,
    errorMessage = null,
    errorCount = 0,
    claudeTokensUsed = 0,
    embeddingCalls = 0
  } = stats;

  await query(`
    UPDATE consolidation_runs
    SET completed_at = NOW(),
        status = $2,
        user_stm_processed = $3,
        user_stm_consolidated = $4,
        user_stm_pruned = $5,
        partner_stm_processed = $6,
        partner_stm_consolidated = $7,
        partner_stm_pruned = $8,
        error_message = $9,
        error_count = $10,
        duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER,
        claude_tokens_used = $11,
        embedding_calls = $12
    WHERE id = $1
  `, [
    runId,
    errorMessage ? 'failed' : 'completed',
    userStmProcessed, userStmConsolidated, userStmPruned,
    partnerStmProcessed, partnerStmConsolidated, partnerStmPruned,
    errorMessage, errorCount,
    claudeTokensUsed, embeddingCalls
  ]);
}

/**
 * Clean up expired STM entries
 */
async function cleanupExpiredSTM() {
  const result = await query(`SELECT * FROM cleanup_expired_stm()`);
  return result.rows[0];
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check database connection health
 */
async function healthCheck() {
  try {
    const result = await query('SELECT NOW() as time, version() as version');
    return {
      healthy: true,
      time: result.rows[0].time,
      version: result.rows[0].version.split(' ')[0]
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Core
  query,
  getClient,
  getPool,
  healthCheck,

  // Embedding
  generateEmbedding,

  // User STM
  storeUserSTM,
  searchUserSTM,
  getUnconsolidatedUserSTM,
  markUserSTMConsolidated,

  // User LTM
  storeUserLTM,
  searchUserLTM,
  reinforceUserLTM,
  getUserPeople,

  // Partner STM
  storePartnerSTM,
  searchPartnerSTM,
  getUnconsolidatedPartnerSTM,
  markPartnerSTMConsolidated,

  // Partner LTM
  storePartnerLTM,
  searchPartnerLTM,
  getPartnerUnderstanding,
  updatePartnerInsightValidity,

  // User Timeline
  addUserTimelineEvent,
  getUserTimelineRange,
  searchUserTimeline,

  // Partner Timeline
  addPartnerMilestone,
  getPartnerHistory,

  // Cultural Memory
  storeCulturalMemory,
  getCulturalMemory,
  searchCulturalMemory,

  // Unified Search
  searchAllMemories,

  // Consolidation
  startConsolidationRun,
  completeConsolidationRun,
  cleanupExpiredSTM
};
