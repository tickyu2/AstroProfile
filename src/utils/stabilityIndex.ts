/**
 * Radar Stability Index — How volatile is this month vs natal baseline?
 *
 * Computes a 0-100 index measuring the total deviation of monthly
 * functional Qi from natal Qi. Higher = more volatile.
 *
 * Categories:
 *   0-15  = stable    (chart barely shifts)
 *   16-35 = moderate  (noticeable but manageable)
 *   36-60 = volatile  (significant restructuring)
 *   61+   = extreme   (structural collapse territory)
 *
 * Created: March 2026
 */

import type { QiDist, QiMonthSnapshot, QiYearMatrix } from './qiEngine';
import type { ElementName } from '../data/stoneDatabase';

const ELEMENTS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export type StabilityCategory = 'stable' | 'moderate' | 'volatile' | 'extreme';

export interface StabilityIndexResult {
  monthIndex: number;
  monthName: string;
  index: number;           // 0-100
  category: StabilityCategory;
  deltas: Record<ElementName, number>;  // per-element deviation from natal
}

export interface YearStabilityResult {
  months: StabilityIndexResult[];
  yearAverage: number;
  yearCategory: StabilityCategory;
  mostStableMonth: string;
  mostVolatileMonth: string;
}

function categorize(index: number): StabilityCategory {
  if (index <= 15) return 'stable';
  if (index <= 35) return 'moderate';
  if (index <= 60) return 'volatile';
  return 'extreme';
}

export function computeStabilityIndex(
  natalQi: QiDist,
  snap: QiMonthSnapshot
): StabilityIndexResult {
  const natalTotal = ELEMENTS.reduce((s, el) => s + natalQi[el], 0) || 1;
  const funcTotal = ELEMENTS.reduce((s, el) => s + snap.functionalQi[el], 0) || 1;

  const deltas = {} as Record<ElementName, number>;
  let sumAbsDelta = 0;

  for (const el of ELEMENTS) {
    const natalPct = natalQi[el] / natalTotal;
    const funcPct = snap.functionalQi[el] / funcTotal;
    const delta = funcPct - natalPct;
    deltas[el] = delta;
    sumAbsDelta += Math.abs(delta);
  }

  // Scale to 0-100: max possible sumAbsDelta is 2.0 (complete redistribution)
  const index = Math.min(Math.round((sumAbsDelta / 2.0) * 100), 100);

  return {
    monthIndex: snap.monthIndex,
    monthName: snap.monthName,
    index,
    category: categorize(index),
    deltas,
  };
}

export function computeYearStability(matrix: QiYearMatrix): YearStabilityResult {
  const months = matrix.months.map(snap =>
    computeStabilityIndex(matrix.natalQi, snap)
  );

  const yearAverage = Math.round(
    months.reduce((s, m) => s + m.index, 0) / (months.length || 1)
  );

  let mostStable = months[0];
  let mostVolatile = months[0];
  for (const m of months) {
    if (m.index < mostStable.index) mostStable = m;
    if (m.index > mostVolatile.index) mostVolatile = m;
  }

  return {
    months,
    yearAverage,
    yearCategory: categorize(yearAverage),
    mostStableMonth: mostStable.monthName,
    mostVolatileMonth: mostVolatile.monthName,
  };
}
