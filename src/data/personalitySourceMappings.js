/**
 * ============================================
 * PERSONALITY SOURCE MAPPINGS - Luna's Multiple Eyes
 * ============================================
 *
 * Maps each personality "eye" (data source) to 30 NEO PI-R facets
 * Like Tesla's cameras at different angles, each source sees personality differently
 *
 * Sources (Eyes):
 * 1. Enneagram - Full depth: Core, Wing, Tritype, Stacking, Levels
 * 2. Western Zodiac - Sun, Moon, Rising, Element Balance
 * 3. MBTI - 16 Types with cognitive functions
 * 4. Numerology - Life Path, Expression, Soul Urge, Personality
 * 5. Big Five - Direct OCEAN scores (ground truth when available)
 *
 * Output: 30-dimensional NEO PI-R facet vector [0-1]
 *
 * Facet Order (for reference):
 * N1-N6: Anxiety, Angry Hostility, Depression, Self-Consciousness, Impulsiveness, Vulnerability
 * E1-E6: Warmth, Gregariousness, Assertiveness, Activity, Excitement-Seeking, Positive Emotions
 * O1-O6: Fantasy, Aesthetics, Feelings, Actions, Ideas, Values
 * A1-A6: Trust, Straightforwardness, Altruism, Compliance, Modesty, Tender-Mindedness
 * C1-C6: Competence, Order, Dutifulness, Achievement Striving, Self-Discipline, Deliberation
 *
 * Created: January 7, 2026
 * For: GENESIS AI Soul Partner System - Cathedral Build
 */

import { NUM_FACETS, FACET_ORDER } from './neoFacetSchema';
import { baziTo30Facets } from './baziSourceMapping';
import { zodiacDegreeToFacets, natalChartToFacets, analyzeDegree } from './degreeEncodingP1';

// ============================================
// SOURCE WEIGHTS (Research-Calibrated)
// ============================================
// Updated to include BaZi at 30% weight per Sonnet + Grok analysis
// BaZi provides unique Chinese elemental + polarity insight

export const SOURCE_WEIGHTS = {
  big5: 0.25,        // Ground truth (if available) - reduced from 0.35
  bazi: 0.30,        // P0 Priority: Chinese astrology (Day Pillar = 70%)
  enneagram: 0.18,   // Rich depth with all layers
  mbti: 0.10,        // Good predictor
  natal: 0.10,       // Western zodiac elemental
  numerology: 0.07   // Archetypal patterns
};

// ============================================
// ENNEAGRAM TO 30 FACETS
// Full depth: Core + Wing + Tritype + Stacking + Levels
// ============================================

// Base vectors for 9 Enneagram types (30 facets each)
// Order: N1-N6, E1-E6, O1-O6, A1-A6, C1-C6
export const ENNEAGRAM_30_BASES = {
  1: [ // The Reformer - Principled, Purposeful, Self-Controlled
    0.65, 0.60, 0.45, 0.55, 0.30, 0.50, // N: moderate anxiety, controlled anger
    0.55, 0.45, 0.70, 0.65, 0.35, 0.45, // E: assertive but not gregarious
    0.50, 0.60, 0.55, 0.40, 0.70, 0.45, // O: values ideas, less flexible
    0.65, 0.85, 0.75, 0.50, 0.40, 0.70, // A: ethical, less compliant
    0.90, 0.95, 0.95, 0.80, 0.90, 0.85  // C: extremely high
  ],
  2: [ // The Helper - Generous, People-Pleasing, Possessive
    0.60, 0.50, 0.55, 0.65, 0.55, 0.60, // N: sensitive to rejection
    0.95, 0.85, 0.55, 0.70, 0.50, 0.85, // E: very warm and gregarious
    0.55, 0.65, 0.80, 0.55, 0.45, 0.50, // O: high feelings, moderate ideas
    0.80, 0.70, 0.98, 0.75, 0.70, 0.95, // A: very altruistic and tender
    0.70, 0.60, 0.80, 0.60, 0.65, 0.55  // C: dutiful, less achievement-focused
  ],
  3: [ // The Achiever - Success-Oriented, Pragmatic, Driven
    0.45, 0.40, 0.40, 0.60, 0.45, 0.40, // N: low except self-consciousness
    0.75, 0.80, 0.85, 0.90, 0.70, 0.80, // E: high across the board
    0.55, 0.50, 0.45, 0.70, 0.55, 0.50, // O: action-oriented, less feelings
    0.55, 0.45, 0.55, 0.35, 0.30, 0.50, // A: competitive, not modest
    0.90, 0.75, 0.70, 0.98, 0.85, 0.65  // C: high achievement, less deliberate
  ],
  4: [ // The Individualist - Sensitive, Withdrawn, Expressive
    0.80, 0.70, 0.85, 0.85, 0.75, 0.80, // N: high emotional intensity
    0.70, 0.40, 0.45, 0.50, 0.55, 0.50, // E: warm but not gregarious
    0.95, 0.95, 0.98, 0.70, 0.80, 0.75, // O: extremely high aesthetics/feelings
    0.65, 0.75, 0.70, 0.70, 0.55, 0.85, // A: tender, authentic
    0.55, 0.40, 0.60, 0.55, 0.45, 0.50  // C: less structured
  ],
  5: [ // The Investigator - Intense, Cerebral, Perceptive
    0.55, 0.45, 0.60, 0.70, 0.35, 0.65, // N: moderate, self-conscious
    0.40, 0.20, 0.40, 0.35, 0.40, 0.35, // E: very low gregariousness
    0.90, 0.70, 0.65, 0.55, 0.98, 0.85, // O: extremely high ideas
    0.45, 0.65, 0.40, 0.60, 0.65, 0.50, // A: independent but straightforward
    0.85, 0.70, 0.65, 0.70, 0.75, 0.80  // C: competent, deliberate
  ],
  6: [ // The Loyalist - Committed, Security-Oriented, Suspicious
    0.85, 0.65, 0.65, 0.70, 0.50, 0.80, // N: high anxiety, vulnerability
    0.65, 0.60, 0.50, 0.60, 0.45, 0.55, // E: moderate, cautious
    0.50, 0.50, 0.60, 0.40, 0.65, 0.45, // O: moderate, values stability
    0.70, 0.75, 0.75, 0.70, 0.60, 0.70, // A: loyal, trustworthy
    0.75, 0.80, 0.90, 0.65, 0.75, 0.85  // C: dutiful, deliberate
  ],
  7: [ // The Enthusiast - Spontaneous, Versatile, Scattered
    0.35, 0.30, 0.25, 0.35, 0.80, 0.30, // N: low except impulsiveness
    0.85, 0.90, 0.70, 0.95, 0.98, 0.98, // E: extremely high
    0.90, 0.65, 0.70, 0.95, 0.80, 0.75, // O: high fantasy, actions
    0.70, 0.55, 0.60, 0.40, 0.45, 0.60, // A: friendly but independent
    0.65, 0.35, 0.50, 0.70, 0.40, 0.25  // C: low order, discipline, deliberation
  ],
  8: [ // The Challenger - Self-Confident, Decisive, Willful
    0.40, 0.75, 0.30, 0.25, 0.65, 0.25, // N: high anger, low vulnerability
    0.65, 0.65, 0.98, 0.85, 0.75, 0.65, // E: very assertive
    0.55, 0.40, 0.55, 0.75, 0.60, 0.65, // O: action-oriented
    0.45, 0.80, 0.60, 0.20, 0.20, 0.55, // A: direct, not compliant/modest
    0.90, 0.65, 0.65, 0.85, 0.80, 0.55  // C: competent, achievement-focused
  ],
  9: [ // The Peacemaker - Receptive, Reassuring, Agreeable
    0.45, 0.25, 0.50, 0.55, 0.40, 0.50, // N: low anger, some depression
    0.75, 0.65, 0.30, 0.40, 0.35, 0.70, // E: warm but not assertive
    0.60, 0.65, 0.70, 0.45, 0.55, 0.50, // O: moderate, open to feelings
    0.80, 0.65, 0.75, 0.90, 0.80, 0.80, // A: very compliant, trusting
    0.55, 0.50, 0.65, 0.40, 0.45, 0.50  // C: moderate
  ]
};

