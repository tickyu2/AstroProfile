/**
 * modeSystem.js
 *
 * Cathedral Mode System - Core configuration and effects.
 * Defines how the Cathedral transforms based on Pilgrim/Scholar/Architect/Sovereign roles.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// ============================================================================
// MODE TYPES
// ============================================================================

/**
 * Available Cathedral modes:
 * - pilgrim: Guided, mythic, narrative-focused journey
 * - scholar: Analytical, annotated, learning-focused
 * - architect: Technical, structural, full system access
 * - sovereign: Strategic, executive, leadership-focused
 */
export const CATHEDRAL_MODES = {
  PILGRIM: 'pilgrim',
  SCHOLAR: 'scholar',
  ARCHITECT: 'architect',
  SOVEREIGN: 'sovereign',
};

// ============================================================================
// MODE ROLE MATRIX
// ============================================================================

/**
 * Complete role matrix defining what each mode sees and how the Cathedral behaves.
 */
export const MODE_MATRIX = {
  pilgrim: {
    label: 'Pilgrim',
    description: 'The seeker. A guided, mythic journey.',
    icon: '🌙',
    theme: 'warm-gold',

    // Access levels
    showDevTools: false,
    showAdvancedCodex: false,
    showDeveloperNotes: false,

    // UI behavior
    uiComplexity: 'simple',
    navigationSpeed: 'slow',
    chartLens: 'basic',
    ritualMode: true,

    // Content focus
    overlayDetail: 'narrative',
    chamberEmphasis: ['ritual', 'ancestral', 'persona'],
    codexAccess: 'core',

    // Voice
    personaRole: 'mentor',
    alternatePersona: 'companion',

    // Animation
    animationStyle: 'breath',
    transitionDuration: 600,
  },

  scholar: {
    label: 'Scholar',
    description: 'The learner. Analytical and annotated.',
    icon: '📚',
    theme: 'parchment',

    showDevTools: false,
    showAdvancedCodex: true,
    showDeveloperNotes: false,

    uiComplexity: 'medium',
    navigationSpeed: 'medium',
    chartLens: 'codex',
    ritualMode: true,

    overlayDetail: 'narrative+technical',
    chamberEmphasis: ['codex', 'mythos', 'timeline'],
    codexAccess: 'advanced',

    personaRole: 'mirror',
    alternatePersona: 'mentor',

    animationStyle: 'highlight',
    transitionDuration: 400,
  },

  architect: {
    label: 'Architect',
    description: 'The builder. Full system access.',
    icon: '🏛️',
    theme: 'blueprint',

    showDevTools: true,
    showAdvancedCodex: true,
    showDeveloperNotes: true,

    uiComplexity: 'high',
    navigationSpeed: 'fast',
    chartLens: 'debug',
    ritualMode: false,

    overlayDetail: 'full',
    chamberEmphasis: ['devtools', 'overlays', 'architecture'],
    codexAccess: 'full',

    personaRole: 'oracle',
    alternatePersona: 'architect',

    animationStyle: 'grid',
    transitionDuration: 260,
  },

  sovereign: {
    label: 'Sovereign',
    description: 'The leader. Strategic and decisive.',
    icon: '👑',
    theme: 'obsidian-gold',

    showDevTools: false,
    showAdvancedCodex: false,
    showDeveloperNotes: false,

    uiComplexity: 'minimalist',
    navigationSpeed: 'instant',
    chartLens: 'strategic',
    ritualMode: false,

    overlayDetail: 'strategic',
    chamberEmphasis: ['sovereign', 'destiny', 'leadership'],
    codexAccess: 'strategic',

    personaRole: 'sovereign',
    alternatePersona: 'oracle',

    animationStyle: 'pulse',
    transitionDuration: 200,
  },
};

// ============================================================================
// MODE-SPECIFIC PERSONA BUNDLES
// ============================================================================

/**
 * Voice bundles tuned to each mode's purpose.
 */
export const MODE_PERSONA_BUNDLES = {
  pilgrim: {
    constellation: "Let's walk gently through what your chart is showing today.",
    ritual: "Stay with this feeling; you're not here to fix, only to witness.",
    story: "Your story is unfolding in ways that honor where you've been.",
    initiation: "You're ready for the next step, and I'll walk with you.",
    decision: "Take your time. The right path will feel like recognition.",
    timing: "This moment has its own wisdom. Trust what it's asking of you.",
    relationship: "Notice how this connection invites you to grow.",
    completion: "You've done meaningful work here. Carry this wisdom forward.",
  },

  scholar: {
    constellation: "Notice the structural relationships between these placements.",
    ritual: "Observe how this pattern shifts when you change your perspective.",
    story: "Here's how this theme recurs across your timeline.",
    initiation: "Let's analyze the symbolic meaning of this threshold.",
    decision: "Consider the variables at play and their relative weights.",
    timing: "This window correlates with several active transits.",
    relationship: "The compatibility matrix shows interesting symmetries.",
    completion: "You've gathered significant insights. Let's consolidate.",
  },

  architect: {
    constellation: "This node interacts with three subsystems: timing, rulership, and aspect flow.",
    ritual: "This pattern is a recursive structure; let's examine its inputs and outputs.",
    story: "Here's the generative rule behind this narrative arc.",
    initiation: "You're stepping into a new configuration; let's map the architecture.",
    decision: "The decision engine weighs 17 overlays. Here's the breakdown.",
    timing: "Current planetary hour: favorable. Micro-timing window: open.",
    relationship: "Composite delta: +0.12. Team leadership polarity: complementary.",
    completion: "System state saved. All overlays computed successfully.",
  },

  sovereign: {
    constellation: "This is the arena where your influence is strongest.",
    ritual: "This pattern is ready to be commanded, not endured.",
    story: "Your trajectory is shifting; choose the direction with intention.",
    initiation: "Step forward — the path responds to your decision.",
    decision: "The strategic outlook favors decisive action.",
    timing: "The window is open. This is your moment to move.",
    relationship: "This partnership serves your larger mission.",
    completion: "Mission accomplished. The Cathedral awaits your next command.",
  },
};

