/**
 * ============================================
 * P1: Planetary Degree Encoding
 * ============================================
 *
 * Adds degree-level precision to Western astrology personality mapping.
 * 15° Aries ≠ 29° Aries - same sign, different energy.
 *
 * Features:
 * - Decan modifiers (0-10°, 10-20°, 20-30°)
 * - Critical degree weights (0°, 29° anaretic, etc.)
 * - Cusp blending for sign transitions
 * - Planetary rulership by decan
 *
 * Created: January 8, 2026
 * For: GENESIS AI Soul Partner System - Cathedral Build
 */

import { NUM_FACETS } from './neoFacetSchema';

// ============================================
// ZODIAC SIGNS
// ============================================

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const SIGN_ELEMENTS = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
};

export const SIGN_MODALITIES = {
  Aries: 'Cardinal', Taurus: 'Fixed', Gemini: 'Mutable', Cancer: 'Cardinal',
  Leo: 'Fixed', Virgo: 'Mutable', Libra: 'Cardinal', Scorpio: 'Fixed',
  Sagittarius: 'Mutable', Capricorn: 'Cardinal', Aquarius: 'Fixed', Pisces: 'Mutable'
};

// ============================================
// DECAN SYSTEM (Traditional Chaldean)
// ============================================
// Each sign has 3 decans of 10° each
// Each decan is ruled by a different planet

export const DECAN_RULERS = {
  // Aries decans
  Aries: ['Mars', 'Sun', 'Jupiter'],        // 0-10°, 10-20°, 20-30°
  Taurus: ['Venus', 'Mercury', 'Saturn'],
  Gemini: ['Mercury', 'Venus', 'Saturn'],
  Cancer: ['Moon', 'Pluto', 'Neptune'],
  Leo: ['Sun', 'Jupiter', 'Mars'],
  Virgo: ['Mercury', 'Saturn', 'Venus'],
  Libra: ['Venus', 'Saturn', 'Mercury'],
  Scorpio: ['Pluto', 'Neptune', 'Moon'],
  Sagittarius: ['Jupiter', 'Mars', 'Sun'],
  Capricorn: ['Saturn', 'Venus', 'Mercury'],
  Aquarius: ['Saturn', 'Mercury', 'Venus'],
  Pisces: ['Neptune', 'Moon', 'Pluto']
};

// Decan personality modifiers (applied to base sign traits)
export const DECAN_MODIFIERS = {
  // First decan (0-10°): Pure sign energy
  1: {
    intensity: 1.15,      // Amplified pure sign traits
    N_mod: 0.0,
    E_mod: 0.0,
    O_mod: 0.0,
    A_mod: 0.0,
    C_mod: 0.0,
    description: 'Pure expression of sign energy'
  },

  // Second decan (10-20°): Blended with next fire/earth/air/water sign
  2: {
    intensity: 1.0,       // Balanced
    N_mod: 0.0,
    E_mod: 0.05,          // Slightly more expressive
    O_mod: 0.05,          // Slightly more open
    A_mod: 0.0,
    C_mod: 0.0,
    description: 'Balanced expression with secondary influence'
  },

  // Third decan (20-30°): Most complex, transitional energy
  3: {
    intensity: 0.85,      // Diluted main sign
    N_mod: 0.05,          // More complex emotions
    E_mod: 0.0,
    O_mod: 0.10,          // More adaptable
    A_mod: 0.05,
    C_mod: -0.05,         // Less rigid
    description: 'Transitional energy, preparing for next sign'
  }
};

// ============================================
// CRITICAL DEGREES
// ============================================
// Certain degrees carry special significance
// Enhanced with Aries Points (0°, 13°, 26°) per Brother Sonnet's review

