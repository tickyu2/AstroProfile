/**
 * ===============================================================================
 * PROSODY ANALYZER SERVICE
 * ===============================================================================
 *
 * Analyzes prosodic features of speech for advanced turn-taking:
 * - Pitch contour (F0) using YIN algorithm
 * - Speaking rate estimation
 * - Energy decay tracking
 * - Emphasis detection
 *
 * Part of: GENESIS Conversational AI v2
 * Created: December 28, 2024
 */

// Configuration for prosodic analysis
const PROSODY_CONFIG = {
  // Pitch detection (YIN algorithm)
  pitch: {
    sampleRate: 24000,
    windowSize: 512,        // ~21ms at 24kHz
    hopSize: 128,           // ~5ms hop
    threshold: 0.15,        // YIN threshold (lower = stricter)
    minFreq: 50,            // Hz - lowest detectable pitch
    maxFreq: 500,           // Hz - highest detectable pitch
    historySize: 20         // Number of pitch values to track
  },

  // Speaking rate estimation
  rate: {
    windowMs: 1500,         // 1.5 second window for rate calculation
    minSyllablesPerSec: 2,  // Below this = slow/pausing
    maxSyllablesPerSec: 6,  // Above this = fast/excited
    normalRate: 4           // Average speaking rate
  },

  // Energy analysis
  energy: {
    historySize: 30,        // Frames of energy history
    decayThreshold: 0.3,    // Ratio indicating rapid decay (ending)
    sustainThreshold: 0.7,  // Ratio indicating sustained energy
    emphasisMultiplier: 2.0 // Energy spike = emphasis
  }
};

/**
 * Pitch trend indicators
 */
export const PITCH_TREND = {
  RISING: 'rising',         // Question, continuation
  FALLING: 'falling',       // Statement end, finality
  FLAT: 'flat',             // Thinking, mid-sentence
  UNKNOWN: 'unknown'
};

/**
 * Turn probability indicators
 */
export const TURN_SIGNAL = {
  LIKELY_END: 'likely_end',       // Strong signal of turn end
  POSSIBLY_END: 'possibly_end',   // Might be ending
  CONTINUING: 'continuing',       // User still speaking
  THINKING: 'thinking'            // Pause but not done
};

/**
 * Prosody Analyzer Class
 */
class ProsodyAnalyzer {
  constructor() {
    // Pitch tracking
    this.pitchHistory = [];
    this.lastPitch = 0;

    // Energy tracking
    this.energyHistory = [];
    this.peakEnergy = 0;

    // Speaking rate
    this.voiceOnsets = [];
    this.lastVoiceState = false;

    // Emphasis tracking
    this.emphasisEvents = [];

    // Analysis state
    this.isActive = false;
    this.frameCount = 0;
  }

  /**
   * Reset analyzer state (call at start of new utterance)
   */
  reset() {
    this.pitchHistory = [];
    this.energyHistory = [];
    this.voiceOnsets = [];
    this.emphasisEvents = [];
    this.lastPitch = 0;
    this.peakEnergy = 0;
    this.lastVoiceState = false;
    this.frameCount = 0;
    this.isActive = true;
  }

  /**
   * Main analysis function - call with each audio chunk
   * @param {Float32Array} audioBuffer - Raw audio samples
   * @returns {Object} Prosodic analysis results
   */
  analyze(audioBuffer) {
    if (!this.isActive) {
      this.reset();
    }

    this.frameCount++;

    // 1. Calculate energy (RMS)
    const energy = this._calculateEnergy(audioBuffer);
    this.energyHistory.push(energy);
    if (this.energyHistory.length > PROSODY_CONFIG.energy.historySize) {
      this.energyHistory.shift();
    }

    // Track peak energy
    if (energy > this.peakEnergy) {
      this.peakEnergy = energy;
    }

    // 2. Detect pitch using YIN algorithm
    const pitch = this._detectPitch(audioBuffer);
    if (pitch > 0) {
      this.pitchHistory.push(pitch);
      if (this.pitchHistory.length > PROSODY_CONFIG.pitch.historySize) {
        this.pitchHistory.shift();
      }
      this.lastPitch = pitch;
    }

    // 3. Track voice onsets for speaking rate
    const hasVoice = energy > 0.01;
    if (hasVoice && !this.lastVoiceState) {
      this.voiceOnsets.push(Date.now());
    }
    this.lastVoiceState = hasVoice;

    // 4. Detect emphasis (energy spikes)
    if (this._detectEmphasis(energy)) {
      this.emphasisEvents.push({
        time: Date.now(),
        energy,
        pitch: this.lastPitch
      });
    }

    // 5. Compute comprehensive analysis
    return this._computeAnalysis();
  }

