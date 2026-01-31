/**
 * Narrative Engine - Susan Miller-style Compatibility Narratives
 *
 * Generates directional compatibility text (A → B perspective) based on:
 * - Sign needs and stress signals
 * - Element/Modality/Season dynamics
 * - Aspect geometry (trine/square/opposition etc.)
 * - Context (romance/business/friendship)
 * - Lens (Sun/Moon/Rising)
 *
 * GENESIS AstroProfile - January 2026
 */

import { SIGN_LESSONS, type SignKey, type Element, type Modality, type Season } from './tropicalMap';
import { SIGN_NEEDS, type NeedProfile } from './signNeeds';
import { getAngleBetweenSigns, type AngleKey } from './angles';
import type { BlendedSignMetadata, ElementVector, ModalityVector } from './cusp/signVectors';
import { ELEMENT_LABELS, MODALITY_LABELS } from './cusp/signVectors';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type Lens = 'Sun' | 'Moon' | 'Rising';
export type Context = 'romance' | 'business' | 'friendship';

export interface BaselineDynamics {
  elementDynamic: string;
  modalityDynamic: string;
  seasonalDynamic: string;
}

export interface NarrativeContent {
  howFromPerceivesTo: string;
  whatFromNeedsFromTo: string;
  frictionPoints: string[];
  growthAdvice: string[];
  bridgeOpportunities: string[];
}

export interface PerspectiveReport {
  from: SignKey;
  to: SignKey;
  lens: Lens;
  context: Context;
  angle: AngleKey;
  angleDegrees: number;
  baseline: BaselineDynamics;
  narrative: NarrativeContent;
  effortScore: number;  // 1-10, higher = more work required
  growthPotential: number;  // 1-10, higher = more reward from effort
}

// Cross-aspect types for synastry matrix
export type CrossAspect =
  | 'Sun-Sun' | 'Sun-Moon' | 'Sun-Rising'
  | 'Moon-Sun' | 'Moon-Moon' | 'Moon-Rising'
  | 'Rising-Sun' | 'Rising-Moon' | 'Rising-Rising';

// Step-by-step effort breakdown (Khan Academy "show your work" style)
export interface EffortStep {
  label: string;         // What this step calculates
  value: number;         // Numeric result of this step
  explanation: string;   // Plain-language explanation
}

export interface CrossAspectReport {
  aspect: CrossAspect;
  fromLens: Lens;
  toLens: Lens;
  fromSign: SignKey;
  toSign: SignKey;
  angle: AngleKey;
  effortScore: number;
  harmonyScore: number;  // Inverse of effort (1-10, higher = easier)
  insight: string;       // Key insight like "Your Moon soothes their Sun"
  weight: number;        // Weight for overall scoring
  steps: EffortStep[];   // Full "show your work" breakdown
}

export interface SynastryMatrix {
  grid: CrossAspectReport[];  // All 9 interactions
  weightedScore: number;      // Overall weighted compatibility (1-100)
  keyInsights: string[];      // Top highlights
  strengths: string[];        // Best connections
  challenges: string[];       // Areas needing work
  growthAreas: string[];      // High growth potential areas
}

// =============================================================================
// DYNAMIC GENERATORS
// =============================================================================

function getElementDynamic(aEl: Element, bEl: Element): string {
  if (aEl === bEl) {
    return `Same element (${aEl}): You speak the same energetic language instinctively.`;
  }

  const dynamics: Record<string, string> = {
    'Fire-Air': 'Fire + Air: Ideas fuel action. Lively, motivating, fast-moving energy.',
    'Air-Fire': 'Air + Fire: Words spark courage. Quick mutual uplift and enthusiasm.',
    'Earth-Water': 'Earth + Water: Nurturing practicality. Stable, caring, grounded support.',
    'Water-Earth': 'Water + Earth: Feelings find form. Loyal tending and emotional security.',
    'Fire-Water': 'Fire + Water: Passion meets sensitivity. Requires emotional skill and timing.',
    'Water-Fire': 'Water + Fire: Tenderness meets intensity. Needs respect and patience.',
    'Earth-Air': 'Earth + Air: Realism meets theory. Must translate priorities carefully.',
    'Air-Earth': 'Air + Earth: Ideas meet results. Align pace and need for proof.',
    'Fire-Earth': 'Fire + Earth: Vision meets constraint. Build without smothering spark.',
    'Earth-Fire': 'Earth + Fire: Practicality meets impulse. Negotiate risk together.',
    'Air-Water': 'Air + Water: Thoughts meet tides. Name feelings clearly to connect.',
    'Water-Air': 'Water + Air: Emotion meets logic. Avoid invalidation; honor both.',
  };

  return dynamics[`${aEl}-${bEl}`] ?? 'Different elements: requires translation between instincts.';
}

function getModalityDynamic(aMod: Modality, bMod: Modality): string {
  if (aMod === bMod) {
    const same: Record<Modality, string> = {
      Cardinal: 'Both Cardinal: Initiative may clash. Leadership must be shared.',
      Fixed: 'Both Fixed: Deep loyalty, but stalemates happen. Neither yields easily.',
      Mutable: 'Both Mutable: High flexibility, but consistency must be consciously built.',
    };
    return same[aMod];
  }

  return 'Different modalities: Natural division of labor—one starts, one steadies, one adapts.';
}

function getSeasonalDynamic(aSeason: Season, bSeason: Season): string {
  if (aSeason === bSeason) {
    return `Shared season (${aSeason}): Similar timing instincts and worldview rhythm.`;
  }

  // Adjacent seasons
  const adjacent = [
    ['Spring', 'Summer'], ['Summer', 'Autumn'], ['Autumn', 'Winter'], ['Winter', 'Spring']
  ];
  const isAdjacent = adjacent.some(([a, b]) =>
    (aSeason === a && bSeason === b) || (aSeason === b && bSeason === a)
  );

  if (isAdjacent) {
    return 'Adjacent seasons: Complementary rhythms, natural flow from one to the other.';
  }

  // Opposite seasons
  const opposite = [['Spring', 'Autumn'], ['Summer', 'Winter']];
  const isOpposite = opposite.some(([a, b]) =>
    (aSeason === a && bSeason === b) || (aSeason === b && bSeason === a)
  );

  if (isOpposite) {
    return 'Opposite seasons: Complementary but polarized. Balance is the lesson.';
  }

  return 'Different seasons: Complementary life-rhythms, but pacing may differ.';
}

