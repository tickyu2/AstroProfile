/**
 * ============================================================================
 * CATHEDRAL API LAYER - TYPE DEFINITIONS (大教堂 API 层类型)
 * ============================================================================
 *
 * The spine of the cathedral.
 * Types for the unified API that exposes the entire metaphysics OS.
 *
 * Architecture:
 * - One Entry Point (/api/cathedral/v1)
 * - One Resource Model (data, meta, debug)
 * - One Error Model (code, message, details)
 * - One Documentation Source (Knowledge Graph)
 *
 * This is the public interface of your metaphysics cathedral.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { PredictiveStory, StoryBeat, StoryChapter } from './storyTypes';
import type { RitualTimingResult, RitualWindow, LifecyclePhase } from './ritualTypes';
import type { DestinySimulationResult, SimulatedTimeline } from './simulationTypes';
import type { FateToActionResult, ActionStep, ActionType } from './actionTypes';
import type { CathedralKnowledgeGraph } from './cathedralGraphTypes';
import type { WovenStory } from './weavingTypes';
import type { TransformedStory, TemplateStyle } from './storyTemplates';

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_VERSION = 'v1';
export const API_BASE_PATH = '/api/cathedral';

export interface ApiConfig {
  version: string;
  basePath: string;
  timeout: number;
  retries: number;
  debug: boolean;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  version: API_VERSION,
  basePath: API_BASE_PATH,
  timeout: 30000,
  retries: 3,
  debug: false
};

// ============================================================================
// UNIFIED RESPONSE MODEL
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: ApiMeta;
  debug?: ApiDebug;
}

export interface ApiMeta {
  requestId: string;
  timestamp: string;
  version: string;
  processingTime: number;
  cached?: boolean;
}

export interface ApiDebug {
  enginesCalled: string[];
  timings: Record<string, number>;
  cacheHits: string[];
  warnings: string[];
}

// ============================================================================
// UNIFIED ERROR MODEL
// ============================================================================

/**
 * Standard API error
 */
export interface ApiError {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
  };
  meta: ApiMeta;
}

export type ApiErrorCode =
  | 'INVALID_INPUT'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_DATE_FORMAT'
  | 'INVALID_TIME_FORMAT'
  | 'ENGINE_ERROR'
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

export const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'Required field is missing',
  INVALID_DATE_FORMAT: 'Date must be in YYYY-MM-DD format',
  INVALID_TIME_FORMAT: 'Time must be in HH:MM format',
  ENGINE_ERROR: 'Engine processing error',
  TIMEOUT: 'Request timed out',
  RATE_LIMITED: 'Rate limit exceeded',
  UNAUTHORIZED: 'Authentication required',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error'
};

// ============================================================================
// INPUT TYPES - CHART
// ============================================================================

/**
 * Birth data for chart calculations
 */
export interface BirthData {
  date: string;           // YYYY-MM-DD
  time: string;           // HH:MM
  timezone?: string;      // IANA timezone
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  gender?: 'male' | 'female';
  name?: string;
}

