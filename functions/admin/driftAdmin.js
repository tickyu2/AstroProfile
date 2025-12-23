/**
 * ============================================================================
 * DRIFT ADMIN ENDPOINTS
 * ============================================================================
 * Admin API for managing global and per-user personality drift.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { query, withTransaction } = require('../database/pool');
const { logAdminAction, ROLES } = require('./middleware');
const drift = require('../drift');

// ============================================================================
// GLOBAL DRIFT
// ============================================================================

/**
 * Get global drift configuration
 */
async function getGlobalDriftConfig() {
  const globalDrift = await drift.getGlobalDrift();
  const history = await drift.getDriftHistory('global', null, 'default', 10);

  return {
    config: globalDrift,
    recentHistory: history,
    bounds: drift.DRIFT_BOUNDS.global
  };
}

/**
 * Update global drift configuration
 */
async function updateGlobalDriftConfig(actor, requestId, updates, reason) {
  const before = await drift.getGlobalDrift();

  // Validate bounds
  const bounds = drift.DRIFT_BOUNDS.global;
  for (const [param, value] of Object.entries(updates)) {
    if (param.endsWith('Delta') && bounds[param.replace('Delta', '')]) {
      const paramBounds = bounds[param.replace('Delta', '')];
      if (value < paramBounds.min || value > paramBounds.max) {
        throw new Error(`${param} value ${value} outside bounds [${paramBounds.min}, ${paramBounds.max}]`);
      }
    }
  }

  // Apply updates
  await query(`
    UPDATE global_drift_config SET
      warmth_delta = COALESCE($1, warmth_delta),
      advice_bias_delta = COALESCE($2, advice_bias_delta),
      pace_delta = COALESCE($3, pace_delta),
      responsiveness_delta = COALESCE($4, responsiveness_delta),
      backchannel_delta = COALESCE($5, backchannel_delta),
      mirroring_delta = COALESCE($6, mirroring_delta),
      drift_rate = COALESCE($7, drift_rate),
      is_enabled = COALESCE($8, is_enabled),
      updated_at = NOW()
    WHERE id = 1
  `, [
    updates.warmthDelta,
    updates.adviceBiasDelta,
    updates.paceDelta,
    updates.responsivenessDelta,
    updates.backchannelDelta,
    updates.mirroringDelta,
    updates.driftRate,
    updates.isEnabled
  ]);

  const after = await drift.getGlobalDrift();

  // Audit
  const auditId = await logAdminAction({
    actor,
    action: 'update_global_drift',
    targetType: 'global_drift',
    targetId: 'global',
    before,
    after,
    reason,
    requestId
  });

  return { before, after, auditId };
}

/**
 * Force global drift update (apply accumulated signals)
 */
async function forceGlobalDriftUpdate(actor, requestId, reason) {
  const before = await drift.getGlobalDrift();
  const result = await drift.forceGlobalDriftUpdate();
  const after = await drift.getGlobalDrift();

  const auditId = await logAdminAction({
    actor,
    action: 'force_global_drift_update',
    targetType: 'global_drift',
    targetId: 'global',
    before,
    after,
    reason,
    requestId,
    metadata: { result }
  });

  return { result, before, after, auditId };
}

/**
 * Get global drift history
 */
