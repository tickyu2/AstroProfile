/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA CONFIG STORE - Centralized Configuration Management
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages Luna's global configuration:
 * - Loads config from lunaConfig.json
 * - Provides getters for all config sections
 * - Supports runtime updates with persistence
 * - Versioned for tracking changes
 *
 * Config Sections:
 * - timing: Turn-taking thresholds
 * - behaviorDefaults: Per-emotion behavior profiles
 * - backchannels: Cue probabilities and settings
 * - tts: Text-to-speech settings
 * - llm: Language model settings
 * - learning: User preference learning rates
 * - thresholds: Detection thresholds
 * - logging: Logging settings
 *
 * Created: December 21, 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Path to config file
 */
const CONFIG_PATH = path.join(__dirname, 'lunaConfig.json');

/**
 * Path to history file
 */
const HISTORY_PATH = path.join(__dirname, 'lunaConfigHistory.json');

/**
 * Path to versioned configs directory
 */
const VERSIONED_DIR = path.join(__dirname, 'versioned');

/**
 * Path to presets directory
 */
const PRESETS_DIR = path.join(__dirname, 'presets');

/**
 * Path to auto-tune state file
 */
const AUTOTUNE_PATH = path.join(__dirname, 'autoTuneState.json');

/**
 * In-memory config cache
 */
let currentConfig = null;

/**
 * Auto-tune state cache
 */
let autoTuneState = null;

/**
 * Config change listeners
 */
const listeners = new Set();

/**
 * Default config (fallback if file missing)
 */
const DEFAULT_CONFIG = {
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  timing: {
    base: { zone1: 300, zone2: 900, zone3: 2000 },
    minSilenceMs: 80,
    vadSampleIntervalMs: 50,
    completionMinMs: 2000
  },
  behaviorDefaults: {
    neutral: {
      backchannelFrequency: 0.30,
      maxResponseTokens: 220,
      style: 'balanced',
      adviceBias: 0.5,
      ttsHints: { rate: 1.0, pitch: 1.0, warmth: 0.5 }
    }
  },
  backchannels: {
    baseProbabilities: {
      MICRO_PAUSE: 0.25,
      SHORT_PAUSE: 0.35,
      THINKING_PAUSE: 0.55
    },
    emotionBoosts: { neutral: 0.0 },
    minIntervalMs: 3000
  },
  tts: {
    defaultProvider: 'elevenlabs',
    elevenLabs: {
      modelId: 'eleven_multilingual_v2',
      baseProfile: { stability: 0.6, similarityBoost: 0.75, style: 0.3 }
    }
  },
  llm: {
    defaultProvider: 'groq',
    maxHistoryTurns: 6
  },
  learning: {
    backchannelLearningRate: 0.02,
    responseLengthLearningRate: 0.03,
    pauseToleranceLearningRate: 0.02,
    adviceLearningRate: 0.02
  },
  thresholds: {
    emotionConfidenceMin: 0.3,
    silenceComfortMs: 4000
  },
  logging: {
    enabled: true,
    logPrompts: true,
    logAudioPaths: false
  }
};

/**
 * Load config from file.
 * Creates default config if file doesn't exist.
 *
 * @returns {Object} Loaded config
 */
export function loadLunaConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.log('[LunaConfig] Config file not found, creating default...');
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
      currentConfig = { ...DEFAULT_CONFIG };
      return currentConfig;
    }

    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    currentConfig = JSON.parse(raw);
    console.log(`[LunaConfig] Loaded config v${currentConfig.version}`);
    return currentConfig;
  } catch (error) {
    console.error('[LunaConfig] Error loading config:', error.message);
    currentConfig = { ...DEFAULT_CONFIG };
    return currentConfig;
  }
}

/**
 * Get current config (loads if not cached).
 *
 * @returns {Object} Current config
 */
export function getLunaConfig() {
  if (!currentConfig) {
    return loadLunaConfig();
  }
  return currentConfig;
}

/**
 * Update config with partial updates.
 * Merges updates deeply and persists to file.
 * Also saves a versioned snapshot.
 *
 * @param {Object} partialUpdate - Partial config updates
 * @param {boolean} bumpVersion - Whether to bump the version number
 * @returns {Object} Updated config
 */
