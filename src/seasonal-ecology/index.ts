/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * Module Entry Point
 *
 * Single import location for entire module:
 * import { useSeasonalPersonality, toFullZodiacRingLayout } from '@/seasonal-ecology';
 */

// ============================================================================
// TYPES
// ============================================================================

export * from './types/seasonalEcology';
export * from './types/wheelModes';

// ============================================================================
// SCHEMAS
// ============================================================================

export * from './schemas/seasonalEcologySchemas';

// ============================================================================
// FACTORIES
// ============================================================================

export * from './factories/seasonalEcologyFactories';

// ============================================================================
// DATA
// ============================================================================

export * from './data/seasonalEcologyData';
export * from './data/allZodiacSigns';
export * from './data/scienceContent';

// ============================================================================
// PARSERS
// ============================================================================

export * from './parsers/seasonalEcologyParsers';

// ============================================================================
// MANAGERS
// ============================================================================

export * from './managers/LayerManager';

// ============================================================================
// CONTEXTS
// ============================================================================

export * from './contexts/WheelModeContext';

// ============================================================================
// HOOKS
// ============================================================================

export * from './hooks/useSeasonalEcology';

// ============================================================================
// TRANSFORMERS
// ============================================================================

export * from './transformers/seasonalEcologyTransformers';

// ============================================================================
// COMPONENTS
// ============================================================================

export * from './components';

// ============================================================================
// DEMO PAGE
// ============================================================================

export { SeasonalEcologyDemo } from './routes/SeasonalEcologyDemo';

// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================

// Most commonly used functions
export {
  getSignProfile,
  getSignByDegree,
  getAllSignsOrdered
} from './data/allZodiacSigns';

export {
  toFullZodiacRingLayout,
  toRingLayoutWithHighlight,
  degreeToAngle
} from './transformers/seasonalEcologyTransformers';

export {
  useSeasonalPersonality,
  useSignProfile,
  useSignByDegree
} from './hooks/useSeasonalEcology';

export {
  buildSignProfile,
  generateAttachment,
  seasonPresets,
  elementPresets,
  modalityPresets
} from './factories/seasonalEcologyFactories';

// BATCH 5: Wheel modes and layers
export {
  WheelModeProvider,
  useWheelMode
} from './contexts/WheelModeContext';

export { LayerManager } from './managers/LayerManager';

export {
  EnhancedSeasonRings,
  WheelModeControls
} from './components';
