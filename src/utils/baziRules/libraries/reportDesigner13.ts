/**
 * ============================================
 * PRO REPORT DESIGNER 13.0
 * Interplanetary/Cosmic Governance
 *
 * The Cathedral's cosmic governance layer —
 * governing metaphysical coherence across
 * worlds, species, civilizations, and timelines.
 * ============================================
 */

// ==================== TYPE DEFINITIONS ====================

/**
 * Cosmic scale levels
 */
export type CosmicScale =
  | 'planetary'      // Single world
  | 'lunar'          // Moon/satellite
  | 'solar'          // Star system
  | 'stellar'        // Multiple star systems
  | 'galactic'       // Galaxy-wide
  | 'intergalactic'  // Between galaxies
  | 'universal';     // Universe-wide

/**
 * Civilization development stages
 */
export type CivilizationStage =
  | 'nascent'        // Pre-metaphysical awareness
  | 'awakening'      // Early metaphysical understanding
  | 'developing'     // Growing metaphysical practice
  | 'mature'         // Established metaphysical systems
  | 'transcendent'   // Beyond material metaphysics
  | 'cosmic';        // Universe-integrated consciousness

/**
 * Species consciousness types
 */
export type ConsciousnessType =
  | 'individual'     // Single-entity consciousness
  | 'collective'     // Hive/shared consciousness
  | 'distributed'    // Networked consciousness
  | 'temporal'       // Time-spanning consciousness
  | 'dimensional'    // Multi-dimensional awareness
  | 'unified';       // Universal consciousness

/**
 * Cosmic element mapping (beyond planetary elements)
 */
export type CosmicElement =
  | 'stellar_fire'   // Star energy
  | 'void_water'     // Dark matter flow
  | 'cosmic_earth'   // Planetary bodies
  | 'solar_wind'     // Stellar winds (Metal/Air)
  | 'dark_energy'    // Expansion force (Wood/Growth)
  | 'antimatter'     // Opposition force
  | 'quantum_foam'   // Substrate reality
  | 'gravity_well';  // Binding force

/**
 * A world/planet in the cosmic network
 */
export interface CosmicWorld {
  id: string;
  name: {
    en: string;
    zh: string;
    native?: string;  // World's own name
  };
  location: {
    galaxy: string;
    starSystem: string;
    coordinates: [number, number, number];  // Galactic coordinates
  };
  scale: CosmicScale;
  civilizationStage: CivilizationStage;
  dominantConsciousness: ConsciousnessType;
  metaphysicalSystems: WorldMetaphysicalSystem[];
  cosmicElements: CosmicElementBalance;
  timeDilation: number;  // Relative to cosmic standard
  createdAt: string;
  lastContact: string;
}

/**
 * World's metaphysical system
 */
export interface WorldMetaphysicalSystem {
  id: string;
  name: string;
  type: 'elemental' | 'temporal' | 'consciousness' | 'energy' | 'hybrid';
  elements: string[];
  cycleLength: number;  // In local time units
  accuracy: number;     // 0-1 alignment with cosmic truth
  practitioners: number;  // Estimated
}

/**
 * Cosmic element balance for a world
 */
export interface CosmicElementBalance {
  stellar_fire: number;
  void_water: number;
  cosmic_earth: number;
  solar_wind: number;
  dark_energy: number;
  antimatter: number;
  quantum_foam: number;
  gravity_well: number;
}

/**
 * A species in the cosmic network
 */
export interface CosmicSpecies {
  id: string;
  name: {
    en: string;
    zh: string;
    native?: string;
  };
  homeworld: string;  // CosmicWorld ID
  consciousnessType: ConsciousnessType;
  lifespan: {
    average: number;  // In cosmic standard years
    max: number;
  };
  metaphysicalAptitude: {
    elemental: number;    // 0-1
    temporal: number;     // 0-1
    dimensional: number;  // 0-1
    spiritual: number;    // 0-1
  };
  cosmicRole: CosmicRole;
  population: number;
  expansionState: 'confined' | 'exploring' | 'colonizing' | 'integrated';
}

/**
 * Species role in cosmic metaphysics
 */
export type CosmicRole =
  | 'guardian'     // Protectors of metaphysical balance
  | 'weaver'       // Creators of new patterns
  | 'observer'     // Recorders of cosmic truth
  | 'catalyst'     // Agents of change
  | 'harmonizer'   // Balancers of forces
  | 'explorer'     // Seekers of new understanding
  | 'anchor';      // Stabilizers of reality

/**
 * A civilization (species + culture + development)
 */
export interface CosmicCivilization {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  species: string[];  // CosmicSpecies IDs
  worlds: string[];   // CosmicWorld IDs
  stage: CivilizationStage;
  metaphysicalUnity: number;  // 0-1 internal coherence
  cosmicAlignment: number;    // 0-1 alignment with cosmic truth
  contributions: CivilizationContribution[];
  challenges: CivilizationChallenge[];
  relationships: CivilizationRelationship[];
}

/**
 * Civilization's contributions to cosmic metaphysics
 */
