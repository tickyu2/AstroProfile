/**
 * ============================================================================
 * EMOTION CONGRUENCE SERVICE
 * ============================================================================
 *
 * Compares voice prosody emotion with text-based archetype detection.
 * Detects congruence, masking, sarcasm, and mixed signals.
 *
 * Patterns Detected:
 * - MATCHING: Voice and text align naturally
 * - MASKING: Voice shows emotion, text denies it
 * - SARCASM: Positive words with negative voice or vice versa
 * - AMPLIFICATION: Both channels strongly agree
 * - SUPPRESSION: Trying to control strong emotion
 * - MIXED: Conflicting signals, complex emotional state
 *
 * Part of: GENESIS Archetype Integration
 * Created: December 29, 2024
 * ============================================================================
 */

import { ARCHETYPE_COLORS, ARCHETYPE_ICONS } from '../services/archetype/lexicons.js';

/**
 * Emotion Congruence Service
 */
export class EmotionCongruenceService {
  constructor() {
    // Map GENESIS archetypes to emotion categories
    this.archetypeEmotionMap = {
      seed: ['curious', 'hopeful', 'uncertain', 'anxious'],
      mirror: ['reflective', 'neutral', 'thoughtful'],
      mender: ['sad', 'hurt', 'vulnerable'],
      librarian: ['nostalgic', 'analytical', 'reflective'],
      conductor: ['focused', 'determined', 'organized'],
      companion: ['warm', 'connected', 'social', 'happy'],
      guardian: ['protective', 'assertive', 'firm', 'angry'],
      flamebearer: ['excited', 'energized', 'driven', 'happy'],
      guide: ['wise', 'integrated', 'calm', 'peaceful']
    };

    // Map voice emotions (from Luna SER) to categories
    this.voiceEmotionCategories = {
      happy: 'positive',
      sad: 'negative',
      angry: 'negative',
      anxious: 'negative',
      fear: 'negative',
      surprised: 'neutral',
      disgusted: 'negative',
      neutral: 'neutral'
    };

    // Masking phrases - when someone says they're fine but voice says otherwise
    this.maskingPhrases = [
      "i'm fine", "i'm okay", "i'm good", "i'm alright",
      "no problem", "it's fine", "don't worry", "it's okay",
      "whatever", "doesn't matter", "it's nothing",
      "i'm not upset", "i don't care", "no big deal"
    ];

    // Control phrases - when trying to suppress emotion
    this.controlPhrases = [
      "trying to", "need to calm", "should stop", "shouldn't feel",
      "getting upset", "calm down", "control myself", "keep it together",
      "can't let", "have to stay", "need to be strong"
    ];
  }

  /**
   * Analyze congruence between voice and text
   * @param {string} voiceEmotion - From Luna's SER (neutral, happy, sad, etc.)
   * @param {object} textDetection - From GENESIS archetype detector
   * @param {string} transcript - Full text
   * @param {object} voiceFeatures - Optional: pitch, energy, speaking rate
   * @returns {object} Congruence analysis
   */
  analyzeCongruence(voiceEmotion, textDetection, transcript, voiceFeatures = {}) {
    const archetype = textDetection.primary.name;
    const signals = textDetection.signals;

    // Determine if voice and text align
    const congruence = this.calculateCongruence(voiceEmotion, archetype, signals);

    // Detect specific patterns
    const pattern = this.detectPattern(voiceEmotion, archetype, transcript, signals);

    // Generate confidence score
    const confidence = this.calculateConfidence(congruence, pattern, textDetection.primary.score);

    // Determine confirmed emotion
    const confirmedEmotion = this.resolveConfirmedEmotion(voiceEmotion, archetype, pattern, congruence);

    // Generate guidance for Luna
    const lunaGuidance = this.generateLunaGuidance(pattern, archetype, confirmedEmotion);

    return {
      congruence, // 'CONGRUENT', 'INCONGRUENT', 'PARTIAL'
      pattern, // 'MATCHING', 'MASKING', 'SARCASM', 'AMPLIFICATION', 'SUPPRESSION', 'MIXED'
      confidence,
      voiceEmotion,
      textArchetype: archetype,
      confirmedEmotion,
      lunaGuidance,
      reasoning: this.generateReasoning(voiceEmotion, archetype, pattern, signals),
      visual: {
        color: ARCHETYPE_COLORS[archetype],
        icon: ARCHETYPE_ICONS[archetype]
      }
    };
  }

