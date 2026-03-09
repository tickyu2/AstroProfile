/**
 * ============================================================================
 * STONE DATABASE — Gemstone-to-Element Mapping for BaZi Bracelet Design
 * ============================================================================
 *
 * Each gemstone carries elemental energy that can supplement deficient
 * elements in a person's BaZi chart. Stones are further classified by
 * polarity (Yin/Yang) because polarity determines whether the stone acts
 * as a gentle influence or a heavy, deep corrective force.
 *
 * Classical principle:
 *   Yang stones (壬 Ren Water = ocean, 庚 Geng Metal = steel) carry dense,
 *   heavy energy suitable for counteracting extreme imbalances.
 *   Yin stones (癸 Gui Water = rain, 辛 Xin Metal = jewelry) provide
 *   gentle, nurturing supplementation for mild deficits.
 *
 * Based on: Traditional Chinese Metaphysics + Crystal Healing associations
 * Created: March 2026
 * ============================================================================
 */

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin' | 'Yin-Yang';

export interface Stone {
  name: string;
  element: ElementName;
  polarity: Polarity;
  color: string;            // Hex color for UI badges
  baseQi: number;           // 0–1 base effectiveness (before season/polarity fit)
  notes: string;            // Functional description of the stone's Qi action
  chineseName?: string;     // Chinese name (optional)
}

// ============================================================================
// STONE DATABASE — 32 functional stones (grouped by element)
// ============================================================================
// Each stone carries elemental Qi. Polarity can be Yang, Yin, or Yin-Yang.
// baseQi is the raw effectiveness before seasonal and polarity-fit modifiers.
// Final QiUnit = baseQi × seasonModifier × polarityFit
// ============================================================================

export const STONE_DATABASE: Stone[] = [
  // ── WATER (8 stones) ─────────────────────────────────────────────────────
  {
    name: 'Black Obsidian',
    element: 'Water', polarity: 'Yang',
    color: '#1a1a2e', baseQi: 0.95,
    notes: 'Deep protective Water-Metal; grounding and cutting through fear.',
    chineseName: '黑曜石',
  },
  {
    name: 'Lapis Lazuli',
    element: 'Water', polarity: 'Yang',
    color: '#1e3a5f', baseQi: 0.90,
    notes: 'Water-Metal; clarity, truth, cooling the mind.',
    chineseName: '青金石',
  },
  {
    name: 'Black Tourmaline',
    element: 'Water', polarity: 'Yang',
    color: '#1a1a1a', baseQi: 0.85,
    notes: 'Drains excess; strong protective Water-Metal.',
    chineseName: '黑碧玺',
  },
  {
    name: 'Aquamarine',
    element: 'Water', polarity: 'Yin',
    color: '#7fcdcd', baseQi: 0.85,
    notes: 'Pure Yin Water; cooling, soothing, emotional regulation.',
    chineseName: '海蓝宝',
  },
  {
    name: 'Blue Lace Agate',
    element: 'Water', polarity: 'Yin',
    color: '#a8c8e8', baseQi: 0.75,
    notes: 'Gentle Water; softens communication and anxiety.',
    chineseName: '蓝纹玛瑙',
  },
  {
    name: 'Pearl',
    element: 'Water', polarity: 'Yin',
    color: '#f5f5f0', baseQi: 0.70,
    notes: 'Water-Earth; nourishing, softening harsh Fire.',
    chineseName: '珍珠',
  },
  {
    name: 'Blue Kyanite',
    element: 'Water', polarity: 'Yin-Yang',
    color: '#4682b4', baseQi: 0.85,
    notes: 'Conductive Water-Metal; aligns and clears stagnation.',
    chineseName: '蓝晶石',
  },
  {
    name: 'Labradorite',
    element: 'Water', polarity: 'Yin',
    color: '#3b4d6b', baseQi: 0.80,
    notes: 'Deep Yin Water; stabilizes emotional storms.',
    chineseName: '拉长石',
  },

  // ── METAL (6 stones) ─────────────────────────────────────────────────────
  {
    name: 'Hematite',
    element: 'Metal', polarity: 'Yang',
    color: '#4a4a4a', baseQi: 0.90,
    notes: 'Strong Yang Metal; grounding, structure, focus.',
    chineseName: '赤铁矿',
  },
  {
    name: 'Pyrite',
    element: 'Metal', polarity: 'Yang',
    color: '#c5a800', baseQi: 0.85,
    notes: 'Metal-Earth; drive, ambition, protective.',
    chineseName: '黄铁矿',
  },
  {
    name: 'Clear Quartz',
    element: 'Metal', polarity: 'Yin',
    color: '#e8e8e8', baseQi: 0.90,
    notes: 'Yin Metal; amplifier, clarifier, neutral carrier.',
    chineseName: '白水晶',
  },
  {
    name: 'White Howlite',
    element: 'Metal', polarity: 'Yin',
    color: '#f0ece0', baseQi: 0.75,
    notes: 'Calming Metal; reduces agitation and overthinking.',
    chineseName: '白松石',
  },
  {
    name: 'Silver',
    element: 'Metal', polarity: 'Yang',
    color: '#c0c0c0', baseQi: 0.95,
    notes: 'Pure conductive Metal; sharp, reflective, strong for Metal-weak charts.',
    chineseName: '银',
  },
  {
    name: 'Fluorite',
    element: 'Metal', polarity: 'Yin',
    color: '#7b68ae', baseQi: 0.80,
    notes: 'Ordering Yin Metal; structure, mental clarity, boundaries.',
    chineseName: '萤石',
  },

  // ── WOOD (6 stones) ──────────────────────────────────────────────────────
  {
    name: 'Malachite',
    element: 'Wood', polarity: 'Yang',
    color: '#0b6623', baseQi: 0.85,
    notes: 'Strong Yang Wood; growth, detox, movement.',
    chineseName: '孔雀石',
  },
  {
    name: 'Petrified Wood',
    element: 'Wood', polarity: 'Yang',
    color: '#8b6914', baseQi: 0.80,
    notes: 'Wood-Earth; ancestral, stabilizing growth.',
    chineseName: '木化石',
  },
  {
    name: 'Green Aventurine',
    element: 'Wood', polarity: 'Yin',
    color: '#4a8c5c', baseQi: 0.85,
    notes: 'Gentle Yin Wood; optimism, soft expansion.',
    chineseName: '绿东陵',
  },
  {
    name: 'Jade',
    element: 'Wood', polarity: 'Yin',
    color: '#00a86b', baseQi: 0.90,
    notes: 'Harmonizing Wood-Earth; protection, balance, longevity.',
    chineseName: '翡翠',
  },
  {
    name: 'Bloodstone',
    element: 'Wood', polarity: 'Yang',
    color: '#2e4d2e', baseQi: 0.85,
    notes: 'Wood-Fire; moves stagnant Qi, courage, circulation.',
    chineseName: '鸡血石',
  },
  {
    name: 'Moss Agate',
    element: 'Wood', polarity: 'Yin',
    color: '#6b8e6b', baseQi: 0.80,
    notes: 'Pure growth Wood; slow, steady development.',
    chineseName: '苔纹玛瑙',
  },

  // ── FIRE (5 stones) ──────────────────────────────────────────────────────
  {
    name: 'Garnet',
    element: 'Fire', polarity: 'Yin-Yang',
    color: '#722f37', baseQi: 0.95,
    notes: 'Deep blood-Fire; sustained Fire, not explosive.',
    chineseName: '石榴石',
  },
  {
    name: 'Sunstone',
    element: 'Fire', polarity: 'Yang',
    color: '#e5742f', baseQi: 0.90,
    notes: 'Radiant, dispersive Fire; confidence and outward expression.',
    chineseName: '日光石',
  },
  {
    name: 'Carnelian',
    element: 'Fire', polarity: 'Yin-Yang',
    color: '#cc5500', baseQi: 0.85,
    notes: 'Warm Fire; digestion, motivation, courage.',
    chineseName: '红玛瑙',
  },
  {
    name: 'Red Spinel',
    element: 'Fire', polarity: 'Yang',
    color: '#c41e3a', baseQi: 0.90,
    notes: 'Clean, refined Fire; clarity and leadership.',
    chineseName: '红尖晶石',
  },
  {
    name: 'Fire Agate',
    element: 'Fire', polarity: 'Yang',
    color: '#a0522d', baseQi: 0.80,
    notes: 'Protective Fire; shields and stabilizes intense Fire.',
    chineseName: '火玛瑙',
  },

  // ── EARTH (5 stones) ─────────────────────────────────────────────────────
  {
    name: 'Tiger Eye',
    element: 'Earth', polarity: 'Yang',
    color: '#c98a1a', baseQi: 0.90,
    notes: 'Earth-Metal; grounding, focus, confidence.',
    chineseName: '虎眼石',
  },
  {
    name: 'Smoky Quartz',
    element: 'Earth', polarity: 'Yang',
    color: '#6b5b4a', baseQi: 0.85,
    notes: 'Earth-Metal; grounding, clearing heavy Qi.',
    chineseName: '茶晶',
  },
  {
    name: 'Yellow Jasper',
    element: 'Earth', polarity: 'Yin',
    color: '#d4a017', baseQi: 0.85,
    notes: 'Pure Earth; stability, nourishment, safe Fire drain.',
    chineseName: '黄碧玉',
  },
  {
    name: 'Citrine',
    element: 'Earth', polarity: 'Yin',
    color: '#e4d00a', baseQi: 0.80,
    notes: 'Earth-Fire; optimism, manifestation, Fire outlet.',
    chineseName: '黄水晶',
  },
  {
    name: 'Picture Jasper',
    element: 'Earth', polarity: 'Yin',
    color: '#a67b5b', baseQi: 0.80,
    notes: 'Deep Earth; landscape, ancestral grounding, structural support.',
    chineseName: '图画碧玉',
  },
];

// ============================================================================
// 12-MONTH 旺相休囚死 MULTIPLIERS — Monthly Element Qi Strength
// ============================================================================
// Classical BaZi seasonal strength cycle applied per Earthly Branch month.
// 旺 (Prosperous) = 1.0 — element is at peak strength
// 相 (Phase)      = 0.6 — element is growing or supported
// 休 (Rest)       = 0.4 — element is resting, moderate
// 囚 (Imprisoned) = 0.2 — element is weakened, suppressed
// 死 (Dead)       = 0.2 — element is at minimum
//
// Transitional Earth months (Dragon, Goat, Dog, Ox) get 0.8 for Earth
// because Earth "stores" between seasons but never fully peaks like 旺.
// ============================================================================

export type BranchMonth =
  | 'Tiger' | 'Rabbit' | 'Dragon'
  | 'Snake' | 'Horse'  | 'Goat'
  | 'Monkey'| 'Rooster'| 'Dog'
  | 'Pig'   | 'Rat'    | 'Ox';

export const MONTHLY_MULTIPLIERS: Record<BranchMonth, Record<ElementName, number>> = {
  Tiger:   { Wood: 1.0, Fire: 0.6, Earth: 0.4, Metal: 0.2, Water: 0.2 },
  Rabbit:  { Wood: 1.0, Fire: 0.6, Earth: 0.4, Metal: 0.2, Water: 0.2 },
  Dragon:  { Wood: 0.6, Fire: 0.6, Earth: 0.8, Metal: 0.4, Water: 0.4 },
  Snake:   { Wood: 0.6, Fire: 1.0, Earth: 0.6, Metal: 0.4, Water: 0.2 },
  Horse:   { Wood: 0.6, Fire: 1.0, Earth: 0.6, Metal: 0.4, Water: 0.2 },
  Goat:    { Wood: 0.6, Fire: 0.6, Earth: 1.0, Metal: 0.4, Water: 0.4 },
  Monkey:  { Wood: 0.4, Fire: 0.4, Earth: 0.6, Metal: 1.0, Water: 0.6 },
  Rooster: { Wood: 0.4, Fire: 0.4, Earth: 0.6, Metal: 1.0, Water: 0.6 },
  Dog:     { Wood: 0.6, Fire: 0.4, Earth: 0.8, Metal: 0.6, Water: 0.6 },
  Pig:     { Wood: 0.2, Fire: 0.2, Earth: 0.4, Metal: 0.6, Water: 1.0 },
  Rat:     { Wood: 0.2, Fire: 0.2, Earth: 0.4, Metal: 0.6, Water: 1.0 },
  Ox:      { Wood: 0.4, Fire: 0.2, Earth: 0.8, Metal: 0.6, Water: 0.6 },
};

// ============================================================================
// CORE QiUnit COMPUTATION — Stone × Month
// ============================================================================
// QiUnit = baseQi × monthMultiplier
// This is the raw monthly output for a 10mm bead. No polarity fit, no bead
// size scaling — those layers come later. This is the "seasonal brain".
// ============================================================================

/**
 * Get a single stone's QiUnit output for a specific branch month.
 *
 * @param stone  - The stone to evaluate
 * @param month  - Earthly Branch month (Tiger through Ox)
 * @returns QiUnit value (baseQi × monthly multiplier)
 */
export function getStoneQiForMonth(stone: Stone, month: BranchMonth): number {
  const monthMultiplier = MONTHLY_MULTIPLIERS[month][stone.element];
  return stone.baseQi * monthMultiplier;
}

/**
 * Generate the full 32×12 QiUnit matrix.
 * Returns { Tiger: { Garnet: 0.57, Sunstone: 0.54, ... }, Rabbit: { ... }, ... }
 *
 * @param stones - Array of stones (defaults to STONE_DATABASE)
 */
export function generateQiUnitMatrix(
  stones: Stone[] = STONE_DATABASE,
): Record<BranchMonth, Record<string, number>> {
  const months = Object.keys(MONTHLY_MULTIPLIERS) as BranchMonth[];
  const matrix = {} as Record<BranchMonth, Record<string, number>>;

  for (const month of months) {
    matrix[month] = {};
    for (const stone of stones) {
      matrix[month][stone.name] = getStoneQiForMonth(stone, month);
    }
  }

  return matrix;
}

