/**
 * GrowthTransformationPanel - Growth (Jupiter/Saturn) & Transformation (Uranus/Neptune/Pluto)
 *
 * Two φ-Blend matrices using the same 4-layer scoring engine:
 *   1. Growth & Commitment (2×2): Jupiter × Saturn — vision, structure, long-term building
 *   2. Transformation Matrix (3×3): Uranus × Neptune × Pluto — awakening, idealism, depth
 *
 * GENESIS AstroProfile - February 2026
 */

import React, { useMemo, useState } from 'react';
import { type SignKey } from '../../zodiac/tropicalMap';
import { getAngleBetweenSigns, type AngleKey } from '../../zodiac/angles';
import { formatBlendPercent, type SignBlend } from '../../zodiac/cusp/phiCurve';
import { interpretCell } from '../../zodiac/compatibility/phiInterpretation';
import { explainCell, type CellExplanation } from '../../zodiac/compatibility/explainCell';
import { LAYER_WEIGHTS, SEASONAL_PHASE_DISPLAY } from '../../zodiac/compatibility/elementModality';

// =============================================================================
// TYPES
// =============================================================================

type GrowthLens = 'Jupiter' | 'Saturn';
type TransformLens = 'Uranus' | 'Neptune' | 'Pluto';
type PlanetLens = GrowthLens | TransformLens;

interface CellData {
  fromLens: PlanetLens;
  toLens: PlanetLens;
  phiHarmony: number;
  interpretation: string;
  angleKey: AngleKey;
  explanation: CellExplanation;
}

interface NarrativeResult {
  summary: string;
  insights: string[];
  growthEdge?: string;
}

