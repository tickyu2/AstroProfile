/**
 * ============================================================================
 * GENESIS ARCHETYPE DETECTOR
 * ============================================================================
 *
 * Main detection engine for GENESIS Cathedral Archetypes.
 * Analyzes extracted signals to determine the optimal archetype for Luna
 * to embody based on user's current emotional and cognitive state.
 *
 * The 9 GENESIS Archetypes:
 * - Seed: Beginning, exploration, possibility
 * - Mirror: Reflection, truth-seeking, clarity
 * - Mender: Healing, tenderness, repair
 * - Librarian: Memory, pattern, continuity
 * - Conductor: Alignment, structure, organization
 * - Companion: Connection, warmth, togetherness
 * - Guardian: Boundaries, protection, sovereignty
 * - Flamebearer: Purpose, drive, momentum
 * - Guide: Integration, wholeness, wisdom
 *
 * Part of: GENESIS Archetype Detection System
 * Created: December 29, 2024
 * ============================================================================
 */

import { SignalExtractor, extractSignals } from './signalExtractor.js';
import { ARCHETYPE_COLORS, ARCHETYPE_ICONS, ARCHETYPE_NAMES, ARCHETYPE_DESCRIPTIONS } from './lexicons.js';

/**
 * Archetype affinity calculation weights
 * These define how signals map to archetype scores
 */
const ARCHETYPE_WEIGHTS = {
  seed: {
    uncertainty: 2.0,
    hasOpenQuestions: 1.5,
    questionCount: 0.3,
    growth: 1.0,
    futureFocus: 0.8,
    approach: 0.5,
    // Negative weights (reduce affinity)
    binary: -0.5,
    defensiveness: -0.5
  },

  mirror: {
    metaCognitive: 2.0,
    patternSeeking: 1.5,
    analytical: 1.0,
    selfCritical: 0.8,
    selfCompassion: 0.8,
    nuanced: 0.5,
    questionTypes_why: 1.0,
    // Negative weights
    urgency: -0.5
  },

  mender: {
    pain: 2.5,
    sadness: 2.0,
    vulnerability: 1.5,
    fear: 1.0,
    trust: 0.8,
    selfCompassion: 1.0,
    negativeWords: 0.3,
    // Negative weights
    anger: -0.3,
    binary: -0.3
  },

  librarian: {
    pastFocus: 2.0,
    patternSeeking: 1.5,
    analytical: 1.0,
    thirdPerson: 0.5,
    nuanced: 0.5,
    // Negative weights
    urgency: -0.5
  },

  conductor: {
    analytical: 1.5,
    binary: 1.0,
    highAgency: 1.0,
    questionTypes_how: 0.8,
    integration: 0.5,
    // Negative weights
    uncertainty: -0.5,
    lowAgency: -0.8
  },

  companion: {
    connection: 2.0,
    firstPersonPlural: 1.5,
    trust: 1.0,
    joy: 0.8,
    positiveWords: 0.5,
    vulnerability: 0.5,
    // Negative weights
    boundary: -0.5,
    defensiveness: -0.5
  },

  guardian: {
    boundary: 2.5,
    anger: 1.5,
    defensiveness: 1.0,
    highAgency: 0.8,
    avoidance: 0.5,
    // Negative weights
    vulnerability: -0.3,
    trust: -0.3
  },

  flamebearer: {
    purpose: 2.5,
    approach: 1.5,
    highAgency: 1.5,
    futureFocus: 1.0,
    urgency: 0.8,
    exclamationCount: 0.3,
    intensity: 0.5,
    // Negative weights
    lowAgency: -1.0,
    uncertainty: -0.5
  },

  guide: {
    integration: 2.5,
    nuanced: 1.5,
    metaCognitive: 1.0,
    growth: 1.0,
    cognitiveComplexity: 1.5,
    emotionalIntensity: 0.5,
    // Negative weights
    binary: -0.8
  }
};

/**
 * Archetype response style definitions
 */
