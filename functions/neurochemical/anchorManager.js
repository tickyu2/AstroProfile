/**
 * GENESIS Neurochemical Love Engine
 * Anchor Manager Service
 * ================================
 *
 * Manages high-happiness "anchor" memories that can be retrieved and compounded.
 * Anchors are moments where happiness >= 4.0 (ECSTATIC or TRANSCENDENT).
 *
 * Key Concepts:
 * - Anchor Creation: When happiness >= 4.0, moment becomes an anchor
 * - Anchor Retrieval: Bring back successful emotional moments
 * - Compounding: Retrieving anchors can INCREASE their happiness over time
 * - Decay Prevention: Used anchors stay strong, unused ones fade
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 * When things can be measured, they can be mathematically improved.
 */

const pgClient = require('../database/pgClient');

// ============================================================================
// CONFIGURATION
// ============================================================================

const ANCHOR_CONFIG = {
  // Thresholds
  creationThreshold: 4.0,    // Happiness >= 4.0 becomes anchor
  strongAnchorThreshold: 4.5, // Happiness >= 4.5 is "strong" anchor

  // Compounding
  compoundIncrement: 0.1,     // How much happiness increases per retrieval
  maxCompoundedHappiness: 5.0, // Cap on compounded happiness
  compoundingProbability: 0.7, // 70% chance of compounding on retrieval

  // Decay
  decayDaysThreshold: 30,     // Start decay after 30 days unused
  decayRate: 0.05,            // Lose 0.05 happiness per decay period
  minDecayedHappiness: 3.0,   // Don't decay below threshold

  // Retrieval
  defaultRetrievalLimit: 3,   // Default number of anchors to retrieve
  maxRetrievalLimit: 10,      // Maximum anchors per request
  minSimilarity: 0.5          // Minimum similarity for semantic search
};

// ============================================================================
// ANCHOR CREATION
// ============================================================================

/**
 * Evaluate if a conversation moment should become an anchor
 *
 * @param {Object} params - Moment parameters
 * @param {number} params.happinessScore - Current happiness score
 * @param {Object} params.neurochemicals - Detected neurochemical levels
 * @param {string} params.primaryDriver - Which neurochemical drove happiness
 * @returns {Object} - Anchor evaluation result
 */
function evaluateForAnchor(params) {
  const { happinessScore, neurochemicals, primaryDriver } = params;

  const isAnchorWorthy = happinessScore >= ANCHOR_CONFIG.creationThreshold;
  const isStrongAnchor = happinessScore >= ANCHOR_CONFIG.strongAnchorThreshold;

  // Calculate anchor strength (0.5 to 1.0)
  let anchorStrength = 0;
  if (isAnchorWorthy) {
    // Base strength from happiness
    anchorStrength = 0.5 + (happinessScore - 4.0) * 0.5;

    // Bonus for strong neurochemical activation
    const maxNeuro = Math.max(
      neurochemicals.oxytocin || 0,
      neurochemicals.dopamine || 0,
      neurochemicals.serotonin || 0,
      neurochemicals.vasopressin || 0
    );
    if (maxNeuro >= 4) anchorStrength += 0.1;
    if (maxNeuro >= 5) anchorStrength += 0.1;

    // Cap at 1.0
    anchorStrength = Math.min(anchorStrength, 1.0);
  }

  // Determine if this anchor can compound
  // Serotonin-driven anchors compound best (recognition moments)
  const compoundsOnRetrieval =
    isAnchorWorthy &&
    (primaryDriver === 'serotonin' || primaryDriver === 'oxytocin');

  return {
    isAnchorWorthy,
    isStrongAnchor,
    anchorStrength: roundTo2(anchorStrength),
    compoundsOnRetrieval,
    reasoning: isAnchorWorthy
      ? `Happiness ${happinessScore} >= ${ANCHOR_CONFIG.creationThreshold} - ${isStrongAnchor ? 'STRONG' : 'standard'} anchor created`
      : `Happiness ${happinessScore} < ${ANCHOR_CONFIG.creationThreshold} - not anchor worthy`
  };
}

