/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TURN LOGGER - Behavior Snapshot Logging for Analysis
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Logs every conversation turn with full behavior snapshots:
 * - Input: audio path, transcript, detected emotion
 * - Behavior: timing, style, backchannel frequency, advice bias
 * - LLM: provider, model, prompt, reply
 * - TTS: provider, profile
 * - Timing: all durations
 *
 * Enables "why did Luna respond like that?" analysis and replay.
 *
 * Storage: JSONL files per user (easy to query, portable)
 *
 * Created: December 21, 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Log directory - create if not exists
 */
const LOG_DIR = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  console.log('[TurnLogger] Created logs directory:', LOG_DIR);
}

/**
 * Log a turn snapshot to JSONL file.
 *
 * @param {Object} session - Voice session
 * @param {Object} turn - Turn data
 * @param {string} turn.rawAudioPath - Path to raw audio file (if kept)
 * @param {string} turn.transcript - STT transcript
 * @param {Object} turn.emotion - Detected emotion { primary, secondary, confidence, mode }
 * @param {Object} turn.behavior - Behavior profile at the time
 * @param {Object} turn.userPrefs - User preferences snapshot
 * @param {string} turn.llmProvider - LLM provider used
 * @param {string} turn.llmModel - LLM model used
 * @param {string} turn.llmPrompt - Full LLM prompt (for debugging)
 * @param {string} turn.reply - LLM reply
 * @param {string} turn.ttsProvider - TTS provider
 * @param {Object} turn.ttsProfile - TTS profile settings
 * @param {number} turn.serDuration - SER processing time
 * @param {number} turn.sttDuration - STT processing time
 * @param {number} turn.llmDuration - LLM processing time
 * @param {number} turn.ttsDuration - TTS processing time
 * @param {number} turn.totalDuration - Total turn time
 */
export function logTurnSnapshot(session, turn) {
  const userId = session.userId || 'anonymous';
  const file = path.join(LOG_DIR, `${userId}.log.jsonl`);

  const snapshot = {
    // Metadata
    timestamp: new Date().toISOString(),
    sessionId: session.sessionId || session.id,
    turnId: session.currentTurnId || 0,
    userId,

    // Input side
    rawAudioPath: turn.rawAudioPath || null,
    sttTranscript: turn.transcript || '',
    serEmotion: turn.emotion || { primary: 'neutral', confidence: 0.5 },

    // Behavior at the time
    behavior: turn.behavior || null,
    userPrefs: turn.userPrefs || null,
    sessionStats: session.stats || null,

    // LLM side
    llmProvider: turn.llmProvider || null,
    llmModel: turn.llmModel || null,
    llmPrompt: turn.llmPrompt || null,
    llmReply: turn.reply || '',

    // TTS side
    ttsProvider: turn.ttsProvider || null,
    ttsProfile: turn.ttsProfile || null,

    // Timing/latency
    serDuration: turn.serDuration || 0,
    sttDuration: turn.sttDuration || 0,
    llmDuration: turn.llmDuration || 0,
    ttsDuration: turn.ttsDuration || 0,
    totalDuration: turn.totalDuration || 0
  };

  try {
    fs.appendFileSync(file, JSON.stringify(snapshot) + '\n', 'utf8');
    console.log(`[TurnLogger] Logged turn ${snapshot.turnId} for ${userId}`);
  } catch (error) {
    console.error('[TurnLogger] Failed to log turn:', error.message);
  }

  return snapshot;
}

/**
 * Get all logged users.
 *
 * @returns {string[]} Array of user IDs with logs
 */
export function getLoggedUsers() {
  if (!fs.existsSync(LOG_DIR)) return [];

  const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.log.jsonl'));
  return files.map(f => f.replace('.log.jsonl', ''));
}

/**
 * Get turn metadata for a user (lightweight list).
 *
 * @param {string} userId - User ID
 * @param {number} limit - Max turns to return (default: 100)
 * @returns {Object[]} Array of turn metadata
 */
