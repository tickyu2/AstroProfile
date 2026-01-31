/**
 * Tropical Calendar - Seasonal Phase Mapping
 *
 * Extends tropicalMap with 12 seasonal subdivisions:
 * Each season (Spring, Summer, Autumn, Winter) has three phases:
 * - begin (Cardinal energy)
 * - core (Fixed energy)
 * - end (Mutable energy)
 *
 * This creates a 12-slot calendar that any birth sign can walk through.
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey, Season, Element, Modality } from './tropicalMap';
import { SIGN_LESSONS, TROPICAL_ORDER } from './tropicalMap';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type SeasonPhase = 'begin' | 'core' | 'end';

export interface SeasonalSlot {
  index: number;              // 0-11 position in the wheel
  sign: SignKey;              // The sign that rules this slot
  season: Season;             // Spring, Summer, Autumn, Winter
  phase: SeasonPhase;         // begin, core, end
  element: Element;           // The element of this slot's ruling sign
  modality: Modality;         // Cardinal (begin), Fixed (core), Mutable (end)
  dateRange: {                // Approximate date range
    start: string;            // "Mar 21"
    end: string;              // "Apr 19"
  };
  solarMeaning: string;       // What's happening in nature
}

// =============================================================================
// SEASONAL CALENDAR DATA
// =============================================================================

export const SEASONAL_CALENDAR: SeasonalSlot[] = [
  // SPRING
  {
    index: 0,
    sign: 'Aries',
    season: 'Spring',
    phase: 'begin',
    element: 'Fire',
    modality: 'Cardinal',
    dateRange: { start: 'Mar 21', end: 'Apr 19' },
    solarMeaning: 'Vernal equinox - light overtakes dark. Seeds push through soil. New beginnings.',
  },
  {
    index: 1,
    sign: 'Taurus',
    season: 'Spring',
    phase: 'core',
    element: 'Earth',
    modality: 'Fixed',
    dateRange: { start: 'Apr 20', end: 'May 20' },
    solarMeaning: 'Mid-spring - roots deepen, growth stabilizes. Blossoms become reliable.',
  },
  {
    index: 2,
    sign: 'Gemini',
    season: 'Spring',
    phase: 'end',
    element: 'Air',
    modality: 'Mutable',
    dateRange: { start: 'May 21', end: 'Jun 20' },
    solarMeaning: 'Late spring - pollination, movement, spreading energy. Preparing for summer.',
  },

  // SUMMER
  {
    index: 3,
    sign: 'Cancer',
    season: 'Summer',
    phase: 'begin',
    element: 'Water',
    modality: 'Cardinal',
    dateRange: { start: 'Jun 21', end: 'Jul 22' },
    solarMeaning: 'Summer solstice - longest day. Light peaks, yet inward turn begins.',
  },
  {
    index: 4,
    sign: 'Leo',
    season: 'Summer',
    phase: 'core',
    element: 'Fire',
    modality: 'Fixed',
    dateRange: { start: 'Jul 23', end: 'Aug 22' },
    solarMeaning: 'Peak summer - full radiance, maximum growth, unapologetic brightness.',
  },
  {
    index: 5,
    sign: 'Virgo',
    season: 'Summer',
    phase: 'end',
    element: 'Earth',
    modality: 'Mutable',
    dateRange: { start: 'Aug 23', end: 'Sep 22' },
    solarMeaning: 'Late summer - harvest preparation, refinement, readying for transition.',
  },

  // AUTUMN
  {
    index: 6,
    sign: 'Libra',
    season: 'Autumn',
    phase: 'begin',
    element: 'Air',
    modality: 'Cardinal',
    dateRange: { start: 'Sep 23', end: 'Oct 22' },
    solarMeaning: 'Autumnal equinox - day and night equal. Balance, reflection, relationship.',
  },
  {
    index: 7,
    sign: 'Scorpio',
    season: 'Autumn',
    phase: 'core',
    element: 'Water',
    modality: 'Fixed',
    dateRange: { start: 'Oct 23', end: 'Nov 21' },
    solarMeaning: 'Deep autumn - leaves fall, life prepares for darkness. Transformation.',
  },
  {
    index: 8,
    sign: 'Sagittarius',
    season: 'Autumn',
    phase: 'end',
    element: 'Fire',
    modality: 'Mutable',
    dateRange: { start: 'Nov 22', end: 'Dec 21' },
    solarMeaning: 'Late autumn - harvest complete, seeking meaning before winter silence.',
  },

  // WINTER
  {
    index: 9,
    sign: 'Capricorn',
    season: 'Winter',
    phase: 'begin',
    element: 'Earth',
    modality: 'Cardinal',
    dateRange: { start: 'Dec 22', end: 'Jan 19' },
    solarMeaning: 'Winter solstice - shortest day. Light returns within darkness. Building.',
  },
  {
    index: 10,
    sign: 'Aquarius',
    season: 'Winter',
    phase: 'core',
    element: 'Air',
    modality: 'Fixed',
    dateRange: { start: 'Jan 20', end: 'Feb 18' },
    solarMeaning: 'Deep winter - stillness creates clarity. Visionary thinking in cold.',
  },
  {
    index: 11,
    sign: 'Pisces',
    season: 'Winter',
    phase: 'end',
    element: 'Water',
    modality: 'Mutable',
    dateRange: { start: 'Feb 19', end: 'Mar 20' },
    solarMeaning: 'Late winter - ice melts, boundaries soften. Preparing for spring rebirth.',
  },
];

// =============================================================================
// DATE CALCULATION HELPERS
// =============================================================================

/**
 * Approximate sun sign date boundaries (day of year)
 * These are simplified - real dates shift slightly year to year
 */
