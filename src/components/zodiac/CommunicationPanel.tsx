/**
 * CommunicationPanel - Mercury × Mars Communication & Action Matrix
 *
 * A 2×2 φ-Blend matrix using the same 4-layer scoring engine:
 *   Mercury × Mars — communication style, thinking, assertion, conflict resolution
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

type CommLens = 'Mercury' | 'Mars';

interface CellData {
  fromLens: CommLens;
  toLens: CommLens;
  phiHarmony: number;
  interpretation: string;
  angleKey: AngleKey;
  explanation: CellExplanation;
}

interface NarrativeResult {
  summary: string;
  insights: string[];
  commEdge?: string;
}

interface CommunicationPanelProps {
  nameA: string;
  nameB: string;
  mercuryBlendA: SignBlend[];
  mercuryBlendB: SignBlend[];
  marsBlendA: SignBlend[];
  marsBlendB: SignBlend[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COMM_LENSES: CommLens[] = ['Mercury', 'Mars'];

const COMM_ICONS: Record<CommLens, string> = {
  Mercury: '☿', Mars: '♂',
};

const COMM_MEANING: Record<CommLens, string> = {
  Mercury: 'communication, thinking, learning, mental style',
  Mars: 'drive, assertion, conflict style, action',
};

const COMM_CELL_INSIGHT: Record<string, string> = {
  'Mercury-Mercury': 'mental compatibility and thinking patterns',
  'Mercury-Mars':    'words meet action and assertion',
  'Mars-Mercury':    'assertive energy meets communication style',
  'Mars-Mars':       'conflict style alignment and shared drive',
};

/** Communication cell weights — same-planet pairs slightly heavier (1.0 vs 0.95, normalized) */
const COMM_WEIGHTS: Record<string, number> = {
  'Mercury-Mercury': 0.26,   // same-planet: higher importance
  'Mercury-Mars':    0.24,   // cross-planet: slightly lower
  'Mars-Mercury':    0.24,
  'Mars-Mars':       0.26,
};

const COMM_ACCENT = '#f59e0b'; // Amber

// =============================================================================
// COMMUNICATION ARCHETYPES
// =============================================================================

export type CommunicationArchetype =
  | 'The Debaters'
  | 'The Firestarters'
  | 'The Strategists'
  | 'The Harmonizers'
  | 'The Challengers';

interface ArchetypeProfile {
  label: CommunicationArchetype;
  icon: string;
  color: string;
  narrative: string;
}

const ARCHETYPE_PROFILES: Record<CommunicationArchetype, ArchetypeProfile> = {
  'The Debaters': {
    label: 'The Debaters',
    icon: '\u2694\uFE0F',
    color: '#818cf8',
    narrative: 'You two thrive on mental sparring, lively discussion, and intellectual challenge. Communication is a sport, and ideas sharpen each other.',
  },
  'The Firestarters': {
    label: 'The Firestarters',
    icon: '\uD83D\uDD25',
    color: '#f87171',
    narrative: 'Your communication is bold, direct, and passionate. Sparks fly quickly \u2014 for better or worse \u2014 and honesty is immediate.',
  },
  'The Strategists': {
    label: 'The Strategists',
    icon: '\u265F\uFE0F',
    color: '#34d399',
    narrative: 'You communicate with precision, planning, and mutual respect. You solve problems together and think several steps ahead.',
  },
  'The Harmonizers': {
    label: 'The Harmonizers',
    icon: '\uD83C\uDFB6',
    color: '#38bdf8',
    narrative: 'Your communication is smooth, balanced, and cooperative. You naturally avoid escalation and find common ground.',
  },
  'The Challengers': {
    label: 'The Challengers',
    icon: '\u26A1',
    color: '#fbbf24',
    narrative: 'Communication can be uneven or reactive. With awareness, this becomes a powerful arena for growth and understanding.',
  },
};

