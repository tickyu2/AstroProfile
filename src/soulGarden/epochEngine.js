/**
 * ============================================================================
 * EPOCH GENERATION ENGINE
 * ============================================================================
 * Generate life epochs (chapters) from a birth chart.
 * This is a symbolic engine, not predictive.
 *
 * It uses:
 * - Saturn cycles (29.5 year return)
 * - Progressed Moon cycles
 * - House strength patterns
 * - Planetary emphasis
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

/**
 * Generate life epochs from a birth chart
 * @param {Object} chart - The birth chart data
 * @param {Array} chart.planets - Array of planet objects with name, sign, house
 * @param {Array} chart.houses - Array of house objects with strength
 * @param {Array} chart.aspects - Array of aspect objects with a, b, type, orb
 * @param {Object} chart.rising - Rising sign data with sign property
 * @returns {Array} Array of epoch objects
 */
export function generateEpochs(chart) {
  const epochs = [];

  // 0-14: Moon + 4th house themes - The Lunar Years
  epochs.push({
    label: "Early Life",
    startAge: 0,
    endAge: 14,
    dominantHouses: [4, 1],
    dominantPlanets: ["Moon"],
    dominantAspects: findAspectsInvolving(chart, ["Moon"]),
    lifeThemes: ["roots", "safety", "family imprinting"],
    planetaryAge: "Moon",
    symbolism: "The seed in dark soil, drinking from the mother waters"
  });

  // 15-21: Mercury + 3rd house themes - The Mind Awakens
  epochs.push({
    label: "Apprenticeship",
    startAge: 15,
    endAge: 21,
    dominantHouses: [3, 6],
    dominantPlanets: ["Mercury"],
    dominantAspects: findAspectsInvolving(chart, ["Mercury"]),
    lifeThemes: ["learning", "identity testing", "skill building"],
    planetaryAge: "Mercury",
    symbolism: "The first flight from the nest, testing new wings"
  });

  // 22-29: Saturn pre-return - The Building Years
  epochs.push({
    label: "Becoming",
    startAge: 22,
    endAge: 29,
    dominantHouses: [10, 7],
    dominantPlanets: ["Saturn"],
    dominantAspects: findAspectsInvolving(chart, ["Saturn"]),
    lifeThemes: ["responsibility", "purpose", "relationship patterns"],
    planetaryAge: "Saturn (Waxing)",
    symbolism: "The architect's first blueprints, foundations being laid"
  });

  // 29-31: Saturn Return - The Great Threshold
  epochs.push({
    label: "Saturn Return",
    startAge: 29,
    endAge: 31,
    dominantHouses: [10, 4],
    dominantPlanets: ["Saturn"],
    dominantAspects: findAspectsInvolving(chart, ["Saturn"]),
    lifeThemes: ["restructuring", "truth", "maturity"],
    planetaryAge: "Saturn (Return)",
    symbolism: "The tower that must fall so the cathedral can rise"
  });

  // 32-42: Jupiter + 9th house themes - The Expansion
  epochs.push({
    label: "Expansion",
    startAge: 32,
    endAge: 42,
    dominantHouses: [9, 11],
    dominantPlanets: ["Jupiter"],
    dominantAspects: findAspectsInvolving(chart, ["Jupiter"]),
    lifeThemes: ["meaning", "travel", "philosophy", "vision"],
    planetaryAge: "Jupiter",
    symbolism: "The pilgrim walking the wider road, gathering wisdom"
  });

  // 43-58: Uranus opposition + 8th house themes - The Turning
  epochs.push({
    label: "The Great Turning",
    startAge: 43,
    endAge: 58,
    dominantHouses: [8, 2],
    dominantPlanets: ["Uranus", "Pluto"],
    dominantAspects: findAspectsInvolving(chart, ["Uranus", "Pluto"]),
    lifeThemes: ["awakening", "reinvention", "shadow integration"],
    planetaryAge: "Uranus (Opposition)",
    symbolism: "The phoenix in flames, dying to be reborn"
  });

  // 58-72: Second Saturn Return era
  epochs.push({
    label: "The Harvest",
    startAge: 58,
    endAge: 72,
    dominantHouses: [9, 10],
    dominantPlanets: ["Saturn", "Jupiter"],
    dominantAspects: findAspectsInvolving(chart, ["Saturn", "Jupiter"]),
    lifeThemes: ["legacy", "mastery", "mentorship"],
    planetaryAge: "Saturn (Second Return)",
    symbolism: "The elder tree, roots deep, branches sheltering others"
  });

  // 72+: Wisdom era - The Elder Flame
  epochs.push({
    label: "The Elder Flame",
    startAge: 72,
    endAge: 120,
    dominantHouses: [9, 12],
    dominantPlanets: ["Jupiter", "Neptune"],
    dominantAspects: findAspectsInvolving(chart, ["Jupiter", "Neptune"]),
    lifeThemes: ["teaching", "legacy", "spiritual integration"],
    planetaryAge: "Neptune/Jupiter",
    symbolism: "The lighthouse keeper, guiding ships through the dark"
  });

  // Enrich epochs with chart-specific data
  return epochs.map(epoch => enrichEpochWithChart(epoch, chart));
}

