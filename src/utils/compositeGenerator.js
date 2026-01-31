/**
 * Composite Chart Generator
 *
 * Based on Liz Greene's concept of the Composite Chart as "the third psyche" —
 * not just mathematical midpoints, but the living organism that emerges when
 * two people create relationship.
 *
 * The composite chart shows:
 * - What the relationship IS (not what each person brings)
 * - The relationship's own psychology, needs, and potential
 * - The "child" born from two souls meeting
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// ZODIAC CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'North Node', 'South Node', 'Chiron', 'Ascendant', 'Midheaven'
];

// ═══════════════════════════════════════════════════════════════════════════
// MIDPOINT CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate the midpoint between two degrees on the zodiac
 * Uses the "near" midpoint (shorter arc) as is standard in composite charts
 *
 * @param {number} degA - First degree (0-360)
 * @param {number} degB - Second degree (0-360)
 * @returns {number} Midpoint degree (0-360)
 */
function calculateMidpoint(degA, degB) {
  // Normalize both degrees to 0-360
  const a = ((degA % 360) + 360) % 360;
  const b = ((degB % 360) + 360) % 360;

  // Calculate the difference
  let diff = Math.abs(a - b);

  // Find the midpoint on the shorter arc
  let midpoint;
  if (diff <= 180) {
    // Direct midpoint
    midpoint = (a + b) / 2;
  } else {
    // Midpoint crosses 0°
    midpoint = (a + b) / 2 + 180;
  }

  // Normalize result
  return ((midpoint % 360) + 360) % 360;
}

/**
 * Get the zodiac sign from a degree
 * @param {number} degree - Degree on zodiac (0-360)
 * @returns {string} Sign name
 */
function getSignFromDegree(degree) {
  const normalized = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  return SIGNS[signIndex];
}

/**
 * Get the degree within the sign (0-30)
 * @param {number} degree - Absolute degree (0-360)
 * @returns {number} Degree within sign (0-30)
 */
function getDegreeInSign(degree) {
  const normalized = ((degree % 360) + 360) % 360;
  return normalized % 30;
}

/**
 * Convert sign + degree to absolute degree
 * @param {string} sign - Zodiac sign name
 * @param {number} degreeInSign - Degree within sign (0-30)
 * @returns {number} Absolute degree (0-360)
 */
function toAbsoluteDegree(sign, degreeInSign = 15) {
  const signIndex = SIGNS.indexOf(sign);
  if (signIndex === -1) return null;
  return signIndex * 30 + degreeInSign;
}

/**
 * Extract degree from planet data (handles multiple formats)
 * @param {Object} planetData - Planet data object
 * @returns {number|null} Degree
 */
