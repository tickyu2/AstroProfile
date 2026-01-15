/**
 * ============================================================================
 * ANNUAL LUCK NARRATIVE ENGINE (流年故事模式)
 * ============================================================================
 *
 * Transforms Annual Luck Favorability analysis into human-readable narratives.
 *
 * Story Mode Features:
 * - Weather metaphors for year quality (sunshine, storms, etc.)
 * - Personal journey framing
 * - Seasonal wisdom for monthly guidance
 * - Clear "what to do" recommendations
 *
 * Three output modes:
 * 1. STORY MODE: Poetic narrative for general users
 * 2. PANEL MODE: Structured display for UI components
 * 3. DEBUG MODE: Full calculation transparency for experts
 *
 * Joey Yap teaching:
 * "Tell people what they can DO about it. Knowledge without action is useless."
 *
 * Created: January 2026
 * Based on: Classical BaZi interpretation, Joey Yap methodology
 * ============================================================================
 */

import {
  AnnualLuckFavorability,
  AnnualTimelineResult,
  MonthHighlight
} from './baziAnnualFavorability';
import { FavorabilityTier } from './baziLuckFavorability';
import { ElementName } from './baziUsefulGod';

// ============================================================================
// TYPES
// ============================================================================

export interface AnnualStory {
  title: string;
  opening: string;
  bodyParagraphs: string[];
  monthlyGuidance: string;
  closingAdvice: string;
  actionItems: string[];
}

export interface TimelineStory {
  introduction: string;
  yearSummaries: YearSummaryCard[];
  peakMoments: string[];
  challengingMoments: string[];
  overallNarrative: string;
  strategicAdvice: string;
}

export interface YearSummaryCard {
  year: number;
  pillarDisplay: string;
  zodiacAnimal: string;
  tier: FavorabilityTier;
  score: number;
  headline: string;
  keyTheme: string;
  colorCode: string;
}

// ============================================================================
// TIER CONFIGURATION
// ============================================================================

const TIER_CONFIG: Record<FavorabilityTier, {
  emoji: string;
  color: string;
  label: string;
  weatherMetaphor: string;
  seasonMetaphor: string;
  journeyMetaphor: string;
}> = {
  excellent: {
    emoji: '🌟',
    color: '#FFD700',
    label: 'Excellent Year',
    weatherMetaphor: 'brilliant sunshine with clear skies',
    seasonMetaphor: 'the peak of summer harvest',
    journeyMetaphor: 'sailing with a strong tailwind'
  },
  good: {
    emoji: '☀️',
    color: '#90EE90',
    label: 'Good Year',
    weatherMetaphor: 'pleasant weather with occasional clouds',
    seasonMetaphor: 'late spring with flowers blooming',
    journeyMetaphor: 'walking a well-marked path'
  },
  neutral: {
    emoji: '⛅',
    color: '#FFE4B5',
    label: 'Mixed Year',
    weatherMetaphor: 'variable conditions with both sun and clouds',
    seasonMetaphor: 'the changing seasons between spring and autumn',
    journeyMetaphor: 'navigating a winding road with clear markers'
  },
  challenging: {
    emoji: '🌧️',
    color: '#DDA0DD',
    label: 'Challenging Year',
    weatherMetaphor: 'overcast skies with occasional rain',
    seasonMetaphor: 'late autumn when leaves fall',
    journeyMetaphor: 'climbing uphill with a heavy pack'
  },
  difficult: {
    emoji: '⛈️',
    color: '#CD5C5C',
    label: 'Difficult Year',
    weatherMetaphor: 'storms requiring shelter and patience',
    seasonMetaphor: 'deep winter when rest is needed',
    journeyMetaphor: 'weathering a tempest at sea'
  }
};

// ============================================================================
// ZODIAC NARRATIVES
// ============================================================================

