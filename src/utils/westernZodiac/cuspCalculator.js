/**
 * Cusp Calculator
 * Father Ticky's 6-6 Cusp Model
 *
 * Determines which of the 36 cusp positions a birth date falls into.
 * Each sign divided into 3 parts: Blend Back (6 days), Pure (variable), Blend Forward (6 days)
 *
 * Built by Brother Claude Code
 * December 12, 2024
 */

import cuspsData from '../../data/westernZodiacCusps.json';

/**
 * Date ranges for the 36-cusp system
 * ORDERED BY CALENDAR YEAR (Jan 1 to Dec 31)
 * Format: [month, day] for start and end
 */
const CUSP_DATE_RANGES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FATHER TICKY'S 6-6 CUSP MODEL (36 positions, no overlap)
  // ═══════════════════════════════════════════════════════════════════════════
  // Each sign has 3 periods:
  //   - blend-back:    First 6 days (SIGN dominant + previous sign influence)
  //   - pure:          Middle days (undiluted sign energy)
  //   - blend-forward: Last 6 days (SIGN dominant + next sign influence)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // CAPRICORN (Dec 22 - Jan 19) - spans year boundary
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'capricorn-blend-back', start: [12, 22], end: [12, 27] },    // Dec 22-27: Capricorn + Sagittarius influence
  { id: 'capricorn-pure', start: [12, 28], end: [12, 31] },          // Dec 28-31: Pure Capricorn (part 1)
  { id: 'capricorn-pure', start: [1, 1], end: [1, 13] },             // Jan 1-13: Pure Capricorn (part 2)
  { id: 'capricorn-blend-forward', start: [1, 14], end: [1, 19] },   // Jan 14-19: Capricorn + Aquarius influence

  // ─────────────────────────────────────────────────────────────────────────────
  // AQUARIUS (Jan 20 - Feb 18)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'aquarius-blend-back', start: [1, 20], end: [1, 25] },       // Jan 20-25: Aquarius + Capricorn influence
  { id: 'aquarius-pure', start: [1, 26], end: [2, 12] },             // Jan 26 - Feb 12: Pure Aquarius
  { id: 'aquarius-blend-forward', start: [2, 13], end: [2, 18] },    // Feb 13-18: Aquarius + Pisces influence

  // ─────────────────────────────────────────────────────────────────────────────
  // PISCES (Feb 19 - Mar 20)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'pisces-blend-back', start: [2, 19], end: [2, 24] },         // Feb 19-24: Pisces + Aquarius influence
  { id: 'pisces-pure', start: [2, 25], end: [3, 14] },               // Feb 25 - Mar 14: Pure Pisces
  { id: 'pisces-blend-forward', start: [3, 15], end: [3, 20] },      // Mar 15-20: Pisces + Aries influence

  // ─────────────────────────────────────────────────────────────────────────────
  // ARIES (Mar 21 - Apr 19)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'aries-blend-back', start: [3, 21], end: [3, 26] },          // Mar 21-26: Aries + Pisces influence
  { id: 'aries-pure', start: [3, 27], end: [4, 13] },                // Mar 27 - Apr 13: Pure Aries
  { id: 'aries-blend-forward', start: [4, 14], end: [4, 19] },       // Apr 14-19: Aries + Taurus influence

  // ─────────────────────────────────────────────────────────────────────────────
  // TAURUS (Apr 20 - May 20)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'taurus-blend-back', start: [4, 20], end: [4, 25] },         // Apr 20-25: Taurus + Aries influence
  { id: 'taurus-pure', start: [4, 26], end: [5, 14] },               // Apr 26 - May 14: Pure Taurus
  { id: 'taurus-blend-forward', start: [5, 15], end: [5, 20] },      // May 15-20: Taurus + Gemini influence

  // ─────────────────────────────────────────────────────────────────────────────
  // GEMINI (May 21 - Jun 20)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'gemini-blend-back', start: [5, 21], end: [5, 26] },         // May 21-26: Gemini + Taurus influence
  { id: 'gemini-pure', start: [5, 27], end: [6, 14] },               // May 27 - Jun 14: Pure Gemini
  { id: 'gemini-blend-forward', start: [6, 15], end: [6, 20] },      // Jun 15-20: Gemini + Cancer influence

  // ─────────────────────────────────────────────────────────────────────────────
  // CANCER (Jun 21 - Jul 22)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'cancer-blend-back', start: [6, 21], end: [6, 26] },         // Jun 21-26: Cancer + Gemini influence
  { id: 'cancer-pure', start: [6, 27], end: [7, 16] },               // Jun 27 - Jul 16: Pure Cancer
  { id: 'cancer-blend-forward', start: [7, 17], end: [7, 22] },      // Jul 17-22: Cancer + Leo influence

  // ─────────────────────────────────────────────────────────────────────────────
  // LEO (Jul 23 - Aug 22)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'leo-blend-back', start: [7, 23], end: [7, 28] },            // Jul 23-28: Leo + Cancer influence
  { id: 'leo-pure', start: [7, 29], end: [8, 16] },                  // Jul 29 - Aug 16: Pure Leo
  { id: 'leo-blend-forward', start: [8, 17], end: [8, 22] },         // Aug 17-22: Leo + Virgo influence

  // ─────────────────────────────────────────────────────────────────────────────
  // VIRGO (Aug 23 - Sep 22)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'virgo-blend-back', start: [8, 23], end: [8, 28] },          // Aug 23-28: Virgo + Leo influence
  { id: 'virgo-pure', start: [8, 29], end: [9, 16] },                // Aug 29 - Sep 16: Pure Virgo
  { id: 'virgo-blend-forward', start: [9, 17], end: [9, 22] },       // Sep 17-22: Virgo + Libra influence

  // ─────────────────────────────────────────────────────────────────────────────
  // LIBRA (Sep 23 - Oct 22)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'libra-blend-back', start: [9, 23], end: [9, 28] },          // Sep 23-28: Libra + Virgo influence
  { id: 'libra-pure', start: [9, 29], end: [10, 16] },               // Sep 29 - Oct 16: Pure Libra
  { id: 'libra-blend-forward', start: [10, 17], end: [10, 22] },     // Oct 17-22: Libra + Scorpio influence

  // ─────────────────────────────────────────────────────────────────────────────
  // SCORPIO (Oct 23 - Nov 21)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'scorpio-blend-back', start: [10, 23], end: [10, 28] },      // Oct 23-28: Scorpio + Libra influence
  { id: 'scorpio-pure', start: [10, 29], end: [11, 15] },            // Oct 29 - Nov 15: Pure Scorpio
  { id: 'scorpio-blend-forward', start: [11, 16], end: [11, 21] },   // Nov 16-21: Scorpio + Sagittarius influence

  // ─────────────────────────────────────────────────────────────────────────────
  // SAGITTARIUS (Nov 22 - Dec 21)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'sagittarius-blend-back', start: [11, 22], end: [11, 27] },  // Nov 22-27: Sagittarius + Scorpio influence
  { id: 'sagittarius-pure', start: [11, 28], end: [12, 15] },        // Nov 28 - Dec 15: Pure Sagittarius
  { id: 'sagittarius-blend-forward', start: [12, 16], end: [12, 21] } // Dec 16-21: Sagittarius + Capricorn influence
];