function getLensTone(lens: Lens): string {
  switch (lens) {
    case 'Sun': return 'identity, choices, and conscious self';
    case 'Moon': return 'emotional needs, instincts, and inner world';
    case 'Rising': return 'first impression, social chemistry, and approach to life';
  }
}

function getContextFlavor(context: Context): { domain: string; priority: string } {
  switch (context) {
    case 'romance':
      return { domain: 'romantic connection', priority: 'emotional safety and passion' };
    case 'business':
      return { domain: 'professional partnership', priority: 'reliability and results' };
    case 'friendship':
      return { domain: 'friendship', priority: 'enjoyment and mutual support' };
  }
}

function getAngleDescription(angle: AngleKey): { name: string; nature: string; advice: string } {
  const angles: Record<AngleKey, { name: string; nature: string; advice: string }> = {
    'conjunction': {
      name: 'Conjunction (0°)',
      nature: 'Fusion—you merge energies intensely',
      advice: 'Maintain individuality while celebrating similarity',
    },
    'semi-sextile': {
      name: 'Semi-sextile (30°)',
      nature: 'Adjacent friction—subtle irritation',
      advice: 'Practice patience; your neighbor has wisdom you lack',
    },
    'sextile': {
      name: 'Sextile (60°)',
      nature: 'Opportunity—cooperation flows naturally',
      advice: 'Don\'t let ease become laziness; activate the potential',
    },
    'square': {
      name: 'Square (90°)',
      nature: 'Tension—friction that forces growth',
      advice: 'Embrace the challenge; resistance builds strength',
    },
    'trine': {
      name: 'Trine (120°)',
      nature: 'Harmony—same element, natural flow',
      advice: 'Don\'t mistake ease for completion; push each other to grow',
    },
    'quincunx': {
      name: 'Quincunx (150°)',
      nature: 'Awkward fit—constant adjustment needed',
      advice: 'Accept that some connections require work without resolution',
    },
    'opposition': {
      name: 'Opposition (180°)',
      nature: 'Mirror—polarity and attraction',
      advice: 'Your opposite is your teacher; integrate what you project',
    },
  };
  return angles[angle];
}

// =============================================================================
// UPGRADE 1: ORB-SENSITIVE ANGLE ADJUSTMENT
// =============================================================================

/**
 * Maximum orb (in degrees) per aspect type.
 * Wider orbs for major aspects; tighter for minor ones.
 */
const MAX_ORB_BY_ANGLE: Record<AngleKey, number> = {
  'conjunction': 8,
  'sextile': 6,
  'square': 7,
  'trine': 7,
  'opposition': 8,
  'quincunx': 4,
  'semi-sextile': 3,
};

/**
 * Baseline effort adjustment per aspect (before orb decay).
 * Negative = easier, positive = harder.
 */
const ANGLE_ADJ_BASE: Record<AngleKey, number> = {
  'trine': -2,
  'sextile': -1.5,
  'conjunction': -1,
  'semi-sextile': 0,
  'opposition': +1.5,
  'square': +2,
  'quincunx': +2.5,
};

/**
 * Orb decay factor: 1.0 at exact → 0.0 at max orb.
 * Wider orbs dilute the aspect's effect proportionally.
 * For sign-based calculation (orb=0), this returns 1.0 (full strength).
 */
function orbFactor(angle: AngleKey, orb: number): number {
  const maxOrb = MAX_ORB_BY_ANGLE[angle] ?? 6;
  const raw = 1 - orb / maxOrb;
  return Math.max(0, Math.min(1, raw));
}

function angleAdjustment(angle: AngleKey, orb: number): number {
  const base = ANGLE_ADJ_BASE[angle] ?? 0;
  return base * orbFactor(angle, orb);
}

// =============================================================================
// UPGRADE 2: PLANET PAIR WEIGHTING
// =============================================================================

/**
 * Cross-aspect weights: emotionally significant pairs amplify the adjustment.
 * Sun-Moon pairs are the most critical (identity ↔ emotional needs).
 * Default for unlisted pairs: 0.8 (mild de-emphasis).
 */
const PLANET_PAIR_WEIGHT: Partial<Record<CrossAspect, number>> = {
  'Sun-Moon': 1.4,
  'Moon-Sun': 1.4,
  'Moon-Moon': 1.3,
  'Sun-Rising': 1.2,
  'Rising-Sun': 1.2,
  'Sun-Sun': 1.0,
  'Rising-Rising': 1.0,
};

function planetWeight(crossAspect?: CrossAspect): number {
  if (!crossAspect) return 1.0; // No weighting when cross-aspect unknown
  return PLANET_PAIR_WEIGHT[crossAspect] ?? 0.8;
}

// =============================================================================
// UPGRADE 3: RICHER ELEMENTAL COMPATIBILITY
// =============================================================================

/**
 * Element compatibility now distinguishes 4 tiers:
 * - Same element:     -1.0 (low effort, shared language)
 * - Supportive pairs: -0.5 (Fire+Air, Earth+Water — natural allies)
 * - Neutral pairs:    +0.25 (Fire+Earth, Air+Water — mild tension)
 * - Draining pairs:   +1.0 (Fire+Water, Earth+Air — requires translation)
 */
function elementAdjustment(aEl: Element, bEl: Element): number {
  if (aEl === bEl) return -1;

  // Order-independent pair key
  const pair = [aEl, bEl].sort().join('-');

  // Supportive pairs
  if (pair === 'Air-Fire' || pair === 'Earth-Water') return -0.5;

  // Draining pairs
  if (pair === 'Air-Earth' || pair === 'Fire-Water') return +1;

  // Neutral / mild tension (Fire-Earth, Air-Water)
  return +0.25;
}

// =============================================================================
// UPGRADE 4: EXPANDED MODALITY FRICTION
// =============================================================================

/**
 * Modality friction now differentiates all 6 combinations:
 * Same modality (always friction, but degree varies):
 * - Fixed+Fixed:     +1.0 (stubborn lock, hardest)
 * - Cardinal+Cardinal: +0.5 (power struggle)
 * - Mutable+Mutable:  +0.5 (drift without anchor)
 *
 * Different modality:
 * - Cardinal+Mutable: -0.5 (best flow: initiator + adapter)
 * - Fixed+Mutable:    +0.5 (mild friction: stability vs flexibility)
 * - Cardinal+Fixed:    0.0 (neutral: starter + sustainer)
 */
