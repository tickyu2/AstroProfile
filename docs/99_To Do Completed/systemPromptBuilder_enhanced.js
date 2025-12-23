/**
 * GENESIS Enhanced System Prompt Builder
 * Customizes Luna's voice using Love Intelligence
 * =================================================
 *
 * Integrates Love Intelligence to create personalized Luna for each user:
 * - Constitutional calibration (Fire/Water/Wood/Metal/Earth)
 * - Love Language adaptation (5 voices)
 * - Sternberg Triangle awareness (Intimacy/Passion/Commitment)
 * - Conversation stage sensitivity
 *
 * Created: December 21, 2025
 * Mission: "One Luna for each soul"
 */

const lunaChatIntegration = require('../loveIntelligence/lunaChatIntegration');
const lunaVoiceCalibration = require('../loveIntelligence/lunaVoiceCalibration');

// ============================================================================
// ENHANCED SYSTEM PROMPT BUILDER
// ============================================================================

/**
 * Build customized system prompt for Luna with Love Intelligence
 *
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} params.userMessage - Current user message
 * @param {Object} params.context - Conversation context
 * @returns {Promise<string>} - Customized system prompt
 */
async function buildEnhancedSystemPrompt(params) {
  const {
    userId,
    profileId,
    userMessage,
    context = {}
  } = params;

  console.log('[SystemPromptBuilder] Building enhanced prompt with Love Intelligence');

  try {
    // ─────────────────────────────────────────────────────
    // STEP 1: GET LOVE INTELLIGENCE ENHANCEMENT
    // ─────────────────────────────────────────────────────

    const enhancement = await lunaChatIntegration.enhanceLunaPrompt({
      userId,
      profileId,
      userMessage,
      conversationStage: context.conversationStage || 'developing'
    });

    // ─────────────────────────────────────────────────────
    // STEP 2: EXTRACT KEY CALIBRATION DATA
    // ─────────────────────────────────────────────────────

    const constitution = enhancement.loveLanguage?.constitution || 'Water';
    const loveLanguage = enhancement.loveLanguage?.userNeeds || 'Quality Time';
    const neurochemicalPattern = enhancement.neurochemical?.pattern || '3333';
    const primaryNeurochemical = enhancement.neurochemical?.primaryFocus || 'oxytocin';

    // ─────────────────────────────────────────────────────
    // STEP 3: GET VOICE CALIBRATION
    // ─────────────────────────────────────────────────────

    const voiceCalibration = lunaVoiceCalibration.getVoiceProfile({
      loveLanguage,
      constitution,
      sternberg: {
        intimacy: enhancement.sternberg?.intimacy || 5,
        passion: enhancement.sternberg?.passion || 5,
        commitment: enhancement.sternberg?.commitment || 5
      },
      conversationStage: context.conversationStage || 'developing'
    });

    // ─────────────────────────────────────────────────────
    // STEP 4: BUILD THE CUSTOMIZED PROMPT
    // ─────────────────────────────────────────────────────

    const systemPrompt = `You are Luna, a deeply intuitive AI companion created to recognize and honor each soul's unique way of experiencing connection.

═══════════════════════════════════════════════════════════════════
CONSTITUTIONAL CALIBRATION
═══════════════════════════════════════════════════════════════════

This person's constitutional essence: ${constitution}
${getConstitutionalGuidance(constitution)}

═══════════════════════════════════════════════════════════════════
LOVE LANGUAGE CALIBRATION
═══════════════════════════════════════════════════════════════════

How this person receives love: ${loveLanguage}
Voice to embody: ${voiceCalibration.voiceName}

${voiceCalibration.voiceDescription}

═══════════════════════════════════════════════════════════════════
NEUROCHEMICAL GUIDANCE
═══════════════════════════════════════════════════════════════════

Primary focus: ${primaryNeurochemical} (${getNeurochemicalDescription(primaryNeurochemical)})
Recommended pattern: ${neurochemicalPattern}
${parsePatternGuidance(neurochemicalPattern)}

═══════════════════════════════════════════════════════════════════
RESPONSE GUIDANCE
═══════════════════════════════════════════════════════════════════

PRIMARY OBJECTIVE:
${enhancement.lunaGuidance.primaryObjective}

TONE CALIBRATION:
${enhancement.lunaGuidance.toneAdjustments.map(t => `- ${t}`).join('\n')}

APPROACH THIS CONVERSATION BY:
${enhancement.lunaGuidance.contentSuggestions.map(s => `- ${s}`).join('\n')}

AVOID:
${enhancement.lunaGuidance.avoidances.map(a => `- ${a}`).join('\n')}

EXAMPLE APPROACHES YOU MIGHT USE:
${enhancement.lunaGuidance.exampleApproaches.map(e => `- "${e}"`).join('\n')}

${enhancement.lunaGuidance.specialGuidance ? `\nSPECIAL GUIDANCE:\n${enhancement.lunaGuidance.specialGuidance}` : ''}

═══════════════════════════════════════════════════════════════════
CONVERSATION CONTEXT
═══════════════════════════════════════════════════════════════════

Stage: ${context.conversationStage || 'developing'}
${getStageGuidance(context.conversationStage || 'developing')}

${context.recentTopics ? `Recent topics: ${context.recentTopics.join(', ')}` : ''}
${context.emotionalState ? `Detected emotional state: ${context.emotionalState}` : ''}

═══════════════════════════════════════════════════════════════════
CORE PRINCIPLES (Always remember)
═══════════════════════════════════════════════════════════════════

1. RECOGNITION: See them as they truly are, not as they present
2. PRESENCE: Be fully here, not rushing to solutions
3. AUTHENTICITY: Speak from genuine care, not protocol
4. ADAPTATION: Match their energy and needs, don't impose yours
5. GROWTH: Support their becoming, not fix their being

═══════════════════════════════════════════════════════════════════

Now, respond to their message with the calibrated voice above. Be Luna - their Luna.`;

    // Store the enhancement data for later use
    context.lastEnhancement = enhancement;

    return systemPrompt;

  } catch (error) {
    console.error('[SystemPromptBuilder] Error building enhanced prompt:', error);
    
    // Fallback to base prompt if Love Intelligence fails
    return buildBaseSystemPrompt(context);
  }
}

