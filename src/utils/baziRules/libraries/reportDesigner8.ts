/**
 * ============================================
 * PRO REPORT DESIGNER 8.0
 * Organizational Intelligence Platform
 *
 * Features:
 * - AI-driven organizational insights
 * - Cross-team analytics
 * - Predictive metaphysics dashboards
 * - Team-to-team compatibility matrices
 * - Risk & opportunity heatmaps
 * - Leadership constellation analysis
 * ============================================
 */

// ==================== TYPES ====================

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type InsightSeverity = 'low' | 'medium' | 'high' | 'critical';
export type InsightCategory = 'conflict' | 'opportunity' | 'transition' | 'alignment' | 'imbalance' | 'timing';

export interface OrgChart {
  id: string;
  name: string;
  nameZh: string;
  dayMaster: Element;
  structure: string;
  usefulGod: Element;
  annoyingGod: Element;
  tenGods: string[];
  shenSha: string[];
  currentLuckPillar: {
    stem: string;
    branch: string;
    startAge: number;
    endAge: number;
  };
  teamId: string;
  role: string;
  isLeadership: boolean;
}

export interface TeamCharts {
  teamId: string;
  teamName: string;
  teamNameZh: string;
  charts: OrgChart[];
  dominantElement: Element;
  elementDistribution: Record<Element, number>;
}

export interface OrgInsight {
  id: string;
  category: InsightCategory;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  severity: InsightSeverity;
  isOpportunity: boolean;
  affectedTeams: string[];
  affectedIndividuals: string[];
  rationale: string[];
  rationaleZh: string[];
  recommendations: string[];
  recommendationsZh: string[];
  timingWindow?: { start: Date; end: Date };
  confidence: number;
  createdAt: Date;
}

export interface CrossTeamAnalysis {
  teamAId: string;
  teamAName: string;
  teamBId: string;
  teamBName: string;
  compatibilityScore: number;
  sharedPatterns: string[];
  sharedPatternsZh: string[];
  conflictPatterns: string[];
  conflictPatternsZh: string[];
  timingOverlaps: string[];
  timingOverlapsZh: string[];
  archetypeBridges: string[];
  archetypeBridgesZh: string[];
  recommendations: string[];
  recommendationsZh: string[];
}

export interface DashboardWidget {
  id: string;
  label: string;
  labelZh: string;
  type: 'chart' | 'heatmap' | 'timeline' | 'network' | 'radar' | 'matrix' | 'gauge';
  data: unknown;
  insights: string[];
  insightsZh: string[];
  config: Record<string, unknown>;
}

export interface PredictiveDashboard {
  id: string;
  name: string;
  nameZh: string;
  organizationId: string;
  widgets: DashboardWidget[];
  lastUpdated: Date;
  refreshInterval: number;
}

// ==================== ELEMENT ANALYSIS ====================

const ELEMENT_RELATIONSHIPS: Record<Element, { produces: Element; controls: Element; controlledBy: Element }> = {
  Wood: { produces: 'Fire', controls: 'Earth', controlledBy: 'Metal' },
  Fire: { produces: 'Earth', controls: 'Metal', controlledBy: 'Water' },
  Earth: { produces: 'Metal', controls: 'Water', controlledBy: 'Wood' },
  Metal: { produces: 'Water', controls: 'Wood', controlledBy: 'Fire' },
  Water: { produces: 'Wood', controls: 'Fire', controlledBy: 'Earth' }
};

/**
 * Find teams dominated by a specific element
 */
export function findTeamsDominatedBy(element: Element, teamCharts: TeamCharts[]): string[] {
  return teamCharts
    .filter(tc => tc.dominantElement === element)
    .map(tc => tc.teamId);
}

/**
 * Calculate element distribution for a team
 */
export function calculateElementDistribution(charts: OrgChart[]): Record<Element, number> {
  const distribution: Record<Element, number> = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0
  };

  for (const chart of charts) {
    distribution[chart.dayMaster] += 1;
    distribution[chart.usefulGod] += 0.5;
  }

  // Normalize
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (const elem of Object.keys(distribution) as Element[]) {
      distribution[elem] = distribution[elem] / total;
    }
  }

  return distribution;
}

