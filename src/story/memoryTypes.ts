/**
 * ============================================================================
 * CATHEDRAL MEMORY ENGINE - TYPE DEFINITIONS (大教堂记忆引擎类型)
 * ============================================================================
 *
 * The crypt beneath the cathedral.
 * Everything flows, moves, cycles, changes above.
 * This layer remembers.
 *
 * Four Memory Layers:
 * - Structural (结构记忆) - Charts, elements, archetypes
 * - Temporal (时序记忆) - Timing cycles, events, curves
 * - Narrative (叙事记忆) - Beats, chapters, arcs
 * - Pattern (模式记忆) - Recurring cycles, motifs, echoes
 *
 * This is where metaphysics becomes a living organism.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { StoryBeat, StoryChapter, EmotionalTone, BeatType } from './storyTypes';
import type { LifecyclePhase, RitualType, RitualWindow } from './ritualTypes';
import type { ActionStep, ActionType } from './actionTypes';
import type { SimulatedTimeline } from './simulationTypes';
import type { WovenStory, WeavingParticipant } from './weavingTypes';

// ============================================================================
// MEMORY LAYER TYPES
// ============================================================================

export type MemoryLayer = 'structural' | 'temporal' | 'narrative' | 'pattern';

export const MEMORY_LAYER_CHINESE: Record<MemoryLayer, string> = {
  structural: '结构记忆',
  temporal: '时序记忆',
  narrative: '叙事记忆',
  pattern: '模式记忆'
};

export const MEMORY_LAYER_DESCRIPTIONS: Record<MemoryLayer, {
  en: string;
  zh: string;
  purpose: string;
}> = {
  structural: {
    en: 'Structural Memory',
    zh: '结构记忆',
    purpose: 'Charts, elements, Ten Gods, archetypes - the foundation layer'
  },
  temporal: {
    en: 'Temporal Memory',
    zh: '时序记忆',
    purpose: 'Timing cycles, event triggers, destiny curves - the clockwork layer'
  },
  narrative: {
    en: 'Narrative Memory',
    zh: '叙事记忆',
    purpose: 'Beats, chapters, emotional arcs, turning points - the story layer'
  },
  pattern: {
    en: 'Pattern Memory',
    zh: '模式记忆',
    purpose: 'Recurring cycles, archetypal motifs, systemic echoes - the wisdom layer'
  }
};

// ============================================================================
// MASTER MEMORY CONTAINER
// ============================================================================

/**
 * The complete cathedral memory
 */
export interface CathedralMemory {
  id: string;
  version: string;

  // Four memory layers
  structural: StructuralMemory;
  temporal: TemporalMemory;
  narrative: NarrativeMemory;
  patterns: PatternMemory;

  // Metadata
  metadata: MemoryMetadata;
}

export interface MemoryMetadata {
  createdAt: string;
  updatedAt: string;
  lastAccessed: string;
  totalSnapshots: number;
  totalPatterns: number;
  healthScore: number;        // 0-100 memory integrity
}

// ============================================================================
// STRUCTURAL MEMORY (结构记忆)
// ============================================================================

/**
 * Static, foundational memory - charts, relationships, systems
 */
export interface StructuralMemory {
  charts: Record<string, ChartMemory>;
  relationships: Record<string, RelationshipMemory>;
  systems: Record<string, SystemMemory>;
}

/**
 * Memory of a single chart
 */
export interface ChartMemory {
  id: string;
  personId: string;
  personName: string;

  // Birth data
  birthData: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute?: number;
    timezone?: string;
    location?: string;
  };

  // Chart essence
  dayMaster: string;
  dayMasterElement: string;
  usefulGod: string;
  annoyingGod: string;

  // Pillar summary
  yearPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  dayPillar: { stem: string; branch: string };
  hourPillar: { stem: string; branch: string };

  // Element distribution
  elementDistribution: Record<string, number>;

  // Ten Gods
  tenGodProfile: Record<string, number>;

  // Archetypes
  primaryArchetype?: string;
  secondaryArchetypes?: string[];

  // Lifecycle
  currentLifecyclePhase?: LifecyclePhase;
  lifecycleProgress?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Memory of a relationship (synastry/composite)
 */
export interface RelationshipMemory {
  id: string;

  // Participants
  personA: string;        // Chart ID
  personB: string;        // Chart ID
  personAName: string;
  personBName: string;

  // Relationship type
  relationshipType: 'romantic' | 'family' | 'friendship' | 'professional' | 'other';
  relationshipLabel?: string;

