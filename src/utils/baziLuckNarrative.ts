/**
 * ============================================================================
 * LUCK PILLAR NARRATIVE - Story Mode for Life Decades
 * ============================================================================
 *
 * This module generates engaging, beginner-friendly narratives about
 * Luck Pillars (大运) - the 10-year cycles that shape life's journey.
 *
 * Following the "Khan Academy Show Your Work" philosophy, we explain
 * complex BaZi timing concepts through relatable stories and metaphors.
 *
 * Created: January 2026
 * ============================================================================
 */

import {
  LuckPillarFavorability,
  LuckPillarTimelineResult,
  FavorabilityTier
} from './baziLuckFavorability';
import { ElementName } from './baziUsefulGod';

// ============================================================================
// TYPES
// ============================================================================

export interface LuckPillarStory {
  title: string;
  ageRange: string;
  tierEmoji: string;
  opening: string;
  elementaryAnalysis: string;
  conflictSection: string;
  opportunitySection: string;
  advice: string;
  closingMetaphor: string;
}

export interface TimelineStory {
  overviewTitle: string;
  introduction: string;
  decadeStories: LuckPillarStory[];
  peakPeriodHighlight: string;
  challengePeriodHighlight: string;
  currentPeriodInsight: string;
  lifePatternSummary: string;
  closingWisdom: string;
}

// ============================================================================
// TIER STYLING
// ============================================================================

const TIER_CONFIG: Record<FavorabilityTier, {
  emoji: string;
  color: string;
  label: string;
  weatherMetaphor: string;
}> = {
  excellent: {
    emoji: '🌟',
    color: 'gold',
    label: 'Excellent',
    weatherMetaphor: 'clear skies with gentle tailwinds'
  },
  good: {
    emoji: '☀️',
    color: 'green',
    label: 'Good',
    weatherMetaphor: 'sunny with occasional clouds'
  },
  neutral: {
    emoji: '⛅',
    color: 'gray',
    label: 'Neutral',
    weatherMetaphor: 'changeable weather - pack for anything'
  },
  challenging: {
    emoji: '🌧️',
    color: 'orange',
    label: 'Challenging',
    weatherMetaphor: 'storms to navigate, but rainbows possible'
  },
  difficult: {
    emoji: '⛈️',
    color: 'red',
    label: 'Difficult',
    weatherMetaphor: 'heavy weather requiring strong shelter'
  }
};

// ============================================================================
// ELEMENT NARRATIVES
// ============================================================================

const ELEMENT_LIFE_THEMES: Record<ElementName, {
  asUseful: string;
  asAnnoying: string;
  activities: string[];
}> = {
  Wood: {
    asUseful: 'growth, new beginnings, and expansion into new territories',
    asAnnoying: 'scattered energy, too many directions at once, or impractical idealism',
    activities: ['education', 'personal development', 'starting businesses', 'family growth']
  },
  Fire: {
    asUseful: 'recognition, visibility, passion projects, and inspired action',
    asAnnoying: 'burnout, conflicts, unwanted attention, or heated disputes',
    activities: ['public roles', 'creative expression', 'marketing', 'entertainment']
  },
  Earth: {
    asUseful: 'stability, property, reliable income, and grounded decisions',
    asAnnoying: 'stagnation, excessive worry, property problems, or health concerns',
    activities: ['real estate', 'savings', 'family matters', 'health focus']
  },
  Metal: {
    asUseful: 'valuable connections, financial gains, precision, and clarity',
    asAnnoying: 'harsh judgments, losses, separations, or respiratory issues',
    activities: ['finance', 'legal matters', 'technology', 'networking']
  },
  Water: {
    asUseful: 'wisdom, adaptability, travel, and going with the flow',
    asAnnoying: 'fear, confusion, emotional overwhelm, or scattered focus',
    activities: ['travel', 'research', 'spiritual pursuits', 'creative writing']
  }
};

// ============================================================================
// AGE PHASE CONTEXT
// ============================================================================

