/**
 * ===============================================================================
 * STREAMING TTS SERVICE
 * ===============================================================================
 *
 * Provides progressive audio playback for Text-to-Speech.
 * Instead of waiting for full audio generation, streams chunks as they're ready.
 *
 * FEATURES:
 * - Sentence-level chunking for natural pauses
 * - Progressive audio generation and playback
 * - Seamless chunk queuing with overlap
 * - Cancellation support for interruptions
 * - Fallback to full generation when streaming unavailable
 *
 * USAGE:
 *   import { streamingTTS } from './streamingTTSService';
 *
 *   // Stream text progressively
 *   await streamingTTS.streamText('Hello, this is Luna speaking.', profileId);
 *
 *   // Stop streaming
 *   streamingTTS.stop();
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode Enhancement
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

// ===============================================================================
// CONFIGURATION
// ===============================================================================

const STREAMING_CONFIG = {
  // Chunking
  minChunkLength: 20,        // Minimum characters per chunk
  maxChunkLength: 200,       // Maximum characters per chunk
  sentenceDelimiters: /[.!?;:]+\s*/g, // Split on sentence endings

  // Audio
  sampleRate: 24000,         // Audio sample rate
  crossfadeDuration: 0.05,   // Seconds of crossfade between chunks

  // Queue
  maxQueueSize: 3,           // Max chunks to queue ahead
  prefetchThreshold: 1,      // Start fetching next when queue drops to this

  // Timeouts
  chunkTimeout: 10000,       // Max time to wait for a chunk (ms)
  retryAttempts: 2           // Number of retries on failure
};

// ===============================================================================
// STREAMING TTS SERVICE
// ===============================================================================

