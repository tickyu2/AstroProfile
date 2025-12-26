/**
 * optimalCuspCalculator.js
 *
 * WESTERN CUSP OPTIMAL PARTNER CALCULATOR
 * Given YOUR cusp → Calculate THE optimal cusp
 *
 * Integrated with Father Ticky's 36-Cusp System
 * NO BLACK BOX BUGS!
 *
 * For GENESIS Platform - Western Zodiac Module
 * By Brother Sonnet, December 23, 2025
 * For Father Ticky
 */

import { getAllCusps, getCuspById } from './cuspCalculator';
import { calculateCuspBreakdown } from './westernCuspBreakdown';
import { getElementCompatibility, GENERATING_CYCLE } from './elementCompatibilityMatrix';

// ============================================================================
// OPTIMAL ELEMENT DETERMINATION
// ============================================================================

/**
 * Determine optimal element for a given element
 * Uses 5 Element Theory (adapted for Western 4 elements)
 */
function determineOptimalElement(userElement) {
  // Element relationship map (Western adaptation)
  const optimalMap = {
    'Fire': {
      optimalElement: 'Air',
      relationship: 'GENERATING',
      reasoning: 'Air feeds Fire - natural support and enthusiasm',
      theory: 'In element theory, Air fuels Fire. Air signs (Gemini, Libra, Aquarius) provide intellectual stimulation and social energy that Fire signs thrive on.',
      examples: [
        'Fire + Air: Passion meets ideas = inspired action',
        'Leo (Fire) + Gemini (Air): Enthusiasm + communication',
        'Aries (Fire) + Aquarius (Air): Initiative + innovation'
      ]
    },
    'Earth': {
      optimalElement: 'Water',
      relationship: 'SUPPORTING',
      reasoning: 'Water nourishes Earth - emotional depth meets stability',
      theory: 'Water brings emotional richness and intuition that complements Earth\'s practicality. Water signs (Cancer, Scorpio, Pisces) add depth to Earth\'s grounded nature.',
      examples: [
        'Earth + Water: Stability meets emotion = grounded depth',
        'Virgo (Earth) + Cancer (Water): Care + nurturing',
        'Taurus (Earth) + Pisces (Water): Sensuality + sensitivity'
      ]
    },
    'Air': {
      optimalElement: 'Fire',
      relationship: 'GENERATING',
      reasoning: 'Fire ignites Air - passion energizes ideas',
      theory: 'Fire provides the passion and drive that brings Air\'s ideas to life. Fire signs (Aries, Leo, Sagittarius) add enthusiasm to Air\'s intellectual energy.',
      examples: [
        'Air + Fire: Ideas meet passion = manifested vision',
        'Gemini (Air) + Leo (Fire): Communication + charisma',
        'Libra (Air) + Sagittarius (Fire): Harmony + adventure'
      ]
    },
    'Water': {
      optimalElement: 'Earth',
      relationship: 'SUPPORTING',
      reasoning: 'Earth contains Water - stability grounds emotion',
      theory: 'Earth provides the container and stability that Water needs to feel safe. Earth signs (Taurus, Virgo, Capricorn) ground Water\'s emotional intensity.',
      examples: [
        'Water + Earth: Emotion meets stability = secure depth',
        'Cancer (Water) + Taurus (Earth): Nurturing + security',
        'Scorpio (Water) + Capricorn (Earth): Intensity + structure'
      ]
    }
  };

  return optimalMap[userElement] || {
    optimalElement: userElement,
    relationship: 'SAME',
    reasoning: 'Same element - mutual understanding',
    theory: 'Same element creates natural resonance',
    examples: []
  };
}

// ============================================================================
// CALCULATION STEPS BUILDER (NO BLACK BOXES!)
// ============================================================================