/**
 * Convert month and day to day-of-year number (1-366)
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {number} - Day of year
 */
function toDayOfYear(month, day) {
  // Days in each month (non-leap year, close enough for ranges)
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = day;
  for (let m = 1; m < month; m++) {
    dayOfYear += daysInMonth[m];
  }
  return dayOfYear;
}

/**
 * Check if a date falls within a range
 * @param {number} month - Birth month (1-12)
 * @param {number} day - Birth day
 * @param {Array} start - [startMonth, startDay]
 * @param {Array} end - [endMonth, endDay]
 * @returns {boolean}
 */
function isDateInRange(month, day, start, end) {
  const dateDay = toDayOfYear(month, day);
  const startDay = toDayOfYear(start[0], start[1]);
  const endDay = toDayOfYear(end[0], end[1]);

  // Simple comparison since we've ordered ranges by calendar year
  return dateDay >= startDay && dateDay <= endDay;
}

/**
 * Get cusp ID from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {string|null} - Cusp ID (e.g., 'pisces-aries', 'aries-pure')
 */
export function getCuspFromDate(birthDate) {
  const date = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const month = date.getMonth() + 1; // getMonth() is 0-indexed
  const day = date.getDate();

  // Debug log
  console.log(`🔍 [CuspCalculator] Looking up cusp for: month=${month}, day=${day}`);

  for (const range of CUSP_DATE_RANGES) {
    if (isDateInRange(month, day, range.start, range.end)) {
      console.log(`✅ [CuspCalculator] Found cusp: ${range.id}`);
      return range.id;
    }
  }

  // Fallback - should never happen if ranges are complete
  console.warn('⚠️ [CuspCalculator] No cusp found for date:', month, day);
  return null;
}

/**
 * Get full cusp data from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {Object|null} - Full cusp data from JSON
 */
export function getCuspDataFromDate(birthDate) {
  const cuspId = getCuspFromDate(birthDate);
  if (!cuspId) return null;

  return getCuspById(cuspId);
}

