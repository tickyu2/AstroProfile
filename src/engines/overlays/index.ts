/**
 * Overlay Engines
 *
 * Composable overlay modules that contribute to relationship
 * decisions with deltas, narratives, and DevTools breakdowns.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// MAIN INTEGRATION ENGINE
// ========================================

export {
  computeAllOverlays,
  computeRelationshipOverlays,
  getOverlaySummary,
  getOverlayByName,
  applyOverlayWeights
} from './overlayIntegration';

export type {
  FullChartData,
  IndividualOverlayResults,
  CompositeOverlayResults,
  OverlayIntegrationResult,
  RelationshipOverlayIntegrationResult,
  DevToolsOverlayBreakdown,
  DevToolsRelationshipBreakdown,
  PersonaVoiceCollection,
  ChamberNarrativeCollection,
  RelationshipPersonaVoices
} from './overlayIntegration';

// ========================================
// LEADERSHIP OVERLAY
// ========================================

export {
  computeLeadershipOverlay,
  getLeadershipPersonaVoice,
  getLeadershipChamberNarrative,
  LeadershipPersonaVoices,
  SolarGateOfSovereignty
} from './leadershipOverlay';

export type {
  ChartDataForLeadership,
  LeadershipOverlayResult,
  LeadershipStyle,
  LeadershipChamber
} from './leadershipOverlay';

// ========================================
// ARCHETYPE OVERLAY
// ========================================

export {
  computeArchetypeOverlay,
  calculateArchetypeCompatibility,
  getArchetypePersonaVoice,
  getArchetypeChamberNarrative,
  ArchetypePersonaVoices,
  ArchetypeChambers,
  ARCHETYPES
} from './archetypeOverlay';

export type {
  ChartDataForArchetype,
  ArchetypeOverlayResult,
  Archetype,
  ArchetypeScore,
  ArchetypeCompatibility,
  ArchetypeChamber
} from './archetypeOverlay';

// ========================================
// ELEMENTAL OVERLAY
// ========================================

export {
  computeElementalOverlay,
  calculateElementalCompatibility,
  getElementalPersonaVoice,
  getElementalChamberNarrative,
  ElementalPersonaVoices,
  ElementalChambers
} from './elementalOverlay';

export type {
  ChartDataForElemental,
  ElementalOverlayResult,
  Element,
  ElementalBalance,
  ElementalCompatibility,
  ElementalChamber
} from './elementalOverlay';

// ========================================
// HOUSE OVERLAY
// ========================================

export {
  computeHouseOverlay,
  calculateHouseCompatibility,
  getHousePersonaVoice,
  getHouseChamberNarrative,
  HousePersonaVoices,
  HouseChambers,
  HOUSE_THEMES,
  ANGULAR_HOUSES,
  SUCCEDENT_HOUSES,
  CADENT_HOUSES
} from './houseOverlay';

export type {
  ChartDataForHouse,
  HouseOverlayResult,
  HouseMode,
  LifeEmphasis,
  HouseHighlight,
  HouseChamber
} from './houseOverlay';

// ========================================
// COMPOSITE LEADERSHIP OVERLAY
// ========================================

export {
  computeCompositeLeadership,
  getCompositePersonaVoice,
  getCompositeChamberNarrative,
  CompositePersonaVoices,
  CompositeChambers
} from './compositeLeadershipOverlay';

export type {
  CompositeLeadershipResult,
  PowerBalance,
  RelationshipDynamic,
  DomainLeadership,
  CompositeChamber
} from './compositeLeadershipOverlay';

// ========================================
// SHEN SHA OVERLAY (神煞)
// ========================================

export {
  computeShenShaOverlay,
  calculateShenShaCompatibility,
  getShenShaPersonaVoice,
  getShenShaChamberNarrative,
  SHEN_SHA_DEFINITIONS
} from './shenShaOverlay';

export type {
  ShenShaOverlayResult,
  ShenShaCompatibility,
  ShenShaDefinition
} from './shenShaOverlay';

// ========================================
// USEFUL GOD OVERLAY (用神)
// ========================================

export {
  computeUsefulGodOverlay,
  calculateUsefulGodCompatibility,
  getUsefulGodPersonaVoice,
  getUsefulGodChamberNarrative
} from './usefulGodOverlay';

export type {
  UsefulGodOverlayResult,
  UsefulGodCompatibility
} from './usefulGodOverlay';

// ========================================
// COMPOSITE ELEMENTAL OVERLAY
// ========================================

export {
  computeCompositeElementalOverlay,
  getCompositeElementalPersonaVoice,
  getCompositeElementalChamberNarrative
} from './compositeElementalOverlay';

export type {
  CompositeElementalResult,
  RelationshipTemperament
} from './compositeElementalOverlay';

// ========================================
// TEAM LEADERSHIP OVERLAY
// ========================================

export {
  computeTeamLeadershipOverlay,
  getTeamLeadershipPersonaVoice,
  getTeamLeadershipChamberNarrative
} from './teamLeadershipOverlay';

export type {
  TeamLeadershipResult,
  TeamPolarity,
  DecisionStyle
} from './teamLeadershipOverlay';

// ========================================
// GENERATIONAL OVERLAY
// ========================================

export {
  computeGenerationalOverlay,
  calculateGenerationalCompatibility,
  getGenerationalPersonaVoice,
  getGenerationalChamberNarrative,
  PLUTO_GENERATIONS,
  NEPTUNE_GENERATIONS,
  URANUS_GENERATIONS
} from './generationalOverlay';

export type {
  GenerationalOverlayResult,
  GenerationalCompatibility,
  GenerationArchetype
} from './generationalOverlay';

// ========================================
// COMPOSITE USEFUL GOD OVERLAY
// ========================================

export {
  computeCompositeUsefulGodOverlay,
  getCompositeUsefulGodPersonaVoice,
  getCompositeUsefulGodChamberNarrative
} from './compositeUsefulGodOverlay';

export type {
  CompositeUsefulGodResult,
  MutualSupportType
} from './compositeUsefulGodOverlay';

// ========================================
// DESTINY TRAJECTORY OVERLAY
// ========================================

export {
  computeDestinyTrajectoryOverlay,
  calculateTrajectoryCompatibility,
  getDestinyTrajectoryPersonaVoice,
  getDestinyTrajectoryChamberNarrative
} from './destinyTrajectoryOverlay';

export type {
  DestinyTrajectoryResult,
  Trajectory,
  Momentum,
  CyclePhase
} from './destinyTrajectoryOverlay';

// ========================================
// EVENT TRIGGER OVERLAY
// ========================================

export {
  computeEventTriggerOverlay,
  calculateEventTriggerCompatibility,
  getEventTriggerPersonaVoice,
  getEventTriggerChamberNarrative
} from './eventTriggerOverlay';

export type {
  EventTriggerResult,
  EventWindow,
  TriggerType
} from './eventTriggerOverlay';

// ========================================
// MICRO-TIMING OVERLAY
// ========================================

export {
  computeMicroTimingOverlay,
  getMicroTimingPersonaVoice,
  getMicroTimingChamberNarrative,
  getCurrentPlanetaryHour
} from './microTimingOverlay';

export type {
  MicroTimingResult,
  MicroWindow,
  PlanetaryHour
} from './microTimingOverlay';

// ========================================
// ANCESTRAL PERSONA OVERLAY
// ========================================

export {
  computeAncestralPersonaOverlay,
  calculateAncestralCompatibility,
  getAncestralPersonaVoice,
  getAncestralChamberNarrative,
  LINEAGE_ARCHETYPES
} from './ancestralPersonaOverlay';

export type {
  AncestralPersonaResult,
  AncestralCompatibility,
  LineageArchetype,
  InheritedPattern,
  EmotionalInheritance
} from './ancestralPersonaOverlay';
