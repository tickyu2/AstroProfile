/**
 * ============================================
 * PRO REPORT DESIGNER 10.0
 * Strategic Metaphysics Super-Intelligence
 *
 * Features:
 * - Scenario simulation engine
 * - Counterfactual timeline generation
 * - Strategic metaphysics modeling
 * - Decision stress-testing
 * - Optimal timing path recommendations
 * - Branching timeline visualization
 * ============================================
 */

import {
  type TeamCharts,
  type OrgInsight,
  generateOrgInsights,
  calculateElementDistribution
} from './reportDesigner8';

import {
  type MonitoringEvent,
  type MonitoringMetrics,
  detectMonitoringEvents,
  calculateMonitoringMetrics
} from './reportDesigner9';

// ==================== TYPES ====================

export interface ScenarioInput {
  id: string;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  type: ScenarioType;
  changes: ScenarioChange[];
  targetDate?: Date;
}

export type ScenarioType =
  | 'leadership_change'
  | 'team_restructure'
  | 'merger'
  | 'timing_shift'
  | 'hiring'
  | 'project_launch'
  | 'strategic_pivot'
  | 'custom';

export interface ScenarioChange {
  target: 'team' | 'individual' | 'organization' | 'timing';
  action: 'add' | 'remove' | 'modify' | 'merge' | 'split' | 'delay' | 'accelerate';
  targetId: string;
  parameters: Record<string, any>;
}

export interface ScenarioOutcome {
  id: string;
  scenarioId: string;
  label: string;
  labelZh: string;
  projectedEvents: MonitoringEvent[];
  projectedRisks: ProjectedRisk[];
  projectedOpportunities: ProjectedOpportunity[];
  timeline: CounterfactualTimeline;
  metrics: ScenarioMetrics;
  rationale: string[];
  rationaleZh: string[];
  confidence: number;
  generatedAt: Date;
}

export interface ProjectedRisk {
  id: string;
  category: string;
  description: string;
  descriptionZh: string;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategies: string[];
  mitigationStrategiesZh: string[];
}

export interface ProjectedOpportunity {
  id: string;
  category: string;
  description: string;
  descriptionZh: string;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'transformative';
  captureStrategies: string[];
  captureStrategiesZh: string[];
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  type: string;
  description: string;
  descriptionZh: string;
  impact: number;
  isPositive: boolean;
}

export interface CounterfactualTimeline {
  id: string;
  baseline: TimelineEvent[];
  alternative: TimelineEvent[];
  divergencePoint: number;
  convergencePoint?: number;
  netImpact: number;
  divergenceReason: string;
  divergenceReasonZh: string;
}

export interface ScenarioMetrics {
  pressureIndexDelta: number;
  opportunityIndexDelta: number;
  conflictRiskDelta: number;
  teamCohesionDelta: number;
  overallHealthDelta: number;
  projectedStability: number;
}

export interface StrategicModel {
  id: string;
  label: string;
  labelZh: string;
  optimalPaths: StrategicPath[];
  riskPaths: StrategicPath[];
  opportunityWindows: OpportunityWindow[];
  recommendedActions: StrategicAction[];
  rationale: string[];
  rationaleZh: string[];
  confidence: number;
  generatedAt: Date;
}

export interface StrategicPath {
  id: string;
  label: string;
  labelZh: string;
  steps: string[];
  stepsZh: string[];
  probability: number;
  impact: number;
  timingRequirements: string[];
}

export interface OpportunityWindow {
  id: string;
  theme: string;
  themeZh: string;
  start: Date;
  end: Date;
  strength: number;
  actions: string[];
  actionsZh: string[];
}

export interface StrategicAction {
  id: string;
  action: string;
  actionZh: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timing: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  dependencies: string[];
  expectedOutcome: string;
  expectedOutcomeZh: string;
}

// ==================== SCENARIO SIMULATION ENGINE ====================

/**
 * Run a scenario simulation
 */
