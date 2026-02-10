/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * D3 Transformers
 *
 * Transform typed data into D3-compatible structures for:
 * - Ring layouts (cathedral wheel)
 * - Arc segments
 * - Degree-based highlighting
 * - Full 12-sign zodiac wheel
 */

import {
  RingSegment,
  FullZodiacRingLayout
} from '../types/seasonalEcology';
import { getAllSignsOrdered } from '../data/allZodiacSigns';

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const SEASON_COLORS = {
  spring: "#90EE90",  // Light green
  summer: "#FFD700",  // Gold
  autumn: "#FF8C00",  // Dark orange
  winter: "#4169E1"   // Royal blue
} as const;

export const ELEMENT_COLORS = {
  fire: "#FF4500",    // Orange-red
  earth: "#8B4513",   // Saddle brown
  air: "#87CEEB",     // Sky blue
  water: "#4682B4"    // Steel blue
} as const;

export const MODALITY_COLORS = {
  cardinal: "#FF6B6B", // Coral red
  fixed: "#4ECDC4",    // Turquoise
  mutable: "#95E1D3"   // Mint
} as const;

// ============================================================================
// ZODIAC CONSTANTS
// ============================================================================

const SIGN_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

const SIGN_SYMBOLS = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓"
} as const;

// Season mapping for each sign
const SIGN_SEASONS = {
  Aries: "spring", Taurus: "spring", Gemini: "spring",
  Cancer: "summer", Leo: "summer", Virgo: "summer",
  Libra: "autumn", Scorpio: "autumn", Sagittarius: "autumn",
  Capricorn: "winter", Aquarius: "winter", Pisces: "winter"
} as const;

// Modality mapping for each sign
const SIGN_MODALITIES = {
  Aries: "cardinal", Taurus: "fixed", Gemini: "mutable",
  Cancer: "cardinal", Leo: "fixed", Virgo: "mutable",
  Libra: "cardinal", Scorpio: "fixed", Sagittarius: "mutable",
  Capricorn: "cardinal", Aquarius: "fixed", Pisces: "mutable"
} as const;

// Element mapping for each sign
const SIGN_ELEMENTS = {
  Aries: "fire", Taurus: "earth", Gemini: "air",
  Cancer: "water", Leo: "fire", Virgo: "earth",
  Libra: "air", Scorpio: "water", Sagittarius: "fire",
  Capricorn: "earth", Aquarius: "air", Pisces: "water"
} as const;

// ============================================================================
// DEGREE TO ANGLE CONVERSION
// ============================================================================

/**
 * Convert zodiac sign + degree to absolute angle (radians)
 * @param sign - Zodiac sign name
 * @param degree - Degree within sign (0-30)
 * @returns Absolute angle in radians
 */
export function degreeToAngle(sign: string, degree: number): number {
  const fullCircle = 2 * Math.PI;
  const degreesPerSign = fullCircle / 12; // 30° per sign in radians

  const signIndex = SIGN_ORDER.indexOf(sign as typeof SIGN_ORDER[number]);
  if (signIndex === -1) {
    throw new Error(`Unknown zodiac sign: ${sign}`);
  }

  const signStartAngle = signIndex * degreesPerSign;
  const degreeOffset = (degree / 30) * degreesPerSign;

  return signStartAngle + degreeOffset;
}

/**
 * Convert absolute degree (0-360) to radians
 */
