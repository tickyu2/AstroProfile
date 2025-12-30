/**
 * ===============================================================================
 * USE REALTIME VOICE HOOK
 * ===============================================================================
 *
 * Comprehensive hook for real-time voice communication with Luna.
 * Bridges WebSocket, audio capture, and playback into a single interface.
 *
 * FEATURES:
 * - WebSocket connection to voice backend
 * - Microphone capture with VAD
 * - Real-time audio streaming
 * - Luna's voice playback
 * - Transcript and cue handling
 * - Strategy switching (Groq STT / OpenAI Native)
 * - PROSODIC ANALYSIS for intelligent turn-taking (v2)
 * - CONSTITUTIONAL-AWARE silence thresholds (v2)
 * - BACKCHANNEL DETECTION for smarter barge-in (v2)
 *
 * USAGE:
 *   const {
 *     isConnected, isRecording, isSpeaking,
 *     startSession, stopSession, toggleRecording,
 *     transcripts, cues, strategy, setStrategy,
 *     turnDecision  // v2
 *   } = useRealtimeVoice({ profileId, userProfile, onTranscript });
 *
 * Created: December 27, 2024
 * Updated: December 28, 2024 - Added prosodic turn-taking & constitutional awareness
 * Part of: GENESIS Voice Mode Enhancement / Conversational AI v2
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { voiceWS } from '../services/voiceWebSocketService';
import { audioCapture } from '../services/audioCapture';
import { turnTakingModel } from '../services/turnTakingModel';

// Voice strategies (mirror backend)
export const VOICE_STRATEGIES = {
  GROQ_ONLY: 'groq_only',
  OPENAI_FIRST: 'openai_first',
  OPENAI_ONLY: 'openai_only'
};

/**
 * Real-time voice communication hook
 *
 * @param {Object} options
 * @param {string} options.profileId - User profile ID
 * @param {Object} options.userProfile - User's constitutional profile for turn-taking (v2)
 * @param {string} options.strategy - Initial voice strategy
 * @param {Function} options.onTranscript - Callback for transcripts
 * @param {Function} options.onCue - Callback for paralinguistic cues
 * @param {Function} options.onError - Callback for errors
 * @param {Function} options.onLunaResponse - Callback when Luna responds (for TTS in Groq mode)
 * @param {Function} options.onBargeIn - Callback when user barges in (interrupts Luna)
 * @param {Function} options.onTurnDecision - Callback for turn-taking decisions (v2)
 * @param {boolean} options.bargeInEnabled - Enable barge-in detection (auto-interrupt when user speaks)
 * @param {boolean} options.turnTakingEnabled - Enable intelligent turn-taking (v2)
 * @param {boolean} options.autoConnect - Auto-connect on mount
 * @param {boolean} options.autoCommitOnSilence - Auto-commit when silence detected
 */
