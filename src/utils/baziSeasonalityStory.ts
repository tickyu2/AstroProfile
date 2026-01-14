/**
 * ============================================================================
 * BAZI SEASONALITY STORY MODE
 * ============================================================================
 *
 * Gentle, Khan-Academy-style narratives for beginners.
 * No jargon, lots of metaphor, anchored in the user's chart.
 *
 * The goal: Help people understand WHY their chart looks the way it does,
 * and cultivate respect for both themselves and others.
 *
 * Created: January 2026
 * Philosophy: Teaching people to see themselves with more softness
 * ============================================================================
 */

import { SeasonalityResult, Element } from './baziSeasonality';
import { DMSeasonalityResult } from './baziDmSeasonality';
import { TenGodsSeasonalityResult, TenGodCategory } from './baziTenGodsSeasonality';
import { YinYangProfile, FourPillars } from './baziYinYang';
import { ChartStemBranchAnalysis } from './baziStemBranchRelations';

// ============================================================================
// SEASON METAPHORS
// ============================================================================

const SEASON_METAPHORS: Record<string, { label: string; metaphor: string; energy: string }> = {
  spring: {
    label: 'Spring (Wood Rising)',
    metaphor: 'like a seed breaking through soil - all upward energy and fresh beginnings',
    energy: 'growth, expansion, and new possibilities'
  },
  summer: {
    label: 'Summer (Fire Flourishing)',
    metaphor: 'like the midday sun at its peak - radiant, expressive, and fully alive',
    energy: 'expression, visibility, and passionate connection'
  },
  autumn: {
    label: 'Autumn (Metal Refining)',
    metaphor: 'like a harvest being gathered - the time of assessment, refinement, and letting go',
    energy: 'discernment, precision, and valuable exchange'
  },
  winter: {
    label: 'Winter (Water Storing)',
    metaphor: 'like a deep well preserving its waters - quiet, reflective, and holding potential',
    energy: 'wisdom, intuition, and stored resources'
  },
  earth_transition: {
    label: 'Earth Transition (Stability and Integration)',
    metaphor: 'like the center of a wheel - the still point around which all seasons turn',
    energy: 'grounding, integration, and stable foundations'
  }
};

const ELEMENT_METAPHORS: Record<Element, { nature: string; gift: string; challenge: string }> = {
  wood: {
    nature: 'the growing tree',
    gift: 'vision, growth, and benevolent leadership',
    challenge: 'learning when to stop pushing and accept stillness'
  },
  fire: {
    nature: 'the warming flame',
    gift: 'joy, connection, and the ability to inspire others',
    challenge: 'learning to sustain warmth without burning out'
  },
  earth: {
    nature: 'the nourishing ground',
    gift: 'stability, care, and the ability to support others',
    challenge: 'learning to receive as well as give'
  },
  metal: {
    nature: 'the refined ore',
    gift: 'clarity, justice, and the ability to discern truth',
    challenge: 'learning flexibility without losing integrity'
  },
  water: {
    nature: 'the flowing stream',
    gift: 'wisdom, adaptability, and deep understanding',
    challenge: 'learning when to take form and when to flow'
  }
};

// ============================================================================
// YIN/YANG POLARITY METAPHORS
// ============================================================================

const POLARITY_METAPHORS: Record<YinYangProfile['balance'], {
  label: string;
  metaphor: string;
  tendency: string;
  gift: string;
}> = {
  very_yang: {
    label: 'Strongly Yang',
    metaphor: 'like the midday sun - radiant, forceful, commanding attention',
    tendency: 'to initiate, to lead, to be visible and direct',
    gift: 'the ability to start things, to inspire action, to cut through hesitation'
  },
  yang: {
    label: 'Yang-Leaning',
    metaphor: 'like the morning sun - rising energy, forward momentum',
    tendency: 'to be proactive, to express outwardly, to engage actively',
    gift: 'a natural drive toward action while still being receptive'
  },
  balanced: {
    label: 'Yin-Yang Balanced',
    metaphor: 'like the equinox - equal parts light and shadow, movement and stillness',
    tendency: 'to adapt fluidly between action and reflection',
    gift: 'versatility - the ability to lead or follow as the moment requires'
  },
  yin: {
    label: 'Yin-Leaning',
    metaphor: 'like the evening moon - soft illumination, receptive presence',
    tendency: 'to observe, to adapt, to respond rather than initiate',
    gift: 'deep perception and the ability to work skillfully with what is given'
  },
  very_yin: {
    label: 'Strongly Yin',
    metaphor: 'like the midnight moon - quiet, profound, drawing energy inward',
    tendency: 'to reflect, to process internally, to move through intuition',
    gift: 'the ability to see what others miss, to hold space, to nurture quietly'
  }
};

