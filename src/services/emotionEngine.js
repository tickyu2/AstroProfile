/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION ENGINE - Speech Emotion Recognition (SER) for Voice AI
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Analyzes audio frames to detect emotional state from voice characteristics.
 * Uses acoustic features like pitch, energy, and spectral patterns.
 *
 * Features:
 * - Real-time audio analysis
 * - 3-tier emotion classification (primary, secondary, micro)
 * - Confidence scoring
 * - Smoothing to prevent jitter
 * - Hysteresis to prevent rapid emotion switching
 *
 * Note: This uses heuristic analysis. For production, replace with a trained
 * ML model (local or via backend API).
 *
 * Created: December 21, 2025
 */

import {
  PRIMARY_EMOTIONS,
  SECONDARY_EMOTIONS,
  DEFAULT_EMOTION,
  validateEmotion
} from './emotionSchema';

/**
 * Configuration constants
 */
const CONFIG = {
  // Minimum confidence to accept a new emotion
  MIN_CONFIDENCE_THRESHOLD: 0.3,

  // Confidence required to switch emotions (hysteresis)
  SWITCH_CONFIDENCE_THRESHOLD: 0.55,

  // Smoothing factor (0-1, higher = more smoothing)
  SMOOTHING_FACTOR: 0.7,

  // Analysis window size in samples
  ANALYSIS_WINDOW: 2048,

  // Pitch detection parameters
  MIN_PITCH_HZ: 80,
  MAX_PITCH_HZ: 400,

  // Energy thresholds
  LOW_ENERGY_THRESHOLD: 0.05,
  HIGH_ENERGY_THRESHOLD: 0.25,

  // Pitch thresholds
  LOW_PITCH_HZ: 150,
  HIGH_PITCH_HZ: 220
};

/**
 * EmotionEngine class
 * Analyzes audio and returns emotional state
 */
export class EmotionEngine {
  constructor(options = {}) {
    this.config = { ...CONFIG, ...options };
    this.lastEmotion = { ...DEFAULT_EMOTION };
    this.emotionHistory = [];
    this.historyMaxLength = 10;

    // Running averages for smoothing
    this.runningAvg = {
      rms: 0,
      pitch: 200,
      zcr: 0
    };
  }

  /**
   * Analyze audio data and return emotion
   * @param {Float32Array} audioData - Audio samples from Web Audio API
   * @returns {Object} Emotion object with primary, secondary, micro, confidence
   */
  analyze(audioData) {
    if (!audioData || audioData.length === 0) {
      return this.lastEmotion;
    }

    // Extract acoustic features
    const features = this.extractFeatures(audioData);

    // Classify emotion from features
    const rawEmotion = this.classifyEmotion(features);

    // Apply confidence-based fallback
    if (rawEmotion.confidence < this.config.MIN_CONFIDENCE_THRESHOLD) {
      return this.lastEmotion;
    }

    // Apply hysteresis (don't switch too easily)
    if (rawEmotion.primary !== this.lastEmotion.primary) {
      if (rawEmotion.confidence < this.config.SWITCH_CONFIDENCE_THRESHOLD) {
        return this.lastEmotion;
      }
    }

    // Apply smoothing
    const smoothedEmotion = this.smoothEmotion(rawEmotion);

    // Update history
    this.addToHistory(smoothedEmotion);

    // Store and return
    this.lastEmotion = smoothedEmotion;
    return smoothedEmotion;
  }

