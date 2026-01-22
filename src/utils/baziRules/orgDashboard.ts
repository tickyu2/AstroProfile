/**
 * ============================================
 * ORGANIZATION DASHBOARD MODULE
 * Enterprise-Level BaZi Analytics
 *
 * Aggregates and analyzes BaZi data across:
 * - Multiple teams
 * - Departments
 * - Entire organizations
 * - Cross-team compatibility
 * ============================================
 */

import { TeamMember, TeamTechnicalSummary, summarizeTeamTechnical } from './teamTechnical';
import { ChartData, compareCharts, findMostCompatiblePair, findClashingCharts } from './multiChartCompare';

// ==================== TYPES ====================

export interface Department {
  id: string;
  name: string;
  nameZh?: string;
  teams: TeamTechnicalSummary[];
  leaderId?: string;
}

export interface OrgElementDistribution {
  element: string;
  totalCount: number;
  percentage: number;
  teamBreakdown: Record<string, number>;
  status: 'dominant' | 'strong' | 'balanced' | 'weak' | 'deficient';
}

export interface OrgStructureDistribution {
  structureType: string;
  count: number;
  percentage: number;
  teams: string[];
}

export interface CrossTeamCompatibility {
  team1Id: string;
  team2Id: string;
  team1Name: string;
  team2Name: string;
  compatibilityScore: number;
  sharedStrengths: string[];
  potentialConflicts: string[];
  collaborationAdvice: string;
  collaborationAdviceZh: string;
}

export interface OrgTalentGap {
  element: string;
  deficit: number;
  impact: string;
  impactZh: string;
  recommendation: string;
  recommendationZh: string;
}

export interface OrgDashboard {
  orgId: string;
  orgName?: string;
  generatedAt: Date;

  // Overview
  totalMembers: number;
  totalTeams: number;
  departments: Department[];

  // Element analysis
  elementDistribution: OrgElementDistribution[];
  dominantThemes: string[];
  dominantThemesZh: string[];

  // Structure analysis
  structureDistribution: OrgStructureDistribution[];

  // Cross-team dynamics
  crossTeamCompatibility: CrossTeamCompatibility[];
  mostCompatibleTeamPair?: { team1: string; team2: string; score: number };
  potentialConflictPairs: Array<{ team1: string; team2: string; reason: string }>;

  // Talent gaps
  talentGaps: OrgTalentGap[];

  // Insights
  orgStrengths: string[];
  orgStrengthsZh: string[];
  orgWeaknesses: string[];
  orgWeaknessesZh: string[];
  strategicRecommendations: string[];
  strategicRecommendationsZh: string[];

  // Health metrics
  overallCohesion: number;
  elementBalance: number;
  talentDiversity: number;
}

// ==================== CORE FUNCTIONS ====================

/**
 * Generate comprehensive organization dashboard
 */
