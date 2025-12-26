/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMA ALGORITHMS - Exponential Moving Average Update Functions
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Core EMA formula:
 *   EMA_new = EMA_old * (1 – α) + observed_value * α
 *
 * Where:
 *   α = learning rate (0.02–0.10 depending on field)
 *   observed_value = what we measured this session
 *
 * Benefits of EMA:
 * - Smooths noise
 * - Adapts slowly
 * - Never jumps
 * - Stable even with sparse data
 *
 * Created: December 21, 2025
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ALPHA VALUES (Learning Rates) per Field
// ═══════════════════════════════════════════════════════════════════════════════

export const ALPHA_VALUES = {
  // Timing metrics
  avgPauseMs: 0.05,              // How long user pauses (slow adaptation)
  avgTurnLength: 0.05,           // How long user speaks (slow adaptation)

  // Behavior metrics
  interruptRate: 0.08,           // How often user interrupts (moderate)
  backchannelTolerance: 0.10,    // How user reacts to cues (faster feedback)

  // Preference metrics
  preferredBackchannelIntensity: 0.05,  // Preferred cue frequency
  preferredAdviceBias: 0.03,            // Reflection vs advice preference

  // Emotional metrics
  emotionalBaseline: 0.02,       // Distribution of emotions (very slow)
  emotionalVariance: 0.04        // How much emotions swing
};

// ═══════════════════════════════════════════════════════════════════════════════
// CORE EMA FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate exponential moving average
 *
 * @param {number} oldValue - Current stored value
 * @param {number} observed - New observed value
 * @param {number} alpha - Learning rate (0-1, higher = faster adaptation)
 * @returns {number} Updated value
 */
export function ema(oldValue, observed, alpha) {
  if (oldValue === null || oldValue === undefined || isNaN(oldValue)) {
    return observed;
  }
  return oldValue * (1 - alpha) + observed * alpha;
}

/**
 * Bounded EMA that clamps result within min/max
 *
 * @param {number} oldValue - Current stored value
 * @param {number} observed - New observed value
 * @param {number} alpha - Learning rate
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number} Updated and clamped value
 */
export function emaBounded(oldValue, observed, alpha, min, max) {
  const newValue = ema(oldValue, observed, alpha);
  return Math.max(min, Math.min(max, newValue));
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE FIELD UPDATE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Update avgPauseMs from session data
 *
 * @param {Object} profile - User interaction profile
 * @param {number} sessionAvgPauseMs - Average pause in this session
 * @returns {number} Updated avgPauseMs
 */
export function updateAvgPauseMs(profile, sessionAvgPauseMs) {
  profile.avgPauseMs = ema(
    profile.avgPauseMs,
    sessionAvgPauseMs,
    ALPHA_VALUES.avgPauseMs
  );
  return profile.avgPauseMs;
}

/**
 * Update avgTurnLength from session data
 *
 * @param {Object} profile - User interaction profile
 * @param {number} sessionAvgTurnLength - Average turn length in this session
 * @returns {number} Updated avgTurnLength
 */
export function updateAvgTurnLength(profile, sessionAvgTurnLength) {
  profile.avgTurnLength = ema(
    profile.avgTurnLength,
    sessionAvgTurnLength,
    ALPHA_VALUES.avgTurnLength
  );
  return profile.avgTurnLength;
}

/**
 * Update interruptRate from session data
 *
 * @param {Object} profile - User interaction profile
 * @param {number} sessionInterruptRate - Interrupt rate in this session (0-1)
 * @returns {number} Updated interruptRate
 */
export function updateInterruptRate(profile, sessionInterruptRate) {
  profile.interruptRate = ema(
    profile.interruptRate,
    sessionInterruptRate,
    ALPHA_VALUES.interruptRate
  );
  return profile.interruptRate;
}

/**
 * Update backchannelTolerance from reaction score
 *
 * @param {Object} profile - User interaction profile
 * @param {number} reactionScore - Backchannel reaction (-1 to +1)
 * @returns {number} Updated backchannelTolerance
 */
export function updateBackchannelTolerance(profile, reactionScore) {
  // Clamp input to valid range
  const clampedScore = Math.max(-1, Math.min(1, reactionScore));
  profile.backchannelTolerance = emaBounded(
    profile.backchannelTolerance,
    clampedScore,
    ALPHA_VALUES.backchannelTolerance,
    -1, 1
  );
  return profile.backchannelTolerance;
}

/**
 * Update preferredBackchannelIntensity from observed preference
 *
 * @param {Object} profile - User interaction profile
 * @param {number} observedIntensity - Observed preferred intensity (0-1)
 * @returns {number} Updated preferredBackchannelIntensity
 */
export function updatePreferredBackchannelIntensity(profile, observedIntensity) {
  if (!profile.preferredBackchannelIntensity) {
    profile.preferredBackchannelIntensity = 0.5; // Default
  }
  profile.preferredBackchannelIntensity = emaBounded(
    profile.preferredBackchannelIntensity,
    observedIntensity,
    ALPHA_VALUES.preferredBackchannelIntensity,
    0, 1
  );
  return profile.preferredBackchannelIntensity;
}

/**
 * Update preferredAdviceBias from observed preference
 * 0 = pure reflection, 1 = pure advice
 *
 * @param {Object} profile - User interaction profile
 * @param {number} observedBias - Observed preference (0-1)
 * @returns {number} Updated preferredAdviceBias
 */
export function updatePreferredAdviceBias(profile, observedBias) {
  if (!profile.preferredAdviceBias) {
    profile.preferredAdviceBias = 0.5; // Default balanced
  }
  profile.preferredAdviceBias = emaBounded(
    profile.preferredAdviceBias,
    observedBias,
    ALPHA_VALUES.preferredAdviceBias,
    0, 1
  );
  return profile.preferredAdviceBias;
}

/**
 * Update emotional baseline from session emotion distribution
 *
 * @param {Object} profile - User interaction profile
 * @param {Object} sessionEmotionDistribution - { emotion: proportion } from session
 * @returns {Object} Updated emotionalBaseline
 */
export function updateEmotionalBaseline(profile, sessionEmotionDistribution) {
  if (!profile.emotionalBaseline) {
    profile.emotionalBaseline = {
      neutral: 0.5,
      happy: 0.15,
      sad: 0.05,
      anxious: 0.10,
      angry: 0.02,
      excited: 0.05,
      tender: 0.03,
      confused: 0.05,
      fearful: 0.05
    };
  }

  // Update each emotion with EMA
  for (const emotion in sessionEmotionDistribution) {
    if (profile.emotionalBaseline[emotion] !== undefined) {
      profile.emotionalBaseline[emotion] = ema(
        profile.emotionalBaseline[emotion],
        sessionEmotionDistribution[emotion],
        ALPHA_VALUES.emotionalBaseline
      );
    }
  }

  // Normalize to sum to 1
  const total = Object.values(profile.emotionalBaseline).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (const emotion in profile.emotionalBaseline) {
      profile.emotionalBaseline[emotion] /= total;
    }
  }

  return profile.emotionalBaseline;
}

