/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RATE LIMITER - WebSocket & Voice Endpoint Protection
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Prevents abuse of voice endpoints with configurable rate limits.
 *
 * LIMITS:
 * - Connections per IP: 5 per minute
 * - Turns per session: 60 per minute
 * - Audio bytes per session: 50MB per hour
 * - STT calls per session: 120 per hour
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode - Production Hardening
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const RATE_LIMITS = {
  // Connection limits (per IP)
  connections: {
    windowMs: 60 * 1000,      // 1 minute
    max: 5,                    // 5 connections per minute per IP
    message: 'Too many connections. Please wait a moment.'
  },

  // Turn limits (per session)
  turns: {
    windowMs: 60 * 1000,      // 1 minute
    max: 60,                   // 60 turns per minute
    message: 'Too many requests. Please slow down.'
  },

  // Audio data limits (per session)
  audioBytes: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50 * 1024 * 1024,    // 50MB per hour
    message: 'Audio quota exceeded. Please try again later.'
  },

  // STT API calls (per session - costs money)
  sttCalls: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 120,                  // 120 STT calls per hour
    message: 'Transcription limit reached. Please try again later.'
  },

  // TTS API calls (per session - costs money)
  ttsCalls: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 120,                  // 120 TTS calls per hour
    message: 'Voice synthesis limit reached. Please try again later.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// RATE LIMIT STORAGE
// ═══════════════════════════════════════════════════════════════════════════════

// In-memory storage (use Redis in production for multi-instance)
const ipLimits = new Map();      // IP -> { connections: [], ... }
const sessionLimits = new Map(); // sessionId -> { turns: [], audioBytes: 0, ... }

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Clean expired entries from a timestamps array
 * @param {number[]} timestamps - Array of timestamps
 * @param {number} windowMs - Window in milliseconds
 * @returns {number[]} - Filtered timestamps
 */
function cleanExpired(timestamps, windowMs) {
  const now = Date.now();
  return timestamps.filter(ts => now - ts < windowMs);
}

/**
 * Get client IP from WebSocket request
 * @param {Object} req - HTTP request from ws connection
 * @returns {string} - Client IP
 */
export function getClientIP(req) {
  // Check for forwarded headers (reverse proxy)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Check for real IP header (nginx)
  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return realIP;
  }

  // Fallback to socket address
  return req.socket?.remoteAddress || 'unknown';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONNECTION RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if IP can create a new connection
 * @param {string} ip - Client IP
 * @returns {Object} - { allowed: boolean, remaining: number, message?: string }
 */
export function checkConnectionLimit(ip) {
  const config = RATE_LIMITS.connections;
  const now = Date.now();

  // Get or create IP record
  if (!ipLimits.has(ip)) {
    ipLimits.set(ip, { connections: [] });
  }

  const record = ipLimits.get(ip);

  // Clean expired
  record.connections = cleanExpired(record.connections, config.windowMs);

  // Check limit
  if (record.connections.length >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((record.connections[0] + config.windowMs - now) / 1000),
      message: config.message
    };
  }

  // Record connection
  record.connections.push(now);

  return {
    allowed: true,
    remaining: config.max - record.connections.length
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize rate limits for a new session
 * @param {string} sessionId - Session ID
 */
export function initSessionLimits(sessionId) {
  sessionLimits.set(sessionId, {
    turns: [],
    audioBytes: { timestamps: [], bytes: [] },
    sttCalls: [],
    ttsCalls: [],
    createdAt: Date.now()
  });
}

/**
 * Check and record a turn
 * @param {string} sessionId - Session ID
 * @returns {Object} - { allowed: boolean, remaining: number, message?: string }
 */
export function checkTurnLimit(sessionId) {
  const config = RATE_LIMITS.turns;
  const now = Date.now();

  const record = sessionLimits.get(sessionId);
  if (!record) {
    return { allowed: false, message: 'Session not found' };
  }

  // Clean expired
  record.turns = cleanExpired(record.turns, config.windowMs);

  // Check limit
  if (record.turns.length >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((record.turns[0] + config.windowMs - now) / 1000),
      message: config.message
    };
  }

  // Record turn
  record.turns.push(now);

  return {
    allowed: true,
    remaining: config.max - record.turns.length
  };
}

/**
 * Check and record audio bytes
 * @param {string} sessionId - Session ID
 * @param {number} bytes - Bytes received
 * @returns {Object} - { allowed: boolean, remaining: number, message?: string }
 */
