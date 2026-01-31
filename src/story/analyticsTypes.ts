/**
 * Cathedral Analytics Engine Types (大教堂分析引擎类型)
 *
 * The observatory tower of the cathedral — the place where all flows,
 * all stories, all timing cycles, all rituals, all simulations,
 * and all relationships become insight.
 *
 * Five Lenses:
 * 1. Timing Intelligence (时序智能)
 * 2. Story Intelligence (故事智能)
 * 3. Relationship Intelligence (关系智能)
 * 4. Systemic Intelligence (系统智能)
 * 5. Pattern Intelligence (模式智能)
 */

// ============================================================================
// 🜁 1. TIMING INTELLIGENCE (时序智能)
// ============================================================================

/**
 * Timing layers analyzed
 */
export type TimingLayerType =
  | 'annual'      // 流年
  | 'monthly'     // 流月
  | 'daily'       // 流日
  | 'hourly'      // 流时
  | 'micro'       // 微时
  | 'composite'   // 合盘时序
  | 'event'       // 事件触发
  | 'destiny';    // 命运曲线

/**
 * Timing volatility analysis
 */
export interface TimingVolatility {
  layer: TimingLayerType;
  period: { start: Date; end: Date };
  volatilityScore: number;     // 0-1, higher = more volatile
  swingAmplitude: number;      // Average score swing
  swingFrequency: number;      // Swings per period
  peakMoments: Date[];
  troughMoments: Date[];
  stability: 'stable' | 'moderate' | 'volatile' | 'chaotic';
}

/**
 * Timing resonance between layers
 */
export interface TimingResonance {
  layer1: TimingLayerType;
  layer2: TimingLayerType;
  resonanceScore: number;      // 0-1, higher = more aligned
  harmonicPoints: Date[];      // When layers align
  dissonantPoints: Date[];     // When layers conflict
  dominantLayer: TimingLayerType;
  resonancePattern: string;    // Description of pattern
}

/**
 * Timing risk window
 */
export interface TimingRiskWindow {
  id: string;
  start: Date;
  end: Date;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskFactors: TimingRiskFactor[];
  affectedDomains: string[];   // health, wealth, relationships, etc.
  mitigationSuggestions: string[];
}

/**
 * A risk factor in timing
 */
export interface TimingRiskFactor {
  type: 'clash' | 'harm' | 'punishment' | 'destruction' | 'weakness' | 'overload';
  source: string;              // Which element/branch
  target: string;
  severity: number;            // 0-1
  description: string;
}

/**
 * Timing opportunity cluster
 */
export interface TimingOpportunityCluster {
  id: string;
  start: Date;
  end: Date;
  opportunityLevel: 'minor' | 'moderate' | 'significant' | 'major';
  opportunityFactors: TimingOpportunityFactor[];
  optimalDomains: string[];
  peakMoment: Date;
  confidence: number;
}

/**
 * An opportunity factor in timing
 */
export interface TimingOpportunityFactor {
  type: 'combination' | 'nobleman' | 'star' | 'element_support' | 'cycle_peak';
  source: string;
  strength: number;            // 0-1
  description: string;
}

/**
 * Timing-story alignment
 */
export interface TimingStoryAlignment {
  timingWindow: { start: Date; end: Date };
  storyPhase: string;          // Current story beat/chapter
  alignmentScore: number;      // 0-1
  synergies: string[];         // What aligns well
  tensions: string[];          // What conflicts
  recommendation: string;
}

/**
 * Timing intelligence report
 */
export interface TimingIntelligenceReport {
  generatedAt: Date;
  period: { start: Date; end: Date };
  volatility: TimingVolatility[];
  resonances: TimingResonance[];
  riskWindows: TimingRiskWindow[];
  opportunityClusters: TimingOpportunityCluster[];
  storyAlignment: TimingStoryAlignment[];
  keyInsights: TimingInsight[];
  forecast: TimingForecast;
}

/**
 * A timing insight
 */
export interface TimingInsight {
  id: string;
  timestamp: Date;
  type: 'pattern' | 'anomaly' | 'opportunity' | 'risk' | 'alignment';
  severity: 'info' | 'notable' | 'important' | 'critical';
  title: string;
  description: string;
  affectedLayers: TimingLayerType[];
  confidence: number;
}

/**
 * Timing forecast
 */