async function getGlobalDriftHistory(limit = 50, offset = 0) {
  const result = await query(`
    SELECT * FROM drift_history
    WHERE scope = 'global'
    ORDER BY recorded_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  return result.rows;
}

/**
 * Rollback global drift to a previous state
 */
async function rollbackGlobalDrift(actor, requestId, historyId, reason) {
  return withTransaction(async (client) => {
    // Get history entry
    const historyResult = await client.query(
      `SELECT * FROM drift_history WHERE id = $1 AND scope = 'global'`,
      [historyId]
    );

    if (historyResult.rowCount === 0) {
      throw new Error('History entry not found');
    }

    const historyEntry = historyResult.rows[0];
    const before = await drift.getGlobalDrift();

    // Apply rollback (restore to values before this change)
    await client.query(`
      UPDATE global_drift_config SET
        warmth_delta = $1,
        advice_bias_delta = $2,
        pace_delta = $3,
        responsiveness_delta = $4,
        backchannel_delta = $5,
        mirroring_delta = $6,
        updated_at = NOW()
      WHERE id = 1
    `, [
      historyEntry.warmth_delta,
      historyEntry.advice_bias_delta,
      historyEntry.pace_delta,
      historyEntry.responsiveness_delta,
      historyEntry.backchannel_delta,
      historyEntry.mirroring_delta
    ]);

    // Record rollback in history
    await client.query(`
      INSERT INTO drift_history (
        scope, warmth_delta, advice_bias_delta, pace_delta,
        responsiveness_delta, backchannel_delta, mirroring_delta,
        reason, notes
      ) VALUES (
        'global', $1, $2, $3, $4, $5, $6, 'admin_rollback', $7
      )
    `, [
      historyEntry.warmth_delta,
      historyEntry.advice_bias_delta,
      historyEntry.pace_delta,
      historyEntry.responsiveness_delta,
      historyEntry.backchannel_delta,
      historyEntry.mirroring_delta,
      JSON.stringify({ rolledBackTo: historyId, by: actor.email })
    ]);

    const after = await drift.getGlobalDrift();

    const auditId = await logAdminAction({
      actor,
      action: 'rollback_global_drift',
      targetType: 'global_drift',
      targetId: 'global',
      before,
      after,
      reason,
      requestId,
      metadata: { rolledBackToHistoryId: historyId }
    });

    return { before, after, auditId };
  });
}

/**
 * Toggle global drift kill switch
 */
async function toggleGlobalDriftEnabled(actor, requestId, enabled, reason) {
  const before = await drift.getGlobalDrift();

  await query(`
    UPDATE global_drift_config SET is_enabled = $1, updated_at = NOW()
    WHERE id = 1
  `, [enabled]);

  const after = await drift.getGlobalDrift();

  const auditId = await logAdminAction({
    actor,
    action: enabled ? 'enable_global_drift' : 'disable_global_drift',
    targetType: 'global_drift',
    targetId: 'global',
    before,
    after,
    reason,
    requestId
  });

  return { before, after, auditId };
}

// ============================================================================
// USER DRIFT
// ============================================================================

/**
 * Search users with drift data
 */
async function searchUserDrift(searchTerm, limit = 50, offset = 0) {
  const result = await query(`
    SELECT
      user_id, profile_id,
      warmth_delta, advice_bias_delta, pace_delta,
      responsiveness_delta, backchannel_delta, mirroring_delta,
      signal_count, total_interactions,
      relationship_sentiment, engagement_score, comfort_level,
      is_enabled, drift_rate,
      last_drift_applied_at, updated_at
    FROM user_personality_drift
    WHERE user_id ILIKE $1 OR profile_id ILIKE $1
    ORDER BY total_interactions DESC
    LIMIT $2 OFFSET $3
  `, [`%${searchTerm}%`, limit, offset]);

  return result.rows;
}

/**
 * Get user drift details
 */
async function getUserDriftDetails(userId, profileId = 'default') {
  const userDrift = await drift.getUserDrift(userId, profileId);
  const history = await drift.getDriftHistory('user', userId, profileId, 10);
  const behavior = await drift.blender.getCombinedBehavior(userId, {}, profileId);

  // Get recent signals
  const signalsResult = await query(`
    SELECT signal_type, weight, source, context, recorded_at
    FROM drift_signal_log
    WHERE user_id = $1 AND profile_id = $2
    ORDER BY recorded_at DESC
    LIMIT 50
  `, [userId, profileId]);

  return {
    drift: userDrift,
    history,
    recentSignals: signalsResult.rows,
    currentBehavior: behavior,
    bounds: drift.DRIFT_BOUNDS.user
  };
}

/**
 * Update user drift manually
 */
async function updateUserDrift(actor, requestId, userId, profileId, updates, reason) {
  const before = await drift.getUserDrift(userId, profileId);

  // Validate bounds
  const bounds = drift.DRIFT_BOUNDS.user;
  for (const [param, value] of Object.entries(updates)) {
    if (param.endsWith('Delta')) {
      const baseName = param.replace('Delta', '').replace(/([A-Z])/g, (m) => m.toLowerCase());
      const paramBounds = bounds[baseName] || bounds[param.replace('Delta', '').toLowerCase()];
      if (paramBounds && (value < paramBounds.min || value > paramBounds.max)) {
        throw new Error(`${param} value ${value} outside bounds [${paramBounds.min}, ${paramBounds.max}]`);
      }
    }
  }

  await drift.store.ensureUserDrift(userId, profileId);
  await drift.store.updateUserDrift(userId, profileId, updates);

  const after = await drift.getUserDrift(userId, profileId);

  const auditId = await logAdminAction({
    actor,
    action: 'update_user_drift',
    targetType: 'user_drift',
    targetId: `${userId}:${profileId}`,
    before,
    after,
    reason,
    requestId
  });

  return { before, after, auditId };
}

/**
 * Pause user drift (keep data but stop updates)
 */
async function pauseUserDrift(actor, requestId, userId, profileId, pause, reason) {
  const before = await drift.getUserDrift(userId, profileId);

  await drift.store.ensureUserDrift(userId, profileId);
  await drift.store.updateUserDrift(userId, profileId, { isEnabled: !pause });

  const after = await drift.getUserDrift(userId, profileId);

  const auditId = await logAdminAction({
    actor,
    action: pause ? 'pause_user_drift' : 'resume_user_drift',
    targetType: 'user_drift',
    targetId: `${userId}:${profileId}`,
    before,
    after,
    reason,
    requestId
  });

  return { before, after, auditId };
}

/**
 * Reset user drift
 */
async function resetUserDrift(actor, requestId, userId, profileId, scope, reason) {
  const before = await drift.getUserDrift(userId, profileId);

  if (scope === 'all' || scope === 'deltas') {
    await query(`
      UPDATE user_personality_drift SET
        warmth_delta = 0,
        advice_bias_delta = 0,
        pace_delta = 0,
        responsiveness_delta = 0,
        backchannel_delta = 0,
        mirroring_delta = 0,
        updated_at = NOW()
      WHERE user_id = $1 AND profile_id = $2
    `, [userId, profileId]);
  }

  if (scope === 'all' || scope === 'signals') {
    await query(`
      UPDATE user_personality_drift SET
        accumulated_signals = '{}'::jsonb,
        signal_count = 0,
        updated_at = NOW()
      WHERE user_id = $1 AND profile_id = $2
    `, [userId, profileId]);
  }

  const after = await drift.getUserDrift(userId, profileId);

  const auditId = await logAdminAction({
    actor,
    action: `reset_user_drift_${scope}`,
    targetType: 'user_drift',
    targetId: `${userId}:${profileId}`,
    before,
    after,
    reason,
    requestId
  });

  return { before, after, auditId };
}

/**
 * Get user drift history
 */
async function getUserDriftHistory(userId, profileId = 'default', limit = 50) {
  const result = await query(`
    SELECT * FROM drift_history
    WHERE scope = 'user' AND user_id = $1 AND profile_id = $2
    ORDER BY recorded_at DESC
    LIMIT $3
  `, [userId, profileId, limit]);

  return result.rows;
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Get drift analytics overview
 */
async function getDriftAnalytics() {
  const [globalDrift, userStats, signalStats, recentDrifts] = await Promise.all([
    drift.getGlobalDrift(),

    query(`
      SELECT
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE is_enabled = true) as active_users,
        AVG(warmth_delta) as avg_warmth,
        AVG(advice_bias_delta) as avg_advice,
        AVG(engagement_score) as avg_engagement,
        SUM(total_interactions) as total_interactions
      FROM user_personality_drift
    `),

    query(`
      SELECT
        signal_type,
        COUNT(*) as count,
        AVG(weight) as avg_weight
      FROM drift_signal_log
      WHERE recorded_at > NOW() - INTERVAL '24 hours'
      GROUP BY signal_type
      ORDER BY count DESC
    `),

    query(`
      SELECT * FROM drift_history
      ORDER BY recorded_at DESC
      LIMIT 20
    `)
  ]);

  return {
    global: {
      current: {
        warmth: globalDrift.warmthDelta,
        adviceBias: globalDrift.adviceBiasDelta,
        pace: globalDrift.paceDelta,
        responsiveness: globalDrift.responsivenessDelta,
        backchannel: globalDrift.backchannelDelta,
        mirroring: globalDrift.mirroringDelta
      },
      isEnabled: globalDrift.isEnabled,
      pendingSignals: globalDrift.signalCount,
      lastApplied: globalDrift.lastDriftAppliedAt
    },
    users: userStats.rows[0],
    recentSignals: signalStats.rows,
    recentDrifts: recentDrifts.rows
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Global drift
  getGlobalDriftConfig,
  updateGlobalDriftConfig,
  forceGlobalDriftUpdate,
  getGlobalDriftHistory,
  rollbackGlobalDrift,
  toggleGlobalDriftEnabled,

  // User drift
  searchUserDrift,
  getUserDriftDetails,
  updateUserDrift,
  pauseUserDrift,
  resetUserDrift,
  getUserDriftHistory,

  // Analytics
  getDriftAnalytics
};
