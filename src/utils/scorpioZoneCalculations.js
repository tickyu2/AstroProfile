// Zone Calculation Utilities for Scorpio
// Helper functions for working with Scorpio degree placements

import scorpioZones from '../data/scorpioZones.js';

/**
 * Get the zone for a given Scorpio degree
 * @param {number} degree - Degree within Scorpio (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Scorpio degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return scorpioZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} scorpioDegree - Degree within Scorpio (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (210-239.99)
 */
export function getAbsoluteEclipticPosition(scorpioDegree) {
  return 210 + scorpioDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Scorpio (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Pluto",
      subRuler: "Mars",
      quality: "Fixed/Concentrated"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Pluto",
      subRuler: "Neptune",
      quality: "Fixed/Mystical"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Pluto",
      subRuler: "Moon",
      quality: "Cardinal/Protective"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Scorpio (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    libra: 0,
    scorpio: 100,
    sagittarius: 0
  };

  // Libra cusp influence (0-5°)
  if (degree < 5) {
    const libraInfluence = Math.round((5 - degree) / 5 * 25);
    influences.libra = libraInfluence;
    influences.scorpio = 100 - libraInfluence;
  }

  // Sagittarius cusp influence (25-30°)
  if (degree >= 25) {
    const sagInfluence = Math.round((degree - 25) / 5 * 25);
    influences.sagittarius = sagInfluence;
    influences.scorpio = 100 - sagInfluence;
  }

  return influences;
}

/**
 * Get approximate date range for a given Scorpio degree
 * @param {number} degree - Degree within Scorpio (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  // Scorpio: ~October 23 - November 21
  const startDate = new Date(2024, 9, 23); // October 23
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
 * @param {number} userDegree - User's Scorpio degree
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
    suggestions.push("Your Libra cusp adds diplomatic grace to your intensity — use it to transform relationships without burning bridges.");
  } else if (zone.id === 2) {
    suggestions.push("As pure Scorpio, your power is absolute transformation. Channel obsessive energy constructively to avoid self-destruction.");
  } else if (zone.id === 3) {
    suggestions.push("Your Pisces influence brings mystical healing power. Use compassion to transform pain into wisdom for yourself and others.");
  } else if (zone.id === 4) {
    suggestions.push("Your Neptune connection enables infinite regeneration. Trust the death-rebirth cycle — you always rise stronger.");
  } else if (zone.id === 5) {
    suggestions.push("Your Cancer decan makes you a fierce guardian. Protect without suffocating — true strength allows others freedom.");
  } else if (zone.id === 6) {
    suggestions.push("Your Sagittarius cusp gives philosophical depth. Share your transformative wisdom through teaching and adventure.");
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
 * Calculate compatibility between two Scorpio placements
 * @param {number} degree1 - First Scorpio degree
 * @param {number} degree2 - Second Scorpio degree
 * @returns {object} - Compatibility analysis
 */
export function calculateScorpioCompatibility(degree1, degree2) {
  const zone1 = getZoneFromDegree(degree1);
  const zone2 = getZoneFromDegree(degree2);

  if (!zone1 || !zone2) return null;

  const degreeDiff = Math.abs(degree1 - degree2);
  const sameZone = zone1.id === zone2.id;
  const sameDecan = Math.floor(degree1 / 10) === Math.floor(degree2 / 10);

  let harmony = 65; // Scorpio base: intense but challenging
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
      ? `Both in ${zone1.name}: intensely bonded Scorpio connection — transformative but volatile`
      : `${zone1.name} meets ${zone2.name}: different Scorpio expressions create magnetic tension and depth`
  };
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  getUserZoneInfo,
  calculateScorpioCompatibility
};
