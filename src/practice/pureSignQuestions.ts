/**
 * Pure Sign Question Generators
 * Question factories for the Academy's pure sign knowledge
 */

import { PureSignQuestion } from './types';
import { PURE_SIGNS, ELEMENTS, MODALITIES, POLARITIES } from '../data/pureSignArchetypes';

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

function pickRandomExcluding<T>(arr: T[], exclude: T): T {
  const filtered = arr.filter(item => item !== exclude);
  return pickRandom(filtered);
}

// ============================================================================
// Identify Sign Question (Difficulty 1)
// ============================================================================

export function generateIdentifySignQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);
  const distractors = shuffle(PURE_SIGNS.filter(s => s.sign !== sign.sign))
    .slice(0, 3)
    .map(s => s.sign);

  const options = shuffle([sign.sign, ...distractors]);

  // Vary the prompt style
  const promptStyles = [
    `Which zodiac sign is represented by the symbol ${sign.symbol}?`,
    `"${sign.title}" — which sign does this describe?`,
    `Which sign is known as "${sign.mythicName}"?`,
  ];

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'identify-sign',
    prompt: pickRandom(promptStyles),
    options,
    correctAnswer: sign.sign,
    explanation: `${sign.symbol} ${sign.sign} — ${sign.title}`,
    difficulty: 1,
    meta: { sign: sign.sign }
  };
}

// ============================================================================
// Element Question (Difficulty 1)
// ============================================================================

export function generateElementQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);
  const elements = Object.keys(ELEMENTS);
  const options = shuffle(elements);

  const promptStyles = [
    `What element is ${sign.sign} (${sign.symbol})?`,
    `${sign.sign} belongs to which elemental family?`,
    `The ${sign.mythicName} (${sign.sign}) is aligned with which element?`,
  ];

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'sign-element',
    prompt: pickRandom(promptStyles),
    options,
    correctAnswer: sign.element,
    explanation: `${sign.sign} is a ${sign.element} sign — ${ELEMENTS[sign.element as keyof typeof ELEMENTS].quality}`,
    difficulty: 1,
    meta: { sign: sign.sign, element: sign.element }
  };
}

// ============================================================================
// Modality Question (Difficulty 2)
// ============================================================================

export function generateModalityQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);
  const modalities = Object.keys(MODALITIES);
  const options = shuffle(modalities);

  const promptStyles = [
    `What modality is ${sign.sign}?`,
    `${sign.symbol} ${sign.sign} — Cardinal, Fixed, or Mutable?`,
    `How does ${sign.sign} engage with reality?`,
  ];

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'sign-modality',
    prompt: pickRandom(promptStyles),
    options,
    correctAnswer: sign.modality,
    explanation: `${sign.sign} is ${sign.modality} — ${MODALITIES[sign.modality as keyof typeof MODALITIES].description}`,
    difficulty: 2,
    meta: { sign: sign.sign, modality: sign.modality }
  };
}

// ============================================================================
// Polarity Question (Difficulty 2)
// ============================================================================

export function generatePolarityQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);
  const polarities = Object.keys(POLARITIES);
  const options = shuffle(polarities);

  const promptStyles = [
    `What polarity is ${sign.sign}?`,
    `${sign.symbol} ${sign.sign} — Yang or Yin?`,
    `Is ${sign.sign}'s energy outward (Yang) or inward (Yin)?`,
  ];

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'sign-polarity',
    prompt: pickRandom(promptStyles),
    options,
    correctAnswer: sign.polarity,
    explanation: `${sign.sign} is ${sign.polarity} — ${POLARITIES[sign.polarity as keyof typeof POLARITIES].description}`,
    difficulty: 2,
    meta: { sign: sign.sign, polarity: sign.polarity }
  };
}

// ============================================================================
// Element Triad Question (Difficulty 2)
// ============================================================================

export function generateElementTriadQuestion(): PureSignQuestion {
  const element = pickRandom(Object.keys(ELEMENTS));
  const signsOfElement = PURE_SIGNS.filter(s => s.element === element);
  const correctSigns = signsOfElement.map(s => s.sign).sort().join(', ');

  // Generate wrong triads
  const otherElements = Object.keys(ELEMENTS).filter(e => e !== element);
  const wrongTriads = otherElements.map(e => {
    return PURE_SIGNS.filter(s => s.element === e)
      .map(s => s.sign)
      .sort()
      .join(', ');
  });

  const options = shuffle([correctSigns, ...wrongTriads]);

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'element-triad',
    prompt: `Which three signs belong to the ${element} element?`,
    options,
    correctAnswer: correctSigns,
    explanation: `The ${element} triad: ${correctSigns}`,
    difficulty: 2,
    meta: { element }
  };
}

// ============================================================================
// Opposite Sign Question (Difficulty 3)
// ============================================================================