function getAgePhaseContext(startAge: number, endAge: number): string {
  if (startAge < 10) {
    return 'This is your childhood foundation period, setting patterns for life.';
  } else if (startAge < 20) {
    return 'These are your formative years - education, identity, and first adventures.';
  } else if (startAge < 30) {
    return 'This decade is about establishing yourself - career, relationships, independence.';
  } else if (startAge < 40) {
    return 'These years focus on building - family, career growth, property, stability.';
  } else if (startAge < 50) {
    return 'This is often a power decade - peak earning, influence, and responsibility.';
  } else if (startAge < 60) {
    return 'This period balances achievement with reflection - legacy becomes important.';
  } else if (startAge < 70) {
    return 'These years offer wisdom, mentorship opportunities, and harvesting what you planted.';
  } else {
    return 'This is a time of reflection, legacy, and sharing accumulated wisdom.';
  }
}

// ============================================================================
// STORY GENERATION
// ============================================================================

/**
 * Build a story for a single luck pillar
 */
export function buildLuckPillarStory(pillar: LuckPillarFavorability): LuckPillarStory {
  const tierConfig = TIER_CONFIG[pillar.tier];

  // Title
  const title = `${tierConfig.emoji} Age ${pillar.startAge}-${pillar.endAge}: ${pillar.pillarDisplay} — ${tierConfig.label}`;

  // Age range context
  const ageRange = getAgePhaseContext(pillar.startAge, pillar.endAge);

  // Opening
  const opening = generateOpening(pillar, tierConfig);

  // Element analysis
  const elementaryAnalysis = generateElementAnalysis(pillar);

  // Conflict section
  const conflictSection = generateConflictSection(pillar);

  // Opportunity section
  const opportunitySection = generateOpportunitySection(pillar);

  // Advice
  const advice = pillar.advice;

  // Closing metaphor
  const closingMetaphor = generateClosingMetaphor(pillar, tierConfig);

  return {
    title,
    ageRange,
    tierEmoji: tierConfig.emoji,
    opening,
    elementaryAnalysis,
    conflictSection,
    opportunitySection,
    advice,
    closingMetaphor
  };
}

/**
 * Build a complete timeline story
 */
export function buildTimelineStory(
  timeline: LuckPillarTimelineResult,
  personName?: string
): TimelineStory {
  const name = personName || 'You';

  const overviewTitle = `📜 ${name}'s Life Journey Through the Decades`;

  const introduction = generateTimelineIntroduction(timeline, name);

  const decadeStories = timeline.pillars.map(p => buildLuckPillarStory(p));

  const peakPeriodHighlight = timeline.bestDecade
    ? generatePeakHighlight(timeline.bestDecade)
    : 'No clear peak period identified - consistency throughout.';

  const challengePeriodHighlight = timeline.worstDecade
    ? generateChallengeHighlight(timeline.worstDecade)
    : 'No significant challenge period - smooth sailing overall.';

  const currentPeriodInsight = timeline.currentDecade
    ? generateCurrentInsight(timeline.currentDecade)
    : 'Current period not identified.';

  const lifePatternSummary = timeline.lifeSummary;

  const closingWisdom = generateTimelineWisdom(timeline);

  return {
    overviewTitle,
    introduction,
    decadeStories,
    peakPeriodHighlight,
    challengePeriodHighlight,
    currentPeriodInsight,
    lifePatternSummary,
    closingWisdom
  };
}

// ============================================================================
// HELPER GENERATORS
// ============================================================================

function generateOpening(pillar: LuckPillarFavorability, tierConfig: typeof TIER_CONFIG[FavorabilityTier]): string {
  const parts: string[] = [];

  parts.push(`During age ${pillar.startAge} to ${pillar.endAge}, the ${pillar.pillarDisplay} pillar governs your luck.`);
  parts.push(`The forecast shows ${tierConfig.weatherMetaphor}.`);

  if (pillar.score >= 70) {
    parts.push(`This is one of your stronger periods - the universe is aligned to support your efforts.`);
  } else if (pillar.score >= 50) {
    parts.push(`This period has good potential, though it requires conscious effort to maximize.`);
  } else if (pillar.score >= 30) {
    parts.push(`This period asks for patience and strategic navigation.`);
  } else {
    parts.push(`This is a period for building resilience and inner strength.`);
  }

  return parts.join(' ');
}

