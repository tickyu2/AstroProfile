/**
 * Sovereign Western Chart Service
 *
 * Frontend service for calling the Sovereign Astronomical Engine.
 * Now uses Python Swiss Ephemeris as primary (more precise),
 * with fallback to Node.js astronomia library.
 *
 * Part of GENESIS - Sovereign Astronomical Foundation
 * Built by: Brother Claude Code
 * December 16, 2024 | Updated: January 2026 (Python Swiss Ephemeris)
 */

import { calculateMoonPhase } from './moonPhaseService';

// Python Swiss Ephemeris Cloud Run URL (PRIMARY - more precise)
const PYTHON_CHART_URL = 'https://calculate-natal-chart-sjpjwnbsmq-uc.a.run.app';

// Node.js Cloud Run URL (FALLBACK)
const PRODUCTION_URL = 'https://calculatewesternchart-sjpjwnbsmq-uc.a.run.app';

// Local emulator URL for development
const EMULATOR_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/calculateWesternChart';

// Feature flag for Python vs Node.js
const USE_PYTHON_ENGINE = true;

/**
 * Get the appropriate API URL based on environment
 */
const getApiUrl = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
    return EMULATOR_URL;
  }
  return PRODUCTION_URL;
};

// Planet symbols for display
const PLANET_SYMBOLS = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  north_node: '☊', south_node: '☋', chiron: '⚷',
  ceres: '⚳', pallas: '⚴', juno: '⚵', vesta: '⚶'
};

// Major aspects and their properties
const ASPECT_INFO = {
  conjunction: { nature: 'major', quality: 'neutral', symbol: '☌' },
  opposition: { nature: 'major', quality: 'challenging', symbol: '☍' },
  trine: { nature: 'major', quality: 'harmonious', symbol: '△' },
  square: { nature: 'major', quality: 'challenging', symbol: '□' },
  sextile: { nature: 'major', quality: 'harmonious', symbol: '⚹' },
  quincunx: { nature: 'minor', quality: 'challenging', symbol: '⚻' },
  semisextile: { nature: 'minor', quality: 'neutral', symbol: '⚺' },
  semisquare: { nature: 'minor', quality: 'challenging', symbol: '∠' },
  sesquiquadrate: { nature: 'minor', quality: 'challenging', symbol: '⚼' }
};

/**
 * Transform Python aspect data to UI-expected format
 */
function transformAspect(aspect) {
  const info = ASPECT_INFO[aspect.aspect] || { nature: 'minor', quality: 'neutral', symbol: '?' };
  return {
    planet1: {
      name: aspect.planet1,
      symbol: PLANET_SYMBOLS[aspect.planet1] || '?'
    },
    planet2: {
      name: aspect.planet2,
      symbol: PLANET_SYMBOLS[aspect.planet2] || '?'
    },
    aspect: aspect.aspect,
    angle: aspect.angle,
    orb: aspect.orb,
    exactness: aspect.exactness,
    applying: aspect.applying,
    nature: info.nature,
    quality: info.quality,
    symbol: info.symbol
  };
}

/**
 * Transform Python Swiss Ephemeris response to expected format
 * @param {Object} data - Python API response
 * @param {string} birthDate - Birth date in YYYY-MM-DD format for moon phase calculation
 */
