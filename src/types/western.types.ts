/**
 * western.types.ts
 *
 * TypeScript types for Western Cusp Engine.
 * Mirrors Python models from western_engine/models.py
 *
 * Enhanced with 16-axis archetype system for deeper psychological mapping.
 */

// =============================================================================
// 16-AXIS ARCHETYPE SYSTEM
// =============================================================================

/**
 * 16 psychological dimension axes forming the archetype basis.
 * Each axis represents a unipolar trait [0, 1] where higher = stronger expression.
 *
 * NEW ORDERING - matches Python western_engine/constants.py
 */
export const ARCHETYPE_AXES = [
  'Initiator',        // 0: Drive to start, pioneer energy, action-oriented
  'Stabilizer',       // 1: Capacity to maintain, preserve, hold steady
  'Relational',       // 2: Other-oriented focus, partnership, connection
  'MindCentered',     // 3: Mental/analytical, thought-oriented
  'Intuitive',        // 4: Feeling/symbolic, sensing, inner knowing
  'Concrete',         // 5: Sensory/real, practical, material focus
  'Expressive',       // 6: Outward display, communication, visibility
  'Transpersonal',    // 7: Collective themes, universal, beyond ego
  'RiskSeeking',      // 8: Exploration, adventure, pushing boundaries
  'OrderOriented',    // 9: Need for structure, control, organization
  'FluidIdentity',    // 10: Adaptive identity, flexibility, change-comfort
  'Warm',             // 11: Emotional warmth, connection, empathy
  'Direct',           // 12: Straightforward, honest, transparent approach
  'DepthOriented',    // 13: Psychological depth, intensity, transformation
  'Sustainer',        // 14: Supportive/holding, nurturing, maintaining
  'BoundaryAware',    // 15: Clear limits, self-definition, protection
] as const;

export type ArchetypeAxis = typeof ARCHETYPE_AXES[number];

/**
 * Sign archetype vectors: each sign mapped to 16 dimensions.
 * Values in [0, 1] representing strength of each trait.
 *
 * NEW AXIS ORDERING:
 *   0: Initiator, 1: Stabilizer, 2: Relational, 3: MindCentered,
 *   4: Intuitive, 5: Concrete, 6: Expressive, 7: Transpersonal,
 *   8: RiskSeeking, 9: OrderOriented, 10: FluidIdentity, 11: Warm,
 *   12: Direct, 13: DepthOriented, 14: Sustainer, 15: BoundaryAware
 */
export const SIGN_ARCHETYPE_VECTORS: Record<ZodiacSign, number[]> = {
  // Aries: Pioneer, warrior, initiator
  Aries:       [0.90, 0.20, 0.30, 0.30, 0.40, 0.50, 0.80, 0.30, 0.90, 0.20, 0.40, 0.60, 0.90, 0.40, 0.20, 0.70],
  // Taurus: Builder, stabilizer
  Taurus:      [0.30, 0.90, 0.50, 0.40, 0.50, 0.90, 0.40, 0.20, 0.10, 0.80, 0.20, 0.70, 0.50, 0.50, 0.90, 0.80],
  // Gemini: Messenger, communicator
  Gemini:      [0.60, 0.30, 0.70, 0.90, 0.40, 0.30, 0.90, 0.40, 0.60, 0.30, 0.80, 0.50, 0.60, 0.30, 0.30, 0.40],
  // Cancer: Nurturer, protector
  Cancer:      [0.30, 0.70, 0.80, 0.30, 0.90, 0.50, 0.50, 0.40, 0.20, 0.50, 0.50, 0.90, 0.40, 0.70, 0.90, 0.60],
  // Leo: Performer, creator
  Leo:         [0.80, 0.50, 0.60, 0.40, 0.50, 0.50, 0.95, 0.30, 0.70, 0.40, 0.30, 0.80, 0.80, 0.50, 0.50, 0.70],
  // Virgo: Analyst, healer
  Virgo:       [0.30, 0.80, 0.50, 0.90, 0.40, 0.90, 0.30, 0.30, 0.20, 0.95, 0.30, 0.50, 0.70, 0.60, 0.70, 0.70],
  // Libra: Harmonizer, diplomat
  Libra:       [0.40, 0.50, 0.95, 0.60, 0.50, 0.40, 0.70, 0.50, 0.40, 0.50, 0.60, 0.80, 0.40, 0.40, 0.60, 0.40],
  // Scorpio: Transformer, detective
  Scorpio:     [0.50, 0.70, 0.60, 0.50, 0.90, 0.50, 0.40, 0.70, 0.60, 0.60, 0.40, 0.50, 0.60, 0.95, 0.50, 0.80],
  // Sagittarius: Philosopher, explorer
  Sagittarius: [0.80, 0.30, 0.60, 0.70, 0.60, 0.30, 0.80, 0.80, 0.90, 0.20, 0.70, 0.70, 0.80, 0.50, 0.30, 0.40],
  // Capricorn: Architect, achiever
  Capricorn:   [0.50, 0.90, 0.40, 0.70, 0.30, 0.90, 0.30, 0.40, 0.30, 0.95, 0.20, 0.40, 0.70, 0.60, 0.60, 0.90],
  // Aquarius: Visionary, innovator
  Aquarius:    [0.60, 0.40, 0.60, 0.80, 0.60, 0.30, 0.60, 0.90, 0.60, 0.40, 0.70, 0.40, 0.70, 0.50, 0.40, 0.50],
  // Pisces: Mystic, dreamer
  Pisces:      [0.30, 0.40, 0.70, 0.30, 0.95, 0.30, 0.50, 0.90, 0.40, 0.20, 0.80, 0.80, 0.30, 0.80, 0.70, 0.30],
};

