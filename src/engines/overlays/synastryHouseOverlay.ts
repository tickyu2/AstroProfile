/**
 * synastryHouseOverlay.ts
 *
 * Synastry House Overlays — "Person A's planets placed in Person B's houses"
 *
 * Takes planet longitudes from one chart and house cusps from another,
 * calculates which house each planet falls in, and generates interpretations.
 *
 * Reuses HOUSE_THEMES from houseOverlay.ts (no duplication).
 *
 * GENESIS AstroProfile - February 2026
 */

import { HOUSE_THEMES, ANGULAR_HOUSES, SUCCEDENT_HOUSES, CADENT_HOUSES } from './houseOverlay';
import type { HouseMode } from './houseOverlay';

// =============================================================================
// TYPES
// =============================================================================

export interface HouseCusp {
  house: number;       // 1-12
  longitude: number;   // 0-359.99
  sign: string;
  degree: number;
}

export interface PlanetLongitudes {
  [planetName: string]: number;  // e.g. { Sun: 142.5, Moon: 87.3, ... }
}

export interface SynastryHouseOverlayEntry {
  planet: string;
  planetIcon: string;
  synastryHouse: number;
  houseName: string;
  houseTheme: string;
  houseKeywords: string[];
  houseMode: HouseMode;
  interpretation: string;
  weight: number;
}

export interface SynastryHouseOverlayResult {
  entries: SynastryHouseOverlayEntry[];
  angularCount: number;
  succedentCount: number;
  cadentCount: number;
  dominantMode: HouseMode;
  romanticScore: number;    // 0-1
  overallNarrative: string;
  highlights: string[];
}

