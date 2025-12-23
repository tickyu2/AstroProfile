/**
 * GENESIS Consolidation Engine V2
 * ================================
 * Production-ready consolidation with:
 * - Simple scoring (no AI required per entry)
 * - Anchor strengthening with compound growth
 * - Full audit logging
 * - Dry-run mode for testing
 * - Admin controls and monitoring
 * - Client injection for testability
 * - Pending promotions for human review
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 *
 * "Luna gets WISER over time, not just BIGGER"
 */

const { getPool, query, withTransaction } = require('../database/pool');
const { storeLTMEntry } = require('./ltmStore');
const { strengthenAllAnchors: strengthenAnchors } = require('./anchorManager');
const { embedText, formatForPgVector } = require('../llm/embeddings');
const { extractConsolidationWithLLM, validateSourceIds } = require('../llm/extractConsolidation');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Scoring thresholds
  STM_RELEVANCE_THRESHOLD: 0.65,     // Score required for auto-promotion
  STM_PENDING_THRESHOLD: 0.45,       // Score for pending review (0.45-0.65)
  STM_DECAY_THRESHOLD: 0.15,         // Below this + old = decay
  STM_DECAY_DAYS: 30,                // Days before low-score entries decay

  // Anchor configuration
  ANCHOR_COMPOUND_PROB: 0.7,         // 70% chance to strengthen each night
  ANCHOR_COMPOUND_INCREMENT: 0.1,    // Strength increase per compound
  ANCHOR_MAX_STRENGTH: 5.0,          // Maximum anchor strength

  // Processing limits
  MAX_PROMOTIONS_PER_USER: 20,       // Cap promotions per user per run
  MAX_USERS_PER_RUN: 500,            // Cap users per consolidation run
  MAX_STM_FOR_LLM: 30,               // Max STMs to send to LLM per batch

  // Feature flags
  CONSOLIDATION_ENABLED: true,       // Kill switch for consolidation
  USE_LLM_EXTRACTION: true,          // Enable LLM-based extraction (for dry-run testing)
  GENERATE_EMBEDDINGS: true,         // Generate embeddings for LTM entries

  // Canary rollout control
  CANARY_MODE: true,                 // When true, only process canary users with live writes
  CANARY_USER_IDS: [],               // User IDs in canary cohort (empty = dry-run ALL users)
  DRY_RUN_DEFAULT: true              // Default to dry-run (no DB writes) until canary enabled
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Score an STM entry for promotion eligibility
 * Combines: recency, mention frequency, emotional weight
 *
 * @param {Object} stm - STM entry with mention_count, emotional_weight, created_at
 * @returns {Object} - Score breakdown { total, recency, mention, emotion }
 */
function scoreSTMEntry(stm) {
  const now = Date.now();
  const ageMs = now - new Date(stm.created_at).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  // Recency score: linear decay over 90 days
  const recencyScore = Math.max(0, 1 - ageDays / 90);

  // Mention score: caps at 5 mentions
  const mentionScore = Math.min(1, (stm.mention_count || 1) / 5);

  // Emotion score: normalized 0-1
  const emotionScore = Math.min(1, (stm.emotional_weight || 0.5));

  // Weighted combination
  // 40% recency, 30% mentions, 30% emotion
  const total = 0.4 * recencyScore + 0.3 * mentionScore + 0.3 * emotionScore;

  return {
    total: Math.min(1, total),
    recency: recencyScore,
    mention: mentionScore,
    emotion: emotionScore,
    ageDays: Math.round(ageDays)
  };
}

// ============================================================================
// MAIN CONSOLIDATION JOB
// ============================================================================

/**
 * Run the main consolidation job
 * Called nightly by scheduler
 *
 * @param {Object} options - { limitUsers, dryRun }
 * @returns {Object} - Run statistics
 */
