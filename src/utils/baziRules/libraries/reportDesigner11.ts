/**
 * ============================================
 * PRO REPORT DESIGNER 11.0
 * Self-Governing Metaphysics Organism
 *
 * Features:
 * - Autonomous governance engine
 * - Self-optimizing systems
 * - Adaptive ritual engine
 * - Continuous strategic alignment
 * - Governance directives
 * - Organizational metaphysical posture
 * ============================================
 */

import {
  type TeamCharts,
  type OrgInsight,
  generateOrgInsights
} from './reportDesigner8';

import {
  type MonitoringEvent,
  type StrategicRecommendation,
  type MonitoringMetrics,
  detectMonitoringEvents,
  calculateMonitoringMetrics,
  generateStrategicRecommendations,
  generateAlerts
} from './reportDesigner9';

import {
  buildStrategicModel,
  type StrategicModel
} from './reportDesigner10';

// ==================== TYPES ====================

export type DirectiveCategory = 'timing' | 'structure' | 'leadership' | 'culture' | 'ritual' | 'alignment';

export interface GovernanceDirective {
  id: string;
  timestamp: number;
  category: DirectiveCategory;
  directive: string;
  directiveZh: string;
  rationale: string[];
  rationaleZh: string[];
  expectedOutcome: string;
  expectedOutcomeZh: string;
  monitoringPlan: string[];
  monitoringPlanZh: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'proposed' | 'active' | 'completed' | 'superseded';
  effectiveUntil?: Date;
}

export interface GovernanceState {
  id: string;
  organizationId: string;
  currentDirectives: GovernanceDirective[];
  alignmentStatus: AlignmentStatus;
  ritualCalendar: AdaptiveRitual[];
  weights: GovernanceWeights;
  posture: OrganizationalPosture;
  lastCycleAt: number;
  cycleCount: number;
  learningEnabled: boolean;
  version: string;
}

export interface GovernanceWeights {
  timing: number;
  archetypes: number;
  structure: number;
  leadership: number;
  teamDynamics: number;
  shenSha: number;
  elementalBalance: number;
}

export interface AlignmentStatus {
  score: number;
  trajectory: 'improving' | 'declining' | 'stable';
  misalignments: Misalignment[];
  opportunities: AlignmentOpportunity[];
  recommendedAdjustments: string[];
  recommendedAdjustmentsZh: string[];
}

export interface Misalignment {
  id: string;
  area: string;
  areaZh: string;
  severity: 'minor' | 'moderate' | 'significant' | 'critical';
  description: string;
  descriptionZh: string;
  correctionStrategy: string;
  correctionStrategyZh: string;
}

export interface AlignmentOpportunity {
  id: string;
  area: string;
  areaZh: string;
  potential: 'low' | 'medium' | 'high' | 'transformative';
  description: string;
  descriptionZh: string;
  captureStrategy: string;
  captureStrategyZh: string;
}

export interface OrganizationalPosture {
  mode: 'expansion' | 'consolidation' | 'transformation' | 'protection' | 'balanced';
  modeZh: string;
  description: string;
  descriptionZh: string;
  recommendedBehaviors: string[];
  recommendedBehaviorsZh: string[];
  avoidBehaviors: string[];
  avoidBehaviorsZh: string[];
}

export type RitualLevel = 'organization' | 'team' | 'leadership' | 'individual';
export type RitualFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'cyclical';

export interface AdaptiveRitual {
  id: string;
  theme: string;
  themeZh: string;
  level: RitualLevel;
  frequency: RitualFrequency;
  timing: { start: Date; end: Date };
  actions: string[];
  actionsZh: string[];
  rationale: string[];
  rationaleZh: string[];
  expectedOutcome: string;
  expectedOutcomeZh: string;
  isActive: boolean;
  completedCount: number;
}

export interface LearningFeedback {
  directiveId: string;
  actualOutcome: string;
  expectedOutcome: string;
  success: boolean;
  lessons: string[];
  adjustments: Partial<GovernanceWeights>;
}

export interface GovernanceCycleResult {
  directives: GovernanceDirective[];
  rituals: AdaptiveRitual[];
  alignment: AlignmentStatus;
  posture: OrganizationalPosture;
  metricsSnapshot: MonitoringMetrics;
  cycleTimestamp: number;
}

