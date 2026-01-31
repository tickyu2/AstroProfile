/**
 * Academy Practice Mode Question Bank
 * Auto-generated questions from cusp and pure sign archetypes
 */

import { CUSP_TRANSITIONS, CuspTransition, CuspDayArchetype } from './cuspArchetypes';
import {
  PURE_SIGN_ARCHETYPES,
  PureSignArchetype,
  ELEMENTS,
  MODALITIES,
  POLARITIES,
  getSignsByElement,
  getSignsByModality,
  getOppositeSign,
  getElementalTriplicity
} from './pureSignArchetypes';
import { PHI_CURVE } from '../utils/cuspHelpers';

// ============================================================================
// Types
// ============================================================================

export type QuestionType =
  | 'guess_blend'           // Given a date, guess the blend percentages
  | 'identify_archetype'    // Given traits, identify the archetype
  | 'match_mythic_name'     // Match mythic name to cusp/sign
  | 'element_transition'    // Identify the elemental dynamic
  | 'date_to_day'           // Given a date, identify which day (1-6) of the cusp
  | 'strength_shadow_sort'  // Sort traits into strengths vs shadows
  | 'cusp_or_pure'          // Is this date on a cusp or pure sign?
  | 'neighbor_signs'        // Identify neighboring signs
  | 'phi_curve_value'       // What's the φ-blend on day N?
  | 'sign_element'          // What element is this sign?
  | 'sign_modality'         // What modality is this sign?
  | 'sign_polarity'         // What polarity (Yin/Yang) is this sign?
  | 'element_triad'         // Which signs share this element?
  | 'opposite_sign'         // What is the opposite sign?
  | 'ruling_planet';        // What planet rules this sign?

export interface QuestionOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface PracticeQuestion {
  id: string;
  type: QuestionType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'cusps' | 'pure_signs' | 'elements' | 'phi_curve';
  prompt: string;
  context?: string;
  options: QuestionOption[];
  explanation: string;
  relatedArchetype?: string; // mythicName reference
}

// ============================================================================
// Question Generators
// ============================================================================

/**
 * Generate a "guess the blend" question for a cusp day
 */
export function generateGuessBlendQuestion(
  cusp: CuspTransition,
  archetype: CuspDayArchetype
): PracticeQuestion {
  const correctPercent = Math.round(archetype.blendNew * 100);

  // Generate wrong options
  const wrongOptions = [
    Math.max(5, correctPercent - 25),
    Math.min(95, correctPercent + 25),
    Math.round(Math.random() * 100)
  ].filter(v => Math.abs(v - correctPercent) > 5);

  const allOptions = [correctPercent, ...wrongOptions.slice(0, 3)];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  return {
    id: `blend-${cusp.id}-day${archetype.day}`,
    type: 'guess_blend',
    difficulty: archetype.day === 3 || archetype.day === 4 ? 'intermediate' : 'beginner',
    category: 'cusps',
    prompt: `On ${archetype.date}, Day ${archetype.day} of the ${cusp.cuspName}, what percentage of ${cusp.toSign} energy is present?`,
    context: `The ${cusp.cuspName} transitions from ${cusp.fromSign} to ${cusp.toSign}.`,
    options: shuffled.map((percent, i) => ({
      id: `opt-${i}`,
      label: `${percent}%`,
      isCorrect: percent === correctPercent
    })),
    explanation: `On Day ${archetype.day} of any cusp, the φ-curve gives us ${correctPercent}% of the new sign. This archetype is called "${archetype.mythicName}."`,
    relatedArchetype: archetype.mythicName
  };
}

/**
 * Generate an "identify the archetype" question from traits
 */
