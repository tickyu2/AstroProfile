/**
 * ============================================================================
 * QI ENGINE — Functional Element Strength Computation
 * ============================================================================
 *
 * Unlike percentage-based calculations that normalize to 100% (which can hide
 * real deficiencies), this engine tracks raw Qi points through a 9-step
 * pipeline. The output drives remedy recommendations (bracelets, Feng Shui).
 *
 * Key differences from the personality/bracelet engine:
 * - Different pillar weights (Day Master 35%, Day Branch 15%, etc.)
 * - Polarity multipliers (Yang/Yin Day Master affects element expression)
 * - Raw points, NEVER normalized to 100%
 * - Control cycle pressure detection
 * - 9-step transparent pipeline
 *
 * Created: March 2026
 * ============================================================================
 */

import { STEMS, BRANCHES, HIDDEN_STEMS } from './baziEngine';
import { getSeasonalWeights } from './baziSeasonality';
import {
  computeDaYunQi,
  DA_YUN_BUDGET,
  type DaYunPillar,
  type DaYunQiContribution,
} from './daYunEngine';
import {
  calculateSurvivalKit,
  detectCollapse,
  type StoneRecommendation,
  type ElementName,
  type YongShenResult,
  type CollapseInfo,
} from '../data/stoneDatabase';
import {
  getYearPillar,
  getMonthPillars,
  BAZI_MONTH_ORDER,
  detectInteractions,
  type PillarInfo,
  type InteractionHit,
} from './braceletEngine';
import { buildCauseMap, type CauseMapResult } from './causeMapEngine';

// ============================================================================
// TYPES
// ============================================================================

export interface QiDist {
  Wood: number; Fire: number; Earth: number; Metal: number; Water: number;
}

export interface QiStep {
  label: string;
  detail: string;
  qi: QiDist;           // Running Qi state after this step
  totalQi: number;      // Sum of all elements
}

export interface QiMonthSnapshot {
  monthIndex: number;
  gregorianMonth: number;
  monthName: string;
  season: string;
  branchAnimal: string;
  monthStem: string;
  monthBranch: string;

  natalQi: QiDist;          // Step 1: raw natal Qi (birth-season-adjusted)
  polarityQi: QiDist;       // Step 2: after polarity modifiers
  yearQi: QiDist;           // Step 3: year pillar Qi contribution (20 pts)
  monthQi: QiDist;          // Step 4: month pillar Qi contribution (10 pts)
  natalTfq: QiDist;         // NTFQ (post-pipeline) if available, else raw TFQ — used as natal component in MTFQ
  mtfqQi: QiDist;           // Step 5: MTFQ weighted blend (1.0×Natal + 0.9×DaYun + 0.5×Year + 0.3×Month)
  seasonalQi: QiDist;       // Legacy alias → natalTfq (for backward compat)
  combinedQi: QiDist;       // Legacy alias → mtfqQi (for backward compat)
  postClashQi: QiDist;      // Step 6: after clash/harm damage
  postControlQi: QiDist;    // Step 7: after control cycle pressure
  functionalQi: QiDist;     // Step 8: final functional Qi

  yearPillarBreakdown: PillarBreakdown;   // Baby-step breakdown for Year Pillar (current season + polarity)
  monthPillarBreakdown: PillarBreakdown;  // Baby-step breakdown for Month Pillar (current season + polarity)

  interactions: InteractionHit[];
  steps: QiStep[];

  collapseInfo: CollapseInfo;
  yongShen: YongShenResult;
  recommendedStones: StoneRecommendation[];
  causeMap: CauseMapResult;

  // ── Da Yun (大運) influence — optional, present when daYunPillar is passed ──
  daYunQi?: QiDist;          // Step 3.5 contribution (raw pts, ×0.9 in MTFQ)
  daYunPillar?: DaYunPillar; // The active 大運 pillar this month

  // ── Synergy (生 generation amplification) ──
  synergyGains?: QiDist;     // Per-element Qi created by generation cycle (additive)
  synergyPairDetail?: { gen: ElementName; recv: ElementName; extG: number; E: number; S: number; kEff: number; gain: number }[];
  mtfqPreSynergy?: QiDist;   // MTFQ computed WITHOUT synergy (for before/after trajectory shift)
}

export interface HiddenStemInfo {
  char: string;
  element: ElementName;
  fullEnglish: string;   // "Yang Wood"
  pct: number;           // 60, 30, 10
  pts: number;           // pct/100 * 10
}

export interface PillarBreakdown {
  raw: QiDist;           // Pre-season (stem=1 + branch=10)
  seasoned: QiDist;      // Post-birth-season
  polarityAdjusted?: QiDist;  // Post-polarity (seasoned × polarity multiplier)
  qiWeighted?: QiDist;        // After Qi weight applied (final functional contribution)
  steps: string[];       // Calculation detail lines (legacy)
  // Structured data for baby-step display
  stemChar: string;
  stemElement: ElementName;
  stemFullEnglish: string;  // "Yang Earth"
  branchChar: string;
  branchAnimal: string;     // "Tiger"
  hiddenStems: HiddenStemInfo[];
}

export type PerPillarBreakdownMap = Record<'year' | 'month' | 'day' | 'hour', PillarBreakdown>;

