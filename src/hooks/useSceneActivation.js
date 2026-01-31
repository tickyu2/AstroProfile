/**
 * Scene Activation Hook
 *
 * React hook for activating Cathedral scene animations based on
 * scroll position (IntersectionObserver) or user interaction.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ========================================
// TYPES (JSDoc for JavaScript)
// ========================================

/**
 * @typedef {'gate-of-accord' | 'lantern-bridge' | 'still-waters' | 'narrowing-river' | 'veil-of-divergence'} SceneId
 */

/**
 * @typedef {'DoNow' | 'GoodWindow' | 'Neutral' | 'Delay' | 'Avoid'} RelationshipOutcome
 */

/**
 * @typedef {Object} SceneConfig
 * @property {string} cssClass - CSS class for the scene
 * @property {number} duration - Animation duration in ms
 * @property {string} glowClass - Glow effect class
 */

/**
 * @typedef {Object} SceneState
 * @property {boolean} isInView - Element is in viewport
 * @property {boolean} isActive - Animation is running
 * @property {boolean} hasPlayed - Animation has completed at least once
 * @property {number} playCount - Number of times animation has played
 */

/**
 * @typedef {Object} UseSceneActivationReturn
 * @property {React.RefObject} ref - Ref to attach to the scene element
 * @property {SceneState} state - Current scene state
 * @property {Function} activate - Manually activate the scene
 * @property {Function} deactivate - Manually deactivate the scene
 * @property {Function} reset - Reset the scene state
 * @property {string} sceneClass - Combined CSS class string for the scene
 */

// ========================================
// SCENE CONFIGURATIONS
// ========================================

const SCENE_CONFIGS = {
  'gate-of-accord': {
    cssClass: 'scene--gate-of-accord',
    duration: 3000,
    glowClass: 'shadow-emerald-500/40'
  },
  'lantern-bridge': {
    cssClass: 'scene--lantern-bridge',
    duration: 4000,
    glowClass: 'shadow-amber-500/40'
  },
  'still-waters': {
    cssClass: 'scene--still-waters',
    duration: 8000,
    glowClass: 'shadow-slate-500/30'
  },
  'narrowing-river': {
    cssClass: 'scene--narrowing-river',
    duration: 10000,
    glowClass: 'shadow-orange-500/40'
  },
  'veil-of-divergence': {
    cssClass: 'scene--veil-of-divergence',
    duration: 7000,
    glowClass: 'shadow-red-500/40'
  }
};

// Outcome to Scene ID mapping
const OUTCOME_TO_SCENE = {
  DoNow: 'gate-of-accord',
  GoodWindow: 'lantern-bridge',
  Neutral: 'still-waters',
  Delay: 'narrowing-river',
  Avoid: 'veil-of-divergence'
};

// ========================================
// MAIN HOOK
// ========================================

/**
 * Hook for managing Cathedral scene activation
 *
 * @param {Object} options - Hook options
 * @param {SceneId | RelationshipOutcome} options.scene - Scene ID or outcome
 * @param {boolean} [options.triggerOnScroll=true] - Enable scroll-based activation
 * @param {number} [options.threshold=0.5] - IntersectionObserver threshold (0-1)
 * @param {boolean} [options.playOnce=false] - Only play animation once
 * @param {boolean} [options.initialActive=false] - Start in active state
 * @param {Function} [options.onActivate] - Callback when activated
 * @param {Function} [options.onDeactivate] - Callback when deactivated
 * @param {Function} [options.onAnimationComplete] - Callback when animation cycle completes
 * @returns {UseSceneActivationReturn}
 */
export function useSceneActivation({
  scene,
  triggerOnScroll = true,
  threshold = 0.5,
  playOnce = false,
  initialActive = false,
  onActivate,
  onDeactivate,
  onAnimationComplete
} = {}) {
  // Resolve scene ID from outcome if needed
  const sceneId = OUTCOME_TO_SCENE[scene] || scene || 'still-waters';
  const config = SCENE_CONFIGS[sceneId] || SCENE_CONFIGS['still-waters'];

  const ref = useRef(null);
  const animationTimerRef = useRef(null);

  const [state, setState] = useState({
    isInView: false,
    isActive: initialActive,
    hasPlayed: false,
    playCount: 0
  });

  // Cleanup animation timer
  const clearAnimationTimer = useCallback(() => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  }, []);

  // Activate scene
  const activate = useCallback(() => {
    // Check if we should skip (playOnce and already played)
    if (playOnce && state.hasPlayed) {
      return;
    }

    setState(prev => ({
      ...prev,
      isActive: true
    }));

    onActivate?.();

    // Set timer for animation completion
    clearAnimationTimer();
    animationTimerRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        hasPlayed: true,
        playCount: prev.playCount + 1
      }));
      onAnimationComplete?.();
    }, config.duration);
  }, [playOnce, state.hasPlayed, config.duration, onActivate, onAnimationComplete, clearAnimationTimer]);

  // Deactivate scene
  const deactivate = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false
    }));
    clearAnimationTimer();
    onDeactivate?.();
  }, [onDeactivate, clearAnimationTimer]);

  // Reset scene state
  const reset = useCallback(() => {
    clearAnimationTimer();
    setState({
      isInView: false,
      isActive: false,
      hasPlayed: false,
      playCount: 0
    });
  }, [clearAnimationTimer]);

  // IntersectionObserver setup
  useEffect(() => {
    if (!triggerOnScroll || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isInView = entry.isIntersecting;

        setState(prev => ({ ...prev, isInView }));

        if (isInView) {
          activate();
        } else {
          deactivate();
        }
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearAnimationTimer();
    };
  }, [triggerOnScroll, threshold, activate, deactivate, clearAnimationTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAnimationTimer();
  }, [clearAnimationTimer]);

  // Build combined class string
  const sceneClass = [
    'relationship-outcome-scene',
    config.cssClass,
    state.isActive ? 'relationship-outcome-scene--active' : ''
  ].filter(Boolean).join(' ');

  return {
    ref,
    state,
    activate,
    deactivate,
    reset,
    sceneClass,
    config
  };
}