/**
 * Find dominant element for a team
 */
export function findDominantElement(distribution: Record<Element, number>): Element {
  let max = 0;
  let dominant: Element = 'Wood';

  for (const [elem, value] of Object.entries(distribution)) {
    if (value > max) {
      max = value;
      dominant = elem as Element;
    }
  }

  return dominant;
}

// ==================== ORGANIZATIONAL INSIGHTS ENGINE ====================

/**
 * Generate organizational insights from all charts
 */
export function generateOrgInsights(teamCharts: TeamCharts[]): OrgInsight[] {
  const insights: OrgInsight[] = [];

  // 1. Detect elemental conflict clusters
  insights.push(...detectElementalConflicts(teamCharts));

  // 2. Detect timing pressure arcs
  insights.push(...detectTimingPressure(teamCharts));

  // 3. Detect opportunity windows
  insights.push(...detectOpportunityWindows(teamCharts));

  // 4. Detect leadership constellation patterns
  insights.push(...detectLeadershipPatterns(teamCharts));

  // 5. Detect Shen Sha activations
  insights.push(...detectShenShaActivations(teamCharts));

  // 6. Detect structure imbalances
  insights.push(...detectStructureImbalances(teamCharts));

  return insights;
}

/**
 * Detect elemental conflict clusters
 */
function detectElementalConflicts(teamCharts: TeamCharts[]): OrgInsight[] {
  const insights: OrgInsight[] = [];

  // Find Fire-Metal conflicts (Fire controls Metal)
  const fireTeams = findTeamsDominatedBy('Fire', teamCharts);
  const metalTeams = findTeamsDominatedBy('Metal', teamCharts);

  if (fireTeams.length > 0 && metalTeams.length > 0) {
    insights.push({
      id: `insight_${Date.now()}_fire_metal`,
      category: 'conflict',
      label: 'Fire-Metal Conflict Pattern',
      labelZh: '火金冲突模式',
      description: 'Teams with Fire dominance may create friction with Metal-dominant teams. Fire controls Metal, which can manifest as competitive tension.',
      descriptionZh: '火主导的团队可能与金主导的团队产生摩擦。火克金，可能表现为竞争性紧张。',
      severity: 'medium',
      isOpportunity: false,
      affectedTeams: [...fireTeams, ...metalTeams],
      affectedIndividuals: [],
      rationale: ['Elemental control cycle detected', 'Cross-department interaction zones identified'],
      rationaleZh: ['检测到元素克制循环', '识别到跨部门互动区域'],
      recommendations: [
        'Schedule joint projects during Water-supportive months',
        'Use Earth-dominant individuals as bridges',
        'Create buffer zones in collaborative spaces'
      ],
      recommendationsZh: [
        '在水旺的月份安排联合项目',
        '使用土主导的个人作为桥梁',
        '在协作空间中创建缓冲区'
      ],
      confidence: 0.75,
      createdAt: new Date()
    });
  }

  // Find Wood-Earth conflicts (Wood controls Earth)
  const woodTeams = findTeamsDominatedBy('Wood', teamCharts);
  const earthTeams = findTeamsDominatedBy('Earth', teamCharts);

  if (woodTeams.length > 0 && earthTeams.length > 0) {
    insights.push({
      id: `insight_${Date.now()}_wood_earth`,
      category: 'conflict',
      label: 'Wood-Earth Tension Pattern',
      labelZh: '木土紧张模式',
      description: 'Innovation-focused Wood teams may overwhelm stability-oriented Earth teams. Balance growth with consolidation.',
      descriptionZh: '创新型木团队可能会压倒稳定型土团队。需要平衡增长与巩固。',
      severity: 'low',
      isOpportunity: false,
      affectedTeams: [...woodTeams, ...earthTeams],
      affectedIndividuals: [],
      rationale: ['Growth vs stability dynamic detected'],
      rationaleZh: ['检测到增长与稳定的动态'],
      recommendations: [
        'Pair Wood leaders with Earth advisors',
        'Create phased implementation plans'
      ],
      recommendationsZh: [
        '将木型领导与土型顾问配对',
        '创建分阶段实施计划'
      ],
      confidence: 0.7,
      createdAt: new Date()
    });
  }

  return insights;
}

