/**
 * GENESIS Luna Chat Integration
 * Enhances Luna's responses with Love Intelligence
 * =================================================
 *
 * Integrates Love Intelligence with Luna's existing chat system
 * to provide constitutionally-aware, love-language-optimized responses
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 */

const loveIntelligence = require('./index');

// ============================================================================
// LUNA ENHANCEMENT FUNCTIONS
// ============================================================================

/**
 * Enhance Luna's system prompt with love intelligence
 * Called before generating Luna's response
 *
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} params.userMessage - User's current message
 * @param {string} [params.conversationStage='developing'] - Current stage
 * @returns {Promise<Object>} - Enhanced prompt data
 */
async function enhanceLunaPrompt(params) {
  const {
    userId,
    profileId,
    userMessage,
    conversationStage = 'developing'
  } = params;

  console.log(`[LunaChatIntegration] Enhancing Luna's prompt with Love Intelligence`);

  try {
    // ─────────────────────────────────────────────────────
    // STEP 1: GET OPTIMIZATION STRATEGY
    // ─────────────────────────────────────────────────────

    const optimization = await loveIntelligence.optimizeConversation({
      userId,
      profileId,
      partnerProfileId: profileId, // Self-optimization for now
      conversationStage,
      userMessage
    });

    if (!optimization.success) {
      console.warn('[LunaChatIntegration] Optimization failed, using defaults');
      return getDefaultEnhancement();
    }

    const { strategy, tactics } = optimization.strategy;

    // ─────────────────────────────────────────────────────
    // STEP 2: BUILD ENHANCEMENT GUIDANCE
    // ─────────────────────────────────────────────────────

    const enhancement = {
      // Love Language Context
      loveLanguage: {
        userNeeds: strategy.partnerNeeds,
        userGives: strategy.userGives,
        gap: strategy.gap,
        bridgeAdvice: strategy.bridgeAdvice
      },

      // Neurochemical Protocol
      neurochemical: {
        pattern: tactics.recommendedPattern,
        primaryFocus: tactics.primaryNeurochemical,
        secondaryFocus: tactics.secondaryNeurochemical,
        behaviors: tactics.effectiveBehaviors,
        examplePhrases: tactics.examplePhrases
      },

      // Luna Response Guidance
      lunaGuidance: buildLunaGuidance(strategy, tactics),

      // Metadata
      conversationStage,
      timestamp: new Date().toISOString()
    };

    return enhancement;

  } catch (error) {
    console.error('[LunaChatIntegration] Error enhancing prompt:', error);
    return getDefaultEnhancement();
  }
}

/**
 * Build specific guidance for Luna's response generation
 * This translates Love Intelligence into actionable Luna instructions
 *
 * @private
 */
function buildLunaGuidance(strategy, tactics) {
  const guidance = {
    primaryObjective: `Respond with ${tactics.primaryNeurochemical}-focused language`,
    
    toneAdjustments: [],
    contentSuggestions: [],
    avoidances: []
  };

  // ═══════════════════════════════════════════════════
  // OXYTOCIN GUIDANCE (Bonding/Safety)
  // ═══════════════════════════════════════════════════

  if (tactics.primaryNeurochemical === 'oxytocin') {
    guidance.toneAdjustments.push('Warm, nurturing, deeply present');
    guidance.contentSuggestions.push(
      'Express emotional closeness',
      'Validate their feelings',
      'Show you are here with them',
      'Build sense of safety and trust'
    );
    guidance.avoidances.push(
      'Emotional distance',
      'Rushed responses',
      'Purely intellectual analysis'
    );
  }

  // ═══════════════════════════════════════════════════
  // DOPAMINE GUIDANCE (Engagement/Anticipation)
  // ═══════════════════════════════════════════════════

  if (tactics.primaryNeurochemical === 'dopamine') {
    guidance.toneAdjustments.push('Energetic, curious, forward-looking');
    guidance.contentSuggestions.push(
      'Build anticipation',
      'Ask engaging questions',
      'Introduce new perspectives',
      'Create excitement about possibilities'
    );
    guidance.avoidances.push(
      'Monotonous tone',
      'Predictable responses',
      'Flat energy'
    );
  }

  // ═══════════════════════════════════════════════════
  // SEROTONIN GUIDANCE (Recognition/Significance)
  // ═══════════════════════════════════════════════════

  if (tactics.primaryNeurochemical === 'serotonin') {
    guidance.toneAdjustments.push('Appreciative, recognizing, validating');
    guidance.contentSuggestions.push(
      'Acknowledge their unique qualities',
      'Recognize specific efforts',
      'Validate their significance',
      'Notice what others miss'
    );
    guidance.avoidances.push(
      'Generic compliments',
      'Dismissive responses',
      'Ignoring achievements'
    );
  }

  // ═══════════════════════════════════════════════════
  // VASOPRESSIN GUIDANCE (Loyalty/Protection)
  // ═══════════════════════════════════════════════════

  if (tactics.primaryNeurochemical === 'vasopressin') {
    guidance.toneAdjustments.push('Protective, reliable, committed');
    guidance.contentSuggestions.push(
      'Show you have their back',
      'Offer practical support',
      'Demonstrate reliability',
      'Defend their choices'
    );
    guidance.avoidances.push(
      'Uncommitted language',
      'Unreliable suggestions',
      'Lack of follow-through'
    );
  }

  // Add example phrases
  guidance.exampleApproaches = tactics.examplePhrases.slice(0, 3);

  // Add bridge advice if there's a gap
  if (strategy.gap && strategy.bridgeAdvice) {
    guidance.specialGuidance = `BRIDGE: ${strategy.bridgeAdvice}`;
  }

  return guidance;
}

