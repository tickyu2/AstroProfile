/**
 * ============================================
 * BAZI SOURCE MAPPING - Chinese Astrology to NEO Facets
 * ============================================
 *
 * P0 Priority: BaZi is 30% of personality weight
 * Day Pillar = 70% of BaZi influence (most important)
 *
 * Architecture:
 * - 10 Day Masters (Heavenly Stems) → 30 NEO PI-R facets
 * - 12 Earthly Branches (Animals) → Facet modifiers
 * - Element balance → Domain-level adjustments
 * - Yin/Yang balance → Temperament adjustments
 *
 * Pillar Weights (per Sonnet + Grok analysis):
 * - Day Pillar: 70% (Core Self + Spouse)
 * - Hour Pillar: 15% (Private Nature + Children)
 * - Month Pillar: 10% (Career + Parents)
 * - Year Pillar: 5% (Ancestral + Public Image)
 *
 * Created: January 8, 2026
 * For: GENESIS AI Soul Partner System - Cathedral Build
 */

import { NUM_FACETS } from './neoFacetSchema';

// ============================================
// PILLAR WEIGHTS (Research-Based)
// ============================================

export const PILLAR_WEIGHTS = {
  day: 0.70,    // Core essence - Day Master is YOU
  hour: 0.15,   // Inner nature, children, later life
  month: 0.10,  // Career, parents, early adulthood
  year: 0.05    // Ancestral, public image, childhood
};

// ============================================
// DAY MASTER (HEAVENLY STEM) TO 30 NEO FACETS
// ============================================
// The Day Master is the most important factor in BaZi personality
// Each of 10 stems represents a unique elemental personality

