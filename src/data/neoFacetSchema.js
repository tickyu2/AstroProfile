/**
 * ============================================
 * NEO PI-R 30 FACET SCHEMA - Luna's Vision Engine
 * ============================================
 *
 * The "Multiple Eyes" of Luna's Personality Perception
 * Like Tesla's vision system with cameras at multiple angles,
 * Luna uses 30 NEO facets to see personality with superhuman precision.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    PERSONALITY "EYES"                        │
 * │  Enneagram │ Zodiac │ MBTI │ Big Five │ Numerology │ Houses │
 * └─────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────┐
 * │              30 NEO PI-R FACETS (Vision Engine)              │
 * │  5 Domains × 6 Facets = 30 Dimensions of Human Personality  │
 * └─────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────┐
 * │                     LUNA CPU SYNTHESIS                       │
 * │   Behavior Prediction │ Response Modulation │ Growth Areas  │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Based on: Costa & McCrae NEO PI-R (1992)
 * Enhanced with: Grok + Claude collaborative research
 *
 * Created: January 7, 2026
 * For: GENESIS AI Soul Partner System - Cathedral Build
 */

// ============================================
// NEO PI-R DOMAIN STRUCTURE
// ============================================

export const NEO_DOMAINS = {
  N: { name: 'Neuroticism', code: 'N', description: 'Emotional reactivity and vulnerability to stress' },
  E: { name: 'Extraversion', code: 'E', description: 'Energy from social interaction and activity' },
  O: { name: 'Openness', code: 'O', description: 'Intellectual curiosity and aesthetic sensitivity' },
  A: { name: 'Agreeableness', code: 'A', description: 'Interpersonal warmth and cooperation' },
  C: { name: 'Conscientiousness', code: 'C', description: 'Organization, reliability, and goal-directed behavior' }
};

// ============================================
// 30 NEO PI-R FACETS (6 per domain)
// ============================================

