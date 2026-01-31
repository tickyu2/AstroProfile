/**
 * Synastry Preview Engine
 *
 * Provides seven capabilities:
 *   1. getSynastryPreviewForPlanet() - Extracts all synastry cells involving
 *      a specific planet across all 5 matrices
 *   2. describePlanetAspect() - Generates mythic narrative for a planet-pair aspect
 *   3. generateSynastryReportWithStandouts() - Builds layered narrative report
 *      that references specific high/low cells
 *   4. layerToParagraph() - Converts a LayerNarrative into flowing prose
 *   5. top5Dynamics() - Extracts the 5 most extreme dynamics across all matrices
 *   6. whatSupportsRelationship() - Gathers high-harmony standout descriptions
 *   7. whereTheWorkLives() - Gathers low-harmony friction descriptions
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 * GENESIS AstroProfile - January 2026
 */

import type {
  Planet,
  PlanetaryMatrix,
  PlanetaryCellReport,
  MatrixLayerKey,
  FinalCompatibilityScore,
} from './planetaryMatrices';
import { PLANET_ICONS, PLANET_LABELS, LAYER_NARRATIVES, MATRIX_WEIGHTS } from './planetaryMatrices';
import type { SynastryMatrix, CrossAspectReport } from './narrativeEngine';
import type { AngleKey } from './angles';

// =============================================================================
// TYPES
// =============================================================================

/** A synastry preview entry: one cell from any matrix involving a specific planet. */
export interface SynastryPreviewEntry {
  planet1: string;
  planet2: string;
  harmony: number;
  effort: number;
  angle: AngleKey;
  matrixLabel: string;
  matrixLayer: MatrixLayerKey | 'coreBond';
  /** The insight text from the cell */
  insight: string;
}

/** A standout cell: notably high or low harmony. */
export interface StandoutCell {
  planet1: string;
  planet2: string;
  harmony: number;
  effort: number;
  angle: AngleKey;
  matrixLabel: string;
}

/** Aspect narrative for planet-to-planet description. */
export interface AspectNarrative {
  title: string;
  summary: string;
}

/** Layer narrative with standout-aware details. */
export interface LayerNarrative {
  title: string;
  verdict: string;
  details: string[];
  standoutHighs: string[];
  standoutLows: string[];
}

/** Full synastry report with layered narratives. */
export interface SynastryReport {
  overallSummary: string;
  layers: LayerNarrative[];
}

/** A single dynamic from the Top 5 summary. */
export interface DynamicSummary {
  label: string;
  harmony: number;
  matrix: string;
  direction: 'support' | 'work';
}

// =============================================================================
// 1. SYNASTRY PREVIEW FOR A PLANET
// =============================================================================

/**
 * All 5 matrices bundled for convenience.
 * coreBond uses the SynastryMatrix type (CrossAspectReport[]);
 * others use PlanetaryMatrix (PlanetaryCellReport[]).
 */
export interface AllMatrices {
  coreBond: SynastryMatrix | null;
  chemistry: PlanetaryMatrix | null;
  communication: PlanetaryMatrix | null;
  growth: PlanetaryMatrix | null;
  transformation: PlanetaryMatrix | null;
}

/**
 * Extract all synastry interactions involving a specific planet
 * from all 5 matrices.
 *
 * @param planetName - The planet to search for (e.g. 'Sun', 'Venus')
 * @param matrices - All 5 matrices
 * @returns Array of preview entries sorted by harmony descending
 *
 * @example
 *   const previews = getSynastryPreviewForPlanet('Sun', matrices);
 *   // → [{ planet1: 'Sun', planet2: 'Moon', harmony: 7, ... }, ...]
 */
