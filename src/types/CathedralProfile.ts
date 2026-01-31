/**
 * CathedralProfile.ts
 * ====================
 *
 * Complete TypeScript type definitions for the Liz Greene Cathedral Architecture.
 * This file defines the shape of the CathedralProfile object produced by
 * buildLizGreeneCathedralProfile.js - the master orchestrator.
 *
 * Architecture layers:
 * 1. Meta - Generation metadata
 * 2. Trinity - Sun/Moon/Rising psychological core
 * 3. Psychological Narrative - Life story arc
 * 4. Aspect Patterns - Grand trines, T-squares, etc.
 * 5. Planetary Psychology - Individual planet analyses
 * 6. Shadow Work - Unconscious dynamics
 * 7. Greene-Jung Integration - Archetypal synthesis
 * 8. Pilgrim Journey - Current life stage
 * 9. Saturn Journey - Saturn cycle position
 * 10. Fate Threads - Nodal axis and destiny
 * 11. Composite - Relationship chart (optional)
 * 12. Synastry - Inter-chart aspects (optional)
 * 13. Relationship Destiny - Full relationship OS (optional)
 */

// =============================================================================
// PRIMITIVE TYPES
// =============================================================================

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Planet =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
  | 'NorthNode' | 'SouthNode' | 'Chiron' | 'Lilith';

export type AspectType =
  | 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile'
  | 'quincunx' | 'semisextile' | 'sesquiquadrate' | 'semisquare';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// =============================================================================
// META BLOCK
// =============================================================================

export interface CathedralMeta {
  version: string;
  generatedAt: string;
  primaryName: string;
  partnerName?: string;
  isRelationshipProfile: boolean;
  layers: string[];
  engineVersions: Record<string, string>;
}

// =============================================================================
// TRINITY BLOCK - Sun/Moon/Rising Core
// =============================================================================

export interface PlanetaryPlacement {
  planet: Planet;
  sign: ZodiacSign;
  house: HouseNumber;
  degree: number;
  retrograde?: boolean;
  element: Element;
  modality: Modality;
}

export interface TrinityInterpretation {
  archetype: string;
  keywords: string[];
  psychological: string;
  shadow: string;
  integration: string;
}

export interface TrinityBlock {
  sun: {
    placement: PlanetaryPlacement;
    interpretation: TrinityInterpretation;
    houseContext: string;
  };
  moon: {
    placement: PlanetaryPlacement;
    interpretation: TrinityInterpretation;
    houseContext: string;
    emotionalNeeds: string[];
  };
  rising: {
    sign: ZodiacSign;
    degree: number;
    interpretation: TrinityInterpretation;
    persona: string;
  };
  synthesis: {
    coreIdentity: string;
    innerConflicts: string[];
    integrationPath: string;
    elementBalance: Record<Element, number>;
    modalityBalance: Record<Modality, number>;
  };
}

// =============================================================================
// PSYCHOLOGICAL NARRATIVE BLOCK
// =============================================================================

export interface LifeChapter {
  title: string;
  ageRange: string;
  theme: string;
  challenges: string[];
  gifts: string[];
  keyTransits: string[];
}

export interface PsychologicalNarrativeBlock {
  openingScene: string;
  coreWound: {
    source: string;
    manifestation: string;
    healingPath: string;
  };
  lifeChapters: LifeChapter[];
  heroicQuest: {
    call: string;
    threshold: string;
    trials: string[];
    transformation: string;
    return: string;
  };
  closingBlessing: string;
}

// =============================================================================
// ASPECT PATTERNS BLOCK
// =============================================================================

export interface AspectDetail {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  orb: number;
  applying: boolean;
  interpretation: string;
}

export interface PatternConfiguration {
  name: string;
  type: 'GrandTrine' | 'GrandCross' | 'TSquare' | 'Yod' | 'Kite' | 'MysticRectangle' | 'Stellium';
  planets: Planet[];
  element?: Element;
  modality?: Modality;
  interpretation: {
    gift: string;
    challenge: string;
    integration: string;
  };
  psychologicalDynamics: string;
}

export interface AspectPatternsBlock {
  majorAspects: AspectDetail[];
  minorAspects: AspectDetail[];
  configurations: PatternConfiguration[];
  dominantTheme: string;
  aspectSummary: {
    harmonious: number;
    challenging: number;
    neutral: number;
  };
}

// =============================================================================
// PLANETARY PSYCHOLOGY BLOCK
// =============================================================================

export interface PlanetaryProfile {
  planet: Planet;
  placement: PlanetaryPlacement;
  archetype: string;
  psychologicalFunction: string;
  consciousExpression: string;
  shadowExpression: string;
  integrationTask: string;
  aspectInfluences: string[];
  houseRulerships: HouseNumber[];
}

