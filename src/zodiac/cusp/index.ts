/**
 * Cusp Module - ρ-Curve Sign Blending
 *
 * This module provides cusp-aware sign calculations using the
 * plastic number (ρ) decay curve for natural transitions.
 *
 * GENESIS AstroProfile - January 2026
 */

// Core ρ-curve utilities
export {
  PHI,
  PLASTIC,
  CUSP_EXPONENT,
  DEFAULT_PHI,
  PHI_CURVE_VALUES,
  phiBlendFraction,
  phiBlendFractionWeighted,
  phiBlendInverse,
  computeCuspBlend,
  normalizeBlend,
  formatBlendPercent,
  isCuspBlend,
  getPrimaryFromBlend,
  formatBlend,
  generateBlendTable,
  PHI_CURVE_EXPLANATION,
  type SignBlend,
  type PhiCurveConfig,
  type BlendTableRow,
} from './phiCurve';

// Season weight amplification (equinox/solstice)
export {
  seasonAmplifier,
  getSeasonAmplifierExplanation,
  classifyCusp,
  getCuspTypeLabel,
  isCardinalSign,
  SEASON_OPENERS,
  type CuspType,
} from './seasonWeight';

// Cusp narrative generation
export {
  generateCuspNarrative,
  generateExtendedCuspNarrative,
  generateCuspCompatibilityNarrative,
  type CuspNarrative,
} from './cuspNarrative';

// Sun blend from date
export {
  getSunBlendFromDate,
  getCuspInfo,
  getDayOfYear,
  getSignWindowForDay,
  getPreviousSign,
  getNextSign,
  SIGN_WINDOWS,
  ZODIAC_ORDER,
  type SunBlendResult,
} from './getSunBlendFromDate';

// Longitude-based blend (Moon/Rising)
export {
  getBlendFromLongitude,
  signFromLongitude,
  signIndexFromLongitude,
  degreesIntoSign,
  distanceToNearestBoundary,
  neighborSign,
  phiSecondaryWeight,
  normalizeDeg360,
  DEFAULT_BLEND_CONFIG,
  type BlendConfig,
  type BoundarySide,
  type BoundaryInfo,
} from './getBlendFromLongitude';

// 365-day dataset generator
export {
  generateDailySunBlendDataset,
  generateYearlyDataset,
  getBlendFromDataset,
  getCuspDays,
  getDaysForSign,
  getDatasetStats,
  exportToJSON,
  generateAndExport,
  type DayBlendEntry,
  type YearlyDataset,
} from './generateDataset';

// Cusp day stream hook (breathing animation)
export {
  useCuspDayStream,
  getBlendAtOffset,
  interpolateBlends,
  formatDayOffset,
  type CuspDayStream,
} from './useCuspDayStream';

// Seasonal breathing hook
export {
  useSeasonalBreathing,
  getBreathOpacity,
  getBreathScale,
  type BreathPhase,
  type BreathingState,
  type SeasonalBreathingConfig,
  type SeasonalBreathingReturn,
} from './useSeasonalBreathing';

// Wheel rotation hook
export {
  useWheelRotation,
  getSignRotation,
  getRotationToCenter,
  getCuspBlendRotation,
  easeOutCubic,
  breathEasing,
  DEGREES_PER_DAY,
  DEGREES_PER_SIGN,
  type WheelRotationState,
  type WheelRotationConfig,
} from './useWheelRotation';

// Animated score hook
export {
  useAnimatedScore,
  useAnimatedMultiScore,
  formatScoreWithDirection,
  getScoreDirectionClass,
  getScoreColor,
  easings,
  type AnimatedScoreState,
  type AnimatedScoreConfig,
  type MultiScoreEntry,
  type AnimatedMultiScoreState,
} from './useAnimatedScore';

// Year breathing hook (365-day cycle)
export {
  useYearBreathing,
  getSeasonName,
  formatDayOfYear,
  getTimeRemaining,
  getSpeedLabel,
  YEAR_SPEEDS,
  type YearSpeedKey,
  type YearBreathingConfig,
  type YearBreathingState,
  type YearBreathingControls,
  type YearBreathingReturn,
} from './useYearBreathing';

// Sign vector metadata & cusp blending engine
export {
  blendSignMetadata,
  blendFromCuspResult,
  getPureSignMetadata,
  buildCuspExplanation,
  buildCuspLabel,
  SIGN_METADATA,
  ELEMENT_LABELS,
  MODALITY_LABELS,
  POLARITY_LABELS,
  ELEMENT_INDEX,
  MODALITY_INDEX,
  ELEMENT_POLARITY,
  type SignMetadata,
  type BlendedSignMetadata,
  type Polarity,
  type ElementVector,
  type ModalityVector,
  type PolarityVector,
} from './signVectors';

// Year wheel rotation hook
export {
  useYearWheelRotation,
  getSignName,
  getSeasonFromQuadrant,
  getRotationForSign,
  getSignStartDay,
  easeOutRotation,
  getYearRotationKeyframes,
  getWheelBreathingStyle,
  DEGREES_PER_DAY_ANNUAL,
  type YearWheelRotationState,
  type YearWheelRotationConfig,
} from './useYearWheelRotation';

// Sign context resolution (seasonal phase + cusp neighbor)
export {
  resolveSignContext,
  resolveSignContextFromLongitude,
  getPhaseLabel,
  getPhaseModality,
  getSeasonalMoment,
  SEASON_TABLE,
  CUSP_WINDOW,
  SEASON_FLIP,
  type SignContext,
  type SeasonPhase,
  type Hemisphere,
} from './resolveSignContext';
