/**
 * ============================================================================
 * BAZI COMPOSITE FORECAST REPORT GENERATOR (合盘预测报告生成器)
 * ============================================================================
 *
 * The cathedral's masterwork — the final orchestration layer that takes
 * everything we've built and weaves it into a single, coherent, consult-grade
 * narrative report.
 *
 * This module produces a full relationship forecast, the kind of report a
 * professional metaphysics consultant would deliver after hours of analysis.
 *
 * Ten Chapters:
 * 1. Relationship Essence (关系本质)
 * 2. Synastry Overview (合盘概览)
 * 3. Composite Chart Interpretation (合盘命盘解析)
 * 4. Relationship Archetype (关系原型)
 * 5. Life Themes (人生主题)
 * 6. Relationship Lifecycle Phase (关系生命周期阶段)
 * 7. Composite Timing Forecast (合盘运势预测)
 * 8. Composite Event Trigger Windows (合盘应期)
 * 9. Destiny Trajectory Curves (运势曲线)
 * 10. Guidance & Integration (关系指导)
 *
 * Based on: Classical 命理 consultation methodology
 * Aligned with: Joey Yap professional reporting standards
 * Created: January 2026
 * ============================================================================
 */

import type { CompositeChart, CompositeShenSha, CompositeLuckPillar } from './baziCompositeChart';
import type { SynastryHeatmap } from './baziSynastryHeatmap';
import type { LifeThemes } from './baziLifeThemes';
import type { RelationshipArchetypeResult } from './baziRelationshipArchetypes';
import type { RelationshipLifecycleResult } from './baziRelationshipLifecycle';
import type { TrajectoryCurve } from './baziTrajectory';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

/**
 * Partner information
 */
export interface PartnerInfo {
  name: string;
  birthDate: string;
  dayMasterElement: ElementName;
  dayMasterChinese: string;
}

/**
 * Composite event summary
 */
export interface CompositeEventSummary {
  type: string;
  typeChinese: string;
  year: number;
  month?: number;
  probability: number;
  tier: 'strong' | 'likely' | 'mild' | 'none';
  description: string;
}

/**
 * Timing forecast entry
 */
export interface TimingForecastEntry {
  period: string;
  periodChinese: string;
  score: number;
  tier: string;
  highlights: string[];
  challenges: string[];
}

/**
 * Complete report input data
 */
export interface ForecastReportInput {
  partnerA: PartnerInfo;
  partnerB: PartnerInfo;
  composite: CompositeChart;
  synastry?: SynastryHeatmap;
  archetype?: RelationshipArchetypeResult;
  lifeThemes?: LifeThemes;
  lifecycle?: RelationshipLifecycleResult;
  compositeEvents?: CompositeEventSummary[];
  trajectory?: {
    overall?: TrajectoryCurve;
    relationship?: TrajectoryCurve;
    wealth?: TrajectoryCurve;
    career?: TrajectoryCurve;
    health?: TrajectoryCurve;
  };
  timing?: {
    luckPillars?: TimingForecastEntry[];
    annual?: TimingForecastEntry[];
    monthly?: TimingForecastEntry[];
  };
  generatedAt?: Date;
}

/**
 * Chapter structure
 */
export interface ReportChapter {
  number: number;
  title: string;
  titleChinese: string;
  content: string;
  highlights?: string[];
  data?: Record<string, unknown>;
}

/**
 * Complete forecast report
 */
