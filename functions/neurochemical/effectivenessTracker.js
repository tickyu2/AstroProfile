/**
 * GENESIS Neurochemical Love Engine
 * Effectiveness Tracker Service
 * ================================
 *
 * Measures how well Luna's neurochemical protocols are working.
 * Tracks the gap between intended output and actual user response.
 *
 * Effectiveness Formula:
 * Effectiveness = (Accuracy × 0.6) + (ProtocolMatch × 0.4)
 *
 * Where:
 * - Accuracy = 1 - |expectedHappiness - actualHappiness| / 5
 * - ProtocolMatch = average of (detected/output) for each neurochemical
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 * When things can be measured, they can be mathematically improved.
 */

// ============================================================================
// EFFECTIVENESS CALCULATION
// ============================================================================

/**
 * Calculate effectiveness score for a conversation exchange
 *
 * @param {Object} protocolUsed - Luna's output levels (1-5 each)
 * @param {number} protocolUsed.oxytocin - Oxytocin output level
 * @param {number} protocolUsed.dopamine - Dopamine output level
 * @param {number} protocolUsed.serotonin - Serotonin output level
 * @param {number} protocolUsed.vasopressin - Vasopressin output level
 * @param {Object} neurochemicalsDetected - User's response levels (0-5 each)
 * @param {number} expectedHappiness - What happiness we predicted
 * @param {number} actualHappiness - What happiness we measured
 * @returns {Object} - Effectiveness result with all metrics
 */
function calculateEffectiveness(protocolUsed, neurochemicalsDetected, expectedHappiness, actualHappiness) {
  // ═══════════════════════════════════════════════════════════════════════
  // PART 1: ACCURACY SCORE
  // How close was our prediction to reality?
  // ═══════════════════════════════════════════════════════════════════════

  const difference = Math.abs(expectedHappiness - actualHappiness);
  const accuracyScore = Math.max(0, 1 - (difference / 5));

  // ═══════════════════════════════════════════════════════════════════════
  // PART 2: PROTOCOL MATCH
  // Did the user respond proportionally to what we delivered?
  // ═══════════════════════════════════════════════════════════════════════

  const individualMatches = {
    oxytocin: calculateMatchRatio(
      protocolUsed.oxytocin,
      neurochemicalsDetected.oxytocin
    ),
    dopamine: calculateMatchRatio(
      protocolUsed.dopamine,
      neurochemicalsDetected.dopamine
    ),
    serotonin: calculateMatchRatio(
      protocolUsed.serotonin,
      neurochemicalsDetected.serotonin
    ),
    vasopressin: calculateMatchRatio(
      protocolUsed.vasopressin,
      neurochemicalsDetected.vasopressin
    )
  };

  // Average protocol match
  const avgProtocolMatch = (
    individualMatches.oxytocin +
    individualMatches.dopamine +
    individualMatches.serotonin +
    individualMatches.vasopressin
  ) / 4;

  // ═══════════════════════════════════════════════════════════════════════
  // PART 3: COMBINED EFFECTIVENESS
  // ═══════════════════════════════════════════════════════════════════════

  // 60% accuracy (did we predict correctly?)
  // 40% protocol match (did delivery cause expected response?)
  const effectiveness = (accuracyScore * 0.6) + (avgProtocolMatch * 0.4);

  // ═══════════════════════════════════════════════════════════════════════
  // PART 4: METADATA & INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════

  const variance = actualHappiness - expectedHappiness;
  const betterThanExpected = actualHappiness > expectedHappiness;

  // Find which neurochemical worked best/worst
  const bestMatch = Object.entries(individualMatches)
    .reduce((best, [chem, score]) => score > best.score ? { chem, score } : best, { chem: null, score: 0 });
  const worstMatch = Object.entries(individualMatches)
    .reduce((worst, [chem, score]) => score < worst.score ? { chem, score } : worst, { chem: null, score: 1 });

  return {
    effectiveness: roundTo3(effectiveness),
    accuracy: roundTo3(accuracyScore),
    protocolMatch: roundTo3(avgProtocolMatch),
    individualMatches: {
      oxytocin: roundTo3(individualMatches.oxytocin),
      dopamine: roundTo3(individualMatches.dopamine),
      serotonin: roundTo3(individualMatches.serotonin),
      vasopressin: roundTo3(individualMatches.vasopressin)
    },
    variance: roundTo2(variance),
    betterThanExpected,
    bestPerformer: bestMatch.chem,
    worstPerformer: worstMatch.chem,
    interpretation: interpretEffectiveness(effectiveness),
    recommendation: generateRecommendation(effectiveness, variance, worstMatch.chem)
  };
}

/**
 * Calculate match ratio between protocol output and detected response
 *
 * @param {number} output - Protocol output level (1-5)
 * @param {number} detected - Detected response level (0-5)
 * @returns {number} - Match ratio (0-1.0+, can exceed 1 if response exceeds expectation)
 */
function calculateMatchRatio(output, detected) {
  if (!output || output <= 0) return 1.0; // No output = neutral match

  // Detected 0-5, Output 1-5
  // Perfect match when detected/output ≈ 1.0
  // Cap at 1.2 for "exceeded expectation"
  const ratio = detected / output;
  return Math.min(ratio, 1.2);
}

/**
 * Interpret effectiveness score to human-readable status
 *
 * @param {number} score - Effectiveness score (0-1.0)
 * @returns {string} - Status interpretation
 */
