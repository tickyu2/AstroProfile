/**
 * ============================================================================
 * TIMING MODULE - BARREL EXPORTS (时序模块)
 * ============================================================================
 *
 * Central export file for the micro-timing system.
 *
 * The finest temporal layer in the BaZi timing hierarchy:
 *   Luck Pillars → Years → Months → Days → Hours → Micro-Segments
 *
 * Usage:
 *   import {
 *     computeMicroTimingDay,
 *     findBestWindow,
 *     getMicroRecommendation
 *   } from '@/timing';
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Resolution & Context
  MicroResolution,
  MicroContext,
  MicroQualityTier,

  // Element Types
  ElementName,
  MicroPillar,

  // Segment Types
  MicroSegment,
  MicroTimingDay,
  MicroDaySummary,
  MicroTimeWindow,

  // Subject & Options
  MicroTimingSubject,
  ComputeMicroTimingOptions,
  MicroTimingResult,

  // Utilities
  MicroRecommendation,
  MicroTimingWeek
} from './microTimingTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  SEGMENTS_PER_DAY,
  MINUTES_PER_SEGMENT,
  TIER_THRESHOLDS,
  TIER_COLORS,
  CONTEXT_LABELS,
  ELEMENT_CHINESE
} from './microTimingTypes';

// ============================================================================
// PILLAR DERIVATION
// ============================================================================

export {
  // Constants
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  ELEMENT_CYCLE,
  ELEMENT_PRODUCES,
  ELEMENT_CONTROLS,

  // Hour/Day Pillar
  getBranchIndexForHour,
  getHourStemIndex,
  getDayStemIndex,
  getDayBranchIndex,
  getDayPillar,

  // Micro Pillar
  deriveMicroPillar,
  getQuarterPosition,
  getQuarterElementModifier,

  // Element Relationships
  getElementRelation,
  calculateElementSupport,
  calculateElementChallenge
} from './microPillarDerivation';

export type {
  QuarterPosition,
  ElementRelation
} from './microPillarDerivation';

// ============================================================================
// SCORING
// ============================================================================

export {
  // Core Scoring
  scoreUsefulGodAlignment,
  scoreDayMasterSupport,
  scoreElementBalance,
  scoreAvoidElementPenalty,

  // Composite Scoring
  scoreMicroSegment,
  getTierFromScore,

  // Narrative
  generateSegmentNarrative
} from './microTimingScoring';

export type {
  MicroSegmentScores
} from './microTimingScoring';

// ============================================================================
// MAIN ENGINE
// ============================================================================

export {
  // Primary Function
  computeMicroTimingDay,

  // Internals (for advanced use)
  computeSingleSegment,
  generateDaySummary,
  findPeakWindows,
  findCautionWindows
} from './microTimingEngine';

// ============================================================================
// UTILITIES
// ============================================================================

export {
  // Best Window Finders
  findBestWindow,
  findWindowsAboveThreshold,
  getMicroRecommendation,

  // Multi-Day Analysis
  computeMicroTimingWeek,
  findBestDayInRange,

  // Dashboard Integration
  getDashboardMicroTimingHighlights,

  // Decision Engine Integration
  getMicroTimingForDecision
} from './microTimingUtils';