export interface QiYearMatrix {
  year: number;
  yearPillar: PillarInfo;
  months: QiMonthSnapshot[];
  natalQi: QiDist;         // Constant across months
  polarityQi: QiDist;      // Constant across months
  perPillarBreakdown: PerPillarBreakdownMap;
  dayMasterPolarity: 'Yang' | 'Yin';
  dayMasterElement: ElementName;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEMENT_KEYS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

/**
 * Qi pillar weights — fractional multipliers (Layer 2).
 * These are NOT decomposition budgets. They're applied AFTER
 * pillar composition (Layer 1) to determine functional importance.
 */
const QI_WEIGHTS = {
  dayMaster: 0.35,    // Day Stem = core self
  dayBranch: 0.15,    // Day Branch = internal reservoir
  month: 0.30,        // Month = season/environment
  year: 0.10,         // Year = ancestry
  hour: 0.10,         // Hour = inner mind
};

/**
 * TFQ Polarity multipliers — strength-modulation model (not behavioral).
 *
 * Yang = baseline strength (1.00 for all elements)
 * Yin  = slightly reduced strength (Yin is inward, less forceful)
 * Metal = neutral (Yin/Yang Metal behave similarly in strength)
 *
 * This is subtle (5–20% shifts) to prevent polarity from overpowering
 * seasonality and rooting. The old behavioral polarity table (Yang boosts
 * Wood/Fire/Water) belongs in personality/relationship layers, not TFQ.
 */
const POLARITY_MULTIPLIERS: Record<'Yang' | 'Yin', QiDist> = {
  Yang: { Wood: 1.00, Fire: 1.00, Earth: 1.00, Metal: 1.00, Water: 1.00 },
  Yin:  { Wood: 0.85, Fire: 0.95, Earth: 0.90, Metal: 1.00, Water: 0.80 },
};

/** Control cycle pressure: if controller > controlled × threshold, reduce */
const PRESSURE_THRESHOLD = 1.5;
const PRESSURE_REDUCTION = 0.15;

// (Incoming pillar budgets removed — external pillars now use raw pts like Da Yun.
//  MTFQ weights control relative influence.)

/**
 * MTFQ (Month Total Functional Qi) layer weights.
 *
 * Each layer is a 5-element QiVector. They are blended additively:
 *   MTFQ = W_NATAL × NatalTfq + W_DAYUN × DaYunQi + W_YEAR × YearQi + W_MONTH × MonthQi
 *
 * Weights reflect metaphysical time-scale influence:
 *   - Natal  (1.0) = the body / DNA — strongest, fixed constitution
 *   - DaYun  (0.9) = decade climate — nearly as deep, shapes life direction
 *   - Year   (0.5) = annual weather — significant but not defining
 *   - Month  (0.3) = monthly weather — short-term, subtle
 */
export const MTFQ_W_NATAL  = 1.0;
export const MTFQ_W_DAYUN  = 0.9;
export const MTFQ_W_YEAR   = 0.5;
export const MTFQ_W_MONTH  = 0.3;

// ── Synergy: Wu Xing generation cycle amplification ─────────────────────────
// Applied to scaled external Qi (DaYun′ + Year′ + Month′) BEFORE MTFQ blending.
// Each generator element creates a k-fraction of new Qi in the generated element.
// This is additive (not conservation) — Qi is created, not transferred.
//
// Seasonal modulation: the generator's expressiveness in the current month
// scales κ within a gentle 0.8–1.2 band:
//   E ∈ [0.2, 1.0] → S ∈ [0.8, 1.2]
//   S = 0.8 + 0.4 × (E − 0.2) / 0.8
//   κ_eff = κ_base × S
export const SYNERGY_K = 0.2;  // base generation coefficient

// Generator → Generated (producing cycle: Wood→Fire→Earth→Metal→Water→Wood)
const SYNERGY_PAIRS: [ElementName, ElementName][] = [
  ['Wood',  'Fire'],
  ['Fire',  'Earth'],
  ['Earth', 'Metal'],
  ['Metal', 'Water'],
  ['Water', 'Wood'],
];

/** Convert expressiveness (0.2–1.0) to synergy factor (0.8–1.2) */
function expressivenessToSynergyFactor(E: number): number {
  return 0.8 + 0.4 * ((Math.max(0.2, Math.min(1.0, E)) - 0.2) / 0.8);
}

/**
 * Compute per-element synergy gains from external Qi.
 * For each generator→generated pair: gain = κ_eff × externalTotal[generator]
 * If seasonalWeights provided, κ_eff = κ_base × synergyFactor(expressiveness).
 * Returns the gains vector AND per-pair detail for baby-step trace.
 */
export function computeSynergyGains(
  externalTotal: QiDist,
  kBase = SYNERGY_K,
  seasonalWeights?: QiDist
): { gains: QiDist; pairDetail: { gen: ElementName; recv: ElementName; extG: number; E: number; S: number; kEff: number; gain: number }[] } {
  const gains = emptyQi();
  const pairDetail: { gen: ElementName; recv: ElementName; extG: number; E: number; S: number; kEff: number; gain: number }[] = [];
  for (const [gen, recv] of SYNERGY_PAIRS) {
    const extG = externalTotal[gen];
    const E = seasonalWeights ? seasonalWeights[gen] : 0.6; // 0.6 = neutral → S=1.0
    const S = expressivenessToSynergyFactor(E);
    const kEff = kBase * S;
    const gain = kEff * extG;
    gains[recv] += gain;
    pairDetail.push({ gen, recv, extG, E, S, kEff, gain });
  }
  return { gains, pairDetail };
}

/**
 * Apply synergy gains back into the three external layers proportionally.
 * Each layer keeps its original share of the element, but the total grows.
 * E.g. if DaYun had 60% of Fire and Year had 40%, after synergy boosts Fire,
 * DaYun still gets 60% of the new Fire total.
 */
function applySynergyToLayers(
  dayun: QiDist, year: QiDist, month: QiDist, gains: QiDist
): { dayunSyn: QiDist; yearSyn: QiDist; monthSyn: QiDist } {
  const dayunSyn = emptyQi();
  const yearSyn  = emptyQi();
  const monthSyn = emptyQi();

  for (const el of ELEMENT_KEYS) {
    const extBefore = dayun[el] + year[el] + month[el];
    const extAfter  = extBefore + gains[el];

    if (extBefore <= 0) {
      // No external Qi for this element — distribute gain equally among layers
      dayunSyn[el] = dayun[el] + gains[el] / 3;
      yearSyn[el]  = year[el]  + gains[el] / 3;
      monthSyn[el] = month[el] + gains[el] / 3;
    } else {
      // Proportional redistribution
      dayunSyn[el] = (dayun[el] / extBefore) * extAfter;
      yearSyn[el]  = (year[el]  / extBefore) * extAfter;
      monthSyn[el] = (month[el] / extBefore) * extAfter;
    }
  }
  return { dayunSyn, yearSyn, monthSyn };
}

// ============================================================================
// HELPERS
// ============================================================================

function emptyQi(): QiDist {
  return { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
}

function cloneQi(q: QiDist): QiDist {
  return { ...q };
}

function scaleQi(q: QiDist, factor: number): QiDist {
  const r = emptyQi();
  for (const k of ELEMENT_KEYS) r[k] = q[k] * factor;
  return r;
}

function sumQi(q: QiDist): number {
  return ELEMENT_KEYS.reduce((sum, k) => sum + q[k], 0);
}

function fmtQi(q: QiDist): string {
  return ELEMENT_KEYS.map(k => `${k}: ${q[k].toFixed(2)}`).join('  |  ');
}

function stemElement(char: string): ElementName {
  return (STEMS[char]?.element || 'Earth') as ElementName;
}

function stemEnglish(char: string): string {
  return STEMS[char]?.english || 'Unknown';
}

function animalName(char: string): string {
  return BRANCHES[char]?.animal || 'Unknown';
}

// ── Rooting pillar weights — same as DM Strength Stage 2 ──
// Month is strongest root (seasonal environment), Day is personal foundation.
const ROOTING_PILLAR_WEIGHT: Record<string, number> = {
  Day: 1.0, Month: 1.2, Year: 0.7, Hour: 0.7,
};

// Rooting tiers — same as DM Strength Stage 2
const ROOTING_TIERS: { maxPts: number; label: string; mult: number }[] = [
  { maxPts: 0.5,       label: 'No root',    mult: 0.7 },
  { maxPts: 1.5,       label: 'Light root',  mult: 1.0 },
  { maxPts: 2.5,       label: 'Solid root',  mult: 1.3 },
  { maxPts: Infinity,  label: 'Deep root',   mult: 1.6 },
];

export interface RootingBreakdown {
  element: ElementName;
  points: number;
  multiplier: number;
  perBranch: { pillar: string; branchChar: string; animal: string; stemChar: string; pct: number; weight: number; seasonFactor: number; contribution: number }[];
}

/**
 * Compute rooting for each element using DM Strength Stage 2 logic:
 * 1. Scan all 4 branches for each element in hidden stems
 * 2. Root contribution = pillar_root_weight × seasonal_factor (for that element)
 *    (only if element is present in branch's hidden stems)
 * 3. Sum root points across all branches
 * 4. Convert to tier: No root (×0.7), Light (×1.0), Solid (×1.3), Deep (×1.6)
 */
function computeElementRooting(
  pillars: any[],
  seasonalWeights: QiDist
): { multipliers: QiDist; breakdown: RootingBreakdown[]; steps: string[] } {
  const pillarLabels = ['Year', 'Month', 'Day', 'Hour'];
  const rootPoints: QiDist = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const perElementPerBranch: Record<ElementName, RootingBreakdown['perBranch']> = {
    Wood: [], Fire: [], Earth: [], Metal: [], Water: [],
  };
  const steps: string[] = [];

  steps.push('Rooting (Stage 2 style) — scan all 4 branches for each element:');
  steps.push(`  Pillar weights: ${pillarLabels.map(l => `${l}=${ROOTING_PILLAR_WEIGHT[l]}`).join(', ')}`);
  steps.push(`  Seasonal factor applied per element`);

  for (let i = 0; i < 4; i++) {
    const p = pillars[i];
    if (!p?.branch?.char) continue;
    const hidden = HIDDEN_STEMS[p.branch.char] || [];
    const pillarWeight = ROOTING_PILLAR_WEIGHT[pillarLabels[i]] || 0.7;
    const animal = animalName(p.branch.char);

    for (const hs of hidden) {
      const el = stemElement(hs.stem);
      const sFactor = seasonalWeights[el] ?? 1.0;
      // Root contribution = pillar_weight × seasonal_factor (if element present)
      const contribution = pillarWeight * sFactor;
      rootPoints[el] += contribution;
      perElementPerBranch[el].push({
        pillar: pillarLabels[i], branchChar: p.branch.char, animal,
        stemChar: hs.stem, pct: hs.pct, weight: pillarWeight, seasonFactor: sFactor, contribution,
      });
    }
  }

  // Convert root points to tier-based multipliers (same as DM Strength Stage 2)
  const multipliers: QiDist = { Wood: 1.0, Fire: 1.0, Earth: 1.0, Metal: 1.0, Water: 1.0 };
  const breakdown: RootingBreakdown[] = [];

  for (const k of ELEMENT_KEYS) {
    const pts = rootPoints[k];
    const tier = ROOTING_TIERS.find(t => pts < t.maxPts) || ROOTING_TIERS[ROOTING_TIERS.length - 1];
    multipliers[k] = tier.mult;
    const branches = perElementPerBranch[k];

    breakdown.push({ element: k, points: pts, multiplier: tier.mult, perBranch: branches });

    if (branches.length > 0) {
      const branchDetail = branches.map(b => {
        const sf = seasonalWeights[stemElement(b.stemChar)] ?? 1.0;
        return `${b.pillar}/${b.branchChar}${b.animal}(w=${b.weight}×S=${sf.toFixed(2)}=${b.contribution.toFixed(2)})`;
      }).join(' + ');
      steps.push(`  ${k}: ${branchDetail} = ${pts.toFixed(2)} pts → ${tier.label} ×${tier.mult}`);
    } else {
      steps.push(`  ${k}: no root → ${tier.label} ×${tier.mult}`);
    }
  }

  return { multipliers, breakdown, steps };
}

/** Map lowercase seasonal weights to capitalized ElementName keys */
function seasonalWeightsFor(monthBranch: string): QiDist {
  const w = getSeasonalWeights(monthBranch);
  return {
    Wood:  (w as any).wood  ?? 1.0,
    Fire:  (w as any).fire  ?? 1.0,
    Earth: (w as any).earth ?? 1.0,
    Metal: (w as any).metal ?? 1.0,
    Water: (w as any).water ?? 1.0,
  };
}

// ============================================================================
// STEP 1: NATAL QI — Layer 1 (Pillar Composition)
// ============================================================================

/** Per-pillar Qi tracking for Layer 2 application */
interface PerPillarQi {
  year: QiDist;
  month: QiDist;
  day: QiDist;     // Full Day Pillar (stem + branch combined)
  hour: QiDist;
}

/**
 * Layer 1: Pillar Composition — "How much of each element is inside each pillar?"
 *
 * Uses stem=1pt, branch=10pts for ALL pillars (same ratio everywhere).
 * Then applies birth month's seasonal multipliers per-pillar.
 *
 * This layer does NOT apply Qi weights (35/15/30/10/10).
 * Those come in Layer 2 (applyPolarityModifiers).
 *
 * Returns:
 *   qi — sum of all 4 pillars after birth-season adjustment (for Step 1 display)
 *   perPillar — individual pillar QiDists (for Layer 2 to use)
 */
export function computeNatalQi(
  pillars: any[],
  birthMonthBranch: string
): { qi: QiDist; perPillar: PerPillarQi; perPillarBreakdown: PerPillarBreakdownMap; steps: string[] } {
  const steps: string[] = [];
  const sw = seasonalWeightsFor(birthMonthBranch);

  const pillarNames = ['Year', 'Month', 'Day', 'Hour'];
  const perPillarKeys: (keyof PerPillarQi)[] = ['year', 'month', 'day', 'hour'];
  const perPillar: PerPillarQi = {
    year: emptyQi(), month: emptyQi(), day: emptyQi(), hour: emptyQi(),
  };
  const emptyBreakdown = (): PillarBreakdown => ({
    raw: emptyQi(), seasoned: emptyQi(), steps: [],
    stemChar: '', stemElement: 'Earth' as ElementName, stemFullEnglish: '',
    branchChar: '', branchAnimal: '', hiddenStems: [],
  });
  const perPillarBreakdown: PerPillarBreakdownMap = {
    year: emptyBreakdown(), month: emptyBreakdown(),
    day: emptyBreakdown(), hour: emptyBreakdown(),
  };

  // Compute element rooting multipliers from all 4 branches (Stage 2 style)
  const rooting = computeElementRooting(pillars, sw);
  const rootMult = rooting.multipliers;
  const rootedElements = ELEMENT_KEYS.filter(k => rootMult[k] > 1.001);

  steps.push('Layer 1: Pillar Composition — Raw → Rooting → Seasonality');
  steps.push(`  stem = 1 pt, branch = 10 pts`);
  steps.push(`  Birth Season (${birthMonthBranch}): ${ELEMENT_KEYS.map(k => `${k}×${sw[k]}`).join(', ')}`);
  steps.push('');

  // Rooting detail
  steps.push(...rooting.steps);
  steps.push('');

  for (let i = 0; i < 4; i++) {
    const p = pillars[i];
    const key = perPillarKeys[i];
    const label = pillarNames[i];
    const pSteps: string[] = [];

    if (!p?.stem?.char || !p?.branch?.char) {
      steps.push(`${label} Pillar: missing data, skipped`);
      pSteps.push('Missing data, skipped');
      perPillarBreakdown[key].steps = pSteps;
      continue;
    }

    const raw = emptyQi();

    // Stem: 1 pt → stem's element
    const sEl = stemElement(p.stem.char);
    raw[sEl] += 1;

    const pillarHeader = `${label} — ${p.stem.char}${p.branch.char} (${stemEnglish(p.stem.char)} ${animalName(p.branch.char)})`;
    steps.push(pillarHeader);
    pSteps.push(`Stem ${p.stem.char} (${stemEnglish(p.stem.char)}): 1 pt → ${sEl}`);
    steps.push(`  Stem ${p.stem.char} (${stemEnglish(p.stem.char)}): 1 pt → ${sEl}`);

    // Branch: 10 pts distributed by hidden stem %
    const hidden = HIDDEN_STEMS[p.branch.char] || [];
    steps.push(`  Branch ${p.branch.char} (${animalName(p.branch.char)}): 10 pts:`);
    pSteps.push(`Branch ${p.branch.char} (${animalName(p.branch.char)}): 10 pts:`);
    for (const hs of hidden) {
      const hsEl = stemElement(hs.stem);
      const c = 10 * (hs.pct / 100);
      raw[hsEl] += c;
      const hsLine = `  ${hs.stem} ${stemEnglish(hs.stem)} (${hs.pct}%): ${c.toFixed(1)} pts → ${hsEl}`;
      steps.push(`  ${hsLine}`);
      pSteps.push(hsLine);
    }

    // Raw pillar total (pre-rooting)
    const rawNonzero = ELEMENT_KEYS.filter(k => raw[k] > 0);
    const rawLine = `Raw: ${rawNonzero.map(k => `${k}=${raw[k].toFixed(1)}`).join(', ')} (${sumQi(raw).toFixed(0)} pts)`;
    steps.push(`  ${rawLine}`);
    pSteps.push(rawLine);

    // Apply double rooting multipliers:
    //   M2 = chart-wide tier multiplier (per element)
    //   M1 = per-pillar rooting influence weight
    //   Rooted = Raw × M2 × M1
    const pillarRootW = ROOTING_PILLAR_WEIGHT[label] || 0.7;
    const rooted = emptyQi();
    for (const k of ELEMENT_KEYS) {
      rooted[k] = raw[k] * rootMult[k] * pillarRootW;
    }
    const rootedNonzero = ELEMENT_KEYS.filter(k => raw[k] > 0.001);
    if (rootedNonzero.length > 0) {
      steps.push(`  Rooting (M2×M1): tier × pillar influence (${label}=${pillarRootW})`);
      for (const k of rootedNonzero) {
        steps.push(`    ${k}=${raw[k].toFixed(3)} × ${rootMult[k].toFixed(1)}(tier) × ${pillarRootW}(${label}) = ${rooted[k].toFixed(3)}`);
      }
      pSteps.push(`Rooting: tier × ${label} influence (${pillarRootW})`);
      for (const k of rootedNonzero) {
        pSteps.push(`  ${k}=${raw[k].toFixed(3)} × ${rootMult[k].toFixed(1)} × ${pillarRootW} = ${rooted[k].toFixed(3)}`);
      }
    }

    // Apply birth season to rooted pillar
    const seasoned = emptyQi();
    for (const k of ELEMENT_KEYS) {
      seasoned[k] = rooted[k] * sw[k];
    }
    const seasonedNonzero = ELEMENT_KEYS.filter(k => seasoned[k] > 0.01);
    const seasonLine = `Season (${birthMonthBranch}): ${seasonedNonzero.map(k => `${k}=${rooted[k].toFixed(2)}×${sw[k]}=${seasoned[k].toFixed(2)}`).join(', ')}`;
    steps.push(`  ${seasonLine}`);
    pSteps.push(seasonLine);
    steps.push('');

    // Build structured hidden stem info
    const hiddenStemInfos: HiddenStemInfo[] = hidden.map(hs => ({
      char: hs.stem,
      element: stemElement(hs.stem),
      fullEnglish: stemEnglish(hs.stem),
      pct: hs.pct,
      pts: 10 * (hs.pct / 100),
    }));

    perPillar[key] = seasoned;
    perPillarBreakdown[key] = {
      raw: cloneQi(raw), seasoned: cloneQi(seasoned), steps: pSteps,
      stemChar: p.stem.char,
      stemElement: sEl,
      stemFullEnglish: stemEnglish(p.stem.char),
      branchChar: p.branch.char,
      branchAnimal: animalName(p.branch.char),
      hiddenStems: hiddenStemInfos,
    };
  }

  // Sum all pillars for display
  const qi = emptyQi();
  for (const key of perPillarKeys) {
    for (const k of ELEMENT_KEYS) {
      qi[k] += perPillar[key][k];
    }
  }

  steps.push(`Total (4 pillars × 11 pts = 44 raw, season-adjusted):`);
  steps.push(`  ${fmtQi(qi)}`);
  steps.push(`  Total = ${sumQi(qi).toFixed(2)} pts`);

  return { qi, perPillar, perPillarBreakdown, rootingMultipliers: rootMult, rootingBreakdown: rooting.breakdown, steps };
}

// ============================================================================
// STEP 2: POLARITY + QI WEIGHTS — Layer 2 (Functional Importance)
// ============================================================================

/**
 * Layer 2: Apply polarity modifiers per-pillar, then Qi weights.
 *
 * 1. Apply polarity multipliers to each pillar's elements
 * 2. Separate Day Pillar into DM (Day Master's element) and DB (rest)
 * 3. Apply Qi weights: DM×0.35, DB×0.15, Month×0.30, Year×0.10, Hour×0.10
 * 4. Sum = natal functional Qi
 *
 * Returns:
 *   qi — polarity-adjusted sum (NO Qi weights) — used as base for Step 5 seasonal re-adjustment
 *   weightedQi — final natal functional Qi (WITH Qi weights) — displayed in Step 2 detail
 */
export function applyPolarityModifiers(
  perPillar: PerPillarQi,
  dayMasterPolarity: 'Yang' | 'Yin',
  dayMasterElement: ElementName
): { qi: QiDist; weightedQi: QiDist; steps: string[] } {
  const mods = POLARITY_MULTIPLIERS[dayMasterPolarity];
  const steps: string[] = [];

  steps.push(`${dayMasterPolarity} ${dayMasterElement} Day Master — Polarity Multipliers:`);
  steps.push(`  ${ELEMENT_KEYS.map(k => `${k}×${mods[k]}`).join(', ')}`);
  steps.push('');

  // ── Apply polarity per-pillar ────────────────────────
  const pillarNames = ['Year', 'Month', 'Day', 'Hour'];
  const perPillarKeys: (keyof PerPillarQi)[] = ['year', 'month', 'day', 'hour'];
  const polarized: PerPillarQi = {
    year: emptyQi(), month: emptyQi(), day: emptyQi(), hour: emptyQi(),
  };

  for (let i = 0; i < 4; i++) {
    const key = perPillarKeys[i];
    const label = pillarNames[i];
    const src = perPillar[key];
    const dst = emptyQi();

    for (const k of ELEMENT_KEYS) {
      dst[k] = src[k] * mods[k];
    }
    polarized[key] = dst;

    const nonzero = ELEMENT_KEYS.filter(k => dst[k] > 0.01);
    if (nonzero.length > 0) {
      steps.push(`${label}: ${nonzero.map(k => `${k}=${src[k].toFixed(2)}×${mods[k]}=${dst[k].toFixed(2)}`).join(', ')}`);
    }
  }

  // Sum for display (polarity-adjusted, NO Qi weights — this is what Step 5 uses)
  const qi = emptyQi();
  for (const key of perPillarKeys) {
    for (const k of ELEMENT_KEYS) {
      qi[k] += polarized[key][k];
    }
  }

  steps.push('');
  steps.push(`Polarity-Adjusted Qi: ${fmtQi(qi)}`);
  steps.push(`Total = ${sumQi(qi).toFixed(2)} pts`);

  // ── Qi Weight Application (Layer 2) ─────────────────
  steps.push('');
  steps.push(`Layer 2: Qi Weighting (DM ${QI_WEIGHTS.dayMaster * 100}% | DB ${QI_WEIGHTS.dayBranch * 100}% | Month ${QI_WEIGHTS.month * 100}% | Year ${QI_WEIGHTS.year * 100}% | Hour ${QI_WEIGHTS.hour * 100}%)`);
  steps.push('');

  const weightedQi = emptyQi();
  const dayQi = polarized.day;

  // DM: All of the Day Master's element from Day Pillar × 0.35
  const dmVal = dayQi[dayMasterElement];
  weightedQi[dayMasterElement] += dmVal * QI_WEIGHTS.dayMaster;
  steps.push(`Day Master (${dayMasterElement}): ${dmVal.toFixed(2)} × ${QI_WEIGHTS.dayMaster} = ${(dmVal * QI_WEIGHTS.dayMaster).toFixed(4)}`);

  // DB: All other elements from Day Pillar × 0.15
  const dbElements = ELEMENT_KEYS.filter(k => k !== dayMasterElement && dayQi[k] > 0.001);
  for (const k of dbElements) {
    weightedQi[k] += dayQi[k] * QI_WEIGHTS.dayBranch;
    steps.push(`Day Branch (${k}): ${dayQi[k].toFixed(2)} × ${QI_WEIGHTS.dayBranch} = ${(dayQi[k] * QI_WEIGHTS.dayBranch).toFixed(4)}`);
  }

  // Month pillar × 0.30
  const monthNonzero = ELEMENT_KEYS.filter(k => polarized.month[k] > 0.001);
  for (const k of monthNonzero) {
    weightedQi[k] += polarized.month[k] * QI_WEIGHTS.month;
    steps.push(`Month (${k}): ${polarized.month[k].toFixed(2)} × ${QI_WEIGHTS.month} = ${(polarized.month[k] * QI_WEIGHTS.month).toFixed(4)}`);
  }

  // Year pillar × 0.10
  const yearNonzero = ELEMENT_KEYS.filter(k => polarized.year[k] > 0.001);
  for (const k of yearNonzero) {
    weightedQi[k] += polarized.year[k] * QI_WEIGHTS.year;
    steps.push(`Year (${k}): ${polarized.year[k].toFixed(2)} × ${QI_WEIGHTS.year} = ${(polarized.year[k] * QI_WEIGHTS.year).toFixed(4)}`);
  }

  // Hour pillar × 0.10
  const hourNonzero = ELEMENT_KEYS.filter(k => polarized.hour[k] > 0.001);
  for (const k of hourNonzero) {
    weightedQi[k] += polarized.hour[k] * QI_WEIGHTS.hour;
    steps.push(`Hour (${k}): ${polarized.hour[k].toFixed(2)} × ${QI_WEIGHTS.hour} = ${(polarized.hour[k] * QI_WEIGHTS.hour).toFixed(4)}`);
  }

  steps.push('');
  steps.push(`Natal Functional Qi: ${fmtQi(weightedQi)}`);
  steps.push(`Total = ${sumQi(weightedQi).toFixed(2)} pts`);

  // Also show as percentages for intuition
  const wTotal = sumQi(weightedQi);
  if (wTotal > 0) {
    steps.push(`As %: ${ELEMENT_KEYS.map(k => `${k} ${((weightedQi[k] / wTotal) * 100).toFixed(1)}%`).join(' | ')}`);
  }

  return { qi, weightedQi, steps };
}

// ============================================================================
// STEPS 3–4: INCOMING PILLAR QI (Year / Month)
// ============================================================================

/**
 * External climate pillar Qi — same pipeline as Da Yun:
 *   1. Stem = 1pt, Branch = 10pts (hidden stem distribution)
 *   2. Seasonality — pillar's OWN branch season (not birth, not current month)
 *   3. Polarity — pillar's OWN stem Yin/Yang (not Day Master)
 *   4. Output: raw polarized QiVector (no normalization, no natal weights)
 *
 * Current Year and Current Month are external climate — they do NOT get:
 *   - Natal pillar weights (10%, 30%, 35%, 15%, 10%)
 *   - Combinations, clashes, harms, punishments, control, etc.
 */
export function computePillarQi(
  stemChar: string,
  branchChar: string,
): { qi: QiDist; steps: string[] } {
  const steps: string[] = [];

  // ── Step 1: Decompose — stem 1pt + branch 10pts ──
  const rawQi = emptyQi();
  const sEl = stemElement(stemChar);
  rawQi[sEl] += 1;
  steps.push(`Stem ${stemChar} (${stemEnglish(stemChar)}): 1 pt → ${sEl}`);

  const hidden = HIDDEN_STEMS[branchChar] || [];
  steps.push(`Branch ${branchChar} (${animalName(branchChar)}): 10 pts distributed:`);
  for (const hs of hidden) {
    const hsEl = stemElement(hs.stem);
    const pts = 10 * (hs.pct / 100);
    rawQi[hsEl] += pts;
    steps.push(`  ${hs.stem} ${stemEnglish(hs.stem)} (${hs.pct}%): ${pts.toFixed(3)} pts → ${hsEl}`);
  }

  // ── Step 2: Seasonality — pillar's OWN branch season ──
  const sw = seasonalWeightsFor(branchChar);
  const seasonal = emptyQi();
  steps.push(`Seasonality (own branch ${branchChar} ${animalName(branchChar)}):`);
  for (const k of ELEMENT_KEYS) {
    seasonal[k] = rawQi[k] * sw[k];
    if (rawQi[k] > 0.001) {
      steps.push(`  ${k}: ${rawQi[k].toFixed(3)} × ${sw[k].toFixed(2)} = ${seasonal[k].toFixed(3)}`);
    }
  }

  // ── Step 3: Polarity — pillar's OWN stem Yin/Yang ──
  const pol = (STEMS[stemChar]?.polarity || 'Yang') as 'Yang' | 'Yin';
  const polMults: Record<ElementName, number> = pol === 'Yang'
    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
    : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };

  const qi = emptyQi();
  steps.push(`Polarity (${pol} stem ${stemChar}):`);
  for (const k of ELEMENT_KEYS) {
    qi[k] = seasonal[k] * polMults[k];
    if (seasonal[k] > 0.001) {
      steps.push(`  ${k}: ${seasonal[k].toFixed(3)} × ${polMults[k].toFixed(2)} = ${qi[k].toFixed(3)}`);
    }
  }

  // ── Output: raw polarized Qi (no normalization) ──
  const qiTotal = sumQi(qi);
  steps.push('');
  steps.push(ELEMENT_KEYS.filter(k => qi[k] > 0.01).map(k => `${k}: ${qi[k].toFixed(3)}`).join(' | '));
  steps.push(`Total = ${qiTotal.toFixed(3)} pts`);

  return { qi, steps };
}

// ============================================================================
// INCOMING PILLAR BREAKDOWN (Year / Month pillars per month)
// ============================================================================

/**
 * Compute per-pillar breakdown for incoming (Year/Month) pillars.
 * Uses the SAME stem=1pt, branch=10pts decomposition as natal,
 * but applies CURRENT month season (not birth season) and Day Master polarity.
 *
 * This gives the baby-step educational view of how external Qi enters the chart.
 */
export function computeIncomingPillarBreakdown(
  stemChar: string,
  branchChar: string,
  currentMonthBranch: string,
  dayMasterPolarity: 'Yang' | 'Yin',
  qiWeightPct: number = 0
): PillarBreakdown {
  const raw = emptyQi();
  const sEl = stemElement(stemChar);
  raw[sEl] += 1;

  const hidden = HIDDEN_STEMS[branchChar] || [];
  const hiddenStemInfos: HiddenStemInfo[] = [];
  for (const hs of hidden) {
    const hsEl = stemElement(hs.stem);
    const c = 10 * (hs.pct / 100);
    raw[hsEl] += c;
    hiddenStemInfos.push({
      char: hs.stem,
      element: stemElement(hs.stem),
      fullEnglish: stemEnglish(hs.stem),
      pct: hs.pct,
      pts: c,
    });
  }

  // Apply current month season (NOT birth season)
  const sw = seasonalWeightsFor(currentMonthBranch);
  const seasoned = emptyQi();
  for (const k of ELEMENT_KEYS) {
    seasoned[k] = raw[k] * sw[k];
  }

  // Apply polarity (same Day Master polarity as natal)
  const mods = POLARITY_MULTIPLIERS[dayMasterPolarity];
  const polarityAdjusted = emptyQi();
  for (const k of ELEMENT_KEYS) {
    polarityAdjusted[k] = seasoned[k] * mods[k];
  }

  // Apply Qi weight (Year=10%, Month=30%)
  let qiWeighted: QiDist | undefined;
  if (qiWeightPct > 0) {
    qiWeighted = emptyQi();
    for (const k of ELEMENT_KEYS) {
      qiWeighted[k] = polarityAdjusted[k] * (qiWeightPct / 100);
    }
  }

  return {
    raw: cloneQi(raw),
    seasoned: cloneQi(seasoned),
    polarityAdjusted,
    qiWeighted,
    steps: [],
    stemChar,
    stemElement: sEl,
    stemFullEnglish: stemEnglish(stemChar),
    branchChar,
    branchAnimal: animalName(branchChar),
    hiddenStems: hiddenStemInfos,
  };
}

// ============================================================================
// STEP 5: SEASONAL RE-ADJUSTMENT
// ============================================================================

function applyCurrentSeason(
  polarityQi: QiDist,
  currentMonthBranch: string
): { qi: QiDist; steps: string[] } {
  const sw = seasonalWeightsFor(currentMonthBranch);
  const qi = emptyQi();
  const steps: string[] = [];

  steps.push(`Current season multipliers (${currentMonthBranch}):`);
  for (const k of ELEMENT_KEYS) {
    qi[k] = polarityQi[k] * sw[k];
    if (polarityQi[k] > 0.01) {
      steps.push(`  ${k}: ${polarityQi[k].toFixed(2)} × ${sw[k].toFixed(2)} = ${qi[k].toFixed(2)}`);
    }
  }
  steps.push(`  Total: ${sumQi(polarityQi).toFixed(2)} → ${sumQi(qi).toFixed(2)} pts`);

  return { qi, steps };
}

// ============================================================================
// STEP 7: CLASH / HARM / PUNISHMENT DAMAGE
// ============================================================================

export function applyClashDamage(
  qi: QiDist,
  interactions: InteractionHit[]
): { qi: QiDist; steps: string[] } {
  const result = cloneQi(qi);
  const steps: string[] = [];

  for (const hit of interactions) {
    const b1El = (BRANCHES[hit.branch1]?.element || 'Earth') as ElementName;
    const b2El = (BRANCHES[hit.branch2]?.element || 'Earth') as ElementName;

    if (hit.type === 'clash') {
      const before1 = result[b1El], before2 = result[b2El];
      result[b1El] *= 0.70;
      result[b2El] *= 0.70;
      steps.push(`Clash ${hit.branch1}${hit.branch2} (${hit.pillar1Label} / ${hit.pillar2Label}): ${b1El} ${before1.toFixed(2)}→${result[b1El].toFixed(2)}, ${b2El} ${before2.toFixed(2)}→${result[b2El].toFixed(2)}`);
    } else if (hit.type === 'harm') {
      const before1 = result[b1El], before2 = result[b2El];
      result[b1El] *= 0.85;
      result[b2El] *= 0.85;
      steps.push(`Harm ${hit.branch1}${hit.branch2} (${hit.pillar1Label} / ${hit.pillar2Label}): ${b1El} ${before1.toFixed(2)}→${result[b1El].toFixed(2)}, ${b2El} ${before2.toFixed(2)}→${result[b2El].toFixed(2)}`);
    } else if (hit.type === 'punishment') {
      const before1 = result[b1El];
      result[b1El] *= 0.80;
      steps.push(`Punishment ${hit.branch1} (${hit.pillar1Label} / ${hit.pillar2Label}): ${b1El} ${before1.toFixed(2)}→${result[b1El].toFixed(2)}`);
    }
  }

  if (interactions.length === 0) {
    steps.push('No clashes, harms, or punishments this month.');
  }

  return { qi: result, steps };
}

// ============================================================================
// STEP 8: CONTROL CYCLE PRESSURE
// ============================================================================

export function applyControlPressure(
  qi: QiDist
): { qi: QiDist; steps: string[] } {
  const result = cloneQi(qi);
  const steps: string[] = [];

  const controlPairs: [ElementName, ElementName][] = [
    ['Wood', 'Earth'],
    ['Earth', 'Water'],
    ['Water', 'Fire'],
    ['Fire', 'Metal'],
    ['Metal', 'Wood'],
  ];

  for (const [controller, controlled] of controlPairs) {
    if (result[controller] > result[controlled] * PRESSURE_THRESHOLD) {
      const before = result[controlled];
      result[controlled] *= (1 - PRESSURE_REDUCTION);
      steps.push(
        `${controller} (${result[controller].toFixed(2)}) > ${controlled} (${before.toFixed(2)}) × ${PRESSURE_THRESHOLD} → ${controlled} −${(PRESSURE_REDUCTION * 100).toFixed(0)}%: ${before.toFixed(2)} → ${result[controlled].toFixed(2)}`
      );
    }
  }

  if (steps.length === 0) {
    steps.push('No control cycle pressure detected (all pairs within threshold).');
  }

  return { qi: result, steps };
}

// ============================================================================
// FULL PIPELINE: COMPUTE QI MONTH SNAPSHOT
// ============================================================================

export function computeQiMonthSnapshot(
  natalQi: QiDist,
  polarityQi: QiDist,
  yearPillar: PillarInfo,
  monthPillar: PillarInfo,
  monthIndex: number,
  natalBranches: Record<string, string>,
  dayMasterStem: string,
  natalSteps: string[],
  polaritySteps: string[],
  weightedQi?: QiDist,
  daYunPillar?: DaYunPillar,
  ntfq?: QiDist               // NTFQ — natal Qi after survival pipeline (used in MTFQ blend)
): QiMonthSnapshot {
  const m = BAZI_MONTH_ORDER[monthIndex];
  const dmPolarity = (STEMS[dayMasterStem]?.polarity || 'Yang') as 'Yang' | 'Yin';

  // Baby-step breakdowns for incoming Year + Month pillars
  const yearBd = computeIncomingPillarBreakdown(yearPillar.stem, yearPillar.branch, m.branchChar, dmPolarity, 10);
  const monthBd = computeIncomingPillarBreakdown(monthPillar.stem, monthPillar.branch, m.branchChar, dmPolarity, 30);

  const allSteps: QiStep[] = [];

  // ── Step 1: Natal Qi (constant) — Layer 1 ────────────
  allSteps.push({
    label: 'Step 1: Natal Qi — Pillar Composition (stem=1, branch=10)',
    detail: [
      'Each pillar: stem contributes 1 pt, branch contributes 10 pts.',
      'Same decomposition for ALL pillars. Birth season applied per-pillar.',
      '',
      ...natalSteps,
    ].join('\n'),
    qi: cloneQi(natalQi),
    totalQi: sumQi(natalQi),
  });

  // ── Step 2: Polarity + Qi Weights (constant) — Layer 2 ─
  const step2Detail = [
    ...polaritySteps,
  ];
  if (weightedQi) {
    step2Detail.push('');
    step2Detail.push('─── Qi-Weighted Natal Functional Qi ───');
    step2Detail.push(`${fmtQi(weightedQi)}`);
    step2Detail.push(`Total = ${sumQi(weightedQi).toFixed(2)} pts`);
  }
  allSteps.push({
    label: `Step 2: Polarity + Qi Weights (${stemEnglish(dayMasterStem)} Day Master)`,
    detail: step2Detail.join('\n'),
    qi: cloneQi(polarityQi),
    totalQi: sumQi(polarityQi),
  });

  // ── Step 3: Year Qi — DaYun-style external pipeline ────
  const yearR = computePillarQi(yearPillar.stem, yearPillar.branch);
  allSteps.push({
    label: `Step 3: Year Qi — ${yearPillar.stem}${yearPillar.branch} (${yearPillar.stemEnglish} ${yearPillar.branchAnimal})`,
    detail: [
      'External climate pillar — same pipeline as Da Yun:',
      'stem 1pt + branch 10pt → own seasonality → own polarity → raw QiVector.',
      '',
      ...yearR.steps,
    ].join('\n'),
    qi: cloneQi(yearR.qi),
    totalQi: sumQi(yearR.qi),
  });

  // ── Step 3.5: Da Yun Qi (raw pts) — present only when daYunPillar passed ──
  let daYunR: DaYunQiContribution | null = null;
  if (daYunPillar) {
    daYunR = computeDaYunQi(daYunPillar, m.branchChar);
    allSteps.push({
      label: `Step 3.5: Da Yun Qi — ${daYunPillar.stem}${daYunPillar.branch} `
           + `(${daYunPillar.stemEnglish} ${daYunPillar.branchAnimal}, `
           + `ages ${daYunPillar.ageStart}–${daYunPillar.ageEnd})`,
      detail: [
        'The active 大運 (decade luck pillar) contributes to this month\'s Qi pool.',
        'Pipeline: stem 1pt + branch 10pt → seasonal multipliers → polarity → raw pts.',
        '',
        ...daYunR.steps,
      ].join('\n'),
      qi: cloneQi(daYunR.qi),
      totalQi: sumQi(daYunR.qi),
    });
  }

  // ── Step 4: Month Qi — DaYun-style external pipeline ───
  const monthR = computePillarQi(monthPillar.stem, monthPillar.branch);
  allSteps.push({
    label: `Step 4: Month Qi — ${monthPillar.stem}${monthPillar.branch} (${monthPillar.stemEnglish} ${monthPillar.branchAnimal})`,
    detail: [
      'External climate pillar — same pipeline as Da Yun:',
      'stem 1pt + branch 10pt → own seasonality → own polarity → raw QiVector.',
      '',
      ...monthR.steps,
    ].join('\n'),
    qi: cloneQi(monthR.qi),
    totalQi: sumQi(monthR.qi),
  });

  // ── Step 5: MTFQ Weighted Blending ─────────────────────
  // MTFQ = 1.0 × NTFQ + 0.9 × DaYun + 0.5 × Year + 0.3 × Month
  // NTFQ = natal Qi after the full survival pipeline (Combinations → ... → Yong Shen).
  // If NTFQ not yet available, falls back to raw TFQ (polarityQi).
  const natalForMtfq = ntfq || polarityQi;
  const natalLabel = ntfq ? 'NTFQ (post-pipeline)' : 'TFQ (raw — NTFQ not available)';
  const mtfq = emptyQi();

  // ── Scale normalization: match external layers to NTFQ total ──
  // External pillars (DaYun, Year, Month) are raw 0–11 pts.
  // NTFQ is compressed by natal weights (~0.5–1.0 total).
  // To make the MTFQ weights (1.0, 0.9, 0.5, 0.3) work as true influence
  // multipliers, we scale each external layer so its total matches NTFQ total.
  // This gives all layers equal mass; weights determine influence.
  const natalTotal = sumQi(natalForMtfq);
  const daYunRawTotal = daYunR ? sumQi(daYunR.qi) : 0;
  const yearRawTotal = sumQi(yearR.qi);
  const monthRawTotal = sumQi(monthR.qi);

  const daYunScale = daYunRawTotal > 0 ? natalTotal / daYunRawTotal : 0;
  const yearScale  = yearRawTotal  > 0 ? natalTotal / yearRawTotal  : 0;
  const monthScale = monthRawTotal > 0 ? natalTotal / monthRawTotal : 0;

  // Pre-compute scaled layer vectors (before synergy)
  const daYunScaledRaw = daYunR ? scaleQi(daYunR.qi, daYunScale) : emptyQi();
  const yearScaledRaw  = scaleQi(yearR.qi, yearScale);
  const monthScaledRaw = scaleQi(monthR.qi, monthScale);

  // ── Step 4.5: Synergy — Wu Xing generation amplification ──────────────
  // Sum external Qi across all 3 layers, then compute generation gains.
  // Wood→Fire, Fire→Earth, Earth→Metal, Metal→Water, Water→Wood
  // Gains are additive: Qi is CREATED, not transferred.
  // Seasonal modulation: generator expressiveness (0.2–1.0) → synergy factor (0.8–1.2)
  const externalTotal = emptyQi();
  for (const el of ELEMENT_KEYS) {
    externalTotal[el] = daYunScaledRaw[el] + yearScaledRaw[el] + monthScaledRaw[el];
  }
  const monthSeasonalWeights = seasonalWeightsFor(m.branchChar);
  const { gains: synergyGains, pairDetail: synergyPairDetail } = computeSynergyGains(
    externalTotal, SYNERGY_K, monthSeasonalWeights
  );
  const { dayunSyn, yearSyn, monthSyn } = applySynergyToLayers(
    daYunScaledRaw, yearScaledRaw, monthScaledRaw, synergyGains
  );

  // Use synergy-enhanced layers for MTFQ blending
  const daYunScaled = dayunSyn;
  const yearScaled  = yearSyn;
  const monthScaled = monthSyn;

  const mtfqDetail: string[] = [
    'MTFQ = 1.0 × NTFQ + 0.9 × DaYun″ + 0.5 × Year″ + 0.3 × Month″',
    'Where DaYun″/Year″/Month″ are scaled to NTFQ total, then boosted by Wu Xing synergy.',
    ntfq ? '' : '⚠ NTFQ not available — using raw TFQ as fallback.',
    '',
    '─── Step A: NTFQ Reference Total ───',
    `  ${natalLabel}: ${fmtQi(natalForMtfq)}`,
    `  NTFQ total (N) = ${natalTotal.toFixed(3)}`,
    '',
    '─── Step B: Raw External Totals ───',
    daYunR
      ? `  DaYun raw:  ${fmtQi(daYunR.qi)}  Σ = ${daYunRawTotal.toFixed(3)}`
      : `  DaYun: — not active —`,
    `  Year raw:   ${fmtQi(yearR.qi)}  Σ = ${yearRawTotal.toFixed(3)}`,
    `  Month raw:  ${fmtQi(monthR.qi)}  Σ = ${monthRawTotal.toFixed(3)}`,
    '',
    '─── Step C: Scale Factors (N / raw total) ───',
    daYunR
      ? `  DaYun: ${natalTotal.toFixed(3)} / ${daYunRawTotal.toFixed(3)} = ${daYunScale.toFixed(4)}`
      : `  DaYun: — not active —`,
    `  Year:  ${natalTotal.toFixed(3)} / ${yearRawTotal.toFixed(3)} = ${yearScale.toFixed(4)}`,
    `  Month: ${natalTotal.toFixed(3)} / ${monthRawTotal.toFixed(3)} = ${monthScale.toFixed(4)}`,
    '',
    '─── Step D: Scaled Layers (pre-synergy, each totals ≈ N) ───',
    `  NTFQ:   ${fmtQi(natalForMtfq)}  Σ = ${natalTotal.toFixed(3)}`,
    daYunR
      ? `  DaYun′: ${fmtQi(daYunScaledRaw)}  Σ = ${sumQi(daYunScaledRaw).toFixed(3)}`
      : `  DaYun′: — not active —`,
    `  Year′:  ${fmtQi(yearScaledRaw)}  Σ = ${sumQi(yearScaledRaw).toFixed(3)}`,
    `  Month′: ${fmtQi(monthScaledRaw)}  Σ = ${sumQi(monthScaledRaw).toFixed(3)}`,
    '',
    `─── Step D.5: Synergy — 生 Generation Amplification (k = ${SYNERGY_K}, seasonal) ───`,
    `  Month branch: ${m.branchChar} (${m.name})`,
    `  Seasonal expressiveness: ${fmtQi(monthSeasonalWeights)}`,
    `  External total: ${fmtQi(externalTotal)}`,
    '',
    ...synergyPairDetail.map(d =>
      `  ${d.gen} → ${d.recv}: κ=${SYNERGY_K} × S=${d.S.toFixed(2)} (E=${d.E.toFixed(1)}) × ${d.extG.toFixed(3)} = κ_eff ${d.kEff.toFixed(3)} × ${d.extG.toFixed(3)} = +${d.gain.toFixed(4)} ${d.recv}`
    ),
    '',
    `  Synergy gains:  ${fmtQi(synergyGains)}  (new Qi created)`,
    `  Total Qi added:  ${sumQi(synergyGains).toFixed(3)} pts`,
    '',
    '─── Step D.6: Synergy-Enhanced Layers (post-synergy) ───',
    daYunR
      ? `  DaYun″: ${fmtQi(daYunScaled)}  Σ = ${sumQi(daYunScaled).toFixed(3)}`
      : `  DaYun″: — not active —`,
    `  Year″:  ${fmtQi(yearScaled)}  Σ = ${sumQi(yearScaled).toFixed(3)}`,
    `  Month″: ${fmtQi(monthScaled)}  Σ = ${sumQi(monthScaled).toFixed(3)}`,
    '',
    '─── Step E: Weighted Blending (×1.0, ×0.9, ×0.5, ×0.3) ───',
  ].filter(Boolean);

  // Pre-synergy MTFQ (for trajectory shift visualization)
  const mtfqPreSynergy = emptyQi();
  for (const k of ELEMENT_KEYS) {
    mtfqPreSynergy[k] = MTFQ_W_NATAL * natalForMtfq[k] + MTFQ_W_DAYUN * daYunScaledRaw[k] + MTFQ_W_YEAR * yearScaledRaw[k] + MTFQ_W_MONTH * monthScaledRaw[k];
  }

  for (const k of ELEMENT_KEYS) {
    const n = natalForMtfq[k];
    const d = daYunScaled[k];
    const y = yearScaled[k];
    const mo = monthScaled[k];
    mtfq[k] = MTFQ_W_NATAL * n + MTFQ_W_DAYUN * d + MTFQ_W_YEAR * y + MTFQ_W_MONTH * mo;

    const parts = [`${MTFQ_W_NATAL.toFixed(1)}×${n.toFixed(3)}`];
    if (daYunR) parts.push(`${MTFQ_W_DAYUN.toFixed(1)}×${d.toFixed(3)}`);
    parts.push(`${MTFQ_W_YEAR.toFixed(1)}×${y.toFixed(3)}`);
    parts.push(`${MTFQ_W_MONTH.toFixed(1)}×${mo.toFixed(3)}`);
    mtfqDetail.push(`  ${k.padEnd(5)}: ${parts.join(' + ')} = ${mtfq[k].toFixed(3)}`);
  }

  mtfqDetail.push('');
  mtfqDetail.push(`MTFQ: ${fmtQi(mtfq)}`);
  mtfqDetail.push(`Total = ${sumQi(mtfq).toFixed(3)} pts`);

  allSteps.push({
    label: `Step 5: MTFQ — Synergy + 1.0×NTFQ + 0.9×DaYun″ + 0.5×Year″ + 0.3×Month″ (${m.name})`,
    detail: mtfqDetail.join('\n'),
    qi: cloneQi(mtfq),
    totalQi: sumQi(mtfq),
  });

  // ── Step 6: TotalQi — Final Functional Qi ──────────────
  // No more clash/control here — all violence is natal-only (in the Natal Pipeline).
  // MTFQ blend IS the final functional Qi. Run collapse + Yong Shen on it.
  const functionalQi = cloneQi(mtfq);
  const fqTotal = sumQi(functionalQi);

  // Convert to % for Yong Shen (it expects ~100%)
  const fqPct: Record<ElementName, number> = { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 };
  if (fqTotal > 0) {
    for (const k of ELEMENT_KEYS) {
      fqPct[k] = (functionalQi[k] / fqTotal) * 100;
    }
  }
  const collapseInfo = detectCollapse(fqPct);
  const yongShen = calculateSurvivalKit(fqPct, dayMasterStem, 4, collapseInfo);

  const yongShenStatusLabel = yongShen.status === 'collapse_override'
    ? `COLLAPSE (${yongShen.collapseMode}) — ${yongShen.threat}`
    : yongShen.status === 'critical_imbalance'
      ? 'CRITICAL — ' + yongShen.threat + ' at ' + yongShen.threatPercentage?.toFixed(1) + '%'
      : 'Balanced';

  allSteps.push({
    label: 'Step 6: TotalQi — Final Functional Qi',
    detail: [
      'MTFQ blend is the final TotalQi. Collapse + Yong Shen computed from this.',
      '(All natal violence already applied in the Natal Pipeline before blending.)',
      '',
      `Functional Qi: ${fmtQi(functionalQi)}`,
      `Total = ${fqTotal.toFixed(2)} pts`,
      '',
      `As %: ${ELEMENT_KEYS.map(k => `${k}: ${fqPct[k].toFixed(1)}%`).join('  |  ')}`,
      '',
      collapseInfo.mode !== 'none' ? `Structural Collapse: ${collapseInfo.mode} (${collapseInfo.primary})` : '',
      `Yong Shen: ${yongShenStatusLabel}`,
      yongShen.reasoning,
    ].filter(Boolean).join('\n'),
    qi: cloneQi(functionalQi),
    totalQi: fqTotal,
  });

  // ── Cause Map: "Why does my radar look like this?" ───────
  const interactions: InteractionHit[] = [];   // No more clash detection in monthly pipeline
  const causeMap = buildCauseMap({
    polarityQi,
    seasonalQi: natalForMtfq,
    yearQi: yearR.qi,
    daYunQi: daYunR ? daYunR.qi : undefined,
    monthQi: monthR.qi,
    combinedQi: mtfq,
    postClashQi: functionalQi,    // No clash step — MTFQ = final
    postControlQi: functionalQi,  // No control step — MTFQ = final
    functionalQi,
    yongShen,
    interactions,
    monthName: m.name,
    season: m.season,
  });

  return {
    monthIndex,
    gregorianMonth: m.gregorian,
    monthName: m.name,
    season: m.season,
    branchAnimal: monthPillar.branchAnimal,
    monthStem: monthPillar.stem,
    monthBranch: monthPillar.branch,
    natalQi: cloneQi(natalQi),
    yearPillarBreakdown: yearBd,
    monthPillarBreakdown: monthBd,
    polarityQi: cloneQi(polarityQi),
    yearQi: cloneQi(yearScaled),
    monthQi: cloneQi(monthScaled),
    natalTfq: cloneQi(natalForMtfq),
    mtfqQi: cloneQi(mtfq),
    seasonalQi: cloneQi(natalForMtfq),   // Legacy alias → natalTfq/NTFQ
    combinedQi: cloneQi(mtfq),       // Legacy alias → mtfqQi
    postClashQi: cloneQi(functionalQi),     // No clash step — MTFQ = final (backward compat)
    postControlQi: cloneQi(functionalQi),  // No control step — MTFQ = final (backward compat)
    functionalQi,
    interactions,
    steps: allSteps,
    collapseInfo,
    yongShen,
    recommendedStones: yongShen.recommendedStones,
    causeMap,
    daYunQi: daYunR ? cloneQi(daYunScaled) : undefined,
    daYunPillar: daYunPillar,
    synergyGains: cloneQi(synergyGains),
    synergyPairDetail,
    mtfqPreSynergy: cloneQi(mtfqPreSynergy),
  };
}

// ============================================================================
// YEAR MATRIX
// ============================================================================

/**
 * Compute the full 12-month Qi matrix for a year.
 *
 * @param chart - Full BaZi chart from calculateBaZi()
 * @param selectedYear - Gregorian year to compute
 */
export function computeQiYearMatrix(
  chart: any,
  selectedYear: number,
  daYunResult?: import('./daYunEngine').DaYunResult,
  ntfq?: QiDist     // NTFQ — natal Qi after survival pipeline; used in MTFQ blend
): QiYearMatrix {
  const pillars = chart.pillars;
  const dayMasterStem = pillars[2].stem.char;
  const dayMasterPolarity = (STEMS[dayMasterStem]?.polarity || 'Yang') as 'Yang' | 'Yin';
  const dayMasterElement = stemElement(dayMasterStem);
  const birthMonthBranch = pillars[1].branch.char;

  // Steps 1–2 are constant across all months
  const natalResult = computeNatalQi(pillars, birthMonthBranch);
  const polarityResult = applyPolarityModifiers(natalResult.perPillar, dayMasterPolarity, dayMasterElement);

  // Store per-pillar polarity-adjusted values in breakdown
  const mods = POLARITY_MULTIPLIERS[dayMasterPolarity];
  for (const key of ['year', 'month', 'day', 'hour'] as const) {
    const bd = natalResult.perPillarBreakdown[key];
    const pa = emptyQi();
    for (const k of ELEMENT_KEYS) {
      pa[k] = bd.seasoned[k] * mods[k];
    }
    bd.polarityAdjusted = pa;
  }

  // Compute Qi-weighted values per pillar
  const birthSw = seasonalWeightsFor(birthMonthBranch);
  const QI_W: Record<string, number> = { year: QI_WEIGHTS.year, month: QI_WEIGHTS.month, hour: QI_WEIGHTS.hour };
  for (const key of ['year', 'month', 'day', 'hour'] as const) {
    const bd = natalResult.perPillarBreakdown[key];
    const qw = emptyQi();
    if (key === 'day') {
      // Day pillar: separate DM (stem × 35%) and DB (branch × 15%) pipelines
      for (const k of ELEMENT_KEYS) {
        const stemRaw = k === dayMasterElement ? 1 : 0;
        const branchRaw = bd.raw[k] - stemRaw;
        const stemPol = stemRaw * birthSw[k] * mods[k];
        const branchPol = branchRaw * birthSw[k] * mods[k];
        qw[k] = stemPol * QI_WEIGHTS.dayMaster + branchPol * QI_WEIGHTS.dayBranch;
      }
    } else {
      const w = QI_W[key];
      for (const k of ELEMENT_KEYS) {
        qw[k] = bd.polarityAdjusted![k] * w;
      }
    }
    bd.qiWeighted = qw;
  }

  const yearPillar = getYearPillar(selectedYear);
  const monthPillars = getMonthPillars(selectedYear);

  const natalBranches: Record<string, string> = {
    year: pillars[0].branch.char,
    month: pillars[1].branch.char,
    day: pillars[2].branch.char,
    hour: pillars[3]?.branch?.char || '子',
  };

  // Resolve which Da Yun pillar is active for the selected year
  const activeDaYunPillar = daYunResult?.pillars.find(
    p => selectedYear >= p.yearStart && selectedYear <= p.yearEnd
  ) ?? undefined;

  const months: QiMonthSnapshot[] = monthPillars.map((mp, idx) =>
    computeQiMonthSnapshot(
      natalResult.qi,
      polarityResult.qi,
      yearPillar,
      mp,
      idx,
      natalBranches,
      dayMasterStem,
      natalResult.steps,
      polarityResult.steps,
      polarityResult.weightedQi,
      activeDaYunPillar,
      ntfq
    )
  );

  return {
    year: selectedYear,
    yearPillar,
    months,
    natalQi: cloneQi(natalResult.qi),
    polarityQi: cloneQi(polarityResult.qi),
    perPillarBreakdown: natalResult.perPillarBreakdown,
    rootingMultipliers: natalResult.rootingMultipliers,
    rootingBreakdown: natalResult.rootingBreakdown,
    dayMasterPolarity,
    dayMasterElement,
  };
}
