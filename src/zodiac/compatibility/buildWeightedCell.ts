/**
 * Build Weighted Synastry Cell (Cusp-Aware)
 *
 * This module enables cusp-aware compatibility scoring by computing
 * weighted combinations of sign blends.
 *
 * When Person A is "75% Taurus, 25% Aries" and Person B is "80% Leo, 20% Cancer",
 * we calculate ALL combinations:
 *   - Taurus×Leo (0.75 × 0.80 = 0.60 weight)
 *   - Taurus×Cancer (0.75 × 0.20 = 0.15 weight)
 *   - Aries×Leo (0.25 × 0.80 = 0.20 weight)
 *   - Aries×Cancer (0.25 × 0.20 = 0.05 weight)
 *
 * The final score is the weighted sum of all pairwise scores.
 *
 * GENESIS AstroProfile - January 2025
 */

import type {
  ZodiacSign,
  SynastryCell,
  SynastryCellKey,
  TriadKey,
  RelationshipLens,
} from './types';
import type { SignBlend } from './signBlendFromDate';
import { buildSynastryCell } from './buildCell';

// =============================================================================
// WEIGHTED CELL TYPES
// =============================================================================

/**
 * A weighted sub-cell representing one sign×sign comparison
 * within a cusp-aware calculation
 */
export interface WeightedSubCell {
  aSign: ZodiacSign;
  bSign: ZodiacSign;
  combinedWeight: number;  // aWeight × bWeight
  score10: number;         // Base cell score (0-10)
  weightedScore: number;   // combinedWeight × score10
}

/**
 * A cusp-aware synastry cell with blend breakdown
 */
export interface CuspAwareSynastryCell {
  key: SynastryCellKey;
  aPoint: TriadKey;
  bPoint: TriadKey;
  aBlend: SignBlend[];
  bBlend: SignBlend[];
  subCells: WeightedSubCell[];
  finalScore10: number;       // Weighted sum of all sub-cells
  dominantPair: {
    aSign: ZodiacSign;
    bSign: ZodiacSign;
    weight: number;
  };
  isCuspInfluenced: boolean;  // True if either person has cusp blend
  primaryCell: SynastryCell;  // The dominant (highest weight) cell details
}

// =============================================================================
// SUN-ONLY BLENDING LOGIC
// =============================================================================

/**
 * Only blend Sun positions - Moon/Rising require ephemeris for cusp calculation.
 *
 * Rules:
 *   Sun-Sun      → blend both A and B
 *   Sun-Moon     → blend A (Sun) only, B (Moon) stays pure
 *   Sun-Rising   → blend A (Sun) only, B (Rising) stays pure
 *   Moon-Sun     → blend B (Sun) only, A (Moon) stays pure
 *   Rising-Sun   → blend B (Sun) only, A (Rising) stays pure
 *   Moon-Moon    → no blending (both pure)
 *   Moon-Rising  → no blending
 *   Rising-Moon  → no blending
 *   Rising-Rising→ no blending
 */
function getSunAwareBlends(
  aPoint: TriadKey,
  aBlend: SignBlend[],
  bPoint: TriadKey,
  bBlend: SignBlend[]
): { effectiveA: SignBlend[]; effectiveB: SignBlend[] } {
  // Only blend if the point is Sun
  const effectiveA = aPoint === 'Sun' ? aBlend : [aBlend[0]]; // Take primary only for non-Sun
  const effectiveB = bPoint === 'Sun' ? bBlend : [bBlend[0]]; // Take primary only for non-Sun

  return { effectiveA, effectiveB };
}

// =============================================================================
// CORE WEIGHTED CELL BUILDER
// =============================================================================

/**
 * Build a cusp-aware synastry cell
 *
 * This computes all sign×sign combinations weighted by their blend percentages.
 * IMPORTANT: Only Sun positions are blended. Moon/Rising use pure signs only,
 * because cusp calculation for Moon/Rising requires ephemeris data we don't have.
 *
 * @param key - Cell key (e.g., 'Sun-Moon')
 * @param aPoint - Person A's triad point (Sun/Moon/Rising)
 * @param aBlend - Person A's sign blend for this point
 * @param bPoint - Person B's triad point
 * @param bBlend - Person B's sign blend for this point
 * @param lens - Relationship lens for scoring
 * @returns Cusp-aware cell with weighted score
 */
