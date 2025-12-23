/**
 * ============================================================================
 * CONSOLIDATION ROLLBACK API
 * ============================================================================
 * Firebase callable functions for safely reverting LTM promotions.
 * Supports both soft revert (marking as reverted) and full audit logging.
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { getPool } = require('../database/pool');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  MAX_BATCH_SIZE: 50,        // Max LTM IDs per revert request
  REQUIRE_REASON: true,      // Require reason for all reverts
  HARD_DELETE: false,        // Soft revert by default (safer)
  ADMIN_ROLES: ['admin', 'super_admin']
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate admin role from Firebase Auth custom claims
 */
function validateAdminRole(auth) {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const isAdmin = auth.token?.admin === true ||
                  CONFIG.ADMIN_ROLES.includes(auth.token?.role);

  if (!isAdmin) {
    throw new HttpsError('permission-denied', 'Admin role required for rollback operations');
  }

  return auth.uid;
}

/**
 * Log admin action for audit trail
 */
async function logAdminAction(client, actor, action, payload = {}) {
  try {
    await client.query(
      `INSERT INTO admin_audit_log (actor, action, payload, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [actor, action, JSON.stringify(payload)]
    );
  } catch (err) {
    // Don't fail the operation if audit logging fails
    console.warn('[Rollback] Audit log write failed:', err.message);
  }
}

// ============================================================================
// REVERT CONSOLIDATION
// ============================================================================

/**
 * Revert one or more LTM promotions
 *
 * @param {Object} data
 * @param {string[]} data.ltmIds - LTM IDs to revert (optional if promotionLogIds provided)
 * @param {number[]} data.promotionLogIds - Promotion log IDs to revert (resolves to ltmIds)
 * @param {string} data.reason - Required reason for the revert
 * @returns {Object} { ok, revertId, ltmIds, restoredStmIds }
 */
exports.revertConsolidation = onCall(
  { memory: '512MiB', timeoutSeconds: 60 },
  async (request) => {
    const actor = validateAdminRole(request.auth);
    const { ltmIds = [], promotionLogIds = [], reason } = request.data || {};

    // Validation
    if ((!Array.isArray(ltmIds) || ltmIds.length === 0) &&
        (!Array.isArray(promotionLogIds) || promotionLogIds.length === 0)) {
      throw new HttpsError('invalid-argument', 'ltmIds or promotionLogIds required');
    }

    if (CONFIG.REQUIRE_REASON && (!reason || !reason.trim())) {
      throw new HttpsError('invalid-argument', 'Reason is required for rollback');
    }

    if (ltmIds.length > CONFIG.MAX_BATCH_SIZE) {
      throw new HttpsError('invalid-argument', `Max ${CONFIG.MAX_BATCH_SIZE} LTM IDs per request`);
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Resolve ltmIds from promotionLogIds if provided
      let resolvedLtmIds = [...ltmIds];
      if (promotionLogIds && promotionLogIds.length > 0) {
        const promoQuery = `
          SELECT DISTINCT ltm_id
          FROM memory_promotion_log
          WHERE id = ANY($1) AND ltm_id IS NOT NULL
        `;
        const promoResult = await client.query(promoQuery, [promotionLogIds]);
        for (const row of promoResult.rows) {
          if (row.ltm_id) resolvedLtmIds.push(row.ltm_id);
        }
      }

      // Deduplicate
      resolvedLtmIds = [...new Set(resolvedLtmIds)];

      if (resolvedLtmIds.length === 0) {
        await client.query('ROLLBACK');
        throw new HttpsError('not-found', 'No LTM entries found for revert');
      }

      // Fetch affected LTM rows and associated promotion logs
      const promoLogQuery = `
        SELECT id AS promo_id, user_id, profile_id, stm_id, ltm_id, score, created_at
        FROM memory_promotion_log
        WHERE ltm_id = ANY($1)
        ORDER BY created_at ASC
      `;
      const promoLogResult = await client.query(promoLogQuery, [resolvedLtmIds]);
      const promoRows = promoLogResult.rows;

      // Get user_id and profile_id from first row (should all be same user)
      const userId = promoRows[0]?.user_id || 'unknown';
      const profileId = promoRows[0]?.profile_id || 'default';

      // Aggregate STM IDs to restore
      const stmIdsToRestore = promoRows
        .map(r => r.stm_id)
        .filter(Boolean);
      const uniqueStmIds = [...new Set(stmIdsToRestore)];

      // Snapshot BEFORE state for audit
      const beforeLtmResult = await client.query(
        `SELECT * FROM user_ltm WHERE id = ANY($1)`,
        [resolvedLtmIds]
      );
      const beforeStmResult = await client.query(
        `SELECT id, consolidated, consolidated_at, consolidated_to
         FROM user_stm WHERE id = ANY($1)`,
        [uniqueStmIds]
      );

      const beforeSnapshot = {
        ltm: beforeLtmResult.rows,
        stm: beforeStmResult.rows,
        promotions: promoRows
      };

      // Mark LTM rows as reverted (soft revert)
      await client.query(
        `UPDATE user_ltm
         SET reverted = TRUE, reverted_at = NOW(), reverted_by = $2
         WHERE id = ANY($1)`,
        [resolvedLtmIds, actor]
      );

      // Optional: hard delete if configured
      if (CONFIG.HARD_DELETE) {
        await client.query(
          `DELETE FROM user_ltm WHERE id = ANY($1)`,
          [resolvedLtmIds]
        );
      }

      // Restore STM rows: clear consolidated flags
      if (uniqueStmIds.length > 0) {
        await client.query(
          `UPDATE user_stm
           SET consolidated = FALSE, consolidated_at = NULL, consolidated_to = NULL
           WHERE id = ANY($1)`,
          [uniqueStmIds]
        );
      }

      // Snapshot AFTER state for audit
      const afterLtmResult = await client.query(
        `SELECT * FROM user_ltm WHERE id = ANY($1)`,
        [resolvedLtmIds]
      );
      const afterStmResult = await client.query(
        `SELECT id, consolidated, consolidated_at, consolidated_to
         FROM user_stm WHERE id = ANY($1)`,
        [uniqueStmIds]
      );

      const afterSnapshot = {
        ltm: afterLtmResult.rows,
        stm: afterStmResult.rows
      };

      // Write immutable revert log
      const insertLogQuery = `
        INSERT INTO consolidation_revert_log (
          actor, reason, ltm_ids, restored_stm_ids,
          user_id, profile_id, before_snapshot, after_snapshot
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, created_at
      `;
      const logResult = await client.query(insertLogQuery, [
        actor,
        reason,
        resolvedLtmIds,
        uniqueStmIds,
        userId,
        profileId,
        JSON.stringify(beforeSnapshot),
        JSON.stringify(afterSnapshot)
      ]);

      const revertId = logResult.rows[0].id;
      const revertedAt = logResult.rows[0].created_at;

      // Log admin action
      await logAdminAction(client, actor, 'consolidation.revert', {
        revertId,
        ltmIds: resolvedLtmIds,
        stmIds: uniqueStmIds,
        reason
      });

      await client.query('COMMIT');

      console.log(`[Rollback] Reverted ${resolvedLtmIds.length} LTM entries, restored ${uniqueStmIds.length} STM entries`);

      return {
        success: true,
        revertId,
        revertedAt,
        ltmIds: resolvedLtmIds,
        restoredStmIds: uniqueStmIds,
        message: `Reverted ${resolvedLtmIds.length} LTM entries`
      };

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[Rollback] Error:', err);

      if (err instanceof HttpsError) throw err;
      throw new HttpsError('internal', 'Rollback failed: ' + err.message);
    } finally {
      client.release();
    }
  }
);

// ============================================================================
// GET REVERT HISTORY
// ============================================================================

/**
 * Get list of recent reverts for audit
 *
 * @param {Object} data
 * @param {number} data.limit - Max entries to return (default 50)
 * @param {string} data.userId - Filter by user (optional)
 * @returns {Object} { success, reverts: [...] }
 */
exports.getRevertHistory = onCall(
  { memory: '256MiB', timeoutSeconds: 30 },
  async (request) => {
    validateAdminRole(request.auth);
    const { limit = 50, userId } = request.data || {};

    const safeLimit = Math.min(parseInt(limit, 10) || 50, 500);
    const pool = getPool();
    const client = await pool.connect();

    try {
      let query;
      let params;

      if (userId) {
        query = `
          SELECT id, actor, reason, created_at, ltm_ids, restored_stm_ids, user_id, profile_id
          FROM consolidation_revert_log
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT $2
        `;
        params = [userId, safeLimit];
      } else {
        query = `
          SELECT id, actor, reason, created_at, ltm_ids, restored_stm_ids, user_id, profile_id
          FROM consolidation_revert_log
          ORDER BY created_at DESC
          LIMIT $1
        `;
        params = [safeLimit];
      }

      const result = await client.query(query, params);

      return {
        success: true,
        reverts: result.rows.map(row => ({
          id: row.id,
          actor: row.actor,
          reason: row.reason,
          createdAt: row.created_at,
          ltmCount: row.ltm_ids?.length || 0,
          stmCount: row.restored_stm_ids?.length || 0,
          userId: row.user_id,
          profileId: row.profile_id
        }))
      };

    } catch (err) {
      console.error('[Rollback] getRevertHistory error:', err);
      throw new HttpsError('internal', 'Failed to fetch revert history');
    } finally {
      client.release();
    }
  }
);

// ============================================================================
// GET REVERT DETAIL
// ============================================================================

/**
 * Get full details of a specific revert for audit
 *
 * @param {Object} data
 * @param {number} data.revertId - Revert log ID
 * @returns {Object} { success, revert: {...} }
 */
exports.getRevertDetail = onCall(
  { memory: '256MiB', timeoutSeconds: 30 },
  async (request) => {
    validateAdminRole(request.auth);
    const { revertId } = request.data || {};

    if (!revertId) {
      throw new HttpsError('invalid-argument', 'revertId required');
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT * FROM consolidation_revert_log WHERE id = $1`,
        [revertId]
      );

      if (result.rows.length === 0) {
        throw new HttpsError('not-found', 'Revert not found');
      }

      const row = result.rows[0];

      return {
        success: true,
        revert: {
          id: row.id,
          actor: row.actor,
          reason: row.reason,
          createdAt: row.created_at,
          ltmIds: row.ltm_ids,
          restoredStmIds: row.restored_stm_ids,
          userId: row.user_id,
          profileId: row.profile_id,
          beforeSnapshot: row.before_snapshot,
          afterSnapshot: row.after_snapshot
        }
      };

    } catch (err) {
      if (err instanceof HttpsError) throw err;
      console.error('[Rollback] getRevertDetail error:', err);
      throw new HttpsError('internal', 'Failed to fetch revert detail');
    } finally {
      client.release();
    }
  }
);

