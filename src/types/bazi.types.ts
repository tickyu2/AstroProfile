/**
 * bazi.types.ts
 *
 * TypeScript interfaces for BaZi and NEO compatibility scoring
 */

// =============================================================================
// FIVE ELEMENTS (WuXing)
// =============================================================================

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export interface ElementPercentages {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
}

// =============================================================================
// TEN GODS (十神)
// =============================================================================

export type TenGod =
  | 'Companion'
  | 'Rob Wealth'
  | 'Direct Resource'
  | 'Indirect Resource'
  | 'Direct Wealth'
  | 'Indirect Wealth'
  | 'Direct Officer'
  | 'Seven Killings'
  | 'Eating God'
  | 'Hurting Officer';

export type TenGodGroup = 'Companion' | 'Output' | 'Wealth' | 'Power' | 'Resource';

export type TenGodSummary = Partial<Record<TenGod, number>>;

// =============================================================================
// DAY MASTER
// =============================================================================

export interface DayMaster {
  stem: string;
  element: Element;
  polarity?: 'Yang' | 'Yin';
}

export interface DayMasterRelationships {
  Companion: Element;
  Output: Element;
  Wealth: Element;
  Power: Element;
  Resource: Element;
}

// =============================================================================
// FAVORABLE ELEMENTS
// =============================================================================

export interface FavorableElements {
  primary: Element;
  secondary?: Element;
  avoid?: Element[];
}

// =============================================================================
// BAZI INTERACTIONS
// =============================================================================

export interface BaziInteraction {
  type: string;
  branches?: string[];
  strength?: number;
  severity?: number;
  description?: string;
}

// =============================================================================
// SEASONAL STRENGTH
// =============================================================================

export interface SeasonalStrength {
  percentages: ElementPercentages;
  dominant: Element;
  weakest: Element;
  balanceStatus?: string;
}

// =============================================================================
// FULL BAZI DATA
// =============================================================================

export interface BaziData {
  dayMaster: DayMaster;
  seasonalStrength?: SeasonalStrength;
  elements?: {
    percentages: ElementPercentages;
    dominant?: Element;
  };
  tenGodSummary?: TenGodSummary;
  favorableElements?: FavorableElements;
  interactions?: BaziInteraction[];
  fourPillars?: unknown;
}

// =============================================================================
// NEO PI-R (30 FACETS)
// =============================================================================

/** 30-dimensional personality vector, values 0-1 */
export type Neo30Facets = [
  // N1-N6: Neuroticism
  number, number, number, number, number, number,
  // E1-E6: Extraversion
  number, number, number, number, number, number,
  // O1-O6: Openness
  number, number, number, number, number, number,
  // A1-A6: Agreeableness
  number, number, number, number, number, number,
  // C1-C6: Conscientiousness
  number, number, number, number, number, number
];

export type NeoDomain = 'N' | 'E' | 'O' | 'A' | 'C';

export interface NeoDimensionScores {
  N: number;
  E: number;
  O: number;
  A: number;
  C: number;
}

export interface NeoSimilarityResult {
  score: number;
  cosine: number;
  euclidean: number;
  dimensionScores: NeoDimensionScores;
}

// =============================================================================
// PROFILE (USER DATA)
// =============================================================================

export interface Profile {
  neo30Facets: Neo30Facets | number[];
  bazi?: BaziData;
  name?: string;
  id?: string;
}

// =============================================================================
// MATCH SCORE OPTIONS & RESULTS
// =============================================================================

export interface MatchScoreOptions {
  /** BaZi weight vs NEO (default 0.25) */
  alpha?: number;
  /** TenGods weight within BaZi (default 0.30) */
  beta?: number;
}

export interface TenGodsCompatibilityOptions {
  /** Day Master strength for profile A (0-1 scale) */
  dmStrengthA?: number;
  /** Day Master strength for profile B (0-1 scale) */
  dmStrengthB?: number;
}

export type CompatibilityLevel =
  | 'Exceptional'
  | 'Strong'
  | 'Moderate'
  | 'Challenging'
  | 'Difficult';

export interface MatchScoreDebug {
  alpha: number;
  beta: number;
  neo_details: NeoSimilarityResult;
  bazi_raw: number;
  bazi_adjusted: number;
  modifiers: {
    favorableElements: number;
    interactions: number;
    combined: number;
  };
}

export interface MatchScoreResult {
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
  /** Debug info for auditing */
  debug: MatchScoreDebug;
  /** Explanation notes */
  why: string[];
}

export interface QuickBaziMatchResult {
  total: number;
  level: CompatibilityLevel;
  bazi: number;
  wuxing: number;
  tengods: number;
}

// =============================================================================
// HYBRID COMPATIBILITY
// =============================================================================

export interface HybridCompatibilityParams {
  neoScore: number;
  baziA: BaziData;
  baziB: BaziData;
  alpha?: number;
  beta?: number;
}

export interface HybridCompatibilityResult {
  total: number;
  neo: number;
  bazi: number;
  wuxing: number;
  tenGods: number;
  alpha: number;
  beta: number;
}

export interface BaziOverlayResult {
  score: number;
  parts: {
    wuxing: number;
    tenGods: number;
    beta: number;
  };
}