// Instinctual Stacking Deltas (30 facets)
const STACKING_DELTAS = {
  sp: [ // Self-Preservation: security, comfort, health
    0.10, 0.05, 0.05, 0.05, -0.10, 0.10, // N: more anxiety, less impulsive
    -0.05, -0.10, 0.00, -0.05, -0.15, -0.05, // E: less gregarious, excitement
    -0.05, 0.05, 0.00, -0.10, 0.00, -0.05, // O: less action-seeking
    0.05, 0.05, 0.05, 0.10, 0.10, 0.05, // A: more compliant
    0.15, 0.15, 0.10, 0.05, 0.15, 0.15  // C: more ordered, disciplined
  ],
  so: [ // Social: community, status, belonging
    0.05, 0.00, 0.05, 0.10, 0.05, 0.05, // N: more self-conscious
    0.10, 0.20, 0.10, 0.10, 0.05, 0.10, // E: more gregarious
    0.05, 0.05, 0.10, 0.10, 0.05, 0.10, // O: more open to values
    0.10, 0.00, 0.15, 0.10, 0.05, 0.10, // A: more altruistic
    0.05, 0.05, 0.10, 0.10, 0.05, 0.05  // C: more dutiful
  ],
  sx: [ // Sexual/One-to-One: intensity, chemistry, connection
    0.10, 0.15, 0.10, 0.05, 0.15, 0.10, // N: more intense emotions
    0.10, 0.00, 0.10, 0.15, 0.20, 0.10, // E: more excitement, activity
    0.15, 0.15, 0.20, 0.15, 0.05, 0.10, // O: more fantasy, feelings
    0.05, 0.10, 0.10, -0.10, -0.10, 0.15, // A: less compliant, more tender
    0.00, -0.10, 0.00, 0.10, 0.00, -0.10  // C: less ordered, more spontaneous
  ]
};

// ============================================
// WING MODULATION FACTORS (Brother Sonnet Enhancement)
// ============================================
// More nuanced wing blending based on Grok's Type 4 analysis
// Each wing combination has specific trait adjustments beyond simple averaging

const WING_MODULATIONS = {
  // Type 1 Wings
  '1w9': { E_mod: -0.10, A_mod: 0.10, anger_suppress: 0.15 },  // Idealist - calmer, more accepting
  '1w2': { E_mod: 0.10, A_mod: 0.15, warmth_boost: 0.20 },     // Advocate - warmer, more helpful

  // Type 2 Wings
  '2w1': { C_mod: 0.15, A_mod: -0.05, principled: 0.15 },      // Servant - more principled helper
  '2w3': { E_mod: 0.15, C_mod: 0.10, performative: 0.20 },     // Host - more image-conscious

  // Type 3 Wings
  '3w2': { E_mod: 0.10, A_mod: 0.15, charm_boost: 0.20 },      // Charmer - warmer achiever
  '3w4': { O_mod: 0.15, N_mod: 0.10, depth_boost: 0.15 },      // Professional - more authentic

  // Type 4 Wings (Grok's detailed analysis)
  '4w3': {  // Aristocrat - more performative, ambitious, image-conscious
    E_mod: 0.25,           // Significant extraversion increase
    C_mod: 0.15,           // Noticeable conscientiousness increase
    N_mod: -0.05,          // Slightly lower neuroticism
    performativity: 0.30,  // More dramatic expression
    ambition_boost: 0.20
  },
  '4w5': {  // Bohemian - more withdrawn, intellectual, contemplative
    E_mod: -0.20,          // Further extraversion decrease
    C_mod: -0.05,          // Maintained or lower conscientiousness
    N_mod: 0.10,           // Higher intensity
    intellectuality: 0.35, // More cerebral
    withdrawal: 0.25
  },

  // Type 5 Wings
  '5w4': { O_mod: 0.15, N_mod: 0.10, aesthetic_depth: 0.20 },  // Iconoclast - more emotional
  '5w6': { A_mod: 0.10, C_mod: 0.10, loyalty_boost: 0.15 },    // Problem Solver - more cooperative

  // Type 6 Wings
  '6w5': { O_mod: 0.10, E_mod: -0.10, analytical: 0.20 },      // Defender - more withdrawn
  '6w7': { E_mod: 0.15, N_mod: -0.10, optimism_boost: 0.15 },  // Buddy - more outgoing

  // Type 7 Wings
  '7w6': { A_mod: 0.10, N_mod: 0.10, anxiety_aware: 0.15 },    // Entertainer - more responsible
  '7w8': { E_mod: 0.10, A_mod: -0.10, assertive_boost: 0.20 }, // Realist - more forceful

  // Type 8 Wings
  '8w7': { E_mod: 0.15, O_mod: 0.10, adventure_boost: 0.15 },  // Maverick - more expansive
  '8w9': { A_mod: 0.15, N_mod: -0.10, calm_strength: 0.20 },   // Bear - steadier presence

  // Type 9 Wings
  '9w8': { E_mod: 0.10, A_mod: -0.05, assertive_boost: 0.15 }, // Referee - more assertive
  '9w1': { C_mod: 0.15, O_mod: -0.05, principled: 0.15 }       // Dreamer - more idealistic
};

