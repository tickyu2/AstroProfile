/**
 * BaZi Wheels — Utility module for Four Pillar wheel visualizations
 *
 * Pure functions + constants for SVG donut-ring wheels.
 * Zero React dependencies.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface PillarWheelState {
  stemIdx: number;   // 0–9
  branchIdx: number; // 0–11
}

export interface FourPillarWheelState {
  year: PillarWheelState;
  month: PillarWheelState;
  day: PillarWheelState;
  hour: PillarWheelState;
}

export interface StemSegmentData {
  index: number;
  char: string;
  pinyin: string;
  english: string;
  element: string;
  polarity: 'Yang' | 'Yin';
}

export interface BranchSegmentData {
  index: number;
  char: string;
  pinyin: string;
  english: string;
  animal: string;
  element: string;
  polarity: 'Yang' | 'Yin';
  season: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const STEM_COUNT = 10;
export const BRANCH_COUNT = 12;
export const STEM_SLOT_DEG = 360 / STEM_COUNT;    // 36
export const BRANCH_SLOT_DEG = 360 / BRANCH_COUNT; // 30

/** 10 Heavenly Stems (天干) — ordered by index */
export const STEM_SEGMENTS: StemSegmentData[] = [
  { index: 0, char: '甲', pinyin: 'Jiǎ',  english: 'Yang Wood',  element: 'Wood',  polarity: 'Yang' },
  { index: 1, char: '乙', pinyin: 'Yǐ',   english: 'Yin Wood',   element: 'Wood',  polarity: 'Yin'  },
  { index: 2, char: '丙', pinyin: 'Bǐng', english: 'Yang Fire',  element: 'Fire',  polarity: 'Yang' },
  { index: 3, char: '丁', pinyin: 'Dīng', english: 'Yin Fire',   element: 'Fire',  polarity: 'Yin'  },
  { index: 4, char: '戊', pinyin: 'Wù',   english: 'Yang Earth', element: 'Earth', polarity: 'Yang' },
  { index: 5, char: '己', pinyin: 'Jǐ',   english: 'Yin Earth',  element: 'Earth', polarity: 'Yin'  },
  { index: 6, char: '庚', pinyin: 'Gēng', english: 'Yang Metal', element: 'Metal', polarity: 'Yang' },
  { index: 7, char: '辛', pinyin: 'Xīn',  english: 'Yin Metal',  element: 'Metal', polarity: 'Yin'  },
  { index: 8, char: '壬', pinyin: 'Rén',  english: 'Yang Water', element: 'Water', polarity: 'Yang' },
  { index: 9, char: '癸', pinyin: 'Guǐ',  english: 'Yin Water',  element: 'Water', polarity: 'Yin'  },
];

/** 12 Earthly Branches (地支) — ordered by index */
export const BRANCH_SEGMENTS: BranchSegmentData[] = [
  { index: 0,  char: '子', pinyin: 'Zǐ',   english: 'Zi',   animal: 'Rat',     element: 'Water', polarity: 'Yang', season: 'Winter'  },
  { index: 1,  char: '丑', pinyin: 'Chǒu', english: 'Chou', animal: 'Ox',      element: 'Earth', polarity: 'Yin',  season: 'Winter'  },
  { index: 2,  char: '寅', pinyin: 'Yín',  english: 'Yin',  animal: 'Tiger',   element: 'Wood',  polarity: 'Yang', season: 'Spring'  },
  { index: 3,  char: '卯', pinyin: 'Mǎo',  english: 'Mao',  animal: 'Rabbit',  element: 'Wood',  polarity: 'Yin',  season: 'Spring'  },
  { index: 4,  char: '辰', pinyin: 'Chén', english: 'Chen', animal: 'Dragon',  element: 'Earth', polarity: 'Yang', season: 'Spring'  },
  { index: 5,  char: '巳', pinyin: 'Sì',   english: 'Si',   animal: 'Snake',   element: 'Fire',  polarity: 'Yin',  season: 'Summer'  },
  { index: 6,  char: '午', pinyin: 'Wǔ',   english: 'Wu',   animal: 'Horse',   element: 'Fire',  polarity: 'Yang', season: 'Summer'  },
  { index: 7,  char: '未', pinyin: 'Wèi',  english: 'Wei',  animal: 'Goat',    element: 'Earth', polarity: 'Yin',  season: 'Summer'  },
  { index: 8,  char: '申', pinyin: 'Shēn', english: 'Shen', animal: 'Monkey',  element: 'Metal', polarity: 'Yang', season: 'Autumn'  },
  { index: 9,  char: '酉', pinyin: 'Yǒu',  english: 'You',  animal: 'Rooster', element: 'Metal', polarity: 'Yin',  season: 'Autumn'  },
  { index: 10, char: '戌', pinyin: 'Xū',   english: 'Xu',   animal: 'Dog',     element: 'Earth', polarity: 'Yang', season: 'Autumn'  },
  { index: 11, char: '亥', pinyin: 'Hài',  english: 'Hai',  animal: 'Pig',     element: 'Water', polarity: 'Yin',  season: 'Winter'  },
];

/** Element → color (matches BaziTheme.jsx ELEMENT_COLORS) */
export const ELEMENT_COLORS: Record<string, string> = {
  Wood:  '#22c55e',
  Fire:  '#ef4444',
  Earth: '#f59e0b',
  Metal: '#a1a1aa',
  Water: '#3b82f6',
};

/** Pillar labels */
export const PILLAR_LABELS = ['Year', 'Month', 'Day', 'Hour'] as const;
export const PILLAR_CHINESE = ['年柱', '月柱', '日柱', '时柱'] as const;
export const PILLAR_KEYS = ['year', 'month', 'day', 'hour'] as const;

// =============================================================================
// ROTATION
// =============================================================================

/**
 * Rotation (degrees) to place segment `idx` at the top (12 o'clock).
 * Segment 0 starts at 0° (top), so rotating by -(idx * slotDeg) brings it back.
 */
export function stemRotationDeg(stemIdx: number): number {
  return -(stemIdx * STEM_SLOT_DEG);
}

export function branchRotationDeg(branchIdx: number): number {
  return -(branchIdx * BRANCH_SLOT_DEG);
}

// =============================================================================
// SVG ARC HELPERS
// =============================================================================

/**
 * Generate an SVG arc path for a donut segment.
 * Convention: 0° = top (12 o'clock), clockwise.
 */
