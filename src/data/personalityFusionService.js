/**
 * ============================================
 * PERSONALITY FUSION SERVICE - Brain 7B Engine
 * ============================================
 *
 * Multi-source personality vector fusion for Luna AI Soul Partner
 * Combines: Enneagram, Zodiac, MBTI, Big Five, Numerology
 *
 * Based on combined research:
 * - Grok's weighted sum fusion (Big5=0.40, MBTI=0.20, Enneagram=0.15, Natal=0.15, Numerology=0.10)
 * - Claude's multimodal attention research
 * - Furnham 1996 MBTI ↔ Big Five correlations
 * - Riso-Hudson Enneagram levels of development
 *
 * Architecture:
 * - Brain 7A: Constitutional Data (chart, MBTI, numerology) → stored
 * - Brain 7B: Personality Profile (this file) → computed vectors
 * - Luna CPU: Emotional Intelligence + 8-Brain Synthesis
 *
 * Created: January 7, 2026
 * For: GENESIS AI Soul Partner System
 */

// ============================================
// PERSONALITY DIMENSIONS (10-dim Luna Vector)
// ============================================

export const DIMENSIONS = [
  "openness",           // Big Five: Open to experience
  "conscientiousness",  // Big Five: Organized, disciplined
  "extraversion",       // Big Five: Social energy
  "agreeableness",      // Big Five: Warmth, cooperation
  "emotional_intensity", // Neuroticism → reframed positively
  "insightful",         // Luna extension: Pattern recognition
  "adventurous",        // Luna extension: Novelty seeking
  "ambitious",          // Luna extension: Drive, goals
  "nurturing",          // Luna extension: Care, support
  "playful"             // Luna extension: Humor, lightness
];

export const NUM_DIMS = DIMENSIONS.length;

// ============================================
// SOURCE WEIGHTS (Empirically calibrated)
// ============================================

export const SOURCE_WEIGHTS = {
  big5: 0.40,        // Highest validity (if available)
  mbti: 0.20,        // Good predictor
  enneagram: 0.15,   // Rich depth
  natal: 0.15,       // Elemental balance
  numerology: 0.10   // Archetypal patterns
};

// ============================================
// ENNEAGRAM BASE VECTORS (Types 1-9)
// ============================================

export const ENNEAGRAM_BASES = {
  1: [0.50, 0.95, 0.50, 0.80, 0.70, 0.70, 0.50, 0.70, 0.85, 0.40], // Reformer: Disciplined, principled
  2: [0.60, 0.75, 0.85, 0.95, 0.75, 0.60, 0.60, 0.50, 0.98, 0.70], // Helper: Empathetic, relational
  3: [0.70, 0.80, 0.90, 0.65, 0.60, 0.60, 0.70, 0.85, 0.80, 0.75], // Achiever: Ambitious, adaptable
  4: [0.95, 0.40, 0.50, 0.60, 0.95, 0.85, 0.70, 0.50, 0.90, 0.60], // Individualist: Creative, emotional
  5: [0.90, 0.70, 0.20, 0.50, 0.80, 0.95, 0.60, 0.60, 0.70, 0.30], // Investigator: Intellectual, detached
  6: [0.55, 0.85, 0.60, 0.75, 0.85, 0.75, 0.55, 0.65, 0.85, 0.50], // Loyalist: Committed, anxious
  7: [0.85, 0.45, 0.95, 0.60, 0.50, 0.70, 0.95, 0.70, 0.75, 0.90], // Enthusiast: Optimistic, adventurous
  8: [0.65, 0.75, 0.90, 0.40, 0.55, 0.65, 0.85, 0.90, 0.80, 0.75], // Challenger: Assertive, protective
  9: [0.60, 0.60, 0.40, 0.90, 0.60, 0.70, 0.50, 0.50, 0.95, 0.55]  // Peacemaker: Harmonious, easygoing
};

// ============================================
// ZODIAC BASE VECTORS (12 Signs)
// ============================================

