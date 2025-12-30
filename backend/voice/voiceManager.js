/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOICE MANAGER - Unified Voice Provider Controller
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages voice providers and enables hybrid/fallback behavior.
 *
 * SWITCHING MODES:
 * - OPENAI_FIRST: Try OpenAI Realtime, fall back to Groq
 * - GROQ_ONLY: Always use Groq Whisper (current behavior)
 * - OPENAI_ONLY: Always use OpenAI Realtime (future)
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode Enhancement
 */

import {
  VOICE_PROVIDERS,
  VOICE_CONFIG,
  formatCuesForDisplay
} from './voiceProvider.js';
import { OpenAIRealtimeProvider } from './openaiRealtimeProvider.js';
import { GroqWhisperProvider } from './groqWhisperProvider.js';

// Provider switching strategies
export const VOICE_STRATEGIES = {
  OPENAI_FIRST: 'openai_first',   // Try OpenAI, fall back to Groq
  GROQ_ONLY: 'groq_only',         // Always use Groq (current)
  OPENAI_ONLY: 'openai_only'      // Always use OpenAI (fastest)
};

/**
 * Voice Manager - Controls voice providers with fallback support
 */
class VoiceManager {
  constructor() {
    // Provider instances
    this.providers = {
      [VOICE_PROVIDERS.OPENAI_REALTIME]: null,
      [VOICE_PROVIDERS.GROQ_WHISPER]: null
    };

    // Active provider for current session
    this.activeProvider = null;

    // Strategy (can be changed via settings)
    this.strategy = process.env.VOICE_STRATEGY || VOICE_STRATEGIES.GROQ_ONLY;

    // Session state
    this.currentSession = null;

    // Combined transcripts across providers
    this.sessionTranscripts = {
      user: [],
      luna: [],
      cues: []
    };

    // Callbacks
    this.transcriptCallbacks = [];
    this.audioCallbacks = [];
    this.cueCallbacks = [];
  }

  /**
   * Initialize providers based on strategy
   */
  async initialize() {
    console.log(`[VoiceManager] 🎯 Initializing with strategy: ${this.strategy}`);

    // Always try to initialize Groq (reliable fallback)
    try {
      this.providers[VOICE_PROVIDERS.GROQ_WHISPER] = new GroqWhisperProvider();
      await this.providers[VOICE_PROVIDERS.GROQ_WHISPER].initialize();
      console.log('[VoiceManager] ✅ Groq Whisper ready');
    } catch (error) {
      console.warn('[VoiceManager] ⚠️ Groq Whisper not available:', error.message);
    }

    // Initialize OpenAI if strategy requires it
    if (this.strategy !== VOICE_STRATEGIES.GROQ_ONLY) {
      try {
        this.providers[VOICE_PROVIDERS.OPENAI_REALTIME] = new OpenAIRealtimeProvider();
        const available = await this.providers[VOICE_PROVIDERS.OPENAI_REALTIME].isAvailable();
        if (available) {
          console.log('[VoiceManager] ✅ OpenAI Realtime available');
        } else {
          console.warn('[VoiceManager] ⚠️ OpenAI Realtime not available (no API key)');
          this.providers[VOICE_PROVIDERS.OPENAI_REALTIME] = null;
        }
      } catch (error) {
        console.warn('[VoiceManager] ⚠️ OpenAI Realtime init failed:', error.message);
        this.providers[VOICE_PROVIDERS.OPENAI_REALTIME] = null;
      }
    }

    return this._selectProvider();
  }

  /**
   * Select the best available provider based on strategy
   * @private
   */
  _selectProvider() {
    switch (this.strategy) {
      case VOICE_STRATEGIES.OPENAI_ONLY:
        if (this.providers[VOICE_PROVIDERS.OPENAI_REALTIME]) {
          this.activeProvider = this.providers[VOICE_PROVIDERS.OPENAI_REALTIME];
          console.log('[VoiceManager] 🎤 Using OpenAI Realtime (native voice)');
        } else {
          throw new Error('OpenAI Realtime required but not available');
        }
        break;

      case VOICE_STRATEGIES.OPENAI_FIRST:
        if (this.providers[VOICE_PROVIDERS.OPENAI_REALTIME]) {
          this.activeProvider = this.providers[VOICE_PROVIDERS.OPENAI_REALTIME];
          console.log('[VoiceManager] 🎤 Using OpenAI Realtime (native voice)');
        } else if (this.providers[VOICE_PROVIDERS.GROQ_WHISPER]) {
          this.activeProvider = this.providers[VOICE_PROVIDERS.GROQ_WHISPER];
          console.log('[VoiceManager] 🎤 Fallback to Groq Whisper (STT)');
        } else {
          throw new Error('No voice providers available');
        }
        break;

      case VOICE_STRATEGIES.GROQ_ONLY:
      default:
        if (this.providers[VOICE_PROVIDERS.GROQ_WHISPER]) {
          this.activeProvider = this.providers[VOICE_PROVIDERS.GROQ_WHISPER];
          console.log('[VoiceManager] 🎤 Using Groq Whisper (STT)');
        } else {
          throw new Error('Groq Whisper not available');
        }
        break;
    }

    // Wire up callbacks
    this._wireProviderCallbacks();

    return this.activeProvider;
  }