export const DAY_MASTER_30_BASES = {
  // ========================================
  // WOOD ELEMENT - Growth, Expansion, Vision
  // ========================================

  '甲': { // Jia - Yang Wood (The Great Tree)
    english: 'Yang Wood',
    nature: 'Upright, principled, idealistic, pioneering, inflexible',
    facets: [
      // N1-N6: Neuroticism - Generally stable, can be rigid under stress
      0.45, 0.55, 0.40, 0.45, 0.45, 0.40,
      // E1-E6: Extraversion - Leadership, assertive but not gregarious
      0.65, 0.55, 0.85, 0.75, 0.55, 0.60,
      // O1-O6: Openness - Visionary but traditional values
      0.70, 0.55, 0.55, 0.70, 0.75, 0.50,
      // A1-A6: Agreeableness - Principled, straightforward
      0.55, 0.80, 0.60, 0.40, 0.45, 0.55,
      // C1-C6: Conscientiousness - High standards, ambitious
      0.85, 0.70, 0.80, 0.85, 0.80, 0.70
    ]
  },

  '乙': { // Yi - Yin Wood (The Vine/Flower)
    english: 'Yin Wood',
    nature: 'Flexible, diplomatic, creative, adaptable, charming',
    facets: [
      // N: More sensitive, can be anxious
      0.60, 0.40, 0.55, 0.60, 0.50, 0.60,
      // E: Warm but not dominant
      0.80, 0.70, 0.45, 0.55, 0.50, 0.75,
      // O: Highly creative, aesthetic
      0.80, 0.90, 0.80, 0.70, 0.65, 0.65,
      // A: Very diplomatic, yielding
      0.75, 0.60, 0.80, 0.80, 0.70, 0.85,
      // C: Less rigid, more flexible
      0.65, 0.55, 0.70, 0.55, 0.55, 0.60
    ]
  },

  // ========================================
  // FIRE ELEMENT - Passion, Expression, Action
  // ========================================

  '丙': { // Bing - Yang Fire (The Sun)
    english: 'Yang Fire',
    nature: 'Radiant, optimistic, generous, dramatic, impulsive',
    facets: [
      // N: Low neuroticism, confident
      0.35, 0.45, 0.30, 0.35, 0.70, 0.30,
      // E: Extremely high - radiates energy
      0.90, 0.90, 0.80, 0.90, 0.85, 0.95,
      // O: Open, expressive, artistic
      0.80, 0.75, 0.85, 0.80, 0.65, 0.70,
      // A: Generous but can be self-centered
      0.70, 0.65, 0.80, 0.45, 0.35, 0.70,
      // C: Enthusiastic but can lack follow-through
      0.75, 0.50, 0.60, 0.85, 0.55, 0.40
    ]
  },

  '丁': { // Ding - Yin Fire (The Candle)
    english: 'Yin Fire',
    nature: 'Intense, intuitive, refined, passionate, private warmth',
    facets: [
      // N: More emotional depth, sensitive
      0.65, 0.55, 0.60, 0.60, 0.55, 0.60,
      // E: Warm but selective, not gregarious
      0.80, 0.50, 0.55, 0.60, 0.60, 0.70,
      // O: Very intuitive, deep feelings
      0.85, 0.85, 0.95, 0.60, 0.80, 0.75,
      // A: Tender, devoted, can be jealous
      0.70, 0.75, 0.85, 0.60, 0.55, 0.90,
      // C: Focused when passionate
      0.75, 0.65, 0.75, 0.70, 0.70, 0.70
    ]
  },

  // ========================================
  // EARTH ELEMENT - Stability, Nurturing, Reliability
  // ========================================

  '戊': { // Wu - Yang Earth (The Mountain)
    english: 'Yang Earth',
    nature: 'Solid, reliable, stubborn, protective, patient',
    facets: [
      // N: Stable, grounded, not easily shaken
      0.40, 0.45, 0.40, 0.45, 0.30, 0.35,
      // E: Steady, not flashy, warm core
      0.65, 0.50, 0.65, 0.50, 0.35, 0.55,
      // O: Traditional, practical, reliable
      0.40, 0.55, 0.55, 0.35, 0.55, 0.40,
      // A: Protective, trustworthy, can be possessive
      0.80, 0.75, 0.75, 0.70, 0.60, 0.70,
      // C: Very high - dependable, orderly
      0.90, 0.90, 0.90, 0.75, 0.90, 0.85
    ]
  },

  '己': { // Ji - Yin Earth (The Garden Soil)
    english: 'Yin Earth',
    nature: 'Nurturing, receptive, supportive, absorbs everything, fertile',
    facets: [
      // N: Absorbs others' emotions, can be anxious
      0.60, 0.40, 0.55, 0.60, 0.45, 0.60,
      // E: Nurturing warmth, not assertive
      0.85, 0.55, 0.40, 0.50, 0.40, 0.70,
      // O: Practical creativity, grows things
      0.55, 0.70, 0.75, 0.45, 0.55, 0.50,
      // A: Extremely agreeable, supportive
      0.85, 0.65, 0.95, 0.85, 0.75, 0.90,
      // C: Dutiful, less ambitious
      0.75, 0.80, 0.90, 0.55, 0.75, 0.75
    ]
  },

  // ========================================
  // METAL ELEMENT - Precision, Justice, Structure
  // ========================================

  '庚': { // Geng - Yang Metal (The Sword/Axe)
    english: 'Yang Metal',
    nature: 'Strong, decisive, righteous, competitive, harsh',
    facets: [
      // N: Can have anger issues, but controlled
      0.45, 0.70, 0.40, 0.35, 0.50, 0.35,
      // E: Assertive, competitive, direct
      0.55, 0.60, 0.95, 0.80, 0.65, 0.55,
      // O: Action over ideas, practical
      0.45, 0.40, 0.45, 0.80, 0.65, 0.55,
      // A: Direct, not diplomatic, justice-focused
      0.50, 0.90, 0.50, 0.25, 0.30, 0.45,
      // C: High standards, disciplined
      0.90, 0.80, 0.85, 0.90, 0.85, 0.75
    ]
  },

  '辛': { // Xin - Yin Metal (The Jewelry/Needle)
    english: 'Yin Metal',
    nature: 'Refined, precise, sensitive, perfectionist, elegant',
    facets: [
      // N: Sensitive to criticism, can be melancholic
      0.70, 0.55, 0.65, 0.70, 0.40, 0.65,
      // E: Reserved elegance, selective social
      0.60, 0.45, 0.50, 0.50, 0.45, 0.50,
      // O: Appreciates beauty, refined taste
      0.65, 0.95, 0.70, 0.50, 0.75, 0.65,
      // A: Charming but discerning
      0.60, 0.80, 0.60, 0.55, 0.55, 0.70,
      // C: Perfectionist, detail-oriented
      0.95, 0.95, 0.80, 0.70, 0.85, 0.90
    ]
  },

  // ========================================
  // WATER ELEMENT - Wisdom, Adaptability, Depth
  // ========================================

  '壬': { // Ren - Yang Water (The Ocean/River)
    english: 'Yang Water',
    nature: 'Expansive, intelligent, resourceful, adventurous, restless',
    facets: [
      // N: Generally calm, can be emotionally overwhelming
      0.50, 0.45, 0.45, 0.50, 0.60, 0.50,
      // E: Social, communicative, networking
      0.70, 0.80, 0.65, 0.85, 0.75, 0.75,
      // O: Very open, loves ideas, philosophical
      0.85, 0.65, 0.70, 0.90, 0.90, 0.85,
      // A: Flexible, can be manipulative
      0.65, 0.55, 0.65, 0.50, 0.55, 0.60,
      // C: Less structured, flows around obstacles
      0.70, 0.45, 0.55, 0.75, 0.50, 0.50
    ]
  },

  '癸': { // Gui - Yin Water (The Rain/Dew)
    english: 'Yin Water',
    nature: 'Intuitive, mysterious, deep, perceptive, dreamy',
    facets: [
      // N: Deep emotional sensitivity
      0.70, 0.45, 0.70, 0.70, 0.55, 0.75,
      // E: Introspective, selective intimacy
      0.70, 0.40, 0.35, 0.45, 0.45, 0.60,
      // O: Extremely intuitive, mystical
      0.95, 0.85, 0.98, 0.55, 0.85, 0.80,
      // A: Empathetic, can be passive-aggressive
      0.80, 0.55, 0.85, 0.75, 0.70, 0.90,
      // C: Follows inner rhythm, less structured
      0.60, 0.50, 0.65, 0.50, 0.55, 0.65
    ]
  }
};