  /**
   * Calculate congruence level
   */
  calculateCongruence(voiceEmotion, archetype, signals) {
    // Check direct mappings
    const expectedEmotions = this.archetypeEmotionMap[archetype] || [];

    // Check if voice emotion aligns with archetype expectations
    if (this.emotionsMatch(voiceEmotion, expectedEmotions)) {
      return 'CONGRUENT';
    }

    // Check valence alignment
    const voiceValence = this.voiceEmotionCategories[voiceEmotion] || 'neutral';
    const textValence = signals.valence > 0.2 ? 'positive' : signals.valence < -0.2 ? 'negative' : 'neutral';

    if (voiceValence === textValence) {
      return 'PARTIAL';
    }

    return 'INCONGRUENT';
  }

  /**
   * Detect specific congruence patterns
   */
  detectPattern(voiceEmotion, archetype, transcript, signals) {
    const transcriptLower = transcript.toLowerCase();

    // MASKING: Voice shows emotion, text denies it
    if (this.isMasking(voiceEmotion, transcriptLower, signals)) {
      return 'MASKING';
    }

    // SARCASM: Positive words with negative voice or vice versa
    if (this.isSarcasm(voiceEmotion, signals)) {
      return 'SARCASM';
    }

    // AMPLIFICATION: Both channels strongly agree
    if (this.isAmplification(voiceEmotion, archetype, signals)) {
      return 'AMPLIFICATION';
    }

    // SUPPRESSION: Trying to control strong emotion
    if (this.isSuppression(voiceEmotion, archetype, transcriptLower)) {
      return 'SUPPRESSION';
    }

    // MIXED: Conflicting signals
    if (this.isMixed(voiceEmotion, archetype, signals)) {
      return 'MIXED';
    }

    // MATCHING: Simple agreement
    return 'MATCHING';
  }

  /**
   * Detect masking (hiding true feelings)
   */
  isMasking(voiceEmotion, transcript, signals) {
    const hasMaskingPhrase = this.maskingPhrases.some(phrase =>
      transcript.includes(phrase)
    );

    const voiceShowsEmotion = ['sad', 'angry', 'anxious', 'fear'].includes(voiceEmotion);
    const textShowsNeutral = Math.abs(signals.valence) < 0.3;

    return hasMaskingPhrase && voiceShowsEmotion && textShowsNeutral;
  }

  /**
   * Detect sarcasm
   */
  isSarcasm(voiceEmotion, signals) {
    // Positive words but negative voice
    const positiveText = signals.valence > 0.3;
    const negativeVoice = ['angry', 'disgusted', 'sad'].includes(voiceEmotion);

    // Or negative words with happy voice (less common)
    const negativeText = signals.valence < -0.3;
    const positiveVoice = voiceEmotion === 'happy';

    return (positiveText && negativeVoice && signals.intensity > 0.5) ||
           (negativeText && positiveVoice && signals.intensity > 0.5);
  }

  /**
   * Detect amplification (strong agreement)
   */
  isAmplification(voiceEmotion, archetype, signals) {
    const matches = this.emotionsMatch(voiceEmotion, this.archetypeEmotionMap[archetype] || []);
    const highIntensity = signals.intensity > 0.6;

    return matches && highIntensity;
  }

  /**
   * Detect suppression (trying to control emotion)
   */
  isSuppression(voiceEmotion, archetype, transcript) {
    const hasControlPhrase = this.controlPhrases.some(phrase =>
      transcript.includes(phrase)
    );

    const voiceShowsEmotion = ['angry', 'anxious', 'sad', 'fear'].includes(voiceEmotion);
    const archetypeIsConductor = archetype === 'conductor';

    return hasControlPhrase && voiceShowsEmotion && archetypeIsConductor;
  }

