/**
 * compositeTransitBridge.ts
 *
 * Bridges the composite midpoint chart (TypeScript) with transit calculations.
 *
 * Priority pipeline:
 *   1. Python Swiss Ephemeris (sub-arc-second precision) via Cloud Function
 *   2. JS approximate ephemeris fallback (J2000 + perturbation corrections)
 *
 * Both paths produce:
 *   TransitEvent[] → StoryBeat[] → SeasonalChapter[]
 *
 * GENESIS AstroProfile - February 2026
 */

// @ts-expect-error — JS module without type declarations
import { calculatePlanetPosition } from '../../utils/transitCalculator';
import type { CompositeChart, CompositePoint } from './compositeMidpoint';
import type { TransitEvent } from './storyEvent';
import { buildStoryTimeline, type StoryBeat } from './storyEvent';
import { buildSeasonalChapters, type SeasonalChapter } from './seasonalChapter';

// Python Cloud Function base URL
const PYTHON_API_URL = import.meta.env?.VITE_PYTHON_FUNCTIONS_URL || '';

// =============================================================================
// TYPES
// =============================================================================

export interface CompositeTransitResult {
  events: TransitEvent[];
  storyBeats: StoryBeat[];
  seasonalChapters: SeasonalChapter[];
}

interface AspectHit {
  type: string;
  orb: number;
  symbol: string;
}

// =============================================================================
// ASPECT DETECTION
// =============================================================================

const ASPECT_DEFS = [
  { type: 'conjunction', exact: 0,   orb: 8, symbol: '\u260C', nature: 'major' },
  { type: 'opposition',  exact: 180, orb: 8, symbol: '\u260D', nature: 'major' },
  { type: 'square',      exact: 90,  orb: 7, symbol: '\u25A1', nature: 'major' },
  { type: 'trine',       exact: 120, orb: 7, symbol: '\u25B3', nature: 'major' },
  { type: 'sextile',     exact: 60,  orb: 5, symbol: '\u2731', nature: 'major' },
] as const;

function detectAspect(transitLon: number, natalLon: number): AspectHit | null {
  const diff = Math.abs(transitLon - natalLon);
  const normalized = diff > 180 ? 360 - diff : diff;

  for (const asp of ASPECT_DEFS) {
    const orbDiff = Math.abs(normalized - asp.exact);
    if (orbDiff <= asp.orb) {
      return { type: asp.type, orb: orbDiff, symbol: asp.symbol };
    }
  }
  return null;
}

// =============================================================================
// CHAMBER IMPACT MAPPING
// =============================================================================

/**
 * Maps which composite point affects which chamber, and by how much.
 * Transit planet weight modifies the intensity.
 *
 * Composite point → primary chamber:
 *   Sun       → core
 *   Moon      → core (emotional identity)
 *   Mercury   → communication
 *   Venus     → passion
 *   Mars      → passion (+ communication secondary)
 *   Jupiter   → growth
 *   Saturn    → growth (structure/commitment)
 *   Uranus    → transformation
 *   Neptune   → transformation (spiritual)
 *   Pluto     → transformation
 */

const POINT_TO_CHAMBER: Record<string, { primary: string; secondary?: string }> = {
  Sun:     { primary: 'core' },
  Moon:    { primary: 'core', secondary: 'passion' },
  Mercury: { primary: 'communication' },
  Venus:   { primary: 'passion' },
  Mars:    { primary: 'passion', secondary: 'communication' },
  Jupiter: { primary: 'growth' },
  Saturn:  { primary: 'growth', secondary: 'transformation' },
  Uranus:  { primary: 'transformation' },
  Neptune: { primary: 'transformation', secondary: 'core' },
  Pluto:   { primary: 'transformation' },
};

/** Transit planet weights (outer = stronger) */
const TRANSIT_WEIGHT: Record<string, number> = {
  Jupiter: 8,
  Saturn:  12,
  Uranus:  14,
  Neptune: 13,
  Pluto:   15,
};

/** Aspect direction: positive (opens) vs challenging (tests) */
function aspectSign(aspectType: string): number {
  switch (aspectType) {
    case 'conjunction': return 1;   // intensifying — generally opens
    case 'trine':      return 1;   // harmonious
    case 'sextile':    return 1;   // opportunity
    case 'square':     return -1;  // friction — tests
    case 'opposition': return -1;  // tension — tests
    default: return 0;
  }
}

/**
 * Build chamber impact deltas from a transit-to-composite aspect.
 */
function buildImpact(
  transitPlanet: string,
  compositePoint: string,
  aspectType: string,
): Partial<Record<string, number>> {
  const mapping = POINT_TO_CHAMBER[compositePoint];
  if (!mapping) return {};

  const weight = TRANSIT_WEIGHT[transitPlanet] || 10;
  const sign = aspectSign(aspectType);
  const delta = sign * weight;

  const impact: Partial<Record<string, number>> = {
    [mapping.primary]: delta,
  };

  if (mapping.secondary) {
    impact[mapping.secondary] = Math.round(delta * 0.4);
  }

  return impact;
}

