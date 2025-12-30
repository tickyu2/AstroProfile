/**
 * ============================================================================
 * ARCHETYPE INTEGRATION - BACKEND LAYER
 * ============================================================================
 *
 * Integration layer between GENESIS archetype detection and Luna's emotion system.
 * Manages sessions, processes utterances, and provides LLM/voice guidance.
 *
 * Features:
 * - Session management per user
 * - Real-time partial transcript analysis
 * - Complete utterance processing with voice+text congruence
 * - LLM prompt modifiers
 * - Voice modulation parameters
 *
 * Part of: GENESIS Archetype Integration
 * Created: December 29, 2024
 * ============================================================================
 */

import { RealtimeArchetypeDetector } from '../../src/lib/realtimeArchetypeDetector.js';
import { EmotionCongruenceService } from '../../src/lib/emotionCongruenceService.js';

/**
 * Archetype Integration Service
 */
export class ArchetypeIntegration {
  constructor() {
    this.congruenceService = new EmotionCongruenceService();

    // Session management - one detector per user
    this.sessions = new Map(); // userId -> detector instance
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Get or create detector for a user session
   */
  getDetector(userId) {
    let session = this.sessions.get(userId);

    if (!session) {
      session = {
        detector: new RealtimeArchetypeDetector(),
        lastActivity: Date.now(),
        messageCount: 0
      };
      this.sessions.set(userId, session);
    }

    session.lastActivity = Date.now();
    return session.detector;
  }

  /**
   * Process complete utterance with emotion data
   * Called after STT completion
   * @param {string} userId - User identifier
   * @param {string} transcript - Complete transcript
   * @param {string} voiceEmotion - From Luna's SER (sad, happy, etc.)
   * @param {object} voiceFeatures - Optional voice features
   * @returns {object} Complete analysis result
   */
  async processUtterance(userId, transcript, voiceEmotion, voiceFeatures = {}) {
    const detector = this.getDetector(userId);

    // Detect archetype from text
    const archetypeDetection = detector.analyzeComplete(transcript, {
      userId,
      timestamp: Date.now()
    });

    if (!archetypeDetection) {
      return {
        error: 'Unable to analyze transcript',
        transcript,
        timestamp: Date.now()
      };
    }

    // Analyze congruence between voice and text
    const congruence = this.congruenceService.analyzeCongruence(
      voiceEmotion,
      archetypeDetection,
      transcript,
      voiceFeatures
    );

    // Combine with Luna's existing emotion data
    const enhancedEmotion = this.enhanceEmotionData(
      voiceEmotion,
      archetypeDetection,
      congruence
    );

    // Update session
    const session = this.sessions.get(userId);
    if (session) {
      session.messageCount++;
    }

    return {
      transcript,
      voiceEmotion,
      archetype: archetypeDetection.primary.name,
      archetypeScore: archetypeDetection.primary.score,
      signals: archetypeDetection.signals,
      congruence: congruence.congruence,
      pattern: congruence.pattern,
      confirmedEmotion: congruence.confirmedEmotion,
      confidence: congruence.confidence,
      lunaGuidance: congruence.lunaGuidance,
      enhanced: enhancedEmotion,
      conversationContext: archetypeDetection.conversationContext,
      timestamp: Date.now()
    };
  }

  /**
   * Process partial transcript (real-time)
   * Called as STT streams partial results
   * @param {string} userId - User identifier
   * @param {string} partialTranscript - Incomplete transcript
   * @returns {object} Partial detection result
   */
  async processPartial(userId, partialTranscript) {
    const detector = this.getDetector(userId);
    const detection = detector.analyzePartial(partialTranscript);

    if (!detection) return null;

    return {
      archetype: detection.primary.name,
      score: detection.primary.score,
      confidence: detection.confidence,
      stability: detection.stability,
      partial: true,
      timestamp: Date.now()
    };
  }

  /**
   * Enhance Luna's emotion data with archetype info
   */
  enhanceEmotionData(voiceEmotion, archetypeDetection, congruence) {
    return {
      // Original Luna emotion
      voice: voiceEmotion,

      // GENESIS archetype
      archetype: archetypeDetection.primary.name,
      archetypeSecondary: archetypeDetection.secondary.map(s => s.name),

      // Congruence analysis
      congruent: congruence.congruence === 'CONGRUENT',
      pattern: congruence.pattern,
      confirmed: congruence.confirmedEmotion,

      // Combined confidence
      confidence: congruence.confidence,

      // Guidance for response
      guidance: congruence.lunaGuidance,

      // Key signals for logging
      signals: {
        intensity: archetypeDetection.signals.intensity,
        valence: archetypeDetection.signals.valence,
        uncertainty: archetypeDetection.signals.uncertainty,
        agency: archetypeDetection.signals.agency
      }
    };
  }

  /**
   * Get LLM prompt modifier based on congruence
   * Use this to enhance Luna's understanding of the user's state
   */
  getLLMModifier(enhancedEmotion) {
    const { pattern, archetype, confirmed, guidance } = enhancedEmotion;

    let modifier = `[Emotional Context: User is experiencing ${archetype} archetype`;

    if (pattern === 'MASKING') {
      modifier += ` but masking their ${confirmed} feelings. Approach gently - acknowledge what you sense beneath the words.`;
    } else if (pattern === 'AMPLIFICATION') {
      modifier += ` with strong ${confirmed} emotion. Match their energy and validate fully.`;
    } else if (pattern === 'SARCASM') {
      modifier += ` expressing frustration through sarcasm. Stay grounded, validate the underlying feeling.`;
    } else if (pattern === 'SUPPRESSION') {
      modifier += ` trying to control ${confirmed} emotion. Create space for feeling without pressure.`;
    } else if (pattern === 'MIXED') {
      modifier += ` in a complex emotional state. Name the complexity without forcing resolution.`;
    } else {
      modifier += ` feeling ${confirmed}. Respond naturally and attentively.`;
    }

    modifier += `]`;

    return modifier;
  }

  /**
   * Get voice modulation parameters for TTS
   * Use this to adjust Luna's voice to match the emotional context
   */
  getVoiceModulation(enhancedEmotion) {
    return this.congruenceService.getVoiceModulation({
      pattern: enhancedEmotion.pattern,
      confirmedEmotion: enhancedEmotion.confirmed
    });
  }

  /**
   * Get conversation summary for a user
   */
  getConversationSummary(userId) {
    const detector = this.getDetector(userId);
    const state = detector.getState();

    return {
      messageCount: state.messageCount,
      conversationContext: state.conversationContext,
      archetypeTrend: state.archetypeTrend,
      emotionalTrajectory: state.emotionalTrajectory
    };
  }

  /**
   * End user session
   */
  endSession(userId) {
    const session = this.sessions.get(userId);
    if (session) {
      session.detector.reset();
      this.sessions.delete(userId);
    }
  }

  /**
   * Clean up stale sessions
   */
  cleanupStaleSessions() {
    const now = Date.now();
    for (const [userId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.sessionTimeout) {
        session.detector.reset();
        this.sessions.delete(userId);
      }
    }
  }

  /**
   * Get active session count
   */
  getActiveSessionCount() {
    return this.sessions.size;
  }
}

// Singleton instance
export const archetypeIntegration = new ArchetypeIntegration();

// Cleanup stale sessions every 10 minutes
setInterval(() => {
  archetypeIntegration.cleanupStaleSessions();
}, 10 * 60 * 1000);
