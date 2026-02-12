/**
 * ============================================================================
 * MONTHLY LUCK NARRATIVE ENGINE (流月故事模式)
 * ============================================================================
 *
 * Transforms Monthly Luck Favorability analysis into human-readable narratives.
 *
 * Story Mode Features:
 * - Seasonal metaphors deeply integrated
 * - Weather/nature imagery for each month
 * - Triple compound effect explanations
 * - Clear "what to do" recommendations
 * - Calendar-style visual outputs
 *
 * Three output modes:
 * 1. STORY MODE: Poetic narrative with seasonal wisdom
 * 2. PANEL MODE: Structured display for UI components
 * 3. DEBUG MODE: Full calculation transparency for experts
 *
 * Joey Yap teaching:
 * "Monthly timing is where strategy becomes tactics.
 *  Know when to push, when to pause, when to pivot."
 *
 * Created: January 2026
 * Based on: Classical BaZi interpretation, Joey Yap methodology
 * ============================================================================
 */

import {
  MonthlyLuckFavorability,
  YearlyMonthsResult,
  MONTH_NAMES,
  MONTH_SEASONS
} from './baziMonthlyFavorability';
import { FavorabilityTier } from './baziLuckFavorability';
import { ElementName } from './baziUsefulGod';

// ============================================================================
// TYPES
// ============================================================================

export interface MonthlyStory {
  title: string;
  seasonalOpening: string;
  bodyParagraphs: string[];
  timingAdvice: string;
  actionItems: string[];
}

export interface YearlyMonthsStory {
  introduction: string;
  seasonalOverview: SeasonalOverview[];
  monthCards: MonthCard[];
  strategicAdvice: string;
  calendarView: string;
}

export interface SeasonalOverview {
  season: string;
  element: ElementName;
  months: number[];
  averageScore: number;
  description: string;
}

export interface MonthCard {
  month: number;
  chineseName: string;
  pillarDisplay: string;
  tier: FavorabilityTier;
  score: number;
  headline: string;
  colorCode: string;
  emoji: string;
}

// ============================================================================
// TIER CONFIGURATION
// ============================================================================

const TIER_CONFIG: Record<FavorabilityTier, {
  emoji: string;
  color: string;
  label: string;
  monthMetaphor: string;
}> = {
  excellent: {
    emoji: '🌟',
    color: '#FFD700',
    label: 'Excellent',
    monthMetaphor: 'clear skies and open roads'
  },
  good: {
    emoji: '☀️',
    color: '#90EE90',
    label: 'Good',
    monthMetaphor: 'favorable winds for progress'
  },
  neutral: {
    emoji: '⛅',
    color: '#FFE4B5',
    label: 'Mixed',
    monthMetaphor: 'variable conditions requiring adaptability'
  },
  challenging: {
    emoji: '🌧️',
    color: '#DDA0DD',
    label: 'Challenging',
    monthMetaphor: 'headwinds that build strength'
  },
  difficult: {
    emoji: '⛈️',
    color: '#CD5C5C',
    label: 'Difficult',
    monthMetaphor: 'storms that demand shelter and patience'
  }
};

// ============================================================================
// SEASONAL NARRATIVES
// ============================================================================

const SEASONAL_NARRATIVES: Record<string, {
  imagery: string;
  energy: string;
  wisdom: string;
  color: string;
}> = {
  spring: {
    imagery: 'awakening forests, budding branches, rushing streams',
    energy: 'growth, initiative, new beginnings',
    wisdom: 'Plant seeds now. What you start in spring takes root.',
    color: '#228B22'
  },
  summer: {
    imagery: 'blazing sun, peak bloom, vibrant activity',
    energy: 'passion, visibility, maximum expression',
    wisdom: 'Shine bright but avoid burnout. Channel heat productively.',
    color: '#FF4500'
  },
  autumn: {
    imagery: 'falling leaves, harvest moon, crisp clarity',
    energy: 'refinement, completion, decisive action',
    wisdom: 'Reap what you\'ve sown. Cut away the unnecessary.',
    color: '#DAA520'
  },
  winter: {
    imagery: 'still waters, deep rest, inner reflection',
    energy: 'conservation, wisdom, strategic planning',
    wisdom: 'Store energy for future growth. Plan, don\'t push.',
    color: '#4169E1'
  },
  'inter-season': {
    imagery: 'transitional moments, shifting ground, transformation',
    energy: 'grounding, transition, consolidation',
    wisdom: 'Earth energy stabilizes. Center yourself before moving on.',
    color: '#8B4513'
  }
};