export function generateOrgDashboard(
  orgId: string,
  teams: TeamTechnicalSummary[],
  orgName?: string
): OrgDashboard {
  if (teams.length === 0) {
    throw new Error('Organization must have at least one team');
  }

  const generatedAt = new Date();
  const totalMembers = teams.reduce((sum, t) => sum + t.memberCount, 0);

  // Group into departments (simplified - single department for now)
  const departments: Department[] = [{
    id: 'default',
    name: 'Main Department',
    nameZh: '主要部门',
    teams
  }];

  // Element distribution
  const elementDistribution = analyzeOrgElements(teams);
  const { dominantThemes, dominantThemesZh } = identifyDominantThemes(elementDistribution);

  // Structure distribution
  const structureDistribution = analyzeOrgStructures(teams);

  // Cross-team compatibility
  const crossTeamCompatibility = analyzeCrossTeamCompatibility(teams);
  const mostCompatibleTeamPair = findMostCompatibleTeamPair(crossTeamCompatibility);
  const potentialConflictPairs = findPotentialConflictPairs(crossTeamCompatibility);

  // Talent gaps
  const talentGaps = identifyTalentGaps(elementDistribution);

  // Org strengths and weaknesses
  const { strengths, strengthsZh, weaknesses, weaknessesZh } = analyzeOrgStrengthsWeaknesses(
    elementDistribution,
    structureDistribution,
    crossTeamCompatibility
  );

  // Strategic recommendations
  const { recommendations, recommendationsZh } = generateStrategicRecommendations(
    talentGaps,
    crossTeamCompatibility,
    elementDistribution
  );

  // Health metrics
  const overallCohesion = calculateOrgCohesion(teams, crossTeamCompatibility);
  const elementBalance = calculateElementBalance(elementDistribution);
  const talentDiversity = calculateTalentDiversity(structureDistribution, teams.length);

  return {
    orgId,
    orgName,
    generatedAt,
    totalMembers,
    totalTeams: teams.length,
    departments,
    elementDistribution,
    dominantThemes,
    dominantThemesZh,
    structureDistribution,
    crossTeamCompatibility,
    mostCompatibleTeamPair,
    potentialConflictPairs,
    talentGaps,
    orgStrengths: strengths,
    orgStrengthsZh: strengthsZh,
    orgWeaknesses: weaknesses,
    orgWeaknessesZh: weaknessesZh,
    strategicRecommendations: recommendations,
    strategicRecommendationsZh: recommendationsZh,
    overallCohesion,
    elementBalance,
    talentDiversity
  };
}

// ==================== ANALYSIS FUNCTIONS ====================

function analyzeOrgElements(teams: TeamTechnicalSummary[]): OrgElementDistribution[] {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const totalMembers = teams.reduce((sum, t) => sum + t.memberCount, 0);

  return elements.map(element => {
    const teamBreakdown: Record<string, number> = {};
    let totalCount = 0;

    teams.forEach(team => {
      const profile = team.elementProfiles.find(p => p.element === element);
      if (profile) {
        // Count members with this element as dominant
        const dominantCount = Object.values(profile.memberBreakdown)
          .filter(v => v >= 25).length;
        teamBreakdown[team.teamId] = dominantCount;
        totalCount += dominantCount;
      }
    });

    const percentage = totalMembers > 0 ? (totalCount / totalMembers) * 100 : 20;
    let status: OrgElementDistribution['status'];

    if (percentage >= 30) status = 'dominant';
    else if (percentage >= 25) status = 'strong';
    else if (percentage >= 15) status = 'balanced';
    else if (percentage >= 10) status = 'weak';
    else status = 'deficient';

    return {
      element,
      totalCount,
      percentage,
      teamBreakdown,
      status
    };
  });
}

function identifyDominantThemes(distribution: OrgElementDistribution[]): {
  dominantThemes: string[];
  dominantThemesZh: string[];
} {
  const themes: string[] = [];
  const themesZh: string[] = [];

  const themeMap: Record<string, { en: string; zh: string }> = {
    Wood: { en: 'Growth & Innovation', zh: '成长与创新' },
    Fire: { en: 'Passion & Marketing', zh: '热情与营销' },
    Earth: { en: 'Stability & Operations', zh: '稳定与运营' },
    Metal: { en: 'Structure & Quality', zh: '结构与质量' },
    Water: { en: 'Strategy & Adaptability', zh: '策略与适应' }
  };

  distribution
    .filter(d => d.status === 'dominant' || d.status === 'strong')
    .forEach(d => {
      if (themeMap[d.element]) {
        themes.push(themeMap[d.element].en);
        themesZh.push(themeMap[d.element].zh);
      }
    });

  return { dominantThemes: themes, dominantThemesZh: themesZh };
}

