/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DEBUG SERVER - REST API for Behavior Debugging & Lab Mode
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Provides REST endpoints for:
 * - Viewing user preferences and session stats
 * - Setting lab overrides for live behavior tuning
 * - Resetting behavior data
 *
 * Endpoints:
 * GET  /debug/behavior                   - Get all user prefs + sessions
 * GET  /debug/user/:userId               - Get specific user data
 * POST /debug/reset-behavior             - Reset all behavior data
 * GET  /debug/lab-overrides              - Get all lab overrides
 * POST /debug/lab-overrides/:userId      - Set lab overrides for user
 * DELETE /debug/lab-overrides/:userId    - Clear lab overrides for user
 * POST /debug/reset-lab                  - Reset all lab overrides
 *
 * Run alongside WebSocket server on a separate port (default: 8090)
 *
 * Created: December 21, 2025
 */

import express from 'express';
import cors from 'cors';
import { getAllUserPreferences, resetAllUserPreferences, getUserPreferences } from './user/userPreferencesStore.js';
import { getAllSessions, resetAllSessions, getSession, getSessionsByUser } from './session/sessionStore.js';
import {
  getLabOverrides,
  setLabOverrides,
  clearLabOverrides,
  getAllLabOverrides,
  resetAllLabOverrides
} from './behavior/labOverridesStore.js';
import { getBehaviorForUserEmotion } from './behavior/behaviorEngine.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * GET /debug/behavior
 * Get all user preferences and session data
 */
app.get('/debug/behavior', (req, res) => {
  try {
    const users = getAllUserPreferences();
    const sessions = getAllSessions();
    const labOverrides = getAllLabOverrides();

    res.json({
      success: true,
      data: {
        users,
        sessions,
        labOverrides,
        counts: {
          users: users.length,
          sessions: sessions.length,
          labOverrides: labOverrides.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /debug/user/:userId
 * Get detailed data for a specific user
 */
app.get('/debug/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const prefs = getUserPreferences(userId);
    const sessions = getSessionsByUser(userId);
    const overrides = getLabOverrides(userId);

    // Compute current behavior (neutral emotion as baseline)
    const behavior = getBehaviorForUserEmotion({
      userId,
      emotion: { primary: 'neutral', confidence: 0.5 },
      sessionStats: sessions[0]?.stats || null
    });

    res.json({
      success: true,
      data: {
        userId,
        prefs,
        sessions,
        labOverrides: overrides,
        currentBehavior: behavior
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /debug/reset-behavior
 * Reset all user preferences and sessions
 */
app.post('/debug/reset-behavior', (req, res) => {
  try {
    resetAllUserPreferences();
    resetAllSessions();
    resetAllLabOverrides();

    res.json({
      success: true,
      message: 'All behavior data reset'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /debug/lab-overrides
 * Get all active lab overrides
 */
app.get('/debug/lab-overrides', (req, res) => {
  try {
    const overrides = getAllLabOverrides();
    res.json({
      success: true,
      data: overrides
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /debug/lab-overrides/:userId
 * Get lab overrides for a specific user
 */
app.get('/debug/lab-overrides/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const overrides = getLabOverrides(userId);

    res.json({
      success: true,
      data: {
        userId,
        overrides: overrides || { message: 'No overrides set' }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /debug/lab-overrides/:userId
 * Set lab overrides for a user
 *
 * Body: {
 *   backchannelFrequency?: number (0-1),
 *   maxResponseTokens?: number (20-600),
 *   pauseScale?: number (0.4-2.0),
 *   adviceBias?: number (0-1),
 *   style?: string
 * }
 */
app.post('/debug/lab-overrides/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const overrides = req.body || {};

    const result = setLabOverrides(userId, overrides);

    res.json({
      success: true,
      data: {
        userId,
        overrides: result
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /debug/lab-overrides/:userId
 * Clear lab overrides for a user
 */
app.delete('/debug/lab-overrides/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const cleared = clearLabOverrides(userId);

    res.json({
      success: true,
      data: {
        userId,
        cleared
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /debug/reset-lab
 * Reset all lab overrides
 */
app.post('/debug/reset-lab', (req, res) => {
  try {
    resetAllLabOverrides();

    res.json({
      success: true,
      message: 'All lab overrides reset'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /debug/compute-behavior/:userId
 * Compute behavior for a user with given emotion
 *
 * Query params:
 *   emotion: primary emotion (default: neutral)
 *   confidence: emotion confidence (default: 0.5)
 */
app.get('/debug/compute-behavior/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const emotion = req.query.emotion || 'neutral';
    const confidence = parseFloat(req.query.confidence) || 0.5;

    const sessions = getSessionsByUser(userId);
    const behavior = getBehaviorForUserEmotion({
      userId,
      emotion: { primary: emotion, confidence },
      sessionStats: sessions[0]?.stats || null
    });

    res.json({
      success: true,
      data: {
        userId,
        emotion: { primary: emotion, confidence },
        behavior
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Health check
 */
app.get('/debug/health', (req, res) => {
  res.json({
    success: true,
    service: 'Luna Debug Server',
    timestamp: new Date().toISOString()
  });
});

/**
 * Start the debug server
 *
 * @param {number} port - Port to listen on (default: 8090)
 */
export function startDebugServer(port = 8090) {
  app.listen(port, () => {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('  LUNA DEBUG SERVER');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`  REST API: http://localhost:${port}`);
    console.log('');
    console.log('  Endpoints:');
    console.log(`  GET  http://localhost:${port}/debug/behavior`);
    console.log(`  GET  http://localhost:${port}/debug/user/:userId`);
    console.log(`  POST http://localhost:${port}/debug/lab-overrides/:userId`);
    console.log('═══════════════════════════════════════════════════════════════════');
  });
}

export default { startDebugServer };