// ============================================================================
// MONTH IMAGERY
// ============================================================================

const MONTH_IMAGERY: Record<number, {
  nature: string;
  activity: string;
  symbol: string;
}> = {
  1:  { nature: 'first thaw, tiger prowling', activity: 'awakening from winter', symbol: '🐯' },
  2:  { nature: 'spring rains, rabbit hopping', activity: 'gentle growth begins', symbol: '🐰' },
  3:  { nature: 'morning mist, dragon stirring', activity: 'transformation brewing', symbol: '🐲' },
  4:  { nature: 'warming days, snake emerging', activity: 'strategic movement', symbol: '🐍' },
  5:  { nature: 'peak heat, horse galloping', activity: 'maximum energy', symbol: '🐴' },
  6:  { nature: 'afternoon warmth, goat grazing', activity: 'nurturing and creativity', symbol: '🐐' },
  7:  { nature: 'first harvest, monkey swinging', activity: 'resourceful action', symbol: '🐒' },
  8:  { nature: 'golden fields, rooster crowing', activity: 'precision and timing', symbol: '🐓' },
  9:  { nature: 'falling leaves, dog guarding', activity: 'loyalty and duty', symbol: '🐕' },
  10: { nature: 'first frost, pig feasting', activity: 'abundance and rest', symbol: '🐷' },
  11: { nature: 'deep cold, rat planning', activity: 'strategy and conservation', symbol: '🐀' },
  12: { nature: 'year\'s end, ox resting', activity: 'completion and preparation', symbol: '🐂' }
};

// ============================================================================
// STORY BUILDERS
// ============================================================================

/**
 * Build a complete story for a single month
 */
export function buildMonthlyStory(monthly: MonthlyLuckFavorability): MonthlyStory {
  const tierConfig = TIER_CONFIG[monthly.tier];
  const monthInfo = MONTH_NAMES[monthly.month];
  const seasonInfo = SEASONAL_NARRATIVES[monthly.seasonalInfluence.season];
  const monthImagery = MONTH_IMAGERY[monthly.month];

  // Title
  const title = `${monthInfo.chinese} (${monthly.pillarDisplay}) - ${tierConfig.label} Month`;

  // Seasonal opening
  const seasonalOpening = buildSeasonalOpening(monthly, tierConfig, seasonInfo, monthImagery);

  // Body paragraphs
  const bodyParagraphs = buildMonthlyBody(monthly, tierConfig, seasonInfo);

  // Timing advice
  const timingAdvice = buildTimingAdvice(monthly, tierConfig);

  // Action items
  const actionItems = buildMonthlyActionItems(monthly);

  return {
    title,
    seasonalOpening,
    bodyParagraphs,
    timingAdvice,
    actionItems
  };
}

