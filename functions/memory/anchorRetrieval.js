/**
 * ============================================================================
 * HAPPINESS ANCHOR RETRIEVAL
 * ============================================================================
 * Smart retrieval system for happiness stacking algorithm.
 * Selects optimal anchors based on current emotional state.
 *
 * Stacking order: achievement -> connection -> delight
 * Each category targets different aspects of healing.
 *
 * Created: December 30, 2025
 * Week 2: Happiness Anchors
 * ============================================================================
 */

class HappinessAnchorRetrieval {
  /**
   * Select 3-anchor stacking sequence
   * Returns: { achievement, connection, delight }
   */
  async selectStackSequence(userId, currentState = {}) {
    const db = require('../config/genesisDatabase');

    // Get all anchors for this user
    const allAnchors = await db.query(`
      SELECT
        id, event, user_quote, category,
        primary_emotion, primary_intensity, compounds,
        element_activated, pillar_touched,
        water_contribution, recall_count, effectiveness_history,
        created_at
      FROM happiness_anchors
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    if (allAnchors.rows.length === 0) {
      return null; // No anchors stored yet
    }

    // Parse JSON fields
    const anchors = allAnchors.rows.map(a => ({
      ...a,
      compounds: typeof a.compounds === 'string' ? JSON.parse(a.compounds) : (a.compounds || []),
      effectiveness_history: typeof a.effectiveness_history === 'string'
        ? JSON.parse(a.effectiveness_history)
        : (a.effectiveness_history || [])
    }));

    // Filter by category
    const achievements = anchors.filter(a => a.category === 'achievement');
    const connections = anchors.filter(a => a.category === 'connection');
    const delights = anchors.filter(a => a.category === 'delight');

    // Score each anchor for current state
    const scoredAchievements = achievements.map(a => ({
      ...a,
      score: this.scoreAnchor(a, currentState)
    })).sort((a, b) => b.score - a.score);

    const scoredConnections = connections.map(a => ({
      ...a,
      score: this.scoreAnchor(a, currentState)
    })).sort((a, b) => b.score - a.score);

    const scoredDelights = delights.map(a => ({
      ...a,
      score: this.scoreAnchor(a, currentState)
    })).sort((a, b) => b.score - a.score);

    // Select best from each category
    return {
      achievement: scoredAchievements[0] || null,
      connection: scoredConnections[0] || null,
      delight: scoredDelights[0] || null,
      totalAnchors: anchors.length,
      byCategory: {
        achievement: achievements.length,
        connection: connections.length,
        delight: delights.length
      }
    };
  }

  /**
   * Score anchor for current state
   * Higher score = better match for recall
   */
  scoreAnchor(anchor, currentState = {}) {
    let score = 0;

    // Base intensity (max 10 points)
    score += anchor.primary_intensity || 0;

    // Compound bonus (max 20 points)
    const compoundsLength = Array.isArray(anchor.compounds) ? anchor.compounds.length : 0;
    score += compoundsLength * 5;

    // Freshness bonus - avoid overusing same anchor (max 100 points)
    const recallCount = anchor.recall_count || 0;
    score += Math.max(0, 100 - recallCount * 10);

    // Effectiveness history (max 50 points)
    const effectivenessHistory = anchor.effectiveness_history || [];
    if (effectivenessHistory.length > 0) {
      const avgEffectiveness = effectivenessHistory.reduce((sum, e) =>
        sum + (e.effectiveness || 0), 0
      ) / effectivenessHistory.length;

      score += avgEffectiveness * 50;
    } else {
      // New anchors get benefit of doubt
      score += 30;
    }

    // Constitutional match (max 30 points)
    if (currentState.constitutionalContext) {
      if (anchor.element_activated === currentState.constitutionalContext.deficientElement) {
        score += 30; // Fills deficiency!
      }
    }

    // Recency bonus (max 30 points)
    if (anchor.created_at) {
      const daysSinceCreated = Math.floor(
        (Date.now() - new Date(anchor.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      score += Math.max(0, 30 - daysSinceCreated);
    }

    // Category-specific bonuses based on current user state
    const userState = currentState.userState || '';

    if (userState === 'helpless' && anchor.category === 'achievement') {
      score += 25; // Achievement counters helplessness
    }

    if (userState === 'lonely' && anchor.category === 'connection') {
      score += 40; // Connection counters loneliness
    }

    if (userState === 'withdrawn' && anchor.category === 'delight') {
      score += 35; // Delight breaks through walls
    }

    if (userState === 'sad' || userState === 'depressed') {
      // All categories help, but delight has edge
      if (anchor.category === 'delight') score += 20;
      if (anchor.category === 'connection') score += 15;
      if (anchor.category === 'achievement') score += 10;
    }

    return score;
  }

  /**
   * Find similar anchors using vector similarity
   * Uses pgvector cosine similarity for semantic search
   */
  async findSimilarAnchors(userId, queryEmotion, limit = 5) {
    const db = require('../config/genesisDatabase');

    // Format query vector
    const queryVector = [
      queryEmotion.joy || 0,
      queryEmotion.trust || 0,
      queryEmotion.fear || 0,
      queryEmotion.surprise || 0,
      queryEmotion.sadness || 0,
      queryEmotion.disgust || 0,
      queryEmotion.anger || 0,
      queryEmotion.anticipation || 0
    ];

    // Find similar using pgvector cosine similarity
    const result = await db.query(`
      SELECT
        id, event, user_quote, category,
        primary_emotion, primary_intensity,
        1 - (plutchik_vector <=> $2::vector) as similarity
      FROM happiness_anchors
      WHERE user_id = $1
      ORDER BY plutchik_vector <=> $2::vector
      LIMIT $3
    `, [userId, `[${queryVector.join(',')}]`, limit]);

    return result.rows;
  }

  /**
   * Find opposite anchors (for contrast/healing)
   * When user is sad, find joyful anchors
   */
  async findOppositeAnchors(userId, currentEmotion, limit = 3) {
    const db = require('../config/genesisDatabase');

    // Create opposite vector (high joy when sad, etc.)
    const oppositeVector = [
      currentEmotion.sadness || 0,      // joy <- sadness
      currentEmotion.disgust || 0,      // trust <- disgust
      currentEmotion.anger || 0,        // fear <- anger (inverse activation)
      1 - (currentEmotion.surprise || 0), // surprise
      currentEmotion.joy || 0,          // sadness <- joy
      currentEmotion.trust || 0,        // disgust <- trust
      currentEmotion.fear || 0,         // anger <- fear
      1 - (currentEmotion.anticipation || 0) // anticipation
    ];

    // Find anchors most different from current state
    const result = await db.query(`
      SELECT
        id, event, user_quote, category,
        primary_emotion, primary_intensity,
        1 - (plutchik_vector <=> $2::vector) as contrast_score
      FROM happiness_anchors
      WHERE user_id = $1
        AND primary_emotion IN ('joy', 'trust', 'anticipation', 'surprise')
      ORDER BY plutchik_vector <=> $2::vector DESC
      LIMIT $3
    `, [userId, `[${oppositeVector.join(',')}]`, limit]);

    return result.rows;
  }

  /**
   * Get anchors by category
   */
  async getAnchorsByCategory(userId, category, limit = 10) {
    const db = require('../config/genesisDatabase');

    const result = await db.query(`
      SELECT
        id, event, user_quote, category,
        primary_emotion, primary_intensity,
        water_contribution, recall_count,
        created_at
      FROM happiness_anchors
      WHERE user_id = $1 AND category = $2
      ORDER BY created_at DESC
      LIMIT $3
    `, [userId, category, limit]);

    return result.rows;
  }

  /**
   * Update anchor recall tracking
   * Called after anchor is used in stacking
   */
  async trackRecall(anchorId, effectiveness) {
    const db = require('../config/genesisDatabase');

    await db.query(`
      UPDATE happiness_anchors
      SET
        recall_count = recall_count + 1,
        last_recalled = NOW(),
        effectiveness_history =
          COALESCE(effectiveness_history, '[]'::jsonb) ||
          jsonb_build_array(
            jsonb_build_object(
              'timestamp', to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
              'effectiveness', $2
            )
          )
      WHERE id = $1
    `, [anchorId, effectiveness]);

    console.log(`[HappinessAnchor] Tracked recall for anchor #${anchorId} (effectiveness: ${effectiveness})`);
  }

  /**
   * Calculate total water contribution from stacking sequence
   */
  calculateStackWater(sequence) {
    let totalWater = 0;
    const stackingMultipliers = [1.0, 1.3, 1.6]; // Bonus for sequence

    ['achievement', 'connection', 'delight'].forEach((category, index) => {
      const anchor = sequence[category];
      if (anchor) {
        const baseWater = anchor.water_contribution || 10;
        totalWater += Math.round(baseWater * stackingMultipliers[index]);
      }
    });

    return totalWater;
  }

  /**
   * Get anchor statistics for user
   */
  async getAnchorStats(userId) {
    const db = require('../config/genesisDatabase');

    const result = await db.query(`
      SELECT
        COUNT(*) as total_anchors,
        COUNT(*) FILTER (WHERE category = 'achievement') as achievements,
        COUNT(*) FILTER (WHERE category = 'connection') as connections,
        COUNT(*) FILTER (WHERE category = 'delight') as delights,
        AVG(primary_intensity) as avg_intensity,
        SUM(recall_count) as total_recalls,
        MAX(created_at) as last_anchor_date
      FROM happiness_anchors
      WHERE user_id = $1
    `, [userId]);

    return result.rows[0];
  }
}

module.exports = HappinessAnchorRetrieval;
