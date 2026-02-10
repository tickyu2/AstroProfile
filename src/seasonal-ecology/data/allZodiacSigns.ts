/**
 * GENESIS - Complete Zodiac Sign Profiles
 * All 12 signs using Seasonal Ecological Psychology Engine
 *
 * Each sign = Season + Element + Modality intersection
 */

import { SignPersonalityProfile } from '../types/seasonalEcology';
import { buildSignProfile } from '../factories/seasonalEcologyFactories';

// ============================================================================
// ALL 12 ZODIAC SIGNS
// ============================================================================

export const zodiacSigns: Record<string, SignPersonalityProfile> = {
  aries: buildSignProfile(
    "Aries",
    "♈",
    [0, 30],
    "spring",
    "fire",
    "cardinal"
  ),

  taurus: buildSignProfile(
    "Taurus",
    "♉",
    [30, 60],
    "spring",
    "earth",
    "fixed"
  ),

  gemini: buildSignProfile(
    "Gemini",
    "♊",
    [60, 90],
    "spring",
    "air",
    "mutable"
  ),

  cancer: buildSignProfile(
    "Cancer",
    "♋",
    [90, 120],
    "summer",
    "water",
    "cardinal"
  ),

  leo: buildSignProfile(
    "Leo",
    "♌",
    [120, 150],
    "summer",
    "fire",
    "fixed"
  ),

  virgo: buildSignProfile(
    "Virgo",
    "♍",
    [150, 180],
    "summer",
    "earth",
    "mutable"
  ),

  libra: buildSignProfile(
    "Libra",
    "♎",
    [180, 210],
    "autumn",
    "air",
    "cardinal"
  ),

  scorpio: buildSignProfile(
    "Scorpio",
    "♏",
    [210, 240],
    "autumn",
    "water",
    "fixed"
  ),

  sagittarius: buildSignProfile(
    "Sagittarius",
    "♐",
    [240, 270],
    "autumn",
    "fire",
    "mutable"
  ),

  capricorn: buildSignProfile(
    "Capricorn",
    "♑",
    [270, 300],
    "winter",
    "earth",
    "cardinal"
  ),

  aquarius: buildSignProfile(
    "Aquarius",
    "♒",
    [300, 330],
    "winter",
    "air",
    "fixed"
  ),

  pisces: buildSignProfile(
    "Pisces",
    "♓",
    [330, 360],
    "winter",
    "water",
    "mutable"
  )
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get sign profile by name (case-insensitive)
 */
export function getSignProfile(signName: string): SignPersonalityProfile | undefined {
  return zodiacSigns[signName.toLowerCase()];
}

/**
 * Get sign by absolute degree (0-360)
 */
export function getSignByDegree(degree: number): SignPersonalityProfile | undefined {
  const normalizedDegree = ((degree % 360) + 360) % 360; // Handle negative degrees

  for (const sign of Object.values(zodiacSigns)) {
    const [start, end] = sign.degreeRange;
    if (normalizedDegree >= start && normalizedDegree < end) {
      return sign;
    }
  }

  return undefined;
}

/**
 * Get all signs for a specific season
 */
export function getSignsBySeason(season: "spring" | "summer" | "autumn" | "winter"): SignPersonalityProfile[] {
  return Object.values(zodiacSigns).filter(
    sign => sign.panel.season.code === season
  );
}

/**
 * Get all signs for a specific element
 */
export function getSignsByElement(element: "fire" | "earth" | "air" | "water"): SignPersonalityProfile[] {
  return Object.values(zodiacSigns).filter(
    sign => sign.panel.element.code === element
  );
}

/**
 * Get all signs for a specific modality
 */
export function getSignsByModality(modality: "cardinal" | "fixed" | "mutable"): SignPersonalityProfile[] {
  return Object.values(zodiacSigns).filter(
    sign => sign.panel.modality.code === modality
  );
}

/**
 * Get all fire signs (Aries, Leo, Sagittarius)
 */
export function getFireSigns(): SignPersonalityProfile[] {
  return getSignsByElement("fire");
}

/**
 * Get all earth signs (Taurus, Virgo, Capricorn)
 */
export function getEarthSigns(): SignPersonalityProfile[] {
  return getSignsByElement("earth");
}

/**
 * Get all air signs (Gemini, Libra, Aquarius)
 */
export function getAirSigns(): SignPersonalityProfile[] {
  return getSignsByElement("air");
}

/**
 * Get all water signs (Cancer, Scorpio, Pisces)
 */
export function getWaterSigns(): SignPersonalityProfile[] {
  return getSignsByElement("water");
}

/**
 * Get all cardinal signs (Aries, Cancer, Libra, Capricorn)
 */
export function getCardinalSigns(): SignPersonalityProfile[] {
  return getSignsByModality("cardinal");
}

/**
 * Get all fixed signs (Taurus, Leo, Scorpio, Aquarius)
 */
export function getFixedSigns(): SignPersonalityProfile[] {
  return getSignsByModality("fixed");
}

/**
 * Get all mutable signs (Gemini, Virgo, Sagittarius, Pisces)
 */
export function getMutableSigns(): SignPersonalityProfile[] {
  return getSignsByModality("mutable");
}

/**
 * Get sign name from degree
 */
export function getSignNameByDegree(degree: number): string | undefined {
  const sign = getSignByDegree(degree);
  return sign?.sign;
}

/**
 * Get all 12 signs as array (in zodiac order)
 */
export function getAllSignsOrdered(): SignPersonalityProfile[] {
  return [
    zodiacSigns.aries,
    zodiacSigns.taurus,
    zodiacSigns.gemini,
    zodiacSigns.cancer,
    zodiacSigns.leo,
    zodiacSigns.virgo,
    zodiacSigns.libra,
    zodiacSigns.scorpio,
    zodiacSigns.sagittarius,
    zodiacSigns.capricorn,
    zodiacSigns.aquarius,
    zodiacSigns.pisces
  ];
}
