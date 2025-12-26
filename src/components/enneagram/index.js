/**
 * Enneagram Module Exports
 *
 * The Alchemical Rose - 9 Personality Types
 *
 * Components:
 *   - EnneagramTab: Main container for Results page
 *   - EnneagramQuestionnaire: 18-question + 6 instinct assessment
 *   - EnneagramAlchemicalRose: SVG Rose Window visualization
 *   - EnneagramTypeCard: Detailed type information display
 *   - TypeComparisonTool: Side-by-side type comparison
 *
 * Data:
 *   - ENNEAGRAM_TYPES: Type definitions and metadata
 *   - ENNEAGRAM_QUESTIONS: Assessment questions
 *   - ENNEAGRAM_CENTERS: Gut/Heart/Head center info
 *   - calculateEnneagramScores: Score calculation utility
 *
 * Priority 1 (Brother Sonnet Enhancements):
 *   - GENESIS_TYPE_NEEDS: What each type/wing needs from Luna
 *   - LUNA_APPROACH: How Luna responds to each type
 *   - FAMOUS_EXAMPLES: Historical figures for each type
 *   - TYPE_GIFTS: Your unique gift to the world
 *
 * Priority 2 (Depth Features):
 *   - INSTINCTUAL_VARIANTS: sp/sx/so definitions
 *   - INSTINCT_QUESTIONS: 6 questions for variant
 *   - SUBTYPE_DESCRIPTIONS: 27 subtypes (9 types × 3 variants)
 *   - calculateInstinctualVariant: Variant calculation
 *   - DEVELOPMENT_LEVELS: Healthy/Average/Unhealthy for each type
 *   - TYPE_RELATIONSHIPS: 81 type combinations
 *   - CAREER_FITS: Best careers for each type
 *
 * Priority 3 (Advanced Features):
 *   - SOUL_QUESTIONS_BY_TYPE: Deep follow-up questions (3 per type)
 *   - TYPE_COMPARISON_DIFFERENCES: 36 type pair comparisons
 *   - TypeComparisonTool: Interactive comparison component
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * Enhanced by: Brother Sonnet
 * December 25-26, 2024
 */

// Main tab component
export { default as EnneagramTab } from './EnneagramTab';

// Individual components
export { default as EnneagramQuestionnaire } from './EnneagramQuestionnaire';
export { default as EnneagramAlchemicalRose } from './EnneagramAlchemicalRose';
export { default as EnneagramTypeCard } from './EnneagramTypeCard';
export { default as TypeComparisonTool } from './TypeComparisonTool';

// Data and utilities
export {
  // Core data
  ENNEAGRAM_TYPES,
  ENNEAGRAM_QUESTIONS,
  ENNEAGRAM_CENTERS,
  PHI,

  // Calculation utilities
  calculateEnneagramScores,
  scoreToPercentage,
  getWingNotation,
  getTritypeNotation,

  // Priority 1: Brother Sonnet Enhancements
  GENESIS_TYPE_NEEDS,
  LUNA_APPROACH,
  FAMOUS_EXAMPLES,
  TYPE_GIFTS,

  // Priority 2: Instinctual Variants
  INSTINCTUAL_VARIANTS,
  INSTINCT_QUESTIONS,
  SUBTYPE_DESCRIPTIONS,
  calculateInstinctualVariant,

  // Priority 2: Levels of Development
  DEVELOPMENT_LEVELS,

  // Priority 2: Relationships & Careers
  TYPE_RELATIONSHIPS,
  CAREER_FITS,

  // Priority 3: Soul Questions & Comparison
  SOUL_QUESTIONS_BY_TYPE,
  TYPE_COMPARISON_DIFFERENCES
} from './enneagramData';