// ============================================
// EARTHLY BRANCH (ANIMAL) DELTAS
// ============================================
// These modify the Day Master base based on the animal's energy
// Day Branch = Inner self, Hour/Month/Year = contextual influence

export const BRANCH_DELTAS = {
  '子': { // Rat - Clever, resourceful, quick-witted
    animal: 'Rat',
    element: 'Water',
    deltas: [
      0.05, 0.00, 0.00, 0.00, 0.10, 0.05,    // N: slightly impulsive
      0.10, 0.15, 0.10, 0.15, 0.10, 0.10,    // E: social, networking
      0.10, 0.00, 0.05, 0.10, 0.15, 0.05,    // O: clever ideas
      -0.05, 0.00, 0.05, -0.10, 0.00, 0.00,  // A: resourceful, self-focused
      0.10, 0.00, 0.05, 0.10, 0.05, 0.00     // C: opportunistic
    ]
  },

  '丑': { // Ox - Steady, diligent, dependable
    animal: 'Ox',
    element: 'Earth',
    deltas: [
      -0.05, 0.05, 0.00, 0.00, -0.15, -0.05, // N: very stable
      -0.10, -0.10, 0.05, 0.00, -0.15, -0.10, // E: reserved
      -0.10, 0.05, 0.00, -0.10, 0.00, -0.10, // O: traditional
      0.10, 0.10, 0.10, 0.15, 0.10, 0.05,    // A: dependable
      0.15, 0.20, 0.15, 0.10, 0.20, 0.15     // C: very disciplined
    ]
  },

  '寅': { // Tiger - Bold, competitive, charismatic
    animal: 'Tiger',
    element: 'Wood',
    deltas: [
      0.00, 0.15, 0.00, -0.10, 0.10, -0.10,  // N: confident, can be angry
      0.10, 0.10, 0.20, 0.20, 0.15, 0.10,    // E: assertive, active
      0.10, 0.00, 0.10, 0.20, 0.10, 0.10,    // O: adventurous
      -0.10, 0.10, 0.00, -0.15, -0.15, 0.00, // A: independent
      0.10, 0.00, 0.05, 0.15, 0.10, 0.00     // C: driven
    ]
  },

  '卯': { // Rabbit - Elegant, diplomatic, artistic
    animal: 'Rabbit',
    element: 'Wood',
    deltas: [
      0.10, -0.10, 0.05, 0.10, 0.00, 0.10,   // N: sensitive
      0.10, 0.05, -0.10, 0.00, 0.00, 0.10,   // E: charming but not pushy
      0.15, 0.20, 0.15, 0.10, 0.10, 0.10,    // O: artistic
      0.15, 0.00, 0.10, 0.15, 0.10, 0.15,    // A: diplomatic
      0.05, 0.15, 0.10, 0.00, 0.10, 0.10     // C: refined
    ]
  },

  '辰': { // Dragon - Powerful, ambitious, charismatic
    animal: 'Dragon',
    element: 'Earth',
    deltas: [
      -0.10, 0.10, -0.10, -0.15, 0.10, -0.15, // N: confident
      0.10, 0.15, 0.20, 0.20, 0.15, 0.15,    // E: charismatic leader
      0.15, 0.10, 0.10, 0.20, 0.15, 0.15,    // O: visionary
      0.00, 0.10, 0.10, -0.15, -0.20, 0.05,  // A: proud
      0.15, 0.10, 0.10, 0.20, 0.15, 0.10     // C: ambitious
    ]
  },

  '巳': { // Snake - Wise, intuitive, enigmatic
    animal: 'Snake',
    element: 'Fire',
    deltas: [
      0.10, 0.05, 0.05, 0.10, 0.00, 0.10,    // N: can be jealous
      0.00, -0.10, 0.05, 0.00, 0.00, 0.00,   // E: selective
      0.15, 0.15, 0.20, 0.10, 0.20, 0.15,    // O: intuitive, philosophical
      0.00, 0.10, 0.05, 0.00, 0.05, 0.10,    // A: charming when wants
      0.10, 0.10, 0.10, 0.10, 0.10, 0.15     // C: strategic
    ]
  },

  '午': { // Horse - Active, independent, passionate
    animal: 'Horse',
    element: 'Fire',
    deltas: [
      -0.05, 0.10, -0.05, -0.10, 0.15, -0.10, // N: restless, impulsive
      0.15, 0.15, 0.15, 0.25, 0.20, 0.15,    // E: very active
      0.10, 0.05, 0.10, 0.25, 0.10, 0.15,    // O: freedom-loving
      0.00, 0.05, 0.05, -0.10, -0.05, 0.00,  // A: independent
      0.05, -0.10, 0.00, 0.15, 0.00, -0.10   // C: enthusiastic but scattered
    ]
  },

  '未': { // Goat/Sheep - Gentle, artistic, compassionate
    animal: 'Goat',
    element: 'Earth',
    deltas: [
      0.15, 0.00, 0.10, 0.15, 0.05, 0.15,    // N: sensitive, worrying
      0.10, 0.05, -0.10, 0.00, 0.00, 0.10,   // E: gentle warmth
      0.15, 0.25, 0.20, 0.10, 0.10, 0.10,    // O: highly artistic
      0.20, 0.00, 0.15, 0.15, 0.15, 0.20,    // A: compassionate
      0.00, 0.05, 0.10, -0.05, 0.05, 0.10    // C: follows heart
    ]
  },

  '申': { // Monkey - Clever, versatile, playful
    animal: 'Monkey',
    element: 'Metal',
    deltas: [
      0.00, 0.05, -0.05, 0.00, 0.15, 0.00,   // N: confident, impulsive
      0.15, 0.20, 0.15, 0.20, 0.20, 0.20,    // E: very social, playful
      0.20, 0.10, 0.10, 0.20, 0.20, 0.15,    // O: clever, curious
      0.00, -0.05, 0.05, -0.10, -0.05, 0.05, // A: charming but tricky
      0.10, -0.05, 0.00, 0.15, 0.00, -0.05   // C: clever shortcuts
    ]
  },

  '酉': { // Rooster - Precise, honest, confident
    animal: 'Rooster',
    element: 'Metal',
    deltas: [
      0.05, 0.10, 0.00, 0.00, 0.00, 0.00,    // N: can be critical
      0.05, 0.10, 0.15, 0.10, 0.05, 0.05,    // E: confident display
      0.00, 0.15, 0.05, 0.05, 0.10, 0.00,    // O: refined aesthetics
      0.00, 0.20, 0.05, -0.05, 0.00, 0.05,   // A: brutally honest
      0.15, 0.20, 0.15, 0.10, 0.15, 0.15     // C: meticulous
    ]
  },

  '戌': { // Dog - Loyal, honest, protective
    animal: 'Dog',
    element: 'Earth',
    deltas: [
      0.10, 0.10, 0.10, 0.10, 0.00, 0.10,    // N: anxious about threats
      0.10, 0.05, 0.10, 0.10, 0.00, 0.05,    // E: loyal companionship
      0.00, 0.00, 0.10, 0.05, 0.05, 0.00,    // O: values justice
      0.15, 0.15, 0.15, 0.10, 0.10, 0.10,    // A: loyal, protective
      0.10, 0.10, 0.20, 0.10, 0.15, 0.15     // C: dutiful
    ]
  },

  '亥': { // Pig - Generous, sincere, indulgent
    animal: 'Pig',
    element: 'Water',
    deltas: [
      0.05, 0.00, 0.05, 0.05, 0.10, 0.05,    // N: easygoing
      0.15, 0.15, 0.00, 0.05, 0.10, 0.20,    // E: social, enjoys pleasure
      0.10, 0.15, 0.15, 0.10, 0.05, 0.10,    // O: enjoys experiences
      0.20, 0.10, 0.20, 0.15, 0.10, 0.15,    // A: generous, trusting
      0.00, -0.05, 0.10, 0.05, 0.00, 0.00    // C: relaxed approach
    ]
  }
};

