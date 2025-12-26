/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UPDATE PIPELINE ORCHESTRATOR
 * Coordinates when each algorithm runs in the Luna behavior system
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Three update levels:
 * 1. PER-TURN: Fast, lightweight updates after each user↔Luna exchange
 * 2. PER-SESSION: Deeper aggregation when session ends
 * 3. PERIODIC: Global drift, consolidation (scheduled)
 *
 * Created: December 21, 2025
 */

import { updateProfileFromSession } from '../memory/emaAlgorithms.js';
import { getProfile, updateFromSession, recordSessionSummary } from '../memory/interactionProfileStore.js';
import { classifyUser } from './clusterEngine.js';
import { accumulateSignal, calculateDrift, updateAllDriftFromProfile, getDriftModifiers } from './personalityDrift.js';
import { getBehaviorForUserEmotion as blendBehavior } from './behaviorEngine.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION STATS TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize session stats for a new session
 */
export function createSessionStats() {
  return {
    turnCount: 0,
    totalPauseMs: 0,
    pauseCount: 0,
    totalTurnLength: 0,
    interruptCount: 0,
    backchannelAppreciated: 0,
    backchannelRejected: 0,
    emotionCounts: {},
    signals: [],
    startTime: Date.now()
  };
}

/**
 * Compute aggregated session metrics from raw stats
 */
