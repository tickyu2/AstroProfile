/**
 * ============================================
 * GRAND ORCHESTRATION ENGINE
 * The Crown Stone that unifies ALL Cathedral systems:
 * - Temple Orchestration Engine
 * - Mythos Hypergraph
 * - Lineage Timeline
 * - Generational Arc
 * - Ritual Timing
 * - Ming Pan Pro
 * - Profiling
 * - Narrative Cockpit
 * - Ancestral Temple
 *
 * This is where the Cathedral becomes ONE.
 * ============================================
 */

import { GenerationalLadder, GenerationalThread } from './generationalLadder';
import { RitualTimingWindow } from './ritualTiming';
import { MythosHypergraph, HypergraphNode, HypergraphEdge } from './mythosHypergraph';

// ==================== DATA MODEL ====================

/**
 * The unified Cathedral state
 */
export interface CathedralState {
  // Identity
  pilgrimId: string;
  birthData: BirthData;

  // Technical Layer
  mingPanPro: MingPanProState;

  // Narrative Layer
  narrativeCockpit: NarrativeCockpitState;

  // Ancestral Layer
  ancestralTemple: AncestralTempleState;

  // Mythos Layer
  mythosCodex: MythosCodexState;

  // Profiling Layer
  profilingDashboard: ProfilingState;

  // Timing Layer
  ritualCalendar: RitualCalendarState;

  // Journey Layer
  pilgrimJourney: PilgrimJourneyState;

  // Meta
  orchestrationMeta: OrchestrationMeta;
}

export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  timezone?: string;
  location?: string;
}

export interface MingPanProState {
  fourPillars: FourPillars;
  interactions: Interaction[];
  luckPillars: LuckPillar[];
  usefulGod?: string;
  annoyingGod?: string;
  dayMasterStrength: 'strong' | 'weak' | 'balanced';
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface Pillar {
  stem: string;
  branch: string;
  hiddenStems?: string[];
  element?: string;
}

export interface Interaction {
  type: string;
  pillars: string[];
  description: string;
  descriptionZh?: string;
  severity?: number;
}

export interface LuckPillar {
  age: number;
  stem: string;
  branch: string;
  startYear: number;
  endYear: number;
}

export interface NarrativeCockpitState {
  currentChapter: string;
  storyBeats: StoryBeat[];
  emotionalArc: EmotionalArc;
  narrativeThreads: NarrativeThread[];
}

export interface StoryBeat {
  id: string;
  title: string;
  titleZh?: string;
  description: string;
  descriptionZh?: string;
  age: number;
  intensity: number;
}

export interface EmotionalArc {
  currentTone: string;
  trajectory: 'rising' | 'falling' | 'stable' | 'transforming';
  peakMoments: number[];
  valleyMoments: number[];
}

export interface NarrativeThread {
  id: string;
  theme: string;
  active: boolean;
  startAge: number;
  endAge?: number;
}

export interface AncestralTempleState {
  ladder: GenerationalLadder;
  threads: GenerationalThread[];
  activeRituals: string[];
  pilgrimPosition: PilgrimPosition;
}

export interface PilgrimPosition {
  generationIndex: number;
  role: 'inheritor' | 'transformer' | 'founder' | 'bridge';
  ancestralDebt?: string;
  ancestralGift?: string;
}

export interface MythosCodexState {
  hypergraph: MythosHypergraph;
  activeArchetypes: string[];
  shadowWork: ShadowWorkState;
  giftActivation: GiftActivationState;
}

export interface ShadowWorkState {
  identifiedShadows: string[];
  integrationProgress: number;
  currentFocus?: string;
}

export interface GiftActivationState {
  discoveredGifts: string[];
  activationProgress: number;
  currentFocus?: string;
}

export interface ProfilingState {
  workStyle: string;
  personalityType: string;
  constellationRole?: string;
  strengths: string[];
  challenges: string[];
  archetype?: string;
}

export interface RitualCalendarState {
  windows: RitualTimingWindow[];
  activeWindow?: RitualTimingWindow;
  upcomingWindows: RitualTimingWindow[];
  completedRituals: string[];
}

export interface PilgrimJourneyState {
  currentPhase: JourneyPhase;
  completedPhases: JourneyPhase[];
  milestones: Milestone[];
  currentQuest?: Quest;
}

export type JourneyPhase =
  | 'awakening'
  | 'descent'
  | 'underworld'
  | 'transformation'
  | 'return'
  | 'integration'
  | 'mastery';

export interface Milestone {
  id: string;
  name: string;
  nameZh?: string;
  achieved: boolean;
  age?: number;
}

export interface Quest {
  id: string;
  name: string;
  nameZh?: string;
  objective: string;
  objectiveZh?: string;
  progress: number;
}

export interface OrchestrationMeta {
  lastUpdated: Date;
  version: string;
  syncStatus: SyncStatus;
  coherenceScore: number;
}

export interface SyncStatus {
  mingPanPro: boolean;
  narrativeCockpit: boolean;
  ancestralTemple: boolean;
  mythosCodex: boolean;
  profilingDashboard: boolean;
  ritualCalendar: boolean;
  pilgrimJourney: boolean;
}

// ==================== ORCHESTRATION ENGINE ====================

/**
 * The Grand Orchestration Engine
 */
export class GrandOrchestrationEngine {
  private state: CathedralState;
  private listeners: Map<string, OrchestrationListener[]>;
  private syncQueue: SyncEvent[];

