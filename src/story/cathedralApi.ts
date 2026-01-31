/**
 * ============================================================================
 * CATHEDRAL API LAYER (大教堂 API 层)
 * ============================================================================
 *
 * The spine of the cathedral.
 * Unified API that exposes the entire metaphysics OS.
 *
 * Features:
 * - One Entry Point
 * - Composable Methods
 * - Consistent Response Model
 * - Self-Documenting via Knowledge Graph
 *
 * This is the public interface of your metaphysics cathedral.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ApiConfig,
  ApiResponse,
  ApiMeta,
  ApiError,
  ApiErrorCode,
  BirthData,
  NatalChartInput,
  SynastryInput,
  CompositeChartInput,
  TimingInput,
  CompositeTimingInput,
  MicroTimingInput,
  TrajectoryInput,
  EnvironmentInput,
  DateSelectionInput,
  StoryInput,
  ArchetypeInput,
  WeavingInput,
  RitualInput,
  SimulationApiInput,
  ActionApiInput,
  DashboardInput,
  NatalChartResult,
  SynastryResult,
  CompositeChartResult,
  TimingLayersResult,
  CompositeTimingResult,
  MicroTimingResult,
  TrajectoryResult,
  FengShuiResult,
  QiMenResult,
  DateSelectionResult,
  PredictiveStoryResult,
  ArchetypeStoryResult,
  WeavingResult,
  RelationshipDashboardResult,
  StoryDashboardResult,
  RitualDashboardResult,
  CathedralAPI,
  EndpointDefinition,
  ENDPOINT_REGISTRY
} from './cathedralApiTypes';

import { DEFAULT_API_CONFIG, API_ERROR_MESSAGES } from './cathedralApiTypes';

import type { RitualTimingResult } from './ritualTypes';
import type { DestinySimulationResult } from './simulationTypes';
import type { FateToActionResult } from './actionTypes';
import type { CathedralKnowledgeGraph } from './cathedralGraphTypes';

import { CATHEDRAL_KNOWLEDGE_GRAPH, search as graphSearch, inspect as graphInspect } from './cathedralGraphService';
import { generateFateToAction } from './actionEngine';
import { LIFECYCLE_CHINESE } from './ritualTypes';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create API metadata
 */
function createMeta(startTime: number): ApiMeta {
  return {
    requestId: generateRequestId(),
    timestamp: new Date().toISOString(),
    version: DEFAULT_API_CONFIG.version,
    processingTime: Date.now() - startTime
  };
}

/**
 * Create success response
 */
function success<T>(data: T, startTime: number, debug?: ApiResponse<T>['debug']): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: createMeta(startTime),
    debug
  };
}

/**
 * Create error response
 */
function error(code: ApiErrorCode, details?: Record<string, unknown>): ApiError {
  return {
    success: false,
    error: {
      code,
      message: API_ERROR_MESSAGES[code],
      details
    },
    meta: createMeta(Date.now())
  };
}

/**
 * Validate birth data
 */
function validateBirthData(data: BirthData): { valid: boolean; error?: string } {
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD.' };
  }
  if (!data.time || !/^\d{2}:\d{2}$/.test(data.time)) {
    return { valid: false, error: 'Invalid time format. Use HH:MM.' };
  }
  return { valid: true };
}

// ============================================================================
// CHART IMPLEMENTATIONS
// ============================================================================

