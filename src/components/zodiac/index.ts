/**
 * Zodiac Components Index
 * =======================
 *
 * GENESIS AstroProfile - January 2026
 */

// Core components
export { ZodiacBlendWheel } from './ZodiacBlendWheel';
export { ZodiacBlendWheelDemo } from './ZodiacBlendWheelDemo';
export { ZodiacExplanationPanel, ZodiacExplanationPanelCompact } from './ZodiacExplanationPanel';
export { ZodiacLearningWheel, ZodiacLearningWheelCompact } from './ZodiacLearningWheel';
export { CompatibilityPanel, CompatibilityPanelCompact } from './CompatibilityPanel';
export { ZodiacEducationFlaps } from './ZodiacEducationFlaps';
export { CuspSliderInteractive } from './CuspSliderInteractive';
export { CompatibilityCalendarHeatmap, CompatibilityCalendarCompact } from './CompatibilityCalendarHeatmap';

// Re-export data utilities for convenience
export {
  generateYearBlend,
  getBlendForDate,
  getCuspDays,
  getSignColor,
  getBlendColor,
  // Elemental vector system
  getElementVector,
  getDominantElement,
  getActiveElements,
  SIGN_RANGES,
  SIGN_GLYPHS,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
  ELEMENT_EMOJIS,
  CUSP_CURVE,
  CUSP_DAYS,
} from '../../data/zodiacBlendData';

export type {
  ZodiacSign,
  SignRange,
  DayBlend,
  ElementName,
  ElementVector,
} from '../../data/zodiacBlendData';

// Re-export compatibility system
export {
  computeCompatibility,
  computeDayCompatibility,
  generateWheelHighlights,
  calculateGrade,
  calculateScore,
  createProfileFromDayBlend,
  getDominantElement as getCompatibilityDominantElement,
  getSecondaryElement,
  findBestMatches,
  countGradeDistribution,
  getCompatibilitySummary,
} from '../../data/compatibilityEngine';

export {
  getNarrativeForElements,
  getNarrativesByGrade,
  getNarrativesForElement,
  getGradeForElements,
  ELEMENT_PAIR_NARRATIVES,
  GRADE_EXPLANATIONS,
} from '../../data/elementalNarratives';

export {
  GRADE_COLORS,
  ELEMENT_EMOJI,
} from '../../data/compatibilityTypes';

export type {
  Element,
  ElementVector as CompatibilityElementVector,
  PersonProfile,
  CompatibilityGrade,
  CompatibilityResult,
  CompatibilityHighlight,
  CompatibilityMode,
  ElementPairNarrative,
} from '../../data/compatibilityTypes';

// Re-export explanation engine
export {
  getExplanationForDayBlend,
  getPureSignExplanation,
  getCuspExplanation,
  getExplanationsForSign,
  getExplanationStats,
  exportExplanationsAsJSON,
  getMythicBoundary,
  SIGN_META,
  ALL_EXPLANATIONS,
  MYTHIC_BOUNDARIES,
  // Elemental meanings
  ELEMENT_MEANING,
  ELEMENT_INTERPRETATION,
} from '../../data/zodiacExplanationEngine';

export type {
  ExplanationType,
  SignMeta,
  DayExplanation,
  BoundaryMeta,
} from '../../data/zodiacExplanationEngine';
