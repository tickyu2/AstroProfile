/**
 * NakshatraWheel
 *
 * SVG circular wheel showing all 27 Nakshatras.
 * Highlights the user's Moon Nakshatra position.
 */

import { useState } from 'react';
import './NakshatraWheel.css';

const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras", element: "Fire" },
  { name: "Bharani", lord: "Venus", deity: "Yama", element: "Earth" },
  { name: "Krittika", lord: "Sun", deity: "Agni", element: "Fire" },
  { name: "Rohini", lord: "Moon", deity: "Brahma", element: "Earth" },
  { name: "Mrigashira", lord: "Mars", deity: "Soma", element: "Air" },
  { name: "Ardra", lord: "Rahu", deity: "Rudra", element: "Water" },
  { name: "Punarvasu", lord: "Jupiter", deity: "Aditi", element: "Air" },
  { name: "Pushya", lord: "Saturn", deity: "Brihaspati", element: "Water" },
  { name: "Ashlesha", lord: "Mercury", deity: "Nagas", element: "Water" },
  { name: "Magha", lord: "Ketu", deity: "Pitris", element: "Fire" },
  { name: "Purva Phalguni", lord: "Venus", deity: "Bhaga", element: "Fire" },
  { name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman", element: "Earth" },
  { name: "Hasta", lord: "Moon", deity: "Savitar", element: "Air" },
  { name: "Chitra", lord: "Mars", deity: "Vishwakarma", element: "Fire" },
  { name: "Swati", lord: "Rahu", deity: "Vayu", element: "Air" },
  { name: "Vishakha", lord: "Jupiter", deity: "Indra-Agni", element: "Fire" },
  { name: "Anuradha", lord: "Saturn", deity: "Mitra", element: "Water" },
  { name: "Jyeshtha", lord: "Mercury", deity: "Indra", element: "Air" },
  { name: "Mula", lord: "Ketu", deity: "Nirriti", element: "Fire" },
  { name: "Purva Ashadha", lord: "Venus", deity: "Apas", element: "Water" },
  { name: "Uttara Ashadha", lord: "Sun", deity: "Vishwadevas", element: "Earth" },
  { name: "Shravana", lord: "Moon", deity: "Vishnu", element: "Air" },
  { name: "Dhanishta", lord: "Mars", deity: "Vasus", element: "Air" },
  { name: "Shatabhisha", lord: "Rahu", deity: "Varuna", element: "Air" },
  { name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada", element: "Fire" },
  { name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahir Budhnya", element: "Water" },
  { name: "Revati", lord: "Mercury", deity: "Pushan", element: "Water" }
];

// Element colors
const ELEMENT_COLORS = {
  Fire: '#ef4444',
  Earth: '#84cc16',
  Air: '#06b6d4',
  Water: '#3b82f6'
};

// Lord colors
const LORD_COLORS = {
  Sun: '#fbbf24',
  Moon: '#e2e8f0',
  Mars: '#ef4444',
  Mercury: '#22c55e',
  Jupiter: '#f59e0b',
  Venus: '#ec4899',
  Saturn: '#6366f1',
  Rahu: '#8b5cf6',
  Ketu: '#a78bfa'
};

export default function NakshatraWheel({
  moonNakshatra,
  moonPada,
  sunNakshatra,
  ascendantNakshatra,
  showLabels = true,
  showPadas = true,
  size = 400
}) {
  const [hoveredNakshatra, setHoveredNakshatra] = useState(null);

  const center = size / 2;
  const outerRadius = (size / 2) - 20;
  const innerRadius = outerRadius - 60;
  const labelRadius = outerRadius - 30;

  // Calculate arc for each nakshatra (360 / 27 = 13.33 degrees each)
  const arcAngle = (2 * Math.PI) / 27;

  return (
    <div className="nakshatra-wheel-container">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="nakshatra-wheel"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="rgba(15, 23, 42, 0.8)"
          stroke="rgba(100, 116, 139, 0.3)"
          strokeWidth="1"
        />

        {/* Inner circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="rgba(30, 41, 59, 0.5)"
          stroke="rgba(100, 116, 139, 0.2)"
          strokeWidth="1"
        />

        {/* Nakshatra segments */}
        {NAKSHATRAS.map((nakshatra, i) => {
          const startAngle = (i * arcAngle) - (Math.PI / 2);
          const endAngle = startAngle + arcAngle;

          const isActive = nakshatra.name === moonNakshatra;
          const isSun = nakshatra.name === sunNakshatra;
          const isAsc = nakshatra.name === ascendantNakshatra;
          const isHovered = hoveredNakshatra === nakshatra.name;

          // Arc path
          const x1 = center + innerRadius * Math.cos(startAngle);
          const y1 = center + innerRadius * Math.sin(startAngle);
          const x2 = center + outerRadius * Math.cos(startAngle);
          const y2 = center + outerRadius * Math.sin(startAngle);
          const x3 = center + outerRadius * Math.cos(endAngle);
          const y3 = center + outerRadius * Math.sin(endAngle);
          const x4 = center + innerRadius * Math.cos(endAngle);
          const y4 = center + innerRadius * Math.sin(endAngle);

          const pathD = `
            M ${x1} ${y1}
            L ${x2} ${y2}
            A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
            L ${x4} ${y4}
            A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
          `;

          // Label position
          const midAngle = startAngle + arcAngle / 2;
          const labelX = center + labelRadius * Math.cos(midAngle);
          const labelY = center + labelRadius * Math.sin(midAngle);

          // Determine fill color
          let fillColor = 'rgba(51, 65, 85, 0.3)';
          let strokeColor = 'rgba(100, 116, 139, 0.3)';

          if (isActive) {
            fillColor = 'rgba(167, 139, 250, 0.4)';
            strokeColor = 'rgba(167, 139, 250, 0.8)';
          } else if (isSun) {
            fillColor = 'rgba(251, 191, 36, 0.3)';
            strokeColor = 'rgba(251, 191, 36, 0.6)';
          } else if (isAsc) {
            fillColor = 'rgba(34, 211, 238, 0.3)';
            strokeColor = 'rgba(34, 211, 238, 0.6)';
          } else if (isHovered) {
            fillColor = 'rgba(71, 85, 105, 0.5)';
            strokeColor = 'rgba(148, 163, 184, 0.5)';
          }

          return (
            <g
              key={nakshatra.name}
              onMouseEnter={() => setHoveredNakshatra(nakshatra.name)}
              onMouseLeave={() => setHoveredNakshatra(null)}
              className="nakshatra-segment"
            >
              <path
                d={pathD}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isActive || isHovered ? 2 : 1}
                className="nakshatra-arc"
              />

              {showLabels && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`nakshatra-label ${isActive ? 'active' : ''}`}
                  transform={`rotate(${(midAngle * 180 / Math.PI) + 90}, ${labelX}, ${labelY})`}
                  style={{
                    fontSize: isActive ? '9px' : '7px',
                    fill: isActive ? '#a78bfa' : 'rgba(255, 255, 255, 0.6)',
                    fontWeight: isActive ? '600' : '400'
                  }}
                >
                  {nakshatra.name}
                </text>
              )}

              {/* Planetary markers */}
              {isActive && (
                <circle
                  cx={center + (outerRadius + 10) * Math.cos(midAngle)}
                  cy={center + (outerRadius + 10) * Math.sin(midAngle)}
                  r={6}
                  fill="#a78bfa"
                  stroke="#1e1b4b"
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}

        {/* Center info */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 20}
          fill="rgba(15, 23, 42, 0.9)"
          stroke="rgba(100, 116, 139, 0.3)"
          strokeWidth="1"
        />

        {moonNakshatra && (
          <g className="center-info">
            <text
              x={center}
              y={center - 15}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.5)"
              fontSize="10"
            >
              Moon Nakshatra
            </text>
            <text
              x={center}
              y={center + 5}
              textAnchor="middle"
              fill="#a78bfa"
              fontSize="14"
              fontWeight="600"
            >
              {moonNakshatra}
            </text>
            {moonPada && (
              <text
                x={center}
                y={center + 22}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.4)"
                fontSize="10"
              >
                Pada {moonPada}
              </text>
            )}
          </g>
        )}
      </svg>

      {/* Hover tooltip */}
      {hoveredNakshatra && (
        <div className="nakshatra-tooltip">
          {(() => {
            const n = NAKSHATRAS.find(x => x.name === hoveredNakshatra);
            return n ? (
              <>
                <div className="tooltip-name">{n.name}</div>
                <div className="tooltip-details">
                  <span>Lord: {n.lord}</span>
                  <span>Deity: {n.deity}</span>
                  <span>Element: {n.element}</span>
                </div>
              </>
            ) : null;
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="nakshatra-legend">
        <div className="legend-item">
          <span className="legend-dot moon" />
          <span>Moon</span>
        </div>
        {sunNakshatra && (
          <div className="legend-item">
            <span className="legend-dot sun" />
            <span>Sun</span>
          </div>
        )}
        {ascendantNakshatra && (
          <div className="legend-item">
            <span className="legend-dot asc" />
            <span>Ascendant</span>
          </div>
        )}
      </div>
    </div>
  );
}