  /**
   * Calculate RMS energy
   * @private
   */
  _calculateEnergy(samples) {
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i];
    }
    return Math.sqrt(sum / samples.length);
  }

  /**
   * YIN Pitch Detection Algorithm
   * Robust fundamental frequency estimation
   * @private
   */
  _detectPitch(audioBuffer) {
    const { windowSize, threshold, minFreq, maxFreq, sampleRate } = PROSODY_CONFIG.pitch;

    // Use only the required window
    const buffer = audioBuffer.length >= windowSize
      ? audioBuffer.slice(0, windowSize)
      : audioBuffer;

    if (buffer.length < windowSize / 2) {
      return 0;
    }

    const bufferSize = buffer.length;
    const yinBuffer = new Float32Array(bufferSize / 2);

    // Step 1: Calculate difference function
    let tau;
    for (tau = 0; tau < bufferSize / 2; tau++) {
      let sum = 0;
      for (let i = 0; i < bufferSize / 2; i++) {
        const delta = buffer[i] - buffer[i + tau];
        sum += delta * delta;
      }
      yinBuffer[tau] = sum;
    }

    // Step 2: Cumulative mean normalized difference
    yinBuffer[0] = 1;
    let runningSum = 0;
    for (tau = 1; tau < bufferSize / 2; tau++) {
      runningSum += yinBuffer[tau];
      yinBuffer[tau] *= tau / runningSum;
    }

    // Step 3: Absolute threshold
    const minTau = Math.floor(sampleRate / maxFreq);
    const maxTau = Math.floor(sampleRate / minFreq);

    let bestTau = -1;
    let bestValue = threshold;

    for (tau = minTau; tau < Math.min(maxTau, bufferSize / 2); tau++) {
      if (yinBuffer[tau] < bestValue) {
        bestValue = yinBuffer[tau];
        bestTau = tau;
      }
    }

    // Step 4: Parabolic interpolation for better accuracy
    if (bestTau > 0 && bestTau < bufferSize / 2 - 1) {
      const alpha = yinBuffer[bestTau - 1];
      const beta = yinBuffer[bestTau];
      const gamma = yinBuffer[bestTau + 1];
      const peak = (alpha - gamma) / (2 * (alpha - 2 * beta + gamma));
      bestTau = bestTau + peak;
    }

    if (bestTau > 0) {
      return sampleRate / bestTau;
    }

    return 0;
  }

  /**
   * Calculate pitch trend over recent history
   * @private
   */
  _getPitchTrend() {
    if (this.pitchHistory.length < 5) {
      return { trend: PITCH_TREND.UNKNOWN, confidence: 0 };
    }

    // Linear regression on recent pitch values
    const recent = this.pitchHistory.slice(-10);
    const n = recent.length;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += recent[i];
      sumXY += i * recent[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const meanPitch = sumY / n;

    // Normalize slope by mean pitch for relative change
    const normalizedSlope = slope / meanPitch;

    // Calculate confidence based on consistency
    let consistency = 0;
    for (let i = 1; i < recent.length; i++) {
      const expectedChange = slope;
      const actualChange = recent[i] - recent[i-1];
      if ((expectedChange > 0 && actualChange > 0) ||
          (expectedChange < 0 && actualChange < 0) ||
          (Math.abs(expectedChange) < 0.1 && Math.abs(actualChange) < meanPitch * 0.05)) {
        consistency++;
      }
    }
    const confidence = consistency / (recent.length - 1);

    // Determine trend
    let trend;
    if (normalizedSlope > 0.01) {
      trend = PITCH_TREND.RISING;
    } else if (normalizedSlope < -0.01) {
      trend = PITCH_TREND.FALLING;
    } else {
      trend = PITCH_TREND.FLAT;
    }

    return { trend, confidence, slope: normalizedSlope, meanPitch };
  }

  /**
   * Calculate energy decay rate
   * @private
   */
  _getEnergyDecay() {
    if (this.energyHistory.length < 5) {
      return { decayRate: 0, sustained: true };
    }

    const recent = this.energyHistory.slice(-10);
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (avgFirst === 0) {
      return { decayRate: 0, sustained: true };
    }

    const decayRate = 1 - (avgSecond / avgFirst);
    const sustained = decayRate < PROSODY_CONFIG.energy.decayThreshold;

    return { decayRate, sustained, currentEnergy: avgSecond, peakEnergy: this.peakEnergy };
  }

  /**
   * Estimate speaking rate (syllables per second)
   * @private
   */
  _getSpeakingRate() {
    const now = Date.now();
    const windowStart = now - PROSODY_CONFIG.rate.windowMs;

    // Filter to recent onsets
    const recentOnsets = this.voiceOnsets.filter(t => t > windowStart);
    this.voiceOnsets = recentOnsets; // Clean up old data

    if (recentOnsets.length < 2) {
      return { rate: PROSODY_CONFIG.rate.normalRate, trend: 'normal' };
    }

    // Calculate rate
    const duration = (now - recentOnsets[0]) / 1000;
    const rate = recentOnsets.length / duration;

    // Determine trend
    let trend = 'normal';
    if (rate < PROSODY_CONFIG.rate.minSyllablesPerSec) {
      trend = 'slow';
    } else if (rate > PROSODY_CONFIG.rate.maxSyllablesPerSec) {
      trend = 'fast';
    }

    return { rate, trend, onsetCount: recentOnsets.length };
  }

  /**
   * Detect emphasis (energy spikes)
   * @private
   */
  _detectEmphasis(currentEnergy) {
    if (this.energyHistory.length < 3) {
      return false;
    }

    // Compare to recent average
    const recentAvg = this.energyHistory.slice(-5, -1)
      .reduce((a, b) => a + b, 0) / 4;

    return currentEnergy > recentAvg * PROSODY_CONFIG.energy.emphasisMultiplier;
  }

  /**
   * Compute comprehensive prosodic analysis
   * @private
   */
  _computeAnalysis() {
    const pitchInfo = this._getPitchTrend();
    const energyInfo = this._getEnergyDecay();
    const rateInfo = this._getSpeakingRate();

    // Determine overall turn signal
    const turnSignal = this._determineTurnSignal(pitchInfo, energyInfo, rateInfo);

    return {
      // Pitch analysis
      pitch: {
        current: this.lastPitch,
        trend: pitchInfo.trend,
        confidence: pitchInfo.confidence,
        slope: pitchInfo.slope
      },

      // Energy analysis
      energy: {
        current: this.energyHistory[this.energyHistory.length - 1] || 0,
        peak: this.peakEnergy,
        decayRate: energyInfo.decayRate,
        sustained: energyInfo.sustained
      },

      // Speaking rate
      rate: {
        syllablesPerSec: rateInfo.rate,
        trend: rateInfo.trend
      },

      // Emphasis events
      emphasis: {
        recentCount: this.emphasisEvents.filter(e => Date.now() - e.time < 2000).length,
        events: this.emphasisEvents.slice(-5)
      },

      // Turn-taking signal
      turnSignal,

      // Metadata
      frameCount: this.frameCount,
      historyLength: this.pitchHistory.length
    };
  }

  /**
   * Determine turn-taking signal from prosodic features
   * @private
   */
  _determineTurnSignal(pitchInfo, energyInfo, rateInfo) {
    // Strong signals of turn end:
    // - Falling pitch + rapid energy decay + slow rate
    if (pitchInfo.trend === PITCH_TREND.FALLING &&
        energyInfo.decayRate > 0.4 &&
        rateInfo.trend === 'slow') {
      return TURN_SIGNAL.LIKELY_END;
    }

    // Possible turn end:
    // - Falling pitch OR rapid energy decay
    if (pitchInfo.trend === PITCH_TREND.FALLING ||
        energyInfo.decayRate > 0.5) {
      return TURN_SIGNAL.POSSIBLY_END;
    }

    // Thinking pause:
    // - Flat pitch + sustained energy
    if (pitchInfo.trend === PITCH_TREND.FLAT &&
        energyInfo.sustained &&
        rateInfo.trend === 'slow') {
      return TURN_SIGNAL.THINKING;
    }

    // Still speaking:
    // - Rising pitch, normal/fast rate
    if (pitchInfo.trend === PITCH_TREND.RISING ||
        rateInfo.trend === 'fast' ||
        rateInfo.trend === 'normal') {
      return TURN_SIGNAL.CONTINUING;
    }

    return TURN_SIGNAL.CONTINUING;
  }

  /**
   * Get recommended silence threshold based on current prosody
   * @returns {number} Recommended silence threshold in ms
   */
  getRecommendedSilenceThreshold() {
    const analysis = this._computeAnalysis();

    // Base thresholds from plan
    const THRESHOLDS = {
      minimum: 300,
      standard: 600,
      extended: 1000,
      question: 400
    };

    switch (analysis.turnSignal) {
      case TURN_SIGNAL.LIKELY_END:
        return THRESHOLDS.minimum;

      case TURN_SIGNAL.POSSIBLY_END:
        return analysis.pitch.trend === PITCH_TREND.RISING
          ? THRESHOLDS.question
          : THRESHOLDS.standard;

      case TURN_SIGNAL.THINKING:
        return THRESHOLDS.extended;

      case TURN_SIGNAL.CONTINUING:
      default:
        return THRESHOLDS.standard;
    }
  }

  /**
   * Stop analyzing (call at end of utterance)
   */
  stop() {
    this.isActive = false;
  }

  /**
   * Get current state summary
   */
  getState() {
    return {
      isActive: this.isActive,
      frameCount: this.frameCount,
      pitchHistoryLength: this.pitchHistory.length,
      energyHistoryLength: this.energyHistory.length,
      lastPitch: this.lastPitch,
      peakEnergy: this.peakEnergy
    };
  }
}

// Singleton instance
export const prosodyAnalyzer = new ProsodyAnalyzer();

export default prosodyAnalyzer;
