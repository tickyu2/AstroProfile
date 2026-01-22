/**
 * DashaTimeline
 *
 * Horizontal timeline visualization of Vimshottari Mahadashas.
 * Shows planet rulers, date ranges, and current dasha highlighting.
 */

import { useState, useMemo } from 'react';
import './DashaTimeline.css';

// Dasha periods in years
const DASHA_YEARS = {
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
  Ketu: 7,
  Venus: 20
};

// Planet colors
const PLANET_COLORS = {
  Sun: { bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24', text: '#fbbf24' },
  Moon: { bg: 'rgba(226, 232, 240, 0.2)', border: '#e2e8f0', text: '#e2e8f0' },
  Mars: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#ef4444' },
  Rahu: { bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6', text: '#8b5cf6' },
  Jupiter: { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', text: '#f59e0b' },
  Saturn: { bg: 'rgba(99, 102, 241, 0.2)', border: '#6366f1', text: '#6366f1' },
  Mercury: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#22c55e' },
  Ketu: { bg: 'rgba(167, 139, 250, 0.2)', border: '#a78bfa', text: '#a78bfa' },
  Venus: { bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899', text: '#ec4899' }
};

// Planet icons
const PLANET_ICONS = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Rahu: '☊',
  Jupiter: '♃',
  Saturn: '♄',
  Mercury: '☿',
  Ketu: '☋',
  Venus: '♀'
};

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
};

// Calculate years between dates
const getYearsBetween = (start, end) => {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.round((endDate - startDate) / (365.25 * 24 * 60 * 60 * 1000));
  } catch {
    return 0;
  }
};

// Check if date is in range
const isCurrentPeriod = (start, end) => {
  try {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    return now >= startDate && now <= endDate;
  } catch {
    return false;
  }
};

// Dasha Block Component
function DashaBlock({ dasha, isCurrent, isHovered, onHover, totalWidth }) {
  const years = getYearsBetween(dasha.start, dasha.end);
  const colors = PLANET_COLORS[dasha.planet] || PLANET_COLORS.Saturn;
  const icon = PLANET_ICONS[dasha.planet] || '?';

  // Width proportional to years (120 years total cycle)
  const widthPercent = (years / 120) * 100;

  return (
    <div
      className={`dasha-block ${isCurrent ? 'current' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{
        width: `${Math.max(widthPercent, 8)}%`,
        background: colors.bg,
        borderColor: colors.border
      }}
      onMouseEnter={() => onHover(dasha)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="dasha-icon" style={{ color: colors.text }}>
        {icon}
      </div>
      <div className="dasha-planet" style={{ color: colors.text }}>
        {dasha.planet}
      </div>
      <div className="dasha-years">{years} yrs</div>
      <div className="dasha-range">
        {formatDate(dasha.start)} – {formatDate(dasha.end)}
      </div>

      {isCurrent && (
        <div className="current-marker">
          <span>NOW</span>
        </div>
      )}
    </div>
  );
}

// Antardasha (sub-period) component
function AntardashaList({ mahadasha, antardashas }) {
  if (!antardashas || antardashas.length === 0) return null;

  return (
    <div className="antardasha-container">
      <div className="antardasha-header">
        <span className="antardasha-title">
          Antardashas within {mahadasha.planet} Mahadasha
        </span>
      </div>
      <div className="antardasha-list">
        {antardashas.map((ad, idx) => {
          const colors = PLANET_COLORS[ad.planet] || PLANET_COLORS.Saturn;
          const isCurrent = isCurrentPeriod(ad.start, ad.end);

          return (
            <div
              key={idx}
              className={`antardasha-block ${isCurrent ? 'current' : ''}`}
              style={{
                background: colors.bg,
                borderColor: colors.border
              }}
            >
              <span className="ad-planet" style={{ color: colors.text }}>
                {PLANET_ICONS[ad.planet]} {ad.planet}
              </span>
              <span className="ad-dates">
                {formatDate(ad.start)} – {formatDate(ad.end)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashaTimeline({
  dashas,
  currentDasha,
  antardashas,
  showAntardashas = true,
  compact = false
}) {
  const [hoveredDasha, setHoveredDasha] = useState(null);

  // Find current dasha if not provided
  const activeDasha = useMemo(() => {
    if (currentDasha) return currentDasha;
    return dashas?.find(d => isCurrentPeriod(d.start, d.end));
  }, [dashas, currentDasha]);

  if (!dashas || dashas.length === 0) return null;

  return (
    <div className={`dasha-timeline-container ${compact ? 'compact' : ''}`}>
      {/* Header */}
      <div className="dasha-header">
        <div className="dasha-title">
          <span className="title-icon">🪐</span>
          <span className="title-text">Vimshottari Mahadasha Timeline</span>
        </div>
        {activeDasha && (
          <div className="current-dasha-badge">
            <span
              className="badge-dot"
              style={{ background: PLANET_COLORS[activeDasha.planet]?.border || '#a78bfa' }}
            />
            <span>Current: {activeDasha.planet}</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="dasha-timeline">
        {dashas.map((dasha, idx) => (
          <DashaBlock
            key={idx}
            dasha={dasha}
            isCurrent={activeDasha?.planet === dasha.planet && activeDasha?.start === dasha.start}
            isHovered={hoveredDasha?.planet === dasha.planet}
            onHover={setHoveredDasha}
          />
        ))}
      </div>

      {/* Hovered Dasha Details */}
      {hoveredDasha && (
        <div className="dasha-details">
          <div
            className="details-header"
            style={{
              borderColor: PLANET_COLORS[hoveredDasha.planet]?.border || '#a78bfa'
            }}
          >
            <span className="details-icon">
              {PLANET_ICONS[hoveredDasha.planet]}
            </span>
            <span className="details-planet">{hoveredDasha.planet} Mahadasha</span>
          </div>
          <div className="details-content">
            <div className="details-row">
              <span className="label">Period:</span>
              <span className="value">
                {formatDate(hoveredDasha.start)} – {formatDate(hoveredDasha.end)}
              </span>
            </div>
            <div className="details-row">
              <span className="label">Duration:</span>
              <span className="value">
                {DASHA_YEARS[hoveredDasha.planet] || getYearsBetween(hoveredDasha.start, hoveredDasha.end)} years
              </span>
            </div>
            {hoveredDasha.themes && (
              <div className="details-row">
                <span className="label">Themes:</span>
                <span className="value">{hoveredDasha.themes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Antardashas */}
      {showAntardashas && activeDasha && antardashas && (
        <AntardashaList mahadasha={activeDasha} antardashas={antardashas} />
      )}

      {/* Footer */}
      <div className="dasha-footer">
        <div className="footer-note">
          The Vimshottari Dasha system divides life into planetary periods totaling 120 years.
          Each Mahadasha activates the themes and karma associated with its ruling planet.
        </div>
      </div>
    </div>
  );
}
