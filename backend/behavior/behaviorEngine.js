/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UNIFIED BEHAVIOR ENGINE
 * Central behavior computation for Luna voice system
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Combines multiple behavior layers into a final configuration:
 *
 * Layer 1: EMOTION BASE - Base behavior for detected emotion
 * Layer 2: SESSION BIASES - Auto-tune adjustments from current session
 * Layer 3: USER PREFERENCES - Explicit user preference overrides
 * Layer 4: LONG-TERM MEMORY - EMA-based interaction profile
 * Layer 5: CLUSTER BEHAVIOR - User interaction style classification
 * Layer 6: PERSONALITY DRIFT - Global drift adjustments
 *
 * Output is used by:
 * - LLM prompt builder (response style, length, advice bias)
 * - Turn-taking system (timing thresholds)
 * - Cue engine (backchannel frequency)
 * - TTS (voice modulation hints)
 *
 * Created: December 21, 2025
 */

import {
  EMOTION_BEHAVIORS,
  DEFAULT_BEHAVIOR,
  DEFAULT_LAYER_WEIGHTS,
  getEmotionBehavior
} from './constants/emotionBehaviors.js';
import { DRIFT_BOUNDS } from './constants/driftBounds.js';
import { getUserPreferences } from '../user/userPreferencesStore.js';
import { getSessionBiases } from './sessionBackchannelAdapter.js';
import { applyLabOverrides } from './labOverridesStore.js';
import { getProfile } from '../memory/interactionProfileStore.js';
import { getClusterBehavior, classifyUser } from './clusterEngine.js';
import { getDriftModifiers } from './personalityDrift.js';
import { getLunaConfig } from '../config/lunaConfigStore.js';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Clamp a value between 0 and 1
 */
function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

/**
 * Clamp a value within arbitrary bounds
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Weighted average of two values
 */
function blend(value1, weight1, value2, weight2) {
  const totalWeight = weight1 + weight2;
  if (totalWeight === 0) return value1;
  return (value1 * weight1 + value2 * weight2) / totalWeight;
}

/**
 * Deep merge behavior objects with weighted blending
 */
function mergeBehavior(base, override, weight = 1.0) {
  const result = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === null) continue;

    if (typeof value === 'number') {
      result[key] = blend(base[key] || 0, 1 - weight, value, weight);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      result[key] = mergeBehavior(base[key] || {}, value, weight);
    } else if (weight > 0.5) {
      result[key] = value;
    }
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER EXTRACTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Layer 2: Get session biases
 */
function getSessionBehavior(sessionStats) {
  if (!sessionStats) return {};

  const behavior = {};

  if (sessionStats.backchannelBias !== undefined) {
    behavior.backchannelFrequency = 0.3 + sessionStats.backchannelBias * 0.3;
  }
  if (sessionStats.responseLengthBias !== undefined) {
    behavior.responseLength = 1.0 + sessionStats.responseLengthBias * 0.4;
  }
  if (sessionStats.pauseToleranceBias !== undefined) {
    behavior.pace = 1.0 - sessionStats.pauseToleranceBias * 0.2;
  }
  if (sessionStats.adviceBias !== undefined) {
    behavior.adviceBias = 0.5 + sessionStats.adviceBias * 0.3;
  }

  return behavior;
}

/**
 * Layer 3: Get user preference behavior
 */
function getUserPreferenceBehavior(userPrefs) {
  if (!userPrefs) return {};

  const behavior = {};

  if (userPrefs.preferredTone) {
    const toneMap = {
      'Playful': { warmth: 0.5, pace: 1.05 },
      'Warm': { warmth: 0.8, pace: 0.95 },
      'Reflective': { warmth: 0.6, pace: 0.9 },
      'Tender': { warmth: 0.9, pace: 0.9 },
      'Neutral': { warmth: 0.5, pace: 1.0 }
    };
    Object.assign(behavior, toneMap[userPrefs.preferredTone] || {});
  }

  if (userPrefs.preferredStyle) {
    const styleMap = {
      'friend': { warmth: 0.7, adviceBias: 0.4 },
      'sage': { warmth: 0.5, adviceBias: 0.7 },
      'nurturer': { warmth: 0.9, adviceBias: 0.2 },
      'challenger': { warmth: 0.4, adviceBias: 0.6 }
    };
    Object.assign(behavior, styleMap[userPrefs.preferredStyle] || {});
  }

  return behavior;
}