  constructor(initialState?: Partial<CathedralState>) {
    this.state = this.initializeState(initialState);
    this.listeners = new Map();
    this.syncQueue = [];
  }

  /**
   * Initialize Cathedral state
   */
  private initializeState(partial?: Partial<CathedralState>): CathedralState {
    return {
      pilgrimId: partial?.pilgrimId || this.generatePilgrimId(),
      birthData: partial?.birthData || { year: 1990, month: 1, day: 1, hour: 12 },
      mingPanPro: partial?.mingPanPro || this.createEmptyMingPanPro(),
      narrativeCockpit: partial?.narrativeCockpit || this.createEmptyNarrative(),
      ancestralTemple: partial?.ancestralTemple || this.createEmptyTemple(),
      mythosCodex: partial?.mythosCodex || this.createEmptyMythos(),
      profilingDashboard: partial?.profilingDashboard || this.createEmptyProfiling(),
      ritualCalendar: partial?.ritualCalendar || this.createEmptyRitualCalendar(),
      pilgrimJourney: partial?.pilgrimJourney || this.createEmptyJourney(),
      orchestrationMeta: {
        lastUpdated: new Date(),
        version: '3.0.0',
        syncStatus: this.createFullSyncStatus(),
        coherenceScore: 0
      }
    };
  }

