/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOICE PREFERENCES SERVICE - Frontend Voice Customization
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages Luna's voice preferences and ElevenLabs TTS integration:
 * - Voice selection (5 Luna personalities)
 * - Constitutional calibration toggle
 * - Custom voice settings (stability, style, speed)
 * - Audio playback management
 *
 * Created: December 21, 2025
 * Mission: "One Luna voice for each soul"
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Luna voice profiles with descriptions
 * Maps to the 5 voices from Love Intelligence
 */
export const LUNA_VOICES = {
  affirmer: {
    id: 'affirmer',
    name: 'The Affirmer',
    emoji: '✨',
    description: 'Enthusiastic and validating - celebrates your uniqueness',
    loveLanguage: 'Words of Affirmation',
    constitutions: ['Fire', 'Metal'],
    color: '#FF6B6B',
    traits: ['Enthusiastic', 'Validating', 'Energetic', 'Celebratory']
  },
  present: {
    id: 'present',
    name: 'The Present One',
    emoji: '🕯️',
    description: 'Calm and attentive - fully here with you',
    loveLanguage: 'Quality Time',
    constitutions: ['Water', 'Wood'],
    color: '#4ECDC4',
    traits: ['Calm', 'Attentive', 'Patient', 'Present']
  },
  embrace: {
    id: 'embrace',
    name: 'The Warm Embrace',
    emoji: '🫂',
    description: 'Soft and nurturing - wraps you in understanding',
    loveLanguage: 'Physical Touch',
    constitutions: ['Water', 'Earth'],
    color: '#F7DC6F',
    traits: ['Soft', 'Nurturing', 'Comforting', 'Safe']
  },
  guardian: {
    id: 'guardian',
    name: 'The Reliable Guardian',
    emoji: '🛡️',
    description: 'Clear and supportive - always has your back',
    loveLanguage: 'Acts of Service',
    constitutions: ['Wood', 'Earth'],
    color: '#45B7D1',
    traits: ['Clear', 'Practical', 'Supportive', 'Reliable']
  },
  delight: {
    id: 'delight',
    name: 'The Delightful Surprise',
    emoji: '🎁',
    description: 'Expressive and playful - creates moments of joy',
    loveLanguage: 'Receiving Gifts',
    constitutions: ['Fire', 'Metal'],
    color: '#FF9FF3',
    traits: ['Expressive', 'Playful', 'Surprising', 'Joyful']
  }
};

/**
 * Voice quality models
 */
export const VOICE_MODELS = {
  turbo: {
    id: 'turbo',
    name: 'Turbo',
    description: 'Fastest response time',
    icon: '⚡'
  },
  multilingual: {
    id: 'multilingual',
    name: 'Multilingual',
    description: 'Best for multiple languages',
    icon: '🌍'
  },
  flash: {
    id: 'flash',
    name: 'Flash',
    description: 'Optimized for real-time',
    icon: '💨'
  }
};

/**
 * Default voice settings
 */