// ==================== GOVERNANCE ENGINE ====================

/**
 * Initialize governance state for an organization
 */
export function initializeGovernanceState(organizationId: string): GovernanceState {
  return {
    id: `gov_${Date.now()}`,
    organizationId,
    currentDirectives: [],
    alignmentStatus: {
      score: 0.5,
      trajectory: 'stable',
      misalignments: [],
      opportunities: [],
      recommendedAdjustments: [],
      recommendedAdjustmentsZh: []
    },
    ritualCalendar: [],
    weights: {
      timing: 1.0,
      archetypes: 1.0,
      structure: 1.0,
      leadership: 1.0,
      teamDynamics: 1.0,
      shenSha: 0.8,
      elementalBalance: 0.9
    },
    posture: {
      mode: 'balanced',
      modeZh: '平衡',
      description: 'Maintaining equilibrium',
      descriptionZh: '保持平衡',
      recommendedBehaviors: [],
      recommendedBehaviorsZh: [],
      avoidBehaviors: [],
      avoidBehaviorsZh: []
    },
    lastCycleAt: 0,
    cycleCount: 0,
    learningEnabled: true,
    version: '11.0.0'
  };
}

/**
 * Run a governance cycle
 */
export function runGovernanceCycle(
  state: GovernanceState,
  teamCharts: TeamCharts[]
): { result: GovernanceCycleResult; updatedState: GovernanceState } {
  // 1. Detect events and calculate metrics
  const events = detectMonitoringEvents(teamCharts);
  const metrics = calculateMonitoringMetrics(teamCharts);
  const insights = generateOrgInsights(teamCharts);
  const recommendations = generateStrategicRecommendations(events, insights, []);

  // 2. Compute alignment
  const alignment = computeAlignment(teamCharts, recommendations, state.weights);

  // 3. Determine organizational posture
  const posture = determinePosture(metrics, alignment);

  // 4. Generate adaptive rituals
  const rituals = generateAdaptiveRituals(alignment, posture, metrics);

  // 5. Generate governance directives
  const directives = generateGovernanceDirectives(recommendations, rituals, alignment, posture);

  // 6. Update state
  const updatedState: GovernanceState = {
    ...state,
    currentDirectives: directives,
    alignmentStatus: alignment,
    ritualCalendar: rituals,
    posture,
    lastCycleAt: Date.now(),
    cycleCount: state.cycleCount + 1
  };

  return {
    result: {
      directives,
      rituals,
      alignment,
      posture,
      metricsSnapshot: metrics,
      cycleTimestamp: Date.now()
    },
    updatedState
  };
}

// ==================== ALIGNMENT COMPUTATION ====================

/**
 * Compute organizational alignment status
 */
export function computeAlignment(
  teamCharts: TeamCharts[],
  recommendations: StrategicRecommendation[],
  weights: GovernanceWeights
): AlignmentStatus {
  const misalignments: Misalignment[] = [];
  const opportunities: AlignmentOpportunity[] = [];
  let score = 0.5;

  // Check timing alignment
  const timingScore = computeTimingAlignment(teamCharts);
  score += (timingScore - 0.5) * weights.timing * 0.2;

  if (timingScore < 0.4) {
    misalignments.push({
      id: 'misalign_timing',
      area: 'Timing',
      areaZh: '时机',
      severity: timingScore < 0.2 ? 'critical' : 'moderate',
      description: 'Organizational actions not aligned with optimal timing cycles',
      descriptionZh: '组织行动与最佳时机周期不一致',
      correctionStrategy: 'Review and adjust decision timing',
      correctionStrategyZh: '审查并调整决策时机'
    });
  }

  // Check elemental balance
  const elementalScore = computeElementalBalance(teamCharts);
  score += (elementalScore - 0.5) * weights.elementalBalance * 0.15;

  if (elementalScore < 0.4) {
    misalignments.push({
      id: 'misalign_elemental',
      area: 'Elemental Balance',
      areaZh: '元素平衡',
      severity: elementalScore < 0.2 ? 'significant' : 'moderate',
      description: 'Team composition shows elemental imbalance',
      descriptionZh: '团队构成显示元素失衡',
      correctionStrategy: 'Consider hiring or team adjustments for balance',
      correctionStrategyZh: '考虑招聘或团队调整以实现平衡'
    });
  }

  // Check leadership alignment
  const leadershipScore = computeLeadershipAlignment(teamCharts);
  score += (leadershipScore - 0.5) * weights.leadership * 0.2;

  if (leadershipScore > 0.7) {
    opportunities.push({
      id: 'opp_leadership',
      area: 'Leadership',
      areaZh: '领导力',
      potential: 'high',
      description: 'Leadership constellation shows strong alignment',
      descriptionZh: '领导力星座显示强大的协调',
      captureStrategy: 'Leverage leadership synergy for strategic initiatives',
      captureStrategyZh: '利用领导力协同效应进行战略举措'
    });
  }

  // Determine trajectory
  const trajectory = score > 0.6 ? 'improving' : score < 0.4 ? 'declining' : 'stable';

  // Generate recommended adjustments
  const recommendedAdjustments: string[] = [];
  const recommendedAdjustmentsZh: string[] = [];

  for (const misalignment of misalignments) {
    recommendedAdjustments.push(misalignment.correctionStrategy);
    recommendedAdjustmentsZh.push(misalignment.correctionStrategyZh);
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    trajectory,
    misalignments,
    opportunities,
    recommendedAdjustments,
    recommendedAdjustmentsZh
  };
}