// ============================================================================
// POLARITY FIT — How well stone polarity matches chart need
// ============================================================================
// Exact match (chart needs Yang, stone is Yang):      1.00
// Mixed (chart needs Yang, stone is Yin-Yang):        0.75
// Opposite (chart needs Yang, stone is Yin):          0.50
// ============================================================================

/**
 * Get the polarity fit factor for a stone given what the chart needs.
 * Yin-Yang stones are versatile — they fit either polarity at 0.75.
 */
export function getPolarityFit(stonePolarity: Polarity, neededPolarity: Polarity): number {
  if (stonePolarity === neededPolarity) return 1.0;
  if (stonePolarity === 'Yin-Yang' || neededPolarity === 'Yin-Yang') return 0.75;
  return 0.5;
}

/**
 * Calculate full effective Qi with polarity fit applied on top of monthly QiUnit.
 *
 * Formula: EffectiveQi = baseQi × monthMultiplier × polarityFit
 *
 * @param stone           - The stone to evaluate
 * @param month           - Earthly Branch month
 * @param neededPolarity  - The polarity the chart needs (from Day Master)
 */
export function calculateEffectiveQi(
  stone: Stone,
  month: BranchMonth,
  neededPolarity: Polarity,
): number {
  const monthQi = getStoneQiForMonth(stone, month);
  const polarityFit = getPolarityFit(stone.polarity, neededPolarity);
  return monthQi * polarityFit;
}

// ============================================================================
// BRACELET QiUnit PLANNER — Step 3: Bracelet → TFQ → Ratios
// ============================================================================
// These functions turn the monthly QiUnit engine into a bracelet design brain.
// computeBraceletQi  → total elemental Qi output for any bracelet in any month
// computeTFQShift    → natal TFQ + bracelet Qi = shifted TFQ
// computeElementRatios → element percentages for collapse-mode detection
// ============================================================================

export interface BraceletBeadSpec {
  stone: Stone;
  size: number;    // bead diameter in mm (10mm = baseline)
  count: number;   // how many beads of this stone/size
}

/**
 * Compute total elemental Qi output for a bracelet in a given month.
 *
 * For each bead type:
 *   1. Get 10mm QiUnit for the month (baseQi × monthMultiplier)
 *   2. Scale by bead size (12mm → 1.2×, 8mm → 0.8×)
 *   3. Multiply by bead count
 *   4. Accumulate into element totals
 *
 * @param beads  - Array of stone + size + count specs
 * @param month  - Earthly Branch month
 * @returns Element-keyed Qi totals, e.g. { Wood: 3.4, Fire: 12.1, ... }
 */
export function computeBraceletQi(
  beads: BraceletBeadSpec[],
  month: BranchMonth,
): Record<ElementName, number> {
  const totals: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  for (const bead of beads) {
    const qi10mm = getStoneQiForMonth(bead.stone, month);
    const sizeFactor = bead.size / 10;
    const qiTotal = qi10mm * sizeFactor * bead.count;
    totals[bead.stone.element] += qiTotal;
  }

  return totals;
}

/**
 * Shift a natal TFQ by adding bracelet Qi output.
 * This is the core of "Your Fire increased by +12.1 QiUnits".
 *
 * @param natalTFQ    - The person's natal element distribution
 * @param braceletQi  - Output of computeBraceletQi()
 * @returns Shifted TFQ with bracelet Qi added
 */
export function computeTFQShift(
  natalTFQ: Record<ElementName, number>,
  braceletQi: Record<ElementName, number>,
): Record<ElementName, number> {
  return {
    Wood:  natalTFQ.Wood  + braceletQi.Wood,
    Fire:  natalTFQ.Fire  + braceletQi.Fire,
    Earth: natalTFQ.Earth + braceletQi.Earth,
    Metal: natalTFQ.Metal + braceletQi.Metal,
    Water: natalTFQ.Water + braceletQi.Water,
  };
}

/**
 * Compute element ratios (0–1) from an absolute TFQ distribution.
 * This is the input for the collapse-mode detector.
 *
 * @param tfq - Absolute element Qi values
 * @returns Ratios summing to 1.0, e.g. { Wood: 0.15, Fire: 0.35, ... }
 */
export function computeElementRatios(
  tfq: Record<ElementName, number>,
): Record<ElementName, number> {
  const total = tfq.Wood + tfq.Fire + tfq.Earth + tfq.Metal + tfq.Water;
  if (total <= 0) return { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 };

  return {
    Wood:  tfq.Wood  / total,
    Fire:  tfq.Fire  / total,
    Earth: tfq.Earth / total,
    Metal: tfq.Metal / total,
    Water: tfq.Water / total,
  };
}

// ============================================================================
// TFQ CALCULATOR — Step 4: Natal + Monthly + Bracelet → Total Functional Qi
// ============================================================================
// This is the master Qi pipeline. It merges:
//   1. Natal TFQ   — 4 pillars × monthly multipliers
//   2. Monthly TFQ  — month pillar influence × monthly multipliers
//   3. Bracelet Qi   — from computeBraceletQi()
// Into a single TFQ that powers collapse detection, remedy narratives,
// bracelet engineering, and all UI charts.
// ============================================================================

export interface PillarQiEntry {
  element: ElementName;
  rawQi: number;            // raw Qi weight from pillar decomposition
}

/**
 * Compute natal TFQ from the 4 pillars (stems + branches + storage).
 * Each pillar entry's raw Qi is scaled by the month's 旺相休囚死 multiplier.
 *
 * @param pillars - Decomposed pillar entries (element + rawQi)
 * @param month   - Current Earthly Branch month
 */
export function computeNatalTFQ(
  pillars: PillarQiEntry[],
  month: BranchMonth,
): Record<ElementName, number> {
  const totals: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  for (const p of pillars) {
    const mult = MONTHLY_MULTIPLIERS[month][p.element];
    totals[p.element] += p.rawQi * mult;
  }

  return totals;
}

/**
 * Compute monthly TFQ from the month pillar's element distribution.
 * Each element's incoming Qi is scaled by its own monthly multiplier.
 *
 * @param monthElementQi - Raw element Qi from the month pillar decomposition
 * @param month          - Current Earthly Branch month
 */
export function computeMonthlyTFQ(
  monthElementQi: Record<ElementName, number>,
  month: BranchMonth,
): Record<ElementName, number> {
  const totals: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  for (const el of ELS) {
    totals[el] = monthElementQi[el] * MONTHLY_MULTIPLIERS[month][el];
  }

  return totals;
}

/**
 * Combine natal + monthly + bracelet into one total TFQ.
 *
 * TFQ_new = TFQ_natal + TFQ_month + TFQ_bracelet
 */
export function computeTotalTFQ(
  natalTFQ: Record<ElementName, number>,
  monthlyTFQ: Record<ElementName, number>,
  braceletQi: Record<ElementName, number>,
): Record<ElementName, number> {
  return {
    Wood:  natalTFQ.Wood  + monthlyTFQ.Wood  + braceletQi.Wood,
    Fire:  natalTFQ.Fire  + monthlyTFQ.Fire  + braceletQi.Fire,
    Earth: natalTFQ.Earth + monthlyTFQ.Earth + braceletQi.Earth,
    Metal: natalTFQ.Metal + monthlyTFQ.Metal + braceletQi.Metal,
    Water: natalTFQ.Water + monthlyTFQ.Water + braceletQi.Water,
  };
}

/**
 * Compute TFQ delta (before vs after bracelet).
 * Powers the UI: "Fire +12.1", "Earth +8.7", "Metal +1.2"
 */
export function computeTFQDelta(
  before: Record<ElementName, number>,
  after: Record<ElementName, number>,
): Record<ElementName, number> {
  return {
    Wood:  after.Wood  - before.Wood,
    Fire:  after.Fire  - before.Fire,
    Earth: after.Earth - before.Earth,
    Metal: after.Metal - before.Metal,
    Water: after.Water - before.Water,
  };
}

/**
 * Master TFQ pipeline — one call to compute everything.
 *
 * Returns natal, monthly, bracelet Qi, the combined total,
 * element ratios (for collapse detection), and the delta
 * showing what the bracelet actually changed.
 */
export function calculateTFQPipeline({
  pillars,
  monthElementQi,
  braceletBeads,
  month,
}: {
  pillars: PillarQiEntry[];
  monthElementQi: Record<ElementName, number>;
  braceletBeads: BraceletBeadSpec[];
  month: BranchMonth;
}) {
  const natalTFQ   = computeNatalTFQ(pillars, month);
  const monthlyTFQ = computeMonthlyTFQ(monthElementQi, month);
  const braceletQi = computeBraceletQi(braceletBeads, month);

  // Before bracelet (natal + monthly only)
  const beforeBracelet: Record<ElementName, number> = {
    Wood:  natalTFQ.Wood  + monthlyTFQ.Wood,
    Fire:  natalTFQ.Fire  + monthlyTFQ.Fire,
    Earth: natalTFQ.Earth + monthlyTFQ.Earth,
    Metal: natalTFQ.Metal + monthlyTFQ.Metal,
    Water: natalTFQ.Water + monthlyTFQ.Water,
  };

  const totalTFQ = computeTotalTFQ(natalTFQ, monthlyTFQ, braceletQi);
  const ratios   = computeElementRatios(totalTFQ);
  const delta    = computeTFQDelta(beforeBracelet, totalTFQ);

  return {
    natalTFQ,
    monthlyTFQ,
    braceletQi,
    beforeBracelet,
    totalTFQ,
    ratios,
    delta,
  };
}

// ============================================================================
// FIVE ELEMENT CYCLES (for Yong Shen logic)
// ============================================================================

/** Production/Generative Cycle (生): parent → child */
export const GENERATES: Record<ElementName, ElementName> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
};

/** Controlling/Destruction Cycle (克): controller → controlled */
export const CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
};

/** Reverse lookup: who generates this element? (母 mother) */
export const GENERATED_BY: Record<ElementName, ElementName> = {
  Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal', Wood: 'Water',
};

/** Reverse lookup: who controls this element? */
export const CONTROLLED_BY: Record<ElementName, ElementName> = {
  Earth: 'Wood', Water: 'Earth', Fire: 'Water', Metal: 'Fire', Wood: 'Metal',
};

// ============================================================================
// YONG SHEN (用神) — USEFUL GOD LOGIC GATE
// ============================================================================

export type CollapseMode = 'none' | 'single-dominant' | 'bi-polar' | 'drained' | 'inverted';

export interface CollapseInfo {
  mode: CollapseMode;
  primary?: string;       // element name (capitalized)
  secondary?: string;
  primaryShare?: number;  // 0–1
  secondaryShare?: number;
}

export interface YongShenResult {
  status: 'balanced' | 'critical_imbalance' | 'collapse_override';
  collapseMode?: CollapseMode;
  threat?: ElementName;
  threatPercentage?: number;
  forbidden: ElementName[];
  forbiddenReason?: string;
  usefulElements: ElementName[];
  preferredPolarity: Polarity;
  polarityReason: string;
  recommendedStones: StoneRecommendation[];
  reasoning: string;
}

export interface StoneRecommendation {
  stone: Stone;
  reason: string;
  priority: number;    // higher = more needed
}

/**
 * The Yong Shen (Useful God) logic gate.
 *
 * Instead of naively filling deficits, this function:
 * 1. Checks for structural collapse — if detected, applies classical override rules
 * 2. Identifies if any element is critically dominant (>40%)
 * 3. Forbids the threat element AND its mother (the element that feeds it)
 * 4. Prescribes only controlling/exhausting elements
 * 5. Matches stone polarity to the Day Master's polarity
 *
 * @param dynamicPool   - Post-clash element distribution (% summing to 100)
 * @param dayMasterStem - Chinese character of Day Master's Heavenly Stem
 * @param maxStones     - Maximum stones to recommend
 * @param collapse      - Optional structural collapse info from the collapse engine
 */
