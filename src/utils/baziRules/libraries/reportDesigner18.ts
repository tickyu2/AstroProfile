/**
 * ============================================
 * PRO REPORT DESIGNER 18.0
 * Meta-Causal Architecture Engine
 *
 * The Cathedral's meta-causal layer —
 * designing the structure of causality itself,
 * the grammar of "if → then", the architecture
 * of possibility, probability, and agency.
 * ============================================
 */

// ==================== TYPE DEFINITIONS ====================

/**
 * Causal node types
 */
export type CausalNodeType =
  | 'cause'          // Source of effect
  | 'effect'         // Result of cause
  | 'correlation'    // Non-causal association
  | 'resonance'      // Sympathetic vibration
  | 'possibility'    // What can happen
  | 'probability'    // Likelihood field
  | 'agency'         // Capacity for action
  | 'constraint'     // Limitation on possibility
  | 'emergence'      // Spontaneous arising
  | 'attractor'      // Drawing force
  | 'repeller';      // Pushing force

/**
 * Causal grammar types
 */
export type CausalGrammarType =
  | 'linear'         // A → B → C
  | 'branching'      // A → (B, C, D)
  | 'cyclic'         // A → B → C → A
  | 'fractal'        // Self-similar at all scales
  | 'probabilistic'  // A → B with probability P
  | 'non_causal'     // Resonance without cause
  | 'retrocausal'    // Effect precedes cause
  | 'multi_agent'    // Multiple causes interact
  | 'distributed'    // Cause spread across space/time
  | 'emergent'       // Cause arises from complexity
  | 'teleological'   // Cause from future purpose
  | 'acausal';       // No causal structure

/**
 * Temporal behavior types
 */
export type TemporalBehavior =
  | 'forward'        // Cause precedes effect
  | 'backward'       // Effect precedes cause
  | 'simultaneous'   // Cause and effect together
  | 'atemporal'      // No temporal relation
  | 'cyclic'         // Time loops
  | 'branching'      // Multiple timelines
  | 'superposed';    // Multiple temporal states

/**
 * Agency model types
 */
export type AgencyModel =
  | 'deterministic'  // No agency, all determined
  | 'free_will'      // Full agency
  | 'compatibilist'  // Determined but feels free
  | 'probabilistic'  // Agency influences probability
  | 'collective'     // Agency distributed
  | 'emergent'       // Agency arises from complexity
  | 'hierarchical';  // Nested levels of agency

/**
 * Probability model types
 */
export type ProbabilityModel =
  | 'classical'      // Standard probability
  | 'quantum'        // Superposition/collapse
  | 'subjective'     // Bayesian
  | 'propensity'     // Tendency-based
  | 'frequency'      // Long-run frequency
  | 'possibilist'    // Possibility-weighted
  | 'designed';      // Architecturally determined

/**
 * A node in the meta-causal graph
 */
export interface CausalNode {
  id: string;
  type: CausalNodeType;
  name: {
    en: string;
    zh: string;
  };
  description: string;
  weight: number;     // 0-1 influence strength
  active: boolean;
  metadata: Record<string, unknown>;
  position: {
    causalDepth: number;     // How far from origin
    temporalPosition: number; // When in sequence
    agencyDegree: number;    // How much agency
  };
}

/**
 * An edge in the meta-causal graph
 */
export interface CausalEdge {
  id: string;
  from: string;       // Node ID
  to: string;         // Node ID
  relationship: CausalRelationship;
  weight: number;     // 0-1 strength
  bidirectional: boolean;
  probability: number; // 0-1 likelihood
  delay: number;       // Temporal delay
  rationale: {
    en: string;
    zh: string;
  };
  conditions: string[]; // When this edge applies
}

/**
 * Types of causal relationships
 */
export type CausalRelationship =
  | 'causes'           // Direct causation
  | 'enables'          // Makes possible
  | 'prevents'         // Makes impossible
  | 'correlates'       // Non-causal association
  | 'resonates'        // Sympathetic vibration
  | 'constrains'       // Limits
  | 'amplifies'        // Increases effect
  | 'dampens'          // Decreases effect
  | 'transforms'       // Changes nature
  | 'attracts'         // Draws toward
  | 'repels'           // Pushes away
  | 'entangles'        // Quantum-like connection
  | 'supervenes';      // Higher-level dependence

