/**
 * ============================================================================
 * RITUAL TIMING ENGINE - TYPE DEFINITIONS (仪式时机引擎类型)
 * ============================================================================
 *
 * The sanctum of the cathedral.
 * Types for the ceremonial timing layer.
 *
 * Four Ritual Archetypes:
 * - Vow (誓约) - Commitment, union, alignment
 * - Healing (疗愈) - Repair, forgiveness, integration
 * - Closure (结束) - Release, completion, boundary
 * - Initiation (开启) - New beginnings, projects, moves
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// RITUAL TYPES
// ============================================================================

/**
 * The four ritual archetypes
 */
export type RitualType = 'vow' | 'healing' | 'closure' | 'initiation';

export const RITUAL_CHINESE: Record<RitualType, string> = {
  vow: '誓约',
  healing: '疗愈',
  closure: '结束',
  initiation: '开启'
};

export const RITUAL_DESCRIPTIONS: Record<RitualType, {
  en: string;
  zh: string;
  purpose: string;
  keywords: string[];
}> = {
  vow: {
    en: 'Vow',
    zh: '誓约',
    purpose: 'Commitment, union, alignment, promise',
    keywords: ['commitment', 'union', 'promise', 'marriage', 'partnership', 'dedication']
  },
  healing: {
    en: 'Healing',
    zh: '疗愈',
    purpose: 'Repair, forgiveness, emotional integration',
    keywords: ['repair', 'forgiveness', 'reconciliation', 'therapy', 'restoration']
  },
  closure: {
    en: 'Closure',
    zh: '结束',
    purpose: 'Release, completion, boundary, ending a cycle',
    keywords: ['release', 'ending', 'boundary', 'completion', 'farewell', 'letting go']
  },
  initiation: {
    en: 'Initiation',
    zh: '开启',
    purpose: 'New beginnings, projects, moves, identity shifts',
    keywords: ['beginning', 'launch', 'start', 'project', 'move', 'birth', 'creation']
  }
};

// ============================================================================
// TIMING SIGNALS
// ============================================================================

/**
 * BaZi timing signals that affect rituals
 */
export interface BaZiTimingSignals {
  // Useful God activation
  usefulGodActive: boolean;
  usefulGodStrength: number;

  // Annoying God activation
  annoyingGodActive: boolean;
  annoyingGodStrength: number;

  // Day Officer (建除十二神)
  dayOfficer: DayOfficer;

  // Shen Sha (神煞)
  shenSha: ShenShaPresent[];

  // Clashes and Conflicts
  hasClash: boolean;
  clashType?: 'day' | 'month' | 'year';
  hasHarm: boolean;
  hasPunishment: boolean;
  hasDestruction: boolean;

  // Element support
  dominantElement: string;
  supportingElements: string[];
}

export type DayOfficer =
  | 'establish'   // 建 - Growth, new beginnings
  | 'remove'      // 除 - Removal, clearing
  | 'full'        // 满 - Fullness, completion
  | 'balance'     // 平 - Balance, stability
  | 'stable'      // 定 - Stability, commitment
  | 'execute'     // 执 - Execution, action
  | 'break'       // 破 - Breaking, ending
  | 'danger'      // 危 - Danger, caution
  | 'success'     // 成 - Success, achievement
  | 'receive'     // 收 - Receiving, gathering
  | 'open'        // 开 - Opening, initiation
  | 'close';      // 闭 - Closing, ending

export const DAY_OFFICER_CHINESE: Record<DayOfficer, string> = {
  establish: '建',
  remove: '除',
  full: '满',
  balance: '平',
  stable: '定',
  execute: '执',
  break: '破',
  danger: '危',
  success: '成',
  receive: '收',
  open: '开',
  close: '闭'
};

export interface ShenShaPresent {
  name: string;
  nameChinese: string;
  type: 'auspicious' | 'inauspicious' | 'neutral';
  effect: string;
}

/**
 * Key Shen Sha for rituals
 */
export const RITUAL_SHEN_SHA = {
  // Auspicious for vows
  nobleman: { name: 'Nobleman', chinese: '贵人', type: 'auspicious' },
  peachBlossom: { name: 'Peach Blossom', chinese: '桃花', type: 'auspicious' },
  prosperity: { name: 'Prosperity Star', chinese: '禄神', type: 'auspicious' },

  // Auspicious for healing
  tianYi: { name: 'Heavenly Doctor', chinese: '天医', type: 'auspicious' },
  monthVirtue: { name: 'Month Virtue', chinese: '月德', type: 'auspicious' },
  heavenVirtue: { name: 'Heaven Virtue', chinese: '天德', type: 'auspicious' },

  // Inauspicious
  solitaryStar: { name: 'Solitary Star', chinese: '孤辰', type: 'inauspicious' },
  widowStar: { name: 'Widow Star', chinese: '寡宿', type: 'inauspicious' },
  fuYin: { name: 'Hidden Tone', chinese: '伏吟', type: 'inauspicious' },
  fanYin: { name: 'Returning Tone', chinese: '反吟', type: 'inauspicious' }
} as const;

