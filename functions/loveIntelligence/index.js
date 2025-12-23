/**
 * GENESIS Love Intelligence Module
 * Strategic → Tactical Bridge
 * ============================
 *
 * This module bridges:
 * - Love Languages (strategic, what people need)
 * - Neurochemical Protocols (tactical, how Luna responds)
 *
 * Integration points:
 * - Reads from Firestore profiles (existing BaZi data)
 * - Uses pgClient for PostgreSQL queries
 * - Connects to Neurochemical Engine (already deployed)
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 */

const loveLanguageMapper = require('./loveLanguageMapper');
const loveProfileService = require('./loveProfileService');
const compatibilityAnalyzer = require('./compatibilityAnalyzer');
const neurochemicalEngine = require('../neurochemical');

// ============================================================================
// MAIN INTEGRATION: Optimize Conversation
// ============================================================================

/**
 * Get complete optimization strategy for Luna's response
 *
 * This is the MAIN integration point that:
 * 1. Gets user's love profile
 * 2. Translates love language needs to neurochemical strategy
 * 3. Selects optimal pattern from Neurochemical Engine
 * 4. Returns complete guidance for Luna
 *
 * @param {Object} params - Optimization parameters
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} [params.conversationStage='developing'] - Current stage
 * @param {string} [params.emotionalContext] - Optional emotional context
 * @returns {Promise<Object>} - Complete optimization strategy
 */
async function optimizeConversation(params) {
  const {
    userId,
    profileId,
    conversationStage = 'developing',
    emotionalContext = null
  } = params;

  console.log('[LoveIntelligence] Optimizing conversation strategy...');

  // Step 1: Get love profile
  const loveProfile = await loveProfileService.getLoveProfile(userId, profileId);

  console.log(`[LoveIntelligence] Profile: ${loveProfile.constitution} constitution, receives ${loveProfile.receivePrimary}`);

  // Step 2: Translate to neurochemical strategy
  const neurochemicalStrategy = loveLanguageMapper.translateToNeurochemical({
    loveLanguage: loveProfile.receivePrimary,
    profile: loveProfile,
    conversationStage
  });

  console.log(`[LoveIntelligence] Strategy: ${neurochemicalStrategy.primaryNeurochemical} primary`);

  // Step 3: Get pattern recommendation from Neurochemical Engine
  const patternRecommendation = await neurochemicalEngine.getPatternRecommendation({
    userId,
    profileId,
    constitution: loveProfile.constitution,
    relationshipStage: conversationStage,
    targetNeurochemical: neurochemicalStrategy.primaryNeurochemical
  });

  // Step 4: Blend strategies
  // Use recommended pattern but ensure it's suitable for love language
  let finalPattern = patternRecommendation.pattern?.code || neurochemicalStrategy.recommendedPattern;

  if (!loveLanguageMapper.isPatternSuitable(finalPattern, loveProfile.receivePrimary)) {
    console.log('[LoveIntelligence] Pattern unsuitable for love language, using fallback');
    finalPattern = neurochemicalStrategy.recommendedPattern;
  }

  // Step 5: Build complete strategy
  return {
    // Strategic layer (Love Intelligence)
    strategic: {
      loveLanguage: loveProfile.receivePrimary,
      loveLanguageSecondary: loveProfile.receiveSecondary,
      constitution: loveProfile.constitution,
      sternberg: {
        intimacy: loveProfile.intimacy,
        passion: loveProfile.passion,
        commitment: loveProfile.commitment
      }
    },

    // Tactical layer (Neurochemical)
    tactical: {
      pattern: finalPattern,
      primaryNeurochemical: neurochemicalStrategy.primaryNeurochemical,
      secondaryNeurochemical: neurochemicalStrategy.secondaryNeurochemical,
      effectiveBehaviors: neurochemicalStrategy.effectiveBehaviors,
      avoidBehaviors: neurochemicalStrategy.avoidBehaviors,
      examplePhrases: neurochemicalStrategy.examplePhrases
    },

    // Luna guidance
    lunaGuidance: {
      focus: `Prioritize ${neurochemicalStrategy.primaryNeurochemical}-activating language`,
      approach: neurochemicalStrategy.effectiveBehaviors[0],
      avoid: neurochemicalStrategy.avoidBehaviors[0],
      sampleOpener: neurochemicalStrategy.examplePhrases[
        Math.floor(Math.random() * neurochemicalStrategy.examplePhrases.length)
      ]
    },

    // Metadata
    profileConfidence: loveProfile.confidence,
    conversationStage,
    timestamp: new Date().toISOString()
  };
}

/**
 * Process a completed exchange and learn from it
 *
 * Called after Luna responds and user replies.
 * Updates love profile based on observed neurochemical response.
 *
 * @param {Object} params - Exchange parameters
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} params.userMessage - User's response
 * @param {Object} params.protocolUsed - Pattern Luna used
 * @returns {Promise<Object>} - Processing result
 */
