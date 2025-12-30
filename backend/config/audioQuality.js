/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUDIO QUALITY OPTIONS - Latency vs Quality Tradeoffs
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Configurable audio quality presets for voice interactions.
 * Users can choose between faster response times or higher quality audio.
 *
 * PRESETS:
 * - fast:     Minimal latency, good for quick conversations
 * - balanced: Default, balanced quality and speed
 * - quality:  Best audio quality, higher latency acceptable
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode - Production Hardening
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIO QUALITY PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export const AUDIO_PRESETS = {
  /**
   * Fast mode - Optimized for lowest latency
   * Use when: Quick back-and-forth conversation, mobile networks
   */
  fast: {
    name: 'Fast',
    description: 'Optimized for quick responses',
    icon: '⚡',

    // STT Settings
    stt: {
      model: 'whisper-large-v3-turbo',  // Fastest Groq model
      language: null,                    // Auto-detect (faster)
      responseFormat: 'text',            // No timestamps
      temperature: 0                     // Deterministic
    },

    // TTS Settings (ElevenLabs)
    tts: {
      model: 'eleven_turbo_v2_5',        // Fastest ElevenLabs model
      optimize_streaming_latency: 4,      // Maximum optimization
      output_format: 'mp3_22050_32',      // Lower quality, faster
      stability: 0.5,
      similarity_boost: 0.75
    },

    // Audio Capture Settings
    capture: {
      sampleRate: 16000,                  // Lower sample rate
      chunkSize: 2048,                    // Smaller chunks
      silenceThreshold: 300               // Faster silence detection
    },

    // Estimated latency range
    latency: {
      stt: '150-300ms',
      tts: '200-400ms',
      total: '400-800ms'
    }
  },

  /**
   * Balanced mode - Default for most users
   * Use when: Normal conversation, good network
   */
  balanced: {
    name: 'Balanced',
    description: 'Good quality with reasonable speed',
    icon: '⚖️',

    // STT Settings
    stt: {
      model: 'whisper-large-v3-turbo',
      language: null,
      responseFormat: 'verbose_json',     // Include word timestamps
      temperature: 0
    },

    // TTS Settings
    tts: {
      model: 'eleven_turbo_v2_5',
      optimize_streaming_latency: 2,      // Balanced
      output_format: 'mp3_44100_64',      // Standard quality
      stability: 0.5,
      similarity_boost: 0.8
    },

    // Audio Capture Settings
    capture: {
      sampleRate: 24000,                  // Standard for OpenAI
      chunkSize: 4096,                    // Default
      silenceThreshold: 500               // Standard
    },

    // Estimated latency range
    latency: {
      stt: '200-400ms',
      tts: '300-600ms',
      total: '600-1200ms'
    }
  },

  /**
   * Quality mode - Best audio fidelity
   * Use when: Deep conversations, good connection, quality matters
   */
  quality: {
    name: 'Quality',
    description: 'Best audio quality',
    icon: '🎵',

    // STT Settings
    stt: {
      model: 'whisper-large-v3',          // Full model (more accurate)
      language: null,
      responseFormat: 'verbose_json',
      temperature: 0
    },

    // TTS Settings
    tts: {
      model: 'eleven_multilingual_v2',    // Highest quality model
      optimize_streaming_latency: 0,      // No latency optimization
      output_format: 'mp3_44100_128',     // Highest quality MP3
      stability: 0.6,
      similarity_boost: 0.85
    },

    // Audio Capture Settings
    capture: {
      sampleRate: 24000,
      chunkSize: 8192,                    // Larger chunks
      silenceThreshold: 700               // More patient
    },

    // Estimated latency range
    latency: {
      stt: '300-600ms',
      tts: '500-1000ms',
      total: '900-2000ms'
    }
  }
};

// Default preset
export const DEFAULT_PRESET = 'balanced';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get audio preset by name
 * @param {string} presetName - Preset name (fast, balanced, quality)
 * @returns {Object} - Preset configuration
 */
export function getPreset(presetName) {
  return AUDIO_PRESETS[presetName] || AUDIO_PRESETS[DEFAULT_PRESET];
}

/**
 * Get STT configuration for preset
 * @param {string} presetName - Preset name
 * @returns {Object} - STT configuration
 */
export function getSTTConfig(presetName) {
  const preset = getPreset(presetName);
  return preset.stt;
}

/**
 * Get TTS configuration for preset
 * @param {string} presetName - Preset name
 * @returns {Object} - TTS configuration
 */
export function getTTSConfig(presetName) {
  const preset = getPreset(presetName);
  return preset.tts;
}

/**
 * Get capture configuration for preset
 * @param {string} presetName - Preset name
 * @returns {Object} - Capture configuration
 */
export function getCaptureConfig(presetName) {
  const preset = getPreset(presetName);
  return preset.capture;
}

/**
 * Get all available presets for UI display
 * @returns {Object[]} - Array of preset summaries
 */
export function getAvailablePresets() {
  return Object.entries(AUDIO_PRESETS).map(([key, preset]) => ({
    id: key,
    name: preset.name,
    description: preset.description,
    icon: preset.icon,
    latency: preset.latency.total
  }));
}

/**
 * Validate preset name
 * @param {string} presetName - Preset name to validate
 * @returns {boolean} - True if valid
 */
export function isValidPreset(presetName) {
  return presetName in AUDIO_PRESETS;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NETWORK-AWARE PRESET SELECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Suggest preset based on network conditions
 * @param {Object} networkInfo - { effectiveType, downlink, rtt }
 * @returns {string} - Suggested preset name
 */
export function suggestPreset(networkInfo) {
  if (!networkInfo) return DEFAULT_PRESET;

  const { effectiveType, downlink, rtt } = networkInfo;

  // Slow connection (2G, slow 3G)
  if (effectiveType === '2g' || effectiveType === 'slow-2g' || rtt > 500) {
    return 'fast';
  }

  // Fast connection (4G, WiFi)
  if (effectiveType === '4g' && downlink > 5 && rtt < 100) {
    return 'quality';
  }

  // Default to balanced
  return 'balanced';
}

/**
 * Get Network Information (for client-side)
 * @returns {Object|null} - Network info or null if unavailable
 */
export function getNetworkInfo() {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return null;
  }

  const conn = navigator.connection;
  return {
    effectiveType: conn.effectiveType,
    downlink: conn.downlink,
    rtt: conn.rtt,
    saveData: conn.saveData
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  AUDIO_PRESETS,
  DEFAULT_PRESET,
  getPreset,
  getSTTConfig,
  getTTSConfig,
  getCaptureConfig,
  getAvailablePresets,
  isValidPreset,
  suggestPreset,
  getNetworkInfo
};
