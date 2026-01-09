/**
 * matchScore_baziHelpers.js
 *
 * Industry-standard BaZi compatibility scoring helpers
 * - WuXing (Five Elements) scoring using sheng/ke cycles
 * - Ten Gods scoring using 5-group model (比劫/食傷/財/官殺/印)
 * - Day Master relationship mapping (corrected)
 * - Favorable elements modifier (喜用神)
 * - Branch interactions modifier (六合/冲/刑/害)
 *
 * DATA SOURCES:
 * - seasonalStrength.percentages (POST-seasonal, preferred)
 * - elements.percentages (PRE-seasonal, fallback)
 *
 * Formula: Total = (1-α)*NEO + α*[(1-β)*WuXing + β*TenGods]
 * Recommended: α = 0.25, β = 0.30
 */

// =============================================================================
// FIVE ELEMENTS (WuXing) - 五行
// =============================================================================

export const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// 生 (sheng) - Generating cycle
export const GEN = {
  Wood: 'Fire',   // Wood feeds Fire
  Fire: 'Earth',  // Fire creates Earth (ash)
  Earth: 'Metal', // Earth bears Metal
  Metal: 'Water', // Metal collects Water
  Water: 'Wood'   // Water nourishes Wood
};

// 克 (ke) - Controlling cycle
export const CTRL = {
  Wood: 'Earth',  // Wood parts Earth (roots)
  Earth: 'Water', // Earth absorbs Water
  Water: 'Fire',  // Water extinguishes Fire
  Fire: 'Metal',  // Fire melts Metal
  Metal: 'Wood'   // Metal chops Wood
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const clamp01 = (x) => Math.max(0, Math.min(1, x));

const clampRange = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

/**
 * Element pair compatibility score based on sheng/ke relationship
 */
function elementPairScore(e1, e2) {
  if (e1 === e2) return 0.90;                              // Same element: strong resonance
  if (GEN[e1] === e2 || GEN[e2] === e1) return 0.85;       // Generating: supportive synergy
  if (CTRL[e1] === e2 || CTRL[e2] === e1) return 0.45;     // Controlling: tension
  return 0.65;                                              // Neutral
}

/**
 * Build 5x5 WuXing interaction matrix
 */
const WX_M = (() => {
  const M = Array.from({ length: 5 }, () => Array(5).fill(0));
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      M[i][j] = elementPairScore(ELEMENTS[i], ELEMENTS[j]);
    }
  }
  return M;
})();

/**
 * Normalize percentages to sum to 1.0
 * Expects percentage object with Wood/Fire/Earth/Metal/Water keys
 */
function normalizePercentages(pct) {
  if (!pct) {
    throw new Error('Missing element percentages object.');
  }
  const raw = ELEMENTS.map((e) => Math.max(0, Number(pct[e] ?? 0)));
  const sum = raw.reduce((a, b) => a + b, 0);
  if (sum <= 0) return [0.2, 0.2, 0.2, 0.2, 0.2]; // Uniform fallback
  return raw.map((x) => x / sum);
}

// =============================================================================
// WUXING COMPATIBILITY
// =============================================================================

/**
 * Compute WuXing compatibility from seasonal percentages
 * Uses bilinear form: v1 @ M @ v2
 *
 * @param {Object} pctA - Profile A's seasonalStrength.percentages
 * @param {Object} pctB - Profile B's seasonalStrength.percentages
 * @returns {number} Compatibility score 0-1
 */
export function wuxingCompatibilityFromSeasonalPercentages(pctA, pctB) {
  const v1 = normalizePercentages(pctA);
  const v2 = normalizePercentages(pctB);

  // v1 @ M @ v2 (bilinear form)
  let score = 0;
  for (let i = 0; i < 5; i++) {
    let rowDot = 0;
    for (let j = 0; j < 5; j++) {
      rowDot += WX_M[i][j] * v2[j];
    }
    score += v1[i] * rowDot;
  }
  return clamp01(score);
}

/**
 * Get WuXing vector from full bazi result (convenience wrapper)
 * Priority: seasonalStrength.percentages (POST-seasonal) > elements.percentages (PRE-seasonal)
 */