function analyzeOrgStructures(teams: TeamTechnicalSummary[]): OrgStructureDistribution[] {
  const structureCounts: Record<string, string[]> = {};

  teams.forEach(team => {
    team.structureProfiles.forEach(sp => {
      if (!structureCounts[sp.structureType]) {
        structureCounts[sp.structureType] = [];
      }
      if (!structureCounts[sp.structureType].includes(team.teamId)) {
        structureCounts[sp.structureType].push(team.teamId);
      }
    });
  });

  const totalTeams = teams.length;

  return Object.entries(structureCounts)
    .map(([structureType, teamIds]) => ({
      structureType,
      count: teamIds.length,
      percentage: (teamIds.length / totalTeams) * 100,
      teams: teamIds
    }))
    .sort((a, b) => b.count - a.count);
}

function analyzeCrossTeamCompatibility(teams: TeamTechnicalSummary[]): CrossTeamCompatibility[] {
  if (teams.length < 2) return [];

  const results: CrossTeamCompatibility[] = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const team1 = teams[i];
      const team2 = teams[j];

      const score = calculateTeamPairCompatibility(team1, team2);
      const sharedStrengths = findSharedStrengths(team1, team2);
      const potentialConflicts = findPotentialConflicts(team1, team2);
      const { advice, adviceZh } = generateCollaborationAdvice(score, sharedStrengths, potentialConflicts);

      results.push({
        team1Id: team1.teamId,
        team2Id: team2.teamId,
        team1Name: team1.teamName || team1.teamId,
        team2Name: team2.teamName || team2.teamId,
        compatibilityScore: score,
        sharedStrengths,
        potentialConflicts,
        collaborationAdvice: advice,
        collaborationAdviceZh: adviceZh
      });
    }
  }

  return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

function calculateTeamPairCompatibility(team1: TeamTechnicalSummary, team2: TeamTechnicalSummary): number {
  // Compare element profiles
  let elementScore = 0;
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  elements.forEach(element => {
    const t1 = team1.elementProfiles.find(p => p.element === element);
    const t2 = team2.elementProfiles.find(p => p.element === element);
    if (t1 && t2) {
      const diff = Math.abs(t1.totalPresence / team1.memberCount - t2.totalPresence / team2.memberCount);
      elementScore += (20 - Math.min(diff, 20));
    }
  });

  // Compare Day Master harmony
  const dmHarmonyAvg = (team1.dayMasterHarmony + team2.dayMasterHarmony) / 2;
  const dmScore = (dmHarmonyAvg + 100) / 4; // 0-50 range

  // Structure compatibility
  const structureScore = team1.dominantStructure === team2.dominantStructure ? 20 : 10;

  return Math.round((elementScore / 5) * 0.4 + dmScore * 0.4 + structureScore * 0.2);
}

function findSharedStrengths(team1: TeamTechnicalSummary, team2: TeamTechnicalSummary): string[] {
  const shared: string[] = [];

  // Common dominant elements
  const commonDominant = team1.dominantElements.filter(e => team2.dominantElements.includes(e));
  commonDominant.forEach(e => shared.push(`Strong ${e} energy`));

  // Common auspicious stars
  const commonAuspicious = team1.sharedAuspicious.filter(s => team2.sharedAuspicious.includes(s));
  if (commonAuspicious.length > 0) {
    shared.push(`Shared auspicious stars: ${commonAuspicious.join(', ')}`);
  }

  return shared;
}

function findPotentialConflicts(team1: TeamTechnicalSummary, team2: TeamTechnicalSummary): string[] {
  const conflicts: string[] = [];

  // Opposing dominant elements
  const controlMap: Record<string, string> = {
    Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire'
  };

  team1.dominantElements.forEach(e1 => {
    team2.dominantElements.forEach(e2 => {
      if (controlMap[e1] === e2) {
        conflicts.push(`${e1} (Team 1) controls ${e2} (Team 2)`);
      }
      if (controlMap[e2] === e1) {
        conflicts.push(`${e2} (Team 2) controls ${e1} (Team 1)`);
      }
    });
  });

  // Both teams lack the same element
  const commonDeficient = team1.deficientElements.filter(e => team2.deficientElements.includes(e));
  if (commonDeficient.length > 0) {
    conflicts.push(`Both teams lack ${commonDeficient.join(', ')}`);
  }

  return conflicts;
}

