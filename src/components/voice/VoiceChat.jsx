/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOICE CHAT - Luna Voice Interface Component
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Full-screen voice conversation interface with Luna featuring:
 * - Beautiful canvas visualization
 * - Real-time transcription display
 * - Push-to-talk and continuous modes
 * - Profile-aware conversations
 * - Memory integration
 *
 * @module VoiceChat
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import voiceService, { VOICE_STATES } from '../../services/voiceService';
import memoryService from '../../services/memoryService';
import LunaVisualizer from './LunaVisualizer';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  overlayVisible: {
    opacity: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 24,
    transition: 'background-color 0.2s ease',
  },
  profileInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#8B5CF6',
    marginBottom: 4,
  },
  visualizerContainer: {
    marginBottom: 40,
  },
  transcriptContainer: {
    width: '100%',
    maxWidth: 600,
    height: 200,
    padding: '0 20px',
    overflowY: 'auto',
    marginBottom: 40,
  },
  transcriptMessage: {
    marginBottom: 16,
    animation: 'fadeIn 0.3s ease',
  },
  transcriptUser: {
    textAlign: 'right',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  transcriptAssistant: {
    textAlign: 'left',
    color: '#C4B5FD',
  },
  transcriptLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 4,
    opacity: 0.6,
  },
  transcriptText: {
    fontSize: 16,
    lineHeight: 1.5,
  },
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  mainButtonIdle: {
    backgroundColor: '#8B5CF6',
  },
  mainButtonActive: {
    backgroundColor: '#EF4444',
    animation: 'pulse 1.5s infinite',
  },
  mainButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    cursor: 'not-allowed',
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    transition: 'all 0.2s ease',
  },
  muteActive: {
    backgroundColor: '#EF4444',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 14,
  },
  permissionPrompt: {
    textAlign: 'center',
    color: '#fff',
  },
  permissionTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
    maxWidth: 400,
  },
  permissionButton: {
    backgroundColor: '#8B5CF6',
    color: '#fff',
    border: 'none',
    padding: '12px 32px',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  unsupportedContainer: {
    textAlign: 'center',
    color: '#fff',
    padding: 40,
  },
  keyboardHint: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════

const MicIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
);

const StopIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2"/>
  </svg>
);

const MuteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
  </svg>
);

const UnmuteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21c0 .55.45 1 1 1s1-.45 1-1v-3.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE CHAT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const VoiceChat = ({ isOpen, onClose, profile: selectedProfile }) => {

  // State
  const [voiceState, setVoiceState] = useState(VOICE_STATES.IDLE);
  const [isSupported, setIsSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [audioData, setAudioData] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Refs
  const transcriptRef = useRef(null);

  // Check support on mount
  useEffect(() => {
    setIsSupported(voiceService.constructor.isSupported());
  }, []);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Initialize voice service
  const initializeVoice = useCallback(async () => {
    try {
      // Get memory context for Luna
      let memoryContext = null;
      if (selectedProfile?.id) {
        try {
          memoryContext = await memoryService.getDualBrainContext(selectedProfile.id);
        } catch (e) {
          console.warn('[VoiceChat] Could not load memory context:', e);
        }
      }

      await voiceService.initialize({
        profile: selectedProfile,
        memoryContext: memoryContext,
        onStateChange: (newState) => {
          setVoiceState(newState);
          if (newState === VOICE_STATES.ERROR) {
            // Don't clear error state automatically
          }
        },
        onTranscript: (data) => {
          setTranscript(prev => {
            const newTranscript = [...prev];

            // Find existing message of same type
            const lastIndex = newTranscript.length - 1;
            const lastMessage = newTranscript[lastIndex];

            if (lastMessage && lastMessage.type === data.type && !lastMessage.isFinal) {
              // Update existing message
              newTranscript[lastIndex] = { ...data, timestamp: lastMessage.timestamp };
            } else if (data.text.trim()) {
              // Add new message
              newTranscript.push({ ...data, timestamp: Date.now() });
            }

            return newTranscript;
          });
        },
        onError: (err) => {
          setError(err.message);
          setTimeout(() => setError(null), 5000);
        },
        onVisualizerData: (data) => {
          setAudioData(data);
          // Calculate audio level
          if (data.frequencyData) {
            const sum = data.frequencyData.reduce((a, b) => a + b, 0);
            setAudioLevel(sum / (data.frequencyData.length * 255));
          }
        }
      });

      setHasPermission(true);

    } catch (error) {
      console.error('[VoiceChat] Initialization failed:', error);
      setHasPermission(false);
    }
  }, [selectedProfile]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === ' ' && !e.repeat) {
        e.preventDefault();
        if (voiceState === VOICE_STATES.IDLE) {
          handleStartSession();
        }
      } else if (e.key === 'm') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, voiceState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      voiceService.endSession();
    };
  }, []);

  // Handlers
  const handleStartSession = async () => {
    setError(null);
    setTranscript([]);

    if (hasPermission === null) {
      await initializeVoice();
    }

    const success = await voiceService.startSession();
    if (!success) {
      setError('Failed to start voice session');
    }
  };

  const handleEndSession = async () => {
    await voiceService.endSession();
    setVoiceState(VOICE_STATES.IDLE);
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    voiceService.setMuted(newMuted);
  };

  const handleClose = async () => {
    setIsVisible(false);
    await voiceService.endSession();
    setTimeout(() => {
      setTranscript([]);
      setVoiceState(VOICE_STATES.IDLE);
      onClose();
    }, 300);
  };

  const handleRequestPermission = async () => {
    await initializeVoice();
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Unsupported browser
  if (!isSupported) {
    return (
      <div style={{ ...styles.overlay, ...styles.overlayVisible }}>
        <button style={styles.closeButton} onClick={handleClose}>
          <CloseIcon />
        </button>
        <div style={styles.unsupportedContainer}>
          <h2>Voice Chat Not Supported</h2>
          <p style={{ marginTop: 16, opacity: 0.7 }}>
            Your browser doesn't support the required audio features.
            Please try using Chrome, Firefox, or Edge.
          </p>
        </div>
      </div>
    );
  }

  // Permission prompt
  if (hasPermission === false || hasPermission === null) {
    return (
      <div style={{ ...styles.overlay, ...(isVisible ? styles.overlayVisible : {}) }}>
        <button style={styles.closeButton} onClick={handleClose}>
          <CloseIcon />
        </button>
        <div style={styles.permissionPrompt}>
          <h2 style={styles.permissionTitle}>Talk with Luna</h2>
          <p style={styles.permissionText}>
            {hasPermission === false
              ? 'Microphone access was denied. Please enable it in your browser settings and try again.'
              : 'To have a voice conversation with Luna, please allow microphone access when prompted.'}
          </p>
          <button
            style={styles.permissionButton}
            onClick={handleRequestPermission}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7C3AED'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#8B5CF6'}
          >
            {hasPermission === false ? 'Try Again' : 'Enable Microphone'}
          </button>
        </div>
      </div>
    );
  }

  // Main interface
  const isActive = voiceState !== VOICE_STATES.IDLE && voiceState !== VOICE_STATES.ERROR;

  return (
    <div style={{ ...styles.overlay, ...(isVisible ? styles.overlayVisible : {}) }}>
      {/* Close button */}
      <button
        style={styles.closeButton}
        onClick={handleClose}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
      >
        <CloseIcon />
      </button>

      {/* Profile info */}
      {selectedProfile && (
        <div style={styles.profileInfo}>
          <div style={styles.profileName}>
            Speaking about {selectedProfile.basicInfo?.name || 'Unknown'}
          </div>
          <div>Luna knows their chart and memories</div>
        </div>
      )}

      {/* Visualizer */}
      <div style={styles.visualizerContainer}>
        <LunaVisualizer
          state={voiceState}
          audioData={audioData}
          audioLevel={audioLevel}
          size={300}
        />
      </div>

      {/* Transcript */}
      <div style={styles.transcriptContainer} ref={transcriptRef}>
        {transcript.map((msg, index) => (
          <div
            key={`${msg.timestamp}-${index}`}
            style={{
              ...styles.transcriptMessage,
              ...(msg.type === 'user' ? styles.transcriptUser : styles.transcriptAssistant)
            }}
          >
            <div style={styles.transcriptLabel}>
              {msg.type === 'user' ? 'You' : 'Luna'}
            </div>
            <div style={styles.transcriptText}>{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={styles.controlsContainer}>
        {/* Mute button */}
        <button
          style={{
            ...styles.secondaryButton,
            ...(isMuted ? styles.muteActive : {}),
            opacity: isActive ? 1 : 0.5,
            pointerEvents: isActive ? 'auto' : 'none'
          }}
          onClick={handleToggleMute}
          disabled={!isActive}
        >
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>

        {/* Main button */}
        <button
          style={{
            ...styles.mainButton,
            ...(isActive ? styles.mainButtonActive : styles.mainButtonIdle),
            color: '#fff'
          }}
          onClick={isActive ? handleEndSession : handleStartSession}
        >
          {isActive ? <StopIcon /> : <MicIcon />}
        </button>

        {/* Placeholder for symmetry */}
        <div style={{ width: 48, height: 48 }} />
      </div>

      {/* Error message */}
      {error && (
        <div style={styles.errorContainer}>
          {error}
        </div>
      )}

      {/* Keyboard hints */}
      <div style={styles.keyboardHint}>
        Press <strong>Space</strong> to start • <strong>M</strong> to mute • <strong>Esc</strong> to close
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default VoiceChat;
