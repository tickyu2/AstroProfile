/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOICE CONTROL PANEL - Luna Voice Integration with Soul Visualizer
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Complete voice control panel for AISoulPartnerChat:
 * - Text-to-speech for AI responses
 * - SoulVisualizer audio-reactive animation
 * - Voice settings toggle
 * - Constitutional color theming
 *
 * Created: December 21, 2025
 * Mission: "Give Luna a voice that resonates with each soul"
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import SoulVisualizer, { SoulVisualizerMini, ELEMENTAL_PALETTES } from './SoulVisualizer';
import { voicePreferencesService, LUNA_VOICES } from '../../services/voicePreferencesService';
import './VoiceControlPanel.css';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const TONE_MARKER_REGEX = /\[tone:\s*(\w+)\]/gi;

/**
 * Strip tone markers from text for display
 */
function stripToneMarkers(text) {
  return text.replace(TONE_MARKER_REGEX, '').replace(/\s+/g, ' ').trim();
}

/**
 * Extract the first tone marker from text (for visualization)
 */
function extractFirstTone(text) {
  const match = TONE_MARKER_REGEX.exec(text);
  TONE_MARKER_REGEX.lastIndex = 0;
  return match ? match[1].toLowerCase() : 'neutral';
}

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE CONTROL PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const VoiceControlPanel = ({
  profileId,                     // Profile ID for voice preferences
  constitution = 'Water',        // User's elemental constitution
  lunaVoice = 'present',         // Selected Luna voice profile
  isEnabled = false,             // Whether voice is enabled
  onToggle,                      // Callback when voice is toggled
  className = '',
  compact = false                // Compact mode for inline display
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTone, setCurrentTone] = useState('neutral');
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(lunaVoice);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /**
   * Speak text using Luna's voice
   */
  const speak = useCallback(async (text) => {
    if (!isEnabled || !text) return;

    setIsLoading(true);
    setError(null);

    try {
      // Extract first tone for visualization
      const tone = extractFirstTone(text);
      setCurrentTone(tone);

      // Generate speech
      const result = await voicePreferencesService.generateSpeech(
        text,
        profileId,
        { voiceOverride: selectedVoice }
      );

      if (result.fallback) {
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(result.text || stripToneMarkers(text));
        utterance.rate = result.voiceConfig?.rate || 1.0;
        utterance.pitch = result.voiceConfig?.pitch || 1.0;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else if (result.audio) {
        // Play ElevenLabs audio
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
            URL.revokeObjectURL(url);
          };
          audioRef.current.onerror = () => {
            setError('Audio playback error');
            setIsPlaying(false);
          };
          await audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error('[VoiceControlPanel] Error speaking:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled, profileId, selectedVoice]);

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
    setCurrentTone('neutral');
  }, []);

  /**
   * Handle voice selection change
   */
  const handleVoiceChange = async (voiceId) => {
    setSelectedVoice(voiceId);
    if (profileId) {
      try {
        await voicePreferencesService.selectVoice(profileId, voiceId);
      } catch (err) {
        console.error('[VoiceControlPanel] Error saving voice preference:', err);
      }
    }
  };

  // Get palette for current constitution
  const palette = ELEMENTAL_PALETTES[constitution] || ELEMENTAL_PALETTES.Water;

  // Compact mode - just the mini visualizer and toggle
  if (compact) {
    return (
      <div className={`voice-control-compact ${className}`}>
        <SoulVisualizerMini
          isSpeaking={isPlaying}
          constitution={constitution}
        />
        <button
          onClick={() => onToggle?.(!isEnabled)}
          className={`voice-toggle-compact ${isEnabled ? 'enabled' : ''}`}
          title={isEnabled ? 'Disable voice' : 'Enable voice'}
        >
          {isEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`voice-control-panel ${className}`}
      style={{
        '--voice-primary': palette.primary,
        '--voice-glow': palette.glow
      }}
    >
      {/* Soul Visualizer */}
      <div className="voice-visualizer-container">
        <SoulVisualizer
          audioRef={{ current: audioRef.current }}
          isSpeaking={isPlaying}
          constitution={constitution}
          lunaVoice={selectedVoice}
          currentTone={currentTone}
          size="small"
          showLabel={false}
        />
      </div>

      {/* Controls */}
      <div className="voice-controls">
        {/* Main Toggle */}
        <button
          onClick={() => onToggle?.(!isEnabled)}
          className={`voice-toggle ${isEnabled ? 'enabled' : ''}`}
        >
          <span className="toggle-icon">{isEnabled ? '🔊' : '🔇'}</span>
          <span className="toggle-label">{isEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>

        {/* Stop Button (when playing) */}
        {isPlaying && (
          <button onClick={stop} className="voice-stop">
            ⏹ Stop
          </button>
        )}

        {/* Settings Toggle */}
        {isEnabled && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="voice-settings-toggle"
          >
            ⚙️
          </button>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && isEnabled && (
        <div className="voice-settings-panel">
          {/* Voice Selection */}
          <div className="voice-setting">
            <label>Luna's Voice</label>
            <div className="voice-options">
              {Object.entries(LUNA_VOICES).map(([id, voice]) => (
                <button
                  key={id}
                  onClick={() => handleVoiceChange(id)}
                  className={`voice-option ${selectedVoice === id ? 'selected' : ''}`}
                  title={voice.description}
                >
                  <span className="voice-emoji">{voice.emoji}</span>
                  <span className="voice-name">{voice.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="voice-setting">
            <label>Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
        </div>
      )}

      {/* Loading / Error States */}
      {isLoading && (
        <div className="voice-loading">
          <span className="loading-spinner">🌀</span>
          Generating voice...
        </div>
      )}

      {error && (
        <div className="voice-error">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPEAK BUTTON - For individual messages
// ═══════════════════════════════════════════════════════════════════════════════

export const MessageSpeakButton = ({
  text,
  profileId,
  constitution = 'Water',
  lunaVoice = 'present',
  isVoiceEnabled = true,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeak = async () => {
    if (!text || isPlaying) return;

    setIsLoading(true);
    try {
      await voicePreferencesService.speak(stripToneMarkers(text), profileId, {
        voiceOverride: lunaVoice
      });
      setIsPlaying(true);

      // Track playback state
      voicePreferencesService.onPlaybackStateChange = (playing) => {
        setIsPlaying(playing);
      };
    } catch (err) {
      console.error('[MessageSpeakButton] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    voicePreferencesService.stopSpeaking();
    setIsPlaying(false);
  };

  if (!isVoiceEnabled) return null;

  const palette = ELEMENTAL_PALETTES[constitution] || ELEMENTAL_PALETTES.Water;

  return (
    <button
      onClick={isPlaying ? handleStop : handleSpeak}
      disabled={isLoading}
      className={`message-speak-button ${isPlaying ? 'playing' : ''} ${className}`}
      style={{ '--speak-color': palette.primary }}
      title={isPlaying ? 'Stop speaking' : 'Listen to message'}
    >
      {isLoading ? (
        <span className="speak-loading">⏳</span>
      ) : isPlaying ? (
        <>
          <SoulVisualizerMini isSpeaking={true} constitution={constitution} />
          <span>⏹</span>
        </>
      ) : (
        <span>🔊</span>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { stripToneMarkers, extractFirstTone };
export default VoiceControlPanel;