function buildSeasonalOpening(
  monthly: MonthlyLuckFavorability,
  tierConfig: typeof TIER_CONFIG[FavorabilityTier],
  seasonInfo: typeof SEASONAL_NARRATIVES[string],
  monthImagery: typeof MONTH_IMAGERY[number]
): string {
  const monthInfo = MONTH_NAMES[monthly.month];

  const contextParts: string[] = [];
  if (monthly.luckPillarContext) {
    contextParts.push(`within your ${monthly.luckPillarContext.tier} decade`);
  }
  if (monthly.annualContext) {
    contextParts.push(`${monthly.annualContext.tier} year`);
  }
  const contextPhrase = contextParts.length > 0 ? ` (${contextParts.join(', ')})` : '';

  if (monthly.tier === 'excellent') {
    return `${monthInfo.chinese} arrives like ${monthImagery.nature}${contextPhrase}. The energy of ${seasonInfo.imagery} flows strongly in your favor. This month brings ${tierConfig.monthMetaphor}, with ${seasonInfo.energy} amplifying your potential.`;
  }

  if (monthly.tier === 'good') {
    return `${monthInfo.chinese} unfolds with ${monthImagery.nature}${contextPhrase}. Amid ${seasonInfo.imagery}, you find ${tierConfig.monthMetaphor}. The season's ${seasonInfo.energy} gently supports your endeavors.`;
  }

  if (monthly.tier === 'neutral') {
    return `${monthInfo.chinese} presents ${monthImagery.activity}${contextPhrase}. The ${monthly.seasonalInfluence.season} energy of ${seasonInfo.imagery} brings ${tierConfig.monthMetaphor}. Neither strongly favorable nor challenging, this month rewards awareness.`;
  }

  if (monthly.tier === 'challenging') {
    return `${monthInfo.chinese} calls for resilience${contextPhrase}. While ${seasonInfo.imagery} surrounds you, the cosmic currents bring ${tierConfig.monthMetaphor}. The season's ${seasonInfo.energy} tests rather than supports.`;
  }

  return `${monthInfo.chinese} demands patience${contextPhrase}. The energy of ${monthly.seasonalInfluence.season} meets resistance in your chart, creating ${tierConfig.monthMetaphor}. This is ${monthImagery.activity} - a time for conservation, not expansion.`;
}

function buildMonthlyBody(
  monthly: MonthlyLuckFavorability,
  tierConfig: typeof TIER_CONFIG[FavorabilityTier],
  seasonInfo: typeof SEASONAL_NARRATIVES[string]
): string[] {
  const paragraphs: string[] = [];

  // Triple compound effect paragraph
  if (monthly.tripleCompound.type !== 'neutral') {
    paragraphs.push(buildTripleCompoundParagraph(monthly));
  }

  // Useful/Annoying God paragraph
  if (monthly.usefulActivated.length > 0 || monthly.annoyingActivated.length > 0) {
    paragraphs.push(buildElementActivationParagraph(monthly));
  }

  // Seasonal alignment paragraph
  paragraphs.push(buildSeasonalAlignmentParagraph(monthly, seasonInfo));

  // Conflicts paragraph
  const allConflicts = [...monthly.natalConflicts, ...monthly.luckPillarConflicts, ...monthly.annualConflicts];
  if (allConflicts.length > 0) {
    paragraphs.push(buildConflictsParagraph(monthly, allConflicts));
  }

  // Shen Sha paragraph
  if (monthly.shensha.length > 0) {
    paragraphs.push(buildShenshaParagraph(monthly));
  }

  return paragraphs;
}

function buildTripleCompoundParagraph(monthly: MonthlyLuckFavorability): string {
  const { tripleCompound } = monthly;

  if (tripleCompound.type === 'triple_synergy') {
    return `Remarkably, all three timing layers - your current decade, this year, and this month - align in your favor. This TRIPLE SYNERGY is rare and powerful. ${tripleCompound.description} The cosmic currents converge to support your actions. This is the time for bold moves.`;
  }

  if (tripleCompound.type === 'triple_conflict') {
    return `This month faces a challenging alignment: decade, year, and month all activate challenging elements. ${tripleCompound.description} This is not permanent - it's a period for conservation and inner work. What you learn now becomes wisdom.`;
  }

  if (tripleCompound.type === 'double_synergy') {
    return `Two of three timing layers work in your favor. ${tripleCompound.description} While not the strongest possible alignment, this still provides meaningful support for progress.`;
  }

  if (tripleCompound.type === 'double_conflict') {
    return `Two timing layers present challenges this month. ${tripleCompound.description} Focus on the supportive layer while navigating the obstacles.`;
  }

  // Mixed
  return `The timing layers show mixed signals: some support, some challenge. ${tripleCompound.description} Success comes from reading the moment correctly and adjusting your approach.`;
}