interface GrowthTransformationPanelProps {
  nameA: string;
  nameB: string;
  jupiterBlendA: SignBlend[];
  jupiterBlendB: SignBlend[];
  saturnBlendA: SignBlend[];
  saturnBlendB: SignBlend[];
  uranusBlendA: SignBlend[];
  uranusBlendB: SignBlend[];
  neptuneBlendA: SignBlend[];
  neptuneBlendB: SignBlend[];
  plutoBlendA: SignBlend[];
  plutoBlendB: SignBlend[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const GROWTH_LENSES: GrowthLens[] = ['Jupiter', 'Saturn'];
const TRANSFORM_LENSES: TransformLens[] = ['Uranus', 'Neptune', 'Pluto'];

const PLANET_ICONS: Record<PlanetLens, string> = {
  Jupiter: '♃', Saturn: '♄',
  Uranus: '♅', Neptune: '♆', Pluto: '♇',
};

const PLANET_MEANING: Record<PlanetLens, string> = {
  Jupiter: 'growth, optimism, shared meaning, expansion',
  Saturn: 'commitment, responsibility, structure, long-term building',
  Uranus: 'revolution, awakening, sudden change, innovation',
  Neptune: 'spirituality, idealism, dreams, transcendence',
  Pluto: 'transformation, depth, power, rebirth',
};

const GROWTH_CELL_INSIGHT: Record<string, string> = {
  'Jupiter-Jupiter': 'shared optimism and meaning',
  'Jupiter-Saturn':  'expansion meets structure',
  'Saturn-Jupiter':  'responsibility shapes growth',
  'Saturn-Saturn':   'shared lessons and commitments',
};

const TRANSFORM_CELL_INSIGHT: Record<string, string> = {
  'Uranus-Uranus':   'revolutionary instincts resonate',
  'Uranus-Neptune':  'awakening meets dreams',
  'Uranus-Pluto':    'disruption meets transformation',
  'Neptune-Uranus':  'idealism responds to revolution',
  'Neptune-Neptune':  'shared spiritual visions',
  'Neptune-Pluto':   'spirituality meets primal force',
  'Pluto-Uranus':    'transformation meets disruption',
  'Pluto-Neptune':   'depth meets transcendence',
  'Pluto-Pluto':     'shared transformative forces',
};

/** Growth cell weights — same-planet pairs weighted higher (1.0 vs 0.85, normalized) */
const GROWTH_WEIGHTS: Record<string, number> = {
  'Jupiter-Jupiter': 0.27,   // same-planet: higher importance
  'Jupiter-Saturn':  0.23,   // cross-planet: slightly lower
  'Saturn-Jupiter':  0.23,
  'Saturn-Saturn':   0.27,
};

/** Transformation cell weights: diagonal heavier, cross-pairs balanced */
const TRANSFORM_WEIGHTS: Record<string, number> = {
  'Uranus-Uranus':   0.14,
  'Uranus-Neptune':  0.10,
  'Uranus-Pluto':    0.10,
  'Neptune-Uranus':  0.10,
  'Neptune-Neptune':  0.14,
  'Neptune-Pluto':   0.10,
  'Pluto-Uranus':    0.10,
  'Pluto-Neptune':   0.10,
  'Pluto-Pluto':     0.12,
};

const GROWTH_ACCENT = '#14b8a6'; // Teal
const TRANSFORM_ACCENT = '#a855f7'; // Purple

// =============================================================================
// HELPERS
// =============================================================================

function getHarmonyColor(score: number): string {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#84cc16';
  if (score >= 5) return '#eab308';
  if (score >= 4) return '#f97316';
  return '#ef4444';
}

function getScoreLabel(percent: number): string {
  if (percent >= 75) return 'Powerful Synergy';
  if (percent >= 60) return 'Strong Alignment';
  if (percent >= 45) return 'Workable Dynamics';
  if (percent >= 30) return 'Growth Opportunities';
  return 'Challenging Terrain';
}

function getBlendForLens(
  lens: PlanetLens,
  blends: Record<PlanetLens, SignBlend[]>,
): SignBlend[] {
  return blends[lens];
}

function buildGrid(
  lenses: PlanetLens[],
  blendsA: Record<PlanetLens, SignBlend[]>,
  blendsB: Record<PlanetLens, SignBlend[]>,
): CellData[] {
  const cells: CellData[] = [];
  for (const fromLens of lenses) {
    for (const toLens of lenses) {
      const fromBlend = getBlendForLens(fromLens, blendsA);
      const toBlend = getBlendForLens(toLens, blendsB);

      const explanation = explainCell(fromLens, toLens, fromBlend, toBlend);
      const harmony = explanation.score10;

      const dominantFrom = [...fromBlend].sort((a, b) => b.weight - a.weight)[0];
      const dominantTo = [...toBlend].sort((a, b) => b.weight - a.weight)[0];
      const angleResult = getAngleBetweenSigns(dominantFrom.sign as SignKey, dominantTo.sign as SignKey);
      const angleKey = (angleResult?.key ?? 'conjunction') as AngleKey;

      const interpretation = interpretCell(fromLens, toLens, fromBlend, toBlend, angleKey, harmony);
      cells.push({ fromLens, toLens, phiHarmony: harmony, interpretation, angleKey, explanation });
    }
  }
  return cells;
}

function computeOverall(grid: CellData[], weights: Record<string, number>): number {
  let total = 0;
  for (const cell of grid) {
    const key = `${cell.fromLens}-${cell.toLens}`;
    const weight = weights[key] || 0;
    total += cell.phiHarmony * weight * 10;
  }
  return Math.round(total);
}

function buildNarrative(
  grid: CellData[],
  overallPercent: number,
  type: 'growth' | 'transformation',
): NarrativeResult {
  const sorted = [...grid].sort((a, b) => b.phiHarmony - a.phiHarmony);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const cellInsights = type === 'growth' ? GROWTH_CELL_INSIGHT : TRANSFORM_CELL_INSIGHT;

  const insights = grid.map(cell => {
    const key = `${cell.fromLens}-${cell.toLens}`;
    const meaning = cellInsights[key] || `${cell.fromLens} meets ${cell.toLens}`;
    return `${PLANET_ICONS[cell.fromLens]} ${cell.fromLens}\u2013${PLANET_ICONS[cell.toLens]} ${cell.toLens}: ${meaning} \u2014 ${cell.phiHarmony.toFixed(1)}/10`;
  });

  if (type === 'growth') {
    const label = overallPercent >= 65 ? 'supports long-term shared growth'
      : overallPercent >= 45 ? 'creates productive tension between expansion and discipline'
      : 'requires conscious effort to balance ambition with structure';
    return {
      summary: `Your Jupiter\u2013Saturn dynamic ${label}. The strongest connection is ${strongest.fromLens}\u2192${strongest.toLens} (${strongest.phiHarmony.toFixed(1)}/10).`,
      insights,
      growthEdge: `Growth edge: ${weakest.fromLens}\u2192${weakest.toLens} (${weakest.phiHarmony.toFixed(1)}/10) \u2014 where long-term development requires awareness.`,
    };
  }

  const label = overallPercent >= 65 ? 'carries powerful transformative potential'
    : overallPercent >= 45 ? 'blends disruption with depth in complex ways'
    : 'demands deep inner work to navigate generational currents';
  return {
    summary: `Your outer-planet alignment ${label}. ${strongest.fromLens}\u2192${strongest.toLens} resonates most strongly (${strongest.phiHarmony.toFixed(1)}/10).`,
    insights,
    growthEdge: `Deepest work: ${weakest.fromLens}\u2192${weakest.toLens} (${weakest.phiHarmony.toFixed(1)}/10) \u2014 where the most profound transformation lives.`,
  };
}

// =============================================================================
// BLEND LABEL SUB-COMPONENT
// =============================================================================

function BlendLabel({ blend }: { blend: SignBlend[] }) {
  const sorted = [...blend].sort((a, b) => b.weight - a.weight);
  const primary = sorted[0];
  const secondary = sorted[1];
  const hasCusp = secondary && formatBlendPercent(secondary.weight) >= 5;

  if (!hasCusp || !primary) {
    return (
      <span className="gt-sign-label">
        {primary ? `${primary.sign.slice(0, 3)} 100%` : '\u2014'}
      </span>
    );
  }

  return (
    <span className="gt-sign-label">
      <span className="gt-sign-primary">
        {primary.sign.slice(0, 3)} {formatBlendPercent(primary.weight)}%
      </span>
      <span className="gt-sign-secondary">
        {secondary.sign.slice(0, 3)} {formatBlendPercent(secondary.weight)}%
      </span>
    </span>
  );
}

// =============================================================================
// MATRIX SUB-COMPONENT
// =============================================================================

function MatrixGrid({
  title,
  subtitle,
  accent,
  lenses,
  grid,
  weights,
  overallScore,
  nameA,
  nameB,
  blendsA,
  blendsB,
  narrative,
  prefix,
}: {
  title: string;
  subtitle: string;
  accent: string;
  lenses: PlanetLens[];
  grid: CellData[];
  weights: Record<string, number>;
  overallScore: number;
  nameA: string;
  nameB: string;
  blendsA: Record<PlanetLens, SignBlend[]>;
  blendsB: Record<PlanetLens, SignBlend[]>;
  narrative: NarrativeResult;
  prefix: string;
}) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [showCalc, setShowCalc] = useState(false);

  const getCell = (from: PlanetLens, to: PlanetLens) =>
    grid.find(c => c.fromLens === from && c.toLens === to);

  return (
    <div className="gt-section">
      {/* Section header */}
      <div className="gt-section-header">
        <div>
          <h5 className="gt-section-title" style={{ color: accent }}>{title}</h5>
          <p className="gt-section-subtitle">{subtitle}</p>
        </div>
        <div className="gt-section-badge" style={{ borderColor: `${accent}60` }}>
          <span className="gt-section-score" style={{ color: getHarmonyColor(overallScore / 10) }}>
            {overallScore}%
          </span>
          <span className="gt-section-sublabel">{prefix}</span>
        </div>
      </div>

      <div className="gt-score-bar">
        <div className="gt-score-fill" style={{ width: `${overallScore}%`, background: `linear-gradient(90deg, ${accent}88, ${accent})` }} />
      </div>

      {/* N×N Grid */}
      <div
        className="gt-matrix"
        style={{ gridTemplateColumns: `80px repeat(${lenses.length}, 1fr)` }}
      >
        {/* Corner */}
        <div className="gt-cell gt-corner">
          <span className="gt-corner-label">{nameA} \u2193 / {nameB} \u2192</span>
        </div>

        {/* Column headers */}
        {lenses.map(lens => (
          <div key={`col-${lens}`} className="gt-cell gt-col-header">
            <span className="gt-lens-icon">{PLANET_ICONS[lens]}</span>
            <span className="gt-lens-name">{lens}</span>
            <BlendLabel blend={getBlendForLens(lens, blendsB)} />
          </div>
        ))}

        {/* Data rows */}
        {lenses.map(fromLens => (
          <React.Fragment key={`row-${fromLens}`}>
            <div className="gt-cell gt-row-header">
              <span className="gt-lens-icon">{PLANET_ICONS[fromLens]}</span>
              <span className="gt-lens-name">{fromLens}</span>
              <BlendLabel blend={getBlendForLens(fromLens, blendsA)} />
            </div>

            {lenses.map(toLens => {
              const cell = getCell(fromLens, toLens);
              if (!cell) return <div key={`c-${fromLens}-${toLens}`} className="gt-cell" />;

              const cellKey = `${fromLens}-${toLens}`;
              const isSelected = selectedCell === cellKey;
              const color = getHarmonyColor(cell.phiHarmony);
              const weight = weights[cellKey] || 0;

              return (
                <div
                  key={`c-${fromLens}-${toLens}`}
                  className={`gt-cell gt-data ${isSelected ? 'selected' : ''}`}
                  style={{
                    background: `${color}20`,
                    borderColor: isSelected ? color : `${color}40`,
                  }}
                  onClick={() => { setSelectedCell(isSelected ? null : cellKey); setShowCalc(false); }}
                  title={`${fromLens}\u2192${toLens}: ${cell.phiHarmony.toFixed(1)}/10`}
                >
                  <div className="gt-cell-harmony" style={{ color }}>
                    {cell.phiHarmony.toFixed(1)}
                  </div>
                  <div className="gt-cell-label">harmony</div>
                  <div className="gt-cell-weight">{Math.round(weight * 100)}%</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Selected cell detail */}
      {selectedCell && (() => {
        const [fromLens, toLens] = selectedCell.split('-') as [PlanetLens, PlanetLens];
        const cell = getCell(fromLens, toLens);
        if (!cell) return null;

        const { steps } = cell.explanation;

        return (
          <div className="gt-detail" style={{ borderColor: `${accent}40` }}>
            <div className="gt-detail-header">
              <span className="gt-detail-pair" style={{ color: accent }}>
                {PLANET_ICONS[fromLens]} {fromLens} \u2192 {PLANET_ICONS[toLens]} {toLens}
              </span>
              <span className="gt-detail-score">
                {cell.phiHarmony.toFixed(1)} / 10
              </span>
            </div>

            <p className="gt-detail-meaning">
              <span className="gt-meaning-from">{fromLens}: {PLANET_MEANING[fromLens]}</span>
              <span className="gt-meaning-sep">\u00D7</span>
              <span className="gt-meaning-to">{toLens}: {PLANET_MEANING[toLens]}</span>
            </p>

            {/* Sign Pair Breakdown */}
            <div className="gt-detail-pairs">
              {steps.signPairs.map((pair, i) => (
                <div key={i} className="gt-pair-card">
                  <div className="gt-aspect-badge" style={{ borderColor: `${pair.aspectColor}60`, background: `${pair.aspectColor}15` }}>
                    <span className="gt-aspect-symbol">{pair.aspectSymbol}</span>
                    <span className="gt-aspect-name">{pair.aspectName}</span>
                    <span className="gt-aspect-degrees">{pair.aspectAngle}\u00B0</span>
                  </div>

                  <div className="gt-pair-header-row">
                    <span className="gt-pair-signs">
                      {pair.a.slice(0, 3)} \u2192 {pair.b.slice(0, 3)}
                    </span>
                    <span className="gt-pair-combined" style={{ color: getHarmonyColor(pair.combinedBaseScore * 10) }}>
                      {(pair.combinedBaseScore * 10).toFixed(1)}
                    </span>
                    <span className="gt-pair-weight">
                      {Math.round(pair.fromWeight * 100)}% \u00D7 {Math.round(pair.toWeight * 100)}% = {Math.round(pair.weight * 100)}%
                    </span>
                  </div>

                  <div className="gt-pair-layers">
                    <span className="gt-chip aspect">
                      {pair.aspectName} {pair.aspectAngle}\u00B0 = {pair.aspectScore.toFixed(2)}
                    </span>
                    <span className="gt-chip element">
                      {pair.elementA}\u2192{pair.elementB} = {pair.elementScore.toFixed(2)}
                    </span>
                    <span className="gt-chip modality">
                      {pair.modalityA}\u2192{pair.modalityB} = {pair.modalityScore.toFixed(2)}
                    </span>
                    <span className="gt-chip seasonal">
                      {SEASONAL_PHASE_DISPLAY[pair.seasonalPhaseA]}\u2192{SEASONAL_PHASE_DISPLAY[pair.seasonalPhaseB]} = {pair.seasonalScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="gt-formula-bar">
              <span className="gt-formula-label">Formula:</span>
              <span className="gt-formula-text">
                {Math.round(LAYER_WEIGHTS.aspect * 100)}% Aspect + {Math.round(LAYER_WEIGHTS.element * 100)}% Element + {Math.round(LAYER_WEIGHTS.modality * 100)}% Modality + {Math.round(LAYER_WEIGHTS.seasonal * 100)}% Seasonal
              </span>
            </div>

            <button
              type="button"
              className="gt-show-calc-btn"
              onClick={() => setShowCalc(!showCalc)}
            >
              {showCalc ? 'Hide' : 'Show'} Calculation
            </button>

            {showCalc && (
              <pre className="gt-calc-text">{cell.explanation.explanation}</pre>
            )}

            <p className="gt-interpretation" style={{ color: `${accent}cc` }}>{cell.interpretation}</p>
          </div>
        );
      })()}

      {/* Narrative */}
      <div className="gt-narrative" style={{ borderLeftColor: `${accent}66`, background: `${accent}0a` }}>
        <p className="gt-narrative-summary">{narrative.summary}</p>
        {narrative.insights.length > 0 && (
          <ul className="gt-narrative-insights">
            {narrative.insights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        )}
        {narrative.growthEdge && (
          <p className="gt-narrative-edge">{narrative.growthEdge}</p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const GrowthTransformationPanel: React.FC<GrowthTransformationPanelProps> = ({
  nameA,
  nameB,
  jupiterBlendA,
  jupiterBlendB,
  saturnBlendA,
  saturnBlendB,
  uranusBlendA,
  uranusBlendB,
  neptuneBlendA,
  neptuneBlendB,
  plutoBlendA,
  plutoBlendB,
}) => {
  // Build blend lookup records
  const growthBlendsA: Record<PlanetLens, SignBlend[]> = {
    Jupiter: jupiterBlendA, Saturn: saturnBlendA,
    Uranus: [], Neptune: [], Pluto: [],
  };
  const growthBlendsB: Record<PlanetLens, SignBlend[]> = {
    Jupiter: jupiterBlendB, Saturn: saturnBlendB,
    Uranus: [], Neptune: [], Pluto: [],
  };
  const transformBlendsA: Record<PlanetLens, SignBlend[]> = {
    Jupiter: [], Saturn: [],
    Uranus: uranusBlendA, Neptune: neptuneBlendA, Pluto: plutoBlendA,
  };
  const transformBlendsB: Record<PlanetLens, SignBlend[]> = {
    Jupiter: [], Saturn: [],
    Uranus: uranusBlendB, Neptune: neptuneBlendB, Pluto: plutoBlendB,
  };

  // Growth grid (2×2)
  const growthGrid = useMemo(
    () => buildGrid(GROWTH_LENSES, growthBlendsA, growthBlendsB),
    [jupiterBlendA, jupiterBlendB, saturnBlendA, saturnBlendB],
  );
  const growthScore = useMemo(() => computeOverall(growthGrid, GROWTH_WEIGHTS), [growthGrid]);
  const growthNarrative = useMemo(() => buildNarrative(growthGrid, growthScore, 'growth'), [growthGrid, growthScore]);

  // Transformation grid (3×3)
  const transformGrid = useMemo(
    () => buildGrid(TRANSFORM_LENSES, transformBlendsA, transformBlendsB),
    [uranusBlendA, uranusBlendB, neptuneBlendA, neptuneBlendB, plutoBlendA, plutoBlendB],
  );
  const transformScore = useMemo(() => computeOverall(transformGrid, TRANSFORM_WEIGHTS), [transformGrid]);
  const transformNarrative = useMemo(() => buildNarrative(transformGrid, transformScore, 'transformation'), [transformGrid, transformScore]);

  // Combined
  const combinedScore = Math.round(growthScore * 0.5 + transformScore * 0.5);

  return (
    <div className="gt-container">
      {/* Panel header */}
      <div className="gt-header">
        <div className="gt-title-row">
          <div>
            <h4 className="gt-title">Growth, Commitment & Transformation</h4>
            <p className="gt-subtitle">Jupiter/Saturn vision & commitment + Outer planet depth</p>
          </div>
          <div className="gt-combined-badge">
            <span className="gt-combined-score" style={{ color: getHarmonyColor(combinedScore / 10) }}>
              {combinedScore}%
            </span>
            <span className="gt-combined-sublabel">Combined</span>
          </div>
        </div>

        {/* Combined score bar */}
        <div className="gt-combined-bar">
          <div className="gt-combined-fill" style={{ width: `${combinedScore}%` }} />
        </div>

        <div className="gt-combined-label-row">
          <span className="gt-combined-label">{getScoreLabel(combinedScore)}</span>
          <span className="gt-combined-breakdown">
            Growth & Commitment {growthScore}% + Transformation {transformScore}%
          </span>
        </div>
      </div>

      {/* Growth Matrix */}
      <MatrixGrid
        title="♃♄ Growth & Commitment"
        subtitle="Jupiter/Saturn — vision, structure, long-term building"
        accent={GROWTH_ACCENT}
        lenses={GROWTH_LENSES}
        grid={growthGrid}
        weights={GROWTH_WEIGHTS}
        overallScore={growthScore}
        nameA={nameA}
        nameB={nameB}
        blendsA={growthBlendsA}
        blendsB={growthBlendsB}
        narrative={growthNarrative}
        prefix="Growth"
      />

      {/* Transformation Matrix */}
      <MatrixGrid
        title="♅♆♇ Transformation Matrix"
        subtitle="Uranus/Neptune/Pluto — awakening, idealism, deep transformation"
        accent={TRANSFORM_ACCENT}
        lenses={TRANSFORM_LENSES}
        grid={transformGrid}
        weights={TRANSFORM_WEIGHTS}
        overallScore={transformScore}
        nameA={nameA}
        nameB={nameB}
        blendsA={transformBlendsA}
        blendsB={transformBlendsB}
        narrative={transformNarrative}
        prefix="Transform"
      />

      <style>{`
        .gt-container {
          color: #e5e7eb;
          margin-top: 16px;
        }

        /* Panel header */
        .gt-header {
          margin-bottom: 16px;
        }

        .gt-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .gt-title {
          font-size: 16px;
          font-weight: 700;
          color: #c084fc;
          margin: 0;
        }

        .gt-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        .gt-combined-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(192, 132, 252, 0.35);
          border-radius: 10px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .gt-combined-score {
          font-size: 22px;
          font-weight: 800;
        }

        .gt-combined-sublabel {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .gt-combined-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .gt-combined-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, ${GROWTH_ACCENT}88, ${TRANSFORM_ACCENT});
          transition: width 0.5s ease;
        }

        .gt-combined-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .gt-combined-label {
          font-size: 11px;
          font-weight: 600;
          color: #c084fc;
        }

        .gt-combined-breakdown {
          font-size: 10px;
          color: #6b7280;
        }

        /* Section */
        .gt-section {
          margin-top: 14px;
        }

        .gt-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .gt-section-title {
          font-size: 14px;
          font-weight: 700;
          margin: 0;
        }

        .gt-section-subtitle {
          font-size: 11px;
          color: #9ca3af;
          margin: 2px 0 0 0;
        }

        .gt-section-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid;
          border-radius: 8px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.03);
        }

        .gt-section-score {
          font-size: 18px;
          font-weight: 800;
        }

        .gt-section-sublabel {
          font-size: 9px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .gt-score-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .gt-score-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        /* Grid */
        .gt-matrix {
          display: grid;
          gap: 4px;
          margin-bottom: 10px;
        }

        .gt-cell {
          padding: 8px;
          border-radius: 8px;
          text-align: center;
        }

        .gt-corner {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
        }

        .gt-corner-label {
          font-size: 8px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.3;
        }

        .gt-col-header,
        .gt-row-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: rgba(255, 255, 255, 0.04);
        }

        .gt-lens-icon {
          font-size: 18px;
        }

        .gt-lens-name {
          font-size: 10px;
          font-weight: 500;
          color: #9ca3af;
        }

        .gt-sign-label {
          display: flex;
          flex-direction: column;
          gap: 1px;
          font-size: 10px;
          font-weight: 600;
          color: #c4b5fd;
        }

        .gt-sign-secondary {
          font-size: 9px;
          color: #9ca3af;
        }

        /* Data Cells */
        .gt-data {
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .gt-data:hover {
          transform: scale(1.03);
        }

        .gt-data.selected {
          border-width: 2px;
        }

        .gt-cell-harmony {
          font-size: 18px;
          font-weight: 800;
        }

        .gt-cell-label {
          font-size: 9px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .gt-cell-weight {
          font-size: 9px;
          color: #6b7280;
        }

        /* Detail Panel */
        .gt-detail {
          background: rgba(168, 85, 247, 0.06);
          border: 1px solid;
          border-radius: 12px;
          padding: 14px;
          margin-top: 4px;
          margin-bottom: 8px;
        }

        .gt-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .gt-detail-pair {
          font-size: 14px;
          font-weight: 700;
        }

        .gt-detail-score {
          font-size: 16px;
          font-weight: 700;
          color: #e5e7eb;
        }

        .gt-detail-pairs {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 12px;
        }

        .gt-pair-card {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 10px;
        }

        .gt-aspect-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border: 1px solid;
          border-radius: 20px;
          margin-bottom: 8px;
        }

        .gt-aspect-symbol { font-size: 14px; }
        .gt-aspect-name { font-size: 12px; font-weight: 600; color: #e5e7eb; }
        .gt-aspect-degrees { font-size: 11px; color: #9ca3af; }

        .gt-pair-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .gt-pair-signs {
          font-size: 12px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .gt-pair-combined {
          font-size: 14px;
          font-weight: 700;
        }

        .gt-pair-weight {
          font-size: 10px;
          color: #9ca3af;
          margin-left: auto;
        }

        .gt-pair-layers {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .gt-chip {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .gt-chip.aspect {
          background: rgba(96, 165, 250, 0.15);
          color: #93c5fd;
        }

        .gt-chip.element {
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
        }

        .gt-chip.modality {
          background: rgba(168, 85, 247, 0.15);
          color: #c4b5fd;
        }

        .gt-chip.seasonal {
          background: rgba(251, 191, 36, 0.15);
          color: #fcd34d;
        }

        .gt-formula-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .gt-formula-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .gt-formula-text {
          font-size: 11px;
          color: #d1d5db;
        }

        .gt-show-calc-btn {
          display: block;
          width: 100%;
          padding: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #9ca3af;
          font-size: 11px;
          cursor: pointer;
          margin-bottom: 8px;
          transition: background 0.2s;
        }

        .gt-show-calc-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .gt-calc-text {
          font-size: 11px;
          line-height: 1.5;
          color: #9ca3af;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 10px;
          margin: 0 0 8px 0;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .gt-interpretation {
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Planet meaning in detail panel */
        .gt-detail-meaning {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #9ca3af;
          margin: 0 0 10px 0;
          flex-wrap: wrap;
        }

        .gt-meaning-from,
        .gt-meaning-to {
          font-style: italic;
        }

        .gt-meaning-sep {
          color: #6b7280;
          font-weight: 700;
        }

        /* Narrative */
        .gt-narrative {
          border-left: 3px solid;
          border-radius: 6px;
          padding: 10px 12px;
          margin-top: 8px;
        }

        .gt-narrative-summary {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0 0 8px 0;
        }

        .gt-narrative-insights {
          list-style: none;
          padding: 0;
          margin: 0 0 8px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .gt-narrative-insights li {
          font-size: 11px;
          line-height: 1.5;
          color: #d1d5db;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 6px;
        }

        .gt-narrative-edge {
          font-size: 11px;
          line-height: 1.5;
          color: #eab308;
          margin: 0;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default GrowthTransformationPanel;