export function arcPath(
  cx: number, cy: number,
  innerR: number, outerR: number,
  startDeg: number, endDeg: number,
): string {
  const toRad = (d: number) => (d - 90) * (Math.PI / 180);
  const s = toRad(startDeg);
  const e = toRad(endDeg);

  const x1 = cx + outerR * Math.cos(s);
  const y1 = cy + outerR * Math.sin(s);
  const x2 = cx + outerR * Math.cos(e);
  const y2 = cy + outerR * Math.sin(e);
  const x3 = cx + innerR * Math.cos(e);
  const y3 = cy + innerR * Math.sin(e);
  const x4 = cx + innerR * Math.cos(s);
  const y4 = cy + innerR * Math.sin(s);

  const large = (endDeg - startDeg) > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

/** Center point of a segment (for text placement). */
export function segmentCenter(
  cx: number, cy: number,
  innerR: number, outerR: number,
  midDeg: number,
): { x: number; y: number } {
  const midR = (innerR + outerR) / 2;
  const rad = (midDeg - 90) * (Math.PI / 180);
  return {
    x: cx + midR * Math.cos(rad),
    y: cy + midR * Math.sin(rad),
  };
}

// =============================================================================
// DATE HELPERS
// =============================================================================

/** Shift a Date by a delta object. Returns a new Date. */
export function shiftDateBy(
  date: Date,
  delta: { years?: number; months?: number; days?: number; hours?: number },
): Date {
  const d = new Date(date);
  if (delta.years) d.setFullYear(d.getFullYear() + delta.years);
  if (delta.months) d.setMonth(d.getMonth() + delta.months);
  if (delta.days) d.setDate(d.getDate() + delta.days);
  if (delta.hours) d.setHours(d.getHours() + delta.hours);
  return d;
}

/** Convert a Date to the input format expected by calculateBaZi(). */
export function dateToCalcInput(date: Date): {
  year: number; month: number; day: number; hour: number; minute: number;
} {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

/** Format a Date as "YYYY-MM-DD HH:mm" for display. */
export function formatWheelDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

// =============================================================================
// TRUE SOLAR TIME (真太阳时) CORRECTION
// =============================================================================

/**
 * Equation of Time — seasonal correction for Earth's elliptical orbit and axial tilt.
 * Returns the offset in minutes (positive = sundial ahead of clock).
 * Uses the Spencer/Woolf approximation accurate to ~30 seconds.
 */
function equationOfTime(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000) + 1;
  const B = (2 * Math.PI / 365) * (dayOfYear - 81);
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

/**
 * Calculate True Solar Time offset in minutes.
 *
 * @param date - The clock-time Date
 * @param longitude - Birth place longitude (positive = East, negative = West)
 * @param gmtOffsetHours - Historical timezone offset in hours from UTC (e.g. -8 for PST, +8 for CST)
 * @returns offset in minutes to ADD to clock time to get True Solar Time
 *
 * Formula: TST = Clock Time + (longitude − standard_meridian) × 4 min/° + EoT
 * Standard meridian = gmtOffsetHours × 15°
 */
export function trueSolarTimeOffset(date: Date, longitude: number, gmtOffsetHours: number): number {
  const standardMeridian = gmtOffsetHours * 15;
  const longitudeCorrection = (longitude - standardMeridian) * 4; // minutes
  const eot = equationOfTime(date);
  return longitudeCorrection + eot;
}

/**
 * Apply True Solar Time correction to a Date.
 * Returns a new Date adjusted by the TST offset.
 */
export function applyTrueSolarTime(date: Date, longitude: number, gmtOffsetHours: number): Date {
  const offsetMinutes = trueSolarTimeOffset(date, longitude, gmtOffsetHours);
  const corrected = new Date(date.getTime() + offsetMinutes * 60000);
  return corrected;
}

/** Detailed TST breakdown for educational display. */
export interface TstBreakdown {
  longitude: number;
  gmtOffsetHours: number;
  standardMeridian: number;
  longitudeCorrection: number; // minutes
  equationOfTime: number;      // minutes
  totalOffset: number;          // minutes
  clockTime: Date;
  correctedTime: Date;
}

export function trueSolarTimeBreakdown(date: Date, longitude: number, gmtOffsetHours: number): TstBreakdown {
  const standardMeridian = gmtOffsetHours * 15;
  const longitudeCorrection = (longitude - standardMeridian) * 4;
  const eot = equationOfTime(date);
  const totalOffset = longitudeCorrection + eot;
  return {
    longitude,
    gmtOffsetHours,
    standardMeridian,
    longitudeCorrection,
    equationOfTime: eot,
    totalOffset,
    clockTime: date,
    correctedTime: new Date(date.getTime() + totalOffset * 60000),
  };
}

// =============================================================================
// ELEMENT GLYPHS & POLARITY
// =============================================================================

/** Chinese characters for the Five Elements */
export const ELEMENT_GLYPHS: Record<string, string> = {
  Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水',
};

/** Yin/Yang trigram line icons */
export const POLARITY_ICONS: Record<string, string> = {
  Yang: '⚊', Yin: '⚋',
};

/** Opacity multiplier for Yin/Yang brightness tinting */
export const POLARITY_TINT: Record<string, number> = {
  Yang: 1.0, Yin: 0.7,
};

// =============================================================================
// SEASONAL DATA
// =============================================================================

export const SEASON_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  Spring: { bg: 'rgba(34, 197, 94, 0.06)', border: 'rgba(34, 197, 94, 0.25)', label: 'Spring 春' },
  Summer: { bg: 'rgba(239, 68, 68, 0.06)', border: 'rgba(239, 68, 68, 0.25)', label: 'Summer 夏' },
  Autumn: { bg: 'rgba(161, 161, 170, 0.06)', border: 'rgba(161, 161, 170, 0.25)', label: 'Autumn 秋' },
  Winter: { bg: 'rgba(59, 130, 246, 0.06)', border: 'rgba(59, 130, 246, 0.25)', label: 'Winter 冬' },
};

export const SEASON_DESCRIPTIONS: Record<string, string> = {
  Spring: 'Wood energy rises \u2014 growth, ambition, new beginnings',
  Summer: 'Fire energy peaks \u2014 passion, visibility, expansion',
  Autumn: 'Metal energy descends \u2014 harvest, refinement, letting go',
  Winter: 'Water energy rests \u2014 introspection, storage, wisdom',
};

/** Dominant element per season */
export const SEASON_ELEMENT: Record<string, string> = {
  Spring: 'Wood', Summer: 'Fire', Autumn: 'Metal', Winter: 'Water',
};

export function getSeasonFromMonthBranch(branchIdx: number): string {
  return BRANCH_SEGMENTS[branchIdx]?.season || 'Spring';
}

/**
 * Seasonal strength multiplier for each element.
 * 1.0 = element is in its peak season (prosperous / 旺)
 * 0.2 = element is at its weakest (dead / 死)
 * Based on traditional BaZi 旺相休囚死 (prosperous, phase, rest, imprisoned, dead) doctrine.
 */
export const SEASONAL_STRENGTH: Record<string, Record<string, number>> = {
  Spring: { Wood: 1.0, Fire: 0.6, Earth: 0.4, Metal: 0.2, Water: 0.4 },
  Summer: { Wood: 0.6, Fire: 1.0, Earth: 0.5, Metal: 0.3, Water: 0.2 },
  Autumn: { Wood: 0.3, Fire: 0.4, Earth: 0.6, Metal: 1.0, Water: 0.5 },
  Winter: { Wood: 0.4, Fire: 0.2, Earth: 0.5, Metal: 0.6, Water: 1.0 },
};

/** Get seasonal strength for an element (0.0-1.0). */
export function getSeasonalStrength(element: string, season: string): number {
  return SEASONAL_STRENGTH[season]?.[element] ?? 0.5;
}

/**
 * Colors for element relationships to Day Master.
 * Used for root lines and ZangGanPanel indicators.
 */
export const RELATION_COLORS: Record<string, string> = {
  self:     '#a78bfa', // purple — companion / same element
  output:   '#f97316', // orange — what I produce
  wealth:   '#fbbf24', // gold   — what I control
  power:    '#ef4444', // red    — what controls me
  resource: '#22c55e', // green  — what produces me
  unknown:  '#64748b', // gray
};

export const RELATION_LABELS: Record<string, string> = {
  self:     'Self 比劫',
  output:   'Output 食傷',
  wealth:   'Wealth 財',
  power:    'Power 官殺',
  resource: 'Resource 印',
  unknown:  '—',
};

// =============================================================================
// FIVE ELEMENT CYCLES
// =============================================================================

/** Elements in Sheng cycle order for pentagon layout (clockwise from top) */
export const FIVE_ELEMENTS_CYCLE = ['Fire', 'Earth', 'Metal', 'Water', 'Wood'] as const;

/** Sheng (generating) cycle — [parent, child] */
export const SHENG_CYCLE: [string, string][] = [
  ['Wood', 'Fire'],
  ['Fire', 'Earth'],
  ['Earth', 'Metal'],
  ['Metal', 'Water'],
  ['Water', 'Wood'],
];

/** Ke (controlling) cycle — [controller, controlled] */
export const KE_CYCLE: [string, string][] = [
  ['Wood', 'Earth'],
  ['Earth', 'Water'],
  ['Water', 'Fire'],
  ['Fire', 'Metal'],
  ['Metal', 'Wood'],
];

export const SHENG_DESCRIPTIONS: Record<string, string> = {
  'Wood\u2192Fire': 'Wood feeds Fire',
  'Fire\u2192Earth': 'Fire creates Earth (ash)',
  'Earth\u2192Metal': 'Earth bears Metal (ore)',
  'Metal\u2192Water': 'Metal collects Water',
  'Water\u2192Wood': 'Water nourishes Wood',
};

export const KE_DESCRIPTIONS: Record<string, string> = {
  'Wood\u2192Earth': 'Wood parts Earth (roots)',
  'Earth\u2192Water': 'Earth dams Water',
  'Water\u2192Fire': 'Water extinguishes Fire',
  'Fire\u2192Metal': 'Fire melts Metal',
  'Metal\u2192Wood': 'Metal chops Wood',
};

// =============================================================================
// HIDDEN STEMS (藏干 Zang Gan)
// =============================================================================

export interface HiddenStemData {
  stemIndex: number;
  char: string;
  element: string;
  polarity: 'Yang' | 'Yin';
  percentage: number;
}

/**
 * Hidden stems inside each Earthly Branch, indexed by branch index (0-11).
 * Each branch contains 1-3 stems with percentage weights.
 * The first stem is always the "main qi" (本气), the rest are "residual qi" (余气/中气).
 */
export const HIDDEN_STEMS: HiddenStemData[][] = [
  // 0: 子 Zi (Rat) — pure Water
  [{ stemIndex: 9, char: '癸', element: 'Water', polarity: 'Yin', percentage: 100 }],
  // 1: 丑 Chou (Ox) — Earth treasury
  [
    { stemIndex: 5, char: '己', element: 'Earth', polarity: 'Yin', percentage: 60 },
    { stemIndex: 9, char: '癸', element: 'Water', polarity: 'Yin', percentage: 30 },
    { stemIndex: 7, char: '辛', element: 'Metal', polarity: 'Yin', percentage: 10 },
  ],
  // 2: 寅 Yin (Tiger) — Wood growth
  [
    { stemIndex: 0, char: '甲', element: 'Wood', polarity: 'Yang', percentage: 60 },
    { stemIndex: 2, char: '丙', element: 'Fire', polarity: 'Yang', percentage: 30 },
    { stemIndex: 4, char: '戊', element: 'Earth', polarity: 'Yang', percentage: 10 },
  ],
  // 3: 卯 Mao (Rabbit) — pure Wood
  [{ stemIndex: 1, char: '乙', element: 'Wood', polarity: 'Yin', percentage: 100 }],
  // 4: 辰 Chen (Dragon) — Earth treasury
  [
    { stemIndex: 4, char: '戊', element: 'Earth', polarity: 'Yang', percentage: 60 },
    { stemIndex: 1, char: '乙', element: 'Wood', polarity: 'Yin', percentage: 30 },
    { stemIndex: 9, char: '癸', element: 'Water', polarity: 'Yin', percentage: 10 },
  ],
  // 5: 巳 Si (Snake) — Fire growth
  [
    { stemIndex: 2, char: '丙', element: 'Fire', polarity: 'Yang', percentage: 60 },
    { stemIndex: 6, char: '庚', element: 'Metal', polarity: 'Yang', percentage: 30 },
    { stemIndex: 4, char: '戊', element: 'Earth', polarity: 'Yang', percentage: 10 },
  ],
  // 6: 午 Wu (Horse) — Fire peak
  [
    { stemIndex: 3, char: '丁', element: 'Fire', polarity: 'Yin', percentage: 70 },
    { stemIndex: 5, char: '己', element: 'Earth', polarity: 'Yin', percentage: 30 },
  ],
  // 7: 未 Wei (Goat) — Earth treasury
  [
    { stemIndex: 5, char: '己', element: 'Earth', polarity: 'Yin', percentage: 60 },
    { stemIndex: 3, char: '丁', element: 'Fire', polarity: 'Yin', percentage: 30 },
    { stemIndex: 1, char: '乙', element: 'Wood', polarity: 'Yin', percentage: 10 },
  ],
  // 8: 申 Shen (Monkey) — Metal growth
  [
    { stemIndex: 6, char: '庚', element: 'Metal', polarity: 'Yang', percentage: 60 },
    { stemIndex: 8, char: '壬', element: 'Water', polarity: 'Yang', percentage: 30 },
    { stemIndex: 4, char: '戊', element: 'Earth', polarity: 'Yang', percentage: 10 },
  ],
  // 9: 酉 You (Rooster) — pure Metal
  [{ stemIndex: 7, char: '辛', element: 'Metal', polarity: 'Yin', percentage: 100 }],
  // 10: 戌 Xu (Dog) — Earth treasury
  [
    { stemIndex: 4, char: '戊', element: 'Earth', polarity: 'Yang', percentage: 60 },
    { stemIndex: 7, char: '辛', element: 'Metal', polarity: 'Yin', percentage: 30 },
    { stemIndex: 3, char: '丁', element: 'Fire', polarity: 'Yin', percentage: 10 },
  ],
  // 11: 亥 Hai (Pig) — Water growth
  [
    { stemIndex: 8, char: '壬', element: 'Water', polarity: 'Yang', percentage: 70 },
    { stemIndex: 0, char: '甲', element: 'Wood', polarity: 'Yang', percentage: 30 },
  ],
];

// =============================================================================
// TEN GODS (十神) MAPPING
// =============================================================================

export interface TenGodInfo {
  chinese: string;
  pinyin: string;
  english: string;
  category: string;
}

/** Element production cycle (Sheng): parent → child */
const SHENG_PRODUCES: Record<string, string> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
};

