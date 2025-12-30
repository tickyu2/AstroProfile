/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GROQ WHISPER VOICE PROVIDER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * STT pipeline using Groq's Whisper API.
 * This is the CURRENT implementation - fast and reliable.
 *
 * CHARACTERISTICS:
 * - ~150-200ms STT latency
 * - Excellent transcription accuracy
 * - No paralinguistic cue detection (text only)
 * - Falls back to local Whisper.cpp if needed
 * - FILLER WORD DETECTION for intelligent turn-taking (v2)
 *
 * Created: December 27, 2024
 * Updated: December 28, 2024 - Added filler word detection
 * Part of: GENESIS Voice Mode Enhancement / Conversational AI v2
 */

import {
  VoiceProviderInterface,
  VOICE_PROVIDERS,
  VOICE_CONFIG
} from './voiceProvider.js';

// Import existing Groq Whisper implementation
import { transcribeWithGroqWhisper, isGroqWhisperAvailable } from '../stt/groqWhisper.js';

/**
 * Filler word patterns for turn-taking intelligence
 * These indicate the user is thinking, not finished speaking
 */
const FILLER_PATTERNS = {
  // Thinking fillers - user is processing
  thinking: [
    /\b(um+|uh+|er+|ah+|hmm+)\b/gi,
    /\b(let me (think|see|consider))\b/gi,
    /\b(hold on)\b/gi,
    /\b(give me a (second|moment|sec))\b/gi
  ],

  // Hesitation markers - user is formulating
  hesitation: [
    /\b(well)[,.]?\s*$/gi,           // "Well..." at end
    /\b(so)[,.]?\s*$/gi,             // "So..." at end
    /\b(like)\s*$/gi,                // "like..." at end
    /\b(you know)\s*$/gi,
    /\b(i mean)\s*$/gi
  ],

  // Backchannel responses - user is acknowledging, not interrupting
  backchannels: [
    /^(yeah|yes|yep|yup)\.?$/i,
    /^(uh-huh|uh huh|mhm|mm-hmm|mm hmm)\.?$/i,
    /^(right|okay|ok|i see|got it|sure)\.?$/i
  ],

  // Incomplete sentence markers
  incomplete: [
    /\b(and|but|or|because|so|if|when|while|that)\s*$/gi,
    /,\s*$/                          // Ends with comma
  ]
};

/**
 * Analyze transcript for filler words and turn signals
 * @param {string} text - The transcript text
 * @returns {Object} Analysis results
 */
function analyzeFillers(text) {
  const analysis = {
    hasFillers: false,
    hasPausers: false,
    isBackchannel: false,
    isIncomplete: false,
    fillerCount: 0,
    fillerTypes: [],
    turnSignal: 'normal'  // 'extend' | 'backchannel' | 'incomplete' | 'normal'
  };

  if (!text || typeof text !== 'string') {
    return analysis;
  }

  const trimmed = text.trim();

  // Check for backchannels (short acknowledgments)
  for (const pattern of FILLER_PATTERNS.backchannels) {
    if (pattern.test(trimmed)) {
      analysis.isBackchannel = true;
      analysis.turnSignal = 'backchannel';
      return analysis;
    }
  }

  // Check for thinking fillers
  for (const pattern of FILLER_PATTERNS.thinking) {
    const matches = text.match(pattern);
    if (matches) {
      analysis.hasFillers = true;
      analysis.fillerCount += matches.length;
      analysis.fillerTypes.push('thinking');
    }
  }

  // Check for hesitation markers (especially at end of utterance)
  for (const pattern of FILLER_PATTERNS.hesitation) {
    if (pattern.test(text)) {
      analysis.hasPausers = true;
      analysis.fillerTypes.push('hesitation');
    }
  }

  // Check for incomplete sentence markers
  for (const pattern of FILLER_PATTERNS.incomplete) {
    if (pattern.test(text)) {
      analysis.isIncomplete = true;
      analysis.fillerTypes.push('incomplete');
    }
  }

  // Determine turn signal
  if (analysis.isIncomplete) {
    analysis.turnSignal = 'incomplete';  // Wait longer
  } else if (analysis.hasPausers) {
    analysis.turnSignal = 'extend';      // Extend silence threshold
  } else if (analysis.hasFillers && analysis.fillerCount > 0) {
    analysis.turnSignal = 'extend';      // User is thinking
  }

  return analysis;
}

/**
 * Groq Whisper Voice Provider
 * STT pipeline - converts audio to text, then processes with Claude
 */
export class GroqWhisperProvider extends VoiceProviderInterface {
  constructor(config = {}) {
    super({ ...VOICE_CONFIG.groq, ...config });

    // Transcript buffer
    this.transcripts = [];
  }