export function getCommunicationArchetype(grid: CellData[]): CommunicationArchetype {
  const getScore = (from: string, to: string) =>
    grid.find(c => c.fromLens === from && c.toLens === to)?.phiHarmony ?? 0;

  const MM = getScore('Mercury', 'Mercury');
  const MMa = getScore('Mercury', 'Mars');
  const MaM = getScore('Mars', 'Mercury');
  const MaMa = getScore('Mars', 'Mars');

  // Debaters: strong Mercury\u2013Mercury + Mercury\u2013Mars (mental agility)
  if (MM >= 7.5 && MMa >= 7.0) return 'The Debaters';

  // Firestarters: strong Mars\u2013Mars + Mars\u2013Mercury (action-driven)
  if (MaMa >= 7.5 && MaM >= 7.0) return 'The Firestarters';

  // Strategists: all scores solid, well-balanced
  if (MM >= 7.0 && MaMa >= 6.0 && MMa >= 6.0 && MaM >= 6.0) return 'The Strategists';

  // Harmonizers: moderate across the board, no spikes
  if (MM >= 6.0 && MMa >= 6.0 && MaM >= 6.0 && MaMa >= 6.0) return 'The Harmonizers';

  // Challengers: imbalance or low scores
  return 'The Challengers';
}

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
  if (percent >= 70) return 'Strong Communication Flow';
  if (percent >= 55) return 'Good Communication';
  if (percent >= 45) return 'Mixed Communication';
  if (percent >= 30) return 'Communication Challenges';
  return 'Difficult Communication Terrain';
}

