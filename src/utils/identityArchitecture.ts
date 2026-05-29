/**
 * Identity Architecture Engine
 *
 * Transforms BaZi pillar data into a psychological personality model:
 *   Heaven Personality  → mindset, worldview, conscious identity
 *   Earth Personality   → instincts, habits, body-level reactions
 *   Human Personality   → emotional core, motivations, subconscious
 *
 * Plus: Alignment Score, Internal Coherence Index, Identity Tension,
 *       and a synthesized Contradiction Narrative.
 *
 * Consumes the same pillar shape returned by calculateBaZi().
 */

import {
  HIDDEN_STEMS,
  SHENG_CYCLE,
  KE_CYCLE,
  ELEMENT_COLORS,
  type AlignmentData,
} from './baziWheels';

// =============================================================================
// TYPES
// =============================================================================

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type PillarRole = 'Year' | 'Month' | 'Day' | 'Hour';

/** Shape consumed from calculateBaZi().pillars */
export interface BaZiPillar {
  name: string;              // 'Year' | 'Month' | 'Day' | 'Hour'
  stem: { element: string; polarity: string; index: number; char: string; english: string };
  branch: { element: string; polarity: string; index: number; char: string; animal: string };
  hiddenRoots?: Array<{ stem: string; pct: number; type: string; meaning: string }>;
}

export interface HeavenPersonality {
  dominant: Element;
  cognitiveStyle: string;
  worldview: string;
  decisionLogic: string;
  strengths: string[];
  blindSpots: string[];
}

export interface EarthPersonality {
  dominant: Element;
  instincts: string;
  stressBehaviors: string;
  habits: string;
  somaticPatterns: string;
}

export interface HumanPersonality {
  dominant: Element;
  emotionalNeeds: string;
  motivations: string;
  shadowDesires: string;
  subconsciousFears: string;
}

export interface IdentityTension {
  elementalConflicts: string[];
  roleConflicts: string[];
  subconsciousConflicts: string[];
}

export interface IdentityArchitecture {
  heavenPersonality: HeavenPersonality;
  earthPersonality: EarthPersonality;
  humanPersonality: HumanPersonality;
  alignmentScore: number;           // 0–12
  internalCoherenceIndex: number;   // 0–100
  identityTension: IdentityTension;
  contradictionNarrative: string;
  pillarAlignments: AlignmentData[];
}

// =============================================================================
// ELEMENT HELPERS
// =============================================================================

const SHENG_PRODUCES: Record<string, string> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
};

const KE_CONTROLS: Record<string, string> = {
  Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
};

function isSame(a: string, b: string): boolean { return a === b; }

function isHarmonious(a: string, b: string): boolean {
  return SHENG_PRODUCES[a] === b || SHENG_PRODUCES[b] === a;
}

function isControlling(a: string, b: string): boolean {
  return KE_CONTROLS[a] === b || KE_CONTROLS[b] === a;
}

export { ELEMENT_COLORS };

// =============================================================================
// 1. ALIGNMENT SCORE (0–12)
// =============================================================================

function scoreAlignment(a: AlignmentData): number {
  if (a.aligned) return 3;
  if (a.harmonic) return 2;
  // Mixed — some relationship but not harmonic
  return 1;
}

function computeAlignmentScore(alignments: AlignmentData[]): number {
  return alignments.reduce((sum, a) => sum + scoreAlignment(a), 0);
}

// =============================================================================
// 2. INTERNAL COHERENCE INDEX (0–100)
// =============================================================================

function coherenceForPillar(a: AlignmentData): number {
  const pairs: [string, string][] = [
    [a.heaven, a.earth],
    [a.earth, a.human],
    [a.heaven, a.human],
  ];
  let score = 0;
  for (const [x, y] of pairs) {
    if (isSame(x, y)) score += 2;
    else if (isHarmonious(x, y)) score += 1;
  }
  return score; // 0–6
}

function computeCoherenceIndex(alignments: AlignmentData[]): number {
  const total = alignments.reduce((sum, a) => sum + coherenceForPillar(a), 0);
  const max = alignments.length * 6;
  return Math.round((total / max) * 100);
}

// =============================================================================
// 3. PERSONALITY EXTRACTION — HEAVEN
// =============================================================================