export function updateLunaConfig(partialUpdate, bumpVersion = true) {
  const existing = getLunaConfig();

  // Deep merge
  const updated = deepMerge(existing, partialUpdate);
  updated.updatedAt = new Date().toISOString();

  // Bump version if requested and not explicitly set
  if (bumpVersion && !partialUpdate.version) {
    const parts = (existing.version || '1.0.0').split('.');
    parts[2] = parseInt(parts[2] || 0) + 1;
    updated.version = parts.join('.');
  }

  // Persist
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf8');
    currentConfig = updated;
    console.log(`[LunaConfig] Config updated to v${updated.version}`);

    // Save versioned snapshot
    saveVersionedSnapshot(updated);

    // Notify listeners
    listeners.forEach(fn => {
      try {
        fn(updated);
      } catch (e) {
        console.error('[LunaConfig] Listener error:', e.message);
      }
    });

    return updated;
  } catch (error) {
    console.error('[LunaConfig] Error saving config:', error.message);
    throw error;
  }
}

/**
 * Save a versioned snapshot of the config.
 *
 * @param {Object} config - Config to save
 */
function saveVersionedSnapshot(config) {
  try {
    // Ensure versioned directory exists
    if (!fs.existsSync(VERSIONED_DIR)) {
      fs.mkdirSync(VERSIONED_DIR, { recursive: true });
    }

    const versionPath = path.join(VERSIONED_DIR, `${config.version}.json`);
    fs.writeFileSync(versionPath, JSON.stringify(config, null, 2), 'utf8');
    console.log(`[LunaConfig] Saved versioned snapshot: ${config.version}`);
  } catch (error) {
    console.error('[LunaConfig] Error saving versioned snapshot:', error.message);
  }
}

/**
 * Reset config to defaults.
 *
 * @returns {Object} Default config
 */
export function resetLunaConfig() {
  const reset = {
    ...DEFAULT_CONFIG,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(reset, null, 2), 'utf8');
    currentConfig = reset;
    console.log('[LunaConfig] Config reset to defaults');
    return reset;
  } catch (error) {
    console.error('[LunaConfig] Error resetting config:', error.message);
    throw error;
  }
}

/**
 * Subscribe to config changes.
 *
 * @param {Function} callback - Called when config changes
 * @returns {Function} Unsubscribe function
 */
export function onConfigChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE GETTERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get timing config.
 */
export function getTimingConfig() {
  return getLunaConfig().timing;
}

/**
 * Get behavior defaults for an emotion.
 *
 * @param {string} emotion - Emotion name
 * @returns {Object} Behavior defaults
 */
export function getBehaviorDefaults(emotion = 'neutral') {
  const config = getLunaConfig();
  return config.behaviorDefaults[emotion] || config.behaviorDefaults.neutral;
}

/**
 * Get all behavior defaults.
 */
export function getAllBehaviorDefaults() {
  return getLunaConfig().behaviorDefaults;
}

/**
 * Get backchannel config.
 */
export function getBackchannelConfig() {
  return getLunaConfig().backchannels;
}

/**
 * Get TTS config.
 */
export function getTTSConfig() {
  return getLunaConfig().tts;
}

/**
 * Get TTS emotion profile.
 *
 * @param {string} emotion - Emotion name
 * @returns {Object} TTS profile
 */
export function getTTSEmotionProfile(emotion = 'neutral') {
  const tts = getTTSConfig();
  const profiles = tts.elevenLabs?.emotionProfiles || {};
  return profiles[emotion] || tts.elevenLabs?.baseProfile || {};
}

/**
 * Get LLM config.
 */
export function getLLMConfig() {
  return getLunaConfig().llm;
}

/**
 * Get learning config.
 */
export function getLearningConfig() {
  return getLunaConfig().learning;
}

/**
 * Get thresholds config.
 */
export function getThresholdsConfig() {
  return getLunaConfig().thresholds;
}

/**
 * Get logging config.
 */
