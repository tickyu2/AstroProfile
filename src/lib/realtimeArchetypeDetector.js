/**
 * ============================================================================
 * REAL-TIME GENESIS ARCHETYPE DETECTOR
 * ============================================================================
 *
 * Real-time archetype detection for Luna's voice conversations.
 * Integrates with voice prosody analysis for emotion congruence.
 *
 * Features:
 * - Streaming detection (partial transcripts as user speaks)
 * - Stability calculation (prevents jitter)
 * - Conversation context tracking
 * - Message buffer for context-aware detection
 *
 * Part of: GENESIS Archetype Integration
 * Created: December 29, 2024
 * ============================================================================
 */

import { SignalExtractor } from '../services/archetype/signalExtractor.js';
import { ArchetypeDetector } from '../services/archetype/archetypeDetector.js';

/**
 * Real-time GENESIS Archetype Detection for Luna
 */
export class RealtimeArchetypeDetector {
  constructor() {
    this.signalExtractor = new SignalExtractor();
    this.archetypeDetector = new ArchetypeDetector();

    // Buffer for context-aware detection
    this.messageBuffer = [];
    this.maxBufferSize = 10;

    // Streaming detection state
    this.currentUtterance = '';
    this.lastDetection = null;
    this.detectionHistory = [];
    this.historyLimit = 20;
  }

  /**
   * Analyze text in real-time as user speaks
   * @param {string} partialTranscript - Incomplete STT text
   * @param {object} context - Conversation context
   * @returns {object} Detection result with confidence
   */
  analyzePartial(partialTranscript, context = {}) {
    if (!partialTranscript || partialTranscript.length < 5) {
      return null; // Too short to analyze
    }

    this.currentUtterance = partialTranscript;

    // Extract signals
    const signals = this.signalExtractor.extractSignals(partialTranscript);

    // Detect archetypes
    const detection = this.archetypeDetector.detect(partialTranscript, {
      includeSecondary: true,
      includeSignals: true
    });

    // Calculate stability (how much is this changing?)
    const stability = this.calculateStability(detection);

    // Reduce confidence for partial text
    const adjustedConfidence = detection.confidence * stability * 0.8;

    const result = {
      primary: {
        name: detection.archetype,
        score: detection.score
      },
      secondary: this.formatSecondary(detection.secondary),
      signals: this.extractKeySignals(signals),
      partial: true,
      stability,
      confidence: adjustedConfidence,
      text: partialTranscript,
      timestamp: Date.now()
    };

    this.lastDetection = result;
    return result;
  }

  /**
   * Finalize detection when utterance is complete
   * @param {string} finalTranscript - Complete STT text
   * @param {object} context - Conversation context
   * @returns {object} Final detection result
   */
  analyzeComplete(finalTranscript, context = {}) {
    if (!finalTranscript || finalTranscript.length < 3) {
      return null;
    }

    // Extract signals
    const signals = this.signalExtractor.extractSignals(finalTranscript);

    // Detect archetypes with full context
    const detection = this.archetypeDetector.detect(finalTranscript, {
      includeSecondary: true,
      includeSignals: true
    });

    const result = {
      primary: {
        name: detection.archetype,
        score: detection.score
      },
      secondary: this.formatSecondary(detection.secondary),
      signals: this.extractKeySignals(signals),
      partial: false,
      confidence: detection.confidence,
      text: finalTranscript,
      timestamp: Date.now(),
      style: detection.style,
      visual: detection.visual,
      reasoning: detection.reasoning
    };

    // Add to buffer for context
    this.messageBuffer.push({
      text: finalTranscript,
      detection: result,
      timestamp: Date.now()
    });

    // Maintain buffer size
    if (this.messageBuffer.length > this.maxBufferSize) {
      this.messageBuffer.shift();
    }

    // Add to history
    this.detectionHistory.push(result);
    if (this.detectionHistory.length > this.historyLimit) {
      this.detectionHistory.shift();
    }

    this.lastDetection = result;

    // Add conversation context
    result.conversationContext = this.getConversationContext();

    return result;
  }

  /**
   * Format secondary archetypes
   */
  formatSecondary(secondary) {
    if (!secondary) return [];

    return [{
      name: secondary.archetype,
      score: secondary.score
    }];
  }

  /**
   * Extract key signals for congruence analysis
   */
  extractKeySignals(signals) {
    return {
      intensity: signals.emotionalIntensity || 0,
      valence: signals.valence || 0,
      uncertainty: signals.uncertainty || 0,
      agency: signals.agencyLevel || 0,
      dominantEmotion: signals.dominantEmotion || 'neutral',
      cognitiveStyle: signals.cognitiveStyle || 'balanced',
      relationalMode: signals.relationalMode || 'neutral',
      // Word counts for pattern detection
      joyWords: signals.joy || 0,
      angerWords: signals.anger || 0,
      fearWords: signals.fear || 0,
      sadnessWords: signals.sadness || 0,
      painWords: signals.pain || 0,
      boundaryWords: signals.boundary || 0,
      connectionWords: signals.connection || 0
    };
  }

