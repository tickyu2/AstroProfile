/**
 * Planetary Matrices Engine - Beyond Sun/Moon/Rising
 *
 * Extends the Synastry Matrix (3×3 Core Bond) with 4 additional
 * planet-pair matrices for a complete psychological portrait:
 *
 *   Matrix 2: Chemistry & Desire (Venus/Mars)       — 2×2
 *   Matrix 3: Communication (Mercury/Mars)            — 2×2
 *   Matrix 4: Growth & Commitment (Jupiter/Saturn)  — 2×2
 *   Matrix 5: Transformation (Uranus/Neptune/Pluto) — 3×3
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 * GENESIS AstroProfile - January 2026
 */

import { SIGN_LESSONS, type SignKey, type Element, type Modality, type Season } from './tropicalMap';
import { getAngleBetweenSigns, type AngleKey } from './angles';
import {
  calculateEffortWithSteps,
  calculateBlendedEffortWithSteps,
  type EffortStep,
  type SynastryMatrix,
} from './narrativeEngine';
import type { SignBlend } from './cusp/phiCurve';
import {
  blendFromCuspResult,
  getPureSignMetadata,
  type BlendedSignMetadata,
} from './cusp/signVectors';
import {
  resolveSignContext,
  type SignContext,
  type Hemisphere,
} from './cusp/resolveSignContext';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type Planet =
  | 'Sun' | 'Moon' | 'Rising'
  | 'Venus' | 'Mars' | 'Mercury'
  | 'Jupiter' | 'Saturn'
  | 'Uranus' | 'Neptune' | 'Pluto';

export type MatrixLayerKey =
  | 'coreBond'         // Matrix 1 (existing SynastryGrid)
  | 'chemistry'        // Matrix 2
  | 'communication'    // Matrix 3
  | 'growth'           // Matrix 4
  | 'transformation';  // Matrix 5

export interface PlanetPosition {
  planet: Planet;
  sign: SignKey;
}

export interface PlanetaryCellReport {
  pairKey: string;            // e.g. "Venus-Mars"
  fromPlanet: Planet;
  toPlanet: Planet;
  fromSign: SignKey;
  toSign: SignKey;
  angle: AngleKey;
  effortScore: number;        // 1-10
  harmonyScore: number;       // 1-10 (11 - effort)
  insight: string;            // Key one-liner
  weight: number;             // Cell weight within this matrix
  steps: EffortStep[];        // Full "show your work" breakdown
}

export interface PlanetaryMatrix {
  layer: MatrixLayerKey;
  title: string;
  subtitle: string;
  rows: Planet[];             // Row planets (Person A)
  cols: Planet[];             // Column planets (Person B)
  grid: PlanetaryCellReport[];
  weightedScore: number;      // 1-100
  keyInsights: string[];
}

// =============================================================================
// MATRIX 2: CHEMISTRY & DESIRE (Venus/Mars) — 2×2
// =============================================================================

const CHEMISTRY_PLANET_WEIGHTS: Record<string, number> = {
  'Venus-Venus': 1.2,   // Shared love language
  'Venus-Mars':  1.4,   // Classic attraction axis
  'Mars-Venus':  1.4,   // Reverse attraction
  'Mars-Mars':   1.1,   // Drive alignment / conflict
};

const CHEMISTRY_CELL_WEIGHTS: Record<string, number> = {
  'Venus-Venus': 0.20,
  'Venus-Mars':  0.30,
  'Mars-Venus':  0.30,
  'Mars-Mars':   0.20,
};

const CHEMISTRY_INSIGHTS: Record<string, { harmony: string; challenge: string; neutral: string }> = {
  'Venus-Venus': {
    harmony: 'Your love languages harmonize — affection flows naturally',
    challenge: 'Different comfort needs may create emotional disconnects',
    neutral: 'Your aesthetic and comfort styles require gentle negotiation',
  },
  'Venus-Mars': {
    harmony: 'Classic magnetic pull — your softness activates their drive',
    challenge: 'Your desire for harmony clashes with their assertiveness',
    neutral: 'Attraction exists but requires conscious attunement',
  },
  'Mars-Venus': {
    harmony: 'Your initiative energizes their receptivity — sparks fly',
    challenge: 'Your forcefulness may overwhelm their gentle nature',
    neutral: 'Your drive meets their values — negotiate pace together',
  },
  'Mars-Mars': {
    harmony: 'Matched energy levels — you motivate each other naturally',
    challenge: 'Two strong wills compete — channel into shared goals',
    neutral: 'Your drive styles differ — find complementary outlets',
  },
};

// =============================================================================
// MATRIX 3: COMMUNICATION (Mercury/Mars) — 2×2
// =============================================================================

const COMMUNICATION_PLANET_WEIGHTS: Record<string, number> = {
  'Mercury-Mercury': 1.3,  // Mind-to-mind clarity
  'Mercury-Mars':    1.1,  // Thought → action bridge
  'Mars-Mercury':    1.1,  // Action → thought bridge (reverse)
  'Mars-Mars':       1.0,  // Drive alignment / conflict style
};