/**
 * Update emotional variance from observed variance
 *
 * @param {Object} profile - User interaction profile
 * @param {number} observedVariance - Observed emotional variance (0-1)
 * @returns {number} Updated emotionalVariance
 */
export function updateEmotionalVariance(profile, observedVariance) {
  if (!profile.emotionalVariance) {
    profile.emotionalVariance = 0.2; // Default moderate variance
  }
  profile.emotionalVariance = emaBounded(
    profile.emotionalVariance,
    observedVariance,
    ALPHA_VALUES.emotionalVariance,
    0, 1
  );
  return profile.emotionalVariance;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATCH UPDATE FROM SESSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Update all profile fields from session data in one call
 *
 * @param {Object} profile - User interaction profile
 * @param {Object} sessionData - Session statistics
 * @returns {Object} Updated profile
 */
export function updateProfileFromSession(profile, sessionData) {
  // Update timing metrics
  if (sessionData.avgPauseMs !== undefined) {
    updateAvgPauseMs(profile, sessionData.avgPauseMs);
  }

  if (sessionData.avgTurnLength !== undefined) {
    updateAvgTurnLength(profile, sessionData.avgTurnLength);
  }

  // Update behavior metrics
  if (sessionData.interruptRate !== undefined) {
    updateInterruptRate(profile, sessionData.interruptRate);
  } else if (sessionData.interruptCount !== undefined && sessionData.totalTurns !== undefined) {
    const rate = sessionData.totalTurns > 0
      ? sessionData.interruptCount / sessionData.totalTurns
      : 0;
    updateInterruptRate(profile, rate);
  }

  if (sessionData.backchannelReactionScore !== undefined) {
    updateBackchannelTolerance(profile, sessionData.backchannelReactionScore);
  }

  // Update preference metrics
  if (sessionData.preferredBackchannelIntensity !== undefined) {
    updatePreferredBackchannelIntensity(profile, sessionData.preferredBackchannelIntensity);
  }

  if (sessionData.preferredAdviceBias !== undefined) {
    updatePreferredAdviceBias(profile, sessionData.preferredAdviceBias);
  }

  // Update emotional metrics
  if (sessionData.emotionDistribution) {
    updateEmotionalBaseline(profile, sessionData.emotionDistribution);
  }

  if (sessionData.emotionalVariance !== undefined) {
    updateEmotionalVariance(profile, sessionData.emotionalVariance);
  }

  // Update interaction count
  profile.interactionCount = (profile.interactionCount || 0) + (sessionData.turnCount || 1);
  profile.lastUpdated = new Date().toISOString();

  return profile;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Calculate Emotional Variance from Baseline
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate variance of emotional baseline distribution
 *
 * @param {Object} baseline - Emotional baseline { emotion: probability }
 * @returns {number} Variance (0-1 normalized)
 */
export function calculateEmotionalVariance(baseline) {
  if (!baseline) return 0;

  const values = Object.values(baseline);
  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

  // Normalize: max theoretical variance is ~0.25, scale to 0-1
  return Math.min(1, Math.sqrt(variance) * 4);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  ALPHA_VALUES,
  ema,
  emaBounded,
  updateAvgPauseMs,
  updateAvgTurnLength,
  updateInterruptRate,
  updateBackchannelTolerance,
  updatePreferredBackchannelIntensity,
  updatePreferredAdviceBias,
  updateEmotionalBaseline,
  updateEmotionalVariance,
  updateProfileFromSession,
  calculateEmotionalVariance
};
