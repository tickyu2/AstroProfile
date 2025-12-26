/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SER INFERENCE - Speech Emotion Recognition Model
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Runs emotion classification on audio features.
 *
 * Two modes:
 * 1. ONNX Model (when model.onnx is available) - ML-based inference
 * 2. Enhanced Heuristics (fallback) - Feature-based rules
 *
 * Emotion Categories (7):
 * - neutral, happy, sad, angry, anxious, surprised, disgusted
 *
 * Created: December 21, 2025
 */

import * as ort from 'onnxruntime-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractAudioFeatures, flattenFeatures } from './audioFeatures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration
 */
const CONFIG = {
  modelPath: path.join(__dirname, 'model.onnx'),
  emotions: ['neutral', 'happy', 'sad', 'angry', 'anxious', 'surprised', 'disgusted'],
  confidenceThreshold: 0.3,  // Minimum confidence to report emotion
  useOnnx: true              // Try ONNX first, fallback to heuristics
};

/**
 * ONNX session (lazy loaded)
 */
let onnxSession = null;
let onnxAvailable = false;

/**
 * Initialize ONNX model if available
 */
export async function initSER() {
  if (!CONFIG.useOnnx) {
    console.log('[SER] ONNX disabled, using enhanced heuristics');
    return { mode: 'heuristic' };
  }

  try {
    if (fs.existsSync(CONFIG.modelPath)) {
      console.log('[SER] Loading ONNX model...');
      onnxSession = await ort.InferenceSession.create(CONFIG.modelPath);
      onnxAvailable = true;
      console.log('[SER] ONNX model loaded successfully');
      return { mode: 'onnx', model: CONFIG.modelPath };
    } else {
      console.log('[SER] No ONNX model found, using enhanced heuristics');
      console.log(`      To use ML model, place model.onnx in: ${__dirname}`);
      return { mode: 'heuristic' };
    }
  } catch (error) {
    console.error('[SER] Failed to load ONNX model:', error.message);
    console.log('[SER] Falling back to enhanced heuristics');
    return { mode: 'heuristic', error: error.message };
  }
}

/**
 * Run SER on audio buffer
 *
 * @param {Buffer|Float32Array} audioData - Raw audio data
 * @returns {Promise<Object>} - { primary, secondary, confidence, probabilities }
 */
export async function runSER(audioData) {
  const startTime = Date.now();

  try {
    // Extract acoustic features
    const features = extractAudioFeatures(audioData);
    const featureVector = flattenFeatures(features);

    let result;

    // Try ONNX model first
    if (onnxAvailable && onnxSession) {
      result = await runOnnxInference(featureVector);
    } else {
      // Use enhanced heuristics
      result = runHeuristicClassifier(features);
    }

    result.duration = Date.now() - startTime;
    result.mode = onnxAvailable ? 'onnx' : 'heuristic';

    return result;

  } catch (error) {
    console.error('[SER] Inference error:', error.message);
    return {
      primary: 'neutral',
      secondary: '',
      confidence: 0.5,
      error: error.message,
      duration: Date.now() - startTime,
      mode: 'fallback'
    };
  }
}

/**
 * Run ONNX model inference
 *
 * @param {Float32Array} featureVector - Flattened features (36 values)
 * @returns {Object} - Classification result
 */
async function runOnnxInference(featureVector) {
  // Create input tensor
  const tensor = new ort.Tensor('float32', featureVector, [1, featureVector.length]);

  // Run inference
  const results = await onnxSession.run({ input: tensor });

  // Get output probabilities
  const output = results.output.data;

  // Find top emotions
  const probabilities = {};
  let maxIndex = 0;
  let maxProb = 0;

  for (let i = 0; i < CONFIG.emotions.length; i++) {
    probabilities[CONFIG.emotions[i]] = output[i];
    if (output[i] > maxProb) {
      maxProb = output[i];
      maxIndex = i;
    }
  }

  // Find secondary emotion
  let secondaryIndex = -1;
  let secondaryProb = 0;
  for (let i = 0; i < output.length; i++) {
    if (i !== maxIndex && output[i] > secondaryProb) {
      secondaryProb = output[i];
      secondaryIndex = i;
    }
  }

  return {
    primary: CONFIG.emotions[maxIndex],
    secondary: secondaryProb > 0.2 ? CONFIG.emotions[secondaryIndex] : '',
    confidence: maxProb,
    probabilities
  };
}

/**
 * Enhanced heuristic classifier using MFCC features
 * Better than simple energy/pitch thresholds
 *
 * @param {Object} features - Extracted audio features
 * @returns {Object} - Classification result
 */
