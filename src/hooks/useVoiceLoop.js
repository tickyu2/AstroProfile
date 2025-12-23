/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USE VOICE LOOP - Complete Voice Conversation Hook
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Integrates the full voice loop:
 * 1. Captures audio via MediaRecorder
 * 2. Sends to backend via WebSocket
 * 3. Backend runs SER (Speech Emotion Recognition) on audio
 * 4. Receives STT transcript + LLM reply + emotion data
 * 5. Receives TTS audio (binary) from backend
 * 6. Plays Luna's voice response with emotion modulation
 *
 * Works with the turn-taking state machine to know when to start/stop recording.
 *
 * Created: December 21, 2025
 * Updated: December 21, 2025 - Added SER, TTS audio playback
 */

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Configuration
 */
const CONFIG = {
  wsUrl: import.meta.env.VITE_VOICE_WS_URL || 'ws://localhost:8080',
  audioMimeType: 'audio/webm;codecs=opus',
  audioChunkInterval: 250, // ms between audio chunks
  reconnectDelay: 3000,    // ms before reconnect attempt
  maxReconnects: 5,
  ttsAudioFormat: 'audio/mpeg' // ElevenLabs returns MP3
};

/**
 * Voice loop states
 */
export const VOICE_LOOP_STATES = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECORDING: 'RECORDING',
  PROCESSING: 'PROCESSING',
  SPEAKING: 'SPEAKING',
  ERROR: 'ERROR'
};

/**
 * useVoiceLoop Hook
 *
 * @param {Object} options
 * @param {boolean} options.enabled - Whether voice loop is active
 * @param {Function} options.onTranscript - Called with STT transcript
 * @param {Function} options.onReply - Called with LLM reply
 * @param {Function} options.onSpeakStart - Called when Luna starts speaking
 * @param {Function} options.onSpeakEnd - Called when Luna finishes speaking
 * @param {Function} options.onError - Called on error
 * @param {Function} options.onBehaviorUpdate - Called with behavior profile updates
 * @param {MediaStream} options.audioStream - Microphone stream
 * @returns {Object} Voice loop state and controls
 */
