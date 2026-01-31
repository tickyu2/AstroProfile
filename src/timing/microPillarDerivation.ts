/**
 * ============================================================================
 * MICRO PILLAR DERIVATION (微时柱推导)
 * ============================================================================
 *
 * Derives stem/branch/element for sub-hourly micro-segments.
 *
 * Traditional BaZi uses 2-hour blocks (时辰). This module subdivides
 * those blocks into finer segments while maintaining metaphysical
 * coherence.
 *
 * Approach:
 * 1. Each 2-hour block has a base stem/branch (from hour pillar)
 * 2. Micro-segments within the block inherit the base pillar
 * 3. Element emphasis shifts based on segment position:
 *    - First quarter: Entering energy (previous hour's residue)
 *    - Second quarter: Rising energy
 *    - Third quarter: Peak energy (purest expression)
 *    - Fourth quarter: Transitioning energy (next hour's preview)
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ElementName,
  MicroPillar,
  MicroResolution
} from './microTimingTypes';

// ============================================================================
// CONSTANTS - HEAVENLY STEMS & EARTHLY BRANCHES
// ============================================================================

/**
 * Ten Heavenly Stems (天干)
 */
export const HEAVENLY_STEMS = [
  { pinyin: 'Jia', chinese: '甲', element: 'Wood' as ElementName },
  { pinyin: 'Yi', chinese: '乙', element: 'Wood' as ElementName },
  { pinyin: 'Bing', chinese: '丙', element: 'Fire' as ElementName },
  { pinyin: 'Ding', chinese: '丁', element: 'Fire' as ElementName },
  { pinyin: 'Wu', chinese: '戊', element: 'Earth' as ElementName },
  { pinyin: 'Ji', chinese: '己', element: 'Earth' as ElementName },
  { pinyin: 'Geng', chinese: '庚', element: 'Metal' as ElementName },
  { pinyin: 'Xin', chinese: '辛', element: 'Metal' as ElementName },
  { pinyin: 'Ren', chinese: '壬', element: 'Water' as ElementName },
  { pinyin: 'Gui', chinese: '癸', element: 'Water' as ElementName }
];

/**
 * Twelve Earthly Branches (地支)
 */
export const EARTHLY_BRANCHES = [
  { pinyin: 'Zi', chinese: '子', element: 'Water' as ElementName, hours: [23, 0] },
  { pinyin: 'Chou', chinese: '丑', element: 'Earth' as ElementName, hours: [1, 2] },
  { pinyin: 'Yin', chinese: '寅', element: 'Wood' as ElementName, hours: [3, 4] },
  { pinyin: 'Mao', chinese: '卯', element: 'Wood' as ElementName, hours: [5, 6] },
  { pinyin: 'Chen', chinese: '辰', element: 'Earth' as ElementName, hours: [7, 8] },
  { pinyin: 'Si', chinese: '巳', element: 'Fire' as ElementName, hours: [9, 10] },
  { pinyin: 'Wu', chinese: '午', element: 'Fire' as ElementName, hours: [11, 12] },
  { pinyin: 'Wei', chinese: '未', element: 'Earth' as ElementName, hours: [13, 14] },
  { pinyin: 'Shen', chinese: '申', element: 'Metal' as ElementName, hours: [15, 16] },
  { pinyin: 'You', chinese: '酉', element: 'Metal' as ElementName, hours: [17, 18] },
  { pinyin: 'Xu', chinese: '戌', element: 'Earth' as ElementName, hours: [19, 20] },
  { pinyin: 'Hai', chinese: '亥', element: 'Water' as ElementName, hours: [21, 22] }
];

/**
 * Element cycle (五行相生)
 */
export const ELEMENT_CYCLE: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

/**
 * Element support relationships (相生)
 */
export const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood'
};

/**
 * Element control relationships (相克)
 */
export const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth',
  Fire: 'Metal',
  Earth: 'Water',
  Metal: 'Wood',
  Water: 'Fire'
};

// ============================================================================
// HOUR PILLAR DERIVATION
// ============================================================================

/**
 * Get the earthly branch index for a given hour (0-23)
 */
