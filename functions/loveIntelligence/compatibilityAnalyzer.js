/**
 * GENESIS Compatibility Analyzer
 * Analyzes love compatibility between two profiles
 * ================================================
 *
 * Combines:
 * - Love Language give/receive matching
 * - Sternberg Triangle alignment
 * - Constitution (BaZi element) harmony
 * - Gap identification with bridge advice
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 */

const loveLanguageMapper = require('./loveLanguageMapper');
const loveProfileService = require('./loveProfileService');

// ============================================================================
// COMPATIBILITY FORMULA (from GENESIS synthesis)
// ============================================================================

/**
 * Master Compatibility Formula:
 * C = (LLmatch × 0.35) + (Sternberg × 0.30) + (Constitution × 0.25) + (1 - MaxGapSeverity × 0.10)
 *
 * Where:
 * - LLmatch = Average of give→receive match scores
 * - Sternberg = Triangle dimension alignment
 * - Constitution = Element harmony score
 * - MaxGapSeverity = Worst identified gap severity
 */

// ============================================================================
// ELEMENT COMPATIBILITY MATRIX
// ============================================================================

/**
 * BaZi 5-Element compatibility scores
 * Based on generating, controlling, and clashing cycles
 */
const ELEMENT_COMPATIBILITY = {
  Fire: {
    Fire: 0.7,    // Same element - compatible but intense
    Water: 0.3,   // Water controls Fire
    Wood: 0.9,    // Wood feeds Fire (generating)
    Metal: 0.5,   // Fire controls Metal
    Earth: 0.8    // Fire generates Earth
  },
  Water: {
    Fire: 0.3,    // Water controls Fire
    Water: 0.7,   // Same element
    Wood: 0.8,    // Water generates Wood
    Metal: 0.9,   // Metal generates Water
    Earth: 0.5    // Earth controls Water
  },
  Wood: {
    Fire: 0.8,    // Wood generates Fire
    Water: 0.9,   // Water generates Wood
    Wood: 0.7,    // Same element
    Metal: 0.3,   // Metal controls Wood
    Earth: 0.5    // Wood controls Earth
  },
  Metal: {
    Fire: 0.3,    // Fire controls Metal
    Water: 0.8,   // Metal generates Water
    Wood: 0.5,    // Metal controls Wood
    Metal: 0.7,   // Same element
    Earth: 0.9    // Earth generates Metal
  },
  Earth: {
    Fire: 0.9,    // Fire generates Earth
    Water: 0.5,   // Earth controls Water
    Wood: 0.3,    // Wood controls Earth
    Metal: 0.8,   // Earth generates Metal
    Earth: 0.7    // Same element
  }
};

// ============================================================================
// CONSTITUTION PAIRING INSIGHTS (from Brother Sonnet)
// ============================================================================

/**
 * Human-readable insights for element pairings
 * Helps users understand their constitutional dynamic
 */
const CONSTITUTION_PAIRING_INSIGHTS = {
  'Fire-Fire': 'Both passionate and expressive - watch for competition, celebrate together',
  'Fire-Water': 'Fire warms Water, Water cools Fire - complementary balance through differences',
  'Fire-Wood': 'Wood feeds Fire\'s energy - supportive and growth-oriented dynamic',
  'Fire-Metal': 'Fire tempers Metal - requires conscious care and mutual respect',
  'Fire-Earth': 'Fire strengthens Earth - stable partnership with warmth',
  'Water-Water': 'Deep emotional understanding - ensure external stimulation and adventure',
  'Water-Wood': 'Water nourishes Wood growth - natural harmony and mutual support',
  'Water-Metal': 'Metal clarifies Water - mutually beneficial and refined connection',
  'Water-Earth': 'Earth provides stability for Water - grounding and nurturing partnership',
  'Wood-Wood': 'Mutual growth orientation - support each other\'s development and visions',
  'Wood-Metal': 'Metal shapes Wood precisely - creative tension that can produce excellence',
  'Wood-Earth': 'Wood breaks through Earth - dynamic that needs conscious balance',
  'Metal-Metal': 'High standards together - appreciate each other\'s precision and values',
  'Metal-Earth': 'Earth nurtures Metal - supportive and strengthening dynamic',
  'Earth-Earth': 'Stable and reliable foundation - ensure adventure and spontaneity'
};

/**
 * Get insight for a constitution pairing
 */
function getConstitutionPairingInsight(elementA, elementB) {
  const key1 = `${elementA}-${elementB}`;
  const key2 = `${elementB}-${elementA}`;
  return CONSTITUTION_PAIRING_INSIGHTS[key1] || CONSTITUTION_PAIRING_INSIGHTS[key2] ||
    `${elementA} and ${elementB} create a unique dynamic - explore together`;
}

