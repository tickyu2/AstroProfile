/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LEARNING SIGNALS - User Behavior Learning System
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Processes user interaction signals to learn preferences over time.
 * Luna adapts her behavior based on implicit feedback from user actions.
 *
 * Signal Types:
 * - Interruption: User cuts Luna off → prefers shorter responses
 * - Silence comfort: User leaves long pauses → tolerates patience
 * - Backchannel rejection: User talks over cues → reduce backchannels
 * - Advice seeking: User asks for suggestions → increase advice bias
 * - Reflection preference: User shares feelings → decrease advice bias
 *
 * Learning uses exponential decay: recent signals matter more.
 *
 * Created: December 21, 2025
 */

import {
  getUserPreferences,
  updateUserPreferences,
  incrementInteractionCount
} from './userPreferencesStore.js';

/**
 * Learning rate configuration
 */
const LEARNING_CONFIG = {
  // Base learning rate per signal
  baseRate: 0.05,

  // Decay factor for learning rate based on interaction count
  // More interactions = smaller adjustments (user preference is stable)
  decayFactor: 0.995,

  // Minimum learning rate (never go below this)
  minRate: 0.01,

  // Signals needed before we start learning (cold start threshold)
  coldStartThreshold: 3,

  // Signal weight multipliers
  signalWeights: {
    interrupt: 1.0,           // Standard weight
    silenceComfort: 0.8,      // Slightly lower (less certain signal)
    backchannelReject: 1.2,   // Higher weight (clear signal)
    adviceSeek: 0.7,          // Lower weight (implicit signal)
    reflectionPrefer: 0.7,    // Lower weight (implicit signal)
    explicitFeedback: 2.0     // Very high (user explicitly told us)
  }
};

/**
 * Calculate current learning rate based on interaction count.
 * More interactions = more stable preferences = smaller adjustments.
 *
 * @param {number} interactionCount - Number of user interactions
 * @returns {number} Current learning rate
 */
function getLearningRate(interactionCount) {
  const decayed = LEARNING_CONFIG.baseRate *
    Math.pow(LEARNING_CONFIG.decayFactor, interactionCount);
  return Math.max(LEARNING_CONFIG.minRate, decayed);
}

/**
 * Apply a learning signal to update user preferences.
 *
 * @param {string} userId - User ID
 * @param {string} prefKey - Preference key to adjust
 * @param {number} direction - Direction of adjustment (-1 or +1)
 * @param {string} signalType - Type of signal for weighting
 * @returns {Object} Updated preferences
 */
