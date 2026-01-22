/**
 * ============================================
 * PRO REPORT DESIGNER 19.0
 * Meta-Potentiality Engine
 *
 * The Cathedral's meta-potentiality layer —
 * shaping the space before possibility,
 * the pre-ontological substrate from which
 * all potential, causality, and existence arise.
 * ============================================
 */

// ==================== TYPE DEFINITIONS ====================

/**
 * Pre-ontological gradient types
 */
export type PotentialGradientType =
  | 'proto_causal'      // Tendency toward causation
  | 'proto_temporal'    // Tendency toward time
  | 'proto_spatial'     // Tendency toward space
  | 'proto_conscious'   // Tendency toward awareness
  | 'proto_material'    // Tendency toward substance
  | 'proto_meaning'     // Tendency toward significance
  | 'proto_complexity'  // Tendency toward organization
  | 'proto_unity'       // Tendency toward oneness
  | 'proto_diversity';  // Tendency toward multiplicity

/**
 * Attractor types in potential field
 */
export type PotentialAttractorType =
  | 'existence'         // Draws toward being
  | 'void'              // Draws toward non-being
  | 'order'             // Draws toward pattern
  | 'chaos'             // Draws toward disorder
  | 'consciousness'     // Draws toward awareness
  | 'matter'            // Draws toward substance
  | 'meaning'           // Draws toward significance
  | 'connection'        // Draws toward relation
  | 'individuation';    // Draws toward distinction

/**
 * Harmonic types in pre-consciousness field
 */
export type HarmonicType =
  | 'fundamental'       // Base frequency
  | 'overtone'          // Higher harmonics
  | 'undertone'         // Lower harmonics
  | 'resonant'          // Self-reinforcing
  | 'dissonant'         // Self-canceling
  | 'emergent'          // Arising from combination
  | 'primordial';       // Before differentiation

/**
 * Polarity types for archetypal seeds
 */
export type SeedPolarity =
  | 'positive'          // Yang, active, projective
  | 'negative'          // Yin, receptive, attractive
  | 'neutral'           // Balance point
  | 'oscillating'       // Alternating
  | 'superposed'        // Both simultaneously
  | 'undefined';        // Not yet determined

/**
 * Pre-ontological potential field
 */
export interface PotentialField {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  gradients: PotentialGradient[];
  attractors: PotentialAttractor[];
  densities: PotentialDensity[];
  harmonics: PotentialHarmonic[];
  resonances: PotentialResonance[];
  undifferentiatedEnergy: number;  // 0-1 raw potential
  coherence: number;               // 0-1 internal consistency
  readinessForExistence: number;   // 0-1 how close to manifesting
  metadata: {
    createdAt: string;
    createdBy: string;
    version: number;
  };
}

/**
 * Potential gradient
 */
export interface PotentialGradient {
  id: string;
  type: PotentialGradientType;
  direction: number[];    // Vector in potential-space
  magnitude: number;      // 0-1
  stability: number;      // 0-1 how persistent
  description: {
    en: string;
    zh: string;
  };
}

/**
 * Potential attractor
 */
export interface PotentialAttractor {
  id: string;
  type: PotentialAttractorType;
  strength: number;       // 0-1
  range: number;          // Effective radius
  position: number[];     // Location in potential-space
  basin: AttractorBasin;
  description: {
    en: string;
    zh: string;
  };
}

/**
 * Attractor basin
 */
export interface AttractorBasin {
  depth: number;          // How strong the pull
  width: number;          // How wide the catchment
  stability: number;      // How persistent
  escapable: boolean;     // Can potential escape
  escapeThreshold: number;
}

/**
 * Potential density
 */
export interface PotentialDensity {
  id: string;
  region: number[];       // Coordinates in potential-space
  density: number;        // Concentration of potential
  temperature: number;    // Activity level
  pressure: number;       // Tendency to expand/contract
  phase: 'proto_solid' | 'proto_liquid' | 'proto_gas' | 'proto_plasma' | 'undifferentiated';
}

/**
 * Potential harmonic
 */