const DM_POLARITY_NARRATIVES: Record<'yang' | 'yin', {
  nature: string;
  expression: string;
  when_aligned: string;
  when_counter: string;
}> = {
  yang: {
    nature: 'Your Day Master carries Yang energy - the active, assertive, outward-moving force',
    expression: 'You naturally express yourself through direct action and visible presence',
    when_aligned: 'With your chart also leaning Yang, your core self flows naturally with your environment - like a river running downhill',
    when_counter: 'But your Yang core must navigate a Yin-dominant environment - like the sun working through clouds. This isn\'t weakness; it builds depth and adaptability'
  },
  yin: {
    nature: 'Your Day Master carries Yin energy - the receptive, adaptive, inward-moving force',
    expression: 'You naturally express yourself through observation, adaptation, and skillful response',
    when_aligned: 'With your chart also leaning Yin, your core self flows naturally with your environment - like moonlight reflecting on still water',
    when_counter: 'But your Yin core must navigate a Yang-dominant environment - like the moon visible in daylight. This isn\'t weakness; it builds strength and presence'
  }
};

// ============================================================================
// ROOTEDNESS METAPHORS
// ============================================================================

const ROOTEDNESS_METAPHORS: Record<string, {
  label: string;
  metaphor: string;
  meaning: string;
  practice: string;
}> = {
  strongly_rooted: {
    label: 'Strongly Rooted',
    metaphor: 'like an ancient oak with roots reaching deep into the earth',
    meaning: 'Your stems are deeply supported by the hidden elements in your branches. Your expressed self has strong backing from your foundational energies',
    practice: 'Trust your instincts - your foundation supports confident action. Your challenge is avoiding rigidity'
  },
  well_rooted: {
    label: 'Well Rooted',
    metaphor: 'like a healthy maple - firm roots with room to sway',
    meaning: 'Your stems find good support in your branches. You have a stable foundation that allows for flexible expression',
    practice: 'You have reliable inner resources. When stressed, return to your center and you\'ll find strength there'
  },
  moderately_rooted: {
    label: 'Moderately Rooted',
    metaphor: 'like a young willow - flexible roots adapting to changing ground',
    meaning: 'Your stems have partial support from your branches. Some parts of your expressed self have strong backing; others are more free-floating',
    practice: 'Learn which aspects of yourself have deep roots (they\'re your reliable strengths) and which need external support'
  },
  lightly_rooted: {
    label: 'Lightly Rooted',
    metaphor: 'like a graceful bamboo - light anchoring but tremendous flexibility',
    meaning: 'Your stems have limited direct support from branches. Your expressed self operates with more independence from foundational energies',
    practice: 'Seek supportive environments and relationships. Your strength lies in adaptability, not immovability'
  },
  uprooted: {
    label: 'Floating Freely',
    metaphor: 'like a dandelion seed - carried by winds rather than anchored in earth',
    meaning: 'Your stems have minimal branch support. Your expressed self is remarkably free from foundational constraints',
    practice: 'Your gift is total adaptability. Seek anchoring through luck cycles, relationships, or conscious practice'
  }
};

// ============================================================================
// MAIN STORY BUILDER
// ============================================================================

/**
 * Build a gentle, beginner-friendly narrative about seasonality.
 */