function buildElementActivationParagraph(monthly: MonthlyLuckFavorability): string {
  const parts: string[] = [];

  if (monthly.usefulActivated.length > 0) {
    parts.push(`Your Useful God elements (${monthly.usefulActivated.join(' and ')}) are activated by this month's pillar. This is cosmic support - the energy you need flows freely.`);
  }

  if (monthly.annoyingActivated.length > 0) {
    parts.push(`The Annoying God elements (${monthly.annoyingActivated.join(' and ')}) are also present. Balance the support with awareness of these challenges.`);
  }

  return parts.join(' ');
}

function buildSeasonalAlignmentParagraph(
  monthly: MonthlyLuckFavorability,
  seasonInfo: typeof SEASONAL_NARRATIVES[string]
): string {
  const { seasonalInfluence } = monthly;

  if (seasonalInfluence.alignment === 'strong') {
    return `The ${seasonalInfluence.season} season strongly supports your chart. ${seasonInfo.wisdom} Use this natural alignment to amplify your efforts.`;
  }

  if (seasonalInfluence.alignment === 'contrary') {
    return `The ${seasonalInfluence.season} seasonal energy works against your natural rhythm. ${seasonInfo.wisdom} Adapt to the seasonal current rather than fighting it.`;
  }

  if (seasonalInfluence.alignment === 'moderate') {
    return `The ${seasonalInfluence.season} season offers moderate support. ${seasonInfo.wisdom}`;
  }

  return `The ${seasonalInfluence.season} season has neutral effect on your chart. ${seasonInfo.wisdom}`;
}

function buildConflictsParagraph(monthly: MonthlyLuckFavorability, conflicts: Array<{ severity: string; description: string }>): string {
  const majorConflicts = conflicts.filter(c => c.severity === 'major');

  if (majorConflicts.length > 0) {
    return `This month triggers significant cosmic tensions: ${majorConflicts.map(c => c.description).join('; ')}. These are growth opportunities disguised as obstacles. Navigate with awareness, and transform challenge into strength.`;
  }

  return `Some minor frictions appear this month: ${conflicts.slice(0, 2).map(c => c.description).join('; ')}. These require attention but don't dominate the month's energy.`;
}

function buildShenshaParagraph(monthly: MonthlyLuckFavorability): string {
  const positive = monthly.shensha.filter(s => s.isPositive);
  const negative = monthly.shensha.filter(s => !s.isPositive);

  const parts: string[] = [];

  if (positive.length > 0) {
    const stars = positive.map(s => `${s.chineseName} (${s.name})`).join(', ');
    parts.push(`Auspicious stars shine this month: ${stars}. ${positive[0].description}.`);
  }

  if (negative.length > 0) {
    const stars = negative.map(s => `${s.chineseName} (${s.name})`).join(', ');
    parts.push(`Cautionary influences present: ${stars}. Exercise mindfulness.`);
  }

  return parts.join(' ');
}

function buildTimingAdvice(
  monthly: MonthlyLuckFavorability,
  tierConfig: typeof TIER_CONFIG[FavorabilityTier]
): string {
  const monthInfo = MONTH_NAMES[monthly.month];

  if (monthly.tier === 'excellent') {
    if (monthly.tripleCompound.type === 'triple_synergy') {
      return `${monthInfo.chinese} is your power month. All timing layers support you. Take decisive action on important matters - initiate projects, sign contracts, make commitments. Fortune strongly favors the bold.`;
    }
    return `${monthInfo.chinese} offers exceptional support. This is the time to advance on goals you've been planning. Take calculated risks with confidence.`;
  }

  if (monthly.tier === 'good') {
    return `${monthInfo.chinese} rewards initiative. Steady progress is available - don't wait for perfection, just begin. The energy supports forward movement.`;
  }

  if (monthly.tier === 'neutral') {
    return `${monthInfo.chinese} offers balanced energy. Neither push too hard nor retreat unnecessarily. Watch for moments of opportunity and act on them quickly.`;
  }

  if (monthly.tier === 'challenging') {
    return `${monthInfo.chinese} calls for strategic patience. Avoid major new commitments. Focus on maintenance, preparation, and relationship preservation.`;
  }

  return `${monthInfo.chinese} demands conservation. Minimize risk, avoid confrontation, and focus on inner development. This is a pause for reflection, not a permanent state.`;
}

