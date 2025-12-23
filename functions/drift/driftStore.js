/**
 * ============================================================================
 * DRIFT STORE - PostgreSQL CRUD Operations
 * ============================================================================
 * Personality drift persistence layer using PostgreSQL.
 * Supports both global (Luna) and per-user drift tracking.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { query, getClient, withTransaction } = require('../database/pool');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Safe bounds for drift parameters
 * Global drift has tighter bounds; per-user has wider allowance
 */
const DRIFT_BOUNDS = {
  global: {
    warmth: { min: -0.3, max: 0.3 },
    adviceBias: { min: -0.3, max: 0.3 },
    pace: { min: -0.3, max: 0.3 },
    responsiveness: { min: -0.2, max: 0.2 },
    backchannel: { min: -0.3, max: 0.3 },
    mirroring: { min: -0.3, max: 0.3 }
  },
  user: {
    warmth: { min: -0.5, max: 0.5 },
    adviceBias: { min: -0.5, max: 0.5 },
    pace: { min: -0.5, max: 0.5 },
    responsiveness: { min: -0.3, max: 0.3 },
    backchannel: { min: -0.5, max: 0.5 },
    mirroring: { min: -0.5, max: 0.5 }
  }
};

const DEFAULT_DRIFT_RATE = 0.02;
const MIN_SIGNALS_GLOBAL = 50;
const MIN_SIGNALS_USER = 20;

// ============================================================================
// GLOBAL DRIFT OPERATIONS
// ============================================================================

/**
 * Get global drift configuration and current values
 */
async function getGlobalDrift() {
  const result = await query(
    `SELECT * FROM global_drift_config WHERE id = 1`
  );

  if (result.rowCount === 0) {
    await initializeGlobalDrift();
    return getGlobalDrift();
  }

  const row = result.rows[0];
  return {
    warmthDelta: row.warmth_delta,
    adviceBiasDelta: row.advice_bias_delta,
    paceDelta: row.pace_delta,
    responsivenessDelta: row.responsiveness_delta,
    backchannelDelta: row.backchannel_delta,
    mirroringDelta: row.mirroring_delta,
    accumulatedSignals: row.accumulated_signals,
    signalCount: row.signal_count,
    driftRate: row.drift_rate,
    minSignalsForDrift: row.min_signals_for_drift,
    isEnabled: row.is_enabled,
    bounds: row.bounds,
    lastDriftAppliedAt: row.last_drift_applied_at,
    updatedAt: row.updated_at
  };
}

/**
 * Initialize global drift with defaults
 */
async function initializeGlobalDrift() {
  await query(`
    INSERT INTO global_drift_config (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING
  `);
}

/**
 * Get global drift modifiers (for behavior blending)
 */
async function getGlobalDriftModifiers() {
  const drift = await getGlobalDrift();
  return {
    warmth: drift.warmthDelta || 0,
    adviceBias: drift.adviceBiasDelta || 0,
    pace: drift.paceDelta || 0,
    responsiveness: drift.responsivenessDelta || 0,
    backchannel: drift.backchannelDelta || 0,
    mirroring: drift.mirroringDelta || 0
  };
}

/**
 * Accumulate a signal for global drift
 */
async function accumulateGlobalSignal(signalType, weight = 1.0) {
  await query(`
    UPDATE global_drift_config
    SET
      accumulated_signals = jsonb_set(
        accumulated_signals,
        $1::text[],
        (COALESCE((accumulated_signals->>$2)::numeric, 0) + $3)::text::jsonb
      ),
      signal_count = signal_count + 1,
      updated_at = NOW()
    WHERE id = 1
  `, [[signalType], signalType, weight]);
}

/**
 * Apply global drift from accumulated signals
 */
