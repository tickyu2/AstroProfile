/**
 * Sign Blend From Date
 *
 * Given a birthdate, calculate the sign blend using the φ-curve.
 * This is the key function that converts a date into cusp-aware percentages.
 *
 * Example:
 *   April 23 → Taurus 75%, Aries 25%
 *   May 18 → Taurus 89%, Gemini 11%
 *
 * GENESIS AstroProfile - January 2025
 */

import type { ZodiacSign } from './types';
import { phiBlend, CUSP_WINDOW_DAYS } from './blendCurve';
import { seasonWeight } from './seasonalWeight';
import { getSignNeighbors } from './cuspBlendTables';

// =============================================================================
// SIGN BLEND TYPE
// =============================================================================

export interface SignBlend {
  sign: ZodiacSign;
  weight: number;  // 0-1
}

// =============================================================================
// SIGN DATE RANGES
// =============================================================================

/**
 * Canonical sign date ranges (tropical zodiac)
 *
 * These are approximate dates - for precision, use Swiss Ephemeris
 * calculated ingress times for the specific year.
 */
export interface SignDateRange {
  sign: ZodiacSign;
  previous: ZodiacSign;
  next: ZodiacSign;
  start: { month: number; day: number };  // Month is 1-12
  end: { month: number; day: number };
}

