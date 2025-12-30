/**
 * ============================================================================
 * GENESIS CONGRUENCE SERVICE
 * ============================================================================
 *
 * Validates emotional congruence between voice (SER) and text analysis.
 * Detects when spoken emotion differs from written/transcribed content.
 *
 * This service bridges:
 * - Voice SER emotions (7 emotions from prosody analysis)
 * - Text signals (emotions detected from word patterns)
 *
 * Congruence indicates authentic expression.
 * Incongruence may indicate:
 * - Suppressed emotions
 * - Difficulty expressing feelings verbally
 * - Complex emotional states
 * - Need for gentle exploration
 *
 * Part of: GENESIS Archetype Detection System
 * Created: December 29, 2024
 * ============================================================================
 */

import { SignalExtractor, extractSignals } from './signalExtractor.js';

/**
 * Emotion mapping between voice SER and text signals
 * Voice SER uses: anger, disgust, fear, happy, neutral, sad, surprise
 * Text signals use: anger, fear, sadness, joy (plus pain, growth, etc.)
 */
const EMOTION_MAPPINGS = {
  // Voice emotion -> Text signal mappings
  voice_to_text: {
    anger: ['anger'],
    disgust: ['anger'],  // Maps to anger family
    fear: ['fear'],
    happy: ['joy'],
    sad: ['sadness', 'pain'],
    surprise: ['joy', 'fear'],  // Can be positive or negative surprise
    neutral: []
  },

  // Text signal -> Voice emotion mappings
  text_to_voice: {
    anger: ['anger', 'disgust'],
    fear: ['fear', 'surprise'],
    sadness: ['sad'],
    joy: ['happy', 'surprise'],
    pain: ['sad'],
    growth: ['happy'],  // Growth often has positive affect
    connection: ['happy'],
    boundary: ['anger']  // Setting boundaries can involve firm affect
  }
};

/**
 * Congruence thresholds
 */
const THRESHOLDS = {
  voiceEmotionSignificant: 0.4,  // Voice emotion considered significant
  textEmotionSignificant: 1,     // Text must have at least 1 word match
  congruenceHigh: 0.8,           // High congruence score
  congruenceMedium: 0.5,         // Medium congruence
  congruenceLow: 0.3             // Low congruence (notable incongruence)
};

/**
 * CongruenceService class
 */
export class CongruenceService {
  constructor() {
    this.signalExtractor = new SignalExtractor();
    this.mappings = EMOTION_MAPPINGS;
    this.thresholds = THRESHOLDS;
    this.history = [];
    this.historyLimit = 10;
  }

  /**
   * Analyze congruence between voice emotions and text
   * @param {Object} voiceEmotions - SER output { anger: 0.1, sad: 0.7, ... }
   * @param {string} text - Transcribed or typed message
   * @returns {Object} Congruence analysis result
   */
  analyzeCongruence(voiceEmotions, text) {
    // Extract text signals
    const textSignals = this.signalExtractor.extractSignals(text);

    // Get significant voice emotions
    const significantVoice = this.getSignificantVoiceEmotions(voiceEmotions);

    // Get significant text emotions
    const significantText = this.getSignificantTextEmotions(textSignals);

    // Check congruence for each significant voice emotion
    const checks = this.performCongruenceChecks(significantVoice, significantText);

    // Calculate overall congruence score
    const overallScore = this.calculateOverallScore(checks);

    // Generate insights
    const insights = this.generateInsights(checks, overallScore, voiceEmotions, textSignals);

    // Determine recommended approach
    const recommendation = this.getRecommendation(overallScore, checks);

    const result = {
      isCongruent: overallScore >= this.thresholds.congruenceMedium,
      congruenceLevel: this.categorizeCongruence(overallScore),
      score: overallScore,
      voiceEmotions: significantVoice,
      textEmotions: significantText,
      checks,
      insights,
      recommendation,
      analyzedAt: new Date().toISOString()
    };

    // Store in history
    this.updateHistory(result);

    return result;
  }

  /**
   * Get voice emotions above significance threshold
   */
  getSignificantVoiceEmotions(voiceEmotions) {
    if (!voiceEmotions) return {};

    const significant = {};
    for (const [emotion, value] of Object.entries(voiceEmotions)) {
      if (emotion !== 'neutral' && value >= this.thresholds.voiceEmotionSignificant) {
        significant[emotion] = value;
      }
    }
    return significant;
  }