/**
 * Cusp zone definitions for blending adjacent signs.
 */
export const CUSP_ZONES: Record<string, { primary: ZodiacSign; secondary: ZodiacSign; name: string }> = {
  'Aries-Taurus': { primary: 'Aries', secondary: 'Taurus', name: 'Pioneer-Builder' },
  'Taurus-Gemini': { primary: 'Taurus', secondary: 'Gemini', name: 'Sensualist-Communicator' },
  'Gemini-Cancer': { primary: 'Gemini', secondary: 'Cancer', name: 'Curious-Nurturer' },
  'Cancer-Leo': { primary: 'Cancer', secondary: 'Leo', name: 'Protector-Performer' },
  'Leo-Virgo': { primary: 'Leo', secondary: 'Virgo', name: 'Creative-Analyst' },
  'Virgo-Libra': { primary: 'Virgo', secondary: 'Libra', name: 'Perfectionist-Harmonizer' },
  'Libra-Scorpio': { primary: 'Libra', secondary: 'Scorpio', name: 'Diplomat-Transformer' },
  'Scorpio-Sagittarius': { primary: 'Scorpio', secondary: 'Sagittarius', name: 'Alchemist-Explorer' },
  'Sagittarius-Capricorn': { primary: 'Sagittarius', secondary: 'Capricorn', name: 'Philosopher-Builder' },
  'Capricorn-Aquarius': { primary: 'Capricorn', secondary: 'Aquarius', name: 'Architect-Visionary' },
  'Aquarius-Pisces': { primary: 'Aquarius', secondary: 'Pisces', name: 'Innovator-Mystic' },
  'Pisces-Aries': { primary: 'Pisces', secondary: 'Aries', name: 'Dreamer-Warrior' },
};

// =============================================================================
// BASIC TYPES
// =============================================================================

export type WesternElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type WesternModality = 'Cardinal' | 'Fixed' | 'Mutable';
export type WesternPolarity = 'Yang' | 'Yin';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type PlanetName =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
  | 'Ascendant' | 'Midheaven' | 'North Node' | 'Chiron' | 'Lilith';

export type AspectType =
  | 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile'
  | 'quincunx' | 'semi-sextile' | 'semi-square' | 'sesquiquadrate'
  | 'quintile' | 'biquintile';

export type ChartShapeType =
  | 'bowl' | 'bucket' | 'locomotive' | 'bundle'
  | 'splash' | 'seesaw' | 'splay';

export type Dignity = 'Exalted' | 'Domicile' | 'Neutral' | 'Detriment' | 'Debilitated';

export type CompatibilityLevel = 'Exceptional' | 'Strong' | 'Moderate' | 'Challenging' | 'Difficult';

// =============================================================================
// POSITION & ASPECT TYPES
// =============================================================================

export interface PlanetPosition {
  planet: PlanetName;
  longitude: number;  // 0-360
  sign: ZodiacSign;
  degreeInSign: number;  // 0-30
  retrograde: boolean;
  house?: number;  // 1-12
}

