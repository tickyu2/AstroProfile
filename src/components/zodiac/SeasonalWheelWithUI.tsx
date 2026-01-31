/**
 * SeasonalWheelWithUI.tsx
 *
 * Container component that integrates the D3 TropicalZodiacWheel with the
 * PlanetSeasonPanel, bridging hover/click events from the wheel to the
 * React-based planet list and detail modal.
 *
 * Layout: Wheel (left/center) + Planet Panel (right sidebar)
 *
 * Usage:
 *   <SeasonalWheelWithUI
 *     planets={blendedPlanets}
 *     personName="Ticky"
 *     wheelProps={...}  // TropicalZodiacWheel props
 *   />
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo, useCallback } from 'react';
import { TropicalZodiacWheel, type TropicalZodiacWheelProps } from './TropicalZodiacWheel';
import { PlanetSeasonPanel, SeasonTooltip } from './PlanetSeasonPanel';
import type { BlendedPlanetPosition } from '../../zodiac/planetaryMatrices';
import { PLANET_ICONS, PLANET_LABELS } from '../../zodiac/planetaryMatrices';
import type { SignKey } from '../../zodiac/tropicalMap';
import type { ZodiacSign, Season } from '../../data/tropicalSeasons';

import './SeasonalWheelWithUI.css';

// =============================================================================
// TYPES
// =============================================================================

interface SeasonalWheelWithUIProps {
  /** Pre-computed blended planet positions (with seasonContext) */
  planets: BlendedPlanetPosition[];
  /** Person name displayed in the panel header */
  personName?: string;
  /** All props needed for TropicalZodiacWheel (passed through) */
  wheelProps: TropicalZodiacWheelProps;
  /** Optional second person's planets for comparison */
  planetsB?: BlendedPlanetPosition[];
  /** Second person's name */
  personNameB?: string;
  /** Show panel in compact mode */
  compact?: boolean;
}

// =============================================================================
// PLANET INDICATOR — Shows planet icons on the wheel at their sign positions
// =============================================================================

interface PlanetIndicatorProps {
  planet: BlendedPlanetPosition;
  highlighted: boolean;
  wheelCenter: { x: number; y: number };
  wheelRadius: number;
  signIndex: number;
}

/** Map sign names to their index in the tropical order (0-11) */
const SIGN_INDEX: Record<string, number> = {
  Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3,
  Leo: 4, Virgo: 5, Libra: 6, Scorpio: 7,
  Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11,
};

