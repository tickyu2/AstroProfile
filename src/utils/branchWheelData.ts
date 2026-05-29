/**
 * branchWheelData.ts — Data builders for the BaZi Branch Wheel visualization.
 *
 * Produces arc data structures consumed by BaZiBranchWheel (D3).
 * Tiger (寅) sits at 12 o'clock (0 rad), proceeding clockwise through the
 * seasonal cycle: Spring → Summer → Autumn → Winter.
 */

import {
  BRANCH_SEGMENTS,
  HIDDEN_STEMS,
  ELEMENT_COLORS,
  STEM_SEGMENTS,
  getSeasonalStrength,
  type HiddenStemData,
} from './baziWheels';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEG_PER_BRANCH = 30; // 360 / 12
const RAD_PER_BRANCH = (DEG_PER_BRANCH * Math.PI) / 180; // π/6

/** Display order: Tiger at position 0 (12 o'clock), clockwise through cycle */
export const WHEEL_ORDER: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

/** Season colors matching TropicalSeasonsPage convention */
export const SEASON_COLORS: Record<string, string> = {
  Spring: '#4ade80',
  Summer: '#fbbf24',
  Autumn: '#f97316',
  Winter: '#94a3b8',
};

/** Phase within each season triplet */
const PHASE_MAP: Record<number, 'Beginning' | 'Core' | 'Transition'> = {
  0: 'Beginning',
  1: 'Core',
  2: 'Transition',
};

/** Animal emoji glyphs */
export const ANIMAL_GLYPHS: Record<string, string> = {
  Rat: '🐀', Ox: '🐂', Tiger: '🐅', Rabbit: '🐇',
  Dragon: '🐉', Snake: '🐍', Horse: '🐎', Goat: '🐐',
  Monkey: '🐒', Rooster: '🐓', Dog: '🐕', Pig: '🐖',
};

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface BranchWheelArc {
  branchIndex: number;
  displayPos: number;       // 0-11 position on wheel (0 = top)
  char: string;
  pinyin: string;
  animal: string;
  element: string;
  polarity: 'Yang' | 'Yin';
  season: string;
  phase: 'Beginning' | 'Core' | 'Transition';
  startAngle: number;       // radians, 0 = 12 o'clock
  endAngle: number;
  color: string;
  glyph: string;
}

export interface HiddenStemArc {
  branchIndex: number;
  displayPos: number;
  stemChar: string;
  element: string;
  polarity: 'Yang' | 'Yin';
  percentage: number;
  stemIndex: number;         // index within branch's hidden stems (0, 1, 2)
  startAngle: number;
  endAngle: number;
  color: string;
}

export interface SeasonWheelArc {
  season: string;
  startAngle: number;
  endAngle: number;
  color: string;
  branches: number[];        // branch indices in this season
}

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

/**
 * Build 12 branch arcs for the animal ring.
 * Tiger at 0 rad (12 o'clock), each branch spans π/6 (30°).
 */
export function buildBranchWheelArcs(): BranchWheelArc[] {
  return WHEEL_ORDER.map((branchIdx, displayPos) => {
    const seg = BRANCH_SEGMENTS[branchIdx];
    const startAngle = displayPos * RAD_PER_BRANCH;
    const endAngle = (displayPos + 1) * RAD_PER_BRANCH;

    return {
      branchIndex: branchIdx,
      displayPos,
      char: seg.char,
      pinyin: seg.pinyin,
      animal: seg.animal,
      element: seg.element,
      polarity: seg.polarity as 'Yang' | 'Yin',
      season: seg.season,
      phase: PHASE_MAP[displayPos % 3],
      startAngle,
      endAngle,
      color: ELEMENT_COLORS[seg.element] || '#666',
      glyph: ANIMAL_GLYPHS[seg.animal] || '',
    };
  });
}

/**
 * Subdivide each branch's angular range by hidden stem percentages.
 * Produces one sub-arc per hidden stem, colored by element.
 */
export function buildHiddenStemArcs(branchArcs: BranchWheelArc[]): HiddenStemArc[] {
  const result: HiddenStemArc[] = [];

  for (const arc of branchArcs) {
    const stems: HiddenStemData[] = HIDDEN_STEMS[arc.branchIndex] || [];
    const totalAngle = arc.endAngle - arc.startAngle;
    let cursor = arc.startAngle;

    stems.forEach((stem, idx) => {
      const fraction = stem.percentage / 100;
      const arcAngle = totalAngle * fraction;
      result.push({
        branchIndex: arc.branchIndex,
        displayPos: arc.displayPos,
        stemChar: stem.char,
        element: stem.element,
        polarity: stem.polarity as 'Yang' | 'Yin',
        percentage: stem.percentage,
        stemIndex: idx,
        startAngle: cursor,
        endAngle: cursor + arcAngle,
        color: ELEMENT_COLORS[stem.element] || '#666',
      });
      cursor += arcAngle;
    });
  }

  return result;
}

/**
 * Build 4 season arcs for the outer ring.
 * Spring at 0° (Tiger), each season spans 90° (3 branches).
 */
export function buildSeasonWheelArcs(): SeasonWheelArc[] {
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  // Branch indices per season (matching WHEEL_ORDER positions)
  const seasonBranches: Record<string, number[]> = {
    Spring: [2, 3, 4],   // Tiger, Rabbit, Dragon
    Summer: [5, 6, 7],   // Snake, Horse, Goat
    Autumn: [8, 9, 10],  // Monkey, Rooster, Dog
    Winter: [11, 0, 1],  // Pig, Rat, Ox
  };

  return seasons.map((season, i) => ({
    season,
    startAngle: i * (Math.PI / 2),
    endAngle: (i + 1) * (Math.PI / 2),
    color: SEASON_COLORS[season],
    branches: seasonBranches[season],
  }));
}