export function useRealtimeVoice({
  profileId,
  userProfile = null,
  strategy = VOICE_STRATEGIES.GROQ_ONLY,
  onTranscript,
  onCue,
  onError,
  onLunaResponse,
  onBargeIn,
  onTurnDecision,
  bargeInEnabled = false,
  turnTakingEnabled = true,
  autoConnect = false,
  autoCommitOnSilence = true
} = {}) {
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────

  const [isConnected, setIsConnected] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false); // Passive listening for barge-in
  const [isSpeaking, setIsSpeaking] = useState(false); // User speaking
  const [isLunaSpeaking, setIsLunaSpeaking] = useState(false); // Luna speaking
  const [currentStrategy, setCurrentStrategy] = useState(strategy);
  const [provider, setProvider] = useState(null);
  const [supportsCues, setSupportsCues] = useState(false);
  const [error, setError] = useState(null);

  // Transcript state
  const [userTranscripts, setUserTranscripts] = useState([]);
  const [lunaTranscripts, setLunaTranscripts] = useState([]);
  const [cues, setCues] = useState([]);

  // Turn-taking state (v2)
  const [turnDecision, setTurnDecision] = useState(null);
  const [prosodyState, setProsodyState] = useState(null);

  // Refs
  const sessionIdRef = useRef(null);
  const cleanupRef = useRef([]);
  const userProfileRef = useRef(userProfile);

  // Update profile ref when it changes
  useEffect(() => {
    userProfileRef.current = userProfile;
    if (userProfile && turnTakingEnabled) {
      audioCapture.setUserProfile(userProfile);
      console.log('[useRealtimeVoice] User profile set for turn-taking');
    }
  }, [userProfile, turnTakingEnabled]);

  // ─────────────────────────────────────────────────────────────────────────────
  // WEBSOCKET CONNECTION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Connect to voice WebSocket server
   */
  const connect = useCallback(async () => {
    if (isConnected) return;

    try {
      setError(null);
      await voiceWS.connect();
      setIsConnected(true);
      console.log('[useRealtimeVoice] Connected to voice server');
    } catch (err) {
      console.error('[useRealtimeVoice] Connection failed:', err);
      setError('Failed to connect to voice server');
      onError?.({ type: 'connection', message: err.message });
    }
  }, [isConnected, onError]);

  /**
   * Disconnect from voice server
   */
  const disconnect = useCallback(() => {
    if (isRecording) {
      audioCapture.stop();
      setIsRecording(false);
    }

    voiceWS.disconnect();
    setIsConnected(false);
    setIsSessionActive(false);
    sessionIdRef.current = null;
  }, [isRecording]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SESSION MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Start a voice session
   */
  const startSession = useCallback(async () => {
    if (!isConnected) {
      await connect();
    }

    try {
      setError(null);

      // Clear previous transcripts
      setUserTranscripts([]);
      setLunaTranscripts([]);
      setCues([]);

      // Start WebSocket session
      const result = await voiceWS.startSession({
        profileId,
        strategy: currentStrategy
      });

      sessionIdRef.current = result.sessionId;
      setProvider(result.provider);
      setSupportsCues(result.supportsCues);
      setIsSessionActive(true);

      console.log('[useRealtimeVoice] Session started:', result);
      return result;

    } catch (err) {
      console.error('[useRealtimeVoice] Failed to start session:', err);
      setError('Failed to start voice session');
      onError?.({ type: 'session', message: err.message });
      throw err;
    }
  }, [isConnected, connect, profileId, currentStrategy, onError]);

  /**
   * Stop current voice session
   */
  const stopSession = useCallback(async () => {
    // Stop recording first
    if (isRecording) {
      audioCapture.stop();
      setIsRecording(false);
    }

    // End WebSocket session
    const transcripts = await voiceWS.endSession();

    setIsSessionActive(false);
    sessionIdRef.current = null;

    console.log('[useRealtimeVoice] Session ended');
    return transcripts;
  }, [isRecording]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RECORDING CONTROL
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Start recording from microphone
   */
  const startRecording = useCallback(async () => {
    if (!isSessionActive) {
      await startSession();
    }

    // INTERRUPTION: Stop Luna's playback when user starts speaking
    if (isLunaSpeaking) {
      voiceWS.stopPlayback();
      setIsLunaSpeaking(false);
      console.log('[useRealtimeVoice] Interrupted Luna playback');
    }

    try {
      // Configure turn-taking (v2)
      if (turnTakingEnabled) {
        audioCapture.setTurnTakingEnabled(true);
        if (userProfileRef.current) {
          audioCapture.setUserProfile(userProfileRef.current);
        }
      } else {
        audioCapture.setTurnTakingEnabled(false);
      }

      // Start audio capture
      await audioCapture.start();

      // Wire up audio data to WebSocket
      audioCapture.onAudioData((pcm16) => {
        voiceWS.sendAudio(pcm16);
      });

      // Voice activity detection
      audioCapture.onVoiceActivity((speaking) => {
        setIsSpeaking(speaking);
      });

      // Turn-taking decision listener (v2)
      if (turnTakingEnabled) {
        audioCapture.onTurnDecision((decision) => {
          setTurnDecision(decision);
          setProsodyState(decision.prosody);
          onTurnDecision?.(decision);

          // If turn-taking says commit, the audioCapture already handles it
          // but we can log for debugging
          if (decision.action === 'commit') {
            console.log('[useRealtimeVoice] Turn committed via prosody analysis');
          }
        });
      }

      // Auto-commit on silence (for legacy mode or as fallback)
      if (autoCommitOnSilence && !turnTakingEnabled) {
        audioCapture.onSilence(() => {
          voiceWS.commit();
        });
      } else if (autoCommitOnSilence && turnTakingEnabled) {
        // In turn-taking mode, silence callback is still wired
        // but decisions are made by the turn-taking model
        audioCapture.onSilence(() => {
          voiceWS.commit();
        });
      }

      // Error handling
      audioCapture.onError((err) => {
        setError(err.message);
        onError?.({ type: 'audio', message: err.message });
      });

      setIsRecording(true);
      console.log(`[useRealtimeVoice] Recording started (turn-taking: ${turnTakingEnabled ? 'enabled' : 'disabled'})`);

    } catch (err) {
      console.error('[useRealtimeVoice] Failed to start recording:', err);
      setError('Failed to access microphone');
      onError?.({ type: 'microphone', message: err.message });
      throw err;
    }
  }, [isSessionActive, startSession, autoCommitOnSilence, onError, isLunaSpeaking, turnTakingEnabled, onTurnDecision]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    audioCapture.stop();
    setIsRecording(false);
    setIsSpeaking(false);
    console.log('[useRealtimeVoice] Recording stopped');
  }, []);

  /**
   * Toggle recording on/off
   */
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  /**
   * Commit current audio (signal end of utterance)
   */
  const commit = useCallback(() => {
    if (isSessionActive) {
      voiceWS.commit();
    }
  }, [isSessionActive]);

  // ─────────────────────────────────────────────────────────────────────────────
  // STRATEGY CONTROL
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Change voice strategy
   */
  const setStrategy = useCallback((newStrategy) => {
    if (!Object.values(VOICE_STRATEGIES).includes(newStrategy)) {
      console.warn('[useRealtimeVoice] Invalid strategy:', newStrategy);
      return;
    }

    setCurrentStrategy(newStrategy);

    // If connected, update server
    if (isConnected) {
      voiceWS.setStrategy(newStrategy);
    }
  }, [isConnected]);

  // ─────────────────────────────────────────────────────────────────────────────
  // AUDIO PLAYBACK
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Stop Luna's audio playback
   */
  const stopLunaPlayback = useCallback(() => {
    voiceWS.stopPlayback();
    setIsLunaSpeaking(false);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // BARGE-IN DETECTION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handle barge-in: user started speaking while Luna was playing
   * v2: Now checks for backchannels to avoid false interrupts
   */
  const handleBargeIn = useCallback(async (transcript = null) => {
    // v2: Check if this is just a backchannel (don't interrupt for "yeah", "mhm", etc.)
    if (transcript && audioCapture.isBackchannel(transcript)) {
      console.log('[useRealtimeVoice] Backchannel detected - not interrupting Luna');
      return; // Don't interrupt for backchannels
    }

    console.log('[useRealtimeVoice] BARGE-IN: User interrupted Luna');

    // Stop Luna's playback
    voiceWS.stopPlayback();
    setIsLunaSpeaking(false);

    // Stop listening mode
    audioCapture.stopListening();
    setIsListening(false);

    // Configure turn-taking for the new recording session (v2)
    if (turnTakingEnabled) {
      audioCapture.setTurnTakingEnabled(true);
      if (userProfileRef.current) {
        audioCapture.setUserProfile(userProfileRef.current);
      }
    }

    // Transition to full recording mode
    await audioCapture.transitionToCapture();

    // Wire up audio data to WebSocket
    audioCapture.onAudioData((pcm16) => {
      voiceWS.sendAudio(pcm16);
    });

    // Voice activity detection
    audioCapture.onVoiceActivity((speaking) => {
      setIsSpeaking(speaking);
    });

    // Turn-taking decision listener (v2)
    if (turnTakingEnabled) {
      audioCapture.onTurnDecision((decision) => {
        setTurnDecision(decision);
        setProsodyState(decision.prosody);
        onTurnDecision?.(decision);
      });
    }

    // Auto-commit on silence
    if (autoCommitOnSilence) {
      audioCapture.onSilence(() => {
        voiceWS.commit();
      });
    }

    setIsRecording(true);

    // Notify parent
    onBargeIn?.();
  }, [autoCommitOnSilence, onBargeIn, turnTakingEnabled, onTurnDecision]);

  /**
   * Start passive listening for barge-in detection
   */
  const startListening = useCallback(async () => {
    if (!bargeInEnabled || isListening || isRecording) return;

    try {
      // Register barge-in callback
      audioCapture.onBargeIn(() => {
        handleBargeIn();
      });

      await audioCapture.startListening();
      setIsListening(true);
      console.log('[useRealtimeVoice] Listening for barge-in');
    } catch (err) {
      console.error('[useRealtimeVoice] Failed to start listening:', err);
    }
  }, [bargeInEnabled, isListening, isRecording, handleBargeIn]);

  /**
   * Stop passive listening
   */
  const stopListening = useCallback(() => {
    if (!isListening) return;
    audioCapture.stopListening();
    setIsListening(false);
    console.log('[useRealtimeVoice] Stopped listening');
  }, [isListening]);

  // ─────────────────────────────────────────────────────────────────────────────
  // EVENT LISTENERS
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    // WebSocket connection listeners
    const unsubConnect = voiceWS.onConnect(() => {
      setIsConnected(true);
    });

    const unsubDisconnect = voiceWS.onDisconnect(() => {
      setIsConnected(false);
      setIsSessionActive(false);
    });

    // Transcript listener
    const unsubTranscript = voiceWS.onTranscript((transcript) => {
      if (transcript.speaker === 'user') {
        setUserTranscripts(prev => [...prev, transcript]);
      } else {
        setLunaTranscripts(prev => [...prev, transcript]);

        // TTS FOR GROQ PATH: Notify parent to speak Luna's response
        // Only fires when using Groq STT (no native audio from OpenAI)
        if (transcript.provider === 'groq_whisper' || !transcript.hasAudio) {
          onLunaResponse?.(transcript.text);
        }
      }

      // Call external callback
      onTranscript?.(transcript);
    });

    // Cue listener
    const unsubCue = voiceWS.onCue((cue) => {
      setCues(prev => [...prev, cue]);
      onCue?.(cue);
    });

    // Audio listener (track Luna speaking state + echo cancellation + barge-in)
    const unsubAudio = voiceWS.onAudio(() => {
      setIsLunaSpeaking(true);

      // ECHO CANCELLATION: Mute mic while Luna speaks (if recording)
      if (audioCapture.isCapturing) {
        audioCapture.mute();
      }

      // BARGE-IN: Start listening for user interrupt (if enabled and not recording)
      if (bargeInEnabled && !audioCapture.isCapturing && !audioCapture.isListening) {
        // Register barge-in callback and start listening
        audioCapture.onBargeIn(() => {
          // This will be called when user voice is detected
          console.log('[useRealtimeVoice] Barge-in detected via audio listener');
        });
        audioCapture.startListening().catch(console.error);
      }
    });

    // Playback ended listener (unmute mic + stop listening)
    const unsubPlaybackEnded = voiceWS.onPlaybackEnded?.(() => {
      setIsLunaSpeaking(false);

      // ECHO CANCELLATION: Unmute mic when Luna stops
      if (audioCapture.isCapturing) {
        audioCapture.unmute();
      }

      // BARGE-IN: Stop listening when Luna stops (if we didn't barge-in)
      if (audioCapture.isListening) {
        audioCapture.stopListening();
      }
    }) || (() => {});

    // Error listener
    const unsubError = voiceWS.onError((err) => {
      setError(err.message);
      onError?.(err);
    });

    // Store cleanup functions
    cleanupRef.current = [
      unsubConnect,
      unsubDisconnect,
      unsubTranscript,
      unsubCue,
      unsubAudio,
      unsubPlaybackEnded,
      unsubError
    ];

    // Auto-connect if enabled
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      cleanupRef.current.forEach(unsub => unsub?.());

      if (isRecording) {
        audioCapture.stop();
      }

      if (audioCapture.isListening) {
        audioCapture.stopListening();
      }

      if (isSessionActive) {
        voiceWS.endSession().catch(console.error);
      }
    };
  }, []); // Only run on mount

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get current status
   */
  const getStatus = useCallback(() => {
    return {
      isConnected,
      isSessionActive,
      isRecording,
      isListening,
      isSpeaking,
      isLunaSpeaking,
      bargeInEnabled,
      provider,
      supportsCues,
      strategy: currentStrategy,
      sessionId: sessionIdRef.current,
      transcriptCount: {
        user: userTranscripts.length,
        luna: lunaTranscripts.length
      },
      cueCount: cues.length,
      // Turn-taking status (v2)
      turnTaking: {
        enabled: turnTakingEnabled,
        currentDecision: turnDecision,
        prosodyState,
        stats: audioCapture.getTurnTakingStats?.() || null
      }
    };
  }, [
    isConnected, isSessionActive, isRecording, isListening, isSpeaking, isLunaSpeaking,
    bargeInEnabled, provider, supportsCues, currentStrategy, userTranscripts, lunaTranscripts, cues,
    turnTakingEnabled, turnDecision, prosodyState
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────────────────────────────────

  return {
    // Connection state
    isConnected,
    connect,
    disconnect,

    // Session state
    isSessionActive,
    startSession,
    stopSession,
    sessionId: sessionIdRef.current,

    // Recording state
    isRecording,
    isListening,     // Passive listening for barge-in
    isSpeaking,      // User is speaking
    isLunaSpeaking,  // Luna is speaking
    startRecording,
    stopRecording,
    toggleRecording,
    commit,
    stopLunaPlayback,

    // Barge-in detection
    bargeInEnabled,
    startListening,
    stopListening,

    // Turn-taking (v2)
    turnTakingEnabled,
    turnDecision,
    prosodyState,

    // Provider info
    provider,
    supportsCues,
    strategy: currentStrategy,
    setStrategy,

    // Transcripts
    userTranscripts,
    lunaTranscripts,
    cues,

    // Errors
    error,
    clearError,

    // Utilities
    getStatus,

    // Constants
    VOICE_STRATEGIES
  };
}

export default useRealtimeVoice;
