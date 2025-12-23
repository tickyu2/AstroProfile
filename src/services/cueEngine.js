/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CUE ENGINE - Emotion-Aware Active Listening Audio Service
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Generates and plays active listening cues:
 * - Backchannels ("mm-hmm", "uh-huh")
 * - Verbal encouragers ("I see...", "Right...")
 * - Continuation signals ("Go on...", "Take your time...")
 *
 * Now emotion-aware with probabilistic generation:
 * - Adapts cue timing based on detected emotion
 * - Selects appropriate phrases for emotional context
 * - Adjusts TTS parameters (rate, pitch, volume) per emotion
 * - Probabilistic cue generation (not every pause triggers a cue)
 *
 * Can use:
 * - Pre-recorded audio clips
 * - Web Speech API (browser TTS)
 * - ElevenLabs TTS (for premium experience)
 *
 * Created: December 21, 2025
 * Updated: December 21, 2025 - Added emotion awareness + probabilistic cues
 */

import { CUE_TYPES } from '../components/voice/talkStates';
import {
  EmotionBehaviorMap,
  getEncourager,
  getBackchannel,
  getContinuation
} from './emotionBehaviorMap';
import {
  EmotionCueMap,
  BASE_CUE_PROBABILITY,
  EmotionProbabilityBoost,
  getRandomCue as getEmotionRandomCue,
  getCueProbability,
  shouldGenerateCue,
  getCueTypeForZone,
  maybeGenerateCue as probabilisticMaybeGenerate
} from '../components/voice/emotionCueMap';

/**
 * Cue Engine configuration
 */
const CONFIG = {
  useTTS: true,           // Use TTS for cues (vs pre-recorded)
  volume: 0.5,            // Cue volume (0-1)
  rate: 0.9,              // TTS rate for cues (slower = gentler)
  pitch: 1.0,             // TTS pitch
  preferredVoice: null,   // Browser TTS voice preference
};

/**
 * Audio context for cues
 */
let audioContext = null;

/**
 * Get or create audio context
 */
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a cue using Web Speech API
 *
 * @param {string} text - Cue text to speak
 * @param {Object} options - TTS options
 * @returns {Promise<void>}
 */
async function speakCue(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      console.warn('[CueEngine] Speech synthesis not available');
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = options.volume ?? CONFIG.volume;
    utterance.rate = options.rate ?? CONFIG.rate;
    utterance.pitch = options.pitch ?? CONFIG.pitch;

    // Try to find a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Google') ||
      v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.error('[CueEngine] TTS error:', e);
      resolve(); // Don't reject, just continue
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Play a soft "mm" backchannel sound
 * Uses oscillator for a natural humming sound
 */
async function playBackchannelSound() {
  try {
    const ctx = getAudioContext();

    // Create oscillator for "mm" sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime); // Low hum
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);

    return new Promise(resolve => setTimeout(resolve, 400));
  } catch (e) {
    console.error('[CueEngine] Backchannel sound error:', e);
  }
}

/**
 * TTS parameters per emotion
 * Adjusts how cues sound based on detected emotion
 */
const EMOTION_TTS_PARAMS = {
  neutral: { rate: 0.9, pitch: 1.0, volume: 0.5 },
  happy: { rate: 1.0, pitch: 1.1, volume: 0.6 },
  sad: { rate: 0.75, pitch: 0.9, volume: 0.4 },
  angry: { rate: 0.8, pitch: 0.95, volume: 0.45 },
  anxious: { rate: 0.85, pitch: 1.0, volume: 0.4 },
  surprised: { rate: 0.95, pitch: 1.05, volume: 0.55 },
  disgusted: { rate: 0.85, pitch: 0.95, volume: 0.45 }
};

/**
 * Cue Engine class - Emotion-Aware
 */
class CueEngine {
  constructor() {
    this.enabled = true;
    this.lastCueTime = 0;
    this.minInterval = 800; // ms between cues (default)
    this.config = { ...CONFIG };
    this.currentEmotion = 'neutral';
    this.emotionConfidence = 0.5;
    this.useProbabilisticCues = true; // Enable probabilistic cue generation
    this.cueHistory = []; // Track recent cues for variety
  }

  /**
   * Configure the cue engine
   */
  configure(options) {
    this.config = { ...this.config, ...options };
  }

