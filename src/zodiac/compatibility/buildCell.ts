/**
 * Build Synastry Cell
 *
 * The atomic unit of compatibility calculation.
 * Each cell represents one point from Person A compared to one point from Person B.
 *
 * Example: Sun-Moon cell = Person A's Sun sign compared to Person B's Moon sign
 *
 * GENESIS AstroProfile - January 2025
 */

import type {
  SynastryCell,
  SynastryCellKey,
  TriadKey,
  ZodiacSign,
  RelationshipLens,
} from './types';
import { getElement, getModality, getSeason } from './signMeta';
import { resolveAspect, getAspectSymbol, getAspectCompatibilityNote } from './aspects';
import {
  baseAspectScore,
  elementRelation,
  elementScore,
  modalityRelation,
  modalityScore,
  seasonRelation,
  seasonScore,
  identifyCompatibilityPattern,
  getPatternRankBonus,
} from './scoringPrimitives';
import { LENSES } from './lenses';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Clamp a value between 0 and 1
 */
function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/**
 * Convert 0-1 score to 0-10 scale with one decimal
 */
function to10(x01: number): number {
  return Math.round(clamp01(x01) * 10 * 10) / 10;
}

// =============================================================================
// BUILD SYNASTRY CELL
// =============================================================================

export interface BuildCellParams {
  key: SynastryCellKey;
  aPoint: TriadKey;
  aSign: ZodiacSign;
  bPoint: TriadKey;
  bSign: ZodiacSign;
  lens: RelationshipLens;
}

/**
 * Build a single synastry cell
 *
 * This calculates the compatibility score for one cell in the 9-cell matrix.
 * The score is influenced by:
 * 1. Aspect (angular relationship)
 * 2. Element (fire/earth/air/water)
 * 3. Modality (cardinal/fixed/mutable)
 * 4. Season (spring/summer/autumn/winter)
 * 5. Lens adjustments (romantic/friend/coworker)
 * 6. Compatibility pattern bonus (opposition, cardinal-mutable, etc.)
 */
export function buildSynastryCell(params: BuildCellParams): SynastryCell {
  const { key, aPoint, aSign, bPoint, bSign, lens } = params;
  const cfg = LENSES[lens];

  // Get metadata for each sign
  const aEl = getElement(aSign);
  const bEl = getElement(bSign);
  const aMo = getModality(aSign);
  const bMo = getModality(bSign);
  const aSe = getSeason(aSign);
  const bSe = getSeason(bSign);

  // Resolve aspect
  const aspect = resolveAspect(aSign, bSign);

  // Calculate relations
  const elRel = elementRelation(aEl, bEl);
  const moRel = modalityRelation(aMo, bMo);
  const seRel = seasonRelation(aSe, bSe);

  // Calculate base scores
  const aspectBase = baseAspectScore(aspect.type);
  const aspectMult = cfg.aspectMultiplier[aspect.type] ?? 1.0;
  const aspectS = clamp01(aspectBase * aspectMult);

  const elS = elementScore(elRel);
  const moS = modalityScore(moRel);
  const seS = seasonScore(seRel);

  // Identify compatibility pattern and get bonus
  const pattern = identifyCompatibilityPattern(aEl, bEl, aMo, bMo, aspect.type);
  const patternBonus = getPatternRankBonus(pattern);

  // Calculate weighted score using lens weights
  const w = cfg.layerWeights;
  let cell01 =
    aspectS * w.aspect +
    elS * w.element +
    moS * w.modality +
    seS * w.season;

  // Apply pattern bonus
  cell01 = clamp01(cell01 + patternBonus);

  // Generate tags for UI
  const tags: string[] = [
    `Aspect:${aspect.type}`,
    `Element:${elRel}`,
    `Modality:${moRel}`,
    `Season:${seRel}`,
  ];

  if (pattern) {
    tags.push(`Pattern:${pattern}`);
  }

  // Generate summary text
  const aspectSymbol = getAspectSymbol(aspect.type);
  const aspectNote = getAspectCompatibilityNote(aspect.type);
  const summary = `${key}: ${aSign} ${aspectSymbol} ${bSign} — ${aspectNote}`;

  return {
    key,
    a: { point: aPoint, sign: aSign },
    b: { point: bPoint, sign: bSign },
    aspect: {
      type: aspect.type,
      degrees: aspect.degrees,
      steps: aspect.steps,
    },
    element: {
      a: aEl,
      b: bEl,
      relation: elRel,
      score: elS,
    },
    modality: {
      a: aMo,
      b: bMo,
      relation: moRel,
      score: moS,
    },
    season: {
      a: aSe,
      b: bSe,
      relation: seRel,
      score: seS,
    },
    score10: to10(cell01),
    tags,
    summary,
  };
}