export function checkAudioLimit(sessionId, bytes) {
  const config = RATE_LIMITS.audioBytes;
  const now = Date.now();

  const record = sessionLimits.get(sessionId);
  if (!record) {
    return { allowed: false, message: 'Session not found' };
  }

  // Clean expired and sum bytes
  const validIndices = [];
  let totalBytes = 0;

  for (let i = 0; i < record.audioBytes.timestamps.length; i++) {
    if (now - record.audioBytes.timestamps[i] < config.windowMs) {
      validIndices.push(i);
      totalBytes += record.audioBytes.bytes[i];
    }
  }

  record.audioBytes.timestamps = validIndices.map(i => record.audioBytes.timestamps[i]);
  record.audioBytes.bytes = validIndices.map(i => record.audioBytes.bytes[i]);

  // Check limit
  if (totalBytes + bytes > config.max) {
    return {
      allowed: false,
      remaining: Math.max(0, config.max - totalBytes),
      message: config.message
    };
  }

  // Record bytes
  record.audioBytes.timestamps.push(now);
  record.audioBytes.bytes.push(bytes);

  return {
    allowed: true,
    remaining: config.max - totalBytes - bytes
  };
}

/**
 * Check and record STT call
 * @param {string} sessionId - Session ID
 * @returns {Object} - { allowed: boolean, remaining: number, message?: string }
 */
export function checkSTTLimit(sessionId) {
  const config = RATE_LIMITS.sttCalls;
  const now = Date.now();

  const record = sessionLimits.get(sessionId);
  if (!record) {
    return { allowed: false, message: 'Session not found' };
  }

  // Clean expired
  record.sttCalls = cleanExpired(record.sttCalls, config.windowMs);

  // Check limit
  if (record.sttCalls.length >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((record.sttCalls[0] + config.windowMs - now) / 1000),
      message: config.message
    };
  }

  // Record call
  record.sttCalls.push(now);

  return {
    allowed: true,
    remaining: config.max - record.sttCalls.length
  };
}

/**
 * Check and record TTS call
 * @param {string} sessionId - Session ID
 * @returns {Object} - { allowed: boolean, remaining: number, message?: string }
 */
export function checkTTSLimit(sessionId) {
  const config = RATE_LIMITS.ttsCalls;
  const now = Date.now();

  const record = sessionLimits.get(sessionId);
  if (!record) {
    return { allowed: false, message: 'Session not found' };
  }

  // Clean expired
  record.ttsCalls = cleanExpired(record.ttsCalls, config.windowMs);

  // Check limit
  if (record.ttsCalls.length >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((record.ttsCalls[0] + config.windowMs - now) / 1000),
      message: config.message
    };
  }

  // Record call
  record.ttsCalls.push(now);

  return {
    allowed: true,
    remaining: config.max - record.ttsCalls.length
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Clean up session rate limits
 * @param {string} sessionId - Session ID
 */
export function cleanupSession(sessionId) {
  sessionLimits.delete(sessionId);
}

/**
 * Clean up old IP records (run periodically)
 */
export function cleanupOldRecords() {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour

  // Clean IP records
  for (const [ip, record] of ipLimits.entries()) {
    record.connections = cleanExpired(record.connections, RATE_LIMITS.connections.windowMs);
    if (record.connections.length === 0) {
      ipLimits.delete(ip);
    }
  }

  // Clean stale sessions
  for (const [sessionId, record] of sessionLimits.entries()) {
    if (now - record.createdAt > maxAge * 4) { // 4 hours
      sessionLimits.delete(sessionId);
    }
  }
}

// Periodic cleanup
setInterval(cleanupOldRecords, 5 * 60 * 1000); // Every 5 minutes

// ═══════════════════════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get rate limiter statistics
 * @returns {Object} - Stats
 */
export function getRateLimiterStats() {
  return {
    activeIPs: ipLimits.size,
    activeSessions: sessionLimits.size,
    limits: RATE_LIMITS
  };
}

/**
 * Get session usage stats
 * @param {string} sessionId - Session ID
 * @returns {Object|null} - Usage stats
 */
export function getSessionUsage(sessionId) {
  const record = sessionLimits.get(sessionId);
  if (!record) return null;

  const now = Date.now();

  return {
    turns: {
      used: cleanExpired(record.turns, RATE_LIMITS.turns.windowMs).length,
      limit: RATE_LIMITS.turns.max
    },
    sttCalls: {
      used: cleanExpired(record.sttCalls, RATE_LIMITS.sttCalls.windowMs).length,
      limit: RATE_LIMITS.sttCalls.max
    },
    ttsCalls: {
      used: cleanExpired(record.ttsCalls, RATE_LIMITS.ttsCalls.windowMs).length,
      limit: RATE_LIMITS.ttsCalls.max
    },
    sessionAge: now - record.createdAt
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  getClientIP,
  checkConnectionLimit,
  initSessionLimits,
  checkTurnLimit,
  checkAudioLimit,
  checkSTTLimit,
  checkTTSLimit,
  cleanupSession,
  getRateLimiterStats,
  getSessionUsage,
  RATE_LIMITS
};
