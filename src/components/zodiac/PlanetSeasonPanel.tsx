/**
 * PlanetSeasonPanel.tsx
 *
 * Displays planet positions with seasonal phase + cusp blend context.
 * Three integrated sub-components:
 *   - PlanetList: Scrollable list of planets with sign, season, and cusp info
 *   - SeasonTooltip: Hover tooltip showing seasonal phase + cusp blend
 *   - PlanetDetailModal: Full mythic detail modal with 4 sections
 *
 * Consumes BlendedPlanetPosition[] from planetaryMatrices.ts
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo } from 'react';
import type { BlendedPlanetPosition, Planet } from '../../zodiac/planetaryMatrices';
import { PLANET_ICONS, PLANET_LABELS } from '../../zodiac/planetaryMatrices';
import { ELEMENT_COLORS } from '../../data/tropicalSeasons';
import { SIGN_GLYPHS } from '../../data/tropicalConstants';
import type { SignContext, SeasonPhase } from '../../zodiac/cusp/resolveSignContext';
import { getPhaseLabel, getSeasonalMoment } from '../../zodiac/cusp/resolveSignContext';
import { buildCuspExplanation, buildCuspLabel } from '../../zodiac/cusp/signVectors';
import { SIGN_LESSONS } from '../../zodiac/tropicalMap';
import {
  getSynastryPreviewForPlanet,
  describePlanetAspect,
  type AllMatrices,
  type SynastryPreviewEntry,
} from '../../zodiac/synastryPreview';

import './PlanetSeasonPanel.css';

// =============================================================================
// CONSTANTS
// =============================================================================

const SEASON_COLORS: Record<string, string> = {
  Spring: '#22c55e',
  Summer: '#f59e0b',
  Autumn: '#ef4444',
  Winter: '#60a5fa',
};

const PHASE_ICONS: Record<SeasonPhase, string> = {
  Begin: '\u2728',   // Spark ✨
  Core: '\u{1F525}', // Fuel 🔥
  End: '\u{1F32C}',  // Smoke 🌬️
};

/** Color scale for synastry preview harmony scores */
function getPreviewHarmonyColor(score: number): string {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#84cc16';
  if (score >= 5) return '#eab308';
  if (score >= 4) return '#f97316';
  return '#ef4444';
}

// =============================================================================
// TYPES
// =============================================================================

/** Highlight state: which planet pair is currently highlighted in the matrices */
export interface MatrixHighlight {
  planetA: string | null;
  planetB: string | null;
}

interface PlanetSeasonPanelProps {
  planets: BlendedPlanetPosition[];
  personName?: string;
  onPlanetClick?: (planet: BlendedPlanetPosition) => void;
  onPlanetHover?: (planet: BlendedPlanetPosition | null) => void;
  /** All 5 matrices — enables synastry previews in the detail modal */
  matrices?: AllMatrices;
  /** Callback to highlight a planet pair in the matrix grids */
  onHighlight?: (highlight: MatrixHighlight) => void;
  compact?: boolean;
}

// =============================================================================
// SEASON TOOLTIP — Hover overlay for a planet row
// =============================================================================

interface SeasonTooltipProps {
  planet: BlendedPlanetPosition;
  visible: boolean;
}

