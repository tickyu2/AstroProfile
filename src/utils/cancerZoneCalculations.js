// Zone Calculation Utilities
// Helper functions for working with Cancer degree placements

import cancerZones from '../data/cancerZones.js';

/**
 * Get the zone for a given Cancer degree
 * @param {number} degree - Degree within Cancer (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Cancer degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return cancerZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} cancerDegree - Degree within Cancer (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (90-119.99)
 */
export function getAbsoluteEclipticPosition(cancerDegree) {
  return 90 + cancerDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Cancer (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Moon",
      subRuler: "Moon",
      quality: "Cardinal/Initiating"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Moon",
      subRuler: "Pluto",
      quality: "Fixed/Stabilizing"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Moon",
      subRuler: "Neptune",
      quality: "Mutable/Transitioning"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Cancer (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    gemini: 0,
    cancer: 100,
    leo: 0
  };

  // Gemini cusp influence (0-5\u00B0)
  if (degree < 5) {
    const geminiInfluence = Math.round((5 - degree) / 5 * 25);
    influences.gemini = geminiInfluence;
    influences.cancer = 100 - geminiInfluence;
  }

  // Leo cusp influence (25-30\u00B0)
  if (degree >= 25) {
    const leoInfluence = Math.round((degree - 25) / 5 * 25);
    influences.leo = leoInfluence;
    influences.cancer = 100 - leoInfluence;
  }

  return influences;
}

/**
 * Get approximate birth date range for a degree
 * @param {number} degree - Degree within Cancer (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  const startDate = new Date(2024, 5, 21); // June 21, 2024 (Cancer start approx)
  const daysIntoCancer = degree;

  const birthDate = new Date(startDate);
  birthDate.setDate(startDate.getDate() + Math.floor(daysIntoCancer));

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
    emotionalDepth: 'emotional depth',
    nurturingInstinct: 'nurturing instinct',
    protectiveness: 'protectiveness',
    intuition: 'intuition',
    empathy: 'empathy',
    memoryRetention: 'memory retention',
    patience: 'patience',
    independence: 'independence',
    speed: 'speed',
    riskTolerance: 'risk tolerance'
  };

  const qualityName = qualityNames[qualityId] || qualityId;

  if (range < 20) {
    return `${qualityName} is relatively consistent across these zones (${range}% range)`;
  } else if (range < 40) {
    return `Moderate variation in ${qualityName}: ${range}% difference between highest and lowest`;
  } else if (range < 60) {
    return `Significant ${qualityName} difference: ${range}% range shows distinct emotional patterns`;
  } else {
    return `Dramatic ${qualityName} contrast: ${range}% spread reveals fundamentally different expressions`;
  }
}

/**
 * Get zone suggestions for user's degree
 * @param {number} userDegree - User's Cancer Sun degree
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

  if (influences.gemini > 15) {
    suggestion += `With ${influences.gemini}% Gemini influence, you're more articulate and mentally agile than typical Cancer. `;
  }

  if (influences.leo > 15) {
    suggestion += `With ${influences.leo}% Leo influence, you're more expressive and confident than typical Cancer. `;
  }

  if (zone.id === 1) {
    suggestion += "You're the Cancer who SPEAKS emotions\u2014combining water's depth with air's articulation.";
  } else if (zone.id === 2) {
    suggestion += "You're peak Cancer\u2014the most quintessentially lunar expression possible.";
  } else if (zone.id === 6) {
    suggestion += "You're the Cancer who RADIATES warmth\u2014combining water's depth with fire's creative expression.";
  }

  return suggestion;
}

/**
 * Calculate compatibility between two Cancer degrees
 * @param {number} degree1 - First person's Cancer degree
 * @param {number} degree2 - Second person's Cancer degree
 * @returns {object} - Compatibility analysis
 */
export function calculateCancerCompatibility(degree1, degree2) {
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
  if (score >= 90) return "Extremely high compatibility\u2014almost identical Cancer expression";
  if (score >= 80) return "High compatibility\u2014minor differences in emotional style";
  if (score >= 70) return "Good compatibility\u2014complementary water energies";
  if (score >= 60) return "Moderate compatibility\u2014need conscious emotional bridging";
  if (score >= 50) return "Challenging but workable\u2014significant adaptation needed";
  return "Low compatibility\u2014fundamentally different Cancer expressions";
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  compareQualityAcrossZones,
  getUserZoneInfo,
  calculateCancerCompatibility
};