export interface PotentialHarmonic {
  id: string;
  type: HarmonicType;
  frequency: number;
  amplitude: number;
  phase: number;
  damping: number;        // Decay rate
  source: string;         // What generates this harmonic
  effects: string[];      // What this harmonic influences
}

/**
 * Potential resonance
 */
export interface PotentialResonance {
  id: string;
  source1: string;
  source2: string;
  resonanceStrength: number;
  harmonicRelation: number;  // Frequency ratio
  phaseCoherence: number;    // How aligned
  emergentEffects: string[];
}

/**
 * Potential sculpt (design operation)
 */
export interface PotentialSculpt {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  targetField: string;    // PotentialField ID
  operation: SculptOperation;
  gradientShape: GradientShape;
  attractorMap: AttractorConfiguration[];
  densityProfile: DensityProfile;
  harmonicProfile: HarmonicConfiguration[];
  expectedOutcome: {
    en: string;
    zh: string;
  };
  appliedAt: string | null;
  result: SculptResult | null;
}

/**
 * Sculpt operation types
 */
export type SculptOperation =
  | 'shape'             // Modify existing
  | 'seed'              // Plant new potential
  | 'dissolve'          // Remove potential
  | 'merge'             // Combine fields
  | 'split'             // Divide field
  | 'harmonize'         // Align frequencies
  | 'amplify'           // Increase intensity
  | 'dampen';           // Decrease intensity

/**
 * Gradient shape specification
 */
export interface GradientShape {
  type: 'linear' | 'radial' | 'spiral' | 'fractal' | 'custom';
  parameters: Record<string, number>;
  direction: number[];
}

/**
 * Attractor configuration
 */
export interface AttractorConfiguration {
  type: PotentialAttractorType;
  position: number[];
  strength: number;
  range: number;
}

/**
 * Density profile
 */
export interface DensityProfile {
  distribution: 'uniform' | 'gaussian' | 'exponential' | 'custom';
  parameters: Record<string, number>;
  boundaries: number[][];
}

/**
 * Harmonic configuration
 */
export interface HarmonicConfiguration {
  type: HarmonicType;
  frequency: number;
  amplitude: number;
  phase: number;
}

/**
 * Sculpt result
 */
export interface SculptResult {
  success: boolean;
  fieldId: string;
  changes: string[];
  newCoherence: number;
  newReadiness: number;
  sideEffects: string[];
}

/**
 * Pre-causal architecture
 */
export interface PreCausalArchitecture {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  protoRelations: ProtoRelation[];
  protoInfluences: ProtoInfluence[];
  protoConstraints: ProtoConstraint[];
  protoAgency: ProtoAgency[];
  differentiation: number;  // 0-1 how far from undifferentiated
  causalReadiness: number;  // 0-1 how close to causality
}

/**
 * Proto-relation (before causality)
 */
export interface ProtoRelation {
  id: string;
  type: 'proximity' | 'resonance' | 'polarity' | 'containment' | 'overlap' | 'undefined';
  strength: number;
  elements: string[];
  tendency: 'attraction' | 'repulsion' | 'neutral' | 'oscillating';
}

/**
 * Proto-influence (tendency without causation)
 */
export interface ProtoInfluence {
  id: string;
  source: string;
  target: string;
  mechanism: 'resonance' | 'gradient' | 'pressure' | 'harmonic' | 'undefined';
  strength: number;
  bidirectional: boolean;
}

/**
 * Proto-constraint (limitation before rules)
 */
export interface ProtoConstraint {
  id: string;
  type: 'impossibility' | 'improbability' | 'resistance' | 'boundary';
  description: string;
  strength: number;
  scope: string[];
}

/**
 * Proto-agency (tendency toward action without actor)
 */
export interface ProtoAgency {
  id: string;
  type: 'tendency' | 'propensity' | 'disposition' | 'potential';
  strength: number;
  direction: string;
  stability: number;
}

/**
 * Pre-temporal geometry
 */