/** Element controlling cycle (Ke): controller → controlled */
const KE_CONTROLS_MAP: Record<string, string> = {
  Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
};

export function getElementRelation(dmElement: string, targetElement: string): string {
  if (dmElement === targetElement) return 'self';
  if (SHENG_PRODUCES[dmElement] === targetElement) return 'output';
  if (SHENG_PRODUCES[targetElement] === dmElement) return 'resource';
  if (KE_CONTROLS_MAP[dmElement] === targetElement) return 'wealth';
  if (KE_CONTROLS_MAP[targetElement] === dmElement) return 'power';
  return 'unknown';
}

const TEN_GODS_DATA: Record<string, TenGodInfo> = {
  'self-same':     { chinese: '比肩', pinyin: 'Bǐ Jiān',     english: 'Companion',       category: 'Self' },
  'self-diff':     { chinese: '劫財', pinyin: 'Jié Cái',      english: 'Rob Wealth',      category: 'Self' },
  'output-same':   { chinese: '食神', pinyin: 'Shí Shén',     english: 'Eating God',      category: 'Output' },
  'output-diff':   { chinese: '傷官', pinyin: 'Shāng Guān',   english: 'Hurting Officer', category: 'Output' },
  'wealth-same':   { chinese: '偏財', pinyin: 'Piān Cái',     english: 'Indirect Wealth', category: 'Wealth' },
  'wealth-diff':   { chinese: '正財', pinyin: 'Zhèng Cái',    english: 'Direct Wealth',   category: 'Wealth' },
  'power-same':    { chinese: '七殺', pinyin: 'Qī Shā',       english: 'Seven Killings',  category: 'Power' },
  'power-diff':    { chinese: '正官', pinyin: 'Zhèng Guān',   english: 'Direct Officer',  category: 'Power' },
  'resource-same': { chinese: '偏印', pinyin: 'Piān Yìn',     english: 'Indirect Seal',   category: 'Resource' },
  'resource-diff': { chinese: '正印', pinyin: 'Zhèng Yìn',    english: 'Direct Seal',     category: 'Resource' },
};

