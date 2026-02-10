/**
 * destinyArchetype.ts
 *
 * Classifies a relationship's fate-trajectory into one of five Destiny Archetypes.
 * These describe the *shape* of the relationship's journey through time —
 * not personality, not compatibility, but destiny pattern.
 *
 * Derived from:
 *   - Composite Archetype (Twin Flames, Builders, etc.)
 *   - Transformation score
 *   - Growth score
 *   - Volatility (variance of chamber scores — how uneven the energies are)
 *
 * GENESIS AstroProfile - February 2026
 */

import type { CompositeArchetype } from './compositeArchetype';

// =============================================================================
// TYPES
// =============================================================================

export type DestinyArchetype =
  | 'The Long Arc'
  | 'The Phoenix Cycle'
  | 'The Spiral Path'
  | 'The Convergence'
  | 'The Threshold Walkers';

export interface DestinyResult {
  archetype: DestinyArchetype;
  icon: string;
  color: string;
  narrative: string;
}

// =============================================================================
// DESTINY PROFILES
// =============================================================================

const DESTINY_PROFILES: Record<DestinyArchetype, Omit<DestinyResult, 'archetype'>> = {
  'The Long Arc': {
    icon: '\uD83C\uDF0A', // 🌊
    color: '#14b8a6',
    narrative: 'A relationship shaped by steady growth and shared purpose. The bond matures like a long river carving its path — patient, persistent, and deepening over time.',
  },
  'The Phoenix Cycle': {
    icon: '\uD83D\uDD25', // 🔥
    color: '#ef4444',
    narrative: 'A transformative bond marked by cycles of intensity, release, and rebirth. Each chapter burns away what no longer serves, leaving something stronger in its place.',
  },
  'The Spiral Path': {
    icon: '\uD83C\uDF00', // 🌀
    color: '#a855f7',
    narrative: 'A relationship that evolves in spirals — returning to old themes at higher levels of understanding. Each loop deepens the shared wisdom.',
  },
  'The Convergence': {
    icon: '\u2728', // ✨
    color: '#fbbf24',
    narrative: 'Two paths drawn together by resonance and timing. The relationship deepens through alignment rather than friction — a rare, harmonious trajectory.',
  },
  'The Threshold Walkers': {
    icon: '\uD83D\uDEAA', // 🚪
    color: '#818cf8',
    narrative: 'A bond forged at the edges — between worlds, between identities, between chapters. Growth comes through crossing thresholds together.',
  },
};

// =============================================================================
// VOLATILITY COMPUTATION
// =============================================================================

/**
 * Compute volatility from chamber scores — how uneven the relationship's
 * energies are. High volatility = big gaps between chambers.
 * Returns 0-100 scale.
 */
export function computeVolatility(scores: number[]): number {
  if (scores.length < 2) return 0;
  const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
  const variance = scores.reduce((s, v) => s + (v - mean) ** 2, 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  // Normalize: stdDev of 0 = 0 volatility, stdDev of 30+ = 100 volatility
  return Math.min(100, Math.round((stdDev / 30) * 100));
}

// =============================================================================
// CLASSIFICATION ENGINE
// =============================================================================

export function getDestinyArchetype(params: {
  compositeArchetype: CompositeArchetype;
  transformation: number; // 0-100
  growth: number;         // 0-100
  volatility: number;     // 0-100 (from computeVolatility)
}): DestinyResult {
  const { compositeArchetype, transformation, growth, volatility } = params;

  let archetype: DestinyArchetype;

  // Phoenix Cycle: high transformation + high volatility (intense, cyclical)
  if (transformation >= 75 && volatility >= 60) {
    archetype = 'The Phoenix Cycle';
  }
  // Long Arc: high growth + stable energies (steady, enduring)
  else if (growth >= 70 && volatility <= 40) {
    archetype = 'The Long Arc';
  }
  // Spiral Path: moderate growth + moderate transformation (evolving)
  else if (growth >= 55 && transformation >= 55) {
    archetype = 'The Spiral Path';
  }
  // Convergence: Twin Flames or Builders with low volatility (aligned)
  else if (
    (compositeArchetype === 'Twin Flames' || compositeArchetype === 'Builders') &&
    volatility <= 35
  ) {
    archetype = 'The Convergence';
  }
  // Threshold Walkers: everything else (liminal, edge-walking)
  else {
    archetype = 'The Threshold Walkers';
  }

  return {
    archetype,
    ...DESTINY_PROFILES[archetype],
  };
}