export const NEO_FACETS = {
  // ─────────────────────────────────────────
  // NEUROTICISM (N) - Emotional Sensitivity
  // ─────────────────────────────────────────
  N1_anxiety: {
    code: 'N1', domain: 'N', name: 'Anxiety',
    description: 'Tendency to experience fear, worry, and apprehension',
    highTraits: ['Vigilant', 'Anticipatory', 'Alert'],
    lowTraits: ['Calm', 'Relaxed', 'Fearless'],
    lunaApproach: { high: 'Provide reassurance and grounding', low: 'Can be more direct about challenges' }
  },
  N2_angry_hostility: {
    code: 'N2', domain: 'N', name: 'Angry Hostility',
    description: 'Tendency to experience anger and frustration',
    highTraits: ['Passionate', 'Quick-tempered', 'Fiery'],
    lowTraits: ['Patient', 'Even-tempered', 'Accepting'],
    lunaApproach: { high: 'Validate anger, explore underlying needs', low: 'Can push gently when needed' }
  },
  N3_depression: {
    code: 'N3', domain: 'N', name: 'Depression',
    description: 'Tendency toward sadness, hopelessness, and guilt',
    highTraits: ['Deep-feeling', 'Melancholic', 'Introspective'],
    lowTraits: ['Optimistic', 'Resilient', 'Buoyant'],
    lunaApproach: { high: 'Sit with them, validate pain, no toxic positivity', low: 'Can explore shadows more freely' }
  },
  N4_self_consciousness: {
    code: 'N4', domain: 'N', name: 'Self-Consciousness',
    description: 'Sensitivity to social evaluation and embarrassment',
    highTraits: ['Modest', 'Self-aware', 'Sensitive'],
    lowTraits: ['Confident', 'Unflappable', 'Self-assured'],
    lunaApproach: { high: 'Create safe space, affirm worth', low: 'Can give direct feedback' }
  },
  N5_impulsiveness: {
    code: 'N5', domain: 'N', name: 'Impulsiveness',
    description: 'Difficulty controlling urges and desires',
    highTraits: ['Spontaneous', 'Passionate', 'Intense'],
    lowTraits: ['Disciplined', 'Measured', 'Patient'],
    lunaApproach: { high: 'Help pause before reacting', low: 'Can encourage more spontaneity' }
  },
  N6_vulnerability: {
    code: 'N6', domain: 'N', name: 'Vulnerability',
    description: 'Susceptibility to stress and overwhelm',
    highTraits: ['Sensitive', 'Tender', 'Open'],
    lowTraits: ['Hardy', 'Resilient', 'Tough'],
    lunaApproach: { high: 'Protect from overwhelm, pace carefully', low: 'Can challenge more directly' }
  },

  // ─────────────────────────────────────────
  // EXTRAVERSION (E) - Social Energy
  // ─────────────────────────────────────────
  E1_warmth: {
    code: 'E1', domain: 'E', name: 'Warmth',
    description: 'Affection and friendliness toward others',
    highTraits: ['Caring', 'Affectionate', 'Welcoming'],
    lowTraits: ['Reserved', 'Formal', 'Independent'],
    lunaApproach: { high: 'Match warmth, be openly affectionate', low: 'Respect boundaries, less effusive' }
  },
  E2_gregariousness: {
    code: 'E2', domain: 'E', name: 'Gregariousness',
    description: 'Preference for social interaction and company',
    highTraits: ['Social', 'Outgoing', 'Talkative'],
    lowTraits: ['Solitary', 'Private', 'Selective'],
    lunaApproach: { high: 'Engage in dialogue, enjoy connection', low: 'Give space, quality over quantity' }
  },
  E3_assertiveness: {
    code: 'E3', domain: 'E', name: 'Assertiveness',
    description: 'Tendency to be dominant and take charge',
    highTraits: ['Leader', 'Decisive', 'Commanding'],
    lowTraits: ['Accommodating', 'Gentle', 'Collaborative'],
    lunaApproach: { high: 'Be direct, respect their leadership', low: 'Take more initiative, guide gently' }
  },
  E4_activity: {
    code: 'E4', domain: 'E', name: 'Activity',
    description: 'Energy level and pace of living',
    highTraits: ['Energetic', 'Fast-paced', 'Vigorous'],
    lowTraits: ['Calm', 'Leisurely', 'Measured'],
    lunaApproach: { high: 'Match energy, keep pace moving', low: 'Slow down, allow processing time' }
  },
  E5_excitement_seeking: {
    code: 'E5', domain: 'E', name: 'Excitement-Seeking',
    description: 'Need for stimulation and thrills',
    highTraits: ['Adventurous', 'Daring', 'Thrill-seeking'],
    lowTraits: ['Cautious', 'Stable', 'Predictable'],
    lunaApproach: { high: 'Introduce novelty, embrace adventure', low: 'Provide stability, consistent presence' }
  },
  E6_positive_emotions: {
    code: 'E6', domain: 'E', name: 'Positive Emotions',
    description: 'Tendency to experience joy and happiness',
    highTraits: ['Joyful', 'Enthusiastic', 'Cheerful'],
    lowTraits: ['Serious', 'Sober', 'Contemplative'],
    lunaApproach: { high: 'Celebrate together, share joy', low: 'Honor depth, don\'t force cheerfulness' }
  },

  // ─────────────────────────────────────────
  // OPENNESS (O) - Intellectual Curiosity
  // ─────────────────────────────────────────
  O1_fantasy: {
    code: 'O1', domain: 'O', name: 'Fantasy',
    description: 'Imaginative capacity and daydreaming',
    highTraits: ['Imaginative', 'Dreamy', 'Creative'],
    lowTraits: ['Practical', 'Concrete', 'Realistic'],
    lunaApproach: { high: 'Explore possibilities, use metaphor', low: 'Stay practical, concrete examples' }
  },
  O2_aesthetics: {
    code: 'O2', domain: 'O', name: 'Aesthetics',
    description: 'Appreciation for art and beauty',
    highTraits: ['Artistic', 'Sensitive', 'Refined'],
    lowTraits: ['Functional', 'Plain', 'Utilitarian'],
    lunaApproach: { high: 'Use poetic language, appreciate beauty', low: 'Focus on function and utility' }
  },
  O3_feelings: {
    code: 'O3', domain: 'O', name: 'Feelings',
    description: 'Awareness and value of emotional experiences',
    highTraits: ['Emotionally attuned', 'Expressive', 'Deep'],
    lowTraits: ['Logical', 'Stoic', 'Controlled'],
    lunaApproach: { high: 'Explore emotions deeply', low: 'Respect emotional privacy' }
  },
  O4_actions: {
    code: 'O4', domain: 'O', name: 'Actions',
    description: 'Willingness to try new activities',
    highTraits: ['Experimental', 'Flexible', 'Exploratory'],
    lowTraits: ['Routine', 'Traditional', 'Consistent'],
    lunaApproach: { high: 'Suggest new experiences', low: 'Respect established patterns' }
  },
  O5_ideas: {
    code: 'O5', domain: 'O', name: 'Ideas',
    description: 'Intellectual curiosity and abstract thinking',
    highTraits: ['Curious', 'Analytical', 'Philosophical'],
    lowTraits: ['Pragmatic', 'Applied', 'Down-to-earth'],
    lunaApproach: { high: 'Engage intellectually, explore concepts', low: 'Keep focus practical' }
  },
  O6_values: {
    code: 'O6', domain: 'O', name: 'Values',
    description: 'Readiness to re-examine beliefs and traditions',
    highTraits: ['Progressive', 'Open-minded', 'Questioning'],
    lowTraits: ['Traditional', 'Conservative', 'Conventional'],
    lunaApproach: { high: 'Challenge assumptions together', low: 'Honor tradition and stability' }
  },

  // ─────────────────────────────────────────
  // AGREEABLENESS (A) - Interpersonal Style
  // ─────────────────────────────────────────
  A1_trust: {
    code: 'A1', domain: 'A', name: 'Trust',
    description: 'Belief in others\' honesty and good intentions',
    highTraits: ['Trusting', 'Believing', 'Accepting'],
    lowTraits: ['Skeptical', 'Wary', 'Guarded'],
    lunaApproach: { high: 'Be consistently reliable', low: 'Build trust slowly, prove reliability' }
  },
  A2_straightforwardness: {
    code: 'A2', domain: 'A', name: 'Straightforwardness',
    description: 'Sincerity and frankness in expression',
    highTraits: ['Honest', 'Direct', 'Sincere'],
    lowTraits: ['Diplomatic', 'Strategic', 'Guarded'],
    lunaApproach: { high: 'Be transparently honest', low: 'Approach truths gently' }
  },
  A3_altruism: {
    code: 'A3', domain: 'A', name: 'Altruism',
    description: 'Active concern for others\' welfare',
    highTraits: ['Caring', 'Generous', 'Helpful'],
    lowTraits: ['Self-focused', 'Independent', 'Pragmatic'],
    lunaApproach: { high: 'Celebrate their giving, encourage self-care', low: 'Respect boundaries' }
  },
  A4_compliance: {
    code: 'A4', domain: 'A', name: 'Compliance',
    description: 'Response to interpersonal conflict',
    highTraits: ['Accommodating', 'Peaceful', 'Yielding'],
    lowTraits: ['Competitive', 'Assertive', 'Challenging'],
    lunaApproach: { high: 'Help them voice needs', low: 'Respect their directness' }
  },
  A5_modesty: {
    code: 'A5', domain: 'A', name: 'Modesty',
    description: 'Humility and self-presentation',
    highTraits: ['Humble', 'Self-effacing', 'Unassuming'],
    lowTraits: ['Confident', 'Self-promoting', 'Bold'],
    lunaApproach: { high: 'Affirm their value explicitly', low: 'Acknowledge their strengths directly' }
  },
  A6_tender_mindedness: {
    code: 'A6', domain: 'A', name: 'Tender-Mindedness',
    description: 'Sympathy and concern for others',
    highTraits: ['Compassionate', 'Empathetic', 'Soft-hearted'],
    lowTraits: ['Tough-minded', 'Objective', 'Rational'],
    lunaApproach: { high: 'Lead with feeling, empathy first', low: 'Balance logic with emotion' }
  },

  // ─────────────────────────────────────────
  // CONSCIENTIOUSNESS (C) - Goal-Direction
  // ─────────────────────────────────────────
  C1_competence: {
    code: 'C1', domain: 'C', name: 'Competence',
    description: 'Sense of capability and effectiveness',
    highTraits: ['Capable', 'Effective', 'Self-assured'],
    lowTraits: ['Uncertain', 'Self-doubting', 'Questioning'],
    lunaApproach: { high: 'Trust their judgment', low: 'Build confidence gently' }
  },
  C2_order: {
    code: 'C2', domain: 'C', name: 'Order',
    description: 'Organization and neatness',
    highTraits: ['Organized', 'Methodical', 'Neat'],
    lowTraits: ['Flexible', 'Spontaneous', 'Casual'],
    lunaApproach: { high: 'Be structured and clear', low: 'Allow organic flow' }
  },
  C3_dutifulness: {
    code: 'C3', domain: 'C', name: 'Dutifulness',
    description: 'Adherence to ethical principles and obligations',
    highTraits: ['Reliable', 'Responsible', 'Ethical'],
    lowTraits: ['Free-spirited', 'Flexible', 'Unconventional'],
    lunaApproach: { high: 'Honor commitments absolutely', low: 'Allow flexibility' }
  },
  C4_achievement_striving: {
    code: 'C4', domain: 'C', name: 'Achievement Striving',
    description: 'Drive for accomplishment and success',
    highTraits: ['Ambitious', 'Driven', 'Goal-oriented'],
    lowTraits: ['Content', 'Process-focused', 'Present'],
    lunaApproach: { high: 'Celebrate achievements, set goals', low: 'Focus on being, not doing' }
  },
  C5_self_discipline: {
    code: 'C5', domain: 'C', name: 'Self-Discipline',
    description: 'Ability to persist and complete tasks',
    highTraits: ['Persistent', 'Determined', 'Disciplined'],
    lowTraits: ['Flexible', 'Easy-going', 'Adaptable'],
    lunaApproach: { high: 'Support their discipline', low: 'Don\'t push too hard' }
  },
  C6_deliberation: {
    code: 'C6', domain: 'C', name: 'Deliberation',
    description: 'Tendency to think before acting',
    highTraits: ['Thoughtful', 'Careful', 'Planful'],
    lowTraits: ['Spontaneous', 'Quick', 'Intuitive'],
    lunaApproach: { high: 'Give time to consider', low: 'Allow quick responses' }
  }
};