export function calculateSurvivalKit(
  dynamicPool: Record<ElementName, number>,
  dayMasterStem: string,
  maxStones = 4,
  collapse?: CollapseInfo
): YongShenResult {
  const ELEMENT_KEYS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const dmPolarity = getDayMasterPolarity(dayMasterStem);

  // ── Step 0: Structural Collapse Override ─────────────────────────────
  // When the pipeline detects a collapsed structure, normal Yong Shen rules
  // are replaced by classical special-structure rules (格局用神).
  if (collapse && collapse.mode !== 'none' && collapse.primary) {
    const primary = capitalize(collapse.primary) as ElementName;

    // Single-Dominant (從旺格) → Follow the dominant, use its child to exhaust
    if (collapse.mode === 'single-dominant') {
      const child = GENERATES[primary];  // exhaust the dominant
      const mother = GENERATED_BY[primary]; // feeds it — forbidden as remedy
      const forbidden: ElementName[] = [CONTROLLED_BY[primary]]; // controller fights the flow
      const usefulElements: ElementName[] = [child, primary];
      const stones = pickStones(usefulElements, dmPolarity, forbidden, maxStones);
      return {
        status: 'collapse_override',
        collapseMode: 'single-dominant',
        threat: primary,
        threatPercentage: (collapse.primaryShare || 0) * 100,
        forbidden,
        forbiddenReason: `從旺格 (Follow the Strong): ${primary} dominates at ${((collapse.primaryShare || 0) * 100).toFixed(1)}%. ` +
          `Do NOT use ${CONTROLLED_BY[primary]} to fight it — the structure is too strong to control. ` +
          `Follow the flow by exhausting through ${child}.`,
        usefulElements,
        preferredPolarity: dmPolarity,
        polarityReason: `Following ${primary} dominance — use ${child} to gently exhaust`,
        recommendedStones: stones.map(s => ({
          stone: s,
          reason: `${s.polarity} ${s.element} — follow-structure exhaustion — ${s.notes}`,
          priority: 90,
        })),
        reasoning: `從旺格 Follow Structure: ${primary} dominates (${((collapse.primaryShare || 0) * 100).toFixed(1)}%). ` +
          `Classical rule: follow the dominant element, use ${child} to exhaust it gently. ` +
          `Do NOT attempt to control with ${CONTROLLED_BY[primary]} — the structure is too powerful.`,
      };
    }

    // Bi-Polar (兩神成象) → Bridge the two poles
    if (collapse.mode === 'bi-polar' && collapse.secondary) {
      const secondary = capitalize(collapse.secondary) as ElementName;
      // The bridge element is the child of the primary (it mediates the flow)
      const bridge = GENERATES[primary];
      const forbidden: ElementName[] = ELEMENT_KEYS.filter(
        el => el !== primary && el !== secondary && el !== bridge
      );
      const usefulElements: ElementName[] = [bridge];
      if (!usefulElements.includes(GENERATES[secondary])) {
        usefulElements.push(GENERATES[secondary]);
      }
      const stones = pickStones(usefulElements, dmPolarity, [], maxStones);
      return {
        status: 'collapse_override',
        collapseMode: 'bi-polar',
        threat: primary,
        threatPercentage: (collapse.primaryShare || 0) * 100,
        forbidden: [],
        forbiddenReason: `兩神成象 (Two Gods Form Image): ${primary} + ${secondary} hold ${(((collapse.primaryShare || 0) + (collapse.secondaryShare || 0)) * 100).toFixed(1)}%. ` +
          `Bridge the two poles rather than fighting either.`,
        usefulElements,
        preferredPolarity: dmPolarity,
        polarityReason: `Bridging ${primary} and ${secondary} poles`,
        recommendedStones: stones.map(s => ({
          stone: s,
          reason: `${s.polarity} ${s.element} — bridge element — ${s.notes}`,
          priority: 80,
        })),
        reasoning: `兩神成象 Bi-Polar Structure: ${primary} (${((collapse.primaryShare || 0) * 100).toFixed(1)}%) and ${secondary} (${((collapse.secondaryShare || 0) * 100).toFixed(1)}%) dominate. ` +
          `Classical rule: use ${bridge} to bridge and mediate the two poles. ` +
          `Do not boost minor elements — the two-element structure is the chart's nature.`,
      };
    }

    // Drained (虛弱) → Support the parent of the drained element
    if (collapse.mode === 'drained') {
      const parent = GENERATED_BY[primary]; // parent feeds the drained element
      const usefulElements: ElementName[] = [parent, primary];
      const forbidden: ElementName[] = [CONTROLS[primary]]; // what controls the drained element
      const stones = pickStones(usefulElements, dmPolarity, forbidden, maxStones);
      return {
        status: 'collapse_override',
        collapseMode: 'drained',
        threat: primary,
        threatPercentage: (collapse.primaryShare || 0) * 100,
        forbidden,
        forbiddenReason: `虛弱 (Drained): ${primary} is critically depleted at ${((collapse.primaryShare || 0) * 100).toFixed(1)}%. ` +
          `Do NOT use ${CONTROLS[primary]} — it would further suppress ${primary}. ` +
          `Feed through its mother ${parent} in the generating cycle.`,
        usefulElements,
        preferredPolarity: dmPolarity,
        polarityReason: `Feeding drained ${primary} through its mother ${parent}`,
        recommendedStones: stones.map(s => ({
          stone: s,
          reason: `${s.polarity} ${s.element} — nourish drained ${primary} — ${s.notes}`,
          priority: 85,
        })),
        reasoning: `虛弱 Drained Structure: ${primary} is nearly absent (${((collapse.primaryShare || 0) * 100).toFixed(1)}%). ` +
          `Classical rule: do not feed ${primary} directly (it cannot hold Qi). ` +
          `Instead use ${parent} (its mother) to build a foundation that ${primary} can draw from.`,
      };
    }

    // Inverted (反局) → Control the dominant element
    if (collapse.mode === 'inverted') {
      const controller = CONTROLLED_BY[primary];
      const exhaustor = GENERATES[primary];
      const mother = GENERATED_BY[primary];
      const forbidden: ElementName[] = [primary, mother];
      const usefulElements: ElementName[] = [controller, exhaustor];
      const stones = pickStones(usefulElements, dmPolarity, forbidden, maxStones);
      return {
        status: 'collapse_override',
        collapseMode: 'inverted',
        threat: primary,
        threatPercentage: (collapse.primaryShare || 0) * 100,
        forbidden,
        forbiddenReason: `反局 (Inverted): ${primary} is excessively strong. ` +
          `Avoid ${mother} (feeds ${primary}) and ${primary} itself.`,
        usefulElements,
        preferredPolarity: dmPolarity,
        polarityReason: `Counter-balancing inverted ${primary} dominance`,
        recommendedStones: stones.map(s => ({
          stone: s,
          reason: `${s.polarity} ${s.element} — counter inverted structure — ${s.notes}`,
          priority: 75,
        })),
        reasoning: `反局 Inverted Structure: ${primary} is disproportionately strong (${((collapse.primaryShare || 0) * 100).toFixed(1)}%). ` +
          `Classical rule: use ${controller} to control and ${exhaustor} to exhaust. ` +
          `The structure is tilted but not fully collapsed — direct intervention is appropriate.`,
      };
    }
  }

  // ── Step 1: Identify the Threat ──────────────────────────────────────
  let threat: ElementName | undefined;
  let threatPct = 0;
  for (const el of ELEMENT_KEYS) {
    if (dynamicPool[el] > 40 && dynamicPool[el] > threatPct) {
      threat = el;
      threatPct = dynamicPool[el];
    }
  }

  // ── No critical threat → standard deficit filling ────────────────────
  if (!threat) {
    const deficits = ELEMENT_KEYS
      .map(el => ({ element: el, deficit: 20 - dynamicPool[el] }))
      .filter(d => d.deficit > 3)
      .sort((a, b) => b.deficit - a.deficit);

    if (deficits.length === 0) {
      return {
        status: 'balanced',
        forbidden: [],
        usefulElements: [],
        preferredPolarity: 'Yin',
        polarityReason: 'Chart is balanced — gentle stones for maintenance',
        recommendedStones: [],
        reasoning: 'All elements are within healthy range. No heavy corrections needed.',
      };
    }

    // Standard deficit filling with polarity awareness
    const dmPolarity = getDayMasterPolarity(dayMasterStem);
    const stones = pickStones(deficits.map(d => d.element), dmPolarity, [], maxStones);

    return {
      status: 'balanced',
      forbidden: [],
      usefulElements: deficits.map(d => d.element),
      preferredPolarity: dmPolarity,
      polarityReason: `Matching ${dmPolarity} polarity for gentle supplementation`,
      recommendedStones: stones.map(s => ({
        stone: s,
        reason: `${s.element} supplementation — ${s.notes}`,
        priority: 20 - dynamicPool[s.element],
      })),
      reasoning: `Minor deficits detected. Recommending gentle ${dmPolarity} polarity stones.`,
    };
  }

  // ── Step 2: Critical imbalance — apply Yong Shen logic ──────────────
  const mother = GENERATED_BY[threat]; // Element that FEEDS the threat
  const controller = CONTROLLED_BY[threat]; // Element that CONTROLS the threat
  const exhaustor = GENERATES[threat]; // Element the threat produces (exhausts it)

  const forbidden: ElementName[] = [threat, mother];

  // Useful elements: controller first (extinguish), then exhaustor (drain)
  // But check: if controller would be melted by the threat, deprioritize
  // e.g. Metal is controlled by Fire — if Fire is the threat, Metal gets melted
  const usefulElements: ElementName[] = [];

  // The element that CONTROLS the threat is the primary remedy
  usefulElements.push(controller);

  // The element the threat PRODUCES can exhaust it (e.g. Earth exhausts Fire)
  // But only if it's not also forbidden
  if (!forbidden.includes(exhaustor)) {
    usefulElements.push(exhaustor);
  }

  // Special consideration: if the threat controls something, that victim element
  // should NOT be recommended (e.g. Fire melts Metal → avoid Metal as primary)
  const victim = CONTROLS[threat]; // What the threat controls
  // victim is still technically allowed but deprioritized

  // ── Step 3: Determine polarity ──────────────────────────────────────
  // (dmPolarity already computed at top of function)
  // For critical threats, we need HEAVY remedies — match opposing polarity
  // Yang Day Master needs Yang controller (e.g. Bing Yang Fire needs Ren Yang Water)
  // Because same-polarity interaction is the classical "proper control" (正克)
  const preferredPolarity = dmPolarity; // Same polarity for proper controlling

  const polarityReason = dmPolarity === 'Yang'
    ? `Yang Day Master requires Yang (heavy, deep) remedies — ocean-depth ${controller} to properly control ${threat}`
    : `Yin Day Master requires Yin (refined, precise) remedies — steady ${controller} to gently control ${threat}`;

  // ── Step 4: Pick polarity-matched stones ────────────────────────────
  const stones = pickStones(usefulElements, preferredPolarity, forbidden, maxStones);

  const forbiddenReason = `${mother} feeds ${threat} (${mother}生${threat} generative cycle). ` +
    `Adding ${mother} stones would be like throwing gasoline on a fire. ` +
    `Your chart shows ${mother} at only ${dynamicPool[mother].toFixed(1)}%, but filling that deficit ` +
    `would instantly fuel the ${threat} dominance (${threatPct.toFixed(1)}%).`;

  const reasoning = `Chart is critically dominated by ${threat} (${threatPct.toFixed(1)}%). ` +
    `Strictly forbidding ${forbidden.join(' and ')} — ${mother} feeds ${threat} in the generative cycle. ` +
    `Prescribing ${preferredPolarity} ${controller} stones to control the ${threat}, ` +
    `plus ${exhaustor} to help exhaust it.`;

  return {
    status: 'critical_imbalance',
    threat,
    threatPercentage: threatPct,
    forbidden,
    forbiddenReason,
    usefulElements,
    preferredPolarity,
    polarityReason,
    recommendedStones: stones.map(s => ({
      stone: s,
      reason: `${s.polarity} ${s.element} — ${s.notes}`,
      priority: threatPct - dynamicPool[s.element],
    })),
    reasoning,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

// ============================================================================
// COLLAPSE DETECTION (lightweight — for Yong Shen integration)
// ============================================================================

const COLLAPSE_SINGLE_PCT = 55;   // >55% of total = single-dominant
const COLLAPSE_SINGLE_GAP = 20;   // >20% gap to second
const COLLAPSE_BIPOLAR_SUM = 80;  // top two > 80%
const COLLAPSE_DRAINED_PCT = 5;   // <5% = drained
const COLLAPSE_INVERTED_RATIO = 3; // top / bottom > 3x

/**
 * Derive collapse info from element distribution percentages (summing to ~100).
 * Lightweight version for use inside calculateSurvivalKit.
 */
export function detectCollapse(pool: Record<ElementName, number>): CollapseInfo {
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const sorted = [...ELS].sort((a, b) => pool[b] - pool[a]);
  const top = sorted[0], second = sorted[1], bottom = sorted[4];

  if (pool[top] >= COLLAPSE_SINGLE_PCT && pool[top] - pool[second] >= COLLAPSE_SINGLE_GAP) {
    return { mode: 'single-dominant', primary: top, primaryShare: pool[top] / 100 };
  }
  if (pool[top] + pool[second] >= COLLAPSE_BIPOLAR_SUM) {
    return { mode: 'bi-polar', primary: top, secondary: second, primaryShare: pool[top] / 100, secondaryShare: pool[second] / 100 };
  }
  if (pool[bottom] <= COLLAPSE_DRAINED_PCT) {
    return { mode: 'drained', primary: bottom, primaryShare: pool[bottom] / 100 };
  }
  const ratio = pool[top] / Math.max(pool[bottom], 0.01);
  if (ratio >= COLLAPSE_INVERTED_RATIO) {
    return { mode: 'inverted', primary: top, secondary: bottom, primaryShare: pool[top] / 100, secondaryShare: pool[bottom] / 100 };
  }
  return { mode: 'none' };
}

// ============================================================================
// ENHANCED COLLAPSE REPORT — Step 5: Intelligent Collapse Diagnosis
// ============================================================================
// Works on 0–1 ratios (from computeElementRatios). Returns:
//   - Collapse type with classical Chinese name
//   - Severity level
//   - Forbidden elements (what the bracelet must NOT add)
//   - Recommended elements (what the bracelet should add)
//   - Correction strategy narrative
//
// Uses the Five Element cycles already defined (GENERATES, CONTROLS, etc.)
// to derive forbidden/recommended from the dominant or starved element.
// ============================================================================

const DOMINANCE_THRESHOLD = 0.45;   // >45% = dominant collapse
const WEAKNESS_THRESHOLD  = 0.08;   // <8%  = starvation collapse
const SEVERE_THRESHOLD    = 0.55;   // >55% = severe collapse

export type CollapseSeverity = 'none' | 'mild' | 'moderate' | 'severe';

export interface CollapseReport {
  isCollapsed: boolean;
  type: string | null;               // Classical name, e.g. "從旺格 Follow the Dominant"
  severity: CollapseSeverity;
  dominantElement: ElementName | null;
  weakestElement: ElementName | null;
  forbidden: ElementName[];           // Elements the bracelet must avoid
  recommended: ElementName[];         // Elements the bracelet should use
  strategy: string;                   // Plain-language correction strategy
}

/**
 * Diagnose collapse from element ratios (0–1, summing to ~1.0).
 *
 * Detects:
 *   1. 從旺格 — Follow the Dominant (one element > 45%)
 *   2. Starvation Collapse — 印綬崩/食傷崩/官殺崩 (one element < 8%)
 *   3. No collapse — balanced enough for standard remedy
 *
 * @param ratios - Output of computeElementRatios()
 */
export function diagnoseCollapse(ratios: Record<ElementName, number>): CollapseReport {
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // Find dominant and weakest
  let dominant: ElementName = 'Wood';
  let weakest: ElementName = 'Wood';
  let maxVal = -Infinity;
  let minVal = Infinity;

  for (const el of ELS) {
    if (ratios[el] > maxVal) { maxVal = ratios[el]; dominant = el; }
    if (ratios[el] < minVal) { minVal = ratios[el]; weakest = el; }
  }

  // 1. Dominance collapse (從旺格)
  //    Controller of dominant is too weak to fight — follow the flow instead.
  if (maxVal > DOMINANCE_THRESHOLD) {
    const child = GENERATES[dominant];        // exhaust dominant through child
    const controller = CONTROLLED_BY[dominant]; // what would control it (forbidden — too weak)
    const mother = GENERATED_BY[dominant];      // what feeds it (also forbidden)
    const severity: CollapseSeverity = maxVal > SEVERE_THRESHOLD ? 'severe' : 'moderate';

    return {
      isCollapsed: true,
      type: `從旺格 Follow the Dominant (${dominant})`,
      severity,
      dominantElement: dominant,
      weakestElement: weakest,
      forbidden: [controller, mother],
      recommended: [child, dominant],
      strategy: `${dominant} dominates at ${(maxVal * 100).toFixed(1)}%. ` +
        `Do NOT fight with ${controller} — it is too weak. ` +
        `Follow the flow: use ${child} to gently exhaust ${dominant}. ` +
        `Avoid ${mother} (feeds ${dominant}) and ${controller} (would be overwhelmed).`,
    };
  }

  // 2. Starvation collapse
  //    One element is critically depleted — feed it through its mother.
  if (minVal < WEAKNESS_THRESHOLD) {
    const mother = GENERATED_BY[weakest];       // what feeds the starved element
    const attacker = CONTROLLED_BY[weakest];    // what controls/attacks the starved element (forbidden)
    const severity: CollapseSeverity = minVal < WEAKNESS_THRESHOLD / 2 ? 'severe' : 'mild';

    return {
      isCollapsed: true,
      type: `Starvation Collapse (${weakest} 虛弱)`,
      severity,
      dominantElement: dominant,
      weakestElement: weakest,
      forbidden: [attacker],
      recommended: [mother, weakest],
      strategy: `${weakest} is critically depleted at ${(minVal * 100).toFixed(1)}%. ` +
        `Feed through its mother ${mother} in the generating cycle. ` +
        `Avoid ${attacker} — it would further suppress ${weakest}.`,
    };
  }

  // 3. No collapse
  return {
    isCollapsed: false,
    type: null,
    severity: 'none',
    dominantElement: null,
    weakestElement: null,
    forbidden: [],
    recommended: [],
    strategy: 'Element distribution is balanced. Standard remedy applies.',
  };
}

// ============================================================================
// BRACELET ENGINEERING SIMULATOR — Step 6: Prescriptive Bracelet Design
// ============================================================================
// Takes a CollapseReport and produces a fully engineered bracelet:
//   1. Target elemental ratios (strict, forbidden-safe)
//   2. Bead counts from ratios
//   3. Stone selection (highest QiUnit first, forbidden excluded)
//   4. Full bead-by-bead layout with sizes
//   5. "Why This Remedy Works" narrative
// ============================================================================

/**
 * Normalize an element record so values sum to 1.0.
 * Entries ≤ 0 are clamped to 0 before normalizing.
 */
function normalizeRatios(raw: Record<ElementName, number>): Record<ElementName, number> {
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const clamped: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const el of ELS) clamped[el] = Math.max(0, raw[el]);
  const sum = ELS.reduce((s, el) => s + clamped[el], 0);
  if (sum <= 0) return { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 };
  for (const el of ELS) clamped[el] /= sum;
  return clamped;
}

/**
 * Generate strict target ratios from a CollapseReport.
 *
 * - No collapse → equal 20% each
 * - Dominance collapse → drain dominant through child, forbid mother & controller
 * - Starvation collapse → rebuild through mother, forbid attacker
 */
export function generateTargetRatios(report: CollapseReport): Record<ElementName, number> {
  if (!report.isCollapsed) {
    return { Wood: 0.20, Fire: 0.20, Earth: 0.20, Metal: 0.20, Water: 0.20 };
  }

  const raw: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  // Dominance collapse — drain through child
  if (report.dominantElement && report.type?.includes('從旺格')) {
    const dom = report.dominantElement;
    const child = GENERATES[dom];

    raw[dom]   = 0.10;    // keep dominant low (泄 drain)
    raw[child] = 0.40;    // primary drain
    // Fill remaining with non-forbidden elements
    const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const forbidden = new Set(report.forbidden);
    const remaining = ELS.filter(el => el !== dom && el !== child && !forbidden.has(el));
    const remainShare = 0.50 / Math.max(remaining.length, 1);
    for (const el of remaining) raw[el] = remainShare;
    // Zero out forbidden
    for (const el of report.forbidden) raw[el] = 0;

    return normalizeRatios(raw);
  }

  // Starvation collapse — rebuild through mother
  if (report.weakestElement && report.type?.includes('虛弱')) {
    const weak = report.weakestElement;
    const mother = GENERATED_BY[weak];

    raw[weak]   = 0.45;   // rebuild root
    raw[mother] = 0.35;   // feed root
    // Fill remaining with non-forbidden elements
    const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const forbidden = new Set(report.forbidden);
    const remaining = ELS.filter(el => el !== weak && el !== mother && !forbidden.has(el));
    const remainShare = 0.20 / Math.max(remaining.length, 1);
    for (const el of remaining) raw[el] = remainShare;
    // Zero out forbidden
    for (const el of report.forbidden) raw[el] = 0;

    return normalizeRatios(raw);
  }

  // Fallback — equal distribution minus forbidden
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const forbidden = new Set(report.forbidden);
  const allowed = ELS.filter(el => !forbidden.has(el));
  const share = 1.0 / Math.max(allowed.length, 1);
  for (const el of allowed) raw[el] = share;
  return normalizeRatios(raw);
}

/**
 * Convert element ratios → bead counts for a fixed bead total.
 * Uses largest-remainder method to ensure counts sum exactly to totalBeads.
 */
export function allocateBeadsByRatio(
  ratios: Record<ElementName, number>,
  totalBeads: number,
): Record<ElementName, number> {
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const raw = ELS.map(el => ({ el, exact: ratios[el] * totalBeads }));
  const floored = raw.map(r => ({ ...r, count: Math.floor(r.exact), remainder: r.exact - Math.floor(r.exact) }));

  let assigned = floored.reduce((s, r) => s + r.count, 0);
  // Distribute leftover beads to highest remainders
  floored.sort((a, b) => b.remainder - a.remainder);
  for (const r of floored) {
    if (assigned >= totalBeads) break;
    r.count++;
    assigned++;
  }

  const result: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const r of floored) result[r.el] = r.count;
  return result;
}