export interface HouseCusps {
  system: 'Porphyry' | 'Placidus' | 'Equal' | 'Whole Sign';
  cusps: number[];  // 12 longitudes
  ascendant: number;
  midheaven: number;
}

export interface AspectResult {
  planet1: string;
  planet2: string;
  aspectType: AspectType;
  exactAngle: number;
  orb: number;
  applying: boolean;
  strength: number;  // 0-1
}

export interface AspectPatternResult {
  patternType: 'grand_trine' | 't_square' | 'grand_cross' | 'yod' | 'stellium';
  planets: string[];
  element?: WesternElement;
  modality?: WesternModality;
  strength: number;
  description: string;
}

export interface ChartShapeResult {
  primaryShape: ChartShapeType;
  scores: Record<ChartShapeType, number>;
  span: number;
  maxGap: number;
  handlePlanet?: string;
}

// =============================================================================
// WESTERN EXPRESSION VECTOR (72 dimensions)
// =============================================================================

export interface WesternExpressionVector {
  // 1. Elements (4 dims)
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };

  // 2. Modalities (3 dims)
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };

  // 3. House intensities (12 dims)
  houseIntensities: number[];

  // 4. Planetary Psychology (15 dims)
  planetaryPsychology: {
    sun: number;
    moon: number;
    mercury: number;
    venus: number;
    mars: number;
    jupiter: number;
    saturn: number;
    uranus: number;
    neptune: number;
    pluto: number;
    ascendant: number;
    midheaven: number;
    northNode: number;
    chiron: number;
    lilith: number;
  };

  // 5. Archetypes (9 dims)
  archetypes: {
    warrior: number;     // Aries
    builder: number;     // Taurus/Capricorn
    messenger: number;   // Gemini/Aquarius
    nurturer: number;    // Cancer/Pisces
    performer: number;   // Leo
    analyst: number;     // Virgo
    harmonizer: number;  // Libra
    transformer: number; // Scorpio
    philosopher: number; // Sagittarius
  };

  // 6. Aspect Patterns (8 dims)
  aspectPatterns: {
    grandTrine: number;
    grandCross: number;
    tSquare: number;
    yod: number;
    stelliumCount: number;
    oppositionTension: number;
    conjunctionPower: number;
    aspectHarmony: number;
  };

  // 7. Dominance (9 dims)
  dominance: {
    dominantSign: { sign: ZodiacSign; strength: number };
    dominantPlanet: { planet: PlanetName; strength: number };
    dominantHouse: { house: number; strength: number };
    elementPurity: number;
    modalityPurity: number;
    yangYinRatio: number;
    nightDayEmphasis: number;
    retrogradeCount: number;
    dignityScore: number;
  };

  // 8. Chart Shape (6 dims)
  chartShape: {
    bowl: number;
    bucket: number;
    locomotive: number;
    bundle: number;
    splash: number;
    seesaw: number;
    detected: ChartShapeType;
  };

  // Flattened vector for calculations
  vector?: number[];
  vectorDimensions?: number;
}

// =============================================================================
// WESTERN CHART
// =============================================================================

export interface WesternChart {
  birthDatetime: string;  // ISO string
  latitude: number;
  longitude: number;
  timezone: string;

  planets: PlanetPosition[];
  houses: HouseCusps;
  aspects: AspectResult[];
  aspectPatterns: AspectPatternResult[];
  chartShape: ChartShapeResult;
  expressionVector: WesternExpressionVector;

  summary: {
    sunSign: ZodiacSign;
    moonSign: ZodiacSign;
    ascendantSign: ZodiacSign;
  };

  calculatedAt: string;  // ISO string
}

// =============================================================================
// COMPATIBILITY
// =============================================================================

export interface WesternCompatibilityScore {
  total: number;  // 0-100
  vectorCosine: number;  // 0-1

  // Section scores (0-100)
  elementHarmony: number;
  modalityScore: number;
  houseOverlay: number;
  planetaryInterplay: number;
  archetypeResonance: number;
  aspectPatternCompat: number;
  dominanceAlignment: number;
  chartShapeCompat: number;

  // Debug
  vectorADims: number;
  vectorBDims: number;
}

export interface WesternSimilarityResult {
  total: number;
  sections: {
    element: number;
    modality: number;
    house: number;
    planetary: number;
    archetype: number;
    aspect: number;
    dominance: number;
    shape: number;
  };
}