/**
 * Layer 4: Get memory-based behavior from interaction profile
 */
function getMemoryBehavior(profile) {
  if (!profile || profile.interactionCount < 5) return {};

  const behavior = {};

  if (profile.avgPauseMs) {
    behavior.pace = clamp(profile.avgPauseMs / 1000, 0.7, 1.3);
  }
  if (profile.avgTurnLength) {
    behavior.responseLength = clamp(profile.avgTurnLength / 3.0, 0.6, 1.5);
  }
  if (profile.backchannelTolerance !== undefined) {
    behavior.backchannelFrequency = clamp(0.3 + profile.backchannelTolerance * 0.3, 0.1, 0.8);
  }
  if (profile.preferredAdviceBias !== undefined) {
    behavior.adviceBias = profile.preferredAdviceBias;
  }
  if (profile.preferredTone === 'Warm') {
    behavior.warmth = 0.8;
  } else if (profile.preferredTone === 'Neutral') {
    behavior.warmth = 0.5;
  }

  return behavior;
}

/**
 * Layer 5: Get cluster-based behavior
 */
function getClusterBehaviorLayer(userId) {
  try {
    const classification = classifyUser(userId);
    if (classification.cluster === 'unknown' || classification.confidence < 0.3) {
      return { behavior: {}, cluster: null, confidence: 0 };
    }

    const clusterBehavior = getClusterBehavior(userId);
    return {
      behavior: {
        responseLength: clusterBehavior.responseLength,
        backchannelFrequency: clusterBehavior.backchannel,
        pace: clusterBehavior.pace,
        warmth: clusterBehavior.warmth
      },
      cluster: classification.cluster,
      confidence: classification.confidence
    };
  } catch (error) {
    console.warn('[BehaviorEngine] Error getting cluster behavior:', error.message);
    return { behavior: {}, cluster: null, confidence: 0 };
  }
}

/**
 * Layer 6: Get drift modifiers
 */
