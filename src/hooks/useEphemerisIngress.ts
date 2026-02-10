/**
 * useEphemerisIngress.ts
 *
 * Fetches Swiss Ephemeris-precise Sun ingress dates for a given year.
 * Caches per-year in a module-level Map to avoid redundant API calls.
 *
 * Returns an array of 12 UTC timestamps (ms) indexed by sign order:
 *   [0]=Aries, [1]=Taurus, ... [11]=Pisces
 *
 * Returns null while loading or on error (callers fall back to static averages).
 */

import { useState, useEffect } from 'react';
// @ts-ignore
import { getSeasonalIngresses } from '../services/pythonFunctionsService';

const SIGN_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export interface EphemerisIngressData {
  /** UTC timestamps (ms since epoch) for the start of each sign, indexed 0-11 */
  ingressTimestamps: number[];
  /** The year these ingresses cover */
  year: number;
}

// Module-level cache: year → resolved data (persists across re-renders/mounts)
const cache = new Map<number, EphemerisIngressData>();
// Deduplicate concurrent requests for the same year
const inFlight = new Map<number, Promise<EphemerisIngressData | null>>();

async function fetchAndCache(year: number): Promise<EphemerisIngressData | null> {
  if (cache.has(year)) return cache.get(year)!;
  if (inFlight.has(year)) return inFlight.get(year)!;

  const promise = (async () => {
    try {
      const result = await getSeasonalIngresses(year);
      const ingresses = result.ingresses;

      // Build timestamp array ordered by ecliptic sign (Aries=0 ... Pisces=11)
      const timestamps: number[] = new Array(12).fill(0);
      for (const ing of ingresses) {
        const idx = SIGN_ORDER.indexOf(ing.sign);
        if (idx >= 0) {
          timestamps[idx] = new Date(ing.datetime_utc).getTime();
        }
      }

      const data: EphemerisIngressData = { ingressTimestamps: timestamps, year };
      cache.set(year, data);
      return data;
    } catch (err) {
      console.warn(`[useEphemerisIngress] Failed for year ${year}:`, err);
      return null;
    } finally {
      inFlight.delete(year);
    }
  })();

  inFlight.set(year, promise);
  return promise;
}

/**
 * Hook: provides ephemeris ingress data for a given birth year.
 * @param birthYear - The year to fetch ingresses for, or null/undefined to skip.
 * @returns EphemerisIngressData or null if loading/unavailable.
 */
export function useEphemerisIngress(birthYear: number | null | undefined): EphemerisIngressData | null {
  const [data, setData] = useState<EphemerisIngressData | null>(
    birthYear != null && cache.has(birthYear) ? cache.get(birthYear)! : null
  );

  useEffect(() => {
    if (birthYear == null) {
      setData(null);
      return;
    }

    // Synchronous cache hit
    if (cache.has(birthYear)) {
      setData(cache.get(birthYear)!);
      return;
    }

    let cancelled = false;
    fetchAndCache(birthYear).then((result) => {
      if (!cancelled) setData(result);
    });

    return () => { cancelled = true; };
  }, [birthYear]);

  return data;
}
