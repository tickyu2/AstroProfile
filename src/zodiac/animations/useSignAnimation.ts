/**
 * useSignAnimation Hook
 * React hook to apply sign-specific animations anywhere in the app
 * Supports pure signs, cusp blends, and element-based animations
 */

import { useMemo } from 'react';
import {
  SignAnimation,
  SIGN_ANIMATIONS,
  getSignAnimation,
  blendSignAnimations,
  getSignAnimationStyle
} from './signAnimations';

// ============================================================================
// Types
// ============================================================================

export interface UseSignAnimationOptions {
  /** Enable animation (default: true) */
  animate?: boolean;
  /** Custom blend value for cusps (0-1) */
  blend?: number;
  /** Second sign for cusp blending */
  toSign?: string;
}

export interface SignAnimationResult extends SignAnimation {
  /** CSS class to apply for animation */
  className: string;
  /** Inline style object */
  style: React.CSSProperties;
  /** Whether animation is active */
  isAnimated: boolean;
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * Get animation configuration for a zodiac sign
 *
 * @example
 * // Pure sign
 * const anim = useSignAnimation('Leo');
 * <div className={anim.className} style={anim.style}>{symbol}</div>
 *
 * @example
 * // Cusp blend
 * const anim = useSignAnimation('Leo', { toSign: 'Virgo', blend: 0.37 });
 */
export function useSignAnimation(
  sign: string,
  options: UseSignAnimationOptions = {}
): SignAnimationResult {
  const { animate = true, blend, toSign } = options;

  return useMemo(() => {
    // Cusp blend mode
    if (toSign && blend !== undefined) {
      const blended = blendSignAnimations(sign, toSign, blend);
      return {
        ...blended,
        className: animate ? blended.motionClass : '',
        style: {
          color: blended.color,
          boxShadow: animate ? blended.glow : 'none'
        },
        isAnimated: animate
      };
    }

    // Pure sign mode
    const anim = getSignAnimation(sign);
    return {
      ...anim,
      className: animate ? anim.motionClass : '',
      style: {
        color: anim.color,
        boxShadow: animate ? anim.glow : 'none'
      },
      isAnimated: animate
    };
  }, [sign, toSign, blend, animate]);
}

// ============================================================================
// Element Animation Hook
// ============================================================================

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';

const ELEMENT_CLASSES: Record<ElementType, string> = {
  Fire: 'anim-element-fire',
  Earth: 'anim-element-earth',
  Air: 'anim-element-air',
  Water: 'anim-element-water'
};

const ELEMENT_COLORS: Record<ElementType, string> = {
  Fire: '#ff4d3b',
  Earth: '#8bc34a',
  Air: '#00bcd4',
  Water: '#3f51b5'
};

/**
 * Get animation configuration for an element
 */
export function useElementAnimation(element: ElementType, animate = true) {
  return useMemo(() => ({
    className: animate ? ELEMENT_CLASSES[element] : '',
    color: ELEMENT_COLORS[element],
    style: {
      color: ELEMENT_COLORS[element]
    }
  }), [element, animate]);
}

// ============================================================================
// Cusp Transition Animation Hook
// ============================================================================

/**
 * Get animation for cusp transition visualization
 */
export function useCuspAnimation(
  fromSign: string,
  toSign: string,
  day: number,
  animate = true
) {
  // φ-curve values for days 1-6
  const PHI_CURVE = [0.13, 0.37, 0.58, 0.75, 0.89, 0.98];
  const blend = PHI_CURVE[Math.min(Math.max(day - 1, 0), 5)];

  return useMemo(() => {
    const blended = blendSignAnimations(fromSign, toSign, blend);
    const fromAnim = getSignAnimation(fromSign);
    const toAnim = getSignAnimation(toSign);

    return {
      ...blended,
      fromColor: fromAnim.color,
      toColor: toAnim.color,
      blendPercent: Math.round(blend * 100),
      className: animate ? `${blended.motionClass} anim-cusp-transition` : '',
      style: {
        background: `linear-gradient(135deg, ${fromAnim.color}40 0%, ${toAnim.color}40 100%)`,
        boxShadow: animate ? blended.glow : 'none'
      }
    };
  }, [fromSign, toSign, blend, animate]);
}

// ============================================================================
// Mastery Animation Hook
// ============================================================================

export type MasteryTier = 'beginner' | 'intermediate' | 'advanced' | 'master';

/**
 * Get mastery tier animation class
 */
export function useMasteryAnimation(tier: MasteryTier) {
  return useMemo(() => ({
    className: `mastery-${tier}`,
    tier,
    label: tier.charAt(0).toUpperCase() + tier.slice(1)
  }), [tier]);
}

// ============================================================================
// Re-exports
// ============================================================================

export { SIGN_ANIMATIONS, getSignAnimation, blendSignAnimations, getSignAnimationStyle };
export type { SignAnimation, ParticleType } from './signAnimations';

export default useSignAnimation;
