/**
 * ============================================
 * ANCESTRAL TEMPLE ANIMATION LAYER
 * Subtle animation system for the Temple
 *
 * This layer brings the Temple to life with:
 * - Panel transitions
 * - Generational line animations
 * - Constellation node pulses
 * - Dialogue flow effects
 * - Ritual timing glows
 *
 * Designed to be ceremonial and subtle,
 * not overwhelming the ritual tone.
 * ============================================
 */

// ==================== DATA MODEL ====================

export type AnimationTrigger =
  | 'enter'
  | 'exit'
  | 'navigate'
  | 'initiation'
  | 'dialogue'
  | 'ritual'
  | 'mythos'
  | 'healing'
  | 'timeline'
  | 'constellation'
  | 'highlight'
  | 'pulse';

export interface TempleAnimation {
  id: string;
  trigger: AnimationTrigger;
  element: string;           // CSS selector
  animationClass: string;    // CSS animation class to apply
  duration: number;          // milliseconds
  delay?: number;            // delay before animation
  easing?: string;           // CSS easing function
}

export interface AnimationSequence {
  id: string;
  name: string;
  animations: TempleAnimation[];
  totalDuration: number;
}

export interface AnimationState {
  activeAnimations: Set<string>;
  lastTrigger?: AnimationTrigger;
  isAnimating: boolean;
}

// ==================== ANIMATION LIBRARY ====================

export const TEMPLE_ANIMATIONS: TempleAnimation[] = [
  // Enter animations
  {
    id: 'enter_fade',
    trigger: 'enter',
    element: '.temple-container',
    animationClass: 'anim-fade-in',
    duration: 800
  },
  {
    id: 'enter_header',
    trigger: 'enter',
    element: '.temple-header',
    animationClass: 'anim-slide-down',
    duration: 600,
    delay: 200
  },

  // Navigation animations
  {
    id: 'nav_slide',
    trigger: 'navigate',
    element: '.temple-panel',
    animationClass: 'anim-fade-slide',
    duration: 400
  },
  {
    id: 'nav_breadcrumb',
    trigger: 'navigate',
    element: '.breadcrumb-item',
    animationClass: 'anim-highlight-pulse',
    duration: 600
  },

  // Dialogue animations
  {
    id: 'dialogue_turn',
    trigger: 'dialogue',
    element: '.dialogue-turn',
    animationClass: 'anim-fade-slide',
    duration: 500
  },
  {
    id: 'dialogue_pulse',
    trigger: 'dialogue',
    element: '.dialogue-container',
    animationClass: 'anim-glow-pulse',
    duration: 1200
  },

  // Ritual animations
  {
    id: 'ritual_glow',
    trigger: 'ritual',
    element: '.ritual-card',
    animationClass: 'anim-glow-pulse',
    duration: 1500
  },
  {
    id: 'ritual_step',
    trigger: 'ritual',
    element: '.ritual-step',
    animationClass: 'anim-fade-up',
    duration: 600
  },

  // Mythos animations
  {
    id: 'mythos_reveal',
    trigger: 'mythos',
    element: '.codex-page',
    animationClass: 'anim-scale-in',
    duration: 500
  },
  {
    id: 'mythos_symbol',
    trigger: 'mythos',
    element: '.archetype-symbol',
    animationClass: 'anim-float',
    duration: 2000
  },

  // Constellation animations
  {
    id: 'constellation_node',
    trigger: 'constellation',
    element: '.constellation-node',
    animationClass: 'anim-pulse',
    duration: 1000
  },
  {
    id: 'constellation_line',
    trigger: 'constellation',
    element: '.constellation-thread',
    animationClass: 'anim-draw-line',
    duration: 800
  },

  // Timeline animations
  {
    id: 'timeline_bar',
    trigger: 'timeline',
    element: '.timeline-event',
    animationClass: 'anim-grow-width',
    duration: 600
  },

  // Highlight animations
  {
    id: 'highlight_element',
    trigger: 'highlight',
    element: '.highlighted',
    animationClass: 'anim-highlight-border',
    duration: 1000
  },

  // General pulse
  {
    id: 'pulse_generic',
    trigger: 'pulse',
    element: '.pulse-target',
    animationClass: 'anim-glow-pulse',
    duration: 1200
  }
];