export function runScenario(
  baselineState: TeamCharts[],
  scenario: ScenarioInput
): ScenarioOutcome {
  // Clone and modify state
  const modifiedState = applyScenarioChanges(baselineState, scenario.changes);

  // Run analysis on both states
  const baselineEvents = detectMonitoringEvents(baselineState);
  const baselineMetrics = calculateMonitoringMetrics(baselineState);

  const scenarioEvents = detectMonitoringEvents(modifiedState);
  const scenarioMetrics = calculateMonitoringMetrics(modifiedState);

  // Build counterfactual timeline
  const timeline = buildCounterfactualTimeline(baselineEvents, scenarioEvents, scenario);

  // Extract risks and opportunities
  const risks = extractProjectedRisks(scenarioEvents, baselineEvents);
  const opportunities = extractProjectedOpportunities(scenarioEvents, baselineEvents);

  // Calculate metrics delta
  const metricsDelta = calculateMetricsDelta(baselineMetrics, scenarioMetrics);

  // Build rationale
  const { rationale, rationaleZh } = buildScenarioRationale(scenario, timeline, metricsDelta);

  // Calculate confidence
  const confidence = calculateScenarioConfidence(scenario, metricsDelta, timeline);

  return {
    id: `outcome_${Date.now()}`,
    scenarioId: scenario.id,
    label: scenario.label,
    labelZh: scenario.labelZh,
    projectedEvents: scenarioEvents,
    projectedRisks: risks,
    projectedOpportunities: opportunities,
    timeline,
    metrics: metricsDelta,
    rationale,
    rationaleZh,
    confidence,
    generatedAt: new Date()
  };
}

/**
 * Apply scenario changes to create modified state
 */
function applyScenarioChanges(
  state: TeamCharts[],
  changes: ScenarioChange[]
): TeamCharts[] {
  // Deep clone
  let modifiedState = JSON.parse(JSON.stringify(state)) as TeamCharts[];

  for (const change of changes) {
    switch (change.action) {
      case 'add':
        modifiedState = applyAddChange(modifiedState, change);
        break;
      case 'remove':
        modifiedState = applyRemoveChange(modifiedState, change);
        break;
      case 'modify':
        modifiedState = applyModifyChange(modifiedState, change);
        break;
      case 'merge':
        modifiedState = applyMergeChange(modifiedState, change);
        break;
      case 'split':
        modifiedState = applySplitChange(modifiedState, change);
        break;
      case 'delay':
      case 'accelerate':
        modifiedState = applyTimingChange(modifiedState, change);
        break;
    }
  }

  return modifiedState;
}

function applyAddChange(state: TeamCharts[], change: ScenarioChange): TeamCharts[] {
  if (change.target === 'team') {
    const newTeam: TeamCharts = {
      teamId: change.parameters.teamId || `team_${Date.now()}`,
      teamName: change.parameters.teamName || 'New Team',
      teamNameZh: change.parameters.teamNameZh || '新团队',
      charts: change.parameters.charts || [],
      dominantElement: change.parameters.dominantElement || 'Wood',
      elementDistribution: change.parameters.elementDistribution || { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 }
    };
    return [...state, newTeam];
  }

  if (change.target === 'individual') {
    const teamIndex = state.findIndex(t => t.teamId === change.targetId);
    if (teamIndex >= 0) {
      state[teamIndex].charts.push(change.parameters.chart);
      // Recalculate element distribution
      state[teamIndex].elementDistribution = calculateElementDistribution(state[teamIndex].charts);
    }
  }

  return state;
}

function applyRemoveChange(state: TeamCharts[], change: ScenarioChange): TeamCharts[] {
  if (change.target === 'team') {
    return state.filter(t => t.teamId !== change.targetId);
  }

  if (change.target === 'individual') {
    const teamIndex = state.findIndex(t => t.teamId === change.parameters.teamId);
    if (teamIndex >= 0) {
      state[teamIndex].charts = state[teamIndex].charts.filter(c => c.id !== change.targetId);
      state[teamIndex].elementDistribution = calculateElementDistribution(state[teamIndex].charts);
    }
  }

  return state;
}

