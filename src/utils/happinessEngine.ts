/**
 * HUMAN HAPPINESS ENGINE — Mathematical Model
 *
 * 8-pillar model with weighted geometric mean + relationship multiplier.
 *
 * H = (L^aL × Q^aQ × C^aC × N^aN × E^aE × M^aM × P^aP × R^aR) × (1 + kR × R)
 *
 * Where each pillar score ∈ [0, 1] and weights sum to 1.0.
 * Geometric mean punishes zeros, rewards balance.
 * R acts as both a pillar AND a global multiplier.
 */

// ── Pillar definitions ──

export interface SubComponent {
  id: string;
  name: string;
  score: number;       // 0–1
  source?: string;     // 'bazi' | 'western' | 'tcm' | 'user' | 'computed'
  description?: string;
}

export interface Pillar {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  weight: number;      // coefficient α (all sum to 1.0)
  score: number;       // 0–1 (computed from subs or set directly)
  subs: SubComponent[];
}

export const PILLAR_COLORS: Record<string, string> = {
  L: '#d4a44c',  // earthy gold
  Q: '#3b82f6',  // deep blue
  C: '#8b5cf6',  // violet
  N: '#22c55e',  // green
  E: '#14b8a6',  // teal
  M: '#f43f5e',  // rose
  P: '#f59e0b',  // amber
  R: '#ec4899',  // pink
};

export const DEFAULT_PILLARS: Pillar[] = [
  {
    id: 'L', name: 'Longevity', shortName: 'Long', icon: '🏛️',
    color: PILLAR_COLORS.L, weight: 0.15, score: 0,
    subs: [
      { id: 'sleep', name: 'Sleep Quality', score: 0, source: 'user' },
      { id: 'inflammation', name: 'Inflammation', score: 0, source: 'tcm' },
      { id: 'mito', name: 'Mitochondria', score: 0, source: 'computed' },
      { id: 'cardio', name: 'Cardiovascular', score: 0, source: 'computed' },
      { id: 'jing', name: 'Jing (Essence)', score: 0, source: 'bazi' },
      { id: 'antioxidants', name: 'Antioxidants', score: 0, source: 'tcm' },
    ],
  },
  {
    id: 'Q', name: 'Qi Optimization', shortName: 'Qi', icon: '🌀',
    color: PILLAR_COLORS.Q, weight: 0.15, score: 0,
    subs: [
      { id: 'flow', name: 'Flow State', score: 0, source: 'bazi' },
      { id: 'coherence', name: 'Coherence', score: 0, source: 'computed' },
      { id: 'efficiency', name: 'Efficiency', score: 0, source: 'bazi' },
      { id: 'balance', name: 'Element Balance', score: 0, source: 'bazi' },
      { id: 'seasonal', name: 'Seasonal Alignment', score: 0, source: 'bazi' },
    ],
  },
  {
    id: 'C', name: 'Cognitive Performance', shortName: 'Mind', icon: '🧠',
    color: PILLAR_COLORS.C, weight: 0.15, score: 0,
    subs: [
      { id: 'clarity', name: 'Mental Clarity', score: 0, source: 'bazi' },
      { id: 'memory', name: 'Memory', score: 0, source: 'computed' },
      { id: 'creativity', name: 'Creativity', score: 0, source: 'western' },
      { id: 'learning', name: 'Learning Speed', score: 0, source: 'bazi' },
      { id: 'decision', name: 'Decision Making', score: 0, source: 'bazi' },
    ],
  },
  {
    id: 'N', name: 'Nervous System', shortName: 'Nerves', icon: '🌿',
    color: PILLAR_COLORS.N, weight: 0.15, score: 0,
    subs: [
      { id: 'stress', name: 'Stress Regulation', score: 0, source: 'bazi' },
      { id: 'recovery', name: 'Recovery Rate', score: 0, source: 'computed' },
      { id: 'vagal', name: 'Vagal Tone', score: 0, source: 'computed' },
      { id: 'resilience', name: 'Emotional Resilience', score: 0, source: 'western' },
      { id: 'calm', name: 'Baseline Calm', score: 0, source: 'bazi' },
    ],
  },
  {
    id: 'E', name: 'Environment', shortName: 'Env', icon: '🌍',
    color: PILLAR_COLORS.E, weight: 0.10, score: 0,
    subs: [
      { id: 'home', name: 'Home Fit', score: 0, source: 'user' },
      { id: 'work', name: 'Work Fit', score: 0, source: 'user' },
      { id: 'climate', name: 'Climate Resonance', score: 0, source: 'bazi' },
      { id: 'community', name: 'Community Access', score: 0, source: 'user' },
    ],
  },
  {
    id: 'M', name: 'Meaning & Connection', shortName: 'Meaning', icon: '💫',
    color: PILLAR_COLORS.M, weight: 0.15, score: 0,
    subs: [
      { id: 'purpose_sense', name: 'Sense of Purpose', score: 0, source: 'western' },
      { id: 'belonging', name: 'Belonging', score: 0, source: 'user' },
      { id: 'spirituality', name: 'Spiritual Practice', score: 0, source: 'user' },
      { id: 'contribution', name: 'Contribution', score: 0, source: 'user' },
      { id: 'identity', name: 'Identity Coherence', score: 0, source: 'bazi' },
    ],
  },
  {
    id: 'P', name: 'Purpose / Career', shortName: 'Purpose', icon: '🎯',
    color: PILLAR_COLORS.P, weight: 0.10, score: 0,
    subs: [
      { id: 'role_fit', name: 'Role Fit', score: 0, source: 'bazi' },
      { id: 'growth', name: 'Growth Path', score: 0, source: 'western' },
      { id: 'mastery', name: 'Mastery', score: 0, source: 'bazi' },
      { id: 'reward', name: 'Reward Alignment', score: 0, source: 'user' },
      { id: 'impact', name: 'Impact', score: 0, source: 'user' },
    ],
  },
  {
    id: 'R', name: 'Relationship Resonance', shortName: 'Relate', icon: '💞',
    color: PILLAR_COLORS.R, weight: 0.15, score: 0,
    subs: [
      { id: 'partner_fit', name: 'Partner Fit', score: 0, source: 'computed' },
      { id: 'support', name: 'Support Quality', score: 0, source: 'user' },
      { id: 'communication', name: 'Communication', score: 0, source: 'bazi' },
      { id: 'emotional', name: 'Emotional Resonance', score: 0, source: 'western' },
      { id: 'stability', name: 'Relational Stability', score: 0, source: 'computed' },
    ],
  },
];