/**
 * Meta-causal graph
 */
export interface MetaCausalGraph {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  nodes: Map<string, CausalNode>;
  edges: Map<string, CausalEdge>;
  grammar: CausalGrammar;
  correlationFields: Map<string, CorrelationField>;
  possibilityFields: Map<string, PossibilityField>;
  probabilityGeometries: Map<string, ProbabilityGeometry>;
  agencyFields: Map<string, AgencyField>;
  constraintFields: Map<string, ConstraintField>;
  emergenceFields: Map<string, EmergenceField>;
  metadata: {
    createdAt: string;
    createdBy: string;
    version: number;
    stability: number;
    coherence: number;
  };
}

/**
 * Causal grammar specification
 */
export interface CausalGrammar {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  structure: CausalGrammarType;
  temporalBehavior: TemporalBehavior;
  agencyModel: AgencyModel;
  probabilityModel: ProbabilityModel;
  axioms: CausalAxiom[];
  rules: CausalRule[];
  constraints: string[];
  paradoxResolution: ParadoxResolutionStrategy;
  rationale: {
    en: string;
    zh: string;
  };
}

/**
 * Causal axiom (fundamental assumption)
 */
export interface CausalAxiom {
  id: string;
  name: string;
  statement: {
    en: string;
    zh: string;
  };
  formalNotation: string;
  derivable: boolean;
  foundational: boolean;
}

/**
 * Causal rule
 */
export interface CausalRule {
  id: string;
  name: string;
  condition: string;
  effect: string;
  probability: number;
  exceptions: string[];
  derivedFrom: string[];  // Axiom IDs
}

/**
 * Paradox resolution strategy
 */
export type ParadoxResolutionStrategy =
  | 'forbid'           // Paradoxes cannot occur
  | 'novikov'          // Self-consistency enforced
  | 'branching'        // Creates new timeline
  | 'dissolution'      // Paradox dissolves reality
  | 'superposition'    // Both states coexist
  | 'hierarchical'     // Higher level resolves
  | 'emergent';        // Resolution emerges

/**
 * Correlation field (designed correlations)
 */
export interface CorrelationField {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  type: 'resonance' | 'synchronicity' | 'entanglement' | 'symbolic' | 'morphic';
  resonanceRules: ResonanceRule[];
  synchronicityRules: SynchronicityRule[];
  entanglementRules: EntanglementRule[];
  symbolicRules: SymbolicCorrelationRule[];
  strength: number;    // 0-1
  range: 'local' | 'regional' | 'global' | 'universal' | 'omniversal';
  rationale: {
    en: string;
    zh: string;
  };
}

/**
 * Resonance rule
 */
export interface ResonanceRule {
  id: string;
  source: string;
  target: string;
  frequency: number;
  amplitude: number;
  phase: number;
  decay: number;
}

/**
 * Synchronicity rule
 */
export interface SynchronicityRule {
  id: string;
  pattern: string;
  meaning: {
    en: string;
    zh: string;
  };
  triggerConditions: string[];
  probability: number;
}

/**
 * Entanglement rule
 */
export interface EntanglementRule {
  id: string;
  particle1: string;
  particle2: string;
  property: string;
  correlation: 'perfect' | 'partial' | 'inverse';
  breakConditions: string[];
}

/**
 * Symbolic correlation rule
 */
export interface SymbolicCorrelationRule {
  id: string;
  symbol: string;
  meaning: string;
  associations: string[];
  activationThreshold: number;
}

/**
 * Possibility field
 */
export interface PossibilityField {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  possible: PossibilityEntry[];
  impossible: ImpossibilityEntry[];
  improbable: ImprobabilityEntry[];
  inevitable: InevitabilityEntry[];
  optional: OptionalityEntry[];
  emergent: EmergentPossibility[];
  boundaries: PossibilityBoundary[];
  rationale: {
    en: string;
    zh: string;
  };
}

/**
 * Possibility entry
 */
export interface PossibilityEntry {
  id: string;
  description: string;
  conditions: string[];
  probability: number;
  dependencies: string[];
}

