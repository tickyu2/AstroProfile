/**
 * Luna Energy Management Service
 *
 * Manages Luna's "energy balance" - a state-aware system that makes her
 * feel more human by adjusting her thinking level based on usage patterns.
 *
 * When Luna's energy is high:
 * - Uses 'high' thinking level for deep analysis
 * - Full personality expression
 * - Proactive suggestions
 *
 * When Luna's energy is low:
 * - Auto-downgrades to 'minimal' thinking
 * - Personality modifier: "[Luna is leaning back, looking sleepy]"
 * - Graceful degradation instead of failure
 *
 * Energy regenerates:
 * - During Sleep Consolidation (nightly at 3am)
 * - After periods of inactivity
 * - When user gives positive feedback (reactions)
 *
 * Part of GENESIS Phase 4 - Advanced Voice Features
 * December 19, 2024
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const ENERGY_STATES = {
  FULL: 'full',           // 80-100: Deep thinking available
  RESTED: 'rested',       // 60-79: Normal operation
  NORMAL: 'normal',       // 40-59: Standard mode
  TIRED: 'tired',         // 20-39: Reduced thinking
  EXHAUSTED: 'exhausted'  // 0-19: Minimal mode only
};

export const ENERGY_CONFIG = {
  // Energy thresholds
  thresholds: {
    full: 80,
    rested: 60,
    normal: 40,
    tired: 20,
    exhausted: 0
  },

  // Energy costs per operation
  costs: {
    textMessage: 2,
    voiceSession: 5,
    deepThinking: 8,       // 'high' thinking level
    imageGeneration: 10,
    webSearch: 3,
    memoryRetrieval: 1
  },

  // Energy gains
  gains: {
    positiveReaction: 3,   // User liked/loved a response
    hourInactive: 5,       // Each hour without interaction
    sleepConsolidation: 100, // Full recharge during nightly consolidation
    shortBreak: 10         // After 30 min inactive
  },

  // Timing
  inactivityBreakThreshold: 30 * 60 * 1000,  // 30 minutes
  maxEnergy: 100,
  startingEnergy: 80
};

// Personality modifiers based on energy state
export const ENERGY_PERSONALITY = {
  full: {
    modifier: '',
    icon: '✨',
    description: 'Luna is bright-eyed and fully engaged'
  },
  rested: {
    modifier: '',
    icon: '💫',
    description: 'Luna is relaxed and attentive'
  },
  normal: {
    modifier: '',
    icon: '🌙',
    description: 'Luna is present and listening'
  },
  tired: {
    modifier: "[Luna stifles a small yawn] ",
    icon: '😴',
    description: 'Luna is getting sleepy'
  },
  exhausted: {
    modifier: "[Luna is leaning back, looking a bit drowsy] ",
    icon: '💤',
    description: 'Luna needs rest'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// LUNA ENERGY SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class LunaEnergyService {
  constructor() {
    // Current energy state (per-session, syncs with backend)
    this.energy = ENERGY_CONFIG.startingEnergy;
    this.lastActivity = Date.now();
    this.sessionStart = Date.now();

    // Cache for user-specific energy (from Firestore)
    this.userEnergyCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes

    // Firebase functions reference
    this.functions = null;

    // Activity tracking
    this.messageCount = 0;
    this.deepThinkCount = 0;

    // Callbacks
    this.onEnergyChange = null;
    this.onStateChange = null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Initialize service and load user's energy from backend
   */
  async initialize(userId, profileId) {
    try {
      this.functions = getFunctions();

      // Load energy from backend
      const userEnergy = await this.loadUserEnergy(userId, profileId);
      if (userEnergy !== null) {
        this.energy = userEnergy;
      }

      // Check for inactivity gains
      this.checkInactivityGains();

      console.log('⚡ [LunaEnergy] Initialized:', {
        energy: this.energy,
        state: this.getState()
      });

      return this.energy;

    } catch (error) {
      console.warn('⚠️ [LunaEnergy] Init failed, using default:', error.message);
      return this.energy;
    }
  }

  /**
   * Load user's energy balance from Firestore
   */
  async loadUserEnergy(userId, profileId) {
    if (!userId || !profileId) return null;

    // Check cache first
    const cacheKey = `${userId}:${profileId}`;
    const cached = this.userEnergyCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.energy;
    }

    try {
      const getLunaEnergy = httpsCallable(this.functions, 'getLunaEnergy');
      const result = await getLunaEnergy({ userId, profileId });

      const energy = result.data.energy ?? ENERGY_CONFIG.startingEnergy;

      // Update cache
      this.userEnergyCache.set(cacheKey, {
        energy,
        timestamp: Date.now(),
        lastActivity: result.data.lastActivity
      });

      // Store last activity for inactivity calculations
      if (result.data.lastActivity) {
        this.lastActivity = new Date(result.data.lastActivity).getTime();
      }

      return energy;

    } catch (error) {
      console.warn('⚠️ [LunaEnergy] Failed to load:', error.message);
      return null;
    }
  }

  /**
   * Save energy to backend (debounced, called periodically)
   */
  async saveEnergy(userId, profileId) {
    if (!userId || !profileId || !this.functions) return;

    try {
      const saveLunaEnergy = httpsCallable(this.functions, 'saveLunaEnergy');
      await saveLunaEnergy({
        userId,
        profileId,
        energy: this.energy,
        lastActivity: new Date().toISOString(),
        sessionStats: {
          messageCount: this.messageCount,
          deepThinkCount: this.deepThinkCount,
          sessionDuration: Date.now() - this.sessionStart
        }
      });

      // Update cache
      const cacheKey = `${userId}:${profileId}`;
      this.userEnergyCache.set(cacheKey, {
        energy: this.energy,
        timestamp: Date.now()
      });

    } catch (error) {
      console.warn('⚠️ [LunaEnergy] Failed to save:', error.message);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ENERGY STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get current energy level
   */
  getEnergy() {
    return this.energy;
  }

  /**
   * Get current energy state
   */
  getState() {
    const thresholds = ENERGY_CONFIG.thresholds;

    if (this.energy >= thresholds.full) return ENERGY_STATES.FULL;
    if (this.energy >= thresholds.rested) return ENERGY_STATES.RESTED;
    if (this.energy >= thresholds.normal) return ENERGY_STATES.NORMAL;
    if (this.energy >= thresholds.tired) return ENERGY_STATES.TIRED;
    return ENERGY_STATES.EXHAUSTED;
  }

  /**
   * Get personality modifier based on current energy
   */
  getPersonalityModifier() {
    const state = this.getState();
    return ENERGY_PERSONALITY[state]?.modifier || '';
  }

  /**
   * Get recommended thinking level based on energy
   */
  getRecommendedThinkingLevel() {
    const state = this.getState();

    switch (state) {
      case ENERGY_STATES.FULL:
        return 'high';    // Full brainpower available
      case ENERGY_STATES.RESTED:
        return 'medium';  // Normal operation
      case ENERGY_STATES.NORMAL:
        return 'medium';  // Standard mode
      case ENERGY_STATES.TIRED:
        return 'low';     // Conserve energy
      case ENERGY_STATES.EXHAUSTED:
        return 'minimal'; // Survival mode
      default:
        return 'medium';
    }
  }

  /**
   * Check if high thinking is available
   */
  canUseHighThinking() {
    return this.energy >= ENERGY_CONFIG.thresholds.rested;
  }

  /**
   * Get full energy status for display
   */
  getStatus() {
    const state = this.getState();
    const personality = ENERGY_PERSONALITY[state];

    return {
      energy: this.energy,
      maxEnergy: ENERGY_CONFIG.maxEnergy,
      percent: Math.round((this.energy / ENERGY_CONFIG.maxEnergy) * 100),
      state,
      icon: personality?.icon,
      description: personality?.description,
      modifier: personality?.modifier,
      recommendedThinkingLevel: this.getRecommendedThinkingLevel(),
      canUseHighThinking: this.canUseHighThinking()
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ENERGY CONSUMPTION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Consume energy for an operation
   */
  consumeEnergy(operation, options = {}) {
    const previousState = this.getState();
    const cost = ENERGY_CONFIG.costs[operation] || 1;

    // Apply cost multiplier for high thinking
    const multiplier = options.thinkingLevel === 'high' ? 1.5 : 1;
    const actualCost = Math.round(cost * multiplier);

    this.energy = Math.max(0, this.energy - actualCost);
    this.lastActivity = Date.now();

    // Track stats
    if (operation === 'textMessage' || operation === 'voiceSession') {
      this.messageCount++;
    }
    if (options.thinkingLevel === 'high') {
      this.deepThinkCount++;
    }

    const newState = this.getState();

    console.log('⚡ [LunaEnergy] Consumed:', {
      operation,
      cost: actualCost,
      remaining: this.energy,
      state: newState
    });

    // Notify if state changed
    if (newState !== previousState) {
      this.onStateChange?.(newState, previousState);
    }
    this.onEnergyChange?.(this.energy);

    return {
      consumed: actualCost,
      remaining: this.energy,
      state: newState,
      stateChanged: newState !== previousState
    };
  }

  /**
   * Record text message energy cost
   */
  recordTextMessage(thinkingLevel = 'medium') {
    return this.consumeEnergy('textMessage', { thinkingLevel });
  }

  /**
   * Record voice session energy cost
   */
  recordVoiceSession(duration = 0) {
    const baseCost = this.consumeEnergy('voiceSession');
    // Additional cost for long sessions (every 5 minutes)
    const additionalCost = Math.floor(duration / (5 * 60 * 1000));
    if (additionalCost > 0) {
      this.energy = Math.max(0, this.energy - additionalCost);
    }
    return this.getStatus();
  }

  /**
   * Record deep thinking usage
   */
  recordDeepThinking() {
    return this.consumeEnergy('deepThinking');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ENERGY REGENERATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Add energy (from reactions, rest, etc.)
   */
  addEnergy(amount, source = 'unknown') {
    const previousEnergy = this.energy;
    const previousState = this.getState();

    this.energy = Math.min(ENERGY_CONFIG.maxEnergy, this.energy + amount);
    const newState = this.getState();

    console.log('⚡ [LunaEnergy] Gained:', {
      source,
      amount,
      previousEnergy,
      newEnergy: this.energy,
      state: newState
    });

    if (newState !== previousState) {
      this.onStateChange?.(newState, previousState);
    }
    this.onEnergyChange?.(this.energy);

    return {
      gained: amount,
      total: this.energy,
      state: newState
    };
  }

  /**
   * User reacted positively to a response
   */
  recordPositiveReaction(emoji) {
    // Different emojis give different energy
    const bonusEmojis = ['❤️', '🔥', '💕', '✨', '💙'];
    const amount = bonusEmojis.includes(emoji)
      ? ENERGY_CONFIG.gains.positiveReaction * 1.5
      : ENERGY_CONFIG.gains.positiveReaction;

    return this.addEnergy(Math.round(amount), 'positive_reaction');
  }

  /**
   * Check and apply inactivity gains
   */
  checkInactivityGains() {
    const now = Date.now();
    const inactiveTime = now - this.lastActivity;

    // Short break bonus (30 min inactive)
    if (inactiveTime >= ENERGY_CONFIG.inactivityBreakThreshold) {
      const breakCount = Math.floor(inactiveTime / ENERGY_CONFIG.inactivityBreakThreshold);
      const gain = breakCount * ENERGY_CONFIG.gains.shortBreak;

      // Cap at 50% recovery from inactivity
      const maxGain = Math.floor(ENERGY_CONFIG.maxEnergy * 0.5);
      const actualGain = Math.min(gain, maxGain);

      if (actualGain > 0 && this.energy < ENERGY_CONFIG.maxEnergy) {
        this.addEnergy(actualGain, 'inactivity_rest');
      }
    }
  }

  /**
   * Full recharge (called during sleep consolidation)
   */
  recharge() {
    const previousEnergy = this.energy;
    this.energy = ENERGY_CONFIG.maxEnergy;
    this.messageCount = 0;
    this.deepThinkCount = 0;

    console.log('⚡ [LunaEnergy] Full recharge:', {
      previous: previousEnergy,
      new: this.energy
    });

    this.onStateChange?.(ENERGY_STATES.FULL, this.getState());
    this.onEnergyChange?.(this.energy);

    return this.getStatus();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ENERGY-AWARE MESSAGE PREPARATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Prepare message with energy-aware modifications
   * Returns adjusted thinkingLevel and personality modifier
   */
  prepareMessage(requestedThinkingLevel = 'auto') {
    const status = this.getStatus();

    // Determine actual thinking level
    let effectiveLevel = requestedThinkingLevel;

    if (requestedThinkingLevel === 'auto') {
      effectiveLevel = status.recommendedThinkingLevel;
    } else if (requestedThinkingLevel === 'high' && !status.canUseHighThinking) {
      // Downgrade if not enough energy for high thinking
      effectiveLevel = 'medium';
      console.log('⚡ [LunaEnergy] Downgraded from high to medium (low energy)');
    }

    // Force minimal if exhausted
    if (status.state === ENERGY_STATES.EXHAUSTED) {
      effectiveLevel = 'minimal';
    }

    return {
      thinkingLevel: effectiveLevel,
      personalityModifier: status.modifier,
      energyStatus: status,
      wasDowngraded: effectiveLevel !== requestedThinkingLevel && requestedThinkingLevel !== 'auto'
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CALLBACKS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Set callback for energy changes
   */
  setOnEnergyChange(callback) {
    this.onEnergyChange = callback;
  }

  /**
   * Set callback for state changes
   */
  setOnStateChange(callback) {
    this.onStateChange = callback;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Clean up and save state
   */
  async cleanup(userId, profileId) {
    await this.saveEnergy(userId, profileId);
    this.userEnergyCache.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const lunaEnergyService = new LunaEnergyService();

export default lunaEnergyService;