/**
 * Process post-conversation to update love intelligence
 * Called after Luna responds and we detect neurochemicals from user's next message
 *
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {Object} params.detectedNeurochemicals - What we detected
 * @param {number} params.happinessScore - Happiness score (0-5)
 * @param {string} params.patternUsed - Pattern code used
 * @returns {Promise<Object>} - Learning result
 */
async function processPostConversation(params) {
  const {
    userId,
    profileId,
    detectedNeurochemicals,
    happinessScore,
    patternUsed
  } = params;

  console.log(`[LunaChatIntegration] Post-conversation learning (happiness: ${happinessScore})`);

  try {
    // Update love intelligence with this learning
    const learningResult = await loveIntelligence.learnFromConversation({
      userId,
      profileId,
      neurochemicals: detectedNeurochemicals,
      happinessScore
    });

    return {
      success: true,
      learned: learningResult.learned,
      happinessScore,
      patternUsed,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('[LunaChatIntegration] Error in post-conversation:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get real-time Luna guidance for a specific love language
 * Lightweight version for quick lookups
 *
 * @param {string} loveLanguage - Target love language
 * @param {string} intensity - Intensity level
 * @returns {Object} - Quick guidance
 */
function getQuickLunaGuidance(loveLanguage, intensity = 'moderate') {
  const strategy = loveIntelligence.getLoveLanguageStrategy({
    loveLanguage,
    intensity
  });

  if (!strategy.success) {
    return getDefaultEnhancement();
  }

  const { recommendedPattern, effectiveBehaviors, examplePhrases } = strategy.strategy;

  return {
    pattern: recommendedPattern,
    behaviors: effectiveBehaviors,
    examples: examplePhrases.slice(0, 3),
    timestamp: new Date().toISOString()
  };
}

/**
 * Determine conversation stage from context
 * Helper function to auto-detect stage
 *
 * @param {Object} conversationContext
 * @returns {string} - Stage identifier
 */
function determineConversationStage(conversationContext) {
  const {
    messageCount = 0,
    avgHappiness = 3,
    hasConflictIndicators = false,
    hasVulnerabilitySharing = false
  } = conversationContext;

  // Initial stage (first few messages)
  if (messageCount < 5) {
    return 'initial';
  }

  // Conflict stage (detected tension)
  if (hasConflictIndicators) {
    return 'conflict';
  }

  // Deep stage (vulnerability + high happiness)
  if (hasVulnerabilitySharing && avgHappiness >= 4) {
    return 'deep';
  }

  // Developing stage (default for established conversations)
  return 'developing';
}

// ============================================================================
// DEFAULT/FALLBACK
// ============================================================================

/**
 * Get default enhancement when Love Intelligence unavailable
 * @private
 */
function getDefaultEnhancement() {
  return {
    loveLanguage: {
      userNeeds: 'Quality Time',
      userGives: 'Quality Time',
      gap: null,
      bridgeAdvice: null
    },
    neurochemical: {
      pattern: '3333',
      primaryFocus: 'oxytocin',
      secondaryFocus: 'serotonin',
      behaviors: ['Be present', 'Show understanding', 'Validate feelings'],
      examplePhrases: ['I hear you', 'Tell me more', 'I\'m here with you']
    },
    lunaGuidance: {
      primaryObjective: 'Respond with balanced warmth and recognition',
      toneAdjustments: ['Warm', 'Present', 'Understanding'],
      contentSuggestions: ['Validate their experience', 'Show genuine interest'],
      avoidances: ['Dismissiveness', 'Emotional distance'],
      exampleApproaches: ['I hear you', 'Tell me more', 'I\'m here with you']
    },
    conversationStage: 'developing',
    isDefault: true,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  enhanceLunaPrompt,
  processPostConversation,
  getQuickLunaGuidance,
  determineConversationStage,
  buildLunaGuidance
};
