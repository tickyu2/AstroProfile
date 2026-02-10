/**
 * Taurus Decan Overlay Component
 * Shows decan and zone analysis for a given degree
 */

import React from 'react';
import './TaurusDecanOverlay.css';

interface TaurusDecanOverlayProps {
  degree: number;
}

const DECAN_INFO = [
  { ruler: 'Venus', theme: 'Pure Taurean energy, sensory pleasure' },
  { ruler: 'Mercury', theme: 'Practical communication, skilled craftsmanship' },
  { ruler: 'Saturn', theme: 'Material mastery, enduring legacy' }
];

const ZONE_NAMES = [
  'The Seed',
  'The Builder',
  'The Artisan',
  'The Stabilizer',
  'The Loyal Nurturer',
  'The Empire Builder'
];

export const TaurusDecanOverlay: React.FC<TaurusDecanOverlayProps> = ({ degree }) => {
  const decan = degree < 10 ? 1 : degree < 20 ? 2 : 3;
  const zone = Math.floor(degree / 5) + 1;
  const decanInfo = DECAN_INFO[decan - 1];

  return (
    <div className="taurus-decan-overlay">
      <h3 className="overlay-title">Taurus Analysis</h3>
      <div className="overlay-degree">{degree.toFixed(2)}°</div>

      <div className="overlay-section">
        <div className="section-header">Decan {decan}</div>
        <div className="section-detail">
          <span className="detail-label">Ruler:</span>
          <span className="detail-value">{decanInfo.ruler}</span>
        </div>
        <div className="section-theme">{decanInfo.theme}</div>
      </div>

      <div className="overlay-section">
        <div className="section-header">Zone {zone}</div>
        <div className="section-name">{ZONE_NAMES[zone - 1]}</div>
      </div>
    </div>
  );
};

export default TaurusDecanOverlay;