/**
 * Apply detailed wing modulation (beyond simple averaging)
 */
function applyWingModulation(vector, core, wing) {
  const key = `${core}w${wing}`;
  const mod = WING_MODULATIONS[key];

  if (!mod) return vector;

  return vector.map((v, i) => {
    let adjustment = 0;

    // Apply domain modifiers
    if (i < 6 && mod.N_mod) adjustment += mod.N_mod;        // Neuroticism
    if (i >= 6 && i < 12 && mod.E_mod) adjustment += mod.E_mod;  // Extraversion
    if (i >= 12 && i < 18 && mod.O_mod) adjustment += mod.O_mod; // Openness
    if (i >= 18 && i < 24 && mod.A_mod) adjustment += mod.A_mod; // Agreeableness
    if (i >= 24 && mod.C_mod) adjustment += mod.C_mod;      // Conscientiousness

    // Apply specific facet boosts
    if (mod.warmth_boost && i === 6) adjustment += mod.warmth_boost;     // E1: Warmth
    if (mod.performativity && i === 11) adjustment += mod.performativity; // E6: Positive Emotions
    if (mod.intellectuality && i === 16) adjustment += mod.intellectuality; // O5: Ideas
    if (mod.assertive_boost && i === 8) adjustment += mod.assertive_boost; // E3: Assertiveness

    return v + adjustment * 0.3; // Scale down to avoid oversaturation
  });
}

// ============================================
// ENNEAGRAM HEALTH LEVELS (1-9 Scale)
// Brother Sonnet Enhancement: Granular 9-level modulation
// ============================================
// Level 1 = Liberation (highest), Level 9 = Pathology (lowest)
// Based on Don Riso & Russ Hudson's Levels of Development

export const HEALTH_LEVEL_PROFILES = {
  // Level 1: Liberation - Transcendent, self-actualized
  1: {
    N_mod: -0.25, E_mod: 0.15, O_mod: 0.20, A_mod: 0.25, C_mod: 0.15,
    description: 'Liberation - Transcendent wisdom, ego release',
    facet_boosts: { A1_Trust: 0.30, O6_Values: 0.25, E6_PositiveEmotions: 0.20 }
  },
  // Level 2: Psychological Capacity - High functioning, integrated
  2: {
    N_mod: -0.18, E_mod: 0.12, O_mod: 0.15, A_mod: 0.18, C_mod: 0.12,
    description: 'Psychological Capacity - High functioning, balanced',
    facet_boosts: { C1_Competence: 0.20, A3_Altruism: 0.18, O4_Actions: 0.15 }
  },
  // Level 3: Social Value - Healthy, contributing to others
  3: {
    N_mod: -0.10, E_mod: 0.08, O_mod: 0.10, A_mod: 0.12, C_mod: 0.08,
    description: 'Social Value - Healthy engagement, constructive',
    facet_boosts: { E1_Warmth: 0.15, A6_TenderMindedness: 0.12, C3_Dutifulness: 0.10 }
  },
  // Level 4: Imbalance - Beginning to lose equilibrium
  4: {
    N_mod: 0.05, E_mod: -0.02, O_mod: -0.03, A_mod: -0.05, C_mod: -0.02,
    description: 'Imbalance - Ego defenses activating',
    facet_boosts: { N4_SelfConsciousness: 0.08, N1_Anxiety: 0.05 }
  },
  // Level 5: Interpersonal Control - Manipulating environment
  5: {
    N_mod: 0.10, E_mod: -0.05, O_mod: -0.05, A_mod: -0.10, C_mod: -0.03,
    description: 'Interpersonal Control - Ego strategies intensify',
    facet_boosts: { A4_Compliance: -0.15, A2_Straightforwardness: -0.10 }
  },
  // Level 6: Overcompensation - Type fixation dominates
  6: {
    N_mod: 0.15, E_mod: -0.08, O_mod: -0.08, A_mod: -0.15, C_mod: -0.05,
    description: 'Overcompensation - Defensive patterns entrenched',
    facet_boosts: { N2_AngryHostility: 0.12, N6_Vulnerability: 0.10, A1_Trust: -0.15 }
  },
  // Level 7: Violation - Acting against others/self
  7: {
    N_mod: 0.22, E_mod: -0.12, O_mod: -0.12, A_mod: -0.22, C_mod: -0.10,
    description: 'Violation - Destructive patterns emerge',
    facet_boosts: { N5_Impulsiveness: 0.18, N3_Depression: 0.15, C5_SelfDiscipline: -0.20 }
  },
  // Level 8: Obsession/Compulsion - Delusional thinking
  8: {
    N_mod: 0.28, E_mod: -0.15, O_mod: -0.15, A_mod: -0.28, C_mod: -0.15,
    description: 'Obsession/Compulsion - Reality distortion',
    facet_boosts: { N1_Anxiety: 0.25, N3_Depression: 0.22, O4_Actions: -0.20 }
  },
  // Level 9: Pathology - Complete dysfunction
  9: {
    N_mod: 0.35, E_mod: -0.20, O_mod: -0.18, A_mod: -0.35, C_mod: -0.20,
    description: 'Pathology - Severe dysfunction, dissociation',
    facet_boosts: { N6_Vulnerability: 0.30, N3_Depression: 0.28, C6_Deliberation: -0.25 }
  }
};

