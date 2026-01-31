/**
 * ============================================================================
 * CATHEDRAL MEMORY ENGINE (大教堂记忆引擎)
 * ============================================================================
 *
 * The crypt beneath the cathedral.
 * The layer that remembers, learns, and predicts.
 *
 * Functions:
 * - Write Memory: Save snapshots, beats, rituals, decisions
 * - Read Memory: Query histories and patterns
 * - Extract Patterns: Discover recurring cycles
 * - Predictive Recall: Forecast based on patterns
 *
 * This is where destiny becomes a living memory field.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { StoryBeat, StoryChapter, EmotionalTone, BeatType } from './storyTypes';
import type { LifecyclePhase, RitualType } from './ritualTypes';
import type { ActionType } from './actionTypes';

import type {
  // Memory structures
  CathedralMemory,
  StructuralMemory,
  TemporalMemory,
  NarrativeMemory,
  PatternMemory,
  MemoryMetadata,
  MemoryLayer,

  // Structural types
  ChartMemory,
  RelationshipMemory,
  SystemMemory,

  // Temporal types
  TimingSnapshot,
  EnvironmentalSnapshot,
  RitualOutcome,
  DecisionRecord,

  // Narrative types
  StoryBeatRecord,
  StoryChapterRecord,
  EmotionalArcRecord,
  TurningPointRecord,
  SimulationBranchRecord,

  // Pattern types
  TimingPattern,
  EmotionalPattern,
  RelationshipPattern,
  GenerationalPattern,
  ArchetypePattern,

  // Query types
  MemoryQueryOptions,
  MemoryQueryResult,
  MemoryItem,

  // Extraction types
  PatternExtractionOptions,
  PatternExtractionResult,
  PatternInsight,

  // Prediction types
  PredictiveRecallInput,
  PredictiveRecallResult,
  Prediction,

  // Engine I/O
  MemoryEngineInput,
  MemoryEngineResult,

  // UI Data types
  MemoryTimelineData,
  PatternViewData,
  GenerationalLadderViewData,
  NarrativeArchiveData
} from './memoryTypes';

// ============================================================================
// MEMORY STORE (In-memory implementation)
// ============================================================================

/**
 * In-memory store for cathedral memory
 * In production, this would be backed by a database
 */
let memoryStore: CathedralMemory = createEmptyMemory();

