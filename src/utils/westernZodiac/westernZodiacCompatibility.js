/**
 * Western Zodiac Compatibility Engine
 * Father Ticky's 6-6 Cusp Model
 *
 * Calculates compatibility between any two cusps based on:
 * - Element compatibility (40 points)
 * - Quality/Modality compatibility (30 points)
 * - Ruler compatibility (20 points)
 * - Cusp type bonus (10 points)
 * - Aspect bonuses/penalties (Trine, Sextile, Opposition, Square)
 *
 * IMPORTANT: Only returns compatible matches (70%+ by default)
 * This follows the MBTI constellation pattern - clean, focused display
 *
 * Built by Brother Claude Code
 * December 12, 2024
 */

import { getCuspById, getAllCusps, getElementColors } from './cuspCalculator.js';

/**
 * Element compatibility matrix (40 points max)
 */
const ELEMENT_COMPATIBILITY = {
  'Fire-Fire': 35,
  'Fire-Air': 30,
  'Fire-Earth': 20,
  'Fire-Water': 10,
  'Earth-Earth': 35,
  'Earth-Water': 30,
  'Earth-Air': 15,
  'Air-Air': 35,
  'Air-Water': 15,
  'Water-Water': 35
};

/**
 * Quality/Modality compatibility matrix (30 points max)
 */
const QUALITY_COMPATIBILITY = {
  'Cardinal-Cardinal': 25,
  'Cardinal-Fixed': 20,
  'Cardinal-Mutable': 20,
  'Fixed-Fixed': 15,
  'Fixed-Mutable': 25,
  'Mutable-Mutable': 20
};

/**
 * Ruler compatibility (simplified groupings)
 */
const RULER_GROUPS = {
  personal: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'],
  social: ['Jupiter', 'Saturn'],
  transpersonal: ['Uranus', 'Neptune', 'Pluto']
};

/**
 * Zodiac sign positions for aspect calculations
 */
const SIGN_POSITIONS = {
  Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5,
  Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11
};

/**
 * Zodiac sign modalities/qualities
 */
