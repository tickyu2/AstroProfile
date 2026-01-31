/**
 * Adaptive Question Generator
 * The living difficulty curve that transforms the Academy into an initiatory engine
 *
 * Reads current score + streak → Computes difficulty tier →
 * Chooses question family (pure sign vs cusp) → Returns unified PracticeQuestion
 */

import { PracticeScore, getDifficulty, DifficultyLevel } from './scoring';
import { PracticeQuestion, QuestionFamily, DEFAULT_ADAPTIVE_CONFIG } from './types';

// Pure Sign Generators
import {
  generateIdentifySignQuestion,
  generateElementQuestion,
  generateModalityQuestion,
  generatePolarityQuestion,
  generateElementTriadQuestion,
  generateOppositeSignQuestion,
  generateRulingPlanetQuestion,
  generateCoreMotivationQuestion
} from './pureSignQuestions';

// Cusp Generators
import {
  generateGuessBlendQuestion,
  generateIdentifyArchetypeQuestion,
  generateCuspElementsQuestion,
  generatePhiCurveQuestion,
  generateMythicNameQuestion,
  generateDayProfileQuestion
} from './cuspQuestions';

// ============================================================================
// Question Pools by Difficulty
// ============================================================================

type GeneratorFn = () => PracticeQuestion;

interface QuestionPool {
  pureSign: GeneratorFn[];
  cusp: GeneratorFn[];
}

/**
 * Question pools organized by difficulty tier
 * Each tier has appropriate generators for that skill level
 */
const QUESTION_POOLS: Record<DifficultyLevel, QuestionPool> = {
  // Tier 1: Basics — pure sign identification, elements
  1: {
    pureSign: [
      generateIdentifySignQuestion,
      generateElementQuestion,
      generateIdentifySignQuestion, // weighted more heavily
    ],
    cusp: [
      generateCuspElementsQuestion,
    ]
  },

  // Tier 2: Intermediate — modality, polarity, simple cusp blends
  2: {
    pureSign: [
      generateIdentifySignQuestion,
      generateElementQuestion,
      generateModalityQuestion,
      generatePolarityQuestion,
      generateElementTriadQuestion,
    ],
    cusp: [
      generateGuessBlendQuestion,
      generateCuspElementsQuestion,
    ]
  },

  // Tier 3: Advanced — opposite signs, ruling planets, cusp archetypes
  3: {
    pureSign: [
      generateModalityQuestion,
      generatePolarityQuestion,
      generateOppositeSignQuestion,
      generateRulingPlanetQuestion,
      generateCoreMotivationQuestion,
    ],
    cusp: [
      generateGuessBlendQuestion,
      generateIdentifyArchetypeQuestion,
      generatePhiCurveQuestion,
    ]
  },

  // Tier 4: Mastery — deep cusp knowledge, mythic names, day profiles
  4: {
    pureSign: [
      generateOppositeSignQuestion,
      generateRulingPlanetQuestion,
      generateCoreMotivationQuestion,
    ],
    cusp: [
      generateGuessBlendQuestion,
      generateIdentifyArchetypeQuestion,
      generateMythicNameQuestion,
      generateDayProfileQuestion,
      generatePhiCurveQuestion,
    ]
  }
};

// ============================================================================
// Core Adaptive Logic
// ============================================================================

/**
 * Pick a random item from an array
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Determine question family based on difficulty and config weights
 */
function chooseFamily(difficulty: DifficultyLevel): QuestionFamily {
  const weights = DEFAULT_ADAPTIVE_CONFIG;
  const pureSignWeight = weights.pureSignWeights[difficulty - 1];

  return Math.random() < pureSignWeight ? 'pure-sign' : 'cusp';
}

/**
 * Generate an adaptive question based on current score
 *
 * The difficulty curve:
 * - Tier 1 (streak 0-4): 80% pure sign basics, 20% simple cusp
 * - Tier 2 (streak 5-9): 60% pure sign (modality/polarity), 40% cusp blends
 * - Tier 3 (streak 10-19): 40% advanced pure sign, 60% cusp archetypes
 * - Tier 4 (streak 20+): 30% mastery pure sign, 70% deep cusp knowledge
 */
