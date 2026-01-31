/**
 * Fate vs Choice Index Engine
 *
 * Based on Liz Greene's "The Astrology of Fate" — computing a score
 * that indicates the balance between fated/karmic elements and
 * free will/choice elements in a chart.
 *
 * Score interpretation:
 * - 0-30: Strong fate influence (significant karmic weight)
 * - 31-50: Fate-leaning (karmic lessons prominent)
 * - 51-70: Choice-leaning (free will dominant)
 * - 71-100: Strong choice influence (maximum free will)
 *
 * Factors that increase FATE score:
 * - Angular Saturn, Pluto, or Nodes
 * - Tight Saturn/Pluto/Node aspects to personal planets
 * - Fixed signs emphasis
 * - 8th and 12th house emphasis
 *
 * Factors that increase CHOICE score:
 * - Mutable signs emphasis
 * - Strong Jupiter/Uranus
 * - 1st and 9th house emphasis
 * - Loose aspects to fate planets
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// SCORING WEIGHTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fate planets - these increase fate score when prominent
 */
const FATE_PLANETS = ['Saturn', 'Pluto', 'North Node', 'South Node'];

/**
 * Choice planets - these increase choice score when prominent
 */
const CHOICE_PLANETS = ['Jupiter', 'Uranus', 'Sun', 'Mars'];

/**
 * Sign modality weights
 */
const MODALITY_FATE_WEIGHTS = {
  Fixed: 15,      // Fixed signs increase fate (Taurus, Leo, Scorpio, Aquarius)
  Cardinal: 0,    // Cardinal signs are neutral
  Mutable: -15    // Mutable signs decrease fate / increase choice
};

/**
 * House fate weights (fate-increasing houses)
 */
const HOUSE_FATE_WEIGHTS = {
  1: -5,   // Identity - more choice
  2: 0,    // Values - neutral
  3: -5,   // Communication - more choice
  4: 10,   // Roots/Family - more fate
  5: -5,   // Creativity - more choice
  6: 5,    // Service - slight fate (karma of duty)
  7: 10,   // Partnership - karmic contracts
  8: 20,   // Transformation - strong fate
  9: -10,  // Philosophy - strong choice
  10: 5,   // Career - slight fate (dharma)
  11: -5,  // Community - more choice
  12: 20   // Unconscious/Past Lives - strong fate
};

/**
 * Aspect orb weights (tighter = more fate influence)
 */
const ORB_FATE_MULTIPLIERS = {
  exact: 2.0,     // Within 1 degree
  tight: 1.5,     // Within 3 degrees
  moderate: 1.0,  // Within 5 degrees
  loose: 0.5,     // Within 8 degrees
  wide: 0.25      // Beyond 8 degrees
};

/**
 * Aspect type weights for fate planets
 */
const ASPECT_FATE_WEIGHTS = {
  conjunction: 20,
  opposition: 15,
  square: 15,
  trine: 5,
  sextile: 3,
  quincunx: 10  // Fated adjustment aspect
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get sign modality
 */
function getModality(sign) {
  const fixed = ['Taurus', 'Leo', 'Scorpio', 'Aquarius'];
  const cardinal = ['Aries', 'Cancer', 'Libra', 'Capricorn'];
  const mutable = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];

  if (fixed.includes(sign)) return 'Fixed';
  if (cardinal.includes(sign)) return 'Cardinal';
  if (mutable.includes(sign)) return 'Mutable';
  return null;
}

/**
 * Check if a planet is a fate planet
 */
function isFatePlanet(planetName) {
  return FATE_PLANETS.some(fp =>
    planetName?.toLowerCase().includes(fp.toLowerCase())
  );
}

/**
 * Check if a planet is a choice planet
 */
function isChoicePlanet(planetName) {
  return CHOICE_PLANETS.some(cp =>
    planetName?.toLowerCase().includes(cp.toLowerCase())
  );
}

/**
 * Get orb category
 */
function getOrbCategory(orb) {
  if (orb === undefined || orb === null) return 'moderate';
  if (orb <= 1) return 'exact';
  if (orb <= 3) return 'tight';
  if (orb <= 5) return 'moderate';
  if (orb <= 8) return 'loose';
  return 'wide';
}

/**
 * Check if a planet is angular (houses 1, 4, 7, 10)
 */
function isAngular(house) {
  return [1, 4, 7, 10].includes(house);
}

/**
 * Normalize score to 0-100 range
 */
