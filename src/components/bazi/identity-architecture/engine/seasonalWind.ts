/**
 * Seasonal Wind — directional fog drift based on season
 *
 * Each season has a characteristic wind direction:
 *   Spring: rising (east wind)
 *   Summer: warm southerly
 *   Autumn: falling (west wind)
 *   Winter: cold northerly
 */

export interface WindVector {
  /** Horizontal direction: -1 (left) to 1 (right) */
  x: number;
  /** Vertical direction: -1 (up) to 1 (down) */
  y: number;
  /** Drift speed multiplier */
  speed: number;
}

export function windVectorForSeason(season: string): WindVector {
  switch (season.toLowerCase()) {
    case 'spring':
      return { x: 1, y: -1, speed: 1.1 };    // rising east wind
    case 'summer':
      return { x: 0.5, y: 0.8, speed: 0.8 }; // warm, slow southern drift
    case 'autumn': case 'fall':
      return { x: -1, y: 1, speed: 1.2 };     // falling west wind
    case 'winter':
      return { x: -0.5, y: -0.8, speed: 0.6 };// cold, slow northern wind
    default:
      return { x: 0, y: 0, speed: 1 };
  }
}