async function runConsolidationJob({ limitUsers = CONFIG.MAX_USERS_PER_RUN, dryRun = false } = {}) {
  // Check kill switch
  if (!CONFIG.CONSOLIDATION_ENABLED) {
    console.log('[Consolidation] Job disabled by kill switch');
    return { skipped: true, reason: 'disabled' };
  }

  console.log(`[Consolidation] Starting ${dryRun ? 'DRY RUN' : 'production'} consolidation...`);

  // Start run tracking
  const runResult = await query(
    `INSERT INTO consolidation_runs
     (run_type, status, dry_run)
     VALUES ($1, 'running', $2)
     RETURNING id, started_at`,
    [dryRun ? 'dry_run' : 'nightly', dryRun]
  );
  const runId = runResult.rows[0].id;

  const stats = {
    runId,
    processed: 0,
    totalPromoted: 0,
    totalDecayed: 0,
    anchorsStrengthened: 0,
    errors: []
  };

  try {
    // Get users with unconsolidated STM
    const usersResult = await query(
      `SELECT DISTINCT user_id, profile_id
       FROM user_stm
       WHERE NOT consolidated
       ORDER BY MAX(created_at) DESC
       LIMIT $1`,
      [limitUsers]
    );
    const users = usersResult.rows;

    console.log(`[Consolidation] Found ${users.length} users to process`);

    // Process each user
    for (const user of users) {
      try {
        const result = await consolidateUserSTM(
          null, // Use pool query (not injected client)
          user.user_id,
          user.profile_id,
          { dryRun, runId }
        );

        stats.totalPromoted += result.promoted;
        stats.totalPending = (stats.totalPending || 0) + (result.pending || 0);
        stats.totalDecayed += result.decayed;
        stats.processed++;

        // Update progress every 50 users
        if (stats.processed % 50 === 0) {
          await query(
            `UPDATE consolidation_runs
             SET user_stm_processed = $1, promoted_count = $2, decayed_count = $3
             WHERE id = $4`,
            [stats.processed, stats.totalPromoted, stats.totalDecayed, runId]
          );
        }
      } catch (err) {
        console.error(`[Consolidation] Error processing ${user.user_id}:`, err.message);
        stats.errors.push({ userId: user.user_id, error: err.message });
      }
    }

    // Strengthen anchors using imported manager
    if (!dryRun) {
      const pool = getPool();
      const client = await pool.connect();
      try {
        stats.anchorsStrengthened = await strengthenAnchors(client, runId);
      } finally {
        client.release();
      }
    }

    // Mark run complete
    await query(
      `UPDATE consolidation_runs
       SET status = 'completed',
           completed_at = NOW(),
           user_stm_processed = $1,
           promoted_count = $2,
           decayed_count = $3,
           anchors_strengthened = $4,
           error_count = $5,
           error_message = $6
       WHERE id = $7`,
      [
        stats.processed,
        stats.totalPromoted,
        stats.totalDecayed,
        stats.anchorsStrengthened,
        stats.errors.length,
        stats.errors.length > 0 ? JSON.stringify(stats.errors.slice(0, 5)) : null,
        runId
      ]
    );

    console.log('[Consolidation] Complete:', stats);
    return stats;

  } catch (err) {
    // Mark run failed
    await query(
      `UPDATE consolidation_runs
       SET status = 'failed', completed_at = NOW(), error_message = $1
       WHERE id = $2`,
      [err.message, runId]
    );
    throw err;
  }
}

// ============================================================================
// USER STM CONSOLIDATION
// ============================================================================

/**
 * Consolidate a single user's STM entries
 * Supports client injection for testability
 *
 * @param {Object} client - pg client (injected for testing, uses pool.query if null)
 * @param {string} userId
 * @param {string} profileId
 * @param {Object} options - { dryRun, runId }
 * @returns {Object} - { promoted, pending, decayed }
 */