/**
 * Get stem type label (Main Qi / Middle Qi / Residual Qi).
 */
export function getStemTypeLabel(stemIndex: number): string {
  if (stemIndex === 0) return 'Main Qi 本气';
  if (stemIndex === 1) return 'Middle Qi 中气';
  return 'Residual Qi 余气';
}

// ---------------------------------------------------------------------------
// Solar Term Data — 12 Jie (節) terms marking each branch-month boundary
// ---------------------------------------------------------------------------

export interface BranchSolarTerm {
  branchIndex: number;
  termChinese: string;
  termEnglish: string;
  longitude: number;       // Sun's ecliptic longitude at this term
  approxDate: string;      // Approximate date (2026)
}

/** Each branch-month starts at a Jie (節) solar term. Indexed by branchIndex. */
export const BRANCH_SOLAR_TERMS: BranchSolarTerm[] = [
  { branchIndex: 0,  termChinese: '大雪', termEnglish: 'Major Snow',        longitude: 255, approxDate: '2026-12-07' },
  { branchIndex: 1,  termChinese: '小寒', termEnglish: 'Minor Cold',        longitude: 285, approxDate: '2027-01-05' },
  { branchIndex: 2,  termChinese: '立春', termEnglish: 'Spring Begins',     longitude: 315, approxDate: '2026-02-03' },
  { branchIndex: 3,  termChinese: '驚蟄', termEnglish: 'Awakening Insects', longitude: 345, approxDate: '2026-03-05' },
  { branchIndex: 4,  termChinese: '清明', termEnglish: 'Clear & Bright',    longitude: 15,  approxDate: '2026-04-04' },
  { branchIndex: 5,  termChinese: '立夏', termEnglish: 'Summer Begins',     longitude: 45,  approxDate: '2026-05-05' },
  { branchIndex: 6,  termChinese: '芒種', termEnglish: 'Grain in Ear',      longitude: 75,  approxDate: '2026-06-05' },
  { branchIndex: 7,  termChinese: '小暑', termEnglish: 'Minor Heat',        longitude: 105, approxDate: '2026-07-06' },
  { branchIndex: 8,  termChinese: '立秋', termEnglish: 'Autumn Begins',     longitude: 135, approxDate: '2026-08-07' },
  { branchIndex: 9,  termChinese: '白露', termEnglish: 'White Dew',         longitude: 165, approxDate: '2026-09-07' },
  { branchIndex: 10, termChinese: '寒露', termEnglish: 'Cold Dew',          longitude: 195, approxDate: '2026-10-08' },
  { branchIndex: 11, termChinese: '立冬', termEnglish: 'Winter Begins',     longitude: 225, approxDate: '2026-11-07' },
];

/** Get the solar term marking the START of a given branch-month */
export function getBranchSolarTerm(branchIndex: number): BranchSolarTerm | undefined {
  return BRANCH_SOLAR_TERMS.find(t => t.branchIndex === branchIndex);
}

/** Get the solar term marking the END of a branch-month (= start of next) */
export function getBranchEndTerm(branchIndex: number): BranchSolarTerm | undefined {
  const nextBranch = WHEEL_ORDER[(WHEEL_ORDER.indexOf(branchIndex) + 1) % 12];
  return BRANCH_SOLAR_TERMS.find(t => t.branchIndex === nextBranch);
}

// ---------------------------------------------------------------------------
// Cardinal Season Markers (4 points — used for hover detail panel)
// ---------------------------------------------------------------------------

export interface SeasonMarkerData {
  season: string;
  angle: number;           // degrees on wheel (0=top)
  termChinese: string;
  termPinyin: string;
  termEnglish: string;
  longitude: number;
  approxDate: string;
  icon: string;
  color: string;
  description: string;
  significance: string;
}

export const SEASON_MARKERS: SeasonMarkerData[] = [
  {
    season: 'Spring', angle: 0, termChinese: '立春', termPinyin: 'Lì Chūn',
    termEnglish: 'Spring Begins', longitude: 315, approxDate: '2026-02-03',
    icon: '🌸', color: '#4ade80',
    description: 'Sun reaches 315° ecliptic longitude. Wood Qi begins rising. This is the BaZi New Year — year pillar and month pillar both change at this moment.',
    significance: 'Marks the transition from Ox (丑) month to Tiger (寅) month. Yang Wood energy emerges. Chinese Spring starts ~45 days before the Western Spring Equinox because it marks the BEGINNING of warmth, not the peak.',
  },
  {
    season: 'Summer', angle: 90, termChinese: '立夏', termPinyin: 'Lì Xià',
    termEnglish: 'Summer Begins', longitude: 45, approxDate: '2026-05-05',
    icon: '☀️', color: '#fbbf24',
    description: 'Sun reaches 45° ecliptic longitude. Fire Qi begins rising. Yang energy approaches its peak.',
    significance: 'Marks the transition from Dragon (辰) month to Snake (巳) month. Fire element takes dominance. Growth energy peaks before the Summer Solstice.',
  },
  {
    season: 'Autumn', angle: 180, termChinese: '立秋', termPinyin: 'Lì Qiū',
    termEnglish: 'Autumn Begins', longitude: 135, approxDate: '2026-08-07',
    icon: '🍂', color: '#f97316',
    description: 'Sun reaches 135° ecliptic longitude. Metal Qi begins rising. Yin energy starts its ascent.',
    significance: 'Marks the transition from Goat (未) month to Monkey (申) month. Metal element takes dominance. Harvest energy begins.',
  },
  {
    season: 'Winter', angle: 270, termChinese: '立冬', termPinyin: 'Lì Dōng',
    termEnglish: 'Winter Begins', longitude: 225, approxDate: '2026-11-07',
    icon: '❄️', color: '#94a3b8',
    description: 'Sun reaches 225° ecliptic longitude. Water Qi begins rising. Yin energy approaches its peak.',
    significance: 'Marks the transition from Dog (戌) month to Pig (亥) month. Water element takes dominance. Storage and consolidation energy.',
  },
];