export interface PreTemporalGeometry {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  curvature: PreTemporalCurvature;
  density: PreTemporalDensity;
  directionality: PreTemporalDirection;
  thresholds: PreTemporalThreshold[];
  readinessForTime: number;  // 0-1
}

/**
 * Pre-temporal curvature
 */
export interface PreTemporalCurvature {
  type: 'flat' | 'positive' | 'negative' | 'variable' | 'undefined';
  magnitude: number;
  distribution: 'uniform' | 'localized' | 'gradient';
}

/**
 * Pre-temporal density
 */
export interface PreTemporalDensity {
  average: number;
  distribution: 'uniform' | 'clustered' | 'gradient';
  fluctuations: number;
}

/**
 * Pre-temporal direction
 */
export interface PreTemporalDirection {
  defined: boolean;
  bias: 'forward' | 'backward' | 'none' | 'oscillating';
  strength: number;
}

/**
 * Pre-temporal threshold
 */
export interface PreTemporalThreshold {
  id: string;
  type: 'emergence' | 'collapse' | 'bifurcation' | 'crystallization';
  threshold: number;
  effect: string;
}

/**
 * Archetype seed
 */
export interface ArchetypeSeed {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  polarity: SeedPolarity;
  resonances: SeedResonance[];
  potentials: SeedPotential[];
  propagationRules: PropagationRule[];
  stability: number;
  activation: number;  // 0-1 how close to awakening
}

/**
 * Seed resonance
 */
export interface SeedResonance {
  frequency: number;
  amplitude: number;
  phase: number;
  affinity: string[];  // What it resonates with
}

/**
 * Seed potential
 */
export interface SeedPotential {
  type: string;
  magnitude: number;
  conditions: string[];  // When it can manifest
}

/**
 * Propagation rule
 */
export interface PropagationRule {
  trigger: string;
  effect: string;
  probability: number;
  range: number;
}

/**
 * Consciousness harmonic
 */
export interface ConsciousnessHarmonic {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  modes: HarmonicMode[];
  coherence: number;
  thresholds: ConsciousnessThreshold[];
  awarenessReadiness: number;  // 0-1
}

/**
 * Harmonic mode
 */
export interface HarmonicMode {
  id: string;
  frequency: number;
  amplitude: number;
  quality: 'pure' | 'complex' | 'chaotic';
  stability: number;
}

/**
 * Consciousness threshold
 */
export interface ConsciousnessThreshold {
  level: number;
  effect: string;
  reversible: boolean;
  emergentProperty: string | null;
}

/**
 * Meta-potentiality state
 */
export interface MetaPotentialityState {
  id: string;
  timestamp: string;
  potentialFields: Map<string, PotentialField>;
  preCausalArchitectures: Map<string, PreCausalArchitecture>;
  preTemporalGeometries: Map<string, PreTemporalGeometry>;
  archetypeSeeds: Map<string, ArchetypeSeed>;
  consciousnessHarmonics: Map<string, ConsciousnessHarmonic>;
  activeSculpts: PotentialSculpt[];
  overallPotential: number;
  differentiationLevel: number;
  emergenceReadiness: number;
}

// ==================== META-POTENTIALITY ENGINE ====================

/**
 * Meta-Potentiality Engine
 */
export class MetaPotentialityEngine {
  private state: MetaPotentialityState;

  constructor() {
    this.state = this.initializeState();
  }

  private initializeState(): MetaPotentialityState {
    return {
      id: `meta-potentiality-${Date.now()}`,
      timestamp: new Date().toISOString(),
      potentialFields: new Map(),
      preCausalArchitectures: new Map(),
      preTemporalGeometries: new Map(),
      archetypeSeeds: new Map(),
      consciousnessHarmonics: new Map(),
      activeSculpts: [],
      overallPotential: 1.0,
      differentiationLevel: 0,
      emergenceReadiness: 0,
    };
  }

