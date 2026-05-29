/**
 * Engine barrel — re-exports the public API
 */

export { buildIdentityArchitecture } from './identityEngine';
export { computeAlignmentScore } from './alignmentScoring';
export { computeCoherenceIndex } from './coherenceIndex';
export { computeTension, computeTensionSeverity } from './tensionEngine';
export { buildNarrative } from './contradictionNarrative';
export { isSame, isHarmonious, isControlling, SHENG_PRODUCES, KE_CONTROLS } from './elementLogic';
export { describeHeaven, describeEarth, describeHuman } from './personalityExtractors';
export { computeTensionVectors } from './tensionVectors';
export type { TensionVector } from './tensionVectors';
export {
  getDayMasterElement, destinyBeatFromElement,
  destinyAmplitudeFromSeverity, hueFromElement,
  stormIndex, pillarAngle,
} from './destinyPulse';
export { getCurrentSeason, modulationFromSeason, fogColorForSeason } from './seasonalModulation';
export type { SeasonalModulation } from './seasonalModulation';
export { windVectorForSeason } from './seasonalWind';
export type { WindVector } from './seasonalWind';
export { templeSoundLayers } from './templeSoundscape';
export type { SoundLayerConfig } from './templeSoundscape';
export { detectGesture } from './ritualGestures';
export type { GestureType } from './ritualGestures';
export { ritualScript } from './ritualScript';

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
} from './identityTypes';