// ---------------------------------------------------------------------------
// Inner Heavenly Stem Wheel — 12 segments (10 stems + 2 repeats from cycle)
// ---------------------------------------------------------------------------

export interface StemWheelArc {
  displayPos: number;        // 0-11 on wheel (matching branch positions)
  stemIndex: number;         // 0-9 heavenly stem index
  char: string;
  pinyin: string;
  english: string;           // "Yang Wood"
  element: string;
  polarity: 'Yang' | 'Yin';
  startAngle: number;
  endAngle: number;
  color: string;
  isRepeat: boolean;         // true for positions 10-11 (cycle wrap)
}

/**
 * Build 12 stem arcs for the inner wheel.
 * Maps 10 stems onto 12 positions by wrapping — positions 10 & 11 repeat
 * stems 0 & 1 (offset adjusted), matching the Sexagenary 60-cycle logic.
 *
 * Moving by +2 preserves Yang/Yin alignment: Yang branches always see Yang stems.
 */
export function buildStemWheelArcs(stemOffset: number): StemWheelArc[] {
  return Array.from({ length: 12 }, (_, displayPos) => {
    const stemIdx = ((stemOffset + displayPos) % 10 + 10) % 10;
    const stem = STEM_SEGMENTS[stemIdx];
    const startAngle = displayPos * RAD_PER_BRANCH;
    const endAngle = (displayPos + 1) * RAD_PER_BRANCH;

    return {
      displayPos,
      stemIndex: stemIdx,
      char: stem.char,
      pinyin: stem.pinyin,
      english: stem.english,
      element: stem.element,
      polarity: stem.polarity,
      startAngle,
      endAngle,
      color: ELEMENT_COLORS[stem.element] || '#666',
      isRepeat: displayPos >= 10,
    };
  });
}

/** Get the heavenly stem index aligned with a given wheel position at a given offset. */
export function getAlignedStemIndex(displayPos: number, stemOffset: number): number {
  return ((stemOffset + displayPos) % 10 + 10) % 10;
}

// ---------------------------------------------------------------------------
// Day Pillar Scenario Calculator — Educational hidden stem breakdowns
// ---------------------------------------------------------------------------

const STEM_WEIGHT = 1 / 11;   // ~9.09%
const BRANCH_WEIGHT = 10 / 11; // ~90.91%

export interface ScenarioBreakdown {
  source: string;        // "Heavenly Stem" or hidden stem label
  char: string;          // '甲' or '丙'
  element: string;       // 'Wood'
  rawPct: number;        // original percentage (100 for stem, or hidden stem %)
  weight: number;        // STEM_WEIGHT or BRANCH_WEIGHT
  finalPct: number;      // rawPct/100 × weight × 100 = actual contribution
  calculation: string;   // human-readable formula
}

export interface DayPillarScenario {
  stemIndex: number;
  stemChar: string;
  stemElement: string;
  stemPolarity: 'Yang' | 'Yin';
  stemEnglish: string;
  branchIndex: number;
  branchChar: string;
  branchAnimal: string;
  ganZhi: string;         // "甲寅"
  pillarLabel: string;    // "Yang Wood Tiger"
  breakdown: ScenarioBreakdown[];
  totals: Record<string, number>; // element → total % (sums to 100)
}

/**
 * Build 5 Day Pillar scenarios for a given earthly branch.
 * Yang branches pair with the 5 Yang stems, Yin with the 5 Yin stems.
 *
 * Formula:
 *   Heavenly Stem contributes: 1/11 of Day Pillar → 9.09% of its element
 *   Earthly Branch contributes: 10/11 of Day Pillar → each hidden stem
 *     gets (hiddenStemPct / 100) × (10/11) × 100 of its element
 */
export function buildDayPillarScenarios(branchIndex: number): DayPillarScenario[] {
  const branch = BRANCH_SEGMENTS[branchIndex];
  const hiddenStems = HIDDEN_STEMS[branchIndex] || [];
  const isYang = branch.polarity === 'Yang';

  // 5 matching stems: Yang branches → even indices, Yin → odd
  const matchingStems = STEM_SEGMENTS.filter(s =>
    isYang ? s.polarity === 'Yang' : s.polarity === 'Yin'
  );

  return matchingStems.map(stem => {
    const breakdown: ScenarioBreakdown[] = [];

    // Heavenly stem contribution
    const stemFinal = STEM_WEIGHT * 100;
    breakdown.push({
      source: 'Heavenly Stem 天干',
      char: stem.char,
      element: stem.element,
      rawPct: 100,
      weight: STEM_WEIGHT,
      finalPct: stemFinal,
      calculation: `1/11 = ${stemFinal.toFixed(2)}%`,
    });

    // Hidden stem contributions
    for (const hs of hiddenStems) {
      const hsFinal = (hs.percentage / 100) * BRANCH_WEIGHT * 100;
      breakdown.push({
        source: `Hidden Stem ${getStemTypeLabel(hiddenStems.indexOf(hs))}`,
        char: hs.char,
        element: hs.element,
        rawPct: hs.percentage,
        weight: BRANCH_WEIGHT,
        finalPct: hsFinal,
        calculation: `${hs.percentage}% × 10/11 = ${hsFinal.toFixed(2)}%`,
      });
    }

    // Sum by element
    const totals: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
    for (const b of breakdown) {
      totals[b.element] = (totals[b.element] || 0) + b.finalPct;
    }

    return {
      stemIndex: stem.index,
      stemChar: stem.char,
      stemElement: stem.element,
      stemPolarity: stem.polarity,
      stemEnglish: stem.english,
      branchIndex,
      branchChar: branch.char,
      branchAnimal: branch.animal,
      ganZhi: `${stem.char}${branch.char}`,
      pillarLabel: `${stem.english} ${branch.animal}`,
      breakdown,
      totals,
    };
  });
}

