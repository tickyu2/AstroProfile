/**
 * ============================================================================
 * CATHEDRAL LITURGICAL CALENDAR TYPES (大教堂礼历)
 * ============================================================================
 *
 * A ceremonial calendar aligned with timing, story, and ritual.
 * The rhythmic spine that ties together engines, flows, story, ritual,
 * memory, persona, mythos, and cosmology across time.
 *
 * This is not a normal calendar.
 * It is a living ceremonial cycle — the cathedral's sacred year.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { Element } from './cathedralUiTypes';

// ============================================================================
// THE FOUR GREAT SEASONS (四大季节)
// ============================================================================

/**
 * The four great seasons of the liturgical year
 */
export type LiturgicalSeason = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Story arc types for each season
 */
export type SeasonalStoryArc = 'initiation' | 'growth' | 'turning' | 'renewal';

/**
 * Ritual archetype for each season
 */
export type SeasonalRitualArchetype = 'begin' | 'deepen' | 'release' | 'heal';

/**
 * Energetic tone for each season
 */
export type EnergeticTone =
  | 'rising'
  | 'opening'
  | 'sprouting'
  | 'heat'
  | 'momentum'
  | 'expression'
  | 'cutting'
  | 'refining'
  | 'clarifying'
  | 'depth'
  | 'stillness'
  | 'reflection';

/**
 * A great season definition
 */
export interface GreatSeason {
  /** The season identifier */
  season: LiturgicalSeason;

  /** Chinese name */
  chinese: string;

  /** English subtitle */
  subtitle: string;

  /** The associated element */
  element: Element;

  /** The story arc */
  storyArc: SeasonalStoryArc;

  /** The ritual archetype */
  ritualArchetype: SeasonalRitualArchetype;

  /** The energetic tones */
  energeticTones: EnergeticTone[];

  /** Ceremonial focus areas */
  ceremonialFocus: string[];

  /** The Persona's whisper */
  personaWhisper: string;

  /** The months in this season */
  months: number[]; // 1-12
}

// ============================================================================
// THE TWELVE RITUAL MONTHS (十二礼月)
// ============================================================================

/**
 * Ritual month identifiers (1-12)
 */
export type RitualMonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Monthly ritual themes
 */
export type MonthlyTheme =
  | 'intention'
  | 'emergence'
  | 'movement'
  | 'courage'
  | 'peak'
  | 'softening'
  | 'truth'
  | 'cutting'
  | 'reaping'
  | 'descent'
  | 'healing'
  | 'preparation';

/**
 * Monthly story beats
 */
export type MonthlyStoryBeat =
  | 'opening'
  | 'rising_action'
  | 'momentum'
  | 'expansion'
  | 'climax'
  | 'tension'
  | 'confrontation'
  | 'turning'
  | 'consequence'
  | 'low_point'
  | 'renewal'
  | 'setup';

/**
 * A ritual month definition
 */
export interface RitualMonth {
  /** The month number (1-12) */
  month: RitualMonthNumber;

  /** The month's name */
  name: string;

  /** Chinese name */
  chinese: string;

  /** The theme */
  theme: MonthlyTheme;

  /** The story beat */
  storyBeat: MonthlyStoryBeat;

  /** The ritual type */
  ritual: string;

  /** Which season it belongs to */
  season: LiturgicalSeason;

  /** Description */
  description: string;
}

// ============================================================================
// THE FIFTY-TWO STORY WEEKS (五十二故事周)
// ============================================================================

/**
 * Weekly story beats (cycles through these)
 */
export type WeeklyStoryBeat =
  | 'spark'
  | 'rising'
  | 'tension'
  | 'break'
  | 'insight'
  | 'shift'
  | 'integration';

/**
 * A story week definition
 */
export interface StoryWeek {
  /** The week number (1-52) */
  weekNumber: number;

  /** The story beat for this week */
  storyBeat: WeeklyStoryBeat;

  /** Which month it falls in */
  month: RitualMonthNumber;

