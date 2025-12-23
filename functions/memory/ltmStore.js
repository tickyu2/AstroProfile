/**
 * LTM Store - Long-Term Memory Storage Helper
 * ============================================
 * Stores consolidated memories in user_ltm table.
 * Uses client injection pattern for testability.
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Store an entry in Long-Term Memory
 *
 * @param {Object} client - pg client (must support query method)
 * @param {Object} params - Entry parameters
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} params.content - Memory content
 * @param {Array} params.embedding - Vector embedding (optional)
 * @param {Object} params.source - Source metadata { stmIds, type }
 * @param {Object} params.meta - Additional metadata
 * @returns {string} - New LTM entry ID
 */
async function storeLTMEntry(client, {
  userId,
  profileId,
  content,
  embedding = null,
  source = {},
  meta = {}
}) {
  const id = uuidv4();

  const {
    contentType = 'consolidated',
    emotionalEssence = null,
    coreThemes = null,
    patternRecognized = null,
    importanceScore = 0.6,
    constitutionalElement = null
  } = meta;

  const sourceStmIds = source.stmIds || source.stm_ids || null;
  const consolidationCount = sourceStmIds ? sourceStmIds.length : 1;

  const query = `
    INSERT INTO user_ltm (
      id, user_id, profile_id, content, content_type,
      source_stm_ids, consolidation_count, importance_score,
      constitutional_element, embedding, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
    )
    RETURNING id
  `;

  const params = [
    id,
    userId,
    profileId,
    content,
    contentType,
    sourceStmIds,
    consolidationCount,
    importanceScore,
    constitutionalElement,
    embedding
  ];

  const result = await client.query(query, params);
  return result.rows[0].id;
}

/**
 * Get LTM entries for a user
 *
 * @param {Object} client - pg client
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} limit - Max entries to return
 * @returns {Array} - LTM entries
 */
async function getLTMEntries(client, userId, profileId, limit = 50) {
  const result = await client.query(
    `SELECT id, content, content_type, importance_score, created_at
     FROM user_ltm
     WHERE user_id = $1 AND profile_id = $2
     ORDER BY importance_score DESC, created_at DESC
     LIMIT $3`,
    [userId, profileId, limit]
  );

  return result.rows;
}

/**
 * Reinforce an existing LTM entry
 * Increases importance and reinforcement count
 *
 * @param {Object} client - pg client
 * @param {string} ltmId - LTM entry ID
 * @param {Array} sourceStmIds - New source STM IDs that reinforce this memory
 */
async function reinforceLTMEntry(client, ltmId, sourceStmIds = []) {
  await client.query(
    `UPDATE user_ltm
     SET reinforcement_count = reinforcement_count + 1,
         last_reinforced_at = NOW(),
         importance_score = LEAST(1.0, importance_score + 0.05),
         source_stm_ids = source_stm_ids || $1,
         updated_at = NOW()
     WHERE id = $2`,
    [sourceStmIds, ltmId]
  );
}

/**
 * Mark LTM entry as accessed
 * Updates access count and last accessed timestamp
 *
 * @param {Object} client - pg client
 * @param {string} ltmId - LTM entry ID
 */
async function markLTMAccessed(client, ltmId) {
  await client.query(
    `UPDATE user_ltm
     SET access_count = access_count + 1,
         last_accessed_at = NOW()
     WHERE id = $1`,
    [ltmId]
  );
}

/**
 * Apply decay to old, unaccessed LTM entries
 *
 * @param {Object} client - pg client
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} decayFactor - Factor to multiply importance by (e.g., 0.9)
 * @param {number} minAccessCount - Only decay entries accessed less than this
 * @param {number} daysOld - Only decay entries older than this many days
 * @returns {number} - Number of entries decayed
 */
async function applyLTMDecay(client, userId, profileId, {
  decayFactor = 0.9,
  minAccessCount = 2,
  daysOld = 180,
  minImportance = 0.8 // Don't decay high-importance memories
} = {}) {
  const result = await client.query(
    `UPDATE user_ltm
     SET importance_score = importance_score * $1,
         updated_at = NOW()
     WHERE user_id = $2
       AND profile_id = $3
       AND access_count < $4
       AND created_at < NOW() - ($5 || ' days')::INTERVAL
       AND importance_score < $6
     RETURNING id`,
    [decayFactor, userId, profileId, minAccessCount, daysOld, minImportance]
  );

  return result.rowCount;
}

module.exports = {
  storeLTMEntry,
  getLTMEntries,
  reinforceLTMEntry,
  markLTMAccessed,
  applyLTMDecay
};
