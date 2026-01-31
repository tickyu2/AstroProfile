/**
 * 365-Day Sun Blend Dataset Generator
 *
 * Generates a complete yearly dataset with φ-curve blends for every day.
 * Uses SIGN_WINDOWS from getSunBlendFromDate.ts for consistency.
 *
 * Output schema per day:
 *   - date: ISO date string
 *   - dayOfYear: 1-366
 *   - primary: Primary sign name
 *   - daysFromIngress: Signed integer (+ early, - late, 0 pure)
 *   - blend: Array of { sign, weight }
 *
 * GENESIS AstroProfile - January 2026
 */

import { getSunBlendFromDate, type SunBlendResult } from './getSunBlendFromDate';

// =============================================================================
// OUTPUT TYPES
// =============================================================================

export interface DayBlendEntry {
  date: string;          // ISO date string (YYYY-MM-DD)
  dayOfYear: number;     // 1-366
  primary: string;       // Primary sign name
  daysFromIngress: number;
  blend: Array<{
    sign: string;
    weight: number;      // 0-1, rounded to 4 decimals
  }>;
}

export interface YearlyDataset {
  version: string;
  generatedAt: string;
  year: number;
  totalDays: number;
  days: DayBlendEntry[];
}

// =============================================================================
// GENERATOR
// =============================================================================

/**
 * Generate the 365/366-day Sun blend dataset
 *
 * @param year - Year to generate (affects leap year handling)
 * @returns Complete yearly dataset
 */
export function generateDailySunBlendDataset(year: number): DayBlendEntry[] {
  const rows: DayBlendEntry[] = [];
  const start = new Date(Date.UTC(year, 0, 1)); // January 1

  for (let i = 0; i < 366; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    if (d.getUTCFullYear() !== year) break; // Stop at year boundary

    const result: SunBlendResult = getSunBlendFromDate(d);

    rows.push({
      date: d.toISOString().slice(0, 10),
      dayOfYear: i + 1,
      primary: result.primary,
      daysFromIngress: result.daysFromIngress,
      blend: result.blend.map(b => ({
        sign: b.sign,
        weight: Number(b.weight.toFixed(4)),
      })),
    });
  }

  return rows;
}

/**
 * Generate complete dataset with metadata
 */
export function generateYearlyDataset(year: number = 2026): YearlyDataset {
  const days = generateDailySunBlendDataset(year);

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    year,
    totalDays: days.length,
    days,
  };
}

// =============================================================================
// LOOKUP UTILITIES
// =============================================================================

/**
 * Get blend for a specific date from pre-generated dataset
 */
export function getBlendFromDataset(
  dataset: YearlyDataset,
  month: number,
  day: number
): DayBlendEntry | null {
  // Month is 1-indexed, day is 1-indexed
  const targetDate = new Date(Date.UTC(dataset.year, month - 1, day));
  const targetStr = targetDate.toISOString().slice(0, 10);

  return dataset.days.find(d => d.date === targetStr) || null;
}

/**
 * Get all cusp days (days with blend.length > 1)
 */
export function getCuspDays(dataset: YearlyDataset): DayBlendEntry[] {
  return dataset.days.filter(d => d.blend.length > 1);
}

/**
 * Get days for a specific sign
 */
export function getDaysForSign(
  dataset: YearlyDataset,
  sign: string
): DayBlendEntry[] {
  return dataset.days.filter(d => d.primary === sign);
}

/**
 * Get statistics summary
 */
export function getDatasetStats(dataset: YearlyDataset): {
  totalDays: number;
  cuspDays: number;
  pureDays: number;
  signCounts: Record<string, number>;
} {
  const cuspDays = dataset.days.filter(d => d.blend.length > 1).length;
  const signCounts: Record<string, number> = {};

  for (const day of dataset.days) {
    signCounts[day.primary] = (signCounts[day.primary] || 0) + 1;
  }

  return {
    totalDays: dataset.totalDays,
    cuspDays,
    pureDays: dataset.totalDays - cuspDays,
    signCounts,
  };
}

// =============================================================================
// JSON EXPORT
// =============================================================================

/**
 * Export dataset to JSON string
 */
export function exportToJSON(dataset: YearlyDataset, pretty = false): string {
  return JSON.stringify(dataset, null, pretty ? 2 : 0);
}

/**
 * Generate and export in one call
 */
export function generateAndExport(year: number = 2026, pretty = false): string {
  const dataset = generateYearlyDataset(year);
  return exportToJSON(dataset, pretty);
}