function computeTimingAlignment(teamCharts: TeamCharts[]): number {
  // Check if organization is acting in sync with favorable timing
  let score = 0.5;

  for (const tc of teamCharts) {
    for (const chart of tc.charts) {
      // Check if current luck pillar is favorable
      if (chart.usefulGod === chart.dayMaster) {
        score += 0.05;
      }
    }
  }

  return Math.min(1, score);
}

function computeElementalBalance(teamCharts: TeamCharts[]): number {
  if (teamCharts.length === 0) return 0.5;

  // Check distribution across all teams
  const totalDist = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  for (const tc of teamCharts) {
    for (const elem of Object.keys(totalDist) as Array<keyof typeof totalDist>) {
      totalDist[elem] += tc.elementDistribution[elem] || 0;
    }
  }

  // Normalize
  const total = Object.values(totalDist).reduce((a, b) => a + b, 0);
  if (total === 0) return 0.5;

  for (const elem of Object.keys(totalDist) as Array<keyof typeof totalDist>) {
    totalDist[elem] /= total;
  }

  // Calculate variance from ideal (0.2 each)
  let variance = 0;
  for (const value of Object.values(totalDist)) {
    variance += Math.pow(value - 0.2, 2);
  }

  // Lower variance = higher balance score
  return Math.max(0, 1 - variance * 5);
}

function computeLeadershipAlignment(teamCharts: TeamCharts[]): number {
  const leadershipCharts = teamCharts.flatMap(tc => tc.charts.filter(c => c.isLeadership));

  if (leadershipCharts.length < 2) return 0.5;

  // Check for complementary elements
  const elements = leadershipCharts.map(c => c.dayMaster);
  const uniqueElements = new Set(elements);

  // More diversity = better alignment potential
  return Math.min(1, uniqueElements.size / 5 + 0.3);
}

// ==================== POSTURE DETERMINATION ====================

/**
 * Determine organizational posture based on metrics and alignment
 */