  /**
   * Create a new potential field
   */
  createPotentialField(
    name: { en: string; zh: string },
    initialConfiguration: {
      gradients?: PotentialGradient[];
      attractors?: PotentialAttractor[];
      densities?: PotentialDensity[];
      harmonics?: PotentialHarmonic[];
    } = {}
  ): PotentialField {
    const field: PotentialField = {
      id: `potfield-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      gradients: initialConfiguration.gradients || [],
      attractors: initialConfiguration.attractors || [],
      densities: initialConfiguration.densities || [],
      harmonics: initialConfiguration.harmonics || [],
      resonances: [],
      undifferentiatedEnergy: 1.0,
      coherence: 1.0,
      readinessForExistence: 0,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        version: 1,
      },
    };

    this.state.potentialFields.set(field.id, field);
    this.updateGlobalMetrics();
    return field;
  }

  /**
   * Add gradient to potential field
   */
  addGradient(fieldId: string, gradient: Omit<PotentialGradient, 'id'>): PotentialGradient {
    const field = this.state.potentialFields.get(fieldId);
    if (!field) {
      throw new Error(`Field ${fieldId} not found`);
    }

    const fullGradient: PotentialGradient = {
      id: `grad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...gradient,
    };

    field.gradients.push(fullGradient);
    this.updateFieldMetrics(field);
    return fullGradient;
  }

  /**
   * Add attractor to potential field
   */
  addAttractor(fieldId: string, attractor: Omit<PotentialAttractor, 'id'>): PotentialAttractor {
    const field = this.state.potentialFields.get(fieldId);
    if (!field) {
      throw new Error(`Field ${fieldId} not found`);
    }

    const fullAttractor: PotentialAttractor = {
      id: `attr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...attractor,
    };

    field.attractors.push(fullAttractor);
    this.updateFieldMetrics(field);
    return fullAttractor;
  }

  /**
   * Add harmonic to potential field
   */
  addHarmonic(fieldId: string, harmonic: Omit<PotentialHarmonic, 'id'>): PotentialHarmonic {
    const field = this.state.potentialFields.get(fieldId);
    if (!field) {
      throw new Error(`Field ${fieldId} not found`);
    }

    const fullHarmonic: PotentialHarmonic = {
      id: `harm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...harmonic,
    };

    field.harmonics.push(fullHarmonic);
    this.calculateResonances(field);
    this.updateFieldMetrics(field);
    return fullHarmonic;
  }

  /**
   * Calculate resonances between harmonics
   */
  private calculateResonances(field: PotentialField): void {
    field.resonances = [];

    for (let i = 0; i < field.harmonics.length; i++) {
      for (let j = i + 1; j < field.harmonics.length; j++) {
        const h1 = field.harmonics[i];
        const h2 = field.harmonics[j];

        const ratio = h1.frequency / h2.frequency;
        const isHarmonic = Math.abs(ratio - Math.round(ratio)) < 0.1;

        if (isHarmonic) {
          field.resonances.push({
            id: `res-${h1.id}-${h2.id}`,
            source1: h1.id,
            source2: h2.id,
            resonanceStrength: (h1.amplitude + h2.amplitude) / 2,
            harmonicRelation: ratio,
            phaseCoherence: 1 - Math.abs(h1.phase - h2.phase) / Math.PI,
            emergentEffects: ['amplification', 'stabilization'],
          });
        }
      }
    }
  }

  /**
   * Update field metrics
   */
  private updateFieldMetrics(field: PotentialField): void {
    // Calculate coherence from harmonic alignment
    const resonanceCount = field.resonances.length;
    const possibleResonances = (field.harmonics.length * (field.harmonics.length - 1)) / 2;
    field.coherence = possibleResonances > 0 ? resonanceCount / possibleResonances : 1;

    // Calculate readiness from attractors and gradients
    const attractorStrength = field.attractors.reduce((sum, a) => sum + a.strength, 0) / Math.max(1, field.attractors.length);
    const gradientMagnitude = field.gradients.reduce((sum, g) => sum + g.magnitude, 0) / Math.max(1, field.gradients.length);
    field.readinessForExistence = (attractorStrength + gradientMagnitude) / 2;

    // Update undifferentiated energy (decreases with structure)
    const structureLevel = (field.gradients.length + field.attractors.length + field.harmonics.length) / 30;
    field.undifferentiatedEnergy = Math.max(0, 1 - structureLevel);

    this.updateGlobalMetrics();
  }

