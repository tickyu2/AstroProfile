/**
 * Outcome Time Series Engine
 *
 * Tracks how relationship outcomes change over time (days/weeks/months).
 * Provides data for timeline visualization and temporal analysis.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type { PlanetState } from './types';
import type { RelationshipOutcome, BaseRelationshipInputs, RelationshipDecisionContext } from './relationshipOutcome';
import { mapScoreToRelationshipOutcome, computeBaseRelationshipScore } from './relationshipOutcome';
import { computeInternalAuthorityProfile, applyRetrogradeDecisionModifier, computeRetrogradeSynastryScore } from './calculators';

// ========================================
// TYPES
// ========================================

/** Decision breakdown for debugging */
export interface DecisionBreakdown {
  baseScore: number;
  iap: number;
  iapTier: string;
  retroDecisionDelta: number;
  retroSynastryDelta: number;
  autonomyBoost: number;
  finalScore: number;
  outcome: RelationshipOutcome;
  retrogradeCount: number;
  retrogradePlanets: string[];
}

/** Single point in time series */
export interface DatedOutcome {
  date: string;
  outcome: RelationshipOutcome;
  decisionScore: number;
}

/** Extended point with full breakdown */
export interface DatedOutcomeWithBreakdown extends DatedOutcome {
  breakdown: DecisionBreakdown;
}

/** Complete time series */
export interface OutcomeTimeSeries {
  personId: string;
  partnerId?: string;
  points: DatedOutcomeWithBreakdown[];
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    averageScore: number;
    dominantOutcome: RelationshipOutcome;
    volatility: number;
  };
}

/** Zoom level for timeline view */
export type ZoomLevel = 'day' | 'week' | 'month';

/** Grouped point for zoomed views */
export interface GroupedTimePoint {
  key: string;
  label: string;
  points: DatedOutcomeWithBreakdown[];
  averageScore: number;
  dominantOutcome: RelationshipOutcome;
  breakdown: DecisionBreakdown;
}

// ========================================
// DECISION BREAKDOWN CALCULATOR
// ========================================

/**
 * Compute full decision breakdown with all contributions
 */
export function computeRelationshipDecisionWithBreakdown(
  selfPlanets: PlanetState[],
  partnerPlanets: PlanetState[],
  base: BaseRelationshipInputs,
  ctx: RelationshipDecisionContext
): DecisionBreakdown {
  // Base score from synastry/composite/timing
  const baseScore = computeBaseRelationshipScore(base);

  // Internal Authority Profile
  const iapResult = computeInternalAuthorityProfile(selfPlanets);
  const iap = iapResult.score;
  const iapTier = iapResult.tier;

  // Retrograde decision modifier
  const scoreAfterRetroDecision = applyRetrogradeDecisionModifier(baseScore, selfPlanets, ctx);
  const retroDecisionDelta = scoreAfterRetroDecision - baseScore;

  // Retrograde synastry contribution
  const retroSynResult = computeRetrogradeSynastryScore(selfPlanets, partnerPlanets);
  const retroSynastryDelta = retroSynResult.score * 0.15;

  // Autonomy boost from high IAP
  const autonomyBoost = (iap - 0.5) * 0.1;

  // Final score
  const finalScoreRaw = scoreAfterRetroDecision + retroSynastryDelta + autonomyBoost;
  const finalScore = Math.max(0, Math.min(1, finalScoreRaw));

  // Map to outcome
  const outcome = mapScoreToRelationshipOutcome(finalScore);

  // Retrograde info
  const retrogradePlanets = selfPlanets.filter(p => p.isRetrograde).map(p => p.planet);

  return {
    baseScore,
    iap,
    iapTier,
    retroDecisionDelta,
    retroSynastryDelta,
    autonomyBoost,
    finalScore,
    outcome,
    retrogradeCount: retrogradePlanets.length,
    retrogradePlanets
  };
}

// ========================================
// TIME SERIES BUILDER
// ========================================

/**
 * Build outcome time series for a date range
 */