// ============================================================================
// MAIN COMPATIBILITY ANALYSIS
// ============================================================================

/**
 * Analyze full compatibility between two profiles
 *
 * @param {string} userId - User ID
 * @param {string} profileIdA - First profile ID
 * @param {string} profileIdB - Second profile ID (partner)
 * @returns {Promise<Object>} - Complete compatibility analysis
 */
async function analyzeCompatibility(userId, profileIdA, profileIdB) {
  console.log(`[CompatibilityAnalyzer] Analyzing compatibility between ${profileIdA} and ${profileIdB}`);

  // Get love profiles for both
  const profileA = await loveProfileService.getLoveProfile(userId, profileIdA);
  const profileB = await loveProfileService.getLoveProfile(userId, profileIdB);

  // Calculate component scores
  const loveLanguageScore = calculateLoveLanguageCompatibility(profileA, profileB);
  const sternbergScore = loveProfileService.calculateSternbergAlignment(profileA, profileB);
  const constitutionScore = calculateConstitutionCompatibility(
    profileA.constitution,
    profileB.constitution
  );

  // Identify gaps
  const gaps = identifyCompatibilityGaps(profileA, profileB);

  // Calculate max gap severity (0 if no gaps)
  const maxGapSeverity = gaps.length > 0
    ? Math.max(...gaps.map(g => g.severity))
    : 0;

  // Master compatibility formula
  const overallScore = (
    (loveLanguageScore * 0.35) +
    (sternbergScore * 0.30) +
    (constitutionScore * 0.25) +
    ((1 - maxGapSeverity) * 0.10)
  );

  // Build analysis result
  const result = {
    overallScore: Math.round(overallScore * 100) / 100,
    overallRating: getCompatibilityRating(overallScore),

    components: {
      loveLanguage: {
        score: Math.round(loveLanguageScore * 100) / 100,
        aGivesToB: loveLanguageMapper.calculateLoveLanguageMatch(
          profileA.givePrimary,
          profileB.receivePrimary
        ),
        bGivesToA: loveLanguageMapper.calculateLoveLanguageMatch(
          profileB.givePrimary,
          profileA.receivePrimary
        ),
        detail: {
          aGives: profileA.givePrimary,
          bReceives: profileB.receivePrimary,
          bGives: profileB.givePrimary,
          aReceives: profileA.receivePrimary
        }
      },

      sternberg: {
        score: Math.round(sternbergScore * 100) / 100,
        alignment: {
          intimacy: Math.abs((profileA.intimacy || 5) - (profileB.intimacy || 5)),
          passion: Math.abs((profileA.passion || 5) - (profileB.passion || 5)),
          commitment: Math.abs((profileA.commitment || 5) - (profileB.commitment || 5))
        },
        detail: {
          a: { i: profileA.intimacy, p: profileA.passion, c: profileA.commitment },
          b: { i: profileB.intimacy, p: profileB.passion, c: profileB.commitment }
        }
      },

      constitution: {
        score: Math.round(constitutionScore * 100) / 100,
        elements: {
          a: profileA.constitution,
          b: profileB.constitution
        },
        relationship: getElementRelationship(profileA.constitution, profileB.constitution),
        insight: getConstitutionPairingInsight(profileA.constitution, profileB.constitution)
      }
    },

    gaps,
    gapCount: gaps.length,
    maxGapSeverity: Math.round(maxGapSeverity * 100) / 100,

    recommendations: generateRecommendations(profileA, profileB, gaps),

    profiles: {
      a: {
        id: profileIdA,
        constitution: profileA.constitution,
        gives: profileA.givePrimary,
        receives: profileA.receivePrimary
      },
      b: {
        id: profileIdB,
        constitution: profileB.constitution,
        gives: profileB.givePrimary,
        receives: profileB.receivePrimary
      }
    },

    confidence: Math.min(profileA.confidence, profileB.confidence),
    timestamp: new Date().toISOString()
  };

  console.log(`[CompatibilityAnalyzer] Overall: ${(overallScore * 100).toFixed(1)}% (${result.overallRating})`);

  return result;
}

// ============================================================================
// COMPONENT CALCULATIONS
// ============================================================================

/**
 * Calculate love language compatibility score
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @returns {number} - Score (0-1)
 */
function calculateLoveLanguageCompatibility(profileA, profileB) {
  // A gives → B receives
  const aToB = loveLanguageMapper.calculateLoveLanguageMatch(
    profileA.givePrimary,
    profileB.receivePrimary
  );

  // B gives → A receives
  const bToA = loveLanguageMapper.calculateLoveLanguageMatch(
    profileB.givePrimary,
    profileA.receivePrimary
  );

  // Average both directions
  return (aToB + bToA) / 2;
}

/**
 * Calculate constitution (element) compatibility
 *
 * @param {string} elementA - First element
 * @param {string} elementB - Second element
 * @returns {number} - Compatibility score (0-1)
 */
