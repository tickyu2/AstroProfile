/**
 * ============================================
 * PRO REPORT GENERATOR
 * Complete Report Synthesis Engine
 *
 * Integrates all interpretation libraries into
 * comprehensive, multi-layered BaZi reports:
 * - Natal Chart Analysis
 * - Timing Analysis (Luck Pillars + Annual)
 * - Life Area Deep Dives
 * - Actionable Guidance
 * ============================================
 */

import {
  lookupTenGod,
  lookupTenGods,
  getTenGodDisplay,
  lookupStructure,
  getStructureDisplay,
  lookupUsefulGod,
  getUsefulGodDisplay,
  getUsefulGodEnhancements,
  getUsefulGodActivation,
  lookupShenShaList,
  getShenShaForPillar,
  lookupLuckPillar,
  getLuckPillarDisplay,
  lookupElementInteraction,
  lookupBranchRelationship,
  getMonthEmphasisDisplay,
  lookupChartInterpretations,
  type Language,
  type ChartContext,
  type MultiLookupResult
} from './proReportLookups';

import type { TenGodInterpretation } from './tenGodLibrary';
import type { StructureInterpretation } from './structureLibrary';
import type { UsefulGodInterpretation } from './usefulGodLibrary';
import type { ShenShaInterpretation } from './shenShaLibrary';
import type { LuckPillarInterpretation } from './luckPillarLibrary';
import type { AnnualElementInteraction, AnnualBranchRelationship } from './annualForecastLibrary';

// ==================== TYPES ====================

export interface ProReportInput {
  // Personal Information
  name?: string;
  birthDate: Date;
  birthTime?: string;
  gender?: 'male' | 'female';

  // Chart Data
  yearPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  dayPillar: { stem: string; branch: string };
  hourPillar?: { stem: string; branch: string };

  // Analysis Results
  dayMasterElement: string;
  dayMasterStrength: 'strong' | 'weak' | 'balanced';
  structureType: string;
  usefulGodElement: string;
  annoyingGodElement?: string;

  // Ten Gods Present
  tenGods: {
    pillar: 'year' | 'month' | 'day' | 'hour';
    position: 'stem' | 'branch' | 'hidden';
    tenGodId: string;
  }[];

  // Shen Sha Present
  shenSha: {
    starId: string;
    pillar: 'year' | 'month' | 'day' | 'hour';
  }[];

  // Current Timing
  currentAge?: number;
  currentLuckPillar?: { stem: string; branch: string; startAge: number; endAge: number };
  currentYear?: { stem: string; branch: string; year: number };
  currentMonth?: number;

  // Report Options
  language?: Language;
  includeTimingAnalysis?: boolean;
  includeLifeAreaDives?: boolean;
  includeActionableGuidance?: boolean;
}

export interface ProReportSection {
  title: string;
  titleZh: string;
  content: string;
  contentZh: string;
  priority: number;
  category: 'natal' | 'timing' | 'guidance' | 'forecast';
}

export interface ProReport {
  generatedAt: Date;
  input: ProReportInput;
  language: Language;
  sections: ProReportSection[];
  summary: {
    en: string;
    zh: string;
  };
  keyInsights: {
    en: string[];
    zh: string[];
  };
  actionItems: {
    en: string[];
    zh: string[];
  };
}

// ==================== SECTION GENERATORS ====================

/**
 * Generate Day Master Overview Section
 */