// ---------------------------------------------------------------------------
// Year Pillar Calculation — maps Gregorian year → Sexagenary cycle
// ---------------------------------------------------------------------------

/**
 * Compute the Heavenly Stem index (0-9) and Earthly Branch index (0-11)
 * for a given Gregorian year using the traditional Sexagenary formula.
 * Base: year 4 CE = 甲子 (stem 0, branch 0).
 */
export function yearToStemBranch(year: number): { stemIndex: number; branchIndex: number } {
  const base = year - 4;
  return {
    stemIndex: ((base % 10) + 10) % 10,
    branchIndex: ((base % 12) + 12) % 12,
  };
}

/**
 * Compute the stemOffset needed so the inner wheel aligns correctly for a
 * given year — i.e. the year's Heavenly Stem sits at the same angular
 * position as the year's Earthly Branch on the outer wheel.
 */
export function yearToStemOffset(year: number): number {
  const { stemIndex, branchIndex } = yearToStemBranch(year);
  const displayPos = ((branchIndex - 2 + 12) % 12);
  return ((stemIndex - displayPos) % 10 + 10) % 10;
}

/**
 * Build a label for a year's pillar: "丙午 Yang Fire Horse (2026)"
 */
export function yearPillarLabel(year: number): {
  ganZhi: string;
  english: string;
  stemChar: string;
  branchChar: string;
  stemElement: string;
  branchAnimal: string;
  stemPolarity: string;
} {
  const { stemIndex, branchIndex } = yearToStemBranch(year);
  const stem = STEM_SEGMENTS[stemIndex];
  const branch = BRANCH_SEGMENTS[branchIndex];
  return {
    ganZhi: `${stem.char}${branch.char}`,
    english: `${stem.english} ${branch.animal}`,
    stemChar: stem.char,
    branchChar: branch.char,
    stemElement: stem.element,
    branchAnimal: branch.animal,
    stemPolarity: stem.polarity,
  };
}

// ---------------------------------------------------------------------------
// Month Pillar Calculation — Five Tigers Escaping Rule (五虎遁)
// ---------------------------------------------------------------------------

/** Five Tigers Escaping — maps year stem index → Tiger month's starting stem index */
const MONTH_STEM_BASE: number[] = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
// Jia/Ji→Bing(2), Yi/Geng→Wu(4), Bing/Xin→Geng(6), Ding/Ren→Ren(8), Wu/Gui→Jia(0)

/**
 * Get the month heavenly stem index for a given year stem and branch.
 * branchIndex: 0-11 (Rat=0, Ox=1, Tiger=2, ...)
 * yearStemIndex: 0-9 (Jia=0, Yi=1, Bing=2, ...)
 */
export function getMonthStemIndex(yearStemIndex: number, branchIndex: number): number {
  const baseStem = MONTH_STEM_BASE[yearStemIndex];
  const monthOffset = ((branchIndex - 2) + 12) % 12; // Tiger = offset 0
  return (baseStem + monthOffset) % 10;
}

/**
 * Build a label for a month's pillar given year stem and branch.
 */
export function monthPillarLabel(yearStemIndex: number, branchIndex: number): {
  ganZhi: string;
  english: string;
  stemChar: string;
  branchChar: string;
  stemElement: string;
  branchAnimal: string;
  stemPolarity: string;
} {
  const stemIdx = getMonthStemIndex(yearStemIndex, branchIndex);
  const stem = STEM_SEGMENTS[stemIdx];
  const branch = BRANCH_SEGMENTS[branchIndex];
  return {
    ganZhi: `${stem.char}${branch.char}`,
    english: `${stem.english} ${branch.animal}`,
    stemChar: stem.char,
    branchChar: branch.char,
    stemElement: stem.element,
    branchAnimal: branch.animal,
    stemPolarity: stem.polarity,
  };
}

/**
 * Compute the stemOffset for the inner wheel in month pillar mode.
 * Tiger is at displayPos 0, so its stem (MONTH_STEM_BASE[yearStemIndex])
 * should appear at position 0.
 */
export function monthToStemOffset(yearStemIndex: number): number {
  return MONTH_STEM_BASE[yearStemIndex];
}

/**
 * Determine the month branch index for a given date based on approximate
 * solar term (Jie 節) boundaries.  Tiger(2)=~Feb 3, Rabbit(3)=~Mar 5, etc.
 */
