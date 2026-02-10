// Zone Calculation Utilities for Capricorn
// Helper functions for working with Capricorn degree placements

import capricornZones from '../data/capricornZones.js';

/**
 * Get the zone for a given Capricorn degree
 * @param {number} degree - Degree within Capricorn (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Capricorn degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return capricornZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} capricornDegree - Degree within Capricorn (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (270-299.99)
 */
export function getAbsoluteEclipticPosition(capricornDegree) {
  return 270 + capricornDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Capricorn (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Saturn",
      subRuler: "Saturn",
      quality: "Cardinal/Pure"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Saturn",
      subRuler: "Venus",
      quality: "Fixed/Material"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Saturn",
      subRuler: "Mercury",
      quality: "Mutable/Analytical"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Capricorn (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    sagittarius: 0,
    capricorn: 100,
    aquarius: 0
  };

  // Sagittarius cusp influence (0-5°)
  if (degree < 5) {
    const sagInfluence = Math.round((5 - degree) / 5 * 25);
    influences.sagittarius = sagInfluence;
    influences.capricorn = 100 - sagInfluence;
  }

  // Aquarius cusp influence (25-30°)
  if (degree >= 25) {
    const aquaInfluence = Math.round((degree - 25) / 5 * 25);
    influences.aquarius = aquaInfluence;
    influences.capricorn = 100 - aquaInfluence;
  }

  return influences;
}

/**
 * Get approximate date range for a given Capricorn degree
 * @param {number} degree - Degree within Capricorn (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  // Capricorn: ~December 22 - January 19
  const startDate = new Date(2024, 11, 22); // December 22
  const daysToAdd = Math.floor(degree);
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysToAdd);

  const options = { month: 'long', day: 'numeric' };
  return {
    approximateDate: date.toLocaleDateString('en-US', options),
    dayOfSeason: daysToAdd + 1
  };
}

/**
 * Get personalized zone info with suggestions
 * @param {number} userDegree - User's Capricorn degree
 * @returns {object} - Zone info with personalized suggestions
 */
export function getUserZoneInfo(userDegree) {
  const zone = getZoneFromDegree(userDegree);
  if (!zone) return null;

  const decan = getDecanFromDegree(userDegree);
  const cusps = getCuspInfluences(userDegree);
  const dateRange = getDateRangeForDegree(userDegree);

  const suggestions = [];

  // Zone-specific suggestions
  if (zone.id === 1) {
    suggestions.push("Your Sagittarius cusp adds visionary fire to your strategy — use it to build empires that inspire, not just endure.");
  } else if (zone.id === 2) {
    suggestions.push("As pure Capricorn, your discipline is unmatched. Remember to pause and enjoy the view from the summits you've already conquered.");
  } else if (zone.id === 3) {
    suggestions.push("Your Taurus influence brings sensory appreciation. Build wealth not just for power but for the beauty and quality it enables.");
  } else if (zone.id === 4) {
    suggestions.push("Your Venus connection enables dynasty building. Create empires that serve not just ambition but genuine human needs.");
  } else if (zone.id === 5) {
    suggestions.push("Your Virgo decan gives analytical perfection. Channel precision into excellence, not paralyzing self-criticism.");
  } else if (zone.id === 6) {
    suggestions.push("Your Aquarius cusp gives revolutionary vision. Build the future's infrastructure while honoring the wisdom of the past.");
  }

  return {
    zone,
    decan,
    cuspInfluences: cusps,
    dateInfo: dateRange,
    suggestions
  };
}

/**
 * Calculate compatibility between two Capricorn placements
 * @param {number} degree1 - First Capricorn degree
 * @param {number} degree2 - Second Capricorn degree
 * @returns {object} - Compatibility analysis
 */
export function calculateCapricornCompatibility(degree1, degree2) {
  const zone1 = getZoneFromDegree(degree1);
  const zone2 = getZoneFromDegree(degree2);

  if (!zone1 || !zone2) return null;

  const degreeDiff = Math.abs(degree1 - degree2);
  const sameZone = zone1.id === zone2.id;
  const sameDecan = Math.floor(degree1 / 10) === Math.floor(degree2 / 10);

  let harmony = 70; // Capricorn base: disciplined and loyal
  if (sameZone) harmony += 20;
  else if (sameDecan) harmony += 10;
  if (degreeDiff < 3) harmony += 10;
  harmony = Math.min(100, harmony);

  return {
    harmony,
    sameZone,
    sameDecan,
    degreeDifference: degreeDiff,
    zone1: zone1.name,
    zone2: zone2.name,
    description: sameZone
      ? `Both in ${zone1.name}: powerful Capricorn alliance — disciplined and ambitious together`
      : `${zone1.name} meets ${zone2.name}: different Capricorn expressions create complementary strategic partnership`
  };
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  getUserZoneInfo,
  calculateCapricornCompatibility
};
