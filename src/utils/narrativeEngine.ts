/**
 * Narrative Engine — Natural language summaries for monthly and yearly Qi
 *
 * Monthly: Combines collapse mode, stability index, Yong Shen, and cause map
 *          into a human-readable paragraph per month.
 *
 * Yearly:  Weaves 12 monthly narratives into a story arc with yearly summary.
 *
 * Created: March 2026
 */

import type { QiMonthSnapshot, QiYearMatrix } from './qiEngine';
import type { ElementName, CollapseMode } from '../data/stoneDatabase';
import type { StabilityIndexResult } from './stabilityIndex';
import type { CollapseTimelineEntry } from './collapseTimeline';
import { computeStabilityIndex } from './stabilityIndex';
import { buildCollapseTimeline } from './collapseTimeline';

const ELEMENTS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// ============================================================================
// MONTHLY NARRATIVE
// ============================================================================

export interface MonthlyNarrative {
  monthIndex: number;
  monthName: string;
  season: string;
  headline: string;       // Short 1-line summary
  body: string;           // 2-4 sentence narrative
  stabilityIndex: number;
  collapseMode: CollapseMode;
}

function collapsePhrase(mode: CollapseMode, primary?: string, secondary?: string): string {
  switch (mode) {
    case 'single-dominant':
      return `${primary || 'One element'} dominates the chart, creating a single-element monopoly`;
    case 'bi-polar':
      return `The chart splits between ${primary || '?'} and ${secondary || '?'}, creating a tug-of-war`;
    case 'drained':
      return `Energy is scattered thin — no element holds meaningful ground`;
    case 'inverted':
      return `The natural element hierarchy is inverted, turning strengths into weaknesses`;
    case 'none':
    default:
      return `The chart maintains structural balance`;
  }
}

function stabilityPhrase(category: string, index: number): string {
  switch (category) {
    case 'stable': return `Energy flow is steady (stability: ${index}/100)`;
    case 'moderate': return `Some shifts from your baseline emerge (stability: ${index}/100)`;
    case 'volatile': return `Significant energy restructuring is underway (stability: ${index}/100)`;
    case 'extreme': return `The radar undergoes extreme transformation (stability: ${index}/100)`;
    default: return '';
  }
}

function causeSummary(snap: QiMonthSnapshot): string {
  if (!snap.causeMap?.dominantCause) return '';
  const dc = snap.causeMap.dominantCause;
  const dir = dc.delta > 0 ? 'boosting' : 'suppressing';
  return `The biggest shift comes from ${dc.module}, ${dir} ${dc.element} by ${Math.abs(dc.delta).toFixed(1)} pts.`;
}

function yongShenSummary(snap: QiMonthSnapshot): string {
  const ys = snap.yongShen;
  if (!ys) return '';
  if (ys.status === 'balanced') {
    return `Your Useful God assessment shows balance — no urgent remedies needed.`;
  }
  const useful = ys.usefulElements.join(', ');
  const forbidden = ys.forbidden.length > 0 ? ` Avoid ${ys.forbidden.join(', ')}.` : '';
  return `Useful elements: ${useful}.${forbidden}`;
}

export function generateMonthlyNarrative(
  snap: QiMonthSnapshot,
  natalQi: { Wood: number; Fire: number; Earth: number; Metal: number; Water: number },
): MonthlyNarrative {
  const stability = computeStabilityIndex(natalQi, snap);
  const mode = snap.collapseInfo?.mode || 'none';
  const primary = snap.collapseInfo?.primary;
  const secondary = snap.collapseInfo?.secondary;

  const collapse = collapsePhrase(mode, primary, secondary);
  const stab = stabilityPhrase(stability.category, stability.index);
  const cause = causeSummary(snap);
  const yong = yongShenSummary(snap);

  // Build headline
  const headlineParts: string[] = [];
  if (mode !== 'none') {
    headlineParts.push(mode.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()));
  }
  headlineParts.push(stability.category.charAt(0).toUpperCase() + stability.category.slice(1));
  const headline = `${snap.monthName}: ${headlineParts.join(' — ')}`;

  // Build body
  const sentences = [
    `${collapse}.`,
    stab + '.',
    cause,
    yong,
  ].filter(s => s && s.length > 1);

  return {
    monthIndex: snap.monthIndex,
    monthName: snap.monthName,
    season: snap.season,
    headline,
    body: sentences.join(' '),
    stabilityIndex: stability.index,
    collapseMode: mode,
  };
}

// ============================================================================
// YEARLY NARRATIVE
// ============================================================================

export interface YearlyNarrative {
  year: number;
  summary: string;          // 3-5 sentence yearly overview
  chapters: MonthlyNarrative[];
  /** Key inflection points — months where collapse mode changes */
  inflectionPoints: { monthName: string; from: CollapseMode; to: CollapseMode }[];
}

export function generateYearlyNarrative(matrix: QiYearMatrix): YearlyNarrative {
  const chapters = matrix.months.map(snap =>
    generateMonthlyNarrative(snap, matrix.natalQi)
  );

  const timeline = buildCollapseTimeline(matrix);

  // Find inflection points
  const inflectionPoints: { monthName: string; from: CollapseMode; to: CollapseMode }[] = [];
  for (let i = 1; i < timeline.entries.length; i++) {
    const prev = timeline.entries[i - 1];
    const curr = timeline.entries[i];
    if (prev.collapseMode !== curr.collapseMode) {
      inflectionPoints.push({
        monthName: curr.monthName,
        from: prev.collapseMode,
        to: curr.collapseMode,
      });
    }
  }

  // Build yearly summary
  const avgStability = Math.round(
    chapters.reduce((s, c) => s + c.stabilityIndex, 0) / (chapters.length || 1)
  );

  const summaryParts: string[] = [];

  // Collapse overview
  if (timeline.collapseMonths === 0) {
    summaryParts.push(`${matrix.year} is structurally balanced throughout — no collapse in any month.`);
  } else if (timeline.collapseMonths === 12) {
    summaryParts.push(`${matrix.year} shows structural collapse in every month. Dominant pattern: ${timeline.dominantMode.replace(/-/g, ' ')}.`);
  } else {
    summaryParts.push(`${matrix.year} shows structural collapse in ${timeline.collapseMonths} of 12 months. Most common pattern: ${timeline.dominantMode.replace(/-/g, ' ')}.`);
  }

  // Stability overview
  summaryParts.push(`Average radar stability: ${avgStability}/100 — a ${avgStability <= 15 ? 'stable' : avgStability <= 35 ? 'moderate' : avgStability <= 60 ? 'volatile' : 'extreme'} year overall.`);

  // Key transitions
  if (inflectionPoints.length > 0) {
    const transStr = inflectionPoints.slice(0, 3)
      .map(ip => `${ip.monthName} (${ip.from.replace(/-/g, ' ')} -> ${ip.to.replace(/-/g, ' ')})`)
      .join(', ');
    summaryParts.push(`Key transitions: ${transStr}.`);
  }

  return {
    year: matrix.year,
    summary: summaryParts.join(' '),
    chapters,
    inflectionPoints,
  };
}
