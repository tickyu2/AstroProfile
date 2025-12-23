/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DRIFT SERVICE
 * Firestore operations for personality drift tracking
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Collection paths:
 * - luna_config/drift/global - Global drift configuration and state
 * - luna_profiles/{userId}/personality_drift/{profileId} - Per-user drift
 * - luna_config/drift/history/{snapshotId} - Drift history snapshots
 *
 * This service handles:
 * - Global drift state management
 * - Per-user drift tracking
 * - Signal accumulation
 * - Drift application with bounds
 * - History tracking for rollback
 */

const admin = require('firebase-admin');

/**
 * Default drift bounds (safe limits)
 */
const DRIFT_BOUNDS = {
  warmth: { min: -0.3, max: 0.3 },
  adviceBias: { min: -0.3, max: 0.3 },
  pace: { min: -0.3, max: 0.3 },
  responsiveness: { min: -0.2, max: 0.2 },
  backchannel: { min: -0.3, max: 0.3 },
  mirroring: { min: -0.3, max: 0.3 }
};

/**
 * Default global drift configuration
 */
const DEFAULT_GLOBAL_DRIFT = {
  warmthDelta: 0.0,
  adviceBiasDelta: 0.0,
  paceDelta: 0.0,
  responsivenessDelta: 0.0,
  backchannelDelta: 0.0,
  mirroringDelta: 0.0,
  accumulatedSignals: {
    warmthPositive: 0,
    warmthNegative: 0,
    advicePositive: 0,
    adviceNegative: 0,
    pacePositive: 0,
    paceNegative: 0,
    responsivenessPositive: 0,
    responsivenessNegative: 0,
    backchannelPositive: 0,
    backchannelNegative: 0,
    mirroringPositive: 0,
    mirroringNegative: 0
  },
  signalCount: 0,
  driftRate: 0.02,
  minSignalsForDrift: 50,
  driftIntervalMs: 1800000, // 30 minutes
  isEnabled: true,
  bounds: DRIFT_BOUNDS
};

/**
 * Get Firestore instance
 */
function getFirestore() {
  return admin.firestore();
}

/**
 * Get global drift configuration and state
 */
async function getGlobalDrift() {
  const db = getFirestore();
  const doc = await db.collection('luna_config').doc('drift').get();

  if (!doc.exists) {
    // Initialize with defaults
    await initializeGlobalDrift();
    return { ...DEFAULT_GLOBAL_DRIFT, id: 'global' };
  }

  return {
    id: 'global',
    ...doc.data()
  };
}

/**
 * Initialize global drift with defaults
 */