export interface TimingForecast {
  horizon: 'week' | 'month' | 'quarter' | 'year';
  nextPeaks: { date: Date; layer: TimingLayerType; strength: number }[];
  nextTroughs: { date: Date; layer: TimingLayerType; severity: number }[];
  nextCycleShift: { date: Date; from: string; to: string };
  overallTrend: 'ascending' | 'stable' | 'descending' | 'volatile';
  confidence: number;
}

// ============================================================================
// 🜂 2. STORY INTELLIGENCE (故事智能)
// ============================================================================

/**
 * Story arc stability analysis
 */
export interface StoryArcStability {
  arcId: string;
  arcType: string;
  stabilityScore: number;      // 0-1, higher = more stable
  volatilityIndex: number;
  predictability: number;      // How predictable is the arc
  turningPointDensity: number; // Turning points per unit time
  emotionalRange: { min: number; max: number };
  dominantEmotion: string;
}

/**
 * Emotional arc predictability
 */
export interface EmotionalArcPredictability {
  arcId: string;
  period: { start: Date; end: Date };
  predictabilityScore: number;
  patternType: 'linear' | 'cyclical' | 'chaotic' | 'convergent' | 'divergent';
  nextPredictedPeak: { date: Date; value: number; confidence: number };
  nextPredictedTrough: { date: Date; value: number; confidence: number };
  deviationHistory: { date: Date; predicted: number; actual: number }[];
}

/**
 * Turning point analysis
 */
export interface TurningPointAnalysis {
  storyId: string;
  period: { start: Date; end: Date };
  turningPoints: TurningPoint[];
  density: number;             // Turning points per month
  averageIntensity: number;
  patterns: TurningPointPattern[];
  nextPredicted?: TurningPoint;
}

/**
 * A story turning point
 */
export interface TurningPoint {
  id: string;
  date: Date;
  type: 'crisis' | 'opportunity' | 'revelation' | 'decision' | 'transformation';
  intensity: number;           // 0-1
  emotionalShift: { from: number; to: number };
  triggerFactors: string[];
  archetypeInvolved: string;
  outcome: 'positive' | 'negative' | 'neutral' | 'transformative';
}

/**
 * Turning point pattern
 */
export interface TurningPointPattern {
  patternId: string;
  sequence: string[];          // Sequence of turning point types
  frequency: number;           // How often this pattern occurs
  averageCycleDuration: number; // Days between repetitions
  confidence: number;
}

/**
 * Archetype dominance analysis
 */
export interface ArchetypeDominance {
  period: { start: Date; end: Date };
  archetypes: ArchetypeScore[];
  dominantArchetype: string;
  emergingArchetype: string;
  fadingArchetype: string;
  archetypeFlow: { date: Date; archetype: string; strength: number }[];
}

/**
 * Archetype score
 */
export interface ArchetypeScore {
  archetype: string;
  score: number;
  trend: 'rising' | 'stable' | 'falling';
  peakMoments: Date[];
  alignedStoryBeats: string[];
}

/**
 * Narrative coherence analysis
 */
export interface NarrativeCoherence {
  storyId: string;
  coherenceScore: number;      // 0-1
  thematicConsistency: number;
  emotionalFlow: number;
  archetypeConsistency: number;
  plotHoles: NarrativeGap[];
  strengthAreas: string[];
  weaknessAreas: string[];
}

/**
 * A gap in the narrative
 */
export interface NarrativeGap {
  id: string;
  type: 'thematic' | 'emotional' | 'logical' | 'archetypal';
  location: { chapter: string; position: number };
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  suggestedResolution: string;
}

/**
 * Story intelligence report
 */
export interface StoryIntelligenceReport {
  generatedAt: Date;
  storyId: string;
  arcStability: StoryArcStability[];
  emotionalPredictability: EmotionalArcPredictability;
  turningPointAnalysis: TurningPointAnalysis;
  archetypeDominance: ArchetypeDominance;
  narrativeCoherence: NarrativeCoherence;
  crossStoryResonance: CrossStoryResonance[];
  keyInsights: StoryInsight[];
}

/**
 * Resonance between stories
 */
export interface CrossStoryResonance {
  story1Id: string;
  story2Id: string;
  resonanceScore: number;
  sharedThemes: string[];
  sharedArchetypes: string[];
  parallelBeats: { beat1: string; beat2: string; similarity: number }[];
}

/**
 * A story insight
 */