export function generateAdaptiveQuestion(score: PracticeScore): PracticeQuestion {
  const difficulty = getDifficulty(score);
  const family = chooseFamily(difficulty);
  const pool = QUESTION_POOLS[difficulty];

  // Select generator from appropriate pool
  const generators = family === 'pure-sign' ? pool.pureSign : pool.cusp;
  const generator = pickRandom(generators);

  // Generate and return question
  const question = generator();

  // Ensure difficulty matches tier (some generators may have their own difficulty)
  return {
    ...question,
    difficulty: Math.max(question.difficulty, difficulty) as 1 | 2 | 3 | 4
  };
}

// ============================================================================
// Targeted Question Generation
// ============================================================================

/**
 * Generate a question of specific family (for testing or focused practice)
 */
export function generateFamilyQuestion(
  family: QuestionFamily,
  difficulty: DifficultyLevel = 1
): PracticeQuestion {
  const pool = QUESTION_POOLS[difficulty];
  const generators = family === 'pure-sign' ? pool.pureSign : pool.cusp;
  return pickRandom(generators)();
}

/**
 * Generate a pure sign question at given difficulty
 */
export function generatePureSignQuestion(difficulty: DifficultyLevel = 1): PracticeQuestion {
  return generateFamilyQuestion('pure-sign', difficulty);
}

/**
 * Generate a cusp question at given difficulty
 */
export function generateCuspQuestion(difficulty: DifficultyLevel = 1): PracticeQuestion {
  return generateFamilyQuestion('cusp', difficulty);
}

// ============================================================================
// Streak-Aware Question Selection
// ============================================================================

/**
 * Generate question with streak awareness
 * After a wrong answer, slightly easier questions help rebuild confidence
 */
export function generateStreakAwareQuestion(
  score: PracticeScore,
  lastWasCorrect: boolean
): PracticeQuestion {
  let difficulty = getDifficulty(score);

  // If last answer was wrong and streak is 0, drop difficulty by 1 (minimum 1)
  if (!lastWasCorrect && score.streak === 0 && difficulty > 1) {
    difficulty = (difficulty - 1) as DifficultyLevel;
  }

  // If on a hot streak (5+), occasionally challenge with harder question
  if (score.streak >= 5 && Math.random() < 0.3 && difficulty < 4) {
    difficulty = (difficulty + 1) as DifficultyLevel;
  }

  const family = chooseFamily(difficulty);
  const pool = QUESTION_POOLS[difficulty];
  const generators = family === 'pure-sign' ? pool.pureSign : pool.cusp;

  return pickRandom(generators)();
}

// ============================================================================
// Category Focus Mode
// ============================================================================

export type FocusCategory =
  | 'elements'
  | 'modalities'
  | 'polarities'
  | 'planets'
  | 'cusps'
  | 'phi-curve';

const CATEGORY_GENERATORS: Record<FocusCategory, GeneratorFn[]> = {
  'elements': [generateElementQuestion, generateElementTriadQuestion, generateCuspElementsQuestion],
  'modalities': [generateModalityQuestion],
  'polarities': [generatePolarityQuestion],
  'planets': [generateRulingPlanetQuestion],
  'cusps': [generateGuessBlendQuestion, generateIdentifyArchetypeQuestion, generateMythicNameQuestion],
  'phi-curve': [generatePhiCurveQuestion, generateGuessBlendQuestion, generateDayProfileQuestion],
};

/**
 * Generate a question focused on a specific category
 */
export function generateFocusedQuestion(category: FocusCategory): PracticeQuestion {
  const generators = CATEGORY_GENERATORS[category];
  return pickRandom(generators)();
}

// ============================================================================
// Exports
// ============================================================================

export default generateAdaptiveQuestion;
