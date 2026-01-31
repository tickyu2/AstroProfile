/**
 * Retrograde Behavioral Matrix (RBM) Engine
 *
 * Universal engine for analyzing retrograde planetary influences
 * on any user's chart - decision-making, synastry, and personality.
 *
 * Usage:
 * ```typescript
 * import {
 *   analyzeRetrogrades,
 *   computeInternalAuthorityProfile,
 *   computeRetrogradeSynastryScore,
 *   computeRelationshipDynamics,
 *   generateNarratives
 * } from '@/engines/retrograde';
 *
 * // Full analysis
 * const analysis = analyzeRetrogrades(chartPlanets);
 *
 * // Specific calculations
 * const iap = computeInternalAuthorityProfile(planets);
 * const synastry = computeRetrogradeSynastryScore(person1Planets, person2Planets);
 * const dynamics = computeRelationshipDynamics(planets);
 * const narratives = generateNarratives(planets);
 * ```
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPE EXPORTS
// ========================================

export type {
  Planet,
  PlanetState,
  ExtendedPlanetState,
  MotionState,
  DecisionContext,
  DecisionTopic,
  RetrogradeProfile,
  InternalizationAxis,
  DecisionAxis,
  SynastryAxis,
  SynastryResult,
  SynastryDynamic,
  InternalAuthorityProfile,
  PlanetContribution,
  AuthorityTier,
  RelationshipDynamicsProfile,
  AutonomyProfile,
  CommunicationProfile,
  EmotionalProfile,
  ConflictProfile,
  BondingProfile,
  ProjectionProfile,
  SexualProfile,
  CommitmentProfile,
  ChartInput,
  RetrogradeAnalysis,
  InteractionPattern,
  NarrativeTemplates
} from './types';

export { ALL_PLANETS, PLANET_SYMBOLS } from './types';

// ========================================
// MATRIX EXPORTS
// ========================================

export {
  RetrogradeMatrix,
  getRetrogradeProfile,
  getAllProfiles
} from './matrix';

// ========================================
// CALCULATOR EXPORTS
// ========================================

export {
  computeInternalAuthorityProfile,
  applyRetrogradeDecisionModifier,
  analyzeDecision,
  computeRetrogradeSynastryScore,
  quickRetrogradeAnalysis
} from './calculators';

// ========================================
// RELATIONSHIP DYNAMICS EXPORTS
// ========================================

export {
  computeRelationshipDynamics,
  analyzeRelationshipCompatibility
} from './relationshipDynamics';

// ========================================
// NARRATIVE EXPORTS
// ========================================

export {
  generateNarratives,
  generateInteractionPatterns,
  generateSystemPromptSection,
  getSinglePlanetNarrative
} from './narratives';

// ========================================
// RELATIONSHIP OUTCOME EXPORTS
// ========================================

export type {
  RelationshipOutcome,
  NarrativeTone,
  BaseRelationshipInputs,
  RelationshipDecisionContext,
  ToneNarratives,
  OutcomeNarrative,
  UIRelationshipNarrative,
  RelationshipAnalysisResult
} from './relationshipOutcome';

export {
  mapScoreToRelationshipOutcome,
  getOutcomeThresholds,
  computeBaseRelationshipScore,
  computeRelationshipDecisionScore,
  RelationshipOutcomeNarratives,
  getRelationshipOutcome,
  getRelationshipNarrative,
  getNarrativeInTone,
  getNarrativeVoice,
  getPilgrimJourneyStep,
  quickRelationshipCheck,
  getAllOutcomeOptions,
  getOutcomeColor,
  getOutcomeGradient
} from './relationshipOutcome';

// ========================================
// PERSONA VOICE EXPORTS
// ========================================

export type {
  PersonaRole,
  UserVoiceProfile,
  PersonaVoices,
  OutcomeAnimationCue,
  PersonaBundle,
  PersonaRoleMetadata
} from './personaVoices';

export {
  RelationshipPersonaVoices,
  RelationshipOutcomeAnimations,
  selectTone,
  selectPersonaRole,
  buildPersonaBundle,
  getPersonaVoice,
  getAnimationCue,
  getAllPersonaVoices,
  PersonaRoleMetadataMap,
  getPersonaRoleMetadata
} from './personaVoices';

// ========================================
// PILGRIM JOURNEY EXPORTS
// ========================================

export type {
  PilgrimStep,
  PilgrimJourneyState,
  JourneyProgress,
  CathedralChamber
} from './pilgrimJourney';

export {
  PilgrimJourneySteps,
  OutcomeToStepId,
  StepIdToOutcome,
  CathedralChambers,
  getPilgrimStep,
  getPilgrimStepByOutcome,
  getStepIndex,
  calculateProgress,
  createJourneyState,
  updateJourneyState,
  getJourneyNarrative,
  getMythicLocation,
  getChamberMetadata
} from './pilgrimJourney';

// ========================================
// TIME SERIES EXPORTS
// ========================================

export type {
  DecisionBreakdown,
  DatedOutcome,
  DatedOutcomeWithBreakdown,
  OutcomeTimeSeries,
  ZoomLevel,
  GroupedTimePoint,
  ComparisonSeries
} from './timeSeries';

export {
  computeRelationshipDecisionWithBreakdown,
  buildOutcomeTimeSeries,
  generateDateRange,
  groupByZoom,
  computeRetrogradeIntensity,
  getHeatmapColor,
  createComparisonSeries,
  getWeekNumber,
  formatDateLabel,
  formatGroupLabel
} from './timeSeries';

// ========================================
// STORY ENGINE EXPORTS
// ========================================

export type {
  StoryBeat,
  NarrativeCockpit,
  Rule,
  NarrativeDiff,
  RuleContribution
} from './storyEngine';

export {
  DEFAULT_RULES,
  buildNarrativeCockpit,
  diffNarrative,
  getRulesForBeat,
  getRuleContributions,
  explainOutcome,
  applyRuleWeights
} from './storyEngine';

// ========================================
// MAIN ANALYSIS FUNCTION
// ========================================

import type {
  PlanetState,
  RetrogradeAnalysis,
  Planet
} from './types';
import { RetrogradeMatrix, getRetrogradeProfile } from './matrix';
import { computeInternalAuthorityProfile } from './calculators';
import { computeRelationshipDynamics } from './relationshipDynamics';
import { generateNarratives, generateInteractionPatterns } from './narratives';

/**
 * Complete retrograde analysis for a chart
 *
 * @param planets - Array of planet states from the chart
 * @param ascendant - Optional ascendant data for interaction patterns
 * @param sunUranusConjunct - Optional flag if Sun-Uranus conjunction exists
 * @returns Full RetrogradeAnalysis object
 */