export interface EngineeredBead {
  stone: Stone;
  size: number;           // mm
  element: ElementName;
  qiUnit: number;         // QiUnit for this bead in the target month
}

export interface EngineeredBracelet {
  beads: EngineeredBead[];
  totalBeads: number;
  targetRatios: Record<ElementName, number>;
  beadCounts: Record<ElementName, number>;
  qiTotals: Record<ElementName, number>;   // total QiUnits per element
  collapse: CollapseReport;
  narrative: string;
  wrist: 'left' | 'right';
  wristReason: string;
}

/**
 * Pick the best stones for a given element, respecting forbidden list.
 * Returns up to `count` stones sorted by baseQi descending.
 * Cycles through available stones if count > unique stones.
 */
function pickStonesForElement(
  element: ElementName,
  count: number,
  forbidden: Set<ElementName>,
  month: BranchMonth,
): Stone[] {
  if (forbidden.has(element) || count <= 0) return [];

  const candidates = STONE_DATABASE
    .filter(s => s.element === element)
    .sort((a, b) => getStoneQiForMonth(b, month) - getStoneQiForMonth(a, month));

  if (candidates.length === 0) return [];

  const result: Stone[] = [];
  for (let i = 0; i < count; i++) {
    result.push(candidates[i % candidates.length]);
  }
  return result;
}

// ============================================================================
// QI FLOW LAYOUT ENGINE — Step 7: Wrist, Sequencing, Anchors
// ============================================================================
// Determines physical bracelet layout for correct Qi flow:
//   - Left wrist (吸氣) = incoming Qi → for deficiency/starvation
//   - Right wrist (出氣) = outgoing Qi → for dominance/excess
//   - Sheng cycle sequencing → smooth circular Qi flow
//   - Anchor stones at start + midpoint → stabilize the circuit
// ============================================================================

/** Sheng (generative) cycle order for bead sequencing */
const SHENG_SEQUENCE: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

/**
 * Determine which wrist the bracelet should be worn on.
 *
 * Left wrist (吸氣 absorb) — pulls Qi into the body:
 *   Used for starvation, weakness, deficiency
 *
 * Right wrist (出氣 release) — drains Qi out of the body:
 *   Used for dominance collapse, excess, overheating
 */
export function determineWrist(collapse: CollapseReport): { wrist: 'left' | 'right'; reason: string } {
  if (!collapse.isCollapsed) {
    return {
      wrist: 'left',
      reason: 'Balanced chart — left wrist (吸氣) for gentle absorption and maintenance.',
    };
  }

  if (collapse.type?.includes('虛弱')) {
    return {
      wrist: 'left',
      reason: `Starvation collapse (${collapse.weakestElement} depleted) — left wrist (吸氣) to pull nourishing Qi into the body.`,
    };
  }

  return {
    wrist: 'right',
    reason: `Dominance collapse (${collapse.dominantElement} excess) — right wrist (出氣) to drain and release excess Qi.`,
  };
}

/**
 * Sequence beads in Sheng (generative) cycle order.
 * Wood → Fire → Earth → Metal → Water → Wood → ...
 *
 * Within each element group, beads are kept in their selection order
 * (highest QiUnit first). This prevents Qi turbulence and elemental whiplash.
 */
export function sequenceBeadsShengCycle(beads: EngineeredBead[]): EngineeredBead[] {
  const grouped: Record<ElementName, EngineeredBead[]> = {
    Wood: [], Fire: [], Earth: [], Metal: [], Water: [],
  };
  for (const b of beads) grouped[b.element].push(b);

  // Interleave: round-robin through Sheng cycle, one bead per element per pass
  const result: EngineeredBead[] = [];
  let placed = true;
  while (placed) {
    placed = false;
    for (const el of SHENG_SEQUENCE) {
      if (grouped[el].length > 0) {
        result.push(grouped[el].shift()!);
        placed = true;
      }
    }
  }

  return result;
}

/**
 * Select the best anchor stone for the bracelet.
 * Anchors stabilize the Qi circuit — placed at start and midpoint.
 *
 * - Earth anchors stabilize Fire/Metal excess
 * - Metal anchors stabilize Wood/Earth excess
 * - Water anchors stabilize Fire excess
 * - For balanced charts, default to Earth (universal stabilizer)
 */
function selectAnchorElement(collapse: CollapseReport): ElementName {
  if (!collapse.isCollapsed) return 'Earth';

  if (collapse.dominantElement) {
    // Use the child of the dominant element — same as the drain strategy
    return GENERATES[collapse.dominantElement];
  }

  if (collapse.weakestElement) {
    // Use the mother of the weak element — nourish
    return GENERATED_BY[collapse.weakestElement];
  }

  return 'Earth';
}

/**
 * Insert anchor stones at position 0 (start) and midpoint.
 * Anchors are the highest-QiUnit stone of the chosen anchor element.
 */
function insertAnchorStones(
  beads: EngineeredBead[],
  anchorElement: ElementName,
  month: BranchMonth,
  beadSize: number,
): EngineeredBead[] {
  // Find best anchor stone
  const anchorCandidates = STONE_DATABASE
    .filter(s => s.element === anchorElement)
    .sort((a, b) => getStoneQiForMonth(b, month) - getStoneQiForMonth(a, month));

  if (anchorCandidates.length === 0) return beads;

  const anchorStone = anchorCandidates[0];
  const qi = getStoneQiForMonth(anchorStone, month) * (beadSize / 10);
  const anchorBead: EngineeredBead = {
    stone: anchorStone,
    size: beadSize,
    element: anchorElement,
    qiUnit: qi,
  };

  const result = [...beads];
  const mid = Math.floor(result.length / 2);

  // Insert midpoint first so index 0 insert doesn't shift it
  result.splice(mid, 0, { ...anchorBead });
  result.splice(0, 0, { ...anchorBead });

  return result;
}

/**
 * Engineer a complete bracelet from a collapse diagnosis.
 *
 * Pipeline:
 *   1. Generate target ratios from collapse
 *   2. Allocate bead counts (reserving 2 for anchors)
 *   3. Select stones per element
 *   4. Sequence in Sheng cycle order
 *   5. Insert anchor stones at start + midpoint
 *   6. Determine wrist
 *   7. Generate narrative
 *
 * @param collapse   - Output of diagnoseCollapse()
 * @param month      - Target Earthly Branch month
 * @param totalBeads - Total bead count (default 21, includes 2 anchors)
 * @param beadSize   - Default bead size in mm (default 10)
 */
