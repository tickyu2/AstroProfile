/**
 * Seasonal Modulation — pulse changes with the current season
 *
 * Modulates speed, amplitude, and hue based on the time of year.
 * Can be upgraded to use BaZi solar terms for precision.
 */

export interface SeasonalModulation {
  speedMultiplier: number;      // BPM modifier
  amplitudeMultiplier: number;  // pulse size modifier
  hueShift: number;             // warm/cool tint offset
  label: string;
}

/** Map season name to modulation values */
export function modulationFromSeason(season: string): SeasonalModulation {
  switch (season.toLowerCase()) {
    case 'spring':
      return { speedMultiplier: 1.1, amplitudeMultiplier: 1.1, hueShift: 10, label: 'Spring' };
    case 'summer':
      return { speedMultiplier: 1.2, amplitudeMultiplier: 1.2, hueShift: 20, label: 'Summer' };
    case 'autumn': case 'fall':
      return { speedMultiplier: 0.9, amplitudeMultiplier: 0.95, hueShift: -10, label: 'Autumn' };
    case 'winter':
      return { speedMultiplier: 0.8, amplitudeMultiplier: 0.9, hueShift: -20, label: 'Winter' };
    default:
      return { speedMultiplier: 1, amplitudeMultiplier: 1, hueShift: 0, label: season };
  }
}

/** Fog color shifts with the season */
export function fogColorForSeason(season: string): { inner: string; outer: string } {
  switch (season.toLowerCase()) {
    case 'spring':
      return { inner: 'hsl(130, 55%, 65%)', outer: 'hsl(120, 45%, 55%)' };
    case 'summer':
      return { inner: 'hsl(15, 65%, 65%)', outer: 'hsl(10, 55%, 55%)' };
    case 'autumn': case 'fall':
      return { inner: 'hsl(40, 60%, 60%)', outer: 'hsl(35, 50%, 50%)' };
    case 'winter':
      return { inner: 'hsl(215, 50%, 70%)', outer: 'hsl(210, 45%, 60%)' };
    default:
      return { inner: 'hsl(220, 40%, 65%)', outer: 'hsl(220, 35%, 55%)' };
  }
}

/** Detect current season from system date (Northern Hemisphere) */
export function getCurrentSeason(): string {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}
