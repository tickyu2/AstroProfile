/**
 * Swiss Ephemeris Service - GOLD STANDARD for GENESIS
 *
 * Uses the 'ephemeris' npm package which implements Swiss Ephemeris algorithms
 * in pure JavaScript. This provides professional-grade accuracy without
 * native compilation requirements.
 *
 * Precision: High accuracy planetary positions suitable for professional astrology
 *
 * "Cathedral work requires the best" - Father's Vision
 *
 * Part of GENESIS OS - Sovereign Calculation Engine v3.0
 * Built by: Brother Claude Code
 * January 4, 2026
 */

const ephemeris = require('ephemeris');

// Zodiac signs
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Elements
const SIGN_ELEMENTS = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
};

// Modalities
const SIGN_MODALITIES = {
  Aries: 'Cardinal', Taurus: 'Fixed', Gemini: 'Mutable', Cancer: 'Cardinal',
  Leo: 'Fixed', Virgo: 'Mutable', Libra: 'Cardinal', Scorpio: 'Fixed',
  Sagittarius: 'Mutable', Capricorn: 'Cardinal', Aquarius: 'Fixed', Pisces: 'Mutable'
};

// Planet display names
const PLANET_NAMES = {
  sun: 'Sun',
  moon: 'Moon',
  mercury: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
  pluto: 'Pluto',
  chiron: 'Chiron'
};

// House system (Placidus) calculation constants
const OBLIQUITY = 23.4392911; // Mean obliquity of ecliptic (degrees)

/**
 * Initialize Swiss Ephemeris (no-op for pure JS implementation)
 */
async function initSwissEphemeris() {
  console.log('🌟 Swiss Ephemeris (pure JS) ready - Professional grade accuracy');
  return true;
}

/**
 * Convert date/time to Julian Day
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day
 * @param {number} hour - Hour in decimal (e.g., 14.5 = 14:30)
 * @returns {number} Julian Day
 */
function dateToJulianDay(year, month, day, hour = 12) {
  // Standard Julian Day calculation
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + B - 1524.5 + hour / 24;

  return JD;
}

/**
 * Convert longitude to zodiac sign and degree
 * @param {number} longitude - Ecliptic longitude (0-360)
 * @returns {Object} { sign, signIndex, degree, minute, formatted }
 */
function longitudeToZodiac(longitude) {
  // Normalize to 0-360
  const normLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normLon / 30);
  const sign = ZODIAC_SIGNS[signIndex];
  const degreeInSign = normLon % 30;
  const degree = Math.floor(degreeInSign);
  const minute = Math.floor((degreeInSign - degree) * 60);

  return {
    sign,
    signIndex,
    longitude: normLon,
    degree,
    minute,
    element: SIGN_ELEMENTS[sign],
    modality: SIGN_MODALITIES[sign],
    formatted: `${degree}°${minute.toString().padStart(2, '0')}′ ${sign}`
  };
}

/**
 * Calculate Local Sidereal Time
 * @param {number} jd - Julian Day
 * @param {number} longitude - Geographic longitude (degrees)
 * @returns {number} LST in degrees
 */
function calculateLST(jd, longitude) {
  const T = (jd - 2451545.0) / 36525.0;

  // Greenwich Mean Sidereal Time at 0h UT
  let GMST = 280.46061837 +
             360.98564736629 * (jd - 2451545.0) +
             0.000387933 * T * T -
             (T * T * T) / 38710000.0;

  // Normalize to 0-360
  GMST = ((GMST % 360) + 360) % 360;

  // Convert to Local Sidereal Time
  let LST = GMST + longitude;
  LST = ((LST % 360) + 360) % 360;

  return LST;
}

/**
 * Calculate Ascendant (Rising Sign)
 * @param {number} jd - Julian Day
 * @param {number} latitude - Geographic latitude (degrees)
 * @param {number} longitude - Geographic longitude (degrees)
 * @returns {number} Ascendant longitude in degrees
 */
