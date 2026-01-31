/**
 * Cusp Question Generators
 * Question factories for the Academy's 72 cusp archetypes
 */

import { CuspQuestion } from './types';
import { CUSP_ARCHETYPES, PHI_CURVE_VALUES } from '../data/cuspArchetypes';

// ============================================================================
// Utility Functions
// ============================================================================

function generateId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// φ-curve values as array for easy access
const PHI_BLEND_VALUES = [13, 37, 58, 75, 89, 98];

// ============================================================================
// Guess Blend Question (Difficulty 2-3)
// ============================================================================

export function generateGuessBlendQuestion(): CuspQuestion {
  const day = Math.floor(Math.random() * 6) + 1; // 1-6
  const correctBlend = PHI_BLEND_VALUES[day - 1];

  // Generate plausible wrong answers
  const wrongBlends = shuffle(
    PHI_BLEND_VALUES.filter(b => b !== correctBlend)
  ).slice(0, 3);

  const options = shuffle([
    `${correctBlend}%`,
    ...wrongBlends.map(b => `${b}%`)
  ]);

  const cusp = pickRandom(CUSP_ARCHETYPES);

  return {
    id: generateId(),
    family: 'cusp',
    type: 'guess-blend',
    prompt: `On Day ${day} of the ${cusp.fromSign}→${cusp.toSign} cusp, how much of ${cusp.toSign} is present?`,
    options,
    correctAnswer: `${correctBlend}%`,
    explanation: `The φ-curve gives Day ${day} a ${correctBlend}% blend of the new sign.`,
    difficulty: day <= 3 ? 2 : 3,
    meta: {
      fromSign: cusp.fromSign,
      toSign: cusp.toSign,
      day,
      blendPercent: correctBlend
    }
  };
}

// ============================================================================
// Identify Archetype Question (Difficulty 3)
// ============================================================================

export function generateIdentifyArchetypeQuestion(): CuspQuestion {
  const cusp = pickRandom(CUSP_ARCHETYPES);
  const dayArchetype = pickRandom(cusp.archetypes);

  // Get wrong cusp names
  const wrongCusps = shuffle(
    CUSP_ARCHETYPES.filter(c => c.id !== cusp.id)
  ).slice(0, 3);

  const options = shuffle([
    `${cusp.fromSign}→${cusp.toSign}`,
    ...wrongCusps.map(c => `${c.fromSign}→${c.toSign}`)
  ]);

  return {
    id: generateId(),
    family: 'cusp',
    type: 'identify-archetype',
    prompt: `"${dayArchetype.mythicName}" — which cusp transition does this archetype belong to?`,
    options,
    correctAnswer: `${cusp.fromSign}→${cusp.toSign}`,
    explanation: `${dayArchetype.mythicName} is Day ${dayArchetype.day} of the ${cusp.cuspName} (${cusp.fromSign}→${cusp.toSign}).`,
    difficulty: 3,
    meta: {
      fromSign: cusp.fromSign,
      toSign: cusp.toSign,
      day: dayArchetype.day
    }
  };
}

// ============================================================================
// Cusp Elements Question (Difficulty 2)
// ============================================================================

export function generateCuspElementsQuestion(): CuspQuestion {
  const cusp = pickRandom(CUSP_ARCHETYPES);

  const correctAnswer = `${cusp.fromElement}→${cusp.toElement}`;

  // Generate wrong element transitions
  const elements = ['Fire', 'Earth', 'Air', 'Water'];
  const wrongTransitions: string[] = [];

  while (wrongTransitions.length < 3) {
    const from = pickRandom(elements);
    const to = pickRandom(elements);
    const transition = `${from}→${to}`;
    if (transition !== correctAnswer && !wrongTransitions.includes(transition)) {
      wrongTransitions.push(transition);
    }
  }

  const options = shuffle([correctAnswer, ...wrongTransitions]);

  return {
    id: generateId(),
    family: 'cusp',
    type: 'cusp-elements',
    prompt: `The ${cusp.fromSign}→${cusp.toSign} cusp transitions between which elements?`,
    options,
    correctAnswer,
    explanation: `${cusp.cuspName}: ${cusp.elementalDynamic}`,
    difficulty: 2,
    meta: {
      fromSign: cusp.fromSign,
      toSign: cusp.toSign
    }
  };
}

// ============================================================================
// φ-Curve Knowledge Question (Difficulty 3)
// ============================================================================