export interface CivilizationContribution {
  type: 'discovery' | 'system' | 'practice' | 'technology' | 'wisdom';
  name: string;
  description: {
    en: string;
    zh: string;
  };
  cosmicValue: number;  // 0-1 universal significance
  adoptionRate: number; // 0-1 across known civilizations
}

/**
 * Civilization's metaphysical challenges
 */
export interface CivilizationChallenge {
  type: 'imbalance' | 'conflict' | 'stagnation' | 'corruption' | 'isolation';
  severity: number;  // 0-1
  description: {
    en: string;
    zh: string;
  };
  recommendedIntervention: CosmicIntervention;
}

/**
 * Relationship between civilizations
 */
export interface CivilizationRelationship {
  civilizationId: string;
  type: 'alliance' | 'trade' | 'mentorship' | 'conflict' | 'observation' | 'unknown';
  strength: number;     // 0-1
  metaphysicalExchange: number;  // 0-1 knowledge sharing
  compatibility: number;  // 0-1 elemental harmony
}

/**
 * Cosmic intervention types
 */
export interface CosmicIntervention {
  type: 'guidance' | 'energy_transfer' | 'timeline_adjustment' | 'consciousness_uplift' | 'isolation' | 'integration';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  scope: CosmicScale;
  description: {
    en: string;
    zh: string;
  };
  expectedOutcome: string;
  risks: string[];
}

/**
 * Cosmic timing arc (spanning multiple worlds)
 */
export interface CosmicTimingArc {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  affectedWorlds: string[];
  affectedCivilizations: string[];
  startTime: string;   // Cosmic standard time
  endTime: string;
  peakTime: string;
  dominantElement: CosmicElement;
  intensity: number;   // 0-1
  type: 'opportunity' | 'challenge' | 'transformation' | 'alignment' | 'disruption';
  predictions: CosmicPrediction[];
}

/**
 * Cosmic-scale prediction
 */
export interface CosmicPrediction {
  target: 'world' | 'species' | 'civilization' | 'region';
  targetId: string;
  probability: number;  // 0-1
  outcome: {
    en: string;
    zh: string;
  };
  conditionalFactors: string[];
}

/**
 * Cosmic governance directive
 */
export interface CosmicGovernanceDirective {
  id: string;
  type: 'balance' | 'intervention' | 'quarantine' | 'integration' | 'observation' | 'acceleration' | 'protection';
  priority: 'routine' | 'elevated' | 'urgent' | 'emergency' | 'existential';
  scope: {
    scale: CosmicScale;
    targets: string[];  // World/Civilization IDs
  };
  rationale: {
    en: string;
    zh: string;
  };
  actions: DirectiveAction[];
  expectedDuration: number;  // Cosmic standard years
  successCriteria: string[];
  issuedAt: string;
  expiresAt: string;
}

/**
 * Action within a directive
 */
export interface DirectiveAction {
  sequence: number;
  action: string;
  responsible: string;  // Civilization/Entity ID
  timeline: string;
  verification: string;
}

/**
 * Cosmic network state
 */
export interface CosmicNetworkState {
  id: string;
  timestamp: string;
  worlds: Map<string, CosmicWorld>;
  species: Map<string, CosmicSpecies>;
  civilizations: Map<string, CosmicCivilization>;
  activeTimingArcs: CosmicTimingArc[];
  activeDirectives: CosmicGovernanceDirective[];
  cosmicBalance: CosmicElementBalance;
  overallAlignment: number;  // 0-1
  anomalies: CosmicAnomaly[];
  communications: InterstellarCommunication[];
}

/**
 * Cosmic anomaly
 */
export interface CosmicAnomaly {
  id: string;
  type: 'elemental_surge' | 'timeline_fracture' | 'consciousness_rift' | 'dimensional_bleed' | 'void_intrusion';
  location: {
    scale: CosmicScale;
    coordinates: [number, number, number];
    affectedWorlds: string[];
  };
  severity: number;  // 0-1
  detectedAt: string;
  status: 'monitoring' | 'investigating' | 'containing' | 'resolving' | 'resolved';
  description: {
    en: string;
    zh: string;
  };
}

/**
 * Interstellar communication
 */
export interface InterstellarCommunication {
  id: string;
  from: {
    worldId: string;
    civilizationId: string;
  };
  to: {
    worldId: string;
    civilizationId: string;
  };
  type: 'greeting' | 'knowledge_share' | 'warning' | 'request' | 'response' | 'broadcast';
  content: {
    en: string;
    zh: string;
  };
  metaphysicalPayload?: {
    elements: CosmicElement[];
    timing: string;
    intention: string;
  };
  sentAt: string;
  receivedAt?: string;
  transitTime: number;  // Light years equivalent
}

// ==================== COSMIC ELEMENT MAPPINGS ====================

/**
 * Mapping planetary elements to cosmic elements
 */
export const PLANETARY_TO_COSMIC_ELEMENTS: Record<string, CosmicElement[]> = {
  // BaZi elements
  'wood': ['dark_energy', 'quantum_foam'],
  'fire': ['stellar_fire', 'antimatter'],
  'earth': ['cosmic_earth', 'gravity_well'],
  'metal': ['solar_wind', 'quantum_foam'],
  'water': ['void_water', 'dark_energy'],

  // Western elements
  'air': ['solar_wind', 'quantum_foam'],

  // Vedic elements
  'ether': ['quantum_foam', 'void_water'],
  'akasha': ['quantum_foam', 'dark_energy'],
};