// =============================================================================
// CELL INSIGHT GENERATORS
// =============================================================================

/**
 * Get a human-readable insight for a cell
 */
export function getCellInsight(cell: SynastryCell): string {
  const { a, b, aspect, element, modality, season, score10 } = cell;

  const insights: string[] = [];

  // Aspect insight
  if (aspect.type === 'opposition') {
    insights.push(`${a.sign} and ${b.sign} are opposites — powerful mirror energy.`);
  } else if (aspect.type === 'trine') {
    insights.push(`${a.sign} and ${b.sign} share the same element — natural flow.`);
  } else if (aspect.type === 'square') {
    insights.push(`${a.sign} and ${b.sign} form a square — growth through tension.`);
  }

  // Element insight
  if (element.relation === 'support') {
    insights.push(`${element.a} and ${element.b} elements support each other.`);
  } else if (element.relation === 'friction') {
    insights.push(`${element.a} and ${element.b} elements create friction — but also passion.`);
  }

  // Modality insight
  if (modality.a === 'Cardinal' && modality.b === 'Mutable') {
    insights.push('Cardinal-Mutable: One initiates, one adapts — excellent teamwork.');
  } else if (modality.a === modality.b) {
    insights.push(`Both ${modality.a}: Similar pacing, but watch for same-gear clashes.`);
  }

  // Season insight
  if (season.relation === 'opposite') {
    insights.push('Opposite seasons: Natural leadership rotation possible.');
  } else if (season.relation === 'same') {
    insights.push('Same season: Shared rhythms and timing.');
  }

  // Overall assessment
  if (score10 >= 8) {
    insights.push('This is a strong connection point.');
  } else if (score10 <= 5) {
    insights.push('This area may require conscious effort.');
  }

  return insights.join(' ');
}

/**
 * Get the cell's contribution to relationship strengths
 */
export function getCellStrengthNote(cell: SynastryCell): string | null {
  if (cell.score10 < 7) return null;

  const { a, b, aspect } = cell;

  const strengthNotes: Record<SynastryCellKey, string> = {
    'Sun-Sun': `Core values alignment: ${a.sign} and ${b.sign} share mission`,
    'Sun-Moon': `${a.sign} values nourish ${b.sign}'s emotional world`,
    'Sun-Rising': `${a.sign} values support ${b.sign}'s public expression`,
    'Moon-Sun': `${a.sign}'s emotions align with ${b.sign}'s values`,
    'Moon-Moon': `Emotional rhythm sync: ${a.sign} and ${b.sign} feel in harmony`,
    'Moon-Rising': `${a.sign}'s emotions complement ${b.sign}'s presentation`,
    'Rising-Sun': `${a.sign}'s style supports ${b.sign}'s identity`,
    'Rising-Moon': `${a.sign}'s approach soothes ${b.sign}'s emotions`,
    'Rising-Rising': `Social compatibility: ${a.sign} and ${b.sign} present well together`,
  };

  return strengthNotes[cell.key] || null;
}

/**
 * Get the cell's contribution to relationship challenges
 */
export function getCellChallengeNote(cell: SynastryCell): string | null {
  if (cell.score10 > 5) return null;

  const { a, b, aspect } = cell;

  const challengeNotes: Record<SynastryCellKey, string> = {
    'Sun-Sun': `Values tension: ${a.sign} and ${b.sign} may clash on fundamentals`,
    'Sun-Moon': `${a.sign} values may not nurture ${b.sign}'s emotional needs`,
    'Sun-Rising': `${a.sign} values may conflict with ${b.sign}'s public style`,
    'Moon-Sun': `${a.sign}'s emotions may not align with ${b.sign}'s values`,
    'Moon-Moon': `Emotional rhythm mismatch: ${a.sign} and ${b.sign} feel differently`,
    'Moon-Rising': `${a.sign}'s emotions may clash with ${b.sign}'s presentation`,
    'Rising-Sun': `${a.sign}'s style may conflict with ${b.sign}'s identity`,
    'Rising-Moon': `${a.sign}'s approach may unsettle ${b.sign}'s emotions`,
    'Rising-Rising': `Pacing mismatch: ${a.sign} and ${b.sign} social styles differ`,
  };

  return challengeNotes[cell.key] || null;
}
