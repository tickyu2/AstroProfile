/**
 * ============================================================================
 * GENESIS LUNA - MEMORY SCORING UTILITIES
 * ============================================================================
 * Unified scoring and decay functions for memory retrieval and consolidation.
 * Consolidates multiple implementations into a single source of truth.
 *
 * Functions:
 * - Recency scoring (sigmoid, linear, exponential)
 * - Importance calculation
 * - Retrieval ranking (RRF)
 * - Decay application
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const { SCORING, MEMORY } = require('../config/constants');

// ============================================================================
// RECENCY SCORING
// ============================================================================

/**
 * Calculate sigmoid-based recency score
 * Smooth decay that slows as memory ages
 *
 * @param {number} hoursOld - Age in hours
 * @param {Object} options - Configuration
 * @returns {number} Score between minScore and 1.0
 */
function calculateSigmoidRecency(hoursOld, options = {}) {
  const {
    midpointHours = SCORING.RECENCY.SIGMOID_MIDPOINT_HOURS,
    steepness = SCORING.RECENCY.SIGMOID_STEEPNESS,
    minScore = SCORING.RECENCY.MIN_RECENCY_SCORE
  } = options;

  if (hoursOld <= 0) return 1.0;

  // Sigmoid function: 1 / (1 + e^(steepness * (hours - midpoint)))
  const exponent = steepness * (hoursOld - midpointHours);
  const rawScore = 1 / (1 + Math.exp(exponent));

  // Scale to range [minScore, 1.0]
  return minScore + rawScore * (1 - minScore);
}

/**
 * Calculate linear recency score
 * Simple decay over specified period
 *
 * @param {number} hoursOld - Age in hours
 * @param {Object} options - Configuration
 * @returns {number} Score between 0 and 1.0
 */
function calculateLinearRecency(hoursOld, options = {}) {
  const {
    maxHours = 24 * 90, // 90 days default
    minScore = 0
  } = options;

  if (hoursOld <= 0) return 1.0;
  if (hoursOld >= maxHours) return minScore;

  return 1 - (hoursOld / maxHours);
}

/**
 * Calculate exponential recency score
 * Fast initial decay, then slow
 *
 * @param {number} hoursOld - Age in hours
 * @param {Object} options - Configuration
 * @returns {number} Score between minScore and 1.0
 */
function calculateExponentialRecency(hoursOld, options = {}) {
  const {
    halfLifeHours = 168, // 7 days
    minScore = SCORING.RECENCY.MIN_RECENCY_SCORE
  } = options;

  if (hoursOld <= 0) return 1.0;

  // Exponential decay: e^(-decay * time)
  const decayRate = Math.LN2 / halfLifeHours;
  const rawScore = Math.exp(-decayRate * hoursOld);

  // Scale to range [minScore, 1.0]
  return minScore + rawScore * (1 - minScore);
}

/**
 * Get recency score using default method (sigmoid)
 *
 * @param {Date|number} timestamp - Memory timestamp or ms since epoch
 * @param {Object} options - Configuration
 * @returns {number} Recency score
 */
function getRecencyScore(timestamp, options = {}) {
  const now = Date.now();
  const memoryTime = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const hoursOld = (now - memoryTime) / (1000 * 60 * 60);

  const { method = 'sigmoid' } = options;

  switch (method) {
    case 'linear':
      return calculateLinearRecency(hoursOld, options);
    case 'exponential':
      return calculateExponentialRecency(hoursOld, options);
    case 'sigmoid':
    default:
      return calculateSigmoidRecency(hoursOld, options);
  }
}

// ============================================================================
// IMPORTANCE CALCULATION
// ============================================================================

/**
 * Calculate memory importance score
 *
 * @param {Object} memory - Memory object
 * @param {Object} options - Weighting options
 * @returns {number} Importance score (0-1)
 */
