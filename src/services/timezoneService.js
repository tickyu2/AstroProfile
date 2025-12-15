/**
 * Timezone Service
 *
 * Frontend service for accurate historical timezone lookups via TimezoneDB.
 * Essential for accurate birth time calculations in BaZi and Western astrology.
 *
 * Why this matters:
 * - DST rules have changed many times throughout history
 * - Timezone boundaries shift with political changes
 * - WWII "War Time" had different offsets
 * - Some regions (e.g., Indiana) had county-level variations
 *
 * Part of GENESIS - Accuracy & Transparency Foundation
 * Built for: Open source, decentralized, unstoppable truth
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 15, 2024
 */

// Cloud Function URLs
const PRODUCTION_URL = 'https://gethistoricaltimezone-sjpjwnbsmq-uc.a.run.app';
const EMULATOR_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/getHistoricalTimezone';

// Get the appropriate URL based on environment
const getApiUrl = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
    return EMULATOR_URL;
  }
  return PRODUCTION_URL;
};

/**
 * Get historical timezone data for a specific location and date
 *
 * @param {Object} params - Request parameters
 * @param {number} params.latitude - Location latitude
 * @param {number} params.longitude - Location longitude
 * @param {string} params.birthDate - ISO date string (e.g., "1975-03-15")
 * @param {string} params.birthTime - Time string in 24h format (e.g., "14:30")
 * @returns {Promise<Object>} - Timezone data with historical accuracy
 *
 * @example
 * const tz = await getHistoricalTimezone({
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   birthDate: '1975-03-15',
 *   birthTime: '02:30'
 * });
 *
 * // Returns:
 * // {
 * //   success: true,
 * //   timezone: {
 * //     zoneName: 'America/New_York',
 * //     abbreviation: 'EST',
 * //     gmtOffset: -18000,
 * //     gmtOffsetHours: -5,
 * //     formattedOffset: '-05:00',
 * //     dst: false,
 * //     dstName: 'Standard Time',
 * //     countryCode: 'US',
 * //     countryName: 'United States'
 * //   },
 * //   meta: { ... }
 * // }
 */
export async function getHistoricalTimezone({ latitude, longitude, birthDate, birthTime }) {
  try {
    console.log('🕐 Looking up historical timezone:', {
      lat: latitude,
      lng: longitude,
      date: birthDate,
      time: birthTime
    });

    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude,
        longitude,
        birthDate,
        birthTime
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ Historical timezone result:', {
      zone: data.timezone?.zoneName,
      offset: data.timezone?.formattedOffset,
      dst: data.timezone?.dst
    });

    return data;

  } catch (error) {
    console.error('❌ Timezone lookup error:', error);

    // Return a fallback that indicates the error but doesn't break the app
    return {
      success: false,
      error: error.message,
      timezone: null,
      meta: {
        fallback: true,
        reason: 'TimezoneDB lookup failed'
      }
    };
  }
}

/**
 * Calculate the UTC time from local time using historical timezone data
 *
 * @param {string} birthDate - ISO date string
 * @param {string} birthTime - Local time in 24h format
 * @param {Object} timezoneData - Result from getHistoricalTimezone
 * @returns {Date} - UTC Date object
 */
export function localToUTC(birthDate, birthTime, timezoneData) {
  if (!timezoneData?.timezone) {
    console.warn('No timezone data provided, using local browser timezone');
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = (birthTime || '12:00').split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0);
  }

  const [year, month, day] = birthDate.split('-').map(Number);
  const [hours, minutes] = (birthTime || '12:00').split(':').map(Number);

  // Create local time as if it were UTC
  const localAsUTC = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

  // Subtract the timezone offset to get true UTC
  // gmtOffset is positive for east of UTC, negative for west
  const offsetMs = timezoneData.timezone.gmtOffset * 1000;
  const utcTime = new Date(localAsUTC.getTime() - offsetMs);

  return utcTime;
}

/**
 * Format timezone info for display
 *
 * @param {Object} timezoneData - Result from getHistoricalTimezone
 * @returns {string} - Human-readable timezone string
 *
 * @example
 * formatTimezoneDisplay(tzData)
 * // => "EST (UTC-05:00) - Standard Time"
 */
export function formatTimezoneDisplay(timezoneData) {
  if (!timezoneData?.timezone) {
    return 'Unknown timezone';
  }

  const tz = timezoneData.timezone;
  return `${tz.abbreviation} (UTC${tz.formattedOffset}) - ${tz.dstName}`;
}

/**
 * Check if DST was in effect at a given historical moment
 *
 * @param {Object} timezoneData - Result from getHistoricalTimezone
 * @returns {boolean} - True if DST was in effect
 */
export function wasDSTActive(timezoneData) {
  return timezoneData?.timezone?.dst === true;
}

export default {
  getHistoricalTimezone,
  localToUTC,
  formatTimezoneDisplay,
  wasDSTActive
};
