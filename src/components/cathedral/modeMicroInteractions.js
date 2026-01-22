/**
 * modeMicroInteractions.js
 *
 * Mode-specific micro-interactions that make the Cathedral feel handcrafted.
 * These are the tiny, delightful interactions that define each mode's character.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

// ============================================================================
// MICRO-INTERACTION CONFIGURATIONS
// ============================================================================

export const MODE_MICRO_INTERACTIONS = {
  pilgrim: {
    name: 'Warmth & Breath',
    description: 'Safety, warmth, invitation',
    emotion: 'gentle_mythic',

    // Hover behaviors
    hover: {
      buttons: {
        effect: 'breath',
        scale: 1.03,
        duration: 2000,
        easing: 'ease-in-out',
        glow: {
          color: 'rgba(255, 215, 128, 0.3)',
          spread: 15,
        },
      },
      cards: {
        effect: 'glow_edge',
        glowColor: 'rgba(255, 215, 128, 0.4)',
        glowWidth: 2,
        duration: 300,
      },
      chartNodes: {
        effect: 'firefly_pulse',
        scale: 1.15,
        glowIntensity: 0.6,
        duration: 1500,
        easing: 'ease-in-out',
      },
      links: {
        effect: 'warm_underline',
        color: '#ffd780',
        thickness: 2,
        style: 'glow',
      },
    },

    // Click behaviors
    click: {
      buttons: {
        effect: 'ripple_warm',
        color: 'rgba(255, 215, 128, 0.4)',
        duration: 400,
        scale: 1.02,
      },
      cards: {
        effect: 'bloom',
        color: 'rgba(255, 215, 128, 0.2)',
        duration: 300,
      },
    },

    // Scroll behaviors
    scroll: {
      momentum: 'eased',
      friction: 0.92,
      snapBehavior: 'soft',
      revealAnimation: 'fade_up',
      revealDelay: 100,
    },

    // Focus behaviors
    focus: {
      ring: {
        color: 'rgba(255, 215, 128, 0.5)',
        width: 3,
        style: 'glow',
        offset: 2,
      },
      transition: 300,
    },

    // Drag behaviors
    drag: {
      cursor: 'grab',
      activeCursor: 'grabbing',
      ghostOpacity: 0.6,
      snapToGrid: false,
      dropGlow: true,
    },
  },

  scholar: {
    name: 'Ink & Light',
    description: 'Curiosity, clarity, discovery',
    emotion: 'intellectual',

    hover: {
      buttons: {
        effect: 'highlight',
        backgroundColor: 'rgba(232, 213, 163, 0.1)',
        borderColor: 'rgba(232, 213, 163, 0.4)',
        duration: 200,
      },
      cards: {
        effect: 'margin_note_reveal',
        noteOpacity: 1,
        duration: 250,
      },
      chartNodes: {
        effect: 'definition_tooltip',
        showDefinition: true,
        duration: 200,
      },
      links: {
        effect: 'footnote_number',
        showReference: true,
        underline: 'dotted',
      },
      annotations: {
        effect: 'highlight_text',
        backgroundColor: 'rgba(232, 213, 163, 0.15)',
        duration: 150,
      },
    },

    click: {
      buttons: {
        effect: 'ink_spread',
        color: 'rgba(232, 213, 163, 0.3)',
        duration: 300,
      },
      footnotes: {
        effect: 'expand_reference',
        duration: 250,
      },
    },

    scroll: {
      momentum: 'natural',
      friction: 0.88,
      snapBehavior: 'none',
      revealAnimation: 'slide_left',
      revealDelay: 50,
      annotationReveal: 'sequential',
    },

    focus: {
      ring: {
        color: 'rgba(232, 213, 163, 0.6)',
        width: 2,
        style: 'solid',
        offset: 1,
      },
      transition: 200,
    },

    drag: {
      cursor: 'text',
      activeCursor: 'crosshair',
      ghostOpacity: 0.8,
      snapToGrid: false,
      dropGlow: false,
    },
  },

  architect: {
    name: 'Grid & Snap',
    description: 'Precision, structure, mastery',
    emotion: 'engineering',

    hover: {
      buttons: {
        effect: 'highlight_border',
        borderColor: 'rgba(96, 165, 250, 0.6)',
        duration: 150,
      },
      cards: {
        effect: 'grid_reveal',
        gridColor: 'rgba(96, 165, 250, 0.1)',
        duration: 200,
      },
      chartNodes: {
        effect: 'rule_origin_reveal',
        showRuleOrigin: true,
        highlightDependencies: true,
        duration: 150,
      },
      overlayPanels: {
        effect: 'dependency_highlight',
        showConnections: true,
        duration: 100,
      },
      links: {
        effect: 'code_highlight',
        fontFamily: 'monospace',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
      },
    },

    click: {
      buttons: {
        effect: 'snap_feedback',
        scale: 0.98,
        duration: 100,
        sound: 'click',
      },
      toggles: {
        effect: 'binary_switch',
        duration: 80,
      },
      devToolsPanels: {
        effect: 'grid_ripple',
        color: 'rgba(96, 165, 250, 0.3)',
        duration: 200,
      },
    },

    scroll: {
      momentum: 'precise',
      friction: 0.85,
      snapBehavior: 'grid',
      gridSize: 20,
      revealAnimation: 'scale_in',
      revealDelay: 30,
    },

    focus: {
      ring: {
        color: 'rgba(96, 165, 250, 0.7)',
        width: 2,
        style: 'dashed',
        offset: 0,
      },
      transition: 150,
    },

    drag: {
      cursor: 'move',
      activeCursor: 'grabbing',
      ghostOpacity: 0.9,
      snapToGrid: true,
      gridSize: 20,
      showGuides: true,
      guideColor: 'rgba(96, 165, 250, 0.5)',
    },
  },

  sovereign: {
    name: 'Command & Presence',
    description: 'Authority, decisiveness, command',
    emotion: 'regal',

    hover: {
      buttons: {
        effect: 'command_pulse',
        scale: 1.02,
        borderGlow: 'rgba(251, 191, 36, 0.5)',
        duration: 200,
      },
      cards: {
        effect: 'strategic_highlight',
        borderColor: 'rgba(251, 191, 36, 0.4)',
        duration: 150,
      },
      chartNodes: {
        effect: 'strategic_vector',
        showInfluenceArcs: true,
        duration: 200,
      },
      strategicWindows: {
        effect: 'window_highlight',
        glowIntensity: 0.7,
        duration: 150,
      },
      links: {
        effect: 'gold_underline',
        color: '#fbbf24',
        thickness: 2,
      },
    },

    click: {
      buttons: {
        effect: 'firm_pulse',
        scale: 1.05,
        duration: 150,
        rebound: 0.98,
      },
      cards: {
        effect: 'lock_in',
        sound: 'subtle_click',
        duration: 100,
      },
      decisions: {
        effect: 'decree_seal',
        glowBurst: true,
        duration: 300,
      },
    },

    scroll: {
      momentum: 'instant',
      friction: 0.75,
      snapBehavior: 'decisive',
      revealAnimation: 'cut_in',
      revealDelay: 0,
    },

    focus: {
      ring: {
        color: 'rgba(251, 191, 36, 0.6)',
        width: 2,
        style: 'solid',
        offset: 1,
      },
      transition: 100,
    },

    drag: {
      cursor: 'pointer',
      activeCursor: 'grabbing',
      ghostOpacity: 0.95,
      snapToGrid: false,
      showInfluence: true,
    },
  },
};

// ============================================================================
// INTERACTION TYPE ENUMS
// ============================================================================

export const INTERACTION_TYPES = {
  HOVER_ENTER: 'hover_enter',
  HOVER_LEAVE: 'hover_leave',
  CLICK: 'click',
  DOUBLE_CLICK: 'double_click',
  LONG_PRESS: 'long_press',
  DRAG_START: 'drag_start',
  DRAG_MOVE: 'drag_move',
  DRAG_END: 'drag_end',
  FOCUS: 'focus',
  BLUR: 'blur',
  SCROLL: 'scroll',
};

export const ELEMENT_TYPES = {
  BUTTON: 'buttons',
  CARD: 'cards',
  CHART_NODE: 'chartNodes',
  LINK: 'links',
  ANNOTATION: 'annotations',
  OVERLAY_PANEL: 'overlayPanels',
  TOGGLE: 'toggles',
  DEVTOOLS_PANEL: 'devToolsPanels',
  STRATEGIC_WINDOW: 'strategicWindows',
  FOOTNOTE: 'footnotes',
  DECISION: 'decisions',
};

// ============================================================================
// MICRO-INTERACTION UTILITIES
// ============================================================================

/**
 * Get micro-interaction config for a mode.
 */