export const CRITICAL_DEGREES = {
  // Anaretic degree (29°) - Crisis point, karmic completion
  29: {
    name: 'Anaretic',
    N_mod: 0.15,          // Heightened anxiety, urgency
    E_mod: 0.05,          // Urgency drives expression
    intensity: 1.25,
    urgency: true,
    karmic: true,
    description: 'Completion energy, karmic urgency, mastery or crisis'
  },

  // 0° - World Axis / Aries Point - Public visibility, world impact
  0: {
    name: 'Aries Point (World Axis)',
    E_mod: 0.15,          // Strong public expression
    C_mod: 0.10,          // Driven to achieve
    O_mod: 0.05,          // Open to new paths
    intensity: 1.20,
    pioneering: true,
    worldAxis: true,
    description: 'World Axis degree - public visibility, new beginnings, pioneering energy'
  },

  // 13° - Aries Point (Mid-Cardinal) - Crisis of action
  13: {
    name: 'Aries Point (Mid-Cardinal)',
    N_mod: 0.10,          // Tension, crisis potential
    E_mod: 0.08,          // Need to act publicly
    C_mod: 0.05,          // Drive for achievement
    intensity: 1.15,
    worldAxis: true,
    crisis: 'action',
    description: 'Mid-cardinal crisis point - urgent need for decisive action, public turning point'
  },

  // 26° - Aries Point (Late Cardinal) - Crisis of completion
  26: {
    name: 'Aries Point (Late Cardinal)',
    N_mod: 0.12,          // Anxiety about completion
    C_mod: 0.08,          // Drive to finish
    O_mod: 0.05,          // Opening to next phase
    intensity: 1.15,
    worldAxis: true,
    crisis: 'completion',
    description: 'Late-cardinal crisis point - push to complete before transition, culmination energy'
  },

  // Fixed critical degrees (8-9°, 21-22°) - Avatar/Power degrees
  8: {
    name: 'Avatar Degree (Fixed)',
    C_mod: 0.12,          // Determination
    E_mod: 0.05,          // Power expression
    intensity: 1.12,
    avatar: true,
    description: 'Fixed power point - heightened determination and willpower'
  },

  9: {
    name: 'Avatar Degree (Fixed)',
    C_mod: 0.12,
    E_mod: 0.05,
    intensity: 1.12,
    avatar: true,
    description: 'Fixed power point - heightened determination and willpower'
  },

  21: {
    name: 'Avatar Degree (Fixed)',
    C_mod: 0.12,
    E_mod: 0.05,
    intensity: 1.12,
    avatar: true,
    description: 'Fixed power point - heightened determination and willpower'
  },

  22: {
    name: 'Avatar Degree (Fixed)',
    C_mod: 0.12,
    E_mod: 0.05,
    intensity: 1.12,
    avatar: true,
    description: 'Fixed power point - heightened determination and willpower'
  },

  // Mutable critical degrees (4°, 17°) - Flux/Change degrees
  4: {
    name: 'Flux Degree (Mutable)',
    O_mod: 0.12,          // Heightened adaptability
    A_mod: 0.05,          // Flexibility with others
    N_mod: 0.05,          // Some instability
    intensity: 1.10,
    flux: true,
    description: 'Mutable flux point - heightened adaptability and changeability'
  },

  17: {
    name: 'Flux Degree (Mutable)',
    O_mod: 0.12,
    A_mod: 0.05,
    N_mod: 0.05,
    intensity: 1.10,
    flux: true,
    description: 'Mutable flux point - heightened adaptability and changeability'
  },

  // 15° - Midpoint of each sign - Strongest pure sign expression
  15: {
    name: 'Sign Midpoint',
    intensity: 1.05,      // Slight amplification of pure sign
    pure: true,
    description: 'Midpoint of sign - purest expression of sign energy'
  }
};

// ============================================
// PLANETARY RULER MODIFIERS
// ============================================
// How each planetary ruler affects personality

