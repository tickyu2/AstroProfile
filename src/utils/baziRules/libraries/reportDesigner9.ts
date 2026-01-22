/**
 * ============================================
 * PRO REPORT DESIGNER 9.0
 * Autonomous Metaphysics Intelligence Agent
 *
 * Features:
 * - Continuous organizational monitoring
 * - Real-time alert system
 * - Strategic recommendation engine
 * - Autonomous agent loop
 * - Pattern detection before humans notice
 * - Self-evolving models
 * ============================================
 */

import {
  type TeamCharts,
  type OrgInsight,
  generateOrgInsights,
  analyzeCrossTeams,
  type CrossTeamAnalysis
} from './reportDesigner8';

// ==================== TYPES ====================

export type MonitoringEventType =
  | 'pressure'
  | 'opportunity'
  | 'conflict'
  | 'transition'
  | 'activation'
  | 'convergence'
  | 'divergence'
  | 'threshold';

export type AlertLevel = 'info' | 'warning' | 'critical' | 'emergency';

export type RecommendationCategory =
  | 'leadership'
  | 'team'
  | 'operations'
  | 'culture'
  | 'timing'
  | 'hiring'
  | 'restructuring'
  | 'risk_mitigation';

export interface MonitoringEvent {
  id: string;
  timestamp: number;
  type: MonitoringEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedTeams: string[];
  affectedIndividuals: string[];
  description: string;
  descriptionZh: string;
  rationale: string[];
  rationaleZh: string[];
  metrics: Record<string, number>;
  trend: 'rising' | 'falling' | 'stable' | 'volatile';
}

export interface Alert {
  id: string;
  timestamp: number;
  level: AlertLevel;
  message: string;
  messageZh: string;
  affectedTeams: string[];
  affectedIndividuals: string[];
  recommendedActions: string[];
  recommendedActionsZh: string[];
  sourceEventId: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: number;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: number;
  expiresAt?: number;
}

export interface StrategicRecommendation {
  id: string;
  timestamp: number;
  category: RecommendationCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recommendation: string;
  recommendationZh: string;
  rationale: string[];
  rationaleZh: string[];
  timingWindow?: { start: Date; end: Date };
  impactScore: number;
  confidenceScore: number;
  implementationSteps: string[];
  implementationStepsZh: string[];
  dependencies: string[];
  risks: string[];
  risksZh: string[];
}

export interface AgentState {
  id: string;
  organizationId: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  lastCycleAt: number;
  nextCycleAt: number;
  cycleInterval: number;
  totalCycles: number;
  eventsDetected: number;
  alertsGenerated: number;
  recommendationsGenerated: number;
  modelVersion: string;
  learningEnabled: boolean;
}

export interface AgentConfig {
  cycleIntervalMs: number;
  maxEventsPerCycle: number;
  alertThresholds: {
    info: number;
    warning: number;
    critical: number;
    emergency: number;
  };
  enableLearning: boolean;
  enableAutomatedActions: boolean;
  notificationChannels: string[];
}

export interface MonitoringMetrics {
  organizationId: string;
  timestamp: number;
  pressureIndex: number;
  opportunityIndex: number;
  conflictRisk: number;
  timingAlignment: number;
  elementalBalance: number;
  leadershipHealth: number;
  teamCohesion: number;
  overallHealth: number;
}

// ==================== MONITORING ENGINE ====================

/**
 * Detect monitoring events from organizational data
 */
export function detectMonitoringEvents(
  teamCharts: TeamCharts[],
  previousMetrics?: MonitoringMetrics
): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];
  const currentMetrics = calculateMonitoringMetrics(teamCharts);

  // 1. Detect pressure events
  events.push(...detectPressureEvents(teamCharts, currentMetrics, previousMetrics));

  // 2. Detect opportunity events
  events.push(...detectOpportunityEvents(teamCharts, currentMetrics, previousMetrics));

  // 3. Detect conflict events
  events.push(...detectConflictEvents(teamCharts, currentMetrics, previousMetrics));

  // 4. Detect transition events
  events.push(...detectTransitionEvents(teamCharts, currentMetrics, previousMetrics));

  // 5. Detect activation events
  events.push(...detectActivationEvents(teamCharts));

  // 6. Detect convergence/divergence events
  events.push(...detectConvergenceEvents(teamCharts, currentMetrics, previousMetrics));

  // 7. Detect threshold events
  events.push(...detectThresholdEvents(currentMetrics, previousMetrics));

  return events;
}

