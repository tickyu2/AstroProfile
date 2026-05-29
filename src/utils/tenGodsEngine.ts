// ============================================================================
// TEN GODS ENGINE — TFQ-Integrated Strength Scoring
// ============================================================================
// Classifies every stem + hidden stem into a Ten God, then aggregates
// TFQ per God to produce strength levels for personality, compatibility,
// and health modules.
//
// Uses the existing getTenGod() classifier from tenGodsCalculations.js
// and integrates with the Qi pipeline output (perPillarBreakdown).
// ============================================================================

import { STEMS, HIDDEN_STEMS } from './baziEngine';
import { getTenGod } from './tenGodsCalculations';
import type { QiDist, PillarBreakdown, PerPillarBreakdownMap } from './qiEngine';

// ============================================================================
// TYPES
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin';
export type PillarName = 'year' | 'month' | 'day' | 'hour';

export type TenGodKey =
  | 'friend'           // 比肩 — same element, same polarity
  | 'robWealth'        // 劫财 — same element, opposite polarity
  | 'eatingGod'        // 食神 — I produce, same polarity
  | 'hurtingOfficer'   // 伤官 — I produce, opposite polarity
  | 'directWealth'     // 正财 — I control, same polarity
  | 'indirectWealth'   // 偏财 — I control, opposite polarity
  | 'directOfficer'    // 正官 — controls me, same polarity
  | 'sevenKillings'    // 七杀 — controls me, opposite polarity
  | 'directResource'   // 正印 — produces me, same polarity
  | 'indirectResource'; // 偏印 — produces me, opposite polarity

export type TenGodCategory = 'companion' | 'output' | 'wealth' | 'authority' | 'resource';

export type StrengthLevel = 'very_weak' | 'weak' | 'moderate' | 'strong' | 'dominant';

/** A single stem or hidden stem classified as a Ten God */
export interface TenGodStemEntry {
  pillar: PillarName;
  position: 'stem' | 'hiddenStem';
  char: string;           // e.g. 甲, 乙
  element: ElementName;
  polarity: Polarity;
  pct: number;            // 100 for stems, hiddenStem pct for hidden
  qi: number;             // TFQ contribution (from Qi pipeline)
  godKey: TenGodKey;
  godName: string;        // e.g. 'Friend', 'Direct Wealth'
  godChinese: string;     // e.g. '比肩', '正财'
}

/** Aggregated data for one Ten God */
export interface TenGodInstance {
  key: TenGodKey;
  name: string;
  chinese: string;
  category: TenGodCategory;
  element: ElementName;
  qi: number;                    // total TFQ for this God
  shareOfTotalQi: number;        // 0–1
  strengthLevel: StrengthLevel;
  stems: TenGodStemEntry[];      // all contributing stems
}

