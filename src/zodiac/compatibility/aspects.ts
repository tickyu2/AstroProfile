/**
 * Aspect Resolver
 *
 * Resolves the aspect (angular relationship) between two zodiac signs.
 * Wraps existing GENESIS angles.ts functionality for the compatibility engine.
 *
 * GENESIS AstroProfile - January 2025
 */

import type { ZodiacSign, AspectType } from './types';
import { getSignSteps } from './signMeta';
import { getAngleBetweenSigns, type AngleKey } from '../angles';
import type { SignKey } from '../tropicalMap';

// =============================================================================
// ASPECT CONSTANTS
// =============================================================================

/**
 * Degrees for each aspect type
 */
export const ASPECT_DEGREES: Record<AspectType, number> = {
  conjunction: 0,
  semi_sextile: 30,
  sextile: 60,
  square: 90,
  trine: 120,
  quincunx: 150,
  opposition: 180,
};

/**
 * Steps (signs apart) for each aspect type
 */
export const ASPECT_STEPS: Record<AspectType, number> = {
  conjunction: 0,
  semi_sextile: 1,
  sextile: 2,
  square: 3,
  trine: 4,
  quincunx: 5,
  opposition: 6,
};

/**
 * Map AngleKey (with hyphen) to AspectType (with underscore)
 * This bridges existing GENESIS naming to Copilot's convention
 */
function angleKeyToAspectType(key: AngleKey): AspectType {
  if (key === 'semi-sextile') return 'semi_sextile';
  return key as AspectType;
}

// =============================================================================
// ASPECT RESOLVER
// =============================================================================

export interface AspectResult {
  type: AspectType;
  degrees: number;
  steps: number;
}

/**
 * Resolve the aspect between two zodiac signs
 *
 * Uses existing GENESIS getAngleBetweenSigns() and maps to AspectType
 */
export function resolveAspect(a: ZodiacSign, b: ZodiacSign): AspectResult {
  // Use existing GENESIS function
  const angleLesson = getAngleBetweenSigns(a as SignKey, b as SignKey);

  if (angleLesson) {
    return {
      type: angleKeyToAspectType(angleLesson.key),
      degrees: angleLesson.degrees,
      steps: angleLesson.steps,
    };
  }

  // Fallback: calculate directly if needed
  const steps = getSignSteps(a, b);
  const aspectBySteps: AspectType[] = [
    'conjunction',    // 0 steps
    'semi_sextile',   // 1 step
    'sextile',        // 2 steps
    'square',         // 3 steps
    'trine',          // 4 steps
    'quincunx',       // 5 steps
    'opposition',     // 6 steps
  ];

  const type = aspectBySteps[steps] || 'conjunction';
  return {
    type,
    degrees: ASPECT_DEGREES[type],
    steps,
  };
}

// =============================================================================
// ASPECT NATURE CLASSIFICATION
// =============================================================================

/**
 * Aspect nature categories:
 * - harmonious: Easy flow, comfort (trine, sextile)
 * - challenging: Tension, growth catalyst (square, opposition)
 * - neutral: Merged or awkward (conjunction, semi-sextile, quincunx)
 */
export type AspectNature = 'harmonious' | 'challenging' | 'neutral';

export function getAspectNature(type: AspectType): AspectNature {
  switch (type) {
    case 'trine':
    case 'sextile':
      return 'harmonious';
    case 'square':
    case 'opposition':
      return 'challenging';
    default:
      return 'neutral';
  }
}

// =============================================================================
// ASPECT DESCRIPTION HELPERS
// =============================================================================

/**
 * Get a brief description of what the aspect means for compatibility
 */
export function getAspectCompatibilityNote(type: AspectType): string {
  switch (type) {
    case 'conjunction':
      return 'Merged energy — intense familiarity, shared identity';
    case 'semi_sextile':
      return 'Adjacent signs — subtle friction requiring translation';
    case 'sextile':
      return 'Friendly elements — opportunity for cooperation';
    case 'square':
      return '90° tension — growth catalyst through friction';
    case 'trine':
      return 'Same element — natural flow and understanding';
    case 'quincunx':
      return '150° awkward fit — requires constant adjustment';
    case 'opposition':
      return 'Mirror opposites — completion axis, powerful if conscious';
    default:
      return 'Angular relationship between signs';
  }
}

/**
 * Get aspect symbol for display
 */
export function getAspectSymbol(type: AspectType): string {
  const symbols: Record<AspectType, string> = {
    conjunction: '☌',
    semi_sextile: '⚺',
    sextile: '⚹',
    square: '□',
    trine: '△',
    quincunx: '⚻',
    opposition: '☍',
  };
  return symbols[type];
}