const COMMUNICATION_CELL_WEIGHTS: Record<string, number> = {
  'Mercury-Mercury': 0.30,  // Core communication compatibility
  'Mercury-Mars':    0.20,  // How your words land on their drive
  'Mars-Mercury':    0.20,  // How your assertiveness meets their mind
  'Mars-Mars':       0.30,  // Conflict style alignment
};

const COMMUNICATION_INSIGHTS: Record<string, { harmony: string; challenge: string; neutral: string }> = {
  'Mercury-Mercury': {
    harmony: 'Mental wavelengths sync — conversations flow and ideas spark',
    challenge: 'Different thinking styles create misunderstandings',
    neutral: 'Your communication styles need conscious bridging',
  },
  'Mercury-Mars': {
    harmony: 'Words translate into action smoothly — effective team',
    challenge: 'Their impatience may cut your thought process short',
    neutral: 'Your ideas and their drive need pacing alignment',
  },
  'Mars-Mercury': {
    harmony: 'Your energy fuels their ideas — action meets articulation',
    challenge: 'Your intensity may overwhelm their thinking process',
    neutral: 'Your assertiveness and their mind need mutual pacing',
  },
  'Mars-Mars': {
    harmony: 'Matched drive and conflict style — you fight fair and move forward',
    challenge: 'Two strong wills may escalate disagreements quickly',
    neutral: 'Your assertive styles differ — find constructive outlets',
  },
};

// =============================================================================
// MATRIX 4: GROWTH & COMMITMENT (Jupiter/Saturn) — 2×2
// =============================================================================

const GROWTH_PLANET_WEIGHTS: Record<string, number> = {
  'Jupiter-Jupiter': 1.2,  // Shared vision and optimism
  'Jupiter-Saturn':  1.3,  // Vision vs structure (key axis)
  'Saturn-Jupiter':  1.3,  // Structure meets expansion
  'Saturn-Saturn':   1.1,  // Shared fears and lessons
};

const GROWTH_CELL_WEIGHTS: Record<string, number> = {
  'Jupiter-Jupiter': 0.20,
  'Jupiter-Saturn':  0.30,
  'Saturn-Jupiter':  0.30,
  'Saturn-Saturn':   0.20,
};

const GROWTH_INSIGHTS: Record<string, { harmony: string; challenge: string; neutral: string }> = {
  'Jupiter-Jupiter': {
    harmony: 'Shared optimism and vision — you expand each other\'s world',
    challenge: 'Over-expansion risk — who provides the reality check?',
    neutral: 'Your growth philosophies differ but can complement',
  },
  'Jupiter-Saturn': {
    harmony: 'Your vision meets their structure — dreams become real',
    challenge: 'Your optimism feels reckless to their cautious nature',
    neutral: 'Expansion meets contraction — find the productive tension',
  },
  'Saturn-Jupiter': {
    harmony: 'Your discipline channels their enthusiasm productively',
    challenge: 'Your caution may dampen their spirit and ambition',
    neutral: 'Your structure meets their vision — negotiate the pace',
  },
  'Saturn-Saturn': {
    harmony: 'Shared sense of responsibility — you build lasting things',
    challenge: 'Double caution may prevent needed risks and growth',
    neutral: 'Your fears and duties align — support each other through them',
  },
};

// =============================================================================
// MATRIX 5: TRANSFORMATION (Uranus/Neptune/Pluto) — 3×3
// =============================================================================

const TRANSFORMATION_PLANET_WEIGHTS: Record<string, number> = {
  'Uranus-Uranus':   1.0,   // Generational — same rebellion style
  'Uranus-Neptune':  1.1,   // Innovation meets dreams
  'Uranus-Pluto':    1.2,   // Revolution meets transformation
  'Neptune-Uranus':  1.1,   // Dreams meet innovation
  'Neptune-Neptune': 1.0,   // Generational — shared spiritual tide
  'Neptune-Pluto':   1.2,   // Spiritual meets primal
  'Pluto-Uranus':    1.2,   // Power meets rebellion
  'Pluto-Neptune':   1.2,   // Depth meets transcendence
  'Pluto-Pluto':     1.0,   // Generational — shared power themes
};

const TRANSFORMATION_CELL_WEIGHTS: Record<string, number> = {
  'Uranus-Uranus':   0.08,
  'Uranus-Neptune':  0.12,
  'Uranus-Pluto':    0.14,
  'Neptune-Uranus':  0.12,
  'Neptune-Neptune': 0.08,
  'Neptune-Pluto':   0.14,
  'Pluto-Uranus':    0.14,
  'Pluto-Neptune':   0.10,
  'Pluto-Pluto':     0.08,
};