// Type-specific level manifestations (how each type uniquely degrades/grows)
export const TYPE_LEVEL_SPECIFICS = {
  1: { // Reformer
    healthy_boost: { C2_Order: 0.10, A2_Straightforwardness: 0.15 },  // Principled integrity
    unhealthy_penalty: { N2_AngryHostility: 0.20, A4_Compliance: -0.15 }  // Punitive critic
  },
  2: { // Helper
    healthy_boost: { A3_Altruism: 0.15, E1_Warmth: 0.12 },  // Unconditional love
    unhealthy_penalty: { N5_Impulsiveness: 0.15, A2_Straightforwardness: -0.20 }  // Manipulative
  },
  3: { // Achiever
    healthy_boost: { C4_AchievementStriving: 0.10, A2_Straightforwardness: 0.15 },  // Authentic success
    unhealthy_penalty: { A2_Straightforwardness: -0.25, N4_SelfConsciousness: 0.20 }  // Deceptive
  },
  4: { // Individualist
    healthy_boost: { O3_Feelings: 0.12, O2_Aesthetics: 0.15 },  // Creative transformation
    unhealthy_penalty: { N3_Depression: 0.25, N6_Vulnerability: 0.20 }  // Self-destructive
  },
  5: { // Investigator
    healthy_boost: { O5_Ideas: 0.15, C1_Competence: 0.12 },  // Visionary insight
    unhealthy_penalty: { E2_Gregariousness: -0.25, N1_Anxiety: 0.18 }  // Isolated, paranoid
  },
  6: { // Loyalist
    healthy_boost: { A1_Trust: 0.15, C3_Dutifulness: 0.12 },  // Courageous loyalty
    unhealthy_penalty: { N1_Anxiety: 0.25, A1_Trust: -0.25 }  // Paranoid, reactive
  },
  7: { // Enthusiast
    healthy_boost: { O4_Actions: 0.15, E6_PositiveEmotions: 0.12 },  // Joyful wisdom
    unhealthy_penalty: { N5_Impulsiveness: 0.25, C5_SelfDiscipline: -0.25 }  // Manic, scattered
  },
  8: { // Challenger
    healthy_boost: { E3_Assertiveness: 0.10, A6_TenderMindedness: 0.15 },  // Magnanimous strength
    unhealthy_penalty: { N2_AngryHostility: 0.28, A4_Compliance: -0.25 }  // Ruthless, tyrannical
  },
  9: { // Peacemaker
    healthy_boost: { A4_Compliance: 0.08, E1_Warmth: 0.12 },  // Dynamic peace
    unhealthy_penalty: { E4_Activity: -0.25, N3_Depression: 0.20 }  // Dissociated, numbed
  }
};

// Facet index mapping for specific boosts
const FACET_INDEX_MAP = {
  N1_Anxiety: 0, N2_AngryHostility: 1, N3_Depression: 2,
  N4_SelfConsciousness: 3, N5_Impulsiveness: 4, N6_Vulnerability: 5,
  E1_Warmth: 6, E2_Gregariousness: 7, E3_Assertiveness: 8,
  E4_Activity: 9, E5_ExcitementSeeking: 10, E6_PositiveEmotions: 11,
  O1_Fantasy: 12, O2_Aesthetics: 13, O3_Feelings: 14,
  O4_Actions: 15, O5_Ideas: 16, O6_Values: 17,
  A1_Trust: 18, A2_Straightforwardness: 19, A3_Altruism: 20,
  A4_Compliance: 21, A5_Modesty: 22, A6_TenderMindedness: 23,
  C1_Competence: 24, C2_Order: 25, C3_Dutifulness: 26,
  C4_AchievementStriving: 27, C5_SelfDiscipline: 28, C6_Deliberation: 29
};

/**
 * Get granular level modifier for health level 1-9
 * Brother Sonnet Enhancement: Type-specific + facet-level modulation
 * @param {number} level - Health level (1=healthiest, 9=unhealthiest)
 * @param {number} coreType - Enneagram core type (1-9) for type-specific effects
 * @returns {Object} Modifier object with domain and facet adjustments
 */
function getLevelModifier(level, coreType = null) {
  const clampedLevel = Math.min(9, Math.max(1, Math.round(level)));
  const profile = HEALTH_LEVEL_PROFILES[clampedLevel];

  if (!profile) {
    return { N_modifier: 0, E_modifier: 0, O_modifier: 0, A_modifier: 0, C_modifier: 0 };
  }

  // Base domain modifiers from level profile
  const result = {
    N_modifier: profile.N_mod,
    E_modifier: profile.E_mod,
    O_modifier: profile.O_mod,
    A_modifier: profile.A_mod,
    C_modifier: profile.C_mod,
    facet_adjustments: { ...profile.facet_boosts }
  };

  // Apply type-specific level effects
  if (coreType && TYPE_LEVEL_SPECIFICS[coreType]) {
    const typeSpec = TYPE_LEVEL_SPECIFICS[coreType];

    if (clampedLevel <= 3 && typeSpec.healthy_boost) {
      // Apply healthy boosts scaled by level (1=full, 3=partial)
      const scale = (4 - clampedLevel) / 3;
      Object.entries(typeSpec.healthy_boost).forEach(([facet, boost]) => {
        result.facet_adjustments[facet] = (result.facet_adjustments[facet] || 0) + boost * scale;
      });
    } else if (clampedLevel >= 7 && typeSpec.unhealthy_penalty) {
      // Apply unhealthy penalties scaled by level (7=partial, 9=full)
      const scale = (clampedLevel - 6) / 3;
      Object.entries(typeSpec.unhealthy_penalty).forEach(([facet, penalty]) => {
        result.facet_adjustments[facet] = (result.facet_adjustments[facet] || 0) + penalty * scale;
      });
    }
  }

  return result;
}

/**
 * Convert full Enneagram profile to 30 NEO facets
 * @param {number} core - Core type 1-9
 * @param {number|null} wing - Wing type
 * @param {number[]|null} tritype - [head, heart, gut] types
 * @param {string|null} stacking - e.g., "sp/so/sx"
 * @param {number|null} level - 1-9 (1=healthiest)
 */