export function generateIdentifyArchetypeQuestion(
  archetype: CuspDayArchetype,
  cusp: CuspTransition,
  allArchetypes: CuspDayArchetype[]
): PracticeQuestion {
  // Pick 2-3 strengths as clues
  const clueTraits = archetype.strengths.slice(0, 3);

  // Get 3 wrong archetype names
  const wrongNames = allArchetypes
    .filter(a => a.mythicName !== archetype.mythicName)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(a => a.mythicName);

  const allNames = [archetype.mythicName, ...wrongNames];
  const shuffled = allNames.sort(() => Math.random() - 0.5);

  return {
    id: `identify-${archetype.mythicName.replace(/\s+/g, '-').toLowerCase()}`,
    type: 'identify_archetype',
    difficulty: 'intermediate',
    category: 'cusps',
    prompt: `Which archetype has these strengths: ${clueTraits.join(', ')}?`,
    context: `This archetype emerges during a zodiacal transition.`,
    options: shuffled.map((name, i) => ({
      id: `opt-${i}`,
      label: name,
      isCorrect: name === archetype.mythicName
    })),
    explanation: `"${archetype.mythicName}" (${archetype.title}) embodies ${clueTraits.join(', ')}. Life theme: "${archetype.lifeTheme}"`,
    relatedArchetype: archetype.mythicName
  };
}

/**
 * Generate a "match mythic name" question
 */