/** Complete Ten Gods profile for a chart */
export interface TenGodProfile {
  dayMaster: {
    char: string;
    element: ElementName;
    polarity: Polarity;
  };
  totalQi: number;
  gods: Record<TenGodKey, TenGodInstance>;
  /** Top 3 Gods by strength */
  dominant: TenGodKey[];
  /** Gods grouped by axis */
  axes: {
    companion: [TenGodInstance, TenGodInstance];  // friend, robWealth
    output: [TenGodInstance, TenGodInstance];     // eatingGod, hurtingOfficer
    wealth: [TenGodInstance, TenGodInstance];     // directWealth, indirectWealth
    authority: [TenGodInstance, TenGodInstance];  // directOfficer, sevenKillings
    resource: [TenGodInstance, TenGodInstance];   // directResource, indirectResource
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PILLAR_NAMES: PillarName[] = ['year', 'month', 'day', 'hour'];
const ELEMENT_KEYS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

/** Map getTenGod() name → our key */
const GOD_NAME_TO_KEY: Record<string, TenGodKey> = {
  'Friend': 'friend',
  'Rob Wealth': 'robWealth',
  'Eating God': 'eatingGod',
  'Hurting Officer': 'hurtingOfficer',
  'Direct Wealth': 'directWealth',
  'Indirect Wealth': 'indirectWealth',
  'Direct Officer': 'directOfficer',
  'Indirect Officer': 'sevenKillings',  // getTenGod returns "Indirect Officer" for 七杀
  '7 Killings': 'sevenKillings',
  'Direct Resource': 'directResource',
  'Indirect Resource': 'indirectResource',
};

/** Map key → display info */
const GOD_INFO: Record<TenGodKey, { name: string; chinese: string; category: TenGodCategory }> = {
  friend:           { name: 'Friend',           chinese: '比肩', category: 'companion' },
  robWealth:        { name: 'Rob Wealth',       chinese: '劫财', category: 'companion' },
  eatingGod:        { name: 'Eating God',       chinese: '食神', category: 'output' },
  hurtingOfficer:   { name: 'Hurting Officer',  chinese: '伤官', category: 'output' },
  directWealth:     { name: 'Direct Wealth',    chinese: '正财', category: 'wealth' },
  indirectWealth:   { name: 'Indirect Wealth',  chinese: '偏财', category: 'wealth' },
  directOfficer:    { name: 'Direct Officer',   chinese: '正官', category: 'authority' },
  sevenKillings:    { name: 'Seven Killings',   chinese: '七杀', category: 'authority' },
  directResource:   { name: 'Direct Resource',  chinese: '正印', category: 'resource' },
  indirectResource: { name: 'Indirect Resource', chinese: '偏印', category: 'resource' },
};

const ALL_GOD_KEYS: TenGodKey[] = [
  'friend', 'robWealth',
  'eatingGod', 'hurtingOfficer',
  'directWealth', 'indirectWealth',
  'directOfficer', 'sevenKillings',
  'directResource', 'indirectResource',
];

// ============================================================================
// CORE ENGINE
// ============================================================================

/**
 * Classify a stem character into a Ten God relative to the Day Master.
 * Returns null if the stem IS the Day Master itself (Day stem = self).
 */
function classifyStem(
  dmElement: ElementName,
  dmPolarity: Polarity,
  stemChar: string
): { key: TenGodKey; name: string; chinese: string; element: ElementName; polarity: Polarity } | null {
  const stemInfo = STEMS[stemChar as keyof typeof STEMS];
  if (!stemInfo) return null;

  const el = stemInfo.element as ElementName;
  const pol = stemInfo.polarity as Polarity;

  const result = getTenGod(dmElement, dmPolarity, el, pol);
  if (!result) return null;

  const key = GOD_NAME_TO_KEY[result.name];
  if (!key) {
    console.warn(`Unknown Ten God name from getTenGod: ${result.name}`);
    return null;
  }

  return {
    key,
    name: result.name,
    chinese: result.chinese,
    element: el,
    polarity: pol,
  };
}

/**
 * Compute the TFQ contribution of a specific element from a pillar's breakdown.
 *
 * We use `qiWeighted` (final functional contribution) if available,
 * falling back to `seasoned`, then `raw`.
 */
function getElementQi(bd: PillarBreakdown, el: ElementName): number {
  const qi = bd.qiWeighted || bd.seasoned || bd.raw;
  return qi[el] || 0;
}

/**
 * Compute the full Ten Gods profile for a natal chart.
 *
 * @param pillars - The 4 parsed pillars (each with stem.char, branch.char)
 * @param perPillarBreakdown - From computeNatalQi, contains raw/seasoned/qiWeighted per pillar
 * @returns Complete TenGodProfile with strength scoring
 */
export function computeTenGodProfile(
  pillars: { stem: { char: string; element?: string; polarity?: string }; branch: { char: string } }[],
  perPillarBreakdown: PerPillarBreakdownMap
): TenGodProfile | null {
  // 1. Identify Day Master (pillar index 2 = Day)
  const dayPillar = pillars[2];
  if (!dayPillar?.stem?.char) return null;

  const dmChar = dayPillar.stem.char;
  const dmStemInfo = STEMS[dmChar as keyof typeof STEMS];
  if (!dmStemInfo) return null;

  const dmElement = dmStemInfo.element as ElementName;
  const dmPolarity = dmStemInfo.polarity as Polarity;

  // 2. Initialize God accumulators
  const godStems: Record<TenGodKey, TenGodStemEntry[]> = {} as any;
  const godQi: Record<TenGodKey, number> = {} as any;
  for (const k of ALL_GOD_KEYS) {
    godStems[k] = [];
    godQi[k] = 0;
  }

  // 3. Scan all 4 pillars: stems + hidden stems
  for (let i = 0; i < 4; i++) {
    const p = pillars[i];
    if (!p?.stem?.char) continue;

    const pillarName = PILLAR_NAMES[i];
    const bd = perPillarBreakdown[pillarName];

    // --- A. Classify the Heavenly Stem ---
    // Day stem is "self" (Day Master) — still classify it as Friend/companion
    const stemResult = classifyStem(dmElement, dmPolarity, p.stem.char);
    if (stemResult) {
      // Stem Qi = 1pt in the raw model. Use the stem's element share from breakdown.
      // Stems contribute 1pt to their element. After pipeline: use qiWeighted.
      const stemQi = bd ? getElementQi(bd, stemResult.element) : 0;
      // Stem contributes proportionally: stem is 1pt out of 11pts total in pillar
      // But we want the FULL element Qi that this stem represents in TFQ
      // Since multiple hidden stems may share the same element, we attribute
      // the stem's share = (1pt / total element pts in pillar) × total element Qi
      // Simplified: attribute 1/11 of the total pillar element Qi to the stem
      const stemShare = stemQi * (1 / 11);

      const entry: TenGodStemEntry = {
        pillar: pillarName,
        position: 'stem',
        char: p.stem.char,
        element: stemResult.element,
        polarity: stemResult.polarity,
        pct: 100,
        qi: stemShare,
        godKey: stemResult.key,
        godName: stemResult.name,
        godChinese: stemResult.chinese,
      };

      godStems[stemResult.key].push(entry);
      godQi[stemResult.key] += stemShare;
    }

    // --- B. Classify Hidden Stems in the branch ---
    if (!p.branch?.char) continue;
    const hidden = HIDDEN_STEMS[p.branch.char as keyof typeof HIDDEN_STEMS] || [];

    for (const hs of hidden) {
      const hsResult = classifyStem(dmElement, dmPolarity, hs.stem);
      if (!hsResult) continue;

      // Hidden stem Qi: its pct share of the branch's 10pts, run through pipeline
      const hsQi = bd ? getElementQi(bd, hsResult.element) : 0;
      // Attribute proportionally: this hidden stem's pct out of total branch pts
      const hsShare = hsQi * (hs.pct / 100) * (10 / 11);

      const entry: TenGodStemEntry = {
        pillar: pillarName,
        position: 'hiddenStem',
        char: hs.stem,
        element: hsResult.element,
        polarity: hsResult.polarity,
        pct: hs.pct,
        qi: hsShare,
        godKey: hsResult.key,
        godName: hsResult.name,
        godChinese: hsResult.chinese,
      };

      godStems[hsResult.key].push(entry);
      godQi[hsResult.key] += hsShare;
    }
  }

  // 4. Compute total Qi and strength levels
  const totalQi = ALL_GOD_KEYS.reduce((sum, k) => sum + godQi[k], 0);

  const gods: Record<TenGodKey, TenGodInstance> = {} as any;

  for (const k of ALL_GOD_KEYS) {
    const info = GOD_INFO[k];
    const share = totalQi > 0 ? godQi[k] / totalQi : 0;

    // Determine the element this God represents
    // All stems in a God share the same element (by definition)
    const godElement = godStems[k].length > 0
      ? godStems[k][0].element
      : getGodElement(dmElement, k);

    gods[k] = {
      key: k,
      name: info.name,
      chinese: info.chinese,
      category: info.category,
      element: godElement,
      qi: godQi[k],
      shareOfTotalQi: share,
      strengthLevel: classifyStrength(share),
      stems: godStems[k],
    };
  }

  // 5. Find dominant Gods (top 3)
  const dominant = ALL_GOD_KEYS
    .slice()
    .sort((a, b) => godQi[b] - godQi[a])
    .slice(0, 3);

  // 6. Build axes
  const axes = {
    companion: [gods.friend, gods.robWealth] as [TenGodInstance, TenGodInstance],
    output: [gods.eatingGod, gods.hurtingOfficer] as [TenGodInstance, TenGodInstance],
    wealth: [gods.directWealth, gods.indirectWealth] as [TenGodInstance, TenGodInstance],
    authority: [gods.directOfficer, gods.sevenKillings] as [TenGodInstance, TenGodInstance],
    resource: [gods.directResource, gods.indirectResource] as [TenGodInstance, TenGodInstance],
  };

  return {
    dayMaster: { char: dmChar, element: dmElement, polarity: dmPolarity },
    totalQi,
    gods,
    dominant,
    axes,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function classifyStrength(share: number): StrengthLevel {
  if (share >= 0.35) return 'dominant';
  if (share >= 0.20) return 'strong';
  if (share >= 0.10) return 'moderate';
  if (share >= 0.04) return 'weak';
  return 'very_weak';
}

/**
 * Derive the element a Ten God represents, given the Day Master element.
 * Used when no stems were found for a God (qi = 0).
 */
function getGodElement(dmElement: ElementName, godKey: TenGodKey): ElementName {
  const GENERATES: Record<ElementName, ElementName> = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
  };
  const CONTROLS: Record<ElementName, ElementName> = {
    Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
  };
  const GENERATED_BY: Record<ElementName, ElementName> = {
    Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal',
  };
  const CONTROLLED_BY: Record<ElementName, ElementName> = {
    Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth',
  };

  switch (godKey) {
    case 'friend':
    case 'robWealth':
      return dmElement;                    // same element
    case 'eatingGod':
    case 'hurtingOfficer':
      return GENERATES[dmElement];         // I produce
    case 'directWealth':
    case 'indirectWealth':
      return CONTROLS[dmElement];          // I control
    case 'directOfficer':
    case 'sevenKillings':
      return CONTROLLED_BY[dmElement];     // controls me
    case 'directResource':
    case 'indirectResource':
      return GENERATED_BY[dmElement];      // produces me
  }
}

// ============================================================================
// CONVENIENCE: Summary views
// ============================================================================

/** Get axis totals as percentages */
export function getAxisDistribution(profile: TenGodProfile): Record<TenGodCategory, number> {
  const result: Record<TenGodCategory, number> = {
    companion: 0, output: 0, wealth: 0, authority: 0, resource: 0,
  };

  for (const k of ALL_GOD_KEYS) {
    result[GOD_INFO[k].category] += profile.gods[k].shareOfTotalQi;
  }

  return result;
}

/** Get the Day Master's "self strength" = companion axis total */
export function getDayMasterSelfStrength(profile: TenGodProfile): number {
  return profile.gods.friend.qi + profile.gods.robWealth.qi;
}

/** Quick check: is the Day Master strong? (companion > 30% of total) */
export function isDayMasterStrong(profile: TenGodProfile): boolean {
  const selfShare = profile.gods.friend.shareOfTotalQi + profile.gods.robWealth.shareOfTotalQi;
  return selfShare > 0.30;
}