  /**
   * Detect mixed signals
   */
  isMixed(voiceEmotion, archetype, signals) {
    const voiceValence = this.voiceEmotionCategories[voiceEmotion] || 'neutral';
    const textValence = signals.valence > 0.2 ? 'positive' : signals.valence < -0.2 ? 'negative' : 'neutral';

    // Different valences with high uncertainty
    return voiceValence !== textValence && signals.uncertainty > 0.4;
  }

  /**
   * Check if emotions match
   */
  emotionsMatch(voiceEmotion, expectedEmotions) {
    // Direct match
    if (expectedEmotions.includes(voiceEmotion)) return true;

    // Category match
    const emotionMappings = {
      'vulnerable': ['sad', 'anxious', 'fear'],
      'hopeful': ['happy'],
      'uncertain': ['anxious'],
      'assertive': ['angry'],
      'excited': ['happy'],
      'hurt': ['sad'],
      'warm': ['happy'],
      'calm': ['neutral'],
      'peaceful': ['neutral', 'happy']
    };

    return expectedEmotions.some(exp => {
      const mappedEmotions = emotionMappings[exp];
      return mappedEmotions && mappedEmotions.includes(voiceEmotion);
    });
  }

  /**
   * Calculate overall confidence
   */
  calculateConfidence(congruence, pattern, archetypeScore) {
    let confidence = archetypeScore;

    if (congruence === 'CONGRUENT') {
      confidence *= 1.2; // Boost for agreement
    } else if (congruence === 'INCONGRUENT') {
      confidence *= 0.7; // Reduce for disagreement
    }

    if (pattern === 'AMPLIFICATION') {
      confidence *= 1.3; // Strong agreement
    } else if (pattern === 'MASKING' || pattern === 'SARCASM') {
      confidence *= 0.9; // Known pattern, medium confidence
    } else if (pattern === 'MIXED') {
      confidence *= 0.6; // Uncertain
    }

    return Math.min(confidence, 0.99);
  }

  /**
   * Resolve the confirmed emotion
   */
  resolveConfirmedEmotion(voiceEmotion, archetype, pattern, congruence) {
    switch (pattern) {
      case 'MASKING':
        return voiceEmotion; // Trust voice over words

      case 'SARCASM':
        return voiceEmotion; // Voice reveals true feeling

      case 'AMPLIFICATION':
      case 'MATCHING':
        return voiceEmotion; // Clear agreement

      case 'SUPPRESSION':
        return voiceEmotion; // Underlying emotion showing through

      case 'MIXED':
        // Weight both sources
        if (congruence === 'PARTIAL') {
          return voiceEmotion;
        }
        return 'complex'; // Too mixed to resolve

      default:
        return voiceEmotion;
    }
  }

  /**
   * Generate guidance for Luna's response
   */
  generateLunaGuidance(pattern, archetype, confirmedEmotion) {
    const guidance = {
      MASKING: {
        approach: 'gentle_exploration',
        message: `Gently acknowledge what you're sensing beneath the words. User is ${archetype} but masking ${confirmedEmotion}.`,
        tone: 'soft, non-confrontational',
        example: "I hear you saying you're okay, and I'm also sensing something more there. Would you like to talk about it?",
        voiceStyle: 'warm, gentle, slightly slower'
      },

      SARCASM: {
        approach: 'acknowledge_frustration',
        message: `User is expressing frustration through sarcasm. Stay grounded, validate underlying feeling.`,
        tone: 'steady, understanding',
        example: "I can hear the frustration in that. What's really going on?",
        voiceStyle: 'calm, direct, non-reactive'
      },

      AMPLIFICATION: {
        approach: 'match_energy',
        message: `Strong ${confirmedEmotion} confirmed. Match their energy and validate fully.`,
        tone: 'matching intensity',
        example: confirmedEmotion === 'happy'
          ? "Yes! I can feel that excitement!"
          : "I'm here with you in this.",
        voiceStyle: confirmedEmotion === 'happy' ? 'energetic, warm' : 'present, supportive'
      },

      SUPPRESSION: {
        approach: 'create_safety',
        message: `User is trying to control ${confirmedEmotion}. Create space for feeling.`,
        tone: 'patient, permissive',
        example: "It's okay to feel what you're feeling. You don't have to control it right now.",
        voiceStyle: 'calm, spacious, reassuring'
      },

      MIXED: {
        approach: 'name_complexity',
        message: `Complex emotional state. Name the complexity without forcing resolution.`,
        tone: 'patient, holding space',
        example: "It sounds like you're holding a lot of different feelings at once.",
        voiceStyle: 'patient, accepting, open'
      },

      MATCHING: {
        approach: 'respond_naturally',
        message: `Clear ${archetype} archetype with ${confirmedEmotion}. Respond authentically.`,
        tone: 'natural, attuned',
        example: "I'm with you.",
        voiceStyle: 'natural, present'
      }
    };

    return guidance[pattern] || guidance.MATCHING;
  }