export interface StoryInsight {
  id: string;
  timestamp: Date;
  type: 'arc' | 'turning_point' | 'archetype' | 'coherence' | 'forecast';
  severity: 'info' | 'notable' | 'important' | 'critical';
  title: string;
  description: string;
  affectedChapters: string[];
  confidence: number;
}

// ============================================================================
// 🜃 3. RELATIONSHIP INTELLIGENCE (关系智能)
// ============================================================================

/**
 * Relationship stability index
 */
export interface RelationshipStabilityIndex {
  relationshipId: string;
  compositeId?: string;
  stabilityScore: number;      // 0-1
  volatilityIndex: number;
  resilienceScore: number;     // Ability to recover from conflict
  growthPotential: number;
  riskFactors: RelationshipRiskFactor[];
  stabilityTrend: 'improving' | 'stable' | 'declining';
}

/**
 * Relationship risk factor
 */
export interface RelationshipRiskFactor {
  type: 'elemental_clash' | 'lifecycle_mismatch' | 'communication_gap' | 'value_conflict' | 'timing_stress';
  severity: number;
  description: string;
  mitigation: string;
}

/**
 * Resonance score analysis
 */
export interface ResonanceScoreAnalysis {
  relationshipId: string;
  overallResonance: number;
  dimensions: ResonanceDimension[];
  harmonicPeaks: Date[];       // Best resonance moments
  dissonantTroughs: Date[];    // Worst resonance moments
  resonancePattern: string;
}

/**
 * A dimension of resonance
 */
export interface ResonanceDimension {
  name: string;                // emotional, intellectual, physical, spiritual
  score: number;
  trend: 'rising' | 'stable' | 'falling';
  strengthFactors: string[];
  weaknessFactors: string[];
}

/**
 * Conflict signature
 */
export interface ConflictSignature {
  relationshipId: string;
  primaryElement: string;      // Dominant element in conflicts
  triggerPatterns: ConflictTrigger[];
  escalationPattern: string;
  resolutionStyle: string;
  averageDuration: number;     // Average conflict duration
  frequency: number;           // Conflicts per month
  intensity: number;           // Average intensity
}

/**
 * A conflict trigger pattern
 */
export interface ConflictTrigger {
  trigger: string;
  frequency: number;
  timingCorrelation?: string;  // Associated timing pattern
  elementalCorrelation?: string;
}

/**
 * Healing signature
 */
export interface HealingSignature {
  relationshipId: string;
  primaryElement: string;      // Dominant element in healing
  healingPatterns: HealingPattern[];
  optimalApproach: string;
  healingSpeed: number;        // How quickly healing occurs
  deepHealingCapacity: number; // Ability to heal deep wounds
}

/**
 * A healing pattern
 */
export interface HealingPattern {
  pattern: string;
  effectiveness: number;
  timingCorrelation?: string;
  elementalSupport: string[];
}

/**
 * Commitment readiness analysis
 */
export interface CommitmentReadiness {
  relationshipId: string;
  readinessScore: number;
  individualReadiness: { personId: string; readiness: number }[];
  blockingFactors: string[];
  supportingFactors: string[];
  optimalWindow?: { start: Date; end: Date };
  recommendation: string;
}

/**
 * Relationship intelligence report
 */
export interface RelationshipIntelligenceReport {
  generatedAt: Date;
  relationshipId: string;
  stabilityIndex: RelationshipStabilityIndex;
  resonanceAnalysis: ResonanceScoreAnalysis;
  conflictSignature: ConflictSignature;
  healingSignature: HealingSignature;
  commitmentReadiness: CommitmentReadiness;
  lifecyclePosition: LifecyclePosition;
  ritualWindows: RitualWindowAnalysis[];
  keyInsights: RelationshipInsight[];
}

/**
 * Lifecycle position
 */
export interface LifecyclePosition {
  currentPhase: string;
  phaseProgress: number;       // 0-1 progress through phase
  nextPhase: string;
  transitionDate?: Date;
  phaseHealth: 'thriving' | 'healthy' | 'struggling' | 'critical';
}

/**
 * Ritual window analysis
 */
export interface RitualWindowAnalysis {
  ritualType: string;
  window: { start: Date; end: Date };
  strength: number;
  recommendation: string;
}

/**
 * A relationship insight
 */