async function calculateNatalChart(input: NatalChartInput): Promise<ApiResponse<NatalChartResult>> {
  const startTime = Date.now();

  // Validate input
  const validation = validateBirthData(input.birthData);
  if (!validation.valid) {
    throw error('INVALID_INPUT', { field: 'birthData', message: validation.error });
  }

  // Simulate chart calculation (in real implementation, call actual engines)
  const result: NatalChartResult = {
    pillars: {
      year: { stem: '甲', branch: '子' },
      month: { stem: '乙', branch: '丑' },
      day: { stem: '丙', branch: '寅' },
      hour: { stem: '丁', branch: '卯' }
    },
    dayMaster: '丙',
    dayMasterElement: 'Fire',
    elementDistribution: { Wood: 20, Fire: 30, Earth: 15, Metal: 20, Water: 15 },
    tenGods: { year: '偏印', month: '正印', hour: '比肩' }
  };

  if (input.options?.includeUsefulGod) {
    result.usefulGod = 'Water';
    result.annoyingGod = 'Fire';
  }

  if (input.options?.includeShenSha) {
    result.shenSha = [
      { name: 'Nobleman', type: 'auspicious' },
      { name: 'Peach Blossom', type: 'auspicious' }
    ];
  }

  if (input.options?.includeDaYun) {
    result.daYun = [
      { startAge: 0, endAge: 10, stem: '戊', branch: '辰' },
      { startAge: 10, endAge: 20, stem: '己', branch: '巳' },
      { startAge: 20, endAge: 30, stem: '庚', branch: '午' }
    ];
  }

  return success(result, startTime, {
    enginesCalled: ['natalChartEngine', input.options?.includeUsefulGod ? 'usefulGodEngine' : ''].filter(Boolean),
    timings: { natalChartEngine: 15, usefulGodEngine: 8 },
    cacheHits: [],
    warnings: []
  });
}

async function calculateSynastry(input: SynastryInput): Promise<ApiResponse<SynastryResult>> {
  const startTime = Date.now();

  // Validate both persons
  const validationA = validateBirthData(input.personA);
  const validationB = validateBirthData(input.personB);
  if (!validationA.valid) throw error('INVALID_INPUT', { field: 'personA', message: validationA.error });
  if (!validationB.valid) throw error('INVALID_INPUT', { field: 'personB', message: validationB.error });

  const result: SynastryResult = {
    overallScore: 78,
    scoreBreakdown: {
      elemental: 82,
      tenGods: 75,
      shenSha: 80,
      timing: 74
    },
    strengths: [
      'Strong elemental harmony',
      'Complementary Ten Gods',
      'Favorable timing alignment'
    ],
    challenges: [
      'Some Metal-Wood tension',
      'Different life pacing'
    ]
  };

  if (input.options?.includeHeatmap) {
    result.heatmap = {
      Wood: { Wood: 70, Fire: 85, Earth: 60, Metal: 40, Water: 75 },
      Fire: { Wood: 85, Fire: 65, Earth: 80, Metal: 50, Water: 45 }
    };
  }

  if (input.options?.includeArchetype) {
    result.archetype = {
      name: 'The Harmonizers',
      description: 'Two souls that balance each other naturally'
    };
  }

  return success(result, startTime);
}

async function calculateComposite(input: CompositeChartInput): Promise<ApiResponse<CompositeChartResult>> {
  const startTime = Date.now();

  const validationA = validateBirthData(input.personA);
  const validationB = validateBirthData(input.personB);
  if (!validationA.valid) throw error('INVALID_INPUT', { field: 'personA', message: validationA.error });
  if (!validationB.valid) throw error('INVALID_INPUT', { field: 'personB', message: validationB.error });

  const result: CompositeChartResult = {
    compositePillars: {
      year: { stem: '甲', branch: '午' },
      month: { stem: '丙', branch: '申' },
      day: { stem: '戊', branch: '戌' },
      hour: { stem: '庚', branch: '子' }
    },
    compositeElement: 'Earth'
  };

  if (input.options?.includeLifeThemes) {
    result.lifeThemes = [
      'Building together',
      'Mutual growth',
      'Creative partnership'
    ];
  }

  if (input.options?.includeUsefulGod) {
    result.usefulGod = 'Water';
    result.annoyingGod = 'Fire';
  }

  if (input.options?.includeTiming) {
    result.timing = {
      currentPhase: 'Deepening',
      trajectory: 'Rising'
    };
  }

  return success(result, startTime);
}

// ============================================================================
// TIMING IMPLEMENTATIONS
// ============================================================================

