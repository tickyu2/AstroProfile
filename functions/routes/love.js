/**
 * Love Intelligence Route Module
 *
 * Neurochemical Love Engine + Love Intelligence Service + Luna Chat Integration.
 * "Love = Mathematics + Soul"
 * Created: December 21, 2025
 */

const { onCall, anthropicKey, logger } = require('./shared');

// ---------------------------------------------------------------------------
// Module Imports (paths relative to functions/routes/)
// ---------------------------------------------------------------------------
const neurochemicalEngine = require('../neurochemical');
const loveIntelligence = require('../loveIntelligence');
const lunaChatIntegration = require('../loveIntelligence/lunaChatIntegration');

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {

  // =========================================================================
  // NEUROCHEMICAL LOVE ENGINE
  // =========================================================================

  /**
   * Process a conversation exchange through the Neurochemical Engine
   * Detects neurochemicals, calculates happiness, measures effectiveness
   */
  processNeurochemicalExchange: onCall({
    timeoutSeconds: 60,
    memory: '512MiB',
    secrets: [anthropicKey],
  }, async (request) => {
    const {
      userId,
      profileId,
      userMessage,
      protocolUsed,
      constitution,
      relationshipStage,
      timelineId
    } = request.data;

    if (!userId || !profileId || !userMessage || !protocolUsed) {
      throw new Error('userId, profileId, userMessage, and protocolUsed are required');
    }

    return await neurochemicalEngine.processConversationExchange({
      userId,
      profileId,
      userMessage,
      protocolUsed,
      constitution,
      relationshipStage,
      timelineId
    });
  }),

  /**
   * Get pattern recommendation for Luna's next response
   */
  getPatternRecommendation: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const {
      userId,
      profileId,
      constitution,
      relationshipStage,
      emotionalNeed
    } = request.data;

    if (!userId || !profileId) {
      throw new Error('userId and profileId are required');
    }

    return await neurochemicalEngine.getPatternRecommendation({
      userId,
      profileId,
      constitution,
      relationshipStage,
      emotionalNeed
    });
  }),

  /**
   * Retrieve anchor memories for context
   */
  getAnchorMemories: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { userId, profileId, queryText, neurochemical, limit } = request.data;

    if (!userId || !profileId) {
      throw new Error('userId and profileId are required');
    }

    return await neurochemicalEngine.getRelevantAnchors({
      userId,
      profileId,
      queryText,
      neurochemical,
      limit
    });
  }),

  /**
   * Get anchor statistics for a user
   */
  getAnchorStats: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      throw new Error('userId and profileId are required');
    }

    return await neurochemicalEngine.anchorManager.getAnchorStats(userId, profileId);
  }),

  /**
   * Calculate happiness from neurochemical levels (utility endpoint)
   */
  calculateHappiness: onCall({
    timeoutSeconds: 10,
    memory: '128MiB'
  }, async (request) => {
    const { neurochemicals, constitution } = request.data;

    if (!neurochemicals) {
      throw new Error('neurochemicals object is required');
    }

    return neurochemicalEngine.happinessCalculator.calculateHappiness(
      neurochemicals,
      constitution
    );
  }),

  /**
   * Detect neurochemicals from user message (utility endpoint)
   */
  detectNeurochemicals: onCall({
    timeoutSeconds: 60,
    memory: '256MiB'
  }, async (request) => {
    const { userMessage, protocolUsed, context } = request.data;

    if (!userMessage || !protocolUsed) {
      throw new Error('userMessage and protocolUsed are required');
    }

    return await neurochemicalEngine.neurochemicalDetector.detectNeurochemicals(
      userMessage,
      protocolUsed,
      context
    );
  }),

  /**
   * Get gold standard patterns (utility endpoint)
   */
  getGoldPatterns: onCall({
    timeoutSeconds: 30,
    memory: '128MiB'
  }, async (request) => {
    const { constitution } = request.data;

    // Return predefined gold patterns, optionally filtered by constitution
    const allPatterns = neurochemicalEngine.patternSelector.GOLD_PATTERNS;

    if (constitution) {
      const filtered = {};
      for (const [code, pattern] of Object.entries(allPatterns)) {
        if (pattern.constitutions.includes(constitution)) {
          filtered[code] = pattern;
        }
      }
      return filtered;
    }

    return allPatterns;
  }),

  // =========================================================================
  // LOVE INTELLIGENCE SERVICE ENDPOINTS
  // =========================================================================

  /**
   * Optimize conversation strategy using Love Intelligence
   */
  optimizeLoveConversation: onCall({
    timeoutSeconds: 60,
    memory: '256MiB'
  }, async (request) => {
    const { userId, profileId, conversationStage, emotionalContext } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    try {
      const result = await loveIntelligence.optimizeConversation({
        userId,
        profileId,
        conversationStage: conversationStage || 'developing',
        emotionalContext
      });

      return { success: true, ...result };
    } catch (error) {
      logger.error('[Love Intelligence] optimizeConversation error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Process a completed conversation exchange through Love Intelligence
   */
  processLoveExchange: onCall({
    timeoutSeconds: 60,
    memory: '256MiB'
  }, async (request) => {
    const { userId, profileId, userMessage, protocolUsed, timelineId } = request.data;

    if (!userId || !profileId || !userMessage) {
      return { success: false, error: 'Missing required parameters' };
    }

    try {
      const result = await loveIntelligence.processExchange({
        userId,
        profileId,
        userMessage,
        protocolUsed: protocolUsed || { oxytocin: 3, dopamine: 3, serotonin: 3, vasopressin: 3 },
        timelineId
      });

      return { success: true, ...result };
    } catch (error) {
      logger.error('[Love Intelligence] processExchange error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get or infer a user's Love Profile
   */
  getLoveProfile: onCall({
    timeoutSeconds: 30,
    memory: '128MiB'
  }, async (request) => {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    try {
      const profile = await loveIntelligence.getLoveProfile({ userId, profileId });
      return { success: true, profile };
    } catch (error) {
      logger.error('[Love Intelligence] getLoveProfile error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Analyze compatibility between two profiles
   */
  analyzeLoveCompatibility: onCall({
    timeoutSeconds: 60,
    memory: '256MiB'
  }, async (request) => {
    const { userId, profileIdA, profileIdB } = request.data;

    if (!userId || !profileIdA || !profileIdB) {
      return { success: false, error: 'Missing required profile IDs' };
    }

    try {
      const analysis = await loveIntelligence.analyzeCompatibility({
        userId,
        profileIdA,
        profileIdB
      });

      return { success: true, analysis };
    } catch (error) {
      logger.error('[Love Intelligence] analyzeCompatibility error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get neurochemical strategy for a specific Love Language
   */
  getLoveLanguageStrategy: onCall({
    timeoutSeconds: 30,
    memory: '128MiB'
  }, async (request) => {
    const { loveLanguage, intensity } = request.data;

    if (!loveLanguage) {
      return { success: false, error: 'Missing loveLanguage parameter' };
    }

    try {
      const strategy = loveIntelligence.getStrategyForLoveLanguage({
        loveLanguage,
        intensity: intensity || 'moderate'
      });

      return { success: true, strategy };
    } catch (error) {
      logger.error('[Love Intelligence] getStrategy error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get default love language preferences for a constitution
   */
  getConstitutionLoveDefaults: onCall({
    timeoutSeconds: 30,
    memory: '128MiB'
  }, async (request) => {
    const { constitution } = request.data;

    if (!constitution) {
      return { success: false, error: 'Missing constitution parameter' };
    }

    try {
      const defaults = loveIntelligence.getConstitutionDefaults({ constitution });
      return { success: true, defaults };
    } catch (error) {
      logger.error('[Love Intelligence] getConstitutionDefaults error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get bridge advice for closing love language gaps
   */
  getLoveBridgeAdvice: onCall({
    timeoutSeconds: 30,
    memory: '128MiB'
  }, async (request) => {
    const { give, receive } = request.data;

    if (!give || !receive) {
      return { success: false, error: 'Missing give or receive love language' };
    }

    try {
      const advice = loveIntelligence.getBridgeAdvice({ give, receive });
      return { success: true, advice, give, receive };
    } catch (error) {
      logger.error('[Love Intelligence] getBridgeAdvice error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Calculate World Love Meter contribution
   */
  calculateLoveContribution: onCall({
    timeoutSeconds: 30,
    memory: '128MiB'
  }, async (request) => {
    const { happinessScore, effectivenessScore, compatibilityScore } = request.data;

    try {
      const contribution = loveIntelligence.calculateWorldLoveContribution({
        happinessScore: happinessScore || 3,
        effectivenessScore: effectivenessScore || 0.7,
        compatibilityScore: compatibilityScore || 0.7
      });

      return { success: true, contribution };
    } catch (error) {
      logger.error('[Love Intelligence] calculateContribution error:', error);
      return { success: false, error: error.message };
    }
  }),

  // =========================================================================
  // LUNA CHAT INTEGRATION ENDPOINTS
  // =========================================================================

  /**
   * Enhance Luna's prompt with Love Intelligence
   * Called BEFORE generating Luna's response
   */
  enhanceLunaPrompt: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { userId, profileId, userMessage, conversationStage } = request.data;

    if (!userId || !profileId || !userMessage) {
      return { success: false, error: 'Missing userId, profileId, or userMessage' };
    }

    try {
      const enhancement = await lunaChatIntegration.enhanceLunaPrompt({
        userId,
        profileId,
        userMessage,
        conversationStage: conversationStage || 'developing'
      });

      // Also include formatted prompt guidance
      const formattedGuidance = lunaChatIntegration.formatGuidanceForPrompt(enhancement);

      return {
        success: true,
        enhancement,
        formattedGuidance,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Luna Integration] enhanceLunaPrompt error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Process post-conversation learning
   * Called AFTER Luna responds and we detect neurochemicals from user's next message
   */
  processPostConversation: onCall({
    timeoutSeconds: 30,
    memory: '128MiB'
  }, async (request) => {
    const { userId, profileId, detectedNeurochemicals, happinessScore, patternUsed } = request.data;

    if (!userId || !profileId || !detectedNeurochemicals || happinessScore === undefined) {
      return { success: false, error: 'Missing required parameters' };
    }

    try {
      const result = await lunaChatIntegration.processPostConversation({
        userId,
        profileId,
        detectedNeurochemicals,
        happinessScore,
        patternUsed
      });

      return result;
    } catch (error) {
      logger.error('[Luna Integration] processPostConversation error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get quick Luna guidance for a love language
   */
  getQuickLunaGuidance: onCall({
    timeoutSeconds: 10,
    memory: '128MiB'
  }, async (request) => {
    const { loveLanguage, intensity } = request.data;

    if (!loveLanguage) {
      return { success: false, error: 'Missing loveLanguage parameter' };
    }

    try {
      const guidance = lunaChatIntegration.getQuickLunaGuidance(
        loveLanguage,
        intensity || 'moderate'
      );

      return { success: true, guidance };
    } catch (error) {
      logger.error('[Luna Integration] getQuickLunaGuidance error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Determine conversation stage from context
   */
  determineConversationStage: onCall({
    timeoutSeconds: 10,
    memory: '128MiB'
  }, async (request) => {
    const { messageCount, avgHappiness, hasConflictIndicators, hasVulnerabilitySharing } = request.data;

    try {
      const stage = lunaChatIntegration.determineConversationStage({
        messageCount: messageCount || 0,
        avgHappiness: avgHappiness || 3,
        hasConflictIndicators: hasConflictIndicators || false,
        hasVulnerabilitySharing: hasVulnerabilitySharing || false
      });

      return { success: true, stage };
    } catch (error) {
      logger.error('[Luna Integration] determineConversationStage error:', error);
      return { success: false, error: error.message };
    }
  }),
};