  /**
   * Extract acoustic features from audio data
   * @param {Float32Array} audioData
   * @returns {Object} Extracted features
   */
  extractFeatures(audioData) {
    const rms = this.computeRMS(audioData);
    const zcr = this.computeZeroCrossingRate(audioData);
    const pitch = this.estimatePitch(audioData);
    const spectralCentroid = this.computeSpectralCentroid(audioData);

    // Smooth running averages
    this.runningAvg.rms = this.runningAvg.rms * 0.8 + rms * 0.2;
    this.runningAvg.pitch = this.runningAvg.pitch * 0.8 + pitch * 0.2;
    this.runningAvg.zcr = this.runningAvg.zcr * 0.8 + zcr * 0.2;

    return {
      rms: this.runningAvg.rms,
      zcr: this.runningAvg.zcr,
      pitch: this.runningAvg.pitch,
      spectralCentroid,

      // Derived features
      energy: rms < this.config.LOW_ENERGY_THRESHOLD ? 'low' :
              rms > this.config.HIGH_ENERGY_THRESHOLD ? 'high' : 'medium',
      pitchLevel: pitch < this.config.LOW_PITCH_HZ ? 'low' :
                  pitch > this.config.HIGH_PITCH_HZ ? 'high' : 'medium',
      rate: zcr < 0.1 ? 'slow' : zcr > 0.3 ? 'fast' : 'normal'
    };
  }

  /**
   * Classify emotion from acoustic features
   * @param {Object} features - Extracted features
   * @returns {Object} Classified emotion
   */
  classifyEmotion(features) {
    const { rms, pitch, zcr, energy, pitchLevel, rate } = features;

    let primary = 'neutral';
    let secondary = 'calm';
    let confidence = 0.5;

    // ═══════════════════════════════════════════════════════════════════════
    // EMOTION CLASSIFICATION RULES
    // These are heuristics - replace with ML model for production
    // ═══════════════════════════════════════════════════════════════════════

    // ANGRY: High energy + high pitch + fast rate
    if (rms > 0.25 && pitch > 200 && zcr > 0.25) {
      primary = 'angry';
      secondary = rms > 0.35 ? 'hostile' : 'frustrated';
      confidence = 0.7 + (rms - 0.25) * 0.5;
    }
    // SAD: Low energy + low pitch + slow rate
    else if (rms < 0.08 && pitch < 160) {
      primary = 'sad';
      secondary = zcr < 0.1 ? 'tired' : 'disappointed';
      confidence = 0.65 + (0.08 - rms) * 2;
    }
    // HAPPY: Medium-high energy + high pitch + moderate-fast rate
    else if (rms > 0.15 && pitch > 200 && rms < 0.30) {
      primary = 'happy';
      secondary = pitch > 250 ? 'excited' : 'cheerful';
      confidence = 0.6 + (pitch - 200) * 0.002;
    }
    // ANXIOUS: Variable energy + shaky/rising pitch + hesitant rate
    else if (pitch > 180 && zcr > 0.2 && rms < 0.20) {
      primary = 'anxious';
      secondary = rms < 0.1 ? 'nervous' : 'stressed';
      confidence = 0.55 + zcr * 0.3;
    }
    // SURPRISED: Sudden high pitch + moderate energy
    else if (pitch > 230 && rms > 0.12 && rms < 0.25) {
      primary = 'surprised';
      secondary = zcr > 0.3 ? 'startled' : 'curious';
      confidence = 0.5 + (pitch - 230) * 0.003;
    }
    // DISGUSTED: Low-medium energy + falling pitch + slow rate
    else if (rms < 0.15 && pitch < 170 && zcr < 0.15) {
      primary = 'disgusted';
      secondary = 'skeptical';
      confidence = 0.45;
    }
    // NEUTRAL: Everything else
    else {
      primary = 'neutral';
      secondary = rms < 0.1 ? 'relaxed' :
                  zcr > 0.2 ? 'focused' : 'calm';
      confidence = 0.6;
    }

    // Build micro-cues
    const micro = {
      energy,
      pitch: pitch < 150 ? 'falling' :
             pitch > 220 ? 'rising' :
             Math.abs(pitch - this.runningAvg.pitch) > 30 ? 'shaky' : 'flat',
      rate,
      volume: rms < 0.08 ? 'soft' : rms > 0.25 ? 'loud' : 'normal'
    };

    // Clamp confidence
    confidence = Math.min(Math.max(confidence, 0), 1);

    return { primary, secondary, micro, confidence };
  }

