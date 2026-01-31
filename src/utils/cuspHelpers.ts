/**
 * Cusp Helper Functions
 * Academy-consistent indexing and querying for the 72 Cusp Archetypes
 */

import {
  CUSP_TRANSITIONS,
  CuspTransition,
  CuspDayArchetype,
  getCuspById as getCuspByIdFromData,
  getArchetypeByDate as getArchetypeByDateFromData
} from '../data/cuspArchetypes';

// ============================================================================
// Types
// ============================================================================

export interface CuspDateResult {
  cusp: CuspTransition;
  dayArchetype: CuspDayArchetype;
  isPureCusp: boolean;
  blendDescription: string;
}

export interface DateParseResult {
  month: number;
  day: number;
  isValid: boolean;
}

// ============================================================================
// Date Parsing Utilities
// ============================================================================

/**
 * Parse a date label like "Mar 21" or "December 25" into month/day
 */
export function parseDateLabel(dateLabel: string): DateParseResult {
  const monthMap: Record<string, number> = {
    'jan': 1, 'january': 1,
    'feb': 2, 'february': 2,
    'mar': 3, 'march': 3,
    'apr': 4, 'april': 4,
    'may': 5,
    'jun': 6, 'june': 6,
    'jul': 7, 'july': 7,
    'aug': 8, 'august': 8,
    'sep': 9, 'september': 9,
    'oct': 10, 'october': 10,
    'nov': 11, 'november': 11,
    'dec': 12, 'december': 12
  };

  const normalized = dateLabel.toLowerCase().trim();
  const match = normalized.match(/^([a-z]+)\s*(\d{1,2})$/);

  if (!match) {
    return { month: 0, day: 0, isValid: false };
  }

  const monthStr = match[1];
  const day = parseInt(match[2], 10);
  const month = monthMap[monthStr];

  if (!month || day < 1 || day > 31) {
    return { month: 0, day: 0, isValid: false };
  }

  return { month, day, isValid: true };
}

/**
 * Parse a Date object or date string into month/day
 */
export function parseDate(date: Date | string): DateParseResult {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return { month: 0, day: 0, isValid: false };
  }

  return {
    month: d.getMonth() + 1, // JavaScript months are 0-indexed
    day: d.getDate(),
    isValid: true
  };
}

// ============================================================================
// Cusp Lookup Functions
// ============================================================================

/**
 * Get a cusp transition by its ID (e.g., "pisces-aries")
 */
export function getCuspById(cuspId: string): CuspTransition | undefined {
  return getCuspByIdFromData(cuspId);
}

/**
 * Get a cusp day archetype by date label (e.g., "Mar 21")
 */
export function getCuspDayByDateLabel(dateLabel: string): CuspDateResult | null {
  const parsed = parseDateLabel(dateLabel);
  if (!parsed.isValid) return null;

  return getCuspDayByMonthDay(parsed.month, parsed.day);
}

/**
 * Get a cusp day archetype by Date object
 */
export function getCuspDayByDate(date: Date): CuspDateResult | null {
  const parsed = parseDate(date);
  if (!parsed.isValid) return null;

  return getCuspDayByMonthDay(parsed.month, parsed.day);
}

/**
 * Get a cusp day archetype by month and day numbers
 */
export function getCuspDayByMonthDay(month: number, day: number): CuspDateResult | null {
  // Iterate through all cusps to find matching date
  for (const cusp of CUSP_TRANSITIONS) {
    for (const archetype of cusp.archetypes) {
      const archetypeParsed = parseDateLabel(archetype.date);
      if (archetypeParsed.isValid &&
          archetypeParsed.month === month &&
          archetypeParsed.day === day) {
        return {
          cusp,
          dayArchetype: archetype,
          isPureCusp: archetype.day === 3 || archetype.day === 4, // Days 3-4 are most balanced
          blendDescription: formatBlendDescription(archetype, cusp)
        };
      }
    }
  }

  return null;
}

/**
 * Check if a given date falls within any cusp period
 */
export function isDateOnCusp(date: Date): boolean {
  return getCuspDayByDate(date) !== null;
}

/**
 * Get all cusp transitions for a specific element transition type
 * e.g., "fire-earth" returns all cusps going from fire to earth signs
 */
export function getCuspsByElementalTransition(
  fromElement: string,
  toElement: string
): CuspTransition[] {
  return CUSP_TRANSITIONS.filter(
    cusp => cusp.fromElement.toLowerCase() === fromElement.toLowerCase() &&
            cusp.toElement.toLowerCase() === toElement.toLowerCase()
  );
}

/**
 * Get cusps by the "from" sign
 */
export function getCuspsByFromSign(sign: string): CuspTransition | undefined {
  return CUSP_TRANSITIONS.find(
    cusp => cusp.fromSign.toLowerCase() === sign.toLowerCase()
  );
}

/**
 * Get cusps by the "to" sign
 */
export function getCuspsByToSign(sign: string): CuspTransition | undefined {
  return CUSP_TRANSITIONS.find(
    cusp => cusp.toSign.toLowerCase() === sign.toLowerCase()
  );
}

// ============================================================================
// Blend Description Formatters
// ============================================================================

/**
 * Format a human-readable blend description
 */