  /**
   * Get text emotions with significant word matches
   */
  getSignificantTextEmotions(textSignals) {
    const emotions = {
      anger: textSignals.anger || 0,
      fear: textSignals.fear || 0,
      sadness: textSignals.sadness || 0,
      joy: textSignals.joy || 0,
      pain: textSignals.pain || 0,
      growth: textSignals.growth || 0,
      connection: textSignals.connection || 0,
      boundary: textSignals.boundary || 0
    };

    const significant = {};
    for (const [emotion, count] of Object.entries(emotions)) {
      if (count >= this.thresholds.textEmotionSignificant) {
        significant[emotion] = count;
      }
    }
    return significant;
  }

  /**
   * Perform congruence checks between voice and text
   */
  performCongruenceChecks(voiceEmotions, textEmotions) {
    const checks = [];

    // Check each significant voice emotion
    for (const [voiceEmotion, voiceValue] of Object.entries(voiceEmotions)) {
      const expectedTextEmotions = this.mappings.voice_to_text[voiceEmotion] || [];

      // Check if any expected text emotion is present
      let foundMatch = false;
      let matchingTextEmotions = [];

      for (const textEmotion of expectedTextEmotions) {
        if (textEmotions[textEmotion]) {
          foundMatch = true;
          matchingTextEmotions.push({
            emotion: textEmotion,
            count: textEmotions[textEmotion]
          });
        }
      }

      checks.push({
        voiceEmotion,
        voiceIntensity: voiceValue,
        expectedInText: expectedTextEmotions,
        foundInText: matchingTextEmotions,
        isCongruent: foundMatch,
        type: foundMatch ? 'matched' : 'voice_only'
      });
    }

    // Check for text emotions without voice correlation
    for (const [textEmotion, count] of Object.entries(textEmotions)) {
      const expectedVoice = this.mappings.text_to_voice[textEmotion] || [];

      // Check if this text emotion has voice support
      let hasVoiceSupport = false;
      for (const voiceEmotion of expectedVoice) {
        if (voiceEmotions[voiceEmotion]) {
          hasVoiceSupport = true;
          break;
        }
      }

      // Only add if not already covered and no voice support
      if (!hasVoiceSupport && count > 0) {
        const alreadyCovered = checks.some(c =>
          c.foundInText.some(f => f.emotion === textEmotion)
        );

        if (!alreadyCovered) {
          checks.push({
            textEmotion,
            textCount: count,
            expectedInVoice: expectedVoice,
            isCongruent: false,
            type: 'text_only'
          });
        }
      }
    }

    return checks;
  }

  /**
   * Calculate overall congruence score
   */
  calculateOverallScore(checks) {
    if (checks.length === 0) return 1; // No emotions to check = congruent

    const matchedChecks = checks.filter(c => c.isCongruent);
    const baseScore = matchedChecks.length / checks.length;

    // Weight by intensity for voice emotions
    let weightedScore = 0;
    let totalWeight = 0;

    for (const check of checks) {
      const weight = check.voiceIntensity || 0.5;
      totalWeight += weight;
      if (check.isCongruent) {
        weightedScore += weight;
      }
    }

    const weighted = totalWeight > 0 ? weightedScore / totalWeight : baseScore;

    // Average base and weighted scores
    return (baseScore + weighted) / 2;
  }

  /**
   * Categorize congruence level
   */
  categorizeCongruence(score) {
    if (score >= this.thresholds.congruenceHigh) return 'high';
    if (score >= this.thresholds.congruenceMedium) return 'medium';
    if (score >= this.thresholds.congruenceLow) return 'low';
    return 'very_low';
  }