export function useVoiceLoop({
  enabled = true,
  onTranscript,
  onReply,
  onSpeakStart,
  onSpeakEnd,
  onError,
  onBehaviorUpdate,
  audioStream = null
} = {}) {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  const [state, setState] = useState(VOICE_LOOP_STATES.DISCONNECTED);
  const [sessionId, setSessionId] = useState(null);
  const [lastTranscript, setLastTranscript] = useState('');
  const [lastReply, setLastReply] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [lastEmotion, setLastEmotion] = useState(null);
  const [lastBehavior, setLastBehavior] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Refs
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef(null);
  const audioContextRef = useRef(null);
  const currentAudioRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // WEBSOCKET CONNECTION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Connect to voice backend
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setState(VOICE_LOOP_STATES.CONNECTING);

    try {
      const ws = new WebSocket(CONFIG.wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[VoiceLoop] Connected to backend');
        setState(VOICE_LOOP_STATES.CONNECTED);
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = async (event) => {
        // Handle binary audio data (TTS from backend)
        if (event.data instanceof Blob) {
          await handleAudioBlob(event.data);
          return;
        }
        // Handle JSON messages
        handleMessage(JSON.parse(event.data));
      };

      ws.onclose = () => {
        console.log('[VoiceLoop] Disconnected');
        setState(VOICE_LOOP_STATES.DISCONNECTED);
        setIsConnected(false);
        setSessionId(null);

        // Attempt reconnect
        if (enabled && reconnectAttempts.current < CONFIG.maxReconnects) {
          reconnectAttempts.current++;
          console.log(`[VoiceLoop] Reconnecting in ${CONFIG.reconnectDelay}ms... (attempt ${reconnectAttempts.current})`);
          reconnectTimeout.current = setTimeout(connect, CONFIG.reconnectDelay);
        }
      };

      ws.onerror = (error) => {
        console.error('[VoiceLoop] WebSocket error:', error);
        setState(VOICE_LOOP_STATES.ERROR);
        onError?.('WebSocket connection failed');
      };

    } catch (error) {
      console.error('[VoiceLoop] Connection error:', error);
      setState(VOICE_LOOP_STATES.ERROR);
      onError?.(error.message);
    }
  }, [enabled, onError]);

  /**
   * Disconnect from backend
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState(VOICE_LOOP_STATES.DISCONNECTED);
    setIsConnected(false);
  }, []);

  /**
   * Handle incoming WebSocket messages
   */
  const handleMessage = useCallback((msg) => {
    console.log('[VoiceLoop] Received:', msg.type);

    switch (msg.type) {
      case 'session_started':
        setSessionId(msg.payload.sessionId);
        break;

      case 'processing_started':
        setState(VOICE_LOOP_STATES.PROCESSING);
        setProcessingStatus('Processing...');
        break;

      case 'ser_started':
        setProcessingStatus('Analyzing emotion...');
        break;

      case 'ser_complete':
        // Store detected emotion from backend SER
        if (msg.payload?.emotion) {
          setLastEmotion(msg.payload.emotion);
          console.log('[VoiceLoop] Emotion detected:', msg.payload.emotion);
        }
        break;

      case 'stt_started':
        setProcessingStatus('Transcribing...');
        break;

      case 'stt_complete':
        setLastTranscript(msg.payload.transcript);
        setProcessingStatus('Thinking...');
        onTranscript?.(msg.payload.transcript);
        break;

      case 'llm_started':
        setProcessingStatus('Generating response...');
        break;

      case 'tts_started':
        setProcessingStatus('Generating voice...');
        break;

      case 'tts_complete':
        setProcessingStatus('Luna is speaking...');
        // Audio binary will arrive separately
        break;

      case 'turn_result':
        handleTurnResult(msg.payload);
        break;

      case 'turn_cancelled':
        setState(VOICE_LOOP_STATES.CONNECTED);
        setProcessingStatus(null);
        break;

      case 'pong':
        // Heartbeat response
        break;

      case 'behavior_update':
        // Behavior profile update from backend
        handleBehaviorUpdate(msg.payload);
        break;

      default:
        console.log('[VoiceLoop] Unknown message:', msg);
    }
  }, [onTranscript]);

  /**
   * Handle behavior update from backend
   */
  const handleBehaviorUpdate = useCallback((payload) => {
    const { behavior, sessionStats: stats, userPrefs: prefs } = payload;

    if (behavior) {
      setLastBehavior(behavior);
      console.log('[VoiceLoop] Behavior updated:', behavior.style);
    }
    if (stats) {
      setSessionStats(stats);
    }
    if (prefs) {
      setUserPrefs(prefs);
    }

    onBehaviorUpdate?.({ behavior, sessionStats: stats, userPrefs: prefs });
  }, [onBehaviorUpdate]);

  /**
   * Handle turn result (transcript + reply)
   */
  const handleTurnResult = useCallback((payload) => {
    const { transcript, reply, emotion, behavior, sessionStats: stats, error } = payload;

    setLastTranscript(transcript || '');
    setLastReply(reply || '');
    setProcessingStatus(null);

    // Store emotion if provided in turn result
    if (emotion) {
      setLastEmotion(emotion);
    }

    // Store behavior if provided in turn result
    if (behavior) {
      setLastBehavior(behavior);
      console.log('[VoiceLoop] Behavior from turn:', behavior.style);
    }
    if (stats) {
      setSessionStats(stats);
    }

    // Notify behavior update
    if (behavior || stats) {
      onBehaviorUpdate?.({ behavior, sessionStats: stats, userPrefs });
    }

    if (error) {
      console.warn('[VoiceLoop] Turn error:', error);
      onError?.(error);
    }

    // Notify parent of reply
    if (reply) {
      setState(VOICE_LOOP_STATES.SPEAKING);
      onSpeakStart?.();
      onReply?.(reply);
    } else {
      setState(VOICE_LOOP_STATES.CONNECTED);
    }
  }, [onReply, onSpeakStart, onError]);

  /**
   * Handle binary audio blob from TTS
   */
  const handleAudioBlob = useCallback(async (blob) => {
    console.log(`[VoiceLoop] Received TTS audio: ${blob.size} bytes`);

    try {
      // Create object URL for audio playback
      const audioUrl = URL.createObjectURL(blob);

      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      // Create and play audio
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      setIsPlayingAudio(true);
      setState(VOICE_LOOP_STATES.SPEAKING);
      onSpeakStart?.();

      audio.onended = () => {
        console.log('[VoiceLoop] TTS playback complete');
        setIsPlayingAudio(false);
        setState(VOICE_LOOP_STATES.CONNECTED);
        setProcessingStatus(null);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        onSpeakEnd?.();
      };

      audio.onerror = (e) => {
        console.error('[VoiceLoop] Audio playback error:', e);
        setIsPlayingAudio(false);
        setState(VOICE_LOOP_STATES.CONNECTED);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        onError?.('Audio playback failed');
      };

      await audio.play();
      console.log('[VoiceLoop] Playing Luna\'s voice...');

    } catch (error) {
      console.error('[VoiceLoop] Failed to play audio:', error);
      setIsPlayingAudio(false);
      setState(VOICE_LOOP_STATES.CONNECTED);
      onError?.('Failed to play audio response');
    }
  }, [onSpeakStart, onSpeakEnd, onError]);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO RECORDING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Setup MediaRecorder when audioStream is available
   */
  useEffect(() => {
    if (!audioStream || !enabled) return;

    try {
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: CONFIG.audioMimeType
      });

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          // Convert to base64 and send
          const arrayBuffer = await event.data.arrayBuffer();
          const base64 = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer))
          );

          wsRef.current.send(JSON.stringify({
            type: 'audio_chunk',
            payload: base64
          }));
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      console.log('[VoiceLoop] MediaRecorder ready');

    } catch (error) {
      console.error('[VoiceLoop] MediaRecorder setup failed:', error);
      onError?.('Audio recording setup failed');
    }

    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioStream, enabled, onError]);

  /**
   * Start recording audio
   */
  const startRecording = useCallback(() => {
    if (!mediaRecorderRef.current) {
      console.warn('[VoiceLoop] MediaRecorder not ready');
      return false;
    }

    if (mediaRecorderRef.current.state === 'recording') {
      return true; // Already recording
    }

    try {
      mediaRecorderRef.current.start(CONFIG.audioChunkInterval);
      setIsRecording(true);
      setState(VOICE_LOOP_STATES.RECORDING);
      console.log('[VoiceLoop] Recording started');
      return true;
    } catch (error) {
      console.error('[VoiceLoop] Start recording failed:', error);
      return false;
    }
  }, []);

  /**
   * Stop recording and trigger processing
   */
  const stopRecording = useCallback((emotion = {}) => {
    if (!mediaRecorderRef.current) {
      return false;
    }

    if (mediaRecorderRef.current.state !== 'recording') {
      return false;
    }

    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Send end_turn signal with emotion
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'end_turn',
          emotion
        }));
        console.log('[VoiceLoop] Recording stopped, end_turn sent');
      }

      return true;
    } catch (error) {
      console.error('[VoiceLoop] Stop recording failed:', error);
      return false;
    }
  }, []);

  /**
   * Cancel current turn
   */
  const cancelTurn = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'cancel_turn' }));
    }

    setState(VOICE_LOOP_STATES.CONNECTED);
  }, []);

  /**
   * Mark Luna as done speaking (call after TTS completes)
   */
  const markSpeakingDone = useCallback(() => {
    setState(VOICE_LOOP_STATES.CONNECTED);
    onSpeakEnd?.();
  }, [onSpeakEnd]);

  /**
   * Stop audio playback
   */
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsPlayingAudio(false);
    if (state === VOICE_LOOP_STATES.SPEAKING) {
      setState(VOICE_LOOP_STATES.CONNECTED);
    }
  }, [state]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CONNECTION LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Connect when enabled
   */
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    // State
    state,
    sessionId,
    isConnected,
    isRecording,
    isPlayingAudio,
    processingStatus,

    // Last results
    lastTranscript,
    lastReply,
    lastEmotion,

    // Behavior tracking
    lastBehavior,
    sessionStats,
    userPrefs,

    // WebSocket ref for behavior signals
    wsRef,

    // Controls
    connect,
    disconnect,
    startRecording,
    stopRecording,
    cancelTurn,
    markSpeakingDone,
    stopAudio,

    // Constants
    STATES: VOICE_LOOP_STATES
  };
}

export default useVoiceLoop;