/**
 * Cosmic element interactions
 */
export const COSMIC_ELEMENT_INTERACTIONS: Record<string, Record<string, number>> = {
  'stellar_fire': {
    'void_water': -0.3,
    'cosmic_earth': 0.2,
    'solar_wind': 0.5,
    'dark_energy': 0.1,
    'antimatter': -0.8,
    'quantum_foam': 0.3,
    'gravity_well': -0.2,
  },
  'void_water': {
    'stellar_fire': -0.3,
    'cosmic_earth': 0.4,
    'solar_wind': 0.1,
    'dark_energy': 0.6,
    'antimatter': 0.2,
    'quantum_foam': 0.5,
    'gravity_well': 0.3,
  },
  'cosmic_earth': {
    'stellar_fire': 0.2,
    'void_water': 0.4,
    'solar_wind': -0.1,
    'dark_energy': -0.2,
    'antimatter': -0.4,
    'quantum_foam': 0.3,
    'gravity_well': 0.8,
  },
  'solar_wind': {
    'stellar_fire': 0.5,
    'void_water': 0.1,
    'cosmic_earth': -0.1,
    'dark_energy': 0.3,
    'antimatter': -0.3,
    'quantum_foam': 0.4,
    'gravity_well': -0.5,
  },
  'dark_energy': {
    'stellar_fire': 0.1,
    'void_water': 0.6,
    'cosmic_earth': -0.2,
    'solar_wind': 0.3,
    'antimatter': 0.4,
    'quantum_foam': 0.7,
    'gravity_well': -0.8,
  },
  'antimatter': {
    'stellar_fire': -0.8,
    'void_water': 0.2,
    'cosmic_earth': -0.4,
    'solar_wind': -0.3,
    'dark_energy': 0.4,
    'quantum_foam': 0.5,
    'gravity_well': -0.6,
  },
  'quantum_foam': {
    'stellar_fire': 0.3,
    'void_water': 0.5,
    'cosmic_earth': 0.3,
    'solar_wind': 0.4,
    'dark_energy': 0.7,
    'antimatter': 0.5,
    'gravity_well': 0.2,
  },
  'gravity_well': {
    'stellar_fire': -0.2,
    'void_water': 0.3,
    'cosmic_earth': 0.8,
    'solar_wind': -0.5,
    'dark_energy': -0.8,
    'antimatter': -0.6,
    'quantum_foam': 0.2,
  },
};

// ==================== COSMIC NETWORK MANAGER ====================

/**
 * Manages the cosmic network of worlds, species, and civilizations
 */
export class CosmicNetworkManager {
  private state: CosmicNetworkState;

  constructor() {
    this.state = this.initializeState();
  }

  private initializeState(): CosmicNetworkState {
    return {
      id: `cosmic-network-${Date.now()}`,
      timestamp: new Date().toISOString(),
      worlds: new Map(),
      species: new Map(),
      civilizations: new Map(),
      activeTimingArcs: [],
      activeDirectives: [],
      cosmicBalance: this.getDefaultCosmicBalance(),
      overallAlignment: 0.5,
      anomalies: [],
      communications: [],
    };
  }

  private getDefaultCosmicBalance(): CosmicElementBalance {
    return {
      stellar_fire: 0.125,
      void_water: 0.125,
      cosmic_earth: 0.125,
      solar_wind: 0.125,
      dark_energy: 0.125,
      antimatter: 0.125,
      quantum_foam: 0.125,
      gravity_well: 0.125,
    };
  }

  /**
   * Register a new world in the cosmic network
   */
  registerWorld(world: CosmicWorld): void {
    this.state.worlds.set(world.id, world);
    this.recalculateCosmicBalance();
  }

  /**
   * Register a new species
   */
  registerSpecies(species: CosmicSpecies): void {
    this.state.species.set(species.id, species);
  }

  /**
   * Register a new civilization
   */
  registerCivilization(civilization: CosmicCivilization): void {
    this.state.civilizations.set(civilization.id, civilization);
    this.recalculateOverallAlignment();
  }

  /**
   * Get world by ID
   */
  getWorld(id: string): CosmicWorld | undefined {
    return this.state.worlds.get(id);
  }

  /**
   * Get species by ID
   */
  getSpecies(id: string): CosmicSpecies | undefined {
    return this.state.species.get(id);
  }

  /**
   * Get civilization by ID
   */
  getCivilization(id: string): CosmicCivilization | undefined {
    return this.state.civilizations.get(id);
  }

  /**
   * Get all worlds
   */
  getAllWorlds(): CosmicWorld[] {
    return Array.from(this.state.worlds.values());
  }

  /**
   * Get all civilizations
   */
  getAllCivilizations(): CosmicCivilization[] {
    return Array.from(this.state.civilizations.values());
  }

