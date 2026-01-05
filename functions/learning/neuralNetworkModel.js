/**
 * ============================================================================
 * NEURAL NETWORK MODEL
 * ============================================================================
 * TensorFlow.js neural network for approach prediction.
 * Learns from effectiveness feedback to predict best healing approaches.
 *
 * Architecture:
 *   Input:  50D user state vector
 *   Hidden: 128 → 64 → 32 neurons (ReLU + Dropout)
 *   Output: 15D approach probabilities (Softmax)
 *
 * Created: December 31, 2025
 * Week 8: Neural Networks - Phase 2 Week 4
 * ============================================================================
 */

const tf = require('@tensorflow/tfjs');
const fs = require('fs').promises;
const path = require('path');

class NeuralNetworkModel {

  constructor() {
    this.model = null;
    this.modelPath = path.join(__dirname, '../models/luna-neural');

    // Approach types (15 total)
    this.approaches = [
      '3-stack',
      'achievement',
      'connection',
      'delight',
      'achievement-connection',
      'achievement-delight',
      'connection-delight',
      'advice',
      'question',
      'validation',
      'reframe',
      'breathing',
      'grounding',
      'future-self',
      'gratitude'
    ];

    this.isTraining = false;
    this.trainingHistory = [];
  }

  /**
   * Create neural network architecture
   * 50D input → hidden layers → 15D output
   */
  createModel() {
    const model = tf.sequential();

    // Input layer: 50D user state vector
    model.add(tf.layers.dense({
      inputShape: [50],
      units: 128,
      activation: 'relu',
      kernelInitializer: 'heNormal',
      name: 'input_layer'
    }));

    // Dropout for regularization
    model.add(tf.layers.dropout({
      rate: 0.3,
      name: 'dropout_1'
    }));

    // Hidden layer 1
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      kernelInitializer: 'heNormal',
      name: 'hidden_layer_1'
    }));

    // Dropout
    model.add(tf.layers.dropout({
      rate: 0.2,
      name: 'dropout_2'
    }));

    // Hidden layer 2
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      kernelInitializer: 'heNormal',
      name: 'hidden_layer_2'
    }));

    // Output layer: 15D approach probabilities
    model.add(tf.layers.dense({
      units: 15,
      activation: 'softmax',
      name: 'output_layer'
    }));

    // Compile model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    this.model = model;

    console.log('[NeuralNetwork] Model created: 50D → 128 → 64 → 32 → 15D');

    return model;
  }

  /**
   * Train model on effectiveness data
   * @param {Array} trainingData - Training samples
   * @param {Array} validationData - Validation samples
   * @param {number} epochs - Number of training epochs
   */
  async trainModel(trainingData, validationData = null, epochs = 50) {
    if (!this.model) {
      this.createModel();
    }

    if (this.isTraining) {
      console.log('[NeuralNetwork] Model is already training');
      return null;
    }

    this.isTraining = true;

    try {
      console.log(`\n[NeuralNetwork] Starting training: ${trainingData.length} samples, ${epochs} epochs\n`);

      // Prepare tensors
      const xTrain = tf.tensor2d(trainingData.map(d => d.stateVector));
      const yTrain = tf.tensor2d(trainingData.map(d => d.approachOneHot));

      let xVal, yVal;
      if (validationData && validationData.length > 0) {
        xVal = tf.tensor2d(validationData.map(d => d.stateVector));
        yVal = tf.tensor2d(validationData.map(d => d.approachOneHot));
      }

      // Training configuration
      const config = {
        epochs: epochs,
        batchSize: 32,
        validationData: validationData && validationData.length > 0 ? [xVal, yVal] : null,
        shuffle: true,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            const logMsg =
              `Epoch ${epoch + 1}/${epochs}: ` +
              `loss=${logs.loss.toFixed(4)}, ` +
              `acc=${logs.acc.toFixed(4)}` +
              (logs.val_loss ? `, val_loss=${logs.val_loss.toFixed(4)}, val_acc=${logs.val_acc.toFixed(4)}` : '');

            console.log(logMsg);

            this.trainingHistory.push({
              epoch: epoch + 1,
              loss: logs.loss,
              accuracy: logs.acc,
              val_loss: logs.val_loss || null,
              val_acc: logs.val_acc || null
            });
          }
        }
      };

      // Train
      const history = await this.model.fit(xTrain, yTrain, config);

      // Cleanup tensors
      xTrain.dispose();
      yTrain.dispose();
      if (xVal) xVal.dispose();
      if (yVal) yVal.dispose();

      console.log('\n[NeuralNetwork] Training complete!');

      // Save model
      await this.saveModel();

      this.isTraining = false;

      return history;

    } catch (error) {
      console.error('[NeuralNetwork] Training error:', error);
      this.isTraining = false;
      throw error;
    }
  }

  /**
   * Predict approach probabilities for a state vector
   * @param {Array} stateVector - 50D state vector
   * @returns {Object} Probabilities for each approach
   */
  async predict(stateVector) {
    if (!this.model) {
      // Try to load model
      const loaded = await this.loadModel();
      if (!loaded) {
        throw new Error('No model available. Train model first.');
      }
    }

    // Create tensor
    const inputTensor = tf.tensor2d([stateVector]);

    // Predict
    const prediction = this.model.predict(inputTensor);
    const probabilities = await prediction.data();

    // Cleanup
    inputTensor.dispose();
    prediction.dispose();

    // Convert to approach probabilities
    const result = {};
    this.approaches.forEach((approach, idx) => {
      result[approach] = probabilities[idx];
    });

    return result;
  }

  /**
   * Get top K approach predictions
   * @param {Array} stateVector - 50D state vector
   * @param {number} k - Number of top predictions
   * @returns {Array} Top K predictions with confidence
   */
  async predictTopK(stateVector, k = 3) {
    const probabilities = await this.predict(stateVector);

    // Sort by probability
    const sorted = Object.entries(probabilities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, k);

    return sorted.map(([approach, probability]) => ({
      approach: approach,
      probability: probability,
      confidence: this.probabilityToConfidence(probability)
    }));
  }

  /**
   * Convert probability to confidence label
   * @param {number} probability - Probability value (0-1)
   * @returns {string} Confidence label
   */
  probabilityToConfidence(probability) {
    if (probability >= 0.7) return 'HIGH';
    if (probability >= 0.4) return 'MODERATE';
    return 'LOW';
  }

  /**
   * Prepare training data from effectiveness records
   * @param {string} userId - Optional user ID filter
   * @returns {Array} Training data
   */
  async prepareTrainingData(userId = null) {
    try {
      const db = require('../config/genesisDatabase');

      // Get effectiveness records
      let query = `
        SELECT
          user_state_vector,
          approach_type,
          effectiveness,
          verdict
        FROM luna_approach_effectiveness
        WHERE effectiveness IS NOT NULL
      `;

      const params = [];
      if (userId) {
        query += ' AND user_id = $1';
        params.push(userId);
      }

      query += ' ORDER BY created_at DESC';

      const records = await db.query(query, params);

      if (records.rows.length === 0) {
        console.log('[NeuralNetwork] No training data available');
        return [];
      }

      console.log(`[NeuralNetwork] Preparing ${records.rows.length} training samples`);

      // Convert to training format
      const trainingData = records.rows.map(record => {
        // Parse state vector
        const stateVector = typeof record.user_state_vector === 'string'
          ? JSON.parse(record.user_state_vector)
          : record.user_state_vector;

        // Create one-hot encoding for approach
        const approachIdx = this.approaches.indexOf(record.approach_type);
        const approachOneHot = new Array(15).fill(0);

        if (approachIdx !== -1) {
          // Weight by effectiveness (0-1)
          approachOneHot[approachIdx] = record.effectiveness;
        }

        return {
          stateVector: stateVector,
          approachType: record.approach_type,
          approachOneHot: approachOneHot,
          effectiveness: record.effectiveness
        };
      });

      return trainingData;
    } catch (error) {
      console.log('[NeuralNetwork] Database not available:', error.message);
      return [];
    }
  }

  /**
   * Split data into training and validation sets
   * @param {Array} data - Full dataset
   * @param {number} validationSplit - Fraction for validation (0-1)
   * @returns {Object} Training and validation sets
   */
  splitData(data, validationSplit = 0.2) {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const splitIdx = Math.floor(data.length * (1 - validationSplit));

    return {
      training: shuffled.slice(0, splitIdx),
      validation: shuffled.slice(splitIdx)
    };
  }

  /**
   * Evaluate model performance
   * @param {Array} testData - Test dataset
   * @returns {Object} Loss and accuracy
   */
  async evaluate(testData) {
    if (!this.model) {
      throw new Error('No model loaded');
    }

    console.log(`\n[NeuralNetwork] Evaluating model on ${testData.length} samples\n`);

    const xTest = tf.tensor2d(testData.map(d => d.stateVector));
    const yTest = tf.tensor2d(testData.map(d => d.approachOneHot));

    const result = await this.model.evaluate(xTest, yTest);

    const loss = await result[0].data();
    const accuracy = await result[1].data();

    xTest.dispose();
    yTest.dispose();
    result[0].dispose();
    result[1].dispose();

    console.log(`Loss: ${loss[0].toFixed(4)}`);
    console.log(`Accuracy: ${accuracy[0].toFixed(4)}`);

    return {
      loss: loss[0],
      accuracy: accuracy[0]
    };
  }

  /**
   * Save model to disk
   * @returns {boolean} Success status
   */
  async saveModel() {
    if (!this.model) {
      throw new Error('No model to save');
    }

    try {
      // Ensure directory exists
      await fs.mkdir(this.modelPath, { recursive: true });

      // Save model using file:// protocol
      await this.model.save(`file://${this.modelPath}`);
      console.log(`[NeuralNetwork] Model saved to ${this.modelPath}`);

      // Save training history
      await fs.writeFile(
        path.join(this.modelPath, 'training_history.json'),
        JSON.stringify(this.trainingHistory, null, 2)
      );

      return true;
    } catch (error) {
      console.error('[NeuralNetwork] Error saving model:', error.message);
      // Save weights as JSON fallback
      try {
        const weights = [];
        for (const layer of this.model.layers) {
          const layerWeights = layer.getWeights();
          const weightData = await Promise.all(layerWeights.map(async w => ({
            shape: w.shape,
            data: Array.from(await w.data())
          })));
          weights.push(weightData);
        }
        await fs.writeFile(
          path.join(this.modelPath, 'weights.json'),
          JSON.stringify(weights, null, 2)
        );
        console.log('[NeuralNetwork] Weights saved as JSON fallback');
        return true;
      } catch (fallbackError) {
        console.error('[NeuralNetwork] Fallback save failed:', fallbackError.message);
        return false;
      }
    }
  }

  /**
   * Load model from disk
   * @returns {boolean} Success status
   */
  async loadModel() {
    try {
      const modelJsonPath = path.join(this.modelPath, 'model.json');

      // Check if model file exists
      await fs.access(modelJsonPath);

      this.model = await tf.loadLayersModel(`file://${modelJsonPath}`);

      console.log('[NeuralNetwork] Model loaded from disk');

      // Load training history
      try {
        const historyJson = await fs.readFile(
          path.join(this.modelPath, 'training_history.json'),
          'utf-8'
        );
        this.trainingHistory = JSON.parse(historyJson);
      } catch (err) {
        // History file doesn't exist yet
      }

      return true;
    } catch (error) {
      console.log('[NeuralNetwork] No saved model found');
      return false;
    }
  }

  /**
   * Get model info
   * @returns {Object} Model information
   */
  getModelInfo() {
    if (!this.model) {
      return { status: 'NOT_LOADED' };
    }

    return {
      status: 'LOADED',
      inputShape: [50],
      outputShape: [15],
      approaches: this.approaches,
      totalParams: this.model.countParams(),
      trainingHistory: this.trainingHistory
    };
  }

  /**
   * Get approach index from name
   * @param {string} approachName - Approach name
   * @returns {number} Index or -1 if not found
   */
  getApproachIndex(approachName) {
    return this.approaches.indexOf(approachName);
  }

  /**
   * Get approach name from index
   * @param {number} index - Approach index
   * @returns {string} Approach name
   */
  getApproachName(index) {
    return this.approaches[index] || 'unknown';
  }
}

module.exports = NeuralNetworkModel;