export function formatBlendDescription(
  archetype: CuspDayArchetype,
  cusp: CuspTransition
): string {
  const newPercent = Math.round(archetype.blendNew * 100);
  const oldPercent = Math.round(archetype.blendOld * 100);

  if (newPercent <= 20) {
    return `Mostly ${cusp.fromSign} with emerging ${cusp.toSign} undertones`;
  } else if (newPercent <= 40) {
    return `${cusp.fromSign}-dominant with growing ${cusp.toSign} influence`;
  } else if (newPercent <= 60) {
    return `Balanced ${cusp.fromSign}-${cusp.toSign} synthesis`;
  } else if (newPercent <= 80) {
    return `${cusp.toSign}-dominant with ${cusp.fromSign} foundation`;
  } else {
    return `Primarily ${cusp.toSign} with ${cusp.fromSign} echoes`;
  }
}

/**
 * Get the elemental dynamic description
 */
export function getElementalDynamicDescription(cusp: CuspTransition): string {
  const fromEl = cusp.fromElement.toLowerCase();
  const toEl = cusp.toElement.toLowerCase();

  // Same element
  if (fromEl === toEl) {
    return `Pure ${cusp.fromElement} continuity`;
  }

  // Element transitions
  const dynamics: Record<string, string> = {
    'fire-earth': 'Inspiration grounds into form',
    'earth-air': 'Matter dissolves into thought',
    'air-water': 'Thought deepens into feeling',
    'water-fire': 'Emotion ignites into action',
    'fire-air': 'Flame feeds wind—expansion',
    'air-fire': 'Wind fans flame—acceleration',
    'earth-water': 'Earth receives the depths',
    'water-earth': 'Feeling crystallizes into matter',
    'fire-water': 'Steam and alchemy—transformation',
    'water-air': 'Mist rising—intuition meets intellect',
    'earth-fire': 'Volcano emergence—breakthrough',
    'air-earth': 'Ideas land and take root'
  };

  return dynamics[`${fromEl}-${toEl}`] || cusp.elementalDynamic;
}

// ============================================================================
// Cusp Index Builder (for fast lookups)
// ============================================================================

export interface CuspDateIndex {
  [monthDay: string]: {
    cusp: CuspTransition;
    dayArchetype: CuspDayArchetype;
  };
}

/**
 * Build a fast lookup index keyed by "MM-DD" strings
 */
export function buildCuspDateIndex(): CuspDateIndex {
  const index: CuspDateIndex = {};

  for (const cusp of CUSP_TRANSITIONS) {
    for (const archetype of cusp.archetypes) {
      const parsed = parseDateLabel(archetype.date);
      if (parsed.isValid) {
        const key = `${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
        index[key] = { cusp, dayArchetype: archetype };
      }
    }
  }

  return index;
}

// Pre-built index for fast lookups
let _cuspDateIndex: CuspDateIndex | null = null;

/**
 * Get the pre-built cusp date index (lazy initialization)
 */
export function getCuspDateIndex(): CuspDateIndex {
  if (!_cuspDateIndex) {
    _cuspDateIndex = buildCuspDateIndex();
  }
  return _cuspDateIndex;
}

/**
 * Fast cusp lookup using pre-built index
 */
export function fastCuspLookup(month: number, day: number): CuspDateResult | null {
  const index = getCuspDateIndex();
  const key = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const entry = index[key];

  if (!entry) return null;

  return {
    cusp: entry.cusp,
    dayArchetype: entry.dayArchetype,
    isPureCusp: entry.dayArchetype.day === 3 || entry.dayArchetype.day === 4,
    blendDescription: formatBlendDescription(entry.dayArchetype, entry.cusp)
  };
}

// ============================================================================
// Cusp Statistics
// ============================================================================

/**
 * Get statistics about the cusp system
 */
export function getCuspStatistics() {
  return {
    totalCusps: CUSP_TRANSITIONS.length,
    totalArchetypes: CUSP_TRANSITIONS.reduce((sum, c) => sum + c.archetypes.length, 0),
    daysPerCusp: 6,
    elementalTransitions: {
      fireToEarth: getCuspsByElementalTransition('fire', 'earth').length,
      earthToAir: getCuspsByElementalTransition('earth', 'air').length,
      airToWater: getCuspsByElementalTransition('air', 'water').length,
      waterToFire: getCuspsByElementalTransition('water', 'fire').length
    }
  };
}

// ============================================================================
// φ-Curve Constants (Golden Ratio Blend)
// ============================================================================

export const PHI_CURVE = {
  day1: { blendNew: 0.13, blendOld: 0.87 },
  day2: { blendNew: 0.37, blendOld: 0.63 },
  day3: { blendNew: 0.58, blendOld: 0.42 },
  day4: { blendNew: 0.75, blendOld: 0.25 },
  day5: { blendNew: 0.89, blendOld: 0.11 },
  day6: { blendNew: 0.98, blendOld: 0.02 }
} as const;

/**
 * Get the φ-curve blend values for a specific day (1-6)
 */
export function getPhiBlend(day: number): { blendNew: number; blendOld: number } {
  const clamped = Math.max(1, Math.min(6, day));
  const key = `day${clamped}` as keyof typeof PHI_CURVE;
  return PHI_CURVE[key];
}