  /**
   * Recalculate cosmic element balance
   */
  private recalculateCosmicBalance(): void {
    const worlds = this.getAllWorlds();
    if (worlds.length === 0) return;

    const totals: CosmicElementBalance = this.getDefaultCosmicBalance();
    const elements = Object.keys(totals) as (keyof CosmicElementBalance)[];

    for (const element of elements) {
      let sum = 0;
      for (const world of worlds) {
        sum += world.cosmicElements[element];
      }
      totals[element] = sum / worlds.length;
    }

    this.state.cosmicBalance = totals;
  }

  /**
   * Recalculate overall alignment
   */
  private recalculateOverallAlignment(): void {
    const civilizations = this.getAllCivilizations();
    if (civilizations.length === 0) return;

    let sum = 0;
    for (const civ of civilizations) {
      sum += civ.cosmicAlignment;
    }
    this.state.overallAlignment = sum / civilizations.length;
  }

  /**
   * Get current cosmic state
   */
  getState(): CosmicNetworkState {
    return this.state;
  }
}

// ==================== COSMIC TIMING ENGINE ====================

/**
 * Calculate cosmic timing arcs affecting multiple worlds
 */
export function calculateCosmicTimingArcs(
  state: CosmicNetworkState,
  timeRange: { start: string; end: string }
): CosmicTimingArc[] {
  const arcs: CosmicTimingArc[] = [];
  const worlds = Array.from(state.worlds.values());

  // Find elemental surge patterns
  const elementalSurges = detectElementalSurges(worlds);
  for (const surge of elementalSurges) {
    arcs.push({
      id: `arc-surge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: {
        en: `${surge.element} Cosmic Surge`,
        zh: `${getCosmicElementZh(surge.element)}宇宙涌动`,
      },
      affectedWorlds: surge.worldIds,
      affectedCivilizations: getCivilizationsOnWorlds(state, surge.worldIds),
      startTime: timeRange.start,
      endTime: timeRange.end,
      peakTime: calculatePeakTime(timeRange.start, timeRange.end),
      dominantElement: surge.element,
      intensity: surge.intensity,
      type: surge.intensity > 0.7 ? 'transformation' : 'opportunity',
      predictions: generateSurgePredictions(state, surge),
    });
  }

  // Find alignment windows
  const alignmentWindows = detectAlignmentWindows(worlds);
  for (const window of alignmentWindows) {
    arcs.push({
      id: `arc-align-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: {
        en: 'Cosmic Alignment Window',
        zh: '宇宙校准窗口',
      },
      affectedWorlds: window.worldIds,
      affectedCivilizations: getCivilizationsOnWorlds(state, window.worldIds),
      startTime: timeRange.start,
      endTime: timeRange.end,
      peakTime: window.peakTime,
      dominantElement: 'quantum_foam',
      intensity: window.intensity,
      type: 'alignment',
      predictions: generateAlignmentPredictions(state, window),
    });
  }

  return arcs;
}

/**
 * Get Chinese name for cosmic element
 */
function getCosmicElementZh(element: CosmicElement): string {
  const map: Record<CosmicElement, string> = {
    'stellar_fire': '恒星之火',
    'void_water': '虚空之水',
    'cosmic_earth': '宇宙之土',
    'solar_wind': '太阳风',
    'dark_energy': '暗能量',
    'antimatter': '反物质',
    'quantum_foam': '量子泡沫',
    'gravity_well': '引力井',
  };
  return map[element];
}

/**
 * Detect elemental surges across worlds
 */
function detectElementalSurges(worlds: CosmicWorld[]): Array<{
  element: CosmicElement;
  worldIds: string[];
  intensity: number;
}> {
  const surges: Array<{
    element: CosmicElement;
    worldIds: string[];
    intensity: number;
  }> = [];

  const elements: CosmicElement[] = [
    'stellar_fire', 'void_water', 'cosmic_earth', 'solar_wind',
    'dark_energy', 'antimatter', 'quantum_foam', 'gravity_well'
  ];

  for (const element of elements) {
    const highWorlds = worlds.filter(w => w.cosmicElements[element] > 0.3);
    if (highWorlds.length >= 2) {
      const avgIntensity = highWorlds.reduce((sum, w) => sum + w.cosmicElements[element], 0) / highWorlds.length;
      surges.push({
        element,
        worldIds: highWorlds.map(w => w.id),
        intensity: avgIntensity,
      });
    }
  }

  return surges;
}

/**
 * Detect alignment windows
 */
function detectAlignmentWindows(worlds: CosmicWorld[]): Array<{
  worldIds: string[];
  peakTime: string;
  intensity: number;
}> {
  // Simplified: find worlds with similar elemental profiles
  const windows: Array<{
    worldIds: string[];
    peakTime: string;
    intensity: number;
  }> = [];

  for (let i = 0; i < worlds.length; i++) {
    for (let j = i + 1; j < worlds.length; j++) {
      const similarity = calculateElementalSimilarity(
        worlds[i].cosmicElements,
        worlds[j].cosmicElements
      );
      if (similarity > 0.7) {
        windows.push({
          worldIds: [worlds[i].id, worlds[j].id],
          peakTime: new Date().toISOString(),
          intensity: similarity,
        });
      }
    }
  }

  return windows;
}

/**
 * Calculate elemental similarity between two worlds
 */
