/**
 * ============================================================================
 * C PILLAR SCORER — Cognitive Performance
 * ============================================================================
 *
 * Pure scoring module. Caller provides pre-computed Western planet positions
 * + BaZi TFQ weights; this returns the 5 sub-scores (one with 5 micros) for
 * the C pillar of the Happiness engine.
 *
 * The 5 subs (see happinessEngine.ts: C pillar):
 *   - clarity     — Mental Clarity (composite of 5 micros below)
 *       · focus        — Mercury in fixed/earth signs + Mercury-Saturn soft aspect
 *       · organization — BaZi Metal strength + Mercury in Virgo/Capricorn
 *       · fog (inv)    — Mercury combust + Mercury-Neptune hard aspect
 *       · processing   — Mercury sign element (Air/Fire = fast) + Mercury-Jupiter aspect
 *       · emotion (inv)— Moon-Mercury hard aspect
 *   - memory      — Mercury dignity + Moon-Mercury soft aspect + BaZi Earth strength
 *   - creativity  — Neptune-Mercury / Venus-Mercury soft aspects + 5th house ruler dignity
 *   - learning    — Jupiter dignity + BaZi Wood (growth) strength
 *   - decision    — Mars dignity + Sun-Jupiter aspect + BaZi Yang/Yin balance
 *
 * Caller responsibilities:
 *   - Run BaZi pipeline → pass normalized TFQ weights (sums to 1.0)
 *   - Read profile.western → pass planet signs + longitudes + house cusps
 *   - All Western fields are optional — missing data degrades gracefully to
 *     neutral 0.5 per affected sub, not to zero.
 * ============================================================================
 */

import type { ElementName } from './baziUsefulGod';
import {
  type ZodiacSign,
  type Planet,
  type HouseCusp,
  SIGN_ELEMENT,
  SIGN_MODALITY,
  normalizeSign,
  dignityOf,
  detectAspect,
  hasAspect,
  combustState,
  combustScore,
  houseRuler,
  HARD_ASPECTS,
  SOFT_ASPECTS,
} from './westernSignals';
import { clamp01 } from './qiNormalization';

// ============================================================================
// TYPES
// ============================================================================

export interface CPillarInputs {
  /** Normalized BaZi element weights (each 0..1, summing to ~1). */
  baziWeights: Record<ElementName, number>;

  /** Planet sign placements — null if missing. */
  signs: Partial<Record<Planet, string | null>>;

  /** Planet ecliptic longitudes (0..360) — null/undefined if missing. */
  longitudes: Partial<Record<Planet, number | null>>;

  /** House cusps from profile.western.houses — null if missing. */
  houseCusps?: HouseCusp[] | null;

  /** DM polarity from BaZi, for the Yang/Yin balance check in decision making. */
  dmPolarity: 'Yang' | 'Yin';

  /** Yang/Yin element shares from BaZi TFQ. Optional — derived from baziWeights if missing. */
  yangYinBalance?: { yang: number; yin: number };
}

export interface CMicroScores {
  focus: number;
  organization: number;
  fog: number;        // raw score (HIGH = lots of fog); inverted at aggregation
  processing: number;
  emotion: number;    // raw score (HIGH = lots of interference); inverted at aggregation
}

export interface CPillarScores {
  // 5 top-level subs (clarity is composite of 5 micros)
  clarity: number;
  memory: number;
  creativity: number;
  learning: number;
  decision: number;

  /** Composite-of-composite total, weighted per happinessEngine.ts. */
  total: number;

  /** Drill-in micros — surfaced for the preview panel. */
  micros: CMicroScores;

  reasoning: Record<keyof Omit<CPillarScores, 'total' | 'reasoning' | 'micros'>, string>;
  microReasoning: Record<keyof CMicroScores, string>;
}

// Must match happinessEngine.ts DEFAULT_PILLARS C pillar.
export const C_SUB_WEIGHTS = {
  clarity: 0.30,
  memory: 0.20,
  creativity: 0.15,
  learning: 0.10,
  decision: 0.25,
} as const;

export const C_CLARITY_MICRO_WEIGHTS = {
  focus: 0.30,
  organization: 0.25,
  fog: 0.20,         // inverse
  processing: 0.15,
  emotion: 0.10,     // inverse
} as const;

// ============================================================================
// HELPERS
// ============================================================================