// ============================================================================
// ENVIRONMENTAL SIGNALS
// ============================================================================

/**
 * Qi Men Dun Jia signals
 */
export interface QiMenSignals {
  door: QiMenDoor;
  star: string;
  deity: string;
  palace: number;
  palaceName: string;
  structure: 'auspicious' | 'neutral' | 'inauspicious';
}

export type QiMenDoor =
  | 'open'     // 开门 - Opening, initiation
  | 'rest'     // 休门 - Rest, healing
  | 'life'     // 生门 - Life, growth
  | 'harm'     // 伤门 - Harm, conflict
  | 'block'    // 杜门 - Blocking, obstacles
  | 'view'     // 景门 - View, clarity
  | 'death'    // 死门 - Death, endings
  | 'shock';   // 惊门 - Shock, surprise

export const QI_MEN_DOOR_CHINESE: Record<QiMenDoor, string> = {
  open: '开门',
  rest: '休门',
  life: '生门',
  harm: '伤门',
  block: '杜门',
  view: '景门',
  death: '死门',
  shock: '惊门'
};

/**
 * Feng Shui directional signals
 */
export interface FengShuiSignals {
  bestDirection: string;
  bestDirectionChinese: string;
  avoidDirection: string;
  avoidDirectionChinese: string;

  noblesmanDirection?: string;
  wealthDirection?: string;
  peachBlossomDirection?: string;

  grandDukeDirection: string; // 太岁
  shaDirection?: string;      // 煞位
}

/**
 * Environmental snapshot for ritual timing
 */
export interface RitualEnvironment {
  qiMen: QiMenSignals;
  fengShui: FengShuiSignals;
  dongGongRating: number; // 0-100
  environmentalTier: 'excellent' | 'good' | 'neutral' | 'challenging';
}

// ============================================================================
// LIFECYCLE SIGNALS
// ============================================================================

/**
 * Relationship lifecycle phase
 */
export type LifecyclePhase =
  | 'awakening'    // Initial attraction
  | 'deepening'    // Growing intimacy
  | 'challenge'    // Conflict phase
  | 'turning'      // Decision point
  | 'renewal'      // Recommitment
  | 'integration'  // Mature stability
  | 'completion';  // Natural ending

export const LIFECYCLE_CHINESE: Record<LifecyclePhase, string> = {
  awakening: '觉醒',
  deepening: '深化',
  challenge: '挑战',
  turning: '转折',
  renewal: '更新',
  integration: '整合',
  completion: '圆满'
};

export interface LifecycleSignals {
  currentPhase: LifecyclePhase;
  phaseProgress: number; // 0-100 within phase
  destinyCurveDirection: 'rising' | 'falling' | 'stable' | 'volatile';
  destinyCurveValue: number; // 0-100
}

// ============================================================================
// RITUAL WINDOWS
// ============================================================================

/**
 * A window of time suitable for a specific ritual
 */
export interface RitualWindow {
  id: string;

  // Ritual type
  ritual: RitualType;
  ritualChinese: string;

  // Time window
  start: string;  // ISO datetime
  end: string;    // ISO datetime
  duration: string; // Human-readable

  // Scoring
  score: number;  // 0-100
  tier: RitualTier;
  tierChinese: string;

  // Reasons for the score
  positiveFactors: RitualFactor[];
  negativeFactors: RitualFactor[];
  reasons: string[]; // Human-readable summary

  // Directional guidance
  bestDirection: string;
  bestDirectionChinese: string;
  avoidDirection?: string;

  // Qi Men context
  qiMenDoor: QiMenDoor;
  qiMenDoorChinese: string;
  qiMenPalace: number;

  // Story alignment
  storyAlignment?: {
    chapterId?: string;
    chapterTitle?: string;
    beatId?: string;
    beatType?: string;
    narrativeNote?: string;
  };

  // Ceremonial notes
  ceremonialNotes: string;
}

export type RitualTier = 'excellent' | 'good' | 'neutral' | 'avoid';

export const RITUAL_TIER_CHINESE: Record<RitualTier, string> = {
  excellent: '上上',
  good: '上',
  neutral: '中',
  avoid: '忌'
};

export interface RitualFactor {
  name: string;
  nameChinese: string;
  impact: number; // Positive or negative
  description: string;
}

// ============================================================================
// RITUAL TIMING RESULT
// ============================================================================

/**
 * Complete ritual timing result for a time range
 */
