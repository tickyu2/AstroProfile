/**
 * ============================================================================
 * DRIFT ENGINE - Per-User Personality Drift with EMA
 * ============================================================================
 * Real-time personality drift updates using Exponential Moving Average.
 * Called at session end to update user-specific personality deltas.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const driftStore = require('./driftStore');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * EMA alpha values (higher = faster adaptation)
 * Different parameters have different sensitivity
 */
const EMA_ALPHA = {
  warmth: 0.03,
  adviceBias: 0.02,
  pace: 0.04,
  responsiveness: 0.03,
  backchannel: 0.03,
  mirroring: 0.04
};

/**
 * Signal weights for different behavior indicators
 */
const SIGNAL_WEIGHTS = {
  // Warmth signals
  userExpressedGratitude: { param: 'warmth', direction: 1, weight: 0.8 },
  userExpressedFrustration: { param: 'warmth', direction: -1, weight: 0.6 },
  longEngagement: { param: 'warmth', direction: 1, weight: 0.3 },
  shortDisengagement: { param: 'warmth', direction: -1, weight: 0.2 },

  // Advice bias signals
  userAskedForAdvice: { param: 'adviceBias', direction: 1, weight: 0.5 },
  userRejectedAdvice: { param: 'adviceBias', direction: -1, weight: 0.7 },
  userFollowedAdvice: { param: 'adviceBias', direction: 1, weight: 0.8 },
  userWantedListening: { param: 'adviceBias', direction: -1, weight: 0.4 },

  // Pace signals
  userSentLongMessages: { param: 'pace', direction: -1, weight: 0.3 }, // slow down
  userSentShortMessages: { param: 'pace', direction: 1, weight: 0.3 }, // speed up
  userAskedToSlowDown: { param: 'pace', direction: -1, weight: 0.9 },
  userAskedForMore: { param: 'pace', direction: 1, weight: 0.7 },

  // Responsiveness signals
  quickReplies: { param: 'responsiveness', direction: 1, weight: 0.3 },
  delayedReplies: { param: 'responsiveness', direction: -1, weight: 0.2 },
  userSeekingImmediate: { param: 'responsiveness', direction: 1, weight: 0.6 },

  // Backchannel signals
  userAppreciatedAcknowledgment: { param: 'backchannel', direction: 1, weight: 0.5 },
  userSkippedBackchannel: { param: 'backchannel', direction: -1, weight: 0.3 },

  // Mirroring signals
  userMirroredBack: { param: 'mirroring', direction: 1, weight: 0.6 },
  userUsedFormalLanguage: { param: 'mirroring', direction: -1, weight: 0.3 },
  userUsedCasualLanguage: { param: 'mirroring', direction: 1, weight: 0.4 }
};

// ============================================================================
// CORE EMA UPDATE
// ============================================================================

/**
 * Apply EMA update to a single parameter
 * @param {number} currentValue - Current drift value
 * @param {number} target - Target direction (-1 to 1)
 * @param {number} alpha - EMA smoothing factor
 * @param {Object} bounds - Min/max bounds
 */
function emaUpdate(currentValue, target, alpha, bounds) {
  // EMA formula: new_value = alpha * target + (1 - alpha) * current
  const newValue = alpha * target + (1 - alpha) * currentValue;
  return Math.max(bounds.min, Math.min(bounds.max, newValue));
}

/**
 * Calculate session signals from session data
 * @param {Object} sessionData - Session metrics
 */