export const PLANETARY_MODIFIERS = {
  Sun: {
    E_mod: 0.15,          // Self-expression
    C_mod: 0.10,          // Willpower
    description: 'Vitality, self-expression, ego'
  },
  Moon: {
    N_mod: 0.10,          // Emotional sensitivity
    A_mod: 0.10,          // Nurturing
    description: 'Emotions, intuition, nurturing'
  },
  Mercury: {
    O_mod: 0.15,          // Mental curiosity
    E_mod: 0.05,          // Communication
    description: 'Communication, intellect, analysis'
  },
  Venus: {
    A_mod: 0.15,          // Harmony-seeking
    O_mod: 0.10,          // Aesthetics
    description: 'Love, beauty, harmony'
  },
  Mars: {
    E_mod: 0.15,          // Assertiveness
    N_mod: 0.05,          // Aggression potential
    C_mod: 0.10,          // Drive
    description: 'Action, assertion, energy'
  },
  Jupiter: {
    O_mod: 0.15,          // Expansion, philosophy
    E_mod: 0.10,          // Optimism
    A_mod: 0.05,          // Generosity
    description: 'Expansion, wisdom, optimism'
  },
  Saturn: {
    C_mod: 0.20,          // Discipline
    N_mod: 0.10,          // Anxiety from restriction
    E_mod: -0.10,         // Reserved
    description: 'Structure, discipline, limitation'
  },
  Uranus: {
    O_mod: 0.20,          // Unconventional thinking
    A_mod: -0.10,         // Independent
    description: 'Innovation, rebellion, uniqueness'
  },
  Neptune: {
    O_mod: 0.15,          // Imagination, spirituality
    N_mod: 0.10,          // Confusion potential
    A_mod: 0.10,          // Compassion
    description: 'Dreams, intuition, transcendence'
  },
  Pluto: {
    N_mod: 0.15,          // Intensity
    C_mod: 0.10,          // Transformative will
    description: 'Transformation, power, depth'
  }
};

// ============================================
// VOID OF COURSE MOON
// ============================================
// When the Moon makes no more major aspects before leaving its sign
// Affects emotional processing and decision-making

export const VOID_OF_COURSE_EFFECTS = {
  // Personality modifiers when Moon is Void of Course at birth
  modifiers: {
    N_mod: 0.08,          // Slightly more emotionally detached/uncertain
    E_mod: -0.05,         // Less immediate emotional expression
    O_mod: 0.10,          // More internally focused, imaginative
    A_mod: -0.05,         // Less conventional social expectations
    C_mod: -0.08          // Actions may not follow expected patterns
  },
  intensity: 0.95,        // Slightly muted overall expression
  description: 'Void of Course Moon - emotional processing operates outside normal patterns, intuitive but less predictable'
};

/**
 * Check if Moon is Void of Course
 * VOC Moon is when Moon makes no major aspects before leaving current sign
 *
 * @param {number} moonDegree - Current Moon degree (0-30)
 * @param {string} moonSign - Current Moon sign
 * @param {Array} aspects - Array of remaining aspects before sign change
 * @returns {boolean} True if Moon is void of course
 */
export function isMoonVoidOfCourse(moonDegree, moonSign, aspects = []) {
  // Simplified check: if no aspects provided and Moon is in late degrees
  // In production, this would check actual aspect table
  if (aspects.length === 0 && moonDegree > 25) {
    return true;
  }
  return aspects.length === 0;
}

/**
 * Apply Void of Course Moon modifiers to natal chart facets
 */
export function applyVOCMoonModifiers(vector, isVOC = false) {
  if (!isVOC) return vector;

  const mods = VOID_OF_COURSE_EFFECTS.modifiers;
  const result = [...vector];

  // Apply domain modifiers
  for (let i = 0; i < 6; i++) {
    result[i] += mods.N_mod || 0;           // Neuroticism
    result[i + 6] += mods.E_mod || 0;       // Extraversion
    result[i + 12] += mods.O_mod || 0;      // Openness
    result[i + 18] += mods.A_mod || 0;      // Agreeableness
    result[i + 24] += mods.C_mod || 0;      // Conscientiousness
  }

  // Apply intensity scaling
  const intensity = VOID_OF_COURSE_EFFECTS.intensity;
  return result.map(v => {
    const centered = v - 0.5;
    return Math.max(0, Math.min(1, 0.5 + (centered * intensity)));
  });
}

// ============================================
// DEGREE ENCODING FUNCTIONS
// ============================================

/**
 * Get decan number from degree (1, 2, or 3)
 */
export function getDecan(degree) {
  const normalizedDegree = degree % 30;  // Normalize to 0-30
  if (normalizedDegree < 10) return 1;
  if (normalizedDegree < 20) return 2;
  return 3;
}

/**
 * Get decan ruler for a sign and degree
 */
export function getDecanRuler(sign, degree) {
  const decan = getDecan(degree);
  const rulers = DECAN_RULERS[sign];
  if (!rulers) return null;
  return rulers[decan - 1];
}