export function generateMatchMythicNameQuestion(
  archetype: CuspDayArchetype,
  cusp: CuspTransition
): PracticeQuestion {
  // Get wrong cusp names
  const wrongCusps = CUSP_TRANSITIONS
    .filter(c => c.id !== cusp.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allOptions = [
    { cusp, archetype },
    ...wrongCusps.map(c => ({
      cusp: c,
      archetype: c.archetypes[archetype.day - 1]
    }))
  ];

  const shuffledCusps = allOptions.sort(() => Math.random() - 0.5);

  return {
    id: `match-${archetype.mythicName.replace(/\s+/g, '-').toLowerCase()}`,
    type: 'match_mythic_name',
    difficulty: 'beginner',
    category: 'cusps',
    prompt: `"${archetype.mythicName}" belongs to which cusp?`,
    options: shuffledCusps.map((opt, i) => ({
      id: `opt-${i}`,
      label: opt.cusp.cuspName,
      isCorrect: opt.cusp.id === cusp.id
    })),
    explanation: `"${archetype.mythicName}" is Day ${archetype.day} (${archetype.date}) of the ${cusp.cuspName}, transitioning from ${cusp.fromSign} to ${cusp.toSign}.`,
    relatedArchetype: archetype.mythicName
  };
}

/**
 * Generate an element transition question
 */
export function generateElementTransitionQuestion(cusp: CuspTransition): PracticeQuestion {
  const wrongDynamics = [
    'Fire grounds into Earth stability',
    'Water evaporates into Air intellect',
    'Earth nurtures Water depth',
    'Air ignites Fire inspiration'
  ].filter(d => d !== cusp.elementalDynamic);

  const allOptions = [cusp.elementalDynamic, ...wrongDynamics.slice(0, 3)];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  return {
    id: `element-${cusp.id}`,
    type: 'element_transition',
    difficulty: 'intermediate',
    category: 'elements',
    prompt: `The ${cusp.cuspName} (${cusp.fromSign}→${cusp.toSign}) represents which elemental dynamic?`,
    context: `${cusp.fromSign} is ${cusp.fromElement}, ${cusp.toSign} is ${cusp.toElement}.`,
    options: shuffled.map((dynamic, i) => ({
      id: `opt-${i}`,
      label: dynamic,
      isCorrect: dynamic === cusp.elementalDynamic
    })),
    explanation: `The ${cusp.fromElement}→${cusp.toElement} transition creates the dynamic: "${cusp.elementalDynamic}"`,
    relatedArchetype: cusp.cuspName
  };
}

/**
 * Generate a φ-curve value question
 */
export function generatePhiCurveQuestion(day: number): PracticeQuestion {
  const phiValues = [0.13, 0.37, 0.58, 0.75, 0.89, 0.98];
  const correctValue = phiValues[day - 1];
  const correctPercent = Math.round(correctValue * 100);

  const wrongPercents = phiValues
    .filter((_, i) => i !== day - 1)
    .map(v => Math.round(v * 100))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allPercents = [correctPercent, ...wrongPercents];
  const shuffled = allPercents.sort(() => Math.random() - 0.5);

  return {
    id: `phi-day${day}`,
    type: 'phi_curve_value',
    difficulty: day <= 2 || day >= 5 ? 'beginner' : 'advanced',
    category: 'phi_curve',
    prompt: `According to the φ-curve (golden ratio), what percentage of the NEW sign is present on Day ${day} of any cusp?`,
    context: `The φ-curve follows the golden ratio (φ ≈ 1.618) to model natural transitions.`,
    options: shuffled.map((percent, i) => ({
      id: `opt-${i}`,
      label: `${percent}%`,
      isCorrect: percent === correctPercent
    })),
    explanation: `Day ${day} of the φ-curve = ${correctPercent}% new sign / ${100 - correctPercent}% old sign. The complete curve: [13%, 37%, 58%, 75%, 89%, 98%].`,
  };
}

/**
 * Generate a pure sign identification question
 */
export function generatePureSignQuestion(archetype: PureSignArchetype): PracticeQuestion {
  const wrongSigns = PURE_SIGN_ARCHETYPES
    .filter(a => a.sign !== archetype.sign)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allOptions = [archetype, ...wrongSigns];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  return {
    id: `pure-${archetype.sign.toLowerCase()}`,
    type: 'identify_archetype',
    difficulty: 'beginner',
    category: 'pure_signs',
    prompt: `Which sign is known as "${archetype.mythicName}" with the title "${archetype.title}"?`,
    options: shuffled.map((opt, i) => ({
      id: `opt-${i}`,
      label: `${opt.symbol} ${opt.sign}`,
      isCorrect: opt.sign === archetype.sign
    })),
    explanation: `${archetype.symbol} ${archetype.sign} is "${archetype.mythicName}" - ${archetype.title}. Element: ${archetype.element}, Modality: ${archetype.modality}.`,
    relatedArchetype: archetype.mythicName
  };
}

// ============================================================================
// Pure Sign Extended Question Generators
// ============================================================================

/**
 * Generate a "what element is this sign" question
 */
export function generateSignElementQuestion(archetype: PureSignArchetype): PracticeQuestion {
  const wrongElements = ELEMENTS.filter(e => e !== archetype.element);
  const shuffled = [archetype.element, ...wrongElements].sort(() => Math.random() - 0.5);

  return {
    id: `element-${archetype.sign.toLowerCase()}`,
    type: 'sign_element',
    difficulty: 'beginner',
    category: 'elements',
    prompt: `What element is ${archetype.symbol} ${archetype.sign}?`,
    options: shuffled.map((el, i) => ({
      id: `opt-${i}`,
      label: el,
      isCorrect: el === archetype.element
    })),
    explanation: `${archetype.sign} is a ${archetype.element} sign, along with ${getElementalTriplicity(archetype.element).filter(s => s !== archetype.sign).join(' and ')}.`,
    relatedArchetype: archetype.mythicName
  };
}

/**
 * Generate a "what modality is this sign" question
 */
export function generateSignModalityQuestion(archetype: PureSignArchetype): PracticeQuestion {
  const shuffled = [...MODALITIES].sort(() => Math.random() - 0.5);

  const modalityDescriptions: Record<string, string> = {
    Cardinal: 'initiating, enterprising',
    Fixed: 'stabilizing, persistent',
    Mutable: 'adapting, transitional'
  };

  return {
    id: `modality-${archetype.sign.toLowerCase()}`,
    type: 'sign_modality',
    difficulty: 'intermediate',
    category: 'pure_signs',
    prompt: `What modality is ${archetype.symbol} ${archetype.sign}?`,
    context: `Modalities describe how a sign engages with the world: Cardinal (beginning), Fixed (sustaining), or Mutable (adapting).`,
    options: shuffled.map((mod, i) => ({
      id: `opt-${i}`,
      label: `${mod} (${modalityDescriptions[mod]})`,
      isCorrect: mod === archetype.modality
    })),
    explanation: `${archetype.sign} is ${archetype.modality}. ${archetype.modality} signs ${modalityDescriptions[archetype.modality]}.`,
    relatedArchetype: archetype.mythicName
  };
}

/**
 * Generate a "what polarity is this sign" question
 */
export function generateSignPolarityQuestion(archetype: PureSignArchetype): PracticeQuestion {
  const shuffled = [...POLARITIES].sort(() => Math.random() - 0.5);

  const polarityDescriptions: Record<string, string> = {
    Yang: 'active, outward, expressive (Fire & Air)',
    Yin: 'receptive, inward, reflective (Earth & Water)'
  };

  return {
    id: `polarity-${archetype.sign.toLowerCase()}`,
    type: 'sign_polarity',
    difficulty: 'beginner',
    category: 'pure_signs',
    prompt: `Is ${archetype.symbol} ${archetype.sign} Yin or Yang?`,
    context: `Polarity describes energy direction: Yang (outward) or Yin (inward).`,
    options: shuffled.map((pol, i) => ({
      id: `opt-${i}`,
      label: `${pol} — ${polarityDescriptions[pol]}`,
      isCorrect: pol === archetype.polarity
    })),
    explanation: `${archetype.sign} is ${archetype.polarity}. As a ${archetype.element} sign, it carries ${archetype.polarity.toLowerCase()} energy.`,
    relatedArchetype: archetype.mythicName
  };
}

/**
 * Generate an "opposite sign" question
 */
export function generateOppositeSignQuestion(archetype: PureSignArchetype): PracticeQuestion {
  const correctOpposite = getOppositeSign(archetype.sign);
  const oppositeArchetype = PURE_SIGN_ARCHETYPES.find(a => a.sign === correctOpposite);

  const wrongSigns = PURE_SIGN_ARCHETYPES
    .filter(a => a.sign !== archetype.sign && a.sign !== correctOpposite)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allOptions = [oppositeArchetype!, ...wrongSigns];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  return {
    id: `opposite-${archetype.sign.toLowerCase()}`,
    type: 'opposite_sign',
    difficulty: 'intermediate',
    category: 'pure_signs',
    prompt: `What is the opposite sign of ${archetype.symbol} ${archetype.sign}?`,
    context: `Opposite signs sit across the zodiac wheel, 180° apart. They share modality but differ in element and polarity.`,
    options: shuffled.map((opt, i) => ({
      id: `opt-${i}`,
      label: `${opt.symbol} ${opt.sign}`,
      isCorrect: opt.sign === correctOpposite
    })),
    explanation: `${archetype.sign} (${archetype.element}) is opposite ${correctOpposite} (${oppositeArchetype?.element}). Both are ${archetype.modality} signs on the same axis.`,
    relatedArchetype: archetype.mythicName
  };
}

/**
 * Generate a "ruling planet" question
 */
export function generateRulingPlanetQuestion(archetype: PureSignArchetype): PracticeQuestion {
  const allPlanets = [...new Set(PURE_SIGN_ARCHETYPES.map(a => a.rulingPlanet))];
  const wrongPlanets = allPlanets
    .filter(p => p !== archetype.rulingPlanet)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const shuffled = [archetype.rulingPlanet, ...wrongPlanets].sort(() => Math.random() - 0.5);

  return {
    id: `ruler-${archetype.sign.toLowerCase()}`,
    type: 'ruling_planet',
    difficulty: 'intermediate',
    category: 'pure_signs',
    prompt: `What planet traditionally rules ${archetype.symbol} ${archetype.sign}?`,
    options: shuffled.map((planet, i) => ({
      id: `opt-${i}`,
      label: planet,
      isCorrect: planet === archetype.rulingPlanet
    })),
    explanation: `${archetype.sign} is ruled by ${archetype.rulingPlanet}. The ruling planet shapes the sign's core expression and motivation.`,
    relatedArchetype: archetype.mythicName
  };
}

/**
 * Generate an "element triad" question
 */
export function generateElementTriadQuestion(element: string): PracticeQuestion {
  const correctTriad = getElementalTriplicity(element);
  const correctSet = new Set(correctTriad);

  // Generate wrong triads
  const otherElements = ELEMENTS.filter(e => e !== element);
  const wrongTriads = otherElements.map(e => getElementalTriplicity(e));

  // Create options as comma-separated sign lists
  const allOptions = [correctTriad, ...wrongTriads];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  return {
    id: `triad-${element.toLowerCase()}`,
    type: 'element_triad',
    difficulty: 'intermediate',
    category: 'elements',
    prompt: `Which three signs form the ${element} triad?`,
    context: `Each element has three signs: one Cardinal, one Fixed, one Mutable.`,
    options: shuffled.map((triad, i) => {
      const labels = triad.map(s => {
        const arch = PURE_SIGN_ARCHETYPES.find(a => a.sign === s);
        return arch ? `${arch.symbol} ${arch.sign}` : s;
      });
      return {
        id: `opt-${i}`,
        label: labels.join(', '),
        isCorrect: triad.every(s => correctSet.has(s))
      };
    }),
    explanation: `The ${element} triad consists of ${correctTriad.join(', ')}. Each brings ${element}'s essence through a different modality.`,
  };
}

/**
 * Generate a "core motivation" question
 */
export function generateCoreMotivationQuestion(archetype: PureSignArchetype): PracticeQuestion {
  const wrongMotivations = PURE_SIGN_ARCHETYPES
    .filter(a => a.sign !== archetype.sign)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(a => a.coreMotivation);

  const allOptions = [archetype.coreMotivation, ...wrongMotivations];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  return {
    id: `motivation-${archetype.sign.toLowerCase()}`,
    type: 'identify_archetype',
    difficulty: 'advanced',
    category: 'pure_signs',
    prompt: `Which core motivation belongs to ${archetype.symbol} ${archetype.sign}?`,
    options: shuffled.map((mot, i) => ({
      id: `opt-${i}`,
      label: mot,
      isCorrect: mot === archetype.coreMotivation
    })),
    explanation: `${archetype.sign}'s core motivation: "${archetype.coreMotivation}" This drives their psychological expression and life path.`,
    relatedArchetype: archetype.mythicName
  };
}

// ============================================================================
// Question Bank Builder
// ============================================================================

/**
 * Build the complete question bank
 */
export function buildQuestionBank(): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];

  // Collect all cusp day archetypes for variety
  const allCuspArchetypes: CuspDayArchetype[] = [];
  CUSP_TRANSITIONS.forEach(cusp => {
    cusp.archetypes.forEach(arch => allCuspArchetypes.push(arch));
  });

  // Generate cusp questions
  CUSP_TRANSITIONS.forEach(cusp => {
    cusp.archetypes.forEach(archetype => {
      // Blend questions (one per archetype)
      questions.push(generateGuessBlendQuestion(cusp, archetype));

      // Identify questions (one per archetype)
      questions.push(generateIdentifyArchetypeQuestion(archetype, cusp, allCuspArchetypes));

      // Match mythic name questions (one per archetype)
      questions.push(generateMatchMythicNameQuestion(archetype, cusp));
    });

    // Element transition questions (one per cusp)
    questions.push(generateElementTransitionQuestion(cusp));
  });

  // Generate φ-curve questions
  for (let day = 1; day <= 6; day++) {
    questions.push(generatePhiCurveQuestion(day));
  }

  // Generate pure sign questions (comprehensive)
  PURE_SIGN_ARCHETYPES.forEach(archetype => {
    // Basic identification
    questions.push(generatePureSignQuestion(archetype));

    // Element questions
    questions.push(generateSignElementQuestion(archetype));

    // Modality questions
    questions.push(generateSignModalityQuestion(archetype));

    // Polarity questions
    questions.push(generateSignPolarityQuestion(archetype));

    // Opposite sign questions
    questions.push(generateOppositeSignQuestion(archetype));

    // Ruling planet questions
    questions.push(generateRulingPlanetQuestion(archetype));

    // Core motivation questions
    questions.push(generateCoreMotivationQuestion(archetype));
  });

  // Generate element triad questions (one per element)
  ELEMENTS.forEach(element => {
    questions.push(generateElementTriadQuestion(element));
  });

  return questions;
}

