/**
 * ============================================================================
 * NIGHTLY DRIFT JOB - Global Personality Aggregation
 * ============================================================================
 * Scheduled job that runs nightly to:
 * 1. Aggregate per-user drift into global Luna personality
 * 2. Apply accumulated global signals
 * 3. Clean up old signal logs
 * 4. Generate drift analytics
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const driftStore = require('./driftStore');
const { query, withTransaction } = require('../database/pool');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Global aggregation parameters
 */
const AGGREGATION_CONFIG = {
  // Minimum number of active users needed for global drift update
  minActiveUsers: 10,

  // Weight given to user consensus vs current global value
  consensusWeight: 0.1,

  // How much individual user variance affects global
  varianceWeight: 0.05,

  // Days to look back for active users
  activeDaysLookback: 7,

  // How many days of signal logs to keep
  signalLogRetentionDays: 30,

  // How many history entries to keep per scope
  historyRetentionCount: 100
};

// ============================================================================
// MAIN NIGHTLY UPDATE
// ============================================================================

/**
 * Run the nightly drift update job
 * Called by Cloud Scheduler or manually triggered
 */
async function runNightlyDriftUpdate() {
  const startTime = Date.now();
  console.log('[NightlyDrift] Starting nightly drift update job');

  const results = {
    timestamp: new Date().toISOString(),
    steps: {},
    errors: []
  };

  try {
    // Step 1: Get all users with recent activity
    console.log('[NightlyDrift] Step 1: Gathering active users');
    const activeUsers = await getActiveUsersForAggregation();
    results.steps.activeUsers = {
      count: activeUsers.length,
      users: activeUsers.map(u => u.user_id).slice(0, 10) // First 10 for logging
    };

    // Step 2: Apply pending per-user drift
    console.log('[NightlyDrift] Step 2: Applying pending user drift');
    const userDriftResults = await applyAllPendingUserDrift();
    results.steps.userDrift = userDriftResults;

    // Step 3: Calculate user consensus
    console.log('[NightlyDrift] Step 3: Calculating user consensus');
    const consensus = await calculateUserConsensus(activeUsers);
    results.steps.consensus = consensus;

    // Step 4: Apply global drift
    console.log('[NightlyDrift] Step 4: Applying global drift');
    const globalResult = await applyGlobalDriftWithConsensus(consensus);
    results.steps.globalDrift = globalResult;

    // Step 5: Cleanup old data
    console.log('[NightlyDrift] Step 5: Cleaning up old data');
    const cleanupResult = await cleanupOldData();
    results.steps.cleanup = cleanupResult;

    // Step 6: Generate analytics
    console.log('[NightlyDrift] Step 6: Generating analytics');
    const analytics = await generateDriftAnalytics();
    results.steps.analytics = analytics;

    results.success = true;
    results.durationMs = Date.now() - startTime;
    console.log(`[NightlyDrift] Completed in ${results.durationMs}ms`);

  } catch (error) {
    console.error('[NightlyDrift] Error in nightly job:', error);
    results.success = false;
    results.error = error.message;
    results.errors.push(error.message);
  }

  return results;
}

// ============================================================================
// STEP FUNCTIONS
// ============================================================================

/**
 * Get active users for aggregation
 */
async function getActiveUsersForAggregation() {
  const result = await query(`
    SELECT DISTINCT user_id, profile_id, signal_count, total_interactions,
           warmth_delta, advice_bias_delta, pace_delta,
           responsiveness_delta, backchannel_delta, mirroring_delta,
           engagement_score, relationship_sentiment
    FROM user_personality_drift
    WHERE updated_at > NOW() - INTERVAL '${AGGREGATION_CONFIG.activeDaysLookback} days'
      AND is_enabled = true
      AND total_interactions >= 5
    ORDER BY total_interactions DESC
  `);

  return result.rows;
}

/**
 * Apply all pending user drift updates
 */