export interface SynastryResult {
  chartAId: string;
  chartBId: string;
  crossAspects: AspectResult[];
  aPlanetsInBHouses: HouseOverlay[];
  bPlanetsInAHouses: HouseOverlay[];
  aspectHarmony: number;
  houseOverlayScore: number;
  strengths: string[];
  challenges: string[];
  growthAreas: string[];
}

export interface HouseOverlay {
  planet: PlanetName;
  fromPerson: string;
  intoHouse: number;
  ofPerson: string;
  weight: number;
  meaning: string;
}

// =============================================================================
// EXTENDED MATCH SCORE WITH WESTERN
// =============================================================================

export interface MatchScoreResultWithWestern {
  total: number;
  level: CompatibilityLevel;
  neo: number;
  bazi: number;
  wuxing: number;
  tengods: number;
  western: number;  // NEW

  westernSections?: WesternSimilarityResult['sections'];

  debug: {
    alpha: number;
    beta: number;
    gamma: number;  // NEW: Western weight
    neo_details: any;
    bazi_raw: number;
    bazi_adjusted: number;
    western_raw: number;  // NEW
    modifiers: {
      favorableElements: number;
      interactions: number;
      combined: number;
    };
  };

  why: string[];
}

// =============================================================================
// SECTION WEIGHTS
// =============================================================================

export interface SectionWeights {
  element: number;
  modality: number;
  house: number;
  planetary: number;
  archetype: number;
  aspect: number;
  dominance: number;
  shape: number;
}

export const DEFAULT_SECTION_WEIGHTS: SectionWeights = {
  element: 0.20,
  modality: 0.10,
  house: 0.15,
  planetary: 0.20,
  archetype: 0.10,
  aspect: 0.10,
  dominance: 0.10,
  shape: 0.05
};

export const DEFAULT_GAMMA = 0.15;  // Western weight in total formula

// =============================================================================
// EXPLAINABILITY
// =============================================================================

export type ExplainLevel = 'L0' | 'L1' | 'L2' | 'L3';

export interface WesternExplainL0 {
  level: 'L0';
  summary: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendant: ZodiacSign;
}

export interface WesternExplainL1 {
  level: 'L1';
  factors: Array<{
    factor: string;
    score?: number;
    description: string;
    impact: string;
  }>;
  totalFactors: number;
}

export interface WesternExplainL2 {
  level: 'L2';
  formulas: Record<string, string>;
  coefficients: Record<string, Record<string, number>>;
  computedValues: Record<string, any>;
}

export interface WesternExplainL3 {
  level: 'L3';
  rawChart?: WesternChart;
  expressionVector: WesternExpressionVector;
  vectorArray: number[];
  vectorDimensions: number;
}

export type WesternExplain = WesternExplainL0 | WesternExplainL1 | WesternExplainL2 | WesternExplainL3;

// =============================================================================
// ENHANCED 16-AXIS ARCHETYPE TYPES
// =============================================================================

/**
 * Raw chart data for deriving expression vectors.
 */
export interface RawChart {
  planets: PlanetPosition[];
  chartShape: string;
  aspects: [string, string, string][];  // [planet1, planet2, aspectType]
  ascSign: ZodiacSign;
  houses?: HouseCusps;
  aspectPatterns?: AspectPatternResult[];
}

/**
 * Enhanced Western Expression Vector with 16-axis archetype system.
 * Total dimensions when flattened: 52+
 */
export interface EnhancedWesternExpressionVector {
  // Element distribution (4 dims)
  elements: Record<WesternElement, number>;

  // Modality distribution (3 dims)
  modalities: Record<WesternModality, number>;

  // House intensities (12 dims)
  houses: number[];

  // Planet vectors: each planet has 35-dim vector
  // (4 element + 3 modality + 12 house + 16 archetype)
  planets: Record<string, number[]>;

  // Chart-level archetype vector (16 dims)
  archetypeVector: number[];

  // Aspect pattern vector (6 dims)
  // [grand_trine, t_square, stellium, yod, kite, opposition_chain]
  aspectPatternVector: number[];

  // Dominance vector (4 dims)
  // [sign_dominance, planet_dominance, house_dominance, overall]
  dominanceVector: number[];

  // Chart shape vector (6 dims)
  // [bowl, bucket, locomotive, splash, bundle, seesaw]
  chartShapeVector: number[];

  // Synastry receptivity (0-1)
  synastryReceptivity: number;

