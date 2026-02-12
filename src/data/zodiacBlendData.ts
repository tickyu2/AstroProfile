/**
 * zodiacBlendData.ts
 * ==================
 *
 * Generates a 365-day zodiac blend dataset using golden ratio cusp curves
 * for smooth sign transitions. Each day contains primary sign, blend info,
 * and cusp detection for the Zodiac Blend Wheel visualization.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// TYPES
// =============================================================================

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ElementName = 'Fire' | 'Earth' | 'Air' | 'Water';

/**
 * Elemental Vector - The 4-element balance for any day
 * Values are 0-1, representing percentage of each element's influence
 */
export interface ElementVector {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

export interface SignRange {
  sign: ZodiacSign;
  start: { month: number; day: number };
  end: { month: number; day: number };
}

export interface DayBlend {
  date: string;           // "YYYY-MM-DD"
  dayOfYear: number;      // 1-365 (or 366)
  primarySign: ZodiacSign;
  blendSign: ZodiacSign | null;
  blendPercent: number;   // 0-1, how much blendSign influences
  cuspType: 'none' | 'backward' | 'forward';
  cuspDay: number;        // 0 = not cusp, 1-6 = cusp day position
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Golden ratio (φ) based cusp curve — primary sign percentages
 * Formula: 1 - ((7-d)/7)^φ  where d = cusp day (1-6), φ ≈ 1.618
 * Day 1 (at boundary): 22% primary, 78% neighbor
 * Day 6 (cusp edge):   96% primary,  4% neighbor
 */
export const CUSP_CURVE: number[] = [0.22, 0.42, 0.60, 0.75, 0.87, 0.96];
export const CUSP_DAYS = CUSP_CURVE.length;

/**
 * Standard Western tropical zodiac sign date ranges
 * Note: Actual cusp dates can vary slightly year to year
 */
export const SIGN_RANGES: SignRange[] = [
  { sign: 'Aries',       start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { sign: 'Taurus',      start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { sign: 'Gemini',      start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { sign: 'Cancer',      start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { sign: 'Leo',         start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { sign: 'Virgo',       start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { sign: 'Libra',       start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { sign: 'Scorpio',     start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { sign: 'Sagittarius', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
  { sign: 'Capricorn',   start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { sign: 'Aquarius',    start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { sign: 'Pisces',      start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
];

/**
 * Unicode zodiac glyphs for visualization
 */
export const SIGN_GLYPHS: Record<ZodiacSign, string> = {
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
  Pisces: '♓',
};

/**
 * Zodiac element mapping
 */
export const SIGN_ELEMENTS: Record<ZodiacSign, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  Aries: 'Fire',
  Taurus: 'Earth',
  Gemini: 'Air',
  Cancer: 'Water',
  Leo: 'Fire',
  Virgo: 'Earth',
  Libra: 'Air',
  Scorpio: 'Water',
  Sagittarius: 'Fire',
  Capricorn: 'Earth',
  Aquarius: 'Air',
  Pisces: 'Water',
};

/**
 * Element colors for visualization
 */
export const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#e74c3c',
  Earth: '#27ae60',
  Air: '#3498db',
  Water: '#9b59b6',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a year is a leap year
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get total days in a year
 */
function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Convert month/day to day of year (1-indexed)
 * Uses UTC to avoid Daylight Saving Time calculation errors
 */
function toDayOfYear(year: number, month: number, day: number): number {
  // Use UTC to avoid DST issues where spring-forward causes off-by-one errors
  const date = Date.UTC(year, month - 1, day);
  const start = Date.UTC(year, 0, 1); // January 1 as reference (day 1)
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1; // +1 because Jan 1 = day 1
}

/**
 * Convert day of year to Date object
 * Uses UTC-based calculation to match toDayOfYear and avoid DST issues
 */
function fromDayOfYear(year: number, dayOfYear: number): Date {
  // Calculate using UTC, then create a local Date for the result
  // dayOfYear 1 = January 1, so we add (dayOfYear - 1) days to Jan 1
  const utcMs = Date.UTC(year, 0, 1) + (dayOfYear - 1) * 24 * 60 * 60 * 1000;
  const utcDate = new Date(utcMs);
  // Return a local Date with the same year/month/day
  return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Get the sign index (0-11) for a given sign
 */
function getSignIndex(sign: ZodiacSign): number {
  return SIGN_RANGES.findIndex(r => r.sign === sign);
}

/**
 * Get the previous sign in the zodiac
 */
function getPreviousSign(sign: ZodiacSign): ZodiacSign {
  const idx = getSignIndex(sign);
  const prevIdx = (idx - 1 + 12) % 12;
  return SIGN_RANGES[prevIdx].sign;
}

/**
 * Get the next sign in the zodiac
 */
function getNextSign(sign: ZodiacSign): ZodiacSign {
  const idx = getSignIndex(sign);
  const nextIdx = (idx + 1) % 12;
  return SIGN_RANGES[nextIdx].sign;
}

/**
 * Find which sign a date falls under
 */
function getSignForDate(year: number, month: number, day: number): ZodiacSign {
  for (const range of SIGN_RANGES) {
    const { start, end, sign } = range;

    // Handle Capricorn which spans year boundary
    if (sign === 'Capricorn') {
      if ((month === 12 && day >= start.day) || (month === 1 && day <= end.day)) {
        return sign;
      }
    } else {
      // Normal case: check if date is within range
      if (month === start.month && day >= start.day) {
        return sign;
      }
      if (month === end.month && day <= end.day) {
        return sign;
      }
      if (month > start.month && month < end.month) {
        return sign;
      }
    }
  }

  // Fallback (should not reach here with correct data)
  return 'Aries';
}

/**
 * Get the start day of year for a sign
 */
function getSignStartDayOfYear(year: number, sign: ZodiacSign): number {
  const range = SIGN_RANGES.find(r => r.sign === sign);
  if (!range) return 1;
  return toDayOfYear(year, range.start.month, range.start.day);
}

// =============================================================================
// MAIN GENERATOR
// =============================================================================

/**
 * Generate the complete year blend dataset
 *
 * @param year - The year to generate data for
 * @returns Array of DayBlend objects for each day of the year
 */
export function generateYearBlend(year: number): DayBlend[] {
  const totalDays = getDaysInYear(year);
  const result: DayBlend[] = [];

  // Pre-compute sign start days for cusp detection
  const signStarts: Map<ZodiacSign, number> = new Map();
  for (const range of SIGN_RANGES) {
    signStarts.set(range.sign, toDayOfYear(year, range.start.month, range.start.day));
  }

  for (let dayOfYear = 1; dayOfYear <= totalDays; dayOfYear++) {
    const date = fromDayOfYear(year, dayOfYear);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const primarySign = getSignForDate(year, month, day);
    const signStart = signStarts.get(primarySign) || 1;

    // Calculate days into sign (1 = first day of sign)
    let daysIntoSign = dayOfYear - signStart + 1;
    if (daysIntoSign <= 0) {
      // Handle Capricorn year wrap
      daysIntoSign = dayOfYear + (totalDays - signStart + 1);
    }

    // Determine cusp type and blend
    let cuspType: 'none' | 'backward' | 'forward' = 'none';
    let cuspDay = 0;
    let blendSign: ZodiacSign | null = null;
    let blendPercent = 0;

    // Check backward cusp (first CUSP_DAYS days of sign - still influenced by previous)
    if (daysIntoSign <= CUSP_DAYS) {
      cuspType = 'backward';
      cuspDay = daysIntoSign;
      blendSign = getPreviousSign(primarySign);
      // Inverse blend: day 1 = high blend, day 6 = low blend
      blendPercent = 1 - CUSP_CURVE[daysIntoSign - 1];
    }

    // Check forward cusp (last CUSP_DAYS days of sign - transitioning to next)
    const nextSign = getNextSign(primarySign);
    const nextSignStart = signStarts.get(nextSign) || 1;
    let daysUntilNext: number;

    // Special handling for Sagittarius→Capricorn (Capricorn starts in December, same year)
    // and Capricorn→Aquarius (Aquarius starts in January, next year when in December)
    if (primarySign === 'Capricorn' && month === 12) {
      // In December Capricorn, Aquarius starts next year in January
      daysUntilNext = (totalDays - dayOfYear) + nextSignStart;
    } else if (nextSignStart > dayOfYear) {
      // Normal case: next sign starts later in the same year
      daysUntilNext = nextSignStart - dayOfYear;
    } else if (nextSignStart < dayOfYear && primarySign !== 'Capricorn') {
      // Next sign already "started" this year (we're past it) - means we're late in year
      // This shouldn't happen for most signs, but handle edge cases
      daysUntilNext = (totalDays - dayOfYear) + nextSignStart;
    } else {
      // Capricorn in January - Aquarius starts later in January
      daysUntilNext = nextSignStart - dayOfYear;
    }

    if (daysUntilNext <= CUSP_DAYS && cuspType === 'none') {
      cuspType = 'forward';
      cuspDay = CUSP_DAYS - daysUntilNext + 1;
      blendSign = nextSign;
      // Symmetric blend: mirror of backward cusp (distance from boundary)
      blendPercent = 1 - CUSP_CURVE[daysUntilNext - 1];
    }

    result.push({
      date: formatDate(date),
      dayOfYear,
      primarySign,
      blendSign,
      blendPercent,
      cuspType,
      cuspDay,
    });
  }

  return result;
}

/**
 * Get blend data for a specific date
 */
export function getBlendForDate(dateStr: string): DayBlend | null {
  // Parse manually to avoid timezone shift (ISO dates parsed as UTC by new Date)
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  if (isNaN(year)) return null;

  const yearData = generateYearBlend(year);
  return yearData.find(d => d.date === dateStr) || null;
}

/**
 * Get all cusp days for a year
 */
export function getCuspDays(year: number): DayBlend[] {
  const yearData = generateYearBlend(year);
  return yearData.filter(d => d.cuspType !== 'none');
}

/**
 * Get sign color based on element
 */
export function getSignColor(sign: ZodiacSign): string {
  const element = SIGN_ELEMENTS[sign];
  return ELEMENT_COLORS[element];
}

/**
 * Get blend color (interpolated between two signs)
 */
export function getBlendColor(primarySign: ZodiacSign, blendSign: ZodiacSign | null, blendPercent: number): string {
  if (!blendSign || blendPercent === 0) {
    return getSignColor(primarySign);
  }

  // For now, return primary color - could implement color interpolation
  return getSignColor(primarySign);
}

// =============================================================================
// ELEMENTAL VECTOR SYSTEM
// =============================================================================

/**
 * Map element names to vector keys
 */
const ELEMENT_TO_KEY: Record<ElementName, keyof ElementVector> = {
  Fire: 'fire',
  Earth: 'earth',
  Air: 'air',
  Water: 'water',
};

/**
 * Element emojis for display
 */
export const ELEMENT_EMOJIS: Record<keyof ElementVector, string> = {
  fire: '🔥',
  earth: '🌍',
  air: '💨',
  water: '💧',
};

/**
 * Calculate the elemental vector for a day blend
 * This shows the 4-element balance based on sign blending
 *
 * @param day - The day blend object
 * @returns ElementVector with fire, earth, air, water percentages (0-1)
 */
export function getElementVector(day: DayBlend): ElementVector {
  const vector: ElementVector = { fire: 0, earth: 0, air: 0, water: 0 };

  // Primary sign contribution
  const primaryElement = SIGN_ELEMENTS[day.primarySign];
  const primaryKey = ELEMENT_TO_KEY[primaryElement];
  const primaryPercent = 1 - (day.blendPercent || 0);
  vector[primaryKey] += primaryPercent;

  // Blend sign contribution (if present)
  if (day.blendSign && day.blendPercent > 0) {
    const blendElement = SIGN_ELEMENTS[day.blendSign];
    const blendKey = ELEMENT_TO_KEY[blendElement];
    vector[blendKey] += day.blendPercent;
  }

  return vector;
}

/**
 * Get the dominant element for a day
 *
 * @param day - The day blend object
 * @returns The dominant element key and its percentage
 */
export function getDominantElement(day: DayBlend): {
  element: keyof ElementVector;
  elementName: ElementName;
  percent: number;
  emoji: string;
} {
  const vector = getElementVector(day);
  const entries = Object.entries(vector) as [keyof ElementVector, number][];
  const [element, percent] = entries.sort((a, b) => b[1] - a[1])[0];

  // Map back to ElementName
  const elementName = (element.charAt(0).toUpperCase() + element.slice(1)) as ElementName;

  return {
    element,
    elementName,
    percent,
    emoji: ELEMENT_EMOJIS[element],
  };
}

/**
 * Get active elements (those with > 0% influence)
 */
export function getActiveElements(day: DayBlend): Array<{
  element: keyof ElementVector;
  elementName: ElementName;
  percent: number;
  emoji: string;
}> {
  const vector = getElementVector(day);
  return (Object.entries(vector) as [keyof ElementVector, number][])
    .filter(([_, percent]) => percent > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([element, percent]) => ({
      element,
      elementName: (element.charAt(0).toUpperCase() + element.slice(1)) as ElementName,
      percent,
      emoji: ELEMENT_EMOJIS[element],
    }));
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  generateYearBlend,
  getBlendForDate,
  getCuspDays,
  getSignColor,
  getBlendColor,
  getElementVector,
  getDominantElement,
  getActiveElements,
  SIGN_RANGES,
  SIGN_GLYPHS,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
  ELEMENT_EMOJIS,
  CUSP_CURVE,
  CUSP_DAYS,
};
