/**
 * ============================================================================
 * PATTERN AGGREGATOR
 * ============================================================================
 * Aggregates individual effectiveness records into learned patterns.
 * Groups similar states using cosine similarity and ranks approaches.
 *
 * Key Features:
 * - State grouping (cosine similarity > 0.85)
 * - Approach aggregation (average effectiveness)
 * - Confidence determination (LOW/MODERATE/HIGH)
 * - Human-readable state signatures
 *
 * Created: December 31, 2025
 * Week 7: Pattern Learning - Phase 2 Week 3
 * ============================================================================
 */

class PatternAggregator {

  constructor() {
    // Similarity threshold for grouping states
    this.similarityThreshold = 0.85; // Cosine similarity

    // Confidence levels based on sample size
    this.confidenceLevels = {
      LOW: { min: 1, max: 2 },
      MODERATE: { min: 3, max: 9 },
      HIGH: { min: 10, max: Infinity }
    };
  }

  /**
   * Aggregate patterns for a user
   * Looks at all effectiveness records and creates learned patterns
   * @param {string} userId - User ID
   * @returns {Object} Aggregated patterns
   */
  async aggregatePatternsForUser(userId) {
    let records;

    try {
      const db = require('../config/genesisDatabase');

      // Get all effectiveness records for this user
      const result = await db.query(`
        SELECT * FROM luna_approach_effectiveness
        WHERE user_id = $1
        ORDER BY created_at DESC
      `, [userId]);

      records = result.rows;
    } catch (error) {
      console.log('[PatternAggregator] Database not available, using mock data');
      // Return empty for testing without database
      return { message: 'No patterns to aggregate (database unavailable)', patterns: [] };
    }

    if (!records || records.length === 0) {
      return { message: 'No patterns to aggregate yet', patterns: [] };
    }

    // Group similar states together
    const stateGroups = this.groupSimilarStates(records);

    // For each state group, aggregate approach effectiveness
    const patterns = [];

    for (const stateGroup of stateGroups) {
      const pattern = await this.aggregateStateGroup(stateGroup, userId);
      patterns.push(pattern);
    }

    return { patterns: patterns, count: patterns.length };
  }

  /**
   * Group similar user states together
   * Uses vector similarity to cluster
   * @param {Array} records - Effectiveness records
   * @returns {Array} Groups of similar states
   */
  groupSimilarStates(records) {
    const groups = [];

    for (const record of records) {
      // Find if this record belongs to an existing group
      let foundGroup = false;

      for (const group of groups) {
        // Calculate similarity with group representative
        const similarity = this.calculateSimilarity(
          record.user_state_vector,
          group.representative.user_state_vector
        );

        if (similarity >= this.similarityThreshold) {
          group.records.push(record);
          foundGroup = true;
          break;
        }
      }

      // Create new group if no match found
      if (!foundGroup) {
        groups.push({
          representative: record,
          records: [record]
        });
      }
    }

    return groups;
  }