export interface SynastryHouseOverlayPairResult {
  aInB: SynastryHouseOverlayResult;
  bInA: SynastryHouseOverlayResult;
  combinedScore: number;     // 0-100
  combinedNarrative: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PLANET_ORDER = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

const PLANET_ICONS: Record<string, string> = {
  Sun: '\u2609', Moon: '\u263D', Mercury: '\u263F', Venus: '\u2640',
  Mars: '\u2642', Jupiter: '\u2643', Saturn: '\u2644',
  Uranus: '\u2645', Neptune: '\u2646', Pluto: '\u2647',
};

const PLANET_WEIGHTS: Record<string, number> = {
  Sun: 1.5, Moon: 1.5, Mercury: 1.0, Venus: 1.2,
  Mars: 1.2, Jupiter: 1.1, Saturn: 1.1,
  Uranus: 0.8, Neptune: 0.8, Pluto: 0.8,
};

/** Planets that carry romantic weight in certain houses */
const ROMANTIC_PLANETS = new Set(['Sun', 'Moon', 'Venus', 'Mars']);
/** Houses that amplify romantic significance */
const ROMANTIC_HOUSES = new Set([5, 7, 8]);
/** Houses that provide supportive foundation */
const SUPPORT_HOUSES = new Set([4, 9, 11]);

// =============================================================================
// CORE: getHouseForLongitude
// =============================================================================

/**
 * Determine which house a planet falls in given 12 house cusps.
 * Handles 360-degree wrap-around.
 * Port of Python _assign_planet_to_house.
 */
export function getHouseForLongitude(
  planetLongitude: number,
  houseCusps: HouseCusp[],
): number {
  if (!houseCusps || houseCusps.length < 12) return 1;

  const sorted = [...houseCusps].sort((a, b) => a.house - b.house);
  const lon = ((planetLongitude % 360) + 360) % 360;

  for (let i = 0; i < 12; i++) {
    const currentCusp = sorted[i].longitude;
    const nextCusp = sorted[(i + 1) % 12].longitude;

    if (currentCusp <= nextCusp) {
      if (lon >= currentCusp && lon < nextCusp) {
        return sorted[i].house;
      }
    } else {
      // 360-degree wrap
      if (lon >= currentCusp || lon < nextCusp) {
        return sorted[i].house;
      }
    }
  }

  return 1; // fallback
}

// =============================================================================
// HOUSE MODE CLASSIFICATION
// =============================================================================

function getHouseMode(house: number): HouseMode {
  if (ANGULAR_HOUSES.includes(house)) return 'Angular';
  if (SUCCEDENT_HOUSES.includes(house)) return 'Succedent';
  if (CADENT_HOUSES.includes(house)) return 'Cadent';
  return 'Balanced';
}

function getModeColor(mode: HouseMode): string {
  if (mode === 'Angular') return '#60a5fa';
  if (mode === 'Succedent') return '#22c55e';
  if (mode === 'Cadent') return '#a855f7';
  return '#9ca3af';
}

// =============================================================================
// SYNASTRY INTERPRETATIONS
// =============================================================================

/** Key planet-house synastry interpretations (inner planets x important houses) */
const SYNASTRY_INTERPRETATIONS: Record<string, string> = {
  // Sun
  'Sun-1': 'Your Sun illuminates their sense of self. They feel seen and validated in your presence, and you naturally enhance their confidence.',
  'Sun-4': 'Your Sun warms their home and roots. You feel like family to them, bringing light to their private world.',
  'Sun-5': 'Your Sun ignites their creativity and romance. This is a classic placement for attraction, playfulness, and shared joy.',
  'Sun-7': 'Your Sun lands in their house of partnership. They see you as a natural partner, someone who complements and completes them.',
  'Sun-8': 'Your Sun penetrates their deepest zone. This creates intense intimacy and transformative connection, though vulnerability is required.',
  'Sun-10': 'Your Sun elevates their public image. They admire your presence and you inspire their ambitions and career direction.',
  // Moon
  'Moon-1': 'Your Moon touches their identity. They feel emotionally comfortable with you from the start, as if you understand their core self.',
  'Moon-4': 'Your Moon nestles into their foundation. This creates deep emotional security and a feeling of coming home together.',
  'Moon-5': 'Your Moon stirs their romantic and creative side. Emotional expression flows easily, nurturing playful affection between you.',
  'Moon-7': 'Your Moon in their partnership house creates emotional bonding. They feel you understand their relationship needs intuitively.',
  'Moon-8': 'Your Moon enters their transformative depths. Emotional intimacy runs deep here, with powerful vulnerability and healing potential.',
  'Moon-12': 'Your Moon touches their unconscious. There is a spiritual, karmic quality to the emotional bond, often felt but hard to articulate.',
  // Venus
  'Venus-1': 'Your Venus graces their self-image. They feel attractive and valued in your presence, drawn to your natural charm.',
  'Venus-5': 'Your Venus in their house of romance is a classic love placement. Pleasure, affection, and creative joy flow effortlessly.',
  'Venus-7': 'Your Venus in their partnership house signals strong romantic compatibility. Love, harmony, and mutual appreciation thrive here.',
  'Venus-8': 'Your Venus touches their intimate zone. Attraction runs deep with magnetic, almost obsessive undertones and shared vulnerability.',
  'Venus-11': 'Your Venus lights up their social world. Friendship and shared ideals form the foundation, blending love with community.',
  // Mars
  'Mars-1': 'Your Mars energizes their identity. They feel motivated and sometimes challenged by your drive, creating dynamic interaction.',
  'Mars-5': 'Your Mars fires up their romance and creativity. Physical attraction is strong, with passionate and spirited connection.',
  'Mars-7': 'Your Mars in their partnership house creates passionate dynamics. The chemistry is undeniable, though conflicts may need navigation.',
  'Mars-8': 'Your Mars penetrates their transformative house. This is one of the most intensely sexual and psychologically charged placements.',
  'Mars-10': 'Your Mars drives their ambitions. You push them toward achievement and they find your determination inspiring.',
  // Jupiter
  'Jupiter-1': 'Your Jupiter expands their self-confidence. You make them feel lucky, optimistic, and capable of more than they imagined.',
  'Jupiter-7': 'Your Jupiter blesses their partnership house. The relationship feels expansive, generous, and growth-oriented.',
  'Jupiter-9': 'Your Jupiter in their house of philosophy creates shared adventures. You expand each other\'s worldview and love exploring together.',
  // Saturn
  'Saturn-7': 'Your Saturn in their partnership house brings structure and commitment. The bond feels serious and lasting, with lessons to learn together.',
  'Saturn-10': 'Your Saturn supports their career ambitions. You provide discipline and structure that helps them achieve their goals.',
};

/**
 * Generate synastry interpretation for a planet in a specific house.
 * Uses hand-written interpretations for key combos, generic template for others.
 */
function buildSynastryInterpretation(planet: string, house: number): string {
  const key = `${planet}-${house}`;
  const specific = SYNASTRY_INTERPRETATIONS[key];
  if (specific) return specific;

  // Generic fallback using HOUSE_THEMES
  const houseInfo = HOUSE_THEMES[house];
  if (!houseInfo) return `Your ${planet} activates their ${house}th house.`;

  const PLANET_NATURES: Record<string, string> = {
    Sun: 'vitality and identity',
    Moon: 'emotional depth and nurturing',
    Mercury: 'intellectual curiosity and communication',
    Venus: 'affection, beauty, and harmony',
    Mars: 'drive, ambition, and assertiveness',
    Jupiter: 'expansion, optimism, and generosity',
    Saturn: 'structure, discipline, and maturity',
    Uranus: 'innovation, independence, and surprise',
    Neptune: 'imagination, spirituality, and compassion',
    Pluto: 'transformation, intensity, and deep change',
  };

  const nature = PLANET_NATURES[planet] || 'energy';
  const kw = houseInfo.keywords.slice(0, 2).join(' and ');
  return `Your ${planet} brings ${nature} to their ${houseInfo.name.toLowerCase()}, activating themes of ${kw}.`;
}

// =============================================================================
// COMPUTE ONE DIRECTION
// =============================================================================

export function computeSynastryHouseOverlay(
  planetLongitudes: PlanetLongitudes,
  houseCusps: HouseCusp[],
): SynastryHouseOverlayResult {
  const entries: SynastryHouseOverlayEntry[] = [];

  let angularCount = 0;
  let succedentCount = 0;
  let cadentCount = 0;
  let romanticScore = 0;
  let totalWeight = 0;

  // Process planets in standard order
  for (const planet of PLANET_ORDER) {
    const lon = planetLongitudes[planet];
    if (lon == null) continue;

    const house = getHouseForLongitude(lon, houseCusps);
    const houseInfo = HOUSE_THEMES[house];
    const mode = getHouseMode(house);
    const weight = PLANET_WEIGHTS[planet] || 1.0;

    if (mode === 'Angular') angularCount++;
    else if (mode === 'Succedent') succedentCount++;
    else cadentCount++;

    // Romantic score: inner planets in romantic houses get bonus
    if (ROMANTIC_PLANETS.has(planet) && ROMANTIC_HOUSES.has(house)) {
      romanticScore += weight * 0.15;
    } else if (ROMANTIC_PLANETS.has(planet) && SUPPORT_HOUSES.has(house)) {
      romanticScore += weight * 0.08;
    }
    totalWeight += weight;

    entries.push({
      planet,
      planetIcon: PLANET_ICONS[planet] || planet[0],
      synastryHouse: house,
      houseName: houseInfo?.name || `House ${house}`,
      houseTheme: houseInfo?.theme || '',
      houseKeywords: houseInfo?.keywords || [],
      houseMode: mode,
      interpretation: buildSynastryInterpretation(planet, house),
      weight,
    });
  }

  // Normalize romantic score to 0-1
  if (totalWeight > 0) romanticScore = Math.min(1, romanticScore / (totalWeight * 0.15));

  // Determine dominant mode
  const total = angularCount + succedentCount + cadentCount;
  let dominantMode: HouseMode = 'Balanced';
  if (total > 0) {
    const angPct = angularCount / total;
    const sucPct = succedentCount / total;
    const cadPct = cadentCount / total;
    if (angPct >= 0.45) dominantMode = 'Angular';
    else if (sucPct >= 0.45) dominantMode = 'Succedent';
    else if (cadPct >= 0.45) dominantMode = 'Cadent';
  }

  // Build highlights (top 3 notable placements)
  const highlights: string[] = [];
  for (const e of entries) {
    if (ROMANTIC_PLANETS.has(e.planet) && (ROMANTIC_HOUSES.has(e.synastryHouse) || e.synastryHouse === 1)) {
      highlights.push(`${e.planet} in ${ordinal(e.synastryHouse)} house (${e.houseName})`);
    }
  }

  // Build narrative
  const overallNarrative = buildOneDirectionNarrative(entries, dominantMode, romanticScore);

  return {
    entries,
    angularCount,
    succedentCount,
    cadentCount,
    dominantMode,
    romanticScore,
    overallNarrative,
    highlights: highlights.slice(0, 4),
  };
}

// =============================================================================
// COMPUTE PAIR (BOTH DIRECTIONS)
// =============================================================================

export function computeSynastryHouseOverlayPair(
  planetsA: PlanetLongitudes,
  houseCuspsA: HouseCusp[],
  planetsB: PlanetLongitudes,
  houseCuspsB: HouseCusp[],
): SynastryHouseOverlayPairResult {
  const aInB = computeSynastryHouseOverlay(planetsA, houseCuspsB);
  const bInA = computeSynastryHouseOverlay(planetsB, houseCuspsA);

  const combinedScore = Math.round(
    ((aInB.romanticScore + bInA.romanticScore) / 2) * 100,
  );

  const combinedNarrative = buildCombinedNarrative(aInB, bInA, combinedScore);

  return { aInB, bInA, combinedScore, combinedNarrative };
}

// =============================================================================
// NARRATIVE BUILDERS
// =============================================================================

function buildOneDirectionNarrative(
  entries: SynastryHouseOverlayEntry[],
  dominantMode: HouseMode,
  romanticScore: number,
): string {
  const modeDescriptions: Record<HouseMode, string> = {
    Angular: 'focused on visibility, action, and pivotal life areas',
    Succedent: 'centered on stability, resources, and deep values',
    Cadent: 'oriented toward learning, growth, and mental connection',
    Balanced: 'spread evenly across different life areas',
  };

  const intro = `The planetary placements are ${modeDescriptions[dominantMode]}.`;

  // Find the most significant placement
  const romanticEntries = entries.filter(
    e => ROMANTIC_PLANETS.has(e.planet) && (ROMANTIC_HOUSES.has(e.synastryHouse) || e.synastryHouse === 1),
  );

  let highlight = '';
  if (romanticEntries.length > 0) {
    const top = romanticEntries[0];
    highlight = ` Notably, ${top.planet} lands in the ${ordinal(top.synastryHouse)} house (${top.houseName}), which carries special significance.`;
  }

  const intensity = romanticScore >= 0.6 ? 'strong' : romanticScore >= 0.3 ? 'moderate' : 'gentle';
  const closing = ` Overall, the house activation creates a ${intensity} resonance.`;

  return intro + highlight + closing;
}

function buildCombinedNarrative(
  aInB: SynastryHouseOverlayResult,
  bInA: SynastryHouseOverlayResult,
  combinedScore: number,
): string {
  const balance = Math.abs(aInB.romanticScore - bInA.romanticScore);
  const symmetryNote = balance < 0.15
    ? 'The house activations are fairly symmetrical, suggesting mutual resonance.'
    : balance < 0.35
    ? 'There is some asymmetry in how you activate each other\'s houses, creating complementary dynamics.'
    : 'The overlay is notably asymmetric, meaning one person\'s planets activate the other\'s life areas more intensely.';

  const scoreNote = combinedScore >= 70
    ? 'The combined house overlay score indicates strong life-area activation between you.'
    : combinedScore >= 45
    ? 'The combined house overlay shows moderate mutual activation with areas of particular resonance.'
    : 'The house overlay is relatively gentle, suggesting the connection expresses through subtler channels.';

  return `${scoreNote} ${symmetryNote}`;
}

// =============================================================================
// HELPERS
// =============================================================================

function ordinal(n: number): string {
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || 'th');
}

// Re-export getModeColor for UI usage
export { getModeColor };
