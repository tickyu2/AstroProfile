/**
 * Practice Mode System
 * Central exports for the Academy's ritual learning loop
 */

// ============================================================================
// Scoring Engine
// ============================================================================

export {
  createInitialScore,
  applyAnswer,
  calculateLevel,
  getLevelProgress,
  getDifficulty,
  getDifficultyLabel,
  getAdaptiveDifficulty,
  getMasteryTier,
  getMasteryTierFromScore,
  getMasteryTierInfo,
  getSessionSummary,
  getPerformanceBreakdown,
  saveScore,
  loadScore,
  clearScore
} from './scoring';

// ============================================================================
// Adaptive Question Generation
// ============================================================================

export {
  generateAdaptiveQuestion,
  generateFamilyQuestion,
  generatePureSignQuestion,
  generateCuspQuestion,
  generateStreakAwareQuestion,
  generateFocusedQuestion
} from './adaptiveGenerator';

// ============================================================================
// Question Generators
// ============================================================================

export {
  generateIdentifySignQuestion,
  generateElementQuestion,
  generateModalityQuestion,
  generatePolarityQuestion,
  generateElementTriadQuestion,
  generateOppositeSignQuestion,
  generateRulingPlanetQuestion,
  generateCoreMotivationQuestion,
  PURE_SIGN_GENERATORS
} from './pureSignQuestions';

export {
  generateGuessBlendQuestion,
  generateIdentifyArchetypeQuestion,
  generateCuspElementsQuestion,
  generatePhiCurveQuestion,
  generateMythicNameQuestion,
  generateDayProfileQuestion,
  CUSP_GENERATORS
} from './cuspQuestions';

// ============================================================================
// UI Components
// ============================================================================

export { PracticeMode } from './PracticeMode';

// ============================================================================
// Types
// ============================================================================

export type {
  PracticeScore,
  SessionSummary,
  MasteryTier,
  DifficultyLevel,
  AnswerResult
} from './scoring';

export type {
  QuestionFamily,
  QuestionType,
  PureSignQuestionType,
  CuspQuestionType,
  PracticeQuestionBase,
  PureSignQuestion,
  CuspQuestion,
  PracticeQuestion as UnifiedPracticeQuestion,
  QuestionGenerator,
  AdaptiveGeneratorConfig,
  QuestionPoolEntry
} from './types';

export type {
  PracticeQuestion,
  PracticeModeProps
} from './PracticeMode';

export type { FocusCategory } from './adaptiveGenerator';
