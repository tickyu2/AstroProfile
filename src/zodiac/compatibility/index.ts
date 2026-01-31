/**
 * Tropical Compatibility Scoring Engine
 *
 * A lens-based compatibility system using the 9-cell synastry matrix.
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 *
 * Key Principles (Brother Copilot):
 * - Compatibility is not about comfort — it's about functional complementarity
 * - The best zodiac compatibility is not who feels easiest —
 *   it's who makes your life function better across seasons
 * - Trines feel good. Oppositions build civilizations.
 *
 * Theoretical Compatibility Ranking:
 * 1. Conscious Opposition (180°) - Cathedral pairs
 * 2. Cardinal-Mutable Complementarity - Initiator + Adapter
 * 3. Cross-Element Functional Pairs - Vision + Manifestation
 * 4. Mutable-Mutable (Different Elements) - Adaptive
 * 5. Cardinal-Fixed (Different Elements) - Execution
 * 6. Trines (Same Element) - Comfort
 * 7. Fixed-Fixed (Same Element) - Durability
 *
 * GENESIS AstroProfile - January 2025
 */

// =============================================================================
// CORE TYPES
// =============================================================================

export type {
  ZodiacSign,
  Element,
  Modality,
  Season,
  AspectType,
  TriadKey,
  PersonTriad,
  RelationshipLens,
  SynastryCellKey,
  RelationType,
  SeasonRelationType,
  SynastryCell,
  SynastryMatrix,
  CompatibilityLabel,
  CompatibilityBreakdown,
  SeasonalLeadership,
  CompatibilityGuidance,
  CompatibilityReport,
  CompatibilityRankType,
  CompatibilityRankInfo,
} from './types';

// =============================================================================
// MAIN API
// =============================================================================

export { buildCompatibilityReport } from './report';
export { buildSynastryMatrix } from './buildMatrix';
export { buildSynastryCell } from './buildCell';

// =============================================================================
// REPORT UTILITIES
// =============================================================================

export {
  compareAllLenses,
  getBestLens,
  getLensSummary,
  getLabelEmoji,
  getLabelColor,
} from './report';

// =============================================================================
// MATRIX UTILITIES
// =============================================================================

export {
  getAllCellKeys,
  getRowCells,
  getColumnCells,
  getDiagonalCells,
  getCrossCells,
  getMatrixAverageScore,
  getStrongestCell,
  getWeakestCell,
  getCellsSortedByScore,
  countCellsByScoreRange,
  getCellsByAspect,
  getCellsWithSameElement,
  getOppositionCells,
} from './buildMatrix';

// =============================================================================
// CELL UTILITIES
// =============================================================================

export {
  getCellInsight,
  getCellStrengthNote,
  getCellChallengeNote,
} from './buildCell';

// =============================================================================
// LENS CONFIGURATION
// =============================================================================

export {
  LENSES,
  getLensTypes,
  getLensDisplayName,
  getLensEmoji,
  type LensConfig,
} from './lenses';

// =============================================================================
// SCORING PRIMITIVES (for advanced users)
// =============================================================================

export {
  elementRelation,
  elementScore,
  modalityRelation,
  modalityScore,
  seasonRelation,
  seasonScore,
  baseAspectScore,
  identifyCompatibilityPattern,
  getPatternRankBonus,
  type CompatibilityPatternType,
} from './scoringPrimitives';

// =============================================================================
// ASPECT UTILITIES
// =============================================================================

export {
  resolveAspect,
  getAspectNature,
  getAspectCompatibilityNote,
  getAspectSymbol,
  ASPECT_DEGREES,
  ASPECT_STEPS,
  type AspectResult,
  type AspectNature,
} from './aspects';

// =============================================================================
// SIGN METADATA
// =============================================================================

export {
  getElement,
  getModality,
  getSeason,
  getSignIndex,
  getSignSteps,
  getModalityPairType,
  ELEMENT_SUPPORT_PAIRS,
  ELEMENT_FRICTION_PAIRS,
  CROSS_ELEMENT_FUNCTIONAL,
  OPPOSITE_SEASONS,
  ADJACENT_SEASONS,
  type ModalityPairType,
} from './signMeta';

// =============================================================================
// QUICK START USAGE EXAMPLE
// =============================================================================

/**
 * Usage Example:
 *
 * ```typescript
 * import { buildCompatibilityReport, compareAllLenses } from '../zodiac/compatibility';
 *
 * // Define two people by their Sun/Moon/Rising
 * const personA = { Sun: 'Sagittarius', Moon: 'Aries', Rising: 'Virgo' };
 * const personB = { Sun: 'Pisces', Moon: 'Leo', Rising: 'Gemini' };
 *
 * // Get romantic compatibility report
 * const romantic = buildCompatibilityReport(personA, personB, 'romantic');
 * console.log(romantic.totalScore100);  // e.g., 72
 * console.log(romantic.label);          // 'Strong'
 * console.log(romantic.strengths);      // ['Moon-Moon', 'Sun-Rising', ...]
 *
 * // Compare across all lenses
 * const all = compareAllLenses(personA, personB);
 * console.log(all.romantic.totalScore100);
 * console.log(all.coworker.totalScore100);
 *
 * // Get seasonal leadership rotation
 * console.log(romantic.guidance.leadInSeason);
 * // { Spring: 'A', Summer: 'Share', Autumn: 'B', Winter: 'Share' }
 * ```
 */

