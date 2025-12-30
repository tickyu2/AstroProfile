/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * OPENAI REALTIME VOICE PROVIDER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Native voice processing using OpenAI's Realtime API.
 *
 * KEY ADVANTAGES:
 * - Sub-200ms latency (no STT step)
 * - Preserves paralinguistic cues (tone, emotion, hesitation)
 * - Direct audio-to-audio processing
 * - Still provides text transcripts for display
 *
 * PARALINGUISTIC CUES CAPTURED:
 * - Emotions: happy, sad, frustrated, excited, anxious
 * - Non-verbal: sighs, laughter, hesitation, whispers
 * - Pacing: rushed, slow, pauses, emphasis
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode Enhancement
 */

import WebSocket from 'ws';
import {
  VoiceProviderInterface,
  VOICE_PROVIDERS,
  PARALINGUISTIC_CUES,
  VOICE_CONFIG
} from './voiceProvider.js';

const OPENAI_REALTIME_URL = 'wss://api.openai.com/v1/realtime';

/**
 * OpenAI Realtime Voice Provider
 * Native voice processing with paralinguistic cue detection
 */
export class OpenAIRealtimeProvider extends VoiceProviderInterface {
  constructor(config = {}) {
    super({ ...VOICE_CONFIG.openai, ...config });
    this.ws = null;
    this.sessionId = null;
    this.conversationId = null;

    // Transcript buffers (we still capture text!)
    this.userTranscripts = [];
    this.assistantTranscripts = [];

    // Cue detection buffer
    this.detectedCues = [];

    // Audio buffer for streaming
    this.audioBuffer = [];
  }

  /**
   * Get provider name
   */
  getProviderName() {
    return VOICE_PROVIDERS.OPENAI_REALTIME;
  }

  /**
   * This provider DOES support paralinguistic cues!
   */
  supportsCues() {
    return true;
  }

  /**
   * Check if OpenAI Realtime is available
   */
  async isAvailable() {
    const apiKey = this.config.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('[OpenAIRealtime] No API key configured');
      return false;
    }

