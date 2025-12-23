/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA VOICE SERVICE - Gemini Live Audio Interface
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Real-time bidirectional voice communication with Luna using:
 * - Web Audio API for audio capture and playback
 * - MediaDevices API for microphone access
 * - WebSocket transport for low-latency streaming
 * - Gemini Live API (gemini-2.5-flash-native-audio) for native audio processing
 *
 * States: IDLE → LISTENING → THINKING → SPEAKING → IDLE
 *
 * @module voiceService
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const VOICE_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  ERROR: 'error'
};

const AUDIO_CONFIG = {
  sampleRate: 16000,        // Gemini expects 16kHz
  channelCount: 1,          // Mono audio
  bufferSize: 4096,         // Audio buffer size
  fftSize: 256,             // For visualizer frequency analysis
  smoothingTimeConstant: 0.8
};

const WEBSOCKET_CONFIG = {
  reconnectAttempts: 3,
  reconnectDelay: 1000,     // ms
  heartbeatInterval: 30000  // 30 seconds
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTION HARDENING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Activity Timeout Configuration (Vampire Prevention)
 * Prevents Luna's energy from draining when user leaves tab open with background noise
 */
const ACTIVITY_TIMEOUT_CONFIG = {
  inactivityTimeoutMs: 5 * 60 * 1000,  // 5 minutes without user activity
  warningTimeoutMs: 4 * 60 * 1000,     // Warn at 4 minutes
  sleepModeEnabled: true
};

/**
 * Audio Calibration Configuration
 * Users have different microphones - calibration helps set correct VAD threshold
 */
const CALIBRATION_CONFIG = {
  calibrationDurationMs: 5000,  // 5 second calibration
  sampleIntervalMs: 100,        // Sample audio every 100ms
  noiseFloorMultiplier: 2.0,    // VAD threshold = noise floor * this
  minThreshold: 0.05,           // Minimum VAD threshold
  maxThreshold: 0.5             // Maximum VAD threshold
};

/**
 * Filler Words for Latency Masking
 * Makes the conversation feel instantaneous (0ms perceived latency)
 */
const FILLER_CONFIG = {
  enabled: true,
  maxFillerDurationMs: 800,     // Max time to play filler
  fillerTypes: {
    thinking: ['hmm', 'let_me_see', 'well'],
    confirming: ['yes', 'i_see', 'okay'],
    transitioning: ['so', 'alright', 'now']
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// BARGE-IN ECHO CANCELLATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Acoustic Echo Cancellation (AEC) + Voice Activity Detection (VAD)
 *
 * Three-layer approach:
 * 1. Browser AEC via getUserMedia constraints (echoCancellation: true)
 * 2. Loopback Trick: Route AI audio through MediaStreamDestination for Chrome AEC
 * 3. Software Ducking: Raise VAD threshold when AI is speaking
 */
const BARGE_IN_CONFIG = {
  // Loopback AEC (fixes Web Audio API AEC bypass)
  loopbackEnabled: true,

  // Ducking Configuration (Software-side VAD sensitivity)
  ducking: {
    enabled: true,
    normalThreshold: 0.02,      // Detect whispers when AI is silent
    duckingThreshold: 0.08,     // Require louder speech when AI is speaking
    hardDuckingThreshold: 0.15, // For very loud AI playback
    rampDownTimeMs: 200,        // Time to lower threshold after AI stops
    minInterruptDurationMs: 150 // Minimum speech duration to trigger interrupt
  },

  // Interrupt Sensitivity
  interruptSensitivity: {
    low: 0.12,      // Harder to interrupt (loud speech required)
    medium: 0.08,   // Default balance
    high: 0.04      // Easy to interrupt (whisper can interrupt)
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class VoiceService {
  constructor() {
    // State
    this.state = VOICE_STATES.IDLE;
    this.isInitialized = false;
    this.isConnected = false;

    // Audio Context
    this.audioContext = null;
    this.analyserNode = null;
    this.gainNode = null;
    this.mediaStream = null;
    this.mediaStreamSource = null;
    this.scriptProcessor = null;

    // Playback
    this.audioQueue = [];
    this.isPlaying = false;

    // WebSocket
    this.websocket = null;
    this.sessionId = null;
    this.reconnectCount = 0;
    this.heartbeatTimer = null;

    // Callbacks
    this.onStateChange = null;
    this.onTranscript = null;
    this.onAudioData = null;
    this.onError = null;
    this.onVisualizerData = null;
    this.onSleepMode = null;      // Called when Luna enters sleep mode
    this.onActivityWarning = null; // Called before sleep mode

    // Profile context
    this.profileContext = null;
    this.memoryContext = null;

    // Firebase Functions
    this.functions = null;

    // PRODUCTION HARDENING: Activity Timeout (Vampire Prevention)
    this.lastUserActivityTime = Date.now();
    this.activityTimeoutTimer = null;
    this.warningTimer = null;
    this.isSleeping = false;

    // PRODUCTION HARDENING: Audio Calibration
    this.isCalibrating = false;
    this.calibratedThreshold = CALIBRATION_CONFIG.minThreshold;
    this.calibrationSamples = [];

    // PRODUCTION HARDENING: Filler Words
    this.fillerBuffers = {};
    this.isPlayingFiller = false;

    // BARGE-IN ECHO CANCELLATION
    this.loopbackDestination = null;      // MediaStreamDestination for AEC loopback
    this.loopbackAudioElement = null;     // Hidden audio element for AEC
    this.aiIsSpeaking = false;            // Track if AI is currently outputting audio
    this.currentVadThreshold = BARGE_IN_CONFIG.ducking.normalThreshold;
    this.duckingRampTimer = null;         // Timer for threshold ramp-down
    this.interruptSensitivity = 'medium'; // User preference: 'low', 'medium', 'high'
    this.consecutiveSpeechFrames = 0;     // Count frames of continuous speech
    this.onBargeIn = null;                // Callback when user interrupts AI
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initialize the voice service
   * @param {Object} options - Configuration options
   * @param {Object} options.profile - Current profile data
   * @param {Object} options.memoryContext - Memory context for Luna
   * @param {Function} options.onStateChange - State change callback
   * @param {Function} options.onTranscript - Transcript callback
   * @param {Function} options.onError - Error callback
   * @param {Function} options.onVisualizerData - Visualizer data callback
   */
  async initialize(options = {}) {
    if (this.isInitialized) {
      console.log('[VoiceService] Already initialized');
      return;
    }

    try {
      // Set callbacks
      this.onStateChange = options.onStateChange || (() => {});
      this.onTranscript = options.onTranscript || (() => {});
      this.onError = options.onError || (() => {});
      this.onVisualizerData = options.onVisualizerData || (() => {});

      // Set context
      this.profileContext = options.profile || null;
      this.memoryContext = options.memoryContext || null;

      // Initialize Firebase Functions
      this.functions = getFunctions();

      // Create Audio Context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: AUDIO_CONFIG.sampleRate
      });

      // Create analyser for visualization
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = AUDIO_CONFIG.fftSize;
      this.analyserNode.smoothingTimeConstant = AUDIO_CONFIG.smoothingTimeConstant;

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;
      this.gainNode.connect(this.audioContext.destination);

      // ═══════════════════════════════════════════════════════════════════
      // BARGE-IN: Set up Loopback AEC
      // This teaches Chrome/Edge what audio to cancel from the mic
      // ═══════════════════════════════════════════════════════════════════
      if (BARGE_IN_CONFIG.loopbackEnabled) {
        this.setupLoopbackAEC();
      }

      this.isInitialized = true;
      console.log('[VoiceService] Initialized successfully');

    } catch (error) {
      console.error('[VoiceService] Initialization failed:', error);
      this.handleError('initialization_failed', error.message);
      throw error;
    }
  }

  /**
   * Request microphone access and set up audio pipeline
   */
  async requestMicrophoneAccess() {
    try {
      // Request microphone permission
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: AUDIO_CONFIG.channelCount,
          sampleRate: AUDIO_CONFIG.sampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Create media stream source
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Connect to analyser for visualization
      this.mediaStreamSource.connect(this.analyserNode);

      // Create script processor for raw audio access
      this.scriptProcessor = this.audioContext.createScriptProcessor(
        AUDIO_CONFIG.bufferSize,
        AUDIO_CONFIG.channelCount,
        AUDIO_CONFIG.channelCount
      );

      this.mediaStreamSource.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);

      // Process audio data
      this.scriptProcessor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);

        // BARGE-IN: Check if user is speaking during AI output
        if (BARGE_IN_CONFIG.ducking.enabled) {
          const bargeInResult = this.processMicInputForBargeIn(inputData);

          if (bargeInResult.shouldInterrupt) {
            this.triggerBargeIn();
          }
        }

        // Only send audio when in listening state
        if (this.state === VOICE_STATES.LISTENING && this.isConnected) {
          this.sendAudioData(inputData);
        }

        // Send visualizer data
        this.updateVisualizerData();
      };

      console.log('[VoiceService] Microphone access granted');
      return true;

    } catch (error) {
      console.error('[VoiceService] Microphone access denied:', error);
      this.handleError('microphone_denied', 'Microphone access was denied');
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Start a voice session with Luna
   */
  async startSession() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Request microphone if not already done
    if (!this.mediaStream) {
      const hasAccess = await this.requestMicrophoneAccess();
      if (!hasAccess) return false;
    }

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      // Get WebSocket URL from Cloud Function
      const getVoiceSession = httpsCallable(this.functions, 'getVoiceSession');
      const result = await getVoiceSession({
        profileId: this.profileContext?.id,
        profileName: this.profileContext?.basicInfo?.name,
        memoryContext: this.memoryContext
      });

      const { websocketUrl, sessionId, systemInstruction } = result.data;
      this.sessionId = sessionId;

      // Connect WebSocket
      await this.connectWebSocket(websocketUrl, systemInstruction);

      this.setState(VOICE_STATES.LISTENING);
      return true;

    } catch (error) {
      console.error('[VoiceService] Failed to start session:', error);
      this.handleError('session_start_failed', error.message);
      return false;
    }
  }

  /**
   * End the current voice session
   */
  async endSession() {
    this.setState(VOICE_STATES.IDLE);

    // Close WebSocket
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // Clear heartbeat
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    // Stop media tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Disconnect audio nodes
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }

    this.isConnected = false;
    this.sessionId = null;
    this.audioQueue = [];

    console.log('[VoiceService] Session ended');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WEBSOCKET COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Connect to the voice WebSocket server
   * @param {string} url - WebSocket URL
   * @param {string} systemInstruction - Luna's system prompt
   */
  async connectWebSocket(url, systemInstruction) {
    return new Promise((resolve, reject) => {
      try {
        this.websocket = new WebSocket(url);
        this.websocket.binaryType = 'arraybuffer';

        this.websocket.onopen = () => {
          console.log('[VoiceService] WebSocket connected');
          this.isConnected = true;
          this.reconnectCount = 0;

          // Send setup message with system instruction
          this.websocket.send(JSON.stringify({
            type: 'setup',
            systemInstruction: systemInstruction,
            config: {
              responseModality: 'AUDIO',
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: 'Aoede'  // Luna's voice
                  }
                }
              }
            }
          }));

          // Start heartbeat
          this.startHeartbeat();

          resolve();
        };

        this.websocket.onmessage = (event) => {
          this.handleWebSocketMessage(event);
        };

        this.websocket.onerror = (error) => {
          console.error('[VoiceService] WebSocket error:', error);
          this.handleError('websocket_error', 'Connection error occurred');
        };

        this.websocket.onclose = (event) => {
          console.log('[VoiceService] WebSocket closed:', event.code, event.reason);
          this.isConnected = false;

          // Attempt reconnection if not intentional close
          if (event.code !== 1000 && this.state !== VOICE_STATES.IDLE) {
            this.attemptReconnection();
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle incoming WebSocket messages
   * @param {MessageEvent} event - WebSocket message event
   */
  handleWebSocketMessage(event) {
    try {
      // Handle binary audio data
      if (event.data instanceof ArrayBuffer) {
        this.handleAudioResponse(event.data);
        return;
      }

      // Handle JSON messages
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'setup_complete':
          console.log('[VoiceService] Setup complete');
          break;

        case 'transcript':
          // User's speech transcription
          if (message.isUser) {
            this.onTranscript({
              type: 'user',
              text: message.text,
              isFinal: message.isFinal
            });
          } else {
            // Luna's response transcript
            this.onTranscript({
              type: 'assistant',
              text: message.text,
              isFinal: message.isFinal
            });
          }
          break;

        case 'turn_start':
          // Luna is about to speak
          this.setState(VOICE_STATES.SPEAKING);
          break;

        case 'turn_end':
          // Luna finished speaking
          this.setState(VOICE_STATES.LISTENING);
          break;

        case 'thinking':
          // Luna is processing
          this.setState(VOICE_STATES.THINKING);
          break;

        case 'interrupted':
          // User interrupted Luna
          this.audioQueue = [];
          this.isPlaying = false;
          this.setState(VOICE_STATES.LISTENING);
          break;

        case 'error':
          this.handleError('server_error', message.message);
          break;

        case 'heartbeat':
          // Heartbeat acknowledged
          break;

        default:
          console.log('[VoiceService] Unknown message type:', message.type);
      }

    } catch (error) {
      console.error('[VoiceService] Error handling message:', error);
    }
  }

  /**
   * Handle audio response from Luna
   * @param {ArrayBuffer} audioData - Raw audio data
   */
  handleAudioResponse(audioData) {
    // Queue audio for playback
    this.audioQueue.push(audioData);

    // Start playback if not already playing
    if (!this.isPlaying) {
      this.playAudioQueue();
    }
  }

  /**
   * Play queued audio responses
   * Uses loopback routing for proper echo cancellation
   */
  async playAudioQueue() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      this.setAiSpeakingState(false);  // BARGE-IN: AI stopped speaking
      return;
    }

    this.isPlaying = true;
    this.setAiSpeakingState(true);  // BARGE-IN: AI is speaking

    while (this.audioQueue.length > 0) {
      const audioData = this.audioQueue.shift();

      try {
        // Decode audio data
        const audioBuffer = await this.audioContext.decodeAudioData(audioData.slice(0));

        // Create buffer source
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // BARGE-IN: Route through loopback for proper AEC
        this.routeAudioWithLoopback(source);

        // Play and wait for completion
        await new Promise((resolve) => {
          source.onended = resolve;
          source.start(0);
        });

      } catch (error) {
        console.error('[VoiceService] Error playing audio:', error);
      }
    }

    this.isPlaying = false;
    this.setAiSpeakingState(false);  // BARGE-IN: AI stopped speaking
  }

  /**
   * Send audio data to the server
   * @param {Float32Array} audioData - Raw audio samples
   */
  sendAudioData(audioData) {
    if (!this.isConnected || !this.websocket) return;

    // Convert Float32Array to Int16Array (PCM)
    const pcmData = this.float32ToPCM16(audioData);

    // Send as binary
    this.websocket.send(pcmData.buffer);
  }

  /**
   * Convert Float32Array audio to PCM16
   * @param {Float32Array} float32Array - Input audio samples
   * @returns {Int16Array} - PCM16 encoded audio
   */
  float32ToPCM16(float32Array) {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm16;
  }

  /**
   * Start heartbeat to keep connection alive
   */
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected && this.websocket) {
        this.websocket.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, WEBSOCKET_CONFIG.heartbeatInterval);
  }

  /**
   * Attempt to reconnect after connection loss
   */
  attemptReconnection() {
    if (this.reconnectCount >= WEBSOCKET_CONFIG.reconnectAttempts) {
      this.handleError('connection_lost', 'Unable to reconnect after multiple attempts');
      this.endSession();
      return;
    }

    this.reconnectCount++;
    console.log(`[VoiceService] Reconnection attempt ${this.reconnectCount}/${WEBSOCKET_CONFIG.reconnectAttempts}`);

    setTimeout(() => {
      this.startSession();
    }, WEBSOCKET_CONFIG.reconnectDelay * this.reconnectCount);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VISUALIZER DATA
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Update visualizer with current audio data
   */
  updateVisualizerData() {
    if (!this.analyserNode) return;

    const frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
    const timeData = new Uint8Array(this.analyserNode.frequencyBinCount);

    this.analyserNode.getByteFrequencyData(frequencyData);
    this.analyserNode.getByteTimeDomainData(timeData);

    this.onVisualizerData({
      frequencyData,
      timeData,
      state: this.state
    });
  }

  /**
   * Get current audio level (0-1)
   * @returns {number} - Audio level
   */
  getAudioLevel() {
    if (!this.analyserNode) return 0;

    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);

    // Calculate average level
    const sum = data.reduce((a, b) => a + b, 0);
    return sum / (data.length * 255);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Set the current state and notify listeners
   * @param {string} newState - New state
   */
  setState(newState) {
    if (this.state === newState) return;

    const previousState = this.state;
    this.state = newState;

    console.log(`[VoiceService] State: ${previousState} → ${newState}`);
    this.onStateChange(newState, previousState);
  }

  /**
   * Get the current state
   * @returns {string} - Current state
   */
  getState() {
    return this.state;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handle errors
   * @param {string} code - Error code
   * @param {string} message - Error message
   */
  handleError(code, message) {
    console.error(`[VoiceService] Error [${code}]:`, message);
    this.setState(VOICE_STATES.ERROR);
    this.onError({ code, message });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTEXT UPDATES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Update profile context
   * @param {Object} profile - Profile data
   */
  setProfileContext(profile) {
    this.profileContext = profile;
  }

  /**
   * Update memory context
   * @param {Object} memoryContext - Memory context
   */
  setMemoryContext(memoryContext) {
    this.memoryContext = memoryContext;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Set playback volume
   * @param {number} volume - Volume level (0-1)
   */
  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Mute/unmute the microphone
   * @param {boolean} muted - Whether to mute
   */
  setMuted(muted) {
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
  }

  /**
   * Check if voice is supported in this browser
   * @returns {boolean} - Whether voice is supported
   */
  static isSupported() {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      (window.AudioContext || window.webkitAudioContext) &&
      window.WebSocket
    );
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopActivityMonitoring();
    this.endSession();

    // BARGE-IN: Clean up loopback AEC resources
    this.cleanupLoopbackAEC();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
    console.log('[VoiceService] Destroyed');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCTION HARDENING: ACTIVITY TIMEOUT (Vampire Prevention)
  // Prevents Luna's energy from draining when user leaves tab open
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Start monitoring user activity
   * Should be called when voice session starts
   */
  startActivityMonitoring() {
    if (!ACTIVITY_TIMEOUT_CONFIG.sleepModeEnabled) return;

    this.lastUserActivityTime = Date.now();
    this.isSleeping = false;

    // Listen for user activity events
    const activityEvents = ['keydown', 'mousedown', 'touchstart', 'click'];
    this.activityHandler = () => this.recordUserActivity();

    activityEvents.forEach(event => {
      document.addEventListener(event, this.activityHandler, { passive: true });
    });

    // Start the inactivity checker
    this.activityTimeoutTimer = setInterval(() => {
      this.checkInactivity();
    }, 30000); // Check every 30 seconds

    console.log('[VoiceService] Activity monitoring started');
  }

  /**
   * Stop monitoring user activity
   */
  stopActivityMonitoring() {
    if (this.activityTimeoutTimer) {
      clearInterval(this.activityTimeoutTimer);
      this.activityTimeoutTimer = null;
    }

    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }

    // Remove event listeners
    if (this.activityHandler) {
      const activityEvents = ['keydown', 'mousedown', 'touchstart', 'click'];
      activityEvents.forEach(event => {
        document.removeEventListener(event, this.activityHandler);
      });
    }
  }

  /**
   * Record user activity (call this when user interacts)
   */
  recordUserActivity() {
    this.lastUserActivityTime = Date.now();

    // Wake Luna if sleeping
    if (this.isSleeping) {
      this.wakeFromSleep();
    }
  }

  /**
   * Check for inactivity and trigger sleep mode if needed
   */
  checkInactivity() {
    if (this.state === VOICE_STATES.IDLE || this.isSleeping) return;

    const timeSinceActivity = Date.now() - this.lastUserActivityTime;

    // Warning before sleep
    if (timeSinceActivity >= ACTIVITY_TIMEOUT_CONFIG.warningTimeoutMs &&
        timeSinceActivity < ACTIVITY_TIMEOUT_CONFIG.inactivityTimeoutMs) {

      const timeUntilSleep = ACTIVITY_TIMEOUT_CONFIG.inactivityTimeoutMs - timeSinceActivity;
      this.onActivityWarning?.({
        timeUntilSleepMs: timeUntilSleep,
        message: `Luna will sleep in ${Math.round(timeUntilSleep / 1000)} seconds due to inactivity`
      });
    }

    // Enter sleep mode
    if (timeSinceActivity >= ACTIVITY_TIMEOUT_CONFIG.inactivityTimeoutMs) {
      this.enterSleepMode();
    }
  }

  /**
   * Enter sleep mode - mute mic and stop processing
   */
  enterSleepMode() {
    if (this.isSleeping) return;

    console.log('[VoiceService] 😴 Entering sleep mode due to inactivity');

    this.isSleeping = true;

    // Mute microphone to stop VAD triggers
    this.setMuted(true);

    // Notify listeners
    this.onSleepMode?.({
      reason: 'inactivity',
      message: 'Luna fell asleep. Click or speak to wake her up.',
      sleepTime: Date.now()
    });

    // Change state to indicate sleeping
    this.setState(VOICE_STATES.IDLE);
  }

  /**
   * Wake Luna from sleep mode
   */
  wakeFromSleep() {
    if (!this.isSleeping) return;

    console.log('[VoiceService] ☀️ Waking from sleep mode');

    this.isSleeping = false;
    this.lastUserActivityTime = Date.now();

    // Unmute microphone
    this.setMuted(false);

    // Return to listening state
    if (this.isConnected) {
      this.setState(VOICE_STATES.LISTENING);
    }

    this.onSleepMode?.({
      reason: 'wake',
      message: 'Luna is awake!',
      wakeTime: Date.now()
    });
  }

  /**
   * Check if Luna is in sleep mode
   */
  isSleepMode() {
    return this.isSleeping;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCTION HARDENING: AUDIO CALIBRATION
  // Set correct VAD threshold for user's specific microphone/environment
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calibrate audio levels for the user's environment
   * Run this on first load or when user requests recalibration
   *
   * @returns {Promise<Object>} - Calibration results
   */
  async calibrateAudio() {
    if (!this.isInitialized || !this.analyserNode) {
      console.warn('[VoiceService] Cannot calibrate - not initialized');
      return { success: false, error: 'Not initialized' };
    }

    console.log('[VoiceService] 🎤 Starting audio calibration...');

    this.isCalibrating = true;
    this.calibrationSamples = [];

    return new Promise((resolve) => {
      const sampleCount = Math.floor(
        CALIBRATION_CONFIG.calibrationDurationMs / CALIBRATION_CONFIG.sampleIntervalMs
      );

      let samplesCollected = 0;

      const collectSample = () => {
        if (samplesCollected >= sampleCount) {
          // Calibration complete - calculate threshold
          const result = this.calculateCalibratedThreshold();
          this.isCalibrating = false;
          resolve(result);
          return;
        }

        // Collect current audio level
        const level = this.getAudioLevel();
        this.calibrationSamples.push(level);
        samplesCollected++;

        // Schedule next sample
        setTimeout(collectSample, CALIBRATION_CONFIG.sampleIntervalMs);
      };

      // Start collecting samples
      collectSample();
    });
  }

  /**
   * Calculate VAD threshold from calibration samples
   * @private
   */
  calculateCalibratedThreshold() {
    if (this.calibrationSamples.length === 0) {
      return { success: false, error: 'No samples collected' };
    }

    // Calculate noise floor (average of samples)
    const sum = this.calibrationSamples.reduce((a, b) => a + b, 0);
    const average = sum / this.calibrationSamples.length;

    // Calculate standard deviation for outlier detection
    const squaredDiffs = this.calibrationSamples.map(s => Math.pow(s - average, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const stdDev = Math.sqrt(avgSquaredDiff);

    // Noise floor is average + some standard deviation
    const noiseFloor = average + stdDev;

    // VAD threshold = noise floor * multiplier
    const rawThreshold = noiseFloor * CALIBRATION_CONFIG.noiseFloorMultiplier;

    // Clamp to min/max
    this.calibratedThreshold = Math.max(
      CALIBRATION_CONFIG.minThreshold,
      Math.min(CALIBRATION_CONFIG.maxThreshold, rawThreshold)
    );

    console.log('[VoiceService] 🎤 Calibration complete:', {
      noiseFloor: noiseFloor.toFixed(4),
      threshold: this.calibratedThreshold.toFixed(4),
      samples: this.calibrationSamples.length
    });

    return {
      success: true,
      noiseFloor,
      threshold: this.calibratedThreshold,
      sampleCount: this.calibrationSamples.length,
      recommendation: this.calibratedThreshold > 0.3
        ? 'Environment is noisy. Consider using headphones.'
        : 'Environment sounds good for voice chat.'
    };
  }

  /**
   * Get calibrated VAD threshold
   */
  getCalibratedThreshold() {
    return this.calibratedThreshold;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCTION HARDENING: FILLER WORDS (Latency Masking)
  // Makes conversation feel instantaneous by playing short sounds while processing
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Pre-load filler audio buffers for quick playback
   * Call this during initialization
   */
  async preloadFillerAudio() {
    if (!FILLER_CONFIG.enabled || !this.audioContext) return;

    console.log('[VoiceService] 🔊 Pre-loading filler audio...');

    // Generate simple audio buffers for fillers (synthetic)
    // In production, these could be pre-recorded audio files
    const fillers = ['hmm', 'okay', 'i_see'];

    for (const filler of fillers) {
      try {
        // Create a simple buffer (breath-like sound)
        const buffer = this.createFillerBuffer(filler);
        this.fillerBuffers[filler] = buffer;
      } catch (error) {
        console.warn(`[VoiceService] Failed to create filler '${filler}':`, error);
      }
    }

    console.log('[VoiceService] 🔊 Loaded', Object.keys(this.fillerBuffers).length, 'fillers');
  }

  /**
   * Create a simple synthetic filler sound buffer
   * @private
   */
  createFillerBuffer(type) {
    const sampleRate = this.audioContext.sampleRate;
    const duration = type === 'hmm' ? 0.5 : 0.3;
    const frameCount = sampleRate * duration;

    const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Generate a simple breath-like or hum-like sound
    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      const envelope = Math.sin(Math.PI * t / duration); // Fade in/out

      // Low frequency hum for "hmm", higher for "okay"
      const freq = type === 'hmm' ? 180 : 250;
      const tone = Math.sin(2 * Math.PI * freq * t) * 0.1;

      // Add subtle noise
      const noise = (Math.random() - 0.5) * 0.02;

      channelData[i] = (tone + noise) * envelope * 0.3;
    }

    return buffer;
  }

  /**
   * Play a filler sound while waiting for AI response
   * @param {string} type - Type of filler: 'thinking', 'confirming', 'transitioning'
   */
  playFiller(type = 'thinking') {
    if (!FILLER_CONFIG.enabled || this.isPlayingFiller) return;

    // Pick a random filler from the type
    const fillerOptions = FILLER_CONFIG.fillerTypes[type] || ['hmm'];
    const fillerName = fillerOptions[Math.floor(Math.random() * fillerOptions.length)];

    const buffer = this.fillerBuffers[fillerName];
    if (!buffer) return;

    this.isPlayingFiller = true;

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;

      // Lower volume for fillers
      const fillerGain = this.audioContext.createGain();
      fillerGain.gain.value = 0.4;
      source.connect(fillerGain);
      fillerGain.connect(this.gainNode);

      source.onended = () => {
        this.isPlayingFiller = false;
      };

      source.start(0);

      console.log('[VoiceService] 🔊 Playing filler:', fillerName);

    } catch (error) {
      this.isPlayingFiller = false;
      console.warn('[VoiceService] Failed to play filler:', error);
    }
  }

  /**
   * Stop any currently playing filler
   */
  stopFiller() {
    this.isPlayingFiller = false;
    // The filler will naturally end, or can be stopped if we keep a reference
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BARGE-IN ECHO CANCELLATION
  // Three-layer approach: Browser AEC + Loopback Trick + Software Ducking
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Set up Loopback AEC
   * Routes AI audio through a hidden audio element so Chrome can cancel it from mic
   *
   * Why this is needed:
   * - When using Web Audio API (AudioBufferSourceNode), Chrome's AEC fails
   * - Chrome's AEC needs to "see" the audio in a standard audio element
   * - This creates a loopback: AI audio → MediaStreamDestination → <audio> → AEC
   */
  setupLoopbackAEC() {
    try {
      // Create a MediaStreamDestination that converts Web Audio to MediaStream
      this.loopbackDestination = this.audioContext.createMediaStreamDestination();

      // Create hidden audio element for the loopback
      this.loopbackAudioElement = document.createElement('audio');
      this.loopbackAudioElement.id = 'luna-aec-loopback';
      this.loopbackAudioElement.srcObject = this.loopbackDestination.stream;
      this.loopbackAudioElement.volume = 0; // CRITICAL: Muted to avoid double audio
      this.loopbackAudioElement.autoplay = true;

      // Add to DOM (required for some browsers)
      this.loopbackAudioElement.style.display = 'none';
      document.body.appendChild(this.loopbackAudioElement);

      // Start playback (required for Chrome to process it)
      this.loopbackAudioElement.play().catch(err => {
        console.warn('[VoiceService] Loopback audio play failed:', err);
      });

      console.log('[VoiceService] 🔊 Loopback AEC initialized');

    } catch (error) {
      console.error('[VoiceService] Failed to set up Loopback AEC:', error);
    }
  }

  /**
   * Route audio to both speakers AND loopback (for AEC)
   * Call this instead of just connecting to gainNode
   *
   * @param {AudioBufferSourceNode} source - The audio source to route
   */
  routeAudioWithLoopback(source) {
    // Route 1: To speakers (user hears it)
    source.connect(this.gainNode);

    // Route 2: To loopback destination (Chrome processes for AEC)
    if (this.loopbackDestination && BARGE_IN_CONFIG.loopbackEnabled) {
      source.connect(this.loopbackDestination);
    }
  }

  /**
   * Set AI speaking state and adjust VAD threshold (ducking)
   * @param {boolean} isSpeaking - Whether AI is currently speaking
   */
  setAiSpeakingState(isSpeaking) {
    const wasSpeaking = this.aiIsSpeaking;
    this.aiIsSpeaking = isSpeaking;

    if (!BARGE_IN_CONFIG.ducking.enabled) return;

    if (isSpeaking && !wasSpeaking) {
      // AI started speaking - RAISE threshold (harder to detect user speech)
      this.applyDucking();
      console.log('[VoiceService] 🔇 Ducking ON - VAD threshold raised');
    } else if (!isSpeaking && wasSpeaking) {
      // AI stopped speaking - LOWER threshold (detect whispers again)
      this.releaseDucking();
      console.log('[VoiceService] 🔊 Ducking OFF - VAD threshold lowered');
    }
  }

  /**
   * Apply ducking - raise VAD threshold to ignore echo bleed
   */
  applyDucking() {
    // Clear any pending ramp-down
    if (this.duckingRampTimer) {
      clearTimeout(this.duckingRampTimer);
      this.duckingRampTimer = null;
    }

    // Get threshold based on sensitivity setting
    const sensitivity = BARGE_IN_CONFIG.interruptSensitivity[this.interruptSensitivity] ||
                        BARGE_IN_CONFIG.ducking.duckingThreshold;

    this.currentVadThreshold = sensitivity;
  }

  /**
   * Release ducking - gradually lower VAD threshold
   */
  releaseDucking() {
    // Short delay before lowering threshold (avoids echo tail)
    this.duckingRampTimer = setTimeout(() => {
      this.currentVadThreshold = BARGE_IN_CONFIG.ducking.normalThreshold;
      this.duckingRampTimer = null;
    }, BARGE_IN_CONFIG.ducking.rampDownTimeMs);
  }

  /**
   * Process microphone input with adaptive VAD threshold
   * Detects if user is speaking loud enough to trigger barge-in
   *
   * @param {Float32Array} inputData - Raw microphone audio samples
   * @returns {Object} - { isSpeaking: boolean, level: number, shouldInterrupt: boolean }
   */
  processMicInputForBargeIn(inputData) {
    // Calculate RMS (Root Mean Square) volume
    let sum = 0;
    for (let i = 0; i < inputData.length; i++) {
      sum += inputData[i] * inputData[i];
    }
    const rms = Math.sqrt(sum / inputData.length);

    const isSpeaking = rms > this.currentVadThreshold;

    if (isSpeaking) {
      this.consecutiveSpeechFrames++;
    } else {
      this.consecutiveSpeechFrames = 0;
    }

    // Require sustained speech to trigger interrupt (avoids false triggers)
    const minFramesRequired = Math.ceil(
      BARGE_IN_CONFIG.ducking.minInterruptDurationMs /
      (AUDIO_CONFIG.bufferSize / AUDIO_CONFIG.sampleRate * 1000)
    );

    const shouldInterrupt = this.aiIsSpeaking &&
                            isSpeaking &&
                            this.consecutiveSpeechFrames >= minFramesRequired;

    return {
      isSpeaking,
      level: rms,
      threshold: this.currentVadThreshold,
      shouldInterrupt,
      consecutiveFrames: this.consecutiveSpeechFrames
    };
  }

  /**
   * Trigger barge-in interrupt
   * Stops AI playback and switches to listening mode
   */
  triggerBargeIn() {
    console.log('[VoiceService] 🎤 BARGE-IN! User is interrupting');

    // Stop AI audio playback
    this.audioQueue = [];
    this.isPlaying = false;
    this.setAiSpeakingState(false);

    // Notify WebSocket to interrupt
    if (this.isConnected && this.websocket) {
      this.websocket.send(JSON.stringify({ type: 'interrupt' }));
    }

    // Switch to listening
    this.setState(VOICE_STATES.LISTENING);

    // Callback
    this.onBargeIn?.({ timestamp: Date.now() });
  }

  /**
   * Set interrupt sensitivity preference
   * @param {string} level - 'low', 'medium', or 'high'
   */
  setInterruptSensitivity(level) {
    if (['low', 'medium', 'high'].includes(level)) {
      this.interruptSensitivity = level;
      console.log('[VoiceService] Interrupt sensitivity set to:', level);
    }
  }

  /**
   * Clean up loopback AEC resources
   */
  cleanupLoopbackAEC() {
    if (this.loopbackAudioElement) {
      this.loopbackAudioElement.pause();
      this.loopbackAudioElement.srcObject = null;
      if (this.loopbackAudioElement.parentNode) {
        this.loopbackAudioElement.parentNode.removeChild(this.loopbackAudioElement);
      }
      this.loopbackAudioElement = null;
    }

    if (this.loopbackDestination) {
      this.loopbackDestination.disconnect();
      this.loopbackDestination = null;
    }

    if (this.duckingRampTimer) {
      clearTimeout(this.duckingRampTimer);
      this.duckingRampTimer = null;
    }

    console.log('[VoiceService] 🔊 Loopback AEC cleaned up');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const voiceService = new VoiceService();
export { VOICE_STATES, AUDIO_CONFIG, BARGE_IN_CONFIG };
export default voiceService;
