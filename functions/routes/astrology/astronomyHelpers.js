/**
 * astronomyHelpers.js
 *
 * Pure computation: ZODIAC_SIGNS, longitudeToZodiac, calculateLST,
 * calculateAscendant, calculateMC, calculatePlacidusHouses, and all
 * astronomia imports (julian, solar, moonposition, planetposition, VSOP87 data, pluto).
 *
 * Extracted from functions/routes/astrology.js during modularisation.
 */

const { logger } = require('firebase-functions');

// Astronomia modules for planetary calculations
const julian = require('astronomia/julian');
const solar = require('astronomia/solar');
const moonposition = require('astronomia/moonposition');
const planetposition = require('astronomia/planetposition');

// VSOP87B planet data files - required for planetary position calculations
// Note: These modules export data via .default (ES module format)
const earthData = require('astronomia/data/vsop87Bearth').default;
const mercuryData = require('astronomia/data/vsop87Bmercury').default;
const venusData = require('astronomia/data/vsop87Bvenus').default;
const marsData = require('astronomia/data/vsop87Bmars').default;
const jupiterData = require('astronomia/data/vsop87Bjupiter').default;
const saturnData = require('astronomia/data/vsop87Bsaturn').default;
const uranusData = require('astronomia/data/vsop87Buranus').default;
const neptuneData = require('astronomia/data/vsop87Bneptune').default;
const pluto = require('astronomia/pluto');

/**
 * Zodiac Signs with degree ranges
 */
const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '\u2648', element: 'Fire', modality: 'Cardinal', start: 0 },
  { name: 'Taurus', symbol: '\u2649', element: 'Earth', modality: 'Fixed', start: 30 },
  { name: 'Gemini', symbol: '\u264A', element: 'Air', modality: 'Mutable', start: 60 },
  { name: 'Cancer', symbol: '\u264B', element: 'Water', modality: 'Cardinal', start: 90 },
  { name: 'Leo', symbol: '\u264C', element: 'Fire', modality: 'Fixed', start: 120 },
  { name: 'Virgo', symbol: '\u264D', element: 'Earth', modality: 'Mutable', start: 150 },
  { name: 'Libra', symbol: '\u264E', element: 'Air', modality: 'Cardinal', start: 180 },
  { name: 'Scorpio', symbol: '\u264F', element: 'Water', modality: 'Fixed', start: 210 },
  { name: 'Sagittarius', symbol: '\u2650', element: 'Fire', modality: 'Mutable', start: 240 },
  { name: 'Capricorn', symbol: '\u2651', element: 'Earth', modality: 'Cardinal', start: 270 },
  { name: 'Aquarius', symbol: '\u2652', element: 'Air', modality: 'Fixed', start: 300 },
  { name: 'Pisces', symbol: '\u2653', element: 'Water', modality: 'Mutable', start: 330 }
];

/**
 * Convert ecliptic longitude to zodiac sign and degree
 * @param {number} longitude - Ecliptic longitude in degrees (0-360)
 * @returns {Object} - Sign data with degree within sign
 */
function longitudeToZodiac(longitude) {
  // Safety check for invalid input
  if (longitude === undefined || longitude === null || isNaN(longitude)) {
    logger.error('longitudeToZodiac: Invalid longitude:', longitude);
    // Return Aries as fallback
    return {
      sign: 'Aries',
      symbol: '\u2648',
      element: 'Fire',
      modality: 'Cardinal',
      degree: 0,
      degreeFormatted: '0\u00B00\'',
      totalLongitude: 0,
      error: 'Invalid longitude input'
    };
  }

  // Normalize to 0-360
  const normalizedLong = ((longitude % 360) + 360) % 360;

  const signIndex = Math.floor(normalizedLong / 30);
  const degreeInSign = normalizedLong % 30;

  // Safety check for array bounds
  const sign = ZODIAC_SIGNS[signIndex] || ZODIAC_SIGNS[0];

  return {
    sign: sign.name,
    symbol: sign.symbol,
    element: sign.element,
    modality: sign.modality,
    degree: degreeInSign,
    degreeFormatted: `${Math.floor(degreeInSign)}\u00B0${Math.round((degreeInSign % 1) * 60)}'`,
    totalLongitude: normalizedLong
  };
}

/**
 * Calculate Local Sidereal Time (LST)
 * Required for Ascendant/Rising Sign calculation
 */
function calculateLST(julianDay, longitude) {
  // Calculate Greenwich Sidereal Time
  const T = (julianDay - 2451545.0) / 36525.0;

  // GMST at 0h UT (in degrees)
  let GMST = 280.46061837 +
             360.98564736629 * (julianDay - 2451545.0) +
             0.000387933 * T * T -
             (T * T * T) / 38710000.0;

  // Normalize to 0-360
  GMST = ((GMST % 360) + 360) % 360;

  // Local Sidereal Time = GMST + longitude
  let LST = GMST + longitude;
  LST = ((LST % 360) + 360) % 360;

  return LST;
}

/**
 * Calculate Ascendant (Rising Sign)
 * @param {number} julianDay - Julian Day
 * @param {number} latitude - Observer latitude
 * @param {number} longitude - Observer longitude
 * @param {number} obliquity - Obliquity of ecliptic (default ~23.44\u00B0)
 * @returns {number} - Ascendant longitude in degrees
 */
