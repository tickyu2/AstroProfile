/**
 * ============================================
 * ANCESTRAL TEMPLE LIGHTING LAYER
 * Dynamic lighting system that responds to:
 * - Dialogue emotional tone
 * - Ritual activation
 * - Mythos archetype resonance
 * - Navigation state
 * - Healing phases
 *
 * Controls ambient color, glow, and intensity.
 * ============================================
 */

import { EmotionalProfile } from './advancedDialogue';

// ==================== DATA MODEL ====================

export interface LightingState {
  hue: number;           // 0-360 (HSL hue)
  saturation: number;    // 0-100
  brightness: number;    // 0-100
  pulse: boolean;
  pulseSpeed: 'slow' | 'medium' | 'fast';
  glow: boolean;
  glowIntensity: number; // 0-100
}

export type LightingEvent =
  | 'dialogue'
  | 'ritual'
  | 'mythos'
  | 'navigate'
  | 'healing'
  | 'initiation'
  | 'threshold'
  | 'blessing'
  | 'shadow'
  | 'completion'
  | 'idle';

export interface LightingTrigger {
  id: string;
  event: LightingEvent;
  emotion?: EmotionalProfile;
  archetypeId?: string;
  theme?: string;
  intensity?: number;
}

export interface LightingPreset {
  id: string;
  name: string;
  nameZh: string;
  state: LightingState;
}

// ==================== LIGHTING PRESETS ====================

export const LIGHTING_PRESETS: Record<LightingEvent, LightingState> = {
  idle: {
    hue: 45,
    saturation: 15,
    brightness: 85,
    pulse: false,
    pulseSpeed: 'slow',
    glow: false,
    glowIntensity: 0
  },
  navigate: {
    hue: 200,
    saturation: 20,
    brightness: 75,
    pulse: false,
    pulseSpeed: 'slow',
    glow: true,
    glowIntensity: 20
  },
  dialogue: {
    hue: 35,
    saturation: 40,
    brightness: 65,
    pulse: false,
    pulseSpeed: 'slow',
    glow: true,
    glowIntensity: 30
  },
  ritual: {
    hue: 30,
    saturation: 80,
    brightness: 70,
    pulse: true,
    pulseSpeed: 'slow',
    glow: true,
    glowIntensity: 50
  },
  mythos: {
    hue: 260,
    saturation: 40,
    brightness: 50,
    pulse: false,
    pulseSpeed: 'slow',
    glow: true,
    glowIntensity: 40
  },
  healing: {
    hue: 120,
    saturation: 35,
    brightness: 60,
    pulse: true,
    pulseSpeed: 'slow',
    glow: true,
    glowIntensity: 35
  },
  initiation: {
    hue: 280,
    saturation: 50,
    brightness: 55,
    pulse: true,
    pulseSpeed: 'medium',
    glow: true,
    glowIntensity: 45
  },
  threshold: {
    hue: 0,
    saturation: 10,
    brightness: 40,
    pulse: true,
    pulseSpeed: 'slow',
    glow: false,
    glowIntensity: 0
  },
  blessing: {
    hue: 50,
    saturation: 60,
    brightness: 80,
    pulse: true,
    pulseSpeed: 'slow',
    glow: true,
    glowIntensity: 60
  },
  shadow: {
    hue: 270,
    saturation: 30,
    brightness: 35,
    pulse: false,
    pulseSpeed: 'slow',
    glow: true,
    glowIntensity: 25
  },
  completion: {
    hue: 45,
    saturation: 70,
    brightness: 85,
    pulse: true,
    pulseSpeed: 'fast',
    glow: true,
    glowIntensity: 70
  }
};

// ==================== LIGHTING ENGINE ====================

/**
 * Compute lighting state from a trigger
 */
