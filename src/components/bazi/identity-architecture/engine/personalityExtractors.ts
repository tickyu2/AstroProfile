/**
 * Personality Extractors — Heaven, Earth, Human personality builders
 */

import { HIDDEN_STEMS } from '../../../../utils/baziWheels';
import type { Element, BaZiPillar, HeavenPersonality, EarthPersonality, HumanPersonality } from './identityTypes';

// ─── Lookup Tables ───

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

// ─── Helpers ───

function dominantElement(elements: string[]): Element {
  const counts: Record<string, number> = {};
  for (const el of elements) counts[el] = (counts[el] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Element;
}

// ─── Extractors ───

export function describeHeaven(pillars: BaZiPillar[]): HeavenPersonality {
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

export function describeEarth(pillars: BaZiPillar[]): EarthPersonality {
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

export function describeHuman(pillars: BaZiPillar[]): HumanPersonality {
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
