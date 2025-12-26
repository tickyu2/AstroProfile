/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERACTION PROFILE STORE - Long-Term Memory for User Interaction Patterns
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Stores and manages long-term interaction profiles for each user.
 * Uses exponential moving averages for slow, stable adaptation.
 *
 * Supports two storage backends:
 * - FILE: Local JSON file (for development/local testing)
 * - FIRESTORE: Firebase Firestore (for production)
 *
 * Profile data:
 * - avgPauseMs: Average pause duration before responding
 * - avgTurnLength: Average number of sentences per turn
 * - interruptRate: How often user interrupts (0-1)
 * - backchannelTolerance: Preference for backchannels (-1 to 1)
 * - preferredTone: Detected preferred tone
 * - preferredStyle: Detected preferred style
 * - emotionalBaseline: Long-term emotional distribution
 * - interactionCount: Total interactions tracked
 *
 * Created: December 21, 2025
 * Updated: December 21, 2025 - Added Firestore support
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE BACKEND CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Storage backend type
 * Set via environment variable PROFILE_STORAGE_BACKEND or defaults to 'file'
 */
const STORAGE_BACKEND = process.env.PROFILE_STORAGE_BACKEND || 'file'; // 'file' or 'firestore'

/**
 * Firestore service (lazy loaded)
 */
let firestoreService = null;

/**
 * Get Firestore service (lazy load to avoid import issues in local dev)
 */
async function getFirestoreService() {
  if (!firestoreService && STORAGE_BACKEND === 'firestore') {
    try {
      // Dynamic import for Firestore service
      const module = await import('../../functions/database/firestore/interactionProfileService.js');
      firestoreService = module;
      console.log('[InteractionProfileStore] Firestore service loaded');
    } catch (error) {
      console.warn('[InteractionProfileStore] Firestore service not available, falling back to file:', error.message);
      return null;
    }
  }
  return firestoreService;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const PROFILES_FILE = path.join(__dirname, '../data/interactionProfiles.json');
const EMA_ALPHA = 0.05; // Exponential moving average factor (slow adaptation)
const EMA_ALPHA_FAST = 0.15; // Faster adaptation for some metrics
const SAVE_DEBOUNCE_MS = 5000; // Debounce saves to reduce disk I/O

// ═══════════════════════════════════════════════════════════════════════════════
// IN-MEMORY STORE
// ═══════════════════════════════════════════════════════════════════════════════

let profiles = {};
let saveTimeout = null;
let initialized = false;

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT PROFILE TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

function createDefaultProfile() {
  return {
    avgPauseMs: 1000,
    avgTurnLength: 3.0,
    interruptRate: 0.0,
    backchannelTolerance: 0.0, // -1 to 1 (dislikes to loves)
    preferredTone: null, // Will be detected
    preferredStyle: null, // Will be detected
    emotionalBaseline: {
      happy: 0.25,
      sad: 0.05,
      anxious: 0.10,
      angry: 0.02,
      neutral: 0.50,
      excited: 0.05,
      tender: 0.03
    },
    interactionCount: 0,
    lastUpdated: new Date().toISOString(),
    sessionHistory: [] // Recent session summaries
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize the store - load profiles from disk
 */
export function initializeProfileStore() {
  if (initialized) return;

  try {
    // Ensure data directory exists
    const dataDir = path.dirname(PROFILES_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(PROFILES_FILE)) {
      const data = fs.readFileSync(PROFILES_FILE, 'utf8');
      profiles = JSON.parse(data);
      console.log(`[InteractionProfileStore] Loaded ${Object.keys(profiles).length} profiles`);
    } else {
      profiles = {};
      console.log('[InteractionProfileStore] No existing profiles, starting fresh');
    }
    initialized = true;
  } catch (error) {
    console.error('[InteractionProfileStore] Error loading profiles:', error);
    profiles = {};
    initialized = true;
  }
}

/**
 * Save profiles to disk (debounced)
 */
function scheduleSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveProfiles();
  }, SAVE_DEBOUNCE_MS);
}

/**
 * Immediately save profiles to disk
 */