function getDriftBehavior() {
  try {
    const drift = getDriftModifiers();
    return {
      warmth: drift.baseWarmth,
      pace: drift.basePace,
      backchannelFrequency: drift.backchannelFrequency,
      responseLength: drift.responseLength
    };
  } catch (error) {
    console.warn('[BehaviorEngine] Error getting drift:', error.message);
    return {};
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BEHAVIOR COMPUTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get complete behavior profile for a user's current emotional state
 *
 * @param {Object} options
 * @param {string} options.userId - User ID for preferences lookup
 * @param {Object} options.emotion - { primary, secondary, confidence }
 * @param {Object} options.sessionStats - Current session statistics (optional)
 * @param {Object} options.weights - Custom layer weights (optional)
 * @returns {Object} Complete behavior profile
 */
export function getBehaviorForUserEmotion({
  userId,
  emotion,
  sessionStats = null,
  weights = null
}) {
  const primary = emotion?.primary || 'neutral';
  const confidence = Math.max(0, Math.min(1, emotion?.confidence ?? 0.5));
  const w = weights || DEFAULT_LAYER_WEIGHTS;

  // Get config for feature flags
  const config = getLunaConfig();
  const clustersEnabled = config.clusters?.enabled ?? true;
  const driftEnabled = config.personalityDrift?.enabled ?? true;
  const profilesEnabled = config.interactionProfiles?.enabled ?? true;

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 1: EMOTION BASE
  // ─────────────────────────────────────────────────────────────────────────────

  const emotionBase = getEmotionBehavior(primary);
  const neutral = EMOTION_BEHAVIORS.neutral;

  // Blend factor based on emotion confidence (30% minimum influence)
  const emotionBlend = 0.3 + 0.7 * confidence;

  let behavior = {
    timing: {
      zone1: Math.round(lerp(neutral.timing.zone1, emotionBase.timing.zone1, emotionBlend)),
      zone2: Math.round(lerp(neutral.timing.zone2, emotionBase.timing.zone2, emotionBlend)),
      zone3: Math.round(lerp(neutral.timing.zone3, emotionBase.timing.zone3, emotionBlend))
    },
    backchannelFrequency: lerp(neutral.backchannelFrequency, emotionBase.backchannelFrequency, emotionBlend),
    maxResponseTokens: Math.round(lerp(neutral.maxResponseTokens, emotionBase.maxResponseTokens, emotionBlend)),
    style: emotionBase.style,
    adviceBias: lerp(neutral.adviceBias, emotionBase.adviceBias, emotionBlend),
    warmth: lerp(neutral.warmth || 0.5, emotionBase.warmth || 0.5, emotionBlend),
    pace: lerp(neutral.pace || 1.0, emotionBase.pace || 1.0, emotionBlend),
    responseLength: 1.0,
    ttsHints: {
      rate: lerp(neutral.ttsHints.rate, emotionBase.ttsHints.rate, emotionBlend),
      pitch: lerp(neutral.ttsHints.pitch, emotionBase.ttsHints.pitch, emotionBlend),
      warmth: lerp(neutral.ttsHints.warmth, emotionBase.ttsHints.warmth, emotionBlend)
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 2: SESSION BIASES
  // ─────────────────────────────────────────────────────────────────────────────

  const sessionBiases = sessionStats
    ? getSessionBiases(sessionStats)
    : { backchannelBias: 0, responseLengthBias: 0, pauseToleranceBias: 0 };

  const sessionBehavior = getSessionBehavior(sessionBiases);
  behavior = mergeBehavior(behavior, sessionBehavior, w.session);

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 3: USER PREFERENCES
  // ─────────────────────────────────────────────────────────────────────────────

  const userPrefs = userId ? getUserPreferences(userId) : {};
  const userPrefBehavior = getUserPreferenceBehavior(userPrefs);
  behavior = mergeBehavior(behavior, userPrefBehavior, w.userPrefs);

  // Apply explicit bias overrides
  if (userPrefs.backchannelBias) {
    behavior.backchannelFrequency = clamp01(behavior.backchannelFrequency + userPrefs.backchannelBias);
  }
  if (userPrefs.responseLengthBias) {
    behavior.maxResponseTokens = Math.round(behavior.maxResponseTokens * (1 + userPrefs.responseLengthBias));
  }
  if (userPrefs.adviceBias) {
    behavior.adviceBias = clamp01(behavior.adviceBias + userPrefs.adviceBias);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 4: LONG-TERM MEMORY
  // ─────────────────────────────────────────────────────────────────────────────

  if (profilesEnabled && userId) {
    const profile = getProfile(userId);
    const memoryBehavior = getMemoryBehavior(profile);
    behavior = mergeBehavior(behavior, memoryBehavior, w.memory);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 5: CLUSTER BEHAVIOR
  // ─────────────────────────────────────────────────────────────────────────────

  let userCluster = null;
  let clusterConfidence = 0;

  if (clustersEnabled && userId) {
    const clusterData = getClusterBehaviorLayer(userId);
    if (clusterData.cluster && clusterData.confidence > 0.3) {
      behavior = mergeBehavior(behavior, clusterData.behavior, w.cluster * clusterData.confidence);
      userCluster = clusterData.cluster;
      clusterConfidence = clusterData.confidence;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 6: PERSONALITY DRIFT
  // ─────────────────────────────────────────────────────────────────────────────

  let driftModifiers = null;

  if (driftEnabled) {
    driftModifiers = getDriftModifiers();
    const driftBehavior = getDriftBehavior();
    behavior = mergeBehavior(behavior, driftBehavior, w.drift);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FINAL CLAMPING
  // ─────────────────────────────────────────────────────────────────────────────

  behavior.backchannelFrequency = clamp(behavior.backchannelFrequency, 0.1, 0.8);
  behavior.warmth = clamp(behavior.warmth, 0.2, 1.0);
  behavior.pace = clamp(behavior.pace, 0.6, 1.4);
  behavior.responseLength = clamp(behavior.responseLength, 0.5, 1.6);
  behavior.adviceBias = clamp(behavior.adviceBias, 0.1, 0.9);
  behavior.maxResponseTokens = clamp(behavior.maxResponseTokens, 80, 400);

  // Apply TTS rate from pace
  behavior.ttsHints.rate = behavior.ttsHints.rate * behavior.pace;

  // ─────────────────────────────────────────────────────────────────────────────
  // METADATA FOR DEBUGGING
  // ─────────────────────────────────────────────────────────────────────────────

  behavior._meta = {
    emotion: primary,
    confidence,
    emotionBlend,
    weights: w,
    layers: {
      session: sessionBiases,
      userPrefs: {
        backchannel: userPrefs.backchannelBias || 0,
        responseLength: userPrefs.responseLengthBias || 0,
        advice: userPrefs.adviceBias || 0
      },
      cluster: { type: userCluster, confidence: clusterConfidence },
      drift: driftModifiers
    }
  };

  // Apply lab overrides if any (for live tuning)
  return applyLabOverrides(behavior, userId);
}

/**
 * Simple blend for quick use cases
 *
 * @param {string} userId - User ID
 * @param {string} emotion - Detected emotion
 * @returns {Object} Blended behavior
 */
export function quickBlend(userId, emotion = 'neutral') {
  return getBehaviorForUserEmotion({
    userId,
    emotion: { primary: emotion, confidence: 0.7 }
  });
}

/**
 * Get behavior breakdown for debugging
 *
 * @param {string} userId - User ID
 * @param {string} emotion - Detected emotion
 * @returns {Object} Breakdown of all layers
 */
export function getBehaviorBreakdown(userId, emotion = 'neutral') {
  const profile = userId ? getProfile(userId) : null;

  return {
    emotion: getEmotionBehavior(emotion),
    session: {},
    userPrefs: userId ? getUserPreferenceBehavior(getUserPreferences(userId)) : {},
    memory: profile ? getMemoryBehavior(profile) : {},
    cluster: userId ? getClusterBehaviorLayer(userId) : { behavior: {} },
    drift: getDriftBehavior(),
    final: quickBlend(userId, emotion)
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get just the timing thresholds (for turn-taking)
 */
export function getTimingThresholds(options) {
  const behavior = getBehaviorForUserEmotion(options);
  return {
    MICRO_PAUSE_MAX: behavior.timing.zone1,
    SHORT_PAUSE_MAX: behavior.timing.zone2,
    THINKING_PAUSE_MAX: behavior.timing.zone3,
    COMPLETION_MIN: behavior.timing.zone3
  };
}

/**
 * Get just the LLM parameters
 */
export function getLLMParams(options) {
  const behavior = getBehaviorForUserEmotion(options);
  return {
    maxTokens: behavior.maxResponseTokens,
    style: behavior.style,
    adviceBias: behavior.adviceBias
  };
}

/**
 * Get just the TTS parameters
 */
export function getTTSParams(options) {
  const behavior = getBehaviorForUserEmotion(options);
  return behavior.ttsHints;
}

/**
 * Should Luna generate a backchannel? (probabilistic check)
 */
export function shouldGenerateBackchannel(options) {
  const behavior = getBehaviorForUserEmotion(options);
  return Math.random() < behavior.backchannelFrequency;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Re-export constants for convenience
export { EMOTION_BEHAVIORS, DEFAULT_BEHAVIOR, DEFAULT_LAYER_WEIGHTS };

export default {
  getBehaviorForUserEmotion,
  quickBlend,
  getBehaviorBreakdown,
  getTimingThresholds,
  getLLMParams,
  getTTSParams,
  shouldGenerateBackchannel,
  EMOTION_BEHAVIORS,
  DEFAULT_BEHAVIOR,
  DEFAULT_LAYER_WEIGHTS
};