export const ZODIAC_BASES = {
  Aries:       [0.65, 0.75, 0.95, 0.50, 0.80, 0.55, 0.98, 0.90, 0.75, 0.80], // Bold, energetic
  Taurus:      [0.55, 0.85, 0.50, 0.80, 0.60, 0.60, 0.50, 0.70, 0.90, 0.55], // Stable, sensual
  Gemini:      [0.85, 0.50, 0.90, 0.60, 0.65, 0.75, 0.85, 0.65, 0.70, 0.85], // Curious, communicative
  Cancer:      [0.60, 0.70, 0.40, 0.95, 0.90, 0.70, 0.50, 0.50, 0.98, 0.50], // Nurturing, intuitive
  Leo:         [0.75, 0.70, 0.98, 0.70, 0.85, 0.65, 0.80, 0.85, 0.85, 0.90], // Charismatic, creative
  Virgo:       [0.50, 0.95, 0.45, 0.75, 0.70, 0.80, 0.50, 0.75, 0.90, 0.40], // Analytical, practical
  Libra:       [0.70, 0.60, 0.75, 0.95, 0.65, 0.70, 0.60, 0.60, 0.90, 0.70], // Harmonious, diplomatic
  Scorpio:     [0.80, 0.80, 0.55, 0.60, 0.95, 0.90, 0.70, 0.75, 0.85, 0.60], // Intense, transformative
  Sagittarius: [0.90, 0.55, 0.95, 0.65, 0.70, 0.75, 0.98, 0.80, 0.75, 0.85], // Optimistic, adventurous
  Capricorn:   [0.50, 0.98, 0.40, 0.60, 0.60, 0.75, 0.60, 0.95, 0.80, 0.45], // Ambitious, disciplined
  Aquarius:    [0.95, 0.60, 0.80, 0.55, 0.65, 0.85, 0.85, 0.70, 0.70, 0.75], // Innovative, independent
  Pisces:      [0.85, 0.50, 0.45, 0.98, 0.95, 0.85, 0.65, 0.45, 0.98, 0.60]  // Compassionate, imaginative
};

// ============================================
// MBTI BASE VECTORS (16 Types)
// ============================================

export const MBTI_BASES = {
  INTJ: [0.90, 0.85, 0.25, 0.45, 0.70, 0.95, 0.70, 0.85, 0.60, 0.35],
  INTP: [0.95, 0.55, 0.30, 0.50, 0.75, 0.98, 0.75, 0.55, 0.55, 0.50],
  ENTJ: [0.80, 0.90, 0.85, 0.40, 0.60, 0.85, 0.80, 0.95, 0.65, 0.55],
  ENTP: [0.95, 0.50, 0.90, 0.55, 0.65, 0.90, 0.90, 0.70, 0.55, 0.85],
  INFJ: [0.85, 0.80, 0.35, 0.90, 0.85, 0.90, 0.60, 0.65, 0.95, 0.45],
  INFP: [0.95, 0.45, 0.30, 0.85, 0.90, 0.85, 0.70, 0.50, 0.90, 0.55],
  ENFJ: [0.75, 0.75, 0.90, 0.95, 0.75, 0.80, 0.70, 0.75, 0.98, 0.70],
  ENFP: [0.95, 0.40, 0.95, 0.85, 0.80, 0.80, 0.95, 0.65, 0.85, 0.95],
  ISTJ: [0.40, 0.98, 0.35, 0.70, 0.55, 0.70, 0.40, 0.80, 0.80, 0.30],
  ISFJ: [0.45, 0.90, 0.30, 0.95, 0.70, 0.65, 0.40, 0.60, 0.98, 0.40],
  ESTJ: [0.45, 0.95, 0.80, 0.55, 0.50, 0.65, 0.55, 0.90, 0.70, 0.45],
  ESFJ: [0.50, 0.85, 0.85, 0.98, 0.65, 0.60, 0.50, 0.65, 0.98, 0.65],
  ISTP: [0.70, 0.60, 0.35, 0.45, 0.55, 0.80, 0.80, 0.55, 0.50, 0.50],
  ISFP: [0.80, 0.50, 0.35, 0.80, 0.75, 0.70, 0.70, 0.45, 0.85, 0.55],
  ESTP: [0.65, 0.50, 0.95, 0.50, 0.55, 0.60, 0.95, 0.75, 0.55, 0.85],
  ESFP: [0.70, 0.40, 0.98, 0.75, 0.65, 0.55, 0.90, 0.55, 0.75, 0.98]
};

// ============================================
// NUMEROLOGY BASE VECTORS (Life Path 1-9 + Master Numbers)
// ============================================

