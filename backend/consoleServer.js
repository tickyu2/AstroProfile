/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CONSOLE SERVER - Luna Management Console REST API
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Provides REST endpoints for the Luna Management Console:
 * - Browse users with conversation logs
 * - List and inspect conversation turns
 * - View behavior snapshots (emotion, behavior, prompts)
 * - Manage global and per-user settings
 *
 * Endpoints:
 * GET  /console/users                    - List users with logs
 * GET  /console/users/:userId/summary    - Get user summary stats
 * GET  /console/turns/:userId            - List turns for a user
 * GET  /console/turns/:userId/:index     - Get full turn snapshot
 * DELETE /console/turns/:userId          - Clear user logs
 * DELETE /console/turns                  - Clear all logs
 *
 * GET  /console/config                   - Get global config
 * POST /console/config                   - Update global config
 * GET  /console/prefs/:userId            - Get user preferences
 * POST /console/prefs/:userId            - Update user preferences
 *
 * Run alongside main server on a separate port (default: 8091)
 *
 * Created: December 21, 2025
 */

import express from 'express';
import cors from 'cors';
import {
  getLoggedUsers,
  getTurnMetadata,
  getTurnSnapshot,
  getTurnCount,
  getUserSummary,
  clearUserLogs,
  clearAllLogs
} from './logging/turnLogger.js';
import {
  getUserPreferences,
  updateUserPreferences,
  resetAllPreferences,
  getPreferenceSummary
} from './user/userPreferencesStore.js';
import {
  getLunaConfig,
  updateLunaConfig,
  resetLunaConfig,
  getConfigVersion,
  addConfigHistoryEntry,
  getConfigHistory,
  // Versioning
  listConfigVersions,
  restoreConfigVersion,
  getVersionedConfig,
  // Presets
  listPresets,
  getPreset,
  applyPreset,
  saveAsPreset,
  deletePreset,
  // Auto-tune
  getAutoTuneState,
  setAutoTuneEnabled,
  recordSatisfactionSignal,
  resetAutoTuneState,
  getAutoTuneAnalytics,
  getAutoTuneConfig,
  updateAutoTuneSensitivity,
  updateAutoTuneBlendFactor
} from './config/lunaConfigStore.js';
import {
  consolidatePreferencesIntoConfig,
  getAutoTuneAnalyticsForUser,
  resetAutoTuneForUser
} from './behavior/autoTuneEngine.js';
import {
  getProfile,
  getAllProfiles,
  resetProfile,
  deleteProfile,
  getProfileStats,
  updateFromSession
} from './memory/interactionProfileStore.js';
import {
  classifyUser,
  getClusterBehavior,
  getClusterDistribution,
  getClusterInfo,
  CLUSTERS
} from './behavior/clusterEngine.js';
import {
  getDriftState,
  getDriftModifiers,
  getDriftAnalytics,
  getDriftHistory,
  nudgeDrift,
  resetDrift,
  setDrift,
  calculateDrift,
  startDriftUpdates,
  stopDriftUpdates,
  DRIFT_BOUNDS
} from './behavior/personalityDrift.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════════════════════════
// USER & TURN ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/users
 * List all users with logs
 */