const SIGN_BOUNDARIES: Array<{ sign: SignKey; startDay: number }> = [
  { sign: 'Capricorn', startDay: 1 },    // Jan 1-19 (winter continuation)
  { sign: 'Aquarius', startDay: 20 },    // Jan 20
  { sign: 'Pisces', startDay: 50 },      // Feb 19
  { sign: 'Aries', startDay: 80 },       // Mar 21
  { sign: 'Taurus', startDay: 111 },     // Apr 20
  { sign: 'Gemini', startDay: 142 },     // May 21
  { sign: 'Cancer', startDay: 172 },     // Jun 21
  { sign: 'Leo', startDay: 204 },        // Jul 23
  { sign: 'Virgo', startDay: 235 },      // Aug 23
  { sign: 'Libra', startDay: 266 },      // Sep 23
  { sign: 'Scorpio', startDay: 297 },    // Oct 23
  { sign: 'Sagittarius', startDay: 326 },// Nov 22
  { sign: 'Capricorn', startDay: 356 },  // Dec 22
];

/**
 * Get day of year (1-365/366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get the current seasonal slot from a date
 */
export function getCurrentSeasonalSlot(date: Date): SeasonalSlot {
  const dayOfYear = getDayOfYear(date);

  // Find which sign period we're in
  let currentSign: SignKey = 'Capricorn';
  for (let i = SIGN_BOUNDARIES.length - 1; i >= 0; i--) {
    if (dayOfYear >= SIGN_BOUNDARIES[i].startDay) {
      currentSign = SIGN_BOUNDARIES[i].sign;
      break;
    }
  }

  // Find the slot for this sign
  const slot = SEASONAL_CALENDAR.find(s => s.sign === currentSign);
  return slot || SEASONAL_CALENDAR[0];
}

/**
 * Get the birth sign's seasonal slot
 */
export function getBirthSeasonalSlot(birthDate: Date): SeasonalSlot {
  return getCurrentSeasonalSlot(birthDate);
}

/**
 * Calculate how many slots from birth sign to current slot (0-11)
 */
export function getSeasonalDistance(birthSign: SignKey, currentSlot: SeasonalSlot): number {
  const birthIndex = TROPICAL_ORDER.indexOf(birthSign);
  const currentIndex = currentSlot.index;
  return ((currentIndex - birthIndex) + 12) % 12;
}

// =============================================================================
// ELEMENT & MODALITY RELATIONSHIP HELPERS
// =============================================================================

/**
 * Element relationships for resonance calculation
 */
export function getElementRelationship(
  birthElement: Element,
  slotElement: Element
): 'same' | 'compatible' | 'neutral' | 'challenging' {
  if (birthElement === slotElement) return 'same';

  // Compatible pairs: Fire+Air, Earth+Water
  const compatible: Record<Element, Element> = {
    Fire: 'Air',
    Air: 'Fire',
    Earth: 'Water',
    Water: 'Earth',
  };

  if (compatible[birthElement] === slotElement) return 'compatible';

  // Challenging pairs: Fire+Water, Earth+Air
  const challenging: Record<Element, Element> = {
    Fire: 'Water',
    Water: 'Fire',
    Earth: 'Air',
    Air: 'Earth',
  };

  if (challenging[birthElement] === slotElement) return 'challenging';

  return 'neutral';
}