export const NUMEROLOGY_BASES = {
  1: [0.60, 0.80, 0.75, 0.45, 0.65, 0.70, 0.80, 0.95, 0.55, 0.60], // Leader
  2: [0.55, 0.70, 0.50, 0.95, 0.70, 0.75, 0.45, 0.50, 0.95, 0.60], // Diplomat
  3: [0.85, 0.50, 0.90, 0.70, 0.75, 0.65, 0.80, 0.65, 0.75, 0.95], // Creative
  4: [0.45, 0.95, 0.45, 0.70, 0.55, 0.70, 0.40, 0.80, 0.85, 0.40], // Builder
  5: [0.85, 0.40, 0.85, 0.55, 0.70, 0.70, 0.98, 0.60, 0.60, 0.85], // Freedom
  6: [0.60, 0.80, 0.60, 0.95, 0.75, 0.70, 0.50, 0.60, 0.98, 0.65], // Nurturer
  7: [0.95, 0.70, 0.30, 0.55, 0.80, 0.98, 0.65, 0.55, 0.65, 0.45], // Seeker
  8: [0.55, 0.90, 0.75, 0.50, 0.60, 0.75, 0.70, 0.98, 0.65, 0.55], // Powerhouse
  9: [0.80, 0.65, 0.70, 0.90, 0.80, 0.85, 0.75, 0.60, 0.90, 0.70], // Humanitarian
  11: [0.90, 0.70, 0.55, 0.85, 0.90, 0.95, 0.70, 0.70, 0.90, 0.60], // Master Intuitive
  22: [0.75, 0.95, 0.65, 0.75, 0.70, 0.90, 0.80, 0.95, 0.85, 0.55], // Master Builder
  33: [0.80, 0.75, 0.75, 0.98, 0.85, 0.85, 0.65, 0.60, 0.98, 0.70]  // Master Teacher
};

// ============================================
// INSTINCTUAL STACKING DELTAS (sp/so/sx)
// ============================================