export function determinePosture(
  metrics: MonitoringMetrics,
  alignment: AlignmentStatus
): OrganizationalPosture {
  // Determine mode based on metrics
  let mode: OrganizationalPosture['mode'];
  let modeZh: string;

  if (metrics.pressureIndex > 0.7) {
    mode = 'protection';
    modeZh = '保护';
  } else if (metrics.opportunityIndex > 0.6 && alignment.score > 0.6) {
    mode = 'expansion';
    modeZh = '扩张';
  } else if (alignment.misalignments.length > 2) {
    mode = 'transformation';
    modeZh = '转型';
  } else if (metrics.conflictRisk > 0.5) {
    mode = 'consolidation';
    modeZh = '巩固';
  } else {
    mode = 'balanced';
    modeZh = '平衡';
  }

  const postures: Record<OrganizationalPosture['mode'], Omit<OrganizationalPosture, 'mode' | 'modeZh'>> = {
    expansion: {
      description: 'Favorable conditions for growth and initiative',
      descriptionZh: '有利于增长和主动行动的条件',
      recommendedBehaviors: [
        'Pursue new opportunities aggressively',
        'Expand team capacity',
        'Launch strategic initiatives',
        'Build partnerships'
      ],
      recommendedBehaviorsZh: [
        '积极追求新机会',
        '扩展团队能力',
        '启动战略举措',
        '建立合作伙伴关系'
      ],
      avoidBehaviors: [
        'Excessive caution',
        'Delaying decisions',
        'Under-resourcing initiatives'
      ],
      avoidBehaviorsZh: [
        '过度谨慎',
        '延迟决策',
        '项目资源不足'
      ]
    },
    consolidation: {
      description: 'Time to strengthen foundations and reduce exposure',
      descriptionZh: '加强基础、减少风险敞口的时机',
      recommendedBehaviors: [
        'Focus on core operations',
        'Reduce non-essential projects',
        'Build reserves',
        'Strengthen relationships'
      ],
      recommendedBehaviorsZh: [
        '专注核心运营',
        '减少非必要项目',
        '建立储备',
        '加强关系'
      ],
      avoidBehaviors: [
        'Major expansions',
        'High-risk ventures',
        'Overextension'
      ],
      avoidBehaviorsZh: [
        '重大扩张',
        '高风险项目',
        '过度扩张'
      ]
    },
    transformation: {
      description: 'Structural changes needed for realignment',
      descriptionZh: '需要结构性变革以重新调整',
      recommendedBehaviors: [
        'Address misalignments directly',
        'Restructure as needed',
        'Refresh leadership approaches',
        'Embrace change'
      ],
      recommendedBehaviorsZh: [
        '直接解决失调问题',
        '根据需要重组',
        '更新领导方式',
        '拥抱变革'
      ],
      avoidBehaviors: [
        'Resistance to change',
        'Maintaining status quo',
        'Ignoring misalignments'
      ],
      avoidBehaviorsZh: [
        '抵制变革',
        '维持现状',
        '忽视失调'
      ]
    },
    protection: {
      description: 'High pressure period requiring defensive posture',
      descriptionZh: '高压期，需要防御性姿态',
      recommendedBehaviors: [
        'Prioritize stability',
        'Support affected teams',
        'Delay major decisions',
        'Increase monitoring'
      ],
      recommendedBehaviorsZh: [
        '优先考虑稳定性',
        '支持受影响的团队',
        '推迟重大决策',
        '增加监控'
      ],
      avoidBehaviors: [
        'Aggressive initiatives',
        'Major confrontations',
        'Irreversible decisions'
      ],
      avoidBehaviorsZh: [
        '激进举措',
        '重大对抗',
        '不可逆的决策'
      ]
    },
    balanced: {
      description: 'Stable conditions for measured progress',
      descriptionZh: '稳定条件，适合适度进展',
      recommendedBehaviors: [
        'Maintain steady progress',
        'Monitor for changes',
        'Prepare for opportunities',
        'Build capabilities'
      ],
      recommendedBehaviorsZh: [
        '保持稳步进展',
        '监控变化',
        '为机会做准备',
        '建设能力'
      ],
      avoidBehaviors: [
        'Complacency',
        'Ignoring signals',
        'Reactive-only approach'
      ],
      avoidBehaviorsZh: [
        '自满',
        '忽视信号',
        '仅被动应对'
      ]
    }
  };

  return {
    mode,
    modeZh,
    ...postures[mode]
  };
}

// ==================== ADAPTIVE RITUAL ENGINE ====================

/**
 * Generate adaptive rituals based on alignment and posture
 */
export function generateAdaptiveRituals(
  alignment: AlignmentStatus,
  posture: OrganizationalPosture,
  metrics: MonitoringMetrics
): AdaptiveRitual[] {
  const rituals: AdaptiveRitual[] = [];
  const now = new Date();

  // Posture-based rituals
  rituals.push(...generatePostureRituals(posture, now));

  // Alignment correction rituals
  for (const misalignment of alignment.misalignments) {
    rituals.push(generateCorrectionRitual(misalignment, now));
  }

  // Opportunity capture rituals
  for (const opportunity of alignment.opportunities) {
    rituals.push(generateOpportunityRitual(opportunity, now));
  }

  // Elemental cycle rituals
  rituals.push(...generateElementalRituals(metrics, now));

  return rituals;
}