export interface RelationshipInsight {
  id: string;
  timestamp: Date;
  type: 'stability' | 'resonance' | 'conflict' | 'healing' | 'growth' | 'risk';
  severity: 'info' | 'notable' | 'important' | 'critical';
  title: string;
  description: string;
  actionable: boolean;
  confidence: number;
}

// ============================================================================
// 🜄 4. SYSTEMIC INTELLIGENCE (系统智能)
// ============================================================================

/**
 * System types analyzed
 */
export type SystemType =
  | 'family'
  | 'team'
  | 'polycule'
  | 'community'
  | 'generational';

/**
 * Systemic tension map
 */
export interface SystemicTensionMap {
  systemId: string;
  systemType: SystemType;
  tensions: SystemicTension[];
  overallTensionLevel: number;
  hotspots: TensionHotspot[];
  reliefPoints: TensionReliefPoint[];
}

/**
 * A systemic tension
 */
export interface SystemicTension {
  id: string;
  between: string[];           // Node IDs involved
  type: 'elemental' | 'role' | 'boundary' | 'resource' | 'power' | 'loyalty';
  intensity: number;
  duration: number;            // How long tension has existed
  trend: 'escalating' | 'stable' | 'de-escalating';
  rootCause: string;
}

/**
 * A tension hotspot
 */
export interface TensionHotspot {
  nodeId: string;
  nodeName: string;
  tensionLoad: number;         // How much tension this node carries
  connectedTensions: string[]; // Tension IDs
  risk: 'low' | 'moderate' | 'high' | 'critical';
}

/**
 * A tension relief point
 */
export interface TensionReliefPoint {
  nodeId: string;
  nodeName: string;
  reliefCapacity: number;
  connectedNodes: string[];
  role: 'mediator' | 'harmonizer' | 'grounding' | 'transformer';
}

/**
 * Generational echo detection
 */
export interface GenerationalEchoAnalysis {
  systemId: string;
  echos: GenerationalEcho[];
  cycleLength: number;         // Generations per cycle
  currentPosition: string;     // Where in the cycle
  breakingPoints: string[];    // Potential cycle breakers
  reinforcingFactors: string[];
}

/**
 * A generational echo
 */
export interface GenerationalEcho {
  id: string;
  pattern: string;
  generations: string[];       // Which generations show this
  elementalSignature: string;
  manifestations: string[];
  healing: string;             // How to heal this pattern
}

/**
 * Team synergy cycle
 */
export interface TeamSynergyCycle {
  teamId: string;
  currentPhase: 'forming' | 'storming' | 'norming' | 'performing' | 'adjourning';
  phaseHealth: number;
  synergyScore: number;
  elementalBalance: Record<string, number>;
  roleDistribution: RoleDistribution[];
  nextPhaseTransition?: Date;
  optimizationSuggestions: string[];
}

/**
 * Role distribution in team
 */
export interface RoleDistribution {
  role: string;
  filledBy: string[];
  coverage: number;            // 0-1, how well the role is covered
  gaps: string[];
}

/**
 * Polycule emotional flow map
 */
export interface PolyculeEmotionalFlowMap {
  polyculeId: string;
  nodes: EmotionalFlowNode[];
  edges: EmotionalFlowEdge[];
  overallFlow: 'healthy' | 'blocked' | 'unbalanced' | 'chaotic';
  blockages: EmotionalBlockage[];
  flowEnhancers: string[];
}

/**
 * An emotional flow node
 */
export interface EmotionalFlowNode {
  id: string;
  name: string;
  emotionalCapacity: number;
  emotionalLoad: number;
  flowBalance: number;         // Positive = giving, negative = receiving
}

/**
 * An emotional flow edge
 */
export interface EmotionalFlowEdge {
  from: string;
  to: string;
  flowStrength: number;
  flowType: 'nurturing' | 'supportive' | 'draining' | 'mutual' | 'blocked';
  reciprocity: number;         // 0-1, how balanced the flow
}

/**
 * An emotional blockage
 */
export interface EmotionalBlockage {
  location: { from: string; to: string };
  type: 'fear' | 'resentment' | 'unspoken' | 'boundary' | 'trauma';
  severity: number;
  duration: number;
  healingPath: string;
}

/**
 * Family karmic loop
 */
export interface FamilyKarmicLoop {
  loopId: string;
  pattern: string;
  involvedGenerations: string[];
  elementalSignature: string;
  manifestations: KarmicManifestation[];
  breakingOpportunity: string;
  healingRitual: string;
}