export function computeSessionMetrics(stats) {
  const avgPauseMs = stats.pauseCount > 0
    ? stats.totalPauseMs / stats.pauseCount
    : 1000;

  const avgTurnLength = stats.turnCount > 0
    ? stats.totalTurnLength / stats.turnCount
    : 3.0;

  const interruptRate = stats.turnCount > 0
    ? stats.interruptCount / stats.turnCount
    : 0;

  const backchannelReactionScore = (stats.backchannelAppreciated + stats.backchannelRejected) > 0
    ? (stats.backchannelAppreciated - stats.backchannelRejected) /
      (stats.backchannelAppreciated + stats.backchannelRejected)
    : 0;

  // Calculate emotion distribution
  const totalEmotions = Object.values(stats.emotionCounts).reduce((a, b) => a + b, 0);
  const emotionDistribution = {};
  for (const [emotion, count] of Object.entries(stats.emotionCounts)) {
    emotionDistribution[emotion] = totalEmotions > 0 ? count / totalEmotions : 0;
  }

  // Calculate emotional variance
  const values = Object.values(emotionDistribution);
  const mean = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const variance = values.length > 0
    ? values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    : 0;
  const emotionalVariance = Math.min(1, Math.sqrt(variance) * 4);

  return {
    avgPauseMs,
    avgTurnLength,
    interruptRate,
    backchannelReactionScore,
    emotionDistribution,
    emotionalVariance,
    turnCount: stats.turnCount,
    durationMs: Date.now() - stats.startTime
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1: PER-TURN UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Handle updates after each completed turn
 *
 * @param {Object} session - Current session state
 * @param {Object} turnContext - Turn data
 */
export function handleTurnComplete(session, turnContext) {
  const {
    userId,
    emotion,
    pauseMs,
    turnLength,
    interrupted,
    metrics
  } = turnContext;

  // Update session stats
  session.stats.turnCount++;

  if (pauseMs !== undefined) {
    session.stats.totalPauseMs += pauseMs;
    session.stats.pauseCount++;
  }

  if (turnLength !== undefined) {
    session.stats.totalTurnLength += turnLength;
  }

  if (interrupted) {
    session.stats.interruptCount++;
  }

  if (emotion) {
    session.stats.emotionCounts[emotion] = (session.stats.emotionCounts[emotion] || 0) + 1;
  }

  // Process pending behavior signals
  if (session.pendingSignals && session.pendingSignals.length > 0) {
    for (const signal of session.pendingSignals) {
      accumulateSignal(signal.type, signal.weight || 1);
      session.stats.signals.push(signal);

      // Track backchannel reactions
      if (signal.type === 'backchannel_appreciated') {
        session.stats.backchannelAppreciated++;
      } else if (signal.type === 'user_spoke_over_backchannel') {
        session.stats.backchannelRejected++;
      }
    }
    session.pendingSignals = [];
  }

  // Log turn snapshot (minimal logging)
  console.log(`[UpdatePipeline] Turn ${session.stats.turnCount} complete:`, {
    userId,
    emotion,
    pauseMs,
    turnLength,
    interrupted
  });

  return session.stats;
}

/**
 * Record a behavior signal from the frontend
 *
 * @param {Object} session - Current session
 * @param {string} signalType - Type of signal
 * @param {number} weight - Signal weight
 */
export function recordBehaviorSignal(session, signalType, weight = 1) {
  if (!session.pendingSignals) {
    session.pendingSignals = [];
  }
  session.pendingSignals.push({
    type: signalType,
    weight,
    timestamp: Date.now()
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2: PER-SESSION UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Handle updates when a session ends
 *
 * @param {Object} session - Session data with userId, profileId, stats
 * @param {Object} config - Luna config (optional, for drift updates)
 * @returns {Object} Update results
 */
export async function handleSessionEnd(session, config = null) {
  const { userId, profileId = 'default', stats } = session;

  if (!userId || !stats || stats.turnCount === 0) {
    console.log('[UpdatePipeline] Session end: No data to process');
    return { skipped: true };
  }

  console.log(`[UpdatePipeline] Processing session end for ${userId}`);

  // 1. Compute session metrics
  const sessionMetrics = computeSessionMetrics(stats);
  console.log('[UpdatePipeline] Session metrics:', sessionMetrics);

  // 2. Update long-term interaction profile (EMA)
  const profileUpdateData = {
    avgPauseMs: sessionMetrics.avgPauseMs,
    avgTurnLength: sessionMetrics.avgTurnLength,
    interruptCount: stats.interruptCount,
    totalTurns: stats.turnCount,
    backchannelReactionScore: sessionMetrics.backchannelReactionScore,
    emotionDistribution: sessionMetrics.emotionDistribution
  };

  await updateFromSession(userId, profileUpdateData, profileId);

  // 3. Classify user into cluster
  const classification = classifyUser(userId);
  console.log('[UpdatePipeline] Cluster classification:', {
    cluster: classification.cluster,
    confidence: classification.confidence
  });

  // 4. Update per-user drift deltas
  const profile = getProfile(userId);
  if (config) {
    const driftUpdates = updateAllDriftFromProfile(profile, config);
    console.log('[UpdatePipeline] Drift updates:', driftUpdates);
  }

  // 5. Record session summary
  recordSessionSummary(userId, {
    turnCount: stats.turnCount,
    durationMs: sessionMetrics.durationMs,
    avgPauseMs: sessionMetrics.avgPauseMs,
    avgTurnLength: sessionMetrics.avgTurnLength,
    interruptRate: sessionMetrics.interruptRate,
    dominantEmotion: getDominantEmotion(sessionMetrics.emotionDistribution),
    cluster: classification.cluster
  });

  return {
    userId,
    profileId,
    sessionMetrics,
    classification,
    profile: getProfile(userId)
  };
}

/**
 * Get dominant emotion from distribution
 */
function getDominantEmotion(distribution) {
  if (!distribution) return 'neutral';
  let max = 0;
  let dominant = 'neutral';
  for (const [emotion, value] of Object.entries(distribution)) {
    if (value > max) {
      max = value;
      dominant = emotion;
    }
  }
  return dominant;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3: PERIODIC / NIGHTLY UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Run periodic global drift update
 * Should be called by a cron job or scheduled function
 *
 * @param {Function} getAllProfiles - Function to get all profiles
 * @param {Object} config - Luna config
 * @param {Function} updateConfig - Function to update config
 * @returns {Object} Update results
 */
export async function runPeriodicDriftUpdate(getAllProfiles, config, updateConfig) {
  console.log('[UpdatePipeline] Starting periodic drift update');

  const profiles = getAllProfiles();
  const profileList = Object.values(profiles);

  if (profileList.length === 0) {
    console.log('[UpdatePipeline] No profiles to aggregate');
    return { skipped: true, reason: 'no_profiles' };
  }

  // 1. Aggregate preferences across all users
  const aggregated = {
    backchannelIntensity: 0,
    adviceBias: 0,
    avgPauseMs: 0,
    avgTurnLength: 0,
    count: profileList.length
  };

  for (const profile of profileList) {
    aggregated.backchannelIntensity += (profile.preferredBackchannelIntensity || 0.5);
    aggregated.adviceBias += (profile.preferredAdviceBias || 0.5);
    aggregated.avgPauseMs += (profile.avgPauseMs || 1000);
    aggregated.avgTurnLength += (profile.avgTurnLength || 3.0);
  }

  aggregated.backchannelIntensity /= profileList.length;
  aggregated.adviceBias /= profileList.length;
  aggregated.avgPauseMs /= profileList.length;
  aggregated.avgTurnLength /= profileList.length;

  // 2. Calculate global drift (signal-based)
  const driftResult = calculateDrift();

  // 3. Optionally update global config (very slow, small changes)
  const globalDriftRate = config?.drift?.globalRate || 0.01;
  const oldDefaults = config?.behaviorDefaults?.neutral || {};

  const newDefaults = {
    ...oldDefaults,
    backchannelFrequency: ema(
      oldDefaults.backchannelFrequency || 0.3,
      aggregated.backchannelIntensity,
      globalDriftRate
    ),
    adviceBias: ema(
      oldDefaults.adviceBias || 0.5,
      aggregated.adviceBias,
      globalDriftRate
    )
  };

  // 4. Create history entry
  const historyEntry = {
    appliedAt: new Date().toISOString(),
    profilesCount: profileList.length,
    aggregated,
    previousDefaults: oldDefaults,
    newDefaults,
    drift: driftResult
  };

  console.log('[UpdatePipeline] Periodic update complete:', historyEntry);

  return {
    historyEntry,
    newDefaults,
    profilesProcessed: profileList.length
  };
}

/**
 * Simple EMA helper
 */
function ema(oldValue, observed, alpha) {
  if (oldValue === null || oldValue === undefined) return observed;
  return oldValue * (1 - alpha) + observed * alpha;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED BEHAVIOR COMPUTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute final behavior for a turn (convenience wrapper)
 *
 * @param {Object} params - Parameters
 * @returns {Object} Blended behavior
 */
export function computeFinalBehavior({ userId, emotion, sessionStats, userPrefs }) {
  return blendBehavior({
    userId,
    emotion,
    sessionStats,
    userPrefs
  });
}

/**
 * Get current behavior modifiers for a user (for debugging/console)
 *
 * @param {string} userId - User ID
 * @returns {Object} All behavior modifiers
 */
export function getBehaviorModifiers(userId) {
  const profile = getProfile(userId);
  const classification = classifyUser(userId);
  const drift = getDriftModifiers();

  return {
    profile: {
      avgPauseMs: profile.avgPauseMs,
      avgTurnLength: profile.avgTurnLength,
      interruptRate: profile.interruptRate,
      backchannelTolerance: profile.backchannelTolerance,
      preferredAdviceBias: profile.preferredAdviceBias
    },
    cluster: {
      id: classification.cluster,
      confidence: classification.confidence
    },
    drift: {
      baseWarmth: drift.baseWarmth,
      basePace: drift.basePace,
      backchannelFrequency: drift.backchannelFrequency
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Session stats
  createSessionStats,
  computeSessionMetrics,

  // Per-turn
  handleTurnComplete,
  recordBehaviorSignal,

  // Per-session
  handleSessionEnd,

  // Periodic
  runPeriodicDriftUpdate,

  // Behavior
  computeFinalBehavior,
  getBehaviorModifiers
};