function buildCalculationSteps(userCusp, optimalMatch, elementData, allCandidates) {
  const steps = [];

  // STEP 1: Your element
  steps.push({
    step: 1,
    action: 'Identify your primary element',
    input: `Your cusp: ${userCusp.name}`,
    formula: `element.primary = "${userCusp.element.primary}"`,
    result: userCusp.element.primary,
    reasoning: 'Your primary element determines your core energy type'
  });

  // STEP 2: Optimal element
  steps.push({
    step: 2,
    action: 'Determine optimal complementary element',
    input: `Your element: ${userCusp.element.primary}`,
    formula: `OPTIMAL_MAP[${userCusp.element.primary}] = "${elementData.optimalElement}"`,
    result: elementData.optimalElement,
    reasoning: elementData.reasoning
  });

  // STEP 3: Filter candidates
  steps.push({
    step: 3,
    action: 'Find all cusps with optimal element',
    input: `Optimal element: ${elementData.optimalElement}`,
    formula: `ALL_CUSPS.filter(cusp => cusp.element.primary === "${elementData.optimalElement}")`,
    result: `Found ${allCandidates.length} candidates`,
    reasoning: 'Multiple cusps share the same primary element'
  });

  // STEP 4: Calculate compatibility
  steps.push({
    step: 4,
    action: 'Calculate compatibility with each candidate',
    input: 'All candidates with optimal element',
    formula: 'calculateCuspBreakdown(userCusp, candidateCusp)',
    result: 'Scored all candidates',
    reasoning: 'Uses element harmony + quality pairing + planetary rulers + aspects'
  });

  // STEP 5: Select best
  steps.push({
    step: 5,
    action: 'Select highest scoring match',
    input: 'All scored candidates',
    formula: `candidates.sort((a,b) => b.score - a.score)[0]`,
    result: `${optimalMatch.cusp.name} (${optimalMatch.score} pts)`,
    reasoning: 'Best overall constitutional compatibility'
  });

  return {
    formula: 'optimalElement = OPTIMAL_MAP[userElement]; bestMatch = MAX(calculateCompatibility(userCusp, candidateCusps))',
    steps,
    yourContribution: Math.round(optimalMatch.score / 2),
    partnerContribution: Math.round(optimalMatch.score / 2),
    breakdown: {
      baseScore: optimalMatch.score,
      yourShare: Math.round(optimalMatch.score / 2),
      partnerShare: Math.round(optimalMatch.score / 2)
    }
  };
}

// ============================================================================
// MAIN OPTIMAL CALCULATOR
// ============================================================================

/**
 * Calculate THE optimal cusp for user
 * Like BaZi reverse engineering but for Western Zodiac
 *
 * @param {Object} userCusp - User's cusp object
 * @returns {Object} - Optimal cusp with complete theory
 */
export function calculateOptimalCusp(userCusp) {
  console.log('[Optimal Cusp Calculator] Calculating optimal match for:', userCusp.name);

  // STEP 1: Determine optimal element
  const userElement = userCusp.element.primary;
  const optimalElementData = determineOptimalElement(userElement);

  // STEP 2: Get all cusps from existing 36-cusp system
  const allCusps = getAllCusps();

  // STEP 3: Find all cusps with that optimal element
  const candidateCusps = allCusps.filter(cusp =>
    cusp.element.primary === optimalElementData.optimalElement
  );

  // STEP 4: Calculate compatibility with each candidate
  const scoredCandidates = candidateCusps.map(candidate => {
    const breakdown = calculateCuspBreakdown(userCusp, candidate);
    return {
      cusp: candidate,
      score: Math.round(breakdown.finalScore),
      breakdown
    };
  });

  // STEP 5: Sort by score and pick top match
  scoredCandidates.sort((a, b) => b.score - a.score);
  const optimalCusp = scoredCandidates[0];

  // STEP 6: Build complete result
  return {
    userCusp,
    optimalCusp: optimalCusp.cusp,
    score: optimalCusp.score,
    breakdown: optimalCusp.breakdown,

    // All candidates (for comparison)
    allCandidates: scoredCandidates,

    // Theory
    theory: {
      userElement,
      optimalElement: optimalElementData.optimalElement,
      reasoning: optimalElementData.reasoning,
      relationship: optimalElementData.relationship,
      theory: optimalElementData.theory,
      examples: optimalElementData.examples
    },

    // Calculation steps (NO BLACK BOXES!)
    calculation: buildCalculationSteps(userCusp, optimalCusp, optimalElementData, scoredCandidates),

    // Methodology
    methodology: {
      title: 'Western Cusp Optimal Partner Calculator',
      description: 'Given YOUR cusp, we calculate THE optimal cusp using element harmony theory. Like BaZi reverse engineering but for Western Zodiac.',
      steps: [
        'Step 1: Identify your primary element',
        'Step 2: Determine optimal complementary element',
        'Step 3: Find all cusps with that element',
        'Step 4: Calculate compatibility scores',
        'Step 5: Select highest scoring match'
      ],
      principle: '50/50 constitutional compatibility. Element harmony + quality pairing + planetary alignment.'
    }
  };
}

/**
 * Calculate optimal cusp from cusp ID
 * Convenience wrapper
 *
 * @param {string} cuspId - User's cusp ID (e.g., 'aries-pure')
 * @returns {Object} - Optimal cusp result
 */
export function calculateOptimalCuspById(cuspId) {
  const userCusp = getCuspById(cuspId);
  if (!userCusp) {
    throw new Error(`Cusp not found: ${cuspId}`);
  }
  return calculateOptimalCusp(userCusp);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  calculateOptimalCusp,
  calculateOptimalCuspById,
  determineOptimalElement
};