async function applyGlobalDrift() {
  return withTransaction(async (client) => {
    // Get current state
    const result = await client.query(
      `SELECT * FROM global_drift_config WHERE id = 1 FOR UPDATE`
    );

    if (result.rowCount === 0) {
      return { applied: false, reason: 'No global config' };
    }

    const config = result.rows[0];

    if (config.signal_count < config.min_signals_for_drift) {
      return { applied: false, reason: 'Not enough signals', signalCount: config.signal_count };
    }

    const signals = config.accumulated_signals || {};
    const driftRate = config.drift_rate || DEFAULT_DRIFT_RATE;
    const bounds = config.bounds || DRIFT_BOUNDS.global;

    // Calculate new values
    const parameters = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];
    const oldValues = {};
    const newValues = {};

    for (const param of parameters) {
      const colName = param.replace(/([A-Z])/g, '_$1').toLowerCase() + '_delta';
      oldValues[param] = config[colName] || 0;

      const positive = signals[`${param}Positive`] || 0;
      const negative = signals[`${param}Negative`] || 0;
      const total = positive + negative;

      if (total > 0) {
        const direction = (positive - negative) / total;
        const newDelta = oldValues[param] + (driftRate * direction);
        const paramBounds = bounds[param] || { min: -0.3, max: 0.3 };
        newValues[param] = Math.max(paramBounds.min, Math.min(paramBounds.max, newDelta));
      } else {
        newValues[param] = oldValues[param];
      }
    }

    // Record history
    await client.query(`
      INSERT INTO drift_history (
        scope, warmth_delta, advice_bias_delta, pace_delta,
        responsiveness_delta, backchannel_delta, mirroring_delta,
        trigger_signals, signal_count, reason
      ) VALUES (
        'global', $1, $2, $3, $4, $5, $6, $7, $8, 'scheduled_update'
      )
    `, [
      newValues.warmth,
      newValues.adviceBias,
      newValues.pace,
      newValues.responsiveness,
      newValues.backchannel,
      newValues.mirroring,
      JSON.stringify(signals),
      config.signal_count
    ]);

    // Apply new values and reset signals
    await client.query(`
      UPDATE global_drift_config SET
        warmth_delta = $1,
        advice_bias_delta = $2,
        pace_delta = $3,
        responsiveness_delta = $4,
        backchannel_delta = $5,
        mirroring_delta = $6,
        accumulated_signals = '{
          "warmthPositive": 0, "warmthNegative": 0,
          "advicePositive": 0, "adviceNegative": 0,
          "pacePositive": 0, "paceNegative": 0,
          "responsivenessPositive": 0, "responsivenessNegative": 0,
          "backchannelPositive": 0, "backchannelNegative": 0,
          "mirroringPositive": 0, "mirroringNegative": 0
        }'::jsonb,
        signal_count = 0,
        last_drift_applied_at = NOW(),
        updated_at = NOW()
      WHERE id = 1
    `, [
      newValues.warmth,
      newValues.adviceBias,
      newValues.pace,
      newValues.responsiveness,
      newValues.backchannel,
      newValues.mirroring
    ]);

    return {
      applied: true,
      oldValues,
      newValues,
      previousSignalCount: config.signal_count
    };
  });
}

// ============================================================================
// USER DRIFT OPERATIONS
// ============================================================================

/**
 * Get per-user drift state
 */
async function getUserDrift(userId, profileId = 'default') {
  const result = await query(
    `SELECT * FROM user_personality_drift
     WHERE user_id = $1 AND profile_id = $2`,
    [userId, profileId]
  );

  if (result.rowCount === 0) {
    return {
      userId,
      profileId,
      warmthDelta: 0.0,
      adviceBiasDelta: 0.0,
      paceDelta: 0.0,
      responsivenessDelta: 0.0,
      backchannelDelta: 0.0,
      mirroringDelta: 0.0,
      accumulatedSignals: {},
      signalCount: 0,
      totalInteractions: 0,
      relationshipSentiment: 0.0,
      engagementScore: 0.5,
      comfortLevel: 0.5,
      driftRate: DEFAULT_DRIFT_RATE,
      isEnabled: true,
      exists: false
    };
  }

  const row = result.rows[0];
  return {
    userId,
    profileId,
    warmthDelta: row.warmth_delta,
    adviceBiasDelta: row.advice_bias_delta,
    paceDelta: row.pace_delta,
    responsivenessDelta: row.responsiveness_delta,
    backchannelDelta: row.backchannel_delta,
    mirroringDelta: row.mirroring_delta,
    accumulatedSignals: row.accumulated_signals || {},
    signalCount: row.signal_count,
    totalInteractions: row.total_interactions,
    relationshipSentiment: row.relationship_sentiment,
    engagementScore: row.engagement_score,
    comfortLevel: row.comfort_level,
    driftRate: row.drift_rate,
    isEnabled: row.is_enabled,
    lastDriftAppliedAt: row.last_drift_applied_at,
    exists: true
  };
}