function calculateElementalSimilarity(a: CosmicElementBalance, b: CosmicElementBalance): number {
  const elements = Object.keys(a) as (keyof CosmicElementBalance)[];
  let sumDiff = 0;
  for (const element of elements) {
    sumDiff += Math.abs(a[element] - b[element]);
  }
  return 1 - (sumDiff / elements.length);
}

/**
 * Get civilizations present on given worlds
 */
function getCivilizationsOnWorlds(state: CosmicNetworkState, worldIds: string[]): string[] {
  const civIds: string[] = [];
  for (const civ of state.civilizations.values()) {
    if (civ.worlds.some(w => worldIds.includes(w))) {
      civIds.push(civ.id);
    }
  }
  return civIds;
}

/**
 * Calculate peak time between two dates
 */
function calculatePeakTime(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const peakDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
  return peakDate.toISOString();
}

/**
 * Generate predictions for elemental surge
 */
function generateSurgePredictions(
  state: CosmicNetworkState,
  surge: { element: CosmicElement; worldIds: string[]; intensity: number }
): CosmicPrediction[] {
  const predictions: CosmicPrediction[] = [];

  for (const worldId of surge.worldIds) {
    const world = state.worlds.get(worldId);
    if (!world) continue;

    predictions.push({
      target: 'world',
      targetId: worldId,
      probability: surge.intensity * 0.8,
      outcome: {
        en: `Heightened ${surge.element.replace('_', ' ')} activity expected`,
        zh: `预期${getCosmicElementZh(surge.element)}活动增强`,
      },
      conditionalFactors: [
        `World's current ${surge.element} level: ${world.cosmicElements[surge.element].toFixed(2)}`,
        `Civilization stage: ${world.civilizationStage}`,
      ],
    });
  }

  return predictions;
}

/**
 * Generate predictions for alignment window
 */
function generateAlignmentPredictions(
  state: CosmicNetworkState,
  window: { worldIds: string[]; peakTime: string; intensity: number }
): CosmicPrediction[] {
  return window.worldIds.map(worldId => ({
    target: 'world' as const,
    targetId: worldId,
    probability: window.intensity * 0.9,
    outcome: {
      en: 'Enhanced inter-world communication and understanding possible',
      zh: '可能增强跨世界沟通和理解',
    },
    conditionalFactors: [
      `Alignment intensity: ${window.intensity.toFixed(2)}`,
      `Peak time: ${window.peakTime}`,
    ],
  }));
}

// ==================== INTERSTELLAR COMMUNICATION ====================

/**
 * Send interstellar communication
 */
export function sendInterstellarCommunication(
  state: CosmicNetworkState,
  from: { worldId: string; civilizationId: string },
  to: { worldId: string; civilizationId: string },
  message: {
    type: InterstellarCommunication['type'];
    content: { en: string; zh: string };
    metaphysicalPayload?: InterstellarCommunication['metaphysicalPayload'];
  }
): InterstellarCommunication {
  const fromWorld = state.worlds.get(from.worldId);
  const toWorld = state.worlds.get(to.worldId);

  // Calculate transit time based on galactic distance
  const transitTime = fromWorld && toWorld
    ? calculateTransitTime(fromWorld.location.coordinates, toWorld.location.coordinates)
    : 100;

  const communication: InterstellarCommunication = {
    id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    from,
    to,
    type: message.type,
    content: message.content,
    metaphysicalPayload: message.metaphysicalPayload,
    sentAt: new Date().toISOString(),
    transitTime,
  };

  state.communications.push(communication);
  return communication;
}

/**
 * Calculate transit time between coordinates
 */