/**
 * Create an anchor memory in the database
 *
 * @param {Object} params - Anchor data
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} params.timelineId - Reference to conversation_timeline record
 * @param {string} params.memoryContent - Summary of the anchor moment
 * @param {number} params.happinessScore - Initial happiness score
 * @param {number} params.anchorStrength - Strength of anchor (0-1)
 * @param {boolean} params.compoundsOnRetrieval - Can this compound?
 * @param {string} params.primaryDriver - Which neurochemical drove this
 * @returns {Promise<Object>} - Created anchor record
 */
async function createAnchor(params) {
  const {
    userId,
    profileId,
    timelineId,
    memoryContent,
    happinessScore,
    anchorStrength,
    compoundsOnRetrieval,
    primaryDriver
  } = params;

  try {
    const pool = await pgClient.getPool();

    // Update the conversation_timeline record to mark as anchor
    const result = await pool.query(`
      UPDATE conversation_timeline
      SET
        is_high_happiness = TRUE,
        is_anchor_memory = TRUE,
        anchor_strength = $1,
        compounds_on_retrieval = $2,
        initial_happiness = $3,
        current_happiness = $3,
        retrieval_count = 0
      WHERE id = $4
      RETURNING id, memory_content, current_happiness, anchor_strength
    `, [anchorStrength, compoundsOnRetrieval, happinessScore, timelineId]);

    if (result.rows.length === 0) {
      // If no existing record, this is a standalone anchor
      console.log('[AnchorManager] No existing timeline record, anchor marked');
      return {
        success: true,
        anchorId: timelineId,
        message: 'Anchor created successfully'
      };
    }

    console.log(`[AnchorManager] Created anchor: ${result.rows[0].id}`);

    return {
      success: true,
      anchor: result.rows[0],
      message: 'Anchor created and marked in timeline'
    };

  } catch (error) {
    console.error('[AnchorManager] createAnchor error:', error);
    throw error;
  }
}

// ============================================================================
// RETRIEVAL PRIORITY FORMULA (from GENESIS Love Intelligence Layer)
// ============================================================================

/**
 * Anchor Retrieval Priority Formula:
 *
 * Priority = (AnchorStrength × 0.30) + (Happiness × 0.25) + (Similarity × 0.20) +
 *            (Recency × 0.15) + (ConstitutionMatch × 0.10)
 *
 * Where:
 * - AnchorStrength: 0-1 (how strong the anchor was created)
 * - Happiness: current_happiness / 5 (normalized 0-1)
 * - Similarity: 0-1 (semantic similarity to query, or 0.5 if no query)
 * - Recency: 1 - (days_since_created / 365) (newer = higher)
 * - ConstitutionMatch: 1 if driver matches constitution needs, 0.5 otherwise
 */

/**
 * Calculate retrieval priority score for an anchor
 *
 * @param {Object} anchor - Anchor record
 * @param {Object} options - Scoring options
 * @param {number} [options.similarity=0.5] - Semantic similarity score
 * @param {string} [options.constitution] - User's BaZi constitution
 * @returns {number} - Priority score (0-1)
 */
function calculateRetrievalPriority(anchor, options = {}) {
  const { similarity = 0.5, constitution = null } = options;

  // Anchor Strength component (0-1)
  const strengthScore = parseFloat(anchor.anchor_strength) || 0.5;

  // Happiness component (normalized to 0-1)
  const happinessScore = (parseFloat(anchor.current_happiness) || 3) / 5;

  // Similarity component (0-1)
  const similarityScore = similarity;

  // Recency component (newer = higher)
  const createdAt = new Date(anchor.created_at);
  const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 1 - (daysSinceCreated / 365));

  // Constitution match component
  // Fire → Serotonin, Water → Oxytocin, Wood → Dopamine, Metal → Serotonin, Earth → Oxytocin
  const constitutionDriverMap = {
    Fire: 'serotonin',
    Water: 'oxytocin',
    Wood: 'dopamine',
    Metal: 'serotonin',
    Earth: 'oxytocin'
  };
  const preferredDriver = constitutionDriverMap[constitution] || null;
  const constitutionMatchScore = preferredDriver && anchor.happiness_driver === preferredDriver
    ? 1.0
    : 0.5;

  // Apply formula
  const priority =
    (strengthScore * 0.30) +
    (happinessScore * 0.25) +
    (similarityScore * 0.20) +
    (recencyScore * 0.15) +
    (constitutionMatchScore * 0.10);

  return roundTo2(priority);
}

