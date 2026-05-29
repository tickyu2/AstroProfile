/**
 * ============================================================================
 * BRACELET ENGINE — Annual Elemental Balancing Computation
 * ============================================================================
 *
 * Computes month-by-month element distribution for a BaZi chart holder,
 * overlaying the incoming annual pillar (20% weight) and monthly pillar
 * (10% weight), applying seasonal multipliers, detecting clashes/harms/
 * punishments, and recommending gemstones to balance deficiencies.
 *
 * Pipeline per month:
 *   1. Natal baseline (100 pts, seasonality-adjusted)
 *   2. Year overlay   (+20 pts, decomposed 1/11 stem + 10/11 branch)
 *   3. Month overlay   (+10 pts, decomposed 1/11 stem + 10/11 branch)
 *   4. Apply seasonal multiplier to incoming energy only
 *   5. Normalize 130 → 100%  →  "pre-clash"
 *   6. Detect clashes/harms/punishments, adjust elements
 *   7. Normalize again  →  "post-clash"
 *   8. Deficiency analysis + stone recommendations
 *
 * Created: March 2026
 * ============================================================================
 */

import { Solar } from 'lunar-javascript';
import { STEMS, BRANCHES, HIDDEN_STEMS } from './baziEngine';
import { getSeasonalWeights } from './baziSeasonality';
import {
  doTheyClash,
  getClashDefinition,
  doTheyHarm,
  getHarmDefinition,
} from './baziConflicts';
import {
  recommendStones,
  calculateSurvivalKit,
  type StoneRecommendation,
  type ElementName,
  type YongShenResult,
} from '../data/stoneDatabase';

// ============================================================================
// TYPES
// ============================================================================

export interface ElementDist {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
}

export interface PillarInfo {
  stem: string;        // Chinese character e.g. '丙'
  branch: string;      // Chinese character e.g. '午'
  stemElement: string;
  branchAnimal: string;
  stemEnglish: string;
}

export interface CalculationStep {
  label: string;
  detail: string;
  elements?: ElementDist;
}

export interface InteractionHit {
  type: 'clash' | 'harm' | 'punishment';
  branch1: string;
  branch2: string;
  pillar1Label: string;
  pillar2Label: string;
  nature: string;
  effect: string;
}

export interface MonthSnapshot {
  monthIndex: number;           // 0..11 (寅=0 through 丑=11)
  gregorianMonth: number;       // 2..1 (Feb=2 through Jan=1)
  monthName: string;            // "February", "March", ...
  monthStem: string;
  monthBranch: string;
  branchAnimal: string;
  season: string;               // "Spring", "Summer", etc.
  seasonEmoji: string;
  // Element distributions (percentages summing to ~100)
  natalBaseline: ElementDist;
  yearContribution: ElementDist;
  monthContribution: ElementDist;
  preClash: ElementDist;
  postClash: ElementDist;
  // Interactions
  interactions: InteractionHit[];
  // Calculation transparency
  steps: CalculationStep[];
  // Danger assessment
  dangerLevel: 'safe' | 'caution' | 'warning' | 'danger';
  dangerScore: number;          // 0..100
  // Recommendations (Yong Shen aware)
  deficientElements: { element: ElementName; deficit: number }[];
  recommendedStones: StoneRecommendation[];
  yongShen: YongShenResult;
}

export interface SeasonSummary {
  season: string;
  emoji: string;
  months: MonthSnapshot[];
  average: ElementDist;
  avgDangerScore: number;
}