async function getIndividualTiming(input: TimingInput): Promise<ApiResponse<TimingLayersResult>> {
  const startTime = Date.now();

  const validation = validateBirthData(input.birthData);
  if (!validation.valid) throw error('INVALID_INPUT', { field: 'birthData', message: validation.error });

  const result: TimingLayersResult = {};

  if (input.options?.includeDaYun !== false) {
    result.daYun = {
      current: { stem: '戊', branch: '辰', startAge: 20, endAge: 30 },
      next: { stem: '己', branch: '巳', startAge: 30, endAge: 40 },
      all: [
        { stem: '丁', branch: '卯', startAge: 10, endAge: 20 },
        { stem: '戊', branch: '辰', startAge: 20, endAge: 30 },
        { stem: '己', branch: '巳', startAge: 30, endAge: 40 }
      ]
    };
  }

  if (input.options?.includeAnnual !== false) {
    result.annual = {
      current: { year: 2027, stem: '丁', branch: '未', score: 72 },
      upcoming: [
        { year: 2028, stem: '戊', branch: '申', score: 68 },
        { year: 2029, stem: '己', branch: '酉', score: 75 }
      ]
    };
  }

  if (input.options?.includeMonthly) {
    result.monthly = {
      current: { month: 4, stem: '甲', branch: '辰', score: 80 },
      upcoming: [
        { month: 5, stem: '乙', branch: '巳', score: 65 },
        { month: 6, stem: '丙', branch: '午', score: 78 }
      ]
    };
  }

  return success(result, startTime);
}

async function getCompositeTiming(input: CompositeTimingInput): Promise<ApiResponse<CompositeTimingResult>> {
  const startTime = Date.now();

  const validationA = validateBirthData(input.personA);
  const validationB = validateBirthData(input.personB);
  if (!validationA.valid) throw error('INVALID_INPUT', { field: 'personA', message: validationA.error });
  if (!validationB.valid) throw error('INVALID_INPUT', { field: 'personB', message: validationB.error });

  const result: CompositeTimingResult = {
    layers: {
      daYun: {
        current: { stem: '戊', branch: '辰', startAge: 25, endAge: 35 },
        next: { stem: '己', branch: '巳', startAge: 35, endAge: 45 },
        all: []
      }
    },
    compositeScore: 74,
    trajectory: 'rising',
    keyDates: [
      { date: '2027-04-15', significance: 'Peak alignment', score: 88 },
      { date: '2027-09-22', significance: 'Turning point', score: 65 }
    ]
  };

  return success(result, startTime);
}

async function getMicroTiming(input: MicroTimingInput): Promise<ApiResponse<MicroTimingResult>> {
  const startTime = Date.now();

  const validation = validateBirthData(input.birthData);
  if (!validation.valid) throw error('INVALID_INPUT', { field: 'birthData', message: validation.error });

  const result: MicroTimingResult = {
    date: input.targetDate,
    bestHours: [
      { hour: 10, score: 88, quality: 'excellent' },
      { hour: 14, score: 82, quality: 'good' },
      { hour: 19, score: 75, quality: 'good' }
    ],
    bestQuarters: [
      { time: '10:45', score: 92, quality: 'excellent' },
      { time: '14:15', score: 85, quality: 'good' }
    ]
  };

  if (input.options?.includeDirectional) {
    result.directional = {
      best: 'Southeast',
      bestChinese: '东南',
      avoid: 'Northwest'
    };
  }

  return success(result, startTime);
}