/**
 * Get cusp data by ID
 * @param {string} cuspId - Cusp ID (e.g., 'pisces-aries')
 * @returns {Object|null} - Full cusp data
 */
export function getCuspById(cuspId) {
  return cuspsData.positions.find(c => c.id === cuspId) || null;
}

/**
 * Get all cusps
 * @returns {Array} - All 36 cusp objects
 */
export function getAllCusps() {
  return cuspsData.positions;
}

/**
 * Get cusp type description
 * @param {string} type - 'pure', 'blend-back', or 'blend-forward'
 * @returns {string} - Human-readable description
 */
export function getCuspTypeDescription(type) {
  switch (type) {
    case 'pure':
      return 'Pure Sign - Undiluted energy';
    case 'blend-back':
      return 'Cusp - Blending from previous sign';
    case 'blend-forward':
      return 'Cusp - Blending into next sign';
    default:
      return type;
  }
}

/**
 * Get element color for display
 * @param {string} element - Fire, Earth, Air, or Water
 * @returns {Object} - Color configuration
 */
export function getElementColors(element) {
  const colors = {
    Fire: {
      primary: '#ef4444',
      gradient: 'from-red-500 to-orange-500',
      glow: 'rgba(239, 68, 68, 0.6)'
    },
    Earth: {
      primary: '#f59e0b',
      gradient: 'from-amber-500 to-yellow-600',
      glow: 'rgba(245, 158, 11, 0.6)'
    },
    Air: {
      primary: '#3b82f6',
      gradient: 'from-blue-400 to-cyan-500',
      glow: 'rgba(59, 130, 246, 0.6)'
    },
    Water: {
      primary: '#8b5cf6',
      gradient: 'from-violet-500 to-purple-600',
      glow: 'rgba(139, 92, 246, 0.6)'
    }
  };

  return colors[element] || colors.Fire;
}

/**
 * Get cusp display name (shorter version)
 * @param {Object} cusp - Cusp data object
 * @returns {string} - Short display name
 */
export function getCuspDisplayName(cusp) {
  if (!cusp) return 'Unknown';

  if (cusp.type === 'pure') {
    return cusp.sign;
  }

  // For cusps, use format like "Pisces-Aries"
  return cusp.name.replace(' Cusp', '').replace('Pure ', '');
}

/**
 * Format a date as "Mon D" (e.g., "May 15")
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {string} - Formatted date
 */
function formatDate(month, day) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day}`;
}

/**
 * Get date range string for a cusp
 * @param {string} cuspId - Cusp ID (e.g., 'taurus-gemini', 'aries-pure')
 * @returns {string} - Date range (e.g., "May 15-20", "Mar 21 - Apr 13")
 */
export function getCuspDateRange(cuspId) {
  if (!cuspId) return '';

  // Find the matching range(s) for this cusp ID
  const ranges = CUSP_DATE_RANGES.filter(r => r.id === cuspId);

  if (ranges.length === 0) return '';

  // For cusps that span year boundary (capricorn-pure), combine ranges
  if (ranges.length === 2) {
    // Dec 22-31 and Jan 1-13
    const dec = ranges.find(r => r.start[0] === 12);
    const jan = ranges.find(r => r.start[0] === 1);
    if (dec && jan) {
      return `Dec ${dec.start[1]} - Jan ${jan.end[1]}`;
    }
  }

  const range = ranges[0];
  const [startMonth, startDay] = range.start;
  const [endMonth, endDay] = range.end;

  // Same month
  if (startMonth === endMonth) {
    return `${formatDate(startMonth, startDay).split(' ')[0]} ${startDay}-${endDay}`;
  }

  // Different months
  return `${formatDate(startMonth, startDay)} - ${formatDate(endMonth, endDay)}`;
}

/**
 * Get zodiac sign emoji
 * @param {string} sign - Zodiac sign name
 * @returns {string} - Emoji
 */
export function getSignEmoji(sign) {
  const emojis = {
    Aries: '♈',
    Taurus: '♉',
    Gemini: '♊',
    Cancer: '♋',
    Leo: '♌',
    Virgo: '♍',
    Libra: '♎',
    Scorpio: '♏',
    Sagittarius: '♐',
    Capricorn: '♑',
    Aquarius: '♒',
    Pisces: '♓'
  };

  return emojis[sign] || '⭐';
}

export default {
  getCuspFromDate,
  getCuspDataFromDate,
  getCuspById,
  getAllCusps,
  getCuspTypeDescription,
  getElementColors,
  getCuspDisplayName,
  getCuspDateRange,
  getSignEmoji
};