function calculateTransitTime(
  from: [number, number, number],
  to: [number, number, number]
): number {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Receive pending communications
 */
export function receivePendingCommunications(
  state: CosmicNetworkState,
  civilizationId: string
): InterstellarCommunication[] {
  const now = new Date().getTime();
  const received: InterstellarCommunication[] = [];

  for (const comm of state.communications) {
    if (comm.to.civilizationId === civilizationId && !comm.receivedAt) {
      const sentTime = new Date(comm.sentAt).getTime();
      const transitMs = comm.transitTime * 365.25 * 24 * 60 * 60 * 1000; // Convert light years to ms (simplified)

      if (now >= sentTime + transitMs) {
        comm.receivedAt = new Date().toISOString();
        received.push(comm);
      }
    }
  }

  return received;
}

// ==================== COSMIC GOVERNANCE ENGINE ====================

/**
 * Generate cosmic governance directives
 */
export function generateCosmicDirectives(
  state: CosmicNetworkState
): CosmicGovernanceDirective[] {
  const directives: CosmicGovernanceDirective[] = [];

  // Check for elemental imbalances
  const imbalances = detectCosmicImbalances(state);
  for (const imbalance of imbalances) {
    directives.push(createBalanceDirective(imbalance, state));
  }

  // Check for civilization challenges
  for (const civ of state.civilizations.values()) {
    for (const challenge of civ.challenges) {
      if (challenge.severity > 0.7) {
        directives.push(createInterventionDirective(civ, challenge, state));
      }
    }
  }

  // Check for anomalies
  for (const anomaly of state.anomalies) {
    if (anomaly.status !== 'resolved') {
      directives.push(createAnomalyDirective(anomaly, state));
    }
  }

  // Sort by priority
  const priorityOrder = ['existential', 'emergency', 'urgent', 'elevated', 'routine'];
  directives.sort((a, b) =>
    priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );

  return directives;
}

/**
 * Detect cosmic element imbalances
 */
function detectCosmicImbalances(state: CosmicNetworkState): Array<{
  element: CosmicElement;
  deviation: number;
  affectedWorlds: string[];
}> {
  const imbalances: Array<{
    element: CosmicElement;
    deviation: number;
    affectedWorlds: string[];
  }> = [];

  const idealBalance = 0.125; // Equal distribution
  const elements = Object.keys(state.cosmicBalance) as CosmicElement[];

  for (const element of elements) {
    const deviation = Math.abs(state.cosmicBalance[element] - idealBalance);
    if (deviation > 0.1) {
      const affectedWorlds = Array.from(state.worlds.values())
        .filter(w => Math.abs(w.cosmicElements[element] - idealBalance) > 0.15)
        .map(w => w.id);

      imbalances.push({ element, deviation, affectedWorlds });
    }
  }

  return imbalances;
}

/**
 * Create balance directive
 */
function createBalanceDirective(
  imbalance: { element: CosmicElement; deviation: number; affectedWorlds: string[] },
  state: CosmicNetworkState
): CosmicGovernanceDirective {
  const priority = imbalance.deviation > 0.3 ? 'urgent' :
                   imbalance.deviation > 0.2 ? 'elevated' : 'routine';

  return {
    id: `directive-balance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'balance',
    priority,
    scope: {
      scale: imbalance.affectedWorlds.length > 5 ? 'galactic' : 'stellar',
      targets: imbalance.affectedWorlds,
    },
    rationale: {
      en: `Cosmic ${imbalance.element.replace('_', ' ')} imbalance detected (deviation: ${(imbalance.deviation * 100).toFixed(1)}%)`,
      zh: `检测到宇宙${getCosmicElementZh(imbalance.element)}失衡（偏差：${(imbalance.deviation * 100).toFixed(1)}%）`,
    },
    actions: [
      {
        sequence: 1,
        action: `Monitor ${imbalance.element} levels across affected worlds`,
        responsible: 'cosmic-council',
        timeline: '30 cosmic cycles',
        verification: 'Automated sensor network',
      },
      {
        sequence: 2,
        action: `Implement gradual rebalancing protocols`,
        responsible: 'harmonizer-civilizations',
        timeline: '100 cosmic cycles',
        verification: 'Quarterly element audits',
      },
    ],
    expectedDuration: 100,
    successCriteria: [
      `${imbalance.element} deviation reduced to <5%`,
      'No secondary imbalances triggered',
    ],
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 100).toISOString(),
  };
}

/**
 * Create intervention directive
 */
function createInterventionDirective(
  civ: CosmicCivilization,
  challenge: CivilizationChallenge,
  state: CosmicNetworkState
): CosmicGovernanceDirective {
  const priority = challenge.severity > 0.9 ? 'emergency' :
                   challenge.severity > 0.8 ? 'urgent' : 'elevated';

  return {
    id: `directive-intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'intervention',
    priority,
    scope: {
      scale: 'planetary',
      targets: [civ.id],
    },
    rationale: {
      en: `Civilization ${civ.name.en} facing ${challenge.type} challenge (severity: ${(challenge.severity * 100).toFixed(0)}%)`,
      zh: `文明${civ.name.zh}面临${challenge.type}挑战（严重程度：${(challenge.severity * 100).toFixed(0)}%）`,
    },
    actions: [
      {
        sequence: 1,
        action: challenge.recommendedIntervention.description.en,
        responsible: 'intervention-council',
        timeline: 'Immediate',
        verification: 'Progress reports',
      },
    ],
    expectedDuration: 50,
    successCriteria: [
      `Challenge severity reduced to <30%`,
      'Civilization stability restored',
    ],
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 50).toISOString(),
  };
}

/**
 * Create anomaly directive
 */
