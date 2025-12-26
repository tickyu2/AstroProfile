/**
 * Enneagram Module Exports
 *
 * The Alchemical Rose - 9 Personality Types
 *
 * Components:
 *   - EnneagramTab: Main container for Results page
 *   - EnneagramQuestionnaire: 18-question assessment
 *   - EnneagramAlchemicalRose: SVG Rose Window visualization
 *   - EnneagramTypeCard: Detailed type information display
 *
 * Data:
 *   - ENNEAGRAM_TYPES: Type definitions and metadata
 *   - ENNEAGRAM_QUESTIONS: Assessment questions
 *   - ENNEAGRAM_CENTERS: Gut/Heart/Head center info
 *   - calculateEnneagramScores: Score calculation utility
 *
 * NEW (Brother Sonnet Enhancements):
 *   - GENESIS_TYPE_NEEDS: What each type/wing needs from Luna
 *   - LUNA_APPROACH: How Luna responds to each type
 *   - FAMOUS_EXAMPLES: Historical figures for each type
 *   - TYPE_GIFTS: Your unique gift to the world
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

  // NEW: Brother Sonnet Enhancements
  GENESIS_TYPE_NEEDS,
  LUNA_APPROACH,
  FAMOUS_EXAMPLES,
  TYPE_GIFTS
} from './enneagramData';
