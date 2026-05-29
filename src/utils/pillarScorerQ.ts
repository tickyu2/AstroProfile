/**
 * ============================================================================
 * Q PILLAR SCORER — Qi Optimization
 * ============================================================================
 *
 * Pure scoring module. Inputs are pre-computed BaZi values (TFQ, useful god,
 * DM polarity, seasonal DM weight) plus optional Western Sun/Moon signs.
 * Output is 5 sub-scores in [0,1] for the Q pillar of the Happiness engine.
 *
 * The 6 subs (see happinessEngine.ts: Q pillar):
 *   - flow       — blend of (structural alignment) and (balance penalty for concentration)
 *   - coherence  — BaZi DM polarity vs Western Sun/Moon expressive style
 *   - efficiency — penalty for distance from balanced element distribution
 *   - balance    — Shannon entropy of the 5-element distribution
 *   - seasonal   — DM strength in its birth-month season (narrow signal)
 *   - vitality   — full DM strength score (broad chart-support signal)
 *
 * Caller responsibilities:
 *   - Run qiEngine to get a natal TFQ (use snapshot.natalTfq for a single
 *     month, or compute once from chart pillars).
 *   - Run computeUsefulGod (or stoneDatabase's calculateSurvivalKit with
 *     collapse info) for useful/annoying element arrays.
 *   - Run computeSeasonalDMStrength (or read getSeasonalWeights directly) for
 *     the DM's birth-month seasonal weight.
 *   - Run computeDayMasterStrength gauntlet for the 0–100 DM score, pass it
 *     as `dmStrengthScore` (this drives the vitality sub).
 *   - Provide Western sunSign/moonSign as plain strings ("Aries", "Pisces"…),
 *     or omit them — coherence falls back to 0.5 (unknown) instead of biasing
 *     up or down.
 * ============================================================================
 */

import type { QiDist } from './qiEngine';
import type { ElementName } from './baziUsefulGod';
import {
  toNormalizedWeights,
  shannonEntropyNormalized,
  imbalanceFromBalanced,
  clamp01,
} from './qiNormalization';

// ============================================================================
// TYPES
// ============================================================================

export type DMPolarity = 'Yang' | 'Yin';
export type WesternTriplicity = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface QPillarInputs {
  /** Natal TFQ (raw points across the 5 elements). */
  tfq: QiDist;

  /** Useful god elements — what restores balance. From computeUsefulGod(). */
  usefulElements: ElementName[];

  /** Annoying god elements — what worsens balance. From computeUsefulGod(). */
  annoyingElements: ElementName[];

  /** Day Master polarity: Yang stems (甲丙戊庚壬) or Yin stems (乙丁己辛癸). */
  dmPolarity: DMPolarity;

  /**
   * Day Master seasonal weight at birth month — the raw multiplier from
   * getSeasonalWeights(monthBranch)[dmElement]. Typical range 0.4 .. 1.5,
   * where 1.5 = peak (Wang 旺) and 0.4 = dead (Si 死).
   */
  seasonalDMWeight: number;

  /**
   * Full Day Master strength score from the 6-stage gauntlet, in [0, 100].
   * From computeDayMasterStrength(...).score in dayMasterStrength.ts.
   * Drives the vitality sub. Pass 50 (balanced default) if unavailable.
   */
  dmStrengthScore: number;

  /** Western Sun sign as string (e.g. "Leo"). Omit if unavailable. */
  westernSunSign?: string | null;
  /** Western Moon sign as string. Omit if unavailable. */
  westernMoonSign?: string | null;
}

export interface QPillarScores {
  flow: number;        // 0..1
  coherence: number;   // 0..1
  efficiency: number;  // 0..1
  balance: number;     // 0..1
  seasonal: number;    // 0..1
  vitality: number;    // 0..1

  /** Convenience: weighted aggregate using happinessEngine Q sub-weights. */
  total: number;

  /** Per-sub explanation strings for the UI tooltip / "show your work" view. */
  reasoning: Record<keyof Omit<QPillarScores, 'total' | 'reasoning'>, string>;
}

// ============================================================================
// SIGN → TRIPLICITY + MODALITY (used by coherence)
// ============================================================================

const SIGN_TO_TRIPLICITY: Record<string, WesternTriplicity> = {
  Aries: 'Fire',     Leo: 'Fire',         Sagittarius: 'Fire',
  Taurus: 'Earth',   Virgo: 'Earth',      Capricorn: 'Earth',
  Gemini: 'Air',     Libra: 'Air',        Aquarius: 'Air',
  Cancer: 'Water',   Scorpio: 'Water',    Pisces: 'Water',
};

/**
 * Mutable signs are polarity-ambiguous — they straddle cardinal/fixed and
 * carry both expressive and receptive currents. They score 0.5 in coherence
 * regardless of DM polarity, rather than flipping the full hit/miss bit.
 */
const MUTABLE_SIGNS = new Set<string>(['Gemini', 'Virgo', 'Sagittarius', 'Pisces']);

function normalizeSign(sign: string | null | undefined): string | null {
  if (!sign) return null;
  return sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
}

