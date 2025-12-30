/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOICE PROVIDER ABSTRACTION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Unified interface for voice processing with multiple backends:
 * - Groq Whisper (STT pipeline - current)
 * - OpenAI Realtime (native voice - faster, preserves cues)
 *
 * HYBRID APPROACH:
 * - Can use either provider based on config
 * - Easy to switch to OpenAI exclusively
 * - Falls back to Groq if OpenAI unavailable
 *
 * PARALINGUISTIC CUES (OpenAI native only):
 * - Tone detection (happy, sad, frustrated, excited)
 * - Non-verbal sounds (sighs, laughter, hesitation)
 * - Emphasis and pacing
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode Enhancement
 */

// Provider types
export const VOICE_PROVIDERS = {
  GROQ_WHISPER: 'groq_whisper',      // STT pipeline (current)
  OPENAI_REALTIME: 'openai_realtime' // Native voice (faster, cues preserved)
};

// Paralinguistic cue types that OpenAI can detect
export const PARALINGUISTIC_CUES = {
  // Emotions
  HAPPY: 'happy',
  SAD: 'sad',
  FRUSTRATED: 'frustrated',
  EXCITED: 'excited',
  ANXIOUS: 'anxious',
  CALM: 'calm',
  DISAPPOINTED: 'disappointed',
  HOPEFUL: 'hopeful',

  // Non-verbal sounds
  SIGH: 'sigh',
  LAUGH: 'laugh',
  HESITATION: 'hesitation',
  WHISPER: 'whisper',
  EMPHASIS: 'emphasis',

  // Pacing
  RUSHED: 'rushed',
  SLOW: 'slow',
  PAUSE: 'pause'
};

// Cue display configuration
export const CUE_DISPLAY = {
  [PARALINGUISTIC_CUES.HAPPY]: { emoji: '😊', label: 'happy', color: '#22c55e' },
  [PARALINGUISTIC_CUES.SAD]: { emoji: '😢', label: 'sad', color: '#6366f1' },
  [PARALINGUISTIC_CUES.FRUSTRATED]: { emoji: '😤', label: 'frustrated', color: '#ef4444' },
  [PARALINGUISTIC_CUES.EXCITED]: { emoji: '🎉', label: 'excited', color: '#f59e0b' },
  [PARALINGUISTIC_CUES.ANXIOUS]: { emoji: '😰', label: 'anxious', color: '#8b5cf6' },
  [PARALINGUISTIC_CUES.CALM]: { emoji: '😌', label: 'calm', color: '#06b6d4' },
  [PARALINGUISTIC_CUES.DISAPPOINTED]: { emoji: '😞', label: 'disappointed', color: '#64748b' },
  [PARALINGUISTIC_CUES.HOPEFUL]: { emoji: '🌟', label: 'hopeful', color: '#eab308' },
  [PARALINGUISTIC_CUES.SIGH]: { emoji: '😮‍💨', label: 'sigh', color: '#94a3b8' },
  [PARALINGUISTIC_CUES.LAUGH]: { emoji: '😄', label: 'laugh', color: '#22c55e' },
  [PARALINGUISTIC_CUES.HESITATION]: { emoji: '🤔', label: 'hesitant', color: '#f97316' },
  [PARALINGUISTIC_CUES.WHISPER]: { emoji: '🤫', label: 'whisper', color: '#a855f7' },
  [PARALINGUISTIC_CUES.EMPHASIS]: { emoji: '❗', label: 'emphasis', color: '#ef4444' },
  [PARALINGUISTIC_CUES.RUSHED]: { emoji: '⚡', label: 'rushed', color: '#f59e0b' },
  [PARALINGUISTIC_CUES.SLOW]: { emoji: '🐢', label: 'slow', color: '#06b6d4' },
  [PARALINGUISTIC_CUES.PAUSE]: { emoji: '⏸️', label: 'pause', color: '#64748b' }
};

/**
 * Voice Provider Configuration
 */
export const VOICE_CONFIG = {
  // Which provider to use (can be changed via settings)
  activeProvider: process.env.VOICE_PROVIDER || VOICE_PROVIDERS.GROQ_WHISPER,

  // Fallback behavior
  fallbackEnabled: true,
  fallbackProvider: VOICE_PROVIDERS.GROQ_WHISPER,

  // OpenAI Realtime settings
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4o-realtime-preview',
    voice: 'alloy', // OpenAI voice for Luna
    modalities: ['text', 'audio'],
    inputAudioFormat: 'pcm16',
    outputAudioFormat: 'pcm16',
    inputAudioTranscription: {
      model: 'whisper-1' // Still get transcripts!
    },
    turnDetection: {
      type: 'server_vad',
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 500
    }
  },

  // Groq Whisper settings (current)
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: 'whisper-large-v3-turbo',
    language: 'en'
  },

  // Cue detection settings
  cueDetection: {
    enabled: true,
    minConfidence: 0.6 // Only show cues with 60%+ confidence
  }
};