function applyModifyChange(state: TeamCharts[], change: ScenarioChange): TeamCharts[] {
  if (change.target === 'individual') {
    for (const team of state) {
      const chartIndex = team.charts.findIndex(c => c.id === change.targetId);
      if (chartIndex >= 0) {
        team.charts[chartIndex] = {
          ...team.charts[chartIndex],
          ...change.parameters
        };
        team.elementDistribution = calculateElementDistribution(team.charts);
        break;
      }
    }
  }

  return state;
}

function applyMergeChange(state: TeamCharts[], change: ScenarioChange): TeamCharts[] {
  const teamAIndex = state.findIndex(t => t.teamId === change.parameters.teamAId);
  const teamBIndex = state.findIndex(t => t.teamId === change.parameters.teamBId);

  if (teamAIndex >= 0 && teamBIndex >= 0) {
    const mergedTeam: TeamCharts = {
      teamId: `merged_${Date.now()}`,
      teamName: `${state[teamAIndex].teamName} + ${state[teamBIndex].teamName}`,
      teamNameZh: `${state[teamAIndex].teamNameZh} + ${state[teamBIndex].teamNameZh}`,
      charts: [...state[teamAIndex].charts, ...state[teamBIndex].charts],
      dominantElement: 'Wood',
      elementDistribution: { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 }
    };
    mergedTeam.elementDistribution = calculateElementDistribution(mergedTeam.charts);

    // Remove original teams and add merged
    return state.filter((_, i) => i !== teamAIndex && i !== teamBIndex).concat(mergedTeam);
  }

  return state;
}

function applySplitChange(state: TeamCharts[], change: ScenarioChange): TeamCharts[] {
  const teamIndex = state.findIndex(t => t.teamId === change.targetId);

  if (teamIndex >= 0) {
    const team = state[teamIndex];
    const midpoint = Math.floor(team.charts.length / 2);

    const teamA: TeamCharts = {
      teamId: `${team.teamId}_a`,
      teamName: `${team.teamName} A`,
      teamNameZh: `${team.teamNameZh} A`,
      charts: team.charts.slice(0, midpoint),
      dominantElement: 'Wood',
      elementDistribution: { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 }
    };
    teamA.elementDistribution = calculateElementDistribution(teamA.charts);

    const teamB: TeamCharts = {
      teamId: `${team.teamId}_b`,
      teamName: `${team.teamName} B`,
      teamNameZh: `${team.teamNameZh} B`,
      charts: team.charts.slice(midpoint),
      dominantElement: 'Wood',
      elementDistribution: { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 }
    };
    teamB.elementDistribution = calculateElementDistribution(teamB.charts);

    return state.filter((_, i) => i !== teamIndex).concat(teamA, teamB);
  }

  return state;
}

function applyTimingChange(state: TeamCharts[], change: ScenarioChange): TeamCharts[] {
  // Modify luck pillar timing for affected individuals
  const delta = change.action === 'delay' ? 1 : -1;

  for (const team of state) {
    for (const chart of team.charts) {
      if (chart.id === change.targetId || change.target === 'organization') {
        chart.currentLuckPillar.startAge += delta;
        chart.currentLuckPillar.endAge += delta;
      }
    }
  }

  return state;
}

// ==================== COUNTERFACTUAL TIMELINE ENGINE ====================

/**
 * Build counterfactual timeline comparing baseline and alternative
 */