export function dateToMonthBranch(date: Date): number {
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();
  // Solar term start days per branch — sorted by calendar month (Jan → Dec)
  // [branchIndex, startMonth, startDay]
  const bounds: [number, number, number][] = [
    [1,  1,  6], // Ox      — Minor Cold
    [2,  2,  4], // Tiger   — Spring Begins
    [3,  3,  6], // Rabbit  — Awakening Insects
    [4,  4,  5], // Dragon  — Clear & Bright
    [5,  5,  6], // Snake   — Summer Begins
    [6,  6,  6], // Horse   — Grain in Ear
    [7,  7,  7], // Goat    — Minor Heat
    [8,  8,  8], // Monkey  — Autumn Begins
    [9,  9,  8], // Rooster — White Dew
    [10, 10, 8], // Dog     — Cold Dew
    [11, 11, 7], // Pig     — Winter Begins
    [0,  12, 7], // Rat     — Major Snow
  ];
  // Walk backwards: latest boundary whose (month, day) ≤ date wins
  for (let i = bounds.length - 1; i >= 0; i--) {
    const [bi, bm, bd] = bounds[i];
    if (m > bm || (m === bm && d >= bd)) return bi;
  }
  // Before Jan 6 → still Rat month (Dec solar month wraps)
  return 0;
}

/**
 * Build 12 month labels for the gap ring in month pillar mode.
 * Returns labels clockwise from Tiger (Feb) to Ox (Jan of next year).
 */
export function buildMonthGapLabels(currentYear: number): {
  displayPos: number;
  branchIndex: number;
  label: string;
  startDate: string;
  endDate: string;
  startTerm: string;
  endTerm: string;
  startTermChinese: string;
  endTermChinese: string;
}[] {
  // Month names mapped to branches: Tiger=Feb, Rabbit=Mar, ... Ox=Jan(next year)
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Branch → approximate Western month: Tiger=Feb(1), Rabbit=Mar(2), ...
  // branchIndex: 0=Rat→Dec, 1=Ox→Jan, 2=Tiger→Feb, ..., 11=Pig→Nov
  const branchToMonth = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // 1-indexed

  return WHEEL_ORDER.map((branchIdx, displayPos) => {
    const monthNum = branchToMonth[branchIdx]; // 1=Jan, 2=Feb, ...12=Dec
    const labelYear = monthNum <= 1 ? currentYear + 1 : currentYear;
    // For Rat(Dec) & Ox(Jan), they are at the end of the cycle
    // Rat is Dec of currentYear, Ox is Jan of currentYear+1
    const adjustedYear = branchIdx === 0 ? currentYear : // Rat = Dec of current year
                         branchIdx === 1 ? currentYear + 1 : // Ox = Jan of next year
                         currentYear;

    const startSolarTerm = getBranchSolarTerm(branchIdx);
    const endSolarTerm = getBranchEndTerm(branchIdx);

    return {
      displayPos,
      branchIndex: branchIdx,
      label: `${MONTH_NAMES[monthNum - 1]} ${adjustedYear}`,
      startDate: startSolarTerm?.approxDate || '',
      endDate: endSolarTerm?.approxDate || '',
      startTerm: startSolarTerm?.termEnglish || '',
      endTerm: endSolarTerm?.termEnglish || '',
      startTermChinese: startSolarTerm?.termChinese || '',
      endTermChinese: endSolarTerm?.termChinese || '',
    };
  });
}

// ---------------------------------------------------------------------------
// Day Pillar Calculation — Julian Day Number method (verified by Baby Nano)
// ---------------------------------------------------------------------------

/** Standard Julian Day Number calculation (Meeus, Astronomical Algorithms) */
function calculateJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Compute the Heavenly Stem and Earthly Branch for a given date.
 * Uses the verified formula: sexagenary index = (JDN - 11) % 60
 */
export function dateToDayStemBranch(date: Date): { stemIndex: number; branchIndex: number } {
  const jdn = calculateJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  let index = (jdn - 11) % 60;
  if (index < 0) index += 60;
  return {
    stemIndex: index % 10,
    branchIndex: index % 12,
  };
}

/**
 * Compute the stemOffset for the inner wheel in day pillar mode.
 * The day's stem should appear at the day's branch display position.
 */
export function dayToStemOffset(date: Date): number {
  const { stemIndex, branchIndex } = dateToDayStemBranch(date);
  const displayPos = ((branchIndex - 2 + 12) % 12);
  return ((stemIndex - displayPos) % 10 + 10) % 10;
}

/**
 * Build a label for a day's pillar.
 */
export function dayPillarLabelFromDate(date: Date): {
  ganZhi: string;
  english: string;
  stemChar: string;
  branchChar: string;
  stemElement: string;
  branchAnimal: string;
  stemPolarity: string;
} {
  const { stemIndex, branchIndex } = dateToDayStemBranch(date);
  const stem = STEM_SEGMENTS[stemIndex];
  const branch = BRANCH_SEGMENTS[branchIndex];
  return {
    ganZhi: `${stem.char}${branch.char}`,
    english: `${stem.english} ${branch.animal}`,
    stemChar: stem.char,
    branchChar: branch.char,
    stemElement: stem.element,
    branchAnimal: branch.animal,
    stemPolarity: stem.polarity,
  };
}

/**
 * Build 12 day labels for the gap ring in day pillar mode.
 * Each wheel position shows the date that matches its branch.
 */
export function buildDayGapLabels(referenceDate: Date): {
  displayPos: number;
  branchIndex: number;
  label: string;
  fullDate: string;
  isToday: boolean;
}[] {
  const { branchIndex: refBranch } = dateToDayStemBranch(referenceDate);
  const refDisplayPos = ((refBranch - 2 + 12) % 12);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const refNorm = new Date(referenceDate);
  refNorm.setHours(0, 0, 0, 0);

  return WHEEL_ORDER.map((_branchIdx, displayPos) => {
    const offset = ((displayPos - refDisplayPos) + 12) % 12;
    const d = new Date(refNorm);
    d.setDate(d.getDate() + offset);

    const monthShort = d.toLocaleString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    const isToday = d.getTime() === today.getTime();

    return {
      displayPos,
      branchIndex: _branchIdx,
      label: `${monthShort} ${dayNum}`,
      fullDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      isToday,
    };
  });
}