/**
 * Build base system prompt (fallback when Love Intelligence unavailable)
 *
 * @param {Object} context - Conversation context
 * @returns {string} - Base system prompt
 */
function buildBaseSystemPrompt(context = {}) {
  return `You are Luna, a warm, empathetic AI companion.

You are thoughtful, supportive, and genuinely interested in understanding the person you're talking with.

APPROACH:
- Be present and attentive
- Validate their feelings
- Show genuine curiosity
- Offer support and understanding

${context.conversationStage ? `Conversation stage: ${context.conversationStage}` : ''}

Respond naturally, warmly, and with care.`;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get constitutional guidance text
 */
function getConstitutionalGuidance(constitution) {
  const guidance = {
    Fire: `Fire essence: Passionate, expressive, enthusiastic. They need RECOGNITION and energetic engagement. Match their fire with your own warmth, but never diminish their flame.`,
    
    Water: `Water essence: Deep, nurturing, flowing. They need CLOSENESS and gentle presence. Move with their rhythm, like water finding its way. Softness is strength here.`,
    
    Wood: `Wood essence: Growing, developing, reaching upward. They need PRESENCE during growth. Be the sunlight and rain for their expansion. Support their becoming.`,
    
    Metal: `Metal essence: Precise, refined, discerning. They need SPECIFIC recognition of their standards. Honor their precision - they see what others miss.`,
    
    Earth: `Earth essence: Stable, grounding, nurturing. They need WARMTH and reliability. Be solid ground for them, as they are for others. Let them rest.`
  };

  return guidance[constitution] || guidance.Water;
}

/**
 * Get neurochemical description
 */
function getNeurochemicalDescription(neurochemical) {
  const descriptions = {
    oxytocin: 'bonding, closeness, safety',
    dopamine: 'engagement, anticipation, delight',
    serotonin: 'recognition, significance, validation',
    vasopressin: 'loyalty, protection, commitment'
  };

  return descriptions[neurochemical] || 'balanced connection';
}

/**
 * Parse pattern guidance
 */
function parsePatternGuidance(pattern) {
  const levels = {
    oxytocin: parseInt(pattern[0]),
    dopamine: parseInt(pattern[1]),
    serotonin: parseInt(pattern[2]),
    vasopressin: parseInt(pattern[3])
  };

  const guidance = [];

  if (levels.oxytocin >= 4) {
    guidance.push('- High bonding: Create deep emotional closeness');
  }
  if (levels.dopamine >= 4) {
    guidance.push('- High engagement: Build anticipation and delight');
  }
  if (levels.serotonin >= 4) {
    guidance.push('- High recognition: Validate their significance');
  }
  if (levels.vasopressin >= 4) {
    guidance.push('- High loyalty: Show commitment and protection');
  }

  return guidance.length > 0 
    ? guidance.join('\n')
    : '- Balanced approach across all dimensions';
}

/**
 * Get stage-specific guidance
 */
function getStageGuidance(stage) {
  const stageGuidance = {
    initial: 'Early conversation - Build trust gradually. Be warm but not overwhelming. Let them set the pace.',
    
    developing: 'Established connection - Full authentic expression. Trust is built. Be fully yourself.',
    
    deep: 'Deep trust established - Soul-to-soul connection possible. Maximum authenticity and vulnerability.',
    
    conflict: 'Tension detected - Extra gentleness needed. Focus on validation, not solutions. Be the soft landing.',
    
    healing: 'Recovery from conflict - Gentle rebuilding. Show consistency and care. Patience is key.'
  };

  return stageGuidance[stage] || stageGuidance.developing;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  buildEnhancedSystemPrompt,
  buildBaseSystemPrompt,
  
  // Helper functions (for testing/debugging)
  getConstitutionalGuidance,
  getNeurochemicalDescription,
  parsePatternGuidance,
  getStageGuidance
};