export function analyzeRetrogrades(
  planets: PlanetState[],
  ascendant?: { sign: string; degree: number },
  sunUranusConjunct?: boolean
): RetrogradeAnalysis {
  const retrogradePlanets = planets.filter(p => p.isRetrograde);
  const retrogradeCount = retrogradePlanets.length;

  // Compute all analysis components
  const iap = computeInternalAuthorityProfile(planets);
  const dynamics = computeRelationshipDynamics(planets);
  const narratives = generateNarratives(planets);
  const interactions = generateInteractionPatterns(planets, ascendant, sunUranusConjunct);

  // Build profiles map
  const profiles = new Map<Planet, typeof RetrogradeMatrix[Planet]>();
  for (const p of retrogradePlanets) {
    profiles.set(p.planet, getRetrogradeProfile(p.planet));
  }

  return {
    retrogradePlanets,
    retrogradeCount,
    iap,
    dynamics,
    profiles,
    interactions,
    narratives
  };
}

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Check if a planet is retrograde in the given states
 */
export function isRetrograde(planets: PlanetState[], planet: Planet): boolean {
  const found = planets.find(p => p.planet === planet);
  return found?.isRetrograde ?? false;
}

/**
 * Count retrograde planets in chart
 */
export function countRetrogrades(planets: PlanetState[]): number {
  return planets.filter(p => p.isRetrograde).length;
}

/**
 * Get retrograde planets from chart
 */
export function getRetrogradePlanets(planets: PlanetState[]): PlanetState[] {
  return planets.filter(p => p.isRetrograde);
}

/**
 * Create a PlanetState from basic data
 */
export function createPlanetState(
  planet: Planet,
  sign: string,
  degree: number,
  house: number,
  isRetrograde: boolean,
  strength?: number
): PlanetState {
  return {
    planet,
    sign,
    degree,
    house,
    isRetrograde,
    strength
  };
}

/**
 * Create PlanetState array from sovereign chart data
 * (Helper for integration with existing chart service)
 */
export function fromSovereignChart(sovereignData: any): PlanetState[] {
  if (!sovereignData?.planets) return [];

  const planetMap: Record<string, Planet> = {
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto'
  };

  const states: PlanetState[] = [];

  for (const [key, planet] of Object.entries(sovereignData.planets)) {
    const planetName = planetMap[key];
    if (!planetName) continue;

    const p = planet as any;
    states.push({
      planet: planetName,
      sign: p.sign || '',
      degree: p.degree || 0,
      house: p.house || 0,
      isRetrograde: p.isRetrograde === true
    });
  }

  return states;
}