function runHeuristicClassifier(features) {
  const {
    mfcc_mean,
    mfcc_std,
    rms_mean,
    rms_std,
    zcr_mean,
    zcr_std,
    spectralCentroid_mean,
    spectralFlatness_mean,
    energy_mean,
    energy_std
  } = features;

  // Initialize scores for each emotion
  const scores = {
    neutral: 0.5,
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    surprised: 0,
    disgusted: 0
  };

  // Feature-based scoring rules
  // Based on acoustic correlates of emotions from speech research

  // ─────────────────────────────────────────────────────────────────
  // ENERGY / LOUDNESS
  // High energy: happy, angry, surprised
  // Low energy: sad, neutral
  // ─────────────────────────────────────────────────────────────────
  if (energy_mean > 0.1) {
    scores.happy += 0.3;
    scores.angry += 0.3;
    scores.surprised += 0.2;
  } else if (energy_mean < 0.02) {
    scores.sad += 0.3;
    scores.neutral += 0.2;
  }

  // Energy variability (high std = expressive)
  if (energy_std > 0.05) {
    scores.happy += 0.2;
    scores.surprised += 0.2;
    scores.anxious += 0.1;
  }

  // ─────────────────────────────────────────────────────────────────
  // SPECTRAL CENTROID (brightness/sharpness)
  // High centroid: angry, anxious, surprised
  // Low centroid: sad, disgusted
  // ─────────────────────────────────────────────────────────────────
  if (spectralCentroid_mean > 3000) {
    scores.angry += 0.3;
    scores.anxious += 0.2;
    scores.surprised += 0.2;
  } else if (spectralCentroid_mean < 1500) {
    scores.sad += 0.3;
    scores.disgusted += 0.2;
  }

  // ─────────────────────────────────────────────────────────────────
  // ZERO CROSSING RATE
  // High ZCR: anxious, angry (tense voice)
  // Low ZCR: sad, neutral
  // ─────────────────────────────────────────────────────────────────
  if (zcr_mean > 0.1) {
    scores.anxious += 0.3;
    scores.angry += 0.2;
  } else if (zcr_mean < 0.03) {
    scores.sad += 0.2;
    scores.neutral += 0.2;
  }

  // ZCR variability (high = emotional instability)
  if (zcr_std > 0.05) {
    scores.anxious += 0.2;
    scores.surprised += 0.1;
  }

  // ─────────────────────────────────────────────────────────────────
  // SPECTRAL FLATNESS (noise-like vs tonal)
  // High flatness (noisy): angry, anxious
  // Low flatness (tonal): happy, sad
  // ─────────────────────────────────────────────────────────────────
  if (spectralFlatness_mean > 0.3) {
    scores.angry += 0.2;
    scores.anxious += 0.2;
  } else if (spectralFlatness_mean < 0.1) {
    scores.happy += 0.1;
    scores.sad += 0.1;
  }

  // ─────────────────────────────────────────────────────────────────
  // MFCC PATTERNS
  // MFCC[0] = overall energy
  // MFCC[1-4] = vocal tract shape / phonetic content
  // Higher MFCCs = fine spectral detail
  // ─────────────────────────────────────────────────────────────────

  // MFCC[0] (energy proxy)
  if (mfcc_mean[0] > 5) {
    scores.happy += 0.1;
    scores.angry += 0.1;
  } else if (mfcc_mean[0] < -5) {
    scores.sad += 0.1;
  }

  // MFCC variability (emotional expression)
  const totalMfccStd = mfcc_std.reduce((a, b) => a + b, 0) / mfcc_std.length;
  if (totalMfccStd > 3) {
    scores.happy += 0.2;
    scores.surprised += 0.2;
    scores.anxious += 0.1;
  } else if (totalMfccStd < 1) {
    scores.neutral += 0.3;
    scores.sad += 0.1;
  }

  // ─────────────────────────────────────────────────────────────────
  // COMBINED PATTERNS
  // ─────────────────────────────────────────────────────────────────

  // Happy: high energy + bright + variable
  if (energy_mean > 0.05 && spectralCentroid_mean > 2000 && energy_std > 0.03) {
    scores.happy += 0.3;
  }

  // Sad: low energy + dark + stable
  if (energy_mean < 0.03 && spectralCentroid_mean < 2000 && energy_std < 0.02) {
    scores.sad += 0.3;
  }

  // Angry: high energy + harsh + high ZCR
  if (energy_mean > 0.08 && spectralFlatness_mean > 0.2 && zcr_mean > 0.08) {
    scores.angry += 0.3;
  }

  // Anxious: high ZCR + variable + tense
  if (zcr_mean > 0.08 && zcr_std > 0.04 && energy_std > 0.03) {
    scores.anxious += 0.3;
  }

  // Surprised: sudden energy + bright
  if (energy_std > 0.06 && spectralCentroid_mean > 2500) {
    scores.surprised += 0.3;
  }

  // Disgusted: low + dark + flat
  if (energy_mean < 0.05 && spectralCentroid_mean < 1800 && spectralFlatness_mean > 0.15) {
    scores.disgusted += 0.2;
  }

  // ─────────────────────────────────────────────────────────────────
  // NORMALIZE AND SELECT
  // ─────────────────────────────────────────────────────────────────

  // Normalize scores to probabilities
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const probabilities = {};

  for (const emotion of CONFIG.emotions) {
    probabilities[emotion] = scores[emotion] / totalScore;
  }

  // Find primary and secondary emotions
  const sorted = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const primaryConfidence = sorted[0][1];
  const secondary = sorted[1][1] > 0.15 ? sorted[1][0] : '';

  return {
    primary,
    secondary,
    confidence: Math.min(primaryConfidence * 1.5, 0.95),  // Boost confidence slightly
    probabilities,
    features: {
      energy: energy_mean,
      zcr: zcr_mean,
      spectralCentroid: spectralCentroid_mean,
      spectralFlatness: spectralFlatness_mean
    }
  };
}

/**
 * Get SER status
 */
export function getSERStatus() {
  return {
    onnxAvailable,
    modelPath: CONFIG.modelPath,
    mode: onnxAvailable ? 'onnx' : 'heuristic',
    emotions: CONFIG.emotions
  };
}

export default {
  initSER,
  runSER,
  getSERStatus,
  CONFIG
};