/**
 * Check if degree is critical and return modifiers
 */
export function getCriticalDegreeModifiers(degree) {
  const normalizedDegree = Math.floor(degree % 30);
  return CRITICAL_DEGREES[normalizedDegree] || null;
}

/**
 * Calculate cusp blending factor for degrees near sign boundaries
 * Returns { currentSignWeight, nextSignWeight, nextSign }
 */
export function getCuspBlending(sign, degree) {
  const normalizedDegree = degree % 30;
  const signIndex = ZODIAC_SIGNS.indexOf(sign);

  // No blending needed for most degrees
  if (normalizedDegree < 27 && normalizedDegree > 3) {
    return {
      currentSignWeight: 1.0,
      nextSignWeight: 0.0,
      nextSign: null,
      prevSign: null
    };
  }

  // Late degrees (27-30°) - blending into next sign
  if (normalizedDegree >= 27) {
    const nextSign = ZODIAC_SIGNS[(signIndex + 1) % 12];
    const blendFactor = (normalizedDegree - 27) / 3;  // 0 to 1 over last 3 degrees
    return {
      currentSignWeight: 1 - (blendFactor * 0.3),  // Max 30% next sign influence
      nextSignWeight: blendFactor * 0.3,
      nextSign: nextSign,
      prevSign: null
    };
  }

  // Early degrees (0-3°) - residual energy from previous sign
  if (normalizedDegree <= 3) {
    const prevSign = ZODIAC_SIGNS[(signIndex + 11) % 12];
    const blendFactor = (3 - normalizedDegree) / 3;  // 1 to 0 over first 3 degrees
    return {
      currentSignWeight: 1 - (blendFactor * 0.2),  // Max 20% previous sign residue
      nextSignWeight: 0,
      nextSign: null,
      prevSign: prevSign,
      prevSignWeight: blendFactor * 0.2
    };
  }

  return {
    currentSignWeight: 1.0,
    nextSignWeight: 0.0,
    nextSign: null,
    prevSign: null
  };
}

/**
 * Get complete degree analysis for a planetary position
 */
export function analyzeDegree(sign, degree) {
  const decan = getDecan(degree);
  const decanRuler = getDecanRuler(sign, degree);
  const criticalMods = getCriticalDegreeModifiers(degree);
  const cuspBlending = getCuspBlending(sign, degree);

  return {
    sign,
    degree,
    decan,
    decanRuler,
    decanModifiers: DECAN_MODIFIERS[decan],
    planetaryModifiers: PLANETARY_MODIFIERS[decanRuler],
    criticalDegree: criticalMods,
    cuspBlending,
    element: SIGN_ELEMENTS[sign],
    modality: SIGN_MODALITIES[sign]
  };
}

// ============================================
// DEGREE-ENHANCED ZODIAC TO 30 FACETS
// ============================================