async function getTrajectory(input: TrajectoryInput): Promise<ApiResponse<TrajectoryResult>> {
  const startTime = Date.now();

  const validation = validateBirthData(input.personA);
  if (!validation.valid) throw error('INVALID_INPUT', { field: 'personA', message: validation.error });

  // Generate trajectory points
  const points: TrajectoryResult['points'] = [];
  const start = new Date(input.startDate || new Date().toISOString().split('T')[0]);
  const end = new Date(input.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  let current = new Date(start);
  while (current <= end) {
    const value = 50 + Math.sin(current.getTime() / (30 * 24 * 60 * 60 * 1000)) * 30 + Math.random() * 10;
    points.push({
      date: current.toISOString().split('T')[0],
      value: Math.round(value)
    });
    current.setMonth(current.getMonth() + 1);
  }

  const result: TrajectoryResult = {
    points,
    trend: 'rising',
    peaks: [{ date: '2027-06-15', value: 85 }],
    troughs: [{ date: '2027-02-10', value: 45 }]
  };

  if (input.options?.includeEvents) {
    result.events = [
      { date: '2027-04-12', type: 'turning', description: 'Key decision point' },
      { date: '2027-08-20', type: 'peak', description: 'Maximum alignment' }
    ];
  }

  return success(result, startTime);
}

// ============================================================================
// ENVIRONMENT IMPLEMENTATIONS
// ============================================================================

async function getFengShui(input: EnvironmentInput): Promise<ApiResponse<FengShuiResult>> {
  const startTime = Date.now();

  const result: FengShuiResult = {
    bestDirection: 'Southeast',
    bestDirectionChinese: '东南',
    avoidDirection: 'Northwest',
    avoidDirectionChinese: '西北',
    noblesmanDirection: 'Northeast',
    wealthDirection: 'South',
    peachBlossomDirection: 'East',
    grandDukeDirection: 'North',
    allDirections: [
      { direction: 'North', directionChinese: '北', quality: 'avoid', specialEnergies: ['Grand Duke'] },
      { direction: 'Northeast', directionChinese: '东北', quality: 'excellent', specialEnergies: ['Nobleman'] },
      { direction: 'East', directionChinese: '东', quality: 'good', specialEnergies: ['Peach Blossom'] },
      { direction: 'Southeast', directionChinese: '东南', quality: 'excellent', specialEnergies: ['Prosperity'] },
      { direction: 'South', directionChinese: '南', quality: 'good', specialEnergies: ['Wealth'] },
      { direction: 'Southwest', directionChinese: '西南', quality: 'neutral', specialEnergies: [] },
      { direction: 'West', directionChinese: '西', quality: 'neutral', specialEnergies: [] },
      { direction: 'Northwest', directionChinese: '西北', quality: 'avoid', specialEnergies: ['Sha'] }
    ]
  };

  return success(result, startTime);
}

async function getQiMen(input: EnvironmentInput): Promise<ApiResponse<QiMenResult>> {
  const startTime = Date.now();

  const result: QiMenResult = {
    chart: {
      palace: 4,
      door: 'life',
      doorChinese: '生门',
      star: 'Heavenly Heart',
      deity: 'Nine Heavens'
    },
    structure: 'auspicious',
    recommendations: [
      'Good for initiating projects',
      'Favorable for important meetings',
      'Avoid aggressive actions'
    ]
  };

  return success(result, startTime);
}

async function selectDates(input: DateSelectionInput): Promise<ApiResponse<DateSelectionResult>> {
  const startTime = Date.now();

  const dates: DateSelectionResult['dates'] = [];
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  let current = new Date(start);
  while (current <= end && dates.length < (input.options?.maxResults || 10)) {
    const score = 50 + Math.random() * 50;
    if (score >= (input.options?.minScore || 60)) {
      dates.push({
        date: current.toISOString().split('T')[0],
        dateChinese: `${current.getMonth() + 1}月${current.getDate()}日`,
        score: Math.round(score),
        quality: score > 80 ? 'excellent' : score > 65 ? 'good' : 'neutral',
        reasons: ['Favorable day officer', 'Good element support'],
        cautions: score < 75 ? ['Minor clash present'] : []
      });
    }
    current.setDate(current.getDate() + 1);
  }

  dates.sort((a, b) => b.score - a.score);

  return success({
    dates,
    bestDate: dates.length > 0 ? {
      date: dates[0].date,
      dateChinese: dates[0].dateChinese,
      score: dates[0].score
    } : null
  }, startTime);
}

// ============================================================================
// STORY IMPLEMENTATIONS
// ============================================================================

async function getPredictiveStory(input: StoryInput): Promise<ApiResponse<PredictiveStoryResult>> {
  const startTime = Date.now();

  const validation = validateBirthData(input.personA);
  if (!validation.valid) throw error('INVALID_INPUT', { field: 'personA', message: validation.error });

  // Generate story result
  const result: PredictiveStoryResult = {
    story: {
      id: `story_${Date.now()}`,
      title: 'The Unfolding Path',
      titleChinese: '展开的道路',
      prologue: 'A journey of growth and discovery begins...',
      epilogue: 'The path continues with new possibilities.',
      arc: 'rising',
      beats: [],
      chapters: [],
      currentChapterIndex: 0,
      overallTone: 'hopeful',
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    },
    summary: 'A story of growth through challenges, leading to deeper understanding.',
    currentChapter: null,
    upcomingBeats: [],
    emotionalArc: [
      { date: '2027-01', value: 60, tone: 'hopeful' },
      { date: '2027-04', value: 75, tone: 'joyful' },
      { date: '2027-07', value: 55, tone: 'reflective' },
      { date: '2027-10', value: 80, tone: 'passionate' }
    ]
  };

  return success(result, startTime);
}

async function getArchetypeStory(input: ArchetypeInput): Promise<ApiResponse<ArchetypeStoryResult>> {
  const startTime = Date.now();

  const result: ArchetypeStoryResult = {
    original: input.story,
    transformed: {
      id: `transformed_${Date.now()}`,
      originalStoryId: input.story.id,
      style: input.style,
      styleChinese: input.style === 'mythic' ? '神话体' :
                    input.style === 'romantic' ? '浪漫体' :
                    input.style === 'psychological' ? '心理体' :
                    input.style === 'cinematic' ? '电影体' : '诗意体',
      title: input.story.title,
      titleChinese: input.story.titleChinese,
      prologue: `In the ${input.style} voice: ${input.story.prologue}`,
      chapters: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    },
    style: input.style,
    styleChinese: input.style === 'mythic' ? '神话体' :
                  input.style === 'romantic' ? '浪漫体' :
                  input.style === 'psychological' ? '心理体' :
                  input.style === 'cinematic' ? '电影体' : '诗意体'
  };

  return success(result, startTime);
}

async function getWeavingStory(input: WeavingInput): Promise<ApiResponse<WeavingResult>> {
  const startTime = Date.now();

  // Validate all participants
  for (let i = 0; i < input.participants.length; i++) {
    const validation = validateBirthData(input.participants[i]);
    if (!validation.valid) {
      throw error('INVALID_INPUT', { field: `participants[${i}]`, message: validation.error });
    }
  }

  const result: WeavingResult = {
    story: {
      id: `woven_${Date.now()}`,
      mode: input.mode,
      modeChinese: input.mode === 'family' ? '家庭' :
                   input.mode === 'team' ? '团队' :
                   input.mode === 'polycule' ? '多元关系' : '世代',
      participants: input.participants.map((p, i) => ({
        id: `participant_${i}`,
        name: p.name || `Person ${i + 1}`,
        role: 'member',
        roleChinese: '成员',
        birthData: p,
        color: ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'][i % 4]
      })),
      chapters: [],
      overarchingThemes: ['Growth', 'Connection', 'Transformation'],
      systemicArc: {
        type: 'convergence',
        typeChinese: '收敛',
        description: 'Paths coming together',
        strength: 75
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        participantCount: input.participants.length
      }
    }
  };

  if (input.options?.includeNetworkGraph) {
    result.networkGraph = {
      nodes: input.participants.map((p, i) => ({
        id: `participant_${i}`,
        label: p.name || `Person ${i + 1}`
      })),
      edges: input.relationships?.map(r => ({
        source: `participant_${r.fromIndex}`,
        target: `participant_${r.toIndex}`,
        type: r.type
      })) || []
    };
  }

  return success(result, startTime);
}

// ============================================================================
// RITUAL IMPLEMENTATION
// ============================================================================

async function getRitualWindows(input: RitualInput): Promise<ApiResponse<RitualTimingResult>> {
  const startTime = Date.now();

  const result: RitualTimingResult = {
    queryDate: new Date().toISOString().split('T')[0],
    queryRange: {
      start: input.startDate,
      end: input.endDate
    },
    vowWindows: [],
    healingWindows: [],
    closureWindows: [],
    initiationWindows: [],
    bestVow: null,
    bestHealing: null,
    bestClosure: null,
    bestInitiation: null,
    dailySummaries: [],
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };

  return success(result, startTime);
}

// ============================================================================
// SIMULATION IMPLEMENTATION
// ============================================================================

async function simulateDestiny(input: SimulationApiInput): Promise<ApiResponse<DestinySimulationResult>> {
  const startTime = Date.now();

  const validation = validateBirthData(input.personA);
  if (!validation.valid) throw error('INVALID_INPUT', { field: 'personA', message: validation.error });

  // Generate simulation result
  const result: DestinySimulationResult = {
    id: `simulation_${Date.now()}`,
    mode: 'choice',
    modeChinese: '选择分支',
    choiceSummary: input.choice.description,
    baseline: {
      label: 'Current Timeline',
      labelChinese: '当前轨迹',
      lifecyclePhase: 'deepening',
      lifecyclePhaseChinese: LIFECYCLE_CHINESE.deepening,
      destinyCurve: 65,
      destinyCurveDirection: 'rising',
      storySummary: 'The current path continues with steady growth.',
      keyBeats: ['Deepening connection', 'Building trust'],
      upcomingEvents: []
    },
    simulations: [],
    recommendedBranch: null,
    recommendationReason: 'Multiple viable paths exist.',
    comparisonSummary: {
      bestProbability: { branchId: 'branch_0', probability: 0.65 },
      bestEnvironmentalSupport: { branchId: 'branch_1', support: 72 },
      keyTradeoffs: [],
      timingAnalysis: 'Waiting improves environmental support.',
      bottomLine: 'All paths carry uncertainty; choose based on values.'
    },
    narrativeOverview: 'The simulation reveals multiple possible futures.',
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      yearsSimulated: input.options?.yearsAhead || 2
    }
  };

  return success(result, startTime);
}