export function enneagramTo30Facets(core, wing = null, tritype = null, stacking = null, level = 5) {
  if (!ENNEAGRAM_30_BASES[core]) {
    return new Array(NUM_FACETS).fill(0.5);
  }

  let vector = [...ENNEAGRAM_30_BASES[core]];

  // Wing blend (70% core, 30% wing) + detailed wing modulation
  if (wing && ENNEAGRAM_30_BASES[wing]) {
    const wingVec = ENNEAGRAM_30_BASES[wing];
    vector = vector.map((v, i) => 0.7 * v + 0.3 * wingVec[i]);

    // Apply nuanced wing modulation (Brother Sonnet enhancement)
    // This captures differences like 4w3 (Aristocrat) vs 4w5 (Bohemian)
    vector = applyWingModulation(vector, core, wing);
  }

  // Tritype blend (60% primary, 20% each secondary)
  if (tritype && tritype.length === 3 && tritype.every(t => ENNEAGRAM_30_BASES[t])) {
    const [t1, t2, t3] = tritype;
    vector = ENNEAGRAM_30_BASES[t1].map((v, i) =>
      0.6 * v + 0.2 * ENNEAGRAM_30_BASES[t2][i] + 0.2 * ENNEAGRAM_30_BASES[t3][i]
    );
  }

  // Instinctual stacking
  if (stacking) {
    const norm = stacking.toLowerCase().replace(/[\/\-]/g, '');
    const primary = norm.slice(0, 2);
    const secondary = norm.slice(2, 4);

    if (STACKING_DELTAS[primary]) {
      vector = vector.map((v, i) => v + 0.15 * STACKING_DELTAS[primary][i]);
    }
    if (STACKING_DELTAS[secondary]) {
      vector = vector.map((v, i) => v + 0.08 * STACKING_DELTAS[secondary][i]);
    }
  }

  // Levels of development (Enhanced 9-level granularity)
  if (level >= 1 && level <= 9) {
    const mod = getLevelModifier(level, core);

    // Apply domain-level modifiers
    vector = vector.map((v, i) => {
      if (i < 6) return v + mod.N_modifier;        // Neuroticism
      if (i < 12) return v + mod.E_modifier;       // Extraversion
      if (i < 18) return v + mod.O_modifier;       // Openness
      if (i < 24) return v + mod.A_modifier;       // Agreeableness
      return v + mod.C_modifier;                   // Conscientiousness
    });

    // Apply facet-specific adjustments (Brother Sonnet Enhancement)
    if (mod.facet_adjustments) {
      Object.entries(mod.facet_adjustments).forEach(([facetName, adjustment]) => {
        const idx = FACET_INDEX_MAP[facetName];
        if (idx !== undefined) {
          vector[idx] += adjustment;
        }
      });
    }
  }

  return vector.map(v => Math.min(1, Math.max(0, v)));
}

// ============================================
// ZODIAC TO 30 FACETS
// ============================================

export const ZODIAC_30_BASES = {
  Aries: [ // Fire Cardinal - Bold, Pioneering
    0.50, 0.70, 0.35, 0.30, 0.75, 0.35,
    0.70, 0.75, 0.90, 0.95, 0.85, 0.80,
    0.60, 0.50, 0.60, 0.90, 0.55, 0.65,
    0.50, 0.75, 0.55, 0.25, 0.25, 0.50,
    0.80, 0.55, 0.60, 0.90, 0.70, 0.40
  ],
  Taurus: [ // Earth Fixed - Stable, Sensual
    0.40, 0.50, 0.40, 0.45, 0.35, 0.35,
    0.75, 0.55, 0.50, 0.40, 0.35, 0.70,
    0.45, 0.85, 0.70, 0.30, 0.45, 0.35,
    0.70, 0.65, 0.65, 0.70, 0.65, 0.75,
    0.80, 0.85, 0.80, 0.70, 0.85, 0.80
  ],
  Gemini: [ // Air Mutable - Curious, Communicative
    0.55, 0.45, 0.45, 0.50, 0.65, 0.50,
    0.75, 0.85, 0.70, 0.85, 0.75, 0.80,
    0.85, 0.60, 0.65, 0.80, 0.90, 0.75,
    0.60, 0.55, 0.55, 0.50, 0.50, 0.55,
    0.65, 0.45, 0.55, 0.70, 0.50, 0.45
  ],
  Cancer: [ // Water Cardinal - Nurturing, Protective
    0.70, 0.55, 0.65, 0.70, 0.60, 0.75,
    0.90, 0.60, 0.45, 0.50, 0.40, 0.70,
    0.70, 0.75, 0.95, 0.45, 0.55, 0.50,
    0.80, 0.70, 0.95, 0.75, 0.70, 0.95,
    0.70, 0.75, 0.85, 0.55, 0.70, 0.70
  ],
  Leo: [ // Fire Fixed - Creative, Generous
    0.40, 0.50, 0.35, 0.45, 0.60, 0.30,
    0.90, 0.85, 0.85, 0.80, 0.75, 0.95,
    0.80, 0.80, 0.75, 0.75, 0.60, 0.60,
    0.65, 0.70, 0.75, 0.35, 0.25, 0.65,
    0.85, 0.65, 0.70, 0.85, 0.75, 0.55
  ],
  Virgo: [ // Earth Mutable - Analytical, Practical
    0.65, 0.45, 0.55, 0.65, 0.35, 0.60,
    0.60, 0.45, 0.55, 0.65, 0.35, 0.50,
    0.50, 0.70, 0.60, 0.45, 0.85, 0.50,
    0.70, 0.85, 0.80, 0.70, 0.75, 0.70,
    0.95, 0.95, 0.90, 0.80, 0.90, 0.90
  ],
  Libra: [ // Air Cardinal - Harmonious, Diplomatic
    0.50, 0.35, 0.45, 0.60, 0.50, 0.55,
    0.85, 0.80, 0.55, 0.60, 0.55, 0.80,
    0.75, 0.90, 0.75, 0.65, 0.70, 0.70,
    0.85, 0.60, 0.75, 0.85, 0.65, 0.80,
    0.65, 0.70, 0.75, 0.60, 0.60, 0.75
  ],
  Scorpio: [ // Water Fixed - Intense, Transformative
    0.70, 0.75, 0.60, 0.65, 0.55, 0.65,
    0.65, 0.50, 0.75, 0.70, 0.65, 0.55,
    0.75, 0.70, 0.90, 0.60, 0.85, 0.70,
    0.45, 0.80, 0.60, 0.35, 0.50, 0.70,
    0.85, 0.75, 0.80, 0.85, 0.85, 0.75
  ],
  Sagittarius: [ // Fire Mutable - Adventurous, Philosophical
    0.35, 0.40, 0.30, 0.35, 0.70, 0.30,
    0.80, 0.85, 0.70, 0.90, 0.95, 0.90,
    0.90, 0.60, 0.65, 0.95, 0.85, 0.85,
    0.70, 0.75, 0.65, 0.45, 0.50, 0.60,
    0.70, 0.45, 0.55, 0.75, 0.55, 0.40
  ],
  Capricorn: [ // Earth Cardinal - Ambitious, Disciplined
    0.55, 0.50, 0.55, 0.55, 0.30, 0.45,
    0.55, 0.50, 0.80, 0.75, 0.40, 0.45,
    0.45, 0.55, 0.45, 0.55, 0.70, 0.45,
    0.60, 0.80, 0.55, 0.55, 0.55, 0.55,
    0.95, 0.90, 0.95, 0.98, 0.95, 0.90
  ],
  Aquarius: [ // Air Fixed - Innovative, Independent
    0.45, 0.50, 0.45, 0.50, 0.55, 0.40,
    0.65, 0.70, 0.70, 0.70, 0.65, 0.65,
    0.95, 0.65, 0.55, 0.80, 0.95, 0.95,
    0.60, 0.75, 0.70, 0.40, 0.55, 0.60,
    0.75, 0.60, 0.65, 0.75, 0.70, 0.70
  ],
  Pisces: [ // Water Mutable - Compassionate, Imaginative
    0.75, 0.45, 0.70, 0.70, 0.65, 0.80,
    0.85, 0.55, 0.35, 0.45, 0.50, 0.70,
    0.98, 0.95, 0.98, 0.60, 0.75, 0.70,
    0.85, 0.60, 0.90, 0.80, 0.75, 0.95,
    0.50, 0.40, 0.60, 0.45, 0.45, 0.50
  ]
};