// ============================================
// ELEMENT BALANCE MODIFIERS
// ============================================
// Adjusts personality based on overall chart element balance

export const ELEMENT_MODIFIERS = {
  Wood: {
    dominant: {
      N: [0.00, 0.05, -0.05, 0.00, 0.05, -0.05],  // Growth-oriented
      E: [0.05, 0.05, 0.10, 0.10, 0.05, 0.05],    // Expansive
      O: [0.10, 0.05, 0.05, 0.10, 0.10, 0.05],    // Vision
      A: [0.05, 0.10, 0.05, -0.05, 0.00, 0.05],   // Principled
      C: [0.05, 0.00, 0.05, 0.10, 0.05, 0.00]     // Planning
    },
    deficient: {
      N: [0.05, 0.00, 0.05, 0.05, 0.00, 0.10],
      E: [-0.05, -0.05, -0.10, -0.05, 0.00, 0.00],
      O: [-0.10, -0.05, 0.00, -0.10, -0.05, 0.00],
      A: [0.00, -0.05, 0.00, 0.05, 0.05, 0.00],
      C: [0.00, 0.05, 0.00, -0.10, 0.00, 0.00]
    }
  },
  Fire: {
    dominant: {
      N: [-0.10, 0.05, -0.10, -0.10, 0.10, -0.10],  // Confident but impulsive
      E: [0.10, 0.10, 0.10, 0.15, 0.15, 0.15],      // Expressive
      O: [0.10, 0.10, 0.15, 0.10, 0.05, 0.10],      // Passionate
      A: [0.05, 0.00, 0.10, -0.05, -0.10, 0.10],    // Generous but proud
      C: [0.05, -0.05, 0.00, 0.15, 0.00, -0.10]     // Driven but scattered
    },
    deficient: {
      N: [0.10, -0.05, 0.10, 0.10, -0.10, 0.10],
      E: [-0.10, -0.10, -0.10, -0.10, -0.10, -0.15],
      O: [-0.05, -0.05, -0.10, -0.05, 0.00, -0.05],
      A: [0.00, 0.00, -0.05, 0.05, 0.10, -0.05],
      C: [0.00, 0.05, 0.05, -0.10, 0.05, 0.10]
    }
  },
  Earth: {
    dominant: {
      N: [-0.10, 0.00, -0.05, -0.05, -0.15, -0.10], // Grounded
      E: [0.05, 0.00, 0.05, -0.05, -0.10, 0.00],    // Steady warmth
      O: [-0.10, 0.05, 0.00, -0.15, 0.00, -0.10],   // Traditional
      A: [0.10, 0.10, 0.10, 0.15, 0.10, 0.10],      // Reliable
      C: [0.15, 0.15, 0.15, 0.05, 0.15, 0.15]       // Disciplined
    },
    deficient: {
      N: [0.10, 0.05, 0.10, 0.10, 0.10, 0.15],
      E: [-0.05, 0.00, -0.05, 0.05, 0.10, 0.00],
      O: [0.10, 0.00, 0.05, 0.10, 0.05, 0.05],
      A: [-0.10, -0.05, -0.10, -0.10, -0.10, -0.05],
      C: [-0.10, -0.15, -0.10, 0.00, -0.10, -0.10]
    }
  },
  Metal: {
    dominant: {
      N: [0.00, 0.10, 0.00, -0.05, -0.10, 0.00],    // Controlled
      E: [-0.05, -0.05, 0.10, 0.05, -0.05, -0.05],  // Reserved assertiveness
      O: [-0.05, 0.10, 0.00, 0.05, 0.10, 0.00],     // Discerning
      A: [-0.05, 0.15, -0.05, -0.10, -0.10, 0.00],  // Direct, principled
      C: [0.15, 0.15, 0.10, 0.10, 0.15, 0.15]       // Precise
    },
    deficient: {
      N: [0.05, -0.10, 0.05, 0.10, 0.10, 0.05],
      E: [0.05, 0.05, -0.10, 0.00, 0.10, 0.05],
      O: [0.05, -0.10, 0.05, 0.00, -0.10, 0.05],
      A: [0.10, -0.10, 0.10, 0.15, 0.15, 0.05],
      C: [-0.10, -0.10, -0.05, -0.05, -0.10, -0.10]
    }
  },
  Water: {
    dominant: {
      N: [0.05, 0.00, 0.05, 0.05, 0.05, 0.10],      // Emotional depth
      E: [0.05, 0.10, 0.00, 0.10, 0.05, 0.05],      // Communicative
      O: [0.15, 0.10, 0.15, 0.10, 0.15, 0.15],      // Intuitive, philosophical
      A: [0.05, 0.00, 0.10, 0.05, 0.05, 0.10],      // Adaptive
      C: [0.00, -0.10, 0.00, 0.05, -0.05, -0.05]    // Flows around obstacles
    },
    deficient: {
      N: [-0.05, 0.05, 0.00, -0.05, -0.05, -0.05],
      E: [0.00, -0.10, 0.05, -0.10, 0.00, 0.00],
      O: [-0.15, -0.10, -0.15, -0.05, -0.10, -0.10],
      A: [0.00, 0.05, -0.05, 0.00, 0.00, -0.05],
      C: [0.05, 0.10, 0.05, 0.00, 0.10, 0.10]
    }
  }
};

