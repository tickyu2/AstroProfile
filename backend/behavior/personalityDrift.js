/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PERSONALITY DRIFT ENGINE - Slow Evolution of Luna's Global Personality
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages the slow, bounded evolution of Luna's personality based on
 * accumulated user interactions. This creates a sense that Luna is
 * learning and growing over time while staying within safe bounds.
 *
 * Drift occurs on these dimensions:
 * - baseWarmth: How warm/cold Luna's baseline personality is
 * - basePace: Default speaking pace
 * - baseResponsiveness: How quickly Luna responds
 * - preferredTopics: Topics Luna gravitates toward
 * - communicationStyle: Overall communication approach
 *
 * Safety: All drift is bounded to prevent Luna from drifting too far
 * from her core personality.
 *
 * Created: December 21, 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllProfiles, getProfileStats } from '../memory/interactionProfileStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DRIFT_STATE_FILE = path.join(__dirname, '../data/personalityDrift.json');
const DRIFT_RATE = 0.02; // Very slow adaptation (2% per update)
const UPDATE_INTERVAL_MS = 1000 * 60 * 30; // Update drift every 30 minutes

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT DRIFT STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Drift bounds - Luna cannot drift outside these ranges
 * This ensures she maintains her core personality
 */
export const DRIFT_BOUNDS = {
  baseWarmth: { min: 0.4, max: 1.0, default: 0.7 },
  basePace: { min: 0.7, max: 1.3, default: 1.0 },
  baseResponsiveness: { min: 0.6, max: 1.2, default: 1.0 },
  backchannelFrequency: { min: 0.2, max: 0.8, default: 0.5 },
  responseLength: { min: 0.7, max: 1.3, default: 1.0 },
  emotionalMirroring: { min: 0.3, max: 0.9, default: 0.6 }
};