function signToTriplicity(sign: string | null | undefined): WesternTriplicity | null {
  const normalized = normalizeSign(sign);
  return normalized ? SIGN_TO_TRIPLICITY[normalized] ?? null : null;
}

/**
 * Coherence alignment, 3-tier:
 *   - Mutable signs (Gemini/Virgo/Sagittarius/Pisces) → 0.5 (ambiguous)
 *   - Cardinal/fixed: Yang DM aligns with Fire/Air (expressive triplicities);
 *     Yin DM aligns with Earth/Water (receptive triplicities). 1 or 0.
 *
 * The half-credit for mutable signs prevents the cliff-edge swings where a
 * single mutable Sun or Moon zeros (or maxes) a 25%-weighted sub.
 */
function polarityAlignment(polarity: DMPolarity, sign: string): number {
  if (MUTABLE_SIGNS.has(sign)) return 0.5;
  const trip = SIGN_TO_TRIPLICITY[sign];
  if (!trip) return 0.5;
  const expressive = trip === 'Fire' || trip === 'Air';
  return polarity === 'Yang' ? (expressive ? 1 : 0) : (expressive ? 0 : 1);
}

// ============================================================================
// SUB-SCORERS
// ============================================================================

/**
 * Flow — blend of structural alignment AND concentration penalty.
 *
 *   structural   = favorableMass + 0.5 × neutralMass   (was the whole formula)
 *   balanceTerm  = (1 - maxElementShare) / 0.80         (1 at uniform, 0 at 100% concentration)
 *   flow         = 0.5 × structural + 0.5 × balanceTerm
 *
 * Why the blend: follow-the-strong charts always have ~80–90% of their Qi
 * sitting in 2 useful elements (the dominant + its child/parent), which made
 * the original formula score every collapsed chart at 90+. The balanceTerm
 * docks points for raw concentration even when classical doctrine approves
 * the structure — so a 63% Earth-dominant chart can't ride structural
 * alignment to a maxed-out Flow score.
 */
function scoreFlow(
  weights: Record<ElementName, number>,
  useful: ElementName[],
  annoying: ElementName[],
): {
  score: number;
  favorable: number;
  unfavorable: number;
  neutral: number;
  maxShare: number;
  structural: number;
  balanceTerm: number;
} {
  let favorable = 0;
  let unfavorable = 0;
  let maxShare = 0;
  const usefulSet = new Set(useful);
  const annoyingSet = new Set(annoying);

  for (const el of Object.keys(weights) as ElementName[]) {
    const w = weights[el];
    if (w > maxShare) maxShare = w;
    if (usefulSet.has(el)) favorable += w;
    else if (annoyingSet.has(el)) unfavorable += w;
  }
  const neutral = Math.max(0, 1 - favorable - unfavorable);

  const structural = clamp01(favorable + 0.5 * neutral);
  // (1 - maxShare) peaks at 0.80 when all 5 elements are uniform 0.20. Normalize.
  const balanceTerm = clamp01((1 - maxShare) / 0.80);

  const score = clamp01(0.5 * structural + 0.5 * balanceTerm);
  return { score, favorable, unfavorable, neutral, maxShare, structural, balanceTerm };
}

/**
 * Vitality — triangular curve peaking at DM=65, asymmetric falloff.
 *
 *   dm ≤ 65:  linear ramp 0 → 1.0     (Overweak/Weak penalized hard)
 *   dm > 65:  gentle linear falloff to 0.65 at dm=100
 *
 * The peak sits in the upper-Balanced / lower-Strong band — the classical
 * sweet spot for Qi circulation. Both extremes drop: Overweak (DM has no
 * resources to circulate) AND Overstrong (DM dominates with no outlet, needs
 * draining via Output/Wealth/Officer). Asymmetric because Overstrong is still
 * functional (just imbalanced) while Overweak approaches non-functional.
 */
function scoreVitality(dmStrengthScore: number): number {
  const dm = Math.max(0, Math.min(100, dmStrengthScore));
  if (dm <= 65) return clamp01(dm / 65);
  // 65 → 1.0, 100 → 0.65;  slope = (1.0 - 0.65) / (100 - 65) = 0.01 per pt
  return clamp01(1.0 - 0.01 * (dm - 65));
}

/**
 * Coherence — BaZi DM polarity vs Western Sun/Moon triplicities + modalities.
 *
 *   - Sun weighted 0.6 (ego / identity), Moon 0.4 (emotional baseline).
 *   - Mutable signs score 0.5 (handled inside polarityAlignment).
 *   - When one luminary is missing, blend the present one with 0.5 neutral on
 *     the missing weight — so a single data point can't swing the full sub.
 *   - Returns 0.5 if both signs missing (true unknown).
 */
