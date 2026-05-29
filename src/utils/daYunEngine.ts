/**
 * ============================================================================
 * DA YUN ENGINE — 大運 Major Luck Pillar Calculator
 * ============================================================================
 *
 * Computes the 大運 (Dà Yùn) sequence entirely client-side using lunar-javascript.
 * No backend required.
 *
 * Classical rules implemented:
 *  1. Direction: Yang male / Yin female = forward (順行)
 *                Yin male / Yang female = backward (逆行)
 *  2. Onset age (起運歲數): count solar days from birth to the nearest
 *     節 (Jié / solar term boundary), divide by 3. Each day = 1 year of luck.
 *  3. Each 大運 pillar = 10 years.  The sequence walks forward or backward
 *     through the 60 Jiǎzǐ cycle from the birth Month Pillar.
 *  4. Da Yun Qi contribution: treated as a pillar with 11 pts
 *     (stem=1pt, branch=10pts — same as natal pillars).
 *     Da Yun is external climate — it does NOT go through clashes,
 *     combinations, or transformations. Only seasonality is applied.
 *
 * Integration points with qiEngine.ts:
 *  - computeQiMonthSnapshot() gains an optional `daYunPillar` parameter
 *  - Da Yun Qi is an external layer combined AFTER the natal pipeline
 *
 * Created: March 2026
 * ============================================================================
 */
import { Solar } from 'lunar-javascript';
import { STEMS, BRANCHES, HIDDEN_STEMS } from './baziEngine';
import { getSeasonalWeights } from './baziSeasonality';

// ============================================================================
// TYPES
// ============================================================================

export interface DaYunPillar {
  index: number;          // 0-based sequence position
  stem: string;           // Heavenly Stem char e.g. 壬
  branch: string;         // Earthly Branch char e.g. 子
  stemEnglish: string;    // "Yang Water"
  branchAnimal: string;   // "Rat"
  element: string;        // Stem element: "Water"
  ageStart: number;       // Inclusive age when this pillar begins
  ageEnd: number;         // Inclusive age when this pillar ends (ageStart + 9)
  yearStart: number;      // Gregorian year this pillar begins
  yearEnd: number;        // Gregorian year this pillar ends
  isCurrent: boolean;     // True if today falls within this pillar
  yearsRemaining: number; // Years left in this pillar (0 if not current)
}

export interface DaYunResult {
  direction: 'forward' | 'backward';
  directionChinese: '順行' | '逆行';
  onsetAge: number;           // Fractional years e.g. 3.5
  onsetAgeYears: number;      // Floor integer
  onsetAgeMonths: number;     // Remainder in months
  pillars: DaYunPillar[];
  currentPillar: DaYunPillar | null;
  nextPillar: DaYunPillar | null;
}