function extractDegree(planetData) {
  if (!planetData) return null;

  // Direct degree
  if (typeof planetData.degree === 'number') return planetData.degree;
  if (typeof planetData.Degree === 'number') return planetData.Degree;
  if (typeof planetData.absoluteDegree === 'number') return planetData.absoluteDegree;

  // Sign + position
  const sign = planetData.sign || planetData.Sign;
  const degInSign = planetData.degreeInSign || planetData.position || 15;

  if (sign) {
    return toAbsoluteDegree(sign, degInSign);
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE CHART GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the composite chart from two natal charts
 *
 * This creates "the third psyche" — a chart that represents
 * the relationship itself, not either individual.
 *
 * @param {Object} chartA - First person's natal chart
 * @param {Object} chartB - Second person's natal chart
 * @returns {Object} Composite chart data
 */
export function buildCompositeChart(chartA, chartB) {
  if (!chartA || !chartB) {
    return null;
  }

  const composite = {
    planets: {},
    metadata: {
      generatedAt: new Date().toISOString(),
      type: 'composite',
      method: 'midpoint'
    }
  };

  // Extract planets from both charts
  const planetsA = extractPlanets(chartA);
  const planetsB = extractPlanets(chartB);

  // Calculate midpoints for all shared planets
  const allPlanets = new Set([...Object.keys(planetsA), ...Object.keys(planetsB)]);

  for (const planetName of allPlanets) {
    const pA = planetsA[planetName];
    const pB = planetsB[planetName];

    // Need both planets to calculate midpoint
    if (!pA || !pB) continue;

    const degA = extractDegree(pA);
    const degB = extractDegree(pB);

    if (degA === null || degB === null) continue;

    const midpointDegree = calculateMidpoint(degA, degB);
    const sign = getSignFromDegree(midpointDegree);
    const degreeInSign = getDegreeInSign(midpointDegree);

    composite.planets[planetName] = {
      name: planetName,
      degree: midpointDegree,
      degreeInSign: degreeInSign,
      sign: sign,
      sourceA: {
        degree: degA,
        sign: pA.sign || pA.Sign || getSignFromDegree(degA)
      },
      sourceB: {
        degree: degB,
        sign: pB.sign || pB.Sign || getSignFromDegree(degB)
      }
    };
  }

  // Calculate composite aspects
  composite.aspects = calculateCompositeAspects(composite.planets);

  // Determine house placements if Ascendant is available
  if (composite.planets.Ascendant) {
    composite.houses = calculateHouses(composite.planets.Ascendant.degree);
    assignHouses(composite.planets, composite.houses);
  }

  // Add statistical summary
  composite.statistics = generateStatistics(composite);

  return composite;
}

/**
 * Extract planets from chart data (handles various formats)
 */
function extractPlanets(chart) {
  if (!chart) return {};

  // Check for planets object
  if (chart.planets) {
    if (Array.isArray(chart.planets)) {
      // Convert array to object
      const result = {};
      for (const p of chart.planets) {
        const name = p.name || p.planet || p.Planet;
        if (name) result[name] = p;
      }
      return result;
    }
    return chart.planets;
  }

  // Check for western format
  if (chart.western?.planets) {
    return chart.western.planets;
  }

  // Check for direct planet properties
  const result = {};
  for (const name of PLANETS) {
    if (chart[name]) {
      result[name] = chart[name];
    }
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// ASPECT CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

const ASPECT_ORBS = {
  conjunction: { angle: 0, orb: 8 },
  opposition: { angle: 180, orb: 8 },
  trine: { angle: 120, orb: 8 },
  square: { angle: 90, orb: 7 },
  sextile: { angle: 60, orb: 6 },
  quincunx: { angle: 150, orb: 3 }
};

/**
 * Calculate aspects between composite planets
 */
function calculateCompositeAspects(planets) {
  const aspects = [];
  const planetNames = Object.keys(planets);

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const p1 = planets[planetNames[i]];
      const p2 = planets[planetNames[j]];

      if (!p1 || !p2) continue;

      const aspect = findAspect(p1.degree, p2.degree, planetNames[i], planetNames[j]);
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }

  return aspects;
}

/**
 * Find if an aspect exists between two degrees
 */
function findAspect(deg1, deg2, name1, name2) {
  const diff = Math.abs(deg1 - deg2);
  const normalized = diff > 180 ? 360 - diff : diff;

  for (const [aspectType, config] of Object.entries(ASPECT_ORBS)) {
    const orb = Math.abs(normalized - config.angle);
    if (orb <= config.orb) {
      return {
        planet1: name1,
        planet2: name2,
        type: aspectType,
        angle: config.angle,
        orb: parseFloat(orb.toFixed(2)),
        exactness: parseFloat(((config.orb - orb) / config.orb * 100).toFixed(1))
      };
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOUSE CALCULATION (Equal Houses from Composite Ascendant)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate house cusps using Equal House system
 */
function calculateHouses(ascDegree) {
  const houses = {};
  for (let i = 1; i <= 12; i++) {
    houses[i] = {
      cusp: (ascDegree + (i - 1) * 30) % 360,
      sign: getSignFromDegree((ascDegree + (i - 1) * 30) % 360)
    };
  }
  return houses;
}

/**
 * Assign house positions to planets
 */
function assignHouses(planets, houses) {
  for (const planetName of Object.keys(planets)) {
    const planet = planets[planetName];
    const degree = planet.degree;

    // Find which house this degree falls in
    for (let h = 1; h <= 12; h++) {
      const nextH = h === 12 ? 1 : h + 1;
      const cusp = houses[h].cusp;
      const nextCusp = houses[nextH].cusp;

      // Handle wrap-around at 0°
      if (nextCusp < cusp) {
        // Crosses 0°
        if (degree >= cusp || degree < nextCusp) {
          planet.house = h;
          break;
        }
      } else {
        if (degree >= cusp && degree < nextCusp) {
          planet.house = h;
          break;
        }
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate statistical summary of the composite chart
 */
function generateStatistics(composite) {
  const planets = composite.planets;
  const stats = {
    elementBalance: { Fire: 0, Earth: 0, Air: 0, Water: 0 },
    modalityBalance: { Cardinal: 0, Fixed: 0, Mutable: 0 },
    planetCount: Object.keys(planets).length,
    aspectCount: composite.aspects?.length || 0
  };

  const elementMap = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
  };

  const modalityMap = {
    Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
    Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
    Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
  };

  // Count elements and modalities
  for (const planet of Object.values(planets)) {
    const sign = planet.sign;
    if (elementMap[sign]) stats.elementBalance[elementMap[sign]]++;
    if (modalityMap[sign]) stats.modalityBalance[modalityMap[sign]]++;
  }

  // Determine dominant element
  const elements = Object.entries(stats.elementBalance);
  stats.dominantElement = elements.reduce((a, b) => a[1] > b[1] ? a : b)[0];

  // Determine dominant modality
  const modalities = Object.entries(stats.modalityBalance);
  stats.dominantModality = modalities.reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return stats;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the composite Sun sign
 */
export function getCompositeSun(chartA, chartB) {
  const composite = buildCompositeChart(chartA, chartB);
  return composite?.planets?.Sun?.sign || null;
}

/**
 * Get just the composite Moon sign
 */
export function getCompositeMoon(chartA, chartB) {
  const composite = buildCompositeChart(chartA, chartB);
  return composite?.planets?.Moon?.sign || null;
}

/**
 * Get the composite Sun-Moon combination
 */
export function getCompositeLuminaries(chartA, chartB) {
  const composite = buildCompositeChart(chartA, chartB);
  if (!composite) return null;

  return {
    sun: composite.planets?.Sun?.sign,
    moon: composite.planets?.Moon?.sign,
    combination: `${composite.planets?.Sun?.sign || 'Unknown'} Sun / ${composite.planets?.Moon?.sign || 'Unknown'} Moon`
  };
}

/**
 * Check if composite has a specific aspect
 */
export function hasCompositeAspect(chartA, chartB, planet1, planet2, aspectType) {
  const composite = buildCompositeChart(chartA, chartB);
  if (!composite?.aspects) return false;

  return composite.aspects.some(a =>
    ((a.planet1 === planet1 && a.planet2 === planet2) ||
     (a.planet1 === planet2 && a.planet2 === planet1)) &&
    a.type === aspectType
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildCompositeChart,
  calculateMidpoint,
  getSignFromDegree,
  getDegreeInSign,
  getCompositeSun,
  getCompositeMoon,
  getCompositeLuminaries,
  hasCompositeAspect,
  // Constants
  SIGNS,
  PLANETS,
  ASPECT_ORBS
};
