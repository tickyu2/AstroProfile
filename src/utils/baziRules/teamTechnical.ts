/**
 * ============================================
 * TEAM TECHNICAL ENGINE
 * Aggregate Analysis for Groups/Teams
 *
 * Summarizes BaZi patterns across team members:
 * - Dominant team elements
 * - Common structures
 * - Shared Shen Sha stars
 * - Team strengths and gaps
 * ============================================
 */

import { ChartData, compareCharts } from './multiChartCompare';
import { ShenShaHit, detectShenSha, ChartInput } from './shenSha';
import { FollowStructureType } from './followStructure';

// ==================== TYPES ====================

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  chartData: ChartData;
}

export interface TeamElementProfile {
  element: string;
  totalPresence: number;
  memberBreakdown: Record<string, number>;
  status: 'dominant' | 'strong' | 'balanced' | 'weak' | 'deficient';
}

export interface TeamStructureProfile {
  structureType: string;
  count: number;
  members: string[];
  percentage: number;
}

export interface TeamShenShaProfile {
  starId: string;
  starName: string;
  starNameZh: string;
  count: number;
  members: string[];
  category: 'auspicious' | 'inauspicious' | 'neutral';
}

export interface TeamTechnicalSummary {
  teamId: string;
  teamName?: string;
  memberCount: number;
  members: TeamMember[];

  // Element analysis
  elementProfiles: TeamElementProfile[];
  dominantElements: string[];
  deficientElements: string[];
  elementBalance: number; // 0-100, 100 = perfectly balanced

  // Structure analysis
  structureProfiles: TeamStructureProfile[];
  dominantStructure?: string;
  structureDiversity: number; // 0-1

  // Shen Sha analysis
  shenShaProfiles: TeamShenShaProfile[];
  sharedAuspicious: string[];
  sharedInauspicious: string[];

  // Day Master analysis
  dayMasterDistribution: Record<string, string[]>;
  dayMasterHarmony: number;

  // Team dynamics
  overallCohesion: number; // 0-100
  strengths: string[];
  strengthsZh: string[];
  gaps: string[];
  gapsZh: string[];

  // Recommendations
  recommendations: string[];
  recommendationsZh: string[];
}

// ==================== CORE FUNCTIONS ====================

/**
 * Generate comprehensive team technical summary
 */
export function summarizeTeamTechnical(
  teamId: string,
  members: TeamMember[],
  teamName?: string
): TeamTechnicalSummary {
  if (members.length === 0) {
    throw new Error('Team must have at least one member');
  }

  // Element analysis
  const elementProfiles = analyzeTeamElements(members);
  const dominant = elementProfiles.filter(e => e.status === 'dominant' || e.status === 'strong').map(e => e.element);
  const deficient = elementProfiles.filter(e => e.status === 'deficient').map(e => e.element);
  const elementBalance = calculateElementBalance(elementProfiles);

  // Structure analysis
  const structureProfiles = analyzeTeamStructures(members);
  const dominantStructure = structureProfiles.length > 0 && structureProfiles[0].percentage > 40
    ? structureProfiles[0].structureType
    : undefined;
  const structureDiversity = calculateStructureDiversity(structureProfiles);

  // Shen Sha analysis
  const shenShaProfiles = analyzeTeamShenSha(members);
  const sharedAuspicious = shenShaProfiles
    .filter(s => s.category === 'auspicious' && s.count >= Math.ceil(members.length / 2))
    .map(s => s.starName);
  const sharedInauspicious = shenShaProfiles
    .filter(s => s.category === 'inauspicious' && s.count >= Math.ceil(members.length / 2))
    .map(s => s.starName);

  // Day Master analysis
  const dmDistribution = analyzeDayMasterDistribution(members);
  const dmHarmony = members.length > 1
    ? compareCharts(members.map(m => m.chartData)).dayMasterHarmony
    : 100;

  // Overall cohesion
  const overallCohesion = calculateTeamCohesion(
    elementBalance,
    dmHarmony,
    structureDiversity,
    members.length
  );

  // Strengths and gaps
  const { strengths, strengthsZh } = identifyTeamStrengths(
    dominant,
    sharedAuspicious,
    structureProfiles
  );
  const { gaps, gapsZh } = identifyTeamGaps(
    deficient,
    sharedInauspicious,
    elementProfiles
  );

  // Recommendations
  const { recommendations, recommendationsZh } = generateTeamRecommendations(
    dominant,
    deficient,
    dmHarmony,
    overallCohesion
  );

  return {
    teamId,
    teamName,
    memberCount: members.length,
    members,
    elementProfiles,
    dominantElements: dominant,
    deficientElements: deficient,
    elementBalance,
    structureProfiles,
    dominantStructure,
    structureDiversity,
    shenShaProfiles,
    sharedAuspicious,
    sharedInauspicious,
    dayMasterDistribution: dmDistribution,
    dayMasterHarmony: dmHarmony,
    overallCohesion,
    strengths,
    strengthsZh,
    gaps,
    gapsZh,
    recommendations,
    recommendationsZh
  };
}

