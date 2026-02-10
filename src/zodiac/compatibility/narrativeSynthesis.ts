/**
 * narrativeSynthesis.ts
 *
 * Groups the 9 φ-Blend cells into 3 chambers + synthesis paragraph.
 *
 *   Identity Chamber   (Sun→*)  : Sun-Sun, Sun-Moon, Sun-Rising
 *   Emotional Chamber  (Moon→*) : Moon-Sun, Moon-Moon, Moon-Rising
 *   Interface Chamber  (Rising→*): Rising-Sun, Rising-Moon, Rising-Rising
 *   Synthesis          : Overall story from diagonal averages + full score
 *
 * Uses existing cell data only — no new scoring logic.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// TYPES
// =============================================================================

type Lens = 'Sun' | 'Moon' | 'Rising';

export type ChamberId = 'identity' | 'emotional' | 'interface';

export interface ChamberNarrative {
  id: ChamberId;
  title: string;
  fromLens: Lens;
  avgScore: number;       // Average harmony of the 3 cells in this row
  paragraph: string;      // Human-readable narrative
  strongest: string;      // Key: e.g. "Sun-Moon"
  weakest: string;        // Key: e.g. "Sun-Rising"
}

export interface SynthesisNarrative {
  chambers: ChamberNarrative[];
  synthesis: {
    diagonalAvg: number;  // Average of Sun-Sun, Moon-Moon, Rising-Rising
    overallScore: number; // Weighted overall φ-score
    paragraph: string;
  };
}

// Cell data expected from the grid
interface CellData {
  fromLens: Lens;
  toLens: Lens;
  phiHarmony: number;
  interpretation: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CHAMBER_CONFIG: { id: ChamberId; title: string; fromLens: Lens }[] = [
  { id: 'identity',  title: 'Identity Chamber',  fromLens: 'Sun' },
  { id: 'emotional', title: 'Emotional Chamber', fromLens: 'Moon' },
  { id: 'interface', title: 'Interface Chamber', fromLens: 'Rising' },
];

const TO_LENSES: Lens[] = ['Sun', 'Moon', 'Rising'];

const CHAMBER_CONTEXT: Record<ChamberId, {
  intro: string;
  strongVerb: string;
  weakVerb: string;
}> = {
  identity: {
    intro: 'core values and identity expression',
    strongVerb: 'resonates most strongly',
    weakVerb: 'requires the most conscious effort',
  },
  emotional: {
    intro: 'emotional needs and inner rhythms',
    strongVerb: 'flows most naturally',
    weakVerb: 'needs the most attentive nurturing',
  },
  interface: {
    intro: 'social style and outward presentation',
    strongVerb: 'harmonizes most easily',
    weakVerb: 'calls for the most patience and adaptation',
  },
};

// =============================================================================
// SCORE DESCRIPTOR
// =============================================================================

function scoreDescriptor(score: number): string {
  if (score >= 8) return 'exceptionally harmonious';
  if (score >= 7) return 'strongly aligned';
  if (score >= 6) return 'well-balanced';
  if (score >= 5) return 'moderately compatible';
  if (score >= 4) return 'growth-oriented';
  return 'notably challenging';
}

function lensLabel(lens: Lens): string {
  if (lens === 'Sun') return 'identity';
  if (lens === 'Moon') return 'emotional world';
  return 'social presentation';
}

// =============================================================================
// CHAMBER PARAGRAPH BUILDER
// =============================================================================

function buildChamberParagraph(
  chamberId: ChamberId,
  fromLens: Lens,
  cells: CellData[],
  nameA: string,
  nameB: string,
): ChamberNarrative {
  const ctx = CHAMBER_CONTEXT[chamberId];
  const config = CHAMBER_CONFIG.find(c => c.id === chamberId)!;

  const sorted = [...cells].sort((a, b) => b.phiHarmony - a.phiHarmony);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const avg = cells.reduce((sum, c) => sum + c.phiHarmony, 0) / cells.length;

  const s1 = `${nameA}'s ${ctx.intro} meets ${nameB}'s world at an average of ${avg.toFixed(1)}/10 — ${scoreDescriptor(avg)}.`;
  const s2 = `The ${fromLens}→${strongest.toLens} connection (${strongest.phiHarmony.toFixed(1)}/10) ${ctx.strongVerb}, linking ${nameA}'s ${lensLabel(fromLens)} to ${nameB}'s ${lensLabel(strongest.toLens)}.`;
  const s3 = weakest.phiHarmony < strongest.phiHarmony
    ? `Meanwhile, the ${fromLens}→${weakest.toLens} axis (${weakest.phiHarmony.toFixed(1)}/10) ${ctx.weakVerb}.`
    : `All three connections score similarly, showing consistent energy across this chamber.`;

  return {
    id: chamberId,
    title: config.title,
    fromLens,
    avgScore: Math.round(avg * 10) / 10,
    paragraph: `${s1} ${s2} ${s3}`,
    strongest: `${fromLens}-${strongest.toLens}`,
    weakest: `${fromLens}-${weakest.toLens}`,
  };
}

// =============================================================================
// SYNTHESIS PARAGRAPH BUILDER
// =============================================================================

function buildSynthesisParagraph(
  chambers: ChamberNarrative[],
  diagonalAvg: number,
  overallScore: number,
  nameA: string,
  nameB: string,
): string {
  const strongestChamber = [...chambers].sort((a, b) => b.avgScore - a.avgScore)[0];
  const weakestChamber = [...chambers].sort((a, b) => a.avgScore - b.avgScore)[0];

  const s1 = `Overall, ${nameA} and ${nameB} share a φ-Blend compatibility of ${overallScore}% — the diagonal core (Sun-Sun, Moon-Moon, Rising-Rising) averages ${diagonalAvg.toFixed(1)}/10.`;
  const s2 = `Their strongest dimension is the ${strongestChamber.title.toLowerCase()} (${strongestChamber.avgScore.toFixed(1)}/10), where ${strongestChamber.fromLens}-level connections ${scoreDescriptor(strongestChamber.avgScore).replace('notably ', '')}.`;
  const s3 = weakestChamber.id !== strongestChamber.id
    ? `Growth opportunity lies in the ${weakestChamber.title.toLowerCase()} (${weakestChamber.avgScore.toFixed(1)}/10), which invites deeper understanding of each other's ${lensLabel(weakestChamber.fromLens)}.`
    : `All three chambers score similarly, reflecting balanced compatibility across identity, emotions, and social style.`;

  return `${s1} ${s2} ${s3}`;
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

export function buildNarrativeSynthesis(
  grid: CellData[],
  overallScore: number,
  nameA: string,
  nameB: string,
): SynthesisNarrative {
  // Build 3 chamber narratives
  const chambers: ChamberNarrative[] = CHAMBER_CONFIG.map(config => {
    const cells = TO_LENSES.map(toLens =>
      grid.find(c => c.fromLens === config.fromLens && c.toLens === toLens)!
    ).filter(Boolean);

    return buildChamberParagraph(config.id, config.fromLens, cells, nameA, nameB);
  });

  // Diagonal: Sun-Sun, Moon-Moon, Rising-Rising
  const diagonalCells = (['Sun', 'Moon', 'Rising'] as Lens[]).map(lens =>
    grid.find(c => c.fromLens === lens && c.toLens === lens)
  ).filter(Boolean) as CellData[];

  const diagonalAvg = diagonalCells.length > 0
    ? diagonalCells.reduce((sum, c) => sum + c.phiHarmony, 0) / diagonalCells.length
    : 0;

  const paragraph = buildSynthesisParagraph(chambers, diagonalAvg, overallScore, nameA, nameB);

  return {
    chambers,
    synthesis: {
      diagonalAvg: Math.round(diagonalAvg * 10) / 10,
      overallScore,
      paragraph,
    },
  };
}