function calculateAscendant(julianDay, latitude, longitude, obliquity = 23.4393) {
  const LST = calculateLST(julianDay, longitude);

  // Convert to radians
  const lstRad = LST * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;

  // Calculate Ascendant using standard formula
  const y = -Math.cos(lstRad);
  const x = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad);

  let ascendant = Math.atan2(y, x) * 180 / Math.PI;

  // Normalize to 0-360
  ascendant = ((ascendant % 360) + 360) % 360;

  return ascendant;
}

/**
 * Calculate Midheaven (MC) - 10th House Cusp
 * @param {number} LST - Local Sidereal Time in degrees
 * @returns {number} - MC longitude in degrees
 */
function calculateMC(LST) {
  // MC = arctan(tan(LST) / cos(obliquity))
  const obliquity = 23.4393; // Mean obliquity
  const lstRad = LST * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;

  let mc = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(oblRad)) * 180 / Math.PI;

  // Normalize to 0-360
  mc = ((mc % 360) + 360) % 360;

  return mc;
}

/**
 * Calculate Placidus House Cusps
 * The most popular house system in Western astrology
 *
 * @param {number} julianDay - Julian Day
 * @param {number} latitude - Observer latitude
 * @param {number} longitude - Observer longitude
 * @returns {Object} - All 12 house cusps with zodiac positions
 */
function calculatePlacidusHouses(julianDay, latitude, longitude) {
  // Lazy-require to avoid circular dependency at load time
  const { getHouseName } = require('./houseStrength');

  const obliquity = 23.4393;
  const LST = calculateLST(julianDay, longitude);

  // Calculate MC (10th house cusp)
  const mc = calculateMC(LST);

  // Calculate Ascendant (1st house cusp)
  const asc = calculateAscendant(julianDay, latitude, longitude, obliquity);

  // Calculate IC (4th house cusp) - opposite of MC
  const ic = (mc + 180) % 360;

  // Calculate Descendant (7th house cusp) - opposite of Ascendant
  const desc = (asc + 180) % 360;

  // For Placidus intermediate cusps, we use semi-arc interpolation
  // This is a simplified version - full Placidus requires iterative calculation
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;

  // Calculate house cusps using Placidus formula
  // Houses 2, 3, 11, 12 are interpolated between ASC-IC and MC-ASC
  const houses = {};

  // House 1 = Ascendant
  houses[1] = asc;

  // House 4 = IC
  houses[4] = ic;

  // House 7 = Descendant
  houses[7] = desc;

  // House 10 = MC
  houses[10] = mc;

  // Placidus intermediate house calculation
  // For houses 2, 3: between ASC and IC (below horizon, eastern)
  // For houses 11, 12: between MC and ASC (above horizon, eastern)

  // Simplified Placidus interpolation using semi-arc method
  function calculatePlacidusIntermediate(f, isAboveHorizon) {
    // f is the fraction (1/3 or 2/3) of the semi-arc
    const lstRad = LST * Math.PI / 180;

    // Calculate the RAMC (Right Ascension of MC)
    const RAMC = LST;

    // For intermediate houses, we calculate based on semi-arc divisions
    // This is a simplified approach that works well for most latitudes

    let cusp;
    if (isAboveHorizon) {
      // Houses 11, 12 (between MC and ASC, going counter-clockwise)
      const diff = asc - mc;
      const normalizedDiff = diff < 0 ? diff + 360 : diff;
      cusp = mc + normalizedDiff * f;
    } else {
      // Houses 2, 3 (between ASC and IC, going counter-clockwise)
      const diff = ic - asc;
      const normalizedDiff = diff < 0 ? diff + 360 : diff;
      cusp = asc + normalizedDiff * f;
    }

    return ((cusp % 360) + 360) % 360;
  }

  // Calculate intermediate house cusps
  // Above horizon (MC to ASC): houses 11, 12
  houses[11] = calculatePlacidusIntermediate(1/3, true);
  houses[12] = calculatePlacidusIntermediate(2/3, true);

  // Below horizon (ASC to IC): houses 2, 3
  houses[2] = calculatePlacidusIntermediate(1/3, false);
  houses[3] = calculatePlacidusIntermediate(2/3, false);

  // Opposite houses (just add 180\u00B0)
  houses[5] = (houses[11] + 180) % 360;
  houses[6] = (houses[12] + 180) % 360;
  houses[8] = (houses[2] + 180) % 360;
  houses[9] = (houses[3] + 180) % 360;

  // Convert all houses to zodiac format
  const houseData = {};
  for (let i = 1; i <= 12; i++) {
    const zodiac = longitudeToZodiac(houses[i]);
    houseData[i] = {
      cusp: houses[i],
      ...zodiac,
      house: i,
      name: getHouseName(i)
    };
  }

  return {
    system: 'Placidus',
    houses: houseData,
    angles: {
      ascendant: longitudeToZodiac(asc),
      mc: longitudeToZodiac(mc),
      descendant: longitudeToZodiac(desc),
      ic: longitudeToZodiac(ic)
    }
  };
}

module.exports = {
  // Astronomia modules (re-exported for use in astrology.js)
  julian,
  solar,
  moonposition,
  planetposition,
  earthData,
  mercuryData,
  venusData,
  marsData,
  jupiterData,
  saturnData,
  uranusData,
  neptuneData,
  pluto,

  // Constants
  ZODIAC_SIGNS,

  // Functions
  longitudeToZodiac,
  calculateLST,
  calculateAscendant,
  calculateMC,
  calculatePlacidusHouses
};
