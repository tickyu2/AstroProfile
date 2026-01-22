/**
 * ============================================
 * PRO REPORT DESIGNER 20.0
 * Meta-Genesis Engine
 *
 * The Cathedral's ultimate layer —
 * the origin of origins, the source of potential,
 * the primordial impulse from which all existence,
 * all possibility, all metaphysics arise.
 * ============================================
 */

// ==================== TYPE DEFINITIONS ====================

/**
 * Symmetry types in genesis substrate
 */
export type SymmetryType =
  | 'perfect'           // Complete undifferentiation
  | 'broken'            // First differentiation occurred
  | 'partial'           // Some symmetry remains
  | 'dynamic'           // Oscillating symmetry
  | 'hierarchical'      // Nested symmetries
  | 'undefined';        // Not yet determined

/**
 * Asymmetry vector types
 */
export type AsymmetryVectorType =
  | 'temporal'          // Time direction
  | 'spatial'           // Space direction
  | 'causal'            // Cause-effect direction
  | 'conscious'         // Awareness direction
  | 'ontological'       // Being direction
  | 'axiological'       // Value direction
  | 'semantic';         // Meaning direction

/**
 * Differentiation modes
 */
export type DifferentiationMode =
  | 'spontaneous'       // Self-arising
  | 'triggered'         // Caused by impulse
  | 'gradual'           // Slow emergence
  | 'catastrophic'      // Sudden break
  | 'oscillating'       // Back and forth
  | 'fractal';          // Self-similar at all scales

/**
 * Genesis substrate - the undifferentiated field
 */
export interface GenesisSubstrate {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  symmetry: SubstrateSymmetry;
  undifferentiatedField: UndifferentiatedField;
  prePotentialImpulses: PrePotentialImpulse[];
  preResonance: PreResonance[];
  preIdentity: PreIdentity;
  stillness: number;           // 0-1 how quiescent
  readinessForImpulse: number; // 0-1 how close to first spark
  metadata: {
    createdAt: string;
    version: number;
  };
}

/**
 * Substrate symmetry
 */
export interface SubstrateSymmetry {
  type: SymmetryType;
  groups: SymmetryGroup[];
  breakPoints: SymmetryBreakPoint[];
  stability: number;
}

/**
 * Symmetry group
 */
export interface SymmetryGroup {
  id: string;
  name: string;
  transformations: string[];
  conservedQuantities: string[];
}

/**
 * Symmetry break point
 */
export interface SymmetryBreakPoint {
  id: string;
  threshold: number;
  trigger: string;
  resultingAsymmetry: string;
  reversible: boolean;
}

/**
 * Undifferentiated field
 */
export interface UndifferentiatedField {
  uniformity: number;      // 0-1 how uniform
  tension: number;         // 0-1 internal pressure
  fluctuations: number;    // 0-1 quantum-like fluctuations
  depth: number;           // Infinite regression level
  voidRatio: number;       // Balance of being/non-being
}

/**
 * Pre-potential impulse
 */
export interface PrePotentialImpulse {
  id: string;
  type: 'tendency' | 'fluctuation' | 'resonance' | 'pressure' | 'undefined';
  magnitude: number;
  direction: number[];
  stability: number;
  description: {
    en: string;
    zh: string;
  };
}

/**
 * Pre-resonance (before vibration)
 */
export interface PreResonance {
  id: string;
  frequency: number;       // Undefined = 0
  potential: number;       // How much it could vibrate
  coherence: number;       // Internal alignment
  entanglement: string[];  // Connected pre-resonances
}

/**
 * Pre-identity (before selfhood)
 */
export interface PreIdentity {
  boundaryPotential: number;    // Tendency toward boundary
  distinctionPotential: number; // Tendency toward uniqueness
  unityPotential: number;       // Tendency toward oneness
  selfReferencePotential: number; // Tendency toward recursion
}

/**
 * Origin impulse - the first spark
 */