export function wuxingVectorSeasonal(bazi) {
  // Try POST-seasonal first (preferred)
  let pct = bazi?.seasonalStrength?.percentages;

  // Fallback to PRE-seasonal if POST not available
  if (!pct) {
    pct = bazi?.elements?.percentages;
    if (pct) {
      console.warn('Using elements.percentages (PRE-seasonal) - seasonalStrength.percentages preferred');
    }
  }

  if (!pct) {
    throw new Error('Missing bazi percentages (neither seasonalStrength nor elements).');
  }
  return normalizePercentages(pct);
}

// =============================================================================
// TEN GODS (十神) - 5-GROUP MODEL
// =============================================================================

// 10 individual gods (as returned by tenGodSummary)
export const TEN_GODS_10 = [
  'Companion',       // 比肩
  'Rob Wealth',      // 劫財
  'Direct Resource', // 正印
  'Indirect Resource', // 偏印
  'Direct Wealth',   // 正財
  'Indirect Wealth', // 偏財
  'Direct Officer',  // 正官
  'Seven Killings',  // 七殺
  'Eating God',      // 食神
  'Hurting Officer'  // 傷官
];

// 5 category groups (industry standard)
export const TG5 = ['Companion', 'Output', 'Wealth', 'Power', 'Resource'];

// Mapping from 10 gods to 5 groups
const TEN_GODS_TO_GROUP = {
  'Companion': 'Companion',       // 比劫 group
  'Rob Wealth': 'Companion',
  'Eating God': 'Output',         // 食傷 group
  'Hurting Officer': 'Output',
  'Direct Wealth': 'Wealth',      // 財 group
  'Indirect Wealth': 'Wealth',
  'Direct Officer': 'Power',      // 官殺 group
  'Seven Killings': 'Power',
  'Direct Resource': 'Resource',  // 印 group
  'Indirect Resource': 'Resource'
};

/**
 * Convert 10-slot tenGodSummary to normalized 5-group vector
 */
function tenGodsVector5FromSummary(summary) {
  if (!summary) {
    throw new Error('Missing tenGodSummary (required).');
  }

  // Normalize 10-slot
  const v10 = TEN_GODS_10.map((k) => Math.max(0, Number(summary[k] ?? 0)));
  const sum10 = v10.reduce((a, b) => a + b, 0);
  const n10 = sum10 > 0 ? v10.map((x) => x / sum10) : Array(10).fill(0.1);

  // Fold to 5-slot
  const acc = { Companion: 0, Output: 0, Wealth: 0, Power: 0, Resource: 0 };
  TEN_GODS_10.forEach((k, i) => {
    acc[TEN_GODS_TO_GROUP[k]] += n10[i];
  });

  const v5 = TG5.map((g) => acc[g]);
  const sum5 = v5.reduce((a, b) => a + b, 0);
  return sum5 > 0 ? v5.map((x) => x / sum5) : [0.2, 0.2, 0.2, 0.2, 0.2];
}

/**
 * 5x5 Ten Gods interaction matrix (industry-faithful heuristics)
 *
 * Interpretive basis (common BaZi relationship logic):
 * - 印↔食傷 (Resource ↔ Output): often productive (learning → expression)
 * - 財↔官殺 (Wealth ↔ Power): often productive (resources → structure/status)
 * - 比劫奪財 (Companion ↔ Wealth): can compete for wealth/resources (friction)
 * - 食傷剋官 (Output ↔ Power): often clashes (expression vs constraint)
 */
