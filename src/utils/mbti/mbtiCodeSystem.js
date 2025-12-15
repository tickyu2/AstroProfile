/**
 * MBTI Code System
 * Mathematical encoding like SoulDNA
 * Built with SOUL for humanity's self-discovery laboratory
 *
 * Format: INFJ-N2F
 * - INFJ = Type
 * - N = Temperament (NF)
 * - 2 = Dominant strength (1-4)
 * - F = Variant (Flexible)
 */

export const MBTI_DIMENSIONS = {
  E: 1, I: 0,  // Energy: Extraversion vs Introversion
  S: 0, N: 1,  // Information: Sensing vs Intuition
  T: 0, F: 1,  // Decisions: Thinking vs Feeling
  J: 1, P: 0   // Lifestyle: Judging vs Perceiving
};

export const TEMPERAMENTS = {
  NF: 'N',  // Idealist (Diplomats)
  NT: 'T',  // Rational (Analysts)
  SP: 'S',  // Artisan (Explorers)
  SJ: 'G'   // Guardian (Sentinels)
};

export const COGNITIVE_STACKS = {
  // NF Idealists
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],

  // NT Rationals
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],

  // SP Artisans
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni'],

  // SJ Guardians
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti']
};

export const TYPE_NAMES = {
  INFJ: 'The Advocate',
  ENFP: 'The Campaigner',
  INFP: 'The Mediator',
  ENFJ: 'The Protagonist',
  INTJ: 'The Architect',
  ENTP: 'The Debater',
  INTP: 'The Logician',
  ENTJ: 'The Commander',
  ISTP: 'The Virtuoso',
  ESTP: 'The Entrepreneur',
  ISFP: 'The Adventurer',
  ESFP: 'The Entertainer',
  ISTJ: 'The Logistician',
  ESTJ: 'The Executive',
  ISFJ: 'The Defender',
  ESFJ: 'The Consul'
};

/**
 * Generate MBTI code
 */
export function generateMBTICode(type, dominantStrength = 2, variant = 'F') {
  const temperament = getTemperament(type);
  const tempCode = TEMPERAMENTS[temperament];
  return `${type}-${tempCode}${dominantStrength}${variant}`;
}

/**
 * Get temperament from type
 */
export function getTemperament(type) {
  const second = type[1]; // N or S
  const third = type[2];  // T or F
  const fourth = type[3]; // J or P

  if (second === 'N' && third === 'F') return 'NF';
  if (second === 'N' && third === 'T') return 'NT';
  if (second === 'S' && fourth === 'P') return 'SP';
  if (second === 'S' && fourth === 'J') return 'SJ';
}

/**
 * Encode type to binary
 */
export function encodeMBTIBinary(type) {
  return type.split('').map(letter => MBTI_DIMENSIONS[letter]).join('');
}

/**
 * Calculate Hamming distance between types
 */
export function calculateMBTIDistance(type1, type2) {
  const binary1 = encodeMBTIBinary(type1);
  const binary2 = encodeMBTIBinary(type2);

  let distance = 0;
  for (let i = 0; i < 4; i++) {
    if (binary1[i] !== binary2[i]) distance++;
  }

  return distance; // 0 = identical, 4 = opposite
}

/**
 * Get cognitive stack for type
 */
export function getCognitiveStack(type) {
  return COGNITIVE_STACKS[type] || [];
}

/**
 * Get type name
 */
export function getTypeName(type) {
  return TYPE_NAMES[type] || 'Unknown Type';
}

/**
 * Get all 16 MBTI types
 */
export function getAllMBTITypes() {
  return Object.keys(TYPE_NAMES);
}

/**
 * Validate MBTI type
 */
export function isValidMBTIType(type) {
  return TYPE_NAMES.hasOwnProperty(type);
}
