/**
 * explainability.ts
 *
 * Explainability Contract for GENESIS Cathedral
 * Enables progressive depth disclosure (L0 → L3) in UI
 *
 * L0 = Postcard summary (one-liner)
 * L1 = Guided steps (what factors)
 * L2 = Full math (formulas, coefficients)
 * L3 = Researcher/debug (raw data dump)
 *
 * Reference: 12 Foundational Stones - Stone III (Flap Cosmology)
 */

import type {
  CompatibilityLevel,
  Element,
  NeoDimensionScores,
  TenGodGroup
} from './bazi.types';

// =============================================================================
// EXPLAIN LEVELS
// =============================================================================

/** Progressive depth levels for explanation */
export type ExplainLevel = 'L0' | 'L1' | 'L2' | 'L3';

/** Human-readable depth names */
export const EXPLAIN_LEVEL_NAMES: Record<ExplainLevel, string> = {
  L0: 'Summary',
  L1: 'Guided',
  L2: 'Technical',
  L3: 'Debug'
};

/** Depth descriptions */
export const EXPLAIN_LEVEL_DESC: Record<ExplainLevel, string> = {
  L0: 'One-sentence postcard summary',
  L1: 'Step-by-step factor breakdown',
  L2: 'Full mathematical formulas and coefficients',
  L3: 'Raw data for researchers and debugging'
};

// =============================================================================
// MATH STEP STRUCTURES
// =============================================================================

/** Single calculation step with explanation */
export interface MathStep {
  /** Step label (e.g., "Cosine Similarity") */
  label: string;
  /** Formula in human-readable form */
  formula: string;
  /** Substituted values */
  substitution?: string;
  /** Computed result */
  result: number;
  /** Unit or format (e.g., "0-1", "percent") */
  unit?: string;
  /** Cathedral Voice interpretation */
  interpretation?: string;
}

/** NEO similarity math breakdown */
export interface NeoMathExplain {
  /** Cosine similarity calculation */
  cosine: MathStep;
  /** Euclidean distance calculation */
  euclidean: MathStep;
  /** Domain-weighted score calculation */
  domainWeighted: MathStep;
  /** Per-domain scores */
  domainScores: {
    N: MathStep;
    E: MathStep;
    O: MathStep;
    A: MathStep;
    C: MathStep;
  };
  /** Final blend formula */
  blend: MathStep;
}

/** WuXing compatibility math breakdown */
export interface WuXingMathExplain {
  /** Normalized vector A */
  vectorA: MathStep;
  /** Normalized vector B */
  vectorB: MathStep;
  /** Bilinear matrix multiplication */
  bilinear: MathStep;
  /** Dominant elements comparison */
  dominants: {
    elementA: Element;
    elementB: Element;
    relationship: 'same' | 'generating' | 'controlling' | 'neutral';
    interpretation: string;
  };
}

/** Ten Gods compatibility math breakdown */
export interface TenGodsMathExplain {
  /** Folded 5-group vector A */
  vector5A: MathStep;
  /** Folded 5-group vector B */
  vector5B: MathStep;
  /** Bilinear matrix multiplication */
  bilinear: MathStep;
  /** Per-group analysis */
  groupAnalysis: {
    group: TenGodGroup;
    valueA: number;
    valueB: number;
    interaction: 'resonance' | 'synergy' | 'friction' | 'neutral';
    interpretation: string;
  }[];
}

/** BaZi blend math breakdown */
export interface BaziMathExplain {
  /** Raw blend before modifiers */
  rawBlend: MathStep;
  /** Favorable elements modifier */
  favorableModifier: MathStep;
  /** Interactions modifier */
  interactionsModifier: MathStep;
  /** Combined modifier (clamped) */
  combinedModifier: MathStep;
  /** Final adjusted blend */
  adjustedBlend: MathStep;
}

/** Final fusion math breakdown */
export interface FusionMathExplain {
  /** NEO contribution */
  neoContribution: MathStep;
  /** BaZi contribution */
  baziContribution: MathStep;
  /** Total formula */
  totalFormula: MathStep;
}

// =============================================================================
// CATHEDRAL VOICE INTERPRETATIONS
// =============================================================================

/** Cathedral Voice interpretation for a score range */
export interface CathedralInterpretation {
  /** Brief grounding statement */
  ground: string;
  /** Validation/acknowledgment */
  validate: string;
  /** Empowering forward look */
  empower: string;
}

/** Interpretations by domain */
export interface DomainInterpretations {
  N: CathedralInterpretation;
  E: CathedralInterpretation;
  O: CathedralInterpretation;
  A: CathedralInterpretation;
  C: CathedralInterpretation;
}

// =============================================================================
// L0-L3 FORMATTED OUTPUTS
// =============================================================================

/** L0: Postcard summary */
export interface ExplainL0 {
  level: 'L0';
  /** Single sentence summary */
  summary: string;
  /** Compatibility badge text */
  badge: string;
  /** Score as percentage */
  score: number;
  /** Compatibility level */
  compatibility: CompatibilityLevel;
}