function generateDayMasterSection(input: ProReportInput): ProReportSection {
  const { dayMasterElement, dayMasterStrength, dayPillar } = input;

  const strengthDescriptions = {
    strong: {
      en: `Your ${dayMasterElement} Day Master is strong, giving you natural confidence and self-reliance. You have abundant inner resources and don't need much external support.`,
      zh: `你的${dayMasterElement}日主很强，赋予你天生的自信和自立。你有丰富的内在资源，不太需要外部支持。`
    },
    weak: {
      en: `Your ${dayMasterElement} Day Master is weak, making you naturally receptive and adaptable. You benefit from external support and thrive in collaborative environments.`,
      zh: `你的${dayMasterElement}日主较弱，使你天生善于接受和适应。你受益于外部支持，在协作环境中茁壮成长。`
    },
    balanced: {
      en: `Your ${dayMasterElement} Day Master is balanced, giving you flexibility to lead or follow as situations require. You have a natural equilibrium in your approach to life.`,
      zh: `你的${dayMasterElement}日主平衡，使你能根据情况灵活地领导或跟随。你在生活方式上有天然的平衡感。`
    }
  };

  const desc = strengthDescriptions[dayMasterStrength];

  return {
    title: 'Your Core Self - The Day Master',
    titleZh: '核心自我——日主',
    content: `${desc.en}\n\nYour Day Master represents your fundamental nature, how you process the world, and your basic approach to challenges and opportunities.`,
    contentZh: `${desc.zh}\n\n你的日主代表你的基本性质，你如何处理世界，以及你对挑战和机遇的基本态度。`,
    priority: 1,
    category: 'natal'
  };
}

/**
 * Generate Structure Section
 */
function generateStructureSection(input: ProReportInput): ProReportSection {
  const structureResult = lookupStructure(input.structureType);

  if (!structureResult.found || !structureResult.data) {
    return {
      title: 'Your Life Structure',
      titleZh: '人生格局',
      content: `Your chart follows the ${input.structureType} structure pattern.`,
      contentZh: `你的命盘遵循${input.structureType}格局。`,
      priority: 2,
      category: 'natal'
    };
  }

  const structure = structureResult.data;

  return {
    title: 'Your Life Structure',
    titleZh: '人生格局',
    content: `【${structure.name}】\n\n${structure.overview}\n\nPersonality: ${structure.personality}\n\nCareer Path: ${structure.career}\n\nRelationship Approach: ${structure.relationships}\n\nChallenges to Navigate: ${structure.challenges}`,
    contentZh: `【${structure.nameZh}】\n\n${structure.overviewZh}\n\n性格：${structure.personalityZh}\n\n事业道路：${structure.careerZh}\n\n关系方式：${structure.relationshipsZh}\n\n需要应对的挑战：${structure.challengesZh}`,
    priority: 2,
    category: 'natal'
  };
}

/**
 * Generate Useful God Section
 */
function generateUsefulGodSection(input: ProReportInput): ProReportSection {
  const usefulGodResult = lookupUsefulGod(input.usefulGodElement);

  if (!usefulGodResult.found || !usefulGodResult.data) {
    return {
      title: 'Your Favorable Element',
      titleZh: '用神',
      content: `Your chart benefits from ${input.usefulGodElement} energy.`,
      contentZh: `你的命盘受益于${input.usefulGodElement}能量。`,
      priority: 3,
      category: 'natal'
    };
  }

  const ug = usefulGodResult.data;
  const enhancements = getUsefulGodEnhancements(input.usefulGodElement);
  const activationTips = getUsefulGodActivation(input.usefulGodElement, 'en');

  return {
    title: 'Your Favorable Element - Useful God',
    titleZh: '用神——有利元素',
    content: `【${ug.element} as Your Useful God】\n\n${ug.overview}\n\nWhy This Element Helps You: ${ug.whyUseful}\n\nHow to Activate ${ug.element} Energy:\n• Career: ${ug.careerActivation}\n• Relationships: ${ug.relationshipActivation}\n• Health: ${ug.healthActivation}\n\nFavorable Colors: ${enhancements.colors.join(', ')}\nFavorable Directions: ${enhancements.directions.join(', ')}\nBeneficial Activities: ${enhancements.activities.join(', ')}\n\nPitfalls to Avoid: ${ug.pitfalls}`,
    contentZh: `【${ug.elementZh}用神】\n\n${ug.overviewZh}\n\n为什么这个元素对你有帮助：${ug.whyUsefulZh}\n\n如何激活${ug.elementZh}能量：\n• 事业：${ug.careerActivationZh}\n• 关系：${ug.relationshipActivationZh}\n• 健康：${ug.healthActivationZh}\n\n有利颜色：${enhancements.colors.join('、')}\n有利方向：${enhancements.directions.join('、')}\n有益活动：${enhancements.activities.join('、')}\n\n避免的陷阱：${ug.pitfallsZh}`,
    priority: 3,
    category: 'natal'
  };
}

