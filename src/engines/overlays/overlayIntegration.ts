/**
 * Overlay Integration Engine
 *
 * Composes all overlays into a unified system that contributes to
 * relationship decisions. Each overlay adds its delta, narrative,
 * and DevTools breakdown to the final result.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import {
  computeLeadershipOverlay,
  LeadershipOverlayResult,
  ChartDataForLeadership,
  getLeadershipPersonaVoice,
  getLeadershipChamberNarrative
} from './leadershipOverlay';

import {
  computeArchetypeOverlay,
  ArchetypeOverlayResult,
  ChartDataForArchetype,
  calculateArchetypeCompatibility,
  getArchetypePersonaVoice,
  getArchetypeChamberNarrative
} from './archetypeOverlay';

import {
  computeElementalOverlay,
  ElementalOverlayResult,
  ChartDataForElemental,
  calculateElementalCompatibility,
  getElementalPersonaVoice,
  getElementalChamberNarrative
} from './elementalOverlay';

import {
  computeHouseOverlay,
  HouseOverlayResult,
  ChartDataForHouse,
  calculateHouseCompatibility,
  getHousePersonaVoice,
  getHouseChamberNarrative
} from './houseOverlay';

import {
  computeCompositeLeadership,
  CompositeLeadershipResult,
  getCompositePersonaVoice,
  getCompositeChamberNarrative
} from './compositeLeadershipOverlay';

import {
  computeShenShaOverlay,
  ShenShaOverlayResult,
  calculateShenShaCompatibility,
  getShenShaPersonaVoice
} from './shenShaOverlay';

import {
  computeUsefulGodOverlay,
  UsefulGodOverlayResult,
  calculateUsefulGodCompatibility,
  getUsefulGodPersonaVoice
} from './usefulGodOverlay';

import {
  computeCompositeElementalOverlay,
  CompositeElementalResult,
  getCompositeElementalPersonaVoice
} from './compositeElementalOverlay';

import {
  computeTeamLeadershipOverlay,
  TeamLeadershipResult,
  getTeamLeadershipPersonaVoice
} from './teamLeadershipOverlay';

import {
  computeGenerationalOverlay,
  GenerationalOverlayResult,
  calculateGenerationalCompatibility,
  getGenerationalPersonaVoice
} from './generationalOverlay';

import {
  computeCompositeUsefulGodOverlay,
  CompositeUsefulGodResult,
  getCompositeUsefulGodPersonaVoice
} from './compositeUsefulGodOverlay';

import {
  computeDestinyTrajectoryOverlay,
  DestinyTrajectoryResult,
  calculateTrajectoryCompatibility,
  getDestinyTrajectoryPersonaVoice
} from './destinyTrajectoryOverlay';

import {
  computeEventTriggerOverlay,
  EventTriggerResult,
  calculateEventTriggerCompatibility,
  getEventTriggerPersonaVoice
} from './eventTriggerOverlay';

import {
  computeMicroTimingOverlay,
  MicroTimingResult,
  getMicroTimingPersonaVoice
} from './microTimingOverlay';

import {
  computeAncestralPersonaOverlay,
  AncestralPersonaResult,
  calculateAncestralCompatibility,
  getAncestralPersonaVoice
} from './ancestralPersonaOverlay';

// ========================================
// TYPES
// ========================================

export interface FullChartData extends
  ChartDataForLeadership,
  ChartDataForArchetype,
  ChartDataForElemental,
  ChartDataForHouse {}

export interface IndividualOverlayResults {
  leadership: LeadershipOverlayResult;
  archetype: ArchetypeOverlayResult;
  elemental: ElementalOverlayResult;
  house: HouseOverlayResult;
  shenSha: ShenShaOverlayResult;
  usefulGod: UsefulGodOverlayResult;
  generational: GenerationalOverlayResult;
  destinyTrajectory: DestinyTrajectoryResult;
  eventTrigger: EventTriggerResult;
  microTiming: MicroTimingResult;
  ancestralPersona: AncestralPersonaResult;
}

export interface CompositeOverlayResults {
  leadership: CompositeLeadershipResult;
  archetypeCompatibility: ReturnType<typeof calculateArchetypeCompatibility>;
  elementalCompatibility: ReturnType<typeof calculateElementalCompatibility>;
  houseCompatibility: ReturnType<typeof calculateHouseCompatibility>;
  shenShaCompatibility: ReturnType<typeof calculateShenShaCompatibility>;
  usefulGodCompatibility: ReturnType<typeof calculateUsefulGodCompatibility>;
  generationalCompatibility: ReturnType<typeof calculateGenerationalCompatibility>;
  trajectoryCompatibility: ReturnType<typeof calculateTrajectoryCompatibility>;
  eventTriggerCompatibility: ReturnType<typeof calculateEventTriggerCompatibility>;
  ancestralCompatibility: ReturnType<typeof calculateAncestralCompatibility>;
  compositeElemental: CompositeElementalResult;
  teamLeadership: TeamLeadershipResult;
  compositeUsefulGod: CompositeUsefulGodResult;
}

export interface OverlayIntegrationResult {
  individual: IndividualOverlayResults;
  totalDelta: number;
  combinedNarrative: string;
  devToolsBreakdown: DevToolsOverlayBreakdown;
  personaVoices: PersonaVoiceCollection;
  chamberNarratives: ChamberNarrativeCollection;
}

export interface RelationshipOverlayIntegrationResult {
  person1: IndividualOverlayResults;
  person2: IndividualOverlayResults;
  composite: CompositeOverlayResults;
  totalDelta: number;
  combinedNarrative: string;
  devToolsBreakdown: DevToolsRelationshipBreakdown;
  personaVoices: RelationshipPersonaVoices;
}

export interface DevToolsOverlayBreakdown {
  overlays: Array<{
    name: string;
    delta: number;
    dominantTrait: string;
    score: number;
  }>;
  totalDelta: number;
  formula: string;
}

export interface DevToolsRelationshipBreakdown {
  person1: DevToolsOverlayBreakdown;
  person2: DevToolsOverlayBreakdown;
  composite: {
    archetypeCompatibility: number;
    elementalCompatibility: number;
    houseCompatibility: number;
    leadershipDynamic: string;
    totalCompatibilityBoost: number;
  };
}

export interface PersonaVoiceCollection {
  leadership: Record<'mentor' | 'oracle' | 'companion' | 'mirror', string>;
  archetype: Record<'mentor' | 'oracle' | 'companion' | 'mirror', string>;
  elemental: Record<'mentor' | 'oracle' | 'companion' | 'mirror', string>;
  house: Record<'mentor' | 'oracle' | 'companion' | 'mirror', string>;
}

export interface ChamberNarrativeCollection {
  leadership: string;
  archetype: string;
  elemental: string;
  house: string;
}

export interface RelationshipPersonaVoices {
  person1: PersonaVoiceCollection;
  person2: PersonaVoiceCollection;
  composite: Record<'mentor' | 'oracle' | 'companion' | 'mirror', string>;
}

// ========================================
// INDIVIDUAL OVERLAY INTEGRATION
// ========================================

/**
 * Compute all overlays for a single chart
 */