  /**
   * Get conversation-level context
   */
  getConversationContext() {
    if (this.messageBuffer.length === 0) return null;

    // Calculate dominant archetype across conversation
    const archetypeCounts = {};
    this.messageBuffer.forEach(msg => {
      const arch = msg.detection.primary.name;
      archetypeCounts[arch] = (archetypeCounts[arch] || 0) + 1;
    });

    const sorted = Object.entries(archetypeCounts)
      .sort((a, b) => b[1] - a[1]);

    const dominant = sorted[0];

    // Calculate average emotional intensity
    const avgIntensity = this.messageBuffer.reduce((sum, msg) =>
      sum + (msg.detection.signals?.intensity || 0), 0
    ) / this.messageBuffer.length;

    // Calculate average valence
    const avgValence = this.messageBuffer.reduce((sum, msg) =>
      sum + (msg.detection.signals?.valence || 0), 0
    ) / this.messageBuffer.length;

    return {
      dominantArchetype: dominant[0],
      dominantCount: dominant[1],
      messageCount: this.messageBuffer.length,
      archetypeDistribution: archetypeCounts,
      averageIntensity: avgIntensity,
      averageValence: avgValence,
      conversationTone: avgValence > 0.2 ? 'positive' : avgValence < -0.2 ? 'negative' : 'neutral'
    };
  }

  /**
   * Calculate detection stability (prevents jitter)
   */
  calculateStability(detection) {
    if (!this.lastDetection) return 0.7; // Initial stability

    // If primary archetype is the same, high stability
    if (detection.archetype === this.lastDetection.primary.name) {
      return 0.95;
    }

    // If new primary was secondary before, medium stability
    const wasSecondary = this.lastDetection.secondary
      ?.some(s => s.name === detection.archetype);

    if (wasSecondary) {
      return 0.75;
    }

    // Complete shift, lower stability
    return 0.5;
  }

  /**
   * Get archetype trend over recent messages
   */
  getArchetypeTrend() {
    if (this.detectionHistory.length < 3) return null;

    const recent = this.detectionHistory.slice(-5);
    const archetypes = recent.map(d => d.primary.name);

    // Check if trending toward a specific archetype
    const lastThree = archetypes.slice(-3);
    const allSame = lastThree.every(a => a === lastThree[0]);

    if (allSame) {
      return {
        trend: 'stable',
        archetype: lastThree[0],
        confidence: 0.9
      };
    }

    // Check for shift
    const firstHalf = archetypes.slice(0, Math.floor(archetypes.length / 2));
    const secondHalf = archetypes.slice(Math.floor(archetypes.length / 2));

    const firstDominant = this.getMostCommon(firstHalf);
    const secondDominant = this.getMostCommon(secondHalf);

    if (firstDominant !== secondDominant) {
      return {
        trend: 'shifting',
        from: firstDominant,
        to: secondDominant,
        confidence: 0.7
      };
    }

    return {
      trend: 'mixed',
      archetypes: [...new Set(archetypes)],
      confidence: 0.5
    };
  }

  /**
   * Get most common item in array
   */
  getMostCommon(arr) {
    const counts = {};
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }

  /**
   * Get emotional trajectory
   */
  getEmotionalTrajectory() {
    if (this.detectionHistory.length < 3) return null;

    const recent = this.detectionHistory.slice(-5);
    const valences = recent.map(d => d.signals?.valence || 0);
    const intensities = recent.map(d => d.signals?.intensity || 0);

    const valenceStart = valences[0];
    const valenceEnd = valences[valences.length - 1];
    const valenceShift = valenceEnd - valenceStart;

    const intensityStart = intensities[0];
    const intensityEnd = intensities[intensities.length - 1];
    const intensityShift = intensityEnd - intensityStart;

    return {
      valence: {
        start: valenceStart,
        end: valenceEnd,
        shift: valenceShift,
        direction: valenceShift > 0.1 ? 'improving' : valenceShift < -0.1 ? 'declining' : 'stable'
      },
      intensity: {
        start: intensityStart,
        end: intensityEnd,
        shift: intensityShift,
        direction: intensityShift > 0.1 ? 'increasing' : intensityShift < -0.1 ? 'decreasing' : 'stable'
      }
    };
  }

  /**
   * Reset state (new conversation)
   */
  reset() {
    this.messageBuffer = [];
    this.currentUtterance = '';
    this.lastDetection = null;
    this.detectionHistory = [];
  }

  /**
   * Get current state summary
   */
  getState() {
    return {
      currentUtterance: this.currentUtterance,
      lastDetection: this.lastDetection,
      messageCount: this.messageBuffer.length,
      conversationContext: this.getConversationContext(),
      archetypeTrend: this.getArchetypeTrend(),
      emotionalTrajectory: this.getEmotionalTrajectory()
    };
  }
}

// Export singleton
export const realtimeArchetypeDetector = new RealtimeArchetypeDetector();