export function getSynastryPreviewForPlanet(
  planetName: string,
  matrices: AllMatrices,
): SynastryPreviewEntry[] {
  const previews: SynastryPreviewEntry[] = [];

  // Extract from Core Bond (Matrix 1) — uses CrossAspectReport
  if (matrices.coreBond) {
    for (const cell of matrices.coreBond.grid) {
      if (cell.fromLens === planetName || cell.toLens === planetName) {
        previews.push({
          planet1: cell.fromLens,
          planet2: cell.toLens,
          harmony: cell.harmonyScore,
          effort: cell.effortScore,
          angle: cell.angle,
          matrixLabel: 'Core Bond',
          matrixLayer: 'coreBond',
          insight: cell.insight,
        });
      }
    }
  }

  // Extract from Matrices 2-5 — uses PlanetaryCellReport
  const layerMatrices: [MatrixLayerKey, PlanetaryMatrix | null, string][] = [
    ['chemistry', matrices.chemistry, 'Chemistry'],
    ['communication', matrices.communication, 'Communication'],
    ['growth', matrices.growth, 'Growth'],
    ['transformation', matrices.transformation, 'Transformation'],
  ];

  for (const [layer, matrix, label] of layerMatrices) {
    if (!matrix) continue;
    for (const cell of matrix.grid) {
      if (cell.fromPlanet === planetName || cell.toPlanet === planetName) {
        previews.push({
          planet1: cell.fromPlanet,
          planet2: cell.toPlanet,
          harmony: cell.harmonyScore,
          effort: cell.effortScore,
          angle: cell.angle,
          matrixLabel: label,
          matrixLayer: layer,
          insight: cell.insight,
        });
      }
    }
  }

  // Sort by harmony descending (best interactions first)
  previews.sort((a, b) => b.harmony - a.harmony);
  return previews;
}

// =============================================================================
// 2. PLANET-TO-PLANET ASPECT NARRATIVE ENGINE
// =============================================================================

/**
 * Canonical aspect narratives for specific planet-pair + aspect combinations.
 * Lookup key format: "Planet1-Planet2-AngleKey"
 */
