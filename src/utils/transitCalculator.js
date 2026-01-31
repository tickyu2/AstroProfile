/**
 * transitCalculator.js
 * ====================
 *
 * Calculates current planetary positions and transits to natal chart.
 * Part of the Liz Greene Cathedral - Phase 1: Living System
 *
 * Features:
 * - Current planetary positions (ephemeris-based approximations)
 * - Transit aspects to natal planets
 * - Retrograde detection
 * - Transit timing (applying/separating)
 * - Saturn cycle transit tracking
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// CONSTANTS
// =============================================================================

// Orbital periods in days (approximate)
const ORBITAL_PERIODS = {
  Sun: 365.25,
  Moon: 27.32,
  Mercury: 87.97,
  Venus: 224.7,
  Mars: 686.98,
  Jupiter: 4332.59,
  Saturn: 10759.22,
  Uranus: 30688.5,
  Neptune: 60182,
  Pluto: 90560,
  NorthNode: 6793.5, // ~18.6 years (retrograde motion)
  Chiron: 18394 // ~50.4 years
};

// Average daily motion in degrees
const DAILY_MOTION = {
  Sun: 0.9856,
  Moon: 13.176,
  Mercury: 1.383,
  Venus: 1.2,
  Mars: 0.524,
  Jupiter: 0.083,
  Saturn: 0.033,
  Uranus: 0.012,
  Neptune: 0.006,
  Pluto: 0.004,
  NorthNode: -0.053, // Retrograde
  Chiron: 0.02
};

// Zodiac signs in order
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Aspect definitions with orbs for transits
const TRANSIT_ASPECTS = {
  conjunction: { angle: 0, orb: 8, symbol: '☌', nature: 'major' },
  opposition: { angle: 180, orb: 8, symbol: '☍', nature: 'major' },
  trine: { angle: 120, orb: 6, symbol: '△', nature: 'major' },
  square: { angle: 90, orb: 6, symbol: '□', nature: 'major' },
  sextile: { angle: 60, orb: 4, symbol: '⚹', nature: 'major' },
  quincunx: { angle: 150, orb: 3, symbol: '⚻', nature: 'minor' },
  semisquare: { angle: 45, orb: 2, symbol: '∠', nature: 'minor' },
  sesquiquadrate: { angle: 135, orb: 2, symbol: '⚼', nature: 'minor' }
};

// Reference positions (J2000.0 epoch - January 1, 2000)
const J2000_POSITIONS = {
  Sun: 280.46,
  Moon: 218.32,
  Mercury: 252.25,
  Venus: 181.98,
  Mars: 355.45,
  Jupiter: 34.40,
  Saturn: 49.94,
  Uranus: 313.23,
  Neptune: 304.88,
  Pluto: 238.93,
  NorthNode: 125.04,
  Chiron: 295.0
};

// Retrograde periods approximation (simplified)
const RETROGRADE_PATTERNS = {
  Mercury: { frequency: 88, duration: 21, probability: 0.19 },
  Venus: { frequency: 584, duration: 42, probability: 0.07 },
  Mars: { frequency: 780, duration: 72, probability: 0.09 },
  Jupiter: { frequency: 399, duration: 121, probability: 0.30 },
  Saturn: { frequency: 378, duration: 138, probability: 0.37 },
  Uranus: { frequency: 370, duration: 151, probability: 0.41 },
  Neptune: { frequency: 367, duration: 158, probability: 0.43 },
  Pluto: { frequency: 367, duration: 160, probability: 0.44 }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Normalize angle to 0-360 range
 */
function normalizeAngle(angle) {
  let normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

/**
 * Calculate days since J2000.0 epoch
 */
function daysSinceJ2000(date) {
  const j2000 = new Date('2000-01-01T12:00:00Z');
  const targetDate = new Date(date);
  return (targetDate - j2000) / (1000 * 60 * 60 * 24);
}

/**
 * Get zodiac sign from degree
 */
function getSignFromDegree(degree) {
  const normalized = normalizeAngle(degree);
  const signIndex = Math.floor(normalized / 30);
  return ZODIAC_SIGNS[signIndex];
}

/**
 * Get degree within sign (0-30)
 */
function getDegreeInSign(absoluteDegree) {
  return normalizeAngle(absoluteDegree) % 30;
}

/**
 * Calculate angular distance (shortest path)
 */
function angularDistance(angle1, angle2) {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2));
  return diff > 180 ? 360 - diff : diff;
}

// =============================================================================
// PLANETARY POSITION CALCULATIONS
// =============================================================================