// Base sign vectors (same as existing ZODIAC_30_BASES but with cleaner structure)
const SIGN_30_BASES = {
  Aries: [
    0.55, 0.65, 0.40, 0.35, 0.60, 0.35,  // N: impulsive anger, low vulnerability
    0.85, 0.65, 0.90, 0.90, 0.80, 0.75,  // E: very assertive, active
    0.60, 0.45, 0.55, 0.80, 0.55, 0.55,  // O: action-oriented
    0.45, 0.55, 0.50, 0.35, 0.30, 0.50,  // A: direct, competitive
    0.70, 0.50, 0.55, 0.80, 0.65, 0.45   // C: achievement-driven but impulsive
  ],
  Taurus: [
    0.35, 0.50, 0.40, 0.45, 0.40, 0.40,  // N: stable emotions
    0.50, 0.55, 0.50, 0.45, 0.40, 0.60,  // E: moderate, sensual
    0.45, 0.75, 0.60, 0.35, 0.45, 0.50,  // O: aesthetic, practical
    0.65, 0.60, 0.65, 0.70, 0.55, 0.70,  // A: loyal, patient
    0.75, 0.80, 0.75, 0.70, 0.80, 0.75   // C: very reliable, methodical
  ],
  Gemini: [
    0.55, 0.50, 0.45, 0.50, 0.60, 0.50,  // N: restless anxiety
    0.80, 0.75, 0.65, 0.85, 0.70, 0.75,  // E: very social, communicative
    0.85, 0.55, 0.60, 0.80, 0.90, 0.65,  // O: very curious, idea-oriented
    0.60, 0.55, 0.55, 0.50, 0.50, 0.55,  // A: adaptable
    0.55, 0.45, 0.50, 0.60, 0.45, 0.40   // C: flexible but scattered
  ],
  Cancer: [
    0.70, 0.55, 0.65, 0.70, 0.50, 0.75,  // N: emotionally sensitive
    0.55, 0.50, 0.40, 0.45, 0.40, 0.55,  // E: reserved but warm
    0.65, 0.65, 0.85, 0.45, 0.55, 0.60,  // O: imaginative, feeling-oriented
    0.80, 0.70, 0.90, 0.75, 0.65, 0.90,  // A: nurturing, protective
    0.65, 0.70, 0.80, 0.60, 0.65, 0.70   // C: tenacious
  ],
  Leo: [
    0.45, 0.55, 0.35, 0.45, 0.55, 0.30,  // N: proud but confident
    0.90, 0.80, 0.85, 0.85, 0.75, 0.90,  // E: very expressive, dramatic
    0.70, 0.70, 0.65, 0.70, 0.60, 0.55,  // O: creative expression
    0.60, 0.55, 0.70, 0.45, 0.40, 0.65,  // A: generous but can be demanding
    0.70, 0.55, 0.60, 0.85, 0.70, 0.60   // C: proud achievement
  ],
  Virgo: [
    0.65, 0.50, 0.55, 0.70, 0.35, 0.60,  // N: anxious perfectionism
    0.45, 0.40, 0.50, 0.55, 0.35, 0.45,  // E: reserved, modest
    0.55, 0.55, 0.50, 0.50, 0.80, 0.50,  // O: analytical, practical
    0.70, 0.85, 0.75, 0.75, 0.80, 0.75,  // A: helpful, modest
    0.95, 0.95, 0.90, 0.80, 0.90, 0.95   // C: extremely conscientious
  ],
  Libra: [
    0.50, 0.40, 0.45, 0.60, 0.50, 0.55,  // N: conflict avoidance anxiety
    0.75, 0.80, 0.55, 0.60, 0.55, 0.70,  // E: social, charming
    0.70, 0.85, 0.65, 0.55, 0.70, 0.75,  // O: aesthetic, values-oriented
    0.85, 0.75, 0.70, 0.90, 0.70, 0.80,  // A: harmonizing, diplomatic
    0.60, 0.65, 0.70, 0.55, 0.55, 0.75   // C: deliberate but indecisive
  ],
  Scorpio: [
    0.70, 0.75, 0.60, 0.65, 0.55, 0.50,  // N: intense emotions
    0.50, 0.40, 0.70, 0.55, 0.60, 0.45,  // E: private but intense
    0.65, 0.60, 0.80, 0.55, 0.75, 0.55,  // O: depth-seeking
    0.45, 0.60, 0.55, 0.40, 0.55, 0.55,  // A: loyal but suspicious
    0.80, 0.70, 0.75, 0.85, 0.85, 0.80   // C: determined, focused
  ],
  Sagittarius: [
    0.40, 0.50, 0.30, 0.35, 0.65, 0.35,  // N: optimistic, restless
    0.85, 0.70, 0.70, 0.80, 0.85, 0.90,  // E: adventurous, enthusiastic
    0.90, 0.55, 0.60, 0.90, 0.85, 0.80,  // O: philosophical, freedom-loving
    0.60, 0.70, 0.65, 0.45, 0.50, 0.60,  // A: honest but blunt
    0.55, 0.40, 0.50, 0.65, 0.50, 0.40   // C: visionary but inconsistent
  ],
  Capricorn: [
    0.55, 0.50, 0.60, 0.65, 0.30, 0.55,  // N: controlled anxiety, pessimism
    0.45, 0.45, 0.65, 0.60, 0.35, 0.40,  // E: reserved, ambitious
    0.50, 0.55, 0.45, 0.45, 0.60, 0.45,  // O: practical, traditional
    0.55, 0.70, 0.55, 0.65, 0.60, 0.55,  // A: loyal but reserved
    0.95, 0.90, 0.90, 0.95, 0.95, 0.95   // C: extremely disciplined
  ],
  Aquarius: [
    0.50, 0.45, 0.45, 0.55, 0.55, 0.50,  // N: emotionally detached
    0.65, 0.55, 0.60, 0.60, 0.65, 0.55,  // E: friendly but aloof
    0.90, 0.60, 0.55, 0.75, 0.95, 0.85,  // O: highly innovative, unconventional
    0.60, 0.65, 0.70, 0.55, 0.55, 0.65,  // A: humanitarian but detached
    0.65, 0.60, 0.60, 0.70, 0.65, 0.70   // C: principled
  ],
  Pisces: [
    0.70, 0.45, 0.70, 0.65, 0.55, 0.80,  // N: emotionally porous
    0.50, 0.45, 0.35, 0.40, 0.45, 0.55,  // E: introverted, dreamy
    0.95, 0.90, 0.95, 0.60, 0.70, 0.80,  // O: highly imaginative, spiritual
    0.80, 0.70, 0.85, 0.80, 0.75, 0.90,  // A: compassionate, empathetic
    0.45, 0.40, 0.55, 0.45, 0.40, 0.50   // C: fluid, adaptable
  ]
};