export interface PlanetaryPsychologyBlock {
  personalPlanets: {
    mercury: PlanetaryProfile;
    venus: PlanetaryProfile;
    mars: PlanetaryProfile;
  };
  socialPlanets: {
    jupiter: PlanetaryProfile;
    saturn: PlanetaryProfile;
  };
  transpersonalPlanets: {
    uranus: PlanetaryProfile;
    neptune: PlanetaryProfile;
    pluto: PlanetaryProfile;
  };
  woundedHealer: {
    chiron: PlanetaryProfile;
    woundSource: string;
    healingGift: string;
  };
  darkFeminine: {
    lilith: PlanetaryProfile;
    repressedDesires: string;
    reclamationPath: string;
  };
}

// =============================================================================
// SHADOW WORK BLOCK
// =============================================================================

export interface ShadowDynamic {
  source: Planet | string;
  manifestation: string;
  trigger: string;
  projection: string;
  integration: string;
}

export interface ShadowWorkBlock {
  primaryShadow: ShadowDynamic;
  secondaryShadows: ShadowDynamic[];
  collectiveShadow: {
    generationalInfluence: string;
    transpersonalChallenge: string;
  };
  shadowGifts: string[];
  integrationPractices: string[];
  jungianProcesses: {
    anima_animus: string;
    persona: string;
    selfAxis: string;
  };
}

// =============================================================================
// GREENE-JUNG INTEGRATION BLOCK
// =============================================================================

export interface ArchetypeActivation {
  archetype: string;
  planet: Planet;
  strength: number; // 0-100
  expression: string;
  shadow: string;
}

export interface IndividuationStage {
  stage: 'Persona' | 'Shadow' | 'Anima/Animus' | 'Self';
  currentProgress: number; // 0-100
  currentTask: string;
  obstacles: string[];
  support: string[];
}

export interface GreeneJungBlock {
  dominantArchetypes: ArchetypeActivation[];
  individuationPath: IndividuationStage[];
  complexes: {
    name: string;
    source: string;
    triggers: string[];
    resolution: string;
  }[];
  transcendentFunction: {
    opposites: [string, string];
    synthesis: string;
    symbol: string;
  };
  mythicIdentity: {
    primaryMyth: string;
    heroArchetype: string;
    currentChapter: string;
  };
}

// =============================================================================
// PILGRIM JOURNEY BLOCK
// =============================================================================

export interface LifeStage {
  name: string;
  ageRange: string;
  theme: string;
  tasks: string[];
  gifts: string[];
  challenges: string[];
}

export interface PilgrimJourneyBlock {
  currentStage: LifeStage;
  nextStage: LifeStage;
  transitionTheme: string;
  saturnInfluence: {
    currentPhase: string;
    lessonFocus: string;
    masteryAreas: string[];
  };
  jupiterInfluence: {
    expansionArea: string;
    opportunityWindow: string;
  };
  lifePathNarrative: string;
  elderWisdom: string;
}

// =============================================================================
// SATURN JOURNEY BLOCK
// =============================================================================

export type SaturnPhase =
  | 'Pre-First-Return'
  | 'First-Return'
  | 'Post-First-Return'
  | 'Second-Return-Approach'
  | 'Second-Return'
  | 'Elder-Wisdom';

export interface SaturnCyclePosition {
  phase: SaturnPhase;
  exactAge: number;
  yearsUntilNextReturn: number;
  currentSaturnSign: ZodiacSign;
  natalSaturnSign: ZodiacSign;
  aspectToNatal: AspectType | null;
}

export interface SaturnLesson {
  area: string;
  challenge: string;
  mastery: string;
  timeframe: string;
}

export interface SaturnJourneyBlock {
  cyclePosition: SaturnCyclePosition;
  currentLessons: SaturnLesson[];
  pastLessons: SaturnLesson[];
  futureLessons: SaturnLesson[];
  saturnHouseTheme: string;
  saturnSignExpression: string;
  authorityDevelopment: {
    innerAuthority: string;
    outerAuthority: string;
    integrationTask: string;
  };
  structureBuilding: {
    currentFocus: string;
    materializations: string[];
    limitations: string[];
  };
  saturnReturn: {
    isActive: boolean;
    themes: string[];
    completionTasks: string[];
  } | null;
}

// =============================================================================
// FATE THREADS BLOCK
// =============================================================================

export interface NodalAxis {
  northNode: {
    sign: ZodiacSign;
    house: HouseNumber;
    interpretation: string;
  };
  southNode: {
    sign: ZodiacSign;
    house: HouseNumber;
    interpretation: string;
  };
  axisTheme: string;
  evolutionaryDirection: string;
}

export interface KarmicPattern {
  source: string;
  manifestation: string;
  resolution: string;
  affectedAreas: string[];
}