/**
 * Calculate current position for a planet (simplified ephemeris)
 * @param {string} planet - Planet name
 * @param {Date} date - Target date
 * @returns {object} - Position data
 */
export function calculatePlanetPosition(planet, date = new Date()) {
  const days = daysSinceJ2000(date);
  const dailyMotion = DAILY_MOTION[planet] || 0;
  const basePosition = J2000_POSITIONS[planet] || 0;

  // Calculate raw position
  let rawPosition = basePosition + (dailyMotion * days);

  // Apply simple perturbation corrections for outer planets
  if (planet === 'Jupiter') {
    rawPosition += 0.5 * Math.sin(days / 4332.59 * 2 * Math.PI);
  } else if (planet === 'Saturn') {
    rawPosition += 0.8 * Math.sin(days / 10759.22 * 2 * Math.PI);
  }

  const absoluteDegree = normalizeAngle(rawPosition);
  const sign = getSignFromDegree(absoluteDegree);
  const degreeInSign = getDegreeInSign(absoluteDegree);

  // Estimate retrograde status (simplified)
  const isRetrograde = estimateRetrograde(planet, date);

  return {
    planet,
    absoluteDegree,
    sign,
    degree: degreeInSign,
    formattedPosition: `${Math.floor(degreeInSign)}° ${sign}`,
    retrograde: isRetrograde,
    date: date.toISOString().split('T')[0]
  };
}

/**
 * Estimate if a planet is retrograde (simplified heuristic)
 */
function estimateRetrograde(planet, date) {
  if (!RETROGRADE_PATTERNS[planet]) return false;

  const pattern = RETROGRADE_PATTERNS[planet];
  const days = daysSinceJ2000(date);

  // Use sinusoidal approximation for retrograde windows
  const cyclePosition = (days % pattern.frequency) / pattern.frequency;
  const retroWindow = pattern.duration / pattern.frequency;

  // Retrograde occurs near the midpoint of Earth-planet synodic cycle
  return cyclePosition > 0.5 - retroWindow / 2 && cyclePosition < 0.5 + retroWindow / 2;
}

/**
 * Calculate all current planetary positions
 */
export function getCurrentPlanetaryPositions(date = new Date()) {
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'NorthNode', 'Chiron'];

  const positions = {};
  planets.forEach(planet => {
    positions[planet] = calculatePlanetPosition(planet, date);
  });

  return {
    date: date.toISOString().split('T')[0],
    positions,
    retrogradeCount: Object.values(positions).filter(p => p.retrograde).length,
    retrogradePlanets: Object.values(positions).filter(p => p.retrograde).map(p => p.planet)
  };
}

// =============================================================================
// TRANSIT ASPECT CALCULATIONS
// =============================================================================

/**
 * Calculate aspect between two positions
 */
function calculateAspect(transitDegree, natalDegree) {
  const distance = angularDistance(transitDegree, natalDegree);

  for (const [aspectName, aspectDef] of Object.entries(TRANSIT_ASPECTS)) {
    const diff = Math.abs(distance - aspectDef.angle);
    if (diff <= aspectDef.orb) {
      return {
        aspect: aspectName,
        symbol: aspectDef.symbol,
        nature: aspectDef.nature,
        exactAngle: aspectDef.angle,
        actualAngle: distance,
        orb: diff,
        isExact: diff < 1,
        applying: null // Will be calculated with velocity
      };
    }
  }

  return null;
}

/**
 * Determine if transit is applying or separating
 */
function determineApplication(transitPlanet, natalDegree, currentTransitDegree, date) {
  // Calculate position 1 day later
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const futurePosition = calculatePlanetPosition(transitPlanet, tomorrow);

  const currentDistance = angularDistance(currentTransitDegree, natalDegree);
  const futureDistance = angularDistance(futurePosition.absoluteDegree, natalDegree);

  return futureDistance < currentDistance ? 'applying' : 'separating';
}

/**
 * Calculate all transits to a natal chart
 * @param {object} natalChart - Natal chart with planet positions
 * @param {Date} date - Transit date
 * @returns {array} - Array of transit aspects
 */