/**
 * Calculate monitoring metrics
 */
export function calculateMonitoringMetrics(teamCharts: TeamCharts[]): MonitoringMetrics {
  const insights = generateOrgInsights(teamCharts);
  const crossTeam = analyzeCrossTeams(teamCharts);

  // Calculate pressure index (based on challenging patterns)
  const pressureInsights = insights.filter(i => !i.isOpportunity);
  const pressureIndex = Math.min(pressureInsights.length / 10, 1);

  // Calculate opportunity index
  const opportunityInsights = insights.filter(i => i.isOpportunity);
  const opportunityIndex = Math.min(opportunityInsights.length / 5, 1);

  // Calculate conflict risk
  const conflictInsights = insights.filter(i => i.category === 'conflict');
  const conflictRisk = Math.min(conflictInsights.length / 5, 1);

  // Calculate timing alignment
  const timingInsights = insights.filter(i => i.category === 'timing');
  const timingAlignment = timingInsights.length > 0 ? 0.7 : 0.5;

  // Calculate elemental balance
  const imbalanceInsights = insights.filter(i => i.category === 'imbalance');
  const elementalBalance = 1 - Math.min(imbalanceInsights.length / 3, 0.5);

  // Calculate leadership health
  const leadershipCharts = teamCharts.flatMap(tc => tc.charts.filter(c => c.isLeadership));
  const leadershipHealth = leadershipCharts.length > 0 ? 0.7 : 0.5;

  // Calculate team cohesion (average compatibility)
  const avgCompatibility = crossTeam.length > 0
    ? crossTeam.reduce((sum, ct) => sum + ct.compatibilityScore, 0) / crossTeam.length
    : 0.5;
  const teamCohesion = avgCompatibility;

  // Calculate overall health
  const overallHealth = (
    (1 - pressureIndex) * 0.2 +
    opportunityIndex * 0.15 +
    (1 - conflictRisk) * 0.2 +
    timingAlignment * 0.1 +
    elementalBalance * 0.15 +
    leadershipHealth * 0.1 +
    teamCohesion * 0.1
  );

  return {
    organizationId: teamCharts[0]?.teamId || 'unknown',
    timestamp: Date.now(),
    pressureIndex,
    opportunityIndex,
    conflictRisk,
    timingAlignment,
    elementalBalance,
    leadershipHealth,
    teamCohesion,
    overallHealth
  };
}

function detectPressureEvents(
  teamCharts: TeamCharts[],
  current: MonitoringMetrics,
  previous?: MonitoringMetrics
): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];

  // Check for pressure spike
  if (previous && current.pressureIndex - previous.pressureIndex > 0.2) {
    events.push({
      id: `event_pressure_${Date.now()}`,
      timestamp: Date.now(),
      type: 'pressure',
      severity: current.pressureIndex > 0.7 ? 'critical' : 'high',
      affectedTeams: teamCharts.map(tc => tc.teamId),
      affectedIndividuals: [],
      description: 'Organizational pressure has spiked significantly',
      descriptionZh: '组织压力显著上升',
      rationale: ['Pressure index increased by more than 20%'],
      rationaleZh: ['压力指数增加了20%以上'],
      metrics: { pressureIndex: current.pressureIndex, delta: current.pressureIndex - previous.pressureIndex },
      trend: 'rising'
    });
  }

  return events;
}

function detectOpportunityEvents(
  teamCharts: TeamCharts[],
  current: MonitoringMetrics,
  previous?: MonitoringMetrics
): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];

  // Check for opportunity emergence
  if (previous && current.opportunityIndex - previous.opportunityIndex > 0.15) {
    events.push({
      id: `event_opportunity_${Date.now()}`,
      timestamp: Date.now(),
      type: 'opportunity',
      severity: 'medium',
      affectedTeams: teamCharts.map(tc => tc.teamId),
      affectedIndividuals: [],
      description: 'New opportunity window has emerged',
      descriptionZh: '新的机会窗口已出现',
      rationale: ['Opportunity index increased significantly'],
      rationaleZh: ['机会指数显著增加'],
      metrics: { opportunityIndex: current.opportunityIndex },
      trend: 'rising'
    });
  }

  return events;
}