function buildMonthlyActionItems(monthly: MonthlyLuckFavorability): string[] {
  const items: string[] = [];

  // Based on tier
  if (monthly.tier === 'excellent' || monthly.tier === 'good') {
    items.push('Launch important initiatives and sign agreements');
    items.push('Network actively - connections made now are valuable');
    items.push('Take calculated risks on delayed plans');
  } else if (monthly.tier === 'neutral') {
    items.push('Maintain current momentum without overextending');
    items.push('Handle routine matters efficiently');
    items.push('Prepare groundwork for future opportunities');
  } else {
    items.push('Avoid major new commitments or confrontations');
    items.push('Focus on health, rest, and stress management');
    items.push('Strengthen existing relationships and routines');
  }

  // Based on Shen Sha
  if (monthly.shensha.some(s => s.name === 'Traveling Horse')) {
    items.push('Consider travel or location changes');
  }

  if (monthly.shensha.some(s => s.name === 'Academic Star')) {
    items.push('Prioritize study, exams, or skill development');
  }

  if (monthly.shensha.some(s => s.name === 'Nobleman')) {
    items.push('Reach out to mentors and potential helpers');
  }

  // Based on seasonal alignment
  if (monthly.seasonalInfluence.alignment === 'strong') {
    items.push(`Leverage ${monthly.seasonalInfluence.season} energy for maximum effect`);
  }

  return items.slice(0, 5);
}

// ============================================================================
// YEARLY NARRATIVE
// ============================================================================

/**
 * Build a complete story for a year's worth of months
 */
export function buildYearlyMonthsStory(
  yearlyResult: YearlyMonthsResult,
  personName?: string
): YearlyMonthsStory {
  const name = personName || 'you';

  // Introduction
  const introduction = buildYearIntroduction(yearlyResult, name);

  // Seasonal overview
  const seasonalOverview = buildSeasonalOverview(yearlyResult);

  // Month cards
  const monthCards = yearlyResult.months.map(buildMonthCard);

  // Strategic advice
  const strategicAdvice = buildStrategicAdvice(yearlyResult);

  // Calendar view
  const calendarView = buildCalendarView(yearlyResult);

  return {
    introduction,
    seasonalOverview,
    monthCards,
    strategicAdvice,
    calendarView
  };
}

function buildYearIntroduction(yearly: YearlyMonthsResult, name: string): string {
  const avgScore = yearly.months.reduce((sum, m) => sum + m.score, 0) / yearly.months.length;

  let quality: string;
  if (avgScore >= 65) quality = 'strongly favorable';
  else if (avgScore >= 50) quality = 'generally balanced';
  else if (avgScore >= 35) quality = 'requiring careful navigation';
  else quality = 'demanding strategic patience';

  return `The monthly rhythm for ${name} in ${yearly.year} is ${quality}. ${yearly.yearSummary} Understanding when to push and when to pause maximizes the year's potential.`;
}

function buildSeasonalOverview(yearly: YearlyMonthsResult): SeasonalOverview[] {
  const seasonGroups: Record<string, { months: MonthlyLuckFavorability[]; element: ElementName }> = {
    spring: { months: [], element: 'Wood' },
    summer: { months: [], element: 'Fire' },
    autumn: { months: [], element: 'Metal' },
    winter: { months: [], element: 'Water' },
    'inter-season': { months: [], element: 'Earth' }
  };

  yearly.months.forEach(m => {
    const season = m.seasonalInfluence.season;
    seasonGroups[season].months.push(m);
    seasonGroups[season].element = m.seasonalInfluence.seasonElement;
  });

  return Object.entries(seasonGroups)
    .filter(([_, data]) => data.months.length > 0)
    .map(([season, data]) => {
      const avgScore = data.months.reduce((sum, m) => sum + m.score, 0) / data.months.length;
      const seasonNarrative = SEASONAL_NARRATIVES[season];

      let description: string;
      if (avgScore >= 65) description = `${season.charAt(0).toUpperCase() + season.slice(1)} strongly favors you. ${seasonNarrative.wisdom}`;
      else if (avgScore >= 50) description = `${season.charAt(0).toUpperCase() + season.slice(1)} offers balanced energy. ${seasonNarrative.wisdom}`;
      else description = `${season.charAt(0).toUpperCase() + season.slice(1)} requires careful navigation. ${seasonNarrative.wisdom}`;

      return {
        season: season.charAt(0).toUpperCase() + season.slice(1),
        element: data.element,
        months: data.months.map(m => m.month),
        averageScore: Math.round(avgScore),
        description
      };
    });
}

