/**
 * ============================================
 * INTEGRATION LAYERS INDEX
 * Bridges Between Technical and Narrative Systems
 * ============================================
 */

// Structure → Narrative
export {
  getStructureNarrative,
  mapFollowToNarrative,
  generateNarrativeSummary,
  STRUCTURE_NARRATIVES
} from './structureToNarrative';

export type {
  NarrativeTheme,
  StoryArc,
  DramaticTension,
  StructureNarrative
} from './structureToNarrative';

// Shen Sha → Mythos
export {
  convertToMythos,
  getStarMythos,
  getAllMythosArchetypes,
  STAR_MYTHOS
} from './shenShaToMythos';

export type {
  MythosArchetype,
  GuardianSpirit,
  AncestralBlessing,
  MythosProfile
} from './shenShaToMythos';

// Favorability → Ritual
export {
  generateRitualGuidance,
  getOptimalTiming,
  getElementRituals,
  ELEMENT_HOURS,
  ELEMENT_DAYS,
  ELEMENT_MONTHS,
  ELEMENT_RITUALS
} from './favorabilityToRitual';

export type {
  RitualTiming,
  ElementalRitual,
  EmpowermentPractice,
  RitualGuidance
} from './favorabilityToRitual';

// Seasonal → Hypergraph
export {
  generateSeasonalHypergraph,
  getVisualizationData,
  findStrongestConnections,
  getSeasonalEnergySummary,
  ELEMENT_PRODUCTION_CYCLE,
  ELEMENT_CONTROL_CYCLE,
  BRANCH_ELEMENT_MAP
} from './seasonalToHypergraph';

export type {
  HypergraphNode,
  HypergraphEdge,
  HyperEdge,
  TemporalFlow,
  SeasonalHypergraph
} from './seasonalToHypergraph';