export function engineerBracelet({
  collapse,
  month,
  totalBeads = 21,
  beadSize = 10,
}: {
  collapse: CollapseReport;
  month: BranchMonth;
  totalBeads?: number;
  beadSize?: number;
}): EngineeredBracelet {
  const targetRatios = generateTargetRatios(collapse);
  // Reserve 2 beads for anchors
  const prescriptionBeads = Math.max(totalBeads - 2, 1);
  const beadCounts = allocateBeadsByRatio(targetRatios, prescriptionBeads);
  const forbidden = new Set(collapse.forbidden);

  // Select stones
  const rawBeads: EngineeredBead[] = [];
  const qiTotals: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  for (const el of SHENG_SEQUENCE) {
    const stones = pickStonesForElement(el, beadCounts[el], forbidden, month);
    for (const stone of stones) {
      const qi = getStoneQiForMonth(stone, month) * (beadSize / 10);
      rawBeads.push({ stone, size: beadSize, element: el, qiUnit: qi });
      qiTotals[el] += qi;
    }
  }

  // Sequence in Sheng cycle (interleaved round-robin)
  const sequenced = sequenceBeadsShengCycle(rawBeads);

  // Insert anchor stones
  const anchorElement = selectAnchorElement(collapse);
  const beads = insertAnchorStones(sequenced, anchorElement, month, beadSize);

  // Add anchor Qi to totals
  const anchorQi = beads[0]?.qiUnit || 0;
  qiTotals[anchorElement] += anchorQi * 2;

  // Wrist determination
  const { wrist, reason: wristReason } = determineWrist(collapse);

  const narrative = explainBracelet(collapse, targetRatios);

  return {
    beads,
    totalBeads: beads.length,
    targetRatios,
    beadCounts,
    qiTotals,
    collapse,
    narrative,
    wrist,
    wristReason,
  };
}

/**
 * Engineer a bracelet pair for severe collapse cases.
 *
 * - Bracelet A: Full prescriptive ratio (primary remedy)
 * - Bracelet B: Micro-dose support (30% intensity — only recommended elements)
 *
 * For mild/no collapse, both bracelets use the same full ratio.
 * Never splits opposing elements across bracelets.
 */
export function engineerBraceletPair({
  collapse,
  month,
  totalBeadsA = 21,
  totalBeadsB = 21,
  beadSize = 10,
}: {
  collapse: CollapseReport;
  month: BranchMonth;
  totalBeadsA?: number;
  totalBeadsB?: number;
  beadSize?: number;
}): { primary: EngineeredBracelet; support: EngineeredBracelet } {
  const primary = engineerBracelet({ collapse, month, totalBeads: totalBeadsA, beadSize });

  if (collapse.severity === 'severe') {
    // Bracelet B: micro-dose support using only recommended elements
    const supportCollapse: CollapseReport = {
      ...collapse,
      severity: 'mild',   // downgrade for gentler ratios
    };
    const support = engineerBracelet({
      collapse: supportCollapse,
      month,
      totalBeads: totalBeadsB,
      beadSize,
    });
    return { primary, support };
  }

  // Mild or no collapse — both identical
  const support = engineerBracelet({ collapse, month, totalBeads: totalBeadsB, beadSize });
  return { primary, support };
}

/**
 * Generate a "Why This Remedy Works" narrative from collapse diagnosis + ratios.
 */
export function explainBracelet(
  collapse: CollapseReport,
  ratios: Record<ElementName, number>,
): string {
  if (!collapse.isCollapsed) {
    return 'Your Qi distribution is balanced. This bracelet follows the standard ' +
      '5-element harmony ratio (20% each) to maintain stability and prevent drift.';
  }

  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const ratioStr = ELS
    .filter(el => ratios[el] > 0)
    .map(el => `${el} ${(ratios[el] * 100).toFixed(0)}%`)
    .join(', ');

  if (collapse.type?.includes('從旺格') && collapse.dominantElement) {
    const dom = collapse.dominantElement;
    const child = GENERATES[dom];
    return `Your chart is in a Dominance Collapse (${dom} 從旺格). ` +
      `${dom} is too strong to fight directly — the bracelet follows the flow, ` +
      `using ${child} to gently exhaust ${dom} while avoiding ` +
      `${collapse.forbidden.join(' and ')} (which would feed or be overwhelmed by ${dom}). ` +
      `Target ratio: ${ratioStr}.`;
  }

  if (collapse.type?.includes('虛弱') && collapse.weakestElement) {
    const weak = collapse.weakestElement;
    const mother = GENERATED_BY[weak];
    return `Your chart is in a Starvation Collapse (${weak} 虛弱). ` +
      `${weak} is critically depleted — the bracelet rebuilds it through its mother ${mother}, ` +
      `while avoiding ${collapse.forbidden.join(' and ')} (which would further suppress ${weak}). ` +
      `Target ratio: ${ratioStr}.`;
  }

  return `This bracelet applies a prescriptive elemental correction based on your TFQ ratios. ` +
    `Target ratio: ${ratioStr}.`;
}

/** Capitalize first letter (e.g. 'wood' → 'Wood') */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** Map Day Master stem character to polarity */
function getDayMasterPolarity(stemChar: string): Polarity {
  const YANG_STEMS = new Set(['甲', '丙', '戊', '庚', '壬']);
  return YANG_STEMS.has(stemChar) ? 'Yang' : 'Yin';
}

/** Pick the best polarity-matched stones from the useful elements */
function pickStones(
  elements: ElementName[],
  preferredPolarity: Polarity,
  forbidden: ElementName[],
  max: number
): Stone[] {
  const picked: Stone[] = [];
  const usedNames = new Set<string>();

  // First pass: exact polarity match + Yin-Yang (versatile) from useful elements
  for (const el of elements) {
    if (forbidden.includes(el)) continue;
    const matches = STONE_DATABASE
      .filter(s => s.element === el &&
        (s.polarity === preferredPolarity || s.polarity === 'Yin-Yang') &&
        !usedNames.has(s.name))
      .sort((a, b) => b.baseQi - a.baseQi);
    for (const s of matches) {
      if (picked.length >= max) break;
      picked.push(s);
      usedNames.add(s.name);
    }
  }

  // Second pass: any polarity from useful elements if we still need more
  if (picked.length < max) {
    for (const el of elements) {
      if (forbidden.includes(el)) continue;
      const matches = STONE_DATABASE
        .filter(s => s.element === el && !usedNames.has(s.name))
        .sort((a, b) => b.baseQi - a.baseQi);
      for (const s of matches) {
        if (picked.length >= max) break;
        picked.push(s);
        usedNames.add(s.name);
      }
    }
  }

  return picked;
}

/**
 * Legacy simple recommendation (used for basic deficit filling when no threat).
 * Kept for backward compatibility.
 */
export function recommendStones(
  deficits: { element: ElementName; deficit: number }[],
  maxStones = 3
): StoneRecommendation[] {
  const needed = deficits.filter(d => d.deficit > 3);
  if (needed.length === 0) return [];

  needed.sort((a, b) => b.deficit - a.deficit);

  const recommendations: StoneRecommendation[] = [];
  const usedElements = new Set<ElementName>();

  for (const { element, deficit } of needed) {
    if (recommendations.length >= maxStones) break;

    const stones = STONE_DATABASE
      .filter(s => s.element === element)
      .sort((a, b) => b.baseQi - a.baseQi);

    if (stones.length > 0) {
      const stoneIdx = usedElements.has(element) ? 1 : 0;
      const stone = stones[Math.min(stoneIdx, stones.length - 1)];
      usedElements.add(element);

      recommendations.push({
        stone,
        reason: `${element} deficit of ${deficit.toFixed(1)}% — ${stone.name} (${stone.chineseName || ''}) provides ${element} energy`,
        priority: deficit,
      });
    }
  }

  return recommendations;
}

/** Get all stones for a specific element, optionally filtered by polarity.
 *  Yin-Yang stones are included when filtering by either Yang or Yin. */
export function getStonesForElement(element: ElementName, polarity?: Polarity): Stone[] {
  return STONE_DATABASE
    .filter(s => s.element === element &&
      (!polarity || s.polarity === polarity || s.polarity === 'Yin-Yang'))
    .sort((a, b) => b.baseQi - a.baseQi);
}

// ============================================================================
// BRACELET REMEDY ENGINE — Bead Ratios, Counts, Sequencing
// ============================================================================

/** Sheng cycle order for bracelet bead sequencing */
const SHENG_ORDER: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export interface BraceletBead {
  stone: Stone;
  position: number;       // 0-based position on the bracelet
  clusterIndex: number;   // which repeating cluster this bead belongs to
}

export interface BraceletDesign {
  totalBeads: number;
  ratios: Record<ElementName, number>;       // 0-1 proportions
  beadCounts: Record<ElementName, number>;   // actual bead counts
  cluster: Stone[];                          // the repeating cluster pattern
  clusterCount: number;                      // how many times the cluster repeats
  sequence: BraceletBead[];                  // full ordered bead sequence (polarity-balanced)
  visualBeads: VisualBead[];                 // UI-ready layout with angles/sizes
  narrative: string;                         // human-readable remedy explanation
  notes: string[];
  wristSide: 'left' | 'right';
  wristReason: string;
}

/**
 * Design a complete bracelet based on Yong Shen result + collapse info.
 *
 * The bracelet follows classical BaZi remedy principles:
 * 1. Collapse mode determines element ratios (2:1, 1:1, etc.)
 * 2. Polarity matches Day Master for proper interaction
 * 3. Stones are sequenced in Sheng (generative) cycle clusters
 * 4. Left wrist for receiving (drained/deficient), right for projecting (excess)
 */
export function designBracelet(
  yongShen: YongShenResult,
  dayMasterStem: string,
  totalBeads = 21
): BraceletDesign {
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const dmPolarity = getDayMasterPolarity(dayMasterStem);
  const notes: string[] = [];

  // ── 1. Determine element ratios from Yong Shen status ──
  const ratios: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const usefulEls = yongShen.usefulElements || [];

  if (yongShen.status === 'collapse_override' && yongShen.collapseMode) {
    switch (yongShen.collapseMode) {
      case 'single-dominant':
        // Follow structure: 60/40 primary/backup
        if (usefulEls[0]) ratios[usefulEls[0]] = 0.6;
        if (usefulEls[1]) ratios[usefulEls[1]] = 0.4;
        else if (usefulEls[0]) ratios[usefulEls[0]] = 1.0;
        notes.push(`Follow-Structure (從旺格): ${usefulEls[0]} 60% + ${usefulEls[1] || 'backup'} 40%.`);
        break;
      case 'bi-polar':
        // Bridge: 50/50
        if (usefulEls[0]) ratios[usefulEls[0]] = 0.5;
        if (usefulEls[1]) ratios[usefulEls[1]] = 0.5;
        else if (usefulEls[0]) ratios[usefulEls[0]] = 1.0;
        notes.push(`Bi-Polar Bridge (兩神成象): ${usefulEls[0]} 50% + ${usefulEls[1] || 'backup'} 50%.`);
        break;
      case 'drained':
        // Mother feeding: 67/33 (2:1 mother to drained)
        if (usefulEls[0]) ratios[usefulEls[0]] = 0.67;
        if (usefulEls[1]) ratios[usefulEls[1]] = 0.33;
        else if (usefulEls[0]) ratios[usefulEls[0]] = 1.0;
        notes.push(`Drained Element (虛弱): ${usefulEls[0]} (mother) 67% + ${usefulEls[1] || ''} 33%.`);
        break;
      case 'inverted':
        // Counter dominant: 80/20
        if (usefulEls[0]) ratios[usefulEls[0]] = 0.8;
        if (usefulEls[1]) ratios[usefulEls[1]] = 0.2;
        else if (usefulEls[0]) ratios[usefulEls[0]] = 1.0;
        notes.push(`Inverted Structure (反局): ${usefulEls[0]} (controller) 80% + ${usefulEls[1] || 'exhaustor'} 20%.`);
        break;
    }
  } else if (yongShen.status === 'critical_imbalance') {
    // Critical: 70/30 controller/exhaustor
    if (usefulEls[0]) ratios[usefulEls[0]] = 0.7;
    if (usefulEls[1]) ratios[usefulEls[1]] = 0.3;
    else if (usefulEls[0]) ratios[usefulEls[0]] = 1.0;
    notes.push(`Critical Imbalance: ${usefulEls[0]} (controller) 70% + ${usefulEls[1] || ''} (exhaustor) 30%.`);
  } else {
    // Balanced: distribute across deficits
    const count = usefulEls.length || 1;
    usefulEls.forEach(el => { ratios[el] = 1 / count; });
    if (usefulEls.length === 0) {
      // Truly balanced — gentle all-element bracelet
      ELS.forEach(el => { ratios[el] = 0.2; });
      notes.push('Balanced chart: gentle all-element maintenance bracelet.');
    } else {
      notes.push(`Balanced deficit-fill: ${usefulEls.join(' + ')}.`);
    }
  }

  // ── 2. Compute bead counts ──
  const beadCounts: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  let assigned = 0;
  const activeEls = ELS.filter(el => ratios[el] > 0);

  // Round proportionally
  activeEls.forEach(el => {
    beadCounts[el] = Math.round(ratios[el] * totalBeads);
    assigned += beadCounts[el];
  });

  // Fix rounding difference
  const diff = totalBeads - assigned;
  if (diff !== 0 && activeEls.length > 0) {
    // Add/subtract from the highest-ratio element
    const topEl = activeEls.sort((a, b) => ratios[b] - ratios[a])[0];
    beadCounts[topEl] += diff;
  }

  // ── 3. Select stones per element (polarity-balanced) ──
  // Split each element's bead count into Yang and Yin halves, then interleave.
  // DM polarity gets the slight majority (ceil vs floor) but never dominates.
  const forbidden = new Set(yongShen.forbidden || []);
  const stoneSelections: Record<ElementName, Stone[]> = { Wood: [], Fire: [], Earth: [], Metal: [], Water: [] };

  for (const el of activeEls) {
    if (forbidden.has(el)) continue;
    const count = beadCounts[el];
    if (count <= 0) continue;

    const yangPool = STONE_DATABASE
      .filter(s => s.element === el && s.polarity === 'Yang')
      .sort((a, b) => b.baseQi - a.baseQi);
    const yinPool = STONE_DATABASE
      .filter(s => s.element === el && s.polarity === 'Yin')
      .sort((a, b) => b.baseQi - a.baseQi);

    // DM polarity gets ceil, opposite gets floor
    let yangCount: number, yinCount: number;
    if (dmPolarity === 'Yang') {
      yangCount = yangPool.length > 0 ? Math.ceil(count / 2) : 0;
      yinCount = yinPool.length > 0 ? count - yangCount : 0;
    } else {
      yinCount = yinPool.length > 0 ? Math.ceil(count / 2) : 0;
      yangCount = yangPool.length > 0 ? count - yinCount : 0;
    }
    // If one pool is empty, the other takes all
    if (yangPool.length === 0) { yinCount = count; yangCount = 0; }
    if (yinPool.length === 0) { yangCount = count; yinCount = 0; }

    // Interleave: Yang → Yin → Yang → Yin (Qi breathing rhythm)
    // Use prime-offset round-robin for diversity (cycle through all unique stones)
    let yUsed = 0, nUsed = 0;
    while (yUsed < yangCount || nUsed < yinCount) {
      if (yUsed < yangCount) {
        stoneSelections[el].push(yangPool[(yUsed * 7) % yangPool.length]);
        yUsed++;
      }
      if (nUsed < yinCount) {
        stoneSelections[el].push(yinPool[(nUsed * 5) % yinPool.length]);
        nUsed++;
      }
    }
  }

  // ── 4. Build sequence via polarity-aware Sheng round-robin ──
  // Cycles through elements in Sheng order. For each element, picks the
  // next stone whose polarity is OPPOSITE to the previous bead. This gives
  // perfect Sheng adjacency + polarity breathing WITHOUT a post-process
  // swap that would break element ordering.
  const shengElements = SHENG_ORDER.filter(el => beadCounts[el] > 0 && !forbidden.has(el));
  const cursors: Record<string, number> = {};
  shengElements.forEach(el => { cursors[el] = 0; });

  // Build a representative cluster for narrative (first stone of each element)
  const cluster: Stone[] = shengElements
    .map(el => stoneSelections[el][0])
    .filter(Boolean);

  const uniqueStoneNames = new Set<string>();

  const sequence: BraceletBead[] = [];
  let pos = 0;
  let cycle = 0;

  while (pos < totalBeads) {
    for (const el of shengElements) {
      if (pos >= totalBeads) break;
      const pool = stoneSelections[el];
      if (pool.length === 0) continue;

      // Pick stone with opposite polarity to previous bead (Qi breathing)
      const prevPolarity = sequence.length > 0 ? sequence[sequence.length - 1].stone.polarity : null;
      let stone: Stone | null = null;
      if (prevPolarity) {
        // Scan from cursor for opposite polarity
        for (let scan = 0; scan < pool.length; scan++) {
          const candidate = pool[(cursors[el] + scan) % pool.length];
          if (candidate.polarity !== prevPolarity) {
            stone = candidate;
            cursors[el] = (cursors[el] + scan + 1) % pool.length;
            break;
          }
        }
      }
      // Fallback: just take the next stone in order
      if (!stone) {
        stone = pool[cursors[el] % pool.length];
        cursors[el] = (cursors[el] + 1) % pool.length;
      }

      uniqueStoneNames.add(stone.name);
      sequence.push({ stone, position: pos, clusterIndex: cycle });
      pos++;
    }
    cycle++;
  }

  notes.push(`Sheng cycle: ${shengElements.join(' → ')} — ${cycle} loops through ${uniqueStoneNames.size} unique stones.`);
  notes.push('Each bead feeds the next in the generative cycle: Wood→Fire→Earth→Metal→Water.');

  // ── 6. Wrist side ──
  // Left = receiving (Yin side) — use when absorbing external support
  // Right = projecting (Yang side) — use when pushing excess outward
  const needsReceiving = yongShen.status === 'collapse_override' && yongShen.collapseMode === 'drained';
  const wristSide: 'left' | 'right' = needsReceiving ? 'left' : 'left'; // Default left for most cases
  const wristReason = needsReceiving
    ? 'Left wrist (receiving/Yin side): absorb external structural support for drained element.'
    : 'Left wrist (receiving/Yin side): draw remedy Qi inward toward your center.';

  notes.push(`Wear on ${wristSide} wrist: ${wristReason}`);

  // ── 7. Polarity is already balanced by the Sheng round-robin (step 4) ──
  // No post-process swap needed — this preserves perfect Sheng adjacency.
  const balanced = sequence;

  // ── 8. Build visual layout data ──
  const visualBeads: VisualBead[] = balanced.map((bead, i) => ({
    id: `${bead.stone.name.replace(/\s+/g, '-')}-${i}`,
    stone: bead.stone,
    position: i,
    angleDeg: (360 / totalBeads) * i,
    color: bead.stone.color,
    element: bead.stone.element,
    polarity: bead.stone.polarity,
    sizeMm: bead.stone.element === 'Earth' ? 8 : 6,
    clusterIndex: bead.clusterIndex,
  }));

  // ── 9. Generate remedy narrative ──
  const narrative = generateRemedyNarrative(yongShen, cluster, ratios, notes);

  return {
    totalBeads,
    ratios,
    beadCounts,
    cluster,
    clusterCount: cycle,
    sequence: balanced,
    visualBeads,
    narrative,
    notes,
    wristSide,
    wristReason,
  };
}

