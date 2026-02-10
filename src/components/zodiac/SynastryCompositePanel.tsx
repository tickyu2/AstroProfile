/**
 * SynastryCompositePanel - Mythic synthesis of all five compatibility chambers
 *
 * Renders:
 *   1. Overall composite score + label
 *   2. 5-axis CompatibilityRadar SVG
 *   3. Mythic "Path Name" archetype
 *   4. Per-chamber score highlights with color-coded bars
 *   5. Composite narrative
 *
 * GENESIS AstroProfile - February 2026
 */

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { CompatibilityRadar, type RadarScores } from './CompatibilityRadar';
import { DestinyCurve } from './DestinyCurve';
import { CompositeChartWheel } from './CompositeChartWheel';
import { RelationshipMap, type MapChamber } from './RelationshipMap';
import { DestinyStorybookPanel } from './DestinyStorybookPanel';
import { RelationshipOraclePanel } from './RelationshipOraclePanel';
import { SeasonalChaptersPanel } from './SeasonalChaptersPanel';
import { getCompositeArchetype, type ChamberScoreMap } from '../../zodiac/compatibility/compositeArchetype';
import { getDestinyArchetype, computeVolatility } from '../../zodiac/compatibility/destinyArchetype';
import { buildDestinyStorybook } from '../../zodiac/compatibility/destinyStorybook';
import { buildRelationshipRituals } from '../../zodiac/compatibility/relationshipRituals';
import { exportStorybookPDF } from '../../zodiac/compatibility/storybookExport';
import type { OracleInput } from '../../zodiac/compatibility/relationshipOracle';
import type { CompositeChart } from '../../zodiac/compatibility/compositeMidpoint';
import { buildCompositeTransitStory, type CompositeTransitResult } from '../../zodiac/compatibility/compositeTransitBridge';

// =============================================================================
// TYPES
// =============================================================================

export interface ChamberScore {
  key: string;
  label: string;
  icon: string;
  score: number;    // 0-100
  color: string;
  narrative: string; // one-line summary for this chamber
}

export interface SynastryCompositePanelProps {
  nameA: string;
  nameB: string;
  chambers: ChamberScore[];
  compositeChart?: CompositeChart | null;
}

// =============================================================================
// MYTHIC PATH ENGINE
// =============================================================================

interface MythicPath {
  name: string;
  icon: string;
  description: string;
}

function getMythicPath(chambers: ChamberScore[]): MythicPath {
  const sorted = [...chambers].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const avg = chambers.reduce((s, c) => s + c.score, 0) / (chambers.length || 1);

  // Path determined by strongest chamber
  if (strongest.key === 'core' && strongest.score >= 65) {
    return {
      name: 'The Path of Recognition',
      icon: '\u2609',
      description: 'Your identities mirror and magnetize each other \u2014 this bond is rooted in deep recognition of who you truly are.',
    };
  }
  if (strongest.key === 'passion' && strongest.score >= 65) {
    return {
      name: 'The Path of Fire',
      icon: '\uD83D\uDD25',
      description: 'Desire and chemistry lead this connection \u2014 Venus and Mars write the story of your attraction.',
    };
  }
  if (strongest.key === 'communication' && strongest.score >= 65) {
    return {
      name: 'The Path of Dialogue',
      icon: '\u263F',
      description: 'Words and action align naturally \u2014 Mercury and Mars create a shared language of understanding.',
    };
  }
  if (strongest.key === 'growth' && strongest.score >= 65) {
    return {
      name: 'The Path of Apprenticeship',
      icon: '\u2643',
      description: 'Jupiter and Saturn shape a long arc of shared becoming \u2014 you grow and build together over time.',
    };
  }
  if (strongest.key === 'transformation' && strongest.score >= 65) {
    return {
      name: 'The Path of Alchemy',
      icon: '\u2645',
      description: 'Outer planet forces drive deep transformation \u2014 this bond demands evolution and rewards it profoundly.',
    };
  }

  // No dominant chamber
  if (avg >= 60) {
    return {
      name: 'The Path of Balance',
      icon: '\u2696\uFE0F',
      description: `All five chambers contribute evenly \u2014 a rare, well-rounded connection where no single force dominates.`,
    };
  }

  return {
    name: 'The Path of Becoming',
    icon: '\uD83C\uDF31',
    description: `This relationship is a crucible of growth \u2014 ${weakest.label.toLowerCase()} asks for conscious attention, while ${strongest.label.toLowerCase()} provides the anchor.`,
  };
}

// =============================================================================
// COMPOSITE LABEL
// =============================================================================