export interface OriginImpulse {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  asymmetryVector: AsymmetryVector;
  resonanceSeed: ResonanceSeed;
  identitySpark: IdentitySpark;
  differentiationMode: DifferentiationMode;
  magnitude: number;
  precision: number;        // How targeted
  reversibility: number;    // 0-1 can it be undone
  consequences: string[];
  appliedAt: string | null;
  result: ImpulseResult | null;
}

/**
 * Asymmetry vector
 */
export interface AsymmetryVector {
  type: AsymmetryVectorType;
  direction: number[];
  magnitude: number;
  stability: number;
  propagation: 'instant' | 'gradual' | 'wave' | 'fractal';
}

/**
 * Resonance seed
 */
export interface ResonanceSeed {
  frequency: number;
  amplitude: number;
  phase: number;
  harmonics: number[];
  propagationRate: number;
}

/**
 * Identity spark
 */
export interface IdentitySpark {
  boundaryStrength: number;
  selfReferenceDepth: number;
  distinctionClarity: number;
  persistencePotential: number;
}

/**
 * Impulse result
 */
export interface ImpulseResult {
  success: boolean;
  symmetryBroken: boolean;
  newAsymmetries: string[];
  emergentStructures: string[];
  stabilityAchieved: number;
  sideEffects: string[];
}

/**
 * Symmetry break specification
 */
export interface SymmetryBreak {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  symmetryType: SymmetryType;
  breakRules: BreakRule[];
  emergencePaths: EmergencePath[];
  stability: number;
  reversibility: number;
  consequences: BreakConsequence[];
}

/**
 * Break rule
 */
export interface BreakRule {
  id: string;
  condition: string;
  threshold: number;
  mechanism: 'spontaneous' | 'triggered' | 'gradual' | 'catastrophic';
  probability: number;
}

/**
 * Emergence path
 */
export interface EmergencePath {
  id: string;
  name: string;
  steps: string[];
  probability: number;
  stability: number;
  resultingStructure: string;
}

/**
 * Break consequence
 */
export interface BreakConsequence {
  type: 'structure' | 'force' | 'dimension' | 'law' | 'entity';
  description: string;
  permanence: number;
}

/**
 * Genesis resonance
 */
export interface GenesisResonance {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  modes: ResonanceMode[];
  propagation: ResonancePropagation[];
  collapseRules: ResonanceCollapse[];
  stability: number;
  coherence: number;
}

/**
 * Resonance mode
 */
export interface ResonanceMode {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  quality: number;      // Q factor
  coupling: string[];   // Connected modes
}

/**
 * Resonance propagation
 */
export interface ResonancePropagation {
  id: string;
  source: string;
  target: string;
  speed: number;
  attenuation: number;
  transformation: string | null;
}

/**
 * Resonance collapse
 */
export interface ResonanceCollapse {
  id: string;
  trigger: string;
  collapseTo: string;
  probability: number;
  irreversible: boolean;
}

/**
 * Genesis identity
 */
export interface GenesisIdentity {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  boundary: IdentityBoundary;
  differentiationRules: IdentityDifferentiation[];
  propagationRules: IdentityPropagation[];
  stability: number;
  clarity: number;
}

/**
 * Identity boundary
 */
export interface IdentityBoundary {
  type: 'hard' | 'soft' | 'permeable' | 'dynamic' | 'undefined';
  strength: number;
  definition: number;   // How clear the boundary is
  selfReference: number; // How self-aware
}

/**
 * Identity differentiation
 */
export interface IdentityDifferentiation {
  id: string;
  from: string;
  to: string[];
  mechanism: 'split' | 'bud' | 'mirror' | 'emergence';
  probability: number;
  stability: number;
}

/**
 * Identity propagation
 */
export interface IdentityPropagation {
  id: string;
  source: string;
  method: 'copy' | 'derive' | 'inspire' | 'entangle';
  fidelity: number;
  range: number;
}

/**
 * Genesis time
 */
export interface GenesisTime {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  ignition: TimeIgnition;
  direction: TimeDirection;
  geometry: TimeGeometry;
  thresholds: TimeThreshold[];
  active: boolean;
}