export function getBranchIndexForHour(hour: number): number {
  // Chinese hour blocks start at 23:00 (Zi hour)
  // Zi: 23-01, Chou: 01-03, Yin: 03-05, etc.
  const adjustedHour = hour === 23 ? 0 : hour + 1;
  return Math.floor(adjustedHour / 2);
}

/**
 * Get the hour stem based on day stem and hour branch
 * Uses the 五虎遁 (Five Tiger Escape) formula
 */
export function getHourStemIndex(dayStemIndex: number, branchIndex: number): number {
  // The hour stem cycles based on the day stem
  // Days starting with Jia/Ji start hour stems at Jia
  // Days starting with Yi/Geng start hour stems at Bing
  // Days starting with Bing/Xin start hour stems at Wu
  // Days starting with Ding/Ren start hour stems at Geng
  // Days starting with Wu/Gui start hour stems at Ren

  const dayGroup = dayStemIndex % 5;
  const baseStems = [0, 2, 4, 6, 8]; // Jia, Bing, Wu, Geng, Ren
  const baseStem = baseStems[dayGroup];

  return (baseStem + branchIndex) % 10;
}

// ============================================================================
// MICRO PILLAR DERIVATION
// ============================================================================

/**
 * Quarter position within a 2-hour block
 */
export type QuarterPosition = 'entering' | 'rising' | 'peak' | 'transitioning';

/**
 * Get the quarter position for a segment within its 2-hour block
 */
export function getQuarterPosition(
  segmentIndex: number,
  resolution: MicroResolution
): QuarterPosition {
  const segmentsPerHour = resolution === 'minute15' ? 4 : 12;
  const segmentsPer2Hours = segmentsPerHour * 2;

  // Position within the 2-hour block (0 to segmentsPer2Hours-1)
  const positionIn2HourBlock = segmentIndex % segmentsPer2Hours;

  // Divide into quarters
  const quarterSize = segmentsPer2Hours / 4;
  const quarter = Math.floor(positionIn2HourBlock / quarterSize);

  const positions: QuarterPosition[] = ['entering', 'rising', 'peak', 'transitioning'];
  return positions[quarter];
}

/**
 * Get element emphasis modifier based on quarter position
 * Returns a weight adjustment for the base element
 */
export function getQuarterElementModifier(
  quarterPosition: QuarterPosition,
  currentElement: ElementName,
  previousElement: ElementName,
  nextElement: ElementName
): { primary: ElementName; secondary: ElementName | null; primaryWeight: number } {
  switch (quarterPosition) {
    case 'entering':
      // Residual energy from previous hour
      return {
        primary: currentElement,
        secondary: previousElement,
        primaryWeight: 0.7
      };
    case 'rising':
      // Building toward peak
      return {
        primary: currentElement,
        secondary: null,
        primaryWeight: 0.85
      };
    case 'peak':
      // Purest expression
      return {
        primary: currentElement,
        secondary: null,
        primaryWeight: 1.0
      };
    case 'transitioning':
      // Beginning to shift to next hour
      return {
        primary: currentElement,
        secondary: nextElement,
        primaryWeight: 0.7
      };
  }
}

/**
 * Derive complete micro pillar for a specific segment
 */
export function deriveMicroPillar(
  date: string,
  hour: number,
  minute: number,
  dayStemIndex: number,
  resolution: MicroResolution
): MicroPillar {
  // Get the base hour pillar
  const branchIndex = getBranchIndexForHour(hour);
  const stemIndex = getHourStemIndex(dayStemIndex, branchIndex);

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  // Calculate segment index
  const segmentsPerHour = resolution === 'minute15' ? 4 : 12;
  const minutesPerSegment = 60 / segmentsPerHour;
  const segmentInHour = Math.floor(minute / minutesPerSegment);
  const segmentIndex = hour * segmentsPerHour + segmentInHour;

  // Get quarter position for element emphasis
  const quarterPosition = getQuarterPosition(segmentIndex, resolution);

  // Get adjacent branch elements for transition effects
  const prevBranchIndex = (branchIndex + 11) % 12;
  const nextBranchIndex = (branchIndex + 1) % 12;
  const prevElement = EARTHLY_BRANCHES[prevBranchIndex].element;
  const nextElement = EARTHLY_BRANCHES[nextBranchIndex].element;

  // Determine dominant element based on position
  const elementMod = getQuarterElementModifier(
    quarterPosition,
    branch.element,
    prevElement,
    nextElement
  );

  // The dominant element is the one with highest influence
  // In peak position, branch element dominates
  // In transitions, there's blending
  const dominantElement = elementMod.primaryWeight >= 0.85
    ? branch.element
    : stem.element; // Stem element adds nuance in transition periods

  return {
    stem: stem.pinyin,
    branch: branch.pinyin,
    stemElement: stem.element,
    branchElement: branch.element,
    dominantElement,
    stemChinese: stem.chinese,
    branchChinese: branch.chinese
  };
}