function applySignal(userId, prefKey, direction, signalType = 'interrupt') {
  const prefs = getUserPreferences(userId);

  // Skip if not enough interactions for learning
  if (prefs.interactionCount < LEARNING_CONFIG.coldStartThreshold) {
    console.log(`[Learning] Skipping signal - cold start (${prefs.interactionCount}/${LEARNING_CONFIG.coldStartThreshold})`);
    return prefs;
  }

  const rate = getLearningRate(prefs.interactionCount);
  const weight = LEARNING_CONFIG.signalWeights[signalType] || 1.0;
  const adjustment = rate * weight * direction;

  const newValue = prefs[prefKey] + adjustment;

  console.log(`[Learning] ${signalType}: ${prefKey} ${direction > 0 ? '+' : ''}${adjustment.toFixed(4)} → ${newValue.toFixed(4)}`);

  return updateUserPreferences(userId, { [prefKey]: newValue });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Signal: User interrupted Luna while she was speaking.
 * Interpretation: User prefers shorter responses.
 *
 * @param {string} userId - User ID
 */
export function signalUserInterruptedLuna(userId) {
  return applySignal(userId, 'responseLengthBias', -1, 'interrupt');
}

/**
 * Signal: Luna completed a full response without interruption.
 * Interpretation: Response length was acceptable (mild positive signal).
 *
 * @param {string} userId - User ID
 */
export function signalResponseCompleted(userId) {
  // Very mild positive adjustment
  const prefs = getUserPreferences(userId);
  if (prefs.responseLengthBias < 0) {
    // Only if currently biased short, nudge toward neutral
    return applySignal(userId, 'responseLengthBias', 0.3, 'silenceComfort');
  }
  return prefs;
}

/**
 * Signal: User left a long silence (thinking pause+) without discomfort.
 * Interpretation: User tolerates/prefers patience.
 *
 * @param {string} userId - User ID
 * @param {number} silenceDuration - Duration of silence in ms
 */
export function signalSilenceComfort(userId, silenceDuration) {
  // Only learn if silence was notably long (>3s)
  if (silenceDuration > 3000) {
    return applySignal(userId, 'pauseToleranceBias', 1, 'silenceComfort');
  }
  return getUserPreferences(userId);
}

/**
 * Signal: User spoke over or immediately after a backchannel.
 * Interpretation: User doesn't appreciate backchannels.
 *
 * @param {string} userId - User ID
 */
export function signalBackchannelRejected(userId) {
  return applySignal(userId, 'backchannelBias', -1, 'backchannelReject');
}

/**
 * Signal: User paused appreciatively after backchannel (brief silence then continued).
 * Interpretation: User appreciates backchannels.
 *
 * @param {string} userId - User ID
 */
export function signalBackchannelAppreciated(userId) {
  return applySignal(userId, 'backchannelBias', 0.5, 'silenceComfort');
}

/**
 * Signal: User explicitly asked for advice or suggestions.
 * Interpretation: User wants more advisory responses.
 *
 * @param {string} userId - User ID
 */
export function signalAdviceSeeking(userId) {
  return applySignal(userId, 'adviceBias', 1, 'adviceSeek');
}

/**
 * Signal: User is sharing feelings/venting without asking for solutions.
 * Interpretation: User wants more reflective responses.
 *
 * @param {string} userId - User ID
 */
export function signalReflectionPreference(userId) {
  return applySignal(userId, 'adviceBias', -1, 'reflectionPrefer');
}

/**
 * Signal: User gave explicit feedback (e.g., "speak less", "give me more space").
 * Interpretation: Direct preference expression.
 *
 * @param {string} userId - User ID
 * @param {string} prefKey - Preference to adjust
 * @param {number} direction - Direction (-1 or +1)
 */
export function signalExplicitFeedback(userId, prefKey, direction) {
  return applySignal(userId, prefKey, direction, 'explicitFeedback');
}

/**
 * Signal: End of a conversation turn.
 * Used for tracking interaction count.
 *
 * @param {string} userId - User ID
 */
export function signalTurnComplete(userId) {
  incrementInteractionCount(userId);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect advice-seeking phrases in user text.
 * Call this to check if user is asking for advice.
 *
 * @param {string} text - User's transcribed speech
 * @returns {boolean} True if user seems to be seeking advice
 */
export function detectAdviceSeeking(text) {
  const advicePhrases = [
    'what should i',
    'what do you think',
    'any advice',
    'any suggestions',
    'what would you',
    'how should i',
    'can you help me',
    'i need help',
    'tell me what to',
    'recommend',
    'suggestion'
  ];

  const lower = text.toLowerCase();
  return advicePhrases.some(phrase => lower.includes(phrase));
}

/**
 * Detect reflection/venting phrases in user text.
 * Call this to check if user is just sharing feelings.
 *
 * @param {string} text - User's transcribed speech
 * @returns {boolean} True if user seems to be venting/reflecting
 */
export function detectReflectionMode(text) {
  const reflectionPhrases = [
    'i feel',
    'i just need to',
    'i want to share',
    'let me tell you',
    'i\'m feeling',
    'it\'s been',
    'i\'ve been',
    'i don\'t know why',
    'just listen',
    'vent'
  ];

  const lower = text.toLowerCase();
  return reflectionPhrases.some(phrase => lower.includes(phrase));
}

/**
 * Process user text and send appropriate learning signals.
 * Call this after each user turn.
 *
 * @param {string} userId - User ID
 * @param {string} text - User's transcribed speech
 */
export function processTextSignals(userId, text) {
  if (detectAdviceSeeking(text)) {
    signalAdviceSeeking(userId);
  } else if (detectReflectionMode(text)) {
    signalReflectionPreference(userId);
  }
}

export default {
  signalUserInterruptedLuna,
  signalResponseCompleted,
  signalSilenceComfort,
  signalBackchannelRejected,
  signalBackchannelAppreciated,
  signalAdviceSeeking,
  signalReflectionPreference,
  signalExplicitFeedback,
  signalTurnComplete,
  detectAdviceSeeking,
  detectReflectionMode,
  processTextSignals
};
