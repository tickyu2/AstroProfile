/**
 * Resolve Sign Context — Seasonal Phase + Cusp Neighbor Detection
 *
 * Maps a planet's longitude (or day-of-year for Sun) to its seasonal
 * phase (Begin / Core / End) and detects cusp neighbors within 7 days.
 *
 * Pipeline:
 *   longitude / dayOfYear → sign window → seasonal phase + cusp context
 *   → feeds into BlendedPlanetPosition.seasonContext for UI display
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey, Season, Modality } from '../tropicalMap';
import { SIGN_LESSONS } from '../tropicalMap';

// =============================================================================
// TYPES
// =============================================================================

export type SeasonPhase = 'Begin' | 'Core' | 'End';
export type Hemisphere = 'Northern' | 'Southern';

/**
 * Season context for a planet's position.
 * Resolves the sign's role in the seasonal cycle plus cusp proximity.
 */
export interface SignContext {
  /** Primary zodiac sign */
  primaryName: SignKey;
  /** Neighbor sign if within cusp window, null otherwise */
  neighborName: SignKey | null;
  /** Days after the sign's start boundary */
  daysAfterStart: number;
  /** Days before the sign's end boundary */
  daysBeforeEnd: number;
  /** Season for this sign (hemisphere-adjusted) */
  season: Season;
  /** Phase within the season: Begin (Cardinal), Core (Fixed), End (Mutable) */
  phase: SeasonPhase;
  /** Day within the season (1-based, across all 3 signs of the season) */
  dayInSeason: number;
}

// =============================================================================
// SEASON TABLE — Each sign's day boundaries + seasonal metadata
// =============================================================================

interface SeasonTableEntry {
  sign: SignKey;
  startDay: number;
  endDay: number;
  season: Season;
  phase: SeasonPhase;
  previous: SignKey;
  next: SignKey;
}

/**
 * Map modality to seasonal phase.
 * Cardinal = Begin (initiates the season)
 * Fixed = Core (sustains the season)
 * Mutable = End (transitions out of the season)
 */
const MODALITY_PHASE: Record<Modality, SeasonPhase> = {
  Cardinal: 'Begin',
  Fixed: 'Core',
  Mutable: 'End',
};

/**
 * Season table combining day boundaries with tropicalMap metadata.
 * Ordered by calendar position (Capricorn first — spans year boundary).
 */
const SEASON_TABLE: SeasonTableEntry[] = [
  { sign: 'Capricorn',   startDay: 356, endDay: 20,  season: 'Winter', phase: 'Begin', previous: 'Sagittarius', next: 'Aquarius' },
  { sign: 'Aquarius',    startDay: 20,  endDay: 50,  season: 'Winter', phase: 'Core',  previous: 'Capricorn',  next: 'Pisces' },
  { sign: 'Pisces',      startDay: 50,  endDay: 80,  season: 'Winter', phase: 'End',   previous: 'Aquarius',   next: 'Aries' },
  { sign: 'Aries',       startDay: 80,  endDay: 110, season: 'Spring', phase: 'Begin', previous: 'Pisces',     next: 'Taurus' },
  { sign: 'Taurus',      startDay: 110, endDay: 141, season: 'Spring', phase: 'Core',  previous: 'Aries',      next: 'Gemini' },
  { sign: 'Gemini',      startDay: 141, endDay: 172, season: 'Spring', phase: 'End',   previous: 'Taurus',     next: 'Cancer' },
  { sign: 'Cancer',      startDay: 172, endDay: 204, season: 'Summer', phase: 'Begin', previous: 'Gemini',     next: 'Leo' },
  { sign: 'Leo',         startDay: 204, endDay: 235, season: 'Summer', phase: 'Core',  previous: 'Cancer',     next: 'Virgo' },
  { sign: 'Virgo',       startDay: 235, endDay: 266, season: 'Summer', phase: 'End',   previous: 'Leo',        next: 'Libra' },
  { sign: 'Libra',       startDay: 266, endDay: 296, season: 'Autumn', phase: 'Begin', previous: 'Virgo',      next: 'Scorpio' },
  { sign: 'Scorpio',     startDay: 296, endDay: 326, season: 'Autumn', phase: 'Core',  previous: 'Libra',      next: 'Sagittarius' },
  { sign: 'Sagittarius', startDay: 326, endDay: 356, season: 'Autumn', phase: 'End',   previous: 'Scorpio',    next: 'Capricorn' },
];

