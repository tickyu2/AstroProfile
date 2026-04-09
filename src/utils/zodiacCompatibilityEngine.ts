/**
 * 36×36 Directional Compatibility Engine
 *
 * Computes compatibility scores from first principles using 5 layers:
 *   Score(A→B) = 0.40·E + 0.20·M + 0.15·A + 0.15·Q + 0.10·P
 *
 * E = Elemental Flow  (Wu Xing generation/control cycles on 5D vectors)
 * M = Modality         (Cardinal/Fixed/Mutable directional interaction)
 * A = Aspect/Proximity (zodiac wheel distance → classical aspect pattern)
 * Q = Seasonal Qi      (Qi resonance between archetypes)
 * P = Psychological     (cosine similarity of 5D psych vectors)
 *
 * All archetype profiles derived from BaZi seasonal Qi mapping:
 *   Western dates → Earthly Branch wheel → month-averaged 5-element ratios
 *   Cusps = 0.35·SignA + 0.65·SignB
 */

// ============================================================================
// TYPES
// ============================================================================

interface ElementVector {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

type Modality = 'Cardinal' | 'Fixed' | 'Mutable';
type Polarity = 'Yang' | 'Yin';

interface ArchetypeProfile {
  elementVector: ElementVector;
  psychVector: [number, number, number, number, number]; // warmth, directness, sensitivity, stability, expressiveness
  modality: Modality;
  polarity: Polarity;
  seasonalQi: number;
}

// ============================================================================
// TUNING CONSTANTS (all in one place for easy adjustment)
// ============================================================================

/**
 * Layer weights — must sum to 1.0
 * Psychology-forward tuning: psych is the spark (variable cost),
 * elements are the long-term anchor (fixed cost).
 */
const W_ELEMENTAL  = 0.25;   // fixed cost — long-term elemental anchor
const W_MODALITY   = 0.15;   // how your engines of momentum interact
const W_ASPECT     = 0.15;   // geometric relationship on the wheel
const W_SEASONAL   = 0.20;   // lived seasonal context + element distance
const W_PSYCH      = 0.25;   // the spark — temperament, communication, pacing

/**
 * Wu Xing cycle coefficients (applied to normalized profile shapes)
 * v2 tuning: harsher control penalty (−85) creates true low scores.
 * Control is neutral (+0), not positive — controlling someone isn't a gift.
 */
const K_GEN_GIVE   = 25;   // A generates B's element (A feels nurturing)
const K_GEN_RECV   = 35;   // B generates A's element (A feels supported)
const K_CTRL_OVER  = 0;    // A controls B's element  (neutral, not positive)
const K_CTRL_UNDER = -85;  // B controls A's element  (A feels constrained — painful)
const K_COSINE     = 50;   // base resonance from vector similarity

/**
 * Modality directional scores (0–100)
 * Same-modality capped at 70 — too much sameness = stagnation:
 *   Cardinal–Cardinal = power struggle
 *   Fixed–Fixed = stubborn lock
 *   Mutable–Mutable = chaos loop
 */
const MODALITY_TABLE: Record<Modality, Record<Modality, number>> = {
  Cardinal: { Cardinal: 70, Fixed: 75, Mutable: 85 },
  Fixed:    { Cardinal: 65, Fixed: 70, Mutable: 80 },
  Mutable:  { Cardinal: 75, Fixed: 65, Mutable: 70 },
};

/** Polarity interaction modifier (added to modality score) */
const POLARITY_SAME = 3;
const POLARITY_DIFF = -3;

/**
 * Aspect scoring by zodiac wheel distance (in 36-position units)
 * Conjunction no longer god-mode (85, not 95).
 * Trine is the highest (88) — easy flow across distance.
 * Square/quincunx less punishing (55/50) — tension ≠ incompatibility.
 * Opposition upgraded (65) — charged polarity, not pure conflict.
 */
/**
 * Aspect anchors v2 — wider spread, more realistic:
 * - Conjunction down to 78 (good but not magical)
 * - Square up to 68 (creative tension, not punishment)
 * - Trine down to 82 (still best, no longer dominating)
 * - Opposition up to 70 (chemistry, not conflict)
 */
const ASPECT_ANCHORS: [number, number][] = [
  [0,  78],   // conjunction — good but not magical
  [1,  74],   // near-conjunction (adjacent cusp)
  [2,  70],   // semi-sextile zone
  [3,  68],   // semi-sextile — mild harmony
  [6,  75],   // sextile — cooperative flow
  [9,  68],   // square — creative tension deserves mid-range
  [12, 82],   // trine — still best, no longer dominating
  [15, 55],   // quincunx — weird but interesting
  [18, 70],   // opposition — charged polarity, not conflict
];

// ============================================================================
// 36 ARCHETYPE PROFILES (derived from BaZi seasonal Qi mapping)
// Order matches MATRIX_LABELS in cuspCompatibilityMatrix.js
// ============================================================================

const PROFILES: ArchetypeProfile[] = [
  // 0: AR-PI — Aries with Pisces Echo
  { elementVector: { wood: 1.10, fire: 1.03, earth: 0.95, metal: 0.75, water: 0.70 },
    psychVector: [0.83, 0.415, 0.735, 0.4, 0.835], modality: 'Cardinal', polarity: 'Yang', seasonalQi: 0.906 },
  // 1: AR — Pure Aries
  { elementVector: { wood: 1.07, fire: 1.07, earth: 0.97, metal: 0.77, water: 0.72 },
    psychVector: [0.7, 0.9, 0.3, 0.4, 0.9], modality: 'Cardinal', polarity: 'Yang', seasonalQi: 0.92 },
  // 2: AR-TA — Aries with Taurus Pull
  { elementVector: { wood: 0.98, fire: 1.13, earth: 1.00, metal: 0.81, water: 0.72 },
    psychVector: [0.755, 0.615, 0.495, 0.705, 0.635], modality: 'Fixed', polarity: 'Yin', seasonalQi: 0.9135 },
  // 3: TA-AR — Taurus with Aries Fire
  { elementVector: { wood: 1.0125, fire: 1.135, earth: 0.9675, metal: 0.7675, water: 0.70 },
    psychVector: [0.745, 0.615, 0.435, 0.575, 0.685], modality: 'Cardinal', polarity: 'Yang', seasonalQi: 0.9165 },
  // 4: TA — Pure Taurus
  { elementVector: { wood: 0.85, fire: 1.20, earth: 1.00, metal: 0.80, water: 0.70 },
    psychVector: [0.8, 0.4, 0.6, 0.9, 0.4], modality: 'Fixed', polarity: 'Yin', seasonalQi: 0.91 },
  // 5: TA-GE — Taurus with Gemini Breeze
  { elementVector: { wood: 0.7525, fire: 1.20, earth: 1.00, metal: 0.8325, water: 0.70 },
    psychVector: [0.735, 0.595, 0.47, 0.48, 0.785], modality: 'Mutable', polarity: 'Yang', seasonalQi: 0.897 },
  // 6: GE-TA — Gemini with Taurus Roots
  { elementVector: { wood: 0.7975, fire: 1.20, earth: 1.00, metal: 0.8175, water: 0.70 },
    psychVector: [0.755, 0.505, 0.53, 0.69, 0.565], modality: 'Fixed', polarity: 'Yin', seasonalQi: 0.903 },
  // 7: GE — Pure Gemini
  { elementVector: { wood: 0.70, fire: 1.28, earth: 0.93, metal: 0.78, water: 0.70 },
    psychVector: [0.7, 0.7, 0.4, 0.3, 0.9], modality: 'Mutable', polarity: 'Yang', seasonalQi: 0.89 },
  // 8: GE-CA — Gemini with Cancer Depth
  { elementVector: { wood: 0.70, fire: 1.135, earth: 1.065, metal: 0.8825, water: 0.70 },
    psychVector: [0.83, 0.385, 0.735, 0.565, 0.77], modality: 'Cardinal', polarity: 'Yin', seasonalQi: 0.8965 },
  // 9: CA-GE — Cancer with Gemini Wings
  { elementVector: { wood: 0.70, fire: 1.165, earth: 1.035, metal: 0.8675, water: 0.70 },
    psychVector: [0.79, 0.53, 0.535, 0.44, 0.83], modality: 'Mutable', polarity: 'Yang', seasonalQi: 0.8935 },
  // 10: CA — Pure Cancer
  { elementVector: { wood: 0.70, fire: 1.10, earth: 1.10, metal: 0.90, water: 0.70 },
    psychVector: [0.9, 0.3, 0.9, 0.7, 0.7], modality: 'Cardinal', polarity: 'Yin', seasonalQi: 0.90 },
  // 11: CA-LE — Cancer with Leo Warmth
  { elementVector: { wood: 0.70, fire: 0.97, earth: 1.10, metal: 0.9975, water: 0.70 },
    psychVector: [0.87, 0.665, 0.535, 0.63, 0.83], modality: 'Fixed', polarity: 'Yang', seasonalQi: 0.8935 },
  // 12: LE-CA — Leo with Cancer Heart
  { elementVector: { wood: 0.70, fire: 1.035, earth: 1.10, metal: 0.9525, water: 0.70 },
    psychVector: [0.84, 0.455, 0.705, 0.665, 0.79], modality: 'Cardinal', polarity: 'Yin', seasonalQi: 0.8965 },
  // 13: LE — Pure Leo
  { elementVector: { wood: 0.70, fire: 0.90, earth: 1.10, metal: 1.05, water: 0.70 },
    psychVector: [0.9, 0.8, 0.4, 0.6, 0.9], modality: 'Fixed', polarity: 'Yang', seasonalQi: 0.89 },
  // 14: LE-VI — Leo with Virgo Precision
  { elementVector: { wood: 0.70, fire: 0.8325, earth: 1.0675, metal: 1.1325, water: 0.725 },
    psychVector: [0.68, 0.59, 0.565, 0.765, 0.57], modality: 'Mutable', polarity: 'Yin', seasonalQi: 0.8855 },
  // 15: VI-LE — Virgo with Leo Confidence
  { elementVector: { wood: 0.70, fire: 0.8175, earth: 1.0825, metal: 1.1025, water: 0.725 },
    psychVector: [0.83, 0.755, 0.445, 0.645, 0.84], modality: 'Fixed', polarity: 'Yang', seasonalQi: 0.8865 },
  // 16: VI — Pure Virgo
  { elementVector: { wood: 0.70, fire: 0.75, earth: 0.95, metal: 1.20, water: 0.75 },
    psychVector: [0.5, 0.5, 0.7, 0.9, 0.3], modality: 'Mutable', polarity: 'Yin', seasonalQi: 0.87 },
  // 17: VI-LI — Virgo with Libra Grace
  { elementVector: { wood: 0.70, fire: 0.7275, earth: 0.95, metal: 1.155, water: 0.875 },
    psychVector: [0.695, 0.525, 0.63, 0.735, 0.48], modality: 'Cardinal', polarity: 'Yang', seasonalQi: 0.8795 },
  // 18: LI-VI — Libra with Virgo Detail
  { elementVector: { wood: 0.70, fire: 0.7275, earth: 0.95, metal: 1.155, water: 0.875 },
    psychVector: [0.59, 0.525, 0.665, 0.825, 0.45], modality: 'Mutable', polarity: 'Yin', seasonalQi: 0.8795 },
  // 19: LI — Pure Libra
  { elementVector: { wood: 0.70, fire: 0.70, earth: 0.95, metal: 1.10, water: 1.00 },
    psychVector: [0.8, 0.5, 0.6, 0.6, 0.7], modality: 'Cardinal', polarity: 'Yang', seasonalQi: 0.89 },
  // 20: LI-SC — Libra with Scorpio Depth
  { elementVector: { wood: 0.725, fire: 0.70, earth: 0.95, metal: 0.9675, water: 1.13 },
    psychVector: [0.69, 0.695, 0.795, 0.74, 0.56], modality: 'Fixed', polarity: 'Yin', seasonalQi: 0.8895 },
  // 21: SC-LI — Scorpio with Libra Charm
  { elementVector: { wood: 0.725, fire: 0.70, earth: 0.95, metal: 1.0175, water: 1.07 },
    psychVector: [0.74, 0.59, 0.69, 0.64, 0.63], modality: 'Cardinal', polarity: 'Yang', seasonalQi: 0.8895 },
  // 22: SC — Pure Scorpio
  { elementVector: { wood: 0.75, fire: 0.70, earth: 0.95, metal: 0.85, water: 1.20 },
    psychVector: [0.6, 0.8, 0.9, 0.8, 0.5], modality: 'Fixed', polarity: 'Yin', seasonalQi: 0.89 },
  // 23: SC-SA — Scorpio with Sagittarius Vision
  { elementVector: { wood: 0.80, fire: 0.70, earth: 0.90, metal: 0.775, water: 1.20 },
    psychVector: [0.74, 0.745, 0.535, 0.59, 0.78], modality: 'Mutable', polarity: 'Yang', seasonalQi: 0.875 },
  // 24: SA-SC — Sagittarius with Scorpio Depth
  { elementVector: { wood: 0.7875, fire: 0.70, earth: 0.90, metal: 0.7875, water: 1.20 },
    psychVector: [0.68, 0.77, 0.73, 0.74, 0.63], modality: 'Fixed', polarity: 'Yin', seasonalQi: 0.8825 },
  // 25: SA — Pure Sagittarius
  { elementVector: { wood: 0.85, fire: 0.70, earth: 0.85, metal: 0.70, water: 1.20 },
    psychVector: [0.8, 0.7, 0.4, 0.5, 0.9], modality: 'Mutable', polarity: 'Yang', seasonalQi: 0.86 },
  // 26: SA-CP — Sagittarius with Capricorn Structure
  { elementVector: { wood: 0.9025, fire: 0.70, earth: 0.875, metal: 0.7375, water: 1.20 },
    psychVector: [0.605, 0.7, 0.455, 0.77, 0.48], modality: 'Cardinal', polarity: 'Yin', seasonalQi: 0.882 },
  // 27: CP-SA — Capricorn with Sagittarius
  { elementVector: { wood: 0.8875, fire: 0.70, earth: 0.875, metal: 0.7375, water: 1.20 },
    psychVector: [0.725, 0.7, 0.43, 0.62, 0.78], modality: 'Mutable', polarity: 'Yang', seasonalQi: 0.882 },
  // 28: CP — Pure Capricorn
  { elementVector: { wood: 0.95, fire: 0.70, earth: 0.90, metal: 0.75, water: 1.20 },
    psychVector: [0.5, 0.7, 0.5, 0.9, 0.3], modality: 'Cardinal', polarity: 'Yin', seasonalQi: 0.90 },
  // 29: CP-AQ — Capricorn with Aquarius
  { elementVector: { wood: 1.0375, fire: 0.7675, earth: 0.90, metal: 0.7275, water: 1.0475 },
    psychVector: [0.565, 0.665, 0.44, 0.77, 0.47], modality: 'Fixed', polarity: 'Yang', seasonalQi: 0.8925 },
  // 30: AQ-CP — Aquarius with Capricorn
  { elementVector: { wood: 1.0125, fire: 0.7675, earth: 0.90, metal: 0.7275, water: 1.0475 },
    psychVector: [0.53, 0.67, 0.44, 0.77, 0.47], modality: 'Cardinal', polarity: 'Yin', seasonalQi: 0.8925 },
  // 31: AQ — Pure Aquarius
  { elementVector: { wood: 1.10, fire: 0.85, earth: 0.90, metal: 0.70, water: 0.95 },
    psychVector: [0.6, 0.6, 0.3, 0.5, 0.8], modality: 'Fixed', polarity: 'Yang', seasonalQi: 0.90 },
  // 32: AQ-PI — Aquarius with Pisces
  { elementVector: { wood: 1.22, fire: 0.90, earth: 0.83, metal: 0.62, water: 0.85 },
    psychVector: [0.795, 0.29, 0.765, 0.445, 0.81], modality: 'Mutable', polarity: 'Yin', seasonalQi: 0.889 },
  // 33: PI-AQ — Pisces with Aquarius
  { elementVector: { wood: 1.1425, fire: 0.9025, earth: 0.875, metal: 0.6675, water: 0.8175 },
    psychVector: [0.645, 0.47, 0.585, 0.47, 0.81], modality: 'Fixed', polarity: 'Yang', seasonalQi: 0.889 },
  // 34: PI — Pure Pisces
  { elementVector: { wood: 1.20, fire: 1.00, earth: 0.85, metal: 0.65, water: 0.70 },
    psychVector: [0.9, 0.2, 0.9, 0.4, 0.8], modality: 'Mutable', polarity: 'Yin', seasonalQi: 0.88 },
  // 35: PI-AR — Pisces with Aries
  { elementVector: { wood: 1.165, fire: 1.065, earth: 0.915, metal: 0.715, water: 0.70 },
    psychVector: [0.79, 0.515, 0.435, 0.4, 0.855], modality: 'Cardinal', polarity: 'Yang', seasonalQi: 0.903 },
];

// ============================================================================
// WU XIN CYCLES
// ============================================================================

/** Generation (相生): parent → child */
const GENERATION_PAIRS: [keyof ElementVector, keyof ElementVector][] = [
  ['wood', 'fire'],
  ['fire', 'earth'],
  ['earth', 'metal'],
  ['metal', 'water'],
  ['water', 'wood'],
];

/** Control (相克): controller → controlled */
const CONTROL_PAIRS: [keyof ElementVector, keyof ElementVector][] = [
  ['wood', 'earth'],
  ['earth', 'water'],
  ['water', 'fire'],
  ['fire', 'metal'],
  ['metal', 'wood'],
];

// ============================================================================
// MATH HELPERS
// ============================================================================

function elemToArray(v: ElementVector): number[] {
  return [v.wood, v.fire, v.earth, v.metal, v.water];
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function mag(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

function cosineSim(a: number[], b: number[]): number {
  const d = mag(a) * mag(b);
  return d === 0 ? 0 : dot(a, b) / d;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ============================================================================
// LAYER 1: ELEMENTAL FLOW (0–100)
// Wu Xin generation/control cycles on normalized profile shapes
// ============================================================================

/** Normalize to sum-to-1 profile shape — measures WHERE elements concentrate */
function normalizeVec(v: ElementVector): ElementVector {
  const sum = v.wood + v.fire + v.earth + v.metal + v.water;
  return { wood: v.wood/sum, fire: v.fire/sum, earth: v.earth/sum, metal: v.metal/sum, water: v.water/sum };
}

function computeElementalFlow(a: ElementVector, b: ElementVector): number {
  // Normalize: strips out the "all positive" baseline, reveals true shape
  const an = normalizeVec(a);
  const bn = normalizeVec(b);
  const aArr = elemToArray(an);
  const bArr = elemToArray(bn);

  // Base resonance: cosine similarity of profile shapes
  const cos = cosineSim(aArr, bArr);
  let score = cos * K_COSINE;

  // Wu Xin generation: A→B (A nurtures B) — directional!
  for (const [parent, child] of GENERATION_PAIRS) {
    score += an[parent] * bn[child] * K_GEN_GIVE;
  }

  // Wu Xin generation: B→A (A feels supported)
  for (const [parent, child] of GENERATION_PAIRS) {
    score += bn[parent] * an[child] * K_GEN_RECV;
  }

  // Wu Xin control: A controls B (A feels powerful — mild positive)
  for (const [ctrl, target] of CONTROL_PAIRS) {
    score += an[ctrl] * bn[target] * K_CTRL_OVER;
  }

  // Wu Xin control: B controls A (A feels constrained — negative)
  for (const [ctrl, target] of CONTROL_PAIRS) {
    score += bn[ctrl] * an[target] * K_CTRL_UNDER;
  }

  // With harsher control penalties, raw range is roughly 35–52.
  // Map to 0–100 with wider spread.
  return clamp((score - 33) * 5.5, 5, 100);
}

// ============================================================================
// LAYER 2: MODALITY (0–100)
// Directional modality interaction + polarity modifier
// ============================================================================

function computeModality(a: ArchetypeProfile, b: ArchetypeProfile): number {
  let score = MODALITY_TABLE[a.modality][b.modality];
  score += (a.polarity === b.polarity) ? POLARITY_SAME : POLARITY_DIFF;
  return clamp(score, 0, 100);
}

// ============================================================================
// LAYER 3: ASPECT / PROXIMITY (0–100)
// Zodiac wheel distance → classical aspect scoring with interpolation
// ============================================================================

function computeAspect(indexA: number, indexB: number): number {
  // Circular distance on 36-position wheel
  const raw = Math.abs(indexA - indexB);
  const dist = Math.min(raw, 36 - raw);

  // Find the two nearest anchor points and interpolate
  const anchors = ASPECT_ANCHORS;
  if (dist <= anchors[0][0]) return anchors[0][1];
  if (dist >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1];

  for (let i = 0; i < anchors.length - 1; i++) {
    const [d0, s0] = anchors[i];
    const [d1, s1] = anchors[i + 1];
    if (dist >= d0 && dist <= d1) {
      const t = (dist - d0) / (d1 - d0);
      return lerp(s0, s1, t);
    }
  }
  return 70; // fallback
}

// ============================================================================
// LAYER 4: SEASONAL QI RESONANCE (0–100)
// How similar the seasonal Qi levels are
// ============================================================================

function computeSeasonalQi(a: ArchetypeProfile, b: ArchetypeProfile): number {
  // Combine Qi level resonance with element vector seasonal distance
  // Qi level resonance (narrow range 0.86–0.92)
  const qiDiff = Math.abs(a.seasonalQi - b.seasonalQi);
  const qiScore = 100 - qiDiff * 1200;

  // Element vector distance: how different are their seasonal signatures?
  const aArr = elemToArray(a.elementVector);
  const bArr = elemToArray(b.elementVector);
  let sumSqDiff = 0;
  for (let i = 0; i < 5; i++) sumSqDiff += (aArr[i] - bArr[i]) ** 2;
  const eucDist = Math.sqrt(sumSqDiff);
  // eucDist ranges ~0 (identical seasons) to ~0.8 (opposite seasons)
  const distScore = 100 - eucDist * 130;

  return clamp((qiScore * 0.3 + distScore * 0.7), 15, 100);
}

// ============================================================================
// LAYER 5: PSYCHOLOGICAL RESONANCE (0–100)
// Cosine similarity of 5D psych vectors
// ============================================================================

function computePsychResonance(a: ArchetypeProfile, b: ArchetypeProfile): number {
  const cos = cosineSim(a.psychVector, b.psychVector);
  // Sigmoid curve: rewards similarity without punishing complementarity
  // cos 0.55 → ~22, 0.65 → ~40, 0.75 → ~63, 0.85 → ~82, 0.95 → ~94
  const sigmoid = 1 / (1 + Math.exp(-12 * (cos - 0.72)));
  return clamp(sigmoid * 100, 10, 97);
}

// ============================================================================
// SIMILARITY DAMPENER
// Too much sameness = stagnation. Extreme similarity gets a gentle penalty
// so same-sign pairs are high but not absurdly higher than everything else.
// ============================================================================

function computeDampener(a: ArchetypeProfile, b: ArchetypeProfile): number {
  // Use normalized element vectors so we measure shape similarity
  const aElem = elemToArray(normalizeVec(a.elementVector));
  const bElem = elemToArray(normalizeVec(b.elementVector));
  const elemSim = cosineSim(aElem, bElem);
  const psychSim = cosineSim(a.psychVector, b.psychVector);

  // Element dampener: fires above 0.96 (same-sign & very close triads)
  // At 1.00 → ×0.80 (20% reduction)
  const elemDamp = 1 - 0.20 * clamp((elemSim - 0.96) / 0.04, 0, 1);
  // Psych dampener: fires above 0.93 (very high temperament overlap)
  // At 1.00 → ×0.85 (15% reduction)
  const psychDamp = 1 - 0.15 * clamp((psychSim - 0.93) / 0.07, 0, 1);

  return elemDamp * psychDamp;
}

// ============================================================================
// COMPOSITE SCORE
// ============================================================================

function computeDirectionalScore(fromIdx: number, toIdx: number): number {
  const a = PROFILES[fromIdx];
  const b = PROFILES[toIdx];

  const E = computeElementalFlow(a.elementVector, b.elementVector);
  const M = computeModality(a, b);
  const A = computeAspect(fromIdx, toIdx);
  const Q = computeSeasonalQi(a, b);
  const P = computePsychResonance(a, b);

  const raw = W_ELEMENTAL * E + W_MODALITY * M + W_ASPECT * A + W_SEASONAL * Q + W_PSYCH * P;
  const dampened = raw * computeDampener(a, b);

  // Rescale v2: raw dampened range is ~49–69.
  // Stretch into ~52–97 target for realistic distribution.
  const scaled = (dampened - 48) * (48 / 21) + 52;
  return Math.round(clamp(scaled, 48, 97));
}

// ============================================================================
// GENERATE FULL 36×36 MATRIX
// ============================================================================

function generateMatrix(): number[][] {
  const matrix: number[][] = [];
  for (let r = 0; r < 36; r++) {
    const row: number[] = [];
    for (let c = 0; c < 36; c++) {
      row.push(computeDirectionalScore(r, c));
    }
    matrix.push(row);
  }
  return matrix;
}

/** Cached computed matrix — generated once on import */
export const COMPUTED_MATRIX: number[][] = generateMatrix();

/**
 * Get computed compatibility score: how archetype A feels about archetype B
 */
export function getComputedDirectionalScore(fromIndex: number, toIndex: number): number {
  return COMPUTED_MATRIX[fromIndex]?.[toIndex] ?? 50;
}

/**
 * Get computed mutual compatibility (average of both directions)
 */
export function getComputedMutualScore(indexA: number, indexB: number): number {
  const ab = getComputedDirectionalScore(indexA, indexB);
  const ba = getComputedDirectionalScore(indexB, indexA);
  return (ab + ba) / 2;
}

/** Export profiles for debugging / UI display */
export { PROFILES as ARCHETYPE_PROFILES };
export type { ArchetypeProfile, ElementVector };

/**
 * Layer breakdown for a single A→B pair (for debugging/tooltip)
 */
export function getLayerBreakdown(fromIdx: number, toIdx: number) {
  const a = PROFILES[fromIdx];
  const b = PROFILES[toIdx];
  const dampener = Math.round(computeDampener(a, b) * 1000) / 1000;
  return {
    elemental:  Math.round(computeElementalFlow(a.elementVector, b.elementVector) * 10) / 10,
    modality:   computeModality(a, b),
    aspect:     Math.round(computeAspect(fromIdx, toIdx) * 10) / 10,
    seasonalQi: Math.round(computeSeasonalQi(a, b) * 10) / 10,
    psych:      Math.round(computePsychResonance(a, b) * 10) / 10,
    dampener,
    composite:  computeDirectionalScore(fromIdx, toIdx),
    weights: { E: W_ELEMENTAL, M: W_MODALITY, A: W_ASPECT, Q: W_SEASONAL, P: W_PSYCH },
  };
}

// ============================================================================
// NARRATIVE INTERPRETATION ENGINE
// Generates human-readable analysis for any pair
// ============================================================================

const TIER_LABELS: Record<string, string> = {
  A: 'Soulmate-level resonance — rare, life-defining chemistry',
  B: 'Strong, high-functioning compatibility — powerful, supportive partnership',
  C: 'Workable, normal compatibility — real, human, and improvable',
  D: 'Growth-heavy pairing — effortful, but rich in lessons',
  F: 'Low baseline compatibility — challenging, unstable, or short-lived',
};

const TIER_SUMMARIES: Record<string, string> = {
  A: 'This is a rare, soulmate-level pattern.',
  B: 'This is a strong, supportive pattern with real depth.',
  C: 'This is a workable, human pattern that can grow with effort.',
  D: 'This is a demanding pattern that asks for maturity and awareness.',
  F: 'This is a volatile pattern — powerful, but hard to stabilize.',
};

const MODALITY_NAMES: Record<string, string> = {
  Cardinal: 'initiator', Fixed: 'sustainer', Mutable: 'adapter',
};

const PSYCH_DIMS = ['warmth', 'directness', 'sensitivity', 'stability', 'expressiveness'] as const;

function getTier(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/** Dominant element (highest in normalized vector) */
function dominantElement(v: ElementVector): string {
  const n = normalizeVec(v);
  const entries = Object.entries(n) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0].charAt(0).toUpperCase() + entries[0][0].slice(1);
}

/** Top 2 psych traits */
function topPsychTraits(pv: number[]): string[] {
  return pv
    .map((v, i) => ({ dim: PSYCH_DIMS[i], v }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 2)
    .map(t => t.dim);
}

/** Lowest psych trait */
function lowestPsychTrait(pv: number[]): string {
  let minI = 0;
  for (let i = 1; i < pv.length; i++) if (pv[i] < pv[minI]) minI = i;
  return PSYCH_DIMS[minI];
}

export interface PairInterpretation {
  tierLabel: string;
  tierSummary: string;
  tier: string;
  strengths: string[];
  tensions: string[];
  directionNote: string;
  feelA: string;
  feelB: string;
  summary: string;
}

export function interpretPair(fromIdx: number, toIdx: number): PairInterpretation {
  const bd = getLayerBreakdown(fromIdx, toIdx);
  const bdRev = getLayerBreakdown(toIdx, fromIdx);
  const a = PROFILES[fromIdx];
  const b = PROFILES[toIdx];
  const tier = getTier(bd.composite);
  const tierLabel = TIER_LABELS[tier];
  const tierSummary = TIER_SUMMARIES[tier];
  const strengths: string[] = [];
  const tensions: string[] = [];

  const domA = dominantElement(a.elementVector);
  const domB = dominantElement(b.elementVector);
  const modA = MODALITY_NAMES[a.modality];
  const modB = MODALITY_NAMES[b.modality];
  const topA = topPsychTraits(a.psychVector as unknown as number[]);
  const topB = topPsychTraits(b.psychVector as unknown as number[]);
  const lowA = lowestPsychTrait(a.psychVector as unknown as number[]);
  const lowB = lowestPsychTrait(b.psychVector as unknown as number[]);

  // ── Psychology (25% — the spark) ──
  if (bd.psych >= 80)
    strengths.push(`Psychological resonance — both lead with ${topA[0]} and ${topA[1]}, creating a shared emotional language and natural rapport.`);
  else if (bd.psych >= 65)
    strengths.push(`Psychological complementarity — Person A leads with ${topA[0]}/${topA[1]}, Person B with ${topB[0]}/${topB[1]}. Different enough to intrigue, similar enough to understand.`);
  else
    tensions.push(`Psychological contrast — Person A leads with ${topA[0]}, Person B with ${topB[0]}. You may process emotions and conflict in very different ways. This requires conscious translation.`);

  // ── Elemental (25% — the anchor) ──
  if (bd.elemental >= 85)
    strengths.push(`Elemental support — ${domA} and ${domB} energies feed each other through the Wu Xing generation cycle. This creates a stable, nourishing foundation.`);
  else if (bd.elemental >= 70)
    strengths.push(`Moderate elemental flow — ${domA} and ${domB} have a mixed relationship in the Wu Xing cycle. Some support, some creative friction.`);
  else
    tensions.push(`Elemental friction — ${domA} meets ${domB} through the Wu Xing control cycle. This creates heat and tension that can be creative or draining, depending on awareness.`);

  // ── Seasonal Qi (20% — lived context) ──
  if (bd.seasonalQi >= 70)
    strengths.push(`Seasonal resonance — your life-season rhythms feel familiar and synchronized. You naturally understand each other's energy cycles.`);
  else if (bd.seasonalQi >= 45)
    tensions.push(`Seasonal difference — you occupy moderately different seasonal worlds. One may feel more energized while the other is consolidating.`);
  else
    tensions.push(`Seasonal contrast — you live in very different seasonal modes. What feels natural to one may feel foreign or exhausting to the other.`);

  // ── Aspect (15% — geometry) ──
  const dist = Math.min(Math.abs(fromIdx - toIdx), 36 - Math.abs(fromIdx - toIdx));
  const deg = dist * 10;
  const aspectName = deg <= 15 ? 'Conjunction' : deg <= 45 ? 'Semi-sextile' : deg <= 75 ? 'Sextile'
    : deg <= 105 ? 'Square' : deg <= 135 ? 'Trine' : deg <= 165 ? 'Quincunx' : 'Opposition';
  if (bd.aspect >= 80)
    strengths.push(`${aspectName} aspect (${deg}°) — your positions on the wheel create easy flow and mutual recognition. One of the most harmonious geometries.`);
  else if (bd.aspect >= 60)
    tensions.push(`${aspectName} aspect (${deg}°) — this geometry brings moderate tension. Not incompatibility, but a dynamic that keeps things interesting.`);
  else
    tensions.push(`${aspectName} aspect (${deg}°) — this geometry creates real friction. It can be creative and growth-inducing, but requires patience and awareness.`);

  // ── Modality (15% — momentum) ──
  if (bd.modality >= 80)
    strengths.push(`Modality synergy — the ${modA} meets the ${modB}. How you initiate, stabilize, and adapt fits together naturally.`);
  else if (bd.modality >= 68)
    strengths.push(`Moderate modality alignment — ${modA} and ${modB} energies have a workable dynamic, though the rhythm isn't perfectly matched.`);
  else
    tensions.push(`Modality mismatch — ${modA} energy and ${modB} energy can create friction. One may feel too fast, too slow, or too changeable for the other.`);

  // ── Dampener ──
  if (bd.dampener < 0.95)
    tensions.push(`Similarity dampener active (${Math.round((1 - bd.dampener) * 100)}% reduction) — you are very similar, which creates comfort but can also mean stagnation or lack of spark.`);

  // ── Directionality ──
  const diff = bd.composite - bdRev.composite;
  let directionNote: string;
  if (Math.abs(diff) <= 2)
    directionNote = 'This pairing is nearly symmetric — both people experience the relationship in a similar way.';
  else if (diff > 0)
    directionNote = `Person A tends to feel slightly more supported in this connection (${bd.composite} vs ${bdRev.composite}). The ${modA} role naturally flows toward the ${modB} in this direction.`;
  else
    directionNote = `Person B tends to feel slightly more supported in this connection (${bdRev.composite} vs ${bd.composite}). The reverse direction has better modality alignment.`;

  // ── Directional feel descriptions ──
  const feelVerbs = (score: number): string => {
    if (score >= 90) return 'deeply resonant, effortlessly understood, and profoundly supported';
    if (score >= 80) return 'supported, inspired, and energized';
    if (score >= 70) return 'engaged and compatible, with some areas requiring attention';
    if (score >= 60) return 'challenged but intrigued — growth is possible with effort';
    return 'friction and distance — this requires significant conscious work';
  };
  const feelA = `Person A feels ${feelVerbs(bd.composite)}.`;
  const feelB = `Person B feels ${feelVerbs(bdRev.composite)}.`;

  const summary = `${bd.composite} / ${bdRev.composite} — ${tierLabel}`;

  return { tierLabel, tierSummary, tier, strengths, tensions, directionNote, feelA, feelB, summary };
}