export interface DaYunQiContribution {
  qi: Record<'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water', number>;
  steps: string[];
  pillar: DaYunPillar;
  budget: number; // always DA_YUN_BUDGET
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Da Yun point budget. Same as any other pillar:
 *   stem = 1 pt, branch = 10 pts → total 11 pts.
 * Da Yun is treated identically to natal pillars in point allocation.
 * It does NOT go through clashes, combinations, or transformations —
 * those belong only to the natal pipeline. Da Yun is external climate.
 */
export const DA_YUN_BUDGET = 11;

const ELEMENT_KEYS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
type ElementName = typeof ELEMENT_KEYS[number];

// 60 Jiǎzǐ cycle order (甲子 through 癸亥)
const SIXTY_CYCLE: string[] = [
  '甲子','乙丑','丙寅','丁卯','戊辰','己巳','庚午','辛未','壬申','癸酉',
  '甲戌','乙亥','丙子','丁丑','戊寅','己卯','庚辰','辛巳','壬午','癸未',
  '甲申','乙酉','丙戌','丁亥','戊子','己丑','庚寅','辛卯','壬辰','癸巳',
  '甲午','乙未','丙申','丁酉','戊戌','己亥','庚子','辛丑','壬寅','癸卯',
  '甲辰','乙巳','丙午','丁未','戊申','己酉','庚戌','辛亥','壬子','癸丑',
  '甲寅','乙卯','丙辰','丁巳','戊午','己未','庚申','辛酉','壬戌','癸亥',
];

// ============================================================================
// HELPERS
// ============================================================================

function emptyQi() {
  return { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
}

function stemElement(char: string): ElementName {
  return ((STEMS[char] as any)?.element || 'Earth') as ElementName;
}

function stemEnglish(char: string): string {
  return (STEMS[char] as any)?.english || 'Unknown';
}

function stemPolarity(char: string): 'Yang' | 'Yin' {
  return ((STEMS[char] as any)?.polarity || 'Yang') as 'Yang' | 'Yin';
}

function branchAnimal(char: string): string {
  return (BRANCHES[char] as any)?.animal || 'Unknown';
}

/** Find a ganZhi string in the 60-cycle and return its 0-based index */
function cycleIndex(ganZhi: string): number {
  const idx = SIXTY_CYCLE.indexOf(ganZhi);
  if (idx === -1) {
    // Fallback: match stem+branch separately
    const s = ganZhi[0];
    const b = ganZhi[1];
    const si = Object.keys(STEMS).indexOf(s);
    const bi = Object.keys(BRANCHES).indexOf(b);
    if (si >= 0 && bi >= 0) return (si * 12 + bi) % 60;
    return 0;
  }
  return idx;
}

/**
 * Get the ganZhi pillar N steps forward (positive) or backward (negative)
 * from a starting ganZhi.
 */
function advanceCycle(ganZhi: string, steps: number): string {
  const start = cycleIndex(ganZhi);
  const next = ((start + steps) % 60 + 60) % 60;
  return SIXTY_CYCLE[next];
}

// ============================================================================
// ONSET AGE CALCULATION
// ============================================================================

/**
 * Calculate Da Yun onset age.
 *
 * Classical method: count calendar days between birth date and the next
 * (forward) or previous (backward) 節 (solar term entry).
 * Each 3 days = 1 year of luck period.
 *
 * We use lunar-javascript's Solar term data for precision.
 *
 * @param birthDateStr  ISO date string "YYYY-MM-DD"
 * @param birthTimeStr  "HH:MM" 24h
 * @param direction     'forward' | 'backward'
 * @returns fractional years (e.g. 3.47)
 */
function calcOnsetAge(
  birthDateStr: string,
  birthTimeStr: string,
  direction: 'forward' | 'backward'
): number {
  try {
    const [y, m, d] = birthDateStr.split('-').map(Number);
    const [hh, mm] = (birthTimeStr || '12:00').split(':').map(Number);
    const birthMs = new Date(y, m - 1, d, hh, mm, 0).getTime();

    // Walk ±180 days to find the nearest 節 boundary
    // Solar terms occur roughly every 15 days; check day by day
    let targetMs: number | null = null;
    const step = direction === 'forward' ? 1 : -1;

    for (let delta = 1; delta <= 180; delta++) {
      const checkDate = new Date(birthMs + step * delta * 86400000);
      const checkSolar = Solar.fromYmdHms(
        checkDate.getFullYear(),
        checkDate.getMonth() + 1,
        checkDate.getDate(),
        12, 0, 0
      );
      try {
        // lunar-javascript: getSolarTerms() returns terms in the solar month
        const terms = (checkSolar as any).getSolarTerms?.() || [];
        if (terms.length > 0) {
          targetMs = checkDate.getTime();
          break;
        }
        // Alternative: detect month pillar change (Jié boundary)
        const lunar = checkSolar.getLunar();
        const prevDate = new Date(checkDate.getTime() - step * 86400000);
        const prevSolar = Solar.fromYmdHms(
          prevDate.getFullYear(),
          prevDate.getMonth() + 1,
          prevDate.getDate(),
          12, 0, 0
        );
        const prevLunar = prevSolar.getLunar();
        const curMonth = (lunar as any).getMonthInGanZhiExact?.() ||
                         (lunar as any).getMonthInGanZhi?.() || '';
        const prevMonth = (prevLunar as any).getMonthInGanZhiExact?.() ||
                          (prevLunar as any).getMonthInGanZhi?.() || '';
        if (curMonth !== prevMonth && curMonth.length === 2) {
          targetMs = checkDate.getTime();
          break;
        }
      } catch {
        // continue
      }
    }

    if (!targetMs) {
      // Fallback: estimate 3 years onset (common average)
      return 3.0;
    }

    const daysDiff = Math.abs(targetMs - birthMs) / 86400000;
    // 3 solar days = 1 year of luck
    return daysDiff / 3;
  } catch {
    return 3.0;
  }
}

// ============================================================================
// CORE CALCULATION
// ============================================================================

/**
 * Calculate the complete Da Yun sequence for a BaZi chart.
 *
 * @param chart          Result from calculateBaZi() — must have chart.pillars
 * @param birthDateStr   "YYYY-MM-DD"
 * @param birthTimeStr   "HH:MM"
 * @param currentYear    Gregorian year to evaluate "current" pillar (default: today)
 * @param gender         'male' | 'female' — if omitted, falls back to chart.gender
 * @param pillarCount    How many 大運 pillars to generate (default: 8)
 */
export function calculateDaYun(
  chart: any,
  birthDateStr: string,
  birthTimeStr = '12:00',
  currentYear = new Date().getFullYear(),
  gender?: string,
  pillarCount = 8
): DaYunResult {
  const pillars = chart?.pillars;
  if (!pillars || pillars.length < 4) {
    return buildEmptyResult();
  }

  // --- Determine direction ---
  // Yang year stem + male  = forward (順行)
  // Yang year stem + female = backward (逆行)
  // Yin year stem  + male  = backward (逆行)
  // Yin year stem  + female = forward (順行)
  const yearStemChar = pillars[0].stem.char;
  const yearStemPol = stemPolarity(yearStemChar);
  const resolvedGender = gender || chart?.gender || 'male';
  const isMale = resolvedGender === 'male';
  const direction: 'forward' | 'backward' =
    (yearStemPol === 'Yang' && isMale) || (yearStemPol === 'Yin' && !isMale)
      ? 'forward'
      : 'backward';

  // --- Onset age ---
  const onsetFractional = calcOnsetAge(birthDateStr, birthTimeStr, direction);
  const onsetAgeYears = Math.floor(onsetFractional);
  const onsetAgeMonths = Math.round((onsetFractional - onsetAgeYears) * 12);

  // --- Build pillar sequence ---
  // Start from birth Month Pillar and walk in direction
  const monthPillarGanZhi = `${pillars[1].stem.char}${pillars[1].branch.char}`;
  const birthYear = parseInt(birthDateStr.split('-')[0], 10);
  const currentAge = currentYear - birthYear;

  // Ensure enough pillars are generated to cover currentYear, regardless of how
  // old the profile is (handles historical/test profiles and long-lived users).
  const pillarsNeeded = Math.max(
    pillarCount,
    Math.ceil((currentAge - Math.floor(onsetFractional)) / 10) + 2,
  );

  const result: DaYunPillar[] = [];
  for (let i = 0; i < pillarsNeeded; i++) {
    const steps = direction === 'forward' ? i + 1 : -(i + 1);
    const ganZhi = advanceCycle(monthPillarGanZhi, steps);
    const stemChar = ganZhi[0];
    const branchChar = ganZhi[1];
    // Math.floor ensures the pillar covers the onset year itself.
    // Math.round would push ageStart to 7 for onset 6.67y, creating a phantom
    // gap year before the first pillar — but Da Yun is continuous once started.
    const ageStart = Math.floor(onsetFractional + i * 10);
    const ageEnd = ageStart + 9;
    const yearStart = birthYear + ageStart;
    const yearEnd = birthYear + ageEnd;
    const isCurrent = currentAge >= ageStart && currentAge <= ageEnd;
    const yearsRemaining = isCurrent ? ageEnd - currentAge : 0;

    result.push({
      index: i,
      stem: stemChar,
      branch: branchChar,
      stemEnglish: stemEnglish(stemChar),
      branchAnimal: branchAnimal(branchChar),
      element: stemElement(stemChar),
      ageStart,
      ageEnd,
      yearStart,
      yearEnd,
      isCurrent,
      yearsRemaining,
    });
  }

  const currentPillar = result.find(p => p.isCurrent) || null;
  const nextIdx = currentPillar ? currentPillar.index + 1 : 0;
  const nextPillar = result[nextIdx] || null;

  return {
    direction,
    directionChinese: direction === 'forward' ? '順行' : '逆行',
    onsetAge: onsetFractional,
    onsetAgeYears,
    onsetAgeMonths,
    pillars: result,
    currentPillar,
    nextPillar,
  };
}

// ============================================================================
// QI CONTRIBUTION (fits into qiEngine pipeline)
// ============================================================================

/**
 * Compute the Da Yun Qi contribution.
 *
 * Da Yun pipeline (external climate — no violence):
 *   1. Stem Qi (1/11) + Branch hidden stems (10/11)
 *   2. Seasonality — based on Da Yun's OWN branch season
 *   3. Polarity — based on Da Yun's OWN stem Yin/Yang
 *   4. Normalize → multiply by DA_YUN_BUDGET
 *
 * @param daYunPillar         The active 大運 pillar object
 * @param currentMonthBranch  Branch char of the current BaZi month (kept for backward compat, unused)
 */
export function computeDaYunQi(
  daYunPillar: DaYunPillar,
  _currentMonthBranch?: string
): DaYunQiContribution {
  const steps: string[] = [];
  const budget = DA_YUN_BUDGET;
  const stemChar = daYunPillar.stem;
  const branchChar = daYunPillar.branch;

  // ── Step 1: Raw Qi in POINTS (stem=1pt, branch=10pts) ──
  const rawQi = emptyQi();

  const sEl = stemElement(stemChar);
  rawQi[sEl] += 1; // stem = 1 pt
  steps.push(
    `Stem ${stemChar} (${stemEnglish(stemChar)}): 1 pt → ${sEl}`
  );

  const hidden = (HIDDEN_STEMS as any)[branchChar] || [];
  steps.push(
    `Branch ${branchChar} (${branchAnimal(branchChar)}): 10 pts distributed:`
  );
  for (const hs of hidden) {
    const hsEl = stemElement(hs.stem);
    const pts = 10 * (hs.pct / 100);
    rawQi[hsEl] += pts;
    steps.push(`  ${hs.stem} ${stemEnglish(hs.stem)} (${hs.pct}%): ${pts.toFixed(3)} pts → ${hsEl}`);
  }

  // ── Step 2: Seasonality — Da Yun's OWN branch season ──
  const sw = getSeasonalWeights(branchChar) as any;
  const swMap: Record<ElementName, number> = {
    Wood: sw.wood ?? 1.0,
    Fire: sw.fire ?? 1.0,
    Earth: sw.earth ?? 1.0,
    Metal: sw.metal ?? 1.0,
    Water: sw.water ?? 1.0,
  };

  const seasonal = emptyQi();
  steps.push(`Seasonality (Da Yun branch ${branchChar} ${branchAnimal(branchChar)}):`);
  for (const k of ELEMENT_KEYS) {
    seasonal[k] = rawQi[k] * swMap[k];
    if (rawQi[k] > 0.001) {
      steps.push(`  ${k}: ${rawQi[k].toFixed(3)} × ${swMap[k].toFixed(1)} = ${seasonal[k].toFixed(3)}`);
    }
  }

  // ── Step 3: Polarity — Da Yun's OWN stem Yin/Yang ──
  const pol = stemPolarity(stemChar);
  const polMults: Record<ElementName, number> = pol === 'Yang'
    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
    : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };

  const polarized = emptyQi();
  steps.push(`Polarity (${pol} stem ${stemChar}):`);
  for (const k of ELEMENT_KEYS) {
    polarized[k] = seasonal[k] * polMults[k];
    if (seasonal[k] > 0.001) {
      steps.push(`  ${k}: ${seasonal[k].toFixed(3)} × ${polMults[k].toFixed(2)} = ${polarized[k].toFixed(3)}`);
    }
  }

  // ── Output: raw polarized Qi in points (no normalization) ──
  const qi = emptyQi();
  for (const k of ELEMENT_KEYS) {
    qi[k] = polarized[k];
  }

  const qiTotal = ELEMENT_KEYS.reduce((s, k) => s + qi[k], 0);
  steps.push('');
  steps.push(
    `Da Yun Qi (${stemChar}${branchChar}): ` +
    ELEMENT_KEYS.filter(k => qi[k] > 0.01).map(k => `${k}: ${qi[k].toFixed(2)}`).join(' | ')
  );
  steps.push(`Total = ${qiTotal.toFixed(2)} pts`);

  return { qi, steps, pillar: daYunPillar, budget };
}

// ============================================================================
// UTILITY
// ============================================================================

function buildEmptyResult(): DaYunResult {
  return {
    direction: 'forward',
    directionChinese: '順行',
    onsetAge: 3,
    onsetAgeYears: 3,
    onsetAgeMonths: 0,
    pillars: [],
    currentPillar: null,
    nextPillar: null,
  };
}

/**
 * Get a plain-language description of the Da Yun's relationship
 * to the Day Master — used in narrative generation.
 */
export function describeDaYunInfluence(
  daYunPillar: DaYunPillar,
  dayMasterElement: string,
  collapseMode: string
): string {
  const el = daYunPillar.element;
  const relationshipMap: Record<string, Record<string, string>> = {
    Wood:  { Wood: 'parallel (比肩/劫財)', Fire: 'output (食神/傷官)', Earth: 'wealth (正財/偏財)', Metal: 'pressure (正官/七殺)', Water: 'resource (正印/偏印)' },
    Fire:  { Wood: 'resource (正印/偏印)', Fire: 'parallel (比肩/劫財)', Earth: 'output (食神/傷官)', Metal: 'wealth (正財/偏財)', Water: 'pressure (正官/七殺)' },
    Earth: { Wood: 'pressure (正官/七殺)', Fire: 'resource (正印/偏印)', Earth: 'parallel (比肩/劫財)', Metal: 'output (食神/傷官)', Water: 'wealth (正財/偏財)' },
    Metal: { Wood: 'wealth (正財/偏財)', Fire: 'pressure (正官/七殺)', Earth: 'resource (正印/偏印)', Metal: 'parallel (比肩/劫財)', Water: 'output (食神/傷官)' },
    Water: { Wood: 'output (食神/傷官)', Fire: 'wealth (正財/偏財)', Earth: 'pressure (正官/七殺)', Metal: 'resource (正印/偏印)', Water: 'parallel (比肩/劫財)' },
  };

  const rel = relationshipMap[dayMasterElement]?.[el] || 'unknown relationship';
  let collapseNote = '';
  if (collapseMode === 'bi-polar' || collapseMode === 'drained') {
    collapseNote = ` During ${collapseMode} collapse, this ${el} decade ${
      ['Wood', 'Fire'].includes(el) ? 'amplifies the dominant pattern — proceed with caution'
      : el === 'Earth' ? 'acts as the classical bridge/mediator — highly stabilising'
      : 'may clash with the dominant flow — significant disruption possible'
    }.`;
  }

  return (
    `The current Da Yun brings ${daYunPillar.stemEnglish} ${daYunPillar.branchAnimal} energy ` +
    `(${daYunPillar.stem}${daYunPillar.branch}, ages ${daYunPillar.ageStart}–${daYunPillar.ageEnd}). ` +
    `For a ${dayMasterElement} Day Master this is a ${rel} decade.${collapseNote}`
  );
}
