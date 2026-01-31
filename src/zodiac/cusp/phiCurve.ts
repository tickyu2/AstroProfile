/**
 * φ-Curve (Golden Ratio) Cusp Blending
 *
 * Creates biologically natural transitions between zodiac signs
 * using the golden ratio (φ ≈ 1.618) as the exponential curve.
 *
 * Neighbor influence = ((7-d)/7)^φ  (symmetric φ-curve)
 *   Day 1: 78% neighbor → Day 3: 40% → Day 5: 13%
 *   Day 7: 0% neighbor (pure sign)
 *
 * Symmetric handoff: both sides of a boundary show 22%/78%,
 * so the primary sign never dips below 22% — a smooth transition.
 *
 * Season amplification (equinox/solstice weighting):
 *   Aries/Libra cusps: 1.25x (polarity flip)
 *   Cancer/Capricorn cusps: 1.15x (directional shift)
 *   All others: 1.0x
 *
 * GENESIS AstroProfile - January 2026
 */

import type { ZodiacSign } from '../../data/tropicalSeasons';
import { seasonAmplifier } from './seasonWeight';

// =============================================================================
// TYPES
// =============================================================================

export interface SignBlend {
  sign: ZodiacSign;
  weight: number; // 0-1
}

export interface PhiCurveConfig {
  cuspDays: number;    // default 6
  exponent: number;    // default 1.618 (φ)
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * The Golden Ratio (φ)
 * Used as the exponent for natural-feeling transitions
 */
export const PHI = 1.618033988749895;

/**
 * Default configuration
 */
export const DEFAULT_PHI: PhiCurveConfig = {
  cuspDays: 7,
  exponent: PHI,
};

/**
 * Pre-computed φ-curve values for reference
 * Formula: (d/7)^1.618 — 7-day cusp window, day 8 = pure sign
 */
export const PHI_CURVE_VALUES = {
  day1: 0.043,
  day2: 0.132,
  day3: 0.254,
  day4: 0.404,
  day5: 0.580,
  day6: 0.779,
  day7: 1.000,
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Clamp a number between min and max
 */
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// =============================================================================
// CORE φ-CURVE FUNCTIONS
// =============================================================================

/**
 * Calculate the φ-curve blend fraction for a given day
 *
 * @param day - Day within the cusp window (0 to cuspDays)
 * @param cfg - Configuration (optional)
 * @returns Blend fraction (0 to 1)
 *
 * Example:
 *   phiBlendFraction(1) → 0.043  (used at Day 6: neighbor = 4%)
 *   phiBlendFraction(3) → 0.254  (used at Day 4: neighbor = 25%)
 *   phiBlendFraction(6) → 0.779  (used at Day 1: neighbor = 78%)
 */
export function phiBlendFraction(day: number, cfg: PhiCurveConfig = DEFAULT_PHI): number {
  const d = clamp(day, 0, cfg.cuspDays);
  if (d === 0) return 0;
  if (d === cfg.cuspDays) return 1;
  return Math.pow(d / cfg.cuspDays, cfg.exponent);
}

/**
 * Calculate the φ-curve blend with seasonal amplification
 *
 * Equinox cusps (Aries, Libra) get 1.25x amplification
 * Solstice cusps (Cancer, Capricorn) get 1.15x amplification
 *
 * This makes cusps that cross major astronomical moments
 * (polarity flips, directional reversals) more psychologically pronounced.
 *
 * @param day - Day within the cusp window (0 to cuspDays)
 * @param primarySign - The sign being entered
 * @param cfg - Configuration (optional)
 * @returns Blend fraction (0 to 1), capped at 1
 */
export function phiBlendFractionWeighted(
  day: number,
  primarySign: ZodiacSign,
  cfg: PhiCurveConfig = DEFAULT_PHI
): number {
  const base = phiBlendFraction(day, cfg);
  const amp = seasonAmplifier(primarySign);
  return Math.min(1, base * amp);
}

/**
 * Get the inverse of φ-curve (for primary sign weight)
 */
export function phiBlendInverse(day: number, cfg: PhiCurveConfig = DEFAULT_PHI): number {
  return 1 - phiBlendFraction(day, cfg);
}

// =============================================================================
// CUSP BLEND CALCULATOR
// =============================================================================

/**
 * Compute the cusp blend for a position within a sign
 *
 * Convention:
 *   daysFromIngress > 0 = early days of sign (previous sign fading)
 *   daysFromIngress < 0 = late days of sign (next sign emerging)
 *   daysFromIngress = 0 = pure sign (no blend)
 *
 * @param params.primary - The primary (current) sign
 * @param params.previous - The previous sign in zodiac order
 * @param params.next - The next sign in zodiac order
 * @param params.daysFromIngress - Days from sign ingress (-6 to +6)
 * @param params.cfg - Optional configuration
 * @returns Array of SignBlend sorted by weight descending
 */
export function computeCuspBlend(params: {
  primary: ZodiacSign;
  previous: ZodiacSign;
  next: ZodiacSign;
  daysFromIngress: number;
  cfg?: PhiCurveConfig;
}): SignBlend[] {
  const { primary, previous, next, daysFromIngress, cfg } = params;
  const cuspDays = (cfg ?? DEFAULT_PHI).cuspDays;

  const d = clamp(daysFromIngress, -cuspDays, cuspDays);

  // Pure day (center of sign)
  if (d === 0) {
    return [{ sign: primary, weight: 1 }];
  }

  // Early in sign: previous sign is fading out
  // Symmetric φ-curve: neighbor = ((cuspDays-d)/cuspDays)^φ
  // Day 1: neighbor 78%, primary 22% — Day 6: neighbor 4%, primary 96%
  if (d > 0) {
    const previousWeight = phiBlendFraction(cuspDays - d, cfg);
    const primaryWeight = 1 - previousWeight;

    // If previous sign influence is negligible, return pure sign
    if (previousWeight < 0.02) {
      return [{ sign: primary, weight: 1 }];
    }

    return [
      { sign: primary, weight: primaryWeight },
      { sign: previous, weight: previousWeight },
    ].sort((a, b) => b.weight - a.weight);
  }

  // Late in sign: next sign is emerging
  // Symmetric φ-curve: neighbor = ((cuspDays-|d|)/cuspDays)^φ
  // Countdown 1 (|d|=1): neighbor 78% — Countdown 6 (|d|=6): neighbor 4%
  const nextWeight = phiBlendFraction(cuspDays - Math.abs(d), cfg);
  const primaryWeight = 1 - nextWeight;

  // If next sign influence is negligible, return pure sign
  if (nextWeight < 0.02) {
    return [{ sign: primary, weight: 1 }];
  }

  return [
    { sign: primary, weight: primaryWeight },
    { sign: next, weight: nextWeight },
  ].sort((a, b) => b.weight - a.weight);
}

// =============================================================================
// BLEND UTILITIES
// =============================================================================

/**
 * Normalize a blend array so weights sum to 1
 */
export function normalizeBlend(blend: SignBlend[]): SignBlend[] {
  const sum = blend.reduce((acc, x) => acc + x.weight, 0) || 1;
  return blend.map(x => ({ ...x, weight: x.weight / sum }));
}

/**
 * Format a weight as a percentage (0-100)
 */
export function formatBlendPercent(weight: number): number {
  return Math.round(weight * 100);
}

/**
 * Check if a blend represents a cusp (has significant secondary sign)
 */
export function isCuspBlend(blend: SignBlend[]): boolean {
  return blend.length > 1 && blend[1].weight >= 0.05;
}

/**
 * Get the primary sign from a blend (highest weight)
 */
export function getPrimaryFromBlend(blend: SignBlend[]): ZodiacSign {
  if (blend.length === 0) throw new Error('Empty blend');
  return blend.reduce((a, b) => (b.weight > a.weight ? b : a)).sign;
}

/**
 * Get a display string for a blend
 * Example: "Taurus 75%, Aries 25%"
 */
export function formatBlend(blend: SignBlend[]): string {
  return blend
    .map(b => `${b.sign} ${formatBlendPercent(b.weight)}%`)
    .join(', ');
}

// =============================================================================
// BLEND TABLE GENERATION
// =============================================================================

export interface BlendTableRow {
  day: number;              // -6 to +6
  primaryPercent: number;   // 0-100
  blendPercent: number;     // 0-100
  direction: 'backward' | 'center' | 'forward';
}

/**
 * Generate a complete blend table for the 13-day window (-6 to +6)
 */
export function generateBlendTable(cfg: PhiCurveConfig = DEFAULT_PHI): BlendTableRow[] {
  const rows: BlendTableRow[] = [];
  const cuspDays = cfg.cuspDays;

  for (let d = -cuspDays; d <= cuspDays; d++) {
    if (d < 0) {
      // Late in sign (forward blend toward next sign)
      // Neighbor weight = φ(cuspDays - |d|): 78% at boundary (|d|=1), 4% at edge (|d|=6)
      const neighborWeight = phiBlendFraction(cuspDays - Math.abs(d), cfg);
      rows.push({
        day: d,
        primaryPercent: Math.round((1 - neighborWeight) * 100),
        blendPercent: Math.round(neighborWeight * 100),
        direction: 'forward',
      });
    } else if (d > 0) {
      // Early in sign (backward blend from previous sign)
      // Neighbor weight = φ(cuspDays - d): 78% at boundary (d=1), 4% at edge (d=6)
      const neighborWeight = phiBlendFraction(cuspDays - d, cfg);
      rows.push({
        day: d,
        primaryPercent: Math.round((1 - neighborWeight) * 100),
        blendPercent: Math.round(neighborWeight * 100),
        direction: 'backward',
      });
    } else {
      // Center (pure sign)
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
// φ-CURVE EXPLANATION
// =============================================================================

export const PHI_CURVE_EXPLANATION = `
The φ-curve (golden ratio easing) creates biologically natural transitions.
6-day cusp zone on each side of the boundary, day 7 = pure sign.

Formula: neighborWeight = ((7 - d) / 7) ^ 1.618
  d = day number within the sign (1-indexed, Day 1 = ingress day)

Entering a sign (backward blend — previous sign fading):
Day 1: 78% previous, 22% primary (symmetric handoff at boundary)
Day 2: 58% previous, 42% primary
Day 3: 40% previous, 60% primary
Day 4: 25% previous, 75% primary
Day 5: 13% previous, 87% primary
Day 6:  4% previous, 96% primary
Day 7:  0% previous, 100% primary (pure sign — cusp window ends)

The same curve applies when leaving a sign (forward blend):
Countdown 6: 4% next sign (cusp zone just starting)
Countdown 5: 13% next sign
Countdown 4: 25% next sign
Countdown 3: 40% next sign
Countdown 2: 58% next sign
Countdown 1: 78% next sign, 22% primary (symmetric handoff)

Why the symmetric φ-curve?
- Both sides of the boundary show 22% primary / 78% neighbor
- The primary sign never dips below 22% — no zero-point discontinuity
- The golden ratio decay still shapes the curve naturally
- Each sign boundary has a smooth, symmetric 12-day transition zone

Example: Someone born on April 23 (Taurus Day 4) is:
- Taurus: 75% (primary sign, growing)
- Aries: 25% (previous sign, fading)

The crossover happens around Day 2 — after that, the primary
sign's energy dominates and the previous sign becomes subtle flavor.
`.trim();