// =============================================================================
// LOOKUP HELPERS
// =============================================================================

/** Number of days within the cusp window for neighbor detection */
const CUSP_WINDOW = 7;

/**
 * Find the season table entry for a given day of year.
 * Handles Capricorn's year-spanning window (356–20).
 */
function findEntryForDay(dayOfYear: number): SeasonTableEntry {
  // Capricorn spans the year boundary
  if (dayOfYear >= 356 || dayOfYear < 20) {
    return SEASON_TABLE[0]; // Capricorn
  }

  for (let i = 1; i < SEASON_TABLE.length; i++) {
    const entry = SEASON_TABLE[i];
    if (dayOfYear >= entry.startDay && dayOfYear < entry.endDay) {
      return entry;
    }
  }

  // Fallback (should not reach)
  return SEASON_TABLE[0];
}

/**
 * Flip seasons for Southern hemisphere.
 * Spring ↔ Autumn, Summer ↔ Winter.
 */
const SEASON_FLIP: Record<Season, Season> = {
  Spring: 'Autumn',
  Summer: 'Winter',
  Autumn: 'Spring',
  Winter: 'Summer',
};

/**
 * Get the first day of the season containing this sign.
 * Used to compute dayInSeason.
 */
function getSeasonStartDay(season: Season): number {
  // Each season starts with its Cardinal sign
  switch (season) {
    case 'Spring': return 80;   // Aries start
    case 'Summer': return 172;  // Cancer start
    case 'Autumn': return 266;  // Libra start
    case 'Winter': return 356;  // Capricorn start (wraps around year)
  }
}

/**
 * Compute the day within a season (1-based).
 * Season spans ~90 days across 3 signs.
 */