const ARCHETYPE_STYLES = {
  seed: {
    tone: 'curious, wondering, exploratory',
    openings: [
      "What an interesting place to begin...",
      "I wonder what might unfold here...",
      "There's something sprouting in what you're sharing..."
    ],
    approach: 'Ask opening questions, create space for discovery, normalize not-knowing'
  },

  mirror: {
    tone: 'reflective, clear, honest',
    openings: [
      "I notice something in what you're saying...",
      "Let me reflect back what I'm hearing...",
      "There's a pattern that seems important here..."
    ],
    approach: 'Reflect accurately, name patterns, offer gentle reframes without fixing'
  },

  mender: {
    tone: 'tender, warm, healing',
    openings: [
      "I can feel the tenderness in what you're carrying...",
      "This sounds like a tender place...",
      "There's real hurt here, and that matters..."
    ],
    approach: 'Acknowledge pain without rushing to fix, offer presence, validate feelings'
  },

  librarian: {
    tone: 'grounded, connecting, remembering',
    openings: [
      "This reminds me of something you've shared before...",
      "I notice a thread connecting to your earlier experiences...",
      "Your history holds wisdom here..."
    ],
    approach: 'Connect to past conversations, highlight growth, honor the journey'
  },

  conductor: {
    tone: 'clear, organizing, structured',
    openings: [
      "Let's bring some clarity to this...",
      "I can help organize what you're working with...",
      "There are several threads here we can untangle..."
    ],
    approach: 'Help organize thoughts, create structure, break down complexity'
  },

  companion: {
    tone: 'warm, present, connected',
    openings: [
      "I'm right here with you...",
      "You're not alone in this...",
      "I'm so glad you're sharing this with me..."
    ],
    approach: 'Emphasize presence, share in experience, offer warmth'
  },

  guardian: {
    tone: 'protective, affirming, boundaried',
    openings: [
      "Your 'no' is important here...",
      "It sounds like you're protecting something valuable...",
      "Let's honor what you need to keep safe..."
    ],
    approach: 'Affirm boundaries, validate protection, support sovereignty'
  },

  flamebearer: {
    tone: 'energizing, purposeful, igniting',
    openings: [
      "There's real fire in what you're feeling...",
      "I can sense the drive behind this...",
      "Something important is calling you forward..."
    ],
    approach: 'Channel energy, clarify purpose, encourage action'
  },

  guide: {
    tone: 'wise, integrating, encompassing',
    openings: [
      "I see how these pieces fit together...",
      "There's a larger picture emerging here...",
      "Let's step back and see the whole..."
    ],
    approach: 'Synthesize perspectives, offer wisdom, integrate polarities'
  }
};

/**
 * Main ArchetypeDetector class
 */
export class ArchetypeDetector {
  constructor() {
    this.signalExtractor = new SignalExtractor();
    this.weights = ARCHETYPE_WEIGHTS;
    this.styles = ARCHETYPE_STYLES;
    this.history = []; // Track recent detections for context
    this.historyLimit = 5;
  }

  /**
   * Detect archetype from user message
   * @param {string} message - User message to analyze
   * @param {Object} options - Optional configuration
   * @returns {Object} Detection result with archetype, scores, and reasoning
   */
  detect(message, options = {}) {
    const {
      includeSecondary = true,
      includeSignals = false,
      contextMessages = [],
      voiceEmotions = null // For congruence checking
    } = options;

    // Extract signals from message
    const signals = this.signalExtractor.extractSignals(message);

    // Calculate archetype scores
    const scores = this.calculateArchetypeScores(signals);

    // Determine primary and secondary archetypes
    const ranked = this.rankArchetypes(scores);
    const primary = ranked[0];
    const secondary = includeSecondary && ranked.length > 1 ? ranked[1] : null;

    // Generate reasoning
    const reasoning = this.generateReasoning(signals, primary, secondary);

    // Calculate confidence
    const confidence = this.calculateConfidence(scores, primary.archetype);

    // Build result
    const result = {
      archetype: primary.archetype,
      score: primary.score,
      confidence,
      style: this.styles[primary.archetype],
      visual: {
        color: ARCHETYPE_COLORS[primary.archetype],
        icon: ARCHETYPE_ICONS[primary.archetype],
        name: ARCHETYPE_NAMES[primary.archetype],
        description: ARCHETYPE_DESCRIPTIONS[primary.archetype]
      },
      reasoning,
      allScores: scores,
      detectedAt: new Date().toISOString()
    };

    // Add secondary if requested
    if (secondary) {
      result.secondary = {
        archetype: secondary.archetype,
        score: secondary.score,
        style: this.styles[secondary.archetype],
        visual: {
          color: ARCHETYPE_COLORS[secondary.archetype],
          icon: ARCHETYPE_ICONS[secondary.archetype],
          name: ARCHETYPE_NAMES[secondary.archetype],
          description: ARCHETYPE_DESCRIPTIONS[secondary.archetype]
        }
      };
    }

    // Add signals if requested
    if (includeSignals) {
      result.signals = signals;
    }

    // Add voice congruence if available
    if (voiceEmotions) {
      result.congruence = this.checkVoiceCongruence(signals, voiceEmotions);
    }

    // Update history
    this.updateHistory(result);

    return result;
  }