export interface RitualTimingResult {
  // Query parameters
  queryDate: string;
  queryRange: {
    start: string;
    end: string;
  };

  // Windows by ritual type
  vowWindows: RitualWindow[];
  healingWindows: RitualWindow[];
  closureWindows: RitualWindow[];
  initiationWindows: RitualWindow[];

  // Best overall windows
  bestVow: RitualWindow | null;
  bestHealing: RitualWindow | null;
  bestClosure: RitualWindow | null;
  bestInitiation: RitualWindow | null;

  // Daily summary
  dailySummaries: DailyRitualSummary[];

  // Metadata
  metadata: {
    generatedAt: string;
    version: string;
  };
}

export interface DailyRitualSummary {
  date: string;
  dateChinese: string;

  // Best ritual for this day
  recommendedRitual: RitualType | null;
  recommendedScore: number;

  // Quick scores for each ritual type
  scores: {
    vow: number;
    healing: number;
    closure: number;
    initiation: number;
  };

  // Overall day quality
  dayQuality: RitualTier;

  // Key factors
  keyFactors: string[];
}

// ============================================================================
// ENGINE INPUT
// ============================================================================

/**
 * Input for the ritual timing engine
 */
export interface RitualEngineInput {
  // Time range to analyze
  startDate: string;
  endDate: string;

  // Optional: Focus on specific ritual types
  ritualTypes?: RitualType[];

  // BaZi context (from timing engine)
  baZiSignals?: BaZiTimingSignals;

  // Environmental context
  environment?: RitualEnvironment;

  // Lifecycle context
  lifecycle?: LifecycleSignals;

  // Synastry data (for relationship rituals)
  synastryScore?: number;
  compositeUsefulGod?: string;

  // Story context
  storyContext?: {
    currentChapterId?: string;
    currentBeatId?: string;
    upcomingTurningPoints?: string[];
  };

  // Options
  options?: RitualEngineOptions;
}

export interface RitualEngineOptions {
  // Granularity
  granularity?: 'day' | 'hour' | 'micro';

  // Minimum score threshold
  minimumScore?: number;

  // Maximum windows to return per ritual type
  maxWindows?: number;

  // Include ceremonial notes
  includeCeremonialNotes?: boolean;

  // Language preference
  language?: 'en' | 'zh' | 'bilingual';
}

// ============================================================================
// RITUAL CALENDAR
// ============================================================================

/**
 * A month view of ritual opportunities
 */
export interface RitualCalendarMonth {
  year: number;
  month: number;
  monthChinese: string;

  days: RitualCalendarDay[];

  // Monthly highlights
  bestDays: {
    vow: string[];    // Date strings
    healing: string[];
    closure: string[];
    initiation: string[];
  };

  // Monthly warnings
  avoidDays: string[];
}

export interface RitualCalendarDay {
  date: string;
  dateChinese: string;

  // Day officer
  dayOfficer: DayOfficer;
  dayOfficerChinese: string;

  // Ritual suitability (0-100)
  ritualScores: {
    vow: number;
    healing: number;
    closure: number;
    initiation: number;
  };

  // Best ritual for this day
  recommended: RitualType | null;

  // Overall quality
  quality: RitualTier;

  // Quick note
  note: string;
}

// ============================================================================
// VISUALIZATION DATA
// ============================================================================

/**
 * Data for ritual compass visualization
 */
export interface RitualCompassData {
  // Center info
  currentDate: string;
  recommendedRitual: RitualType | null;

  // Eight directions with ritual suitability
  directions: Array<{
    direction: string;
    directionChinese: string;
    degree: number;
    ritualSuitability: {
      vow: 'excellent' | 'good' | 'neutral' | 'avoid';
      healing: 'excellent' | 'good' | 'neutral' | 'avoid';
      closure: 'excellent' | 'good' | 'neutral' | 'avoid';
      initiation: 'excellent' | 'good' | 'neutral' | 'avoid';
    };
    specialEnergies: string[];
  }>;

  // Qi Men overlay
  qiMenPalaces: Array<{
    palace: number;
    door: QiMenDoor;
    doorChinese: string;
    ritualAffinity: RitualType[];
  }>;
}

/**
 * Data for ritual cards UI
 */
export interface RitualCardData {
  ritual: RitualType;
  ritualChinese: string;
  description: string;

  // Current window (if any)
  currentWindow: RitualWindow | null;

  // Next best window
  nextWindow: RitualWindow | null;

  // Score history (for mini chart)
  scoreHistory: Array<{
    date: string;
    score: number;
  }>;

  // Ceremonial guidance
  ceremonialGuidance: {
    bestDirection: string;
    bestTime: string;
    ritualElements: string[];
    avoidances: string[];
  };

  // Story context
  storyNote?: string;
}
