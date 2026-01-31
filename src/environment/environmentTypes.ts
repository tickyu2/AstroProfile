/**
 * ============================================================================
 * ENVIRONMENTAL LAYER TYPES (环境层类型)
 * ============================================================================
 *
 * Data model for the Environmental Layer - the spatial dimension of the
 * metaphysics cathedral.
 *
 * Three Classical Systems:
 * 1. Feng Shui (风水) - Directional energies
 * 2. Qi Men Dun Jia (奇门遁甲) - Strategic Qi flow
 * 3. Date Selection (择日) - Activity suitability
 *
 * Combined with BaZi Timing:
 *   Time (BaZi) + Space (Feng Shui) + Strategic Qi (Qi Men) = Complete Stack
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// COMPASS & DIRECTION TYPES
// ============================================================================

/**
 * Eight compass directions (八方)
 */
export type CompassDirection =
  | 'N'   // North (北)
  | 'NE'  // Northeast (东北)
  | 'E'   // East (东)
  | 'SE'  // Southeast (东南)
  | 'S'   // South (南)
  | 'SW'  // Southwest (西南)
  | 'W'   // West (西)
  | 'NW'; // Northwest (西北)

/**
 * Direction with Chinese name
 */
export interface DirectionInfo {
  direction: CompassDirection;
  chinese: string;
  degrees: { min: number; max: number };
  element: ElementName;
  trigram: string;
  trigramChinese: string;
}

/**
 * Five elements
 */
export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

// ============================================================================
// FENG SHUI TYPES (风水)
// ============================================================================

/**
 * Directional energy type
 */
export type DirectionalEnergyType =
  | 'nobleman'      // 贵人方 - Noble person direction
  | 'wealth'        // 财位 - Wealth direction
  | 'peachBlossom'  // 桃花位 - Romance direction
  | 'academic'      // 文昌位 - Academic/career direction
  | 'health'        // 天医位 - Health direction
  | 'conflict'      // 五鬼位 - Conflict/obstacle direction
  | 'sha'           // 煞位 - Harmful direction
  | 'grandDuke'     // 太岁位 - Grand Duke (year-specific)
  | 'threeSha';     // 三煞位 - Three Killings (year-specific)

/**
 * Single directional energy
 */
export interface DirectionalEnergy {
  type: DirectionalEnergyType;
  typeChinese: string;
  direction: CompassDirection;
  directionChinese: string;
  strength: 'strong' | 'moderate' | 'mild';
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  advice: string;
  adviceChinese: string;
}

/**
 * Complete Feng Shui directional analysis
 */
export interface FengShuiDirections {
  // Auspicious directions
  nobleman: DirectionalEnergy[];
  wealth: DirectionalEnergy[];
  peachBlossom: DirectionalEnergy[];
  academic: DirectionalEnergy[];
  health: DirectionalEnergy[];

  // Inauspicious directions
  conflict: DirectionalEnergy[];
  sha: DirectionalEnergy[];
  grandDuke: DirectionalEnergy | null;
  threeSha: DirectionalEnergy | null;

  // Summary
  bestDirections: CompassDirection[];
  avoidDirections: CompassDirection[];
  notes: string[];
}

// ============================================================================
// QI MEN DUN JIA TYPES (奇门遁甲)
// ============================================================================

/**
 * Nine palaces (九宫)
 */
export type PalaceNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Eight doors (八门)
 */
export type QiMenDoor =
  | 'Open'      // 开门 - Opening, beginning
  | 'Rest'      // 休门 - Rest, recuperation
  | 'Life'      // 生门 - Life, growth
  | 'Harm'      // 伤门 - Harm, injury
  | 'Block'     // 杜门 - Blocking, hiding
  | 'Scenery'   // 景门 - Scenery, display
  | 'Death'     // 死门 - Death, endings
  | 'Fear';     // 惊门 - Fear, shock

/**
 * Nine stars (九星)
 */