function generateCollaborationAdvice(
  score: number,
  sharedStrengths: string[],
  conflicts: string[]
): { advice: string; adviceZh: string } {
  if (score >= 70) {
    return {
      advice: 'Excellent collaboration potential. Leverage shared strengths for joint initiatives.',
      adviceZh: '协作潜力极佳。利用共同优势开展联合项目。'
    };
  }
  if (score >= 50) {
    return {
      advice: 'Good collaboration with some coordination needed. Assign clear roles to minimize overlap.',
      adviceZh: '良好的协作关系，需要一些协调。分配明确的角色以减少重叠。'
    };
  }
  return {
    advice: 'Collaboration may be challenging. Consider mediators or clear boundaries.',
    adviceZh: '协作可能具有挑战性。考虑使用协调人或明确界限。'
  };
}

function findMostCompatibleTeamPair(
  compatibility: CrossTeamCompatibility[]
): { team1: string; team2: string; score: number } | undefined {
  if (compatibility.length === 0) return undefined;
  const best = compatibility[0];
  return { team1: best.team1Id, team2: best.team2Id, score: best.compatibilityScore };
}

function findPotentialConflictPairs(
  compatibility: CrossTeamCompatibility[]
): Array<{ team1: string; team2: string; reason: string }> {
  return compatibility
    .filter(c => c.compatibilityScore < 40)
    .map(c => ({
      team1: c.team1Id,
      team2: c.team2Id,
      reason: c.potentialConflicts.join('; ') || 'Low overall compatibility'
    }));
}

function identifyTalentGaps(distribution: OrgElementDistribution[]): OrgTalentGap[] {
  const gaps: OrgTalentGap[] = [];

  const impactMap: Record<string, { en: string; zh: string; rec: string; recZh: string }> = {
    Wood: {
      en: 'May lack innovation and growth mindset',
      zh: '可能缺乏创新和成长思维',
      rec: 'Recruit creative thinkers and visionaries',
      recZh: '招聘有创意的思考者和远见者'
    },
    Fire: {
      en: 'May lack marketing power and enthusiasm',
      zh: '可能缺乏营销能力和热情',
      rec: 'Recruit energetic communicators and promoters',
      recZh: '招聘有活力的沟通者和推广者'
    },
    Earth: {
      en: 'May lack operational stability',
      zh: '可能缺乏运营稳定性',
      rec: 'Recruit reliable managers and implementers',
      recZh: '招聘可靠的管理者和执行者'
    },
    Metal: {
      en: 'May lack structure and quality control',
      zh: '可能缺乏结构和质量控制',
      rec: 'Recruit detail-oriented analysts and organizers',
      recZh: '招聘注重细节的分析师和组织者'
    },
    Water: {
      en: 'May lack strategic thinking and adaptability',
      zh: '可能缺乏战略思维和适应能力',
      rec: 'Recruit strategic advisors and flexible thinkers',
      recZh: '招聘战略顾问和灵活的思考者'
    }
  };

  distribution
    .filter(d => d.status === 'deficient' || d.status === 'weak')
    .forEach(d => {
      const impact = impactMap[d.element];
      if (impact) {
        gaps.push({
          element: d.element,
          deficit: 20 - d.percentage,
          impact: impact.en,
          impactZh: impact.zh,
          recommendation: impact.rec,
          recommendationZh: impact.recZh
        });
      }
    });

  return gaps.sort((a, b) => b.deficit - a.deficit);
}

