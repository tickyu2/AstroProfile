/**
 * Sovereign Western Chart Service
 *
 * Frontend service for calling the Sovereign Astronomical Engine.
 * Calculates real Sun/Moon/Rising positions using astronomia library
 * with VSOP87 theory - no external API dependencies.
 *
 * Part of GENESIS - Sovereign Astronomical Foundation
 * Built by: Brother Claude Code
 * December 16, 2024
 */

// Production Cloud Run URL
const PRODUCTION_URL = 'https://calculatewesternchart-sjpjwnbsmq-uc.a.run.app';

// Local emulator URL for development
const EMULATOR_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/calculateWesternChart';

/**
 * Get the appropriate API URL based on environment
 */
const getApiUrl = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
    return EMULATOR_URL;
  }
  return PRODUCTION_URL;
};

/**
 * Calculate sovereign Western chart with real planetary positions
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
  try {
    // Parse date components
    const [year, month, day] = birthDate.split('-').map(Number);

    // Parse time components
    const [hour, minute] = (birthTime || '12:00').split(':').map(Number);

    const requestBody = {
      year,
      month,
      day,
      hour,
      minute,
      latitude,
      longitude,
      timezone
    };
    console.log('🌟 Calling Sovereign Chart API:', {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`,
      location: `${latitude}, ${longitude}`,
      timezone,
      fullBody: requestBody
    });

    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.details || errorData.error || `Sovereign Chart API error: ${response.status}`;
      console.error('❌ Sovereign Chart API Error Details:', errorData);
      throw new Error(errorMsg);
    }

    const data = await response.json();

    // Transform API response to expected format
    // API returns: { constitutionalTrinity, elementProfile, planets, meta }
    // Service returns: { sun, moon, rising, elementBalance, ... }
    const trinity = data.constitutionalTrinity || {};
    const transformed = {
      sun: trinity.sun,
      moon: trinity.moon,
      rising: trinity.rising,
      planets: data.planets,
      houses: data.houses,  // Placidus house cusps
      moonPhase: data.moonPhase,  // Moon phase at birth
      aspects: data.aspects,  // Planetary aspects
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
      engine: data.meta?.calculationEngine
    };

    console.log('✅ Sovereign Chart Response:', {
      sun: `${transformed.sun?.sign} at ${transformed.sun?.degreeFormatted}`,
      moon: `${transformed.moon?.sign} at ${transformed.moon?.degreeFormatted}`,
      rising: `${transformed.rising?.sign} at ${transformed.rising?.degreeFormatted}`,
      dominantElement: transformed.elementBalance?.dominant
    });

    return transformed;
  } catch (error) {
    console.error('❌ Sovereign Chart API Error:', error);
    throw error;
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
