/**
 * ============================================================================
 * SOUL GARDEN - EPOCH SYSTEM
 * ============================================================================
 * Export all epoch-related functions and components.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

export {
  generateEpochs,
  getCurrentEpoch,
  getUpcomingEpochs,
  getPastEpochs
} from './epochEngine';

export {
  nameEpoch,
  getEpochFlavor,
  getAllFlavorsForSign,
  RISING_FLAVORS
} from './epochNames';

export {
  narrateEpoch,
  summarizeEpoch,
  narrateCurrentPosition,
  HOUSE_THEMES,
  PLANET_TONES
} from './epochNarrator';