/**
 * Transcript with paralinguistic cues
 * @typedef {Object} EnrichedTranscript
 * @property {string} text - The transcribed text
 * @property {number} timestamp - When it was spoken
 * @property {string} speaker - 'user' or 'luna'
 * @property {Array<ParalinguisticCue>} cues - Detected emotional/tonal cues
 * @property {string} provider - Which provider transcribed it
 */

/**
 * Paralinguistic cue detection result
 * @typedef {Object} ParalinguisticCue
 * @property {string} type - Cue type from PARALINGUISTIC_CUES
 * @property {number} confidence - 0-1 confidence score
 * @property {number} startTime - When the cue started (ms from transcript start)
 * @property {number} endTime - When the cue ended
 * @property {string} context - The text segment where cue was detected
 */

/**
 * Abstract Voice Provider Interface
 * Both Groq and OpenAI providers implement this
 */
export class VoiceProviderInterface {
  constructor(config) {
    this.config = config;
    this.isConnected = false;
    this.transcriptCallbacks = [];
    this.audioCallbacks = [];
    this.cueCallbacks = [];
  }

  /**
   * Initialize the provider
   * @returns {Promise<boolean>}
   */
  async initialize() {
    throw new Error('Not implemented');
  }

  /**
   * Check if provider is available
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('Not implemented');
  }

  /**
   * Send audio for processing
   * @param {Buffer|ArrayBuffer} audioData - Audio data
   * @param {Object} options - Processing options
   * @returns {Promise<EnrichedTranscript>}
   */
  async processAudio(audioData, options = {}) {
    throw new Error('Not implemented');
  }

  /**
   * Start real-time streaming session
   * @param {Object} sessionConfig - Session configuration
   * @returns {Promise<void>}
   */
  async startSession(sessionConfig) {
    throw new Error('Not implemented');
  }

  /**
   * End streaming session
   * @returns {Promise<void>}
   */
  async endSession() {
    throw new Error('Not implemented');
  }

  /**
   * Stream audio chunk (for real-time)
   * @param {Buffer} audioChunk
   */
  streamAudio(audioChunk) {
    throw new Error('Not implemented');
  }

  /**
   * Register callback for transcripts
   * @param {Function} callback - (transcript: EnrichedTranscript) => void
   */
  onTranscript(callback) {
    this.transcriptCallbacks.push(callback);
  }

  /**
   * Register callback for audio output
   * @param {Function} callback - (audioData: Buffer) => void
   */
  onAudio(callback) {
    this.audioCallbacks.push(callback);
  }

  /**
   * Register callback for paralinguistic cues
   * @param {Function} callback - (cue: ParalinguisticCue) => void
   */
  onCue(callback) {
    this.cueCallbacks.push(callback);
  }

  /**
   * Emit transcript to all listeners
   * @protected
   */
  _emitTranscript(transcript) {
    this.transcriptCallbacks.forEach(cb => cb(transcript));
  }

  /**
   * Emit audio to all listeners
   * @protected
   */
  _emitAudio(audioData) {
    this.audioCallbacks.forEach(cb => cb(audioData));
  }

  /**
   * Emit cue to all listeners
   * @protected
   */
  _emitCue(cue) {
    this.cueCallbacks.forEach(cb => cb(cue));
  }

  /**
   * Get provider name
   * @returns {string}
   */
  getProviderName() {
    throw new Error('Not implemented');
  }

  /**
   * Check if this provider supports paralinguistic cues
   * @returns {boolean}
   */
  supportsCues() {
    return false;
  }
}

/**
 * Get display info for a paralinguistic cue
 * @param {string} cueType - Cue type from PARALINGUISTIC_CUES
 * @returns {Object} - { emoji, label, color }
 */
export function getCueDisplay(cueType) {
  return CUE_DISPLAY[cueType] || { emoji: '❓', label: cueType, color: '#64748b' };
}

/**
 * Format cues for display in transcript
 * @param {Array<ParalinguisticCue>} cues
 * @returns {string} - Formatted cue string like "😊 happy, 🤔 hesitant"
 */
export function formatCuesForDisplay(cues) {
  if (!cues || cues.length === 0) return '';

  return cues
    .filter(c => c.confidence >= VOICE_CONFIG.cueDetection.minConfidence)
    .map(c => {
      const display = getCueDisplay(c.type);
      return `${display.emoji} ${display.label}`;
    })
    .join(', ');
}

export default {
  VOICE_PROVIDERS,
  PARALINGUISTIC_CUES,
  CUE_DISPLAY,
  VOICE_CONFIG,
  VoiceProviderInterface,
  getCueDisplay,
  formatCuesForDisplay
};