export function computeAllOverlays(chart: FullChartData, currentDate?: Date): OverlayIntegrationResult {
  const now = currentDate || new Date();

  // Compute individual overlays
  const leadership = computeLeadershipOverlay(chart);
  const archetype = computeArchetypeOverlay(chart);
  const elemental = computeElementalOverlay(chart);
  const house = computeHouseOverlay(chart);

  // New overlays
  const shenSha = computeShenShaOverlay(chart);
  const usefulGod = computeUsefulGodOverlay(chart);
  const generational = computeGenerationalOverlay(chart);
  const destinyTrajectory = computeDestinyTrajectoryOverlay(chart, now);
  const eventTrigger = computeEventTriggerOverlay(chart, now);
  const microTiming = computeMicroTimingOverlay(chart, now);
  const ancestralPersona = computeAncestralPersonaOverlay(chart);

  const individual: IndividualOverlayResults = {
    leadership,
    archetype,
    elemental,
    house,
    shenSha,
    usefulGod,
    generational,
    destinyTrajectory,
    eventTrigger,
    microTiming,
    ancestralPersona
  };

  // Calculate total delta (expanded formula)
  const totalDelta =
    leadership.leadershipDelta +
    archetype.archetypeDelta +
    elemental.elementalDelta +
    house.houseDelta +
    shenSha.shenShaDelta +
    usefulGod.usefulGodDelta +
    generational.generationalDelta +
    destinyTrajectory.trajectoryDelta +
    eventTrigger.eventDelta +
    microTiming.microDelta +
    ancestralPersona.ancestralDelta;

  // Build combined narrative
  const combinedNarrative = buildCombinedNarrative(individual);

  // Build DevTools breakdown
  const devToolsBreakdown = buildDevToolsBreakdown(individual, totalDelta);

  // Gather persona voices
  const personaVoices = gatherPersonaVoices(individual);

  // Gather chamber narratives
  const chamberNarratives = gatherChamberNarratives(individual);

  return {
    individual,
    totalDelta,
    combinedNarrative,
    devToolsBreakdown,
    personaVoices,
    chamberNarratives
  };
}

