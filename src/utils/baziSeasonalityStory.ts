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
  buildPairSeasonalityStory,
  SEASON_METAPHORS,
  ELEMENT_METAPHORS
};
