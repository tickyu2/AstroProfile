/**
 * ===============================================================================
 * NOISE SUPPRESSION SERVICE
 * ===============================================================================
 *
 * Advanced noise filtering beyond browser defaults.
 * Implements multiple noise reduction techniques for cleaner voice capture.
 *
 * TECHNIQUES:
 * - Noise Gate: Cut audio below threshold (removes quiet background noise)
 * - Spectral Subtraction: Learn noise profile and subtract from signal
 * - Adaptive Threshold: Automatically adjust based on ambient noise
 * - High-Pass Filter: Remove low-frequency rumble (AC hum, traffic)
 *
 * USAGE:
 *   import { noiseSuppression } from './noiseSuppressionService';
 *
 *   // Enable with default settings
 *   noiseSuppression.enable();
 *
 *   // Process audio
 *   const cleanAudio = noiseSuppression.process(rawAudio);
 *
 *   // Calibrate noise floor
 *   await noiseSuppression.calibrate();
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode Enhancement
 */

// Noise suppression configuration
const DEFAULT_CONFIG = {
  // Noise gate
  noiseGateEnabled: true,
  noiseGateThreshold: 0.015,      // RMS threshold (0-1)
  noiseGateAttack: 0.005,         // Attack time in seconds
  noiseGateRelease: 0.1,          // Release time in seconds
  noiseGateHoldTime: 0.05,        // Hold time before release

  // Spectral subtraction
  spectralSubtractionEnabled: true,
  spectralSubtractionStrength: 0.8, // 0-1, how aggressively to subtract noise
  noiseFloorSmoothing: 0.95,       // Smoothing factor for noise estimation

  // High-pass filter
  highPassEnabled: true,
  highPassFrequency: 80,          // Hz - removes low rumble

  // Adaptive threshold
  adaptiveThresholdEnabled: true,
  adaptiveWindowSize: 50,          // Frames to average for adaptation
  adaptiveMultiplier: 1.5,         // Multiplier above noise floor

  // General
  sampleRate: 24000,
  frameSize: 4096
};

/**
 * Noise Suppression Service
 */
class NoiseSuppressionService {
  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.isEnabled = false;
    this.isCalibrated = false;

    // Noise profile (learned during calibration)
    this.noiseFloor = 0.01;
    this.noiseSpectrum = null;

    // Noise gate state
    this.gateState = 'closed'; // 'open', 'closing', 'closed'
    this.gateGain = 0;
    this.holdCounter = 0;

    // Adaptive threshold state
    this.recentRMS = [];

    // High-pass filter coefficients (Butterworth)
    this.highPassState = { x1: 0, x2: 0, y1: 0, y2: 0 };
    this.highPassCoeffs = null;

    // FFT for spectral processing
    this.fftSize = 2048;
    this.fftBuffer = new Float32Array(this.fftSize);
    this.fftWindow = this._createHannWindow(this.fftSize);