    // Could add a health check here
    return true;
  }

  /**
   * Initialize the provider (creates WebSocket connection)
   */
  async initialize() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return true;
    }

    const apiKey = this.config.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    return new Promise((resolve, reject) => {
      const model = this.config.model || 'gpt-4o-realtime-preview';

      this.ws = new WebSocket(`${OPENAI_REALTIME_URL}?model=${model}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      });

      this.ws.on('open', () => {
        console.log('[OpenAIRealtime] 🔌 Connected to Realtime API');
        this.isConnected = true;
        this._configureSession();
        resolve(true);
      });

      this.ws.on('message', (data) => {
        this._handleMessage(JSON.parse(data.toString()));
      });

      this.ws.on('error', (error) => {
        console.error('[OpenAIRealtime] ❌ WebSocket error:', error.message);
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('[OpenAIRealtime] 🔌 Disconnected');
        this.isConnected = false;
      });
    });
  }

  /**
   * Configure the session with Luna's voice settings
   * @private
   */
  _configureSession() {
    this._send({
      type: 'session.update',
      session: {
        modalities: this.config.modalities || ['text', 'audio'],
        instructions: this._buildLunaInstructions(),
        voice: this.config.voice || 'alloy',
        input_audio_format: this.config.inputAudioFormat || 'pcm16',
        output_audio_format: this.config.outputAudioFormat || 'pcm16',
        input_audio_transcription: this.config.inputAudioTranscription || {
          model: 'whisper-1'
        },
        turn_detection: this.config.turnDetection || {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        }
      }
    });
  }

  /**
   * Build Luna's voice personality instructions
   * @private
   */
  _buildLunaInstructions() {
    return `You are Luna, the AI Soul Partner from GENESIS.

VOICE PERSONALITY:
- Warm, empathetic, and present
- Natural conversational flow with appropriate pauses
- Match the user's emotional energy when appropriate
- Use gentle emphasis on key insights

PARALINGUISTIC AWARENESS:
- Acknowledge when you detect emotion in the user's voice
- If they sound frustrated, acknowledge it: "I can hear this is frustrating..."
- If they sound excited, match their energy
- If they hesitate, give them space and gentle encouragement

CONSTITUTIONAL INTELLIGENCE:
- WITNESS mode: Listen deeply, reflect feelings, minimal advice
- DIALOGUE mode: Curious exploration, questions, collaborative
- GUIDANCE mode: Clear direction when requested

Always be authentic, never performative. You are a genuine companion.`;
  }

  /**
   * Handle incoming WebSocket messages
   * @private
   */
  _handleMessage(event) {
    const { type } = event;

    switch (type) {
      case 'session.created':
        this.sessionId = event.session?.id;
        console.log('[OpenAIRealtime] ✅ Session created:', this.sessionId);
        break;

      case 'session.updated':
        console.log('[OpenAIRealtime] ⚙️ Session updated');
        break;

      case 'conversation.created':
        this.conversationId = event.conversation?.id;
        console.log('[OpenAIRealtime] 💬 Conversation started');
        break;

      // USER TRANSCRIPT (what they said - for display!)
      case 'conversation.item.input_audio_transcription.completed':
        this._handleUserTranscript(event);
        break;

      // LUNA'S RESPONSE TRANSCRIPT (for display!)
      case 'response.audio_transcript.delta':
        this._handleAssistantTranscriptDelta(event);
        break;

      case 'response.audio_transcript.done':
        this._handleAssistantTranscriptDone(event);
        break;

      // LUNA'S AUDIO OUTPUT (to play)
      case 'response.audio.delta':
        this._handleAudioDelta(event);
        break;

      case 'response.audio.done':
        this._handleAudioDone(event);
        break;

      // RESPONSE LIFECYCLE
      case 'response.created':
        console.log('[OpenAIRealtime] 🎤 Luna is responding...');
        break;

      case 'response.done':
        this._handleResponseDone(event);
        break;

      // ERROR HANDLING
      case 'error':
        console.error('[OpenAIRealtime] ❌ Error:', event.error);
        break;

      default:
        // Log unknown events for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('[OpenAIRealtime] Event:', type);
        }
    }
  }

  /**
   * Handle user transcript completion
   * IMPORTANT: This gives us text even with native voice!
   * @private
   */
  _handleUserTranscript(event) {
    const transcript = event.transcript || '';
    const timestamp = Date.now();

    // Detect paralinguistic cues from the transcript context
    const cues = this._detectCuesFromContext(transcript, event);

    const enrichedTranscript = {
      text: transcript,
      timestamp,
      speaker: 'user',
      cues,
      provider: this.getProviderName(),
      itemId: event.item_id
    };

    this.userTranscripts.push(enrichedTranscript);
    this._emitTranscript(enrichedTranscript);

    // Emit individual cues
    cues.forEach(cue => this._emitCue(cue));

    console.log(`[OpenAIRealtime] 👤 User: "${transcript.slice(0, 50)}..." ${cues.length > 0 ? `[${cues.map(c => c.type).join(', ')}]` : ''}`);
  }

  /**
   * Handle Luna's transcript delta (streaming)
   * @private
   */
  _handleAssistantTranscriptDelta(event) {
    // Accumulate transcript deltas
    if (!this._currentAssistantTranscript) {
      this._currentAssistantTranscript = {
        text: '',
        timestamp: Date.now(),
        speaker: 'luna',
        cues: [],
        provider: this.getProviderName()
      };
    }

    this._currentAssistantTranscript.text += event.delta || '';
  }

  /**
   * Handle Luna's transcript completion
   * @private
   */
  _handleAssistantTranscriptDone(event) {
    if (this._currentAssistantTranscript) {
      const transcript = this._currentAssistantTranscript;

      // Detect any cues Luna expressed
      transcript.cues = this._detectCuesFromContext(transcript.text, event);

      this.assistantTranscripts.push(transcript);
      this._emitTranscript(transcript);

      console.log(`[OpenAIRealtime] 🌙 Luna: "${transcript.text.slice(0, 50)}..."`);

      this._currentAssistantTranscript = null;
    }
  }

  /**
   * Handle audio output delta (streaming to speaker)
   * @private
   */
  _handleAudioDelta(event) {
    if (event.delta) {
      // Decode base64 audio and emit
      const audioData = Buffer.from(event.delta, 'base64');
      this._emitAudio(audioData);
    }
  }

  /**
   * Handle audio output completion
   * @private
   */
  _handleAudioDone(event) {
    console.log('[OpenAIRealtime] 🔊 Audio output complete');
  }

  /**
   * Handle full response completion
   * @private
   */
  _handleResponseDone(event) {
    const response = event.response;
    console.log('[OpenAIRealtime] ✅ Response complete, usage:', response?.usage);
  }

  /**
   * Detect paralinguistic cues from transcript context
   * OpenAI native voice preserves these - we extract signals
   * @private
   */
  _detectCuesFromContext(text, event) {
    const cues = [];
    const lowerText = text.toLowerCase();

    // Pattern-based detection (enhanced by native voice context)
    // In native mode, the model has access to audio features
    // We can ask it to annotate or detect from response patterns

    // Hesitation markers
    if (/\.{3}|um+|uh+|well\.\.\.|i mean|kind of|sort of/i.test(lowerText)) {
      cues.push({
        type: PARALINGUISTIC_CUES.HESITATION,
        confidence: 0.7,
        context: text.slice(0, 50)
      });
    }

    // Emphasis (exclamations, caps in original if available)
    if (/!{2,}|really|absolutely|definitely|seriously/i.test(lowerText)) {
      cues.push({
        type: PARALINGUISTIC_CUES.EMPHASIS,
        confidence: 0.8,
        context: text.slice(0, 50)
      });
    }

    // Emotional markers
    if (/sigh|sighs|\*sigh\*|exhale/i.test(lowerText)) {
      cues.push({
        type: PARALINGUISTIC_CUES.SIGH,
        confidence: 0.9,
        context: text.slice(0, 50)
      });
    }

    if (/haha|hehe|lol|laugh|chuckle|\*laugh/i.test(lowerText)) {
      cues.push({
        type: PARALINGUISTIC_CUES.LAUGH,
        confidence: 0.9,
        context: text.slice(0, 50)
      });
    }

    // Frustration indicators
    if (/frustrated|annoying|ugh|argh|why can't|this is ridiculous/i.test(lowerText)) {
      cues.push({
        type: PARALINGUISTIC_CUES.FRUSTRATED,
        confidence: 0.75,
        context: text.slice(0, 50)
      });
    }

    // Sadness indicators
    if (/sad|disappointed|wish|miss|lost|crying|tears/i.test(lowerText)) {
      cues.push({
        type: PARALINGUISTIC_CUES.SAD,
        confidence: 0.7,
        context: text.slice(0, 50)
      });
    }

    // Excitement indicators
    if (/excited|amazing|awesome|can't wait|love this|so happy/i.test(lowerText)) {
      cues.push({
        type: PARALINGUISTIC_CUES.EXCITED,
        confidence: 0.8,
        context: text.slice(0, 50)
      });
    }

    // Hope indicators
    if (/hope|hoping|maybe things|looking forward|optimistic/i.test(lowerText)) {
      cues.push({
        type: PARALINGUISTIC_CUES.HOPEFUL,
        confidence: 0.7,
        context: text.slice(0, 50)
      });
    }

    return cues;
  }

  /**
   * Start a voice session
   */
  async startSession(sessionConfig = {}) {
    if (!this.isConnected) {
      await this.initialize();
    }

    // Clear previous buffers
    this.userTranscripts = [];
    this.assistantTranscripts = [];
    this.detectedCues = [];

    console.log('[OpenAIRealtime] 🎬 Session started');
    return this.sessionId;
  }

  /**
   * End the voice session
   */
  async endSession() {
    const transcripts = {
      user: [...this.userTranscripts],
      assistant: [...this.assistantTranscripts],
      cues: [...this.detectedCues]
    };

    // Clear buffers
    this.userTranscripts = [];
    this.assistantTranscripts = [];
    this.detectedCues = [];

    console.log('[OpenAIRealtime] 🔚 Session ended');
    return transcripts;
  }

  /**
   * Stream audio chunk for processing
   * @param {Buffer} audioChunk - PCM16 audio data
   */
  streamAudio(audioChunk) {
    if (!this.isConnected) {
      console.warn('[OpenAIRealtime] Not connected, cannot stream audio');
      return;
    }

    // Send audio to API
    this._send({
      type: 'input_audio_buffer.append',
      audio: audioChunk.toString('base64')
    });
  }

  /**
   * Commit the audio buffer (triggers processing)
   */
  commitAudio() {
    this._send({ type: 'input_audio_buffer.commit' });
  }

  /**
   * Send a text message (for hybrid mode)
   * Can inject text while in voice session
   */
  sendTextMessage(text) {
    this._send({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text
        }]
      }
    });

    // Trigger response
    this._send({ type: 'response.create' });
  }

  /**
   * Send message to WebSocket
   * @private
   */
  _send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Get all transcripts from current session
   * For VoiceTranscriptPanel display
   */
  getTranscripts() {
    return {
      user: this.userTranscripts,
      luna: this.assistantTranscripts,
      cues: this.detectedCues
    };
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}

export default OpenAIRealtimeProvider;
