/**
 * ===============================================================================
 * AUDIO CAPTURE SERVICE
 * ===============================================================================
 *
 * Handles microphone capture and audio processing for voice streaming.
 * Converts browser audio to PCM16 format for OpenAI Realtime API.
 *
 * FEATURES:
 * - Microphone access with permission handling
 * - Real-time audio processing via AudioWorklet
 * - PCM16 conversion at 24kHz (OpenAI Realtime format)
 * - Voice activity detection (VAD)
 * - Automatic gain control
 * - Advanced noise suppression (beyond browser defaults)
 * - PROSODIC ANALYSIS for intelligent turn-taking (v2)
 * - Constitutional-aware dynamic silence thresholds (v2)
 *
 * USAGE:
 *   import { audioCapture } from './audioCapture';
 *
 *   await audioCapture.start();
 *   audioCapture.onAudioData((pcm16) => voiceWS.sendAudio(pcm16));
 *   audioCapture.stop();
 *
 *   // With noise suppression
 *   audioCapture.enableNoiseSuppression('normal');
 *   await audioCapture.calibrateNoise();
 *
 *   // With constitutional turn-taking (v2)
 *   audioCapture.setUserProfile(userProfile);
 *   audioCapture.onTurnDecision((decision) => handleTurn(decision));
 *
 * Created: December 27, 2024
 * Updated: December 28, 2024 - Added prosodic analysis & constitutional turn-taking
 * Part of: GENESIS Voice Mode Enhancement / Conversational AI v2
 */

import { noiseSuppression, NOISE_PRESETS } from './noiseSuppressionService';
import { prosodyAnalyzer } from './prosodyAnalyzer';
import { turnTakingModel, TURN_ACTION } from './turnTakingModel';

// Audio configuration for OpenAI Realtime
const AUDIO_CONFIG = {
  sampleRate: 24000,     // OpenAI Realtime uses 24kHz
  channelCount: 1,       // Mono
  chunkSize: 4096,       // Samples per chunk
  vadThreshold: 0.01,    // Voice activity detection threshold

  // Dynamic silence thresholds (v2)
  silenceThresholds: {
    minimum: 300,        // Never commit before 300ms
    standard: 600,       // Normal pause duration
    extended: 1000,      // Thinking pause
    question: 400        // After rising pitch (expecting response)
  },

  // Legacy fallback
  silenceThreshold: 600, // Default if turn-taking disabled

  // Prosodic analysis settings
  prosody: {
    enabled: true,       // Enable prosodic analysis
    windowSize: 512,     // Samples for pitch window
    analysisInterval: 3  // Analyze every N audio chunks
  }
};

/**
 * Audio Capture Service
 */
class AudioCaptureService {
  constructor() {
    this.stream = null;
    this.audioContext = null;
    this.sourceNode = null;
    this.processorNode = null;
    this.isCapturing = false;
    this.isListening = false; // Passive mode: monitor for barge-in only
    this.isMuted = false; // Echo cancellation: mute while Luna speaks

    // Callbacks
    this.onAudioDataCallback = null;
    this.onVoiceActivityCallback = null;
    this.onSilenceCallback = null;
    this.onErrorCallback = null;
    this.onBargeInCallback = null; // Barge-in detection callback
    this.onTurnDecisionCallback = null; // Turn-taking decision callback (v2)

    // VAD state
    this.lastVoiceTime = 0;
    this.isSpeaking = false;
    this.silenceTimer = null;

    // Barge-in state
    this.bargeInTriggered = false;

    // Noise suppression state
    this.noiseSuppressionEnabled = false;
    this.noiseSuppressionPreset = 'normal';
    this.calibrationFrames = []; // Frames collected for calibration
    this.isCalibrating = false;

    // Turn-taking state (v2)
    this.turnTakingEnabled = true;
    this.audioChunkCount = 0;
    this.silenceStartTime = null;
    this.lastAudioBuffer = null;
    this.currentPartialTranscript = '';
  }