const TRANSFORMATION_INSIGHTS: Record<string, { harmony: string; challenge: string; neutral: string }> = {
  'Uranus-Uranus': {
    harmony: 'Same generational rebellion — you instinctively get each other\'s need for freedom',
    challenge: 'Same blind spots around convention — who keeps you grounded?',
    neutral: 'Shared generational values around independence and change',
  },
  'Uranus-Neptune': {
    harmony: 'Your innovation meets their idealism — visionary partnership',
    challenge: 'Your disruption unsettles their dreamworld',
    neutral: 'Your need for change encounters their fluid boundaries',
  },
  'Uranus-Pluto': {
    harmony: 'Your liberation impulse aligns with their transformative power',
    challenge: 'Your rebellion triggers their control instincts',
    neutral: 'Freedom meets intensity — handle with conscious awareness',
  },
  'Neptune-Uranus': {
    harmony: 'Your dreams inspire their inventiveness',
    challenge: 'Your need for flow clashes with their need for disruption',
    neutral: 'Your idealism meets their independence — find shared vision',
  },
  'Neptune-Neptune': {
    harmony: 'Shared spiritual and creative wavelength — deep resonance',
    challenge: 'Shared illusions — who anchors reality?',
    neutral: 'Same generational dreams and blind spots around boundaries',
  },
  'Neptune-Pluto': {
    harmony: 'Your compassion softens their intensity — healing partnership',
    challenge: 'Your idealism may be overwhelmed by their raw power',
    neutral: 'Spirituality meets primal force — profound but demanding',
  },
  'Pluto-Uranus': {
    harmony: 'Your transformative depth empowers their freedom quest',
    challenge: 'Your intensity may feel controlling to their free spirit',
    neutral: 'Power meets liberation — respect each other\'s process',
  },
  'Pluto-Neptune': {
    harmony: 'Your depth penetrates their dreamworld — profound healing',
    challenge: 'Your intensity may shatter their delicate fantasies',
    neutral: 'Depth meets transcendence — navigate the shadow together',
  },
  'Pluto-Pluto': {
    harmony: 'Same generational power dynamics — mutual understanding of the shadow',
    challenge: 'Shared obsessive tendencies — stay conscious of power plays',
    neutral: 'Same generational transformation themes — shared depth',
  },
};

// =============================================================================
// GENERIC MATRIX BUILDER
// =============================================================================

function generateInsight(
  pairKey: string,
  insightTable: Record<string, { harmony: string; challenge: string; neutral: string }>,
  effortScore: number
): string {
  const template = insightTable[pairKey];
  if (!template) return `${pairKey} interaction`;
  if (effortScore <= 4) return template.harmony;
  if (effortScore >= 7) return template.challenge;
  return template.neutral;
}

interface MatrixConfig {
  layer: MatrixLayerKey;
  title: string;
  subtitle: string;
  rows: Planet[];
  cols: Planet[];
  planetWeights: Record<string, number>;
  cellWeights: Record<string, number>;
  insights: Record<string, { harmony: string; challenge: string; neutral: string }>;
}

/**
 * Cusp blend data for a person's planets.
 * Key is the planet name, value is the SignBlend[] from phiCurve.
 * Only planets with cusp data need entries — pure signs are handled automatically.
 */
export type CuspBlendMap = Partial<Record<Planet, SignBlend[]>>;

/**
 * Resolve a planet's metadata: if cusp blend data exists, use blended vectors;
 * otherwise fall back to pure sign metadata from SIGN_LESSONS.
 */
function resolveBlendedMetadata(sign: SignKey, planet: Planet, cuspMap?: CuspBlendMap): BlendedSignMetadata {
  const cuspBlend = cuspMap?.[planet];
  if (cuspBlend && cuspBlend.length > 0) {
    return blendFromCuspResult(cuspBlend);
  }
  return getPureSignMetadata(sign);
}