const ASPECT_NARRATIVES: Record<string, AspectNarrative> = {
  // Core Bond aspects
  'Sun-Moon-trine': {
    title: 'Sun trine Moon \u2014 Natural Emotional Harmony',
    summary: 'Identity and emotional needs flow easily. It feels natural to support each other\'s moods and life direction.',
  },
  'Sun-Moon-square': {
    title: 'Sun square Moon \u2014 Identity vs Emotion',
    summary: 'There is friction between how one person lives and how the other feels. This aspect creates powerful growth, but it asks for conscious emotional translation.',
  },
  'Sun-Moon-conjunction': {
    title: 'Sun conjunct Moon \u2014 Deep Recognition',
    summary: 'One person\'s core identity merges with the other\'s emotional core. This creates intense familiarity and belonging.',
  },
  'Sun-Moon-opposition': {
    title: 'Sun opposite Moon \u2014 Magnetic Polarity',
    summary: 'You reflect each other\'s inner and outer worlds. The pull is magnetic, but maintaining balance requires awareness.',
  },
  'Sun-Moon-sextile': {
    title: 'Sun sextile Moon \u2014 Gentle Understanding',
    summary: 'A supportive link between identity and emotion. You naturally make space for each other\'s feelings and purposes.',
  },
  'Sun-Rising-conjunction': {
    title: 'Sun conjunct Rising \u2014 Instant Recognition',
    summary: 'One person\'s core self matches how the other presents to the world. You recognize something essential in each other immediately.',
  },
  'Moon-Moon-conjunction': {
    title: 'Moon conjunct Moon \u2014 Emotional Twins',
    summary: 'You feel the same things at the same time. Emotional rhythm is almost perfectly synchronized.',
  },
  'Moon-Moon-square': {
    title: 'Moon square Moon \u2014 Emotional Friction',
    summary: 'Your comfort needs clash. What soothes one may agitate the other, requiring conscious compromise on domestic and emotional patterns.',
  },

  // Chemistry aspects
  'Venus-Mars-conjunction': {
    title: 'Venus conjunct Mars \u2014 Strong Chemistry',
    summary: 'Attraction is vivid and immediate. Desire, affection, and pursuit are tightly linked, creating a magnetic pull.',
  },
  'Venus-Mars-trine': {
    title: 'Venus trine Mars \u2014 Easy Desire',
    summary: 'Attraction flows naturally. What one offers, the other wants \u2014 a graceful dance of pursuit and reception.',
  },
  'Venus-Mars-square': {
    title: 'Venus square Mars \u2014 Passionate Friction',
    summary: 'Strong attraction mixed with frustration. The chemistry is undeniable but the timing or style often clashes.',
  },
  'Venus-Mars-opposition': {
    title: 'Venus opposite Mars \u2014 Magnetic Tension',
    summary: 'You are drawn to each other like magnets, but keeping the attraction sustainable requires conscious navigation of different rhythms.',
  },
  'Venus-Venus-trine': {
    title: 'Venus trine Venus \u2014 Shared Aesthetics',
    summary: 'You naturally enjoy the same things. Comfort, beauty, and affection feel aligned.',
  },
  'Mars-Mars-conjunction': {
    title: 'Mars conjunct Mars \u2014 Matched Drive',
    summary: 'Equal energy and ambition. You motivate each other, but competition can flare if goals diverge.',
  },
  'Mars-Mars-square': {
    title: 'Mars square Mars \u2014 Power Struggle',
    summary: 'Two strong wills butting heads. Channel this energy into shared challenges or it becomes internal conflict.',
  },

  // Communication aspects
  'Mercury-Mercury-conjunction': {
    title: 'Mercury conjunct Mercury \u2014 Mental Sync',
    summary: 'Your thinking styles are nearly identical. Conversations flow effortlessly and you often finish each other\'s sentences.',
  },
  'Mercury-Mercury-square': {
    title: 'Mercury square Mercury \u2014 Mental Friction',
    summary: 'Different thinking styles create frequent misunderstandings. You\'ll need to translate your ideas more carefully.',
  },
  'Mercury-Mars-square': {
    title: 'Mercury square Mars \u2014 Words Trigger Action',
    summary: 'Communication can escalate quickly. One person\'s impatience may cut the other\'s thought process short.',
  },

  // Growth aspects
  'Jupiter-Saturn-conjunction': {
    title: 'Jupiter conjunct Saturn \u2014 Vision Meets Structure',
    summary: 'Dreams get built. One person\'s optimism meets the other\'s discipline, creating realistic ambition.',
  },
  'Jupiter-Saturn-opposition': {
    title: 'Jupiter opposite Saturn \u2014 Expand vs Contract',
    summary: 'A fundamental tension between growth and caution. When balanced, this creates sustainable expansion.',
  },
  'Saturn-Saturn-conjunction': {
    title: 'Saturn conjunct Saturn \u2014 Shared Duty',
    summary: 'You carry the same responsibilities and fears. This creates deep mutual understanding but also amplified heaviness.',
  },
  'Saturn-Sun-opposition': {
    title: 'Saturn opposite Sun \u2014 Karmic Growth Edge',
    summary: 'One person\'s identity is challenged by the other\'s sense of responsibility. This is demanding but deeply transformative.',
  },

  // Transformation aspects
  'Pluto-Moon-trine': {
    title: 'Pluto trine Moon \u2014 Emotional Depth',
    summary: 'Deep psychological bonding. Emotions are felt at an intense, transformative level that creates lasting intimacy.',
  },
  'Pluto-Moon-square': {
    title: 'Pluto square Moon \u2014 Emotional Power Play',
    summary: 'Intensity that can feel controlling or overwhelming. This aspect demands emotional honesty and boundary awareness.',
  },
  'Neptune-Neptune-conjunction': {
    title: 'Neptune conjunct Neptune \u2014 Shared Dreams',
    summary: 'Same generational spiritual wavelength. You share deep, unspoken ideals and creative visions.',
  },
  'Uranus-Pluto-conjunction': {
    title: 'Uranus conjunct Pluto \u2014 Revolutionary Transformation',
    summary: 'Liberation and transformation merge. This connection reshapes both people at a fundamental level.',
  },
};