/** L1: Guided factor breakdown */
export interface ExplainL1 {
  level: 'L1';
  /** Section title */
  title: string;
  /** Overview paragraph */
  overview: string;
  /** Factor cards (what contributed) */
  factors: {
    name: string;
    icon: string;
    score: number;
    weight: string;
    description: string;
  }[];
  /** Strengths highlighted */
  strengths: string[];
  /** Growth areas */
  growthAreas: string[];
  /** Cathedral Voice 3-beat rhythm */
  cathedralVoice: CathedralInterpretation;
}

/** L2: Full mathematical breakdown */
export interface ExplainL2 {
  level: 'L2';
  /** Formula section */
  masterFormula: {
    latex: string;
    plainText: string;
    description: string;
  };
  /** NEO math details */
  neo: NeoMathExplain;
  /** WuXing math details */
  wuxing: WuXingMathExplain;
  /** Ten Gods math details */
  tengods: TenGodsMathExplain;
  /** BaZi blend math details */
  bazi: BaziMathExplain;
  /** Final fusion math details */
  fusion: FusionMathExplain;
  /** Coefficients used */
  coefficients: {
    alpha: number;
    beta: number;
    domainWeights: Record<string, number>;
  };
}

/** L3: Researcher/debug dump */
export interface ExplainL3 {
  level: 'L3';
  /** Contract version */
  version: string;
  /** Timestamp */
  timestamp: string;
  /** Input profiles (sanitized IDs) */
  inputs: {
    profileA_id?: string;
    profileB_id?: string;
    alpha: number;
    beta: number;
    usingPostSeasonal: boolean;
  };
  /** Raw vectors */
  vectors: {
    neoA: number[];
    neoB: number[];
    wuxingA: number[];
    wuxingB: number[];
    tengods5A: number[];
    tengods5B: number[];
  };
  /** Intermediate calculations */
  intermediates: {
    cosine: number;
    euclidean: number;
    domainScores: NeoDimensionScores;
    wuxingRaw: number;
    tengodsRaw: number;
    baziRaw: number;
    modFavor: number;
    modInter: number;
    modCombined: number;
    baziAdjusted: number;
    neoContrib: number;
    baziContrib: number;
  };
  /** Final outputs */
  outputs: {
    total: number;
    level: CompatibilityLevel;
    neo: number;
    bazi: number;
    wuxing: number;
    tengods: number;
  };
  /** Data quality flags */
  dataQuality: {
    hasPostSeasonal: boolean;
    hasTenGodSummary: boolean;
    hasFavorableElements: boolean;
    hasInteractions: boolean;
    missingFields: string[];
  };
}

// =============================================================================
// MAIN EXPLAINABILITY CONTRACT
// =============================================================================

/** Complete explainability envelope */
export interface MatchExplain {
  /** Contract version */
  version: 'cathedral.explain.v1';

  /** Input metadata */
  inputs: {
    profileA_id?: string;
    profileB_id?: string;
    alpha: number;
    beta: number;
    usingPostSeasonal: boolean;
  };

  /** Output scores */
  outputs: {
    total: number;
    level: CompatibilityLevel;
    neo: number;
    bazi: number;
    wuxing: number;
    tengods: number;
    modifiers: {
      favorableElements: number;
      interactions: number;
      combined: number;
    };
  };

  /** Multi-level explanations */
  explanations: {
    L0: ExplainL0;
    L1: ExplainL1;
    L2: ExplainL2;
    L3: ExplainL3;
  };
}

// =============================================================================
// EXTENDED MATCH SCORE RESULT
// =============================================================================

/** MatchScoreResult with explainability */
export interface MatchScoreResultExplained {
  /** Total compatibility 0-100 */
  total: number;
  /** Compatibility level */
  level: CompatibilityLevel;
  /** NEO similarity 0-100 */
  neo: number;
  /** BaZi compatibility 0-100 */
  bazi: number;
  /** WuXing compatibility 0-100 */
  wuxing: number;
  /** TenGods compatibility 0-100 */
  tengods: number;
  /** Legacy explanation notes */
  why: string[];
  /** Full explainability contract */
  explain: MatchExplain;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/** Options for generating explanations */
export interface ExplainOptions {
  /** Include L0 (default true) */
  includeL0?: boolean;
  /** Include L1 (default true) */
  includeL1?: boolean;
  /** Include L2 (default false - expensive) */
  includeL2?: boolean;
  /** Include L3 (default false - debug only) */
  includeL3?: boolean;
  /** Profile A ID for tracking */
  profileA_id?: string;
  /** Profile B ID for tracking */
  profileB_id?: string;
}

/** Level-specific getter return type */
export type ExplainAtLevel<L extends ExplainLevel> =
  L extends 'L0' ? ExplainL0 :
  L extends 'L1' ? ExplainL1 :
  L extends 'L2' ? ExplainL2 :
  L extends 'L3' ? ExplainL3 :
  never;