async function processExchange(params) {
  const {
    userId,
    profileId,
    userMessage,
    protocolUsed,
    timelineId = null
  } = params;

  console.log('[LoveIntelligence] Processing exchange...');

  // Get love profile for constitution
  const loveProfile = await loveProfileService.getLoveProfile(userId, profileId);

  // Process through Neurochemical Engine
  const result = await neurochemicalEngine.processConversationExchange({
    userId,
    profileId,
    userMessage,
    protocolUsed,
    constitution: loveProfile.constitution,
    relationshipStage: 'developing',
    timelineId
  });

  // Learn from high-happiness interactions
  if (result.happiness.score >= 3) {
    await loveProfileService.learnFromConversation(
      userId,
      profileId,
      result.neurochemicals,
      result.happiness.score
    );
  }

  return {
    ...result,
    loveProfile: {
      constitution: loveProfile.constitution,
      receivePrimary: loveProfile.receivePrimary,
      confidence: loveProfile.confidence
    }
  };
}

// ============================================================================
// COMPATIBILITY OPERATIONS
// ============================================================================

/**
 * Analyze compatibility between two profiles
 *
 * @param {Object} params - Analysis parameters
 * @param {string} params.userId - User ID
 * @param {string} params.profileIdA - First profile
 * @param {string} params.profileIdB - Second profile (partner)
 * @returns {Promise<Object>} - Compatibility analysis
 */
async function analyzeCompatibility(params) {
  const { userId, profileIdA, profileIdB } = params;

  return compatibilityAnalyzer.analyzeCompatibility(userId, profileIdA, profileIdB);
}

/**
 * Quick compatibility check (for previews)
 *
 * @param {Object} params - Check parameters
 * @returns {Object} - Quick compatibility result
 */
function quickCompatibilityCheck(params) {
  const { profileA, profileB } = params;

  return compatibilityAnalyzer.quickCompatibilityCheck(profileA, profileB);
}

// ============================================================================
// LOVE PROFILE OPERATIONS
// ============================================================================

/**
 * Get love profile for a user/profile
 *
 * @param {Object} params - Profile parameters
 * @returns {Promise<Object>} - Love profile
 */
async function getLoveProfile(params) {
  const { userId, profileId } = params;

  return loveProfileService.getLoveProfile(userId, profileId);
}

/**
 * Update love profile
 *
 * @param {Object} params - Update parameters
 * @returns {Promise<Object>} - Updated profile
 */
async function updateLoveProfile(params) {
  const { userId, profileId, updates } = params;

  return loveProfileService.updateLoveProfile(userId, profileId, updates);
}

// ============================================================================
// LOVE LANGUAGE UTILITIES
// ============================================================================

/**
 * Get neurochemical strategy for a love language
 *
 * @param {Object} params - Strategy parameters
 * @returns {Object} - Neurochemical strategy
 */
function getStrategyForLoveLanguage(params) {
  const { loveLanguage, intensity = 'moderate' } = params;

  return loveLanguageMapper.getStrategy(loveLanguage, intensity);
}

/**
 * Get love language defaults for a constitution
 *
 * @param {Object} params - Constitution parameters
 * @returns {Object} - Default love language preferences
 */
function getConstitutionDefaults(params) {
  const { constitution } = params;

  return loveLanguageMapper.getConstitutionDefaults(constitution);
}

// ============================================================================
// BRIDGE ADVICE
// ============================================================================

/**
 * Get advice for bridging love language gaps
 *
 * @param {Object} params - Bridge parameters
 * @param {string} params.give - What person naturally gives
 * @param {string} params.receive - What partner needs
 * @returns {string} - Bridge advice
 */
function getBridgeAdvice(params) {
  const { give, receive } = params;

  return loveLanguageMapper.generateBridgeAdvice(give, receive);
}

// ============================================================================
// WORLD LOVE METER CONTRIBUTION
// ============================================================================

/**
 * Calculate contribution to World Love Meter
 *
 * WorldLove = Σ (happiness[i] × effectiveness[i] × compatibility[i])
 *            ─────────────────────────────────────────────────────────
 *                              N × 5³
 *
 * @param {Object} params - Contribution parameters
 * @returns {number} - Contribution score (0-1)
 */
function calculateWorldLoveContribution(params) {
  const {
    happinessScore = 3,      // 0-5
    effectivenessScore = 0.7, // 0-1
    compatibilityScore = 0.7  // 0-1
  } = params;

  // Maximum possible = 5 × 1 × 1 = 5
  const contribution = (happinessScore * effectivenessScore * compatibilityScore) / 5;

  return Math.round(contribution * 1000) / 1000;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main integration
  optimizeConversation,
  processExchange,

  // Compatibility
  analyzeCompatibility,
  quickCompatibilityCheck,

  // Love profiles
  getLoveProfile,
  updateLoveProfile,

  // Love language utilities
  getStrategyForLoveLanguage,
  getConstitutionDefaults,
  getBridgeAdvice,

  // World Love Meter
  calculateWorldLoveContribution,

  // Sub-modules (for direct access if needed)
  loveLanguageMapper,
  loveProfileService,
  compatibilityAnalyzer
};