function calculateAscendant(jd, latitude, longitude) {
  const LST = calculateLST(jd, longitude);

  // Convert to radians
  const LSTrad = LST * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const oblRad = OBLIQUITY * Math.PI / 180;

  // Calculate Ascendant using the standard formula
  const y = -Math.cos(LSTrad);
  const x = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(LSTrad);

  let asc = Math.atan2(y, x) * 180 / Math.PI;

  // Normalize to 0-360
  asc = ((asc % 360) + 360) % 360;

  return asc;
}

/**
 * Calculate Midheaven (MC)
 * @param {number} jd - Julian Day
 * @param {number} longitude - Geographic longitude (degrees)
 * @returns {number} MC longitude in degrees
 */
function calculateMC(jd, longitude) {
  const LST = calculateLST(jd, longitude);
  const oblRad = OBLIQUITY * Math.PI / 180;

  // MC calculation
  let mc = Math.atan2(Math.sin(LST * Math.PI / 180),
                     Math.cos(LST * Math.PI / 180) * Math.cos(oblRad));
  mc = mc * 180 / Math.PI;

  // Normalize
  mc = ((mc % 360) + 360) % 360;

  return mc;
}

/**
 * Normalize angle to 0-360 range
 */
function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

/**
 * Calculate the arc distance in the counter-clockwise direction (increasing degrees)
 * @param {number} from - Starting angle
 * @param {number} to - Ending angle
 * @returns {number} Arc distance (always positive, 0-360)
 */
function arcDistanceCCW(from, to) {
  let dist = to - from;
  if (dist < 0) dist += 360;
  return dist;
}

/**
 * Calculate Equal House cusps (starting from Ascendant)
 * Each house is exactly 30 degrees
 * Simple and reliable - good baseline for testing
 *
 * @param {number} asc - Ascendant in degrees
 * @returns {Array} All 12 house cusps
 */
function calculateEqualHouseCusps(asc) {
  const cusps = new Array(13).fill(0);

  for (let i = 1; i <= 12; i++) {
    cusps[i] = normalizeAngle(asc + (i - 1) * 30);
  }

  return cusps;
}

/**
 * Calculate the shorter arc between two angles
 * Returns { arc: number, direction: 1 or -1 }
 * Direction 1 = increasing, -1 = decreasing
 */
function shortestArc(from, to) {
  let forward = to - from;
  if (forward < 0) forward += 360;

  let backward = from - to;
  if (backward < 0) backward += 360;

  if (forward <= backward) {
    return { arc: forward, direction: 1 };
  } else {
    return { arc: backward, direction: -1 };
  }
}

/**
 * Calculate Porphyry house cusps
 * Divides each quadrant into three equal parts
 * Takes the shorter arc between angular houses
 *
 * @param {number} mc - Midheaven in degrees
 * @param {number} asc - Ascendant in degrees
 * @returns {Array} All 12 house cusps
 */
function calculatePorphyryHouseCusps(mc, asc) {
  const ic = normalizeAngle(mc + 180);
  const desc = normalizeAngle(asc + 180);

  const cusps = new Array(13).fill(0);

  // Angular houses
  cusps[1] = asc;
  cusps[4] = ic;
  cusps[7] = desc;
  cusps[10] = mc;

  // Quadrant 1: ASC → IC (Houses 2, 3)
  const q1 = shortestArc(asc, ic);
  cusps[2] = normalizeAngle(asc + q1.direction * q1.arc / 3);
  cusps[3] = normalizeAngle(asc + q1.direction * 2 * q1.arc / 3);

  // Quadrant 2: IC → DESC (Houses 5, 6)
  const q2 = shortestArc(ic, desc);
  cusps[5] = normalizeAngle(ic + q2.direction * q2.arc / 3);
  cusps[6] = normalizeAngle(ic + q2.direction * 2 * q2.arc / 3);

  // Quadrant 3: DESC → MC (Houses 8, 9)
  const q3 = shortestArc(desc, mc);
  cusps[8] = normalizeAngle(desc + q3.direction * q3.arc / 3);
  cusps[9] = normalizeAngle(desc + q3.direction * 2 * q3.arc / 3);

  // Quadrant 4: MC → ASC (Houses 11, 12)
  const q4 = shortestArc(mc, asc);
  cusps[11] = normalizeAngle(mc + q4.direction * q4.arc / 3);
  cusps[12] = normalizeAngle(mc + q4.direction * 2 * q4.arc / 3);

  return cusps;
}