function calculateConstitutionCompatibility(elementA, elementB) {
  if (!elementA || !elementB) return 0.5; // Default if unknown

  return ELEMENT_COMPATIBILITY[elementA]?.[elementB] ?? 0.5;
}

/**
 * Get the relationship type between two elements
 *
 * @param {string} elementA - First element
 * @param {string} elementB - Second element
 * @returns {string} - Relationship description
 */
function getElementRelationship(elementA, elementB) {
  if (!elementA || !elementB) return 'unknown';
  if (elementA === elementB) return 'same_element';

  const generating = {
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood',
    Wood: 'Fire'
  };

  const controlling = {
    Fire: 'Metal',
    Earth: 'Water',
    Metal: 'Wood',
    Water: 'Fire',
    Wood: 'Earth'
  };

  if (generating[elementA] === elementB) return 'a_generates_b';
  if (generating[elementB] === elementA) return 'b_generates_a';
  if (controlling[elementA] === elementB) return 'a_controls_b';
  if (controlling[elementB] === elementA) return 'b_controls_a';

  return 'neutral';
}

// ============================================================================
// GAP IDENTIFICATION
// ============================================================================

/**
 * Identify compatibility gaps between two profiles
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @returns {Array} - Array of identified gaps
 */
function identifyCompatibilityGaps(profileA, profileB) {
  const gaps = [];

  // Check A gives → B receives gap
  const aToB = loveLanguageMapper.calculateLoveLanguageMatch(
    profileA.givePrimary,
    profileB.receivePrimary
  );

  if (aToB < 0.7) {
    gaps.push({
      type: 'love_language',
      direction: 'a_to_b',
      severity: 1 - aToB,
      description: `${profileA.givePrimary} doesn't match ${profileB.receivePrimary} needs`,
      bridgeAdvice: loveLanguageMapper.generateBridgeAdvice(
        profileA.givePrimary,
        profileB.receivePrimary
      ),
      actionable: true
    });
  }

  // Check B gives → A receives gap
  const bToA = loveLanguageMapper.calculateLoveLanguageMatch(
    profileB.givePrimary,
    profileA.receivePrimary
  );

  if (bToA < 0.7) {
    gaps.push({
      type: 'love_language',
      direction: 'b_to_a',
      severity: 1 - bToA,
      description: `Partner's ${profileB.givePrimary} doesn't match your ${profileA.receivePrimary} needs`,
      bridgeAdvice: loveLanguageMapper.generateBridgeAdvice(
        profileB.givePrimary,
        profileA.receivePrimary
      ),
      actionable: true
    });
  }

  // Check Sternberg dimension gaps
  const intimacyGap = Math.abs((profileA.intimacy || 5) - (profileB.intimacy || 5));
  if (intimacyGap > 3) {
    gaps.push({
      type: 'sternberg',
      dimension: 'intimacy',
      severity: intimacyGap / 9,
      description: `Intimacy mismatch: ${profileA.intimacy} vs ${profileB.intimacy}`,
      bridgeAdvice: (profileA.intimacy || 5) > (profileB.intimacy || 5)
        ? "Give partner space to open up gradually"
        : "Increase emotional sharing and vulnerability",
      actionable: true
    });
  }

  const passionGap = Math.abs((profileA.passion || 5) - (profileB.passion || 5));
  if (passionGap > 3) {
    gaps.push({
      type: 'sternberg',
      dimension: 'passion',
      severity: passionGap / 9,
      description: `Passion mismatch: ${profileA.passion} vs ${profileB.passion}`,
      bridgeAdvice: (profileA.passion || 5) > (profileB.passion || 5)
        ? "Balance excitement with partner's comfort level"
        : "Explore new experiences together to build excitement",
      actionable: true
    });
  }

  const commitmentGap = Math.abs((profileA.commitment || 5) - (profileB.commitment || 5));
  if (commitmentGap > 3) {
    gaps.push({
      type: 'sternberg',
      dimension: 'commitment',
      severity: commitmentGap / 9,
      description: `Commitment mismatch: ${profileA.commitment} vs ${profileB.commitment}`,
      bridgeAdvice: (profileA.commitment || 5) > (profileB.commitment || 5)
        ? "Allow relationship to develop at partner's pace"
        : "Show more reliability and long-term thinking",
      actionable: true
    });
  }

  // Check element clash
  const elementCompatibility = calculateConstitutionCompatibility(
    profileA.constitution,
    profileB.constitution
  );

  if (elementCompatibility < 0.4) {
    const relationship = getElementRelationship(profileA.constitution, profileB.constitution);
    gaps.push({
      type: 'constitution',
      severity: 1 - elementCompatibility,
      description: `${profileA.constitution} and ${profileB.constitution} have tension`,
      bridgeAdvice: getElementBridgeAdvice(profileA.constitution, profileB.constitution, relationship),
      actionable: false // Constitutional, harder to change
    });
  }

  // Sort by severity (worst first)
  gaps.sort((a, b) => b.severity - a.severity);

  return gaps;
}