const TG5_M = (() => {
  const idx = Object.fromEntries(TG5.map((g, i) => [g, i]));
  const M = Array.from({ length: 5 }, () => Array(5).fill(0.65)); // Baseline

  // Same-group resonance
  for (let i = 0; i < 5; i++) M[i][i] = 0.90;

  // 印↔食傷 (Resource <-> Output) synergy
  M[idx.Resource][idx.Output] = 0.85;
  M[idx.Output][idx.Resource] = 0.85;

  // 財↔官殺 (Wealth <-> Power) synergy
  M[idx.Wealth][idx.Power] = 0.80;
  M[idx.Power][idx.Wealth] = 0.80;

  // 比劫奪財 (Companion <-> Wealth) friction
  M[idx.Companion][idx.Wealth] = 0.55;
  M[idx.Wealth][idx.Companion] = 0.55;

  // 食傷剋官 (Output <-> Power) friction tendency
  M[idx.Output][idx.Power] = 0.55;
  M[idx.Power][idx.Output] = 0.55;

  // Mild tensions / mild positives
  M[idx.Companion][idx.Power] = 0.62;
  M[idx.Power][idx.Companion] = 0.62;

  M[idx.Resource][idx.Wealth] = 0.72;
  M[idx.Wealth][idx.Resource] = 0.72;

  return M;
})();

/**
 * Compute Ten Gods compatibility from tenGodSummary
 *
 * @param {Object} summaryA - Profile A's tenGodSummary
 * @param {Object} summaryB - Profile B's tenGodSummary
 * @param {Object} opts - Optional: { dmStrengthA, dmStrengthB } (0-1 scale)
 * @returns {number} Compatibility score 0-1
 */
export function tenGodsCompatibilityFromSummary(summaryA, summaryB, opts = {}) {
  let v1 = tenGodsVector5FromSummary(summaryA);
  let v2 = tenGodsVector5FromSummary(summaryB);

  // ENHANCEMENT: Adjust Wealth interpretation based on Day Master strength (身强/身弱)
  // Weak DM (< 0.5): Wealth becomes pressure → reduce wealth score
  // Strong DM (> 0.5): Wealth becomes opportunity → boost wealth score
  const wealthIdx = TG5.indexOf('Wealth'); // index 2
  if (opts.dmStrengthA !== undefined) {
    const strengthA = clamp01(opts.dmStrengthA);
    const wealthModA = strengthA < 0.5 ? 0.8 : 1.1;
    v1[wealthIdx] *= wealthModA;
  }
  if (opts.dmStrengthB !== undefined) {
    const strengthB = clamp01(opts.dmStrengthB);
    const wealthModB = strengthB < 0.5 ? 0.8 : 1.1;
    v2[wealthIdx] *= wealthModB;
  }

  // Re-normalize if modified
  if (opts.dmStrengthA !== undefined || opts.dmStrengthB !== undefined) {
    const sum1 = v1.reduce((a, b) => a + b, 0);
    const sum2 = v2.reduce((a, b) => a + b, 0);
    if (sum1 > 0) v1 = v1.map((x) => x / sum1);
    if (sum2 > 0) v2 = v2.map((x) => x / sum2);
  }

  // v1 @ M @ v2 (bilinear form)
  let score = 0;
  for (let i = 0; i < 5; i++) {
    let rowDot = 0;
    for (let j = 0; j < 5; j++) {
      rowDot += TG5_M[i][j] * v2[j];
    }
    score += v1[i] * rowDot;
  }
  return clamp01(score);
}

/**
 * Get Ten Gods 5-group vector from full bazi result (convenience wrapper)
 */
export function tenGodsVector5(bazi) {
  const summary = bazi?.tenGodSummary;
  if (!summary) {
    throw new Error('Missing bazi.tenGodSummary (required).');
  }
  return tenGodsVector5FromSummary(summary);
}

// =============================================================================
// DAY MASTER RELATIONSHIP ELEMENTS (CORRECTED)
// =============================================================================

/**
 * Get the correct element relationships for a Day Master element
 *
 * CRITICAL CORRECTION:
 * For Wood (甲) Day Master:
 * - Wealth = Earth (Wood controls Earth) ← NOT Fire!
 * - Output = Fire (Wood produces Fire)
 * - Resource = Water (Water produces Wood)
 * - Power = Metal (Metal controls Wood)
 * - Companion = Wood
 *
 * @param {string} dayMasterElement - The Day Master's element
 * @returns {Object} Mapping of relationship types to elements
 */
