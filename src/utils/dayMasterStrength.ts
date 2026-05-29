/**
 * Day Master Strength — Full Gauntlet
 *
 * Computes a 0–100 strength score for the Day Master element by running
 * it through 6 stages:
 *
 *   Stage 1: Base DM Qi (Day Stem + Day Branch contribution)
 *   Stage 2: Rooting multiplier (hidden stems in branches × seasonality)
 *   Stage 3: Seasonality multiplier (Month Branch vs DM element growth stage)
 *   Stage 4: Support vs Drain multiplier (generating/same vs draining/controlling)
 *   Stage 5: Polarity fine-tuning (Yin/Yang response to support/drain balance)
 *   Stage 6: Normalization → 0–100 score + 5-tier label
 *
 * All intermediate values are returned for baby-step UI display.
 */

import type { QiDist } from './qiEngine';

// ============================================================================
// TYPES
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export type DayMasterTier =
  | 'Overweak'
  | 'Weak'
  | 'Balanced'
  | 'Strong'
  | 'Overstrong';

export interface RootingDetail {
  pillar: 'Day' | 'Month' | 'Year' | 'Hour';
  branchChar: string;
  branchAnimal: string;
  hasRoot: boolean;
  hiddenStemPct: number;  // 0 if no root, else 60/30/10 etc
  pillarWeight: number;   // 1.0 / 1.2 / 0.7 / 0.7
  seasonFactor: number;   // S_month for DM element
  points: number;         // pillarWeight × seasonFactor (or 0)
}

export interface SupportDrainDetail {
  generatorElement: ElementName;
  peerElement: ElementName;      // same as DM
  childElement: ElementName;
  controllerElement: ElementName;
  supportQi: number;   // TFQ[DM] + TFQ[generator]
  drainQi: number;     // TFQ[child] + TFQ[controller]
  ratioSD: number;
  category: string;
  multiplier: number;
}

export interface PolarityDetail {
  isYang: boolean;
  ratioSD: number;
  deviation: number;      // R_SD - 1.0
  P: number;              // +1 Yang, -1 Yin
  k: number;              // sensitivity = 0.15
  rawMultiplier: number;  // before clamping
  multiplier: number;     // clamped [0.85, 1.15]
}

export interface DayMasterGauntletResult {
  // Stage 1 — Base DM Qi
  dmElement: ElementName;
  dmStemQi: number;
  dmBranchQi: number;
  dayBranchWeight: number;  // α
  baseDMQi: number;

  // Stage 2 — Rooting
  rootingDetails: RootingDetail[];
  rootingPointsTotal: number;
  rootingScore: number;       // 0–3
  rootingLabel: string;       // "No root" / "Light root" / "Solid root" / "Deep root"
  rootingMultiplier: number;  // 0.7 / 1.0 / 1.3 / 1.6
  dmQiAfterRooting: number;

  // Stage 3 — Seasonality
  seasonalExpressiveness: number;  // E for DM element in current month (0.2–1.0)
  seasonalMultiplier: number;     // compressed to 0.8–1.2
  dmQiAfterSeason: number;

  // Stage 4 — Support vs Drain
  supportDrain: SupportDrainDetail;
  dmQiAfterSupport: number;

  // Stage 5 — Polarity
  polarity: PolarityDetail;
  dmQiAfterPolarity: number;

  // Stage 6 — Final
  qiNorm: number;
  score: number;            // 0–100
  tier: DayMasterTier;
  tierColor: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEMENTS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// Producing cycle: generator → element
const GENERATOR: Record<ElementName, ElementName> = {
  Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal',
};

// Producing cycle: element → child
const CHILD: Record<ElementName, ElementName> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
};

// Control cycle: controller → element
const CONTROLLER: Record<ElementName, ElementName> = {
  Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth',
};