  /** Which season it falls in */
  season: LiturgicalSeason;

  /** The week's theme (generated) */
  theme: string;

  /** Ritual prompt for the week */
  ritualPrompt: string;

  /** Story guidance for the week */
  storyGuidance: string;

  /** Timing insight for the week */
  timingInsight: string;
}

// ============================================================================
// THE DAILY RITUAL CYCLE (日礼循环)
// ============================================================================

/**
 * The four daily quadrants
 */
export type DayQuadrant = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Quadrant actions
 */
export type QuadrantAction = 'initiate' | 'deepen' | 'heal' | 'integrate';

/**
 * A daily quadrant definition
 */
export interface DailyQuadrant {
  /** The quadrant */
  quadrant: DayQuadrant;

  /** The action type */
  action: QuadrantAction;

  /** Chinese name */
  chinese: string;

  /** The hour range */
  hourRange: [number, number]; // [startHour, endHour]

  /** Focus activities */
  focus: string[];

  /** The guidance */
  guidance: string;
}

/**
 * A complete ritual day
 */
export interface RitualDay {
  /** The date */
  date: Date;

  /** The week number */
  weekNumber: number;

  /** The month */
  month: RitualMonthNumber;

  /** The season */
  season: LiturgicalSeason;

  /** The daily quadrants */
  quadrants: DailyQuadrant[];

  /** The day's story beat (from week) */
  storyBeat: WeeklyStoryBeat;

  /** Special observance if any */
  festival?: CeremonialFestival;

  /** The day's ceremonial theme */
  theme: string;
}

// ============================================================================
// THE MICRO-TIMING WINDOWS (微时窗口)
// ============================================================================

/**
 * Window size types
 */
export type WindowSize = 'major' | 'minor' | 'micro';

/**
 * A timing window
 */
export interface TimingWindow {
  /** Window identifier */
  id: string;

  /** The size of the window */
  size: WindowSize;

  /** Start time (hour and minute) */
  startTime: { hour: number; minute: number };

  /** End time (hour and minute) */
  endTime: { hour: number; minute: number };

  /** The ritual archetype */
  ritualArchetype: string;

  /** The direction */
  direction?: string;

  /** The Qi Men palace */
  qimenPalace?: string;

  /** The story beat */
  storyBeat: string;

  /** The timing score (0-100) */
  timingScore: number;

  /** What this window is good for */
  goodFor: string[];
}

/**
 * All timing windows for a day
 */
export interface DailyTimingWindows {
  /** The date */
  date: Date;

  /** 4 major windows */
  majorWindows: TimingWindow[];

  /** 12 minor windows */
  minorWindows: TimingWindow[];

  /** 48 micro windows */
  microWindows: TimingWindow[];

  /** The optimal window of the day */
  optimalWindow: TimingWindow;
}

// ============================================================================
// THE CEREMONIAL FESTIVALS (大教堂节庆)
// ============================================================================

/**
 * Festival identifiers
 */
export type FestivalType =
  | 'first_breath'    // 初息节 - Spring begins
  | 'rising_flame'    // 升炎节 - Summer begins
  | 'blade'           // 断金节 - Autumn begins
  | 'deep_water'      // 深水节 - Winter begins
  | 'spring_gate'     // Spring equinox gate
  | 'summer_gate'     // Summer solstice gate
  | 'autumn_gate'     // Autumn equinox gate
  | 'winter_gate';    // Winter solstice gate

/**
 * A ceremonial festival
 */
export interface CeremonialFestival {
  /** The festival type */
  type: FestivalType;

  /** The festival name */
  name: string;

  /** Chinese name */
  chinese: string;

  /** Which season it marks */
  season: LiturgicalSeason;

  /** What it celebrates */
  celebrates: string;

  /** The ritual type */
  ritual: string;

  /** The story significance */
  storySignificance: string;

  /** Ceremonial activities */
  ceremonies: string[];

  /** The Persona's blessing */
  blessing: string;

  /** Approximate date (month and day) */
  approximateDate: { month: number; day: number };
}

