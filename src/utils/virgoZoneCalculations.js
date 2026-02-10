// Zone Calculation Utilities
// Helper functions for working with Virgo degree placements

import virgoZones from '../data/virgoZones.js';

/**
 * Get the zone for a given Virgo degree
 * @param {number} degree - Degree within Virgo (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Virgo degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return virgoZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} virgoDegree - Degree within Virgo (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (150-179.99)
 */
export function getAbsoluteEclipticPosition(virgoDegree) {
  return 150 + virgoDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Virgo (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Mercury",
      subRuler: "Mercury",
      quality: "Mutable/Pure Analytical"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Mercury",
      subRuler: "Saturn",
      quality: "Mutable/Disciplined"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Mercury",
      subRuler: "Venus",
      quality: "Mutable/Aesthetic"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Virgo (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    leo: 0,
    virgo: 100,
    libra: 0
  };

  // Leo cusp influence (0-5\u00B0)
  if (degree < 5) {
    const leoInfluence = Math.round((5 - degree) / 5 * 25);
    influences.leo = leoInfluence;
    influences.virgo = 100 - leoInfluence;
  }

  // Libra cusp influence (25-30\u00B0)
  if (degree >= 25) {
    const libraInfluence = Math.round((degree - 25) / 5 * 25);
    influences.libra = libraInfluence;
    influences.virgo = 100 - libraInfluence;
  }

  return influences;
}

/**
 * Get approximate birth date range for a degree
 * @param {number} degree - Degree within Virgo (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  const startDate = new Date(2024, 7, 23); // August 23, 2024 (Virgo start approx)
  const daysIntoVirgo = degree;

  const birthDate = new Date(startDate);
  birthDate.setDate(startDate.getDate() + Math.floor(daysIntoVirgo));

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
    analyticalThinking: 'analytical thinking',
    attention: 'attention to detail',
    perfectionism: 'perfectionism',
    serviceOrientation: 'service orientation',
    practicalSkills: 'practical skills',
    criticalThinking: 'critical thinking',
    organization: 'organization',
    healthConsciousness: 'health consciousness',
    speed: 'speed',
    riskTolerance: 'risk tolerance'
  };

  const qualityName = qualityNames[qualityId] || qualityId;

  if (range < 20) {
    return `${qualityName} is relatively consistent across these zones (${range}% range)`;
  } else if (range < 40) {
    return `Moderate variation in ${qualityName}: ${range}% difference between highest and lowest`;
  } else if (range < 60) {
    return `Significant ${qualityName} difference: ${range}% range shows distinct analytical patterns`;
  } else {
    return `Dramatic ${qualityName} contrast: ${range}% spread reveals fundamentally different expressions`;
  }
}

/**
 * Get zone suggestions for user's degree
 * @param {number} userDegree - User's Virgo Sun degree
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

  if (influences.leo > 15) {
    suggestion += `With ${influences.leo}% Leo influence, you're more confident and expressive than typical Virgo. `;
  }

  if (influences.libra > 15) {
    suggestion += `With ${influences.libra}% Libra influence, you're more diplomatic and harmonious than typical Virgo. `;
  }

  if (zone.id === 1) {
    suggestion += "You're the Virgo who SHINES\u2014combining earth's analytical precision with fire's creative confidence.";
  } else if (zone.id === 2) {
    suggestion += "You're peak Virgo\u2014the most quintessentially Mercurial expression possible, pure analytical mastery.";
  } else if (zone.id === 6) {
    suggestion += "You're the Virgo who HARMONIZES\u2014combining earth's precision with air's diplomatic grace.";
  }

  return suggestion;
}

/**
 * Calculate compatibility between two Virgo degrees
 * @param {number} degree1 - First person's Virgo degree
 * @param {number} degree2 - Second person's Virgo degree
 * @returns {object} - Compatibility analysis
 */
export function calculateVirgoCompatibility(degree1, degree2) {
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
  if (score >= 90) return "Extremely high compatibility\u2014almost identical Virgo expression";
  if (score >= 80) return "High compatibility\u2014minor differences in analytical style";
  if (score >= 70) return "Good compatibility\u2014complementary earth energies";
  if (score >= 60) return "Moderate compatibility\u2014need conscious analytical bridging";
  if (score >= 50) return "Challenging but workable\u2014significant adaptation needed";
  return "Low compatibility\u2014fundamentally different Virgo expressions";
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  compareQualityAcrossZones,
  getUserZoneInfo,
  calculateVirgoCompatibility
};
