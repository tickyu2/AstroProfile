/**
 * ============================================================================
 * EFFECTIVENESS CALCULATOR
 * ============================================================================
 * Converts user response to effectiveness score (0-1).
 *
 * Components:
 * - Response sentiment (positive/neutral/negative)
 * - State improvement (concentration drop)
 * - Emotional shift (positive emotions in response)
 * - Engagement level (message length, follow-ups)
 *
 * Verdicts:
 * - WORKED (0.7+): Intervention was effective
 * - NEUTRAL (0.4-0.7): Moderate effectiveness
 * - FAILED (<0.4): Intervention didn't work
 *
 * Created: December 31, 2025
 * Week 6: Effectiveness Feedback Loop - Phase 2 Week 2
 * ============================================================================
 */

class EffectivenessCalculator {
  constructor() {
    // Component weights (must sum to ~1.0 for max effectiveness)
    this.weights = {
      sentiment: 0.30,     // Response sentiment contribution
      stateChange: 0.30,   // State improvement contribution
      emotionalShift: 0.20, // Emotional shift contribution
      engagement: 0.20     // Engagement contribution
    };

    // Verdict thresholds
    this.thresholds = {
      worked: 0.7,
      neutral: 0.4
    };

    // State progression for measuring improvement
    this.stateProgression = [
      'DEPRESSED',  // Worst
      'VERY_SAD',
      'SAD',
      'CONTENT',
      'HAPPY',
      'THRIVING'   // Best
    ];
  }

  /**
   * Calculate effectiveness from response data
   * @param {Object} responseData - Multi-modal response from ResponseDetector
   * @param {Object} beforeState - State before intervention
   * @param {Object} afterState - State after intervention
   * @returns {Object} Effectiveness result
   */
  calculateEffectiveness(responseData, beforeState, afterState) {
    let effectiveness = 0.5; // Baseline (neutral starting point)

    // Component 1: Response sentiment (-0.3 to +0.3)
    const sentimentScore = this.scoreSentiment(responseData.overall);
    effectiveness += sentimentScore;

    // Component 2: State improvement (0 to +0.3)
    const stateScore = this.scoreStateChange(beforeState, afterState);
    effectiveness += stateScore;

    // Component 3: Emotional shift (0 to +0.2)
    const emotionalScore = this.scoreEmotionalShift(responseData);
    effectiveness += emotionalScore;

    // Component 4: Engagement (0 to +0.2)
    const engagementScore = this.scoreEngagement(responseData);
    effectiveness += engagementScore;

    // Normalize to 0-1
    effectiveness = Math.max(0, Math.min(1, effectiveness));

    // Determine verdict
    const verdict = this.determineVerdict(effectiveness);

    // Calculate confidence (based on available data sources)
    const confidence = this.calculateConfidence(responseData);

    return {
      score: effectiveness,
      confidence: confidence,
      verdict: verdict,
      breakdown: {
        sentiment: sentimentScore,
        stateChange: stateScore,
        emotionalShift: emotionalScore,
        engagement: engagementScore
      },
      thresholds: {
        worked: this.thresholds.worked,
        neutral: this.thresholds.neutral
      }
    };
  }

  /**
   * Score response sentiment (-0.3 to +0.3)
   */
  scoreSentiment(overallResponse) {
    const typeScores = {
      'positive': 0.3,
      'neutral': 0,
      'negative': -0.3
    };

    const baseScore = typeScores[overallResponse.responseType] || 0;

    // Weight by confidence
    return baseScore * (overallResponse.confidence || 0.5);
  }

  /**
   * Score state improvement (0 to +0.3)
   */
  scoreStateChange(beforeState, afterState) {
    if (!beforeState || !afterState) return 0;

    // Method 1: Concentration-based improvement
    let score = 0;

    if (beforeState.concentration !== undefined && afterState.concentration !== undefined) {
      const concentrationDrop = beforeState.concentration - afterState.concentration;

      // More drop = better effectiveness
      // 10% drop = 0.3 score (max for this component)
      score = Math.min(0.3, Math.max(-0.1, (concentrationDrop / 10) * 0.3));
    }

    // Method 2: State-based improvement (bonus)
    if (beforeState.state && afterState.state) {
      const beforeIndex = this.stateProgression.indexOf(beforeState.state);
      const afterIndex = this.stateProgression.indexOf(afterState.state);

      if (beforeIndex >= 0 && afterIndex >= 0) {
        const statesJumped = afterIndex - beforeIndex;
        // Each state improvement adds bonus
        score += statesJumped * 0.05;
      }
    }

    return Math.max(0, Math.min(0.3, score));
  }