/**
 * Modality relationships
 */
export function getModalityRelationship(
  birthModality: Modality,
  slotModality: Modality
): 'same' | 'complementary' | 'challenging' {
  if (birthModality === slotModality) return 'same';

  // Fixed vs Cardinal or Mutable vs Cardinal = complementary
  // Fixed vs Mutable = can be challenging (stubbornness vs change)
  if (
    (birthModality === 'Fixed' && slotModality === 'Mutable') ||
    (birthModality === 'Mutable' && slotModality === 'Fixed')
  ) {
    return 'challenging';
  }

  return 'complementary';
}

/**
 * Calculate overall seasonal resonance score
 * Returns 0-100 based on element and modality alignment
 */
export function calculateSeasonalResonance(
  birthSign: SignKey,
  slot: SeasonalSlot
): { score: number; level: 'high' | 'moderate' | 'low' | 'challenging' } {
  const birthLesson = SIGN_LESSONS[birthSign];

  // Is this the same sign? Maximum resonance
  if (birthSign === slot.sign) {
    return { score: 100, level: 'high' };
  }

  // Is this the opposite sign? Special intensity
  const distance = getSeasonalDistance(birthSign, slot);
  if (distance === 6) {
    return { score: 50, level: 'challenging' };
  }

  const elementRel = getElementRelationship(birthLesson.element, slot.element);
  const modalityRel = getModalityRelationship(birthLesson.modality, slot.modality);

  let score = 50; // Base score

  // Element scoring
  switch (elementRel) {
    case 'same': score += 25; break;
    case 'compatible': score += 15; break;
    case 'neutral': score += 5; break;
    case 'challenging': score -= 15; break;
  }

  // Modality scoring
  switch (modalityRel) {
    case 'same': score += 25; break;
    case 'complementary': score += 10; break;
    case 'challenging': score -= 10; break;
  }

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine level
  let level: 'high' | 'moderate' | 'low' | 'challenging';
  if (score >= 75) level = 'high';
  else if (score >= 50) level = 'moderate';
  else if (score >= 25) level = 'low';
  else level = 'challenging';

  return { score, level };
}

// =============================================================================
// SWISS EPHEMERIS PRECISION DATES
// =============================================================================

/**
 * Precise seasonal ingress dates calculated by Swiss Ephemeris.
 * These can be used for overlay displays showing exact season transitions.
 *
 * Format: { sign: { year: Date } }
 */
export interface SeasonalIngressDate {
  sign: SignKey;
  season: Season;
  phase: SeasonPhase;
  datetime: Date;
  isEquinox: boolean;
  isSolstice: boolean;
  eventName?: string;
}

/**
 * Swiss Ephemeris calculated dates for 2026/2027
 * (Aquarius and Pisces fall in early 2027)
 */