function buildGenericMatrix(
  positionsA: PlanetPosition[],
  positionsB: PlanetPosition[],
  config: MatrixConfig,
  cuspBlendsA?: CuspBlendMap,
  cuspBlendsB?: CuspBlendMap,
): PlanetaryMatrix {
  // Build lookup maps: planet → sign
  const mapA = new Map<Planet, SignKey>();
  for (const p of positionsA) mapA.set(p.planet, p.sign);
  const mapB = new Map<Planet, SignKey>();
  for (const p of positionsB) mapB.set(p.planet, p.sign);

  const grid: PlanetaryCellReport[] = [];

  for (const rowPlanet of config.rows) {
    for (const colPlanet of config.cols) {
      const fromSign = mapA.get(rowPlanet);
      const toSign = mapB.get(colPlanet);

      if (!fromSign || !toSign) continue;

      const pairKey = `${rowPlanet}-${colPlanet}`;
      const angleResult = getAngleBetweenSigns(fromSign as any, toSign as any);
      const angle = angleResult?.key ?? 'conjunction';

      const pWeight = config.planetWeights[pairKey] ?? 1.0;
      const cellWeight = config.cellWeights[pairKey] ?? (1 / (config.rows.length * config.cols.length));

      // Resolve blended metadata (cusp-aware when data is available)
      const aBlend = resolveBlendedMetadata(fromSign, rowPlanet, cuspBlendsA);
      const bBlend = resolveBlendedMetadata(toSign, colPlanet, cuspBlendsB);

      const hasCuspData = aBlend.neighbor != null || bBlend.neighbor != null;

      let effort: number;
      let harmony: number;
      let steps: EffortStep[];

      if (hasCuspData) {
        // Use blended (continuous vector) effort calculation
        const result = calculateBlendedEffortWithSteps(angle, aBlend, bBlend, {
          planetPairWeight: pWeight,
          planetPairLabel: pairKey,
        });
        effort = result.effort;
        harmony = result.harmony;
        steps = result.steps;
      } else {
        // Fall back to discrete (pure sign) effort calculation
        const A = SIGN_LESSONS[fromSign];
        const B = SIGN_LESSONS[toSign];
        const result = calculateEffortWithSteps(
          angle, A.element, B.element, A.modality, B.modality, {
            planetPairWeight: pWeight,
            planetPairLabel: pairKey,
          }
        );
        effort = result.effort;
        harmony = result.harmony;
        steps = result.steps;
      }

      const insight = generateInsight(pairKey, config.insights, effort);

      grid.push({
        pairKey,
        fromPlanet: rowPlanet,
        toPlanet: colPlanet,
        fromSign,
        toSign,
        angle,
        effortScore: effort,
        harmonyScore: harmony,
        insight,
        weight: cellWeight,
        steps,
      });
    }
  }

  // Weighted score (1-100)
  const weightedSum = grid.reduce((sum, g) => sum + (g.harmonyScore * g.weight * 10), 0);
  const weightedScore = Math.round(weightedSum);

  // Key insights (top 3)
  const sorted = [...grid].sort((a, b) => b.harmonyScore - a.harmonyScore);
  const keyInsights: string[] = [];
  if (sorted.length > 0 && sorted[0].harmonyScore >= 6) {
    keyInsights.push(`${sorted[0].pairKey}: ${sorted[0].insight}`);
  }
  const worstCell = [...grid].sort((a, b) => a.harmonyScore - b.harmonyScore)[0];
  if (worstCell && worstCell.effortScore >= 6) {
    keyInsights.push(`Growth edge (${worstCell.pairKey}): ${worstCell.insight}`);
  }
  if (grid.length > 1 && sorted.length > 1 && sorted[1].harmonyScore >= 5) {
    keyInsights.push(`${sorted[1].pairKey}: ${sorted[1].insight}`);
  }

  return {
    layer: config.layer,
    title: config.title,
    subtitle: config.subtitle,
    rows: config.rows,
    cols: config.cols,
    grid,
    weightedScore,
    keyInsights: keyInsights.slice(0, 3),
  };
}

// =============================================================================
// PUBLIC BUILDER FUNCTIONS
// =============================================================================

/**
 * Matrix 2: Chemistry & Desire (Venus/Mars) — 2×2
 * Measures physical attraction, love language, and drive compatibility.
 */
export function buildChemistryMatrix(
  positionsA: PlanetPosition[],
  positionsB: PlanetPosition[],
  cuspBlendsA?: CuspBlendMap,
  cuspBlendsB?: CuspBlendMap,
): PlanetaryMatrix {
  return buildGenericMatrix(positionsA, positionsB, {
    layer: 'chemistry',
    title: 'Chemistry & Desire',
    subtitle: 'Venus/Mars — attraction, passion, love language',
    rows: ['Venus', 'Mars'],
    cols: ['Venus', 'Mars'],
    planetWeights: CHEMISTRY_PLANET_WEIGHTS,
    cellWeights: CHEMISTRY_CELL_WEIGHTS,
    insights: CHEMISTRY_INSIGHTS,
  }, cuspBlendsA, cuspBlendsB);
}

/**
 * Matrix 3: Communication (Mercury/Mars) — 2×2
 * Measures mental compatibility, thought-to-action bridge, and conflict style.
 */
export function buildCommunicationMatrix(
  positionsA: PlanetPosition[],
  positionsB: PlanetPosition[],
  cuspBlendsA?: CuspBlendMap,
  cuspBlendsB?: CuspBlendMap,
): PlanetaryMatrix {
  return buildGenericMatrix(positionsA, positionsB, {
    layer: 'communication',
    title: 'Communication',
    subtitle: 'Mercury/Mars — how you think, speak, assert, and resolve conflict',
    rows: ['Mercury', 'Mars'],
    cols: ['Mercury', 'Mars'],
    planetWeights: COMMUNICATION_PLANET_WEIGHTS,
    cellWeights: COMMUNICATION_CELL_WEIGHTS,
    insights: COMMUNICATION_INSIGHTS,
  }, cuspBlendsA, cuspBlendsB);
}

/**
 * Matrix 4: Growth & Commitment (Jupiter/Saturn) — 2×2
 * Measures shared vision, ambition, and ability to build together.
 */
export function buildGrowthMatrix(
  positionsA: PlanetPosition[],
  positionsB: PlanetPosition[],
  cuspBlendsA?: CuspBlendMap,
  cuspBlendsB?: CuspBlendMap,
): PlanetaryMatrix {
  return buildGenericMatrix(positionsA, positionsB, {
    layer: 'growth',
    title: 'Growth & Commitment',
    subtitle: 'Jupiter/Saturn — vision, structure, long-term building',
    rows: ['Jupiter', 'Saturn'],
    cols: ['Jupiter', 'Saturn'],
    planetWeights: GROWTH_PLANET_WEIGHTS,
    cellWeights: GROWTH_CELL_WEIGHTS,
    insights: GROWTH_INSIGHTS,
  }, cuspBlendsA, cuspBlendsB);
}

/**
 * Matrix 5: Transformation (Uranus/Neptune/Pluto) — 3×3
 * Measures generational alignment, spiritual depth, and shadow work.
 */
