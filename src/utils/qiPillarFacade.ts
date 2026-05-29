/**
 * ============================================================================
 * Q PILLAR FACADE — profile → 6 Q sub-scores in one call
 * ============================================================================
 *
 * Orchestrates: BaZi chart calc → natal TFQ → DM strength → Useful God (with
 * collapse override) → seasonal DM weight → Western Sun/Moon lookup →
 * scoreQiPillar.
 *
 * Used by HappinessEnginePage to replace the random Q demo seed with real
 * scores for the selected profile.
 *
 * Mirrors the live computation chain in QiBraceletPage (the TFQ and
 * DM-strength logic is lifted from QiBraceletPage.jsx:10984-11147), so the
 * scores here will match the /qi-bracelet preview panel exactly.
 * ============================================================================
 */

// @ts-ignore — baziCalculator is .js with implicit any
import { calculateBaZi } from './baziCalculator';
import { computeDayMasterStrength } from './dayMasterStrength';
import { getSeasonalWeights } from './baziSeasonality';
import { calculateSurvivalKit, detectCollapse } from '../data/stoneDatabase';
import { scoreQiPillar, type QPillarScores, type DMPolarity } from './pillarScorerQ';
import { computeQiYearMatrix, type QiDist } from './qiEngine';
import type { ElementName } from './baziUsefulGod';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Minimal profile shape consumed by the facade. Matches the structure used by
 * ProfileContext / useProfileWestern — extra fields are ignored.
 */
export interface QPillarProfile {
  id?: string;
  birthDate?: string | null;       // "YYYY-MM-DD"
  birthTime?: string | null;       // "HH:MM"
  /** Cached Western chart from the Python backend. */
  western?: WesternBlob | null;
  calculations?: { western?: WesternBlob | null } | null;
}

interface WesternBlob {
  sun?: { sign?: string | null } | null;
  moon?: { sign?: string | null } | null;
  sign?: string | null;
}

export interface QPillarFacadeResult {
  scores: QPillarScores;
  // Diagnostics — useful for debugging / surfacing in tooltips
  diagnostics: {
    dmElement: ElementName;
    dmPolarity: DMPolarity;
    dmStrengthScore: number;
    seasonalDMWeight: number;
    tfq: QiDist;
    usefulElements: ElementName[];
    forbiddenElements: ElementName[];
    sunSign: string | null;
    moonSign: string | null;
  };
}

// ============================================================================
// CONSTANTS (mirror QiBraceletPage)
// ============================================================================

const ELEMENTS: readonly ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

const YANG_STEMS = new Set(['甲', '丙', '戊', '庚', '壬']);

const STEM_TO_ELEMENT: Record<string, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water',
};

/** Qi-weight per pillar position (same as qiEngine layer 2). */
const QI_W = { year: 0.10, month: 0.30, dayMaster: 0.35, dayBranch: 0.15, hour: 0.10 } as const;

// ============================================================================
// HELPERS
// ============================================================================

function polarityMultipliers(pol: DMPolarity): Record<ElementName, number> {
  return pol === 'Yang'
    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
    : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };
}

/**
 * Build natal TFQ from the engine's perPillarBreakdown — mirrors QiBraceletPage
 * userTfq (QiBraceletPage.jsx:11083-11107) exactly. Important: this uses the
 * engine's qiWeighted output for year/month/hour (which includes the rooting
 * multiplier M1×M2 that a naive raw-stem computation misses) and computes Day
 * pillar locally with the same DM 0.35 / DB 0.15 split.
 */
function buildUserTfqFromBreakdown(
  perPillarBreakdown: any,
  dmElement: ElementName,
  dmPolarity: DMPolarity,
  sw: Record<string, number>,
): QiDist {
  const pMults = polarityMultipliers(dmPolarity);
  const yearFq = perPillarBreakdown.year?.qiWeighted || {};
  const monthFq = perPillarBreakdown.month?.qiWeighted || {};
  const hourFq = perPillarBreakdown.hour?.qiWeighted || {};
  const dayBd = perPillarBreakdown.day;

  const tfq: QiDist = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const el of ELEMENTS) {
    const dmRaw = el === dmElement ? 1 : 0;
    const dbRaw = (dayBd?.raw?.[el] || 0) - dmRaw;
    const sMult = sw[el.toLowerCase()] ?? 1.0;
    const dmFq = dmRaw * sMult * pMults[el] * QI_W.dayMaster;
    const dbFq = dbRaw * sMult * pMults[el] * QI_W.dayBranch;
    tfq[el] = (yearFq[el] || 0) + (monthFq[el] || 0) + dmFq + dbFq + (hourFq[el] || 0);
  }
  return tfq;
}

/**
 * Build the pillars input for computeDayMasterStrength from the engine's
 * perPillarBreakdown (hiddenStems have `pct` already — no field rename).
 * Mirrors QiBraceletPage.jsx:11132-11142.
 */
function buildDmStrengthPillarsFromBreakdown(
  chartPillars: any[],
  perPillarBreakdown: any,
): Array<{
  label: 'Year' | 'Month' | 'Day' | 'Hour';
  branchChar: string;
  branchAnimal: string;
  hiddenStems: { element: ElementName; pct: number }[];
}> {
  const keys = ['year', 'month', 'day', 'hour'] as const;
  const labels: ('Year' | 'Month' | 'Day' | 'Hour')[] = ['Year', 'Month', 'Day', 'Hour'];
  return keys.map((key, idx) => ({
    label: labels[idx],
    branchChar: chartPillars[idx]?.branch?.char || '',
    branchAnimal: chartPillars[idx]?.branch?.animal || '',
    hiddenStems: (perPillarBreakdown[key]?.hiddenStems || []).map((hs: any) => ({
      element: hs.element as ElementName,
      pct: hs.pct as number,
    })),
  }));
}

