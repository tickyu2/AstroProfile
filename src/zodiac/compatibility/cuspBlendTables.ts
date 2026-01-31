/**
 * Cusp Blend Tables
 *
 * Canonical φ-curve blend tables for all 12 sign transitions.
 * Each table shows the backward and forward blend percentages
 * for the 6-day cusp windows.
 *
 * Example: Taurus (April 20–May 20)
 * - Backward blend (Apr 20-25): Taurus + Aries (previous sign fading)
 * - Forward blend (May 15-20): Taurus + Gemini (next sign emerging)
 *
 * GENESIS AstroProfile - January 2025
 */

import type { ZodiacSign } from './types';
import { phiBlend, CUSP_WINDOW_DAYS, PHI_CURVE_VALUES } from './blendCurve';
import { seasonWeight, getCuspDescription, type CuspDescription } from './seasonalWeight';

// =============================================================================
// SIGN TRANSITION ORDER
// =============================================================================

/**
 * Zodiac signs in order with their neighbors
 */
export interface SignNeighbors {
  sign: ZodiacSign;
  previous: ZodiacSign;
  next: ZodiacSign;
}

export const SIGN_NEIGHBORS: SignNeighbors[] = [
  { sign: 'Aries', previous: 'Pisces', next: 'Taurus' },
  { sign: 'Taurus', previous: 'Aries', next: 'Gemini' },
  { sign: 'Gemini', previous: 'Taurus', next: 'Cancer' },
  { sign: 'Cancer', previous: 'Gemini', next: 'Leo' },
  { sign: 'Leo', previous: 'Cancer', next: 'Virgo' },
  { sign: 'Virgo', previous: 'Leo', next: 'Libra' },
  { sign: 'Libra', previous: 'Virgo', next: 'Scorpio' },
  { sign: 'Scorpio', previous: 'Libra', next: 'Sagittarius' },
  { sign: 'Sagittarius', previous: 'Scorpio', next: 'Capricorn' },
  { sign: 'Capricorn', previous: 'Sagittarius', next: 'Aquarius' },
  { sign: 'Aquarius', previous: 'Capricorn', next: 'Pisces' },
  { sign: 'Pisces', previous: 'Aquarius', next: 'Aries' },
];

/**
 * Get neighbors for a sign
 */
export function getSignNeighbors(sign: ZodiacSign): SignNeighbors {
  const found = SIGN_NEIGHBORS.find(s => s.sign === sign);
  if (!found) throw new Error(`Unknown sign: ${sign}`);
  return found;
}

// =============================================================================
// CUSP BLEND ROW
// =============================================================================

export interface CuspBlendRow {
  day: number;                    // -6 to +6
  primary: ZodiacSign;            // The main sign
  primaryPercent: number;         // Main sign percentage (0-100)
  blendSign: ZodiacSign | null;   // The blending sign (or null if pure)
  blendPercent: number;           // Blend sign percentage (0-100)
  seasonAdjusted: boolean;        // Was season weight applied?
}

// =============================================================================
// FULL CUSP TABLE
// =============================================================================

export interface CuspBlendTable {
  sign: ZodiacSign;
  previous: ZodiacSign;
  next: ZodiacSign;
  cuspIn: CuspDescription;        // Entering this sign (from previous)
  cuspOut: CuspDescription;       // Leaving this sign (to next)
  rows: CuspBlendRow[];           // 13 rows (-6 to +6)
}

/**
 * Generate the complete blend table for a sign
 *
 * @param sign - The primary zodiac sign
 * @param applySeasonWeight - Whether to apply seasonal significance adjustment
 * @returns Complete 13-row blend table
 */
export function generateCuspBlendTable(
  sign: ZodiacSign,
  applySeasonWeight: boolean = true
): CuspBlendTable {
  const neighbors = getSignNeighbors(sign);
  const { previous, next } = neighbors;

  const rows: CuspBlendRow[] = [];
  const weight = applySeasonWeight ? seasonWeight(sign) : 1.0;

  // Generate backward blend (-6 to -1)
  for (let d = -CUSP_WINDOW_DAYS; d < 0; d++) {
    const blend = phiBlend(Math.abs(d));
    let primaryPct = (1 - blend) * weight;
    let blendPct = blend;

    // Normalize if weight adjustment pushed over 100%
    const total = primaryPct + blendPct;
    if (total > 1) {
      primaryPct = primaryPct / total;
      blendPct = blendPct / total;
    }

    rows.push({
      day: d,
      primary: sign,
      primaryPercent: Math.round(primaryPct * 100),
      blendSign: previous,
      blendPercent: Math.round(blendPct * 100),
      seasonAdjusted: applySeasonWeight,
    });
  }

  // Center row (day 0 = pure sign)
  rows.push({
    day: 0,
    primary: sign,
    primaryPercent: 100,
    blendSign: null,
    blendPercent: 0,
    seasonAdjusted: false,
  });

  // Generate forward blend (+1 to +6)
  for (let d = 1; d <= CUSP_WINDOW_DAYS; d++) {
    const blend = phiBlend(d);
    let primaryPct = (1 - blend) * weight;
    let blendPct = blend;

    // Normalize
    const total = primaryPct + blendPct;
    if (total > 1) {
      primaryPct = primaryPct / total;
      blendPct = blendPct / total;
    }

    rows.push({
      day: d,
      primary: sign,
      primaryPercent: Math.round(primaryPct * 100),
      blendSign: next,
      blendPercent: Math.round(blendPct * 100),
      seasonAdjusted: applySeasonWeight,
    });
  }

  return {
    sign,
    previous,
    next,
    cuspIn: getCuspDescription(previous, sign),
    cuspOut: getCuspDescription(sign, next),
    rows,
  };
}

