/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TALK PANEL - Natural Conversation Interface
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Full-screen voice conversation panel with:
 * - Turn-taking state machine
 * - SoulVisualizer audio-reactive orb
 * - Active listening cues
 * - Real-time VAD (Voice Activity Detection) via @ricky0123/vad-react
 * - Production-quality speech detection
 *
 * Created: December 21, 2025
 */

import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useMicVAD } from '@ricky0123/vad-react';
import { useTurnTaking } from '../../hooks/useTurnTaking';
import { useEmotion } from '../../hooks/useEmotion';
import { useVoiceLoop } from '../../hooks/useVoiceLoop';
import { cueEngine } from '../../services/cueEngine';
import { createBehaviorSignalHandler, BEHAVIOR_SIGNALS } from '../../services/behaviorSignals';
import { iosAudioHelper } from '../../services/iosAudioHelper';
import SoulVisualizer from './SoulVisualizer';
import Waveform from './Waveform';
import { BehaviorDebugOverlay } from './BehaviorDebugOverlay';
import { LunaLabPanel } from './LunaLabPanel';
import { STATES, STATE_DESCRIPTIONS } from './talkStates';
import './TalkPanel.css';

/**
 * TalkPanel Component
 *
 * @param {Object} props
 * @param {string} props.constitution - User's elemental constitution
 * @param {Function} props.onAIResponse - Called when AI should respond
 * @param {Function} props.onClose - Called to close the panel
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {string} props.profileName - Name for display
 */