/**
 * Generic fallback narratives by angle type.
 * Used when no specific planet-pair entry exists.
 */
const GENERIC_ANGLE_NARRATIVES: Record<AngleKey, { verb: string; tone: string }> = {
  conjunction: { verb: 'merges with', tone: 'intensified connection' },
  'semi-sextile': { verb: 'subtly adjusts to', tone: 'quiet adaptation' },
  sextile: { verb: 'supports', tone: 'easy flow' },
  square: { verb: 'challenges', tone: 'productive tension' },
  trine: { verb: 'harmonizes with', tone: 'natural ease' },
  quincunx: { verb: 'must adjust to', tone: 'awkward but growth-oriented' },
  opposition: { verb: 'mirrors', tone: 'magnetic polarity' },
};

/**
 * Generate a narrative description for a planet-to-planet aspect.
 *
 * First checks the canonical lookup table for specific narratives.
 * Falls back to generic angle-based descriptions.
 *
 * @param planet1 - First planet name
 * @param planet2 - Second planet name
 * @param angle - The aspect angle key
 * @returns Narrative with title and summary
 *
 * @example
 *   describePlanetAspect('Sun', 'Moon', 'trine')
 *   // → { title: 'Sun trine Moon — Natural Emotional Harmony', summary: '...' }
 */
export function describePlanetAspect(
  planet1: string,
  planet2: string,
  angle: AngleKey,
): AspectNarrative {
  // Try specific lookup
  const key = `${planet1}-${planet2}-${angle}`;
  if (ASPECT_NARRATIVES[key]) return ASPECT_NARRATIVES[key];

  // Try reverse lookup (Sun-Moon vs Moon-Sun)
  const reverseKey = `${planet2}-${planet1}-${angle}`;
  if (ASPECT_NARRATIVES[reverseKey]) return ASPECT_NARRATIVES[reverseKey];

  // Generic fallback
  const generic = GENERIC_ANGLE_NARRATIVES[angle];
  if (generic) {
    return {
      title: `${planet1} ${angle} ${planet2} \u2014 ${generic.tone.charAt(0).toUpperCase() + generic.tone.slice(1)}`,
      summary: `${planet1} ${generic.verb} ${planet2}. This aspect creates ${generic.tone} between these two functions, shaping how you experience each other.`,
    };
  }

  return {
    title: `${planet1} ${angle} ${planet2}`,
    summary: 'This aspect links these two functions in a meaningful way.',
  };
}

// =============================================================================
// 3. STANDOUT CELL DETECTION
// =============================================================================

/** Harmony thresholds for standout detection */
const HIGH_HARMONY = 8;
const LOW_HARMONY = 4;

/**
 * Extract standout (high and low harmony) cells from a PlanetaryMatrix.
 */
function extractStandoutsFromPlanetary(
  matrix: PlanetaryMatrix,
  label: string,
): { highs: StandoutCell[]; lows: StandoutCell[] } {
  const highs: StandoutCell[] = [];
  const lows: StandoutCell[] = [];

  for (const cell of matrix.grid) {
    const entry: StandoutCell = {
      planet1: cell.fromPlanet,
      planet2: cell.toPlanet,
      harmony: cell.harmonyScore,
      effort: cell.effortScore,
      angle: cell.angle,
      matrixLabel: label,
    };

    if (cell.harmonyScore >= HIGH_HARMONY) highs.push(entry);
    if (cell.harmonyScore <= LOW_HARMONY) lows.push(entry);
  }

  return { highs, lows };
}

/**
 * Extract standout cells from the Core Bond matrix (SynastryMatrix).
 */