  /**
   * Generate insights from congruence analysis
   */
  generateInsights(checks, score, voiceEmotions, textSignals) {
    const insights = [];

    // Voice-only emotions (not expressed in words)
    const voiceOnly = checks.filter(c => c.type === 'voice_only');
    if (voiceOnly.length > 0) {
      const emotions = voiceOnly.map(c => c.voiceEmotion).join(', ');
      insights.push({
        type: 'voice_unexpressed',
        severity: 'notable',
        message: `Voice reveals ${emotions} that wasn't expressed in words`,
        emotions: voiceOnly.map(c => ({
          emotion: c.voiceEmotion,
          intensity: c.voiceIntensity
        })),
        suggestion: 'Consider gently acknowledging the emotional undertone'
      });
    }

    // Text-only emotions (not reflected in voice)
    const textOnly = checks.filter(c => c.type === 'text_only');
    if (textOnly.length > 0) {
      const emotions = textOnly.map(c => c.textEmotion).join(', ');
      insights.push({
        type: 'text_unvoiced',
        severity: 'minor',
        message: `Words express ${emotions} not reflected in vocal tone`,
        emotions: textOnly.map(c => ({
          emotion: c.textEmotion,
          count: c.textCount
        })),
        suggestion: 'The person may be processing intellectually more than emotionally'
      });
    }

    // Strong incongruence detection
    if (score < this.thresholds.congruenceLow) {
      insights.push({
        type: 'strong_incongruence',
        severity: 'significant',
        message: 'Significant gap between spoken emotion and word content',
        suggestion: 'Approach with extra care - there may be difficulty expressing feelings'
      });
    }

    // Suppression pattern detection
    const hasStrongVoiceEmotion = voiceEmotions ? Object.values(voiceEmotions).some(v => v > 0.7) : false;
    const hasLowTextEmotion = Object.values({
      joy: textSignals.joy,
      anger: textSignals.anger,
      fear: textSignals.fear,
      sadness: textSignals.sadness
    }).every(v => v < 2);

    if (hasStrongVoiceEmotion && hasLowTextEmotion) {
      insights.push({
        type: 'possible_suppression',
        severity: 'notable',
        message: 'Strong voice emotion with minimal emotional words may indicate suppression',
        suggestion: 'Create safe space for emotional expression'
      });
    }

    return insights;
  }

  /**
   * Get recommendation based on congruence
   */
  getRecommendation(score, checks) {
    const voiceOnly = checks.filter(c => c.type === 'voice_only');

    if (score >= this.thresholds.congruenceHigh) {
      return {
        approach: 'direct',
        message: 'Expression is congruent - respond to stated content',
        archetypeHint: null
      };
    }

    if (voiceOnly.length > 0) {
      const dominantVoice = voiceOnly.reduce((max, c) =>
        c.voiceIntensity > (max?.voiceIntensity || 0) ? c : max
      , null);

      if (dominantVoice) {
        const archetypeHints = {
          sad: 'mender',
          anger: 'guardian',
          fear: 'companion',
          happy: 'companion',
          disgust: 'guardian',
          surprise: 'seed'
        };

        return {
          approach: 'acknowledge_undertone',
          message: `Voice reveals ${dominantVoice.voiceEmotion} - consider acknowledging`,
          archetypeHint: archetypeHints[dominantVoice.voiceEmotion] || 'mirror',
          voiceEmotion: dominantVoice.voiceEmotion,
          intensity: dominantVoice.voiceIntensity
        };
      }
    }

    return {
      approach: 'gentle_inquiry',
      message: 'Some incongruence detected - use gentle, open approach',
      archetypeHint: 'mirror'
    };
  }

  /**
   * Update history
   */
  updateHistory(result) {
    this.history.push({
      score: result.score,
      level: result.congruenceLevel,
      voiceEmotions: Object.keys(result.voiceEmotions),
      textEmotions: Object.keys(result.textEmotions),
      timestamp: result.analyzedAt
    });

    if (this.history.length > this.historyLimit) {
      this.history.shift();
    }
  }

  /**
   * Get congruence trends over recent history
   */
  getCongruenceTrends() {
    if (this.history.length < 2) return null;

    const scores = this.history.map(h => h.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const trend = scores[scores.length - 1] - scores[0];

    return {
      averageCongruence: average,
      trend: trend > 0.1 ? 'increasing' : trend < -0.1 ? 'decreasing' : 'stable',
      historicalLevels: this.history.map(h => h.level),
      recentScore: scores[scores.length - 1]
    };
  }

  /**
   * Quick congruence check (simplified)
   */
  quickCheck(voiceEmotions, text) {
    const result = this.analyzeCongruence(voiceEmotions, text);
    return {
      isCongruent: result.isCongruent,
      score: result.score,
      level: result.congruenceLevel,
      primaryInsight: result.insights[0] || null
    };
  }
}

// Export singleton instance
export const congruenceService = new CongruenceService();

// Export convenience functions
export function analyzeCongruence(voiceEmotions, text) {
  return congruenceService.analyzeCongruence(voiceEmotions, text);
}

export function quickCongruenceCheck(voiceEmotions, text) {
  return congruenceService.quickCheck(voiceEmotions, text);
}