  /**
   * Wire up provider callbacks to manager callbacks
   * @private
   */
  _wireProviderCallbacks() {
    if (!this.activeProvider) return;

    // Transcript callback
    this.activeProvider.onTranscript((transcript) => {
      // Add to session transcripts
      if (transcript.speaker === 'user') {
        this.sessionTranscripts.user.push(transcript);
      } else {
        this.sessionTranscripts.luna.push(transcript);
      }

      // Forward to listeners
      this.transcriptCallbacks.forEach(cb => cb(transcript));
    });

    // Audio callback (for playback)
    this.activeProvider.onAudio((audioData) => {
      this.audioCallbacks.forEach(cb => cb(audioData));
    });

    // Cue callback (for display)
    this.activeProvider.onCue((cue) => {
      this.sessionTranscripts.cues.push(cue);
      this.cueCallbacks.forEach(cb => cb(cue));
    });
  }

  /**
   * Change strategy and reinitialize
   * @param {string} newStrategy - VOICE_STRATEGIES value
   */
  async setStrategy(newStrategy) {
    if (!Object.values(VOICE_STRATEGIES).includes(newStrategy)) {
      throw new Error(`Invalid strategy: ${newStrategy}`);
    }

    console.log(`[VoiceManager] 🔄 Changing strategy: ${this.strategy} → ${newStrategy}`);
    this.strategy = newStrategy;

    // Reinitialize with new strategy
    await this.initialize();
  }

  /**
   * Start a voice session
   * @param {Object} config - Session configuration
   */
  async startSession(config = {}) {
    if (!this.activeProvider) {
      await this.initialize();
    }

    // Clear previous session transcripts
    this.sessionTranscripts = {
      user: [],
      luna: [],
      cues: []
    };

    // Start provider session
    this.currentSession = await this.activeProvider.startSession(config);

    console.log(`[VoiceManager] 🎬 Session started (${this.activeProvider.getProviderName()})`);

    return {
      sessionId: this.currentSession,
      provider: this.activeProvider.getProviderName(),
      supportsCues: this.activeProvider.supportsCues()
    };
  }

  /**
   * End current voice session
   */
  async endSession() {
    if (!this.activeProvider) {
      return this.sessionTranscripts;
    }

    await this.activeProvider.endSession();

    const transcripts = { ...this.sessionTranscripts };
    this.currentSession = null;

    console.log(`[VoiceManager] 🔚 Session ended (${transcripts.user.length} user, ${transcripts.luna.length} luna transcripts)`);

    return transcripts;
  }

  /**
   * Process audio (file path or buffer)
   * @param {string|Buffer} audio - Audio file path or buffer
   * @param {Object} options - Processing options
   */
  async processAudio(audio, options = {}) {
    if (!this.activeProvider) {
      await this.initialize();
    }

    return this.activeProvider.processAudio(audio, options);
  }

  /**
   * Stream audio chunk (for real-time providers like OpenAI)
   * @param {Buffer} audioChunk - Audio data chunk
   */
  streamAudio(audioChunk) {
    if (this.activeProvider && this.activeProvider.streamAudio) {
      this.activeProvider.streamAudio(audioChunk);
    }
  }

  /**
   * Commit audio buffer (triggers processing for OpenAI)
   */
  commitAudio() {
    if (this.activeProvider && this.activeProvider.commitAudio) {
      this.activeProvider.commitAudio();
    }
  }

  /**
   * Add Luna's response transcript
   * Used when Luna responds via text (Groq mode) or voice (OpenAI mode)
   * @param {string} text - Luna's response text
   */
  addLunaTranscript(text) {
    const transcript = {
      text,
      timestamp: Date.now(),
      speaker: 'luna',
      cues: [],
      provider: this.activeProvider?.getProviderName() || 'unknown'
    };

    this.sessionTranscripts.luna.push(transcript);
    this.transcriptCallbacks.forEach(cb => cb(transcript));

    return transcript;
  }

  /**
   * Register callback for transcripts
   * @param {Function} callback - (transcript) => void
   */
  onTranscript(callback) {
    this.transcriptCallbacks.push(callback);
  }

  /**
   * Register callback for audio output
   * @param {Function} callback - (audioData) => void
   */
  onAudio(callback) {
    this.audioCallbacks.push(callback);
  }

  /**
   * Register callback for paralinguistic cues
   * @param {Function} callback - (cue) => void
   */
  onCue(callback) {
    this.cueCallbacks.push(callback);
  }

  /**
   * Get all transcripts from current session
   */
  getTranscripts() {
    return this.sessionTranscripts;
  }

  /**
   * Get current provider info
   */
  getProviderInfo() {
    if (!this.activeProvider) {
      return {
        provider: null,
        strategy: this.strategy,
        supportsCues: false
      };
    }

    return {
      provider: this.activeProvider.getProviderName(),
      strategy: this.strategy,
      supportsCues: this.activeProvider.supportsCues(),
      isConnected: this.activeProvider.isConnected
    };
  }

  /**
   * Check if paralinguistic cues are available
   */
  supportsCues() {
    return this.activeProvider?.supportsCues() || false;
  }

  /**
   * Format cues for display
   * @param {Array} cues - Array of paralinguistic cues
   */
  formatCues(cues) {
    return formatCuesForDisplay(cues);
  }

  /**
   * Disconnect all providers
   */
  disconnect() {
    Object.values(this.providers).forEach(provider => {
      if (provider && provider.disconnect) {
        provider.disconnect();
      }
    });

    this.activeProvider = null;
    this.currentSession = null;
  }
}

// Singleton instance
export const voiceManager = new VoiceManager();

export default voiceManager;