function detectConflictEvents(
  teamCharts: TeamCharts[],
  current: MonitoringMetrics,
  previous?: MonitoringMetrics
): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];

  if (current.conflictRisk > 0.6) {
    events.push({
      id: `event_conflict_${Date.now()}`,
      timestamp: Date.now(),
      type: 'conflict',
      severity: current.conflictRisk > 0.8 ? 'critical' : 'high',
      affectedTeams: teamCharts.map(tc => tc.teamId),
      affectedIndividuals: [],
      description: 'Elevated conflict risk detected across organization',
      descriptionZh: '检测到组织内冲突风险升高',
      rationale: ['Conflict risk index exceeds safe threshold'],
      rationaleZh: ['冲突风险指数超过安全阈值'],
      metrics: { conflictRisk: current.conflictRisk },
      trend: previous && current.conflictRisk > previous.conflictRisk ? 'rising' : 'stable'
    });
  }

  return events;
}

function detectTransitionEvents(
  teamCharts: TeamCharts[],
  current: MonitoringMetrics,
  previous?: MonitoringMetrics
): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];

  // Detect major metric shifts
  if (previous) {
    const healthDelta = Math.abs(current.overallHealth - previous.overallHealth);
    if (healthDelta > 0.15) {
      events.push({
        id: `event_transition_${Date.now()}`,
        timestamp: Date.now(),
        type: 'transition',
        severity: 'medium',
        affectedTeams: teamCharts.map(tc => tc.teamId),
        affectedIndividuals: [],
        description: current.overallHealth > previous.overallHealth
          ? 'Organization entering more favorable phase'
          : 'Organization entering challenging phase',
        descriptionZh: current.overallHealth > previous.overallHealth
          ? '组织进入更有利的阶段'
          : '组织进入挑战性阶段',
        rationale: [`Overall health changed by ${(healthDelta * 100).toFixed(1)}%`],
        rationaleZh: [`整体健康度变化了${(healthDelta * 100).toFixed(1)}%`],
        metrics: { overallHealth: current.overallHealth, delta: healthDelta },
        trend: current.overallHealth > previous.overallHealth ? 'rising' : 'falling'
      });
    }
  }

  return events;
}

function detectActivationEvents(teamCharts: TeamCharts[]): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];

  // Detect Seven Killings cluster
  const sevenKillingsCharts = teamCharts.flatMap(tc =>
    tc.charts.filter(c => c.tenGods.includes('7K'))
  );

  if (sevenKillingsCharts.length >= 5) {
    events.push({
      id: `event_7k_activation_${Date.now()}`,
      timestamp: Date.now(),
      type: 'activation',
      severity: 'high',
      affectedTeams: [...new Set(teamCharts.filter(tc =>
        tc.charts.some(c => c.tenGods.includes('7K'))
      ).map(tc => tc.teamId))],
      affectedIndividuals: sevenKillingsCharts.map(c => c.id),
      description: 'Seven Killings cluster activated across organization',
      descriptionZh: '七杀集群在组织内激活',
      rationale: [`${sevenKillingsCharts.length} individuals with active Seven Killings`],
      rationaleZh: [`${sevenKillingsCharts.length}人的七杀被激活`],
      metrics: { count: sevenKillingsCharts.length },
      trend: 'stable'
    });
  }

  // Detect Nobleman cluster
  const noblemanCharts = teamCharts.flatMap(tc =>
    tc.charts.filter(c => c.shenSha.includes('nobleman'))
  );

  if (noblemanCharts.length >= 3) {
    events.push({
      id: `event_nobleman_activation_${Date.now()}`,
      timestamp: Date.now(),
      type: 'activation',
      severity: 'low',
      affectedTeams: [...new Set(teamCharts.filter(tc =>
        tc.charts.some(c => c.shenSha.includes('nobleman'))
      ).map(tc => tc.teamId))],
      affectedIndividuals: noblemanCharts.map(c => c.id),
      description: 'Nobleman star cluster activated - networking window open',
      descriptionZh: '贵人星集群激活 - 人脉窗口开启',
      rationale: [`${noblemanCharts.length} individuals with active Nobleman stars`],
      rationaleZh: [`${noblemanCharts.length}人的贵人星被激活`],
      metrics: { count: noblemanCharts.length },
      trend: 'stable'
    });
  }

  return events;
}