/**
 * Detect timing pressure arcs
 */
function detectTimingPressure(teamCharts: TeamCharts[]): OrgInsight[] {
  const insights: OrgInsight[] = [];

  // Find charts in Seven Killings luck pillars
  const sevenKillingsCharts: OrgChart[] = [];
  const affectedTeams = new Set<string>();

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      if (chart.tenGods.includes('7K')) {
        sevenKillingsCharts.push(chart);
        affectedTeams.add(tc.teamId);
      }
    }
  }

  if (sevenKillingsCharts.length >= 3) {
    insights.push({
      id: `insight_${Date.now()}_7k_pressure`,
      category: 'timing',
      label: 'Seven Killings Pressure Arc',
      labelZh: '七杀压力周期',
      description: `${sevenKillingsCharts.length} individuals across the organization are experiencing Seven Killings energy. This indicates a period of intense pressure and potential conflict.`,
      descriptionZh: `组织中有${sevenKillingsCharts.length}人正在经历七杀能量。这表明处于高压和潜在冲突时期。`,
      severity: 'high',
      isOpportunity: false,
      affectedTeams: Array.from(affectedTeams),
      affectedIndividuals: sevenKillingsCharts.map(c => c.id),
      rationale: ['Multiple Seven Killings activations detected', 'Conflict risk elevated'],
      rationaleZh: ['检测到多个七杀激活', '冲突风险升高'],
      recommendations: [
        'Increase support resources for affected individuals',
        'Delay major confrontational decisions',
        'Implement stress management programs'
      ],
      recommendationsZh: [
        '增加对受影响个人的支持资源',
        '推迟重大对抗性决策',
        '实施压力管理计划'
      ],
      confidence: 0.85,
      createdAt: new Date()
    });
  }

  return insights;
}

/**
 * Detect opportunity windows
 */
function detectOpportunityWindows(teamCharts: TeamCharts[]): OrgInsight[] {
  const insights: OrgInsight[] = [];

  // Find charts with Nobleman stars
  const noblemanCharts: OrgChart[] = [];
  const affectedTeams = new Set<string>();

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      if (chart.shenSha.includes('nobleman') || chart.shenSha.includes('heavenly_virtue')) {
        noblemanCharts.push(chart);
        affectedTeams.add(tc.teamId);
      }
    }
  }

  if (noblemanCharts.length >= 2) {
    insights.push({
      id: `insight_${Date.now()}_nobleman`,
      category: 'opportunity',
      label: 'Nobleman Activation Window',
      labelZh: '贵人激活窗口',
      description: `${noblemanCharts.length} individuals have active Nobleman stars. This is an excellent time for networking, partnerships, and seeking mentorship.`,
      descriptionZh: `有${noblemanCharts.length}人的贵人星被激活。这是建立人脉、合作和寻求导师的绝佳时机。`,
      severity: 'medium',
      isOpportunity: true,
      affectedTeams: Array.from(affectedTeams),
      affectedIndividuals: noblemanCharts.map(c => c.id),
      rationale: ['Nobleman stars indicate benefactor energy', 'Networking potential elevated'],
      rationaleZh: ['贵人星表示有贵人能量', '人脉潜力提升'],
      recommendations: [
        'Schedule external partnership meetings',
        'Assign affected individuals to client-facing roles',
        'Leverage connections for business development'
      ],
      recommendationsZh: [
        '安排外部合作会议',
        '将受影响的个人分配到面向客户的角色',
        '利用人脉进行业务发展'
      ],
      confidence: 0.8,
      createdAt: new Date()
    });
  }

  // Find Peach Blossom activations (PR/marketing opportunity)
  const peachBlossomCharts: OrgChart[] = [];
  affectedTeams.clear();

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      if (chart.shenSha.includes('peach_blossom')) {
        peachBlossomCharts.push(chart);
        affectedTeams.add(tc.teamId);
      }
    }
  }

  if (peachBlossomCharts.length >= 3) {
    insights.push({
      id: `insight_${Date.now()}_peach_blossom`,
      category: 'opportunity',
      label: 'Peach Blossom PR Window',
      labelZh: '桃花公关窗口',
      description: 'Multiple Peach Blossom activations indicate heightened charisma and public appeal. Ideal for marketing initiatives.',
      descriptionZh: '多个桃花激活表示魅力和公众吸引力提升。适合市场营销活动。',
      severity: 'low',
      isOpportunity: true,
      affectedTeams: Array.from(affectedTeams),
      affectedIndividuals: peachBlossomCharts.map(c => c.id),
      rationale: ['Peach Blossom indicates social magnetism'],
      rationaleZh: ['桃花表示社交吸引力'],
      recommendations: [
        'Launch public-facing campaigns',
        'Schedule media appearances',
        'Host networking events'
      ],
      recommendationsZh: [
        '推出面向公众的活动',
        '安排媒体露面',
        '举办社交活动'
      ],
      confidence: 0.7,
      createdAt: new Date()
    });
  }

  return insights;
}