/**
 * Get the Ten God (十神) relationship between a Day Master and a target stem.
 * Returns null if the relationship is unknown.
 */
export function getTenGod(
  dmElement: string, dmPolarity: string,
  targetElement: string, targetPolarity: string,
): TenGodInfo | null {
  const relation = getElementRelation(dmElement, targetElement);
  if (relation === 'unknown') return null;
  const polarityKey = dmPolarity === targetPolarity ? 'same' : 'diff';
  return TEN_GODS_DATA[`${relation}-${polarityKey}`] || null;
}

// =============================================================================
// TOOLTIP BUILDERS
// =============================================================================

export function buildStemTooltip(seg: StemSegmentData): string {
  return `${seg.char} ${seg.pinyin}\n${seg.english}\n${ELEMENT_GLYPHS[seg.element]} ${seg.element} \u00b7 ${POLARITY_ICONS[seg.polarity]} ${seg.polarity}`;
}

export function buildBranchTooltip(seg: BranchSegmentData, dmElement?: string, dmPolarity?: string): string {
  const hidden = HIDDEN_STEMS[seg.index];
  let base = `${seg.char} ${seg.pinyin} \u2014 ${seg.animal}\n${ELEMENT_GLYPHS[seg.element]} ${seg.element} \u00b7 ${POLARITY_ICONS[seg.polarity]} ${seg.polarity}\nSeason: ${seg.season}`;
  if (hidden && hidden.length > 0) {
    base += '\n\u2500\u2500 Hidden Stems (\u85CF\u5E72) \u2500\u2500';
    for (const h of hidden) {
      let line = `\n${h.char} ${ELEMENT_GLYPHS[h.element]} ${h.element} (${h.percentage}%)`;
      if (dmElement && dmPolarity) {
        const tg = getTenGod(dmElement, dmPolarity, h.element, h.polarity);
        if (tg) line += ` \u2192 ${tg.chinese} ${tg.english}`;
      }
      base += line;
    }
  }
  return base;
}

// =============================================================================
// M. QI FLOW LEGEND DATA
// =============================================================================

export const QI_FLOW_STEPS = [
  { label: 'Year \u2192 Month', meaning: 'Ancestral Qi flows into seasonal Qi' },
  { label: 'Month \u2192 Day',  meaning: 'Seasonal Qi shapes the Day Master' },
  { label: 'Day \u2192 Hour',   meaning: 'Self Qi expresses into actions & legacy' },
] as const;

// =============================================================================
// P. DAY MASTER DESCRIPTIONS
// =============================================================================

export const DAY_MASTER_DESCRIPTIONS: Record<string, string> = {
  Wood:  'Growth, direction, benevolence \u2014 the living tree.',
  Fire:  'Illumination, passion, charisma \u2014 the radiant flame.',
  Earth: 'Stability, nourishment, integrity \u2014 the fertile ground.',
  Metal: 'Precision, discipline, justice \u2014 the refined blade.',
  Water: 'Wisdom, adaptability, depth \u2014 the flowing river.',
};

// =============================================================================
// R. CYCLE JUMP DESCRIPTIONS
// =============================================================================

export const CYCLE_JUMP_INFO = [
  {
    label: '60-Year Cycle',
    chinese: '\u516D\u5341\u7532\u5B50',
    meaning: 'Full JiaZi cycle \u2014 all 60 stem\u2013branch pairs.',
    example: '\u7532\u5B50 \u2192 \u7678\u4EA5',
  },
  {
    label: '60-Day Cycle',
    chinese: '\u65E5\u67F1\u5FAA\u74B0',
    meaning: 'Daily stem\u2013branch cycle repeats every 60 days.',
    example: 'Used for Day Master shifts.',
  },
  {
    label: '12-Hour Cycle',
    chinese: '\u5341\u4E8C\u6642\u8FB0',
    meaning: 'Earthly Branches cycle every 2 hours.',
    example: '\u5B50 \u2192 \u4E11 \u2192 \u5BC5 \u2192 \u2026 \u2192 \u4EA5',
  },
] as const;