/**
 * Convert Zodiac profile to 30 NEO facets
 * P1 Enhanced: Supports degree-level precision when available
 *
 * @param {string|Object} sunSign - Sun sign name OR object { sign, degree }
 * @param {string|Object} moonSign - Moon sign name OR object { sign, degree }
 * @param {string|Object} risingSign - Rising sign name OR object { sign, degree }
 * @returns {number[]} 30-facet vector
 */
export function zodiacTo30Facets(sunSign, moonSign = null, risingSign = null) {
  // P1: Check if degree information is provided
  const hasDegrees = (
    (typeof sunSign === 'object' && sunSign?.degree !== undefined) ||
    (typeof moonSign === 'object' && moonSign?.degree !== undefined) ||
    (typeof risingSign === 'object' && risingSign?.degree !== undefined)
  );

  // P1: Use degree-enhanced calculation if degrees are available
  if (hasDegrees) {
    const natal = {
      sun: typeof sunSign === 'object' ? sunSign : { sign: sunSign, degree: 15 },
      moon: moonSign ? (typeof moonSign === 'object' ? moonSign : { sign: moonSign, degree: 15 }) : null,
      rising: risingSign ? (typeof risingSign === 'object' ? risingSign : { sign: risingSign, degree: 15 }) : null
    };
    return natalChartToFacets(natal);
  }

  // Legacy: Sign-only calculation (backwards compatible)
  const sunSignName = typeof sunSign === 'object' ? sunSign.sign : sunSign;
  const moonSignName = typeof moonSign === 'object' ? moonSign?.sign : moonSign;
  const risingSignName = typeof risingSign === 'object' ? risingSign?.sign : risingSign;

  if (!ZODIAC_30_BASES[sunSignName]) {
    return new Array(NUM_FACETS).fill(0.5);
  }

  let vector = [...ZODIAC_30_BASES[sunSignName]];

  if (moonSignName && ZODIAC_30_BASES[moonSignName]) {
    const moonVec = ZODIAC_30_BASES[moonSignName];
    vector = vector.map((v, i) => 0.7 * v + 0.3 * moonVec[i]);
  }

  if (risingSignName && ZODIAC_30_BASES[risingSignName]) {
    const risingVec = ZODIAC_30_BASES[risingSignName];
    vector = vector.map((v, i) => 0.85 * v + 0.15 * risingVec[i]);
  }

  return vector.map(v => Math.min(1, Math.max(0, v)));
}

// ============================================
// MBTI TO 30 FACETS
// ============================================