async function initializeGlobalDrift() {
  const db = getFirestore();
  await db.collection('luna_config').doc('drift').set({
    ...DEFAULT_GLOBAL_DRIFT,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    lastDriftAppliedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return getGlobalDrift();
}

/**
 * Update global drift configuration
 * @param {Object} updates - Fields to update
 */
async function updateGlobalDrift(updates) {
  const db = getFirestore();
  await db.collection('luna_config').doc('drift').update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return getGlobalDrift();
}

/**
 * Accumulate a signal for global drift
 * @param {string} signalType - Signal type (e.g., 'warmthPositive')
 * @param {number} weight - Signal weight (default 1.0)
 */
async function accumulateGlobalSignal(signalType, weight = 1.0) {
  const db = getFirestore();
  const driftRef = db.collection('luna_config').doc('drift');

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(driftRef);

    if (!doc.exists) {
      await initializeGlobalDrift();
      return;
    }

    const data = doc.data();
    const signals = data.accumulatedSignals || {};
    signals[signalType] = (signals[signalType] || 0) + weight;

    transaction.update(driftRef, {
      accumulatedSignals: signals,
      signalCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
}

/**
 * Apply global drift from accumulated signals
 */
async function applyGlobalDrift() {
  const db = getFirestore();
  const driftRef = db.collection('luna_config').doc('drift');

  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(driftRef);
    const data = doc.data();

    if (data.signalCount < data.minSignalsForDrift) {
      return { applied: false, reason: 'Not enough signals' };
    }

    const signals = data.accumulatedSignals || {};
    const driftRate = data.driftRate || 0.02;
    const bounds = data.bounds || DRIFT_BOUNDS;

    // Calculate new drift values
    const newValues = {};
    const parameters = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];

    for (const param of parameters) {
      const positive = signals[`${param}Positive`] || 0;
      const negative = signals[`${param}Negative`] || 0;
      const total = positive + negative;

      if (total > 0) {
        const direction = (positive - negative) / total;
        const currentDelta = data[`${param}Delta`] || 0;
        const newDelta = currentDelta + (driftRate * direction);

        // Apply bounds
        const paramBounds = bounds[param] || { min: -0.3, max: 0.3 };
        newValues[`${param}Delta`] = Math.max(paramBounds.min, Math.min(paramBounds.max, newDelta));
      }
    }

    // Save history before applying
    const historyRef = db.collection('luna_config').doc('drift').collection('history').doc();
    transaction.set(historyRef, {
      scope: 'global',
      beforeValues: {
        warmthDelta: data.warmthDelta,
        adviceBiasDelta: data.adviceBiasDelta,
        paceDelta: data.paceDelta,
        responsivenessDelta: data.responsivenessDelta,
        backchannelDelta: data.backchannelDelta,
        mirroringDelta: data.mirroringDelta
      },
      afterValues: newValues,
      triggerSignals: signals,
      signalCount: data.signalCount,
      reason: 'scheduled_update',
      recordedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Apply new values and reset signals
    transaction.update(driftRef, {
      ...newValues,
      accumulatedSignals: DEFAULT_GLOBAL_DRIFT.accumulatedSignals,
      signalCount: 0,
      lastDriftAppliedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { applied: true, newValues, previousSignalCount: data.signalCount };
  });
}

/**
 * Get global drift modifiers (for behavior blending)
 */
async function getGlobalDriftModifiers() {
  const drift = await getGlobalDrift();

  return {
    warmth: drift.warmthDelta || 0,
    adviceBias: drift.adviceBiasDelta || 0,
    pace: drift.paceDelta || 0,
    responsiveness: drift.responsivenessDelta || 0,
    backchannel: drift.backchannelDelta || 0,
    mirroring: drift.mirroringDelta || 0
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PER-USER DRIFT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get per-user drift state
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
async function getUserDrift(userId, profileId = 'default') {
  const db = getFirestore();
  const doc = await db
    .collection('luna_profiles')
    .doc(userId)
    .collection('personality_drift')
    .doc(profileId)
    .get();

  if (!doc.exists) {
    return {
      userId,
      profileId,
      warmthDelta: 0.0,
      adviceBiasDelta: 0.0,
      paceDelta: 0.0,
      responsivenessDelta: 0.0,
      backchannelDelta: 0.0,
      mirroringDelta: 0.0,
      accumulatedSignals: { ...DEFAULT_GLOBAL_DRIFT.accumulatedSignals },
      signalCount: 0,
      totalInteractions: 0,
      relationshipSentiment: 0.0,
      engagementScore: 0.5,
      comfortLevel: 0.5,
      isEnabled: true,
      driftRate: 0.02,
      exists: false
    };
  }

  return {
    userId,
    profileId,
    ...doc.data(),
    exists: true
  };
}

/**
 * Set per-user drift state
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} data - Drift data
 */
async function setUserDrift(userId, profileId, data) {
  const db = getFirestore();
  await db
    .collection('luna_profiles')
    .doc(userId)
    .collection('personality_drift')
    .doc(profileId)
    .set({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

  return getUserDrift(userId, profileId);
}

/**
 * Accumulate a signal for user drift
 * @param {string} userId - User ID
 * @param {string} signalType - Signal type
 * @param {number} weight - Signal weight
 * @param {string} profileId - Profile ID
 */
async function accumulateUserSignal(userId, signalType, weight = 1.0, profileId = 'default') {
  const db = getFirestore();
  const driftRef = db
    .collection('luna_profiles')
    .doc(userId)
    .collection('personality_drift')
    .doc(profileId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(driftRef);

    if (!doc.exists) {
      // Initialize user drift
      transaction.set(driftRef, {
        warmthDelta: 0.0,
        adviceBiasDelta: 0.0,
        paceDelta: 0.0,
        responsivenessDelta: 0.0,
        backchannelDelta: 0.0,
        mirroringDelta: 0.0,
        accumulatedSignals: { [signalType]: weight },
        signalCount: 1,
        totalInteractions: 0,
        relationshipSentiment: 0.0,
        engagementScore: 0.5,
        comfortLevel: 0.5,
        isEnabled: true,
        driftRate: 0.02,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return;
    }

    const data = doc.data();
    const signals = data.accumulatedSignals || {};
    signals[signalType] = (signals[signalType] || 0) + weight;

    transaction.update(driftRef, {
      accumulatedSignals: signals,
      signalCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
}

/**
 * Apply per-user drift from accumulated signals
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
async function applyUserDrift(userId, profileId = 'default') {
  const db = getFirestore();
  const driftRef = db
    .collection('luna_profiles')
    .doc(userId)
    .collection('personality_drift')
    .doc(profileId);

  // User drift has wider bounds (more personal adaptation)
  const userBounds = {
    warmth: { min: -0.5, max: 0.5 },
    adviceBias: { min: -0.5, max: 0.5 },
    pace: { min: -0.5, max: 0.5 },
    responsiveness: { min: -0.3, max: 0.3 },
    backchannel: { min: -0.5, max: 0.5 },
    mirroring: { min: -0.5, max: 0.5 }
  };

  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(driftRef);

    if (!doc.exists) {
      return { applied: false, reason: 'No drift data' };
    }

    const data = doc.data();

    if (data.signalCount < 20) { // Lower threshold for users
      return { applied: false, reason: 'Not enough signals' };
    }

    const signals = data.accumulatedSignals || {};
    const driftRate = data.driftRate || 0.02;

    // Calculate new drift values
    const newValues = {};
    const parameters = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];

    for (const param of parameters) {
      const positive = signals[`${param}Positive`] || 0;
      const negative = signals[`${param}Negative`] || 0;
      const total = positive + negative;

      if (total > 0) {
        const direction = (positive - negative) / total;
        const currentDelta = data[`${param}Delta`] || 0;
        const newDelta = currentDelta + (driftRate * direction);

        // Apply user bounds
        const paramBounds = userBounds[param];
        newValues[`${param}Delta`] = Math.max(paramBounds.min, Math.min(paramBounds.max, newDelta));
      }
    }

    // Save to user drift history
    const historyRef = db
      .collection('luna_profiles')
      .doc(userId)
      .collection('personality_drift')
      .doc(profileId)
      .collection('history')
      .doc();

    transaction.set(historyRef, {
      beforeValues: {
        warmthDelta: data.warmthDelta,
        adviceBiasDelta: data.adviceBiasDelta,
        paceDelta: data.paceDelta,
        responsivenessDelta: data.responsivenessDelta,
        backchannelDelta: data.backchannelDelta,
        mirroringDelta: data.mirroringDelta
      },
      afterValues: newValues,
      triggerSignals: signals,
      signalCount: data.signalCount,
      reason: 'scheduled_update',
      recordedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Apply new values
    transaction.update(driftRef, {
      ...newValues,
      accumulatedSignals: { ...DEFAULT_GLOBAL_DRIFT.accumulatedSignals },
      signalCount: 0,
      lastDriftAppliedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { applied: true, newValues, previousSignalCount: data.signalCount };
  });
}

/**
 * Get user drift modifiers (for behavior blending)
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
async function getUserDriftModifiers(userId, profileId = 'default') {
  const drift = await getUserDrift(userId, profileId);

  return {
    warmth: drift.warmthDelta || 0,
    adviceBias: drift.adviceBiasDelta || 0,
    pace: drift.paceDelta || 0,
    responsiveness: drift.responsivenessDelta || 0,
    backchannel: drift.backchannelDelta || 0,
    mirroring: drift.mirroringDelta || 0
  };
}

/**
 * Update relationship quality metrics
 * @param {string} userId - User ID
 * @param {Object} metrics - Relationship metrics
 * @param {string} profileId - Profile ID
 */
async function updateRelationshipMetrics(userId, metrics, profileId = 'default') {
  const updates = {};

  if (metrics.sentiment !== undefined) {
    updates.relationshipSentiment = Math.max(-1, Math.min(1, metrics.sentiment));
  }
  if (metrics.engagement !== undefined) {
    updates.engagementScore = Math.max(0, Math.min(1, metrics.engagement));
  }
  if (metrics.comfort !== undefined) {
    updates.comfortLevel = Math.max(0, Math.min(1, metrics.comfort));
  }

  if (Object.keys(updates).length > 0) {
    await setUserDrift(userId, profileId, updates);
  }

  return getUserDrift(userId, profileId);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HISTORY AND ROLLBACK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get drift history
 * @param {string} scope - 'global' or 'user'
 * @param {string} userId - User ID (for user scope)
 * @param {string} profileId - Profile ID
 * @param {number} limit - Max entries to return
 */
async function getDriftHistory(scope = 'global', userId = null, profileId = 'default', limit = 10) {
  const db = getFirestore();
  let query;

  if (scope === 'global') {
    query = db
      .collection('luna_config')
      .doc('drift')
      .collection('history')
      .orderBy('recordedAt', 'desc')
      .limit(limit);
  } else {
    query = db
      .collection('luna_profiles')
      .doc(userId)
      .collection('personality_drift')
      .doc(profileId)
      .collection('history')
      .orderBy('recordedAt', 'desc')
      .limit(limit);
  }

  const snapshots = await query.get();
  return snapshots.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Rollback to a previous drift state
 * @param {string} scope - 'global' or 'user'
 * @param {string} historyId - History entry ID to rollback to
 * @param {string} userId - User ID (for user scope)
 * @param {string} profileId - Profile ID
 */
async function rollbackDrift(scope, historyId, userId = null, profileId = 'default') {
  const db = getFirestore();
  let historyDoc;
  let driftRef;

  if (scope === 'global') {
    historyDoc = await db
      .collection('luna_config')
      .doc('drift')
      .collection('history')
      .doc(historyId)
      .get();
    driftRef = db.collection('luna_config').doc('drift');
  } else {
    historyDoc = await db
      .collection('luna_profiles')
      .doc(userId)
      .collection('personality_drift')
      .doc(profileId)
      .collection('history')
      .doc(historyId)
      .get();
    driftRef = db
      .collection('luna_profiles')
      .doc(userId)
      .collection('personality_drift')
      .doc(profileId);
  }

  if (!historyDoc.exists) {
    throw new Error('History entry not found');
  }

  const historyData = historyDoc.data();
  const beforeValues = historyData.beforeValues;

  // Apply the before values (rollback)
  await driftRef.update({
    warmthDelta: beforeValues.warmthDelta || 0,
    adviceBiasDelta: beforeValues.adviceBiasDelta || 0,
    paceDelta: beforeValues.paceDelta || 0,
    responsivenessDelta: beforeValues.responsivenessDelta || 0,
    backchannelDelta: beforeValues.backchannelDelta || 0,
    mirroringDelta: beforeValues.mirroringDelta || 0,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Record the rollback
  const newHistoryRef = scope === 'global'
    ? db.collection('luna_config').doc('drift').collection('history').doc()
    : db.collection('luna_profiles').doc(userId).collection('personality_drift').doc(profileId).collection('history').doc();

  await newHistoryRef.set({
    beforeValues: historyData.afterValues,
    afterValues: beforeValues,
    triggerSignals: {},
    signalCount: 0,
    reason: `rollback_to_${historyId}`,
    recordedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { rolledBack: true, to: historyId, restoredValues: beforeValues };
}

/**
 * Reset drift to defaults
 * @param {string} scope - 'global' or 'user'
 * @param {string} userId - User ID (for user scope)
 * @param {string} profileId - Profile ID
 */
async function resetDrift(scope, userId = null, profileId = 'default') {
  const db = getFirestore();

  if (scope === 'global') {
    await initializeGlobalDrift();
    return { reset: true, scope: 'global' };
  } else {
    await db
      .collection('luna_profiles')
      .doc(userId)
      .collection('personality_drift')
      .doc(profileId)
      .delete();
    return { reset: true, scope: 'user', userId, profileId };
  }
}

module.exports = {
  // Global drift
  getGlobalDrift,
  initializeGlobalDrift,
  updateGlobalDrift,
  accumulateGlobalSignal,
  applyGlobalDrift,
  getGlobalDriftModifiers,

  // User drift
  getUserDrift,
  setUserDrift,
  accumulateUserSignal,
  applyUserDrift,
  getUserDriftModifiers,
  updateRelationshipMetrics,

  // History
  getDriftHistory,
  rollbackDrift,
  resetDrift,

  // Constants
  DRIFT_BOUNDS,
  DEFAULT_GLOBAL_DRIFT
};