// =============================================================================
// CUSP-AWARE SCORING (φ-CURVE)
// =============================================================================

/**
 * The cusp-aware system uses the golden ratio (φ ≈ 1.618) to create
 * natural-feeling transitions between signs. Instead of hard boundaries,
 * someone born April 23 is "75% Taurus, 25% Aries".
 *
 * The φ-curve produces:
 *   Day 1: 13% → Day 2: 37% → Day 3: 58%
 *   Day 4: 75% → Day 5: 89% → Day 6: 98%
 *
 * This gives "seasonality its true flavor."
 */

// Blend Curve (φ-curve core)
export {
  PHI,
  CUSP_WINDOW_DAYS,
  PHI_CURVE_VALUES,
  phiBlend,
  phiBlendInverse,
  generateBlendTable,
  getBlendPercentages,
  compareBlendCurves,
  PHI_CURVE_EXPLANATION,
  type BlendTableRow,
} from './blendCurve';

// Sign Blend From Date
export {
  getSignBlendFromDate,
  createCuspAwareTriad,
  formatSignBlend,
  getPrimarySign,
  isCuspBlend,
  getCuspDisplayInfo,
  SIGN_DATE_RANGES,
  type SignBlend,
  type SignDateRange,
  type CuspAwareTriad,
} from './signBlendFromDate';

// Seasonal Weight & Cusp Names
export {
  seasonWeight,
  getSeasonWeightExplanation,
  getCuspDisplayName,
  getCuspDescription,
  getCuspNameFromSigns,
  SEASON_WEIGHTS,
  CUSP_NAMES,
  type SeasonWeightInfo,
} from './seasonalWeight';

// Cusp Blend Tables
export {
  generateCuspBlendTable,
  getAllCuspBlendTables,
  getCuspBlendForDay,
  formatCuspBlendTable,
  type CuspBlendRow,
  type CuspBlendTable,
} from './cuspBlendTables';

// Weighted Cell Builder (Cusp-Aware Cells)
export {
  buildCuspAwareSynastryCell,
  calculateWeightedScore,
  analyzeCuspInfluence,
  formatCuspAwareCell,
  getCuspCellSummary,
  getSubCellsByContribution,
  getMostHarmoniousSubCell,
  getMostChallengingSubCell,
  type WeightedSubCell,
  type CuspAwareSynastryCell,
  type CuspInfluenceAnalysis,
} from './buildWeightedCell';

// Cusp-Aware Compatibility Report
export {
  buildCuspAwareCompatibilityReport,
  buildCuspAwareMatrix,
  compareCuspAwareCompatibilityAcrossLenses,
  getBestLensForCuspAwareCompatibility,
  type CuspAwarePersonInput,
  type CuspAwarePerson,
  type CuspAwareMatrix,
  type CuspAwareCompatibilityReport,
  type LensComparisonResult,
} from './cuspAwareReport';

// Cusp Narrative Generator
export {
  generateCuspPersonalityNarrative,
  getCuspGiftSummary,
  getCuspChallengeSummary,
  generateCuspCompatibilityNarrative,
  generateCellCuspNarrative,
  generateCuspTimingNarrative,
  generateElementBlendNarrative,
  generateModalityBlendNarrative,
  generateFullCuspProfileNarrative,
  type CuspProfileNarrative,
} from './cuspNarrative';

// Cusp Explanation for Aspects
export {
  explainCuspEffectOnAspect,
  generateCuspCompatibilitySummary,
  generateCuspCellTags,
} from './cuspExplanation';

// =============================================================================
// CUSP-AWARE QUICK START EXAMPLE
// =============================================================================

/**
 * Cusp-Aware Usage Example:
 *
 * ```typescript
 * import {
 *   buildCuspAwareCompatibilityReport,
 *   getSignBlendFromDate,
 *   generateCuspPersonalityNarrative,
 * } from '../zodiac/compatibility';
 *
 * // Person A born April 23 (Taurus cusp)
 * const inputA = {
 *   name: 'Alex',
 *   sunDate: new Date('1990-04-23'),
 *   moonSign: 'Cancer',
 *   risingSign: 'Scorpio',
 * };
 *
 * // Person B born November 20 (Scorpio-Sagittarius cusp)
 * const inputB = {
 *   name: 'Jordan',
 *   sunDate: new Date('1988-11-20'),
 *   moonSign: 'Aquarius',
 *   risingSign: 'Leo',
 * };
 *
 * // Get cusp-aware compatibility
 * const report = buildCuspAwareCompatibilityReport(inputA, inputB, 'romantic');
 *
 * console.log(report.weightedScore);        // e.g., 68
 * console.log(report.compatibilityGrade);   // e.g., 'B+'
 * console.log(report.cuspAnalysis);         // Cusp interaction insights
 * console.log(report.cuspBonuses);          // Where cusps helped
 *
 * // Get cusp personality narrative
 * const sunBlend = getSignBlendFromDate(new Date('1990-04-23'));
 * const narrative = generateCuspPersonalityNarrative(sunBlend, 'Alex');
 * console.log(narrative);
 * // "Alex is born on the Cusp of Power (Aries 25%, Taurus 75%)..."
 * ```
 */