function createAnomalyDirective(
  anomaly: CosmicAnomaly,
  state: CosmicNetworkState
): CosmicGovernanceDirective {
  const priority = anomaly.severity > 0.8 ? 'existential' :
                   anomaly.severity > 0.6 ? 'emergency' : 'urgent';

  return {
    id: `directive-anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: anomaly.type === 'void_intrusion' ? 'quarantine' : 'protection',
    priority,
    scope: {
      scale: anomaly.location.scale,
      targets: anomaly.location.affectedWorlds,
    },
    rationale: {
      en: `Cosmic anomaly detected: ${anomaly.type.replace(/_/g, ' ')} (severity: ${(anomaly.severity * 100).toFixed(0)}%)`,
      zh: `检测到宇宙异常：${anomaly.description.zh}（严重程度：${(anomaly.severity * 100).toFixed(0)}%）`,
    },
    actions: [
      {
        sequence: 1,
        action: 'Deploy containment protocols',
        responsible: 'guardian-civilizations',
        timeline: 'Immediate',
        verification: 'Containment field integrity',
      },
      {
        sequence: 2,
        action: 'Analyze anomaly origin and nature',
        responsible: 'observer-civilizations',
        timeline: '10 cosmic cycles',
        verification: 'Analysis report',
      },
      {
        sequence: 3,
        action: 'Implement resolution strategy',
        responsible: 'weaver-civilizations',
        timeline: 'As determined',
        verification: 'Anomaly resolution confirmation',
      },
    ],
    expectedDuration: 200,
    successCriteria: [
      'Anomaly contained or resolved',
      'No permanent damage to affected worlds',
      'Lessons integrated into cosmic knowledge base',
    ],
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 200).toISOString(),
  };
}

// ==================== CIVILIZATION COMPATIBILITY ====================

/**
 * Calculate compatibility between two civilizations
 */
export function calculateCivilizationCompatibility(
  civ1: CosmicCivilization,
  civ2: CosmicCivilization,
  state: CosmicNetworkState
): {
  overall: number;
  dimensions: {
    metaphysical: number;
    technological: number;
    cultural: number;
    temporal: number;
  };
  recommendations: {
    en: string;
    zh: string;
  }[];
} {
  // Get worlds and calculate elemental compatibility
  const worlds1 = civ1.worlds.map(id => state.worlds.get(id)).filter(Boolean) as CosmicWorld[];
  const worlds2 = civ2.worlds.map(id => state.worlds.get(id)).filter(Boolean) as CosmicWorld[];

  // Average elemental profiles
  const profile1 = averageElementalProfile(worlds1);
  const profile2 = averageElementalProfile(worlds2);

  // Calculate dimensional compatibilities
  const metaphysical = calculateElementalSimilarity(profile1, profile2);
  const technological = Math.abs(
    ['transcendent', 'cosmic', 'mature', 'developing', 'awakening', 'nascent'].indexOf(civ1.stage) -
    ['transcendent', 'cosmic', 'mature', 'developing', 'awakening', 'nascent'].indexOf(civ2.stage)
  ) / 5;
  const cultural = (civ1.metaphysicalUnity + civ2.metaphysicalUnity) / 2;
  const temporal = 1 - Math.abs(getAverageTimeDilation(worlds1) - getAverageTimeDilation(worlds2));

  const overall = (metaphysical * 0.4 + (1 - technological) * 0.2 + cultural * 0.2 + temporal * 0.2);

  // Generate recommendations
  const recommendations: { en: string; zh: string }[] = [];

  if (metaphysical < 0.5) {
    recommendations.push({
      en: 'Elemental exchange programs recommended to bridge metaphysical gaps',
      zh: '建议进行元素交流项目以弥合形而上学差距',
    });
  }

  if (technological > 0.3) {
    recommendations.push({
      en: 'Mentorship arrangement may benefit less developed civilization',
      zh: '指导安排可能有益于发展较慢的文明',
    });
  }

  if (overall > 0.7) {
    recommendations.push({
      en: 'High compatibility - alliance or integration potential',
      zh: '高度兼容 - 具有联盟或整合潜力',
    });
  }

  return {
    overall,
    dimensions: {
      metaphysical,
      technological: 1 - technological,
      cultural,
      temporal,
    },
    recommendations,
  };
}

/**
 * Average elemental profile across worlds
 */
function averageElementalProfile(worlds: CosmicWorld[]): CosmicElementBalance {
  if (worlds.length === 0) {
    return {
      stellar_fire: 0.125,
      void_water: 0.125,
      cosmic_earth: 0.125,
      solar_wind: 0.125,
      dark_energy: 0.125,
      antimatter: 0.125,
      quantum_foam: 0.125,
      gravity_well: 0.125,
    };
  }

  const result: CosmicElementBalance = {
    stellar_fire: 0,
    void_water: 0,
    cosmic_earth: 0,
    solar_wind: 0,
    dark_energy: 0,
    antimatter: 0,
    quantum_foam: 0,
    gravity_well: 0,
  };

  for (const world of worlds) {
    for (const element of Object.keys(result) as (keyof CosmicElementBalance)[]) {
      result[element] += world.cosmicElements[element];
    }
  }

  for (const element of Object.keys(result) as (keyof CosmicElementBalance)[]) {
    result[element] /= worlds.length;
  }

  return result;
}

/**
 * Get average time dilation
 */
function getAverageTimeDilation(worlds: CosmicWorld[]): number {
  if (worlds.length === 0) return 1;
  return worlds.reduce((sum, w) => sum + w.timeDilation, 0) / worlds.length;
}

// ==================== COSMIC REPORT GENERATION ====================

/**
 * Generate cosmic governance report
 */
export function generateCosmicGovernanceReport(
  state: CosmicNetworkState,
  options: {
    language: 'en' | 'zh' | 'both';
    includeTimingArcs: boolean;
    includeCommunications: boolean;
    includeCompatibility: boolean;
  } = {
    language: 'both',
    includeTimingArcs: true,
    includeCommunications: true,
    includeCompatibility: true,
  }
): {
  title: { en: string; zh: string };
  timestamp: string;
  summary: { en: string; zh: string };
  sections: Array<{
    title: { en: string; zh: string };
    content: { en: string; zh: string };
  }>;
} {
  const worlds = Array.from(state.worlds.values());
  const civilizations = Array.from(state.civilizations.values());

  const sections: Array<{
    title: { en: string; zh: string };
    content: { en: string; zh: string };
  }> = [];

  // Network Overview
  sections.push({
    title: {
      en: 'Cosmic Network Overview',
      zh: '宇宙网络概览',
    },
    content: {
      en: `The cosmic network currently encompasses ${worlds.length} registered worlds and ${civilizations.length} active civilizations. Overall cosmic alignment stands at ${(state.overallAlignment * 100).toFixed(1)}%.`,
      zh: `宇宙网络目前包括${worlds.length}个已注册世界和${civilizations.length}个活跃文明。整体宇宙对齐度为${(state.overallAlignment * 100).toFixed(1)}%。`,
    },
  });

  // Element Balance
  sections.push({
    title: {
      en: 'Cosmic Element Balance',
      zh: '宇宙元素平衡',
    },
    content: {
      en: formatElementBalance(state.cosmicBalance, 'en'),
      zh: formatElementBalance(state.cosmicBalance, 'zh'),
    },
  });

  // Active Directives
  if (state.activeDirectives.length > 0) {
    sections.push({
      title: {
        en: 'Active Governance Directives',
        zh: '活跃治理指令',
      },
      content: {
        en: state.activeDirectives.map(d => `- [${d.priority.toUpperCase()}] ${d.rationale.en}`).join('\n'),
        zh: state.activeDirectives.map(d => `- [${d.priority.toUpperCase()}] ${d.rationale.zh}`).join('\n'),
      },
    });
  }

  // Anomalies
  const activeAnomalies = state.anomalies.filter(a => a.status !== 'resolved');
  if (activeAnomalies.length > 0) {
    sections.push({
      title: {
        en: 'Active Cosmic Anomalies',
        zh: '活跃宇宙异常',
      },
      content: {
        en: activeAnomalies.map(a => `- ${a.type.replace(/_/g, ' ')}: ${a.description.en} (${a.status})`).join('\n'),
        zh: activeAnomalies.map(a => `- ${a.type.replace(/_/g, ' ')}：${a.description.zh}（${a.status}）`).join('\n'),
      },
    });
  }

  // Timing Arcs
  if (options.includeTimingArcs && state.activeTimingArcs.length > 0) {
    sections.push({
      title: {
        en: 'Active Cosmic Timing Arcs',
        zh: '活跃宇宙时序弧',
      },
      content: {
        en: state.activeTimingArcs.map(a => `- ${a.name.en}: ${a.type} (intensity: ${(a.intensity * 100).toFixed(0)}%)`).join('\n'),
        zh: state.activeTimingArcs.map(a => `- ${a.name.zh}：${a.type}（强度：${(a.intensity * 100).toFixed(0)}%）`).join('\n'),
      },
    });
  }

  // Recent Communications
  if (options.includeCommunications) {
    const recentComms = state.communications.slice(-5);
    if (recentComms.length > 0) {
      sections.push({
        title: {
          en: 'Recent Interstellar Communications',
          zh: '近期星际通信',
        },
        content: {
          en: recentComms.map(c => `- [${c.type}] ${c.content.en.substring(0, 100)}...`).join('\n'),
          zh: recentComms.map(c => `- [${c.type}] ${c.content.zh.substring(0, 100)}...`).join('\n'),
        },
      });
    }
  }

  return {
    title: {
      en: 'Cosmic Governance Report',
      zh: '宇宙治理报告',
    },
    timestamp: new Date().toISOString(),
    summary: {
      en: `Cosmic network status: ${state.overallAlignment > 0.7 ? 'Stable' : state.overallAlignment > 0.4 ? 'Moderate' : 'Attention Required'}. ${state.activeDirectives.length} active directives, ${activeAnomalies.length} anomalies under observation.`,
      zh: `宇宙网络状态：${state.overallAlignment > 0.7 ? '稳定' : state.overallAlignment > 0.4 ? '中等' : '需要关注'}。${state.activeDirectives.length}个活跃指令，${activeAnomalies.length}个异常正在观察中。`,
    },
    sections,
  };
}

/**
 * Format element balance for display
 */
function formatElementBalance(balance: CosmicElementBalance, lang: 'en' | 'zh'): string {
  const elements = Object.keys(balance) as CosmicElement[];

  if (lang === 'en') {
    return elements
      .map(e => `${e.replace(/_/g, ' ')}: ${(balance[e] * 100).toFixed(1)}%`)
      .join('\n');
  } else {
    return elements
      .map(e => `${getCosmicElementZh(e)}：${(balance[e] * 100).toFixed(1)}%`)
      .join('\n');
  }
}

// ==================== EXPORTS ====================

export {
  CosmicNetworkManager,
  calculateCosmicTimingArcs,
  sendInterstellarCommunication,
  receivePendingCommunications,
  generateCosmicDirectives,
  calculateCivilizationCompatibility,
  generateCosmicGovernanceReport,
  getCosmicElementZh,
  PLANETARY_TO_COSMIC_ELEMENTS,
  COSMIC_ELEMENT_INTERACTIONS,
};