  /**
   * Set user profile for constitutional-aware turn-taking
   * @param {Object} userProfile - User's profile with Enneagram, processing style, etc.
   */
  setUserProfile(userProfile) {
    turnTakingModel.setUserProfile(userProfile);
    console.log('[AudioCapture] User profile set for turn-taking');
  }

  /**
   * Enable/disable intelligent turn-taking
   * @param {boolean} enabled
   */
  setTurnTakingEnabled(enabled) {
    this.turnTakingEnabled = enabled;
    console.log(`[AudioCapture] Turn-taking ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Update partial transcript for turn-taking analysis
   * Called by STT when partial results come in
   * @param {string} transcript
   */
  updatePartialTranscript(transcript) {
    this.currentPartialTranscript = transcript;
    turnTakingModel.updateTranscript(transcript);
  }

  /**
   * Request microphone permission and start capture
   */
  async start() {
    if (this.isCapturing) {
      console.log('[AudioCapture] Already capturing');
      return;
    }

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: AUDIO_CONFIG.channelCount,
          sampleRate: AUDIO_CONFIG.sampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('[AudioCapture] Microphone access granted');

      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: AUDIO_CONFIG.sampleRate
      });

      // Create source from microphone stream
      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);

      // Create script processor for audio data access
      // Note: ScriptProcessorNode is deprecated but still widely supported
      // AudioWorklet is the modern alternative but requires more setup
      this.processorNode = this.audioContext.createScriptProcessor(
        AUDIO_CONFIG.chunkSize,
        AUDIO_CONFIG.channelCount,
        AUDIO_CONFIG.channelCount
      );

      this.processorNode.onaudioprocess = (event) => {
        this._processAudio(event);
      };

      // Connect nodes
      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      this.isCapturing = true;
      console.log('[AudioCapture] Capture started');

    } catch (error) {
      console.error('[AudioCapture] Failed to start:', error);
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Stop audio capture
   */
  stop() {
    if (!this.isCapturing) return;

    // Disconnect nodes
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Clear timers
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    this.isCapturing = false;
    this.isListening = false;
    this.isSpeaking = false;
    this.isMuted = false;
    this.bargeInTriggered = false;
    console.log('[AudioCapture] Capture stopped');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LISTENING MODE (Barge-in Detection)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Start passive listening mode for barge-in detection.
   * Monitors microphone for voice activity but does NOT send audio data.
   * Use this while Luna is speaking to detect when user wants to interrupt.
   */
  async startListening() {
    if (this.isListening || this.isCapturing) {
      console.log('[AudioCapture] Already listening or capturing');
      return;
    }

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: AUDIO_CONFIG.channelCount,
          sampleRate: AUDIO_CONFIG.sampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('[AudioCapture] Microphone access granted for listening');

      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: AUDIO_CONFIG.sampleRate
      });

      // Create source from microphone stream
      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);

      // Create script processor for VAD only
      this.processorNode = this.audioContext.createScriptProcessor(
        AUDIO_CONFIG.chunkSize,
        AUDIO_CONFIG.channelCount,
        AUDIO_CONFIG.channelCount
      );

      this.processorNode.onaudioprocess = (event) => {
        this._processListeningAudio(event);
      };

      // Connect nodes
      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      this.isListening = true;
      this.bargeInTriggered = false;
      console.log('[AudioCapture] Listening mode started (barge-in detection active)');

    } catch (error) {
      console.error('[AudioCapture] Failed to start listening:', error);
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Stop passive listening mode
   */
  stopListening() {
    if (!this.isListening) return;

    // Disconnect nodes
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.isListening = false;
    this.bargeInTriggered = false;
    console.log('[AudioCapture] Listening mode stopped');
  }

  /**
   * Process audio in listening mode (VAD only, no data emission)
   * @private
   */
  _processListeningAudio(event) {
    const inputData = event.inputBuffer.getChannelData(0);

    // Calculate RMS for voice activity detection
    const rms = this._calculateRMS(inputData);
    const hasVoice = rms > AUDIO_CONFIG.vadThreshold;

    // Barge-in detection: voice detected while listening
    if (hasVoice && !this.bargeInTriggered) {
      this.bargeInTriggered = true;
      console.log('[AudioCapture] BARGE-IN DETECTED - User started speaking');
      this._emitBargeIn();
    }
  }

  /**
   * Emit barge-in detected event
   * @private
   */
  _emitBargeIn() {
    if (this.onBargeInCallback) {
      this.onBargeInCallback();
    }
  }

  /**
   * Transition from listening mode to full capture mode.
   * Call this after barge-in is detected to start recording.
   */
  async transitionToCapture() {
    if (!this.isListening) {
      console.warn('[AudioCapture] Not in listening mode, starting fresh capture');
      return this.start();
    }

    // Already have the microphone stream and audio context
    // Just need to switch the processor callback
    console.log('[AudioCapture] Transitioning from listening to capture mode');

    this.processorNode.onaudioprocess = (event) => {
      this._processAudio(event);
    };

    this.isListening = false;
    this.isCapturing = true;
    this.bargeInTriggered = false;

    console.log('[AudioCapture] Now in capture mode');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ECHO CANCELLATION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Mute microphone (for echo cancellation while Luna speaks)
   */
  mute() {
    if (!this.isMuted) {
      this.isMuted = true;
      console.log('[AudioCapture] Muted for echo cancellation');
    }
  }

  /**
   * Unmute microphone
   */
  unmute() {
    if (this.isMuted) {
      this.isMuted = false;
      console.log('[AudioCapture] Unmuted');
    }
  }

  /**
   * Process audio buffer
   * @private
   */
  _processAudio(event) {
    // Skip processing if muted (echo cancellation)
    if (this.isMuted) {
      return;
    }

    let inputData = event.inputBuffer.getChannelData(0);

    // Collect frames during calibration
    if (this.isCalibrating) {
      this.calibrationFrames.push(new Float32Array(inputData));
      return; // Don't emit audio during calibration
    }

    // Apply noise suppression if enabled
    let processedData = inputData;
    if (this.noiseSuppressionEnabled) {
      processedData = noiseSuppression.process(inputData);
    }

    // Store for turn-taking analysis
    this.lastAudioBuffer = new Float32Array(processedData);
    this.audioChunkCount++;

    // Calculate RMS for voice activity detection (use processed data for better accuracy)
    const rms = this._calculateRMS(processedData);
    const threshold = this.noiseSuppressionEnabled
      ? noiseSuppression.config?.noiseGateThreshold || AUDIO_CONFIG.vadThreshold
      : AUDIO_CONFIG.vadThreshold;
    const hasVoice = rms > threshold;

    // Voice activity state management
    if (hasVoice) {
      this.lastVoiceTime = Date.now();
      this.silenceStartTime = null; // Reset silence tracking

      if (!this.isSpeaking) {
        this.isSpeaking = true;
        this._emitVoiceActivity(true);
        // Start turn tracking
        if (this.turnTakingEnabled) {
          turnTakingModel.startUtterance();
        }
      }

      // Clear silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
    } else if (this.isSpeaking) {
      // Track silence duration
      if (!this.silenceStartTime) {
        this.silenceStartTime = Date.now();
      }
      const silenceDuration = Date.now() - this.silenceStartTime;

      // Use intelligent turn-taking if enabled
      if (this.turnTakingEnabled && AUDIO_CONFIG.prosody.enabled) {
        // Analyze prosody periodically
        if (this.audioChunkCount % AUDIO_CONFIG.prosody.analysisInterval === 0) {
          const decision = turnTakingModel.decide(this.lastAudioBuffer, silenceDuration);

          // Emit turn decision for monitoring/UI
          this._emitTurnDecision(decision);

          // Handle turn commit
          if (decision.action === TURN_ACTION.COMMIT) {
            this.isSpeaking = false;
            this._emitVoiceActivity(false);
            this._emitSilence();
            turnTakingModel.endUtterance();

            // Clear any pending timer
            if (this.silenceTimer) {
              clearTimeout(this.silenceTimer);
              this.silenceTimer = null;
            }
          }
        }
      } else {
        // Legacy fixed threshold behavior
        if (!this.silenceTimer) {
          this.silenceTimer = setTimeout(() => {
            this.isSpeaking = false;
            this._emitVoiceActivity(false);
            this._emitSilence();
          }, AUDIO_CONFIG.silenceThreshold);
        }
      }
    }

    // Convert Float32 to PCM16 and emit (use processed data)
    const pcm16 = this._float32ToPCM16(processedData);

    if (this.onAudioDataCallback) {
      this.onAudioDataCallback(pcm16);
    }
  }

  /**
   * Emit turn-taking decision
   * @private
   */
  _emitTurnDecision(decision) {
    if (this.onTurnDecisionCallback) {
      this.onTurnDecisionCallback(decision);
    }
  }

  /**
   * Convert Float32 audio data to PCM16
   * @private
   */
  _float32ToPCM16(float32Array) {
    const pcm16 = new Int16Array(float32Array.length);

    for (let i = 0; i < float32Array.length; i++) {
      // Clamp to [-1, 1] and convert to 16-bit integer
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }

    return pcm16.buffer;
  }

  /**
   * Calculate RMS (Root Mean Square) for VAD
   * @private
   */
  _calculateRMS(samples) {
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i];
    }
    return Math.sqrt(sum / samples.length);
  }

  /**
   * Handle errors
   * @private
   */
  _handleError(error) {
    let message = 'Microphone error';

    if (error.name === 'NotAllowedError') {
      message = 'Microphone permission denied';
    } else if (error.name === 'NotFoundError') {
      message = 'No microphone found';
    } else if (error.name === 'NotReadableError') {
      message = 'Microphone is in use by another application';
    }

    if (this.onErrorCallback) {
      this.onErrorCallback({ name: error.name, message });
    }
  }

  /**
   * Emit voice activity change
   * @private
   */
  _emitVoiceActivity(isSpeaking) {
    if (this.onVoiceActivityCallback) {
      this.onVoiceActivityCallback(isSpeaking);
    }
  }

  /**
   * Emit silence detected (for auto-commit)
   * @private
   */
  _emitSilence() {
    if (this.onSilenceCallback) {
      this.onSilenceCallback();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EVENT CALLBACKS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Register callback for audio data
   * @param {Function} callback - (pcm16: ArrayBuffer) => void
   */
  onAudioData(callback) {
    this.onAudioDataCallback = callback;
  }

  /**
   * Register callback for voice activity changes
   * @param {Function} callback - (isSpeaking: boolean) => void
   */
  onVoiceActivity(callback) {
    this.onVoiceActivityCallback = callback;
  }

  /**
   * Register callback for silence detection
   * @param {Function} callback - () => void
   */
  onSilence(callback) {
    this.onSilenceCallback = callback;
  }

  /**
   * Register callback for errors
   * @param {Function} callback - (error) => void
   */
  onError(callback) {
    this.onErrorCallback = callback;
  }

  /**
   * Register callback for barge-in detection
   * Called when voice is detected while in listening mode
   * @param {Function} callback - () => void
   */
  onBargeIn(callback) {
    this.onBargeInCallback = callback;
  }

  /**
   * Register callback for turn-taking decisions (v2)
   * Called with prosodic analysis and turn decision
   * @param {Function} callback - (decision: TurnDecision) => void
   */
  onTurnDecision(callback) {
    this.onTurnDecisionCallback = callback;
  }

  /**
   * Check if a transcript is a backchannel (for barge-in handling)
   * Delegates to turnTakingModel
   * @param {string} transcript
   * @returns {boolean}
   */
  isBackchannel(transcript) {
    return turnTakingModel.isBackchannel(transcript);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NOISE SUPPRESSION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Enable noise suppression with a preset
   * @param {string} preset - 'light' | 'normal' | 'aggressive' | 'office' | 'outdoor'
   */
  enableNoiseSuppression(preset = 'normal') {
    const presetConfig = NOISE_PRESETS[preset] || NOISE_PRESETS.normal;
    noiseSuppression.enable(presetConfig);
    this.noiseSuppressionEnabled = true;
    this.noiseSuppressionPreset = preset;
    console.log(`[AudioCapture] Noise suppression enabled: ${preset}`);
    return this;
  }

  /**
   * Disable noise suppression
   */
  disableNoiseSuppression() {
    noiseSuppression.disable();
    this.noiseSuppressionEnabled = false;
    console.log('[AudioCapture] Noise suppression disabled');
    return this;
  }

  /**
   * Toggle noise suppression
   */
  toggleNoiseSuppression() {
    if (this.noiseSuppressionEnabled) {
      this.disableNoiseSuppression();
    } else {
      this.enableNoiseSuppression(this.noiseSuppressionPreset);
    }
    return this.noiseSuppressionEnabled;
  }

  /**
   * Set noise suppression preset
   * @param {string} preset - 'light' | 'normal' | 'aggressive' | 'office' | 'outdoor'
   */
  setNoisePreset(preset) {
    this.noiseSuppressionPreset = preset;
    if (this.noiseSuppressionEnabled) {
      this.enableNoiseSuppression(preset);
    }
    return this;
  }

  /**
   * Calibrate noise suppression by analyzing ambient noise
   * Records silence for the specified duration and learns the noise profile
   * @param {number} durationMs - Duration to record silence (default 2000ms)
   */
  async calibrateNoise(durationMs = 2000) {
    if (!this.isCapturing) {
      console.warn('[AudioCapture] Must be capturing to calibrate');
      // Try auto-calibration which handles its own microphone
      return noiseSuppression.startAutoCalibration(durationMs);
    }

    console.log(`[AudioCapture] Starting calibration (${durationMs}ms)`);
    this.isCalibrating = true;
    this.calibrationFrames = [];

    return new Promise((resolve) => {
      setTimeout(() => {
        this.isCalibrating = false;

        if (this.calibrationFrames.length > 0) {
          noiseSuppression.calibrate(this.calibrationFrames);
          console.log(`[AudioCapture] Calibration complete: ${this.calibrationFrames.length} frames`);
          resolve({
            success: true,
            noiseFloor: noiseSuppression.noiseFloor,
            threshold: noiseSuppression.config.noiseGateThreshold,
            framesAnalyzed: this.calibrationFrames.length
          });
        } else {
          console.warn('[AudioCapture] Calibration failed: no frames collected');
          resolve({ success: false });
        }

        this.calibrationFrames = [];
      }, durationMs);
    });
  }

  /**
   * Get noise suppression statistics
   */
  getNoiseSuppressionStats() {
    return {
      enabled: this.noiseSuppressionEnabled,
      preset: this.noiseSuppressionPreset,
      ...noiseSuppression.getStats()
    };
  }

  /**
   * Get available noise presets
   */
  static getNoisePresets() {
    return Object.keys(NOISE_PRESETS);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Check if microphone is available
   */
  static async checkMicrophoneAvailable() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'audioinput');
    } catch (error) {
      return false;
    }
  }

  /**
   * Check microphone permission status
   */
  static async checkPermission() {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' });
      return result.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      // Safari doesn't support permissions API for microphone
      return 'prompt';
    }
  }

  /**
   * Get current capture status
   */
  getStatus() {
    return {
      isCapturing: this.isCapturing,
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      isMuted: this.isMuted,
      bargeInTriggered: this.bargeInTriggered,
      isCalibrating: this.isCalibrating,
      sampleRate: AUDIO_CONFIG.sampleRate,
      noiseSuppression: {
        enabled: this.noiseSuppressionEnabled,
        preset: this.noiseSuppressionPreset,
        isCalibrated: noiseSuppression.isCalibrated,
        noiseFloor: noiseSuppression.noiseFloor
      },
      turnTaking: {
        enabled: this.turnTakingEnabled,
        prosodyEnabled: AUDIO_CONFIG.prosody.enabled,
        state: turnTakingModel.getState()
      }
    };
  }

  /**
   * Get turn-taking statistics
   */
  getTurnTakingStats() {
    return {
      enabled: this.turnTakingEnabled,
      prosodyAnalyzer: prosodyAnalyzer.getState(),
      turnTakingModel: turnTakingModel.getState(),
      audioChunksProcessed: this.audioChunkCount
    };
  }
}

// Singleton instance
export const audioCapture = new AudioCaptureService();

export default audioCapture;
