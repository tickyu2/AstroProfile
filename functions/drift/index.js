/**
 * ============================================================================
 * PERSONALITY DRIFT MODULE - Central Export
 * ============================================================================
 * Auto-Tune Personality Drift System for Luna
 *
 * Architecture:
 * - driftStore: PostgreSQL CRUD operations
 * - driftEngine: Per-user EMA updates at session end
 * - nightlyDriftJob: Global aggregation and cleanup
 * - behaviorBlender: Combines all sources into final behavior
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const driftStore = require('./driftStore');
const driftEngine = require('./driftEngine');
const nightlyDriftJob = require('./nightlyDriftJob');
const behaviorBlender = require('./behaviorBlender');

// ============================================================================
// PRIMARY EXPORTS (Most commonly used)
// ============================================================================

module.exports = {
  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION INTEGRATION (Call these from chat system)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Call at session end to update user drift
   * @param {string} userId - User ID
   * @param {string} conversationId - Conversation ID
   * @param {Object} sessionMetrics - Session metrics
   * @param {string} profileId - Profile ID
   */
  onSessionEnd: driftEngine.onSessionEnd,

  /**
   * Get combined behavior for prompt building
   * @param {string} userId - User ID
   * @param {Object} sessionContext - Current context
   * @param {string} profileId - Profile ID
   */
  getCombinedBehavior: behaviorBlender.getCombinedBehavior,

  /**
   * Get behavior as prompt instructions
   * @param {string} userId - User ID
   * @param {Object} sessionContext - Current context
   * @param {string} profileId - Profile ID
   */
  getBehaviorPromptInstructions: behaviorBlender.getBehaviorPromptInstructions,

  /**
   * Get voice parameters for TTS
   * @param {string} userId - User ID
   * @param {Object} sessionContext - Current context
   * @param {string} profileId - Profile ID
   */
  getVoiceParameters: behaviorBlender.getVoiceParameters,

  // ═══════════════════════════════════════════════════════════════════════════
  // FEEDBACK PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Process explicit user feedback
   */
  processUserFeedback: driftEngine.processUserFeedback,

  // ═══════════════════════════════════════════════════════════════════════════
  // DRIFT MODIFIERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get combined drift modifiers (global + user)
   */
  getCombinedDriftModifiers: driftEngine.getCombinedDriftModifiers,

  /**
   * Get global drift modifiers only
   */
  getGlobalDriftModifiers: driftStore.getGlobalDriftModifiers,

  /**
   * Get user drift modifiers only
   */
  getUserDriftModifiers: driftStore.getUserDriftModifiers,

  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNAL ACCUMULATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Accumulate a single user signal
   */
  accumulateUserSignal: driftStore.accumulateUserSignal,

  /**
   * Accumulate multiple user signals
   */
  accumulateUserSignals: driftStore.accumulateUserSignals,

  /**
   * Accumulate global signal
   */
  accumulateGlobalSignal: driftStore.accumulateGlobalSignal,

  // ═══════════════════════════════════════════════════════════════════════════
  // DRIFT DATA ACCESS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get user drift state
   */
  getUserDrift: driftStore.getUserDrift,

  /**
   * Get global drift state
   */
  getGlobalDrift: driftStore.getGlobalDrift,

  /**
   * Get drift history
   */
  getDriftHistory: driftStore.getDriftHistory,

  // ═══════════════════════════════════════════════════════════════════════════
  // NIGHTLY JOB
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Run nightly drift update (call from scheduler)
   */
  runNightlyDriftUpdate: nightlyDriftJob.runNightlyDriftUpdate,

  /**
   * Get drift status for monitoring
   */
  getDriftStatus: nightlyDriftJob.getDriftStatus,

  /**
   * Force global drift update (admin)
   */
  forceGlobalDriftUpdate: nightlyDriftJob.forceGlobalDriftUpdate,

  // ═══════════════════════════════════════════════════════════════════════════
  // ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get behavior summary for debugging
   */
  getBehaviorSummary: behaviorBlender.getBehaviorSummary,

  /**
   * Generate drift analytics
   */
  generateDriftAnalytics: nightlyDriftJob.generateDriftAnalytics,

  /**
   * Predict drift direction
   */
  predictDriftDirection: behaviorBlender.predictDriftDirection,

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIALIZED BEHAVIOR
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get behavior for specific interaction types
   */
  getBehaviorForInteractionType: behaviorBlender.getBehaviorForInteractionType,

  // ═══════════════════════════════════════════════════════════════════════════
  // FULL MODULE ACCESS (For advanced use)
  // ═══════════════════════════════════════════════════════════════════════════

  store: driftStore,
  engine: driftEngine,
  nightlyJob: nightlyDriftJob,
  blender: behaviorBlender,

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  DRIFT_BOUNDS: driftStore.DRIFT_BOUNDS,
  BASE_PERSONALITY: behaviorBlender.BASE_PERSONALITY,
  FINAL_BOUNDS: behaviorBlender.FINAL_BOUNDS,
  EMA_ALPHA: driftEngine.EMA_ALPHA,
  SIGNAL_WEIGHTS: driftEngine.SIGNAL_WEIGHTS,
  AGGREGATION_CONFIG: nightlyDriftJob.AGGREGATION_CONFIG
};
