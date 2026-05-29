/**
 * ============================================================================
 * QI NORMALIZATION HELPERS
 * ============================================================================
 *
 * Pure derivations from a raw {Wood, Fire, Earth, Metal, Water} distribution.
 * The Qi engine intentionally produces raw points (qiEngine.ts), so anything
 * that needs ratios, entropy, variance, or dominance derives those here.
 *
 * Used by the Happiness pillar scorers (Q pillar first, then C/N/L.jing).
 * ============================================================================
 */

import type { QiDist } from './qiEngine';
import type { ElementName } from './baziUsefulGod';

export const ELEMENTS: readonly ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

const EPSILON = 1e-9;

/** Sum of all element points. */
export function totalQi(qi: QiDist): number {
  return qi.Wood + qi.Fire + qi.Earth + qi.Metal + qi.Water;
}

/**
 * Convert raw points into normalized weights summing to 1.
 * Degenerate input (total ≤ 0) returns uniform 0.2 across all five.
 */
export function toNormalizedWeights(qi: QiDist): Record<ElementName, number> {
  const total = totalQi(qi);
  if (total <= EPSILON) {
    return { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 };
  }
  return {
    Wood:  qi.Wood  / total,
    Fire:  qi.Fire  / total,
    Earth: qi.Earth / total,
    Metal: qi.Metal / total,
    Water: qi.Water / total,
  };
}

/**
 * Shannon entropy of the element distribution, normalized to [0, 1].
 * 1.0 = perfectly flat (0.2 / 0.2 / 0.2 / 0.2 / 0.2).
 * 0.0 = one element holds 100% of the Qi.
 *
 * H = -Σ pᵢ log(pᵢ);  Hmax = log(5);  return H / Hmax.
 */
export function shannonEntropyNormalized(weights: Record<ElementName, number>): number {
  const Hmax = Math.log(ELEMENTS.length);
  let H = 0;
  for (const el of ELEMENTS) {
    const p = weights[el];
    if (p > EPSILON) H -= p * Math.log(p);
  }
  return Math.max(0, Math.min(1, H / Hmax));
}

/**
 * Variance of normalized weights from the balanced point (0.2 each).
 *
 *   σ² = Σ (pᵢ - 0.2)² / 5
 *
 * Returned as a 0..1 "imbalance" score. Maximum possible variance occurs when
 * one element holds 100%: σ² = (0.8² + 4·0.2²) / 5 = 0.16. We divide by that
 * so the output is a clean 0..1 imbalance (0 = perfect balance, 1 = max skew).
 */
export function imbalanceFromBalanced(weights: Record<ElementName, number>): number {
  let sumSq = 0;
  for (const el of ELEMENTS) {
    const d = weights[el] - 0.2;
    sumSq += d * d;
  }
  const variance = sumSq / ELEMENTS.length;
  const maxVariance = 0.16;
  return Math.max(0, Math.min(1, variance / maxVariance));
}

/** Element with the highest normalized weight. Ties broken by ELEMENTS order. */
export function dominantElement(weights: Record<ElementName, number>): ElementName {
  let best: ElementName = 'Wood';
  let bestVal = -Infinity;
  for (const el of ELEMENTS) {
    if (weights[el] > bestVal) {
      bestVal = weights[el];
      best = el;
    }
  }
  return best;
}

/** Element with the lowest normalized weight (most deficient). */
export function deficientElement(weights: Record<ElementName, number>): ElementName {
  let worst: ElementName = 'Wood';
  let worstVal = Infinity;
  for (const el of ELEMENTS) {
    if (weights[el] < worstVal) {
      worstVal = weights[el];
      worst = el;
    }
  }
  return worst;
}

/** Clamp a number to [0, 1]. Convenience for scorer outputs. */
export function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}
