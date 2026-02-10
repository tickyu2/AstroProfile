/**
 * elementModality.ts
 *
 * Element, Modality, and Seasonal scoring for the φ-Blend 4-layer compatibility engine.
 * Uses the GENESIS data maps from tropicalSeasons.ts.
 *
 * Scoring philosophy (Khan Academy-transparent):
 *   Element:  Same 0.90 · Complementary 0.82 · Neutral 0.70 · Clashing 0.60
 *   Modality: Same 0.85 · Cardinal-Fixed 0.75 · Fixed-Mutable 0.72 · Cardinal-Mutable 0.65
 *   Seasonal: Same 0.85 · Begin↔Core 0.75 · Core↔End 0.72 · Begin↔End 0.65
 *
 * Each function takes two SignKeys and returns a 0-1 score.
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey } from '../tropicalMap';
import { getElement, getModality } from './signMeta';
import type { Element, Modality } from './types';

// =============================================================================
// ELEMENT SCORING
// =============================================================================

type ElementPairType = 'same' | 'complementary' | 'neutral' | 'clashing';

const COMPLEMENTARY_ELEMENTS: Set<string> = new Set([
  'Fire-Air', 'Air-Fire',
  'Earth-Water', 'Water-Earth',
]);

const CLASHING_ELEMENTS: Set<string> = new Set([
  'Fire-Water', 'Water-Fire',
  'Earth-Air', 'Air-Earth',
]);

const ELEMENT_SCORES: Record<ElementPairType, number> = {
  same:          0.90,
  complementary: 0.82,
  neutral:       0.70,
  clashing:      0.60,
};

const ELEMENT_LABELS: Record<ElementPairType, string> = {
  same:          'same language',
  complementary: 'natural support',
  neutral:       'workable',
  clashing:      'friction',
};

export function elementPairType(ea: Element, eb: Element): ElementPairType {
  if (ea === eb) return 'same';
  const key = `${ea}-${eb}`;
  if (COMPLEMENTARY_ELEMENTS.has(key)) return 'complementary';
  if (CLASHING_ELEMENTS.has(key)) return 'clashing';
  return 'neutral';
}

export function elementScore01(a: SignKey, b: SignKey): number {
  const ea = getElement(a as any);
  const eb = getElement(b as any);
  return ELEMENT_SCORES[elementPairType(ea, eb)];
}

export function elementLabel(a: SignKey, b: SignKey): string {
  const ea = getElement(a as any);
  const eb = getElement(b as any);
  const pairType = elementPairType(ea, eb);
  return ELEMENT_LABELS[pairType];
}

// =============================================================================
// MODALITY SCORING
// =============================================================================

type ModalityPairType = 'same' | 'cardinal_fixed' | 'fixed_mutable' | 'cardinal_mutable';

const MODALITY_SCORES: Record<ModalityPairType, number> = {
  same:             0.85,
  cardinal_fixed:   0.75,
  fixed_mutable:    0.72,
  cardinal_mutable: 0.65,
};

const MODALITY_LABELS: Record<ModalityPairType, string> = {
  same:             'same pacing',
  cardinal_fixed:   'productive tension',
  fixed_mutable:    'workable',
  cardinal_mutable: 'chaotic energy',
};

export function modalityPairType(ma: Modality, mb: Modality): ModalityPairType {
  if (ma === mb) return 'same';
  if ((ma === 'Cardinal' && mb === 'Fixed') || (ma === 'Fixed' && mb === 'Cardinal')) return 'cardinal_fixed';
  if ((ma === 'Fixed' && mb === 'Mutable') || (ma === 'Mutable' && mb === 'Fixed')) return 'fixed_mutable';
  return 'cardinal_mutable';
}

export function modalityScore01(a: SignKey, b: SignKey): number {
  const ma = getModality(a as any);
  const mb = getModality(b as any);
  return MODALITY_SCORES[modalityPairType(ma, mb)];
}

export function modalityLabel(a: SignKey, b: SignKey): string {
  const ma = getModality(a as any);
  const mb = getModality(b as any);
  const pairType = modalityPairType(ma, mb);
  return MODALITY_LABELS[pairType];
}

// =============================================================================
// SEASONAL PHASE SCORING
// =============================================================================

/**
 * Seasonal Phase — derived from Modality:
 *   Cardinal → Begin ("Beginning")
 *   Fixed   → Core  ("Core")
 *   Mutable → End   ("Transition")
 */
export type SeasonalPhase = 'Begin' | 'Core' | 'End';

type SeasonalPairType = 'same' | 'begin_core' | 'core_end' | 'begin_end';

const SEASONAL_SCORES: Record<SeasonalPairType, number> = {
  same:       0.85,  // Same rhythm
  begin_core: 0.75,  // Spark meets fuel
  core_end:   0.72,  // Fuel meets smoke
  begin_end:  0.65,  // Spark meets smoke
};

const SEASONAL_LABELS: Record<SeasonalPairType, string> = {
  same:       'same rhythm',
  begin_core: 'spark meets fuel',
  core_end:   'fuel meets smoke',
  begin_end:  'spark meets smoke',
};

/** Display labels for UI */
export const SEASONAL_PHASE_DISPLAY: Record<SeasonalPhase, string> = {
  Begin: 'Beginning',
  Core:  'Core',
  End:   'Transition',
};

const MODALITY_TO_PHASE: Record<Modality, SeasonalPhase> = {
  Cardinal: 'Begin',
  Fixed:    'Core',
  Mutable:  'End',
};

export function getSeasonalPhase(sign: SignKey): SeasonalPhase {
  const mod = getModality(sign as any);
  return MODALITY_TO_PHASE[mod];
}

export function seasonalPairType(pa: SeasonalPhase, pb: SeasonalPhase): SeasonalPairType {
  if (pa === pb) return 'same';
  const pair = [pa, pb].sort().join('-');
  if (pair === 'Begin-Core') return 'begin_core';
  if (pair === 'Core-End') return 'core_end';
  return 'begin_end';
}

export function seasonalScore01(a: SignKey, b: SignKey): number {
  const pa = getSeasonalPhase(a);
  const pb = getSeasonalPhase(b);
  return SEASONAL_SCORES[seasonalPairType(pa, pb)];
}

export function seasonalLabel(a: SignKey, b: SignKey): string {
  const pa = getSeasonalPhase(a);
  const pb = getSeasonalPhase(b);
  return SEASONAL_LABELS[seasonalPairType(pa, pb)];
}

// =============================================================================
// COMBINED 4-LAYER SCORE
// =============================================================================

/** Weights for the 4-layer scoring engine */
export const LAYER_WEIGHTS = { aspect: 0.40, element: 0.25, modality: 0.20, seasonal: 0.15 } as const;

/**
 * Combined base score for a sign pair:
 *   40% Aspect + 25% Element + 20% Modality + 15% Seasonal
 */
export function combinedScore01(
  aspectScore: number,
  elementSc: number,
  modalitySc: number,
  seasonalSc?: number,
): number {
  const seasonal = seasonalSc ?? 0.75; // Default fallback for backward compat
  return (
    aspectScore * LAYER_WEIGHTS.aspect +
    elementSc   * LAYER_WEIGHTS.element +
    modalitySc  * LAYER_WEIGHTS.modality +
    seasonal    * LAYER_WEIGHTS.seasonal
  );
}