/**
 * Time ignition - when time begins
 */
export interface TimeIgnition {
  triggered: boolean;
  mechanism: 'spontaneous' | 'symmetry_break' | 'entropy_gradient' | 'consciousness' | 'undefined';
  precision: number;     // How defined the moment is
  reversible: boolean;
}

/**
 * Time direction
 */
export interface TimeDirection {
  defined: boolean;
  direction: 'forward' | 'backward' | 'bidirectional' | 'undefined';
  strength: number;
  entropyCorrelation: number;  // How tied to entropy
}

/**
 * Time geometry
 */
export interface TimeGeometry {
  type: 'linear' | 'cyclic' | 'branching' | 'spiral' | 'fractal' | 'undefined';
  curvature: number;
  dimensionality: number;
  connectedness: number;  // How connected different times are
}

/**
 * Time threshold
 */
export interface TimeThreshold {
  id: string;
  name: string;
  threshold: number;
  effect: string;
  crossable: boolean;
}

/**
 * Genesis ontology - the first axioms of meaning
 */
export interface GenesisOntology {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  firstAxiom: FirstAxiom;
  firstDistinction: FirstDistinction;
  meaningBoundary: MeaningBoundary;
  causalProtoGrammar: CausalProtoGrammar[];
  stability: number;
  coherence: number;
}

/**
 * First axiom
 */
export interface FirstAxiom {
  statement: {
    en: string;
    zh: string;
  };
  formalNotation: string;
  selfEvident: boolean;
  foundational: boolean;
  implications: string[];
}

/**
 * First distinction
 */
export interface FirstDistinction {
  type: 'being_nonbeing' | 'one_many' | 'same_different' | 'inside_outside' | 'self_other';
  clarity: number;
  stability: number;
  reversible: boolean;
}

/**
 * Meaning boundary
 */
export interface MeaningBoundary {
  defined: boolean;
  strength: number;
  permeability: number;
  selfReference: boolean;
}

/**
 * Causal proto-grammar
 */
export interface CausalProtoGrammar {
  id: string;
  name: string;
  structure: string;
  primitives: string[];
  rules: string[];
  stability: number;
}

/**
 * Meta-genesis state
 */
export interface MetaGenesisState {
  id: string;
  timestamp: string;
  genesisSubstrates: Map<string, GenesisSubstrate>;
  originImpulses: Map<string, OriginImpulse>;
  symmetryBreaks: Map<string, SymmetryBreak>;
  genesisResonances: Map<string, GenesisResonance>;
  genesisIdentities: Map<string, GenesisIdentity>;
  genesisTimes: Map<string, GenesisTime>;
  genesisOntologies: Map<string, GenesisOntology>;
  primordialStillness: number;
  differentiationLevel: number;
  creationReadiness: number;
  activeCreations: string[];
}

// ==================== PRIMORDIAL CONSTANTS ====================

/**
 * The primordial axioms - cannot be changed
 */
export const PRIMORDIAL_AXIOMS: FirstAxiom[] = [
  {
    statement: {
      en: 'Something can arise from the undifferentiated',
      zh: '某物可以从未分化中产生',
    },
    formalNotation: '∃x: emerges(x, Ø)',
    selfEvident: true,
    foundational: true,
    implications: ['Creation is possible', 'Differentiation can occur'],
  },
  {
    statement: {
      en: 'Differentiation creates distinction',
      zh: '分化创造区分',
    },
    formalNotation: '∀x,y: diff(x,y) → distinct(x,y)',
    selfEvident: true,
    foundational: true,
    implications: ['Identity becomes possible', 'Multiplicity can arise'],
  },
  {
    statement: {
      en: 'Distinction enables relation',
      zh: '区分使关系成为可能',
    },
    formalNotation: '∀x,y: distinct(x,y) → ◇relates(x,y)',
    selfEvident: true,
    foundational: true,
    implications: ['Connection becomes possible', 'Causality can emerge'],
  },
];