/**
 * Get user drift modifiers (for behavior blending)
 */
async function getUserDriftModifiers(userId, profileId = 'default') {
  const drift = await getUserDrift(userId, profileId);
  return {
    warmth: drift.warmthDelta || 0,
    adviceBias: drift.adviceBiasDelta || 0,
    pace: drift.paceDelta || 0,
    responsiveness: drift.responsivenessDelta || 0,
    backchannel: drift.backchannelDelta || 0,
    mirroring: drift.mirroringDelta || 0
  };
}

/**
 * Ensure user drift record exists
 */
async function ensureUserDrift(userId, profileId = 'default') {
  await query(`
    INSERT INTO user_personality_drift (user_id, profile_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, profile_id) DO NOTHING
  `, [userId, profileId]);
}

/**
 * Accumulate a signal for user drift
 */
async function accumulateUserSignal(userId, signalType, weight = 1.0, profileId = 'default') {
  await ensureUserDrift(userId, profileId);

  await query(`
    UPDATE user_personality_drift
    SET
      accumulated_signals = jsonb_set(
        COALESCE(accumulated_signals, '{}'::jsonb),
        $1::text[],
        (COALESCE((accumulated_signals->>$2)::numeric, 0) + $3)::text::jsonb
      ),
      signal_count = signal_count + 1,
      updated_at = NOW()
    WHERE user_id = $4 AND profile_id = $5
  `, [[signalType], signalType, weight, userId, profileId]);
}

/**
 * Accumulate multiple signals at once
 */
async function accumulateUserSignals(userId, signals, profileId = 'default') {
  await ensureUserDrift(userId, profileId);

  const client = await getClient();
  try {
    for (const [signalType, weight] of Object.entries(signals)) {
      if (weight !== 0) {
        await client.query(`
          UPDATE user_personality_drift
          SET
            accumulated_signals = jsonb_set(
              COALESCE(accumulated_signals, '{}'::jsonb),
              $1::text[],
              (COALESCE((accumulated_signals->>$2)::numeric, 0) + $3)::text::jsonb
            ),
            signal_count = signal_count + 1,
            updated_at = NOW()
          WHERE user_id = $4 AND profile_id = $5
        `, [[signalType], signalType, weight, userId, profileId]);
      }
    }
  } finally {
    client.release();
  }
}

/**
 * Update user drift values directly (for EMA updates)
 */
