/**
 * getBlendFromLongitude - Degree-Based φ-Curve Cusp Blending
 *
 * Converts an ecliptic longitude (0-360°) into a SignBlend[] array
 * using a golden ratio falloff within a tight cusp window.
 *
 * Used for Moon and Rising sign blending when birth time is known.
 * Sun uses the separate date-based getSunBlendFromDate() instead.
 *
 * Algorithm:
 *   secondaryWeight = 0.5 × (1 - d/window)^φ
 *   At boundary (d=0°):  0.5  → 50/50 blend
 *   At window edge (d=5°): 0  → pure sign
 *
 * Longitude data is pre-calculated by Python Swiss Ephemeris
 * on profile save/recalculate and stored in Firebase.
 *
 * GENESIS AstroProfile - January 2026
 */

import { SIGNS, type ZodiacSign } from '../../data/tropicalSeasons';
import { PHI, type SignBlend } from './phiCurve';

// =============================================================================
// TYPES
// =============================================================================

export interface BlendConfig {
  windowDeg: number;          // cusp window in degrees (default 5)
  minSecondaryWeight: number; // ignore micro-blends below this (default 0.02 = 2%)
}

export type BoundarySide = 'previous' | 'next';

export interface BoundaryInfo {
  distanceDeg: number; // 0-15° distance to nearest sign boundary
  side: BoundarySide;  // which boundary is closer
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const DEFAULT_BLEND_CONFIG: BlendConfig = {
  windowDeg: 5,
  minSecondaryWeight: 0.02,
};

// =============================================================================
// HELPERS
// =============================================================================

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/**
 * Normalize longitude to [0, 360) range
 */
export function normalizeDeg360(x: number): number {
  const r = x % 360;
  return r < 0 ? r + 360 : r;
}

/**
 * Get the sign index (0-11) from ecliptic longitude
 * Aries = 0° - 30°, Taurus = 30° - 60°, etc.
 */
export function signIndexFromLongitude(longitudeDeg: number): number {
  const lon = normalizeDeg360(longitudeDeg);
  return Math.floor(lon / 30);
}

/**
 * Get the zodiac sign from ecliptic longitude
 */
export function signFromLongitude(longitudeDeg: number): ZodiacSign {
  return SIGNS[signIndexFromLongitude(longitudeDeg)];
}

/**
 * Get the degree position within the current sign (0-30°)
 */
export function degreesIntoSign(longitudeDeg: number): number {
  const lon = normalizeDeg360(longitudeDeg);
  return lon % 30;
}

/**
 * Find distance to the nearest sign boundary and which side it's on.
 *
 * 'previous' = near the start of the sign (blends with previous sign)
 * 'next' = near the end of the sign (blends with next sign)
 */
export function distanceToNearestBoundary(longitudeDeg: number): BoundaryInfo {
  const d = degreesIntoSign(longitudeDeg);
  const distLower = d;         // distance to 0° of sign (start)
  const distUpper = 30 - d;    // distance to 30° of sign (end)

  if (distLower <= distUpper) {
    return { distanceDeg: distLower, side: 'previous' };
  }
  return { distanceDeg: distUpper, side: 'next' };
}

/**
 * Get the neighboring sign on the specified side
 */
export function neighborSign(longitudeDeg: number, side: BoundarySide): ZodiacSign {
  const idx = signIndexFromLongitude(longitudeDeg);
  const neighborIdx = side === 'previous'
    ? (idx + 11) % 12  // previous sign (wraps Aries → Pisces)
    : (idx + 1) % 12;  // next sign (wraps Pisces → Aries)
  return SIGNS[neighborIdx];
}

/**
 * Golden ratio cusp curve — returns the secondary (neighbor) sign weight.
 *
 * At the boundary (distanceDeg = 0): returns 0.5 (50/50 blend)
 * At the window edge (distanceDeg = windowDeg): returns 0 (pure sign)
 *
 * The φ exponent creates a biologically natural, non-linear falloff.
 */
export function phiSecondaryWeight(distanceDeg: number, windowDeg: number): number {
  const u = clamp01(distanceDeg / windowDeg);   // 0 at boundary, 1 at window edge
  const fade = Math.pow(1 - u, PHI);            // φ-shaped falloff
  return 0.5 * fade;                            // 0.5 at boundary, 0 at edge
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

/**
 * Convert an ecliptic longitude (0-360°) to a φ-curve cusp blend.
 *
 * Returns a SignBlend[] array:
 *   - 1 entry if pure sign (far from any boundary)
 *   - 2 entries if near a sign boundary (within windowDeg)
 *
 * @param longitudeDeg - Ecliptic longitude in degrees (0-360)
 * @param config - Optional blend configuration (window size, min threshold)
 */
export function getBlendFromLongitude(
  longitudeDeg: number,
  config: BlendConfig = DEFAULT_BLEND_CONFIG,
): SignBlend[] {
  const { windowDeg, minSecondaryWeight } = config;

  const primary = signFromLongitude(longitudeDeg);
  const { distanceDeg, side } = distanceToNearestBoundary(longitudeDeg);

  // Outside the cusp window → pure sign
  if (distanceDeg > windowDeg) {
    return [{ sign: primary, weight: 1 }];
  }

  const secondary = neighborSign(longitudeDeg, side);
  const w2 = phiSecondaryWeight(distanceDeg, windowDeg);

  // Below threshold → treat as pure sign
  if (w2 < minSecondaryWeight) {
    return [{ sign: primary, weight: 1 }];
  }

  const w1 = 1 - w2;

  // Normalize defensively (should already sum to 1)
  const sum = w1 + w2;
  return [
    { sign: primary, weight: w1 / sum },
    { sign: secondary, weight: w2 / sum },
  ];
}