export function computeLighting(trigger: LightingTrigger): LightingState {
  const baseState = { ...LIGHTING_PRESETS[trigger.event] };

  // Emotional modulation for dialogue
  if (trigger.event === 'dialogue' && trigger.emotion) {
    const emotion = trigger.emotion;

    // Positive emotions: warm hues (30-60)
    // Negative emotions: cool hues (200-280)
    if (emotion.valence > 0) {
      baseState.hue = 30 + (emotion.valence / 100) * 30;
    } else {
      baseState.hue = 260 + (emotion.valence / 100) * 60;
    }

    baseState.saturation = Math.min(80, 30 + emotion.intensity * 0.5);
    baseState.brightness = Math.max(40, 70 - Math.abs(emotion.valence) * 0.2);
    baseState.pulse = emotion.intensity > 60;
    baseState.pulseSpeed = emotion.intensity > 70 ? 'medium' : 'slow';
    baseState.glowIntensity = Math.min(60, emotion.intensity * 0.6);
  }

  // Intensity modulation for rituals
  if (trigger.intensity !== undefined) {
    const intensityFactor = trigger.intensity / 100;
    baseState.saturation = Math.min(100, baseState.saturation * (0.5 + intensityFactor * 0.5));
    baseState.glowIntensity = Math.min(80, baseState.glowIntensity * (0.5 + intensityFactor * 0.5));
  }

  // Theme-based modulation
  if (trigger.theme) {
    const themeHueOffset = getThemeHueOffset(trigger.theme);
    baseState.hue = (baseState.hue + themeHueOffset) % 360;
  }

  return baseState;
}

/**
 * Get hue offset for a theme
 */
function getThemeHueOffset(theme: string): number {
  const themeOffsets: Record<string, number> = {
    'relationship': 10,
    'healing': 90,
    'expression': 30,
    'creativity': 40,
    'wisdom': -30,
    'migration': 180,
    'loss': 200,
    'transformation': 270,
    'blessing': 50,
    'shadow': 240
  };

  const lowerTheme = theme.toLowerCase();
  for (const [key, offset] of Object.entries(themeOffsets)) {
    if (lowerTheme.includes(key)) {
      return offset;
    }
  }
  return 0;
}

/**
 * Blend two lighting states
 */
export function blendLightingStates(
  a: LightingState,
  b: LightingState,
  ratio: number = 0.5
): LightingState {
  const r = Math.max(0, Math.min(1, ratio));
  const ir = 1 - r;

  return {
    hue: Math.round(a.hue * ir + b.hue * r),
    saturation: Math.round(a.saturation * ir + b.saturation * r),
    brightness: Math.round(a.brightness * ir + b.brightness * r),
    pulse: r > 0.5 ? b.pulse : a.pulse,
    pulseSpeed: r > 0.5 ? b.pulseSpeed : a.pulseSpeed,
    glow: a.glow || b.glow,
    glowIntensity: Math.round(a.glowIntensity * ir + b.glowIntensity * r)
  };
}

/**
 * Create transition between two states
 */
export function createLightingTransition(
  from: LightingState,
  to: LightingState,
  steps: number = 10
): LightingState[] {
  const states: LightingState[] = [];

  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    states.push(blendLightingStates(from, to, ratio));
  }

  return states;
}

// ==================== CSS GENERATION ====================

/**
 * Generate CSS variables for a lighting state
 */
export function generateLightingCSS(state: LightingState): string {
  return `
:root {
  --temple-hue: ${state.hue};
  --temple-sat: ${state.saturation}%;
  --temple-bright: ${state.brightness}%;
  --temple-glow-intensity: ${state.glowIntensity}%;
  --temple-pulse-duration: ${state.pulseSpeed === 'fast' ? '0.8s' : state.pulseSpeed === 'medium' ? '1.2s' : '2s'};
}
  `.trim();
}

/**
 * Get complete lighting styles
 */
export function getLightingStyles(): string {
  return `
.temple-lighting {
  background: hsl(var(--temple-hue), var(--temple-sat), var(--temple-bright));
  transition: background 0.6s ease, box-shadow 0.6s ease;
}

.temple-lighting.with-glow {
  box-shadow:
    0 0 20px hsla(var(--temple-hue), var(--temple-sat), 50%, calc(var(--temple-glow-intensity) / 100)),
    0 0 40px hsla(var(--temple-hue), var(--temple-sat), 50%, calc(var(--temple-glow-intensity) / 200));
}

.temple-lighting.pulse {
  animation: templePulse var(--temple-pulse-duration) infinite ease-in-out;
}

@keyframes templePulse {
  0% { filter: brightness(100%); }
  50% { filter: brightness(120%); }
  100% { filter: brightness(100%); }
}

.temple-lighting.glow-pulse {
  animation: templeGlowPulse var(--temple-pulse-duration) infinite ease-in-out;
}

@keyframes templeGlowPulse {
  0% {
    box-shadow:
      0 0 20px hsla(var(--temple-hue), var(--temple-sat), 50%, calc(var(--temple-glow-intensity) / 100)),
      0 0 40px hsla(var(--temple-hue), var(--temple-sat), 50%, calc(var(--temple-glow-intensity) / 200));
  }
  50% {
    box-shadow:
      0 0 30px hsla(var(--temple-hue), var(--temple-sat), 50%, calc(var(--temple-glow-intensity) / 80)),
      0 0 60px hsla(var(--temple-hue), var(--temple-sat), 50%, calc(var(--temple-glow-intensity) / 150));
  }
  100% {
    box-shadow:
      0 0 20px hsla(var(--temple-hue), var(--temple-sat), 50%, calc(var(--temple-glow-intensity) / 100)),
      0 0 40px hsla(var(--temple-hue), var(--temple-sat), 50%, calc(var(--temple-glow-intensity) / 200));
  }
}
  `.trim();
}

