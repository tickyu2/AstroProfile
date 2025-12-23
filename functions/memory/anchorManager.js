/**
 * Anchor Manager - Happiness Anchor Operations
 * =============================================
 * Manages happiness anchors with compound growth.
 * Uses client injection pattern for testability.
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 */

const { v4: uuidv4 } = require('uuid');

// Configuration
const CONFIG = {
  ANCHOR_COMPOUND_PROB: 0.7,       // 70% chance to strengthen each night
  ANCHOR_COMPOUND_INCREMENT: 0.1,  // Strength increase per compound
  ANCHOR_MAX_STRENGTH: 5.0         // Maximum anchor strength
};

/**
 * Get anchors for a user
 *
 * @param {Object} client - pg client
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} limit - Max anchors to return
 * @returns {Array} - Anchor entries
 */
async function getAnchorsForUser(client, userId, profileId, limit = 10) {
  const result = await client.query(
    `SELECT id, content, anchor_type, strength, recall_count, last_recalled_at, created_at
     FROM happiness_anchors
     WHERE user_id = $1 AND profile_id = $2
     ORDER BY strength DESC, recall_count DESC
     LIMIT $3`,
    [userId, profileId, limit]
  );

  return result.rows || [];
}

/**
 * Update an anchor's strength
 *
 * @param {Object} client - pg client
 * @param {string} anchorId - Anchor ID
 * @param {number} newStrength - New strength value
 */
async function updateAnchorStrength(client, anchorId, newStrength) {
  await client.query(
    `UPDATE happiness_anchors
     SET strength = $1, updated_at = NOW()
     WHERE id = $2`,
    [Math.min(newStrength, CONFIG.ANCHOR_MAX_STRENGTH), anchorId]
  );
}

/**
 * Create a new happiness anchor
 *
 * @param {Object} client - pg client
 * @param {Object} params - Anchor parameters
 * @returns {string} - New anchor ID
 */
async function createAnchor(client, {
  userId,
  profileId,
  content,
  anchorType = 'memory',
  strength = 1.0,
  sourceStmIds = []
}) {
  const id = uuidv4();

  await client.query(
    `INSERT INTO happiness_anchors
     (id, user_id, profile_id, content, anchor_type, strength, source_stm_ids, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
    [id, userId, profileId, content, anchorType, strength, sourceStmIds]
  );

  return id;
}

/**
 * Record anchor recall (when Luna references it in conversation)
 *
 * @param {Object} client - pg client
 * @param {string} anchorId - Anchor ID
 */
async function recordAnchorRecall(client, anchorId) {
  await client.query(
    `UPDATE happiness_anchors
     SET recall_count = recall_count + 1,
         last_recalled_at = NOW()
     WHERE id = $1`,
    [anchorId]
  );
}

/**
 * Strengthen all anchors (nightly compound growth)
 * Called by consolidation scheduler
 *
 * @param {Object} client - pg client
 * @param {number} runId - Consolidation run ID for audit
 * @returns {number} - Number of anchors strengthened
 */
async function strengthenAllAnchors(client, runId = null) {
  let strengthened = 0;

  // Get all anchors below max strength
  const anchorsResult = await client.query(
    `SELECT id, user_id, profile_id, strength
     FROM happiness_anchors
     WHERE strength < $1`,
    [CONFIG.ANCHOR_MAX_STRENGTH]
  );

  for (const anchor of anchorsResult.rows) {
    // 70% chance to compound each night (simulates natural memory reinforcement)
    if (Math.random() < CONFIG.ANCHOR_COMPOUND_PROB) {
      const newStrength = Math.min(
        CONFIG.ANCHOR_MAX_STRENGTH,
        anchor.strength + CONFIG.ANCHOR_COMPOUND_INCREMENT
      );

      await updateAnchorStrength(client, anchor.id, newStrength);

      // Log for audit if runId provided
      if (runId) {
        await client.query(
          `INSERT INTO anchor_strength_log
           (user_id, profile_id, anchor_id, previous_strength, new_strength, reason, consolidation_run_id)
           VALUES ($1, $2, $3, $4, $5, 'nightly_compound', $6)`,
          [anchor.user_id, anchor.profile_id, anchor.id, anchor.strength, newStrength, runId]
        );
      }

      strengthened++;
    }
  }

  return strengthened;
}

/**
 * Get top anchors by strength for prompt injection
 *
 * @param {Object} client - pg client
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} limit - Number of anchors
 * @returns {Array} - Formatted anchor strings
 */
async function getTopAnchorsForPrompt(client, userId, profileId, limit = 3) {
  const anchors = await getAnchorsForUser(client, userId, profileId, limit);

  return anchors.map(a => ({
    content: a.content,
    strength: a.strength,
    type: a.anchor_type,
    recallCount: a.recall_count
  }));
}

module.exports = {
  getAnchorsForUser,
  updateAnchorStrength,
  createAnchor,
  recordAnchorRecall,
  strengthenAllAnchors,
  getTopAnchorsForPrompt,
  CONFIG
};