export function buildTransformationMatrix(
  positionsA: PlanetPosition[],
  positionsB: PlanetPosition[],
  cuspBlendsA?: CuspBlendMap,
  cuspBlendsB?: CuspBlendMap,
): PlanetaryMatrix {
  return buildGenericMatrix(positionsA, positionsB, {
    layer: 'transformation',
    title: 'Transformation',
    subtitle: 'Uranus/Neptune/Pluto — generational forces, shadow, rebirth',
    rows: ['Uranus', 'Neptune', 'Pluto'],
    cols: ['Uranus', 'Neptune', 'Pluto'],
    planetWeights: TRANSFORMATION_PLANET_WEIGHTS,
    cellWeights: TRANSFORMATION_CELL_WEIGHTS,
    insights: TRANSFORMATION_INSIGHTS,
  }, cuspBlendsA, cuspBlendsB);
}

/**
 * Build all 4 extended matrices at once.
 * Requires planet positions for both people.
 * Optional cusp blend data enables continuous vector-based scoring.
 */
export function buildAllPlanetaryMatrices(
  positionsA: PlanetPosition[],
  positionsB: PlanetPosition[],
  cuspBlendsA?: CuspBlendMap,
  cuspBlendsB?: CuspBlendMap,
): PlanetaryMatrix[] {
  return [
    buildChemistryMatrix(positionsA, positionsB, cuspBlendsA, cuspBlendsB),
    buildCommunicationMatrix(positionsA, positionsB, cuspBlendsA, cuspBlendsB),
    buildGrowthMatrix(positionsA, positionsB, cuspBlendsA, cuspBlendsB),
    buildTransformationMatrix(positionsA, positionsB, cuspBlendsA, cuspBlendsB),
  ];
}

// =============================================================================
// PLANET ICONS & LABELS (for UI)
// =============================================================================

export const PLANET_ICONS: Record<Planet, string> = {
  Sun:     '☉',
  Moon:    '☽',
  Rising:  '↑',
  Venus:   '♀',
  Mars:    '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Saturn:  '♄',
  Uranus:  '♅',
  Neptune: '♆',
  Pluto:   '♇',
};

export const PLANET_LABELS: Record<Planet, string> = {
  Sun:     'Sun',
  Moon:    'Moon',
  Rising:  'Rising',
  Venus:   'Venus',
  Mars:    'Mars',
  Mercury: 'Mercury',
  Jupiter: 'Jupiter',
  Saturn:  'Saturn',
  Uranus:  'Uranus',
  Neptune: 'Neptune',
  Pluto:   'Pluto',
};

/**
 * What each planet governs — used in "no black box" explanations.
 */
export const PLANET_ROLE: Record<Planet, string> = {
  Sun:     'core identity, ego, life purpose',
  Moon:    'emotions, instincts, inner needs',
  Rising:  'first impression, social mask, outward style',
  Venus:   'love language, attraction, aesthetic values',
  Mars:    'drive, assertion, conflict style, courage',
  Mercury: 'thinking, communication, learning style',
  Jupiter: 'growth, optimism, beliefs, expansion',
  Saturn:  'discipline, commitment, fears, life lessons',
  Uranus:  'rebellion, innovation, sudden change',
  Neptune: 'dreams, spirituality, illusions, compassion',
  Pluto:   'transformation, power, shadow, rebirth',
};

/**
 * What each planet-pair cell measures — the "why" behind the score.
 * Covers all cells across Matrices 2-5.
 */
export const CELL_DESCRIPTION: Record<string, string> = {
  // Chemistry (Venus/Mars)
  'Venus-Venus':   'Do your love languages and comfort needs match?',
  'Venus-Mars':    'Does your softness activate their drive? Classic attraction axis.',
  'Mars-Venus':    'Does your initiative energize their receptivity?',
  'Mars-Mars':     'Do your energies and ambitions push in the same direction?',
  // Communication (Mercury/Mars)
  'Mercury-Mercury': 'Do your minds work at the same speed and in the same style?',
  'Mercury-Mars':    'Do your words translate smoothly into their action?',
  'Mars-Mercury':    'Does your assertiveness land clearly on their mind?',
  // Growth (Jupiter/Saturn)
  'Jupiter-Jupiter': 'Do your visions and optimism point the same way?',
  'Jupiter-Saturn':  'Does your expansion hit a wall or find a frame in their structure?',
  'Saturn-Jupiter':  'Does your discipline channel or dampen their enthusiasm?',
  'Saturn-Saturn':   'Do your shared fears and duties align or compound?',
  // Transformation (Uranus/Neptune/Pluto)
  'Uranus-Uranus':   'Same generation — do your rebellion styles resonate?',
  'Uranus-Neptune':  'Does your disruption stir or shatter their dreams?',
  'Uranus-Pluto':    'Does your freedom quest empower or threaten their depth?',
  'Neptune-Uranus':  'Does your idealism inspire or confuse their independence?',
  'Neptune-Neptune': 'Same generation — do your spiritual wavelengths sync?',
  'Neptune-Pluto':   'Does your compassion soften or dissolve their intensity?',
  'Pluto-Uranus':    'Does your power embolden or control their free spirit?',
  'Pluto-Neptune':   'Does your depth penetrate or overwhelm their fantasies?',
  'Pluto-Pluto':     'Same generation — do your shadow themes mirror each other?',
};