function transformPythonResponse(data, birthDate) {
  const planets = data.planets || {};
  const houses = data.houses || {};

  // Build rising from ascendant data
  const ascendant = data.ascendant || houses.ascendant || {};
  const rising = {
    sign: ascendant.sign || 'Unknown',
    degree: ascendant.degree || 0,
    longitude: ascendant.longitude || 0,
    degreeFormatted: `${(ascendant.degree || 0).toFixed(2)}° ${ascendant.sign || ''}`
  };

  // Calculate moon phase at birth (Python doesn't provide this yet)
  let moonPhase = null;
  if (birthDate) {
    try {
      const birthDateTime = new Date(birthDate);
      moonPhase = calculateMoonPhase(birthDateTime);
    } catch (e) {
      console.warn('Could not calculate moon phase:', e);
    }
  }

  // Transform planets to include name and symbol for UI display
  const transformedPlanets = {};
  Object.entries(planets).forEach(([key, planet]) => {
    const capitalizedName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    transformedPlanets[key] = {
      ...planet,
      name: capitalizedName,
      symbol: PLANET_SYMBOLS[key] || '?',
      degreeFormatted: planet.formatted || `${planet.degree?.toFixed(2)}° ${planet.sign}`,
      isRetrograde: planet.retrograde || false
    };
  });

  return {
    sun: planets.sun ? {
      sign: planets.sun.sign,
      degree: planets.sun.degree,
      longitude: planets.sun.longitude,
      degreeFormatted: planets.sun.formatted || `${planets.sun.degree?.toFixed(2)}° ${planets.sun.sign}`,
      element: planets.sun.element,
      modality: planets.sun.modality
    } : null,
    moon: planets.moon ? {
      sign: planets.moon.sign,
      degree: planets.moon.degree,
      longitude: planets.moon.longitude,
      degreeFormatted: planets.moon.formatted || `${planets.moon.degree?.toFixed(2)}° ${planets.moon.sign}`,
      element: planets.moon.element,
      modality: planets.moon.modality
    } : null,
    rising,
    planets: transformedPlanets,
    houses: houses.cusps || houses,
    moonPhase,
    aspects: (data.aspects || []).map(transformAspect),
    elementBalance: data.elements ? {
      dominant: data.elements.dominant?.element || data.elements.dominant,
      secondary: data.elements.weakest?.element,
      fire: data.elements.fire || 0,
      earth: data.elements.earth || 0,
      air: data.elements.air || 0,
      water: data.elements.water || 0
    } : null,
    modalities: data.modalities || null,
    julianDay: data.birthData?.julianDay,
    calculatedAt: new Date().toISOString(),
    engine: 'Swiss Ephemeris (Python)',
    houseSystem: data.houseSystem || 'Placidus'
  };
}

/**
 * Calculate chart using Python Swiss Ephemeris (more precise)
 */
async function calculateWithPython({ birthDate, birthTime, latitude, longitude, timezone }) {
  const requestBody = {
    birthDate,
    birthTime: birthTime || '12:00',
    latitude: latitude || 0,
    longitude: longitude || 0,
    timezone: timezone || 'UTC'
  };

  console.log('🐍 Calling Python Swiss Ephemeris:', requestBody);

  const response = await fetch(PYTHON_CHART_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Python API error: ${response.status}`);
  }

  const data = await response.json();
  return transformPythonResponse(data, birthDate);
}

/**
 * Calculate chart using Node.js astronomia (fallback)
 */
async function calculateWithNodeJS({ birthDate, birthTime, latitude, longitude, timezone }) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = (birthTime || '12:00').split(':').map(Number);

  const requestBody = { year, month, day, hour, minute, latitude, longitude, timezone };

  console.log('📊 Calling Node.js Astronomia (fallback):', requestBody);

  const response = await fetch(getApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Node.js API error: ${response.status}`);
  }

  const data = await response.json();

  // Transform Node.js response
  const trinity = data.constitutionalTrinity || {};
  return {
    sun: trinity.sun,
    moon: trinity.moon,
    rising: trinity.rising,
    planets: data.planets,
    houses: data.houses,
    moonPhase: data.moonPhase,
    aspects: data.aspects,
    elementBalance: data.elementProfile ? {
      dominant: data.elementProfile.dominant,
      secondary: data.elementProfile.secondary,
      fire: data.elementProfile.distribution?.Fire || 0,
      earth: data.elementProfile.distribution?.Earth || 0,
      air: data.elementProfile.distribution?.Air || 0,
      water: data.elementProfile.distribution?.Water || 0
    } : null,
    julianDay: data.meta?.julianDay,
    calculatedAt: data.meta?.calculatedAt,
    engine: data.meta?.calculationEngine || 'Astronomia (Node.js)'
  };
}

/**
 * Calculate sovereign Western chart with real planetary positions
 * Uses Python Swiss Ephemeris as primary (more precise), with Node.js fallback
 *
 * @param {Object} params - Birth data parameters
 * @param {string} params.birthDate - Birth date in 'YYYY-MM-DD' format
 * @param {string} params.birthTime - Birth time in 'HH:MM' format (optional, defaults to noon)
 * @param {number} params.latitude - Birth location latitude
 * @param {number} params.longitude - Birth location longitude
 * @param {string} params.timezone - Timezone string (optional, defaults to UTC)
 * @returns {Promise<Object>} - Sovereign chart data with Sun/Moon/Rising
 */