// ---------------------------------------------------------------------------
// Hour Pillar Calculation — Five Rats Escaping Rule (五鼠遁)
// ---------------------------------------------------------------------------

/** Five Rats Escaping — maps day stem index → Rat hour's starting stem index */
const HOUR_STEM_BASE: number[] = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
// Jia/Ji→Jia(0), Yi/Geng→Bing(2), Bing/Xin→Wu(4), Ding/Ren→Geng(6), Wu/Gui→Ren(8)

/** Branch index → two-hour window boundaries (24h clock) */
const HOUR_RANGES: { start: number; end: number; label: string }[] = [
  { start: 23, end: 1,  label: '11PM–1AM' },   // 0: Rat
  { start: 1,  end: 3,  label: '1–3 AM' },      // 1: Ox
  { start: 3,  end: 5,  label: '3–5 AM' },      // 2: Tiger
  { start: 5,  end: 7,  label: '5–7 AM' },      // 3: Rabbit
  { start: 7,  end: 9,  label: '7–9 AM' },      // 4: Dragon
  { start: 9,  end: 11, label: '9–11 AM' },     // 5: Snake
  { start: 11, end: 13, label: '11AM–1PM' },    // 6: Horse
  { start: 13, end: 15, label: '1–3 PM' },      // 7: Goat
  { start: 15, end: 17, label: '3–5 PM' },      // 8: Monkey
  { start: 17, end: 19, label: '5–7 PM' },      // 9: Rooster
  { start: 19, end: 21, label: '7–9 PM' },      // 10: Dog
  { start: 21, end: 23, label: '9–11 PM' },     // 11: Pig
];

/** Convert a 0-23 hour to its Earthly Branch index */
export function hourToBranchIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2);
}

/** Get the hour stem index from day stem + branch */
export function getHourStemIndex(dayStemIndex: number, branchIndex: number): number {
  const baseStem = HOUR_STEM_BASE[dayStemIndex];
  return (baseStem + branchIndex) % 10;
}

/**
 * Compute the stemOffset for the inner wheel in hour pillar mode.
 * Tiger (branch 2) sits at displayPos 0, so its hour stem should align there.
 */
export function hourToStemOffset(date: Date): number {
  const { stemIndex: dayStemIdx } = dateToDayStemBranch(date);
  // Tiger hour stem = HOUR_STEM_BASE[dayStemIdx] + 2 (Tiger is branch 2)
  return (HOUR_STEM_BASE[dayStemIdx] + 2) % 10;
}

/** Build a label for an hour's pillar given day stem and branch. */
export function hourPillarLabel(dayStemIndex: number, branchIndex: number): {
  ganZhi: string;
  english: string;
  stemChar: string;
  branchChar: string;
  stemElement: string;
  branchAnimal: string;
  stemPolarity: string;
  timeLabel: string;
} {
  const stemIdx = getHourStemIndex(dayStemIndex, branchIndex);
  const stem = STEM_SEGMENTS[stemIdx];
  const branch = BRANCH_SEGMENTS[branchIndex];
  return {
    ganZhi: `${stem.char}${branch.char}`,
    english: `${stem.english} ${branch.animal}`,
    stemChar: stem.char,
    branchChar: branch.char,
    stemElement: stem.element,
    branchAnimal: branch.animal,
    stemPolarity: stem.polarity,
    timeLabel: HOUR_RANGES[branchIndex].label,
  };
}

/**
 * Build 12 hour labels for the gap ring in hour pillar mode.
 * Each wheel position shows the date + two-hour window for its branch.
 */
export function buildHourGapLabels(referenceDate: Date): {
  displayPos: number;
  branchIndex: number;
  dateLabel: string;
  timeLabel: string;
  fullDateTime: string;
  isNow: boolean;
}[] {
  const refHour = referenceDate.getHours();
  const refBranch = hourToBranchIndex(refHour);
  const refDisplayPos = ((refBranch - 2 + 12) % 12);

  const now = new Date();
  const nowBranch = hourToBranchIndex(now.getHours());
  const nowDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return WHEEL_ORDER.map((branchIdx, displayPos) => {
    // Hours offset from reference branch
    const branchOffset = ((displayPos - refDisplayPos) + 12) % 12;
    const hoursOffset = branchOffset * 2;

    // Calculate the date/time for this position
    const d = new Date(referenceDate);
    // Snap reference to the start of its 2-hour window, then add offset
    const refStart = HOUR_RANGES[refBranch].start;
    d.setHours(refStart, 0, 0, 0);
    // Handle Rat hour (23:00 = previous calendar day for the BaZi day)
    d.setTime(d.getTime() + hoursOffset * 60 * 60 * 1000);

    const monthShort = d.toLocaleString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    const dateLabel = `${monthShort} ${dayNum}`;
    const timeLabel = HOUR_RANGES[branchIdx].label;

    const dDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isNow = branchIdx === nowBranch && dDateStr === nowDateStr;

    return {
      displayPos,
      branchIndex: branchIdx,
      dateLabel,
      timeLabel,
      fullDateTime: `${dDateStr} ${timeLabel}`,
      isNow,
    };
  });
}

