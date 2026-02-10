// Zone Calculation Utilities for Sagittarius
// Helper functions for working with Sagittarius degree placements

import sagittariusZones from '../data/sagittariusZones.js';

/**
 * Get the zone for a given Sagittarius degree
 * @param {number} degree - Degree within Sagittarius (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Sagittarius degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return sagittariusZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} sagittariusDegree - Degree within Sagittarius (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (240-269.99)
 */
export function getAbsoluteEclipticPosition(sagittariusDegree) {
  return 240 + sagittariusDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Sagittarius (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Jupiter",
      subRuler: "Jupiter",
      quality: "Mutable/Pure"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Jupiter",
      subRuler: "Mars",
      quality: "Cardinal/Courageous"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Jupiter",
      subRuler: "Sun",
      quality: "Fixed/Creative"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Sagittarius (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    scorpio: 0,
    sagittarius: 100,
    capricorn: 0
  };

  // Scorpio cusp influence (0-5°)
  if (degree < 5) {
    const scorpioInfluence = Math.round((5 - degree) / 5 * 25);
    influences.scorpio = scorpioInfluence;
    influences.sagittarius = 100 - scorpioInfluence;
  }

  // Capricorn cusp influence (25-30°)
  if (degree >= 25) {
    const capInfluence = Math.round((degree - 25) / 5 * 25);
    influences.capricorn = capInfluence;
    influences.sagittarius = 100 - capInfluence;
  }

  return influences;
}

/**
 * Get approximate date range for a given Sagittarius degree
 * @param {number} degree - Degree within Sagittarius (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  // Sagittarius: ~November 22 - December 21
  const startDate = new Date(2024, 10, 22); // November 22
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
 * @param {number} userDegree - User's Sagittarius degree
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
    suggestions.push("Your Scorpio cusp adds transformative depth to your philosophy — use it to seek truth that transforms, not just entertains.");
  } else if (zone.id === 2) {
    suggestions.push("As pure Sagittarius, your boundless enthusiasm is your superpower. Channel it with intention to avoid scattering your energy.");
  } else if (zone.id === 3) {
    suggestions.push("Your Aries influence brings warrior courage to your vision. Lead boldly but remember to bring others along on the journey.");
  } else if (zone.id === 4) {
    suggestions.push("Your Mars connection makes you a revolutionary teacher. Fight for truth but stay open to other perspectives.");
  } else if (zone.id === 5) {
    suggestions.push("Your Leo decan gives you charismatic teaching power. Share your joy generously but stay grounded in humility.");
  } else if (zone.id === 6) {
    suggestions.push("Your Capricorn cusp gives strategic discipline. Build your philosophical empire step by step — patience multiplies vision.");
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
 * Calculate compatibility between two Sagittarius placements
 * @param {number} degree1 - First Sagittarius degree
 * @param {number} degree2 - Second Sagittarius degree
 * @returns {object} - Compatibility analysis
 */
export function calculateSagittariusCompatibility(degree1, degree2) {
  const zone1 = getZoneFromDegree(degree1);
  const zone2 = getZoneFromDegree(degree2);

  if (!zone1 || !zone2) return null;

  const degreeDiff = Math.abs(degree1 - degree2);
  const sameZone = zone1.id === zone2.id;
  const sameDecan = Math.floor(degree1 / 10) === Math.floor(degree2 / 10);

  let harmony = 70; // Sagittarius base: adventurous but restless
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
      ? `Both in ${zone1.name}: adventurous Sagittarian bond — inspiring but potentially restless together`
      : `${zone1.name} meets ${zone2.name}: different Sagittarius expressions create exciting philosophical exchange`
  };
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  getUserZoneInfo,
  calculateSagittariusCompatibility
};