function lon(inputs: CPillarInputs, p: Planet): number | null {
  const v = inputs.longitudes[p];
  return typeof v === 'number' ? v : null;
}
function sign(inputs: CPillarInputs, p: Planet): ZodiacSign | null {
  return normalizeSign(inputs.signs[p]);
}

/**
 * Compute aspect strength between two planets, returning 0 if absent or data
 * missing. Tightness is in [0, 1] — exact orb scores 1, edge of orb scores ~0.
 */
function aspectStrength(
  inputs: CPillarInputs,
  a: Planet,
  b: Planet,
  types: ReadonlyArray<import('./westernSignals').AspectType>,
): number {
  const la = lon(inputs, a);
  const lb = lon(inputs, b);
  if (la == null || lb == null) return 0;
  const hit = hasAspect(la, lb, types);
  return hit ? hit.tightness : 0;
}

/** BaZi element share helper — already-normalized weights. */
function el(inputs: CPillarInputs, e: ElementName): number {
  return inputs.baziWeights[e] ?? 0;
}

// ============================================================================
// MICRO-SCORERS (for clarity)
// ============================================================================

/** Focus Stability — Mercury in fixed/earth signs + Mercury-Saturn soft aspect. */
function scoreFocus(inputs: CPillarInputs): { score: number; reason: string } {
  const merc = sign(inputs, 'Mercury');
  const signBase =
    merc == null ? 0.5 :
    SIGN_MODALITY[merc] === 'Fixed' ? 0.85 :
    SIGN_ELEMENT[merc] === 'Earth' ? 0.80 :
    SIGN_MODALITY[merc] === 'Mutable' ? 0.40 :
    0.55; // cardinal-non-earth (e.g. Aries, Cancer, Libra)
  const saturnAspect = aspectStrength(inputs, 'Mercury', 'Saturn', SOFT_ASPECTS);
  const score = clamp01(0.7 * signBase + 0.3 * saturnAspect);
  const reason = `Mercury ${merc || '—'} (${signBase.toFixed(2)}) + Mercury-Saturn soft aspect tightness ${saturnAspect.toFixed(2)}.`;
  return { score, reason };
}

/** Thought Organization — BaZi Metal + Mercury in Virgo/Capricorn. */
function scoreOrganization(inputs: CPillarInputs): { score: number; reason: string } {
  const merc = sign(inputs, 'Mercury');
  const mercuryBoost = merc === 'Virgo' || merc === 'Capricorn' ? 1.0 : merc ? 0.4 : 0.5;
  const metal = el(inputs, 'Metal');
  // Anchor at 50% for moderate Metal share (0.2 = balanced). Lerp upward.
  const baziTerm = clamp01(0.3 + metal * 1.8);
  const score = clamp01(0.5 * mercuryBoost + 0.5 * baziTerm);
  const reason = `BaZi Metal share ${(metal * 100).toFixed(0)}% (${baziTerm.toFixed(2)}) + Mercury in ${merc || '—'} (${mercuryBoost.toFixed(2)}).`;
  return { score, reason };
}

/** Cognitive Fog (inverse sub) — HIGH score means high fog. Mercury combust + Neptune-Mercury hard aspect. */
function scoreFog(inputs: CPillarInputs): { score: number; reason: string } {
  const merc = lon(inputs, 'Mercury');
  const sun = lon(inputs, 'Sun');
  const combust =
    merc != null && sun != null ? combustState(merc, sun) : 'free';
  const combustFogContribution =
    combust === 'combust' ? 1.0 :
    combust === 'underBeams' ? 0.55 :
    combust === 'cazimi' ? 0.15 : // cazimi is actually clearer, not foggier
    0.1;
  const neptuneAspect = aspectStrength(inputs, 'Mercury', 'Neptune', HARD_ASPECTS);
  const score = clamp01(0.6 * combustFogContribution + 0.4 * neptuneAspect);
  const reason = `Mercury combust state: ${combust} + Mercury-Neptune hard aspect tightness ${neptuneAspect.toFixed(2)}.`;
  return { score, reason };
}