export function getLoggingConfig() {
  return getLunaConfig().logging;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Deep merge two objects.
 */
function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (target[key] && typeof target[key] === 'object') {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = { ...source[key] };
      }
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

/**
 * Get config version.
 */
export function getConfigVersion() {
  return getLunaConfig().version;
}

/**
 * Bump config version (minor).
 */
export function bumpConfigVersion() {
  const config = getLunaConfig();
  const parts = config.version.split('.');
  parts[2] = parseInt(parts[2] || 0) + 1;
  const newVersion = parts.join('.');

  return updateLunaConfig({ version: newVersion });
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * In-memory history cache
 */
let historyCache = null;

/**
 * Load history from file.
 *
 * @returns {Array} History entries
 */
function loadHistory() {
  try {
    if (!fs.existsSync(HISTORY_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(HISTORY_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('[LunaConfig] Error loading history:', error.message);
    return [];
  }
}

/**
 * Save history to file.
 *
 * @param {Array} history - History entries
 */
function saveHistory(history) {
  try {
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf8');
    historyCache = history;
  } catch (error) {
    console.error('[LunaConfig] Error saving history:', error.message);
  }
}

/**
 * Add a history entry.
 *
 * @param {Object} entry - History entry
 * @param {string} entry.action - Action type (e.g., 'save_from_turn', 'manual_update', 'reset')
 * @param {Object} entry.source - Source info (userId, turnIndex, etc.)
 * @param {Object} entry.changes - Config changes applied
 */
export function addConfigHistoryEntry(entry) {
  const history = historyCache || loadHistory();
  const config = getLunaConfig();

  const fullEntry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    version: config.version,
    ...entry
  };

  // Keep last 100 entries
  history.unshift(fullEntry);
  if (history.length > 100) {
    history.length = 100;
  }

  saveHistory(history);
  console.log(`[LunaConfig] History entry added: ${entry.action}`);

  return fullEntry;
}

/**
 * Get config history.
 *
 * @param {number} limit - Max entries to return
 * @returns {Array} History entries
 */
export function getConfigHistory(limit = 20) {
  const history = historyCache || loadHistory();
  return history.slice(0, limit);
}

/**
 * Clear config history.
 */
export function clearConfigHistory() {
  saveHistory([]);
  console.log('[LunaConfig] History cleared');
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSIONED CONFIG MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * List all available config versions.
 *
 * @returns {Array} List of version objects with metadata
 */
export function listConfigVersions() {
  try {
    if (!fs.existsSync(VERSIONED_DIR)) {
      return [];
    }

    const files = fs.readdirSync(VERSIONED_DIR).filter(f => f.endsWith('.json'));
    const versions = files.map(f => {
      const versionPath = path.join(VERSIONED_DIR, f);
      try {
        const raw = fs.readFileSync(versionPath, 'utf8');
        const config = JSON.parse(raw);
        return {
          version: config.version,
          updatedAt: config.updatedAt,
          createdAt: config.createdAt,
          file: f
        };
      } catch {
        return { version: f.replace('.json', ''), file: f };
      }
    });

    // Sort by version (newest first)
    return versions.sort((a, b) => {
      const aParts = (a.version || '0.0.0').split('.').map(Number);
      const bParts = (b.version || '0.0.0').split('.').map(Number);
      for (let i = 0; i < 3; i++) {
        if (bParts[i] !== aParts[i]) return bParts[i] - aParts[i];
      }
      return 0;
    });
  } catch (error) {
    console.error('[LunaConfig] Error listing versions:', error.message);
    return [];
  }
}

/**
 * Restore config from a specific version.
 *
 * @param {string} version - Version to restore
 * @returns {Object} Restored config
 */
export function restoreConfigVersion(version) {
  const versionPath = path.join(VERSIONED_DIR, `${version}.json`);

  if (!fs.existsSync(versionPath)) {
    throw new Error(`Version ${version} not found`);
  }

  try {
    const raw = fs.readFileSync(versionPath, 'utf8');
    const restored = JSON.parse(raw);

    // Write to main config (don't bump version - keep the restored version)
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(restored, null, 2), 'utf8');
    currentConfig = restored;

    console.log(`[LunaConfig] Restored config to v${version}`);
    return restored;
  } catch (error) {
    console.error('[LunaConfig] Error restoring version:', error.message);
    throw error;
  }
}

/**
 * Get a specific versioned config.
 *
 * @param {string} version - Version to get
 * @returns {Object} Config for that version
 */
export function getVersionedConfig(version) {
  const versionPath = path.join(VERSIONED_DIR, `${version}.json`);

  if (!fs.existsSync(versionPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(versionPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('[LunaConfig] Error reading version:', error.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Default presets
 */
const DEFAULT_PRESETS = {
  warm: {
    name: 'Warm',
    description: 'Gentle, nurturing, and emotionally supportive',
    behaviorDefaults: {
      neutral: {
        backchannelFrequency: 0.45,
        maxResponseTokens: 180,
        style: 'gentle',
        adviceBias: 0.25,
        ttsHints: { rate: 0.94, pitch: 0.98, warmth: 0.85 }
      }
    },
    tts: {
      elevenLabs: {
        baseProfile: { stability: 0.7, similarityBoost: 0.78, style: 0.4 }
      }
    }
  },
  playful: {
    name: 'Playful',
    description: 'Fun, energetic, and lighthearted',
    behaviorDefaults: {
      neutral: {
        backchannelFrequency: 0.55,
        maxResponseTokens: 240,
        style: 'playful',
        adviceBias: 0.6,
        ttsHints: { rate: 1.08, pitch: 1.05, warmth: 0.6 }
      }
    },
    tts: {
      elevenLabs: {
        baseProfile: { stability: 0.5, similarityBoost: 0.8, style: 0.7 }
      }
    }
  },
  sage: {
    name: 'Sage',
    description: 'Wise, thoughtful, and introspective',
    behaviorDefaults: {
      neutral: {
        backchannelFrequency: 0.25,
        maxResponseTokens: 280,
        style: 'wise',
        adviceBias: 0.7,
        ttsHints: { rate: 0.92, pitch: 0.96, warmth: 0.6 }
      }
    },
    tts: {
      elevenLabs: {
        baseProfile: { stability: 0.75, similarityBoost: 0.7, style: 0.25 }
      }
    }
  },
  mystic: {
    name: 'Mystic',
    description: 'Mysterious, intuitive, and spiritually attuned',
    behaviorDefaults: {
      neutral: {
        backchannelFrequency: 0.30,
        maxResponseTokens: 200,
        style: 'mystical',
        adviceBias: 0.4,
        ttsHints: { rate: 0.90, pitch: 0.94, warmth: 0.75 }
      }
    },
    tts: {
      elevenLabs: {
        baseProfile: { stability: 0.65, similarityBoost: 0.72, style: 0.5 }
      }
    }
  },
  therapist: {
    name: 'Therapist',
    description: 'Professional, empathetic, and reflective',
    behaviorDefaults: {
      neutral: {
        backchannelFrequency: 0.50,
        maxResponseTokens: 160,
        style: 'reflective',
        adviceBias: 0.15,
        ttsHints: { rate: 0.95, pitch: 0.98, warmth: 0.8 }
      }
    },
    tts: {
      elevenLabs: {
        baseProfile: { stability: 0.72, similarityBoost: 0.75, style: 0.35 }
      }
    }
  },
  coach: {
    name: 'Coach',
    description: 'Motivating, direct, and action-oriented',
    behaviorDefaults: {
      neutral: {
        backchannelFrequency: 0.35,
        maxResponseTokens: 200,
        style: 'motivating',
        adviceBias: 0.8,
        ttsHints: { rate: 1.05, pitch: 1.02, warmth: 0.55 }
      }
    },
    tts: {
      elevenLabs: {
        baseProfile: { stability: 0.55, similarityBoost: 0.78, style: 0.6 }
      }
    }
  }
};

/**
 * Initialize presets directory with defaults.
 */
function initializePresets() {
  try {
    if (!fs.existsSync(PRESETS_DIR)) {
      fs.mkdirSync(PRESETS_DIR, { recursive: true });
    }

    // Write default presets if they don't exist
    for (const [key, preset] of Object.entries(DEFAULT_PRESETS)) {
      const presetPath = path.join(PRESETS_DIR, `${key}.json`);
      if (!fs.existsSync(presetPath)) {
        fs.writeFileSync(presetPath, JSON.stringify(preset, null, 2), 'utf8');
      }
    }
  } catch (error) {
    console.error('[LunaConfig] Error initializing presets:', error.message);
  }
}

// Initialize presets on module load
initializePresets();

/**
 * List available presets.
 *
 * @returns {Array} List of preset objects
 */
export function listPresets() {
  try {
    if (!fs.existsSync(PRESETS_DIR)) {
      return [];
    }

    const files = fs.readdirSync(PRESETS_DIR).filter(f => f.endsWith('.json'));
    return files.map(f => {
      const presetPath = path.join(PRESETS_DIR, f);
      try {
        const raw = fs.readFileSync(presetPath, 'utf8');
        const preset = JSON.parse(raw);
        return {
          id: f.replace('.json', ''),
          name: preset.name || f.replace('.json', ''),
          description: preset.description || ''
        };
      } catch {
        return { id: f.replace('.json', ''), name: f.replace('.json', ''), description: '' };
      }
    });
  } catch (error) {
    console.error('[LunaConfig] Error listing presets:', error.message);
    return [];
  }
}

/**
 * Get a preset by ID.
 *
 * @param {string} presetId - Preset ID
 * @returns {Object} Preset config
 */
export function getPreset(presetId) {
  const presetPath = path.join(PRESETS_DIR, `${presetId}.json`);

  if (!fs.existsSync(presetPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(presetPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('[LunaConfig] Error reading preset:', error.message);
    return null;
  }
}

/**
 * Apply a preset to the current config.
 *
 * @param {string} presetId - Preset ID to apply
 * @returns {Object} Updated config
 */
export function applyPreset(presetId) {
  const preset = getPreset(presetId);

  if (!preset) {
    throw new Error(`Preset '${presetId}' not found`);
  }

  // Extract config updates from preset (exclude metadata)
  const { name, description, ...configUpdates } = preset;

  // Apply as config update
  const updated = updateLunaConfig(configUpdates);

  console.log(`[LunaConfig] Applied preset: ${name || presetId}`);
  return updated;
}

/**
 * Save current config as a preset.
 *
 * @param {string} presetId - Preset ID
 * @param {string} name - Display name
 * @param {string} description - Description
 * @returns {Object} Saved preset
 */
export function saveAsPreset(presetId, name, description = '') {
  try {
    if (!fs.existsSync(PRESETS_DIR)) {
      fs.mkdirSync(PRESETS_DIR, { recursive: true });
    }

    const config = getLunaConfig();

    // Create preset with metadata
    const preset = {
      name,
      description,
      behaviorDefaults: config.behaviorDefaults,
      timing: config.timing,
      backchannels: config.backchannels,
      tts: config.tts,
      learning: config.learning,
      thresholds: config.thresholds
    };

    const presetPath = path.join(PRESETS_DIR, `${presetId}.json`);
    fs.writeFileSync(presetPath, JSON.stringify(preset, null, 2), 'utf8');

    console.log(`[LunaConfig] Saved preset: ${name}`);
    return preset;
  } catch (error) {
    console.error('[LunaConfig] Error saving preset:', error.message);
    throw error;
  }
}

/**
 * Delete a preset.
 *
 * @param {string} presetId - Preset ID to delete
 */
export function deletePreset(presetId) {
  const presetPath = path.join(PRESETS_DIR, `${presetId}.json`);

  if (!fs.existsSync(presetPath)) {
    throw new Error(`Preset '${presetId}' not found`);
  }

  fs.unlinkSync(presetPath);
  console.log(`[LunaConfig] Deleted preset: ${presetId}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-TUNE MODE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Default auto-tune state
 */
const DEFAULT_AUTOTUNE_STATE = {
  enabled: false,
  satisfactionHistory: [],
  adjustmentHistory: [],
  currentBiases: {
    backchannel: 0,
    responseLength: 0,
    advice: 0,
    speed: 0
  },
  learningRate: 0.05,
  minSamples: 5,
  lastAdjustment: null
};

/**
 * Load auto-tune state.
 */
function loadAutoTuneState() {
  try {
    if (!fs.existsSync(AUTOTUNE_PATH)) {
      return { ...DEFAULT_AUTOTUNE_STATE };
    }
    const raw = fs.readFileSync(AUTOTUNE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('[AutoTune] Error loading state:', error.message);
    return { ...DEFAULT_AUTOTUNE_STATE };
  }
}

/**
 * Save auto-tune state.
 */
function saveAutoTuneState(state) {
  try {
    fs.writeFileSync(AUTOTUNE_PATH, JSON.stringify(state, null, 2), 'utf8');
    autoTuneState = state;
  } catch (error) {
    console.error('[AutoTune] Error saving state:', error.message);
  }
}

/**
 * Get auto-tune state.
 */
export function getAutoTuneState() {
  if (!autoTuneState) {
    autoTuneState = loadAutoTuneState();
  }
  return autoTuneState;
}

/**
 * Enable/disable auto-tune mode.
 *
 * @param {boolean} enabled
 */
export function setAutoTuneEnabled(enabled) {
  const state = getAutoTuneState();
  state.enabled = enabled;
  saveAutoTuneState(state);
  console.log(`[AutoTune] ${enabled ? 'Enabled' : 'Disabled'}`);
  return state;
}

/**
 * Record satisfaction signal.
 *
 * @param {string} signal - 'positive', 'negative', or 'neutral'
 * @param {Object} context - Turn context (emotion, behavior used, etc.)
 */
export function recordSatisfactionSignal(signal, context = {}) {
  const state = getAutoTuneState();

  const entry = {
    timestamp: new Date().toISOString(),
    signal,
    ...context
  };

  state.satisfactionHistory.push(entry);

  // Keep last 100 signals
  if (state.satisfactionHistory.length > 100) {
    state.satisfactionHistory = state.satisfactionHistory.slice(-100);
  }

  saveAutoTuneState(state);

  // If enabled, potentially trigger adjustment
  if (state.enabled) {
    maybeAutoAdjust();
  }

  return entry;
}

/**
 * Calculate satisfaction score from recent history.
 */
function calculateSatisfactionScore() {
  const state = getAutoTuneState();
  const recent = state.satisfactionHistory.slice(-20);

  if (recent.length < state.minSamples) {
    return null; // Not enough data
  }

  let score = 0;
  recent.forEach(entry => {
    if (entry.signal === 'positive') score += 1;
    else if (entry.signal === 'negative') score -= 1;
    // neutral = 0
  });

  return score / recent.length; // -1 to 1
}

/**
 * Maybe auto-adjust config based on satisfaction.
 */
function maybeAutoAdjust() {
  const state = getAutoTuneState();
  const score = calculateSatisfactionScore();

  if (score === null) return; // Not enough data

  const now = Date.now();
  const cooldown = 60000; // 1 minute cooldown between adjustments

  if (state.lastAdjustment && (now - new Date(state.lastAdjustment).getTime()) < cooldown) {
    return; // Too soon
  }

  // Determine adjustments based on satisfaction patterns
  const recentNegative = state.satisfactionHistory.slice(-10)
    .filter(e => e.signal === 'negative');

  if (score < -0.3 && recentNegative.length >= 3) {
    // Consistently unsatisfied - try to adjust

    // Analyze what's going wrong
    const issues = analyzeIssues(recentNegative);

    // Apply corrections
    const adjustments = {};

    if (issues.tooLong) {
      state.currentBiases.responseLength -= state.learningRate;
      adjustments.maxResponseTokens = Math.max(100, getLunaConfig().behaviorDefaults?.neutral?.maxResponseTokens - 20);
    }

    if (issues.tooAdvicey) {
      state.currentBiases.advice -= state.learningRate;
      adjustments.adviceBias = Math.max(0.1, (getLunaConfig().behaviorDefaults?.neutral?.adviceBias || 0.5) - 0.1);
    }

    if (issues.tooFast) {
      state.currentBiases.speed -= state.learningRate;
    }

    if (issues.notEnoughListening) {
      state.currentBiases.backchannel += state.learningRate;
      adjustments.backchannelFrequency = Math.min(0.7, (getLunaConfig().behaviorDefaults?.neutral?.backchannelFrequency || 0.3) + 0.05);
    }

    // Apply adjustments
    if (Object.keys(adjustments).length > 0) {
      updateLunaConfig({
        behaviorDefaults: { neutral: adjustments }
      });

      state.adjustmentHistory.push({
        timestamp: new Date().toISOString(),
        score,
        adjustments
      });

      // Keep last 50 adjustments
      if (state.adjustmentHistory.length > 50) {
        state.adjustmentHistory = state.adjustmentHistory.slice(-50);
      }
    }

    state.lastAdjustment = new Date().toISOString();
    saveAutoTuneState(state);

    console.log('[AutoTune] Applied adjustments based on satisfaction:', adjustments);
  } else if (score > 0.5) {
    // Doing well - reinforce current settings
    console.log('[AutoTune] Satisfaction high, maintaining current settings');
    state.lastAdjustment = new Date().toISOString();
    saveAutoTuneState(state);
  }
}

/**
 * Analyze what issues are causing dissatisfaction.
 */
function analyzeIssues(negativeEntries) {
  const issues = {
    tooLong: false,
    tooAdvicey: false,
    tooFast: false,
    notEnoughListening: false
  };

  // Count feedback types
  const counts = {};
  negativeEntries.forEach(entry => {
    if (entry.reason) {
      counts[entry.reason] = (counts[entry.reason] || 0) + 1;
    }
  });

  // Map reasons to issues
  if (counts.too_long >= 2) issues.tooLong = true;
  if (counts.too_much_advice >= 2) issues.tooAdvicey = true;
  if (counts.too_fast >= 2) issues.tooFast = true;
  if (counts.not_listening >= 2) issues.notEnoughListening = true;

  return issues;
}

/**
 * Reset auto-tune state.
 */
export function resetAutoTuneState() {
  autoTuneState = { ...DEFAULT_AUTOTUNE_STATE };
  saveAutoTuneState(autoTuneState);
  console.log('[AutoTune] State reset');
  return autoTuneState;
}

/**
 * Get auto-tune config from global config.
 *
 * @returns {Object} Auto-tune config section
 */
export function getAutoTuneConfig() {
  const config = getLunaConfig();
  return config.autoTune || {
    enabled: false,
    sensitivity: 1.0,
    consolidationInterval: 20,
    minInteractionsForConsolidation: 10,
    blendFactor: 0.3
  };
}

/**
 * Update auto-tune sensitivity.
 *
 * @param {number} sensitivity - Sensitivity value (0.0 - 2.0)
 * @returns {Object} Updated config
 */
export function updateAutoTuneSensitivity(sensitivity) {
  const clamped = Math.max(0, Math.min(2, sensitivity));
  return updateLunaConfig({
    autoTune: {
      ...getAutoTuneConfig(),
      sensitivity: clamped
    }
  });
}

/**
 * Update auto-tune blend factor.
 *
 * @param {number} blendFactor - Blend factor (0.0 - 1.0)
 * @returns {Object} Updated config
 */
export function updateAutoTuneBlendFactor(blendFactor) {
  const clamped = Math.max(0, Math.min(1, blendFactor));
  return updateLunaConfig({
    autoTune: {
      ...getAutoTuneConfig(),
      blendFactor: clamped
    }
  });
}

/**
 * Get auto-tune analytics.
 */
export function getAutoTuneAnalytics() {
  const state = getAutoTuneState();
  const config = getAutoTuneConfig();

  const recent = state.satisfactionHistory.slice(-50);
  const positive = recent.filter(e => e.signal === 'positive').length;
  const negative = recent.filter(e => e.signal === 'negative').length;
  const neutral = recent.filter(e => e.signal === 'neutral').length;

  return {
    enabled: state.enabled,
    sensitivity: config.sensitivity,
    blendFactor: config.blendFactor,
    consolidationInterval: config.consolidationInterval,
    totalSignals: state.satisfactionHistory.length,
    recentSignals: {
      positive,
      negative,
      neutral,
      score: recent.length > 0 ? ((positive - negative) / recent.length).toFixed(2) : 0
    },
    currentBiases: state.currentBiases,
    recentAdjustments: state.adjustmentHistory.slice(-5),
    lastAdjustment: state.lastAdjustment
  };
}

export default {
  // Core config
  loadLunaConfig,
  getLunaConfig,
  updateLunaConfig,
  resetLunaConfig,
  onConfigChange,
  // Convenience getters
  getTimingConfig,
  getBehaviorDefaults,
  getAllBehaviorDefaults,
  getBackchannelConfig,
  getTTSConfig,
  getTTSEmotionProfile,
  getLLMConfig,
  getLearningConfig,
  getThresholdsConfig,
  getLoggingConfig,
  getConfigVersion,
  bumpConfigVersion,
  // History
  addConfigHistoryEntry,
  getConfigHistory,
  clearConfigHistory,
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
};