  // Cusp information (optional)
  cuspInfo?: {
    zone: string;
    primary: ZodiacSign;
    secondary: ZodiacSign;
    blendWeight: number;
  };

  // Dominant archetype traits
  dominantTraits?: Array<{
    axis: string;
    value: number;
    direction: string;
  }>;
}

/**
 * Enhanced compatibility score with all components.
 */
export interface EnhancedCompatibilityScore {
  total: number;  // 0-100

  // Component scores (0-100)
  elements: number;
  modalities: number;
  houses: number;
  planets: number;
  archetypes: number;
  patterns: number;
  dominance: number;
  shape: number;
  proximity: number;
  synastryReceptivity: number;

  // Raw similarity values (0-1)
  rawComponents: {
    elementsSim: number;
    modalitiesSim: number;
    housesSim: number;
    planetsSim: number;
    archetypesSim: number;
    patternsSim: number;
    dominanceSim: number;
    shapeSim: number;
    synastryReceptivitySim: number;
  };
}

/**
 * Enhanced section weights for compatibility calculation.
 */
export interface EnhancedSectionWeights {
  elements: number;
  modalities: number;
  houses: number;
  planets: number;
  archetypes: number;
  patterns: number;
  dominance: number;
  shape: number;
  proximity: number;
  synastryReceptivity: number;
}

export const DEFAULT_ENHANCED_SECTION_WEIGHTS: EnhancedSectionWeights = {
  elements: 0.20,
  modalities: 0.10,
  houses: 0.15,
  planets: 0.20,
  archetypes: 0.10,
  patterns: 0.05,
  dominance: 0.05,
  shape: 0.05,
  proximity: 0.05,
  synastryReceptivity: 0.05,
};

/**
 * Archetype comparison result.
 */
export interface ArchetypeComparisonResult {
  signA: ZodiacSign;
  signB: ZodiacSign;
  similarity: number;  // 0-1
  compatibilityPercent: number;  // 0-100
  significantDifferences: Array<{
    axis: string;
    signAValue: number;
    signBValue: number;
    difference: number;
  }>;
}

/**
 * Sign archetype profile.
 */
export interface ArchetypeProfile {
  sign: ZodiacSign;
  archetypeVector: number[];
  dominantTraits: Array<{
    axis: string;
    value: number;
    direction: string;
  }>;
  profile: Record<string, {
    value: number;
    strength: 'high' | 'moderate' | 'low';
  }>;
}

// =============================================================================
// PATTERN INFLUENCE VECTORS (16-axis archetype modifiers)
// =============================================================================

/**
 * Pattern types for aspect patterns.
 */
export type PatternType =
  | 'grand_trine'
  | 't_square'
  | 'stellium'
  | 'yod'
  | 'kite'
  | 'opposition_chain';

/**
 * Pattern strengths object - maps pattern types to their strength (0-1).
 */
export interface PatternStrengths {
  grand_trine: number;
  t_square: number;
  stellium: number;
  yod: number;
  kite: number;
  opposition_chain: number;
}

/**
 * Pattern influence vectors - 16-dimensional modifiers for each pattern type.
 * These represent how each pattern affects the 16 archetype axes.
 *
 * NEW AXIS ORDERING (matches Python):
 *   0: Initiator        - Drive to start, pioneer energy
 *   1: Stabilizer       - Capacity to maintain, preserve
 *   2: Relational       - Other-oriented, partnership
 *   3: MindCentered     - Mental/analytical
 *   4: Intuitive        - Feeling/symbolic, inner knowing
 *   5: Concrete         - Sensory/real, practical
 *   6: Expressive       - Outward display, communication
 *   7: Transpersonal    - Collective themes, universal
 *   8: RiskSeeking      - Exploration, adventure
 *   9: OrderOriented    - Need for structure, control
 *  10: FluidIdentity    - Adaptive identity, flexibility
 *  11: Warm             - Emotional warmth, empathy
 *  12: Direct           - Straightforward, transparent
 *  13: DepthOriented    - Psychological depth, intensity
 *  14: Sustainer        - Supportive/holding, nurturing
 *  15: BoundaryAware    - Clear limits, self-definition
 *
 * Formula: A_final = A_base + Σ(pattern_strength × pattern_influence_vector)
 * Values typically in range [-0.25, +0.25]
 */