/**
 * Impossibility entry
 */
export interface ImpossibilityEntry {
  id: string;
  description: string;
  reason: string;
  exceptions: string[];
  violatingPrinciples: string[];
}

/**
 * Improbability entry
 */
export interface ImprobabilityEntry {
  id: string;
  description: string;
  probability: number;
  requiredConditions: string[];
}

/**
 * Inevitability entry
 */
export interface InevitabilityEntry {
  id: string;
  description: string;
  certainty: number;
  timeframe: string;
  preventable: boolean;
  preventionCost: number;
}

/**
 * Optionality entry
 */
export interface OptionalityEntry {
  id: string;
  description: string;
  defaultState: boolean;
  toggleConditions: string[];
  consequences: { ifTrue: string; ifFalse: string };
}

/**
 * Emergent possibility
 */
export interface EmergentPossibility {
  id: string;
  description: string;
  emergenceConditions: string[];
  predictability: number;
  stability: number;
}

/**
 * Possibility boundary
 */
export interface PossibilityBoundary {
  id: string;
  type: 'hard' | 'soft' | 'permeable' | 'conditional';
  description: string;
  strength: number;
  crossingCost: number;
}

/**
 * Probability geometry
 */
export interface ProbabilityGeometry {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  distribution: ProbabilityDistribution;
  topology: ProbabilityTopology;
  collapseRules: CollapseRule[];
  resonancePatterns: ProbabilityResonance[];
  flows: ProbabilityFlow[];
  rationale: {
    en: string;
    zh: string;
  };
}

/**
 * Probability distribution
 */
export interface ProbabilityDistribution {
  type: 'uniform' | 'gaussian' | 'exponential' | 'power_law' | 'quantum' | 'custom';
  parameters: Record<string, number>;
  domain: { min: number; max: number };
  density: (x: number) => number;
}

/**
 * Probability topology
 */
export interface ProbabilityTopology {
  dimensions: number;
  curvature: 'flat' | 'positive' | 'negative' | 'variable';
  boundaries: 'open' | 'closed' | 'periodic';
  singularities: { position: number[]; type: string }[];
}

/**
 * Collapse rule (quantum-like)
 */
export interface CollapseRule {
  id: string;
  trigger: string;
  collapseTo: string;
  probability: number;
  irreversible: boolean;
}

/**
 * Probability resonance
 */
export interface ProbabilityResonance {
  id: string;
  sourceField: string;
  targetField: string;
  resonanceStrength: number;
  phaseRelation: number;
}

/**
 * Probability flow
 */
export interface ProbabilityFlow {
  id: string;
  from: string;
  to: string;
  rate: number;
  conserved: boolean;
}

/**
 * Agency field
 */
export interface AgencyField {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  agents: Agent[];
  propagationRules: AgencyPropagation[];
  interactionRules: AgencyInteraction[];
  emergenceRules: AgencyEmergence[];
  constraints: AgencyConstraint[];
  rationale: {
    en: string;
    zh: string;
  };
}

/**
 * Agent definition
 */
export interface Agent {
  id: string;
  name: string;
  type: 'individual' | 'collective' | 'distributed' | 'emergent' | 'abstract';
  agencyLevel: number;  // 0-1
  scope: string[];      // What can this agent affect
  limitations: string[];
}

/**
 * Agency propagation rule
 */
export interface AgencyPropagation {
  id: string;
  from: string;
  to: string;
  mechanism: 'delegation' | 'inheritance' | 'emergence' | 'collapse';
  efficiency: number;
  conditions: string[];
}

/**
 * Agency interaction rule
 */
export interface AgencyInteraction {
  id: string;
  agent1: string;
  agent2: string;
  interactionType: 'cooperation' | 'conflict' | 'hierarchy' | 'independence' | 'merger';
  resultingAgency: number;
}

/**
 * Agency emergence rule
 */
export interface AgencyEmergence {
  id: string;
  substrate: string[];
  threshold: number;
  emergentAgentType: string;
  stability: number;
}

/**
 * Agency constraint
 */
export interface AgencyConstraint {
  id: string;
  agent: string;
  constraint: string;
  strength: number;
  origin: 'ontological' | 'metaphysical' | 'physical' | 'social' | 'self-imposed';
}