// =============================================================================
// S. SOLAR TERMS (二十四节气)
// =============================================================================

export interface SolarTermData {
  index: number;
  name: string;
  chinese: string;
  pinyin: string;
  /** Approximate month (1-12) and day when this term starts */
  approxMonth: number;
  approxDay: number;
  season: string;
  element: string;
  type: 'jie' | 'qi';  // Jie = month-boundary, Qi = mid-month
  description: string;
}

/**
 * 24 Solar Terms in order.
 * Jie (节) terms mark BaZi month boundaries.
 * Qi (气) terms are mid-month markers.
 * Approximate dates are Gregorian averages.
 */
export const SOLAR_TERMS: SolarTermData[] = [
  { index: 0,  name: 'Lichun',      chinese: '立春', pinyin: 'Lìchūn',      approxMonth: 2,  approxDay: 4,  season: 'Spring', element: 'Wood',  type: 'jie', description: 'Start of Spring' },
  { index: 1,  name: 'Yushui',      chinese: '雨水', pinyin: 'Yǔshuǐ',     approxMonth: 2,  approxDay: 19, season: 'Spring', element: 'Wood',  type: 'qi',  description: 'Rain Water' },
  { index: 2,  name: 'Jingzhe',     chinese: '惊蛰', pinyin: 'Jīngzhé',     approxMonth: 3,  approxDay: 6,  season: 'Spring', element: 'Wood',  type: 'jie', description: 'Awakening of Insects' },
  { index: 3,  name: 'Chunfen',     chinese: '春分', pinyin: 'Chūnfēn',     approxMonth: 3,  approxDay: 21, season: 'Spring', element: 'Wood',  type: 'qi',  description: 'Spring Equinox' },
  { index: 4,  name: 'Qingming',    chinese: '清明', pinyin: 'Qīngmíng',    approxMonth: 4,  approxDay: 5,  season: 'Spring', element: 'Wood',  type: 'jie', description: 'Clear and Bright' },
  { index: 5,  name: 'Guyu',        chinese: '谷雨', pinyin: 'Gǔyǔ',       approxMonth: 4,  approxDay: 20, season: 'Spring', element: 'Earth', type: 'qi',  description: 'Grain Rain' },
  { index: 6,  name: 'Lixia',       chinese: '立夏', pinyin: 'Lìxià',       approxMonth: 5,  approxDay: 6,  season: 'Summer', element: 'Fire',  type: 'jie', description: 'Start of Summer' },
  { index: 7,  name: 'Xiaoman',     chinese: '小满', pinyin: 'Xiǎomǎn',     approxMonth: 5,  approxDay: 21, season: 'Summer', element: 'Fire',  type: 'qi',  description: 'Grain Buds' },
  { index: 8,  name: 'Mangzhong',   chinese: '芒种', pinyin: 'Mángzhòng',   approxMonth: 6,  approxDay: 6,  season: 'Summer', element: 'Fire',  type: 'jie', description: 'Grain in Ear' },
  { index: 9,  name: 'Xiazhi',      chinese: '夏至', pinyin: 'Xiàzhì',      approxMonth: 6,  approxDay: 21, season: 'Summer', element: 'Fire',  type: 'qi',  description: 'Summer Solstice' },
  { index: 10, name: 'Xiaoshu',     chinese: '小暑', pinyin: 'Xiǎoshǔ',     approxMonth: 7,  approxDay: 7,  season: 'Summer', element: 'Earth', type: 'jie', description: 'Minor Heat' },
  { index: 11, name: 'Dashu',       chinese: '大暑', pinyin: 'Dàshǔ',       approxMonth: 7,  approxDay: 23, season: 'Summer', element: 'Earth', type: 'qi',  description: 'Major Heat' },
  { index: 12, name: 'Liqiu',       chinese: '立秋', pinyin: 'Lìqiū',       approxMonth: 8,  approxDay: 7,  season: 'Autumn', element: 'Metal', type: 'jie', description: 'Start of Autumn' },
  { index: 13, name: 'Chushu',      chinese: '处暑', pinyin: 'Chǔshǔ',      approxMonth: 8,  approxDay: 23, season: 'Autumn', element: 'Metal', type: 'qi',  description: 'End of Heat' },
  { index: 14, name: 'Bailu',       chinese: '白露', pinyin: 'Báilù',       approxMonth: 9,  approxDay: 8,  season: 'Autumn', element: 'Metal', type: 'jie', description: 'White Dew' },
  { index: 15, name: 'Qiufen',      chinese: '秋分', pinyin: 'Qiūfēn',     approxMonth: 9,  approxDay: 23, season: 'Autumn', element: 'Metal', type: 'qi',  description: 'Autumn Equinox' },
  { index: 16, name: 'Hanlu',       chinese: '寒露', pinyin: 'Hánlù',       approxMonth: 10, approxDay: 8,  season: 'Autumn', element: 'Earth', type: 'jie', description: 'Cold Dew' },
  { index: 17, name: 'Shuangjiang', chinese: '霜降', pinyin: 'Shuāngjiàng', approxMonth: 10, approxDay: 23, season: 'Autumn', element: 'Earth', type: 'qi',  description: 'Frost Descent' },
  { index: 18, name: 'Lidong',      chinese: '立冬', pinyin: 'Lìdōng',      approxMonth: 11, approxDay: 7,  season: 'Winter', element: 'Water', type: 'jie', description: 'Start of Winter' },
  { index: 19, name: 'Xiaoxue',     chinese: '小雪', pinyin: 'Xiǎoxuě',     approxMonth: 11, approxDay: 22, season: 'Winter', element: 'Water', type: 'qi',  description: 'Minor Snow' },
  { index: 20, name: 'Daxue',       chinese: '大雪', pinyin: 'Dàxuě',       approxMonth: 12, approxDay: 7,  season: 'Winter', element: 'Water', type: 'jie', description: 'Major Snow' },
  { index: 21, name: 'Dongzhi',     chinese: '冬至', pinyin: 'Dōngzhì',     approxMonth: 12, approxDay: 22, season: 'Winter', element: 'Water', type: 'qi',  description: 'Winter Solstice' },
  { index: 22, name: 'Xiaohan',     chinese: '小寒', pinyin: 'Xiǎohán',     approxMonth: 1,  approxDay: 6,  season: 'Winter', element: 'Earth', type: 'jie', description: 'Minor Cold' },
  { index: 23, name: 'Dahan',       chinese: '大寒', pinyin: 'Dàhán',       approxMonth: 1,  approxDay: 20, season: 'Winter', element: 'Earth', type: 'qi',  description: 'Major Cold' },
];