  /**
   * Apply smoothing to prevent emotion jitter
   * @param {Object} newEmotion - New emotion to smooth
   * @returns {Object} Smoothed emotion
   */
  smoothEmotion(newEmotion) {
    const { SMOOTHING_FACTOR } = this.config;

    // For primary/secondary, we use the new value (already filtered by hysteresis)
    // For confidence, we smooth
    const smoothedConfidence =
      this.lastEmotion.confidence * SMOOTHING_FACTOR +
      newEmotion.confidence * (1 - SMOOTHING_FACTOR);

    return {
      ...newEmotion,
      confidence: smoothedConfidence
    };
  }

  /**
   * Add emotion to history for trend analysis
   * @param {Object} emotion
   */
  addToHistory(emotion) {
    this.emotionHistory.push({
      ...emotion,
      timestamp: Date.now()
    });

    // Trim history
    if (this.emotionHistory.length > this.historyMaxLength) {
      this.emotionHistory.shift();
    }
  }

  /**
   * Get dominant emotion from recent history
   * @returns {string} Most frequent primary emotion
   */
  getDominantEmotion() {
    if (this.emotionHistory.length === 0) return 'neutral';

    const counts = {};
    for (const e of this.emotionHistory) {
      counts[e.primary] = (counts[e.primary] || 0) + 1;
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * Get emotion trend (is user getting more or less emotional?)
   * @returns {string} 'escalating' | 'de-escalating' | 'stable'
   */
  getEmotionTrend() {
    if (this.emotionHistory.length < 3) return 'stable';

    const recent = this.emotionHistory.slice(-5);
    const avgConfidence = recent.reduce((sum, e) => sum + e.confidence, 0) / recent.length;
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const firstAvg = firstHalf.reduce((sum, e) => sum + e.confidence, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, e) => sum + e.confidence, 0) / secondHalf.length;

    if (secondAvg - firstAvg > 0.1) return 'escalating';
    if (firstAvg - secondAvg > 0.1) return 'de-escalating';
    return 'stable';
  }

  /**
   * Reset the engine state
   */
  reset() {
    this.lastEmotion = { ...DEFAULT_EMOTION };
    this.emotionHistory = [];
    this.runningAvg = { rms: 0, pitch: 200, zcr: 0 };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO ANALYSIS UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Compute RMS (Root Mean Square) energy
   * @param {Float32Array} data
   * @returns {number} RMS value
   */
  computeRMS(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    return Math.sqrt(sum / data.length);
  }

  /**
   * Compute Zero Crossing Rate
   * Higher ZCR often indicates excitement or stress
   * @param {Float32Array} data
   * @returns {number} ZCR value (0-1)
   */
  computeZeroCrossingRate(data) {
    let crossings = 0;
    for (let i = 1; i < data.length; i++) {
      if ((data[i] >= 0 && data[i - 1] < 0) ||
          (data[i] < 0 && data[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings / data.length;
  }

  /**
   * Estimate fundamental pitch using autocorrelation
   * @param {Float32Array} data
   * @returns {number} Estimated pitch in Hz
   */
  estimatePitch(data) {
    const sampleRate = 44100; // Assume 44.1kHz
    const minPeriod = Math.floor(sampleRate / this.config.MAX_PITCH_HZ);
    const maxPeriod = Math.floor(sampleRate / this.config.MIN_PITCH_HZ);

    let bestCorrelation = 0;
    let bestPeriod = minPeriod;

    // Autocorrelation-based pitch detection
    for (let period = minPeriod; period < Math.min(maxPeriod, data.length / 2); period++) {
      let correlation = 0;
      for (let i = 0; i < data.length - period; i++) {
        correlation += data[i] * data[i + period];
      }

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    return sampleRate / bestPeriod;
  }

  /**
   * Compute spectral centroid (brightness of sound)
   * @param {Float32Array} data
   * @returns {number} Spectral centroid
   */
  computeSpectralCentroid(data) {
    // Simplified spectral centroid using zero-crossing weighted average
    let weightedSum = 0;
    let sum = 0;

    for (let i = 1; i < data.length; i++) {
      const magnitude = Math.abs(data[i]);
      weightedSum += magnitude * i;
      sum += magnitude;
    }

    return sum > 0 ? weightedSum / sum : 0;
  }
}

// Export singleton instance
export const emotionEngine = new EmotionEngine();

export default EmotionEngine;
