/**
 * useVoiceChat.js
 * Custom hook for Luna Voice Integration - manages voice state,
 * session lifecycle, transcript tracking, and voice settings.
 *
 * Extracted from AISoulPartnerChat.jsx - Part of GENESIS Phase 2
 */

import { useState, useEffect, useMemo } from 'react';
import { useVoice } from '../../../hooks/useVoice';
import { useRealtimeVoice, VOICE_STRATEGIES } from '../../../hooks/useRealtimeVoice';

/**
 * @param {Object} params
 * @param {Object} params.userProfile - Current user profile
 */
export function useVoiceChat({ userProfile }) {
  // Luna Voice Integration (via useVoice hook for TTS)
  const {
    isVoiceEnabled,
    setIsVoiceEnabled,
    speak: speakWithTTS,
    stop: stopTTS,
    isPlaying: isTTSPlaying,
    constitution: userConstitution
  } = useVoice({ userProfile });

  // Barge-in state (must be declared before useRealtimeVoice)
  const [bargeInEnabled, setBargeInEnabled] = useState(true); // Auto-interrupt when user speaks

  // Voice Transcript Panel State
  const [showVoiceTranscript, setShowVoiceTranscript] = useState(false);
  const [voiceSessionId, setVoiceSessionId] = useState(null);
  const [userVoiceTranscripts, setUserVoiceTranscripts] = useState([]);
  const [lunaVoiceTranscripts, setLunaVoiceTranscripts] = useState([]);

  // Voice Settings State
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showEmotionalCues, setShowEmotionalCues] = useState(true);

  // Realtime Voice Integration (via useRealtimeVoice hook for STT/streaming)
  const {
    isConnected: isVoiceConnected,
    isSessionActive: isVoiceSessionActive,
    isRecording,
    isListening: isVoiceListening,
    isSpeaking: isUserSpeaking,
    isLunaSpeaking,
    startSession: startVoiceSession,
    stopSession: stopVoiceSession,
    startRecording,
    stopRecording,
    toggleRecording,
    commit: commitVoiceInput,
    provider: voiceProvider,
    supportsCues: voiceSupportsCues,
    strategy: voiceStrategy,
    setStrategy: setVoiceStrategy,
    userTranscripts: realtimeUserTranscripts,
    lunaTranscripts: realtimeLunaTranscripts,
    cues: voiceCues,
    error: voiceError,
    clearError: clearVoiceError
  } = useRealtimeVoice({
    profileId: userProfile?.id,
    strategy: VOICE_STRATEGIES.GROQ_ONLY,
    bargeInEnabled, // Enable barge-in detection
    onTranscript: (transcript) => {
      console.log('[Voice] Transcript:', transcript);
      // Add to local transcripts for the panel
      if (transcript.speaker === 'user') {
        setUserVoiceTranscripts(prev => [...prev, transcript]);
      } else {
        setLunaVoiceTranscripts(prev => [...prev, transcript]);
      }
    },
    onCue: (cue) => {
      console.log('[Voice] Cue detected:', cue);
    },
    onError: (err) => {
      console.error('[Voice] Error:', err);
    },
    // TTS FOR GROQ PATH: Speak Luna's response using TTS when not using OpenAI native voice
    onLunaResponse: (text) => {
      if (isVoiceEnabled && text) {
        console.log('[Voice] TTS for Groq path - speaking Luna response');
        speakWithTTS(text);
      }
    },
    // BARGE-IN: Callback when user interrupts Luna
    onBargeIn: () => {
      console.log('[Voice] User barged in - interrupted Luna');
      // Also stop TTS if playing
      if (isTTSPlaying) {
        stopTTS();
      }
    }
  });

  // Computed voice provider status for UI
  const voiceProviderStatus = useMemo(() => ({
    provider: voiceProvider || 'groq_whisper',
    isConnected: isVoiceConnected,
    supportsCues: voiceSupportsCues
  }), [voiceProvider, isVoiceConnected, voiceSupportsCues]);

  // Voice Session Management - Start/End session when voice mode toggles
  useEffect(() => {
    const handleVoiceToggle = async () => {
      if (isVoiceEnabled) {
        // Start new voice session via realtime hook
        try {
          const result = await startVoiceSession();
          setVoiceSessionId(result?.sessionId || `voice_${Date.now()}_${userProfile?.id || 'unknown'}`);
          setUserVoiceTranscripts([]);
          setLunaVoiceTranscripts([]);
          setShowVoiceTranscript(true);
          console.log('\u{1F3A4} Voice session started:', result?.sessionId);
        } catch (err) {
          console.error('\u{1F3A4} Failed to start voice session:', err);
          // Fallback to local session
          const fallbackId = `voice_${Date.now()}_${userProfile?.id || 'unknown'}`;
          setVoiceSessionId(fallbackId);
          setUserVoiceTranscripts([]);
          setLunaVoiceTranscripts([]);
          setShowVoiceTranscript(true);
        }
      } else if (voiceSessionId) {
        // Voice mode turned off - stop session
        try {
          await stopVoiceSession();
          console.log('\u{1F3A4} Voice session ended:', voiceSessionId);
        } catch (err) {
          console.error('\u{1F3A4} Error stopping voice session:', err);
        }
        // Don't clear transcripts immediately - let user review
      }
    };

    handleVoiceToggle();
  }, [isVoiceEnabled, userProfile?.id]);

  // Helper: Add user voice transcript
  const addUserVoiceTranscript = (text) => {
    if (!text?.trim()) return;
    setUserVoiceTranscripts(prev => [...prev, {
      text: text.trim(),
      timestamp: Date.now()
    }]);
  };

  // Helper: Add Luna voice transcript
  const addLunaVoiceTranscript = (text) => {
    if (!text?.trim()) return;
    setLunaVoiceTranscripts(prev => [...prev, {
      text: text.trim(),
      timestamp: Date.now()
    }]);
  };

  return {
    // TTS State
    isVoiceEnabled,
    setIsVoiceEnabled,
    speakWithTTS,
    stopTTS,
    isTTSPlaying,
    userConstitution,

    // Realtime Voice State
    isVoiceConnected,
    isVoiceSessionActive,
    isRecording,
    isVoiceListening,
    isUserSpeaking,
    isLunaSpeaking,
    startVoiceSession,
    stopVoiceSession,
    startRecording,
    stopRecording,
    toggleRecording,
    commitVoiceInput,
    voiceProvider,
    voiceSupportsCues,
    voiceStrategy,
    setVoiceStrategy,
    realtimeUserTranscripts,
    realtimeLunaTranscripts,
    voiceCues,
    voiceError,
    clearVoiceError,

    // Voice Transcript Panel
    showVoiceTranscript,
    setShowVoiceTranscript,
    voiceSessionId,
    userVoiceTranscripts,
    lunaVoiceTranscripts,

    // Voice Settings
    showVoiceSettings,
    setShowVoiceSettings,
    showEmotionalCues,
    setShowEmotionalCues,
    bargeInEnabled,
    setBargeInEnabled,

    // Computed
    voiceProviderStatus,

    // Helpers
    addUserVoiceTranscript,
    addLunaVoiceTranscript
  };
}