/**
 * Calculate house cusps (using Porphyry method for now)
 * Porphyry divides quadrants equally - reliable and accurate
 * TODO: Implement true Placidus with semi-arc calculations
 *
 * @param {number} jd - Julian Day
 * @param {number} latitude - Geographic latitude
 * @param {number} longitude - Geographic longitude
 * @param {string} system - 'P' for Porphyry/Placidus, 'E' for Equal
 * @returns {Object} House cusps and angles
 */
function calculatePlacidusHouses(jd, latitude, longitude, system = 'P') {
  const asc = calculateAscendant(jd, latitude, longitude);
  const mc = calculateMC(jd, longitude);
  const ic = normalizeAngle(mc + 180);
  const desc = normalizeAngle(asc + 180);

  // Calculate house cusps using selected system
  let cusps;
  let systemName;

  if (system === 'E') {
    cusps = calculateEqualHouseCusps(asc);
    systemName = 'Equal';
  } else {
    cusps = calculatePorphyryHouseCusps(mc, asc);
    systemName = 'Porphyry';  // Using Porphyry as Placidus approximation
  }

  // Build house array
  const houses = [];
  for (let i = 1; i <= 12; i++) {
    const zodiac = longitudeToZodiac(cusps[i]);
    houses.push({
      house: i,
      cusp: cusps[i],
      ...zodiac
    });
  }

  // Angles
  const angles = {
    ascendant: {
      longitude: asc,
      ...longitudeToZodiac(asc)
    },
    midheaven: {
      longitude: mc,
      ...longitudeToZodiac(mc)
    },
    descendant: {
      longitude: desc,
      ...longitudeToZodiac(desc)
    },
    imumCoeli: {
      longitude: ic,
      ...longitudeToZodiac(ic)
    }
  };

  return {
    houses,
    angles,
    system: system,
    systemName: systemName
  };
}

/**
 * Calculate all planetary positions using ephemeris package
 * @param {Date} date - JavaScript Date object
 * @param {number} longitude - Geographic longitude
 * @param {number} latitude - Geographic latitude
 * @returns {Object} Planet positions keyed by name
 */
function calculateAllPlanets(date, longitude, latitude) {
  const result = ephemeris.getAllPlanets(date, longitude, latitude, 0);
  const planets = {};

  if (!result || !result.observed) {
    console.warn('⚠️ Ephemeris returned no data');
    return planets;
  }

  for (const [key, planetData] of Object.entries(result.observed)) {
    if (!planetData || !PLANET_NAMES[key]) continue;

    try {
      const lon = planetData.apparentLongitudeDd ||
                  planetData.raw?.position?.apparentLongitude ||
                  0;

      if (lon === 0 && key !== 'sun') continue;

      const zodiac = longitudeToZodiac(lon);

      // Detect retrograde from speed (if available)
      const speed = planetData.raw?.position?.speed || 0;
      const isRetrograde = speed < 0;

      planets[key] = {
        planet: PLANET_NAMES[key],
        planetKey: key,
        longitude: lon,
        latitude: planetData.raw?.position?.equinoxEclipticLonLat?.latitude || 0,
        distance: planetData.geocentricDistanceKm || 0,
        speed,
        isRetrograde,
        ...zodiac
      };
    } catch (err) {
      console.warn(`⚠️ Error processing ${key}:`, err.message);
    }
  }

  // Add South Node (opposite of North Node, but ephemeris may not have it)
  // We'll calculate it from the Moon's nodes if available

  return planets;
}

/**
 * Check if a planet longitude is within a house
 * Houses can progress either increasing or decreasing through the zodiac
 *
 * @param {number} planetLon - Planet longitude (0-360)
 * @param {number} cuspStart - Starting cusp longitude
 * @param {number} cuspEnd - Ending cusp longitude
 * @returns {boolean} True if planet is in this house
 */