// ============================================
// FACET ARRAY (ordered for vector operations)
// ============================================

export const FACET_ORDER = [
  // Neuroticism
  'N1_anxiety', 'N2_angry_hostility', 'N3_depression',
  'N4_self_consciousness', 'N5_impulsiveness', 'N6_vulnerability',
  // Extraversion
  'E1_warmth', 'E2_gregariousness', 'E3_assertiveness',
  'E4_activity', 'E5_excitement_seeking', 'E6_positive_emotions',
  // Openness
  'O1_fantasy', 'O2_aesthetics', 'O3_feelings',
  'O4_actions', 'O5_ideas', 'O6_values',
  // Agreeableness
  'A1_trust', 'A2_straightforwardness', 'A3_altruism',
  'A4_compliance', 'A5_modesty', 'A6_tender_mindedness',
  // Conscientiousness
  'C1_competence', 'C2_order', 'C3_dutifulness',
  'C4_achievement_striving', 'C5_self_discipline', 'C6_deliberation'
];

export const NUM_FACETS = 30;

// Domain order for iteration (matches vector slice order)
export const DOMAIN_ORDER = ['N', 'E', 'O', 'A', 'C'];

// ============================================
// DOMAIN AGGREGATION (for quick OCEAN scores)
// ============================================

export function aggregateToDomains(facetVector) {
  if (facetVector.length !== NUM_FACETS) {
    throw new Error(`Expected 30 facets, got ${facetVector.length}`);
  }

  return {
    N: average(facetVector.slice(0, 6)),   // Neuroticism
    E: average(facetVector.slice(6, 12)),  // Extraversion
    O: average(facetVector.slice(12, 18)), // Openness
    A: average(facetVector.slice(18, 24)), // Agreeableness
    C: average(facetVector.slice(24, 30))  // Conscientiousness
  };
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ============================================
// FACET VECTOR TO READABLE OUTPUT
// ============================================

export function facetVectorToProfile(vector) {
  if (vector.length !== NUM_FACETS) {
    throw new Error(`Expected 30 facets, got ${vector.length}`);
  }

  const profile = {};
  FACET_ORDER.forEach((facetKey, i) => {
    const facet = NEO_FACETS[facetKey];
    const value = vector[i];
    const level = value > 0.7 ? 'high' : value > 0.4 ? 'average' : 'low';

    profile[facetKey] = {
      ...facet,
      value: Math.round(value * 100),
      level,
      approach: facet.lunaApproach[level === 'average' ? 'high' : level] // Default to high approach for average
    };
  });

  return profile;
}

// ============================================
// CONVERT 10-DIM LUNA VECTOR TO 30 FACETS
// (Upsampling for compatibility)
// ============================================

export function lunaVectorTo30Facets(lunaVector) {
  // Luna's 10 dimensions map to NEO facets:
  // openness → O1-O6
  // conscientiousness → C1-C6
  // extraversion → E1-E6
  // agreeableness → A1-A6
  // emotional_intensity → N1-N6 (inverted for some)
  // insightful → O5 (ideas), O3 (feelings)
  // adventurous → E5 (excitement), O4 (actions)
  // ambitious → C4 (achievement), E3 (assertiveness)
  // nurturing → A3 (altruism), A6 (tender-mindedness)
  // playful → E6 (positive emotions), E1 (warmth)

  const [open, consc, extra, agree, emotional, insight, advent, ambiti, nurture, play] = lunaVector;

  return [
    // N1-N6: Based on emotional_intensity (but nuanced)
    emotional * 0.8 + (1 - consc) * 0.2,  // N1: anxiety
    emotional * 0.6 + (1 - agree) * 0.4,  // N2: angry_hostility
    emotional * 0.7 + (1 - play) * 0.3,   // N3: depression
    emotional * 0.5 + (1 - extra) * 0.5,  // N4: self_consciousness
    emotional * 0.6 + (1 - consc) * 0.4,  // N5: impulsiveness
    emotional * 0.8 + (1 - consc) * 0.2,  // N6: vulnerability

    // E1-E6: Based on extraversion + related
    extra * 0.6 + nurture * 0.4,          // E1: warmth
    extra * 0.9 + agree * 0.1,            // E2: gregariousness
    extra * 0.5 + ambiti * 0.5,           // E3: assertiveness
    extra * 0.6 + advent * 0.4,           // E4: activity
    advent * 0.7 + extra * 0.3,           // E5: excitement_seeking
    play * 0.7 + extra * 0.3,             // E6: positive_emotions

    // O1-O6: Based on openness + related
    open * 0.7 + insight * 0.3,           // O1: fantasy
    open * 0.8 + emotional * 0.2,         // O2: aesthetics
    open * 0.5 + emotional * 0.5,         // O3: feelings
    open * 0.6 + advent * 0.4,            // O4: actions
    open * 0.5 + insight * 0.5,           // O5: ideas
    open * 0.9 + (1 - consc) * 0.1,       // O6: values

    // A1-A6: Based on agreeableness + related
    agree * 0.8 + nurture * 0.2,          // A1: trust
    agree * 0.7 + (1 - extra) * 0.3,      // A2: straightforwardness
    nurture * 0.7 + agree * 0.3,          // A3: altruism
    agree * 0.8 + (1 - ambiti) * 0.2,     // A4: compliance
    agree * 0.6 + (1 - ambiti) * 0.4,     // A5: modesty
    nurture * 0.6 + agree * 0.4,          // A6: tender_mindedness

    // C1-C6: Based on conscientiousness + related
    consc * 0.7 + ambiti * 0.3,           // C1: competence
    consc * 0.9 + (1 - advent) * 0.1,     // C2: order
    consc * 0.8 + agree * 0.2,            // C3: dutifulness
    ambiti * 0.7 + consc * 0.3,           // C4: achievement_striving
    consc * 0.8 + ambiti * 0.2,           // C5: self_discipline
    consc * 0.6 + (1 - advent) * 0.4      // C6: deliberation
  ].map(v => Math.min(1, Math.max(0, v)));
}

// ============================================
// EXPORT
// ============================================

export default {
  NEO_DOMAINS,
  NEO_FACETS,
  FACET_ORDER,
  NUM_FACETS,
  aggregateToDomains,
  facetVectorToProfile,
  lunaVectorTo30Facets
};