export const MATRIX_LAYER_COLORS: Record<MatrixLayerKey, string> = {
  coreBond:        '#fbbf24',  // Amber
  chemistry:       '#f472b6',  // Pink
  communication:   '#60a5fa',  // Blue
  growth:          '#34d399',  // Emerald
  transformation:  '#a78bfa',  // Violet
};

// =============================================================================
// LAYER WEIGHTS — How much each matrix contributes to the final score
// =============================================================================

export const MATRIX_WEIGHTS: Record<MatrixLayerKey, number> = {
  coreBond:        0.45,   // Sun/Moon/Rising — foundation of identity
  chemistry:       0.20,   // Venus/Mars — attraction and passion
  communication:   0.15,   // Mercury — how minds meet
  growth:          0.12,   // Jupiter/Saturn — long-term building
  transformation:  0.08,   // Uranus/Neptune/Pluto — generational depth
};

// =============================================================================
// MYTHIC NARRATIVES — One paragraph per layer
// =============================================================================

export const LAYER_NARRATIVES: Record<MatrixLayerKey, {
  title: string;
  narrative: string;
}> = {
  coreBond: {
    title: 'Core Bond',
    narrative:
      'How your lives fit at the root. ' +
      'This layer shows how your identities (Sun), emotional bodies (Moon), ' +
      'and ways of moving through the world (Rising) meet. ' +
      'High harmony here feels like "we just get each other." ' +
      'High effort here means the relationship can still work\u2014but it will ' +
      'ask for conscious emotional and identity work.',
  },
  chemistry: {
    title: 'Chemistry & Desire',
    narrative:
      'The spark between you. ' +
      'This layer reveals how you attract, respond, and pursue each other. ' +
      'Venus shows how you give and receive affection; Mars shows how you chase, ' +
      'desire, and fight. High harmony feels like natural magnetism and easy romance. ' +
      'High effort feels like mismatched love languages or chemistry that doesn\'t quite land.',
  },
  communication: {
    title: 'Communication',
    narrative:
      'How your minds meet and your wills negotiate. ' +
      'Mercury\u2013Mercury shows whether your mental rhythms sync. ' +
      'Mercury\u2013Mars shows how words and action interact. ' +
      'Mars\u2013Mercury shows how assertiveness lands on the other\'s thinking. ' +
      'Mars\u2013Mars shows whether your conflict styles match or collide. ' +
      'High harmony feels like "we can talk about anything and fight fair." ' +
      'High effort feels like frequent misunderstandings or arguments that escalate.',
  },
  growth: {
    title: 'Growth & Commitment',
    narrative:
      'The long road you walk together. ' +
      'Jupiter shows where you expand, dream, and grow; Saturn shows where you commit, ' +
      'stabilize, and take responsibility. High harmony here feels like shared goals, ' +
      'mutual support, and realistic optimism. High effort feels like one person wanting ' +
      'to grow while the other brakes\u2014or one carrying more of the weight.',
  },
  transformation: {
    title: 'Transformation',
    narrative:
      'The deep weather of your connection. ' +
      'Uranus brings surprise and awakening, Neptune brings dreams and fog, ' +
      'Pluto brings intensity and transformation. High harmony here feels like ' +
      'spiritual connection, deep psychological resonance, and shared evolution. ' +
      'High effort feels like chaos, confusion, or power struggles that reshape ' +
      'both of you over time.',
  },
};

// =============================================================================
// FINAL COMPOSITE SCORING — Weighted average of all 5 matrices
// =============================================================================

export interface LayerScore {
  layer: MatrixLayerKey;
  score: number | null;    // 1-100 (null if layer not available)
  weight: number;          // Weight in final calculation
}

export interface FinalCompatibilityScore {
  layerScores: LayerScore[];
  finalHarmony: number | null;   // 1-10 scale
  finalPercent: number | null;   // 0-100 scale
  verdict: string;               // Short summary sentence
}

/**
 * Compute the final weighted compatibility score across all 5 matrices.
 * Gracefully handles missing layers (e.g. when only Core Bond is available).
 */