  // Synastry essence
  synastryScore: number;
  compatibilityTier: 'excellent' | 'good' | 'neutral' | 'challenging';

  // Day Master interaction
  dayMasterInteraction: {
    personADayMaster: string;
    personBDayMaster: string;
    interactionType: string;
    harmony: number;
  };

  // Composite essence (if computed)
  compositeDayMaster?: string;
  compositeUsefulGod?: string;
  compositeTheme?: string;

  // Key synastry patterns
  synastryPatterns: string[];

  // Current phase
  currentPhase?: string;
  phaseProgress?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Memory of a system (family, team, polycule)
 */
export interface SystemMemory {
  id: string;
  systemName: string;
  systemType: 'family' | 'team' | 'polycule' | 'constellation' | 'other';

  // Participants
  participants: Array<{
    chartId: string;
    name: string;
    role: string;
    roleChinese?: string;
  }>;

  // Relationships within system
  relationshipIds: string[];

  // System dynamics
  systemDynamics: {
    centralFigure?: string;
    elementBalance: Record<string, number>;
    tensionPoints: string[];
    harmonyPoints: string[];
  };

  // Generational data (for families)
  generationalData?: {
    generations: number;
    eldestAncestor?: string;
    generationalPatterns: string[];
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TEMPORAL MEMORY (时序记忆)
// ============================================================================

/**
 * Time-based memory - cycles, events, curves
 */
export interface TemporalMemory {
  timingHistory: TimingSnapshot[];
  environmentalHistory: EnvironmentalSnapshot[];
  ritualHistory: RitualOutcome[];
  decisionHistory: DecisionRecord[];
}

/**
 * Snapshot of timing at a moment
 */
export interface TimingSnapshot {
  id: string;
  personId: string;

  // Timestamp
  date: string;
  dateChinese: string;

  // Luck pillar context
  daYunPillar?: { stem: string; branch: string };
  daYunStart?: number;
  daYunEnd?: number;

  // Annual context
  yearPillar: { stem: string; branch: string };
  yearElement: string;

  // Monthly context
  monthPillar: { stem: string; branch: string };
  monthElement: string;

  // Daily context
  dayPillar: { stem: string; branch: string };
  dayOfficer?: string;

  // Timing scores
  timingScore: number;
  favorabilityTier: 'excellent' | 'good' | 'neutral' | 'challenging';

  // Active energies
  usefulGodActive: boolean;
  annoyingGodActive: boolean;
  activeElements: string[];

  // Curve position
  curveValue: number;
  curveDirection: 'rising' | 'falling' | 'stable' | 'volatile';

  // Shen Sha
  activeShenSha: string[];

  // Metadata
  createdAt: string;
}

/**
 * Snapshot of environmental energies
 */
export interface EnvironmentalSnapshot {
  id: string;

  // Timestamp
  date: string;
  hour?: number;

  // Qi Men context
  qiMen: {
    palace: number;
    door: string;
    doorChinese: string;
    star: string;
    deity: string;
  };

  // Feng Shui context
  fengShui: {
    flyingStar: number;
    bestDirection: string;
    bestDirectionChinese: string;
    avoidDirection?: string;
    dominantElement: string;
  };

  // Environmental score
  environmentalScore: number;
  environmentalTier: 'excellent' | 'good' | 'neutral' | 'challenging';

  // Metadata
  createdAt: string;
}

/**
 * Record of a ritual window and its outcome
 */
export interface RitualOutcome {
  id: string;
  personId?: string;
  relationshipId?: string;

  // Ritual details
  ritualType: RitualType;
  ritualTypeChinese: string;

  // Timing
  scheduledDate: string;
  actualDate?: string;

  // Window quality
  windowScore: number;
  windowTier: 'golden' | 'silver' | 'bronze';

  // Outcome (if recorded)
  completed: boolean;
  outcomeRating?: number;      // 1-5 user rating
  outcomeNotes?: string;

  // Factors
  factors: Array<{
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
  }>;

  // Metadata
  createdAt: string;
  updatedAt?: string;
}

/**
 * Record of an action/decision
 */
export interface DecisionRecord {
  id: string;
  personId?: string;
  relationshipId?: string;

  // Action taken
  actionType: ActionType;
  actionTypeChinese: string;
  actionDescription: string;

  // Timing context
  date: string;
  timingScore: number;

  // Guidance context
  wasRecommended: boolean;
  recommendedAction?: ActionType;
  confidenceAtTime: number;

  // Outcome (if recorded)
  outcomeRating?: number;      // 1-5 user rating
  outcomeNotes?: string;

  // Learning
  lessonLearned?: string;

  // Metadata
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// NARRATIVE MEMORY (叙事记忆)
// ============================================================================

/**
 * Story-based memory - beats, chapters, arcs
 */
export interface NarrativeMemory {
  storyBeats: StoryBeatRecord[];
  storyChapters: StoryChapterRecord[];
  emotionalArcs: EmotionalArcRecord[];
  turningPoints: TurningPointRecord[];
  simulationBranches: SimulationBranchRecord[];
}

/**
 * Record of a story beat
 */
export interface StoryBeatRecord {
  id: string;
  storyId: string;
  personId?: string;
  relationshipId?: string;

  // Beat data (from StoryBeat)
  beatType: BeatType;
  beatTypeChinese: string;
  emotionalTone: EmotionalTone;
  emotionalToneChinese: string;

  // Timing
  startDate: string;
  endDate: string;

  // Narrative
  summary: string;
  intensity: number;

  // Verification
  verified: boolean;           // Did the user confirm this happened?
  userNotes?: string;

  // Metadata
  createdAt: string;
}

/**
 * Record of a story chapter
 */
export interface StoryChapterRecord {
  id: string;
  storyId: string;
  personId?: string;
  relationshipId?: string;

  // Chapter data
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleChinese?: string;
  arc: string;
  arcChinese: string;

  // Timing
  startDate: string;
  endDate: string;

  // Beats within
  beatIds: string[];

  // Emotional journey
  emotionalShift: {
    from: EmotionalTone;
    to: EmotionalTone;
  };

  // Themes
  themes: string[];

  // Verification
  verified: boolean;
  userNotes?: string;

  // Metadata
  createdAt: string;
}

/**
 * Record of an emotional arc
 */
export interface EmotionalArcRecord {
  id: string;
  personId?: string;
  relationshipId?: string;

  // Arc data
  arcType: string;             // e.g., 'rising-tension-healing-integration'
  arcTypeChinese?: string;

  // Timing
  startDate: string;
  endDate: string;
  duration: number;            // Days

  // Emotional journey
  emotionalSequence: EmotionalTone[];
  peakIntensity: number;
  peakDate: string;

  // Pattern match
  isRecurring: boolean;
  previousOccurrences?: string[];    // IDs of similar arcs

  // Metadata
  createdAt: string;
}

/**
 * Record of a turning point
 */
export interface TurningPointRecord {
  id: string;
  personId?: string;
  relationshipId?: string;

  // Turning point data
  date: string;
  dateChinese: string;

  // Type
  turningPointType: 'climax' | 'resolution' | 'reversal' | 'revelation' | 'decision';
  turningPointTypeChinese: string;

  // Context
  beforeState: string;
  afterState: string;
  triggerDescription: string;

  // Impact
  impactScore: number;         // 0-100
  lifecyclePhaseChange?: boolean;

  // Verification
  verified: boolean;
  userNotes?: string;

  // Metadata
  createdAt: string;
}

/**
 * Record of a simulation branch
 */
export interface SimulationBranchRecord {
  id: string;
  personId?: string;
  relationshipId?: string;

  // Simulation context
  simulationDate: string;      // When the simulation was run
  targetDate: string;          // Date being simulated

  // Choice/path simulated
  choiceDescription: string;
  choiceChinese?: string;

  // Outcomes
  branches: Array<{
    branchId: string;
    label: string;
    probability: number;
    predictedOutcome: string;
  }>;

  // Actual outcome (if later recorded)
  actualOutcome?: string;
  actualBranchId?: string;
  accuracyScore?: number;

  // Learning
  lessonLearned?: string;

  // Metadata
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// PATTERN MEMORY (模式记忆)
// ============================================================================

/**
 * Emergent pattern memory - cycles, motifs, echoes
 */
export interface PatternMemory {
  timingPatterns: TimingPattern[];
  emotionalPatterns: EmotionalPattern[];
  relationshipPatterns: RelationshipPattern[];
  generationalPatterns: GenerationalPattern[];
  archetypePatterns: ArchetypePattern[];
}

/**
 * Recurring timing pattern
 */
export interface TimingPattern {
  id: string;
  personId?: string;
  relationshipId?: string;

  // Pattern identification
  patternName: string;
  patternNameChinese?: string;
  patternType: 'cyclical' | 'seasonal' | 'elemental' | 'shensha' | 'composite';

  // Pattern description
  description: string;
  descriptionChinese?: string;

  // Timing signature
  signature: {
    triggerElements?: string[];
    triggerShenSha?: string[];
    triggerPhases?: LifecyclePhase[];
    cyclePeriod?: number;          // Days
    cycleUnit?: 'days' | 'months' | 'years';
  };

  // Occurrences
  occurrences: Array<{
    date: string;
    intensity: number;
    outcome: 'positive' | 'negative' | 'neutral';
  }>;

  // Confidence
  confidence: number;          // 0-100
  occurrenceCount: number;

  // Predictions
  nextPredictedOccurrence?: string;

  // Metadata
  discoveredAt: string;
  lastUpdated: string;
}

/**
 * Recurring emotional pattern
 */
export interface EmotionalPattern {
  id: string;
  personId?: string;
  relationshipId?: string;

  // Pattern identification
  patternName: string;
  patternNameChinese?: string;
  patternType: 'arc' | 'oscillation' | 'crescendo' | 'diminuendo' | 'cycle';

  // Emotional signature
  signature: {
    sequence: EmotionalTone[];
    averageDuration: number;       // Days
    peakIntensity: number;
    triggerContext?: string;
  };

  // Occurrences
  occurrences: Array<{
    startDate: string;
    endDate: string;
    matchScore: number;
  }>;

  // Confidence
  confidence: number;
  occurrenceCount: number;

  // Metadata
  discoveredAt: string;
  lastUpdated: string;
}

/**
 * Recurring relationship pattern
 */
export interface RelationshipPattern {
  id: string;
  relationshipId: string;

  // Pattern identification
  patternName: string;
  patternNameChinese?: string;
  patternType: 'communication' | 'conflict' | 'harmony' | 'growth' | 'distance';

  // Pattern description
  description: string;

  // Signature
  signature: {
    triggerDayMasterCombination?: string;
    triggerElements?: string[];
    triggerTiming?: string;
    cyclePeriod?: number;
    cycleUnit?: 'days' | 'months' | 'years';
  };

  // Occurrences
  occurrences: Array<{
    date: string;
    context: string;
    intensity: number;
    resolution?: string;
  }>;

  // Confidence
  confidence: number;
  occurrenceCount: number;

  // Advice
  whenThisHappens: string;
  bestResponse: ActionType;

  // Metadata
  discoveredAt: string;
  lastUpdated: string;
}

/**
 * Generational pattern (for family systems)
 */
export interface GenerationalPattern {
  id: string;
  systemId: string;

  // Pattern identification
  patternName: string;
  patternNameChinese?: string;
  patternType: 'inherited' | 'alternating' | 'ascending' | 'descending' | 'skip-generation';

  // Pattern description
  description: string;

  // Signature
  signature: {
    affectedElements?: string[];
    affectedTenGods?: string[];
    affectedArchetypes?: string[];
    generationSpan: number;
  };

  // Occurrences across generations
  occurrences: Array<{
    generation: number;
    personId: string;
    personName: string;
    manifestation: string;
  }>;

  // Confidence
  confidence: number;
  generationsObserved: number;

  // Healing opportunity
  healingOpportunity?: string;
  breakingPoint?: string;

  // Metadata
  discoveredAt: string;
  lastUpdated: string;
}

/**
 * Archetypal recurrence pattern
 */
export interface ArchetypePattern {
  id: string;
  personId?: string;
  relationshipId?: string;
  systemId?: string;

  // Pattern identification
  archetype: string;
  archetypeChinese?: string;
  patternType: 'hero-journey' | 'death-rebirth' | 'sacred-marriage' | 'initiation' | 'return';

  // Pattern description
  description: string;

  // Signature
  signature: {
    stages: string[];
    typicalDuration: number;
    durationUnit: 'months' | 'years';
    triggerConditions: string[];
  };

  // Occurrences
  occurrences: Array<{
    startDate: string;
    endDate?: string;
    currentStage: string;
    completionPercentage: number;
  }>;

  // Active instance
  isCurrentlyActive: boolean;
  currentInstanceId?: string;

  // Metadata
  discoveredAt: string;
  lastUpdated: string;
}

// ============================================================================
// MEMORY QUERY TYPES
// ============================================================================

/**
 * Options for querying memory
 */
export interface MemoryQueryOptions {
  // Filter by layer
  layers?: MemoryLayer[];

  // Filter by entity
  personId?: string;
  relationshipId?: string;
  systemId?: string;

  // Filter by time
  startDate?: string;
  endDate?: string;

  // Filter by type
  types?: string[];

  // Pagination
  limit?: number;
  offset?: number;

  // Sort
  sortBy?: 'date' | 'confidence' | 'intensity' | 'occurrences';
  sortOrder?: 'asc' | 'desc';

  // Include
  includeVerifiedOnly?: boolean;
  includePatterns?: boolean;
}

/**
 * Result of a memory query
 */
export interface MemoryQueryResult {
  // Results
  items: MemoryItem[];

  // Pagination
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;

  // Related patterns (if requested)
  relatedPatterns?: Array<{
    patternId: string;
    patternName: string;
    relevance: number;
  }>;

  // Metadata
  queryTime: number;
}

/**
 * A single memory item (union type)
 */
export type MemoryItem =
  | { type: 'chart'; data: ChartMemory }
  | { type: 'relationship'; data: RelationshipMemory }
  | { type: 'system'; data: SystemMemory }
  | { type: 'timing'; data: TimingSnapshot }
  | { type: 'environmental'; data: EnvironmentalSnapshot }
  | { type: 'ritual'; data: RitualOutcome }
  | { type: 'decision'; data: DecisionRecord }
  | { type: 'beat'; data: StoryBeatRecord }
  | { type: 'chapter'; data: StoryChapterRecord }
  | { type: 'arc'; data: EmotionalArcRecord }
  | { type: 'turningPoint'; data: TurningPointRecord }
  | { type: 'simulation'; data: SimulationBranchRecord }
  | { type: 'timingPattern'; data: TimingPattern }
  | { type: 'emotionalPattern'; data: EmotionalPattern }
  | { type: 'relationshipPattern'; data: RelationshipPattern }
  | { type: 'generationalPattern'; data: GenerationalPattern }
  | { type: 'archetypePattern'; data: ArchetypePattern };

// ============================================================================
// PATTERN EXTRACTION TYPES
// ============================================================================

/**
 * Options for pattern extraction
 */
export interface PatternExtractionOptions {
  // Minimum occurrences to identify pattern
  minOccurrences?: number;

  // Minimum confidence threshold
  minConfidence?: number;

  // Time window for analysis
  analysisWindow?: {
    startDate: string;
    endDate: string;
  };

  // Pattern types to extract
  patternTypes?: Array<'timing' | 'emotional' | 'relationship' | 'generational' | 'archetype'>;

  // Sensitivity
  sensitivity?: 'low' | 'medium' | 'high';
}

/**
 * Result of pattern extraction
 */
export interface PatternExtractionResult {
  // Discovered patterns
  timingPatterns: TimingPattern[];
  emotionalPatterns: EmotionalPattern[];
  relationshipPatterns: RelationshipPattern[];
  generationalPatterns: GenerationalPattern[];
  archetypePatterns: ArchetypePattern[];

  // Summary
  summary: {
    totalPatternsFound: number;
    highConfidencePatterns: number;
    newPatterns: number;
    updatedPatterns: number;
  };

  // Insights
  insights: PatternInsight[];

  // Metadata
  extractionTime: number;
  dataPointsAnalyzed: number;
}

/**
 * An insight derived from patterns
 */
export interface PatternInsight {
  id: string;

  // Insight content
  title: string;
  titleChinese?: string;
  description: string;
  descriptionChinese?: string;

  // Source patterns
  sourcePatternIds: string[];

  // Confidence
  confidence: number;

  // Type
  insightType: 'prediction' | 'warning' | 'opportunity' | 'healing' | 'growth';

  // Actionable
  recommendation?: string;
  recommendationChinese?: string;
}

// ============================================================================
// PREDICTIVE RECALL TYPES
// ============================================================================

/**
 * Input for predictive recall
 */
export interface PredictiveRecallInput {
  personId?: string;
  relationshipId?: string;
  systemId?: string;

  // Prediction target
  targetDate?: string;
  targetDateRange?: { start: string; end: string };

  // What to predict
  predictTypes?: Array<'timing' | 'emotional' | 'relationship' | 'lifecycle'>;

  // Use patterns
  usePatterns?: boolean;
  patternMinConfidence?: number;
}

/**
 * Result of predictive recall
 */
export interface PredictiveRecallResult {
  // Predictions
  predictions: Prediction[];

  // Supporting evidence
  supportingPatterns: Array<{
    patternId: string;
    patternName: string;
    contribution: number;
  }>;

  // Historical parallels
  historicalParallels: Array<{
    date: string;
    similarity: number;
    outcome: string;
  }>;

  // Confidence
  overallConfidence: number;

  // Metadata
  dataPointsUsed: number;
  patternsUsed: number;
}

/**
 * A single prediction
 */
export interface Prediction {
  id: string;

  // What is predicted
  predictionType: 'timing' | 'emotional' | 'relationship' | 'lifecycle' | 'event';

  // When
  targetDate: string;
  targetDateRange?: { start: string; end: string };

  // Prediction content
  prediction: string;
  predictionChinese?: string;

  // Quantified
  predictedValue?: number;
  predictedTone?: EmotionalTone;
  predictedPhase?: LifecyclePhase;

  // Confidence
  confidence: number;
  confidenceTier: 'high' | 'medium' | 'low';

  // Basis
  basis: string[];             // Pattern IDs or history IDs
}

// ============================================================================
// MEMORY ENGINE INPUT/OUTPUT
// ============================================================================

/**
 * Input for memory engine operations
 */
export interface MemoryEngineInput {
  operation: 'save' | 'query' | 'extract' | 'predict';

  // For save operations
  saveData?: {
    layer: MemoryLayer;
    type: string;
    data: unknown;
  };

  // For query operations
  queryOptions?: MemoryQueryOptions;

  // For extract operations
  extractOptions?: PatternExtractionOptions;

  // For predict operations
  predictInput?: PredictiveRecallInput;
}

/**
 * Output from memory engine operations
 */
export interface MemoryEngineResult {
  success: boolean;
  operation: string;

  // Results based on operation
  saved?: { id: string; layer: MemoryLayer; type: string };
  queryResult?: MemoryQueryResult;
  extractionResult?: PatternExtractionResult;
  predictionResult?: PredictiveRecallResult;

  // Errors
  error?: {
    code: string;
    message: string;
  };

  // Metadata
  metadata: {
    operationTime: number;
    memoryHealthScore: number;
  };
}

// ============================================================================
// MEMORY VAULT UI DATA
// ============================================================================

/**
 * Data for memory vault timeline view
 */
export interface MemoryTimelineData {
  // Date range
  startDate: string;
  endDate: string;

  // Timeline items
  items: Array<{
    id: string;
    date: string;
    type: string;
    typeChinese: string;
    title: string;
    layer: MemoryLayer;
    intensity: number;
    verified: boolean;
    color: string;
  }>;

  // Patterns overlay
  patternMarkers: Array<{
    patternId: string;
    patternName: string;
    occurrenceDates: string[];
    color: string;
  }>;
}

/**
 * Data for pattern view
 */
export interface PatternViewData {
  // Pattern categories
  categories: Array<{
    category: string;
    categoryChinese: string;
    patterns: Array<{
      id: string;
      name: string;
      nameChinese?: string;
      confidence: number;
      occurrences: number;
      lastOccurrence: string;
      nextPredicted?: string;
      color: string;
    }>;
  }>;

  // Summary stats
  stats: {
    totalPatterns: number;
    highConfidenceCount: number;
    activeCycles: number;
    upcomingPredictions: number;
  };
}

/**
 * Data for generational ladder view
 */
export interface GenerationalLadderViewData {
  systemId: string;
  systemName: string;

  // Generations
  generations: Array<{
    level: number;
    label: string;
    members: Array<{
      personId: string;
      name: string;
      birthYear: number;
      dayMaster: string;
      element: string;
      role: string;
    }>;
  }>;

  // Pattern overlays
  patternOverlays: Array<{
    patternId: string;
    patternName: string;
    affectedGenerations: number[];
    color: string;
    description: string;
  }>;
}

/**
 * Data for narrative archive view
 */
export interface NarrativeArchiveData {
  // Stories
  stories: Array<{
    id: string;
    title: string;
    personId?: string;
    relationshipId?: string;
    startDate: string;
    endDate: string;
    chapterCount: number;
    currentChapter: number;
    overallArc: string;
    verified: boolean;
  }>;

  // Turning points
  turningPoints: TurningPointRecord[];

  // Simulations
  simulations: Array<{
    id: string;
    date: string;
    choiceDescription: string;
    branchCount: number;
    actualOutcome?: string;
    accuracyScore?: number;
  }>;
}

