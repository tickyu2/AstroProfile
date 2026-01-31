/**
 * Detector #83: Emotional Harmonic Resonance Co-Creation
 *
 * Pattern: Synthesized harmonics become mutually generative → partners co-create
 * new emotional structures → resonance becomes a shared creative engine
 *
 * This detector identifies when two people:
 * - Feel emotional resonance generating new patterns through their interaction
 * - Experience emotional creativity that arises from the relational field itself
 * - Sense emotional rhythms that evolve in response to each other
 * - Feel emotional cycles that produce new modes of connection neither could initiate alone
 * - Experience the emotional field as a shared generative harmonic system
 *
 * The signature of relationships where partners say:
 * "We create new things together that neither of us could alone."
 * "Our connection feels like a creative engine."
 * "The emotional field is generating new patterns through us."
 */

const TRAIT_INDEX = {
  Initiator: 0,
  Stabilizer: 1,
  BoundaryAware: 2,
  Warm: 3,
  Expressive: 4,
  DepthOriented: 5,
  Resilient: 6,
  Adventurous: 7,
  Relational: 8,
  MindCentered: 9,
  FluidIdentity: 10,
  SystemsOriented: 11,
  Sustainer: 12,
  ShadowAware: 13,
  Transcendent: 14,
  NurtureOriented: 15
};

function avg(archetype, indices) {
  const sum = indices.reduce((s, i) => s + (archetype[i] || 0), 0);
  return sum / indices.length;
}

export function detectEmotionalHarmonicResonanceCoCreation(archetypeA, archetypeB) {
  // Co-creation axes: mutual generativity, shared harmonic emergence
  const coCreationAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Relational, TRAIT_INDEX.FluidIdentity];

  // Synthesis axes: emergent harmonic creativity supporting co-creation
  const synthesisAxes = [TRAIT_INDEX.DepthOriented, TRAIT_INDEX.Warm];

  // Stability axes: ability to sustain shared generative harmonic field
  const stabilityAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  const A_co = avg(archetypeA, coCreationAxes);
  const B_co = avg(archetypeB, coCreationAxes);

  const A_syn = avg(archetypeA, synthesisAxes);
  const B_syn = avg(archetypeB, synthesisAxes);

  const A_stab = avg(archetypeA, stabilityAxes);
  const B_stab = avg(archetypeB, stabilityAxes);

  // Co-creation: mutual generativity emerging from unified resonance
  const highCoCreation = (A_co + B_co) / 2 >= 0.74;

  // Synthesis support: emergent creativity enabling co-creation
  const strongSynthesis = (A_syn + B_syn) / 2 >= 0.66;

  // Stability: emotional system able to sustain shared generative field
  const sustainedStability = (A_stab + B_stab) / 2 >= 0.60;

  if (highCoCreation && strongSynthesis && sustainedStability) {
    return {
      triggered: true,
      penalty: 0.00,
      destabilizer: 0.00,
      gradeCap: null,
      harmonyCap: null,
      severity: 'none',
      flag: 'Emotional Harmonic Resonance Co-Creation (Mutual, Emergent, Shared Harmonic Generativity)',
      details: {
        coCreationAvg: (A_co + B_co) / 2,
        synthesisAvg: (A_syn + B_syn) / 2,
        stabilityAvg: (A_stab + B_stab) / 2
      }
    };
  }

  return { triggered: false };
}
