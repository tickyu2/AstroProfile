/**
 * Get Sun Blend From Date
 *
 * The main entry point for calculating Sun sign cusp blends from a birth date.
 * Uses the φ-curve to create natural transitions between signs.
 *
 * Example:
 *   getSunBlendFromDate(new Date('1963-04-23'))
 *   → { primary: 'Taurus', blend: [{ sign: 'Taurus', weight: 0.75 }, { sign: 'Aries', weight: 0.25 }], daysFromIngress: 4 }
 *
 * GENESIS AstroProfile - January 2026
 */

import type { ZodiacSign } from '../../data/tropicalSeasons';
import { SIGNS } from '../../data/tropicalSeasons';
import {
  computeCuspBlend,
  normalizeBlend,
  DEFAULT_PHI,
  type SignBlend,
  type PhiCurveConfig,
} from './phiCurve';

// =============================================================================
// SIGN DATE BOUNDARIES
// =============================================================================

/**
 * Sign boundaries by day of year (1-365/366)
 * These are approximate - real ingress times vary slightly year to year
 */
interface SignWindow {
  sign: ZodiacSign;
  startDay: number;    // Day of year sign begins
  endDay: number;      // Day of year sign ends (exclusive)
  previous: ZodiacSign;
  next: ZodiacSign;
}

/**
 * Zodiac order for neighbor lookup
 */
const ZODIAC_ORDER: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

function getPreviousSign(sign: ZodiacSign): ZodiacSign {
  const idx = ZODIAC_ORDER.indexOf(sign);
  return ZODIAC_ORDER[(idx - 1 + 12) % 12];
}

function getNextSign(sign: ZodiacSign): ZodiacSign {
  const idx = ZODIAC_ORDER.indexOf(sign);
  return ZODIAC_ORDER[(idx + 1) % 12];
}

/**
 * Sign windows for the year
 * Note: Capricorn spans year boundary (day 356 to day 19)
 */
const SIGN_WINDOWS: SignWindow[] = [
  { sign: 'Capricorn', startDay: 356, endDay: 20, previous: 'Sagittarius', next: 'Aquarius' },  // Dec 22 - Jan 19
  { sign: 'Aquarius', startDay: 20, endDay: 50, previous: 'Capricorn', next: 'Pisces' },       // Jan 20 - Feb 18
  { sign: 'Pisces', startDay: 50, endDay: 80, previous: 'Aquarius', next: 'Aries' },          // Feb 19 - Mar 20
  { sign: 'Aries', startDay: 80, endDay: 110, previous: 'Pisces', next: 'Taurus' },           // Mar 21 - Apr 19
  { sign: 'Taurus', startDay: 110, endDay: 141, previous: 'Aries', next: 'Gemini' },          // Apr 20 - May 20
  { sign: 'Gemini', startDay: 141, endDay: 172, previous: 'Taurus', next: 'Cancer' },         // May 21 - Jun 20
  { sign: 'Cancer', startDay: 172, endDay: 204, previous: 'Gemini', next: 'Leo' },            // Jun 21 - Jul 22
  { sign: 'Leo', startDay: 204, endDay: 235, previous: 'Cancer', next: 'Virgo' },             // Jul 23 - Aug 22
  { sign: 'Virgo', startDay: 235, endDay: 266, previous: 'Leo', next: 'Libra' },              // Aug 23 - Sep 22
  { sign: 'Libra', startDay: 266, endDay: 296, previous: 'Virgo', next: 'Scorpio' },          // Sep 23 - Oct 22
  { sign: 'Scorpio', startDay: 296, endDay: 326, previous: 'Libra', next: 'Sagittarius' },    // Oct 23 - Nov 21
  { sign: 'Sagittarius', startDay: 326, endDay: 356, previous: 'Scorpio', next: 'Capricorn' },// Nov 22 - Dec 21
];

// =============================================================================
// DATE UTILITIES
// =============================================================================

/**
 * Get day of year (1-365/366)
 */
function getDayOfYear(date: Date): number {
  // Use UTC to avoid timezone mismatch when date is parsed as UTC midnight
  const year = date.getUTCFullYear();
  const start = Date.UTC(year, 0, 0); // Dec 31 previous year, UTC
  const diff = date.getTime() - start;
  const oneDay = 86_400_000;
  return Math.floor(diff / oneDay);
}

/**
 * Check if a year is a leap year
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get the sign window for a given day of year
 */