function createEmptyMemory(): CathedralMemory {
  return {
    id: generateId('mem'),
    version: '1.0.0',
    structural: {
      charts: {},
      relationships: {},
      systems: {}
    },
    temporal: {
      timingHistory: [],
      environmentalHistory: [],
      ritualHistory: [],
      decisionHistory: []
    },
    narrative: {
      storyBeats: [],
      storyChapters: [],
      emotionalArcs: [],
      turningPoints: [],
      simulationBranches: []
    },
    patterns: {
      timingPatterns: [],
      emotionalPatterns: [],
      relationshipPatterns: [],
      generationalPatterns: [],
      archetypePatterns: []
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      totalSnapshots: 0,
      totalPatterns: 0,
      healthScore: 100
    }
  };
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================================
// WRITE MEMORY FUNCTIONS
// ============================================================================

/**
 * Save a chart to structural memory
 */
export function saveChart(chart: ChartMemory): { id: string; success: boolean } {
  const id = chart.id || generateId('chart');
  const chartWithId = { ...chart, id, updatedAt: new Date().toISOString() };

  memoryStore.structural.charts[id] = chartWithId;
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a relationship to structural memory
 */
export function saveRelationship(relationship: RelationshipMemory): { id: string; success: boolean } {
  const id = relationship.id || generateId('rel');
  const relWithId = { ...relationship, id, updatedAt: new Date().toISOString() };

  memoryStore.structural.relationships[id] = relWithId;
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a system to structural memory
 */
export function saveSystem(system: SystemMemory): { id: string; success: boolean } {
  const id = system.id || generateId('sys');
  const sysWithId = { ...system, id, updatedAt: new Date().toISOString() };

  memoryStore.structural.systems[id] = sysWithId;
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a timing snapshot
 */
export function saveTimingSnapshot(snapshot: Omit<TimingSnapshot, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('timing');
  const fullSnapshot: TimingSnapshot = {
    ...snapshot,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.temporal.timingHistory.push(fullSnapshot);
  memoryStore.metadata.totalSnapshots++;
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save an environmental snapshot
 */
export function saveEnvironmentalSnapshot(snapshot: Omit<EnvironmentalSnapshot, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('env');
  const fullSnapshot: EnvironmentalSnapshot = {
    ...snapshot,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.temporal.environmentalHistory.push(fullSnapshot);
  memoryStore.metadata.totalSnapshots++;
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a ritual outcome
 */
export function saveRitualOutcome(outcome: Omit<RitualOutcome, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('ritual');
  const fullOutcome: RitualOutcome = {
    ...outcome,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.temporal.ritualHistory.push(fullOutcome);
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a decision record
 */
export function saveDecision(decision: Omit<DecisionRecord, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('decision');
  const fullDecision: DecisionRecord = {
    ...decision,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.temporal.decisionHistory.push(fullDecision);
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a story beat record
 */
export function saveStoryBeat(beat: Omit<StoryBeatRecord, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('beat');
  const fullBeat: StoryBeatRecord = {
    ...beat,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.narrative.storyBeats.push(fullBeat);
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a story chapter record
 */
export function saveStoryChapter(chapter: Omit<StoryChapterRecord, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('chapter');
  const fullChapter: StoryChapterRecord = {
    ...chapter,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.narrative.storyChapters.push(fullChapter);
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save an emotional arc record
 */
export function saveEmotionalArc(arc: Omit<EmotionalArcRecord, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('arc');
  const fullArc: EmotionalArcRecord = {
    ...arc,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.narrative.emotionalArcs.push(fullArc);
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a turning point record
 */
export function saveTurningPoint(tp: Omit<TurningPointRecord, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('tp');
  const fullTp: TurningPointRecord = {
    ...tp,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.narrative.turningPoints.push(fullTp);
  updateMemoryMetadata();

  return { id, success: true };
}

/**
 * Save a simulation branch record
 */
export function saveSimulationBranch(sim: Omit<SimulationBranchRecord, 'id' | 'createdAt'>): { id: string; success: boolean } {
  const id = generateId('sim');
  const fullSim: SimulationBranchRecord = {
    ...sim,
    id,
    createdAt: new Date().toISOString()
  };

  memoryStore.narrative.simulationBranches.push(fullSim);
  updateMemoryMetadata();

  return { id, success: true };
}

function updateMemoryMetadata(): void {
  memoryStore.metadata.updatedAt = new Date().toISOString();
  memoryStore.metadata.lastAccessed = new Date().toISOString();
  memoryStore.metadata.totalPatterns =
    memoryStore.patterns.timingPatterns.length +
    memoryStore.patterns.emotionalPatterns.length +
    memoryStore.patterns.relationshipPatterns.length +
    memoryStore.patterns.generationalPatterns.length +
    memoryStore.patterns.archetypePatterns.length;
}

// ============================================================================
// READ MEMORY FUNCTIONS
// ============================================================================

/**
 * Get complete memory state
 */
export function getMemory(): CathedralMemory {
  memoryStore.metadata.lastAccessed = new Date().toISOString();
  return memoryStore;
}

/**
 * Get chart by ID
 */
export function getChart(chartId: string): ChartMemory | undefined {
  return memoryStore.structural.charts[chartId];
}

/**
 * Get all charts for a person
 */
export function getChartsByPerson(personId: string): ChartMemory[] {
  return Object.values(memoryStore.structural.charts).filter(c => c.personId === personId);
}

/**
 * Get relationship by ID
 */
export function getRelationship(relationshipId: string): RelationshipMemory | undefined {
  return memoryStore.structural.relationships[relationshipId];
}

/**
 * Get all relationships for a person
 */
export function getRelationshipsByPerson(personId: string): RelationshipMemory[] {
  return Object.values(memoryStore.structural.relationships).filter(
    r => r.personA === personId || r.personB === personId
  );
}

/**
 * Get timing history for a person
 */
export function getTimingHistory(personId: string, options?: { startDate?: string; endDate?: string; limit?: number }): TimingSnapshot[] {
  let history = memoryStore.temporal.timingHistory.filter(t => t.personId === personId);

  if (options?.startDate) {
    history = history.filter(t => t.date >= options.startDate!);
  }
  if (options?.endDate) {
    history = history.filter(t => t.date <= options.endDate!);
  }

  history.sort((a, b) => a.date.localeCompare(b.date));

  if (options?.limit) {
    history = history.slice(-options.limit);
  }

  return history;
}

/**
 * Get story history for a person or relationship
 */
export function getStoryHistory(
  entityId: string,
  entityType: 'person' | 'relationship' = 'person'
): { beats: StoryBeatRecord[]; chapters: StoryChapterRecord[] } {
  const filterFn = entityType === 'person'
    ? (item: { personId?: string }) => item.personId === entityId
    : (item: { relationshipId?: string }) => item.relationshipId === entityId;

  const beats = memoryStore.narrative.storyBeats.filter(filterFn);
  const chapters = memoryStore.narrative.storyChapters.filter(filterFn);

  return { beats, chapters };
}

/**
 * Get pattern history for an entity
 */
export function getPatternHistory(
  entityId: string,
  entityType: 'person' | 'relationship' | 'system' = 'person'
): PatternMemory {
  const filterFn = (pattern: { personId?: string; relationshipId?: string; systemId?: string }) => {
    if (entityType === 'person') return pattern.personId === entityId;
    if (entityType === 'relationship') return pattern.relationshipId === entityId;
    if (entityType === 'system') return pattern.systemId === entityId;
    return false;
  };

  return {
    timingPatterns: memoryStore.patterns.timingPatterns.filter(p => filterFn(p)),
    emotionalPatterns: memoryStore.patterns.emotionalPatterns.filter(p => filterFn(p)),
    relationshipPatterns: memoryStore.patterns.relationshipPatterns.filter(p => p.relationshipId === entityId),
    generationalPatterns: memoryStore.patterns.generationalPatterns.filter(p => p.systemId === entityId),
    archetypePatterns: memoryStore.patterns.archetypePatterns.filter(p => filterFn(p))
  };
}

/**
 * Query memory with options
 */
export function queryMemory(options: MemoryQueryOptions): MemoryQueryResult {
  const startTime = Date.now();
  let items: MemoryItem[] = [];

  const layers = options.layers || ['structural', 'temporal', 'narrative', 'pattern'];

  // Collect items from each layer
  if (layers.includes('structural')) {
    items = items.concat(collectStructuralItems(options));
  }
  if (layers.includes('temporal')) {
    items = items.concat(collectTemporalItems(options));
  }
  if (layers.includes('narrative')) {
    items = items.concat(collectNarrativeItems(options));
  }
  if (layers.includes('pattern')) {
    items = items.concat(collectPatternItems(options));
  }

  // Sort
  items = sortMemoryItems(items, options.sortBy || 'date', options.sortOrder || 'desc');

  // Paginate
  const total = items.length;
  const offset = options.offset || 0;
  const limit = options.limit || 50;
  items = items.slice(offset, offset + limit);

  return {
    items,
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
    queryTime: Date.now() - startTime
  };
}

function collectStructuralItems(options: MemoryQueryOptions): MemoryItem[] {
  const items: MemoryItem[] = [];

  // Charts
  for (const chart of Object.values(memoryStore.structural.charts)) {
    if (options.personId && chart.personId !== options.personId) continue;
    items.push({ type: 'chart', data: chart });
  }

  // Relationships
  for (const rel of Object.values(memoryStore.structural.relationships)) {
    if (options.relationshipId && rel.id !== options.relationshipId) continue;
    if (options.personId && rel.personA !== options.personId && rel.personB !== options.personId) continue;
    items.push({ type: 'relationship', data: rel });
  }

  // Systems
  for (const sys of Object.values(memoryStore.structural.systems)) {
    if (options.systemId && sys.id !== options.systemId) continue;
    items.push({ type: 'system', data: sys });
  }

  return items;
}

function collectTemporalItems(options: MemoryQueryOptions): MemoryItem[] {
  const items: MemoryItem[] = [];
  const { startDate, endDate, personId, relationshipId } = options;

  // Timing snapshots
  for (const snapshot of memoryStore.temporal.timingHistory) {
    if (personId && snapshot.personId !== personId) continue;
    if (startDate && snapshot.date < startDate) continue;
    if (endDate && snapshot.date > endDate) continue;
    items.push({ type: 'timing', data: snapshot });
  }

  // Environmental snapshots
  for (const snapshot of memoryStore.temporal.environmentalHistory) {
    if (startDate && snapshot.date < startDate) continue;
    if (endDate && snapshot.date > endDate) continue;
    items.push({ type: 'environmental', data: snapshot });
  }

  // Ritual outcomes
  for (const outcome of memoryStore.temporal.ritualHistory) {
    if (personId && outcome.personId !== personId) continue;
    if (relationshipId && outcome.relationshipId !== relationshipId) continue;
    if (startDate && outcome.scheduledDate < startDate) continue;
    if (endDate && outcome.scheduledDate > endDate) continue;
    items.push({ type: 'ritual', data: outcome });
  }

  // Decision records
  for (const decision of memoryStore.temporal.decisionHistory) {
    if (personId && decision.personId !== personId) continue;
    if (relationshipId && decision.relationshipId !== relationshipId) continue;
    if (startDate && decision.date < startDate) continue;
    if (endDate && decision.date > endDate) continue;
    items.push({ type: 'decision', data: decision });
  }

  return items;
}

function collectNarrativeItems(options: MemoryQueryOptions): MemoryItem[] {
  const items: MemoryItem[] = [];
  const { startDate, endDate, personId, relationshipId, includeVerifiedOnly } = options;

  // Story beats
  for (const beat of memoryStore.narrative.storyBeats) {
    if (personId && beat.personId !== personId) continue;
    if (relationshipId && beat.relationshipId !== relationshipId) continue;
    if (startDate && beat.startDate < startDate) continue;
    if (endDate && beat.endDate > endDate) continue;
    if (includeVerifiedOnly && !beat.verified) continue;
    items.push({ type: 'beat', data: beat });
  }

  // Story chapters
  for (const chapter of memoryStore.narrative.storyChapters) {
    if (personId && chapter.personId !== personId) continue;
    if (relationshipId && chapter.relationshipId !== relationshipId) continue;
    if (startDate && chapter.startDate < startDate) continue;
    if (endDate && chapter.endDate > endDate) continue;
    if (includeVerifiedOnly && !chapter.verified) continue;
    items.push({ type: 'chapter', data: chapter });
  }

  // Emotional arcs
  for (const arc of memoryStore.narrative.emotionalArcs) {
    if (personId && arc.personId !== personId) continue;
    if (relationshipId && arc.relationshipId !== relationshipId) continue;
    if (startDate && arc.startDate < startDate) continue;
    if (endDate && arc.endDate > endDate) continue;
    items.push({ type: 'arc', data: arc });
  }

  // Turning points
  for (const tp of memoryStore.narrative.turningPoints) {
    if (personId && tp.personId !== personId) continue;
    if (relationshipId && tp.relationshipId !== relationshipId) continue;
    if (startDate && tp.date < startDate) continue;
    if (endDate && tp.date > endDate) continue;
    if (includeVerifiedOnly && !tp.verified) continue;
    items.push({ type: 'turningPoint', data: tp });
  }

  // Simulation branches
  for (const sim of memoryStore.narrative.simulationBranches) {
    if (personId && sim.personId !== personId) continue;
    if (relationshipId && sim.relationshipId !== relationshipId) continue;
    if (startDate && sim.simulationDate < startDate) continue;
    if (endDate && sim.simulationDate > endDate) continue;
    items.push({ type: 'simulation', data: sim });
  }

  return items;
}

function collectPatternItems(options: MemoryQueryOptions): MemoryItem[] {
  const items: MemoryItem[] = [];
  const { personId, relationshipId, systemId } = options;

  // Timing patterns
  for (const pattern of memoryStore.patterns.timingPatterns) {
    if (personId && pattern.personId !== personId) continue;
    if (relationshipId && pattern.relationshipId !== relationshipId) continue;
    items.push({ type: 'timingPattern', data: pattern });
  }

  // Emotional patterns
  for (const pattern of memoryStore.patterns.emotionalPatterns) {
    if (personId && pattern.personId !== personId) continue;
    if (relationshipId && pattern.relationshipId !== relationshipId) continue;
    items.push({ type: 'emotionalPattern', data: pattern });
  }

  // Relationship patterns
  for (const pattern of memoryStore.patterns.relationshipPatterns) {
    if (relationshipId && pattern.relationshipId !== relationshipId) continue;
    items.push({ type: 'relationshipPattern', data: pattern });
  }

  // Generational patterns
  for (const pattern of memoryStore.patterns.generationalPatterns) {
    if (systemId && pattern.systemId !== systemId) continue;
    items.push({ type: 'generationalPattern', data: pattern });
  }

  // Archetype patterns
  for (const pattern of memoryStore.patterns.archetypePatterns) {
    if (personId && pattern.personId !== personId) continue;
    if (relationshipId && pattern.relationshipId !== relationshipId) continue;
    if (systemId && pattern.systemId !== systemId) continue;
    items.push({ type: 'archetypePattern', data: pattern });
  }

  return items;
}

function sortMemoryItems(items: MemoryItem[], sortBy: string, sortOrder: 'asc' | 'desc'): MemoryItem[] {
  const getDate = (item: MemoryItem): string => {
    switch (item.type) {
      case 'chart':
      case 'relationship':
      case 'system':
        return item.data.updatedAt || item.data.createdAt;
      case 'timing':
      case 'environmental':
        return item.data.date;
      case 'ritual':
        return item.data.scheduledDate;
      case 'decision':
        return item.data.date;
      case 'beat':
        return item.data.startDate;
      case 'chapter':
        return item.data.startDate;
      case 'arc':
        return item.data.startDate;
      case 'turningPoint':
        return item.data.date;
      case 'simulation':
        return item.data.simulationDate;
      default:
        return (item.data as { discoveredAt?: string }).discoveredAt || '';
    }
  };

  const getConfidence = (item: MemoryItem): number => {
    if ('confidence' in item.data) {
      return (item.data as { confidence: number }).confidence;
    }
    return 50;
  };

  return items.sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'date') {
      comparison = getDate(a).localeCompare(getDate(b));
    } else if (sortBy === 'confidence') {
      comparison = getConfidence(a) - getConfidence(b);
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

// ============================================================================
// PATTERN EXTRACTION
// ============================================================================

/**
 * Extract patterns from memory history
 */
export function extractPatterns(options: PatternExtractionOptions = {}): PatternExtractionResult {
  const startTime = Date.now();
  const minOccurrences = options.minOccurrences || 3;
  const minConfidence = options.minConfidence || 0.6;

  const result: PatternExtractionResult = {
    timingPatterns: [],
    emotionalPatterns: [],
    relationshipPatterns: [],
    generationalPatterns: [],
    archetypePatterns: [],
    summary: {
      totalPatternsFound: 0,
      highConfidencePatterns: 0,
      newPatterns: 0,
      updatedPatterns: 0
    },
    insights: [],
    extractionTime: 0,
    dataPointsAnalyzed: 0
  };

  const patternTypes = options.patternTypes || ['timing', 'emotional', 'relationship', 'generational', 'archetype'];

  // Extract timing patterns
  if (patternTypes.includes('timing')) {
    const timingPatterns = extractTimingPatterns(minOccurrences, minConfidence, options);
    result.timingPatterns = timingPatterns;
    result.summary.totalPatternsFound += timingPatterns.length;
  }

  // Extract emotional patterns
  if (patternTypes.includes('emotional')) {
    const emotionalPatterns = extractEmotionalPatterns(minOccurrences, minConfidence, options);
    result.emotionalPatterns = emotionalPatterns;
    result.summary.totalPatternsFound += emotionalPatterns.length;
  }

  // Extract relationship patterns
  if (patternTypes.includes('relationship')) {
    const relationshipPatterns = extractRelationshipPatterns(minOccurrences, minConfidence, options);
    result.relationshipPatterns = relationshipPatterns;
    result.summary.totalPatternsFound += relationshipPatterns.length;
  }

  // Extract generational patterns
  if (patternTypes.includes('generational')) {
    const generationalPatterns = extractGenerationalPatterns(minOccurrences, minConfidence, options);
    result.generationalPatterns = generationalPatterns;
    result.summary.totalPatternsFound += generationalPatterns.length;
  }

  // Extract archetype patterns
  if (patternTypes.includes('archetype')) {
    const archetypePatterns = extractArchetypePatterns(minOccurrences, minConfidence, options);
    result.archetypePatterns = archetypePatterns;
    result.summary.totalPatternsFound += archetypePatterns.length;
  }

  // Count high confidence patterns
  result.summary.highConfidencePatterns = [
    ...result.timingPatterns,
    ...result.emotionalPatterns,
    ...result.relationshipPatterns,
    ...result.generationalPatterns,
    ...result.archetypePatterns
  ].filter(p => p.confidence >= 80).length;

  // Generate insights from patterns
  result.insights = generatePatternInsights(result);

  // Save discovered patterns
  saveDiscoveredPatterns(result);

  result.extractionTime = Date.now() - startTime;
  result.dataPointsAnalyzed =
    memoryStore.temporal.timingHistory.length +
    memoryStore.narrative.storyBeats.length +
    memoryStore.narrative.emotionalArcs.length;

  return result;
}

/**
 * Extract timing patterns from history
 */
function extractTimingPatterns(
  minOccurrences: number,
  minConfidence: number,
  options: PatternExtractionOptions
): TimingPattern[] {
  const patterns: TimingPattern[] = [];
  const timingHistory = memoryStore.temporal.timingHistory;

  if (timingHistory.length < minOccurrences) {
    return patterns;
  }

  // Group by person
  const byPerson = new Map<string, TimingSnapshot[]>();
  for (const snapshot of timingHistory) {
    const existing = byPerson.get(snapshot.personId) || [];
    existing.push(snapshot);
    byPerson.set(snapshot.personId, existing);
  }

  // Analyze each person's timing history
  for (const [personId, history] of byPerson) {
    if (history.length < minOccurrences) continue;

    // Look for element activation patterns
    const elementPatterns = detectElementActivationPatterns(history, minOccurrences);
    for (const pattern of elementPatterns) {
      if (pattern.confidence >= minConfidence * 100) {
        patterns.push({
          ...pattern,
          personId
        });
      }
    }

    // Look for cyclical patterns
    const cyclicalPatterns = detectCyclicalPatterns(history, minOccurrences);
    for (const pattern of cyclicalPatterns) {
      if (pattern.confidence >= minConfidence * 100) {
        patterns.push({
          ...pattern,
          personId
        });
      }
    }
  }

  return patterns;
}

function detectElementActivationPatterns(history: TimingSnapshot[], minOccurrences: number): TimingPattern[] {
  const patterns: TimingPattern[] = [];

  // Count element activation with high/low scores
  const elementScores: Record<string, { high: number[]; low: number[] }> = {};

  for (const snapshot of history) {
    for (const element of snapshot.activeElements) {
      if (!elementScores[element]) {
        elementScores[element] = { high: [], low: [] };
      }
      if (snapshot.timingScore >= 70) {
        elementScores[element].high.push(snapshot.timingScore);
      } else if (snapshot.timingScore <= 40) {
        elementScores[element].low.push(snapshot.timingScore);
      }
    }
  }

  // Create patterns for elements with consistent effects
  for (const [element, scores] of Object.entries(elementScores)) {
    if (scores.high.length >= minOccurrences) {
      const avgScore = scores.high.reduce((a, b) => a + b, 0) / scores.high.length;
      patterns.push({
        id: generateId('timing_pattern'),
        patternName: `${element} Activation Boost`,
        patternNameChinese: `${element}元素激活增益`,
        patternType: 'elemental',
        description: `When ${element} is active, timing scores tend to be high (avg ${avgScore.toFixed(0)})`,
        signature: {
          triggerElements: [element],
          cycleUnit: 'days'
        },
        occurrences: scores.high.map((score, i) => ({
          date: history[i]?.date || new Date().toISOString(),
          intensity: score,
          outcome: 'positive'
        })),
        confidence: Math.min(95, 50 + scores.high.length * 5),
        occurrenceCount: scores.high.length,
        discoveredAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
    }
  }

  return patterns;
}

function detectCyclicalPatterns(history: TimingSnapshot[], minOccurrences: number): TimingPattern[] {
  const patterns: TimingPattern[] = [];

  // Look for high-score periods
  const highScoreDates = history
    .filter(s => s.timingScore >= 70)
    .map(s => new Date(s.date).getTime());

  if (highScoreDates.length < minOccurrences) {
    return patterns;
  }

  // Calculate intervals
  const intervals: number[] = [];
  for (let i = 1; i < highScoreDates.length; i++) {
    intervals.push((highScoreDates[i] - highScoreDates[i - 1]) / (1000 * 60 * 60 * 24)); // Days
  }

  // Look for consistent intervals (monthly, yearly, etc.)
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const stdDev = Math.sqrt(
    intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length
  );

  // If standard deviation is low relative to mean, we have a cycle
  if (stdDev < avgInterval * 0.3 && avgInterval >= 7) {
    const cycleUnit = avgInterval > 300 ? 'years' : avgInterval > 25 ? 'months' : 'days';
    const cyclePeriod = cycleUnit === 'years'
      ? Math.round(avgInterval / 365)
      : cycleUnit === 'months'
        ? Math.round(avgInterval / 30)
        : Math.round(avgInterval);

    patterns.push({
      id: generateId('timing_pattern'),
      patternName: `${cyclePeriod}-${cycleUnit} High Energy Cycle`,
      patternNameChinese: `${cyclePeriod}${cycleUnit === 'years' ? '年' : cycleUnit === 'months' ? '月' : '日'}高能量周期`,
      patternType: 'cyclical',
      description: `High timing scores repeat approximately every ${cyclePeriod} ${cycleUnit}`,
      signature: {
        cyclePeriod: Math.round(avgInterval),
        cycleUnit: 'days'
      },
      occurrences: highScoreDates.map(d => ({
        date: new Date(d).toISOString(),
        intensity: 80,
        outcome: 'positive'
      })),
      confidence: Math.min(95, 70 - stdDev / avgInterval * 100 + highScoreDates.length * 3),
      occurrenceCount: highScoreDates.length,
      nextPredictedOccurrence: new Date(highScoreDates[highScoreDates.length - 1] + avgInterval * 24 * 60 * 60 * 1000).toISOString(),
      discoveredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
  }

  return patterns;
}

/**
 * Extract emotional patterns from story beats
 */
function extractEmotionalPatterns(
  minOccurrences: number,
  minConfidence: number,
  options: PatternExtractionOptions
): EmotionalPattern[] {
  const patterns: EmotionalPattern[] = [];
  const arcs = memoryStore.narrative.emotionalArcs;

  if (arcs.length < minOccurrences) {
    return patterns;
  }

  // Group by arc type
  const byArcType = new Map<string, EmotionalArcRecord[]>();
  for (const arc of arcs) {
    const existing = byArcType.get(arc.arcType) || [];
    existing.push(arc);
    byArcType.set(arc.arcType, existing);
  }

  // Create patterns for recurring arc types
  for (const [arcType, arcList] of byArcType) {
    if (arcList.length >= minOccurrences) {
      const avgDuration = arcList.reduce((sum, a) => sum + a.duration, 0) / arcList.length;
      const avgIntensity = arcList.reduce((sum, a) => sum + a.peakIntensity, 0) / arcList.length;

      patterns.push({
        id: generateId('emotional_pattern'),
        personId: arcList[0].personId,
        relationshipId: arcList[0].relationshipId,
        patternName: `Recurring ${arcType} Arc`,
        patternNameChinese: `重复${arcType}情感弧`,
        patternType: 'arc',
        signature: {
          sequence: arcList[0].emotionalSequence,
          averageDuration: avgDuration,
          peakIntensity: avgIntensity
        },
        occurrences: arcList.map(a => ({
          startDate: a.startDate,
          endDate: a.endDate,
          matchScore: 100
        })),
        confidence: Math.min(95, 50 + arcList.length * 10),
        occurrenceCount: arcList.length,
        discoveredAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
    }
  }

  return patterns;
}

/**
 * Extract relationship patterns
 */
function extractRelationshipPatterns(
  minOccurrences: number,
  minConfidence: number,
  options: PatternExtractionOptions
): RelationshipPattern[] {
  const patterns: RelationshipPattern[] = [];
  const decisions = memoryStore.temporal.decisionHistory.filter(d => d.relationshipId);

  if (decisions.length < minOccurrences) {
    return patterns;
  }

  // Group by relationship and action type
  const byRelAndAction = new Map<string, DecisionRecord[]>();
  for (const decision of decisions) {
    const key = `${decision.relationshipId}_${decision.actionType}`;
    const existing = byRelAndAction.get(key) || [];
    existing.push(decision);
    byRelAndAction.set(key, existing);
  }

  // Create patterns for repeated action types
  for (const [key, decisionList] of byRelAndAction) {
    if (decisionList.length >= minOccurrences) {
      const [relationshipId, actionType] = key.split('_');
      const avgScore = decisionList.reduce((sum, d) => sum + d.timingScore, 0) / decisionList.length;

      // Determine pattern type based on action
      let patternType: RelationshipPattern['patternType'] = 'growth';
      if (actionType === 'heal') patternType = 'harmony';
      if (actionType === 'release') patternType = 'distance';
      if (actionType === 'initiate') patternType = 'growth';
      if (actionType === 'deepen') patternType = 'communication';

      patterns.push({
        id: generateId('rel_pattern'),
        relationshipId,
        patternName: `Recurring ${actionType} moments`,
        patternNameChinese: `重复${actionType}时刻`,
        patternType,
        description: `This relationship frequently enters ${actionType} phases`,
        signature: {
          cyclePeriod: Math.round(
            (new Date(decisionList[decisionList.length - 1].date).getTime() -
              new Date(decisionList[0].date).getTime()) /
            (1000 * 60 * 60 * 24 * decisionList.length)
          ),
          cycleUnit: 'days'
        },
        occurrences: decisionList.map(d => ({
          date: d.date,
          context: d.actionDescription,
          intensity: d.timingScore
        })),
        confidence: Math.min(95, 50 + decisionList.length * 8),
        occurrenceCount: decisionList.length,
        whenThisHappens: `The relationship tends to need ${actionType} actions periodically`,
        bestResponse: actionType as ActionType,
        discoveredAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
    }
  }

  return patterns;
}

/**
 * Extract generational patterns
 */
function extractGenerationalPatterns(
  minOccurrences: number,
  minConfidence: number,
  options: PatternExtractionOptions
): GenerationalPattern[] {
  const patterns: GenerationalPattern[] = [];
  const systems = Object.values(memoryStore.structural.systems).filter(s => s.systemType === 'family');

  for (const system of systems) {
    if (!system.generationalData || system.generationalData.generations < 2) continue;

    // Look for element patterns across generations
    const charts = system.participants
      .map(p => memoryStore.structural.charts[p.chartId])
      .filter(Boolean);

    if (charts.length < 2) continue;

    // Count element distribution
    const elementCounts: Record<string, number> = {};
    for (const chart of charts) {
      if (chart.dayMasterElement) {
        elementCounts[chart.dayMasterElement] = (elementCounts[chart.dayMasterElement] || 0) + 1;
      }
    }

    // Find dominant element
    const dominantElement = Object.entries(elementCounts)
      .sort((a, b) => b[1] - a[1])[0];

    if (dominantElement && dominantElement[1] >= minOccurrences) {
      patterns.push({
        id: generateId('gen_pattern'),
        systemId: system.id,
        patternName: `${dominantElement[0]} Element Inheritance`,
        patternNameChinese: `${dominantElement[0]}元素传承`,
        patternType: 'inherited',
        description: `${dominantElement[0]} element appears prominently across ${dominantElement[1]} family members`,
        signature: {
          affectedElements: [dominantElement[0]],
          generationSpan: system.generationalData.generations
        },
        occurrences: charts
          .filter(c => c.dayMasterElement === dominantElement[0])
          .map(c => ({
            generation: 1, // Simplified
            personId: c.personId,
            personName: c.personName,
            manifestation: `Day Master: ${c.dayMaster}`
          })),
        confidence: Math.min(95, 50 + dominantElement[1] * 15),
        generationsObserved: system.generationalData.generations,
        discoveredAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
    }
  }

  return patterns;
}

/**
 * Extract archetype patterns
 */
function extractArchetypePatterns(
  minOccurrences: number,
  minConfidence: number,
  options: PatternExtractionOptions
): ArchetypePattern[] {
  const patterns: ArchetypePattern[] = [];
  const turningPoints = memoryStore.narrative.turningPoints;

  if (turningPoints.length < minOccurrences) {
    return patterns;
  }

  // Look for hero's journey stages
  const heroJourneyTypes = ['revelation', 'decision', 'reversal', 'climax', 'resolution'];
  const byType = new Map<string, TurningPointRecord[]>();

  for (const tp of turningPoints) {
    const existing = byType.get(tp.turningPointType) || [];
    existing.push(tp);
    byType.set(tp.turningPointType, existing);
  }

  // If we have multiple types represented, there might be a hero's journey
  const typesPresent = heroJourneyTypes.filter(t => (byType.get(t)?.length || 0) >= 1);

  if (typesPresent.length >= 3) {
    patterns.push({
      id: generateId('arch_pattern'),
      archetype: "Hero's Journey",
      archetypeChinese: '英雄之旅',
      patternType: 'hero-journey',
      description: 'Multiple stages of the hero\'s journey are present in this life story',
      signature: {
        stages: typesPresent,
        typicalDuration: 12,
        durationUnit: 'months',
        triggerConditions: ['major life transitions', 'career changes', 'relationship shifts']
      },
      occurrences: [{
        startDate: turningPoints[0]?.date || new Date().toISOString(),
        currentStage: turningPoints[turningPoints.length - 1]?.turningPointType || 'unknown',
        completionPercentage: (typesPresent.length / heroJourneyTypes.length) * 100
      }],
      isCurrentlyActive: true,
      discoveredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
  }

  return patterns;
}

/**
 * Generate insights from discovered patterns
 */
function generatePatternInsights(result: PatternExtractionResult): PatternInsight[] {
  const insights: PatternInsight[] = [];

  // Timing insights
  for (const pattern of result.timingPatterns) {
    if (pattern.confidence >= 70 && pattern.nextPredictedOccurrence) {
      insights.push({
        id: generateId('insight'),
        title: `Upcoming ${pattern.patternName}`,
        titleChinese: `即将到来的${pattern.patternNameChinese}`,
        description: `Based on ${pattern.occurrenceCount} past occurrences, expect this pattern around ${pattern.nextPredictedOccurrence.slice(0, 10)}`,
        sourcePatternIds: [pattern.id],
        confidence: pattern.confidence,
        insightType: 'prediction',
        recommendation: 'Prepare accordingly based on historical outcomes'
      });
    }
  }

  // Emotional arc insights
  for (const pattern of result.emotionalPatterns) {
    if (pattern.confidence >= 70) {
      insights.push({
        id: generateId('insight'),
        title: `Emotional Pattern Detected`,
        description: `You tend to experience ${pattern.patternName} cycles lasting about ${pattern.signature.averageDuration} days`,
        sourcePatternIds: [pattern.id],
        confidence: pattern.confidence,
        insightType: 'growth',
        recommendation: `When entering this pattern, remember it typically resolves within ${pattern.signature.averageDuration} days`
      });
    }
  }

  // Relationship insights
  for (const pattern of result.relationshipPatterns) {
    if (pattern.confidence >= 70) {
      insights.push({
        id: generateId('insight'),
        title: `Relationship Rhythm`,
        description: pattern.description,
        sourcePatternIds: [pattern.id],
        confidence: pattern.confidence,
        insightType: 'opportunity',
        recommendation: pattern.whenThisHappens
      });
    }
  }

  // Generational insights
  for (const pattern of result.generationalPatterns) {
    insights.push({
      id: generateId('insight'),
      title: `Family Pattern: ${pattern.patternName}`,
      titleChinese: `家族模式: ${pattern.patternNameChinese}`,
      description: pattern.description,
      sourcePatternIds: [pattern.id],
      confidence: pattern.confidence,
      insightType: 'healing',
      recommendation: pattern.healingOpportunity || 'Awareness of this pattern can help in conscious evolution'
    });
  }

  return insights;
}

/**
 * Save discovered patterns to memory
 */
function saveDiscoveredPatterns(result: PatternExtractionResult): void {
  // Merge with existing patterns (update or add)
  for (const pattern of result.timingPatterns) {
    const existing = memoryStore.patterns.timingPatterns.find(p => p.patternName === pattern.patternName);
    if (existing) {
      Object.assign(existing, { ...pattern, lastUpdated: new Date().toISOString() });
      result.summary.updatedPatterns++;
    } else {
      memoryStore.patterns.timingPatterns.push(pattern);
      result.summary.newPatterns++;
    }
  }

  for (const pattern of result.emotionalPatterns) {
    const existing = memoryStore.patterns.emotionalPatterns.find(p => p.patternName === pattern.patternName);
    if (existing) {
      Object.assign(existing, { ...pattern, lastUpdated: new Date().toISOString() });
      result.summary.updatedPatterns++;
    } else {
      memoryStore.patterns.emotionalPatterns.push(pattern);
      result.summary.newPatterns++;
    }
  }

  for (const pattern of result.relationshipPatterns) {
    const existing = memoryStore.patterns.relationshipPatterns.find(
      p => p.relationshipId === pattern.relationshipId && p.patternName === pattern.patternName
    );
    if (existing) {
      Object.assign(existing, { ...pattern, lastUpdated: new Date().toISOString() });
      result.summary.updatedPatterns++;
    } else {
      memoryStore.patterns.relationshipPatterns.push(pattern);
      result.summary.newPatterns++;
    }
  }

  for (const pattern of result.generationalPatterns) {
    const existing = memoryStore.patterns.generationalPatterns.find(p => p.systemId === pattern.systemId);
    if (existing) {
      Object.assign(existing, { ...pattern, lastUpdated: new Date().toISOString() });
      result.summary.updatedPatterns++;
    } else {
      memoryStore.patterns.generationalPatterns.push(pattern);
      result.summary.newPatterns++;
    }
  }

  for (const pattern of result.archetypePatterns) {
    const existing = memoryStore.patterns.archetypePatterns.find(p => p.archetype === pattern.archetype);
    if (existing) {
      Object.assign(existing, { ...pattern, lastUpdated: new Date().toISOString() });
      result.summary.updatedPatterns++;
    } else {
      memoryStore.patterns.archetypePatterns.push(pattern);
      result.summary.newPatterns++;
    }
  }

  updateMemoryMetadata();
}

// ============================================================================
// PREDICTIVE RECALL
// ============================================================================

/**
 * Predict future states based on patterns
 */
export function predictiveRecall(input: PredictiveRecallInput): PredictiveRecallResult {
  const startTime = Date.now();

  const result: PredictiveRecallResult = {
    predictions: [],
    supportingPatterns: [],
    historicalParallels: [],
    overallConfidence: 0,
    dataPointsUsed: 0,
    patternsUsed: 0
  };

  const predictTypes = input.predictTypes || ['timing', 'emotional', 'relationship', 'lifecycle'];
  const minConfidence = input.patternMinConfidence || 60;

  // Get relevant patterns
  const patterns = getPatternHistory(
    input.personId || input.relationshipId || input.systemId || '',
    input.personId ? 'person' : input.relationshipId ? 'relationship' : 'system'
  );

  // Predict timing
  if (predictTypes.includes('timing')) {
    const timingPredictions = predictTiming(patterns, input, minConfidence);
    result.predictions.push(...timingPredictions);
  }

  // Predict emotional
  if (predictTypes.includes('emotional')) {
    const emotionalPredictions = predictEmotional(patterns, input, minConfidence);
    result.predictions.push(...emotionalPredictions);
  }

  // Predict relationship
  if (predictTypes.includes('relationship') && input.relationshipId) {
    const relationshipPredictions = predictRelationship(patterns, input, minConfidence);
    result.predictions.push(...relationshipPredictions);
  }

  // Find historical parallels
  result.historicalParallels = findHistoricalParallels(input);

  // Calculate overall confidence
  if (result.predictions.length > 0) {
    result.overallConfidence = result.predictions.reduce((sum, p) => sum + p.confidence, 0) / result.predictions.length;
  }

  // Count supporting patterns
  const usedPatternIds = new Set<string>();
  for (const prediction of result.predictions) {
    for (const basisId of prediction.basis) {
      usedPatternIds.add(basisId);
    }
  }
  result.patternsUsed = usedPatternIds.size;

  // Build supporting patterns list
  for (const patternId of usedPatternIds) {
    const pattern = [
      ...patterns.timingPatterns,
      ...patterns.emotionalPatterns,
      ...patterns.relationshipPatterns
    ].find(p => p.id === patternId);

    if (pattern) {
      result.supportingPatterns.push({
        patternId: pattern.id,
        patternName: pattern.patternName,
        contribution: pattern.confidence / 100
      });
    }
  }

  return result;
}

function predictTiming(
  patterns: PatternMemory,
  input: PredictiveRecallInput,
  minConfidence: number
): Prediction[] {
  const predictions: Prediction[] = [];

  for (const pattern of patterns.timingPatterns) {
    if (pattern.confidence < minConfidence) continue;
    if (!pattern.nextPredictedOccurrence) continue;

    // Check if prediction falls within target range
    const targetDate = input.targetDate || input.targetDateRange?.start;
    if (targetDate && pattern.nextPredictedOccurrence < targetDate) continue;

    predictions.push({
      id: generateId('pred'),
      predictionType: 'timing',
      targetDate: pattern.nextPredictedOccurrence,
      prediction: `${pattern.patternName} is likely to occur`,
      predictionChinese: `${pattern.patternNameChinese}可能发生`,
      confidence: pattern.confidence,
      confidenceTier: pattern.confidence >= 80 ? 'high' : pattern.confidence >= 60 ? 'medium' : 'low',
      basis: [pattern.id]
    });
  }

  return predictions;
}

function predictEmotional(
  patterns: PatternMemory,
  input: PredictiveRecallInput,
  minConfidence: number
): Prediction[] {
  const predictions: Prediction[] = [];

  for (const pattern of patterns.emotionalPatterns) {
    if (pattern.confidence < minConfidence) continue;

    // Predict based on average duration
    const lastOccurrence = pattern.occurrences[pattern.occurrences.length - 1];
    if (!lastOccurrence) continue;

    const nextExpectedDate = new Date(lastOccurrence.endDate);
    nextExpectedDate.setDate(nextExpectedDate.getDate() + pattern.signature.averageDuration);

    predictions.push({
      id: generateId('pred'),
      predictionType: 'emotional',
      targetDate: nextExpectedDate.toISOString(),
      targetDateRange: {
        start: nextExpectedDate.toISOString(),
        end: new Date(nextExpectedDate.getTime() + pattern.signature.averageDuration * 24 * 60 * 60 * 1000).toISOString()
      },
      prediction: `Expect another ${pattern.patternName} cycle`,
      predictedTone: pattern.signature.sequence[0],
      confidence: pattern.confidence * 0.8, // Slightly less confident for emotional predictions
      confidenceTier: pattern.confidence >= 80 ? 'medium' : 'low',
      basis: [pattern.id]
    });
  }

  return predictions;
}

function predictRelationship(
  patterns: PatternMemory,
  input: PredictiveRecallInput,
  minConfidence: number
): Prediction[] {
  const predictions: Prediction[] = [];

  for (const pattern of patterns.relationshipPatterns) {
    if (pattern.confidence < minConfidence) continue;
    if (pattern.relationshipId !== input.relationshipId) continue;

    // Predict next occurrence based on cycle
    const lastOccurrence = pattern.occurrences[pattern.occurrences.length - 1];
    if (!lastOccurrence || !pattern.signature.cyclePeriod) continue;

    const nextDate = new Date(lastOccurrence.date);
    nextDate.setDate(nextDate.getDate() + pattern.signature.cyclePeriod);

    predictions.push({
      id: generateId('pred'),
      predictionType: 'relationship',
      targetDate: nextDate.toISOString(),
      prediction: pattern.whenThisHappens,
      confidence: pattern.confidence,
      confidenceTier: pattern.confidence >= 80 ? 'high' : pattern.confidence >= 60 ? 'medium' : 'low',
      basis: [pattern.id]
    });
  }

  return predictions;
}

function findHistoricalParallels(input: PredictiveRecallInput): Array<{ date: string; similarity: number; outcome: string }> {
  const parallels: Array<{ date: string; similarity: number; outcome: string }> = [];

  // Get timing history
  const history = input.personId
    ? getTimingHistory(input.personId)
    : memoryStore.temporal.timingHistory;

  // Find similar timing contexts to target date
  const targetDate = input.targetDate || new Date().toISOString();
  const targetMonth = new Date(targetDate).getMonth();

  // Look for same month in previous years
  for (const snapshot of history) {
    const snapshotMonth = new Date(snapshot.date).getMonth();
    if (snapshotMonth === targetMonth) {
      parallels.push({
        date: snapshot.date,
        similarity: 70 + Math.random() * 20, // Simplified similarity calculation
        outcome: snapshot.timingScore >= 70 ? 'positive' : snapshot.timingScore <= 40 ? 'challenging' : 'neutral'
      });
    }
  }

  // Sort by similarity and limit
  return parallels.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
}

// ============================================================================
// VISUALIZATION DATA GENERATORS
// ============================================================================

/**
 * Generate data for memory timeline view
 */
export function generateMemoryTimelineData(
  entityId: string,
  entityType: 'person' | 'relationship' = 'person',
  options: { startDate?: string; endDate?: string } = {}
): MemoryTimelineData {
  const items: MemoryTimelineData['items'] = [];
  const startDate = options.startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = options.endDate || new Date().toISOString();

  // Collect timing snapshots
  const timingHistory = entityType === 'person'
    ? memoryStore.temporal.timingHistory.filter(t => t.personId === entityId)
    : [];

  for (const snapshot of timingHistory) {
    if (snapshot.date >= startDate && snapshot.date <= endDate) {
      items.push({
        id: snapshot.id,
        date: snapshot.date,
        type: 'timing',
        typeChinese: '时机',
        title: `Timing: ${snapshot.timingScore}`,
        layer: 'temporal',
        intensity: snapshot.timingScore,
        verified: true,
        color: snapshot.timingScore >= 70 ? '#22c55e' : snapshot.timingScore <= 40 ? '#ef4444' : '#f59e0b'
      });
    }
  }

  // Collect story beats
  const beats = memoryStore.narrative.storyBeats.filter(b =>
    (entityType === 'person' ? b.personId === entityId : b.relationshipId === entityId) &&
    b.startDate >= startDate && b.startDate <= endDate
  );

  for (const beat of beats) {
    items.push({
      id: beat.id,
      date: beat.startDate,
      type: 'beat',
      typeChinese: '节拍',
      title: beat.summary,
      layer: 'narrative',
      intensity: beat.intensity,
      verified: beat.verified,
      color: '#8b5cf6'
    });
  }

  // Collect turning points
  const turningPoints = memoryStore.narrative.turningPoints.filter(tp =>
    (entityType === 'person' ? tp.personId === entityId : tp.relationshipId === entityId) &&
    tp.date >= startDate && tp.date <= endDate
  );

  for (const tp of turningPoints) {
    items.push({
      id: tp.id,
      date: tp.date,
      type: 'turningPoint',
      typeChinese: '转折点',
      title: tp.triggerDescription,
      layer: 'narrative',
      intensity: tp.impactScore,
      verified: tp.verified,
      color: '#ec4899'
    });
  }

  // Sort by date
  items.sort((a, b) => a.date.localeCompare(b.date));

  // Get pattern markers
  const patterns = getPatternHistory(entityId, entityType);
  const patternMarkers: MemoryTimelineData['patternMarkers'] = [];

  for (const pattern of patterns.timingPatterns) {
    patternMarkers.push({
      patternId: pattern.id,
      patternName: pattern.patternName,
      occurrenceDates: pattern.occurrences.map(o => o.date),
      color: '#3b82f6'
    });
  }

  return {
    startDate,
    endDate,
    items,
    patternMarkers
  };
}

/**
 * Generate data for pattern view
 */
export function generatePatternViewData(
  entityId: string,
  entityType: 'person' | 'relationship' | 'system' = 'person'
): PatternViewData {
  const patterns = getPatternHistory(entityId, entityType);

  const categories: PatternViewData['categories'] = [];

  // Timing patterns
  if (patterns.timingPatterns.length > 0) {
    categories.push({
      category: 'Timing',
      categoryChinese: '时机',
      patterns: patterns.timingPatterns.map(p => ({
        id: p.id,
        name: p.patternName,
        nameChinese: p.patternNameChinese,
        confidence: p.confidence,
        occurrences: p.occurrenceCount,
        lastOccurrence: p.occurrences[p.occurrences.length - 1]?.date || '',
        nextPredicted: p.nextPredictedOccurrence,
        color: '#3b82f6'
      }))
    });
  }

  // Emotional patterns
  if (patterns.emotionalPatterns.length > 0) {
    categories.push({
      category: 'Emotional',
      categoryChinese: '情感',
      patterns: patterns.emotionalPatterns.map(p => ({
        id: p.id,
        name: p.patternName,
        nameChinese: p.patternNameChinese,
        confidence: p.confidence,
        occurrences: p.occurrenceCount,
        lastOccurrence: p.occurrences[p.occurrences.length - 1]?.endDate || '',
        color: '#8b5cf6'
      }))
    });
  }

  // Relationship patterns
  if (patterns.relationshipPatterns.length > 0) {
    categories.push({
      category: 'Relationship',
      categoryChinese: '关系',
      patterns: patterns.relationshipPatterns.map(p => ({
        id: p.id,
        name: p.patternName,
        nameChinese: p.patternNameChinese,
        confidence: p.confidence,
        occurrences: p.occurrenceCount,
        lastOccurrence: p.occurrences[p.occurrences.length - 1]?.date || '',
        color: '#ec4899'
      }))
    });
  }

  // Stats
  const allPatterns = [
    ...patterns.timingPatterns,
    ...patterns.emotionalPatterns,
    ...patterns.relationshipPatterns,
    ...patterns.generationalPatterns,
    ...patterns.archetypePatterns
  ];

  return {
    categories,
    stats: {
      totalPatterns: allPatterns.length,
      highConfidenceCount: allPatterns.filter(p => p.confidence >= 80).length,
      activeCycles: patterns.timingPatterns.filter(p => p.nextPredictedOccurrence).length,
      upcomingPredictions: patterns.timingPatterns.filter(p => {
        if (!p.nextPredictedOccurrence) return false;
        const nextDate = new Date(p.nextPredictedOccurrence);
        const now = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        return nextDate.getTime() - now.getTime() < thirtyDays;
      }).length
    }
  };
}

/**
 * Generate data for generational ladder view
 */
export function generateGenerationalLadderData(systemId: string): GenerationalLadderViewData | null {
  const system = memoryStore.structural.systems[systemId];
  if (!system || system.systemType !== 'family') {
    return null;
  }

  const generations: GenerationalLadderViewData['generations'] = [];

  // Group participants by generation (simplified - assumes role indicates generation)
  const generationMap = new Map<number, typeof system.participants>();

  for (const participant of system.participants) {
    const chart = memoryStore.structural.charts[participant.chartId];
    if (!chart) continue;

    // Infer generation from birth year (simplified)
    const birthYear = chart.birthData.year;
    const generationLevel = Math.floor((2025 - birthYear) / 25);

    const existing = generationMap.get(generationLevel) || [];
    existing.push(participant);
    generationMap.set(generationLevel, existing);
  }

  // Build generations array
  for (const [level, members] of generationMap) {
    generations.push({
      level,
      label: level === 0 ? 'Current' : level === 1 ? 'Parents' : level === 2 ? 'Grandparents' : `Generation ${level}`,
      members: members.map(m => {
        const chart = memoryStore.structural.charts[m.chartId];
        return {
          personId: m.chartId,
          name: m.name,
          birthYear: chart?.birthData.year || 0,
          dayMaster: chart?.dayMaster || '',
          element: chart?.dayMasterElement || '',
          role: m.role
        };
      })
    });
  }

  // Sort by level
  generations.sort((a, b) => a.level - b.level);

  // Get generational patterns
  const patterns = memoryStore.patterns.generationalPatterns.filter(p => p.systemId === systemId);

  const patternOverlays: GenerationalLadderViewData['patternOverlays'] = patterns.map(p => ({
    patternId: p.id,
    patternName: p.patternName,
    affectedGenerations: p.occurrences.map(o => o.generation),
    color: '#f59e0b',
    description: p.description
  }));

  return {
    systemId,
    systemName: system.systemName,
    generations,
    patternOverlays
  };
}

/**
 * Generate data for narrative archive view
 */
export function generateNarrativeArchiveData(
  entityId: string,
  entityType: 'person' | 'relationship' = 'person'
): NarrativeArchiveData {
  const filterFn = entityType === 'person'
    ? (item: { personId?: string }) => item.personId === entityId
    : (item: { relationshipId?: string }) => item.relationshipId === entityId;

  // Get chapters grouped by story
  const chapters = memoryStore.narrative.storyChapters.filter(filterFn);
  const storyIds = [...new Set(chapters.map(c => c.storyId))];

  const stories = storyIds.map(storyId => {
    const storyChapters = chapters.filter(c => c.storyId === storyId);
    storyChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    return {
      id: storyId,
      title: storyChapters[0]?.chapterTitle || 'Untitled Story',
      personId: entityType === 'person' ? entityId : undefined,
      relationshipId: entityType === 'relationship' ? entityId : undefined,
      startDate: storyChapters[0]?.startDate || '',
      endDate: storyChapters[storyChapters.length - 1]?.endDate || '',
      chapterCount: storyChapters.length,
      currentChapter: storyChapters.length,
      overallArc: storyChapters[storyChapters.length - 1]?.arc || '',
      verified: storyChapters.every(c => c.verified)
    };
  });

  // Get turning points
  const turningPoints = memoryStore.narrative.turningPoints.filter(filterFn);

  // Get simulations
  const simulations = memoryStore.narrative.simulationBranches
    .filter(filterFn)
    .map(sim => ({
      id: sim.id,
      date: sim.simulationDate,
      choiceDescription: sim.choiceDescription,
      branchCount: sim.branches.length,
      actualOutcome: sim.actualOutcome,
      accuracyScore: sim.accuracyScore
    }));

  return {
    stories,
    turningPoints,
    simulations
  };
}

// ============================================================================
// MEMORY MANAGEMENT
// ============================================================================

/**
 * Clear all memory (for testing/reset)
 */
export function clearMemory(): void {
  memoryStore = createEmptyMemory();
}

/**
 * Import memory from external source
 */
export function importMemory(memory: CathedralMemory): void {
  memoryStore = memory;
  updateMemoryMetadata();
}

/**
 * Export current memory
 */
export function exportMemory(): CathedralMemory {
  return JSON.parse(JSON.stringify(memoryStore));
}

/**
 * Get memory health score
 */
export function getMemoryHealth(): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  // Check for data integrity issues
  const chartIds = Object.keys(memoryStore.structural.charts);
  for (const rel of Object.values(memoryStore.structural.relationships)) {
    if (!chartIds.includes(rel.personA)) {
      issues.push(`Relationship ${rel.id} references missing chart ${rel.personA}`);
      score -= 5;
    }
    if (!chartIds.includes(rel.personB)) {
      issues.push(`Relationship ${rel.id} references missing chart ${rel.personB}`);
      score -= 5;
    }
  }

  // Check for stale patterns
  const now = new Date();
  for (const pattern of memoryStore.patterns.timingPatterns) {
    const lastUpdate = new Date(pattern.lastUpdated);
    const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 90) {
      issues.push(`Pattern ${pattern.id} hasn't been updated in ${Math.round(daysSinceUpdate)} days`);
      score -= 2;
    }
  }

  return { score: Math.max(0, score), issues };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  MEMORY_LAYER_CHINESE,
  MEMORY_LAYER_DESCRIPTIONS
} from './memoryTypes';

