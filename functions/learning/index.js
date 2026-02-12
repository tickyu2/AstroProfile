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
const PatternAggregator = require('./patternAggregator');
const PatternRecorder = require('./patternRecorder');
const RecommendationEngine = require('./recommendationEngine');
const ResponseDetector = require('./responseDetector');

// NeuralNetworkModel and HybridRecommender are lazy-loaded to avoid pulling
// @tensorflow/tfjs (~50 MB) on every cold start. No deployed route uses them —
// they are only consumed by test files and offline training pipelines.
let _NeuralNetworkModel = null;
let _HybridRecommender = null;
let _hybridRecommender = null;

// Singleton instances
const effectivenessCalculator = new EffectivenessCalculator();
const patternAggregator = new PatternAggregator();
const patternRecorder = new PatternRecorder();
const recommendationEngine = new RecommendationEngine();
const responseDetector = new ResponseDetector();

module.exports = {
  // Classes
  EffectivenessCalculator,
  get HybridRecommender() {
    if (!_HybridRecommender) _HybridRecommender = require('./hybridRecommender');
    return _HybridRecommender;
  },
  get NeuralNetworkModel() {
    if (!_NeuralNetworkModel) _NeuralNetworkModel = require('./neuralNetworkModel');
    return _NeuralNetworkModel;
  },
  PatternAggregator,
  PatternRecorder,
  RecommendationEngine,
  ResponseDetector,

  // Singleton instances
  effectivenessCalculator,
  get hybridRecommender() {
    if (!_hybridRecommender) {
      const HR = require('./hybridRecommender');
      _hybridRecommender = new HR();
    }
    return _hybridRecommender;
  },
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
  getHybridRecommendation: (userId, context) => {
    if (!_hybridRecommender) {
      const HR = require('./hybridRecommender');
      _hybridRecommender = new HR();
    }
    return _hybridRecommender.recommend(userId, context);
  }
};