export const SIGN_DATE_RANGES: SignDateRange[] = [
  { sign: 'Aries', previous: 'Pisces', next: 'Taurus', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { sign: 'Taurus', previous: 'Aries', next: 'Gemini', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { sign: 'Gemini', previous: 'Taurus', next: 'Cancer', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { sign: 'Cancer', previous: 'Gemini', next: 'Leo', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { sign: 'Leo', previous: 'Cancer', next: 'Virgo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { sign: 'Virgo', previous: 'Leo', next: 'Libra', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { sign: 'Libra', previous: 'Virgo', next: 'Scorpio', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { sign: 'Scorpio', previous: 'Libra', next: 'Sagittarius', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { sign: 'Sagittarius', previous: 'Scorpio', next: 'Capricorn', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
  { sign: 'Capricorn', previous: 'Sagittarius', next: 'Aquarius', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { sign: 'Aquarius', previous: 'Capricorn', next: 'Pisces', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { sign: 'Pisces', previous: 'Aquarius', next: 'Aries', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
];

// =============================================================================
// CORE FUNCTION: GET SIGN BLEND FROM DATE
// =============================================================================

/**
 * Calculate the sign blend for a given date
 *
 * @param date - The date to calculate blend for
 * @param applySeasonWeight - Whether to apply seasonal significance adjustment
 * @returns Array of sign blends (usually 1-2 entries)
 *
 * Example:
 *   getSignBlendFromDate(new Date('2026-04-23')) →
 *   [{ sign: 'Taurus', weight: 0.75 }, { sign: 'Aries', weight: 0.25 }]
 */
export function getSignBlendFromDate(
  date: Date,
  applySeasonWeight: boolean = true
): SignBlend[] {
  const month = date.getMonth() + 1;  // JavaScript months are 0-indexed
  const day = date.getDate();

  // Find which sign range this date falls into
  for (const range of SIGN_DATE_RANGES) {
    const inRange = isDateInSignRange(month, day, range);

    if (inRange) {
      // Calculate days from sign start
      const daysFromStart = getDaysFromSignStart(month, day, range);
      const signDuration = getSignDuration(range);

      // Check if in backward cusp (first 6 days)
      if (daysFromStart <= CUSP_WINDOW_DAYS) {
        return calculateBackwardBlend(range, daysFromStart, applySeasonWeight);
      }

      // Check if in forward cusp (last 6 days)
      const daysFromEnd = signDuration - daysFromStart;
      if (daysFromEnd <= CUSP_WINDOW_DAYS) {
        return calculateForwardBlend(range, daysFromEnd, applySeasonWeight);
      }

      // Pure sign (no cusp)
      return [{ sign: range.sign, weight: 1.0 }];
    }
  }

  // Fallback (should not happen)
  return [];
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a date falls within a sign's range
 */
function isDateInSignRange(month: number, day: number, range: SignDateRange): boolean {
  const { start, end } = range;

  // Handle Capricorn special case (crosses year boundary)
  if (start.month > end.month) {
    // Sign spans December to January
    if (month === start.month && day >= start.day) return true;
    if (month === end.month && day <= end.day) return true;
    if (month > start.month || month < end.month) return true;
    return false;
  }

  // Normal case (sign within same year)
  if (month === start.month && day >= start.day) return true;
  if (month === end.month && day <= end.day) return true;
  if (month > start.month && month < end.month) return true;

  return false;
}

/**
 * Calculate days from the start of a sign
 */
function getDaysFromSignStart(month: number, day: number, range: SignDateRange): number {
  const { start } = range;

  if (month === start.month) {
    return day - start.day + 1;  // +1 because first day is day 1, not 0
  }

  // For signs that cross month boundaries
  const daysInStartMonth = getDaysInMonth(start.month) - start.day + 1;

  if (month === start.month + 1 || (start.month === 12 && month === 1)) {
    return daysInStartMonth + day;
  }

  // Shouldn't reach here for zodiac signs (max ~31 days)
  return daysInStartMonth + day;
}

/**
 * Get total duration of a sign in days
 */
function getSignDuration(range: SignDateRange): number {
  const { start, end } = range;

  if (start.month === end.month) {
    return end.day - start.day + 1;
  }

  const daysInStartMonth = getDaysInMonth(start.month) - start.day + 1;
  return daysInStartMonth + end.day;
}

/**
 * Get number of days in a month (approximate, ignoring leap years)
 */
function getDaysInMonth(month: number): number {
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysPerMonth[month - 1];
}

/**
 * Calculate backward blend (previous sign fading)
 */
function calculateBackwardBlend(
  range: SignDateRange,
  daysFromStart: number,
  applySeasonWeight: boolean
): SignBlend[] {
  // Days from start: 1 = day -6 (most blend), 6 = day -1 (least blend)
  const cuspDay = CUSP_WINDOW_DAYS - daysFromStart + 1;
  const blend = phiBlend(cuspDay);

  const weight = applySeasonWeight ? seasonWeight(range.sign) : 1.0;
  let primaryWeight = (1 - blend) * weight;
  let blendWeight = blend;

  // Normalize if needed
  const total = primaryWeight + blendWeight;
  if (total > 1) {
    primaryWeight = primaryWeight / total;
    blendWeight = blendWeight / total;
  }

  // If blend is negligible, return pure sign
  if (blendWeight < 0.02) {
    return [{ sign: range.sign, weight: 1.0 }];
  }

  return [
    { sign: range.sign, weight: primaryWeight },
    { sign: range.previous, weight: blendWeight },
  ];
}

/**
 * Calculate forward blend (next sign emerging)
 */
function calculateForwardBlend(
  range: SignDateRange,
  daysFromEnd: number,
  applySeasonWeight: boolean
): SignBlend[] {
  // Days from end: 6 = day +1 (least blend), 1 = day +6 (most blend)
  const cuspDay = CUSP_WINDOW_DAYS - daysFromEnd + 1;
  const blend = phiBlend(cuspDay);

  const weight = applySeasonWeight ? seasonWeight(range.sign) : 1.0;
  let primaryWeight = (1 - blend) * weight;
  let blendWeight = blend;

  // Normalize if needed
  const total = primaryWeight + blendWeight;
  if (total > 1) {
    primaryWeight = primaryWeight / total;
    blendWeight = blendWeight / total;
  }

  // If blend is negligible, return pure sign
  if (blendWeight < 0.02) {
    return [{ sign: range.sign, weight: 1.0 }];
  }

  return [
    { sign: range.sign, weight: primaryWeight },
    { sign: range.next, weight: blendWeight },
  ];
}

// =============================================================================
// CUSP-AWARE TRIAD FROM DATES
// =============================================================================

export interface CuspAwareTriad {
  Sun: SignBlend[];
  Moon: SignBlend[];
  Rising: SignBlend[];
}

/**
 * Create a cusp-aware triad from birth date and time
 *
 * Note: For Moon and Rising, you would need ephemeris calculations.
 * This function provides the structure; you can pass pre-calculated
 * Moon/Rising signs with their cusp proximity.
 *
 * @param sunDate - Birth date (for Sun sign calculation)
 * @param moonSign - Pre-calculated Moon sign
 * @param moonCuspDays - Days from Moon sign ingress (optional, for cusp calc)
 * @param risingSign - Pre-calculated Rising sign
 * @param risingCuspDegrees - Degrees into Rising sign (optional)
 */
export function createCuspAwareTriad(
  sunDate: Date,
  moonSign: ZodiacSign,
  risingSign: ZodiacSign,
  moonCuspDays?: number,
  risingCuspDegrees?: number
): CuspAwareTriad {
  // Sun blend from date
  const sunBlend = getSignBlendFromDate(sunDate);

  // Moon blend (if cusp info provided, calculate; otherwise pure)
  let moonBlend: SignBlend[];
  if (moonCuspDays !== undefined && Math.abs(moonCuspDays) <= CUSP_WINDOW_DAYS) {
    const neighbors = getSignNeighbors(moonSign);
    const blend = phiBlend(Math.abs(moonCuspDays));
    const blendSign = moonCuspDays < 0 ? neighbors.previous : neighbors.next;

    moonBlend = [
      { sign: moonSign, weight: 1 - blend },
      { sign: blendSign, weight: blend },
    ];
  } else {
    moonBlend = [{ sign: moonSign, weight: 1.0 }];
  }

  // Rising blend (if cusp degrees provided, calculate; otherwise pure)
  // Rising cusps are typically within ~3° of sign boundary
  let risingBlend: SignBlend[];
  if (risingCuspDegrees !== undefined) {
    const RISING_CUSP_DEGREES = 6;  // 6° cusp window for rising

    if (risingCuspDegrees <= RISING_CUSP_DEGREES) {
      // Early in sign (previous sign fading)
      const neighbors = getSignNeighbors(risingSign);
      const blend = risingCuspDegrees / RISING_CUSP_DEGREES;

      risingBlend = [
        { sign: risingSign, weight: blend },
        { sign: neighbors.previous, weight: 1 - blend },
      ];
    } else if (risingCuspDegrees >= 30 - RISING_CUSP_DEGREES) {
      // Late in sign (next sign emerging)
      const neighbors = getSignNeighbors(risingSign);
      const blend = (30 - risingCuspDegrees) / RISING_CUSP_DEGREES;

      risingBlend = [
        { sign: risingSign, weight: blend },
        { sign: neighbors.next, weight: 1 - blend },
      ];
    } else {
      risingBlend = [{ sign: risingSign, weight: 1.0 }];
    }
  } else {
    risingBlend = [{ sign: risingSign, weight: 1.0 }];
  }

  return {
    Sun: sunBlend,
    Moon: moonBlend,
    Rising: risingBlend,
  };
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Format a sign blend for display
 *
 * Example: "Taurus 75%, Aries 25%"
 */
export function formatSignBlend(blend: SignBlend[]): string {
  return blend
    .map(b => `${b.sign} ${Math.round(b.weight * 100)}%`)
    .join(', ');
}

/**
 * Get the primary sign from a blend (highest weight)
 */
export function getPrimarySign(blend: SignBlend[]): ZodiacSign {
  if (blend.length === 0) throw new Error('Empty blend');

  let primary = blend[0];
  for (const b of blend) {
    if (b.weight > primary.weight) {
      primary = b;
    }
  }
  return primary.sign;
}

/**
 * Check if a blend is a cusp (has more than one sign)
 */
export function isCuspBlend(blend: SignBlend[]): boolean {
  return blend.length > 1 && blend[1].weight >= 0.05;  // At least 5% blend
}

/**
 * Get cusp description for display
 */
export function getCuspDisplayInfo(blend: SignBlend[]): {
  isCusp: boolean;
  primary: ZodiacSign;
  secondary?: ZodiacSign;
  primaryPercent: number;
  secondaryPercent?: number;
} {
  const primary = getPrimarySign(blend);
  const primaryWeight = blend.find(b => b.sign === primary)?.weight || 1;

  if (!isCuspBlend(blend)) {
    return {
      isCusp: false,
      primary,
      primaryPercent: 100,
    };
  }

  const secondary = blend.find(b => b.sign !== primary);

  return {
    isCusp: true,
    primary,
    secondary: secondary?.sign,
    primaryPercent: Math.round(primaryWeight * 100),
    secondaryPercent: secondary ? Math.round(secondary.weight * 100) : undefined,
  };
}