/** Processing Ease — Mercury Air/Fire signs + Mercury-Jupiter aspect (any). */
function scoreProcessing(inputs: CPillarInputs): { score: number; reason: string } {
  const merc = sign(inputs, 'Mercury');
  const elBase =
    merc == null ? 0.5 :
    SIGN_ELEMENT[merc] === 'Air' ? 0.90 :
    SIGN_ELEMENT[merc] === 'Fire' ? 0.75 :
    SIGN_ELEMENT[merc] === 'Earth' ? 0.55 :
    0.35; // Water
  // Any Mercury-Jupiter aspect helps — bonus for soft, smaller bonus for any.
  const softHit = aspectStrength(inputs, 'Mercury', 'Jupiter', SOFT_ASPECTS);
  const mercLon = lon(inputs, 'Mercury');
  const jupLon = lon(inputs, 'Jupiter');
  const anyHit = mercLon != null && jupLon != null && detectAspect(mercLon, jupLon) ? 1 : 0;
  const jupiterTerm = clamp01(0.7 * softHit + 0.3 * anyHit);
  const score = clamp01(0.7 * elBase + 0.3 * jupiterTerm);
  const reason = `Mercury in ${merc || '—'} (${elBase.toFixed(2)}) + Mercury-Jupiter (soft=${softHit.toFixed(2)}, any=${anyHit}).`;
  return { score, reason };
}

/** Emotional Interference (inverse sub) — HIGH means lots of interference. Moon-Mercury hard aspect. */
function scoreEmotion(inputs: CPillarInputs): { score: number; reason: string } {
  const hard = aspectStrength(inputs, 'Moon', 'Mercury', HARD_ASPECTS);
  // Without an aspect, baseline interference is low (0.15). Hard aspect tightness adds up to 0.85.
  const score = clamp01(0.15 + 0.85 * hard);
  const reason = `Moon-Mercury hard aspect tightness ${hard.toFixed(2)}.`;
  return { score, reason };
}

// ============================================================================
// SUB-SCORERS
// ============================================================================

function scoreClarityComposite(micros: CMicroScores): number {
  // Weighted by C_CLARITY_MICRO_WEIGHTS; fog & emotion are inverse (1 - raw).
  return clamp01(
    C_CLARITY_MICRO_WEIGHTS.focus        * micros.focus +
    C_CLARITY_MICRO_WEIGHTS.organization * micros.organization +
    C_CLARITY_MICRO_WEIGHTS.fog          * (1 - micros.fog) +
    C_CLARITY_MICRO_WEIGHTS.processing   * micros.processing +
    C_CLARITY_MICRO_WEIGHTS.emotion      * (1 - micros.emotion)
  );
}

/** Memory — Mercury dignity + Moon-Mercury soft aspect + BaZi Earth. */
function scoreMemory(inputs: CPillarInputs): { score: number; reason: string } {
  const mercSign = sign(inputs, 'Mercury');
  const mercDig = dignityOf('Mercury', mercSign);
  const moonSoft = aspectStrength(inputs, 'Moon', 'Mercury', SOFT_ASPECTS);
  const earth = el(inputs, 'Earth');
  const earthTerm = clamp01(0.3 + earth * 1.8);
  const score = clamp01(0.45 * mercDig + 0.25 * moonSoft + 0.30 * earthTerm);
  const reason = `Mercury dignity ${mercDig.toFixed(2)} + Moon-Mercury soft ${moonSoft.toFixed(2)} + BaZi Earth ${(earth * 100).toFixed(0)}%.`;
  return { score, reason };
}

/** Creativity — Neptune-Mercury / Venus-Mercury soft aspects + 5th house ruler dignity. */
function scoreCreativity(inputs: CPillarInputs): { score: number; reason: string } {
  const nepHit = aspectStrength(inputs, 'Mercury', 'Neptune', SOFT_ASPECTS);
  const venHit = aspectStrength(inputs, 'Mercury', 'Venus', SOFT_ASPECTS);
  const aspectTerm = clamp01(0.6 * Math.max(nepHit, venHit) + 0.4 * Math.min(nepHit, venHit));
  // 5th house ruler dignity
  const ruler = houseRuler(inputs.houseCusps, 5);
  let rulerDig = 0.55; // unknown → neutral
  let rulerName: string = '—';
  if (ruler) {
    rulerName = ruler;
    rulerDig = dignityOf(ruler, sign(inputs, ruler));
  }
  const score = clamp01(0.6 * aspectTerm + 0.4 * rulerDig);
  const reason = `Mercury-Neptune soft ${nepHit.toFixed(2)}, Mercury-Venus soft ${venHit.toFixed(2)}; 5th house ruler ${rulerName} dignity ${rulerDig.toFixed(2)}.`;
  return { score, reason };
}