// ==================== ANIMATION ENGINE ====================

/**
 * Apply a single animation
 */
export function applyAnimation(anim: TempleAnimation): Promise<void> {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll(anim.element);
    if (elements.length === 0) {
      resolve();
      return;
    }

    const applyToElement = (el: Element) => {
      if (anim.delay) {
        setTimeout(() => {
          el.classList.add(anim.animationClass);
        }, anim.delay);
      } else {
        el.classList.add(anim.animationClass);
      }

      // Remove animation class after completion
      setTimeout(() => {
        el.classList.remove(anim.animationClass);
      }, (anim.delay || 0) + anim.duration);
    };

    elements.forEach(applyToElement);

    // Resolve after total duration
    setTimeout(resolve, (anim.delay || 0) + anim.duration);
  });
}

/**
 * Apply animations by trigger
 */
export function applyAnimationsByTrigger(
  trigger: AnimationTrigger,
  animations: TempleAnimation[] = TEMPLE_ANIMATIONS
): Promise<void[]> {
  const matching = animations.filter(a => a.trigger === trigger);
  return Promise.all(matching.map(applyAnimation));
}

/**
 * Apply an animation sequence
 */
export async function applyAnimationSequence(
  sequence: AnimationSequence
): Promise<void> {
  for (const anim of sequence.animations) {
    await applyAnimation(anim);
  }
}

/**
 * Create animation state manager
 */
export function createAnimationState(): AnimationState {
  return {
    activeAnimations: new Set(),
    isAnimating: false
  };
}

/**
 * Apply animation with state tracking
 */
export async function applyAnimationWithState(
  anim: TempleAnimation,
  state: AnimationState
): Promise<void> {
  state.activeAnimations.add(anim.id);
  state.isAnimating = true;
  state.lastTrigger = anim.trigger;

  await applyAnimation(anim);

  state.activeAnimations.delete(anim.id);
  state.isAnimating = state.activeAnimations.size > 0;
}

// ==================== PREDEFINED SEQUENCES ====================

export const ANIMATION_SEQUENCES: Record<string, AnimationSequence> = {
  templeEnter: {
    id: 'temple_enter_sequence',
    name: 'Temple Enter',
    animations: [
      TEMPLE_ANIMATIONS.find(a => a.id === 'enter_fade')!,
      TEMPLE_ANIMATIONS.find(a => a.id === 'enter_header')!
    ].filter(Boolean),
    totalDuration: 1000
  },
  dialogueFlow: {
    id: 'dialogue_flow_sequence',
    name: 'Dialogue Flow',
    animations: [
      TEMPLE_ANIMATIONS.find(a => a.id === 'dialogue_turn')!,
      TEMPLE_ANIMATIONS.find(a => a.id === 'dialogue_pulse')!
    ].filter(Boolean),
    totalDuration: 1700
  },
  ritualCeremony: {
    id: 'ritual_ceremony_sequence',
    name: 'Ritual Ceremony',
    animations: [
      TEMPLE_ANIMATIONS.find(a => a.id === 'ritual_glow')!,
      TEMPLE_ANIMATIONS.find(a => a.id === 'ritual_step')!
    ].filter(Boolean),
    totalDuration: 2100
  },
  mythosReveal: {
    id: 'mythos_reveal_sequence',
    name: 'Mythos Reveal',
    animations: [
      TEMPLE_ANIMATIONS.find(a => a.id === 'mythos_reveal')!,
      TEMPLE_ANIMATIONS.find(a => a.id === 'mythos_symbol')!
    ].filter(Boolean),
    totalDuration: 2500
  }
};

