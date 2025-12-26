/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SESSION STORE - In-Memory Session Management
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages voice conversation sessions for debugging and lab mode.
 * Each session tracks:
 * - User ID
 * - Session statistics (turns, backchannels, interrupts)
 * - Conversation history
 * - Current behavior profile
 *
 * Created: December 21, 2025
 */

/**
 * In-memory session storage
 * In production, consider Redis or database persistence
 */
const sessions = new Map();

/**
 * Create a new session
 *
 * @param {Object} options
 * @param {string} options.sessionId - Unique session ID
 * @param {string} options.userId - User ID for preference lookup
 * @returns {Object} New session object
 */
export function createSession({ sessionId, userId = 'anonymous' }) {
  const session = {
    id: sessionId,
    userId,
    createdAt: Date.now(),
    stats: {
      backchannelsUsed: 0,
      backchannelsOverSpoken: 0,
      backchannelsAppreciated: 0,
      turns: 0,
      interruptions: 0,
      longSilences: 0
    },
    history: [],
    lastEmotion: null,
    lastBehavior: null
  };

  sessions.set(sessionId, session);
  console.log(`[SessionStore] Created session: ${sessionId} for user: ${userId}`);
  return session;
}

/**
 * Get a session by ID
 *
 * @param {string} sessionId
 * @returns {Object|null} Session object or null
 */
export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 * Update session data
 *
 * @param {string} sessionId
 * @param {Object} updates - Partial updates to merge
 * @returns {Object|null} Updated session or null
 */
export function updateSession(sessionId, updates) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  // Merge updates
  if (updates.stats) {
    session.stats = { ...session.stats, ...updates.stats };
  }
  if (updates.lastEmotion !== undefined) {
    session.lastEmotion = updates.lastEmotion;
  }
  if (updates.lastBehavior !== undefined) {
    session.lastBehavior = updates.lastBehavior;
  }
  if (updates.history) {
    session.history = updates.history;
  }

  sessions.set(sessionId, session);
  return session;
}

/**
 * Delete a session
 *
 * @param {string} sessionId
 * @returns {boolean} Whether session was deleted
 */
export function deleteSession(sessionId) {
  const deleted = sessions.delete(sessionId);
  if (deleted) {
    console.log(`[SessionStore] Deleted session: ${sessionId}`);
  }
  return deleted;
}

/**
 * Get all sessions (for debugging)
 *
 * @returns {Array} Array of all sessions
 */
export function getAllSessions() {
  return Array.from(sessions.values());
}

/**
 * Get sessions for a specific user
 *
 * @param {string} userId
 * @returns {Array} Array of sessions for user
 */
export function getSessionsByUser(userId) {
  return Array.from(sessions.values()).filter(s => s.userId === userId);
}

/**
 * Reset all sessions (for debugging)
 */
export function resetAllSessions() {
  const count = sessions.size;
  sessions.clear();
  console.log(`[SessionStore] Reset ${count} sessions`);
}

/**
 * Get session count
 *
 * @returns {number} Number of active sessions
 */
export function getSessionCount() {
  return sessions.size;
}

/**
 * Cleanup old sessions (call periodically)
 *
 * @param {number} maxAgeMs - Maximum session age in milliseconds
 * @returns {number} Number of sessions cleaned up
 */
export function cleanupOldSessions(maxAgeMs = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  let cleaned = 0;

  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.createdAt > maxAgeMs) {
      sessions.delete(sessionId);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`[SessionStore] Cleaned up ${cleaned} old sessions`);
  }

  return cleaned;
}

export default {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  getAllSessions,
  getSessionsByUser,
  resetAllSessions,
  getSessionCount,
  cleanupOldSessions
};
