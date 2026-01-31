/**
 * Retrograde Behavioral Matrix (RBM) - Type Definitions
 *
 * Universal engine for analyzing retrograde planetary influences
 * on any user's chart - decision-making, synastry, and personality.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// CORE PLANET TYPES
// ========================================

/** Planets supported by the retrograde engine */
export type Planet =
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

/** All planets array for iteration */
export const ALL_PLANETS: Planet[] = [
  'Mercury', 'Venus', 'Mars', 'Jupiter',
  'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

/** Planet symbols for display */
export const PLANET_SYMBOLS: Record<Planet, string> = {
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇'
};

// ========================================
// PLANET STATE
// ========================================

/** Basic chart planet state */
export interface PlanetState {
  planet: Planet;
  sign: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
  /** 0-1 dignity/angularity strength (optional) */
  strength?: number;
  /** Orb to Sun for cazimi/combust calculations */
  sunOrb?: number;
}

/** Motion state for precise retrograde detection */
export type MotionState = 'direct' | 'retrograde' | 'stationary-direct' | 'stationary-retrograde';

/** Extended planet state with motion details */
export interface ExtendedPlanetState extends PlanetState {
  motion: MotionState;
  /** Speed in degrees per day */
  speed?: number;
  /** Days until station (if approaching) */
  daysToStation?: number;
}

// ========================================
// DECISION CONTEXT
// ========================================

/** Context for decision-making analysis */
export interface DecisionContext {
  topic: DecisionTopic;
  urgency: number;        // 0-1: how time-sensitive
  riskTolerance: number;  // 0-1: comfort with risk
  externalPressure: number; // 0-1: outside influence
  emotionalWeight: number;  // 0-1: how emotionally charged
}

/** Decision topic categories */
export type DecisionTopic =
  | 'relationship'
  | 'career'
  | 'finance'
  | 'identity'
  | 'health'
  | 'communication'
  | 'creativity'
  | 'spirituality'
  | 'conflict'
  | 'other';

// ========================================
// RETROGRADE PROFILE
// ========================================

/** Per-planet retrograde behavior profile */
export interface RetrogradeProfile {
  planet: Planet;

  // Core axes (what gets affected)
  internalization: InternalizationAxis;
  decision: DecisionAxis;
  synastry: SynastryAxis;

  // Behavioral modifiers
  internalizationWeight: number;  // 0-1: contribution to Internal Authority

  // Functions for dynamic calculations
  decisionModifier: (ctx: DecisionContext) => number;
  synastryModifier: (self: PlanetState, partner: PlanetState[]) => SynastryResult;

  // Narrative templates
  archetype: string;
  coreStatement: string;
  behaviors: string[];
  strengths: string[];
  challenges: string[];
}

/** What gets internalized when Rx */
export interface InternalizationAxis {
  domain: string;           // e.g., "thinking, communication"
  internalProcess: string;  // what happens inside
  externalManifest: string; // how it shows outwardly
}

/** How Rx affects decisions */
export interface DecisionAxis {
  style: string;            // e.g., "reprocessing, nonlinear logic"
  tendency: string;         // natural inclination
  pitfall: string;          // potential issue
  strength: string;         // advantage when used well
}

/** How Rx affects relationships */
export interface SynastryAxis {
  bonding: string;          // how they bond
  friction: string;         // what causes conflict
  resonance: string;        // what creates compatibility
  projection: string;       // what they project onto partners
}

// ========================================
// SYNASTRY RESULTS
// ========================================

/** Result from synastry calculation */
export interface SynastryResult {
  score: number;            // -1 to +1
  friction: number;         // 0-1: potential for conflict
  resonance: number;        // 0-1: potential for harmony
  dynamic: SynastryDynamic;
}

/** Synastry dynamic type */
export type SynastryDynamic =
  | 'harmonious'      // both Rx or both direct
  | 'complementary'   // different but works
  | 'challenging'     // friction but growth potential
  | 'karmic'          // deep, transformative
  | 'neutral';

// ========================================
// INTERNAL AUTHORITY PROFILE
// ========================================

/** Computed Internal Authority Profile for a chart */
export interface InternalAuthorityProfile {
  /** Overall IAP score 0-1 */
  score: number;

  /** Per-planet contributions */
  contributions: PlanetContribution[];

  /** Dominant retrograde (highest weight) */
  dominant: Planet | null;

  /** Interpretation tier */
  tier: AuthorityTier;

  /** Narrative summary */
  summary: string;

  /** Decision style descriptor */
  decisionStyle: string;

  /** Key phrases for AI prompts */
  keyPhrases: string[];
}

/** Single planet's contribution to IAP */
export interface PlanetContribution {
  planet: Planet;
  isRetrograde: boolean;
  weight: number;
  contribution: number;
  description: string;
}

/** Authority tier based on IAP score */
export type AuthorityTier =
  | 'external'      // 0-0.2: relies heavily on external validation
  | 'balanced'      // 0.2-0.4: mix of internal/external
  | 'internal'      // 0.4-0.6: tends toward self-reference
  | 'autonomous'    // 0.6-0.8: strongly self-directed
  | 'sovereign';    // 0.8-1.0: fully self-referential system

// ========================================
// RELATIONSHIP DYNAMICS
// ========================================

/** Full relationship dynamics profile based on retrogrades */
export interface RelationshipDynamicsProfile {
  /** Autonomy needs */
  autonomy: AutonomyProfile;

  /** Communication patterns */
  communication: CommunicationProfile;

  /** Emotional processing */
  emotional: EmotionalProfile;

  /** Conflict style */
  conflict: ConflictProfile;

  /** Bonding patterns */
  bonding: BondingProfile;

  /** Projection patterns */
  projection: ProjectionProfile;

  /** Sexual polarity */
  sexual: SexualProfile;

  /** Commitment style */
  commitment: CommitmentProfile;
}

export interface AutonomyProfile {
  level: number;  // 0-1
  needs: string[];
  triggers: string[];
}

export interface CommunicationProfile {
  style: string;
  strengths: string[];
  challenges: string[];
}

export interface EmotionalProfile {
  processing: string;
  depth: number;
  expression: string;
}

export interface ConflictProfile {
  style: string;
  triggers: string[];
  resolution: string;
}

export interface BondingProfile {
  style: string;
  timeframe: string;
  depth: number;
}

export interface ProjectionProfile {
  tendency: string;
  blind_spots: string[];
}

export interface SexualProfile {
  polarity: string;
  intensity: number;
  connection: string;
}

export interface CommitmentProfile {
  style: string;
  timeline: string;
  flexibility: number;
}

// ========================================
// CHART INPUT
// ========================================

/** Minimal chart data needed for retrograde analysis */
export interface ChartInput {
  planets: PlanetState[];
  /** Optional: Sun position for conjunction calculations */
  sun?: { sign: string; degree: number };
  /** Optional: Ascendant for amplification calculations */
  ascendant?: { sign: string; degree: number };
}

// ========================================
// FULL ANALYSIS OUTPUT
// ========================================

/** Complete retrograde analysis for a chart */
export interface RetrogradeAnalysis {
  /** Planets that are retrograde */
  retrogradePlanets: PlanetState[];

  /** Count of retrogrades */
  retrogradeCount: number;

  /** Internal Authority Profile */
  iap: InternalAuthorityProfile;

  /** Relationship dynamics */
  dynamics: RelationshipDynamicsProfile;

  /** Per-planet detailed profiles */
  profiles: Map<Planet, RetrogradeProfile>;

  /** Interaction patterns (e.g., "Jupiter Rx × Leo Rising") */
  interactions: InteractionPattern[];

  /** Narrative templates for AI */
  narratives: NarrativeTemplates;
}

/** Interaction between retrograde and chart feature */
export interface InteractionPattern {
  retrograde: Planet;
  feature: string;  // e.g., "Leo Rising", "Sun-Uranus conjunction"
  interaction: string;
  archetype: string;
  effect: string[];
}

/** Narrative templates for AI persona generation */
export interface NarrativeTemplates {
  /** One-line summary */
  headline: string;

  /** 2-3 sentence overview */
  summary: string;

  /** Full paragraph description */
  description: string;

  /** Key phrases for prompts */
  keyPhrases: string[];

  /** Decision guidance */
  decisionGuidance: string;

  /** Relationship guidance */
  relationshipGuidance: string;
}