// ========================================
// RELATIONSHIP OVERLAY INTEGRATION
// ========================================

/**
 * Compute all overlays for a relationship between two charts
 */
export function computeRelationshipOverlays(
  chart1: FullChartData,
  chart2: FullChartData,
  person1Name?: string,
  person2Name?: string,
  currentDate?: Date
): RelationshipOverlayIntegrationResult {
  const now = currentDate || new Date();

  // Compute individual overlays for person 1
  const person1: IndividualOverlayResults = {
    leadership: computeLeadershipOverlay(chart1),
    archetype: computeArchetypeOverlay(chart1),
    elemental: computeElementalOverlay(chart1),
    house: computeHouseOverlay(chart1),
    shenSha: computeShenShaOverlay(chart1),
    usefulGod: computeUsefulGodOverlay(chart1),
    generational: computeGenerationalOverlay(chart1),
    destinyTrajectory: computeDestinyTrajectoryOverlay(chart1, now),
    eventTrigger: computeEventTriggerOverlay(chart1, now),
    microTiming: computeMicroTimingOverlay(chart1, now),
    ancestralPersona: computeAncestralPersonaOverlay(chart1)
  };

  // Compute individual overlays for person 2
  const person2: IndividualOverlayResults = {
    leadership: computeLeadershipOverlay(chart2),
    archetype: computeArchetypeOverlay(chart2),
    elemental: computeElementalOverlay(chart2),
    house: computeHouseOverlay(chart2),
    shenSha: computeShenShaOverlay(chart2),
    usefulGod: computeUsefulGodOverlay(chart2),
    generational: computeGenerationalOverlay(chart2),
    destinyTrajectory: computeDestinyTrajectoryOverlay(chart2, now),
    eventTrigger: computeEventTriggerOverlay(chart2, now),
    microTiming: computeMicroTimingOverlay(chart2, now),
    ancestralPersona: computeAncestralPersonaOverlay(chart2)
  };

  // Compute composite overlays (original)
  const compositeLeadership = computeCompositeLeadership(
    chart1, chart2, person1Name, person2Name
  );
  const archetypeCompatibility = calculateArchetypeCompatibility(
    person1.archetype, person2.archetype
  );
  const elementalCompatibility = calculateElementalCompatibility(
    person1.elemental, person2.elemental
  );
  const houseCompatibility = calculateHouseCompatibility(
    person1.house, person2.house
  );

  // Compute new composite overlays
  const shenShaCompatibility = calculateShenShaCompatibility(
    person1.shenSha, person2.shenSha
  );
  const usefulGodCompatibility = calculateUsefulGodCompatibility(
    person1.usefulGod, person2.usefulGod
  );
  const generationalCompatibility = calculateGenerationalCompatibility(
    person1.generational, person2.generational
  );
  const trajectoryCompatibility = calculateTrajectoryCompatibility(
    person1.destinyTrajectory, person2.destinyTrajectory
  );
  const eventTriggerCompatibility = calculateEventTriggerCompatibility(
    person1.eventTrigger, person2.eventTrigger
  );
  const ancestralCompatibility = calculateAncestralCompatibility(
    person1.ancestralPersona, person2.ancestralPersona
  );
  const compositeElemental = computeCompositeElementalOverlay(
    person1.elemental, person2.elemental
  );
  const teamLeadership = computeTeamLeadershipOverlay(
    person1.leadership, person2.leadership, person1Name, person2Name
  );
  const compositeUsefulGod = computeCompositeUsefulGodOverlay(
    person1.usefulGod, person2.usefulGod
  );

  const composite: CompositeOverlayResults = {
    leadership: compositeLeadership,
    archetypeCompatibility,
    elementalCompatibility,
    houseCompatibility,
    shenShaCompatibility,
    usefulGodCompatibility,
    generationalCompatibility,
    trajectoryCompatibility,
    eventTriggerCompatibility,
    ancestralCompatibility,
    compositeElemental,
    teamLeadership,
    compositeUsefulGod
  };

  // Calculate total delta for person 1
  const individualDelta1 =
    person1.leadership.leadershipDelta +
    person1.archetype.archetypeDelta +
    person1.elemental.elementalDelta +
    person1.house.houseDelta +
    person1.shenSha.shenShaDelta +
    person1.usefulGod.usefulGodDelta +
    person1.generational.generationalDelta +
    person1.destinyTrajectory.trajectoryDelta +
    person1.eventTrigger.eventDelta +
    person1.microTiming.microDelta +
    person1.ancestralPersona.ancestralDelta;

  // Calculate total delta for person 2
  const individualDelta2 =
    person2.leadership.leadershipDelta +
    person2.archetype.archetypeDelta +
    person2.elemental.elementalDelta +
    person2.house.houseDelta +
    person2.shenSha.shenShaDelta +
    person2.usefulGod.usefulGodDelta +
    person2.generational.generationalDelta +
    person2.destinyTrajectory.trajectoryDelta +
    person2.eventTrigger.eventDelta +
    person2.microTiming.microDelta +
    person2.ancestralPersona.ancestralDelta;

  // Calculate expanded compatibility boost
  const compatibilityBoost =
    (archetypeCompatibility.score - 0.5) * 0.1 +
    (elementalCompatibility.score - 0.5) * 0.1 +
    (houseCompatibility.score - 0.5) * 0.1 +
    (shenShaCompatibility.score - 0.5) * 0.08 +
    (usefulGodCompatibility.score - 0.5) * 0.08 +
    (generationalCompatibility.score - 0.5) * 0.06 +
    (trajectoryCompatibility.score - 0.5) * 0.06 +
    (eventTriggerCompatibility.score - 0.5) * 0.04 +
    (ancestralCompatibility.score - 0.5) * 0.06 +
    compositeLeadership.compositeDelta +
    compositeElemental.compositeDelta +
    teamLeadership.teamDelta +
    compositeUsefulGod.compositeDelta;

  const totalDelta = (individualDelta1 + individualDelta2) / 2 + compatibilityBoost;

  // Build combined narrative
  const combinedNarrative = buildRelationshipNarrative(
    person1, person2, composite, person1Name, person2Name
  );

  // Build DevTools breakdown
  const devToolsBreakdown = buildRelationshipDevToolsBreakdown(
    person1, person2, composite, individualDelta1, individualDelta2, compatibilityBoost
  );

  // Gather persona voices
  const personaVoices = gatherRelationshipPersonaVoices(
    person1, person2, compositeLeadership
  );

  return {
    person1,
    person2,
    composite,
    totalDelta,
    combinedNarrative,
    devToolsBreakdown,
    personaVoices
  };
}

