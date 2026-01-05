/**
 * ============================================================================
 * RECOMMENDATION ENGINE
 * ============================================================================
 * Suggests best approach based on learned patterns.
 * Uses vector similarity to find matching patterns.
 *
 * Key Features:
 * - Vector similarity search for pattern matching
 * - Confidence-weighted recommendations
 * - Fallback to constitutional heuristics
 * - Approach rankings display
 *
 * Created: December 31, 2025
 * Week 7: Pattern Learning - Phase 2 Week 3
 * ============================================================================
 */

class RecommendationEngine {

  constructor() {
    // Minimum similarity for high-confidence recommendation
    this.highSimilarityThreshold = 0.8;
  }

  /**
   * Get recommendation for current user state
   * @param {string} userId - User ID
   * @param {Object} currentState - Current user state
   * @returns {Object} Recommendation with confidence
   */
  async getRecommendation(userId, currentState) {
    // Create state vector for current state
    const PatternRecorder = require('./patternRecorder');
    const recorder = new PatternRecorder();
    const currentStateVector = recorder.createStateVector(currentState);

    try {
      const db = require('../config/genesisDatabase');

      // Find similar learned patterns using vector similarity
      const similar = await db.query(`
        SELECT
          id,
          user_state_signature,
          approach_rankings,
          recommended_approach,
          avoid_approaches,
          confidence,
          sample_size,
          1 - (user_state_vector <=> $2::vector) as similarity
        FROM luna_learned_patterns
        WHERE user_id = $1
        ORDER BY user_state_vector <=> $2::vector
        LIMIT 5
      `, [userId, `[${currentStateVector.join(',')}]`]);

      if (similar.rows.length === 0) {
        return {
          recommendation: null,
          reason: 'No learned patterns yet',
          confidence: 'NONE',
          fallback: this.getFallbackRecommendation(currentState)
        };
      }

      // Take most similar pattern
      const bestMatch = similar.rows[0];

      // Parse JSON fields
      const approachRankings = typeof bestMatch.approach_rankings === 'string'
        ? JSON.parse(bestMatch.approach_rankings)
        : bestMatch.approach_rankings;

      const signature = typeof bestMatch.user_state_signature === 'string'
        ? JSON.parse(bestMatch.user_state_signature)
        : bestMatch.user_state_signature;

      const avoidApproaches = bestMatch.avoid_approaches || [];

      // Check if similarity is high enough (>0.8)
      if (bestMatch.similarity < this.highSimilarityThreshold) {
        return {
          recommendation: bestMatch.recommended_approach,
          reason: 'Moderate similarity to learned pattern',
          confidence: 'LOW',
          similarity: bestMatch.similarity,
          patternSignature: signature,
          approachRankings: approachRankings
        };
      }

      return {
        recommendation: bestMatch.recommended_approach,
        reason: 'High similarity to learned pattern',
        confidence: bestMatch.confidence,
        similarity: bestMatch.similarity,
        patternSignature: signature,
        approachRankings: approachRankings,
        avoidApproaches: avoidApproaches,
        sampleSize: bestMatch.sample_size
      };
    } catch (error) {
      console.log('[RecommendationEngine] Database not available, using fallback');
      return {
        recommendation: null,
        reason: 'Database not available',
        confidence: 'NONE',
        fallback: this.getFallbackRecommendation(currentState)
      };
    }
  }

  /**
   * Get fallback recommendation when no patterns exist
   * Uses constitutional heuristics from Five Elements
   * @param {Object} currentState - Current user state
   * @returns {Object} Fallback recommendation
   */
  getFallbackRecommendation(currentState) {
    // Use constitutional heuristics
    const elementBalance = currentState.elementBalance || {};
    const bathtubState = currentState.bathtub?.state || 'CONTENT';

    // Fire-deficient (low joy) → prioritize connection
    if (elementBalance.Fire !== undefined && elementBalance.Fire < 15) {
      return {
        approach: 'connection',
        reason: 'Fire deficiency suggests connection focus',
        heuristic: 'constitutional'
      };
    }

    // Wood-excess (high anger/stress) → prioritize achievement
    if (elementBalance.Wood !== undefined && elementBalance.Wood > 30) {
      return {
        approach: 'achievement',
        reason: 'Wood excess suggests achievement focus',
        heuristic: 'constitutional'
      };
    }

    // Water-excess (high fear) → prioritize delight
    if (elementBalance.Water !== undefined && elementBalance.Water > 30) {
      return {
        approach: 'delight',
        reason: 'Water excess suggests delight focus',
        heuristic: 'constitutional'
      };
    }

    // SAD or worse → prioritize connection (emotional support)
    if (['SAD', 'VERY_SAD', 'DEPRESSED'].includes(bathtubState)) {
      return {
        approach: 'connection',
        reason: 'Emotional state suggests connection support',
        heuristic: 'bathtub'
      };
    }

    // Default: balanced 3-stack
    return {
      approach: '3-stack',
      reason: 'Balanced approach for stable state',
      heuristic: 'default'
    };
  }

  /**
   * Get approach rankings for display
   * @param {string} userId - User ID
   * @param {Object} currentState - Current user state
   * @returns {Object} Approach rankings
   */
  async getApproachRankings(userId, currentState) {
    const recommendation = await this.getRecommendation(userId, currentState);

    if (!recommendation.approachRankings) {
      return {
        rankings: [],
        message: 'No rankings available yet'
      };
    }

    return {
      rankings: recommendation.approachRankings,
      recommended: recommendation.recommendation,
      confidence: recommendation.confidence
    };
  }

  /**
   * Get approaches to avoid for current state
   * @param {string} userId - User ID
   * @param {Object} currentState - Current user state
   * @returns {Array} List of approaches to avoid
   */
  async getApproachesToAvoid(userId, currentState) {
    const recommendation = await this.getRecommendation(userId, currentState);

    if (!recommendation.avoidApproaches) {
      return [];
    }

    return recommendation.avoidApproaches;
  }

  /**
   * Get detailed breakdown of why an approach is recommended
   * @param {string} userId - User ID
   * @param {Object} currentState - Current user state
   * @returns {Object} Detailed recommendation breakdown
   */
  async getRecommendationBreakdown(userId, currentState) {
    const recommendation = await this.getRecommendation(userId, currentState);

    const breakdown = {
      recommendation: recommendation.recommendation,
      confidence: recommendation.confidence,
      reason: recommendation.reason,
      dataSource: recommendation.confidence === 'NONE' ? 'heuristic' : 'learned',
      details: {}
    };

    if (recommendation.approachRankings) {
      breakdown.details.rankings = recommendation.approachRankings.map(r => ({
        approach: r.approachType,
        effectiveness: r.avgEffectiveness,
        sampleSize: r.sampleSize,
        confidence: r.confidence,
        successRate: r.successRate
      }));
    }

    if (recommendation.patternSignature) {
      breakdown.details.matchedState = recommendation.patternSignature.description;
      breakdown.details.similarity = recommendation.similarity;
    }

    if (recommendation.fallback) {
      breakdown.details.fallbackReason = recommendation.fallback.reason;
      breakdown.details.heuristicUsed = recommendation.fallback.heuristic;
    }

    return breakdown;
  }
}

module.exports = RecommendationEngine;
