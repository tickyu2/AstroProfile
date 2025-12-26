/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTO-TUNE ENGINE - Self-Evolving Behavior Adjustment
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Luna becomes self-correcting, self-optimizing, and emotionally adaptive.
 * Processes implicit user satisfaction signals and adjusts behavior biases.
 *
 * Signal Categories:
 * - Positive: User responds smoothly, elaborates, emotion improves
 * - Negative: User interrupts, gives clipped responses, emotion worsens
 * - Neutral: Backchannels appreciated, comfortable silence
 *
 * Adjustable Parameters:
 * - Backchannel frequency
 * - Response length
 * - Advice vs. reflection bias
 * - Pause tolerance
 * - TTS emotional intensity
 *
 * Created: December 21, 2025
 */

import { getUserPreferences, updateUserPreferences, incrementInteractionCount } from '../user/userPreferencesStore.js';
import { getLunaConfig, updateLunaConfig, getAutoTuneState } from '../config/lunaConfigStore.js';

/**
 * Signal definitions with learning impacts
 */
export const AUTOTUNE_SIGNALS = {
  // Negative signals - Luna was too much
  USER_INTERRUPT: 'user_interrupt',
  USER_SPOKE_OVER_BACKCHANNEL: 'user_spoke_over_backchannel',
  SHORT_RESPONSE: 'short_response',
  NEGATIVE_FLOW: 'negative_flow',
  EMOTION_WORSENED: 'emotion_worsened',

  // Positive signals - Luna matched well
  POSITIVE_FLOW: 'positive_flow',
  LONG_RESPONSE: 'long_response',
  EMOTION_IMPROVED: 'emotion_improved',
  BACKCHANNEL_APPRECIATED: 'backchannel_appreciated',

  // Neutral/calibration signals
  USER_COMFORTABLE_WITH_SILENCE: 'user_comfortable_with_silence'
};

/**
 * Learning rate multipliers for different signal types
 */
const SIGNAL_WEIGHTS = {
  [AUTOTUNE_SIGNALS.USER_INTERRUPT]: { responseLength: -1.5, backchannel: -0.5 },
  [AUTOTUNE_SIGNALS.USER_SPOKE_OVER_BACKCHANNEL]: { backchannel: -1.5 },
  [AUTOTUNE_SIGNALS.SHORT_RESPONSE]: { responseLength: -1.0, advice: -0.5 },
  [AUTOTUNE_SIGNALS.NEGATIVE_FLOW]: { responseLength: -1.0, advice: -0.5, backchannel: -0.3 },
  [AUTOTUNE_SIGNALS.EMOTION_WORSENED]: { responseLength: -0.8, advice: -1.0 },

  [AUTOTUNE_SIGNALS.POSITIVE_FLOW]: { responseLength: 0.5, backchannel: 0.3 },
  [AUTOTUNE_SIGNALS.LONG_RESPONSE]: { responseLength: 0.3, advice: 0.5 },
  [AUTOTUNE_SIGNALS.EMOTION_IMPROVED]: { responseLength: 0.3, advice: 0.3, backchannel: 0.2 },
  [AUTOTUNE_SIGNALS.BACKCHANNEL_APPRECIATED]: { backchannel: 0.5, pauseTolerance: 0.3 },

  [AUTOTUNE_SIGNALS.USER_COMFORTABLE_WITH_SILENCE]: { pauseTolerance: 1.0, backchannel: -0.2 }
};

/**
 * Check if auto-tune is enabled
 *
 * @returns {boolean}
 */
export function isAutoTuneEnabled() {
  const config = getLunaConfig();
  return config.autoTune?.enabled ?? false;
}

/**
 * Get auto-tune sensitivity (0.0 - 2.0)
 *
 * @returns {number}
 */
export function getAutoTuneSensitivity() {
  const config = getLunaConfig();
  return config.autoTune?.sensitivity ?? 1.0;
}

/**
 * Process an auto-tune signal and adjust user preferences.
 *
 * @param {string} userId - User ID
 * @param {string} signal - Signal type from AUTOTUNE_SIGNALS
 * @param {Object} context - Optional context (emotion, timing, etc.)
 * @returns {Object} Updated preferences
 */