/** Angle per solar term in a 360° wheel (24 × 15° = 360°) */
export const SOLAR_TERM_SLOT_DEG = 360 / 24; // 15

/** Get the approximate solar term index for a given date (0-23). */
export function getSolarTermIndex(date: Date): number {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayOfYear = m * 31 + d; // rough approximation
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const t = SOLAR_TERMS[i];
    const tDay = t.approxMonth * 31 + t.approxDay;
    const dist = Math.abs(dayOfYear - tDay);
    const wrapDist = Math.min(dist, 12 * 31 - dist);
    if (wrapDist < bestDist) {
      bestDist = wrapDist;
      best = i;
    }
  }
  return best;
}

// =============================================================================
// U. ELEMENT WEATHER SYSTEM
// =============================================================================

export interface ElementWeather {
  dominant: string;
  label: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  particleColor: string;
}

const ELEMENT_WEATHER_MAP: Record<string, ElementWeather> = {
  Wood: {
    dominant: 'Wood',
    label: 'Growing Breeze',
    description: 'Wood Qi dominates — expansive, rising energy',
    gradientFrom: 'rgba(34, 197, 94, 0.08)',
    gradientTo: 'rgba(16, 185, 129, 0.03)',
    particleColor: '#22c55e',
  },
  Fire: {
    dominant: 'Fire',
    label: 'Blazing Sun',
    description: 'Fire Qi dominates — radiant, transformative energy',
    gradientFrom: 'rgba(239, 68, 68, 0.08)',
    gradientTo: 'rgba(249, 115, 22, 0.03)',
    particleColor: '#ef4444',
  },
  Earth: {
    dominant: 'Earth',
    label: 'Steady Ground',
    description: 'Earth Qi dominates — stable, nurturing energy',
    gradientFrom: 'rgba(245, 158, 11, 0.08)',
    gradientTo: 'rgba(217, 119, 6, 0.03)',
    particleColor: '#f59e0b',
  },
  Metal: {
    dominant: 'Metal',
    label: 'Clear Frost',
    description: 'Metal Qi dominates — precise, refining energy',
    gradientFrom: 'rgba(161, 161, 170, 0.08)',
    gradientTo: 'rgba(113, 113, 122, 0.03)',
    particleColor: '#a1a1aa',
  },
  Water: {
    dominant: 'Water',
    label: 'Deep Current',
    description: 'Water Qi dominates — flowing, introspective energy',
    gradientFrom: 'rgba(59, 130, 246, 0.08)',
    gradientTo: 'rgba(37, 99, 235, 0.03)',
    particleColor: '#3b82f6',
  },
};

/**
 * Determine the element weather from chart element percentages.
 */
export function getElementWeather(
  percentages: Record<string, string | number>,
): ElementWeather {
  let maxEl = 'Wood';
  let maxPct = 0;
  for (const el of Object.keys(percentages)) {
    const pct = typeof percentages[el] === 'string' ? parseFloat(percentages[el] as string) : (percentages[el] as number);
    if (pct > maxPct) {
      maxPct = pct;
      maxEl = el;
    }
  }
  return ELEMENT_WEATHER_MAP[maxEl] || ELEMENT_WEATHER_MAP.Wood;
}

// =============================================================================
// W. ELEMENTAL STORM ALERTS
// =============================================================================

export interface ElementStormAlert {
  level: 'mild' | 'strong' | 'extreme';
  type: string;
  element: string;
  message: string;
  color: string;
}

/**
 * Detect elemental imbalances and clashes in the chart.
 */
export function detectElementStorms(
  percentages: Record<string, string | number>,
  interactions?: Array<{ type: string; branch1: string; branch2: string }>,
): ElementStormAlert[] {
  const alerts: ElementStormAlert[] = [];

  for (const el of Object.keys(percentages)) {
    const pct = typeof percentages[el] === 'string' ? parseFloat(percentages[el] as string) : (percentages[el] as number);
    const color = ELEMENT_COLORS[el] || '#64748b';

    if (pct >= 40) {
      alerts.push({
        level: 'extreme',
        type: 'Dominance',
        element: el,
        message: `${el} at ${pct.toFixed(1)}% \u2014 extreme dominance. This element overwhelms the chart.`,
        color,
      });
    } else if (pct >= 30) {
      alerts.push({
        level: 'strong',
        type: 'Dominance',
        element: el,
        message: `${el} at ${pct.toFixed(1)}% \u2014 strong presence. May overpower weaker elements.`,
        color,
      });
    }

    if (pct < 5) {
      alerts.push({
        level: pct === 0 ? 'extreme' : 'strong',
        type: 'Void',
        element: el,
        message: `${el} at ${pct.toFixed(1)}% \u2014 nearly absent. ${el} qualities may be underdeveloped.`,
        color,
      });
    } else if (pct < 10) {
      alerts.push({
        level: 'mild',
        type: 'Weakness',
        element: el,
        message: `${el} at ${pct.toFixed(1)}% \u2014 weak. May benefit from ${el} support in luck pillars.`,
        color,
      });
    }
  }

  // Check for clashes from interactions
  if (interactions) {
    for (const ix of interactions) {
      if (ix.type === 'Clash') {
        alerts.push({
          level: 'strong',
          type: 'Clash',
          element: '',
          message: `${ix.branch1}\u2013${ix.branch2} clash detected \u2014 internal tension between pillars.`,
          color: '#ef4444',
        });
      }
    }
  }

  // Sort: extreme first, then strong, then mild
  const order = { extreme: 0, strong: 1, mild: 2 };
  alerts.sort((a, b) => order[a.level] - order[b.level]);
  return alerts;
}

// =============================================================================
// V. HEAVEN-EARTH-HUMAN ALIGNMENT
// =============================================================================

export interface AlignmentData {
  pillarIdx: number;
  label: string;
  heaven: string;     // stem element
  earth: string;      // branch element
  human: string;      // dominant hidden stem element
  aligned: boolean;   // all three share same element
  harmonic: boolean;  // at least two share, or sheng relationship
}

/**
 * Calculate Heaven-Earth-Human alignment for each pillar.
 * Heaven = Stem, Earth = Branch, Human = main hidden stem.
 */
export function getAlignmentData(
  pillars: Array<{
    stem: { element: string; index: number };
    branch: { element: string; index: number };
  }>,
): AlignmentData[] {
  return pillars.map((p, i) => {
    const heaven = p.stem.element;
    const earth = p.branch.element;
    const hs = HIDDEN_STEMS[p.branch.index];
    const human = hs?.[0]?.element || earth;
    const aligned = heaven === earth && earth === human;
    const harmonic = aligned ||
      heaven === earth || earth === human || heaven === human ||
      SHENG_PRODUCES[heaven] === earth || SHENG_PRODUCES[earth] === human;
    return {
      pillarIdx: i,
      label: PILLAR_LABELS[i],
      heaven,
      earth,
      human,
      aligned,
      harmonic,
    };
  });
}

