/**
 * Voice Optimization Service
 * Optimizes voice quality, latency, and cost for real-time voice conversations
 *
 * Features:
 * - Adaptive quality based on network conditions
 * - Cost optimization (Groq for STT, ElevenLabs for TTS)
 * - Latency monitoring and optimization
 * - Turbo mode for faster responses
 * - Audio preprocessing and noise reduction
 *
 * Part of GENESIS - Voice Architecture
 * Created: December 28, 2024
 */

// Voice quality presets
export const VOICE_QUALITY_PRESETS = {
  TURBO: {
    name: 'Turbo',
    description: 'Fastest response, basic quality',
    stt: {
      provider: 'groq',
      model: 'whisper-large-v3-turbo',
      language: 'en'
    },
    tts: {
      provider: 'elevenlabs',
      model: 'eleven_turbo_v2_5',
      stability: 0.5,
      similarity: 0.75,
      style: 0.0,
      latencyOptimization: 4  // Maximum optimization
    },
    llm: {
      thinkingLevel: 'minimal'
    }
  },
  BALANCED: {
    name: 'Balanced',
    description: 'Good balance of speed and quality',
    stt: {
      provider: 'groq',
      model: 'whisper-large-v3',
      language: 'en'
    },
    tts: {
      provider: 'elevenlabs',
      model: 'eleven_multilingual_v2',
      stability: 0.5,
      similarity: 0.75,
      style: 0.3,
      latencyOptimization: 3
    },
    llm: {
      thinkingLevel: 'low'
    }
  },
  QUALITY: {
    name: 'Quality',
    description: 'Best quality, higher latency',
    stt: {
      provider: 'groq',
      model: 'whisper-large-v3',
      language: 'en'
    },
    tts: {
      provider: 'elevenlabs',
      model: 'eleven_multilingual_v2',
      stability: 0.6,
      similarity: 0.85,
      style: 0.5,
      latencyOptimization: 2
    },
    llm: {
      thinkingLevel: 'medium'
    }
  },
  DEEP_THINKING: {
    name: 'Deep Thinking',
    description: 'Maximum thinking, slower response',
    stt: {
      provider: 'groq',
      model: 'whisper-large-v3',
      language: 'en'
    },
    tts: {
      provider: 'elevenlabs',
      model: 'eleven_multilingual_v2',
      stability: 0.7,
      similarity: 0.9,
      style: 0.6,
      latencyOptimization: 1
    },
    llm: {
      thinkingLevel: 'high'
    }
  }
};

// Network quality thresholds
const NETWORK_THRESHOLDS = {
  EXCELLENT: { minBandwidth: 10000, maxLatency: 50 },
  GOOD: { minBandwidth: 5000, maxLatency: 100 },
  FAIR: { minBandwidth: 2000, maxLatency: 200 },
  POOR: { minBandwidth: 500, maxLatency: 500 }
};

class VoiceOptimizationService {
  constructor() {
    this.currentPreset = 'BALANCED';
    this.networkQuality = 'GOOD';
    this.metrics = {
      sttLatencies: [],
      ttsLatencies: [],
      llmLatencies: [],
      totalLatencies: [],
      errors: []
    };
    this.adaptiveMode = true;
  }

  /**
   * Set the quality preset
   */
  setPreset(presetName) {
    if (VOICE_QUALITY_PRESETS[presetName]) {
      this.currentPreset = presetName;
      console.log(`🎤 [VoiceOpt] Preset changed to: ${presetName}`);
      return VOICE_QUALITY_PRESETS[presetName];
    }
    console.warn(`[VoiceOpt] Unknown preset: ${presetName}`);
    return null;
  }

  /**
   * Get current preset configuration
   */
  getPreset() {
    return VOICE_QUALITY_PRESETS[this.currentPreset];
  }

  /**
   * Get STT configuration
   */
  getSTTConfig() {
    return this.getPreset().stt;
  }

  /**
   * Get TTS configuration
   */
  getTTSConfig() {
    return this.getPreset().tts;
  }

  /**
   * Get LLM configuration
   */
  getLLMConfig() {
    return this.getPreset().llm;
  }

  /**
   * Enable/disable adaptive mode
   */
  setAdaptiveMode(enabled) {
    this.adaptiveMode = enabled;
    console.log(`🎤 [VoiceOpt] Adaptive mode: ${enabled ? 'ON' : 'OFF'}`);
  }

  /**
   * Record STT latency
   */
  recordSTTLatency(latencyMs) {
    this.metrics.sttLatencies.push({
      timestamp: Date.now(),
      latency: latencyMs
    });
    // Keep last 50
    if (this.metrics.sttLatencies.length > 50) {
      this.metrics.sttLatencies.shift();
    }
    this.maybeAdapt();
  }

  /**
   * Record TTS latency
   */
  recordTTSLatency(latencyMs) {
    this.metrics.ttsLatencies.push({
      timestamp: Date.now(),
      latency: latencyMs
    });
    if (this.metrics.ttsLatencies.length > 50) {
      this.metrics.ttsLatencies.shift();
    }
    this.maybeAdapt();
  }

  /**
   * Record LLM latency
   */
  recordLLMLatency(latencyMs) {
    this.metrics.llmLatencies.push({
      timestamp: Date.now(),
      latency: latencyMs
    });
    if (this.metrics.llmLatencies.length > 50) {
      this.metrics.llmLatencies.shift();
    }
    this.maybeAdapt();
  }

