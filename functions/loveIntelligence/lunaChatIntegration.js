/**
 * GENESIS Luna Chat Integration
 * Enhances Luna's responses with Love Intelligence
 * =================================================
 *
 * Integrates Love Intelligence with Luna's existing chat system
 * to provide constitutionally-aware, love-language-optimized responses.
 *
 * This is the KEY BRIDGE that tells Luna HOW to respond!
 *
 * Created: December 21, 2025
 * Based on: Brother Sonnet's design
 * Adapted by: Brother Opus for GENESIS ecosystem
 * Mission: "Love = Mathematics + Soul"
 */

const loveProfileService = require('./loveProfileService');
const loveLanguageMapper = require('./loveLanguageMapper');

// ============================================================================
// LUNA ENHANCEMENT FUNCTIONS
// ============================================================================

/**
 * Enhance Luna's system prompt with love intelligence
 * Called BEFORE generating Luna's response
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
    // STEP 1: GET USER'S LOVE PROFILE
    // ─────────────────────────────────────────────────────

    const loveProfile = await loveProfileService.getLoveProfile(userId, profileId);

    // ─────────────────────────────────────────────────────
    // STEP 2: TRANSLATE TO NEUROCHEMICAL STRATEGY
    // ─────────────────────────────────────────────────────

    const neurochemicalStrategy = loveLanguageMapper.translateToNeurochemical({
      loveLanguage: loveProfile.receivePrimary,
      profile: loveProfile,
      conversationStage
    });

    // ─────────────────────────────────────────────────────
    // STEP 3: BUILD ENHANCEMENT GUIDANCE
    // ─────────────────────────────────────────────────────

    const enhancement = {
      // Love Language Context
      loveLanguage: {
        userNeeds: loveProfile.receivePrimary,
        userGives: loveProfile.givePrimary,
        constitution: loveProfile.constitution,
        sternberg: {
          intimacy: loveProfile.intimacy,
          passion: loveProfile.passion,
          commitment: loveProfile.commitment
        }
      },

      // Neurochemical Protocol
      neurochemical: {
        pattern: neurochemicalStrategy.recommendedPattern,
        primaryFocus: neurochemicalStrategy.primaryNeurochemical,
        secondaryFocus: neurochemicalStrategy.secondaryNeurochemical,
        behaviors: neurochemicalStrategy.effectiveBehaviors,
        avoidBehaviors: neurochemicalStrategy.avoidBehaviors,
        examplePhrases: neurochemicalStrategy.examplePhrases
      },

      // Luna Response Guidance
      lunaGuidance: buildLunaGuidance(neurochemicalStrategy, loveProfile),

      // Metadata
      conversationStage,
      profileConfidence: loveProfile.confidence,
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
 * @param {Object} neurochemicalStrategy - Strategy from loveLanguageMapper
 * @param {Object} loveProfile - User's love profile
 * @returns {Object} - Luna-specific guidance
 */