export function buildCounterfactualTimeline(
  baselineEvents: MonitoringEvent[],
  alternativeEvents: MonitoringEvent[],
  scenario: ScenarioInput
): CounterfactualTimeline {
  // Convert events to timeline events
  const baselineTimeline = eventsToTimeline(baselineEvents);
  const alternativeTimeline = eventsToTimeline(alternativeEvents);

  // Find divergence point
  const divergencePoint = findDivergencePoint(baselineTimeline, alternativeTimeline);

  // Find convergence point (if any)
  const convergencePoint = findConvergencePoint(baselineTimeline, alternativeTimeline);

  // Calculate net impact
  const baselineImpact = baselineTimeline.reduce((sum, e) => sum + (e.isPositive ? e.impact : -e.impact), 0);
  const alternativeImpact = alternativeTimeline.reduce((sum, e) => sum + (e.isPositive ? e.impact : -e.impact), 0);
  const netImpact = alternativeImpact - baselineImpact;

  return {
    id: `timeline_${Date.now()}`,
    baseline: baselineTimeline,
    alternative: alternativeTimeline,
    divergencePoint,
    convergencePoint,
    netImpact,
    divergenceReason: `Scenario: ${scenario.label}`,
    divergenceReasonZh: `场景: ${scenario.labelZh}`
  };
}

function eventsToTimeline(events: MonitoringEvent[]): TimelineEvent[] {
  return events.map(e => ({
    id: e.id,
    timestamp: e.timestamp,
    type: e.type,
    description: e.description,
    descriptionZh: e.descriptionZh,
    impact: e.severity === 'critical' ? 1 : e.severity === 'high' ? 0.7 : e.severity === 'medium' ? 0.4 : 0.2,
    isPositive: e.type === 'opportunity' || e.type === 'convergence'
  }));
}

function findDivergencePoint(baseline: TimelineEvent[], alternative: TimelineEvent[]): number {
  // Find first point where timelines differ significantly
  const minLength = Math.min(baseline.length, alternative.length);

  for (let i = 0; i < minLength; i++) {
    if (baseline[i].type !== alternative[i].type) {
      return baseline[i].timestamp;
    }
  }

  return Date.now();
}

function findConvergencePoint(baseline: TimelineEvent[], alternative: TimelineEvent[]): number | undefined {
  // Check if timelines converge (become similar again)
  const baselineTypes = baseline.slice(-3).map(e => e.type);
  const alternativeTypes = alternative.slice(-3).map(e => e.type);

  const similar = baselineTypes.filter((t, i) => t === alternativeTypes[i]).length >= 2;

  if (similar && baseline.length > 0) {
    return baseline[baseline.length - 1].timestamp;
  }

  return undefined;
}

// ==================== RISK/OPPORTUNITY EXTRACTION ====================

function extractProjectedRisks(
  scenarioEvents: MonitoringEvent[],
  baselineEvents: MonitoringEvent[]
): ProjectedRisk[] {
  const risks: ProjectedRisk[] = [];

  // New risks in scenario
  const newRiskEvents = scenarioEvents.filter(e =>
    (e.type === 'pressure' || e.type === 'conflict' || e.type === 'threshold') &&
    !baselineEvents.some(b => b.type === e.type && b.severity === e.severity)
  );

  for (const event of newRiskEvents) {
    risks.push({
      id: `risk_${event.id}`,
      category: event.type,
      description: event.description,
      descriptionZh: event.descriptionZh,
      probability: event.severity === 'critical' ? 0.8 : event.severity === 'high' ? 0.6 : 0.4,
      impact: event.severity as 'low' | 'medium' | 'high' | 'critical',
      mitigationStrategies: generateMitigationStrategies(event),
      mitigationStrategiesZh: generateMitigationStrategiesZh(event)
    });
  }

  return risks;
}