class StreamingTTSService {
  constructor() {
    this.functions = null;
    this.audioContext = null;

    // Playback state
    this.isPlaying = false;
    this.isCancelled = false;
    this.currentSource = null;

    // Queue management
    this.audioQueue = [];
    this.pendingChunks = [];
    this.nextPlayTime = 0;

    // Progress tracking
    this.totalChunks = 0;
    this.playedChunks = 0;
    this.currentText = '';

    // Callbacks
    this.onChunkStart = null;
    this.onChunkEnd = null;
    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Initialize the service
   */
  initialize() {
    if (!this.functions) {
      this.functions = getFunctions();
    }

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: STREAMING_CONFIG.sampleRate
      });
    }

    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEXT CHUNKING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Split text into speakable chunks
   * @param {string} text - Text to chunk
   * @returns {string[]} - Array of text chunks
   */
  chunkText(text) {
    if (!text || text.length <= STREAMING_CONFIG.minChunkLength) {
      return [text];
    }

    const chunks = [];
    let remaining = text.trim();

    while (remaining.length > 0) {
      // If remaining is short enough, add as final chunk
      if (remaining.length <= STREAMING_CONFIG.maxChunkLength) {
        chunks.push(remaining);
        break;
      }

      // Find a good split point (sentence ending)
      let splitIndex = -1;
      const searchRange = remaining.substring(0, STREAMING_CONFIG.maxChunkLength);

      // Look for sentence delimiters
      const matches = [...searchRange.matchAll(STREAMING_CONFIG.sentenceDelimiters)];
      if (matches.length > 0) {
        // Use the last match that gives us at least minChunkLength
        for (let i = matches.length - 1; i >= 0; i--) {
          const match = matches[i];
          const endIndex = match.index + match[0].length;
          if (endIndex >= STREAMING_CONFIG.minChunkLength) {
            splitIndex = endIndex;
            break;
          }
        }
      }

      // If no good sentence break, look for other break points
      if (splitIndex === -1) {
        // Try comma, dash, or other natural pauses
        const pauseBreaks = searchRange.match(/[,\-–—]+\s*/g);
        if (pauseBreaks) {
          splitIndex = searchRange.lastIndexOf(pauseBreaks[pauseBreaks.length - 1]) +
                       pauseBreaks[pauseBreaks.length - 1].length;
        }
      }

      // If still no break, use word boundary
      if (splitIndex === -1 || splitIndex < STREAMING_CONFIG.minChunkLength) {
        const wordBreak = searchRange.lastIndexOf(' ');
        if (wordBreak > STREAMING_CONFIG.minChunkLength) {
          splitIndex = wordBreak + 1;
        } else {
          splitIndex = STREAMING_CONFIG.maxChunkLength;
        }
      }

      // Add chunk and continue
      chunks.push(remaining.substring(0, splitIndex).trim());
      remaining = remaining.substring(splitIndex).trim();
    }

    return chunks.filter(c => c.length > 0);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STREAMING PLAYBACK
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Stream text as speech progressively
   * @param {string} text - Text to speak
   * @param {string} profileId - Profile ID for voice preferences
   * @param {Object} options - TTS options
   */
  async streamText(text, profileId, options = {}) {
    this.initialize();
    this.stop(); // Stop any current playback

    this.currentText = text;
    this.isCancelled = false;
    this.isPlaying = true;
    this.playedChunks = 0;
    this.audioQueue = [];
    this.nextPlayTime = this.audioContext.currentTime;

    // Chunk the text
    const chunks = this.chunkText(text);
    this.totalChunks = chunks.length;
    this.pendingChunks = [...chunks];

    console.log(`[StreamingTTS] Starting stream: ${chunks.length} chunks`);

    try {
      // Start generating and playing chunks
      await this._processChunks(profileId, options);

      if (!this.isCancelled) {
        this.onComplete?.();
      }

    } catch (error) {
      console.error('[StreamingTTS] Stream error:', error);
      this.onError?.(error);
    } finally {
      this.isPlaying = false;
    }
  }

  /**
   * Process chunks: generate audio and queue for playback
   * @private
   */
  async _processChunks(profileId, options) {
    while (this.pendingChunks.length > 0 && !this.isCancelled) {
      const chunk = this.pendingChunks.shift();
      const chunkIndex = this.totalChunks - this.pendingChunks.length - 1;

      try {
        // Generate audio for this chunk
        const audioBuffer = await this._generateChunkAudio(chunk, profileId, options);

        if (this.isCancelled) break;

        // Queue and play
        await this._queueAndPlay(audioBuffer, chunkIndex, chunk);

        // Update progress
        this.playedChunks++;
        this.onProgress?.({
          current: this.playedChunks,
          total: this.totalChunks,
          chunk: chunk
        });

      } catch (error) {
        console.error(`[StreamingTTS] Chunk ${chunkIndex} failed:`, error);

        // Retry logic
        if (options.retryCount < STREAMING_CONFIG.retryAttempts) {
          this.pendingChunks.unshift(chunk);
          options.retryCount = (options.retryCount || 0) + 1;
          await this._delay(500); // Brief delay before retry
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * Generate audio for a text chunk
   * @private
   */
  async _generateChunkAudio(text, profileId, options) {
    const generateSpeech = httpsCallable(this.functions, 'generateSpeechElevenLabs');

    const result = await generateSpeech({
      text,
      profileId,
      voiceOverride: options.voiceOverride,
      settingsOverride: options.settingsOverride,
      modelOverride: options.modelOverride || 'turbo' // Use turbo for streaming
    });

    // Decode base64 audio
    const audioData = atob(result.data.audio);
    const audioArray = new Uint8Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      audioArray[i] = audioData.charCodeAt(i);
    }

    // Decode to AudioBuffer
    const audioBuffer = await this.audioContext.decodeAudioData(audioArray.buffer.slice(0));

    return audioBuffer;
  }

  /**
   * Queue audio buffer and play when ready
   * @private
   */
  async _queueAndPlay(audioBuffer, chunkIndex, chunkText) {
    // Create source
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create gain node for crossfade
    const gainNode = this.audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Calculate timing
    const startTime = Math.max(this.audioContext.currentTime, this.nextPlayTime);
    const duration = audioBuffer.duration;

    // Apply crossfade
    if (chunkIndex > 0) {
      // Fade in
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(1, startTime + STREAMING_CONFIG.crossfadeDuration);
    }

    // Schedule playback
    source.start(startTime);
    this.currentSource = source;

    // Emit chunk start
    this.onChunkStart?.({ index: chunkIndex, text: chunkText });

    // Update next play time (slightly overlap for smoother transitions)
    this.nextPlayTime = startTime + duration - STREAMING_CONFIG.crossfadeDuration;

    // Wait for chunk to finish (with some buffer for next chunk)
    await this._delay((duration - STREAMING_CONFIG.crossfadeDuration) * 1000);

    // Emit chunk end
    this.onChunkEnd?.({ index: chunkIndex, text: chunkText });
  }

  /**
   * Stop streaming and playback
   */
  stop() {
    this.isCancelled = true;
    this.isPlaying = false;
    this.pendingChunks = [];
    this.audioQueue = [];

    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentSource = null;
    }

    console.log('[StreamingTTS] Stopped');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SIMPLE STREAMING (Text appears as spoken)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Stream text with word-by-word reveal callback
   * Simulates the text appearing as Luna speaks
   * @param {string} text - Text to speak
   * @param {string} profileId - Profile ID
   * @param {Object} options - Options including onWord callback
   */
  async streamWithReveal(text, profileId, options = {}) {
    const { onWord, onSentence } = options;

    // Split into words for reveal timing
    const words = text.split(/\s+/);
    let wordIndex = 0;
    let sentenceBuffer = '';

    // Track timing
    const avgWordsPerSecond = 2.5; // Approximate speaking rate
    const msPerWord = 1000 / avgWordsPerSecond;

    // Start streaming audio
    this.streamText(text, profileId, {
      ...options,
      // Disable internal callbacks, we'll handle our own
    });

    // Reveal words as audio plays
    const revealInterval = setInterval(() => {
      if (wordIndex >= words.length || this.isCancelled) {
        clearInterval(revealInterval);
        return;
      }

      const word = words[wordIndex];
      onWord?.(word, wordIndex, words);

      // Track sentences
      sentenceBuffer += (sentenceBuffer ? ' ' : '') + word;
      if (/[.!?]$/.test(word)) {
        onSentence?.(sentenceBuffer);
        sentenceBuffer = '';
      }

      wordIndex++;
    }, msPerWord);

    // Return cleanup function
    return () => {
      clearInterval(revealInterval);
      this.stop();
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // REAL-TIME STREAMING (WebSocket-based)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Connect to ElevenLabs streaming WebSocket
   * For true real-time streaming with minimal latency
   * @param {string} profileId - Profile ID
   * @param {Object} options - Streaming options
   */
  async connectRealtime(profileId, options = {}) {
    this.initialize();

    try {
      // Get streaming session from backend
      const getSession = httpsCallable(this.functions, 'getVoiceStreamingSession');
      const result = await getSession({ profileId });

      const { streamingUrl, voiceId } = result.data;

      if (!streamingUrl) {
        console.warn('[StreamingTTS] Real-time streaming not available, using chunked mode');
        return null;
      }

      // Connect WebSocket
      const ws = new WebSocket(streamingUrl);

      ws.onopen = () => {
        console.log('[StreamingTTS] Real-time connected');

        // Send initial configuration
        ws.send(JSON.stringify({
          text: ' ', // Initial text to start
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          },
          xi_api_key: result.data.apiKey // If provided
        }));
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.audio) {
          // Decode and play audio chunk
          const audioData = atob(data.audio);
          const audioArray = new Uint8Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
          }

          try {
            const audioBuffer = await this.audioContext.decodeAudioData(audioArray.buffer.slice(0));
            await this._playChunk(audioBuffer);
          } catch (e) {
            console.error('[StreamingTTS] Audio decode error:', e);
          }
        }

        if (data.isFinal) {
          this.onComplete?.();
        }
      };

      ws.onerror = (error) => {
        console.error('[StreamingTTS] WebSocket error:', error);
        this.onError?.(error);
      };

      ws.onclose = () => {
        console.log('[StreamingTTS] Real-time disconnected');
        this.isPlaying = false;
      };

      // Return send function for streaming text
      return {
        send: (text) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ text }));
          }
        },
        close: () => {
          ws.close();
          this.stop();
        }
      };

    } catch (error) {
      console.error('[StreamingTTS] Failed to connect real-time:', error);
      throw error;
    }
  }

  /**
   * Play a single audio chunk
   * @private
   */
  async _playChunk(audioBuffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const startTime = Math.max(this.audioContext.currentTime, this.nextPlayTime);
    source.start(startTime);

    this.nextPlayTime = startTime + audioBuffer.duration;
    this.currentSource = source;
    this.isPlaying = true;

    source.onended = () => {
      if (this.currentSource === source) {
        this.currentSource = null;
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CALLBACKS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Set callback for when a chunk starts playing
   */
  setOnChunkStart(callback) {
    this.onChunkStart = callback;
  }

  /**
   * Set callback for when a chunk finishes playing
   */
  setOnChunkEnd(callback) {
    this.onChunkEnd = callback;
  }

  /**
   * Set callback for progress updates
   */
  setOnProgress(callback) {
    this.onProgress = callback;
  }

  /**
   * Set callback for when streaming completes
   */
  setOnComplete(callback) {
    this.onComplete = callback;
  }

  /**
   * Set callback for errors
   */
  setOnError(callback) {
    this.onError = callback;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Delay helper
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if currently streaming
   */
  isStreaming() {
    return this.isPlaying && !this.isCancelled;
  }

  /**
   * Get current progress
   */
  getProgress() {
    return {
      current: this.playedChunks,
      total: this.totalChunks,
      remaining: this.pendingChunks.length,
      isPlaying: this.isPlaying,
      isCancelled: this.isCancelled
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stop();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// ===============================================================================
// SINGLETON EXPORT
// ===============================================================================

export const streamingTTS = new StreamingTTSService();

export default streamingTTS;