/**
 * Generate Ten Gods Section
 */
function generateTenGodsSection(input: ProReportInput): ProReportSection {
  const tenGodIds = [...new Set(input.tenGods.map(tg => tg.tenGodId))];
  const interpretations = lookupTenGods(tenGodIds);

  if (interpretations.length === 0) {
    return {
      title: 'Your Ten Gods Profile',
      titleZh: '十神档案',
      content: 'Your Ten Gods pattern shapes your approach to life and relationships.',
      contentZh: '你的十神模式塑造你对生活和关系的态度。',
      priority: 4,
      category: 'natal'
    };
  }

  const contentEn = interpretations.map(tg => {
    const positions = input.tenGods
      .filter(t => t.tenGodId === tg.id)
      .map(t => `${t.pillar} pillar (${t.position})`)
      .join(', ');

    return `【${tg.name}】 (Found in: ${positions})\n${tg.coreEnergy}\n\nPersonality Influence: ${tg.personality}\nCareer Influence: ${tg.career}\nRelationship Influence: ${tg.relationships}`;
  }).join('\n\n---\n\n');

  const contentZh = interpretations.map(tg => {
    const positions = input.tenGods
      .filter(t => t.tenGodId === tg.id)
      .map(t => {
        const pillarZh = t.pillar === 'year' ? '年' : t.pillar === 'month' ? '月' : t.pillar === 'day' ? '日' : '时';
        const posZh = t.position === 'stem' ? '天干' : t.position === 'branch' ? '地支' : '藏干';
        return `${pillarZh}柱（${posZh}）`;
      })
      .join('、');

    return `【${tg.nameZh}】（位置：${positions}）\n${tg.coreEnergyZh}\n\n性格影响：${tg.personalityZh}\n事业影响：${tg.careerZh}\n关系影响：${tg.relationshipsZh}`;
  }).join('\n\n---\n\n');

  return {
    title: 'Your Ten Gods Profile',
    titleZh: '十神档案',
    content: contentEn,
    contentZh: contentZh,
    priority: 4,
    category: 'natal'
  };
}

/**
 * Generate Shen Sha Section
 */
function generateShenShaSection(input: ProReportInput): ProReportSection {
  const shenShaIds = [...new Set(input.shenSha.map(ss => ss.starId))];
  const interpretations = lookupShenShaList(shenShaIds);

  if (interpretations.length === 0) {
    return {
      title: 'Your Auxiliary Stars',
      titleZh: '神煞辅星',
      content: 'Your chart contains special stars that add nuance to your destiny.',
      contentZh: '你的命盘包含为你的命运增添细微差别的特殊星辰。',
      priority: 5,
      category: 'natal'
    };
  }

  const contentEn = interpretations.map(ss => {
    const positions = input.shenSha
      .filter(s => s.starId === ss.id)
      .map(s => {
        const pillarMeaning = ss.pillarMeaning[s.pillar] || ss.overview;
        return `In ${s.pillar} pillar: ${pillarMeaning}`;
      })
      .join('\n');

    return `【${ss.name}】 (${ss.category})\n${ss.overview}\n\n${positions}\n\nActivation: ${ss.activation}\nCaution: ${ss.caution}`;
  }).join('\n\n---\n\n');

  const contentZh = interpretations.map(ss => {
    const positions = input.shenSha
      .filter(s => s.starId === ss.id)
      .map(s => {
        const pillarZh = s.pillar === 'year' ? '年' : s.pillar === 'month' ? '月' : s.pillar === 'day' ? '日' : '时';
        const pillarMeaning = ss.pillarMeaningZh[s.pillar] || ss.overviewZh;
        return `${pillarZh}柱：${pillarMeaning}`;
      })
      .join('\n');

    const categoryZh = ss.category === 'auspicious' ? '吉' : ss.category === 'inauspicious' ? '凶' : '中性';

    return `【${ss.nameZh}】（${categoryZh}）\n${ss.overviewZh}\n\n${positions}\n\n激活：${ss.activationZh}\n注意：${ss.cautionZh}`;
  }).join('\n\n---\n\n');

  return {
    title: 'Your Auxiliary Stars',
    titleZh: '神煞辅星',
    content: contentEn,
    contentZh: contentZh,
    priority: 5,
    category: 'natal'
  };
}