function detectConvergenceEvents(
  teamCharts: TeamCharts[],
  current: MonitoringMetrics,
  previous?: MonitoringMetrics
): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];

  // Detect team cohesion convergence
  if (current.teamCohesion > 0.75) {
    events.push({
      id: `event_convergence_${Date.now()}`,
      timestamp: Date.now(),
      type: 'convergence',
      severity: 'low',
      affectedTeams: teamCharts.map(tc => tc.teamId),
      affectedIndividuals: [],
      description: 'High team cohesion - excellent collaboration window',
      descriptionZh: '团队凝聚力高 - 绝佳协作窗口',
      rationale: ['Team cohesion index above 75%'],
      rationaleZh: ['团队凝聚力指数超过75%'],
      metrics: { teamCohesion: current.teamCohesion },
      trend: 'stable'
    });
  }

  // Detect divergence
  if (current.teamCohesion < 0.4) {
    events.push({
      id: `event_divergence_${Date.now()}`,
      timestamp: Date.now(),
      type: 'divergence',
      severity: 'medium',
      affectedTeams: teamCharts.map(tc => tc.teamId),
      affectedIndividuals: [],
      description: 'Low team cohesion - fragmentation risk',
      descriptionZh: '团队凝聚力低 - 分裂风险',
      rationale: ['Team cohesion index below 40%'],
      rationaleZh: ['团队凝聚力指数低于40%'],
      metrics: { teamCohesion: current.teamCohesion },
      trend: previous && current.teamCohesion < previous.teamCohesion ? 'falling' : 'stable'
    });
  }

  return events;
}

function detectThresholdEvents(
  current: MonitoringMetrics,
  previous?: MonitoringMetrics
): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];

  // Overall health threshold
  if (current.overallHealth < 0.4) {
    events.push({
      id: `event_threshold_health_${Date.now()}`,
      timestamp: Date.now(),
      type: 'threshold',
      severity: 'critical',
      affectedTeams: [],
      affectedIndividuals: [],
      description: 'Organizational health below critical threshold',
      descriptionZh: '组织健康度低于临界阈值',
      rationale: ['Overall health index below 40%'],
      rationaleZh: ['整体健康度指数低于40%'],
      metrics: { overallHealth: current.overallHealth },
      trend: 'falling'
    });
  }

  return events;
}

// ==================== ALERT SYSTEM ====================

/**
 * Generate alerts from monitoring events
 */