/**
 * A karmic manifestation
 */
export interface KarmicManifestation {
  generation: string;
  personId: string;
  manifestation: string;
  severity: number;
}

/**
 * Systemic intelligence report
 */
export interface SystemicIntelligenceReport {
  generatedAt: Date;
  systemId: string;
  systemType: SystemType;
  tensionMap: SystemicTensionMap;
  generationalEchos?: GenerationalEchoAnalysis;
  synergyCycle?: TeamSynergyCycle;
  emotionalFlowMap?: PolyculeEmotionalFlowMap;
  karmicLoops?: FamilyKarmicLoop[];
  systemicTurningPoints: SystemicTurningPoint[];
  keyInsights: SystemicInsight[];
}

/**
 * A systemic turning point
 */
export interface SystemicTurningPoint {
  id: string;
  date: Date;
  type: 'structural' | 'relational' | 'generational' | 'karmic';
  description: string;
  impactedNodes: string[];
  outcome: 'transformative' | 'stabilizing' | 'destabilizing';
}

/**
 * A systemic insight
 */
export interface SystemicInsight {
  id: string;
  timestamp: Date;
  type: 'tension' | 'echo' | 'synergy' | 'flow' | 'karmic' | 'turning_point';
  severity: 'info' | 'notable' | 'important' | 'critical';
  title: string;
  description: string;
  affectedNodes: string[];
  confidence: number;
}

// ============================================================================
// 🜅 5. PATTERN INTELLIGENCE (模式智能)
// ============================================================================

/**
 * Pattern types
 */
export type PatternType =
  | 'timing'
  | 'emotional'
  | 'relationship'
  | 'ritual_outcome'
  | 'simulation_outcome'
  | 'generational'
  | 'archetypal';

/**
 * A detected pattern
 */
export interface DetectedPattern {
  id: string;
  type: PatternType;
  name: string;
  description: string;
  occurrences: PatternOccurrence[];
  frequency: number;           // Occurrences per time unit
  cycleDuration?: number;      // If cyclical, duration in days
  confidence: number;
  firstDetected: Date;
  lastOccurrence: Date;
  strength: number;            // 0-1
  trend: 'strengthening' | 'stable' | 'weakening' | 'emerging';
}

/**
 * A pattern occurrence
 */
export interface PatternOccurrence {
  date: Date;
  context: string;
  strength: number;
  outcome?: string;
}

/**
 * Pattern cluster
 */
export interface PatternCluster {
  id: string;
  name: string;
  patterns: string[];          // Pattern IDs
  cohesion: number;            // How tightly related
  sharedFactors: string[];
  dominantElement?: string;
  interpretation: string;
}

/**
 * Pattern forecast
 */
export interface PatternForecast {
  patternId: string;
  patternName: string;
  nextOccurrence: Date;
  confidence: number;
  expectedStrength: number;
  contextPrediction: string;
  preparationSuggestions: string[];
}

/**
 * Pattern anomaly
 */
export interface PatternAnomaly {
  id: string;
  patternId: string;
  detectedAt: Date;
  type: 'missing' | 'early' | 'late' | 'intensity' | 'context' | 'new';
  description: string;
  deviation: number;           // How much it deviated
  significance: 'low' | 'moderate' | 'high';
  possibleCauses: string[];
}

/**
 * Pattern evolution
 */
export interface PatternEvolution {
  patternId: string;
  period: { start: Date; end: Date };
  strengthHistory: { date: Date; strength: number }[];
  frequencyHistory: { date: Date; frequency: number }[];
  mutations: PatternMutation[];
  forecast: 'continuing' | 'transforming' | 'fading' | 'merging';
}

/**
 * A pattern mutation
 */
export interface PatternMutation {
  date: Date;
  type: 'intensity' | 'timing' | 'context' | 'merge' | 'split';
  description: string;
  from: string;
  to: string;
}

/**
 * Pattern-story alignment
 */
export interface PatternStoryAlignment {
  patternId: string;
  storyId: string;
  alignmentScore: number;
  alignedBeats: string[];
  predictedBeats: string[];
  narrativeImpact: string;
}

/**
 * Pattern-timing alignment
 */
export interface PatternTimingAlignment {
  patternId: string;
  timingLayers: TimingLayerType[];
  alignmentScore: number;
  triggerWindows: { start: Date; end: Date }[];
  suppressionWindows: { start: Date; end: Date }[];
}

