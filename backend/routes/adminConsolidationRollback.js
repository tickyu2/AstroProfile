/**
 * ============================================================================
 * ADMIN CONSOLIDATION ROLLBACK ROUTES
 * ============================================================================
 * Express routes for reverting LTM promotions and viewing revert history.
 * Ready-to-paste file for Express backend integration.
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

import express from 'express';
import { pool } from '../db/pool.js';
import { requireRole, logAdminAction } from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin role
router.use(requireRole('admin'));

// ============================================================================
// POST /api/admin/consolidation/rollback
// ============================================================================
/**
 * Revert one or more LTM promotions
 *
 * Body:
 * {
 *   "ltmIds": ["uuid", ...],           // optional if promotionLogIds provided
 *   "promotionLogIds": [123, ...],     // optional if ltmIds provided
 *   "reason": "string"                  // required
 * }
 *
 * Behavior:
 * - Resolve ltmIds from promotionLogIds if provided
 * - Mark LTM rows reverted = true (soft revert)
 * - Restore STM rows: consolidated = false, consolidated_to = NULL
 * - Write consolidation_revert_log with before/after snapshots
 * - Log admin action via logAdminAction
 */
router.post('/consolidation/rollback', express.json(), async (req, res) => {
  const { ltmIds = [], promotionLogIds = [], reason } = req.body || {};
  const actor = req.user?.id || 'unknown';
  const requestId = req.headers['x-request-id'] || null;

  // Validation
  if ((!Array.isArray(ltmIds) || ltmIds.length === 0) &&
      (!Array.isArray(promotionLogIds) || promotionLogIds.length === 0)) {
    return res.status(400).json({ error: 'ltmIds or promotionLogIds required' });
  }

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'reason required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Resolve ltmIds from promotionLogIds if provided
    let resolvedLtmIds = Array.isArray(ltmIds) ? [...ltmIds] : [];

    if (Array.isArray(promotionLogIds) && promotionLogIds.length > 0) {
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
    resolvedLtmIds = Array.from(new Set(resolvedLtmIds));

    if (resolvedLtmIds.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'no_ltm_found_for_revert' });
    }

    // Fetch promotion log rows for provenance and STM IDs
    const promoLogQuery = `
      SELECT id AS promo_id, user_id, profile_id, stm_id, ltm_id, score, created_at
      FROM memory_promotion_log
      WHERE ltm_id = ANY($1)
      ORDER BY created_at ASC
    `;
    const promoLogResult = await client.query(promoLogQuery, [resolvedLtmIds]);
    const promoRows = promoLogResult.rows;

    // Get user/profile from first row
    const userId = promoRows[0]?.user_id || 'unknown';
    const profileId = promoRows[0]?.profile_id || 'default';

    // Aggregate STM IDs to restore
    const stmIdsToRestore = promoRows.map(r => r.stm_id).filter(Boolean);
    const uniqueStmIds = Array.from(new Set(stmIdsToRestore));

    // Snapshot BEFORE state for audit
    const beforeLtm = await client.query(
      `SELECT * FROM user_long_term_memory WHERE id = ANY($1)`,
      [resolvedLtmIds]
    );
    const beforeStm = uniqueStmIds.length > 0
      ? await client.query(
          `SELECT id, consolidated, consolidated_to FROM user_short_term_memory WHERE id = ANY($1)`,
          [uniqueStmIds]
        )
      : { rows: [] };

    // Mark LTM rows as reverted (soft revert)
    await client.query(
      `UPDATE user_long_term_memory
       SET reverted = TRUE, reverted_at = NOW()
       WHERE id = ANY($1)`,
      [resolvedLtmIds]
    );

    // Restore STM rows: clear consolidated flags
    if (uniqueStmIds.length > 0) {
      await client.query(
        `UPDATE user_short_term_memory
         SET consolidated = FALSE, consolidated_at = NULL, consolidated_to = NULL
         WHERE id = ANY($1)`,
        [uniqueStmIds]
      );
    }

    // Snapshot AFTER state
    const afterLtm = await client.query(
      `SELECT * FROM user_long_term_memory WHERE id = ANY($1)`,
      [resolvedLtmIds]
    );
    const afterStm = uniqueStmIds.length > 0
      ? await client.query(
          `SELECT id, consolidated, consolidated_to FROM user_short_term_memory WHERE id = ANY($1)`,
          [uniqueStmIds]
        )
      : { rows: [] };

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
      JSON.stringify({ ltm: beforeLtm.rows, stm: beforeStm.rows, promotions: promoRows }),
      JSON.stringify({ ltm: afterLtm.rows, stm: afterStm.rows })
    ]);

    // Log admin action
    await logAdminAction(actor, 'consolidation.revert', {
      ltmIds: resolvedLtmIds,
      stmIds: uniqueStmIds,
      reason
    }, requestId);

    await client.query('COMMIT');

    res.json({
      ok: true,
      revertId: logResult.rows[0].id,
      revertedAt: logResult.rows[0].created_at,
      ltmIds: resolvedLtmIds,
      restoredStmIds: uniqueStmIds
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Rollback error:', err);
    res.status(500).json({ error: 'rollback_failed', message: err.message });
  } finally {
    client.release();
  }
});