/**
 * Generate Current Luck Pillar Section
 */
function generateCurrentLuckPillarSection(input: ProReportInput): ProReportSection | null {
  if (!input.currentLuckPillar) return null;

  const { stem, branch, startAge, endAge } = input.currentLuckPillar;
  const lpResult = lookupLuckPillar(stem, branch);

  let contentEn: string;
  let contentZh: string;

  if (lpResult.found && lpResult.data) {
    const lp = lpResult.data;
    contentEn = `【Current Luck Pillar: ${lp.stem} ${lp.branch} (Ages ${startAge}-${endAge})】\n\n${lp.overview}\n\nLife Themes: ${lp.lifeThemes}\n\nCareer Themes: ${lp.careerThemes}\n\nRelationship Themes: ${lp.relationshipThemes}\n\nInner Development Work: ${lp.innerWork}`;
    contentZh = `【当前大运：${lp.pillarZh}（${startAge}-${endAge}岁）】\n\n${lp.overviewZh}\n\n生活主题：${lp.lifeThemesZh}\n\n事业主题：${lp.careerThemesZh}\n\n关系主题：${lp.relationshipThemesZh}\n\n内在发展功课：${lp.innerWorkZh}`;
  } else {
    contentEn = `【Current Luck Pillar: ${stem} ${branch} (Ages ${startAge}-${endAge})】\n\nThis 10-year period brings its own themes and opportunities for growth.`;
    contentZh = `【当前大运：${stem}${branch}（${startAge}-${endAge}岁）】\n\n这个十年期带来自己的主题和成长机会。`;
  }

  return {
    title: 'Your Current Luck Pillar (10-Year Period)',
    titleZh: '当前大运（十年周期）',
    content: contentEn,
    contentZh: contentZh,
    priority: 6,
    category: 'timing'
  };
}

/**
 * Generate Annual Forecast Section
 */
function generateAnnualForecastSection(input: ProReportInput): ProReportSection | null {
  if (!input.currentYear) return null;

  const { stem, branch, year } = input.currentYear;

  // Element interaction with Day Master
  const yearElement = getElementForStem(stem);
  let elementInteractionContent = '';
  let elementInteractionContentZh = '';

  if (yearElement) {
    const interactionResult = lookupElementInteraction(yearElement, input.dayMasterElement);
    if (interactionResult.found && interactionResult.data) {
      const ei = interactionResult.data;
      elementInteractionContent = `\n\n【Element Interaction】\n${ei.overview}\n\nOpportunities: ${ei.opportunities}\nChallenges: ${ei.challenges}\nAdvice: ${ei.advice}`;
      elementInteractionContentZh = `\n\n【元素互动】\n${ei.overviewZh}\n\n机会：${ei.opportunitiesZh}\n挑战：${ei.challengesZh}\n建议：${ei.adviceZh}`;
    }
  }

  // Branch relationships with natal pillars
  let branchRelationships = '';
  let branchRelationshipsZh = '';

  const natalBranches = [
    { pillar: 'year', branch: input.yearPillar.branch },
    { pillar: 'month', branch: input.monthPillar.branch },
    { pillar: 'day', branch: input.dayPillar.branch }
  ];

  if (input.hourPillar) {
    natalBranches.push({ pillar: 'hour', branch: input.hourPillar.branch });
  }

  for (const natal of natalBranches) {
    const relationshipResult = lookupBranchRelationship(branch, natal.branch);
    if (relationshipResult.found && relationshipResult.data) {
      const br = relationshipResult.data;
      branchRelationships += `\n\n【${br.relationshipType.charAt(0).toUpperCase() + br.relationshipType.slice(1)} with ${natal.pillar} pillar】\n${br.overview}\nAffected Areas: ${br.lifeAreas.join(', ')}\nRemedies: ${br.remedies}`;
      branchRelationshipsZh += `\n\n【与${natal.pillar === 'year' ? '年' : natal.pillar === 'month' ? '月' : natal.pillar === 'day' ? '日' : '时'}柱${br.relationshipTypeZh}】\n${br.overviewZh}\n影响领域：${br.lifeAreasZh.join('、')}\n化解方法：${br.remediesZh}`;
    }
  }

  return {
    title: `Annual Forecast - ${year}`,
    titleZh: `${year}年流年预测`,
    content: `【${year} (${stem} ${branch} Year)】\n\nThis year brings ${yearElement || 'unique'} energy to interact with your chart.${elementInteractionContent}${branchRelationships}`,
    contentZh: `【${year}年（${stem}${branch}年）】\n\n今年带来${yearElement || '独特的'}能量与你的命盘互动。${elementInteractionContentZh}${branchRelationshipsZh}`,
    priority: 7,
    category: 'forecast'
  };
}