function getSignWindowForDay(dayOfYear: number): SignWindow {
  // Handle Capricorn's year-spanning window
  if (dayOfYear >= 356 || dayOfYear < 20) {
    return SIGN_WINDOWS[0]; // Capricorn
  }

  for (const window of SIGN_WINDOWS) {
    if (window.sign === 'Capricorn') continue; // Already handled

    if (dayOfYear >= window.startDay && dayOfYear < window.endDay) {
      return window;
    }
  }

  // Fallback (should not happen)
  return SIGN_WINDOWS[0];
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

export interface SunBlendResult {
  primary: ZodiacSign;
  blend: SignBlend[];
  daysFromIngress: number;  // Positive = early in sign, negative = late in sign
  dayOfYear: number;
  isCusp: boolean;
  cuspDescription?: string;
}

/**
 * Get the Sun sign blend for a given date
 *
 * @param date - The birth date
 * @param cfg - Optional φ-curve configuration
 * @returns Sun blend result with primary sign, blend array, and metadata
 *
 * Example:
 *   getSunBlendFromDate(new Date('1990-04-23'))
 *   → {
 *       primary: 'Taurus',
 *       blend: [{ sign: 'Taurus', weight: 0.75 }, { sign: 'Aries', weight: 0.25 }],
 *       daysFromIngress: 4,
 *       dayOfYear: 113,
 *       isCusp: true,
 *       cuspDescription: 'Cusp of Power (Aries-Taurus)'
 *     }
 */
export function getSunBlendFromDate(
  date: Date,
  cfg: PhiCurveConfig = DEFAULT_PHI
): SunBlendResult {
  const dayOfYear = getDayOfYear(date);
  const window = getSignWindowForDay(dayOfYear);
  const { sign: primary, previous, next, startDay, endDay } = window;
  const cuspDays = cfg.cuspDays;

  // Calculate days from sign start (1-indexed: ingress day = 1)
  let daysAfterStart: number;
  if (primary === 'Capricorn') {
    // Handle year-spanning sign
    if (dayOfYear >= 356) {
      daysAfterStart = dayOfYear - 356 + 1;
    } else {
      daysAfterStart = (366 - 356) + dayOfYear + 1; // Days in Dec + days in Jan
    }
  } else {
    daysAfterStart = dayOfYear - startDay + 1;
  }

  // Calculate days until sign end
  let signDuration: number;
  if (primary === 'Capricorn') {
    signDuration = (366 - 356) + 20; // Days in Dec + days in Jan
  } else {
    signDuration = endDay - startDay;
  }

  const daysBeforeEnd = signDuration - daysAfterStart;

  // Determine cusp position and calculate blend
  let daysFromIngress: number;
  let blend: SignBlend[];

  // Early in sign (first cuspDays days) - backward cusp with previous sign
  if (daysAfterStart <= cuspDays) {
    daysFromIngress = daysAfterStart;
    blend = normalizeBlend(computeCuspBlend({
      primary,
      previous,
      next,
      daysFromIngress,
      cfg,
    }));
  }
  // Late in sign (last cuspDays days) - forward cusp with next sign
  else if (daysBeforeEnd < cuspDays && daysBeforeEnd >= 0) {
    daysFromIngress = -(daysBeforeEnd + 1);
    blend = normalizeBlend(computeCuspBlend({
      primary,
      previous,
      next,
      daysFromIngress,
      cfg,
    }));
  }
  // Middle of sign - pure sign
  else {
    daysFromIngress = 0;
    blend = [{ sign: primary, weight: 1 }];
  }

  // Determine if this is a cusp
  const isCusp = blend.length > 1 && blend[1].weight >= 0.05;

  // Generate cusp description if applicable
  let cuspDescription: string | undefined;
  if (isCusp) {
    const secondarySign = blend[1].sign;
    cuspDescription = getCuspDescription(
      daysFromIngress > 0 ? previous : primary,
      daysFromIngress > 0 ? primary : next
    );
  }

  return {
    primary,
    blend,
    daysFromIngress,
    dayOfYear,
    isCusp,
    cuspDescription,
  };
}

// =============================================================================
// CUSP NAMES AND DESCRIPTIONS
// =============================================================================

const CUSP_NAMES: Record<string, { name: string; description: string }> = {
  'Pisces-Aries': {
    name: 'Cusp of Rebirth',
    description: 'Dreamers who dare to act - imagination meets initiative',
  },
  'Aries-Taurus': {
    name: 'Cusp of Power',
    description: 'Initiators who persist - action meets determination',
  },
  'Taurus-Gemini': {
    name: 'Cusp of Energy',
    description: 'Builders who communicate - stability meets curiosity',
  },
  'Gemini-Cancer': {
    name: 'Cusp of Magic',
    description: 'Thinkers who feel - intellect meets emotion',
  },
  'Cancer-Leo': {
    name: 'Cusp of Oscillation',
    description: 'Nurturers who shine - protection meets expression',
  },
  'Leo-Virgo': {
    name: 'Cusp of Exposure',
    description: 'Performers who perfect - creativity meets analysis',
  },
  'Virgo-Libra': {
    name: 'Cusp of Beauty',
    description: 'Analysts who harmonize - precision meets balance',
  },
  'Libra-Scorpio': {
    name: 'Cusp of Drama',
    description: 'Diplomats who transform - harmony meets intensity',
  },
  'Scorpio-Sagittarius': {
    name: 'Cusp of Revolution',
    description: 'Investigators who explore - depth meets expansion',
  },
  'Sagittarius-Capricorn': {
    name: 'Cusp of Prophecy',
    description: 'Seekers who build - vision meets structure',
  },
  'Capricorn-Aquarius': {
    name: 'Cusp of Mystery',
    description: 'Achievers who innovate - tradition meets revolution',
  },
  'Aquarius-Pisces': {
    name: 'Cusp of Sensitivity',
    description: 'Visionaries who feel - innovation meets intuition',
  },
};

/**
 * Get the cusp name and description for two adjacent signs
 */
function getCuspDescription(fromSign: ZodiacSign, toSign: ZodiacSign): string {
  const key = `${fromSign}-${toSign}`;
  const cusp = CUSP_NAMES[key];
  return cusp ? `${cusp.name} (${fromSign}-${toSign})` : `${fromSign}-${toSign} Cusp`;
}

/**
 * Get detailed cusp info
 */
export function getCuspInfo(fromSign: ZodiacSign, toSign: ZodiacSign): {
  name: string;
  description: string;
} | null {
  const key = `${fromSign}-${toSign}`;
  return CUSP_NAMES[key] || null;
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

export {
  getDayOfYear,
  getSignWindowForDay,
  getPreviousSign,
  getNextSign,
  SIGN_WINDOWS,
  ZODIAC_ORDER,
};