export interface FateThreadsBlock {
  nodalAxis: NodalAxis;
  karmicPatterns: KarmicPattern[];
  destinyIndicators: {
    lifeDestiny: string;
    soulPurpose: string;
    dharmaPath: string;
  };
  pastLifeThemes: string[];
  futureEvolution: {
    nextNodalReturn: string;
    evolutionaryPull: string;
    resistancePatterns: string[];
  };
  fateVsFreeWill: string;
}

// =============================================================================
// COMPOSITE CHART BLOCK (Optional - Relationship)
// =============================================================================

export interface CompositePlacement {
  planet: Planet;
  sign: ZodiacSign;
  house: HouseNumber;
  degree: number;
}

export interface CompositeIdentity {
  compositeSun: CompositePlacement;
  compositeMoon: CompositePlacement;
  compositeAscendant: {
    sign: ZodiacSign;
    degree: number;
  };
  relationshipArchetype: string;
  coreIdentity: string;
}

export interface CompositeProfile {
  identity: CompositeIdentity;
  emotionalBody: {
    compositeMoon: CompositePlacement;
    emotionalDynamics: string;
    needsAsCouple: string[];
    vulnerabilities: string[];
  };
  communicationStyle: {
    compositeMercury: CompositePlacement;
    style: string;
    strengths: string[];
    challenges: string[];
  };
  loveLanguage: {
    compositeVenus: CompositePlacement;
    expressionStyle: string;
    affectionNeeds: string[];
    aestheticValues: string[];
  };
  driveAndConflict: {
    compositeMars: CompositePlacement;
    conflictStyle: string;
    motivations: string[];
    tensionPoints: string[];
  };
  growth: {
    compositeJupiter: CompositePlacement;
    expansionAreas: string[];
    sharedBeliefs: string[];
  };
  challenges: {
    compositeSaturn: CompositePlacement;
    karmicLessons: string[];
    structuralChallenges: string[];
    maturationPath: string;
  };
  transformationPotential: {
    compositePluto: CompositePlacement;
    powerDynamics: string;
    transformationThemes: string[];
    shadowWork: string[];
  };
  soulContract: {
    compositeNorthNode: CompositePlacement;
    compositeSouthNode: CompositePlacement;
    purpose: string;
    karmicHistory: string;
    evolutionaryDirection: string;
  };
}

// =============================================================================
// SYNASTRY BLOCK (Optional - Relationship)
// =============================================================================

export interface SynastryAspect {
  personA_planet: Planet;
  personB_planet: Planet;
  aspectType: AspectType;
  orb: number;
  interpretation: string;
  attraction: number; // -100 to 100
  challenge: number; // 0 to 100
}

export interface HouseOverlay {
  personA_planet: Planet;
  personB_house: HouseNumber;
  interpretation: string;
  impact: string;
}

export interface SynastryBlock {
  majorAspects: SynastryAspect[];
  venusMarsDynamics: {
    attraction: string;
    passion: string;
    compatibility: number;
  };
  sunMoonDynamics: {
    egoSoulConnection: string;
    emotionalSecurity: string;
    compatibility: number;
  };
  saturnAspects: {
    commitment: string;
    challenges: string[];
    longevityIndicators: string[];
  };
  houseOverlays: {
    personAInPersonB: HouseOverlay[];
    personBInPersonA: HouseOverlay[];
  };
  overallCompatibility: {
    score: number;
    strengths: string[];
    challenges: string[];
    growthAreas: string[];
  };
}

// =============================================================================
// RELATIONSHIP DESTINY BLOCK (Optional - Full Relationship OS)
// =============================================================================

export interface RelationshipSoulMap {
  identity: CompositeIdentity;
  emotionalBody: {
    moon: CompositePlacement;
    dynamics: string;
  };
  shadow: {
    collectiveShadow: {
      source: string;
      description: string;
      integration: string;
    };
    projections: string[];
  };
  contract: {
    soulLessons: string[];
    karmicDebt: string;
    evolutionaryPurpose: string;
  };
  fate: {
    destinyPath: string;
    fateWindows: string[];
  };
}

export interface RelationshipTimeline {
  currentSeason: {
    type: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
    theme: string;
    duration: string;
    tasks: string[];
  };
  activeFateWindows: {
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    theme: string;
    opportunities: string[];
  }[];
  currentTransits: {
    transitPlanet: Planet;
    natalPoint: string;
    aspectType: AspectType;
    theme: string;
    duration: string;
  }[];
  upcomingMilestones: {
    name: string;
    date: string;
    significance: string;
  }[];
}

