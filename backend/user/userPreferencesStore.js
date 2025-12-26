/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USER PREFERENCES STORE - Per-User Learned Behavior Overrides
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Stores and retrieves per-user preferences that override default Luna behavior.
 * Luna learns these preferences over time through interaction signals.
 *
 * Preference Types:
 * - backchannelBias: How much to adjust backchannel frequency (-0.3 to +0.3)
 * - responseLengthBias: How much to adjust response length (-0.4 to +0.4)
 * - pauseToleranceBias: How much to adjust pause thresholds (-0.3 to +0.3)
 * - adviceBias: How much to adjust advice vs reflection (-0.3 to +0.3)
 *
 * Storage: In-memory with pluggable persistence hooks.
 * For production, persist to Firestore/PostgreSQL.
 *
 * Created: December 21, 2025
 */

/**
 * In-memory store: userId -> preferences
 */
const userPrefs = new Map();

/**
 * Default preference values
 */
const DEFAULT_PREFERENCES = {
  // Backchannel frequency adjustment
  // Negative = fewer backchannels, Positive = more backchannels
  backchannelBias: 0,

  // Response length adjustment
  // Negative = shorter responses, Positive = longer responses
  responseLengthBias: 0,

  // Pause tolerance adjustment
  // Negative = faster response, Positive = more patience
  pauseToleranceBias: 0,

  // Advice vs reflection adjustment
  // Negative = more reflective, Positive = more advisory
  adviceBias: 0,

  // Tone preference (if user shows preference for certain tones)
  preferredTone: null,

  // Metadata
  interactionCount: 0,
  lastUpdated: null,
  createdAt: null
};

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get preferences for a user.
 * Creates default preferences if user doesn't exist.
 *
 * @param {string} userId - User ID
 * @returns {Object} User preferences
 */
export function getUserPreferences(userId) {
  if (!userId) {
    return { ...DEFAULT_PREFERENCES };
  }

  if (!userPrefs.has(userId)) {
    const newPrefs = {
      ...DEFAULT_PREFERENCES,
      createdAt: new Date().toISOString()
    };
    userPrefs.set(userId, newPrefs);
  }

  return userPrefs.get(userId);
}

/**
 * Update preferences for a user.
 * Applies clamping to keep values in valid ranges.
 *
 * @param {string} userId - User ID
 * @param {Object} updates - Preference updates
 * @returns {Object} Updated preferences
 */
export function updateUserPreferences(userId, updates) {
  const current = getUserPreferences(userId);

  const next = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  // Clamp bias values to valid ranges
  next.backchannelBias = clamp(next.backchannelBias, -0.3, 0.3);
  next.responseLengthBias = clamp(next.responseLengthBias, -0.4, 0.4);
  next.pauseToleranceBias = clamp(next.pauseToleranceBias, -0.3, 0.3);
  next.adviceBias = clamp(next.adviceBias, -0.3, 0.3);

  userPrefs.set(userId, next);

  // TODO: Persist to database
  // await persistToFirestore(userId, next);

  return next;
}

/**
 * Increment interaction count for a user.
 * Called at the end of each turn.
 *
 * @param {string} userId - User ID
 */
export function incrementInteractionCount(userId) {
  const prefs = getUserPreferences(userId);
  prefs.interactionCount += 1;
  prefs.lastUpdated = new Date().toISOString();
  userPrefs.set(userId, prefs);
}

/**
 * Reset a specific preference to default.
 *
 * @param {string} userId - User ID
 * @param {string} prefKey - Preference key to reset
 */
export function resetPreference(userId, prefKey) {
  const current = getUserPreferences(userId);
  if (prefKey in DEFAULT_PREFERENCES) {
    current[prefKey] = DEFAULT_PREFERENCES[prefKey];
    current.lastUpdated = new Date().toISOString();
    userPrefs.set(userId, current);
  }
  return current;
}

/**
 * Reset all preferences to default for a user.
 *
 * @param {string} userId - User ID
 */
export function resetAllPreferences(userId) {
  const fresh = {
    ...DEFAULT_PREFERENCES,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
  userPrefs.set(userId, fresh);
  return fresh;
}

/**
 * Get a summary of how preferences differ from default.
 * Useful for debugging and display.
 *
 * @param {string} userId - User ID
 * @returns {Object} Summary with descriptions
 */
export function getPreferenceSummary(userId) {
  const prefs = getUserPreferences(userId);

  const describeB = (val, pos, neg) => {
    if (val > 0.1) return pos;
    if (val < -0.1) return neg;
    return 'default';
  };

  return {
    backchannels: describeB(prefs.backchannelBias, 'more frequent', 'less frequent'),
    responseLength: describeB(prefs.responseLengthBias, 'longer', 'shorter'),
    pauseTolerance: describeB(prefs.pauseToleranceBias, 'more patient', 'quicker'),
    adviceStyle: describeB(prefs.adviceBias, 'more advisory', 'more reflective'),
    interactions: prefs.interactionCount,
    hasLearned: prefs.interactionCount > 10
  };
}

/**
 * Persistence hooks for external storage.
 * Override these for production persistence.
 */
export const persistenceHooks = {
  /**
   * Called after preferences are updated.
   * Override to persist to database.
   */
  onUpdate: async (userId, prefs) => {
    // Default: no-op
    // Example: await db.collection('userPreferences').doc(userId).set(prefs);
  },

  /**
   * Called to load preferences from external storage.
   * Override to load from database.
   */
  onLoad: async (userId) => {
    // Default: return null (use in-memory)
    // Example: return await db.collection('userPreferences').doc(userId).get();
    return null;
  }
};

/**
 * Load preferences from external storage (if hook is set).
 *
 * @param {string} userId - User ID
 */
export async function loadUserPreferences(userId) {
  const external = await persistenceHooks.onLoad(userId);
  if (external) {
    userPrefs.set(userId, { ...DEFAULT_PREFERENCES, ...external });
  }
  return getUserPreferences(userId);
}

/**
 * Get all user preferences (for debugging)
 *
 * @returns {Array} Array of { userId, prefs }
 */
export function getAllUserPreferences() {
  const result = [];
  for (const [userId, prefs] of userPrefs.entries()) {
    result.push({ userId, prefs });
  }
  return result;
}

/**
 * Reset all user preferences (for debugging)
 */
export function resetAllUserPreferences() {
  const count = userPrefs.size;
  userPrefs.clear();
  console.log(`[UserPreferencesStore] Reset ${count} user preference sets`);
}

/**
 * Get count of users with preferences
 *
 * @returns {number} Number of users with preferences
 */
export function getUserCount() {
  return userPrefs.size;
}

export default {
  getUserPreferences,
  updateUserPreferences,
  incrementInteractionCount,
  resetPreference,
  resetAllPreferences,
  getPreferenceSummary,
  loadUserPreferences,
  getAllUserPreferences,
  resetAllUserPreferences,
  getUserCount,
  persistenceHooks
};