/**
 * Generate Monthly Outlook Section
 */
function generateMonthlyOutlookSection(input: ProReportInput): ProReportSection | null {
  if (!input.currentMonth) return null;

  const monthDisplay = getMonthEmphasisDisplay(input.currentMonth, 'en');
  const monthDisplayZh = getMonthEmphasisDisplay(input.currentMonth, 'zh');

  if (!monthDisplay) return null;

  return {
    title: 'This Month\'s Focus',
    titleZh: '本月焦点',
    content: monthDisplay,
    contentZh: monthDisplayZh,
    priority: 8,
    category: 'forecast'
  };
}

/**
 * Generate Actionable Guidance Section
 */
function generateGuidanceSection(input: ProReportInput): ProReportSection {
  const ug = lookupUsefulGod(input.usefulGodElement);
  const enhancements = getUsefulGodEnhancements(input.usefulGodElement);

  let contentEn = '【Practical Steps for Harmonizing Your Chart】\n\n';
  let contentZh = '【调和命盘的实际步骤】\n\n';

  // Colors
  if (enhancements.colors.length > 0) {
    contentEn += `Favorable Colors to Wear/Surround Yourself With:\n${enhancements.colors.map(c => `• ${c}`).join('\n')}\n\n`;
    contentZh += `穿着/围绕自己的有利颜色：\n${enhancements.colors.map(c => `• ${c}`).join('\n')}\n\n`;
  }

  // Directions
  if (enhancements.directions.length > 0) {
    contentEn += `Favorable Directions for Work/Travel:\n${enhancements.directions.map(d => `• ${d}`).join('\n')}\n\n`;
    contentZh += `工作/旅行的有利方向：\n${enhancements.directions.map(d => `• ${d}`).join('\n')}\n\n`;
  }

  // Activities
  if (enhancements.activities.length > 0) {
    contentEn += `Beneficial Activities to Cultivate:\n${enhancements.activities.map(a => `• ${a}`).join('\n')}\n\n`;
    contentZh += `要培养的有益活动：\n${enhancements.activities.map(a => `• ${a}`).join('\n')}\n\n`;
  }

  // Useful God specific guidance
  if (ug.found && ug.data) {
    contentEn += `\n【Element-Specific Guidance】\n\nCareer: ${ug.data.careerActivation}\n\nRelationships: ${ug.data.relationshipActivation}\n\nHealth: ${ug.data.healthActivation}\n\nTiming Notes: ${ug.data.timingNotes}`;
    contentZh += `\n【元素特定指导】\n\n事业：${ug.data.careerActivationZh}\n\n关系：${ug.data.relationshipActivationZh}\n\n健康：${ug.data.healthActivationZh}\n\n时机提示：${ug.data.timingNotesZh}`;
  }

  return {
    title: 'Actionable Guidance',
    titleZh: '可操作的指导',
    content: contentEn,
    contentZh: contentZh,
    priority: 9,
    category: 'guidance'
  };
}

// ==================== MAIN GENERATOR ====================

/**
 * Generate complete Pro Report
 */