/**
 * Find aspects involving specific planets
 * @param {Object} chart - The birth chart
 * @param {Array} planets - Array of planet names to search for
 * @returns {Array} Filtered aspects
 */
function findAspectsInvolving(chart, planets) {
  if (!chart?.aspects || !Array.isArray(chart.aspects)) return [];

  const planetSet = new Set(planets.map(p => p.toLowerCase()));

  return chart.aspects.filter(aspect => {
    const planetA = (aspect.a || aspect.planet1 || '').toLowerCase();
    const planetB = (aspect.b || aspect.planet2 || '').toLowerCase();
    return planetSet.has(planetA) || planetSet.has(planetB);
  });
}

/**
 * Enrich an epoch with chart-specific data
 * @param {Object} epoch - The base epoch
 * @param {Object} chart - The birth chart
 * @returns {Object} Enriched epoch
 */
function enrichEpochWithChart(epoch, chart) {
  const enriched = { ...epoch };

  // Get house strengths for dominant houses
  if (chart?.houses && Array.isArray(chart.houses)) {
    enriched.houseStrengths = epoch.dominantHouses.map(houseNum => {
      const house = chart.houses.find(h => h.house === houseNum);
      return {
        house: houseNum,
        strength: house?.strength || 0,
        sign: house?.sign || 'Unknown'
      };
    });
  }

  // Get planet positions for dominant planets
  if (chart?.planets && Array.isArray(chart.planets)) {
    enriched.planetPositions = epoch.dominantPlanets.map(planetName => {
      const planet = chart.planets.find(p =>
        (p.name || p.planet || '').toLowerCase() === planetName.toLowerCase()
      );
      return {
        planet: planetName,
        sign: planet?.sign || 'Unknown',
        house: planet?.house || 0,
        retrograde: planet?.retrograde || false
      };
    });
  }

  // Calculate epoch intensity based on chart factors
  enriched.intensity = calculateEpochIntensity(epoch, chart);

  return enriched;
}

/**
 * Calculate the intensity of an epoch based on chart factors
 * @param {Object} epoch - The epoch
 * @param {Object} chart - The birth chart
 * @returns {number} Intensity score 0-100
 */
function calculateEpochIntensity(epoch, chart) {
  let intensity = 50; // Base intensity

  // Boost if dominant planets are angular (houses 1, 4, 7, 10)
  if (chart?.planets) {
    epoch.dominantPlanets.forEach(planetName => {
      const planet = chart.planets.find(p =>
        (p.name || p.planet || '').toLowerCase() === planetName.toLowerCase()
      );
      if (planet && [1, 4, 7, 10].includes(planet.house)) {
        intensity += 15;
      }
    });
  }

  // Boost based on aspect count
  if (epoch.dominantAspects) {
    intensity += Math.min(epoch.dominantAspects.length * 5, 20);
  }

  // Boost based on house strengths
  if (chart?.houses) {
    epoch.dominantHouses.forEach(houseNum => {
      const house = chart.houses.find(h => h.house === houseNum);
      if (house?.strength > 70) {
        intensity += 10;
      }
    });
  }

  return Math.min(intensity, 100);
}

/**
 * Get the current epoch for a given age
 * @param {Array} epochs - Array of epochs
 * @param {number} age - Current age
 * @returns {Object|null} Current epoch or null
 */
export function getCurrentEpoch(epochs, age) {
  return epochs.find(e => age >= e.startAge && age <= e.endAge) || null;
}

/**
 * Get upcoming epochs from current age
 * @param {Array} epochs - Array of epochs
 * @param {number} age - Current age
 * @returns {Array} Future epochs
 */
export function getUpcomingEpochs(epochs, age) {
  return epochs.filter(e => e.startAge > age);
}

/**
 * Get past epochs from current age
 * @param {Array} epochs - Array of epochs
 * @param {number} age - Current age
 * @returns {Array} Past epochs
 */
export function getPastEpochs(epochs, age) {
  return epochs.filter(e => e.endAge < age);
}

export default {
  generateEpochs,
  getCurrentEpoch,
  getUpcomingEpochs,
  getPastEpochs
};