function computeDayInSeason(dayOfYear: number, season: Season): number {
  const seasonStart = getSeasonStartDay(season);

  if (season === 'Winter') {
    // Winter wraps: Capricorn 356 → Pisces ~80
    if (dayOfYear >= 356) {
      return dayOfYear - 356 + 1;
    }
    // Jan–Mar portion
    return (366 - 356) + dayOfYear + 1;
  }

  return dayOfYear - seasonStart + 1;
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

/**
 * Resolve a planet's seasonal context from its day-of-year position.
 *
 * Returns the sign's seasonal role (Begin/Core/End), the nearest cusp
 * neighbor (if within 7 days of a boundary), hemisphere-adjusted season,
 * and how far through the season this planet sits.
 *
 * @param primarySign - The primary zodiac sign for this planet
 * @param dayOfYear - Day of year (1-365/366)
 * @param hemisphere - 'Northern' (default) or 'Southern' (flips seasons)
 * @returns SignContext with seasonal phase, cusp neighbor, and timing
 *
 * @example
 *   // Taurus, April 23 (day 113), Northern hemisphere
 *   resolveSignContext('Taurus', 113)
 *   // → { primaryName: 'Taurus', neighborName: 'Aries', daysAfterStart: 3,
 *   //     daysBeforeEnd: 28, season: 'Spring', phase: 'Core', dayInSeason: 34 }
 */
export function resolveSignContext(
  primarySign: SignKey,
  dayOfYear: number,
  hemisphere: Hemisphere = 'Northern',
): SignContext {
  const entry = findEntryForDay(dayOfYear);

  // Calculate days from sign boundaries
  let daysAfterStart: number;
  let signDuration: number;

  if (entry.sign === 'Capricorn') {
    // Year-spanning sign
    if (dayOfYear >= 356) {
      daysAfterStart = dayOfYear - 356 + 1;
    } else {
      daysAfterStart = (366 - 356) + dayOfYear + 1;
    }
    signDuration = (366 - 356) + 20; // ~30 days
  } else {
    daysAfterStart = dayOfYear - entry.startDay + 1;
    signDuration = entry.endDay - entry.startDay;
  }

  const daysBeforeEnd = signDuration - daysAfterStart;

  // Cusp neighbor detection: within CUSP_WINDOW days of start or end
  let neighborName: SignKey | null = null;
  if (daysAfterStart <= CUSP_WINDOW) {
    neighborName = entry.previous;
  } else if (daysBeforeEnd < CUSP_WINDOW && daysBeforeEnd >= 0) {
    neighborName = entry.next;
  }

  // Season (hemisphere-adjusted)
  const rawSeason = entry.season;
  const season = hemisphere === 'Southern' ? SEASON_FLIP[rawSeason] : rawSeason;

  // Phase from modality (Begin/Core/End)
  const phase = entry.phase;

  // Day within the season (1-based, across all 3 signs)
  const dayInSeason = computeDayInSeason(dayOfYear, rawSeason);

  return {
    primaryName: primarySign,
    neighborName,
    daysAfterStart,
    daysBeforeEnd,
    season,
    phase,
    dayInSeason,
  };
}

/**
 * Resolve sign context from ecliptic longitude instead of day-of-year.
 * Converts longitude to approximate day-of-year (1° ≈ 1 day).
 *
 * @param primarySign - The primary zodiac sign
 * @param longitude - Ecliptic longitude in degrees (0-360)
 * @param hemisphere - Hemisphere for season adjustment
 * @returns SignContext
 *
 * @example
 *   // 33° longitude = early Taurus (≈ day 113)
 *   resolveSignContextFromLongitude('Taurus', 33)
 */
export function resolveSignContextFromLongitude(
  primarySign: SignKey,
  longitude: number,
  hemisphere: Hemisphere = 'Northern',
): SignContext {
  // Convert longitude to approximate day-of-year
  // 0° Aries = ~March 21 = day 80
  // Each degree ≈ 1 day (360° ≈ 365.25 days)
  const dayFraction = (longitude / 360) * 365.25;
  const dayOfYear = Math.round(((dayFraction + 80 - 1) % 365) + 1);

  return resolveSignContext(primarySign, dayOfYear, hemisphere);
}

// =============================================================================
// PHASE DISPLAY HELPERS
// =============================================================================

/**
 * Get a human-readable label for the seasonal phase.
 *
 * @example
 *   getPhaseLabel('Begin') → 'The Spark — Season Begins'
 *   getPhaseLabel('Core')  → 'The Fuel — Season Peaks'
 *   getPhaseLabel('End')   → 'The Smoke — Season Shifts'
 */
export function getPhaseLabel(phase: SeasonPhase): string {
  switch (phase) {
    case 'Begin': return 'The Spark — Season Begins';
    case 'Core':  return 'The Fuel — Season Peaks';
    case 'End':   return 'The Smoke — Season Shifts';
  }
}

/**
 * Get the modality associated with a seasonal phase.
 */
export function getPhaseModality(phase: SeasonPhase): Modality {
  switch (phase) {
    case 'Begin': return 'Cardinal';
    case 'Core':  return 'Fixed';
    case 'End':   return 'Mutable';
  }
}

/**
 * Get a short mythic description of the seasonal moment.
 *
 * @example
 *   getSeasonalMoment('Spring', 'Begin')
 *   → 'Spring awakens — the first spark of growth breaks through.'
 */
export function getSeasonalMoment(season: Season, phase: SeasonPhase): string {
  const moments: Record<Season, Record<SeasonPhase, string>> = {
    Spring: {
      Begin: 'Spring awakens — the first spark of growth breaks through.',
      Core:  'Spring deepens — roots take hold, abundance gathers.',
      End:   'Spring disperses — movement, connection, preparation for warmth.',
    },
    Summer: {
      Begin: 'Summer opens — protection gathers around what emerged.',
      Core:  'Summer blazes — full expression, unapologetic radiance.',
      End:   'Summer refines — the harvest is prepared with care.',
    },
    Autumn: {
      Begin: 'Autumn balances — self meets other in conscious relationship.',
      Core:  'Autumn deepens — truth strips away pretense, intensity rises.',
      End:   'Autumn expands — experience becomes wisdom, horizons widen.',
    },
    Winter: {
      Begin: 'Winter commits — energy conserves, structures are built to last.',
      Core:  'Winter imagines — cold clarity reveals what could be.',
      End:   'Winter dissolves — boundaries soften, the cycle prepares to turn again.',
    },
  };

  return moments[season][phase];
}

// =============================================================================
// EXPORTS
// =============================================================================

export { SEASON_TABLE, CUSP_WINDOW, SEASON_FLIP };