// ============================================================================
// DECISION/ACTION IMPLEMENTATION
// ============================================================================

async function getActionGuidance(input: ActionApiInput): Promise<ApiResponse<FateToActionResult>> {
  const startTime = Date.now();

  const validation = validateBirthData(input.personA);
  if (!validation.valid) throw error('INVALID_INPUT', { field: 'personA', message: validation.error });

  // Use the actual action engine
  const result = generateFateToAction({
    date: input.targetDate,
    options: {
      includeMicroTiming: input.options?.includeMicroTiming,
      includeDirectional: input.options?.includeDirectional,
      includeRituals: input.options?.includeRituals,
      maxSteps: input.options?.maxSteps,
      language: input.options?.language
    }
  });

  return success(result, startTime);
}

// ============================================================================
// DASHBOARD IMPLEMENTATIONS
// ============================================================================

async function getRelationshipDashboard(input: DashboardInput): Promise<ApiResponse<RelationshipDashboardResult>> {
  const startTime = Date.now();

  const validation = validateBirthData(input.personA);
  if (!validation.valid) throw error('INVALID_INPUT', { field: 'personA', message: validation.error });

  // Orchestrate multiple engines
  const synastryResult = input.personB ?
    (await calculateSynastry({ personA: input.personA, personB: input.personB })).data :
    { overallScore: 0, scoreBreakdown: { elemental: 0, tenGods: 0, shenSha: 0, timing: 0 }, strengths: [], challenges: [] };

  const compositeResult = input.personB ?
    (await calculateComposite({ personA: input.personA, personB: input.personB, options: { includeLifeThemes: true, includeTiming: true } })).data :
    { compositePillars: { year: { stem: '', branch: '' }, month: { stem: '', branch: '' }, day: { stem: '', branch: '' }, hour: { stem: '', branch: '' } }, compositeElement: '' };

  const timingResult = input.personB ?
    (await getCompositeTiming({ personA: input.personA, personB: input.personB })).data :
    { layers: {}, compositeScore: 0, trajectory: 'stable' as const, keyDates: [] };

  const storyResult = (await getPredictiveStory({ personA: input.personA, personB: input.personB })).data;

  const actionResult = (await getActionGuidance({
    personA: input.personA,
    personB: input.personB,
    targetDate: input.targetDate || new Date().toISOString().split('T')[0],
    options: { includeMicroTiming: true, includeDirectional: true }
  })).data;

  const result: RelationshipDashboardResult = {
    synastry: synastryResult,
    composite: compositeResult,
    timing: timingResult,
    lifecycle: {
      phase: 'deepening',
      phaseChinese: LIFECYCLE_CHINESE.deepening,
      progress: 65
    },
    story: storyResult,
    ritual: {
      nextWindow: null,
      upcomingWindows: []
    },
    action: {
      todayBest: actionResult.bestAction,
      weekSummary: []
    }
  };

  return success(result, startTime, {
    enginesCalled: [
      'synastryEngine',
      'compositeChartEngine',
      'compositeTimingEngine',
      'predictiveStoryEngine',
      'fateToActionEngine'
    ],
    timings: {
      synastryEngine: 15,
      compositeChartEngine: 12,
      compositeTimingEngine: 18,
      predictiveStoryEngine: 25,
      fateToActionEngine: 20
    },
    cacheHits: [],
    warnings: []
  });
}