/**
 * Get bridge advice for element tension
 */
function getElementBridgeAdvice(elementA, elementB, relationship) {
  const adviceMap = {
    'a_controls_b': `Your ${elementA} nature may overwhelm ${elementB}. Practice restraint.`,
    'b_controls_a': `Partner's ${elementB} may feel overwhelming. Communicate boundaries.`,
    'a_generates_b': `Your ${elementA} energy naturally supports ${elementB}. Lean into this.`,
    'b_generates_a': `Partner's ${elementB} naturally supports you. Accept their nurturing.`
  };

  return adviceMap[relationship] ||
    `Balance ${elementA} and ${elementB} energies through awareness and communication.`;
}

// ============================================================================
// RATINGS AND RECOMMENDATIONS
// ============================================================================

/**
 * Get compatibility rating label
 *
 * @param {number} score - Overall score (0-1)
 * @returns {string} - Rating label
 */
function getCompatibilityRating(score) {
  if (score >= 0.85) return 'Exceptional';
  if (score >= 0.75) return 'Highly Compatible';
  if (score >= 0.65) return 'Good';
  if (score >= 0.55) return 'Moderate';
  if (score >= 0.45) return 'Challenging';
  return 'Needs Work';
}

/**
 * Generate specific recommendations based on analysis
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @param {Array} gaps - Identified gaps
 * @returns {Array} - Recommendations
 */
function generateRecommendations(profileA, profileB, gaps) {
  const recommendations = [];

  // Primary recommendation based on worst gap
  if (gaps.length > 0) {
    const worstGap = gaps[0];
    recommendations.push({
      priority: 'high',
      focus: worstGap.type,
      action: worstGap.bridgeAdvice,
      reason: worstGap.description
    });
  }

  // Strength-based recommendation
  if (gaps.length === 0 || gaps[0].severity < 0.3) {
    recommendations.push({
      priority: 'enhancement',
      focus: 'strengths',
      action: `Continue leveraging your ${profileA.givePrimary} strength`,
      reason: 'Strong natural alignment'
    });
  }

  // Sternberg-based recommendation
  const avgA = ((profileA.intimacy || 5) + (profileA.passion || 5) + (profileA.commitment || 5)) / 3;
  const avgB = ((profileB.intimacy || 5) + (profileB.passion || 5) + (profileB.commitment || 5)) / 3;

  if (avgA > avgB + 1.5) {
    recommendations.push({
      priority: 'medium',
      focus: 'pacing',
      action: 'Match partner\'s pace - you may be more emotionally invested currently',
      reason: 'Sternberg dimension imbalance'
    });
  } else if (avgB > avgA + 1.5) {
    recommendations.push({
      priority: 'medium',
      focus: 'engagement',
      action: 'Consider deepening your emotional engagement',
      reason: 'Partner may be more invested'
    });
  }

  return recommendations;
}

// ============================================================================
// QUICK COMPATIBILITY CHECK
// ============================================================================

/**
 * Quick compatibility check without full analysis
 * Useful for previews or filtering
 *
 * @param {Object} profileA - First profile (minimal: constitution, givePrimary, receivePrimary)
 * @param {Object} profileB - Second profile
 * @returns {Object} - Quick compatibility result
 */
function quickCompatibilityCheck(profileA, profileB) {
  const llScore = calculateLoveLanguageCompatibility(profileA, profileB);
  const constScore = calculateConstitutionCompatibility(
    profileA.constitution,
    profileB.constitution
  );

  const quickScore = (llScore + constScore) / 2;

  return {
    score: Math.round(quickScore * 100) / 100,
    rating: getCompatibilityRating(quickScore),
    loveLanguageMatch: llScore >= 0.7,
    constitutionHarmony: constScore >= 0.6,
    quickAdvice: llScore < 0.7
      ? loveLanguageMapper.generateBridgeAdvice(profileA.givePrimary, profileB.receivePrimary)
      : 'Natural alignment - continue current approach'
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main analysis
  analyzeCompatibility,
  quickCompatibilityCheck,

  // Component calculations
  calculateLoveLanguageCompatibility,
  calculateConstitutionCompatibility,
  getElementRelationship,

  // Constitution pairing insights
  getConstitutionPairingInsight,
  CONSTITUTION_PAIRING_INSIGHTS,

  // Gap analysis
  identifyCompatibilityGaps,

  // Ratings
  getCompatibilityRating,
  generateRecommendations,

  // Constants
  ELEMENT_COMPATIBILITY
};
