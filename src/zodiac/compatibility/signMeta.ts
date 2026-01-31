/**
 * Sign Metadata Adapter
 *
 * Bridges the compatibility engine with existing GENESIS data structures.
 * Provides clean accessors for element, modality, and season from any sign.
 *
 * GENESIS AstroProfile - January 2025
 */

import type { ZodiacSign, Element, Modality, Season } from './types';
import { ELEMENT, MODALITY, SEASON } from '../../data/tropicalSeasons';

// =============================================================================
// SIGN METADATA ACCESSORS
// =============================================================================

/**
 * Get the element (Fire/Earth/Air/Water) for a zodiac sign
 */
export function getElement(sign: ZodiacSign): Element {
  return ELEMENT[sign] as Element;
}

/**
 * Get the modality (Cardinal/Fixed/Mutable) for a zodiac sign
 */
export function getModality(sign: ZodiacSign): Modality {
  return MODALITY[sign] as Modality;
}

/**
 * Get the season (Spring/Summer/Autumn/Winter) for a zodiac sign
 */
export function getSeason(sign: ZodiacSign): Season {
  return SEASON[sign] as Season;
}

// =============================================================================
// ELEMENT RELATIONSHIP HELPERS
// =============================================================================

/**
 * Elements that naturally support each other:
 * - Fire + Air: Air fans Fire's flames
 * - Earth + Water: Water nourishes Earth
 */
export const ELEMENT_SUPPORT_PAIRS: Set<string> = new Set([
  'Fire-Air', 'Air-Fire',
  'Earth-Water', 'Water-Earth',
]);

/**
 * Elements that create friction (but potential growth):
 * - Fire + Water: Steam - passion meets sensitivity
 * - Earth + Air: Practical vs theoretical
 */
export const ELEMENT_FRICTION_PAIRS: Set<string> = new Set([
  'Fire-Water', 'Water-Fire',
  'Earth-Air', 'Air-Earth',
]);

/**
 * Cross-element functional pairs (educational/growth-oriented):
 * - Fire + Earth: Vision + Manifestation
 * - Air + Water: Meaning + Feeling
 */
export const CROSS_ELEMENT_FUNCTIONAL: Set<string> = new Set([
  'Fire-Earth', 'Earth-Fire',
  'Air-Water', 'Water-Air',
]);

// =============================================================================
// SEASON RELATIONSHIP HELPERS
// =============================================================================

/**
 * Opposite seasons map (180° apart in the year)
 */
export const OPPOSITE_SEASONS: Record<Season, Season> = {
  Spring: 'Autumn',
  Summer: 'Winter',
  Autumn: 'Spring',
  Winter: 'Summer',
};

/**
 * Adjacent seasons (natural progression)
 */
export const ADJACENT_SEASONS: Record<Season, Season[]> = {
  Spring: ['Winter', 'Summer'],
  Summer: ['Spring', 'Autumn'],
  Autumn: ['Summer', 'Winter'],
  Winter: ['Autumn', 'Spring'],
};

// =============================================================================
// MODALITY RELATIONSHIP HELPERS
// =============================================================================

/**
 * Modality complementarity patterns:
 * - Cardinal-Mutable: Best for innovation/growth (Initiator + Adapter)
 * - Cardinal-Fixed: Good for execution (Starter + Sustainer)
 * - Mutable-Mutable: Highly adaptive but needs anchoring
 * - Fixed-Fixed: Durable but can stalemate
 */
export type ModalityPairType =
  | 'cardinal_mutable'   // Best complementarity
  | 'cardinal_fixed'     // Execution pair
  | 'mutable_mutable'    // Adaptive pair
  | 'cardinal_cardinal'  // Leadership clash potential
  | 'fixed_fixed'        // Stalemate potential
  | 'mutable_fixed';     // Flexibility + stability

export function getModalityPairType(a: Modality, b: Modality): ModalityPairType {
  if (a === 'Cardinal' && b === 'Mutable') return 'cardinal_mutable';
  if (a === 'Mutable' && b === 'Cardinal') return 'cardinal_mutable';
  if (a === 'Cardinal' && b === 'Fixed') return 'cardinal_fixed';
  if (a === 'Fixed' && b === 'Cardinal') return 'cardinal_fixed';
  if (a === 'Mutable' && b === 'Mutable') return 'mutable_mutable';
  if (a === 'Cardinal' && b === 'Cardinal') return 'cardinal_cardinal';
  if (a === 'Fixed' && b === 'Fixed') return 'fixed_fixed';
  return 'mutable_fixed';
}

// =============================================================================
// SIGN INDEX UTILITIES
// =============================================================================

const SIGN_ORDER: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

/**
 * Get the index of a sign (0-11)
 */
export function getSignIndex(sign: ZodiacSign): number {
  return SIGN_ORDER.indexOf(sign);
}

/**
 * Get the number of signs between two signs (0-6)
 * This is the "steps" count for aspect calculation
 */
export function getSignSteps(a: ZodiacSign, b: ZodiacSign): number {
  const idxA = getSignIndex(a);
  const idxB = getSignIndex(b);
  const diff = Math.abs(idxA - idxB);
  return diff <= 6 ? diff : 12 - diff;
}
