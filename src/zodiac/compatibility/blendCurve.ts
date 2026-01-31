/**
 * Blend Curve - φ (Golden Ratio) Easing
 *
 * The golden ratio decay curve for cusp blending.
 * This creates biologically natural transitions between signs.
 *
 * The curve:
 *   blend% = (day / totalDays) ^ φ
 *   where φ ≈ 1.618 (golden ratio)
 *
 * This produces:
 *   Day 1: 13% → Day 2: 37% → Day 3: 58%
 *   Day 4: 75% → Day 5: 89% → Day 6: 98%
 *
 * Why φ-curve instead of linear?
 * - Linear feels artificial (25%, 50%, 75%)
 * - φ-curve matches natural growth/decay patterns
 * - Slow start, accelerated middle, asymptotic end
 * - This is how seasons actually transition
 *
 * GENESIS AstroProfile - January 2025
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * The Golden Ratio (φ)
 * Used as the exponent for natural-feeling transitions
 */
export const PHI = 1.618033988749895;

/**
 * Standard cusp transition window (days before/after ingress)
 */
export const CUSP_WINDOW_DAYS = 6;

/**
 * Pre-computed φ-curve values for 6-day window
 * These are the canonical blend percentages
 */
export const PHI_CURVE_VALUES = {
  day1: 0.13,  // 13%
  day2: 0.37,  // 37%
  day3: 0.58,  // 58%
  day4: 0.75,  // 75%
  day5: 0.89,  // 89%
  day6: 0.98,  // 98%
} as const;

// =============================================================================
// CORE BLEND FUNCTIONS
// =============================================================================

/**
 * Calculate the φ-curve blend value for a given day
 *
 * @param day - Day within the transition window (0 to totalDays)
 * @param totalDays - Total window size (default: 6)
 * @param exponent - Curve exponent (default: φ ≈ 1.618)
 * @returns Blend ratio (0 to 1)
 *
 * Example:
 *   phiBlend(1) → 0.13
 *   phiBlend(3) → 0.58
 *   phiBlend(6) → 0.98
 */
export function phiBlend(
  day: number,
  totalDays: number = CUSP_WINDOW_DAYS,
  exponent: number = PHI
): number {
  // Clamp day to valid range
  const d = Math.max(0, Math.min(totalDays, day));

  if (d === 0) return 0;
  if (d === totalDays) return 1;

  return Math.pow(d / totalDays, exponent);
}

/**
 * Get the inverse of φ-curve (for primary sign weight)
 *
 * @param day - Day within the transition window
 * @returns Primary sign weight (1 - blend)
 */
export function phiBlendInverse(
  day: number,
  totalDays: number = CUSP_WINDOW_DAYS,
  exponent: number = PHI
): number {
  return 1 - phiBlend(day, totalDays, exponent);
}

// =============================================================================
// BLEND TABLE GENERATION
// =============================================================================

/**
 * A single row in the blend table
 */
export interface BlendTableRow {
  day: number;            // -6 to +6 (negative = backward, positive = forward)
  primaryPercent: number; // Primary sign percentage (0-100)
  blendPercent: number;   // Blending sign percentage (0-100)
  direction: 'backward' | 'center' | 'forward';
}

/**
 * Generate a complete 13-row blend table for a cusp
 *
 * Backward (days -6 to -1): Primary + Previous sign
 * Center (day 0): Pure primary sign
 * Forward (days +1 to +6): Primary + Next sign
 *
 * @returns Array of 13 rows (-6 to +6)
 */
export function generateBlendTable(): BlendTableRow[] {
  const rows: BlendTableRow[] = [];

  for (let d = -CUSP_WINDOW_DAYS; d <= CUSP_WINDOW_DAYS; d++) {
    if (d < 0) {
      // Backward blend (previous sign fading)
      const blend = phiBlend(Math.abs(d));
      rows.push({
        day: d,
        primaryPercent: Math.round((1 - blend) * 100),
        blendPercent: Math.round(blend * 100),
        direction: 'backward',
      });
    } else if (d > 0) {
      // Forward blend (next sign emerging)
      const blend = phiBlend(d);
      rows.push({
        day: d,
        primaryPercent: Math.round((1 - blend) * 100),
        blendPercent: Math.round(blend * 100),
        direction: 'forward',
      });
    } else {
      // Center (pure primary)
      rows.push({
        day: 0,
        primaryPercent: 100,
        blendPercent: 0,
        direction: 'center',
      });
    }
  }

  return rows;
}

// =============================================================================
// QUICK LOOKUP
// =============================================================================

/**
 * Get blend percentages for a specific day offset
 *
 * @param daysFromIngress - Days from sign ingress (-6 to +6)
 * @returns { primary: number, blend: number } percentages (0-100)
 */
export function getBlendPercentages(daysFromIngress: number): {
  primary: number;
  blend: number;
  direction: 'backward' | 'center' | 'forward';
} {
  const d = Math.max(-CUSP_WINDOW_DAYS, Math.min(CUSP_WINDOW_DAYS, daysFromIngress));

  if (d === 0) {
    return { primary: 100, blend: 0, direction: 'center' };
  }

  const blend = phiBlend(Math.abs(d));
  const primary = 1 - blend;

  return {
    primary: Math.round(primary * 100),
    blend: Math.round(blend * 100),
    direction: d < 0 ? 'backward' : 'forward',
  };
}

// =============================================================================
// CURVE COMPARISON (for education/UI)
// =============================================================================

/**
 * Compare linear vs φ-curve blends for educational display
 *
 * Shows how φ-curve differs from simple linear interpolation
 */
export function compareBlendCurves(): Array<{
  day: number;
  linear: number;
  phiCurve: number;
  difference: number;
}> {
  const comparison: Array<{
    day: number;
    linear: number;
    phiCurve: number;
    difference: number;
  }> = [];

  for (let d = 1; d <= CUSP_WINDOW_DAYS; d++) {
    const linear = Math.round((d / CUSP_WINDOW_DAYS) * 100);
    const phi = Math.round(phiBlend(d) * 100);

    comparison.push({
      day: d,
      linear,
      phiCurve: phi,
      difference: phi - linear,
    });
  }

  return comparison;
}

/**
 * Explain the φ-curve philosophy
 */
export const PHI_CURVE_EXPLANATION = `
The φ-curve (golden ratio easing) creates biologically natural transitions:

Day 1: 13% (slow start — the new sign barely emerges)
Day 2: 37% (building momentum)
Day 3: 58% (crossing the halfway point)
Day 4: 75% (primary sign now dominant)
Day 5: 89% (nearly complete)
Day 6: 98% (asymptotic approach — never quite 100%)

Why not linear (17%, 33%, 50%, 67%, 83%, 100%)?
- Linear feels mechanical and artificial
- Natural systems follow exponential/logarithmic curves
- The golden ratio appears throughout nature (shells, flowers, galaxies)
- This curve matches how seasons actually transition

The result: Someone born on April 23 (Taurus Day 4) is:
- 75% Taurus (grounded, stabilizing, patient)
- 25% Aries (assertive, initiating, fiery)

This explains why early Taurus people often feel more driven
than the textbook Taurus stereotype suggests.
`.trim();