// ========================================
// NARRATIVE BUILDERS
// ========================================

function buildCombinedNarrative(overlays: IndividualOverlayResults): string {
  const parts: string[] = [];

  // Leadership summary
  parts.push(`**Leadership**: ${overlays.leadership.leadershipStyle}. ${overlays.leadership.narrative.split('.')[0]}.`);

  // Archetype summary
  const topArchetypes = overlays.archetype.ranking.slice(0, 2).map(r => r.archetype);
  parts.push(`**Archetypes**: Primarily ${topArchetypes.join(' and ')}. ${overlays.archetype.narrative.split('.')[0]}.`);

  // Elemental summary
  parts.push(`**Elements**: ${overlays.elemental.balanceType}. ${overlays.elemental.narrative.split('.')[0]}.`);

  // House summary
  parts.push(`**Life Focus**: ${overlays.house.lifeEmphasis}. ${overlays.house.narrative.split('.')[0]}.`);

  return parts.join('\n\n');
}

function buildRelationshipNarrative(
  person1: IndividualOverlayResults,
  person2: IndividualOverlayResults,
  composite: CompositeOverlayResults,
  person1Name?: string,
  person2Name?: string
): string {
  const p1 = person1Name || 'Person 1';
  const p2 = person2Name || 'Person 2';

  const parts: string[] = [];

  // Leadership dynamic
  parts.push(`**Power Dynamic**: ${composite.leadership.dynamicType}. ${composite.leadership.narrative.split('.')[0]}.`);

  // Archetype compatibility
  parts.push(`**Mythic Resonance**: ${composite.archetypeCompatibility.analysis}`);

  // Elemental compatibility
  parts.push(`**Elemental Flow**: ${composite.elementalCompatibility.analysis}`);

  // House compatibility
  parts.push(`**Life Rhythm**: ${composite.houseCompatibility.analysis}`);

  return parts.join('\n\n');
}

