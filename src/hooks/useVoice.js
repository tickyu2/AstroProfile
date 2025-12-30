/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USE VOICE HOOK - Luna Voice Integration
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Centralized voice state management for Luna TTS.
 * Extracts voice features from AISoulPartnerChat for cleaner architecture.
 *
 * Features:
 * - Voice enable/disable state
 * - Constitution extraction for theming
 * - Voice preferences persistence
 * - Auto-speak for new AI messages (optional)
 * - Streaming TTS for lower latency progressive playback
 *
 * Created: December 21, 2025
 * Updated: December 27, 2025 - Added streaming TTS support
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { voicePreferencesService, LUNA_VOICES } from '../services/voicePreferencesService';
import { streamingTTS } from '../services/streamingTTSService';

/**
 * Custom hook for Luna Voice integration
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.userProfile - User profile with constitutional data
 * @param {boolean} options.autoSpeak - Auto-speak new AI messages (default: false)
 * @param {string} options.defaultVoice - Default Luna voice profile (default: 'present')
 * @param {boolean} options.streamingEnabled - Enable streaming TTS for lower latency (default: false)
 * @returns {Object} Voice state and controls
 */
export function useVoice({
  userProfile,
  autoSpeak = false,
  defaultVoice = 'present',
  streamingEnabled: initialStreamingEnabled = false
} = {}) {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(defaultVoice);
  const [volume, setVolume] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [error, setError] = useState(null);

  // Streaming TTS state
  const [streamingEnabled, setStreamingEnabled] = useState(initialStreamingEnabled);
  const [streamingProgress, setStreamingProgress] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const audioRef = useRef(null);
  const lastSpokenMessageRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // DERIVED STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Extract constitution from user profile (BaZi Day Master element)
   * Used for SoulVisualizer color theming
   */
  const constitution = useMemo(() => {
    const dayMaster = userProfile?.constitutional_identity?.bazi?.day_master;
    if (dayMaster) {
      // Day master format: "Yin Wood" or "Yang Fire" - extract element
      const parts = dayMaster.split(' ');
      return parts[parts.length - 1] || 'Water';
    }
    return 'Water'; // Default to Water
  }, [userProfile?.constitutional_identity?.bazi?.day_master]);

  /**
   * Profile ID for voice preferences
   */
  const profileId = useMemo(() => userProfile?.id, [userProfile?.id]);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO SETUP
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ═══════════════════════════════════════════════════════════════════════════
  // STREAMING TTS SETUP
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    // Setup streaming TTS callbacks
    streamingTTS.setOnProgress((progress) => {
      setStreamingProgress({
        current: progress.current,
        total: progress.total,
        percent: Math.round((progress.current / progress.total) * 100),
        currentChunk: progress.chunk
      });
    });

    streamingTTS.setOnChunkStart(({ text }) => {
      setIsStreaming(true);
      setIsPlaying(true);
    });

    streamingTTS.setOnComplete(() => {
      setIsStreaming(false);
      setIsPlaying(false);
      setStreamingProgress(null);
      setCurrentMessageId(null);
    });

    streamingTTS.setOnError((err) => {
      console.error('[useVoice] Streaming TTS error:', err);
      setError(err.message || 'Streaming TTS error');
      setIsStreaming(false);
      setIsPlaying(false);
    });

    return () => {
      streamingTTS.stop();
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // VOICE CONTROLS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Toggle voice on/off
   */
  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => !prev);
  }, []);

  /**
   * Speak text using Luna's voice (streaming mode if enabled)
   * Automatically chooses streaming or standard based on settings
   */
  const speak = useCallback(async (text, messageId = null) => {
    if (!isVoiceEnabled || !text) return;

    // Use streaming if enabled and text is long enough to benefit
    if (streamingEnabled && text.length > 100) {
      return streamSpeak(text, messageId);
    }

    // Standard (non-streaming) TTS
    return speakStandard(text, messageId);
  }, [isVoiceEnabled, streamingEnabled]);

  /**
   * Standard TTS (full generation before playback)
   */
  const speakStandard = useCallback(async (text, messageId = null) => {
    if (!isVoiceEnabled || !text) return;

    setError(null);
    setCurrentMessageId(messageId);

    try {
      const result = await voicePreferencesService.generateSpeech(
        text,
        profileId,
        { voiceOverride: selectedVoice }
      );

      if (result.fallback) {
        // Browser TTS fallback
        const utterance = new SpeechSynthesisUtterance(result.text || text);
        utterance.rate = result.voiceConfig?.rate || 1.0;
        utterance.pitch = result.voiceConfig?.pitch || 1.0;
        utterance.volume = volume;
        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentMessageId(null);
        };
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else if (result.audio) {
        // ElevenLabs audio
        const audioData = atob(result.audio);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i);
        }

        const blob = new Blob([audioArray], { type: result.contentType });
        const url = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.onended = () => {
            setIsPlaying(false);
            setCurrentMessageId(null);
            URL.revokeObjectURL(url);
          };
          audioRef.current.onerror = () => {
            setError('Audio playback error');
            setIsPlaying(false);
            setCurrentMessageId(null);
          };
          await audioRef.current.play();
          setIsPlaying(true);
        }
      }

      if (messageId) {
        lastSpokenMessageRef.current = messageId;
      }
    } catch (err) {
      console.error('[useVoice] Error speaking:', err);
      setError(err.message);
      setIsPlaying(false);
      setCurrentMessageId(null);
    }
  }, [isVoiceEnabled, profileId, selectedVoice, volume]);

  /**
   * Streaming TTS - progressive playback with lower latency
   */
  const streamSpeak = useCallback(async (text, messageId = null) => {
    if (!isVoiceEnabled || !text) return;

    setError(null);
    setCurrentMessageId(messageId);
    setIsStreaming(true);
    setIsPlaying(true);

    try {
      await streamingTTS.streamText(text, profileId, {
        voiceOverride: selectedVoice,
        modelOverride: 'turbo' // Use turbo model for faster streaming
      });

      if (messageId) {
        lastSpokenMessageRef.current = messageId;
      }
    } catch (err) {
      console.error('[useVoice] Streaming error:', err);
      setError(err.message);
      setIsStreaming(false);
      setIsPlaying(false);
      setCurrentMessageId(null);
    }
  }, [isVoiceEnabled, profileId, selectedVoice]);

  /**
   * Stop current playback (standard and streaming)
   */
  const stop = useCallback(() => {
    // Stop standard audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();

    // Stop streaming TTS
    streamingTTS.stop();

    setIsPlaying(false);
    setIsStreaming(false);
    setStreamingProgress(null);
    setCurrentMessageId(null);
  }, []);

  /**
   * Toggle streaming TTS mode
   */
  const toggleStreaming = useCallback(() => {
    setStreamingEnabled(prev => !prev);
  }, []);

  /**
   * Change Luna's voice
   */
  const changeVoice = useCallback(async (voiceId) => {
    setSelectedVoice(voiceId);
    if (profileId) {
      try {
        await voicePreferencesService.selectVoice(profileId, voiceId);
      } catch (err) {
        console.error('[useVoice] Error saving voice preference:', err);
      }
    }
  }, [profileId]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTO-SPEAK (Optional)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Hook to auto-speak new AI messages
   * Call this with the latest AI message when it arrives
   */
  const autoSpeakMessage = useCallback((message) => {
    if (!autoSpeak || !isVoiceEnabled || !message) return;
    if (message.sender !== 'ai') return;
    if (lastSpokenMessageRef.current === message.id) return;

    speak(message.text, message.id);
  }, [autoSpeak, isVoiceEnabled, speak]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    // State
    isVoiceEnabled,
    selectedVoice,
    volume,
    isPlaying,
    currentMessageId,
    error,
    constitution,
    profileId,

    // Streaming state
    streamingEnabled,
    isStreaming,
    streamingProgress,

    // Controls
    toggleVoice,
    setIsVoiceEnabled,
    speak,
    speakStandard,
    streamSpeak,
    stop,
    changeVoice,
    setVolume,
    clearError,
    autoSpeakMessage,

    // Streaming controls
    toggleStreaming,
    setStreamingEnabled,

    // Refs (for advanced use)
    audioRef,

    // Constants
    availableVoices: LUNA_VOICES
  };
}

export default useVoice;
