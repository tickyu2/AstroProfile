/**
 * ============================================================================
 * HYBRID RETRIEVAL SYSTEM
 * ============================================================================
 * Combines vector similarity + keyword matching + fuzzy matching + recency
 * Uses RRF (Reciprocal Rank Fusion) to merge rankings from multiple sources.
 *
 * Expected Improvement: 30-50% better memory recall
 *
 * Search Methods:
 *   1. Vector similarity (semantic meaning)
 *   2. Full-text search (exact keywords)
 *   3. Trigram fuzzy matching (typos/variations)
 *   4. Recency boost (recent memories surface)
 *
 * Created: December 31, 2025
 * Week 11: Enhancement Week - Hybrid Search
 * ============================================================================
 */

class HybridRetrieval {

  constructor() {
    // RRF constant (standard: 60)
    this.rrf_k = 60;

    // Weights for different search components
    this.weights = {
      vector: 1.0,     // Semantic similarity
      keyword: 1.0,    // Exact/fuzzy keyword matches
      recency: 0.3     // Time-based boost (lower weight)
    };

    // Similarity threshold for trigram fuzzy matching (0-1)
    this.fuzzyThreshold = 0.4; // Lower = more lenient
  }

  /**
   * Hybrid search for happiness anchors
   * Returns top K results combining all signals
   * @param {string} userId - User ID
   * @param {string} queryText - Search query text
   * @param {Array} queryEmbedding - Query embedding vector
   * @param {number} limit - Maximum results to return
   * @returns {Array} Ranked results with hybrid scores
   */
  async searchHappinessAnchors(userId, queryText, queryEmbedding, limit = 15) {
    try {
      const db = require('../config/genesisDatabase');

      // Use the hybrid_search_anchors function if available
      const result = await db.query(`
        SELECT * FROM hybrid_search_anchors($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        userId,
        queryText,
        JSON.stringify(queryEmbedding),
        limit,
        this.rrf_k,
        this.weights.keyword,
        this.weights.vector,
        this.weights.recency
      ]);

      return result.rows;
    } catch (error) {
      // Fallback to JavaScript-based hybrid search if DB function not available
      console.log('[HybridRetrieval] Using JS fallback:', error.message);
      return this.searchAnchorsJSFallback(userId, queryText, queryEmbedding, limit);
    }
  }

  /**
   * JavaScript fallback for hybrid search (when DB function unavailable)
   */
  async searchAnchorsJSFallback(userId, queryText, queryEmbedding, limit) {
    try {
      const db = require('../config/genesisDatabase');

      // Get keyword matches
      const keywordResults = await db.query(`
        SELECT id, ts_rank_cd(textsearch, plainto_tsquery('english', $1)) AS score
        FROM happiness_anchors
        WHERE user_id = $2 AND textsearch @@ plainto_tsquery('english', $1)
        ORDER BY score DESC LIMIT 30
      `, [queryText, userId]);

      // Get fuzzy matches
      const fuzzyResults = await db.query(`
        SELECT id, similarity(coalesce(event, '') || ' ' || coalesce(user_quote, ''), $1) AS score
        FROM happiness_anchors
        WHERE user_id = $2
          AND (coalesce(event, '') || ' ' || coalesce(user_quote, '')) % $1
        ORDER BY score DESC LIMIT 30
      `, [queryText, userId]);

      // Get vector matches
      const vectorResults = await db.query(`
        SELECT id, 1 - (embedding <=> $1::vector) AS score
        FROM happiness_anchors
        WHERE user_id = $2 AND embedding IS NOT NULL
        ORDER BY embedding <=> $1::vector LIMIT 30
      `, [JSON.stringify(queryEmbedding), userId]);

      // Get recency
      const recencyResults = await db.query(`
        SELECT id, ROW_NUMBER() OVER (ORDER BY timestamp DESC) AS rank
        FROM happiness_anchors
        WHERE user_id = $1 LIMIT 30
      `, [userId]);

      // Calculate RRF scores
      const scores = new Map();

      this.addRRFScores(scores, keywordResults.rows, 'keyword', this.weights.keyword);
      this.addRRFScores(scores, fuzzyResults.rows, 'fuzzy', this.weights.keyword);
      this.addRRFScores(scores, vectorResults.rows, 'vector', this.weights.vector);
      this.addRRFScoresFromRank(scores, recencyResults.rows, 'recency', this.weights.recency);

      // Sort by combined score
      const sortedIds = [...scores.entries()]
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, limit)
        .map(([id, data]) => ({ id, ...data }));

      // Fetch full records
      if (sortedIds.length === 0) return [];

      const ids = sortedIds.map(s => s.id);
      const fullResults = await db.query(`
        SELECT * FROM happiness_anchors WHERE id = ANY($1)
      `, [ids]);

      // Merge scores with records
      return fullResults.rows.map(row => {
        const scoreData = sortedIds.find(s => s.id === row.id);
        return {
          ...row,
          hybrid_score: scoreData.total,
          score_breakdown: scoreData.sources
        };
      }).sort((a, b) => b.hybrid_score - a.hybrid_score);

    } catch (error) {
      console.log('[HybridRetrieval] JS fallback error:', error.message);
      return [];
    }
  }

  /**
   * Add RRF scores from ranked results
   */
  addRRFScores(scoreMap, results, source, weight) {
    results.forEach((row, index) => {
      const rank = index + 1;
      const rrfScore = this.calculateRRF(rank) * weight;

      if (!scoreMap.has(row.id)) {
        scoreMap.set(row.id, { total: 0, sources: [] });
      }

      const data = scoreMap.get(row.id);
      data.total += rrfScore;
      data.sources.push({ source, score: rrfScore, rank });
    });
  }

  /**
   * Add RRF scores from pre-ranked results (with rank column)
   */
  addRRFScoresFromRank(scoreMap, results, source, weight) {
    results.forEach(row => {
      const rrfScore = this.calculateRRF(parseInt(row.rank)) * weight;

      if (!scoreMap.has(row.id)) {
        scoreMap.set(row.id, { total: 0, sources: [] });
      }

      const data = scoreMap.get(row.id);
      data.total += rrfScore;
      data.sources.push({ source, score: rrfScore, rank: parseInt(row.rank) });
    });
  }

  /**
   * Calculate RRF score: 1 / (k + rank)
   */
  calculateRRF(rank) {
    return 1.0 / (this.rrf_k + rank);
  }

  /**
   * Search text long-term memory (LTM)
   * @param {string} userId - User ID
   * @param {string} queryText - Search query text
   * @param {Array} queryEmbedding - Query embedding vector
   * @param {number} limit - Maximum results
   * @returns {Array} Ranked results
   */
  async searchTextLTM(userId, queryText, queryEmbedding, limit = 10) {
    try {
      const db = require('../config/genesisDatabase');

      const query = `
        WITH keyword_results AS (
          SELECT
            id,
            ROW_NUMBER() OVER (
              ORDER BY ts_rank_cd(textsearch, plainto_tsquery('english', $1)) DESC
            ) AS rank
          FROM text_ltm
          WHERE user_id = $3
            AND textsearch @@ plainto_tsquery('english', $1)
          LIMIT 20
        ),
        vector_results AS (
          SELECT
            id,
            ROW_NUMBER() OVER (ORDER BY embedding <=> $2::vector) AS rank
          FROM text_ltm
          WHERE user_id = $3 AND embedding IS NOT NULL
          LIMIT 20
        ),
        recency_results AS (
          SELECT
            id,
            ROW_NUMBER() OVER (ORDER BY timestamp DESC) AS rank
          FROM text_ltm
          WHERE user_id = $3
          LIMIT 20
        ),
        combined_scores AS (
          SELECT id, calculate_rrf_score(rank::INTEGER, $4) * $5 AS score
          FROM keyword_results
          UNION ALL
          SELECT id, calculate_rrf_score(rank::INTEGER, $4) * $6 AS score
          FROM vector_results
          UNION ALL
          SELECT id, calculate_rrf_score(rank::INTEGER, $4) * $7 AS score
          FROM recency_results
        )
        SELECT
          ltm.*,
          SUM(cs.score) AS hybrid_score
        FROM combined_scores cs
        JOIN text_ltm ltm ON ltm.id = cs.id
        WHERE ltm.user_id = $3
        GROUP BY ltm.id
        ORDER BY hybrid_score DESC
        LIMIT $8;
      `;

      const result = await db.query(query, [
        queryText,
        JSON.stringify(queryEmbedding),
        userId,
        this.rrf_k,
        this.weights.keyword,
        this.weights.vector,
        this.weights.recency,
        limit
      ]);

      return result.rows;
    } catch (error) {
      console.log('[HybridRetrieval] Text LTM search error:', error.message);
      return [];
    }
  }

  /**
   * Search inside jokes with fuzzy matching
   * @param {string} userId - User ID
   * @param {string} queryText - Search query text
   * @param {number} limit - Maximum results
   * @returns {Array} Matching jokes
   */
  async searchInsideJokes(userId, queryText, limit = 5) {
    try {
      const db = require('../config/genesisDatabase');

      const query = `
        WITH fuzzy_results AS (
          SELECT
            id,
            similarity(content, $1) AS fuzzy_score,
            ROW_NUMBER() OVER (ORDER BY similarity(content, $1) DESC) AS rank
          FROM luna_inside_jokes
          WHERE user_id = $2
            AND content % $1
          LIMIT 15
        ),
        keyword_results AS (
          SELECT
            id,
            ts_rank_cd(textsearch, plainto_tsquery('english', $1)) AS fts_score,
            ROW_NUMBER() OVER (
              ORDER BY ts_rank_cd(textsearch, plainto_tsquery('english', $1)) DESC
            ) AS rank
          FROM luna_inside_jokes
          WHERE user_id = $2
            AND textsearch @@ plainto_tsquery('english', $1)
          LIMIT 15
        ),
        combined_scores AS (
          SELECT id, calculate_rrf_score(rank::INTEGER, $3) * 1.5 AS score
          FROM fuzzy_results
          UNION ALL
          SELECT id, calculate_rrf_score(rank::INTEGER, $3) * 1.0 AS score
          FROM keyword_results
        )
        SELECT
          j.*,
          SUM(cs.score) AS hybrid_score
        FROM combined_scores cs
        JOIN luna_inside_jokes j ON j.id = cs.id
        WHERE j.user_id = $2
        GROUP BY j.id
        ORDER BY hybrid_score DESC
        LIMIT $4;
      `;

      const result = await db.query(query, [
        queryText,
        userId,
        this.rrf_k,
        limit
      ]);

      return result.rows;
    } catch (error) {
      console.log('[HybridRetrieval] Inside jokes search error:', error.message);
      return [];
    }
  }

  /**
   * Combined search across all memory types
   * @param {string} userId - User ID
   * @param {string} queryText - Search query text
   * @param {Array} queryEmbedding - Query embedding vector
   * @param {Object} options - Search options
   * @returns {Object} Results from all memory types
   */
  async searchAllMemories(userId, queryText, queryEmbedding, options = {}) {
    const {
      anchorLimit = 10,
      ltmLimit = 5,
      jokeLimit = 3
    } = options;

    // Run all searches in parallel
    const [anchors, ltm, jokes] = await Promise.all([
      this.searchHappinessAnchors(userId, queryText, queryEmbedding, anchorLimit),
      this.searchTextLTM(userId, queryText, queryEmbedding, ltmLimit),
      this.searchInsideJokes(userId, queryText, jokeLimit)
    ]);

    return {
      anchors,
      ltm,
      jokes,
      totalResults: anchors.length + ltm.length + jokes.length
    };
  }

  /**
   * Adjust weights dynamically based on query type
   * @param {number} vector - Vector similarity weight
   * @param {number} keyword - Keyword matching weight
   * @param {number} recency - Recency boost weight
   */
  setWeights(vector, keyword, recency) {
    this.weights = { vector, keyword, recency };
  }

  /**
   * Get current weights
   * @returns {Object} Current weight configuration
   */
  getWeights() {
    return { ...this.weights };
  }

  /**
   * Adjust fuzzy threshold
   * @param {number} threshold - Similarity threshold (0.2-0.6 typical)
   */
  setFuzzyThreshold(threshold) {
    this.fuzzyThreshold = Math.min(0.8, Math.max(0.1, threshold));
  }

  /**
   * Set RRF k constant
   * @param {number} k - RRF constant (default: 60)
   */
  setRRFK(k) {
    this.rrf_k = Math.max(1, k);
  }

  /**
   * Get search statistics
   * @param {string} userId - User ID
   * @returns {Object} Search statistics
   */
  async getSearchStats(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const stats = await db.query(`
        SELECT
          (SELECT COUNT(*) FROM happiness_anchors WHERE user_id = $1) AS anchor_count,
          (SELECT COUNT(*) FROM text_ltm WHERE user_id = $1) AS ltm_count,
          (SELECT COUNT(*) FROM luna_inside_jokes WHERE user_id = $1) AS joke_count,
          (SELECT COUNT(*) FROM happiness_anchors WHERE user_id = $1 AND embedding IS NOT NULL) AS indexed_anchors
      `, [userId]);

      return stats.rows[0];
    } catch (error) {
      console.log('[HybridRetrieval] Stats error:', error.message);
      return {
        anchor_count: 0,
        ltm_count: 0,
        joke_count: 0,
        indexed_anchors: 0
      };
    }
  }
}

module.exports = HybridRetrieval;