export function dmRelationshipElements(dayMasterElement) {
  const dm = dayMasterElement;

  // DM produces → Output (食傷)
  const output = GEN[dm];

  // DM controls → Wealth (財)
  const wealth = CTRL[dm];

  // Controls DM → Power (官殺) - inverse CTRL
  const power = ELEMENTS.find((e) => CTRL[e] === dm);

  // Produces DM → Resource (印) - inverse GEN
  const resource = ELEMENTS.find((e) => GEN[e] === dm);

  return {
    Companion: dm,      // 比劫 - Same element
    Output: output,     // 食傷 - Element DM produces
    Wealth: wealth,     // 財 - Element DM controls
    Power: power,       // 官殺 - Element that controls DM
    Resource: resource  // 印 - Element that produces DM
  };
}

/**
 * Get Day Master relationship map from full bazi result
 */
export function getDayMasterRelationships(bazi) {
  const dmElement = bazi?.dayMaster?.element;
  if (!dmElement) {
    throw new Error('Missing bazi.dayMaster.element');
  }
  return dmRelationshipElements(dmElement);
}

// =============================================================================
// BAZI MODIFIERS (Industry-Real Upgrades)
// =============================================================================

/**
 * Favorable elements modifier (喜用神 alignment)
 *
 * - If A's primary favorable is strong in B's seasonal distribution, slight boost
 * - If A's avoid elements dominate B, slight penalty
 * - Symmetric: applied A→B and B→A, then multiplied
 *
 * Output: ~0.90 .. 1.10
 *
 * @param {Object} baziA - Full calculateBaZi() result for profile A
 * @param {Object} baziB - Full calculateBaZi() result for profile B
 * @returns {number} Modifier multiplier
 */
export function favorableElementsModifier(baziA, baziB) {
  const fA = baziA?.favorableElements;
  const fB = baziB?.favorableElements;
  // Try POST-seasonal first, fallback to PRE-seasonal
  const pctA = baziA?.seasonalStrength?.percentages || baziA?.elements?.percentages;
  const pctB = baziB?.seasonalStrength?.percentages || baziB?.elements?.percentages;

  // If missing, no modifier
  if (!pctA || !pctB || (!fA && !fB)) return 1.0;

  const m1 = favorableOneWay(fA, pctB);
  const m2 = favorableOneWay(fB, pctA);
  return clampRange(m1 * m2, 0.90, 1.10);
}

/**
 * One-way favorable elements calculation
 */
function favorableOneWay(fav, partnerPct) {
  if (!fav || !partnerPct) return 1.0;

  const primary = fav.primary;
  const secondary = fav.secondary;
  const avoid = Array.isArray(fav.avoid) ? fav.avoid : [];

  const p = Number(partnerPct[primary] ?? 0);
  const s = Number(partnerPct[secondary] ?? 0);

  let mod = 1.0;

  // Boost if partner carries your needed elements
  if (p >= 25) mod += 0.05;
  else if (p <= 10) mod -= 0.03;

  if (secondary) {
    if (s >= 20) mod += 0.03;
    else if (s <= 8) mod -= 0.02;
  }

  // Penalty if partner is heavy in avoid elements
  for (const e of avoid) {
    const a = Number(partnerPct[e] ?? 0);
    if (a >= 25) mod -= 0.04;
  }

  return clampRange(mod, 0.93, 1.07);
}

/**
 * Branch interactions modifier (六合/冲/刑/害)
 *
 * - 六合 / 三合 / 三会 → slight boost (harmony)
 * - 冲 / 刑 / 害 → slight penalty (conflict)
 *
 * Uses the interactions[] already output by calculateBaZi()
 * Output: ~0.88 .. 1.12
 *
 * @param {Object} baziA - Full calculateBaZi() result for profile A
 * @param {Object} baziB - Full calculateBaZi() result for profile B
 * @returns {number} Modifier multiplier
 */
export function baziInteractionModifier(baziA, baziB) {
  const ia = Array.isArray(baziA?.interactions) ? baziA.interactions : [];
  const ib = Array.isArray(baziB?.interactions) ? baziB.interactions : [];

  if (!ia.length && !ib.length) return 1.0;

  // Calculate interaction index for each chart
  const ma = interactionIndex(ia);
  const mb = interactionIndex(ib);

  // Average + combine
  const mod = 1.0 + 0.5 * (ma + mb);
  return clampRange(mod, 0.88, 1.12);
}