function modalityAdjustment(aMod: Modality, bMod: Modality): number {
  if (aMod === bMod) {
    if (aMod === 'Fixed') return +1;
    if (aMod === 'Cardinal') return +0.5;
    if (aMod === 'Mutable') return +0.5;
  }

  // Order-independent pair key
  const pair = [aMod, bMod].sort().join('-');

  // Good flow
  if (pair === 'Cardinal-Mutable') return -0.5;

  // Mild friction
  if (pair === 'Fixed-Mutable') return +0.5;

  // Cardinal-Fixed: neutral
  return 0;
}

// =============================================================================
// UPGRADED EFFORT SCORE (Combines all 4 upgrades)
// =============================================================================

/**
 * Calculate effort score with 4 layers of sophistication:
 * 1. Orb-sensitive angle adjustment (exact aspects hit harder)
 * 2. Planet pair weighting (Sun-Moon amplified, peripheral pairs dampened)
 * 3. Richer elemental compatibility (support/neutral/drain tiers)
 * 4. Expanded modality friction (all 6 combinations differentiated)
 *
 * Formula: effort = 5 + (angleAdj + elemAdj + modAdj) × planetWeight
 * Clamped to 1-10.
 *
 * The options parameter is optional for backward compatibility.
 * Sign-based callers (orb=0, no crossAspect) get full-strength scoring
 * with planetWeight=1.0.
 */
export function calculateEffortScore(
  angle: AngleKey,
  aEl: Element,
  bEl: Element,
  aMod: Modality,
  bMod: Modality,
  options?: {
    orb?: number;                // Degrees from exact (0 = exact, default)
    crossAspect?: CrossAspect;   // Planet pair for weighting (Core Bond matrix)
    planetPairWeight?: number;   // Direct weight override (Matrices 2-5)
  }
): number {
  const orb = options?.orb ?? 0;

  const angleAdj = angleAdjustment(angle, orb);
  const elemAdj = elementAdjustment(aEl, bEl);
  const modAdj = modalityAdjustment(aMod, bMod);
  const pWeight = options?.planetPairWeight ?? planetWeight(options?.crossAspect);

  const rawEffort = 5 + (angleAdj + elemAdj + modAdj) * pWeight;

  return Math.max(1, Math.min(10, Math.round(rawEffort)));
}

/**
 * Calculate effort score with full step-by-step breakdown.
 * Same formula as calculateEffortScore, but returns every intermediate
 * value so the UI can render a Khan Academy "show your work" panel.
 */
export function calculateEffortWithSteps(
  angle: AngleKey,
  aEl: Element,
  bEl: Element,
  aMod: Modality,
  bMod: Modality,
  options?: {
    orb?: number;
    crossAspect?: CrossAspect;
    planetPairWeight?: number;   // Direct weight override (Matrices 2-5)
    planetPairLabel?: string;    // Label for the step display (e.g. "Venus-Mars")
  }
): { effort: number; harmony: number; steps: EffortStep[] } {
  const orb = options?.orb ?? 0;
  const crossAspect = options?.crossAspect;
  const steps: EffortStep[] = [];

  // Step 1: Baseline
  steps.push({
    label: 'Baseline effort',
    value: 5,
    explanation: 'Neutral starting point before geometry, element, or modality.',
  });

  // Step 2: Orb factor
  const maxOrb = MAX_ORB_BY_ANGLE[angle] ?? 6;
  const orbFact = orbFactor(angle, orb);
  steps.push({
    label: 'Orb factor',
    value: Math.round(orbFact * 100) / 100,
    explanation: orb === 0
      ? 'Sign-based (exact): full-strength aspect.'
      : `Orb = ${orb.toFixed(1)}° out of max ${maxOrb}°. Tighter orb → stronger effect.`,
  });

  // Step 3: Base angle adjustment
  const baseAngleAdj = ANGLE_ADJ_BASE[angle] ?? 0;
  steps.push({
    label: `Angle: ${angle}`,
    value: baseAngleAdj,
    explanation: baseAngleAdj < 0
      ? `${angle} is a harmonious aspect — lowers effort by ${Math.abs(baseAngleAdj)}.`
      : baseAngleAdj > 0
      ? `${angle} is a challenging aspect — raises effort by ${baseAngleAdj}.`
      : `${angle} is neutral — no angle adjustment.`,
  });

  // Step 4: Orb-scaled angle adjustment
  const angleAdj = angleAdjustment(angle, orb);
  if (orb > 0) {
    steps.push({
      label: 'Orb-scaled angle adj.',
      value: Math.round(angleAdj * 100) / 100,
      explanation: `${baseAngleAdj} × ${orbFact.toFixed(2)} = ${angleAdj.toFixed(2)}. Wider orb dilutes the effect.`,
    });
  }

  // Step 5: Element adjustment
  const elemAdj = elementAdjustment(aEl, bEl);
  const elemExplanations: Record<number, string> = {
    [-1]: `Same element (${aEl}) — shared language, low effort.`,
    [-0.5]: `${aEl} + ${bEl} — supportive pair, natural allies.`,
    [0.25]: `${aEl} + ${bEl} — neutral pair, mild tension.`,
    [1]: `${aEl} + ${bEl} — draining pair, requires translation.`,
  };
  steps.push({
    label: `Element: ${aEl} + ${bEl}`,
    value: elemAdj,
    explanation: elemExplanations[elemAdj] ?? `${aEl} + ${bEl}.`,
  });

  // Step 6: Modality adjustment
  const modAdj = modalityAdjustment(aMod, bMod);
  const modExplanations: Record<string, string> = {
    'Fixed-Fixed': 'Both Fixed — stubborn lock, highest friction.',
    'Cardinal-Cardinal': 'Both Cardinal — power struggle possible.',
    'Mutable-Mutable': 'Both Mutable — drift without anchor.',
    'Cardinal-Mutable': 'Cardinal + Mutable — best flow: initiator + adapter.',
    'Fixed-Mutable': 'Fixed + Mutable — mild friction: stability vs flexibility.',
    'Cardinal-Fixed': 'Cardinal + Fixed — neutral: starter + sustainer.',
  };
  const modPairKey = aMod === bMod ? `${aMod}-${bMod}` : [aMod, bMod].sort().join('-');
  steps.push({
    label: `Modality: ${aMod} + ${bMod}`,
    value: modAdj,
    explanation: modExplanations[modPairKey] ?? `${aMod} + ${bMod}.`,
  });

  // Step 7: Sum of adjustments
  const sumAdj = angleAdj + elemAdj + modAdj;
  steps.push({
    label: 'Sum of adjustments',
    value: Math.round(sumAdj * 100) / 100,
    explanation: `Angle (${angleAdj >= 0 ? '+' : ''}${angleAdj.toFixed(2)}) + Element (${elemAdj >= 0 ? '+' : ''}${elemAdj}) + Modality (${modAdj >= 0 ? '+' : ''}${modAdj}).`,
  });

  // Step 8: Planet pair weight
  const pairLabel = options?.planetPairLabel ?? crossAspect ?? 'default';
  const pWeight = options?.planetPairWeight ?? planetWeight(crossAspect);
  steps.push({
    label: `Planet weight: ${pairLabel}`,
    value: pWeight,
    explanation: pWeight > 1
      ? `${pairLabel} is a high-impact pair — amplifies adjustments ×${pWeight}.`
      : pWeight < 1
      ? `${pairLabel} is peripheral — dampens adjustments ×${pWeight}.`
      : `${pairLabel} — standard weight, no amplification.`,
  });

  // Step 9: Weighted adjustment
  const weightedAdj = sumAdj * pWeight;
  steps.push({
    label: 'Weighted adjustment',
    value: Math.round(weightedAdj * 100) / 100,
    explanation: `Sum (${sumAdj.toFixed(2)}) × planet weight (${pWeight}) = ${weightedAdj.toFixed(2)}.`,
  });

  // Step 10: Raw effort
  const rawEffort = 5 + weightedAdj;
  steps.push({
    label: 'Raw effort',
    value: Math.round(rawEffort * 100) / 100,
    explanation: `Baseline (5) + weighted adjustment (${weightedAdj >= 0 ? '+' : ''}${weightedAdj.toFixed(2)}) = ${rawEffort.toFixed(2)}.`,
  });

  // Step 11: Final effort (clamped)
  const effort = Math.max(1, Math.min(10, Math.round(rawEffort)));
  steps.push({
    label: 'Final effort (1-10)',
    value: effort,
    explanation: `Rounded to nearest integer and clamped between 1 and 10.`,
  });

  // Step 12: Harmony
  const harmony = 11 - effort;
  steps.push({
    label: 'Harmony (1-10)',
    value: harmony,
    explanation: `Harmony = 11 − effort. Lower effort → higher harmony.`,
  });

  return { effort, harmony, steps };
}