const ZODIAC_NARRATIVES: Record<string, {
  animal: string;
  energy: string;
  theme: string;
}> = {
  '子': { animal: 'Rat', energy: 'clever and adaptable', theme: 'new beginnings and resourcefulness' },
  '丑': { animal: 'Ox', energy: 'steady and determined', theme: 'hard work and perseverance' },
  '寅': { animal: 'Tiger', energy: 'bold and ambitious', theme: 'courage and taking action' },
  '卯': { animal: 'Rabbit', energy: 'gentle and diplomatic', theme: 'harmony and relationships' },
  '辰': { animal: 'Dragon', energy: 'powerful and transformative', theme: 'ambition and major change' },
  '巳': { animal: 'Snake', energy: 'wise and intuitive', theme: 'strategy and hidden knowledge' },
  '午': { animal: 'Horse', energy: 'energetic and free-spirited', theme: 'movement and independence' },
  '未': { animal: 'Goat', energy: 'creative and nurturing', theme: 'artistry and compassion' },
  '申': { animal: 'Monkey', energy: 'clever and versatile', theme: 'innovation and problem-solving' },
  '酉': { animal: 'Rooster', energy: 'precise and confident', theme: 'attention to detail and timing' },
  '戌': { animal: 'Dog', energy: 'loyal and protective', theme: 'duty and moral courage' },
  '亥': { animal: 'Pig', energy: 'generous and sincere', theme: 'abundance and celebration' }
};

// ============================================================================
// ELEMENT METAPHORS
// ============================================================================

const ELEMENT_YEAR_THEMES: Record<ElementName, {
  quality: string;
  focus: string;
  advice: string;
}> = {
  'Wood': {
    quality: 'growth and expansion',
    focus: 'new projects, health, and personal development',
    advice: 'Plant seeds now that will grow into future achievements'
  },
  'Fire': {
    quality: 'passion and visibility',
    focus: 'recognition, relationships, and creative expression',
    advice: 'Shine your light but avoid burning too hot'
  },
  'Earth': {
    quality: 'stability and grounding',
    focus: 'property, savings, and consolidation',
    advice: 'Build solid foundations before reaching higher'
  },
  'Metal': {
    quality: 'refinement and decisiveness',
    focus: 'career advancement and cutting away excess',
    advice: 'Make precise decisions and commit fully'
  },
  'Water': {
    quality: 'flow and wisdom',
    focus: 'learning, networking, and spiritual growth',
    advice: 'Go with the flow while staying true to your course'
  }
};

// ============================================================================
// STORY BUILDERS
// ============================================================================

/**
 * Build a complete story for a single annual pillar
 */
export function buildAnnualStory(annual: AnnualLuckFavorability): AnnualStory {
  const tierConfig = TIER_CONFIG[annual.tier];
  const zodiac = ZODIAC_NARRATIVES[annual.branch];
  const elementTheme = ELEMENT_YEAR_THEMES[annual.branchElement];

  // Title
  const title = `${annual.year}: Year of the ${zodiac.animal} - ${tierConfig.label}`;

  // Opening
  const opening = buildAnnualOpening(annual, tierConfig, zodiac);

  // Body paragraphs
  const bodyParagraphs = buildAnnualBody(annual, tierConfig, zodiac, elementTheme);

  // Monthly guidance
  const monthlyGuidance = buildMonthlyGuidance(annual.monthHighlights);

  // Closing advice
  const closingAdvice = buildClosingAdvice(annual, tierConfig);

  // Action items
  const actionItems = buildActionItems(annual);

  return {
    title,
    opening,
    bodyParagraphs,
    monthlyGuidance,
    closingAdvice,
    actionItems
  };
}

function buildAnnualOpening(
  annual: AnnualLuckFavorability,
  tierConfig: typeof TIER_CONFIG[FavorabilityTier],
  zodiac: typeof ZODIAC_NARRATIVES[string]
): string {
  const contextPhrase = annual.luckPillarContext
    ? `, within your ${annual.luckPillarContext.tier} decade (${annual.luckPillarContext.stem}${annual.luckPillarContext.branch})`
    : '';

  if (annual.tier === 'excellent') {
    return `${annual.year} emerges as a standout year${contextPhrase}. The Year of the ${zodiac.animal} brings ${tierConfig.weatherMetaphor}, creating conditions for significant achievement. The cosmic energy is ${zodiac.energy}, aligned with your chart in powerful ways. This is a year to remember.`;
  }

  if (annual.tier === 'good') {
    return `${annual.year} brings favorable winds${contextPhrase}. The ${zodiac.animal} Year offers ${tierConfig.weatherMetaphor}, with the universe gently supporting your endeavors. The year's energy is ${zodiac.energy}, creating opportunities for ${zodiac.theme}.`;
  }

  if (annual.tier === 'neutral') {
    return `${annual.year} presents a balanced landscape${contextPhrase}. The Year of the ${zodiac.animal} offers ${tierConfig.weatherMetaphor}. Neither strongly favorable nor challenging, this year is what you make of it. The ${zodiac.energy} energy invites thoughtful navigation.`;
  }

  if (annual.tier === 'challenging') {
    return `${annual.year} calls for resilience${contextPhrase}. The ${zodiac.animal} Year brings ${tierConfig.weatherMetaphor}, testing your adaptability. The universe isn't working against you - it's strengthening you through challenges. The year's ${zodiac.energy} energy asks you to rise.`;
  }

  return `${annual.year} demands patience and wisdom${contextPhrase}. The Year of the ${zodiac.animal} presents ${tierConfig.weatherMetaphor}. Like ${tierConfig.seasonMetaphor}, this is a time for retreat and reflection rather than expansion. The ${zodiac.energy} energy teaches through difficulty.`;
}