export async function calculateSovereignChart({
  birthDate,
  birthTime = '12:00',
  latitude = 0,
  longitude = 0,
  timezone = 'UTC'
}) {
  const params = { birthDate, birthTime, latitude, longitude, timezone };

  // Try Python Swiss Ephemeris first (more precise)
  if (USE_PYTHON_ENGINE) {
    try {
      const result = await calculateWithPython(params);
      console.log('✅ Swiss Ephemeris Chart:', {
        sun: `${result.sun?.sign} at ${result.sun?.degreeFormatted}`,
        moon: `${result.moon?.sign} at ${result.moon?.degreeFormatted}`,
        rising: `${result.rising?.sign} at ${result.rising?.degreeFormatted}`,
        dominantElement: result.elementBalance?.dominant,
        engine: result.engine
      });
      return result;
    } catch (pythonError) {
      console.warn('⚠️ Python Swiss Ephemeris failed, falling back to Node.js:', pythonError.message);
    }
  }

  // Fallback to Node.js astronomia
  try {
    const result = await calculateWithNodeJS(params);
    console.log('✅ Astronomia Chart (fallback):', {
      sun: `${result.sun?.sign} at ${result.sun?.degreeFormatted}`,
      moon: `${result.moon?.sign} at ${result.moon?.degreeFormatted}`,
      rising: `${result.rising?.sign} at ${result.rising?.degreeFormatted}`,
      dominantElement: result.elementBalance?.dominant,
      engine: result.engine
    });
    return result;
  } catch (nodeError) {
    console.error('❌ Both calculation engines failed');
    throw nodeError;
  }
}

/**
 * Calculate sovereign chart with graceful fallback
 * Returns sovereign data if location is available, otherwise returns null
 *
 * @param {Object} params - Birth data parameters
 * @returns {Promise<Object|null>} - Sovereign chart data or null if insufficient data
 */
export async function calculateSovereignChartWithFallback(params) {
  const { birthDate, birthTime, latitude, longitude, timezone } = params;

  // Check if we have the minimum required data
  if (!birthDate) {
    console.log('⚠️ Sovereign Chart: No birth date provided');
    return null;
  }

  // If no location, we can still calculate Sun and Moon (they don't need location)
  // But Rising sign requires latitude/longitude
  const hasLocation = latitude !== undefined && longitude !== undefined &&
                      latitude !== 0 && longitude !== 0;

  if (!hasLocation) {
    console.log('⚠️ Sovereign Chart: No location - Rising sign will be approximate');
  }

  try {
    const sovereignData = await calculateSovereignChart({
      birthDate,
      birthTime,
      latitude: latitude || 0,
      longitude: longitude || 0,
      timezone: timezone || 'UTC'
    });

    // Mark if Rising sign is accurate or approximate
    if (sovereignData && sovereignData.rising && sovereignData.rising.sign) {
      sovereignData.rising.isAccurate = hasLocation;
      sovereignData.rising.note = hasLocation
        ? 'Calculated with exact birth location'
        : 'Approximate - birth location not provided';
    }

    return sovereignData;
  } catch (error) {
    console.error('⚠️ Sovereign Chart calculation failed, returning null:', error);
    return null;
  }
}

/**
 * Transform sovereign chart data for profile storage
 * Merges sovereign data with simple zodiac calculation
 *
 * @param {Object} simpleWestern - Simple date-based zodiac result
 * @param {Object} sovereignData - Sovereign chart API response
 * @returns {Object} - Enhanced western zodiac data
 */
export function mergeWithSovereignData(simpleWestern, sovereignData) {
  if (!sovereignData) {
    // No sovereign data - return simple calculation with flag
    return {
      ...simpleWestern,
      sovereignCalculation: null,
      calculationType: 'simple' // Date-based only
    };
  }

  return {
    ...simpleWestern,
    // The sovereign Sun sign should match simple calculation for sun
    // But sovereign has precise degree and additional data
    sovereignCalculation: {
      sun: sovereignData.sun,
      moon: sovereignData.moon,
      rising: sovereignData.rising,
      planets: sovereignData.planets,  // All 8 planets
      houses: sovereignData.houses,    // Placidus house cusps (12 houses)
      moonPhase: sovereignData.moonPhase,  // Moon phase at birth
      aspects: sovereignData.aspects,  // Planetary aspects
      elementBalance: sovereignData.elementBalance,
      julianDay: sovereignData.julianDay,
      calculatedAt: sovereignData.calculatedAt,
      engine: sovereignData.engine
    },
    calculationType: 'sovereign' // Full astronomical calculation
  };
}

export default {
  calculateSovereignChart,
  calculateSovereignChartWithFallback,
  mergeWithSovereignData
};