const OPPOSITE_SIGNS: Record<string, string> = {
  'Aries': 'Libra',
  'Taurus': 'Scorpio',
  'Gemini': 'Sagittarius',
  'Cancer': 'Capricorn',
  'Leo': 'Aquarius',
  'Virgo': 'Pisces',
  'Libra': 'Aries',
  'Scorpio': 'Taurus',
  'Sagittarius': 'Gemini',
  'Capricorn': 'Cancer',
  'Aquarius': 'Leo',
  'Pisces': 'Virgo'
};

export function generateOppositeSignQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);
  const opposite = OPPOSITE_SIGNS[sign.sign];

  const wrongAnswers = shuffle(
    PURE_SIGNS.filter(s => s.sign !== sign.sign && s.sign !== opposite)
  ).slice(0, 3).map(s => s.sign);

  const options = shuffle([opposite, ...wrongAnswers]);

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'opposite-sign',
    prompt: `What sign is opposite to ${sign.sign} on the zodiac wheel?`,
    options,
    correctAnswer: opposite,
    explanation: `${sign.sign} and ${opposite} form an axis — complementary opposites that balance each other.`,
    difficulty: 3,
    meta: { sign: sign.sign }
  };
}

// ============================================================================
// Ruling Planet Question (Difficulty 3)
// ============================================================================

export function generateRulingPlanetQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);

  // Get all unique ruling planets
  const allPlanets = [...new Set(PURE_SIGNS.map(s => s.rulingPlanet))];
  const wrongPlanets = shuffle(allPlanets.filter(p => p !== sign.rulingPlanet)).slice(0, 3);

  const options = shuffle([sign.rulingPlanet, ...wrongPlanets]);

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'ruling-planet',
    prompt: `Which planet rules ${sign.sign}?`,
    options,
    correctAnswer: sign.rulingPlanet,
    explanation: `${sign.sign} is ruled by ${sign.rulingPlanet}, shaping its core expression.`,
    difficulty: 3,
    meta: { sign: sign.sign }
  };
}

// ============================================================================
// Core Motivation Question (Difficulty 3)
// ============================================================================

export function generateCoreMotivationQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);

  const wrongMotivations = shuffle(
    PURE_SIGNS.filter(s => s.sign !== sign.sign)
  ).slice(0, 3).map(s => s.coreMotivation);

  const options = shuffle([sign.coreMotivation, ...wrongMotivations]);

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'core-motivation',
    prompt: `What is the core motivation of ${sign.sign}?`,
    options,
    correctAnswer: sign.coreMotivation,
    explanation: `${sign.sign}'s drive: "${sign.coreMotivation}"`,
    difficulty: 3,
    meta: { sign: sign.sign }
  };
}

// ============================================================================
// Psychological Profile Question (Difficulty 4)
// ============================================================================

export function generatePsychologicalProfileQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);

  // Extract a key phrase from the profile
  const profile = sign.psychologicalProfile;

  const wrongSigns = shuffle(
    PURE_SIGNS.filter(s => s.sign !== sign.sign)
  ).slice(0, 3);

  const options = shuffle([sign.sign, ...wrongSigns.map(s => s.sign)]);

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'identify-sign',
    prompt: `Which sign is described: "${profile.slice(0, 120)}..."?`,
    options,
    correctAnswer: sign.sign,
    explanation: `This is ${sign.sign} — ${sign.title}`,
    difficulty: 4,
    meta: { sign: sign.sign }
  };
}

// ============================================================================
// Strengths/Shadows Question (Difficulty 4)
// ============================================================================

export function generateStrengthsQuestion(): PureSignQuestion {
  const sign = pickRandom(PURE_SIGNS);
  const strength = pickRandom(sign.strengths);

  const wrongSigns = shuffle(
    PURE_SIGNS.filter(s => !s.strengths.includes(strength))
  ).slice(0, 3);

  const options = shuffle([sign.sign, ...wrongSigns.map(s => s.sign)]);

  return {
    id: generateId(),
    family: 'pure-sign',
    type: 'identify-sign',
    prompt: `Which sign has the strength: "${strength}"?`,
    options,
    correctAnswer: sign.sign,
    explanation: `${sign.sign}'s strengths include: ${sign.strengths.join(', ')}`,
    difficulty: 4,
    meta: { sign: sign.sign }
  };
}

// ============================================================================
// All Pure Sign Generators
// ============================================================================

export const PURE_SIGN_GENERATORS = {
  'identify-sign': generateIdentifySignQuestion,
  'sign-element': generateElementQuestion,
  'sign-modality': generateModalityQuestion,
  'sign-polarity': generatePolarityQuestion,
  'element-triad': generateElementTriadQuestion,
  'opposite-sign': generateOppositeSignQuestion,
  'ruling-planet': generateRulingPlanetQuestion,
  'core-motivation': generateCoreMotivationQuestion,
};

export default PURE_SIGN_GENERATORS;
