/**
 * ============================================
 * PRO REPORT LOOKUPS
 * Unified Interpretation Lookup Layer
 *
 * Provides a single interface for accessing
 * all interpretation libraries with:
 * - Consistent lookup patterns
 * - Fallback handling
 * - Multi-library coordination
 * - Language support
 * ============================================
 */

import {
  TEN_GOD_LIBRARY,
  getTenGodInterpretation,
  getTenGodByZh,
  type TenGodInterpretation
} from './tenGodLibrary';

import {
  STRUCTURE_LIBRARY,
  getStructureInterpretation,
  getStructureByZh,
  type StructureInterpretation
} from './structureLibrary';

import {
  USEFUL_GOD_LIBRARY,
  getUsefulGodInterpretation,
  getActivationTips,
  getElementEnhancements,
  type UsefulGodInterpretation
} from './usefulGodLibrary';

import {
  SHEN_SHA_LIBRARY,
  getShenShaInterpretation,
  getShenShaByZh,
  getAuspiciousShenSha,
  getInauspiciousShenSha,
  type ShenShaInterpretation
} from './shenShaLibrary';

import {
  LUCK_PILLAR_LIBRARY,
  getLuckPillarInterpretation,
  getLuckPillarByZh,
  getStemMeaning,
  getBranchMeaning,
  type LuckPillarInterpretation
} from './luckPillarLibrary';

import {
  ELEMENT_INTERACTION_LIBRARY,
  BRANCH_RELATIONSHIP_LIBRARY,
  MONTHLY_EMPHASIS_LIBRARY,
  getElementInteraction,
  getBranchRelationship,
  getMonthlyEmphasis,
  getClashesForBranch,
  getCombinationsForBranch,
  type AnnualElementInteraction,
  type AnnualBranchRelationship,
  type MonthlyEmphasis
} from './annualForecastLibrary';

// ==================== TYPES ====================

export type Language = 'en' | 'zh';

export interface LookupResult<T> {
  found: boolean;
  data?: T;
  fallback?: string;
}

export interface MultiLookupResult {
  tenGod?: TenGodInterpretation;
  structure?: StructureInterpretation;
  usefulGod?: UsefulGodInterpretation;
  shenSha?: ShenShaInterpretation[];
  luckPillar?: LuckPillarInterpretation;
  annualInteractions?: AnnualElementInteraction[];
  branchRelationships?: AnnualBranchRelationship[];
}

export interface ChartContext {
  dayMasterElement?: string;
  dayMasterStem?: string;
  monthBranch?: string;
  yearBranch?: string;
  dayBranch?: string;
  hourBranch?: string;
  structureType?: string;
  usefulGodElement?: string;
  annoyingGodElement?: string;
  tenGods?: string[];
  shenSha?: string[];
  currentLuckPillarStem?: string;
  currentLuckPillarBranch?: string;
  currentYearStem?: string;
  currentYearBranch?: string;
}

// ==================== TEN GOD LOOKUPS ====================

/**
 * Lookup Ten God interpretation with fallback
 */
export function lookupTenGod(tenGodId: string): LookupResult<TenGodInterpretation> {
  const interpretation = getTenGodInterpretation(tenGodId);
  if (interpretation) {
    return { found: true, data: interpretation };
  }

  // Try by Chinese name
  const byZh = getTenGodByZh(tenGodId);
  if (byZh) {
    return { found: true, data: byZh };
  }

  return { found: false, fallback: `Ten God interpretation not found for: ${tenGodId}` };
}

/**
 * Lookup multiple Ten Gods
 */
export function lookupTenGods(tenGodIds: string[]): TenGodInterpretation[] {
  return tenGodIds
    .map(id => lookupTenGod(id))
    .filter(result => result.found)
    .map(result => result.data!);
}

/**
 * Get Ten God for display
 */
export function getTenGodDisplay(tenGodId: string, lang: Language = 'en'): string {
  const result = lookupTenGod(tenGodId);
  if (!result.found || !result.data) {
    return result.fallback || '';
  }

  const tg = result.data;
  if (lang === 'zh') {
    return `【${tg.nameZh}】\n${tg.coreEnergyZh}\n\n性格：${tg.personalityZh}\n事业：${tg.careerZh}\n关系：${tg.relationshipsZh}`;
  }

  return `【${tg.name}】\n${tg.coreEnergy}\n\nPersonality: ${tg.personality}\nCareer: ${tg.career}\nRelationships: ${tg.relationships}`;
}

// ==================== STRUCTURE LOOKUPS ====================