// ============================================================================
// POLARITY BALANCER — Alternates Yin/Yang to prevent overstimulation
// ============================================================================

function balancePolaritySequence(beads: BraceletBead[]): BraceletBead[] {
  if (beads.length <= 1) return beads;

  // Aggressive polarity alternation: if same polarity as previous, look ahead
  // for ANY bead with opposite polarity and swap (up to 5 positions ahead).
  const pool = [...beads];
  const result: BraceletBead[] = [pool[0]];

  for (let i = 1; i < pool.length; i++) {
    const prev = result[result.length - 1];
    const curr = pool[i];

    if (curr.stone.polarity === prev.stone.polarity) {
      // Look ahead for opposite polarity swap candidate
      let swapped = false;
      for (let j = i + 1; j < pool.length && j <= i + 5; j++) {
        if (pool[j].stone.polarity !== prev.stone.polarity) {
          result.push({ ...pool[j], position: i });
          pool[j] = { ...curr, position: j };
          swapped = true;
          break;
        }
      }
      if (!swapped) {
        result.push(curr);
      }
    } else {
      result.push(curr);
    }
  }

  return result;
}

// ============================================================================
// VISUAL BEAD — Layout data for UI rendering
// ============================================================================

export interface VisualBead {
  id: string;
  stone: Stone;
  position: number;
  angleDeg: number;       // Angle on circular bracelet (0-360)
  color: string;
  element: ElementName;
  polarity: Polarity;
  sizeMm: number;         // Bead diameter in mm
  clusterIndex: number;
}

// ============================================================================
// REMEDY NARRATIVE — Human-readable explanation
// ============================================================================