// =============================================================================
// TRANSIT SCAN ENGINE
// =============================================================================

/** Transiting planets to track (slow movers that matter for relationships) */
const TRANSIT_PLANETS = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as const;

/**
 * Scan 12 months of transits to the composite chart.
 * Samples every 2 weeks (26 samples) to catch all major aspects.
 * De-duplicates: same transit planet + composite point + aspect type = 1 event
 * (uses the tightest orb occurrence).
 */
export function scanCompositeTransits(
  compositeChart: CompositeChart,
  startDate: Date = new Date(),
  months: number = 12,
): TransitEvent[] {
  const points = compositeChart.points;
  if (!points || points.length === 0) return [];

  // Build lookup: point name → longitude
  const pointLookup = new Map<string, number>();
  for (const p of points) {
    pointLookup.set(p.name, p.longitude);
  }

  // Track best (tightest) hit per unique transit
  const bestHits = new Map<string, {
    date: Date;
    transitPlanet: string;
    compositePoint: string;
    aspect: AspectHit;
  }>();

  const totalWeeks = months * 4;
  const sampleInterval = 14; // days between samples

  for (let week = 0; week < totalWeeks; week++) {
    const sampleDate = new Date(startDate);
    sampleDate.setDate(sampleDate.getDate() + week * sampleInterval);

    for (const transitPlanet of TRANSIT_PLANETS) {
      const pos = calculatePlanetPosition(transitPlanet, sampleDate);
      const transitLon: number = pos.absoluteDegree;

      for (const [pointName, pointLon] of pointLookup) {
        const aspect = detectAspect(transitLon, pointLon);
        if (!aspect) continue;

        const key = `${transitPlanet}-${pointName}-${aspect.type}`;
        const existing = bestHits.get(key);

        if (!existing || aspect.orb < existing.aspect.orb) {
          bestHits.set(key, {
            date: sampleDate,
            transitPlanet,
            compositePoint: pointName,
            aspect,
          });
        }
      }
    }
  }

  // Convert best hits to TransitEvent[]
  const events: TransitEvent[] = [];

  for (const hit of bestHits.values()) {
    const { date, transitPlanet, compositePoint, aspect } = hit;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}`;

    const label = `${transitPlanet} ${aspect.type} composite ${compositePoint}`;
    const impact = buildImpact(transitPlanet, compositePoint, aspect.type);

    events.push({ date: dateStr, label, impact });
  }

  // Sort by date
  events.sort((a, b) => a.date.localeCompare(b.date));

  return events;
}

// =============================================================================
// PYTHON SWISS EPHEMERIS API
// =============================================================================

/**
 * Call the Python luna_composite_transits endpoint (Swiss Ephemeris precision).
 * Returns TransitEvent[] or null if the API is unavailable.
 */
async function fetchTransitsPython(
  compositeLongitudes: Record<string, number>,
  months: number = 12,
): Promise<TransitEvent[] | null> {
  if (!PYTHON_API_URL) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch(`${PYTHON_API_URL}/luna_composite_transits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compositeLongitudes, months }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    const raw: unknown[] = data?.events;
    if (!Array.isArray(raw)) return null;

    // Map Python response to frontend TransitEvent shape
    return raw.map((e) => {
      const evt = e as { date: string; label: string; impact?: Record<string, number> };
      return {
        date: evt.date,
        label: evt.label,
        impact: (evt.impact || {}) as Partial<Record<string, number>>,
      };
    });
  } catch {
    // Network error, timeout, or CORS — fall through to JS fallback
    return null;
  }
}

// =============================================================================
// FULL PIPELINE (async — Python first, JS fallback)
// =============================================================================

/**
 * Run the complete transit → story pipeline for a composite chart.
 *
 * Tries the Python Swiss Ephemeris API first for sub-arc-second precision.
 * Falls back to the local JS approximate ephemeris if the API is unavailable.
 */
export async function buildCompositeTransitStory(
  compositeChart: CompositeChart,
  startDate: Date = new Date(),
  months: number = 12,
): Promise<CompositeTransitResult> {
  // Build longitude map for Python API
  const longitudes: Record<string, number> = {};
  for (const p of compositeChart.points) {
    longitudes[p.name] = p.longitude;
  }

  // Try Python Swiss Ephemeris first
  let events = await fetchTransitsPython(longitudes, months);

  // Fall back to local JS approximate ephemeris
  if (!events) {
    events = scanCompositeTransits(compositeChart, startDate, months);
  }

  const storyBeats = buildStoryTimeline(events);
  const seasonalChapters = buildSeasonalChapters(storyBeats);

  return { events, storyBeats, seasonalChapters };
}