export function buildSeasonalityStory(
  seasonality: SeasonalityResult,
  dmSeasonal: DMSeasonalityResult,
  tenGodsSeasonal: TenGodsSeasonalityResult
): string {
  const seasonMeta = SEASON_METAPHORS[seasonality.season] || SEASON_METAPHORS.spring;
  const dmMeta = ELEMENT_METAPHORS[dmSeasonal.dmElement];

  const story = `
Your Chart Was Born in ${seasonMeta.label}
${'─'.repeat(50)}

Imagine the moment of your birth: the world around you was ${seasonMeta.metaphor}.

This seasonal environment shapes your elemental constitution in subtle but important ways.
The air carried the energy of ${seasonMeta.energy}.

Your Core Self (Day Master)
${'─'.repeat(50)}

At the center of your chart is your Day Master - your core self, represented by ${capitalize(dmSeasonal.dmElement)}.

The ${dmMeta.nature} is your essential nature. Your gift is ${dmMeta.gift}.
Your growth edge is ${dmMeta.challenge}.

${dmSeasonal.isInSeason ?
    `Because you were born when ${capitalize(dmSeasonal.dmElement)} naturally thrives, your core self has innate strength.
This doesn't mean life is easy - it means your foundation is solid.` :
    `You were born in a season that doesn't naturally support ${capitalize(dmSeasonal.dmElement)}.
This isn't a weakness - it's an invitation to consciously cultivate your strengths.`
  }

Your adjusted Day Master strength: ${(dmSeasonal.adjustedStrength * 100).toFixed(0)}%

How Season Shapes Your Life Domains
${'─'.repeat(50)}

The season affects different areas of your life through what we call the "Ten Gods" -
symbolic relationships between elements that represent life domains.

${formatTenGodsStory(tenGodsSeasonal)}

What This Means for You
${'─'.repeat(50)}

${generatePersonalInsight(seasonality, dmSeasonal, tenGodsSeasonal)}

Remember: Understanding your elemental constitution is not about labeling yourself as
"good" or "bad." It's about seeing clearly where support comes naturally and where
conscious cultivation is needed.

When you understand your own seasonal fingerprint, you also begin to understand why
others are different from you. Their charts were born into different seasons, shaping
different constitutions.

This is the foundation of mutual respect: "I see why you are like this, and I honor it."
`;

  return story.trim();
}

// ============================================================================
// ENHANCED STORY BUILDER (WITH YIN/YANG + ROOTEDNESS)
// ============================================================================

export interface EnhancedStoryOpts {
  seasonality: SeasonalityResult;
  dmSeasonal: DMSeasonalityResult;
  tenGodsSeasonal: TenGodsSeasonalityResult;
  yinYangProfile: YinYangProfile;
  stemBranchAnalysis: ChartStemBranchAnalysis;
  dmStem: string;
  pillars: FourPillars;
}

/**
 * Build a comprehensive story that includes seasonality, Yin/Yang polarity,
 * and stem-branch rootedness narratives.
 *
 * This is the "Full Cathedral" story mode - everything woven together
 * into a gentle, coherent narrative.
 */
export function buildSeasonalityStoryWithPolarityRootedness(
  opts: EnhancedStoryOpts
): string {
  const {
    seasonality,
    dmSeasonal,
    tenGodsSeasonal,
    yinYangProfile,
    stemBranchAnalysis,
    dmStem,
    pillars
  } = opts;

  const seasonMeta = SEASON_METAPHORS[seasonality.season] || SEASON_METAPHORS.spring;
  const dmMeta = ELEMENT_METAPHORS[dmSeasonal.dmElement];
  const polarityMeta = POLARITY_METAPHORS[yinYangProfile.balance];
  const dmPolarityNarrative = DM_POLARITY_NARRATIVES[yinYangProfile.dmPolarity];
  const rootednessKey = getRootednessKey(stemBranchAnalysis.overallRootedness);
  const rootednessMeta = ROOTEDNESS_METAPHORS[rootednessKey];

  const story = `
${'═'.repeat(60)}
YOUR COMPLETE CHART STORY
${'═'.repeat(60)}

PART I: THE SEASON OF YOUR BIRTH
${'─'.repeat(50)}

Imagine the moment of your birth: the world around you was ${seasonMeta.metaphor}.

Your chart was born in ${seasonMeta.label}, when the air carried the energy of ${seasonMeta.energy}.

This seasonal environment shapes everything that follows - your elemental balance, your strengths, your growth edges.