/**
 * Get lighting application script
 */
export function getLightingScript(): string {
  return `
function applyTempleLighting(state) {
  const root = document.documentElement;
  root.style.setProperty('--temple-hue', state.hue);
  root.style.setProperty('--temple-sat', state.saturation + '%');
  root.style.setProperty('--temple-bright', state.brightness + '%');
  root.style.setProperty('--temple-glow-intensity', state.glowIntensity + '%');

  const pulseDuration = state.pulseSpeed === 'fast' ? '0.8s' :
                        state.pulseSpeed === 'medium' ? '1.2s' : '2s';
  root.style.setProperty('--temple-pulse-duration', pulseDuration);

  const container = document.querySelector('.temple-lighting');
  if (container) {
    container.classList.toggle('pulse', state.pulse);
    container.classList.toggle('with-glow', state.glow);
    container.classList.toggle('glow-pulse', state.glow && state.pulse);
  }
}

function transitionTempleLighting(fromState, toState, durationMs = 600) {
  const steps = 20;
  const stepDuration = durationMs / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const ratio = currentStep / steps;

    const blendedState = {
      hue: Math.round(fromState.hue * (1 - ratio) + toState.hue * ratio),
      saturation: Math.round(fromState.saturation * (1 - ratio) + toState.saturation * ratio),
      brightness: Math.round(fromState.brightness * (1 - ratio) + toState.brightness * ratio),
      pulse: ratio > 0.5 ? toState.pulse : fromState.pulse,
      pulseSpeed: ratio > 0.5 ? toState.pulseSpeed : fromState.pulseSpeed,
      glow: fromState.glow || toState.glow,
      glowIntensity: Math.round(fromState.glowIntensity * (1 - ratio) + toState.glowIntensity * ratio)
    };

    applyTempleLighting(blendedState);

    if (currentStep >= steps) {
      clearInterval(interval);
    }
  }, stepDuration);
}
  `.trim();
}

// ==================== PRESET HELPERS ====================

/**
 * Get lighting preset by event
 */
export function getLightingPreset(event: LightingEvent): LightingState {
  return { ...LIGHTING_PRESETS[event] };
}

/**
 * Get all available presets
 */
export function getAllLightingPresets(): LightingPreset[] {
  const names: Record<LightingEvent, { name: string; nameZh: string }> = {
    idle: { name: 'Idle', nameZh: '静默' },
    navigate: { name: 'Navigation', nameZh: '导航' },
    dialogue: { name: 'Dialogue', nameZh: '对话' },
    ritual: { name: 'Ritual', nameZh: '仪式' },
    mythos: { name: 'Mythos', nameZh: '神话' },
    healing: { name: 'Healing', nameZh: '疗愈' },
    initiation: { name: 'Initiation', nameZh: '启蒙' },
    threshold: { name: 'Threshold', nameZh: '门槛' },
    blessing: { name: 'Blessing', nameZh: '祝福' },
    shadow: { name: 'Shadow', nameZh: '阴影' },
    completion: { name: 'Completion', nameZh: '完成' }
  };

  return Object.entries(LIGHTING_PRESETS).map(([event, state]) => ({
    id: event,
    name: names[event as LightingEvent].name,
    nameZh: names[event as LightingEvent].nameZh,
    state
  }));
}

// ==================== EXPORTS ====================

export {
  computeLighting,
  blendLightingStates,
  createLightingTransition,
  generateLightingCSS,
  getLightingStyles,
  getLightingScript,
  getLightingPreset,
  getAllLightingPresets,
  LIGHTING_PRESETS
};