export type QiMenStar =
  | 'Canopy'    // 天蓬 - Big Dipper handle
  | 'Reed'      // 天芮 - Sickness star
  | 'Impulse'   // 天冲 - Impulse, conflict
  | 'Support'   // 天辅 - Support, assistance
  | 'Heart'     // 天心 - Heart, strategy
  | 'Pillar'    // 天柱 - Pillar, structure
  | 'Ren'       // 天任 - Responsibility
  | 'Hero'      // 天英 - Hero, achievement
  | 'Void';     // 天禽 - Central void (palace 5)

/**
 * Eight deities (八神)
 */
export type QiMenDeity =
  | 'Chief'       // 值符 - Chief deity
  | 'Snake'       // 腾蛇 - Flying serpent
  | 'Yin'         // 太阴 - Great Yin
  | 'Harmony'     // 六合 - Six harmony
  | 'Hook'        // 勾陈 - Hook
  | 'Sparrow'     // 朱雀 - Vermillion bird
  | 'Nine Earth'  // 九地 - Nine earth
  | 'Nine Heaven';// 九天 - Nine heaven

/**
 * Qi Men stems (天干)
 */
export type QiMenStem =
  | 'Yi'    // 乙 - Wood yin
  | 'Bing'  // 丙 - Fire yang
  | 'Ding'  // 丁 - Fire yin
  | 'Wu'    // 戊 - Earth yang
  | 'Ji'    // 己 - Earth yin
  | 'Geng'  // 庚 - Metal yang
  | 'Xin'   // 辛 - Metal yin
  | 'Ren'   // 壬 - Water yang
  | 'Gui';  // 癸 - Water yin

/**
 * Special formations (格局)
 */
export type QiMenFormation =
  // Auspicious formations
  | 'ThreeWonders'      // 三奇得使 - Three Wonders activated
  | 'SixYi'             // 六仪吉格 - Six Yi auspicious
  | 'JiaJi'             // 甲己合 - Jia-Ji combination
  | 'DragonReturn'      // 青龙返首 - Green Dragon returns
  | 'FlyingBird'        // 飞鸟跌穴 - Flying bird enters nest
  // Inauspicious formations
  | 'FuYin'             // 伏吟 - Hidden crying (stagnation)
  | 'FanYin'            // 反吟 - Reverse crying (reversal)
  | 'TimeEmpty'         // 时空亡 - Time emptiness
  | 'GengObstacle'      // 庚格 - Geng obstruction
  | 'WhiteTiger'        // 白虎猖狂 - White Tiger rampant
  // Neutral
  | 'None';             // No special formation

/**
 * Qi Men chart rating
 */
export type QiMenRating = 'auspicious' | 'neutral' | 'inauspicious';

/**
 * Single palace in Qi Men chart
 */
export interface QiMenPalace {
  number: PalaceNumber;
  direction: CompassDirection | 'Center';
  door: QiMenDoor;
  doorChinese: string;
  star: QiMenStar;
  starChinese: string;
  deity: QiMenDeity;
  deityChinese: string;
  stem: QiMenStem;
  stemChinese: string;
  hidden: QiMenStem | null;
  rating: QiMenRating;
}

/**
 * Complete Qi Men Dun Jia chart
 */
export interface QiMenChart {
  // Time info
  hour: string;
  hourChinese: string;
  juNumber: number; // 局数 (1-18)
  juType: 'yang' | 'yin'; // 阳遁 or 阴遁

  // Nine palaces
  palaces: QiMenPalace[];

  // Key palace (for the hour)
  keyPalace: QiMenPalace;

  // Formations
  formation: QiMenFormation;
  formationChinese: string;
  formationNature: 'auspicious' | 'neutral' | 'inauspicious';

  // Overall rating
  rating: QiMenRating;
  ratingScore: number; // 0-100

  // Guidance
  bestPalaces: PalaceNumber[];
  avoidPalaces: PalaceNumber[];
  bestDirections: CompassDirection[];
  avoidDirections: CompassDirection[];