/**
 * Lookup Structure interpretation with fallback
 */
export function lookupStructure(structureType: string): LookupResult<StructureInterpretation> {
  const interpretation = getStructureInterpretation(structureType);
  if (interpretation) {
    return { found: true, data: interpretation };
  }

  // Try by Chinese name
  const byZh = getStructureByZh(structureType);
  if (byZh) {
    return { found: true, data: byZh };
  }

  return { found: false, fallback: `Structure interpretation not found for: ${structureType}` };
}

/**
 * Get Structure for display
 */
export function getStructureDisplay(structureType: string, lang: Language = 'en'): string {
  const result = lookupStructure(structureType);
  if (!result.found || !result.data) {
    return result.fallback || '';
  }

  const st = result.data;
  if (lang === 'zh') {
    return `【${st.nameZh}】\n${st.overviewZh}\n\n性格：${st.personalityZh}\n事业：${st.careerZh}\n关系：${st.relationshipsZh}\n挑战：${st.challengesZh}`;
  }

  return `【${st.name}】\n${st.overview}\n\nPersonality: ${st.personality}\nCareer: ${st.career}\nRelationships: ${st.relationships}\nChallenges: ${st.challenges}`;
}

// ==================== USEFUL GOD LOOKUPS ====================

/**
 * Lookup Useful God interpretation
 */
export function lookupUsefulGod(element: string): LookupResult<UsefulGodInterpretation> {
  const interpretation = getUsefulGodInterpretation(element);
  if (interpretation) {
    return { found: true, data: interpretation };
  }

  return { found: false, fallback: `Useful God interpretation not found for: ${element}` };
}

/**
 * Get Useful God activation advice
 */
export function getUsefulGodActivation(element: string, lang: Language = 'en'): string[] {
  return getActivationTips(element, lang);
}

/**
 * Get Useful God enhancements (colors, directions, activities)
 */
export function getUsefulGodEnhancements(element: string) {
  return getElementEnhancements(element);
}

/**
 * Get Useful God for display
 */
export function getUsefulGodDisplay(element: string, lang: Language = 'en'): string {
  const result = lookupUsefulGod(element);
  if (!result.found || !result.data) {
    return result.fallback || '';
  }

  const ug = result.data;
  if (lang === 'zh') {
    return `【${ug.elementZh}用神】\n${ug.overviewZh}\n\n为何有用：${ug.whyUsefulZh}\n如何激活：${ug.howToActivateZh}\n事业：${ug.careerActivationZh}\n关系：${ug.relationshipActivationZh}\n健康：${ug.healthActivationZh}`;
  }

  return `【${ug.element} as Useful God】\n${ug.overview}\n\nWhy Useful: ${ug.whyUseful}\nHow to Activate: ${ug.howToActivate}\nCareer: ${ug.careerActivation}\nRelationships: ${ug.relationshipActivation}\nHealth: ${ug.healthActivation}`;
}

// ==================== SHEN SHA LOOKUPS ====================

/**
 * Lookup Shen Sha interpretation
 */
export function lookupShenSha(shenShaId: string): LookupResult<ShenShaInterpretation> {
  const interpretation = getShenShaInterpretation(shenShaId);
  if (interpretation) {
    return { found: true, data: interpretation };
  }

  // Try by Chinese name
  const byZh = getShenShaByZh(shenShaId);
  if (byZh) {
    return { found: true, data: byZh };
  }

  return { found: false, fallback: `Shen Sha interpretation not found for: ${shenShaId}` };
}

/**
 * Lookup multiple Shen Sha
 */
export function lookupShenShaList(shenShaIds: string[]): ShenShaInterpretation[] {
  return shenShaIds
    .map(id => lookupShenSha(id))
    .filter(result => result.found)
    .map(result => result.data!);
}

/**
 * Get Shen Sha for specific pillar
 */
export function getShenShaForPillar(shenShaId: string, pillar: 'year' | 'month' | 'day' | 'hour', lang: Language = 'en'): string {
  const result = lookupShenSha(shenShaId);
  if (!result.found || !result.data) {
    return result.fallback || '';
  }

  const ss = result.data;
  const pillarMeaning = lang === 'zh' ? ss.pillarMeaningZh[pillar] : ss.pillarMeaning[pillar];

  if (lang === 'zh') {
    return `【${ss.nameZh}在${pillar === 'year' ? '年' : pillar === 'month' ? '月' : pillar === 'day' ? '日' : '时'}柱】\n${pillarMeaning}`;
  }

  return `【${ss.name} in ${pillar.charAt(0).toUpperCase() + pillar.slice(1)} Pillar】\n${pillarMeaning}`;
}