// ========================================
// MULTI-SCENE HOOK
// ========================================

/**
 * Hook for managing multiple Cathedral scenes
 *
 * @param {Array<SceneId | RelationshipOutcome>} scenes - Array of scene IDs
 * @param {Object} options - Shared options for all scenes
 * @returns {Map<string, UseSceneActivationReturn>}
 */
export function useMultiSceneActivation(scenes = [], options = {}) {
  const [sceneStates, setSceneStates] = useState(() => {
    const initial = new Map();
    scenes.forEach(scene => {
      const sceneId = OUTCOME_TO_SCENE[scene] || scene;
      initial.set(sceneId, {
        isInView: false,
        isActive: false,
        hasPlayed: false,
        playCount: 0
      });
    });
    return initial;
  });

  const refs = useRef(new Map());

  const getRef = useCallback((sceneId) => {
    if (!refs.current.has(sceneId)) {
      refs.current.set(sceneId, { current: null });
    }
    return refs.current.get(sceneId);
  }, []);

  const activateScene = useCallback((sceneId) => {
    setSceneStates(prev => {
      const next = new Map(prev);
      const current = next.get(sceneId) || {};
      next.set(sceneId, {
        ...current,
        isActive: true
      });
      return next;
    });
  }, []);

  const deactivateScene = useCallback((sceneId) => {
    setSceneStates(prev => {
      const next = new Map(prev);
      const current = next.get(sceneId) || {};
      next.set(sceneId, {
        ...current,
        isActive: false
      });
      return next;
    });
  }, []);

  const activateAll = useCallback(() => {
    setSceneStates(prev => {
      const next = new Map(prev);
      for (const [key, value] of next) {
        next.set(key, { ...value, isActive: true });
      }
      return next;
    });
  }, []);

  const deactivateAll = useCallback(() => {
    setSceneStates(prev => {
      const next = new Map(prev);
      for (const [key, value] of next) {
        next.set(key, { ...value, isActive: false });
      }
      return next;
    });
  }, []);

  return {
    scenes: sceneStates,
    getRef,
    activateScene,
    deactivateScene,
    activateAll,
    deactivateAll
  };
}

// ========================================
// SEQUENCE ANIMATION HOOK
// ========================================

/**
 * Hook for playing scene animations in sequence
 *
 * @param {Array<SceneId | RelationshipOutcome>} sequence - Ordered scenes
 * @param {Object} options - Options
 * @param {number} [options.delayBetween=500] - Delay between scenes (ms)
 * @param {boolean} [options.loop=false] - Loop the sequence
 * @param {boolean} [options.autoStart=false] - Start automatically
 */
export function useSceneSequence(sequence = [], options = {}) {
  const {
    delayBetween = 500,
    loop = false,
    autoStart = false
  } = options;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const timerRef = useRef(null);

  const resolvedSequence = sequence.map(s => OUTCOME_TO_SCENE[s] || s);

  const currentScene = currentIndex >= 0 && currentIndex < resolvedSequence.length
    ? resolvedSequence[currentIndex]
    : null;

  const currentConfig = currentScene ? SCENE_CONFIGS[currentScene] : null;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advanceToNext = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (next >= resolvedSequence.length) {
        if (loop) {
          return 0;
        } else {
          setIsPlaying(false);
          return -1;
        }
      }
      return next;
    });
  }, [resolvedSequence.length, loop]);

  const start = useCallback(() => {
    setIsPlaying(true);
    setCurrentIndex(0);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(-1);
    clearTimer();
  }, [clearTimer]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (currentIndex >= 0) {
      setIsPlaying(true);
    }
  }, [currentIndex]);

  // Auto-advance through sequence
  useEffect(() => {
    if (!isPlaying || currentIndex < 0 || !currentConfig) return;

    clearTimer();
    timerRef.current = setTimeout(() => {
      advanceToNext();
    }, currentConfig.duration + delayBetween);

    return clearTimer;
  }, [isPlaying, currentIndex, currentConfig, delayBetween, advanceToNext, clearTimer]);

  // Auto-start
  useEffect(() => {
    if (autoStart && resolvedSequence.length > 0) {
      start();
    }
  }, [autoStart, resolvedSequence.length, start]);

  // Cleanup
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    currentScene,
    currentIndex,
    isPlaying,
    start,
    stop,
    pause,
    resume,
    advanceToNext,
    sceneClass: currentConfig
      ? `relationship-outcome-scene ${currentConfig.cssClass} relationship-outcome-scene--active`
      : 'relationship-outcome-scene'
  };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get scene configuration by ID or outcome
 */
export function getSceneConfig(sceneOrOutcome) {
  const sceneId = OUTCOME_TO_SCENE[sceneOrOutcome] || sceneOrOutcome;
  return SCENE_CONFIGS[sceneId] || SCENE_CONFIGS['still-waters'];
}

/**
 * Get all scene configurations
 */
export function getAllSceneConfigs() {
  return { ...SCENE_CONFIGS };
}

/**
 * Map outcome to scene ID
 */
export function outcomeToSceneId(outcome) {
  return OUTCOME_TO_SCENE[outcome] || 'still-waters';
}

/**
 * Get all outcome-to-scene mappings
 */
export function getOutcomeSceneMappings() {
  return { ...OUTCOME_TO_SCENE };
}

export default useSceneActivation;