// ============================================================================
// ANCHOR RETRIEVAL
// ============================================================================

/**
 * Retrieve best anchor memories for a user
 *
 * @param {Object} params - Retrieval parameters
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} [params.queryText] - Optional: semantic search query
 * @param {string} [params.neurochemical] - Optional: filter by specific neurochemical
 * @param {string} [params.constitution] - Optional: user's BaZi constitution for priority scoring
 * @param {number} [params.limit] - Number of anchors to retrieve
 * @returns {Promise<Array>} - Array of anchor memories
 */
async function retrieveAnchors(params) {
  const {
    userId,
    profileId,
    queryText = null,
    neurochemical = null,
    constitution = null,
    limit = ANCHOR_CONFIG.defaultRetrievalLimit
  } = params;

  // Fetch more than needed so we can re-rank by priority formula
  const fetchLimit = Math.min(limit * 3, ANCHOR_CONFIG.maxRetrievalLimit * 2);
  const actualLimit = Math.min(limit, ANCHOR_CONFIG.maxRetrievalLimit);

  try {
    const pool = await pgClient.getPool();

    let query, queryParams;

    if (queryText) {
      // Semantic search for relevant anchors
      const embedding = await pgClient.generateEmbedding(queryText);

      query = `
        SELECT
          id,
          memory_content,
          current_happiness,
          initial_happiness,
          anchor_strength,
          retrieval_count,
          compounds_on_retrieval,
          happiness_driver,
          created_at,
          1 - (embedding <=> $4::vector) as similarity
        FROM conversation_timeline
        WHERE user_id = $1
          AND profile_id = $2
          AND is_anchor_memory = TRUE
          AND embedding IS NOT NULL
          ${neurochemical ? `AND (
            (happiness_driver = '${neurochemical}')
            OR (${neurochemical}_detected >= 4)
          )` : ''}
        ORDER BY similarity DESC, current_happiness DESC
        LIMIT $3
      `;
      queryParams = [userId, profileId, fetchLimit, embedding];

    } else {
      // Simple top anchors by happiness
      query = `
        SELECT
          id,
          memory_content,
          current_happiness,
          initial_happiness,
          anchor_strength,
          retrieval_count,
          compounds_on_retrieval,
          happiness_driver,
          created_at,
          0.5 as similarity
        FROM conversation_timeline
        WHERE user_id = $1
          AND profile_id = $2
          AND is_anchor_memory = TRUE
          ${neurochemical ? `AND (
            happiness_driver = $4
            OR ${neurochemical}_detected >= 4
          )` : ''}
        ORDER BY current_happiness DESC, anchor_strength DESC
        LIMIT $3
      `;
      queryParams = neurochemical
        ? [userId, profileId, fetchLimit, neurochemical]
        : [userId, profileId, fetchLimit];
    }

    const result = await pool.query(query, queryParams);

    // Calculate priority score for each anchor and sort
    const scoredAnchors = result.rows.map(row => ({
      ...row,
      priority: calculateRetrievalPriority(row, {
        similarity: parseFloat(row.similarity) || 0.5,
        constitution
      })
    }));

    // Sort by priority score (highest first)
    scoredAnchors.sort((a, b) => b.priority - a.priority);

    // Take top N after priority sorting
    const topAnchors = scoredAnchors.slice(0, actualLimit);

    // Record retrieval and potentially compound
    const anchors = [];
    for (const row of topAnchors) {
      const processed = await processAnchorRetrieval(row);
      processed.priority = row.priority; // Include priority score
      anchors.push(processed);
    }

    console.log(`[AnchorManager] Retrieved ${anchors.length} anchors (constitution: ${constitution || 'unknown'})`);

    return anchors;

  } catch (error) {
    console.error('[AnchorManager] retrieveAnchors error:', error);
    return [];
  }
}

