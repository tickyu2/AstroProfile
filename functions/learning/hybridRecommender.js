/**
 * ============================================================================
 * HYBRID RECOMMENDER
 * ============================================================================
 * Combines neural network predictions with pattern-based wisdom.
 * Best of both worlds: trustworthy patterns + powerful neural predictions.
 *
 * Priority Logic:
 *   1. If both agree → HIGH confidence
 *   2. If pattern has HIGH confidence → Follow pattern
 *   3. If neural has HIGH probability → Follow neural
 *   4. Otherwise → Pattern primary, neural alternatives
 *
 * Created: December 31, 2025
 * Week 8: Neural Networks - Phase 2 Week 4
 * ============================================================================
 */

const NeuralNetworkModel = require('./neuralNetworkModel');
const RecommendationEngine = require('./recommendationEngine');
const PatternRecorder = require('./patternRecorder');

class HybridRecommender {

  constructor() {
    this.neuralModel = new NeuralNetworkModel();
    this.patternEngine = new RecommendationEngine();
    this.recorder = new PatternRecorder();
    this.initialized = false;
  }

  /**
   * Initialize the hybrid recommender
   * Attempts to load existing neural model
   */
  async initialize() {
    if (this.initialized) return;

    try {
      await this.neuralModel.loadModel();
    } catch (error) {
      console.log('[HybridRecommender] No existing neural model, will use patterns only initially');
    }

    this.initialized = true;
  }

  /**
   * Get hybrid recommendation (neural + patterns)
   * @param {string} userId - User ID
   * @param {Object} currentState - Current user state
   * @returns {Object} Combined recommendation
   */
  async getRecommendation(userId, currentState) {
    await this.initialize();

    // Get pattern-based recommendation
    const patternRec = await this.patternEngine.getRecommendation(userId, currentState);

    // Get neural network prediction
    let neuralPred = null;
    try {
      const stateVector = this.recorder.createStateVector(currentState);
      neuralPred = await this.neuralModel.predictTopK(stateVector, 5);
    } catch (error) {
      console.log('[HybridRecommender] Neural prediction unavailable:', error.message);
    }

    // Combine recommendations
    const combined = this.combineRecommendations(patternRec, neuralPred);

    return combined;
  }

  /**
   * Combine pattern and neural recommendations
   * @param {Object} patternRec - Pattern-based recommendation
   * @param {Array} neuralPred - Neural network predictions
   * @returns {Object} Combined recommendation
   */
  combineRecommendations(patternRec, neuralPred) {
    // Case 1: No neural prediction (model not trained yet)
    if (!neuralPred || neuralPred.length === 0) {
      return {
        primary: {
          approach: patternRec.recommendation || patternRec.fallback?.approach,
          source: 'pattern',
          confidence: patternRec.confidence || 'LOW',
          reason: patternRec.reason || patternRec.fallback?.reason || 'Default recommendation'
        },
        alternatives: [],
        explanation: 'Based on pattern wisdom (neural network not yet trained)',
        neuralAvailable: false
      };
    }

    // Case 2: Pattern and neural agree (highest confidence)
    const neuralTop = neuralPred[0];
    const patternApproach = patternRec.recommendation || patternRec.fallback?.approach;

    if (neuralTop.approach === patternApproach) {
      return {
        primary: {
          approach: neuralTop.approach,
          source: 'hybrid',
          confidence: 'HIGH',
          patternConfidence: patternRec.confidence,
          neuralProbability: neuralTop.probability,
          reason: 'Pattern wisdom and neural network both recommend this approach'
        },
        alternatives: neuralPred.slice(1, 3).map(pred => ({
          approach: pred.approach,
          neuralProbability: pred.probability,
          source: 'neural'
        })),
        explanation: 'High confidence: Both pattern analysis and neural network agree',
        neuralAvailable: true
      };
    }

    // Case 3: Pattern has high confidence, neural disagrees
    if (patternRec.confidence === 'HIGH') {
      return {
        primary: {
          approach: patternApproach,
          source: 'pattern',
          confidence: 'HIGH',
          reason: patternRec.reason
        },
        alternatives: [
          {
            approach: neuralTop.approach,
            neuralProbability: neuralTop.probability,
            source: 'neural',
            note: 'Neural network suggests this as alternative'
          }
        ],
        explanation: 'Following proven pattern (high confidence from past successes)',
        neuralAvailable: true
      };
    }

    // Case 4: Neural has high confidence, pattern low/moderate
    if (neuralTop.probability >= 0.7) {
      return {
        primary: {
          approach: neuralTop.approach,
          source: 'neural',
          confidence: neuralTop.confidence,
          neuralProbability: neuralTop.probability,
          reason: 'Neural network predicts this with high confidence'
        },
        alternatives: [
          {
            approach: patternApproach,
            source: 'pattern',
            patternConfidence: patternRec.confidence,
            note: 'Pattern-based fallback'
          }
        ],
        explanation: 'Following neural network prediction (high probability)',
        neuralAvailable: true
      };
    }

    // Case 5: Both have moderate confidence, use pattern with neural alternatives
    return {
      primary: {
        approach: patternApproach,
        source: 'pattern',
        confidence: patternRec.confidence || 'MODERATE',
        reason: patternRec.reason || 'Pattern-based recommendation'
      },
      alternatives: neuralPred.slice(0, 2).map(pred => ({
        approach: pred.approach,
        neuralProbability: pred.probability,
        source: 'neural'
      })),
      explanation: 'Following pattern wisdom with neural alternatives',
      neuralAvailable: true
    };
  }