/**
 * Pattern intelligence report
 */
export interface PatternIntelligenceReport {
  generatedAt: Date;
  period: { start: Date; end: Date };
  detectedPatterns: DetectedPattern[];
  patternClusters: PatternCluster[];
  forecasts: PatternForecast[];
  anomalies: PatternAnomaly[];
  evolutions: PatternEvolution[];
  storyAlignments: PatternStoryAlignment[];
  timingAlignments: PatternTimingAlignment[];
  keyInsights: PatternInsight[];
}

/**
 * A pattern insight
 */
export interface PatternInsight {
  id: string;
  timestamp: Date;
  type: 'discovery' | 'forecast' | 'anomaly' | 'evolution' | 'alignment';
  severity: 'info' | 'notable' | 'important' | 'critical';
  title: string;
  description: string;
  affectedPatterns: string[];
  confidence: number;
}

// ============================================================================
// ANALYTICS OUTPUT TYPES
// ============================================================================

/**
 * Metric types
 */
export type MetricType =
  | 'timing_strength'
  | 'story_coherence'
  | 'ritual_alignment'
  | 'relationship_stability'
  | 'systemic_tension'
  | 'pattern_density';

/**
 * An analytics metric
 */
export interface AnalyticsMetric {
  type: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  trend: 'rising' | 'stable' | 'falling';
  benchmark?: number;
  context?: string;
}

/**
 * An insight
 */
export interface AnalyticsInsight {
  id: string;
  timestamp: Date;
  lens: 'timing' | 'story' | 'relationship' | 'systemic' | 'pattern';
  type: string;
  severity: 'info' | 'notable' | 'important' | 'critical';
  title: string;
  description: string;
  affectedComponents: string[];
  confidence: number;
  actionable: boolean;
  recommendation?: string;
}

/**
 * A forecast
 */
export interface AnalyticsForecast {
  id: string;
  generatedAt: Date;
  lens: 'timing' | 'story' | 'relationship' | 'systemic' | 'pattern';
  horizon: 'day' | 'week' | 'month' | 'quarter' | 'year';
  predictions: ForecastPrediction[];
  confidence: number;
  caveats: string[];
}

/**
 * A forecast prediction
 */
export interface ForecastPrediction {
  aspect: string;
  predictedValue: number | string | Date;
  confidence: number;
  range?: { min: number | Date; max: number | Date };
  factors: string[];
}

/**
 * A recommendation (interpretive, not prescriptive)
 */
export interface AnalyticsRecommendation {
  id: string;
  timestamp: Date;
  lens: 'timing' | 'story' | 'relationship' | 'systemic' | 'pattern';
  type: 'awareness' | 'preparation' | 'opportunity' | 'caution';
  title: string;
  description: string;
  basedOn: string[];           // Insight IDs
  priority: 'low' | 'medium' | 'high';
}

// ============================================================================
// OBSERVATORY UI (天文台)
// ============================================================================

/**
 * Observatory panel types
 */
export type ObservatoryPanel =
  | 'insight_stream'
  | 'pattern_map'
  | 'timing_heatmap'
  | 'story_intelligence'
  | 'relationship_intelligence'
  | 'systemic_intelligence'
  | 'forecast';

/**
 * Insight stream entry
 */
export interface InsightStreamEntry {
  insight: AnalyticsInsight;
  acknowledged: boolean;
  pinned: boolean;
  relatedInsights: string[];
}

/**
 * Pattern map node
 */
export interface PatternMapNode {
  patternId: string;
  patternName: string;
  type: PatternType;
  size: number;                // Based on strength
  color: string;               // Based on type
  position: { x: number; y: number };
  connections: string[];
}

/**
 * Timing heatmap cell
 */
export interface TimingHeatmapCell {
  date: Date;
  layer: TimingLayerType;
  value: number;
  label: string;
  color: string;
  details: string;
}

/**
 * Observatory state
 */
export interface ObservatoryState {
  activePanel: ObservatoryPanel;
  timeRange: { start: Date; end: Date };
  filters: ObservatoryFilters;
  insightStream: InsightStreamEntry[];
  patternMap: PatternMapNode[];
  timingHeatmap: TimingHeatmapCell[][];
  metrics: AnalyticsMetric[];
  forecasts: AnalyticsForecast[];
  recommendations: AnalyticsRecommendation[];
}

/**
 * Observatory filters
 */