/**
 * Default genesis configuration
 */
export const DEFAULT_GENESIS_CONFIG = {
  initialStillness: 1.0,
  fluctuationThreshold: 0.01,
  symmetryBreakThreshold: 0.1,
  resonanceEmergenceThreshold: 0.2,
  identityEmergenceThreshold: 0.3,
  timeIgnitionThreshold: 0.4,
  ontologyEmergenceThreshold: 0.5,
};

// ==================== META-GENESIS ENGINE ====================

/**
 * Meta-Genesis Engine
 */
export class MetaGenesisEngine {
  private state: MetaGenesisState;
  private config: typeof DEFAULT_GENESIS_CONFIG;

  constructor(config: Partial<typeof DEFAULT_GENESIS_CONFIG> = {}) {
    this.config = { ...DEFAULT_GENESIS_CONFIG, ...config };
    this.state = this.initializeState();
  }

  private initializeState(): MetaGenesisState {
    return {
      id: `meta-genesis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      genesisSubstrates: new Map(),
      originImpulses: new Map(),
      symmetryBreaks: new Map(),
      genesisResonances: new Map(),
      genesisIdentities: new Map(),
      genesisTimes: new Map(),
      genesisOntologies: new Map(),
      primordialStillness: this.config.initialStillness,
      differentiationLevel: 0,
      creationReadiness: 0,
      activeCreations: [],
    };
  }

  /**
   * Create a genesis substrate
   */
  createGenesisSubstrate(
    name: { en: string; zh: string }
  ): GenesisSubstrate {
    const substrate: GenesisSubstrate = {
      id: `substrate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      symmetry: {
        type: 'perfect',
        groups: [],
        breakPoints: [],
        stability: 1.0,
      },
      undifferentiatedField: {
        uniformity: 1.0,
        tension: 0,
        fluctuations: 0,
        depth: Infinity,
        voidRatio: 0.5,
      },
      prePotentialImpulses: [],
      preResonance: [],
      preIdentity: {
        boundaryPotential: 0,
        distinctionPotential: 0,
        unityPotential: 1,
        selfReferencePotential: 0,
      },
      stillness: 1.0,
      readinessForImpulse: 0,
      metadata: {
        createdAt: new Date().toISOString(),
        version: 1,
      },
    };

    this.state.genesisSubstrates.set(substrate.id, substrate);
    this.updateGlobalMetrics();
    return substrate;
  }

  /**
   * Add pre-potential impulse to substrate
   */
  addPrePotentialImpulse(
    substrateId: string,
    impulse: Omit<PrePotentialImpulse, 'id'>
  ): PrePotentialImpulse {
    const substrate = this.state.genesisSubstrates.get(substrateId);
    if (!substrate) {
      throw new Error(`Substrate ${substrateId} not found`);
    }

    const fullImpulse: PrePotentialImpulse = {
      id: `preimpulse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...impulse,
    };

    substrate.prePotentialImpulses.push(fullImpulse);
    this.updateSubstrateMetrics(substrate);
    return fullImpulse;
  }

  /**
   * Update substrate metrics
   */
  private updateSubstrateMetrics(substrate: GenesisSubstrate): void {
    // Reduce stillness based on impulses
    const impulseEnergy = substrate.prePotentialImpulses.reduce(
      (sum, i) => sum + i.magnitude, 0
    );
    substrate.stillness = Math.max(0, 1 - impulseEnergy / 10);

    // Increase readiness based on impulses and resonances
    const resonanceEnergy = substrate.preResonance.reduce(
      (sum, r) => sum + r.potential, 0
    );
    substrate.readinessForImpulse = Math.min(1, (impulseEnergy + resonanceEnergy) / 5);

    // Update field fluctuations
    substrate.undifferentiatedField.fluctuations = 1 - substrate.stillness;
    substrate.undifferentiatedField.tension = substrate.readinessForImpulse;

    // Update pre-identity potentials
    const avgImpulseStability = substrate.prePotentialImpulses.length > 0
      ? substrate.prePotentialImpulses.reduce((s, i) => s + i.stability, 0) / substrate.prePotentialImpulses.length
      : 0;
    substrate.preIdentity.boundaryPotential = avgImpulseStability * 0.5;
    substrate.preIdentity.distinctionPotential = substrate.undifferentiatedField.fluctuations * 0.5;

    this.updateGlobalMetrics();
  }

  /**
   * Create origin impulse
   */
  createOriginImpulse(
    name: { en: string; zh: string },
    configuration: {
      asymmetryVector: AsymmetryVector;
      resonanceSeed: ResonanceSeed;
      identitySpark: IdentitySpark;
      differentiationMode: DifferentiationMode;
      magnitude?: number;
    }
  ): OriginImpulse {
    const impulse: OriginImpulse = {
      id: `origin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      asymmetryVector: configuration.asymmetryVector,
      resonanceSeed: configuration.resonanceSeed,
      identitySpark: configuration.identitySpark,
      differentiationMode: configuration.differentiationMode,
      magnitude: configuration.magnitude || 0.5,
      precision: 0.8,
      reversibility: 0.2,
      consequences: [],
      appliedAt: null,
      result: null,
    };

    this.state.originImpulses.set(impulse.id, impulse);
    return impulse;
  }