  /**
   * Train neural network on latest data
   * @param {string} userId - Optional user ID filter
   * @param {number} epochs - Number of training epochs
   * @returns {Object} Training result
   */
  async trainNeuralNetwork(userId = null, epochs = 50) {
    console.log('\n[HybridRecommender] Training neural network...\n');

    // Prepare training data
    const data = await this.neuralModel.prepareTrainingData(userId);

    if (data.length < 10) {
      console.log('[HybridRecommender] Not enough data to train (need at least 10 samples)');
      return {
        success: false,
        reason: 'insufficient_data',
        samples: data.length,
        required: 10
      };
    }

    // Split into training and validation
    const split = this.neuralModel.splitData(data, 0.2);

    console.log(`Training samples: ${split.training.length}`);
    console.log(`Validation samples: ${split.validation.length}\n`);

    // Train
    const history = await this.neuralModel.trainModel(
      split.training,
      split.validation,
      epochs
    );

    return {
      success: true,
      samples: data.length,
      trainingSize: split.training.length,
      validationSize: split.validation.length,
      epochs: epochs,
      history: this.neuralModel.trainingHistory
    };
  }

  /**
   * Get model status and info
   * @returns {Object} Model information
   */
  getModelStatus() {
    const neuralInfo = this.neuralModel.getModelInfo();

    return {
      neural: neuralInfo,
      hybrid: {
        initialized: this.initialized,
        neuralAvailable: neuralInfo.status === 'LOADED',
        patternAvailable: true
      }
    };
  }

  /**
   * Get detailed breakdown of recommendation reasoning
   * @param {string} userId - User ID
   * @param {Object} currentState - Current user state
   * @returns {Object} Detailed breakdown
   */
  async getRecommendationBreakdown(userId, currentState) {
    await this.initialize();

    const recommendation = await this.getRecommendation(userId, currentState);
    const stateVector = this.recorder.createStateVector(currentState);

    const breakdown = {
      recommendation: recommendation,
      stateVector: {
        dimensions: 50,
        emotions: stateVector.slice(0, 8),
        elements: stateVector.slice(8, 13),
        bathtub: stateVector.slice(13, 17),
        temporal: {
          dayOfWeek: stateVector.slice(17, 24),
          hourOfDay: stateVector.slice(24, 48)
        }
      }
    };

    // Add neural predictions if available
    if (recommendation.neuralAvailable) {
      try {
        const allPredictions = await this.neuralModel.predict(stateVector);
        breakdown.neuralPredictions = Object.entries(allPredictions)
          .sort((a, b) => b[1] - a[1])
          .map(([approach, probability]) => ({
            approach,
            probability: (probability * 100).toFixed(1) + '%'
          }));
      } catch (error) {
        breakdown.neuralPredictions = null;
      }
    }

    return breakdown;
  }

  /**
   * Evaluate hybrid system performance
   * @param {Array} testData - Test effectiveness records
   * @returns {Object} Performance metrics
   */
  async evaluatePerformance(testData) {
    if (testData.length === 0) {
      return { error: 'No test data provided' };
    }

    let correctPredictions = 0;
    let totalPredictions = 0;

    for (const record of testData) {
      try {
        const stateVector = typeof record.user_state_vector === 'string'
          ? JSON.parse(record.user_state_vector)
          : record.user_state_vector;

        const predictions = await this.neuralModel.predictTopK(stateVector, 3);
        const topApproaches = predictions.map(p => p.approach);

        if (topApproaches.includes(record.approach_type)) {
          correctPredictions++;
        }
        totalPredictions++;
      } catch (error) {
        // Skip records that fail
      }
    }

    return {
      total: totalPredictions,
      correct: correctPredictions,
      accuracy: totalPredictions > 0 ? (correctPredictions / totalPredictions) : 0,
      top3Accuracy: totalPredictions > 0 ? (correctPredictions / totalPredictions * 100).toFixed(1) + '%' : '0%'
    };
  }
}

module.exports = HybridRecommender;
