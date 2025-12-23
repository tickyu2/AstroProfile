/**
 * Voice Components Export
 *
 * Luna Voice Integration with ElevenLabs TTS
 */

// Original components
export { default as VoiceChat } from './VoiceChat';
export { default as LunaVisualizer } from './LunaVisualizer';

// New: Soul Visualizer - Audio-reactive constitutional visualization
export { default as SoulVisualizer, SoulVisualizerMini, ELEMENTAL_PALETTES, TONE_COLOR_SHIFTS, LUNA_VOICE_COLORS } from './SoulVisualizer';

// New: Waveform - Real-time audio visualization
export { default as Waveform, WaveformMini } from './Waveform';

// New: Voice Control Panel - Complete voice controls with visualizer
export { default as VoiceControlPanel, MessageSpeakButton, stripToneMarkers, extractFirstTone } from './VoiceControlPanel';

// Voice Customization
export { default as VoiceCustomization } from './VoiceCustomization';

// Turn-Taking State Machine
export { default as TalkPanel } from './TalkPanel';
export {
  STATES,
  TIMING,
  CUE_TYPES,
  BACKCHANNELS,
  ENCOURAGERS,
  CONTINUATIONS,
  STATE_DESCRIPTIONS,
  getRandomCue
} from './talkStates';

// Emotion-Aware Timing (Human-Likeness)
export {
  EmotionTimingModifiers,
  BASE_TIMING,
  getEffectiveThresholds,
  getTimingDescription
} from './emotionTimingMap';

// Emotion-Aware Cues (Human-Likeness)
export {
  EmotionCueMap,
  BASE_CUE_PROBABILITY,
  EmotionProbabilityBoost,
  getRandomCue as getEmotionRandomCue,
  getCueProbability,
  shouldGenerateCue,
  getCueTypeForZone,
  maybeGenerateCue
} from './emotionCueMap';

// Emotion Smoother (Jitter Reduction)
export {
  EmotionSmoother,
  createSmoother,
  getGlobalSmoother
} from './emotionSmoother';

// Luna Behavior Map (Unified Profiles)
export {
  LunaBehaviorMap,
  StyleDescriptions,
  getStyleDescription,
  getBehavior
} from './lunaBehaviorMap';

// Luna Behavior Engine (Confidence-Scaled)
export {
  LunaBehaviorEngine,
  getBehaviorForEmotion,
  getLunaBehaviorEngine,
  useLunaBehavior
} from './lunaBehaviorEngine';

// Behavior Debug Overlay (Development Tool)
export {
  BehaviorDebugOverlay,
  BehaviorDebugMini
} from './BehaviorDebugOverlay';

// Luna Lab Panel (Live Behavior Tuning)
export { LunaLabPanel } from './LunaLabPanel';
