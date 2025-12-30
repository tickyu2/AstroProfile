/**
 * Phase 3 Integration - Advanced Patterns
 * Drop-in replacement that adds 15 additional patterns
 */

import {
  optimizedSignalExtractor,
  optimizedArchetypeDetector,
  performanceMonitor
} from '../../src/lib/index.optimized.js';

import { EnhancedCongruenceService } from '../../src/lib/realtime/emotionCongruenceService.enhanced.js';
import {
  getResponseStrategy,
  getLunaSystemPrompt,
  requiresCrisisSupport
} from '../../src/lib/realtime/advancedResponseStrategies.js';

export class Phase3ArchetypeIntegration {
  constructor() {
    this.signalExtractor = optimizedSignalExtractor;
    this.archetypeDetector = optimizedArchetypeDetector;
    this.congruenceService = new EnhancedCongruenceService();
    this.monitor = performanceMonitor;
  }

  /**
   * Process utterance with advanced pattern detection
   */
  processUtterance(text, voiceEmotion, conversationHistory = [], metadata = {}) {
    return this.monitor.measure('processUtterance', () => {
      // Extract signals
      const signals = this.signalExtractor.extract(text);

      // Detect archetype
      const archetype = this.archetypeDetector.detect(signals);

      // Analyze congruence with advanced patterns
      const congruence = this.congruenceService.analyze(
        signals,
        voiceEmotion,
        archetype,
        text // Important: pass text for advanced pattern detection
      );

      // Get response strategy
      const responseStrategy = getResponseStrategy(
        congruence.advancedPatterns || [],
        congruence.level
      );

      // Get Luna system prompt
      const lunaSystemPrompt = getLunaSystemPrompt(
        congruence.advancedPatterns || [],
        congruence.level,
        archetype
      );

      // Check if crisis support needed
      const needsCrisisSupport = requiresCrisisSupport(
        congruence.advancedPatterns || []
      );

      return {
        text,
        voiceEmotion,
        signals,
        archetype,
        congruence: {
          ...congruence,
          basicPatterns: congruence.patterns,
          advancedPatterns: congruence.advancedPatterns,
          totalPatterns: congruence.totalPatternsDetected
        },
        responseStrategy,
        lunaSystemPrompt,
        needsCrisisSupport,
        llmModifier: this.getLLMModifier(archetype, signals, congruence),
        voiceModulation: this.getVoiceModulation(archetype, signals, congruence),
        timestamp: Date.now()
      };
    });
  }

  /**
   * Get LLM modifier (compatible with Phase 1)
   */
  getLLMModifier(archetype, signals, congruence) {
    const baseModifiers = {
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

    const baseModifier = baseModifiers[archetype.type] || baseModifiers.Companion;

    // Override with advanced pattern strategy if present
    if (congruence.priorityPattern) {
      const strategy = getResponseStrategy(
        congruence.advancedPatterns || [],
        congruence.level
      );

      if (strategy) {
        return {
          ...baseModifier,
          approach: strategy.approach,
          tone: strategy.tone,
          focus: strategy.focus,
          advancedPattern: congruence.priorityPattern.pattern
        };
      }
    }

    return baseModifier;
  }

  /**
   * Get voice modulation
   */
  getVoiceModulation(archetype, signals, congruence) {
    const base = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      style: 'conversational'
    };

    // Slow down for crisis patterns
    if (congruence.requiresSpecialHandling) {
      return {
        rate: 0.88,
        pitch: 0.95,
        volume: 0.95,
        style: 'calm'
      };
    }

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
}

// Singleton
export const phase3Integration = new Phase3ArchetypeIntegration();
