/**
 * houseStrength.js
 *
 * House analysis: getHouseName, SIGN_RULERS, HOUSE_TYPE, PLANET_WEIGHTS,
 * assignPlanetsToHouses, computeHouseStrength, getRulerScore, getAngularBonus,
 * and related constants.
 *
 * Extracted from functions/routes/astrology.js during modularisation.
 */

/**
 * Get traditional house name/meaning
 */
function getHouseName(houseNum) {
  const names = {
    1: 'Self & Identity',
    2: 'Money & Values',
    3: 'Communication',
    4: 'Home & Family',
    5: 'Creativity & Romance',
    6: 'Health & Service',
    7: 'Partnerships',
    8: 'Transformation',
    9: 'Philosophy & Travel',
    10: 'Career & Status',
    11: 'Friends & Dreams',
    12: 'Spirituality & Secrets'
  };
  return names[houseNum] || `House ${houseNum}`;
}

// ---------------------------------------------------------------------------
// HOUSE STRENGTH ENGINE (What-If Timeline / Soul Garden)
// ---------------------------------------------------------------------------

// Traditional sign rulers
const SIGN_RULERS = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',      // Traditional
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',   // Traditional
  Pisces: 'Jupiter'
};

// House type classification for angularity
const HOUSE_TYPE = {
  1: 'angular', 2: 'succedent', 3: 'cadent',
  4: 'angular', 5: 'succedent', 6: 'cadent',
  7: 'angular', 8: 'succedent', 9: 'cadent',
  10: 'angular', 11: 'succedent', 12: 'cadent'
};

/**
 * Get angular bonus points for house strength
 * @param {number} houseNum - House number 1-12
 * @returns {number} - Bonus points (0-15)
 */
function getAngularBonus(houseNum) {
  const type = HOUSE_TYPE[houseNum];
  if (type === 'angular') return 15;     // Full 15 pts
  if (type === 'succedent') return 8;    // Medium
  if (type === 'cadent') return 3;       // Low
  return 0;
}

// Planet weights for house occupancy contribution
const PLANET_WEIGHTS = {
  sun: 12,
  moon: 10,
  mercury: 6,
  venus: 8,
  mars: 9,
  jupiter: 8,
  saturn: 7,
  uranus: 5,
  neptune: 5,
  pluto: 5
};

/**
 * Assign planets to houses based on their longitudes and house cusps
 * @param {Object} houses - Output of calculatePlacidusHouses().houses
 * @param {Object} planetLongitudes - Map: { sun: deg, moon: deg, ... }
 * @returns {Object} - Map houseNum -> { planets: [planetName...] }
 */
function assignPlanetsToHouses(houses, planetLongitudes) {
  const result = {};
  for (let i = 1; i <= 12; i++) {
    result[i] = { planets: [] };
  }

  // Build array of cusps in order
  const cusps = [];
  for (let i = 1; i <= 12; i++) {
    cusps.push({ house: i, lon: houses[i].cusp });
  }

  // Sort by longitude
  cusps.sort((a, b) => a.lon - b.lon);

  function findHouseForLongitude(lonDeg) {
    // Houses are segments between cusps, wrapping around 360
    for (let i = 0; i < cusps.length; i++) {
      const current = cusps[i];
      const next = cusps[(i + 1) % cusps.length];

      const start = current.lon;
      const end = next.lon;
      const houseNum = current.house;

      if (start < end) {
        // Normal segment
        if (lonDeg >= start && lonDeg < end) return houseNum;
      } else {
        // Wrap-around segment (crosses 0\u00B0)
        if (lonDeg >= start || lonDeg < end) return houseNum;
      }
    }
    return 1; // Fallback
  }

  for (const [planetName, lonDeg] of Object.entries(planetLongitudes)) {
    if (lonDeg == null || isNaN(lonDeg)) continue;
    const houseNum = findHouseForLongitude(lonDeg);
    result[houseNum].planets.push(planetName);
  }

  return result;
}

/**
 * Get ruler dignity score for a house
 * @param {Object} houseZodiac - longitudeToZodiac() result
 * @returns {Object} - { score: number, ruler: string }
 */
function getRulerScore(houseZodiac) {
  const { sign } = houseZodiac;
  const ruler = SIGN_RULERS[sign];

  // Baseline score - can be enhanced later with ruler placement analysis
  if (!ruler) return { score: 12, ruler: null };

  return {
    score: 15,   // Mid-high baseline
    ruler
  };
}

/**
 * Compute House Strength score (0-100)
 * @param {number} houseNum - House number 1-12
 * @param {Object} houseZodiac - longitudeToZodiac() result + cusp
 * @param {Array<string>} planetsInHouse - Array of planet names
 * @returns {Object} - { strength, components }
 */
function computeHouseStrength(houseNum, houseZodiac, planetsInHouse) {
  // 1) Planetary occupancy (0-40)
  let occupancy = 0;
  for (const p of planetsInHouse) {
    const key = p.toLowerCase();
    occupancy += PLANET_WEIGHTS[key] || 4;
  }
  if (occupancy > 40) occupancy = 40;

  // 2) Ruler dignity (0-25)
  const { score: rulerScoreRaw, ruler } = getRulerScore(houseZodiac);
  const rulerScore = Math.min(25, Math.max(0, rulerScoreRaw));

  // 3) Angularity (0-15)
  const angularScore = getAngularBonus(houseNum);

  // 4) Aspect/activity placeholder (0-20) - based on occupancy activity
  const activityScore = Math.min(20, planetsInHouse.length * 4);

  const total = occupancy + rulerScore + angularScore + activityScore;
  const strength = Math.round(Math.min(100, total));

  return {
    strength,
    components: {
      occupancy,
      rulerScore,
      angularScore,
      activityScore,
      ruler
    }
  };
}

module.exports = {
  getHouseName,
  SIGN_RULERS,
  HOUSE_TYPE,
  PLANET_WEIGHTS,
  assignPlanetsToHouses,
  computeHouseStrength,
  getRulerScore,
  getAngularBonus
};