function generatePostureRituals(posture: OrganizationalPosture, now: Date): AdaptiveRitual[] {
  const rituals: AdaptiveRitual[] = [];

  const postureRitualMap: Record<OrganizationalPosture['mode'], Partial<AdaptiveRitual>> = {
    expansion: {
      theme: 'Growth Momentum Ritual',
      themeZh: '增长动力仪式',
      actions: ['Weekly growth review', 'Opportunity identification session', 'Resource allocation review'],
      actionsZh: ['每周增长回顾', '机会识别会议', '资源分配审查'],
      frequency: 'weekly'
    },
    consolidation: {
      theme: 'Foundation Strengthening Ritual',
      themeZh: '基础加强仪式',
      actions: ['Core operations review', 'Efficiency audit', 'Reserve building assessment'],
      actionsZh: ['核心运营审查', '效率审计', '储备建设评估'],
      frequency: 'weekly'
    },
    transformation: {
      theme: 'Change Integration Ritual',
      themeZh: '变革整合仪式',
      actions: ['Progress check-in', 'Resistance identification', 'Adjustment planning'],
      actionsZh: ['进度检查', '阻力识别', '调整规划'],
      frequency: 'weekly'
    },
    protection: {
      theme: 'Stability Preservation Ritual',
      themeZh: '稳定性维护仪式',
      actions: ['Stress level check', 'Support resource review', 'Risk monitoring update'],
      actionsZh: ['压力水平检查', '支持资源审查', '风险监控更新'],
      frequency: 'daily'
    },
    balanced: {
      theme: 'Equilibrium Maintenance Ritual',
      themeZh: '平衡维护仪式',
      actions: ['Balance assessment', 'Opportunity scanning', 'Preparedness review'],
      actionsZh: ['平衡评估', '机会扫描', '准备状态审查'],
      frequency: 'weekly'
    }
  };

  const ritual = postureRitualMap[posture.mode];

  rituals.push({
    id: `ritual_posture_${posture.mode}`,
    theme: ritual.theme || '',
    themeZh: ritual.themeZh || '',
    level: 'organization',
    frequency: ritual.frequency || 'weekly',
    timing: { start: now, end: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
    actions: ritual.actions || [],
    actionsZh: ritual.actionsZh || [],
    rationale: [`Current posture: ${posture.mode}`],
    rationaleZh: [`当前姿态: ${posture.modeZh}`],
    expectedOutcome: `Maintain ${posture.mode} posture effectively`,
    expectedOutcomeZh: `有效维持${posture.modeZh}姿态`,
    isActive: true,
    completedCount: 0
  });

  return rituals;
}

function generateCorrectionRitual(misalignment: Misalignment, now: Date): AdaptiveRitual {
  return {
    id: `ritual_correction_${misalignment.id}`,
    theme: `${misalignment.area} Correction Ritual`,
    themeZh: `${misalignment.areaZh}纠正仪式`,
    level: 'organization',
    frequency: misalignment.severity === 'critical' ? 'daily' : 'weekly',
    timing: { start: now, end: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) },
    actions: [misalignment.correctionStrategy],
    actionsZh: [misalignment.correctionStrategyZh],
    rationale: [misalignment.description],
    rationaleZh: [misalignment.descriptionZh],
    expectedOutcome: `Resolve ${misalignment.area} misalignment`,
    expectedOutcomeZh: `解决${misalignment.areaZh}失调`,
    isActive: true,
    completedCount: 0
  };
}

function generateOpportunityRitual(opportunity: AlignmentOpportunity, now: Date): AdaptiveRitual {
  return {
    id: `ritual_opportunity_${opportunity.id}`,
    theme: `${opportunity.area} Capture Ritual`,
    themeZh: `${opportunity.areaZh}捕获仪式`,
    level: 'leadership',
    frequency: 'weekly',
    timing: { start: now, end: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) },
    actions: [opportunity.captureStrategy],
    actionsZh: [opportunity.captureStrategyZh],
    rationale: [opportunity.description],
    rationaleZh: [opportunity.descriptionZh],
    expectedOutcome: `Capitalize on ${opportunity.area} opportunity`,
    expectedOutcomeZh: `利用${opportunity.areaZh}机会`,
    isActive: true,
    completedCount: 0
  };
}

