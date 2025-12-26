/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUDIO FEATURE EXTRACTOR - MFCC & Acoustic Features for SER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Extracts acoustic features from audio for Speech Emotion Recognition:
 * - MFCCs (Mel-frequency cepstral coefficients)
 * - Energy/RMS
 * - Zero Crossing Rate
 * - Spectral Centroid
 * - Pitch estimation
 *
 * Uses Meyda for feature extraction in Node.js
 *
 * Created: December 21, 2025
 */

import Meyda from 'meyda';

/**
 * Configuration for feature extraction
 */
const CONFIG = {
  sampleRate: 16000,        // 16kHz standard for speech
  bufferSize: 512,          // Analysis window size
  hopSize: 256,             // Hop between windows (50% overlap)
  numMfcc: 13,              // Number of MFCC coefficients
  numMelBands: 26           // Mel filterbank bands
};

/**
 * Convert audio buffer (various formats) to Float32Array
 *
 * @param {Buffer|ArrayBuffer|Float32Array} audioData - Input audio
 * @returns {Float32Array} - Normalized float audio
 */
export function normalizeAudioBuffer(audioData) {
  // Already Float32Array
  if (audioData instanceof Float32Array) {
    return audioData;
  }

  // ArrayBuffer or Buffer
  const buffer = audioData instanceof ArrayBuffer ? audioData : audioData.buffer;

  // Try to detect format - assume 16-bit PCM if raw
  const int16View = new Int16Array(buffer);
  const float32 = new Float32Array(int16View.length);

  // Convert 16-bit PCM to float [-1, 1]
  for (let i = 0; i < int16View.length; i++) {
    float32[i] = int16View[i] / 32768.0;
  }

  return float32;
}

/**
 * Extract features from a single audio frame
 *
 * @param {Float32Array} frame - Audio frame (CONFIG.bufferSize samples)
 * @returns {Object} - Extracted features
 */
export function extractFrameFeatures(frame) {
  // Ensure frame is correct size
  if (frame.length !== CONFIG.bufferSize) {
    // Pad or truncate
    const padded = new Float32Array(CONFIG.bufferSize);
    const len = Math.min(frame.length, CONFIG.bufferSize);
    padded.set(frame.slice(0, len));
    frame = padded;
  }

  try {
    // Extract multiple features using Meyda
    const features = Meyda.extract([
      'mfcc',
      'rms',
      'zcr',
      'spectralCentroid',
      'spectralFlatness',
      'spectralRolloff',
      'energy'
    ], frame);

    return {
      mfcc: features.mfcc || new Array(13).fill(0),
      rms: features.rms || 0,
      zcr: features.zcr || 0,
      spectralCentroid: features.spectralCentroid || 0,
      spectralFlatness: features.spectralFlatness || 0,
      spectralRolloff: features.spectralRolloff || 0,
      energy: features.energy || 0
    };
  } catch (error) {
    console.error('[AudioFeatures] Frame extraction error:', error.message);
    return {
      mfcc: new Array(13).fill(0),
      rms: 0,
      zcr: 0,
      spectralCentroid: 0,
      spectralFlatness: 0,
      spectralRolloff: 0,
      energy: 0
    };
  }
}

/**
 * Extract features from entire audio buffer (multiple frames)
 * Returns aggregated statistics (mean, std) for each feature
 *
 * @param {Float32Array|Buffer} audioData - Raw audio data
 * @returns {Object} - Aggregated features for SER model
 */
