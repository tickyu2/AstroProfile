/**
 * Identity Architecture — barrel export
 *
 * Usage:
 *   import IdentityArchitecturePanel from './identity-architecture';
 *   import { buildIdentityArchitecture, D3CathedralRing } from './identity-architecture';
 */

// Default export: the top-level panel
export { default } from './components/IdentityArchitecturePanel';
export { default as IdentityArchitecturePanel } from './components/IdentityArchitecturePanel';

// Engine
export { buildIdentityArchitecture } from './engine';
export type {
  Element,
  PillarRole,
  BaZiPillar,
  HeavenPersonality,
  EarthPersonality,
  HumanPersonality,
  IdentityTension,
  TensionItem,
  IdentityArchitecture,
} from './engine';

// Diagrams (available for standalone use)
export { CathedralRing } from './components/diagrams';
export { ThreeRingCathedral } from './components/diagrams';
export { D3CathedralRing } from './components/diagrams';
export { CoherenceTriangle } from './components/diagrams';
export { D3TensionField } from './components/diagrams';
export { DestinyPulse } from './components/diagrams';
export { DestinyECG } from './components/diagrams';
export { TempleMode } from './components/diagrams';

// Engine: tension vectors + destiny pulse + ritual
export { computeTensionVectors } from './engine';
export type { TensionVector } from './engine';
export { getDayMasterElement, destinyBeatFromElement } from './engine';
export { getCurrentSeason, modulationFromSeason } from './engine';
export { windVectorForSeason } from './engine';
export { templeSoundLayers } from './engine';
export { detectGesture } from './engine';
export { ritualScript } from './engine';

// Diagrams: ritual components
export { PillarOrbit } from './components/diagrams';
export { ElementParticles } from './components/diagrams';
export { RitualScriptOverlay } from './components/diagrams';
export { RitualGestureLayer } from './components/diagrams';
export { ElementSigil } from './components/diagrams';
export { ElementFlare } from './components/diagrams';
export { ElementGateway } from './components/diagrams';
export { TempleHUD } from './components/diagrams';

// Hooks
export { useHeartbeatAudio } from './hooks';
export { usePulseResonance } from './hooks';
export { useTempleSoundscape } from './hooks';
export { useRitualGesture } from './hooks';
export { useDepthParallax } from './hooks';

// Codex
export { IdentityCodexPage } from './components/codex';

// Storybook
export { IdentityStorybook } from './components/storybook';
export { CHAPTERS } from './components/storybook';

// Utils
export { ELEMENT_COLORS, ELEMENT_GRADIENTS, ELEMENT_ICONS, PILLAR_ROLE_LABELS } from './utils';
