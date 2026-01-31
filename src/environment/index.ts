/**
 * ============================================================================
 * ENVIRONMENT MODULE - BARREL EXPORTS (环境模块)
 * ============================================================================
 *
 * Central export file for the Environmental Layer.
 *
 * Three Classical Systems:
 * 1. Feng Shui (风水) - Directional energies
 * 2. Qi Men Dun Jia (奇门遁甲) - Strategic Qi flow
 * 3. Date Selection (择日) - Activity suitability
 *
 * Combined with BaZi Timing:
 *   Time (BaZi) + Space (Feng Shui) + Strategic Qi (Qi Men) = Complete Stack
 *
 * Usage:
 *   import {
 *     computeEnvironmentalSnapshot,
 *     computeFengShuiDirections,
 *     computeQiMenChart,
 *     computeDateSelection,
 *     getMomentGuidance
 *   } from '@/environment';
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Compass & Direction
  CompassDirection,
  DirectionInfo,
  ElementName,
  DirectionalEnergyType,
  DirectionalEnergy,

  // Feng Shui
  FengShuiDirections,

  // Qi Men Dun Jia
  PalaceNumber,
  QiMenDoor,
  QiMenStar,
  QiMenDeity,
  QiMenStem,
  QiMenFormation,
  QiMenRating,
  QiMenPalace,
  QiMenChart,

  // Date Selection
  TwelveOfficer,
  DongGongRating,
  ActivityCategory,
  HourSuitability,
  DateSelection,

  // Combined
  EnvironmentalTier,
  EnvironmentalSnapshot,
  EnvironmentalSubject,
  ComputeEnvironmentOptions,
  EnvironmentalResult
} from './environmentTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  DIRECTION_INFO,
  TWELVE_OFFICERS_INFO,
  ACTIVITY_LABELS,
  QIMEN_DOOR_INFO,
  ENVIRONMENTAL_TIER_THRESHOLDS,
  ENVIRONMENTAL_TIER_COLORS
} from './environmentTypes';

// ============================================================================
// FENG SHUI ENGINE
// ============================================================================

export {
  computeFengShuiDirections,
  scoreFengShuiAlignment
} from './fengShuiEngine';

// ============================================================================
// QI MEN DUN JIA ENGINE
// ============================================================================

export {
  computeQiMenChart,
  scoreQiMenAlignment
} from './qiMenEngine';

// ============================================================================
// DATE SELECTION ENGINE
// ============================================================================

export {
  computeDateSelection,
  scoreDateSelection
} from './dateSelectionEngine';

// ============================================================================
// MAIN ENVIRONMENTAL ENGINE
// ============================================================================

export {
  computeEnvironmentalSnapshot
} from './environmentEngine';

// ============================================================================
// UTILITIES
// ============================================================================

export {
  // Combined scoring
  computeCombinedScore,

  // Guidance
  getMomentGuidance,
  findBestWindowsWithEnvironment,

  // Activity optimization
  findBestTimeForActivity,

  // Dashboard integration
  getDashboardEnvironmentalSummary,

  // Decision engine integration
  getEnvironmentalDecisionFactor
} from './environmentUtils';

export type {
  CombinedMetaphysicsScore,
  MomentGuidance,
  ActivityRecommendation,
  DashboardEnvironmentalSummary,
  EnvironmentalDecisionFactor
} from './environmentUtils';