// ============================================================================
// THE COMPLETE LITURGICAL CALENDAR
// ============================================================================

/**
 * The current position in the liturgical calendar
 */
export interface LiturgicalPosition {
  /** Current date */
  date: Date;

  /** Current season */
  season: LiturgicalSeason;

  /** Current month */
  month: RitualMonth;

  /** Current week */
  week: StoryWeek;

  /** Current quadrant */
  quadrant: DailyQuadrant;

  /** Current timing window */
  currentWindow: TimingWindow;

  /** Active festival if any */
  activeFestival?: CeremonialFestival;

  /** Days until next festival */
  daysUntilNextFestival: number;

  /** Next festival */
  nextFestival: CeremonialFestival;
}

/**
 * The complete liturgical calendar
 */
export interface LiturgicalCalendar {
  /** The calendar name */
  name: string;

  /** Chinese name */
  chinese: string;

  /** The four great seasons */
  seasons: GreatSeason[];

  /** The twelve ritual months */
  months: RitualMonth[];

  /** The eight ceremonial festivals */
  festivals: CeremonialFestival[];

  /** The daily quadrant definitions */
  dailyQuadrants: DailyQuadrant[];

  /** The weekly beat cycle */
  weeklyBeatCycle: WeeklyStoryBeat[];

  /** Current liturgical year */
  year: number;

  /** When this calendar was generated */
  generatedAt: Date;

  /** Current position */
  currentPosition: LiturgicalPosition;
}

// ============================================================================
// CALENDAR GENERATION OPTIONS
// ============================================================================

/**
 * Options for generating the liturgical calendar
 */
export interface LiturgicalCalendarOptions {
  /** The year to generate for */
  year?: number;

  /** Custom season start dates */
  seasonStartDates?: {
    spring?: { month: number; day: number };
    summer?: { month: number; day: number };
    autumn?: { month: number; day: number };
    winter?: { month: number; day: number };
  };

  /** Whether to include micro-windows */
  includeMicroWindows?: boolean;
}

// ============================================================================
// CONSTANTS - SEASONS
// ============================================================================

export const SEASON_CHINESE: Record<LiturgicalSeason, string> = {
  spring: '春·觉醒',
  summer: '夏·扩展',
  autumn: '秋·转折',
  winter: '冬·整合'
};

export const SEASON_SUBTITLES: Record<LiturgicalSeason, string> = {
  spring: 'Awakening',
  summer: 'Expansion',
  autumn: 'Turning',
  winter: 'Integration'
};

export const SEASON_ELEMENTS: Record<LiturgicalSeason, Element> = {
  spring: 'Wood',
  summer: 'Fire',
  autumn: 'Metal',
  winter: 'Water'
};

export const SEASON_STORY_ARCS: Record<LiturgicalSeason, SeasonalStoryArc> = {
  spring: 'initiation',
  summer: 'growth',
  autumn: 'turning',
  winter: 'renewal'
};

export const SEASON_RITUAL_ARCHETYPES: Record<LiturgicalSeason, SeasonalRitualArchetype> = {
  spring: 'begin',
  summer: 'deepen',
  autumn: 'release',
  winter: 'heal'
};

export const SEASON_WHISPERS: Record<LiturgicalSeason, string> = {
  spring: 'What begins now shapes the year.',
  summer: 'Let the flame reveal your shape.',
  autumn: 'What you release becomes your path.',
  winter: 'In stillness, the next story gathers.'
};

// ============================================================================
// CONSTANTS - MONTHS
// ============================================================================

export const RITUAL_MONTH_NAMES: Record<RitualMonthNumber, string> = {
  1: 'Month of First Light',
  2: 'Month of Shoots',
  3: 'Month of Winds',
  4: 'Month of Flame',
  5: 'Month of Zenith',
  6: 'Month of Heatfall',
  7: 'Month of Mirrors',
  8: 'Month of Blades',
  9: 'Month of Harvest',
  10: 'Month of Depth',
  11: 'Month of Embers',
  12: 'Month of Dawnseed'
};

