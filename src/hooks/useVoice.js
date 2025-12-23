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
 *
 * Created: December 21, 2025
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { voicePreferencesService, LUNA_VOICES } from '../services/voicePreferencesService';

/**
 * Custom hook for Luna Voice integration
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.userProfile - User profile with constitutional data
 * @param {boolean} options.autoSpeak - Auto-speak new AI messages (default: false)
 * @param {string} options.defaultVoice - Default Luna voice profile (default: 'present')
 * @returns {Object} Voice state and controls
 */
export function useVoice({
  userProfile,
  autoSpeak = false,
  defaultVoice = 'present'
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
  // VOICE CONTROLS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Toggle voice on/off
   */
  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => !prev);
  }, []);

  /**
   * Speak text using Luna's voice
   */
  const speak = useCallback(async (text, messageId = null) => {
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
   * Stop current playback
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setCurrentMessageId(null);
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

    // Controls
    toggleVoice,
    setIsVoiceEnabled,
    speak,
    stop,
    changeVoice,
    setVolume,
    clearError,
    autoSpeakMessage,

    // Refs (for advanced use)
    audioRef,

    // Constants
    availableVoices: LUNA_VOICES
  };
}

export default useVoice;