export const PATTERN_INFLUENCE_VECTORS: Record<PatternType, number[]> = {
  // Grand Trine: The Hidden River - natural flow, coherence, ease
  // Key boosts: +Stabilizer, +OrderOriented, +Sustainer, +Initiator
  grand_trine: [
    +0.20, +0.25, +0.05, +0.05, +0.05, +0.10, +0.15, +0.05,
    -0.05, +0.20, -0.10, +0.10, +0.05, +0.10, +0.15, +0.10,
  ],

  // T-Square: The Sacred Friction - tension, drive, mastery through challenge
  // Key boosts: +RiskSeeking, +Direct, +DepthOriented, +Initiator
  // Key reductions: -Stabilizer, -Warm, -OrderOriented
  t_square: [
    +0.15, -0.15, +0.05, +0.10, -0.05, +0.05, +0.05, +0.10,
    +0.20, -0.15, +0.10, -0.10, +0.20, +0.20, -0.10, +0.05,
  ],

  // Stellium: The Chamber of Echoes - concentrated power, focus
  // Key boosts: +OrderOriented, +Concrete, +BoundaryAware
  // Key reductions: -FluidIdentity, -RiskSeeking
  stellium: [
    +0.05, +0.15, +0.00, +0.15, +0.00, +0.20, +0.10, +0.00,
    -0.10, +0.20, -0.15, +0.05, +0.10, +0.10, +0.05, +0.15,
  ],

  // Yod: The Finger of God - destiny pressure, course corrections
  // Key boosts: +Intuitive, +Transpersonal, +FluidIdentity
  // Key reductions: -OrderOriented, -MindCentered
  yod: [
    -0.05, +0.05, +0.10, -0.10, +0.25, -0.10, +0.05, +0.25,
    +0.10, -0.15, +0.20, +0.10, -0.15, +0.15, +0.05, -0.10,
  ],

  // Kite: The Banner That Catches Wind - directed talent, mission
  // Key boosts: +Initiator, +Expressive, +Transpersonal, +RiskSeeking
  kite: [
    +0.25, +0.10, +0.10, +0.05, +0.10, +0.05, +0.20, +0.15,
    +0.15, +0.10, +0.05, +0.15, +0.15, +0.10, +0.10, +0.10,
  ],

  // Opposition Chain: The Corridor of Mirrors - polarity, paradox
  // Key boosts: +Relational, +Intuitive, +FluidIdentity
  // Key reductions: -Direct, -Concrete, -BoundaryAware
  opposition_chain: [
    +0.00, +0.05, +0.20, -0.05, +0.15, -0.15, +0.05, +0.15,
    +0.10, -0.10, +0.20, +0.10, -0.20, +0.15, +0.10, -0.15,
  ],
};

/**
 * Pattern archetype names for persona narrative.
 */
export const PATTERN_ARCHETYPE_NAMES: Record<PatternType, string> = {
  grand_trine: 'Natural Flow Archetype',
  t_square: 'Sacred Tension Archetype',
  stellium: 'Focused Specialist Archetype',
  yod: 'Destiny-Marked Archetype',
  kite: 'Mission-Activated Archetype',
  opposition_chain: 'Paradox Weaver Archetype',
};

/**
 * Default weight for pattern influence on archetype vector.
 * Higher = patterns have more impact on final archetype.
 */
export const PATTERN_INFLUENCE_WEIGHT = 0.3;

/**
 * Result of applying pattern strengths to modify an archetype vector.
 */
export interface PatternModifiedArchetype {
  baseVector: number[];
  modifiedVector: number[];
  patternContributions: Record<PatternType, number[]>;
  dominantPatterns: PatternType[];
  archetypeName: string;
  dominantAxes: Array<{
    axis: string;
    value: number;
    direction: string;
  }>;
}

/**
 * Full pattern-aware persona model.
 */
export interface PatternPersona {
  sign: ZodiacSign;
  signArchetype: number[];
  patternStrengths: PatternStrengths;
  patternModifiedArchetype: number[];
  personaNarrative: string;
  dominantTraits: Array<{
    axis: string;
    value: number;
    direction: string;
  }>;
  patternSignature: string;
}

/**
 * Pattern compatibility result.
 */
export interface PatternCompatibilityResult {
  patternSimilarity: number;
  patternInterpretation: string;
  archetypeSimilarity: number;
  significantDifferences: Array<{
    axis: string;
    difference: number;
  }>;
  signatureA: string;
  signatureB: string;
  combinedNarrative: string;
}