/**
 * Get the day stem index from a date string
 * Uses the standard BaZi calculation
 */
export function getDayStemIndex(dateStr: string): number {
  // Reference point: Jan 1, 1900 was a Jia-Zi (甲子) day
  // Day stems cycle every 10 days

  const referenceDate = new Date('1900-01-01');
  const targetDate = new Date(dateStr);

  const diffTime = targetDate.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Jan 1, 1900 was stem index 0 (Jia)
  return ((diffDays % 10) + 10) % 10;
}

/**
 * Get the day branch index from a date string
 */
export function getDayBranchIndex(dateStr: string): number {
  const referenceDate = new Date('1900-01-01');
  const targetDate = new Date(dateStr);

  const diffTime = targetDate.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Jan 1, 1900 was branch index 0 (Zi)
  return ((diffDays % 12) + 12) % 12;
}

/**
 * Get complete day pillar
 */
export function getDayPillar(dateStr: string): {
  stem: string;
  branch: string;
  element: ElementName;
  stemChinese: string;
  branchChinese: string;
} {
  const stemIndex = getDayStemIndex(dateStr);
  const branchIndex = getDayBranchIndex(dateStr);

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    stem: stem.pinyin,
    branch: branch.pinyin,
    element: stem.element, // Day master is the stem element
    stemChinese: stem.chinese,
    branchChinese: branch.chinese
  };
}

// ============================================================================
// ELEMENT RELATIONSHIP UTILITIES
// ============================================================================

/**
 * Determine the relationship between two elements
 */
export type ElementRelation =
  | 'same'        // Same element
  | 'produces'    // Source produces target (生)
  | 'produced'    // Source is produced by target
  | 'controls'    // Source controls target (克)
  | 'controlled'; // Source is controlled by target

export function getElementRelation(source: ElementName, target: ElementName): ElementRelation {
  if (source === target) return 'same';
  if (ELEMENT_PRODUCES[source] === target) return 'produces';
  if (ELEMENT_PRODUCES[target] === source) return 'produced';
  if (ELEMENT_CONTROLS[source] === target) return 'controls';
  if (ELEMENT_CONTROLS[target] === source) return 'controlled';

  // This shouldn't happen with 5 elements, but fallback
  return 'same';
}

/**
 * Calculate element support score between two elements
 * Higher = more supportive relationship
 */
export function calculateElementSupport(
  subjectElement: ElementName,
  periodElement: ElementName
): number {
  const relation = getElementRelation(periodElement, subjectElement);

  switch (relation) {
    case 'same':
      // Same element: strong support (Friend relationship)
      return 80;
    case 'produces':
      // Period element produces subject: excellent (Resource)
      return 95;
    case 'produced':
      // Subject produces period: energy drain (Output)
      return 45;
    case 'controls':
      // Period element controls subject: challenging (Power/Pressure)
      return 25;
    case 'controlled':
      // Subject controls period: effort required (Wealth)
      return 60;
  }
}

/**
 * Calculate element challenge score
 * Higher = more challenging
 */
export function calculateElementChallenge(
  subjectElement: ElementName,
  periodElement: ElementName
): number {
  const relation = getElementRelation(periodElement, subjectElement);

  switch (relation) {
    case 'same':
      return 10;
    case 'produces':
      return 5;
    case 'produced':
      return 40;
    case 'controls':
      return 75;
    case 'controlled':
      return 30;
  }
}