export function processAutoTuneSignal(userId, signal, context = {}) {
  if (!isAutoTuneEnabled()) {
    console.log(`[AutoTune] Disabled - ignoring signal: ${signal}`);
    return null;
  }

  if (!SIGNAL_WEIGHTS[signal]) {
    console.warn(`[AutoTune] Unknown signal: ${signal}`);
    return null;
  }

  const config = getLunaConfig();
  const sensitivity = getAutoTuneSensitivity();
  const baseLR = 0.02; // Base learning rate
  const LR = baseLR * sensitivity;

  const prefs = getUserPreferences(userId);
  const weights = SIGNAL_WEIGHTS[signal];
  const updates = {};

  // Apply weighted adjustments
  if (weights.responseLength !== undefined) {
    updates.responseLengthBias = prefs.responseLengthBias + (weights.responseLength * LR);
  }

  if (weights.backchannel !== undefined) {
    updates.backchannelBias = prefs.backchannelBias + (weights.backchannel * LR);
  }

  if (weights.advice !== undefined) {
    updates.adviceBias = prefs.adviceBias + (weights.advice * LR);
  }

  if (weights.pauseTolerance !== undefined) {
    updates.pauseToleranceBias = prefs.pauseToleranceBias + (weights.pauseTolerance * LR);
  }

  // Apply updates (clamping happens in updateUserPreferences)
  const updated = updateUserPreferences(userId, updates);

  console.log(`[AutoTune] ${userId} | ${signal} | LR=${LR.toFixed(3)} | Updates:`, updates);

  // Track signal in auto-tune state
  trackSignal(signal, context);

  return updated;
}

/**
 * Track signal in global auto-tune analytics
 *
 * @param {string} signal
 * @param {Object} context
 */
function trackSignal(signal, context) {
  try {
    const state = getAutoTuneState();
    if (!state.signalCounts) {
      state.signalCounts = {};
    }
    state.signalCounts[signal] = (state.signalCounts[signal] || 0) + 1;
    state.lastSignal = { signal, context, timestamp: new Date().toISOString() };
  } catch (e) {
    // Non-critical
  }
}

/**
 * Detect emotion change and send appropriate signal.
 *
 * @param {string} userId
 * @param {string} previousEmotion
 * @param {string} currentEmotion
 * @param {number} previousConfidence
 * @param {number} currentConfidence
 */
export function detectEmotionChange(userId, previousEmotion, currentEmotion, previousConfidence = 0.5, currentConfidence = 0.5) {
  if (!isAutoTuneEnabled() || !previousEmotion || !currentEmotion) {
    return null;
  }

  const negativeEmotions = ['sad', 'anxious', 'angry', 'fearful', 'disgusted'];
  const positiveEmotions = ['happy', 'excited', 'tender'];

  const wasNegative = negativeEmotions.includes(previousEmotion);
  const isNegative = negativeEmotions.includes(currentEmotion);
  const wasPositive = positiveEmotions.includes(previousEmotion);
  const isPositive = positiveEmotions.includes(currentEmotion);

  // Emotion improved: went from negative to neutral/positive
  if (wasNegative && !isNegative) {
    return processAutoTuneSignal(userId, AUTOTUNE_SIGNALS.EMOTION_IMPROVED, {
      from: previousEmotion,
      to: currentEmotion
    });
  }

  // Emotion worsened: went from neutral/positive to negative
  if (!wasNegative && isNegative) {
    return processAutoTuneSignal(userId, AUTOTUNE_SIGNALS.EMOTION_WORSENED, {
      from: previousEmotion,
      to: currentEmotion
    });
  }

  return null;
}

/**
 * Detect response flow quality based on timing and content.
 *
 * @param {string} userId
 * @param {number} responseTimeMs - How quickly user responded
 * @param {number} responseLength - Word count of user response
 * @param {boolean} wasInterrupted - Whether Luna was interrupted
 */