function generateElementAnalysis(pillar: LuckPillarFavorability): string {
  const parts: string[] = [];

  parts.push(`**Element Energy:**`);
  parts.push(`The Heavenly Stem ${pillar.pillarStem} brings ${pillar.stemElement} energy.`);
  parts.push(`The Earthly Branch ${pillar.pillarBranch} carries ${pillar.branchElement} energy.`);

  if (pillar.usefulActivated.length > 0) {
    const themes = pillar.usefulActivated.map(e =>
      ELEMENT_LIFE_THEMES[e].asUseful
    ).join('; ');
    parts.push(``);
    parts.push(`✅ **Useful Energy Present:** ${pillar.usefulActivated.join(' and ')}`);
    parts.push(`This supports ${themes}.`);
    parts.push(`Good activities: ${pillar.usefulActivated.flatMap(e => ELEMENT_LIFE_THEMES[e].activities).slice(0, 3).join(', ')}.`);
  }

  if (pillar.annoyingActivated.length > 0) {
    const themes = pillar.annoyingActivated.map(e =>
      ELEMENT_LIFE_THEMES[e].asAnnoying
    ).join('; ');
    parts.push(``);
    parts.push(`⚠️ **Challenging Energy Present:** ${pillar.annoyingActivated.join(' and ')}`);
    parts.push(`Watch for ${themes}.`);
  }

  return parts.join('\n');
}

function generateConflictSection(pillar: LuckPillarFavorability): string {
  if (pillar.conflicts.length === 0) {
    return '**Harmony Check:** No major conflicts with your natal chart this decade. Energy flows smoothly.';
  }

  const parts: string[] = [];
  parts.push(`**Conflict Alerts:**`);

  pillar.conflicts.forEach(c => {
    const emoji = c.severity === 'major' ? '🔴' : c.severity === 'moderate' ? '🟠' : '🟡';
    parts.push(`${emoji} ${c.description}`);

    if (c.type === 'clash') {
      parts.push(`   *Clashes bring change and movement. Prepare for transitions.*`);
    } else if (c.type === 'harm') {
      parts.push(`   *Harms create subtle friction. Address small issues early.*`);
    }
  });

  return parts.join('\n');
}

function generateOpportunitySection(pillar: LuckPillarFavorability): string {
  const parts: string[] = [];
  parts.push(`**Opportunities:**`);

  if (pillar.shensha.length > 0) {
    pillar.shensha.forEach(s => {
      if (s.isPositive) {
        parts.push(`✨ ${s.chineseName} (${s.name}) is activated!`);
        parts.push(`   ${s.description}`);
      }
    });
  }

  if (pillar.transformations.length > 0) {
    pillar.transformations.forEach(t => {
      parts.push(`🔄 ${t.type}: ${t.description}`);
      parts.push(`   This creates ${t.resultElement} energy through combination.`);
    });
  }

  if (pillar.shensha.length === 0 && pillar.transformations.length === 0) {
    if (pillar.tier === 'excellent' || pillar.tier === 'good') {
      parts.push(`The favorable energy itself is your opportunity. Take initiative.`);
    } else {
      parts.push(`Focus on building foundations. Opportunities emerge through consistency.`);
    }
  }

  return parts.join('\n');
}

function generateClosingMetaphor(pillar: LuckPillarFavorability, tierConfig: typeof TIER_CONFIG[FavorabilityTier]): string {
  const metaphors: Record<FavorabilityTier, string[]> = {
    excellent: [
      'Like sailing with a perfect wind, this decade carries you forward naturally.',
      'The seeds you plant now will grow into mighty trees.',
      'This is your time to shine - the stage is set for your performance.'
    ],
    good: [
      'Like a steady stream, progress comes through consistent effort.',
      'Good fortune favors the prepared - lay your groundwork well.',
      'The wind is at your back, but you still need to steer.'
    ],
    neutral: [
      'Like a calm sea, you can go anywhere - but you must row.',
      'Neither headwind nor tailwind - your effort determines direction.',
      'This is the potter\'s decade - shape your clay with intention.'
    ],
    challenging: [
      'Like climbing a mountain, each step requires focus, but the view from the top rewards.',
      'The strongest steel is forged in the hottest fire.',
      'Challenges are teachers in disguise - learn their lessons well.'
    ],
    difficult: [
      'Like the bamboo that bends in the storm, flexibility ensures survival.',
      'Even in the deepest winter, spring is already preparing.',
      'The lotus grows most beautifully in the muddiest waters.'
    ]
  };

  const options = metaphors[pillar.tier];
  const index = (pillar.startAge + pillar.score) % options.length;
  return options[index];
}