// ==================== CSS GENERATOR ====================

/**
 * Generate CSS for all temple animations
 */
export function generateAnimationCSS(): string {
  return `
    /* ==================== TEMPLE ANIMATIONS ==================== */

    /* Fade In */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .anim-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }

    /* Slide Down */
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .anim-slide-down {
      animation: slideDown 0.6s ease-out forwards;
    }

    /* Fade Slide (from bottom) */
    @keyframes fadeSlide {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .anim-fade-slide {
      animation: fadeSlide 0.5s ease-out forwards;
    }

    /* Fade Up */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .anim-fade-up {
      animation: fadeUp 0.6s ease-out forwards;
    }

    /* Glow Pulse */
    @keyframes glowPulse {
      0% { box-shadow: 0 0 0px rgba(244, 208, 63, 0.0); }
      50% { box-shadow: 0 0 20px rgba(244, 208, 63, 0.5); }
      100% { box-shadow: 0 0 0px rgba(244, 208, 63, 0.0); }
    }
    .anim-glow-pulse {
      animation: glowPulse 1.2s ease-out;
    }

    /* Highlight Pulse */
    @keyframes highlightPulse {
      0% { background-color: transparent; }
      50% { background-color: rgba(244, 208, 63, 0.2); }
      100% { background-color: transparent; }
    }
    .anim-highlight-pulse {
      animation: highlightPulse 0.6s ease-out;
    }

    /* Highlight Border */
    @keyframes highlightBorder {
      0% { border-color: inherit; }
      50% { border-color: #f4d03f; }
      100% { border-color: inherit; }
    }
    .anim-highlight-border {
      animation: highlightBorder 1s ease-out;
    }

    /* Scale In */
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .anim-scale-in {
      animation: scaleIn 0.5s ease-out forwards;
    }

    /* Float */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .anim-float {
      animation: float 2s ease-in-out infinite;
    }

    /* Pulse */
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }
    .anim-pulse {
      animation: pulse 1s ease-in-out;
    }

    /* Draw Line */
    @keyframes drawLine {
      from { stroke-dashoffset: 100%; }
      to { stroke-dashoffset: 0; }
    }
    .anim-draw-line {
      stroke-dasharray: 100%;
      animation: drawLine 0.8s ease-out forwards;
    }

    /* Grow Width */
    @keyframes growWidth {
      from { width: 0; }
      to { width: var(--target-width, 100%); }
    }
    .anim-grow-width {
      animation: growWidth 0.6s ease-out forwards;
    }

    /* Ritual Shimmer */
    @keyframes ritualShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .anim-shimmer {
      background: linear-gradient(90deg, transparent, rgba(244, 208, 63, 0.3), transparent);
      background-size: 200% 100%;
      animation: ritualShimmer 2s ease-in-out;
    }
  `;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get animation by ID
 */
export function getAnimationById(id: string): TempleAnimation | undefined {
  return TEMPLE_ANIMATIONS.find(a => a.id === id);
}

/**
 * Get animations by trigger
 */
export function getAnimationsByTrigger(trigger: AnimationTrigger): TempleAnimation[] {
  return TEMPLE_ANIMATIONS.filter(a => a.trigger === trigger);
}

/**
 * Create custom animation
 */
export function createCustomAnimation(
  id: string,
  trigger: AnimationTrigger,
  element: string,
  animationClass: string,
  duration: number,
  options?: { delay?: number; easing?: string }
): TempleAnimation {
  return {
    id,
    trigger,
    element,
    animationClass,
    duration,
    ...options
  };
}

// ==================== EXPORTS ====================

export {
  TEMPLE_ANIMATIONS,
  ANIMATION_SEQUENCES,
  applyAnimation,
  applyAnimationsByTrigger,
  applyAnimationSequence,
  createAnimationState,
  applyAnimationWithState,
  generateAnimationCSS,
  getAnimationById,
  getAnimationsByTrigger,
  createCustomAnimation
};
