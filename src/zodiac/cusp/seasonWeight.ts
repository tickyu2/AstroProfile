/**
 * Season Weight Amplification
 *
 * Gives cusps more psychological gravity when they cross
 * seasonal polarity points (equinoxes) or directional shifts (solstices).
 *
 * Rationale:
 * - Equinox signs (Aries, Libra): Polarity flip between light/dark dominance
 * - Solstice signs (Cancer, Capricorn): Directional reversal of light
 * - These astronomical moments carry more psychological weight
 *
 * GENESIS AstroProfile - January 2026
 */

import type { ZodiacSign } from '../../data/tropicalSeasons';

// =============================================================================
// SEASON AMPLIFICATION
// =============================================================================

/**
 * Get the seasonal amplifier for a sign's cusp
 *
 * Equinox signs (polarity flip) → 1.25x amplification
 * Solstice signs (directional shift) → 1.15x amplification
 * All other signs → 1.0x (no amplification)
 *
 * @param sign - The zodiac sign
 * @returns Amplification multiplier (1.0 to 1.25)
 */
export function seasonAmplifier(sign: ZodiacSign): number {
  // Equinox signs: polarity flip (day/night balance reverses)
  if (sign === 'Aries' || sign === 'Libra') return 1.25;

  // Solstice signs: directional shift (light starts increasing/decreasing)
  if (sign === 'Cancer' || sign === 'Capricorn') return 1.15;

  // All other signs: standard cusp weight
  return 1.0;
}

/**
 * Get explanation for why this sign's cusp has extra weight
 */
export function getSeasonAmplifierExplanation(sign: ZodiacSign): string | null {
  if (sign === 'Aries') {
    return 'Spring Equinox: The moment light overtakes darkness. This cusp marks cosmic rebirth.';
  }
  if (sign === 'Libra') {
    return 'Autumn Equinox: The moment darkness overtakes light. This cusp marks cosmic reflection.';
  }
  if (sign === 'Cancer') {
    return 'Summer Solstice: Peak daylight, then the turning. This cusp marks fullness before release.';
  }
  if (sign === 'Capricorn') {
    return 'Winter Solstice: Deepest night, then the return. This cusp marks stillness before renewal.';
  }
  return null;
}

// =============================================================================
// CUSP CLASSIFICATION
// =============================================================================

export type CuspType = 'equinox' | 'solstice' | 'standard';

/**
 * Classify the type of cusp based on the incoming sign
 */
export function classifyCusp(sign: ZodiacSign): CuspType {
  if (sign === 'Aries' || sign === 'Libra') return 'equinox';
  if (sign === 'Cancer' || sign === 'Capricorn') return 'solstice';
  return 'standard';
}

/**
 * Get descriptive label for cusp type
 */
export function getCuspTypeLabel(type: CuspType): string {
  switch (type) {
    case 'equinox': return 'Equinox Cusp';
    case 'solstice': return 'Solstice Cusp';
    default: return 'Seasonal Cusp';
  }
}

// =============================================================================
// CARDINAL SIGN CHECK
// =============================================================================

/**
 * Check if a sign is cardinal (season-opener)
 * Cardinal signs start each season and carry initiating energy
 */
export function isCardinalSign(sign: ZodiacSign): boolean {
  return sign === 'Aries' || sign === 'Cancer' || sign === 'Libra' || sign === 'Capricorn';
}

/**
 * Get the cardinal sign that opens each season
 */
export const SEASON_OPENERS: Record<'Spring' | 'Summer' | 'Autumn' | 'Winter', ZodiacSign> = {
  Spring: 'Aries',
  Summer: 'Cancer',
  Autumn: 'Libra',
  Winter: 'Capricorn',
};