export interface NatalChartInput {
  birthData: BirthData;
  options?: {
    includeUsefulGod?: boolean;
    includeShenSha?: boolean;
    includeConflicts?: boolean;
    includeDaYun?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

export interface SynastryInput {
  personA: BirthData;
  personB: BirthData;
  options?: {
    includeHeatmap?: boolean;
    includeElementAnalysis?: boolean;
    includeArchetype?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

export interface CompositeChartInput {
  personA: BirthData;
  personB: BirthData;
  options?: {
    includeLifeThemes?: boolean;
    includeUsefulGod?: boolean;
    includeTiming?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

// ============================================================================
// INPUT TYPES - TIMING
// ============================================================================

export interface TimingInput {
  birthData: BirthData;
  targetDate?: string;    // YYYY-MM-DD, defaults to today
  options?: {
    includeDaYun?: boolean;
    includeAnnual?: boolean;
    includeMonthly?: boolean;
    includeDaily?: boolean;
    yearsAhead?: number;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

export interface CompositeTimingInput {
  personA: BirthData;
  personB: BirthData;
  targetDate?: string;
  options?: {
    includeAllLayers?: boolean;
    yearsAhead?: number;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

export interface MicroTimingInput {
  birthData: BirthData;
  targetDate: string;
  options?: {
    granularity?: 'hour' | 'minute15' | 'minute5';
    includeDirectional?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

export interface TrajectoryInput {
  personA: BirthData;
  personB?: BirthData;
  startDate?: string;
  endDate?: string;
  options?: {
    resolution?: 'year' | 'month' | 'day';
    includeEvents?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

// ============================================================================
// INPUT TYPES - ENVIRONMENT
// ============================================================================

export interface EnvironmentInput {
  targetDate: string;
  targetTime?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  personalChart?: BirthData;
  options?: {
    language?: 'en' | 'zh' | 'bilingual';
  };
}

export interface DateSelectionInput {
  startDate: string;
  endDate: string;
  purpose: 'wedding' | 'business' | 'move' | 'travel' | 'medical' | 'general';
  personalChart?: BirthData;
  partnerChart?: BirthData;
  options?: {
    maxResults?: number;
    minScore?: number;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

// ============================================================================
// INPUT TYPES - STORY
// ============================================================================

export interface StoryInput {
  personA: BirthData;
  personB?: BirthData;
  startDate?: string;
  endDate?: string;
  options?: {
    includeNarrative?: boolean;
    includeChapters?: boolean;
    includeBeats?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

export interface ArchetypeInput {
  story: PredictiveStory;
  style: TemplateStyle;
  options?: {
    fullTransform?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

export interface WeavingInput {
  participants: BirthData[];
  mode: 'family' | 'team' | 'polycule' | 'generational';
  relationships?: Array<{
    fromIndex: number;
    toIndex: number;
    type: string;
  }>;
  options?: {
    includeNetworkGraph?: boolean;
    includeTimeline?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

// ============================================================================
// INPUT TYPES - RITUAL
// ============================================================================

export interface RitualInput {
  startDate: string;
  endDate: string;
  ritualTypes?: ('vow' | 'healing' | 'closure' | 'initiation')[];
  personalChart?: BirthData;
  partnerChart?: BirthData;
  lifecyclePhase?: LifecyclePhase;
  options?: {
    granularity?: 'day' | 'hour' | 'micro';
    maxWindows?: number;
    minScore?: number;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

// ============================================================================
// INPUT TYPES - SIMULATION
// ============================================================================

export interface SimulationApiInput {
  personA: BirthData;
  personB?: BirthData;
  choice: {
    category: string;
    description: string;
  };
  timing: {
    when: 'now' | 'soon' | 'later' | 'specific';
    specificDate?: string;
  };
  options?: {
    branchCount?: number;
    includeNarrative?: boolean;
    yearsAhead?: number;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

// ============================================================================
// INPUT TYPES - DECISION/ACTION
// ============================================================================

export interface ActionApiInput {
  personA: BirthData;
  personB?: BirthData;
  targetDate: string;
  options?: {
    includeMicroTiming?: boolean;
    includeDirectional?: boolean;
    includeRituals?: boolean;
    maxSteps?: number;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

// ============================================================================
// INPUT TYPES - DASHBOARD
// ============================================================================

export interface DashboardInput {
  personA: BirthData;
  personB?: BirthData;
  targetDate?: string;
  targetYear?: number;
  options?: {
    includeCharts?: boolean;
    includeTiming?: boolean;
    includeStory?: boolean;
    includeRitual?: boolean;
    includeAction?: boolean;
    language?: 'en' | 'zh' | 'bilingual';
  };
}

// ============================================================================
// OUTPUT TYPES - CHART
// ============================================================================

export interface NatalChartResult {
  pillars: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string };
  };
  dayMaster: string;
  dayMasterElement: string;
  elementDistribution: Record<string, number>;
  tenGods: Record<string, string>;
  usefulGod?: string;
  annoyingGod?: string;
  shenSha?: Array<{ name: string; type: string }>;
  conflicts?: Array<{ type: string; description: string }>;
  daYun?: Array<{
    startAge: number;
    endAge: number;
    stem: string;
    branch: string;
  }>;
}

export interface SynastryResult {
  overallScore: number;
  scoreBreakdown: {
    elemental: number;
    tenGods: number;
    shenSha: number;
    timing: number;
  };
  heatmap?: Record<string, Record<string, number>>;
  strengths: string[];
  challenges: string[];
  archetype?: {
    name: string;
    description: string;
  };
}

export interface CompositeChartResult {
  compositePillars: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string };
  };
  compositeElement: string;
  lifeThemes?: string[];
  usefulGod?: string;
  annoyingGod?: string;
  timing?: {
    currentPhase: string;
    trajectory: string;
  };
}

// ============================================================================
// OUTPUT TYPES - TIMING
// ============================================================================

export interface TimingLayersResult {
  daYun?: {
    current: { stem: string; branch: string; startAge: number; endAge: number };
    next: { stem: string; branch: string; startAge: number; endAge: number };
    all: Array<{ stem: string; branch: string; startAge: number; endAge: number }>;
  };
  annual?: {
    current: { year: number; stem: string; branch: string; score: number };
    upcoming: Array<{ year: number; stem: string; branch: string; score: number }>;
  };
  monthly?: {
    current: { month: number; stem: string; branch: string; score: number };
    upcoming: Array<{ month: number; stem: string; branch: string; score: number }>;
  };
  daily?: {
    today: { date: string; stem: string; branch: string; score: number };
    week: Array<{ date: string; stem: string; branch: string; score: number }>;
  };
}

export interface CompositeTimingResult {
  layers: TimingLayersResult;
  compositeScore: number;
  trajectory: 'rising' | 'falling' | 'stable' | 'volatile';
  keyDates: Array<{
    date: string;
    significance: string;
    score: number;
  }>;
}

export interface MicroTimingResult {
  date: string;
  bestHours: Array<{
    hour: number;
    score: number;
    quality: string;
  }>;
  bestQuarters: Array<{
    time: string;
    score: number;
    quality: string;
  }>;
  directional?: {
    best: string;
    bestChinese: string;
    avoid: string;
  };
}

export interface TrajectoryResult {
  points: Array<{
    date: string;
    value: number;
    label?: string;
  }>;
  trend: 'rising' | 'falling' | 'stable' | 'volatile';
  peaks: Array<{ date: string; value: number }>;
  troughs: Array<{ date: string; value: number }>;
  events?: Array<{
    date: string;
    type: string;
    description: string;
  }>;
}

// ============================================================================
// OUTPUT TYPES - ENVIRONMENT
// ============================================================================

export interface FengShuiResult {
  bestDirection: string;
  bestDirectionChinese: string;
  avoidDirection: string;
  avoidDirectionChinese: string;
  noblesmanDirection?: string;
  wealthDirection?: string;
  peachBlossomDirection?: string;
  grandDukeDirection: string;
  allDirections: Array<{
    direction: string;
    directionChinese: string;
    quality: 'excellent' | 'good' | 'neutral' | 'avoid';
    specialEnergies: string[];
  }>;
}

export interface QiMenResult {
  chart: {
    palace: number;
    door: string;
    doorChinese: string;
    star: string;
    deity: string;
  };
  structure: 'auspicious' | 'neutral' | 'inauspicious';
  recommendations: string[];
}

export interface DateSelectionResult {
  dates: Array<{
    date: string;
    dateChinese: string;
    score: number;
    quality: 'excellent' | 'good' | 'neutral';
    reasons: string[];
    cautions: string[];
  }>;
  bestDate: {
    date: string;
    dateChinese: string;
    score: number;
  } | null;
}

// ============================================================================
// OUTPUT TYPES - STORY
// ============================================================================

export interface PredictiveStoryResult {
  story: PredictiveStory;
  summary: string;
  currentChapter: StoryChapter | null;
  upcomingBeats: StoryBeat[];
  emotionalArc: Array<{
    date: string;
    value: number;
    tone: string;
  }>;
}

export interface ArchetypeStoryResult {
  original: PredictiveStory;
  transformed: TransformedStory;
  style: TemplateStyle;
  styleChinese: string;
}

export interface WeavingResult {
  story: WovenStory;
  networkGraph?: {
    nodes: Array<{ id: string; label: string }>;
    edges: Array<{ source: string; target: string; type: string }>;
  };
  timeline?: {
    beats: Array<{ date: string; participants: string[]; description: string }>;
  };
}

// ============================================================================
// OUTPUT TYPES - DASHBOARD
// ============================================================================

export interface RelationshipDashboardResult {
  synastry: SynastryResult;
  composite: CompositeChartResult;
  timing: CompositeTimingResult;
  lifecycle: {
    phase: LifecyclePhase;
    phaseChinese: string;
    progress: number;
  };
  story: PredictiveStoryResult;
  ritual: {
    nextWindow: RitualWindow | null;
    upcomingWindows: RitualWindow[];
  };
  action: {
    todayBest: ActionStep | null;
    weekSummary: Array<{ date: string; action: ActionType }>;
  };
}

export interface StoryDashboardResult {
  story: PredictiveStoryResult;
  timeline: {
    chapters: StoryChapter[];
    currentPosition: number;
  };
  emotionalArc: Array<{ date: string; value: number; tone: string }>;
  upcomingTurningPoints: Array<{ date: string; description: string }>;
}

export interface RitualDashboardResult {
  calendar: {
    month: number;
    year: number;
    days: Array<{
      date: string;
      bestRitual: string | null;
      score: number;
    }>;
  };
  upcomingWindows: RitualWindow[];
  bestWindows: {
    vow: RitualWindow | null;
    healing: RitualWindow | null;
    closure: RitualWindow | null;
    initiation: RitualWindow | null;
  };
}

// ============================================================================
// UNIFIED API INTERFACE
// ============================================================================

/**
 * The complete Cathedral API interface
 */
export interface CathedralAPI {
  // Configuration
  config: ApiConfig;

  // Chart endpoints
  chart: {
    natal: (input: NatalChartInput) => Promise<ApiResponse<NatalChartResult>>;
    synastry: (input: SynastryInput) => Promise<ApiResponse<SynastryResult>>;
    composite: (input: CompositeChartInput) => Promise<ApiResponse<CompositeChartResult>>;
  };

  // Timing endpoints
  timing: {
    individual: (input: TimingInput) => Promise<ApiResponse<TimingLayersResult>>;
    composite: (input: CompositeTimingInput) => Promise<ApiResponse<CompositeTimingResult>>;
    micro: (input: MicroTimingInput) => Promise<ApiResponse<MicroTimingResult>>;
    trajectory: (input: TrajectoryInput) => Promise<ApiResponse<TrajectoryResult>>;
  };

  // Environment endpoints
  environment: {
    fengshui: (input: EnvironmentInput) => Promise<ApiResponse<FengShuiResult>>;
    qimen: (input: EnvironmentInput) => Promise<ApiResponse<QiMenResult>>;
    dateselection: (input: DateSelectionInput) => Promise<ApiResponse<DateSelectionResult>>;
  };

  // Story endpoints
  story: {
    predictive: (input: StoryInput) => Promise<ApiResponse<PredictiveStoryResult>>;
    archetype: (input: ArchetypeInput) => Promise<ApiResponse<ArchetypeStoryResult>>;
    weaving: (input: WeavingInput) => Promise<ApiResponse<WeavingResult>>;
  };

  // Ritual endpoints
  ritual: {
    windows: (input: RitualInput) => Promise<ApiResponse<RitualTimingResult>>;
  };

  // Simulation endpoints
  simulation: {
    destiny: (input: SimulationApiInput) => Promise<ApiResponse<DestinySimulationResult>>;
  };

  // Decision endpoints
  decision: {
    action: (input: ActionApiInput) => Promise<ApiResponse<FateToActionResult>>;
  };

  // Dashboard endpoints
  dashboards: {
    relationship: (input: DashboardInput) => Promise<ApiResponse<RelationshipDashboardResult>>;
    story: (input: DashboardInput) => Promise<ApiResponse<StoryDashboardResult>>;
    ritual: (input: DashboardInput) => Promise<ApiResponse<RitualDashboardResult>>;
  };

  // Knowledge graph endpoint
  knowledge: {
    graph: () => Promise<ApiResponse<CathedralKnowledgeGraph>>;
    search: (query: string) => Promise<ApiResponse<Array<{ id: string; label: string; score: number }>>>;
    inspect: (nodeId: string) => Promise<ApiResponse<Record<string, unknown>>>;
  };
}

// ============================================================================
// ENDPOINT REGISTRY
// ============================================================================

export interface EndpointDefinition {
  path: string;
  method: 'GET' | 'POST';
  description: string;
  descriptionChinese: string;
  inputType: string;
  outputType: string;
  engines: string[];
}

export const ENDPOINT_REGISTRY: EndpointDefinition[] = [
  // Chart
  { path: '/chart/natal', method: 'POST', description: 'Calculate natal chart', descriptionChinese: '计算本命盘', inputType: 'NatalChartInput', outputType: 'NatalChartResult', engines: ['natalChartEngine', 'usefulGodEngine'] },
  { path: '/chart/synastry', method: 'POST', description: 'Calculate synastry', descriptionChinese: '计算合盘', inputType: 'SynastryInput', outputType: 'SynastryResult', engines: ['natalChartEngine', 'synastryEngine'] },
  { path: '/chart/composite', method: 'POST', description: 'Calculate composite chart', descriptionChinese: '计算组合盘', inputType: 'CompositeChartInput', outputType: 'CompositeChartResult', engines: ['natalChartEngine', 'compositeChartEngine'] },

  // Timing
  { path: '/timing/individual', method: 'POST', description: 'Get individual timing layers', descriptionChinese: '获取个人时机层', inputType: 'TimingInput', outputType: 'TimingLayersResult', engines: ['daYunEngine', 'annualLuckEngine', 'monthlyLuckEngine'] },
  { path: '/timing/composite', method: 'POST', description: 'Get composite timing', descriptionChinese: '获取组合时机', inputType: 'CompositeTimingInput', outputType: 'CompositeTimingResult', engines: ['compositeTimingEngine'] },
  { path: '/timing/micro', method: 'POST', description: 'Get micro-timing', descriptionChinese: '获取微时机', inputType: 'MicroTimingInput', outputType: 'MicroTimingResult', engines: ['microTimingEngine'] },
  { path: '/timing/trajectory', method: 'POST', description: 'Get trajectory curve', descriptionChinese: '获取轨迹曲线', inputType: 'TrajectoryInput', outputType: 'TrajectoryResult', engines: ['trajectoryEngine'] },

  // Environment
  { path: '/environment/fengshui', method: 'POST', description: 'Get Feng Shui directions', descriptionChinese: '获取风水方位', inputType: 'EnvironmentInput', outputType: 'FengShuiResult', engines: ['fengShuiEngine'] },
  { path: '/environment/qimen', method: 'POST', description: 'Get Qi Men chart', descriptionChinese: '获取奇门盘', inputType: 'EnvironmentInput', outputType: 'QiMenResult', engines: ['qiMenEngine'] },
  { path: '/environment/dateselection', method: 'POST', description: 'Select auspicious dates', descriptionChinese: '择日', inputType: 'DateSelectionInput', outputType: 'DateSelectionResult', engines: ['dateSelectionEngine'] },

  // Story
  { path: '/story/predictive', method: 'POST', description: 'Generate predictive story', descriptionChinese: '生成预测故事', inputType: 'StoryInput', outputType: 'PredictiveStoryResult', engines: ['predictiveStoryEngine', 'storyBeatEngine', 'storyChapterEngine'] },
  { path: '/story/archetype', method: 'POST', description: 'Transform story to archetype', descriptionChinese: '转换故事原型', inputType: 'ArchetypeInput', outputType: 'ArchetypeStoryResult', engines: ['archetypalTemplateEngine'] },
  { path: '/story/weaving', method: 'POST', description: 'Weave multi-relationship story', descriptionChinese: '编织多关系故事', inputType: 'WeavingInput', outputType: 'WeavingResult', engines: ['storyWeavingEngine'] },

  // Ritual
  { path: '/ritual/windows', method: 'POST', description: 'Get ritual timing windows', descriptionChinese: '获取仪式时间窗口', inputType: 'RitualInput', outputType: 'RitualTimingResult', engines: ['ritualTimingEngine'] },

  // Simulation
  { path: '/simulation/destiny', method: 'POST', description: 'Simulate destiny branches', descriptionChinese: '模拟命运分支', inputType: 'SimulationApiInput', outputType: 'DestinySimulationResult', engines: ['destinySimulationEngine'] },

  // Decision
  { path: '/decision/action', method: 'POST', description: 'Get fate-to-action guidance', descriptionChinese: '获取命运行动指导', inputType: 'ActionApiInput', outputType: 'FateToActionResult', engines: ['fateToActionEngine'] },

  // Dashboards
  { path: '/dashboards/relationship', method: 'POST', description: 'Get relationship dashboard', descriptionChinese: '获取关系仪表板', inputType: 'DashboardInput', outputType: 'RelationshipDashboardResult', engines: ['all'] },
  { path: '/dashboards/story', method: 'POST', description: 'Get story dashboard', descriptionChinese: '获取故事仪表板', inputType: 'DashboardInput', outputType: 'StoryDashboardResult', engines: ['predictiveStoryEngine'] },
  { path: '/dashboards/ritual', method: 'POST', description: 'Get ritual dashboard', descriptionChinese: '获取仪式仪表板', inputType: 'DashboardInput', outputType: 'RitualDashboardResult', engines: ['ritualTimingEngine'] },

  // Knowledge
  { path: '/knowledge/graph', method: 'GET', description: 'Get knowledge graph', descriptionChinese: '获取知识图谱', inputType: 'void', outputType: 'CathedralKnowledgeGraph', engines: [] },
  { path: '/knowledge/search', method: 'POST', description: 'Search knowledge graph', descriptionChinese: '搜索知识图谱', inputType: 'string', outputType: 'SearchResult[]', engines: [] },
  { path: '/knowledge/inspect', method: 'POST', description: 'Inspect graph node', descriptionChinese: '检查图节点', inputType: 'string', outputType: 'NodeInspection', engines: [] }
];
