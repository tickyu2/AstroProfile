/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CLUSTER SERVICE
 * Firestore operations for interaction style clusters
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Collection paths:
 * - luna_config/clusters/definitions/{clusterId} - Global cluster definitions
 * - luna_profiles/{userId}/cluster_assignments/{profileId} - User assignments
 *
 * This service handles:
 * - Cluster definition CRUD operations
 * - User classification and assignment
 * - Cluster behavior retrieval
 * - Analytics tracking
 */

const admin = require('firebase-admin');

/**
 * Default cluster definitions
 */
const DEFAULT_CLUSTERS = {
  fast_talker: {
    label: 'Fast Talker',
    description: 'Quick responses, high energy, frequent interruptions. Prefers snappy, energetic conversation.',
    criteria: {
      maxAvgPauseMs: 700,
      minInterruptRate: 0.15
    },
    behaviorOverrides: {
      timingScale: 0.85,
      responseLengthScale: 0.7,
      backchannelFrequencyDelta: -0.2,
      warmthModifier: 0.0,
      paceModifier: 0.3,
      preferredTones: ['Playful', 'Warm'],
      preferredStyles: ['friend', 'challenger']
    },
    priority: 10,
    isActive: true
  },
  slow_thinker: {
    label: 'Slow Thinker',
    description: 'Long pauses, reflective, appreciates space to think. Prefers gentle, unhurried conversation.',
    criteria: {
      minAvgPauseMs: 1400,
      maxInterruptRate: 0.1
    },
    behaviorOverrides: {
      timingScale: 1.4,
      responseLengthScale: 1.1,
      backchannelFrequencyDelta: 0.1,
      warmthModifier: 0.1,
      paceModifier: -0.2,
      preferredTones: ['Warm', 'Reflective'],
      preferredStyles: ['sage', 'nurturer']
    },
    priority: 10,
    isActive: true
  },
  emotional: {
    label: 'Emotional',
    description: 'High emotional variance, responds well to empathy and validation. Needs supportive responses.',
    criteria: {
      minEmotionalVariance: 0.35
    },
    behaviorOverrides: {
      timingScale: 1.0,
      responseLengthScale: 1.0,
      backchannelFrequencyDelta: 0.2,
      warmthModifier: 0.2,
      paceModifier: 0.0,
      adviceBiasDelta: -0.2,
      preferredTones: ['Warm', 'Tender'],
      preferredStyles: ['nurturer', 'friend']
    },
    priority: 15,
    isActive: true
  },
  analytical: {
    label: 'Analytical',
    description: 'Low emotional variance, prefers structured, logical responses. Appreciates clarity over warmth.',
    criteria: {
      maxEmotionalVariance: 0.15,
      minNeutralBaseline: 0.5
    },
    behaviorOverrides: {
      timingScale: 1.1,
      responseLengthScale: 1.2,
      backchannelFrequencyDelta: -0.1,
      warmthModifier: -0.1,
      paceModifier: -0.1,
      adviceBiasDelta: 0.15,
      preferredTones: ['Reflective', 'Neutral'],
      preferredStyles: ['sage', 'challenger']
    },
    priority: 10,
    isActive: true
  },
  storyteller: {
    label: 'Storyteller',
    description: 'Long turns, detailed narratives. Likes to share and be heard. Appreciates engaged listening.',
    criteria: {
      minTurnLength: 5.0,
      maxInterruptRate: 0.1
    },
    behaviorOverrides: {
      timingScale: 1.2,
      responseLengthScale: 1.4,
      backchannelFrequencyDelta: 0.0,
      warmthModifier: 0.2,
      paceModifier: -0.15,
      preferredTones: ['Warm', 'Reflective'],
      preferredStyles: ['friend', 'sage']
    },
    priority: 10,
    isActive: true
  },
  minimalist: {
    label: 'Minimalist',
    description: 'Short responses, direct communication. Values efficiency over elaboration.',
    criteria: {
      maxTurnLength: 2.5,
      maxAvgPauseMs: 900
    },
    behaviorOverrides: {
      timingScale: 0.7,
      responseLengthScale: 0.6,
      backchannelFrequencyDelta: -0.3,
      warmthModifier: 0.0,
      paceModifier: 0.1,
      preferredTones: ['Neutral', 'Playful'],
      preferredStyles: ['challenger', 'friend']
    },
    priority: 10,
    isActive: true
  }
};