export function buildOutcomeTimeSeries(
  personId: string,
  partnerId: string | undefined,
  selfPlanets: PlanetState[],
  partnerPlanets: PlanetState[],
  baseInputs: BaseRelationshipInputs,
  context: RelationshipDecisionContext,
  dates: string[]
): OutcomeTimeSeries {
  const points: DatedOutcomeWithBreakdown[] = [];

  for (const date of dates) {
    // In a real implementation, you'd adjust timing scores based on transits
    // For now, we add slight variation based on date to simulate change
    const dateHash = hashDate(date);
    const timingVariation = (dateHash % 100) / 500 - 0.1; // -0.1 to +0.1

    const adjustedBase: BaseRelationshipInputs = {
      ...baseInputs,
      timingScore: Math.max(0, Math.min(1, (baseInputs.timingScore ?? 0.5) + timingVariation))
    };

    const breakdown = computeRelationshipDecisionWithBreakdown(
      selfPlanets,
      partnerPlanets,
      adjustedBase,
      context
    );

    points.push({
      date,
      outcome: breakdown.outcome,
      decisionScore: breakdown.finalScore,
      breakdown
    });
  }

  // Calculate summary
  const scores = points.map(p => p.decisionScore);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Find dominant outcome
  const outcomeCounts = new Map<RelationshipOutcome, number>();
  for (const p of points) {
    outcomeCounts.set(p.outcome, (outcomeCounts.get(p.outcome) || 0) + 1);
  }
  const dominantOutcome = Array.from(outcomeCounts.entries())
    .sort((a, b) => b[1] - a[1])[0][0];

  // Calculate volatility (standard deviation)
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - averageScore, 2), 0) / scores.length;
  const volatility = Math.sqrt(variance);

  return {
    personId,
    partnerId,
    points,
    dateRange: {
      start: dates[0],
      end: dates[dates.length - 1]
    },
    summary: {
      averageScore,
      dominantOutcome,
      volatility
    }
  };
}

/**
 * Generate date range
 */
export function generateDateRange(startDate: string, days: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

/**
 * Simple date hash for variation
 */
function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ========================================
// ZOOM/GROUPING
// ========================================

/**
 * Group time series by zoom level
 */
export function groupByZoom(series: OutcomeTimeSeries, zoom: ZoomLevel): GroupedTimePoint[] {
  if (zoom === 'day') {
    return series.points.map(p => ({
      key: p.date,
      label: formatDateLabel(p.date, 'day'),
      points: [p],
      averageScore: p.decisionScore,
      dominantOutcome: p.outcome,
      breakdown: p.breakdown
    }));
  }

  const groups = new Map<string, DatedOutcomeWithBreakdown[]>();

  for (const p of series.points) {
    const d = new Date(p.date);
    const key = zoom === 'week'
      ? `${d.getFullYear()}-W${getWeekNumber(d).toString().padStart(2, '0')}`
      : `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  return Array.from(groups.entries()).map(([key, points]) => {
    const avgScore = points.reduce((s, p) => s + p.decisionScore, 0) / points.length;

    // Find dominant outcome in group
    const outcomeCounts = new Map<RelationshipOutcome, number>();
    for (const p of points) {
      outcomeCounts.set(p.outcome, (outcomeCounts.get(p.outcome) || 0) + 1);
    }
    const dominantOutcome = Array.from(outcomeCounts.entries())
      .sort((a, b) => b[1] - a[1])[0][0];

    return {
      key,
      label: formatGroupLabel(key, zoom),
      points,
      averageScore: avgScore,
      dominantOutcome,
      breakdown: points[points.length - 1].breakdown // Use latest breakdown
    };
  });
}

/**
 * Get ISO week number
 */
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
}

/**
 * Format date label
 */
function formatDateLabel(dateStr: string, zoom: ZoomLevel): string {
  const d = new Date(dateStr);
  if (zoom === 'day') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return dateStr;
}

/**
 * Format group label
 */
function formatGroupLabel(key: string, zoom: ZoomLevel): string {
  if (zoom === 'week') {
    const [year, week] = key.split('-W');
    return `Week ${week}, ${year}`;
  }
  if (zoom === 'month') {
    const [year, month] = key.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long' });
    return `${monthName} ${year}`;
  }
  return key;
}

// ========================================
// RETROGRADE INTENSITY
// ========================================

/**
 * Compute retrograde intensity for heatmap
 */
export function computeRetrogradeIntensity(breakdown: DecisionBreakdown): number {
  return Math.abs(
    breakdown.retroDecisionDelta +
    breakdown.retroSynastryDelta +
    breakdown.autonomyBoost
  );
}

/**
 * Get heatmap color for intensity
 */
export function getHeatmapColor(intensity: number): string {
  const heat = Math.min(1, intensity * 2);
  return `rgba(255, 90, 120, ${heat})`;
}

// ========================================
// COMPARISON
// ========================================

/** Comparison series for two partners */
export interface ComparisonSeries {
  left: OutcomeTimeSeries;
  right: OutcomeTimeSeries;
  alignment: number; // 0-1 how aligned the outcomes are
}

/**
 * Create comparison series
 */
export function createComparisonSeries(
  left: OutcomeTimeSeries,
  right: OutcomeTimeSeries
): ComparisonSeries {
  // Calculate alignment (how often outcomes match)
  let matches = 0;
  const minLength = Math.min(left.points.length, right.points.length);

  for (let i = 0; i < minLength; i++) {
    if (left.points[i].outcome === right.points[i].outcome) {
      matches++;
    }
  }

  const alignment = minLength > 0 ? matches / minLength : 0;

  return { left, right, alignment };
}

// ========================================
// EXPORTS
// ========================================

export {
  getWeekNumber,
  formatDateLabel,
  formatGroupLabel
};