const PlanetIndicator: React.FC<PlanetIndicatorProps> = ({
  planet,
  highlighted,
  wheelCenter,
  wheelRadius,
  signIndex,
}) => {
  // Place planet icon on the outer edge of the sign ring
  // Each sign spans 30 degrees; place in the middle of the sign segment
  const angleDeg = (signIndex * 30) + 15 - 90; // -90 to start from top
  const angleRad = (angleDeg * Math.PI) / 180;
  const indicatorRadius = wheelRadius * 0.78; // Just inside the sign ring

  const x = wheelCenter.x + indicatorRadius * Math.cos(angleRad);
  const y = wheelCenter.y + indicatorRadius * Math.sin(angleRad);

  return (
    <div
      className={`planet-indicator ${highlighted ? 'planet-indicator-highlighted' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      title={`${PLANET_LABELS[planet.planet]} in ${planet.sign}`}
    >
      {PLANET_ICONS[planet.planet]}
    </div>
  );
};

// =============================================================================
// WHEEL PLANET OVERLAY — Renders planet indicators on top of the D3 wheel
// =============================================================================

interface WheelPlanetOverlayProps {
  planets: BlendedPlanetPosition[];
  highlightedSign: string | null;
  dimensions: { width: number; height: number };
}

const WheelPlanetOverlay: React.FC<WheelPlanetOverlayProps> = ({
  planets,
  highlightedSign,
  dimensions,
}) => {
  const wheelCenter = {
    x: dimensions.width / 2,
    y: dimensions.height / 2,
  };
  const wheelRadius = Math.min(dimensions.width, dimensions.height) / 2;

  // Stack multiple planets in the same sign with slight offset
  const signPlanetCounts: Record<string, number> = {};

  return (
    <div className="wheel-planet-overlay" style={{ width: dimensions.width, height: dimensions.height }}>
      {planets.map(planet => {
        const signIdx = SIGN_INDEX[planet.sign] ?? 0;
        const count = signPlanetCounts[planet.sign] || 0;
        signPlanetCounts[planet.sign] = count + 1;

        // Offset stacked planets slightly
        const stackOffset = count * 4;

        return (
          <PlanetIndicator
            key={planet.planet}
            planet={planet}
            highlighted={highlightedSign === planet.sign}
            wheelCenter={{ x: wheelCenter.x, y: wheelCenter.y + stackOffset }}
            wheelRadius={wheelRadius}
            signIndex={signIdx}
          />
        );
      })}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const SeasonalWheelWithUI: React.FC<SeasonalWheelWithUIProps> = ({
  planets,
  personName,
  wheelProps,
  planetsB,
  personNameB,
  compact = false,
}) => {
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<BlendedPlanetPosition | null>(null);

  // Bridge wheel sign hover to planet panel highlighting
  const handleWheelSignHover = useCallback((sign: string | null) => {
    setHoveredSign(sign);
    wheelProps.onHoverSign(sign);
  }, [wheelProps.onHoverSign]);

  // Bridge panel planet hover to wheel sign highlighting
  const handlePanelPlanetHover = useCallback((planet: BlendedPlanetPosition | null) => {
    setHoveredPlanet(planet);
    if (planet) {
      setHoveredSign(planet.sign);
    } else {
      setHoveredSign(null);
    }
  }, []);

  // Planet click in panel: could trigger sign selection on wheel
  const handlePanelPlanetClick = useCallback((planet: BlendedPlanetPosition) => {
    wheelProps.onSignClick(planet.sign as ZodiacSign);
  }, [wheelProps.onSignClick]);

  // Find planets in currently hovered sign (for wheel-to-panel bridge)
  const planetsInHoveredSign = useMemo(() => {
    if (!hoveredSign) return [];
    return planets.filter(p => p.sign === hoveredSign);
  }, [hoveredSign, planets]);

  return (
    <div className="seasonal-wheel-ui-container">
      {/* Wheel area */}
      <div className="wheel-area">
        <div className="wheel-wrapper" style={{ position: 'relative' }}>
          <TropicalZodiacWheel
            {...wheelProps}
            onHoverSign={handleWheelSignHover}
          />

          {/* Planet indicators overlaid on the wheel */}
          {planets.length > 0 && (
            <WheelPlanetOverlay
              planets={planets}
              highlightedSign={hoveredSign}
              dimensions={wheelProps.dimensions}
            />
          )}
        </div>

        {/* Hovered sign planet summary (appears below the wheel) */}
        {planetsInHoveredSign.length > 0 && (
          <div className="wheel-hover-summary">
            <span className="hover-summary-label">
              Planets in {hoveredSign}:
            </span>
            {planetsInHoveredSign.map(p => (
              <span key={p.planet} className="hover-summary-planet">
                {PLANET_ICONS[p.planet]} {PLANET_LABELS[p.planet]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Planet Season Panel (sidebar) */}
      <div className="panel-sidebar">
        <PlanetSeasonPanel
          planets={planets}
          personName={personName}
          onPlanetHover={handlePanelPlanetHover}
          onPlanetClick={handlePanelPlanetClick}
          compact={compact}
        />

        {/* Optional second person */}
        {planetsB && planetsB.length > 0 && (
          <PlanetSeasonPanel
            planets={planetsB}
            personName={personNameB}
            onPlanetHover={handlePanelPlanetHover}
            compact={compact}
          />
        )}
      </div>
    </div>
  );
};

export default SeasonalWheelWithUI;