function buildGrid(
  blendsA: Record<CommLens, SignBlend[]>,
  blendsB: Record<CommLens, SignBlend[]>,
): CellData[] {
  const cells: CellData[] = [];
  for (const fromLens of COMM_LENSES) {
    for (const toLens of COMM_LENSES) {
      const fromBlend = blendsA[fromLens];
      const toBlend = blendsB[toLens];

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

function computeOverall(grid: CellData[]): number {
  let total = 0;
  for (const cell of grid) {
    const key = `${cell.fromLens}-${cell.toLens}`;
    const weight = COMM_WEIGHTS[key] || 0;
    total += cell.phiHarmony * weight * 10;
  }
  return Math.round(total);
}

function buildNarrative(grid: CellData[], overallPercent: number): NarrativeResult {
  const sorted = [...grid].sort((a, b) => b.phiHarmony - a.phiHarmony);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const insights = grid.map(cell => {
    const key = `${cell.fromLens}-${cell.toLens}`;
    const meaning = COMM_CELL_INSIGHT[key] || `${cell.fromLens} meets ${cell.toLens}`;
    return `${COMM_ICONS[cell.fromLens]} ${cell.fromLens}\u2013${COMM_ICONS[cell.toLens]} ${cell.toLens}: ${meaning} \u2014 ${cell.phiHarmony.toFixed(1)}/10`;
  });

  const label = overallPercent >= 65 ? 'supports natural understanding and shared expression'
    : overallPercent >= 45 ? 'creates dynamic tension between thinking and action'
    : 'requires conscious effort to bridge communication and conflict styles';

  return {
    summary: `Your Mercury\u2013Mars dynamic ${label}. The strongest connection is ${strongest.fromLens}\u2192${strongest.toLens} (${strongest.phiHarmony.toFixed(1)}/10).`,
    insights,
    commEdge: `Communication edge: ${weakest.fromLens}\u2192${weakest.toLens} (${weakest.phiHarmony.toFixed(1)}/10) \u2014 where misunderstandings or conflict patterns may arise.`,
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
      <span className="comm-sign-label">
        {primary ? `${primary.sign.slice(0, 3)} 100%` : '\u2014'}
      </span>
    );
  }

  return (
    <span className="comm-sign-label">
      <span className="comm-sign-primary">
        {primary.sign.slice(0, 3)} {formatBlendPercent(primary.weight)}%
      </span>
      <span className="comm-sign-secondary">
        {secondary.sign.slice(0, 3)} {formatBlendPercent(secondary.weight)}%
      </span>
    </span>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CommunicationPanel: React.FC<CommunicationPanelProps> = ({
  nameA,
  nameB,
  mercuryBlendA,
  mercuryBlendB,
  marsBlendA,
  marsBlendB,
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [showCalc, setShowCalc] = useState(false);

  const blendsA: Record<CommLens, SignBlend[]> = {
    Mercury: mercuryBlendA, Mars: marsBlendA,
  };
  const blendsB: Record<CommLens, SignBlend[]> = {
    Mercury: mercuryBlendB, Mars: marsBlendB,
  };

  const grid = useMemo(
    () => buildGrid(blendsA, blendsB),
    [mercuryBlendA, mercuryBlendB, marsBlendA, marsBlendB],
  );
  const overallScore = useMemo(() => computeOverall(grid), [grid]);
  const narrative = useMemo(() => buildNarrative(grid, overallScore), [grid, overallScore]);
  const archetype = useMemo(() => getCommunicationArchetype(grid), [grid]);
  const archetypeProfile = ARCHETYPE_PROFILES[archetype];

  const getCell = (from: CommLens, to: CommLens) =>
    grid.find(c => c.fromLens === from && c.toLens === to);

  return (
    <div className="comm-container">
      {/* Panel header */}
      <div className="comm-header">
        <div className="comm-title-row">
          <div>
            <h4 className="comm-title">☿♂ Communication & Action</h4>
            <p className="comm-subtitle">Mercury/Mars — thinking, speaking, assertion, conflict style</p>
          </div>
          <div className="comm-badge">
            <span className="comm-badge-score" style={{ color: getHarmonyColor(overallScore / 10) }}>
              {overallScore}%
            </span>
            <span className="comm-badge-sublabel">Communication</span>
          </div>
        </div>

        <div className="comm-score-bar">
          <div className="comm-score-fill" style={{ width: `${overallScore}%` }} />
        </div>

        <div className="comm-label-row">
          <span className="comm-label">{getScoreLabel(overallScore)}</span>
        </div>
      </div>

      {/* Archetype Card */}
      <div className="comm-archetype-card" style={{ borderColor: `${archetypeProfile.color}50` }}>
        <div className="comm-archetype-header">
          <span className="comm-archetype-icon">{archetypeProfile.icon}</span>
          <div>
            <span className="comm-archetype-label">Communication Archetype</span>
            <span className="comm-archetype-name" style={{ color: archetypeProfile.color }}>
              {archetypeProfile.label}
            </span>
          </div>
        </div>
        <p className="comm-archetype-narrative">{archetypeProfile.narrative}</p>
      </div>

      {/* 2×2 Grid */}
      <div className="comm-matrix">
        {/* Corner */}
        <div className="comm-cell comm-corner">
          <span className="comm-corner-label">{nameA} \u2193 / {nameB} \u2192</span>
        </div>

        {/* Column headers */}
        {COMM_LENSES.map(lens => (
          <div key={`col-${lens}`} className="comm-cell comm-col-header">
            <span className="comm-lens-icon">{COMM_ICONS[lens]}</span>
            <span className="comm-lens-name">{lens}</span>
            <BlendLabel blend={blendsB[lens]} />
          </div>
        ))}

        {/* Data rows */}
        {COMM_LENSES.map(fromLens => (
          <React.Fragment key={`row-${fromLens}`}>
            <div className="comm-cell comm-row-header">
              <span className="comm-lens-icon">{COMM_ICONS[fromLens]}</span>
              <span className="comm-lens-name">{fromLens}</span>
              <BlendLabel blend={blendsA[fromLens]} />
            </div>

            {COMM_LENSES.map(toLens => {
              const cell = getCell(fromLens, toLens);
              if (!cell) return <div key={`c-${fromLens}-${toLens}`} className="comm-cell" />;

              const cellKey = `${fromLens}-${toLens}`;
              const isSelected = selectedCell === cellKey;
              const color = getHarmonyColor(cell.phiHarmony);
              const weight = COMM_WEIGHTS[cellKey] || 0;

              return (
                <div
                  key={`c-${fromLens}-${toLens}`}
                  className={`comm-cell comm-data ${isSelected ? 'selected' : ''}`}
                  style={{
                    background: `${color}20`,
                    borderColor: isSelected ? color : `${color}40`,
                  }}
                  onClick={() => { setSelectedCell(isSelected ? null : cellKey); setShowCalc(false); }}
                  title={`${fromLens}\u2192${toLens}: ${cell.phiHarmony.toFixed(1)}/10`}
                >
                  <div className="comm-cell-harmony" style={{ color }}>
                    {cell.phiHarmony.toFixed(1)}
                  </div>
                  <div className="comm-cell-label">harmony</div>
                  <div className="comm-cell-weight">{Math.round(weight * 100)}%</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Selected cell detail */}
      {selectedCell && (() => {
        const [fromLens, toLens] = selectedCell.split('-') as [CommLens, CommLens];
        const cell = getCell(fromLens, toLens);
        if (!cell) return null;

        const { steps } = cell.explanation;

        return (
          <div className="comm-detail">
            <div className="comm-detail-header">
              <span className="comm-detail-pair">
                {COMM_ICONS[fromLens]} {fromLens} \u2192 {COMM_ICONS[toLens]} {toLens}
              </span>
              <span className="comm-detail-score">
                {cell.phiHarmony.toFixed(1)} / 10
              </span>
            </div>

            <p className="comm-detail-meaning">
              <span className="comm-meaning-from">{fromLens}: {COMM_MEANING[fromLens]}</span>
              <span className="comm-meaning-sep">\u00D7</span>
              <span className="comm-meaning-to">{toLens}: {COMM_MEANING[toLens]}</span>
            </p>

            {/* Sign Pair Breakdown */}
            <div className="comm-detail-pairs">
              {steps.signPairs.map((pair, i) => (
                <div key={i} className="comm-pair-card">
                  <div className="comm-aspect-badge" style={{ borderColor: `${pair.aspectColor}60`, background: `${pair.aspectColor}15` }}>
                    <span className="comm-aspect-symbol">{pair.aspectSymbol}</span>
                    <span className="comm-aspect-name">{pair.aspectName}</span>
                    <span className="comm-aspect-degrees">{pair.aspectAngle}\u00B0</span>
                  </div>

                  <div className="comm-pair-header-row">
                    <span className="comm-pair-signs">
                      {pair.a.slice(0, 3)} \u2192 {pair.b.slice(0, 3)}
                    </span>
                    <span className="comm-pair-combined" style={{ color: getHarmonyColor(pair.combinedBaseScore * 10) }}>
                      {(pair.combinedBaseScore * 10).toFixed(1)}
                    </span>
                    <span className="comm-pair-weight">
                      {Math.round(pair.fromWeight * 100)}% \u00D7 {Math.round(pair.toWeight * 100)}% = {Math.round(pair.weight * 100)}%
                    </span>
                  </div>

                  <div className="comm-pair-layers">
                    <span className="comm-chip aspect">
                      {pair.aspectName} {pair.aspectAngle}\u00B0 = {pair.aspectScore.toFixed(2)}
                    </span>
                    <span className="comm-chip element">
                      {pair.elementA}\u2192{pair.elementB} = {pair.elementScore.toFixed(2)}
                    </span>
                    <span className="comm-chip modality">
                      {pair.modalityA}\u2192{pair.modalityB} = {pair.modalityScore.toFixed(2)}
                    </span>
                    <span className="comm-chip seasonal">
                      {SEASONAL_PHASE_DISPLAY[pair.seasonalPhaseA]}\u2192{SEASONAL_PHASE_DISPLAY[pair.seasonalPhaseB]} = {pair.seasonalScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="comm-formula-bar">
              <span className="comm-formula-label">Formula:</span>
              <span className="comm-formula-text">
                {Math.round(LAYER_WEIGHTS.aspect * 100)}% Aspect + {Math.round(LAYER_WEIGHTS.element * 100)}% Element + {Math.round(LAYER_WEIGHTS.modality * 100)}% Modality + {Math.round(LAYER_WEIGHTS.seasonal * 100)}% Seasonal
              </span>
            </div>

            <button
              type="button"
              className="comm-show-calc-btn"
              onClick={() => setShowCalc(!showCalc)}
            >
              {showCalc ? 'Hide' : 'Show'} Calculation
            </button>

            {showCalc && (
              <pre className="comm-calc-text">{cell.explanation.explanation}</pre>
            )}

            <p className="comm-interpretation">{cell.interpretation}</p>
          </div>
        );
      })()}

      {/* Narrative */}
      <div className="comm-narrative">
        <p className="comm-narrative-summary">{narrative.summary}</p>
        {narrative.insights.length > 0 && (
          <ul className="comm-narrative-insights">
            {narrative.insights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        )}
        {narrative.commEdge && (
          <p className="comm-narrative-edge">{narrative.commEdge}</p>
        )}
      </div>

      <style>{`
        .comm-container {
          color: #e5e7eb;
          margin-top: 16px;
        }

        /* Panel header */
        .comm-header {
          margin-bottom: 12px;
        }

        .comm-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .comm-title {
          font-size: 16px;
          font-weight: 700;
          color: ${COMM_ACCENT};
          margin: 0;
        }

        .comm-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        .comm-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 10px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .comm-badge-score {
          font-size: 22px;
          font-weight: 800;
        }

        .comm-badge-sublabel {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .comm-score-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .comm-score-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, ${COMM_ACCENT}88, ${COMM_ACCENT});
          transition: width 0.5s ease;
        }

        .comm-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .comm-label {
          font-size: 11px;
          font-weight: 600;
          color: ${COMM_ACCENT};
        }

        /* Archetype Card */
        .comm-archetype-card {
          border: 1px solid;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .comm-archetype-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .comm-archetype-icon {
          font-size: 24px;
        }

        .comm-archetype-label {
          display: block;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
          font-weight: 600;
        }

        .comm-archetype-name {
          display: block;
          font-size: 16px;
          font-weight: 700;
        }

        .comm-archetype-narrative {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
        }

        /* Grid */
        .comm-matrix {
          display: grid;
          grid-template-columns: 80px repeat(2, 1fr);
          gap: 4px;
          margin-bottom: 10px;
        }

        .comm-cell {
          padding: 8px;
          border-radius: 8px;
          text-align: center;
        }

        .comm-corner {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
        }

        .comm-corner-label {
          font-size: 8px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.3;
        }

        .comm-col-header,
        .comm-row-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: rgba(255, 255, 255, 0.04);
        }

        .comm-lens-icon {
          font-size: 18px;
        }

        .comm-lens-name {
          font-size: 10px;
          font-weight: 500;
          color: #9ca3af;
        }

        .comm-sign-label {
          display: flex;
          flex-direction: column;
          gap: 1px;
          font-size: 10px;
          font-weight: 600;
          color: #fcd34d;
        }

        .comm-sign-secondary {
          font-size: 9px;
          color: #9ca3af;
        }

        /* Data Cells */
        .comm-data {
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .comm-data:hover {
          transform: scale(1.03);
        }

        .comm-data.selected {
          border-width: 2px;
        }

        .comm-cell-harmony {
          font-size: 18px;
          font-weight: 800;
        }

        .comm-cell-label {
          font-size: 9px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .comm-cell-weight {
          font-size: 9px;
          color: #6b7280;
        }

        /* Detail Panel */
        .comm-detail {
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 12px;
          padding: 14px;
          margin-top: 4px;
          margin-bottom: 8px;
        }

        .comm-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .comm-detail-pair {
          font-size: 14px;
          font-weight: 700;
          color: ${COMM_ACCENT};
        }

        .comm-detail-score {
          font-size: 16px;
          font-weight: 700;
          color: #e5e7eb;
        }

        .comm-detail-meaning {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #9ca3af;
          margin: 0 0 10px 0;
          flex-wrap: wrap;
        }

        .comm-meaning-from,
        .comm-meaning-to {
          font-style: italic;
        }

        .comm-meaning-sep {
          color: #6b7280;
          font-weight: 700;
        }

        .comm-detail-pairs {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 12px;
        }

        .comm-pair-card {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 10px;
        }

        .comm-aspect-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border: 1px solid;
          border-radius: 20px;
          margin-bottom: 8px;
        }

        .comm-aspect-symbol { font-size: 14px; }
        .comm-aspect-name { font-size: 12px; font-weight: 600; color: #e5e7eb; }
        .comm-aspect-degrees { font-size: 11px; color: #9ca3af; }

        .comm-pair-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .comm-pair-signs {
          font-size: 12px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .comm-pair-combined {
          font-size: 14px;
          font-weight: 700;
        }

        .comm-pair-weight {
          font-size: 10px;
          color: #9ca3af;
          margin-left: auto;
        }

        .comm-pair-layers {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .comm-chip {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .comm-chip.aspect {
          background: rgba(96, 165, 250, 0.15);
          color: #93c5fd;
        }

        .comm-chip.element {
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
        }

        .comm-chip.modality {
          background: rgba(168, 85, 247, 0.15);
          color: #c4b5fd;
        }

        .comm-chip.seasonal {
          background: rgba(251, 191, 36, 0.15);
          color: #fcd34d;
        }

        .comm-formula-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .comm-formula-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .comm-formula-text {
          font-size: 11px;
          color: #d1d5db;
        }

        .comm-show-calc-btn {
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

        .comm-show-calc-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .comm-calc-text {
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

        .comm-interpretation {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(245, 158, 11, 0.8);
          margin: 0;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Narrative */
        .comm-narrative {
          border-left: 3px solid rgba(245, 158, 11, 0.4);
          border-radius: 6px;
          padding: 10px 12px;
          margin-top: 8px;
          background: rgba(245, 158, 11, 0.04);
        }

        .comm-narrative-summary {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0 0 8px 0;
        }

        .comm-narrative-insights {
          list-style: none;
          padding: 0;
          margin: 0 0 8px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .comm-narrative-insights li {
          font-size: 11px;
          line-height: 1.5;
          color: #d1d5db;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 6px;
        }

        .comm-narrative-edge {
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

export default CommunicationPanel;
