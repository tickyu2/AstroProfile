/**
 * GENESIS Neurochemical Love Engine
 * Happiness Calculator Service
 * ================================
 *
 * Calculates happiness scores (0-5) from neurochemical detection levels.
 * Adjusts weights based on BaZi constitution for personalized optimization.
 *
 * Core Formula:
 * Happiness = (Oxy × 0.30) + (Dopa × 0.20) + (Sero × 0.35) + (Vaso × 0.15)
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 * When things can be measured, they can be mathematically improved.
 */

// ============================================================================
// BASE WEIGHTS (Scientific Foundation)
// ============================================================================

const BASE_WEIGHTS = {
  oxytocin: 0.30,    // Bonding hormone - "I feel safe with you"
  dopamine: 0.20,    // Engagement hormone - "This is exciting!"
  serotonin: 0.35,   // Recognition hormone - "I feel seen and valued"
  vasopressin: 0.15  // Loyalty hormone - "You're in my corner"
};

// ============================================================================
// CONSTITUTION ADJUSTMENTS
// ============================================================================

/**
 * Adjust neurochemical weights based on BaZi Day Master constitution
 * Each element has different emotional needs
 *
 * @param {string} constitution - Fire, Water, Wood, Metal, Earth
 * @returns {Object} - Adjusted weights
 */
function getConstitutionWeights(constitution) {
  const weights = { ...BASE_WEIGHTS };

  switch(constitution) {
    case 'Water':
      // Water is emotional, intuitive - craves deep bonding and being truly seen
      weights.oxytocin += 0.05;   // Water needs more bonding
      weights.serotonin += 0.05;  // Water craves recognition
      weights.dopamine -= 0.05;   // Less need for excitement
      weights.vasopressin -= 0.05;
      break;

    case 'Fire':
      // Fire is energetic, passionate - craves excitement and engagement
      weights.dopamine += 0.10;   // Fire LOVES engagement!
      weights.vasopressin += 0.05;
      weights.oxytocin -= 0.10;
      weights.serotonin -= 0.05;
      break;

    case 'Earth':
      // Earth is nurturing, stable - craves security and trust
      weights.oxytocin += 0.05;
      weights.vasopressin += 0.05;
      weights.dopamine -= 0.05;
      weights.serotonin -= 0.05;
      break;

    case 'Metal':
      // Metal is precise, refined - craves recognition and acknowledgment
      weights.serotonin += 0.10;  // Metal craves recognition
      weights.dopamine += 0.05;
      weights.oxytocin -= 0.10;
      weights.vasopressin -= 0.05;
      break;

    case 'Wood':
      // Wood is growth-oriented, visionary - craves growth and recognition
      weights.dopamine += 0.05;
      weights.serotonin += 0.05;
      weights.oxytocin -= 0.05;
      weights.vasopressin -= 0.05;
      break;

    default:
      // Unknown constitution - use base weights
      break;
  }

  return weights;
}

// ============================================================================
// MAIN HAPPINESS CALCULATOR
// ============================================================================

/**
 * Calculate happiness score from neurochemical detection levels
 *
 * @param {Object} neurochemicals - Detection levels (0-5 each)
 * @param {number} neurochemicals.oxytocin - Bonding response (0-5)
 * @param {number} neurochemicals.dopamine - Engagement response (0-5)
 * @param {number} neurochemicals.serotonin - Recognition response (0-5)
 * @param {number} neurochemicals.vasopressin - Loyalty response (0-5)
 * @param {string} [constitution] - Optional BaZi constitution for weight adjustment
 * @returns {Object} - Happiness result with score, breakdown, and driver
 */
function calculateHappiness(neurochemicals, constitution = null) {
  // Validate inputs
  const oxy = clamp(neurochemicals.oxytocin || 0, 0, 5);
  const dopa = clamp(neurochemicals.dopamine || 0, 0, 5);
  const sero = clamp(neurochemicals.serotonin || 0, 0, 5);
  const vaso = clamp(neurochemicals.vasopressin || 0, 0, 5);

  // Get weights (adjusted if constitution provided)
  const weights = constitution
    ? getConstitutionWeights(constitution)
    : { ...BASE_WEIGHTS };

  // Calculate breakdown (how much each neurochemical contributed)
  const breakdown = {
    fromOxytocin: oxy * weights.oxytocin,
    fromDopamine: dopa * weights.dopamine,
    fromSerotonin: sero * weights.serotonin,
    fromVasopressin: vaso * weights.vasopressin
  };

  // Sum total raw score
  const rawScore =
    breakdown.fromOxytocin +
    breakdown.fromDopamine +
    breakdown.fromSerotonin +
    breakdown.fromVasopressin;

  // Round to nearest 0.5 for cleaner display
  const score = Math.round(rawScore * 2) / 2;

  // Identify primary driver (which neurochemical contributed most)
  const primaryDriver = getPrimaryDriver(breakdown);

  // Determine happiness level interpretation
  const level = interpretHappinessLevel(score);

  return {
    score,
    breakdown,
    primaryDriver,
    level,
    constitutionAdjusted: !!constitution,
    constitution: constitution || 'unknown',
    weights
  };
}