  /**
   * Create pre-causal architecture
   */
  createPreCausalArchitecture(
    name: { en: string; zh: string },
    configuration: {
      protoRelations?: ProtoRelation[];
      protoInfluences?: ProtoInfluence[];
      protoConstraints?: ProtoConstraint[];
      protoAgency?: ProtoAgency[];
    } = {}
  ): PreCausalArchitecture {
    const architecture: PreCausalArchitecture = {
      id: `precausal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      protoRelations: configuration.protoRelations || [],
      protoInfluences: configuration.protoInfluences || [],
      protoConstraints: configuration.protoConstraints || [],
      protoAgency: configuration.protoAgency || [],
      differentiation: 0,
      causalReadiness: 0,
    };

    this.updatePreCausalMetrics(architecture);
    this.state.preCausalArchitectures.set(architecture.id, architecture);
    this.updateGlobalMetrics();
    return architecture;
  }

  /**
   * Update pre-causal metrics
   */
  private updatePreCausalMetrics(architecture: PreCausalArchitecture): void {
    const totalElements =
      architecture.protoRelations.length +
      architecture.protoInfluences.length +
      architecture.protoConstraints.length +
      architecture.protoAgency.length;

    architecture.differentiation = Math.min(1, totalElements / 20);

    // Causal readiness depends on having influences and constraints
    const influenceStrength = architecture.protoInfluences.reduce((s, i) => s + i.strength, 0) /
      Math.max(1, architecture.protoInfluences.length);
    const constraintStrength = architecture.protoConstraints.reduce((s, c) => s + c.strength, 0) /
      Math.max(1, architecture.protoConstraints.length);

    architecture.causalReadiness = (influenceStrength + constraintStrength) / 2;
  }

  /**
   * Create pre-temporal geometry
   */
  createPreTemporalGeometry(
    name: { en: string; zh: string },
    configuration: {
      curvature?: PreTemporalCurvature;
      density?: PreTemporalDensity;
      directionality?: PreTemporalDirection;
      thresholds?: PreTemporalThreshold[];
    } = {}
  ): PreTemporalGeometry {
    const geometry: PreTemporalGeometry = {
      id: `pretemporal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      curvature: configuration.curvature || {
        type: 'undefined',
        magnitude: 0,
        distribution: 'uniform',
      },
      density: configuration.density || {
        average: 0.5,
        distribution: 'uniform',
        fluctuations: 0.1,
      },
      directionality: configuration.directionality || {
        defined: false,
        bias: 'none',
        strength: 0,
      },
      thresholds: configuration.thresholds || [],
      readinessForTime: 0,
    };

    this.updatePreTemporalMetrics(geometry);
    this.state.preTemporalGeometries.set(geometry.id, geometry);
    this.updateGlobalMetrics();
    return geometry;
  }

  /**
   * Update pre-temporal metrics
   */
  private updatePreTemporalMetrics(geometry: PreTemporalGeometry): void {
    let readiness = 0;

    // Curvature definition adds readiness
    if (geometry.curvature.type !== 'undefined') {
      readiness += 0.3;
    }

    // Directionality adds readiness
    if (geometry.directionality.defined) {
      readiness += 0.3 * geometry.directionality.strength;
    }

    // Thresholds add readiness
    readiness += Math.min(0.3, geometry.thresholds.length * 0.1);

    geometry.readinessForTime = readiness;
  }