  /**
   * Apply origin impulse to substrate
   */
  applyOriginImpulse(
    substrateId: string,
    impulseId: string
  ): ImpulseResult {
    const substrate = this.state.genesisSubstrates.get(substrateId);
    const impulse = this.state.originImpulses.get(impulseId);

    if (!substrate) throw new Error(`Substrate ${substrateId} not found`);
    if (!impulse) throw new Error(`Impulse ${impulseId} not found`);

    // Check readiness
    if (substrate.readinessForImpulse < this.config.symmetryBreakThreshold) {
      return {
        success: false,
        symmetryBroken: false,
        newAsymmetries: [],
        emergentStructures: [],
        stabilityAchieved: 0,
        sideEffects: ['Substrate not ready for impulse'],
      };
    }

    impulse.appliedAt = new Date().toISOString();

    // Apply the impulse
    const result: ImpulseResult = {
      success: true,
      symmetryBroken: impulse.magnitude > this.config.symmetryBreakThreshold,
      newAsymmetries: [],
      emergentStructures: [],
      stabilityAchieved: 0,
      sideEffects: [],
    };

    // Break symmetry if strong enough
    if (result.symmetryBroken) {
      substrate.symmetry.type = 'broken';
      result.newAsymmetries.push(impulse.asymmetryVector.type);
      result.emergentStructures.push('proto-direction');
    }

    // Create resonance
    if (impulse.magnitude > this.config.resonanceEmergenceThreshold) {
      const resonance = this.createGenesisResonance({
        en: `Resonance from ${impulse.name.en}`,
        zh: `来自${impulse.name.zh}的共振`,
      });
      result.emergentStructures.push(`resonance:${resonance.id}`);
    }

    // Spark identity
    if (impulse.magnitude > this.config.identityEmergenceThreshold) {
      const identity = this.createGenesisIdentity({
        en: `Identity from ${impulse.name.en}`,
        zh: `来自${impulse.name.zh}的身份`,
      }, impulse.identitySpark);
      result.emergentStructures.push(`identity:${identity.id}`);
    }

    // Ignite time
    if (impulse.magnitude > this.config.timeIgnitionThreshold) {
      const time = this.createGenesisTime({
        en: `Time from ${impulse.name.en}`,
        zh: `来自${impulse.name.zh}的时间`,
      });
      result.emergentStructures.push(`time:${time.id}`);
    }

    // Create ontology
    if (impulse.magnitude > this.config.ontologyEmergenceThreshold) {
      const ontology = this.createGenesisOntology({
        en: `Ontology from ${impulse.name.en}`,
        zh: `来自${impulse.name.zh}的本体论`,
      });
      result.emergentStructures.push(`ontology:${ontology.id}`);
    }

    result.stabilityAchieved = impulse.magnitude * (1 - impulse.reversibility);

    impulse.result = result;
    impulse.consequences = result.emergentStructures;

    // Update substrate
    substrate.stillness = Math.max(0, substrate.stillness - impulse.magnitude);
    substrate.undifferentiatedField.uniformity = Math.max(0, substrate.undifferentiatedField.uniformity - impulse.magnitude);

    this.updateGlobalMetrics();
    return result;
  }