async function applyAllPendingUserDrift() {
  const pendingUsers = await driftStore.getUsersWithPendingDrift();
  const results = {
    total: pendingUsers.length,
    applied: 0,
    skipped: 0,
    errors: 0
  };

  for (const user of pendingUsers) {
    try {
      const result = await driftStore.applyUserDrift(user.user_id, user.profile_id);
      if (result.applied) {
        results.applied++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      console.error(`[NightlyDrift] Error applying drift for user ${user.user_id}:`, error);
      results.errors++;
    }
  }

  return results;
}

/**
 * Calculate consensus from active users
 */
async function calculateUserConsensus(activeUsers) {
  if (activeUsers.length < AGGREGATION_CONFIG.minActiveUsers) {
    return {
      sufficient: false,
      userCount: activeUsers.length,
      minRequired: AGGREGATION_CONFIG.minActiveUsers
    };
  }

  const parameters = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];
  const consensus = {};

  for (const param of parameters) {
    const colName = param.replace(/([A-Z])/g, '_$1').toLowerCase() + '_delta';
    const values = activeUsers
      .map(u => u[colName] || 0)
      .filter(v => !isNaN(v));

    if (values.length > 0) {
      // Calculate weighted average (weight by engagement score)
      let weightedSum = 0;
      let totalWeight = 0;

      for (let i = 0; i < activeUsers.length; i++) {
        const value = activeUsers[i][colName] || 0;
        const weight = activeUsers[i].engagement_score || 0.5;
        weightedSum += value * weight;
        totalWeight += weight;
      }

      const mean = totalWeight > 0 ? weightedSum / totalWeight : 0;

      // Calculate variance
      const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;

      consensus[param] = {
        mean,
        variance,
        count: values.length,
        direction: mean > 0 ? 'positive' : mean < 0 ? 'negative' : 'neutral'
      };
    }
  }

  return {
    sufficient: true,
    userCount: activeUsers.length,
    parameters: consensus
  };
}

/**
 * Apply global drift with user consensus
 */
async function applyGlobalDriftWithConsensus(consensus) {
  if (!consensus.sufficient) {
    // Just apply accumulated signals without consensus
    return driftStore.applyGlobalDrift();
  }

  return withTransaction(async (client) => {
    // Get current global drift
    const result = await client.query(
      `SELECT * FROM global_drift_config WHERE id = 1 FOR UPDATE`
    );

    if (result.rowCount === 0) {
      await driftStore.initializeGlobalDrift();
      return { applied: false, reason: 'Initialized global config' };
    }

    const config = result.rows[0];
    const signals = config.accumulated_signals || {};
    const bounds = config.bounds || driftStore.DRIFT_BOUNDS.global;

    const parameters = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];
    const oldValues = {};
    const newValues = {};

    for (const param of parameters) {
      const colName = param.replace(/([A-Z])/g, '_$1').toLowerCase() + '_delta';
      oldValues[param] = config[colName] || 0;

      // Combine signals and consensus
      const positive = signals[`${param}Positive`] || 0;
      const negative = signals[`${param}Negative`] || 0;
      const signalTotal = positive + negative;

      let signalDirection = 0;
      if (signalTotal > 0) {
        signalDirection = (positive - negative) / signalTotal;
      }

      // Get consensus direction
      const paramConsensus = consensus.parameters[param];
      const consensusDirection = paramConsensus ? paramConsensus.mean : 0;

      // Blend signal direction with consensus
      const blendedDirection =
        signalDirection * (1 - AGGREGATION_CONFIG.consensusWeight) +
        consensusDirection * AGGREGATION_CONFIG.consensusWeight;

      // Apply drift
      const driftRate = config.drift_rate || driftStore.DEFAULT_DRIFT_RATE;
      const newDelta = oldValues[param] + (driftRate * blendedDirection);

      // Apply bounds
      const paramBounds = bounds[param] || { min: -0.3, max: 0.3 };
      newValues[param] = Math.max(paramBounds.min, Math.min(paramBounds.max, newDelta));
    }

    // Record history
    await client.query(`
      INSERT INTO drift_history (
        scope, warmth_delta, advice_bias_delta, pace_delta,
        responsiveness_delta, backchannel_delta, mirroring_delta,
        trigger_signals, signal_count, reason, notes
      ) VALUES (
        'global', $1, $2, $3, $4, $5, $6, $7, $8, 'nightly_update',
        $9
      )
    `, [
      newValues.warmth,
      newValues.adviceBias,
      newValues.pace,
      newValues.responsiveness,
      newValues.backchannel,
      newValues.mirroring,
      JSON.stringify(signals),
      config.signal_count,
      JSON.stringify({ consensus: consensus.parameters, userCount: consensus.userCount })
    ]);

    // Apply new values
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
      consensusInfluence: AGGREGATION_CONFIG.consensusWeight,
      userCount: consensus.userCount
    };
  });
}

/**
 * Clean up old signal logs and history
 */