export function generatePhiCurveQuestion(): CuspQuestion {
  const questionTypes = [
    {
      prompt: 'What percentage of the new sign is present on Day 1 of any cusp?',
      correctAnswer: '13%',
      wrongAnswers: ['25%', '50%', '37%'],
      explanation: 'Day 1 = 13% new sign — the transition has just begun.'
    },
    {
      prompt: 'On which day does the cusp reach approximately 50% blend?',
      correctAnswer: 'Day 3',
      wrongAnswers: ['Day 2', 'Day 4', 'Day 5'],
      explanation: 'Day 3 = 58% new sign, the closest to the midpoint.'
    },
    {
      prompt: 'What is the φ-curve exponent used in cusp calculations?',
      correctAnswer: '≈1.6 (golden ratio)',
      wrongAnswers: ['2.0', '1.0', '0.5'],
      explanation: 'The golden ratio (φ ≈ 1.618) models natural transitions.'
    },
    {
      prompt: 'How many days does each cusp transition span?',
      correctAnswer: '6 days',
      wrongAnswers: ['3 days', '7 days', '10 days'],
      explanation: 'Each cusp spans 6 days, creating 72 total cusp archetypes (12 × 6).'
    },
    {
      prompt: 'By Day 6, what percentage of the new sign is present?',
      correctAnswer: '98%',
      wrongAnswers: ['90%', '85%', '100%'],
      explanation: 'Day 6 = 98% — only echoes of the previous sign remain.'
    }
  ];

  const selected = pickRandom(questionTypes);
  const options = shuffle([selected.correctAnswer, ...selected.wrongAnswers]);

  return {
    id: generateId(),
    family: 'cusp',
    type: 'phi-curve',
    prompt: selected.prompt,
    options,
    correctAnswer: selected.correctAnswer,
    explanation: selected.explanation,
    difficulty: 3,
    meta: {}
  };
}

// ============================================================================
// Mythic Name Question (Difficulty 4)
// ============================================================================

export function generateMythicNameQuestion(): CuspQuestion {
  const cusp = pickRandom(CUSP_ARCHETYPES);

  const wrongCusps = shuffle(
    CUSP_ARCHETYPES.filter(c => c.id !== cusp.id)
  ).slice(0, 3);

  const options = shuffle([
    cusp.cuspName,
    ...wrongCusps.map(c => c.cuspName)
  ]);

  return {
    id: generateId(),
    family: 'cusp',
    type: 'mythic-name',
    prompt: `The ${cusp.fromSign}→${cusp.toSign} transition is known as what?`,
    options,
    correctAnswer: cusp.cuspName,
    explanation: `${cusp.cuspName} — ${cusp.elementalDynamic}`,
    difficulty: 4,
    meta: {
      fromSign: cusp.fromSign,
      toSign: cusp.toSign
    }
  };
}

// ============================================================================
// Day Profile Question (Difficulty 4)
// ============================================================================

export function generateDayProfileQuestion(): CuspQuestion {
  const cusp = pickRandom(CUSP_ARCHETYPES);
  const dayArchetype = pickRandom(cusp.archetypes);

  // Truncate profile for the prompt
  const profileSnippet = dayArchetype.psychologicalProfile.slice(0, 100);

  const options = shuffle([
    `Day ${dayArchetype.day} (${dayArchetype.blendNew}% ${cusp.toSign})`,
    ...cusp.archetypes
      .filter(a => a.day !== dayArchetype.day)
      .slice(0, 3)
      .map(a => `Day ${a.day} (${a.blendNew}% ${cusp.toSign})`)
  ]);

  return {
    id: generateId(),
    family: 'cusp',
    type: 'cusp-day-blend',
    prompt: `"${profileSnippet}..." — which day of the ${cusp.fromSign}→${cusp.toSign} cusp?`,
    options,
    correctAnswer: `Day ${dayArchetype.day} (${dayArchetype.blendNew}% ${cusp.toSign})`,
    explanation: `${dayArchetype.mythicName} — ${dayArchetype.title}`,
    difficulty: 4,
    meta: {
      fromSign: cusp.fromSign,
      toSign: cusp.toSign,
      day: dayArchetype.day,
      blendPercent: dayArchetype.blendNew
    }
  };
}

// ============================================================================
// Elemental Dynamic Question (Difficulty 3)
// ============================================================================

export function generateElementalDynamicQuestion(): CuspQuestion {
  const cusp = pickRandom(CUSP_ARCHETYPES);

  const wrongCusps = shuffle(
    CUSP_ARCHETYPES.filter(c => c.id !== cusp.id)
  ).slice(0, 3);

  const options = shuffle([
    cusp.elementalDynamic,
    ...wrongCusps.map(c => c.elementalDynamic)
  ]);

  return {
    id: generateId(),
    family: 'cusp',
    type: 'identify-archetype',
    prompt: `Which cusp has this elemental dynamic: "${cusp.fromSign}→${cusp.toSign}"?`,
    options,
    correctAnswer: cusp.elementalDynamic,
    explanation: `${cusp.cuspName}: ${cusp.fromElement} transitioning to ${cusp.toElement}`,
    difficulty: 3,
    meta: {
      fromSign: cusp.fromSign,
      toSign: cusp.toSign
    }
  };
}

// ============================================================================
// All Cusp Generators
// ============================================================================

export const CUSP_GENERATORS = {
  'guess-blend': generateGuessBlendQuestion,
  'identify-archetype': generateIdentifyArchetypeQuestion,
  'cusp-elements': generateCuspElementsQuestion,
  'phi-curve': generatePhiCurveQuestion,
  'mythic-name': generateMythicNameQuestion,
  'cusp-day-blend': generateDayProfileQuestion,
};

export default CUSP_GENERATORS;