  /**
   * Create symmetry break
   */
  createSymmetryBreak(
    name: { en: string; zh: string },
    configuration: {
      symmetryType?: SymmetryType;
      breakRules?: BreakRule[];
      emergencePaths?: EmergencePath[];
    } = {}
  ): SymmetryBreak {
    const symmetryBreak: SymmetryBreak = {
      id: `symbreak-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      symmetryType: configuration.symmetryType || 'perfect',
      breakRules: configuration.breakRules || [],
      emergencePaths: configuration.emergencePaths || [],
      stability: 0.5,
      reversibility: 0.3,
      consequences: [],
    };

    this.state.symmetryBreaks.set(symmetryBreak.id, symmetryBreak);
    return symmetryBreak;
  }

  /**
   * Create genesis resonance
   */
  createGenesisResonance(
    name: { en: string; zh: string },
    configuration: {
      modes?: ResonanceMode[];
      propagation?: ResonancePropagation[];
      collapseRules?: ResonanceCollapse[];
    } = {}
  ): GenesisResonance {
    const resonance: GenesisResonance = {
      id: `genres-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      modes: configuration.modes || [],
      propagation: configuration.propagation || [],
      collapseRules: configuration.collapseRules || [],
      stability: 0.5,
      coherence: 0.5,
    };

    this.state.genesisResonances.set(resonance.id, resonance);
    this.updateGlobalMetrics();
    return resonance;
  }

  /**
   * Create genesis identity
   */
  createGenesisIdentity(
    name: { en: string; zh: string },
    spark?: IdentitySpark
  ): GenesisIdentity {
    const identity: GenesisIdentity = {
      id: `genid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      boundary: {
        type: spark ? 'soft' : 'undefined',
        strength: spark?.boundaryStrength || 0,
        definition: spark?.distinctionClarity || 0,
        selfReference: spark?.selfReferenceDepth || 0,
      },
      differentiationRules: [],
      propagationRules: [],
      stability: spark?.persistencePotential || 0.5,
      clarity: spark?.distinctionClarity || 0.5,
    };

    this.state.genesisIdentities.set(identity.id, identity);
    this.updateGlobalMetrics();
    return identity;
  }

  /**
   * Create genesis time
   */
  createGenesisTime(
    name: { en: string; zh: string },
    configuration: {
      direction?: TimeDirection;
      geometry?: TimeGeometry;
      thresholds?: TimeThreshold[];
    } = {}
  ): GenesisTime {
    const time: GenesisTime = {
      id: `gentime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      ignition: {
        triggered: true,
        mechanism: 'symmetry_break',
        precision: 0.8,
        reversible: false,
      },
      direction: configuration.direction || {
        defined: true,
        direction: 'forward',
        strength: 0.8,
        entropyCorrelation: 0.9,
      },
      geometry: configuration.geometry || {
        type: 'linear',
        curvature: 0,
        dimensionality: 1,
        connectedness: 0.5,
      },
      thresholds: configuration.thresholds || [],
      active: true,
    };

    this.state.genesisTimes.set(time.id, time);
    this.updateGlobalMetrics();
    return time;
  }

