/**
 * useCuspDayStream Hook
 *
 * Creates a 13-day breathing window centered on any date.
 * Returns day-indexed blends for animation scrubbing.
 *
 * GENESIS AstroProfile - January 2026
 */

import { useMemo } from 'react';
import { getSunBlendFromDate } from './getSunBlendFromDate';
import type { SignBlend } from './phiCurve';

// =============================================================================
// TYPES
// =============================================================================

export interface DayBlendEntry {
  date: Date;
  dayOffset: number;  // -6 to +6
  blend: SignBlend[];
  isCusp: boolean;
  primarySign: string;
}

export interface CuspDayStream {
  days: DayBlendEntry[];
  centerIndex: number;
  windowSize: number;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Generate a stream of day blends centered on a date
 *
 * @param centerDate - The focal date (usually birth date)
 * @param windowSize - Days before/after center (default 6)
 * @returns Array of day blend entries for animation
 *
 * Example:
 *   const stream = useCuspDayStream(new Date('1983-04-23'), 6);
 *   // Returns 13 days: April 17-29
 *   // Each day has its own blend calculation
 */
export function useCuspDayStream(
  centerDate: Date,
  windowSize = 6
): CuspDayStream {
  return useMemo(() => {
    const days: DayBlendEntry[] = [];

    for (let i = -windowSize; i <= windowSize; i++) {
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + i);

      const result = getSunBlendFromDate(d);

      days.push({
        date: d,
        dayOffset: i,
        blend: result.blend,
        isCusp: result.isCusp,
        primarySign: result.blend[0]?.sign || 'Unknown',
      });
    }

    return {
      days,
      centerIndex: windowSize,  // Center is at index 6 for windowSize=6
      windowSize,
    };
  }, [centerDate, windowSize]);
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get blend at a specific offset from center
 */
export function getBlendAtOffset(
  stream: CuspDayStream,
  offset: number
): DayBlendEntry | null {
  const index = stream.centerIndex + offset;
  if (index < 0 || index >= stream.days.length) return null;
  return stream.days[index];
}

/**
 * Interpolate between two blends (for smooth animation)
 */
export function interpolateBlends(
  blendA: SignBlend[],
  blendB: SignBlend[],
  t: number  // 0 to 1
): SignBlend[] {
  // Simple case: same primary sign
  if (blendA[0]?.sign === blendB[0]?.sign) {
    const primaryWeight = blendA[0].weight * (1 - t) + blendB[0].weight * t;

    if (blendA.length === 1 && blendB.length === 1) {
      return [{ sign: blendA[0].sign, weight: 1 }];
    }

    // Handle secondary sign interpolation
    const result: SignBlend[] = [{ sign: blendA[0].sign, weight: primaryWeight }];

    // Find secondary signs
    const aSecondary = blendA[1];
    const bSecondary = blendB[1];

    if (aSecondary && bSecondary && aSecondary.sign === bSecondary.sign) {
      result.push({
        sign: aSecondary.sign,
        weight: aSecondary.weight * (1 - t) + bSecondary.weight * t,
      });
    } else if (aSecondary) {
      result.push({
        sign: aSecondary.sign,
        weight: aSecondary.weight * (1 - t),
      });
    } else if (bSecondary) {
      result.push({
        sign: bSecondary.sign,
        weight: bSecondary.weight * t,
      });
    }

    return result.filter(b => b.weight > 0.01);
  }

  // Different primary signs - crossfade
  const result: SignBlend[] = [];

  // Fading out sign A
  if (t < 1) {
    result.push({
      sign: blendA[0].sign,
      weight: blendA[0].weight * (1 - t),
    });
  }

  // Fading in sign B
  if (t > 0) {
    result.push({
      sign: blendB[0].sign,
      weight: blendB[0].weight * t,
    });
  }

  return result.filter(b => b.weight > 0.01).sort((a, b) => b.weight - a.weight);
}

/**
 * Format a day offset as a label
 */
export function formatDayOffset(offset: number): string {
  if (offset === 0) return 'Birth Day';
  if (offset > 0) return `+${offset} day${offset > 1 ? 's' : ''}`;
  return `${offset} day${offset < -1 ? 's' : ''}`;
}