export function generateAlerts(events: MonitoringEvent[]): Alert[] {
  const alerts: Alert[] = [];

  for (const event of events) {
    const alertLevel = mapSeverityToAlertLevel(event.severity);

    // Only generate alerts for medium severity and above
    if (event.severity === 'low' && event.type !== 'opportunity') {
      continue;
    }

    alerts.push({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      level: alertLevel,
      message: event.description,
      messageZh: event.descriptionZh,
      affectedTeams: event.affectedTeams,
      affectedIndividuals: event.affectedIndividuals,
      recommendedActions: generateActionRecommendations(event),
      recommendedActionsZh: generateActionRecommendationsZh(event),
      sourceEventId: event.id,
      acknowledged: false,
      resolved: false,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  return alerts;
}

function mapSeverityToAlertLevel(severity: string): AlertLevel {
  switch (severity) {
    case 'critical': return 'emergency';
    case 'high': return 'critical';
    case 'medium': return 'warning';
    default: return 'info';
  }
}

function generateActionRecommendations(event: MonitoringEvent): string[] {
  const recommendations: string[] = [];

  switch (event.type) {
    case 'pressure':
      recommendations.push('Increase support resources for affected teams');
      recommendations.push('Delay non-essential high-pressure decisions');
      recommendations.push('Schedule wellness check-ins');
      break;

    case 'opportunity':
      recommendations.push('Schedule strategic planning sessions');
      recommendations.push('Identify quick wins to leverage');
      recommendations.push('Allocate resources to capitalize on window');
      break;

    case 'conflict':
      recommendations.push('Arrange mediation sessions');
      recommendations.push('Review communication protocols');
      recommendations.push('Consider team restructuring');
      break;

    case 'transition':
      recommendations.push('Prepare contingency plans');
      recommendations.push('Brief leadership on upcoming changes');
      recommendations.push('Increase monitoring frequency');
      break;

    case 'activation':
      if (event.description.includes('Seven Killings')) {
        recommendations.push('Provide additional support structures');
        recommendations.push('Avoid major confrontations');
      } else if (event.description.includes('Nobleman')) {
        recommendations.push('Schedule networking events');
        recommendations.push('Pursue partnership opportunities');
      }
      break;

    case 'threshold':
      recommendations.push('Convene emergency leadership meeting');
      recommendations.push('Implement crisis protocols');
      recommendations.push('Seek external consultation');
      break;
  }

  return recommendations;
}

function generateActionRecommendationsZh(event: MonitoringEvent): string[] {
  const recommendations: string[] = [];

  switch (event.type) {
    case 'pressure':
      recommendations.push('增加对受影响团队的支持资源');
      recommendations.push('推迟非必要的高压决策');
      recommendations.push('安排健康检查');
      break;

    case 'opportunity':
      recommendations.push('安排战略规划会议');
      recommendations.push('识别可利用的快速胜利');
      recommendations.push('分配资源以抓住窗口');
      break;

    case 'conflict':
      recommendations.push('安排调解会议');
      recommendations.push('审查沟通协议');
      recommendations.push('考虑团队重组');
      break;

    case 'transition':
      recommendations.push('准备应急计划');
      recommendations.push('向领导层简报即将到来的变化');
      recommendations.push('增加监控频率');
      break;

    case 'activation':
      if (event.description.includes('七杀')) {
        recommendations.push('提供额外的支持结构');
        recommendations.push('避免重大对抗');
      } else if (event.description.includes('贵人')) {
        recommendations.push('安排社交活动');
        recommendations.push('寻求合作机会');
      }
      break;

    case 'threshold':
      recommendations.push('召开紧急领导层会议');
      recommendations.push('实施危机协议');
      recommendations.push('寻求外部咨询');
      break;
  }

  return recommendations;
}

// ==================== STRATEGIC RECOMMENDATION ENGINE ====================

/**
 * Generate strategic recommendations from events and analysis
 */
export function generateStrategicRecommendations(
  events: MonitoringEvent[],
  insights: OrgInsight[],
  crossTeamAnalysis: CrossTeamAnalysis[]
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];

  // 1. Leadership recommendations
  recommendations.push(...generateLeadershipRecommendations(events, insights));

  // 2. Team recommendations
  recommendations.push(...generateTeamRecommendations(crossTeamAnalysis));

  // 3. Timing recommendations
  recommendations.push(...generateTimingRecommendations(events));

  // 4. Risk mitigation recommendations
  recommendations.push(...generateRiskMitigationRecommendations(events, insights));

  // Sort by priority and impact
  recommendations.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.impactScore - a.impactScore;
  });

  return recommendations;
}

function generateLeadershipRecommendations(
  events: MonitoringEvent[],
  insights: OrgInsight[]
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];

  const leadershipInsights = insights.filter(i =>
    i.affectedIndividuals.some(id => id.includes('leadership'))
  );

  if (leadershipInsights.length > 0) {
    recommendations.push({
      id: `rec_leadership_${Date.now()}`,
      timestamp: Date.now(),
      category: 'leadership',
      priority: 'high',
      recommendation: 'Conduct leadership team alignment session',
      recommendationZh: '进行领导团队协调会议',
      rationale: ['Leadership patterns detected requiring attention'],
      rationaleZh: ['检测到需要关注的领导模式'],
      impactScore: 0.8,
      confidenceScore: 0.75,
      implementationSteps: [
        'Schedule half-day offsite',
        'Prepare individual leadership profiles',
        'Facilitate element-based team building',
        'Create alignment action plan'
      ],
      implementationStepsZh: [
        '安排半天场外会议',
        '准备个人领导力档案',
        '促进基于元素的团队建设',
        '创建协调行动计划'
      ],
      dependencies: ['Executive buy-in', 'Scheduling availability'],
      risks: ['Resistance to unconventional approach'],
      risksZh: ['对非传统方法的抵制']
    });
  }

  return recommendations;
}

