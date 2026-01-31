/**
 * Zodiac Animation System
 * Central exports for sign-specific motion grammars
 */

// Core animation registry
export {
  SIGN_ANIMATIONS,
  getSignAnimation,
  getSignsByElement,
  blendSignAnimations,
  getSignAnimationStyle
} from './signAnimations';

// React hooks
export {
  useSignAnimation,
  useElementAnimation,
  useCuspAnimation,
  useMasteryAnimation
} from './useSignAnimation';

// Types
export type {
  SignAnimation,
  ParticleType
} from './signAnimations';

export type {
  UseSignAnimationOptions,
  SignAnimationResult,
  ElementType,
  MasteryTier
} from './useSignAnimation';

// Import CSS in consuming components:
// import './zodiac/animations/signAnimations.css';
