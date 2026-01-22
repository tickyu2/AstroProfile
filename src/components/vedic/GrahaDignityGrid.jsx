/**
 * GrahaDignityGrid
 *
 * Grid display showing all 9 Vedic grahas with their signs and dignities.
 * Color-coded by dignity level (exalted, own, friend, enemy, debilitated).
 */

import { useState } from 'react';
import './GrahaDignityGrid.css';

// Graha data
const GRAHA_INFO = {
  Sun: { icon: '☉', sanskrit: 'Surya', nature: 'Sattvic', element: 'Fire' },
  Moon: { icon: '☽', sanskrit: 'Chandra', nature: 'Sattvic', element: 'Water' },
  Mars: { icon: '♂', sanskrit: 'Mangala', nature: 'Tamasic', element: 'Fire' },
  Mercury: { icon: '☿', sanskrit: 'Budha', nature: 'Rajasic', element: 'Earth' },
  Jupiter: { icon: '♃', sanskrit: 'Guru', nature: 'Sattvic', element: 'Ether' },
  Venus: { icon: '♀', sanskrit: 'Shukra', nature: 'Rajasic', element: 'Water' },
  Saturn: { icon: '♄', sanskrit: 'Shani', nature: 'Tamasic', element: 'Air' },
  Rahu: { icon: '☊', sanskrit: 'Rahu', nature: 'Tamasic', element: 'Air' },
  Ketu: { icon: '☋', sanskrit: 'Ketu', nature: 'Tamasic', element: 'Fire' }
};

// Dignity styles
const DIGNITY_STYLES = {
  exalted: {
    bg: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
    border: '#fbbf24',
    text: '#fbbf24',
    label: 'Exalted',
    description: 'Maximum strength, gifts flow easily'
  },
  own: {
    bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
    border: '#22c55e',
    text: '#22c55e',
    label: 'Own Sign',
    description: 'At home, natural and reliable'
  },
  moolatrikona: {
    bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
    border: '#3b82f6',
    text: '#3b82f6',
    label: 'Moolatrikona',
    description: 'Strong, auspicious placement'
  },
  friend: {
    bg: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(6, 182, 212, 0.15))',
    border: '#22d3ee',
    text: '#22d3ee',
    label: 'Friend',
    description: 'Supported, comfortable expression'
  },
  neutral: {
    bg: 'rgba(100, 116, 139, 0.15)',
    border: 'rgba(148, 163, 184, 0.5)',
    text: 'rgba(255, 255, 255, 0.7)',
    label: 'Neutral',
    description: 'Balanced, ordinary function'
  },
  enemy: {
    bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.2))',
    border: '#f97316',
    text: '#f97316',
    label: 'Enemy',
    description: 'Challenged, requires conscious effort'
  },
  debilitated: {
    bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
    border: '#ef4444',
    text: '#ef4444',
    label: 'Debilitated',
    description: 'Weakest position, hidden potential'
  }
};

// Graha Row Component
function GrahaRow({ graha, isExpanded, onToggle }) {
  const info = GRAHA_INFO[graha.name] || {};
  const dignityStyle = DIGNITY_STYLES[graha.dignity?.toLowerCase()] || DIGNITY_STYLES.neutral;

  return (
    <div className={`graha-row ${isExpanded ? 'expanded' : ''}`}>
      <div
        className="graha-main"
        style={{
          background: dignityStyle.bg,
          borderColor: dignityStyle.border
        }}
        onClick={onToggle}
      >
        {/* Icon */}
        <div className="graha-icon" style={{ color: dignityStyle.text }}>
          {info.icon}
        </div>

        {/* Name */}
        <div className="graha-name">
          <div className="name-english">{graha.name}</div>
          <div className="name-sanskrit">{info.sanskrit}</div>
        </div>

        {/* Sign */}
        <div className="graha-sign">
          <div className="sign-name">{graha.sign}</div>
          {graha.degree !== undefined && (
            <div className="sign-degree">{graha.degree.toFixed(1)}°</div>
          )}
        </div>

        {/* Nakshatra */}
        {graha.nakshatra && (
          <div className="graha-nakshatra">
            <div className="nakshatra-name">{graha.nakshatra}</div>
            {graha.pada && <div className="nakshatra-pada">Pada {graha.pada}</div>}
          </div>
        )}

        {/* Dignity */}
        <div className="graha-dignity">
          <span
            className="dignity-badge"
            style={{
              background: `${dignityStyle.border}20`,
              color: dignityStyle.text,
              borderColor: dignityStyle.border
            }}
          >
            {dignityStyle.label}
          </span>
        </div>

        {/* House */}
        {graha.house && (
          <div className="graha-house">
            <div className="house-number">{graha.house}</div>
            <div className="house-label">House</div>
          </div>
        )}

        {/* Expand indicator */}
        <div className="expand-indicator">
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="graha-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Nature</span>
              <span className="detail-value">{info.nature}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Element</span>
              <span className="detail-value">{info.element}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Dignity</span>
              <span className="detail-value">{dignityStyle.description}</span>
            </div>
            {graha.retrograde && (
              <div className="detail-item retrograde">
                <span className="detail-label">Status</span>
                <span className="detail-value">Retrograde ℞</span>
              </div>
            )}
            {graha.combust && (
              <div className="detail-item combust">
                <span className="detail-label">Condition</span>
                <span className="detail-value">Combust</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrahaDignityGrid({
  grahas,
  showNakshatras = true,
  showHouses = true,
  compact = false
}) {
  const [expandedGraha, setExpandedGraha] = useState(null);

  if (!grahas || grahas.length === 0) return null;

  // Calculate dignity distribution
  const dignityCount = grahas.reduce((acc, g) => {
    const d = g.dignity?.toLowerCase() || 'neutral';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`graha-dignity-grid ${compact ? 'compact' : ''}`}>
      {/* Header */}
      <div className="grid-header">
        <div className="header-title">
          <span className="title-icon">🪐</span>
          <span className="title-text">Graha Dignity Grid</span>
        </div>

        {/* Dignity summary */}
        <div className="dignity-summary">
          {Object.entries(DIGNITY_STYLES).map(([key, style]) => {
            const count = dignityCount[key] || 0;
            if (count === 0) return null;
            return (
              <div key={key} className="summary-item">
                <span
                  className="summary-dot"
                  style={{ background: style.border }}
                />
                <span className="summary-count">{count}</span>
                <span className="summary-label">{style.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column Headers */}
      <div className="column-headers">
        <div className="col-header col-icon" />
        <div className="col-header col-name">Graha</div>
        <div className="col-header col-sign">Sign</div>
        {showNakshatras && <div className="col-header col-nakshatra">Nakshatra</div>}
        <div className="col-header col-dignity">Dignity</div>
        {showHouses && <div className="col-header col-house">House</div>}
        <div className="col-header col-expand" />
      </div>

      {/* Graha Rows */}
      <div className="grahas-list">
        {grahas.map((graha) => (
          <GrahaRow
            key={graha.name}
            graha={graha}
            isExpanded={expandedGraha === graha.name}
            onToggle={() => setExpandedGraha(
              expandedGraha === graha.name ? null : graha.name
            )}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="dignity-legend">
        <div className="legend-title">Dignity Scale</div>
        <div className="legend-items">
          {Object.entries(DIGNITY_STYLES).map(([key, style]) => (
            <div key={key} className="legend-item">
              <span
                className="legend-color"
                style={{ background: style.border }}
              />
              <span className="legend-label">{style.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
