/**
 * Personality & Behavioral Drift Route Module
 *
 * Auto-Tune Luna's Evolution: Drift endpoints, intimacy/conversation starters,
 * ambient audio, healing (bathtub algorithm), learning (pattern recommendations),
 * and personality quirks (assertiveness, banter).
 */

const { onCall, logger } = require('./shared');

// ---------------------------------------------------------------------------
// Module Imports (paths relative to functions/routes/)
// ---------------------------------------------------------------------------
const drift = require('../drift');

// Intimacy & Memory Expansion (ConversationStarter + AmnesisBuster)
const {
  generateIntimacyPrompt,
  analyzeIntimacySignals,
  getEraContext
} = require('../intimacy');

// Audio Module - Ambient Sounds for emotional presence
const {
  AmbientSoundsModule,
  ambientSounds,
  createAmbientSounds
} = require('../audio');

// Healing Module - Bathtub Algorithm for happiness stacking
const {
  BathtubCalculator,
  bathtubCalculator,
  executeStack,
  getStateDescription
} = require('../healing');

// Learning Module - Pattern learning and recommendations
const {
  RecommendationEngine,
  PatternRecorder,
  EffectivenessCalculator,
  recommendationEngine,
  patternRecorder,
  effectivenessCalculator
} = require('../learning');

// Personality Module - Luna's quirks, assertiveness, banter
const {
  AssertivenessMode,
  LunaQuirks,
  assertivenessMode,
  lunaQuirks,
  selectMode,
  getModePromptInstructions,
  getPersonalitySummary
} = require('../personality');