function calculateGrowthPotential(effortScore: number, angle: AngleKey): number {
  // Susan Miller's insight: "difficult matches often create stronger glue"
  let potential = effortScore; // More effort = more growth potential

  // Squares and oppositions have highest growth potential
  if (angle === 'square') potential += 1;
  if (angle === 'opposition') potential += 1.5;

  // But trines/sextiles still offer gentle growth
  if (angle === 'trine') potential = Math.max(potential, 5);
  if (angle === 'sextile') potential = Math.max(potential, 4);

  return Math.max(1, Math.min(10, Math.round(potential)));
}

// =============================================================================
// NARRATIVE GENERATOR
// =============================================================================

export function buildPerspective(
  from: SignKey,
  to: SignKey,
  lens: Lens,
  context: Context
): PerspectiveReport {
  const A = SIGN_LESSONS[from];
  const B = SIGN_LESSONS[to];
  const needsA = SIGN_NEEDS[from];
  const needsB = SIGN_NEEDS[to];

  // Get angle between signs
  const angleResult = getAngleBetweenSigns(from as any, to as any);
  const angle = angleResult?.key ?? 'conjunction';
  const angleDegrees = angleResult?.degrees ?? 0;

  const baseline: BaselineDynamics = {
    elementDynamic: getElementDynamic(A.element, B.element),
    modalityDynamic: getModalityDynamic(A.modality, B.modality),
    seasonalDynamic: getSeasonalDynamic(A.season, B.season),
  };

  const tone = getLensTone(lens);
  const { domain, priority } = getContextFlavor(context);
  const angleInfo = getAngleDescription(angle);

  // Build narrative
  const howFromPerceivesTo =
    `From ${from}'s perspective (${tone}), ${to} appears as ${B.element}/${B.modality} energy. ` +
    `Through the ${angleInfo.name} pattern, ${from} experiences this as: ${angleInfo.nature}. ` +
    baseline.elementDynamic;

  const whatFromNeedsFromTo =
    `In ${domain}, ${from} needs ${needsA.coreNeeds.slice(0, 2).join(' and ')} to stay open. ` +
    `With ${to}, the fastest path to connection is: ${needsA.bondingLanguage.slice(0, 2).join(' + ')}.`;

  // Friction points
  const frictionPoints: string[] = [];

  if (angle === 'square') {
    frictionPoints.push(`Square pressure: You trigger each other's growth edges—this is productive friction.`);
  }
  if (angle === 'opposition') {
    frictionPoints.push(`Opposition mirror: Strong attraction meets polarity. Balance is the lesson.`);
  }
  if (angle === 'quincunx') {
    frictionPoints.push(`Quincunx adjustment: Constant small compromises are required—accept this as normal.`);
  }
  if (A.element !== B.element) {
    frictionPoints.push(`Element translation needed: ${A.element} and ${B.element} process differently.`);
  }
  if (A.modality === 'Fixed' && B.modality === 'Fixed') {
    frictionPoints.push(`Fixed + Fixed: Don't let pride become a stalemate. Someone must yield first.`);
  }

  // Add stress signal awareness
  frictionPoints.push(
    `When ${from} is stressed, you may see: ${needsA.stressSignals[0]}. Treat it as a signal, not a verdict.`
  );

  // Growth advice
  const growthAdvice: string[] = [
    angleInfo.advice,
    `Match pace (modality) and language (element) before negotiating outcomes.`,
    `In ${domain}, prioritize ${priority}—this is what ${context} relationships need most.`,
  ];

  // Bridge opportunities (lens-specific)
  const bridgeOpportunities: string[] = [];
  if (lens === 'Sun') {
    bridgeOpportunities.push(`Sun-to-Sun: Your core identities can align on shared goals and mutual respect.`);
  }
  if (lens === 'Moon') {
    bridgeOpportunities.push(`Moon-to-Moon: Emotional attunement creates the glue. Honor each other's inner worlds.`);
  }
  if (lens === 'Rising') {
    bridgeOpportunities.push(`Rising-to-Rising: Your social styles can bridge differences your Suns might clash on.`);
  }

  const effortScore = calculateEffortScore(angle, A.element, B.element, A.modality, B.modality);
  const growthPotential = calculateGrowthPotential(effortScore, angle);

  return {
    from,
    to,
    lens,
    context,
    angle,
    angleDegrees,
    baseline,
    narrative: {
      howFromPerceivesTo,
      whatFromNeedsFromTo,
      frictionPoints,
      growthAdvice,
      bridgeOpportunities,
    },
    effortScore,
    growthPotential,
  };
}