  // Notes
  notes: string[];
  notesChinese: string[];
}

// ============================================================================
// DATE SELECTION TYPES (择日)
// ============================================================================

/**
 * Twelve Officers (建除十二神)
 */
export type TwelveOfficer =
  | 'Establish'   // 建 - Establish
  | 'Remove'      // 除 - Remove
  | 'Full'        // 满 - Full
  | 'Balance'     // 平 - Balance
  | 'Stable'      // 定 - Stable
  | 'Initiate'    // 执 - Initiate
  | 'Destroy'     // 破 - Destroy
  | 'Danger'      // 危 - Danger
  | 'Success'     // 成 - Success
  | 'Receive'     // 收 - Receive
  | 'Open'        // 开 - Open
  | 'Close';      // 闭 - Close

/**
 * Dong Gong date selection rating (董公择日)
 */
export type DongGongRating = 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Activity category
 */
export type ActivityCategory =
  | 'marriage'        // 嫁娶 - Marriage
  | 'engagement'      // 订婚 - Engagement
  | 'travel'          // 出行 - Travel
  | 'move'            // 搬家 - Moving house
  | 'openBusiness'    // 开业 - Open business
  | 'signing'         // 签约 - Signing contracts
  | 'meeting'         // 会见 - Important meetings
  | 'renovation'      // 装修 - Renovation
  | 'medical'         // 就医 - Medical treatment
  | 'study'           // 学习 - Study
  | 'negotiation'     // 谈判 - Negotiation
  | 'investment'      // 投资 - Investment
  | 'celebration'     // 庆典 - Celebration
  | 'prayer'          // 祈福 - Prayer/blessing
  | 'burial'          // 安葬 - Burial
  | 'rest';           // 休息 - Rest

/**
 * Hour suitability
 */
export interface HourSuitability {
  hour: number; // 0-23
  hourChinese: string;
  branch: string;
  branchChinese: string;
  rating: 'excellent' | 'good' | 'neutral' | 'caution' | 'avoid';
  suitable: ActivityCategory[];
  avoid: ActivityCategory[];
  notes: string;
}

/**
 * Complete date selection analysis
 */
export interface DateSelection {
  // Date info
  date: string;
  lunarDate: string;
  lunarDateChinese: string;

  // Twelve Officers
  officer: TwelveOfficer;
  officerChinese: string;
  officerMeaning: string;
  officerNature: 'auspicious' | 'neutral' | 'inauspicious';

  // Dong Gong rating
  dongGongRating: DongGongRating;
  dongGongScore: number; // 0-100

  // Activities
  suitable: ActivityCategory[];
  suitableChinese: string[];
  avoid: ActivityCategory[];
  avoidChinese: string[];

  // Clashes
  clashAnimal: string;
  clashAnimalChinese: string;
  clashElement: ElementName;

  // Sha direction
  shaDirection: CompassDirection;
  shaDirectionChinese: string;

  // Hourly breakdown
  hourRatings: HourSuitability[];

  // Special notes
  specialDays: string[];
  specialDaysChinese: string[];
  notes: string[];
  notesChinese: string[];
}

// ============================================================================
// ENVIRONMENTAL SNAPSHOT (COMBINED)
// ============================================================================

/**
 * Environmental quality tier
 */
export type EnvironmentalTier =
  | 'excellent'   // All systems aligned favorably
  | 'good'        // Most systems favorable
  | 'mixed'       // Some favorable, some unfavorable
  | 'caution'     // More unfavorable than favorable
  | 'challenging';// Most systems unfavorable

/**
 * Complete environmental snapshot
 */
export interface EnvironmentalSnapshot {
  // Timestamp
  timestamp: string;
  date: string;
  hour: number;

  // Three systems
  fengShui: FengShuiDirections;
  qiMen: QiMenChart;
  dateSelection: DateSelection;

