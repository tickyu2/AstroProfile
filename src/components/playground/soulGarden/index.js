/**
 * Soul Garden GENESIS Module
 *
 * Sacred geometry components for the Rose Window visualization.
 *
 * Components:
 *   - RoseWindow: SVG rose with φ-based petals
 *   - RoseNarrationBlock: Poetic narration display
 *
 * Utilities:
 *   - narrateRoseWindow: Generate narration lines
 *   - summarizeRoseWindow: Single-line summary
 *   - getHouseEmotion: Emotion for specific house
 *
 * Theme:
 *   - PHI, radii, colors, element mappings
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

// Main component
export { default as RoseWindow } from './RoseWindow';

// Narration component
export { default as RoseNarrationBlock } from './RoseNarrationBlock';

// Rose narration (original astrology)
export {
  narrateRoseWindow,
  summarizeRoseWindow,
  getHouseEmotion
} from './roseNarration';

// Enneagram narration (stained glass alchemy)
export {
  narrateEnneagramRose,
  summarizeEnneagramRose,
  getEnneagramTypeTheme,
  getAllEnneagramThemes
} from './roseNarration';

// Rising sign narration (global voice)
export {
  narrateRising,
  getAvailableRisingSigns,
  hasRisingVoice
} from './risingNarration';

// House narration (local voice)
export {
  narrateHouses,
  getHouseDeepPoetry,
  getHouseTheme,
  describeHouseDomain
} from './houseNarration';

// Retrograde narration (deep whisper)
export {
  narrateRetrogrades,
  getRetrogradeMessage,
  getRetrogradeHousePoetry,
  countRetrogrades,
  getRetrogradePlanets,
  isPlanetRetrograde,
  summarizeRetrogrades
} from './retrogradeNarration';

// Unified timeline narrator
export {
  narrateSlice,
  narrateBrief,
  narrateHouseDeep,
  canNarrate,
  narrateSilence,
  narrateTransition,
  narrateOneLine
} from './timelineNarrator';

// Direct planet narration (forward song)
export {
  narrateDirectPlanets,
  getDirectMessage,
  getDirectHousePoetry,
  countDirectPlanets,
  getDirectPlanets,
  summarizeDirectPlanets
} from './directPlanetNarration';

// Aspect narration (soul dialogues)
export {
  narrateAspects,
  getAspectDialogue,
  hasAspectDialogue,
  getAspectsWithDialogues,
  countAspectsByType,
  summarizeAspects,
  getAvailableAspectDialogues
} from './aspectNarration';

// Epoch narration (mythic life chapters)
export {
  narrateEpoch,
  summarizeEpoch,
  narrateAllEpochs,
  narrateLifeOverview,
  getCurrentEpoch,
  getNextEpoch,
  getEpochHouseTheme,
  getEpochPlanetTone
} from './epochNarration';

// Full narrator (all bells together)
export {
  narrateSliceFull,
  narrateSliceWithEpoch,
  narrateCathedralBell,
  narrateLifeFull,
  getNarrationMode,
  narrateEssence,
  narrateComparison
} from './fullNarrator';

// Theme constants and utilities
export {
  PHI,
  PHI_SQ,
  PHI_INV,
  ROSE_BASE_RADIUS,
  ROSE_MID_RADIUS,
  ROSE_OUTER_RADIUS,
  ROSE_PORTAL_OFFSET,
  ELEMENT_COLORS,
  ELEMENT_GRADIENT_IDS,
  HOUSE_COLORS,
  getElementForSign,
  getModalityForSign,
  ANGULAR_HOUSES,
  SUCCEDENT_HOUSES,
  CADENT_HOUSES,
  EIGHTH_HOUSE,
  NINTH_HOUSE,
  isAngularHouse,
  getHouseType,
  ANIMATION_TIMINGS,
  getPetalDelay
} from './theme';

// Rising sign configuration
export {
  RISING_CONFIG,
  getRisingConfig,
  getSignsByElement,
  getSignElement
} from './risingConfig';