app.get('/console/users', (req, res) => {
  try {
    const users = getLoggedUsers();
    const withStats = users.map(userId => ({
      userId,
      turnCount: getTurnCount(userId),
      ...getUserSummary(userId)
    }));

    res.json({
      success: true,
      data: withStats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/users/:userId/summary
 * Get detailed summary for a user
 */
app.get('/console/users/:userId/summary', (req, res) => {
  try {
    const { userId } = req.params;
    const summary = getUserSummary(userId);
    const prefs = getUserPreferences(userId);
    const prefSummary = getPreferenceSummary(userId);

    res.json({
      success: true,
      data: {
        userId,
        ...summary,
        preferences: prefs,
        preferenceSummary: prefSummary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/turns/:userId
 * List turns for a user (metadata only)
 *
 * Query params:
 *   limit: number (default: 100)
 */
app.get('/console/turns/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const turns = getTurnMetadata(userId, limit);

    res.json({
      success: true,
      data: {
        userId,
        count: turns.length,
        turns
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/turns/:userId/:index
 * Get full snapshot for a specific turn
 */
app.get('/console/turns/:userId/:index', (req, res) => {
  try {
    const { userId, index } = req.params;
    const idx = parseInt(index, 10);

    if (Number.isNaN(idx)) {
      return res.status(400).json({ success: false, error: 'Invalid index' });
    }

    const snapshot = getTurnSnapshot(userId, idx);

    if (!snapshot) {
      return res.status(404).json({ success: false, error: 'Turn not found' });
    }

    res.json({
      success: true,
      data: snapshot
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /console/turns/:userId
 * Clear logs for a user
 */
app.delete('/console/turns/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const cleared = clearUserLogs(userId);

    res.json({
      success: true,
      data: { userId, cleared }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /console/turns
 * Clear all logs
 */
app.delete('/console/turns', (req, res) => {
  try {
    const count = clearAllLogs();

    res.json({
      success: true,
      data: { clearedFiles: count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/config
 * Get global configuration (from lunaConfig.json)
 */
app.get('/console/config', (req, res) => {
  try {
    const config = getLunaConfig();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/config/:section
 * Get a specific config section
 */
app.get('/console/config/:section', (req, res) => {
  try {
    const { section } = req.params;
    const config = getLunaConfig();

    if (!(section in config)) {
      return res.status(404).json({ success: false, error: `Section '${section}' not found` });
    }

    res.json({
      success: true,
      data: {
        section,
        value: config[section],
        version: config.version
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/config
 * Update global configuration (persisted to lunaConfig.json)
 *
 * Body: Partial config object (deep merged)
 */
app.post('/console/config', (req, res) => {
  try {
    const updates = req.body || {};
    const updated = updateLunaConfig(updates);

    console.log('[Console] Config updated:', Object.keys(updates).join(', '));

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/config/reset
 * Reset config to defaults
 */
app.post('/console/config/reset', (req, res) => {
  try {
    const reset = resetLunaConfig();

    res.json({
      success: true,
      message: 'Config reset to defaults',
      data: reset
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/config/from-turn/:userId/:index
 * Save config from a turn's behavior profile
 *
 * Extracts behavior settings from the specified turn and saves them
 * as the new defaults for that emotion in global config.
 *
 * Query params:
 *   applyToAll: boolean - If true, also apply to neutral (default behavior)
 */
app.post('/console/config/from-turn/:userId/:index', (req, res) => {
  try {
    const { userId, index } = req.params;
    const applyToAll = req.query.applyToAll === 'true';
    const idx = parseInt(index, 10);

    if (Number.isNaN(idx)) {
      return res.status(400).json({ success: false, error: 'Invalid index' });
    }

    // Load the turn snapshot
    const snapshot = getTurnSnapshot(userId, idx);

    if (!snapshot) {
      return res.status(404).json({ success: false, error: 'Turn not found' });
    }

    // Extract behavior profile from the turn
    const emotion = snapshot.serEmotion?.primary || 'neutral';
    const behavior = snapshot.behavior || {};

    // Build the config update
    const behaviorProfile = {
      backchannelFrequency: behavior.backchannelFrequency,
      maxResponseTokens: behavior.maxResponseTokens,
      style: behavior.style,
      adviceBias: behavior.adviceBias,
      ttsHints: behavior.ttsHints || {}
    };

    // Filter out undefined values
    Object.keys(behaviorProfile).forEach(key => {
      if (behaviorProfile[key] === undefined) {
        delete behaviorProfile[key];
      }
    });

    // Build config update
    const configUpdate = {
      behaviorDefaults: {
        [emotion]: behaviorProfile
      }
    };

    // Optionally apply to neutral as well (making it the "base" behavior)
    if (applyToAll && emotion !== 'neutral') {
      configUpdate.behaviorDefaults.neutral = { ...behaviorProfile };
    }

    // Extract timing if present
    if (behavior.timing) {
      configUpdate.timing = { base: {} };
      if (behavior.timing.zone1 !== undefined) configUpdate.timing.base.zone1 = behavior.timing.zone1;
      if (behavior.timing.zone2 !== undefined) configUpdate.timing.base.zone2 = behavior.timing.zone2;
      if (behavior.timing.zone3 !== undefined) configUpdate.timing.base.zone3 = behavior.timing.zone3;
    }

    // Add history entry before update
    addConfigHistoryEntry({
      action: 'save_from_turn',
      source: {
        userId,
        turnIndex: idx,
        timestamp: snapshot.timestamp,
        emotion: emotion,
        transcript: snapshot.sttTranscript?.substring(0, 100)
      },
      changes: configUpdate
    });

    // Apply the update
    const updated = updateLunaConfig(configUpdate);

    console.log(`[Console] Saved config from turn - user: ${userId}, turn: ${idx}, emotion: ${emotion}`);

    res.json({
      success: true,
      message: `Saved behavior from "${emotion}" turn as new config defaults`,
      data: {
        emotion,
        appliedProfile: behaviorProfile,
        appliedToNeutral: applyToAll,
        newVersion: updated.version,
        config: updated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/config/history
 * Get config version history
 *
 * Query params:
 *   limit: number (default: 20)
 */
app.get('/console/config/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = getConfigHistory(limit);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION MANAGEMENT ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/versions
 * List all saved config versions
 */
app.get('/console/versions', (req, res) => {
  try {
    const versions = listConfigVersions();
    res.json({
      success: true,
      data: versions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/versions/:version
 * Get a specific version's config
 */
app.get('/console/versions/:version', (req, res) => {
  try {
    const { version } = req.params;
    const config = getVersionedConfig(version);

    if (!config) {
      return res.status(404).json({ success: false, error: 'Version not found' });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/versions/:version/restore
 * Restore config to a specific version
 */
app.post('/console/versions/:version/restore', (req, res) => {
  try {
    const { version } = req.params;

    // Add history entry
    addConfigHistoryEntry({
      action: 'restore_version',
      source: { version },
      changes: { restoredFrom: version }
    });

    const restored = restoreConfigVersion(version);

    res.json({
      success: true,
      message: `Restored config to version ${version}`,
      data: restored
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/config/export
 * Export current config as downloadable JSON
 */
app.get('/console/config/export', (req, res) => {
  try {
    const config = getLunaConfig();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=lunaConfig-${config.version}.json`);
    res.json(config);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/config/import
 * Import a config file
 */
app.post('/console/config/import', (req, res) => {
  try {
    const importedConfig = req.body;

    if (!importedConfig || !importedConfig.version) {
      return res.status(400).json({ success: false, error: 'Invalid config file - missing version' });
    }

    // Add history entry
    addConfigHistoryEntry({
      action: 'import_config',
      source: { importedVersion: importedConfig.version },
      changes: importedConfig
    });

    // Apply the imported config (don't bump version, use imported version)
    const updated = updateLunaConfig(importedConfig, false);

    res.json({
      success: true,
      message: `Imported config v${importedConfig.version}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/presets
 * List all available presets
 */
app.get('/console/presets', (req, res) => {
  try {
    const presets = listPresets();
    res.json({
      success: true,
      data: presets
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/presets/:presetId
 * Get a specific preset
 */
app.get('/console/presets/:presetId', (req, res) => {
  try {
    const { presetId } = req.params;
    const preset = getPreset(presetId);

    if (!preset) {
      return res.status(404).json({ success: false, error: 'Preset not found' });
    }

    res.json({
      success: true,
      data: { id: presetId, ...preset }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/presets/:presetId/apply
 * Apply a preset to current config
 */
app.post('/console/presets/:presetId/apply', (req, res) => {
  try {
    const { presetId } = req.params;
    const preset = getPreset(presetId);

    if (!preset) {
      return res.status(404).json({ success: false, error: 'Preset not found' });
    }

    // Add history entry
    addConfigHistoryEntry({
      action: 'apply_preset',
      source: { presetId, presetName: preset.name },
      changes: preset
    });

    const updated = applyPreset(presetId);

    res.json({
      success: true,
      message: `Applied preset: ${preset.name || presetId}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/presets
 * Save current config as a new preset
 *
 * Body: { id: string, name: string, description: string }
 */
app.post('/console/presets', (req, res) => {
  try {
    const { id, name, description } = req.body || {};

    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'Preset id and name are required' });
    }

    const preset = saveAsPreset(id, name, description || '');

    res.json({
      success: true,
      message: `Saved preset: ${name}`,
      data: { id, ...preset }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /console/presets/:presetId
 * Delete a preset
 */
app.delete('/console/presets/:presetId', (req, res) => {
  try {
    const { presetId } = req.params;
    deletePreset(presetId);

    res.json({
      success: true,
      message: `Deleted preset: ${presetId}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-TUNE ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/autotune
 * Get auto-tune state and analytics
 */
app.get('/console/autotune', (req, res) => {
  try {
    const analytics = getAutoTuneAnalytics();
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/autotune/enable
 * Enable auto-tune mode
 */
app.post('/console/autotune/enable', (req, res) => {
  try {
    const state = setAutoTuneEnabled(true);
    res.json({
      success: true,
      message: 'Auto-tune enabled',
      data: state
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/autotune/disable
 * Disable auto-tune mode
 */
app.post('/console/autotune/disable', (req, res) => {
  try {
    const state = setAutoTuneEnabled(false);
    res.json({
      success: true,
      message: 'Auto-tune disabled',
      data: state
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/autotune/signal
 * Record a satisfaction signal
 *
 * Body: { signal: 'positive' | 'negative' | 'neutral', reason?: string, context?: object }
 */
app.post('/console/autotune/signal', (req, res) => {
  try {
    const { signal, reason, ...context } = req.body || {};

    if (!['positive', 'negative', 'neutral'].includes(signal)) {
      return res.status(400).json({ success: false, error: 'Invalid signal. Use: positive, negative, or neutral' });
    }

    const entry = recordSatisfactionSignal(signal, { reason, ...context });

    res.json({
      success: true,
      message: `Recorded ${signal} signal`,
      data: entry
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/autotune/reset
 * Reset auto-tune state
 */
app.post('/console/autotune/reset', (req, res) => {
  try {
    const state = resetAutoTuneState();
    res.json({
      success: true,
      message: 'Auto-tune state reset',
      data: state
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/autotune/sensitivity
 * Update auto-tune sensitivity
 *
 * Body: { sensitivity: number (0.0 - 2.0) }
 */
app.post('/console/autotune/sensitivity', (req, res) => {
  try {
    const { sensitivity } = req.body || {};

    if (typeof sensitivity !== 'number' || sensitivity < 0 || sensitivity > 2) {
      return res.status(400).json({ success: false, error: 'Sensitivity must be a number between 0.0 and 2.0' });
    }

    const config = updateAutoTuneSensitivity(sensitivity);

    res.json({
      success: true,
      message: `Updated sensitivity to ${sensitivity}`,
      data: { sensitivity: config.autoTune?.sensitivity }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/autotune/blendfactor
 * Update auto-tune blend factor
 *
 * Body: { blendFactor: number (0.0 - 1.0) }
 */
app.post('/console/autotune/blendfactor', (req, res) => {
  try {
    const { blendFactor } = req.body || {};

    if (typeof blendFactor !== 'number' || blendFactor < 0 || blendFactor > 1) {
      return res.status(400).json({ success: false, error: 'Blend factor must be a number between 0.0 and 1.0' });
    }

    const config = updateAutoTuneBlendFactor(blendFactor);

    res.json({
      success: true,
      message: `Updated blend factor to ${blendFactor}`,
      data: { blendFactor: config.autoTune?.blendFactor }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/autotune/consolidate
 * Consolidate learned preferences into global config
 *
 * Body: { userId: string, blendFactor?: number }
 */
app.post('/console/autotune/consolidate', (req, res) => {
  try {
    const { userId, blendFactor } = req.body || {};

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const config = consolidatePreferencesIntoConfig(userId, blendFactor);

    addConfigHistoryEntry({
      action: 'autotune_consolidate',
      source: { userId, blendFactor },
      changes: { consolidated: true }
    });

    res.json({
      success: true,
      message: `Consolidated preferences from ${userId} into global config`,
      data: config
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/autotune/user/:userId
 * Get auto-tune analytics for a specific user
 */
app.get('/console/autotune/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = getAutoTuneAnalyticsForUser(userId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/autotune/user/:userId/reset
 * Reset auto-tune biases for a specific user
 */
app.post('/console/autotune/user/:userId/reset', (req, res) => {
  try {
    const { userId } = req.params;
    const prefs = resetAutoTuneForUser(userId);

    res.json({
      success: true,
      message: `Reset auto-tune biases for ${userId}`,
      data: prefs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// USER PREFERENCES ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/prefs/:userId
 * Get user preferences
 */
app.get('/console/prefs/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const prefs = getUserPreferences(userId);
    const summary = getPreferenceSummary(userId);

    res.json({
      success: true,
      data: {
        userId,
        preferences: prefs,
        summary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/prefs/:userId
 * Update user preferences
 *
 * Body: Partial preferences object
 */
app.post('/console/prefs/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body || {};

    const updated = updateUserPreferences(userId, updates);

    res.json({
      success: true,
      data: {
        userId,
        preferences: updated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /console/prefs/:userId
 * Reset user preferences to default
 */
app.delete('/console/prefs/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const reset = resetAllPreferences(userId);

    res.json({
      success: true,
      data: {
        userId,
        preferences: reset
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTION PROFILE (MEMORY) ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/profiles
 * Get all interaction profiles
 */
app.get('/console/profiles', (req, res) => {
  try {
    const profiles = getAllProfiles();
    const stats = getProfileStats();

    res.json({
      success: true,
      data: {
        profiles,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/profiles/stats
 * Get aggregate profile statistics
 */
app.get('/console/profiles/stats', (req, res) => {
  try {
    const stats = getProfileStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/profiles/:userId
 * Get a specific user's interaction profile
 */
app.get('/console/profiles/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const profile = getProfile(userId);
    const classification = classifyUser(userId);

    res.json({
      success: true,
      data: {
        userId,
        profile,
        cluster: classification
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/profiles/:userId/reset
 * Reset a user's interaction profile to defaults
 */
app.post('/console/profiles/:userId/reset', (req, res) => {
  try {
    const { userId } = req.params;
    resetProfile(userId);
    const profile = getProfile(userId);

    res.json({
      success: true,
      message: `Reset interaction profile for ${userId}`,
      data: profile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /console/profiles/:userId
 * Delete a user's interaction profile entirely
 */
app.delete('/console/profiles/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    deleteProfile(userId);

    res.json({
      success: true,
      message: `Deleted interaction profile for ${userId}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CLUSTER ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/clusters
 * Get cluster definitions and distribution
 */
app.get('/console/clusters', (req, res) => {
  try {
    const clusterInfo = getClusterInfo();
    const profiles = getAllProfiles();
    const distribution = getClusterDistribution(profiles);

    res.json({
      success: true,
      data: {
        clusters: clusterInfo,
        distribution,
        availableClusters: Object.values(CLUSTERS)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/clusters/:userId
 * Get cluster classification for a specific user
 */
app.get('/console/clusters/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const classification = classifyUser(userId);
    const clusterBehavior = getClusterBehavior(userId);

    res.json({
      success: true,
      data: {
        userId,
        classification,
        behavior: clusterBehavior
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/clusters/:userId/override
 * Manually override a user's cluster assignment
 *
 * Body: { clusterId: string }
 */
app.post('/console/clusters/:userId/override', (req, res) => {
  try {
    const { userId } = req.params;
    const { clusterId } = req.body || {};

    if (!clusterId || !Object.values(CLUSTERS).includes(clusterId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid clusterId. Available: ${Object.values(CLUSTERS).join(', ')}`
      });
    }

    // Store override in profile
    const profile = getProfile(userId);
    profile.clusterOverride = clusterId;
    profile.clusterOverrideAt = new Date().toISOString();
    updateFromSession(userId, { clusterOverride: clusterId });

    res.json({
      success: true,
      message: `Set cluster override for ${userId} to ${clusterId}`,
      data: {
        userId,
        clusterId,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /console/clusters/:userId/override
 * Remove manual cluster override for a user
 */
app.delete('/console/clusters/:userId/override', (req, res) => {
  try {
    const { userId } = req.params;

    // Remove override from profile
    const profile = getProfile(userId);
    delete profile.clusterOverride;
    delete profile.clusterOverrideAt;

    const classification = classifyUser(userId);

    res.json({
      success: true,
      message: `Removed cluster override for ${userId}`,
      data: {
        userId,
        autoClassified: classification.cluster,
        classification
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONALITY DRIFT ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/drift
 * Get current drift state and analytics
 */
app.get('/console/drift', (req, res) => {
  try {
    const analytics = getDriftAnalytics();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/drift/modifiers
 * Get current drift modifiers (for behavior blending)
 */
app.get('/console/drift/modifiers', (req, res) => {
  try {
    const modifiers = getDriftModifiers();

    res.json({
      success: true,
      data: modifiers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /console/drift/history
 * Get drift history for visualization
 *
 * Query params:
 *   limit: number (default: 20)
 */
app.get('/console/drift/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = getDriftHistory(limit);

    res.json({
      success: true,
      data: {
        history,
        bounds: DRIFT_BOUNDS
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/drift/nudge
 * Manually nudge a drift dimension
 *
 * Body: { dimension: string, amount: number (-1 to 1) }
 */
app.post('/console/drift/nudge', (req, res) => {
  try {
    const { dimension, amount } = req.body || {};

    if (!dimension || !DRIFT_BOUNDS[dimension]) {
      return res.status(400).json({
        success: false,
        error: `Invalid dimension. Available: ${Object.keys(DRIFT_BOUNDS).join(', ')}`
      });
    }

    if (typeof amount !== 'number' || amount < -1 || amount > 1) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a number between -1 and 1'
      });
    }

    nudgeDrift(dimension, amount);
    const analytics = getDriftAnalytics();

    res.json({
      success: true,
      message: `Nudged ${dimension} by ${amount}`,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/drift/set
 * Set a drift dimension to a specific value
 *
 * Body: { dimension: string, value: number }
 */
app.post('/console/drift/set', (req, res) => {
  try {
    const { dimension, value } = req.body || {};

    if (!dimension || !DRIFT_BOUNDS[dimension]) {
      return res.status(400).json({
        success: false,
        error: `Invalid dimension. Available: ${Object.keys(DRIFT_BOUNDS).join(', ')}`
      });
    }

    const bounds = DRIFT_BOUNDS[dimension];
    if (typeof value !== 'number' || value < bounds.min || value > bounds.max) {
      return res.status(400).json({
        success: false,
        error: `Value must be between ${bounds.min} and ${bounds.max}`
      });
    }

    setDrift(dimension, value);
    const analytics = getDriftAnalytics();

    res.json({
      success: true,
      message: `Set ${dimension} to ${value}`,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/drift/reset
 * Reset drift to defaults
 *
 * Body: { dimension?: string } - If not provided, resets all
 */
app.post('/console/drift/reset', (req, res) => {
  try {
    const { dimension } = req.body || {};

    resetDrift(dimension || 'all');
    const analytics = getDriftAnalytics();

    res.json({
      success: true,
      message: dimension ? `Reset ${dimension} to default` : 'Reset all drift to defaults',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/drift/calculate
 * Force a drift calculation update
 */
app.post('/console/drift/calculate', (req, res) => {
  try {
    const current = calculateDrift();
    const analytics = getDriftAnalytics();

    res.json({
      success: true,
      message: 'Drift calculated',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/drift/updates/start
 * Start automatic drift updates
 */
app.post('/console/drift/updates/start', (req, res) => {
  try {
    startDriftUpdates();

    res.json({
      success: true,
      message: 'Started automatic drift updates'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /console/drift/updates/stop
 * Stop automatic drift updates
 */
app.post('/console/drift/updates/stop', (req, res) => {
  try {
    stopDriftUpdates();

    res.json({
      success: true,
      message: 'Stopped automatic drift updates'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /console/health
 * Health check
 */
app.get('/console/health', (req, res) => {
  res.json({
    success: true,
    service: 'Luna Management Console',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /console/stats
 * Get overall system stats
 */
app.get('/console/stats', (req, res) => {
  try {
    const users = getLoggedUsers();
    let totalTurns = 0;
    let totalSessions = 0;
    const allEmotions = {};
    const allProviders = {};

    users.forEach(userId => {
      const summary = getUserSummary(userId);
      totalTurns += summary.turns;
      totalSessions += summary.sessions;

      Object.entries(summary.emotions || {}).forEach(([emotion, count]) => {
        allEmotions[emotion] = (allEmotions[emotion] || 0) + count;
      });

      Object.entries(summary.providers || {}).forEach(([provider, count]) => {
        allProviders[provider] = (allProviders[provider] || 0) + count;
      });
    });

    res.json({
      success: true,
      data: {
        users: users.length,
        totalTurns,
        totalSessions,
        emotions: allEmotions,
        providers: allProviders,
        configVersion: getConfigVersion()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get the global config (for use in other modules)
 * Now uses file-backed lunaConfigStore
 */
export function getGlobalConfig() {
  return getLunaConfig();
}

/**
 * Start the console server
 *
 * @param {number} port - Port to listen on (default: 8091)
 */
export function startConsoleServer(port = 8091) {
  app.listen(port, () => {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('  LUNA MANAGEMENT CONSOLE');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`  REST API: http://localhost:${port}`);
    console.log('');
    console.log('  Endpoints:');
    console.log(`  GET  http://localhost:${port}/console/users`);
    console.log(`  GET  http://localhost:${port}/console/turns/:userId`);
    console.log(`  GET  http://localhost:${port}/console/turns/:userId/:index`);
    console.log(`  GET  http://localhost:${port}/console/config`);
    console.log(`  POST http://localhost:${port}/console/config`);
    console.log(`  GET  http://localhost:${port}/console/stats`);
    console.log('═══════════════════════════════════════════════════════════════════');
  });
}

export default { startConsoleServer, getGlobalConfig };