async function updateUserDrift(userId, profileId, updates) {
  const allowedFields = [
    'warmth_delta', 'advice_bias_delta', 'pace_delta',
    'responsiveness_delta', 'backchannel_delta', 'mirroring_delta',
    'relationship_sentiment', 'engagement_score', 'comfort_level',
    'total_interactions', 'drift_rate', 'is_enabled'
  ];

  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updates)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(snakeKey) && value !== undefined) {
      fields.push(`${snakeKey} = $${idx++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) return;

  values.push(userId, profileId);
  await query(`
    UPDATE user_personality_drift
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE user_id = $${idx++} AND profile_id = $${idx}
  `, values);
}

/**
 * Apply user drift from accumulated signals
 */
async function applyUserDrift(userId, profileId = 'default') {
  return withTransaction(async (client) => {
    const result = await client.query(
      `SELECT * FROM user_personality_drift
       WHERE user_id = $1 AND profile_id = $2 FOR UPDATE`,
      [userId, profileId]
    );

    if (result.rowCount === 0) {
      return { applied: false, reason: 'No user drift data' };
    }

    const drift = result.rows[0];

    if (drift.signal_count < MIN_SIGNALS_USER) {
      return { applied: false, reason: 'Not enough signals', signalCount: drift.signal_count };
    }

    const signals = drift.accumulated_signals || {};
    const driftRate = drift.drift_rate || DEFAULT_DRIFT_RATE;
    const bounds = DRIFT_BOUNDS.user;

    const parameters = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];
    const oldValues = {};
    const newValues = {};

    for (const param of parameters) {
      const colName = param.replace(/([A-Z])/g, '_$1').toLowerCase() + '_delta';
      oldValues[param] = drift[colName] || 0;

      const positive = signals[`${param}Positive`] || 0;
      const negative = signals[`${param}Negative`] || 0;
      const total = positive + negative;

      if (total > 0) {
        const direction = (positive - negative) / total;
        const newDelta = oldValues[param] + (driftRate * direction);
        const paramBounds = bounds[param];
        newValues[param] = Math.max(paramBounds.min, Math.min(paramBounds.max, newDelta));
      } else {
        newValues[param] = oldValues[param];
      }
    }

    // Record history
    await client.query(`
      INSERT INTO drift_history (
        scope, user_id, profile_id,
        warmth_delta, advice_bias_delta, pace_delta,
        responsiveness_delta, backchannel_delta, mirroring_delta,
        trigger_signals, signal_count, reason
      ) VALUES (
        'user', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'scheduled_update'
      )
    `, [
      userId, profileId,
      newValues.warmth, newValues.adviceBias, newValues.pace,
      newValues.responsiveness, newValues.backchannel, newValues.mirroring,
      JSON.stringify(signals), drift.signal_count
    ]);

    // Apply new values
    await client.query(`
      UPDATE user_personality_drift SET
        warmth_delta = $1,
        advice_bias_delta = $2,
        pace_delta = $3,
        responsiveness_delta = $4,
        backchannel_delta = $5,
        mirroring_delta = $6,
        accumulated_signals = '{}'::jsonb,
        signal_count = 0,
        last_drift_applied_at = NOW(),
        updated_at = NOW()
      WHERE user_id = $7 AND profile_id = $8
    `, [
      newValues.warmth, newValues.adviceBias, newValues.pace,
      newValues.responsiveness, newValues.backchannel, newValues.mirroring,
      userId, profileId
    ]);

    return {
      applied: true,
      oldValues,
      newValues,
      previousSignalCount: drift.signal_count
    };
  });
}

// ============================================================================
// HISTORY OPERATIONS
// ============================================================================

/**
 * Get drift history
 */
async function getDriftHistory(scope = 'global', userId = null, profileId = 'default', limit = 10) {
  let sql;
  let params;

  if (scope === 'global') {
    sql = `
      SELECT * FROM drift_history
      WHERE scope = 'global'
      ORDER BY recorded_at DESC
      LIMIT $1
    `;
    params = [limit];
  } else {
    sql = `
      SELECT * FROM drift_history
      WHERE scope = 'user' AND user_id = $1 AND profile_id = $2
      ORDER BY recorded_at DESC
      LIMIT $3
    `;
    params = [userId, profileId, limit];
  }

  const result = await query(sql, params);
  return result.rows;
}

/**
 * Log a drift signal (for debugging/analysis)
 */
async function logDriftSignal(userId, signalType, weight, source, context = {}, profileId = 'default') {
  await query(`
    INSERT INTO drift_signal_log (user_id, profile_id, signal_type, weight, source, context)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [userId, profileId, signalType, weight, source, JSON.stringify(context)]);
}

/**
 * Get all users with pending drift (for batch processing)
 */
async function getUsersWithPendingDrift(minSignals = MIN_SIGNALS_USER) {
  const result = await query(`
    SELECT user_id, profile_id, signal_count
    FROM user_personality_drift
    WHERE signal_count >= $1 AND is_enabled = true
    ORDER BY signal_count DESC
  `, [minSignals]);

  return result.rows;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Global drift
  getGlobalDrift,
  initializeGlobalDrift,
  getGlobalDriftModifiers,
  accumulateGlobalSignal,
  applyGlobalDrift,

  // User drift
  getUserDrift,
  getUserDriftModifiers,
  ensureUserDrift,
  accumulateUserSignal,
  accumulateUserSignals,
  updateUserDrift,
  applyUserDrift,

  // History & logging
  getDriftHistory,
  logDriftSignal,
  getUsersWithPendingDrift,

  // Constants
  DRIFT_BOUNDS,
  DEFAULT_DRIFT_RATE,
  MIN_SIGNALS_GLOBAL,
  MIN_SIGNALS_USER
};