  /**
   * Create archetype seed
   */
  createArchetypeSeed(
    name: { en: string; zh: string },
    polarity: SeedPolarity,
    configuration: {
      resonances?: SeedResonance[];
      potentials?: SeedPotential[];
      propagationRules?: PropagationRule[];
    } = {}
  ): ArchetypeSeed {
    const seed: ArchetypeSeed = {
      id: `seed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      polarity,
      resonances: configuration.resonances || [],
      potentials: configuration.potentials || [],
      propagationRules: configuration.propagationRules || [],
      stability: 0.5,
      activation: 0,
    };

    this.updateSeedMetrics(seed);
    this.state.archetypeSeeds.set(seed.id, seed);
    this.updateGlobalMetrics();
    return seed;
  }

  /**
   * Update seed metrics
   */
  private updateSeedMetrics(seed: ArchetypeSeed): void {
    // Stability from resonance coherence
    const avgAmplitude = seed.resonances.reduce((s, r) => s + r.amplitude, 0) /
      Math.max(1, seed.resonances.length);
    seed.stability = avgAmplitude;

    // Activation from potentials
    const avgMagnitude = seed.potentials.reduce((s, p) => s + p.magnitude, 0) /
      Math.max(1, seed.potentials.length);
    seed.activation = avgMagnitude;
  }

  /**
   * Create consciousness harmonic
   */
  createConsciousnessHarmonic(
    name: { en: string; zh: string },
    configuration: {
      modes?: HarmonicMode[];
      thresholds?: ConsciousnessThreshold[];
    } = {}
  ): ConsciousnessHarmonic {
    const harmonic: ConsciousnessHarmonic = {
      id: `consciharm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      modes: configuration.modes || [],
      coherence: 0,
      thresholds: configuration.thresholds || [],
      awarenessReadiness: 0,
    };

    this.updateConsciousnessMetrics(harmonic);
    this.state.consciousnessHarmonics.set(harmonic.id, harmonic);
    this.updateGlobalMetrics();
    return harmonic;
  }

  /**
   * Update consciousness metrics
   */
  private updateConsciousnessMetrics(harmonic: ConsciousnessHarmonic): void {
    // Coherence from mode alignment
    const avgStability = harmonic.modes.reduce((s, m) => s + m.stability, 0) /
      Math.max(1, harmonic.modes.length);
    harmonic.coherence = avgStability;

    // Awareness readiness from amplitude and coherence
    const avgAmplitude = harmonic.modes.reduce((s, m) => s + m.amplitude, 0) /
      Math.max(1, harmonic.modes.length);
    harmonic.awarenessReadiness = (avgAmplitude + harmonic.coherence) / 2;
  }

