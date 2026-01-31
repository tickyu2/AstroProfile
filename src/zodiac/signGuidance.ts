/**
 * Sign Guidance - Deep Behavioral Profiles for Relationship Guidance
 *
 * Susan Miller-style actionable guidance for each sign:
 * - Daily needs
 * - Appreciation triggers
 * - Stress behaviors
 * - Repair strategies
 * - What NOT to do
 * - Growth practices
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey } from './tropicalMap';

// =============================================================================
// TYPES
// =============================================================================

export interface SignGuidance {
  dailyNeeds: string[];
  appreciationTriggers: string[];
  stressBehaviors: string[];
  repairStrategies: string[];
  doNotDo: string[];
  growthPractices: string[];
  loveLanguages: string[];
  conflictStyle: string;
  processingSpeed: 'fast' | 'moderate' | 'slow';
}

// =============================================================================
// SIGN GUIDANCE DATA - ALL 12 SIGNS
// =============================================================================

export const SIGN_GUIDANCE: Record<SignKey, SignGuidance> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // FIRE SIGNS
  // ═══════════════════════════════════════════════════════════════════════════

  Aries: {
    dailyNeeds: [
      'Momentum and forward movement',
      'Autonomy and personal choice',
      'Direct, honest communication',
      'Physical activity or outlet for energy',
      'New challenges to conquer',
    ],
    appreciationTriggers: [
      'Acknowledging their courage and initiative',
      'Letting them take the lead',
      'Fast forgiveness after conflicts',
      'Celebrating their wins enthusiastically',
      'Matching their energy and passion',
    ],
    stressBehaviors: [
      'Impatience and irritability',
      'Picking fights to feel alive',
      'Abrupt emotional exits',
      'Making impulsive decisions',
      'Becoming competitive or aggressive',
    ],
    repairStrategies: [
      'Address conflict immediately and directly',
      'Name the issue plainly without dancing around it',
      'End with action, not endless analysis',
      'Physical reconnection (hug, touch)',
      'Give them a win or acknowledge their point',
    ],
    doNotDo: [
      'Micromanage or control them',
      'Delay decisions indefinitely',
      'Use passive-aggressive communication',
      'Make them wait without explanation',
      'Criticize their enthusiasm',
    ],
    growthPractices: [
      'Pause 5 seconds before reacting',
      'Ask before acting on big decisions',
      'Channel anger into movement (walk, exercise)',
      'Practice listening without interrupting',
      'Count to 10 when frustrated',
    ],
    loveLanguages: ['Words of Affirmation', 'Physical Touch', 'Quality Time'],
    conflictStyle: 'Direct confrontation, wants immediate resolution',
    processingSpeed: 'fast',
  },

  Leo: {
    dailyNeeds: [
      'Recognition and appreciation',
      'Creative self-expression',
      'Warmth and affection',
      'Opportunities to be generous',
      'Feeling special and valued',
    ],
    appreciationTriggers: [
      'Public acknowledgment of their contributions',
      'Genuine compliments (not flattery)',
      'Being treated as important',
      'Allowing them to shine',
      'Celebrating their creativity',
    ],
    stressBehaviors: [
      'Dramatic reactions',
      'Needing excessive reassurance',
      'Becoming bossy or demanding',
      'Sulking when ignored',
      'Overcompensating with bravado',
    ],
    repairStrategies: [
      'Acknowledge their feelings are valid',
      'Offer genuine (not empty) praise',
      'Show you still respect them',
      'Plan something special together',
      'Physical warmth and affection',
    ],
    doNotDo: [
      'Embarrass them publicly',
      'Ignore or dismiss their feelings',
      'Be cold or withholding affection',
      'Compete with them for attention',
      'Criticize them in front of others',
    ],
    growthPractices: [
      'Practice letting others shine',
      'Give compliments without expecting return',
      'Listen more than you speak',
      'Find confidence from within, not applause',
      'Celebrate others\' wins genuinely',
    ],
    loveLanguages: ['Words of Affirmation', 'Physical Touch', 'Gifts'],
    conflictStyle: 'Dramatic expression, needs to feel heard and respected',
    processingSpeed: 'moderate',
  },

  Sagittarius: {
    dailyNeeds: [
      'Freedom and space to explore',
      'Intellectual stimulation',
      'Optimism and humor',
      'Adventure and variety',
      'Honest, philosophical conversation',
    ],
    appreciationTriggers: [
      'Joining their adventures',
      'Laughing at their jokes',
      'Engaging with their ideas',
      'Giving them space without jealousy',
      'Being spontaneous with them',
    ],
    stressBehaviors: [
      'Becoming preachy or know-it-all',
      'Emotional avoidance through humor',
      'Flight response (literally leaving)',
      'Overpromising and underdelivering',
      'Blunt tactlessness',
    ],
    repairStrategies: [
      'Keep it light initially',
      'Use humor to bridge tension',
      'Give space, then reconnect',
      'Focus on the bigger picture together',
      'Plan a future adventure',
    ],
    doNotDo: [
      'Trap them or be possessive',
      'Take everything too seriously',
      'Demand constant togetherness',
      'Be pessimistic or cynical',
      'Restrict their freedom or interests',
    ],
    growthPractices: [
      'Follow through on commitments',
      'Be present instead of planning escape',
      'Practice emotional depth over wit',
      'Listen without immediately advising',
      'Stay when things get uncomfortable',
    ],
    loveLanguages: ['Quality Time', 'Words of Affirmation', 'Acts of Service'],
    conflictStyle: 'Avoids heavy emotions, prefers to laugh it off or leave',
    processingSpeed: 'fast',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EARTH SIGNS
  // ═══════════════════════════════════════════════════════════════════════════

  Taurus: {
    dailyNeeds: [
      'Consistency and reliability',
      'Physical comfort and sensory pleasure',
      'Predictable routines',
      'Financial security awareness',
      'Quality time without rushing',
    ],
    appreciationTriggers: [
      'Reliability and keeping promises',
      'Quality time (not multitasking)',
      'Sensory care (good food, touch, comfort)',
      'Patience with their pace',
      'Acknowledging their stability',
    ],
    stressBehaviors: [
      'Stubborn withdrawal',
      'Silent resistance',
      'Digging in heels on minor issues',
      'Overindulgence (food, spending)',
      'Complete shutdown',
    ],
    repairStrategies: [
      'Slow the pace dramatically',
      'Offer physical comfort (food, touch)',
      'Give them time to process (24-72 hours)',
      'Reassure about security and stability',
      'Come back calmly after cooling off',
    ],
    doNotDo: [
      'Force sudden change',
      'Threaten the relationship when upset',
      'Rush emotional decisions',
      'Criticize their pace as "slow"',
      'Make them feel financially insecure',
    ],
    growthPractices: [
      'Practice flexibility with small changes',
      'Name fears instead of resisting',
      'Try one new thing weekly',
      'Express feelings before they build up',
      'Let go of minor control needs',
    ],
    loveLanguages: ['Physical Touch', 'Quality Time', 'Acts of Service'],
    conflictStyle: 'Avoids until cornered, then immovable; needs time',
    processingSpeed: 'slow',
  },

  Virgo: {
    dailyNeeds: [
      'Order and organization',
      'Feeling useful and competent',
      'Health and wellness attention',
      'Intellectual engagement',
      'Clear communication and plans',
    ],
    appreciationTriggers: [
      'Noticing their helpful efforts',
      'Asking for their advice',
      'Keeping shared spaces organized',
      'Following through on plans',
      'Acknowledging their intelligence',
    ],
    stressBehaviors: [
      'Hypercritical (of self and others)',
      'Anxiety spiraling',
      'Nitpicking small details',
      'Withdrawing into work',
      'Physical symptoms (stomach, nerves)',
    ],
    repairStrategies: [
      'Be specific about what you\'ll do differently',
      'Create a concrete plan together',
      'Acknowledge their valid points',
      'Help them see the bigger picture',
      'Physical acts of service (make tea, tidy up)',
    ],
    doNotDo: [
      'Be vague or unreliable',
      'Criticize their criticism',
      'Make messes in shared spaces',
      'Dismiss their concerns as "overthinking"',
      'Be chronically late or disorganized',
    ],
    growthPractices: [
      'Practice "good enough" instead of perfect',
      'Express appreciation before suggestions',
      'Let some things be messy',
      'Focus on strengths, not flaws',
      'Accept help without micromanaging',
    ],
    loveLanguages: ['Acts of Service', 'Words of Affirmation', 'Quality Time'],
    conflictStyle: 'Analytical, wants to dissect and solve; can seem cold',
    processingSpeed: 'moderate',
  },

  Capricorn: {
    dailyNeeds: [
      'Progress toward goals',
      'Respect and being taken seriously',
      'Structure and planning',
      'Quality over quantity',
      'Practical demonstrations of love',
    ],
    appreciationTriggers: [
      'Respecting their ambitions',
      'Being reliable and responsible',
      'Acknowledging their achievements',
      'Supporting their long-term vision',
      'Practical help, not just words',
    ],
    stressBehaviors: [
      'Overworking to avoid feelings',
      'Becoming cold or distant',
      'Pessimistic or fatalistic thinking',
      'Control and micromanagement',
      'Emotional shutdown',
    ],
    repairStrategies: [
      'Give them space to regain composure',
      'Approach with practical solutions',
      'Show commitment through actions',
      'Respect their boundaries',
      'Schedule a time to talk (not ambush)',
    ],
    doNotDo: [
      'Be flaky or unreliable',
      'Waste their time',
      'Be publicly emotional or dramatic',
      'Dismiss their career as "just work"',
      'Force vulnerability before trust is built',
    ],
    growthPractices: [
      'Schedule fun, not just work',
      'Express feelings in words, not just actions',
      'Ask for help sometimes',
      'Celebrate milestones, not just endpoints',
      'Practice playfulness and spontaneity',
    ],
    loveLanguages: ['Acts of Service', 'Quality Time', 'Physical Touch'],
    conflictStyle: 'Strategic retreat, returns with practical proposal',
    processingSpeed: 'slow',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AIR SIGNS
  // ═══════════════════════════════════════════════════════════════════════════

  Gemini: {
    dailyNeeds: [
      'Mental stimulation and variety',
      'Freedom to communicate',
      'Social interaction',
      'Learning something new',
      'Flexibility and options',
    ],
    appreciationTriggers: [
      'Engaging with their ideas',
      'Being a good conversation partner',
      'Keeping things interesting',
      'Flexibility with plans',
      'Appreciating their wit and intelligence',
    ],
    stressBehaviors: [
      'Scattered and unfocused',
      'Talking excessively without listening',
      'Nervous energy and restlessness',
      'Avoiding emotional depth',
      'Changing topics to escape',
    ],
    repairStrategies: [
      'Talk it through (they need to verbalize)',
      'Offer perspective, not ultimatums',
      'Keep it light initially',
      'Text or write if verbal feels too intense',
      'Give them information, not just feelings',
    ],
    doNotDo: [
      'Be boring or repetitive',
      'Demand constant emotional depth',
      'Restrict their social life',
      'Take their flirty nature too seriously',
      'Refuse to communicate',
    ],
    growthPractices: [
      'Practice active listening',
      'Finish one thing before starting another',
      'Stay present in emotional conversations',
      'Follow through on commitments',
      'Go deeper instead of wider',
    ],
    loveLanguages: ['Words of Affirmation', 'Quality Time', 'Gifts'],
    conflictStyle: 'Wants to talk it out immediately, may intellectualize',
    processingSpeed: 'fast',
  },

  Libra: {
    dailyNeeds: [
      'Harmony and balance',
      'Partnership and togetherness',
      'Beauty and aesthetics',
      'Fairness and justice',
      'Social connection',
    ],
    appreciationTriggers: [
      'Making things beautiful together',
      'Being a true partner',
      'Considering their perspective',
      'Romantic gestures',
      'Valuing their opinion',
    ],
    stressBehaviors: [
      'Indecisiveness paralysis',
      'People-pleasing at own expense',
      'Passive-aggressive behavior',
      'Avoiding all conflict',
      'Saying "fine" when not fine',
    ],
    repairStrategies: [
      'Create a calm, beautiful environment to talk',
      'Emphasize fairness for both sides',
      'Don\'t force immediate decisions',
      'Acknowledge their perspective first',
      'Find the compromise together',
    ],
    doNotDo: [
      'Be crude or aggressive',
      'Force them to choose sides',
      'Create unnecessary conflict',
      'Dismiss their need for balance',
      'Make unilateral decisions',
    ],
    growthPractices: [
      'Make decisions and stick with them',
      'Express your own needs clearly',
      'Tolerate temporary disharmony',
      'Say no when needed',
      'Accept that not everyone will like you',
    ],
    loveLanguages: ['Quality Time', 'Words of Affirmation', 'Gifts'],
    conflictStyle: 'Avoids until forced, then seeks diplomatic resolution',
    processingSpeed: 'slow',
  },

  Aquarius: {
    dailyNeeds: [
      'Intellectual freedom',
      'Space for individuality',
      'Causes bigger than self',
      'Friendship within romance',
      'Innovation and unconventionality',
    ],
    appreciationTriggers: [
      'Respecting their uniqueness',
      'Engaging with their ideas',
      'Giving them space',
      'Being a friend first',
      'Supporting their causes',
    ],
    stressBehaviors: [
      'Emotional detachment',
      'Becoming contrarian',
      'Intellectualizing feelings away',
      'Isolating completely',
      'Cold, aloof responses',
    ],
    repairStrategies: [
      'Give space before talking',
      'Approach as friends, not adversaries',
      'Appeal to fairness and logic',
      'Don\'t demand emotional displays',
      'Discuss, don\'t accuse',
    ],
    doNotDo: [
      'Be possessive or jealous',
      'Demand conventional behavior',
      'Force emotional vulnerability',
      'Take their independence personally',
      'Try to change their uniqueness',
    ],
    growthPractices: [
      'Practice emotional presence',
      'Show warmth, not just interest',
      'Be consistently available',
      'Express feelings, not just thoughts',
      'Value intimacy as much as friendship',
    ],
    loveLanguages: ['Quality Time', 'Acts of Service', 'Words of Affirmation'],
    conflictStyle: 'Detached analysis, needs to understand "why" logically',
    processingSpeed: 'moderate',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WATER SIGNS
  // ═══════════════════════════════════════════════════════════════════════════

  Cancer: {
    dailyNeeds: [
      'Emotional security and reassurance',
      'Home and comfort',
      'Nurturing and being nurtured',
      'Family connection',
      'Memory and tradition',
    ],
    appreciationTriggers: [
      'Remembering important things',
      'Creating home together',
      'Physical affection and comfort',
      'Including them in your inner world',
      'Protecting and being protective',
    ],
    stressBehaviors: [
      'Retreating into shell',
      'Mood swings',
      'Indirect communication (hints, sighs)',
      'Bringing up past hurts',
      'Emotional flooding',
    ],
    repairStrategies: [
      'Provide physical comfort first',
      'Acknowledge their feelings are valid',
      'Don\'t logic them out of emotions',
      'Be patient with processing time',
      'Reassure about the relationship',
    ],
    doNotDo: [
      'Dismiss their emotions as "too much"',
      'Threaten to leave during arguments',
      'Be cold or withholding',
      'Forget important dates/memories',
      'Criticize their family',
    ],
    growthPractices: [
      'Express needs directly (not through hints)',
      'Self-soothe before seeking reassurance',
      'Stay present instead of revisiting past',
      'Set boundaries even when uncomfortable',
      'Trust others with your vulnerability',
    ],
    loveLanguages: ['Quality Time', 'Physical Touch', 'Acts of Service'],
    conflictStyle: 'Withdraws first, then emotional expression; needs safety',
    processingSpeed: 'moderate',
  },

  Scorpio: {
    dailyNeeds: [
      'Depth and authenticity',
      'Emotional honesty',
      'Privacy and trust',
      'Intensity and passion',
      'Loyalty and commitment',
    ],
    appreciationTriggers: [
      'Complete honesty (even uncomfortable)',
      'Loyalty and dedication',
      'Matching their intensity',
      'Keeping their secrets',
      'Seeing beneath their surface',
    ],
    stressBehaviors: [
      'Suspicion and jealousy',
      'Emotional manipulation',
      'Silent treatment (punishment)',
      'Obsessive thinking',
      'All-or-nothing reactions',
    ],
    repairStrategies: [
      'Be completely honest (they sense lies)',
      'Show consistent loyalty over time',
      'Don\'t minimize their feelings',
      'Give space but don\'t abandon',
      'Prove trustworthiness through actions',
    ],
    doNotDo: [
      'Lie or hide things (even small)',
      'Betray their trust in any way',
      'Be superficial or fake',
      'Expose their vulnerabilities to others',
      'Dismiss their intensity as "drama"',
    ],
    growthPractices: [
      'Trust before having all the evidence',
      'Forgive instead of holding grudges',
      'Share vulnerability instead of testing',
      'Let go of need to control',
      'Practice lightness occasionally',
    ],
    loveLanguages: ['Physical Touch', 'Quality Time', 'Acts of Service'],
    conflictStyle: 'Probes for truth, can be intense; needs complete honesty',
    processingSpeed: 'slow',
  },

  Pisces: {
    dailyNeeds: [
      'Emotional connection and empathy',
      'Creative and spiritual expression',
      'Escape and fantasy time',
      'Gentleness and compassion',
      'Being understood without explaining',
    ],
    appreciationTriggers: [
      'Understanding without judgment',
      'Creative collaboration',
      'Gentle physical affection',
      'Protecting them from harsh realities',
      'Believing in their dreams',
    ],
    stressBehaviors: [
      'Escapism (sleep, substances, fantasy)',
      'Playing victim',
      'Boundary dissolution',
      'Absorbing others\' emotions',
      'Vagueness and avoidance',
    ],
    repairStrategies: [
      'Be gentle and compassionate',
      'Don\'t demand logic or plans immediately',
      'Create safe, quiet space',
      'Show unconditional acceptance',
      'Express love through care, not critique',
    ],
    doNotDo: [
      'Be harsh or critical',
      'Dismiss their intuition',
      'Force them into hard realities abruptly',
      'Mistake kindness for weakness',
      'Take advantage of their giving nature',
    ],
    growthPractices: [
      'Maintain clear boundaries',
      'Ground yourself in reality daily',
      'Distinguish your feelings from others\'',
      'Express needs instead of sacrificing',
      'Take action on dreams, not just dream',
    ],
    loveLanguages: ['Quality Time', 'Physical Touch', 'Words of Affirmation'],
    conflictStyle: 'Absorbs tension, may withdraw; needs gentleness',
    processingSpeed: 'moderate',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get guidance for a specific sign
 */
export function getSignGuidance(sign: SignKey): SignGuidance {
  return SIGN_GUIDANCE[sign];
}

/**
 * Get the primary daily need for a sign
 */
export function getPrimaryNeed(sign: SignKey): string {
  return SIGN_GUIDANCE[sign].dailyNeeds[0];
}

/**
 * Get the primary stress behavior for a sign
 */
export function getPrimaryStressBehavior(sign: SignKey): string {
  return SIGN_GUIDANCE[sign].stressBehaviors[0];
}

/**
 * Get the primary repair strategy for a sign
 */
export function getPrimaryRepairStrategy(sign: SignKey): string {
  return SIGN_GUIDANCE[sign].repairStrategies[0];
}

export default SIGN_GUIDANCE;
