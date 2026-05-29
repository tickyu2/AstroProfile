/**
 * ============================================================================
 * COMBINATION ENGINE — Classical BaZi Interactions
 * ============================================================================
 *
 * Professional-grade implementation of the five classical combination/void
 * mechanics that modify elemental Qi BEFORE clash processing:
 *
 *   1. Void / Emptiness   (空亡)  — weakens two branches based on Day Pillar
 *   2. Stem Combinations   (天干合) — Heavenly Stem pairings → element transform
 *   3. Branch Six Combos   (六合)  — Earthly Branch pairings → element transform
 *   4. Three Harmony       (三合局) — Branch triads → strong elemental surge
 *   5. Three Meetings      (三会局) — Seasonal branch triads → massive dominance
 *
 * Pipeline position:
 *   NTFQ → Void → Combos (Stem/Branch/SanHe/SanHui) → Clash → Sheng → ...
 *
 * Key classical rules:
 *   - Combinations can suppress clashes (合能解冲)
 *   - Void branches cannot combine, clash, or transform
 *   - Transformation requires seasonal support
 *   - Three Meetings overrides Three Harmony overrides Six Combo
 *
 * Created: March 2026
 * ============================================================================
 */

import { STEMS, BRANCHES } from './baziEngine';

// ============================================================================
// TYPES
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export interface QiDist {
  Wood: number; Fire: number; Earth: number; Metal: number; Water: number;
}

/** A stem or branch in context — knows which pillar it belongs to */
export interface ChartChar {
  char: string;        // Chinese character
  pillarLabel: string; // 'Year', 'Month', 'Day', 'Hour', 'Transit Year', 'Transit Month'
  isTransit: boolean;
}

/** Full context needed by the combination engine */
export interface CombinationContext {
  natalStems: ChartChar[];     // 4 natal stems
  natalBranches: ChartChar[];  // 4 natal branches
  transitStems: ChartChar[];   // year + month transit stems
  transitBranches: ChartChar[];// year + month transit branches
  currentMonthBranch: string;  // for season detection
  dayStem: string;             // for void calculation
  dayBranch: string;           // for void calculation
}

// ── Event types ──

export interface VoidEvent {
  branch: string;
  animal: string;
  pillarLabel: string;
  element: ElementName;
  qiReduction: number;
}

export interface CombinationEvent {
  type: 'stem-combo' | 'liu-he' | 'san-he' | 'san-hui';
  participants: { char: string; pillarLabel: string; element: ElementName }[];
  resultElement: ElementName;
  transformed: boolean;
  seasonSupported: boolean;
  voidBlocked: boolean;
  qiDelta: Partial<Record<ElementName, number>>;
  label: string;       // e.g. "甲+己 → Earth (transformed)"
  detail: string;      // longer explanation
  sourceLayer?: 'natal' | 'transit' | 'mixed'; // where the participants come from (computed by engine)
}

export interface CombinationEngineResult {
  // Void
  voidBranches: [string, string];        // the two void branch chars
  voidEvents: VoidEvent[];               // which chart branches are actually void
  // Combinations
  events: CombinationEvent[];
  // Clash suppression
  protectedBranches: Set<string>;        // branches involved in active combos
  // Qi
  preQi: QiDist;
  postQi: QiDist;
  totalDelta: QiDist;
}

// ============================================================================
// CONSTANTS — Classical Combination Tables
// ============================================================================

const ELEMENT_KEYS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

/** Stem index order for void calculation */
const STEM_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCH_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * Heavenly Stem Combinations (天干合)
 * Each pair of stems that are 5 positions apart combine.
 * The resulting element depends on classical theory.
 */
