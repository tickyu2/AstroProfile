/**
 * ===============================================================================
 * VOICE WEBSOCKET SERVICE
 * ===============================================================================
 *
 * Frontend service for real-time voice communication with the backend.
 * Handles WebSocket connection, audio streaming, and transcript reception.
 *
 * FEATURES:
 * - Cloud Run WebSocket primary connection
 * - Automatic fallback to browser-based voice
 * - Audio quality presets
 * - Rate limit handling
 *
 * USAGE:
 *   import { voiceWS } from './voiceWebSocketService';
 *
 *   // Connect with auto-fallback
 *   await voiceWS.connect();
 *   await voiceWS.startSession({ profileId: 'abc123', strategy: 'openai_first' });
 *
 *   // Stream audio
 *   voiceWS.sendAudio(audioChunk);
 *   voiceWS.commit(); // End of utterance
 *
 *   // Listen for events
 *   voiceWS.onTranscript((t) => console.log(t));
 *   voiceWS.onAudio((audio) => playAudio(audio));
 *
 * Created: December 27, 2024
 * Updated: December 28, 2024 - Added Cloud Run + fallback support
 * Part of: GENESIS Voice Mode Enhancement
 */

import {
  getWebSocketUrl,
  checkCloudRunHealth,
  detectBestVoiceMode,
  VOICE_MODE,
  AUDIO_PRESETS,
  DEFAULT_PRESET
} from '../config/voiceConfig';

// WebSocket endpoint configuration
const WS_CONFIG = {
  // Dynamic URL based on environment and availability
  getUrl: getWebSocketUrl,
  reconnectDelay: 2000,
  maxReconnectAttempts: 5,
  connectionTimeout: 5000
};

/**
 * Voice WebSocket Service
 */
class VoiceWebSocketService {
  constructor() {
    this.ws = null;
    this.clientId = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;

    // Session state
    this.sessionId = null;
    this.provider = null;
    this.supportsCues = false;

    // Voice mode (cloud_run, local, browser)
    this.voiceMode = VOICE_MODE.AUTO;
    this.detectedMode = null;

    // Audio preset
    this.audioPreset = DEFAULT_PRESET;

    // Fallback state
    this.useFallback = false;

    // Callbacks
    this.callbacks = {
      onConnect: [],
      onDisconnect: [],
      onTranscript: [],
      onAudio: [],
      onCue: [],
      onError: [],
      onSessionStart: [],
      onSessionEnd: [],
      onPlaybackEnded: [], // For echo cancellation
      onModeChange: [],    // When voice mode changes
      onFallback: []       // When falling back to browser mode
    };

    // Audio context for playback
    this.audioContext = null;
    this.audioQueue = [];
    this.isPlaying = false;
  }