PART II: YOUR CORE SELF (DAY MASTER)
${'─'.repeat(50)}

At the center of your chart is your Day Master: ${dmStem} (${capitalize(dmSeasonal.dmElement)}).

The ${dmMeta.nature} is your essential nature.
Your gift is ${dmMeta.gift}.
Your growth edge is ${dmMeta.challenge}.

${dmSeasonal.isInSeason ?
    `You were born when ${capitalize(dmSeasonal.dmElement)} naturally thrives.
This gives your core self innate seasonal support - like a plant in its ideal climate.` :
    `You were born in a season that doesn't naturally amplify ${capitalize(dmSeasonal.dmElement)}.
This isn't weakness - it's an invitation to consciously cultivate your elemental nature.`
  }

Adjusted Day Master strength: ${(dmSeasonal.adjustedStrength * 100).toFixed(0)}%


PART III: YOUR YIN/YANG POLARITY
${'─'.repeat(50)}

Your chart's energy is ${polarityMeta.label} - ${polarityMeta.metaphor}.

This gives you a natural tendency ${polarityMeta.tendency}.

Your polarity gift is ${polarityMeta.gift}.

${dmPolarityNarrative.nature}.
${dmPolarityNarrative.expression}.

${yinYangProfile.dmPolarityMatch ? dmPolarityNarrative.when_aligned : dmPolarityNarrative.when_counter}.

Chart Balance: ${(yinYangProfile.weightedYang * 100).toFixed(0)}% Yang, ${(yinYangProfile.weightedYin * 100).toFixed(0)}% Yin
Day Master Polarity: ${yinYangProfile.dmPolarity === 'yang' ? 'Yang' : 'Yin'}
Alignment: ${yinYangProfile.dmPolarityMatch ? 'Harmonious Flow' : 'Creative Tension'}


PART IV: YOUR ROOTEDNESS (STEM-BRANCH SUPPORT)
${'─'.repeat(50)}

Your overall rootedness is ${rootednessMeta.label} - ${rootednessMeta.metaphor}.

${rootednessMeta.meaning}.

${rootednessMeta.practice}

${formatRootednessDetails(stemBranchAnalysis)}


PART V: HOW SEASON SHAPES YOUR LIFE DOMAINS
${'─'.repeat(50)}

The season affects different areas of your life through the "Ten Gods" -
symbolic relationships between elements that represent life domains.

${formatTenGodsStory(tenGodsSeasonal)}


PART VI: YOUR INTEGRATED PICTURE
${'─'.repeat(50)}

${generateIntegratedInsight(seasonality, dmSeasonal, yinYangProfile, stemBranchAnalysis)}


${'═'.repeat(60)}
REMEMBER
${'═'.repeat(60)}

Understanding your chart is not about labeling yourself as "good" or "bad."

It's about seeing clearly:
• Where support comes naturally
• Where conscious cultivation is needed
• How your polarity shapes your expression
• How your roots provide (or free you from) stability

When you understand your own chart fingerprint, you begin to understand why
others are different. Their charts were born into different seasons, with
different polarities and different rootedness.