const COGNITIVE_STYLE: Record<Element, string> = {
  Wood: 'Vision-driven, growth-oriented, exploratory thinking.',
  Fire: 'Expressive, meaning-seeking, intuitive leaps.',
  Earth: 'Grounded, pragmatic, stability-focused reasoning.',
  Metal: 'Analytical, precise, standard-driven thinking.',
  Water: 'Strategic, adaptive, depth-oriented cognition.',
};

const WORLDVIEW: Record<Element, string> = {
  Wood: 'Sees life as a field of possibilities and growth.',
  Fire: 'Sees life as a stage for meaning, passion, and connection.',
  Earth: 'Sees life as something to stabilize, support, and maintain.',
  Metal: 'Sees life through principles, rules, and refinement.',
  Water: 'Sees life as fluid, cyclical, and full of hidden layers.',
};

const DECISION_LOGIC: Record<Element, string> = {
  Wood: 'Chooses based on growth potential and future expansion.',
  Fire: 'Chooses based on passion, resonance, and emotional truth.',
  Earth: 'Chooses based on security, practicality, and reliability.',
  Metal: 'Chooses based on standards, logic, and correctness.',
  Water: 'Chooses based on timing, leverage, and long-term flow.',
};

const HEAVEN_STRENGTHS: Record<Element, string[]> = {
  Wood: ['Big-picture vision', 'Initiative', 'Creative problem-solving'],
  Fire: ['Inspiration', 'Charisma', 'Emotional warmth'],
  Earth: ['Stability', 'Reliability', 'Practical wisdom'],
  Metal: ['Clarity', 'Discernment', 'High standards'],
  Water: ['Adaptability', 'Strategic depth', 'Intuition'],
};

const HEAVEN_BLINDSPOTS: Record<Element, string[]> = {
  Wood: ['Impatience with limits', 'Difficulty with follow-through'],
  Fire: ['Volatility', 'Over-dramatization'],
  Earth: ['Rigidity', 'Over-responsibility'],
  Metal: ['Perfectionism', 'Harsh self-judgment'],
  Water: ['Overthinking', 'Avoidance of confrontation'],
};