/**
 * Calculate interaction index from interactions array
 * Returns roughly in [-0.12, +0.12]
 */
function interactionIndex(interactions) {
  let x = 0;

  for (const it of interactions) {
    const type = String(it.type || '');
    const strength = Number(it.strength ?? it.severity ?? 0.6); // Fallback

    if (type.includes('六合') || type.includes('三合') || type.includes('三会')) {
      x += 0.06 * strength; // Harmony boost
    } else if (type.includes('冲')) {
      x -= 0.07 * strength; // Clash penalty
    } else if (type.includes('刑')) {
      x -= 0.05 * strength; // Punishment penalty
    } else if (type.includes('害')) {
      x -= 0.04 * strength; // Harm penalty
    }
  }

  return clampRange(x, -0.12, 0.12);
}

// =============================================================================
// COMBINED BAZI OVERLAY SCORE
// =============================================================================

/**
 * Compute combined BaZi overlay compatibility
 * BaZi = (1-β)*WuXing + β*TenGods
 *
 * @param {Object} baziA - Full calculateBaZi() result for profile A
 * @param {Object} baziB - Full calculateBaZi() result for profile B
 * @param {number} beta - TenGods weight within BaZi (default 0.30)
 * @returns {Object} Score and component parts
 */
export function baziOverlayCompatibility(baziA, baziB, beta = 0.30) {
  const b = clamp01(beta);

  // Try POST-seasonal first, fallback to PRE-seasonal
  const pctA = baziA?.seasonalStrength?.percentages || baziA?.elements?.percentages;
  const pctB = baziB?.seasonalStrength?.percentages || baziB?.elements?.percentages;

  const wx = wuxingCompatibilityFromSeasonalPercentages(pctA, pctB);

  const tg = tenGodsCompatibilityFromSummary(
    baziA?.tenGodSummary,
    baziB?.tenGodSummary
  );

  return {
    score: clamp01((1 - b) * wx + b * tg),
    parts: { wuxing: wx, tenGods: tg, beta: b }
  };
}

/**
 * Hybrid total compatibility:
 * Total = (1-α)*NEO + α*BaZiOverlay
 *
 * (NEO score is assumed precomputed as 0..1 similarity)
 *
 * @param {Object} params - Parameters object
 * @param {number} params.neoScore - NEO compatibility score (0-1)
 * @param {Object} params.baziA - Full calculateBaZi() result for profile A
 * @param {Object} params.baziB - Full calculateBaZi() result for profile B
 * @param {number} params.alpha - BaZi weight vs NEO (default 0.25)
 * @param {number} params.beta - TenGods weight within BaZi (default 0.30)
 * @returns {Object} Complete compatibility result
 */
export function hybridCompatibility({ neoScore, baziA, baziB, alpha = 0.25, beta = 0.30 }) {
  const a = clamp01(alpha);
  const bazi = baziOverlayCompatibility(baziA, baziB, beta);
  const total = clamp01((1 - a) * neoScore + a * bazi.score);

  return {
    total,
    neo: neoScore,
    bazi: bazi.score,
    wuxing: bazi.parts.wuxing,
    tenGods: bazi.parts.tenGods,
    alpha: a,
    beta: bazi.parts.beta
  };
}

// =============================================================================
// EXPORTS SUMMARY
// =============================================================================
//
// Main functions:
// - wuxingCompatibilityFromSeasonalPercentages(pctA, pctB)
// - tenGodsCompatibilityFromSummary(summaryA, summaryB)
// - dmRelationshipElements(dayMasterElement)
// - favorableElementsModifier(baziA, baziB)
// - baziInteractionModifier(baziA, baziB)
// - baziOverlayCompatibility(baziA, baziB, beta)
// - hybridCompatibility({ neoScore, baziA, baziB, alpha, beta })
//
// Constants:
// - ELEMENTS, GEN, CTRL
// - TEN_GODS_10, TG5
// =============================================================================