  /**
   * Create and apply a potential sculpt
   */
  applySculpt(sculpt: Omit<PotentialSculpt, 'id' | 'appliedAt' | 'result'>): PotentialSculpt {
    const field = this.state.potentialFields.get(sculpt.targetField);
    if (!field) {
      throw new Error(`Field ${sculpt.targetField} not found`);
    }

    const fullSculpt: PotentialSculpt = {
      id: `sculpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...sculpt,
      appliedAt: new Date().toISOString(),
      result: null,
    };

    // Apply the sculpt operation
    const changes: string[] = [];

    switch (sculpt.operation) {
      case 'shape':
        // Modify gradients
        for (const config of sculpt.attractorMap) {
          this.addAttractor(field.id, {
            type: config.type,
            strength: config.strength,
            range: config.range,
            position: config.position,
            basin: {
              depth: config.strength,
              width: config.range,
              stability: 0.8,
              escapable: true,
              escapeThreshold: config.strength * 2,
            },
            description: { en: 'Sculpted attractor', zh: '雕刻的吸引子' },
          });
          changes.push(`Added attractor: ${config.type}`);
        }
        break;

      case 'harmonize':
        // Align harmonic phases
        const basePhase = field.harmonics[0]?.phase || 0;
        for (const h of field.harmonics) {
          h.phase = basePhase;
        }
        changes.push('Harmonized all phases');
        break;

      case 'amplify':
        // Increase all amplitudes
        for (const h of field.harmonics) {
          h.amplitude *= 1.5;
        }
        for (const a of field.attractors) {
          a.strength *= 1.5;
        }
        changes.push('Amplified all intensities');
        break;

      case 'dampen':
        // Decrease all amplitudes
        for (const h of field.harmonics) {
          h.amplitude *= 0.5;
        }
        for (const a of field.attractors) {
          a.strength *= 0.5;
        }
        changes.push('Dampened all intensities');
        break;
    }

    this.updateFieldMetrics(field);

    fullSculpt.result = {
      success: true,
      fieldId: field.id,
      changes,
      newCoherence: field.coherence,
      newReadiness: field.readinessForExistence,
      sideEffects: [],
    };

    this.state.activeSculpts.push(fullSculpt);
    return fullSculpt;
  }

  /**
   * Update global metrics
   */
  private updateGlobalMetrics(): void {
    const fields = Array.from(this.state.potentialFields.values());
    const preCausals = Array.from(this.state.preCausalArchitectures.values());
    const preTemporals = Array.from(this.state.preTemporalGeometries.values());
    const seeds = Array.from(this.state.archetypeSeeds.values());
    const harmonics = Array.from(this.state.consciousnessHarmonics.values());

    // Overall potential from undifferentiated energy
    if (fields.length > 0) {
      this.state.overallPotential = fields.reduce((s, f) => s + f.undifferentiatedEnergy, 0) / fields.length;
    }

    // Differentiation level from all structures
    const totalStructures = fields.length + preCausals.length + preTemporals.length + seeds.length + harmonics.length;
    this.state.differentiationLevel = Math.min(1, totalStructures / 20);

    // Emergence readiness from readiness metrics
    let readinessSum = 0;
    let readinessCount = 0;

    for (const f of fields) {
      readinessSum += f.readinessForExistence;
      readinessCount++;
    }
    for (const pc of preCausals) {
      readinessSum += pc.causalReadiness;
      readinessCount++;
    }
    for (const pt of preTemporals) {
      readinessSum += pt.readinessForTime;
      readinessCount++;
    }
    for (const h of harmonics) {
      readinessSum += h.awarenessReadiness;
      readinessCount++;
    }

    this.state.emergenceReadiness = readinessCount > 0 ? readinessSum / readinessCount : 0;
  }

  /**
   * Get potential field by ID
   */
  getPotentialField(id: string): PotentialField | undefined {
    return this.state.potentialFields.get(id);
  }

  /**
   * Get all potential fields
   */
  getAllPotentialFields(): PotentialField[] {
    return Array.from(this.state.potentialFields.values());
  }

  /**
   * Get current state
   */
  getState(): MetaPotentialityState {
    return this.state;
  }
}

// ==================== REPORT GENERATION ====================

/**
 * Generate meta-potentiality report
 */
export function generateMetaPotentialityReport(
  state: MetaPotentialityState,
  options: {
    language: 'en' | 'zh' | 'both';
    includeFields: boolean;
    includeArchitectures: boolean;
    includeSeeds: boolean;
  } = {
    language: 'both',
    includeFields: true,
    includeArchitectures: true,
    includeSeeds: true,
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
  const fields = Array.from(state.potentialFields.values());
  const preCausals = Array.from(state.preCausalArchitectures.values());
  const preTemporals = Array.from(state.preTemporalGeometries.values());
  const seeds = Array.from(state.archetypeSeeds.values());
  const harmonics = Array.from(state.consciousnessHarmonics.values());

  const sections: Array<{
    title: { en: string; zh: string };
    content: { en: string; zh: string };
  }> = [];

  // Overview
  sections.push({
    title: { en: 'Meta-Potentiality Overview', zh: '元潜能概览' },
    content: {
      en: `The meta-potentiality substrate contains ${fields.length} potential fields, ${preCausals.length} pre-causal architectures, ${preTemporals.length} pre-temporal geometries, ${seeds.length} archetype seeds, and ${harmonics.length} consciousness harmonics. Overall potential: ${(state.overallPotential * 100).toFixed(1)}%. Differentiation: ${(state.differentiationLevel * 100).toFixed(1)}%. Emergence readiness: ${(state.emergenceReadiness * 100).toFixed(1)}%.`,
      zh: `元潜能基底包含${fields.length}个潜能场、${preCausals.length}个前因果架构、${preTemporals.length}个前时间几何、${seeds.length}个原型种子和${harmonics.length}个意识谐波。整体潜能：${(state.overallPotential * 100).toFixed(1)}%。分化程度：${(state.differentiationLevel * 100).toFixed(1)}%。涌现准备度：${(state.emergenceReadiness * 100).toFixed(1)}%。`,
    },
  });

  // Potential Fields
  if (options.includeFields && fields.length > 0) {
    sections.push({
      title: { en: 'Potential Fields', zh: '潜能场' },
      content: {
        en: fields.map(f => `- ${f.name.en}: coherence ${(f.coherence * 100).toFixed(1)}%, readiness ${(f.readinessForExistence * 100).toFixed(1)}%`).join('\n'),
        zh: fields.map(f => `- ${f.name.zh}：连贯性${(f.coherence * 100).toFixed(1)}%，准备度${(f.readinessForExistence * 100).toFixed(1)}%`).join('\n'),
      },
    });
  }

  // Pre-Causal Architectures
  if (options.includeArchitectures && preCausals.length > 0) {
    sections.push({
      title: { en: 'Pre-Causal Architectures', zh: '前因果架构' },
      content: {
        en: preCausals.map(p => `- ${p.name.en}: differentiation ${(p.differentiation * 100).toFixed(1)}%, causal readiness ${(p.causalReadiness * 100).toFixed(1)}%`).join('\n'),
        zh: preCausals.map(p => `- ${p.name.zh}：分化${(p.differentiation * 100).toFixed(1)}%，因果准备度${(p.causalReadiness * 100).toFixed(1)}%`).join('\n'),
      },
    });
  }

  // Archetype Seeds
  if (options.includeSeeds && seeds.length > 0) {
    sections.push({
      title: { en: 'Archetype Seeds', zh: '原型种子' },
      content: {
        en: seeds.map(s => `- ${s.name.en}: ${s.polarity} polarity, stability ${(s.stability * 100).toFixed(1)}%, activation ${(s.activation * 100).toFixed(1)}%`).join('\n'),
        zh: seeds.map(s => `- ${s.name.zh}：${s.polarity}极性，稳定性${(s.stability * 100).toFixed(1)}%，激活度${(s.activation * 100).toFixed(1)}%`).join('\n'),
      },
    });
  }

  // Consciousness Harmonics
  if (harmonics.length > 0) {
    sections.push({
      title: { en: 'Consciousness Harmonics', zh: '意识谐波' },
      content: {
        en: harmonics.map(h => `- ${h.name.en}: ${h.modes.length} modes, coherence ${(h.coherence * 100).toFixed(1)}%, awareness readiness ${(h.awarenessReadiness * 100).toFixed(1)}%`).join('\n'),
        zh: harmonics.map(h => `- ${h.name.zh}：${h.modes.length}个模式，连贯性${(h.coherence * 100).toFixed(1)}%，觉知准备度${(h.awarenessReadiness * 100).toFixed(1)}%`).join('\n'),
      },
    });
  }

  const status = state.emergenceReadiness < 0.3 ? 'Dormant' :
                 state.emergenceReadiness < 0.7 ? 'Stirring' : 'Ready to Emerge';
  const statusZh = state.emergenceReadiness < 0.3 ? '休眠' :
                   state.emergenceReadiness < 0.7 ? '萌动' : '准备涌现';

  return {
    title: { en: 'Meta-Potentiality Report', zh: '元潜能报告' },
    timestamp: new Date().toISOString(),
    summary: {
      en: `Potentiality status: ${status}. ${fields.length} fields, ${seeds.length} seeds, emergence readiness: ${(state.emergenceReadiness * 100).toFixed(1)}%.`,
      zh: `潜能状态：${statusZh}。${fields.length}个场，${seeds.length}个种子，涌现准备度：${(state.emergenceReadiness * 100).toFixed(1)}%。`,
    },
    sections,
  };
}

// ==================== EXPORTS ====================

export {
  MetaPotentialityEngine,
  generateMetaPotentialityReport,
};