export function computeFinalCompatibility(
  coreBond: SynastryMatrix | null,
  chemistry: PlanetaryMatrix | null,
  communication: PlanetaryMatrix | null,
  growth: PlanetaryMatrix | null,
  transformation: PlanetaryMatrix | null,
): FinalCompatibilityScore {
  const layers: { key: MatrixLayerKey; score: number | null }[] = [
    { key: 'coreBond',        score: coreBond?.weightedScore ?? null },
    { key: 'chemistry',       score: chemistry?.weightedScore ?? null },
    { key: 'communication',   score: communication?.weightedScore ?? null },
    { key: 'growth',          score: growth?.weightedScore ?? null },
    { key: 'transformation',  score: transformation?.weightedScore ?? null },
  ];

  const layerScores: LayerScore[] = layers.map(l => ({
    layer: l.key,
    score: l.score,
    weight: MATRIX_WEIGHTS[l.key],
  }));

  // Weighted average (skip null layers, re-normalize weights)
  let weightedSum = 0;
  let weightTotal = 0;
  for (const ls of layerScores) {
    if (ls.score == null) continue;
    weightedSum += ls.score * ls.weight;
    weightTotal += ls.weight;
  }

  if (weightTotal === 0) {
    return {
      layerScores,
      finalHarmony: null,
      finalPercent: null,
      verdict: 'Insufficient data to compute overall compatibility.',
    };
  }

  const finalPercent = Math.round(weightedSum / weightTotal);
  const finalHarmony = Math.round((finalPercent / 10) * 10) / 10; // 1 decimal

  // Generate verdict
  const parts: string[] = [];
  for (const ls of layerScores) {
    if (ls.score == null) continue;
    const label = LAYER_NARRATIVES[ls.layer].title;
    if (ls.score >= 70) parts.push(`Strong ${label}`);
    else if (ls.score >= 50) parts.push(`Moderate ${label}`);
    else parts.push(`Challenging ${label}`);
  }
  const verdict = parts.join(', ');

  return { layerScores, finalHarmony, finalPercent, verdict };
}

// =============================================================================
// EXTENDED COMPATIBILITY REPORT — Full JSON schema with cusps & seasonality
// =============================================================================

export interface PersonProfile {
  name: string;
  birthDate?: string;         // ISO date
  birthTime?: string;         // HH:mm
  birthPlace?: string;
  timezone?: string;
  planets: PlanetPosition[];
  cuspBlends?: {              // φ-curve cusp data (when available)
    Sun?: SignBlend[];
    Moon?: SignBlend[];
    Rising?: SignBlend[];
  };
  seasonalProfile?: {
    dominantSeason: Season;
    seasonBreakdown: Record<Season, number>;  // 0-1 per season
  };
}

export interface SynastryCompatibilityReport {
  // People
  personA: PersonProfile;
  personB: PersonProfile;

  // All 5 matrices
  matrices: {
    coreBond: SynastryMatrix | null;
    chemistry: PlanetaryMatrix | null;
    communication: PlanetaryMatrix | null;
    growth: PlanetaryMatrix | null;
    transformation: PlanetaryMatrix | null;
  };

  // Final weighted score
  scores: FinalCompatibilityScore;

  // Seasonal leadership (which person leads in which season)
  seasonalDynamics?: {
    Spring?: 'A' | 'B' | 'Share';
    Summer?: 'A' | 'B' | 'Share';
    Autumn?: 'A' | 'B' | 'Share';
    Winter?: 'A' | 'B' | 'Share';
  };

  // Cusp interaction flags
  cuspInteractions?: {
    hasCuspOverlap: boolean;        // Do their cusp zones overlap?
    sharedCuspBoundary?: string;    // e.g. "Aries-Taurus"
    blendAmplification?: number;    // How much cusp blending affects scores (0-1)
  };

  // Layer narratives (mythic text)
  narratives: Record<MatrixLayerKey, string>;

  // Metadata
  generatedAt: string;  // ISO timestamp
  engineVersion: string;
}

/**
 * Convert PersonProfile cusp blends into a CuspBlendMap for the matrix builders.
 * Maps Sun/Moon/Rising cusp blends (and any planet-level cusps) into
 * the generic Planet → SignBlend[] lookup.
 */
function toCuspBlendMap(profile: PersonProfile): CuspBlendMap | undefined {
  const blends = profile.cuspBlends;
  if (!blends) return undefined;

  const map: CuspBlendMap = {};
  if (blends.Sun) map.Sun = blends.Sun;
  if (blends.Moon) map.Moon = blends.Moon;
  if (blends.Rising) map.Rising = blends.Rising;

  // Return undefined if no actual cusp data
  return Object.keys(map).length > 0 ? map : undefined;
}

/**
 * Build the complete compatibility report from two person profiles.
 * Populates all 5 matrices, final scores, narratives, and cusp data.
 * When cusp blend data is present, uses continuous vector-based scoring.
 */