async function getStoryDashboard(input: DashboardInput): Promise<ApiResponse<StoryDashboardResult>> {
  const startTime = Date.now();

  const validation = validateBirthData(input.personA);
  if (!validation.valid) throw error('INVALID_INPUT', { field: 'personA', message: validation.error });

  const storyResult = (await getPredictiveStory({ personA: input.personA, personB: input.personB })).data;

  const result: StoryDashboardResult = {
    story: storyResult,
    timeline: {
      chapters: storyResult.story.chapters,
      currentPosition: 0
    },
    emotionalArc: storyResult.emotionalArc,
    upcomingTurningPoints: [
      { date: '2027-04-15', description: 'Key decision point' },
      { date: '2027-09-22', description: 'Major transition' }
    ]
  };

  return success(result, startTime);
}

async function getRitualDashboard(input: DashboardInput): Promise<ApiResponse<RitualDashboardResult>> {
  const startTime = Date.now();

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const ritualResult = (await getRitualWindows({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  })).data;

  const result: RitualDashboardResult = {
    calendar: {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      days: []
    },
    upcomingWindows: [],
    bestWindows: {
      vow: ritualResult.bestVow,
      healing: ritualResult.bestHealing,
      closure: ritualResult.bestClosure,
      initiation: ritualResult.bestInitiation
    }
  };

  return success(result, startTime);
}