export const MBTI_30_BASES = {
  INTJ: [
    0.55, 0.45, 0.50, 0.60, 0.30, 0.50,
    0.45, 0.20, 0.70, 0.55, 0.45, 0.40,
    0.85, 0.65, 0.60, 0.65, 0.95, 0.80,
    0.45, 0.75, 0.45, 0.30, 0.35, 0.45,
    0.90, 0.80, 0.75, 0.90, 0.85, 0.85
  ],
  INTP: [
    0.55, 0.40, 0.50, 0.55, 0.45, 0.50,
    0.40, 0.25, 0.45, 0.45, 0.50, 0.40,
    0.95, 0.60, 0.55, 0.70, 0.98, 0.85,
    0.55, 0.70, 0.40, 0.50, 0.50, 0.45,
    0.75, 0.50, 0.55, 0.65, 0.55, 0.70
  ],
  ENTJ: [
    0.40, 0.55, 0.35, 0.40, 0.45, 0.30,
    0.70, 0.75, 0.95, 0.85, 0.65, 0.70,
    0.70, 0.50, 0.50, 0.75, 0.85, 0.70,
    0.45, 0.80, 0.50, 0.25, 0.25, 0.45,
    0.95, 0.85, 0.80, 0.98, 0.90, 0.80
  ],
  ENTP: [
    0.45, 0.45, 0.40, 0.45, 0.60, 0.40,
    0.75, 0.80, 0.75, 0.80, 0.80, 0.80,
    0.95, 0.55, 0.60, 0.85, 0.95, 0.85,
    0.55, 0.60, 0.50, 0.35, 0.40, 0.50,
    0.75, 0.45, 0.55, 0.75, 0.55, 0.50
  ],
  INFJ: [
    0.65, 0.45, 0.60, 0.65, 0.40, 0.65,
    0.75, 0.40, 0.45, 0.50, 0.40, 0.60,
    0.90, 0.85, 0.90, 0.55, 0.85, 0.80,
    0.80, 0.75, 0.85, 0.70, 0.65, 0.90,
    0.80, 0.70, 0.85, 0.70, 0.75, 0.80
  ],
  INFP: [
    0.70, 0.50, 0.65, 0.70, 0.50, 0.70,
    0.65, 0.35, 0.35, 0.40, 0.45, 0.55,
    0.98, 0.95, 0.98, 0.65, 0.85, 0.85,
    0.80, 0.70, 0.80, 0.75, 0.70, 0.90,
    0.55, 0.40, 0.65, 0.50, 0.45, 0.60
  ],
  ENFJ: [
    0.55, 0.40, 0.45, 0.55, 0.45, 0.55,
    0.95, 0.85, 0.75, 0.75, 0.55, 0.90,
    0.75, 0.75, 0.85, 0.65, 0.70, 0.75,
    0.90, 0.70, 0.95, 0.75, 0.60, 0.95,
    0.80, 0.70, 0.85, 0.75, 0.75, 0.70
  ],
  ENFP: [
    0.55, 0.40, 0.45, 0.50, 0.60, 0.50,
    0.90, 0.85, 0.65, 0.80, 0.80, 0.95,
    0.98, 0.80, 0.90, 0.90, 0.85, 0.90,
    0.80, 0.60, 0.75, 0.55, 0.55, 0.80,
    0.55, 0.35, 0.55, 0.60, 0.40, 0.40
  ],
  ISTJ: [
    0.50, 0.40, 0.45, 0.55, 0.25, 0.45,
    0.50, 0.40, 0.55, 0.55, 0.30, 0.40,
    0.35, 0.50, 0.45, 0.35, 0.60, 0.35,
    0.70, 0.85, 0.60, 0.75, 0.70, 0.60,
    0.95, 0.98, 0.98, 0.80, 0.95, 0.95
  ],
  ISFJ: [
    0.60, 0.40, 0.55, 0.65, 0.35, 0.60,
    0.75, 0.50, 0.40, 0.50, 0.30, 0.60,
    0.45, 0.65, 0.75, 0.35, 0.50, 0.40,
    0.85, 0.75, 0.95, 0.80, 0.75, 0.90,
    0.85, 0.90, 0.95, 0.65, 0.85, 0.85
  ],
  ESTJ: [
    0.45, 0.55, 0.40, 0.45, 0.35, 0.35,
    0.65, 0.70, 0.90, 0.80, 0.45, 0.55,
    0.40, 0.45, 0.40, 0.55, 0.60, 0.40,
    0.60, 0.85, 0.55, 0.50, 0.45, 0.55,
    0.95, 0.95, 0.95, 0.90, 0.90, 0.85
  ],
  ESFJ: [
    0.55, 0.45, 0.50, 0.60, 0.45, 0.55,
    0.90, 0.85, 0.60, 0.70, 0.45, 0.85,
    0.50, 0.65, 0.75, 0.50, 0.50, 0.45,
    0.90, 0.70, 0.95, 0.80, 0.65, 0.90,
    0.80, 0.80, 0.90, 0.65, 0.80, 0.75
  ],
  ISTP: [
    0.40, 0.45, 0.40, 0.45, 0.50, 0.35,
    0.45, 0.35, 0.55, 0.60, 0.65, 0.40,
    0.55, 0.50, 0.45, 0.75, 0.70, 0.60,
    0.50, 0.70, 0.40, 0.45, 0.55, 0.40,
    0.75, 0.55, 0.55, 0.65, 0.60, 0.55
  ],
  ISFP: [
    0.60, 0.45, 0.55, 0.60, 0.50, 0.60,
    0.65, 0.45, 0.35, 0.50, 0.50, 0.60,
    0.80, 0.90, 0.85, 0.70, 0.60, 0.65,
    0.75, 0.60, 0.70, 0.75, 0.70, 0.80,
    0.55, 0.45, 0.60, 0.50, 0.50, 0.55
  ],
  ESTP: [
    0.35, 0.50, 0.30, 0.30, 0.70, 0.25,
    0.75, 0.80, 0.80, 0.90, 0.95, 0.75,
    0.55, 0.45, 0.50, 0.90, 0.55, 0.60,
    0.55, 0.65, 0.50, 0.35, 0.40, 0.45,
    0.70, 0.50, 0.50, 0.75, 0.55, 0.35
  ],
  ESFP: [
    0.45, 0.40, 0.35, 0.40, 0.65, 0.40,
    0.95, 0.95, 0.65, 0.90, 0.90, 0.98,
    0.70, 0.75, 0.80, 0.85, 0.50, 0.60,
    0.75, 0.55, 0.70, 0.60, 0.55, 0.75,
    0.55, 0.40, 0.55, 0.55, 0.40, 0.35
  ]
};

export function mbtiTo30Facets(type) {
  const upperType = type?.toUpperCase();
  return MBTI_30_BASES[upperType] || new Array(NUM_FACETS).fill(0.5);
}

// ============================================
// NUMEROLOGY TO 30 FACETS
// ============================================