function extractProjectedOpportunities(
  scenarioEvents: MonitoringEvent[],
  baselineEvents: MonitoringEvent[]
): ProjectedOpportunity[] {
  const opportunities: ProjectedOpportunity[] = [];

  // New opportunities in scenario
  const newOpportunityEvents = scenarioEvents.filter(e =>
    (e.type === 'opportunity' || e.type === 'convergence') &&
    !baselineEvents.some(b => b.type === e.type)
  );

  for (const event of newOpportunityEvents) {
    opportunities.push({
      id: `opp_${event.id}`,
      category: event.type,
      description: event.description,
      descriptionZh: event.descriptionZh,
      probability: 0.6,
      impact: 'high',
      captureStrategies: generateCaptureStrategies(event),
      captureStrategiesZh: generateCaptureStrategiesZh(event)
    });
  }

  return opportunities;
}

function generateMitigationStrategies(event: MonitoringEvent): string[] {
  const strategies: string[] = [];

  switch (event.type) {
    case 'pressure':
      strategies.push('Increase support resources');
      strategies.push('Delay non-essential high-pressure decisions');
      strategies.push('Implement stress management protocols');
      break;
    case 'conflict':
      strategies.push('Arrange mediation sessions');
      strategies.push('Review communication protocols');
      strategies.push('Consider team restructuring');
      break;
    case 'threshold':
      strategies.push('Convene emergency leadership meeting');
      strategies.push('Implement crisis protocols');
      strategies.push('Seek external consultation');
      break;
  }

  return strategies;
}

function generateMitigationStrategiesZh(event: MonitoringEvent): string[] {
  const strategies: string[] = [];

  switch (event.type) {
    case 'pressure':
      strategies.push('增加支持资源');
      strategies.push('推迟非必要的高压决策');
      strategies.push('实施压力管理协议');
      break;
    case 'conflict':
      strategies.push('安排调解会议');
      strategies.push('审查沟通协议');
      strategies.push('考虑团队重组');
      break;
    case 'threshold':
      strategies.push('召开紧急领导层会议');
      strategies.push('实施危机协议');
      strategies.push('寻求外部咨询');
      break;
  }

  return strategies;
}

function generateCaptureStrategies(event: MonitoringEvent): string[] {
  return [
    'Allocate additional resources',
    'Fast-track decision processes',
    'Assign dedicated team',
    'Monitor window duration'
  ];
}

function generateCaptureStrategiesZh(event: MonitoringEvent): string[] {
  return [
    '分配额外资源',
    '加快决策流程',
    '分配专门团队',
    '监控窗口持续时间'
  ];
}

// ==================== METRICS & RATIONALE ====================

function calculateMetricsDelta(
  baseline: MonitoringMetrics,
  scenario: MonitoringMetrics
): ScenarioMetrics {
  return {
    pressureIndexDelta: scenario.pressureIndex - baseline.pressureIndex,
    opportunityIndexDelta: scenario.opportunityIndex - baseline.opportunityIndex,
    conflictRiskDelta: scenario.conflictRisk - baseline.conflictRisk,
    teamCohesionDelta: scenario.teamCohesion - baseline.teamCohesion,
    overallHealthDelta: scenario.overallHealth - baseline.overallHealth,
    projectedStability: Math.max(0, Math.min(1, 0.5 + scenario.overallHealth - scenario.conflictRisk))
  };
}

function buildScenarioRationale(
  scenario: ScenarioInput,
  timeline: CounterfactualTimeline,
  metrics: ScenarioMetrics
): { rationale: string[]; rationaleZh: string[] } {
  const rationale: string[] = [];
  const rationaleZh: string[] = [];

  // Overall impact
  if (timeline.netImpact > 0) {
    rationale.push(`Scenario produces net positive impact (+${(timeline.netImpact * 100).toFixed(0)}%)`);
    rationaleZh.push(`场景产生净正面影响 (+${(timeline.netImpact * 100).toFixed(0)}%)`);
  } else {
    rationale.push(`Scenario produces net negative impact (${(timeline.netImpact * 100).toFixed(0)}%)`);
    rationaleZh.push(`场景产生净负面影响 (${(timeline.netImpact * 100).toFixed(0)}%)`);
  }

  // Specific metrics
  if (metrics.teamCohesionDelta > 0.1) {
    rationale.push('Team cohesion improves significantly');
    rationaleZh.push('团队凝聚力显著提升');
  } else if (metrics.teamCohesionDelta < -0.1) {
    rationale.push('Team cohesion decreases - monitor closely');
    rationaleZh.push('团队凝聚力下降 - 需密切监控');
  }

  if (metrics.conflictRiskDelta > 0.1) {
    rationale.push('Conflict risk increases - mitigation recommended');
    rationaleZh.push('冲突风险增加 - 建议采取缓解措施');
  }

  if (metrics.opportunityIndexDelta > 0.1) {
    rationale.push('New opportunities emerge');
    rationaleZh.push('出现新机会');
  }

  return { rationale, rationaleZh };
}