function generateTimelineIntroduction(timeline: LuckPillarTimelineResult, name: string): string {
  const parts: string[] = [];

  parts.push(`${name}'s life unfolds through ${timeline.pillars.length} major 10-year cycles, each bringing different energy and opportunities.`);
  parts.push(``);
  parts.push(timeline.overallPattern);

  const excellent = timeline.pillars.filter(p => p.tier === 'excellent').length;
  const good = timeline.pillars.filter(p => p.tier === 'good').length;
  const challenging = timeline.pillars.filter(p => p.tier === 'challenging' || p.tier === 'difficult').length;

  parts.push(``);
  parts.push(`**At a glance:** ${excellent} excellent periods, ${good} good periods, ${challenging} challenging periods.`);

  return parts.join('\n');
}

function generatePeakHighlight(best: LuckPillarFavorability): string {
  return `🌟 **Peak Period: Age ${best.startAge}-${best.endAge} (${best.pillarDisplay})**

Score: ${best.score}/100 - ${TIER_CONFIG[best.tier].label}

This decade brings your strongest support. ${best.usefulActivated.length > 0 ? `Your Useful God elements (${best.usefulActivated.join(', ')}) are activated.` : ''} Major initiatives, career moves, and life decisions are well-supported during this time. Plan to maximize this window.`;
}

function generateChallengeHighlight(worst: LuckPillarFavorability): string {
  return `⚠️ **Challenge Period: Age ${worst.startAge}-${worst.endAge} (${worst.pillarDisplay})**

Score: ${worst.score}/100 - ${TIER_CONFIG[worst.tier].label}

This decade requires more effort and patience. ${worst.annoyingActivated.length > 0 ? `Annoying God elements (${worst.annoyingActivated.join(', ')}) are present.` : ''} Focus on building resilience, avoiding major risks, and developing inner strength. This too shall pass.`;
}

function generateCurrentInsight(current: LuckPillarFavorability): string {
  const tierEmoji = TIER_CONFIG[current.tier].emoji;
  return `${tierEmoji} **Your Current Decade: ${current.pillarDisplay}**

Score: ${current.score}/100 - ${TIER_CONFIG[current.tier].label}

${current.summary}

*Advice: ${current.advice}*`;
}

function generateTimelineWisdom(timeline: LuckPillarTimelineResult): string {
  const avgScore = timeline.pillars.reduce((sum, p) => sum + p.score, 0) / timeline.pillars.length;

  if (avgScore >= 60) {
    return 'The ancient masters said: "Good fortune supports those who act with wisdom." Your timeline favors initiative - use it wisely.';
  } else if (avgScore >= 45) {
    return 'Life is a balance of challenge and ease. Your timeline teaches adaptability - the ability to flow with changing tides while holding true to your course.';
  } else {
    return 'The strongest trees grow in the fiercest winds. Your timeline is one of transformation through challenge - each difficulty contains a gift for those who seek it.';
  }
}

// ============================================================================
// UI PANEL GENERATORS
// ============================================================================

/**
 * Generate a compact panel for UI display
 */
export function getLuckPillarPanel(pillar: LuckPillarFavorability): string {
  const tierConfig = TIER_CONFIG[pillar.tier];
  const lines: string[] = [];

  lines.push(`╔═════════════════════════════════════════╗`);
  lines.push(`║  ${tierConfig.emoji} ${pillar.pillarDisplay}  Age ${pillar.startAge}-${pillar.endAge}  Score: ${pillar.score}  ║`);
  lines.push(`╠═════════════════════════════════════════╣`);
  lines.push(`║  Tier: ${pillar.tier.toUpperCase().padEnd(32)}║`);
  lines.push(`╠═════════════════════════════════════════╣`);

  if (pillar.usefulActivated.length > 0) {
    lines.push(`║  ✅ Useful: ${pillar.usefulActivated.join(', ').padEnd(27)}║`);
  }
  if (pillar.annoyingActivated.length > 0) {
    lines.push(`║  ❌ Annoying: ${pillar.annoyingActivated.join(', ').padEnd(25)}║`);
  }

  if (pillar.conflicts.length > 0) {
    lines.push(`║  ⚔️ Conflicts: ${pillar.conflicts.length.toString().padEnd(24)}║`);
  }
  if (pillar.shensha.length > 0) {
    lines.push(`║  ✨ Shen Sha: ${pillar.shensha.map(s => s.chineseName).join(', ').substring(0, 23).padEnd(25)}║`);
  }

  lines.push(`╠═════════════════════════════════════════╣`);
  lines.push(`║  DM: ${pillar.dmImpact.padEnd(34)}║`);
  lines.push(`╚═════════════════════════════════════════╝`);

  return lines.join('\n');
}

