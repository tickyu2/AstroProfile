/**
 * Rising Sign Friction - Social Presentation & First Impression Dynamics
 *
 * The Rising sign governs how we appear to others, first impressions,
 * and social persona. These patterns help identify potential misunderstandings
 * and bridge-building opportunities between Rising signs.
 *
 * "The mask you wear and how others see through it"
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey } from './tropicalMap';

export interface RisingFriction {
  appearsAs: string[];           // How this Rising appears to others
  commonMisread: string[];       // How they're commonly misunderstood
  actuallyNeeds: string[];       // What's behind the mask
  socialStrengths: string[];     // Social gifts
  frictionWith: string[];        // Types they may clash with initially
  bridgeStrategy: string[];      // How to connect past the mask
}

export const RISING_FRICTION: Record<SignKey, RisingFriction> = {
  Aries: {
    appearsAs: [
      'Energetic and assertive',
      'Direct and action-oriented',
      'Competitive and confident',
    ],
    commonMisread: [
      'May appear aggressive or rushed',
      'Can seem impatient or insensitive',
      'Directness mistaken for rudeness',
    ],
    actuallyNeeds: [
      'Respect for their initiative',
      'Space to lead and act',
      'Matching energy and enthusiasm',
    ],
    socialStrengths: [
      'Natural leader in social settings',
      'Breaks ice easily',
      'Brings energy to any room',
    ],
    frictionWith: [
      'Slower, more cautious types',
      'Those who need time to process',
      'Passive-aggressive communicators',
    ],
    bridgeStrategy: [
      'Match their directness',
      'Don\'t take their bluntness personally',
      'Appreciate their initiative',
    ],
  },

  Taurus: {
    appearsAs: [
      'Calm and grounded',
      'Reliable and steady',
      'Sensual and appreciative',
    ],
    commonMisread: [
      'May seem resistant or slow',
      'Can appear stubborn or inflexible',
      'Steadiness mistaken for dullness',
    ],
    actuallyNeeds: [
      'Time to adjust to new people',
      'Consistency in interactions',
      'Appreciation for their reliability',
    ],
    socialStrengths: [
      'Creates comfortable atmospheres',
      'Loyal friend once connected',
      'Brings stability to groups',
    ],
    frictionWith: [
      'High-energy, fast-paced types',
      'Those who push for quick change',
      'Flaky or inconsistent people',
    ],
    bridgeStrategy: [
      'Be patient and consistent',
      'Don\'t rush the connection',
      'Show up reliably',
    ],
  },

  Gemini: {
    appearsAs: [
      'Witty and curious',
      'Adaptable and social',
      'Quick-thinking and talkative',
    ],
    commonMisread: [
      'May appear inconsistent or flaky',
      'Can seem superficial or scattered',
      'Adaptability mistaken for inauthenticity',
    ],
    actuallyNeeds: [
      'Mental stimulation',
      'Freedom to explore topics',
      'Someone who can keep up',
    ],
    socialStrengths: [
      'Natural conversationalist',
      'Connects diverse people',
      'Keeps gatherings lively',
    ],
    frictionWith: [
      'Those who need deep focus',
      'Slow or deliberate communicators',
      'People who demand consistency',
    ],
    bridgeStrategy: [
      'Engage their curiosity',
      'Don\'t demand they stay on one topic',
      'Appreciate their versatility',
    ],
  },

  Cancer: {
    appearsAs: [
      'Nurturing and protective',
      'Emotionally attuned',
      'Reserved until comfortable',
    ],
    commonMisread: [
      'May seem guarded or moody',
      'Can appear clingy or overly emotional',
      'Caution mistaken for unfriendliness',
    ],
    actuallyNeeds: [
      'Emotional safety to open up',
      'Genuine care, not small talk',
      'Time to build trust',
    ],
    socialStrengths: [
      'Creates belonging in groups',
      'Remembers personal details',
      'Deeply loyal once bonded',
    ],
    frictionWith: [
      'Emotionally detached types',
      'Those who dismiss feelings',
      'Overly blunt communicators',
    ],
    bridgeStrategy: [
      'Show genuine emotional interest',
      'Be consistent and trustworthy',
      'Don\'t force vulnerability',
    ],
  },

  Leo: {
    appearsAs: [
      'Confident and charismatic',
      'Warm and generous',
      'Natural performer',
    ],
    commonMisread: [
      'May appear dominant or attention-seeking',
      'Can seem egotistical or dramatic',
      'Confidence mistaken for arrogance',
    ],
    actuallyNeeds: [
      'Recognition and appreciation',
      'Loyal audience',
      'Space to shine',
    ],
    socialStrengths: [
      'Lights up any room',
      'Generous with praise for others',
      'Natural entertainer',
    ],
    frictionWith: [
      'Those who compete for attention',
      'Critical or cold types',
      'People who dismiss their warmth',
    ],
    bridgeStrategy: [
      'Appreciate their gifts genuinely',
      'Don\'t compete—collaborate',
      'Let them know they matter',
    ],
  },

  Virgo: {
    appearsAs: [
      'Thoughtful and observant',
      'Helpful and detail-oriented',
      'Modest and reserved',
    ],
    commonMisread: [
      'May seem critical or judgmental',
      'Can appear anxious or perfectionist',
      'Helpfulness mistaken for control',
    ],
    actuallyNeeds: [
      'Appreciation for their efforts',
      'Order and clarity in interactions',
      'To feel useful',
    ],
    socialStrengths: [
      'Notices what others miss',
      'Practical problem-solver',
      'Quietly supportive',
    ],
    frictionWith: [
      'Chaotic or disorganized types',
      'Those who dismiss details',
      'People who are all talk',
    ],
    bridgeStrategy: [
      'Notice their contributions',
      'Be clear and specific',
      'Value quality over flash',
    ],
  },

  Libra: {
    appearsAs: [
      'Charming and diplomatic',
      'Fair-minded and social',
      'Aesthetically aware',
    ],
    commonMisread: [
      'May appear indecisive or people-pleasing',
      'Can seem superficial or avoidant',
      'Diplomacy mistaken for weakness',
    ],
    actuallyNeeds: [
      'Harmony in interactions',
      'Mutual respect and fairness',
      'Beauty and balance',
    ],
    socialStrengths: [
      'Natural mediator',
      'Creates social harmony',
      'Makes everyone feel included',
    ],
    frictionWith: [
      'Aggressive or dominating types',
      'Those who create conflict',
      'People who demand instant decisions',
    ],
    bridgeStrategy: [
      'Be fair and considerate',
      'Avoid unnecessary conflict',
      'Give them time to weigh options',
    ],
  },

  Scorpio: {
    appearsAs: [
      'Intense and magnetic',
      'Private and perceptive',
      'Powerful presence',
    ],
    commonMisread: [
      'May seem intimidating or secretive',
      'Can appear suspicious or controlling',
      'Intensity mistaken for hostility',
    ],
    actuallyNeeds: [
      'Trust and authenticity',
      'Depth over small talk',
      'Loyalty and honesty',
    ],
    socialStrengths: [
      'Reads people accurately',
      'Fiercely loyal once trusted',
      'Brings depth to connections',
    ],
    frictionWith: [
      'Superficial or fake people',
      'Those who can\'t keep secrets',
      'Overly light, avoiding types',
    ],
    bridgeStrategy: [
      'Be authentic—they see through pretense',
      'Prove trustworthiness over time',
      'Don\'t fear their intensity',
    ],
  },

  Sagittarius: {
    appearsAs: [
      'Optimistic and adventurous',
      'Philosophical and expansive',
      'Free-spirited and honest',
    ],
    commonMisread: [
      'May appear careless or tactless',
      'Can seem uncommitted or restless',
      'Honesty mistaken for insensitivity',
    ],
    actuallyNeeds: [
      'Freedom and space',
      'Meaning and adventure',
      'Optimism and possibility',
    ],
    socialStrengths: [
      'Brings enthusiasm to groups',
      'Connects through shared ideals',
      'Natural storyteller',
    ],
    frictionWith: [
      'Restrictive or controlling types',
      'Negative or pessimistic people',
      'Those who demand commitment quickly',
    ],
    bridgeStrategy: [
      'Share their optimism',
      'Don\'t try to cage them',
      'Explore ideas together',
    ],
  },

  Capricorn: {
    appearsAs: [
      'Serious and responsible',
      'Ambitious and capable',
      'Reserved and authoritative',
    ],
    commonMisread: [
      'May seem cold or unapproachable',
      'Can appear status-focused or workaholic',
      'Reserve mistaken for unfriendliness',
    ],
    actuallyNeeds: [
      'Respect for their competence',
      'Trust in their leadership',
      'Time to show their warmth',
    ],
    socialStrengths: [
      'Natural authority figure',
      'Dependable and trustworthy',
      'Dry wit once comfortable',
    ],
    frictionWith: [
      'Frivolous or irresponsible types',
      'Those who don\'t take things seriously',
      'People who undermine their authority',
    ],
    bridgeStrategy: [
      'Show respect for their achievements',
      'Be reliable and professional',
      'Patience reveals their warmth',
    ],
  },

  Aquarius: {
    appearsAs: [
      'Unique and unconventional',
      'Friendly but detached',
      'Intellectually oriented',
    ],
    commonMisread: [
      'May appear detached or aloof',
      'Can seem eccentric or contrary',
      'Friendliness mistaken for intimacy',
    ],
    actuallyNeeds: [
      'Respect for individuality',
      'Intellectual engagement',
      'Freedom from expectations',
    ],
    socialStrengths: [
      'Accepts everyone\'s uniqueness',
      'Brings fresh perspectives',
      'Connects diverse groups',
    ],
    frictionWith: [
      'Traditional or conformist types',
      'Emotionally demanding people',
      'Those who expect conventional behavior',
    ],
    bridgeStrategy: [
      'Respect their uniqueness',
      'Engage intellectually first',
      'Don\'t demand emotional conformity',
    ],
  },

  Pisces: {
    appearsAs: [
      'Dreamy and sensitive',
      'Compassionate and intuitive',
      'Artistic and flowing',
    ],
    commonMisread: [
      'May seem unfocused or spacey',
      'Can appear overly emotional or escapist',
      'Sensitivity mistaken for weakness',
    ],
    actuallyNeeds: [
      'Gentle, non-judgmental space',
      'Creative or spiritual connection',
      'Understanding of their intuitive nature',
    ],
    socialStrengths: [
      'Deeply empathetic listener',
      'Creates magical atmospheres',
      'Sees the best in others',
    ],
    frictionWith: [
      'Harsh or critical types',
      'Overly practical, dismissive people',
      'Those who demand constant logic',
    ],
    bridgeStrategy: [
      'Be gentle and accepting',
      'Honor their intuitive insights',
      'Create beauty together',
    ],
  },
};

export default RISING_FRICTION;