    // Statistics
    this.stats = {
      framesProcessed: 0,
      gateOpenTime: 0,
      averageReduction: 0
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Enable noise suppression
   */
  enable(config = {}) {
    this.config = { ...this.config, ...config };
    this.isEnabled = true;

    // Initialize high-pass filter
    if (this.config.highPassEnabled) {
      this.highPassCoeffs = this._calculateHighPassCoeffs(
        this.config.highPassFrequency,
        this.config.sampleRate
      );
    }

    console.log('[NoiseSuppression] Enabled with config:', {
      noiseGate: this.config.noiseGateEnabled,
      spectralSub: this.config.spectralSubtractionEnabled,
      highPass: this.config.highPassEnabled,
      adaptive: this.config.adaptiveThresholdEnabled
    });

    return this;
  }

  /**
   * Disable noise suppression
   */
  disable() {
    this.isEnabled = false;
    console.log('[NoiseSuppression] Disabled');
    return this;
  }

  /**
   * Update configuration
   */
  setConfig(config) {
    this.config = { ...this.config, ...config };

    // Recalculate filter if frequency changed
    if (config.highPassFrequency) {
      this.highPassCoeffs = this._calculateHighPassCoeffs(
        this.config.highPassFrequency,
        this.config.sampleRate
      );
    }

    return this;
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CALIBRATION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Calibrate noise floor by analyzing ambient noise
   * Call this when the user is not speaking
   * @param {Float32Array[]} silentFrames - Array of audio frames during silence
   */
  calibrate(silentFrames) {
    if (!silentFrames || silentFrames.length === 0) {
      console.warn('[NoiseSuppression] No frames provided for calibration');
      return false;
    }

    console.log(`[NoiseSuppression] Calibrating with ${silentFrames.length} frames`);

    // Calculate average noise floor (RMS)
    let totalRMS = 0;
    for (const frame of silentFrames) {
      totalRMS += this._calculateRMS(frame);
    }
    this.noiseFloor = totalRMS / silentFrames.length;

    // Calculate noise spectrum (for spectral subtraction)
    if (this.config.spectralSubtractionEnabled && silentFrames.length > 0) {
      this.noiseSpectrum = this._estimateNoiseSpectrum(silentFrames);
    }

    // Set adaptive threshold based on calibration
    this.config.noiseGateThreshold = this.noiseFloor * this.config.adaptiveMultiplier;

    this.isCalibrated = true;
    console.log(`[NoiseSuppression] Calibrated. Noise floor: ${this.noiseFloor.toFixed(4)}, Gate threshold: ${this.config.noiseGateThreshold.toFixed(4)}`);

    return true;
  }

  /**
   * Start automatic calibration (records silence for N seconds)
   * @param {number} durationMs - Duration to record silence
   * @returns {Promise} - Resolves when calibration complete
   */
  async startAutoCalibration(durationMs = 2000) {
    console.log(`[NoiseSuppression] Starting auto-calibration (${durationMs}ms)`);

    return new Promise((resolve, reject) => {
      const frames = [];
      let stream = null;
      let audioContext = null;
      let processor = null;

      navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // Get raw audio for calibration
          noiseSuppression: false,
          autoGainControl: false
        }
      })
        .then(s => {
          stream = s;
          audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: this.config.sampleRate
          });

          const source = audioContext.createMediaStreamSource(stream);
          processor = audioContext.createScriptProcessor(this.config.frameSize, 1, 1);

          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            frames.push(new Float32Array(inputData));
          };

          source.connect(processor);
          processor.connect(audioContext.destination);

          // Stop after duration
          setTimeout(() => {
            processor.disconnect();
            source.disconnect();
            audioContext.close();
            stream.getTracks().forEach(t => t.stop());

            // Calibrate with collected frames
            this.calibrate(frames);
            resolve({
              noiseFloor: this.noiseFloor,
              threshold: this.config.noiseGateThreshold,
              framesAnalyzed: frames.length
            });
          }, durationMs);
        })
        .catch(reject);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AUDIO PROCESSING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Process audio frame with noise suppression
   * @param {Float32Array} inputBuffer - Raw audio samples
   * @returns {Float32Array} - Processed audio samples
   */
  process(inputBuffer) {
    if (!this.isEnabled) {
      return inputBuffer;
    }

    let output = new Float32Array(inputBuffer);
    this.stats.framesProcessed++;

    // 1. High-pass filter (remove low rumble)
    if (this.config.highPassEnabled && this.highPassCoeffs) {
      output = this._applyHighPassFilter(output);
    }

    // 2. Spectral subtraction (if calibrated)
    if (this.config.spectralSubtractionEnabled && this.noiseSpectrum) {
      output = this._applySpectralSubtraction(output);
    }

    // 3. Noise gate
    if (this.config.noiseGateEnabled) {
      output = this._applyNoiseGate(output);
    }

    // 4. Update adaptive threshold
    if (this.config.adaptiveThresholdEnabled) {
      this._updateAdaptiveThreshold(inputBuffer);
    }

    return output;
  }

  /**
   * Process audio with all filters and return detailed results
   * @param {Float32Array} inputBuffer - Raw audio samples
   * @returns {Object} - { output, metrics }
   */
  processWithMetrics(inputBuffer) {
    const inputRMS = this._calculateRMS(inputBuffer);
    const output = this.process(inputBuffer);
    const outputRMS = this._calculateRMS(output);

    const reduction = inputRMS > 0 ? (1 - outputRMS / inputRMS) * 100 : 0;
    this.stats.averageReduction = (this.stats.averageReduction * 0.95) + (reduction * 0.05);

    return {
      output,
      metrics: {
        inputRMS,
        outputRMS,
        reduction: reduction.toFixed(1),
        gateState: this.gateState,
        threshold: this.config.noiseGateThreshold
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NOISE GATE
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Apply noise gate to audio buffer
   * @private
   */
  _applyNoiseGate(buffer) {
    const output = new Float32Array(buffer.length);
    const rms = this._calculateRMS(buffer);
    const threshold = this.config.noiseGateThreshold;

    // State machine for gate
    const attackSamples = Math.floor(this.config.noiseGateAttack * this.config.sampleRate);
    const releaseSamples = Math.floor(this.config.noiseGateRelease * this.config.sampleRate);
    const holdSamples = Math.floor(this.config.noiseGateHoldTime * this.config.sampleRate);

    if (rms > threshold) {
      // Signal above threshold - open gate
      this.gateState = 'open';
      this.holdCounter = holdSamples;
      this.stats.gateOpenTime++;

      // Attack: ramp up gain
      for (let i = 0; i < buffer.length; i++) {
        this.gateGain = Math.min(1, this.gateGain + 1 / attackSamples);
        output[i] = buffer[i] * this.gateGain;
      }
    } else if (this.holdCounter > 0) {
      // In hold period - keep gate open
      this.holdCounter -= buffer.length;
      for (let i = 0; i < buffer.length; i++) {
        output[i] = buffer[i] * this.gateGain;
      }
    } else {
      // Below threshold - close gate
      this.gateState = 'closing';

      // Release: ramp down gain
      for (let i = 0; i < buffer.length; i++) {
        this.gateGain = Math.max(0, this.gateGain - 1 / releaseSamples);
        output[i] = buffer[i] * this.gateGain;
      }

      if (this.gateGain === 0) {
        this.gateState = 'closed';
      }
    }

    return output;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HIGH-PASS FILTER
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Calculate high-pass filter coefficients (2nd order Butterworth)
   * @private
   */
  _calculateHighPassCoeffs(cutoffFreq, sampleRate) {
    const omega = 2 * Math.PI * cutoffFreq / sampleRate;
    const cos_omega = Math.cos(omega);
    const sin_omega = Math.sin(omega);
    const alpha = sin_omega / (2 * Math.sqrt(2)); // Q = sqrt(2)/2 for Butterworth

    const a0 = 1 + alpha;

    return {
      b0: ((1 + cos_omega) / 2) / a0,
      b1: (-(1 + cos_omega)) / a0,
      b2: ((1 + cos_omega) / 2) / a0,
      a1: (-2 * cos_omega) / a0,
      a2: (1 - alpha) / a0
    };
  }

  /**
   * Apply high-pass filter to audio buffer
   * @private
   */
  _applyHighPassFilter(buffer) {
    const output = new Float32Array(buffer.length);
    const { b0, b1, b2, a1, a2 } = this.highPassCoeffs;
    let { x1, x2, y1, y2 } = this.highPassState;

    for (let i = 0; i < buffer.length; i++) {
      const x0 = buffer[i];
      const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;

      output[i] = y0;

      x2 = x1;
      x1 = x0;
      y2 = y1;
      y1 = y0;
    }

    // Save filter state for continuity
    this.highPassState = { x1, x2, y1, y2 };

    return output;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SPECTRAL SUBTRACTION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Estimate noise spectrum from silent frames
   * @private
   */
  _estimateNoiseSpectrum(silentFrames) {
    const spectrumSize = this.fftSize / 2;
    const avgSpectrum = new Float32Array(spectrumSize);
    let count = 0;

    for (const frame of silentFrames) {
      if (frame.length >= this.fftSize) {
        const spectrum = this._computeSpectrum(frame.slice(0, this.fftSize));
        for (let i = 0; i < spectrumSize; i++) {
          avgSpectrum[i] += spectrum[i];
        }
        count++;
      }
    }

    // Average
    for (let i = 0; i < spectrumSize; i++) {
      avgSpectrum[i] /= count || 1;
    }

    return avgSpectrum;
  }

  /**
   * Apply spectral subtraction
   * @private
   */
  _applySpectralSubtraction(buffer) {
    if (buffer.length < this.fftSize) {
      return buffer; // Buffer too small for FFT
    }

    // Compute input spectrum
    const inputSpectrum = this._computeSpectrum(buffer.slice(0, this.fftSize));
    const spectrumSize = this.fftSize / 2;

    // Subtract noise spectrum
    const cleanSpectrum = new Float32Array(spectrumSize);
    const strength = this.config.spectralSubtractionStrength;

    for (let i = 0; i < spectrumSize; i++) {
      const subtracted = inputSpectrum[i] - (this.noiseSpectrum[i] * strength);
      cleanSpectrum[i] = Math.max(0, subtracted); // Prevent negative magnitudes
    }

    // For simplicity, we'll apply a gain based on spectral ratio
    // (Full spectral subtraction requires IFFT which is more complex)
    const inputEnergy = inputSpectrum.reduce((a, b) => a + b, 0);
    const cleanEnergy = cleanSpectrum.reduce((a, b) => a + b, 0);
    const gain = inputEnergy > 0 ? Math.sqrt(cleanEnergy / inputEnergy) : 1;

    const output = new Float32Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      output[i] = buffer[i] * gain;
    }

    return output;
  }

  /**
   * Compute magnitude spectrum using simple DFT
   * @private
   */
  _computeSpectrum(buffer) {
    const N = Math.min(buffer.length, this.fftSize);
    const spectrum = new Float32Array(N / 2);

    // Apply window
    const windowed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      windowed[i] = buffer[i] * this.fftWindow[i];
    }

    // Simple DFT (could be replaced with FFT library for better performance)
    for (let k = 0; k < N / 2; k++) {
      let real = 0;
      let imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        real += windowed[n] * Math.cos(angle);
        imag += windowed[n] * Math.sin(angle);
      }
      spectrum[k] = Math.sqrt(real * real + imag * imag) / N;
    }

    return spectrum;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ADAPTIVE THRESHOLD
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Update adaptive threshold based on recent audio
   * @private
   */
  _updateAdaptiveThreshold(buffer) {
    const rms = this._calculateRMS(buffer);

    // Track recent RMS values
    this.recentRMS.push(rms);
    if (this.recentRMS.length > this.config.adaptiveWindowSize) {
      this.recentRMS.shift();
    }

    // Find the minimum RMS (likely the noise floor)
    const sortedRMS = [...this.recentRMS].sort((a, b) => a - b);
    const percentile10 = sortedRMS[Math.floor(sortedRMS.length * 0.1)] || rms;

    // Smoothly update noise floor
    this.noiseFloor = this.noiseFloor * this.config.noiseFloorSmoothing +
                      percentile10 * (1 - this.config.noiseFloorSmoothing);

    // Update threshold
    this.config.noiseGateThreshold = this.noiseFloor * this.config.adaptiveMultiplier;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Calculate RMS (Root Mean Square) of audio buffer
   * @private
   */
  _calculateRMS(buffer) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }

  /**
   * Create Hann window for FFT
   * @private
   */
  _createHannWindow(size) {
    const window = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (size - 1)));
    }
    return window;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.stats,
      isEnabled: this.isEnabled,
      isCalibrated: this.isCalibrated,
      noiseFloor: this.noiseFloor,
      threshold: this.config.noiseGateThreshold,
      gateState: this.gateState
    };
  }

  /**
   * Reset state
   */
  reset() {
    this.gateState = 'closed';
    this.gateGain = 0;
    this.holdCounter = 0;
    this.recentRMS = [];
    this.highPassState = { x1: 0, x2: 0, y1: 0, y2: 0 };
    this.stats = {
      framesProcessed: 0,
      gateOpenTime: 0,
      averageReduction: 0
    };
  }
}

