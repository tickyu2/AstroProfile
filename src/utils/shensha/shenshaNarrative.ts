/**
 * ============================================================================
 * SHEN SHA NARRATIVE BUILDER (神煞故事)
 * ============================================================================
 *
 * Gentle, Khan-Academy-style narratives for Shen Sha (Symbolic Stars).
 * Designed for beginners who want to understand their chart's special markers
 * without superstition or fear.
 *
 * Philosophy:
 * - Stars are pattern markers, not fate decrees
 * - Auspicious stars indicate gifts to develop
 * - Challenging stars indicate areas for awareness
 * - All stars can be channeled consciously
 *
 * Created: January 2026
 * ============================================================================
 */

import {
  ShenShaResult,
  ShenShaHit,
  PillarName
} from './shenshaEngine';

import {
  ShenShaCategory,
  CATEGORY_META
} from './shenshaDefs';

// ============================================================================
// STAR METAPHORS
// ============================================================================

const STAR_METAPHORS: Record<string, {
  metaphor: string;
  lifeGift: string;
  practice: string;
}> = {
  peach_blossom: {
    metaphor: 'like a blooming peach tree in spring - naturally attracting bees and admirers',
    lifeGift: 'Your chart carries a natural magnetism. People are drawn to you without effort.',
    practice: 'Channel this energy consciously. Be aware of the attention you attract.'
  },
  heavenly_nobleman: {
    metaphor: 'like having a guardian watching over your journey - help appears when truly needed',
    lifeGift: 'Benefactors will appear in your life at crucial moments. Trust that help comes.',
    practice: 'Stay open to help from unexpected sources. Be grateful and pay it forward.'
  },
  academic_star: {
    metaphor: 'like a clear lens that focuses light into understanding',
    lifeGift: 'Your mind is naturally suited for learning, analysis, and clear communication.',
    practice: 'Never stop learning. Your gift grows stronger with use.'
  },
  literary_star: {
    metaphor: 'like a instrument that resonates with beauty and creativity',
    lifeGift: 'Artistic and creative expression flows through you naturally.',
    practice: 'Create regularly. Your art has the power to touch others.'
  },
  traveling_horse: {
    metaphor: 'like a horse ready to gallop - restless energy seeking new horizons',
    lifeGift: 'Movement and change energize you. Stagnation is your enemy.',
    practice: 'Travel, relocate, or find ways to keep moving. Your growth is linked to motion.'
  },
  general_star: {
    metaphor: 'like a commander who naturally draws followers and commands respect',
    lifeGift: 'Leadership is natural to you. Others look to you for direction.',
    practice: 'Lead with integrity. Your words and actions have weight.'
  },
  artistic_star: {
    metaphor: 'like a lone artist in their studio - creativity flourishing in solitude',
    lifeGift: 'Your creativity deepens in quietude. You see what others miss.',
    practice: 'Embrace your need for solitude. It feeds your unique gifts.'
  },
  prosperity_star: {
    metaphor: 'like a natural spring that provides steady water',
    lifeGift: 'Resources flow to you through effort. Your work is naturally rewarded.',
    practice: 'Trust in your ability to earn. Value stable growth over speculation.'
  },
  heavenly_doctor: {
    metaphor: 'like a healer whose touch brings comfort and recovery',
    lifeGift: 'You have natural healing presence. Others feel better around you.',
    practice: 'Consider healing professions or simply being a healing presence for friends.'
  },
  red_matchmaker: {
    metaphor: 'like a thread connecting hearts - romantic timing activated',
    lifeGift: 'Romantic opportunities come at the right time. Trust the timing.',
    practice: 'Be open to love. Your chart supports relationship formation.'
  },
  sky_happiness: {
    metaphor: 'like a celebration waiting to happen - joy is your natural frequency',
    lifeGift: 'Happy events gravitate toward you. Celebrations find you.',
    practice: 'Cultivate joy. It multiplies in your presence.'
  },
  tai_ji_nobleman: {
    metaphor: 'like an inner compass pointing toward truth and wisdom',
    lifeGift: 'Your intuition is reliable. Trust your inner knowing.',
    practice: 'Develop your spiritual side. Meditation and reflection strengthen your gift.'
  },
  robbery_sha: {
    metaphor: 'like a reminder to lock your doors - awareness protects',
    lifeGift: 'Your awareness of potential loss makes you more strategic.',
    practice: 'Protect what matters. Be mindful of security without becoming fearful.'
  },
  calamity_sha: {
    metaphor: 'like a "caution" sign on the road - proceed with awareness',
    lifeGift: 'Your heightened awareness of danger keeps you prepared.',
    practice: 'Take reasonable precautions. Good insurance and preparation serve you well.'
  },
  solitary_star: {
    metaphor: 'like a mountain standing alone - independence is your strength',
    lifeGift: 'Your self-reliance is powerful. You don\'t need others to be complete.',
    practice: 'Honor your independence while remaining open to connection.'
  },
  widow_star: {
    metaphor: 'like the moon comfortable in its own light',
    lifeGift: 'Emotional self-sufficiency allows you to be whole alone.',
    practice: 'Find partners who respect your need for emotional space.'
  }
};