// =============================================================================
// ALL 12 CUSP TABLES (PRE-GENERATED)
// =============================================================================

/**
 * Generate all 12 cusp blend tables
 */
export function generateAllCuspTables(applySeasonWeight: boolean = true): CuspBlendTable[] {
  return SIGN_NEIGHBORS.map(({ sign }) => generateCuspBlendTable(sign, applySeasonWeight));
}

// =============================================================================
// CUSP LOOKUP UTILITIES
// =============================================================================

/**
 * Get the blend percentages for a specific sign and day offset
 */
export function getCuspBlend(
  sign: ZodiacSign,
  daysFromIngress: number
): { primary: ZodiacSign; primaryPct: number; blend: ZodiacSign | null; blendPct: number } {
  const table = generateCuspBlendTable(sign);
  const row = table.rows.find(r => r.day === daysFromIngress);

  if (!row) {
    // Outside cusp window
    return {
      primary: sign,
      primaryPct: 100,
      blend: null,
      blendPct: 0,
    };
  }

  return {
    primary: row.primary,
    primaryPct: row.primaryPercent,
    blend: row.blendSign,
    blendPct: row.blendPercent,
  };
}

// =============================================================================
// EXAMPLE: TAURUS BACKWARD BLEND (Apr 20-25)
// =============================================================================

/**
 * Pre-computed Taurus backward blend for documentation/verification
 *
 * These are the first 6 days of Taurus, still carrying Aries energy:
 *
 * Date    | Primary | Taurus % | Aries %
 * --------|---------|----------|--------
 * Apr 20  | Taurus  | 13%      | 87%
 * Apr 21  | Taurus  | 37%      | 63%
 * Apr 22  | Taurus  | 58%      | 42%
 * Apr 23  | Taurus  | 75%      | 25%
 * Apr 24  | Taurus  | 89%      | 11%
 * Apr 25  | Taurus  | 98%      | 2%
 *
 * Someone born on April 23 is primarily Taurus (75%) but still
 * carries 25% Aries energy. This explains why early Taurus people
 * often feel more assertive and pioneering than "typical" Taurus.
 */
export const TAURUS_BACKWARD_BLEND_EXAMPLE = {
  sign: 'Taurus' as ZodiacSign,
  previous: 'Aries' as ZodiacSign,
  dates: [
    { date: 'Apr 20', day: -6, taurus: 13, aries: 87 },
    { date: 'Apr 21', day: -5, taurus: 37, aries: 63 },
    { date: 'Apr 22', day: -4, taurus: 58, aries: 42 },
    { date: 'Apr 23', day: -3, taurus: 75, aries: 25 },
    { date: 'Apr 24', day: -2, taurus: 89, aries: 11 },
    { date: 'Apr 25', day: -1, taurus: 98, aries: 2 },
  ],
};

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Format a cusp blend table for console/UI display
 */
export function formatCuspTableForDisplay(table: CuspBlendTable): string {
  const lines: string[] = [];

  lines.push(`=== ${table.sign} Cusp Blend Table ===`);
  lines.push(`Previous: ${table.previous} (${table.cuspIn.name})`);
  lines.push(`Next: ${table.next} (${table.cuspOut.name})`);
  lines.push('');
  lines.push('Day  | Primary    | Blend Sign | Blend %');
  lines.push('-----|------------|------------|--------');

  for (const row of table.rows) {
    const dayStr = row.day.toString().padStart(3);
    const primaryStr = `${row.primary} ${row.primaryPercent}%`.padEnd(10);
    const blendSignStr = (row.blendSign || '—').padEnd(10);
    const blendPctStr = row.blendPercent > 0 ? `${row.blendPercent}%` : '—';

    lines.push(`${dayStr}  | ${primaryStr} | ${blendSignStr} | ${blendPctStr}`);
  }

  return lines.join('\n');
}