export function generateProReport(input: ProReportInput): ProReport {
  const language = input.language || 'en';
  const sections: ProReportSection[] = [];

  // Core Natal Sections (always included)
  sections.push(generateDayMasterSection(input));
  sections.push(generateStructureSection(input));
  sections.push(generateUsefulGodSection(input));
  sections.push(generateTenGodsSection(input));
  sections.push(generateShenShaSection(input));

  // Timing Sections (optional)
  if (input.includeTimingAnalysis !== false) {
    const luckPillarSection = generateCurrentLuckPillarSection(input);
    if (luckPillarSection) sections.push(luckPillarSection);

    const annualSection = generateAnnualForecastSection(input);
    if (annualSection) sections.push(annualSection);

    const monthlySection = generateMonthlyOutlookSection(input);
    if (monthlySection) sections.push(monthlySection);
  }

  // Guidance Section (optional)
  if (input.includeActionableGuidance !== false) {
    sections.push(generateGuidanceSection(input));
  }

  // Sort by priority
  sections.sort((a, b) => a.priority - b.priority);

  // Generate summary
  const summary = generateSummary(input);

  // Generate key insights
  const keyInsights = generateKeyInsights(input);

  // Generate action items
  const actionItems = generateActionItems(input);

  return {
    generatedAt: new Date(),
    input,
    language,
    sections,
    summary,
    keyInsights,
    actionItems
  };
}

/**
 * Generate summary
 */
function generateSummary(input: ProReportInput): { en: string; zh: string } {
  const structureResult = lookupStructure(input.structureType);
  const structureName = structureResult.found ? structureResult.data!.name : input.structureType;
  const structureNameZh = structureResult.found ? structureResult.data!.nameZh : input.structureType;

  return {
    en: `Your ${input.dayMasterStrength} ${input.dayMasterElement} Day Master follows the ${structureName} pattern. Your chart benefits most from ${input.usefulGodElement} energy, which should be actively cultivated through colors, directions, and activities associated with this element.`,
    zh: `你的${input.dayMasterStrength === 'strong' ? '强' : input.dayMasterStrength === 'weak' ? '弱' : '平衡'}${input.dayMasterElement}日主遵循${structureNameZh}格局。你的命盘最受益于${input.usefulGodElement}能量，应通过与此元素相关的颜色、方向和活动积极培养。`
  };
}

/**
 * Generate key insights
 */
function generateKeyInsights(input: ProReportInput): { en: string[]; zh: string[] } {
  const insights: { en: string[]; zh: string[] } = { en: [], zh: [] };

  // Structure insight
  const structureResult = lookupStructure(input.structureType);
  if (structureResult.found && structureResult.data) {
    insights.en.push(`Your ${structureResult.data.name} structure shapes your approach to career and relationships.`);
    insights.zh.push(`你的${structureResult.data.nameZh}格局塑造你对事业和关系的态度。`);
  }

  // Day Master strength insight
  if (input.dayMasterStrength === 'strong') {
    insights.en.push('With a strong Day Master, you naturally lead and initiate. Be mindful of being too forceful.');
    insights.zh.push('日主强旺，你天生善于领导和发起。注意不要过于强势。');
  } else if (input.dayMasterStrength === 'weak') {
    insights.en.push('With a weak Day Master, you excel in collaborative roles. Seek supportive partnerships.');
    insights.zh.push('日主较弱，你在协作角色中表现出色。寻求支持性的伙伴关系。');
  }

  // Useful God insight
  const ugResult = lookupUsefulGod(input.usefulGodElement);
  if (ugResult.found && ugResult.data) {
    insights.en.push(`${input.usefulGodElement} energy is your ally. Surround yourself with ${ugResult.data.colors.slice(0, 2).join(' and ')} colors.`);
    insights.zh.push(`${ugResult.data.elementZh}能量是你的盟友。用${ugResult.data.colors.slice(0, 2).join('和')}颜色围绕自己。`);
  }

  // Shen Sha insights
  const auspicious = input.shenSha.filter(ss => {
    const result = lookupShenShaList([ss.starId]);
    return result.length > 0 && result[0].category === 'auspicious';
  });

  if (auspicious.length > 0) {
    insights.en.push(`You have ${auspicious.length} auspicious stars supporting your destiny.`);
    insights.zh.push(`你有${auspicious.length}颗吉星支持你的命运。`);
  }

  return insights;
}

