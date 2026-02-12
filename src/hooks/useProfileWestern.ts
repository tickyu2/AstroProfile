import { useMemo } from 'react';
import { getSunBlendFromDate } from '../zodiac/cusp';

export interface HouseCuspData {
  house: number;       // 1-12
  longitude: number;   // 0-359.99 (absolute ecliptic)
  sign: string;        // Zodiac sign on cusp
  degree: number;      // 0-29.99 (degree within sign)
}

export interface WesternData {
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  birthDate: string | Date | null;
  birthTime: string | null;
  sunLongitude: number | null;
  moonLongitude: number | null;
  risingLongitude: number | null;
  venusLongitude: number | null;
  marsLongitude: number | null;
  venusSign: string | null;
  marsSign: string | null;
  mercurySign: string | null;
  jupiterSign: string | null;
  saturnSign: string | null;
  uranusSign: string | null;
  neptuneSign: string | null;
  plutoSign: string | null;
  houseCusps: HouseCuspData[] | null;
  allPlanetLongitudes: Record<string, number> | null;
}

/** Planet data from backend (sign + longitude + optional fields) */
interface PlanetData {
  sign?: string;
  longitude?: number;
  [key: string]: unknown;
}

/** Western astrology data from backend (loosely typed for API flexibility) */
interface WesternBackendData {
  sun?: PlanetData;
  moon?: PlanetData;
  sign?: string;
  ascendant?: string | PlanetData;
  rising?: PlanetData | string;
  planets?: Record<string, PlanetData>;
  houses?: Array<{ house: number; longitude: number; sign: string; degree: number }>;
  [key: string]: unknown;
}

/** Minimal profile shape for western data extraction */
interface ProfileRecord {
  id: string;
  birthDate?: string;
  dateOfBirth?: string;
  birthTime?: string;
  western?: WesternBackendData;
  calculations?: { western?: WesternBackendData };
  [key: string]: unknown;
}

export function useProfileWestern(
  profiles: ProfileRecord[] | null | undefined,
  profileId: string
) {
  const selectedProfile = useMemo(() => {
    return profiles?.find((p) => p.id === profileId) || null;
  }, [profiles, profileId]);

  const profileWestern = useMemo((): WesternData | null => {
    if (!selectedProfile) return null;
    const western = selectedProfile.western || selectedProfile.calculations?.western;
    if (!western) return null;

    const ascendant = western.ascendant;
    const rising = western.rising;
    const risingSign = typeof ascendant === 'string'
      ? ascendant
      : (ascendant?.sign || (typeof rising === 'object' ? rising?.sign : rising) || null);

    const planets: Record<string, PlanetData> = western.planets || {};

    // Extract house cusps (12 cusps from Python backend)
    const rawHouses = western.houses;
    const houseCusps: HouseCuspData[] | null =
      Array.isArray(rawHouses) && rawHouses.length >= 12
        ? rawHouses.map((h: { house: number; longitude: number; sign: string; degree: number }) => ({
            house: h.house as number,
            longitude: h.longitude as number,
            sign: h.sign as string,
            degree: h.degree as number,
          }))
        : null;

    // Extract all planet longitudes for synastry house overlay
    const allPlanetLongitudes: Record<string, number> | null = (() => {
      const result: Record<string, number> = {};
      if (western.sun?.longitude != null) result['Sun'] = western.sun.longitude;
      if (western.moon?.longitude != null) result['Moon'] = western.moon.longitude;
      const planetNames = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
      for (const name of planetNames) {
        const key = name.toLowerCase();
        const p = planets[key] || planets[name];
        if (p?.longitude != null) result[name] = p.longitude;
      }
      return Object.keys(result).length > 0 ? result : null;
    })();

    return {
      sunSign: western.sun?.sign || western.sign || null,
      moonSign: western.moon?.sign || null,
      risingSign,
      birthDate: selectedProfile.birthDate || selectedProfile.dateOfBirth || null,
      birthTime: selectedProfile.birthTime || null,
      sunLongitude: western.sun?.longitude ?? null,
      moonLongitude: western.moon?.longitude ?? null,
      risingLongitude: (typeof ascendant === 'object' ? ascendant?.longitude : null) ?? null,
      venusLongitude: planets.venus?.longitude ?? planets.Venus?.longitude ?? null,
      marsLongitude: planets.mars?.longitude ?? planets.Mars?.longitude ?? null,
      venusSign: planets.venus?.sign || planets.Venus?.sign || null,
      marsSign: planets.mars?.sign || planets.Mars?.sign || null,
      mercurySign: planets.mercury?.sign || planets.Mercury?.sign || null,
      jupiterSign: planets.jupiter?.sign || planets.Jupiter?.sign || null,
      saturnSign: planets.saturn?.sign || planets.Saturn?.sign || null,
      uranusSign: planets.uranus?.sign || planets.Uranus?.sign || null,
      neptuneSign: planets.neptune?.sign || planets.Neptune?.sign || null,
      plutoSign: planets.pluto?.sign || planets.Pluto?.sign || null,
      houseCusps,
      allPlanetLongitudes,
    };
  }, [selectedProfile]);

  const sunCusp = useMemo(() => {
    if (!profileWestern?.birthDate) return null;
    try {
      const date = typeof profileWestern.birthDate === 'string'
        ? new Date(profileWestern.birthDate)
        : profileWestern.birthDate;
      if (isNaN((date as Date).getTime())) return null;
      return getSunBlendFromDate(date as Date);
    } catch {
      return null;
    }
  }, [profileWestern?.birthDate]);

  return { selectedProfile, profileWestern, sunCusp };
}
