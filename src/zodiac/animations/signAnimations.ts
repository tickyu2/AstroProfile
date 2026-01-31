/**
 * Sign Animation Registry
 * Each sign has its own motion grammar, color field, and animation archetype
 * Plugs into wheel, Pure Sign Panel, and Cusp Panel
 */

// ============================================================================
// Types
// ============================================================================

export type ParticleType =
  | 'sparks'
  | 'dust'
  | 'air-swirl'
  | 'tide'
  | 'solar-flare'
  | 'grain'
  | 'balance-wave'
  | 'ember'
  | 'arrow'
  | 'stone'
  | 'electric'
  | 'mist';

export type SignAnimation = {
  color: string;
  glow: string;
  motionClass: string;
  particle?: ParticleType;
  description: string;
  elementAffinity: 'Fire' | 'Earth' | 'Air' | 'Water';
};

// ============================================================================
// Animation Registry
// ============================================================================

export const SIGN_ANIMATIONS: Record<string, SignAnimation> = {
  Aries: {
    color: '#ff4d3b',
    glow: '0 0 12px #ff4d3b',
    motionClass: 'anim-aries',
    particle: 'sparks',
    description: 'Flicker + pulse — initiating fire',
    elementAffinity: 'Fire'
  },
  Taurus: {
    color: '#8bc34a',
    glow: '0 0 12px #8bc34a',
    motionClass: 'anim-taurus',
    particle: 'dust',
    description: 'Slow grow — patient earth',
    elementAffinity: 'Earth'
  },
  Gemini: {
    color: '#00bcd4',
    glow: '0 0 12px #00bcd4',
    motionClass: 'anim-gemini',
    particle: 'air-swirl',
    description: 'Oscillation — mercurial air',
    elementAffinity: 'Air'
  },
  Cancer: {
    color: '#3f51b5',
    glow: '0 0 12px #3f51b5',
    motionClass: 'anim-cancer',
    particle: 'tide',
    description: 'Tide rise — lunar water',
    elementAffinity: 'Water'
  },
  Leo: {
    color: '#ff9800',
    glow: '0 0 12px #ff9800',
    motionClass: 'anim-leo',
    particle: 'solar-flare',
    description: 'Radiant pulse — solar fire',
    elementAffinity: 'Fire'
  },
  Virgo: {
    color: '#9e9e9e',
    glow: '0 0 12px #9e9e9e',
    motionClass: 'anim-virgo',
    particle: 'grain',
    description: 'Precision jitter — analytical earth',
    elementAffinity: 'Earth'
  },
  Libra: {
    color: '#e91e63',
    glow: '0 0 12px #e91e63',
    motionClass: 'anim-libra',
    particle: 'balance-wave',
    description: 'Gentle sway — harmonious air',
    elementAffinity: 'Air'
  },
  Scorpio: {
    color: '#673ab7',
    glow: '0 0 12px #673ab7',
    motionClass: 'anim-scorpio',
    particle: 'ember',
    description: 'Pulse + shadow — transformative water',
    elementAffinity: 'Water'
  },
  Sagittarius: {
    color: '#ff5722',
    glow: '0 0 12px #ff5722',
    motionClass: 'anim-sagittarius',
    particle: 'arrow',
    description: 'Arrow flick — expansive fire',
    elementAffinity: 'Fire'
  },
  Capricorn: {
    color: '#795548',
    glow: '0 0 12px #795548',
    motionClass: 'anim-capricorn',
    particle: 'stone',
    description: 'Stone settle — enduring earth',
    elementAffinity: 'Earth'
  },
  Aquarius: {
    color: '#03a9f4',
    glow: '0 0 12px #03a9f4',
    motionClass: 'anim-aquarius',
    particle: 'electric',
    description: 'Electric jitter — visionary air',
    elementAffinity: 'Air'
  },
  Pisces: {
    color: '#009688',
    glow: '0 0 12px #009688',
    motionClass: 'anim-pisces',
    particle: 'mist',
    description: 'Drifting float — dissolving water',
    elementAffinity: 'Water'
  }
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get animation config for a sign
 */
export function getSignAnimation(sign: string): SignAnimation {
  return SIGN_ANIMATIONS[sign] ?? SIGN_ANIMATIONS.Aries;
}

/**
 * Get all signs for a given element
 */
export function getSignsByElement(element: 'Fire' | 'Earth' | 'Air' | 'Water'): string[] {
  return Object.entries(SIGN_ANIMATIONS)
    .filter(([_, anim]) => anim.elementAffinity === element)
    .map(([sign]) => sign);
}

/**
 * Blend two sign animations for cusp transitions
 */
export function blendSignAnimations(
  fromSign: string,
  toSign: string,
  blend: number
): SignAnimation {
  const from = getSignAnimation(fromSign);
  const to = getSignAnimation(toSign);

  // Parse hex colors
  const parseHex = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  });

  const fromRgb = parseHex(from.color);
  const toRgb = parseHex(to.color);

  // Interpolate
  const lerp = (a: number, b: number) => Math.round(a * (1 - blend) + b * blend);
  const blendedRgb = {
    r: lerp(fromRgb.r, toRgb.r),
    g: lerp(fromRgb.g, toRgb.g),
    b: lerp(fromRgb.b, toRgb.b)
  };

  const blendedHex = `#${blendedRgb.r.toString(16).padStart(2, '0')}${blendedRgb.g.toString(16).padStart(2, '0')}${blendedRgb.b.toString(16).padStart(2, '0')}`;

  return {
    color: blendedHex,
    glow: `0 0 12px ${blendedHex}`,
    motionClass: blend < 0.5 ? from.motionClass : to.motionClass,
    particle: blend < 0.5 ? from.particle : to.particle,
    description: `${fromSign}→${toSign} cusp blend`,
    elementAffinity: blend < 0.5 ? from.elementAffinity : to.elementAffinity
  };
}

/**
 * Get inline style object for a sign animation
 */
export function getSignAnimationStyle(sign: string): React.CSSProperties {
  const anim = getSignAnimation(sign);
  return {
    color: anim.color,
    boxShadow: anim.glow
  };
}

export default SIGN_ANIMATIONS;