// =============================================================================
// X. DESTINY CYCLE NAVIGATOR
// =============================================================================

export interface DestinyYear {
  year: number;
  stemIdx: number;
  branchIdx: number;
  stem: StemSegmentData;
  branch: BranchSegmentData;
  ganZhi: string;
  isCurrent: boolean;
}

/**
 * Build a list of destiny years centered on a given year.
 * Uses the sexagenary cycle: stemIdx = (year - 4) % 10, branchIdx = (year - 4) % 12.
 */
export function buildDestinyYears(centerYear: number, radius: number = 30): DestinyYear[] {
  const currentYear = new Date().getFullYear();
  const years: DestinyYear[] = [];
  for (let y = centerYear - radius; y <= centerYear + radius; y++) {
    const stemIdx = ((y - 4) % 10 + 10) % 10;
    const branchIdx = ((y - 4) % 12 + 12) % 12;
    const stem = STEM_SEGMENTS[stemIdx];
    const branch = BRANCH_SEGMENTS[branchIdx];
    years.push({
      year: y,
      stemIdx,
      branchIdx,
      stem,
      branch,
      ganZhi: `${stem.char}${branch.char}`,
      isCurrent: y === currentYear,
    });
  }
  return years;
}

/** Get the stem-branch pair for a specific year. */
export function getYearStemBranch(year: number): { stem: StemSegmentData; branch: BranchSegmentData } {
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  const branchIdx = ((year - 4) % 12 + 12) % 12;
  return { stem: STEM_SEGMENTS[stemIdx], branch: BRANCH_SEGMENTS[branchIdx] };
}

// =============================================================================
// Z. FATE CURRENTS
// =============================================================================

export interface FateCurrentPoint {
  age: number;
  year: number;
  stemElement: string;
  branchElement: string;
  elements: Record<string, number>;
}

/**
 * Build decade-by-decade element projections.
 * Each decade's annual pillar modulates the natal element balance.
 */
export function buildFateCurrents(
  birthYear: number,
  basePercentages: Record<string, string | number>,
): FateCurrentPoint[] {
  const base: Record<string, number> = {};
  for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
    const v = basePercentages[el];
    base[el] = typeof v === 'string' ? parseFloat(v) : (v as number) || 20;
  }
  const points: FateCurrentPoint[] = [];
  for (let age = 0; age <= 80; age += 10) {
    const year = birthYear + age;
    const { stem, branch } = getYearStemBranch(year);
    const elements: Record<string, number> = { ...base };
    elements[stem.element] = (elements[stem.element] || 20) + 8;
    elements[branch.element] = (elements[branch.element] || 20) + 5;
    const total = Object.values(elements).reduce((s, v) => s + v, 0);
    for (const el of Object.keys(elements)) {
      elements[el] = (elements[el] / total) * 100;
    }
    points.push({ age, year, stemElement: stem.element, branchElement: branch.element, elements });
  }
  return points;
}

// =============================================================================
// AA. SYNASTRY LINKS
// =============================================================================

const BRANCH_COMBINATIONS: [number, number][] = [
  [0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7],
];
const BRANCH_CLASHES: [number, number][] = [
  [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
];
const KE_CONTROLS: Record<string, string> = {
  Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire',
};

export interface SynastryLink {
  fromPillar: number;
  toPillar: number;
  type: 'support' | 'control' | 'clash' | 'combine';
  description: string;
  color: string;
}

/**
 * Compute element relationships between two charts' pillars.
 */
export function computeSynastryLinks(
  pillarsA: Array<{ stem: { element: string; index: number }; branch: { element: string; index: number } }>,
  pillarsB: Array<{ stem: { element: string; index: number }; branch: { element: string; index: number } }>,
): SynastryLink[] {
  const links: SynastryLink[] = [];
  const labels = ['Year', 'Month', 'Day', 'Hour'];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const stemA = pillarsA[i]?.stem?.element;
      const stemB = pillarsB[j]?.stem?.element;
      if (!stemA || !stemB) continue;
      if (i === j || Math.abs(i - j) <= 1) {
        if (stemA === stemB) {
          links.push({ fromPillar: i, toPillar: j, type: 'combine',
            description: `${labels[i]}\u2194${labels[j]}: Same ${stemA} \u2014 deep resonance`, color: '#3b82f6' });
        } else if (SHENG_PRODUCES[stemA] === stemB) {
          links.push({ fromPillar: i, toPillar: j, type: 'support',
            description: `${labels[i]}\u2192${labels[j]}: ${stemA} nourishes ${stemB}`, color: '#22c55e' });
        } else if (KE_CONTROLS[stemA] === stemB) {
          links.push({ fromPillar: i, toPillar: j, type: 'control',
            description: `${labels[i]}\u2192${labels[j]}: ${stemA} controls ${stemB}`, color: '#f59e0b' });
        }
      }
      if (i === j) {
        const bA = pillarsA[i]?.branch?.index;
        const bB = pillarsB[j]?.branch?.index;
        if (bA !== undefined && bB !== undefined) {
          if (BRANCH_COMBINATIONS.some(([a, b]) => (bA === a && bB === b) || (bA === b && bB === a))) {
            links.push({ fromPillar: i, toPillar: j, type: 'combine',
              description: `${labels[i]}: Branch \u516D\u5408 combination \u2014 natural affinity`, color: '#a78bfa' });
          }
          if (BRANCH_CLASHES.some(([a, b]) => (bA === a && bB === b) || (bA === b && bB === a))) {
            links.push({ fromPillar: i, toPillar: j, type: 'clash',
              description: `${labels[i]}: Branch \u516D\u51B2 clash \u2014 tension`, color: '#ef4444' });
          }
        }
      }
    }
  }
  return links;
}

// =============================================================================
// AB. LIFE THEMES
// =============================================================================

export interface LifeTheme {
  title: string;
  description: string;
  element: string;
  icon: string;
}

