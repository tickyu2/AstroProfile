/**
 * Sovereign Solar Term Service
 *
 * Frontend service for calling the Sovereign Solar Term calculations.
 * Provides precise astronomical boundaries for BaZi Year and Month Pillars.
 *
 * Part of GENESIS - Sovereign BaZi Precision
 * Built by: Brother Claude Code
 * December 17, 2024
 */

// Production Cloud Run URLs
const SOLAR_TERMS_URL = 'https://getsolarterms-sjpjwnbsmq-uc.a.run.app';
const BAZI_PILLARS_URL = 'https://getbazipillars-sjpjwnbsmq-uc.a.run.app';

// Cache for Solar Terms (they don't change, so cache by year)
const solarTermsCache = new Map();

/**
 * Fetch Solar Terms for a given year
 * Returns all 24 Solar Terms with precise UTC times
 *
 * @param {number} year - Gregorian year (1600-2200)
 * @returns {Promise<Object>} - Solar Terms data
 */
export async function getSolarTermsForYear(year) {
  // Check cache first
  if (solarTermsCache.has(year)) {
    console.log(`🌞 Solar Terms for ${year} (cached)`);
    return solarTermsCache.get(year);
  }

  try {
    console.log(`🌞 Fetching Solar Terms for ${year}...`);

    const response = await fetch(`${SOLAR_TERMS_URL}?year=${year}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || `Solar Terms API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    solarTermsCache.set(year, data);

    console.log(`✅ Solar Terms for ${year}:`, {
      liChun: data.liChun?.isoString,
      termCount: data.solarTerms?.length
    });

    return data;
  } catch (error) {
    console.error('❌ Solar Terms API Error:', error);
    throw error;
  }
}

/**
 * Get Li Chun (立春) exact moment for a given year
 * This is when the BaZi year changes
 *
 * @param {number} year - Gregorian year
 * @returns {Promise<Object>} - Li Chun timing details
 */
export async function getLiChunExact(year) {
  const data = await getSolarTermsForYear(year);
  return data.liChun;
}

/**
 * Get precise BaZi year and month for a birth date/time
 *
 * @param {Object} params - Birth data
 * @param {number} params.year - Birth year
 * @param {number} params.month - Birth month (1-12)
 * @param {number} params.day - Birth day
 * @param {number} params.hour - Birth hour (0-23)
 * @param {number} params.minute - Birth minute (0-59)
 * @param {number} params.timezone - Timezone offset in hours
 * @returns {Promise<Object>} - Precise BaZi year and month info
 */
export async function getBaziPillarsWithPrecision({
  year, month, day, hour = 12, minute = 0, timezone = 0
}) {
  try {
    console.log(`🎯 Getting precise BaZi pillars for ${year}-${month}-${day} ${hour}:${minute}`);

    const response = await fetch(BAZI_PILLARS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
        timezone: Number(timezone)
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || `BaZi Pillars API error: ${response.status}`);
    }

    const data = await response.json();

    console.log(`✅ BaZi Pillars:`, {
      baziYear: data.baziYear?.baziYear,
      baziMonth: data.baziMonth?.baziMonth,
      bornBeforeLiChun: data.baziYear?.bornBeforeLiChun
    });

    return data;
  } catch (error) {
    console.error('❌ BaZi Pillars API Error:', error);
    throw error;
  }
}

/**
 * Check if a birth date is on or near a Solar Term boundary
 * Returns true if within 24 hours of a Solar Term
 *
 * @param {string} birthDate - Birth date in YYYY-MM-DD format
 * @param {string} birthTime - Birth time in HH:MM format
 * @returns {Promise<Object>} - Boundary status and nearby term
 */
export async function checkSolarTermBoundary(birthDate, birthTime = '12:00') {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);

  // Get Solar Terms for the birth year
  const data = await getSolarTermsForYear(year);

  // Calculate birth Julian Day (approximate)
  const birthJD = dateToJulianDay(year, month, day, hour, minute);

  // Find nearest Solar Term
  let nearestTerm = null;
  let minDistance = Infinity;

  for (const term of data.solarTerms) {
    const distance = Math.abs(term.julianDay - birthJD);
    if (distance < minDistance) {
      minDistance = distance;
      nearestTerm = term;
    }
  }

  // Convert distance to hours
  const hoursFromBoundary = minDistance * 24;
  const isNearBoundary = hoursFromBoundary < 24;

  return {
    isNearBoundary,
    hoursFromBoundary: Math.round(hoursFromBoundary * 10) / 10,
    nearestTerm: nearestTerm ? {
      name: nearestTerm.name,
      english: nearestTerm.english,
      isoString: nearestTerm.isoString,
      isBaziYearBoundary: nearestTerm.isBaziYearBoundary,
      isBaziMonthBoundary: nearestTerm.isBaziMonthBoundary
    } : null,
    note: isNearBoundary
      ? `Birth is within ${Math.round(hoursFromBoundary)} hours of ${nearestTerm.english} (${nearestTerm.name})`
      : null
  };
}

/**
 * Simple Julian Day calculation (for client-side boundary checking)
 */
function dateToJulianDay(year, month, day, hour = 12, minute = 0) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = (hour + minute / 60) / 24;

  return Math.floor(365.25 * (year + 4716)) +
         Math.floor(30.6001 * (month + 1)) +
         day + dayFraction + B - 1524.5;
}

/**
 * Parse ISO string to Date object
 */
export function parseISOToDate(isoString) {
  return new Date(isoString);
}

/**
 * Format Li Chun for display
 * @param {Object} liChun - Li Chun data from API
 * @param {string} timezone - Timezone string (e.g., 'America/New_York')
 * @returns {string} - Formatted date/time string
 */
export function formatLiChunForDisplay(liChun, timezone = 'UTC') {
  if (!liChun || !liChun.isoString) return 'Unknown';

  const date = new Date(liChun.isoString);

  try {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  } catch {
    // Fallback to UTC if timezone invalid
    return date.toUTCString();
  }
}

export default {
  getSolarTermsForYear,
  getLiChunExact,
  getBaziPillarsWithPrecision,
  checkSolarTermBoundary,
  formatLiChunForDisplay
};