function generateTeamRecommendations(
  crossTeamAnalysis: CrossTeamAnalysis[]
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];

  // Find low compatibility pairs
  const lowCompatibilityPairs = crossTeamAnalysis.filter(ca => ca.compatibilityScore < 0.5);

  if (lowCompatibilityPairs.length > 0) {
    const pair = lowCompatibilityPairs[0];
    recommendations.push({
      id: `rec_team_compatibility_${Date.now()}`,
      timestamp: Date.now(),
      category: 'team',
      priority: 'medium',
      recommendation: `Implement bridge-building program between ${pair.teamAName} and ${pair.teamBName}`,
      recommendationZh: `在${pair.teamAName}和${pair.teamBName}之间实施桥梁建设计划`,
      rationale: pair.conflictPatterns,
      rationaleZh: pair.conflictPatternsZh,
      impactScore: 0.7,
      confidenceScore: 0.7,
      implementationSteps: [
        'Identify bridge individuals with complementary elements',
        'Create joint project opportunities',
        'Schedule cross-team social events',
        'Monitor collaboration metrics'
      ],
      implementationStepsZh: [
        '识别具有互补元素的桥梁人物',
        '创建联合项目机会',
        '安排跨团队社交活动',
        '监控协作指标'
      ],
      dependencies: ['Team leader buy-in'],
      risks: ['Initial resistance', 'Resource allocation challenges'],
      risksZh: ['初始阻力', '资源分配挑战']
    });
  }

  // Find high synergy pairs
  const highSynergyPairs = crossTeamAnalysis.filter(ca => ca.compatibilityScore > 0.8);

  if (highSynergyPairs.length > 0) {
    const pair = highSynergyPairs[0];
    recommendations.push({
      id: `rec_team_synergy_${Date.now()}`,
      timestamp: Date.now(),
      category: 'team',
      priority: 'low',
      recommendation: `Leverage natural synergy between ${pair.teamAName} and ${pair.teamBName} for strategic initiatives`,
      recommendationZh: `利用${pair.teamAName}和${pair.teamBName}之间的自然协同效应进行战略举措`,
      rationale: pair.sharedPatterns,
      rationaleZh: pair.sharedPatternsZh,
      impactScore: 0.6,
      confidenceScore: 0.8,
      implementationSteps: [
        'Assign joint strategic project',
        'Create combined innovation team',
        'Share best practices between teams'
      ],
      implementationStepsZh: [
        '分配联合战略项目',
        '创建联合创新团队',
        '在团队之间分享最佳实践'
      ],
      dependencies: [],
      risks: [],
      risksZh: []
    });
  }

  return recommendations;
}

