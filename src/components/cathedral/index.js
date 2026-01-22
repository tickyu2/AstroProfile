/**
 * Cathedral Components Index
 *
 * Export all cathedral-themed UI components for relationship outcomes,
 * pilgrim journey tracking, mythic narratives, time series, and debugging.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// RELATIONSHIP OUTCOME CARD
// ========================================

export {
  default as RelationshipOutcomeCard,
  RelationshipOutcomeCompact,
  OutcomeIndicator,
  VoiceSelector,
  ToneSelector,
  OUTCOME_NARRATIVES
} from './RelationshipOutcomeCard';

// ========================================
// PILGRIM JOURNEY TRACKER
// ========================================

export {
  default as PilgrimJourneyTracker,
  PilgrimJourneyMini,
  ChamberInfo,
  JOURNEY_STEPS,
  OUTCOME_TO_STEP_ID,
  CHAMBER_METADATA
} from './PilgrimJourneyTracker';

// ========================================
// DEVTOOLS OVERLAY
// ========================================

export {
  default as RelationshipDevToolsOverlay,
  DevToolsCompact,
  DevToolsStyles
} from './RelationshipDevTools';

// ========================================
// OUTCOME TIMELINE
// ========================================

export {
  default as OutcomeTimeline,
  TimelineStyles
} from './OutcomeTimeline';

// ========================================
// COMPARE TIMELINES
// ========================================

export {
  default as CompareTimelines,
  CompareStyles
} from './CompareTimelines';

// ========================================
// STORY DIFF VIEW
// ========================================

export {
  default as StoryDiffView,
  StoryDiffStyles
} from './StoryDiffView';

// ========================================
// REVERSE MAPPING
// ========================================

export {
  default as ReverseMapping,
  ReverseMappingStyles
} from './ReverseMapping';

// ========================================
// RULE TUNER
// ========================================

export {
  default as RuleTuner,
  RuleTunerStyles
} from './RuleTuner';

// ========================================
// GENERATIONAL CONSTELLATION
// ========================================

export { default as GenerationalConstellation } from './GenerationalConstellation';

// ========================================
// ANCESTRAL HEALING RITUAL
// ========================================

export { default as AncestralHealingRitual } from './AncestralHealingRitual';

// ========================================
// GENERATIONAL STORY DASHBOARD
// ========================================

export { default as GenerationalStoryDashboard } from './GenerationalStoryDashboard';

// ========================================
// PILGRIM INITIATION CEREMONY
// ========================================

export { default as PilgrimInitiationCeremony } from './PilgrimInitiationCeremony';

// ========================================
// ANCESTRAL CHAMBER (Unified Container)
// ========================================

export {
  default as AncestralChamber,
  AncestralPilgrimMap,
  ChamberComplete,
  PERSONA_VOICES,
  getPersonaVoice
} from './AncestralChamber';

// ========================================
// PILGRIM JOURNEY ROUTER
// ========================================

export {
  default as PilgrimJourneyRouter,
  PilgrimJourneyMap,
  PathSelector,
  ProgressBar,
  PlaceholderChamber
} from './PilgrimJourneyRouter';

// ========================================
// PILGRIM ROUTES CONFIGURATION
// ========================================

export {
  PILGRIM_ROUTES,
  PILGRIM_PATHS,
  PILGRIM_JOURNEY_MAP,
  getRoutesForPath,
  getNextRoute,
  getPreviousRoute,
  isRouteAccessible,
  getRouteById,
  getPathProgress,
  getJourneyMapForPath
} from './pilgrimRoutes';

// ========================================
// JOURNEY STATE PERSISTENCE
// ========================================

export {
  loadJourneyState,
  saveJourneyState,
  loadLocalJourneyState,
  saveLocalJourneyState,
  clearLocalJourneyState,
  fetchJourneyState,
  persistJourneyState,
  updateCurrentRoute,
  markRouteCompleted,
  updateChamberData,
  changePath,
  updatePersonaRole,
  resetJourney,
  DEFAULT_JOURNEY_STATE
} from './journeyState';

// ========================================
// MODE SYSTEM
// ========================================

export {
  CATHEDRAL_MODES,
  MODE_MATRIX,
  MODE_PERSONA_BUNDLES,
  getModeEffects,
  getModePersonaVoice,
  loadSavedMode,
  saveMode,
  clearSavedMode,
  ModeProvider,
  ModeContext,
  useMode,
  useModeEffects,
  useModeFeature
} from './modeSystem';

// ========================================
// MODE SWITCHER
// ========================================

export {
  default as ModeSwitcher,
  ModeButton,
  ModeInfoPanel,
  CompactModeSelector
} from './ModeSwitcher';

// ========================================
// RE-EXPORT HOOKS
// ========================================

export {
  useSceneActivation,
  useMultiSceneActivation,
  useSceneSequence,
  getSceneConfig,
  getAllSceneConfigs,
  outcomeToSceneId,
  getOutcomeSceneMappings
} from '../../hooks/useSceneActivation';

// ========================================
// MODE SOUNDSCAPES
// ========================================

export {
  MODE_SOUNDSCAPES,
  getSoundscape,
  getTransitionSound,
  getInteractionSound,
  noteToFrequency,
  notesToFrequencies,
  SOUNDSCAPE_HOOK_CONFIG,
  AMBIENT_PATTERNS
} from './modeSoundscapes';

// ========================================
// MODE RITUAL SCRIPTS
// ========================================

export {
  PILGRIM_RITUALS,
  SCHOLAR_RITUALS,
  ARCHITECT_RITUALS,
  SOVEREIGN_RITUALS,
  getRitualScripts,
  getRitual,
  getRitualStep,
  calculateRitualDuration
} from './modeRitualScripts';

// ========================================
// MODE CHART THEMES
// ========================================

export {
  MODE_CHART_THEMES,
  PALETTES,
  ELEMENT_COLORS,
  PLANET_STYLES,
  ASPECT_STYLES,
  HOUSE_STYLES,
  CHART_LAYOUTS,
  getChartTheme,
  getThemePalette,
  getElementColor,
  getAspectStyle,
  getPlanetStyle,
  getHouseStyle,
  getChartLayout,
  generateThemeCSSVariables
} from './modeChartThemes';

// ========================================
// MODE ONBOARDING
// ========================================

export {
  default as ModeOnboarding,
  ONBOARDING_SEQUENCES,
  CODEX_CHAPTER_INTROS,
  OnboardingStep,
  ProgressDots,
  getOnboardingSequence,
  getCodexChapterIntro,
  hasCompletedOnboarding,
  markOnboardingComplete
} from './ModeOnboarding';

// ========================================
// MODE-AWARE TIMELINE
// ========================================

export {
  default as ModeAwareTimeline,
  TIMELINE_CONFIGS,
  TimelineMarker,
  TimelineLine,
  TimelineEvent,
  transformTimelineData,
  getTimelineConfig,
  createSampleTimelineEvents
} from './ModeAwareTimeline';

// ========================================
// MODE TIMELINE SCRUB CUES
// ========================================

export {
  MODE_SCRUB_CUES,
  SCRUB_INTERACTIONS,
  SCRUB_PATTERNS,
  getScrubCue,
  getScrubSound,
  getBoundarySound,
  getEventSound,
  getMeaningText,
  detectScrubPattern,
  getScrubInteractionConfig,
  generateScrubAudioParams
} from './modeTimelineScrubCues';

// ========================================
// MODE MICRO-INTERACTIONS
// ========================================

export {
  MODE_MICRO_INTERACTIONS,
  INTERACTION_TYPES,
  ELEMENT_TYPES,
  getMicroInteraction,
  getHoverEffect,
  getClickEffect,
  getScrollBehavior,
  getFocusStyle,
  getDragBehavior,
  generateMicroInteractionCSS,
  applyMicroInteraction
} from './modeMicroInteractions';

// ========================================
// MODE CODEX CHAPTER
// ========================================

export {
  default as ModeCodexChapter,
  CODEX_CHAPTER,
  CodexSection,
  ModeSubsection,
  TableOfContents
} from './ModeCodexChapter';

// ========================================
// MODE-AWARE PILGRIM MAP
// ========================================

export {
  default as ModeAwarePilgrimMap,
  MAP_CONFIGS,
  JOURNEY_STEPS as PILGRIM_MAP_JOURNEY_STEPS
} from './ModeAwarePilgrimMap';

// ========================================
// MODE-AWARE DEVTOOLS
// ========================================

export {
  default as ModeAwareDevTools,
  DEVTOOLS_CONFIGS
} from './ModeAwareDevTools';

// ========================================
// MODE-AWARE CONSTELLATION MAP
// ========================================

export {
  default as ModeAwareConstellationMap,
  CONSTELLATION_CONFIGS
} from './ModeAwareConstellationMap';

// ========================================
// MODE-AWARE RITUAL ENGINE
// ========================================

export {
  default as ModeAwareRitualEngine,
  RITUAL_CONFIGS
} from './ModeAwareRitualEngine';

// ========================================
// MODE CHAMBER SOUNDSCAPES
// ========================================

export {
  CHAMBERS,
  MODE_CHAMBER_SOUNDSCAPES,
  getSoundscape as getChamberSoundscape,
  getChamberTransition,
  getSoundscapeLayers,
  getAmbientLayers,
  getMelodicLayers,
  getDroneLayers,
  calculateTotalVolume,
  getSoundscapeDescription,
  PLAYER_CONFIG,
  getModeVolumeScale
} from './modeChamberSoundscapes';

// ========================================
// MODE-AWARE CODEX LENS
// ========================================

export {
  default as ModeAwareCodexLens,
  CodexBrowser,
  CODEX_LENS_CONFIGS,
  SAMPLE_CODEX_ENTRIES,
  PilgrimLens,
  ScholarLens,
  ArchitectLens,
  SovereignLens
} from './ModeAwareCodexLens';

// ========================================
// CSS IMPORTS (for reference)
// ========================================

// Import these CSS files in your app:
// - './modeAnimations.css' - Mode transition animations
// - './modeAura.css' - Mode-specific aura/glow effects
// - './modeChamberTransitions.css' - Chamber enter/exit transitions