export interface CompositeForecastReport {
  title: string;
  titleChinese: string;
  subtitle: string;
  generatedAt: Date;
  partnerA: PartnerInfo;
  partnerB: PartnerInfo;
  chapters: ReportChapter[];
  summary: string;
  fullNarrative: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Element descriptions
 */
export const ELEMENT_DESCRIPTIONS: Record<ElementName, {
  quality: string;
  relational: string;
  strength: string;
  challenge: string;
}> = {
  Wood: {
    quality: 'growth, vision, and gentle expansion',
    relational: 'nurturing growth and supporting each other\'s evolution',
    strength: 'adaptability, kindness, and long-term vision',
    challenge: 'indecisiveness and over-giving'
  },
  Fire: {
    quality: 'passion, warmth, and illumination',
    relational: 'shared purpose, visibility, and emotional intensity',
    strength: 'charisma, optimism, and transformative energy',
    challenge: 'burnout and emotional volatility'
  },
  Earth: {
    quality: 'stability, nurturing, and grounding',
    relational: 'building a secure foundation and providing mutual support',
    strength: 'reliability, patience, and practical wisdom',
    challenge: 'rigidity and resistance to change'
  },
  Metal: {
    quality: 'precision, structure, and refinement',
    relational: 'clear boundaries, mutual respect, and shared standards',
    strength: 'integrity, discipline, and discernment',
    challenge: 'emotional coldness and perfectionism'
  },
  Water: {
    quality: 'wisdom, flow, and deep intuition',
    relational: 'emotional depth, adaptability, and spiritual connection',
    strength: 'intelligence, flexibility, and resourcefulness',
    challenge: 'fear, isolation, and emotional overwhelm'
  }
};

/**
 * Element Chinese names
 */
export const ELEMENT_CHINESE: Record<ElementName, string> = {
  Wood: '木',
  Fire: '火',
  Earth: '土',
  Metal: '金',
  Water: '水'
};

// ============================================================================
// MAIN REPORT GENERATOR
// ============================================================================

/**
 * Generate the complete composite forecast report
 */
export function generateCompositeForecastReport(
  input: ForecastReportInput
): CompositeForecastReport {
  const generatedAt = input.generatedAt || new Date();

  // Generate all chapters
  const chapters: ReportChapter[] = [
    generateChapterEssence(input),
    generateChapterSynastry(input),
    generateChapterCompositeChart(input),
    generateChapterArchetype(input),
    generateChapterLifeThemes(input),
    generateChapterLifecycle(input),
    generateChapterTiming(input),
    generateChapterEventTriggers(input),
    generateChapterTrajectory(input),
    generateChapterGuidance(input)
  ];

  // Generate executive summary
  const summary = generateExecutiveSummary(input);

  // Generate full narrative
  const fullNarrative = generateFullNarrative(chapters, input);

  return {
    title: 'Composite Relationship Forecast',
    titleChinese: '合盘预测报告',
    subtitle: `${input.partnerA.name} & ${input.partnerB.name}`,
    generatedAt,
    partnerA: input.partnerA,
    partnerB: input.partnerB,
    chapters,
    summary,
    fullNarrative
  };
}

// ============================================================================
// CHAPTER 1: RELATIONSHIP ESSENCE
// ============================================================================

/**
 * Generate Chapter 1: Relationship Essence
 */
export function generateChapterEssence(input: ForecastReportInput): ReportChapter {
  const { composite, partnerA, partnerB } = input;
  const parts: string[] = [];

  // Day Master description
  if (composite.dayMaster) {
    const dm = composite.dayMaster;
    const elementDesc = ELEMENT_DESCRIPTIONS[dm.element];

    parts.push(`### Composite Day Master: ${dm.element} (${dm.chineseName || ELEMENT_CHINESE[dm.element]})`);
    parts.push('');
    parts.push(`This relationship is defined by **${dm.element}** energy — ${elementDesc.quality}.`);
    parts.push('');
    parts.push(`When ${partnerA.name} and ${partnerB.name} come together, they create a bond characterized by ${elementDesc.relational}.`);
    parts.push('');

    // Strength analysis
    const strengthWord = dm.strengthCategory === 'very_strong' ? 'powerful' :
                        dm.strengthCategory === 'strong' ? 'robust' :
                        dm.strengthCategory === 'balanced' ? 'balanced' :
                        dm.strengthCategory === 'weak' ? 'gentle' : 'delicate';

    parts.push(`The composite Day Master is **${strengthWord}** (${dm.strengthScore}/100), indicating ${describeStrengthImplication(dm.strengthCategory)}.`);
    parts.push('');
  }

  // Element ecosystem
  if (composite.elementDistribution) {
    parts.push('### Element Ecosystem');
    parts.push('');
    parts.push(describeElementEcosystem(composite.elementDistribution));
    parts.push('');
  }

  // Core identity
  parts.push('### Core Identity');
  parts.push('');
  parts.push(describeCoreIdentity(composite, partnerA, partnerB));

  const highlights = extractEssenceHighlights(composite);

  return {
    number: 1,
    title: 'Relationship Essence',
    titleChinese: '关系本质',
    content: parts.join('\n'),
    highlights,
    data: {
      dayMaster: composite.dayMaster,
      elementDistribution: composite.elementDistribution
    }
  };
}

/**
 * Describe strength implication
 */
function describeStrengthImplication(category: string): string {
  switch (category) {
    case 'very_strong':
      return 'a relationship with powerful presence and clear identity that naturally commands attention';
    case 'strong':
      return 'a relationship with solid foundation and confident expression';
    case 'balanced':
      return 'a relationship with harmonious energy flow and adaptive capacity';
    case 'weak':
      return 'a relationship that benefits from external support and conscious cultivation';
    case 'very_weak':
      return 'a relationship that requires careful nurturing and protective attention';
    default:
      return 'a relationship with its own unique energy signature';
  }
}

/**
 * Describe element ecosystem
 */
function describeElementEcosystem(distribution: {
  Wood?: number;
  Fire?: number;
  Earth?: number;
  Metal?: number;
  Water?: number;
  dominant?: ElementName;
  weakest?: ElementName;
}): string {
  const parts: string[] = [];

  // Distribution breakdown
  parts.push('**Element Distribution:**');
  parts.push(`- Wood (木): ${distribution.Wood || 0}%`);
  parts.push(`- Fire (火): ${distribution.Fire || 0}%`);
  parts.push(`- Earth (土): ${distribution.Earth || 0}%`);
  parts.push(`- Metal (金): ${distribution.Metal || 0}%`);
  parts.push(`- Water (水): ${distribution.Water || 0}%`);
  parts.push('');

  // Dominant element
  if (distribution.dominant) {
    const desc = ELEMENT_DESCRIPTIONS[distribution.dominant];
    parts.push(`**Dominant Element:** ${distribution.dominant} (${ELEMENT_CHINESE[distribution.dominant]})`);
    parts.push(`This relationship naturally expresses ${desc.strength}.`);
    parts.push('');
  }

  // Weakest element
  if (distribution.weakest) {
    const desc = ELEMENT_DESCRIPTIONS[distribution.weakest];
    parts.push(`**Area for Growth:** ${distribution.weakest} (${ELEMENT_CHINESE[distribution.weakest]})`);
    parts.push(`Consciously cultivating ${distribution.weakest} energy can help balance ${desc.challenge}.`);
  }

  return parts.join('\n');
}

/**
 * Describe core identity
 */
function describeCoreIdentity(
  composite: CompositeChart,
  partnerA: PartnerInfo,
  partnerB: PartnerInfo
): string {
  const parts: string[] = [];

  const dmElement = composite.dayMaster?.element || 'Earth';
  const desc = ELEMENT_DESCRIPTIONS[dmElement];

  parts.push(`The ${partnerA.name}-${partnerB.name} relationship has a core identity built on ${desc.quality}.`);
  parts.push('');

  // Based on useful god
  if (composite.usefulGod) {
    parts.push(`The relationship thrives when aligned with **${composite.usefulGod.element}** energy — ${composite.usefulGod.reason}`);
    parts.push('');
  }

  // Core strengths
  if (composite.coreStrengths && composite.coreStrengths.length > 0) {
    parts.push('**Natural Strengths:**');
    composite.coreStrengths.slice(0, 3).forEach(s => parts.push(`- ${s}`));
    parts.push('');
  }

  // Core vulnerabilities
  if (composite.coreVulnerabilities && composite.coreVulnerabilities.length > 0) {
    parts.push('**Growth Edges:**');
    composite.coreVulnerabilities.slice(0, 3).forEach(v => parts.push(`- ${v}`));
  }

  return parts.join('\n');
}

/**
 * Extract essence highlights
 */
function extractEssenceHighlights(composite: CompositeChart): string[] {
  const highlights: string[] = [];

  if (composite.dayMaster) {
    highlights.push(`${composite.dayMaster.element} Day Master`);
  }

  if (composite.usefulGod) {
    highlights.push(`${composite.usefulGod.element} Useful God`);
  }

  if (composite.elementDistribution?.dominant) {
    highlights.push(`${composite.elementDistribution.dominant} dominant`);
  }

  return highlights;
}

// ============================================================================
// CHAPTER 2: SYNASTRY OVERVIEW
// ============================================================================

/**
 * Generate Chapter 2: Synastry Overview
 */
export function generateChapterSynastry(input: ForecastReportInput): ReportChapter {
  const { synastry, partnerA, partnerB } = input;
  const parts: string[] = [];

  if (!synastry) {
    parts.push('*Synastry data not available for this report.*');
    return {
      number: 2,
      title: 'Synastry Overview',
      titleChinese: '合盘概览',
      content: parts.join('\n'),
      highlights: []
    };
  }

  // Overall score
  parts.push(`### Overall Compatibility Score: ${synastry.overallScore}/100`);
  parts.push('');
  parts.push(describeOverallScore(synastry.overallScore, partnerA.name, partnerB.name));
  parts.push('');

  // Harmony patterns
  parts.push('### Harmony Patterns');
  parts.push('');
  if (synastry.strongestHarmony) {
    parts.push('**Strongest Harmony:**');
    parts.push(`- ${synastry.strongestHarmony.aPillarChinese} ↔ ${synastry.strongestHarmony.bPillarChinese}: ${synastry.strongestHarmony.summary}`);
    parts.push('');
  } else {
    parts.push('Harmony is distributed evenly across the chart.');
    parts.push('');
  }

  // Tension patterns
  parts.push('### Tension Patterns');
  parts.push('');
  if (synastry.strongestTension) {
    parts.push('**Growth Edge:**');
    parts.push(`- ${synastry.strongestTension.aPillarChinese} ↔ ${synastry.strongestTension.bPillarChinese}: ${synastry.strongestTension.summary}`);
    parts.push('');
    parts.push('*Tension points are opportunities for growth, not obstacles.*');
    parts.push('');
  } else {
    parts.push('No significant tension patterns detected.');
    parts.push('');
  }

  // Romance hotspots
  if (synastry.romanceHotspots && synastry.romanceHotspots.length > 0) {
    parts.push('### Romantic Chemistry');
    parts.push('');
    parts.push(`This relationship has **${synastry.romanceHotspots.length}** romantic activation points, indicating natural attraction and emotional resonance.`);
    parts.push('');
  }

  // Key insights
  parts.push('### Key Insights');
  parts.push('');
  parts.push(generateSynastryInsights(synastry, partnerA, partnerB));

  const highlights = [
    `Score: ${synastry.overallScore}/100`,
    synastry.strongestHarmony ? 'Has harmony points' : 'Balanced harmony',
    `${synastry.romanceHotspots?.length || 0} romance activations`
  ];

  return {
    number: 2,
    title: 'Synastry Overview',
    titleChinese: '合盘概览',
    content: parts.join('\n'),
    highlights,
    data: {
      overallScore: synastry.overallScore,
      hasStrongHarmony: !!synastry.strongestHarmony,
      hasStrongTension: !!synastry.strongestTension
    }
  };
}

/**
 * Describe overall score
 */
function describeOverallScore(score: number, nameA: string, nameB: string): string {
  if (score >= 80) {
    return `${nameA} and ${nameB} share an exceptionally harmonious connection. The charts resonate deeply, creating a natural sense of understanding and mutual support.`;
  } else if (score >= 65) {
    return `${nameA} and ${nameB} have strong compatibility with natural harmony. Minor adjustments can enhance an already solid foundation.`;
  } else if (score >= 50) {
    return `${nameA} and ${nameB} have balanced compatibility with both harmony and growth opportunities. This is a relationship that deepens through conscious engagement.`;
  } else if (score >= 35) {
    return `${nameA} and ${nameB} have a karmic connection with significant growth potential. Challenges become teachers when approached with awareness.`;
  } else {
    return `${nameA} and ${nameB} have a complex connection requiring conscious navigation. This relationship offers profound transformation opportunities.`;
  }
}

/**
 * Generate synastry insights
 */
function generateSynastryInsights(
  synastry: SynastryHeatmap,
  partnerA: PartnerInfo,
  partnerB: PartnerInfo
): string {
  const insights: string[] = [];

  // Day-Day analysis (most important)
  if (synastry.grid && synastry.grid[2] && synastry.grid[2][2]) {
    const dayDay = synastry.grid[2][2];
    if (dayDay.totalScore > 0) {
      insights.push(`The Day Pillar connection between ${partnerA.name} and ${partnerB.name} shows emotional resonance — the core of the relationship is harmonious.`);
    } else if (dayDay.totalScore < 0) {
      insights.push(`The Day Pillar connection shows creative tension — this relationship grows through working through differences.`);
    }
  }

  // Year-Year analysis (ancestral)
  if (synastry.grid && synastry.grid[0] && synastry.grid[0][0]) {
    const yearYear = synastry.grid[0][0];
    if (yearYear.totalScore > 0) {
      insights.push(`The ancestral connection (Year Pillars) is supportive — families and backgrounds complement each other.`);
    }
  }

  if (insights.length === 0) {
    insights.push('The synastry reveals a unique energetic signature that unfolds over time.');
  }

  return insights.join('\n\n');
}

// ============================================================================
// CHAPTER 3: COMPOSITE CHART INTERPRETATION
// ============================================================================

/**
 * Generate Chapter 3: Composite Chart Interpretation
 */
export function generateChapterCompositeChart(input: ForecastReportInput): ReportChapter {
  const { composite } = input;
  const parts: string[] = [];

  // Four Pillars
  parts.push('### The Four Composite Pillars');
  parts.push('');
  parts.push(describeCompositePillars(composite));
  parts.push('');

  // Ten Gods
  parts.push('### Composite Ten Gods');
  parts.push('');
  parts.push(describeCompositeTenGods(composite));
  parts.push('');

  // Useful God
  parts.push('### Composite Useful God');
  parts.push('');
  parts.push(describeCompositeUsefulGod(composite));
  parts.push('');

  // Shen Sha
  if (composite.shenSha && composite.shenSha.length > 0) {
    parts.push('### Composite Shen Sha (Symbolic Stars)');
    parts.push('');
    parts.push(describeCompositeShenSha(composite.shenSha));
  }

  const highlights = extractChartHighlights(composite);

  return {
    number: 3,
    title: 'Composite Chart Interpretation',
    titleChinese: '合盘命盘解析',
    content: parts.join('\n'),
    highlights,
    data: {
      usefulGod: composite.usefulGod?.element,
      shenShaCount: composite.shenSha?.length || 0
    }
  };
}

/**
 * Describe composite pillars
 */
function describeCompositePillars(composite: CompositeChart): string {
  const parts: string[] = [];

  const pillars = [
    { name: 'Year', chinese: '年柱', pillar: composite.yearPillar, meaning: 'ancestral energy and social presentation' },
    { name: 'Month', chinese: '月柱', pillar: composite.monthPillar, meaning: 'shared rhythm and daily life' },
    { name: 'Day', chinese: '日柱', pillar: composite.dayPillar, meaning: 'emotional core and intimate connection' },
    { name: 'Hour', chinese: '时柱', pillar: composite.hourPillar, meaning: 'creative expression and legacy' }
  ];

  for (const p of pillars) {
    if (p.pillar) {
      parts.push(`**${p.name} Pillar (${p.chinese}):** ${p.pillar.stem}${p.pillar.branch}`);
      parts.push(`*Represents ${p.meaning}.*`);
      parts.push('');
    }
  }

  return parts.join('\n');
}

/**
 * Describe composite Ten Gods
 */
function describeCompositeTenGods(composite: CompositeChart): string {
  const parts: string[] = [];

  if (!composite.tenGods) {
    return '*Ten Gods analysis not available.*';
  }

  const tg = composite.tenGods;

  parts.push(`**Dominant God:** ${tg.dominant} (${tg.dominantChinese})`);
  parts.push('');
  parts.push(tg.interpretation || 'The Ten Gods reveal the relationship\'s energetic dynamics.');
  parts.push('');

  // Key gods present
  const presentGods: string[] = [];
  if (tg.directWealth) presentGods.push('Direct Wealth (正财)');
  if (tg.indirectWealth) presentGods.push('Indirect Wealth (偏财)');
  if (tg.directOfficer) presentGods.push('Direct Officer (正官)');
  if (tg.sevenKillings) presentGods.push('Seven Killings (七杀)');
  if (tg.directResource) presentGods.push('Direct Resource (正印)');
  if (tg.indirectResource) presentGods.push('Indirect Resource (偏印)');
  if (tg.eatingGod) presentGods.push('Eating God (食神)');
  if (tg.hurtingOfficer) presentGods.push('Hurting Officer (伤官)');
  if (tg.robWealth) presentGods.push('Rob Wealth (劫财)');
  if (tg.friend) presentGods.push('Friend (比肩)');

  if (presentGods.length > 0) {
    parts.push('**Active Gods:**');
    presentGods.forEach(g => parts.push(`- ${g}`));
  }

  return parts.join('\n');
}

/**
 * Describe composite Useful God
 */
function describeCompositeUsefulGod(composite: CompositeChart): string {
  const parts: string[] = [];

  if (!composite.usefulGod) {
    return '*Useful God analysis not available.*';
  }

  const ug = composite.usefulGod;

  parts.push(`**Element:** ${ug.element} (${ug.chineseName})`);
  parts.push('');
  parts.push(`**Why:** ${ug.reason}`);
  parts.push('');

  if (ug.supportingElements && ug.supportingElements.length > 0) {
    parts.push(`**Supporting Elements:** ${ug.supportingElements.map(e => `${e} (${ELEMENT_CHINESE[e]})`).join(', ')}`);
  }

  if (ug.avoidElements && ug.avoidElements.length > 0) {
    parts.push(`**Elements to Moderate:** ${ug.avoidElements.map(e => `${e} (${ELEMENT_CHINESE[e]})`).join(', ')}`);
  }

  parts.push('');
  parts.push(`**Guidance:** ${ug.stabilizingAdvice || 'Align activities and timing with the Useful God element for optimal support.'}`);

  return parts.join('\n');
}

/**
 * Describe composite Shen Sha
 */
function describeCompositeShenSha(shenSha: CompositeShenSha[]): string {
  const parts: string[] = [];

  // Group by nature
  const auspicious = shenSha.filter(s => s.nature === 'auspicious');
  const neutral = shenSha.filter(s => s.nature === 'neutral');
  const inauspicious = shenSha.filter(s => s.nature === 'inauspicious');

  if (auspicious.length > 0) {
    parts.push('**Auspicious Stars:**');
    auspicious.forEach(s => {
      parts.push(`- **${s.name}** (${s.chineseName}): ${s.relationshipMeaning || s.description}`);
    });
    parts.push('');
  }

  if (neutral.length > 0) {
    parts.push('**Neutral Stars:**');
    neutral.forEach(s => {
      parts.push(`- **${s.name}** (${s.chineseName}): ${s.relationshipMeaning || s.description}`);
    });
    parts.push('');
  }

  if (inauspicious.length > 0) {
    parts.push('**Stars Requiring Attention:**');
    inauspicious.forEach(s => {
      parts.push(`- **${s.name}** (${s.chineseName}): ${s.relationshipMeaning || s.description}`);
    });
  }

  return parts.join('\n');
}

/**
 * Extract chart highlights
 */
function extractChartHighlights(composite: CompositeChart): string[] {
  const highlights: string[] = [];

  if (composite.usefulGod) {
    highlights.push(`${composite.usefulGod.element} Useful God`);
  }

  if (composite.tenGods?.dominant) {
    highlights.push(`${composite.tenGods.dominant} dominant`);
  }

  const auspiciousCount = composite.shenSha?.filter(s => s.nature === 'auspicious').length || 0;
  if (auspiciousCount > 0) {
    highlights.push(`${auspiciousCount} auspicious stars`);
  }

  return highlights;
}

// ============================================================================
// CHAPTER 4: RELATIONSHIP ARCHETYPE
// ============================================================================

/**
 * Generate Chapter 4: Relationship Archetype
 */
export function generateChapterArchetype(input: ForecastReportInput): ReportChapter {
  const { archetype, partnerA, partnerB } = input;
  const parts: string[] = [];

  if (!archetype) {
    parts.push('*Archetype analysis not available for this report.*');
    return {
      number: 4,
      title: 'Relationship Archetype',
      titleChinese: '关系原型',
      content: parts.join('\n'),
      highlights: []
    };
  }

  // Primary archetype
  parts.push('### Primary Archetype');
  parts.push('');
  parts.push(`**${archetype.primary.name}** (${archetype.primary.chineseName})`);
  parts.push('');
  parts.push(archetype.primary.theme || `The ${partnerA.name}-${partnerB.name} relationship embodies the ${archetype.primary.name} archetype.`);
  parts.push('');

  if (archetype.primary.strengths && archetype.primary.strengths.length > 0) {
    parts.push('**Archetype Strengths:**');
    archetype.primary.strengths.forEach(s => parts.push(`- ${s}`));
    parts.push('');
  }

  if (archetype.primary.challenges && archetype.primary.challenges.length > 0) {
    parts.push('**Archetype Challenges:**');
    archetype.primary.challenges.forEach(c => parts.push(`- ${c}`));
    parts.push('');
  }

  // Secondary archetype
  if (archetype.secondary) {
    parts.push('### Secondary Archetype');
    parts.push('');
    parts.push(`**${archetype.secondary.name}** (${archetype.secondary.chineseName})`);
    parts.push('');
    parts.push(`A secondary influence of ${archetype.secondary.name} adds nuance to the primary pattern.`);
    parts.push('');
  }

  // Mythic narrative
  if (archetype.mythicNarrative) {
    parts.push('### Mythic Narrative');
    parts.push('');
    parts.push(archetype.mythicNarrative);
    parts.push('');
  }

  // Match score
  parts.push('### Archetype Match');
  parts.push('');
  parts.push(`**Match Score:** ${archetype.primaryScore}/100`);
  parts.push('');
  parts.push(`**Match Factors:**`);
  if (archetype.primaryMatchFactors && archetype.primaryMatchFactors.length > 0) {
    archetype.primaryMatchFactors.slice(0, 5).forEach((f: string) => parts.push(`- ${f}`));
  }

  const highlights = [
    archetype.primary.name,
    archetype.secondary?.name || '',
    `${archetype.primaryScore}/100 match`
  ].filter(h => h);

  return {
    number: 4,
    title: 'Relationship Archetype',
    titleChinese: '关系原型',
    content: parts.join('\n'),
    highlights,
    data: {
      primaryArchetype: archetype.primary.name,
      secondaryArchetype: archetype.secondary?.name,
      matchScore: archetype.primaryScore
    }
  };
}

// ============================================================================
// CHAPTER 5: LIFE THEMES
// ============================================================================

/**
 * Generate Chapter 5: Life Themes
 */
export function generateChapterLifeThemes(input: ForecastReportInput): ReportChapter {
  const { lifeThemes } = input;
  const parts: string[] = [];

  if (!lifeThemes) {
    parts.push('*Life Themes analysis not available for this report.*');
    return {
      number: 5,
      title: 'Life Themes',
      titleChinese: '人生主题',
      content: parts.join('\n'),
      highlights: []
    };
  }

  // Essence theme
  if (lifeThemes.essence) {
    parts.push('### Essence Theme (本质主题)');
    parts.push('');
    parts.push(`**${lifeThemes.essence.title}** (${lifeThemes.essence.chineseTitle})`);
    parts.push('');
    parts.push(lifeThemes.essence.narrative || 'The core energetic signature of this relationship.');
    parts.push('');
  }

  // Dynamic theme
  if (lifeThemes.dynamics) {
    parts.push('### Dynamic Theme (动力主题)');
    parts.push('');
    parts.push(`**Primary Driver:** ${lifeThemes.dynamics.primaryDriver}`);
    parts.push(`**Movement Pattern:** ${lifeThemes.dynamics.movementPattern}`);
    parts.push('');
    if (lifeThemes.dynamics.narrative) {
      parts.push(lifeThemes.dynamics.narrative);
      parts.push('');
    }
  }

  // Shadow theme
  if (lifeThemes.shadow) {
    parts.push('### Shadow Theme (阴影主题)');
    parts.push('');
    parts.push(`**Shadow Pattern:** ${lifeThemes.shadow.shadowPattern}`);
    parts.push('');
    if (lifeThemes.shadow.triggers && lifeThemes.shadow.triggers.length > 0) {
      parts.push('**Triggers:**');
      lifeThemes.shadow.triggers.slice(0, 3).forEach(t => parts.push(`- ${t}`));
      parts.push('');
    }
    if (lifeThemes.shadow.healingPath) {
      parts.push(`**Healing Path:** ${lifeThemes.shadow.healingPath}`);
      parts.push('');
    }
  }

  // Destiny arc
  if (lifeThemes.destinyArc) {
    parts.push('### Destiny Arc (命运弧线)');
    parts.push('');
    parts.push(`**Arc Type:** ${lifeThemes.destinyArc.title}` + (lifeThemes.destinyArc.chineseTitle ? ` (${lifeThemes.destinyArc.chineseTitle})` : ''));
    parts.push('');
    if (lifeThemes.destinyArc.overallNarrative) {
      parts.push(lifeThemes.destinyArc.overallNarrative);
      parts.push('');
    }
    if (lifeThemes.destinyArc.majorTransitions && lifeThemes.destinyArc.majorTransitions.length > 0) {
      parts.push('**Key Transitions:**');
      lifeThemes.destinyArc.majorTransitions.slice(0, 3).forEach((t: { year: number; description: string }) => {
        parts.push(`- Year ${t.year}: ${t.description}`);
      });
      parts.push('');
    }
  }

  // Karmic signature
  if (lifeThemes.karmic) {
    parts.push('### Karmic Signature (因缘印记)');
    parts.push('');
    if (lifeThemes.karmic.soulContract) {
      parts.push(`**Soul Contract:** ${lifeThemes.karmic.soulContract}`);
      parts.push('');
    }
    if (lifeThemes.karmic.spiritualGift) {
      parts.push(`**Spiritual Gift:** ${lifeThemes.karmic.spiritualGift}`);
      parts.push('');
    }
    if (lifeThemes.karmic.karmicLesson) {
      parts.push(`**Karmic Lesson:** ${lifeThemes.karmic.karmicLesson}`);
      parts.push('');
    }
  }

  const highlights = [
    lifeThemes.essence?.title || '',
    lifeThemes.dynamics?.primaryDriver || '',
    lifeThemes.destinyArc?.title || ''
  ].filter(h => h);

  return {
    number: 5,
    title: 'Life Themes',
    titleChinese: '人生主题',
    content: parts.join('\n'),
    highlights,
    data: {
      essence: lifeThemes.essence?.title,
      dynamics: lifeThemes.dynamics?.primaryDriver,
      shadow: lifeThemes.shadow?.shadowPattern
    }
  };
}

// ============================================================================
// CHAPTER 6: RELATIONSHIP LIFECYCLE
// ============================================================================

/**
 * Generate Chapter 6: Relationship Lifecycle
 */
export function generateChapterLifecycle(input: ForecastReportInput): ReportChapter {
  const { lifecycle, partnerA, partnerB } = input;
  const parts: string[] = [];

  if (!lifecycle) {
    parts.push('*Lifecycle analysis not available for this report.*');
    return {
      number: 6,
      title: 'Relationship Lifecycle Phase',
      titleChinese: '关系生命周期阶段',
      content: parts.join('\n'),
      highlights: []
    };
  }

  // Current phase
  parts.push('### Current Phase');
  parts.push('');
  parts.push(`**${lifecycle.currentPhase.name}** (${lifecycle.currentPhase.chineseName})`);
  parts.push('');
  parts.push(`*Theme:* ${lifecycle.currentPhase.theme}`);
  parts.push('');
  parts.push(`*Purpose:* ${lifecycle.currentPhase.purpose}`);
  parts.push('');
  parts.push(`*Challenge:* ${lifecycle.currentPhase.challenge}`);
  parts.push('');
  parts.push(`*Gift:* ${lifecycle.currentPhase.gift}`);
  parts.push('');

  // Phase score
  parts.push(`**Phase Match Score:** ${lifecycle.currentPhaseScore}/100`);
  parts.push('');

  if (lifecycle.currentPhaseMatchFactors && lifecycle.currentPhaseMatchFactors.length > 0) {
    parts.push('**Why this phase:**');
    lifecycle.currentPhaseMatchFactors.slice(0, 3).forEach(f => parts.push(`- ${f}`));
    parts.push('');
  }

  // Upcoming phase
  if (lifecycle.upcomingPhase) {
    parts.push('### Upcoming Phase');
    parts.push('');
    parts.push(`**${lifecycle.upcomingPhase.name}** (${lifecycle.upcomingPhase.chineseName})`);
    if (lifecycle.upcomingPhaseYear) {
      parts.push(`*Expected around:* ${lifecycle.upcomingPhaseYear}`);
    }
    parts.push('');
    parts.push(`*Theme:* ${lifecycle.upcomingPhase.theme}`);
    parts.push('');
  }

  // Long-term phase
  if (lifecycle.longTermPhase) {
    parts.push('### Long-Term Destination');
    parts.push('');
    parts.push(`**${lifecycle.longTermPhase.name}** (${lifecycle.longTermPhase.chineseName})`);
    parts.push('');
    parts.push(`The ${partnerA.name}-${partnerB.name} relationship is evolving toward ${lifecycle.longTermPhase.name} — ${lifecycle.longTermPhase.theme}.`);
    parts.push('');
  }

  // Current advice
  if (lifecycle.currentAdvice && lifecycle.currentAdvice.length > 0) {
    parts.push('### Phase Guidance');
    parts.push('');
    lifecycle.currentAdvice.forEach(a => parts.push(`- ${a}`));
    parts.push('');
  }

  // Future outlook
  if (lifecycle.futureOutlook) {
    parts.push('### Future Outlook');
    parts.push('');
    parts.push(lifecycle.futureOutlook);
  }

  const highlights = [
    `Current: ${lifecycle.currentPhase.chineseName}`,
    lifecycle.upcomingPhase ? `Next: ${lifecycle.upcomingPhase.chineseName}` : '',
    lifecycle.longTermPhase ? `Destiny: ${lifecycle.longTermPhase.chineseName}` : ''
  ].filter(h => h);

  return {
    number: 6,
    title: 'Relationship Lifecycle Phase',
    titleChinese: '关系生命周期阶段',
    content: parts.join('\n'),
    highlights,
    data: {
      currentPhase: lifecycle.currentPhase.name,
      upcomingPhase: lifecycle.upcomingPhase?.name,
      longTermPhase: lifecycle.longTermPhase?.name
    }
  };
}

// ============================================================================
// CHAPTER 7: COMPOSITE TIMING FORECAST
// ============================================================================

/**
 * Generate Chapter 7: Composite Timing Forecast
 */
export function generateChapterTiming(input: ForecastReportInput): ReportChapter {
  const { composite, timing } = input;
  const parts: string[] = [];

  // Luck Pillars
  parts.push('### Composite Luck Pillars (大运)');
  parts.push('');

  if (composite.luckPillars && composite.luckPillars.length > 0) {
    parts.push(describeLuckPillars(composite.luckPillars));
  } else if (timing?.luckPillars && timing.luckPillars.length > 0) {
    parts.push(describeTimingEntries(timing.luckPillars, 'Luck Pillar'));
  } else {
    parts.push('*Luck Pillar data not available.*');
  }
  parts.push('');

  // Annual cycles
  parts.push('### Annual Cycles (流年)');
  parts.push('');
  if (timing?.annual && timing.annual.length > 0) {
    parts.push(describeTimingEntries(timing.annual, 'Year'));
  } else {
    parts.push(generateAnnualForecast());
  }
  parts.push('');

  // Monthly cycles
  if (timing?.monthly && timing.monthly.length > 0) {
    parts.push('### Monthly Cycles (流月)');
    parts.push('');
    parts.push(describeTimingEntries(timing.monthly, 'Month'));
    parts.push('');
  }

  // Timing summary
  parts.push('### Timing Summary');
  parts.push('');
  parts.push(generateTimingSummary(composite, timing));

  const highlights = extractTimingHighlights(composite.luckPillars);

  return {
    number: 7,
    title: 'Composite Timing Forecast',
    titleChinese: '合盘运势预测',
    content: parts.join('\n'),
    highlights,
    data: {
      luckPillarCount: composite.luckPillars?.length || 0
    }
  };
}

/**
 * Describe luck pillars
 */
function describeLuckPillars(luckPillars: CompositeLuckPillar[]): string {
  const parts: string[] = [];

  // Show next 5 pillars
  const relevantPillars = luckPillars.slice(0, 5);

  for (const lp of relevantPillars) {
    const favorIcon = lp.favorability === 'excellent' ? '★★★' :
                     lp.favorability === 'good' ? '★★' :
                     lp.favorability === 'neutral' ? '★' :
                     lp.favorability === 'challenging' ? '⚡' : '⚡⚡';

    parts.push(`**Ages ${lp.startAge}-${lp.endAge}** | ${lp.stem}${lp.branch} | ${lp.element} ${favorIcon}`);
    parts.push(`*${lp.description || describeFavorability(lp.favorability)}*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Describe favorability
 */
function describeFavorability(favorability: string): string {
  switch (favorability) {
    case 'excellent':
      return 'An excellent period for the relationship — growth and harmony abound.';
    case 'good':
      return 'A favorable period with positive momentum.';
    case 'neutral':
      return 'A balanced period for steady progress.';
    case 'challenging':
      return 'A period requiring conscious attention and adaptation.';
    case 'difficult':
      return 'A transformative period — challenges become growth opportunities.';
    default:
      return 'A period with its own unique energy.';
  }
}

/**
 * Describe timing entries
 */
function describeTimingEntries(entries: TimingForecastEntry[], _type: string): string {
  const parts: string[] = [];

  for (const entry of entries.slice(0, 5)) {
    const tierIcon = entry.tier === 'excellent' || entry.tier === 'breakthrough' ? '★★★' :
                    entry.tier === 'good' || entry.tier === 'growth' ? '★★' :
                    entry.tier === 'neutral' || entry.tier === 'stable' ? '★' : '⚡';

    parts.push(`**${entry.period}** | ${entry.score}/100 ${tierIcon}`);

    if (entry.highlights && entry.highlights.length > 0) {
      parts.push(`*Highlights:* ${entry.highlights.join(', ')}`);
    }

    if (entry.challenges && entry.challenges.length > 0) {
      parts.push(`*Watch:* ${entry.challenges.join(', ')}`);
    }

    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Generate annual forecast (default)
 */
function generateAnnualForecast(): string {
  const currentYear = new Date().getFullYear();
  const parts: string[] = [];

  for (let year = currentYear; year <= currentYear + 3; year++) {
    const stemIndex = (year - 4) % 10;
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const elements: ElementName[] = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];

    parts.push(`**${year}** | ${stems[stemIndex]} | ${elements[stemIndex]} (${ELEMENT_CHINESE[elements[stemIndex]]}) Year`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Generate timing summary
 */
function generateTimingSummary(composite: CompositeChart, _timing?: ForecastReportInput['timing']): string {
  const parts: string[] = [];

  // Identify best periods
  const goodPillars = composite.luckPillars?.filter(lp =>
    lp.favorability === 'excellent' || lp.favorability === 'good'
  ) || [];

  if (goodPillars.length > 0) {
    const bestPillar = goodPillars[0];
    parts.push(`**Best Upcoming Period:** Ages ${bestPillar.startAge}-${bestPillar.endAge}`);
    parts.push(`${bestPillar.element} energy supports the relationship during this window.`);
    parts.push('');
  }

  // Identify challenging periods
  const challengingPillars = composite.luckPillars?.filter(lp =>
    lp.favorability === 'challenging' || lp.favorability === 'difficult'
  ) || [];

  if (challengingPillars.length > 0) {
    const challengePillar = challengingPillars[0];
    parts.push(`**Growth Period:** Ages ${challengePillar.startAge}-${challengePillar.endAge}`);
    parts.push(`This period offers transformation opportunities through conscious navigation.`);
  }

  if (parts.length === 0) {
    parts.push('The timing cycles show a balanced distribution of opportunities and growth periods.');
  }

  return parts.join('\n');
}

/**
 * Extract timing highlights
 */
function extractTimingHighlights(luckPillars?: CompositeLuckPillar[]): string[] {
  const highlights: string[] = [];

  if (!luckPillars || luckPillars.length === 0) return highlights;

  const excellent = luckPillars.filter(lp => lp.favorability === 'excellent');
  if (excellent.length > 0) {
    highlights.push(`${excellent.length} excellent periods`);
  }

  const challenging = luckPillars.filter(lp => lp.favorability === 'challenging' || lp.favorability === 'difficult');
  if (challenging.length > 0) {
    highlights.push(`${challenging.length} growth periods`);
  }

  return highlights;
}

// ============================================================================
// CHAPTER 8: EVENT TRIGGERS
// ============================================================================

/**
 * Generate Chapter 8: Composite Event Triggers
 */
export function generateChapterEventTriggers(input: ForecastReportInput): ReportChapter {
  const { compositeEvents } = input;
  const parts: string[] = [];

  if (!compositeEvents || compositeEvents.length === 0) {
    parts.push('*Event trigger analysis not available for this report.*');
    return {
      number: 8,
      title: 'Composite Event Trigger Windows',
      titleChinese: '合盘应期',
      content: parts.join('\n'),
      highlights: []
    };
  }

  parts.push('Event trigger windows indicate periods when significant relationship events are more likely to manifest.');
  parts.push('');

  // Group by tier
  const strongEvents = compositeEvents.filter(e => e.tier === 'strong');
  const likelyEvents = compositeEvents.filter(e => e.tier === 'likely');
  const mildEvents = compositeEvents.filter(e => e.tier === 'mild');

  // Strong windows
  if (strongEvents.length > 0) {
    parts.push('### Strong Windows (强应期)');
    parts.push('');
    parts.push('*High probability events — pay close attention to these periods.*');
    parts.push('');
    strongEvents.forEach(e => {
      parts.push(`**${e.year}${e.month ? ` Q${Math.ceil(e.month / 3)}` : ''}** | ${e.typeChinese} (${e.type})`);
      parts.push(`*${e.description}*`);
      parts.push(`Probability: ${e.probability}%`);
      parts.push('');
    });
  }

  // Likely windows
  if (likelyEvents.length > 0) {
    parts.push('### Likely Windows (可能应期)');
    parts.push('');
    parts.push('*Moderate probability events — opportunities to cultivate.*');
    parts.push('');
    likelyEvents.slice(0, 5).forEach(e => {
      parts.push(`**${e.year}${e.month ? ` Q${Math.ceil(e.month / 3)}` : ''}** | ${e.typeChinese}`);
      parts.push(`*${e.description}*`);
      parts.push('');
    });
  }

  // Mild windows
  if (mildEvents.length > 0) {
    parts.push('### Mild Windows (轻应期)');
    parts.push('');
    parts.push('*Background influences — subtle but present.*');
    parts.push('');
    mildEvents.slice(0, 3).forEach(e => {
      parts.push(`- **${e.year}**: ${e.typeChinese} — ${e.description}`);
    });
    parts.push('');
  }

  // Interpretation
  parts.push('### Interpretation');
  parts.push('');
  parts.push(generateEventInterpretation(compositeEvents));

  const highlights = [
    `${strongEvents.length} strong windows`,
    `${likelyEvents.length} likely windows`,
    `${compositeEvents.length} total events`
  ];

  return {
    number: 8,
    title: 'Composite Event Trigger Windows',
    titleChinese: '合盘应期',
    content: parts.join('\n'),
    highlights,
    data: {
      strongCount: strongEvents.length,
      likelyCount: likelyEvents.length,
      mildCount: mildEvents.length
    }
  };
}

/**
 * Generate event interpretation
 */
function generateEventInterpretation(events: CompositeEventSummary[]): string {
  const parts: string[] = [];

  // Event type distribution
  const typeCount = new Map<string, number>();
  for (const e of events) {
    typeCount.set(e.type, (typeCount.get(e.type) || 0) + 1);
  }

  const typeEntries = Array.from(typeCount.entries());
  const dominantType = typeEntries.sort((a, b) => b[1] - a[1])[0];

  if (dominantType) {
    const typeDescriptions: Record<string, string> = {
      'relationship': 'emotional breakthroughs and commitment milestones',
      'growth': 'shared projects and creative expansion',
      'challenge': 'transformation windows and growth opportunities',
      'destiny': 'fated turning points and major life changes',
      'milestone': 'significant achievements and markers',
      'breakthrough': 'transcendence of previous limitations',
      'healing': 'reconciliation and repair periods',
      'transition': 'major shifts in the relationship journey'
    };

    parts.push(`The forecast shows a predominance of **${dominantType[0]}** events, indicating ${typeDescriptions[dominantType[0]] || 'significant developments'} in the coming period.`);
    parts.push('');
  }

  // Timing concentration
  const years = events.map(e => e.year);
  const uniqueYears = Array.from(new Set(years)).sort();
  if (uniqueYears.length > 0) {
    parts.push(`Key years to watch: **${uniqueYears.slice(0, 3).join(', ')}**`);
  }

  return parts.join('\n');
}

// ============================================================================
// CHAPTER 9: TRAJECTORY CURVES
// ============================================================================

/**
 * Generate Chapter 9: Destiny Trajectory Curves
 */
export function generateChapterTrajectory(input: ForecastReportInput): ReportChapter {
  const { trajectory } = input;
  const parts: string[] = [];

  if (!trajectory || Object.keys(trajectory).length === 0) {
    parts.push('*Trajectory curve analysis not available for this report.*');
    return {
      number: 9,
      title: 'Destiny Trajectory Curves',
      titleChinese: '运势曲线',
      content: parts.join('\n'),
      highlights: []
    };
  }

  parts.push('Trajectory curves show the energetic flow of different life domains over time.');
  parts.push('');

  // Overall curve
  if (trajectory.overall) {
    parts.push('### Overall Trajectory');
    parts.push('');
    parts.push(describeTrajectoryCurve(trajectory.overall, 'overall'));
    parts.push('');
  }

  // Relationship curve
  if (trajectory.relationship) {
    parts.push('### Relationship Trajectory');
    parts.push('');
    parts.push(describeTrajectoryCurve(trajectory.relationship, 'relationship'));
    parts.push('');
  }

  // Wealth curve
  if (trajectory.wealth) {
    parts.push('### Wealth Trajectory');
    parts.push('');
    parts.push(describeTrajectoryCurve(trajectory.wealth, 'wealth'));
    parts.push('');
  }

  // Career curve
  if (trajectory.career) {
    parts.push('### Career Trajectory');
    parts.push('');
    parts.push(describeTrajectoryCurve(trajectory.career, 'career'));
    parts.push('');
  }

  // Health curve
  if (trajectory.health) {
    parts.push('### Health Trajectory');
    parts.push('');
    parts.push(describeTrajectoryCurve(trajectory.health, 'health'));
  }

  const highlights = [];
  if (trajectory.overall) highlights.push('Overall curve');
  if (trajectory.relationship) highlights.push('Relationship curve');
  if (trajectory.wealth) highlights.push('Wealth curve');

  return {
    number: 9,
    title: 'Destiny Trajectory Curves',
    titleChinese: '运势曲线',
    content: parts.join('\n'),
    highlights,
    data: {
      curvesAvailable: Object.keys(trajectory).length
    }
  };
}

/**
 * Describe trajectory curve
 */
function describeTrajectoryCurve(curve: TrajectoryCurve, domain: string): string {
  const parts: string[] = [];

  parts.push(`**Domain:** ${curve.domainChinese || domain}`);
  parts.push('');

  // Analyze curve shape
  if (curve.points && curve.points.length > 0) {
    const firstPoint = curve.points[0];
    const lastPoint = curve.points[curve.points.length - 1];
    const avgScore = curve.points.reduce((sum, p) => sum + p.score, 0) / curve.points.length;

    parts.push(`**Average Score:** ${Math.round(avgScore)}/100`);
    parts.push('');

    // Trend
    const trend = lastPoint.score > firstPoint.score ? 'ascending' :
                  lastPoint.score < firstPoint.score ? 'descending' : 'stable';

    parts.push(`**Trend:** ${trend.charAt(0).toUpperCase() + trend.slice(1)}`);
    parts.push('');
  }

  // Peaks and valleys
  if (curve.peaks && curve.peaks.length > 0) {
    parts.push('**Peak Periods:**');
    curve.peaks.slice(0, 2).forEach(p => {
      parts.push(`- Around age/year ${Math.round(p.t)}: Score ${Math.round(p.score)}`);
    });
    parts.push('');
  }

  if (curve.valleys && curve.valleys.length > 0) {
    parts.push('**Challenge Periods:**');
    curve.valleys.slice(0, 2).forEach(v => {
      parts.push(`- Around age/year ${Math.round(v.t)}: Score ${Math.round(v.score)}`);
    });
  }

  return parts.join('\n');
}

// ============================================================================
// CHAPTER 10: GUIDANCE & INTEGRATION
// ============================================================================

/**
 * Generate Chapter 10: Guidance & Integration
 */
export function generateChapterGuidance(input: ForecastReportInput): ReportChapter {
  const { composite, synastry, lifecycle, partnerA, partnerB } = input;
  const parts: string[] = [];

  parts.push(`This final chapter integrates the full analysis into practical guidance for ${partnerA.name} and ${partnerB.name}.`);
  parts.push('');

  // What supports the relationship
  parts.push('### What Supports This Relationship');
  parts.push('');
  parts.push(generateSupportingFactors(composite, synastry));
  parts.push('');

  // What challenges it
  parts.push('### Growth Edges');
  parts.push('');
  parts.push(generateChallenges(composite, synastry));
  parts.push('');

  // How to navigate the next cycle
  parts.push('### Navigating the Current Cycle');
  parts.push('');
  parts.push(generateNavigationGuidance(composite, lifecycle));
  parts.push('');

  // Practical recommendations
  parts.push('### Practical Recommendations');
  parts.push('');
  parts.push(generatePracticalRecommendations(composite));
  parts.push('');

  // Closing
  parts.push('### Closing Reflection');
  parts.push('');
  parts.push(generateClosingReflection(partnerA, partnerB, composite));

  const highlights = [
    'Support factors',
    'Growth edges',
    'Navigation guidance'
  ];

  return {
    number: 10,
    title: 'Guidance & Integration',
    titleChinese: '关系指导',
    content: parts.join('\n'),
    highlights
  };
}

/**
 * Generate supporting factors
 */
function generateSupportingFactors(
  composite: CompositeChart,
  synastry?: SynastryHeatmap
): string {
  const factors: string[] = [];

  // Useful God alignment
  if (composite.usefulGod) {
    factors.push(`**${composite.usefulGod.element} Alignment:** ${composite.usefulGod.stabilizingAdvice || 'Activities and environments with ' + composite.usefulGod.element + ' energy support the relationship.'}`);
  }

  // Strong synastry points
  if (synastry && synastry.overallScore >= 60) {
    factors.push(`**Natural Compatibility:** With a synastry score of ${synastry.overallScore}/100, this relationship has a solid energetic foundation.`);
  }

  // Auspicious Shen Sha
  const auspicious = composite.shenSha?.filter(s => s.nature === 'auspicious') || [];
  if (auspicious.length > 0) {
    factors.push(`**Beneficial Stars:** ${auspicious.map(s => s.chineseName).join(', ')} bring fortunate energy.`);
  }

  // Core strengths
  if (composite.coreStrengths && composite.coreStrengths.length > 0) {
    factors.push(`**Inherent Strengths:** ${composite.coreStrengths.slice(0, 2).join('; ')}.`);
  }

  if (factors.length === 0) {
    factors.push('Every relationship has unique supporting factors revealed through its energetic signature.');
  }

  return factors.join('\n\n');
}

/**
 * Generate challenges
 */
function generateChallenges(
  composite: CompositeChart,
  synastry?: SynastryHeatmap
): string {
  const challenges: string[] = [];

  // Elements to avoid
  if (composite.usefulGod?.avoidElements && composite.usefulGod.avoidElements.length > 0) {
    challenges.push(`**Elements to Moderate:** ${composite.usefulGod.avoidElements.map(e => `${e} (${ELEMENT_CHINESE[e]})`).join(', ')} — excessive focus on these areas can create imbalance.`);
  }

  // Tension in synastry
  if (synastry && synastry.strongestTension) {
    challenges.push(`**Tension Point:** The ${synastry.strongestTension.aPillarChinese}-${synastry.strongestTension.bPillarChinese} axis requires conscious attention and communication.`);
  }

  // Challenging Shen Sha
  const challenging = composite.shenSha?.filter(s => s.nature === 'inauspicious') || [];
  if (challenging.length > 0) {
    challenges.push(`**Stars to Navigate:** ${challenging.map(s => s.chineseName).join(', ')} indicate areas for growth.`);
  }

  // Vulnerabilities
  if (composite.coreVulnerabilities && composite.coreVulnerabilities.length > 0) {
    challenges.push(`**Growth Opportunities:** ${composite.coreVulnerabilities.slice(0, 2).join('; ')}.`);
  }

  if (challenges.length === 0) {
    challenges.push('No significant challenges identified. Focus on maintaining current strengths.');
  }

  return challenges.join('\n\n');
}

/**
 * Generate navigation guidance
 */
function generateNavigationGuidance(
  composite: CompositeChart,
  lifecycle?: RelationshipLifecycleResult
): string {
  const guidance: string[] = [];

  // Lifecycle-based guidance
  if (lifecycle?.currentPhase) {
    guidance.push(`**Current Phase (${lifecycle.currentPhase.chineseName}):** ${lifecycle.currentPhase.advice}`);
  }

  // Useful God timing
  if (composite.usefulGod) {
    guidance.push(`**Timing Strategy:** Plan important decisions and activities during periods aligned with ${composite.usefulGod.element} energy.`);
  }

  // Luck pillar awareness
  const currentYear = new Date().getFullYear();
  const relevantLP = composite.luckPillars?.find(lp => {
    const birthYear = 1980; // Approximation
    const age = currentYear - birthYear;
    return age >= lp.startAge && age < lp.endAge;
  });

  if (relevantLP) {
    guidance.push(`**Current Luck Pillar:** ${relevantLP.description || describeFavorability(relevantLP.favorability)}`);
  }

  if (guidance.length === 0) {
    guidance.push('Navigate with awareness of timing cycles and alignment with the Useful God element.');
  }

  return guidance.join('\n\n');
}

/**
 * Generate practical recommendations
 */
function generatePracticalRecommendations(composite: CompositeChart): string {
  const recommendations: string[] = [];

  // Element-based recommendations
  const usefulElement = composite.usefulGod?.element;
  if (usefulElement) {
    const elementRecs: Record<ElementName, string[]> = {
      Wood: [
        'Spend time in nature together',
        'Start new projects in spring',
        'Cultivate growth mindset and long-term vision'
      ],
      Fire: [
        'Engage in shared creative activities',
        'Attend events and social gatherings together',
        'Express appreciation and warmth openly'
      ],
      Earth: [
        'Create stable routines and rituals',
        'Focus on home and family activities',
        'Practice grounding exercises together'
      ],
      Metal: [
        'Set clear goals and boundaries',
        'Organize and declutter shared spaces',
        'Practice quality time over quantity'
      ],
      Water: [
        'Allow time for quiet reflection',
        'Explore spiritual or philosophical topics',
        'Practice deep listening and emotional attunement'
      ]
    };

    if (elementRecs[usefulElement]) {
      elementRecs[usefulElement].forEach(r => recommendations.push(`- ${r}`));
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('- Maintain open communication');
    recommendations.push('- Respect individual growth needs');
    recommendations.push('- Celebrate milestones together');
  }

  return recommendations.join('\n');
}

/**
 * Generate closing reflection
 */
function generateClosingReflection(
  partnerA: PartnerInfo,
  partnerB: PartnerInfo,
  composite: CompositeChart
): string {
  const parts: string[] = [];

  const dmElement = composite.dayMaster?.element || 'Earth';
  const karmicPurpose = composite.karmicPurpose || `mutual growth and shared evolution`;

  parts.push(`The ${partnerA.name}-${partnerB.name} relationship carries the energy of ${dmElement} — ${ELEMENT_DESCRIPTIONS[dmElement].quality}.`);
  parts.push('');
  parts.push(`At its core, this relationship exists for ${karmicPurpose}.`);
  parts.push('');
  parts.push('May this forecast serve as a guide for navigating the journey ahead with wisdom, compassion, and conscious intention.');

  return parts.join('\n');
}

// ============================================================================
// SUMMARY & NARRATIVE GENERATORS
// ============================================================================

/**
 * Generate executive summary
 */
export function generateExecutiveSummary(input: ForecastReportInput): string {
  const { composite, synastry, lifecycle, archetype, partnerA, partnerB } = input;
  const parts: string[] = [];

  parts.push(`## Executive Summary`);
  parts.push('');

  // Relationship identity
  const dmElement = composite.dayMaster?.element || 'Earth';
  parts.push(`**Relationship Identity:** ${dmElement} composite — ${ELEMENT_DESCRIPTIONS[dmElement].relational}.`);
  parts.push('');

  // Compatibility
  if (synastry) {
    parts.push(`**Compatibility Score:** ${synastry.overallScore}/100`);
  }

  // Archetype
  if (archetype?.primary) {
    parts.push(`**Primary Archetype:** ${archetype.primary.name} (${archetype.primary.chineseName})`);
  }

  // Current phase
  if (lifecycle?.currentPhase) {
    parts.push(`**Current Phase:** ${lifecycle.currentPhase.name} (${lifecycle.currentPhase.chineseName})`);
  }

  // Useful God
  if (composite.usefulGod) {
    parts.push(`**Key Element:** ${composite.usefulGod.element} — aligning with this element supports the relationship.`);
  }

  parts.push('');
  parts.push(`This report provides a comprehensive analysis of the ${partnerA.name}-${partnerB.name} relationship destiny.`);

  return parts.join('\n');
}

/**
 * Generate full narrative
 */
export function generateFullNarrative(
  chapters: ReportChapter[],
  input: ForecastReportInput
): string {
  const parts: string[] = [];

  // Title
  parts.push('# 合盘预测报告 (Composite Relationship Forecast)');
  parts.push('');
  parts.push(`## ${input.partnerA.name} & ${input.partnerB.name}`);
  parts.push('');
  parts.push(`*Generated: ${(input.generatedAt || new Date()).toLocaleDateString()}*`);
  parts.push('');
  parts.push('---');
  parts.push('');

  // Each chapter
  for (const chapter of chapters) {
    parts.push(`## ${chapter.number}. ${chapter.titleChinese} (${chapter.title})`);
    parts.push('');
    parts.push(chapter.content);
    parts.push('');
    parts.push('---');
    parts.push('');
  }

  // Footer
  parts.push('*This report was generated using BaZi composite analysis methodology.*');
  parts.push('');
  parts.push('*May your journey together be blessed with wisdom and growth.*');

  return parts.join('\n');
}

// ============================================================================
// UI FORMATTERS
// ============================================================================

/**
 * Format report for UI consumption
 */
export function formatReportForUI(report: CompositeForecastReport): {
  header: {
    title: string;
    titleChinese: string;
    subtitle: string;
    generatedAt: string;
  };
  partners: {
    a: PartnerInfo;
    b: PartnerInfo;
  };
  chapters: Array<{
    number: number;
    title: string;
    titleChinese: string;
    content: string;
    highlights: string[];
  }>;
  summary: string;
} {
  return {
    header: {
      title: report.title,
      titleChinese: report.titleChinese,
      subtitle: report.subtitle,
      generatedAt: report.generatedAt.toLocaleDateString()
    },
    partners: {
      a: report.partnerA,
      b: report.partnerB
    },
    chapters: report.chapters.map(ch => ({
      number: ch.number,
      title: ch.title,
      titleChinese: ch.titleChinese,
      content: ch.content,
      highlights: ch.highlights || []
    })),
    summary: report.summary
  };
}

/**
 * Get chapter navigation data
 */
export function getChapterNavigation(report: CompositeForecastReport): Array<{
  number: number;
  title: string;
  titleChinese: string;
}> {
  return report.chapters.map(ch => ({
    number: ch.number,
    title: ch.title,
    titleChinese: ch.titleChinese
  }));
}

/**
 * Export report as markdown
 */
export function exportReportAsMarkdown(report: CompositeForecastReport): string {
  return report.fullNarrative;
}

/**
 * Export report as JSON
 */
export function exportReportAsJSON(report: CompositeForecastReport): string {
  return JSON.stringify({
    title: report.title,
    titleChinese: report.titleChinese,
    subtitle: report.subtitle,
    generatedAt: report.generatedAt.toISOString(),
    partners: {
      a: report.partnerA,
      b: report.partnerB
    },
    chapters: report.chapters.map(ch => ({
      number: ch.number,
      title: ch.title,
      titleChinese: ch.titleChinese,
      highlights: ch.highlights,
      data: ch.data
    })),
    summary: report.summary
  }, null, 2);
}

// ============================================================================
// EXPORTS
// ============================================================================

// All functions and types are exported inline with 'export' keyword