  /**
   * Score emotional shift (0 to +0.2)
   */
  scoreEmotionalShift(responseData) {
    let score = 0;

    // Positive emotions list
    const positiveEmotions = ['joy', 'trust', 'surprise', 'anticipation'];
    const negativeEmotions = ['sadness', 'fear', 'anger', 'disgust'];

    // Text emotion contribution
    if (responseData.text) {
      const textEmotion = responseData.text.emotion;
      if (positiveEmotions.includes(textEmotion)) {
        score += 0.1;
      } else if (negativeEmotions.includes(textEmotion)) {
        score -= 0.05;
      }

      // High intensity positive emotion is extra good
      if (positiveEmotions.includes(textEmotion) && responseData.text.intensity > 6) {
        score += 0.05;
      }
    }

    // Voice emotion contribution
    if (responseData.voice) {
      const voiceEmotion = responseData.voice.emotion;
      if (positiveEmotions.includes(voiceEmotion)) {
        score += 0.1;
      } else if (negativeEmotions.includes(voiceEmotion)) {
        score -= 0.05;
      }
    }

    return Math.max(0, Math.min(0.2, score));
  }

  /**
   * Score engagement (0 to +0.2)
   */
  scoreEngagement(responseData) {
    let score = 0;

    // Text engagement
    if (responseData.text) {
      if (responseData.text.engagement > 0.7) {
        score += 0.1;
      } else if (responseData.text.engagement > 0.5) {
        score += 0.05;
      } else if (responseData.text.engagement < 0.3) {
        score -= 0.05;
      }

      // Questions indicate interest
      if (responseData.text.hasQuestion) {
        score += 0.03;
      }

      // Exclamations indicate emotion
      if (responseData.text.hasExclamation) {
        score += 0.02;
      }
    }

    // Behavior engagement
    if (responseData.behavior) {
      if (responseData.behavior.engagement > 0.7) {
        score += 0.1;
      } else if (responseData.behavior.engagement > 0.5) {
        score += 0.05;
      }

      // Follow-up indicates interest
      if (responseData.behavior.hasFollowUp) {
        score += 0.03;
      }

      // Quick response indicates engagement
      if (responseData.behavior.isQuickResponse) {
        score += 0.02;
      }
    }

    return Math.max(0, Math.min(0.2, score));
  }

  /**
   * Determine verdict from effectiveness score
   */
  determineVerdict(effectiveness) {
    if (effectiveness >= this.thresholds.worked) return 'WORKED';
    if (effectiveness >= this.thresholds.neutral) return 'NEUTRAL';
    return 'FAILED';
  }

  /**
   * Calculate confidence based on available data sources
   */
  calculateConfidence(responseData) {
    let confidence = 0.5; // Baseline with just text

    // More data sources = higher confidence
    if (responseData.voice) confidence += 0.25;
    if (responseData.behavior) confidence += 0.15;

    // High-confidence overall response
    if (responseData.overall && responseData.overall.confidence > 0.7) {
      confidence += 0.1;
    }

    return Math.min(1, confidence);
  }

  /**
   * Calculate comparative effectiveness
   * Compare two approaches for the same user state
   */
  compareApproaches(result1, result2) {
    const diff = result1.score - result2.score;

    return {
      winner: diff > 0.1 ? 'first' : diff < -0.1 ? 'second' : 'tie',
      difference: diff,
      first: result1,
      second: result2,
      recommendation: this.generateComparisonRecommendation(diff, result1, result2)
    };
  }

  /**
   * Generate recommendation from comparison
   */
  generateComparisonRecommendation(diff, result1, result2) {
    if (diff > 0.2) {
      return `First approach significantly more effective (${result1.score.toFixed(2)} vs ${result2.score.toFixed(2)}). Strongly prefer first.`;
    } else if (diff > 0.1) {
      return `First approach moderately more effective. Prefer first when possible.`;
    } else if (diff < -0.2) {
      return `Second approach significantly more effective. Strongly prefer second.`;
    } else if (diff < -0.1) {
      return `Second approach moderately more effective. Prefer second when possible.`;
    } else {
      return `Approaches have similar effectiveness. Either can be used.`;
    }
  }

  /**
   * Get effectiveness tier (for pattern matching)
   */
  getEffectivenessTier(score) {
    if (score >= 0.9) return 'EXCELLENT';
    if (score >= 0.7) return 'GOOD';
    if (score >= 0.5) return 'MODERATE';
    if (score >= 0.3) return 'POOR';
    return 'VERY_POOR';
  }

  /**
   * Calculate running average effectiveness
   */
  calculateRunningAverage(previousAverage, previousCount, newScore) {
    if (previousCount === 0) return newScore;

    return ((previousAverage * previousCount) + newScore) / (previousCount + 1);
  }
}

module.exports = EffectivenessCalculator;