export function absoluteDegreeToAngle(degree: number): number {
  return (degree * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function angleToDegree(angle: number): number {
  return (angle * 180) / Math.PI;
}

// ============================================================================
// FULL 12-SIGN ZODIAC WHEEL TRANSFORMER
// ============================================================================

/**
 * Generate complete 12-sign zodiac wheel with 36 segments (3 rings × 12 signs)
 */
export function toFullZodiacRingLayout(): FullZodiacRingLayout {
  const fullCircle = 2 * Math.PI;
  const degreesPerSign = 30;
  const radiansPerSign = fullCircle / 12;

  const segments: RingSegment[] = [];

  SIGN_ORDER.forEach((sign, index) => {
    const startDegree = index * degreesPerSign;
    const endDegree = startDegree + degreesPerSign;
    const startAngle = index * radiansPerSign;
    const endAngle = startAngle + radiansPerSign;

    const season = SIGN_SEASONS[sign];
    const modality = SIGN_MODALITIES[sign];
    const element = SIGN_ELEMENTS[sign];

    // Season ring segment (outermost)
    segments.push({
      ring: "season",
      label: season,
      code: season,
      startAngle,
      endAngle,
      startDegree,
      endDegree,
      color: SEASON_COLORS[season],
      sign,
      highlighted: false,
      meta: {
        sign,
        symbol: SIGN_SYMBOLS[sign],
        seasonName: season.charAt(0).toUpperCase() + season.slice(1)
      }
    });

    // Modality ring segment (middle)
    segments.push({
      ring: "modality",
      label: modality,
      code: modality,
      startAngle,
      endAngle,
      startDegree,
      endDegree,
      color: MODALITY_COLORS[modality],
      sign,
      highlighted: false,
      meta: {
        sign,
        symbol: SIGN_SYMBOLS[sign],
        modalityName: modality.charAt(0).toUpperCase() + modality.slice(1)
      }
    });

    // Element ring segment (innermost)
    segments.push({
      ring: "element",
      label: element,
      code: element,
      startAngle,
      endAngle,
      startDegree,
      endDegree,
      color: ELEMENT_COLORS[element],
      sign,
      highlighted: false,
      meta: {
        sign,
        symbol: SIGN_SYMBOLS[sign],
        elementName: element.charAt(0).toUpperCase() + element.slice(1)
      }
    });
  });

  return {
    segments,
    totalSegments: segments.length, // 36 total (12 signs × 3 rings)
    ringsCount: 3
  };
}

// ============================================================================
// HIGHLIGHTING HELPER
// ============================================================================

/**
 * Create ring layout with specific sign and degree highlighted
 */
export function toRingLayoutWithHighlight(
  sign: string,
  degree: number
): FullZodiacRingLayout {
  const layout = toFullZodiacRingLayout();
  const targetAngle = degreeToAngle(sign, degree);

  // Mark segments as highlighted if they contain the target angle and match the sign
  const highlightedLayout: FullZodiacRingLayout = {
    ...layout,
    segments: layout.segments.map(seg => ({
      ...seg,
      highlighted:
        targetAngle >= seg.startAngle &&
        targetAngle < seg.endAngle &&
        seg.sign === sign
    }))
  };

  return highlightedLayout;
}

// ============================================================================
// SEGMENT FILTERING HELPERS
// ============================================================================

/**
 * Get all segments for a specific ring
 */
export function getSegmentsByRing(
  layout: FullZodiacRingLayout,
  ring: "season" | "modality" | "element"
): RingSegment[] {
  return layout.segments.filter(seg => seg.ring === ring);
}

/**
 * Get segment for specific sign and ring
 */
export function getSegmentForSign(
  layout: FullZodiacRingLayout,
  sign: string,
  ring: "season" | "modality" | "element"
): RingSegment | undefined {
  return layout.segments.find(
    seg => seg.sign === sign && seg.ring === ring
  );
}

/**
 * Get all segments for a specific sign (across all 3 rings)
 */
export function getHighlightedSegments(
  layout: FullZodiacRingLayout,
  sign: string
): RingSegment[] {
  return layout.segments.filter(seg => seg.sign === sign);
}

/**
 * Get only highlighted segments
 */
export function getActiveSegments(layout: FullZodiacRingLayout): RingSegment[] {
  return layout.segments.filter(seg => seg.highlighted);
}

// ============================================================================
// ZODIAC WHEEL DATA TRANSFORMER
// ============================================================================

/**
 * Transform for complete zodiac wheel with all metadata
 */
export interface ZodiacSegment {
  sign: string;
  symbol: string;
  season: string;
  element: string;
  modality: string;
  startDegree: number;
  endDegree: number;
  startAngle: number;
  endAngle: number;
  colors: {
    season: string;
    element: string;
    modality: string;
  };
}

export function toZodiacWheelLayout(): ZodiacSegment[] {
  const signs = getAllSignsOrdered();

  return signs.map((signData, index) => {
    const [startDeg, endDeg] = signData.degreeRange;
    const startAngle = (startDeg * Math.PI) / 180;
    const endAngle = (endDeg * Math.PI) / 180;

    return {
      sign: signData.sign,
      symbol: signData.symbol,
      season: signData.panel.season.name,
      element: signData.panel.element.name,
      modality: signData.panel.modality.name,
      startDegree: startDeg,
      endDegree: endDeg,
      startAngle,
      endAngle,
      colors: {
        season: SEASON_COLORS[signData.panel.season.code],
        element: ELEMENT_COLORS[signData.panel.element.code],
        modality: MODALITY_COLORS[signData.panel.modality.code]
      }
    };
  });
}

// ============================================================================
// DEGREE RANGE HELPERS
// ============================================================================

/**
 * Check if a degree falls within a sign's range
 */
export function isDegreeinSignRange(
  degree: number,
  signStartDegree: number,
  signEndDegree: number
): boolean {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  return normalizedDegree >= signStartDegree && normalizedDegree < signEndDegree;
}

/**
 * Get sign index from degree (0-11)
 */
export function getSignIndexFromDegree(degree: number): number {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  return Math.floor(normalizedDegree / 30);
}

/**
 * Get degree within sign (0-30) from absolute degree
 */
export function getDegreeWithinSign(degree: number): number {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  return normalizedDegree % 30;
}
