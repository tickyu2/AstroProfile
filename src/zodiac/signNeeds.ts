/**
 * Sign Needs - Susan Miller-style Needs Mapping
 *
 * Each sign has core needs, stress signals, bonding language,
 * and conflict style. This powers the Self Analysis and
 * Compatibility narrative engine.
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey } from './tropicalMap';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface NeedProfile {
  coreNeeds: string[];        // What this sign needs to feel good
  stressSignals: string[];    // What shows up when needs aren't met
  bondingLanguage: string[];  // What makes them attach
  conflictStyle: string;      // Their default conflict behavior
  emotionalNeeds: string[];   // Deep emotional requirements (for Moon)
  socialStyle: string;        // How they present to the world (for Rising)
}

// =============================================================================
// SIGN NEEDS DATA
// =============================================================================

export const SIGN_NEEDS: Record<SignKey, NeedProfile> = {
  Aries: {
    coreNeeds: ['Momentum', 'Autonomy', 'Challenge', 'Directness'],
    stressSignals: ['Impatience', 'Irritability', 'Boredom', 'Picking fights to feel alive'],
    bondingLanguage: ['Cheering me on', 'Letting me lead sometimes', 'Fast forgiveness'],
    conflictStyle: 'Direct and fast—wants resolution now, not later.',
    emotionalNeeds: ['Excitement', 'Recognition of courage', 'Freedom to act', 'Admiration'],
    socialStyle: 'Bold first impression. Comes across as confident, direct, sometimes impatient.',
  },

  Taurus: {
    coreNeeds: ['Stability', 'Consistency', 'Touch and comfort', 'Practical trust'],
    stressSignals: ['Stubbornness', 'Withdrawal', 'Possessiveness', 'Silent resistance'],
    bondingLanguage: ['Reliability', 'Quality time', 'Sensual care', 'Material follow-through'],
    conflictStyle: 'Slow to engage, slow to change—needs time, proof, and calm.',
    emotionalNeeds: ['Security', 'Physical affection', 'Predictability', 'Loyalty'],
    socialStyle: 'Calm, grounded presence. Appears steady, reliable, sometimes reserved.',
  },

  Gemini: {
    coreNeeds: ['Conversation', 'Variety', 'Mental stimulation', 'Freedom to explore'],
    stressSignals: ['Restlessness', 'Deflection', 'Mixed signals', 'Over-rationalizing feelings'],
    bondingLanguage: ['Playful dialogue', 'Shared curiosity', 'Lightness + honesty'],
    conflictStyle: 'Talks it out—can intellectualize unless you anchor feelings.',
    emotionalNeeds: ['Mental connection', 'Novelty', 'Being heard', 'Flexibility'],
    socialStyle: 'Witty, adaptable, curious. Appears friendly, talkative, sometimes scattered.',
  },

  Cancer: {
    coreNeeds: ['Safety', 'Emotional attunement', 'Belonging', 'Loyalty'],
    stressSignals: ['Defensiveness', 'Mood swings', 'Retreating', 'Testing loyalty'],
    bondingLanguage: ['Protection', 'Consistency', 'Being remembered', 'Gentle reassurance'],
    conflictStyle: 'Indirect at first—needs softness to open, then can be intense.',
    emotionalNeeds: ['Nurturing', 'Home base', 'Emotional reciprocity', 'Memory and tradition'],
    socialStyle: 'Warm but guarded. Appears caring, protective, sometimes moody.',
  },

  Leo: {
    coreNeeds: ['Recognition', 'Warmth', 'Loyalty', 'Creative expression'],
    stressSignals: ['Pride wounds', 'Drama', 'Controlling the spotlight', 'Withholding affection'],
    bondingLanguage: ['Admiration', 'Public support', 'Celebration', 'Play'],
    conflictStyle: 'Heart-led—needs respect; thrives with apology + appreciation.',
    emotionalNeeds: ['Adoration', 'Creative outlet', 'Generosity received', 'Being special'],
    socialStyle: 'Radiant, confident, magnetic. Appears warm, dramatic, sometimes attention-seeking.',
  },

  Virgo: {
    coreNeeds: ['Order', 'Competence', 'Usefulness', 'Clean communication'],
    stressSignals: ['Criticism', 'Anxiety', 'Overwork', 'Fixing others'],
    bondingLanguage: ['Practical help', 'Small acts of care', 'Reliability', 'Clarity'],
    conflictStyle: 'Analytical—can nitpick unless the emotional need is named clearly.',
    emotionalNeeds: ['Being appreciated', 'Purpose', 'Health and routine', 'Perfection tolerated'],
    socialStyle: 'Helpful, precise, modest. Appears analytical, reserved, sometimes critical.',
  },

  Libra: {
    coreNeeds: ['Harmony', 'Fairness', 'Mutuality', 'Beauty'],
    stressSignals: ['Indecision', 'People-pleasing', 'Resentment', 'Avoiding hard talks'],
    bondingLanguage: ['Thoughtful gestures', 'Respectful dialogue', 'Shared aesthetic life'],
    conflictStyle: 'Seeks balance—will engage if it feels safe and fair.',
    emotionalNeeds: ['Partnership', 'Peace', 'Appreciation of taste', 'Being chosen'],
    socialStyle: 'Charming, diplomatic, graceful. Appears pleasant, refined, sometimes indecisive.',
  },

  Scorpio: {
    coreNeeds: ['Trust', 'Depth', 'Loyalty', 'Emotional truth'],
    stressSignals: ['Control', 'Jealousy', 'Withholding', 'All-or-nothing tests'],
    bondingLanguage: ['Confidential intimacy', 'Consistency under pressure', 'Soul honesty'],
    conflictStyle: 'Intense—wants the truth; will burn illusions down to rebuild trust.',
    emotionalNeeds: ['Absolute loyalty', 'Transformation', 'Power shared', 'Deep merging'],
    socialStyle: 'Magnetic, intense, private. Appears mysterious, powerful, sometimes intimidating.',
  },

  Sagittarius: {
    coreNeeds: ['Freedom', 'Meaning', 'Adventure', 'Hope'],
    stressSignals: ['Escapism', 'Bluntness', 'Commitment fear', 'Restless dissatisfaction'],
    bondingLanguage: ['Shared vision', 'Room to roam', 'Laughing together', 'Big plans'],
    conflictStyle: 'Avoids heaviness—engages best with perspective and future-oriented repair.',
    emotionalNeeds: ['Expansion', 'Optimism', 'Truth', 'Philosophical connection'],
    socialStyle: 'Enthusiastic, optimistic, adventurous. Appears friendly, restless, sometimes preachy.',
  },

  Capricorn: {
    coreNeeds: ['Respect', 'Structure', 'Reliability', 'Long-term security'],
    stressSignals: ['Coldness', 'Workaholism', 'Rigidity', 'Withdrawing into duty'],
    bondingLanguage: ['Consistency', 'Competence', 'Shared goals', 'Earned trust'],
    conflictStyle: 'Measured—wants a plan; softens when effort is visible and steady.',
    emotionalNeeds: ['Achievement', 'Status', 'Being relied upon', 'Legacy'],
    socialStyle: 'Professional, ambitious, reserved. Appears serious, capable, sometimes cold.',
  },

  Aquarius: {
    coreNeeds: ['Independence', 'Friendship', 'Ideas', 'Space'],
    stressSignals: ['Detachment', 'Contrarianism', 'Avoiding vulnerability', 'Disappearing'],
    bondingLanguage: ['Mental resonance', 'Respecting autonomy', 'Shared causes', 'Humor'],
    conflictStyle: 'Abstract—needs you to name emotions without trapping them.',
    emotionalNeeds: ['Uniqueness', 'Community', 'Innovation', 'Unconditional acceptance'],
    socialStyle: 'Unique, friendly, detached. Appears progressive, eccentric, sometimes aloof.',
  },

  Pisces: {
    coreNeeds: ['Compassion', 'Inspiration', 'Spiritual meaning', 'Gentle connection'],
    stressSignals: ['Escapism', 'Boundary blur', 'Martyrdom', 'Emotional flooding'],
    bondingLanguage: ['Tenderness', 'Being understood', 'Shared art/dreaming', 'Kindness'],
    conflictStyle: 'Sensitive—needs soft containment and clear boundaries to stay present.',
    emotionalNeeds: ['Transcendence', 'Unconditional love', 'Creative flow', 'Merging'],
    socialStyle: 'Dreamy, compassionate, adaptable. Appears gentle, artistic, sometimes vague.',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the needs profile for a sign
 */