export function getTurnMetadata(userId, limit = 100) {
  const file = path.join(LOG_DIR, `${userId}.log.jsonl`);
  if (!fs.existsSync(file)) return [];

  const content = fs.readFileSync(file, 'utf8').trim();
  if (!content) return [];

  const lines = content.split('\n');
  const turns = lines.map((line, index) => {
    try {
      const s = JSON.parse(line);
      return {
        index,
        timestamp: s.timestamp,
        sessionId: s.sessionId,
        turnId: s.turnId,
        emotion: s.serEmotion,
        behaviorStyle: s.behavior?.style || 'unknown',
        llmProvider: s.llmProvider,
        ttsProvider: s.ttsProvider,
        sttTranscriptPreview: (s.sttTranscript || '').slice(0, 80),
        replyPreview: (s.llmReply || '').slice(0, 80),
        totalDuration: s.totalDuration
      };
    } catch (e) {
      return { index, error: 'Parse error' };
    }
  });

  // Return newest first, limited
  return turns.reverse().slice(0, limit);
}

/**
 * Get full snapshot for a specific turn.
 *
 * @param {string} userId - User ID
 * @param {number} index - Turn index (from original order)
 * @returns {Object|null} Full snapshot or null
 */
export function getTurnSnapshot(userId, index) {
  const file = path.join(LOG_DIR, `${userId}.log.jsonl`);
  if (!fs.existsSync(file)) return null;

  const content = fs.readFileSync(file, 'utf8').trim();
  if (!content) return null;

  const lines = content.split('\n');
  if (index < 0 || index >= lines.length) return null;

  try {
    return JSON.parse(lines[index]);
  } catch (e) {
    return null;
  }
}

/**
 * Get turn count for a user.
 *
 * @param {string} userId - User ID
 * @returns {number} Number of logged turns
 */
export function getTurnCount(userId) {
  const file = path.join(LOG_DIR, `${userId}.log.jsonl`);
  if (!fs.existsSync(file)) return 0;

  const content = fs.readFileSync(file, 'utf8').trim();
  if (!content) return 0;

  return content.split('\n').length;
}

/**
 * Get session summary for a user.
 *
 * @param {string} userId - User ID
 * @returns {Object} Summary statistics
 */
export function getUserSummary(userId) {
  const file = path.join(LOG_DIR, `${userId}.log.jsonl`);
  if (!fs.existsSync(file)) {
    return { turns: 0, sessions: 0, emotions: {}, providers: {} };
  }

  const content = fs.readFileSync(file, 'utf8').trim();
  if (!content) {
    return { turns: 0, sessions: 0, emotions: {}, providers: {} };
  }

  const lines = content.split('\n');
  const sessions = new Set();
  const emotions = {};
  const providers = {};
  let totalDuration = 0;

  lines.forEach(line => {
    try {
      const s = JSON.parse(line);
      sessions.add(s.sessionId);

      const emotion = s.serEmotion?.primary || 'unknown';
      emotions[emotion] = (emotions[emotion] || 0) + 1;

      const provider = s.llmProvider || 'unknown';
      providers[provider] = (providers[provider] || 0) + 1;

      totalDuration += s.totalDuration || 0;
    } catch (e) {
      // Skip parse errors
    }
  });

  return {
    turns: lines.length,
    sessions: sessions.size,
    emotions,
    providers,
    totalDuration,
    avgDuration: lines.length > 0 ? Math.round(totalDuration / lines.length) : 0
  };
}

/**
 * Clear logs for a user.
 *
 * @param {string} userId - User ID
 * @returns {boolean} Success
 */
export function clearUserLogs(userId) {
  const file = path.join(LOG_DIR, `${userId}.log.jsonl`);
  if (!fs.existsSync(file)) return false;

  try {
    fs.unlinkSync(file);
    console.log(`[TurnLogger] Cleared logs for ${userId}`);
    return true;
  } catch (error) {
    console.error('[TurnLogger] Failed to clear logs:', error.message);
    return false;
  }
}

/**
 * Clear all logs.
 *
 * @returns {number} Number of files deleted
 */
export function clearAllLogs() {
  if (!fs.existsSync(LOG_DIR)) return 0;

  const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.log.jsonl'));
  let count = 0;

  files.forEach(f => {
    try {
      fs.unlinkSync(path.join(LOG_DIR, f));
      count++;
    } catch (e) {
      // Skip errors
    }
  });

  console.log(`[TurnLogger] Cleared ${count} log files`);
  return count;
}

export default {
  logTurnSnapshot,
  getLoggedUsers,
  getTurnMetadata,
  getTurnSnapshot,
  getTurnCount,
  getUserSummary,
  clearUserLogs,
  clearAllLogs
};