// ==================== ANALYSIS FUNCTIONS ====================

function analyzeTeamElements(members: TeamMember[]): TeamElementProfile[] {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  return elements.map(element => {
    const memberBreakdown: Record<string, number> = {};
    let total = 0;

    members.forEach(member => {
      const value = member.chartData.elementBalance[element] ?? 20;
      memberBreakdown[member.id] = value;
      total += value;
    });

    const average = total / members.length;
    let status: TeamElementProfile['status'];

    if (average >= 30) status = 'dominant';
    else if (average >= 25) status = 'strong';
    else if (average >= 15) status = 'balanced';
    else if (average >= 10) status = 'weak';
    else status = 'deficient';

    return {
      element,
      totalPresence: total,
      memberBreakdown,
      status
    };
  });
}

function calculateElementBalance(profiles: TeamElementProfile[]): number {
  // Perfect balance = 20% each
  const ideal = 20;
  let deviation = 0;

  profiles.forEach(p => {
    const avg = p.totalPresence / Object.keys(p.memberBreakdown).length;
    deviation += Math.abs(avg - ideal);
  });

  // Convert to 0-100 scale where 100 is perfect balance
  const maxDeviation = 80; // Worst case
  return Math.round(100 - (deviation / maxDeviation) * 100);
}

function analyzeTeamStructures(members: TeamMember[]): TeamStructureProfile[] {
  const structureCounts: Record<string, string[]> = {};

  members.forEach(member => {
    const structure = member.chartData.structureType || 'Unknown';
    if (!structureCounts[structure]) structureCounts[structure] = [];
    structureCounts[structure].push(member.id);
  });

  return Object.entries(structureCounts)
    .map(([structure, memberIds]) => ({
      structureType: structure,
      count: memberIds.length,
      members: memberIds,
      percentage: (memberIds.length / members.length) * 100
    }))
    .sort((a, b) => b.count - a.count);
}

function calculateStructureDiversity(profiles: TeamStructureProfile[]): number {
  if (profiles.length <= 1) return 0;
  const totalMembers = profiles.reduce((sum, p) => sum + p.count, 0);
  return (profiles.length - 1) / (totalMembers - 1);
}

function analyzeTeamShenSha(members: TeamMember[]): TeamShenShaProfile[] {
  const shenShaCounts: Record<string, { hits: ShenShaHit[]; members: string[] }> = {};

  members.forEach(member => {
    const chartInput: ChartInput = {
      yearStem: member.chartData.yearStem,
      yearBranch: member.chartData.yearBranch,
      monthStem: member.chartData.monthStem,
      monthBranch: member.chartData.monthBranch,
      dayStem: member.chartData.dayStem,
      dayBranch: member.chartData.dayBranch,
      hourStem: member.chartData.hourStem,
      hourBranch: member.chartData.hourBranch
    };

    const analysis = detectShenSha(chartInput);

    analysis.hits.forEach(hit => {
      if (!shenShaCounts[hit.star.id]) {
        shenShaCounts[hit.star.id] = { hits: [], members: [] };
      }
      shenShaCounts[hit.star.id].hits.push(hit);
      if (!shenShaCounts[hit.star.id].members.includes(member.id)) {
        shenShaCounts[hit.star.id].members.push(member.id);
      }
    });
  });

  return Object.entries(shenShaCounts)
    .map(([starId, data]) => ({
      starId,
      starName: data.hits[0].star.name,
      starNameZh: data.hits[0].star.nameZh,
      count: data.members.length,
      members: data.members,
      category: data.hits[0].star.category
    }))
    .sort((a, b) => b.count - a.count);
}

function analyzeDayMasterDistribution(members: TeamMember[]): Record<string, string[]> {
  const distribution: Record<string, string[]> = {};

  members.forEach(member => {
    const element = member.chartData.dayMasterElement;
    if (!distribution[element]) distribution[element] = [];
    distribution[element].push(member.id);
  });

  return distribution;
}

function calculateTeamCohesion(
  elementBalance: number,
  dmHarmony: number,
  structureDiversity: number,
  memberCount: number
): number {
  // Weights
  const elementWeight = 0.3;
  const dmWeight = 0.4;
  const structureWeight = 0.2;
  const sizeWeight = 0.1;

  // Size factor - smaller teams tend to be more cohesive
  const sizeFactor = Math.max(0, 100 - (memberCount - 2) * 5);

  const cohesion =
    elementBalance * elementWeight +
    ((dmHarmony + 100) / 2) * dmWeight +
    (1 - structureDiversity) * 100 * structureWeight +
    sizeFactor * sizeWeight;

  return Math.round(cohesion);
}

