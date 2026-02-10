/**
 * chamberScore.ts
 *
 * Lightweight utility to compute per-chamber compatibility scores
 * from SignBlend arrays. Used by PhiBlendPanel to feed the
 * SynastryCompositePanel without duplicating matrix grid logic.
 *
 * Each chamber function returns a 0-100 score.
 *
 * GENESIS AstroProfile - February 2026
 */

import type { SignBlend } from '../cusp/phiCurve';
import { explainCell } from './explainCell';

type Lens = 'Sun' | 'Moon' | 'Rising' | 'Venus' | 'Mars' | 'Mercury'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

// =============================================================================
// GENERIC WEIGHTED MATRIX SCORE
// =============================================================================

interface LensBlendPair {
  lens: Lens;
  blendA: SignBlend[];
  blendB: SignBlend[];
}

function computeWeightedScore(
  pairs: LensBlendPair[],
  weights: Record<string, number>,
): number {
  let total = 0;
  for (const from of pairs) {
    for (const to of pairs) {
      const key = `${from.lens}-${to.lens}`;
      const weight = weights[key];
      if (weight == null || weight === 0) continue;

      const result = explainCell(from.lens, to.lens, from.blendA, to.blendB);
      total += result.score10 * weight * 10;
    }
  }
  return Math.round(total);
}

// =============================================================================
// CORE (Sun/Moon/Rising 3×3)
// =============================================================================

// Default equal weights (no relationship-type adjustment here)
const CORE_WEIGHTS: Record<string, number> = {
  'Sun-Sun': 0.20, 'Sun-Moon': 0.10, 'Sun-Rising': 0.05,
  'Moon-Sun': 0.10, 'Moon-Moon': 0.15, 'Moon-Rising': 0.05,
  'Rising-Sun': 0.05, 'Rising-Moon': 0.05, 'Rising-Rising': 0.25,
};

export function coreScore(
  sunBlendA: SignBlend[], sunBlendB: SignBlend[],
  moonBlendA: SignBlend[], moonBlendB: SignBlend[],
  risingBlendA: SignBlend[], risingBlendB: SignBlend[],
): number {
  return computeWeightedScore(
    [
      { lens: 'Sun', blendA: sunBlendA, blendB: sunBlendB },
      { lens: 'Moon', blendA: moonBlendA, blendB: moonBlendB },
      { lens: 'Rising', blendA: risingBlendA, blendB: risingBlendB },
    ],
    CORE_WEIGHTS,
  );
}

// =============================================================================
// PASSION (Venus/Mars 2×2)
// =============================================================================

const PASSION_WEIGHTS: Record<string, number> = {
  'Venus-Venus': 0.20,
  'Venus-Mars': 0.30,
  'Mars-Venus': 0.30,
  'Mars-Mars': 0.20,
};

export function passionScore(
  venusBlendA: SignBlend[], venusBlendB: SignBlend[],
  marsBlendA: SignBlend[], marsBlendB: SignBlend[],
): number {
  return computeWeightedScore(
    [
      { lens: 'Venus', blendA: venusBlendA, blendB: venusBlendB },
      { lens: 'Mars', blendA: marsBlendA, blendB: marsBlendB },
    ],
    PASSION_WEIGHTS,
  );
}

// =============================================================================
// COMMUNICATION (Mercury/Mars 2×2)
// =============================================================================

const COMM_WEIGHTS: Record<string, number> = {
  'Mercury-Mercury': 0.26,
  'Mercury-Mars': 0.24,
  'Mars-Mercury': 0.24,
  'Mars-Mars': 0.26,
};

export function communicationScore(
  mercuryBlendA: SignBlend[], mercuryBlendB: SignBlend[],
  marsBlendA: SignBlend[], marsBlendB: SignBlend[],
): number {
  return computeWeightedScore(
    [
      { lens: 'Mercury', blendA: mercuryBlendA, blendB: mercuryBlendB },
      { lens: 'Mars', blendA: marsBlendA, blendB: marsBlendB },
    ],
    COMM_WEIGHTS,
  );
}

// =============================================================================
// GROWTH (Jupiter/Saturn 2×2)
// =============================================================================

const GROWTH_WEIGHTS: Record<string, number> = {
  'Jupiter-Jupiter': 0.27,
  'Jupiter-Saturn': 0.23,
  'Saturn-Jupiter': 0.23,
  'Saturn-Saturn': 0.27,
};

export function growthScore(
  jupiterBlendA: SignBlend[], jupiterBlendB: SignBlend[],
  saturnBlendA: SignBlend[], saturnBlendB: SignBlend[],
): number {
  return computeWeightedScore(
    [
      { lens: 'Jupiter', blendA: jupiterBlendA, blendB: jupiterBlendB },
      { lens: 'Saturn', blendA: saturnBlendA, blendB: saturnBlendB },
    ],
    GROWTH_WEIGHTS,
  );
}

// =============================================================================
// TRANSFORMATION (Uranus/Neptune/Pluto 3×3)
// =============================================================================

const TRANSFORM_WEIGHTS: Record<string, number> = {
  'Uranus-Uranus': 0.14,
  'Uranus-Neptune': 0.10,
  'Uranus-Pluto': 0.10,
  'Neptune-Uranus': 0.10,
  'Neptune-Neptune': 0.14,
  'Neptune-Pluto': 0.10,
  'Pluto-Uranus': 0.10,
  'Pluto-Neptune': 0.10,
  'Pluto-Pluto': 0.12,
};

export function transformationScore(
  uranusBlendA: SignBlend[], uranusBlendB: SignBlend[],
  neptuneBlendA: SignBlend[], neptuneBlendB: SignBlend[],
  plutoBlendA: SignBlend[], plutoBlendB: SignBlend[],
): number {
  return computeWeightedScore(
    [
      { lens: 'Uranus', blendA: uranusBlendA, blendB: uranusBlendB },
      { lens: 'Neptune', blendA: neptuneBlendA, blendB: neptuneBlendB },
      { lens: 'Pluto', blendA: plutoBlendA, blendB: plutoBlendB },
    ],
    TRANSFORM_WEIGHTS,
  );
}