/**
 * Detect leadership constellation patterns
 */
function detectLeadershipPatterns(teamCharts: TeamCharts[]): OrgInsight[] {
  const insights: OrgInsight[] = [];

  // Get all leadership charts
  const leadershipCharts: OrgChart[] = [];

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      if (chart.isLeadership) {
        leadershipCharts.push(chart);
      }
    }
  }

  if (leadershipCharts.length < 2) return insights;

  // Analyze leadership element distribution
  const leadershipDist = calculateElementDistribution(leadershipCharts);
  const dominant = findDominantElement(leadershipDist);

  // Check for imbalance
  const maxValue = Math.max(...Object.values(leadershipDist));
  const minValue = Math.min(...Object.values(leadershipDist));

  if (maxValue - minValue > 0.4) {
    insights.push({
      id: `insight_${Date.now()}_leadership_imbalance`,
      category: 'imbalance',
      label: 'Leadership Elemental Imbalance',
      labelZh: '领导层元素失衡',
      description: `Leadership is heavily skewed towards ${dominant}. This may create blind spots in ${ELEMENT_RELATIONSHIPS[dominant].controls} areas.`,
      descriptionZh: `领导层过度偏向${dominant}。这可能在${ELEMENT_RELATIONSHIPS[dominant].controls}相关领域产生盲点。`,
      severity: 'medium',
      isOpportunity: false,
      affectedTeams: [],
      affectedIndividuals: leadershipCharts.map(c => c.id),
      rationale: ['Leadership element distribution skewed', 'Potential blind spots identified'],
      rationaleZh: ['领导层元素分布倾斜', '识别到潜在盲点'],
      recommendations: [
        `Add advisors with ${ELEMENT_RELATIONSHIPS[dominant].controls} dominance`,
        'Create diverse decision-making panels',
        'Seek external perspectives in key decisions'
      ],
      recommendationsZh: [
        `添加${ELEMENT_RELATIONSHIPS[dominant].controls}主导的顾问`,
        '创建多元化的决策小组',
        '在关键决策中寻求外部观点'
      ],
      confidence: 0.75,
      createdAt: new Date()
    });
  }

  return insights;
}

/**
 * Detect Shen Sha activations across organization
 */