/**
 * Build perspectives for one sign viewing all 12 signs
 */
export function buildAllFromOneSign(
  from: SignKey,
  lens: Lens,
  context: Context
): PerspectiveReport[] {
  const allSigns: SignKey[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  return allSigns.map(to => buildPerspective(from, to, lens, context));
}

/**
 * Build a full compatibility report comparing two profiles across all lenses
 */
export function buildFullCompatibilityReport(
  sunA: SignKey, moonA: SignKey, risingA: SignKey,
  sunB: SignKey, moonB: SignKey, risingB: SignKey,
  context: Context
): {
  sunToSun: { aToB: PerspectiveReport; bToA: PerspectiveReport };
  moonToMoon: { aToB: PerspectiveReport; bToA: PerspectiveReport };
  risingToRising: { aToB: PerspectiveReport; bToA: PerspectiveReport };
  overallEffort: number;
  overallGrowth: number;
  summary: string;
} {
  const sunToSun = {
    aToB: buildPerspective(sunA, sunB, 'Sun', context),
    bToA: buildPerspective(sunB, sunA, 'Sun', context),
  };

  const moonToMoon = {
    aToB: buildPerspective(moonA, moonB, 'Moon', context),
    bToA: buildPerspective(moonB, moonA, 'Moon', context),
  };

  const risingToRising = {
    aToB: buildPerspective(risingA, risingB, 'Rising', context),
    bToA: buildPerspective(risingB, risingA, 'Rising', context),
  };

  // Calculate overall scores (weighted average)
  const allReports = [
    sunToSun.aToB, sunToSun.bToA,
    moonToMoon.aToB, moonToMoon.bToA,
    risingToRising.aToB, risingToRising.bToA,
  ];

  const overallEffort = Math.round(
    allReports.reduce((sum, r) => sum + r.effortScore, 0) / allReports.length
  );

  const overallGrowth = Math.round(
    allReports.reduce((sum, r) => sum + r.growthPotential, 0) / allReports.length
  );

  // Generate summary
  let summary = '';
  if (overallEffort <= 4) {
    summary = 'This pairing flows naturally. The connection feels easy and intuitive.';
  } else if (overallEffort <= 6) {
    summary = 'This pairing requires moderate effort. Some friction, but workable with awareness.';
  } else {
    summary = 'This pairing requires significant work. The friction creates strong growth potential.';
  }

  if (moonToMoon.aToB.effortScore <= 4) {
    summary += ' Emotional attunement is strong—you feel safe together.';
  }

  if (risingToRising.aToB.effortScore <= 4 && sunToSun.aToB.effortScore > 5) {
    summary += ' Your Rising signs create a bridge between core differences.';
  }

  return {
    sunToSun,
    moonToMoon,
    risingToRising,
    overallEffort,
    overallGrowth,
    summary,
  };
}

// =============================================================================
// SYNASTRY MATRIX - 9-WAY CROSS-ASPECT ANALYSIS
// =============================================================================

// =============================================================================
// RELATIONSHIP-TYPE WEIGHT TABLES
// =============================================================================

export type RelationshipType = 'romantic' | 'bestFriend' | 'friend' | 'coworker';

/**
 * Per-relationship-type weights for each cross-aspect (each sums to 1.0).
 *
 * Romantic:    Sun–Moon cross-aspects dominate (identity ↔ emotional needs)
 * Best Friend: Moon stack dominates (emotional rhythm + how we feel together)
 * Friend:      Sun/social style matters more, tolerant of mismatch
 * Coworker:    Mission alignment + public interface matters most
 */
export const RELATIONSHIP_WEIGHTS: Record<RelationshipType, Record<CrossAspect, number>> = {
  romantic: {
    'Sun-Sun': 0.12,
    'Sun-Moon': 0.18,
    'Sun-Rising': 0.08,
    'Moon-Sun': 0.18,
    'Moon-Moon': 0.18,
    'Moon-Rising': 0.10,
    'Rising-Sun': 0.06,
    'Rising-Moon': 0.06,
    'Rising-Rising': 0.04,
  },
  bestFriend: {
    'Sun-Sun': 0.14,
    'Sun-Moon': 0.12,
    'Sun-Rising': 0.10,
    'Moon-Sun': 0.12,
    'Moon-Moon': 0.20,
    'Moon-Rising': 0.12,
    'Rising-Sun': 0.08,
    'Rising-Moon': 0.08,
    'Rising-Rising': 0.04,
  },
  friend: {
    'Sun-Sun': 0.18,
    'Sun-Moon': 0.10,
    'Sun-Rising': 0.12,
    'Moon-Sun': 0.10,
    'Moon-Moon': 0.16,
    'Moon-Rising': 0.12,
    'Rising-Sun': 0.10,
    'Rising-Moon': 0.08,
    'Rising-Rising': 0.04,
  },
  coworker: {
    'Sun-Sun': 0.22,
    'Sun-Moon': 0.08,
    'Sun-Rising': 0.14,
    'Moon-Sun': 0.08,
    'Moon-Moon': 0.10,
    'Moon-Rising': 0.10,
    'Rising-Sun': 0.12,
    'Rising-Moon': 0.10,
    'Rising-Rising': 0.06,
  },
};

// Default weights (romantic)
const ASPECT_WEIGHTS: Record<CrossAspect, number> = RELATIONSHIP_WEIGHTS.romantic;

// Cross-aspect insight templates
function generateCrossAspectInsight(
  aspect: CrossAspect,
  fromSign: SignKey,
  toSign: SignKey,
  angle: AngleKey,
  effortScore: number
): string {
  const fromEl = SIGN_LESSONS[fromSign].element;
  const toEl = SIGN_LESSONS[toSign].element;
  const isHarmonious = effortScore <= 4;
  const isChallenge = effortScore >= 7;

  const insights: Record<CrossAspect, { harmony: string; challenge: string; neutral: string }> = {
    'Sun-Sun': {
      harmony: `Your core identities naturally align—mutual respect flows easily`,
      challenge: `Your core identities clash—this friction builds character`,
      neutral: `Your identities require mindful navigation`,
    },
    'Moon-Moon': {
      harmony: `Emotional wavelengths sync—you feel safe together`,
      challenge: `Emotional styles differ—patience needed for understanding`,
      neutral: `Emotional attunement requires conscious effort`,
    },
    'Rising-Rising': {
      harmony: `Your social styles complement each other beautifully`,
      challenge: `First impressions may mislead—look deeper`,
      neutral: `Your approaches to life balance each other`,
    },
    'Sun-Moon': {
      harmony: `Your identity soothes their emotional world`,
      challenge: `Your directness may overwhelm their sensitivity`,
      neutral: `Your presence affects their inner world—tread gently`,
    },
    'Moon-Sun': {
      harmony: `Your emotional nature nurtures their identity`,
      challenge: `Your moods may confuse their sense of self`,
      neutral: `Your feelings influence how they see themselves`,
    },
    'Sun-Rising': {
      harmony: `Your core self resonates with how they present to the world`,
      challenge: `Your identity clashes with their social persona`,
      neutral: `Your essence affects their public face`,
    },
    'Rising-Sun': {
      harmony: `Your presentation style supports their identity`,
      challenge: `Your social style may overshadow their core self`,
      neutral: `How you appear impacts their sense of self`,
    },
    'Moon-Rising': {
      harmony: `Your emotional warmth softens their social edge`,
      challenge: `Your emotional needs may feel hidden behind their mask`,
      neutral: `Your inner world meets their outer presentation`,
    },
    'Rising-Moon': {
      harmony: `Your social grace creates emotional safety for them`,
      challenge: `Your social style may not reach their emotional depths`,
      neutral: `Your presentation affects their emotional security`,
    },
  };

  const template = insights[aspect];
  if (isHarmonious) return template.harmony;
  if (isChallenge) return template.challenge;
  return template.neutral;
}

// Generate key insight highlights
function generateKeyInsights(grid: CrossAspectReport[]): string[] {
  const insights: string[] = [];

  // Sort by harmony score to find best connections
  const sorted = [...grid].sort((a, b) => b.harmonyScore - a.harmonyScore);

  // Top strengths
  const best = sorted[0];
  if (best.harmonyScore >= 7) {
    insights.push(`✨ ${best.aspect}: ${best.insight}`);
  }

  // Find Moon-related insights (emotional)
  const moonAspects = grid.filter(g => g.fromLens === 'Moon' || g.toLens === 'Moon');
  const moonBest = moonAspects.sort((a, b) => b.harmonyScore - a.harmonyScore)[0];
  if (moonBest && moonBest.harmonyScore >= 6) {
    insights.push(`🌙 Emotional bridge: ${moonBest.insight}`);
  }

  // Find challenges with growth potential
  const challenges = grid.filter(g => g.effortScore >= 7);
  if (challenges.length > 0) {
    const mainChallenge = challenges[0];
    insights.push(`⚡ Growth edge (${mainChallenge.aspect}): ${mainChallenge.insight}`);
  }

  // Sun-Sun always noteworthy
  const sunSun = grid.find(g => g.aspect === 'Sun-Sun');
  if (sunSun && !insights.some(i => i.includes('Sun-Sun'))) {
    insights.push(`☀️ Core match: ${sunSun.insight}`);
  }

  return insights.slice(0, 4); // Max 4 key insights
}

/**
 * Build the full 9-way synastry matrix
 */
export function buildSynastryMatrix(
  sunA: SignKey, moonA: SignKey, risingA: SignKey,
  sunB: SignKey, moonB: SignKey, risingB: SignKey,
  context: Context,
  relationshipType: RelationshipType = 'romantic'
): SynastryMatrix {
  const profileA = { Sun: sunA, Moon: moonA, Rising: risingA };
  const profileB = { Sun: sunB, Moon: moonB, Rising: risingB };

  const aspectPairs: { aspect: CrossAspect; fromLens: Lens; toLens: Lens }[] = [
    { aspect: 'Sun-Sun', fromLens: 'Sun', toLens: 'Sun' },
    { aspect: 'Sun-Moon', fromLens: 'Sun', toLens: 'Moon' },
    { aspect: 'Sun-Rising', fromLens: 'Sun', toLens: 'Rising' },
    { aspect: 'Moon-Sun', fromLens: 'Moon', toLens: 'Sun' },
    { aspect: 'Moon-Moon', fromLens: 'Moon', toLens: 'Moon' },
    { aspect: 'Moon-Rising', fromLens: 'Moon', toLens: 'Rising' },
    { aspect: 'Rising-Sun', fromLens: 'Rising', toLens: 'Sun' },
    { aspect: 'Rising-Moon', fromLens: 'Rising', toLens: 'Moon' },
    { aspect: 'Rising-Rising', fromLens: 'Rising', toLens: 'Rising' },
  ];

  const grid: CrossAspectReport[] = aspectPairs.map(({ aspect, fromLens, toLens }) => {
    const fromSign = profileA[fromLens];
    const toSign = profileB[toLens];

    // Get angle between signs
    const angleResult = getAngleBetweenSigns(fromSign as any, toSign as any);
    const angle = angleResult?.key ?? 'conjunction';

    // Calculate effort score with full step-by-step breakdown
    const A = SIGN_LESSONS[fromSign];
    const B = SIGN_LESSONS[toSign];
    const { effort: effortScore, harmony: harmonyScore, steps } = calculateEffortWithSteps(
      angle, A.element, B.element, A.modality, B.modality, {
        crossAspect: aspect,
      }
    );

    // Generate insight
    const insight = generateCrossAspectInsight(aspect, fromSign, toSign, angle, effortScore);

    return {
      aspect,
      fromLens,
      toLens,
      fromSign,
      toSign,
      angle,
      effortScore,
      harmonyScore,
      insight,
      weight: RELATIONSHIP_WEIGHTS[relationshipType][aspect],
      steps,
    };
  });

  // Calculate weighted overall score (1-100 scale)
  const weightedSum = grid.reduce((sum, g) => sum + (g.harmonyScore * g.weight * 10), 0);
  const weightedScore = Math.round(weightedSum);

  // Generate key insights
  const keyInsights = generateKeyInsights(grid);

  // Find strengths (harmony >= 7)
  const strengths = grid
    .filter(g => g.harmonyScore >= 7)
    .map(g => `${g.aspect}: ${g.fromSign} → ${g.toSign} (${g.angle})`)
    .slice(0, 3);

  // Find challenges (effort >= 7)
  const challenges = grid
    .filter(g => g.effortScore >= 7)
    .map(g => `${g.aspect}: ${g.fromSign} → ${g.toSign} requires work (${g.angle})`)
    .slice(0, 3);

  // Growth areas (high effort + square/opposition)
  const growthAreas = grid
    .filter(g => g.effortScore >= 6 && (g.angle === 'square' || g.angle === 'opposition'))
    .map(g => `${g.aspect}: The ${g.angle} between ${g.fromSign} and ${g.toSign} builds strength`)
    .slice(0, 2);

  return {
    grid,
    weightedScore,
    keyInsights,
    strengths,
    challenges,
    growthAreas,
  };
}

/**
 * Get a quick compatibility rating label
 */
export function getCompatibilityLabel(score: number): { label: string; emoji: string; color: string } {
  if (score >= 80) return { label: 'Exceptional', emoji: '💫', color: '#22c55e' };
  if (score >= 70) return { label: 'Strong', emoji: '✨', color: '#84cc16' };
  if (score >= 60) return { label: 'Good', emoji: '💚', color: '#eab308' };
  if (score >= 50) return { label: 'Moderate', emoji: '🌱', color: '#f97316' };
  if (score >= 40) return { label: 'Challenging', emoji: '⚡', color: '#ef4444' };
  return { label: 'Complex', emoji: '🔥', color: '#dc2626' };
}

// =============================================================================
// CUSP-AWARE EFFORT SCORING (Blended Vectors)
// =============================================================================

/**
 * Pre-computed element adjacency matrix (4×4).
 * Row/col order: [Fire, Earth, Air, Water]
 * Values match the discrete elementAdjustment() function.
 *
 * Same element: -1, Supportive (Fire+Air, Earth+Water): -0.5,
 * Draining (Fire+Water, Air+Earth): +1, Neutral: +0.25
 */
const ELEMENT_ADJ_MATRIX: number[][] = [
  // Fire   Earth   Air    Water
  [ -1,    +0.25,  -0.5,  +1    ],  // Fire
  [ +0.25, -1,     +1,    -0.5  ],  // Earth
  [ -0.5,  +1,     -1,    +0.25 ],  // Air
  [ +1,    -0.5,   +0.25, -1    ],  // Water
];

/**
 * Pre-computed modality adjacency matrix (3×3).
 * Row/col order: [Cardinal, Fixed, Mutable]
 * Values match the discrete modalityAdjustment() function.
 *
 * Same Cardinal: +0.5, Same Fixed: +1, Same Mutable: +0.5
 * Cardinal+Mutable: -0.5, Fixed+Mutable: +0.5, Cardinal+Fixed: 0
 */
const MODALITY_ADJ_MATRIX: number[][] = [
  // Cardinal  Fixed  Mutable
  [ +0.5,     0,     -0.5 ],  // Cardinal
  [  0,      +1,     +0.5 ],  // Fixed
  [ -0.5,    +0.5,   +0.5 ],  // Mutable
];

/**
 * Compute continuous element adjustment from blended vectors.
 *
 * For each pair of element indices (i, j), multiply:
 *   aVec[i] × bVec[j] × ELEMENT_ADJ_MATRIX[i][j]
 *
 * This is the generalization of elementAdjustment() to continuous distributions.
 * When vectors are one-hot, the result is identical to the discrete version.
 */
function blendedElementAdjustment(aVec: ElementVector, bVec: ElementVector): number {
  let total = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      total += aVec[i] * bVec[j] * ELEMENT_ADJ_MATRIX[i][j];
    }
  }
  return total;
}

