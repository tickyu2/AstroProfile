/**
 * ============================================================================
 * WESTERN SIGNAL HELPERS — used by pillarScorerC (and N, M later)
 * ============================================================================
 *
 * TypeScript port of the small static tables and orb-aware calculations that
 * live in functions-python/western_engine/. We only port the bits the
 * happiness scorers need (dignity lookup, longitude-based aspects, combust,
 * house ruler), not the whole engine — the heavy backend computation is still
 * the source of truth for chart calculation, and we read its output via
 * profile.western.
 * ============================================================================
 */

// ============================================================================
// SIGNS — element, modality, polarity
// ============================================================================

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type SignElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type SignModality = 'Cardinal' | 'Fixed' | 'Mutable';
export type SignPolarity = 'Yang' | 'Yin';

export const SIGN_ELEMENT: Record<ZodiacSign, SignElement> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

export const SIGN_MODALITY: Record<ZodiacSign, SignModality> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
};

export const SIGN_POLARITY: Record<ZodiacSign, SignPolarity> = {
  Aries: 'Yang', Gemini: 'Yang', Leo: 'Yang', Libra: 'Yang', Sagittarius: 'Yang', Aquarius: 'Yang',
  Taurus: 'Yin', Cancer: 'Yin', Virgo: 'Yin', Scorpio: 'Yin', Capricorn: 'Yin', Pisces: 'Yin',
};

export function normalizeSign(sign: string | null | undefined): ZodiacSign | null {
  if (!sign) return null;
  const cap = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  return (cap in SIGN_ELEMENT) ? cap as ZodiacSign : null;
}

// ============================================================================
// DIGNITY — port of functions-python/western_engine/constants.py
// ============================================================================

export type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export type DignityState = 'Exalted' | 'Domicile' | 'Detriment' | 'Debilitated' | 'Neutral';

const EXALTATION: Partial<Record<Planet, ZodiacSign>> = {
  Sun: 'Aries', Moon: 'Taurus', Mercury: 'Virgo', Venus: 'Pisces',
  Mars: 'Capricorn', Jupiter: 'Cancer', Saturn: 'Libra',
};

const DEBILITATION: Partial<Record<Planet, ZodiacSign>> = {
  Sun: 'Libra', Moon: 'Scorpio', Mercury: 'Pisces', Venus: 'Virgo',
  Mars: 'Cancer', Jupiter: 'Capricorn', Saturn: 'Aries',
};

const DOMICILE: Record<Planet, ZodiacSign[]> = {
  Sun: ['Leo'], Moon: ['Cancer'],
  Mercury: ['Gemini', 'Virgo'], Venus: ['Taurus', 'Libra'],
  Mars: ['Aries', 'Scorpio'], Jupiter: ['Sagittarius', 'Pisces'],
  Saturn: ['Capricorn', 'Aquarius'], Uranus: ['Aquarius'],
  Neptune: ['Pisces'], Pluto: ['Scorpio'],
};

const DETRIMENT: Record<Planet, ZodiacSign[]> = {
  Sun: ['Aquarius'], Moon: ['Capricorn'],
  Mercury: ['Sagittarius', 'Pisces'], Venus: ['Aries', 'Scorpio'],
  Mars: ['Taurus', 'Libra'], Jupiter: ['Gemini', 'Virgo'],
  Saturn: ['Cancer', 'Leo'], Uranus: ['Leo'],
  Neptune: ['Virgo'], Pluto: ['Taurus'],
};

/**
 * Classical essential dignity. Returns one of 5 states.
 * Same scale used by functions-python/western_engine/house_calculator.py.
 */
export function getDignity(planet: Planet, sign: ZodiacSign): DignityState {
  if (EXALTATION[planet] === sign) return 'Exalted';
  if (DEBILITATION[planet] === sign) return 'Debilitated';
  if (DOMICILE[planet]?.includes(sign)) return 'Domicile';
  if (DETRIMENT[planet]?.includes(sign)) return 'Detriment';
  return 'Neutral';
}

/**
 * Map dignity → 0..1 score. Higher = stronger placement.
 * Calibrated against the Python DIGNITY_MODIFIERS (1.20 / 1.15 / 1.00 / 0.90 / 0.80).
 */
export function dignityScore(state: DignityState): number {
  switch (state) {
    case 'Exalted':     return 1.0;
    case 'Domicile':    return 0.85;
    case 'Neutral':     return 0.55;
    case 'Detriment':   return 0.30;
    case 'Debilitated': return 0.15;
  }
}

/** Convenience: lookup dignity → score in one call. */
export function dignityOf(planet: Planet, sign: ZodiacSign | null | undefined): number {
  if (!sign) return 0.55; // unknown → treat as neutral
  return dignityScore(getDignity(planet, sign));
}