  /**
   * Enable/disable cue engine
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Set current emotion for adaptive behavior
   * @param {string} emotion - Primary emotion
   * @param {number} confidence - Detection confidence (0-1)
   */
  setEmotion(emotion, confidence = 0.5) {
    this.currentEmotion = emotion || 'neutral';
    this.emotionConfidence = Math.max(0, Math.min(1, confidence));

    // Update min interval based on emotion if behavior map has it
    if (EmotionBehaviorMap[emotion]?.cueInterval) {
      this.minInterval = EmotionBehaviorMap[emotion].cueInterval;
    }
  }

  /**
   * Enable/disable probabilistic cue generation
   * @param {boolean} enabled
   */
  setProbabilisticCues(enabled) {
    this.useProbabilisticCues = enabled;
  }

  /**
   * Get TTS parameters for current emotion
   */
  getEmotionTTSParams() {
    return EMOTION_TTS_PARAMS[this.currentEmotion] || EMOTION_TTS_PARAMS.neutral;
  }

  /**
   * Check if enough time has passed since last cue
   */
  canPlayCue() {
    const now = performance.now();
    if (now - this.lastCueTime < this.minInterval) {
      return false;
    }
    return true;
  }

  /**
   * Play a backchannel cue ("mm", "uh-huh")
   * @param {Object} cue - Cue object (optional, will use emotion-appropriate if not provided)
   */
  async playBackchannel(cue) {
    if (!this.enabled || !this.canPlayCue()) return;
    this.lastCueTime = performance.now();

    // Get emotion-appropriate backchannel if no cue provided
    const text = cue?.text || getBackchannel(this.currentEmotion);
    console.log('[CueEngine] Backchannel:', text, `(emotion: ${this.currentEmotion})`);

    // Use sound effect for backchannels (more natural than TTS)
    await playBackchannelSound();
  }

  /**
   * Play an encourager cue ("I see...", "Right...")
   * @param {Object} cue - Cue object (optional, will use emotion-appropriate if not provided)
   */
  async playEncourager(cue) {
    if (!this.enabled || !this.canPlayCue()) return;
    this.lastCueTime = performance.now();

    // Get emotion-appropriate encourager if no cue provided
    const text = cue?.text || getEncourager(this.currentEmotion);
    const params = this.getEmotionTTSParams();

    console.log('[CueEngine] Encourager:', text, `(emotion: ${this.currentEmotion})`);

    if (this.config.useTTS && text) {
      await speakCue(text, {
        volume: params.volume * 0.8,
        rate: params.rate * 0.95,
        pitch: params.pitch * 0.95
      });
    }
  }

  /**
   * Play a continuation cue ("Go on...", "I'm listening...")
   * @param {Object} cue - Cue object (optional, will use emotion-appropriate if not provided)
   */
  async playContinuation(cue) {
    if (!this.enabled || !this.canPlayCue()) return;
    this.lastCueTime = performance.now();

    // Get emotion-appropriate continuation if no cue provided
    const text = cue?.text || getContinuation(this.currentEmotion);
    const params = this.getEmotionTTSParams();

    console.log('[CueEngine] Continuation:', text, `(emotion: ${this.currentEmotion})`);

    if (this.config.useTTS && text) {
      await speakCue(text, {
        volume: params.volume,
        rate: params.rate * 0.9,
        pitch: params.pitch
      });
    }
  }

  /**
   * Play any cue by type
   * @param {string} type - Cue type
   * @param {Object} cue - Cue object (optional)
   */
  async playCue(type, cue) {
    switch (type) {
      case CUE_TYPES.BACKCHANNEL:
        return this.playBackchannel(cue);
      case CUE_TYPES.ENCOURAGER:
        return this.playEncourager(cue);
      case CUE_TYPES.CONTINUATION:
        return this.playContinuation(cue);
      default:
        console.warn('[CueEngine] Unknown cue type:', type);
    }
  }

