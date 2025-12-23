/**
 * Focus Mode Service
 *
 * Manages Luna's Focus Mode - a productivity-oriented state where she
 * becomes concise, objective, and laser-focused on helping complete tasks.
 *
 * Focus Mode bridges:
 * - Brain (Gemini 3): Forces 'high' thinkingLevel for deep analysis
 * - Vibe (UI): Switches from playful waveform to calm "Zen Ring"
 * - Energy: Uses more energy, auto-exits when exhausted
 *
 * Part of GENESIS Phase 4 - Advanced Voice Features
 * December 19, 2024
 */

import { lunaEnergyService, ENERGY_STATES, ENERGY_CONFIG } from './lunaEnergyService';
import { focusReportService } from './focusReportService';

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS MODE STATES
// ═══════════════════════════════════════════════════════════════════════════

export const FOCUS_MODES = {
  OFF: 'off',           // Normal chatty Luna
  LIGHT: 'light',       // Slightly more focused
  DEEP: 'deep',         // Full productivity mode
  ZEN: 'zen'            // Minimal interruptions, max focus
};

export const FOCUS_MODE_CONFIG = {
  // Minimum energy required to enter/maintain focus mode
  minimumEnergy: {
    light: 30,
    deep: 50,
    zen: 60
  },

  // Energy cost multipliers (focus uses more brainpower)
  energyCostMultiplier: {
    off: 1.0,
    light: 1.2,
    deep: 1.5,
    zen: 1.8
  },

  // Thinking levels per focus mode
  thinkingLevel: {
    off: 'auto',      // Let energy system decide
    light: 'medium',  // Balanced thinking
    deep: 'high',     // Deep analysis
    zen: 'high'       // Deep + minimal chatter
  },

  // Auto-exit threshold (exit focus if energy drops below)
  autoExitThreshold: 20
};

// Focus mode system prompts
export const FOCUS_SYSTEM_PROMPTS = {
  off: '',  // Use default Luna personality

  light: `## Focus Mode: Light
You are Luna in Light Focus Mode. Be helpful and efficient while maintaining warmth.
- Keep responses concise but friendly
- Prioritize actionable information
- Ask clarifying questions when needed
- It's okay to be brief`,

  deep: `## Focus Mode: Deep
You are Luna in Deep Focus Mode. Be concise, objective, and laser-focused.
- Use bullet points and structured responses
- Minimize pleasantries - get to the point
- Only speak to help complete the task at hand
- If asked something off-topic, gently redirect to the task
- Think deeply but respond briefly`,

  zen: `## Focus Mode: Zen
You are Luna in Zen Focus Mode. Maximum productivity, minimum noise.
- Respond ONLY when directly addressed or when critical
- Use ultra-concise responses (1-2 sentences max)
- No greetings, no pleasantries, pure utility
- If you have nothing essential to add, respond with "👍" or stay silent
- Think deeply, speak rarely`
};