/**
 * Process an anchor retrieval - update stats and potentially compound
 *
 * @param {Object} anchor - Anchor record
 * @returns {Object} - Processed anchor with any compounding applied
 */
async function processAnchorRetrieval(anchor) {
  const shouldCompound =
    anchor.compounds_on_retrieval &&
    Math.random() < ANCHOR_CONFIG.compoundingProbability;

  let newHappiness = anchor.current_happiness;
  let compounded = false;

  if (shouldCompound && newHappiness < ANCHOR_CONFIG.maxCompoundedHappiness) {
    newHappiness = Math.min(
      anchor.current_happiness + ANCHOR_CONFIG.compoundIncrement,
      ANCHOR_CONFIG.maxCompoundedHappiness
    );
    compounded = true;
  }

  try {
    const pool = await pgClient.getPool();

    // Update retrieval stats
    await pool.query(`
      UPDATE conversation_timeline
      SET
        retrieval_count = retrieval_count + 1,
        last_retrieved_at = CURRENT_TIMESTAMP,
        current_happiness = $1,
        enrichments = enrichments || $2::jsonb
      WHERE id = $3
    `, [
      newHappiness,
      JSON.stringify([{
        type: 'retrieval',
        timestamp: new Date().toISOString(),
        compounded,
        previousHappiness: anchor.current_happiness,
        newHappiness
      }]),
      anchor.id
    ]);

  } catch (error) {
    console.error('[AnchorManager] processAnchorRetrieval error:', error);
    // Continue even if update fails
  }

  return {
    id: anchor.id,
    content: anchor.memory_content,
    happiness: roundTo2(newHappiness),
    initialHappiness: anchor.initial_happiness,
    strength: anchor.anchor_strength,
    retrievalCount: anchor.retrieval_count + 1,
    driver: anchor.happiness_driver,
    compounded,
    createdAt: anchor.created_at,
    similarity: anchor.similarity || null
  };
}

// ============================================================================
// ANCHOR ANALYTICS
// ============================================================================

/**
 * Get anchor statistics for a user
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @returns {Promise<Object>} - Anchor statistics
 */
async function getAnchorStats(userId, profileId) {
  try {
    const pool = await pgClient.getPool();

    const result = await pool.query(`
      SELECT
        COUNT(*) as total_anchors,
        AVG(current_happiness) as avg_happiness,
        MAX(current_happiness) as peak_happiness,
        AVG(anchor_strength) as avg_strength,
        SUM(retrieval_count) as total_retrievals,
        COUNT(CASE WHEN compounds_on_retrieval THEN 1 END) as compounding_anchors,
        COUNT(CASE WHEN current_happiness >= 4.5 THEN 1 END) as strong_anchors,
        MAX(created_at) as latest_anchor,

        -- By driver breakdown
        COUNT(CASE WHEN happiness_driver = 'oxytocin' THEN 1 END) as oxytocin_anchors,
        COUNT(CASE WHEN happiness_driver = 'dopamine' THEN 1 END) as dopamine_anchors,
        COUNT(CASE WHEN happiness_driver = 'serotonin' THEN 1 END) as serotonin_anchors,
        COUNT(CASE WHEN happiness_driver = 'vasopressin' THEN 1 END) as vasopressin_anchors

      FROM conversation_timeline
      WHERE user_id = $1
        AND profile_id = $2
        AND is_anchor_memory = TRUE
    `, [userId, profileId]);

    const stats = result.rows[0];

    return {
      totalAnchors: parseInt(stats.total_anchors) || 0,
      avgHappiness: roundTo2(parseFloat(stats.avg_happiness) || 0),
      peakHappiness: roundTo2(parseFloat(stats.peak_happiness) || 0),
      avgStrength: roundTo2(parseFloat(stats.avg_strength) || 0),
      totalRetrievals: parseInt(stats.total_retrievals) || 0,
      compoundingAnchors: parseInt(stats.compounding_anchors) || 0,
      strongAnchors: parseInt(stats.strong_anchors) || 0,
      latestAnchor: stats.latest_anchor,
      byDriver: {
        oxytocin: parseInt(stats.oxytocin_anchors) || 0,
        dopamine: parseInt(stats.dopamine_anchors) || 0,
        serotonin: parseInt(stats.serotonin_anchors) || 0,
        vasopressin: parseInt(stats.vasopressin_anchors) || 0
      }
    };

  } catch (error) {
    console.error('[AnchorManager] getAnchorStats error:', error);
    return {
      totalAnchors: 0,
      avgHappiness: 0,
      error: error.message
    };
  }
}