  /**
   * Generate reasoning explanation
   */
  generateReasoning(voiceEmotion, archetype, pattern, signals) {
    const parts = [];

    parts.push(`Voice: ${voiceEmotion}`);
    parts.push(`Text archetype: ${archetype}`);
    parts.push(`Pattern: ${pattern}`);

    if (signals.valence !== undefined && signals.valence !== 0) {
      parts.push(`Valence: ${signals.valence > 0 ? 'positive' : 'negative'} (${signals.valence.toFixed(2)})`);
    }

    if (signals.intensity > 0.5) {
      parts.push(`High intensity: ${signals.intensity.toFixed(2)}`);
    }

    if (signals.uncertainty > 0.4) {
      parts.push(`High uncertainty: ${signals.uncertainty.toFixed(2)}`);
    }

    return parts.join(' | ');
  }

  /**
   * Get LLM prompt modifier based on congruence
   */
  getLLMModifier(analysis) {
    const { pattern, textArchetype, confirmedEmotion, lunaGuidance } = analysis;

    let modifier = `User is experiencing ${textArchetype} archetype`;

    if (pattern === 'MASKING') {
      modifier += ` but masking their ${confirmedEmotion} feelings. ${lunaGuidance.message}`;
    } else if (pattern === 'AMPLIFICATION') {
      modifier += ` with strong ${confirmedEmotion} emotion. ${lunaGuidance.message}`;
    } else if (pattern === 'SARCASM') {
      modifier += ` expressing sarcasm/frustration. ${lunaGuidance.message}`;
    } else if (pattern === 'SUPPRESSION') {
      modifier += ` trying to control ${confirmedEmotion} emotion. ${lunaGuidance.message}`;
    } else if (pattern === 'MIXED') {
      modifier += ` in a complex emotional state. ${lunaGuidance.message}`;
    }

    return modifier;
  }

  /**
   * Get voice modulation parameters for TTS
   */
  getVoiceModulation(analysis) {
    const { pattern, confirmedEmotion } = analysis;

    // Base modulation from confirmed emotion
    const baseParams = {
      sad: { stability: 0.3, similarity_boost: 0.5, style: 0.2, speed: 0.9 },
      angry: { stability: 0.6, similarity_boost: 0.3, style: 0.0, speed: 1.1 },
      anxious: { stability: 0.4, similarity_boost: 0.4, style: 0.3, speed: 1.0 },
      fear: { stability: 0.4, similarity_boost: 0.4, style: 0.3, speed: 0.95 },
      happy: { stability: 0.8, similarity_boost: 0.7, style: 0.8, speed: 1.1 },
      neutral: { stability: 0.5, similarity_boost: 0.5, style: 0.5, speed: 1.0 },
      complex: { stability: 0.4, similarity_boost: 0.5, style: 0.4, speed: 0.95 }
    }[confirmedEmotion] || { stability: 0.5, similarity_boost: 0.5, style: 0.5, speed: 1.0 };

    // Adjust based on pattern
    const params = { ...baseParams };

    if (pattern === 'MASKING') {
      params.stability *= 0.8; // Softer
      params.style *= 0.7; // More gentle
      params.speed *= 0.95; // Slower
    } else if (pattern === 'AMPLIFICATION') {
      params.similarity_boost *= 1.2; // Match intensity
    } else if (pattern === 'SUPPRESSION') {
      params.stability *= 0.9;
      params.style *= 0.8;
      params.speed *= 0.9; // Slower, calmer
    }

    return params;
  }
}

// Export singleton
export const emotionCongruenceService = new EmotionCongruenceService();
