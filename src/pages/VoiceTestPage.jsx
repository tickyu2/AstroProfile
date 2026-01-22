/**
 * ===============================================================================
 * VOICE TEST PAGE - Simple iOS Voice Interface
 * ===============================================================================
 *
 * A minimal voice interface designed specifically for iPhone/iOS testing.
 * Focuses on basic microphone and speaker access without complex dependencies.
 *
 * Created: January 2026
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceTestPage = () => {
  const navigate = useNavigate();

  // Platform detection
  const [platform, setPlatform] = useState({
    isIOS: false,
    isSafari: false,
    isMobile: false
  });

  // Permission & audio state
  const [micPermission, setMicPermission] = useState('unknown'); // unknown, granted, denied, error
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  // Audio refs
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordedAudioRef = useRef(null);

  // Add log message
  const addLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-20), `[${timestamp}] ${message}`]);
    console.log(`[VoiceTest] ${message}`);
  }, []);

  // Detect platform on mount
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    setPlatform({ isIOS, isSafari, isMobile });
    addLog(`Platform: iOS=${isIOS}, Safari=${isSafari}, Mobile=${isMobile}`);

    // Check for required APIs
    if (!navigator.mediaDevices) {
      addLog('ERROR: mediaDevices not available');
      setError('Your browser does not support voice features');
    }
    if (!window.AudioContext && !window.webkitAudioContext) {
      addLog('ERROR: AudioContext not available');
    }
  }, [addLog]);

  /**
   * Unlock audio on iOS - MUST be called from user tap
   */
  const unlockAudio = useCallback(async () => {
    addLog('Attempting to unlock audio...');
    setError(null);

    try {
      // Create AudioContext
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Resume if suspended (iOS suspends by default)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        addLog('AudioContext resumed from suspended state');
      }

      // Create and play silent buffer to unlock audio
      const buffer = audioContextRef.current.createBuffer(1, 1, 22050);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);

      // Also play silent HTML audio element (iOS fallback)
      const audio = new Audio();
      audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYv+WXaAAAAAAAAAAAAAAAAAAAA//tQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      audio.volume = 0.01;
      await audio.play().catch(() => {});
      audio.pause();

      setAudioUnlocked(true);
      addLog('Audio unlocked successfully!');
      return true;

    } catch (err) {
      addLog(`Audio unlock failed: ${err.message}`);
      setError(`Failed to unlock audio: ${err.message}`);
      return false;
    }
  }, [addLog]);

  /**
   * Request microphone permission - MUST be called from user tap on iOS
   */
  const requestMicPermission = useCallback(async () => {
    addLog('Requesting microphone permission...');
    setError(null);

    // First unlock audio on iOS
    if (platform.isIOS && !audioUnlocked) {
      const unlocked = await unlockAudio();
      if (!unlocked) return;
    }

    try {
      // Request microphone with iOS-friendly constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      addLog('Calling getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      mediaStreamRef.current = stream;
      setMicPermission('granted');
      addLog('Microphone permission GRANTED!');

      // Get track info
      const track = stream.getAudioTracks()[0];
      if (track) {
        addLog(`Audio track: ${track.label}`);
        addLog(`Track settings: ${JSON.stringify(track.getSettings())}`);
      }

    } catch (err) {
      addLog(`Microphone error: ${err.name} - ${err.message}`);
      setMicPermission('denied');

      // Provide helpful error message
      if (err.name === 'NotAllowedError') {
        if (platform.isIOS) {
          setError('Microphone blocked. Go to Settings > Safari > Microphone and allow this site.');
        } else {
          setError('Microphone permission denied. Please allow in browser settings.');
        }
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found on this device.');
      } else {
        setError(`Microphone error: ${err.message}`);
      }
    }
  }, [platform.isIOS, audioUnlocked, unlockAudio, addLog]);

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async () => {
    if (!mediaStreamRef.current) {
      addLog('No media stream - requesting permission first');
      await requestMicPermission();
      if (!mediaStreamRef.current) return;
    }

    addLog('Starting recording...');
    audioChunksRef.current = [];

    try {
      // Use appropriate MIME type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      addLog(`Using MIME type: ${mimeType}`);

      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, {
        mimeType
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          addLog(`Recorded chunk: ${event.data.size} bytes`);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        addLog('Recording stopped');
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        recordedAudioRef.current = URL.createObjectURL(blob);
        addLog(`Total recorded: ${blob.size} bytes`);
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      addLog('Recording started!');

    } catch (err) {
      addLog(`Recording error: ${err.message}`);
      setError(`Recording failed: ${err.message}`);
    }
  }, [requestMicPermission, addLog]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      addLog('Stopped recording');
    }
  }, [isRecording, addLog]);

  /**
   * Play recorded audio
   */
  const playRecording = useCallback(async () => {
    if (!recordedAudioRef.current) {
      addLog('No recording to play');
      return;
    }

    addLog('Playing recording...');
    setIsPlaying(true);

    try {
      const audio = new Audio(recordedAudioRef.current);
      audio.onended = () => {
        setIsPlaying(false);
        addLog('Playback finished');
      };
      audio.onerror = (e) => {
        setIsPlaying(false);
        addLog(`Playback error: ${e.message || 'unknown'}`);
      };
      await audio.play();
      addLog('Playback started');
    } catch (err) {
      setIsPlaying(false);
      addLog(`Play error: ${err.message}`);
      setError(`Playback failed: ${err.message}`);
    }
  }, [addLog]);

  /**
   * Play a test tone to verify speaker works
   */
  const playTestTone = useCallback(async () => {
    addLog('Playing test tone...');

    if (!audioUnlocked) {
      await unlockAudio();
    }

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    // Resume if needed
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = 440; // A4 note
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;

      oscillator.start();
      setIsPlaying(true);
      addLog('Test tone playing (440Hz)');

      setTimeout(() => {
        oscillator.stop();
        setIsPlaying(false);
        addLog('Test tone stopped');
      }, 1000);

    } catch (err) {
      addLog(`Test tone error: ${err.message}`);
      setError(`Test tone failed: ${err.message}`);
    }
  }, [audioUnlocked, unlockAudio, addLog]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (recordedAudioRef.current) {
        URL.revokeObjectURL(recordedAudioRef.current);
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.title}>Voice Test</h1>
      </div>

      {/* Platform Info */}
      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>Platform Detected</div>
        <div style={styles.infoRow}>
          <span>{platform.isIOS ? '🍎 iOS' : '📱 Other'}</span>
          <span>{platform.isSafari ? '🧭 Safari' : '🌐 Browser'}</span>
          <span>{platform.isMobile ? '📱 Mobile' : '💻 Desktop'}</span>
        </div>
      </div>

      {/* Status */}
      <div style={styles.statusBox}>
        <div style={styles.statusRow}>
          <span>Audio Unlocked:</span>
          <span style={audioUnlocked ? styles.statusYes : styles.statusNo}>
            {audioUnlocked ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div style={styles.statusRow}>
          <span>Microphone:</span>
          <span style={micPermission === 'granted' ? styles.statusYes : styles.statusNo}>
            {micPermission === 'granted' ? '✓ Allowed' :
             micPermission === 'denied' ? '✗ Denied' : '? Unknown'}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* iOS Instructions */}
      {platform.isIOS && !audioUnlocked && (
        <div style={styles.instructionBox}>
          <div style={styles.instructionTitle}>📱 iPhone/iPad Instructions</div>
          <p style={styles.instructionText}>
            iOS requires you to tap a button to enable audio features.
            Tap "Unlock Audio" below to start.
          </p>
        </div>
      )}

      {/* Main Actions */}
      <div style={styles.buttonGroup}>
        {/* Step 1: Unlock Audio */}
        <button
          onClick={unlockAudio}
          style={{
            ...styles.button,
            ...(audioUnlocked ? styles.buttonSuccess : styles.buttonPrimary)
          }}
        >
          {audioUnlocked ? '✓ Audio Unlocked' : '🔊 Unlock Audio'}
        </button>

        {/* Step 2: Request Mic */}
        <button
          onClick={requestMicPermission}
          disabled={!audioUnlocked && platform.isIOS}
          style={{
            ...styles.button,
            ...(micPermission === 'granted' ? styles.buttonSuccess : styles.buttonPrimary),
            ...(!audioUnlocked && platform.isIOS ? styles.buttonDisabled : {})
          }}
        >
          {micPermission === 'granted' ? '✓ Mic Enabled' : '🎤 Enable Microphone'}
        </button>
      </div>

      {/* Recording Controls */}
      {micPermission === 'granted' && (
        <div style={styles.recordingSection}>
          <div style={styles.sectionTitle}>Voice Recording Test</div>

          <div style={styles.buttonRow}>
            {!isRecording ? (
              <button
                onClick={startRecording}
                style={{ ...styles.button, ...styles.buttonRecord }}
              >
                🎙️ Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                style={{ ...styles.button, ...styles.buttonStop }}
              >
                ⏹️ Stop Recording
              </button>
            )}

            <button
              onClick={playRecording}
              disabled={!recordedAudioRef.current || isPlaying}
              style={{
                ...styles.button,
                ...styles.buttonPlay,
                ...(!recordedAudioRef.current ? styles.buttonDisabled : {})
              }}
            >
              {isPlaying ? '🔊 Playing...' : '▶️ Play Recording'}
            </button>
          </div>
        </div>
      )}

      {/* Speaker Test */}
      <div style={styles.speakerSection}>
        <div style={styles.sectionTitle}>Speaker Test</div>
        <button
          onClick={playTestTone}
          disabled={isPlaying}
          style={{ ...styles.button, ...styles.buttonTone }}
        >
          {isPlaying ? '🔊 Playing...' : '🎵 Play Test Tone'}
        </button>
      </div>

      {/* Debug Log */}
      <div style={styles.logSection}>
        <div style={styles.sectionTitle}>Debug Log</div>
        <div style={styles.logBox}>
          {logs.map((log, i) => (
            <div key={i} style={styles.logLine}>{log}</div>
          ))}
          {logs.length === 0 && (
            <div style={styles.logEmpty}>No logs yet...</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  backButton: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600'
  },
  infoBox: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px'
  },
  infoTitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  infoRow: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px'
  },
  statusBox: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px'
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  statusYes: {
    color: '#4ade80',
    fontWeight: '600'
  },
  statusNo: {
    color: '#f87171',
    fontWeight: '600'
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#fca5a5'
  },
  instructionBox: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px'
  },
  instructionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  instructionText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
    lineHeight: '1.5'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  buttonRow: {
    display: 'flex',
    gap: '12px'
  },
  button: {
    flex: 1,
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    color: 'white'
  },
  buttonSuccess: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white'
  },
  buttonRecord: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white'
  },
  buttonStop: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white'
  },
  buttonPlay: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white'
  },
  buttonTone: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: 'white'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  recordingSection: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px'
  },
  speakerSection: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'rgba(255,255,255,0.8)'
  },
  logSection: {
    marginTop: '24px'
  },
  logBox: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
    padding: '12px',
    maxHeight: '200px',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '11px'
  },
  logLine: {
    padding: '4px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)'
  },
  logEmpty: {
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    padding: '20px'
  }
};

export default VoiceTestPage;