/**
 * Constraint field
 */
export interface ConstraintField {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  constraints: MetaphysicalConstraint[];
  scope: ConstraintScope;
  flexibility: number;  // 0-1 how bendable
  rationale: {
    en: string;
    zh: string;
  };
}

/**
 * Metaphysical constraint
 */
export interface MetaphysicalConstraint {
  id: string;
  name: string;
  type: 'causal' | 'temporal' | 'ontological' | 'substrate' | 'logical' | 'existential';
  description: {
    en: string;
    zh: string;
  };
  strength: number;
  exceptions: string[];
  enforcementMechanism: string;
}

/**
 * Constraint scope
 */
export interface ConstraintScope {
  spatial: 'local' | 'regional' | 'global' | 'universal' | 'omniversal';
  temporal: 'momentary' | 'periodic' | 'eternal';
  existential: string[];  // Which existences affected
}

/**
 * Emergence field
 */
export interface EmergenceField {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  emergenceRules: EmergenceRule[];
  complexityThresholds: ComplexityThreshold[];
  patterns: EmergentPattern[];
  stability: number;
  rationale: {
    en: string;
    zh: string;
  };
}

/**
 * Emergence rule
 */
export interface EmergenceRule {
  id: string;
  substrate: string[];
  conditions: string[];
  emergentProperty: string;
  probability: number;
  reversible: boolean;
}

/**
 * Complexity threshold
 */
export interface ComplexityThreshold {
  id: string;
  metric: string;
  threshold: number;
  effect: string;
}

/**
 * Emergent pattern
 */
export interface EmergentPattern {
  id: string;
  name: string;
  description: string;
  recognitionCriteria: string[];
  stability: number;
}

/**
 * Meta-causal architecture state
 */
export interface MetaCausalState {
  id: string;
  timestamp: string;
  graphs: Map<string, MetaCausalGraph>;
  grammars: Map<string, CausalGrammar>;
  activeGrammar: string;
  coherenceLevel: number;
  stabilityIndex: number;
  paradoxes: CausalParadox[];
  simulations: CausalSimulation[];
}

/**
 * Causal paradox
 */
export interface CausalParadox {
  id: string;
  type: 'temporal' | 'logical' | 'ontological' | 'self-reference' | 'infinite_regress';
  description: {
    en: string;
    zh: string;
  };
  involvedNodes: string[];
  severity: number;
  resolution: string | null;
  status: 'detected' | 'analyzing' | 'resolving' | 'resolved' | 'permanent';
}

/**
 * Causal simulation
 */
export interface CausalSimulation {
  id: string;
  graphId: string;
  initialState: Record<string, unknown>;
  steps: SimulationStep[];
  outcome: SimulationOutcome;
  stability: number;
}

/**
 * Simulation step
 */
export interface SimulationStep {
  step: number;
  state: Record<string, unknown>;
  events: string[];
  changes: string[];
}

/**
 * Simulation outcome
 */
export interface SimulationOutcome {
  success: boolean;
  finalState: Record<string, unknown>;
  paradoxesEncountered: string[];
  emergentProperties: string[];
  stability: number;
}

// ==================== DEFAULT CAUSAL GRAMMARS ====================

/**
 * Pre-defined causal grammars
 */