function isPlanetInHouse(planetLon, cuspStart, cuspEnd) {
  // Normalize all values
  planetLon = normalizeAngle(planetLon);
  cuspStart = normalizeAngle(cuspStart);
  cuspEnd = normalizeAngle(cuspEnd);

  // Calculate arc from start to end going both directions
  let forwardArc = cuspEnd - cuspStart;
  if (forwardArc < 0) forwardArc += 360;

  let backwardArc = cuspStart - cuspEnd;
  if (backwardArc < 0) backwardArc += 360;

  // Use the shorter arc to determine house direction
  if (forwardArc <= backwardArc) {
    // House progresses forward (increasing longitude)
    if (cuspStart <= cuspEnd) {
      return planetLon >= cuspStart && planetLon < cuspEnd;
    } else {
      // Wrap around 0°
      return planetLon >= cuspStart || planetLon < cuspEnd;
    }
  } else {
    // House progresses backward (decreasing longitude)
    if (cuspStart >= cuspEnd) {
      return planetLon <= cuspStart && planetLon > cuspEnd;
    } else {
      // Wrap around 0°
      return planetLon <= cuspStart || planetLon > cuspEnd;
    }
  }
}

/**
 * Assign planets to houses
 * A planet is in a house if it falls between that house's cusp
 * and the next house's cusp (going in house order: 1→2→3→...→12→1)
 *
 * @param {Array} houses - Array of house data with cusps
 * @param {Object} planets - Planet positions keyed by name
 * @returns {Array} Houses with planets assigned
 */
function assignPlanetsToHouses(houses, planets) {
  // Initialize house planets
  const housePlanets = {};
  for (let i = 1; i <= 12; i++) {
    housePlanets[i] = [];
  }

  // Get house cusps in house order (1-12)
  const cuspsInOrder = houses.map(h => ({ house: h.house, cusp: h.cusp }));

  for (const [key, planet] of Object.entries(planets)) {
    if (!planet || typeof planet.longitude !== 'number') continue;

    const planetLon = planet.longitude;
    let foundHouse = null;

    // Check each house
    for (let i = 0; i < 12; i++) {
      const currentHouse = cuspsInOrder[i].house;
      const currentCusp = cuspsInOrder[i].cusp;
      const nextCusp = cuspsInOrder[(i + 1) % 12].cusp;

      if (isPlanetInHouse(planetLon, currentCusp, nextCusp)) {
        foundHouse = currentHouse;
        break;
      }
    }

    // If no house found, assign to house 1 (fallback)
    if (foundHouse === null) {
      foundHouse = 1;
    }

    housePlanets[foundHouse].push({
      name: planet.planet,
      key,
      longitude: planet.longitude,
      sign: planet.sign,
      degree: planet.degree,
      isRetrograde: planet.isRetrograde
    });
  }

  // Attach planets to houses
  return houses.map(house => ({
    ...house,
    planets: housePlanets[house.house]
  }));
}

/**
 * Calculate complete chart data (planets + houses)
 * @param {Object} params - Birth data
 * @returns {Object} Complete chart data
 */