/**
 * Get Firestore instance
 */
function getFirestore() {
  return admin.firestore();
}

/**
 * Initialize default clusters if they don't exist
 */
async function initializeDefaultClusters() {
  const db = getFirestore();
  const batch = db.batch();

  for (const [clusterId, clusterData] of Object.entries(DEFAULT_CLUSTERS)) {
    const docRef = db
      .collection('luna_config')
      .doc('clusters')
      .collection('definitions')
      .doc(clusterId);

    const doc = await docRef.get();
    if (!doc.exists) {
      batch.set(docRef, {
        ...clusterData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  await batch.commit();
  return { initialized: true, clusters: Object.keys(DEFAULT_CLUSTERS) };
}

/**
 * Get a cluster definition
 * @param {string} clusterId - Cluster ID
 */
async function getCluster(clusterId) {
  const db = getFirestore();
  const doc = await db
    .collection('luna_config')
    .doc('clusters')
    .collection('definitions')
    .doc(clusterId)
    .get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data()
  };
}

/**
 * Get all cluster definitions
 * @param {boolean} activeOnly - Only return active clusters
 */
async function getAllClusters(activeOnly = true) {
  const db = getFirestore();
  let query = db
    .collection('luna_config')
    .doc('clusters')
    .collection('definitions');

  if (activeOnly) {
    query = query.where('isActive', '==', true);
  }

  const clusters = await query.orderBy('priority', 'desc').get();

  return clusters.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Update a cluster definition
 * @param {string} clusterId - Cluster ID
 * @param {Object} updates - Fields to update
 */
async function updateCluster(clusterId, updates) {
  const db = getFirestore();
  const docRef = db
    .collection('luna_config')
    .doc('clusters')
    .collection('definitions')
    .doc(clusterId);

  await docRef.update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return getCluster(clusterId);
}

/**
 * Classify a user based on their profile
 * @param {Object} profile - User's interaction profile
 */
async function classifyUser(profile) {
  const clusters = await getAllClusters(true);
  const scores = {};
  let bestCluster = null;
  let bestScore = -1;

  for (const cluster of clusters) {
    let score = 0;
    let matchCount = 0;
    const criteria = cluster.criteria || {};

    // Check pause timing
    if (criteria.maxAvgPauseMs !== undefined && profile.avgPauseMs <= criteria.maxAvgPauseMs) {
      score += 1;
      matchCount++;
    }
    if (criteria.minAvgPauseMs !== undefined && profile.avgPauseMs >= criteria.minAvgPauseMs) {
      score += 1;
      matchCount++;
    }

    // Check interrupt rate
    if (criteria.maxInterruptRate !== undefined && profile.interruptRate <= criteria.maxInterruptRate) {
      score += 1;
      matchCount++;
    }
    if (criteria.minInterruptRate !== undefined && profile.interruptRate >= criteria.minInterruptRate) {
      score += 1;
      matchCount++;
    }

    // Check turn length
    if (criteria.maxTurnLength !== undefined && profile.avgTurnLength <= criteria.maxTurnLength) {
      score += 1;
      matchCount++;
    }
    if (criteria.minTurnLength !== undefined && profile.avgTurnLength >= criteria.minTurnLength) {
      score += 1;
      matchCount++;
    }

    // Check emotional variance
    if (criteria.minEmotionalVariance !== undefined || criteria.maxEmotionalVariance !== undefined) {
      const variance = calculateEmotionalVariance(profile.emotionalBaseline);
      if (criteria.minEmotionalVariance !== undefined && variance >= criteria.minEmotionalVariance) {
        score += 1;
        matchCount++;
      }
      if (criteria.maxEmotionalVariance !== undefined && variance <= criteria.maxEmotionalVariance) {
        score += 1;
        matchCount++;
      }
    }

    // Check neutral baseline
    if (criteria.minNeutralBaseline !== undefined) {
      const neutral = (profile.emotionalBaseline || {}).neutral || 0;
      if (neutral >= criteria.minNeutralBaseline) {
        score += 1;
        matchCount++;
      }
    }

    // Calculate normalized score (0-1)
    const normalizedScore = matchCount > 0 ? score / matchCount : 0;
    scores[cluster.id] = normalizedScore;

    if (normalizedScore > bestScore) {
      bestScore = normalizedScore;
      bestCluster = cluster.id;
    }
  }

  return {
    clusterId: bestCluster,
    confidence: bestScore,
    allScores: scores
  };
}

/**
 * Calculate emotional variance from baseline
 * @param {Object} baseline - Emotional baseline object
 */
function calculateEmotionalVariance(baseline) {
  if (!baseline) return 0;
  const values = Object.values(baseline);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Get a user's cluster assignment
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
async function getUserClusterAssignment(userId, profileId = 'default') {
  const db = getFirestore();
  const doc = await db
    .collection('luna_profiles')
    .doc(userId)
    .collection('cluster_assignments')
    .doc(profileId)
    .get();

  if (!doc.exists) {
    return null;
  }

  return {
    profileId: doc.id,
    userId,
    ...doc.data()
  };
}

/**
 * Set a user's cluster assignment
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} clusterId - Cluster ID
 * @param {number} confidence - Classification confidence
 * @param {Object} allScores - All classification scores
 */
async function setUserClusterAssignment(userId, profileId, clusterId, confidence, allScores = {}) {
  const db = getFirestore();
  const docRef = db
    .collection('luna_profiles')
    .doc(userId)
    .collection('cluster_assignments')
    .doc(profileId);

  await docRef.set({
    clusterId,
    confidence,
    allScores,
    isPrimary: profileId === 'default',
    assignedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return getUserClusterAssignment(userId, profileId);
}

/**
 * Get behavior overrides for a user's cluster
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
async function getClusterBehavior(userId, profileId = 'default') {
  const assignment = await getUserClusterAssignment(userId, profileId);

  if (!assignment || !assignment.clusterId) {
    return {
      hasCluster: false,
      clusterId: null,
      behavior: {}
    };
  }

  const cluster = await getCluster(assignment.clusterId);

  if (!cluster) {
    return {
      hasCluster: false,
      clusterId: assignment.clusterId,
      behavior: {}
    };
  }

  return {
    hasCluster: true,
    clusterId: assignment.clusterId,
    confidence: assignment.confidence,
    behavior: cluster.behaviorOverrides || {}
  };
}

/**
 * Get users in a specific cluster
 * @param {string} clusterId - Cluster ID
 * @param {number} limit - Max users to return
 */
async function getUsersInCluster(clusterId, limit = 100) {
  const db = getFirestore();

  // This requires a collection group query
  const assignments = await db
    .collectionGroup('cluster_assignments')
    .where('clusterId', '==', clusterId)
    .limit(limit)
    .get();

  return assignments.docs.map(doc => {
    const path = doc.ref.path;
    const userId = path.split('/')[1]; // luna_profiles/{userId}/cluster_assignments/{profileId}
    return {
      userId,
      profileId: doc.id,
      ...doc.data()
    };
  });
}

/**
 * Save cluster distribution snapshot for analytics
 */
async function saveClusterDistribution() {
  const db = getFirestore();
  const clusters = await getAllClusters(true);
  const distribution = {};
  let totalUsers = 0;

  for (const cluster of clusters) {
    const users = await getUsersInCluster(cluster.id);
    distribution[cluster.id] = users.length;
    totalUsers += users.length;
  }

  // Calculate average confidence per cluster
  const avgConfidence = {};
  for (const cluster of clusters) {
    const users = await getUsersInCluster(cluster.id);
    if (users.length > 0) {
      const totalConf = users.reduce((sum, u) => sum + (u.confidence || 0), 0);
      avgConfidence[cluster.id] = totalConf / users.length;
    } else {
      avgConfidence[cluster.id] = 0;
    }
  }

  // Save analytics snapshot
  await db.collection('luna_analytics').doc('cluster_distribution').collection('snapshots').add({
    distribution,
    totalUsers,
    avgConfidencePerCluster: avgConfidence,
    recordedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { distribution, totalUsers, avgConfidence };
}

module.exports = {
  initializeDefaultClusters,
  getCluster,
  getAllClusters,
  updateCluster,
  classifyUser,
  calculateEmotionalVariance,
  getUserClusterAssignment,
  setUserClusterAssignment,
  getClusterBehavior,
  getUsersInCluster,
  saveClusterDistribution,
  DEFAULT_CLUSTERS
};
