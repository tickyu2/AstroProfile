// Zone Calculation Utilities for Aquarius
// Helper functions for working with Aquarius degree placements

import aquariusZones from '../data/aquariusZones.js';

/**
 * Get the zone for a given Aquarius degree
 * @param {number} degree - Degree within Aquarius (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Aquarius degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return aquariusZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} aquariusDegree - Degree within Aquarius (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (300-329.99)
 */
export function getAbsoluteEclipticPosition(aquariusDegree) {
  return 300 + aquariusDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Aquarius (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Uranus",
      subRuler: "Saturn",
      quality: "Fixed/Pure"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Uranus",
      subRuler: "Mercury",
      quality: "Mutable/Gemini"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Uranus",
      subRuler: "Venus",
      quality: "Cardinal/Libra"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Aquarius (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    capricorn: 0,
    aquarius: 100,
    pisces: 0
  };

  // Capricorn cusp influence (0-5°)
  if (degree < 5) {
    const capInfluence = Math.round((5 - degree) / 5 * 25);
    influences.capricorn = capInfluence;
    influences.aquarius = 100 - capInfluence;
  }

  // Pisces cusp influence (25-30°)
  if (degree >= 25) {
    const piscesInfluence = Math.round((degree - 25) / 5 * 25);
    influences.pisces = piscesInfluence;
    influences.aquarius = 100 - piscesInfluence;
  }

  return influences;
}

/**
 * Get approximate date range for a given Aquarius degree
 * @param {number} degree - Degree within Aquarius (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  // Aquarius: ~January 20 - February 18
  const startDate = new Date(2025, 0, 20); // January 20
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
 * @param {number} userDegree - User's Aquarius degree
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
    suggestions.push("Your Capricorn cusp adds strategic discipline to your innovation — use it to build revolutionary systems that actually endure.");
  } else if (zone.id === 2) {
    suggestions.push("As pure Aquarius, your genius is unmatched. Remember to come down from the future occasionally and connect with people in the present.");
  } else if (zone.id === 3) {
    suggestions.push("Your Gemini influence makes you a brilliant communicator. Channel that gift to spread revolutionary ideas to the widest possible audience.");
  } else if (zone.id === 4) {
    suggestions.push("Your Mercury connection enables mass movement building. Focus your equality crusade on one cause at a time for maximum impact.");
  } else if (zone.id === 5) {
    suggestions.push("Your Libra decan gives diplomatic grace to revolution. Use that charm to bring opposing sides together for progressive change.");
  } else if (zone.id === 6) {
    suggestions.push("Your Pisces cusp gives mystical depth to your futurism. Ground your transcendent visions in practical steps to make them real.");
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
 * Calculate compatibility between two Aquarius placements
 * @param {number} degree1 - First Aquarius degree
 * @param {number} degree2 - Second Aquarius degree
 * @returns {object} - Compatibility analysis
 */
export function calculateAquariusCompatibility(degree1, degree2) {
  const zone1 = getZoneFromDegree(degree1);
  const zone2 = getZoneFromDegree(degree2);

  if (!zone1 || !zone2) return null;

  const degreeDiff = Math.abs(degree1 - degree2);
  const sameZone = zone1.id === zone2.id;
  const sameDecan = Math.floor(degree1 / 10) === Math.floor(degree2 / 10);

  let harmony = 70; // Aquarius base: intellectual and freedom-loving
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
      ? `Both in ${zone1.name}: revolutionary Aquarian alliance — innovative and humanitarian together`
      : `${zone1.name} meets ${zone2.name}: different Aquarius expressions create complementary progressive partnership`
  };
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  getUserZoneInfo,
  calculateAquariusCompatibility
};