export function extractAudioFeatures(audioData) {
  const audio = normalizeAudioBuffer(audioData);

  // Initialize Meyda
  Meyda.sampleRate = CONFIG.sampleRate;
  Meyda.bufferSize = CONFIG.bufferSize;
  Meyda.numberOfMFCCCoefficients = CONFIG.numMfcc;

  // Collect frame-level features
  const frameFeatures = {
    mfcc: [],       // 13 coefficients per frame
    rms: [],
    zcr: [],
    spectralCentroid: [],
    spectralFlatness: [],
    spectralRolloff: [],
    energy: []
  };

  // Process audio in overlapping frames
  const numFrames = Math.floor((audio.length - CONFIG.bufferSize) / CONFIG.hopSize) + 1;

  for (let i = 0; i < numFrames; i++) {
    const start = i * CONFIG.hopSize;
    const frame = audio.slice(start, start + CONFIG.bufferSize);

    const features = extractFrameFeatures(frame);

    frameFeatures.mfcc.push(features.mfcc);
    frameFeatures.rms.push(features.rms);
    frameFeatures.zcr.push(features.zcr);
    frameFeatures.spectralCentroid.push(features.spectralCentroid);
    frameFeatures.spectralFlatness.push(features.spectralFlatness);
    frameFeatures.spectralRolloff.push(features.spectralRolloff);
    frameFeatures.energy.push(features.energy);
  }

  // Aggregate: compute mean and std for each feature
  const aggregated = {
    // MFCC statistics (mean and std for each of 13 coefficients)
    mfcc_mean: computeMfccMean(frameFeatures.mfcc),
    mfcc_std: computeMfccStd(frameFeatures.mfcc),

    // Scalar feature statistics
    rms_mean: mean(frameFeatures.rms),
    rms_std: std(frameFeatures.rms),

    zcr_mean: mean(frameFeatures.zcr),
    zcr_std: std(frameFeatures.zcr),

    spectralCentroid_mean: mean(frameFeatures.spectralCentroid),
    spectralCentroid_std: std(frameFeatures.spectralCentroid),

    spectralFlatness_mean: mean(frameFeatures.spectralFlatness),
    spectralRolloff_mean: mean(frameFeatures.spectralRolloff),

    energy_mean: mean(frameFeatures.energy),
    energy_std: std(frameFeatures.energy),

    // Duration info
    numFrames,
    durationMs: (audio.length / CONFIG.sampleRate) * 1000
  };

  return aggregated;
}

/**
 * Flatten features into a 1D array for model input
 *
 * @param {Object} features - Aggregated features from extractAudioFeatures
 * @returns {Float32Array} - Flattened feature vector
 */
export function flattenFeatures(features) {
  const vector = [
    ...features.mfcc_mean,      // 13 values
    ...features.mfcc_std,       // 13 values
    features.rms_mean,          // 1
    features.rms_std,           // 1
    features.zcr_mean,          // 1
    features.zcr_std,           // 1
    features.spectralCentroid_mean,  // 1
    features.spectralCentroid_std,   // 1
    features.spectralFlatness_mean,  // 1
    features.spectralRolloff_mean,   // 1
    features.energy_mean,       // 1
    features.energy_std         // 1
  ];

  // Total: 36 features
  return new Float32Array(vector);
}

/**
 * Helper: compute mean of array
 */
function mean(arr) {
  if (!arr || arr.length === 0) return 0;
  const filtered = arr.filter(x => isFinite(x));
  if (filtered.length === 0) return 0;
  return filtered.reduce((a, b) => a + b, 0) / filtered.length;
}

/**
 * Helper: compute standard deviation
 */
function std(arr) {
  if (!arr || arr.length < 2) return 0;
  const filtered = arr.filter(x => isFinite(x));
  if (filtered.length < 2) return 0;
  const m = mean(filtered);
  const variance = filtered.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / filtered.length;
  return Math.sqrt(variance);
}

/**
 * Helper: compute mean of MFCC array (13 coefficients)
 */
function computeMfccMean(mfccFrames) {
  if (!mfccFrames || mfccFrames.length === 0) {
    return new Array(CONFIG.numMfcc).fill(0);
  }

  const result = new Array(CONFIG.numMfcc).fill(0);

  for (const frame of mfccFrames) {
    for (let i = 0; i < CONFIG.numMfcc; i++) {
      result[i] += frame[i] || 0;
    }
  }

  for (let i = 0; i < CONFIG.numMfcc; i++) {
    result[i] /= mfccFrames.length;
  }

  return result;
}

/**
 * Helper: compute std of MFCC array
 */
function computeMfccStd(mfccFrames) {
  if (!mfccFrames || mfccFrames.length < 2) {
    return new Array(CONFIG.numMfcc).fill(0);
  }

  const means = computeMfccMean(mfccFrames);
  const result = new Array(CONFIG.numMfcc).fill(0);

  for (const frame of mfccFrames) {
    for (let i = 0; i < CONFIG.numMfcc; i++) {
      result[i] += Math.pow((frame[i] || 0) - means[i], 2);
    }
  }

  for (let i = 0; i < CONFIG.numMfcc; i++) {
    result[i] = Math.sqrt(result[i] / mfccFrames.length);
  }

  return result;
}

export default {
  extractAudioFeatures,
  flattenFeatures,
  normalizeAudioBuffer,
  extractFrameFeatures,
  CONFIG
};