function interpretEffectiveness(score) {
  if (score >= 0.90) return 'EXCELLENT - Pattern is gold standard';
  if (score >= 0.80) return 'VERY_GOOD - Pattern working well';
  if (score >= 0.70) return 'GOOD - Pattern acceptable';
  if (score >= 0.60) return 'MODERATE - Pattern needs tuning';
  if (score >= 0.50) return 'POOR - Pattern not working well';
  return 'FAILING - Pattern should be avoided';
}

/**
 * Generate actionable recommendation based on effectiveness analysis
 *
 * @param {number} effectiveness - Overall effectiveness score
 * @param {number} variance - Actual - Expected happiness
 * @param {string} worstPerformer - Which neurochemical performed worst
 * @returns {string} - Recommendation for next interaction
 */
function generateRecommendation(effectiveness, variance, worstPerformer) {
  if (effectiveness >= 0.85) {
    return 'Continue current approach - working excellently';
  }

  if (effectiveness >= 0.70) {
    if (variance > 0) {
      return 'Good performance - consider slightly increasing intensity';
    }
    return 'Good performance - maintain current pattern';
  }

  // Need improvement
  if (worstPerformer) {
    const recommendations = {
      oxytocin: 'Increase warmth and emotional safety language',
      dopamine: 'Add more engagement hooks and curiosity sparks',
      serotonin: 'Enhance recognition and "I see you" moments',
      vasopressin: 'Strengthen "I have your back" protective messaging'
    };
    return recommendations[worstPerformer] || 'Adjust protocol levels';
  }

  return 'Consider switching to a different pattern';
}

// ============================================================================
// PATTERN EVOLUTION
// ============================================================================

/**
 * Determine if a pattern should be promoted based on accumulated stats
 *
 * @param {Object} patternStats - Current pattern statistics
 * @param {number} patternStats.timesUsed - Total uses
 * @param {number} patternStats.avgHappiness - Average happiness achieved
 * @param {number} patternStats.successRate - Success rate (happiness >= 3.0)
 * @returns {string} - Pattern status: EXPERIMENTAL, VALIDATED, GOLD_STANDARD
 */
function determinePatternStatus(patternStats) {
  const { timesUsed, avgHappiness, successRate } = patternStats;

  // GOLD_STANDARD: >= 1000 uses, avgHappiness >= 3.8, successRate >= 0.85
  if (timesUsed >= 1000 && avgHappiness >= 3.8 && successRate >= 0.85) {
    return 'GOLD_STANDARD';
  }

  // VALIDATED: >= 100 uses, avgHappiness >= 3.0, successRate >= 0.70
  if (timesUsed >= 100 && avgHappiness >= 3.0 && successRate >= 0.70) {
    return 'VALIDATED';
  }

  // DEPRECATED: Low performance after enough data
  if (timesUsed >= 50 && (avgHappiness < 2.5 || successRate < 0.50)) {
    return 'DEPRECATED';
  }

  // Still learning
  return 'EXPERIMENTAL';
}

/**
 * Check if we should record this as a breakthrough
 * Breakthroughs are exceptional moments that should inform future patterns
 *
 * @param {number} actualHappiness - Achieved happiness score
 * @param {number} effectiveness - Overall effectiveness
 * @returns {boolean} - True if this is a breakthrough moment
 */
function isBreakthrough(actualHappiness, effectiveness) {
  // Breakthrough = happiness >= 4.0 AND effectiveness >= 0.85
  return actualHappiness >= 4.0 && effectiveness >= 0.85;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Round to 3 decimal places
 * @param {number} num - Number to round
 * @returns {number} - Rounded number
 */
function roundTo3(num) {
  return Math.round(num * 1000) / 1000;
}

/**
 * Round to 2 decimal places
 * @param {number} num - Number to round
 * @returns {number} - Rounded number
 */
function roundTo2(num) {
  return Math.round(num * 100) / 100;
}

// ============================================================================
// AGGREGATE TRACKING
// ============================================================================

/**
 * Update aggregate statistics with new data point
 *
 * @param {Object} currentStats - Current aggregate stats
 * @param {number} newHappiness - New happiness score
 * @param {number} newEffectiveness - New effectiveness score
 * @returns {Object} - Updated statistics
 */
function updateAggregateStats(currentStats, newHappiness, newEffectiveness) {
  const timesUsed = (currentStats.timesUsed || 0) + 1;
  const totalHappiness = (currentStats.totalHappiness || 0) + newHappiness;
  const totalEffectiveness = (currentStats.totalEffectiveness || 0) + newEffectiveness;
  const wasSuccess = newHappiness >= 3.0;
  const successCount = (currentStats.successCount || 0) + (wasSuccess ? 1 : 0);

  return {
    timesUsed,
    successCount,
    successRate: roundTo3(successCount / timesUsed),
    totalHappiness,
    avgHappiness: roundTo2(totalHappiness / timesUsed),
    totalEffectiveness,
    avgEffectiveness: roundTo3(totalEffectiveness / timesUsed)
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Core calculation
  calculateEffectiveness,

  // Pattern evolution
  determinePatternStatus,
  isBreakthrough,

  // Helpers
  calculateMatchRatio,
  interpretEffectiveness,
  generateRecommendation,
  updateAggregateStats,

  // Utilities
  roundTo2,
  roundTo3
};