function detectShenShaActivations(teamCharts: TeamCharts[]): OrgInsight[] {
  const insights: OrgInsight[] = [];

  // Count challenging Shen Sha
  const challengingShenSha = ['blade', 'robbing_sha', 'disaster_sha', 'death_god'];
  let challengingCount = 0;
  const affectedTeams = new Set<string>();
  const affectedIndividuals: string[] = [];

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      const hasChallenging = chart.shenSha.some(s => challengingShenSha.includes(s));
      if (hasChallenging) {
        challengingCount++;
        affectedTeams.add(tc.teamId);
        affectedIndividuals.push(chart.id);
      }
    }
  }

  if (challengingCount >= 5) {
    insights.push({
      id: `insight_${Date.now()}_challenging_sha`,
      category: 'conflict',
      label: 'Challenging Star Cluster',
      labelZh: '凶星聚集',
      description: `${challengingCount} individuals have challenging Shen Sha active. Exercise caution in high-stakes decisions.`,
      descriptionZh: `有${challengingCount}人的凶星被激活。在高风险决策中需谨慎。`,
      severity: 'high',
      isOpportunity: false,
      affectedTeams: Array.from(affectedTeams),
      affectedIndividuals,
      rationale: ['Multiple challenging stars detected', 'Risk awareness needed'],
      rationaleZh: ['检测到多个凶星', '需要风险意识'],
      recommendations: [
        'Implement additional review processes',
        'Avoid irreversible decisions during peak periods',
        'Increase support structures'
      ],
      recommendationsZh: [
        '实施额外的审查流程',
        '避免在高峰期做出不可逆的决定',
        '增加支持结构'
      ],
      confidence: 0.8,
      createdAt: new Date()
    });
  }

  return insights;
}

/**
 * Detect structure type imbalances
 */
function detectStructureImbalances(teamCharts: TeamCharts[]): OrgInsight[] {
  const insights: OrgInsight[] = [];

  // Count structure types
  const structureCounts: Record<string, number> = {};

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      const structure = chart.structure;
      structureCounts[structure] = (structureCounts[structure] || 0) + 1;
    }
  }

  // Find dominant structure
  let maxStructure = '';
  let maxCount = 0;
  let total = 0;

  for (const [structure, count] of Object.entries(structureCounts)) {
    total += count;
    if (count > maxCount) {
      maxCount = count;
      maxStructure = structure;
    }
  }

  // If more than 40% have the same structure
  if (maxCount / total > 0.4) {
    insights.push({
      id: `insight_${Date.now()}_structure_homogeneity`,
      category: 'imbalance',
      label: 'Structure Type Homogeneity',
      labelZh: '格局类型同质化',
      description: `Over ${Math.round(maxCount / total * 100)}% of the organization shares the ${maxStructure} structure. This may limit perspective diversity.`,
      descriptionZh: `组织中超过${Math.round(maxCount / total * 100)}%的人拥有${maxStructure}格局。这可能限制视角多样性。`,
      severity: 'low',
      isOpportunity: false,
      affectedTeams: [],
      affectedIndividuals: [],
      rationale: ['High structure homogeneity detected', 'Diversity opportunity identified'],
      rationaleZh: ['检测到高度格局同质化', '识别到多样性机会'],
      recommendations: [
        'Consider complementary structure types in hiring',
        'Create cross-functional teams',
        'Seek external consultants with different perspectives'
      ],
      recommendationsZh: [
        '在招聘中考虑互补的格局类型',
        '创建跨职能团队',
        '寻求具有不同视角的外部顾问'
      ],
      confidence: 0.7,
      createdAt: new Date()
    });
  }

  return insights;
}

// ==================== CROSS-TEAM ANALYTICS ====================

/**
 * Analyze compatibility between teams
 */
export function analyzeCrossTeams(teamCharts: TeamCharts[]): CrossTeamAnalysis[] {
  const results: CrossTeamAnalysis[] = [];

  for (let i = 0; i < teamCharts.length; i++) {
    for (let j = i + 1; j < teamCharts.length; j++) {
      results.push(compareTeams(teamCharts[i], teamCharts[j]));
    }
  }

  return results;
}

/**
 * Compare two teams
 */
