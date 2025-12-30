/**
 * Dashboard API Routes
 * Provides data endpoints for the GENESIS Dashboard
 */

import express from 'express';
import { phase3Integration } from '../ser/archetypeIntegration.phase3.js';

const router = express.Router();

// Store conversation sessions in memory (use DB in production)
const conversationSessions = new Map();

/**
 * POST /api/dashboard/message
 * Process and store a single message
 */
router.post('/message', async (req, res) => {
  try {
    const { text, voiceEmotion, sessionId = 'default', userId } = req.body;

    if (!text || !voiceEmotion) {
      return res.status(400).json({
        error: 'Missing required fields: text and voiceEmotion'
      });
    }

    // Get or create session
    if (!conversationSessions.has(sessionId)) {
      conversationSessions.set(sessionId, []);
    }
    const history = conversationSessions.get(sessionId);

    // Process with GENESIS
    const result = phase3Integration.processUtterance(
      text,
      voiceEmotion,
      history,
      { userId, sessionId }
    );

    // Add to history
    history.push(result);

    // Keep only last 100 messages
    if (history.length > 100) {
      history.shift();
    }

    res.json(result);
  } catch (error) {
    console.error('[Dashboard] Error processing message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/dashboard/session/:sessionId
 * Get full conversation history for a session
 */
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = conversationSessions.get(sessionId) || [];

  res.json({
    sessionId,
    messageCount: history.length,
    messages: history
  });
});

/**
 * GET /api/dashboard/sessions
 * List all active sessions
 */
router.get('/sessions', (req, res) => {
  const sessions = [];

  for (const [sessionId, history] of conversationSessions.entries()) {
    if (history.length > 0) {
      const lastMessage = history[history.length - 1];
      sessions.push({
        sessionId,
        messageCount: history.length,
        lastActivity: lastMessage.timestamp,
        lastArchetype: lastMessage.archetype.type
      });
    }
  }

  res.json({ sessions });
});

/**
 * DELETE /api/dashboard/session/:sessionId
 * Clear a session
 */
router.delete('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  conversationSessions.delete(sessionId);

  res.json({ success: true, sessionId });
});

/**
 * GET /api/dashboard/stats
 * Get aggregate statistics across all sessions
 */
router.get('/stats', (req, res) => {
  let totalMessages = 0;
  const archetypeCounts = {};
  const patternCounts = {};
  let totalProcessingTime = 0;

  for (const history of conversationSessions.values()) {
    totalMessages += history.length;

    history.forEach(msg => {
      // Count archetypes
      const archetype = msg.archetype?.type;
      if (archetype) {
        archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
      }

      // Count patterns
      if (msg.congruence?.patterns) {
        msg.congruence.patterns.forEach(p => {
          patternCounts[p] = (patternCounts[p] || 0) + 1;
        });
      }
      if (msg.congruence?.advancedPatterns) {
        msg.congruence.advancedPatterns.forEach(ap => {
          patternCounts[ap.pattern] = (patternCounts[ap.pattern] || 0) + 1;
        });
      }

      // Track processing time
      if (msg.performance?.duration) {
        totalProcessingTime += msg.performance.duration;
      }
    });
  }

  res.json({
    totalSessions: conversationSessions.size,
    totalMessages,
    avgMessagesPerSession: totalMessages / (conversationSessions.size || 1),
    avgProcessingTime: totalMessages > 0 ? (totalProcessingTime / totalMessages).toFixed(2) : 0,
    archetypeCounts,
    patternCounts
  });
});

/**
 * GET /api/dashboard/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    sessions: conversationSessions.size,
    uptime: process.uptime()
  });
});

export default router;