export const RITUAL_MONTH_CHINESE: Record<RitualMonthNumber, string> = {
  1: '初光月',
  2: '萌芽月',
  3: '风行月',
  4: '炎心月',
  5: '至盛月',
  6: '炎落月',
  7: '镜照月',
  8: '断金月',
  9: '收获月',
  10: '深渊月',
  11: '余烬月',
  12: '曙种月'
};

export const RITUAL_MONTH_THEMES: Record<RitualMonthNumber, MonthlyTheme> = {
  1: 'intention',
  2: 'emergence',
  3: 'movement',
  4: 'courage',
  5: 'peak',
  6: 'softening',
  7: 'truth',
  8: 'cutting',
  9: 'reaping',
  10: 'descent',
  11: 'healing',
  12: 'preparation'
};

export const RITUAL_MONTH_STORY_BEATS: Record<RitualMonthNumber, MonthlyStoryBeat> = {
  1: 'opening',
  2: 'rising_action',
  3: 'momentum',
  4: 'expansion',
  5: 'climax',
  6: 'tension',
  7: 'confrontation',
  8: 'turning',
  9: 'consequence',
  10: 'low_point',
  11: 'renewal',
  12: 'setup'
};

export const RITUAL_MONTH_RITUALS: Record<RitualMonthNumber, string> = {
  1: 'Vow-setting',
  2: 'Initiation',
  3: 'Directional alignment',
  4: 'Fire rites',
  5: 'Empowerment',
  6: 'Cooling rites',
  7: 'Reflection',
  8: 'Release',
  9: 'Gratitude',
  10: 'Shadow work',
  11: 'Water rites',
  12: 'Seed rites'
};

// ============================================================================
// CONSTANTS - DAILY QUADRANTS
// ============================================================================

export const QUADRANT_CHINESE: Record<DayQuadrant, string> = {
  morning: '晨·启',
  afternoon: '午·深',
  evening: '暮·愈',
  night: '夜·合'
};

export const QUADRANT_ACTIONS: Record<DayQuadrant, QuadrantAction> = {
  morning: 'initiate',
  afternoon: 'deepen',
  evening: 'heal',
  night: 'integrate'
};

export const QUADRANT_HOURS: Record<DayQuadrant, [number, number]> = {
  morning: [6, 12],
  afternoon: [12, 18],
  evening: [18, 22],
  night: [22, 6]
};

// ============================================================================
// CONSTANTS - WEEKLY BEATS
// ============================================================================

export const WEEKLY_BEAT_CYCLE: WeeklyStoryBeat[] = [
  'spark',
  'rising',
  'tension',
  'break',
  'insight',
  'shift',
  'integration'
];

export const WEEKLY_BEAT_DESCRIPTIONS: Record<WeeklyStoryBeat, string> = {
  spark: 'A new impulse ignites',
  rising: 'Energy builds and accumulates',
  tension: 'Forces meet and press',
  break: 'Something gives way',
  insight: 'Understanding emerges',
  shift: 'Direction changes',
  integration: 'New becomes normal'
};

// ============================================================================
// CONSTANTS - FESTIVALS
// ============================================================================

export const FESTIVAL_NAMES: Record<FestivalType, string> = {
  first_breath: 'Festival of First Breath',
  rising_flame: 'Festival of Rising Flame',
  blade: 'Festival of the Blade',
  deep_water: 'Festival of Deep Water',
  spring_gate: 'The Spring Gate',
  summer_gate: 'The Summer Gate',
  autumn_gate: 'The Autumn Gate',
  winter_gate: 'The Winter Gate'
};

export const FESTIVAL_CHINESE: Record<FestivalType, string> = {
  first_breath: '初息节',
  rising_flame: '升炎节',
  blade: '断金节',
  deep_water: '深水节',
  spring_gate: '春门节',
  summer_gate: '夏门节',
  autumn_gate: '秋门节',
  winter_gate: '冬门节'
};