/**
 * Get auspicious Shen Sha list
 */
export function getAuspiciousList(): ShenShaInterpretation[] {
  return getAuspiciousShenSha();
}

/**
 * Get inauspicious Shen Sha list
 */
export function getInauspiciousList(): ShenShaInterpretation[] {
  return getInauspiciousShenSha();
}

// ==================== LUCK PILLAR LOOKUPS ====================

/**
 * Lookup Luck Pillar interpretation
 */
export function lookupLuckPillar(stem: string, branch: string): LookupResult<LuckPillarInterpretation> {
  const interpretation = getLuckPillarInterpretation(stem, branch);
  if (interpretation) {
    return { found: true, data: interpretation };
  }

  return { found: false, fallback: `Luck Pillar interpretation not found for: ${stem} ${branch}` };
}

/**
 * Lookup Luck Pillar by Chinese characters
 */
export function lookupLuckPillarByZh(pillarZh: string): LookupResult<LuckPillarInterpretation> {
  const interpretation = getLuckPillarByZh(pillarZh);
  if (interpretation) {
    return { found: true, data: interpretation };
  }

  return { found: false, fallback: `Luck Pillar interpretation not found for: ${pillarZh}` };
}

/**
 * Get Luck Pillar for display
 */
export function getLuckPillarDisplay(stem: string, branch: string, lang: Language = 'en'): string {
  const result = lookupLuckPillar(stem, branch);
  if (!result.found || !result.data) {
    // Try to at least return stem and branch meanings
    const stemMeaning = getStemMeaning(stem, lang);
    const branchMeaning = getBranchMeaning(branch, lang);
    if (stemMeaning || branchMeaning) {
      return lang === 'zh'
        ? `【${stem}${branch} 大运】\n天干：${stemMeaning}\n地支：${branchMeaning}`
        : `【${stem} ${branch} Luck Pillar】\nStem: ${stemMeaning}\nBranch: ${branchMeaning}`;
    }
    return result.fallback || '';
  }

  const lp = result.data;
  if (lang === 'zh') {
    return `【${lp.pillarZh} 大运】\n${lp.overviewZh}\n\n生活主题：${lp.lifeThemesZh}\n事业主题：${lp.careerThemesZh}\n关系主题：${lp.relationshipThemesZh}\n内在功课：${lp.innerWorkZh}`;
  }

  return `【${lp.stem} ${lp.branch} Luck Pillar】\n${lp.overview}\n\nLife Themes: ${lp.lifeThemes}\nCareer Themes: ${lp.careerThemes}\nRelationship Themes: ${lp.relationshipThemes}\nInner Work: ${lp.innerWork}`;
}

// ==================== ANNUAL FORECAST LOOKUPS ====================

/**
 * Lookup element interaction
 */
export function lookupElementInteraction(
  incomingElement: string,
  natalElement: string
): LookupResult<AnnualElementInteraction> {
  const interaction = getElementInteraction(incomingElement, natalElement);
  if (interaction) {
    return { found: true, data: interaction };
  }

  return { found: false, fallback: `Element interaction not found for: ${incomingElement} → ${natalElement}` };
}

/**
 * Lookup branch relationship
 */
export function lookupBranchRelationship(
  incomingBranch: string,
  natalBranch: string
): LookupResult<AnnualBranchRelationship> {
  const relationship = getBranchRelationship(incomingBranch, natalBranch);
  if (relationship) {
    return { found: true, data: relationship };
  }

  return { found: false, fallback: `Branch relationship not found for: ${incomingBranch} - ${natalBranch}` };
}

/**
 * Get monthly emphasis for display
 */
export function getMonthEmphasisDisplay(month: number, lang: Language = 'en'): string {
  const emphasis = getMonthlyEmphasis(month);
  if (!emphasis) return '';

  if (lang === 'zh') {
    return `【${emphasis.monthNameZh}】\n主题：${emphasis.themesZh}\n机会：${emphasis.opportunitiesZh}\n注意：${emphasis.cautionsZh}`;
  }

  return `【${emphasis.monthName}】\nThemes: ${emphasis.themes}\nOpportunities: ${emphasis.opportunities}\nCautions: ${emphasis.cautions}`;
}

/**
 * Get all clashes for a branch
 */
export function getBranchClashes(natalBranch: string): AnnualBranchRelationship[] {
  return getClashesForBranch(natalBranch);
}

