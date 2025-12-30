/**
 * Optimized Archetype Integration for Luna
 * Drop-in replacement for archetypeIntegration.js
 */

import {
  optimizedSignalExtractor,
  optimizedArchetypeDetector,
  performanceMonitor,
  memoryManager
} from '../../src/lib/index.optimized.js';

import { EmotionCongruenceService } from '../../src/lib/emotionCongruenceService.js';

export class OptimizedArchetypeIntegration {
  constructor() {
    this.signalExtractor = optimizedSignalExtractor;
    this.archetypeDetector = optimizedArchetypeDetector;
    this.congruenceService = new EmotionCongruenceService();
    this.monitor = performanceMonitor;
    this.memoryManager = memoryManager;

    // Session storage
    this.sessions = new Map();
  }

  /**
   * Process complete utterance with performance tracking
   */
  processUtterance(text, voiceEmotion, conversationHistory = [], metadata = {}) {
    return this.monitor.measure('processUtterance', () => {
      // Extract signals
      const signals = this.signalExtractor.extract(text);

      // Detect archetype
      const archetype = this.archetypeDetector.detect(signals);

      // Analyze congruence
      const congruence = this.congruenceService.analyze(
        signals,
        voiceEmotion,
        archetype
      );

      // Get Luna guidance
      const llmModifier = this.getLLMModifier(archetype, signals, congruence);
      const voiceModulation = this.getVoiceModulation(archetype, signals, congruence);

      return {
        text,
        voiceEmotion,
        signals,
        archetype,
        congruence,
        llmModifier,
        voiceModulation,
        timestamp: Date.now(),
        performance: this.monitor.getStats('processUtterance')
      };
    });
  }

  /**
   * Process partial utterance (real-time streaming)
   */
  processPartial(partialText, voiceEmotion) {
    if (partialText.length < 10) {
      return null; // Too short
    }

    return this.monitor.measure('processPartial', () => {
      const signals = this.signalExtractor.extract(partialText);
      const archetype = this.archetypeDetector.detect(signals);

      return {
        archetype,
        signals,
        confidence: archetype.confidence,
        isPartial: true
      };
    });
  }

  /**
   * Get LLM modifier (same as original)
   */
  getLLMModifier(archetype, signals, congruence) {
    const modifiers = {
      Seed: {
        approach: 'explorative_support',
        tone: 'gentle and curious',
        focus: ['validate uncertainty', 'explore possibilities', 'encourage curiosity']
      },
      Mirror: {
        approach: 'reflective_dialogue',
        tone: 'thoughtful and mirroring',
        focus: ['reflect patterns', 'invite self-awareness', 'support integration']
      },
      Mender: {
        approach: 'compassionate_holding',
        tone: 'warm and tender',
        focus: ['acknowledge pain', 'offer comfort', 'honor healing process']
      },
      Librarian: {
        approach: 'contextual_understanding',
        tone: 'respectful and connecting',
        focus: ['honor the past', 'connect to continuity', 'validate memory']
      },
      Conductor: {
        approach: 'structured_guidance',
        tone: 'clear and organized',
        focus: ['provide structure', 'clarify options', 'support analysis']
      },
      Companion: {
        approach: 'warm_presence',
        tone: 'friendly and connected',
        focus: ['share presence', 'celebrate connection', 'mutual enjoyment']
      },
      Guardian: {
        approach: 'protective_support',
        tone: 'firm and supportive',
        focus: ['affirm boundaries', 'validate protection', 'ensure safety']
      },
      Flamebearer: {
        approach: 'energizing_support',
        tone: 'enthusiastic and motivating',
        focus: ['fuel momentum', 'celebrate drive', 'support purpose']
      },
      Guide: {
        approach: 'integrative_wisdom',
        tone: 'calm and wise',
        focus: ['support integration', 'offer perspective', 'trust their knowing']
      }
    };

    const baseModifier = modifiers[archetype.type] || modifiers.Companion;

    // Adjust based on congruence
    if (congruence.level === 'LOW') {
      baseModifier.approach = 'gentle_probe';
      baseModifier.focus.unshift('address possible masking');
    }

    return baseModifier;
  }

  /**
   * Get voice modulation parameters
   */
  getVoiceModulation(archetype, signals, congruence) {
    const base = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      style: 'conversational'
    };

    // Adjust for archetype
    const adjustments = {
      Seed: { rate: 0.95, pitch: 1.05, style: 'gentle' },
      Mender: { rate: 0.90, pitch: 0.95, style: 'warm' },
      Guardian: { rate: 1.0, pitch: 0.98, style: 'firm' },
      Flamebearer: { rate: 1.05, pitch: 1.08, style: 'energetic' },
      Guide: { rate: 0.92, pitch: 0.97, style: 'calm' }
    };

    const adjustment = adjustments[archetype.type] || {};
    return { ...base, ...adjustment };
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    return this.monitor.getReport();
  }

  /**
   * Get memory usage
   */
  getMemoryUsage() {
    return this.memoryManager.getMemoryUsage();
  }
}

// Singleton
export const optimizedArchetypeIntegration = new OptimizedArchetypeIntegration();