// ============================================================================
// CHECK REVERT ELIGIBILITY
// ============================================================================

/**
 * Check if specific LTM entries can be reverted (not already reverted, etc.)
 *
 * @param {Object} data
 * @param {string[]} data.ltmIds - LTM IDs to check
 * @returns {Object} { success, eligible: [...], ineligible: [...] }
 */
exports.checkRevertEligibility = onCall(
  { memory: '256MiB', timeoutSeconds: 30 },
  async (request) => {
    validateAdminRole(request.auth);
    const { ltmIds } = request.data || {};

    if (!Array.isArray(ltmIds) || ltmIds.length === 0) {
      throw new HttpsError('invalid-argument', 'ltmIds array required');
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT id, reverted, reverted_at, user_id, content
         FROM user_ltm
         WHERE id = ANY($1)`,
        [ltmIds]
      );

      const found = new Set(result.rows.map(r => r.id));
      const eligible = [];
      const ineligible = [];

      for (const row of result.rows) {
        if (row.reverted) {
          ineligible.push({
            id: row.id,
            reason: 'already_reverted',
            revertedAt: row.reverted_at
          });
        } else {
          eligible.push({
            id: row.id,
            userId: row.user_id,
            contentPreview: (row.content || '').slice(0, 100)
          });
        }
      }

      // Check for IDs not found
      for (const id of ltmIds) {
        if (!found.has(id)) {
          ineligible.push({
            id,
            reason: 'not_found'
          });
        }
      }

      return {
        success: true,
        eligible,
        ineligible
      };

    } catch (err) {
      console.error('[Rollback] checkRevertEligibility error:', err);
      throw new HttpsError('internal', 'Failed to check eligibility');
    } finally {
      client.release();
    }
  }
);

// ============================================================================
// RE-ENABLE REVERTED LTM (Undo a revert)
// ============================================================================

/**
 * Re-enable a previously reverted LTM entry
 * Use with caution - this restores soft-deleted data
 *
 * @param {Object} data
 * @param {string[]} data.ltmIds - LTM IDs to re-enable
 * @param {string} data.reason - Required reason
 * @returns {Object} { success, reenabledIds }
 */
exports.reEnableRevertedLtm = onCall(
  { memory: '256MiB', timeoutSeconds: 30 },
  async (request) => {
    const actor = validateAdminRole(request.auth);
    const { ltmIds, reason } = request.data || {};

    if (!Array.isArray(ltmIds) || ltmIds.length === 0) {
      throw new HttpsError('invalid-argument', 'ltmIds array required');
    }

    if (!reason || !reason.trim()) {
      throw new HttpsError('invalid-argument', 'Reason required');
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Only re-enable if currently reverted
      const result = await client.query(
        `UPDATE user_ltm
         SET reverted = FALSE, reverted_at = NULL, reverted_by = NULL
         WHERE id = ANY($1) AND reverted = TRUE
         RETURNING id`,
        [ltmIds]
      );

      const reenabledIds = result.rows.map(r => r.id);

      // Log admin action
      await logAdminAction(client, actor, 'consolidation.reenable', {
        ltmIds: reenabledIds,
        reason
      });

      await client.query('COMMIT');

      return {
        success: true,
        reenabledIds,
        message: `Re-enabled ${reenabledIds.length} LTM entries`
      };

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[Rollback] reEnableRevertedLtm error:', err);
      throw new HttpsError('internal', 'Failed to re-enable LTM entries');
    } finally {
      client.release();
    }
  }
);