function extractStandoutsFromCoreBond(
  matrix: SynastryMatrix,
  label: string,
): { highs: StandoutCell[]; lows: StandoutCell[] } {
  const highs: StandoutCell[] = [];
  const lows: StandoutCell[] = [];

  for (const cell of matrix.grid) {
    const entry: StandoutCell = {
      planet1: cell.fromLens,
      planet2: cell.toLens,
      harmony: cell.harmonyScore,
      effort: cell.effortScore,
      angle: cell.angle,
      matrixLabel: label,
    };

    if (cell.harmonyScore >= HIGH_HARMONY) highs.push(entry);
    if (cell.harmonyScore <= LOW_HARMONY) lows.push(entry);
  }

  return { highs, lows };
}

/**
 * Scan all 5 matrices for standout cells.
 */
export function scanAllMatrices(matrices: AllMatrices): Record<string, { highs: StandoutCell[]; lows: StandoutCell[] }> {
  const result: Record<string, { highs: StandoutCell[]; lows: StandoutCell[] }> = {};

  if (matrices.coreBond) {
    result.coreBond = extractStandoutsFromCoreBond(matrices.coreBond, 'Core Bond');
  }
  if (matrices.chemistry) {
    result.chemistry = extractStandoutsFromPlanetary(matrices.chemistry, 'Chemistry');
  }
  if (matrices.communication) {
    result.communication = extractStandoutsFromPlanetary(matrices.communication, 'Communication');
  }
  if (matrices.growth) {
    result.growth = extractStandoutsFromPlanetary(matrices.growth, 'Growth');
  }
  if (matrices.transformation) {
    result.transformation = extractStandoutsFromPlanetary(matrices.transformation, 'Transformation');
  }

  return result;
}

// =============================================================================
// 4. STANDOUT-AWARE NARRATIVE REPORT
// =============================================================================

/**
 * Turn a standout cell into a narrative line.
 * High-harmony cells are described as "anchors"; low-harmony as "friction points".
 */
function lineFromStandout(cell: StandoutCell): string {
  const narrative = describePlanetAspect(cell.planet1, cell.planet2, cell.angle);
  const angleLabel = cell.angle.replace('-', ' ');

  if (cell.harmony >= HIGH_HARMONY) {
    return `${cell.planet1}\u2013${cell.planet2} ${angleLabel} (${cell.harmony} harmony) anchors the ${cell.matrixLabel.toLowerCase()} layer \u2014 ${narrative.summary}`;
  }

  return `${cell.planet1}\u2013${cell.planet2} ${angleLabel} (${cell.harmony} harmony) is a key friction point in the ${cell.matrixLabel.toLowerCase()} layer \u2014 ${narrative.summary}`;
}

/**
 * Build a base layer narrative from its score.
 */
function buildLayerVerdict(
  title: string,
  score: number | null,
  layer: MatrixLayerKey | 'coreBond',
): LayerNarrative {
  const baseNarrative = LAYER_NARRATIVES[layer as MatrixLayerKey];
  const baseDetail = baseNarrative ? baseNarrative.narrative : '';

  if (score == null) {
    return {
      title,
      verdict: `${title} score unavailable.`,
      details: [baseDetail].filter(Boolean),
      standoutHighs: [],
      standoutLows: [],
    };
  }

  let verdict: string;
  if (score >= 75) {
    verdict = `Strong ${title.toLowerCase()} foundation.`;
  } else if (score >= 60) {
    verdict = `Good ${title.toLowerCase()} with natural compatibility.`;
  } else if (score >= 50) {
    verdict = `Mixed ${title.toLowerCase()} with both ease and work.`;
  } else if (score >= 35) {
    verdict = `${title} requires conscious effort.`;
  } else {
    verdict = `Challenging ${title.toLowerCase()} \u2014 significant growth potential.`;
  }

  return {
    title,
    verdict,
    details: [baseDetail].filter(Boolean),
    standoutHighs: [],
    standoutLows: [],
  };
}