// ---------------------------------------------------------------------------
// Mythic Stories — poetic narratives for each Earthly Branch
// ---------------------------------------------------------------------------

export interface BranchMythicStory {
  title: string;
  narrative: string;
  insight: string;
  keywords: string[];
}

/** Indexed by branchIndex (0-11) */
export const BRANCH_MYTHIC_STORIES: BranchMythicStory[] = [
  // 0: 子 Rat
  {
    title: 'The Midnight Well',
    narrative: 'At the deepest hour, when the world sleeps and the sky is a bowl of ink, a single well holds all the water in the universe. Yin Water — quiet, still, unfathomable — pools here in absolute purity. There is no other voice, no other element. Just depth calling to depth, wisdom gathering in the dark.',
    insight: 'Rat is one of three "pure" branches — 100% single element. In a BaZi chart, the Rat branch delivers undiluted Water energy. What you see is exactly what you get: intuition, intelligence, and the power of stillness.',
    keywords: ['Pure Water', 'Midnight', 'Intuition', 'Stillness'],
  },
  // 1: 丑 Ox
  {
    title: 'The Frozen Treasury',
    narrative: 'Beneath the frost-hardened earth, a treasury lies sealed. Yin Earth is the vault keeper, holding 60% of the branch\'s essence — solid, patient, immovable. But within this frozen storehouse, Yin Water (30%) seeps through unseen channels, and Yin Metal (10%) glints like buried coin. Winter has not ended; it is preserving.',
    insight: 'Ox is a "transitional" branch marking winter\'s end. Its three hidden stems represent the season\'s complexity: dominant Earth storing departing Water and the first hints of Metal that will emerge. The Ox teaches that even in dormancy, transformation is underway.',
    keywords: ['Earth Treasury', 'Preservation', 'Three Stems', 'Winter\'s End'],
  },
  // 2: 寅 Tiger
  {
    title: 'Awakening Thunder',
    narrative: 'The forest floor trembles. Yang Wood (60%) erupts from the earth with the force of a thousand bamboo shoots — spring\'s first declaration. Hidden within this surge, Yang Fire (30%) crackles like the first lightning of the season, and Yang Earth (10%) is the soil that cracks open to release what winter held captive.',
    insight: 'Tiger begins the spring season and the entire BaZi year. Its three hidden stems tell the story of initiation: dominant Wood energy accompanied by Fire (the spark of ambition) and Earth (the ground that gives way). Tiger branches in your chart signal powerful beginnings.',
    keywords: ['Spring Begins', 'Yang Wood', 'Initiation', 'Three Elements'],
  },
  // 3: 卯 Rabbit
  {
    title: 'The Pure Grove',
    narrative: 'In the heart of spring stands a grove where every tree, every leaf, every root speaks with one voice: Yin Wood. There is no fire here, no metal, no competing element — only the pure, gentle, persistent force of growth. The season has found its truest expression, and it sounds like rain on new leaves.',
    insight: 'Rabbit is one of three "pure" branches — 100% Yin Wood. This is spring at its essence: flexible, artistic, nurturing. In your chart, Rabbit delivers complete Wood energy with no internal contradiction. What you feel is what is real.',
    keywords: ['Pure Wood', 'Spring Core', 'Gentleness', 'Artistic'],
  },
  // 4: 辰 Dragon
  {
    title: 'The Shifting Earth',
    narrative: 'The Dragon guards the gate between spring and summer, standing on ground that is never quite solid. Yang Earth (60%) is the dominant force — a mountain in motion. But Yin Wood (30%) still sends roots through its foundations (spring\'s lingering voice), and Yin Water (10%) trickles down from its peak like a prophecy of distant rain.',
    insight: 'Dragon is the first "transitional" branch — one of the four Earth-dominant gates marking seasonal shifts. Its three hidden stems represent the outgoing season (Wood), the stabilizing force (Earth), and the seed of transformation (Water). Dragon branches create complexity in any chart.',
    keywords: ['Seasonal Gate', 'Transformation', 'Earth Dominant', 'Complexity'],
  },
  // 5: 巳 Snake
  {
    title: 'The Hidden Forge',
    narrative: 'Summer announces itself through the Snake — Yang Fire (60%) blazing with the conviction of noon approaching. But coiled within this heat is a mystery: Yang Metal (30%) hides like a sword being tempered in the flame, and Yang Earth (10%) is the crucible that holds the transformation together. Fire and Metal, creator and creation, locked in the same chamber.',
    insight: 'Snake is summer\'s "beginning" branch. The surprising presence of Metal hidden within Fire makes it one of the most intriguing branches — it represents hidden talent, concealed resources, and the principle that opposites can coexist. Snake branches add strategic depth to a chart.',
    keywords: ['Hidden Metal', 'Summer Begins', 'Strategy', 'Concealment'],
  },
  // 6: 午 Horse
  {
    title: 'The Blaze at Noon',
    narrative: 'The sun stands at its highest point. Yin Fire (70%) radiates with an intensity that is almost pure — a lantern that needs no companion. Only Yin Earth (30%) remains, the ash that proves the fire is real, the soil baked hard by summer\'s peak. Two elements, almost one. The simplest story of the hottest hour.',
    insight: 'Horse is "near-pure" — only two hidden stems instead of three. Its dominant Yin Fire with supporting Earth represents summer at its peak. With 70% Fire, the Horse branch delivers concentrated heat energy. It is direct, passionate, and nearly undiluted.',
    keywords: ['Near-Pure Fire', 'Summer Peak', 'Passion', 'Directness'],
  },
  // 7: 未 Goat
  {
    title: 'The Slow Compost',
    narrative: 'At summer\'s end, the earth grows warm and soft. Yin Earth (60%) absorbs everything — the last flicker of Yin Fire (30%) sinking into its belly, the first tender root of Yin Wood (10%) sprouting from what was burned. This is the composting hour: death feeding life, endings becoming beginnings, all held in Earth\'s patient embrace.',
    insight: 'Goat is the transitional branch between summer and autumn. Its three hidden stems tell a story of gentle transformation: Fire\'s remnants feeding Earth, while Wood\'s first seeds hint at the cycle\'s continuation. Goat branches bring nourishing, receptive energy to a chart.',
    keywords: ['Composting', 'Summer\'s End', 'Nourishment', 'Gentle Change'],
  },
  // 8: 申 Monkey
  {
    title: 'The Metalsmith\'s River',
    narrative: 'Autumn arrives with the ring of hammer on anvil. Yang Metal (60%) commands the forge — sharp, decisive, transformative. Beneath the workshop floor, Yang Water (30%) flows in a hidden river, cooling what Metal shapes and carrying its creations downstream. Yang Earth (10%) is the mountain from which the ore was drawn. Tool, water, and stone: autumn\'s trinity.',
    insight: 'Monkey begins the autumn season with Metal\'s decisive energy. Its three hidden stems form a natural productive chain: Earth produces Metal, Metal collects Water. This is one of the most harmoniously structured branches — its internal elements support rather than conflict with each other.',
    keywords: ['Autumn Begins', 'Productive Chain', 'Craftsmanship', 'Decisiveness'],
  },
  // 9: 酉 Rooster
  {
    title: 'The Pure Bell',
    narrative: 'In the silence of autumn\'s peak, a single bell rings. Yin Metal — and nothing else. One hundred percent of this branch sings with the same tone: refined, precise, unwavering. The bell does not need fire to forge it, water to cool it, or earth to support it. It simply is. One note, perfectly clear, cutting through the evening air.',
    insight: 'Rooster is one of three "pure" branches — 100% Yin Metal. It represents autumn\'s most concentrated expression: refinement, discernment, and clarity. In your chart, Rooster delivers pure Metal energy without compromise or complexity. It is precise and unapologetic.',
    keywords: ['Pure Metal', 'Autumn Core', 'Clarity', 'Precision'],
  },
  // 10: 戌 Dog
  {
    title: 'The Ember Keeper',
    narrative: 'As autumn fades, the Dog sits by the dying hearth. Yang Earth (60%) is the fireplace itself — solid, enduring, holding shape even as the season crumbles. Within the cooling stones, Yin Metal (30%) gleams like the last jewelry of autumn, and Yin Fire (10%) is the ember that refuses to die, a tiny flame preserved against the coming cold.',
    insight: 'Dog is the transitional branch between autumn and winter. Its three hidden stems tell a story of preservation: Earth holding onto Metal\'s structures and Fire\'s last warmth before winter arrives. Dog branches bring loyalty, guardianship, and the courage to protect what matters.',
    keywords: ['Seasonal Gate', 'Preservation', 'Guardianship', 'Last Warmth'],
  },
  // 11: 亥 Pig
  {
    title: 'The Deep Current',
    narrative: 'Winter opens its gates, and Yang Water (70%) pours through in a torrent. Rivers swell, rain falls, and the world becomes liquid. Hidden within this flood, Yang Wood (30%) germinates unseen — seeds that will not surface until spring but are already alive, growing in the dark water. Two elements, one carrying the future inside the other.',
    insight: 'Pig is "near-pure" — two hidden stems with dominant Water. Its Yang Wood component is winter\'s secret: the seed of spring hidden within the deepest cold. Pig branches deliver powerful Water energy with an embedded promise of renewal. They represent depth, generosity, and hidden potential.',
    keywords: ['Near-Pure Water', 'Winter Begins', 'Hidden Growth', 'Generosity'],
  },
];