const STEM_COMBOS: Record<string, { pair: [string, string]; result: ElementName }> = {
  '甲己': { pair: ['甲', '己'], result: 'Earth' },
  '己甲': { pair: ['甲', '己'], result: 'Earth' },
  '乙庚': { pair: ['乙', '庚'], result: 'Metal' },
  '庚乙': { pair: ['乙', '庚'], result: 'Metal' },
  '丙辛': { pair: ['丙', '辛'], result: 'Water' },
  '辛丙': { pair: ['丙', '辛'], result: 'Water' },
  '丁壬': { pair: ['丁', '壬'], result: 'Wood' },
  '壬丁': { pair: ['丁', '壬'], result: 'Wood' },
  '戊癸': { pair: ['戊', '癸'], result: 'Fire' },
  '癸戊': { pair: ['戊', '癸'], result: 'Fire' },
};

/**
 * Earthly Branch Six Combinations (地支六合)
 */
const LIU_HE: Record<string, { pair: [string, string]; result: ElementName }> = {
  '子丑': { pair: ['子', '丑'], result: 'Earth' },
  '丑子': { pair: ['子', '丑'], result: 'Earth' },
  '寅亥': { pair: ['寅', '亥'], result: 'Wood' },
  '亥寅': { pair: ['寅', '亥'], result: 'Wood' },
  '卯戌': { pair: ['卯', '戌'], result: 'Fire' },
  '戌卯': { pair: ['卯', '戌'], result: 'Fire' },
  '辰酉': { pair: ['辰', '酉'], result: 'Metal' },
  '酉辰': { pair: ['辰', '酉'], result: 'Metal' },
  '巳申': { pair: ['巳', '申'], result: 'Water' },
  '申巳': { pair: ['巳', '申'], result: 'Water' },
  '午未': { pair: ['午', '未'], result: 'Fire' },
  '未午': { pair: ['午', '未'], result: 'Fire' },
};

/**
 * Three Harmony (三合局)
 * Each triad of branches forms a powerful elemental frame.
 */
const SAN_HE: { branches: [string, string, string]; result: ElementName }[] = [
  { branches: ['申', '子', '辰'], result: 'Water' },
  { branches: ['亥', '卯', '未'], result: 'Wood' },
  { branches: ['寅', '午', '戌'], result: 'Fire' },
  { branches: ['巳', '酉', '丑'], result: 'Metal' },
];

/**
 * Three Meetings (三会局)
 * Three consecutive seasonal branches — most powerful combination.
 */
const SAN_HUI: { branches: [string, string, string]; result: ElementName }[] = [
  { branches: ['寅', '卯', '辰'], result: 'Wood' },
  { branches: ['巳', '午', '未'], result: 'Fire' },
  { branches: ['申', '酉', '戌'], result: 'Metal' },
  { branches: ['亥', '子', '丑'], result: 'Water' },
];

/**
 * Season element mapping from month branch.
 * The four Earth months (辰未戌丑) support Earth transformations.
 */
const BRANCH_SEASON_ELEMENT: Record<string, ElementName> = {
  '寅': 'Wood',  '卯': 'Wood',
  '巳': 'Fire',  '午': 'Fire',
  '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water',
  '辰': 'Earth', '未': 'Earth', '戌': 'Earth', '丑': 'Earth',
};

// ── Qi effect magnitudes (conservative professional values) ──

/** Void: each void branch loses this fraction of its element's Qi in the NTFQ */
const VOID_REDUCTION_FACTOR = 0.12;

/** Stem combo: transform shifts Qi from both original elements to result */
const STEM_COMBO_TRANSFORM_DRAIN = 0.08;  // remove 8% of each original element
const STEM_COMBO_TRANSFORM_BOOST = 0.14;  // add 14% to result element

/** Branch six combo: stronger than stem combos (branches carry more Qi) */
const LIU_HE_TRANSFORM_DRAIN = 0.10;
const LIU_HE_TRANSFORM_BOOST = 0.18;

/** San He: powerful elemental surge */
const SAN_HE_PARTIAL_BOOST = 0.08;  // 2/3 present, no transform
const SAN_HE_FULL_DRAIN = 0.06;     // per participant element
const SAN_HE_FULL_BOOST = 0.22;     // surge to result element

/** San Hui: most powerful combination */
const SAN_HUI_DRAIN = 0.08;         // per participant element
const SAN_HUI_BOOST = 0.30;         // massive surge to result

// ============================================================================
// HELPERS
// ============================================================================