  // Combined scoring
  environmentalScore: number; // 0-100
  tier: EnvironmentalTier;

  // Component scores
  fengShuiScore: number;
  qiMenScore: number;
  dateSelectionScore: number;

  // Combined guidance
  bestDirections: CompassDirection[];
  avoidDirections: CompassDirection[];
  bestActivities: ActivityCategory[];
  avoidActivities: ActivityCategory[];

  // Narrative
  summary: string;
  summaryChinese: string;
  notes: string[];
  notesChinese: string[];
}

// ============================================================================
// SUBJECT TYPES
// ============================================================================

/**
 * Subject for environmental analysis
 */
export interface EnvironmentalSubject {
  type: 'individual' | 'composite';
  name?: string;

  // From BaZi
  yearBranch: string;
  dayMasterElement: ElementName;

  // Personal directions (from BaZi)
  personalNoblemanDirections: CompassDirection[];
  personalWealthDirection: CompassDirection;
  personalPeachBlossomDirection: CompassDirection;

  // Useful God
  usefulGodElement: ElementName;
  avoidElements: ElementName[];
}

/**
 * Options for computing environmental snapshot
 */
export interface ComputeEnvironmentOptions {
  timestamp: string; // ISO datetime
  subject: EnvironmentalSubject;
  includeHourlyBreakdown?: boolean;
  includeQiMenDetails?: boolean;
}

/**
 * Environmental computation result
 */
