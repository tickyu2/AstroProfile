// Zone Calculation Utilities
// Helper functions for working with Aries degree placements

import ariesZones from '../data/ariesZones.js';

/**
 * Get the zone for a given Aries degree
 * @param {number} degree - Degree within Aries (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Aries degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return ariesZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} ariesDegree - Degree within Aries (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (0-29.99)
 */
export function getAbsoluteEclipticPosition(ariesDegree) {
  return 0 + ariesDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Aries (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Mars",
      subRuler: "Mars",
      quality: "Cardinal/Initiating"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Mars",
      subRuler: "Sun",
      quality: "Fixed/Stabilizing"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Mars",
      subRuler: "Jupiter",
      quality: "Mutable/Transitioning"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Aries (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    pisces: 0,
    aries: 100,
    taurus: 0
  };

  // Pisces cusp influence (0-5°)
  if (degree < 5) {
    const piscesInfluence = Math.round((5 - degree) / 5 * 25);
    influences.pisces = piscesInfluence;
    influences.aries = 100 - piscesInfluence;
  }

  // Taurus cusp influence (25-30°)
  if (degree >= 25) {
    const taurusInfluence = Math.round((degree - 25) / 5 * 25);
    influences.taurus = taurusInfluence;
    influences.aries = 100 - taurusInfluence;
  }

  return influences;
}

/**
 * Get approximate birth date range for a degree
 * @param {number} degree - Degree within Aries (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  const startDate = new Date(2024, 2, 20); // March 20, 2024 (Aries start)
  const daysIntoAries = degree;

  const birthDate = new Date(startDate);
  birthDate.setDate(startDate.getDate() + Math.floor(daysIntoAries));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    month: monthNames[birthDate.getMonth()],
    day: birthDate.getDate(),
    formattedDate: `${monthNames[birthDate.getMonth()]} ${birthDate.getDate()}`
  };
}

/**
 * Compare quality levels across multiple zones
 * @param {array} zones - Array of zone objects
 * @param {string} qualityId - Quality to compare
 * @returns {object} - Comparison data
 */
export function compareQualityAcrossZones(zones, qualityId) {
  const levels = zones.map(zone => zone.qualities[qualityId].level);
  const max = Math.max(...levels);
  const min = Math.min(...levels);
  const range = max - min;
  const avg = levels.reduce((a, b) => a + b, 0) / levels.length;

  return {
    qualityId,
    range,
    max,
    min,
    avg: Math.round(avg),
    maxZone: zones.find(z => z.qualities[qualityId].level === max),
    minZone: zones.find(z => z.qualities[qualityId].level === min),
    interpretation: generateQualityComparison(qualityId, range, max, min)
  };
}

/**
 * Generate human-readable comparison text
 */
function generateQualityComparison(qualityId, range, max, min) {
  const qualityNames = {
    speed: 'tempo',
    stubbornness: 'stubbornness',
    riskTolerance: 'risk tolerance',
    physicalEnergy: 'physical energy',
    changeTolerance: 'adaptability',
    aggression: 'aggression',
    independence: 'independence',
    patience: 'patience'
  };

  const qualityName = qualityNames[qualityId] || qualityId;

  if (range < 20) {
    return `${qualityName} is relatively consistent across these zones (${range}% range)`;
  } else if (range < 40) {
    return `Moderate variation in ${qualityName}: ${range}% difference between highest and lowest`;
  } else if (range < 60) {
    return `Significant ${qualityName} difference: ${range}% range shows distinct behavioral patterns`;
  } else {
    return `Dramatic ${qualityName} contrast: ${range}% spread reveals fundamentally different expressions`;
  }
}

/**
 * Get zone suggestions for user's degree
 * @param {number} userDegree - User's Aries Sun degree
 * @returns {object} - Zone info and suggestions
 */
export function getUserZoneInfo(userDegree) {
  const zone = getZoneFromDegree(userDegree);
  if (!zone) return null;

  const cuspInfluences = getCuspInfluences(userDegree);
  const decan = getDecanFromDegree(userDegree);
  const dateInfo = getDateRangeForDegree(userDegree);

  return {
    zone,
    degree: userDegree,
    absolutePosition: getAbsoluteEclipticPosition(userDegree),
    dateInfo,
    decan,
    cuspInfluences,
    suggestion: generatePersonalizedSuggestion(zone, userDegree, cuspInfluences)
  };
}

/**
 * Generate personalized insights for user
 */
function generatePersonalizedSuggestion(zone, degree, influences) {
  let suggestion = `You're in Zone ${zone.id}: ${zone.name}. `;

  if (influences.pisces > 15) {
    suggestion += `With ${influences.pisces}% Pisces influence, you're more intuitive and compassionate than typical Aries. `;
  }

  if (influences.taurus > 15) {
    suggestion += `With ${influences.taurus}% Taurus influence, you're more grounded and patient than typical Aries. `;
  }

  if (zone.id === 1) {
    suggestion += "You're the Aries who FEELS before acting\u2014combining fire's initiative with water's intuition.";
  } else if (zone.id === 2) {
    suggestion += "You're peak Aries\u2014the most quintessentially Ram-like expression possible.";
  } else if (zone.id === 6) {
    suggestion += "You're the Aries who BUILDS things\u2014combining fire's initiative with earth's practicality.";
  }

  return suggestion;
}

/**
 * Calculate compatibility between two Aries degrees
 * @param {number} degree1 - First person's Aries degree
 * @param {number} degree2 - Second person's Aries degree
 * @returns {object} - Compatibility analysis
 */
export function calculateAriesCompatibility(degree1, degree2) {
  const zone1 = getZoneFromDegree(degree1);
  const zone2 = getZoneFromDegree(degree2);

  if (!zone1 || !zone2) return null;

  // Calculate quality alignment
  const qualityDifferences = Object.keys(zone1.qualities).map(qualityId => {
    const diff = Math.abs(zone1.qualities[qualityId].level - zone2.qualities[qualityId].level);
    return { qualityId, difference: diff };
  });

  const avgDifference = qualityDifferences.reduce((sum, q) => sum + q.difference, 0) / qualityDifferences.length;
  const compatibilityScore = Math.round(100 - avgDifference);

  // Find biggest alignments and conflicts
  const sorted = [...qualityDifferences].sort((a, b) => a.difference - b.difference);
  const alignments = sorted.slice(0, 3).map(q => q.qualityId);
  const conflicts = sorted.slice(-3).reverse().map(q => q.qualityId);

  return {
    zone1,
    zone2,
    compatibilityScore,
    interpretation: getCompatibilityInterpretation(compatibilityScore),
    alignments,
    conflicts,
    avgDifference: Math.round(avgDifference)
  };
}

function getCompatibilityInterpretation(score) {
  if (score >= 90) return "Extremely high compatibility\u2014almost identical Aries expression";
  if (score >= 80) return "High compatibility\u2014minor differences in warrior style";
  if (score >= 70) return "Good compatibility\u2014complementary fire energies";
  if (score >= 60) return "Moderate compatibility\u2014need conscious bridging";
  if (score >= 50) return "Challenging but workable\u2014significant adaptation needed";
  return "Low compatibility\u2014fundamentally different Aries expressions";
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  compareQualityAcrossZones,
  getUserZoneInfo,
  calculateAriesCompatibility
};