function analyzeOrgStrengthsWeaknesses(
  elementDist: OrgElementDistribution[],
  structureDist: OrgStructureDistribution[],
  compatibility: CrossTeamCompatibility[]
): {
  strengths: string[];
  strengthsZh: string[];
  weaknesses: string[];
  weaknessesZh: string[];
} {
  const strengths: string[] = [];
  const strengthsZh: string[] = [];
  const weaknesses: string[] = [];
  const weaknessesZh: string[] = [];

  // Element-based
  const dominant = elementDist.filter(d => d.status === 'dominant');
  const deficient = elementDist.filter(d => d.status === 'deficient');

  if (dominant.length > 0) {
    strengths.push(`Strong ${dominant.map(d => d.element).join(', ')} presence`);
    strengthsZh.push(`${dominant.map(d => getElementZh(d.element)).join('、')}五行强势`);
  }

  if (deficient.length > 0) {
    weaknesses.push(`Lacking ${deficient.map(d => d.element).join(', ')} energy`);
    weaknessesZh.push(`缺乏${deficient.map(d => getElementZh(d.element)).join('、')}能量`);
  }

  // Structure-based
  if (structureDist.length > 0 && structureDist[0].percentage >= 50) {
    strengths.push(`Unified approach: ${structureDist[0].structureType}`);
    strengthsZh.push(`统一方式：${structureDist[0].structureType}`);
  }

  // Compatibility-based
  const avgCompatibility = compatibility.length > 0
    ? compatibility.reduce((sum, c) => sum + c.compatibilityScore, 0) / compatibility.length
    : 0;

  if (avgCompatibility >= 60) {
    strengths.push('High cross-team collaboration potential');
    strengthsZh.push('跨团队协作潜力高');
  } else if (avgCompatibility < 40) {
    weaknesses.push('Cross-team collaboration may be challenging');
    weaknessesZh.push('跨团队协作可能有挑战');
  }

  return { strengths, strengthsZh, weaknesses, weaknessesZh };
}

function generateStrategicRecommendations(
  gaps: OrgTalentGap[],
  compatibility: CrossTeamCompatibility[],
  elementDist: OrgElementDistribution[]
): { recommendations: string[]; recommendationsZh: string[] } {
  const recommendations: string[] = [];
  const recommendationsZh: string[] = [];

  // Gap-based recommendations
  if (gaps.length > 0) {
    const topGap = gaps[0];
    recommendations.push(topGap.recommendation);
    recommendationsZh.push(topGap.recommendationZh);
  }

  // Compatibility-based recommendations
  const lowCompatibility = compatibility.filter(c => c.compatibilityScore < 40);
  if (lowCompatibility.length > 0) {
    recommendations.push('Implement cross-team communication protocols for challenging team pairings');
    recommendationsZh.push('为协作困难的团队组合实施跨团队沟通协议');
  }

  const highCompatibility = compatibility.filter(c => c.compatibilityScore >= 70);
  if (highCompatibility.length > 0) {
    recommendations.push('Leverage high-compatibility teams for collaborative projects');
    recommendationsZh.push('利用高兼容性团队进行协作项目');
  }

  // Balance recommendations
  const balanced = elementDist.filter(d => d.status === 'balanced').length;
  if (balanced >= 4) {
    recommendations.push('Maintain element diversity in future hiring');
    recommendationsZh.push('在未来招聘中保持五行多样性');
  }

  return { recommendations, recommendationsZh };
}

function calculateOrgCohesion(teams: TeamTechnicalSummary[], compatibility: CrossTeamCompatibility[]): number {
  // Team-level cohesion average
  const teamCohesion = teams.reduce((sum, t) => sum + t.overallCohesion, 0) / teams.length;

  // Cross-team compatibility average
  const crossTeamAvg = compatibility.length > 0
    ? compatibility.reduce((sum, c) => sum + c.compatibilityScore, 0) / compatibility.length
    : 50;

  return Math.round(teamCohesion * 0.6 + crossTeamAvg * 0.4);
}