function scoreCoherence(
  polarity: DMPolarity,
  sunSign?: string | null,
  moonSign?: string | null,
): { score: number; sunHit: number | null; moonHit: number | null } {
  const sunNorm = normalizeSign(sunSign);
  const moonNorm = normalizeSign(moonSign);

  const sunHit = sunNorm && SIGN_TO_TRIPLICITY[sunNorm] ? polarityAlignment(polarity, sunNorm) : null;
  const moonHit = moonNorm && SIGN_TO_TRIPLICITY[moonNorm] ? polarityAlignment(polarity, moonNorm) : null;

  if (sunHit === null && moonHit === null) {
    return { score: 0.5, sunHit, moonHit };
  }
  // When one luminary is missing, fill that lane with neutral 0.5 so one
  // data point doesn't carry the full 25% sub weight.
  const sunComponent = sunHit ?? 0.5;
  const moonComponent = moonHit ?? 0.5;
  return { score: clamp01(0.6 * sunComponent + 0.4 * moonComponent), sunHit, moonHit };
}

/**
 * Efficiency — 1 minus normalized variance from the balanced point (0.2 each).
 * Penalizes both excess AND deficiency, symmetrically.
 */
function scoreEfficiency(weights: Record<ElementName, number>): number {
  return clamp01(1 - imbalanceFromBalanced(weights));
}

/**
 * Balance — normalized Shannon entropy. 1 = perfectly flat, 0 = single-element.
 *
 * Note: this is correlated with efficiency but not identical — entropy
 * penalizes concentration logarithmically while variance penalizes it
 * quadratically. They give different signal when one element is moderately
 * dominant vs. one element is severely dominant.
 */
function scoreBalance(weights: Record<ElementName, number>): number {
  return shannonEntropyNormalized(weights);
}

/**
 * Seasonal Alignment — DM seasonal multiplier remapped to [0, 1].
 *
 * Seasonal weights in this codebase span roughly 0.4 (Si, dead season) to
 * 1.5 (Wang, peak season). Linear remap:
 *   seasonal = (weight - 0.4) / 1.1
 */
function scoreSeasonal(seasonalDMWeight: number): number {
  return clamp01((seasonalDMWeight - 0.4) / 1.1);
}

// ============================================================================
// MAIN ENTRY
// ============================================================================

/** Q sub-component weights — must mirror happinessEngine.ts DEFAULT_PILLARS.Q. */
export const Q_SUB_WEIGHTS = {
  flow: 0.25,
  coherence: 0.25,
  efficiency: 0.15,
  balance: 0.15,
  seasonal: 0.05,
  vitality: 0.15,
} as const;

/**
 * Score the Qi Optimization pillar for a single chart.
 * All six sub-scores returned in [0, 1] plus a weighted total.
 */
export function scoreQiPillar(inputs: QPillarInputs): QPillarScores {
  const weights = toNormalizedWeights(inputs.tfq);

  const flow = scoreFlow(weights, inputs.usefulElements, inputs.annoyingElements);
  const coherence = scoreCoherence(inputs.dmPolarity, inputs.westernSunSign, inputs.westernMoonSign);
  const efficiency = scoreEfficiency(weights);
  const balance = scoreBalance(weights);
  const seasonal = scoreSeasonal(inputs.seasonalDMWeight);
  const vitality = scoreVitality(inputs.dmStrengthScore);

  const total = clamp01(
    Q_SUB_WEIGHTS.flow       * flow.score      +
    Q_SUB_WEIGHTS.coherence  * coherence.score +
    Q_SUB_WEIGHTS.efficiency * efficiency      +
    Q_SUB_WEIGHTS.balance    * balance         +
    Q_SUB_WEIGHTS.seasonal   * seasonal        +
    Q_SUB_WEIGHTS.vitality   * vitality
  );

  const usefulPct = Math.round(flow.favorable * 100);
  const annoyingPct = Math.round(flow.unfavorable * 100);
  const maxSharePct = Math.round(flow.maxShare * 100);

  return {
    flow: flow.score,
    coherence: coherence.score,
    efficiency,
    balance,
    seasonal,
    vitality,
    total,
    reasoning: {
      flow: `Structural ${Math.round(flow.structural * 100)}% (useful ${usefulPct}%, annoying ${annoyingPct}%) blended with balance ${Math.round(flow.balanceTerm * 100)}% (max share ${maxSharePct}%).`,
      coherence: coherence.sunHit === null && coherence.moonHit === null
        ? `No Western Sun/Moon data — coherence defaulted to neutral 0.50.`
        : `${inputs.dmPolarity} DM vs Sun=${formatHit(coherence.sunHit)} Moon=${formatHit(coherence.moonHit)}.`,
      efficiency: `Distribution variance ${(imbalanceFromBalanced(weights) * 100).toFixed(0)}% from balanced.`,
      balance: `Element entropy ${(balance * 100).toFixed(0)}% of max (perfectly flat).`,
      seasonal: `DM seasonal multiplier ${inputs.seasonalDMWeight.toFixed(2)} → ${(seasonal * 100).toFixed(0)}%.`,
      vitality: `DM strength ${inputs.dmStrengthScore.toFixed(0)}/100 → ${(vitality * 100).toFixed(0)}% via U-curve (peak at 65, falls off both ways).`,
    },
  };
}

function formatHit(hit: number | null): string {
  if (hit === null) return '—';
  if (hit >= 0.9) return 'aligned';
  if (hit <= 0.1) return 'opposed';
  return 'mutable';
}
