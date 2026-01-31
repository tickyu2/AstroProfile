/**
 * Academy Module - Educational Components
 *
 * Khan Academy-style learning experiences for astrological concepts.
 *
 * GENESIS AstroProfile - January 2026
 */

// Seasonality Guidance Engine
export {
  buildSeasonalityReport,
  getCurrentSeasonGuidance,
  getSignInSlotGuidance,
  SEASONAL_CALENDAR,
  type SeasonalityReport,
  type SeasonalGuidanceSection,
  type AspectGeometry,
  type SignKey,
  type Season,
  type SeasonPhase,
  type Element,
  type Modality,
  type SeasonalSlot,
  type AngleKey,
} from './seasonalityGuidance';

// UI Components
export { SeasonalityLesson } from './components/SeasonalityLesson';