/**
 * Generate a timeline bar visualization
 */
export function getTimelineBar(timeline: LuckPillarTimelineResult): string {
  const bars = timeline.pillars.map(p => {
    const tierConfig = TIER_CONFIG[p.tier];
    return `${tierConfig.emoji}${p.startAge}`;
  });

  return `Life Timeline: ${bars.join(' → ')}`;
}

// ============================================================================
// DEBUG OUTPUT
// ============================================================================

/**
 * Generate debug output for a luck pillar
 */
export function getLuckPillarDebug(pillar: LuckPillarFavorability): string {
  const lines: string[] = [];

  lines.push(`=== LUCK PILLAR DEBUG: ${pillar.pillarDisplay} (Age ${pillar.startAge}-${pillar.endAge}) ===`);
  lines.push(``);
  lines.push(`Score: ${pillar.score}/100`);
  lines.push(`Tier: ${pillar.tier}`);
  lines.push(`Confidence: ${(pillar.confidence * 100).toFixed(0)}%`);
  lines.push(``);
  lines.push(`--- ELEMENTS ---`);
  lines.push(`Stem: ${pillar.pillarStem} → ${pillar.stemElement} (Useful: ${pillar.stemUseful}, Annoying: ${pillar.stemAnnoying})`);
  lines.push(`Branch: ${pillar.pillarBranch} → ${pillar.branchElement} (Useful: ${pillar.branchUseful}, Annoying: ${pillar.branchAnnoying})`);
  lines.push(``);
  lines.push(`--- ACTIVATIONS ---`);
  lines.push(`Useful: ${pillar.usefulActivated.join(', ') || 'None'}`);
  lines.push(`Annoying: ${pillar.annoyingActivated.join(', ') || 'None'}`);
  lines.push(``);
  lines.push(`--- DM IMPACT ---`);
  lines.push(`Impact: ${pillar.dmImpact}`);
  lines.push(`Strength Delta: ${pillar.dmStrengthDelta > 0 ? '+' : ''}${(pillar.dmStrengthDelta * 100).toFixed(0)}%`);
  lines.push(``);
  lines.push(`--- CONFLICTS ---`);
  if (pillar.conflicts.length > 0) {
    pillar.conflicts.forEach(c => {
      lines.push(`${c.type.toUpperCase()} (${c.severity}): ${c.description}`);
    });
  } else {
    lines.push(`None`);
  }
  lines.push(``);
  lines.push(`--- TRANSFORMATIONS ---`);
  if (pillar.transformations.length > 0) {
    pillar.transformations.forEach(t => {
      lines.push(`${t.type}: ${t.description}`);
    });
  } else {
    lines.push(`None`);
  }
  lines.push(``);
  lines.push(`--- SHEN SHA ---`);
  if (pillar.shensha.length > 0) {
    pillar.shensha.forEach(s => {
      lines.push(`${s.isPositive ? '✅' : '⚠️'} ${s.chineseName} (${s.name})`);
    });
  } else {
    lines.push(`None activated`);
  }
  lines.push(``);
  lines.push(`--- REASONING ---`);
  pillar.reasoning.forEach(r => lines.push(r));

  return lines.join('\n');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildLuckPillarStory,
  buildTimelineStory,
  getLuckPillarPanel,
  getTimelineBar,
  getLuckPillarDebug,
  TIER_CONFIG,
  ELEMENT_LIFE_THEMES
};