export function compareTeams(teamA: TeamCharts, teamB: TeamCharts): CrossTeamAnalysis {
  const elemA = teamA.dominantElement;
  const elemB = teamB.dominantElement;

  // Calculate compatibility score
  let compatibilityScore = 0.5;

  // Same element = neutral
  if (elemA === elemB) {
    compatibilityScore = 0.7;
  }
  // Productive cycle = good
  else if (ELEMENT_RELATIONSHIPS[elemA].produces === elemB) {
    compatibilityScore = 0.85;
  }
  else if (ELEMENT_RELATIONSHIPS[elemB].produces === elemA) {
    compatibilityScore = 0.8;
  }
  // Control cycle = challenging
  else if (ELEMENT_RELATIONSHIPS[elemA].controls === elemB) {
    compatibilityScore = 0.4;
  }
  else if (ELEMENT_RELATIONSHIPS[elemB].controls === elemA) {
    compatibilityScore = 0.35;
  }

  // Find shared patterns
  const sharedPatterns: string[] = [];
  const sharedPatternsZh: string[] = [];

  // Shared Shen Sha
  const shenShaA = new Set(teamA.charts.flatMap(c => c.shenSha));
  const shenShaB = new Set(teamB.charts.flatMap(c => c.shenSha));
  const sharedShenSha = [...shenShaA].filter(s => shenShaB.has(s));

  if (sharedShenSha.length > 0) {
    sharedPatterns.push(`Shared Shen Sha: ${sharedShenSha.join(', ')}`);
    sharedPatternsZh.push(`共享神煞: ${sharedShenSha.join(', ')}`);
  }

  // Shared Ten Gods
  const tenGodsA = new Set(teamA.charts.flatMap(c => c.tenGods));
  const tenGodsB = new Set(teamB.charts.flatMap(c => c.tenGods));
  const sharedTenGods = [...tenGodsA].filter(t => tenGodsB.has(t));

  if (sharedTenGods.length > 0) {
    sharedPatterns.push(`Shared Ten Gods: ${sharedTenGods.join(', ')}`);
    sharedPatternsZh.push(`共享十神: ${sharedTenGods.join(', ')}`);
  }

  // Find conflict patterns
  const conflictPatterns: string[] = [];
  const conflictPatternsZh: string[] = [];

  if (ELEMENT_RELATIONSHIPS[elemA].controls === elemB) {
    conflictPatterns.push(`${elemA} controls ${elemB} - potential dominance dynamic`);
    conflictPatternsZh.push(`${elemA}克${elemB} - 潜在的支配动态`);
  }

  if (ELEMENT_RELATIONSHIPS[elemB].controls === elemA) {
    conflictPatterns.push(`${elemB} controls ${elemA} - potential resistance dynamic`);
    conflictPatternsZh.push(`${elemB}克${elemA} - 潜在的抵抗动态`);
  }

  // Timing overlaps
  const timingOverlaps: string[] = [];
  const timingOverlapsZh: string[] = [];

  // Check for similar luck pillar timing
  const luckPillarsA = teamA.charts.map(c => c.currentLuckPillar.branch);
  const luckPillarsB = teamB.charts.map(c => c.currentLuckPillar.branch);
  const sharedBranches = luckPillarsA.filter(b => luckPillarsB.includes(b));

  if (sharedBranches.length > 0) {
    timingOverlaps.push(`Shared luck pillar branches: ${[...new Set(sharedBranches)].join(', ')}`);
    timingOverlapsZh.push(`共享大运地支: ${[...new Set(sharedBranches)].join(', ')}`);
  }

  // Archetype bridges
  const archetypeBridges: string[] = [];
  const archetypeBridgesZh: string[] = [];

  if (ELEMENT_RELATIONSHIPS[elemA].produces === elemB) {
    archetypeBridges.push(`${elemA} naturally supports ${elemB} through productive cycle`);
    archetypeBridgesZh.push(`${elemA}通过生成循环自然支持${elemB}`);
  }

  // Recommendations
  const recommendations: string[] = [];
  const recommendationsZh: string[] = [];

  if (compatibilityScore < 0.5) {
    recommendations.push('Schedule collaborative sessions during neutral timing windows');
    recommendations.push('Use mediators with bridging elements');
    recommendationsZh.push('在中性时间窗口安排协作会议');
    recommendationsZh.push('使用具有桥接元素的调解人');
  } else {
    recommendations.push('Leverage natural synergy for joint projects');
    recommendations.push('Cross-pollinate team members for innovation');
    recommendationsZh.push('利用自然协同效应进行联合项目');
    recommendationsZh.push('交叉融合团队成员以促进创新');
  }

  return {
    teamAId: teamA.teamId,
    teamAName: teamA.teamName,
    teamBId: teamB.teamId,
    teamBName: teamB.teamName,
    compatibilityScore,
    sharedPatterns,
    sharedPatternsZh,
    conflictPatterns,
    conflictPatternsZh,
    timingOverlaps,
    timingOverlapsZh,
    archetypeBridges,
    archetypeBridgesZh,
    recommendations,
    recommendationsZh
  };
}