  /**
   * Generate unique pilgrim ID
   */
  private generatePilgrimId(): string {
    return `pilgrim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create empty Ming Pan Pro state
   */
  private createEmptyMingPanPro(): MingPanProState {
    return {
      fourPillars: {
        year: { stem: '', branch: '' },
        month: { stem: '', branch: '' },
        day: { stem: '', branch: '' },
        hour: { stem: '', branch: '' }
      },
      interactions: [],
      luckPillars: [],
      dayMasterStrength: 'balanced'
    };
  }

  /**
   * Create empty Narrative state
   */
  private createEmptyNarrative(): NarrativeCockpitState {
    return {
      currentChapter: 'prologue',
      storyBeats: [],
      emotionalArc: {
        currentTone: 'neutral',
        trajectory: 'stable',
        peakMoments: [],
        valleyMoments: []
      },
      narrativeThreads: []
    };
  }

  /**
   * Create empty Ancestral Temple state
   */
  private createEmptyTemple(): AncestralTempleState {
    return {
      ladder: {
        generations: [],
        currentPilgrimIndex: 0,
        lineageTheme: ''
      },
      threads: [],
      activeRituals: [],
      pilgrimPosition: {
        generationIndex: 0,
        role: 'inheritor'
      }
    };
  }

  /**
   * Create empty Mythos state
   */
  private createEmptyMythos(): MythosCodexState {
    return {
      hypergraph: {
        nodes: [],
        edges: [],
        clusters: []
      },
      activeArchetypes: [],
      shadowWork: {
        identifiedShadows: [],
        integrationProgress: 0
      },
      giftActivation: {
        discoveredGifts: [],
        activationProgress: 0
      }
    };
  }

  /**
   * Create empty Profiling state
   */
  private createEmptyProfiling(): ProfilingState {
    return {
      workStyle: '',
      personalityType: '',
      strengths: [],
      challenges: []
    };
  }

  /**
   * Create empty Ritual Calendar state
   */
  private createEmptyRitualCalendar(): RitualCalendarState {
    return {
      windows: [],
      upcomingWindows: [],
      completedRituals: []
    };
  }

  /**
   * Create empty Journey state
   */
  private createEmptyJourney(): PilgrimJourneyState {
    return {
      currentPhase: 'awakening',
      completedPhases: [],
      milestones: []
    };
  }

  /**
   * Create full sync status
   */
  private createFullSyncStatus(): SyncStatus {
    return {
      mingPanPro: true,
      narrativeCockpit: true,
      ancestralTemple: true,
      mythosCodex: true,
      profilingDashboard: true,
      ritualCalendar: true,
      pilgrimJourney: true
    };
  }

  // ==================== STATE ACCESS ====================

  /**
   * Get current Cathedral state
   */
  getState(): CathedralState {
    return { ...this.state };
  }

  /**
   * Get specific layer state
   */
  getLayer<K extends keyof CathedralState>(layer: K): CathedralState[K] {
    return this.state[layer];
  }

  // ==================== STATE UPDATES ====================

  /**
   * Update Ming Pan Pro layer
   */
  updateMingPanPro(update: Partial<MingPanProState>): void {
    this.state.mingPanPro = { ...this.state.mingPanPro, ...update };
    this.queueSync('mingPanPro', update);
    this.propagateChanges('mingPanPro');
  }

  /**
   * Update Narrative Cockpit layer
   */
  updateNarrativeCockpit(update: Partial<NarrativeCockpitState>): void {
    this.state.narrativeCockpit = { ...this.state.narrativeCockpit, ...update };
    this.queueSync('narrativeCockpit', update);
    this.propagateChanges('narrativeCockpit');
  }

  /**
   * Update Ancestral Temple layer
   */
  updateAncestralTemple(update: Partial<AncestralTempleState>): void {
    this.state.ancestralTemple = { ...this.state.ancestralTemple, ...update };
    this.queueSync('ancestralTemple', update);
    this.propagateChanges('ancestralTemple');
  }

  /**
   * Update Mythos Codex layer
   */
  updateMythosCodex(update: Partial<MythosCodexState>): void {
    this.state.mythosCodex = { ...this.state.mythosCodex, ...update };
    this.queueSync('mythosCodex', update);
    this.propagateChanges('mythosCodex');
  }

  /**
   * Update Profiling Dashboard layer
   */
  updateProfilingDashboard(update: Partial<ProfilingState>): void {
    this.state.profilingDashboard = { ...this.state.profilingDashboard, ...update };
    this.queueSync('profilingDashboard', update);
    this.propagateChanges('profilingDashboard');
  }

  /**
   * Update Ritual Calendar layer
   */
  updateRitualCalendar(update: Partial<RitualCalendarState>): void {
    this.state.ritualCalendar = { ...this.state.ritualCalendar, ...update };
    this.queueSync('ritualCalendar', update);
    this.propagateChanges('ritualCalendar');
  }

  /**
   * Update Pilgrim Journey layer
   */
  updatePilgrimJourney(update: Partial<PilgrimJourneyState>): void {
    this.state.pilgrimJourney = { ...this.state.pilgrimJourney, ...update };
    this.queueSync('pilgrimJourney', update);
    this.propagateChanges('pilgrimJourney');
  }

  // ==================== SYNC & PROPAGATION ====================

  /**
   * Queue a sync event
   */
  private queueSync(layer: string, data: unknown): void {
    this.syncQueue.push({
      layer,
      data,
      timestamp: new Date()
    });

    this.state.orchestrationMeta.lastUpdated = new Date();
    this.state.orchestrationMeta.syncStatus[layer as keyof SyncStatus] = true;
  }

  /**
   * Propagate changes across layers
   */
  private propagateChanges(sourceLayer: string): void {
    const propagationRules = this.getPropagationRules();
    const targetLayers = propagationRules[sourceLayer] || [];

    targetLayers.forEach(target => {
      this.syncLayers(sourceLayer, target);
    });

    this.updateCoherenceScore();
    this.notifyListeners(sourceLayer);
  }

  /**
   * Get propagation rules
   */
  private getPropagationRules(): Record<string, string[]> {
    return {
      'mingPanPro': ['narrativeCockpit', 'ancestralTemple', 'mythosCodex', 'ritualCalendar'],
      'narrativeCockpit': ['pilgrimJourney', 'mythosCodex'],
      'ancestralTemple': ['narrativeCockpit', 'ritualCalendar', 'mythosCodex'],
      'mythosCodex': ['narrativeCockpit', 'pilgrimJourney'],
      'profilingDashboard': ['narrativeCockpit', 'mythosCodex', 'pilgrimJourney'],
      'ritualCalendar': ['pilgrimJourney', 'ancestralTemple'],
      'pilgrimJourney': ['narrativeCockpit']
    };
  }

  /**
   * Sync two layers
   */
  private syncLayers(source: string, target: string): void {
    // Mark target as needing sync
    this.state.orchestrationMeta.syncStatus[target as keyof SyncStatus] = false;

    // Apply layer-specific sync logic
    switch (`${source}->${target}`) {
      case 'mingPanPro->narrativeCockpit':
        this.syncMingPanToNarrative();
        break;
      case 'mingPanPro->ancestralTemple':
        this.syncMingPanToTemple();
        break;
      case 'mingPanPro->mythosCodex':
        this.syncMingPanToMythos();
        break;
      case 'mingPanPro->ritualCalendar':
        this.syncMingPanToRitual();
        break;
      case 'ancestralTemple->ritualCalendar':
        this.syncTempleToRitual();
        break;
      case 'mythosCodex->pilgrimJourney':
        this.syncMythosToJourney();
        break;
    }

    // Mark sync complete
    this.state.orchestrationMeta.syncStatus[target as keyof SyncStatus] = true;
  }

  /**
   * Sync Ming Pan Pro to Narrative Cockpit
   */
  private syncMingPanToNarrative(): void {
    const { interactions, luckPillars } = this.state.mingPanPro;

    // Convert interactions to story beats
    const newBeats: StoryBeat[] = interactions.map((i, idx) => ({
      id: `beat-${idx}`,
      title: i.type,
      description: i.description,
      descriptionZh: i.descriptionZh,
      age: 0,
      intensity: i.severity || 50
    }));

    // Update emotional arc based on interaction severity
    const avgIntensity = newBeats.reduce((sum, b) => sum + b.intensity, 0) / (newBeats.length || 1);
    const trajectory: EmotionalArc['trajectory'] = avgIntensity > 70 ? 'transforming' :
                                                    avgIntensity > 50 ? 'rising' :
                                                    avgIntensity > 30 ? 'stable' : 'falling';

    this.state.narrativeCockpit.emotionalArc.trajectory = trajectory;
  }

  /**
   * Sync Ming Pan Pro to Ancestral Temple
   */
  private syncMingPanToTemple(): void {
    const { fourPillars } = this.state.mingPanPro;

    // Year pillar represents ancestral energy
    if (fourPillars.year.stem && fourPillars.year.branch) {
      // Could update pilgrim position based on year pillar
      // This is where BaZi meets lineage
    }
  }

  /**
   * Sync Ming Pan Pro to Mythos Codex
   */
  private syncMingPanToMythos(): void {
    const { interactions, dayMasterStrength } = this.state.mingPanPro;

    // Map interactions to hypergraph nodes
    interactions.forEach(i => {
      const nodeType = this.mapInteractionToNodeType(i.type);
      if (!this.state.mythosCodex.hypergraph.nodes.find(n => n.id === `bazi-${i.type}`)) {
        this.state.mythosCodex.hypergraph.nodes.push({
          id: `bazi-${i.type}`,
          label: i.type,
          type: nodeType,
          data: { source: 'mingPanPro', interaction: i }
        });
      }
    });
  }

  /**
   * Map BaZi interaction to hypergraph node type
   */
  private mapInteractionToNodeType(type: string): string {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('clash') || typeLower.includes('punishment')) return 'shadow';
    if (typeLower.includes('combination') || typeLower.includes('harmony')) return 'gift';
    if (typeLower.includes('destruction')) return 'wound';
    return 'theme';
  }

  /**
   * Sync Ming Pan Pro to Ritual Calendar
   */
  private syncMingPanToRitual(): void {
    const { luckPillars, interactions } = this.state.mingPanPro;

    // Upcoming luck pillars could trigger ritual windows
    // This is placeholder for full ritual timing integration
  }

  /**
   * Sync Ancestral Temple to Ritual Calendar
   */
  private syncTempleToRitual(): void {
    const { activeRituals, threads } = this.state.ancestralTemple;

    // Active threads could activate ritual windows
    // Placeholder for full integration
  }

  /**
   * Sync Mythos Codex to Pilgrim Journey
   */
  private syncMythosToJourney(): void {
    const { activeArchetypes, shadowWork, giftActivation } = this.state.mythosCodex;

    // Shadow work progress affects journey phase
    if (shadowWork.integrationProgress > 80) {
      this.state.pilgrimJourney.currentPhase = 'integration';
    } else if (shadowWork.integrationProgress > 50) {
      this.state.pilgrimJourney.currentPhase = 'transformation';
    } else if (shadowWork.identifiedShadows.length > 0) {
      this.state.pilgrimJourney.currentPhase = 'descent';
    }
  }

  /**
   * Update coherence score
   */
  private updateCoherenceScore(): void {
    const syncStatus = this.state.orchestrationMeta.syncStatus;
    const syncedLayers = Object.values(syncStatus).filter(Boolean).length;
    const totalLayers = Object.keys(syncStatus).length;

    this.state.orchestrationMeta.coherenceScore = Math.round((syncedLayers / totalLayers) * 100);
  }

  // ==================== EVENT SYSTEM ====================

  /**
   * Subscribe to orchestration events
   */
  subscribe(layer: string, listener: OrchestrationListener): () => void {
    const listeners = this.listeners.get(layer) || [];
    listeners.push(listener);
    this.listeners.set(layer, listeners);

    return () => {
      const ls = this.listeners.get(layer) || [];
      const idx = ls.indexOf(listener);
      if (idx > -1) ls.splice(idx, 1);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(layer: string): void {
    const listeners = this.listeners.get(layer) || [];
    const allListeners = this.listeners.get('*') || [];

    const event: OrchestrationEvent = {
      layer,
      state: this.state,
      timestamp: new Date()
    };

    [...listeners, ...allListeners].forEach(listener => listener(event));
  }

  // ==================== FULL ORCHESTRATION ====================

  /**
   * Run full Cathedral orchestration
   */
  orchestrate(): OrchestrationResult {
    const startTime = Date.now();
    const issues: string[] = [];
    const synced: string[] = [];

    // Sync all layers
    const layers = [
      'mingPanPro',
      'narrativeCockpit',
      'ancestralTemple',
      'mythosCodex',
      'profilingDashboard',
      'ritualCalendar',
      'pilgrimJourney'
    ];

    layers.forEach(layer => {
      try {
        this.propagateChanges(layer);
        synced.push(layer);
      } catch (e) {
        issues.push(`Failed to sync ${layer}: ${e}`);
      }
    });

    // Final coherence check
    this.updateCoherenceScore();

    return {
      success: issues.length === 0,
      duration: Date.now() - startTime,
      coherenceScore: this.state.orchestrationMeta.coherenceScore,
      syncedLayers: synced,
      issues
    };
  }

  /**
   * Get Cathedral status report
   */
  getStatusReport(lang: 'en' | 'zh' = 'en'): CathedralStatusReport {
    const { orchestrationMeta } = this.state;

    return {
      pilgrimId: this.state.pilgrimId,
      lastUpdated: orchestrationMeta.lastUpdated,
      version: orchestrationMeta.version,
      coherenceScore: orchestrationMeta.coherenceScore,
      syncStatus: orchestrationMeta.syncStatus,
      activeLayers: this.getActiveLayers(),
      currentPhase: this.state.pilgrimJourney.currentPhase,
      summary: this.generateSummary(lang)
    };
  }

  /**
   * Get active layers
   */
  private getActiveLayers(): string[] {
    const active: string[] = [];

    if (this.state.mingPanPro.fourPillars.day.stem) active.push('mingPanPro');
    if (this.state.narrativeCockpit.storyBeats.length > 0) active.push('narrativeCockpit');
    if (this.state.ancestralTemple.threads.length > 0) active.push('ancestralTemple');
    if (this.state.mythosCodex.hypergraph.nodes.length > 0) active.push('mythosCodex');
    if (this.state.profilingDashboard.workStyle) active.push('profilingDashboard');
    if (this.state.ritualCalendar.windows.length > 0) active.push('ritualCalendar');
    if (this.state.pilgrimJourney.milestones.length > 0) active.push('pilgrimJourney');

    return active;
  }

  /**
   * Generate summary
   */
  private generateSummary(lang: 'en' | 'zh'): string {
    const phase = this.state.pilgrimJourney.currentPhase;
    const coherence = this.state.orchestrationMeta.coherenceScore;

    if (lang === 'zh') {
      return `行者处于「${this.getPhaseNameZh(phase)}」阶段。大教堂一致性：${coherence}%。`;
    }
    return `The pilgrim is in the ${phase} phase. Cathedral coherence: ${coherence}%.`;
  }

  /**
   * Get phase name in Chinese
   */
  private getPhaseNameZh(phase: JourneyPhase): string {
    const names: Record<JourneyPhase, string> = {
      'awakening': '觉醒',
      'descent': '下降',
      'underworld': '冥界',
      'transformation': '蜕变',
      'return': '归来',
      'integration': '整合',
      'mastery': '精通'
    };
    return names[phase];
  }
}

// ==================== TYPES ====================

export interface SyncEvent {
  layer: string;
  data: unknown;
  timestamp: Date;
}

export type OrchestrationListener = (event: OrchestrationEvent) => void;

export interface OrchestrationEvent {
  layer: string;
  state: CathedralState;
  timestamp: Date;
}

export interface OrchestrationResult {
  success: boolean;
  duration: number;
  coherenceScore: number;
  syncedLayers: string[];
  issues: string[];
}

export interface CathedralStatusReport {
  pilgrimId: string;
  lastUpdated: Date;
  version: string;
  coherenceScore: number;
  syncStatus: SyncStatus;
  activeLayers: string[];
  currentPhase: JourneyPhase;
  summary: string;
}

// ==================== FACTORY ====================

/**
 * Create a Grand Orchestration Engine instance
 */
export function createGrandOrchestrationEngine(
  initialState?: Partial<CathedralState>
): GrandOrchestrationEngine {
  return new GrandOrchestrationEngine(initialState);
}

/**
 * Create Cathedral state from birth data
 */
export function createCathedralFromBirthData(
  birthData: BirthData,
  options?: { locale?: 'en' | 'zh' }
): GrandOrchestrationEngine {
  const engine = new GrandOrchestrationEngine({
    birthData
  });

  // The engine would be populated by other modules
  // This is the entry point for the full reading pipeline

  return engine;
}

// ==================== EXPORTS ====================

export {
  GrandOrchestrationEngine,
  createGrandOrchestrationEngine,
  createCathedralFromBirthData
};
