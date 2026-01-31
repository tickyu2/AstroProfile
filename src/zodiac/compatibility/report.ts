/**
 * Compatibility Report Generator
 *
 * Produces the final compatibility report with:
 * - Total score (0-100)
 * - Label (Excellent/Strong/Workable/Challenging)
 * - Full 9-cell matrix
 * - Top strengths and challenges
 * - Layer breakdown (aspect/element/modality/season)
 * - Seasonal leadership guidance
 *
 * GENESIS AstroProfile - January 2025
 */

import type {
  CompatibilityReport,
  CompatibilityLabel,
  CompatibilityBreakdown,
  SeasonalLeadership,
  CompatibilityGuidance,
  PersonTriad,
  RelationshipLens,
  Season,
  SynastryCellKey,
} from './types';
import { buildSynastryMatrix, getCellsSortedByScore } from './buildMatrix';
import { getSeason, OPPOSITE_SEASONS } from './signMeta';
import { LENSES, getLensDisplayName } from './lenses';

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
 * Convert total score (0-100) to label
 */
function labelFrom100(score: number): CompatibilityLabel {
  if (score >= 82) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Workable';
  return 'Challenging';
}

/**
 * Get label emoji for display
 */
export function getLabelEmoji(label: CompatibilityLabel): string {
  const emojis: Record<CompatibilityLabel, string> = {
    Excellent: '💫',
    Strong: '✨',
    Workable: '🌱',
    Challenging: '⚡',
  };
  return emojis[label];
}

/**
 * Get label color for display
 */
export function getLabelColor(label: CompatibilityLabel): string {
  const colors: Record<CompatibilityLabel, string> = {
    Excellent: '#22c55e', // Green
    Strong: '#84cc16',    // Lime
    Workable: '#eab308',  // Yellow
    Challenging: '#f97316', // Orange
  };
  return colors[label];
}

// =============================================================================
// SEASONAL LEADERSHIP CALCULATOR
// =============================================================================

/**
 * Calculate who should lead during each season
 *
 * Based on Sun sign seasons:
 * - If A is in their home season, A leads
 * - If B is in their home season, B leads
 * - Opposite seasons: alternate leadership
 * - Same season: share leadership
 */
function calculateSeasonalLeadership(a: PersonTriad, b: PersonTriad): SeasonalLeadership {
  const aHomeSeason = getSeason(a.Sun);
  const bHomeSeason = getSeason(b.Sun);

  const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const leadership: SeasonalLeadership = {};

  for (const season of seasons) {
    const aInHome = season === aHomeSeason;
    const bInHome = season === bHomeSeason;

    if (aInHome && !bInHome) {
      leadership[season] = 'A';
    } else if (!aInHome && bInHome) {
      leadership[season] = 'B';
    } else if (aHomeSeason !== bHomeSeason && OPPOSITE_SEASONS[aHomeSeason] === bHomeSeason) {
      // Opposite home seasons: whoever is in home leads
      leadership[season] = season === aHomeSeason ? 'A' : season === bHomeSeason ? 'B' : 'Share';
    } else {
      leadership[season] = 'Share';
    }
  }

  return leadership;
}

// =============================================================================
// BUILD COMPATIBILITY REPORT
// =============================================================================

/**
 * Build the complete compatibility report
 *
 * This is the main function that produces the final output.
 *
 * @param a - Person A's Sun/Moon/Rising signs
 * @param b - Person B's Sun/Moon/Rising signs
 * @param lens - Relationship lens (romantic, best_friend, friend, coworker)
 * @returns Complete compatibility report
 */
export function buildCompatibilityReport(
  a: PersonTriad,
  b: PersonTriad,
  lens: RelationshipLens
): CompatibilityReport {
  const cfg = LENSES[lens];
  const matrix = buildSynastryMatrix(a, b, lens);

  // Get all cells as entries for analysis
  const entries = Object.entries(matrix) as Array<[SynastryCellKey, typeof matrix[SynastryCellKey]]>;

  // Calculate weighted total score
  let weightSum = 0;
  let scoreSum = 0;

  // Track layer contributions for breakdown
  let aspectAcc = 0;
  let elementAcc = 0;
  let modalityAcc = 0;
  let seasonAcc = 0;

  for (const [key, cell] of entries) {
    const cellWeight = cfg.cellWeights[key] ?? 1.0;
    weightSum += cellWeight;
    scoreSum += cellWeight * (cell.score10 / 10);

    // Accumulate layer contributions (proportional to their weights)
    const score01 = cell.score10 / 10;
    aspectAcc += cellWeight * cfg.layerWeights.aspect * score01;
    elementAcc += cellWeight * cfg.layerWeights.element * score01;
    modalityAcc += cellWeight * cfg.layerWeights.modality * score01;
    seasonAcc += cellWeight * cfg.layerWeights.season * score01;
  }

  // Calculate final score (0-100)
  const total01 = weightSum === 0 ? 0 : clamp01(scoreSum / weightSum);
  const totalScore100 = Math.round(total01 * 100);

  // Get sorted cells for strengths/challenges
  const sorted = getCellsSortedByScore(matrix);
  const strengths = sorted.slice(0, 3);
  const challenges = sorted.slice(-3).reverse();

  // Calculate breakdown percentages
  const breakdownTotal = aspectAcc + elementAcc + modalityAcc + seasonAcc || 1;
  const breakdown: CompatibilityBreakdown = {
    aspect: Math.round((aspectAcc / breakdownTotal) * 100),
    element: Math.round((elementAcc / breakdownTotal) * 100),
    modality: Math.round((modalityAcc / breakdownTotal) * 100),
    season: Math.round((seasonAcc / breakdownTotal) * 100),
  };

  // Calculate seasonal leadership
  const leadInSeason = calculateSeasonalLeadership(a, b);

  // Generate guidance notes
  const notes = generateGuidanceNotes(a, b, lens, matrix, strengths, challenges);

  // Build final guidance
  const guidance: CompatibilityGuidance = {
    leadInSeason,
    notes,
  };

  return {
    lens,
    totalScore100,
    label: labelFrom100(totalScore100),
    matrix,
    strengths,
    challenges,
    breakdown,
    guidance,
  };
}

