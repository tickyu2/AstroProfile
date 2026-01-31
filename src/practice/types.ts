/**
 * Practice Mode Types
 * Unified question types for the adaptive learning system
 */

// ============================================================================
// Question Family & Types
// ============================================================================

export type QuestionFamily = 'pure-sign' | 'cusp';

export type PureSignQuestionType =
  | 'identify-sign'      // Given symbol/description, identify sign
  | 'sign-element'       // What element is this sign?
  | 'sign-modality'      // What modality is this sign?
  | 'sign-polarity'      // What polarity is this sign?
  | 'element-triad'      // Which signs share this element?
  | 'opposite-sign'      // What's the opposite sign?
  | 'ruling-planet'      // What planet rules this sign?
  | 'core-motivation';   // What drives this sign?

export type CuspQuestionType =
  | 'guess-blend'        // Given day, guess the blend percentage
  | 'identify-archetype' // Identify cusp archetype from description
  | 'cusp-elements'      // What elements blend in this cusp?
  | 'cusp-day-blend'     // What's the blend on day X?
  | 'phi-curve'          // Questions about the φ-curve
  | 'mythic-name';       // Identify cusp from mythic name

export type QuestionType = PureSignQuestionType | CuspQuestionType;

// ============================================================================
// Question Structure
// ============================================================================

export interface PracticeQuestionBase {
  id: string;
  family: QuestionFamily;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 1 | 2 | 3 | 4;
  meta?: Record<string, unknown>;
}

export interface PureSignQuestion extends PracticeQuestionBase {
  family: 'pure-sign';
  type: PureSignQuestionType;
  meta?: {
    sign?: string;
    element?: string;
    modality?: string;
    polarity?: string;
  };
}

export interface CuspQuestion extends PracticeQuestionBase {
  family: 'cusp';
  type: CuspQuestionType;
  meta?: {
    fromSign?: string;
    toSign?: string;
    day?: number;
    blendPercent?: number;
  };
}

export type PracticeQuestion = PureSignQuestion | CuspQuestion;

// ============================================================================
// Generator Function Types
// ============================================================================

export type QuestionGenerator = () => PracticeQuestion;

export type AdaptiveGeneratorConfig = {
  /** Weight for pure sign questions at each difficulty */
  pureSignWeights: [number, number, number, number];
  /** Weight for cusp questions at each difficulty */
  cuspWeights: [number, number, number, number];
};

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveGeneratorConfig = {
  // At difficulty 1, 80% pure sign, 20% cusp
  // At difficulty 4, 30% pure sign, 70% cusp
  pureSignWeights: [0.8, 0.6, 0.4, 0.3],
  cuspWeights: [0.2, 0.4, 0.6, 0.7]
};

// ============================================================================
// Helper Types
// ============================================================================

export interface QuestionPoolEntry {
  type: QuestionType;
  generator: QuestionGenerator;
  minDifficulty: 1 | 2 | 3 | 4;
  weight: number;
}