/** Learning Speed — Jupiter dignity + BaZi Wood (growth) strength. */
function scoreLearning(inputs: CPillarInputs): { score: number; reason: string } {
  const jupDig = dignityOf('Jupiter', sign(inputs, 'Jupiter'));
  const wood = el(inputs, 'Wood');
  const woodTerm = clamp01(0.3 + wood * 1.8);
  const score = clamp01(0.6 * jupDig + 0.4 * woodTerm);
  const reason = `Jupiter dignity ${jupDig.toFixed(2)} + BaZi Wood ${(wood * 100).toFixed(0)}%.`;
  return { score, reason };
}

/** Decision Making — Mars dignity + Sun-Jupiter aspect + BaZi Yang/Yin balance. */
function scoreDecision(inputs: CPillarInputs): { score: number; reason: string } {
  const marsDig = dignityOf('Mars', sign(inputs, 'Mars'));
  const sunJupSoft = aspectStrength(inputs, 'Sun', 'Jupiter', SOFT_ASPECTS);
  const sunJupHard = aspectStrength(inputs, 'Sun', 'Jupiter', HARD_ASPECTS);
  // Soft is good for decision (confident growth), hard is mixed (overreach). Weight soft.
  const sunJupTerm = clamp01(0.7 * sunJupSoft + 0.3 * sunJupHard);

  // Yang/Yin balance — symmetric: closer to 0.5 = better integrated decision-making.
  // Use TFQ-derived element-yang vs element-yin if provided, else derive from baziWeights.
  let yangShare: number;
  if (inputs.yangYinBalance) {
    const total = inputs.yangYinBalance.yang + inputs.yangYinBalance.yin;
    yangShare = total > 0 ? inputs.yangYinBalance.yang / total : 0.5;
  } else {
    // Heuristic: Wood + Fire = Yang-leaning, Metal + Water = Yin-leaning, Earth neutral.
    const yang = el(inputs, 'Wood') + el(inputs, 'Fire');
    const yin = el(inputs, 'Metal') + el(inputs, 'Water');
    const total = yang + yin;
    yangShare = total > 0 ? yang / total : 0.5;
  }
  // Triangular peak at 0.5: distance from 0.5 (in [0, 0.5]) → multiplier
  const yyBalance = clamp01(1 - Math.abs(yangShare - 0.5) * 2);

  const score = clamp01(0.4 * marsDig + 0.3 * sunJupTerm + 0.3 * yyBalance);
  const reason = `Mars dignity ${marsDig.toFixed(2)} + Sun-Jupiter (soft=${sunJupSoft.toFixed(2)}, hard=${sunJupHard.toFixed(2)}) + Y/Y balance ${yyBalance.toFixed(2)} (yang share ${(yangShare * 100).toFixed(0)}%).`;
  return { score, reason };
}

// ============================================================================
// MAIN ENTRY
// ============================================================================

export function scoreCognitionPillar(inputs: CPillarInputs): CPillarScores {
  // Clarity micros
  const focus = scoreFocus(inputs);
  const organization = scoreOrganization(inputs);
  const fog = scoreFog(inputs);
  const processing = scoreProcessing(inputs);
  const emotion = scoreEmotion(inputs);

  const micros: CMicroScores = {
    focus: focus.score,
    organization: organization.score,
    fog: fog.score,
    processing: processing.score,
    emotion: emotion.score,
  };
  const clarity = scoreClarityComposite(micros);

  // Other top-level subs
  const memory = scoreMemory(inputs);
  const creativity = scoreCreativity(inputs);
  const learning = scoreLearning(inputs);
  const decision = scoreDecision(inputs);

  const total = clamp01(
    C_SUB_WEIGHTS.clarity    * clarity +
    C_SUB_WEIGHTS.memory     * memory.score +
    C_SUB_WEIGHTS.creativity * creativity.score +
    C_SUB_WEIGHTS.learning   * learning.score +
    C_SUB_WEIGHTS.decision   * decision.score
  );

  return {
    clarity,
    memory: memory.score,
    creativity: creativity.score,
    learning: learning.score,
    decision: decision.score,
    total,
    micros,
    reasoning: {
      clarity: `Composite of 5 micros (focus + organization + (1-fog) + processing + (1-emotion)).`,
      memory: memory.reason,
      creativity: creativity.reason,
      learning: learning.reason,
      decision: decision.reason,
    },
    microReasoning: {
      focus: focus.reason,
      organization: organization.reason,
      fog: fog.reason,
      processing: processing.reason,
      emotion: emotion.reason,
    },
  };
}