function generateTimingRecommendations(events: MonitoringEvent[]): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];

  const pressureEvents = events.filter(e => e.type === 'pressure' && e.severity !== 'low');
  const opportunityEvents = events.filter(e => e.type === 'opportunity');

  if (pressureEvents.length > 0) {
    recommendations.push({
      id: `rec_timing_pressure_${Date.now()}`,
      timestamp: Date.now(),
      category: 'timing',
      priority: 'high',
      recommendation: 'Delay major restructuring and confrontational decisions',
      recommendationZh: '推迟重大重组和对抗性决策',
      rationale: ['Pressure events detected', 'Unfavorable timing for major changes'],
      rationaleZh: ['检测到压力事件', '重大变化的时机不利'],
      impactScore: 0.85,
      confidenceScore: 0.8,
      implementationSteps: [
        'Review upcoming decision calendar',
        'Identify deferrable items',
        'Communicate timing rationale to stakeholders',
        'Set review date for deferred items'
      ],
      implementationStepsZh: [
        '审查即将到来的决策日历',
        '识别可推迟的项目',
        '向利益相关者传达时机理由',
        '为推迟项目设定审查日期'
      ],
      dependencies: [],
      risks: ['Perceived inaction'],
      risksZh: ['被认为不作为']
    });
  }

  if (opportunityEvents.length > 0) {
    recommendations.push({
      id: `rec_timing_opportunity_${Date.now()}`,
      timestamp: Date.now(),
      category: 'timing',
      priority: 'medium',
      recommendation: 'Accelerate business development and partnership initiatives',
      recommendationZh: '加速业务发展和合作伙伴关系倡议',
      rationale: ['Opportunity window detected', 'Favorable timing for expansion'],
      rationaleZh: ['检测到机会窗口', '扩展的有利时机'],
      impactScore: 0.75,
      confidenceScore: 0.7,
      implementationSteps: [
        'Identify priority opportunities',
        'Allocate additional resources',
        'Fast-track decision processes',
        'Monitor window duration'
      ],
      implementationStepsZh: [
        '识别优先机会',
        '分配额外资源',
        '加快决策流程',
        '监控窗口持续时间'
      ],
      dependencies: ['Budget availability'],
      risks: ['Overextension'],
      risksZh: ['过度扩张']
    });
  }

  return recommendations;
}

function generateRiskMitigationRecommendations(
  events: MonitoringEvent[],
  insights: OrgInsight[]
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];

  const highRiskInsights = insights.filter(i => i.severity === 'high' || i.severity === 'critical');

  if (highRiskInsights.length > 0) {
    recommendations.push({
      id: `rec_risk_mitigation_${Date.now()}`,
      timestamp: Date.now(),
      category: 'risk_mitigation',
      priority: 'urgent',
      recommendation: 'Implement proactive risk mitigation protocols',
      recommendationZh: '实施主动风险缓解协议',
      rationale: highRiskInsights.map(i => i.description),
      rationaleZh: highRiskInsights.map(i => i.descriptionZh),
      impactScore: 0.9,
      confidenceScore: 0.85,
      implementationSteps: [
        'Convene risk assessment meeting',
        'Document specific risk scenarios',
        'Assign mitigation owners',
        'Create contingency playbooks',
        'Increase monitoring frequency'
      ],
      implementationStepsZh: [
        '召开风险评估会议',
        '记录具体风险场景',
        '分配缓解负责人',
        '创建应急手册',
        '增加监控频率'
      ],
      dependencies: ['Leadership commitment'],
      risks: ['Resource diversion'],
      risksZh: ['资源转移']
    });
  }

  return recommendations;
}

// ==================== AUTONOMOUS AGENT ====================

/**
 * Organizational Metaphysics Intelligence Agent
 */
export class OrgMetaphysicsAgent {
  private state: AgentState;
  private config: AgentConfig;
  private eventStore: MonitoringEvent[] = [];
  private alertStore: Alert[] = [];
  private recommendationStore: StrategicRecommendation[] = [];
  private metricsHistory: MonitoringMetrics[] = [];
  private cycleTimer?: ReturnType<typeof setTimeout>;

  constructor(organizationId: string, config?: Partial<AgentConfig>) {
    this.config = {
      cycleIntervalMs: 86400000, // 24 hours default
      maxEventsPerCycle: 100,
      alertThresholds: {
        info: 0.3,
        warning: 0.5,
        critical: 0.7,
        emergency: 0.9
      },
      enableLearning: true,
      enableAutomatedActions: false,
      notificationChannels: ['email', 'dashboard'],
      ...config
    };

    this.state = {
      id: `agent_${Date.now()}`,
      organizationId,
      status: 'idle',
      lastCycleAt: 0,
      nextCycleAt: Date.now() + this.config.cycleIntervalMs,
      cycleInterval: this.config.cycleIntervalMs,
      totalCycles: 0,
      eventsDetected: 0,
      alertsGenerated: 0,
      recommendationsGenerated: 0,
      modelVersion: '1.0.0',
      learningEnabled: this.config.enableLearning
    };
  }