export const DEFAULT_CAUSAL_GRAMMARS: Record<string, Partial<CausalGrammar>> = {
  'classical_linear': {
    structure: 'linear',
    temporalBehavior: 'forward',
    agencyModel: 'deterministic',
    probabilityModel: 'classical',
    paradoxResolution: 'forbid',
    axioms: [
      {
        id: 'ax-causality',
        name: 'Causality Axiom',
        statement: { en: 'Every effect has a cause', zh: '每个结果都有原因' },
        formalNotation: '∀E: ∃C: causes(C, E)',
        derivable: false,
        foundational: true,
      },
      {
        id: 'ax-temporal',
        name: 'Temporal Precedence',
        statement: { en: 'Causes precede effects', zh: '原因先于结果' },
        formalNotation: '∀C,E: causes(C,E) → time(C) < time(E)',
        derivable: false,
        foundational: true,
      },
    ],
  },

  'quantum_branching': {
    structure: 'branching',
    temporalBehavior: 'forward',
    agencyModel: 'probabilistic',
    probabilityModel: 'quantum',
    paradoxResolution: 'branching',
    axioms: [
      {
        id: 'ax-superposition',
        name: 'Superposition Axiom',
        statement: { en: 'States can exist in superposition', zh: '状态可以叠加存在' },
        formalNotation: 'ψ = α|0⟩ + β|1⟩',
        derivable: false,
        foundational: true,
      },
      {
        id: 'ax-collapse',
        name: 'Collapse Axiom',
        statement: { en: 'Observation collapses superposition', zh: '观察导致叠加态坍塌' },
        formalNotation: 'observe(ψ) → |0⟩ ∨ |1⟩',
        derivable: false,
        foundational: true,
      },
    ],
  },

  'retrocausal': {
    structure: 'linear',
    temporalBehavior: 'backward',
    agencyModel: 'compatibilist',
    probabilityModel: 'propensity',
    paradoxResolution: 'novikov',
    axioms: [
      {
        id: 'ax-retro',
        name: 'Retrocausality Axiom',
        statement: { en: 'Effects can precede causes', zh: '结果可以先于原因' },
        formalNotation: '∃C,E: causes(C,E) ∧ time(E) < time(C)',
        derivable: false,
        foundational: true,
      },
      {
        id: 'ax-consistency',
        name: 'Self-Consistency',
        statement: { en: 'Timelines must be self-consistent', zh: '时间线必须自洽' },
        formalNotation: '¬∃P: paradox(P)',
        derivable: false,
        foundational: true,
      },
    ],
  },

  'acausal_resonance': {
    structure: 'acausal',
    temporalBehavior: 'atemporal',
    agencyModel: 'emergent',
    probabilityModel: 'possibilist',
    paradoxResolution: 'superposition',
    axioms: [
      {
        id: 'ax-resonance',
        name: 'Resonance Axiom',
        statement: { en: 'Like resonates with like', zh: '同类相应' },
        formalNotation: '∀A,B: similar(A,B) → resonates(A,B)',
        derivable: false,
        foundational: true,
      },
      {
        id: 'ax-meaning',
        name: 'Meaning Connection',
        statement: { en: 'Meaning creates connection', zh: '意义创造连接' },
        formalNotation: '∀A,B: meaningRelated(A,B) → connected(A,B)',
        derivable: false,
        foundational: true,
      },
    ],
  },

  'teleological': {
    structure: 'teleological',
    temporalBehavior: 'simultaneous',
    agencyModel: 'hierarchical',
    probabilityModel: 'designed',
    paradoxResolution: 'hierarchical',
    axioms: [
      {
        id: 'ax-purpose',
        name: 'Purpose Axiom',
        statement: { en: 'Purpose shapes causation', zh: '目的塑造因果' },
        formalNotation: '∀E: ∃P: purpose(P) → attracts(P, E)',
        derivable: false,
        foundational: true,
      },
      {
        id: 'ax-telos',
        name: 'Telos Attraction',
        statement: { en: 'Future goals attract present actions', zh: '未来目标吸引当前行动' },
        formalNotation: '∀G: goal(G) → ∃A: moves_toward(A, G)',
        derivable: false,
        foundational: true,
      },
    ],
  },
};

// ==================== META-CAUSAL ENGINE ====================

/**
 * Meta-Causal Architecture Engine
 */
export class MetaCausalEngine {
  private state: MetaCausalState;

  constructor() {
    this.state = this.initializeState();
  }