/** Convert raw TFQ points to 0-100 percentages — required by calculateSurvivalKit. */
function tfqToPercent(tfq: QiDist): Record<ElementName, number> {
  const total = ELEMENTS.reduce((s, el) => s + (tfq[el] || 0), 0);
  if (total <= 0) return { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 };
  const out = {} as Record<ElementName, number>;
  for (const el of ELEMENTS) out[el] = ((tfq[el] || 0) / total) * 100;
  return out;
}

function readWesternSigns(profile: QPillarProfile): { sunSign: string | null; moonSign: string | null } {
  const western = profile.western || profile.calculations?.western;
  if (!western) return { sunSign: null, moonSign: null };
  return {
    sunSign: western.sun?.sign || western.sign || null,
    moonSign: western.moon?.sign || null,
  };
}

// ============================================================================
// MAIN ENTRY
// ============================================================================

/**
 * Compute the Q pillar (Qi Optimization) scores for a profile.
 *
 * Returns `null` if the profile lacks birth data or the BaZi calculation fails.
 * The 6 sub-scores in the result are ready to drop into HappinessEnginePage's
 * pillar state (each in [0,1], plus a weighted total).
 */
export function computeQiPillarFromProfile(profile: QPillarProfile | null | undefined): QPillarFacadeResult | null {
  if (!profile?.birthDate) return null;

  // 1. BaZi chart
  let chart: any;
  try {
    const [year, month, day] = profile.birthDate.split('-').map(Number);
    const [hour = 12, minute = 0] = (profile.birthTime || '12:00').split(':').map(Number);
    chart = calculateBaZi({ year, month, day, hour, minute });
    if (chart?.error) return null;
  } catch {
    return null;
  }

  const pillars = chart?.pillars;
  if (!Array.isArray(pillars) || pillars.length < 4) return null;

  const monthBranch: string | undefined = pillars[1]?.branch?.char;
  const dayMasterStem: string | undefined = pillars[2]?.stem?.char;
  if (!monthBranch || !dayMasterStem) return null;

  const dmElement = STEM_TO_ELEMENT[dayMasterStem];
  const dmPolarity: DMPolarity = YANG_STEMS.has(dayMasterStem) ? 'Yang' : 'Yin';
  if (!dmElement) return null;

  const sw = getSeasonalWeights(monthBranch);
  if (!sw) return null;
  const seasonalDMWeight = sw[dmElement.toLowerCase()] ?? 1.0;

  // 2. Run the engine to get perPillarBreakdown — same source the QiBraceletPage
  // preview panel uses. This is heavier than a raw-stem TFQ computation but
  // includes the rooting M1×M2 multiplier the engine applies before seasonality,
  // which a naive recompute would miss. Year argument is irrelevant for natal
  // breakdown (perPillarBreakdown is constant across months).
  let qiMatrix: any;
  try {
    qiMatrix = computeQiYearMatrix(chart, new Date().getFullYear());
  } catch {
    return null;
  }
  const perPillarBreakdown = qiMatrix?.perPillarBreakdown;
  if (!perPillarBreakdown) return null;

  const tfq = buildUserTfqFromBreakdown(perPillarBreakdown, dmElement, dmPolarity, sw);

  // 3. DM strength score (full 6-stage gauntlet) — mirrors QiBraceletPage:11111-11147
  const seasonalWeightsObj: Record<ElementName, number> = {
    Wood: sw.wood ?? 1.0,
    Fire: sw.fire ?? 1.0,
    Earth: sw.earth ?? 1.0,
    Metal: sw.metal ?? 1.0,
    Water: sw.water ?? 1.0,
  };
  const pMults = polarityMultipliers(dmPolarity);
  const sMultDM = seasonalWeightsObj[dmElement];
  const pMultDM = pMults[dmElement];
  const dmStemQi = 1 * sMultDM * pMultDM * QI_W.dayMaster;
  const dmRawInDayBranch = (perPillarBreakdown.day?.raw?.[dmElement] || 0) - 1;
  const dmBranchQi = Math.max(0, dmRawInDayBranch) * sMultDM * pMultDM * QI_W.dayBranch;

  let dmStrengthScore = 50;
  try {
    const result = computeDayMasterStrength({
      dmElement,
      isYang: dmPolarity === 'Yang',
      tfqTotals: tfq,
      dmStemQi,
      dmBranchQi,
      pillars: buildDmStrengthPillarsFromBreakdown(pillars, perPillarBreakdown),
      seasonalWeights: seasonalWeightsObj,
    });
    dmStrengthScore = result.score;
  } catch {
    // fall through with default 50
  }

  // 4. Useful God (with collapse override) — same path as qiEngine.ts:1219-1227
  const fqPct = tfqToPercent(tfq);
  const collapseInfo = detectCollapse(fqPct);
  const yongShen = calculateSurvivalKit(fqPct, dayMasterStem, 4, collapseInfo);

  // 5. Western signs (may be null)
  const { sunSign, moonSign } = readWesternSigns(profile);

  // 6. Score the pillar
  const scores = scoreQiPillar({
    tfq,
    usefulElements: yongShen.usefulElements || [],
    annoyingElements: yongShen.forbidden || [],
    dmPolarity,
    seasonalDMWeight,
    dmStrengthScore,
    westernSunSign: sunSign,
    westernMoonSign: moonSign,
  });

  return {
    scores,
    diagnostics: {
      dmElement,
      dmPolarity,
      dmStrengthScore,
      seasonalDMWeight,
      tfq,
      usefulElements: yongShen.usefulElements || [],
      forbiddenElements: yongShen.forbidden || [],
      sunSign,
      moonSign,
    },
  };
}