  /**
   * Start the autonomous agent
   */
  start(): void {
    if (this.state.status === 'running') return;

    this.state.status = 'running';
    this.scheduleCycle();
  }

  /**
   * Pause the agent
   */
  pause(): void {
    this.state.status = 'paused';
    if (this.cycleTimer) {
      clearTimeout(this.cycleTimer);
    }
  }

  /**
   * Resume the agent
   */
  resume(): void {
    if (this.state.status === 'paused') {
      this.state.status = 'running';
      this.scheduleCycle();
    }
  }

  /**
   * Stop the agent
   */
  stop(): void {
    this.state.status = 'idle';
    if (this.cycleTimer) {
      clearTimeout(this.cycleTimer);
    }
  }

  /**
   * Run a monitoring cycle
   */
  async runCycle(teamCharts: TeamCharts[]): Promise<{
    events: MonitoringEvent[];
    alerts: Alert[];
    recommendations: StrategicRecommendation[];
    metrics: MonitoringMetrics;
  }> {
    this.state.lastCycleAt = Date.now();
    this.state.nextCycleAt = Date.now() + this.config.cycleIntervalMs;
    this.state.totalCycles++;

    // Get previous metrics for comparison
    const previousMetrics = this.metricsHistory[this.metricsHistory.length - 1];

    // 1. Detect monitoring events
    const events = detectMonitoringEvents(teamCharts, previousMetrics);
    this.eventStore.push(...events.slice(0, this.config.maxEventsPerCycle));
    this.state.eventsDetected += events.length;

    // 2. Generate alerts
    const alerts = generateAlerts(events);
    this.alertStore.push(...alerts);
    this.state.alertsGenerated += alerts.length;

    // 3. Generate insights for recommendations
    const insights = generateOrgInsights(teamCharts);
    const crossTeamAnalysis = analyzeCrossTeams(teamCharts);

    // 4. Generate strategic recommendations
    const recommendations = generateStrategicRecommendations(events, insights, crossTeamAnalysis);
    this.recommendationStore.push(...recommendations);
    this.state.recommendationsGenerated += recommendations.length;

    // 5. Calculate and store metrics
    const metrics = calculateMonitoringMetrics(teamCharts);
    this.metricsHistory.push(metrics);

    // Keep history limited
    if (this.metricsHistory.length > 365) {
      this.metricsHistory = this.metricsHistory.slice(-365);
    }

    // 6. Send notifications if enabled
    if (alerts.length > 0) {
      this.notifyTeams(alerts);
    }

    return { events, alerts, recommendations, metrics };
  }

  /**
   * Schedule next cycle
   */
  private scheduleCycle(): void {
    this.cycleTimer = setTimeout(() => {
      if (this.state.status === 'running') {
        // Note: In production, this would fetch fresh data
        this.scheduleCycle();
      }
    }, this.config.cycleIntervalMs);
  }

  /**
   * Send notifications
   */
  private notifyTeams(alerts: Alert[]): void {
    // In production, this would send actual notifications
    console.log(`[Agent] ${alerts.length} alerts generated`);
  }

  /**
   * Get agent state
   */
  getState(): AgentState {
    return { ...this.state };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 50): MonitoringEvent[] {
    return this.eventStore.slice(-limit);
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alertStore.filter(a => !a.resolved && (!a.expiresAt || a.expiresAt > Date.now()));
  }

  /**
   * Get recent recommendations
   */
  getRecommendations(limit: number = 20): StrategicRecommendation[] {
    return this.recommendationStore.slice(-limit);
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(days: number = 30): MonitoringMetrics[] {
    return this.metricsHistory.slice(-days);
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string, userId: string): void {
    const alert = this.alertStore.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = Date.now();
    }
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string, userId: string): void {
    const alert = this.alertStore.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedBy = userId;
      alert.resolvedAt = Date.now();
    }
  }
}

// ==================== EXPORTS ====================

export {
  detectMonitoringEvents,
  calculateMonitoringMetrics,
  generateAlerts,
  generateStrategicRecommendations,
  OrgMetaphysicsAgent
};