function calculateImportance(memory, options = {}) {
  const weights = {
    emotional: options.emotionalWeight || SCORING.IMPORTANCE.EMOTIONAL_WEIGHT,
    relevance: options.relevanceWeight || SCORING.IMPORTANCE.RELEVANCE_WEIGHT,
    frequency: options.frequencyWeight || SCORING.IMPORTANCE.FREQUENCY_WEIGHT,
    recency: options.recencyWeight || SCORING.IMPORTANCE.RECENCY_WEIGHT
  };

  // Extract memory properties
  const emotionalIntensity = memory.emotional_intensity || memory.emotionalIntensity || 0;
  const relevance = memory.relevance || memory.similarity || 0;
  const accessCount = memory.access_count || memory.accessCount || memory.mention_count || 1;
  const timestamp = memory.created_at || memory.createdAt || memory.timestamp || Date.now();

  // Calculate component scores
  const emotionalScore = Math.min(1, emotionalIntensity);
  const relevanceScore = Math.min(1, relevance);
  const frequencyScore = Math.min(1, accessCount / 10); // Caps at 10 accesses
  const recencyScore = getRecencyScore(timestamp, { method: 'sigmoid' });

  // Weighted combination
  const importance =
    weights.emotional * emotionalScore +
    weights.relevance * relevanceScore +
    weights.frequency * frequencyScore +
    weights.recency * recencyScore;

  return Math.min(1, Math.max(0, importance));
}

/**
 * Calculate consolidation score for STM promotion
 *
 * @param {Object} stm - Short-term memory object
 * @returns {Object} Score breakdown
 */
function calculateConsolidationScore(stm) {
  const now = Date.now();
  const createdAt = stm.created_at || stm.createdAt || now;
  const ageMs = now - (createdAt instanceof Date ? createdAt.getTime() : createdAt);
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  // Recency score: sigmoid decay
  const recencyScore = calculateSigmoidRecency(ageDays * 24, {
    midpointHours: 24 * 30 // 30 days midpoint for consolidation
  });

  // Mention score: caps at 5 mentions
  const mentionCount = stm.mention_count || stm.mentionCount || 1;
  const mentionScore = Math.min(1, mentionCount / 5);

  // Emotion score: from emotional intensity
  const emotionScore = stm.emotional_intensity || stm.emotionalIntensity || 0.5;

  // Weighted combination: 40% recency, 30% mentions, 30% emotion
  const total = 0.4 * recencyScore + 0.3 * mentionScore + 0.3 * emotionScore;

  return {
    total: Math.min(1, total),
    recency: recencyScore,
    mention: mentionScore,
    emotion: emotionScore,
    ageDays: Math.round(ageDays),
    shouldPromote: total >= MEMORY.STM.CONSOLIDATION_THRESHOLD
  };
}

// ============================================================================
// RETRIEVAL RANKING (RRF)
// ============================================================================

/**
 * Calculate Reciprocal Rank Fusion score
 * Combines multiple ranking signals
 *
 * @param {Object} ranks - Rank positions for each signal
 * @param {Object} weights - Weight for each signal
 * @returns {number} Combined RRF score
 */
function calculateRRF(ranks, weights = {}) {
  const k = SCORING.RETRIEVAL.K_CONSTANT;
  const w = {
    semantic: weights.semantic || SCORING.RETRIEVAL.SEMANTIC_WEIGHT,
    recency: weights.recency || SCORING.RETRIEVAL.RECENCY_WEIGHT,
    importance: weights.importance || SCORING.RETRIEVAL.IMPORTANCE_WEIGHT,
    frequency: weights.frequency || SCORING.RETRIEVAL.FREQUENCY_WEIGHT
  };

  let score = 0;

  if (ranks.semantic !== undefined) {
    score += w.semantic * (1 / (k + ranks.semantic));
  }
  if (ranks.recency !== undefined) {
    score += w.recency * (1 / (k + ranks.recency));
  }
  if (ranks.importance !== undefined) {
    score += w.importance * (1 / (k + ranks.importance));
  }
  if (ranks.frequency !== undefined) {
    score += w.frequency * (1 / (k + ranks.frequency));
  }

  return score;
}

/**
 * Calculate composite memory retrieval score
 * All-in-one scoring for memory retrieval
 *
 * @param {Object} memory - Memory object
 * @param {Object} query - Query context
 * @param {Object} options - Configuration
 * @returns {Object} Score breakdown
 */
