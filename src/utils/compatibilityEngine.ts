/**
 * compatibilityEngine.ts
 *
 * Ten Gods-based compatibility scoring engine with synastry narrative generation.
 * Compares two TenGodProfiles and produces scored breakdowns plus human-readable narratives.
 */

import type { TenGodKey, TenGodProfile, TenGodInstance } from './tenGodsEngine';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface CompatibilityBreakdown {
  totalScore: number;          // 0-100
  emotionalScore: number;      // 0-100
  practicalScore: number;      // 0-100
  frictionScore: number;       // 0-100
  pairContributions: {
    godA: TenGodKey;
    godB: TenGodKey;
    weightedScore: number;
  }[];
}

export interface CompatibilityReport {
  personA: TenGodProfile;
  personB: TenGodProfile;
  breakdown: CompatibilityBreakdown;
  summary: string;
}

export interface SynastryNarrative {
  overview: string;
  emotionalConnection: string;
  communication: string;
  chemistry: string;
  longTermPotential: string;
  frictionPoints: string[];
  growthOpportunities: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMOTIONAL_GODS: ReadonlySet<TenGodKey> = new Set<TenGodKey>([
  'friend', 'robWealth', 'eatingGod', 'hurtingOfficer',
  'directResource', 'indirectResource',
]);

const PRACTICAL_GODS: ReadonlySet<TenGodKey> = new Set<TenGodKey>([
  'directWealth', 'indirectWealth', 'directOfficer', 'sevenKillings',
]);

/** Human-readable labels for each Ten God key */
const GOD_LABELS: Record<TenGodKey, string> = {
  friend:           'Friend',
  robWealth:        'Rob Wealth',
  eatingGod:        'Eating God',
  hurtingOfficer:   'Hurting Officer',
  directWealth:     'Direct Wealth',
  indirectWealth:   'Indirect Wealth',
  directOfficer:    'Direct Officer',
  sevenKillings:    'Seven Killings',
  directResource:   'Direct Resource',
  indirectResource: 'Indirect Resource',
};

/**
 * Base compatibility scores for Ten God pairs.
 * Key format: "godA-godB" (alphabetically sorted so lookup is order-independent).
 * Range: -4 to +3.
 */
export const GOD_PAIR_SCORES: Record<string, number> = {
  // High compatibility (+2 to +3)
  'eatingGod-friend':            +3,
  'directResource-friend':       +2,
  'indirectWealth-robWealth':    +3,
  'directResource-eatingGod':    +3,
  'hurtingOfficer-sevenKillings': +3,
  'directOfficer-directWealth':  +3,
  'hurtingOfficer-indirectWealth': +2,
  'directOfficer-eatingGod':     +2,
  'directResource-sevenKillings': +2,
  'eatingGod-indirectResource':  +2,
  'eatingGod-eatingGod':         +2,

  // Challenging pairs (-2 to -4)
  'directOfficer-hurtingOfficer': -4,
  'directWealth-robWealth':      -3,
  'indirectResource-sevenKillings': -3,
  'friend-friend':               -2,
  'directWealth-indirectWealth': -2,
  'robWealth-robWealth':         -3,
  'sevenKillings-sevenKillings': -2,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Build a canonical key so lookup is order-independent. */
function pairKey(a: TenGodKey, b: TenGodKey): string {
  return a <= b ? `${a}-${b}` : `${b}-${a}`;
}

function lookupPairScore(a: TenGodKey, b: TenGodKey): number {
  return GOD_PAIR_SCORES[pairKey(a, b)] ?? 0;
}

function normalize(raw: number): number {
  return clamp((raw + 2) * 20, 0, 100);
}

// ---------------------------------------------------------------------------
// Core engine
// ---------------------------------------------------------------------------

const ALL_GODS: TenGodKey[] = [
  'friend', 'robWealth', 'eatingGod', 'hurtingOfficer',
  'directWealth', 'indirectWealth', 'directOfficer', 'sevenKillings',
  'directResource', 'indirectResource',
];

export function computeCompatibility(
  A: TenGodProfile,
  B: TenGodProfile,
): CompatibilityReport {
  const pairContributions: CompatibilityBreakdown['pairContributions'] = [];

  let rawTotal = 0;
  let rawEmotional = 0;
  let rawPractical = 0;
  let rawFriction = 0;

  for (const godA of ALL_GODS) {
    const instA: TenGodInstance = A.gods[godA];
    if (!instA || instA.shareOfTotalQi === 0) continue;

    for (const godB of ALL_GODS) {
      const instB: TenGodInstance = B.gods[godB];
      if (!instB || instB.shareOfTotalQi === 0) continue;

      const baseScore = lookupPairScore(godA, godB);
      if (baseScore === 0) continue;

      const weightedScore = baseScore * instA.shareOfTotalQi * instB.shareOfTotalQi;

      pairContributions.push({ godA, godB, weightedScore });

      rawTotal += weightedScore;

      // Emotional: both gods must be emotional
      if (EMOTIONAL_GODS.has(godA) && EMOTIONAL_GODS.has(godB)) {
        rawEmotional += weightedScore;
      }

      // Practical: at least one god must be practical
      if (PRACTICAL_GODS.has(godA) || PRACTICAL_GODS.has(godB)) {
        rawPractical += weightedScore;
      }

      // Friction: accumulate absolute value of negative contributions
      if (weightedScore < 0) {
        rawFriction += Math.abs(weightedScore);
      }
    }
  }

  // Sort contributions by absolute magnitude (descending)
  pairContributions.sort((a, b) => Math.abs(b.weightedScore) - Math.abs(a.weightedScore));

  const totalScore = normalize(rawTotal);
  const emotionalScore = normalize(rawEmotional);
  const practicalScore = normalize(rawPractical);
  const frictionScore = normalize(rawFriction);

  const breakdown: CompatibilityBreakdown = {
    totalScore,
    emotionalScore,
    practicalScore,
    frictionScore,
    pairContributions,
  };

  // Generate summary
  let summary: string;
  if (totalScore >= 80) {
    summary =
      'Exceptional compatibility. These two charts share deeply harmonious Ten God interactions ' +
      'that support both emotional fulfillment and practical partnership.';
  } else if (totalScore >= 60) {
    summary =
      'Good compatibility with meaningful areas of resonance. While some friction exists, ' +
      'the supportive pairings outweigh the challenging ones.';
  } else if (totalScore >= 40) {
    summary =
      'Mixed compatibility. There are both supportive and challenging dynamics at play. ' +
      'Awareness of friction points can help navigate this pairing constructively.';
  } else {
    summary =
      'Challenging compatibility. Significant friction between key Ten God pairings suggests ' +
      'this relationship will require considerable effort and mutual understanding.';
  }

  return { personA: A, personB: B, breakdown, summary };
}

// ---------------------------------------------------------------------------
// Narrative generation
// ---------------------------------------------------------------------------

/** Produce a human-readable description for a pair contribution. */
function describePairContribution(
  godA: TenGodKey,
  godB: TenGodKey,
  weightedScore: number,
): string {
  const labelA = GOD_LABELS[godA];
  const labelB = GOD_LABELS[godB];

  if (weightedScore < 0) {
    return describeFriction(labelA, labelB, godA, godB);
  }
  return describeGrowth(labelA, labelB, godA, godB);
}

function describeFriction(
  labelA: string,
  labelB: string,
  godA: TenGodKey,
  godB: TenGodKey,
): string {
  const key = pairKey(godA, godB);

  const frictionDescriptions: Record<string, string> = {
    'directOfficer-hurtingOfficer':
      `${labelA} vs ${labelB} creates authority clashes and power struggles`,
    'directWealth-robWealth':
      `${labelA} vs ${labelB} creates financial tension and competing resource priorities`,
    'indirectResource-sevenKillings':
      `${labelA} vs ${labelB} generates intellectual friction and conflicting strategies`,
    'friend-friend':
      `${labelA} vs ${labelB} creates ego competition and identity friction`,
    'directWealth-indirectWealth':
      `${labelA} vs ${labelB} produces conflicting financial approaches and value clashes`,
    'robWealth-robWealth':
      `${labelA} vs ${labelB} intensifies rivalry and competitive tension`,
    'sevenKillings-sevenKillings':
      `${labelA} vs ${labelB} amplifies aggressive energy and dominance struggles`,
  };

  return frictionDescriptions[key] ?? `${labelA} vs ${labelB} introduces friction`;
}

function describeGrowth(
  labelA: string,
  labelB: string,
  godA: TenGodKey,
  godB: TenGodKey,
): string {
  const key = pairKey(godA, godB);

  const growthDescriptions: Record<string, string> = {
    'eatingGod-friend':
      `${labelA} and ${labelB} foster creative expression and mutual encouragement`,
    'directResource-friend':
      `${labelA} and ${labelB} build a nurturing foundation of trust and support`,
    'indirectWealth-robWealth':
      `${labelA} and ${labelB} channel competitive energy into shared prosperity`,
    'directResource-eatingGod':
      `${labelA} and ${labelB} combine wisdom with creativity for inspired growth`,
    'hurtingOfficer-sevenKillings':
      `${labelA} and ${labelB} transform rebellious energy into powerful innovation`,
    'directOfficer-directWealth':
      `${labelA} and ${labelB} create a stable framework for material and career success`,
    'hurtingOfficer-indirectWealth':
      `${labelA} and ${labelB} blend unconventional thinking with resourceful opportunity`,
    'directOfficer-eatingGod':
      `${labelA} and ${labelB} balance discipline with natural talent`,
    'directResource-sevenKillings':
      `${labelA} and ${labelB} temper intensity with wisdom and patience`,
    'eatingGod-indirectResource':
      `${labelA} and ${labelB} unlock hidden creative and intellectual potential`,
    'eatingGod-eatingGod':
      `${labelA} mirroring ${labelB} amplifies artistic synergy and playful connection`,
  };

  return growthDescriptions[key] ?? `${labelA} and ${labelB} provide mutual growth potential`;
}

export function generateSynastryNarrative(
  report: CompatibilityReport,
): SynastryNarrative {
  const { totalScore, emotionalScore, practicalScore, frictionScore, pairContributions } =
    report.breakdown;

  // --- Overview ---
  let overview: string;
  if (totalScore >= 80) {
    overview =
      'This is an exceptionally harmonious pairing. The Ten God interactions between these two charts ' +
      'indicate deep natural affinity, with strong supportive currents flowing in both directions. ' +
      'Partners are likely to feel an immediate sense of ease and recognition.';
  } else if (totalScore >= 60) {
    overview =
      'A genuinely supportive pairing with solid foundations. The charts share several beneficial ' +
      'Ten God connections that promote understanding and cooperation. Minor friction points exist ' +
      'but are well outweighed by the positive dynamics.';
  } else if (totalScore >= 40) {
    overview =
      'A pairing of contrasts. There are meaningful areas of connection alongside notable points of ' +
      'friction. This relationship can thrive with conscious effort, but both partners should be ' +
      'aware of their differing energetic signatures.';
  } else {
    overview =
      'A challenging pairing that will test both partners. The dominant Ten God interactions create ' +
      'significant friction, and sustaining harmony will require deep mutual understanding, patience, ' +
      'and a willingness to grow through difficulty.';
  }

  // --- Emotional Connection ---
  let emotionalConnection: string;
  if (emotionalScore >= 80) {
    emotionalConnection =
      'The emotional bond between these charts is exceptionally strong. Both individuals resonate on ' +
      'a deeply personal level, sharing intuitive understanding of each other\'s inner world.';
  } else if (emotionalScore >= 60) {
    emotionalConnection =
      'A warm emotional connection exists between these charts. There is genuine empathy and an ability ' +
      'to support each other through emotional highs and lows.';
  } else if (emotionalScore >= 40) {
    emotionalConnection =
      'Emotional connection is moderate. While there are moments of closeness, each partner may ' +
      'sometimes feel that the other does not fully understand their emotional needs.';
  } else {
    emotionalConnection =
      'Emotional attunement is limited in this pairing. Partners may struggle to connect on a feeling ' +
      'level and should make deliberate effort to share their inner experiences.';
  }

  // --- Communication (inverse of friction) ---
  const communicationScore = 100 - frictionScore;
  let communication: string;
  if (communicationScore >= 80) {
    communication =
      'Communication flows naturally and openly. Disagreements are rare and easily resolved, as both ' +
      'charts support clear and respectful exchange of ideas.';
  } else if (communicationScore >= 60) {
    communication =
      'Communication is generally smooth, though occasional misunderstandings may arise. Both partners ' +
      'can navigate differences through honest dialogue.';
  } else if (communicationScore >= 40) {
    communication =
      'Communication requires effort. Certain Ten God pairings introduce friction that can manifest ' +
      'as misunderstandings, defensiveness, or competing conversational styles.';
  } else {
    communication =
      'Communication is a significant challenge in this pairing. Clashing energetic signatures can ' +
      'lead to frequent misinterpretation and escalation. Structured communication practices are recommended.';
  }

  // --- Chemistry ---
  let chemistry: string;
  if (totalScore >= 80) {
    chemistry =
      'Magnetic chemistry. The interplay of Ten Gods creates a powerful mutual attraction that ' +
      'extends beyond the physical into shared creative and spiritual dimensions.';
  } else if (totalScore >= 60) {
    chemistry =
      'Genuine chemistry with a comfortable, warm quality. Partners enjoy each other\'s company ' +
      'and find natural rhythm together.';
  } else if (totalScore >= 40) {
    chemistry =
      'Chemistry is present but inconsistent. Moments of strong attraction alternate with periods ' +
      'of tension or indifference.';
  } else {
    chemistry =
      'Chemistry is subdued or volatile. The dominant interactions create either a lack of spark ' +
      'or an intensity that can be difficult to sustain.';
  }

  // --- Long-Term Potential ---
  let longTermPotential: string;
  if (practicalScore >= 80) {
    longTermPotential =
      'Excellent long-term potential. The practical Ten God connections support shared goals, ' +
      'financial stability, and the ability to build something lasting together.';
  } else if (practicalScore >= 60) {
    longTermPotential =
      'Good long-term potential. The charts support practical cooperation and shared ambition, ' +
      'though some areas of life may require extra coordination.';
  } else if (practicalScore >= 40) {
    longTermPotential =
      'Moderate long-term potential. Practical matters such as finances, career priorities, and ' +
      'life direction may require ongoing negotiation and compromise.';
  } else {
    longTermPotential =
      'Long-term sustainability is uncertain. Practical friction in areas like wealth, authority, ' +
      'and life direction may erode the relationship over time without active management.';
  }

  // --- Friction Points (top 3 negative contributions) ---
  const frictionPoints = pairContributions
    .filter((p) => p.weightedScore < 0)
    .sort((a, b) => a.weightedScore - b.weightedScore)   // most negative first
    .slice(0, 3)
    .map((p) => describePairContribution(p.godA, p.godB, p.weightedScore));

  // --- Growth Opportunities (top 3 positive contributions) ---
  const growthOpportunities = pairContributions
    .filter((p) => p.weightedScore > 0)
    .sort((a, b) => b.weightedScore - a.weightedScore)   // most positive first
    .slice(0, 3)
    .map((p) => describePairContribution(p.godA, p.godB, p.weightedScore));

  return {
    overview,
    emotionalConnection,
    communication,
    chemistry,
    longTermPotential,
    frictionPoints,
    growthOpportunities,
  };
}

// ============================================================================
// ARCHETYPE-BASED COMPATIBILITY BLUEPRINT
// ============================================================================

import type { PersonalityArchetype, ArchetypeKey } from './personalityEngine';

export interface ArchetypeCompatibilityBlueprint {
  pair: { a: PersonalityArchetype; b: PersonalityArchetype };
  matchType: 'natural' | 'growth' | 'challenge';
  synergy: string;
  friction: string;
  longTermPotential: string;
  advice: string[];
}

const NATURAL_PAIRS: Record<ArchetypeKey, ArchetypeKey> = {
  visionary_rebel: 'nurturing_teacher',
  nurturing_teacher: 'creative_artist',
  strategic_leader: 'mystic_seeker',
  creative_artist: 'independent_maverick',
  practical_manager: 'connector_networker',
  mystic_seeker: 'visionary_rebel',
  warrior_transformer: 'nurturing_teacher',
  connector_networker: 'creative_artist',
  independent_maverick: 'practical_manager',
};

const GROWTH_PAIRS: Record<ArchetypeKey, ArchetypeKey> = {
  visionary_rebel: 'practical_manager',
  nurturing_teacher: 'warrior_transformer',
  strategic_leader: 'creative_artist',
  creative_artist: 'strategic_leader',
  practical_manager: 'visionary_rebel',
  mystic_seeker: 'independent_maverick',
  warrior_transformer: 'mystic_seeker',
  connector_networker: 'practical_manager',
  independent_maverick: 'nurturing_teacher',
};

const CHALLENGE_PAIRS: Record<ArchetypeKey, ArchetypeKey> = {
  visionary_rebel: 'warrior_transformer',
  nurturing_teacher: 'independent_maverick',
  strategic_leader: 'visionary_rebel',
  creative_artist: 'practical_manager',
  practical_manager: 'creative_artist',
  mystic_seeker: 'strategic_leader',
  warrior_transformer: 'creative_artist',
  connector_networker: 'mystic_seeker',
  independent_maverick: 'strategic_leader',
};

export function generateArchetypeCompatibility(
  a: PersonalityArchetype,
  b: PersonalityArchetype
): ArchetypeCompatibilityBlueprint {
  // Check both directions for match type
  let matchType: 'natural' | 'growth' | 'challenge' = 'growth';
  if (NATURAL_PAIRS[a.key] === b.key || NATURAL_PAIRS[b.key] === a.key) matchType = 'natural';
  else if (CHALLENGE_PAIRS[a.key] === b.key || CHALLENGE_PAIRS[b.key] === a.key) matchType = 'challenge';

  const synergy = matchType === 'natural'
    ? `${a.label} and ${b.label} resonate effortlessly — your archetypes create emotional ease and intuitive understanding.`
    : matchType === 'growth'
    ? `${a.label} and ${b.label} challenge each other in ways that promote evolution and maturity.`
    : `${a.label} and ${b.label} activate contrasting needs — friction requires conscious navigation.`;

  const friction = matchType === 'challenge'
    ? 'Core motivations differ sharply, leading to misunderstandings or power struggles without awareness.'
    : matchType === 'growth'
    ? 'Differences may surface around communication, pacing, or emotional needs, but these are growable.'
    : 'Minimal friction — differences complement rather than conflict.';

  const longTermPotential = matchType === 'natural'
    ? 'High long-term potential with stable emotional and practical alignment.'
    : matchType === 'growth'
    ? 'Strong long-term potential if both partners embrace mutual growth and honest communication.'
    : 'Long-term potential depends on boundaries, communication, and emotional maturity from both sides.';

  const adviceMap = {
    natural: [
      'Lean into your natural synergy — build shared rituals and creative projects.',
      'Honor each other\'s strengths without taking them for granted.',
      'Use your harmony as a foundation to tackle external challenges together.',
    ],
    growth: [
      'Communicate openly about needs — what feels obvious to you may be invisible to them.',
      'Use differences as opportunities for expansion, not ammunition for arguments.',
      'Balance independence with connection — neither merging nor distancing.',
    ],
    challenge: [
      'Set clear boundaries early — unspoken expectations become resentment.',
      'Practice emotional regulation before addressing conflicts.',
      'Honor each other\'s core motivations without forcing alignment — respect the difference.',
    ],
  };

  return {
    pair: { a, b },
    matchType,
    synergy,
    friction,
    longTermPotential,
    advice: adviceMap[matchType],
  };
}