const SeasonTooltip: React.FC<SeasonTooltipProps> = ({ planet, visible }) => {
  if (!visible || !planet.seasonContext) return null;

  const ctx = planet.seasonContext;
  const lesson = SIGN_LESSONS[planet.sign];
  const seasonColor = SEASON_COLORS[ctx.season] || '#94a3b8';
  const elementColor = ELEMENT_COLORS[lesson.element] || '#e5e7eb';

  return (
    <div className="planet-season-tooltip" style={{ opacity: visible ? 1 : 0 }}>
      {/* Season + Phase header */}
      <div className="tooltip-season-header" style={{ borderLeftColor: seasonColor }}>
        <span className="tooltip-season-name" style={{ color: seasonColor }}>
          {ctx.season}
        </span>
        <span className="tooltip-phase-badge">
          {PHASE_ICONS[ctx.phase]} {getPhaseLabel(ctx.phase)}
        </span>
      </div>

      {/* Seasonal moment */}
      <p className="tooltip-moment">
        {getSeasonalMoment(ctx.season, ctx.phase)}
      </p>

      {/* Element + Modality */}
      <div className="tooltip-meta-row">
        <span className="tooltip-element" style={{ color: elementColor }}>
          {lesson.element}
        </span>
        <span className="tooltip-modality">
          {lesson.modality}
        </span>
        <span className="tooltip-day-count">
          Day {ctx.dayInSeason} of {ctx.season}
        </span>
      </div>

      {/* Cusp info (if neighbor exists) */}
      {ctx.neighborName && (
        <div className="tooltip-cusp-info">
          <span className="tooltip-cusp-label">Cusp neighbor:</span>
          <span className="tooltip-cusp-sign">
            {SIGN_GLYPHS[ctx.neighborName]} {ctx.neighborName}
          </span>
          <span className="tooltip-cusp-days">
            ({ctx.daysAfterStart <= 7 ? `${ctx.daysAfterStart}d after ingress` : `${ctx.daysBeforeEnd}d before exit`})
          </span>
        </div>
      )}

      {/* Cusp blend description */}
      {planet.blendedSign.neighbor && (
        <p className="tooltip-blend-desc">
          {buildCuspExplanation(PLANET_LABELS[planet.planet], planet.blendedSign)}
        </p>
      )}
    </div>
  );
};

// =============================================================================
// PLANET DETAIL MODAL — Full mythic detail for a single planet
// =============================================================================

interface PlanetDetailModalProps {
  planet: BlendedPlanetPosition;
  onClose: () => void;
  /** Synastry preview entries for this planet (from getSynastryPreviewForPlanet) */
  synastryPreview?: SynastryPreviewEntry[];
  /** Callback when user clicks a synastry preview row — highlights the pair in matrices */
  onHighlight?: (planetA: string, planetB: string) => void;
}