  private initializeState(): MetaCausalState {
    return {
      id: `meta-causal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      graphs: new Map(),
      grammars: new Map(),
      activeGrammar: '',
      coherenceLevel: 1.0,
      stabilityIndex: 1.0,
      paradoxes: [],
      simulations: [],
    };
  }

  /**
   * Create a new causal grammar
   */
  createCausalGrammar(
    name: { en: string; zh: string },
    template: keyof typeof DEFAULT_CAUSAL_GRAMMARS | null,
    customizations: Partial<CausalGrammar> = {}
  ): CausalGrammar {
    const base = template ? DEFAULT_CAUSAL_GRAMMARS[template] : {};

    const grammar: CausalGrammar = {
      id: `grammar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      structure: customizations.structure || base.structure || 'linear',
      temporalBehavior: customizations.temporalBehavior || base.temporalBehavior || 'forward',
      agencyModel: customizations.agencyModel || base.agencyModel || 'deterministic',
      probabilityModel: customizations.probabilityModel || base.probabilityModel || 'classical',
      axioms: customizations.axioms || base.axioms || [],
      rules: customizations.rules || [],
      constraints: customizations.constraints || [],
      paradoxResolution: customizations.paradoxResolution || base.paradoxResolution || 'forbid',
      rationale: customizations.rationale || { en: '', zh: '' },
    };

    this.state.grammars.set(grammar.id, grammar);
    return grammar;
  }

  /**
   * Create a new meta-causal graph
   */
  createMetaCausalGraph(
    name: { en: string; zh: string },
    grammarId: string
  ): MetaCausalGraph {
    const grammar = this.state.grammars.get(grammarId);
    if (!grammar) {
      throw new Error(`Grammar ${grammarId} not found`);
    }

    const graph: MetaCausalGraph = {
      id: `mcg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      nodes: new Map(),
      edges: new Map(),
      grammar,
      correlationFields: new Map(),
      possibilityFields: new Map(),
      probabilityGeometries: new Map(),
      agencyFields: new Map(),
      constraintFields: new Map(),
      emergenceFields: new Map(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        version: 1,
        stability: 1.0,
        coherence: 1.0,
      },
    };

    this.state.graphs.set(graph.id, graph);
    return graph;
  }

  /**
   * Add a causal node to a graph
   */
  addCausalNode(
    graphId: string,
    node: Omit<CausalNode, 'id'>
  ): CausalNode {
    const graph = this.state.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }

    const fullNode: CausalNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...node,
    };

    graph.nodes.set(fullNode.id, fullNode);
    this.updateGraphMetrics(graph);
    return fullNode;
  }

  /**
   * Add a causal edge to a graph
   */
  addCausalEdge(
    graphId: string,
    edge: Omit<CausalEdge, 'id'>
  ): CausalEdge {
    const graph = this.state.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }

    const fullEdge: CausalEdge = {
      id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...edge,
    };

    graph.edges.set(fullEdge.id, fullEdge);

    // Check for paradoxes
    const paradox = this.detectParadoxes(graph, fullEdge);
    if (paradox) {
      this.state.paradoxes.push(paradox);
    }

    this.updateGraphMetrics(graph);
    return fullEdge;
  }

  /**
   * Create a correlation field
   */
  createCorrelationField(
    graphId: string,
    field: Omit<CorrelationField, 'id'>
  ): CorrelationField {
    const graph = this.state.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }

    const fullField: CorrelationField = {
      id: `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...field,
    };

    graph.correlationFields.set(fullField.id, fullField);
    return fullField;
  }

  /**
   * Create a possibility field
   */
  createPossibilityField(
    graphId: string,
    field: Omit<PossibilityField, 'id'>
  ): PossibilityField {
    const graph = this.state.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }

    const fullField: PossibilityField = {
      id: `poss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...field,
    };

    graph.possibilityFields.set(fullField.id, fullField);
    return fullField;
  }

  /**
   * Create a probability geometry
   */
  createProbabilityGeometry(
    graphId: string,
    geometry: Omit<ProbabilityGeometry, 'id'>
  ): ProbabilityGeometry {
    const graph = this.state.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }

    const fullGeometry: ProbabilityGeometry = {
      id: `prob-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...geometry,
    };