function calculateScenarioConfidence(
  scenario: ScenarioInput,
  metrics: ScenarioMetrics,
  timeline: CounterfactualTimeline
): number {
  let confidence = 0.6;

  // More data points = higher confidence
  confidence += Math.min(timeline.baseline.length * 0.02, 0.15);

  // Stability increases confidence
  confidence += metrics.projectedStability * 0.1;

  // Fewer extreme changes = higher confidence
  if (Math.abs(metrics.overallHealthDelta) < 0.2) {
    confidence += 0.1;
  }

  return Math.min(confidence, 0.95);
}

// ==================== STRATEGIC MODELING ENGINE ====================

/**
 * Build strategic model from organizational state
 */
export function buildStrategicModel(
  teamCharts: TeamCharts[],
  timeHorizonMonths: number = 12
): StrategicModel {
  const insights = generateOrgInsights(teamCharts);
  const metrics = calculateMonitoringMetrics(teamCharts);

  // Compute organizational arcs
  const arcs = computeOrganizationalArcs(teamCharts, timeHorizonMonths);

  // Compute optimal paths
  const optimalPaths = computeOptimalPaths(arcs, metrics);

  // Compute risk paths
  const riskPaths = computeRiskPaths(arcs, metrics);

  // Compute opportunity windows
  const opportunityWindows = computeOpportunityWindows(arcs, insights);

  // Build recommended actions
  const recommendedActions = buildStrategicActions(optimalPaths, riskPaths, opportunityWindows);

  // Build rationale
  const { rationale, rationaleZh } = buildStrategicRationale(arcs, metrics);

  return {
    id: `strategy_${Date.now()}`,
    label: 'Organizational Strategic Model',
    labelZh: '组织战略模型',
    optimalPaths,
    riskPaths,
    opportunityWindows,
    recommendedActions,
    rationale,
    rationaleZh,
    confidence: calculateStrategyConfidence(metrics, optimalPaths),
    generatedAt: new Date()
  };
}

interface OrganizationalArc {
  type: 'leadership' | 'team' | 'timing' | 'elemental' | 'archetype';
  trajectory: 'ascending' | 'descending' | 'stable' | 'volatile';
  strength: number;
  peakDate?: Date;
  troughDate?: Date;
}

function computeOrganizationalArcs(
  teamCharts: TeamCharts[],
  horizonMonths: number
): OrganizationalArc[] {
  const arcs: OrganizationalArc[] = [];
  const now = new Date();

  // Leadership arc
  const leadershipCharts = teamCharts.flatMap(tc => tc.charts.filter(c => c.isLeadership));
  arcs.push({
    type: 'leadership',
    trajectory: leadershipCharts.length > 2 ? 'ascending' : 'stable',
    strength: leadershipCharts.length / 10,
    peakDate: new Date(now.getTime() + horizonMonths * 0.5 * 30 * 24 * 60 * 60 * 1000)
  });

  // Team arc
  const avgCohesion = teamCharts.length > 0 ? 0.6 : 0.5;
  arcs.push({
    type: 'team',
    trajectory: avgCohesion > 0.6 ? 'ascending' : avgCohesion < 0.4 ? 'descending' : 'stable',
    strength: avgCohesion
  });

  // Timing arc
  arcs.push({
    type: 'timing',
    trajectory: 'stable',
    strength: 0.5,
    peakDate: new Date(now.getTime() + horizonMonths * 0.75 * 30 * 24 * 60 * 60 * 1000)
  });

  return arcs;
}