function buildAnnualBody(
  annual: AnnualLuckFavorability,
  tierConfig: typeof TIER_CONFIG[FavorabilityTier],
  zodiac: typeof ZODIAC_NARRATIVES[string],
  elementTheme: typeof ELEMENT_YEAR_THEMES[ElementName]
): string[] {
  const paragraphs: string[] = [];

  // Useful/Annoying God paragraph
  if (annual.usefulActivated.length > 0) {
    paragraphs.push(
      `Your Useful God elements (${annual.usefulActivated.join(' and ')}) are activated this year. This is cosmic support - the universe is providing what your chart needs for balance. ${elementTheme.advice}.`
    );
  }

  if (annual.annoyingActivated.length > 0) {
    paragraphs.push(
      `Be mindful that Annoying God elements (${annual.annoyingActivated.join(' and ')}) are also present. These bring the challenges that forge character. Stay aware but not afraid - awareness transforms obstacles into stepping stones.`
    );
  }

  // Compound effect paragraph
  if (annual.compoundEffect.type === 'synergy') {
    paragraphs.push(
      `Particularly noteworthy: ${annual.compoundEffect.description} This amplification effect makes the year especially potent for major initiatives.`
    );
  } else if (annual.compoundEffect.type === 'conflict') {
    paragraphs.push(
      `Important consideration: ${annual.compoundEffect.description} This creates turbulence within your decade's rhythm - expect some disruption to your usual patterns.`
    );
  }

  // Conflicts paragraph
  const allConflicts = [...annual.natalConflicts, ...annual.luckPillarConflicts];
  const majorConflicts = allConflicts.filter(c => c.severity === 'major');

  if (majorConflicts.length > 0) {
    paragraphs.push(
      `The year brings significant cosmic tensions: ${majorConflicts.map(c => c.description).join('; ')}. These are not punishments but growth catalysts. Navigate with awareness, and you transform challenges into breakthroughs.`
    );
  }

  // Shen Sha paragraph
  const positiveShensha = annual.shensha.filter(s => s.isPositive);
  const negativeShensha = annual.shensha.filter(s => !s.isPositive);

  if (positiveShensha.length > 0) {
    const stars = positiveShensha.map(s => `${s.chineseName} (${s.name})`).join(', ');
    paragraphs.push(
      `Auspicious stars activated: ${stars}. These symbolic influences enhance the year's potential. ${positiveShensha[0].description}.`
    );
  }

  if (negativeShensha.length > 0) {
    const stars = negativeShensha.map(s => `${s.chineseName} (${s.name})`).join(', ');
    paragraphs.push(
      `Cautionary stars present: ${stars}. ${negativeShensha[0].description}. Traditional wisdom suggests extra mindfulness and humility.`
    );
  }

  // Year theme paragraph
  paragraphs.push(
    `The ${zodiac.animal} Year emphasizes ${zodiac.theme}. Combined with ${annual.branchElement} energy, the focus is on ${elementTheme.focus}. ${elementTheme.advice}.`
  );

  return paragraphs;
}

