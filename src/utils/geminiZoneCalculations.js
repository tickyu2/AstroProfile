// Zone Calculation Utilities
// Helper functions for working with Gemini degree placements

import geminiZones from '../data/geminiZones.js';

/**
 * Get the zone for a given Gemini degree
 * @param {number} degree - Degree within Gemini (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Gemini degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return geminiZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} geminiDegree - Degree within Gemini (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (60-89.99)
 */
export function getAbsoluteEclipticPosition(geminiDegree) {
  return 60 + geminiDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Gemini (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Mercury",
      subRuler: "Mercury",
      quality: "Mutable/Communicating"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Mercury",
      subRuler: "Venus",
      quality: "Cardinal/Initiating"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Mercury",
      subRuler: "Uranus",
      quality: "Fixed/Innovating"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Gemini (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    taurus: 0,
    gemini: 100,
    cancer: 0
  };

  // Taurus cusp influence (0-5°)
  if (degree < 5) {
    const taurusInfluence = Math.round((5 - degree) / 5 * 25);
    influences.taurus = taurusInfluence;
    influences.gemini = 100 - taurusInfluence;
  }

  // Cancer cusp influence (25-30°)
  if (degree >= 25) {
    const cancerInfluence = Math.round((degree - 25) / 5 * 25);
    influences.cancer = cancerInfluence;
    influences.gemini = 100 - cancerInfluence;
  }

  return influences;
}

/**
 * Get approximate birth date range for a degree
 * @param {number} degree - Degree within Gemini (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  const startDate = new Date(2024, 4, 21); // May 21, 2024 (Gemini start)
  const daysIntoGemini = degree;

  const birthDate = new Date(startDate);
  birthDate.setDate(startDate.getDate() + Math.floor(daysIntoGemini));

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
    mentalEnergy: 'mental energy',
    changeTolerance: 'adaptability',
    curiosity: 'curiosity',
    communication: 'communication',
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
 * @param {number} userDegree - User's Gemini Sun degree
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

  if (influences.taurus > 15) {
    suggestion += `With ${influences.taurus}% Taurus influence, you're more grounded and patient than typical Gemini. `;
  }

  if (influences.cancer > 15) {
    suggestion += `With ${influences.cancer}% Cancer influence, you're more emotionally intuitive than typical Gemini. `;
  }

  if (zone.id === 1) {
    suggestion += "You're the Gemini who BUILDS with words\u2014combining air's communication with earth's practicality.";
  } else if (zone.id === 2) {
    suggestion += "You're peak Gemini\u2014the most quintessentially Twin-like expression possible.";
  } else if (zone.id === 6) {
    suggestion += "You're the Gemini who FEELS while thinking\u2014combining air's intellect with water's emotional depth.";
  }

  return suggestion;
}

/**
 * Calculate compatibility between two Gemini degrees
 * @param {number} degree1 - First person's Gemini degree
 * @param {number} degree2 - Second person's Gemini degree
 * @returns {object} - Compatibility analysis
 */
export function calculateGeminiCompatibility(degree1, degree2) {
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
  if (score >= 90) return "Extremely high compatibility\u2014almost identical Gemini expression";
  if (score >= 80) return "High compatibility\u2014minor differences in communication style";
  if (score >= 70) return "Good compatibility\u2014complementary mental energies";
  if (score >= 60) return "Moderate compatibility\u2014need conscious bridging";
  if (score >= 50) return "Challenging but workable\u2014significant adaptation needed";
  return "Low compatibility\u2014fundamentally different Gemini expressions";
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  compareQualityAcrossZones,
  getUserZoneInfo,
  calculateGeminiCompatibility
};