// ============================================================================
// PILLAR MEANINGS
// ============================================================================

const PILLAR_MEANINGS: Record<PillarName, string> = {
  year: 'ancestors, early life, and social/public image',
  month: 'career, parents, and the path of life',
  day: 'the self, spouse, and intimate relationships',
  hour: 'children, legacy, and later life'
};

// ============================================================================
// MAIN NARRATIVE BUILDER
// ============================================================================

/**
 * Build a gentle, beginner-friendly narrative about Shen Sha
 */
export function buildShenShaStory(result: ShenShaResult): string {
  if (result.totalHits === 0) {
    return buildNoStarsStory();
  }

  let story = `
${'═'.repeat(60)}
YOUR SYMBOLIC STARS (神煞)
${'═'.repeat(60)}

Think of Shen Sha as "special markers" in your chart - like stars
in a constellation that highlight certain themes in your life.

These are NOT fortune-telling predictions. They are patterns that
indicate tendencies, gifts, and areas for awareness.

FOUND IN YOUR CHART: ${result.totalHits} symbolic stars
${result.auspiciousCount > 0 ? `• ${result.auspiciousCount} beneficial stars (natural gifts)` : ''}
${result.neutralCount > 0 ? `• ${result.neutralCount} neutral stars (depends on use)` : ''}
${result.inauspiciousCount > 0 ? `• ${result.inauspiciousCount} awareness stars (areas for attention)` : ''}

`;

  // Add notable stars section
  if (result.notableStars.length > 0) {
    story += `
${'─'.repeat(50)}
YOUR NOTABLE STARS
${'─'.repeat(50)}

`;
    for (const star of result.notableStars) {
      const metaphor = STAR_METAPHORS[star.key];
      story += `${star.han} (${star.label})\n`;
      story += `Found in: ${capitalize(star.pillar)} Pillar (${PILLAR_MEANINGS[star.pillar]})\n\n`;

      if (metaphor) {
        story += `You are ${metaphor.metaphor}.\n\n`;
        story += `${metaphor.lifeGift}\n\n`;
        story += `Practice: ${metaphor.practice}\n\n`;
      } else {
        story += `${star.definition.modernInterpretation}\n\n`;
      }
    }
  }

  // Add by category
  story += buildCategorySection(result);

  // Add wisdom section
  story += `
${'═'.repeat(60)}
WORKING WITH YOUR STARS
${'═'.repeat(60)}

BENEFICIAL STARS
These indicate natural gifts. They don't guarantee success, but
they show where energy flows easily. Develop these gifts consciously.

NEUTRAL STARS
These can go either way. Peach Blossom can mean charm or scattered
romance. How you use the energy determines the outcome.

AWARENESS STARS
These don't mean bad things will happen. They highlight areas where
conscious attention yields benefits. Think of them as "handle with care."

Remember: Your stars don't determine your destiny.
They illuminate the landscape you're navigating.

"Know your stars, and you navigate by their light."
`;

  return story.trim();
}

/**
 * Build story when no stars detected
 */
function buildNoStarsStory(): string {
  return `
${'═'.repeat(60)}
YOUR SYMBOLIC STARS (神煞)
${'═'.repeat(60)}

No major Shen Sha (Symbolic Stars) were detected in your chart.

This is neither good nor bad - it simply means the classical
symbolic stars don't strongly appear in your particular chart.

Your chart's story is told through other elements:
• Your elemental balance and seasonality
• Your Day Master strength and rootedness
• Your Structure (格局) and dominant Ten Gods
• Your Yin/Yang polarity

These factors provide the main themes of your chart.
The absence of symbolic stars means fewer "special markers"
to navigate - your path is defined more by fundamental energies.

"A chart without stars is not empty -
 it is a canvas painted with elements alone."
`.trim();
}

/**
 * Build section grouped by category
 */