const TalkPanel = ({
  constitution = 'Water',
  onAIResponse,
  onClose,
  isOpen = false,
  profileName = 'Unknown'
}) => {
  const [debugLog, setDebugLog] = useState([]);
  const [vadReady, setVadReady] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const lastSpeakingRef = useRef(false);

  // iOS permission state
  const [iosPermissionGranted, setIosPermissionGranted] = useState(!iosAudioHelper.isIOS);
  const [iosPermissionLoading, setIosPermissionLoading] = useState(false);
  const [iosPermissionError, setIosPermissionError] = useState(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  // Behavior tracking state
  const [behavior, setBehavior] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [showBehaviorDebug, setShowBehaviorDebug] = useState(true);
  const [labMode, setLabMode] = useState(false);
  const lastBackchannelTimeRef = useRef(null);
  const silenceStartRef = useRef(null);
  const wsRef = useRef(null);

  /**
   * Add to debug log
   */
  const addLog = useCallback((text) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev.slice(-30), `[${timestamp}] ${text}`]);
  }, []);

  /**
   * iOS Permission Request Handler
   * Must be triggered by user tap (iOS Safari requirement)
   */
  const handleIOSPermissionRequest = useCallback(async () => {
    setIosPermissionLoading(true);
    setIosPermissionError(null);
    addLog('iOS: Requesting microphone permission...');

    try {
      // First unlock audio (required on iOS)
      await iosAudioHelper.unlockAudio();
      addLog('iOS: Audio unlocked');

      // Request microphone permission
      const result = await iosAudioHelper.requestMicrophonePermission();

      if (result.granted) {
        addLog('iOS: Microphone permission granted');
        setIosPermissionGranted(true);

        // Stop the stream for now - VAD will request it again
        if (result.stream) {
          result.stream.getTracks().forEach(track => track.stop());
        }
      } else {
        addLog(`iOS: Permission denied - ${result.error}`);
        setIosPermissionError(result.error);
        setShowIosInstructions(true);
      }
    } catch (error) {
      addLog(`iOS: Error - ${error.message}`);
      setIosPermissionError(error.message);
      setShowIosInstructions(true);
    } finally {
      setIosPermissionLoading(false);
    }
  }, [addLog]);

  /**
   * Real VAD using @ricky0123/vad-react
   * This provides ML-based voice activity detection
   */
  const vad = useMicVAD({
    startOnLoad: isOpen,
    onSpeechStart: () => {
      addLog('🎤 Speech started');
    },
    onSpeechEnd: (audio) => {
      addLog('🔇 Speech ended');
      // audio is the Float32Array of the speech audio if needed
    },
    onVADMisfire: () => {
      addLog('⚡ VAD misfire (noise detected)');
    }
  });

  // Track VAD ready state
  useEffect(() => {
    if (!vad.loading && !vad.errored) {
      setVadReady(true);
      addLog('✅ VAD ready');
    }
  }, [vad.loading, vad.errored, addLog]);

  // Turn-taking state machine
  const {
    currentState,
    isUserSpeaking,
    isAISpeaking,
    lastCue,
    updateUserSpeaking,
    markAIDone,
    STATES: States
  } = useTurnTaking({
    enabled: isOpen && vadReady && !vad.loading,
    onStateChange: (newState, oldState) => {
      addLog(`State: ${oldState} → ${newState}`);
    },
    onCue: (type, cue) => {
      cueEngine.playCue(type, cue);
      addLog(`Cue: ${type} - "${cue?.text || 'sound'}"`);
      // Track backchannel time for spoke-over detection
      lastBackchannelTimeRef.current = performance.now();
    },
    onAIResponse: () => {
      addLog('🤖 AI: Starting response...');
      onAIResponse?.();
    },
    onInterrupt: () => {
      addLog('✋ User: Interrupted AI');
    }
  });

  /**
   * Feed VAD state to turn-taking hook
   */
  useEffect(() => {
    if (!vadReady || vad.loading) return;

    const speaking = vad.userSpeaking;

    // Only log changes
    if (speaking !== lastSpeakingRef.current) {
      lastSpeakingRef.current = speaking;
      addLog(`Speaking: ${speaking ? 'YES' : 'NO'}`);
    }

    updateUserSpeaking(speaking);
  }, [vad.userSpeaking, vad.loading, vadReady, updateUserSpeaking, addLog]);

  /**
   * Capture microphone stream for waveform visualization
   */
  useEffect(() => {
    if (!isOpen) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setAudioStream(stream);
        addLog('Waveform: Stream captured');
      })
      .catch(err => {
        console.error('[TalkPanel] Microphone access error:', err);
        addLog(`Waveform: Error - ${err.message}`);
      });

    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
    };
  }, [isOpen]);

  /**
   * Emotion detection using the EmotionEngine
   */
  const {
    emotion,
    primary: emotionPrimary,
    secondary: emotionSecondary,
    confidence: emotionConfidence,
    trend: emotionTrend,
    isAnalyzing: isAnalyzingEmotion,
    behavior: emotionBehavior,
    getEmotionEncourager,
    getLLMModifier
  } = useEmotion({
    audioStream,
    isUserSpeaking: vad.userSpeaking,
    enabled: isOpen && vadReady && audioStream !== null
  });

  /**
   * Update cue engine with current emotion
   */
  useEffect(() => {
    if (emotionPrimary) {
      cueEngine.setEmotion(emotionPrimary);
    }
  }, [emotionPrimary]);

  /**
   * Log emotion changes
   */
  useEffect(() => {
    if (isAnalyzingEmotion && emotionConfidence > 0.3) {
      addLog(`Emotion: ${emotionPrimary} (${emotionSecondary}) - ${Math.round(emotionConfidence * 100)}%`);
    }
  }, [emotionPrimary, emotionSecondary, emotionConfidence, isAnalyzingEmotion, addLog]);

  /**
   * Voice Loop - Connects to local backend for STT + LLM + TTS
   * Backend handles: SER → STT → LLM → TTS → Audio playback
   */
  const {
    state: voiceLoopState,
    isConnected: isBackendConnected,
    isRecording,
    isPlayingAudio,
    processingStatus,
    lastTranscript,
    lastReply,
    lastEmotion,
    lastBehavior,
    sessionStats: backendSessionStats,
    userPrefs: backendUserPrefs,
    wsRef: voiceWsRef,
    startRecording,
    stopRecording,
    stopAudio,
    markSpeakingDone
  } = useVoiceLoop({
    enabled: isOpen && vadReady,
    audioStream,
    onTranscript: (transcript) => {
      addLog(`STT: "${transcript}"`);
    },
    onReply: (reply) => {
      addLog(`LLM: "${reply.substring(0, 50)}..."`);
      // TTS audio comes from backend as binary WebSocket message
      // useVoiceLoop handles playback automatically
    },
    onSpeakStart: () => {
      addLog('TTS: Luna speaking...');
    },
    onSpeakEnd: () => {
      addLog('TTS: Complete');
      markAIDone();
    },
    onBehaviorUpdate: ({ behavior: beh, sessionStats: stats, userPrefs: prefs }) => {
      if (beh) {
        setBehavior(beh);
        addLog(`Behavior: ${beh.style} (BC: ${beh.backchannelFrequency?.toFixed(2)})`);
      }
      if (stats) setSessionStats(stats);
      if (prefs) setUserPrefs(prefs);
    },
    onError: (error) => {
      addLog(`Voice Loop Error: ${error}`);
    }
  });

  // Store wsRef for behavior signals
  useEffect(() => {
    wsRef.current = voiceWsRef?.current;
  }, [voiceWsRef]);

  /**
   * Behavior signal handler - detects user behaviors and sends to backend
   */
  const behaviorSignals = useMemo(() => {
    return createBehaviorSignalHandler({
      wsRef: voiceWsRef,
      onBehaviorUpdate: ({ behavior: beh }) => {
        if (beh) setBehavior(beh);
      }
    });
  }, [voiceWsRef]);

  /**
   * Detect user interrupting Luna (speaking while TTS is playing)
   */
  useEffect(() => {
    if (isPlayingAudio && vad.userSpeaking) {
      addLog('⚡ User interrupted Luna');
      behaviorSignals.onUserInterrupt();
      // Optionally stop audio when interrupted
      stopAudio();
    }
  }, [isPlayingAudio, vad.userSpeaking, behaviorSignals, stopAudio, addLog]);

  /**
   * Detect user speaking over backchannel / comfortable with silence
   */
  useEffect(() => {
    if (vad.userSpeaking) {
      // Check if spoke right after backchannel
      behaviorSignals.onUserStartedSpeaking();
      behaviorSignals.resetSilenceTracking();
      silenceStartRef.current = null;
    } else {
      // Track silence start
      if (!silenceStartRef.current) {
        silenceStartRef.current = performance.now();
      }
    }
  }, [vad.userSpeaking, behaviorSignals]);

  /**
   * Check for comfortable silence during pauses
   */
  useEffect(() => {
    if (currentState === States.THINKING_PAUSE || currentState === States.SHORT_PAUSE) {
      if (silenceStartRef.current) {
        const silenceMs = performance.now() - silenceStartRef.current;
        behaviorSignals.onSilence(silenceMs, emotionPrimary);
      }
    }
  }, [currentState, States, emotionPrimary, behaviorSignals]);

  /**
   * Send backchannel_played when a cue is played
   */
  useEffect(() => {
    if (lastCue && voiceWsRef?.current?.readyState === WebSocket.OPEN) {
      behaviorSignals.onBackchannelPlayed();
    }
  }, [lastCue, voiceWsRef, behaviorSignals]);

  /**
   * Wire turn-taking to voice loop:
   * - Start recording when user speaks
   * - Stop recording + trigger STT when COMPLETION_PAUSE
   */
  useEffect(() => {
    // Start recording when user starts speaking
    if (currentState === States.USER_SPEAKING && !isRecording && isBackendConnected) {
      startRecording();
    }

    // Stop recording and send to backend when completion pause
    if (currentState === States.COMPLETION_PAUSE && isRecording) {
      stopRecording({
        primary: emotionPrimary,
        secondary: emotionSecondary,
        confidence: emotionConfidence
      });
    }
  }, [currentState, States, isRecording, isBackendConnected, startRecording, stopRecording, emotionPrimary, emotionSecondary, emotionConfidence]);

  /**
   * Derive AI status from turn-taking state and playback
   */
  const aiStatus = useMemo(() => {
    // Check if audio is playing (TTS from backend)
    if (isPlayingAudio) return 'speaking';

    switch (currentState) {
      case States.USER_SPEAKING:
      case States.MICRO_PAUSE:
      case States.SHORT_PAUSE:
      case States.THINKING_PAUSE:
        return 'listening';
      case States.COMPLETION_PAUSE:
        return 'thinking';
      case States.AI_SPEAKING:
        return 'speaking';
      default:
        return 'idle';
    }
  }, [currentState, States, isPlayingAudio]);

  /**
   * Handle close
   */
  const handleClose = useCallback(() => {
    if (vad.pause) vad.pause();
    onClose?.();
  }, [vad, onClose]);

  /**
   * Toggle microphone
   */
  const toggleMic = useCallback(() => {
    if (vad.listening) {
      vad.pause();
      addLog('🔇 Mic paused');
    } else {
      vad.start();
      addLog('🎤 Mic started');
    }
  }, [vad, addLog]);

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (!vad.listening) vad.start();
      }
      if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMic();
      }
      if (e.code === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, vad, toggleMic, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="talk-panel">
      {/* Header */}
      <div className="talk-panel-header">
        <div className="talk-panel-title">
          <span className="talk-panel-status">
            {vad.loading ? 'Loading...' :
             vad.errored ? 'Error' :
             currentState === States.AI_SPEAKING ? 'Speaking' :
             vad.userSpeaking ? 'Listening' :
             'Ready'}
          </span>
          <span className="talk-panel-subtitle">
            Speaking about {profileName}
          </span>
        </div>
        <button className="talk-panel-close" onClick={handleClose}>
          ✕
        </button>
      </div>

      {/* VAD Status */}
      {vad.loading && (
        <div className="talk-panel-loading">
          <span className="loading-spinner">🌀</span>
          Loading voice detection model...
        </div>
      )}

      {vad.errored && (
        <div className="talk-panel-error">
          ⚠️ Microphone error. Please check permissions.
        </div>
      )}

      {/* iOS Permission Prompt - shown on iOS devices before voice starts */}
      {!iosPermissionGranted && iosAudioHelper.isIOS && (
        <div className="ios-permission-overlay">
          <div className="ios-badge">
            <span className="ios-badge-icon"></span>
            iPhone/iPad detected
          </div>

          <div className="ios-permission-icon">🎤</div>
          <div className="ios-permission-title">Enable Voice for Luna</div>
          <div className="ios-permission-subtitle">
            Tap the button below to allow microphone and speaker access so Luna can hear and speak with you.
          </div>

          <button
            className={`ios-permission-btn ${iosPermissionLoading ? 'loading' : ''}`}
            onClick={handleIOSPermissionRequest}
            disabled={iosPermissionLoading}
          >
            <span className="ios-permission-btn-icon">
              {iosPermissionLoading ? '⏳' : '🎙️'}
            </span>
            {iosPermissionLoading ? 'Requesting...' : 'Enable Microphone'}
          </button>

          {iosPermissionError && (
            <div className="ios-permission-error">
              {iosPermissionError}
            </div>
          )}

          {showIosInstructions && (
            <div className="ios-permission-instructions">
              <div className="ios-permission-instructions-title">
                How to enable microphone on Safari:
              </div>
              <ol>
                <li>Tap the "AA" icon in Safari's address bar</li>
                <li>Select "Website Settings"</li>
                <li>Set Microphone to "Allow"</li>
                <li>Tap "Done" and try again</li>
              </ol>
              <div className="ios-permission-tip">
                💡 iOS requires you to tap a button to start voice - it cannot start automatically.
              </div>
            </div>
          )}

          <button
            className="ios-permission-skip"
            onClick={onClose}
          >
            Skip for now
          </button>
        </div>
      )}

      {/* Backend Connection Status */}
      {isOpen && !isBackendConnected && (
        <div className="talk-panel-status backend-disconnected">
          <span>⚡ Voice backend: Connecting...</span>
          <span className="status-hint">Run: cd backend && npm start</span>
        </div>
      )}

      {/* Processing Status */}
      {processingStatus && (
        <div className="talk-panel-status processing">
          <span className="loading-spinner">🌀</span>
          <span>{processingStatus}</span>
        </div>
      )}

      {/* Last Transcript Display */}
      {lastTranscript && (
        <div className="talk-panel-transcript">
          <span className="transcript-label">You said:</span>
          <span className="transcript-text">"{lastTranscript}"</span>
        </div>
      )}

      {/* Main content */}
      <div className="talk-panel-content">
        {/* AI Status Indicator */}
        <div className={`ai-status-indicator ai-status-${aiStatus}`}>
          {aiStatus === 'listening' && (
            <>
              <div className="listening-bars">
                <div></div><div></div><div></div><div></div><div></div>
              </div>
              <span>Luna is listening</span>
            </>
          )}
          {aiStatus === 'thinking' && (
            <>
              <div className="thinking-dots">
                <div></div><div></div><div></div>
              </div>
              <span>Luna is thinking</span>
            </>
          )}
          {aiStatus === 'speaking' && (
            <>
              <div className="speaking-wave">
                <div></div><div></div><div></div><div></div><div></div>
              </div>
              <span>Luna is speaking</span>
            </>
          )}
          {aiStatus === 'idle' && <span>Ready to talk</span>}
        </div>

        {/* Emotion Indicator - Frontend heuristic */}
        {isAnalyzingEmotion && emotionConfidence > 0.3 && (
          <div className={`emotion-indicator emotion-${emotionPrimary}`}>
            <span className="emotion-emoji">
              {emotionPrimary === 'happy' && '😊'}
              {emotionPrimary === 'sad' && '😢'}
              {emotionPrimary === 'angry' && '😤'}
              {emotionPrimary === 'anxious' && '😰'}
              {emotionPrimary === 'surprised' && '😮'}
              {emotionPrimary === 'disgusted' && '😒'}
              {emotionPrimary === 'neutral' && '😌'}
            </span>
            <span className="emotion-label">{emotionSecondary}</span>
            <span className="emotion-confidence">
              {Math.round(emotionConfidence * 100)}%
            </span>
            {emotionTrend === 'escalating' && <span className="emotion-trend">↑</span>}
            {emotionTrend === 'de-escalating' && <span className="emotion-trend">↓</span>}
          </div>
        )}

        {/* Backend SER Emotion - ML-based detection */}
        {lastEmotion && lastEmotion.primary && (
          <div className={`emotion-indicator backend-emotion emotion-${lastEmotion.primary}`}>
            <span className="emotion-source">🧠 SER</span>
            <span className="emotion-emoji">
              {lastEmotion.primary === 'happy' && '😊'}
              {lastEmotion.primary === 'sad' && '😢'}
              {lastEmotion.primary === 'angry' && '😤'}
              {lastEmotion.primary === 'anxious' && '😰'}
              {lastEmotion.primary === 'surprised' && '😮'}
              {lastEmotion.primary === 'disgusted' && '😒'}
              {lastEmotion.primary === 'neutral' && '😌'}
            </span>
            <span className="emotion-label">{lastEmotion.primary}</span>
            {lastEmotion.confidence && (
              <span className="emotion-confidence">
                {Math.round(lastEmotion.confidence * 100)}%
              </span>
            )}
          </div>
        )}

        {/* Soul Visualizer - Large central orb */}
        <div className="talk-panel-visualizer">
          <SoulVisualizer
            isSpeaking={isAISpeaking || vad.userSpeaking}
            constitution={constitution}
            size="large"
            showLabel={true}
            currentTone={isAISpeaking ? 'warm' : vad.userSpeaking ? 'curious' : 'neutral'}
          />
          <div className="talk-panel-state">
            {vad.loading ? 'Initializing...' : STATE_DESCRIPTIONS[currentState]}
          </div>
        </div>

        {/* Waveform Visualization */}
        {audioStream && (
          <div className="talk-panel-waveform">
            <Waveform
              audioStream={audioStream}
              constitution={constitution}
              height={80}
            />
          </div>
        )}

        {/* Last cue indicator */}
        {lastCue && (
          <div className="talk-panel-last-cue">
            <span className="cue-type">{lastCue.type}</span>
            <span className="cue-text">"{lastCue.text}"</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="talk-panel-controls">
        {/* Mute button */}
        <button
          className={`talk-control-btn ${vad.listening ? '' : 'muted'}`}
          onClick={toggleMic}
          disabled={vad.loading}
          title={vad.listening ? 'Mute' : 'Unmute'}
        >
          {vad.listening ? '🎙️' : '🔇'}
        </button>

        {/* Main talk button / Stop button */}
        {isPlayingAudio ? (
          <button
            className="talk-main-btn stop-btn"
            onClick={stopAudio}
            title="Stop Luna"
          >
            ⏹️
          </button>
        ) : (
          <button
            className={`talk-main-btn ${vad.listening ? 'active' : ''} ${vad.userSpeaking ? 'speaking' : ''}`}
            onClick={() => !vad.listening && vad.start()}
            disabled={vad.loading}
          >
            {vad.userSpeaking ? '🗣️' : '🎤'}
          </button>
        )}

        {/* Settings button */}
        <button
          className="talk-control-btn"
          title="Settings"
        >
          ⚙️
        </button>

        {/* Lab Mode toggle */}
        <button
          className={`talk-control-btn ${labMode ? 'active' : ''}`}
          onClick={() => setLabMode(prev => !prev)}
          title={labMode ? 'Close Lab Mode' : 'Open Lab Mode'}
          style={labMode ? { background: 'rgba(74, 222, 128, 0.3)', borderColor: '#4ade80' } : {}}
        >
          🧪
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="talk-panel-hint">
        Press <kbd>Space</kbd> to start • <kbd>M</kbd> to mute • <kbd>Esc</kbd> to close
      </div>

      {/* Debug log (collapsible) */}
      <details className="talk-panel-debug">
        <summary>Debug Log ({debugLog.length})</summary>
        <div className="debug-log">
          {debugLog.map((line, i) => (
            <div key={i} className="debug-line">{line}</div>
          ))}
        </div>
      </details>

      {/* Behavior Debug Overlay */}
      <BehaviorDebugOverlay
        emotion={lastEmotion || { primary: emotionPrimary, secondary: emotionSecondary, confidence: emotionConfidence }}
        behavior={behavior || lastBehavior}
        sessionStats={sessionStats || backendSessionStats}
        userPrefs={userPrefs || backendUserPrefs}
        isVisible={showBehaviorDebug}
        onToggle={() => setShowBehaviorDebug(prev => !prev)}
      />

      {/* Luna Lab Mode Panel */}
      {labMode && (
        <LunaLabPanel
          userId="anonymous"
          behavior={behavior || lastBehavior}
          onClose={() => setLabMode(false)}
        />
      )}
    </div>
  );
};

export default TalkPanel;
