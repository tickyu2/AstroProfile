/**
 * GENESIS Consolidation Scheduler
 * ================================
 * Nightly scheduler for memory consolidation
 *
 * Uses node-cron for local development
 * Uses Cloud Scheduler in production (Firebase Functions)
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onCall } = require('firebase-functions/v2/https');
const { runConsolidationJob, triggerUserConsolidation, getConsolidationRuns, getPromotionStats } = require('./consolidationEngineV2');

// ============================================================================
// FIREBASE CLOUD FUNCTIONS (Production)
// ============================================================================

/**
 * Nightly consolidation job
 * Runs at 3:00 AM UTC every day
 *
 * This is Luna's "sleep cycle" - she consolidates memories,
 * strengthens anchors, and becomes wiser.
 */
exports.nightlyConsolidationV2 = onSchedule({
  schedule: '0 3 * * *', // 3:00 AM UTC daily
  timeZone: 'UTC',
  memory: '1GiB',
  timeoutSeconds: 540, // 9 minutes max
  retryCount: 2,
  labels: {
    deployment: 'genesis',
    feature: 'consolidation'
  }
}, async (event) => {
  console.log('[Scheduler] Starting nightly consolidation V2...');

  try {
    const result = await runConsolidationJob({
      limitUsers: 1000,
      dryRun: false
    });

    console.log('[Scheduler] Consolidation complete:', result);

    // Could send notification/metric here
    return result;

  } catch (error) {
    console.error('[Scheduler] Consolidation failed:', error);
    throw error; // Let Cloud Functions retry
  }
});

/**
 * Weekly deep consolidation
 * Runs at 3:00 AM UTC every Sunday
 *
 * More thorough processing for users who weren't fully processed
 * during nightly runs.
 */
exports.weeklyDeepConsolidation = onSchedule({
  schedule: '0 3 * * 0', // 3:00 AM UTC every Sunday
  timeZone: 'UTC',
  memory: '2GiB',
  timeoutSeconds: 540,
  retryCount: 1
}, async (event) => {
  console.log('[Scheduler] Starting weekly deep consolidation...');

  try {
    const result = await runConsolidationJob({
      limitUsers: 5000, // Process more users
      dryRun: false
    });

    console.log('[Scheduler] Weekly consolidation complete:', result);
    return result;

  } catch (error) {
    console.error('[Scheduler] Weekly consolidation failed:', error);
    throw error;
  }
});

// ============================================================================
// CALLABLE FUNCTIONS (Admin API)
// ============================================================================

/**
 * Manually trigger consolidation for a specific user
 * Admin function - requires authentication
 */