export function buildCompatibilityReport(
  personA: PersonProfile,
  personB: PersonProfile,
  coreBondMatrix: SynastryMatrix | null,
): SynastryCompatibilityReport {
  // Convert cusp blends to the generic map format
  const cuspA = toCuspBlendMap(personA);
  const cuspB = toCuspBlendMap(personB);

  // Build matrices 2-5 from planet positions (with cusp awareness)
  const chemistry = buildChemistryMatrix(personA.planets, personB.planets, cuspA, cuspB);
  const communication = buildCommunicationMatrix(personA.planets, personB.planets, cuspA, cuspB);
  const growth = buildGrowthMatrix(personA.planets, personB.planets, cuspA, cuspB);
  const transformation = buildTransformationMatrix(personA.planets, personB.planets, cuspA, cuspB);

  // Final weighted score
  const scores = computeFinalCompatibility(
    coreBondMatrix, chemistry, communication, growth, transformation
  );

  // Seasonal leadership (based on season breakdown if available)
  let seasonalDynamics: SynastryCompatibilityReport['seasonalDynamics'];
  if (personA.seasonalProfile && personB.seasonalProfile) {
    const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
    seasonalDynamics = {} as Record<Season, 'A' | 'B' | 'Share'>;
    for (const s of seasons) {
      const aStr = personA.seasonalProfile.seasonBreakdown[s] ?? 0;
      const bStr = personB.seasonalProfile.seasonBreakdown[s] ?? 0;
      const diff = Math.abs(aStr - bStr);
      if (diff < 0.1) {
        (seasonalDynamics as Record<Season, string>)[s] = 'Share';
      } else if (aStr > bStr) {
        (seasonalDynamics as Record<Season, string>)[s] = 'A';
      } else {
        (seasonalDynamics as Record<Season, string>)[s] = 'B';
      }
    }
  }

  // Cusp interactions
  let cuspInteractions: SynastryCompatibilityReport['cuspInteractions'];
  if (personA.cuspBlends?.Sun && personB.cuspBlends?.Sun) {
    const aSigns = new Set(personA.cuspBlends.Sun.map(b => b.sign));
    const bSigns = new Set(personB.cuspBlends.Sun.map(b => b.sign));
    const overlap = [...aSigns].filter(s => bSigns.has(s));
    cuspInteractions = {
      hasCuspOverlap: overlap.length > 1,
      sharedCuspBoundary: overlap.length > 1 ? overlap.join('-') : undefined,
      blendAmplification: overlap.length > 1 ? 0.15 : 0,
    };
  }

  // Assemble narratives
  const narratives = {} as Record<MatrixLayerKey, string>;
  for (const key of Object.keys(LAYER_NARRATIVES) as MatrixLayerKey[]) {
    narratives[key] = LAYER_NARRATIVES[key].narrative;
  }

  return {
    personA,
    personB,
    matrices: {
      coreBond: coreBondMatrix,
      chemistry,
      communication,
      growth,
      transformation,
    },
    scores,
    seasonalDynamics,
    cuspInteractions,
    narratives,
    generatedAt: new Date().toISOString(),
    engineVersion: '2.0.0',
  };
}

// =============================================================================
// PRECOMPUTED BLENDED CHART — Resolve all planet blends once upstream
// =============================================================================

/**
 * A planet position bundled with its pre-resolved blended sign metadata
 * and seasonal context. Computing the blend once upstream means every
 * matrix builder can simply read `.blendedSign` instead of re-resolving
 * cusp data per cell, and the UI can read `.seasonContext` for display.
 */
export interface BlendedPlanetPosition extends PlanetPosition {
  blendedSign: BlendedSignMetadata;
  /** Seasonal context: phase (Begin/Core/End), cusp neighbor, day-in-season */
  seasonContext?: SignContext;
}

/**
 * A person's full chart with all planet blends pre-resolved.
 * This is the "ready to score" representation — pass two of these
 * to any matrix builder and cusp blending is already baked in.
 */
export interface PersonChart {
  name: string;
  planets: BlendedPlanetPosition[];
}

/**
 * Precompute blended sign metadata and seasonal context for every planet.
 *
 * @param positions - Raw planet positions (planet + sign)
 * @param cuspBlends - Optional cusp blend data per planet (from phiCurve)
 * @param dayOfYear - Optional day of year for seasonal context (1-365/366)
 * @param hemisphere - Optional hemisphere for season adjustment
 * @returns Array of BlendedPlanetPosition with `.blendedSign` and `.seasonContext`
 *
 * Usage:
 *   const chart = buildBlendedChart(personA.planets, {
 *     Sun: sunBlend, Moon: moonBlend, Rising: risingBlend,
 *   }, 113, 'Northern');
 *   // chart[0].blendedSign.dominantElement → 'Earth'
 *   // chart[0].seasonContext?.season → 'Spring'
 *   // chart[0].seasonContext?.phase  → 'Core'
 */
export function buildBlendedChart(
  positions: PlanetPosition[],
  cuspBlends?: CuspBlendMap,
  dayOfYear?: number,
  hemisphere?: Hemisphere,
): BlendedPlanetPosition[] {
  return positions.map(p => {
    const blendedSign = resolveBlendedMetadata(p.sign, p.planet, cuspBlends);
    const seasonContext = dayOfYear != null
      ? resolveSignContext(p.sign, dayOfYear, hemisphere)
      : undefined;
    return { ...p, blendedSign, seasonContext };
  });
}

/**
 * Build a full PersonChart from a PersonProfile.
 * Convenience wrapper that extracts cusp blends and resolves all planet blends.
 * When birthDate is available, also resolves seasonal context for each planet.
 */
export function buildPersonChart(
  profile: PersonProfile,
  hemisphere?: Hemisphere,
): PersonChart {
  const cuspBlends = toCuspBlendMap(profile);

  // Extract day-of-year from birthDate if available
  let dayOfYear: number | undefined;
  if (profile.birthDate) {
    const date = new Date(profile.birthDate);
    if (!isNaN(date.getTime())) {
      const year = date.getUTCFullYear();
      const start = Date.UTC(year, 0, 0);
      dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
    }
  }

  return {
    name: profile.name,
    planets: buildBlendedChart(profile.planets, cuspBlends, dayOfYear, hemisphere),
  };
}