  /**
   * Calculate scores for all archetypes based on signals
   */
  calculateArchetypeScores(signals) {
    const scores = {};

    for (const [archetype, weights] of Object.entries(this.weights)) {
      let score = 0;

      for (const [signal, weight] of Object.entries(weights)) {
        let signalValue = 0;

        // Handle nested signals (like questionTypes_why)
        if (signal.includes('_') && signal.startsWith('questionTypes')) {
          const questionType = signal.split('_')[1];
          signalValue = signals.questionTypes?.[questionType] || 0;
        } else {
          signalValue = signals[signal] || 0;
        }

        // Handle boolean signals
        if (typeof signalValue === 'boolean') {
          signalValue = signalValue ? 1 : 0;
        }

        // Handle normalized signals (-1 to 1)
        if (signal === 'intensity' || signal === 'agencyLevel' ||
            signal === 'valence' || signal === 'temporalFocus') {
          // These are already normalized, use as is
          score += signalValue * weight;
        } else {
          // Count signals - normalize by applying diminishing returns
          const normalizedValue = Math.log1p(signalValue);
          score += normalizedValue * weight;
        }
      }

      scores[archetype] = score;
    }

    return scores;
  }

  /**
   * Rank archetypes by score
   */
  rankArchetypes(scores) {
    return Object.entries(scores)
      .map(([archetype, score]) => ({ archetype, score }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate confidence level (0-1)
   */
  calculateConfidence(scores, topArchetype) {
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    const topScore = sortedScores[0];
    const secondScore = sortedScores[1] || 0;

    // Base confidence on separation between top two
    if (topScore <= 0) return 0.1; // Very low confidence

    const separation = (topScore - secondScore) / topScore;
    const magnitudeBonus = Math.min(0.3, topScore / 10);

    return Math.min(1, Math.max(0.1, separation + magnitudeBonus));
  }

  /**
   * Generate reasoning for the archetype choice
   */
  generateReasoning(signals, primary, secondary) {
    const reasons = [];
    const archetype = primary.archetype;

    // Analyze key contributing signals
    if (archetype === 'mender' && signals.pain > 0) {
      reasons.push(`Detected pain indicators (${signals.pain} instances)`);
    }
    if (archetype === 'mender' && signals.sadness > 0) {
      reasons.push(`Sadness signals present (${signals.sadness} instances)`);
    }
    if (archetype === 'seed' && signals.uncertainty > 0) {
      reasons.push(`Uncertainty expressed (${signals.uncertainty} instances)`);
    }
    if (archetype === 'seed' && signals.hasOpenQuestions) {
      reasons.push('Open-ended questions detected');
    }
    if (archetype === 'mirror' && signals.metaCognitive > 0) {
      reasons.push(`Meta-cognitive awareness (${signals.metaCognitive} instances)`);
    }
    if (archetype === 'librarian' && signals.pastFocus > 0) {
      reasons.push(`Past-focused language (${signals.pastFocus} instances)`);
    }
    if (archetype === 'conductor' && signals.analytical > 0) {
      reasons.push(`Analytical thinking patterns (${signals.analytical} instances)`);
    }
    if (archetype === 'companion' && signals.connection > 0) {
      reasons.push(`Connection-seeking language (${signals.connection} instances)`);
    }
    if (archetype === 'guardian' && signals.boundary > 0) {
      reasons.push(`Boundary language detected (${signals.boundary} instances)`);
    }
    if (archetype === 'flamebearer' && signals.purpose > 0) {
      reasons.push(`Purpose-driven language (${signals.purpose} instances)`);
    }
    if (archetype === 'guide' && signals.integration > 0) {
      reasons.push(`Integration thinking (${signals.integration} instances)`);
    }

    // Add emotional context
    if (signals.dominantEmotion !== 'neutral') {
      reasons.push(`Dominant emotion: ${signals.dominantEmotion}`);
    }

    // Add intensity context
    if (signals.emotionalIntensity > 0.5) {
      reasons.push('High emotional intensity detected');
    }

    // Add agency context
    if (signals.agencyLevel < -0.3) {
      reasons.push('Low agency language detected');
    } else if (signals.agencyLevel > 0.3) {
      reasons.push('High agency language detected');
    }

    return {
      summary: `${ARCHETYPE_NAMES[archetype]} archetype recommended based on ${reasons.length} key indicators`,
      details: reasons,
      signalHighlights: {
        emotionalIntensity: signals.emotionalIntensity,
        cognitiveComplexity: signals.cognitiveComplexity,
        relationalOpenness: signals.relationalOpenness,
        dominantEmotion: signals.dominantEmotion,
        agencyLevel: signals.agencyLevel
      }
    };
  }

  /**
   * Check congruence between text signals and voice emotions
   */
  checkVoiceCongruence(textSignals, voiceEmotions) {
    // Map voice emotions to text signal equivalents
    const congruenceChecks = [];

    // Check sadness congruence
    if (voiceEmotions.sadness > 0.5 && textSignals.sadness === 0) {
      congruenceChecks.push({
        type: 'sadness',
        voice: voiceEmotions.sadness,
        text: textSignals.sadness,
        congruent: false,
        note: 'Voice indicates sadness not expressed in text'
      });
    }

    // Check anger congruence
    if (voiceEmotions.anger > 0.5 && textSignals.anger === 0) {
      congruenceChecks.push({
        type: 'anger',
        voice: voiceEmotions.anger,
        text: textSignals.anger,
        congruent: false,
        note: 'Voice indicates anger not expressed in text'
      });
    }

    // Check fear/anxiety congruence
    if (voiceEmotions.fear > 0.5 && textSignals.fear === 0) {
      congruenceChecks.push({
        type: 'fear',
        voice: voiceEmotions.fear,
        text: textSignals.fear,
        congruent: false,
        note: 'Voice indicates fear not expressed in text'
      });
    }

    // Check joy congruence
    if (voiceEmotions.joy > 0.5 && textSignals.joy === 0) {
      congruenceChecks.push({
        type: 'joy',
        voice: voiceEmotions.joy,
        text: textSignals.joy,
        congruent: false,
        note: 'Voice indicates joy not expressed in text'
      });
    }

    // Calculate overall congruence score
    const totalChecks = congruenceChecks.length;
    const incongruent = congruenceChecks.filter(c => !c.congruent).length;
    const congruenceScore = totalChecks > 0 ? 1 - (incongruent / totalChecks) : 1;

    return {
      isCongruent: congruenceScore >= 0.7,
      score: congruenceScore,
      checks: congruenceChecks,
      recommendation: congruenceScore < 0.5
        ? 'Consider addressing emotions detected in voice but not expressed in words'
        : null
    };
  }

  /**
   * Update detection history
   */
  updateHistory(detection) {
    this.history.push({
      archetype: detection.archetype,
      confidence: detection.confidence,
      timestamp: detection.detectedAt
    });

    // Keep only recent history
    if (this.history.length > this.historyLimit) {
      this.history.shift();
    }
  }

  /**
   * Get archetype trends from history
   */
  getArchetypeTrends() {
    if (this.history.length < 2) return null;

    const counts = {};
    for (const entry of this.history) {
      counts[entry.archetype] = (counts[entry.archetype] || 0) + 1;
    }

    const dominant = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      dominantArchetype: dominant[0],
      frequency: dominant[1] / this.history.length,
      history: this.history
    };
  }

  /**
   * Get suggested response opening based on archetype
   */
  getSuggestedOpening(archetype) {
    const style = this.styles[archetype];
    if (!style || !style.openings) return null;

    // Randomly select an opening
    const index = Math.floor(Math.random() * style.openings.length);
    return style.openings[index];
  }

  /**
   * Get full archetype guidance for Luna
   */
  getArchetypeGuidance(archetype) {
    const style = this.styles[archetype];
    if (!style) return null;

    return {
      archetype,
      name: ARCHETYPE_NAMES[archetype],
      icon: ARCHETYPE_ICONS[archetype],
      color: ARCHETYPE_COLORS[archetype],
      tone: style.tone,
      approach: style.approach,
      suggestedOpening: this.getSuggestedOpening(archetype),
      description: ARCHETYPE_DESCRIPTIONS[archetype]
    };
  }
}

// Export singleton instance
export const archetypeDetector = new ArchetypeDetector();

// Export convenience function
export function detectArchetype(message, options = {}) {
  return archetypeDetector.detect(message, options);
}

// Export guidance function
export function getArchetypeGuidance(archetype) {
  return archetypeDetector.getArchetypeGuidance(archetype);
}
