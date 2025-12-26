/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BEHAVIOR SYSTEM INDEX
 * Central export for Luna Behavior System components
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This module provides unified access to:
 * - Behavior computation (unified behaviorEngine)
 * - Constants (emotion behaviors, drift bounds)
 * - Cluster classification
 * - Personality drift
 * - Update pipeline
 * - Session adaptation
 *
 * Created: December 21, 2025
 * Refactored: December 21, 2025 - Consolidated duplicate engines
 */

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED BEHAVIOR ENGINE (replaces lunaBehaviorEngine + behaviorBlender)
// ═══════════════════════════════════════════════════════════════════════════════

export {
  getBehaviorForUserEmotion,
  quickBlend,
  getBehaviorBreakdown,
  getTimingThresholds,
  getLLMParams,
  getTTSParams,
  shouldGenerateBackchannel,
  EMOTION_BEHAVIORS,
  DEFAULT_BEHAVIOR,
  DEFAULT_LAYER_WEIGHTS
} from './behaviorEngine.js';

// Alias for backwards compatibility
export { getBehaviorForUserEmotion as blendBehavior } from './behaviorEngine.js';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  getEmotionBehavior,
  DRIFT_BOUNDS as DRIFT_BOUNDS_CONSTANTS,
  DRIFT_RATES,
  SIGNAL_WEIGHTS,
  getDriftBounds,
  getDriftRate,
  clampToBounds
} from './constants/index.js';

// ═══════════════════════════════════════════════════════════════════════════════
// CLUSTER CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

export {
  classifyUser,
  getClusterBehavior,
  getClusterDistribution,
  getClusterInfo,
  CLUSTERS,
  CLUSTER_PROFILES,
  CLUSTER_CRITERIA
} from './clusterEngine.js';

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONALITY DRIFT
// ═══════════════════════════════════════════════════════════════════════════════

export {
  getDriftState,
  getDriftModifiers,
  getDriftAnalytics,
  getDriftHistory,
  nudgeDrift,
  resetDrift,
  setDrift,
  calculateDrift,
  updateAllDriftFromProfile,
  applyDriftToBehavior,
  accumulateSignal,
  startDriftUpdates,
  stopDriftUpdates,
  loadDriftState,
  saveDriftState,
  DRIFT_BOUNDS
} from './personalityDrift.js';

// ═══════════════════════════════════════════════════════════════════════════════
// UPDATE PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

export {
  createSessionStats,
  computeSessionMetrics,
  handleTurnComplete,
  handleSessionEnd,
  runPeriodicDriftUpdate,
  recordBehaviorSignal,
  computeFinalBehavior,
  getBehaviorModifiers
} from './updatePipeline.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION ADAPTATION
// ═══════════════════════════════════════════════════════════════════════════════

export {
  getSessionBiases,
  createSessionStats as createSessionBackchannelStats,
  recordBackchannelPlayed,
  recordBackchannelOverSpoken,
  recordBackchannelAppreciated,
  recordResponseCompleted,
  recordResponseInterrupted,
  recordPauseDuration,
  getSessionSummary
} from './sessionBackchannelAdapter.js';

// ═══════════════════════════════════════════════════════════════════════════════
// LAB OVERRIDES (for testing)
// ═══════════════════════════════════════════════════════════════════════════════

export {
  setLabOverrides,
  clearLabOverrides,
  getLabOverrides,
  getAllLabOverrides,
  resetAllLabOverrides,
  applyLabOverrides
} from './labOverridesStore.js';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-TUNE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export {
  consolidatePreferencesIntoConfig,
  getAutoTuneAnalyticsForUser,
  resetAutoTuneForUser
} from './autoTuneEngine.js';