export const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,      // 0-1: How consistent the voice is
  style: 0.5,          // 0-1: How expressive/varied the voice is
  speed: 1.0           // 0.5-2.0: Playback speed
};

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class VoicePreferencesService {
  constructor() {
    this.functions = null;
    this.audioContext = null;
    this.currentAudio = null;
    this.isPlaying = false;

    // Cached preferences
    this.cachedPreferences = null;
    this.cachedProfileId = null;

    // Callbacks
    this.onPlaybackStateChange = null;
  }

  /**
   * Initialize the service
   */
  initialize() {
    if (!this.functions) {
      this.functions = getFunctions();
    }

    // Create audio context for playback
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PREFERENCES MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get available voices with recommendations
   * @param {string} profileId - Profile ID for personalized recommendations
   * @returns {Promise<Object>} - Available voices and recommendations
   */
  async getAvailableVoices(profileId = null) {
    this.initialize();

    try {
      const getVoices = httpsCallable(this.functions, 'getAvailableVoices');
      const result = await getVoices({ profileId });

      return {
        voices: result.data.voices.map(v => ({
          ...v,
          ...LUNA_VOICES[v.id] // Merge with local voice data
        })),
        recommendedVoice: result.data.recommendedVoice,
        currentPreferences: result.data.currentPreferences,
        models: result.data.models
      };

    } catch (error) {
      console.error('[VoicePreferences] getAvailableVoices error:', error);

      // Return local voice data as fallback
      return {
        voices: Object.values(LUNA_VOICES),
        recommendedVoice: null,
        currentPreferences: null,
        models: Object.values(VOICE_MODELS)
      };
    }
  }

  /**
   * Get current voice preferences for a profile
   * @param {string} profileId - Profile ID
   * @returns {Promise<Object>} - Current preferences
   */
  async getPreferences(profileId) {
    // Return cached if same profile
    if (this.cachedProfileId === profileId && this.cachedPreferences) {
      return this.cachedPreferences;
    }

    try {
      const voicesData = await this.getAvailableVoices(profileId);

      const preferences = voicesData.currentPreferences || {
        selectedVoice: voicesData.recommendedVoice?.id || 'present',
        customSettings: { ...DEFAULT_VOICE_SETTINGS },
        useConstitutionalCalibration: true,
        preferredModel: 'turbo'
      };

      // Cache preferences
      this.cachedPreferences = preferences;
      this.cachedProfileId = profileId;

      return preferences;

    } catch (error) {
      console.error('[VoicePreferences] getPreferences error:', error);
      return {
        selectedVoice: 'present',
        customSettings: { ...DEFAULT_VOICE_SETTINGS },
        useConstitutionalCalibration: true,
        preferredModel: 'turbo'
      };
    }
  }

  /**
   * Save voice preferences
   * @param {string} profileId - Profile ID
   * @param {Object} preferences - Preferences to save
   * @returns {Promise<Object>} - Saved preferences
   */
  async savePreferences(profileId, preferences) {
    this.initialize();

    try {
      const savePrefs = httpsCallable(this.functions, 'saveVoicePreferences');
      const result = await savePrefs({
        profileId,
        selectedVoice: preferences.selectedVoice,
        customSettings: preferences.customSettings,
        useConstitutionalCalibration: preferences.useConstitutionalCalibration,
        preferredModel: preferences.preferredModel
      });

      // Update cache
      this.cachedPreferences = result.data.preferences;
      this.cachedProfileId = profileId;

      console.log('[VoicePreferences] Saved preferences:', preferences.selectedVoice);

      return result.data.preferences;

    } catch (error) {
      console.error('[VoicePreferences] savePreferences error:', error);
      throw error;
    }
  }

  /**
   * Select a voice
   * @param {string} profileId - Profile ID
   * @param {string} voiceId - Voice ID to select
   * @returns {Promise<Object>} - Updated preferences
   */
  async selectVoice(profileId, voiceId) {
    const currentPrefs = await this.getPreferences(profileId);

    return this.savePreferences(profileId, {
      ...currentPrefs,
      selectedVoice: voiceId
    });
  }

  /**
   * Update custom voice settings
   * @param {string} profileId - Profile ID
   * @param {Object} settings - Custom settings to update
   * @returns {Promise<Object>} - Updated preferences
   */
  async updateCustomSettings(profileId, settings) {
    const currentPrefs = await this.getPreferences(profileId);

    return this.savePreferences(profileId, {
      ...currentPrefs,
      customSettings: {
        ...currentPrefs.customSettings,
        ...settings
      }
    });
  }

  /**
   * Toggle constitutional calibration
   * @param {string} profileId - Profile ID
   * @param {boolean} enabled - Whether to enable constitutional calibration
   * @returns {Promise<Object>} - Updated preferences
   */
  async toggleConstitutionalCalibration(profileId, enabled) {
    const currentPrefs = await this.getPreferences(profileId);

    return this.savePreferences(profileId, {
      ...currentPrefs,
      useConstitutionalCalibration: enabled
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEXT-TO-SPEECH
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Generate speech from text
   * @param {string} text - Text to convert to speech
   * @param {string} profileId - Profile ID for voice preferences
   * @param {Object} options - Optional overrides
   * @returns {Promise<Object>} - Audio data
   */
  async generateSpeech(text, profileId, options = {}) {
    this.initialize();

    try {
      const generateSpeech = httpsCallable(this.functions, 'generateSpeechElevenLabs');
      const result = await generateSpeech({
        text,
        profileId,
        voiceOverride: options.voiceOverride,
        settingsOverride: options.settingsOverride,
        modelOverride: options.modelOverride
      });

      return {
        audio: result.data.audio,
        contentType: result.data.contentType,
        voiceUsed: result.data.voiceUsed,
        constitution: result.data.constitution
      };

    } catch (error) {
      console.error('[VoicePreferences] generateSpeech error:', error);
      throw error;
    }
  }

  /**
   * Play text as speech
   * @param {string} text - Text to speak
   * @param {string} profileId - Profile ID
   * @param {Object} options - Optional overrides
   * @returns {Promise<void>}
   */
  async speak(text, profileId, options = {}) {
    // Stop any current playback
    this.stopSpeaking();

    try {
      // Generate speech
      const result = await this.generateSpeech(text, profileId, options);

      // Decode base64 audio
      const audioData = atob(result.audio);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }

      // Decode audio buffer
      const audioBuffer = await this.audioContext.decodeAudioData(audioArray.buffer);

      // Create and play source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      // Track playback state
      this.currentAudio = source;
      this.isPlaying = true;
      this.onPlaybackStateChange?.(true);

      source.onended = () => {
        this.isPlaying = false;
        this.currentAudio = null;
        this.onPlaybackStateChange?.(false);
      };

      source.start(0);

    } catch (error) {
      console.error('[VoicePreferences] speak error:', error);
      this.isPlaying = false;
      this.onPlaybackStateChange?.(false);
      throw error;
    }
  }

  /**
   * Stop current speech playback
   */
  stopSpeaking() {
    if (this.currentAudio) {
      try {
        this.currentAudio.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.onPlaybackStateChange?.(false);
  }

  /**
   * Check if currently speaking
   * @returns {boolean}
   */
  isSpeaking() {
    return this.isPlaying;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VOICE PREVIEW
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Play a preview of a voice
   * @param {string} voiceId - Voice ID to preview
   * @param {string} previewText - Optional custom preview text
   * @returns {Promise<void>}
   */
  async playVoicePreview(voiceId, previewText = null) {
    this.initialize();
    this.stopSpeaking();

    const defaultPreviewText = previewText ||
      `Hello, I'm Luna - ${LUNA_VOICES[voiceId]?.name || 'your AI companion'}. I'm here to support you on your journey.`;

    try {
      const getPreview = httpsCallable(this.functions, 'getVoicePreview');
      const result = await getPreview({
        voiceId,
        previewText: defaultPreviewText
      });

      if (result.data.audio) {
        // Decode and play
        const audioData = atob(result.data.audio);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i);
        }

        const audioBuffer = await this.audioContext.decodeAudioData(audioArray.buffer);
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);

        this.currentAudio = source;
        this.isPlaying = true;
        this.onPlaybackStateChange?.(true);

        source.onended = () => {
          this.isPlaying = false;
          this.currentAudio = null;
          this.onPlaybackStateChange?.(false);
        };

        source.start(0);
      }

    } catch (error) {
      console.error('[VoicePreferences] playVoicePreview error:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STREAMING (Real-time TTS)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get streaming session for real-time TTS
   * @param {string} profileId - Profile ID
   * @returns {Promise<Object>} - Streaming session info
   */
  async getStreamingSession(profileId) {
    this.initialize();

    try {
      const getSession = httpsCallable(this.functions, 'getVoiceStreamingSession');
      const result = await getSession({ profileId });

      return {
        streamingUrl: result.data.streamingUrl,
        voiceId: result.data.voiceId,
        model: result.data.model,
        instructions: result.data.instructions
      };

    } catch (error) {
      console.error('[VoicePreferences] getStreamingSession error:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get recommended voice for a constitution
   * @param {string} constitution - Elemental constitution
   * @returns {Object} - Recommended voice
   */
  getRecommendedVoiceForConstitution(constitution) {
    for (const [id, voice] of Object.entries(LUNA_VOICES)) {
      if (voice.constitutions.includes(constitution)) {
        return { id, ...voice };
      }
    }
    return { id: 'present', ...LUNA_VOICES.present };
  }

  /**
   * Get recommended voice for a love language
   * @param {string} loveLanguage - Love language
   * @returns {Object} - Recommended voice
   */
  getRecommendedVoiceForLoveLanguage(loveLanguage) {
    for (const [id, voice] of Object.entries(LUNA_VOICES)) {
      if (voice.loveLanguage === loveLanguage) {
        return { id, ...voice };
      }
    }
    return { id: 'present', ...LUNA_VOICES.present };
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopSpeaking();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.cachedPreferences = null;
    this.cachedProfileId = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const voicePreferencesService = new VoicePreferencesService();
export default voicePreferencesService;