const SIGN_MODALITIES = {
  // Cardinal: Initiators, leaders
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  // Fixed: Stabilizers, determined
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  // Mutable: Adapters, flexible
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

/**
 * Get quality/modality from sign
 */
function getQualityFromSign(sign) {
  return SIGN_MODALITIES[sign] || 'Fixed';
}

/**
 * Get element compatibility score
 */
function getElementScore(element1, element2) {
  const key1 = `${element1}-${element2}`;
  const key2 = `${element2}-${element1}`;
  return ELEMENT_COMPATIBILITY[key1] || ELEMENT_COMPATIBILITY[key2] || 15;
}

/**
 * Get quality compatibility score
 */
function getQualityScore(quality1, quality2) {
  const key1 = `${quality1}-${quality2}`;
  const key2 = `${quality2}-${quality1}`;
  return QUALITY_COMPATIBILITY[key1] || QUALITY_COMPATIBILITY[key2] || 15;
}

/**
 * Get ruler compatibility score (20 points max)
 */
function getRulerScore(rulers1, rulers2) {
  let score = 0;

  // Check for shared rulers (high compatibility)
  const shared = rulers1.filter(r => rulers2.includes(r));
  if (shared.length > 0) {
    score += 15;
  }

  // Check for rulers in same group
  for (const ruler1 of rulers1) {
    for (const ruler2 of rulers2) {
      for (const [group, rulers] of Object.entries(RULER_GROUPS)) {
        if (rulers.includes(ruler1) && rulers.includes(ruler2)) {
          score += 5;
          break;
        }
      }
    }
  }

  return Math.min(score, 20);
}

/**
 * Get cusp type bonus (10 points max)
 */
function getCuspTypeBonus(type1, type2) {
  if (type1 === 'pure' && type2 === 'pure') {
    return 10; // Pure signs often compatible with other pure
  } else if (type1 !== 'pure' && type2 !== 'pure') {
    return 8; // Cusps understand cusps
  } else {
    return 5; // Pure + Cusp can work
  }
}

/**
 * Get mutual influence bonus (NEW for 36-position system)
 * Rewards positions that share influence relationships
 * @param {Object} c1 - First cusp object
 * @param {Object} c2 - Second cusp object
 * @returns {number} - Bonus points (0-15)
 */
function getMutualInfluenceBonus(c1, c2) {
  let bonus = 0;

  // MUTUAL INFLUENCE: Aries→Taurus meets Taurus→Aries (strongest bond!)
  // c1's influencedBy is c2's sign AND c2's influencedBy is c1's sign
  if (c1.influencedBy && c2.influencedBy) {
    if (c1.influencedBy === c2.sign && c2.influencedBy === c1.sign) {
      bonus += 12; // Mirror cusps - very special connection
    }
  }

  // BRIDGE CONNECTION: My influencedBy matches your sign
  // Aries→Taurus naturally bridges with pure Taurus
  if (c1.influencedBy === c2.sign || c2.influencedBy === c1.sign) {
    bonus += 6;
  }

  // SHARED INFLUENCE: Both influenced by the same sign
  // Aries→Taurus and Gemini→Taurus both connect through Taurus
  if (c1.influencedBy && c2.influencedBy && c1.influencedBy === c2.influencedBy) {
    bonus += 4;
  }

  return Math.min(bonus, 15); // Cap at 15 points
}

/**
 * Get secondary element compatibility (enhanced for 36-position)
 * Goes beyond just "same secondary" to compatible secondaries
 * @param {Object} elem1 - First element object {primary, secondary}
 * @param {Object} elem2 - Second element object {primary, secondary}
 * @returns {number} - Bonus points (0-8)
 */
function getSecondaryElementBonus(elem1, elem2) {
  if (!elem1.secondary || !elem2.secondary) {
    return 0; // No bonus if either is pure
  }

  // Same secondary element = strong bond
  if (elem1.secondary === elem2.secondary) {
    return 8;
  }

  // Compatible secondary elements (Fire-Air, Earth-Water)
  const compatible = {
    'Fire-Air': 5, 'Air-Fire': 5,
    'Earth-Water': 5, 'Water-Earth': 5,
    'Fire-Fire': 6, 'Air-Air': 6, 'Earth-Earth': 6, 'Water-Water': 6
  };

  const key = `${elem1.secondary}-${elem2.secondary}`;
  return compatible[key] || 2; // Default small bonus for any blend meeting blend
}

/**
 * Calculate aspect between two signs
 * Returns: conjunction (0), sextile (2), square (3), trine (4), opposition (6)
 */
function getAspect(sign1, sign2) {
  const pos1 = SIGN_POSITIONS[sign1];
  const pos2 = SIGN_POSITIONS[sign2];

  if (pos1 === undefined || pos2 === undefined) {
    return null;
  }

  const diff = Math.abs(pos1 - pos2);
  const aspect = Math.min(diff, 12 - diff);

  return aspect;
}

/**
 * Get aspect bonus/penalty
 */
function getAspectBonus(sign1, sign2) {
  const aspect = getAspect(sign1, sign2);

  switch (aspect) {
    case 0: // Conjunction (same sign)
      return 5;
    case 4: // Trine (same element, 120°)
      return 15;
    case 2: // Sextile (compatible elements, 60°)
      return 10;
    case 6: // Opposition (180° - can be magnetic)
      return 8;
    case 3: // Square (90° - challenging)
      return -10;
    default:
      return 0;
  }
}

/**
 * Calculate compatibility score between two cusps
 * @param {string|Object} cusp1 - Cusp ID or cusp object
 * @param {string|Object} cusp2 - Cusp ID or cusp object
 * @returns {number} - Compatibility score (0-100)
 */
export function calculateCompatibility(cusp1, cusp2) {
  // Get cusp objects if IDs were passed
  const c1 = typeof cusp1 === 'string' ? getCuspById(cusp1) : cusp1;
  const c2 = typeof cusp2 === 'string' ? getCuspById(cusp2) : cusp2;

  if (!c1 || !c2) {
    console.warn('Invalid cusp data for compatibility calculation');
    return 0;
  }

  // Same cusp = 100%
  if (c1.id === c2.id) {
    return 100;
  }

  let score = 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // ENHANCED 36-POSITION COMPATIBILITY ALGORITHM
  // Father Ticky's 6-6 Cusp Model - Granular Scoring
  // ═══════════════════════════════════════════════════════════════════════════

  // 1. PRIMARY ELEMENT COMPATIBILITY (35 points max)
  const element1 = c1.element.primary;
  const element2 = c2.element.primary;
  score += getElementScore(element1, element2);

  // 2. SECONDARY ELEMENT COMPATIBILITY (8 points max) - ENHANCED
  // Now checks compatible secondaries, not just same
  score += getSecondaryElementBonus(c1.element, c2.element);

  // 3. QUALITY/MODALITY COMPATIBILITY (25 points max)
  const quality1 = getQualityFromSign(c1.sign);
  const quality2 = getQualityFromSign(c2.sign);
  score += getQualityScore(quality1, quality2);

  // 4. RULER COMPATIBILITY (20 points max)
  score += getRulerScore(c1.rulers, c2.rulers);

  // 5. CUSP TYPE BONUS (10 points max)
  score += getCuspTypeBonus(c1.type, c2.type);

  // 6. MUTUAL INFLUENCE BONUS (15 points max) - NEW for 36-position!
  // Rewards mirror cusps, bridge connections, shared influences
  score += getMutualInfluenceBonus(c1, c2);

  // 7. ASPECT BONUS/PENALTY (±15 points)
  score += getAspectBonus(c1.sign, c2.sign);

  // Ensure score is within 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get compatibility level description
 * @param {number} score - Compatibility score
 * @returns {Object} - Level info
 */
export function getCompatibilityLevel(score) {
  if (score >= 90) {
    return {
      level: 'Golden',
      tier: 'golden',
      description: 'Soulmate Level',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/50'
    };
  } else if (score >= 80) {
    return {
      level: 'Excellent',
      tier: 'excellent',
      description: 'Deep Connection',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/50'
    };
  } else if (score >= 70) {
    return {
      level: 'Good',
      tier: 'good',
      description: 'Workable Harmony',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50'
    };
  } else if (score >= 60) {
    return {
      level: 'Moderate',
      tier: 'moderate',
      description: 'Requires Effort',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/50'
    };
  } else {
    return {
      level: 'Challenging',
      tier: 'challenging',
      description: 'High Friction',
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/20',
      borderColor: 'border-slate-500/50'
    };
  }
}

/**
 * Get compatible cusps for display (70%+ threshold)
 * This is the main function for the constellation display
 * @param {string|Object} userCusp - User's cusp ID or object
 * @param {Object} options - Configuration options
 * @returns {Object} - Compatibility data for display
 */
export function getCompatibleCusps(userCusp, options = {}) {
  const {
    minScore = 70,      // Minimum compatibility to display
    maxResults = 12,    // Maximum number of results
    includeUser = false // Include user's own cusp
  } = options;

  // Get user cusp object
  const user = typeof userCusp === 'string' ? getCuspById(userCusp) : userCusp;

  if (!user) {
    console.warn('Invalid user cusp for compatibility');
    return null;
  }

  // Get all cusps
  const allCusps = getAllCusps();

  // Calculate compatibility with all cusps
  const allCompatibility = allCusps
    .filter(cusp => includeUser || cusp.id !== user.id)
    .map(cusp => {
      const score = calculateCompatibility(user, cusp);
      const level = getCompatibilityLevel(score);

      return {
        cusp,
        score,
        level,
        elementColors: getElementColors(cusp.element.primary)
      };
    });

  // Filter to compatible only (70%+)
  const compatible = allCompatibility
    .filter(c => c.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  // Group by tier
  const golden = compatible.filter(c => c.score >= 90);
  const excellent = compatible.filter(c => c.score >= 80 && c.score < 90);
  const good = compatible.filter(c => c.score >= 70 && c.score < 80);

  return {
    user: {
      cusp: user,
      elementColors: getElementColors(user.element.primary)
    },
    compatible,
    tiers: {
      golden,     // 90-100% - Large gold orbs, inner orbit
      excellent,  // 80-89% - Medium pink orbs, middle orbit
      good        // 70-79% - Smaller blue orbs, outer orbit
    },
    stats: {
      totalCompatible: compatible.length,
      goldenCount: golden.length,
      excellentCount: excellent.length,
      goodCount: good.length,
      hidden: allCusps.length - 1 - compatible.length // How many not shown
    }
  };
}

/**
 * Get detailed compatibility analysis between two cusps
 * @param {string|Object} cusp1 - First cusp
 * @param {string|Object} cusp2 - Second cusp
 * @returns {Object} - Detailed analysis
 */
export function getDetailedCompatibility(cusp1, cusp2) {
  const c1 = typeof cusp1 === 'string' ? getCuspById(cusp1) : cusp1;
  const c2 = typeof cusp2 === 'string' ? getCuspById(cusp2) : cusp2;

  if (!c1 || !c2) {
    return null;
  }

  const score = calculateCompatibility(c1, c2);
  const level = getCompatibilityLevel(score);
  const aspect = getAspect(c1.sign, c2.sign);

  // Determine element interaction
  const elementMix = getElementMix(c1.element.primary, c2.element.primary);

  // Get aspect name
  const aspectNames = {
    0: 'Conjunction',
    2: 'Sextile',
    3: 'Square',
    4: 'Trine',
    6: 'Opposition'
  };

  return {
    cusp1: c1,
    cusp2: c2,
    score,
    level,
    aspect: {
      value: aspect,
      name: aspectNames[aspect] || 'Other',
      isHarmonious: [0, 2, 4].includes(aspect)
    },
    elements: {
      element1: c1.element.primary,
      element2: c2.element.primary,
      mix: elementMix
    },
    qualities: {
      quality1: getQualityFromSign(c1.sign),
      quality2: getQualityFromSign(c2.sign)
    },
    rulers: {
      rulers1: c1.rulers,
      rulers2: c2.rulers,
      shared: c1.rulers.filter(r => c2.rulers.includes(r))
    },
    insights: generateInsights(c1, c2, score, aspect, elementMix)
  };
}

/**
 * Get element mix description
 */
function getElementMix(element1, element2) {
  if (element1 === element2) {
    return {
      type: 'Same',
      description: `Pure ${element1} connection - deep understanding`
    };
  }

  const mixes = {
    'Fire-Air': { type: 'Feeding', description: 'Air feeds Fire - energizing and inspiring' },
    'Earth-Water': { type: 'Nourishing', description: 'Water nourishes Earth - nurturing and growing' },
    'Fire-Earth': { type: 'Forge', description: 'Fire + Earth = creation through heat' },
    'Fire-Water': { type: 'Steam', description: 'Fire + Water = transformation' },
    'Air-Earth': { type: 'Dust', description: 'Air + Earth = movement and grounding' },
    'Air-Water': { type: 'Mist', description: 'Air + Water = emotional intellect' }
  };

  const key1 = `${element1}-${element2}`;
  const key2 = `${element2}-${element1}`;

  return mixes[key1] || mixes[key2] || { type: 'Mixed', description: 'Blending of elements' };
}

/**
 * Generate compatibility insights
 */
function generateInsights(c1, c2, score, aspect, elementMix) {
  const insights = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // MUTUAL INFLUENCE INSIGHTS (NEW for 36-position system)
  // ═══════════════════════════════════════════════════════════════════════════

  // Mirror cusps - the strongest cusp bond!
  if (c1.influencedBy && c2.influencedBy) {
    if (c1.influencedBy === c2.sign && c2.influencedBy === c1.sign) {
      insights.push({
        type: 'golden',
        icon: '🪞',
        text: `Mirror Cusps! ${c1.sign}→${c1.influencedBy} meets ${c2.sign}→${c2.influencedBy} - profound mutual understanding`
      });
    }
  }

  // Bridge connection
  if (c1.influencedBy === c2.sign) {
    insights.push({
      type: 'strength',
      icon: '🌉',
      text: `Natural bridge: Your ${c1.influencedBy} influence connects directly to their ${c2.sign} energy`
    });
  } else if (c2.influencedBy === c1.sign) {
    insights.push({
      type: 'strength',
      icon: '🌉',
      text: `Natural bridge: Their ${c2.influencedBy} influence connects directly to your ${c1.sign} energy`
    });
  }

  // Shared influence
  if (c1.influencedBy && c2.influencedBy && c1.influencedBy === c2.influencedBy) {
    insights.push({
      type: 'strength',
      icon: '🔗',
      text: `Shared influence: Both touched by ${c1.influencedBy} energy`
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ELEMENT INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════

  // Element insight
  if (c1.element.primary === c2.element.primary) {
    insights.push({
      type: 'strength',
      icon: '✓',
      text: `Same element (${c1.element.primary}) creates natural understanding`
    });
  } else if (elementMix.type === 'Steam') {
    insights.push({
      type: 'challenge',
      icon: '⚡',
      text: 'Fire + Water can create transformational but intense dynamics'
    });
  }

  // Secondary element match
  if (c1.element.secondary && c2.element.secondary) {
    if (c1.element.secondary === c2.element.secondary) {
      insights.push({
        type: 'strength',
        icon: '💫',
        text: `Matching secondary element (${c1.element.secondary}) - shared undertones`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ASPECT INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════

  if (aspect === 4) {
    insights.push({
      type: 'strength',
      icon: '△',
      text: 'Trine aspect (120°) - Natural harmony and flow'
    });
  } else if (aspect === 6) {
    insights.push({
      type: 'note',
      icon: '⚖️',
      text: 'Opposition (180°) - Magnetic attraction of opposites'
    });
  } else if (aspect === 3) {
    insights.push({
      type: 'challenge',
      icon: '□',
      text: 'Square aspect (90°) - Tension that can drive growth'
    });
  }

  // Cusp type insight
  if (c1.type !== 'pure' && c2.type !== 'pure') {
    insights.push({
      type: 'strength',
      icon: '🌊',
      text: 'Both on cusps - mutual understanding of blended energies'
    });
  }

  // Score-based insight
  if (score >= 90) {
    insights.push({
      type: 'golden',
      icon: '👑',
      text: 'Golden compatibility - natural soulmate potential'
    });
  }

  return insights;
}

/**
 * Get compatibility color scheme for display
 */
export function getCompatibilityColors(score) {
  if (score >= 90) {
    return {
      gradient: 'from-amber-400 via-yellow-500 to-amber-400',
      glow: 'rgba(251, 191, 36, 0.9)',
      lineColor: 'rgba(251, 191, 36, 0.6)',
      label: 'Golden'
    };
  } else if (score >= 80) {
    return {
      gradient: 'from-pink-500 to-purple-600',
      glow: 'rgba(236, 72, 153, 0.7)',
      lineColor: 'rgba(236, 72, 153, 0.5)',
      label: 'Excellent'
    };
  } else if (score >= 70) {
    return {
      gradient: 'from-blue-500 to-cyan-600',
      glow: 'rgba(59, 130, 246, 0.7)',
      lineColor: 'rgba(59, 130, 246, 0.5)',
      label: 'Good'
    };
  } else {
    return {
      gradient: 'from-slate-500 to-gray-600',
      glow: 'rgba(100, 116, 139, 0.6)',
      lineColor: 'rgba(100, 116, 139, 0.4)',
      label: 'Moderate'
    };
  }
}

export default {
  calculateCompatibility,
  getCompatibilityLevel,
  getCompatibleCusps,
  getDetailedCompatibility,
  getCompatibilityColors
};