/**
 * Apply degree-based modifiers to base sign vector
 */
function applyDegreeModifiers(baseVector, degreeAnalysis) {
  let vector = [...baseVector];

  // 1. Apply decan modifiers
  const decanMods = degreeAnalysis.decanModifiers;
  if (decanMods) {
    // Apply intensity scaling
    vector = vector.map(v => {
      const centered = v - 0.5;
      return 0.5 + (centered * decanMods.intensity);
    });

    // Apply domain modifiers
    for (let i = 0; i < 6; i++) {
      vector[i] += decanMods.N_mod || 0;           // Neuroticism
      vector[i + 6] += decanMods.E_mod || 0;       // Extraversion
      vector[i + 12] += decanMods.O_mod || 0;      // Openness
      vector[i + 18] += decanMods.A_mod || 0;      // Agreeableness
      vector[i + 24] += decanMods.C_mod || 0;      // Conscientiousness
    }
  }

  // 2. Apply planetary ruler modifiers (from decan ruler)
  const planetMods = degreeAnalysis.planetaryModifiers;
  if (planetMods) {
    for (let i = 0; i < 6; i++) {
      vector[i] += (planetMods.N_mod || 0) * 0.5;        // Scale down planetary influence
      vector[i + 6] += (planetMods.E_mod || 0) * 0.5;
      vector[i + 12] += (planetMods.O_mod || 0) * 0.5;
      vector[i + 18] += (planetMods.A_mod || 0) * 0.5;
      vector[i + 24] += (planetMods.C_mod || 0) * 0.5;
    }
  }

  // 3. Apply critical degree modifiers
  const criticalMods = degreeAnalysis.criticalDegree;
  if (criticalMods) {
    // Apply intensity
    if (criticalMods.intensity) {
      vector = vector.map(v => {
        const centered = v - 0.5;
        return 0.5 + (centered * criticalMods.intensity);
      });
    }

    // Apply specific modifiers
    for (let i = 0; i < 6; i++) {
      vector[i] += (criticalMods.N_mod || 0);
      vector[i + 6] += (criticalMods.E_mod || 0);
      vector[i + 12] += (criticalMods.O_mod || 0);
      vector[i + 18] += (criticalMods.A_mod || 0);
      vector[i + 24] += (criticalMods.C_mod || 0);
    }
  }

  // 4. Apply cusp blending
  const cusp = degreeAnalysis.cuspBlending;
  if (cusp.nextSign && cusp.nextSignWeight > 0) {
    const nextSignVector = SIGN_30_BASES[cusp.nextSign];
    if (nextSignVector) {
      vector = vector.map((v, i) =>
        v * cusp.currentSignWeight + nextSignVector[i] * cusp.nextSignWeight
      );
    }
  }
  if (cusp.prevSign && cusp.prevSignWeight > 0) {
    const prevSignVector = SIGN_30_BASES[cusp.prevSign];
    if (prevSignVector) {
      vector = vector.map((v, i) =>
        v * cusp.currentSignWeight + prevSignVector[i] * cusp.prevSignWeight
      );
    }
  }

  // Clamp to [0, 1]
  return vector.map(v => Math.max(0, Math.min(1, v)));
}