export interface ObservatoryFilters {
  lenses: ('timing' | 'story' | 'relationship' | 'systemic' | 'pattern')[];
  severityMin: 'info' | 'notable' | 'important' | 'critical';
  confidenceMin: number;
  showAcknowledged: boolean;
  showPinned: boolean;
}

// ============================================================================
// ANALYTICS ENGINE STATE
// ============================================================================

/**
 * Analytics pipeline configuration
 */
export interface AnalyticsPipelineConfig {
  enabled: boolean;
  autoRefresh: boolean;
  refreshIntervalMs: number;
  enabledLenses: ('timing' | 'story' | 'relationship' | 'systemic' | 'pattern')[];
  forecastHorizon: 'week' | 'month' | 'quarter' | 'year';
  patternDetectionThreshold: number;
  insightConfidenceThreshold: number;
  maxInsightsPerRefresh: number;
}

/**
 * Complete analytics engine state
 */
export interface AnalyticsEngineState {
  // Configuration
  pipelineConfig: AnalyticsPipelineConfig;

  // Reports
  timingReport?: TimingIntelligenceReport;
  storyReport?: StoryIntelligenceReport;
  relationshipReports: Map<string, RelationshipIntelligenceReport>;
  systemicReports: Map<string, SystemicIntelligenceReport>;
  patternReport?: PatternIntelligenceReport;

  // Observatory
  observatory: ObservatoryState;

  // Metadata
  isRunning: boolean;
  lastRefresh: Date;
  totalInsightsGenerated: number;
  totalPatternsDetected: number;
}

// ============================================================================
// CHINESE LABELS
// ============================================================================

export const LENS_CHINESE: Record<string, string> = {
  timing: '时序智能',
  story: '故事智能',
  relationship: '关系智能',
  systemic: '系统智能',
  pattern: '模式智能',
};

export const LENS_DESCRIPTIONS: Record<string, string> = {
  timing: 'Analyzes all timing layers to reveal volatility, resonance, risk windows, and opportunity clusters',
  story: 'Analyzes story arcs, emotional predictability, turning points, and narrative coherence',
  relationship: 'Analyzes stability, resonance, conflict signatures, and healing signatures',
  systemic: 'Analyzes family, team, polycule networks, and generational patterns',
  pattern: 'Reads the Cathedral Memory to extract timing, emotional, and archetypal patterns',
};

export const TIMING_LAYER_CHINESE: Record<TimingLayerType, string> = {
  annual: '流年',
  monthly: '流月',
  daily: '流日',
  hourly: '流时',
  micro: '微时',
  composite: '合盘时序',
  event: '事件触发',
  destiny: '命运曲线',
};

export const SYSTEM_TYPE_CHINESE: Record<SystemType, string> = {
  family: '家庭系统',
  team: '团队系统',
  polycule: '多边关系系统',
  community: '社区系统',
  generational: '世代系统',
};

export const PATTERN_TYPE_CHINESE: Record<PatternType, string> = {
  timing: '时序模式',
  emotional: '情感模式',
  relationship: '关系模式',
  ritual_outcome: '仪式结果模式',
  simulation_outcome: '模拟结果模式',
  generational: '世代模式',
  archetypal: '原型模式',
};

export const OBSERVATORY_PANEL_CHINESE: Record<ObservatoryPanel, string> = {
  insight_stream: '洞察流',
  pattern_map: '模式图',
  timing_heatmap: '时序热图',
  story_intelligence: '故事智能面板',
  relationship_intelligence: '关系智能面板',
  systemic_intelligence: '系统智能面板',
  forecast: '预测面板',
};

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_ANALYTICS_PIPELINE_CONFIG: AnalyticsPipelineConfig = {
  enabled: true,
  autoRefresh: true,
  refreshIntervalMs: 5 * 60 * 1000, // 5 minutes
  enabledLenses: ['timing', 'story', 'relationship', 'systemic', 'pattern'],
  forecastHorizon: 'month',
  patternDetectionThreshold: 0.7,
  insightConfidenceThreshold: 0.6,
  maxInsightsPerRefresh: 20,
};

export const DEFAULT_OBSERVATORY_FILTERS: ObservatoryFilters = {
  lenses: ['timing', 'story', 'relationship', 'systemic', 'pattern'],
  severityMin: 'info',
  confidenceMin: 0.5,
  showAcknowledged: false,
  showPinned: true,
};