// ========================================
// DEVTOOLS BUILDERS
// ========================================

function buildDevToolsBreakdown(
  overlays: IndividualOverlayResults,
  totalDelta: number
): DevToolsOverlayBreakdown {
  return {
    overlays: [
      {
        name: 'Leadership',
        delta: overlays.leadership.leadershipDelta,
        dominantTrait: overlays.leadership.leadershipStyle,
        score: overlays.leadership.leadershipScore
      },
      {
        name: 'Archetype',
        delta: overlays.archetype.archetypeDelta,
        dominantTrait: overlays.archetype.dominantArchetype,
        score: overlays.archetype.ranking[0]?.score || 0
      },
      {
        name: 'Elemental',
        delta: overlays.elemental.elementalDelta,
        dominantTrait: overlays.elemental.dominantElement,
        score: Math.max(
          overlays.elemental.fireScore,
          overlays.elemental.earthScore,
          overlays.elemental.airScore,
          overlays.elemental.waterScore
        )
      },
      {
        name: 'House',
        delta: overlays.house.houseDelta,
        dominantTrait: overlays.house.dominantMode,
        score: Math.max(
          overlays.house.angularScore,
          overlays.house.succedentScore,
          overlays.house.cadentScore
        )
      }
    ],
    totalDelta,
    formula: `totalDelta = leadership(${overlays.leadership.leadershipDelta.toFixed(3)}) + archetype(${overlays.archetype.archetypeDelta.toFixed(3)}) + elemental(${overlays.elemental.elementalDelta.toFixed(3)}) + house(${overlays.house.houseDelta.toFixed(3)}) = ${totalDelta.toFixed(3)}`
  };
}

function buildRelationshipDevToolsBreakdown(
  person1: IndividualOverlayResults,
  person2: IndividualOverlayResults,
  composite: CompositeOverlayResults,
  delta1: number,
  delta2: number,
  compatBoost: number
): DevToolsRelationshipBreakdown {
  return {
    person1: buildDevToolsBreakdown(person1, delta1),
    person2: buildDevToolsBreakdown(person2, delta2),
    composite: {
      archetypeCompatibility: composite.archetypeCompatibility.score,
      elementalCompatibility: composite.elementalCompatibility.score,
      houseCompatibility: composite.houseCompatibility.score,
      leadershipDynamic: composite.leadership.dynamicType,
      totalCompatibilityBoost: compatBoost
    }
  };
}

// ========================================
// PERSONA VOICE GATHERERS
// ========================================

