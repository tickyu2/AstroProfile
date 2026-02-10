// Zone Calculation Utilities for Libra
// Helper functions for working with Libra degree placements

import libraZones from '../data/libraZones.js';

/**
 * Get the zone for a given Libra degree
 * @param {number} degree - Degree within Libra (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Libra degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return libraZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} libraDegree - Degree within Libra (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (180-209.99)
 */
export function getAbsoluteEclipticPosition(libraDegree) {
  return 180 + libraDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Libra (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Venus",
      subRuler: "Venus",
      quality: "Cardinal/Initiating"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Venus",
      subRuler: "Uranus",
      quality: "Fixed/Stabilizing"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Venus",
      subRuler: "Mercury",
      quality: "Mutable/Transitioning"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Libra (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    virgo: 0,
    libra: 100,
    scorpio: 0
  };

  // Virgo cusp influence (0-5°)
  if (degree < 5) {
    const virgoInfluence = Math.round((5 - degree) / 5 * 25);
    influences.virgo = virgoInfluence;
    influences.libra = 100 - virgoInfluence;
  }

  // Scorpio cusp influence (25-30°)
  if (degree >= 25) {
    const scorpioInfluence = Math.round((degree - 25) / 5 * 25);
    influences.scorpio = scorpioInfluence;
    influences.libra = 100 - scorpioInfluence;
  }

  return influences;
}

/**
 * Get approximate date range for a given Libra degree
 * @param {number} degree - Degree within Libra (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  // Libra: ~September 23 - October 22
  const startDate = new Date(2024, 8, 23); // September 23
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
 * @param {number} userDegree - User's Libra degree
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
    suggestions.push("Your Virgo cusp brings analytical precision to your diplomatic nature — use it for detailed aesthetic projects.");
  } else if (zone.id === 2) {
    suggestions.push("As pure Libra, your superpower is harmony. Be mindful that avoiding conflict entirely can create deeper imbalance.");
  } else if (zone.id === 3) {
    suggestions.push("Your Aquarius influence makes you a natural justice advocate. Channel this into progressive social causes.");
  } else if (zone.id === 4) {
    suggestions.push("Your Uranian influence drives radical equality. Balance idealism with practical relationship realities.");
  } else if (zone.id === 5) {
    suggestions.push("Your Gemini decan gives you masterful communication. Use your social gift for deeper, not just wider, connections.");
  } else if (zone.id === 6) {
    suggestions.push("Your Scorpio cusp adds transformative depth. Embrace intensity while maintaining your diplomatic grace.");
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
 * Calculate compatibility between two Libra placements
 * @param {number} degree1 - First Libra degree
 * @param {number} degree2 - Second Libra degree
 * @returns {object} - Compatibility analysis
 */
export function calculateLibraCompatibility(degree1, degree2) {
  const zone1 = getZoneFromDegree(degree1);
  const zone2 = getZoneFromDegree(degree2);

  if (!zone1 || !zone2) return null;

  const degreeDiff = Math.abs(degree1 - degree2);
  const sameZone = zone1.id === zone2.id;
  const sameDecan = Math.floor(degree1 / 10) === Math.floor(degree2 / 10);

  let harmony = 70; // Libra base: high harmony
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
      ? `Both in ${zone1.name}: deeply harmonious Libra connection with shared values`
      : `${zone1.name} meets ${zone2.name}: complementary Libra energies create balanced partnership`
  };
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  getUserZoneInfo,
  calculateLibraCompatibility
};
