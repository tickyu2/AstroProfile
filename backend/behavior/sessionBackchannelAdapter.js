/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SESSION BACKCHANNEL ADAPTER - Real-Time Session-Level Adaptation
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Adapts backchannel frequency based on current session dynamics.
 * Unlike user preferences (learned over many sessions), this adapts
 * to how the conversation is going right now.
 *
 * Signals tracked:
 * - Backchannels played
 * - User speaking over backchannels (rejection)
 * - User pausing after backchannels (appreciation)
 * - Overall conversation pace
 *
 * This is the "micro-brain" that adjusts within a single conversation.
 *
 * Created: December 21, 2025
 */

/**
 * Session stats schema
 */
export const DEFAULT_SESSION_STATS = {
  // Backchannel tracking
  backchannelsUsed: 0,
  backchannelsOverSpoken: 0,    // User spoke over/interrupted backchannel
  backchannelsAppreciated: 0,   // User paused then continued after backchannel

  // Response tracking
  responsesCompleted: 0,
  responsesInterrupted: 0,

  // Timing tracking
  averagePauseDuration: 0,
  totalTurns: 0,

  // Session metadata
  startTime: null,
  lastActivityTime: null
};

/**
 * Create a new session stats object.
 *
 * @returns {Object} Fresh session stats
 */
export function createSessionStats() {
  return {
    ...DEFAULT_SESSION_STATS,
    startTime: Date.now(),
    lastActivityTime: Date.now()
  };
}

/**
 * Calculate backchannel bias based on session statistics.
 * Returns a bias value to add to base backchannel frequency.
 *
 * @param {Object} stats - Session statistics
 * @returns {number} Bias value (-0.2 to +0.1)
 */
export function getSessionBackchannelBias(stats) {
  if (!stats || stats.backchannelsUsed < 5) {
    // Not enough data yet
    return 0;
  }

  const { backchannelsUsed, backchannelsOverSpoken, backchannelsAppreciated } = stats;

  // Calculate rejection ratio
  const rejectionRatio = backchannelsOverSpoken / backchannelsUsed;

  // Calculate appreciation ratio
  const appreciationRatio = backchannelsAppreciated / backchannelsUsed;

  let bias = 0;

  // Strong negative signal: user frequently speaks over backchannels
  if (rejectionRatio > 0.5) {
    bias = -0.15;
  } else if (rejectionRatio > 0.3) {
    bias = -0.08;
  } else if (rejectionRatio > 0.2) {
    bias = -0.04;
  }

  // Positive signal: user appreciates backchannels (pauses after them)
  if (appreciationRatio > 0.6 && backchannelsUsed > 10) {
    bias += 0.05;
  } else if (appreciationRatio > 0.4 && backchannelsUsed > 8) {
    bias += 0.03;
  }

  // Clamp to valid range
  return Math.max(-0.2, Math.min(0.1, bias));
}

/**
 * Calculate response length bias based on session statistics.
 *
 * @param {Object} stats - Session statistics
 * @returns {number} Bias value (-0.2 to +0.1)
 */
export function getSessionResponseLengthBias(stats) {
  if (!stats || stats.responsesCompleted + stats.responsesInterrupted < 3) {
    return 0;
  }

  const total = stats.responsesCompleted + stats.responsesInterrupted;
  const interruptionRate = stats.responsesInterrupted / total;

  // High interruption rate = prefer shorter responses
  if (interruptionRate > 0.5) {
    return -0.2;
  } else if (interruptionRate > 0.3) {
    return -0.1;
  } else if (interruptionRate > 0.2) {
    return -0.05;
  }

  // Low interruption rate = responses are acceptable length
  if (interruptionRate < 0.1 && total > 5) {
    return 0.05;
  }

  return 0;
}

/**
 * Calculate pause tolerance bias based on average pause duration.
 *
 * @param {Object} stats - Session statistics
 * @returns {number} Bias value (-0.1 to +0.15)
 */
