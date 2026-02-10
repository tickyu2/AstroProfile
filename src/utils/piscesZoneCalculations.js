// Zone Calculation Utilities for Pisces
// Helper functions for working with Pisces degree placements

import piscesZones from '../data/piscesZones.js';

/**
 * Get the zone for a given Pisces degree
 * @param {number} degree - Degree within Pisces (0-29.99)
 * @returns {object|null} - Zone object or null if invalid
 */
export function getZoneFromDegree(degree) {
  if (degree < 0 || degree >= 30) {
    console.warn(`Invalid Pisces degree: ${degree}. Must be 0-29.99`);
    return null;
  }

  return piscesZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
}

/**
 * Calculate absolute ecliptic position
 * @param {number} piscesDegree - Degree within Pisces (0-29.99)
 * @returns {number} - Absolute ecliptic longitude (330-359.99)
 */
export function getAbsoluteEclipticPosition(piscesDegree) {
  return 330 + piscesDegree;
}

/**
 * Get decan for a given degree
 * @param {number} degree - Degree within Pisces (0-29.99)
 * @returns {object} - Decan information
 */
export function getDecanFromDegree(degree) {
  if (degree < 10) {
    return {
      number: 1,
      name: "First Decan",
      ruler: "Neptune",
      subRuler: "Jupiter",
      quality: "Mutable/Pure"
    };
  } else if (degree < 20) {
    return {
      number: 2,
      name: "Second Decan",
      ruler: "Neptune",
      subRuler: "Moon",
      quality: "Cardinal/Cancer"
    };
  } else {
    return {
      number: 3,
      name: "Third Decan",
      ruler: "Neptune",
      subRuler: "Pluto",
      quality: "Fixed/Scorpio"
    };
  }
}

/**
 * Calculate cusp influence percentages
 * @param {number} degree - Degree within Pisces (0-29.99)
 * @returns {object} - Influence breakdown
 */
export function getCuspInfluences(degree) {
  const influences = {
    aquarius: 0,
    pisces: 100,
    aries: 0
  };

  // Aquarius cusp influence (0-5°)
  if (degree < 5) {
    const aquaInfluence = Math.round((5 - degree) / 5 * 25);
    influences.aquarius = aquaInfluence;
    influences.pisces = 100 - aquaInfluence;
  }

  // Aries cusp influence (25-30°)
  if (degree >= 25) {
    const ariesInfluence = Math.round((degree - 25) / 5 * 25);
    influences.aries = ariesInfluence;
    influences.pisces = 100 - ariesInfluence;
  }

  return influences;
}

/**
 * Get approximate date range for a given Pisces degree
 * @param {number} degree - Degree within Pisces (0-29.99)
 * @returns {object} - Date range
 */
export function getDateRangeForDegree(degree) {
  // Pisces: ~February 19 - March 20
  const startDate = new Date(2025, 1, 19); // February 19
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
 * @param {number} userDegree - User's Pisces degree
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
    suggestions.push("Your Aquarius cusp adds visionary innovation to your spirituality — use it to build movements that bridge intellect and transcendence.");
  } else if (zone.id === 2) {
    suggestions.push("As pure Pisces, your spiritual connection is unmatched. Remember to ground yourself in the material world to bring your visions to life.");
  } else if (zone.id === 3) {
    suggestions.push("Your Cancer influence brings nurturing emotional depth. Channel your healing gifts into sacred spaces where others can transform.");
  } else if (zone.id === 4) {
    suggestions.push("Your Scorpio decan gives transformative spiritual power. Use your alchemy to transmute darkness into light, not just for others but for yourself.");
  } else if (zone.id === 5) {
    suggestions.push("Your Scorpio peak gives you divine artistic intensity. Channel your emotional depth into transcendent art that heals humanity.");
  } else if (zone.id === 6) {
    suggestions.push("Your Aries cusp gives courageous spiritual initiative. Lead with compassion while harnessing your warrior fire to manifest spiritual visions.");
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
 * Calculate compatibility between two Pisces placements
 * @param {number} degree1 - First Pisces degree
 * @param {number} degree2 - Second Pisces degree
 * @returns {object} - Compatibility analysis
 */
export function calculatePiscesCompatibility(degree1, degree2) {
  const zone1 = getZoneFromDegree(degree1);
  const zone2 = getZoneFromDegree(degree2);

  if (!zone1 || !zone2) return null;

  const degreeDiff = Math.abs(degree1 - degree2);
  const sameZone = zone1.id === zone2.id;
  const sameDecan = Math.floor(degree1 / 10) === Math.floor(degree2 / 10);

  let harmony = 70; // Pisces base: compassionate and merging
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
      ? `Both in ${zone1.name}: transcendent Pisces bond — merged in spiritual unity`
      : `${zone1.name} meets ${zone2.name}: different Pisces expressions create complementary spiritual partnership`
  };
}

export default {
  getZoneFromDegree,
  getAbsoluteEclipticPosition,
  getDecanFromDegree,
  getCuspInfluences,
  getDateRangeForDegree,
  getUserZoneInfo,
  calculatePiscesCompatibility
};
