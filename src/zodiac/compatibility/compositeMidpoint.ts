/**
 * compositeMidpoint.ts
 *
 * Computes a composite (midpoint) chart from two sets of planet longitudes.
 * For each shared planet, the midpoint is the average of the two longitudes
 * (using the shorter arc). The result is a set of composite planet positions.
 *
 * GENESIS AstroProfile - February 2026
 */

// =============================================================================
// TYPES
// =============================================================================

export interface CompositePoint {
  name: string;      // "Sun", "Moon", etc.
  longitude: number; // 0-360 (ecliptic)
  sign: string;      // Zodiac sign
  degree: number;    // 0-30 within sign
  icon: string;      // Planet symbol
}

export interface CompositeChart {
  method: 'Midpoint';
  points: CompositePoint[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

const PLANET_ICONS: Record<string, string> = {
  Sun: '\u2609', Moon: '\u263D', Mercury: '\u263F', Venus: '\u2640',
  Mars: '\u2642', Jupiter: '\u2643', Saturn: '\u2644',
  Uranus: '\u2645', Neptune: '\u2646', Pluto: '\u2647',
};

// =============================================================================
// HELPERS
// =============================================================================

function signFromLongitude(lon: number): string {
  const idx = Math.floor(lon / 30) % 12;
  return SIGNS[idx];
}

function degreeInSign(lon: number): number {
  return lon % 30;
}

/**
 * Compute the midpoint of two ecliptic longitudes using the shorter arc.
 * Returns a value in [0, 360).
 */
function midpointLongitude(lonA: number, lonB: number): number {
  const a = ((lonA % 360) + 360) % 360;
  const b = ((lonB % 360) + 360) % 360;

  let mid = (a + b) / 2;

  // If the two points are more than 180 apart, flip to the shorter arc
  if (Math.abs(a - b) > 180) {
    mid = (mid + 180) % 360;
  }

  return mid;
}

// =============================================================================
// MAIN
// =============================================================================

/**
 * Build a composite midpoint chart from two sets of planet longitudes.
 * Only planets present in both sets are included.
 */
export function buildCompositeMidpoint(
  longitudesA: Record<string, number>,
  longitudesB: Record<string, number>,
): CompositeChart {
  const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

  const points: CompositePoint[] = [];

  for (const name of planetOrder) {
    const lonA = longitudesA[name];
    const lonB = longitudesB[name];
    if (lonA == null || lonB == null) continue;

    const mid = midpointLongitude(lonA, lonB);

    points.push({
      name,
      longitude: Math.round(mid * 100) / 100,
      sign: signFromLongitude(mid),
      degree: Math.round(degreeInSign(mid) * 100) / 100,
      icon: PLANET_ICONS[name] || '\u2022',
    });
  }

  return { method: 'Midpoint', points };
}