function calculateElementBalance(distribution: OrgElementDistribution[]): number {
  const ideal = 20;
  let deviation = 0;

  distribution.forEach(d => {
    deviation += Math.abs(d.percentage - ideal);
  });

  const maxDeviation = 80;
  return Math.round(100 - (deviation / maxDeviation) * 100);
}

function calculateTalentDiversity(structureDist: OrgStructureDistribution[], teamCount: number): number {
  if (structureDist.length <= 1) return 0;
  return Math.round((structureDist.length / Math.max(teamCount, 1)) * 100);
}

function getElementZh(element: string): string {
  const map: Record<string, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };
  return map[element] || element;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get quick org health score
 */
export function getOrgHealthScore(dashboard: OrgDashboard): {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs-attention';
} {
  const score = Math.round(
    dashboard.overallCohesion * 0.4 +
    dashboard.elementBalance * 0.3 +
    dashboard.talentDiversity * 0.3
  );

  let rating: 'excellent' | 'good' | 'fair' | 'needs-attention';
  if (score >= 80) rating = 'excellent';
  else if (score >= 60) rating = 'good';
  else if (score >= 40) rating = 'fair';
  else rating = 'needs-attention';

  return { score, rating };
}

/**
 * Compare two organizations
 */
export function compareOrganizations(
  org1: OrgDashboard,
  org2: OrgDashboard
): {
  comparison: Record<string, { org1: number; org2: number }>;
  verdict: string;
  verdictZh: string;
} {
  const comparison = {
    cohesion: { org1: org1.overallCohesion, org2: org2.overallCohesion },
    elementBalance: { org1: org1.elementBalance, org2: org2.elementBalance },
    talentDiversity: { org1: org1.talentDiversity, org2: org2.talentDiversity }
  };

  const score1 = (org1.overallCohesion + org1.elementBalance + org1.talentDiversity) / 3;
  const score2 = (org2.overallCohesion + org2.elementBalance + org2.talentDiversity) / 3;

  let verdict: string;
  let verdictZh: string;

  if (Math.abs(score1 - score2) < 5) {
    verdict = 'Both organizations have similar overall health';
    verdictZh = '两个组织的整体健康状况相似';
  } else if (score1 > score2) {
    verdict = `${org1.orgName || 'Organization 1'} has stronger overall metrics`;
    verdictZh = `${org1.orgName || '组织1'}的整体指标更强`;
  } else {
    verdict = `${org2.orgName || 'Organization 2'} has stronger overall metrics`;
    verdictZh = `${org2.orgName || '组织2'}的整体指标更强`;
  }

  return { comparison, verdict, verdictZh };
}

/**
 * Generate executive summary
 */
export function generateExecutiveSummary(dashboard: OrgDashboard): {
  summary: string;
  summaryZh: string;
} {
  const health = getOrgHealthScore(dashboard);

  let summary = `Organization "${dashboard.orgName || dashboard.orgId}" has ${dashboard.totalMembers} members across ${dashboard.totalTeams} teams. `;
  let summaryZh = `组织"${dashboard.orgName || dashboard.orgId}"共有${dashboard.totalMembers}名成员，分布在${dashboard.totalTeams}个团队中。`;

  summary += `Overall health rating: ${health.rating} (${health.score}/100). `;
  summaryZh += `整体健康评级：${health.rating}（${health.score}/100）。`;

  if (dashboard.dominantThemes.length > 0) {
    summary += `Key organizational themes: ${dashboard.dominantThemes.join(', ')}. `;
    summaryZh += `主要组织主题：${dashboard.dominantThemesZh.join('、')}。`;
  }

  if (dashboard.talentGaps.length > 0) {
    summary += `Primary talent gap: ${dashboard.talentGaps[0].element}. `;
    summaryZh += `主要人才缺口：${getElementZh(dashboard.talentGaps[0].element)}。`;
  }

  return { summary, summaryZh };
}

// ==================== EXPORTS ====================

export {
  generateOrgDashboard,
  getOrgHealthScore,
  compareOrganizations,
  generateExecutiveSummary
};