function buildMonthlyGuidance(highlights: MonthHighlight[]): string {
  const significantMonths = highlights.filter(m => m.isSignificant);

  if (significantMonths.length === 0) {
    return 'This year has relatively even energy distribution across all months. No single month stands out as dramatically different from the yearly theme.';
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const parts = significantMonths.slice(0, 4).map(m =>
    `${monthNames[m.month - 1]}: ${m.reason}`
  );

  return `Key months to watch: ${parts.join('. ')}.`;
}

function buildClosingAdvice(
  annual: AnnualLuckFavorability,
  tierConfig: typeof TIER_CONFIG[FavorabilityTier]
): string {
  if (annual.tier === 'excellent') {
    return `This is your year to shine. ${tierConfig.journeyMetaphor.charAt(0).toUpperCase() + tierConfig.journeyMetaphor.slice(1)} - use the momentum. What you initiate in ${annual.year} carries lasting significance. Be bold but not reckless.`;
  }

  if (annual.tier === 'good') {
    return `${annual.year} rewards initiative. ${tierConfig.journeyMetaphor.charAt(0).toUpperCase() + tierConfig.journeyMetaphor.slice(1)}. Take advantage of the supportive energy to advance your goals. Small consistent steps lead to significant progress.`;
  }

  if (annual.tier === 'neutral') {
    return `${annual.year} is what you make of it. The energy is balanced - neither pushing you forward nor holding you back. Use this stable period to build capacity and prepare for more dynamic years ahead.`;
  }

  if (annual.tier === 'challenging') {
    return `${annual.year} builds character. ${tierConfig.journeyMetaphor.charAt(0).toUpperCase() + tierConfig.journeyMetaphor.slice(1)} - the view from the top will be worth it. Focus on learning, resilience, and maintaining important relationships through the difficulty.`;
  }

  return `${annual.year} teaches patience. ${tierConfig.journeyMetaphor.charAt(0).toUpperCase() + tierConfig.journeyMetaphor.slice(1)}. This is not the time for expansion but for conservation and inner work. What you learn now becomes wisdom for better years ahead.`;
}

function buildActionItems(annual: AnnualLuckFavorability): string[] {
  const items: string[] = [];

  // Based on tier
  if (annual.tier === 'excellent' || annual.tier === 'good') {
    items.push('Launch major projects or initiatives you\'ve been planning');
    items.push('Take calculated risks - the energy supports bold moves');
    items.push('Network and build relationships - doors open more easily');
  } else if (annual.tier === 'neutral') {
    items.push('Maintain current trajectory while watching for opportunities');
    items.push('Build skills and knowledge for future deployment');
    items.push('Strengthen core relationships and routines');
  } else {
    items.push('Avoid major new commitments or risky ventures');
    items.push('Focus on health, rest, and stress management');
    items.push('Lean on trusted supporters during difficult moments');
  }

  // Based on Shen Sha
  if (annual.shensha.some(s => s.name === 'Traveling Horse')) {
    items.push('Consider travel, relocation, or career change');
  }

  if (annual.shensha.some(s => s.name === 'Nobleman')) {
    items.push('Actively seek mentors and helpful connections');
  }

  if (annual.shensha.some(s => s.name === 'Peach Blossom')) {
    items.push('Invest in relationships - romantic and social');
  }

  if (annual.shensha.some(s => s.name === 'Tai Sui Return')) {
    items.push('Practice humility; wear red for luck (traditional)');
  }

  // Based on conflicts
  if (annual.luckPillarConflicts.some(c => c.type === 'clash')) {
    items.push('Expect disruption - stay flexible in your plans');
  }

  return items.slice(0, 5); // Max 5 action items
}

// ============================================================================
// TIMELINE NARRATIVE
// ============================================================================

/**
 * Build a complete story for a multi-year timeline
 */
export function buildTimelineStory(
  timeline: AnnualTimelineResult,
  personName?: string
): TimelineStory {
  const name = personName || 'you';

  // Introduction
  const introduction = buildTimelineIntroduction(timeline, name);

  // Year summary cards
  const yearSummaries = timeline.years.map(buildYearSummaryCard);

  // Peak moments
  const peakMoments = identifyPeakMoments(timeline.years);

  // Challenging moments
  const challengingMoments = identifyChallengingMoments(timeline.years);

  // Overall narrative
  const overallNarrative = buildOverallNarrative(timeline, name);

  // Strategic advice
  const strategicAdvice = buildStrategicAdvice(timeline);

  return {
    introduction,
    yearSummaries,
    peakMoments,
    challengingMoments,
    overallNarrative,
    strategicAdvice
  };
}

function buildTimelineIntroduction(timeline: AnnualTimelineResult, name: string): string {
  const startYear = timeline.years[0]?.year || 0;
  const endYear = timeline.years[timeline.years.length - 1]?.year || 0;
  const avgScore = timeline.years.reduce((sum, y) => sum + y.score, 0) / timeline.years.length;

  let quality: string;
  if (avgScore >= 65) quality = 'generally favorable';
  else if (avgScore >= 50) quality = 'mixed but balanced';
  else if (avgScore >= 35) quality = 'challenging but growth-oriented';
  else quality = 'demanding patience and resilience';

  return `This analysis covers ${name}'s annual fortune from ${startYear} to ${endYear}. The period is ${quality}. Each year carries its own energy, interacting with ${name}'s natal chart and current life phase to create a unique rhythm of opportunity and challenge.`;
}

function buildYearSummaryCard(annual: AnnualLuckFavorability): YearSummaryCard {
  const tierConfig = TIER_CONFIG[annual.tier];
  const zodiac = ZODIAC_NARRATIVES[annual.branch];

  let headline: string;
  if (annual.tier === 'excellent') {
    headline = 'Peak opportunity year';
  } else if (annual.tier === 'good') {
    headline = 'Favorable forward momentum';
  } else if (annual.tier === 'neutral') {
    headline = 'Steady navigation required';
  } else if (annual.tier === 'challenging') {
    headline = 'Growth through challenges';
  } else {
    headline = 'Patience and wisdom needed';
  }

  return {
    year: annual.year,
    pillarDisplay: annual.pillarDisplay,
    zodiacAnimal: zodiac.animal,
    tier: annual.tier,
    score: annual.score,
    headline,
    keyTheme: zodiac.theme,
    colorCode: tierConfig.color
  };
}

function identifyPeakMoments(years: AnnualLuckFavorability[]): string[] {
  const peaks: string[] = [];

  // Best overall year
  const sorted = [...years].sort((a, b) => b.score - a.score);
  if (sorted[0] && sorted[0].score >= 70) {
    peaks.push(`${sorted[0].year} stands out as your strongest year - ideal for major moves.`);
  }

  // Compound synergy years
  const synergyYears = years.filter(y => y.compoundEffect.type === 'synergy');
  if (synergyYears.length > 0) {
    peaks.push(`${synergyYears.map(y => y.year).join(', ')}: Double blessing effect amplifies fortune.`);
  }

  // Nobleman years
  const noblemanYears = years.filter(y => y.shensha.some(s => s.name === 'Nobleman'));
  if (noblemanYears.length > 0) {
    peaks.push(`${noblemanYears.map(y => y.year).join(', ')}: Helpful people appear - network actively.`);
  }

  return peaks.slice(0, 4);
}

function identifyChallengingMoments(years: AnnualLuckFavorability[]): string[] {
  const challenges: string[] = [];

  // Worst overall year
  const sorted = [...years].sort((a, b) => a.score - b.score);
  if (sorted[0] && sorted[0].score <= 35) {
    challenges.push(`${sorted[0].year} requires extra caution - minimize risk-taking.`);
  }

  // Compound conflict years
  const conflictYears = years.filter(y => y.compoundEffect.type === 'conflict');
  if (conflictYears.length > 0) {
    challenges.push(`${conflictYears.map(y => y.year).join(', ')}: Year disrupts decade energy - expect turbulence.`);
  }

  // Tai Sui years
  const taiSuiYears = years.filter(y => y.shensha.some(s => s.name === 'Tai Sui Return'));
  if (taiSuiYears.length > 0) {
    challenges.push(`${taiSuiYears.map(y => y.year).join(', ')}: Zodiac birth year - traditional caution advised.`);
  }

  // Major clash years
  const clashYears = years.filter(y =>
    y.natalConflicts.some(c => c.type === 'clash' && c.severity === 'major') ||
    y.luckPillarConflicts.some(c => c.type === 'clash')
  );
  if (clashYears.length > 0) {
    challenges.push(`Major clashes in ${clashYears.map(y => y.year).join(', ')} - stay flexible.`);
  }

  return challenges.slice(0, 4);
}

function buildOverallNarrative(timeline: AnnualTimelineResult, name: string): string {
  const bestYear = timeline.bestYear;
  const worstYear = timeline.worstYear;
  const current = timeline.currentYear;

  const parts: string[] = [];

  parts.push(timeline.overallPattern);

  if (bestYear) {
    parts.push(`${bestYear.year} emerges as the peak year (score: ${bestYear.score}) - this is when major initiatives have the best support.`);
  }

  if (worstYear && worstYear.score < 40) {
    parts.push(`${worstYear.year} presents the greatest challenges (score: ${worstYear.score}) - preparation and resilience are key.`);
  }

  if (current) {
    parts.push(`Currently navigating ${current.year}: ${current.tier} (score: ${current.score}). ${current.summary}`);
  }

  return parts.join(' ');
}

function buildStrategicAdvice(timeline: AnnualTimelineResult): string {
  const goodYears = timeline.years.filter(y => y.score >= 60);
  const challengingYears = timeline.years.filter(y => y.score < 40);

  if (goodYears.length > challengingYears.length * 2) {
    return 'This is a generally supportive period. Use the favorable years to take bold action and build momentum. The occasional challenging year serves as a natural pause for integration.';
  }

  if (challengingYears.length > goodYears.length) {
    return 'This period requires strategic patience. Save major initiatives for the favorable years and use challenging periods for skill-building and relationship maintenance. Resilience developed now pays dividends later.';
  }

  return 'This balanced period offers both opportunities and challenges in roughly equal measure. Success comes from reading each year correctly - pushing forward when supported, conserving energy when challenged.';
}

// ============================================================================
// PANEL MODE (UI Display)
// ============================================================================

/**
 * Generate a compact panel display for a single year
 */
export function getAnnualPanel(annual: AnnualLuckFavorability): string {
  const tierConfig = TIER_CONFIG[annual.tier];
  const zodiac = ZODIAC_NARRATIVES[annual.branch];

  const lines: string[] = [
    `${tierConfig.emoji} ${annual.year} - Year of the ${zodiac.animal}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Pillar: ${annual.pillarDisplay} │ Score: ${annual.score}/100 │ ${annual.tier.toUpperCase()}`,
    ``,
    `Elements: Stem ${annual.stemElement}, Branch ${annual.branchElement}`
  ];

  // Useful/Annoying
  if (annual.usefulActivated.length > 0) {
    lines.push(`✅ Useful: ${annual.usefulActivated.join(', ')}`);
  }
  if (annual.annoyingActivated.length > 0) {
    lines.push(`❌ Annoying: ${annual.annoyingActivated.join(', ')}`);
  }

  // Compound effect
  if (annual.compoundEffect.type !== 'neutral') {
    const icon = annual.compoundEffect.type === 'synergy' ? '⭐' : '⚡';
    lines.push(`${icon} ${annual.compoundEffect.description}`);
  }

  // Shen Sha
  if (annual.shensha.length > 0) {
    lines.push(`✨ ${annual.shensha.map(s => s.chineseName).join(', ')}`);
  }

  lines.push(``);
  lines.push(`📋 ${annual.advice}`);

  return lines.join('\n');
}

/**
 * Generate a timeline bar visualization
 */
export function getTimelineBar(timeline: AnnualTimelineResult): string {
  const lines: string[] = ['ANNUAL TIMELINE', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'];

  timeline.years.forEach(year => {
    const tierConfig = TIER_CONFIG[year.tier];
    const bar = getScoreBar(year.score);
    const zodiac = ZODIAC_NARRATIVES[year.branch];
    const current = timeline.currentYear?.year === year.year ? ' ◄ NOW' : '';

    lines.push(`${year.year} ${zodiac.animal.padEnd(8)} ${tierConfig.emoji} │${bar}│ ${year.score}${current}`);
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(timeline.periodSummary);

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
 * Generate full debug output for a single year
 */
export function getAnnualDebug(annual: AnnualLuckFavorability): string {
  const lines: string[] = [
    '╔══════════════════════════════════════════════════════════════════╗',
    `║ ANNUAL LUCK DEBUG: ${annual.year} (${annual.pillarDisplay})`.padEnd(67) + '║',
    '╠══════════════════════════════════════════════════════════════════╣'
  ];

  // Basic info
  lines.push(`║ Stem: ${annual.stem} (${annual.stemElement}) │ Branch: ${annual.branch} (${annual.branchElement})`.padEnd(67) + '║');
  lines.push(`║ Score: ${annual.score}/100 │ Tier: ${annual.tier} │ Confidence: ${(annual.confidence * 100).toFixed(0)}%`.padEnd(67) + '║');

  // Context
  if (annual.luckPillarContext) {
    lines.push('╟──────────────────────────────────────────────────────────────────╢');
    lines.push(`║ Luck Pillar Context: ${annual.luckPillarContext.stem}${annual.luckPillarContext.branch} (Age ${annual.luckPillarContext.startAge}-${annual.luckPillarContext.endAge})`.padEnd(67) + '║');
    lines.push(`║ Decade Tier: ${annual.luckPillarContext.tier} (score: ${annual.luckPillarContext.score})`.padEnd(67) + '║');
  }

  // Useful/Annoying analysis
  lines.push('╟──────────────────────────────────────────────────────────────────╢');
  lines.push(`║ Stem Useful: ${annual.stemUseful} │ Stem Annoying: ${annual.stemAnnoying}`.padEnd(67) + '║');
  lines.push(`║ Branch Useful: ${annual.branchUseful} │ Branch Annoying: ${annual.branchAnnoying}`.padEnd(67) + '║');
  lines.push(`║ Activated Useful: [${annual.usefulActivated.join(', ')}]`.padEnd(67) + '║');
  lines.push(`║ Activated Annoying: [${annual.annoyingActivated.join(', ')}]`.padEnd(67) + '║');

  // Conflicts
  if (annual.natalConflicts.length > 0 || annual.luckPillarConflicts.length > 0) {
    lines.push('╟──────────────────────────────────────────────────────────────────╢');
    lines.push('║ CONFLICTS'.padEnd(67) + '║');
    annual.natalConflicts.forEach(c => {
      lines.push(`║ • Natal: ${c.description}`.padEnd(67).slice(0, 67) + '║');
    });
    annual.luckPillarConflicts.forEach(c => {
      lines.push(`║ • Luck: ${c.description}`.padEnd(67).slice(0, 67) + '║');
    });
  }

  // Compound effect
  lines.push('╟──────────────────────────────────────────────────────────────────╢');
  lines.push(`║ Compound Effect: ${annual.compoundEffect.type} (${annual.compoundEffect.scoreModifier > 0 ? '+' : ''}${annual.compoundEffect.scoreModifier})`.padEnd(67) + '║');
  lines.push(`║ ${annual.compoundEffect.description}`.padEnd(67).slice(0, 67) + '║');

  // DM Impact
  lines.push('╟──────────────────────────────────────────────────────────────────╢');
  lines.push(`║ DM Impact: ${annual.dmImpact} (Δ ${annual.dmStrengthDelta > 0 ? '+' : ''}${(annual.dmStrengthDelta * 100).toFixed(1)}%)`.padEnd(67) + '║');

  // Reasoning
  lines.push('╟──────────────────────────────────────────────────────────────────╢');
  lines.push('║ REASONING TRACE:'.padEnd(67) + '║');
  annual.reasoning.forEach(r => {
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
 * Get a one-liner summary for a year
 */
export function getAnnualOneLiner(annual: AnnualLuckFavorability): string {
  const tierConfig = TIER_CONFIG[annual.tier];
  const zodiac = ZODIAC_NARRATIVES[annual.branch];

  return `${annual.year} ${zodiac.animal} ${tierConfig.emoji}: ${annual.tier} (${annual.score}/100) - ${annual.summary}`;
}

/**
 * Get compact year cards for UI display
 */
export function getYearCards(timeline: AnnualTimelineResult): string {
  return timeline.years.map(y => {
    const tierConfig = TIER_CONFIG[y.tier];
    const zodiac = ZODIAC_NARRATIVES[y.branch];
    return `[${y.year}] ${zodiac.animal} ${tierConfig.emoji} ${y.score}`;
  }).join(' │ ');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildAnnualStory,
  buildTimelineStory,
  getAnnualPanel,
  getTimelineBar,
  getAnnualDebug,
  getAnnualOneLiner,
  getYearCards,
  TIER_CONFIG,
  ZODIAC_NARRATIVES,
  ELEMENT_YEAR_THEMES
};