const PlanetDetailModal: React.FC<PlanetDetailModalProps> = ({
  planet,
  onClose,
  synastryPreview,
  onHighlight,
}) => {
  const lesson = SIGN_LESSONS[planet.sign];
  const ctx = planet.seasonContext;
  const blend = planet.blendedSign;
  const elementColor = ELEMENT_COLORS[lesson.element] || '#e5e7eb';
  const seasonColor = ctx ? SEASON_COLORS[ctx.season] || '#94a3b8' : '#94a3b8';

  return (
    <div className="planet-detail-overlay" onClick={onClose}>
      <div className="planet-detail-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-planet-icon" style={{ color: elementColor }}>
            {PLANET_ICONS[planet.planet]}
          </div>
          <div className="modal-header-text">
            <h2>{PLANET_LABELS[planet.planet]} in {planet.sign}</h2>
            <span className="modal-subtitle" style={{ color: elementColor }}>
              {lesson.element} {lesson.symbol} {lesson.modality}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>

        {/* Section 1: Sign Character */}
        <div className="modal-section">
          <h3 className="modal-section-title">Sign Character</h3>
          <p className="modal-mantra" style={{ color: elementColor }}>
            {lesson.shortMantra}
          </p>
          <p className="modal-text">
            {lesson.academyBox.seasonalMeaning}
          </p>
          <p className="modal-text modal-energy">
            {lesson.academyBox.energyFlow}
          </p>
        </div>

        {/* Section 2: Seasonal Phase */}
        {ctx && (
          <div className="modal-section" style={{ borderLeftColor: seasonColor }}>
            <h3 className="modal-section-title">Seasonal Phase</h3>
            <div className="modal-season-badge" style={{ background: `${seasonColor}22`, color: seasonColor }}>
              {ctx.season} {PHASE_ICONS[ctx.phase]} {getPhaseLabel(ctx.phase)}
            </div>
            <p className="modal-text">
              {getSeasonalMoment(ctx.season, ctx.phase)}
            </p>
            <div className="modal-season-progress">
              <span className="modal-progress-label">Day {ctx.dayInSeason} of ~90</span>
              <div className="modal-progress-bar">
                <div
                  className="modal-progress-fill"
                  style={{
                    width: `${Math.min(100, (ctx.dayInSeason / 90) * 100)}%`,
                    background: seasonColor,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Cusp Blend */}
        {blend.neighbor && (
          <div className="modal-section modal-cusp-section">
            <h3 className="modal-section-title">Cusp Blend</h3>
            <div className="modal-blend-label">
              {buildCuspLabel(blend)}
            </div>
            <p className="modal-text">
              {buildCuspExplanation(PLANET_LABELS[planet.planet], blend)}
            </p>
            <div className="modal-vector-display">
              <div className="vector-row">
                <span className="vector-label">Element</span>
                <div className="vector-bar-group">
                  {(['Fire', 'Earth', 'Air', 'Water'] as const).map((el, i) => (
                    <div
                      key={el}
                      className="vector-bar"
                      style={{
                        width: `${Math.max(2, blend.elementVector[i] * 100)}%`,
                        background: ELEMENT_COLORS[el],
                        opacity: blend.elementVector[i] > 0 ? 1 : 0.15,
                      }}
                      title={`${el}: ${(blend.elementVector[i] * 100).toFixed(1)}%`}
                    >
                      {blend.elementVector[i] > 0.15 && (
                        <span className="vector-bar-text">{el}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="vector-row">
                <span className="vector-label">Modality</span>
                <div className="vector-bar-group">
                  {(['Cardinal', 'Fixed', 'Mutable'] as const).map((mod, i) => (
                    <div
                      key={mod}
                      className="vector-bar vector-bar-modality"
                      style={{
                        width: `${Math.max(2, blend.modalityVector[i] * 100)}%`,
                        opacity: blend.modalityVector[i] > 0 ? 1 : 0.15,
                      }}
                      title={`${mod}: ${(blend.modalityVector[i] * 100).toFixed(1)}%`}
                    >
                      {blend.modalityVector[i] > 0.15 && (
                        <span className="vector-bar-text">{mod}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Synastry Preview */}
        {synastryPreview && synastryPreview.length > 0 && (
          <div className="modal-section modal-synastry-section">
            <h3 className="modal-section-title">Synastry Preview</h3>
            <div className="synastry-preview-list">
              {synastryPreview.map((p, i) => {
                const harmonyColor = getPreviewHarmonyColor(p.harmony);
                const narrative = describePlanetAspect(p.planet1, p.planet2, p.angle);
                return (
                  <button
                    type="button"
                    key={i}
                    className="synastry-preview-row"
                    onClick={() => onHighlight?.(p.planet1, p.planet2)}
                    title={narrative.summary}
                  >
                    <div className="synastry-preview-left">
                      <span className="synastry-preview-pair">
                        {PLANET_ICONS[p.planet1 as Planet]} {p.planet1}
                        {' \u2192 '}
                        {PLANET_ICONS[p.planet2 as Planet]} {p.planet2}
                      </span>
                      <span className="synastry-preview-matrix">
                        {p.matrixLabel}
                      </span>
                    </div>
                    <div className="synastry-preview-right">
                      <span
                        className="synastry-preview-harmony"
                        style={{ color: harmonyColor }}
                      >
                        {p.harmony}
                      </span>
                      <span className="synastry-preview-label">harmony</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* No synastry data message */}
        {synastryPreview && synastryPreview.length === 0 && (
          <div className="modal-section">
            <h3 className="modal-section-title">Synastry Preview</h3>
            <p className="modal-text" style={{ color: '#64748b' }}>
              No synastry interactions available for this planet.
            </p>
          </div>
        )}

        {/* Section 5: Takeaway */}
        <div className="modal-section modal-takeaway">
          <h3 className="modal-section-title">Takeaway</h3>
          <p className="modal-text modal-takeaway-text">
            {lesson.academyBox.beginnerTakeaway}
          </p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// PLANET LIST — Main scrollable list of planets
// =============================================================================

interface PlanetRowProps {
  planet: BlendedPlanetPosition;
  onHover: (planet: BlendedPlanetPosition | null) => void;
  onClick: (planet: BlendedPlanetPosition) => void;
  compact: boolean;
}

const PlanetRow: React.FC<PlanetRowProps> = ({ planet, onHover, onClick, compact }) => {
  const [hovered, setHovered] = useState(false);
  const lesson = SIGN_LESSONS[planet.sign];
  const elementColor = ELEMENT_COLORS[lesson.element] || '#e5e7eb';
  const ctx = planet.seasonContext;
  const blend = planet.blendedSign;

  const handleMouseEnter = () => {
    setHovered(true);
    onHover(planet);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onHover(null);
  };

  return (
    <div
      className={`planet-row ${hovered ? 'planet-row-hovered' : ''} ${compact ? 'planet-row-compact' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(planet)}
    >
      {/* Planet icon + name */}
      <div className="planet-row-left">
        <span className="planet-icon" style={{ color: elementColor }}>
          {PLANET_ICONS[planet.planet]}
        </span>
        <span className="planet-name">{PLANET_LABELS[planet.planet]}</span>
      </div>

      {/* Sign info */}
      <div className="planet-row-center">
        <span className="planet-sign-glyph" style={{ color: elementColor }}>
          {SIGN_GLYPHS[planet.sign]}
        </span>
        <span className="planet-sign-name">{planet.sign}</span>
        {blend.neighbor && (
          <span className="planet-cusp-badge">
            {Math.round(blend.primaryWeight * 100)}% / {blend.neighbor} {Math.round(blend.neighborWeight * 100)}%
          </span>
        )}
      </div>

      {/* Season info (right side) */}
      {ctx && !compact && (
        <div className="planet-row-right">
          <span
            className="planet-season-chip"
            style={{ background: `${SEASON_COLORS[ctx.season]}22`, color: SEASON_COLORS[ctx.season] }}
          >
            {ctx.season}
          </span>
          <span className="planet-phase-label">
            {ctx.phase}
          </span>
        </div>
      )}

      {/* Hover tooltip */}
      <SeasonTooltip planet={planet} visible={hovered} />
    </div>
  );
};

// =============================================================================
// MAIN PANEL COMPONENT
// =============================================================================

export const PlanetSeasonPanel: React.FC<PlanetSeasonPanelProps> = ({
  planets,
  personName,
  onPlanetClick,
  onPlanetHover,
  matrices,
  onHighlight,
  compact = false,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<BlendedPlanetPosition | null>(null);

  // Compute synastry previews for the selected planet
  const synastryPreview = useMemo(() => {
    if (!selectedPlanet || !matrices) return undefined;
    return getSynastryPreviewForPlanet(selectedPlanet.planet, matrices);
  }, [selectedPlanet, matrices]);

  const handleClick = (planet: BlendedPlanetPosition) => {
    setSelectedPlanet(planet);
    onPlanetClick?.(planet);
  };

  const handleHover = (planet: BlendedPlanetPosition | null) => {
    onPlanetHover?.(planet);
  };

  const handleHighlight = (planetA: string, planetB: string) => {
    onHighlight?.({ planetA, planetB });
  };

  const handleModalClose = () => {
    setSelectedPlanet(null);
    // Clear highlights when modal closes
    onHighlight?.({ planetA: null, planetB: null });
  };

  // Group planets by category
  const personalPlanets = planets.filter(p =>
    ['Sun', 'Moon', 'Rising'].includes(p.planet)
  );
  const socialPlanets = planets.filter(p =>
    ['Venus', 'Mars', 'Mercury'].includes(p.planet)
  );
  const outerPlanets = planets.filter(p =>
    ['Jupiter', 'Saturn'].includes(p.planet)
  );
  const transpersonalPlanets = planets.filter(p =>
    ['Uranus', 'Neptune', 'Pluto'].includes(p.planet)
  );

  const renderGroup = (label: string, group: BlendedPlanetPosition[]) => {
    if (group.length === 0) return null;
    return (
      <div className="planet-group">
        <div className="planet-group-label">{label}</div>
        {group.map(p => (
          <PlanetRow
            key={p.planet}
            planet={p}
            onHover={handleHover}
            onClick={handleClick}
            compact={compact}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="planet-season-panel">
      {personName && (
        <div className="planet-panel-header">
          <h3>{personName}</h3>
          <span className="planet-count">{planets.length} planets</span>
        </div>
      )}

      <div className="planet-list-scroll">
        {renderGroup('Identity', personalPlanets)}
        {renderGroup('Social', socialPlanets)}
        {renderGroup('Growth', outerPlanets)}
        {renderGroup('Transpersonal', transpersonalPlanets)}
      </div>

      {/* Detail Modal */}
      {selectedPlanet && (
        <PlanetDetailModal
          planet={selectedPlanet}
          onClose={handleModalClose}
          synastryPreview={synastryPreview}
          onHighlight={handleHighlight}
        />
      )}
    </div>
  );
};

export { SeasonTooltip, PlanetDetailModal, type MatrixHighlight };
export default PlanetSeasonPanel;