  /**
   * Record total turn latency (user speaks -> Luna speaks)
   */
  recordTurnLatency(latencyMs) {
    this.metrics.totalLatencies.push({
      timestamp: Date.now(),
      latency: latencyMs
    });
    if (this.metrics.totalLatencies.length > 50) {
      this.metrics.totalLatencies.shift();
    }
    this.maybeAdapt();
  }

  /**
   * Record error
   */
  recordError(type, error) {
    this.metrics.errors.push({
      timestamp: Date.now(),
      type,
      message: error?.message || String(error)
    });
    if (this.metrics.errors.length > 20) {
      this.metrics.errors.shift();
    }
  }

  /**
   * Calculate average latency for a metric type
   */
  getAverageLatency(type) {
    const data = this.metrics[`${type}Latencies`];
    if (!data || data.length === 0) return 0;

    // Use last 10 measurements
    const recent = data.slice(-10);
    const sum = recent.reduce((acc, m) => acc + m.latency, 0);
    return Math.round(sum / recent.length);
  }

  /**
   * Maybe adapt quality based on metrics
   */
  maybeAdapt() {
    if (!this.adaptiveMode) return;

    const avgTotal = this.getAverageLatency('total');

    // If latency is consistently high, downgrade
    if (avgTotal > 3000 && this.currentPreset !== 'TURBO') {
      console.log(`🎤 [VoiceOpt] High latency detected (${avgTotal}ms), switching to TURBO`);
      this.setPreset('TURBO');
    }
    // If latency is good and we're on TURBO, try upgrading
    else if (avgTotal < 1500 && this.currentPreset === 'TURBO') {
      console.log(`🎤 [VoiceOpt] Good latency (${avgTotal}ms), switching to BALANCED`);
      this.setPreset('BALANCED');
    }
  }

  /**
   * Update network quality estimate
   */
  updateNetworkQuality(bandwidthKbps, latencyMs) {
    if (bandwidthKbps >= NETWORK_THRESHOLDS.EXCELLENT.minBandwidth &&
        latencyMs <= NETWORK_THRESHOLDS.EXCELLENT.maxLatency) {
      this.networkQuality = 'EXCELLENT';
    } else if (bandwidthKbps >= NETWORK_THRESHOLDS.GOOD.minBandwidth &&
               latencyMs <= NETWORK_THRESHOLDS.GOOD.maxLatency) {
      this.networkQuality = 'GOOD';
    } else if (bandwidthKbps >= NETWORK_THRESHOLDS.FAIR.minBandwidth &&
               latencyMs <= NETWORK_THRESHOLDS.FAIR.maxLatency) {
      this.networkQuality = 'FAIR';
    } else {
      this.networkQuality = 'POOR';
    }

    console.log(`🌐 [VoiceOpt] Network quality: ${this.networkQuality}`);
  }

  /**
   * Get optimization summary
   */
  getSummary() {
    return {
      preset: this.currentPreset,
      presetConfig: this.getPreset(),
      networkQuality: this.networkQuality,
      adaptiveMode: this.adaptiveMode,
      averageLatencies: {
        stt: this.getAverageLatency('stt'),
        tts: this.getAverageLatency('tts'),
        llm: this.getAverageLatency('llm'),
        total: this.getAverageLatency('total')
      },
      recentErrors: this.metrics.errors.slice(-5)
    };
  }

  /**
   * Get recommended preset based on use case
   */
  getRecommendedPreset(useCase) {
    const recommendations = {
      'quick_chat': 'TURBO',
      'casual_conversation': 'BALANCED',
      'deep_discussion': 'QUALITY',
      'problem_solving': 'DEEP_THINKING',
      'emotional_support': 'QUALITY',
      'brainstorming': 'BALANCED'
    };
    return recommendations[useCase] || 'BALANCED';
  }

  /**
   * Optimize for specific scenario
   */
  optimizeForScenario(scenario) {
    const preset = this.getRecommendedPreset(scenario);
    this.setPreset(preset);
    return this.getPreset();
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      sttLatencies: [],
      ttsLatencies: [],
      llmLatencies: [],
      totalLatencies: [],
      errors: []
    };
  }

  /**
   * Calculate optimal chunk size for TTS streaming
   */
  getOptimalChunkSize() {
    const avgLatency = this.getAverageLatency('total');

    // Smaller chunks for high latency (more responsive)
    if (avgLatency > 2000) return 50;   // ~50 chars per chunk
    if (avgLatency > 1000) return 100;  // ~100 chars per chunk
    return 200; // Normal chunk size
  }

  /**
   * Should use streaming TTS?
   */
  shouldUseStreaming() {
    // Use streaming for real-time voice
    return this.currentPreset !== 'DEEP_THINKING';
  }

  /**
   * Get audio preprocessing config
   */
  getAudioPreprocessingConfig() {
    return {
      // Noise suppression
      noiseSuppression: true,
      noiseSuppressionLevel: 'moderate', // 'low', 'moderate', 'aggressive'

      // Echo cancellation
      echoCancellation: true,

      // Automatic gain control
      autoGainControl: true,

      // Voice activity detection
      vadEnabled: true,
      vadThreshold: 0.5,

      // Sample rate
      sampleRate: this.currentPreset === 'TURBO' ? 16000 : 22050
    };
  }

  /**
   * Get all presets for UI display
   */
  getAllPresets() {
    return Object.entries(VOICE_QUALITY_PRESETS).map(([key, value]) => ({
      id: key,
      ...value
    }));
  }
}

// Singleton instance
export const voiceOptimizationService = new VoiceOptimizationService();

export default voiceOptimizationService;