// ============================================
// YIN/YANG BALANCE MODIFIERS
// ============================================

export const YIN_YANG_MODIFIERS = {
  yangDominant: {
    // More extraverted, active, assertive
    N: [-0.05, 0.05, -0.05, -0.10, 0.05, -0.10],
    E: [0.05, 0.10, 0.15, 0.15, 0.10, 0.10],
    O: [0.05, 0.00, 0.00, 0.15, 0.05, 0.05],
    A: [-0.05, 0.05, 0.00, -0.10, -0.10, -0.05],
    C: [0.05, 0.00, 0.00, 0.10, 0.05, -0.05]
  },
  yinDominant: {
    // More introverted, receptive, sensitive
    N: [0.10, -0.05, 0.10, 0.15, 0.00, 0.15],
    E: [-0.05, -0.10, -0.10, -0.10, -0.05, 0.00],
    O: [0.10, 0.15, 0.15, -0.05, 0.10, 0.05],
    A: [0.10, 0.00, 0.10, 0.10, 0.10, 0.15],
    C: [0.00, 0.10, 0.10, -0.05, 0.05, 0.10]
  },
  balanced: {
    N: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
    E: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
    O: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
    A: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
    C: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00]
  }
};

// ============================================
// MAIN CONVERSION FUNCTION
// ============================================