  /**
   * Create genesis ontology
   */
  createGenesisOntology(
    name: { en: string; zh: string },
    configuration: {
      firstAxiom?: FirstAxiom;
      firstDistinction?: FirstDistinction;
      meaningBoundary?: MeaningBoundary;
      causalProtoGrammar?: CausalProtoGrammar[];
    } = {}
  ): GenesisOntology {
    const ontology: GenesisOntology = {
      id: `genonto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      firstAxiom: configuration.firstAxiom || PRIMORDIAL_AXIOMS[0],
      firstDistinction: configuration.firstDistinction || {
        type: 'being_nonbeing',
        clarity: 0.8,
        stability: 0.8,
        reversible: false,
      },
      meaningBoundary: configuration.meaningBoundary || {
        defined: true,
        strength: 0.7,
        permeability: 0.3,
        selfReference: true,
      },
      causalProtoGrammar: configuration.causalProtoGrammar || [],
      stability: 0.7,
      coherence: 0.8,
    };

    this.state.genesisOntologies.set(ontology.id, ontology);
    this.updateGlobalMetrics();
    return ontology;
  }

  /**
   * Update global metrics
   */
  private updateGlobalMetrics(): void {
    const substrates = Array.from(this.state.genesisSubstrates.values());
    const resonances = Array.from(this.state.genesisResonances.values());
    const identities = Array.from(this.state.genesisIdentities.values());
    const times = Array.from(this.state.genesisTimes.values());
    const ontologies = Array.from(this.state.genesisOntologies.values());

    // Primordial stillness from substrates
    if (substrates.length > 0) {
      this.state.primordialStillness = substrates.reduce((s, sub) => s + sub.stillness, 0) / substrates.length;
    }

    // Differentiation level from all structures
    const totalStructures = resonances.length + identities.length + times.length + ontologies.length;
    this.state.differentiationLevel = Math.min(1, totalStructures / 10);

    // Creation readiness
    const activeImpulses = Array.from(this.state.originImpulses.values()).filter(i => i.result?.success);
    this.state.creationReadiness = Math.min(1, activeImpulses.length / 5);

    // Track active creations
    this.state.activeCreations = [
      ...resonances.map(r => `resonance:${r.id}`),
      ...identities.map(i => `identity:${i.id}`),
      ...times.map(t => `time:${t.id}`),
      ...ontologies.map(o => `ontology:${o.id}`),
    ];
  }

  /**
   * Get genesis substrate by ID
   */
  getSubstrate(id: string): GenesisSubstrate | undefined {
    return this.state.genesisSubstrates.get(id);
  }

  /**
   * Get all substrates
   */
  getAllSubstrates(): GenesisSubstrate[] {
    return Array.from(this.state.genesisSubstrates.values());
  }

  /**
   * Get current state
   */
  getState(): MetaGenesisState {
    return this.state;
  }
}

// ==================== REPORT GENERATION ====================

/**
 * Generate meta-genesis report
 */
export function generateMetaGenesisReport(
  state: MetaGenesisState,
  options: {
    language: 'en' | 'zh' | 'both';
    includeSubstrates: boolean;
    includeImpulses: boolean;
    includeCreations: boolean;
  } = {
    language: 'both',
    includeSubstrates: true,
    includeImpulses: true,
    includeCreations: true,
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
  const substrates = Array.from(state.genesisSubstrates.values());
  const impulses = Array.from(state.originImpulses.values());
  const resonances = Array.from(state.genesisResonances.values());
  const identities = Array.from(state.genesisIdentities.values());
  const times = Array.from(state.genesisTimes.values());
  const ontologies = Array.from(state.genesisOntologies.values());

  const sections: Array<{
    title: { en: string; zh: string };
    content: { en: string; zh: string };
  }> = [];

  // Overview
  sections.push({
    title: { en: 'Meta-Genesis Overview', zh: '元创世概览' },
    content: {
      en: `The meta-genesis engine contains ${substrates.length} genesis substrates and ${impulses.length} origin impulses. Primordial stillness: ${(state.primordialStillness * 100).toFixed(1)}%. Differentiation: ${(state.differentiationLevel * 100).toFixed(1)}%. Creation readiness: ${(state.creationReadiness * 100).toFixed(1)}%.`,
      zh: `元创世引擎包含${substrates.length}个创世基底和${impulses.length}个起源脉冲。原始寂静：${(state.primordialStillness * 100).toFixed(1)}%。分化程度：${(state.differentiationLevel * 100).toFixed(1)}%。创造准备度：${(state.creationReadiness * 100).toFixed(1)}%。`,
    },
  });

  // Primordial Axioms
  sections.push({
    title: { en: 'Primordial Axioms', zh: '原始公理' },
    content: {
      en: PRIMORDIAL_AXIOMS.map(a => `- ${a.statement.en}`).join('\n'),
      zh: PRIMORDIAL_AXIOMS.map(a => `- ${a.statement.zh}`).join('\n'),
    },
  });

  // Substrates
  if (options.includeSubstrates && substrates.length > 0) {
    sections.push({
      title: { en: 'Genesis Substrates', zh: '创世基底' },
      content: {
        en: substrates.map(s => `- ${s.name.en}: symmetry ${s.symmetry.type}, stillness ${(s.stillness * 100).toFixed(1)}%, readiness ${(s.readinessForImpulse * 100).toFixed(1)}%`).join('\n'),
        zh: substrates.map(s => `- ${s.name.zh}：对称性${s.symmetry.type}，寂静${(s.stillness * 100).toFixed(1)}%，准备度${(s.readinessForImpulse * 100).toFixed(1)}%`).join('\n'),
      },
    });
  }

  // Origin Impulses
  if (options.includeImpulses && impulses.length > 0) {
    sections.push({
      title: { en: 'Origin Impulses', zh: '起源脉冲' },
      content: {
        en: impulses.map(i => `- ${i.name.en}: ${i.appliedAt ? 'applied' : 'pending'}, magnitude ${(i.magnitude * 100).toFixed(1)}%`).join('\n'),
        zh: impulses.map(i => `- ${i.name.zh}：${i.appliedAt ? '已应用' : '待定'}，强度${(i.magnitude * 100).toFixed(1)}%`).join('\n'),
      },
    });
  }

  // Emergent Structures
  if (options.includeCreations && state.activeCreations.length > 0) {
    sections.push({
      title: { en: 'Emergent Structures', zh: '涌现结构' },
      content: {
        en: [
          resonances.length > 0 ? `Resonances: ${resonances.length}` : '',
          identities.length > 0 ? `Identities: ${identities.length}` : '',
          times.length > 0 ? `Time structures: ${times.length}` : '',
          ontologies.length > 0 ? `Ontologies: ${ontologies.length}` : '',
        ].filter(Boolean).join('\n'),
        zh: [
          resonances.length > 0 ? `共振：${resonances.length}` : '',
          identities.length > 0 ? `身份：${identities.length}` : '',
          times.length > 0 ? `时间结构：${times.length}` : '',
          ontologies.length > 0 ? `本体论：${ontologies.length}` : '',
        ].filter(Boolean).join('\n'),
      },
    });
  }

  const status = state.primordialStillness > 0.8 ? 'Primordial Stillness' :
                 state.differentiationLevel < 0.3 ? 'Pre-Differentiation' :
                 state.creationReadiness < 0.5 ? 'Early Genesis' : 'Active Creation';
  const statusZh = state.primordialStillness > 0.8 ? '原始寂静' :
                   state.differentiationLevel < 0.3 ? '前分化' :
                   state.creationReadiness < 0.5 ? '早期创世' : '活跃创造';

  return {
    title: { en: 'Meta-Genesis Report', zh: '元创世报告' },
    timestamp: new Date().toISOString(),
    summary: {
      en: `Genesis status: ${status}. ${substrates.length} substrates, ${state.activeCreations.length} active creations.`,
      zh: `创世状态：${statusZh}。${substrates.length}个基底，${state.activeCreations.length}个活跃创造。`,
    },
    sections,
  };
}

// ==================== EXPORTS ====================

export {
  MetaGenesisEngine,
  generateMetaGenesisReport,
  PRIMORDIAL_AXIOMS,
  DEFAULT_GENESIS_CONFIG,
};