// ============================================================================
// SIGN RULERSHIP (used for house ruler resolution)
// ============================================================================

/**
 * Traditional rulers — Scorpio→Mars (not Pluto), Aquarius→Saturn (not Uranus),
 * Pisces→Jupiter (not Neptune). Matches tuning_lab_constants.SIGN_RULER.
 */
export const SIGN_RULER: Record<ZodiacSign, Planet> = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// ============================================================================
// LONGITUDE-BASED ASPECT DETECTION
// ============================================================================

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx';

/**
 * Hard aspects = tension, friction. Soft aspects = ease, flow.
 * Conjunction is contextually hard or soft depending on planets involved.
 */
export const HARD_ASPECTS: ReadonlyArray<AspectType> = ['square', 'opposition'] as const;
export const SOFT_ASPECTS: ReadonlyArray<AspectType> = ['trine', 'sextile'] as const;

/** Default orbs (degrees). Tighter than the loose pattern detector orbs. */
const ASPECT_ANGLES: Record<AspectType, { angle: number; orb: number }> = {
  conjunction: { angle: 0,   orb: 8 },
  sextile:     { angle: 60,  orb: 5 },
  square:      { angle: 90,  orb: 7 },
  trine:       { angle: 120, orb: 7 },
  quincunx:    { angle: 150, orb: 3 },
  opposition:  { angle: 180, orb: 8 },
};

export interface AspectHit {
  type: AspectType;
  /** Angular separation in degrees, [0, 180]. */
  separation: number;
  /** Deviation from exact aspect angle, in degrees. */
  orb: number;
  /** Tightness: 1 at exact, 0 at the orb edge. Useful as a multiplier. */
  tightness: number;
}

/** Compute angular separation in [0, 180] between two ecliptic longitudes. */
export function angularSeparation(lonA: number, lonB: number): number {
  let diff = Math.abs(lonA - lonB) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Detect the tightest aspect (if any) between two longitudes within standard orbs.
 * Returns null if no aspect within orb.
 */
export function detectAspect(lonA: number, lonB: number): AspectHit | null {
  const sep = angularSeparation(lonA, lonB);
  let best: AspectHit | null = null;

  for (const [name, { angle, orb }] of Object.entries(ASPECT_ANGLES) as [AspectType, typeof ASPECT_ANGLES[AspectType]][]) {
    const dev = Math.abs(sep - angle);
    if (dev <= orb) {
      const tightness = Math.max(0, 1 - dev / orb);
      if (!best || tightness > best.tightness) {
        best = { type: name, separation: sep, orb: dev, tightness };
      }
    }
  }
  return best;
}

/** True if any of the listed aspect types is currently hit by these two longitudes. */
export function hasAspect(lonA: number, lonB: number, types: ReadonlyArray<AspectType>): AspectHit | null {
  const hit = detectAspect(lonA, lonB);
  if (!hit) return null;
  return types.includes(hit.type) ? hit : null;
}

// ============================================================================
// COMBUSTION (Mercury / Venus within Sun's halo)
// ============================================================================

/** Port of tuning_lab_constants combustion orbs. */
export const COMBUST_ORBS = {
  cazimi: 0.28,       // Within 0.28° — paradoxically empowered
  combust: 8.5,       // Within 8.5° — overshadowed
  underBeams: 17.0,   // Within 17° — diminished but functional
} as const;

export type CombustState = 'cazimi' | 'combust' | 'underBeams' | 'free';

export function combustState(planetLon: number, sunLon: number): CombustState {
  const sep = angularSeparation(planetLon, sunLon);
  if (sep <= COMBUST_ORBS.cazimi) return 'cazimi';
  if (sep <= COMBUST_ORBS.combust) return 'combust';
  if (sep <= COMBUST_ORBS.underBeams) return 'underBeams';
  return 'free';
}

/** Numeric score for combust state. Cazimi is paradoxically high. */
export function combustScore(state: CombustState): number {
  switch (state) {
    case 'cazimi':     return 0.95; // empowered
    case 'free':       return 0.85; // normal expression
    case 'underBeams': return 0.55; // diminished
    case 'combust':    return 0.20; // overshadowed
  }
}

// ============================================================================
// HOUSE RULER RESOLUTION
// ============================================================================

export interface HouseCusp {
  house: number;     // 1..12
  longitude: number;
  sign: string;
  degree: number;
}

/**
 * Returns the traditional ruler of the planet sitting on the requested house's
 * cusp. Returns null if the house cusps array doesn't include the requested
 * house or the sign is unrecognized.
 */
export function houseRuler(cusps: HouseCusp[] | null | undefined, house: number): Planet | null {
  if (!cusps) return null;
  const cusp = cusps.find(c => c.house === house);
  if (!cusp) return null;
  const sign = normalizeSign(cusp.sign);
  return sign ? SIGN_RULER[sign] : null;
}