  /**
   * Get provider name
   */
  getProviderName() {
    return VOICE_PROVIDERS.GROQ_WHISPER;
  }

  /**
   * This provider does NOT support paralinguistic cues
   * (STT converts to text, losing tonal information)
   */
  supportsCues() {
    return false;
  }

  /**
   * Check if Groq Whisper is available
   */
  async isAvailable() {
    return isGroqWhisperAvailable();
  }

  /**
   * Initialize the provider
   */
  async initialize() {
    const available = await this.isAvailable();
    if (!available) {
      throw new Error('Groq Whisper is not available (no API key)');
    }
    this.isConnected = true;
    console.log('[GroqWhisper] ✅ Provider initialized');
    return true;
  }

  /**
   * Process audio file and return transcript
   * @param {string} audioPath - Path to audio file
   * @param {Object} options - Processing options
   * @returns {Promise<EnrichedTranscript>}
   */
  async processAudio(audioPath, options = {}) {
    const startTime = Date.now();

    try {
      const result = await transcribeWithGroqWhisper(audioPath, {
        model: this.config.model,
        language: this.config.language,
        ...options
      });

      // Analyze for filler words and turn signals (v2)
      const fillerAnalysis = analyzeFillers(result.text);

      const transcript = {
        text: result.text,
        timestamp: Date.now(),
        speaker: 'user',
        cues: [], // No cue detection in STT pipeline
        provider: this.getProviderName(),
        latency: result.duration,
        model: result.model,
        language: result.language || 'en',

        // Filler analysis for turn-taking (v2)
        turnSignal: fillerAnalysis.turnSignal,
        fillerAnalysis: {
          hasFillers: fillerAnalysis.hasFillers,
          hasPausers: fillerAnalysis.hasPausers,
          isBackchannel: fillerAnalysis.isBackchannel,
          isIncomplete: fillerAnalysis.isIncomplete,
          fillerCount: fillerAnalysis.fillerCount,
          types: fillerAnalysis.fillerTypes
        }
      };

      this.transcripts.push(transcript);
      this._emitTranscript(transcript);

      // Log with filler info
      const fillerInfo = fillerAnalysis.hasFillers
        ? ` [${fillerAnalysis.fillerCount} fillers]`
        : fillerAnalysis.isBackchannel
          ? ' [backchannel]'
          : '';
      console.log(`[GroqWhisper] 👤 Transcribed in ${result.duration}ms${fillerInfo}: "${result.text.slice(0, 50)}..."`);

      return transcript;

    } catch (error) {
      console.error('[GroqWhisper] ❌ Transcription failed:', error.message);
      throw error;
    }
  }

  /**
   * Process audio buffer directly (for real-time)
   * @param {Buffer} audioBuffer - Audio data
   * @param {Object} options - Processing options
   */
  async processAudioBuffer(audioBuffer, options = {}) {
    // Groq Whisper needs a file path, so we need to save temp file
    // In production, this would use a temp file or stream
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');

    const tempPath = path.join(os.tmpdir(), `genesis_audio_${Date.now()}.webm`);

    try {
      fs.writeFileSync(tempPath, audioBuffer);
      const result = await this.processAudio(tempPath, options);
      fs.unlinkSync(tempPath); // Clean up
      return result;
    } catch (error) {
      // Clean up on error too
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      throw error;
    }
  }

  /**
   * Start session (no-op for non-streaming provider)
   */
  async startSession(sessionConfig = {}) {
    this.transcripts = [];
    console.log('[GroqWhisper] 🎬 Session started (batch mode)');
    return `groq_${Date.now()}`;
  }

  /**
   * End session
   */
  async endSession() {
    const transcripts = {
      user: [...this.transcripts],
      assistant: [], // Luna transcripts handled separately
      cues: [] // No cues in STT mode
    };

    this.transcripts = [];
    console.log('[GroqWhisper] 🔚 Session ended');
    return transcripts;
  }

  /**
   * Get all transcripts from session
   */
  getTranscripts() {
    return {
      user: this.transcripts,
      luna: [], // Handled separately
      cues: []
    };
  }

  /**
   * Add Luna's response transcript (from TTS or text)
   * @param {string} text - Luna's response text
   */
  addAssistantTranscript(text) {
    // In STT mode, we manually track Luna's transcripts
    // since they come from the separate Claude API call
    return {
      text,
      timestamp: Date.now(),
      speaker: 'luna',
      cues: [],
      provider: this.getProviderName()
    };
  }
}

// Export filler analysis for use in other modules
export { analyzeFillers, FILLER_PATTERNS };

export default GroqWhisperProvider;