// Preset configurations
export const NOISE_PRESETS = {
  // Light noise suppression - minimal processing
  light: {
    noiseGateEnabled: true,
    noiseGateThreshold: 0.01,
    spectralSubtractionEnabled: false,
    highPassEnabled: true,
    highPassFrequency: 60,
    adaptiveThresholdEnabled: true
  },

  // Normal noise suppression - balanced
  normal: {
    noiseGateEnabled: true,
    noiseGateThreshold: 0.015,
    spectralSubtractionEnabled: true,
    spectralSubtractionStrength: 0.6,
    highPassEnabled: true,
    highPassFrequency: 80,
    adaptiveThresholdEnabled: true
  },

  // Aggressive noise suppression - noisy environments
  aggressive: {
    noiseGateEnabled: true,
    noiseGateThreshold: 0.025,
    noiseGateRelease: 0.05,
    spectralSubtractionEnabled: true,
    spectralSubtractionStrength: 0.9,
    highPassEnabled: true,
    highPassFrequency: 120,
    adaptiveThresholdEnabled: true,
    adaptiveMultiplier: 2.0
  },

  // Office environment - keyboard, AC, chatter
  office: {
    noiseGateEnabled: true,
    noiseGateThreshold: 0.02,
    spectralSubtractionEnabled: true,
    spectralSubtractionStrength: 0.7,
    highPassEnabled: true,
    highPassFrequency: 100,
    adaptiveThresholdEnabled: true
  },

  // Outdoor - wind, traffic
  outdoor: {
    noiseGateEnabled: true,
    noiseGateThreshold: 0.03,
    noiseGateRelease: 0.08,
    spectralSubtractionEnabled: true,
    spectralSubtractionStrength: 0.85,
    highPassEnabled: true,
    highPassFrequency: 150, // Higher to cut wind rumble
    adaptiveThresholdEnabled: true,
    adaptiveMultiplier: 2.5
  }
};

// Singleton instance
export const noiseSuppression = new NoiseSuppressionService();

export default noiseSuppression;
