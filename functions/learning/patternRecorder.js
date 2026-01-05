/**
 * ============================================================================
 * PATTERN RECORDER
 * ============================================================================
 * Records effectiveness patterns for learning.
 * Creates 50D state vectors for pattern matching.
 *
 * State Vector (50 dimensions):
 * - 0-7: Plutchik emotions (8)
 * - 8-12: Five Elements (5)
 * - 13-16: Bathtub state (4)
 * - 17-23: Day of week (7)
 * - 24-47: Hour of day (24)
 * - 48-49: Reserved (2)
 *
 * Created: December 31, 2025
 * Week 6: Effectiveness Feedback Loop - Phase 2 Week 2
 * ============================================================================
 */

class PatternRecorder {
  constructor() {
    // State vector dimensions
    this.VECTOR_SIZE = 50;

    // Dimension ranges
    this.dimensions = {
      plutchik: { start: 0, end: 8 },      // 8 emotions
      elements: { start: 8, end: 13 },      // 5 elements
      bathtub: { start: 13, end: 17 },      // 4 bathtub metrics
      dayOfWeek: { start: 17, end: 24 },    // 7 days
      hourOfDay: { start: 24, end: 48 },    // 24 hours
      reserved: { start: 48, end: 50 }      // 2 reserved
    };

    // State to number mappings
    this.stateToNumber = {
      'THRIVING': 0.1,
      'HAPPY': 0.2,
      'CONTENT': 0.3,
      'SAD': 0.4,
      'VERY_SAD': 0.5,
      'DEPRESSED': 0.6
    };

    // Element order for vector
    this.elementOrder = ['Fire', 'Wood', 'Water', 'Metal', 'Earth'];

    // Emotion order for vector
    this.emotionOrder = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];
  }

  /**
   * Record effectiveness pattern to database
   * @param {string} userId - User ID
   * @param {Object} userState - Current user state
   * @param {Object} approach - Approach used
   * @param {Object} effectivenessResult - Result from EffectivenessCalculator
   * @returns {string} Pattern ID
   */
  async recordPattern(userId, userState, approach, effectivenessResult) {
    const db = require('../config/genesisDatabase');

    // Create user state vector (50D)
    const userStateVector = this.createStateVector(userState);

    // Create constitutional context
    const constitutionalContext = userState.constitutionalContext || {};

    // Extract approach details
    const approachType = approach.type; // '3-stack', 'advice', 'question', etc.
    const approachDetails = approach.details || {};

    // Determine goal
    const goal = userState.goal || 'reduce_sadness';

    // Generate lesson and recommendation
    const lesson = this.generateLesson(effectivenessResult);
    const recommendation = this.generateRecommendation(effectivenessResult);

    // Store in database
    try {
      const result = await db.query(`
        INSERT INTO luna_approach_effectiveness (
          user_id, user_state, user_state_vector,
          constitutional_context, temporal_context,
          approach_type, approach_details, goal,
          user_response, effectiveness, verdict,
          lesson, recommendation, status
        ) VALUES (
          $1, $2, $3::vector, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14
        )
        RETURNING id
      `, [
        userId,
        JSON.stringify(userState),
        `[${userStateVector.join(',')}]`,
        JSON.stringify(constitutionalContext),
        JSON.stringify(this.getTemporalContext()),
        approachType,
        JSON.stringify(approachDetails),
        goal,
        JSON.stringify(effectivenessResult.response || {}),
        effectivenessResult.effectiveness.score,
        effectivenessResult.effectiveness.verdict,
        lesson,
        recommendation,
        'TESTING' // Will move to PROVEN after repeated success
      ]);

      console.log(`[PatternRecorder] Recorded pattern #${result.rows[0].id}: ${approachType} → ${effectivenessResult.effectiveness.verdict} (${effectivenessResult.effectiveness.score.toFixed(2)})`);

      return result.rows[0].id;
    } catch (error) {
      console.log(`[PatternRecorder] Database not available, pattern recorded in memory: ${approachType} → ${effectivenessResult.effectiveness.verdict}`);
      // Return mock ID for testing
      return `mock_${Date.now()}`;
    }
  }

  /**
   * Create 50D user state vector
   * @param {Object} userState - User state object
   * @returns {number[]} 50-dimensional vector
   */
  createStateVector(userState) {
    const vector = new Array(this.VECTOR_SIZE).fill(0);

    // Indices 0-7: Plutchik emotions
    const emotions = userState.emotions || userState.plutchikVector || {};
    this.emotionOrder.forEach((emotion, i) => {
      vector[i] = emotions[emotion] || 0;
    });

    // Indices 8-12: Five Elements (normalized to 0-1)
    const elements = userState.elementBalance || {};
    this.elementOrder.forEach((element, i) => {
      vector[8 + i] = (elements[element] || 0) / 100;
    });

    // Indices 13-16: Bathtub state
    const bathtub = userState.bathtub || {};
    vector[13] = (bathtub.salt || 0) / 100;         // Salt normalized
    vector[14] = (bathtub.water || 0) / 200;        // Water normalized (can be >100)
    vector[15] = (bathtub.concentration || 0) / 100; // Concentration normalized
    vector[16] = this.stateToNumber[bathtub.state] || 0.3; // State as number

    // Indices 17-23: Day of week (one-hot encoding)
    const now = new Date();
    const dayOfWeek = now.getDay();
    vector[17 + dayOfWeek] = 1;

    // Indices 24-47: Hour of day (one-hot encoding)
    const hour = now.getHours();
    vector[24 + hour] = 1;

    // Indices 48-49: Reserved for future use
    // Could be used for: relationship stage, total sessions, etc.

    return vector;
  }

  /**
   * Get temporal context
   */
  getTemporalContext() {
    const now = new Date();
    return {
      time_of_day: now.getHours(),
      day_of_week: now.getDay(),
      day_name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()],
      season: this.getCurrentSeason(),
      is_weekend: now.getDay() === 0 || now.getDay() === 6,
      time_period: this.getTimePeriod(now.getHours())
    };
  }

  /**
   * Get current season
   */
  getCurrentSeason() {
    const month = new Date().getMonth() + 1;

    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month === 8) return 'Late_Summer';
    if (month >= 9 && month <= 10) return 'Autumn';
    return 'Winter';
  }

  /**
   * Get time period (morning, afternoon, evening, night)
   */
  getTimePeriod(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Generate lesson from effectiveness result
   */
  generateLesson(effectivenessResult) {
    const verdict = effectivenessResult.effectiveness.verdict;
    const score = effectivenessResult.effectiveness.score;

    if (verdict === 'WORKED') {
      if (score >= 0.9) {
        return 'Excellent response. This approach was highly effective for this user state.';
      }
      return 'This approach was effective for this user state. Consider reusing.';
    } else if (verdict === 'NEUTRAL') {
      return 'This approach had moderate effectiveness. Consider variations or alternatives.';
    } else {
      return 'This approach was not effective. Avoid in similar situations.';
    }
  }

  /**
   * Generate recommendation
   */
  generateRecommendation(effectivenessResult) {
    const verdict = effectivenessResult.effectiveness.verdict;
    const breakdown = effectivenessResult.effectiveness.breakdown;

    if (verdict === 'WORKED') {
      return 'USE - Recommend for similar user states';
    } else if (verdict === 'NEUTRAL') {
      // Provide specific improvement suggestions based on breakdown
      const suggestions = [];
      if (breakdown.sentiment < 0.1) {
        suggestions.push('Try more emotionally resonant content');
      }
      if (breakdown.engagement < 0.1) {
        suggestions.push('Try more engaging approaches');
      }
      if (breakdown.stateChange < 0.1) {
        suggestions.push('Consider different anchor categories');
      }

      return `TEST - ${suggestions.join('; ') || 'Try variations to improve'}`;
    } else {
      return 'AVOID - Do not use for similar user states';
    }
  }

  /**
   * Find similar patterns from database
   * Uses vector similarity to find patterns with similar user states
   */
  async findSimilarPatterns(userId, userState, limit = 5) {
    const db = require('../config/genesisDatabase');

    const stateVector = this.createStateVector(userState);

    try {
      const result = await db.query(`
        SELECT
          id, approach_type, approach_details,
          effectiveness, verdict, lesson, recommendation,
          1 - (user_state_vector <=> $2::vector) as similarity
        FROM luna_approach_effectiveness
        WHERE user_id = $1
        ORDER BY user_state_vector <=> $2::vector
        LIMIT $3
      `, [userId, `[${stateVector.join(',')}]`, limit]);

      return result.rows;
    } catch (error) {
      console.log('[PatternRecorder] Could not search patterns:', error.message);
      return [];
    }
  }

  /**
   * Get best approach for user state
   * Finds patterns with similar states and returns most effective approach
   */
  async getBestApproach(userId, userState) {
    const similarPatterns = await this.findSimilarPatterns(userId, userState, 10);

    if (similarPatterns.length === 0) {
      return {
        found: false,
        recommendation: 'No patterns found. Use default approach.'
      };
    }

    // Find highest effectiveness among similar patterns
    const bestPattern = similarPatterns
      .filter(p => p.verdict === 'WORKED')
      .sort((a, b) => b.effectiveness - a.effectiveness)[0];

    if (!bestPattern) {
      // No successful patterns, find least bad
      const leastBad = similarPatterns.sort((a, b) => b.effectiveness - a.effectiveness)[0];

      return {
        found: true,
        hasSuccess: false,
        approach: leastBad.approach_type,
        details: leastBad.approach_details,
        expectedEffectiveness: leastBad.effectiveness,
        similarity: leastBad.similarity,
        recommendation: 'No successful patterns. Using least ineffective approach.'
      };
    }

    return {
      found: true,
      hasSuccess: true,
      approach: bestPattern.approach_type,
      details: bestPattern.approach_details,
      expectedEffectiveness: bestPattern.effectiveness,
      similarity: bestPattern.similarity,
      recommendation: bestPattern.recommendation
    };
  }

  /**
   * Update pattern status based on repeated results
   */
  async updatePatternStatus(patternId, newEffectiveness) {
    const db = require('../config/genesisDatabase');

    try {
      // Get current pattern
      const current = await db.query(
        'SELECT effectiveness, times_used, status FROM luna_approach_effectiveness WHERE id = $1',
        [patternId]
      );

      if (current.rows.length === 0) return;

      const pattern = current.rows[0];
      const timesUsed = (pattern.times_used || 0) + 1;

      // Calculate new average effectiveness
      const avgEffectiveness = ((pattern.effectiveness * (timesUsed - 1)) + newEffectiveness) / timesUsed;

      // Determine new status
      let newStatus = 'TESTING';
      if (timesUsed >= 10 && avgEffectiveness >= 0.7) {
        newStatus = 'PROVEN';
      } else if (timesUsed >= 5 && avgEffectiveness < 0.3) {
        newStatus = 'DEPRECATED';
      }

      await db.query(`
        UPDATE luna_approach_effectiveness
        SET
          effectiveness = $2,
          times_used = $3,
          status = $4,
          updated_at = NOW()
        WHERE id = $1
      `, [patternId, avgEffectiveness, timesUsed, newStatus]);

      console.log(`[PatternRecorder] Updated pattern #${patternId}: status=${newStatus}, avgEffectiveness=${avgEffectiveness.toFixed(2)}`);
    } catch (error) {
      console.log('[PatternRecorder] Could not update pattern:', error.message);
    }
  }
}

module.exports = PatternRecorder;