// Pillar weights for rooting: Month is strongest, Day is standard, Year/Hour are weaker
const PILLAR_ROOT_WEIGHT: Record<string, number> = {
  Day: 1.0, Month: 1.2, Year: 0.7, Hour: 0.7,
};

// Rooting score thresholds
const ROOTING_TIERS: { maxPts: number; score: number; label: string; mult: number }[] = [
  { maxPts: 0.5,  score: 0, label: 'No root',    mult: 0.7 },
  { maxPts: 1.5,  score: 1, label: 'Light root',  mult: 1.0 },
  { maxPts: 2.5,  score: 2, label: 'Solid root',  mult: 1.3 },
  { maxPts: Infinity, score: 3, label: 'Deep root', mult: 1.6 },
];

// Support vs Drain ratio → multiplier
const SUPPORT_TIERS: { maxRatio: number; label: string; mult: number }[] = [
  { maxRatio: 0.7, label: 'Severely drained',      mult: 0.7 },
  { maxRatio: 1.0, label: 'Slightly drained',      mult: 0.9 },
  { maxRatio: 1.3, label: 'Balanced',              mult: 1.0 },
  { maxRatio: 1.8, label: 'Well supported',        mult: 1.2 },
  { maxRatio: Infinity, label: 'Strongly over-supported', mult: 1.4 },
];

// Final score → tier
const STRENGTH_TIERS: { maxScore: number; tier: DayMasterTier; color: string }[] = [
  { maxScore: 20, tier: 'Overweak',   color: '#ef4444' },
  { maxScore: 40, tier: 'Weak',       color: '#f97316' },
  { maxScore: 60, tier: 'Balanced',   color: '#22c55e' },
  { maxScore: 80, tier: 'Strong',     color: '#3b82f6' },
  { maxScore: 100, tier: 'Overstrong', color: '#a855f7' },
];

