/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERACTION PROFILE SERVICE
 * Firestore operations for user interaction profiles
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Collection path: luna_profiles/{userId}/interaction_profiles/{profileId}
 *
 * This service handles:
 * - Reading/writing user interaction profiles
 * - Session snapshot storage
 * - EMA-based profile updates
 * - Cluster assignment management
 */

const admin = require('firebase-admin');

// EMA alpha for slow adaptation
const EMA_ALPHA = 0.05;
const EMA_ALPHA_FAST = 0.15;

/**
 * Get Firestore instance
 */
function getFirestore() {
  return admin.firestore();
}

/**
 * Get the default profile document structure
 */
function getDefaultProfile() {
  return {
    avgPauseMs: 1000.0,
    avgTurnLength: 3.0,
    interruptRate: 0.0,
    backchannelTolerance: 0.0,
    preferredTone: null,
    preferredStyle: null,
    emotionalBaseline: {
      neutral: 0.6,
      happy: 0.15,
      sad: 0.05,
      anxious: 0.05,
      angry: 0.02,
      excited: 0.03,
      tender: 0.05,
      confused: 0.03,
      fearful: 0.02
    },
    clusterId: null,
    clusterConfidence: 0.0,
    totalInteractions: 0,
    totalSessions: 0,
    lastSessionAt: null,
    toneCounts: {},
    styleCounts: {},
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
}

/**
 * Get a user's interaction profile
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID (default: 'default')
 * @returns {Promise<Object>} Profile document
 */
async function getProfile(userId, profileId = 'default') {
  const db = getFirestore();
  const docRef = db
    .collection('luna_profiles')
    .doc(userId)
    .collection('interaction_profiles')
    .doc(profileId);

  const doc = await docRef.get();

  if (!doc.exists) {
    // Return default profile structure
    return {
      id: profileId,
      userId,
      ...getDefaultProfile(),
      exists: false
    };
  }

  return {
    id: doc.id,
    userId,
    ...doc.data(),
    exists: true
  };
}

/**
 * Create or update a user's interaction profile
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} data - Profile data to set/merge
 * @param {boolean} merge - Whether to merge with existing data
 * @returns {Promise<Object>} Updated profile
 */
async function setProfile(userId, profileId = 'default', data, merge = true) {
  const db = getFirestore();
  const docRef = db
    .collection('luna_profiles')
    .doc(userId)
    .collection('interaction_profiles')
    .doc(profileId);

  const updateData = {
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await docRef.set(updateData, { merge });

  return getProfile(userId, profileId);
}

/**
 * Update pause timing with EMA
 * @param {string} userId - User ID
 * @param {number} pauseMs - Observed pause in milliseconds
 * @param {string} profileId - Profile ID
 */
async function updatePauseTiming(userId, pauseMs, profileId = 'default') {
  const profile = await getProfile(userId, profileId);
  const oldValue = profile.avgPauseMs || 1000;
  const newValue = oldValue * (1 - EMA_ALPHA) + pauseMs * EMA_ALPHA;

  await setProfile(userId, profileId, {
    avgPauseMs: newValue,
    totalInteractions: admin.firestore.FieldValue.increment(1)
  });

  return { oldValue, newValue };
}

/**
 * Update turn length with EMA
 * @param {string} userId - User ID
 * @param {number} turnLength - Observed turn length (words or sentences)
 * @param {string} profileId - Profile ID
 */
async function updateTurnLength(userId, turnLength, profileId = 'default') {
  const profile = await getProfile(userId, profileId);
  const oldValue = profile.avgTurnLength || 3.0;
  const newValue = oldValue * (1 - EMA_ALPHA) + turnLength * EMA_ALPHA;

  await setProfile(userId, profileId, {
    avgTurnLength: newValue
  });

  return { oldValue, newValue };
}

/**
 * Update interrupt rate with EMA
 * @param {string} userId - User ID
 * @param {boolean} interrupted - Whether an interruption occurred
 * @param {string} profileId - Profile ID
 */
async function updateInterruptRate(userId, interrupted, profileId = 'default') {
  const profile = await getProfile(userId, profileId);
  const oldValue = profile.interruptRate || 0;
  const observedValue = interrupted ? 1 : 0;
  const newValue = oldValue * (1 - EMA_ALPHA) + observedValue * EMA_ALPHA;

  await setProfile(userId, profileId, {
    interruptRate: newValue
  });

  return { oldValue, newValue };
}

/**
 * Update backchannel tolerance based on reaction
 * @param {string} userId - User ID
 * @param {string} reaction - 'positive', 'negative', or 'neutral'
 * @param {string} profileId - Profile ID
 */
async function updateBackchannelTolerance(userId, reaction, profileId = 'default') {
  const profile = await getProfile(userId, profileId);
  const oldValue = profile.backchannelTolerance || 0;

  let delta = 0;
  if (reaction === 'positive') delta = 0.05;
  else if (reaction === 'negative') delta = -0.05;

  const newValue = Math.max(-1, Math.min(1, oldValue + delta));

  await setProfile(userId, profileId, {
    backchannelTolerance: newValue
  });

  return { oldValue, newValue };
}

/**
 * Update emotional baseline with EMA
 * @param {string} userId - User ID
 * @param {string} emotion - Detected emotion
 * @param {string} profileId - Profile ID
 */
async function updateEmotionalState(userId, emotion, profileId = 'default') {
  const profile = await getProfile(userId, profileId);
  const baseline = profile.emotionalBaseline || getDefaultProfile().emotionalBaseline;

  // Update with EMA - increase observed emotion, decrease others
  const updated = {};
  for (const [key, value] of Object.entries(baseline)) {
    if (key === emotion) {
      updated[key] = value * (1 - EMA_ALPHA_FAST) + 1.0 * EMA_ALPHA_FAST;
    } else {
      updated[key] = value * (1 - EMA_ALPHA_FAST);
    }
  }

  // Normalize to sum to 1
  const total = Object.values(updated).reduce((a, b) => a + b, 0);
  for (const key of Object.keys(updated)) {
    updated[key] = updated[key] / total;
  }

  await setProfile(userId, profileId, {
    emotionalBaseline: updated
  });

  return { oldBaseline: baseline, newBaseline: updated };
}

/**
 * Update tone preference counts
 * @param {string} userId - User ID
 * @param {string} tone - Tone used
 * @param {string} reaction - User reaction
 * @param {string} profileId - Profile ID
 */
async function updateTonePreference(userId, tone, reaction, profileId = 'default') {
  const profile = await getProfile(userId, profileId);
  const toneCounts = profile.toneCounts || {};

  if (!toneCounts[tone]) {
    toneCounts[tone] = { positive: 0, negative: 0, neutral: 0 };
  }
  toneCounts[tone][reaction] = (toneCounts[tone][reaction] || 0) + 1;

  // Determine preferred tone based on positive ratio
  let preferredTone = profile.preferredTone;
  let bestScore = -1;

  for (const [t, counts] of Object.entries(toneCounts)) {
    const total = counts.positive + counts.negative + counts.neutral;
    if (total >= 3) {
      const score = counts.positive / total;
      if (score > bestScore) {
        bestScore = score;
        preferredTone = t;
      }
    }
  }

  await setProfile(userId, profileId, {
    toneCounts,
    preferredTone
  });

  return { toneCounts, preferredTone };
}

/**
 * Update style preference counts
 * @param {string} userId - User ID
 * @param {string} style - Style used
 * @param {string} reaction - User reaction
 * @param {string} profileId - Profile ID
 */
async function updateStylePreference(userId, style, reaction, profileId = 'default') {
  const profile = await getProfile(userId, profileId);
  const styleCounts = profile.styleCounts || {};

  if (!styleCounts[style]) {
    styleCounts[style] = { positive: 0, negative: 0, neutral: 0 };
  }
  styleCounts[style][reaction] = (styleCounts[style][reaction] || 0) + 1;

  // Determine preferred style based on positive ratio
  let preferredStyle = profile.preferredStyle;
  let bestScore = -1;

  for (const [s, counts] of Object.entries(styleCounts)) {
    const total = counts.positive + counts.negative + counts.neutral;
    if (total >= 3) {
      const score = counts.positive / total;
      if (score > bestScore) {
        bestScore = score;
        preferredStyle = s;
      }
    }
  }

  await setProfile(userId, profileId, {
    styleCounts,
    preferredStyle
  });

  return { styleCounts, preferredStyle };
}

/**
 * Update cluster assignment
 * @param {string} userId - User ID
 * @param {string} clusterId - Cluster ID
 * @param {number} confidence - Classification confidence
 * @param {string} profileId - Profile ID
 */
async function updateClusterAssignment(userId, clusterId, confidence, profileId = 'default') {
  await setProfile(userId, profileId, {
    clusterId,
    clusterConfidence: confidence
  });

  return { clusterId, confidence };
}

/**
 * Batch update from session data
 * @param {string} userId - User ID
 * @param {Object} sessionData - Session statistics
 * @param {string} profileId - Profile ID
 */
async function updateFromSession(userId, sessionData, profileId = 'default') {
  const profile = await getProfile(userId, profileId);
  const updates = {};

  // Update pause timing
  if (sessionData.avgPauseMs !== undefined) {
    updates.avgPauseMs = (profile.avgPauseMs || 1000) * (1 - EMA_ALPHA) +
                          sessionData.avgPauseMs * EMA_ALPHA;
  }

  // Update turn length
  if (sessionData.avgTurnLength !== undefined) {
    updates.avgTurnLength = (profile.avgTurnLength || 3.0) * (1 - EMA_ALPHA) +
                             sessionData.avgTurnLength * EMA_ALPHA;
  }

  // Update interrupt rate
  if (sessionData.interruptRate !== undefined) {
    updates.interruptRate = (profile.interruptRate || 0) * (1 - EMA_ALPHA) +
                             sessionData.interruptRate * EMA_ALPHA;
  }

  // Update session counts
  updates.totalSessions = admin.firestore.FieldValue.increment(1);
  updates.totalInteractions = admin.firestore.FieldValue.increment(sessionData.turnCount || 1);
  updates.lastSessionAt = admin.firestore.FieldValue.serverTimestamp();

  await setProfile(userId, profileId, updates);

  // Also save session snapshot for detailed analysis
  await saveSessionSnapshot(userId, profileId, sessionData);

  return getProfile(userId, profileId);
}

/**
 * Save a session snapshot
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} sessionData - Session data to snapshot
 */
async function saveSessionSnapshot(userId, profileId, sessionData) {
  const db = getFirestore();
  const snapshotRef = db
    .collection('luna_profiles')
    .doc(userId)
    .collection('interaction_profiles')
    .doc(profileId)
    .collection('session_snapshots')
    .doc();

  await snapshotRef.set({
    ...sessionData,
    recordedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return snapshotRef.id;
}

/**
 * Get recent session snapshots
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} limit - Max snapshots to return
 */
async function getSessionSnapshots(userId, profileId = 'default', limit = 10) {
  const db = getFirestore();
  const snapshots = await db
    .collection('luna_profiles')
    .doc(userId)
    .collection('interaction_profiles')
    .doc(profileId)
    .collection('session_snapshots')
    .orderBy('recordedAt', 'desc')
    .limit(limit)
    .get();

  return snapshots.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Get all profiles for a user
 * @param {string} userId - User ID
 */
async function getAllProfilesForUser(userId) {
  const db = getFirestore();
  const profiles = await db
    .collection('luna_profiles')
    .doc(userId)
    .collection('interaction_profiles')
    .get();

  return profiles.docs.map(doc => ({
    id: doc.id,
    userId,
    ...doc.data()
  }));
}

/**
 * Delete a profile
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
async function deleteProfile(userId, profileId) {
  const db = getFirestore();
  await db
    .collection('luna_profiles')
    .doc(userId)
    .collection('interaction_profiles')
    .doc(profileId)
    .delete();

  return { deleted: true, profileId };
}

module.exports = {
  getProfile,
  setProfile,
  updatePauseTiming,
  updateTurnLength,
  updateInterruptRate,
  updateBackchannelTolerance,
  updateEmotionalState,
  updateTonePreference,
  updateStylePreference,
  updateClusterAssignment,
  updateFromSession,
  saveSessionSnapshot,
  getSessionSnapshots,
  getAllProfilesForUser,
  deleteProfile,
  getDefaultProfile,
  EMA_ALPHA,
  EMA_ALPHA_FAST
};
