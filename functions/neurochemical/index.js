/**
 * GENESIS Neurochemical Love Engine
 * Module Index
 * ================================
 *
 * Central export point for all Neurochemical Engine services.
 *
 * Components:
 * - HappinessCalculator: Calculates happiness from neurochemical levels
 * - EffectivenessTracker: Measures how well patterns are working
 * - NeurochemicalDetector: Detects neurochemical activation from user text
 * - PatternSelector: Selects optimal patterns for Luna's responses
 * - AnchorManager: Manages high-happiness anchor memories
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 * When things can be measured, they can be mathematically improved.
 */

const happinessCalculator = require('./happinessCalculator');
const effectivenessTracker = require('./effectivenessTracker');
const neurochemicalDetector = require('./neurochemicalDetector');
const patternSelector = require('./patternSelector');
const anchorManager = require('./anchorManager');

// ============================================================================
// ORCHESTRATION: Complete Conversation Processing
// ============================================================================

/**
 * Process a complete conversation exchange through the Neurochemical Engine
 *
 * This is the main integration point that:
 * 1. Detects neurochemicals from user response
 * 2. Calculates happiness score
 * 3. Measures effectiveness of protocol used
 * 4. Creates anchor if warranted
 * 5. Updates pattern statistics
 *
 * @param {Object} params - Processing parameters
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} params.userMessage - User's response message
 * @param {Object} params.protocolUsed - Luna's output levels (1-5 each)
 * @param {string} params.constitution - User's BaZi constitution
 * @param {string} params.relationshipStage - Current relationship stage
 * @param {string} [params.timelineId] - ID of conversation timeline record
 * @returns {Promise<Object>} - Complete processing result
 */
async function processConversationExchange(params) {
  const {
    userId,
    profileId,
    userMessage,
    protocolUsed,
    constitution,
    relationshipStage = 'building',
    timelineId = null
  } = params;

  console.log(`[NeurochemicalEngine] Processing exchange for user ${userId}`);

  // Step 1: Detect neurochemicals from user's response
  const detection = await neurochemicalDetector.detectNeurochemicals(
    userMessage,
    protocolUsed,
    { constitution, relationshipStage }
  );

  // Step 2: Calculate happiness score
  const happiness = happinessCalculator.calculateHappiness(
    detection,
    constitution
  );

  // Step 3: Calculate expected happiness from protocol
  const expectedHappiness = happinessCalculator.calculateExpectedHappiness(
    protocolUsed,
    constitution
  );

  // Step 4: Measure effectiveness
  const effectiveness = effectivenessTracker.calculateEffectiveness(
    protocolUsed,
    detection,
    expectedHappiness,
    happiness.score
  );

  // Step 5: Evaluate for anchor
  const anchorEval = anchorManager.evaluateForAnchor({
    happinessScore: happiness.score,
    neurochemicals: detection,
    primaryDriver: happiness.primaryDriver
  });

  // Step 6: Create anchor if warranted
  let anchorCreated = null;
  if (anchorEval.isAnchorWorthy && timelineId) {
    try {
      anchorCreated = await anchorManager.createAnchor({
        userId,
        profileId,
        timelineId,
        memoryContent: userMessage.slice(0, 500), // Truncate for storage
        happinessScore: happiness.score,
        anchorStrength: anchorEval.anchorStrength,
        compoundsOnRetrieval: anchorEval.compoundsOnRetrieval,
        primaryDriver: happiness.primaryDriver
      });
    } catch (error) {
      console.error('[NeurochemicalEngine] Anchor creation failed:', error);
    }
  }

  // Step 7: Determine if this is a breakthrough
  const isBreakthrough = effectivenessTracker.isBreakthrough(
    happiness.score,
    effectiveness.effectiveness
  );

  // Build result
  const result = {
    // Detection
    neurochemicals: {
      oxytocin: detection.oxytocin,
      dopamine: detection.dopamine,
      serotonin: detection.serotonin,
      vasopressin: detection.vasopressin,
      confidence: detection.confidence
    },

    // Happiness
    happiness: {
      score: happiness.score,
      level: happiness.level,
      driver: happiness.primaryDriver,
      breakdown: happiness.breakdown
    },

    // Effectiveness
    effectiveness: {
      score: effectiveness.effectiveness,
      accuracy: effectiveness.accuracy,
      protocolMatch: effectiveness.protocolMatch,
      variance: effectiveness.variance,
      interpretation: effectiveness.interpretation,
      recommendation: effectiveness.recommendation
    },

    // Anchor
    anchor: {
      created: !!anchorCreated,
      isAnchorWorthy: anchorEval.isAnchorWorthy,
      strength: anchorEval.anchorStrength,
      compoundsOnRetrieval: anchorEval.compoundsOnRetrieval
    },

    // Protocol used (for reference)
    protocolUsed: {
      pattern: patternSelector.encodePattern(protocolUsed),
      levels: protocolUsed
    },

    // Meta
    isBreakthrough,
    constitution,
    relationshipStage,
    timestamp: new Date().toISOString()
  };

  console.log(`[NeurochemicalEngine] Result: Happiness ${happiness.score}, Effectiveness ${effectiveness.effectiveness}`);

  return result;
}

/**
 * Get pattern recommendation for next Luna response
 *
 * @param {Object} params - Selection parameters
 * @returns {Promise<Object>} - Recommended pattern
 */
async function getPatternRecommendation(params) {
  return patternSelector.selectPattern(params);
}

/**
 * Get relevant anchor memories for context
 *
 * @param {Object} params - Retrieval parameters
 * @returns {Promise<Array>} - Anchor memories
 */
async function getRelevantAnchors(params) {
  return anchorManager.retrieveAnchors(params);
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Orchestration
  processConversationExchange,
  getPatternRecommendation,
  getRelevantAnchors,

  // Individual services
  happinessCalculator,
  effectivenessTracker,
  neurochemicalDetector,
  patternSelector,
  anchorManager
};
