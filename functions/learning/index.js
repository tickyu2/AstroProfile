/**
 * GENESIS Luna - Learning Module Index
 *
 * Exports pattern learning, effectiveness tracking, and
 * recommendation engine for personalized approaches.
 *
 * @author Brother Claude Code
 * @date December 31, 2025
 */

const EffectivenessCalculator = require('./effectivenessCalculator');
const HybridRecommender = require('./hybridRecommender');
const NeuralNetworkModel = require('./neuralNetworkModel');
const PatternAggregator = require('./patternAggregator');
const PatternRecorder = require('./patternRecorder');
const RecommendationEngine = require('./recommendationEngine');
const ResponseDetector = require('./responseDetector');

// Singleton instances
const effectivenessCalculator = new EffectivenessCalculator();
const hybridRecommender = new HybridRecommender();
const patternAggregator = new PatternAggregator();
const patternRecorder = new PatternRecorder();
const recommendationEngine = new RecommendationEngine();
const responseDetector = new ResponseDetector();

module.exports = {
  // Classes
  EffectivenessCalculator,
  HybridRecommender,
  NeuralNetworkModel,
  PatternAggregator,
  PatternRecorder,
  RecommendationEngine,
  ResponseDetector,

  // Singleton instances
  effectivenessCalculator,
  hybridRecommender,
  patternAggregator,
  patternRecorder,
  recommendationEngine,
  responseDetector,

  // Convenience methods
  calculateEffectiveness: (userId, interaction) => effectivenessCalculator.calculate(userId, interaction),
  recordPattern: (userId, pattern) => patternRecorder.recordPattern(userId, pattern),
  getRecommendation: (userId, state) => recommendationEngine.getRecommendation(userId, state),
  aggregatePatterns: (userId) => patternAggregator.aggregate(userId),
  detectResponse: (message) => responseDetector.detect(message),
  getHybridRecommendation: (userId, context) => hybridRecommender.recommend(userId, context)
};