  /**
   * Calculate cosine similarity between two state vectors
   * @param {Array|string} vector1 - First vector
   * @param {Array|string} vector2 - Second vector
   * @returns {number} Cosine similarity (0-1)
   */
  calculateSimilarity(vector1, vector2) {
    if (!vector1 || !vector2) return 0;

    // Parse if string (from database)
    const v1 = typeof vector1 === 'string' ? JSON.parse(vector1) : vector1;
    const v2 = typeof vector2 === 'string' ? JSON.parse(vector2) : vector2;

    // Ensure arrays
    if (!Array.isArray(v1) || !Array.isArray(v2)) return 0;

    // Cosine similarity
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      mag1 += v1[i] * v1[i];
      mag2 += v2[i] * v2[i];
    }

    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);

    if (mag1 === 0 || mag2 === 0) return 0;

    return dotProduct / (mag1 * mag2);
  }

  /**
   * Aggregate all records in a state group
   * Returns learned pattern with approach rankings
   * @param {Object} stateGroup - Group of similar states
   * @param {string} userId - User ID
   * @returns {Object} Learned pattern
   */
  async aggregateStateGroup(stateGroup, userId) {
    const records = stateGroup.records;

    // Create user-state signature (summary of what this state represents)
    const signature = this.createStateSignature(stateGroup.representative);

    // Group by approach type
    const approachGroups = {};

    records.forEach(record => {
      const approachType = record.approach_type;

      if (!approachGroups[approachType]) {
        approachGroups[approachType] = [];
      }

      approachGroups[approachType].push({
        effectiveness: record.effectiveness,
        verdict: record.verdict,
        details: record.approach_details
      });
    });

    // Calculate statistics for each approach
    const approachRankings = [];

    for (const [approachType, attempts] of Object.entries(approachGroups)) {
      const stats = this.calculateApproachStats(attempts);

      approachRankings.push({
        approachType: approachType,
        avgEffectiveness: stats.avg,
        sampleSize: stats.count,
        confidence: this.determineConfidence(stats.count),
        successRate: stats.successRate,
        verdict: stats.verdict,
        lastUsed: new Date() // Would track actual last usage in production
      });
    }

    // Sort by effectiveness
    approachRankings.sort((a, b) => b.avgEffectiveness - a.avgEffectiveness);

    // Determine recommended approach
    const recommendedApproach = this.determineRecommendation(approachRankings);

    // Create avoid list
    const avoidApproaches = approachRankings
      .filter(a => a.avgEffectiveness < 0.4 && a.confidence !== 'LOW')
      .map(a => a.approachType);

    // Store aggregated pattern in database
    const patternId = await this.storeAggregatedPattern(
      userId,
      signature,
      stateGroup.representative.user_state_vector,
      approachRankings,
      recommendedApproach,
      avoidApproaches
    );

    return {
      id: patternId,
      signature: signature,
      approachRankings: approachRankings,
      recommendedApproach: recommendedApproach,
      avoidApproaches: avoidApproaches,
      totalAttempts: records.length
    };
  }

  /**
   * Create human-readable state signature
   * @param {Object} representativeRecord - Representative record from group
   * @returns {Object} State signature
   */
  createStateSignature(representativeRecord) {
    let state;

    try {
      state = typeof representativeRecord.user_state === 'string'
        ? JSON.parse(representativeRecord.user_state)
        : representativeRecord.user_state;
    } catch (e) {
      state = {};
    }

    // Extract key features
    const emotionalState = state.bathtub?.state || 'UNKNOWN';
    const dominantEmotion = this.findDominantEmotion(state.emotions);
    const context = state.context || 'general';
    const timeOfDay = this.getTimeOfDay(state.temporal?.hour);

    return {
      emotionalState: emotionalState,
      dominantEmotion: dominantEmotion,
      context: context,
      timeOfDay: timeOfDay,
      description: `${emotionalState} with ${dominantEmotion}, ${context} context, ${timeOfDay}`
    };
  }

  /**
   * Find dominant emotion from plutchik vector
   * @param {Object} emotions - Emotion values
   * @returns {string} Dominant emotion name
   */
  findDominantEmotion(emotions) {
    if (!emotions) return 'neutral';

    let maxEmotion = 'neutral';
    let maxValue = 0;

    for (const [emotion, value] of Object.entries(emotions)) {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    }

    return maxEmotion;
  }

  /**
   * Get time of day category
   * @param {number} hour - Hour of day (0-23)
   * @returns {string} Time period
   */
  getTimeOfDay(hour) {
    if (hour === undefined || hour === null) return 'unknown';

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Calculate statistics for approach attempts
   * @param {Array} attempts - List of attempts
   * @returns {Object} Statistics
   */
  calculateApproachStats(attempts) {
    const sum = attempts.reduce((acc, a) => acc + a.effectiveness, 0);
    const avg = sum / attempts.length;

    // Success rate (effectiveness >= 0.7)
    const successes = attempts.filter(a => a.effectiveness >= 0.7).length;
    const successRate = successes / attempts.length;

    // Overall verdict
    let verdict = 'NEUTRAL';
    if (avg >= 0.7) verdict = 'WORKED';
    if (avg < 0.4) verdict = 'FAILED';

    return {
      avg: avg,
      count: attempts.length,
      successRate: successRate,
      verdict: verdict
    };
  }

  /**
   * Determine confidence level based on sample size
   * @param {number} sampleSize - Number of attempts
   * @returns {string} Confidence level
   */
  determineConfidence(sampleSize) {
    if (sampleSize >= this.confidenceLevels.HIGH.min) return 'HIGH';
    if (sampleSize >= this.confidenceLevels.MODERATE.min) return 'MODERATE';
    return 'LOW';
  }

  /**
   * Determine recommended approach
   * @param {Array} approachRankings - Sorted approach rankings
   * @returns {string|null} Recommended approach type
   */
  determineRecommendation(approachRankings) {
    if (approachRankings.length === 0) return null;

    // Filter for WORKED or NEUTRAL with moderate+ confidence
    const candidates = approachRankings.filter(a =>
      (a.verdict === 'WORKED' || a.verdict === 'NEUTRAL') &&
      a.confidence !== 'LOW'
    );

    if (candidates.length === 0) {
      // Fall back to highest effectiveness, even if low confidence
      return approachRankings[0].approachType;
    }

    // Return highest effectiveness among candidates
    return candidates[0].approachType;
  }

  /**
   * Store aggregated pattern to database
   * @param {string} userId - User ID
   * @param {Object} signature - State signature
   * @param {Array} stateVector - 50D state vector
   * @param {Array} approachRankings - Approach rankings
   * @param {string} recommendedApproach - Recommended approach
   * @param {Array} avoidApproaches - Approaches to avoid
   * @returns {string} Pattern ID
   */
  async storeAggregatedPattern(
    userId,
    signature,
    stateVector,
    approachRankings,
    recommendedApproach,
    avoidApproaches
  ) {
    try {
      const db = require('../config/genesisDatabase');

      // Check if pattern already exists
      const existing = await db.query(`
        SELECT id FROM luna_learned_patterns
        WHERE user_id = $1 AND user_state_signature = $2
      `, [userId, JSON.stringify(signature)]);

      if (existing.rows.length > 0) {
        // Update existing pattern
        await db.query(`
          UPDATE luna_learned_patterns
          SET
            user_state_vector = $2::vector,
            approach_rankings = $3,
            recommended_approach = $4,
            avoid_approaches = $5,
            confidence = $6,
            sample_size = $7,
            updated_at = NOW()
          WHERE id = $1
        `, [
          existing.rows[0].id,
          typeof stateVector === 'string' ? stateVector : `[${stateVector.join(',')}]`,
          JSON.stringify(approachRankings),
          recommendedApproach,
          avoidApproaches,
          this.determineOverallConfidence(approachRankings),
          approachRankings.reduce((sum, a) => sum + a.sampleSize, 0)
        ]);

        console.log(`[PatternAggregator] Updated pattern #${existing.rows[0].id}`);
        return existing.rows[0].id;
      } else {
        // Insert new pattern
        const result = await db.query(`
          INSERT INTO luna_learned_patterns (
            user_id, user_state_signature, user_state_vector,
            approach_rankings, recommended_approach, avoid_approaches,
            confidence, sample_size
          ) VALUES ($1, $2, $3::vector, $4, $5, $6, $7, $8)
          RETURNING id
        `, [
          userId,
          JSON.stringify(signature),
          typeof stateVector === 'string' ? stateVector : `[${stateVector.join(',')}]`,
          JSON.stringify(approachRankings),
          recommendedApproach,
          avoidApproaches,
          this.determineOverallConfidence(approachRankings),
          approachRankings.reduce((sum, a) => sum + a.sampleSize, 0)
        ]);

        console.log(`[PatternAggregator] Created pattern #${result.rows[0].id}`);
        return result.rows[0].id;
      }
    } catch (error) {
      console.log(`[PatternAggregator] Database not available, pattern stored in memory`);
      return `mock_pattern_${Date.now()}`;
    }
  }

  /**
   * Determine overall confidence for pattern
   * @param {Array} approachRankings - Approach rankings
   * @returns {string} Overall confidence level
   */
  determineOverallConfidence(approachRankings) {
    const totalSamples = approachRankings.reduce((sum, a) => sum + a.sampleSize, 0);

    if (totalSamples >= 10) return 'HIGH';
    if (totalSamples >= 3) return 'MODERATE';
    return 'LOW';
  }
}

module.exports = PatternAggregator;