async function cleanupOldData() {
  const results = {};

  // Clean old signal logs
  const signalResult = await query(`
    DELETE FROM drift_signal_log
    WHERE recorded_at < NOW() - INTERVAL '${AGGREGATION_CONFIG.signalLogRetentionDays} days'
    RETURNING id
  `);
  results.signalLogsDeleted = signalResult.rowCount;

  // Keep only recent history entries (global)
  const globalHistoryResult = await query(`
    DELETE FROM drift_history
    WHERE scope = 'global'
      AND id NOT IN (
        SELECT id FROM drift_history
        WHERE scope = 'global'
        ORDER BY recorded_at DESC
        LIMIT ${AGGREGATION_CONFIG.historyRetentionCount}
      )
    RETURNING id
  `);
  results.globalHistoryDeleted = globalHistoryResult.rowCount;

  // Keep only recent history entries per user
  const userHistoryResult = await query(`
    DELETE FROM drift_history
    WHERE scope = 'user'
      AND recorded_at < NOW() - INTERVAL '90 days'
    RETURNING id
  `);
  results.userHistoryDeleted = userHistoryResult.rowCount;

  return results;
}

/**
 * Generate drift analytics for monitoring
 */
async function generateDriftAnalytics() {
  const analytics = {};

  // Global drift state
  const globalDrift = await driftStore.getGlobalDrift();
  analytics.global = {
    warmth: globalDrift.warmthDelta,
    adviceBias: globalDrift.adviceBiasDelta,
    pace: globalDrift.paceDelta,
    responsiveness: globalDrift.responsivenessDelta,
    backchannel: globalDrift.backchannelDelta,
    mirroring: globalDrift.mirroringDelta,
    pendingSignals: globalDrift.signalCount
  };

  // User drift distribution
  const userStatsResult = await query(`
    SELECT
      COUNT(*) as total_users,
      AVG(warmth_delta) as avg_warmth,
      AVG(advice_bias_delta) as avg_advice,
      AVG(pace_delta) as avg_pace,
      AVG(engagement_score) as avg_engagement,
      AVG(relationship_sentiment) as avg_sentiment,
      SUM(total_interactions) as total_interactions
    FROM user_personality_drift
    WHERE is_enabled = true
  `);
  analytics.userStats = userStatsResult.rows[0];

  // Recent signal activity
  const signalActivityResult = await query(`
    SELECT
      signal_type,
      COUNT(*) as count,
      AVG(weight) as avg_weight
    FROM drift_signal_log
    WHERE recorded_at > NOW() - INTERVAL '24 hours'
    GROUP BY signal_type
    ORDER BY count DESC
    LIMIT 10
  `);
  analytics.recentSignals = signalActivityResult.rows;

  // Drift trend (last 7 days)
  const trendResult = await query(`
    SELECT
      DATE(recorded_at) as date,
      warmth_delta,
      advice_bias_delta,
      pace_delta
    FROM drift_history
    WHERE scope = 'global'
      AND recorded_at > NOW() - INTERVAL '7 days'
    ORDER BY recorded_at ASC
  `);
  analytics.trend = trendResult.rows;

  return analytics;
}

// ============================================================================
// MANUAL TRIGGERS
// ============================================================================

/**
 * Manually trigger global drift application (admin use)
 */
async function forceGlobalDriftUpdate() {
  console.log('[NightlyDrift] Forcing global drift update');
  const result = await driftStore.applyGlobalDrift();
  return {
    forced: true,
    ...result
  };
}

/**
 * Reset all user drift (admin use - dangerous!)
 */
async function resetAllUserDrift() {
  console.log('[NightlyDrift] WARNING: Resetting all user drift');

  const result = await query(`
    UPDATE user_personality_drift SET
      warmth_delta = 0,
      advice_bias_delta = 0,
      pace_delta = 0,
      responsiveness_delta = 0,
      backchannel_delta = 0,
      mirroring_delta = 0,
      accumulated_signals = '{}'::jsonb,
      signal_count = 0,
      updated_at = NOW()
  `);

  return {
    reset: true,
    usersAffected: result.rowCount
  };
}

/**
 * Get current drift status for monitoring
 */
async function getDriftStatus() {
  const [globalDrift, pendingUsers, analytics] = await Promise.all([
    driftStore.getGlobalDrift(),
    driftStore.getUsersWithPendingDrift(),
    generateDriftAnalytics()
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
      pendingSignals: globalDrift.signalCount,
      isEnabled: globalDrift.isEnabled,
      lastApplied: globalDrift.lastDriftAppliedAt
    },
    pendingUserUpdates: pendingUsers.length,
    analytics: analytics.userStats
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main job
  runNightlyDriftUpdate,

  // Step functions (for testing/manual use)
  getActiveUsersForAggregation,
  applyAllPendingUserDrift,
  calculateUserConsensus,
  applyGlobalDriftWithConsensus,
  cleanupOldData,
  generateDriftAnalytics,

  // Admin functions
  forceGlobalDriftUpdate,
  resetAllUserDrift,
  getDriftStatus,

  // Config
  AGGREGATION_CONFIG
};