/**
 * Get all combinations for a branch
 */
export function getBranchCombinations(natalBranch: string): AnnualBranchRelationship[] {
  return getCombinationsForBranch(natalBranch);
}

// ==================== MULTI-LIBRARY LOOKUPS ====================

/**
 * Comprehensive chart lookup - gets all relevant interpretations for a chart context
 */
export function lookupChartInterpretations(context: ChartContext): MultiLookupResult {
  const result: MultiLookupResult = {};

  // Structure
  if (context.structureType) {
    const structureResult = lookupStructure(context.structureType);
    if (structureResult.found) {
      result.structure = structureResult.data;
    }
  }

  // Useful God
  if (context.usefulGodElement) {
    const usefulGodResult = lookupUsefulGod(context.usefulGodElement);
    if (usefulGodResult.found) {
      result.usefulGod = usefulGodResult.data;
    }
  }

  // Ten Gods
  if (context.tenGods && context.tenGods.length > 0) {
    const tenGodResults = lookupTenGods(context.tenGods);
    if (tenGodResults.length > 0) {
      result.tenGod = tenGodResults[0]; // Primary ten god
    }
  }

  // Shen Sha
  if (context.shenSha && context.shenSha.length > 0) {
    result.shenSha = lookupShenShaList(context.shenSha);
  }

  // Current Luck Pillar
  if (context.currentLuckPillarStem && context.currentLuckPillarBranch) {
    const luckPillarResult = lookupLuckPillar(
      context.currentLuckPillarStem,
      context.currentLuckPillarBranch
    );
    if (luckPillarResult.found) {
      result.luckPillar = luckPillarResult.data;
    }
  }

  // Annual Interactions
  if (context.currentYearStem && context.dayMasterElement) {
    // Get stem element for year
    const yearElement = getElementForStem(context.currentYearStem);
    if (yearElement) {
      const interactionResult = lookupElementInteraction(yearElement, context.dayMasterElement);
      if (interactionResult.found && interactionResult.data) {
        result.annualInteractions = [interactionResult.data];
      }
    }
  }

  // Branch Relationships
  if (context.currentYearBranch) {
    const relationships: AnnualBranchRelationship[] = [];

    const branches = [
      context.yearBranch,
      context.monthBranch,
      context.dayBranch,
      context.hourBranch
    ].filter(Boolean) as string[];

    for (const natalBranch of branches) {
      const relationshipResult = lookupBranchRelationship(context.currentYearBranch, natalBranch);
      if (relationshipResult.found && relationshipResult.data) {
        relationships.push(relationshipResult.data);
      }
    }

    if (relationships.length > 0) {
      result.branchRelationships = relationships;
    }
  }

  return result;
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
 * Get all available library statistics
 */
export function getLibraryStats(): {
  tenGods: number;
  structures: number;
  usefulGods: number;
  shenSha: number;
  luckPillars: number;
  elementInteractions: number;
  branchRelationships: number;
  monthlyEmphases: number;
} {
  return {
    tenGods: TEN_GOD_LIBRARY.length,
    structures: STRUCTURE_LIBRARY.length,
    usefulGods: Object.keys(USEFUL_GOD_LIBRARY).length,
    shenSha: SHEN_SHA_LIBRARY.length,
    luckPillars: LUCK_PILLAR_LIBRARY.length,
    elementInteractions: ELEMENT_INTERACTION_LIBRARY.length,
    branchRelationships: BRANCH_RELATIONSHIP_LIBRARY.length,
    monthlyEmphases: MONTHLY_EMPHASIS_LIBRARY.length
  };
}

// ==================== EXPORTS ====================

export {
  // Ten God
  lookupTenGod,
  lookupTenGods,
  getTenGodDisplay,

  // Structure
  lookupStructure,
  getStructureDisplay,

  // Useful God
  lookupUsefulGod,
  getUsefulGodActivation,
  getUsefulGodEnhancements,
  getUsefulGodDisplay,

  // Shen Sha
  lookupShenSha,
  lookupShenShaList,
  getShenShaForPillar,
  getAuspiciousList,
  getInauspiciousList,

  // Luck Pillar
  lookupLuckPillar,
  lookupLuckPillarByZh,
  getLuckPillarDisplay,

  // Annual Forecast
  lookupElementInteraction,
  lookupBranchRelationship,
  getMonthEmphasisDisplay,
  getBranchClashes,
  getBranchCombinations,

  // Multi-Library
  lookupChartInterpretations,
  getLibraryStats
};