/**
 * Compute continuous modality adjustment from blended vectors.
 * Same approach as blendedElementAdjustment but for 3×3 modality matrix.
 */
function blendedModalityAdjustment(aVec: ModalityVector, bVec: ModalityVector): number {
  let total = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      total += aVec[i] * bVec[j] * MODALITY_ADJ_MATRIX[i][j];
    }
  }
  return total;
}

/**
 * Calculate effort score using blended sign metadata (cusp-aware).
 *
 * Same formula as calculateEffortScore, but uses continuous element/modality
 * vectors instead of discrete categories. When both inputs are pure signs
 * (one-hot vectors), the result is identical to the discrete version.
 *
 * Pipeline: computeCuspBlend() → blendFromCuspResult() → this function
 */
export function calculateBlendedEffortScore(
  angle: AngleKey,
  aBlend: BlendedSignMetadata,
  bBlend: BlendedSignMetadata,
  options?: {
    orb?: number;
    crossAspect?: CrossAspect;
    planetPairWeight?: number;
  }
): number {
  const orb = options?.orb ?? 0;

  const angleAdj = angleAdjustment(angle, orb);
  const elemAdj = blendedElementAdjustment(aBlend.elementVector, bBlend.elementVector);
  const modAdj = blendedModalityAdjustment(aBlend.modalityVector, bBlend.modalityVector);
  const pWeight = options?.planetPairWeight ?? planetWeight(options?.crossAspect);

  const rawEffort = 5 + (angleAdj + elemAdj + modAdj) * pWeight;

  return Math.max(1, Math.min(10, Math.round(rawEffort)));
}