export function getSessionPauseToleranceBias(stats) {
  if (!stats || stats.totalTurns < 3) {
    return 0;
  }

  const avgPause = stats.averagePauseDuration;

  // Very long average pauses = user is comfortable with silence
  if (avgPause > 2500) {
    return 0.15;
  } else if (avgPause > 2000) {
    return 0.08;
  } else if (avgPause > 1500) {
    return 0.03;
  }

  // Very short pauses = user wants quick responses
  if (avgPause < 800) {
    return -0.1;
  } else if (avgPause < 1000) {
    return -0.05;
  }

  return 0;
}

/**
 * Get all session biases combined.
 *
 * @param {Object} stats - Session statistics
 * @returns {Object} All session biases
 */
export function getSessionBiases(stats) {
  return {
    backchannelBias: getSessionBackchannelBias(stats),
    responseLengthBias: getSessionResponseLengthBias(stats),
    pauseToleranceBias: getSessionPauseToleranceBias(stats)
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAT UPDATE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Record that a backchannel was played.
 *
 * @param {Object} stats - Session stats to update
 */
export function recordBackchannelPlayed(stats) {
  stats.backchannelsUsed += 1;
  stats.lastActivityTime = Date.now();
}

/**
 * Record that user spoke over a backchannel (rejection).
 *
 * @param {Object} stats - Session stats to update
 */
export function recordBackchannelOverSpoken(stats) {
  stats.backchannelsOverSpoken += 1;
  stats.lastActivityTime = Date.now();
}

/**
 * Record that user paused after backchannel then continued (appreciation).
 *
 * @param {Object} stats - Session stats to update
 */
export function recordBackchannelAppreciated(stats) {
  stats.backchannelsAppreciated += 1;
  stats.lastActivityTime = Date.now();
}

/**
 * Record that a Luna response completed without interruption.
 *
 * @param {Object} stats - Session stats to update
 */
export function recordResponseCompleted(stats) {
  stats.responsesCompleted += 1;
  stats.lastActivityTime = Date.now();
}

/**
 * Record that user interrupted a Luna response.
 *
 * @param {Object} stats - Session stats to update
 */
export function recordResponseInterrupted(stats) {
  stats.responsesInterrupted += 1;
  stats.lastActivityTime = Date.now();
}

/**
 * Record pause duration and update average.
 *
 * @param {Object} stats - Session stats to update
 * @param {number} pauseMs - Pause duration in milliseconds
 */
export function recordPauseDuration(stats, pauseMs) {
  stats.totalTurns += 1;
  // Running average
  stats.averagePauseDuration =
    ((stats.averagePauseDuration * (stats.totalTurns - 1)) + pauseMs) / stats.totalTurns;
  stats.lastActivityTime = Date.now();
}

/**
 * Get a summary of session dynamics.
 * Useful for debugging and logging.
 *
 * @param {Object} stats - Session statistics
 * @returns {Object} Summary
 */
export function getSessionSummary(stats) {
  const biases = getSessionBiases(stats);

  return {
    turns: stats.totalTurns,
    backchannels: {
      used: stats.backchannelsUsed,
      rejected: stats.backchannelsOverSpoken,
      appreciated: stats.backchannelsAppreciated,
      bias: biases.backchannelBias
    },
    responses: {
      completed: stats.responsesCompleted,
      interrupted: stats.responsesInterrupted,
      bias: biases.responseLengthBias
    },
    pacing: {
      avgPause: Math.round(stats.averagePauseDuration),
      bias: biases.pauseToleranceBias
    },
    sessionDuration: stats.startTime ? Date.now() - stats.startTime : 0
  };
}

export default {
  DEFAULT_SESSION_STATS,
  createSessionStats,
  getSessionBackchannelBias,
  getSessionResponseLengthBias,
  getSessionPauseToleranceBias,
  getSessionBiases,
  recordBackchannelPlayed,
  recordBackchannelOverSpoken,
  recordBackchannelAppreciated,
  recordResponseCompleted,
  recordResponseInterrupted,
  recordPauseDuration,
  getSessionSummary
};
