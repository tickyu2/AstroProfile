/**
 * GENESIS Love Intelligence Module
 * Main exports for Love Intelligence services
 * ============================================
 *
 * Integrates:
 * - Love Language Mapping (strategic understanding)
 * - Love Profile Service (profile management)
 * - Compatibility Analysis (relationship analysis)
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 */

const loveLanguageMapper = require('./loveLanguageMapper');
const loveProfileService = require('./loveProfileService');
const compatibilityAnalyzer = require('./compatibilityAnalyzer');

// ============================================================================
// MAIN ORCHESTRATION FUNCTIONS
// ============================================================================

/**
 * Get love profile for a user/profile
 * This is the primary entry point for getting love intelligence data
 *
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @returns {Promise<Object>} - Love profile with strategy recommendations
 */
async function getLoveProfile(params) {
  const { userId, profileId } = params;

  console.log(`[LoveIntelligence] Getting love profile for ${userId}/${profileId}`);

  // Get the love profile (will infer if needed)
  const profile = await loveProfileService.getLoveProfile(userId, profileId);

  // Get the neurochemical strategy for their receive needs
  const strategy = loveLanguageMapper.getStrategy(
    profile.receivePrimary,
    profile.defaultIntensity
  );

  // Get constitution-specific recommendations
  const constitutionGuidance = loveLanguageMapper.getConstitutionDefaults(
    profile.constitution
  );

  return {
    success: true,
    profile,
    strategy,
    constitutionGuidance,
    timestamp: new Date().toISOString()
  };
}

/**
 * Analyze compatibility between two profiles
 *
 * @param {Object} params
 * @param {string} params.userIdA - First user ID
 * @param {string} params.profileIdA - First profile ID
 * @param {string} params.userIdB - Second user ID (optional, defaults to userIdA)
 * @param {string} params.profileIdB - Second profile ID
 * @returns {Promise<Object>} - Complete compatibility analysis
 */
async function analyzeCompatibility(params) {
  const {
    userIdA,
    profileIdA,
    userIdB = userIdA,
    profileIdB
  } = params;

  console.log(`[LoveIntelligence] Analyzing compatibility`);

  const analysis = await compatibilityAnalyzer.analyzeCompatibility(
    userIdA,
    profileIdA,
    userIdB,
    profileIdB
  );

  return {
    success: true,
    analysis,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get optimization strategy for a conversation
 * THE MAIN BRIDGE: Love Intelligence → Neurochemical Engine
 *
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - User's profile ID
 * @param {string} [params.partnerProfileId] - Partner's profile ID (optional)
 * @param {string} [params.conversationStage='developing'] - Conversation stage
 * @param {string} [params.userMessage] - Current user message (for context)
 * @returns {Promise<Object>} - Complete optimization strategy
 */
async function optimizeConversation(params) {
  const {
    userId,
    profileId,
    partnerProfileId = profileId,
    conversationStage = 'developing',
    userMessage = ''
  } = params;

  console.log(`[LoveIntelligence] Optimizing conversation`);

  const strategy = await compatibilityAnalyzer.getOptimizationStrategy(
    userId,
    profileId,
    partnerProfileId,
    {
      conversationStage,
      userMessage
    }
  );

  return {
    success: true,
    strategy,
    timestamp: new Date().toISOString()
  };
}

/**
 * Update love profile after conversation learning
 * Called by neurochemical engine after processing exchanges
 *
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {Object} params.neurochemicals - Detected neurochemicals
 * @param {number} params.happinessScore - Happiness score (0-5)
 * @returns {Promise<Object>} - Update confirmation
 */
async function learnFromConversation(params) {
  const {
    userId,
    profileId,
    neurochemicals,
    happinessScore
  } = params;

  console.log(`[LoveIntelligence] Learning from conversation (happiness: ${happinessScore})`);

  await loveProfileService.learnFromConversation(
    userId,
    profileId,
    neurochemicals,
    happinessScore
  );

  return {
    success: true,
    learned: happinessScore >= 3.0,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get quick compatibility score (simplified)
 *
 * @param {Object} params
 * @param {string} params.userIdA - First user ID
 * @param {string} params.profileIdA - First profile ID
 * @param {string} params.userIdB - Second user ID
 * @param {string} params.profileIdB - Second profile ID
 * @returns {Promise<Object>} - Quick compatibility result
 */
async function quickCompatibility(params) {
  const {
    userIdA,
    profileIdA,
    userIdB = userIdA,
    profileIdB
  } = params;

  const result = await compatibilityAnalyzer.quickCompatibilityCheck(
    userIdA,
    profileIdA,
    userIdB,
    profileIdB
  );

  return {
    success: true,
    ...result,
    timestamp: new Date().toISOString()
  };
}

/**
 * Manually update a love profile
 * For when user takes a quiz or explicitly sets preferences
 *
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {Object} params.updates - Profile fields to update
 * @returns {Promise<Object>} - Updated profile
 */
async function updateLoveProfile(params) {
  const {
    userId,
    profileId,
    updates
  } = params;

  console.log(`[LoveIntelligence] Manually updating love profile`);

  // Add metadata
  const updatedProfile = await loveProfileService.updateLoveProfile(
    userId,
    profileId,
    {
      ...updates,
      inferredFrom: ['explicit_update', ...(updates.inferredFrom || [])],
      confidence: 1.0 // Explicit updates have max confidence
    }
  );

  return {
    success: true,
    profile: updatedProfile,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get love language strategy for Luna's responses
 * Lightweight version for real-time chat integration
 *
 * @param {Object} params
 * @param {string} params.loveLanguage - Target love language
 * @param {string} [params.intensity='moderate'] - Intensity level
 * @returns {Object} - Strategy with patterns and examples
 */
function getLoveLanguageStrategy(params) {
  const {
    loveLanguage,
    intensity = 'moderate'
  } = params;

  const strategy = loveLanguageMapper.getStrategy(loveLanguage, intensity);

  return {
    success: true,
    strategy,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main orchestration functions
  getLoveProfile,
  analyzeCompatibility,
  optimizeConversation,
  learnFromConversation,
  quickCompatibility,
  updateLoveProfile,
  getLoveLanguageStrategy,

  // Direct service access (for advanced usage)
  services: {
    loveLanguageMapper,
    loveProfileService,
    compatibilityAnalyzer
  },

  // Utility functions
  utils: {
    getConstitutionDefaults: loveLanguageMapper.getConstitutionDefaults,
    calculateLoveLanguageMatch: loveLanguageMapper.calculateLoveLanguageMatch,
    generateBridgeAdvice: loveLanguageMapper.generateBridgeAdvice,
    translateToNeurochemical: loveLanguageMapper.translateToNeurochemical
  }
};