function dominantElement(elements: string[]): Element {
  const counts: Record<string, number> = {};
  for (const el of elements) counts[el] = (counts[el] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Element;
}

function describeHeaven(pillars: BaZiPillar[]): HeavenPersonality {
  const heavenEls = pillars.map(p => p.stem.element);
  const dom = dominantElement(heavenEls);
  return {
    dominant: dom,
    cognitiveStyle: COGNITIVE_STYLE[dom],
    worldview: WORLDVIEW[dom],
    decisionLogic: DECISION_LOGIC[dom],
    strengths: HEAVEN_STRENGTHS[dom],
    blindSpots: HEAVEN_BLINDSPOTS[dom],
  };
}

// =============================================================================
// 4. PERSONALITY EXTRACTION — EARTH
// =============================================================================

const INSTINCTS: Record<Element, string> = {
  Wood: 'Instinct to move, explore, and initiate.',
  Fire: 'Instinct to connect, express, and react quickly.',
  Earth: 'Instinct to stabilize, hold, and protect.',
  Metal: 'Instinct to refine, correct, and control.',
  Water: 'Instinct to withdraw, observe, and adapt.',
};

const STRESS_BEHAVIORS: Record<Element, string> = {
  Wood: 'Under stress, may become restless, impulsive, or scattered.',
  Fire: 'Under stress, may become dramatic, reactive, or overheated.',
  Earth: 'Under stress, may become stubborn, heavy, or overburdened.',
  Metal: 'Under stress, may become critical, rigid, or cold.',
  Water: 'Under stress, may become avoidant, anxious, or overly secretive.',
};

const HABITS: Record<Element, string> = {
  Wood: 'Habit of starting new things, seeking stimulation and growth.',
  Fire: 'Habit of seeking interaction, excitement, and emotional intensity.',
  Earth: 'Habit of maintaining routines, supporting others, and holding space.',
  Metal: 'Habit of organizing, optimizing, and enforcing standards.',
  Water: 'Habit of observing, researching, and planning quietly.',
};

const SOMATIC: Record<Element, string> = {
  Wood: 'Body responds to movement; tension shows in muscles and tendons.',
  Fire: 'Body responds to excitement; tension shows in heart and circulation.',
  Earth: 'Body responds to comfort; tension shows in digestion and heaviness.',
  Metal: 'Body responds to order; tension shows in breath and posture.',
  Water: 'Body responds to rest; tension shows in kidneys, lower back, and fatigue.',
};

function describeEarth(pillars: BaZiPillar[]): EarthPersonality {
  const earthEls = pillars.map(p => p.branch.element);
  const dom = dominantElement(earthEls);
  return {
    dominant: dom,
    instincts: INSTINCTS[dom],
    stressBehaviors: STRESS_BEHAVIORS[dom],
    habits: HABITS[dom],
    somaticPatterns: SOMATIC[dom],
  };
}

// =============================================================================
// 5. PERSONALITY EXTRACTION — HUMAN (Hidden Stems)
// =============================================================================

const EMOTIONAL_NEEDS: Record<Element, string> = {
  Wood: 'Needs growth, progress, and a sense of forward movement.',
  Fire: 'Needs connection, recognition, and emotional warmth.',
  Earth: 'Needs stability, belonging, and reliability.',
  Metal: 'Needs integrity, clarity, and self-respect.',
  Water: 'Needs depth, safety, and time to process.',
};

const MOTIVATIONS: Record<Element, string> = {
  Wood: 'Motivated by new horizons, learning, and expansion.',
  Fire: 'Motivated by passion, inspiration, and shared experiences.',
  Earth: 'Motivated by responsibility, care, and tangible results.',
  Metal: 'Motivated by mastery, excellence, and doing things right.',
  Water: 'Motivated by understanding, insight, and long-term security.',
};

const SHADOW_DESIRES: Record<Element, string> = {
  Wood: 'Shadow desire to escape limits and obligations.',
  Fire: 'Shadow desire to be adored and never forgotten.',
  Earth: 'Shadow desire to control others through care.',
  Metal: 'Shadow desire to judge and dominate through standards.',
  Water: 'Shadow desire to stay hidden and untouchable.',
};

const SUBCONSCIOUS_FEARS: Record<Element, string> = {
  Wood: 'Subconscious fear of stagnation and being trapped.',
  Fire: 'Subconscious fear of rejection and emotional coldness.',
  Earth: 'Subconscious fear of instability and abandonment.',
  Metal: 'Subconscious fear of failure and corruption.',
  Water: 'Subconscious fear of exposure and losing control of the unknown.',
};

function describeHuman(pillars: BaZiPillar[]): HumanPersonality {
  // Aggregate hidden stems across all pillars by element weight
  const totals: Record<string, number> = {};
  for (const p of pillars) {
    const hs = HIDDEN_STEMS[p.branch.index];
    if (!hs) continue;
    for (const h of hs) {
      totals[h.element] = (totals[h.element] || 0) + h.percentage;
    }
  }
  const dom = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] as Element || 'Earth';
  return {
    dominant: dom,
    emotionalNeeds: EMOTIONAL_NEEDS[dom],
    motivations: MOTIVATIONS[dom],
    shadowDesires: SHADOW_DESIRES[dom],
    subconsciousFears: SUBCONSCIOUS_FEARS[dom],
  };
}

// =============================================================================
// 6. IDENTITY TENSION ENGINE
// =============================================================================

const ROLE_LABELS: Record<string, string> = {
  Year: 'public self',
  Month: 'work self',
  Day: 'true self',
  Hour: 'future self',
};