async function consolidateUserSTM(client, userId, profileId, { dryRun = false, runId = null } = {}) {
  // Use injected client or fall back to pool query
  const dbQuery = client ? client.query.bind(client) : query;
  const result = { promoted: 0, pending: 0, decayed: 0 };

  // Fetch candidate STM entries
  const stmResult = await dbQuery(
    `SELECT id, content, mention_count, emotional_weight, emotional_valence,
            emotional_intensity, importance_score, created_at,
            constitutional_element, constitutional_pillar
     FROM user_stm
     WHERE user_id = $1 AND profile_id = $2 AND NOT consolidated
     ORDER BY created_at DESC
     LIMIT 200`,
    [userId, profileId]
  );
  const entries = stmResult.rows;

  if (entries.length === 0) {
    return result;
  }

  // Score each entry
  const scored = entries.map(stm => ({
    stm,
    scores: scoreSTMEntry(stm)
  }));

  // Sort by total score descending
  scored.sort((a, b) => b.scores.total - a.scores.total);

  let promotionCount = 0;
  const pendingBatch = []; // Collect mid-score items for pending_promotions

  for (const { stm, scores } of scored) {
    // Check promotion limit
    if (promotionCount >= CONFIG.MAX_PROMOTIONS_PER_USER) break;

    // DECAY: Very old + low score entries
    if (scores.total < CONFIG.STM_DECAY_THRESHOLD && scores.ageDays > CONFIG.STM_DECAY_DAYS) {
      if (!dryRun) {
        await dbQuery('DELETE FROM user_stm WHERE id = $1', [stm.id]);
      }
      result.decayed++;
      continue;
    }

    // PROMOTE: High score entries (>= 0.65)
    if (scores.total >= CONFIG.STM_RELEVANCE_THRESHOLD) {
      if (!dryRun) {
        // Generate embedding for the content if enabled
        let embedding = null;
        if (CONFIG.GENERATE_EMBEDDINGS) {
          try {
            embedding = await embedText(stm.content);
          } catch (embErr) {
            console.warn(`[Consolidation] Embedding failed for STM ${stm.id}: ${embErr.message}`);
          }
        }

        // Store in LTM using helper with client injection
        const ltmId = await storeLTMEntry(client, {
          userId,
          profileId,
          content: stm.content,
          embedding,
          source: { stmIds: [stm.id] },
          meta: {
            contentType: 'consolidated',
            importanceScore: scores.total,
            constitutionalElement: stm.constitutional_element,
            emotionalValence: stm.emotional_valence,
            emotionalIntensity: stm.emotional_intensity
          }
        });

        // Log promotion for audit
        await dbQuery(
          `INSERT INTO memory_promotion_log
           (user_id, profile_id, stm_id, ltm_id, source_brain, reason, score,
            recency_score, mention_score, emotion_score, consolidation_run_id)
           VALUES ($1, $2, $3, $4, 'user', 'auto_promotion', $5, $6, $7, $8, $9)`,
          [
            userId, profileId, stm.id, ltmId,
            scores.total, scores.recency, scores.mention, scores.emotion,
            runId
          ]
        );

        // Mark STM as consolidated
        await dbQuery(
          `UPDATE user_stm
           SET consolidated = true, consolidated_at = NOW(), consolidated_to_id = $1
           WHERE id = $2`,
          [ltmId, stm.id]
        );
      }

      result.promoted++;
      promotionCount++;
    }
    // PENDING: Mid-score entries (0.45-0.65) - queue for human review
    else if (scores.total >= CONFIG.STM_PENDING_THRESHOLD) {
      pendingBatch.push({ stm, scores });
      result.pending++;
    }
  }

  // Store pending promotions for human review
  if (pendingBatch.length > 0 && !dryRun) {
    const stmIds = pendingBatch.map(p => p.stm.id);
    const combinedContent = pendingBatch.map(p => p.stm.content).join('\n\n---\n\n');
    const avgScore = pendingBatch.reduce((sum, p) => sum + p.scores.total, 0) / pendingBatch.length;

    await dbQuery(
      `INSERT INTO pending_promotions
       (user_id, profile_id, stm_ids, proposed_content, score, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [userId, profileId, stmIds, combinedContent, avgScore]
    );
  }

  return result;
}

// ============================================================================
// LLM-BASED CONSOLIDATION (Optional Enhancement)
// ============================================================================

/**
 * Consolidate using LLM extraction for richer content
 * Produces consolidated memories with titles, emotional essence, and themes
 *
 * @param {Object} client - pg client (injected for testing)
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} options - { dryRun, runId }
 * @returns {Object} - { promoted, pending, decayed, llmProposals }
 */
async function consolidateWithLLM(client, userId, profileId, { dryRun = false, runId = null } = {}) {
  const dbQuery = client ? client.query.bind(client) : query;
  const result = { promoted: 0, pending: 0, decayed: 0, llmProposals: [] };

  // Fetch candidate STM entries
  const stmResult = await dbQuery(
    `SELECT id, content, mention_count, emotional_weight, emotional_valence,
            emotional_intensity, importance_score, created_at,
            constitutional_element, constitutional_pillar
     FROM user_stm
     WHERE user_id = $1 AND profile_id = $2 AND NOT consolidated
     ORDER BY created_at DESC
     LIMIT 200`,
    [userId, profileId]
  );
  const entries = stmResult.rows;

  if (entries.length === 0) {
    return result;
  }

  // Score and decay old entries first (same as heuristic method)
  const scored = entries.map(stm => ({
    stm,
    scores: scoreSTMEntry(stm)
  }));

  // Handle decay for very old, low-score entries
  for (const { stm, scores } of scored) {
    if (scores.total < CONFIG.STM_DECAY_THRESHOLD && scores.ageDays > CONFIG.STM_DECAY_DAYS) {
      if (!dryRun) {
        await dbQuery('DELETE FROM user_stm WHERE id = $1', [stm.id]);
      }
      result.decayed++;
    }
  }

  // Get top entries for LLM processing
  const topForLLM = scored
    .filter(s => s.scores.total >= CONFIG.STM_PENDING_THRESHOLD)
    .slice(0, CONFIG.MAX_STM_FOR_LLM)
    .map(s => s.stm);

  if (topForLLM.length === 0) {
    return result;
  }

  // Call LLM extraction
  let llmResult = null;
  try {
    llmResult = await extractConsolidationWithLLM({
      userId,
      stmBatch: topForLLM
    });
    console.log(`[Consolidation] LLM returned ${llmResult.consolidatedMemories?.length || 0} memories`);
  } catch (err) {
    console.warn(`[Consolidation] LLM extraction failed, falling back to heuristic: ${err.message}`);
    // Fall back to heuristic consolidation
    return consolidateUserSTM(client, userId, profileId, { dryRun, runId });
  }

  // Process LLM-generated consolidated memories
  if (llmResult && Array.isArray(llmResult.consolidatedMemories)) {
    for (const mem of llmResult.consolidatedMemories) {
      // Validate sourceIds exist in STM batch
      const validSourceIds = validateSourceIds(mem.sourceIds, topForLLM);
      if (validSourceIds.length === 0) {
        console.warn('[Consolidation] LLM memory has no valid sourceIds, skipping');
        continue;
      }

      // Skip low-confidence extractions
      if (mem.confidence < 0.5) {
        result.llmProposals.push({
          type: 'low_confidence',
          content: mem.consolidatedEvent,
          confidence: mem.confidence,
          sourceIds: validSourceIds
        });
        continue;
      }

      if (!dryRun) {
        // Generate embedding for consolidated content
        const consolidatedText = `${mem.consolidatedEvent}. ${mem.emotionalEssence}`;
        let embedding = null;
        if (CONFIG.GENERATE_EMBEDDINGS) {
          try {
            embedding = await embedText(consolidatedText);
          } catch (embErr) {
            console.warn(`[Consolidation] Embedding failed: ${embErr.message}`);
          }
        }

        // Store in LTM with rich metadata
        const ltmId = await storeLTMEntry(client, {
          userId,
          profileId,
          content: mem.consolidatedEvent,
          embedding,
          source: { stmIds: validSourceIds },
          meta: {
            contentType: 'llm_consolidated',
            emotionalEssence: mem.emotionalEssence,
            coreThemes: mem.coreThemes,
            timeframe: mem.timeframe,
            importanceScore: mem.confidence,
            consolidatedFromCount: validSourceIds.length
          }
        });

        // Log promotion
        await dbQuery(
          `INSERT INTO memory_promotion_log
           (user_id, profile_id, stm_id, ltm_id, source_brain, reason, score, consolidation_run_id)
           VALUES ($1, $2, $3, $4, 'user', 'llm_promotion', $5, $6)`,
          [userId, profileId, validSourceIds[0], ltmId, mem.confidence, runId]
        );

        // Mark all source STMs as consolidated
        await dbQuery(
          `UPDATE user_stm
           SET consolidated = true, consolidated_at = NOW(), consolidated_to_id = $1
           WHERE id = ANY($2)`,
          [ltmId, validSourceIds]
        );

        result.promoted++;
      } else {
        // Dry run: collect proposals
        result.llmProposals.push({
          type: 'llm_promote',
          content: mem.consolidatedEvent,
          emotionalEssence: mem.emotionalEssence,
          coreThemes: mem.coreThemes,
          confidence: mem.confidence,
          sourceIds: validSourceIds
        });
        result.promoted++;
      }
    }
  }

  // Store Luna patterns if any (optional - for Luna's self-awareness)
  if (llmResult && Array.isArray(llmResult.lunaPatterns) && llmResult.lunaPatterns.length > 0) {
    for (const pattern of llmResult.lunaPatterns) {
      if (pattern.confidence >= 0.6 && !dryRun) {
        // Could store in luna_ltm or a patterns table
        console.log(`[Consolidation] Luna pattern detected: ${pattern.patternName}`);
      }
    }
  }

  return result;
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

/**
 * Get consolidation run history
 */
async function getConsolidationRuns(limit = 10) {
  const result = await query(
    `SELECT id, run_type, status, dry_run, started_at, completed_at,
            user_stm_processed, promoted_count, decayed_count,
            anchors_strengthened, error_count, error_message,
            EXTRACT(EPOCH FROM (completed_at - started_at)) as duration_seconds
     FROM consolidation_runs
     ORDER BY started_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows;
}

/**
 * Get promotion logs for a specific run
 */
async function getPromotionLogs(runId, limit = 100) {
  const result = await query(
    `SELECT id, user_id, profile_id, stm_id, ltm_id, reason, score,
            recency_score, mention_score, emotion_score, created_at
     FROM memory_promotion_log
     WHERE consolidation_run_id = $1
     ORDER BY score DESC
     LIMIT $2`,
    [runId, limit]
  );

  return result.rows;
}

/**
 * Get promotion statistics
 */
async function getPromotionStats(days = 30) {
  const result = await query(
    `SELECT
       COUNT(*) as total_promotions,
       AVG(score) as avg_score,
       MIN(score) as min_score,
       MAX(score) as max_score,
       COUNT(DISTINCT user_id) as unique_users
     FROM memory_promotion_log
     WHERE created_at > NOW() - ($1 || ' days')::INTERVAL`,
    [days]
  );

  return result.rows[0];
}

/**
 * Manually trigger consolidation for a single user
 */
async function triggerUserConsolidation(userId, profileId, dryRun = false) {
  console.log(`[Consolidation] Manual trigger for ${userId}/${profileId}`);

  // Create a run record
  const runResult = await query(
    `INSERT INTO consolidation_runs (run_type, status, dry_run)
     VALUES ('manual', 'running', $1)
     RETURNING id`,
    [dryRun]
  );
  const runId = runResult.rows[0].id;

  try {
    const result = await consolidateUserSTM(null, userId, profileId, { dryRun, runId });

    await query(
      `UPDATE consolidation_runs
       SET status = 'completed', completed_at = NOW(),
           user_stm_processed = 1, promoted_count = $1, decayed_count = $2
       WHERE id = $3`,
      [result.promoted, result.decayed, runId]
    );

    return { runId, ...result };

  } catch (err) {
    await query(
      `UPDATE consolidation_runs
       SET status = 'failed', completed_at = NOW(), error_message = $1
       WHERE id = $2`,
      [err.message, runId]
    );
    throw err;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main job
  runConsolidationJob,

  // User consolidation
  consolidateUserSTM,
  consolidateWithLLM,
  scoreSTMEntry,

  // Admin functions
  getConsolidationRuns,
  getPromotionLogs,
  getPromotionStats,
  triggerUserConsolidation,

  // Config (for testing)
  CONFIG
};