function computeOptimalPaths(
  arcs: OrganizationalArc[],
  metrics: MonitoringMetrics
): StrategicPath[] {
  const paths: StrategicPath[] = [];

  // Growth path
  if (metrics.opportunityIndex > 0.5) {
    paths.push({
      id: 'path_growth',
      label: 'Accelerated Growth Path',
      labelZh: '加速增长路径',
      steps: [
        'Capitalize on current opportunity window',
        'Allocate resources to high-potential initiatives',
        'Expand team capacity strategically',
        'Monitor for overextension risks'
      ],
      stepsZh: [
        '利用当前机会窗口',
        '将资源分配给高潜力项目',
        '战略性地扩展团队能力',
        '监控过度扩张风险'
      ],
      probability: 0.7,
      impact: 0.8,
      timingRequirements: ['Next 3-6 months optimal']
    });
  }

  // Consolidation path
  if (metrics.pressureIndex > 0.5) {
    paths.push({
      id: 'path_consolidation',
      label: 'Strategic Consolidation Path',
      labelZh: '战略整合路径',
      steps: [
        'Reduce non-essential initiatives',
        'Strengthen core operations',
        'Build reserves and resilience',
        'Prepare for next expansion window'
      ],
      stepsZh: [
        '减少非必要项目',
        '加强核心运营',
        '建立储备和弹性',
        '为下一个扩张窗口做准备'
      ],
      probability: 0.8,
      impact: 0.6,
      timingRequirements: ['Immediate action recommended']
    });
  }

  return paths;
}

function computeRiskPaths(
  arcs: OrganizationalArc[],
  metrics: MonitoringMetrics
): StrategicPath[] {
  const paths: StrategicPath[] = [];

  if (metrics.conflictRisk > 0.5) {
    paths.push({
      id: 'risk_conflict',
      label: 'Conflict Escalation Risk',
      labelZh: '冲突升级风险',
      steps: [
        'Team tensions may escalate',
        'Leadership alignment required',
        'External mediation may be needed',
        'Organizational restructuring possible'
      ],
      stepsZh: [
        '团队紧张可能升级',
        '需要领导层协调',
        '可能需要外部调解',
        '可能需要组织重组'
      ],
      probability: 0.6,
      impact: -0.7,
      timingRequirements: ['Risk peaks in 2-4 months']
    });
  }

  return paths;
}

function computeOpportunityWindows(
  arcs: OrganizationalArc[],
  insights: OrgInsight[]
): OpportunityWindow[] {
  const windows: OpportunityWindow[] = [];
  const now = new Date();

  const opportunityInsights = insights.filter(i => i.isOpportunity);

  for (const insight of opportunityInsights.slice(0, 3)) {
    windows.push({
      id: `window_${insight.id}`,
      theme: insight.label,
      themeZh: insight.labelZh,
      start: now,
      end: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      strength: insight.confidence,
      actions: insight.recommendations,
      actionsZh: insight.recommendationsZh
    });
  }

  return windows;
}