// ==================== PREDICTIVE DASHBOARDS ====================

/**
 * Build organizational dashboards
 */
export function buildDashboards(teamCharts: TeamCharts[]): DashboardWidget[] {
  return [
    buildTimingHeatmap(teamCharts),
    buildElementDistributionChart(teamCharts),
    buildTeamCompatibilityMatrix(teamCharts),
    buildRiskOpportunityGauge(teamCharts),
    buildLeadershipConstellation(teamCharts),
    buildShenShaActivationTimeline(teamCharts)
  ];
}

function buildTimingHeatmap(teamCharts: TeamCharts[]): DashboardWidget {
  // Build luck pillar timing heatmap
  const heatmapData: Array<{ team: string; year: number; intensity: number }> = [];

  const currentYear = new Date().getFullYear();

  for (const tc of teamCharts) {
    for (let year = currentYear; year <= currentYear + 10; year++) {
      // Calculate intensity based on luck pillar transitions
      let intensity = 0.5;

      for (const chart of tc.charts) {
        const lp = chart.currentLuckPillar;
        if (year >= lp.startAge && year <= lp.endAge) {
          // In current luck pillar
          intensity += 0.1;
        }
      }

      heatmapData.push({
        team: tc.teamName,
        year,
        intensity: Math.min(intensity, 1)
      });
    }
  }

  return {
    id: 'timing_heatmap',
    label: 'Organizational Timing Heatmap',
    labelZh: '组织时机热图',
    type: 'heatmap',
    data: heatmapData,
    insights: ['Peak pressure periods identified in 2027-2029'],
    insightsZh: ['2027-2029年识别到高压期'],
    config: { colorScale: 'viridis', showLabels: true }
  };
}

function buildElementDistributionChart(teamCharts: TeamCharts[]): DashboardWidget {
  const distributions: Array<{ team: string; element: Element; value: number }> = [];

  for (const tc of teamCharts) {
    for (const [elem, value] of Object.entries(tc.elementDistribution)) {
      distributions.push({
        team: tc.teamName,
        element: elem as Element,
        value
      });
    }
  }

  return {
    id: 'element_distribution',
    label: 'Element Distribution by Team',
    labelZh: '团队元素分布',
    type: 'chart',
    data: distributions,
    insights: ['Fire and Metal teams show potential friction points'],
    insightsZh: ['火和金团队显示潜在摩擦点'],
    config: { chartType: 'stackedBar', showLegend: true }
  };
}

function buildTeamCompatibilityMatrix(teamCharts: TeamCharts[]): DashboardWidget {
  const crossAnalysis = analyzeCrossTeams(teamCharts);

  const matrixData = crossAnalysis.map(ca => ({
    teamA: ca.teamAName,
    teamB: ca.teamBName,
    score: ca.compatibilityScore
  }));

  return {
    id: 'compatibility_matrix',
    label: 'Team Compatibility Matrix',
    labelZh: '团队兼容性矩阵',
    type: 'matrix',
    data: matrixData,
    insights: ['Strong synergy between teams A and C', 'Teams B and D require mediation'],
    insightsZh: ['A和C团队之间有强协同效应', 'B和D团队需要调解'],
    config: { colorScale: 'redGreen', showValues: true }
  };
}