function extractSessionSignals(sessionData) {
  const signals = {};
  const {
    messageCount = 0,
    averageUserMessageLength = 0,
    averageResponseTime = 0,
    sessionDuration = 0,
    userSentiment = 0,
    gratitudeExpressions = 0,
    frustrationExpressions = 0,
    adviceRequests = 0,
    adviceRejections = 0,
    adviceFollowed = 0,
    listeningRequests = 0,
    acknowledgmentResponses = 0,
    formalLanguageRatio = 0,
    casualLanguageRatio = 0,
    userMirroringInstances = 0
  } = sessionData;

  // Warmth signals
  if (gratitudeExpressions > 0) {
    signals.warmthPositive = Math.min(gratitudeExpressions * 0.8, 3);
  }
  if (frustrationExpressions > 0) {
    signals.warmthNegative = Math.min(frustrationExpressions * 0.6, 2);
  }
  if (sessionDuration > 600000) { // > 10 minutes
    signals.warmthPositive = (signals.warmthPositive || 0) + 0.3;
  }

  // Advice bias signals
  if (adviceRequests > 0) {
    signals.advicePositive = Math.min(adviceRequests * 0.5, 2);
  }
  if (adviceRejections > 0) {
    signals.adviceNegative = Math.min(adviceRejections * 0.7, 2);
  }
  if (adviceFollowed > 0) {
    signals.advicePositive = (signals.advicePositive || 0) + adviceFollowed * 0.8;
  }
  if (listeningRequests > 0) {
    signals.adviceNegative = (signals.adviceNegative || 0) + listeningRequests * 0.4;
  }

  // Pace signals
  if (averageUserMessageLength > 200) {
    signals.paceNegative = 0.3; // User writes long, slow down
  } else if (averageUserMessageLength < 50 && messageCount > 5) {
    signals.pacePositive = 0.3; // User writes short, speed up
  }

  // Backchannel signals
  if (acknowledgmentResponses > messageCount * 0.3) {
    signals.backchannelPositive = 0.5;
  }

  // Mirroring signals
  if (userMirroringInstances > 0) {
    signals.mirroringPositive = Math.min(userMirroringInstances * 0.6, 2);
  }
  if (formalLanguageRatio > 0.6) {
    signals.mirroringNegative = 0.3;
  }
  if (casualLanguageRatio > 0.6) {
    signals.mirroringPositive = (signals.mirroringPositive || 0) + 0.4;
  }

  return signals;
}

// ============================================================================
// MAIN UPDATE FUNCTION
// ============================================================================

/**
 * Update user personality drift at session end
 * Uses EMA for smooth, gradual adaptation
 *
 * @param {string} userId - User ID
 * @param {Object} sessionData - Session metrics
 * @param {string} profileId - Profile ID
 */
async function updateUserPersonalityDrift(userId, sessionData, profileId = 'default') {
  try {
    // Ensure user drift record exists
    await driftStore.ensureUserDrift(userId, profileId);

    // Get current drift state
    const currentDrift = await driftStore.getUserDrift(userId, profileId);

    // Extract signals from session data
    const sessionSignals = extractSessionSignals(sessionData);

    // Accumulate signals for batch processing
    await driftStore.accumulateUserSignals(userId, sessionSignals, profileId);

    // Calculate new drift values using EMA
    const bounds = driftStore.DRIFT_BOUNDS.user;
    const newDrift = {};
    const parameters = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];

    for (const param of parameters) {
      const positive = sessionSignals[`${param}Positive`] || 0;
      const negative = sessionSignals[`${param}Negative`] || 0;
      const net = positive - negative;

      if (net !== 0) {
        // Normalize to -1 to 1 range
        const target = Math.max(-1, Math.min(1, net));
        const currentValue = currentDrift[`${param}Delta`] || 0;
        const alpha = EMA_ALPHA[param];

        newDrift[`${param}Delta`] = emaUpdate(
          currentValue,
          target,
          alpha,
          bounds[param]
        );
      }
    }

    // Update relationship metrics
    const engagementDelta = sessionData.messageCount > 10 ? 0.02 : -0.01;
    const sentimentDelta = (sessionData.userSentiment || 0) * 0.1;

    newDrift.engagementScore = Math.max(0, Math.min(1,
      (currentDrift.engagementScore || 0.5) + engagementDelta
    ));
    newDrift.relationshipSentiment = Math.max(-1, Math.min(1,
      (currentDrift.relationshipSentiment || 0) + sentimentDelta
    ));
    newDrift.totalInteractions = (currentDrift.totalInteractions || 0) + 1;

    // Apply updates
    if (Object.keys(newDrift).length > 0) {
      await driftStore.updateUserDrift(userId, profileId, newDrift);
    }

    // Log the update
    await driftStore.logDriftSignal(
      userId,
      'session_end_update',
      1.0,
      'driftEngine',
      { sessionSignals, newDrift },
      profileId
    );

    return {
      success: true,
      userId,
      profileId,
      sessionSignals,
      updatedDrift: newDrift
    };

  } catch (error) {
    console.error('[DriftEngine] Error updating user drift:', error);
    return {
      success: false,
      userId,
      profileId,
      error: error.message
    };
  }
}