function buildStrategicActions(
  optimalPaths: StrategicPath[],
  riskPaths: StrategicPath[],
  windows: OpportunityWindow[]
): StrategicAction[] {
  const actions: StrategicAction[] = [];

  // Actions from optimal paths
  for (const path of optimalPaths) {
    actions.push({
      id: `action_${path.id}`,
      action: path.steps[0],
      actionZh: path.stepsZh[0],
      priority: path.impact > 0.7 ? 'high' : 'medium',
      timing: 'short_term',
      dependencies: [],
      expectedOutcome: `Enables ${path.label}`,
      expectedOutcomeZh: `实现${path.labelZh}`
    });
  }

  // Actions for risk mitigation
  for (const risk of riskPaths) {
    actions.push({
      id: `action_mitigate_${risk.id}`,
      action: `Mitigate: ${risk.steps[0]}`,
      actionZh: `缓解: ${risk.stepsZh[0]}`,
      priority: 'high',
      timing: 'immediate',
      dependencies: [],
      expectedOutcome: 'Reduces risk probability',
      expectedOutcomeZh: '降低风险概率'
    });
  }

  // Actions for opportunity windows
  for (const window of windows) {
    if (window.actions.length > 0) {
      actions.push({
        id: `action_capture_${window.id}`,
        action: window.actions[0],
        actionZh: window.actionsZh[0],
        priority: window.strength > 0.7 ? 'high' : 'medium',
        timing: 'short_term',
        dependencies: [],
        expectedOutcome: `Captures ${window.theme}`,
        expectedOutcomeZh: `抓住${window.themeZh}`
      });
    }
  }

  return actions;
}

function buildStrategicRationale(
  arcs: OrganizationalArc[],
  metrics: MonitoringMetrics
): { rationale: string[]; rationaleZh: string[] } {
  const rationale: string[] = [];
  const rationaleZh: string[] = [];

  rationale.push(`Overall organizational health: ${(metrics.overallHealth * 100).toFixed(0)}%`);
  rationaleZh.push(`整体组织健康度: ${(metrics.overallHealth * 100).toFixed(0)}%`);

  const ascendingArcs = arcs.filter(a => a.trajectory === 'ascending');
  if (ascendingArcs.length > 0) {
    rationale.push(`${ascendingArcs.length} ascending arc(s) detected`);
    rationaleZh.push(`检测到${ascendingArcs.length}个上升趋势`);
  }

  return { rationale, rationaleZh };
}

function calculateStrategyConfidence(
  metrics: MonitoringMetrics,
  paths: StrategicPath[]
): number {
  let confidence = 0.6;

  // Health improves confidence
  confidence += metrics.overallHealth * 0.2;

  // More clear paths = higher confidence
  confidence += Math.min(paths.length * 0.05, 0.15);

  return Math.min(confidence, 0.9);
}

// ==================== MULTI-SCENARIO COMPARISON ====================

/**
 * Compare multiple scenarios
 */
export function compareScenarios(
  outcomes: ScenarioOutcome[]
): {
  bestScenario: ScenarioOutcome;
  worstScenario: ScenarioOutcome;
  ranking: Array<{ scenarioId: string; score: number }>;
} {
  // Score each scenario
  const scored = outcomes.map(o => ({
    outcome: o,
    score: calculateScenarioScore(o)
  }));

  // Sort by score
  scored.sort((a, b) => b.score - a.score);

  return {
    bestScenario: scored[0].outcome,
    worstScenario: scored[scored.length - 1].outcome,
    ranking: scored.map(s => ({ scenarioId: s.outcome.scenarioId, score: s.score }))
  };
}

function calculateScenarioScore(outcome: ScenarioOutcome): number {
  let score = 0.5;

  // Timeline net impact
  score += outcome.timeline.netImpact * 0.3;

  // Metrics deltas
  score += outcome.metrics.overallHealthDelta * 0.2;
  score += outcome.metrics.opportunityIndexDelta * 0.15;
  score -= outcome.metrics.conflictRiskDelta * 0.15;
  score += outcome.metrics.teamCohesionDelta * 0.1;

  // Risks vs opportunities
  score -= outcome.projectedRisks.length * 0.05;
  score += outcome.projectedOpportunities.length * 0.05;

  return Math.max(0, Math.min(1, score));
}

// ==================== EXPORTS ====================

export {
  runScenario,
  buildCounterfactualTimeline,
  buildStrategicModel,
  compareScenarios
};