This is the foundation of mutual respect:
"I see why you are like this, and I honor it."
`;

  return story.trim();
}

/**
 * Get rootedness category key from normalized score
 */
function getRootednessKey(normalized: number): string {
  if (normalized >= 0.75) return 'strongly_rooted';
  if (normalized >= 0.55) return 'well_rooted';
  if (normalized >= 0.35) return 'moderately_rooted';
  if (normalized >= 0.15) return 'lightly_rooted';
  return 'uprooted';
}

/**
 * Format detailed rootedness by pillar
 */
function formatRootednessDetails(analysis: ChartStemBranchAnalysis): string {
  const pillars = ['year', 'month', 'day', 'hour'] as const;
  const pillarNames = ['Year', 'Month', 'Day', 'Hour'];

  const details = pillars.map((pillar, idx) => {
    const relation = analysis.pillarRelations[pillar];
    const icon = relation.hasRoot ? '+' : relation.relationType === 'neutral' ? '~' : '-';
    return `[${icon}] ${pillarNames[idx]} Pillar: ${relation.relationLabel}`;
  });

  // Add Day Master specific note
  const dmNote = analysis.dmHasStrongRoot
    ? '\nYour Day Master has strong roots in its branch - a solid foundation for self-expression.'
    : '\nYour Day Master draws strength from other pillars or luck cycles rather than its own branch.';

  return details.join('\n') + dmNote;
}

/**
 * Generate integrated insight combining all factors
 */
function generateIntegratedInsight(
  seasonality: SeasonalityResult,
  dmSeasonal: DMSeasonalityResult,
  yinYang: YinYangProfile,
  rootedness: ChartStemBranchAnalysis
): string {
  const insights: string[] = [];

  // Strength + Polarity combination
  if (dmSeasonal.adjustedStrength > 0.6 && yinYang.dmPolarityMatch) {
    insights.push(
      'Your strong Day Master combined with aligned polarity suggests natural confidence. ' +
      'You can trust your instincts and act decisively. Watch for being too forceful.'
    );
  } else if (dmSeasonal.adjustedStrength > 0.6 && !yinYang.dmPolarityMatch) {
    insights.push(
      'Your strong Day Master works against your chart\'s polarity flow. ' +
      'This creates dynamic tension - you have power, but must learn when to yield.'
    );
  } else if (dmSeasonal.adjustedStrength < 0.4 && yinYang.dmPolarityMatch) {
    insights.push(
      'Your Day Master needs support, but your polarity flows harmoniously. ' +
      'Seek nurturing relationships and environments - they\'ll feel natural to you.'
    );
  } else if (dmSeasonal.adjustedStrength < 0.4 && !yinYang.dmPolarityMatch) {
    insights.push(
      'Your Day Master faces a double challenge: seasonal weakness and polarity tension. ' +
      'This builds tremendous resilience. Success comes through conscious cultivation.'
    );
  } else {
    insights.push(
      'Your Day Master operates in balanced territory - neither exceptionally strong nor weak. ' +
      'This gives flexibility to adapt to different situations.'
    );
  }

  // Rootedness insight
  if (rootedness.overallRootedness > 0.6) {
    insights.push(
      'Your strong rootedness provides a stable foundation. ' +
      'When life gets turbulent, you can draw on deep inner resources.'
    );
  } else if (rootedness.overallRootedness < 0.3) {
    insights.push(
      'Your lighter rootedness makes you highly adaptable but may seek external anchoring. ' +
      'Relationships, environments, and luck cycles play important supportive roles for you.'
    );
  }

  // Dominant element shift
  if (seasonality.dominantChanged) {
    insights.push(
      `Interestingly, the season shifts your dominant element from ${capitalize(seasonality.dominantBefore)} to ${capitalize(seasonality.dominantAfter)}. ` +
      'Environmental influences are particularly significant in your chart.'
    );
  }

  return insights.join('\n\n');
}

// ============================================================================
// HELPERS
// ============================================================================

function formatTenGodsStory(tenGods: TenGodsSeasonalityResult): string {
  const categories: TenGodCategory[] = ['resource', 'companion', 'output', 'wealth', 'officer'];

  const descriptions: Record<TenGodCategory, string> = {
    resource: 'Support & Learning (mentors, education, nurturing)',
    companion: 'Peers & Competition (friends, siblings, rivals)',
    output: 'Expression & Creativity (talents, children, ideas)',
    wealth: 'Resources & Opportunities (money, material world)',
    officer: 'Career & Authority (work, discipline, structure)'
  };

  return categories.map(cat => {
    const info = tenGods.tenGods[cat];
    const change = info.delta > 0.05 ? 'enhanced' : info.delta < -0.05 ? 'challenged' : 'stable';
    const emoji = info.delta > 0.05 ? '+' : info.delta < -0.05 ? '-' : '~';

    return `[${emoji}] ${descriptions[cat]}
    Seasonally ${change} (${(info.adjusted * 100).toFixed(0)}% strength)`;
  }).join('\n\n');
}

function generatePersonalInsight(
  seasonality: SeasonalityResult,
  dmSeasonal: DMSeasonalityResult,
  tenGods: TenGodsSeasonalityResult
): string {
  const insights: string[] = [];

  // DM strength insight
  if (dmSeasonal.adjustedStrength > 0.6) {
    insights.push("Your strong Day Master suggests you have natural resilience. You can handle pressure well, but watch for being too forceful.");
  } else if (dmSeasonal.adjustedStrength < 0.4) {
    insights.push("Your Day Master benefits from support. Seek out nurturing relationships and don't hesitate to accept help.");
  } else {
    insights.push("Your Day Master is balanced - you can adapt to both giving and receiving energy.");
  }

  // Dominant shift insight
  if (seasonality.dominantChanged) {
    insights.push(`Interestingly, the season shifts your dominant element from ${capitalize(seasonality.dominantBefore)} to ${capitalize(seasonality.dominantAfter)}. This means the environmental influence is significant in your chart.`);
  }

  // Ten Gods insight
  const strongestTenGod = Object.values(tenGods.tenGods).sort((a, b) => b.adjusted - a.adjusted)[0];
  const weakestTenGod = Object.values(tenGods.tenGods).sort((a, b) => a.adjusted - b.adjusted)[0];

  insights.push(`Your seasonally strongest life domain is ${strongestTenGod.name} - this area may feel more natural or lucky for you.`);
  insights.push(`Your seasonally weakest domain is ${weakestTenGod.name} - this area benefits from conscious attention and cultivation.`);

  return insights.join('\n\n');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// PAIRWISE STORY (For Compatibility)
// ============================================================================

/**
 * Build a story comparing two people's seasonality.
 */
export function buildPairSeasonalityStory(
  seasonalityA: SeasonalityResult,
  seasonalityB: SeasonalityResult,
  labelA: string = 'Person A',
  labelB: string = 'Person B'
): string {
  const seasonMetaA = SEASON_METAPHORS[seasonalityA.season] || SEASON_METAPHORS.spring;
  const seasonMetaB = SEASON_METAPHORS[seasonalityB.season] || SEASON_METAPHORS.spring;

  const dominantA = getDominantElements(seasonalityA);
  const dominantB = getDominantElements(seasonalityB);

  return `