export function getMicroInteractions(mode) {
  return MODE_MICRO_INTERACTIONS[mode] || MODE_MICRO_INTERACTIONS.pilgrim;
}

/**
 * Get hover effect for a specific element type.
 */
export function getHoverEffect(mode, elementType) {
  const interactions = getMicroInteractions(mode);
  return interactions.hover[elementType] || interactions.hover.buttons;
}

/**
 * Get click effect for a specific element type.
 */
export function getClickEffect(mode, elementType) {
  const interactions = getMicroInteractions(mode);
  return interactions.click[elementType] || interactions.click.buttons;
}

/**
 * Get scroll configuration for a mode.
 */
export function getScrollConfig(mode) {
  const interactions = getMicroInteractions(mode);
  return interactions.scroll;
}

/**
 * Get focus ring style for a mode.
 */
export function getFocusStyle(mode) {
  const interactions = getMicroInteractions(mode);
  return interactions.focus;
}

/**
 * Get drag behavior for a mode.
 */
export function getDragBehavior(mode) {
  const interactions = getMicroInteractions(mode);
  return interactions.drag;
}

/**
 * Generate CSS for focus ring based on mode.
 */
export function generateFocusRingCSS(mode) {
  const focus = getFocusStyle(mode);
  const { ring, transition } = focus;

  if (ring.style === 'glow') {
    return `
      outline: none;
      box-shadow: 0 0 0 ${ring.offset}px transparent,
                  0 0 0 ${ring.offset + ring.width}px ${ring.color},
                  0 0 ${ring.width * 3}px ${ring.color};
      transition: box-shadow ${transition}ms ease;
    `;
  }

  return `
    outline: ${ring.width}px ${ring.style} ${ring.color};
    outline-offset: ${ring.offset}px;
    transition: outline ${transition}ms ease;
  `;
}