/**
 * P1 Enhanced: Convert zodiac position with degree to 30 facets
 *
 * @param {string} sign - Zodiac sign name
 * @param {number} degree - Degree within sign (0-30)
 * @returns {number[]} 30-facet vector
 */
export function zodiacDegreeToFacets(sign, degree = 15) {
  // Validate inputs
  if (!SIGN_30_BASES[sign]) {
    console.warn(`Unknown sign: ${sign}, using neutral vector`);
    return new Array(NUM_FACETS).fill(0.5);
  }

  // Get degree analysis
  const degreeAnalysis = analyzeDegree(sign, degree);

  // Get base sign vector
  const baseVector = SIGN_30_BASES[sign];

  // Apply all degree-based modifiers
  return applyDegreeModifiers(baseVector, degreeAnalysis);
}

/**
 * P1 Enhanced: Convert full natal chart to 30 facets
 * Uses degree information for Sun, Moon, and Rising
 *
 * @param {Object} natal - Natal chart data with degrees
 * @param {Object} natal.sun - { sign: string, degree: number }
 * @param {Object} natal.moon - { sign: string, degree: number }
 * @param {Object} natal.rising - { sign: string, degree: number }
 * @returns {number[]} 30-facet vector
 */
export function natalChartToFacets(natal) {
  const vectors = [];
  const weights = [];

  // Sun (40% - core identity)
  if (natal.sun?.sign) {
    const sunDegree = natal.sun.degree ?? 15;
    vectors.push(zodiacDegreeToFacets(natal.sun.sign, sunDegree));
    weights.push(0.40);
  }

  // Moon (35% - emotional nature)
  if (natal.moon?.sign) {
    const moonDegree = natal.moon.degree ?? 15;
    vectors.push(zodiacDegreeToFacets(natal.moon.sign, moonDegree));
    weights.push(0.35);
  }

  // Rising (25% - outer presentation)
  if (natal.rising?.sign) {
    const risingDegree = natal.rising.degree ?? 15;
    vectors.push(zodiacDegreeToFacets(natal.rising.sign, risingDegree));
    weights.push(0.25);
  }

  // Weighted average
  if (vectors.length === 0) {
    return new Array(NUM_FACETS).fill(0.5);
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const result = new Array(NUM_FACETS).fill(0);

  for (let i = 0; i < NUM_FACETS; i++) {
    for (let j = 0; j < vectors.length; j++) {
      result[i] += vectors[j][i] * weights[j];
    }
    result[i] /= totalWeight;
  }

  return result;
}

/**
 * Get human-readable degree description
 */
export function describeDegree(sign, degree) {
  const analysis = analyzeDegree(sign, degree);
  const parts = [];

  parts.push(`${Math.floor(degree)}° ${sign}`);
  parts.push(`(${analysis.decan}${getOrdinalSuffix(analysis.decan)} Decan, ruled by ${analysis.decanRuler})`);

  if (analysis.criticalDegree) {
    parts.push(`- ${analysis.criticalDegree.name} degree`);
  }

  if (analysis.cuspBlending.nextSign) {
    parts.push(`- Transitioning toward ${analysis.cuspBlending.nextSign}`);
  }

  return parts.join(' ');
}

function getOrdinalSuffix(n) {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

// ============================================
// EXPORTS
// ============================================

export default {
  ZODIAC_SIGNS,
  SIGN_ELEMENTS,
  SIGN_MODALITIES,
  DECAN_RULERS,
  DECAN_MODIFIERS,
  CRITICAL_DEGREES,
  PLANETARY_MODIFIERS,
  VOID_OF_COURSE_EFFECTS,
  getDecan,
  getDecanRuler,
  getCriticalDegreeModifiers,
  getCuspBlending,
  analyzeDegree,
  zodiacDegreeToFacets,
  natalChartToFacets,
  describeDegree,
  isMoonVoidOfCourse,
  applyVOCMoonModifiers
};