export const NUMEROLOGY_30_BASES = {
  1: [ // Leader, Pioneer
    0.45, 0.55, 0.40, 0.35, 0.50, 0.35,
    0.65, 0.60, 0.90, 0.80, 0.70, 0.65,
    0.65, 0.50, 0.55, 0.75, 0.70, 0.65,
    0.50, 0.75, 0.50, 0.30, 0.30, 0.50,
    0.85, 0.70, 0.70, 0.95, 0.80, 0.65
  ],
  2: [ // Diplomat, Peacemaker
    0.60, 0.35, 0.55, 0.65, 0.45, 0.65,
    0.80, 0.65, 0.40, 0.50, 0.40, 0.70,
    0.60, 0.75, 0.80, 0.50, 0.55, 0.55,
    0.85, 0.65, 0.85, 0.85, 0.75, 0.90,
    0.70, 0.70, 0.80, 0.55, 0.70, 0.75
  ],
  3: [ // Creative, Expressive
    0.50, 0.45, 0.40, 0.45, 0.60, 0.45,
    0.85, 0.85, 0.65, 0.80, 0.75, 0.95,
    0.90, 0.85, 0.80, 0.75, 0.70, 0.70,
    0.70, 0.55, 0.65, 0.55, 0.50, 0.65,
    0.60, 0.45, 0.55, 0.70, 0.50, 0.45
  ],
  4: [ // Builder, Practical
    0.55, 0.45, 0.50, 0.55, 0.30, 0.50,
    0.55, 0.50, 0.60, 0.60, 0.35, 0.50,
    0.40, 0.55, 0.50, 0.40, 0.65, 0.40,
    0.70, 0.80, 0.65, 0.75, 0.70, 0.65,
    0.95, 0.95, 0.95, 0.80, 0.95, 0.90
  ],
  5: [ // Freedom, Adventure
    0.45, 0.50, 0.40, 0.40, 0.75, 0.40,
    0.75, 0.80, 0.65, 0.90, 0.95, 0.80,
    0.85, 0.60, 0.65, 0.95, 0.75, 0.80,
    0.60, 0.55, 0.55, 0.40, 0.50, 0.55,
    0.55, 0.35, 0.45, 0.65, 0.40, 0.35
  ],
  6: [ // Nurturer, Responsible
    0.60, 0.45, 0.55, 0.60, 0.45, 0.60,
    0.85, 0.65, 0.50, 0.55, 0.40, 0.75,
    0.55, 0.75, 0.80, 0.50, 0.55, 0.50,
    0.90, 0.70, 0.95, 0.75, 0.65, 0.95,
    0.80, 0.80, 0.90, 0.65, 0.80, 0.75
  ],
  7: [ // Seeker, Analyst
    0.55, 0.40, 0.55, 0.65, 0.35, 0.55,
    0.45, 0.30, 0.45, 0.45, 0.45, 0.45,
    0.95, 0.70, 0.70, 0.60, 0.98, 0.85,
    0.55, 0.70, 0.50, 0.60, 0.65, 0.55,
    0.80, 0.70, 0.70, 0.70, 0.75, 0.85
  ],
  8: [ // Powerhouse, Achiever
    0.45, 0.60, 0.40, 0.40, 0.45, 0.35,
    0.65, 0.65, 0.90, 0.80, 0.60, 0.60,
    0.55, 0.50, 0.50, 0.70, 0.70, 0.55,
    0.50, 0.80, 0.50, 0.30, 0.30, 0.50,
    0.95, 0.80, 0.75, 0.98, 0.90, 0.75
  ],
  9: [ // Humanitarian, Wise
    0.55, 0.40, 0.50, 0.55, 0.50, 0.55,
    0.75, 0.70, 0.55, 0.60, 0.55, 0.70,
    0.80, 0.80, 0.85, 0.70, 0.80, 0.85,
    0.85, 0.70, 0.90, 0.70, 0.65, 0.85,
    0.70, 0.60, 0.75, 0.65, 0.65, 0.70
  ],
  11: [ // Master Intuitive
    0.70, 0.50, 0.60, 0.65, 0.55, 0.70,
    0.70, 0.55, 0.55, 0.55, 0.50, 0.65,
    0.95, 0.90, 0.95, 0.65, 0.90, 0.85,
    0.80, 0.75, 0.80, 0.70, 0.70, 0.90,
    0.75, 0.65, 0.80, 0.70, 0.70, 0.75
  ],
  22: [ // Master Builder
    0.50, 0.50, 0.45, 0.50, 0.40, 0.45,
    0.65, 0.60, 0.75, 0.70, 0.50, 0.60,
    0.75, 0.70, 0.65, 0.75, 0.85, 0.70,
    0.70, 0.80, 0.70, 0.60, 0.55, 0.70,
    0.95, 0.90, 0.90, 0.95, 0.95, 0.85
  ],
  33: [ // Master Teacher
    0.55, 0.40, 0.50, 0.55, 0.50, 0.55,
    0.85, 0.75, 0.60, 0.65, 0.50, 0.80,
    0.80, 0.85, 0.90, 0.65, 0.80, 0.80,
    0.95, 0.75, 0.98, 0.75, 0.65, 0.95,
    0.80, 0.75, 0.90, 0.70, 0.80, 0.75
  ]
};

export function numerologyTo30Facets(lifePath) {
  return NUMEROLOGY_30_BASES[lifePath] || new Array(NUM_FACETS).fill(0.5);
}

// ============================================
// FULL MULTI-SOURCE FUSION TO 30 FACETS
// ============================================

export function fuseAllSourcesTo30Facets(sources = {}) {
  const vectors = [];
  const weights = [];

  // Big Five (if available - ground truth)
  if (sources.big5) {
    const b5 = sources.big5;
    // Direct mapping to 30 facets from 5 domains
    const big5Vec = [
      // N1-N6 from neuroticism
      ...Array(6).fill(b5.neuroticism || 0.5),
      // E1-E6 from extraversion
      ...Array(6).fill(b5.extraversion || 0.5),
      // O1-O6 from openness
      ...Array(6).fill(b5.openness || 0.5),
      // A1-A6 from agreeableness
      ...Array(6).fill(b5.agreeableness || 0.5),
      // C1-C6 from conscientiousness
      ...Array(6).fill(b5.conscientiousness || 0.5)
    ];
    vectors.push(big5Vec);
    weights.push(SOURCE_WEIGHTS.big5);
  }

  // BaZi (P0 Priority - 30% weight)
  // Accepts full baziData object from calculateBaZi()
  if (sources.bazi) {
    vectors.push(baziTo30Facets(sources.bazi));
    weights.push(SOURCE_WEIGHTS.bazi);
  }

  // Enneagram (full depth)
  if (sources.enneagram?.core) {
    const e = sources.enneagram;
    vectors.push(enneagramTo30Facets(e.core, e.wing, e.tritype, e.stacking, e.level));
    weights.push(SOURCE_WEIGHTS.enneagram);
  }

  // MBTI
  if (sources.mbti) {
    vectors.push(mbtiTo30Facets(sources.mbti));
    weights.push(SOURCE_WEIGHTS.mbti);
  }

  // Western Zodiac
  if (sources.natal?.sunSign) {
    vectors.push(zodiacTo30Facets(sources.natal.sunSign, sources.natal.moonSign, sources.natal.risingSign));
    weights.push(SOURCE_WEIGHTS.natal);
  }

  // Numerology
  if (sources.numerology) {
    vectors.push(numerologyTo30Facets(sources.numerology));
    weights.push(SOURCE_WEIGHTS.numerology);
  }

  // If no sources, return neutral
  if (vectors.length === 0) {
    return new Array(NUM_FACETS).fill(0.5);
  }

  // Weighted sum fusion
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const normalized = weights.map(w => w / totalWeight);

  const fused = new Array(NUM_FACETS).fill(0);
  vectors.forEach((vec, idx) => {
    vec.forEach((v, i) => {
      fused[i] += normalized[idx] * v;
    });
  });

  return fused.map(v => Math.min(1, Math.max(0, v)));
}

// ============================================
// EXPORT
// ============================================

export default {
  SOURCE_WEIGHTS,
  baziTo30Facets,
  enneagramTo30Facets,
  zodiacTo30Facets,
  mbtiTo30Facets,
  numerologyTo30Facets,
  fuseAllSourcesTo30Facets,
  ENNEAGRAM_30_BASES,
  ZODIAC_30_BASES,
  MBTI_30_BASES,
  NUMEROLOGY_30_BASES,
  // Brother Sonnet Enhancements
  HEALTH_LEVEL_PROFILES,
  TYPE_LEVEL_SPECIFICS
};