    graph.probabilityGeometries.set(fullGeometry.id, fullGeometry);
    return fullGeometry;
  }

  /**
   * Create an agency field
   */
  createAgencyField(
    graphId: string,
    field: Omit<AgencyField, 'id'>
  ): AgencyField {
    const graph = this.state.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }

    const fullField: AgencyField = {
      id: `agency-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...field,
    };

    graph.agencyFields.set(fullField.id, fullField);
    return fullField;
  }

  /**
   * Create a constraint field
   */
  createConstraintField(
    graphId: string,
    field: Omit<ConstraintField, 'id'>
  ): ConstraintField {
    const graph = this.state.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }

    const fullField: ConstraintField = {
      id: `constr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...field,
    };

    graph.constraintFields.set(fullField.id, fullField);
    return fullField;
  }

  /**
   * Detect paradoxes in graph
   */
  private detectParadoxes(graph: MetaCausalGraph, newEdge: CausalEdge): CausalParadox | null {
    // Check for temporal paradoxes (if grammar forbids)
    if (graph.grammar.structure === 'linear' && graph.grammar.temporalBehavior === 'forward') {
      // Check for cycles
      const visited = new Set<string>();
      const path: string[] = [];

      const hasCycle = (nodeId: string): boolean => {
        if (path.includes(nodeId)) return true;
        if (visited.has(nodeId)) return false;

        visited.add(nodeId);
        path.push(nodeId);

        for (const edge of graph.edges.values()) {
          if (edge.from === nodeId) {
            if (hasCycle(edge.to)) return true;
          }
        }

        path.pop();
        return false;
      };

      if (hasCycle(newEdge.from)) {
        return {
          id: `paradox-${Date.now()}`,
          type: 'temporal',
          description: {
            en: 'Causal cycle detected in linear forward-time grammar',
            zh: '在线性前向时间语法中检测到因果循环',
          },
          involvedNodes: [newEdge.from, newEdge.to],
          severity: 0.8,
          resolution: null,
          status: 'detected',
        };
      }
    }

    return null;
  }

  /**
   * Update graph metrics
   */
  private updateGraphMetrics(graph: MetaCausalGraph): void {
    const nodeCount = graph.nodes.size;
    const edgeCount = graph.edges.size;

    // Calculate coherence
    const activeParadoxes = this.state.paradoxes.filter(
      p => p.involvedNodes.some(n => graph.nodes.has(n)) && p.status !== 'resolved'
    ).length;
    graph.metadata.coherence = Math.max(0, 1 - activeParadoxes * 0.2);

    // Calculate stability
    const avgWeight = edgeCount > 0
      ? Array.from(graph.edges.values()).reduce((sum, e) => sum + e.weight, 0) / edgeCount
      : 1;
    graph.metadata.stability = avgWeight;

    // Update global metrics
    this.updateGlobalMetrics();
  }

  /**
   * Update global metrics
   */
  private updateGlobalMetrics(): void {
    const graphs = Array.from(this.state.graphs.values());
    if (graphs.length === 0) return;

    this.state.coherenceLevel = graphs.reduce((sum, g) => sum + g.metadata.coherence, 0) / graphs.length;
    this.state.stabilityIndex = graphs.reduce((sum, g) => sum + g.metadata.stability, 0) / graphs.length;
  }

  /**
   * Simulate causal propagation
   */
  simulateCausalPropagation(
    graphId: string,
    initialState: Record<string, unknown>,
    steps: number
  ): CausalSimulation {
    const graph = this.state.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }

    const simulation: CausalSimulation = {
      id: `sim-${Date.now()}`,
      graphId,
      initialState,
      steps: [],
      outcome: {
        success: true,
        finalState: {},
        paradoxesEncountered: [],
        emergentProperties: [],
        stability: 1.0,
      },
    };

    let currentState = { ...initialState };

    for (let step = 0; step < steps; step++) {
      const events: string[] = [];
      const changes: string[] = [];

      // Apply causal rules
      for (const edge of graph.edges.values()) {
        if (Math.random() < edge.probability) {
          events.push(`Edge ${edge.id} activated`);
          changes.push(`${edge.from} → ${edge.to}`);
        }
      }

      simulation.steps.push({
        step,
        state: { ...currentState },
        events,
        changes,
      });
    }

    simulation.outcome.finalState = currentState;
    simulation.outcome.stability = graph.metadata.stability;

    this.state.simulations.push(simulation);
    return simulation;
  }

  /**
   * Get graph by ID
   */
  getGraph(id: string): MetaCausalGraph | undefined {
    return this.state.graphs.get(id);
  }

  /**
   * Get all graphs
   */
  getAllGraphs(): MetaCausalGraph[] {
    return Array.from(this.state.graphs.values());
  }

  /**
   * Get current state
   */
  getState(): MetaCausalState {
    return this.state;
  }
}