function generateRemedyNarrative(
  yongShen: YongShenResult,
  cluster: Stone[],
  ratios: Record<ElementName, number>,
  notes: string[]
): string {
  const activeEls = (['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as ElementName[])
    .filter(el => ratios[el] > 0);
  const stoneNames = [...new Set(cluster.map(s => `${s.name} (${s.chineseName || ''})`))].join(', ');

  const ratioLine = activeEls
    .map(el => `${el}: ${(ratios[el] * 100).toFixed(0)}%`)
    .join(', ');

  let collapseLine = '';
  if (yongShen.status === 'collapse_override') {
    const modes: Record<string, string> = {
      'single-dominant': 'This month collapses into a Single-Dominant structure (從旺格). The dominant element is too powerful to fight — the bracelet follows its flow, using its child element to gently exhaust.',
      'bi-polar': 'This month forms a Bi-Polar structure (兩神成象). Two elements dominate while the others fade. The bracelet bridges the two poles with a mediating element.',
      'drained': 'This month shows a Drained structure (虛弱). One element has nearly vanished. The bracelet supports the mother element to rebuild the drained element indirectly — feeding it directly would waste Qi.',
      'inverted': 'This month is Inverted (反局). The dominant element is disproportionately strong. The bracelet applies its controller directly to restore balance.',
    };
    collapseLine = modes[yongShen.collapseMode || ''] || '';
  } else if (yongShen.status === 'critical_imbalance') {
    collapseLine = `This month has a critical imbalance — ${yongShen.threat} dominates at ${yongShen.threatPercentage?.toFixed(1)}%. The bracelet applies controlling and exhausting elements.`;
  } else {
    collapseLine = 'This month is balanced. The bracelet provides gentle supplementation for minor deficits.';
  }

  const forbiddenLine = yongShen.forbidden?.length > 0
    ? `Forbidden elements: ${yongShen.forbidden.join(', ')}. These would worsen the imbalance.`
    : '';

  return [
    collapseLine,
    '',
    `Stones: ${stoneNames}`,
    `Ratio: ${ratioLine}`,
    '',
    `The beads are arranged in the Sheng (generative) cycle — each stone feeds the next, creating a continuous flow of Qi around the wrist.`,
    '',
    forbiddenLine,
    '',
    `Wear on the left wrist (receiving/Yin side) to draw remedy Qi inward.`,
  ].filter(Boolean).join('\n');
}

// ============================================================================
// QI PHYSICS LAYER — Bracelet influence on the Five-Element radar
// ============================================================================
// The bracelet is a modifier, not a rewrite. It has two channels:
//   BRQ_A (reactive)  — closes 35% of the TFQ→MFFQ gap
//   BRQ_B (proactive) — reinforces 10% of natal TFQ ("upgrade the car")
// Hard-capped at ±15% of natal TFQ per element. No over-promising.
// Month-type tuning: drained months get +25% leverage, overcrowded get −25%.

export const QI_PHYSICS_CAPS = {
  monthlyCorrectionPct: 0.35,   // BRQ_A: close 35% of TFQ–MFFQ gap
  natalReinforcementPct: 0.10,  // BRQ_B: reinforce 10% of TFQ
  totalElementCap: 0.15,        // hard ceiling: ±15% of TFQ
};

export const BEAD_SIZE_FACTOR: Record<number, number> = {
  6: 0.8,
  8: 1.0,
  10: 1.3,
};

export type MonthQiType = 'normal' | 'drained' | 'overcrowded';

export interface BraceletQiUnits {
  perElement: Record<ElementName, number>;
  totalUnits: number;
  beadCount: number;
}

export interface RadarShiftResult {
  tfq: Record<ElementName, number>;
  mffq: Record<ElementName, number>;
  afterBracelet: Record<ElementName, number>;
  delta: Record<ElementName, number>;       // per-element shift
  totalShiftPct: number;                     // sum of absolute deltas
  monthType: MonthQiType;
}

/**
 * Convert a bracelet's bead sequence into Qi units per element.
 * Each bead contributes: sizeFactor × (stone.baseQi/100) × roleFactor
 *   roleFactor: 1.0 if stone element is in Yong Shen useful list,
 *               0.7 if stone element is the "mother" of a useful element,
 *               0.5 otherwise.
 */
export function computeBraceletQiUnits(
  sequence: BraceletBead[],
  yongShen: YongShenResult,
  beadSizeMm = 8,
): BraceletQiUnits {
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const perElement: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const usefulSet = new Set(yongShen.usefulElements || []);

  // Mother map: which element generates which
  const motherOf: Record<ElementName, ElementName> = {
    Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal',
  };

  // Check if an element is the mother of any useful element
  const isMotherOfUseful = (el: ElementName): boolean =>
    ELS.some(useful => usefulSet.has(useful) && motherOf[useful] === el);

  for (const bead of sequence) {
    const el = bead.stone.element;
    const sizeFactor = BEAD_SIZE_FACTOR[beadSizeMm] ?? BEAD_SIZE_FACTOR[bead.stone.element === 'Earth' ? 10 : 8] ?? 1.0;
    const eff = (bead.stone.baseQi ?? 80) / 100;
    const roleFactor = usefulSet.has(el) ? 1.0 : isMotherOfUseful(el) ? 0.7 : 0.5;

    perElement[el] += sizeFactor * eff * roleFactor;
  }

  const totalUnits = ELS.reduce((s, el) => s + perElement[el], 0);

  return { perElement, totalUnits, beadCount: sequence.length };
}

/**
 * Detect month type from collapse mode or element distribution.
 */
export function detectMonthQiType(yongShen: YongShenResult): MonthQiType {
  if (yongShen.status === 'collapse_override') {
    if (yongShen.collapseMode === 'drained') return 'drained';
    if (yongShen.collapseMode === 'single-dominant' || yongShen.collapseMode === 'inverted') return 'overcrowded';
  }
  return 'normal';
}

/**
 * Apply bracelet Qi influence to MFFQ.
 * Returns the corrected radar values (MFFQ + BRQ).
 *
 * Two channels:
 *   BRQ_A = correctionPct × (TFQ − MFFQ)      → reactive (fix the month)
 *   BRQ_B = reinforcementPct × TFQ             → proactive (strengthen baseline)
 *
 * Scaled by the bracelet's Qi budget per element (normalized),
 * then hard-capped at ±totalElementCap × TFQ.
 */
export function applyBraceletToMFFQ(
  tfq: Record<ElementName, number>,
  mffq: Record<ElementName, number>,
  braceletQi: BraceletQiUnits,
  monthType: MonthQiType = 'normal',
): RadarShiftResult {
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const afterBracelet: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const delta: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  // Month-type multiplier: drained = more leverage, overcrowded = less
  const monthMult = monthType === 'drained' ? 1.25 : monthType === 'overcrowded' ? 0.75 : 1.0;

  // Normalize bracelet Qi per element (0–1 scale)
  const maxQi = Math.max(...ELS.map(el => braceletQi.perElement[el]), 0.01);

  for (const el of ELS) {
    const gap = (tfq[el] || 0) - (mffq[el] || 0);
    const natalValue = tfq[el] || 0;

    // Channel A: reactive correction
    const correction = QI_PHYSICS_CAPS.monthlyCorrectionPct * gap;

    // Channel B: proactive reinforcement
    const reinforcement = QI_PHYSICS_CAPS.natalReinforcementPct * natalValue;

    // Raw influence (always additive — bracelet pushes toward natal + a bit beyond)
    let rawDelta = (correction + reinforcement) * monthMult;

    // Scale by bracelet Qi budget for this element (0–1)
    const qiScale = braceletQi.perElement[el] / maxQi;
    rawDelta *= qiScale;

    // Hard cap: ±15% of natal TFQ
    const maxShift = QI_PHYSICS_CAPS.totalElementCap * Math.max(natalValue, 1);
    rawDelta = Math.max(-maxShift, Math.min(maxShift, rawDelta));

    delta[el] = Math.round(rawDelta * 100) / 100;
    afterBracelet[el] = Math.round(((mffq[el] || 0) + delta[el]) * 100) / 100;
  }

  const totalShiftPct = Math.round(ELS.reduce((s, el) => s + Math.abs(delta[el]), 0) * 100) / 100;

  return { tfq, mffq, afterBracelet, delta, totalShiftPct, monthType };
}

/**
 * Full radar shift simulation — convenience wrapper.
 * Returns all three curves for the UI pentagon.
 */
export function simulateRadarShift(
  tfq: Record<ElementName, number>,
  mffq: Record<ElementName, number>,
  bracelet: BraceletDesign,
  yongShen: YongShenResult,
  beadSizeMm = 8,
): RadarShiftResult {
  const qiUnits = computeBraceletQiUnits(bracelet.sequence, yongShen, beadSizeMm);
  const monthType = detectMonthQiType(yongShen);
  return applyBraceletToMFFQ(tfq, mffq, qiUnits, monthType);
}

// ============================================================================
// STONE EFFECTIVENESS CALCULATOR — Context-aware per-stone scoring
// ============================================================================

export interface StoneEffectivenessScore {
  stone: Stone;
  baseScore: number;        // 0–100: raw stone effectiveness
  polarityBonus: number;    // 0–20: polarity match with Day Master
  elementMatch: number;     // 0–30: how badly the chart needs this element
  collapseBonus: number;    // 0–20: alignment with collapse override rules
  forbiddenPenalty: number; // 0–100: penalty if element is forbidden
  totalScore: number;       // 0–100: final weighted score
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  explanation: string;
}

/**
 * Calculate how effective a specific stone would be for a given chart state.
 *
 * Scores from 0–100:
 *   S (90+) = Perfect match   A (75+) = Excellent
 *   B (60+) = Good            C (40+) = Moderate
 *   D (20+) = Weak            F (<20) = Harmful / Forbidden
 */
export function calculateStoneEffectiveness(
  stone: Stone,
  yongShen: YongShenResult,
  dynamicPool: Record<ElementName, number>,
  dayMasterStem: string,
): StoneEffectivenessScore {
  const dmPolarity = getDayMasterPolarity(dayMasterStem);
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const total = ELS.reduce((s, el) => s + (dynamicPool[el] || 0), 0);

  // 1. Base score from stone's intrinsic effectiveness (0–30)
  const baseScore = Math.round(stone.baseQi * 30);

  // 2. Polarity match (0–20)
  const polarityBonus = stone.polarity === dmPolarity ? 20 : 5;

  // 3. Element need — how much does the chart need this element? (0–30)
  const elPct = total > 0 ? ((dynamicPool[stone.element] || 0) / total) * 100 : 20;
  // Lower % = higher need. Ideal = 20%, below that = more needed
  let elementMatch: number;
  if (elPct < 5)       elementMatch = 30;   // Critically needed
  else if (elPct < 10) elementMatch = 25;   // Very needed
  else if (elPct < 15) elementMatch = 20;   // Needed
  else if (elPct < 25) elementMatch = 10;   // Balanced
  else if (elPct < 35) elementMatch = 5;    // Slightly excess
  else                 elementMatch = 0;    // Already dominant

  // 4. Collapse alignment bonus (0–20)
  let collapseBonus = 0;
  if (yongShen.usefulElements.includes(stone.element)) {
    collapseBonus = yongShen.status === 'collapse_override' ? 20 : 15;
  }

  // 5. Forbidden penalty (0–100)
  let forbiddenPenalty = 0;
  if (yongShen.forbidden.includes(stone.element)) {
    forbiddenPenalty = 100;
  }

  // Total
  const raw = baseScore + polarityBonus + elementMatch + collapseBonus;
  const totalScore = Math.max(0, Math.min(100, raw - forbiddenPenalty));

  // Grade
  let grade: StoneEffectivenessScore['grade'];
  if (totalScore >= 90)      grade = 'S';
  else if (totalScore >= 75) grade = 'A';
  else if (totalScore >= 60) grade = 'B';
  else if (totalScore >= 40) grade = 'C';
  else if (totalScore >= 20) grade = 'D';
  else                       grade = 'F';

  // Explanation
  const parts: string[] = [];
  if (forbiddenPenalty > 0) parts.push(`FORBIDDEN: ${yongShen.forbiddenReason || 'element is contraindicated'}`);
  if (polarityBonus >= 20)  parts.push(`Polarity match (${dmPolarity})`);
  if (elementMatch >= 25)   parts.push(`Chart critically needs ${stone.element}`);
  else if (elementMatch >= 15) parts.push(`Chart needs ${stone.element}`);
  if (collapseBonus >= 20)  parts.push(`Aligned with collapse override prescription`);
  else if (collapseBonus >= 15) parts.push(`Matches Yong Shen useful element`);

  return {
    stone,
    baseScore,
    polarityBonus,
    elementMatch,
    collapseBonus,
    forbiddenPenalty,
    totalScore,
    grade,
    explanation: parts.join('. ') || `${stone.element} stone with ${(stone.baseQi * 100).toFixed(0)}% resonance.`,
  };
}

/**
 * Score ALL stones in the database for a given chart state.
 * Returns sorted by totalScore descending.
 */
export function scoreAllStones(
  yongShen: YongShenResult,
  dynamicPool: Record<ElementName, number>,
  dayMasterStem: string,
): StoneEffectivenessScore[] {
  return STONE_DATABASE
    .map(stone => calculateStoneEffectiveness(stone, yongShen, dynamicPool, dayMasterStem))
    .sort((a, b) => b.totalScore - a.totalScore);
}

// ============================================================================
// BRACELET QUALITY SCORE — Overall bracelet design quality 0–100
// ============================================================================

export interface BraceletQualityReport {
  overall: number;          // 0–100
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    yongShenAlignment: number;   // 0–30: stones match Yong Shen prescription
    polarityBalance: number;     // 0–20: Yin/Yang distribution
    shengCycleFlow: number;      // 0–20: stones follow generative cycle
    forbiddenCheck: number;      // 0–15: no forbidden elements present
    diversityScore: number;      // 0–15: variety of stones used
  };
  warnings: string[];
  strengths: string[];
}

/**
 * Score a bracelet design for quality and classical correctness.
 */
export function scoreBracelet(
  design: BraceletDesign,
  yongShen: YongShenResult,
): BraceletQualityReport {
  const warnings: string[] = [];
  const strengths: string[] = [];
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // 1. Yong Shen alignment (0–30)
  // How well do the bracelet's element ratios match the Yong Shen prescription?
  let yongShenAlignment = 0;
  const usefulSet = new Set(yongShen.usefulElements);
  const usefulBeadPct = design.sequence
    .filter(b => usefulSet.has(b.stone.element))
    .length / design.totalBeads;

  if (usefulBeadPct >= 0.8) { yongShenAlignment = 30; strengths.push('Excellent Yong Shen alignment'); }
  else if (usefulBeadPct >= 0.6) { yongShenAlignment = 25; }
  else if (usefulBeadPct >= 0.4) { yongShenAlignment = 18; }
  else { yongShenAlignment = 10; warnings.push('Low Yong Shen alignment — bracelet may not address core imbalance'); }

  // 2. Polarity balance (0–20)
  const yangCount = design.sequence.filter(b => b.stone.polarity === 'Yang').length;
  const yinCount = design.sequence.filter(b => b.stone.polarity === 'Yin').length;
  const polarityRatio = Math.min(yangCount, yinCount) / Math.max(yangCount, yinCount, 1);

  let polarityBalance: number;
  if (polarityRatio >= 0.8) { polarityBalance = 20; strengths.push('Well-balanced Yin/Yang — Qi breathes freely'); }
  else if (polarityRatio >= 0.6) { polarityBalance = 15; strengths.push('Good Yin/Yang balance'); }
  else if (polarityRatio >= 0.4) { polarityBalance = 8; warnings.push('Polarity imbalance — consider alternating Yin/Yang stones'); }
  else if (polarityRatio >= 0.25) { polarityBalance = 3; warnings.push('Severe polarity imbalance — risk of Yang overload or Yin collapse'); }
  else { polarityBalance = 0; warnings.push('Extreme polarity imbalance — single-polarity bracelet causes energetic whiplash'); }

  // 3. Sheng cycle flow (0–20)
  // Check adjacent beads: does each feed the next in generative cycle?
  let shengHits = 0;
  for (let i = 0; i < design.sequence.length - 1; i++) {
    const curr = design.sequence[i].stone.element;
    const next = design.sequence[i + 1].stone.element;
    if (GENERATES[curr] === next) shengHits++;
  }
  // Also check wrap-around (last → first for circular bracelet)
  if (design.sequence.length > 1) {
    const last = design.sequence[design.sequence.length - 1].stone.element;
    const first = design.sequence[0].stone.element;
    if (GENERATES[last] === first) shengHits++;
  }
  const shengPct = shengHits / Math.max(design.sequence.length, 1);
  let shengCycleFlow: number;
  if (shengPct >= 0.6) { shengCycleFlow = 20; strengths.push('Strong Sheng cycle flow — Qi circulates freely'); }
  else if (shengPct >= 0.3) { shengCycleFlow = 14; }
  else if (shengPct >= 0.1) { shengCycleFlow = 8; }
  else { shengCycleFlow = 3; warnings.push('Weak Sheng cycle — consider reordering stones'); }

  // 4. Forbidden check (0–15)
  const forbiddenSet = new Set(yongShen.forbidden);
  const forbiddenBeads = design.sequence.filter(b => forbiddenSet.has(b.stone.element)).length;
  let forbiddenCheck: number;
  if (forbiddenBeads === 0) { forbiddenCheck = 15; strengths.push('No forbidden elements present'); }
  else if (forbiddenBeads <= 2) { forbiddenCheck = 5; warnings.push(`${forbiddenBeads} bead(s) use forbidden elements`); }
  else { forbiddenCheck = 0; warnings.push(`${forbiddenBeads} beads use FORBIDDEN elements — bracelet may cause harm`); }

  // 5. Diversity score (0–15)
  const uniqueStones = new Set(design.sequence.map(b => b.stone.name)).size;
  const uniqueElements = new Set(design.sequence.map(b => b.stone.element)).size;
  let diversityScore: number;
  if (uniqueStones >= 6 && uniqueElements >= 2) { diversityScore = 15; strengths.push('Rich stone variety — multiple Qi textures'); }
  else if (uniqueStones >= 4 && uniqueElements >= 2) { diversityScore = 12; strengths.push('Good stone variety'); }
  else if (uniqueStones >= 3) { diversityScore = 8; }
  else if (uniqueStones >= 2) { diversityScore = 5; }
  else { diversityScore = 2; warnings.push('Low stone diversity — single-stone bracelets lack nuance'); }

  // Overall
  const overall = yongShenAlignment + polarityBalance + shengCycleFlow + forbiddenCheck + diversityScore;

  let grade: BraceletQualityReport['grade'];
  if (overall >= 90)      grade = 'S';
  else if (overall >= 75) grade = 'A';
  else if (overall >= 60) grade = 'B';
  else if (overall >= 40) grade = 'C';
  else if (overall >= 20) grade = 'D';
  else                    grade = 'F';

  return {
    overall,
    grade,
    breakdown: { yongShenAlignment, polarityBalance, shengCycleFlow, forbiddenCheck, diversityScore },
    warnings,
    strengths,
  };
}

// ============================================================================
// STONE SUBSTITUTION ENGINE — Find replacements maintaining quality
// ============================================================================

export interface StoneSubstitution {
  original: Stone;
  replacement: Stone;
  qualityRetention: number;  // 0–100: how much quality is retained
  reason: string;
  isBudget: boolean;
}

/**
 * Find substitute stones for a given stone, ranked by quality retention.
 *
 * Prioritizes:
 * 1. Same element + same polarity (best match)
 * 2. Same element + different polarity (decent match)
 * 3. Budget alternative (if available)
 * 4. Mother element stones (generative cycle fallback)
 */
export function findSubstitutes(
  original: Stone,
  yongShen: YongShenResult,
  dayMasterStem: string,
  maxResults = 5,
): StoneSubstitution[] {
  const dmPolarity = getDayMasterPolarity(dayMasterStem);
  const forbidden = new Set(yongShen.forbidden);
  const results: StoneSubstitution[] = [];

  // Category 1: Same element, same polarity (excluding the original)
  const sameElSamePol = STONE_DATABASE.filter(s =>
    s.name !== original.name && s.element === original.element && s.polarity === original.polarity
  );
  for (const s of sameElSamePol) {
    const retention = Math.round((s.baseQi / original.baseQi) * 90);
    results.push({
      original, replacement: s,
      qualityRetention: Math.min(100, retention),
      reason: `Same element (${s.element}) and polarity (${s.polarity})`,
      isBudget: false,
    });
  }

  // Category 2: Same element, different polarity
  const sameElDiffPol = STONE_DATABASE.filter(s =>
    s.name !== original.name && s.element === original.element && s.polarity !== original.polarity
  );
  for (const s of sameElDiffPol) {
    const polPenalty = s.polarity === dmPolarity ? 0 : 10;
    const retention = Math.round((s.baseQi / original.baseQi) * 80) - polPenalty;
    results.push({
      original, replacement: s,
      qualityRetention: Math.max(0, Math.min(100, retention)),
      reason: `Same element (${s.element}), ${s.polarity} polarity`,
      isBudget: false,
    });
  }

  // Category 3: Mother element (generative cycle fallback)
  const motherEl = GENERATED_BY[original.element];
  if (motherEl && !forbidden.has(motherEl)) {
    const motherStones = STONE_DATABASE
      .filter(s => s.element === motherEl)
      .sort((a, b) => {
        const aPol = a.polarity === dmPolarity ? 1 : 0;
        const bPol = b.polarity === dmPolarity ? 1 : 0;
        return bPol - aPol || b.baseQi - a.baseQi;
      });
    for (const s of motherStones.slice(0, 2)) {
      results.push({
        original, replacement: s,
        qualityRetention: Math.round(s.baseQi / original.baseQi * 60),
        reason: `Mother element (${motherEl} generates ${original.element}) — indirect support`,
        isBudget: false,
      });
    }
  }

  // Filter out forbidden replacements, sort by retention, limit
  return results
    .filter(r => !forbidden.has(r.replacement.element))
    .sort((a, b) => b.qualityRetention - a.qualityRetention)
    .slice(0, maxResults);
}

// ============================================================================
// BRACELET EXPORT SCHEMA — Structured JSON for export/sharing
// ============================================================================

export interface BraceletExportSchema {
  version: '1.0';
  generated: string;                // ISO timestamp
  profile: {
    name: string;
    birthDate: string;
    dayMaster: string;
    dayMasterElement: string;
    dayMasterPolarity: Polarity;
  };
  month: {
    label: string;
    year: number;
    yongShenStatus: string;
    collapseMode?: CollapseMode;
    threat?: string;
    forbidden: string[];
    usefulElements: string[];
  };
  bracelet: {
    totalBeads: number;
    wristSide: 'left' | 'right';
    wristReason: string;
    ratios: Record<string, number>;
    beadCounts: Record<string, number>;
    quality: {
      score: number;
      grade: string;
      strengths: string[];
      warnings: string[];
    };
    beads: Array<{
      position: number;
      stone: string;
      element: string;
      polarity: string;
      color: string;
      baseQi: number;
      chineseName?: string;
    }>;
    narrative: string;
  };
}

/**
 * Build a portable JSON export of a bracelet design for sharing or printing.
 */
export function exportBraceletSchema(
  design: BraceletDesign,
  yongShen: YongShenResult,
  quality: BraceletQualityReport,
  profile: { name: string; birthDate: string },
  dayMasterStem: string,
  dayMasterElement: string,
  monthLabel: string,
  year: number,
): BraceletExportSchema {
  const dmPolarity = getDayMasterPolarity(dayMasterStem);

  return {
    version: '1.0',
    generated: new Date().toISOString(),
    profile: {
      name: profile.name,
      birthDate: profile.birthDate,
      dayMaster: dayMasterStem,
      dayMasterElement,
      dayMasterPolarity: dmPolarity,
    },
    month: {
      label: monthLabel,
      year,
      yongShenStatus: yongShen.status,
      collapseMode: yongShen.collapseMode,
      threat: yongShen.threat,
      forbidden: yongShen.forbidden,
      usefulElements: yongShen.usefulElements,
    },
    bracelet: {
      totalBeads: design.totalBeads,
      wristSide: design.wristSide,
      wristReason: design.wristReason,
      ratios: design.ratios,
      beadCounts: design.beadCounts,
      quality: {
        score: quality.overall,
        grade: quality.grade,
        strengths: quality.strengths,
        warnings: quality.warnings,
      },
      beads: design.sequence.map((b, i) => ({
        position: i,
        stone: b.stone.name,
        element: b.stone.element,
        polarity: b.stone.polarity,
        color: b.stone.color,
        baseQi: b.stone.baseQi,
        chineseName: b.stone.chineseName,
      })),
      narrative: design.narrative,
    },
  };
}

// ============================================================================
// BRACELET IMPORT VALIDATOR — Ensures saved bracelets load correctly
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a BraceletExportSchema object for correctness and completeness.
 * Use before loading saved/shared bracelet files into the UI.
 */
export function validateBraceletImport(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const VALID_ELEMENTS = new Set(['Wood', 'Fire', 'Earth', 'Metal', 'Water']);

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['No data provided or data is not an object.'], warnings: [] };
  }

  const d = data as Record<string, unknown>;

  // Version
  if (d.version !== '1.0') {
    errors.push(`Unsupported version: ${d.version ?? 'missing'}. Expected "1.0".`);
  }

  // Profile
  if (!d.profile || typeof d.profile !== 'object') {
    errors.push('Missing profile section.');
  } else {
    const p = d.profile as Record<string, unknown>;
    if (!p.name) warnings.push('Profile name is empty.');
    if (!p.dayMaster) errors.push('Missing dayMaster in profile.');
    if (!p.dayMasterElement) errors.push('Missing dayMasterElement in profile.');
    if (p.dayMasterPolarity && p.dayMasterPolarity !== 'Yang' && p.dayMasterPolarity !== 'Yin') {
      errors.push(`Invalid dayMasterPolarity: ${p.dayMasterPolarity}`);
    }
  }

  // Month
  if (!d.month || typeof d.month !== 'object') {
    errors.push('Missing month section.');
  } else {
    const m = d.month as Record<string, unknown>;
    if (!m.label) warnings.push('Month label is empty.');
    if (typeof m.year !== 'number') errors.push('Month year must be a number.');
    if (!m.yongShenStatus) errors.push('Missing yongShenStatus in month.');
  }

  // Bracelet
  if (!d.bracelet || typeof d.bracelet !== 'object') {
    errors.push('Missing bracelet section.');
  } else {
    const b = d.bracelet as Record<string, unknown>;

    if (typeof b.totalBeads !== 'number' || (b.totalBeads as number) < 1) {
      errors.push('Invalid totalBeads — must be a positive number.');
    }

    // Ratios
    if (b.ratios && typeof b.ratios === 'object') {
      const ratios = b.ratios as Record<string, number>;
      for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
        if (typeof ratios[el] !== 'number') {
          errors.push(`Missing or invalid ratio for ${el}.`);
        }
      }
    } else {
      errors.push('Missing ratios in bracelet.');
    }

    // Bead counts
    if (b.beadCounts && typeof b.beadCounts === 'object') {
      const counts = b.beadCounts as Record<string, number>;
      const sum = Object.values(counts).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
      if (sum !== (b.totalBeads as number)) {
        warnings.push(`Bead counts sum (${sum}) doesn't match totalBeads (${b.totalBeads}).`);
      }
    }

    // Beads array
    if (!Array.isArray(b.beads)) {
      errors.push('Bracelet beads must be an array.');
    } else {
      const beads = b.beads as Array<Record<string, unknown>>;
      if (beads.length !== (b.totalBeads as number)) {
        warnings.push(`Beads array length (${beads.length}) doesn't match totalBeads (${b.totalBeads}).`);
      }
      for (let i = 0; i < beads.length; i++) {
        const bead = beads[i];
        if (!bead.stone) errors.push(`Missing stone name at bead ${i}.`);
        if (!bead.element || !VALID_ELEMENTS.has(bead.element as string)) {
          errors.push(`Invalid element "${bead.element}" at bead ${i}.`);
        }
        if (bead.position !== i) warnings.push(`Bead position mismatch at index ${i}.`);
      }
    }

    // Quality
    if (b.quality && typeof b.quality === 'object') {
      const q = b.quality as Record<string, unknown>;
      if (typeof q.score !== 'number') errors.push('Quality score must be a number.');
      if (!q.grade) warnings.push('Missing quality grade.');
    } else {
      warnings.push('Missing quality section in bracelet.');
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ============================================================================
// BRACELET COMPARISON ENGINE — Compare two bracelets month-to-month
// ============================================================================

export interface BraceletComparison {
  from: string;               // month label A
  to: string;                 // month label B
  ratioDiff: Record<ElementName, number>;     // B - A per element
  qualityDiff: number;                        // quality score B - A
  addedStones: string[];                      // stones in B not in A
  removedStones: string[];                    // stones in A not in B
  collapseShift: string;                      // "balanced → collapse_override (drained)"
  summary: string;                            // human-readable summary
}

/**
 * Compare two bracelet designs (e.g., February vs. March).
 * Both designs should be from the same user, different months.
 */
export function compareBracelets(
  a: BraceletDesign,
  b: BraceletDesign,
  aLabel: string,
  bLabel: string,
  aYongShen: YongShenResult,
  bYongShen: YongShenResult,
): BraceletComparison {
  const ELS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // Ratio differences
  const ratioDiff: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const el of ELS) {
    ratioDiff[el] = (b.ratios[el] || 0) - (a.ratios[el] || 0);
  }

  // Quality diff (requires scoring both)
  const qA = scoreBracelet(a, aYongShen);
  const qB = scoreBracelet(b, bYongShen);
  const qualityDiff = qB.overall - qA.overall;

  // Stone composition changes
  const stonesA = new Set(a.sequence.map(s => s.stone.name));
  const stonesB = new Set(b.sequence.map(s => s.stone.name));
  const addedStones = [...stonesB].filter(s => !stonesA.has(s));
  const removedStones = [...stonesA].filter(s => !stonesB.has(s));

  // Collapse mode shift
  const modeA = aYongShen.status === 'collapse_override' ? `collapse (${aYongShen.collapseMode})` : aYongShen.status;
  const modeB = bYongShen.status === 'collapse_override' ? `collapse (${bYongShen.collapseMode})` : bYongShen.status;
  const collapseShift = modeA === modeB ? `${modeA} (unchanged)` : `${modeA} → ${modeB}`;

  // Summary
  const changes: string[] = [];
  for (const el of ELS) {
    const d = ratioDiff[el];
    if (Math.abs(d) >= 0.05) {
      changes.push(`${el} ${d > 0 ? '+' : ''}${(d * 100).toFixed(0)}%`);
    }
  }
  if (qualityDiff !== 0) {
    changes.push(`Quality ${qualityDiff > 0 ? '+' : ''}${qualityDiff} pts`);
  }
  if (addedStones.length > 0) changes.push(`Added: ${addedStones.join(', ')}`);
  if (removedStones.length > 0) changes.push(`Removed: ${removedStones.join(', ')}`);
  if (modeA !== modeB) changes.push(`Structure: ${collapseShift}`);

  return {
    from: aLabel,
    to: bLabel,
    ratioDiff,
    qualityDiff,
    addedStones,
    removedStones,
    collapseShift,
    summary: changes.length > 0
      ? `${aLabel} → ${bLabel}: ${changes.join('. ')}.`
      : `${aLabel} → ${bLabel}: No significant changes.`,
  };
}