/**
 * Generate a full synastry report with standout cell references woven into
 * each layer's narrative.
 *
 * The report scans all 5 matrices for standout cells (harmony >= 8 or <= 4),
 * generates narrative lines for each, and embeds them in the appropriate layer.
 *
 * @param scores - FinalCompatibilityScore from computeFinalCompatibility()
 * @param matrices - All 5 matrices
 * @returns SynastryReport with layered narratives and embedded standout references
 *
 * @example
 *   const report = generateSynastryReportWithStandouts(scores, matrices);
 *   report.layers[0].standoutHighs
 *   // → ["Sun–Moon trine (9 harmony) anchors the core bond — ..."]
 */
export function generateSynastryReportWithStandouts(
  scores: FinalCompatibilityScore,
  matrices: AllMatrices,
): SynastryReport {
  const { finalHarmony, finalPercent, layerScores } = scores;

  // Overall summary
  const overallSummary = finalHarmony == null
    ? 'Insufficient data to compute an overall harmony score.'
    : `Overall harmony is ${finalHarmony.toFixed(1)} out of 10 (${finalPercent}%).`;

  // Build base layers
  const layerScoreMap: Record<string, number | null> = {};
  for (const ls of layerScores) {
    layerScoreMap[ls.layer] = ls.score;
  }

  const layers: LayerNarrative[] = [
    buildLayerVerdict('Core Bond', layerScoreMap['coreBond'] ?? null, 'coreBond'),
    buildLayerVerdict('Chemistry & Desire', layerScoreMap['chemistry'] ?? null, 'chemistry'),
    buildLayerVerdict('Communication', layerScoreMap['communication'] ?? null, 'communication'),
    buildLayerVerdict('Growth & Commitment', layerScoreMap['growth'] ?? null, 'growth'),
    buildLayerVerdict('Transformation', layerScoreMap['transformation'] ?? null, 'transformation'),
  ];

  // Scan for standouts
  const standouts = scanAllMatrices(matrices);

  // Map layer indices to standout keys
  const layerKeys = ['coreBond', 'chemistry', 'communication', 'growth', 'transformation'];

  for (let i = 0; i < layerKeys.length; i++) {
    const key = layerKeys[i];
    const scan = standouts[key];
    if (!scan) continue;

    // Add top 2 highs and top 2 lows
    const topHighs = scan.highs
      .sort((a, b) => b.harmony - a.harmony)
      .slice(0, 2);
    const topLows = scan.lows
      .sort((a, b) => a.harmony - b.harmony)
      .slice(0, 2);

    layers[i].standoutHighs = topHighs.map(lineFromStandout);
    layers[i].standoutLows = topLows.map(lineFromStandout);
  }

  return { overallSummary, layers };
}

// =============================================================================
// 5. NATURAL-LANGUAGE PARAGRAPH GENERATOR
// =============================================================================

/**
 * Convert a LayerNarrative into a flowing prose paragraph.
 * Combines the verdict, detail lines, and standout references into
 * 1–2 readable sentences suitable for PDF or plain-text output.
 *
 * @param layer - A LayerNarrative from generateSynastryReportWithStandouts()
 * @returns A paragraph string
 *
 * @example
 *   const para = layerToParagraph(report.layers[0]);
 *   // → "Strong core bond foundation. Identity and emotion flow with..."
 */
export function layerToParagraph(layer: LayerNarrative): string {
  const intro = layer.verdict;

  const detailSentence = layer.details.length
    ? layer.details[0]
    : '';

  const standoutSentences = layer.details
    .slice(1)
    .join(' ');

  const highSentences = layer.standoutHighs.length
    ? layer.standoutHighs.join(' ')
    : '';

  const lowSentences = layer.standoutLows.length
    ? layer.standoutLows.join(' ')
    : '';

  return [intro, detailSentence, standoutSentences, highSentences, lowSentences]
    .filter(Boolean)
    .join(' ');
}

// =============================================================================
// 6. TOP 5 DYNAMICS
// =============================================================================