/**
 * Generate scroll momentum CSS based on mode.
 */
export function generateScrollCSS(mode) {
  const scroll = getScrollConfig(mode);

  const scrollBehaviors = {
    eased: 'scroll-behavior: smooth;',
    natural: 'scroll-behavior: auto;',
    precise: 'scroll-behavior: auto; scroll-snap-type: y mandatory;',
    instant: 'scroll-behavior: auto;',
  };

  return scrollBehaviors[scroll.momentum] || scrollBehaviors.natural;
}

// ============================================================================
// CSS ANIMATION GENERATORS
// ============================================================================

/**
 * Generate keyframes for hover effects.
 */
export const HOVER_ANIMATIONS = {
  breath: `
    @keyframes breath {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
  `,
  firefly_pulse: `
    @keyframes fireflyPulse {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.15); }
    }
  `,
  grid_ripple: `
    @keyframes gridRipple {
      0% { background-size: 40px 40px; opacity: 0; }
      100% { background-size: 20px 20px; opacity: 1; }
    }
  `,
  command_pulse: `
    @keyframes commandPulse {
      0% { box-shadow: 0 0 0 rgba(251, 191, 36, 0); }
      50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
      100% { box-shadow: 0 0 0 rgba(251, 191, 36, 0); }
    }
  `,
};

/**
 * Generate all animation keyframes for a mode.
 */
export function generateModeAnimations(mode) {
  const animations = [];

  switch (mode) {
    case 'pilgrim':
      animations.push(HOVER_ANIMATIONS.breath);
      animations.push(HOVER_ANIMATIONS.firefly_pulse);
      break;
    case 'scholar':
      // Scholar uses CSS transitions, minimal keyframes
      break;
    case 'architect':
      animations.push(HOVER_ANIMATIONS.grid_ripple);
      break;
    case 'sovereign':
      animations.push(HOVER_ANIMATIONS.command_pulse);
      break;
  }

  return animations.join('\n');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  MODE_MICRO_INTERACTIONS,
  INTERACTION_TYPES,
  ELEMENT_TYPES,
  getMicroInteractions,
  getHoverEffect,
  getClickEffect,
  getScrollConfig,
  getFocusStyle,
  getDragBehavior,
  generateFocusRingCSS,
  generateScrollCSS,
  HOVER_ANIMATIONS,
  generateModeAnimations,
};