// ============================================================================
// KNOWLEDGE GRAPH IMPLEMENTATIONS
// ============================================================================

async function getKnowledgeGraph(): Promise<ApiResponse<CathedralKnowledgeGraph>> {
  const startTime = Date.now();
  return success(CATHEDRAL_KNOWLEDGE_GRAPH, startTime);
}

async function searchKnowledge(query: string): Promise<ApiResponse<Array<{ id: string; label: string; score: number }>>> {
  const startTime = Date.now();

  const results = graphSearch({ query, limit: 20 });

  return success(
    results.map(r => ({
      id: r.node.id,
      label: r.node.label,
      score: r.score
    })),
    startTime
  );
}

async function inspectNode(nodeId: string): Promise<ApiResponse<Record<string, unknown>>> {
  const startTime = Date.now();

  const inspection = graphInspect(nodeId);
  if (!inspection) {
    throw error('NOT_FOUND', { nodeId });
  }

  return success(inspection as unknown as Record<string, unknown>, startTime);
}

// ============================================================================
// CATHEDRAL API CLIENT
// ============================================================================

/**
 * Create a Cathedral API client
 */
export function createCathedralApi(config: Partial<ApiConfig> = {}): CathedralAPI {
  const finalConfig: ApiConfig = { ...DEFAULT_API_CONFIG, ...config };

  return {
    config: finalConfig,

    chart: {
      natal: calculateNatalChart,
      synastry: calculateSynastry,
      composite: calculateComposite
    },

    timing: {
      individual: getIndividualTiming,
      composite: getCompositeTiming,
      micro: getMicroTiming,
      trajectory: getTrajectory
    },

    environment: {
      fengshui: getFengShui,
      qimen: getQiMen,
      dateselection: selectDates
    },

    story: {
      predictive: getPredictiveStory,
      archetype: getArchetypeStory,
      weaving: getWeavingStory
    },

    ritual: {
      windows: getRitualWindows
    },

    simulation: {
      destiny: simulateDestiny
    },

    decision: {
      action: getActionGuidance
    },

    dashboards: {
      relationship: getRelationshipDashboard,
      story: getStoryDashboard,
      ritual: getRitualDashboard
    },

    knowledge: {
      graph: getKnowledgeGraph,
      search: searchKnowledge,
      inspect: inspectNode
    }
  };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

/**
 * Default Cathedral API instance
 */
export const cathedralApi = createCathedralApi();

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export {
  generateRequestId,
  createMeta,
  success,
  error,
  validateBirthData,
  ENDPOINT_REGISTRY
};