function identifyTeamStrengths(
  dominantElements: string[],
  sharedAuspicious: string[],
  structureProfiles: TeamStructureProfile[]
): { strengths: string[]; strengthsZh: string[] } {
  const strengths: string[] = [];
  const strengthsZh: string[] = [];

  const elementStrengths: Record<string, { en: string; zh: string }> = {
    Wood: { en: 'Growth and innovation', zh: '成长和创新' },
    Fire: { en: 'Passion and visibility', zh: '热情和可见性' },
    Earth: { en: 'Stability and reliability', zh: '稳定和可靠' },
    Metal: { en: 'Precision and organization', zh: '精确和组织' },
    Water: { en: 'Wisdom and adaptability', zh: '智慧和适应性' }
  };

  dominantElements.forEach(el => {
    if (elementStrengths[el]) {
      strengths.push(elementStrengths[el].en);
      strengthsZh.push(elementStrengths[el].zh);
    }
  });

  if (sharedAuspicious.length > 0) {
    strengths.push(`Shared beneficial stars: ${sharedAuspicious.join(', ')}`);
    strengthsZh.push(`共享吉星：${sharedAuspicious.join('、')}`);
  }

  if (structureProfiles.length > 0 && structureProfiles[0].percentage >= 50) {
    strengths.push(`Unified ${structureProfiles[0].structureType} approach`);
    strengthsZh.push(`统一的${structureProfiles[0].structureType}方式`);
  }

  return { strengths, strengthsZh };
}

function identifyTeamGaps(
  deficientElements: string[],
  sharedInauspicious: string[],
  elementProfiles: TeamElementProfile[]
): { gaps: string[]; gapsZh: string[] } {
  const gaps: string[] = [];
  const gapsZh: string[] = [];

  const elementGaps: Record<string, { en: string; zh: string }> = {
    Wood: { en: 'May lack creativity and vision', zh: '可能缺乏创造力和远见' },
    Fire: { en: 'May lack enthusiasm and marketing', zh: '可能缺乏热情和营销' },
    Earth: { en: 'May lack follow-through and stability', zh: '可能缺乏执行力和稳定性' },
    Metal: { en: 'May lack structure and discipline', zh: '可能缺乏结构和纪律' },
    Water: { en: 'May lack strategy and flexibility', zh: '可能缺乏策略和灵活性' }
  };

  deficientElements.forEach(el => {
    if (elementGaps[el]) {
      gaps.push(elementGaps[el].en);
      gapsZh.push(elementGaps[el].zh);
    }
  });

  if (sharedInauspicious.length > 0) {
    gaps.push(`Watch for shared challenges: ${sharedInauspicious.join(', ')}`);
    gapsZh.push(`注意共同挑战：${sharedInauspicious.join('、')}`);
  }

  return { gaps, gapsZh };
}

function generateTeamRecommendations(
  dominant: string[],
  deficient: string[],
  dmHarmony: number,
  cohesion: number
): { recommendations: string[]; recommendationsZh: string[] } {
  const recommendations: string[] = [];
  const recommendationsZh: string[] = [];

  // Element recommendations
  if (deficient.length > 0) {
    recommendations.push(`Consider adding team members with ${deficient.join(' or ')} elements`);
    const defZh = deficient.map(d => {
      const map: Record<string, string> = { Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' };
      return map[d];
    });
    recommendationsZh.push(`考虑增加${defZh.join('或')}属性的团队成员`);
  }

  // Harmony recommendations
  if (dmHarmony < 50) {
    recommendations.push('Implement clear communication protocols to bridge differences');
    recommendationsZh.push('实施清晰的沟通协议以弥合差异');
  }

  // Cohesion recommendations
  if (cohesion < 60) {
    recommendations.push('Focus on team-building activities to improve cohesion');
    recommendationsZh.push('注重团队建设活动以提高凝聚力');
  } else if (cohesion >= 80) {
    recommendations.push('Leverage your strong natural alignment for collaborative projects');
    recommendationsZh.push('利用你们的自然协调优势进行协作项目');
  }

  return { recommendations, recommendationsZh };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Quick team compatibility check
 */
export function getTeamCompatibilityScore(members: TeamMember[]): number {
  if (members.length < 2) return 100;
  const summary = summarizeTeamTechnical('temp', members);
  return summary.overallCohesion;
}

/**
 * Find best role fit for each member
 */
export function suggestTeamRoles(members: TeamMember[]): Record<string, string> {
  const roles: Record<string, string> = {};

  const elementRoles: Record<string, string> = {
    Wood: 'Visionary/Innovator',
    Fire: 'Promoter/Motivator',
    Earth: 'Implementer/Manager',
    Metal: 'Analyst/Organizer',
    Water: 'Strategist/Advisor'
  };

  members.forEach(member => {
    const dominantElement = Object.entries(member.chartData.elementBalance)
      .sort(([, a], [, b]) => b - a)[0][0];
    roles[member.id] = elementRoles[dominantElement] || 'Generalist';
  });

  return roles;
}

// ==================== EXPORTS ====================

export {
  summarizeTeamTechnical,
  getTeamCompatibilityScore,
  suggestTeamRoles
};