/**
 * Calculate effort with step-by-step breakdown using blended vectors.
 *
 * Shows the continuous element/modality calculations plus which signs
 * contribute to the blend (e.g., "75% Taurus Earth + 25% Aries Fire").
 */
export function calculateBlendedEffortWithSteps(
  angle: AngleKey,
  aBlend: BlendedSignMetadata,
  bBlend: BlendedSignMetadata,
  options?: {
    orb?: number;
    crossAspect?: CrossAspect;
    planetPairWeight?: number;
    planetPairLabel?: string;
  }
): { effort: number; harmony: number; steps: EffortStep[] } {
  const orb = options?.orb ?? 0;
  const crossAspect = options?.crossAspect;
  const steps: EffortStep[] = [];

  // Step 1: Baseline
  steps.push({
    label: 'Baseline effort',
    value: 5,
    explanation: 'Neutral starting point before geometry, element, or modality.',
  });

  // Step 2: Blend description (Person A)
  if (aBlend.neighbor) {
    steps.push({
      label: `Blend A: ${aBlend.primary}`,
      value: Math.round(aBlend.primaryWeight * 100),
      explanation: `${aBlend.primary} ${Math.round(aBlend.primaryWeight * 100)}% + ${aBlend.neighbor} ${Math.round(aBlend.neighborWeight * 100)}% (cusp blend).`,
    });
  } else {
    steps.push({
      label: `Sign A: ${aBlend.primary}`,
      value: 100,
      explanation: `Pure ${aBlend.primary} — no cusp blending.`,
    });
  }

  // Step 3: Blend description (Person B)
  if (bBlend.neighbor) {
    steps.push({
      label: `Blend B: ${bBlend.primary}`,
      value: Math.round(bBlend.primaryWeight * 100),
      explanation: `${bBlend.primary} ${Math.round(bBlend.primaryWeight * 100)}% + ${bBlend.neighbor} ${Math.round(bBlend.neighborWeight * 100)}% (cusp blend).`,
    });
  } else {
    steps.push({
      label: `Sign B: ${bBlend.primary}`,
      value: 100,
      explanation: `Pure ${bBlend.primary} — no cusp blending.`,
    });
  }

  // Step 4: Orb factor
  const orbFact = orbFactor(angle, orb);
  steps.push({
    label: 'Orb factor',
    value: Math.round(orbFact * 100) / 100,
    explanation: orb === 0
      ? 'Sign-based (exact): full-strength aspect.'
      : `Orb = ${orb.toFixed(1)}° out of max ${(MAX_ORB_BY_ANGLE[angle] ?? 6)}°. Tighter orb → stronger effect.`,
  });

  // Step 5: Angle adjustment
  const angleAdj = angleAdjustment(angle, orb);
  steps.push({
    label: `Angle: ${angle}`,
    value: Math.round(angleAdj * 100) / 100,
    explanation: angleAdj < 0
      ? `${angle} is harmonious — lowers effort by ${Math.abs(angleAdj).toFixed(2)}.`
      : angleAdj > 0
      ? `${angle} is challenging — raises effort by ${angleAdj.toFixed(2)}.`
      : `${angle} is neutral — no angle adjustment.`,
  });

  // Step 6: Element adjustment (blended)
  const elemAdj = blendedElementAdjustment(aBlend.elementVector, bBlend.elementVector);
  const elemDesc = aBlend.neighbor || bBlend.neighbor
    ? `Blended element interaction: weighted average across ${aBlend.dominantElement}/${bBlend.dominantElement} distributions.`
    : `${aBlend.dominantElement} + ${bBlend.dominantElement} — discrete element pair.`;
  steps.push({
    label: `Element: ${aBlend.dominantElement} + ${bBlend.dominantElement}`,
    value: Math.round(elemAdj * 100) / 100,
    explanation: elemDesc,
  });

  // Step 7: Modality adjustment (blended)
  const modAdj = blendedModalityAdjustment(aBlend.modalityVector, bBlend.modalityVector);
  const modDesc = aBlend.neighbor || bBlend.neighbor
    ? `Blended modality interaction: weighted average across ${aBlend.dominantModality}/${bBlend.dominantModality} distributions.`
    : `${aBlend.dominantModality} + ${bBlend.dominantModality} — discrete modality pair.`;
  steps.push({
    label: `Modality: ${aBlend.dominantModality} + ${bBlend.dominantModality}`,
    value: Math.round(modAdj * 100) / 100,
    explanation: modDesc,
  });

  // Step 8: Sum of adjustments
  const sumAdj = angleAdj + elemAdj + modAdj;
  steps.push({
    label: 'Sum of adjustments',
    value: Math.round(sumAdj * 100) / 100,
    explanation: `Angle (${angleAdj >= 0 ? '+' : ''}${angleAdj.toFixed(2)}) + Element (${elemAdj >= 0 ? '+' : ''}${elemAdj.toFixed(2)}) + Modality (${modAdj >= 0 ? '+' : ''}${modAdj.toFixed(2)}).`,
  });

  // Step 9: Planet pair weight
  const pairLabel = options?.planetPairLabel ?? crossAspect ?? 'default';
  const pWeight = options?.planetPairWeight ?? planetWeight(crossAspect);
  steps.push({
    label: `Planet weight: ${pairLabel}`,
    value: pWeight,
    explanation: pWeight > 1
      ? `${pairLabel} is a high-impact pair — amplifies adjustments ×${pWeight}.`
      : pWeight < 1
      ? `${pairLabel} is peripheral — dampens adjustments ×${pWeight}.`
      : `${pairLabel} — standard weight, no amplification.`,
  });

  // Step 10: Weighted adjustment
  const weightedAdj = sumAdj * pWeight;
  steps.push({
    label: 'Weighted adjustment',
    value: Math.round(weightedAdj * 100) / 100,
    explanation: `Sum (${sumAdj.toFixed(2)}) × planet weight (${pWeight}) = ${weightedAdj.toFixed(2)}.`,
  });

  // Step 11: Raw effort
  const rawEffort = 5 + weightedAdj;
  steps.push({
    label: 'Raw effort',
    value: Math.round(rawEffort * 100) / 100,
    explanation: `Baseline (5) + weighted adjustment (${weightedAdj >= 0 ? '+' : ''}${weightedAdj.toFixed(2)}) = ${rawEffort.toFixed(2)}.`,
  });

  // Step 12: Final effort (clamped)
  const effort = Math.max(1, Math.min(10, Math.round(rawEffort)));
  steps.push({
    label: 'Final effort (1-10)',
    value: effort,
    explanation: 'Rounded to nearest integer and clamped between 1 and 10.',
  });

  // Step 13: Harmony
  const harmony = 11 - effort;
  steps.push({
    label: 'Harmony (1-10)',
    value: harmony,
    explanation: 'Harmony = 11 − effort. Lower effort → higher harmony.',
  });

  return { effort, harmony, steps };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default buildPerspective;