  /**
   * Play an emotion-adaptive cue
   * Automatically selects the right cue type based on emotion and context
   * @param {string} type - Cue type
   * @param {string} emotion - Primary emotion
   */
  async playEmotionCue(type, emotion) {
    this.setEmotion(emotion);
    return this.playCue(type);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROBABILISTIC CUE GENERATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Maybe play a cue based on probability.
   * This is the main entry point for natural, human-like cue generation.
   *
   * @param {string} pauseZone - 'MICRO_PAUSE' | 'SHORT_PAUSE' | 'THINKING_PAUSE'
   * @param {Object} options - Optional overrides
   * @returns {Promise<Object|null>} Played cue info or null if skipped
   */
  async maybePlayCue(pauseZone, options = {}) {
    if (!this.enabled || !this.canPlayCue()) {
      return null;
    }

    const emotion = options.emotion || this.currentEmotion;
    const confidence = options.confidence ?? this.emotionConfidence;

    // Check if we should even generate a cue (probabilistic)
    if (this.useProbabilisticCues) {
      const result = probabilisticMaybeGenerate(pauseZone, emotion, confidence);

      if (!result) {
        // Probability check failed - stay silent this time
        return null;
      }

      // Avoid repeating the same cue
      if (this.cueHistory.includes(result.cue)) {
        // Try once more with different random selection
        const retry = probabilisticMaybeGenerate(pauseZone, emotion, confidence);
        if (retry && !this.cueHistory.includes(retry.cue)) {
          return await this._playCueText(retry);
        }
        return null; // Skip if still duplicate
      }

      return await this._playCueText(result);
    }

    // Non-probabilistic fallback: always play if time allows
    const cueType = getCueTypeForZone(pauseZone);
    const cueText = getEmotionRandomCue(emotion, cueType);

    return await this._playCueText({
      cue: cueText,
      type: cueType,
      emotion,
      pauseZone
    });
  }

  /**
   * Internal: Play a cue and update history
   * @private
   */
  async _playCueText(cueInfo) {
    this.lastCueTime = performance.now();

    // Track for variety (keep last 5)
    this.cueHistory.push(cueInfo.cue);
    if (this.cueHistory.length > 5) {
      this.cueHistory.shift();
    }

    const params = this.getEmotionTTSParams();

    console.log(
      `[CueEngine] ${cueInfo.type}:`,
      cueInfo.cue,
      `(${cueInfo.emotion}, prob: ${(cueInfo.probability * 100).toFixed(0)}%)`
    );

    // Decide how to play based on cue type
    if (cueInfo.type === 'backchannels') {
      // Backchannels use humming sound for naturalness
      await playBackchannelSound();
    } else if (this.config.useTTS) {
      // Encouragers and continuations use TTS
      await speakCue(cueInfo.cue, {
        volume: params.volume * (cueInfo.type === 'encouragers' ? 0.8 : 1),
        rate: params.rate * (cueInfo.type === 'continuations' ? 0.9 : 0.95),
        pitch: params.pitch
      });
    }

    return {
      ...cueInfo,
      timestamp: Date.now(),
      ttsParams: params
    };
  }

  /**
   * Get the current probability for a specific pause zone
   * Useful for debugging and UI display
   *
   * @param {string} pauseZone - Pause zone
   * @returns {number} Probability 0-1
   */
  getCurrentProbability(pauseZone) {
    return getCueProbability(pauseZone, this.currentEmotion, this.emotionConfidence);
  }

  /**
   * Get available cues for current emotion
   * Useful for debugging and testing
   *
   * @returns {Object} Cues by type
   */
  getAvailableCues() {
    const emotionCues = EmotionCueMap[this.currentEmotion] || EmotionCueMap.neutral;
    return {
      emotion: this.currentEmotion,
      confidence: this.emotionConfidence,
      backchannels: emotionCues.backchannels,
      encouragers: emotionCues.encouragers,
      continuations: emotionCues.continuations,
      probabilities: {
        MICRO_PAUSE: this.getCurrentProbability('MICRO_PAUSE'),
        SHORT_PAUSE: this.getCurrentProbability('SHORT_PAUSE'),
        THINKING_PAUSE: this.getCurrentProbability('THINKING_PAUSE')
      }
    };
  }

  /**
   * Clear cue history (useful when starting new conversation)
   */
  clearHistory() {
    this.cueHistory = [];
    this.lastCueTime = 0;
  }
}

// Singleton instance
export const cueEngine = new CueEngine();

// Re-export useful functions from emotionCueMap
export {
  EmotionCueMap,
  BASE_CUE_PROBABILITY,
  EmotionProbabilityBoost,
  getCueProbability,
  shouldGenerateCue
};

export default cueEngine;