// ==================== REPORT GENERATION ====================

/**
 * Generate meta-causal architecture report
 */
export function generateMetaCausalReport(
  state: MetaCausalState,
  options: {
    language: 'en' | 'zh' | 'both';
    includeGrammars: boolean;
    includeGraphs: boolean;
    includeParadoxes: boolean;
  } = {
    language: 'both',
    includeGrammars: true,
    includeGraphs: true,
    includeParadoxes: true,
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
  const graphs = Array.from(state.graphs.values());
  const grammars = Array.from(state.grammars.values());

  const sections: Array<{
    title: { en: string; zh: string };
    content: { en: string; zh: string };
  }> = [];

  // Overview
  sections.push({
    title: { en: 'Meta-Causal Architecture Overview', zh: '元因果架构概览' },
    content: {
      en: `The meta-causal architecture contains ${grammars.length} causal grammars and ${graphs.length} meta-causal graphs. Coherence: ${(state.coherenceLevel * 100).toFixed(1)}%. Stability: ${(state.stabilityIndex * 100).toFixed(1)}%.`,
      zh: `元因果架构包含${grammars.length}个因果语法和${graphs.length}个元因果图。连贯性：${(state.coherenceLevel * 100).toFixed(1)}%。稳定性：${(state.stabilityIndex * 100).toFixed(1)}%。`,
    },
  });

  // Grammars
  if (options.includeGrammars && grammars.length > 0) {
    sections.push({
      title: { en: 'Causal Grammars', zh: '因果语法' },
      content: {
        en: grammars.map(g => `- ${g.name.en}: ${g.structure} (${g.temporalBehavior}, ${g.agencyModel})`).join('\n'),
        zh: grammars.map(g => `- ${g.name.zh}：${g.structure}（${g.temporalBehavior}，${g.agencyModel}）`).join('\n'),
      },
    });
  }

  // Graphs
  if (options.includeGraphs && graphs.length > 0) {
    sections.push({
      title: { en: 'Meta-Causal Graphs', zh: '元因果图' },
      content: {
        en: graphs.map(g => `- ${g.name.en}: ${g.nodes.size} nodes, ${g.edges.size} edges (coherence: ${(g.metadata.coherence * 100).toFixed(1)}%)`).join('\n'),
        zh: graphs.map(g => `- ${g.name.zh}：${g.nodes.size}个节点，${g.edges.size}条边（连贯性：${(g.metadata.coherence * 100).toFixed(1)}%）`).join('\n'),
      },
    });
  }

  // Paradoxes
  const activeParadoxes = state.paradoxes.filter(p => p.status !== 'resolved');
  if (options.includeParadoxes && activeParadoxes.length > 0) {
    sections.push({
      title: { en: 'Active Paradoxes', zh: '活跃悖论' },
      content: {
        en: activeParadoxes.map(p => `- ${p.type}: ${p.description.en} (${p.status})`).join('\n'),
        zh: activeParadoxes.map(p => `- ${p.type}：${p.description.zh}（${p.status}）`).join('\n'),
      },
    });
  }

  const status = state.coherenceLevel > 0.8 ? 'Stable' :
                 state.coherenceLevel > 0.5 ? 'Moderate' : 'Critical';
  const statusZh = state.coherenceLevel > 0.8 ? '稳定' :
                   state.coherenceLevel > 0.5 ? '中等' : '关键';

  return {
    title: { en: 'Meta-Causal Architecture Report', zh: '元因果架构报告' },
    timestamp: new Date().toISOString(),
    summary: {
      en: `Meta-causal status: ${status}. ${grammars.length} grammars, ${graphs.length} graphs, ${activeParadoxes.length} active paradoxes.`,
      zh: `元因果状态：${statusZh}。${grammars.length}个语法，${graphs.length}个图，${activeParadoxes.length}个活跃悖论。`,
    },
    sections,
  };
}

// ==================== EXPORTS ====================

export {
  MetaCausalEngine,
  generateMetaCausalReport,
  DEFAULT_CAUSAL_GRAMMARS,
};
