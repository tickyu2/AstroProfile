/**
 * Collapse Mode Timeline — Month-by-month structural behavior
 *
 * Extracts collapse mode from each QiMonthSnapshot's yongShen result
 * and builds a timeline showing how the chart's structure shifts
 * across 12 months.
 *
 * Created: March 2026
 */

import type { CollapseMode } from '../data/stoneDatabase';
import type { QiMonthSnapshot, QiYearMatrix } from './qiEngine';

export interface CollapseTimelineEntry {
  monthIndex: number;
  monthName: string;
  season: string;
  collapseMode: CollapseMode;
  primary?: string;
  secondary?: string;
  primaryShare?: number;
}

export interface CollapseTimeline {
  entries: CollapseTimelineEntry[];
  /** How many distinct collapse modes appear across the year */
  distinctModes: number;
  /** Most common collapse mode */
  dominantMode: CollapseMode;
  /** Months in structural collapse (not 'none') */
  collapseMonths: number;
  /** Months that are stable (mode = 'none') */
  stableMonths: number;
}

export function buildCollapseTimeline(matrix: QiYearMatrix): CollapseTimeline {
  const entries: CollapseTimelineEntry[] = matrix.months.map(snap => ({
    monthIndex: snap.monthIndex,
    monthName: snap.monthName,
    season: snap.season,
    collapseMode: snap.collapseInfo?.mode || 'none',
    primary: snap.collapseInfo?.primary,
    secondary: snap.collapseInfo?.secondary,
    primaryShare: snap.collapseInfo?.primaryShare,
  }));

  const modeCounts: Record<string, number> = {};
  for (const e of entries) {
    modeCounts[e.collapseMode] = (modeCounts[e.collapseMode] || 0) + 1;
  }

  const distinctModes = Object.keys(modeCounts).length;
  const dominantMode = Object.entries(modeCounts)
    .sort((a, b) => b[1] - a[1])[0][0] as CollapseMode;

  const collapseMonths = entries.filter(e => e.collapseMode !== 'none').length;

  return {
    entries,
    distinctModes,
    dominantMode,
    collapseMonths,
    stableMonths: entries.length - collapseMonths,
  };
}
