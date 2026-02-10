/**
 * explainCell.ts
 *
 * Khan Academy-style "show your work" engine for the φ-Blend matrix.
 * Returns every intermediate calculation as a JSON object + human-readable string.
 *
 * 4-Layer scoring:  40% Aspect  ·  25% Element  ·  20% Modality  ·  15% Seasonal
 * All scores are transparent and auditable.
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey } from '../tropicalMap';
import { getAngleBetweenSigns, getAngleLesson, type AngleKey } from '../angles';
import { getElement, getModality } from './signMeta';
import { baseAspectScore } from './scoringPrimitives';
import {
  elementScore01,
  elementLabel,
  modalityScore01,
  modalityLabel,
  seasonalScore01,
  seasonalLabel,
  getSeasonalPhase,
  SEASONAL_PHASE_DISPLAY,
  combinedScore01,
  LAYER_WEIGHTS,
  type SeasonalPhase,
} from './elementModality';
import type { SignBlend } from '../cusp/phiCurve';
import type { AspectType, Element, Modality } from './types';

// =============================================================================
// TYPES
// =============================================================================

type Lens = 'Sun' | 'Moon' | 'Rising' | 'Venus' | 'Mars' | 'Mercury'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export interface SignPairStep {
  a: string;          // from sign name
  b: string;          // to sign name
  fromWeight: number; // individual φ-blend weight of "from" sign
  toWeight: number;   // individual φ-blend weight of "to" sign
  weight: number;     // combined blend weight (fromWeight × toWeight)
  angleKey: AngleKey;
  aspectAngle: number;
  aspectName: string;
  aspectSymbol: string;
  aspectColor: string;
  aspectScore: number;
  elementA: Element;
  elementB: Element;
  elementRelation: string;
  elementScore: number;
  modalityA: Modality;
  modalityB: Modality;
  modalityRelation: string;
  modalityScore: number;
  seasonalPhaseA: SeasonalPhase;
  seasonalPhaseB: SeasonalPhase;
  seasonalRelation: string;
  seasonalScore: number;
  combinedBaseScore: number;
}

export interface CellExplanation {
  score10: number;
  explanation: string;
  steps: {
    fromLens: Lens;
    toLens: Lens;
    fromBlend: SignBlend[];
    toBlend: SignBlend[];
    signPairs: SignPairStep[];
    weightedSum01: number;
  };
}

// =============================================================================
// ANGLE KEY → ASPECT TYPE BRIDGE
// =============================================================================

function toAspectType(angleKey: AngleKey): AspectType {
  if (angleKey === 'semi-sextile') return 'semi_sextile';
  return angleKey as AspectType;
}

// =============================================================================
// EXPLAIN CELL (MAIN FUNCTION)
// =============================================================================

export function explainCell(
  fromLens: Lens,
  toLens: Lens,
  fromBlend: SignBlend[],
  toBlend: SignBlend[],
): CellExplanation {
  const signPairs: SignPairStep[] = [];

  for (const from of fromBlend) {
    for (const to of toBlend) {
      const aKey = from.sign as SignKey;
      const bKey = to.sign as SignKey;
      const combinedWeight = from.weight * to.weight;

      if (combinedWeight < 0.01) continue;

      // Aspect
      const angleResult = getAngleBetweenSigns(aKey, bKey);
      const angleKey = (angleResult?.key ?? 'conjunction') as AngleKey;
      const aspectAngle = angleResult?.degrees ?? 0;
      const aspectName = angleResult?.name ?? 'Conjunction';
      const aspectSc = baseAspectScore(toAspectType(angleKey));
      const lesson = (() => { try { return getAngleLesson(angleKey); } catch { return null; } })();
      const aspectSymbol = lesson?.symbol ?? '☌';
      const aspectColor = lesson?.color ?? '#60a5fa';

      // Element
      const elA = getElement(aKey as any) as Element;
      const elB = getElement(bKey as any) as Element;
      const elSc = elementScore01(aKey, bKey);
      const elLabel = elementLabel(aKey, bKey);

      // Modality
      const modA = getModality(aKey as any) as Modality;
      const modB = getModality(bKey as any) as Modality;
      const modSc = modalityScore01(aKey, bKey);
      const modLabel = modalityLabel(aKey, bKey);

      // Seasonal
      const phaseA = getSeasonalPhase(aKey);
      const phaseB = getSeasonalPhase(bKey);
      const seasSc = seasonalScore01(aKey, bKey);
      const seasLabel = seasonalLabel(aKey, bKey);

      // Combined (4-layer)
      const combined = combinedScore01(aspectSc, elSc, modSc, seasSc);

      signPairs.push({
        a: from.sign,
        b: to.sign,
        fromWeight: from.weight,
        toWeight: to.weight,
        weight: combinedWeight,
        angleKey,
        aspectAngle,
        aspectName,
        aspectSymbol,
        aspectColor,
        aspectScore: aspectSc,
        elementA: elA,
        elementB: elB,
        elementRelation: elLabel,
        elementScore: elSc,
        modalityA: modA,
        modalityB: modB,
        modalityRelation: modLabel,
        modalityScore: modSc,
        seasonalPhaseA: phaseA,
        seasonalPhaseB: phaseB,
        seasonalRelation: seasLabel,
        seasonalScore: seasSc,
        combinedBaseScore: combined,
      });
    }
  }

  // Weighted sum
  const weightedSum01 = signPairs.reduce(
    (acc, p) => acc + p.weight * p.combinedBaseScore,
    0,
  );

  const score10 = Math.round(weightedSum01 * 100) / 10;

  // Build human-readable explanation
  const lines: string[] = [
    `${fromLens} \u00D7 ${toLens}`,
    ``,
    `Sign pairs:`,
  ];

  for (const p of signPairs) {
    lines.push(
      `\u2022 ${p.a} \u2192 ${p.b}  (${Math.round(p.fromWeight * 100)}% \u00D7 ${Math.round(p.toWeight * 100)}% = ${(p.weight * 100).toFixed(0)}%)`,
      `  Aspect: ${p.aspectName} ${p.aspectAngle}\u00B0 = ${p.aspectScore.toFixed(2)}`,
      `  Element: ${p.elementA} \u2192 ${p.elementB} = ${p.elementScore.toFixed(2)} (${p.elementRelation})`,
      `  Modality: ${p.modalityA} \u2192 ${p.modalityB} = ${p.modalityScore.toFixed(2)} (${p.modalityRelation})`,
      `  Seasonal: ${SEASONAL_PHASE_DISPLAY[p.seasonalPhaseA]} \u2192 ${SEASONAL_PHASE_DISPLAY[p.seasonalPhaseB]} = ${p.seasonalScore.toFixed(2)} (${p.seasonalRelation})`,
      `  Combined: ${LAYER_WEIGHTS.aspect}\u00D7${p.aspectScore.toFixed(2)} + ${LAYER_WEIGHTS.element}\u00D7${p.elementScore.toFixed(2)} + ${LAYER_WEIGHTS.modality}\u00D7${p.modalityScore.toFixed(2)} + ${LAYER_WEIGHTS.seasonal}\u00D7${p.seasonalScore.toFixed(2)} = ${p.combinedBaseScore.toFixed(3)}`,
    );
  }

  lines.push(
    ``,
    `Weighted sum = ${weightedSum01.toFixed(3)}`,
    `Final score = ${score10.toFixed(1)} / 10`,
  );

  return {
    score10,
    explanation: lines.join('\n'),
    steps: {
      fromLens,
      toLens,
      fromBlend,
      toBlend,
      signPairs,
      weightedSum01,
    },
  };
}