  /**
   * Connect to WebSocket server with auto-detection and fallback
   */
  async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[VoiceWS] Already connected');
      return Promise.resolve();
    }

    // Auto-detect best mode if set to AUTO
    if (this.voiceMode === VOICE_MODE.AUTO) {
      console.log('[VoiceWS] Detecting best voice mode...');
      this.detectedMode = await detectBestVoiceMode();
      console.log('[VoiceWS] Detected mode:', this.detectedMode);

      // If browser mode detected, set fallback flag and resolve
      if (this.detectedMode === VOICE_MODE.BROWSER) {
        this.useFallback = true;
        this._emit('onFallback', { reason: 'Cloud Run not available' });
        this._emit('onModeChange', { mode: VOICE_MODE.BROWSER });
        console.log('[VoiceWS] Using browser fallback mode');
        return Promise.resolve();
      }
    }

    return new Promise((resolve, reject) => {
      const url = WS_CONFIG.getUrl();
      console.log('[VoiceWS] Connecting to:', url);

      // Connection timeout
      const timeout = setTimeout(() => {
        console.warn('[VoiceWS] Connection timeout, falling back to browser mode');
        this.useFallback = true;
        this._emit('onFallback', { reason: 'Connection timeout' });
        this._emit('onModeChange', { mode: VOICE_MODE.BROWSER });
        resolve(); // Resolve anyway, we'll use fallback
      }, WS_CONFIG.connectionTimeout);

      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          console.log('[VoiceWS] Connected to Cloud Run');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.useFallback = false;
          this._emit('onConnect');
          this._emit('onModeChange', { mode: this.detectedMode || VOICE_MODE.CLOUD_RUN });
          resolve();
        };

        this.ws.onclose = (event) => {
          clearTimeout(timeout);
          console.log('[VoiceWS] Disconnected:', event.code, event.reason);
          this.isConnected = false;
          this._emit('onDisconnect', { code: event.code, reason: event.reason });

          // If rate limited (4029), don't reconnect immediately
          if (event.code === 4029) {
            console.warn('[VoiceWS] Rate limited, falling back to browser mode');
            this.useFallback = true;
            this._emit('onFallback', { reason: event.reason || 'Rate limited' });
          } else {
            this._handleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          console.error('[VoiceWS] Error:', error);
          this._emit('onError', { message: 'WebSocket error' });

          // On error, enable fallback but don't reject (allow graceful degradation)
          if (!this.isConnected) {
            console.log('[VoiceWS] Enabling browser fallback due to connection error');
            this.useFallback = true;
            this._emit('onFallback', { reason: 'Connection error' });
            resolve();
          }
        };

        this.ws.onmessage = (event) => {
          this._handleMessage(JSON.parse(event.data));
        };

      } catch (error) {
        clearTimeout(timeout);
        console.error('[VoiceWS] Connection failed:', error);
        console.log('[VoiceWS] Enabling browser fallback');
        this.useFallback = true;
        this._emit('onFallback', { reason: error.message });
        resolve(); // Resolve anyway for graceful degradation
      }
    });
  }

  /**
   * Check if using fallback browser mode
   */
  isFallbackMode() {
    return this.useFallback;
  }

  /**
   * Get current voice mode
   */
  getVoiceMode() {
    if (this.useFallback) return VOICE_MODE.BROWSER;
    return this.detectedMode || this.voiceMode;
  }

  /**
   * Set audio quality preset
   * @param {string} preset - 'fast' | 'balanced' | 'quality'
   */
  setAudioPreset(preset) {
    if (AUDIO_PRESETS[preset]) {
      this.audioPreset = preset;
      if (this.isConnected) {
        this._send({ type: 'set_preset', preset });
      }
    }
  }

  /**
   * Get available presets
   */
  getAvailablePresets() {
    return AUDIO_PRESETS;
  }

  /**
   * Register callback for fallback mode
   */
  onFallback(callback) {
    this.callbacks.onFallback.push(callback);
    return () => this._removeCallback('onFallback', callback);
  }

  /**
   * Register callback for mode change
   */
  onModeChange(callback) {
    this.callbacks.onModeChange.push(callback);
    return () => this._removeCallback('onModeChange', callback);
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.sessionId = null;
  }

  /**
   * Start a voice session
   * @param {Object} options - { profileId, sessionId?, strategy? }
   */
  async startSession(options = {}) {
    if (!this.isConnected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Session start timeout'));
      }, 10000);

      // One-time listener for session start
      const onSessionStart = (result) => {
        clearTimeout(timeout);
        this.sessionId = result.sessionId;
        this.provider = result.provider;
        this.supportsCues = result.supportsCues;
        resolve(result);
      };

      this.callbacks.onSessionStart.push(onSessionStart);

      this._send({
        type: 'start_session',
        profileId: options.profileId,
        sessionId: options.sessionId,
        strategy: options.strategy
      });
    });
  }

  /**
   * End current voice session
   */
  async endSession() {
    if (!this.sessionId) return;

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ user: [], luna: [], cues: [] });
      }, 5000);

      const onSessionEnd = (result) => {
        clearTimeout(timeout);
        this.sessionId = null;
        resolve(result.transcripts);
      };

      this.callbacks.onSessionEnd.push(onSessionEnd);

      this._send({ type: 'end_session' });
    });
  }

  /**
   * Send audio chunk to server
   * @param {ArrayBuffer|Uint8Array} audioData - PCM16 audio data
   */
  sendAudio(audioData) {
    if (!this.isConnected || !this.sessionId) {
      console.warn('[VoiceWS] Cannot send audio: not in session');
      return;
    }

    // Convert to base64
    const base64 = this._arrayBufferToBase64(audioData);

    this._send({
      type: 'audio',
      data: base64
    });
  }

  /**
   * Commit audio buffer (signal end of utterance)
   */
  commit() {
    if (!this.isConnected || !this.sessionId) return;
    this._send({ type: 'commit' });
  }

  /**
   * Change voice strategy
   * @param {string} strategy - 'groq_only' | 'openai_first' | 'openai_only'
   */
  setStrategy(strategy) {
    this._send({
      type: 'set_strategy',
      strategy
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EVENT CALLBACKS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Register callback for transcripts
   * @param {Function} callback - (transcript) => void
   */
  onTranscript(callback) {
    this.callbacks.onTranscript.push(callback);
    return () => this._removeCallback('onTranscript', callback);
  }

  /**
   * Register callback for audio output
   * @param {Function} callback - (audioData: ArrayBuffer) => void
   */
  onAudio(callback) {
    this.callbacks.onAudio.push(callback);
    return () => this._removeCallback('onAudio', callback);
  }

  /**
   * Register callback for paralinguistic cues
   * @param {Function} callback - (cue) => void
   */
  onCue(callback) {
    this.callbacks.onCue.push(callback);
    return () => this._removeCallback('onCue', callback);
  }

  /**
   * Register callback for connection state
   * @param {Function} callback - () => void
   */
  onConnect(callback) {
    this.callbacks.onConnect.push(callback);
    return () => this._removeCallback('onConnect', callback);
  }

  /**
   * Register callback for disconnection
   * @param {Function} callback - (reason) => void
   */
  onDisconnect(callback) {
    this.callbacks.onDisconnect.push(callback);
    return () => this._removeCallback('onDisconnect', callback);
  }

  /**
   * Register callback for errors
   * @param {Function} callback - (error) => void
   */
  onError(callback) {
    this.callbacks.onError.push(callback);
    return () => this._removeCallback('onError', callback);
  }

  /**
   * Register callback for playback ended (for echo cancellation)
   * @param {Function} callback - () => void
   */
  onPlaybackEnded(callback) {
    this.callbacks.onPlaybackEnded.push(callback);
    return () => this._removeCallback('onPlaybackEnded', callback);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AUDIO PLAYBACK
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Initialize audio context for playback
   */
  initAudioPlayback() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000 // OpenAI Realtime uses 24kHz
      });
    }
    return this.audioContext;
  }

  /**
   * Play audio data (PCM16 at 24kHz)
   * @param {ArrayBuffer} audioData - PCM16 audio buffer
   */
  async playAudio(audioData) {
    if (!this.audioContext) {
      this.initAudioPlayback();
    }

    // Convert PCM16 to Float32 for Web Audio
    const pcm16 = new Int16Array(audioData);
    const float32 = new Float32Array(pcm16.length);

    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768.0;
    }

    // Create audio buffer
    const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    // Queue for playback
    this.audioQueue.push(audioBuffer);

    if (!this.isPlaying) {
      this._playNextInQueue();
    }
  }

  /**
   * Play next audio buffer in queue
   * @private
   */
  _playNextInQueue() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      // ECHO CANCELLATION: Notify when all audio playback is complete
      this._emit('onPlaybackEnded');
      return;
    }

    this.isPlaying = true;
    const audioBuffer = this.audioQueue.shift();

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    source.onended = () => {
      this._playNextInQueue();
    };

    source.start();
  }

  /**
   * Stop audio playback (for interruption handling)
   */
  stopPlayback() {
    const wasPlaying = this.isPlaying;
    this.audioQueue = [];
    this.isPlaying = false;

    // Notify if we were playing (for echo cancellation)
    if (wasPlaying) {
      this._emit('onPlaybackEnded');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handle incoming WebSocket message
   * @private
   */
  _handleMessage(message) {
    switch (message.type) {
      case 'connected':
        this.clientId = message.clientId;
        console.log('[VoiceWS] Assigned client ID:', this.clientId);
        break;

      case 'session_started':
        this._emit('onSessionStart', message);
        break;

      case 'session_ended':
        this._emit('onSessionEnd', message);
        break;

      case 'transcript':
        this._emit('onTranscript', message);
        break;

      case 'audio':
        // Decode base64 audio and emit
        const audioData = this._base64ToArrayBuffer(message.data);
        this._emit('onAudio', audioData);
        // Auto-play if enabled
        this.playAudio(audioData);
        break;

      case 'cue':
        this._emit('onCue', message.cue);
        break;

      case 'error':
        console.error('[VoiceWS] Server error:', message.message);
        this._emit('onError', message);
        break;

      case 'strategy_changed':
        console.log('[VoiceWS] Strategy changed:', message.strategy);
        this.provider = message.provider?.provider;
        break;

      default:
        console.log('[VoiceWS] Unknown message:', message.type);
    }
  }

  /**
   * Send message to server
   * @private
   */
  _send(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[VoiceWS] Cannot send: not connected');
      return;
    }

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Emit event to callbacks
   * @private
   */
  _emit(event, data) {
    const callbacks = this.callbacks[event] || [];
    callbacks.forEach(cb => {
      try {
        cb(data);
      } catch (error) {
        console.error(`[VoiceWS] Callback error (${event}):`, error);
      }
    });

    // Clean up one-time listeners for session events
    if (event === 'onSessionStart' || event === 'onSessionEnd') {
      this.callbacks[event] = [];
    }
  }

  /**
   * Remove callback
   * @private
   */
  _removeCallback(event, callback) {
    this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
  }

  /**
   * Handle reconnection
   * @private
   */
  _handleReconnect() {
    if (this.reconnectAttempts >= WS_CONFIG.maxReconnectAttempts) {
      console.error('[VoiceWS] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`[VoiceWS] Reconnecting (attempt ${this.reconnectAttempts})...`);

    setTimeout(() => {
      this.connect().catch(console.error);
    }, WS_CONFIG.reconnectDelay);
  }

  /**
   * Convert ArrayBuffer to base64
   * @private
   */
  _arrayBufferToBase64(buffer) {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert base64 to ArrayBuffer
   * @private
   */
  _base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      sessionId: this.sessionId,
      provider: this.provider,
      supportsCues: this.supportsCues,
      clientId: this.clientId,
      voiceMode: this.getVoiceMode(),
      isFallback: this.useFallback,
      audioPreset: this.audioPreset
    };
  }
}

// Singleton instance
export const voiceWS = new VoiceWebSocketService();

// Re-export config items for convenience
export { VOICE_MODE, AUDIO_PRESETS, DEFAULT_PRESET };

export default voiceWS;