/**
 * Process explicit user feedback for immediate drift adjustment
 * @param {string} userId - User ID
 * @param {string} feedbackType - Type of feedback
 * @param {number} intensity - Feedback intensity (0-1)
 * @param {string} profileId - Profile ID
 */
async function processUserFeedback(userId, feedbackType, intensity = 1.0, profileId = 'default') {
  const signalMapping = SIGNAL_WEIGHTS[feedbackType];

  if (!signalMapping) {
    return { success: false, error: `Unknown feedback type: ${feedbackType}` };
  }

  const { param, direction, weight } = signalMapping;
  const signalType = direction > 0 ? `${param}Positive` : `${param}Negative`;
  const signalWeight = weight * intensity;

  // Accumulate the signal
  await driftStore.accumulateUserSignal(userId, signalType, signalWeight, profileId);

  // Also accumulate to global
  await driftStore.accumulateGlobalSignal(signalType, signalWeight * 0.1);

  // Log the feedback
  await driftStore.logDriftSignal(
    userId,
    signalType,
    signalWeight,
    'user_feedback',
    { feedbackType, intensity },
    profileId
  );

  return {
    success: true,
    param,
    signalType,
    signalWeight
  };
}

/**
 * Get combined drift modifiers for a user (global + user-specific)
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
async function getCombinedDriftModifiers(userId, profileId = 'default') {
  const [globalMods, userMods] = await Promise.all([
    driftStore.getGlobalDriftModifiers(),
    driftStore.getUserDriftModifiers(userId, profileId)
  ]);

  // Combine: user drift adds on top of global drift
  return {
    warmth: Math.max(-0.5, Math.min(0.5, globalMods.warmth + userMods.warmth)),
    adviceBias: Math.max(-0.5, Math.min(0.5, globalMods.adviceBias + userMods.adviceBias)),
    pace: Math.max(-0.5, Math.min(0.5, globalMods.pace + userMods.pace)),
    responsiveness: Math.max(-0.3, Math.min(0.3, globalMods.responsiveness + userMods.responsiveness)),
    backchannel: Math.max(-0.5, Math.min(0.5, globalMods.backchannel + userMods.backchannel)),
    mirroring: Math.max(-0.5, Math.min(0.5, globalMods.mirroring + userMods.mirroring))
  };
}

/**
 * Session end hook - wires into chat system
 * @param {string} userId - User ID
 * @param {string} conversationId - Conversation ID
 * @param {Object} sessionMetrics - Collected session metrics
 * @param {string} profileId - Profile ID
 */
async function onSessionEnd(userId, conversationId, sessionMetrics, profileId = 'default') {
  console.log(`[DriftEngine] Processing session end for user ${userId}`);

  // Update user personality drift
  const driftResult = await updateUserPersonalityDrift(userId, sessionMetrics, profileId);

  // Check if we should apply accumulated drift
  const userDrift = await driftStore.getUserDrift(userId, profileId);

  if (userDrift.signalCount >= driftStore.MIN_SIGNALS_USER) {
    console.log(`[DriftEngine] Applying accumulated drift for user ${userId}`);
    await driftStore.applyUserDrift(userId, profileId);
  }

  return {
    success: true,
    userId,
    conversationId,
    driftUpdate: driftResult,
    signalCount: userDrift.signalCount
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main update function
  updateUserPersonalityDrift,

  // Session hook
  onSessionEnd,

  // Feedback processing
  processUserFeedback,

  // Combined modifiers
  getCombinedDriftModifiers,

  // Utilities
  extractSessionSignals,
  emaUpdate,

  // Constants
  EMA_ALPHA,
  SIGNAL_WEIGHTS
};
