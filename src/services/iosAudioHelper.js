/**
 * ===============================================================================
 * iOS AUDIO HELPER SERVICE
 * ===============================================================================
 *
 * Handles iOS Safari-specific audio/microphone quirks:
 * - AudioContext suspension until user gesture
 * - getUserMedia user gesture requirement
 * - Audio playback unlock on first tap
 * - iOS permission prompt handling
 *
 * iOS Safari Requirements:
 * 1. AudioContext must be created/resumed after user tap/click
 * 2. getUserMedia must be called from user gesture handler
 * 3. Audio playback requires user gesture to "unlock"
 * 4. HTTPS required (handled by Firebase Hosting)
 *
 * Usage:
 *   import { iosAudioHelper } from './iosAudioHelper';
 *
 *   // Call on button click before starting voice
 *   await iosAudioHelper.unlockAudio();
 *
 *   // Check if iOS
 *   if (iosAudioHelper.isIOS) { ... }
 *
 * Created: January 2026
 */

class IOSAudioHelper {
  constructor() {
    this.isAudioUnlocked = false;
    this.audioContext = null;
    this.silentBuffer = null;

    // Detect iOS/Safari
    this.isIOS = this._detectIOS();
    this.isSafari = this._detectSafari();
    this.isMobile = this._detectMobile();

    console.log('[IOSAudioHelper] Initialized:', {
      isIOS: this.isIOS,
      isSafari: this.isSafari,
      isMobile: this.isMobile
    });
  }

  /**
   * Detect iOS device
   */
  _detectIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  /**
   * Detect Safari browser
   */
  _detectSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  /**
   * Detect mobile device
   */
  _detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Unlock audio on iOS
   * MUST be called from a user gesture (click/tap) handler
   *
   * This creates a silent AudioContext and plays a silent buffer
   * to unlock iOS audio playback restrictions.
   */
  async unlockAudio() {
    if (this.isAudioUnlocked) {
      console.log('[IOSAudioHelper] Audio already unlocked');
      return true;
    }

    try {
      // Create AudioContext
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass();

      // Resume if suspended (iOS Safari suspends by default)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('[IOSAudioHelper] AudioContext resumed');
      }

      // Create and play silent buffer to unlock audio
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);

      // Also try playing a silent HTML audio element (fallback)
      await this._playSilentAudio();

      this.isAudioUnlocked = true;
      console.log('[IOSAudioHelper] Audio unlocked successfully');
      return true;

    } catch (error) {
      console.error('[IOSAudioHelper] Failed to unlock audio:', error);
      return false;
    }
  }

  /**
   * Play a silent audio element (iOS fallback)
   */
  async _playSilentAudio() {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYv+WXaAAAAAAAAAAAAAAAAAAAA//tQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      audio.volume = 0.01;
      audio.play()
        .then(() => {
          audio.pause();
          audio.remove();
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  /**
   * Request microphone permission with iOS handling
   * MUST be called from a user gesture handler on iOS
   *
   * @returns {Promise<{granted: boolean, stream?: MediaStream, error?: string}>}
   */
  async requestMicrophonePermission() {
    // First unlock audio on iOS
    if (this.isIOS || this.isSafari) {
      await this.unlockAudio();
    }

    try {
      // Request microphone with iOS-optimized constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // iOS Safari specific: don't specify exact sample rate
          ...(this.isIOS ? {} : { sampleRate: 16000 })
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log('[IOSAudioHelper] Microphone permission granted');
      return {
        granted: true,
        stream
      };

    } catch (error) {
      console.error('[IOSAudioHelper] Microphone permission error:', error);

      // Provide user-friendly error message
      let errorMessage = 'Microphone access denied';

      if (error.name === 'NotAllowedError') {
        if (this.isIOS) {
          errorMessage = 'Please allow microphone access in Safari Settings > Privacy & Security > Microphone';
        } else {
          errorMessage = 'Please allow microphone access in your browser settings';
        }
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found on this device';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is in use by another app';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Voice features require HTTPS connection';
      }

      return {
        granted: false,
        error: errorMessage
      };
    }
  }

  /**
   * Check if device supports voice features
   */
  checkVoiceSupport() {
    const hasMediaDevices = !!navigator.mediaDevices;
    const hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia);
    const hasAudioContext = !!(window.AudioContext || window.webkitAudioContext);
    const hasWebSocket = !!window.WebSocket;

    const isSupported = hasMediaDevices && hasGetUserMedia && hasAudioContext && hasWebSocket;

    return {
      isSupported,
      hasMediaDevices,
      hasGetUserMedia,
      hasAudioContext,
      hasWebSocket,
      platform: {
        isIOS: this.isIOS,
        isSafari: this.isSafari,
        isMobile: this.isMobile
      }
    };
  }

  /**
   * Get iOS-specific instructions for enabling microphone
   */
  getIOSInstructions() {
    if (!this.isIOS) return null;

    return {
      title: 'Enable Microphone Access',
      steps: [
        'Tap the "AA" icon in Safari\'s address bar',
        'Select "Website Settings"',
        'Set Microphone to "Allow"',
        'Tap "Done" and try again'
      ],
      alternateSteps: [
        'Open iPhone Settings',
        'Scroll to Safari',
        'Tap "Microphone"',
        'Enable microphone for this website'
      ],
      tips: [
        'Make sure you\'re using Safari (other browsers may have limited mic access on iOS)',
        'iOS requires you to tap a button to start voice - it cannot start automatically',
        'If prompted, tap "Allow" when Safari asks for microphone permission'
      ]
    };
  }

  /**
   * Create an AudioContext with iOS handling
   * Should be called from user gesture
   */
  async createAudioContext(options = {}) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass(options);

    // iOS requires explicit resume from user gesture
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    return audioContext;
  }

  /**
   * Resume an existing AudioContext (call from user gesture on iOS)
   */
  async resumeAudioContext(audioContext) {
    if (!audioContext) return false;

    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
        console.log('[IOSAudioHelper] AudioContext resumed');
        return true;
      } catch (error) {
        console.error('[IOSAudioHelper] Failed to resume AudioContext:', error);
        return false;
      }
    }
    return true;
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isAudioUnlocked = false;
  }
}

// Singleton export
export const iosAudioHelper = new IOSAudioHelper();
export default iosAudioHelper;