// ============================================================================
// HELPERS
// ============================================================================

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Expressiveness (0.2–1.0) → seasonal multiplier (0.8–1.2) */
function expressivenessToMultiplier(E: number): number {
  return 0.8 + 0.4 * ((clamp(E, 0.2, 1.0) - 0.2) / 0.8);
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export interface DayMasterStrengthInput {
  /** Day Master element */
  dmElement: ElementName;
  /** Is Day Master Yang? */
  isYang: boolean;
  /** TFQ totals per element (from TFQ table) */
  tfqTotals: Record<ElementName, number>;
  /** Day Stem Qi contribution (from TFQ: DM_FQ column for DM element) */
  dmStemQi: number;
  /** Day Branch Qi contribution (from TFQ: DB_FQ column for DM element) */
  dmBranchQi: number;
  /** Per-pillar branch info for rooting check */
  pillars: {
    label: 'Year' | 'Month' | 'Day' | 'Hour';
    branchChar: string;
    branchAnimal: string;
    hiddenStems: { element: ElementName; pct: number }[];
  }[];
  /** Seasonal weights for current month branch (element → 0.2–1.0) */
  seasonalWeights: Record<ElementName, number>;
  /** Day Branch weight α (default 0.5) */
  dayBranchWeight?: number;
  /** Normalization constant (default 2.0) */
  qiNorm?: number;
}

export function computeDayMasterStrength(input: DayMasterStrengthInput): DayMasterGauntletResult {
  const {
    dmElement,
    isYang,
    tfqTotals,
    dmStemQi,
    dmBranchQi,
    pillars,
    seasonalWeights,
    dayBranchWeight = 0.5,
    qiNorm = 2.0,
  } = input;

  // ── Stage 1: Base DM Qi ──────────────────────────────────────────────────
  const baseDMQi = dmStemQi + dayBranchWeight * dmBranchQi;

  // ── Stage 2: Rooting ─────────────────────────────────────────────────────
  const S_month = seasonalWeights[dmElement] ?? 1.0;

  const rootingDetails: RootingDetail[] = pillars.map(p => {
    // Find DM element in this branch's hidden stems
    const match = p.hiddenStems.find(hs => hs.element === dmElement);
    const hasRoot = !!match;
    const hiddenStemPct = match?.pct || 0;
    const pillarWeight = PILLAR_ROOT_WEIGHT[p.label] || 0.7;
    const points = hasRoot ? pillarWeight * S_month : 0;

    return {
      pillar: p.label as 'Day' | 'Month' | 'Year' | 'Hour',
      branchChar: p.branchChar,
      branchAnimal: p.branchAnimal,
      hasRoot,
      hiddenStemPct,
      pillarWeight,
      seasonFactor: S_month,
      points,
    };
  });

  const rootingPointsTotal = rootingDetails.reduce((s, r) => s + r.points, 0);
  const rootTier = ROOTING_TIERS.find(t => rootingPointsTotal < t.maxPts)!;
  const rootingScore = rootTier.score;
  const rootingLabel = rootTier.label;
  const rootingMultiplier = rootTier.mult;
  const dmQiAfterRooting = baseDMQi * rootingMultiplier;

  // ── Stage 3: Seasonality ─────────────────────────────────────────────────
  const seasonalExpressiveness = S_month;
  const seasonalMultiplier = expressivenessToMultiplier(seasonalExpressiveness);
  const dmQiAfterSeason = dmQiAfterRooting * seasonalMultiplier;

  // ── Stage 4: Support vs Drain ────────────────────────────────────────────
  const generatorEl = GENERATOR[dmElement];
  const childEl = CHILD[dmElement];
  const controllerEl = CONTROLLER[dmElement];

  const supportQi = (tfqTotals[dmElement] || 0) + (tfqTotals[generatorEl] || 0);
  const drainQi = (tfqTotals[childEl] || 0) + (tfqTotals[controllerEl] || 0);
  const EPS = 1e-6;
  const ratioSD = supportQi / (drainQi + EPS);

  const supTier = SUPPORT_TIERS.find(t => ratioSD < t.maxRatio)!;

  const supportDrain: SupportDrainDetail = {
    generatorElement: generatorEl,
    peerElement: dmElement,
    childElement: childEl,
    controllerElement: controllerEl,
    supportQi,
    drainQi,
    ratioSD,
    category: supTier.label,
    multiplier: supTier.mult,
  };
  const dmQiAfterSupport = dmQiAfterSeason * supTier.mult;

  // ── Stage 5: Polarity Fine-Tuning ────────────────────────────────────────
  const P = isYang ? 1 : -1;
  const k = 0.15;
  const deviation = ratioSD - 1.0;
  const rawPolarityMult = 1 + P * k * deviation;
  const polarityMultiplier = clamp(rawPolarityMult, 0.85, 1.15);

  const polarity: PolarityDetail = {
    isYang,
    ratioSD,
    deviation,
    P,
    k,
    rawMultiplier: rawPolarityMult,
    multiplier: polarityMultiplier,
  };
  const dmQiAfterPolarity = dmQiAfterSupport * polarityMultiplier;

  // ── Stage 6: Normalize → Score + Tier ────────────────────────────────────
  const rawScore = (dmQiAfterPolarity / qiNorm) * 100;
  const score = clamp(rawScore, 0, 100);
  const strengthTier = STRENGTH_TIERS.find(t => score <= t.maxScore)!;

  return {
    dmElement,
    dmStemQi,
    dmBranchQi,
    dayBranchWeight,
    baseDMQi,

    rootingDetails,
    rootingPointsTotal,
    rootingScore,
    rootingLabel,
    rootingMultiplier,
    dmQiAfterRooting,

    seasonalExpressiveness,
    seasonalMultiplier,
    dmQiAfterSeason,

    supportDrain,
    dmQiAfterSupport,

    polarity,
    dmQiAfterPolarity,

    qiNorm,
    score,
    tier: strengthTier.tier,
    tierColor: strengthTier.color,
  };
}