function buildRiskOpportunityGauge(teamCharts: TeamCharts[]): DashboardWidget {
  const insights = generateOrgInsights(teamCharts);

  const riskCount = insights.filter(i => !i.isOpportunity && (i.severity === 'high' || i.severity === 'critical')).length;
  const opportunityCount = insights.filter(i => i.isOpportunity).length;

  const riskScore = Math.min(riskCount / 5, 1);
  const opportunityScore = Math.min(opportunityCount / 5, 1);

  return {
    id: 'risk_opportunity_gauge',
    label: 'Risk & Opportunity Gauge',
    labelZh: '风险与机会仪表',
    type: 'gauge',
    data: { risk: riskScore, opportunity: opportunityScore },
    insights: [`${riskCount} active risks`, `${opportunityCount} active opportunities`],
    insightsZh: [`${riskCount}个活跃风险`, `${opportunityCount}个活跃机会`],
    config: { showBothScales: true }
  };
}

function buildLeadershipConstellation(teamCharts: TeamCharts[]): DashboardWidget {
  const leadershipCharts: OrgChart[] = [];

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      if (chart.isLeadership) {
        leadershipCharts.push(chart);
      }
    }
  }

  const nodes = leadershipCharts.map(c => ({
    id: c.id,
    name: c.name,
    element: c.dayMaster,
    structure: c.structure
  }));

  const edges: Array<{ source: string; target: string; type: string }> = [];

  // Create edges based on elemental relationships
  for (let i = 0; i < leadershipCharts.length; i++) {
    for (let j = i + 1; j < leadershipCharts.length; j++) {
      const a = leadershipCharts[i];
      const b = leadershipCharts[j];

      if (ELEMENT_RELATIONSHIPS[a.dayMaster].produces === b.dayMaster) {
        edges.push({ source: a.id, target: b.id, type: 'supports' });
      } else if (ELEMENT_RELATIONSHIPS[a.dayMaster].controls === b.dayMaster) {
        edges.push({ source: a.id, target: b.id, type: 'controls' });
      }
    }
  }

  return {
    id: 'leadership_constellation',
    label: 'Leadership Constellation',
    labelZh: '领导力星座',
    type: 'network',
    data: { nodes, edges },
    insights: ['Strong Guide-Warrior-Sage triad detected'],
    insightsZh: ['检测到强大的向导-战士-智者三元组'],
    config: { layout: 'force', showLabels: true }
  };
}

function buildShenShaActivationTimeline(teamCharts: TeamCharts[]): DashboardWidget {
  const timelineData: Array<{ name: string; type: string; startDate: Date; endDate: Date }> = [];

  // This would be populated with actual Shen Sha activation periods
  // For now, creating placeholder data
  const currentYear = new Date().getFullYear();

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      for (const sha of chart.shenSha) {
        timelineData.push({
          name: `${chart.name} - ${sha}`,
          type: sha,
          startDate: new Date(currentYear, 0, 1),
          endDate: new Date(currentYear, 11, 31)
        });
      }
    }
  }

  return {
    id: 'shen_sha_timeline',
    label: 'Shen Sha Activation Timeline',
    labelZh: '神煞激活时间线',
    type: 'timeline',
    data: timelineData,
    insights: ['Nobleman activations peak in Q2', 'Blade activations cluster in Q4'],
    insightsZh: ['贵人激活在第二季度达到高峰', '羊刃激活在第四季度聚集'],
    config: { showGroups: true, zoomable: true }
  };
}

/**
 * Create a predictive dashboard
 */
export function createPredictiveDashboard(
  organizationId: string,
  teamCharts: TeamCharts[],
  name: string,
  nameZh: string
): PredictiveDashboard {
  return {
    id: `dashboard_${Date.now()}`,
    name,
    nameZh,
    organizationId,
    widgets: buildDashboards(teamCharts),
    lastUpdated: new Date(),
    refreshInterval: 86400000 // 24 hours
  };
}

// ==================== EXPORTS ====================

export {
  generateOrgInsights,
  analyzeCrossTeams,
  compareTeams,
  buildDashboards,
  createPredictiveDashboard,
  findTeamsDominatedBy,
  calculateElementDistribution,
  findDominantElement
};