export function buildCuspAwareSynastryCell(
  key: SynastryCellKey,
  aPoint: TriadKey,
  aBlend: SignBlend[],
  bPoint: TriadKey,
  bBlend: SignBlend[],
  lens: RelationshipLens
): CuspAwareSynastryCell {
  // Apply Sun-only blending rule
  const { effectiveA, effectiveB } = getSunAwareBlends(aPoint, aBlend, bPoint, bBlend);

  const subCells: WeightedSubCell[] = [];
  let dominantWeight = 0;
  let dominantA: ZodiacSign = effectiveA[0].sign;
  let dominantB: ZodiacSign = effectiveB[0].sign;

  // Calculate all sign×sign combinations (Sun-side blends only)
  for (const a of effectiveA) {
    for (const b of effectiveB) {
      const combinedWeight = a.weight * b.weight;

      // Build the base cell for this sign pair
      const baseCell = buildSynastryCell({
        key,
        aPoint,
        aSign: a.sign,
        bPoint,
        bSign: b.sign,
        lens,
      });

      const weightedScore = combinedWeight * baseCell.score10;

      subCells.push({
        aSign: a.sign,
        bSign: b.sign,
        combinedWeight,
        score10: baseCell.score10,
        weightedScore,
      });

      // Track dominant pair
      if (combinedWeight > dominantWeight) {
        dominantWeight = combinedWeight;
        dominantA = a.sign;
        dominantB = b.sign;
      }
    }
  }

  // Calculate final weighted score
  const finalScore10 = Math.round(
    subCells.reduce((sum, sc) => sum + sc.weightedScore, 0) * 10
  ) / 10;

  // Get primary cell details (for the dominant pair)
  const primaryCell = buildSynastryCell({
    key,
    aPoint,
    aSign: dominantA,
    bPoint,
    bSign: dominantB,
    lens,
  });

  // Determine if cusp-influenced (only counts if Sun was actually blended)
  const isCuspInfluenced = effectiveA.length > 1 || effectiveB.length > 1;

  return {
    key,
    aPoint,
    bPoint,
    aBlend,
    bBlend,
    subCells,
    finalScore10,
    dominantPair: {
      aSign: dominantA,
      bSign: dominantB,
      weight: dominantWeight,
    },
    isCuspInfluenced,
    primaryCell,
  };
}

// =============================================================================
// SIMPLIFIED WEIGHTED SCORE FUNCTION
// =============================================================================

/**
 * Calculate a simple weighted score from two blends
 *
 * This is a utility function for quick calculations without full cell details.
 *
 * @param aBlend - Person A's sign blend
 * @param bBlend - Person B's sign blend
 * @param scoreFunc - Function that returns 0-1 score for two signs
 * @returns Weighted score (0-1)
 */
export function calculateWeightedScore(
  aBlend: SignBlend[],
  bBlend: SignBlend[],
  scoreFunc: (a: ZodiacSign, b: ZodiacSign) => number
): number {
  let score = 0;

  for (const a of aBlend) {
    for (const b of bBlend) {
      score += a.weight * b.weight * scoreFunc(a.sign, b.sign);
    }
  }

  return score;
}

// =============================================================================
// CUSP INFLUENCE ANALYSIS
// =============================================================================

/**
 * Analyze how cusps influence the compatibility score
 *
 * This shows the score difference between treating the person as
 * their primary sign only vs. using the full cusp blend.
 */