// ============================================================================
// GET /api/admin/consolidation/reverts
// ============================================================================
/**
 * List recent reverts for audit
 * Query: ?limit=50&userId=xxx
 */
router.get('/consolidation/reverts', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 500);
  const userId = req.query.userId;

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
      params = [userId, limit];
    } else {
      query = `
        SELECT id, actor, reason, created_at, ltm_ids, restored_stm_ids, user_id, profile_id
        FROM consolidation_revert_log
        ORDER BY created_at DESC
        LIMIT $1
      `;
      params = [limit];
    }

    const result = await client.query(query, params);
    res.json(result.rows);

  } catch (err) {
    console.error('GET reverts error:', err);
    res.status(500).json({ error: 'internal_error' });
  } finally {
    client.release();
  }
});

// ============================================================================
// GET /api/admin/consolidation/revert/:id
// ============================================================================
/**
 * Get full details of a specific revert including snapshots
 */
router.get('/consolidation/revert/:id', async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT * FROM consolidation_revert_log WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'not_found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error('GET revert detail error:', err);
    res.status(500).json({ error: 'internal_error' });
  } finally {
    client.release();
  }
});

// ============================================================================
// POST /api/admin/consolidation/reenable
// ============================================================================
/**
 * Re-enable previously reverted LTM entries
 * Body: { ltmIds: [...], reason: "..." }
 */
router.post('/consolidation/reenable', express.json(), async (req, res) => {
  const { ltmIds, reason } = req.body || {};
  const actor = req.user?.id || 'unknown';
  const requestId = req.headers['x-request-id'] || null;

  if (!Array.isArray(ltmIds) || ltmIds.length === 0) {
    return res.status(400).json({ error: 'ltmIds required' });
  }

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'reason required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Only re-enable if currently reverted
    const result = await client.query(
      `UPDATE user_long_term_memory
       SET reverted = FALSE, reverted_at = NULL
       WHERE id = ANY($1) AND reverted = TRUE
       RETURNING id`,
      [ltmIds]
    );

    const reenabledIds = result.rows.map(r => r.id);

    await logAdminAction(actor, 'consolidation.reenable', {
      ltmIds: reenabledIds,
      reason
    }, requestId);

    await client.query('COMMIT');

    res.json({
      ok: true,
      reenabledIds,
      message: `Re-enabled ${reenabledIds.length} LTM entries`
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Re-enable error:', err);
    res.status(500).json({ error: 'reenable_failed', message: err.message });
  } finally {
    client.release();
  }
});

// ============================================================================
// GET /api/admin/consolidation/eligibility
// ============================================================================
/**
 * Check which LTM entries can be reverted
 * Query: ?ltmIds=uuid1,uuid2,...
 */
router.get('/consolidation/eligibility', async (req, res) => {
  const ltmIdsParam = req.query.ltmIds;

  if (!ltmIdsParam) {
    return res.status(400).json({ error: 'ltmIds query parameter required' });
  }

  const ltmIds = ltmIdsParam.split(',').map(s => s.trim()).filter(Boolean);

  if (ltmIds.length === 0) {
    return res.status(400).json({ error: 'No valid ltmIds provided' });
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT id, reverted, reverted_at, user_id, content
       FROM user_long_term_memory
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

    // Mark not-found IDs
    for (const id of ltmIds) {
      if (!found.has(id)) {
        ineligible.push({ id, reason: 'not_found' });
      }
    }

    res.json({ eligible, ineligible });

  } catch (err) {
    console.error('Eligibility check error:', err);
    res.status(500).json({ error: 'internal_error' });
  } finally {
    client.release();
  }
});

export default router;
