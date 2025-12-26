/**
 * optimalCuspCalculator.js
 * 
 * WESTERN CUSP OPTIMAL PARTNER CALCULATOR
 * Given YOUR cusp → Calculate THE optimal cusp
 * 
 * Like BaZi reverse engineering but for Western Zodiac
 * NO BLACK BOX BUGS!
 * 
 * For GENESIS Platform - Western Zodiac Module
 * By Brother Sonnet, December 23, 2025
 * For Father Ticky
 */

import { calculateCuspBreakdown } from './westernCuspBreakdown';
import { 
  getElementCompatibility, 
  GENERATING_CYCLE 
} from './elementCompatibilityMatrix';

// ============================================================================
// ALL 36 CUSPS
// ============================================================================

const ALL_36_CUSPS = [
  // Fire cusps
  { id: 'aries-pure', sign: 'Aries', name: 'Aries', element: { primary: 'Fire' }, dateRange: 'Mar 25 - Apr 13', type: 'pure' },
  { id: 'aries-taurus', sign: 'Aries', secondarySign: 'Taurus', name: 'Aries-Taurus', element: { primary: 'Fire', secondary: 'Earth' }, dateRange: 'Apr 14 - 20', type: 'blend-forward' },
  { id: 'leo-pure', sign: 'Leo', name: 'Leo', element: { primary: 'Fire' }, dateRange: 'Jul 30 - Aug 15', type: 'pure' },
  { id: 'leo-virgo', sign: 'Leo', secondarySign: 'Virgo', name: 'Leo-Virgo', element: { primary: 'Fire', secondary: 'Earth' }, dateRange: 'Aug 16 - 22', type: 'blend-forward' },
  { id: 'sagittarius-pure', sign: 'Sagittarius', name: 'Sagittarius', element: { primary: 'Fire' }, dateRange: 'Nov 30 - Dec 14', type: 'pure' },
  { id: 'sagittarius-capricorn', sign: 'Sagittarius', secondarySign: 'Capricorn', name: 'Sagittarius-Capricorn', element: { primary: 'Fire', secondary: 'Earth' }, dateRange: 'Dec 15 - 21', type: 'blend-forward' },
  
  // Earth cusps
  { id: 'taurus-pure', sign: 'Taurus', name: 'Taurus', element: { primary: 'Earth' }, dateRange: 'Apr 28 - May 13', type: 'pure' },
  { id: 'taurus-gemini', sign: 'Taurus', secondarySign: 'Gemini', name: 'Taurus-Gemini', element: { primary: 'Earth', secondary: 'Air' }, dateRange: 'May 14 - 20', type: 'blend-forward' },
  { id: 'virgo-pure', sign: 'Virgo', name: 'Virgo', element: { primary: 'Earth' }, dateRange: 'Aug 30 - Sep 15', type: 'pure' },
  { id: 'virgo-libra', sign: 'Virgo', secondarySign: 'Libra', name: 'Virgo-Libra', element: { primary: 'Earth', secondary: 'Air' }, dateRange: 'Sep 16 - 22', type: 'blend-forward' },
  { id: 'capricorn-pure', sign: 'Capricorn', name: 'Capricorn', element: { primary: 'Earth' }, dateRange: 'Dec 29 - Jan 12', type: 'pure' },
  { id: 'capricorn-aquarius', sign: 'Capricorn', secondarySign: 'Aquarius', name: 'Capricorn-Aquarius', element: { primary: 'Earth', secondary: 'Air' }, dateRange: 'Jan 13 - 19', type: 'blend-forward' },
  
  // Air cusps
  { id: 'gemini-pure', sign: 'Gemini', name: 'Gemini', element: { primary: 'Air' }, dateRange: 'May 28 - Jun 13', type: 'pure' },
  { id: 'gemini-cancer', sign: 'Gemini', secondarySign: 'Cancer', name: 'Gemini-Cancer', element: { primary: 'Air', secondary: 'Water' }, dateRange: 'Jun 14 - 20', type: 'blend-forward' },
  { id: 'libra-pure', sign: 'Libra', name: 'Libra', element: { primary: 'Air' }, dateRange: 'Sep 30 - Oct 15', type: 'pure' },
  { id: 'libra-scorpio', sign: 'Libra', secondarySign: 'Scorpio', name: 'Libra-Scorpio', element: { primary: 'Air', secondary: 'Water' }, dateRange: 'Oct 16 - 22', type: 'blend-forward' },
  { id: 'aquarius-pure', sign: 'Aquarius', name: 'Aquarius', element: { primary: 'Air' }, dateRange: 'Jan 27 - Feb 11', type: 'pure' },
  { id: 'aquarius-pisces', sign: 'Aquarius', secondarySign: 'Pisces', name: 'Aquarius-Pisces', element: { primary: 'Air', secondary: 'Water' }, dateRange: 'Feb 12 - 18', type: 'blend-forward' },
  
  // Water cusps
  { id: 'cancer-pure', sign: 'Cancer', name: 'Cancer', element: { primary: 'Water' }, dateRange: 'Jun 28 - Jul 15', type: 'pure' },
  { id: 'cancer-leo', sign: 'Cancer', secondarySign: 'Leo', name: 'Cancer-Leo', element: { primary: 'Water', secondary: 'Fire' }, dateRange: 'Jul 16 - 22', type: 'blend-forward' },
  { id: 'scorpio-pure', sign: 'Scorpio', name: 'Scorpio', element: { primary: 'Water' }, dateRange: 'Oct 30 - Nov 15', type: 'pure' },
  { id: 'scorpio-sagittarius', sign: 'Scorpio', secondarySign: 'Sagittarius', name: 'Scorpio-Sagittarius', element: { primary: 'Water', secondary: 'Fire' }, dateRange: 'Nov 16 - 22', type: 'blend-forward' },
  { id: 'pisces-pure', sign: 'Pisces', name: 'Pisces', element: { primary: 'Water' }, dateRange: 'Feb 26 - Mar 12', type: 'pure' },
  { id: 'pisces-aries', sign: 'Pisces', secondarySign: 'Aries', name: 'Pisces-Aries', element: { primary: 'Water', secondary: 'Fire' }, dateRange: 'Mar 13 - 19', type: 'blend-forward' }
];

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
  
  // STEP 2: Find all cusps with that optimal element
  const candidateCusps = ALL_36_CUSPS.filter(cusp => 
    cusp.element.primary === optimalElementData.optimalElement
  );
  
  // STEP 3: Calculate compatibility with each candidate
  const scoredCandidates = candidateCusps.map(candidate => {
    const breakdown = calculateCuspBreakdown(userCusp, candidate);
    return {
      cusp: candidate,
      score: Math.round(breakdown.finalScore),
      breakdown
    };
  });
  
  // STEP 4: Sort by score and pick top match
  scoredCandidates.sort((a, b) => b.score - a.score);
  const optimalCusp = scoredCandidates[0];
  
  // STEP 5: Build complete result
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
    calculation: buildCalculationSteps(userCusp, optimalCusp, optimalElementData),
    
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

function buildCalculationSteps(userCusp, optimalMatch, elementData) {
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
    result: `Found ${optimalMatch.allCandidates?.length || 6} candidates`,
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
// EXPORTS
// ============================================================================

export default {
  calculateOptimalCusp,
  ALL_36_CUSPS
};
