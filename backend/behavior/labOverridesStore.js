/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LAB OVERRIDES STORE - Live Behavior Tuning for Luna Lab Mode
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Allows developers to override Luna's behavior parameters in real-time
 * without restarting the server. Perfect for tuning and experimentation.
 *
 * Overrides:
 * - backchannelFrequency: Override backchannel probability (0-1)
 * - maxResponseTokens: Override max LLM tokens (20-600)
 * - pauseScale: Scale timing zones (0.4-2.0)
 * - adviceBias: Override advice vs reflection bias (0-1)
 * - style: Force a specific style (gentle, playful, etc.)
 *
 * Created: December 21, 2025
 */

/**
 * In-memory lab overrides storage
 * Key: userId, Value: override settings
 */
const labOverrides = new Map();

/**
 * Default empty overrides (null means "use computed value")
 */
const DEFAULT_OVERRIDES = {
  backchannelFrequency: null,
  maxResponseTokens: null,
  pauseScale: null,
  adviceBias: null,
  style: null
};

/**
 * Get lab overrides for a user
 *
 * @param {string} userId
 * @returns {Object|null} Override settings or null if none
 */
export function getLabOverrides(userId) {
  return labOverrides.get(userId) || null;
}

/**
 * Set lab overrides for a user
 *
 * @param {string} userId
 * @param {Object} overrides - Override settings (partial)
 * @returns {Object} Merged override settings
 */
export function setLabOverrides(userId, overrides) {
  const current = labOverrides.get(userId) || { ...DEFAULT_OVERRIDES };
  const merged = { ...current, ...overrides };

  // Validate and clamp values
  if (merged.backchannelFrequency !== null) {
    merged.backchannelFrequency = Math.max(0, Math.min(1, merged.backchannelFrequency));
  }
  if (merged.maxResponseTokens !== null) {
    merged.maxResponseTokens = Math.max(20, Math.min(600, Math.round(merged.maxResponseTokens)));
  }
  if (merged.pauseScale !== null) {
    merged.pauseScale = Math.max(0.4, Math.min(2.0, merged.pauseScale));
  }
  if (merged.adviceBias !== null) {
    merged.adviceBias = Math.max(0, Math.min(1, merged.adviceBias));
  }

  labOverrides.set(userId, merged);
  console.log(`[LabOverrides] Set for ${userId}:`, merged);
  return merged;
}

/**
 * Clear lab overrides for a user
 *
 * @param {string} userId
 * @returns {boolean} Whether overrides were cleared
 */
export function clearLabOverrides(userId) {
  const deleted = labOverrides.delete(userId);
  if (deleted) {
    console.log(`[LabOverrides] Cleared for ${userId}`);
  }
  return deleted;
}

/**
 * Get all lab overrides (for debugging)
 *
 * @returns {Array} Array of { userId, overrides }
 */
export function getAllLabOverrides() {
  const result = [];
  for (const [userId, overrides] of labOverrides.entries()) {
    result.push({ userId, overrides });
  }
  return result;
}

/**
 * Clear all lab overrides
 */
export function resetAllLabOverrides() {
  const count = labOverrides.size;
  labOverrides.clear();
  console.log(`[LabOverrides] Reset ${count} override sets`);
}

/**
 * Apply lab overrides to a behavior profile
 *
 * @param {Object} behavior - Computed behavior profile
 * @param {string} userId - User ID to check for overrides
 * @returns {Object} Behavior with overrides applied
 */
export function applyLabOverrides(behavior, userId) {
  const overrides = getLabOverrides(userId);
  if (!overrides) return behavior;

  // Clone behavior to avoid mutation
  const result = {
    ...behavior,
    timing: { ...behavior.timing },
    ttsHints: { ...behavior.ttsHints }
  };

  // Apply overrides
  if (overrides.backchannelFrequency !== null) {
    result.backchannelFrequency = overrides.backchannelFrequency;
    result._labOverride = result._labOverride || {};
    result._labOverride.backchannelFrequency = true;
  }

  if (overrides.maxResponseTokens !== null) {
    result.maxResponseTokens = overrides.maxResponseTokens;
    result._labOverride = result._labOverride || {};
    result._labOverride.maxResponseTokens = true;
  }

  if (overrides.pauseScale !== null) {
    result.timing.zone1 = Math.round(result.timing.zone1 * overrides.pauseScale);
    result.timing.zone2 = Math.round(result.timing.zone2 * overrides.pauseScale);
    result.timing.zone3 = Math.round(result.timing.zone3 * overrides.pauseScale);
    result._labOverride = result._labOverride || {};
    result._labOverride.pauseScale = overrides.pauseScale;
  }

  if (overrides.adviceBias !== null) {
    result.adviceBias = overrides.adviceBias;
    result._labOverride = result._labOverride || {};
    result._labOverride.adviceBias = true;
  }

  if (overrides.style !== null) {
    result.style = overrides.style;
    result._labOverride = result._labOverride || {};
    result._labOverride.style = true;
  }

  return result;
}

export default {
  getLabOverrides,
  setLabOverrides,
  clearLabOverrides,
  getAllLabOverrides,
  resetAllLabOverrides,
  applyLabOverrides
};
