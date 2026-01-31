/**
 * compatibilityEngine.ts
 * ======================
 *
 * Core engine for computing elemental compatibility between two profiles.
 * Uses the φ-curve zodiac blend data and elemental vectors to determine
 * compatibility grades, scores, and retrieve appropriate narratives.
 *
 * GENESIS AstroProfile - January 2026
 */

import {
  Element,
  ElementVector,
  PersonProfile,
  CompatibilityResult,
  CompatibilityGrade,
  CompatibilityHighlight,
  ELEMENT_EMOJI,
} from './compatibilityTypes';

import { getNarrativeForElements, getGradeForElements } from './elementalNarratives';

import {
  DayBlend,
  getElementVector,
  generateYearBlend,
} from './zodiacBlendData';

// =============================================================================
// ELEMENT ANALYSIS
// =============================================================================

/**
 * Get the dominant element from an element vector
 */
export function getDominantElement(vec: ElementVector): Element {
  const entries: [Element, number][] = [
    ['fire', vec.fire],
    ['earth', vec.earth],
    ['air', vec.air],
    ['water', vec.water],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

/**
 * Get the secondary element from an element vector (second highest)
 */
export function getSecondaryElement(vec: ElementVector): Element {
  const entries: [Element, number][] = [
    ['fire', vec.fire],
    ['earth', vec.earth],
    ['air', vec.air],
    ['water', vec.water],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[1][0];
}

/**
 * Get element percentages as a sorted array
 */
export function getElementBreakdown(vec: ElementVector): Array<{ element: Element; percent: number }> {
  return [
    { element: 'fire' as Element, percent: vec.fire },
    { element: 'earth' as Element, percent: vec.earth },
    { element: 'air' as Element, percent: vec.air },
    { element: 'water' as Element, percent: vec.water },
  ]
    .filter((e) => e.percent > 0)
    .sort((a, b) => b.percent - a.percent);
}

// =============================================================================
// GRADE CALCULATION
// =============================================================================

/**
 * Calculate compatibility grade for two elements
 */
export function calculateGrade(a: Element, b: Element): CompatibilityGrade {
  const pair = [a, b].sort().join('-');

  // Grade A: Natural harmony pairs
  const gradeA = ['air-fire', 'earth-water'];
  if (gradeA.includes(pair)) return 'A';

  // Grade B: Growth potential pairs
  const gradeB = ['earth-fire', 'air-water', 'air-earth', 'fire-water'];
  if (gradeB.includes(pair)) return 'B';

  // Neutral: Same element pairs
  return 'Neutral';
}

/**
 * Calculate a numerical compatibility score (0-1)
 * This allows for more nuanced compatibility beyond just grades
 */
export function calculateScore(
  vecA: ElementVector,
  vecB: ElementVector,
  grade: CompatibilityGrade
): number {
  // Base score from grade
  let baseScore = grade === 'A' ? 0.85 : grade === 'B' ? 0.65 : 0.45;

  // Adjust based on element vector alignment
  // When both profiles have similar secondary elements, add a bonus
  const secondaryA = getSecondaryElement(vecA);
  const secondaryB = getSecondaryElement(vecB);
  const secondaryGrade = calculateGrade(secondaryA, secondaryB);

  if (secondaryGrade === 'A') baseScore += 0.08;
  else if (secondaryGrade === 'B') baseScore += 0.04;

  // Adjust for blend intensity (cusp days have more elemental variety)
  const varietyA = Object.values(vecA).filter((v) => v > 0.1).length;
  const varietyB = Object.values(vecB).filter((v) => v > 0.1).length;
  const varietyBonus = (varietyA + varietyB - 2) * 0.02;

  return Math.min(1, Math.max(0, baseScore + varietyBonus));
}

// =============================================================================
// PROFILE CREATION
// =============================================================================

/**
 * Create a PersonProfile from a DayBlend
 */
export function createProfileFromDayBlend(day: DayBlend): PersonProfile {
  const elements = getElementVector(day);
  return {
    id: day.date,
    date: day.date,
    sign: day.primarySign,
    elements,
    blendSign: day.blendSign ?? undefined,
    blendPercent: day.blendPercent,
  };
}

/**
 * Format date for display (e.g., "June 6")
 */
function formatDateDisplay(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  const date = new Date(2000, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

// =============================================================================
// MAIN COMPATIBILITY FUNCTION
// =============================================================================

/**
 * Compute full compatibility result between two profiles
 */
export function computeCompatibility(
  personA: PersonProfile,
  personB: PersonProfile
): CompatibilityResult {
  const domA = getDominantElement(personA.elements);
  const domB = getDominantElement(personB.elements);

  const grade = calculateGrade(domA, domB);
  const pairId = [domA, domB].sort().join('-');
  const narrative = getNarrativeForElements(domA, domB);
  const score = calculateScore(personA.elements, personB.elements, grade);

  // Get secondary elements for nuanced reading
  const secA = getSecondaryElement(personA.elements);
  const secB = getSecondaryElement(personB.elements);

  return {
    personA,
    personB,
    dominantA: domA,
    dominantB: domB,
    grade,
    pairId,
    narrative,
    score,
    secondaryElements: {
      a: secA,
      b: secB,
    },
  };
}

/**
 * Compute compatibility between two DayBlend objects
 */
export function computeDayCompatibility(dayA: DayBlend, dayB: DayBlend): CompatibilityResult {
  const profileA = createProfileFromDayBlend(dayA);
  const profileB = createProfileFromDayBlend(dayB);
  return computeCompatibility(profileA, profileB);
}

// =============================================================================
// WHEEL HIGHLIGHTING
// =============================================================================

/**
 * Generate compatibility highlights for entire wheel
 * Returns a map of date -> highlight info for D3 rendering
 */
export function generateWheelHighlights(
  anchorProfile: PersonProfile,
  year: number
): Map<string, CompatibilityHighlight> {
  const yearData = generateYearBlend(year);
  const highlights = new Map<string, CompatibilityHighlight>();

  for (const day of yearData) {
    const otherProfile = createProfileFromDayBlend(day);
    const result = computeCompatibility(anchorProfile, otherProfile);

    highlights.set(day.date, {
      date: day.date,
      grade: result.grade,
      score: result.score,
      dominantElement: result.dominantB,
    });
  }

  return highlights;
}

/**
 * Get highlight info for a specific date
 */
export function getHighlightForDate(
  highlights: Map<string, CompatibilityHighlight>,
  date: string
): CompatibilityHighlight | null {
  return highlights.get(date) ?? null;
}

// =============================================================================
// STATISTICS & ANALYSIS
// =============================================================================

/**
 * Count how many days fall into each grade for an anchor profile
 */
export function countGradeDistribution(
  anchorProfile: PersonProfile,
  year: number
): Record<CompatibilityGrade, number> {
  const highlights = generateWheelHighlights(anchorProfile, year);
  const counts: Record<CompatibilityGrade, number> = { A: 0, B: 0, Neutral: 0 };

  highlights.forEach((h) => {
    counts[h.grade]++;
  });

  return counts;
}

/**
 * Find best compatibility matches for a profile
 */
export function findBestMatches(
  anchorProfile: PersonProfile,
  year: number,
  limit = 10
): Array<{ date: string; score: number; grade: CompatibilityGrade }> {
  const highlights = generateWheelHighlights(anchorProfile, year);

  const sorted = Array.from(highlights.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((h) => ({
      date: h.date,
      score: h.score,
      grade: h.grade,
    }));

  return sorted;
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Get a short summary of compatibility for display
 */
export function getCompatibilitySummary(result: CompatibilityResult): string {
  const { grade, dominantA, dominantB, narrative } = result;
  const emojiA = ELEMENT_EMOJI[dominantA];
  const emojiB = ELEMENT_EMOJI[dominantB];

  if (grade === 'A') {
    return `${emojiA}${emojiB} Natural Harmony — ${narrative.title}`;
  } else if (grade === 'B') {
    return `${emojiA}${emojiB} Growth Potential — ${narrative.title}`;
  } else {
    return `${emojiA}${emojiB} Mirror Energy — ${narrative.title}`;
  }
}

/**
 * Get element emoji string for display
 */
export function getElementEmoji(element: Element): string {
  return ELEMENT_EMOJI[element];
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  getDominantElement,
  getSecondaryElement,
  getElementBreakdown,
  calculateGrade,
  calculateScore,
  createProfileFromDayBlend,
  computeCompatibility,
  computeDayCompatibility,
  generateWheelHighlights,
  getHighlightForDate,
  countGradeDistribution,
  findBestMatches,
  getCompatibilitySummary,
  getElementEmoji,
};