function buildMonthCard(monthly: MonthlyLuckFavorability): MonthCard {
  const tierConfig = TIER_CONFIG[monthly.tier];
  const monthInfo = MONTH_NAMES[monthly.month];
  const monthImagery = MONTH_IMAGERY[monthly.month];

  let headline: string;
  if (monthly.tier === 'excellent') headline = 'Prime time for action';
  else if (monthly.tier === 'good') headline = 'Favorable forward momentum';
  else if (monthly.tier === 'neutral') headline = 'Navigate with awareness';
  else if (monthly.tier === 'challenging') headline = 'Build through challenges';
  else headline = 'Conserve and reflect';

  return {
    month: monthly.month,
    chineseName: monthInfo.chinese,
    pillarDisplay: monthly.pillarDisplay,
    tier: monthly.tier,
    score: monthly.score,
    headline,
    colorCode: tierConfig.color,
    emoji: `${monthImagery.symbol}${tierConfig.emoji}`
  };
}

function buildStrategicAdvice(yearly: YearlyMonthsResult): string {
  const excellentMonths = yearly.months.filter(m => m.tier === 'excellent');
  const goodMonths = yearly.months.filter(m => m.tier === 'good');
  const challengingMonths = yearly.months.filter(m => m.tier === 'challenging' || m.tier === 'difficult');

  const parts: string[] = [];

  if (excellentMonths.length > 0) {
    const monthNames = excellentMonths.map(m => MONTH_NAMES[m.month].chinese).join(', ');
    parts.push(`Power months (${monthNames}): Schedule important decisions, launches, and commitments.`);
  }

  if (goodMonths.length > 0 && goodMonths.length <= 4) {
    const monthNames = goodMonths.map(m => MONTH_NAMES[m.month].chinese).join(', ');
    parts.push(`Good months (${monthNames}): Steady progress available - maintain momentum.`);
  }

  if (challengingMonths.length > 0) {
    const monthNames = challengingMonths.map(m => MONTH_NAMES[m.month].chinese).join(', ');
    parts.push(`Challenging months (${monthNames}): Avoid major commitments - focus on maintenance and rest.`);
  }

  parts.push(yearly.seasonalPattern);

  return parts.join(' ');
}