function emptyQi(): QiDist {
  return { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
}

function cloneQi(q: QiDist): QiDist {
  return { ...q };
}

function sumQi(q: QiDist): number {
  return ELEMENT_KEYS.reduce((s, k) => s + q[k], 0);
}

function branchElement(char: string): ElementName {
  return (BRANCHES[char]?.element || 'Earth') as ElementName;
}

function branchAnimal(char: string): string {
  return BRANCHES[char]?.animal || 'Unknown';
}

function stemElement(char: string): ElementName {
  return (STEMS[char]?.element || 'Earth') as ElementName;
}

function stemEnglish(char: string): string {
  return STEMS[char]?.english || 'Unknown';
}

/** Get the dominant season element for the current month */
function getSeasonElement(monthBranch: string): ElementName {
  return BRANCH_SEASON_ELEMENT[monthBranch] || 'Earth';
}

/** Determine source layer from participant chart chars */
function inferSourceLayer(participants: ChartChar[]): 'natal' | 'transit' | 'mixed' {
  const hasNatal = participants.some(p => !p.isTransit);
  const hasTransit = participants.some(p => p.isTransit);
  if (hasNatal && hasTransit) return 'mixed';
  if (hasTransit) return 'transit';
  return 'natal';
}

/** Check if the current season supports a transformation result */
function seasonSupports(monthBranch: string, resultElement: ElementName): boolean {
  return getSeasonElement(monthBranch) === resultElement;
}

// ============================================================================
// STEP 1: VOID DETECTION (空亡)
// ============================================================================

/**
 * Classical 空亡 (Kong Wang) calculation.
 *
 * The 60 Jiazi cycle divides into six 旬 (decades) of 10 pillars each.
 * Each 旬 starts with a 甲 stem and uses 10 of the 12 branches.
 * The 2 unused branches are "void" (空亡).
 *
 * Algorithm:
 *   startBranchIdx = (dayBranchIdx - dayStemIdx + 12) % 12
 *   void1 = (startBranchIdx + 10) % 12
 *   void2 = (startBranchIdx + 11) % 12
 */
export function computeVoidBranches(dayStem: string, dayBranch: string): [string, string] {
  const stemIdx = STEM_ORDER.indexOf(dayStem);
  const branchIdx = BRANCH_ORDER.indexOf(dayBranch);

  if (stemIdx < 0 || branchIdx < 0) return ['', ''];

  const startBranchIdx = ((branchIdx - stemIdx) % 12 + 12) % 12;
  const void1Idx = (startBranchIdx + 10) % 12;
  const void2Idx = (startBranchIdx + 11) % 12;

  return [BRANCH_ORDER[void1Idx], BRANCH_ORDER[void2Idx]];
}

function applyVoid(
  qi: QiDist,
  ctx: CombinationContext,
  voidBranches: [string, string]
): { qi: QiDist; events: VoidEvent[] } {
  const result = cloneQi(qi);
  const events: VoidEvent[] = [];

  if (!voidBranches[0] && !voidBranches[1]) return { qi: result, events };

  // Check all chart branches (natal + transit)
  const allBranches = [...ctx.natalBranches, ...ctx.transitBranches];

  for (const cb of allBranches) {
    if (voidBranches.includes(cb.char)) {
      const el = branchElement(cb.char);
      const reduction = result[el] * VOID_REDUCTION_FACTOR;

      if (reduction > 0.001) {
        result[el] = Math.max(0, result[el] - reduction);
        events.push({
          branch: cb.char,
          animal: branchAnimal(cb.char),
          pillarLabel: cb.pillarLabel,
          element: el,
          qiReduction: reduction,
        });
      }
    }
  }

  return { qi: result, events };
}

// ============================================================================
// STEP 2: STEM COMBINATIONS (天干合)
// ============================================================================

function applyStemCombinations(
  qi: QiDist,
  ctx: CombinationContext,
  voidBranches: [string, string]
): { qi: QiDist; events: CombinationEvent[] } {
  const result = cloneQi(qi);
  const events: CombinationEvent[] = [];
  const total = sumQi(qi);
  if (total <= 0) return { qi: result, events };

  // Collect all stems in play
  const allStems = [...ctx.natalStems, ...ctx.transitStems];
  const seen = new Set<string>();

  for (let i = 0; i < allStems.length; i++) {
    for (let j = i + 1; j < allStems.length; j++) {
      const a = allStems[i];
      const b = allStems[j];
      const key = a.char + b.char;

      if (seen.has(key)) continue;
      seen.add(key);
      seen.add(b.char + a.char);

      const combo = STEM_COMBOS[key];
      if (!combo) continue;

      const aEl = stemElement(a.char);
      const bEl = stemElement(b.char);
      const supported = seasonSupports(ctx.currentMonthBranch, combo.result);

      if (supported) {
        // Transform: drain both, boost result
        const drainA = result[aEl] * STEM_COMBO_TRANSFORM_DRAIN;
        const drainB = result[bEl] * STEM_COMBO_TRANSFORM_DRAIN;
        const boost = total * STEM_COMBO_TRANSFORM_BOOST;

        result[aEl] = Math.max(0, result[aEl] - drainA);
        if (aEl !== bEl) {
          result[bEl] = Math.max(0, result[bEl] - drainB);
        }
        result[combo.result] += boost;

        const delta: Partial<Record<ElementName, number>> = {};
        delta[aEl] = -(drainA);
        if (aEl !== bEl) delta[bEl] = -(drainB);
        delta[combo.result] = (delta[combo.result] || 0) + boost;

        events.push({
          type: 'stem-combo',
          participants: [
            { char: a.char, pillarLabel: a.pillarLabel, element: aEl },
            { char: b.char, pillarLabel: b.pillarLabel, element: bEl },
          ],
          resultElement: combo.result,
          transformed: true,
          seasonSupported: true,
          voidBlocked: false,
          qiDelta: delta,
          label: `${a.char}+${b.char} → ${combo.result} (${stemEnglish(a.char)} + ${stemEnglish(b.char)})`,
          detail: `Stem combination transforms into ${combo.result}. Season (${getSeasonElement(ctx.currentMonthBranch)}) supports. ${aEl} −${drainA.toFixed(3)}, ${aEl !== bEl ? `${bEl} −${drainB.toFixed(3)}, ` : ''}${combo.result} +${boost.toFixed(3)}`,
        });
      } else {
        // Bond only — no Qi change, but still noted
        events.push({
          type: 'stem-combo',
          participants: [
            { char: a.char, pillarLabel: a.pillarLabel, element: aEl },
            { char: b.char, pillarLabel: b.pillarLabel, element: bEl },
          ],
          resultElement: combo.result,
          transformed: false,
          seasonSupported: false,
          voidBlocked: false,
          qiDelta: {},
          label: `${a.char}+${b.char} bond (${stemEnglish(a.char)} + ${stemEnglish(b.char)})`,
          detail: `Stem combination bonds but does not transform — season (${getSeasonElement(ctx.currentMonthBranch)}) does not support ${combo.result}.`,
        });
      }
    }
  }

  return { qi: result, events };
}

// ============================================================================
// STEP 3: BRANCH SIX COMBINATIONS (六合)
// ============================================================================

function applyBranchLiuHe(
  qi: QiDist,
  ctx: CombinationContext,
  voidBranches: [string, string],
  protectedBranches: Set<string>
): { qi: QiDist; events: CombinationEvent[] } {
  const result = cloneQi(qi);
  const events: CombinationEvent[] = [];
  const total = sumQi(qi);
  if (total <= 0) return { qi: result, events };

  const allBranches = [...ctx.natalBranches, ...ctx.transitBranches];
  const seen = new Set<string>();

  for (let i = 0; i < allBranches.length; i++) {
    for (let j = i + 1; j < allBranches.length; j++) {
      const a = allBranches[i];
      const b = allBranches[j];
      const key = a.char + b.char;

      if (seen.has(key)) continue;
      seen.add(key);
      seen.add(b.char + a.char);

      const combo = LIU_HE[key];
      if (!combo) continue;

      // Void check
      const isVoid = voidBranches.includes(a.char) || voidBranches.includes(b.char);
      if (isVoid) {
        events.push({
          type: 'liu-he',
          participants: [
            { char: a.char, pillarLabel: a.pillarLabel, element: branchElement(a.char) },
            { char: b.char, pillarLabel: b.pillarLabel, element: branchElement(b.char) },
          ],
          resultElement: combo.result,
          transformed: false,
          seasonSupported: false,
          voidBlocked: true,
          qiDelta: {},
          label: `${a.char}+${b.char} blocked by Void (空亡)`,
          detail: `Branch combination ${a.char}${b.char} cannot activate — one or both branches are void.`,
        });
        continue;
      }

      const aEl = branchElement(a.char);
      const bEl = branchElement(b.char);
      const supported = seasonSupports(ctx.currentMonthBranch, combo.result);

      // Mark both branches as protected (for clash suppression)
      protectedBranches.add(a.char);
      protectedBranches.add(b.char);

      if (supported) {
        const drainA = result[aEl] * LIU_HE_TRANSFORM_DRAIN;
        const drainB = result[bEl] * LIU_HE_TRANSFORM_DRAIN;
        const boost = total * LIU_HE_TRANSFORM_BOOST;

        result[aEl] = Math.max(0, result[aEl] - drainA);
        if (aEl !== bEl) {
          result[bEl] = Math.max(0, result[bEl] - drainB);
        }
        result[combo.result] += boost;

        const delta: Partial<Record<ElementName, number>> = {};
        delta[aEl] = -(drainA);
        if (aEl !== bEl) delta[bEl] = -(drainB);
        delta[combo.result] = (delta[combo.result] || 0) + boost;

        events.push({
          type: 'liu-he',
          participants: [
            { char: a.char, pillarLabel: a.pillarLabel, element: aEl },
            { char: b.char, pillarLabel: b.pillarLabel, element: bEl },
          ],
          resultElement: combo.result,
          transformed: true,
          seasonSupported: true,
          voidBlocked: false,
          qiDelta: delta,
          label: `${a.char}+${b.char} → ${combo.result} (${branchAnimal(a.char)} + ${branchAnimal(b.char)})`,
          detail: `Branch Six Combination transforms into ${combo.result}. Season supports. ${aEl} −${drainA.toFixed(3)}, ${aEl !== bEl ? `${bEl} −${drainB.toFixed(3)}, ` : ''}${combo.result} +${boost.toFixed(3)}`,
        });
      } else {
        events.push({
          type: 'liu-he',
          participants: [
            { char: a.char, pillarLabel: a.pillarLabel, element: aEl },
            { char: b.char, pillarLabel: b.pillarLabel, element: bEl },
          ],
          resultElement: combo.result,
          transformed: false,
          seasonSupported: false,
          voidBlocked: false,
          qiDelta: {},
          label: `${a.char}+${b.char} bond (${branchAnimal(a.char)} + ${branchAnimal(b.char)})`,
          detail: `Branch Six Combination bonds but does not transform — season (${getSeasonElement(ctx.currentMonthBranch)}) does not support ${combo.result}. Clashes involving these branches are softened.`,
        });
      }
    }
  }

  return { qi: result, events };
}

// ============================================================================
// STEP 4: THREE HARMONY (三合局)
// ============================================================================

function applySanHe(
  qi: QiDist,
  ctx: CombinationContext,
  voidBranches: [string, string],
  protectedBranches: Set<string>
): { qi: QiDist; events: CombinationEvent[] } {
  const result = cloneQi(qi);
  const events: CombinationEvent[] = [];
  const total = sumQi(qi);
  if (total <= 0) return { qi: result, events };

  const allBranchChars = [...ctx.natalBranches, ...ctx.transitBranches];
  const branchCharsSet = new Set(allBranchChars.map(b => b.char));
  const branchMap = new Map<string, ChartChar>();
  for (const b of allBranchChars) {
    if (!branchMap.has(b.char)) branchMap.set(b.char, b);
  }

  for (const triad of SAN_HE) {
    const present = triad.branches.filter(b => branchCharsSet.has(b));
    if (present.length < 2) continue;

    // Check void
    const anyVoid = present.some(b => voidBranches.includes(b));
    if (anyVoid) {
      events.push({
        type: 'san-he',
        participants: present.map(b => ({
          char: b,
          pillarLabel: branchMap.get(b)?.pillarLabel || '',
          element: branchElement(b),
        })),
        resultElement: triad.result,
        transformed: false,
        seasonSupported: false,
        voidBlocked: true,
        qiDelta: {},
        label: `三合 ${triad.branches.join('+')} blocked by Void (${present.length}/3 present)`,
        detail: `Three Harmony ${triad.branches.join('+')} → ${triad.result} cannot activate — void branch present.`,
      });
      continue;
    }

    const fullTriad = present.length === 3;
    const supported = seasonSupports(ctx.currentMonthBranch, triad.result);

    // Mark all present branches as protected
    for (const b of present) protectedBranches.add(b);

    if (fullTriad && supported) {
      // Full transform — powerful
      const participantElements = new Set(present.map(b => branchElement(b)));
      const delta: Partial<Record<ElementName, number>> = {};

      for (const el of participantElements) {
        if (el !== triad.result) {
          const drain = result[el] * SAN_HE_FULL_DRAIN;
          result[el] = Math.max(0, result[el] - drain);
          delta[el] = (delta[el] || 0) - drain;
        }
      }
      const boost = total * SAN_HE_FULL_BOOST;
      result[triad.result] += boost;
      delta[triad.result] = (delta[triad.result] || 0) + boost;

      events.push({
        type: 'san-he',
        participants: present.map(b => ({
          char: b,
          pillarLabel: branchMap.get(b)?.pillarLabel || '',
          element: branchElement(b),
        })),
        resultElement: triad.result,
        transformed: true,
        seasonSupported: true,
        voidBlocked: false,
        qiDelta: delta,
        label: `三合 ${present.join('+')} → ${triad.result} (Full Harmony, transformed)`,
        detail: `Three Harmony fully present and season supports ${triad.result}. Strong elemental surge. ${triad.result} +${boost.toFixed(3)}`,
      });
    } else if (fullTriad) {
      // Full triad but no season support — bond, partial boost
      const boost = total * SAN_HE_PARTIAL_BOOST;
      result[triad.result] += boost;

      events.push({
        type: 'san-he',
        participants: present.map(b => ({
          char: b,
          pillarLabel: branchMap.get(b)?.pillarLabel || '',
          element: branchElement(b),
        })),
        resultElement: triad.result,
        transformed: false,
        seasonSupported: false,
        voidBlocked: false,
        qiDelta: { [triad.result]: boost },
        label: `三合 ${present.join('+')} bond (3/3, no transform)`,
        detail: `Three Harmony fully present but season (${getSeasonElement(ctx.currentMonthBranch)}) does not support ${triad.result}. Partial boost only. ${triad.result} +${boost.toFixed(3)}`,
      });
    } else {
      // 2/3 partial — small boost
      const boost = total * SAN_HE_PARTIAL_BOOST * 0.5;
      result[triad.result] += boost;

      const missing = triad.branches.filter(b => !branchCharsSet.has(b));
      events.push({
        type: 'san-he',
        participants: present.map(b => ({
          char: b,
          pillarLabel: branchMap.get(b)?.pillarLabel || '',
          element: branchElement(b),
        })),
        resultElement: triad.result,
        transformed: false,
        seasonSupported: supported,
        voidBlocked: false,
        qiDelta: { [triad.result]: boost },
        label: `三合 ${present.join('+')} partial (2/3, missing ${missing.join(',')})`,
        detail: `Three Harmony partially formed (${present.length}/3). Missing ${missing.join(', ')}. Gentle boost to ${triad.result}. ${triad.result} +${boost.toFixed(3)}`,
      });
    }
  }

  return { qi: result, events };
}

// ============================================================================
// STEP 5: THREE MEETINGS (三会局)
// ============================================================================

function applySanHui(
  qi: QiDist,
  ctx: CombinationContext,
  voidBranches: [string, string],
  protectedBranches: Set<string>
): { qi: QiDist; events: CombinationEvent[] } {
  const result = cloneQi(qi);
  const events: CombinationEvent[] = [];
  const total = sumQi(qi);
  if (total <= 0) return { qi: result, events };

  const allBranchChars = [...ctx.natalBranches, ...ctx.transitBranches];
  const branchCharsSet = new Set(allBranchChars.map(b => b.char));
  const branchMap = new Map<string, ChartChar>();
  for (const b of allBranchChars) {
    if (!branchMap.has(b.char)) branchMap.set(b.char, b);
  }

  for (const triad of SAN_HUI) {
    const present = triad.branches.filter(b => branchCharsSet.has(b));
    if (present.length < 3) continue; // San Hui requires ALL 3

    // Check void
    const anyVoid = present.some(b => voidBranches.includes(b));
    if (anyVoid) {
      events.push({
        type: 'san-hui',
        participants: present.map(b => ({
          char: b,
          pillarLabel: branchMap.get(b)?.pillarLabel || '',
          element: branchElement(b),
        })),
        resultElement: triad.result,
        transformed: false,
        seasonSupported: false,
        voidBlocked: true,
        qiDelta: {},
        label: `三会 ${triad.branches.join('+')} blocked by Void (空亡)`,
        detail: `Three Meetings ${triad.branches.join('+')} → ${triad.result} cannot activate — void branch present.`,
      });
      continue;
    }

    const supported = seasonSupports(ctx.currentMonthBranch, triad.result);

    // Mark all branches as protected
    for (const b of present) protectedBranches.add(b);

    if (supported) {
      // Full transform — most powerful combination
      const participantElements = new Set(present.map(b => branchElement(b)));
      const delta: Partial<Record<ElementName, number>> = {};

      for (const el of participantElements) {
        if (el !== triad.result) {
          const drain = result[el] * SAN_HUI_DRAIN;
          result[el] = Math.max(0, result[el] - drain);
          delta[el] = (delta[el] || 0) - drain;
        }
      }
      const boost = total * SAN_HUI_BOOST;
      result[triad.result] += boost;
      delta[triad.result] = (delta[triad.result] || 0) + boost;

      events.push({
        type: 'san-hui',
        participants: present.map(b => ({
          char: b,
          pillarLabel: branchMap.get(b)?.pillarLabel || '',
          element: branchElement(b),
        })),
        resultElement: triad.result,
        transformed: true,
        seasonSupported: true,
        voidBlocked: false,
        qiDelta: delta,
        label: `三会 ${present.join('+')} → ${triad.result} (Full Meeting, transformed)`,
        detail: `Three Meetings fully present and season supports ${triad.result}. Massive elemental dominance. ${triad.result} +${boost.toFixed(3)}`,
      });
    } else {
      // All 3 present but no season support — bond only
      events.push({
        type: 'san-hui',
        participants: present.map(b => ({
          char: b,
          pillarLabel: branchMap.get(b)?.pillarLabel || '',
          element: branchElement(b),
        })),
        resultElement: triad.result,
        transformed: false,
        seasonSupported: false,
        voidBlocked: false,
        qiDelta: {},
        label: `三会 ${present.join('+')} bond (no transform)`,
        detail: `Three Meetings fully present but season (${getSeasonElement(ctx.currentMonthBranch)}) does not support ${triad.result}. No transformation.`,
      });
    }
  }

  return { qi: result, events };
}

// ============================================================================
// MAIN ENTRY — Full Combination Engine
// ============================================================================

/**
 * Run the complete combination engine on an NTFQ distribution.
 *
 * Pipeline: Void → Stem Combos → Branch Liu He → San He → San Hui
 *
 * Returns the modified QiDist plus detailed events for UI display.
 */
export function applyCombinationEngine(
  ntfq: QiDist,
  ctx: CombinationContext
): CombinationEngineResult {
  const preQi = cloneQi(ntfq);
  const protectedBranches = new Set<string>();

  // 1. Void detection
  const voidBranches = computeVoidBranches(ctx.dayStem, ctx.dayBranch);

  // 2. Apply void weakening
  const voidResult = applyVoid(ntfq, ctx, voidBranches);
  let currentQi = voidResult.qi;

  // 3. Stem combinations
  const stemResult = applyStemCombinations(currentQi, ctx, voidBranches);
  currentQi = stemResult.qi;

  // 4. Branch six combinations
  const liuHeResult = applyBranchLiuHe(currentQi, ctx, voidBranches, protectedBranches);
  currentQi = liuHeResult.qi;

  // 5. Three Harmony
  const sanHeResult = applySanHe(currentQi, ctx, voidBranches, protectedBranches);
  currentQi = sanHeResult.qi;

  // 6. Three Meetings
  const sanHuiResult = applySanHui(currentQi, ctx, voidBranches, protectedBranches);
  currentQi = sanHuiResult.qi;

  // Compute total delta
  const totalDelta = emptyQi();
  for (const k of ELEMENT_KEYS) {
    totalDelta[k] = currentQi[k] - preQi[k];
  }

  // Collect all combination events and compute sourceLayer
  const rawEvents: CombinationEvent[] = [
    ...stemResult.events,
    ...liuHeResult.events,
    ...sanHeResult.events,
    ...sanHuiResult.events,
  ];

  // Build ChartChar lookup for sourceLayer inference
  const allChartChars = new Map<string, ChartChar>();
  for (const cc of [...ctx.natalStems, ...ctx.natalBranches, ...ctx.transitStems, ...ctx.transitBranches]) {
    if (!allChartChars.has(cc.char)) allChartChars.set(cc.char, cc);
  }

  const events = rawEvents.map(ev => ({
    ...ev,
    sourceLayer: (() => {
      const chars = ev.participants.map(p => allChartChars.get(p.char)).filter(Boolean) as ChartChar[];
      return chars.length > 0 ? inferSourceLayer(chars) : ('natal' as const);
    })(),
  }));

  return {
    voidBranches,
    voidEvents: voidResult.events,
    events,
    protectedBranches,
    preQi,
    postQi: currentQi,
    totalDelta,
  };
}

/**
 * Build a CombinationContext from chart pillars and transit pillars.
 *
 * @param chartPillars - Array of 4 natal pillars from calculateBaZi()
 * @param yearPillar - Transit year pillar { stem, branch }
 * @param monthPillar - Transit month pillar { stem, branch }
 * @param currentMonthBranch - Current month's branch character
 */
export function buildCombinationContext(
  chartPillars: any[],
  yearPillar: { stem: string; branch: string },
  monthPillar: { stem: string; branch: string },
  currentMonthBranch: string
): CombinationContext {
  const pillarLabels = ['Year', 'Month', 'Day', 'Hour'];

  const natalStems: ChartChar[] = chartPillars.map((p, i) => ({
    char: p?.stem?.char || '',
    pillarLabel: pillarLabels[i],
    isTransit: false,
  })).filter(s => s.char);

  const natalBranches: ChartChar[] = chartPillars.map((p, i) => ({
    char: p?.branch?.char || '',
    pillarLabel: pillarLabels[i],
    isTransit: false,
  })).filter(b => b.char);

  const transitStems: ChartChar[] = [
    { char: yearPillar.stem, pillarLabel: 'Transit Year', isTransit: true },
    { char: monthPillar.stem, pillarLabel: 'Transit Month', isTransit: true },
  ].filter(s => s.char);

  const transitBranches: ChartChar[] = [
    { char: yearPillar.branch, pillarLabel: 'Transit Year', isTransit: true },
    { char: monthPillar.branch, pillarLabel: 'Transit Month', isTransit: true },
  ].filter(b => b.char);

  return {
    natalStems,
    natalBranches,
    transitStems,
    transitBranches,
    currentMonthBranch,
    dayStem: chartPillars[2]?.stem?.char || '',
    dayBranch: chartPillars[2]?.branch?.char || '',
  };
}