function gatherPersonaVoices(overlays: IndividualOverlayResults): PersonaVoiceCollection {
  const roles: Array<'mentor' | 'oracle' | 'companion' | 'mirror'> = [
    'mentor', 'oracle', 'companion', 'mirror'
  ];

  const leadership = {} as PersonaVoiceCollection['leadership'];
  const archetype = {} as PersonaVoiceCollection['archetype'];
  const elemental = {} as PersonaVoiceCollection['elemental'];
  const house = {} as PersonaVoiceCollection['house'];

  for (const role of roles) {
    leadership[role] = getLeadershipPersonaVoice(overlays.leadership, role);
    archetype[role] = getArchetypePersonaVoice(overlays.archetype, role);
    elemental[role] = getElementalPersonaVoice(overlays.elemental, role);
    house[role] = getHousePersonaVoice(overlays.house, role);
  }

  return { leadership, archetype, elemental, house };
}

function gatherChamberNarratives(overlays: IndividualOverlayResults): ChamberNarrativeCollection {
  return {
    leadership: getLeadershipChamberNarrative(overlays.leadership),
    archetype: getArchetypeChamberNarrative(overlays.archetype),
    elemental: getElementalChamberNarrative(overlays.elemental),
    house: getHouseChamberNarrative(overlays.house)
  };
}

function gatherRelationshipPersonaVoices(
  person1: IndividualOverlayResults,
  person2: IndividualOverlayResults,
  compositeLeadership: CompositeLeadershipResult
): RelationshipPersonaVoices {
  const roles: Array<'mentor' | 'oracle' | 'companion' | 'mirror'> = [
    'mentor', 'oracle', 'companion', 'mirror'
  ];

  const composite = {} as Record<'mentor' | 'oracle' | 'companion' | 'mirror', string>;
  for (const role of roles) {
    composite[role] = getCompositePersonaVoice(compositeLeadership, role);
  }

  return {
    person1: gatherPersonaVoices(person1),
    person2: gatherPersonaVoices(person2),
    composite
  };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get a quick summary of all overlays
 */
export function getOverlaySummary(result: OverlayIntegrationResult): string {
  const { individual } = result;
  return [
    `Leadership: ${individual.leadership.leadershipStyle}`,
    `Archetype: ${individual.archetype.dominantArchetype}`,
    `Element: ${individual.elemental.dominantElement}`,
    `House Mode: ${individual.house.dominantMode}`
  ].join(' | ');
}

/**
 * Get specific overlay by name
 */
export function getOverlayByName(
  result: OverlayIntegrationResult,
  name: 'leadership' | 'archetype' | 'elemental' | 'house'
): LeadershipOverlayResult | ArchetypeOverlayResult | ElementalOverlayResult | HouseOverlayResult {
  return result.individual[name];
}

/**
 * Apply overlay weights (for tuning)
 */
export function applyOverlayWeights(
  result: OverlayIntegrationResult,
  weights: {
    leadership?: number;
    archetype?: number;
    elemental?: number;
    house?: number;
  }
): number {
  const { individual } = result;

  const weightedDelta =
    individual.leadership.leadershipDelta * (weights.leadership ?? 1) +
    individual.archetype.archetypeDelta * (weights.archetype ?? 1) +
    individual.elemental.elementalDelta * (weights.elemental ?? 1) +
    individual.house.houseDelta * (weights.house ?? 1);

  return weightedDelta;
}

// ========================================
// EXPORTS
// ========================================

export {
  // Individual overlays
  computeLeadershipOverlay,
  computeArchetypeOverlay,
  computeElementalOverlay,
  computeHouseOverlay,
  computeCompositeLeadership,

  // Compatibility functions
  calculateArchetypeCompatibility,
  calculateElementalCompatibility,
  calculateHouseCompatibility,

  // Persona voice functions
  getLeadershipPersonaVoice,
  getArchetypePersonaVoice,
  getElementalPersonaVoice,
  getHousePersonaVoice,
  getCompositePersonaVoice,

  // Chamber narrative functions
  getLeadershipChamberNarrative,
  getArchetypeChamberNarrative,
  getElementalChamberNarrative,
  getHouseChamberNarrative,
  getCompositeChamberNarrative
};

// Re-export types
export type {
  LeadershipOverlayResult,
  ArchetypeOverlayResult,
  ElementalOverlayResult,
  HouseOverlayResult,
  CompositeLeadershipResult,
  ChartDataForLeadership,
  ChartDataForArchetype,
  ChartDataForElemental,
  ChartDataForHouse
};