// ── Happiness computation ──

export interface HappinessResult {
  base: number;         // geometric mean (0–1)
  boosted: number;      // after R multiplier (0–~1.4)
  score100: number;     // boosted × 100, clamped to 0–100
  pillarContributions: { id: string; contribution: number }[];
  weakest: Pillar;
  strongest: Pillar;
}

/**
 * Compute the Human Happiness Score.
 *
 * H_base = Π(X^αX) for all pillars (weighted geometric mean)
 * H_final = H_base × (1 + kR × R)
 *
 * @param pillars - Array of 8 pillars with scores and weights
 * @param kR - Relationship boost coefficient (default 0.35)
 */
export function computeHappiness(pillars: Pillar[], kR = 0.35): HappinessResult {
  const contributions: { id: string; contribution: number }[] = [];

  let base = 1;
  let weakest = pillars[0];
  let strongest = pillars[0];

  for (const p of pillars) {
    const s = Math.max(0.001, p.score); // avoid log(0)
    const contrib = Math.pow(s, p.weight);
    base *= contrib;
    contributions.push({ id: p.id, contribution: contrib });

    if (p.score < weakest.score) weakest = p;
    if (p.score > strongest.score) strongest = p;
  }

  const R = pillars.find(p => p.id === 'R')?.score ?? 0;
  const boosted = base * (1 + kR * R);
  const score100 = Math.min(100, Math.max(0, Math.round(boosted * 100)));

  return { base, boosted, score100, pillarContributions: contributions, weakest, strongest };
}

/**
 * Compute pillar score from its sub-components (simple weighted average).
 */
export function computePillarScore(subs: SubComponent[]): number {
  if (subs.length === 0) return 0;
  const total = subs.reduce((sum, s) => sum + s.score, 0);
  return total / subs.length;
}

/**
 * Compute circle radius for a pillar based on its score.
 * Returns a value suitable for SVG rendering.
 */
export function pillarRadius(score: number, baseRadius = 28, maxRadius = 52): number {
  return baseRadius + (maxRadius - baseRadius) * score;
}

/**
 * Compute distance from center for a pillar based on its weight.
 * Higher weight → closer to center.
 */
export function pillarDistance(weight: number, minDist = 100, maxDist = 180): number {
  // weight ranges from 0.10 to 0.15 typically
  // normalize: 0.10 → far, 0.15 → close
  const norm = (weight - 0.08) / (0.17 - 0.08); // expand range for more spread
  return maxDist - (maxDist - minDist) * Math.min(1, Math.max(0, norm));
}

/**
 * Compute the position of a pillar on the wheel.
 */
export function pillarPosition(
  index: number,
  total: number,
  distance: number,
  centerX: number,
  centerY: number
): { x: number; y: number } {
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / total;
  return {
    x: centerX + distance * Math.cos(angle),
    y: centerY + distance * Math.sin(angle),
  };
}