function getCompositeLabel(score: number): string {
  if (score >= 80) return 'A Rare, Resonant Bond';
  if (score >= 65) return 'A Strong, Evolving Bond';
  if (score >= 50) return 'A Living, Complex Bond';
  if (score >= 35) return 'A Challenging, Initiatory Bond';
  return 'A Demanding Journey of Awareness';
}

function getCompositeColor(score: number): string {
  if (score >= 70) return '#22c55e';
  if (score >= 55) return '#84cc16';
  if (score >= 45) return '#eab308';
  if (score >= 30) return '#f97316';
  return '#ef4444';
}

// =============================================================================
// COMPOSITE NARRATIVE
// =============================================================================

function buildCompositeNarrative(
  nameA: string,
  nameB: string,
  chambers: ChamberScore[],
  path: MythicPath,
  overall: number,
): string {
  const sorted = [...chambers].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const label = getCompositeLabel(overall);

  return (
    `${nameA} and ${nameB} walk ${path.name}. ` +
    `This is ${label.toLowerCase()} (${overall}% overall). ` +
    `Your strongest chamber is ${strongest.label} (${strongest.score}%), ` +
    `while ${weakest.label} (${weakest.score}%) is where the deepest growth lives. ` +
    `Together, these five layers form a mythic pattern of connection \u2014 ` +
    `identity, desire, communication, vision, and transformation.`
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export const SynastryCompositePanel: React.FC<SynastryCompositePanelProps> = ({
  nameA,
  nameB,
  chambers,
  compositeChart,
}) => {
  const overall = Math.round(
    chambers.reduce((s, c) => s + c.score, 0) / (chambers.length || 1)
  );

  const radarScores: RadarScores = {
    core: 0,
    passion: 0,
    communication: 0,
    growth: 0,
    transformation: 0,
  };
  for (const c of chambers) {
    if (c.key in radarScores) {
      radarScores[c.key as keyof RadarScores] = c.score;
    }
  }

  const path = getMythicPath(chambers);
  const narrative = buildCompositeNarrative(nameA, nameB, chambers, path, overall);
  const compositeColor = getCompositeColor(overall);

  // Composite Archetype (derived from chamber scores)
  const archetypeScoreMap: ChamberScoreMap = {
    core: radarScores.core,
    passion: radarScores.passion,
    communication: radarScores.communication,
    growth: radarScores.growth,
    transformation: radarScores.transformation,
  };
  const archetype = getCompositeArchetype(archetypeScoreMap);

  // Destiny Archetype (meta-trajectory derived from composite + chamber variance)
  const chamberValues = chambers.map(ch => ch.score);
  const volatility = computeVolatility(chamberValues);
  const destiny = getDestinyArchetype({
    compositeArchetype: archetype.archetype,
    transformation: radarScores.transformation,
    growth: radarScores.growth,
    volatility,
  });

  // Relationship Map data (chambers as network nodes)
  const mapChambers: MapChamber[] = chambers.map(ch => ({
    key: ch.key,
    label: ch.label.split(' ')[0],
    icon: ch.icon,
    score: ch.score,
    color: ch.color,
  }));

  // Destiny curve data points (from chambers)
  const destinyPoints = chambers.map(ch => ({
    label: ch.label.split(' ')[0], // first word only for compactness
    icon: ch.icon,
    value: ch.score,
    color: ch.color,
  }));

  // Transit story pipeline (async — Python Swiss Ephemeris first, JS fallback)
  const [transitStory, setTransitStory] = useState<CompositeTransitResult | null>(null);
  useEffect(() => {
    if (!compositeChart || compositeChart.points.length === 0) {
      setTransitStory(null);
      return;
    }
    let cancelled = false;
    buildCompositeTransitStory(compositeChart).then(result => {
      if (!cancelled) setTransitStory(result);
    });
    return () => { cancelled = true; };
  }, [compositeChart]);

  // Destiny Storybook (auto-generated myth — now with transit story beats)
  const storybook = useMemo(() => buildDestinyStorybook({
    nameA,
    nameB,
    compositeArchetype: archetype.archetype,
    destinyArchetype: destiny.archetype,
    mythicPath: path.name,
    chambers: chambers.map(ch => ({
      key: ch.key,
      label: ch.label,
      score: ch.score,
      narrative: ch.narrative,
    })),
    compositePoints: compositeChart?.points,
    storyBeats: transitStory?.storyBeats,
  }), [nameA, nameB, archetype.archetype, destiny.archetype, path.name, chambers, compositeChart, transitStory]);

  // Relationship Rituals (chamber-aligned)
  const rituals = useMemo(() => buildRelationshipRituals(
    chambers.map(ch => ({ key: ch.key, label: ch.label, score: ch.score })),
  ), [chambers]);

  // Oracle input (for Relationship Oracle Q&A)
  const oracleInput = useMemo<OracleInput>(() => ({
    nameA,
    nameB,
    chambers: chambers.map(ch => ({
      key: ch.key,
      label: ch.label,
      score: ch.score,
      narrative: ch.narrative,
    })),
    compositeArchetype: archetype.archetype,
    destinyArchetype: destiny.archetype,
    mythicPath: path.name,
  }), [nameA, nameB, chambers, archetype.archetype, destiny.archetype, path.name]);

  // PDF export handler
  const handleExportPDF = useCallback(() => {
    exportStorybookPDF({
      storybook,
      rituals,
      nameA,
      nameB,
      overall,
      compositeArchetype: archetype.archetype,
      destinyArchetype: destiny.archetype,
      mythicPath: path.name,
    });
  }, [storybook, rituals, nameA, nameB, overall, archetype.archetype, destiny.archetype, path.name]);

  return (
    <div className="sc-container">
      {/* Header */}
      <div className="sc-header">
        <div className="sc-title-row">
          <div>
            <h4 className="sc-title">Relationship Composite</h4>
            <p className="sc-subtitle">Five-chamber synthesis \u2014 the full picture</p>
          </div>
          <div className="sc-overall-badge">
            <span className="sc-overall-score" style={{ color: compositeColor }}>
              {overall}%
            </span>
            <span className="sc-overall-sublabel">Overall</span>
          </div>
        </div>

        <div className="sc-score-bar">
          <div className="sc-score-fill" style={{ width: `${overall}%` }} />
        </div>
        <div className="sc-composite-label" style={{ color: compositeColor }}>
          {getCompositeLabel(overall)}
        </div>
      </div>

      {/* Radar + Path side by side */}
      <div className="sc-body">
        <div className="sc-radar-col">
          <CompatibilityRadar scores={radarScores} size={190} />
        </div>

        <div className="sc-path-col">
          {/* Mythic Path */}
          <div className="sc-path-card">
            <span className="sc-path-icon">{path.icon}</span>
            <div>
              <span className="sc-path-label">Mythic Path</span>
              <span className="sc-path-name">{path.name}</span>
            </div>
          </div>
          <p className="sc-path-desc">{path.description}</p>

          {/* Composite Archetype */}
          <div className="sc-archetype-card" style={{ borderColor: `${archetype.color}33` }}>
            <span className="sc-archetype-icon">{archetype.icon}</span>
            <div className="sc-archetype-body">
              <span className="sc-archetype-label">Composite Archetype</span>
              <span className="sc-archetype-name" style={{ color: archetype.color }}>
                {archetype.archetype}
              </span>
            </div>
          </div>
          <p className="sc-archetype-desc">{archetype.narrative}</p>

          {/* Destiny Archetype */}
          <div className="sc-archetype-card" style={{ borderColor: `${destiny.color}33` }}>
            <span className="sc-archetype-icon">{destiny.icon}</span>
            <div className="sc-archetype-body">
              <span className="sc-archetype-label">Destiny Archetype</span>
              <span className="sc-archetype-name" style={{ color: destiny.color }}>
                {destiny.archetype}
              </span>
            </div>
          </div>
          <p className="sc-archetype-desc">{destiny.narrative}</p>
        </div>
      </div>

      {/* Relationship Constellation — network map of chambers */}
      <div className="sc-map-section">
        <div className="sc-section-label">Relationship Constellation</div>
        <RelationshipMap chambers={mapChambers} overall={overall} size={260} />
      </div>

      {/* Destiny Curve — energetic signature across chambers */}
      {destinyPoints.length >= 2 && (
        <div className="sc-destiny-section">
          <div className="sc-section-label">Destiny Curve</div>
          <DestinyCurve points={destinyPoints} />
        </div>
      )}

      {/* Composite Chart Wheel — midpoint zodiac wheel */}
      {compositeChart && compositeChart.points.length > 0 && (
        <div className="sc-chart-section">
          <div className="sc-section-label">Composite Midpoint Chart</div>
          <CompositeChartWheel chart={compositeChart} size={220} />
        </div>
      )}

      {/* Chamber bars */}
      <div className="sc-chamber-bars">
        {chambers.map(ch => (
          <div key={ch.key} className="sc-chamber-row">
            <div className="sc-chamber-meta">
              <span className="sc-chamber-icon">{ch.icon}</span>
              <span className="sc-chamber-name">{ch.label}</span>
              <span className="sc-chamber-score" style={{ color: ch.color }}>{ch.score}%</span>
            </div>
            <div className="sc-chamber-bar">
              <div
                className="sc-chamber-fill"
                style={{ width: `${ch.score}%`, background: ch.color }}
              />
            </div>
            <p className="sc-chamber-note">{ch.narrative}</p>
          </div>
        ))}
      </div>

      {/* Composite narrative */}
      <div className="sc-narrative">
        <p>{narrative}</p>
      </div>

      {/* Destiny Storybook + Rituals */}
      <DestinyStorybookPanel storybook={storybook} rituals={rituals} />

      {/* Seasonal Transit Chapters — driven by composite chart transits */}
      {transitStory && transitStory.seasonalChapters.length > 0 && (
        <SeasonalChaptersPanel
          chapters={transitStory.seasonalChapters}
          totalBeats={transitStory.storyBeats.length}
        />
      )}

      {/* Export PDF button */}
      <div className="sc-export-section">
        <button type="button" className="sc-export-btn" onClick={handleExportPDF}>
          <span className="sc-export-icon">{'\u{1F4D6}'}</span>
          Export Storybook as PDF
        </button>
      </div>

      {/* Relationship Oracle */}
      <RelationshipOraclePanel oracleInput={oracleInput} />

      <style>{`
        .sc-container {
          color: #e5e7eb;
          margin-top: 16px;
        }

        /* Header */
        .sc-header {
          margin-bottom: 14px;
        }

        .sc-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .sc-title {
          font-size: 16px;
          font-weight: 700;
          color: #fbbf24;
          margin: 0;
        }

        .sc-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        .sc-overall-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(251, 191, 36, 0.35);
          border-radius: 10px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .sc-overall-score {
          font-size: 24px;
          font-weight: 800;
        }

        .sc-overall-sublabel {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .sc-score-bar {
          height: 5px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .sc-score-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, rgba(251, 191, 36, 0.5), #fbbf24);
          transition: width 0.5s ease;
        }

        .sc-composite-label {
          font-size: 12px;
          font-weight: 600;
        }

        /* Body layout */
        .sc-body {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .sc-radar-col {
          flex-shrink: 0;
        }

        .sc-path-col {
          flex: 1;
          min-width: 0;
        }

        /* Mythic Path */
        .sc-path-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(251, 191, 36, 0.06);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .sc-path-icon {
          font-size: 26px;
        }

        .sc-path-label {
          display: block;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
          font-weight: 600;
        }

        .sc-path-name {
          display: block;
          font-size: 15px;
          font-weight: 700;
          color: #fbbf24;
        }

        .sc-path-desc {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0 0 12px 0;
        }

        /* Composite Archetype */
        .sc-archetype-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin-bottom: 6px;
        }

        .sc-archetype-icon {
          font-size: 24px;
        }

        .sc-archetype-body {
          display: flex;
          flex-direction: column;
        }

        .sc-archetype-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
          font-weight: 600;
        }

        .sc-archetype-name {
          font-size: 15px;
          font-weight: 700;
        }

        .sc-archetype-desc {
          font-size: 11px;
          line-height: 1.6;
          color: #9ca3af;
          margin: 0 0 12px 0;
        }

        /* Relationship Map section */
        .sc-map-section {
          margin-bottom: 14px;
        }

        /* Destiny Curve + Chart sections */
        .sc-destiny-section,
        .sc-chart-section {
          margin-bottom: 14px;
        }

        .sc-section-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
          margin-bottom: 6px;
        }

        /* Chamber bars */
        .sc-chamber-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .sc-chamber-row {
        }

        .sc-chamber-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }

        .sc-chamber-icon {
          font-size: 13px;
          width: 18px;
          text-align: center;
        }

        .sc-chamber-name {
          font-size: 11px;
          font-weight: 600;
          color: #e5e7eb;
          flex: 1;
        }

        .sc-chamber-score {
          font-size: 12px;
          font-weight: 700;
        }

        .sc-chamber-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 2px;
        }

        .sc-chamber-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .sc-chamber-note {
          font-size: 10px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        /* Narrative */
        .sc-narrative {
          border-left: 3px solid rgba(251, 191, 36, 0.4);
          border-radius: 6px;
          padding: 10px 12px;
          background: rgba(251, 191, 36, 0.04);
        }

        .sc-narrative p {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
        }

        /* Export button */
        .sc-export-section {
          margin-top: 12px;
          margin-bottom: 6px;
          text-align: center;
        }

        .sc-export-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(167, 139, 250, 0.1);
          border: 1px solid rgba(167, 139, 250, 0.25);
          border-radius: 8px;
          color: #c4b5fd;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .sc-export-btn:hover {
          background: rgba(167, 139, 250, 0.2);
          border-color: rgba(167, 139, 250, 0.4);
        }

        .sc-export-icon {
          font-size: 16px;
        }

        /* Responsive: stack on narrow */
        @media (max-width: 540px) {
          .sc-body {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SynastryCompositePanel;