function createDefaultDriftState() {
  return {
    // Current drift values (start at defaults)
    current: {
      baseWarmth: DRIFT_BOUNDS.baseWarmth.default,
      basePace: DRIFT_BOUNDS.basePace.default,
      baseResponsiveness: DRIFT_BOUNDS.baseResponsiveness.default,
      backchannelFrequency: DRIFT_BOUNDS.backchannelFrequency.default,
      responseLength: DRIFT_BOUNDS.responseLength.default,
      emotionalMirroring: DRIFT_BOUNDS.emotionalMirroring.default
    },

    // Drift velocity (direction and speed of current drift)
    velocity: {
      baseWarmth: 0,
      basePace: 0,
      baseResponsiveness: 0,
      backchannelFrequency: 0,
      responseLength: 0,
      emotionalMirroring: 0
    },

    // Accumulated signals that influence drift
    accumulatedSignals: {
      positiveFlow: 0,
      negativeFlow: 0,
      emotionImproved: 0,
      emotionWorsened: 0,
      backchannelAppreciated: 0,
      backchannelRejected: 0,
      longResponses: 0,
      shortResponses: 0,
      interrupts: 0
    },

    // Metadata
    lastUpdated: new Date().toISOString(),
    totalInteractionsCounted: 0,
    driftHistory: [] // Track drift over time
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// IN-MEMORY STATE
// ═══════════════════════════════════════════════════════════════════════════════

let driftState = null;
let updateTimeout = null;

// ═══════════════════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Load drift state from disk
 */
export function loadDriftState() {
  try {
    const dataDir = path.dirname(DRIFT_STATE_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(DRIFT_STATE_FILE)) {
      const data = fs.readFileSync(DRIFT_STATE_FILE, 'utf8');
      driftState = JSON.parse(data);
      console.log('[PersonalityDrift] Loaded drift state');
    } else {
      driftState = createDefaultDriftState();
      saveDriftState();
      console.log('[PersonalityDrift] Created default drift state');
    }
  } catch (error) {
    console.error('[PersonalityDrift] Error loading drift state:', error);
    driftState = createDefaultDriftState();
  }

  return driftState;
}

/**
 * Save drift state to disk
 */
export function saveDriftState() {
  try {
    const dataDir = path.dirname(DRIFT_STATE_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DRIFT_STATE_FILE, JSON.stringify(driftState, null, 2));
  } catch (error) {
    console.error('[PersonalityDrift] Error saving drift state:', error);
  }
}

/**
 * Get current drift state (loads if needed)
 */
export function getDriftState() {
  if (!driftState) {
    loadDriftState();
  }
  return { ...driftState };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL ACCUMULATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Accumulate a signal for drift calculation
 * Signals are accumulated and processed periodically
 *
 * @param {string} signalType - Type of signal
 * @param {number} weight - Weight/intensity of signal (default 1)
 */
export function accumulateSignal(signalType, weight = 1) {
  if (!driftState) {
    loadDriftState();
  }

  const signalMap = {
    'positive_flow': 'positiveFlow',
    'negative_flow': 'negativeFlow',
    'emotion_improved': 'emotionImproved',
    'emotion_worsened': 'emotionWorsened',
    'backchannel_appreciated': 'backchannelAppreciated',
    'user_spoke_over_backchannel': 'backchannelRejected',
    'long_response': 'longResponses',
    'short_response': 'shortResponses',
    'user_interrupt': 'interrupts'
  };

  const key = signalMap[signalType];
  if (key && driftState.accumulatedSignals[key] !== undefined) {
    driftState.accumulatedSignals[key] += weight;
    driftState.totalInteractionsCounted++;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DRIFT CALCULATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Clamp a value within bounds
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * EMA helper for drift calculations
 */
function ema(oldValue, observed, alpha) {
  if (oldValue === null || oldValue === undefined || isNaN(oldValue)) {
    return observed;
  }
  return oldValue * (1 - alpha) + observed * alpha;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TARGET-BASED DRIFT COMPUTATION (New Algorithm)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Drift rates (β values) for each parameter
 * Lower = slower adaptation, higher = faster adaptation
 */
const DRIFT_RATES = {
  backchannelFrequency: 0.03,
  adviceBias: 0.02,
  timingScale: 0.03,
  warmth: 0.02,
  responsiveness: 0.02,
  responseLength: 0.02,
  emotionalMirroring: 0.02
};

/**
 * Update backchannel drift from user preference
 *
 * Formula: drift_new = clamp(drift_old * (1 – β) + (target – base) * β, min, max)
 *
 * @param {Object} profile - User interaction profile
 * @param {Object} config - Luna config with behaviorDefaults
 * @returns {number} Updated backchannel frequency
 */
export function updateBackchannelDrift(profile, config) {
  if (!driftState) loadDriftState();

  const target = profile.preferredBackchannelIntensity || 0.5;
  const base = config?.behaviorDefaults?.neutral?.backchannelFrequency || 0.3;
  const bounds = DRIFT_BOUNDS.backchannelFrequency;

  const delta = target - base;
  const currentValue = driftState.current.backchannelFrequency || bounds.default;

  // Apply bounded EMA
  const newValue = clamp(
    ema(currentValue, bounds.default + delta, DRIFT_RATES.backchannelFrequency),
    bounds.min,
    bounds.max
  );

  driftState.current.backchannelFrequency = newValue;
  return newValue;
}

/**
 * Update advice bias drift from user preference
 *
 * @param {Object} profile - User interaction profile
 * @param {Object} config - Luna config
 * @returns {number} Updated advice bias
 */
export function updateAdviceBiasDrift(profile, config) {
  if (!driftState) loadDriftState();

  const target = profile.preferredAdviceBias || 0.5;
  const base = config?.behaviorDefaults?.neutral?.adviceBias || 0.5;

  // Initialize if needed
  if (driftState.current.adviceBias === undefined) {
    driftState.current.adviceBias = base;
  }

  const delta = target - base;

  // Bound advice bias drift to ±0.3 from base
  const newValue = clamp(
    ema(driftState.current.adviceBias, base + delta, DRIFT_RATES.adviceBias),
    Math.max(0, base - 0.3),
    Math.min(1, base + 0.3)
  );

  driftState.current.adviceBias = newValue;
  return newValue;
}

/**
 * Update timing scale drift from user pause patterns
 *
 * @param {Object} profile - User interaction profile
 * @param {Object} config - Luna config
 * @returns {number} Updated pace
 */
export function updateTimingScaleDrift(profile, config) {
  if (!driftState) loadDriftState();

  const userAvgPause = profile.avgPauseMs || 1000;
  const baseZone2 = config?.timing?.base?.zone2 || 900;

  // Target timing scale based on user pause ratio
  const target = userAvgPause / baseZone2;
  const bounds = DRIFT_BOUNDS.basePace;

  const newValue = clamp(
    ema(driftState.current.basePace, target, DRIFT_RATES.timingScale),
    bounds.min,
    bounds.max
  );

  driftState.current.basePace = newValue;
  return newValue;
}

/**
 * Update warmth drift from emotional patterns
 *
 * @param {Object} profile - User interaction profile
 * @param {Object} config - Luna config
 * @returns {number} Updated warmth
 */
export function updateWarmthDrift(profile, config) {
  if (!driftState) loadDriftState();

  // Calculate target warmth from emotional baseline
  const baseline = profile.emotionalBaseline || {};
  const warmEmotions = (baseline.happy || 0) + (baseline.tender || 0) + (baseline.excited || 0);
  const coldEmotions = (baseline.angry || 0) + (baseline.disgusted || 0);

  // Target warmth: more warm emotions = more warmth
  const target = clamp(0.5 + (warmEmotions - coldEmotions) * 0.5, 0, 1);
  const bounds = DRIFT_BOUNDS.baseWarmth;

  const newValue = clamp(
    ema(driftState.current.baseWarmth, target, DRIFT_RATES.warmth),
    bounds.min,
    bounds.max
  );

  driftState.current.baseWarmth = newValue;
  return newValue;
}

/**
 * Update all drift dimensions from profile and config
 *
 * @param {Object} profile - User interaction profile
 * @param {Object} config - Luna config
 * @returns {Object} All updated values
 */
export function updateAllDriftFromProfile(profile, config) {
  if (!driftState) loadDriftState();

  const updates = {
    backchannelFrequency: updateBackchannelDrift(profile, config),
    adviceBias: updateAdviceBiasDrift(profile, config),
    basePace: updateTimingScaleDrift(profile, config),
    baseWarmth: updateWarmthDrift(profile, config)
  };

  driftState.lastUpdated = new Date().toISOString();
  saveDriftState();

  return updates;
}

/**
 * Apply drift to behavior object (modifies in place)
 * This blends drift into the final behavior configuration
 *
 * @param {Object} behavior - Behavior configuration to modify
 * @param {Object} drift - Drift modifiers
 * @returns {Object} Modified behavior
 */
export function applyDriftToBehavior(behavior, drift = null) {
  if (!drift) {
    drift = getDriftModifiers();
  }

  // Apply backchannel frequency delta
  if (behavior.backchannelFrequency !== undefined && drift.backchannelFrequency !== undefined) {
    const defaultBc = DRIFT_BOUNDS.backchannelFrequency.default;
    behavior.backchannelFrequency += (drift.backchannelFrequency - defaultBc);
  }

  // Apply advice bias delta
  if (behavior.adviceBias !== undefined && drift.adviceBias !== undefined) {
    behavior.adviceBias = drift.adviceBias;
  }

  // Apply timing scale
  if (drift.basePace !== undefined) {
    if (behavior.timing) {
      behavior.timing.zone2 = (behavior.timing.zone2 || 900) * drift.basePace;
      behavior.timing.zone3 = (behavior.timing.zone3 || 2000) * drift.basePace;
    }
  }

  // Apply warmth
  if (behavior.warmth !== undefined && drift.baseWarmth !== undefined) {
    const defaultWarmth = DRIFT_BOUNDS.baseWarmth.default;
    behavior.warmth += (drift.baseWarmth - defaultWarmth);
    behavior.warmth = clamp(behavior.warmth, 0, 1);
  }

  // Apply response length
  if (behavior.responseLength !== undefined && drift.responseLength !== undefined) {
    behavior.responseLength *= drift.responseLength;
  }

  return behavior;
}

/**
 * Calculate new drift values based on accumulated signals
 * This is the core drift logic
 */
export function calculateDrift() {
  if (!driftState) {
    loadDriftState();
  }

  const signals = driftState.accumulatedSignals;
  const current = driftState.current;
  const velocity = driftState.velocity;

  // Calculate signal ratios (positive vs negative indicators)
  const flowRatio = signals.positiveFlow > 0 || signals.negativeFlow > 0
    ? (signals.positiveFlow - signals.negativeFlow) / (signals.positiveFlow + signals.negativeFlow + 1)
    : 0;

  const emotionRatio = signals.emotionImproved > 0 || signals.emotionWorsened > 0
    ? (signals.emotionImproved - signals.emotionWorsened) / (signals.emotionImproved + signals.emotionWorsened + 1)
    : 0;

  const backchannelRatio = signals.backchannelAppreciated > 0 || signals.backchannelRejected > 0
    ? (signals.backchannelAppreciated - signals.backchannelRejected) / (signals.backchannelAppreciated + signals.backchannelRejected + 1)
    : 0;

  const responseLengthRatio = signals.longResponses > 0 || signals.shortResponses > 0
    ? (signals.longResponses - signals.shortResponses) / (signals.longResponses + signals.shortResponses + 1)
    : 0;

  const interruptPressure = signals.interrupts > 0
    ? Math.min(1, signals.interrupts / 20) // Cap at 20 interrupts
    : 0;

  // Update velocities based on signals
  // Positive flow → increase warmth, maintain current settings
  velocity.baseWarmth = flowRatio * 0.1 + emotionRatio * 0.1;

  // Interrupts → speed up pace and responsiveness
  velocity.basePace = interruptPressure * 0.1;
  velocity.baseResponsiveness = interruptPressure * 0.15;

  // Backchannel feedback → adjust frequency
  velocity.backchannelFrequency = backchannelRatio * 0.15;

  // Response length feedback
  velocity.responseLength = responseLengthRatio * 0.1;

  // Emotional improvement → increase emotional mirroring
  velocity.emotionalMirroring = emotionRatio * 0.1;

  // Apply drift with rate limiting
  for (const key of Object.keys(current)) {
    const bounds = DRIFT_BOUNDS[key];
    if (bounds) {
      // Apply velocity with drift rate
      const delta = velocity[key] * DRIFT_RATE;
      current[key] = clamp(current[key] + delta, bounds.min, bounds.max);

      // Decay velocity (natural return toward stability)
      velocity[key] *= 0.9;
    }
  }

  // Record in history (keep last 50 entries)
  driftState.driftHistory.push({
    timestamp: new Date().toISOString(),
    values: { ...current },
    signals: { ...signals }
  });
  if (driftState.driftHistory.length > 50) {
    driftState.driftHistory = driftState.driftHistory.slice(-50);
  }

  // Decay accumulated signals
  for (const key of Object.keys(signals)) {
    signals[key] *= 0.5; // Decay by 50% each update
  }

  driftState.lastUpdated = new Date().toISOString();
  saveDriftState();

  console.log('[PersonalityDrift] Drift updated:', current);
  return current;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DRIFT APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get current drift modifiers for behavior engine
 * These values are multipliers/adjustments to apply to base behavior
 *
 * @returns {Object} Drift modifiers
 */
export function getDriftModifiers() {
  if (!driftState) {
    loadDriftState();
  }

  return {
    ...driftState.current,
    // Also include metadata for debugging
    lastUpdated: driftState.lastUpdated,
    totalInteractions: driftState.totalInteractionsCounted
  };
}

/**
 * Apply drift to a behavior value
 *
 * @param {string} dimension - Drift dimension (e.g., 'baseWarmth')
 * @param {number} baseValue - Base value to modify
 * @returns {number} Modified value
 */
export function applyDrift(dimension, baseValue) {
  if (!driftState) {
    loadDriftState();
  }

  const driftValue = driftState.current[dimension];
  if (driftValue === undefined) {
    return baseValue;
  }

  // Drift values are multipliers centered around 1.0
  // (except warmth which is 0-1)
  if (dimension === 'baseWarmth' || dimension === 'emotionalMirroring') {
    // These are direct values, blend with base
    return baseValue * 0.7 + driftValue * 0.3;
  }

  // Others are multipliers
  return baseValue * driftValue;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MANUAL CONTROLS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Manually nudge a drift dimension
 *
 * @param {string} dimension - Dimension to nudge
 * @param {number} amount - Amount to nudge (-1 to 1)
 */
export function nudgeDrift(dimension, amount) {
  if (!driftState) {
    loadDriftState();
  }

  const bounds = DRIFT_BOUNDS[dimension];
  if (bounds && driftState.current[dimension] !== undefined) {
    const range = bounds.max - bounds.min;
    const nudge = amount * range * 0.1; // 10% of range per unit
    driftState.current[dimension] = clamp(
      driftState.current[dimension] + nudge,
      bounds.min,
      bounds.max
    );
    saveDriftState();
    console.log(`[PersonalityDrift] Nudged ${dimension} by ${nudge} to ${driftState.current[dimension]}`);
  }
}

/**
 * Reset a drift dimension to default
 *
 * @param {string} dimension - Dimension to reset (or 'all' for all)
 */
export function resetDrift(dimension = 'all') {
  if (!driftState) {
    loadDriftState();
  }

  if (dimension === 'all') {
    driftState = createDefaultDriftState();
    console.log('[PersonalityDrift] Reset all drift to defaults');
  } else if (DRIFT_BOUNDS[dimension]) {
    driftState.current[dimension] = DRIFT_BOUNDS[dimension].default;
    driftState.velocity[dimension] = 0;
    console.log(`[PersonalityDrift] Reset ${dimension} to default`);
  }

  saveDriftState();
}

/**
 * Set a drift dimension to a specific value
 *
 * @param {string} dimension - Dimension to set
 * @param {number} value - Value to set
 */
export function setDrift(dimension, value) {
  if (!driftState) {
    loadDriftState();
  }

  const bounds = DRIFT_BOUNDS[dimension];
  if (bounds) {
    driftState.current[dimension] = clamp(value, bounds.min, bounds.max);
    driftState.velocity[dimension] = 0;
    saveDriftState();
    console.log(`[PersonalityDrift] Set ${dimension} to ${driftState.current[dimension]}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTOMATIC UPDATE LOOP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Start automatic drift updates
 */
export function startDriftUpdates() {
  if (updateTimeout) {
    clearInterval(updateTimeout);
  }

  loadDriftState();

  updateTimeout = setInterval(() => {
    if (driftState.totalInteractionsCounted > 0) {
      calculateDrift();
    }
  }, UPDATE_INTERVAL_MS);

  console.log(`[PersonalityDrift] Started automatic updates (every ${UPDATE_INTERVAL_MS / 1000 / 60} minutes)`);
}

/**
 * Stop automatic drift updates
 */
export function stopDriftUpdates() {
  if (updateTimeout) {
    clearInterval(updateTimeout);
    updateTimeout = null;
    console.log('[PersonalityDrift] Stopped automatic updates');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get drift analytics for console display
 *
 * @returns {Object} Analytics data
 */
export function getDriftAnalytics() {
  if (!driftState) {
    loadDriftState();
  }

  const current = driftState.current;
  const deviations = {};

  // Calculate deviation from defaults
  for (const [key, value] of Object.entries(current)) {
    const bounds = DRIFT_BOUNDS[key];
    if (bounds) {
      const range = bounds.max - bounds.min;
      deviations[key] = ((value - bounds.default) / range) * 100;
    }
  }

  return {
    current: { ...current },
    velocity: { ...driftState.velocity },
    accumulatedSignals: { ...driftState.accumulatedSignals },
    deviations,
    bounds: DRIFT_BOUNDS,
    lastUpdated: driftState.lastUpdated,
    totalInteractions: driftState.totalInteractionsCounted,
    historyLength: driftState.driftHistory.length
  };
}

/**
 * Get drift history for visualization
 *
 * @param {number} limit - Number of entries to return
 * @returns {Object[]} Drift history entries
 */
export function getDriftHistory(limit = 20) {
  if (!driftState) {
    loadDriftState();
  }

  return driftState.driftHistory.slice(-limit);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  DRIFT_BOUNDS,
  DRIFT_RATES,
  loadDriftState,
  saveDriftState,
  getDriftState,
  accumulateSignal,
  calculateDrift,
  getDriftModifiers,
  applyDrift,
  applyDriftToBehavior,
  updateBackchannelDrift,
  updateAdviceBiasDrift,
  updateTimingScaleDrift,
  updateWarmthDrift,
  updateAllDriftFromProfile,
  nudgeDrift,
  resetDrift,
  setDrift,
  startDriftUpdates,
  stopDriftUpdates,
  getDriftAnalytics,
  getDriftHistory
};