/** Collect all standouts from a scan bucket into a flat array. */
function collectDynamics(
  bucket: { highs: StandoutCell[]; lows: StandoutCell[] } | undefined,
): DynamicSummary[] {
  if (!bucket) return [];
  const result: DynamicSummary[] = [];

  for (const c of bucket.highs) {
    const angleLabel = c.angle.replace('-', ' ');
    result.push({
      label: `${c.planet1}\u2013${c.planet2} ${angleLabel}`,
      harmony: c.harmony,
      matrix: c.matrixLabel,
      direction: 'support',
    });
  }

  for (const c of bucket.lows) {
    const angleLabel = c.angle.replace('-', ' ');
    result.push({
      label: `${c.planet1}\u2013${c.planet2} ${angleLabel}`,
      harmony: c.harmony,
      matrix: c.matrixLabel,
      direction: 'work',
    });
  }

  return result;
}

/**
 * Extract the top 5 most extreme dynamics across all matrices.
 * Combines both supportive (high harmony) and challenging (low harmony) cells,
 * ranked by how extreme they are.
 *
 * @param matrices - All 5 matrices
 * @returns Array of up to 5 DynamicSummary entries
 *
 * @example
 *   const dynamics = top5Dynamics(matrices);
 *   // → [{ label: "Sun–Moon trine", harmony: 9, matrix: "Core Bond", direction: "support" }, ...]
 */
export function top5Dynamics(matrices: AllMatrices): DynamicSummary[] {
  const scan = scanAllMatrices(matrices);

  const all: DynamicSummary[] = [];
  for (const key of Object.keys(scan)) {
    all.push(...collectDynamics(scan[key]));
  }

  // Sort by extremeness: high supports rank by harmony desc, work areas rank by (10-harmony) desc
  all.sort((a, b) => {
    const aScore = a.direction === 'support' ? a.harmony : 10 - a.harmony;
    const bScore = b.direction === 'support' ? b.harmony : 10 - b.harmony;
    return bScore - aScore;
  });

  return all.slice(0, 5);
}

// =============================================================================
// 7. WHAT SUPPORTS / WHERE THE WORK LIVES
// =============================================================================

/**
 * Gather high-harmony standout descriptions: what anchors the relationship.
 *
 * @param matrices - All 5 matrices
 * @returns Array of narrative lines describing supportive dynamics (up to 5)
 */
export function whatSupportsRelationship(matrices: AllMatrices): string[] {
  const scan = scanAllMatrices(matrices);
  const allHighs: StandoutCell[] = [];

  for (const key of Object.keys(scan)) {
    if (scan[key]) allHighs.push(...scan[key].highs);
  }

  if (!allHighs.length) {
    return ['Support exists in subtler ways, even if no single aspect dominates the chart.'];
  }

  allHighs.sort((a, b) => b.harmony - a.harmony);

  return allHighs.slice(0, 5).map((c) => {
    const { title, summary } = describePlanetAspect(c.planet1, c.planet2, c.angle);
    return `${title} (${c.harmony} harmony) \u2014 ${summary}`;
  });
}

/**
 * Gather low-harmony standout descriptions: where conscious effort is needed.
 *
 * @param matrices - All 5 matrices
 * @returns Array of narrative lines describing challenging dynamics (up to 5)
 */
export function whereTheWorkLives(matrices: AllMatrices): string[] {
  const scan = scanAllMatrices(matrices);
  const allLows: StandoutCell[] = [];

  for (const key of Object.keys(scan)) {
    if (scan[key]) allLows.push(...scan[key].lows);
  }

  if (!allLows.length) {
    return ['No major friction patterns dominate; work will likely be more situational than structural.'];
  }

  allLows.sort((a, b) => a.harmony - b.harmony);

  return allLows.slice(0, 5).map((c) => {
    const { title, summary } = describePlanetAspect(c.planet1, c.planet2, c.angle);
    return `${title} (${c.harmony} harmony) \u2014 ${summary}`;
  });
}