export interface RelationshipEvolution {
  currentStage: {
    number: number;
    title: string;
    archetype: string;
    psychologicalTask: string;
    gifts: string[];
    shadows: string[];
  };
  evolutionTimeline: {
    stage: number;
    title: string;
    isCurrent: boolean;
    isPast: boolean;
    isFuture: boolean;
  }[];
  mythicArc: {
    name: string;
    currentPhase: string;
    nextPhase: string;
    ultimateDestination: string;
  };
  crisisOpportunity: {
    isActive: boolean;
    crisis: string;
    opportunity: string;
    resolution: string;
  } | null;
}

export interface RelationshipHealing {
  woundAnalysis: {
    primaryWounds: {
      wound: string;
      source: string;
      trigger: string;
      lunaHealing: string;
    }[];
    sharedTrauma: string;
    healingPriority: string;
  };
  repairRituals: {
    name: string;
    timing: string;
    steps: string[];
    expectedOutcome: string;
  }[];
  communicationFramework: {
    style: string;
    guidelines: string[];
    conflictProtocol: string[];
  };
  emergencyToolkit: {
    inConflict: string[];
    afterBetrayal: string[];
    duringTransition: string[];
  };
  healingPrescription: {
    dailyPractices: string[];
    weeklyRituals: string[];
    monthlyResets: string[];
  };
  lunaDialogues: {
    situation: string;
    lunaResponse: string;
    guidingQuestion: string;
  }[];
}

export interface RelationshipDestinyBlock {
  executiveSummary: {
    coreIdentity: {
      archetype: string;
      essence: string;
    };
    currentSeason: string;
    primaryChallenge: string;
    greatestGift: string;
    lunaGuidance: string;
  };
  soulMap: RelationshipSoulMap;
  timeline: RelationshipTimeline;
  evolution: RelationshipEvolution;
  healing: RelationshipHealing;
  lunaWisdom: {
    openingBlessing: string;
    dailyGuidance: string;
    closingBlessing: string;
  };
}

// =============================================================================
// QUICK ACCESS BLOCK
// =============================================================================

export interface QuickAccessBlock {
  oneLiner: string;
  threeWordEssence: [string, string, string];
  dominantElement: Element;
  dominantModality: Modality;
  keyPlanets: Planet[];
  currentFocus: string;
  shadowAlert: string;
  lunaWhisper: string;
  todaysFocus: string;
}

// =============================================================================
// MAIN CATHEDRAL PROFILE INTERFACE
// =============================================================================

export interface CathedralProfile {
  // Metadata
  meta: CathedralMeta;

  // Core Individual Profile
  trinity: TrinityBlock;
  psychologicalNarrative: PsychologicalNarrativeBlock;
  aspectPatterns: AspectPatternsBlock;
  planetaryPsychology: PlanetaryPsychologyBlock;
  shadowWork: ShadowWorkBlock;
  greeneJung: GreeneJungBlock;
  pilgrimJourney: PilgrimJourneyBlock;
  saturnJourney: SaturnJourneyBlock;
  fateThreads: FateThreadsBlock;

  // Relationship Layers (null if no partner data)
  composite: CompositeProfile | null;
  synastry: SynastryBlock | null;
  relationshipDestiny: RelationshipDestinyBlock | null;

  // Quick Access
  quickAccess: QuickAccessBlock;
}

// =============================================================================
// INPUT TYPES
// =============================================================================

export interface BirthData {
  name: string;
  birthDate: string; // ISO format
  birthTime: string; // HH:MM format
  birthPlace: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export interface ChartData extends BirthData {
  planets: Record<Planet, PlanetaryPlacement>;
  houses: Record<HouseNumber, { sign: ZodiacSign; degree: number }>;
  aspects: AspectDetail[];
}

export interface CathedralInput {
  primary: ChartData;
  partner?: ChartData;
  relationshipStartDate?: string;
}

export interface CathedralOptions {
  includeMinorAspects?: boolean;
  includeAsteroids?: boolean;
  verbosity?: 'minimal' | 'standard' | 'detailed';
  currentDate?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type CathedralLayer = keyof Omit<CathedralProfile, 'meta' | 'quickAccess'>;

export type RelationshipLayer = 'composite' | 'synastry' | 'relationshipDestiny';

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isRelationshipProfile(profile: CathedralProfile): boolean {
  return profile.meta.isRelationshipProfile && profile.composite !== null;
}

export function hasRelationshipDestiny(profile: CathedralProfile): profile is CathedralProfile & { relationshipDestiny: RelationshipDestinyBlock } {
  return profile.relationshipDestiny !== null;
}

export function isSaturnReturnActive(profile: CathedralProfile): boolean {
  return profile.saturnJourney.saturnReturn?.isActive ?? false;
}

// =============================================================================
// EXPORT DEFAULT
// =============================================================================

export default CathedralProfile;
