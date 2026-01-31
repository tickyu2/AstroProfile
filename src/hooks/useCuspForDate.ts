/**
 * useCuspForDate Hook
 * React hook for resolving dates to their cusp archetype
 */

import { useMemo } from 'react';
import {
  CuspDateResult,
  getCuspDayByDate,
  getCuspDayByMonthDay,
  fastCuspLookup,
  getPhiBlend
} from '../utils/cuspHelpers';
import { getPureSign, PureSignArchetype } from '../data/pureSignArchetypes';

// ============================================================================
// Types
// ============================================================================

export interface CuspResolution {
  // Cusp data (if on a cusp)
  cusp: CuspDateResult | null;

  // Whether this date is on a cusp
  isOnCusp: boolean;

  // The dominant sign for this date
  dominantSign: string;

  // The pure sign archetype for the dominant sign
  pureArchetype: PureSignArchetype | undefined;

  // Blend percentages (if on cusp)
  blend: {
    fromPercent: number;
    toPercent: number;
  } | null;

  // Display helpers
  displayName: string;
  shortDescription: string;
}

// ============================================================================
// Sign Date Ranges (for non-cusp dates)
// ============================================================================

const SIGN_DATE_RANGES: Array<{
  sign: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}> = [
  { sign: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { sign: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 }
];

/**
 * Get the zodiac sign for a given month/day (non-cusp lookup)
 */
function getSignForDate(month: number, day: number): string {
  // Handle Capricorn's year-spanning range specially
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'Capricorn';
  }

  for (const range of SIGN_DATE_RANGES) {
    if (range.sign === 'Capricorn') continue; // Already handled

    const afterStart = month > range.startMonth ||
                       (month === range.startMonth && day >= range.startDay);
    const beforeEnd = month < range.endMonth ||
                      (month === range.endMonth && day <= range.endDay);

    if (afterStart && beforeEnd) {
      return range.sign;
    }
  }

  return 'Unknown';
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * Resolve a date to its cusp archetype or pure sign
 * @param date - Date object, ISO string, or month/day tuple
 */
export function useCuspForDate(
  date: Date | string | [number, number] | null
): CuspResolution {
  return useMemo(() => {
    // Handle null/undefined
    if (!date) {
      return {
        cusp: null,
        isOnCusp: false,
        dominantSign: 'Unknown',
        pureArchetype: undefined,
        blend: null,
        displayName: 'Unknown',
        shortDescription: 'No date provided'
      };
    }

    // Parse the date input
    let month: number;
    let day: number;

    if (Array.isArray(date)) {
      [month, day] = date;
    } else {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) {
        return {
          cusp: null,
          isOnCusp: false,
          dominantSign: 'Unknown',
          pureArchetype: undefined,
          blend: null,
          displayName: 'Unknown',
          shortDescription: 'Invalid date'
        };
      }
      month = d.getMonth() + 1;
      day = d.getDate();
    }

    // Try fast cusp lookup first
    const cuspResult = fastCuspLookup(month, day);

    if (cuspResult) {
      // Date is on a cusp
      const { cusp, dayArchetype } = cuspResult;
      const dominantSign = dayArchetype.blendNew >= 0.5
        ? cusp.cusp.toSign
        : cusp.cusp.fromSign;

      return {
        cusp: cuspResult,
        isOnCusp: true,
        dominantSign,
        pureArchetype: getPureSign(dominantSign),
        blend: {
          fromPercent: Math.round(dayArchetype.blendOld * 100),
          toPercent: Math.round(dayArchetype.blendNew * 100)
        },
        displayName: dayArchetype.mythicName,
        shortDescription: `${cusp.cusp.cuspName} · Day ${dayArchetype.day} · ${dayArchetype.title}`
      };
    }

    // Not on a cusp - return pure sign
    const sign = getSignForDate(month, day);
    const pureArchetype = getPureSign(sign);

    return {
      cusp: null,
      isOnCusp: false,
      dominantSign: sign,
      pureArchetype,
      blend: null,
      displayName: pureArchetype?.mythicName || sign,
      shortDescription: pureArchetype?.title || `Pure ${sign}`
    };
  }, [date]);
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Get cusp resolution for today's date
 */
export function useTodaysCusp(): CuspResolution {
  const today = useMemo(() => new Date(), []);
  return useCuspForDate(today);
}

/**
 * Get cusp resolution for a birth date
 */
export function useBirthCusp(birthDate: Date | string | null): CuspResolution {
  return useCuspForDate(birthDate);
}

/**
 * Check if two dates share the same cusp archetype
 */
export function useSharesCusp(
  date1: Date | string | null,
  date2: Date | string | null
): boolean {
  const resolution1 = useCuspForDate(date1);
  const resolution2 = useCuspForDate(date2);

  return useMemo(() => {
    if (!resolution1.isOnCusp || !resolution2.isOnCusp) {
      return false;
    }

    const cusp1 = resolution1.cusp?.cusp;
    const cusp2 = resolution2.cusp?.cusp;

    return cusp1?.cusp.id === cusp2?.cusp.id;
  }, [resolution1, resolution2]);
}

export default useCuspForDate;