// ============================================================================
// MODE EFFECTS
// ============================================================================

/**
 * Compute all effects for a given mode.
 * Returns a flat object of settings to apply across the Cathedral.
 */
export function getModeEffects(mode) {
  const matrix = MODE_MATRIX[mode] || MODE_MATRIX.pilgrim;

  return {
    // Core mode info
    mode,
    label: matrix.label,
    description: matrix.description,
    icon: matrix.icon,
    theme: matrix.theme,

    // Access flags
    showDevTools: matrix.showDevTools,
    showAdvancedCodex: matrix.showAdvancedCodex,
    showDeveloperNotes: matrix.showDeveloperNotes,

    // UI settings
    uiComplexity: matrix.uiComplexity,
    navigationSpeed: matrix.navigationSpeed,
    chartLens: matrix.chartLens,
    ritualMode: matrix.ritualMode,

    // Content settings
    overlayDetail: matrix.overlayDetail,
    chamberEmphasis: matrix.chamberEmphasis,
    codexAccess: matrix.codexAccess,

    // Voice settings
    personaRole: matrix.personaRole,
    alternatePersona: matrix.alternatePersona,
    personaBundle: MODE_PERSONA_BUNDLES[mode] || MODE_PERSONA_BUNDLES.pilgrim,

    // Animation settings
    animationStyle: matrix.animationStyle,
    transitionDuration: matrix.transitionDuration,

    // CSS class for mode
    modeClass: `mode-${mode}`,
  };
}

/**
 * Get persona voice for a specific stage in the current mode.
 */
export function getModePersonaVoice(mode, stage) {
  const bundle = MODE_PERSONA_BUNDLES[mode] || MODE_PERSONA_BUNDLES.pilgrim;
  return bundle[stage] || bundle.constellation;
}

// ============================================================================
// MODE MEMORY (PERSISTENCE)
// ============================================================================

const MODE_STORAGE_KEY = 'cathedralMode';

/**
 * Load saved mode from localStorage.
 */
export function loadSavedMode() {
  try {
    const saved = localStorage.getItem(MODE_STORAGE_KEY);
    if (saved && MODE_MATRIX[saved]) {
      return saved;
    }
    return CATHEDRAL_MODES.PILGRIM;
  } catch (error) {
    console.warn('[ModeSystem] Error loading saved mode:', error);
    return CATHEDRAL_MODES.PILGRIM;
  }
}

/**
 * Save mode to localStorage.
 */
export function saveMode(mode) {
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    return true;
  } catch (error) {
    console.warn('[ModeSystem] Error saving mode:', error);
    return false;
  }
}

/**
 * Clear saved mode.
 */
export function clearSavedMode() {
  try {
    localStorage.removeItem(MODE_STORAGE_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// MODE CONTEXT
// ============================================================================

const ModeContext = createContext({
  mode: CATHEDRAL_MODES.PILGRIM,
  effects: getModeEffects(CATHEDRAL_MODES.PILGRIM),
  setMode: () => {},
  getPersonaVoice: () => '',
});

/**
 * Mode Provider component.
 * Wraps the Cathedral and provides mode state to all children.
 */
export function ModeProvider({ children, initialMode }) {
  const [mode, setModeState] = useState(() => {
    // Priority: initialMode prop > saved mode > default
    if (initialMode && MODE_MATRIX[initialMode]) {
      return initialMode;
    }
    return loadSavedMode();
  });

  // Compute effects when mode changes
  const effects = useMemo(() => getModeEffects(mode), [mode]);

  // Mode setter that also saves to storage
  const setMode = useCallback((newMode) => {
    if (MODE_MATRIX[newMode]) {
      setModeState(newMode);
      saveMode(newMode);
    }
  }, []);

  // Helper to get persona voice
  const getPersonaVoice = useCallback((stage) => {
    return getModePersonaVoice(mode, stage);
  }, [mode]);

  // Apply mode class to body
  useEffect(() => {
    document.body.classList.remove('mode-pilgrim', 'mode-scholar', 'mode-architect', 'mode-sovereign');
    document.body.classList.add(`mode-${mode}`);
  }, [mode]);

  const value = useMemo(() => ({
    mode,
    effects,
    setMode,
    getPersonaVoice,
  }), [mode, effects, setMode, getPersonaVoice]);

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

/**
 * Hook to access mode context.
 */
export function useMode() {
  return useContext(ModeContext);
}

/**
 * Hook to get just the current mode effects.
 */
export function useModeEffects() {
  const { effects } = useContext(ModeContext);
  return effects;
}

/**
 * Hook to check if a feature is enabled in current mode.
 */
export function useModeFeature(featureName) {
  const { effects } = useContext(ModeContext);
  return effects[featureName];
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ModeContext,
};

export default {
  CATHEDRAL_MODES,
  MODE_MATRIX,
  MODE_PERSONA_BUNDLES,
  getModeEffects,
  getModePersonaVoice,
  loadSavedMode,
  saveMode,
  clearSavedMode,
  ModeProvider,
  useMode,
  useModeEffects,
  useModeFeature,
};