export function calculateTransitsToNatal(natalChart, date = new Date()) {
  const currentPositions = getCurrentPlanetaryPositions(date);
  const transits = [];

  const transitPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'];
  const natalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'NorthNode', 'Chiron'];

  for (const transitPlanet of transitPlanets) {
    const transitPos = currentPositions.positions[transitPlanet];
    if (!transitPos) continue;

    for (const natalPlanet of natalPlanets) {
      // Get natal position
      const natalPos = getNatalPosition(natalChart, natalPlanet);
      if (natalPos === null) continue;

      // Skip same planet minor aspects
      if (transitPlanet === natalPlanet) continue;

      const aspect = calculateAspect(transitPos.absoluteDegree, natalPos);
      if (aspect) {
        const application = determineApplication(transitPlanet, natalPos, transitPos.absoluteDegree, date);

        transits.push({
          transitPlanet,
          transitSign: transitPos.sign,
          transitDegree: transitPos.degree,
          transitRetrograde: transitPos.retrograde,
          natalPlanet,
          ...aspect,
          applying: application === 'applying',
          separating: application === 'separating',
          importance: calculateTransitImportance(transitPlanet, natalPlanet, aspect)
        });
      }
    }
  }

  // Sort by importance
  transits.sort((a, b) => b.importance - a.importance);

  return transits;
}

/**
 * Extract natal position from chart data (handles various formats)
 */
function getNatalPosition(natalChart, planet) {
  // Try different data structures
  if (natalChart.planets?.[planet]?.absoluteDegree !== undefined) {
    return natalChart.planets[planet].absoluteDegree;
  }
  if (natalChart.planets?.[planet.toLowerCase()]?.absoluteDegree !== undefined) {
    return natalChart.planets[planet.toLowerCase()].absoluteDegree;
  }
  if (natalChart[planet]?.absoluteDegree !== undefined) {
    return natalChart[planet].absoluteDegree;
  }
  if (natalChart[planet.toLowerCase()]?.absoluteDegree !== undefined) {
    return natalChart[planet.toLowerCase()].absoluteDegree;
  }

  // Try to calculate from sign/degree
  const planetData = natalChart.planets?.[planet] || natalChart.planets?.[planet.toLowerCase()] || natalChart[planet] || natalChart[planet.toLowerCase()];
  if (planetData?.sign && planetData?.degree !== undefined) {
    const signIndex = ZODIAC_SIGNS.indexOf(planetData.sign);
    if (signIndex !== -1) {
      return (signIndex * 30) + planetData.degree;
    }
  }

  return null;
}

/**
 * Calculate transit importance (0-100)
 */
function calculateTransitImportance(transitPlanet, natalPlanet, aspect) {
  let score = 0;

  // Outer planet transits are more significant
  const outerPlanets = ['Saturn', 'Uranus', 'Neptune', 'Pluto'];
  if (outerPlanets.includes(transitPlanet)) score += 30;
  if (outerPlanets.includes(natalPlanet)) score += 20;

  // Major aspects more important
  if (aspect.nature === 'major') score += 20;

  // Tighter orbs more significant
  score += Math.max(0, 20 - aspect.orb * 3);

  // Saturn and Pluto transits to personal planets very significant
  if (['Saturn', 'Pluto'].includes(transitPlanet) && ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(natalPlanet)) {
    score += 15;
  }

  // Applying transits more active
  if (aspect.applying) score += 5;

  // Conjunction/opposition most powerful
  if (['conjunction', 'opposition'].includes(aspect.aspect)) score += 10;

  return Math.min(100, score);
}

// =============================================================================
// SATURN-SPECIFIC TRANSIT TRACKING
// =============================================================================

/**
 * Calculate Saturn's current transit relationship to natal Saturn
 */