// ---------------------------------------------------------------------------
// Purity Classification
// ---------------------------------------------------------------------------

export type BranchPurity = 'Pure' | 'Near-Pure' | 'Transitional';

const PURITY_CACHE: BranchPurity[] = HIDDEN_STEMS.map(stems =>
  stems.length === 1 ? 'Pure' : stems.length === 2 ? 'Near-Pure' : 'Transitional'
);

export function getBranchPurity(branchIndex: number): BranchPurity {
  return PURITY_CACHE[branchIndex] ?? 'Transitional';
}

export const PURITY_COLORS: Record<BranchPurity, string> = {
  'Pure': '#fbbf24',         // gold
  'Near-Pure': '#c0c0c0',    // silver
  'Transitional': '#cd7f32', // copper
};

// ---------------------------------------------------------------------------
// Seasonal Strength Bars Builder
// ---------------------------------------------------------------------------

export interface SeasonalStrengthBar {
  element: string;
  strength: number;   // 0.0 - 1.0
  label: string;
}

export function buildSeasonalStrengthBars(branchIndex: number): SeasonalStrengthBar[] {
  const season = BRANCH_SEGMENTS[branchIndex].season;
  return ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(el => {
    const strength = getSeasonalStrength(el, season);
    const label = strength >= 0.8 ? 'Prosperous 旺'
      : strength >= 0.5 ? 'Phase 相'
      : strength >= 0.3 ? 'Resting 休'
      : 'Weakened 囚';
    return { element: el, strength, label };
  });
}

// Re-export for convenience
export { ELEMENT_COLORS, BRANCH_SEGMENTS, HIDDEN_STEMS, STEM_SEGMENTS };
export type { HiddenStemData };