exports.triggerConsolidation = onCall({
  memory: '512MiB',
  timeoutSeconds: 120,
  cors: true
}, async (request) => {
  const { userId, profileId, dryRun = false } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

  // In production, add admin auth check here:
  // if (!request.auth || !isAdmin(request.auth.uid)) {
  //   throw new Error('Unauthorized');
  // }

  console.log(`[Admin] Manual consolidation for ${userId}/${profileId} (dryRun: ${dryRun})`);

  try {
    const result = await triggerUserConsolidation(userId, profileId, dryRun);
    return { success: true, ...result };
  } catch (error) {
    console.error('[Admin] Consolidation error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get consolidation run history
 * Admin function for monitoring dashboard
 */
exports.getConsolidationHistory = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { limit = 10 } = request.data || {};

  try {
    const runs = await getConsolidationRuns(limit);
    return { success: true, runs };
  } catch (error) {
    console.error('[Admin] Get history error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get consolidation statistics
 * Admin function for monitoring dashboard
 */
exports.getConsolidationStats = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { days = 30 } = request.data || {};

  try {
    const stats = await getPromotionStats(days);
    return { success: true, stats };
  } catch (error) {
    console.error('[Admin] Get stats error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Run a dry-run consolidation
 * Tests the consolidation logic without making changes
 */
exports.dryRunConsolidation = onCall({
  memory: '1GiB',
  timeoutSeconds: 300,
  cors: true
}, async (request) => {
  const { limitUsers = 100 } = request.data || {};

  console.log(`[Admin] Starting dry run consolidation (limit: ${limitUsers})...`);

  try {
    const result = await runConsolidationJob({
      limitUsers,
      dryRun: true
    });

    return { success: true, ...result };
  } catch (error) {
    console.error('[Admin] Dry run error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// PENDING PROMOTIONS & LLM PROPOSALS INSPECTION
// ============================================================================

/**
 * Get pending promotions awaiting human review
 * Shows mid-score items (0.45-0.65) that need manual approval
 */
exports.getPendingPromotions = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, limit = 50, status = 'pending' } = request.data || {};

  try {
    const { query } = require('../database/pool');

    let sql = `
      SELECT id, user_id, profile_id, stm_ids, proposed_content, score, status, created_at
      FROM pending_promotions
      WHERE status = $1
    `;
    const params = [status];

    if (userId) {
      sql += ` AND user_id = $2`;
      params.push(userId);
    }

    sql += ` ORDER BY score DESC, created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(sql, params);

    return {
      success: true,
      count: result.rows.length,
      pendingPromotions: result.rows
    };
  } catch (error) {
    console.error('[Admin] Get pending promotions error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Approve or reject a pending promotion
 */
exports.reviewPendingPromotion = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const { pendingId, action, reviewNotes } = request.data;

  if (!pendingId || !['approve', 'reject'].includes(action)) {
    return { success: false, error: 'Missing pendingId or invalid action (approve/reject)' };
  }

  try {
    const { query } = require('../database/pool');
    const { storeLTMEntry } = require('./ltmStore');

    if (action === 'approve') {
      // Get the pending promotion
      const pendingResult = await query(
        'SELECT * FROM pending_promotions WHERE id = $1',
        [pendingId]
      );

      if (pendingResult.rows.length === 0) {
        return { success: false, error: 'Pending promotion not found' };
      }

      const pending = pendingResult.rows[0];

      // Create LTM entry
      const ltmId = await storeLTMEntry(null, {
        userId: pending.user_id,
        profileId: pending.profile_id,
        content: pending.proposed_content,
        embedding: pending.proposed_embedding,
        source: { stmIds: pending.stm_ids },
        meta: {
          contentType: 'human_approved',
          importanceScore: pending.score,
          reviewNotes
        }
      });

      // Mark STMs as consolidated
      await query(
        `UPDATE user_stm
         SET consolidated = true, consolidated_at = NOW(), consolidated_to_id = $1
         WHERE id = ANY($2)`,
        [ltmId, pending.stm_ids]
      );

      // Update pending status
      await query(
        `UPDATE pending_promotions SET status = 'approved', updated_at = NOW() WHERE id = $1`,
        [pendingId]
      );

      return { success: true, action: 'approved', ltmId };

    } else {
      // Reject - just update status
      await query(
        `UPDATE pending_promotions SET status = 'rejected', updated_at = NOW() WHERE id = $1`,
        [pendingId]
      );

      return { success: true, action: 'rejected' };
    }
  } catch (error) {
    console.error('[Admin] Review pending error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Run LLM-based dry-run consolidation for a specific user
 * Returns llmProposals without writing to DB
 */
exports.dryRunLLMConsolidation = onCall({
  memory: '1GiB',
  timeoutSeconds: 120,
  cors: true
}, async (request) => {
  const { userId, profileId } = request.data;

  if (!userId || !profileId) {
    return { success: false, error: 'Missing userId or profileId' };
  }

  console.log(`[Admin] LLM dry-run for ${userId}/${profileId}...`);

  try {
    const { consolidateWithLLM } = require('./consolidationEngineV2');

    const result = await consolidateWithLLM(null, userId, profileId, { dryRun: true });

    return {
      success: true,
      userId,
      profileId,
      promoted: result.promoted,
      pending: result.pending,
      decayed: result.decayed,
      llmProposals: result.llmProposals || []
    };
  } catch (error) {
    console.error('[Admin] LLM dry-run error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// MONITORING & METRICS
// ============================================================================

/**
 * Get consolidation metrics for monitoring dashboard
 */
exports.getConsolidationMetrics = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { days = 7 } = request.data || {};

  try {
    const { query } = require('../database/pool');

    // Get run stats
    const runsResult = await query(`
      SELECT
        COUNT(*) as total_runs,
        SUM(promoted_count) as total_promoted,
        SUM(decayed_count) as total_decayed,
        SUM(anchors_strengthened) as total_anchors_strengthened,
        AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration_seconds,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_runs
      FROM consolidation_runs
      WHERE started_at > NOW() - ($1 || ' days')::INTERVAL
    `, [days]);

    // Get pending promotions count
    const pendingResult = await query(`
      SELECT COUNT(*) as pending_count
      FROM pending_promotions
      WHERE status = 'pending'
    `);

    // Get LTM growth
    const ltmResult = await query(`
      SELECT
        COUNT(*) as new_ltm_entries,
        COUNT(DISTINCT user_id) as unique_users
      FROM user_ltm
      WHERE created_at > NOW() - ($1 || ' days')::INTERVAL
    `, [days]);

    // Get promotion reasons breakdown
    const reasonsResult = await query(`
      SELECT reason, COUNT(*) as count
      FROM memory_promotion_log
      WHERE created_at > NOW() - ($1 || ' days')::INTERVAL
      GROUP BY reason
      ORDER BY count DESC
    `, [days]);

    return {
      success: true,
      period: `${days} days`,
      runs: runsResult.rows[0],
      pendingPromotions: parseInt(pendingResult.rows[0].pending_count),
      ltmGrowth: ltmResult.rows[0],
      promotionReasons: reasonsResult.rows
    };
  } catch (error) {
    console.error('[Admin] Get metrics error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get per-user consolidation stats
 */
exports.getUserConsolidationStats = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId } = request.data;

  if (!userId) {
    return { success: false, error: 'Missing userId' };
  }

  try {
    const { query } = require('../database/pool');

    // STM stats
    const stmResult = await query(`
      SELECT
        COUNT(*) as total_stm,
        COUNT(CASE WHEN consolidated THEN 1 END) as consolidated_stm,
        COUNT(CASE WHEN NOT consolidated THEN 1 END) as pending_stm
      FROM user_stm
      WHERE user_id = $1 ${profileId ? 'AND profile_id = $2' : ''}
    `, profileId ? [userId, profileId] : [userId]);

    // LTM stats
    const ltmResult = await query(`
      SELECT
        COUNT(*) as total_ltm,
        AVG(importance_score) as avg_importance,
        MAX(created_at) as last_promotion
      FROM user_ltm
      WHERE user_id = $1 ${profileId ? 'AND profile_id = $2' : ''}
    `, profileId ? [userId, profileId] : [userId]);

    // Anchor stats
    const anchorResult = await query(`
      SELECT
        COUNT(*) as total_anchors,
        AVG(strength) as avg_strength,
        MAX(strength) as max_strength
      FROM happiness_anchors
      WHERE user_id = $1 ${profileId ? 'AND profile_id = $2' : ''}
    `, profileId ? [userId, profileId] : [userId]);

    return {
      success: true,
      userId,
      profileId,
      stm: stmResult.rows[0],
      ltm: ltmResult.rows[0],
      anchors: anchorResult.rows[0]
    };
  } catch (error) {
    console.error('[Admin] Get user stats error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// LOCAL DEVELOPMENT SCHEDULER (Optional)
// ============================================================================

/**
 * Start local cron scheduler for development
 * Call this from your local dev server if needed
 *
 * Usage:
 *   const { startLocalScheduler } = require('./consolidationScheduler');
 *   startLocalScheduler();
 */
let localScheduler = null;

async function startLocalScheduler() {
  // Only import cron in local dev to avoid bundling issues
  const cron = require('node-cron');

  if (localScheduler) {
    console.log('[LocalScheduler] Already running');
    return;
  }

  // Run at 3:00 AM local time
  localScheduler = cron.schedule('0 3 * * *', async () => {
    console.log('[LocalScheduler] Starting nightly consolidation...');

    try {
      const result = await runConsolidationJob({ limitUsers: 500 });
      console.log('[LocalScheduler] Complete:', result);
    } catch (error) {
      console.error('[LocalScheduler] Failed:', error);
    }
  });

  console.log('[LocalScheduler] Started - will run at 3:00 AM daily');
}

function stopLocalScheduler() {
  if (localScheduler) {
    localScheduler.stop();
    localScheduler = null;
    console.log('[LocalScheduler] Stopped');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Firebase Cloud Functions - Scheduled
  nightlyConsolidationV2: exports.nightlyConsolidationV2,
  weeklyDeepConsolidation: exports.weeklyDeepConsolidation,

  // Firebase Cloud Functions - Admin
  triggerConsolidation: exports.triggerConsolidation,
  getConsolidationHistory: exports.getConsolidationHistory,
  getConsolidationStats: exports.getConsolidationStats,
  dryRunConsolidation: exports.dryRunConsolidation,

  // Pending Promotions & LLM
  getPendingPromotions: exports.getPendingPromotions,
  reviewPendingPromotion: exports.reviewPendingPromotion,
  dryRunLLMConsolidation: exports.dryRunLLMConsolidation,

  // Monitoring & Metrics
  getConsolidationMetrics: exports.getConsolidationMetrics,
  getUserConsolidationStats: exports.getUserConsolidationStats,

  // Local development
  startLocalScheduler,
  stopLocalScheduler
};
