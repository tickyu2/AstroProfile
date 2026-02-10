/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * Static Data Definitions
 *
 * Placeholder - extend with additional seasonal data as needed
 */

// Re-export zodiac signs as main data source
export { zodiacSigns, getAllSignsOrdered } from './allZodiacSigns';

// Additional seasonal data constants can be added here
export const SEASON_DATE_RANGES = {
  spring: { start: "MAR 20", end: "JUN 20" },
  summer: { start: "JUN 21", end: "SEP 22" },
  autumn: { start: "SEP 23", end: "DEC 20" },
  winter: { start: "DEC 21", end: "MAR 19" }
} as const;

export const ELEMENT_TRIPLICITIES = {
  fire: ["Aries", "Leo", "Sagittarius"],
  earth: ["Taurus", "Virgo", "Capricorn"],
  air: ["Gemini", "Libra", "Aquarius"],
  water: ["Cancer", "Scorpio", "Pisces"]
} as const;

export const MODALITY_QUADRUPLICITIES = {
  cardinal: ["Aries", "Cancer", "Libra", "Capricorn"],
  fixed: ["Taurus", "Leo", "Scorpio", "Aquarius"],
  mutable: ["Gemini", "Virgo", "Sagittarius", "Pisces"]
} as const;