function buildCategorySection(result: ShenShaResult): string {
  let section = `
${'─'.repeat(50)}
YOUR STARS BY LIFE DOMAIN
${'─'.repeat(50)}

`;

  const orderedCategories: ShenShaCategory[] = [
    'nobleman',
    'intelligence',
    'relationship',
    'wealth',
    'movement',
    'spiritual',
    'challenge'
  ];

  for (const category of orderedCategories) {
    const hits = result.byCategory[category];
    if (hits.length === 0) continue;

    const meta = CATEGORY_META[category];
    section += `${meta.icon} ${meta.han} (${meta.label})\n`;
    section += `${meta.description}\n\n`;

    for (const hit of hits) {
      section += `  • ${hit.han} (${hit.label}) - ${capitalize(hit.pillar)} pillar\n`;
      section += `    ${hit.definition.description}\n\n`;
    }
  }

  return section;
}

// ============================================================================
// BRIEF SUMMARIES FOR UI
// ============================================================================

/**
 * Get a brief star summary for cards/badges
 */
export function getStarSummary(hit: ShenShaHit): {
  name: string;
  icon: string;
  brief: string;
  pillar: string;
} {
  const icons: Record<ShenShaCategory, string> = {
    relationship: '💕',
    intelligence: '📚',
    nobleman: '👤',
    movement: '🐎',
    wealth: '💰',
    challenge: '⚠',
    spiritual: '✨'
  };

  return {
    name: `${hit.han} ${hit.label}`,
    icon: icons[hit.category] || '⭐',
    brief: hit.definition.keywords.slice(0, 3).join(', '),
    pillar: capitalize(hit.pillar)
  };
}

/**
 * Get all star summaries for UI display
 */
export function getStarSummaries(result: ShenShaResult): Array<{
  name: string;
  icon: string;
  brief: string;
  pillar: string;
}> {
  return result.hits.map(getStarSummary);
}

// ============================================================================
// PAIR COMPATIBILITY NARRATIVE
// ============================================================================

/**
 * Build narrative comparing two people's Shen Sha
 */
export function buildPairShenShaStory(
  resultA: ShenShaResult,
  resultB: ShenShaResult,
  labelA: string = 'Person A',
  labelB: string = 'Person B'
): string {
  let story = `
${'═'.repeat(60)}
SYMBOLIC STARS COMPARISON
${labelA} vs ${labelB}
${'═'.repeat(60)}

`;

  // Compare nobleman stars
  const hasNoblemanA = resultA.hits.some(h => h.key === 'heavenly_nobleman');
  const hasNoblemanB = resultB.hits.some(h => h.key === 'heavenly_nobleman');

  if (hasNoblemanA && hasNoblemanB) {
    story += `Both have Heavenly Nobleman - a blessed pairing. Help comes easily to this relationship.\n\n`;
  } else if (hasNoblemanA) {
    story += `${labelA} has Heavenly Nobleman and can be a source of support for ${labelB}.\n\n`;
  } else if (hasNoblemanB) {
    story += `${labelB} has Heavenly Nobleman and can be a source of support for ${labelA}.\n\n`;
  }

  // Compare relationship stars
  const peachBlossomA = resultA.hits.filter(h => h.key === 'peach_blossom').length;
  const peachBlossomB = resultB.hits.filter(h => h.key === 'peach_blossom').length;

  if (peachBlossomA > 0 && peachBlossomB > 0) {
    story += `Both have Peach Blossom - mutual attraction is strong. Be mindful of outside attention.\n\n`;
  } else if (peachBlossomA > 0 || peachBlossomB > 0) {
    const who = peachBlossomA > 0 ? labelA : labelB;
    story += `${who} has Peach Blossom - natural charm that attracts attention. The partner should understand this is their nature.\n\n`;
  }

  // Compare movement stars
  const horseA = resultA.hits.some(h => h.key === 'traveling_horse');
  const horseB = resultB.hits.some(h => h.key === 'traveling_horse');

  if (horseA && horseB) {
    story += `Both have Traveling Horse - a relationship that thrives on movement and adventure.\n\n`;
  } else if (horseA !== horseB) {
    const traveler = horseA ? labelA : labelB;
    const homebody = horseA ? labelB : labelA;
    story += `${traveler} has Traveling Horse while ${homebody} does not - discuss expectations around travel and change.\n\n`;
  }

  // Summary
  story += `
${'─'.repeat(50)}
COMPATIBILITY INSIGHTS
${'─'.repeat(50)}

${labelA}: ${resultA.totalHits} stars (${resultA.auspiciousCount} auspicious)
${labelB}: ${resultB.totalHits} stars (${resultB.auspiciousCount} auspicious)

Understanding each other's stars helps you support each other's
natural tendencies and navigate differences with wisdom.
`;

  return story.trim();
}

// ============================================================================
// HELPERS
// ============================================================================

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildShenShaStory,
  buildPairShenShaStory,
  getStarSummary,
  getStarSummaries,
  STAR_METAPHORS,
  PILLAR_MEANINGS
};

export {
  STAR_METAPHORS,
  PILLAR_MEANINGS
};