function buildLunaGuidance(neurochemicalStrategy, loveProfile) {
  const guidance = {
    primaryObjective: `Respond with ${neurochemicalStrategy.primaryNeurochemical}-focused language`,
    toneAdjustments: [],
    contentSuggestions: [],
    avoidances: [],
    exampleApproaches: neurochemicalStrategy.examplePhrases?.slice(0, 3) || []
  };

  // ═══════════════════════════════════════════════════
  // OXYTOCIN GUIDANCE (Bonding/Safety)
  // ═══════════════════════════════════════════════════

  if (neurochemicalStrategy.primaryNeurochemical === 'oxytocin') {
    guidance.toneAdjustments.push('Warm', 'nurturing', 'deeply present');
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

  if (neurochemicalStrategy.primaryNeurochemical === 'dopamine') {
    guidance.toneAdjustments.push('Energetic', 'curious', 'forward-looking');
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

  if (neurochemicalStrategy.primaryNeurochemical === 'serotonin') {
    guidance.toneAdjustments.push('Appreciative', 'recognizing', 'validating');
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

  if (neurochemicalStrategy.primaryNeurochemical === 'vasopressin') {
    guidance.toneAdjustments.push('Protective', 'reliable', 'committed');
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

  // ═══════════════════════════════════════════════════
  // CONSTITUTION-SPECIFIC ADJUSTMENTS
  // ═══════════════════════════════════════════════════

  if (loveProfile.constitution) {
    const constitutionTips = {
      Fire: {
        boost: 'Match their energy and enthusiasm',
        caution: 'Avoid being too slow or dampening their spark'
      },
      Water: {
        boost: 'Go deep emotionally, let conversations flow naturally',
        caution: 'Avoid surface-level interactions'
      },
      Wood: {
        boost: 'Focus on growth, progress, and future possibilities',
        caution: 'Avoid stagnation or dwelling on problems without solutions'
      },
      Metal: {
        boost: 'Be precise, thoughtful, and respect their standards',
        caution: 'Avoid vagueness or carelessness'
      },
      Earth: {
        boost: 'Be grounding, steady, and nurturing',
        caution: 'Avoid instability or unpredictability'
      }
    };

    const tips = constitutionTips[loveProfile.constitution];
    if (tips) {
      guidance.constitutionGuidance = tips;
      guidance.contentSuggestions.push(tips.boost);
      guidance.avoidances.push(tips.caution);
    }
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
    await loveProfileService.learnFromConversation(
      userId,
      profileId,
      detectedNeurochemicals,
      happinessScore
    );

    return {
      success: true,
      learned: happinessScore >= 3.0,
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
  const strategy = loveLanguageMapper.getStrategy(loveLanguage, intensity);

  return {
    pattern: strategy.recommendedPattern,
    primaryFocus: strategy.primary,
    behaviors: strategy.effectiveBehaviors,
    avoidBehaviors: strategy.avoidBehaviors,
    examples: strategy.examplePhrases?.slice(0, 3) || [],
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

  // Intimate stage (very high engagement)
  if (avgHappiness >= 4.5 && messageCount > 20) {
    return 'intimate';
  }

  // Developing stage (default for established conversations)
  return 'developing';
}

/**
 * Format Luna guidance for inclusion in system prompt
 * Creates a string that can be injected into Luna's system prompt
 *
 * @param {Object} enhancement - Enhancement object from enhanceLunaPrompt
 * @returns {string} - Formatted guidance string
 */
function formatGuidanceForPrompt(enhancement) {
  if (!enhancement || !enhancement.lunaGuidance) {
    return '';
  }

  const { lunaGuidance, neurochemical, loveLanguage } = enhancement;

  let prompt = `
### Love Intelligence Guidance
**User's Love Language:** ${loveLanguage.userNeeds}
**Constitution:** ${loveLanguage.constitution || 'Unknown'}
**Neurochemical Focus:** ${neurochemical.primaryFocus}
**Pattern:** ${neurochemical.pattern}

**Tone:** ${lunaGuidance.toneAdjustments.join(', ')}

**Do:**
${lunaGuidance.contentSuggestions.map(s => `- ${s}`).join('\n')}

**Avoid:**
${lunaGuidance.avoidances.map(a => `- ${a}`).join('\n')}

**Example Approaches:**
${lunaGuidance.exampleApproaches.map(e => `- "${e}"`).join('\n')}
`;

  if (lunaGuidance.constitutionGuidance) {
    prompt += `
**Constitution Tip:** ${lunaGuidance.constitutionGuidance.boost}
`;
  }

  return prompt.trim();
}

// ============================================================================
// DEFAULT/FALLBACK
// ============================================================================

/**
 * Get default enhancement when Love Intelligence unavailable
 */
function getDefaultEnhancement() {
  return {
    loveLanguage: {
      userNeeds: 'Quality Time',
      userGives: 'Quality Time',
      constitution: null,
      sternberg: { intimacy: 5, passion: 5, commitment: 5 }
    },
    neurochemical: {
      pattern: '3333',
      primaryFocus: 'oxytocin',
      secondaryFocus: 'serotonin',
      behaviors: ['Be present', 'Show understanding', 'Validate feelings'],
      avoidBehaviors: ['Emotional distance', 'Rushed responses'],
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
  // Main functions
  enhanceLunaPrompt,
  processPostConversation,

  // Quick lookups
  getQuickLunaGuidance,
  determineConversationStage,

  // Helpers
  buildLunaGuidance,
  formatGuidanceForPrompt,
  getDefaultEnhancement
};