function normalizeScore(rawScore, min, max) {
  const normalized = ((rawScore - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized));
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute the Fate vs Choice Index from chart data
 *
 * @param {Object} chart - Chart object with:
 *   - planets: Array of { name, sign, house }
 *   - aspects: Array of { p1/planet1, p2/planet2, type, orb }
 * @returns {Object} Fate Choice Index profile
 */
export function computeFateChoiceIndex(chart) {
  if (!chart || !chart.planets) {
    return null;
  }

  let fateScore = 50; // Start at neutral
  const factors = [];

  // Extract planets
  const planets = Array.isArray(chart.planets)
    ? chart.planets
    : Object.entries(chart.planets).map(([name, data]) => ({
        name,
        sign: data.sign || data.Sign,
        house: data.house || data.House
      }));

  // ═══════════════════════════════════════════════════════════════════════
  // 1. FATE PLANET PROMINENCE
  // ═══════════════════════════════════════════════════════════════════════

  for (const planet of planets) {
    const name = planet.name || planet.planet;
    const house = planet.house || planet.House;
    const sign = planet.sign || planet.Sign;

    // Check fate planets in angular houses
    if (isFatePlanet(name) && isAngular(house)) {
      const factor = {
        type: 'angular_fate_planet',
        planet: name,
        house,
        points: 15,
        description: `${name} angular in house ${house} — strong karmic signature`
      };
      fateScore += 15;
      factors.push(factor);
    }

    // Check choice planets angular
    if (isChoicePlanet(name) && isAngular(house)) {
      const factor = {
        type: 'angular_choice_planet',
        planet: name,
        house,
        points: -10,
        description: `${name} angular in house ${house} — strong free will signature`
      };
      fateScore -= 10;
      factors.push(factor);
    }

    // Check fate houses (8th, 12th)
    if (house === 8 || house === 12) {
      const isFate = isFatePlanet(name);
      const points = isFate ? 10 : 5;
      const factor = {
        type: 'fate_house_planet',
        planet: name,
        house,
        points,
        description: `${name} in ${house === 8 ? '8th' : '12th'} house — karmic weight`
      };
      fateScore += points;
      factors.push(factor);
    }

    // Check sign modality
    if (sign) {
      const modality = getModality(sign);
      if (modality && isFatePlanet(name)) {
        const points = MODALITY_FATE_WEIGHTS[modality];
        if (points !== 0) {
          const factor = {
            type: 'fate_planet_modality',
            planet: name,
            sign,
            modality,
            points,
            description: `${name} in ${modality} sign ${sign}`
          };
          fateScore += points;
          factors.push(factor);
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. ASPECT ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════

  if (chart.aspects && Array.isArray(chart.aspects)) {
    for (const aspect of chart.aspects) {
      const p1 = aspect.p1 || aspect.planet1 || '';
      const p2 = aspect.p2 || aspect.planet2 || '';
      const type = (aspect.type || aspect.aspectType || '').toLowerCase();
      const orb = aspect.orb;

      // Check if this involves a fate planet
      const involvesFate = isFatePlanet(p1) || isFatePlanet(p2);

      if (involvesFate) {
        const baseWeight = ASPECT_FATE_WEIGHTS[type] || 5;
        const orbMultiplier = ORB_FATE_MULTIPLIERS[getOrbCategory(orb)] || 1.0;
        const points = Math.round(baseWeight * orbMultiplier);

        const factor = {
          type: 'fate_aspect',
          aspect: `${p1}-${p2}`,
          aspectType: type,
          orb,
          points,
          description: `${p1}-${p2} ${type} (${orb ? orb.toFixed(1) + '°' : 'no orb'}) — karmic aspect`
        };
        fateScore += points;
        factors.push(factor);
      }

      // Check if this involves choice planets
      const involvesChoice = isChoicePlanet(p1) || isChoicePlanet(p2);

      if (involvesChoice && !involvesFate) {
        const baseWeight = ASPECT_FATE_WEIGHTS[type] || 5;
        const orbMultiplier = ORB_FATE_MULTIPLIERS[getOrbCategory(orb)] || 1.0;
        const points = -Math.round((baseWeight * orbMultiplier) * 0.5);

        const factor = {
          type: 'choice_aspect',
          aspect: `${p1}-${p2}`,
          aspectType: type,
          orb,
          points,
          description: `${p1}-${p2} ${type} — free will aspect`
        };
        fateScore += points;
        factors.push(factor);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. NORMALIZE AND CATEGORIZE
  // ═══════════════════════════════════════════════════════════════════════

  // Clamp to 0-100
  fateScore = Math.max(0, Math.min(100, fateScore));

  // Invert so higher = more choice (more intuitive for "free will")
  const choiceScore = 100 - fateScore;

  // Determine category
  let category;
  if (fateScore >= 71) {
    category = {
      name: 'Strong Fate',
      description: 'Significant karmic weight in this chart',
      interpretation: 'Life presents powerful fated circumstances that demand growth'
    };
  } else if (fateScore >= 51) {
    category = {
      name: 'Fate-Leaning',
      description: 'Karmic lessons are prominent',
      interpretation: 'Life offers clear karmic curriculum with meaningful challenges'
    };
  } else if (fateScore >= 31) {
    category = {
      name: 'Choice-Leaning',
      description: 'Free will is more prominent',
      interpretation: 'Life offers more flexibility and self-determination'
    };
  } else {
    category = {
      name: 'Strong Choice',
      description: 'Maximum free will potential',
      interpretation: 'Life presents wide-open possibilities with minimal karmic constraint'
    };
  }

  // Generate interpretation
  const interpretation = generateInterpretation(fateScore, factors);

  return {
    // Scores
    fateScore,
    choiceScore,

    // Category
    category,

    // All factors that contributed
    factors,

    // Detailed breakdown
    breakdown: {
      angularFatePlanets: factors.filter(f => f.type === 'angular_fate_planet'),
      angularChoicePlanets: factors.filter(f => f.type === 'angular_choice_planet'),
      fateHousePlanets: factors.filter(f => f.type === 'fate_house_planet'),
      fateAspects: factors.filter(f => f.type === 'fate_aspect'),
      choiceAspects: factors.filter(f => f.type === 'choice_aspect')
    },

    // Interpretation
    interpretation,

    // Summary for UI
    summary: {
      fateScore,
      choiceScore,
      categoryName: category.name,
      dominantFactors: factors.sort((a, b) => Math.abs(b.points) - Math.abs(a.points)).slice(0, 3)
    },

    // Metadata
    metadata: {
      totalFactors: factors.length,
      fateFactors: factors.filter(f => f.points > 0).length,
      choiceFactors: factors.filter(f => f.points < 0).length
    }
  };
}

/**
 * Generate interpretation text
 */
function generateInterpretation(fateScore, factors) {
  const dominantFate = factors
    .filter(f => f.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 2);

  const dominantChoice = factors
    .filter(f => f.points < 0)
    .sort((a, b) => a.points - b.points)
    .slice(0, 2);

  let opening;
  if (fateScore >= 70) {
    opening = "Your chart carries significant karmic weight. This isn't limitation — it's curriculum.";
  } else if (fateScore >= 50) {
    opening = "Your chart shows meaningful fate patterns alongside real freedom.";
  } else if (fateScore >= 30) {
    opening = "Your chart emphasizes choice and self-determination.";
  } else {
    opening = "Your chart shows minimal karmic constraint — life is largely what you make of it.";
  }

  const fateFactors = dominantFate.length > 0
    ? `Key fate signatures: ${dominantFate.map(f => f.description).join('; ')}.`
    : 'No dominant fate factors detected.';

  const choiceFactors = dominantChoice.length > 0
    ? `Key choice signatures: ${dominantChoice.map(f => f.description).join('; ')}.`
    : 'No dominant choice factors detected.';

  return {
    opening,
    fateAnalysis: fateFactors,
    choiceAnalysis: choiceFactors,
    closing: "Remember: even the strongest fate patterns include choice in how we respond."
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the fate score (quick lookup)
 * @param {Object} chart - Chart object
 * @returns {number} Fate score 0-100
 */
export function getFateScore(chart) {
  const result = computeFateChoiceIndex(chart);
  return result?.fateScore || 50;
}

/**
 * Get just the choice score (quick lookup)
 * @param {Object} chart - Chart object
 * @returns {number} Choice score 0-100
 */
export function getChoiceScore(chart) {
  const result = computeFateChoiceIndex(chart);
  return result?.choiceScore || 50;
}

/**
 * Get fate category name
 * @param {Object} chart - Chart object
 * @returns {string} Category name
 */
export function getFateCategory(chart) {
  const result = computeFateChoiceIndex(chart);
  return result?.category?.name || 'Unknown';
}

/**
 * Check if chart is fate-dominant
 * @param {Object} chart - Chart object
 * @returns {boolean} True if fate score >= 50
 */
export function isFateDominant(chart) {
  return getFateScore(chart) >= 50;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  computeFateChoiceIndex,
  getFateScore,
  getChoiceScore,
  getFateCategory,
  isFateDominant,
  // Re-export weights for customization
  FATE_PLANETS,
  CHOICE_PLANETS,
  HOUSE_FATE_WEIGHTS,
  ASPECT_FATE_WEIGHTS
};