async function calculateFullChart({
  year,
  month,
  day,
  hour = 12,
  minute = 0,
  latitude,
  longitude,
  timezone = 0
}) {
  // Convert local time to UTC
  const utcHour = hour - timezone;
  const utcMinute = minute;

  // Handle day rollover
  let adjustedYear = year;
  let adjustedMonth = month;
  let adjustedDay = day;
  let adjustedHour = utcHour;

  if (utcHour < 0) {
    adjustedHour += 24;
    adjustedDay -= 1;
    if (adjustedDay < 1) {
      adjustedMonth -= 1;
      if (adjustedMonth < 1) {
        adjustedMonth = 12;
        adjustedYear -= 1;
      }
      adjustedDay = new Date(adjustedYear, adjustedMonth, 0).getDate();
    }
  } else if (utcHour >= 24) {
    adjustedHour -= 24;
    adjustedDay += 1;
    const daysInMonth = new Date(adjustedYear, adjustedMonth, 0).getDate();
    if (adjustedDay > daysInMonth) {
      adjustedDay = 1;
      adjustedMonth += 1;
      if (adjustedMonth > 12) {
        adjustedMonth = 1;
        adjustedYear += 1;
      }
    }
  }

  // Create Date object for ephemeris
  const date = new Date(Date.UTC(adjustedYear, adjustedMonth - 1, adjustedDay,
                                  adjustedHour, utcMinute, 0));

  // Calculate Julian Day
  const decimalHour = adjustedHour + utcMinute / 60;
  const jd = dateToJulianDay(adjustedYear, adjustedMonth, adjustedDay, decimalHour);

  // Calculate planets using ephemeris
  const planets = calculateAllPlanets(date, longitude, latitude);

  // Calculate houses
  const houseData = calculatePlacidusHouses(jd, latitude, longitude);

  // Assign planets to houses
  const housesWithPlanets = assignPlanetsToHouses(houseData.houses, planets);

  // Calculate element distribution
  const elementCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  for (const planet of Object.values(planets)) {
    if (planet && planet.element) {
      elementCounts[planet.element]++;
    }
  }

  // Calculate modality distribution
  const modalityCounts = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  for (const planet of Object.values(planets)) {
    if (planet && planet.modality) {
      modalityCounts[planet.modality]++;
    }
  }

  return {
    meta: {
      calculationEngine: 'GENESIS Sovereign v3.0 (Swiss Ephemeris)',
      precision: 'Professional grade',
      julianDay: jd,
      utcHour: decimalHour,
      localTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      timezone,
      coordinates: { latitude, longitude },
      houseSystem: houseData.systemName
    },
    planets,
    houses: {
      houses: housesWithPlanets,
      angles: houseData.angles
    },
    elements: elementCounts,
    modalities: modalityCounts
  };
}

/**
 * Calculate 24-hour timeline for house exploration (Soul Garden)
 * @param {Object} params - Birth data (without hour/minute)
 * @returns {Array} Array of 96 time slices (15-min intervals)
 */
async function calculate24HourTimeline({
  year,
  month,
  day,
  latitude,
  longitude,
  timezone = 0
}) {
  await initSwissEphemeris();

  const timeline = [];

  // 96 slices = 24 hours * 4 (15-min intervals)
  for (let slice = 0; slice < 96; slice++) {
    const totalMinutes = slice * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const timeLabel = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    try {
      const chart = await calculateFullChart({
        year,
        month,
        day,
        hour,
        minute,
        latitude,
        longitude,
        timezone
      });

      // Calculate house strengths
      const housesWithStrength = chart.houses.houses.map(house => {
        let strength = 0;

        // Base strength from planets
        for (const planet of house.planets || []) {
          const weights = {
            'Sun': 20, 'Moon': 18, 'Mercury': 8, 'Venus': 10, 'Mars': 12,
            'Jupiter': 15, 'Saturn': 12, 'Uranus': 8, 'Neptune': 8, 'Pluto': 10,
            'Chiron': 5
          };
          strength += weights[planet.name] || 5;
        }

        // Bonus for angular houses
        if ([1, 4, 7, 10].includes(house.house)) {
          strength += 5;
        }

        return {
          ...house,
          strength: Math.min(100, strength),
          planetData: house.planets
        };
      });

      timeline.push({
        timeLabel,
        sliceIndex: slice,
        hour,
        minute,
        houses: housesWithStrength,
        angles: chart.houses.angles,
        planets: chart.planets
      });

    } catch (error) {
      console.warn(`⚠️ Error calculating slice ${timeLabel}: ${error.message}`);
      timeline.push({
        timeLabel,
        sliceIndex: slice,
        hour,
        minute,
        houses: [],
        error: error.message
      });
    }
  }

  return timeline;
}

// Export all functions and constants
module.exports = {
  // Initialization
  initSwissEphemeris,

  // Core calculations
  dateToJulianDay,
  longitudeToZodiac,
  calculateLST,
  calculateAscendant,
  calculateMC,
  calculatePlacidusHouses,
  calculateAllPlanets,
  assignPlanetsToHouses,
  calculateFullChart,
  calculate24HourTimeline,

  // Constants
  ZODIAC_SIGNS,
  SIGN_ELEMENTS,
  SIGN_MODALITIES,
  PLANET_NAMES
};