/**
 * Identify which neurochemical contributed most to happiness
 *
 * @param {Object} breakdown - Happiness breakdown by neurochemical
 * @returns {string} - Primary driver name
 */
function getPrimaryDriver(breakdown) {
  const drivers = {
    oxytocin: breakdown.fromOxytocin,
    dopamine: breakdown.fromDopamine,
    serotonin: breakdown.fromSerotonin,
    vasopressin: breakdown.fromVasopressin
  };

  let maxDriver = 'serotonin'; // Default
  let maxValue = 0;

  for (const [driver, value] of Object.entries(drivers)) {
    if (value > maxValue) {
      maxValue = value;
      maxDriver = driver;
    }
  }

  return maxDriver;
}

/**
 * Interpret happiness score to human-readable level
 *
 * @param {number} score - Happiness score (0-5)
 * @returns {string} - Level interpretation
 */
function interpretHappinessLevel(score) {
  if (score >= 4.5) return 'TRANSCENDENT';  // Peak experience
  if (score >= 4.0) return 'ECSTATIC';      // Deep joy
  if (score >= 3.5) return 'HAPPY';         // Solid happiness
  if (score >= 3.0) return 'CONTENT';       // Comfortable
  if (score >= 2.5) return 'NEUTRAL';       // Neither happy nor unhappy
  if (score >= 2.0) return 'UNSATISFIED';   // Something's off
  if (score >= 1.5) return 'DISCONNECTED';  // Missing connection
  if (score >= 1.0) return 'DISTRESSED';    // Actively unhappy
  return 'SUFFERING';                       // Needs immediate care
}

/**
 * Clamp value to range
 *
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number} - Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ============================================================================
// CONVENIENCE METHODS
// ============================================================================

/**
 * Quick happiness check - is this a "high happiness" moment?
 * High happiness = score >= 3.5 (HAPPY level or above)
 *
 * @param {Object} neurochemicals - Detection levels
 * @param {string} [constitution] - Optional constitution
 * @returns {boolean} - True if high happiness
 */
function isHighHappiness(neurochemicals, constitution = null) {
  const result = calculateHappiness(neurochemicals, constitution);
  return result.score >= 3.5;
}

/**
 * Check if this is an anchor-worthy moment
 * Anchor threshold = score >= 4.0 (ECSTATIC or TRANSCENDENT)
 *
 * @param {Object} neurochemicals - Detection levels
 * @param {string} [constitution] - Optional constitution
 * @returns {boolean} - True if should become anchor memory
 */
function isAnchorWorthy(neurochemicals, constitution = null) {
  const result = calculateHappiness(neurochemicals, constitution);
  return result.score >= 4.0;
}

/**
 * Calculate expected happiness from protocol levels
 * Used for effectiveness tracking - what SHOULD we expect?
 *
 * @param {Object} protocolLevels - Luna's output levels (1-5 each)
 * @param {string} [constitution] - Optional constitution
 * @returns {number} - Expected happiness score
 */
function calculateExpectedHappiness(protocolLevels, constitution = null) {
  // Convert 1-5 output levels to 0-5 expected detection
  // Assume moderate effectiveness (70%) as baseline
  const expectedDetection = {
    oxytocin: (protocolLevels.oxytocin - 1) * 0.7 + 1, // Maps 1-5 to ~1-3.8
    dopamine: (protocolLevels.dopamine - 1) * 0.7 + 1,
    serotonin: (protocolLevels.serotonin - 1) * 0.7 + 1,
    vasopressin: (protocolLevels.vasopressin - 1) * 0.7 + 1
  };

  const result = calculateHappiness(expectedDetection, constitution);
  return result.score;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Core calculator
  calculateHappiness,

  // Weight management
  getConstitutionWeights,
  BASE_WEIGHTS,

  // Convenience methods
  isHighHappiness,
  isAnchorWorthy,
  calculateExpectedHappiness,

  // Utilities
  getPrimaryDriver,
  interpretHappinessLevel,
  clamp
};