export function extractLifeThemes(
  percentages: Record<string, string | number>,
  dayMasterElement?: string,
): LifeTheme[] {
  const themes: LifeTheme[] = [];
  const p: Record<string, number> = {};
  for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
    const v = percentages[el];
    p[el] = typeof v === 'string' ? parseFloat(v) : (v as number) || 0;
  }
  if (p.Wood >= 30) themes.push({ title: 'Growth & Renewal', description: 'A life driven by learning, growth, and constant reinvention. Like bamboo \u2014 flexible yet unstoppable.', element: 'Wood', icon: '\u{1F33F}' });
  if (p.Fire >= 30) themes.push({ title: 'Radiance & Vision', description: 'Charisma and passion light the path. Others are drawn to your warmth and clarity of purpose.', element: 'Fire', icon: '\u{1F525}' });
  if (p.Earth >= 30) themes.push({ title: 'Anchor & Service', description: 'Duty, stability, and being the grounding force for others define your story.', element: 'Earth', icon: '\u26F0' });
  if (p.Metal >= 30) themes.push({ title: 'Refinement & Justice', description: 'Precision, integrity, and the courage to cut away what no longer serves.', element: 'Metal', icon: '\u2694' });
  if (p.Water >= 30) themes.push({ title: 'Depth & Wisdom', description: 'Introspection and emotional intelligence flow through everything, like a deep river.', element: 'Water', icon: '\u{1F30A}' });
  if (p.Wood < 5) themes.push({ title: 'Quiet Seeds', description: 'With little Wood, new beginnings require conscious effort. Plant deliberately.', element: 'Wood', icon: '\u{1F331}' });
  if (p.Fire < 5) themes.push({ title: 'Hidden Flame', description: 'Low Fire means charisma must be cultivated. Your light burns steady, not flashy.', element: 'Fire', icon: '\u{1F56F}' });
  if (p.Earth < 5) themes.push({ title: 'Ungrounded Path', description: 'Without much Earth, stability comes from routines you build, not ones you inherit.', element: 'Earth', icon: '\u{1F9ED}' });
  if (p.Metal < 5) themes.push({ title: 'Soft Boundaries', description: 'Little Metal means learning to say no is a life lesson. Structure is your ally.', element: 'Metal', icon: '\u{1F514}' });
  if (p.Water < 5) themes.push({ title: 'Still Waters', description: 'Low Water suggests tapping into intuition requires deliberate quiet and reflection.', element: 'Water', icon: '\u{1F4A7}' });
  if (dayMasterElement) {
    const dmPct = p[dayMasterElement] || 0;
    if (dmPct >= 25) themes.push({ title: 'Self-Empowered', description: `Your Day Master (${dayMasterElement}) is well-supported \u2014 strong self-identity and confidence.`, element: dayMasterElement, icon: '\u{1F451}' });
    else if (dmPct < 10) themes.push({ title: 'The Underdog Journey', description: `Your Day Master (${dayMasterElement}) is relatively weak \u2014 resilience and adaptation become superpowers.`, element: dayMasterElement, icon: '\u{1F98B}' });
  }
  if (themes.length === 0) {
    themes.push({ title: 'Balanced Currents', description: 'No single element dominates \u2014 life themes emerge from subtle interplay rather than extremes.', element: 'Earth', icon: '\u262F' });
  }
  return themes;
}

// =============================================================================
// AC. STORYBOOK NARRATIVE
// =============================================================================

export function buildStorybookNarrative(params: {
  dayMasterElement: string;
  dayMasterPolarity: string;
  dayMasterChar: string;
  dominantElement: string;
  weakestElement: string;
  season: string;
  themes: LifeTheme[];
}): string {
  const { dayMasterElement, dayMasterPolarity, dayMasterChar, dominantElement, weakestElement, season, themes } = params;
  const poetry: Record<string, string> = {
    Spring: 'when the earth stirs with new life and seeds push through frozen soil',
    Summer: 'when the sun blazes at its peak and all things reach toward the light',
    Autumn: 'when the harvest calls and the world prepares its gifts of wisdom',
    Winter: 'when silence blankets the earth and deep roots gather strength unseen',
  };
  const metaphors: Record<string, string> = {
    Wood: 'a young tree bending in the wind yet never breaking',
    Fire: 'a lantern illuminating the path for those who follow',
    Earth: 'a mountain standing patient through ten thousand seasons',
    Metal: 'a bell whose clear tone cuts through the noise of the world',
    Water: 'a river finding its way through every landscape it encounters',
  };
  const themeLines = themes.slice(0, 3).map(t => `**${t.title}** \u2014 ${t.description}`).join('\n\n');
  return `In a season of **${season}**, ${poetry[season] || 'when the cosmic clock aligned'}, a soul arrived bearing the mark of **${dayMasterChar}** \u2014 ${dayMasterPolarity} ${dayMasterElement}.

Like ${metaphors[dayMasterElement] || 'a force of nature'}, this Day Master shapes how this life meets the world.

The chart breathes with the energy of **${dominantElement}**, which colors the landscape of destiny. Yet **${weakestElement}** whispers from the margins \u2014 not as a weakness, but as an invitation to grow in an unfamiliar direction.

${themeLines}

The decades ahead will bring shifting currents \u2014 years when ${dominantElement} surges and years when ${weakestElement} finally blooms. Through it all, the ${dayMasterElement} Day Master remains the central axis, the unchanging self around which the elemental dance unfolds.

This is not a fixed fate, but a living map \u2014 showing where the currents flow strongest, and where conscious effort can redirect the river of life.`;
}

// =============================================================================
// Q. HIDDEN STEM STORY BUILDER
// =============================================================================

export function buildHiddenStemStory(
  h: HiddenStemData,
  dmElement: string,
  dmPolarity: string,
  season: string,
): string {
  const stemSeg = STEM_SEGMENTS[h.stemIndex];
  const tenGod = getTenGod(dmElement, dmPolarity, h.element, h.polarity);
  const tenGodLabel = tenGod ? `${tenGod.chinese} ${tenGod.english}` : 'Unknown';
  const relation = getElementRelation(dmElement, h.element);
  const strength = getSeasonalStrength(h.element, season);
  const strengthLabel = strength >= 0.8 ? 'prosperous (\u65FA)' : strength >= 0.5 ? 'moderate (\u76F8)' : strength >= 0.3 ? 'resting (\u4F11)' : 'weakened (\u56DA)';

  return [
    `${stemSeg?.char || h.char} \u2014 ${h.element} ${h.polarity}`,
    '',
    `As a hidden stem, ${stemSeg?.char || h.char} expresses itself subtly within the branch.`,
    `Its nature is ${h.element}, symbolized by ${ELEMENT_GLYPHS[h.element]}.`,
    '',
    `Ten God Role: ${tenGodLabel}`,
    `This ${relation} relationship means ${h.element} acts as ${tenGodLabel} toward your Day Master (${dmElement}).`,
    '',
    `Seasonal Influence:`,
    `In ${season}, ${h.element} is ${strengthLabel} (${Math.round(strength * 100)}% strength).`,
    '',
    `Contribution: ${h.percentage}% of the branch\u2019s internal energy.`,
    strength >= 0.7
      ? `This hidden stem is energized by the seasonal Qi \u2014 its influence is amplified.`
      : strength <= 0.3
        ? `This hidden stem is restrained by the seasonal Qi \u2014 its influence is muted.`
        : `This hidden stem operates at moderate seasonal resonance.`,
  ].join('\n');
}
