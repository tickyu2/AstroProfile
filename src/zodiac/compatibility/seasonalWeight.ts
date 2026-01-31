/**
 * Seasonal Weight Adjustment
 *
 * Cusps near equinoxes and solstices carry extra significance
 * because they mark major seasonal polarity shifts.
 *
 * Equinoxes (Aries, Libra):
 * - Day and night equal length
 * - Maximum rate of change
 * - Spring/Autumn axis (growth ↔ release)
 *
 * Solstices (Cancer, Capricorn):
 * - Longest/shortest days
 * - Peak seasonal intensity
 * - Summer/Winter axis (expansion ↔ contraction)
 *
 * GENESIS AstroProfile - January 2025
 */

import type { ZodiacSign, Season } from './types';

// =============================================================================
// SEASONAL SIGNIFICANCE CATEGORIES
// =============================================================================

/**
 * Equinox signs: Maximum rate of seasonal change
 * These cusps feel the most "transitional"
 */
export const EQUINOX_SIGNS: ZodiacSign[] = ['Aries', 'Libra'];

/**
 * Solstice signs: Peak seasonal intensity
 * These cusps feel the most "pivotal"
 */
export const SOLSTICE_SIGNS: ZodiacSign[] = ['Cancer', 'Capricorn'];

/**
 * Cardinal signs: Season starters
 * These signs initiate seasonal energy
 */
export const CARDINAL_SIGNS: ZodiacSign[] = ['Aries', 'Cancer', 'Libra', 'Capricorn'];

/**
 * Fixed signs: Season sustainers
 * These signs embody peak seasonal energy
 */
export const FIXED_SIGNS: ZodiacSign[] = ['Taurus', 'Leo', 'Scorpio', 'Aquarius'];

/**
 * Mutable signs: Season transitioners
 * These signs prepare for the next season
 */
export const MUTABLE_SIGNS: ZodiacSign[] = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];

// =============================================================================
// WEIGHT MULTIPLIERS
// =============================================================================

/**
 * Weight multipliers for seasonal significance
 *
 * These are applied to cusp blends to emphasize
 * transitions at key astronomical points.
 */
export const SEASONAL_WEIGHT_MULTIPLIERS = {
  equinox: 1.20,   // 20% boost for equinox cusps
  solstice: 1.15,  // 15% boost for solstice cusps
  cardinal: 1.10,  // 10% boost for other cardinal cusps
  fixed: 1.00,     // No adjustment for fixed signs
  mutable: 0.95,   // Slight reduction for mutable (already transitional)
} as const;

// =============================================================================
// CORE WEIGHT FUNCTION
// =============================================================================

/**
 * Get the seasonal weight multiplier for a sign
 *
 * This adjusts cusp blend intensity based on
 * the astronomical significance of the sign.
 *
 * @param sign - The zodiac sign
 * @returns Weight multiplier (0.95 to 1.20)
 */
export function seasonWeight(sign: ZodiacSign): number {
  if (EQUINOX_SIGNS.includes(sign)) {
    return SEASONAL_WEIGHT_MULTIPLIERS.equinox;
  }

  if (SOLSTICE_SIGNS.includes(sign)) {
    return SEASONAL_WEIGHT_MULTIPLIERS.solstice;
  }

  if (CARDINAL_SIGNS.includes(sign)) {
    return SEASONAL_WEIGHT_MULTIPLIERS.cardinal;
  }

  if (MUTABLE_SIGNS.includes(sign)) {
    return SEASONAL_WEIGHT_MULTIPLIERS.mutable;
  }

  return SEASONAL_WEIGHT_MULTIPLIERS.fixed;
}

/**
 * Get the seasonal weight for a cusp transition
 *
 * When crossing from one sign to another, use the
 * average of both signs' weights.
 *
 * @param fromSign - The sign being left
 * @param toSign - The sign being entered
 * @returns Average weight multiplier
 */
export function cuspWeight(fromSign: ZodiacSign, toSign: ZodiacSign): number {
  return (seasonWeight(fromSign) + seasonWeight(toSign)) / 2;
}

// =============================================================================
// SEASONAL CUSP DESCRIPTIONS
// =============================================================================

export interface CuspDescription {
  from: ZodiacSign;
  to: ZodiacSign;
  name: string;
  astronomicalEvent: string;
  seasonalMeaning: string;
  psychologicalTheme: string;
  weight: number;
}

/**
 * Get detailed description for a cusp transition
 */