// ============================================================================
// BRACELET RECOMMENDATION ENGINE — Goal-based bracelet selection
// ============================================================================

export type UserGoal =
  | 'stability'
  | 'creativity'
  | 'wealth'
  | 'protection'
  | 'clarity'
  | 'emotionalHealing'
  | 'careerGrowth'
  | 'health';

/** Which element best supports each goal */
const GOAL_ELEMENT_MAP: Record<UserGoal, ElementName> = {
  stability: 'Earth',
  creativity: 'Wood',
  wealth: 'Earth',
  protection: 'Metal',
  clarity: 'Metal',
  emotionalHealing: 'Water',
  careerGrowth: 'Wood',
  health: 'Fire',
};

/** Classical goal descriptions */
export const GOAL_DESCRIPTIONS: Record<UserGoal, string> = {
  stability: 'Earth energy grounds and stabilizes — mountains, foundations, patience.',
  creativity: 'Wood energy grows and innovates — forests, spring, new beginnings.',
  wealth: 'Earth energy accumulates and stores — fertile soil, abundance, reserves.',
  protection: 'Metal energy shields and defends — armor, boundaries, precision.',
  clarity: 'Metal energy clarifies and purifies — crystal, focus, discernment.',
  emotionalHealing: 'Water energy soothes and flows — rivers, letting go, depth.',
  careerGrowth: 'Wood energy expands and rises — bamboo, ambition, persistence.',
  health: 'Fire energy vitalizes and warms — sunlight, circulation, vitality.',
};

export interface BraceletRecommendation {
  monthLabel: string;
  bracelet: BraceletDesign;
  score: number;            // goal-weighted score
  quality: BraceletQualityReport;
  goalAlignment: number;    // 0–100: how well this bracelet serves the goal
  reason: string;
}

/**
 * Recommend the best bracelet month for a given user goal.
 * Evaluates all 12 months and ranks by goal alignment + quality.
 */
export function recommendBraceletForGoal(
  monthBracelets: Array<{ label: string; bracelet: BraceletDesign; yongShen: YongShenResult }>,
  goal: UserGoal,
): BraceletRecommendation[] {
  const targetElement = GOAL_ELEMENT_MAP[goal];

  const scored = monthBracelets.map(({ label, bracelet, yongShen }) => {
    const quality = scoreBracelet(bracelet, yongShen);
    let score = quality.overall;

    // Goal element alignment: how much of this bracelet supports the goal element?
    const goalRatio = bracelet.ratios[targetElement] || 0;
    const goalAlignment = Math.round(goalRatio * 100);
    score += goalRatio * 50;

    // Bonus for useful elements matching goal
    if (yongShen.usefulElements.includes(targetElement)) {
      score += 15;
    }

    // Penalty for forbidden goal element
    if (yongShen.forbidden.includes(targetElement)) {
      score -= 30;
    }

    // Collapse mode penalties for specific goals
    if (goal === 'stability' && yongShen.collapseMode === 'single-dominant') score -= 10;
    if (goal === 'emotionalHealing' && yongShen.collapseMode === 'drained') score -= 10;

    // Build reason
    const parts: string[] = [];
    if (goalAlignment > 30) parts.push(`Strong ${targetElement} presence (${goalAlignment}%)`);
    if (yongShen.usefulElements.includes(targetElement)) parts.push(`${targetElement} is the Yong Shen prescription`);
    if (yongShen.forbidden.includes(targetElement)) parts.push(`Warning: ${targetElement} is forbidden this month`);
    parts.push(`Quality: ${quality.grade} (${quality.overall}/100)`);

    return {
      monthLabel: label,
      bracelet,
      score: Math.round(score),
      quality,
      goalAlignment,
      reason: parts.join('. '),
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