export function saveProfiles() {
  try {
    const dataDir = path.dirname(PROFILES_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
    console.log(`[InteractionProfileStore] Saved ${Object.keys(profiles).length} profiles`);
  } catch (error) {
    console.error('[InteractionProfileStore] Error saving profiles:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE ACCESS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get a user's interaction profile (creates default if not exists)
 *
 * @param {string} userId - User identifier
 * @param {string} profileId - Profile ID (for multi-profile support)
 * @returns {Object|Promise<Object>} User's interaction profile
 */
export function getProfile(userId, profileId = 'default') {
  // If using Firestore, delegate to async version
  if (STORAGE_BACKEND === 'firestore') {
    return getProfileAsync(userId, profileId);
  }

  // File-based storage (synchronous)
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
    scheduleSave();
  }
  return { ...profiles[userId] };
}

/**
 * Async version for Firestore backend
 *
 * @param {string} userId - User identifier
 * @param {string} profileId - Profile ID
 * @returns {Promise<Object>} User's interaction profile
 */
export async function getProfileAsync(userId, profileId = 'default') {
  const firestore = await getFirestoreService();

  if (firestore) {
    try {
      const profile = await firestore.getProfile(userId, profileId);
      return profile;
    } catch (error) {
      console.error('[InteractionProfileStore] Firestore getProfile error:', error);
      // Fall back to file
    }
  }

  // Fallback to file-based
  initializeProfileStore();
  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
    scheduleSave();
  }
  return { ...profiles[userId] };
}

/**
 * Get all profiles (for admin/analytics)
 *
 * @returns {Object} All user profiles
 */
export function getAllProfiles() {
  initializeProfileStore();
  return { ...profiles };
}

/**
 * Check if a user has an existing profile
 *
 * @param {string} userId - User identifier
 * @returns {boolean} True if profile exists
 */
export function hasProfile(userId) {
  initializeProfileStore();
  return !!profiles[userId];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPONENTIAL MOVING AVERAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate exponential moving average
 * newValue = oldValue * (1 - alpha) + observedValue * alpha
 *
 * @param {number} oldValue - Current stored value
 * @param {number} newObservation - New observed value
 * @param {number} alpha - Learning rate (0-1, higher = faster adaptation)
 * @returns {number} Updated value
 */
function ema(oldValue, newObservation, alpha = EMA_ALPHA) {
  if (oldValue === null || oldValue === undefined) {
    return newObservation;
  }
  return oldValue * (1 - alpha) + newObservation * alpha;
}

/**
 * Update an emotional baseline distribution
 *
 * @param {Object} baseline - Current baseline { emotion: probability }
 * @param {string} detectedEmotion - Newly detected emotion
 * @param {number} alpha - Learning rate
 * @returns {Object} Updated baseline
 */
function updateEmotionalBaseline(baseline, detectedEmotion, alpha = EMA_ALPHA) {
  const updated = { ...baseline };

  // Boost detected emotion, decay others
  for (const emotion in updated) {
    if (emotion === detectedEmotion) {
      updated[emotion] = ema(updated[emotion], 1.0, alpha);
    } else {
      updated[emotion] = ema(updated[emotion], 0.0, alpha * 0.5);
    }
  }

  // Normalize to sum to 1
  const total = Object.values(updated).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (const emotion in updated) {
      updated[emotion] = updated[emotion] / total;
    }
  }

  return updated;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Update pause/timing metrics
 *
 * @param {string} userId - User identifier
 * @param {number} pauseMs - Observed pause duration in milliseconds
 */
export function updatePauseTiming(userId, pauseMs) {
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  profiles[userId].avgPauseMs = ema(profiles[userId].avgPauseMs, pauseMs);
  profiles[userId].interactionCount++;
  profiles[userId].lastUpdated = new Date().toISOString();
  scheduleSave();
}

/**
 * Update turn length metrics
 *
 * @param {string} userId - User identifier
 * @param {number} turnLength - Number of sentences/segments in turn
 */
export function updateTurnLength(userId, turnLength) {
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  profiles[userId].avgTurnLength = ema(profiles[userId].avgTurnLength, turnLength);
  profiles[userId].lastUpdated = new Date().toISOString();
  scheduleSave();
}

/**
 * Record an interrupt event
 *
 * @param {string} userId - User identifier
 * @param {boolean} didInterrupt - Whether user interrupted (true) or not (false)
 */
export function updateInterruptRate(userId, didInterrupt) {
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  const observation = didInterrupt ? 1.0 : 0.0;
  profiles[userId].interruptRate = ema(profiles[userId].interruptRate, observation, EMA_ALPHA_FAST);
  profiles[userId].lastUpdated = new Date().toISOString();
  scheduleSave();
}

/**
 * Update backchannel tolerance based on reaction
 *
 * @param {string} userId - User identifier
 * @param {string} reaction - 'appreciated', 'spoke_over', or 'neutral'
 */
export function updateBackchannelTolerance(userId, reaction) {
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  let delta = 0;
  if (reaction === 'appreciated') {
    delta = 0.1; // User likes backchannels
  } else if (reaction === 'spoke_over') {
    delta = -0.15; // User dislikes backchannels
  }

  if (delta !== 0) {
    const current = profiles[userId].backchannelTolerance;
    profiles[userId].backchannelTolerance = Math.max(-1, Math.min(1, current + delta * EMA_ALPHA_FAST * 10));
    profiles[userId].lastUpdated = new Date().toISOString();
    scheduleSave();
  }
}

/**
 * Update detected emotional state
 *
 * @param {string} userId - User identifier
 * @param {string} emotion - Detected primary emotion
 */
export function updateEmotionalState(userId, emotion) {
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  if (emotion && profiles[userId].emotionalBaseline[emotion] !== undefined) {
    profiles[userId].emotionalBaseline = updateEmotionalBaseline(
      profiles[userId].emotionalBaseline,
      emotion
    );
    profiles[userId].lastUpdated = new Date().toISOString();
    scheduleSave();
  }
}

/**
 * Update preferred tone based on positive feedback signals
 *
 * @param {string} userId - User identifier
 * @param {string} tone - Tone that received positive feedback
 */
export function updatePreferredTone(userId, tone) {
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  // Only update if we have a tone
  if (tone) {
    profiles[userId].preferredTone = tone;
    profiles[userId].lastUpdated = new Date().toISOString();
    scheduleSave();
  }
}

/**
 * Update preferred style based on positive feedback signals
 *
 * @param {string} userId - User identifier
 * @param {string} style - Style that received positive feedback
 */
export function updatePreferredStyle(userId, style) {
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  if (style) {
    profiles[userId].preferredStyle = style;
    profiles[userId].lastUpdated = new Date().toISOString();
    scheduleSave();
  }
}

/**
 * Record a session summary for history
 *
 * @param {string} userId - User identifier
 * @param {Object} sessionSummary - Summary of the session
 */
export function recordSessionSummary(userId, sessionSummary) {
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  // Keep last 20 sessions
  profiles[userId].sessionHistory = profiles[userId].sessionHistory || [];
  profiles[userId].sessionHistory.unshift({
    ...sessionSummary,
    timestamp: new Date().toISOString()
  });
  if (profiles[userId].sessionHistory.length > 20) {
    profiles[userId].sessionHistory = profiles[userId].sessionHistory.slice(0, 20);
  }

  profiles[userId].lastUpdated = new Date().toISOString();
  scheduleSave();
}

/**
 * Bulk update profile from session data
 *
 * @param {string} userId - User identifier
 * @param {Object} sessionData - Session metrics
 * @param {string} profileId - Profile ID (for multi-profile support)
 */
export function updateFromSession(userId, sessionData, profileId = 'default') {
  // If using Firestore, delegate to async version
  if (STORAGE_BACKEND === 'firestore') {
    return updateFromSessionAsync(userId, sessionData, profileId);
  }

  // File-based storage
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  const profile = profiles[userId];

  // Update metrics if provided
  if (sessionData.avgPauseMs !== undefined) {
    profile.avgPauseMs = ema(profile.avgPauseMs, sessionData.avgPauseMs);
  }

  if (sessionData.avgTurnLength !== undefined) {
    profile.avgTurnLength = ema(profile.avgTurnLength, sessionData.avgTurnLength);
  }

  if (sessionData.interruptCount !== undefined && sessionData.totalTurns !== undefined) {
    const sessionInterruptRate = sessionData.totalTurns > 0
      ? sessionData.interruptCount / sessionData.totalTurns
      : 0;
    profile.interruptRate = ema(profile.interruptRate, sessionInterruptRate);
  }

  if (sessionData.emotionCounts) {
    // Update emotional baseline from session emotion distribution
    const total = Object.values(sessionData.emotionCounts).reduce((a, b) => a + b, 0);
    if (total > 0) {
      for (const emotion in sessionData.emotionCounts) {
        if (profile.emotionalBaseline[emotion] !== undefined) {
          const sessionRatio = sessionData.emotionCounts[emotion] / total;
          profile.emotionalBaseline[emotion] = ema(profile.emotionalBaseline[emotion], sessionRatio);
        }
      }
    }
  }

  profile.interactionCount += sessionData.totalTurns || 1;
  profile.lastUpdated = new Date().toISOString();
  scheduleSave();
}

/**
 * Async version for Firestore backend
 *
 * @param {string} userId - User identifier
 * @param {Object} sessionData - Session metrics
 * @param {string} profileId - Profile ID
 */
export async function updateFromSessionAsync(userId, sessionData, profileId = 'default') {
  const firestore = await getFirestoreService();

  if (firestore) {
    try {
      // Convert sessionData format for Firestore service
      const firestoreSessionData = {
        avgPauseMs: sessionData.avgPauseMs,
        avgTurnLength: sessionData.avgTurnLength,
        interruptRate: sessionData.interruptCount !== undefined && sessionData.totalTurns !== undefined
          ? (sessionData.totalTurns > 0 ? sessionData.interruptCount / sessionData.totalTurns : 0)
          : undefined,
        turnCount: sessionData.totalTurns || 1,
        emotionCounts: sessionData.emotionCounts
      };

      await firestore.updateFromSession(userId, firestoreSessionData, profileId);
      return;
    } catch (error) {
      console.error('[InteractionProfileStore] Firestore updateFromSession error:', error);
      // Fall back to file
    }
  }

  // Fallback to file-based
  initializeProfileStore();

  if (!profiles[userId]) {
    profiles[userId] = createDefaultProfile();
  }

  const profile = profiles[userId];

  if (sessionData.avgPauseMs !== undefined) {
    profile.avgPauseMs = ema(profile.avgPauseMs, sessionData.avgPauseMs);
  }

  if (sessionData.avgTurnLength !== undefined) {
    profile.avgTurnLength = ema(profile.avgTurnLength, sessionData.avgTurnLength);
  }

  if (sessionData.interruptCount !== undefined && sessionData.totalTurns !== undefined) {
    const sessionInterruptRate = sessionData.totalTurns > 0
      ? sessionData.interruptCount / sessionData.totalTurns
      : 0;
    profile.interruptRate = ema(profile.interruptRate, sessionInterruptRate);
  }

  profile.interactionCount += sessionData.totalTurns || 1;
  profile.lastUpdated = new Date().toISOString();
  scheduleSave();
}

/**
 * Reset a user's profile to defaults
 *
 * @param {string} userId - User identifier
 */
export function resetProfile(userId) {
  initializeProfileStore();
  profiles[userId] = createDefaultProfile();
  saveProfiles();
  console.log(`[InteractionProfileStore] Reset profile for ${userId}`);
}

/**
 * Delete a user's profile entirely
 *
 * @param {string} userId - User identifier
 */
export function deleteProfile(userId) {
  initializeProfileStore();
  delete profiles[userId];
  saveProfiles();
  console.log(`[InteractionProfileStore] Deleted profile for ${userId}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get profile statistics for analytics
 *
 * @returns {Object} Aggregate statistics
 */
export function getProfileStats() {
  initializeProfileStore();

  const userIds = Object.keys(profiles);
  const count = userIds.length;

  if (count === 0) {
    return {
      totalProfiles: 0,
      avgInteractionCount: 0,
      avgPauseMs: 0,
      avgTurnLength: 0,
      avgInterruptRate: 0
    };
  }

  let totalInteractions = 0;
  let totalPauseMs = 0;
  let totalTurnLength = 0;
  let totalInterruptRate = 0;

  for (const userId of userIds) {
    const p = profiles[userId];
    totalInteractions += p.interactionCount || 0;
    totalPauseMs += p.avgPauseMs || 0;
    totalTurnLength += p.avgTurnLength || 0;
    totalInterruptRate += p.interruptRate || 0;
  }

  return {
    totalProfiles: count,
    avgInteractionCount: totalInteractions / count,
    avgPauseMs: totalPauseMs / count,
    avgTurnLength: totalTurnLength / count,
    avgInterruptRate: totalInterruptRate / count
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE BACKEND UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get the current storage backend type
 * @returns {string} 'file' or 'firestore'
 */
export function getStorageBackend() {
  return STORAGE_BACKEND;
}

/**
 * Check if using Firestore backend
 * @returns {boolean}
 */
export function isUsingFirestore() {
  return STORAGE_BACKEND === 'firestore';
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  initializeProfileStore,
  saveProfiles,
  getProfile,
  getProfileAsync,
  getAllProfiles,
  hasProfile,
  updatePauseTiming,
  updateTurnLength,
  updateInterruptRate,
  updateBackchannelTolerance,
  updateEmotionalState,
  updatePreferredTone,
  updatePreferredStyle,
  recordSessionSummary,
  updateFromSession,
  updateFromSessionAsync,
  resetProfile,
  deleteProfile,
  getProfileStats,
  getStorageBackend,
  isUsingFirestore
};