export function calculateSaturnCycleTransit(natalSaturn, date = new Date()) {
  const currentSaturn = calculatePlanetPosition('Saturn', date);
  const natalDegree = typeof natalSaturn === 'number' ? natalSaturn : getNatalPosition({ Saturn: natalSaturn }, 'Saturn');

  if (natalDegree === null) return null;

  const distance = normalizeAngle(currentSaturn.absoluteDegree - natalDegree);

  // Determine Saturn phase
  let phase, phaseName, percentComplete;

  if (distance < 45) {
    phase = 'post-return';
    phaseName = 'Integration Phase';
    percentComplete = (distance / 45) * 100;
  } else if (distance < 90) {
    phase = 'waxing-square';
    phaseName = 'First Crisis';
    percentComplete = ((distance - 45) / 45) * 100;
  } else if (distance < 135) {
    phase = 'waxing-trine';
    phaseName = 'Consolidation';
    percentComplete = ((distance - 90) / 45) * 100;
  } else if (distance < 180) {
    phase = 'opposition-approaching';
    phaseName = 'Approaching Opposition';
    percentComplete = ((distance - 135) / 45) * 100;
  } else if (distance < 225) {
    phase = 'opposition';
    phaseName = 'Opposition Phase';
    percentComplete = ((distance - 180) / 45) * 100;
  } else if (distance < 270) {
    phase = 'waning-trine';
    phaseName = 'Harvest Phase';
    percentComplete = ((distance - 225) / 45) * 100;
  } else if (distance < 315) {
    phase = 'waning-square';
    phaseName = 'Final Crisis';
    percentComplete = ((distance - 270) / 45) * 100;
  } else {
    phase = 'return-approaching';
    phaseName = 'Return Approaching';
    percentComplete = ((distance - 315) / 45) * 100;
  }

  // Calculate exact aspects
  const aspectsToNatal = [];
  for (const [aspectName, aspectDef] of Object.entries(TRANSIT_ASPECTS)) {
    const diff = Math.abs(distance - aspectDef.angle);
    if (diff <= aspectDef.orb) {
      aspectsToNatal.push({
        aspect: aspectName,
        orb: diff,
        exact: diff < 1
      });
    }
  }

  return {
    transitSaturn: currentSaturn,
    natalSaturnDegree: natalDegree,
    distance,
    phase,
    phaseName,
    percentComplete: Math.round(percentComplete),
    cyclePercentComplete: Math.round((distance / 360) * 100),
    aspectsToNatal,
    isReturnWindow: distance > 350 || distance < 10,
    retrograde: currentSaturn.retrograde
  };
}

// =============================================================================
// TRANSIT TIMING PREDICTIONS
// =============================================================================

/**
 * Calculate when a transit will be exact
 */
export function predictTransitExact(transitPlanet, targetDegree, startDate = new Date(), maxDays = 365) {
  const dailyMotion = DAILY_MOTION[transitPlanet];
  if (!dailyMotion) return null;

  let currentDate = new Date(startDate);
  let currentPosition = calculatePlanetPosition(transitPlanet, currentDate);
  let closestDate = null;
  let closestDistance = 360;

  for (let day = 0; day < maxDays; day++) {
    currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);
    currentPosition = calculatePlanetPosition(transitPlanet, currentDate);

    const distance = angularDistance(currentPosition.absoluteDegree, targetDegree);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestDate = new Date(currentDate);
    }

    // If we found exact or very close
    if (distance < 0.5) {
      return {
        planet: transitPlanet,
        targetDegree,
        exactDate: currentDate.toISOString().split('T')[0],
        orb: distance,
        daysFromNow: day
      };
    }
  }

  // Return closest approach if no exact hit
  if (closestDate && closestDistance < 5) {
    return {
      planet: transitPlanet,
      targetDegree,
      exactDate: closestDate.toISOString().split('T')[0],
      orb: closestDistance,
      daysFromNow: Math.round((closestDate - startDate) / (1000 * 60 * 60 * 24)),
      isApproximate: true
    };
  }

  return null;
}

/**
 * Get upcoming significant transits for a natal chart
 */
export function getUpcomingSignificantTransits(natalChart, startDate = new Date(), days = 90) {
  const upcomingTransits = [];
  const outerPlanets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];

  // Check each combination
  for (const transitPlanet of outerPlanets) {
    for (const natalPlanet of personalPlanets) {
      const natalDegree = getNatalPosition(natalChart, natalPlanet);
      if (natalDegree === null) continue;

      // Check for upcoming conjunctions and oppositions
      const conjunction = predictTransitExact(transitPlanet, natalDegree, startDate, days);
      if (conjunction) {
        upcomingTransits.push({
          ...conjunction,
          natalPlanet,
          aspect: 'conjunction',
          significance: 'high'
        });
      }

      const opposition = predictTransitExact(transitPlanet, normalizeAngle(natalDegree + 180), startDate, days);
      if (opposition) {
        upcomingTransits.push({
          ...opposition,
          natalPlanet,
          aspect: 'opposition',
          significance: 'high'
        });
      }

      const square1 = predictTransitExact(transitPlanet, normalizeAngle(natalDegree + 90), startDate, days);
      if (square1) {
        upcomingTransits.push({
          ...square1,
          natalPlanet,
          aspect: 'square',
          significance: 'medium'
        });
      }
    }
  }

  // Sort by date
  upcomingTransits.sort((a, b) => new Date(a.exactDate) - new Date(b.exactDate));

  return upcomingTransits;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  calculatePlanetPosition,
  getCurrentPlanetaryPositions,
  calculateTransitsToNatal,
  calculateSaturnCycleTransit,
  predictTransitExact,
  getUpcomingSignificantTransits,
  TRANSIT_ASPECTS,
  ZODIAC_SIGNS
};