export interface YearMatrix {
  year: number;
  yearPillar: PillarInfo;
  months: MonthSnapshot[];
  seasons: SeasonSummary[];
  dangerMonths: MonthSnapshot[];
  yearAverage: ElementDist;
  yearStones: StoneRecommendation[];
  yearYongShen: YongShenResult;
  journeySummary: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const BAZI_MONTH_ORDER = [
  { branchChar: '寅', gregorian: 2,  name: 'February',  season: 'Spring',  emoji: '🌸' },
  { branchChar: '卯', gregorian: 3,  name: 'March',     season: 'Spring',  emoji: '🌸' },
  { branchChar: '辰', gregorian: 4,  name: 'April',     season: 'Spring',  emoji: '🌸' },
  { branchChar: '巳', gregorian: 5,  name: 'May',       season: 'Summer',  emoji: '☀️' },
  { branchChar: '午', gregorian: 6,  name: 'June',      season: 'Summer',  emoji: '☀️' },
  { branchChar: '未', gregorian: 7,  name: 'July',      season: 'Summer',  emoji: '☀️' },
  { branchChar: '申', gregorian: 8,  name: 'August',    season: 'Autumn',  emoji: '🍂' },
  { branchChar: '酉', gregorian: 9,  name: 'September', season: 'Autumn',  emoji: '🍂' },
  { branchChar: '戌', gregorian: 10, name: 'October',   season: 'Autumn',  emoji: '🍂' },
  { branchChar: '亥', gregorian: 11, name: 'November',  season: 'Winter',  emoji: '❄️' },
  { branchChar: '子', gregorian: 12, name: 'December',  season: 'Winter',  emoji: '❄️' },
  { branchChar: '丑', gregorian: 1,  name: 'January',   season: 'Winter',  emoji: '❄️' },
];

const ELEMENT_KEYS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// Five element controlling relationships (克)
const CONTROLS: Record<string, string> = {
  Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
};

const SEASON_EMOJI: Record<string, string> = {
  Spring: '🌸', Summer: '☀️', Autumn: '🍂', Winter: '❄️',
};

const MONTH_SEASON_MAP: Record<string, string> = {};
BAZI_MONTH_ORDER.forEach(m => { MONTH_SEASON_MAP[m.branchChar] = m.season; });

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function emptyDist(): ElementDist {
  return { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
}

function cloneDist(d: ElementDist): ElementDist {
  return { ...d };
}

function normalizeDist(d: ElementDist): ElementDist {
  const total = ELEMENT_KEYS.reduce((sum, k) => sum + d[k], 0);
  if (total <= 0) return { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 };
  const result = emptyDist();
  ELEMENT_KEYS.forEach(k => { result[k] = (d[k] / total) * 100; });
  return result;
}

function parsePillarString(ganZhi: string): { stem: string; branch: string } {
  return { stem: ganZhi[0], branch: ganZhi[1] };
}

function stemInfo(char: string) {
  return STEMS[char] || { element: 'Earth', polarity: 'Yang', english: 'Unknown', pinyin: '' };
}

function branchInfo(char: string) {
  return BRANCHES[char] || { animal: 'Unknown', element: 'Earth', season: 'Spring' };
}

// ============================================================================
// PILLAR COMPUTATION (using lunar-javascript)
// ============================================================================

/**
 * Get year pillar for a given Gregorian year.
 */
export function getYearPillar(year: number): PillarInfo {
  try {
    const solar = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
    const lunar = solar.getLunar();
    const ganZhi = lunar.getYearInGanZhiExact();
    const { stem, branch } = parsePillarString(ganZhi);
    const si = stemInfo(stem);
    const bi = branchInfo(branch);
    return {
      stem, branch,
      stemElement: si.element,
      branchAnimal: bi.animal,
      stemEnglish: si.english,
    };
  } catch {
    return { stem: '甲', branch: '子', stemElement: 'Wood', branchAnimal: 'Rat', stemEnglish: 'Yang Wood' };
  }
}

/**
 * Get all 12 monthly pillars for a given year.
 * BaZi months run 寅 (Feb) through 丑 (Jan of next year).
 */
export function getMonthPillars(year: number): PillarInfo[] {
  return BAZI_MONTH_ORDER.map((m) => {
    const actualYear = m.gregorian === 1 ? year + 1 : year;
    try {
      const solar = Solar.fromYmdHms(actualYear, m.gregorian, 15, 12, 0, 0);
      const lunar = solar.getLunar();
      const ganZhi = lunar.getMonthInGanZhiExact();
      const { stem, branch } = parsePillarString(ganZhi);
      const si = stemInfo(stem);
      const bi = branchInfo(branch);
      return {
        stem, branch,
        stemElement: si.element,
        branchAnimal: bi.animal,
        stemEnglish: si.english,
      };
    } catch {
      return {
        stem: '甲', branch: m.branchChar,
        stemElement: 'Wood',
        branchAnimal: branchInfo(m.branchChar).animal,
        stemEnglish: 'Yang Wood',
      };
    }
  });
}

// ============================================================================
// 1/11 + 10/11 INCOMING PILLAR DECOMPOSITION
// ============================================================================

/**
 * Decompose an incoming pillar (year or month) into raw element weights.
 *
 * Heavenly Stem = 1/11 of pillar weight (~9.09%)
 * Earthly Branch = 10/11 of pillar weight (~90.91%)
 *   Branch distributed via HIDDEN_STEMS percentages.
 *
 * @param stemChar  - Chinese character for stem (e.g. '丙')
 * @param branchChar - Chinese character for branch (e.g. '午')
 * @param totalWeight - Total weight for this pillar (20 for year, 10 for month)
 * @returns Raw element weights (NOT normalized to 100%)
 */
export function decomposeIncomingPillar(
  stemChar: string,
  branchChar: string,
  _totalWeight?: number          // kept for signature compat; internally uses 100%
): { elements: ElementDist; steps: string[] } {
  const elements = emptyDist();
  const steps: string[] = [];

  const stemPct = 100 / 11;       // 9.09%
  const branchPct = (100 * 10) / 11; // 90.91%

  // Stem contribution
  const si = stemInfo(stemChar);
  elements[si.element as ElementName] += stemPct;
  steps.push(
    `Stem ${stemChar} (${si.english}): 1/11 of 100% = ${stemPct.toFixed(2)}% → ${si.element}`
  );

  // Branch hidden stems
  const hiddenStems = HIDDEN_STEMS[branchChar] || [];
  steps.push(`Branch ${branchChar} (${branchInfo(branchChar).animal}) Hidden Stems — 10/11 of 100% = ${branchPct.toFixed(2)}%:`);
  hiddenStems.forEach((hs: { stem: string; pct: number; type: string }) => {
    const hsStem = stemInfo(hs.stem);
    const contribution = branchPct * (hs.pct / 100);
    elements[hsStem.element as ElementName] += contribution;
    steps.push(
      `  ${hs.stem} ${hsStem.english} (${hs.pct}% ${hs.type}): ${branchPct.toFixed(2)}% × ${hs.pct}% = ${contribution.toFixed(2)}% → ${hsStem.element}`
    );
  });

  return { elements, steps };
}

// ============================================================================
// SEASONAL ADJUSTMENT FOR INCOMING ENERGY
// ============================================================================

/**
 * Apply seasonal multiplier to incoming element contributions.
 * Maps season name to the month branch for getSeasonalWeights().
 */
function applySeasonalToIncoming(
  incoming: ElementDist,
  monthBranch: string
): { adjusted: ElementDist; steps: string[] } {
  const weights = getSeasonalWeights(monthBranch);
  const adjusted = emptyDist();
  const steps: string[] = [];

  // Map lowercase keys from getSeasonalWeights to our capitalized keys
  const wMap: Record<ElementName, number> = {
    Wood: (weights as any).wood ?? 1.0,
    Fire: (weights as any).fire ?? 1.0,
    Earth: (weights as any).earth ?? 1.0,
    Metal: (weights as any).metal ?? 1.0,
    Water: (weights as any).water ?? 1.0,
  };

  ELEMENT_KEYS.forEach(k => {
    adjusted[k] = incoming[k] * wMap[k];
    if (incoming[k] > 0.01) {
      steps.push(`  ${k}: ${incoming[k].toFixed(2)} × ${wMap[k].toFixed(1)} = ${adjusted[k].toFixed(2)}`);
    }
  });

  return { adjusted, steps };
}

// ============================================================================
// CLASH / HARM / PUNISHMENT DETECTION
// ============================================================================

/**
 * Detect all interactions between a set of branches (natal + incoming).
 */
export function detectInteractions(
  natalBranches: Record<string, string>,   // { year: '午', month: '寅', day: '申', hour: '子' }
  yearBranch: string,
  monthBranch: string,
  daYunBranch?: string   // Optional Da Yun (大運) earthly branch
): InteractionHit[] {
  const hits: InteractionHit[] = [];

  // Build all branch entries including incoming
  const allBranches: { label: string; branch: string }[] = [
    ...Object.entries(natalBranches).map(([k, v]) => ({ label: `Natal ${k}`, branch: v })),
    { label: 'Year Pillar', branch: yearBranch },
    { label: 'Month Pillar', branch: monthBranch },
    ...(daYunBranch ? [{ label: 'Da Yun', branch: daYunBranch }] : []),
  ];

  // Check all pairs
  for (let i = 0; i < allBranches.length; i++) {
    for (let j = i + 1; j < allBranches.length; j++) {
      const a = allBranches[i];
      const b = allBranches[j];

      // Skip natal-natal interactions (they are permanent, not incoming)
      const aIsNatal = a.label.startsWith('Natal');
      const bIsNatal = b.label.startsWith('Natal');
      if (aIsNatal && bIsNatal) continue;

      // Clash
      if (doTheyClash(a.branch, b.branch)) {
        const def = getClashDefinition(a.branch, b.branch);
        hits.push({
          type: 'clash',
          branch1: a.branch, branch2: b.branch,
          pillar1Label: a.label, pillar2Label: b.label,
          nature: def?.nature || 'Clash',
          effect: def?.effect || `${a.branch}${b.branch}冲`,
        });
      }

      // Harm
      if (doTheyHarm(a.branch, b.branch)) {
        const def = getHarmDefinition(a.branch, b.branch);
        hits.push({
          type: 'harm',
          branch1: a.branch, branch2: b.branch,
          pillar1Label: a.label, pillar2Label: b.label,
          nature: def?.nature || 'Harm',
          effect: def?.effect || `${a.branch}${b.branch}害`,
        });
      }
    }
  }

  return hits;
}

/**
 * Apply clash/harm effects to element distribution.
 * Clashes reduce the clashed elements; harms apply minor friction.
 */
function applyInteractionEffects(
  dist: ElementDist,
  interactions: InteractionHit[]
): { adjusted: ElementDist; steps: string[] } {
  const result = cloneDist(dist);
  const steps: string[] = [];

  for (const hit of interactions) {
    const b1El = branchInfo(hit.branch1).element as ElementName;
    const b2El = branchInfo(hit.branch2).element as ElementName;

    if (hit.type === 'clash') {
      // Clash: reduce both clashing elements, boost the controlling element
      const factor = 0.85;
      result[b1El] *= factor;
      result[b2El] *= factor;
      // The element that controls gets a small boost
      const controller1 = CONTROLS[b1El] ? b1El : undefined;
      if (controller1 && CONTROLS[controller1] === b2El) {
        // b1 controls b2 → b1 gains slightly
        result[b1El] *= 1.05;
      }
      steps.push(
        `⚔️ Clash ${hit.branch1}${hit.branch2}冲 (${hit.pillar1Label} ↔ ${hit.pillar2Label}): ${b1El} ×${factor}, ${b2El} ×${factor}`
      );
    } else if (hit.type === 'harm') {
      // Harm: minor friction on both elements
      const factor = 0.93;
      result[b1El] *= factor;
      result[b2El] *= factor;
      steps.push(
        `⚠️ Harm ${hit.branch1}${hit.branch2}害 (${hit.pillar1Label} ↔ ${hit.pillar2Label}): ${b1El} ×${factor}, ${b2El} ×${factor}`
      );
    } else if (hit.type === 'punishment') {
      const factor = 0.90;
      result[b1El] *= factor;
      steps.push(
        `🔺 Punishment ${hit.branch1}刑 (${hit.pillar1Label} ↔ ${hit.pillar2Label}): ${b1El} ×${factor}`
      );
    }
  }

  return { adjusted: result, steps };
}

// ============================================================================
// DANGER LEVEL ASSESSMENT
// ============================================================================

function assessDanger(interactions: InteractionHit[], postClash: ElementDist): { level: 'safe' | 'caution' | 'warning' | 'danger'; score: number; breakdown: string[] } {
  let score = 0;
  const breakdown: string[] = [];

  // Interaction-based danger
  for (const hit of interactions) {
    if (hit.type === 'clash') {
      score += 30;
      breakdown.push(`Clash ${hit.branch1}${hit.branch2}: +30 pts`);
    } else if (hit.type === 'harm') {
      score += 15;
      breakdown.push(`Harm ${hit.branch1}${hit.branch2}: +15 pts`);
    } else if (hit.type === 'punishment') {
      score += 20;
      breakdown.push(`Punishment ${hit.branch1}${hit.branch2}: +20 pts`);
    }
  }
  if (interactions.length === 0) {
    breakdown.push('No interactions: +0 pts');
  }

  // Imbalance-based danger
  const maxEl = Math.max(...ELEMENT_KEYS.map(k => postClash[k]));
  const minEl = Math.min(...ELEMENT_KEYS.map(k => postClash[k]));
  const maxKey = ELEMENT_KEYS.find(k => postClash[k] === maxEl) || '';
  const minKey = ELEMENT_KEYS.find(k => postClash[k] === minEl) || '';
  const spread = maxEl - minEl;
  if (spread > 30) {
    score += 20;
    breakdown.push(`Spread ${maxKey}(${maxEl.toFixed(1)}%) − ${minKey}(${minEl.toFixed(1)}%) = ${spread.toFixed(1)}% (>30%): +20 pts`);
  } else if (spread > 20) {
    score += 10;
    breakdown.push(`Spread ${maxKey}(${maxEl.toFixed(1)}%) − ${minKey}(${minEl.toFixed(1)}%) = ${spread.toFixed(1)}% (>20%): +10 pts`);
  } else {
    breakdown.push(`Spread ${spread.toFixed(1)}% (≤20%): +0 pts`);
  }

  // Any element below 8% is critical
  ELEMENT_KEYS.forEach(k => {
    if (postClash[k] < 8) {
      score += 15;
      breakdown.push(`${k} at ${postClash[k].toFixed(1)}% (<8% critical): +15 pts`);
    } else if (postClash[k] < 12) {
      score += 5;
      breakdown.push(`${k} at ${postClash[k].toFixed(1)}% (<12% low): +5 pts`);
    }
  });

  score = Math.min(100, score);

  let level: 'safe' | 'caution' | 'warning' | 'danger';
  if (score >= 60) level = 'danger';
  else if (score >= 40) level = 'warning';
  else if (score >= 20) level = 'caution';
  else level = 'safe';

  breakdown.push(`─────────────────────────`);
  breakdown.push(`TOTAL: ${score} pts → ${level.toUpperCase()} (safe <20, caution 20–39, warning 40–59, danger 60+)`);

  return { level, score, breakdown };
}

// ============================================================================
// CORE PIPELINE: COMPUTE MONTH SNAPSHOT
// ============================================================================

/**
 * Compute the full element analysis for a single month.
 *
 * @param natalBaseline    - User's seasonality-adjusted element %  (sums to 100)
 * @param natalBranches    - { year, month, day, hour } natal branch characters
 * @param yearPillar       - Incoming year pillar info
 * @param monthPillarInfo  - Incoming month pillar info
 * @param monthIndex       - 0..11 in BaZi order (寅=0)
 */
export function computeMonthSnapshot(
  natalBaseline: ElementDist,
  natalBranches: Record<string, string>,
  yearPillar: PillarInfo,
  monthPillarInfo: PillarInfo,
  monthIndex: number,
  dayMasterStem: string
): MonthSnapshot {
  const m = BAZI_MONTH_ORDER[monthIndex];
  const allSteps: CalculationStep[] = [];

  // ── Helpers ─────────────────────────────────────────────────────────────
  const fmtPts = (d: ElementDist) => {
    const total = ELEMENT_KEYS.reduce((s, k) => s + d[k], 0);
    return ELEMENT_KEYS.map(k => `${k}: ${d[k].toFixed(2)}`).join('  |  ') + `  =  ${total.toFixed(2)}`;
  };
  const fmtPct = (d: ElementDist) =>
    ELEMENT_KEYS.map(k => `${k}: ${d[k].toFixed(1)}%`).join('  |  ');

  /**
   * Compute a pillar's contribution as a fixed point budget.
   *
   * Pipeline:
   *   1. Decompose stem (1/11) + branch hidden stems (10/11) → raw element %
   *   2. Apply seasonal multipliers for this month
   *   3. Normalize to 100%
   *   4. Multiply by point budget → exact pts summing to budget
   */
  function computePillarContribution(
    stemChar: string, branchChar: string, budget: number, monthBranch: string
  ) {
    // 1. Decompose into percentages (always works in 100%)
    const decomp = decomposeIncomingPillar(stemChar, branchChar);
    const rawPct = normalizeDist(decomp.elements); // → sums to 100%

    // 2. Apply seasonal multipliers
    const seasonal = applySeasonalToIncoming(rawPct, monthBranch);

    // 3. Normalize adjusted percentages back to 100%
    const adjPct = normalizeDist(seasonal.adjusted);

    // 4. Convert percentages → points
    const pts = emptyDist();
    ELEMENT_KEYS.forEach(k => { pts[k] = (adjPct[k] / 100) * budget; });

    return { decomp, rawPct, seasonal, adjPct, pts };
  }

  // ── Step 1: Natal Baseline (100 points) ────────────────────────────────
  allSteps.push({
    label: 'Step 1: Natal Baseline (100 points)',
    detail: [
      'Your seasonality-adjusted element distribution from birth chart',
      '',
      fmtPts(natalBaseline) + ' pts',
      `────────────────────────────────`,
      `Running Total = 100 pts`,
    ].join('\n'),
    elements: cloneDist(natalBaseline),
  });

  // ── Step 2: Year Pillar (+20 points) ──────────────────────────────────
  const year = computePillarContribution(yearPillar.stem, yearPillar.branch, 20, m.branchChar);

  allSteps.push({
    label: `Step 2: Year Pillar ${yearPillar.stem}${yearPillar.branch} (${yearPillar.stemEnglish} ${yearPillar.branchAnimal}) — +20 pts`,
    detail: [
      '── 2a. Decompose Pillar into Element Percentages ──',
      ...year.decomp.steps,
      '',
      `Raw Element Percentages:`,
      `  ${fmtPct(year.rawPct)}`,
      '',
      `── 2b. Apply Seasonal Multipliers for ${m.season} (${m.name}) ──`,
      ...year.seasonal.steps,
      '',
      `── 2c. Normalize to 100% ──`,
      ...ELEMENT_KEYS.filter(k => year.adjPct[k] > 0.01).map(k =>
        `  ${k}: ${year.seasonal.adjusted[k].toFixed(2)} → ${year.adjPct[k].toFixed(1)}%`
      ),
      '',
      `── 2d. Apply × 20 pts Budget ──`,
      ...ELEMENT_KEYS.filter(k => year.pts[k] > 0.01).map(k =>
        `  ${k}: ${year.adjPct[k].toFixed(1)}% × 20 = ${year.pts[k].toFixed(2)} pts`
      ),
      '',
      `Year Contribution: ${fmtPts(year.pts)} pts`,
      `────────────────────────────────`,
      `Running Total = 100 + 20 = 120 pts`,
    ].join('\n'),
    elements: cloneDist(year.pts),
  });

  // ── Step 3: Month Pillar (+10 points) ─────────────────────────────────
  const month = computePillarContribution(monthPillarInfo.stem, monthPillarInfo.branch, 10, m.branchChar);

  allSteps.push({
    label: `Step 3: Month Pillar ${monthPillarInfo.stem}${monthPillarInfo.branch} (${monthPillarInfo.stemEnglish} ${monthPillarInfo.branchAnimal}) — +10 pts`,
    detail: [
      '── 3a. Decompose Pillar into Element Percentages ──',
      ...month.decomp.steps,
      '',
      `Raw Element Percentages:`,
      `  ${fmtPct(month.rawPct)}`,
      '',
      `── 3b. Apply Seasonal Multipliers for ${m.season} (${m.name}) ──`,
      ...month.seasonal.steps,
      '',
      `── 3c. Normalize to 100% ──`,
      ...ELEMENT_KEYS.filter(k => month.adjPct[k] > 0.01).map(k =>
        `  ${k}: ${month.seasonal.adjusted[k].toFixed(2)} → ${month.adjPct[k].toFixed(1)}%`
      ),
      '',
      `── 3d. Apply × 10 pts Budget ──`,
      ...ELEMENT_KEYS.filter(k => month.pts[k] > 0.01).map(k =>
        `  ${k}: ${month.adjPct[k].toFixed(1)}% × 10 = ${month.pts[k].toFixed(2)} pts`
      ),
      '',
      `Month Contribution: ${fmtPts(month.pts)} pts`,
      `────────────────────────────────`,
      `Running Total = 120 + 10 = 130 pts`,
    ].join('\n'),
    elements: cloneDist(month.pts),
  });

  // ── Step 4: Pool (130 pts) → Normalize to 100% ───────────────────────
  const pool = emptyDist();
  ELEMENT_KEYS.forEach(k => {
    pool[k] = natalBaseline[k] + year.pts[k] + month.pts[k];
  });
  const preClash = normalizeDist(pool);

  allSteps.push({
    label: 'Step 4: Pool (130 pts) → Normalize to 100%',
    detail: [
      `Natal (100) + Year (20) + Month (10) = 130 pts`,
      '',
      ...ELEMENT_KEYS.map(k =>
        `  ${k}: ${natalBaseline[k].toFixed(2)} + ${year.pts[k].toFixed(2)} + ${month.pts[k].toFixed(2)} = ${pool[k].toFixed(2)} pts → ${preClash[k].toFixed(1)}%`
      ),
      '',
      `────────────────────────────────`,
      `Pre-Clash Distribution: ${fmtPct(preClash)}`,
    ].join('\n'),
    elements: cloneDist(preClash),
  });

  // ── Step 5: Detect Interactions ────────────────────────────────────────
  const interactions = detectInteractions(natalBranches, yearPillar.branch, monthPillarInfo.branch);

  if (interactions.length > 0) {
    allSteps.push({
      label: 'Step 5: Branch Interactions Detected',
      detail: interactions.map(h => `${h.type.toUpperCase()}: ${h.branch1}${h.branch2} (${h.pillar1Label} ↔ ${h.pillar2Label}) — ${h.nature}`).join('\n'),
    });
  } else {
    allSteps.push({
      label: 'Step 5: No Branch Interactions',
      detail: 'No clashes, harms, or punishments between incoming and natal branches this month.',
    });
  }

  // ── Step 6: Apply Interaction Effects → Post-Clash ─────────────────────
  const { adjusted: postClashRaw, steps: interactionSteps } = applyInteractionEffects(preClash, interactions);
  const postClash = normalizeDist(postClashRaw);

  if (interactionSteps.length > 0) {
    allSteps.push({
      label: 'Step 6: Post-Clash Distribution',
      detail: interactionSteps.join('\n'),
      elements: cloneDist(postClash),
    });
  } else {
    allSteps.push({
      label: 'Step 6: Post-Clash Distribution (no changes)',
      detail: 'No interactions to adjust — distribution unchanged.',
      elements: cloneDist(postClash),
    });
  }

  // ── Step 7: Yong Shen (用神) Analysis + Stone Recommendations ──────────
  const deficientElements: { element: ElementName; deficit: number }[] = [];
  ELEMENT_KEYS.forEach(k => {
    const deficit = 20 - postClash[k];
    if (deficit > 0) {
      deficientElements.push({ element: k, deficit });
    }
  });
  deficientElements.sort((a, b) => b.deficit - a.deficit);

  // Use Yong Shen logic gate instead of naive deficit filling
  const yongShen = calculateSurvivalKit(postClash, dayMasterStem);

  const step7Lines: string[] = [];
  step7Lines.push('Deficiency Analysis:');
  if (deficientElements.length > 0) {
    deficientElements.forEach(d => {
      step7Lines.push(`  ${d.element}: ${d.deficit.toFixed(1)}% below balanced (20%)`);
    });
  } else {
    step7Lines.push('  All elements above 20% — well balanced');
  }

  step7Lines.push('');
  step7Lines.push(`Yong Shen (用神) Assessment: ${yongShen.status === 'critical_imbalance' ? 'CRITICAL IMBALANCE DETECTED' : 'Standard balancing'}`);
  if (yongShen.threat) {
    step7Lines.push(`  Threat: ${yongShen.threat} at ${yongShen.threatPercentage?.toFixed(1)}%`);
    step7Lines.push(`  Forbidden: ${yongShen.forbidden.join(', ')} (${yongShen.forbidden[1]} feeds ${yongShen.threat})`);
    step7Lines.push(`  Useful elements: ${yongShen.usefulElements.join(', ')}`);
  }
  step7Lines.push(`  Polarity: ${yongShen.preferredPolarity} — ${yongShen.polarityReason}`);
  if (yongShen.recommendedStones.length > 0) {
    step7Lines.push(`  Stones: ${yongShen.recommendedStones.map(s => `${s.stone.name} (${s.stone.polarity} ${s.stone.element})`).join(', ')}`);
  }

  allSteps.push({
    label: 'Step 7: Yong Shen (用神) Analysis & Stone Prescriptions',
    detail: step7Lines.join('\n'),
    elements: cloneDist(postClash),
  });

  // ── Danger Assessment ──────────────────────────────────────────────────
  const { level: dangerLevel, score: dangerScore, breakdown: dangerBreakdown } = assessDanger(interactions, postClash);

  allSteps.push({
    label: `Step 8: Danger Assessment → ${dangerLevel.toUpperCase()} (${dangerScore} pts)`,
    detail: dangerBreakdown.join('\n'),
    elements: cloneDist(postClash),
  });

  return {
    monthIndex,
    gregorianMonth: m.gregorian,
    monthName: m.name,
    monthStem: monthPillarInfo.stem,
    monthBranch: monthPillarInfo.branch,
    branchAnimal: monthPillarInfo.branchAnimal,
    season: m.season,
    seasonEmoji: m.emoji,
    natalBaseline: cloneDist(natalBaseline),
    yearContribution: cloneDist(year.pts),
    monthContribution: cloneDist(month.pts),
    preClash,
    postClash,
    interactions,
    steps: allSteps,
    dangerLevel,
    dangerScore,
    deficientElements,
    recommendedStones: yongShen.recommendedStones,
    yongShen,
  };
}

// ============================================================================
// YEAR MATRIX
// ============================================================================

/**
 * Compute the full 12-month year matrix.
 *
 * @param dayMasterStem - Chinese character of Day Master (e.g. '丁' for Yin Fire)
 */
export function computeYearMatrix(
  natalBaseline: ElementDist,
  natalBranches: Record<string, string>,
  year: number,
  dayMasterStem: string
): YearMatrix {
  const yearPillar = getYearPillar(year);
  const monthPillars = getMonthPillars(year);

  // Compute all 12 months
  const months: MonthSnapshot[] = monthPillars.map((mp, idx) =>
    computeMonthSnapshot(natalBaseline, natalBranches, yearPillar, mp, idx, dayMasterStem)
  );

  // Group by season
  const seasonGroups: Record<string, MonthSnapshot[]> = {};
  months.forEach(m => {
    if (!seasonGroups[m.season]) seasonGroups[m.season] = [];
    seasonGroups[m.season].push(m);
  });

  const seasons: SeasonSummary[] = ['Spring', 'Summer', 'Autumn', 'Winter'].map(s => {
    const sMonths = seasonGroups[s] || [];
    const avg = emptyDist();
    if (sMonths.length > 0) {
      ELEMENT_KEYS.forEach(k => {
        avg[k] = sMonths.reduce((sum, m) => sum + m.postClash[k], 0) / sMonths.length;
      });
    }
    return {
      season: s,
      emoji: SEASON_EMOJI[s] || '',
      months: sMonths,
      average: avg,
      avgDangerScore: sMonths.length > 0
        ? sMonths.reduce((sum, m) => sum + m.dangerScore, 0) / sMonths.length
        : 0,
    };
  });

  // Year average
  const yearAverage = emptyDist();
  ELEMENT_KEYS.forEach(k => {
    yearAverage[k] = months.reduce((sum, m) => sum + m.postClash[k], 0) / months.length;
  });

  // Danger months (warning or danger)
  const dangerMonths = months.filter(m => m.dangerLevel === 'warning' || m.dangerLevel === 'danger');

  // Year-round stone recommendations using Yong Shen logic on year average
  const yearYongShen = calculateSurvivalKit(yearAverage, dayMasterStem, 4);
  const yearStones = yearYongShen.recommendedStones;

  // Journey summary narrative
  const si = stemInfo(yearPillar.stem);
  const bi = branchInfo(yearPillar.branch);
  const clashCount = months.reduce((sum, m) => sum + m.interactions.filter(i => i.type === 'clash').length, 0);
  const harmCount = months.reduce((sum, m) => sum + m.interactions.filter(i => i.type === 'harm').length, 0);
  const worstMonth = [...months].sort((a, b) => b.dangerScore - a.dangerScore)[0];
  const bestMonth = [...months].sort((a, b) => a.dangerScore - b.dangerScore)[0];

  let journeySummary = `In the Year of the ${si.english} ${bi.animal} (${yearPillar.stem}${yearPillar.branch}), `;
  if (clashCount > 0 || harmCount > 0) {
    journeySummary += `the road ahead has ${clashCount} clash${clashCount !== 1 ? 'es' : ''} and ${harmCount} harm${harmCount !== 1 ? 's' : ''} along the way. `;
  } else {
    journeySummary += `the road ahead is relatively smooth with no major clashes. `;
  }
  if (worstMonth && worstMonth.dangerScore > 30) {
    journeySummary += `Watch out for ${worstMonth.monthName} — your most challenging month. `;
  }
  if (bestMonth) {
    journeySummary += `${bestMonth.monthName} looks like your smoothest stretch.`;
  }
  if (yearYongShen.status === 'critical_imbalance' && yearYongShen.threat) {
    journeySummary += ` Your chart faces critical ${yearYongShen.threat} dominance this year.`;
    journeySummary += ` Avoid ${yearYongShen.forbidden.join(' and ')} stones.`;
  }
  if (yearStones.length > 0) {
    journeySummary += ` Pack your survival kit: ${yearStones.map(s => s.stone.name).join(', ')}.`;
  }

  return {
    year,
    yearPillar,
    months,
    seasons,
    dangerMonths,
    yearAverage,
    yearStones,
    yearYongShen,
    journeySummary,
  };
}