function calculateRetrievalScore(memory, query = {}, options = {}) {
  const weights = {
    semantic: options.semanticWeight || SCORING.RETRIEVAL.SEMANTIC_WEIGHT,
    recency: options.recencyWeight || SCORING.RETRIEVAL.RECENCY_WEIGHT,
    importance: options.importanceWeight || SCORING.RETRIEVAL.IMPORTANCE_WEIGHT,
    frequency: options.frequencyWeight || SCORING.RETRIEVAL.FREQUENCY_WEIGHT
  };

  // Semantic similarity
  let similarity = 0.5;
  if (memory.similarity !== undefined) {
    similarity = memory.similarity;
  } else if (memory.distance !== undefined) {
    similarity = 1 - Math.min(1, memory.distance);
  }

  // Recency
  const timestamp = memory.created_at || memory.createdAt || Date.now();
  const recency = getRecencyScore(timestamp, { method: 'sigmoid' });

  // Importance
  const importance = memory.importance || calculateImportance(memory);

  // Frequency/access count
  const accessCount = memory.access_count || memory.accessCount || 1;
  const frequency = Math.min(1, accessCount / 10);

  // Core memory boost
  const coreBoost = memory.is_core || memory.isCore ? 0.15 : 0;

  // Calculate composite score
  const baseScore =
    weights.semantic * similarity +
    weights.recency * recency +
    weights.importance * importance +
    weights.frequency * frequency;

  const finalScore = Math.min(1, baseScore + coreBoost);

  return {
    score: finalScore,
    components: {
      similarity,
      recency,
      importance,
      frequency,
      coreBoost
    },
    weights
  };
}

// ============================================================================
// DECAY APPLICATION
// ============================================================================

/**
 * Apply decay to memory relevance
 *
 * @param {Object} memory - Memory to decay
 * @param {Object} options - Decay configuration
 * @returns {Object} Memory with updated relevance
 */
function applyDecay(memory, options = {}) {
  const {
    decayRate = MEMORY.STM.DECAY_RATE,
    hoursSinceUpdate = 1
  } = options;

  const currentRelevance = memory.relevance || 1.0;
  const decayFactor = 1 - (decayRate * hoursSinceUpdate);
  const newRelevance = Math.max(0, currentRelevance * decayFactor);

  return {
    ...memory,
    relevance: newRelevance,
    last_decay: Date.now()
  };
}

/**
 * Apply strengthening when memory is accessed
 *
 * @param {Object} memory - Memory to strengthen
 * @param {Object} options - Strengthening configuration
 * @returns {Object} Memory with updated strength
 */
function applyStrengthening(memory, options = {}) {
  const {
    boostAmount = MEMORY.LTM.STRENGTHENING_RATE
  } = options;

  const currentStrength = memory.strength || memory.relevance || 0.5;
  const newStrength = Math.min(1, currentStrength + boostAmount);
  const accessCount = (memory.access_count || memory.accessCount || 0) + 1;

  return {
    ...memory,
    strength: newStrength,
    relevance: newStrength,
    access_count: accessCount,
    last_accessed: Date.now()
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sort memories by score
 *
 * @param {Array} memories - Array of memories
 * @param {Object} options - Sorting options
 * @returns {Array} Sorted memories
 */
function sortByScore(memories, options = {}) {
  const { limit = 10, scoreField = 'score' } = options;

  return memories
    .map(m => ({
      ...m,
      [scoreField]: m[scoreField] || calculateRetrievalScore(m).score
    }))
    .sort((a, b) => b[scoreField] - a[scoreField])
    .slice(0, limit);
}

/**
 * Filter memories by threshold
 *
 * @param {Array} memories - Array of memories
 * @param {Object} options - Filter options
 * @returns {Array} Filtered memories
 */
function filterByThreshold(memories, options = {}) {
  const {
    threshold = MEMORY.STM.RELEVANCE_THRESHOLD,
    scoreField = 'score'
  } = options;

  return memories.filter(m => {
    const score = m[scoreField] || calculateRetrievalScore(m).score;
    return score >= threshold;
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Recency scoring
  calculateSigmoidRecency,
  calculateLinearRecency,
  calculateExponentialRecency,
  getRecencyScore,

  // Importance calculation
  calculateImportance,
  calculateConsolidationScore,

  // Retrieval ranking
  calculateRRF,
  calculateRetrievalScore,

  // Decay/strengthening
  applyDecay,
  applyStrengthening,

  // Utilities
  sortByScore,
  filterByThreshold
};
