/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CLUSTER ENGINE - User Interaction Style Classification
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Classifies users into interaction style clusters based on their long-term
 * interaction profiles. Each cluster has associated behavior preferences that
 * can be blended into Luna's responses.
 *
 * Clusters:
 * 1. Fast Talker - Quick responses, shorter turns, may interrupt
 * 2. Slow Thinker - Longer pauses, deliberate speech, thoughtful
 * 3. Emotional - High emotional variance, responds to empathy
 * 4. Analytical - Neutral baseline, prefers structured responses
 * 5. Storyteller - Long turns, detailed narratives
 * 6. Minimalist - Short responses, direct communication
 *
 * Created: December 21, 2025
 */

import { getProfile } from '../memory/interactionProfileStore.js';

// ═══════════════════════════════════════════════════════════════════════════════
// CLUSTER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const CLUSTERS = {
  FAST_TALKER: 'fast_talker',
  SLOW_THINKER: 'slow_thinker',
  EMOTIONAL: 'emotional',
  ANALYTICAL: 'analytical',
  STORYTELLER: 'storyteller',
  MINIMALIST: 'minimalist',
  UNKNOWN: 'unknown'
};

/**
 * Cluster behavior profiles - default preferences for each cluster
 * These are blended with individual user preferences
 */
export const CLUSTER_PROFILES = {
  [CLUSTERS.FAST_TALKER]: {
    name: 'Fast Talker',
    description: 'Quick, energetic communication style',
    behavior: {
      responseLength: 0.7,      // Shorter responses
      backchannel: 0.3,         // Fewer backchannels (they move fast)
      pause: 0.6,               // Shorter pauses
      warmth: 0.5,              // Moderate warmth
      pace: 1.3                 // Faster pace
    },
    preferredTones: ['Playful', 'Warm'],
    preferredStyles: ['friend', 'challenger']
  },

  [CLUSTERS.SLOW_THINKER]: {
    name: 'Slow Thinker',
    description: 'Deliberate, thoughtful communication',
    behavior: {
      responseLength: 1.1,      // Slightly longer responses
      backchannel: 0.6,         // More backchannels (give them time)
      pause: 1.4,               // Longer pauses
      warmth: 0.7,              // Higher warmth
      pace: 0.8                 // Slower pace
    },
    preferredTones: ['Warm', 'Reflective'],
    preferredStyles: ['sage', 'nurturer']
  },

  [CLUSTERS.EMOTIONAL]: {
    name: 'Emotional',
    description: 'Emotionally expressive, empathy-focused',
    behavior: {
      responseLength: 1.0,      // Normal length
      backchannel: 0.7,         // More backchannels (validation)
      pause: 1.0,               // Normal pauses
      warmth: 1.2,              // Higher warmth
      pace: 1.0                 // Normal pace
    },
    preferredTones: ['Warm', 'Tender'],
    preferredStyles: ['nurturer', 'friend']
  },

  [CLUSTERS.ANALYTICAL]: {
    name: 'Analytical',
    description: 'Logical, structured communication',
    behavior: {
      responseLength: 1.2,      // Longer, detailed responses
      backchannel: 0.4,         // Fewer backchannels
      pause: 1.1,               // Slightly longer pauses
      warmth: 0.4,              // Lower warmth (more professional)
      pace: 0.9                 // Slightly slower
    },
    preferredTones: ['Reflective', 'Neutral'],
    preferredStyles: ['sage', 'challenger']
  },

  [CLUSTERS.STORYTELLER]: {
    name: 'Storyteller',
    description: 'Narrative-focused, detailed communication',
    behavior: {
      responseLength: 1.4,      // Longer responses
      backchannel: 0.5,         // Moderate backchannels
      pause: 1.2,               // Longer pauses (for story beats)
      warmth: 0.8,              // Higher warmth
      pace: 0.85                // Slightly slower for narrative
    },
    preferredTones: ['Warm', 'Reflective'],
    preferredStyles: ['friend', 'sage']
  },

  [CLUSTERS.MINIMALIST]: {
    name: 'Minimalist',
    description: 'Direct, efficient communication',
    behavior: {
      responseLength: 0.6,      // Short, concise responses
      backchannel: 0.2,         // Minimal backchannels
      pause: 0.7,               // Shorter pauses
      warmth: 0.5,              // Moderate warmth
      pace: 1.1                 // Slightly faster
    },
    preferredTones: ['Neutral', 'Playful'],
    preferredStyles: ['challenger', 'friend']
  },

  [CLUSTERS.UNKNOWN]: {
    name: 'Unknown',
    description: 'Not enough data to classify',
    behavior: {
      responseLength: 1.0,
      backchannel: 0.5,
      pause: 1.0,
      warmth: 0.6,
      pace: 1.0
    },
    preferredTones: ['Warm'],
    preferredStyles: ['friend']
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLUSTER CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Minimum interactions required before classification
 */
const MIN_INTERACTIONS_FOR_CLASSIFICATION = 5;

/**
 * Classification thresholds - structured criteria per cluster
 * Each cluster defines min/max requirements for classification
 */
const CLUSTER_CRITERIA = {
  [CLUSTERS.FAST_TALKER]: {
    maxAvgPauseMs: 800,
    minInterruptRate: 0.20
  },
  [CLUSTERS.SLOW_THINKER]: {
    minAvgPauseMs: 1400,
    maxInterruptRate: 0.15
  },
  [CLUSTERS.EMOTIONAL]: {
    minEmotionalVariance: 0.30
  },
  [CLUSTERS.ANALYTICAL]: {
    maxEmotionalVariance: 0.15,
    maxBackchannelTolerance: 0.0
  },
  [CLUSTERS.STORYTELLER]: {
    minTurnLength: 6.0
  },
  [CLUSTERS.MINIMALIST]: {
    maxTurnLength: 2.0
  }
};

/**
 * Legacy thresholds for backward compatibility
 */
const THRESHOLDS = {
  fastPauseMs: 700,           // Below this = fast
  slowPauseMs: 1400,          // Above this = slow
  shortTurnLength: 2.5,       // Below this = minimalist
  longTurnLength: 5.0,        // Above this = storyteller
  highInterruptRate: 0.15,    // Above this = fast talker tendency
  highEmotionalVariance: 0.35 // Above this = emotional
};

/**
 * Calculate emotional variance from baseline
 * Higher variance = more emotional expression
 *
 * @param {Object} baseline - Emotional baseline { emotion: probability }
 * @returns {number} Variance score (0-1)
 */
function calculateEmotionalVariance(baseline) {
  if (!baseline) return 0;

  const values = Object.values(baseline);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

  // Normalize to 0-1 range (max variance is about 0.25)
  return Math.min(1, variance * 4);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRITERIA-BASED SCORING (New Algorithm)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Score a cluster based on how many criteria match
 * Uses the structured CLUSTER_CRITERIA definitions
 *
 * @param {Object} profile - User profile with normalized fields
 * @param {Object} criteria - Cluster criteria object
 * @returns {number} Score (0 to number of criteria)
 */
function scoreCriteriaMatch(profile, criteria) {
  let score = 0;

  for (const [key, value] of Object.entries(criteria)) {
    // Parse field name from criteria key (minFieldName -> fieldName)
    let fieldName;
    let isMin = false;
    let isMax = false;

    if (key.startsWith('min')) {
      fieldName = key.slice(3);
      fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
      isMin = true;
    } else if (key.startsWith('max')) {
      fieldName = key.slice(3);
      fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
      isMax = true;
    }

    // Map criteria field names to profile field names
    const fieldMap = {
      'avgPauseMs': 'avgPauseMs',
      'turnLength': 'avgTurnLength',
      'interruptRate': 'interruptRate',
      'emotionalVariance': 'emotionalVariance',
      'backchannelTolerance': 'backchannelTolerance'
    };

    const profileField = fieldMap[fieldName] || fieldName;
    let profileValue = profile[profileField];

    // Special case: calculate emotional variance if not in profile
    if (fieldName === 'emotionalVariance' && profileValue === undefined) {
      profileValue = calculateEmotionalVariance(profile.emotionalBaseline);
    }

    if (profileValue === undefined) continue;

    // Check criteria
    if (isMin && profileValue >= value) {
      score += 1;
    } else if (isMax && profileValue <= value) {
      score += 1;
    }
  }

  return score;
}

/**
 * Calculate normalized cluster scores using criteria-based matching
 *
 * @param {Object} profile - User interaction profile
 * @returns {Object} { clusterId: { score, totalCriteria, confidence } }
 */
function calculateCriteriaScores(profile) {
  const scores = {};

  for (const [clusterId, criteria] of Object.entries(CLUSTER_CRITERIA)) {
    const totalCriteria = Object.keys(criteria).length;
    const matchScore = scoreCriteriaMatch(profile, criteria);
    const confidence = totalCriteria > 0 ? matchScore / totalCriteria : 0;

    scores[clusterId] = {
      score: matchScore,
      totalCriteria,
      confidence
    };
  }

  return scores;
}

/**
 * Assign cluster using criteria-based scoring (new algorithm)
 *
 * @param {Object} profile - User interaction profile
 * @returns {Object} { cluster, confidence, scores }
 */
function assignClusterByCriteria(profile) {
  const criteriaScores = calculateCriteriaScores(profile);

  let bestCluster = CLUSTERS.UNKNOWN;
  let bestConfidence = 0;

  for (const [clusterId, scoreData] of Object.entries(criteriaScores)) {
    // Only consider clusters where at least one criterion matches
    if (scoreData.score > 0 && scoreData.confidence > bestConfidence) {
      bestConfidence = scoreData.confidence;
      bestCluster = clusterId;
    }
  }

  return {
    cluster: bestCluster,
    confidence: bestConfidence,
    criteriaScores
  };
}

/**
 * Calculate cluster scores for a user profile
 *
 * @param {Object} profile - User interaction profile
 * @returns {Object} Scores for each cluster
 */
function calculateClusterScores(profile) {
  const scores = {};

  // Initialize all scores to 0
  for (const cluster of Object.values(CLUSTERS)) {
    scores[cluster] = 0;
  }

  const {
    avgPauseMs,
    avgTurnLength,
    interruptRate,
    emotionalBaseline
  } = profile;

  const emotionalVariance = calculateEmotionalVariance(emotionalBaseline);

  // Fast Talker: fast pauses + high interrupt rate
  if (avgPauseMs < THRESHOLDS.fastPauseMs) {
    scores[CLUSTERS.FAST_TALKER] += 2;
  }
  if (interruptRate > THRESHOLDS.highInterruptRate) {
    scores[CLUSTERS.FAST_TALKER] += 1.5;
  }
  if (avgTurnLength < THRESHOLDS.shortTurnLength) {
    scores[CLUSTERS.FAST_TALKER] += 0.5;
  }

  // Slow Thinker: slow pauses + low interrupt rate
  if (avgPauseMs > THRESHOLDS.slowPauseMs) {
    scores[CLUSTERS.SLOW_THINKER] += 2;
  }
  if (interruptRate < 0.05) {
    scores[CLUSTERS.SLOW_THINKER] += 1;
  }
  if (avgTurnLength > 3.5) {
    scores[CLUSTERS.SLOW_THINKER] += 0.5;
  }

  // Emotional: high emotional variance
  if (emotionalVariance > THRESHOLDS.highEmotionalVariance) {
    scores[CLUSTERS.EMOTIONAL] += 2.5;
  }
  if (emotionalBaseline) {
    const emotionalSum = (emotionalBaseline.happy || 0) +
                         (emotionalBaseline.sad || 0) +
                         (emotionalBaseline.anxious || 0) +
                         (emotionalBaseline.excited || 0) +
                         (emotionalBaseline.tender || 0);
    if (emotionalSum > 0.5) {
      scores[CLUSTERS.EMOTIONAL] += 1;
    }
  }

  // Analytical: low emotional variance + moderate pace
  if (emotionalVariance < 0.15) {
    scores[CLUSTERS.ANALYTICAL] += 1.5;
  }
  if (emotionalBaseline && (emotionalBaseline.neutral || 0) > 0.5) {
    scores[CLUSTERS.ANALYTICAL] += 1.5;
  }
  if (avgPauseMs > 900 && avgPauseMs < 1300) {
    scores[CLUSTERS.ANALYTICAL] += 0.5;
  }

  // Storyteller: long turns + moderate pace
  if (avgTurnLength > THRESHOLDS.longTurnLength) {
    scores[CLUSTERS.STORYTELLER] += 2.5;
  }
  if (avgTurnLength > 4.0 && interruptRate < 0.1) {
    scores[CLUSTERS.STORYTELLER] += 1;
  }

  // Minimalist: short turns + fast responses
  if (avgTurnLength < THRESHOLDS.shortTurnLength) {
    scores[CLUSTERS.MINIMALIST] += 2;
  }
  if (avgPauseMs < 900 && avgTurnLength < 3.0) {
    scores[CLUSTERS.MINIMALIST] += 1;
  }

  return scores;
}

/**
 * Classify a user into a cluster based on their profile
 * Uses both legacy weighted scoring and new criteria-based scoring
 *
 * @param {string} userId - User identifier
 * @param {Object} options - Options { useCriteriaBased: boolean }
 * @returns {Object} Classification result { cluster, confidence, scores }
 */
export function classifyUser(userId, options = {}) {
  const profile = getProfile(userId);
  const useCriteriaBased = options.useCriteriaBased !== false; // Default to true

  // Not enough data
  if (profile.interactionCount < MIN_INTERACTIONS_FOR_CLASSIFICATION) {
    return {
      cluster: CLUSTERS.UNKNOWN,
      confidence: 0,
      scores: {},
      message: `Need ${MIN_INTERACTIONS_FOR_CLASSIFICATION - profile.interactionCount} more interactions`
    };
  }

  // Use new criteria-based scoring if enabled
  if (useCriteriaBased) {
    const criteriaResult = assignClusterByCriteria(profile);

    // Fall back to legacy if no cluster matched
    if (criteriaResult.cluster === CLUSTERS.UNKNOWN) {
      return classifyUserLegacy(profile);
    }

    return {
      cluster: criteriaResult.cluster,
      confidence: criteriaResult.confidence,
      scores: criteriaResult.criteriaScores,
      profile: CLUSTER_PROFILES[criteriaResult.cluster],
      method: 'criteria'
    };
  }

  // Legacy scoring
  return classifyUserLegacy(profile);
}

/**
 * Legacy classification using weighted scoring
 * @private
 */
function classifyUserLegacy(profile) {
  const scores = calculateClusterScores(profile);

  // Find highest scoring cluster
  let maxScore = 0;
  let bestCluster = CLUSTERS.UNKNOWN;

  for (const [cluster, score] of Object.entries(scores)) {
    if (cluster !== CLUSTERS.UNKNOWN && score > maxScore) {
      maxScore = score;
      bestCluster = cluster;
    }
  }

  // Calculate confidence (0-1)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? maxScore / totalScore : 0;

  return {
    cluster: bestCluster,
    confidence: Math.min(1, confidence),
    scores,
    profile: CLUSTER_PROFILES[bestCluster],
    method: 'legacy'
  };
}

/**
 * Get cluster behavior profile for a user
 *
 * @param {string} userId - User identifier
 * @returns {Object} Behavior modifiers for this user's cluster
 */
export function getClusterBehavior(userId) {
  const classification = classifyUser(userId);
  return {
    ...CLUSTER_PROFILES[classification.cluster].behavior,
    cluster: classification.cluster,
    confidence: classification.confidence
  };
}

/**
 * Get recommended tones for a user based on cluster
 *
 * @param {string} userId - User identifier
 * @returns {string[]} Recommended tones
 */
export function getRecommendedTones(userId) {
  const classification = classifyUser(userId);
  return CLUSTER_PROFILES[classification.cluster].preferredTones;
}

/**
 * Get recommended styles for a user based on cluster
 *
 * @param {string} userId - User identifier
 * @returns {string[]} Recommended styles
 */
export function getRecommendedStyles(userId) {
  const classification = classifyUser(userId);
  return CLUSTER_PROFILES[classification.cluster].preferredStyles;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLUSTER ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get cluster distribution across all users
 *
 * @param {Object} allProfiles - All user profiles from interactionProfileStore
 * @returns {Object} Distribution { cluster: count }
 */
export function getClusterDistribution(allProfiles) {
  const distribution = {};

  for (const cluster of Object.values(CLUSTERS)) {
    distribution[cluster] = 0;
  }

  for (const userId of Object.keys(allProfiles)) {
    const classification = classifyUser(userId);
    distribution[classification.cluster]++;
  }

  return distribution;
}

/**
 * Get cluster info for display
 *
 * @returns {Object[]} Array of cluster info objects
 */
export function getClusterInfo() {
  return Object.entries(CLUSTER_PROFILES).map(([key, profile]) => ({
    id: key,
    name: profile.name,
    description: profile.description,
    behavior: profile.behavior,
    preferredTones: profile.preferredTones,
    preferredStyles: profile.preferredStyles
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  CLUSTERS,
  CLUSTER_PROFILES,
  CLUSTER_CRITERIA,
  classifyUser,
  assignClusterByCriteria,
  calculateCriteriaScores,
  scoreCriteriaMatch,
  calculateEmotionalVariance,
  getClusterBehavior,
  getRecommendedTones,
  getRecommendedStyles,
  getClusterDistribution,
  getClusterInfo
};

// Named exports for criteria functions
export { CLUSTER_CRITERIA, assignClusterByCriteria, calculateCriteriaScores, scoreCriteriaMatch, calculateEmotionalVariance };