/**
 * Format anchors for inclusion in Luna's context
 *
 * @param {Array} anchors - Retrieved anchor memories
 * @returns {string} - Formatted anchor context for prompt
 */
function formatAnchorsForPrompt(anchors) {
  if (!anchors || anchors.length === 0) {
    return '';
  }

  let prompt = `\n### Anchor Memories (Peak Happiness Moments)\n`;
  prompt += `These are moments where deep connection was achieved. Reference them to strengthen the bond:\n\n`;

  anchors.forEach((anchor, i) => {
    const compoundNote = anchor.compounded ? ' (strengthened on recall)' : '';
    prompt += `${i + 1}. [Happiness: ${anchor.happiness}${compoundNote}]\n`;
    prompt += `   ${anchor.content}\n`;
    prompt += `   (Driver: ${anchor.driver}, Retrieved ${anchor.retrievalCount}x)\n\n`;
  });

  return prompt;
}

// ============================================================================
// DECAY MANAGEMENT
// ============================================================================

/**
 * Apply decay to unused anchors (run periodically)
 * Anchors not retrieved in 30+ days slowly lose happiness
 *
 * @returns {Promise<Object>} - Decay results
 */
async function applyAnchorDecay() {
  try {
    const pool = await pgClient.getPool();

    const result = await pool.query(`
      UPDATE conversation_timeline
      SET
        current_happiness = GREATEST(
          current_happiness - $1,
          $2
        ),
        enrichments = enrichments || $3::jsonb
      WHERE is_anchor_memory = TRUE
        AND last_retrieved_at < NOW() - INTERVAL '${ANCHOR_CONFIG.decayDaysThreshold} days'
        AND current_happiness > $2
      RETURNING id, current_happiness
    `, [
      ANCHOR_CONFIG.decayRate,
      ANCHOR_CONFIG.minDecayedHappiness,
      JSON.stringify([{
        type: 'decay',
        timestamp: new Date().toISOString(),
        reason: 'Unused anchor decay'
      }])
    ]);

    console.log(`[AnchorManager] Applied decay to ${result.rows.length} anchors`);

    return {
      anchorsDecayed: result.rows.length,
      decayRate: ANCHOR_CONFIG.decayRate
    };

  } catch (error) {
    console.error('[AnchorManager] applyAnchorDecay error:', error);
    return { error: error.message };
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

function roundTo2(num) {
  return Math.round(num * 100) / 100;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Core functions
  evaluateForAnchor,
  createAnchor,
  retrieveAnchors,

  // Priority calculation
  calculateRetrievalPriority,

  // Analytics
  getAnchorStats,
  formatAnchorsForPrompt,

  // Maintenance
  applyAnchorDecay,

  // Config
  ANCHOR_CONFIG
};