// ============================================================================
// Question Selection Helpers
// ============================================================================

/**
 * Get questions by type
 */
export function getQuestionsByType(
  questions: PracticeQuestion[],
  type: QuestionType
): PracticeQuestion[] {
  return questions.filter(q => q.type === type);
}

/**
 * Get questions by difficulty
 */
export function getQuestionsByDifficulty(
  questions: PracticeQuestion[],
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): PracticeQuestion[] {
  return questions.filter(q => q.difficulty === difficulty);
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(
  questions: PracticeQuestion[],
  category: 'cusps' | 'pure_signs' | 'elements' | 'phi_curve'
): PracticeQuestion[] {
  return questions.filter(q => q.category === category);
}

/**
 * Get a random subset of questions
 */
export function getRandomQuestions(
  questions: PracticeQuestion[],
  count: number
): PracticeQuestion[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get a balanced practice session
 */
export function getBalancedPracticeSession(
  questions: PracticeQuestion[],
  count: number = 10
): PracticeQuestion[] {
  const perDifficulty = Math.ceil(count / 3);

  const beginner = getRandomQuestions(
    getQuestionsByDifficulty(questions, 'beginner'),
    perDifficulty
  );
  const intermediate = getRandomQuestions(
    getQuestionsByDifficulty(questions, 'intermediate'),
    perDifficulty
  );
  const advanced = getRandomQuestions(
    getQuestionsByDifficulty(questions, 'advanced'),
    perDifficulty
  );

  return [...beginner, ...intermediate, ...advanced]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

// ============================================================================
// Pre-built Question Bank (lazy initialization)
// ============================================================================

let _questionBank: PracticeQuestion[] | null = null;

/**
 * Get the pre-built question bank
 */
export function getQuestionBank(): PracticeQuestion[] {
  if (!_questionBank) {
    _questionBank = buildQuestionBank();
  }
  return _questionBank;
}

/**
 * Get question bank statistics
 */
export function getQuestionBankStats() {
  const bank = getQuestionBank();
  return {
    total: bank.length,
    byType: {
      guess_blend: getQuestionsByType(bank, 'guess_blend').length,
      identify_archetype: getQuestionsByType(bank, 'identify_archetype').length,
      match_mythic_name: getQuestionsByType(bank, 'match_mythic_name').length,
      element_transition: getQuestionsByType(bank, 'element_transition').length,
      phi_curve_value: getQuestionsByType(bank, 'phi_curve_value').length
    },
    byDifficulty: {
      beginner: getQuestionsByDifficulty(bank, 'beginner').length,
      intermediate: getQuestionsByDifficulty(bank, 'intermediate').length,
      advanced: getQuestionsByDifficulty(bank, 'advanced').length
    },
    byCategory: {
      cusps: getQuestionsByCategory(bank, 'cusps').length,
      pure_signs: getQuestionsByCategory(bank, 'pure_signs').length,
      elements: getQuestionsByCategory(bank, 'elements').length,
      phi_curve: getQuestionsByCategory(bank, 'phi_curve').length
    }
  };
}