export function getCuspDescription(from: ZodiacSign, to: ZodiacSign): CuspDescription {
  const weight = cuspWeight(from, to);

  // Define special cusps
  const specialCusps: Record<string, Partial<CuspDescription>> = {
    'Pisces-Aries': {
      name: 'Cusp of Rebirth',
      astronomicalEvent: 'Spring Equinox (Vernal)',
      seasonalMeaning: 'End of the zodiacal year, beginning of new cycle',
      psychologicalTheme: 'Dissolution meets initiation — letting go to begin',
    },
    'Gemini-Cancer': {
      name: 'Cusp of Magic',
      astronomicalEvent: 'Summer Solstice',
      seasonalMeaning: 'Longest day, peak light, turning inward',
      psychologicalTheme: 'Intellectual curiosity meets emotional depth',
    },
    'Virgo-Libra': {
      name: 'Cusp of Beauty',
      astronomicalEvent: 'Autumn Equinox',
      seasonalMeaning: 'Harvest completion, seeking balance',
      psychologicalTheme: 'Service meets partnership — self to other',
    },
    'Sagittarius-Capricorn': {
      name: 'Cusp of Prophecy',
      astronomicalEvent: 'Winter Solstice',
      seasonalMeaning: 'Darkest day, inner light, new foundations',
      psychologicalTheme: 'Vision meets structure — dreaming into building',
    },
    // Other cusps
    'Aries-Taurus': {
      name: 'Cusp of Power',
      astronomicalEvent: 'Mid-Spring',
      seasonalMeaning: 'Initiative stabilizes into form',
      psychologicalTheme: 'Impulse meets patience — starting to sustaining',
    },
    'Taurus-Gemini': {
      name: 'Cusp of Energy',
      astronomicalEvent: 'Late Spring',
      seasonalMeaning: 'Grounding gives way to movement',
      psychologicalTheme: 'Stability meets curiosity — rooting to exploring',
    },
    'Cancer-Leo': {
      name: 'Cusp of Oscillation',
      astronomicalEvent: 'Mid-Summer',
      seasonalMeaning: 'Nurturing expresses outward',
      psychologicalTheme: 'Care meets creation — protecting to expressing',
    },
    'Leo-Virgo': {
      name: 'Cusp of Exposure',
      astronomicalEvent: 'Late Summer',
      seasonalMeaning: 'Expression refines into service',
      psychologicalTheme: 'Drama meets humility — shining to serving',
    },
    'Libra-Scorpio': {
      name: 'Cusp of Drama',
      astronomicalEvent: 'Mid-Autumn',
      seasonalMeaning: 'Harmony deepens into intensity',
      psychologicalTheme: 'Balance meets transformation — surface to depth',
    },
    'Scorpio-Sagittarius': {
      name: 'Cusp of Revolution',
      astronomicalEvent: 'Late Autumn',
      seasonalMeaning: 'Transformation seeks meaning',
      psychologicalTheme: 'Depth meets expansion — diving to soaring',
    },
    'Capricorn-Aquarius': {
      name: 'Cusp of Mystery',
      astronomicalEvent: 'Mid-Winter',
      seasonalMeaning: 'Structure envisions future',
      psychologicalTheme: 'Tradition meets innovation — past to future',
    },
    'Aquarius-Pisces': {
      name: 'Cusp of Sensitivity',
      astronomicalEvent: 'Late Winter',
      seasonalMeaning: 'Vision dissolves into unity',
      psychologicalTheme: 'Ideas meet feelings — thinking to sensing',
    },
  };

  const key = `${from}-${to}`;
  const special = specialCusps[key];

  return {
    from,
    to,
    name: special?.name || `${from}-${to} Cusp`,
    astronomicalEvent: special?.astronomicalEvent || 'Zodiacal transition',
    seasonalMeaning: special?.seasonalMeaning || `Transition from ${from} to ${to}`,
    psychologicalTheme: special?.psychologicalTheme || `${from} energy meeting ${to} energy`,
    weight,
  };
}

// =============================================================================
// SEASONAL AXIS HELPERS
// =============================================================================

/**
 * Get the season for a sign
 */
export function getSignSeason(sign: ZodiacSign): Season {
  const seasonMap: Record<ZodiacSign, Season> = {
    Aries: 'Spring', Taurus: 'Spring', Gemini: 'Spring',
    Cancer: 'Summer', Leo: 'Summer', Virgo: 'Summer',
    Libra: 'Autumn', Scorpio: 'Autumn', Sagittarius: 'Autumn',
    Capricorn: 'Winter', Aquarius: 'Winter', Pisces: 'Winter',
  };
  return seasonMap[sign];
}

/**
 * Check if a cusp crosses seasonal boundaries
 */
export function isCrossSeasonCusp(from: ZodiacSign, to: ZodiacSign): boolean {
  return getSignSeason(from) !== getSignSeason(to);
}

/**
 * Get the seasonal axis for a sign (what season it opposes)
 */
export function getOppositeSeasonSign(sign: ZodiacSign): ZodiacSign {
  const opposites: Record<ZodiacSign, ZodiacSign> = {
    Aries: 'Libra', Libra: 'Aries',
    Taurus: 'Scorpio', Scorpio: 'Taurus',
    Gemini: 'Sagittarius', Sagittarius: 'Gemini',
    Cancer: 'Capricorn', Capricorn: 'Cancer',
    Leo: 'Aquarius', Aquarius: 'Leo',
    Virgo: 'Pisces', Pisces: 'Virgo',
  };
  return opposites[sign];
}