function generateElementalRituals(metrics: MonitoringMetrics, now: Date): AdaptiveRitual[] {
  const rituals: AdaptiveRitual[] = [];

  // Determine dominant organizational element cycle
  const month = now.getMonth();
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const dominantElement = elements[Math.floor(month / 2.4) % 5];

  const elementRituals: Record<string, Partial<AdaptiveRitual>> = {
    Wood: {
      theme: 'Growth & Innovation Ritual',
      themeZh: '成长与创新仪式',
      actions: ['Brainstorming sessions', 'New initiative planning', 'Learning programs'],
      actionsZh: ['头脑风暴会议', '新项目规划', '学习计划']
    },
    Fire: {
      theme: 'Visibility & Recognition Ritual',
      themeZh: '可见性与认可仪式',
      actions: ['Public recognition events', 'Marketing initiatives', 'Leadership visibility'],
      actionsZh: ['公开表彰活动', '市场营销举措', '领导层可见性']
    },
    Earth: {
      theme: 'Consolidation & Stability Ritual',
      themeZh: '巩固与稳定仪式',
      actions: ['Process review', 'Documentation updates', 'Team building'],
      actionsZh: ['流程审查', '文档更新', '团队建设']
    },
    Metal: {
      theme: 'Clarity & Precision Ritual',
      themeZh: '清晰与精确仪式',
      actions: ['Goal clarification', 'Boundary setting', 'Quality review'],
      actionsZh: ['目标澄清', '边界设定', '质量审查']
    },
    Water: {
      theme: 'Reflection & Wisdom Ritual',
      themeZh: '反思与智慧仪式',
      actions: ['Strategic reflection', 'Knowledge sharing', 'Mentorship programs'],
      actionsZh: ['战略反思', '知识分享', '导师计划']
    }
  };

  const elementRitual = elementRituals[dominantElement];

  rituals.push({
    id: `ritual_element_${dominantElement.toLowerCase()}`,
    theme: elementRitual.theme || '',
    themeZh: elementRitual.themeZh || '',
    level: 'organization',
    frequency: 'monthly',
    timing: { start: now, end: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
    actions: elementRitual.actions || [],
    actionsZh: elementRitual.actionsZh || [],
    rationale: [`Current elemental cycle: ${dominantElement}`],
    rationaleZh: [`当前元素周期: ${dominantElement}`],
    expectedOutcome: `Align with ${dominantElement} energy`,
    expectedOutcomeZh: `与${dominantElement}能量协调`,
    isActive: true,
    completedCount: 0
  });

  return rituals;
}

// ==================== DIRECTIVE GENERATION ====================

/**
 * Generate governance directives
 */
export function generateGovernanceDirectives(
  recommendations: StrategicRecommendation[],
  rituals: AdaptiveRitual[],
  alignment: AlignmentStatus,
  posture: OrganizationalPosture
): GovernanceDirective[] {
  const directives: GovernanceDirective[] = [];

  // Posture directive
  directives.push({
    id: `directive_posture_${Date.now()}`,
    timestamp: Date.now(),
    category: 'culture',
    directive: `Adopt ${posture.mode} organizational posture`,
    directiveZh: `采用${posture.modeZh}组织姿态`,
    rationale: [posture.description],
    rationaleZh: [posture.descriptionZh],
    expectedOutcome: 'Organizational behavior aligned with current conditions',
    expectedOutcomeZh: '组织行为与当前条件协调',
    monitoringPlan: ['Weekly posture assessment', 'Behavior compliance review'],
    monitoringPlanZh: ['每周姿态评估', '行为合规审查'],
    priority: 'high',
    status: 'active',
    effectiveUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  // Alignment directives
  for (const misalignment of alignment.misalignments.filter(m => m.severity === 'critical' || m.severity === 'significant')) {
    directives.push({
      id: `directive_align_${misalignment.id}`,
      timestamp: Date.now(),
      category: 'alignment',
      directive: `Address ${misalignment.area} misalignment`,
      directiveZh: `解决${misalignment.areaZh}失调`,
      rationale: [misalignment.description],
      rationaleZh: [misalignment.descriptionZh],
      expectedOutcome: misalignment.correctionStrategy,
      expectedOutcomeZh: misalignment.correctionStrategyZh,
      monitoringPlan: ['Track correction progress', 'Measure alignment improvement'],
      monitoringPlanZh: ['跟踪纠正进度', '衡量协调改进'],
      priority: misalignment.severity === 'critical' ? 'critical' : 'high',
      status: 'active'
    });
  }

  // Strategic recommendation directives
  for (const rec of recommendations.slice(0, 3)) {
    directives.push({
      id: `directive_strategic_${rec.id}`,
      timestamp: Date.now(),
      category: rec.category as DirectiveCategory,
      directive: rec.recommendation,
      directiveZh: rec.recommendationZh,
      rationale: rec.rationale,
      rationaleZh: rec.rationaleZh,
      expectedOutcome: 'Strategic objective achieved',
      expectedOutcomeZh: '实现战略目标',
      monitoringPlan: rec.implementationSteps,
      monitoringPlanZh: rec.implementationStepsZh,
      priority: rec.priority,
      status: 'proposed'
    });
  }

  // Ritual directives
  for (const ritual of rituals.filter(r => r.frequency === 'daily' || r.level === 'organization')) {
    directives.push({
      id: `directive_ritual_${ritual.id}`,
      timestamp: Date.now(),
      category: 'ritual',
      directive: `Implement ${ritual.theme}`,
      directiveZh: `实施${ritual.themeZh}`,
      rationale: ritual.rationale,
      rationaleZh: ritual.rationaleZh,
      expectedOutcome: ritual.expectedOutcome,
      expectedOutcomeZh: ritual.expectedOutcomeZh,
      monitoringPlan: ['Track ritual completion', 'Assess ritual effectiveness'],
      monitoringPlanZh: ['跟踪仪式完成', '评估仪式效果'],
      priority: 'medium',
      status: 'active',
      effectiveUntil: ritual.timing.end
    });
  }

  return directives;
}

// ==================== SELF-OPTIMIZATION ====================

/**
 * Apply learning feedback to optimize governance weights
 */
export function selfOptimize(
  state: GovernanceState,
  feedback: LearningFeedback
): GovernanceState {
  if (!state.learningEnabled) return state;

  const learningRate = 0.1;
  const updatedWeights = { ...state.weights };

  // Adjust weights based on feedback
  for (const [key, adjustment] of Object.entries(feedback.adjustments)) {
    const k = key as keyof GovernanceWeights;
    if (updatedWeights[k] !== undefined && adjustment !== undefined) {
      updatedWeights[k] += adjustment * learningRate;
      // Clamp to reasonable range
      updatedWeights[k] = Math.max(0.5, Math.min(1.5, updatedWeights[k]));
    }
  }

  // Normalize weights
  const total = Object.values(updatedWeights).reduce((a, b) => a + b, 0);
  const avgWeight = total / Object.keys(updatedWeights).length;

  for (const key of Object.keys(updatedWeights) as Array<keyof GovernanceWeights>) {
    updatedWeights[key] = updatedWeights[key] / avgWeight;
  }

  return {
    ...state,
    weights: updatedWeights
  };
}

/**
 * Evaluate directive outcomes for learning
 */
export function evaluateOutcomes(
  state: GovernanceState,
  directive: GovernanceDirective,
  actualOutcome: string,
  success: boolean
): LearningFeedback {
  const adjustments: Partial<GovernanceWeights> = {};

  // Determine which weights to adjust based on directive category
  if (directive.category === 'timing') {
    adjustments.timing = success ? 0.1 : -0.1;
  } else if (directive.category === 'leadership') {
    adjustments.leadership = success ? 0.1 : -0.1;
  } else if (directive.category === 'structure') {
    adjustments.structure = success ? 0.1 : -0.1;
  }

  return {
    directiveId: directive.id,
    actualOutcome,
    expectedOutcome: directive.expectedOutcome,
    success,
    lessons: success
      ? [`${directive.category} directive effective`]
      : [`${directive.category} directive needs refinement`],
    adjustments
  };
}

// ==================== EXPORTS ====================

export {
  initializeGovernanceState,
  runGovernanceCycle,
  computeAlignment,
  determinePosture,
  generateAdaptiveRituals,
  generateGovernanceDirectives,
  selfOptimize,
  evaluateOutcomes
};