function computeTension(pillars: BaZiPillar[], alignments: AlignmentData[]): IdentityTension {
  const tension: IdentityTension = {
    elementalConflicts: [],
    roleConflicts: [],
    subconsciousConflicts: [],
  };

  // Find Day pillar
  const dayIdx = pillars.findIndex(p => p.name === 'Day');
  if (dayIdx < 0) return tension;

  const dayHeaven = pillars[dayIdx].stem.element;
  const dayEarth = pillars[dayIdx].branch.element;

  // A. Core Day Heaven vs Earth
  if (isControlling(dayHeaven, dayEarth)) {
    tension.elementalConflicts.push(
      `Your core mindset (${dayHeaven}) and core instincts (${dayEarth}) often try to control each other, creating inner push\u2013pull.`
    );
  } else if (!isSame(dayHeaven, dayEarth) && !isHarmonious(dayHeaven, dayEarth)) {
    tension.elementalConflicts.push(
      `Your core mindset (${dayHeaven}) and core instincts (${dayEarth}) speak different languages, so you may feel torn between what you think and what you do.`
    );
  }

  // B. Role conflicts: compare each pillar's heaven to Day's heaven
  for (let i = 0; i < pillars.length; i++) {
    if (i === dayIdx) continue;
    const role = pillars[i].name;
    const el = pillars[i].stem.element;
    if (!isSame(el, dayHeaven) && !isHarmonious(el, dayHeaven)) {
      tension.roleConflicts.push(
        `Tension between your ${ROLE_LABELS[role] || role} and true self: ${el} mindset there vs ${dayHeaven} at your core.`
      );
    }
  }

  // C. Subconscious: dominant hidden stem vs heaven stem per pillar
  for (let i = 0; i < pillars.length; i++) {
    const hs = HIDDEN_STEMS[pillars[i].branch.index];
    if (!hs || hs.length === 0) continue;
    const domHidden = hs[0].element;
    const heaven = pillars[i].stem.element;
    if (!isSame(domHidden, heaven) && !isHarmonious(domHidden, heaven)) {
      tension.subconsciousConflicts.push(
        `In your ${pillars[i].name.toLowerCase()} pillar, your subconscious (${domHidden}) and conscious mindset (${heaven}) pull in different directions.`
      );
    }
  }

  return tension;
}

// =============================================================================
// 7. CONTRADICTION NARRATIVE
// =============================================================================

function buildNarrative(
  tension: IdentityTension,
  alignmentScore: number,
  coherenceIndex: number,
): string {
  const lines: string[] = [];

  lines.push(
    `Your inner architecture shows an alignment score of ${alignmentScore}/12 and an internal coherence of ${coherenceIndex}%.`
  );

  if (coherenceIndex >= 80) {
    lines.push(
      'You are largely internally consistent \u2014 the tensions that do exist are meaningful growth edges rather than fractures.'
    );
  } else if (coherenceIndex >= 60) {
    lines.push(
      'You hold a mix of coherence and contradiction, which can feel like living between multiple versions of yourself.'
    );
  } else if (coherenceIndex >= 40) {
    lines.push(
      'Your identity is built from strongly contrasting parts, which can feel confusing but also deeply creative.'
    );
  } else {
    lines.push(
      'Your inner world contains significant oppositions \u2014 the architecture of someone who holds paradox and lives at the intersection of competing forces.'
    );
  }

  if (tension.elementalConflicts.length) {
    lines.push('\nAt the core level, your elements sometimes argue:');
    for (const c of tension.elementalConflicts) lines.push(`\u2022 ${c}`);
  }

  if (tension.roleConflicts.length) {
    lines.push('\nAcross life roles, you show up differently:');
    for (const c of tension.roleConflicts) lines.push(`\u2022 ${c}`);
  }

  if (tension.subconsciousConflicts.length) {
    lines.push('\nBeneath the surface, your conscious and subconscious layers disagree:');
    for (const c of tension.subconsciousConflicts) lines.push(`\u2022 ${c}`);
  }

  return lines.join('\n');
}

// =============================================================================
// 8. MAIN BUILDER
// =============================================================================

export function buildIdentityArchitecture(
  pillars: BaZiPillar[],
  alignments: AlignmentData[],
): IdentityArchitecture {
  const heavenPersonality = describeHeaven(pillars);
  const earthPersonality = describeEarth(pillars);
  const humanPersonality = describeHuman(pillars);

  const alignmentScore = computeAlignmentScore(alignments);
  const internalCoherenceIndex = computeCoherenceIndex(alignments);

  const identityTension = computeTension(pillars, alignments);
  const contradictionNarrative = buildNarrative(
    identityTension,
    alignmentScore,
    internalCoherenceIndex,
  );

  return {
    heavenPersonality,
    earthPersonality,
    humanPersonality,
    alignmentScore,
    internalCoherenceIndex,
    identityTension,
    contradictionNarrative,
    pillarAlignments: alignments,
  };
}