export interface CuspInfluenceAnalysis {
  primaryOnlyScore: number;  // Score if using only primary signs
  blendedScore: number;      // Score with full cusp blends
  scoreDifference: number;   // blendedScore - primaryOnlyScore
  influencePercent: number;  // How much cusps changed the score (%)
  influenceDirection: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

/**
 * Analyze the influence of cusps on a cell's score
 */
export function analyzeCuspInfluence(
  cell: CuspAwareSynastryCell
): CuspInfluenceAnalysis {
  // Primary-only score (using dominant signs only)
  const primaryOnlyScore = cell.primaryCell.score10;

  // Blended score
  const blendedScore = cell.finalScore10;

  // Calculate difference
  const scoreDifference = Math.round((blendedScore - primaryOnlyScore) * 10) / 10;
  const influencePercent = primaryOnlyScore !== 0
    ? Math.round(Math.abs(scoreDifference / primaryOnlyScore) * 100)
    : 0;

  // Determine direction
  let influenceDirection: 'positive' | 'negative' | 'neutral';
  if (scoreDifference > 0.2) {
    influenceDirection = 'positive';
  } else if (scoreDifference < -0.2) {
    influenceDirection = 'negative';
  } else {
    influenceDirection = 'neutral';
  }

  // Generate explanation
  let explanation: string;
  if (!cell.isCuspInfluenced) {
    explanation = 'No cusp influence — both parties have pure signs.';
  } else if (influenceDirection === 'positive') {
    explanation = `Cusp energies enhance compatibility by ${influencePercent}%. ` +
      `The secondary sign influences create additional harmony.`;
  } else if (influenceDirection === 'negative') {
    explanation = `Cusp energies reduce compatibility by ${influencePercent}%. ` +
      `The secondary sign influences create some friction.`;
  } else {
    explanation = 'Cusp influences balance out — minimal net effect on score.';
  }

  return {
    primaryOnlyScore,
    blendedScore,
    scoreDifference,
    influencePercent,
    influenceDirection,
    explanation,
  };
}

// =============================================================================
// BLEND BREAKDOWN DISPLAY
// =============================================================================

/**
 * Format a cusp-aware cell for display
 */
export function formatCuspAwareCell(cell: CuspAwareSynastryCell): string {
  const lines: string[] = [];

  lines.push(`${cell.key}: ${cell.finalScore10}/10`);

  if (cell.isCuspInfluenced) {
    lines.push('  Cusp-Influenced Calculation:');
    for (const sub of cell.subCells) {
      const weightPct = Math.round(sub.combinedWeight * 100);
      if (weightPct >= 5) {  // Only show significant contributions
        lines.push(`    ${sub.aSign}×${sub.bSign}: ${sub.score10}/10 (${weightPct}% weight)`);
      }
    }
  } else {
    lines.push(`  ${cell.dominantPair.aSign} × ${cell.dominantPair.bSign}`);
  }

  return lines.join('\n');
}

/**
 * Get a short cusp summary for UI display
 */
export function getCuspCellSummary(cell: CuspAwareSynastryCell): string {
  if (!cell.isCuspInfluenced) {
    return `${cell.dominantPair.aSign} × ${cell.dominantPair.bSign}`;
  }

  // Show dominant pair with cusp indicator
  const aHasCusp = cell.aBlend.length > 1;
  const bHasCusp = cell.bBlend.length > 1;

  const aDisplay = aHasCusp
    ? `${cell.aBlend[0].sign}↔${cell.aBlend[1].sign}`
    : cell.dominantPair.aSign;

  const bDisplay = bHasCusp
    ? `${cell.bBlend[0].sign}↔${cell.bBlend[1].sign}`
    : cell.dominantPair.bSign;

  return `${aDisplay} × ${bDisplay}`;
}

// =============================================================================
// SUB-CELL RANKING
// =============================================================================

/**
 * Get sub-cells sorted by their contribution to the final score
 */
export function getSubCellsByContribution(
  cell: CuspAwareSynastryCell
): WeightedSubCell[] {
  return [...cell.subCells].sort((a, b) => b.weightedScore - a.weightedScore);
}

/**
 * Get the most harmonious sub-cell pairing
 */
export function getMostHarmoniousSubCell(
  cell: CuspAwareSynastryCell
): WeightedSubCell | null {
  if (cell.subCells.length === 0) return null;

  return cell.subCells.reduce((best, current) =>
    current.score10 > best.score10 ? current : best
  );
}

/**
 * Get the most challenging sub-cell pairing
 */
export function getMostChallengingSubCell(
  cell: CuspAwareSynastryCell
): WeightedSubCell | null {
  if (cell.subCells.length === 0) return null;

  return cell.subCells.reduce((worst, current) =>
    current.score10 < worst.score10 ? current : worst
  );
}