export const SWISS_EPHEMERIS_DATES_2026: SeasonalIngressDate[] = [
  // SPRING 2026
  {
    sign: 'Aries',
    season: 'Spring',
    phase: 'begin',
    datetime: new Date(Date.UTC(2026, 2, 20, 14, 45)),  // Mar 20, 2026 14:45 UTC
    isEquinox: true,
    isSolstice: false,
    eventName: 'Vernal Equinox',
  },
  {
    sign: 'Taurus',
    season: 'Spring',
    phase: 'core',
    datetime: new Date(Date.UTC(2026, 3, 20, 1, 39)),   // Apr 20, 2026 01:39 UTC
    isEquinox: false,
    isSolstice: false,
  },
  {
    sign: 'Gemini',
    season: 'Spring',
    phase: 'end',
    datetime: new Date(Date.UTC(2026, 4, 21, 0, 36)),   // May 21, 2026 00:36 UTC
    isEquinox: false,
    isSolstice: false,
  },

  // SUMMER 2026
  {
    sign: 'Cancer',
    season: 'Summer',
    phase: 'begin',
    datetime: new Date(Date.UTC(2026, 5, 21, 8, 24)),   // Jun 21, 2026 08:24 UTC
    isEquinox: false,
    isSolstice: true,
    eventName: 'Summer Solstice',
  },
  {
    sign: 'Leo',
    season: 'Summer',
    phase: 'core',
    datetime: new Date(Date.UTC(2026, 6, 22, 19, 13)),  // Jul 22, 2026 19:13 UTC
    isEquinox: false,
    isSolstice: false,
  },
  {
    sign: 'Virgo',
    season: 'Summer',
    phase: 'end',
    datetime: new Date(Date.UTC(2026, 7, 23, 2, 18)),   // Aug 23, 2026 02:18 UTC
    isEquinox: false,
    isSolstice: false,
  },

  // AUTUMN 2026
  {
    sign: 'Libra',
    season: 'Autumn',
    phase: 'begin',
    datetime: new Date(Date.UTC(2026, 8, 23, 0, 5)),    // Sep 23, 2026 00:05 UTC
    isEquinox: true,
    isSolstice: false,
    eventName: 'Autumnal Equinox',
  },
  {
    sign: 'Scorpio',
    season: 'Autumn',
    phase: 'core',
    datetime: new Date(Date.UTC(2026, 9, 23, 9, 37)),   // Oct 23, 2026 09:37 UTC
    isEquinox: false,
    isSolstice: false,
  },
  {
    sign: 'Sagittarius',
    season: 'Autumn',
    phase: 'end',
    datetime: new Date(Date.UTC(2026, 10, 22, 7, 23)),  // Nov 22, 2026 07:23 UTC
    isEquinox: false,
    isSolstice: false,
  },

  // WINTER 2026/2027
  {
    sign: 'Capricorn',
    season: 'Winter',
    phase: 'begin',
    datetime: new Date(Date.UTC(2026, 11, 21, 20, 50)), // Dec 21, 2026 20:50 UTC
    isEquinox: false,
    isSolstice: true,
    eventName: 'Winter Solstice',
  },
  {
    sign: 'Aquarius',
    season: 'Winter',
    phase: 'core',
    datetime: new Date(Date.UTC(2027, 0, 20, 7, 29)),   // Jan 20, 2027 07:29 UTC
    isEquinox: false,
    isSolstice: false,
  },
  {
    sign: 'Pisces',
    season: 'Winter',
    phase: 'end',
    datetime: new Date(Date.UTC(2027, 1, 18, 21, 33)),  // Feb 18, 2027 21:33 UTC
    isEquinox: false,
    isSolstice: false,
  },
];

/**
 * Get the current seasonal phase based on Swiss Ephemeris precision dates.
 * Uses the 2026 dates as reference.
 */
export function getPreciseCurrentSeason(date: Date = new Date()): SeasonalIngressDate | null {
  // Sort dates and find which season we're currently in
  const sorted = [...SWISS_EPHEMERIS_DATES_2026].sort(
    (a, b) => a.datetime.getTime() - b.datetime.getTime()
  );

  for (let i = sorted.length - 1; i >= 0; i--) {
    if (date >= sorted[i].datetime) {
      return sorted[i];
    }
  }

  return null;
}

/**
 * Get days until next seasonal transition.
 */
export function getDaysUntilNextSeason(date: Date = new Date()): {
  nextSeason: SeasonalIngressDate;
  daysUntil: number;
} | null {
  const sorted = [...SWISS_EPHEMERIS_DATES_2026].sort(
    (a, b) => a.datetime.getTime() - b.datetime.getTime()
  );

  for (const ingress of sorted) {
    if (ingress.datetime > date) {
      const msUntil = ingress.datetime.getTime() - date.getTime();
      const daysUntil = Math.ceil(msUntil / (1000 * 60 * 60 * 24));
      return { nextSeason: ingress, daysUntil };
    }
  }

  return null;
}

/**
 * Format seasonal dates for display as a calendar overlay.
 */
export function formatSeasonalCalendarOverlay(): string[] {
  return SWISS_EPHEMERIS_DATES_2026.map(ingress => {
    const dateStr = ingress.datetime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = ingress.datetime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    const event = ingress.eventName ? ` (${ingress.eventName})` : '';
    return `${ingress.season} ${ingress.phase}: ${ingress.sign} - ${dateStr} ${timeStr}${event}`;
  });
}

// =============================================================================
// EXPORTS
// =============================================================================

export { SIGN_LESSONS, TROPICAL_ORDER };
export type { SignKey, Season, Element, Modality };
export default SEASONAL_CALENDAR;