export function detectResponseFlow(userId, responseTimeMs, responseLength, wasInterrupted = false) {
  if (!isAutoTuneEnabled()) {
    return null;
  }

  // Interrupted = negative flow
  if (wasInterrupted) {
    return processAutoTuneSignal(userId, AUTOTUNE_SIGNALS.USER_INTERRUPT, {
      responseTimeMs
    });
  }

  // Very short response (< 5 words) after moderate wait = possibly frustrated
  if (responseLength < 5 && responseTimeMs > 500 && responseTimeMs < 2000) {
    return processAutoTuneSignal(userId, AUTOTUNE_SIGNALS.SHORT_RESPONSE, {
      responseTimeMs,
      responseLength
    });
  }

  // Long, elaborated response = positive flow
  if (responseLength > 20 && responseTimeMs > 1000) {
    return processAutoTuneSignal(userId, AUTOTUNE_SIGNALS.LONG_RESPONSE, {
      responseTimeMs,
      responseLength
    });
  }

  // Smooth, natural response timing = positive flow
  if (responseTimeMs > 800 && responseTimeMs < 3000 && responseLength >= 5) {
    return processAutoTuneSignal(userId, AUTOTUNE_SIGNALS.POSITIVE_FLOW, {
      responseTimeMs,
      responseLength
    });
  }

  return null;
}

/**
 * Consolidate learned preferences into global config.
 * Called periodically to "solidify" learned patterns.
 *
 * @param {string} userId - User ID to consolidate from
 * @param {number} blendFactor - How much to blend (0.0-1.0, default 0.3)
 * @returns {Object} Updated config
 */
export function consolidatePreferencesIntoConfig(userId, blendFactor = 0.3) {
  const prefs = getUserPreferences(userId);
  const config = getLunaConfig();

  if (!config.behaviorDefaults?.neutral) {
    console.warn('[AutoTune] No neutral behavior defaults to blend into');
    return config;
  }

  const neutral = config.behaviorDefaults.neutral;

  // Clamp helper
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const clampTokens = (v) => Math.max(80, Math.min(400, v));

  // Blend preferences into neutral defaults
  const blended = {
    backchannelFrequency: clamp01(
      neutral.backchannelFrequency + (prefs.backchannelBias * blendFactor)
    ),
    maxResponseTokens: clampTokens(
      Math.round(neutral.maxResponseTokens * (1 + prefs.responseLengthBias * blendFactor))
    ),
    adviceBias: clamp01(
      neutral.adviceBias + (prefs.adviceBias * blendFactor)
    ),
    style: neutral.style,
    ttsHints: neutral.ttsHints
  };

  // Apply to config
  const updated = updateLunaConfig({
    behaviorDefaults: {
      ...config.behaviorDefaults,
      neutral: blended
    }
  });

  console.log(`[AutoTune] Consolidated prefs from ${userId} into global config`);
  console.log(`[AutoTune] Blended neutral:`, blended);

  return updated;
}

/**
 * Get auto-tune analytics for a user.
 *
 * @param {string} userId
 * @returns {Object} Analytics data
 */
export function getAutoTuneAnalyticsForUser(userId) {
  const prefs = getUserPreferences(userId);
  const config = getLunaConfig();

  return {
    userId,
    enabled: isAutoTuneEnabled(),
    sensitivity: getAutoTuneSensitivity(),
    currentBiases: {
      backchannel: prefs.backchannelBias,
      responseLength: prefs.responseLengthBias,
      pauseTolerance: prefs.pauseToleranceBias,
      advice: prefs.adviceBias
    },
    interactionCount: prefs.interactionCount,
    lastUpdated: prefs.lastUpdated,
    configVersion: config.version
  };
}

/**
 * Reset auto-tune state for a user.
 *
 * @param {string} userId
 * @returns {Object} Reset preferences
 */
export function resetAutoTuneForUser(userId) {
  const reset = updateUserPreferences(userId, {
    backchannelBias: 0,
    responseLengthBias: 0,
    pauseToleranceBias: 0,
    adviceBias: 0
  });

  console.log(`[AutoTune] Reset biases for user: ${userId}`);
  return reset;
}

export default {
  AUTOTUNE_SIGNALS,
  isAutoTuneEnabled,
  getAutoTuneSensitivity,
  processAutoTuneSignal,
  detectEmotionChange,
  detectResponseFlow,
  consolidatePreferencesIntoConfig,
  getAutoTuneAnalyticsForUser,
  resetAutoTuneForUser
};