function buildCalendarView(yearly: YearlyMonthsResult): string {
  const lines: string[] = [
    `MONTHLY CALENDAR ${yearly.year}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  ];

  // Header row
  lines.push('Month  │ Pillar │ Score │ Tier       │ Status');
  lines.push('───────┼────────┼───────┼────────────┼─────────────────');

  yearly.months.forEach(m => {
    const tierConfig = TIER_CONFIG[m.tier];
    const monthInfo = MONTH_NAMES[m.month];
    const isCurrent = yearly.currentMonth?.month === m.month ? ' ◄ NOW' : '';

    lines.push(
      `${monthInfo.chinese.padEnd(4)} │ ${m.pillarDisplay.padEnd(5)}  │ ${m.score.toString().padStart(3)}   │ ${tierConfig.emoji} ${m.tier.padEnd(10)} │ ${isCurrent}`
    );
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(yearly.yearSummary);

  return lines.join('\n');
}

// ============================================================================
// PANEL MODE (UI Display)
// ============================================================================

/**
 * Generate a compact panel display for a single month
 */
export function getMonthlyPanel(monthly: MonthlyLuckFavorability): string {
  const tierConfig = TIER_CONFIG[monthly.tier];
  const monthInfo = MONTH_NAMES[monthly.month];
  const monthImagery = MONTH_IMAGERY[monthly.month];

  const lines: string[] = [
    `${monthImagery.symbol}${tierConfig.emoji} ${monthInfo.chinese} - ${monthly.pillarDisplay}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Score: ${monthly.score}/100 │ ${monthly.tier.toUpperCase()}`,
    `Solar Period: ${monthInfo.solar}`,
    ``
  ];

  // Season
  lines.push(`🌿 ${monthly.seasonalInfluence.season.toUpperCase()} (${monthly.seasonalInfluence.seasonElement})`);
  lines.push(`   Alignment: ${monthly.seasonalInfluence.alignment}`);

  // Triple compound
  if (monthly.tripleCompound.type !== 'neutral') {
    const icon = monthly.tripleCompound.type.includes('synergy') ? '⭐' : '⚡';
    lines.push(`${icon} ${monthly.tripleCompound.type.replace(/_/g, ' ').toUpperCase()}`);
  }

  // Useful/Annoying
  if (monthly.usefulActivated.length > 0) {
    lines.push(`✅ Useful: ${monthly.usefulActivated.join(', ')}`);
  }
  if (monthly.annoyingActivated.length > 0) {
    lines.push(`❌ Annoying: ${monthly.annoyingActivated.join(', ')}`);
  }

  // Shen Sha
  if (monthly.shensha.length > 0) {
    lines.push(`✨ ${monthly.shensha.map(s => s.chineseName).join(', ')}`);
  }

  lines.push(``);
  lines.push(`📋 ${monthly.advice}`);

  return lines.join('\n');
}

/**
 * Generate a year-at-a-glance bar chart
 */
export function getYearlyBar(yearly: YearlyMonthsResult): string {
  const lines: string[] = [
    `MONTHLY OVERVIEW ${yearly.year}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  ];

  yearly.months.forEach(m => {
    const tierConfig = TIER_CONFIG[m.tier];
    const bar = getScoreBar(m.score);
    const monthInfo = MONTH_NAMES[m.month];
    const current = yearly.currentMonth?.month === m.month ? ' ◄' : '';

    lines.push(`${monthInfo.chinese.slice(0, 2)} ${tierConfig.emoji} │${bar}│ ${m.score}${current}`);
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(yearly.seasonalPattern);

  return lines.join('\n');
}

function getScoreBar(score: number): string {
  const filled = Math.round(score / 5);
  const empty = 20 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

// ============================================================================
// DEBUG MODE (Full Transparency)
// ============================================================================

/**
 * Generate full debug output for a single month
 */
export function getMonthlyDebug(monthly: MonthlyLuckFavorability): string {
  const lines: string[] = [
    '╔══════════════════════════════════════════════════════════════════╗',
    `║ MONTHLY DEBUG: ${monthly.year}/${monthly.month} (${monthly.pillarDisplay})`.padEnd(67) + '║',
    '╠══════════════════════════════════════════════════════════════════╣'
  ];

  // Basic info
  lines.push(`║ Stem: ${monthly.stem} (${monthly.stemElement}) │ Branch: ${monthly.branch} (${monthly.branchElement})`.padEnd(67) + '║');
  lines.push(`║ Score: ${monthly.score}/100 │ Tier: ${monthly.tier} │ Conf: ${(monthly.confidence * 100).toFixed(0)}%`.padEnd(67) + '║');

  // Seasonal
  lines.push('╟──────────────────────────────────────────────────────────────────╢');
  lines.push(`║ Season: ${monthly.seasonalInfluence.season} (${monthly.seasonalInfluence.seasonElement})`.padEnd(67) + '║');
  lines.push(`║ Alignment: ${monthly.seasonalInfluence.alignment} (${monthly.seasonalInfluence.scoreModifier > 0 ? '+' : ''}${monthly.seasonalInfluence.scoreModifier})`.padEnd(67) + '║');

  // Context
  if (monthly.luckPillarContext || monthly.annualContext) {
    lines.push('╟──────────────────────────────────────────────────────────────────╢');
    if (monthly.luckPillarContext) {
      lines.push(`║ Luck Pillar: ${monthly.luckPillarContext.stem}${monthly.luckPillarContext.branch} (${monthly.luckPillarContext.tier})`.padEnd(67) + '║');
    }
    if (monthly.annualContext) {
      lines.push(`║ Annual: ${monthly.annualContext.stem}${monthly.annualContext.branch} (${monthly.annualContext.tier})`.padEnd(67) + '║');
    }
  }

  // Triple compound
  lines.push('╟──────────────────────────────────────────────────────────────────╢');
  lines.push(`║ Triple Compound: ${monthly.tripleCompound.type} (${monthly.tripleCompound.scoreModifier > 0 ? '+' : ''}${monthly.tripleCompound.scoreModifier})`.padEnd(67) + '║');
  lines.push(`║ Layers: LP=${monthly.tripleCompound.layers.luckPillar} A=${monthly.tripleCompound.layers.annual} M=${monthly.tripleCompound.layers.monthly}`.padEnd(67) + '║');

  // Useful/Annoying
  lines.push('╟──────────────────────────────────────────────────────────────────╢');
  lines.push(`║ Useful: [${monthly.usefulActivated.join(', ')}] Annoying: [${monthly.annoyingActivated.join(', ')}]`.padEnd(67) + '║');

  // Conflicts
  const totalConflicts = monthly.natalConflicts.length + monthly.luckPillarConflicts.length + monthly.annualConflicts.length;
  if (totalConflicts > 0) {
    lines.push('╟──────────────────────────────────────────────────────────────────╢');
    lines.push(`║ CONFLICTS: ${totalConflicts} total`.padEnd(67) + '║');
    monthly.natalConflicts.forEach(c => {
      lines.push(`║ • Natal: ${c.description.slice(0, 55)}`.padEnd(67) + '║');
    });
    monthly.luckPillarConflicts.forEach(c => {
      lines.push(`║ • Luck: ${c.description.slice(0, 56)}`.padEnd(67) + '║');
    });
    monthly.annualConflicts.forEach(c => {
      lines.push(`║ • Annual: ${c.description.slice(0, 54)}`.padEnd(67) + '║');
    });
  }

  // Reasoning trace
  lines.push('╟──────────────────────────────────────────────────────────────────╢');
  lines.push('║ REASONING TRACE:'.padEnd(67) + '║');
  monthly.reasoning.slice(0, 15).forEach(r => {
    const truncated = r.length > 65 ? r.slice(0, 62) + '...' : r;
    lines.push(`║ ${truncated}`.padEnd(67) + '║');
  });

  lines.push('╚══════════════════════════════════════════════════════════════════╝');

  return lines.join('\n');
}

// ============================================================================
// CONVENIENCE FORMATTERS
// ============================================================================

/**
 * Get a one-liner summary for a month
 */
export function getMonthlyOneLiner(monthly: MonthlyLuckFavorability): string {
  const tierConfig = TIER_CONFIG[monthly.tier];
  const monthInfo = MONTH_NAMES[monthly.month];

  return `${monthInfo.chinese} ${tierConfig.emoji}: ${monthly.tier} (${monthly.score}/100) - ${monthly.summary}`;
}

/**
 * Get compact month chips for UI display
 */
export function getMonthChips(yearly: YearlyMonthsResult): string {
  return yearly.months.map(m => {
    const tierConfig = TIER_CONFIG[m.tier];
    return `[${m.month}] ${tierConfig.emoji}${m.score}`;
  }).join(' ');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildMonthlyStory,
  buildYearlyMonthsStory,
  getMonthlyPanel,
  getYearlyBar,
  getMonthlyDebug,
  getMonthlyOneLiner,
  getMonthChips,
  TIER_CONFIG,
  SEASONAL_NARRATIVES,
  MONTH_IMAGERY
};