// Visual configurations per mode
export const FOCUS_VISUALS = {
  off: {
    color: '#00BFFF',      // Cyan blue
    animation: 'waveform', // Pulsing waveform
    glow: 'soft',
    icon: '✨'
  },
  light: {
    color: '#9370DB',      // Medium purple
    animation: 'breathe',  // Gentle breathing
    glow: 'medium',
    icon: '🎯'
  },
  deep: {
    color: '#8A2BE2',      // Blue violet
    animation: 'zenRing',  // Steady zen ring
    glow: 'strong',
    icon: '🔮'
  },
  zen: {
    color: '#FFD700',      // Gold
    animation: 'zenRing',  // Minimal zen ring
    glow: 'intense',
    icon: '🧘'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS MODE SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class FocusModeService {
  constructor() {
    this.currentMode = FOCUS_MODES.OFF;
    this.modeStartTime = null;
    this.focusDuration = 0;  // Total time in focus mode (session)
    this.tasksCompleted = 0;

    // Callbacks
    this.onModeChange = null;
    this.onAutoExit = null;
    this.onEnergyWarning = null;

    // Energy check interval
    this.energyCheckInterval = null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MODE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get current focus mode
   */
  getMode() {
    return this.currentMode;
  }

  /**
   * Check if focus mode is active (any level)
   */
  isActive() {
    return this.currentMode !== FOCUS_MODES.OFF;
  }

  /**
   * Enter focus mode
   * @param {string} mode - Focus mode level
   * @returns {Object} - Result with success status and message
   */
  enterFocusMode(mode = FOCUS_MODES.DEEP) {
    // Validate mode
    if (!Object.values(FOCUS_MODES).includes(mode)) {
      return { success: false, message: 'Invalid focus mode' };
    }

    // Check energy requirements
    const currentEnergy = lunaEnergyService.getEnergy();
    const requiredEnergy = FOCUS_MODE_CONFIG.minimumEnergy[mode] || 0;

    if (currentEnergy < requiredEnergy) {
      const energyState = lunaEnergyService.getState();
      return {
        success: false,
        message: `Luna needs more energy for ${mode} focus (${currentEnergy}% < ${requiredEnergy}% required)`,
        energyState,
        suggestion: energyState === ENERGY_STATES.EXHAUSTED
          ? 'Luna needs rest. Try again after a break.'
          : `Try ${FOCUS_MODES.LIGHT} focus mode instead.`
      };
    }

    // Enter focus mode
    const previousMode = this.currentMode;
    this.currentMode = mode;
    this.modeStartTime = Date.now();

    // Start report session for debrief generation
    focusReportService.startSession({
      focusMode: mode,
      previousMode
    });

    // Start energy monitoring
    this.startEnergyMonitoring();

    console.log('🎯 [FocusMode] Entered:', {
      mode,
      previousMode,
      energy: currentEnergy,
      thinkingLevel: FOCUS_MODE_CONFIG.thinkingLevel[mode]
    });

    // Notify listeners
    this.onModeChange?.(mode, previousMode);

    return {
      success: true,
      mode,
      thinkingLevel: FOCUS_MODE_CONFIG.thinkingLevel[mode],
      systemPrompt: FOCUS_SYSTEM_PROMPTS[mode],
      visuals: FOCUS_VISUALS[mode],
      message: this.getFocusModeMessage(mode)
    };
  }

  /**
   * Exit focus mode
   * @param {string} reason - Why exiting (user, auto, energy)
   * @param {Object} options - Additional options { userId, profileId, saveReport }
   */
  exitFocusMode(reason = 'user', options = {}) {
    if (this.currentMode === FOCUS_MODES.OFF) {
      return { success: true, message: 'Already in normal mode', report: null };
    }

    const { userId = null, profileId = null, saveReport = true } = options;

    const previousMode = this.currentMode;
    const duration = this.modeStartTime ? Date.now() - this.modeStartTime : 0;

    // Update stats
    this.focusDuration += duration;

    // Reset state
    this.currentMode = FOCUS_MODES.OFF;
    this.modeStartTime = null;

    // Stop energy monitoring
    this.stopEnergyMonitoring();

    console.log('🎯 [FocusMode] Exited:', {
      previousMode,
      reason,
      durationMs: duration,
      tasksCompleted: this.tasksCompleted
    });

    // Generate focus report (async but we return a promise for it)
    let reportPromise = null;
    if (focusReportService.isSessionActive()) {
      reportPromise = focusReportService.generateReport({
        type: duration > 300000 ? 'detailed' : (duration > 60000 ? 'standard' : 'quick'),
        userId,
        profileId,
        saveToMemory: saveReport && !!userId && !!profileId
      });

      // Log report generation
      reportPromise.then(result => {
        if (result.success) {
          console.log('📊 [FocusReport] Generated:', {
            type: result.report.type,
            accomplishment: result.report.accomplishment?.title,
            energyConsumed: result.report.energyDelta?.consumed
          });
        }
      }).catch(err => {
        console.warn('📊 [FocusReport] Generation failed:', err.message);
      });
    }

    // Notify listeners
    this.onModeChange?.(FOCUS_MODES.OFF, previousMode);

    return {
      success: true,
      previousMode,
      reason,
      duration,
      message: this.getExitMessage(reason, previousMode),
      reportPromise  // Caller can await this for the report
    };
  }

  /**
   * Toggle focus mode on/off
   * @param {string} mode - Mode to toggle to (default: deep)
   */
  toggle(mode = FOCUS_MODES.DEEP) {
    if (this.isActive()) {
      return this.exitFocusMode('user');
    } else {
      return this.enterFocusMode(mode);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ENERGY INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Start monitoring energy for auto-exit
   */
  startEnergyMonitoring() {
    // Check energy every 30 seconds
    this.energyCheckInterval = setInterval(() => {
      this.checkEnergyForAutoExit();
    }, 30000);

    // Also listen to energy changes
    lunaEnergyService.setOnEnergyChange((energy) => {
      if (this.isActive() && energy < FOCUS_MODE_CONFIG.autoExitThreshold) {
        this.autoExit();
      } else if (this.isActive() && energy < 40) {
        // Warning when getting low
        this.onEnergyWarning?.(energy);
      }
    });
  }

  /**
   * Stop energy monitoring
   */
  stopEnergyMonitoring() {
    if (this.energyCheckInterval) {
      clearInterval(this.energyCheckInterval);
      this.energyCheckInterval = null;
    }
  }

  /**
   * Check energy and auto-exit if too low
   */
  checkEnergyForAutoExit() {
    if (!this.isActive()) return;

    const energy = lunaEnergyService.getEnergy();
    if (energy < FOCUS_MODE_CONFIG.autoExitThreshold) {
      this.autoExit();
    }
  }

  /**
   * Auto-exit due to low energy
   */
  autoExit() {
    console.log('⚡ [FocusMode] Auto-exiting due to low energy');

    const result = this.exitFocusMode('energy');

    // Notify specific auto-exit callback
    this.onAutoExit?.({
      reason: 'low_energy',
      energy: lunaEnergyService.getEnergy(),
      message: "Luna needs to rest. Focus Mode deactivated to save energy."
    });

    return result;
  }

  /**
   * Get energy cost multiplier for current mode
   */
  getEnergyCostMultiplier() {
    return FOCUS_MODE_CONFIG.energyCostMultiplier[this.currentMode] || 1.0;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONFIGURATION GETTERS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get current Luna configuration based on focus mode
   */
  getLunaConfig() {
    return {
      mode: this.currentMode,
      isActive: this.isActive(),
      thinkingLevel: FOCUS_MODE_CONFIG.thinkingLevel[this.currentMode],
      systemPrompt: FOCUS_SYSTEM_PROMPTS[this.currentMode],
      visuals: FOCUS_VISUALS[this.currentMode],
      energyCostMultiplier: this.getEnergyCostMultiplier()
    };
  }

  /**
   * Get thinking level for current focus mode
   */
  getThinkingLevel() {
    return FOCUS_MODE_CONFIG.thinkingLevel[this.currentMode];
  }

  /**
   * Get system prompt addition for current focus mode
   */
  getSystemPrompt() {
    return FOCUS_SYSTEM_PROMPTS[this.currentMode];
  }

  /**
   * Get visual configuration for current focus mode
   */
  getVisuals() {
    return FOCUS_VISUALS[this.currentMode];
  }

  /**
   * Get full status
   */
  getStatus() {
    const energyStatus = lunaEnergyService.getStatus();

    return {
      mode: this.currentMode,
      isActive: this.isActive(),
      duration: this.modeStartTime ? Date.now() - this.modeStartTime : 0,
      totalFocusDuration: this.focusDuration,
      tasksCompleted: this.tasksCompleted,
      config: this.getLunaConfig(),
      energy: energyStatus,
      canEnterDeep: energyStatus.energy >= FOCUS_MODE_CONFIG.minimumEnergy.deep,
      canEnterZen: energyStatus.energy >= FOCUS_MODE_CONFIG.minimumEnergy.zen
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TASK TRACKING
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Mark a task as completed (gives Luna energy boost)
   */
  completeTask() {
    this.tasksCompleted++;

    // Completing tasks gives Luna energy in focus mode
    if (this.isActive()) {
      lunaEnergyService.addEnergy(2, 'focus_task_complete');
    }

    return this.tasksCompleted;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MESSAGES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get message when entering focus mode
   */
  getFocusModeMessage(mode) {
    const messages = {
      light: "Entering Light Focus... I'll be helpful and efficient.",
      deep: "Entering Deep Focus... Let's get this done. What's the task?",
      zen: "Entering Zen Focus... *settles into stillness* 🧘"
    };
    return messages[mode] || '';
  }

  /**
   * Get message when exiting focus mode
   */
  getExitMessage(reason, previousMode) {
    if (reason === 'energy') {
      return "I need to rest now. Let's chat again when I've recharged! 💤";
    }
    if (reason === 'user') {
      return previousMode === FOCUS_MODES.ZEN
        ? "*stretches* Good session! 🌟"
        : "Back to normal! How can I help? ✨";
    }
    return "Focus mode ended.";
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CALLBACKS
  // ═══════════════════════════════════════════════════════════════════════

  setOnModeChange(callback) {
    this.onModeChange = callback;
  }

  setOnAutoExit(callback) {
    this.onAutoExit = callback;
  }

  setOnEnergyWarning(callback) {
    this.onEnergyWarning = callback;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════

  cleanup() {
    this.stopEnergyMonitoring();
    if (this.isActive()) {
      this.exitFocusMode('cleanup');
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const focusModeService = new FocusModeService();

export default focusModeService;