export interface EnvironmentalResult {
  success: boolean;
  data?: EnvironmentalSnapshot;
  error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Direction info map
 */
export const DIRECTION_INFO: Record<CompassDirection, DirectionInfo> = {
  N: {
    direction: 'N',
    chinese: '北',
    degrees: { min: 337.5, max: 22.5 },
    element: 'Water',
    trigram: 'Kan',
    trigramChinese: '坎'
  },
  NE: {
    direction: 'NE',
    chinese: '东北',
    degrees: { min: 22.5, max: 67.5 },
    element: 'Earth',
    trigram: 'Gen',
    trigramChinese: '艮'
  },
  E: {
    direction: 'E',
    chinese: '东',
    degrees: { min: 67.5, max: 112.5 },
    element: 'Wood',
    trigram: 'Zhen',
    trigramChinese: '震'
  },
  SE: {
    direction: 'SE',
    chinese: '东南',
    degrees: { min: 112.5, max: 157.5 },
    element: 'Wood',
    trigram: 'Xun',
    trigramChinese: '巽'
  },
  S: {
    direction: 'S',
    chinese: '南',
    degrees: { min: 157.5, max: 202.5 },
    element: 'Fire',
    trigram: 'Li',
    trigramChinese: '离'
  },
  SW: {
    direction: 'SW',
    chinese: '西南',
    degrees: { min: 202.5, max: 247.5 },
    element: 'Earth',
    trigram: 'Kun',
    trigramChinese: '坤'
  },
  W: {
    direction: 'W',
    chinese: '西',
    degrees: { min: 247.5, max: 292.5 },
    element: 'Metal',
    trigram: 'Dui',
    trigramChinese: '兑'
  },
  NW: {
    direction: 'NW',
    chinese: '西北',
    degrees: { min: 292.5, max: 337.5 },
    element: 'Metal',
    trigram: 'Qian',
    trigramChinese: '乾'
  }
};

/**
 * Twelve Officers info
 */
export const TWELVE_OFFICERS_INFO: Record<TwelveOfficer, {
  chinese: string;
  nature: 'auspicious' | 'neutral' | 'inauspicious';
  meaning: string;
}> = {
  Establish: { chinese: '建', nature: 'neutral', meaning: 'Day of establishment, moderate for most activities' },
  Remove: { chinese: '除', nature: 'auspicious', meaning: 'Day of removal, good for clearing obstacles' },
  Full: { chinese: '满', nature: 'auspicious', meaning: 'Day of fullness, good for celebrations' },
  Balance: { chinese: '平', nature: 'neutral', meaning: 'Day of balance, average for activities' },
  Stable: { chinese: '定', nature: 'auspicious', meaning: 'Day of stability, good for commitments' },
  Initiate: { chinese: '执', nature: 'neutral', meaning: 'Day of initiation, good for starting projects' },
  Destroy: { chinese: '破', nature: 'inauspicious', meaning: 'Day of destruction, avoid important matters' },
  Danger: { chinese: '危', nature: 'inauspicious', meaning: 'Day of danger, exercise caution' },
  Success: { chinese: '成', nature: 'auspicious', meaning: 'Day of success, excellent for achievements' },
  Receive: { chinese: '收', nature: 'auspicious', meaning: 'Day of receiving, good for conclusions' },
  Open: { chinese: '开', nature: 'auspicious', meaning: 'Day of opening, good for new beginnings' },
  Close: { chinese: '闭', nature: 'inauspicious', meaning: 'Day of closing, better for rest' }
};

/**
 * Activity labels
 */
export const ACTIVITY_LABELS: Record<ActivityCategory, { en: string; zh: string }> = {
  marriage: { en: 'Marriage', zh: '嫁娶' },
  engagement: { en: 'Engagement', zh: '订婚' },
  travel: { en: 'Travel', zh: '出行' },
  move: { en: 'Moving', zh: '搬家' },
  openBusiness: { en: 'Open Business', zh: '开业' },
  signing: { en: 'Signing', zh: '签约' },
  meeting: { en: 'Meeting', zh: '会见' },
  renovation: { en: 'Renovation', zh: '装修' },
  medical: { en: 'Medical', zh: '就医' },
  study: { en: 'Study', zh: '学习' },
  negotiation: { en: 'Negotiation', zh: '谈判' },
  investment: { en: 'Investment', zh: '投资' },
  celebration: { en: 'Celebration', zh: '庆典' },
  prayer: { en: 'Prayer', zh: '祈福' },
  burial: { en: 'Burial', zh: '安葬' },
  rest: { en: 'Rest', zh: '休息' }
};

/**
 * Qi Men door info
 */
export const QIMEN_DOOR_INFO: Record<QiMenDoor, {
  chinese: string;
  nature: 'auspicious' | 'neutral' | 'inauspicious';
  meaning: string;
}> = {
  Open: { chinese: '开门', nature: 'auspicious', meaning: 'Opening, new beginnings, career' },
  Rest: { chinese: '休门', nature: 'auspicious', meaning: 'Rest, recuperation, seeking help' },
  Life: { chinese: '生门', nature: 'auspicious', meaning: 'Life, growth, wealth' },
  Harm: { chinese: '伤门', nature: 'inauspicious', meaning: 'Harm, injury, competition' },
  Block: { chinese: '杜门', nature: 'neutral', meaning: 'Blocking, hiding, avoiding' },
  Scenery: { chinese: '景门', nature: 'neutral', meaning: 'Display, promotion, fame' },
  Death: { chinese: '死门', nature: 'inauspicious', meaning: 'Endings, litigation, mourning' },
  Fear: { chinese: '惊门', nature: 'inauspicious', meaning: 'Fear, shock, legal matters' }
};

/**
 * Environmental tier thresholds
 */
export const ENVIRONMENTAL_TIER_THRESHOLDS: Record<EnvironmentalTier, { min: number; max: number }> = {
  excellent: { min: 80, max: 100 },
  good: { min: 65, max: 79 },
  mixed: { min: 45, max: 64 },
  caution: { min: 30, max: 44 },
  challenging: { min: 0, max: 29 }
};

/**
 * Tier colors for UI
 */
export const ENVIRONMENTAL_TIER_COLORS: Record<EnvironmentalTier, string> = {
  excellent: '#22c55e',
  good: '#84cc16',
  mixed: '#f59e0b',
  caution: '#f97316',
  challenging: '#ef4444'
};