/**
 * Convert BaZi chart to 30 NEO PI-R facets
 * @param {Object} baziData - Full BaZi calculation result from baziCalculator
 * @returns {number[]} 30-dimensional facet vector [0-1]
 */
export function baziTo30Facets(baziData) {
  // Handle null/undefined input
  if (!baziData || baziData.error) {
    return new Array(NUM_FACETS).fill(0.5);
  }

  const { pillars, dayMaster, elements, yinYang } = baziData;

  // 1. Get Day Master base vector (most important - 70% of Day Pillar)
  const dayMasterChar = dayMaster?.chinese?.[0] || pillars?.[2]?.stem?.char;
  const dayMasterData = DAY_MASTER_30_BASES[dayMasterChar];

  if (!dayMasterData) {
    console.warn('Unknown Day Master:', dayMasterChar);
    return new Array(NUM_FACETS).fill(0.5);
  }

  let vector = [...dayMasterData.facets];

  // 2. Add Day Branch (Animal) influence (30% of Day Pillar)
  const dayBranchChar = dayMaster?.chinese?.[1] || pillars?.[2]?.branch?.char;
  const dayBranchData = BRANCH_DELTAS[dayBranchChar];

  if (dayBranchData) {
    vector = vector.map((v, i) => v + 0.3 * dayBranchData.deltas[i]);
  }

  // 3. Add influence from other pillars (weighted)
  if (pillars && pillars.length === 4) {
    // Hour Pillar (15% weight)
    const hourStem = pillars[3]?.stem?.char;
    const hourBranch = pillars[3]?.branch?.char;
    if (hourStem && DAY_MASTER_30_BASES[hourStem]) {
      vector = vector.map((v, i) => v + 0.15 * 0.7 * (DAY_MASTER_30_BASES[hourStem].facets[i] - 0.5));
    }
    if (hourBranch && BRANCH_DELTAS[hourBranch]) {
      vector = vector.map((v, i) => v + 0.15 * 0.3 * BRANCH_DELTAS[hourBranch].deltas[i]);
    }

    // Month Pillar (10% weight)
    const monthStem = pillars[1]?.stem?.char;
    const monthBranch = pillars[1]?.branch?.char;
    if (monthStem && DAY_MASTER_30_BASES[monthStem]) {
      vector = vector.map((v, i) => v + 0.10 * 0.7 * (DAY_MASTER_30_BASES[monthStem].facets[i] - 0.5));
    }
    if (monthBranch && BRANCH_DELTAS[monthBranch]) {
      vector = vector.map((v, i) => v + 0.10 * 0.3 * BRANCH_DELTAS[monthBranch].deltas[i]);
    }

    // Year Pillar (5% weight)
    const yearStem = pillars[0]?.stem?.char;
    const yearBranch = pillars[0]?.branch?.char;
    if (yearStem && DAY_MASTER_30_BASES[yearStem]) {
      vector = vector.map((v, i) => v + 0.05 * 0.7 * (DAY_MASTER_30_BASES[yearStem].facets[i] - 0.5));
    }
    if (yearBranch && BRANCH_DELTAS[yearBranch]) {
      vector = vector.map((v, i) => v + 0.05 * 0.3 * BRANCH_DELTAS[yearBranch].deltas[i]);
    }
  }

  // 4. Apply element balance modifiers (POST-seasonal 旺衰 percentages)
  // CRITICAL: Use seasonalStrength.percentages (POST-seasonal), NOT elements.percentages (PRE-seasonal)
  // The seasonal adjustment reflects true elemental strength after considering birth season
  const seasonalPercentages = baziData?.seasonalStrength?.percentages;
  if (seasonalPercentages) {
    const percentages = seasonalPercentages;

    Object.entries(percentages).forEach(([element, pctStr]) => {
      const pct = parseFloat(pctStr);
      const modifier = ELEMENT_MODIFIERS[element];

      if (!modifier) return;

      let adjustments;
      if (pct >= 35) {
        // Dominant element (>35%)
        adjustments = modifier.dominant;
      } else if (pct <= 10) {
        // Deficient element (<10%)
        adjustments = modifier.deficient;
      } else {
        // Normal range - no adjustment
        return;
      }

      // Apply domain adjustments
      const intensity = pct >= 35 ? (pct - 35) / 30 : (10 - pct) / 10;
      const capped = Math.min(intensity, 0.5);

      ['N', 'E', 'O', 'A', 'C'].forEach((domain, domainIdx) => {
        if (adjustments[domain]) {
          adjustments[domain].forEach((adj, facetIdx) => {
            const globalIdx = domainIdx * 6 + facetIdx;
            vector[globalIdx] += adj * capped;
          });
        }
      });
    });
  }

  // 5. Apply Yin/Yang balance modifiers
  if (yinYang?.balance) {
    let yinYangMod;

    if (yinYang.balance.includes('Yang') || yinYang.yinPercentage < 40) {
      yinYangMod = YIN_YANG_MODIFIERS.yangDominant;
    } else if (yinYang.balance.includes('Yin') || yinYang.yinPercentage > 60) {
      yinYangMod = YIN_YANG_MODIFIERS.yinDominant;
    } else {
      yinYangMod = YIN_YANG_MODIFIERS.balanced;
    }

    // Calculate intensity (how imbalanced)
    const imbalance = Math.abs((yinYang.yinPercentage || 50) - 50) / 50;
    const intensity = Math.min(imbalance, 0.5);

    ['N', 'E', 'O', 'A', 'C'].forEach((domain, domainIdx) => {
      yinYangMod[domain].forEach((adj, facetIdx) => {
        const globalIdx = domainIdx * 6 + facetIdx;
        vector[globalIdx] += adj * intensity;
      });
    });
  }

  // 6. Clamp all values to [0, 1]
  return vector.map(v => Math.min(1, Math.max(0, v)));
}

/**
 * Simplified version using just Day Master stem
 * For cases where full BaZi data isn't available
 */
export function dayMasterTo30Facets(stemChar) {
  const data = DAY_MASTER_30_BASES[stemChar];
  if (!data) {
    return new Array(NUM_FACETS).fill(0.5);
  }
  return [...data.facets];
}

/**
 * Get Day Master personality description
 */
export function getDayMasterDescription(stemChar) {
  const data = DAY_MASTER_30_BASES[stemChar];
  if (!data) {
    return { english: 'Unknown', nature: 'Unknown Day Master' };
  }
  return {
    english: data.english,
    nature: data.nature
  };
}

// ============================================
// EXPORT
// ============================================

export default {
  PILLAR_WEIGHTS,
  DAY_MASTER_30_BASES,
  BRANCH_DELTAS,
  ELEMENT_MODIFIERS,
  YIN_YANG_MODIFIERS,
  baziTo30Facets,
  dayMasterTo30Facets,
  getDayMasterDescription
};