export function getSignNeeds(sign: SignKey): NeedProfile {
  return SIGN_NEEDS[sign];
}

/**
 * Get core needs as a formatted string
 */
export function formatCoreNeeds(sign: SignKey): string {
  const needs = SIGN_NEEDS[sign];
  return needs.coreNeeds.join(', ');
}

/**
 * Get bonding language as a formatted string
 */
export function formatBondingLanguage(sign: SignKey): string {
  const needs = SIGN_NEEDS[sign];
  return needs.bondingLanguage.join(', ');
}

/**
 * Check if two signs have compatible core needs
 */
export function needsCompatibility(signA: SignKey, signB: SignKey): {
  shared: string[];
  complementary: string[];
  tension: string[];
} {
  const needsA = SIGN_NEEDS[signA];
  const needsB = SIGN_NEEDS[signB];

  // Find shared needs
  const shared = needsA.coreNeeds.filter(n =>
    needsB.coreNeeds.some(bn => bn.toLowerCase().includes(n.toLowerCase().split(' ')[0]))
  );

  // Complementary needs (one's bonding language matches other's core need)
  const complementary: string[] = [];
  needsA.bondingLanguage.forEach(bl => {
    if (needsB.coreNeeds.some(cn => cn.toLowerCase().includes(bl.toLowerCase().split(' ')[0]))) {
      complementary.push(`${signA} offers "${bl}" which ${signB} needs`);
    }
  });
  needsB.bondingLanguage.forEach(bl => {
    if (needsA.coreNeeds.some(cn => cn.toLowerCase().includes(bl.toLowerCase().split(' ')[0]))) {
      complementary.push(`${signB} offers "${bl}" which ${signA} needs`);
    }
  });

  // Tension points (stress signals that might clash)
  const tension: string[] = [];
  if (needsA.stressSignals.includes('Impatience') && needsB.coreNeeds.includes('Stability')) {
    tension.push(`${signA}'s impatience may clash with ${signB}'s need for stability`);
  }
  if (needsA.stressSignals.includes('Detachment') && needsB.coreNeeds.includes('Emotional attunement')) {
    tension.push(`${signA}'s detachment may frustrate ${signB}'s emotional needs`);
  }

  return { shared, complementary, tension };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default SIGN_NEEDS;