/**
 * Generate action items
 */
function generateActionItems(input: ProReportInput): { en: string[]; zh: string[] } {
  const actions: { en: string[]; zh: string[] } = { en: [], zh: [] };
  const enhancements = getUsefulGodEnhancements(input.usefulGodElement);

  // Color action
  if (enhancements.colors.length > 0) {
    actions.en.push(`Incorporate ${enhancements.colors[0]} into your wardrobe and workspace.`);
    actions.zh.push(`将${enhancements.colors[0]}融入你的衣橱和工作空间。`);
  }

  // Direction action
  if (enhancements.directions.length > 0) {
    actions.en.push(`Face ${enhancements.directions[0]} when working on important projects.`);
    actions.zh.push(`处理重要项目时面向${enhancements.directions[0]}。`);
  }

  // Activity action
  if (enhancements.activities.length > 0) {
    actions.en.push(`Schedule time for ${enhancements.activities[0].toLowerCase()} regularly.`);
    actions.zh.push(`定期安排时间进行${enhancements.activities[0].toLowerCase()}。`);
  }

  // Structure-specific action
  const structureResult = lookupStructure(input.structureType);
  if (structureResult.found && structureResult.data) {
    if (structureResult.data.category === 'Wealth') {
      actions.en.push('Focus on building assets and financial literacy this period.');
      actions.zh.push('这段时期专注于建立资产和金融知识。');
    } else if (structureResult.data.category === 'Officer') {
      actions.en.push('Pursue leadership opportunities and professional recognition.');
      actions.zh.push('追求领导机会和职业认可。');
    } else if (structureResult.data.category === 'Resource') {
      actions.en.push('Invest in learning and developing expertise.');
      actions.zh.push('投资学习和发展专业知识。');
    }
  }

  return actions;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get element for stem
 */
function getElementForStem(stem: string): string | undefined {
  const stemElements: Record<string, string> = {
    'Jia': 'Wood', '甲': 'Wood',
    'Yi': 'Wood', '乙': 'Wood',
    'Bing': 'Fire', '丙': 'Fire',
    'Ding': 'Fire', '丁': 'Fire',
    'Wu': 'Earth', '戊': 'Earth',
    'Ji': 'Earth', '己': 'Earth',
    'Geng': 'Metal', '庚': 'Metal',
    'Xin': 'Metal', '辛': 'Metal',
    'Ren': 'Water', '壬': 'Water',
    'Gui': 'Water', '癸': 'Water'
  };

  return stemElements[stem];
}

/**
 * Format report as markdown string
 */
export function formatReportAsMarkdown(report: ProReport): string {
  const lang = report.language;
  let markdown = '';

  // Title
  markdown += `# BaZi Pro Report\n`;
  markdown += `Generated: ${report.generatedAt.toLocaleDateString()}\n\n`;

  // Summary
  markdown += `## Executive Summary\n\n`;
  markdown += `${lang === 'zh' ? report.summary.zh : report.summary.en}\n\n`;

  // Key Insights
  markdown += `## Key Insights\n\n`;
  const insights = lang === 'zh' ? report.keyInsights.zh : report.keyInsights.en;
  insights.forEach(insight => {
    markdown += `• ${insight}\n`;
  });
  markdown += '\n';

  // Sections
  for (const section of report.sections) {
    markdown += `## ${lang === 'zh' ? section.titleZh : section.title}\n\n`;
    markdown += `${lang === 'zh' ? section.contentZh : section.content}\n\n`;
  }

  // Action Items
  markdown += `## Action Items\n\n`;
  const actions = lang === 'zh' ? report.actionItems.zh : report.actionItems.en;
  actions.forEach((action, i) => {
    markdown += `${i + 1}. ${action}\n`;
  });

  return markdown;
}

/**
 * Format report as JSON
 */
export function formatReportAsJSON(report: ProReport): string {
  return JSON.stringify(report, null, 2);
}

// ==================== EXPORTS ====================

export {
  generateProReport,
  formatReportAsMarkdown,
  formatReportAsJSON,
  type ProReportInput,
  type ProReportSection,
  type ProReport
};