const STACKING_DELTAS = {
  sp: [0.10, 0.20, -0.10, 0.10, 0.05, 0.05, -0.05, 0.10, 0.15, -0.05], // Self-preservation
  so: [-0.05, 0.05, 0.20, 0.15, 0.10, 0.00, 0.10, 0.10, 0.10, 0.15],   // Social
  sx: [0.05, -0.05, 0.10, -0.05, 0.20, 0.15, 0.15, 0.05, 0.05, 0.10]   // Sexual/One-to-one
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function minMaxNormalize(vec) {
  const min = Math.min(...vec);
  const max = Math.max(...vec);
  const range = max - min || 1;
  return vec.map(v => (v - min) / range);
}

function clip(vec, min = 0, max = 1) {
  return vec.map(v => Math.min(max, Math.max(min, v)));
}

function vectorAdd(a, b) {
  return a.map((v, i) => v + (b[i] || 0));
}

function vectorScale(vec, scalar) {
  return vec.map(v => v * scalar);
}

// ============================================
// ENNEAGRAM TO VECTOR (Full Support)
// ============================================

/**
 * Convert Enneagram profile to personality vector
 * Supports: core type, wing, tritype, instinctual stacking, levels of development
 *
 * @param {number} core - Core type 1-9
 * @param {number|null} wing - Wing (adjacent type)
 * @param {number[]|null} tritype - Three types [head, heart, gut]
 * @param {string|null} stacking - e.g., "sp/so/sx" or "sx/sp/so"
 * @param {number|null} level - Riso-Hudson level 1-9 (1=healthiest)
 */
export function enneagramToVector(core, wing = null, tritype = null, stacking = null, level = null) {
  if (!ENNEAGRAM_BASES[core]) {
    return new Array(NUM_DIMS).fill(0.5);
  }

  let vec = [...ENNEAGRAM_BASES[core]];

  // Wing blend (70% core, 30% wing)
  if (wing && ENNEAGRAM_BASES[wing]) {
    const wingVec = ENNEAGRAM_BASES[wing];
    vec = vec.map((v, i) => 0.7 * v + 0.3 * wingVec[i]);
  }

  // Tritype blend (overrides wing if present)
  if (tritype && tritype.length === 3 && tritype.every(t => ENNEAGRAM_BASES[t])) {
    const [t1, t2, t3] = tritype;
    vec = ENNEAGRAM_BASES[t1].map((v, i) =>
      0.6 * v + 0.2 * ENNEAGRAM_BASES[t2][i] + 0.2 * ENNEAGRAM_BASES[t3][i]
    );
  }

  // Instinctual stacking
  if (stacking) {
    const norm = stacking.toLowerCase().replace(/[\/\-]/g, '');
    const primary = norm.slice(0, 2);
    const secondary = norm.slice(2, 4);

    if (STACKING_DELTAS[primary]) {
      vec = vectorAdd(vec, vectorScale(STACKING_DELTAS[primary], 0.15));
    }
    if (STACKING_DELTAS[secondary]) {
      vec = vectorAdd(vec, vectorScale(STACKING_DELTAS[secondary], 0.08));
    }
  }

  // Levels of Development (1-9, 1=healthiest)
  if (level !== null && level >= 1 && level <= 9) {
    const healthFactor = 0.6 + (level - 1) * 0.1; // 0.6 → 1.4
    const unhealthyFactor = Math.max(0, (5 - level) / 4);
    const healthyFactor = Math.max(0, (level - 5) / 4);

    // Unhealthy patterns: less conscientious, more emotional intensity
    const unhealthyDelta = [
      0, -0.3 * unhealthyFactor, 0, -0.2 * unhealthyFactor,
      0.4 * unhealthyFactor, 0.1 * unhealthyFactor, 0,
      -0.2 * unhealthyFactor, 0.1 * unhealthyFactor, -0.1 * unhealthyFactor
    ];

    // Healthy patterns: more balanced, less reactive
    const healthyDelta = [
      0.2 * healthyFactor, 0.3 * healthyFactor, 0.1 * healthyFactor,
      0.3 * healthyFactor, -0.2 * healthyFactor, 0.2 * healthyFactor,
      0.2 * healthyFactor, 0.2 * healthyFactor, 0.2 * healthyFactor,
      0.2 * healthyFactor
    ];

    vec = vectorScale(vec, healthFactor);
    vec = vectorAdd(vec, unhealthyDelta);
    vec = vectorAdd(vec, healthyDelta);
  }

  return clip(vec);
}

// ============================================
// ZODIAC TO VECTOR
// ============================================

export function zodiacToVector(sign) {
  return ZODIAC_BASES[sign] || new Array(NUM_DIMS).fill(0.5);
}

// ============================================
// ENNEAGRAM + ZODIAC FUSION (108 combinations)
// ============================================

/**
 * Fuse Enneagram and Zodiac into a single personality vector
 * Default: 50/50 blend, adjustable with weights
 */
export function fuseEnneagramZodiac(enneagramType, zodiacSign, enneagramWeight = 0.5) {
  const enneVec = enneagramToVector(enneagramType);
  const zodiacVec = zodiacToVector(zodiacSign);
  const zodiacWeight = 1 - enneagramWeight;

  const fused = enneVec.map((v, i) =>
    enneagramWeight * v + zodiacWeight * zodiacVec[i]
  );

  return clip(fused);
}

// ============================================
// FULL MULTI-SOURCE FUSION
// ============================================

/**
 * Full personality fusion from all available sources
 *
 * @param {Object} sources - Available personality data
 * @param {Object} sources.big5 - { openness, conscientiousness, extraversion, agreeableness, neuroticism }
 * @param {string} sources.mbti - e.g., "INFJ"
 * @param {Object} sources.enneagram - { core, wing?, tritype?, stacking?, level? }
 * @param {Object} sources.natal - { sunSign, moonSign?, risingSign?, elementBalance? }
 * @param {number} sources.numerology - Life path number
 */
export function fusePersonality(sources = {}) {
  const vectors = [];
  const weights = [];

  // Big Five (if available)
  if (sources.big5) {
    const b5 = sources.big5;
    const vec = [
      b5.openness || 0.5,
      b5.conscientiousness || 0.5,
      b5.extraversion || 0.5,
      b5.agreeableness || 0.5,
      b5.neuroticism || 0.5,
      0.4 + 0.6 * (b5.openness || 0.5),                    // insightful
      0.3 + 0.7 * (b5.openness || 0.5) + 0.2 * (b5.extraversion || 0.5), // adventurous
      0.2 + 0.8 * (b5.conscientiousness || 0.5) + 0.3 * (b5.extraversion || 0.5), // ambitious
      0.6 + 0.4 * (b5.agreeableness || 0.5) + 0.2 * (1 - (b5.neuroticism || 0.5)), // nurturing
      0.3 + 0.7 * (b5.extraversion || 0.5) + 0.2 * (b5.openness || 0.5) // playful
    ];
    vectors.push(minMaxNormalize(vec));
    weights.push(SOURCE_WEIGHTS.big5);
  }

  // MBTI (if available)
  if (sources.mbti && MBTI_BASES[sources.mbti.toUpperCase()]) {
    vectors.push(MBTI_BASES[sources.mbti.toUpperCase()]);
    weights.push(SOURCE_WEIGHTS.mbti);
  }

  // Enneagram (if available)
  if (sources.enneagram?.core) {
    const e = sources.enneagram;
    vectors.push(enneagramToVector(e.core, e.wing, e.tritype, e.stacking, e.level));
    weights.push(SOURCE_WEIGHTS.enneagram);
  }

  // Natal Chart / Zodiac (if available)
  if (sources.natal?.sunSign) {
    const sunVec = zodiacToVector(sources.natal.sunSign);
    let natalVec = sunVec;

    // Blend with moon and rising if available
    if (sources.natal.moonSign) {
      const moonVec = zodiacToVector(sources.natal.moonSign);
      natalVec = natalVec.map((v, i) => 0.6 * v + 0.4 * moonVec[i]);
    }
    if (sources.natal.risingSign) {
      const risingVec = zodiacToVector(sources.natal.risingSign);
      natalVec = natalVec.map((v, i) => 0.7 * v + 0.3 * risingVec[i]);
    }

    vectors.push(clip(natalVec));
    weights.push(SOURCE_WEIGHTS.natal);
  }

  // Numerology (if available)
  if (sources.numerology && NUMEROLOGY_BASES[sources.numerology]) {
    vectors.push(NUMEROLOGY_BASES[sources.numerology]);
    weights.push(SOURCE_WEIGHTS.numerology);
  }

  // If no sources, return balanced default
  if (vectors.length === 0) {
    return new Array(NUM_DIMS).fill(0.5);
  }

  // Weighted sum fusion
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const normalized = weights.map(w => w / totalWeight);

  const fused = new Array(NUM_DIMS).fill(0);
  vectors.forEach((vec, idx) => {
    vec.forEach((v, i) => {
      fused[i] += normalized[idx] * v;
    });
  });

  return clip(fused);
}

// ============================================
// GENERATE ALL 108 ENNEAGRAM × ZODIAC COMBOS
// ============================================

export function generateAllCombinations() {
  const combos = {};
  const enneTypes = Object.keys(ENNEAGRAM_BASES).map(Number);
  const signs = Object.keys(ZODIAC_BASES);

  enneTypes.forEach(enne => {
    signs.forEach(sign => {
      const key = `Type ${enne} - ${sign}`;
      combos[key] = fuseEnneagramZodiac(enne, sign);
    });
  });

  return combos;
}

// ============================================
// PERSONALITY VECTOR TO LUNA TRAITS
// ============================================

/**
 * Convert personality vector to Luna trait descriptors
 * Returns human-readable trait levels
 */
export function vectorToTraits(vector) {
  const levels = ['Low', 'Below Average', 'Average', 'Above Average', 'High'];

  return DIMENSIONS.map((dim, i) => {
    const value = vector[i];
    const levelIndex = Math.min(4, Math.floor(value * 5));
    return {
      dimension: dim,
      value: Math.round(value * 100),
      level: levels[levelIndex],
      description: getTraitDescription(dim, value)
    };
  });
}

function getTraitDescription(dimension, value) {
  const descriptions = {
    openness: value > 0.7 ? 'Highly creative and imaginative' : value > 0.4 ? 'Balanced between tradition and innovation' : 'Practical and grounded',
    conscientiousness: value > 0.7 ? 'Disciplined and organized' : value > 0.4 ? 'Flexible with structure' : 'Spontaneous and adaptable',
    extraversion: value > 0.7 ? 'Energized by social connection' : value > 0.4 ? 'Balanced social energy' : 'Deeply introspective',
    agreeableness: value > 0.7 ? 'Warm and harmonious' : value > 0.4 ? 'Balanced between self and others' : 'Direct and independent',
    emotional_intensity: value > 0.7 ? 'Deeply feeling and sensitive' : value > 0.4 ? 'Emotionally balanced' : 'Calm and steady',
    insightful: value > 0.7 ? 'Pattern-seeing wisdom' : value > 0.4 ? 'Practical insight' : 'Concrete thinker',
    adventurous: value > 0.7 ? 'Loves exploration and novelty' : value > 0.4 ? 'Selective adventures' : 'Values stability',
    ambitious: value > 0.7 ? 'Goal-driven achiever' : value > 0.4 ? 'Steady progress' : 'Content with present',
    nurturing: value > 0.7 ? 'Natural caregiver' : value > 0.4 ? 'Caring when needed' : 'Independent supporter',
    playful: value > 0.7 ? 'Joy and humor central' : value > 0.4 ? 'Balanced seriousness' : 'Thoughtful and measured'
  };
  return descriptions[dimension] || '';
}

// ============================================
// EXPORT FOR LUNA INTEGRATION
// ============================================

export default {
  DIMENSIONS,
  NUM_DIMS,
  SOURCE_WEIGHTS,
  ENNEAGRAM_BASES,
  ZODIAC_BASES,
  MBTI_BASES,
  NUMEROLOGY_BASES,
  enneagramToVector,
  zodiacToVector,
  fuseEnneagramZodiac,
  fusePersonality,
  generateAllCombinations,
  vectorToTraits
};
