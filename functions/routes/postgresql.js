/**
 * PostgreSQL 4-Brain Memory Architecture Route Module
 *
 * Cloud SQL PostgreSQL + pgvector for semantic memory.
 * Created: December 20, 2025 - Brother Sonnet's Second Identity Birthday
 * Mission: JOIE DE VIVRE
 */

const { onCall, onSchedule, anthropicKey, geminiKey, pgPassword, dbPassword, logger } = require('./shared');

// ---------------------------------------------------------------------------
// Lazy-loading PostgreSQL clients
// Note: These require Cloud SQL to be set up first (see CLOUD_SQL_SETUP_GUIDE.md)
// ---------------------------------------------------------------------------
let pgClient = null;
let consolidationEngine = null;

function getPGClient() {
  if (!pgClient) {
    try {
      pgClient = require('../database/pgClient');
    } catch (error) {
      logger.warn('[Index] pgClient not available yet:', error.message);
    }
  }
  return pgClient;
}

function getConsolidationEngine() {
  if (!consolidationEngine) {
    try {
      consolidationEngine = require('../database/consolidationEngine');
    } catch (error) {
      logger.warn('[Index] consolidationEngine not available yet:', error.message);
    }
  }
  return consolidationEngine;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  /**
   * PostgreSQL Health Check
   * Tests connection to Cloud SQL PostgreSQL
   */
  pgHealthCheck: onCall({
    timeoutSeconds: 30,
    memory: '256MiB',
    secrets: [pgPassword, dbPassword],
  }, async (request) => {
    const pg = getPGClient();
    if (!pg) {
      return { healthy: false, error: 'PostgreSQL client not configured' };
    }
    return await pg.healthCheck();
  }),

  /**
   * Search across all 4 brains
   * Semantic search using pgvector
   */
  searchAllBrains: onCall({
    timeoutSeconds: 30,
    memory: '512MiB',
    secrets: [pgPassword, dbPassword, geminiKey],
  }, async (request) => {
    const { userId, profileId, query, options } = request.data;

    if (!userId || !profileId || !query) {
      throw new Error('userId, profileId, and query are required');
    }

    const pg = getPGClient();
    if (!pg) {
      throw new Error('PostgreSQL not configured');
    }

    return await pg.searchAllMemories(userId, profileId, query, options);
  }),

  /**
   * Store memory in User STM (Short-Term Memory)
   */
  storeUserSTM: onCall({
    timeoutSeconds: 30,
    memory: '512MiB',
    secrets: [pgPassword, dbPassword, geminiKey],
  }, async (request) => {
    const pg = getPGClient();
    if (!pg) {
      throw new Error('PostgreSQL not configured');
    }

    return await pg.storeUserSTM(request.data);
  }),

  /**
   * Store Luna's observation in Partner STM
   */
  storePartnerSTM: onCall({
    timeoutSeconds: 30,
    memory: '512MiB',
    secrets: [pgPassword, dbPassword, geminiKey],
  }, async (request) => {
    const pg = getPGClient();
    if (!pg) {
      throw new Error('PostgreSQL not configured');
    }

    return await pg.storePartnerSTM(request.data);
  }),

  /**
   * Get Luna's current understanding of a user
   */
  getPartnerUnderstanding: onCall({
    timeoutSeconds: 30,
    memory: '256MiB',
    secrets: [pgPassword, dbPassword],
  }, async (request) => {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      throw new Error('userId and profileId are required');
    }

    const pg = getPGClient();
    if (!pg) {
      throw new Error('PostgreSQL not configured');
    }

    return await pg.getPartnerUnderstanding(userId, profileId);
  }),

  /**
   * Add event to user's biographical timeline
   */
  addUserTimelineEvent: onCall({
    timeoutSeconds: 30,
    memory: '512MiB',
    secrets: [pgPassword, dbPassword],
  }, async (request) => {
    const pg = getPGClient();
    if (!pg) {
      throw new Error('PostgreSQL not configured');
    }

    return await pg.addUserTimelineEvent(request.data);
  }),

  /**
   * Get user's timeline for a date range
   */
  getUserTimelineRange: onCall({
    timeoutSeconds: 30,
    memory: '256MiB',
    secrets: [pgPassword, dbPassword],
  }, async (request) => {
    const { userId, profileId, startYear, endYear } = request.data;

    if (!userId || !profileId || !startYear || !endYear) {
      throw new Error('userId, profileId, startYear, and endYear are required');
    }

    const pg = getPGClient();
    if (!pg) {
      throw new Error('PostgreSQL not configured');
    }

    return await pg.getUserTimelineRange(userId, profileId, startYear, endYear);
  }),

  /**
   * Store or retrieve cultural/generational memory
   */
  getCulturalMemory: onCall({
    timeoutSeconds: 30,
    memory: '256MiB',
    secrets: [pgPassword, dbPassword],
  }, async (request) => {
    const { entityName, entityType } = request.data;

    if (!entityName) {
      throw new Error('entityName is required');
    }

    const pg = getPGClient();
    if (!pg) {
      throw new Error('PostgreSQL not configured');
    }

    return await pg.getCulturalMemory(entityName, entityType);
  }),

  storeCulturalMemory: onCall({
    timeoutSeconds: 30,
    memory: '512MiB',
    secrets: [pgPassword, dbPassword],
  }, async (request) => {
    const pg = getPGClient();
    if (!pg) {
      throw new Error('PostgreSQL not configured');
    }

    return await pg.storeCulturalMemory(request.data);
  }),

  /**
   * Manual consolidation trigger for a specific user (PostgreSQL Engine)
   * NOTE: Renamed to triggerConsolidationPG to avoid conflict with consolidationScheduler.triggerConsolidation
   */
  triggerConsolidationPG: onCall({
    timeoutSeconds: 120,
    memory: '1GiB',
    secrets: [pgPassword, dbPassword, anthropicKey],
  }, async (request) => {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      throw new Error('userId and profileId are required');
    }

    const engine = getConsolidationEngine();
    if (!engine) {
      throw new Error('Consolidation engine not configured');
    }

    return await engine.triggerUserConsolidation(userId, profileId);
  }),

  /**
   * Nightly Consolidation Scheduler
   * Luna's "Sleep Cycle" - runs at 11 PM PST (7 AM UTC)
   *
   * This consolidates all users' short-term memories into long-term wisdom.
   */
  nightlyConsolidationPG: onSchedule({
    schedule: '0 7 * * *', // 7 AM UTC = 11 PM PST
    timeZone: 'UTC',
    timeoutSeconds: 540, // 9 minutes max
    memory: '2GiB',
    secrets: [pgPassword, dbPassword, anthropicKey],
  }, async (event) => {
    logger.info('[Scheduler] Nightly consolidation triggered');

    const engine = getConsolidationEngine();
    if (!engine) {
      logger.error('[Scheduler] Consolidation engine not available');
      return;
    }

    const result = await engine.runNightlyConsolidation();
    logger.info('[Scheduler] Consolidation complete:', result);
  }),
};