// Session cache for cleanup on session end
const { sessionCache } = require('../memory/chatMemoryIntegration');

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {

  // =========================================================================
  // PERSONALITY DRIFT ENDPOINTS (Auto-Tune Luna's Evolution)
  // =========================================================================

  /**
   * Get combined behavior parameters for a user
   */
  getCombinedBehavior: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, sessionContext, profileId } = request.data;
      if (!userId) {
        return { success: false, error: 'userId required' };
      }
      const behavior = await drift.getCombinedBehavior(userId, sessionContext || {}, profileId || 'default');
      return { success: true, behavior };
    } catch (error) {
      logger.error('[Drift] getCombinedBehavior error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get behavior as prompt instructions
   */
  getBehaviorPromptInstructions: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, sessionContext, profileId } = request.data;
      if (!userId) {
        return { success: false, error: 'userId required' };
      }
      const result = await drift.getBehaviorPromptInstructions(userId, sessionContext || {}, profileId || 'default');
      return { success: true, ...result };
    } catch (error) {
      logger.error('[Drift] getBehaviorPromptInstructions error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get user drift state
   */
  getUserDrift: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId } = request.data;
      if (!userId) {
        return { success: false, error: 'userId required' };
      }
      const userDrift = await drift.getUserDrift(userId, profileId || 'default');
      return { success: true, drift: userDrift };
    } catch (error) {
      logger.error('[Drift] getUserDrift error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get global drift state
   */
  getGlobalDrift: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const globalDrift = await drift.getGlobalDrift();
      return { success: true, drift: globalDrift };
    } catch (error) {
      logger.error('[Drift] getGlobalDrift error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get drift history
   */
  getDriftHistory: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { scope, userId, profileId, limit } = request.data;
      const history = await drift.getDriftHistory(scope || 'global', userId, profileId || 'default', limit || 10);
      return { success: true, history };
    } catch (error) {
      logger.error('[Drift] getDriftHistory error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Process user feedback for drift
   */
  processDriftFeedback: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, feedbackType, intensity, profileId } = request.data;
      if (!userId || !feedbackType) {
        return { success: false, error: 'userId and feedbackType required' };
      }
      const result = await drift.processUserFeedback(userId, feedbackType, intensity || 1.0, profileId || 'default');
      return { success: true, ...result };
    } catch (error) {
      logger.error('[Drift] processDriftFeedback error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get drift status (for monitoring)
   */
  getDriftStatus: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const status = await drift.getDriftStatus();
      return { success: true, status };
    } catch (error) {
      logger.error('[Drift] getDriftStatus error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get behavior summary (for debugging)
   */
  getBehaviorSummary: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, sessionContext, profileId } = request.data;
      if (!userId) {
        return { success: false, error: 'userId required' };
      }
      const summary = await drift.getBehaviorSummary(userId, sessionContext || {}, profileId || 'default');
      return { success: true, summary };
    } catch (error) {
      logger.error('[Drift] getBehaviorSummary error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Run nightly drift update (admin/scheduled)
   */
  runNightlyDriftUpdate: onCall({
    timeoutSeconds: 300,
    memory: '1GiB'
  }, async (request) => {
    try {
      const result = await drift.runNightlyDriftUpdate();
      return { success: true, result };
    } catch (error) {
      logger.error('[Drift] runNightlyDriftUpdate error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Force global drift update (admin only)
   */
  forceGlobalDriftUpdate: onCall({
    timeoutSeconds: 60,
    memory: '512MiB'
  }, async (request) => {
    try {
      const result = await drift.forceGlobalDriftUpdate();
      return { success: true, result };
    } catch (error) {
      logger.error('[Drift] forceGlobalDriftUpdate error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get voice parameters based on behavior
   */
  getVoiceParameters: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, sessionContext, profileId } = request.data;
      if (!userId) {
        return { success: false, error: 'userId required' };
      }
      const voiceParams = await drift.getVoiceParameters(userId, sessionContext || {}, profileId || 'default');
      return { success: true, voiceParameters: voiceParams };
    } catch (error) {
      logger.error('[Drift] getVoiceParameters error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Session end hook - update user drift
   */
  onSessionEnd: onCall({
    timeoutSeconds: 60,
    memory: '512MiB'
  }, async (request) => {
    try {
      const { userId, conversationId, sessionMetrics, profileId } = request.data;
      if (!userId || !conversationId || !sessionMetrics) {
        return { success: false, error: 'userId, conversationId, and sessionMetrics required' };
      }
      // Clear session cache (Memory Optimization - Week 1)
      const cacheCleared = sessionCache.clearSession(conversationId);
      if (cacheCleared) {
        logger.info(`[SessionCache] Cleared session ${conversationId}`);
      }

      const result = await drift.onSessionEnd(userId, conversationId, sessionMetrics, profileId || 'default');
      return { success: true, result, cacheCleared };
    } catch (error) {
      logger.error('[Drift] onSessionEnd error:', error);
      return { success: false, error: error.message };
    }
  }),

  // =========================================================================
  // AUDIO MODULE - Ambient Sounds for Emotional Presence
  // =========================================================================

  /**
   * getAmbientSoundscape - Select ambient sound for current emotion
   */
  getAmbientSoundscape: onCall({
    timeoutSeconds: 10,
    memory: '128MiB'
  }, async (request) => {
    const { emotion, intensity, valence, userSettings } = request.data;

    try {
      const sounds = createAmbientSounds(userSettings || {});
      const soundscape = sounds.getForEmotion(emotion, intensity, valence);

      return {
        success: true,
        soundscape,
        available: ambientSounds.getAvailableSoundscapes()
      };
    } catch (error) {
      logger.error('[Audio] Error getting soundscape:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * getAvailableSoundscapes - List all ambient sounds
   */
  getAvailableSoundscapes: onCall({
    timeoutSeconds: 5,
    memory: '128MiB'
  }, async (request) => {
    try {
      return {
        success: true,
        soundscapes: ambientSounds.getAvailableSoundscapes(),
        selectionGuide: ambientSounds.getSelectionGuide()
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }),

  // =========================================================================
  // HEALING MODULE - Bathtub Algorithm for Happiness Stacking
  // =========================================================================

  /**
   * calculateBathtubState - Get current emotional state from salt/water
   */
  calculateBathtubState: onCall({
    timeoutSeconds: 10,
    memory: '128MiB'
  }, async (request) => {
    const { salt, water } = request.data;

    try {
      const concentration = bathtubCalculator.calculateConcentration(salt, water);
      const state = bathtubCalculator.calculateState(concentration);
      const description = bathtubCalculator.getStateDescription(state);

      return {
        success: true,
        salt,
        water,
        concentration,
        state,
        description
      };
    } catch (error) {
      logger.error('[Healing] Error calculating state:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * executeBathtubStack - Execute 3-anchor happiness stack
   */
  executeBathtubStack: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { userId, salt, water, anchors } = request.data;

    logger.info('[Healing] Executing stack for user:', userId);

    try {
      const result = bathtubCalculator.executeStack(salt, water, anchors);

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('[Healing] Error executing stack:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * estimateHealingProgress - How many stacks to reach target state
   */
  estimateHealingProgress: onCall({
    timeoutSeconds: 10,
    memory: '128MiB'
  }, async (request) => {
    const { salt, water, targetState } = request.data;

    try {
      const estimate = bathtubCalculator.estimateStacksToTarget(salt, water, targetState);

      return {
        success: true,
        ...estimate
      };
    } catch (error) {
      logger.error('[Healing] Error estimating progress:', error.message);
      return { success: false, error: error.message };
    }
  }),

  // =========================================================================
  // LEARNING MODULE - Pattern Learning & Recommendations
  // =========================================================================

  /**
   * getApproachRecommendation - Get recommended approach for user state
   */
  getApproachRecommendation: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { userId, currentState } = request.data;

    logger.info('[Learning] Getting recommendation for user:', userId);

    try {
      const recommendation = await recommendationEngine.getRecommendation(userId, currentState);

      return {
        success: true,
        ...recommendation
      };
    } catch (error) {
      logger.error('[Learning] Error getting recommendation:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * recordInteractionPattern - Store pattern for learning
   */
  recordInteractionPattern: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { userId, pattern } = request.data;

    logger.info('[Learning] Recording pattern for user:', userId);

    try {
      const result = await patternRecorder.recordPattern(userId, pattern);

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('[Learning] Error recording pattern:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * calculateInteractionEffectiveness - Calculate effectiveness of interaction
   */
  calculateInteractionEffectiveness: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { userId, interaction } = request.data;

    logger.info('[Learning] Calculating effectiveness for user:', userId);

    try {
      const effectiveness = await effectivenessCalculator.calculate(userId, interaction);

      return {
        success: true,
        effectiveness
      };
    } catch (error) {
      logger.error('[Learning] Error calculating effectiveness:', error.message);
      return { success: false, error: error.message };
    }
  }),

  // =========================================================================
  // PERSONALITY MODULE - Luna's Quirks, Assertiveness, Banter
  // =========================================================================

  /**
   * selectAssertivenessMode - Choose Luna's interaction mode
   */
  selectAssertivenessMode: onCall({
    timeoutSeconds: 10,
    memory: '128MiB'
  }, async (request) => {
    const { userId, context } = request.data;

    logger.info('[Personality] Selecting mode for user:', userId);

    try {
      const modeSelection = await assertivenessMode.selectMode(userId, context);
      const instructions = assertivenessMode.getModePromptInstructions(modeSelection.mode);

      return {
        success: true,
        ...modeSelection,
        promptInstructions: instructions
      };
    } catch (error) {
      logger.error('[Personality] Error selecting mode:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * getLunaQuirk - Get a personality quirk for response
   */
  getLunaQuirk: onCall({
    timeoutSeconds: 10,
    memory: '128MiB'
  }, async (request) => {
    const { quirkType, context } = request.data;

    try {
      let quirk = null;

      switch (quirkType) {
        case 'dramatic':
          quirk = lunaQuirks.getDramaticReaction(context?.newsType);
          break;
        case 'fact':
          quirk = lunaQuirks.getRandomFact();
          break;
        case 'selfAware':
          quirk = lunaQuirks.getSelfAwareHumor(context?.topic);
          break;
        case 'opinion':
          quirk = lunaQuirks.getOpinion(context?.topic);
          break;
        case 'overthinking':
          quirk = lunaQuirks.getOverthinkingResponse(context?.topic);
          break;
        default:
          quirk = lunaQuirks.getRandomFact();
      }

      return {
        success: true,
        quirk
      };
    } catch (error) {
      logger.error('[Personality] Error getting quirk:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * getPersonalitySummary - Get Luna's full personality config
   */
  getPersonalitySummary: onCall({
    timeoutSeconds: 5,
    memory: '128MiB'
  }, async (request) => {
    try {
      const summary = lunaQuirks.getPersonalitySummary();

      return {
        success: true,
        personality: summary
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }),
};