// =============================================================================
// GUIDANCE NOTE GENERATOR
// =============================================================================

/**
 * Generate contextual guidance notes based on the analysis
 */
function generateGuidanceNotes(
  a: PersonTriad,
  b: PersonTriad,
  lens: RelationshipLens,
  matrix: ReturnType<typeof buildSynastryMatrix>,
  strengths: SynastryCellKey[],
  challenges: SynastryCellKey[]
): string[] {
  const notes: string[] = [];

  // Lens context
  notes.push(`Lens: ${getLensDisplayName(lens)}`);

  // Strengths summary
  if (strengths.length > 0) {
    const strengthCells = strengths.map(k => matrix[k]);
    const bestScore = strengthCells[0].score10;
    notes.push(`Top strength: ${strengths[0]} (${bestScore}/10)`);
  }

  // Challenges summary
  if (challenges.length > 0) {
    const challengeCells = challenges.map(k => matrix[k]);
    const worstScore = challengeCells[0].score10;
    notes.push(`Key work area: ${challenges[0]} (${worstScore}/10)`);
  }

  // Seasonal leadership note
  const aHomeSeason = getSeason(a.Sun);
  const bHomeSeason = getSeason(b.Sun);

  if (OPPOSITE_SEASONS[aHomeSeason] === bHomeSeason) {
    notes.push(`Cathedral pair: ${aHomeSeason} (A) and ${bHomeSeason} (B) are opposite seasons — natural leadership rotation.`);
  } else if (aHomeSeason === bHomeSeason) {
    notes.push(`Same home season (${aHomeSeason}): Shared rhythms, may need to negotiate leadership.`);
  } else {
    notes.push(`Adjacent seasons: A peaks in ${aHomeSeason}, B in ${bHomeSeason}.`);
  }

  // Opposition cells note (if any)
  const oppositionCells = Object.entries(matrix)
    .filter(([, cell]) => cell.aspect.type === 'opposition')
    .map(([key]) => key);

  if (oppositionCells.length > 0) {
    notes.push(`Opposition aspects in: ${oppositionCells.join(', ')} — powerful when conscious.`);
  }

  return notes;
}

// =============================================================================
// REPORT COMPARISON
// =============================================================================

/**
 * Compare compatibility across multiple lenses
 */
export function compareAllLenses(
  a: PersonTriad,
  b: PersonTriad
): Record<RelationshipLens, CompatibilityReport> {
  const lenses: RelationshipLens[] = ['romantic', 'best_friend', 'friend', 'coworker'];

  const results = {} as Record<RelationshipLens, CompatibilityReport>;

  for (const lens of lenses) {
    results[lens] = buildCompatibilityReport(a, b, lens);
  }

  return results;
}

/**
 * Get the best lens for this pair (highest score)
 */
export function getBestLens(
  a: PersonTriad,
  b: PersonTriad
): { lens: RelationshipLens; score: number } {
  const all = compareAllLenses(a, b);

  let bestLens: RelationshipLens = 'friend';
  let bestScore = 0;

  for (const [lens, report] of Object.entries(all) as [RelationshipLens, CompatibilityReport][]) {
    if (report.totalScore100 > bestScore) {
      bestScore = report.totalScore100;
      bestLens = lens;
    }
  }

  return { lens: bestLens, score: bestScore };
}

/**
 * Get a quick summary comparing all lenses
 */
export function getLensSummary(a: PersonTriad, b: PersonTriad): Array<{
  lens: RelationshipLens;
  score: number;
  label: CompatibilityLabel;
  emoji: string;
}> {
  const all = compareAllLenses(a, b);

  return Object.entries(all).map(([lens, report]) => ({
    lens: lens as RelationshipLens,
    score: report.totalScore100,
    label: report.label,
    emoji: getLabelEmoji(report.label),
  }));
}