Two Seasons, Two Constitutions
${'─'.repeat(50)}

${labelA} was born in ${seasonMetaA.label} (month ${seasonalityA.monthBranch}),
while ${labelB} was born in ${seasonMetaB.label} (month ${seasonalityB.monthBranch}).

This means:

${labelA}'s environment emphasizes: ${dominantA.join(', ')}
${labelB}'s environment emphasizes: ${dominantB.join(', ')}

Understanding Differences
${'─'.repeat(50)}

When you understand that each person's reactions, needs, and rhythms are shaped
by their elemental constitution and seasonality, it becomes easier to respect
differences instead of judging them.

Seasonality is not an excuse - it is a context. It explains why some people feel
more driven, others more reflective, some more fiery, others more grounded.

${seasonMetaA.label === seasonMetaB.label ?
    `Both of you share the same seasonal influence, which creates natural understanding
and similar rhythms. You likely "get" each other's energy intuitively.` :
    `Your different seasonal influences mean you approach life with different energies.
This can create complementary balance - or friction, if not understood with compassion.`
  }

The Practice of Mutual Respect
${'─'.repeat(50)}

By seeing both charts side by side, you can practice mutual understanding:

"I see why you are like this, and I honor it."

Instead of:

"Why can't you be more like me?"

This is the foundation of harmonious relationship - not changing each other,
but understanding each other's elemental nature.
`.trim();
}

function getDominantElements(seasonality: SeasonalityResult): string[] {
  const entries = Object.entries(seasonality.adjustedNormalized || seasonality.normalized);
  const max = Math.max(...entries.map(([_, v]) => v as number));
  return entries
    .filter(([_, v]) => (v as number) >= max - 5) // Within 5% of max
    .map(([el]) => capitalize(el));
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildSeasonalityStory,
  buildSeasonalityStoryWithPolarityRootedness,
  buildPairSeasonalityStory,
  SEASON_METAPHORS,
  ELEMENT_METAPHORS,
  POLARITY_METAPHORS,
  ROOTEDNESS_METAPHORS
};

export {
  POLARITY_METAPHORS,
  DM_POLARITY_NARRATIVES,
  ROOTEDNESS_METAPHORS
};
