/**
 * Season Legend Component
 * Visual explanation of the three concentric rings
 */

import React from 'react';
import './SeasonLegend.css';

interface SeasonLegendProps {
  colors?: {
    season: string;
    modality: string;
    element: string;
  };
  className?: string;
}

export const SeasonLegend: React.FC<SeasonLegendProps> = ({
  colors = {
    season: "#90EE90",
    modality: "#FF6B6B",
    element: "#FF4500"
  },
  className = ""
}) => {
  return (
    <div className={`season-legend ${className}`}>
      <div className="legend-title">Ring System</div>

      <div className="legend-item">
        <div
          className="legend-color-box"
          style={{ background: colors.season }}
        />
        <div className="legend-text">
          <strong>Season Ring (Outer)</strong>
          <span>Environmental imprint from birth season</span>
          <span className="legend-values">Spring · Summer · Autumn · Winter</span>
        </div>
      </div>

      <div className="legend-item">
        <div
          className="legend-color-box"
          style={{ background: colors.modality }}
        />
        <div className="legend-text">
          <strong>Modality Ring (Middle)</strong>
          <span>Circadian momentum style</span>
          <span className="legend-values">Cardinal · Fixed · Mutable</span>
        </div>
      </div>

      <div className="legend-item">
        <div
          className="legend-color-box"
          style={{ background: colors.element }}
        />
        <div className="legend-text">
          <strong>Element Ring (Inner)</strong>
          <span>Constitutional temperament</span>
          <span className="legend-values">Fire · Earth · Air · Water</span>
        </div>
      </div>

      <div className="legend-note">
        Each zodiac sign is an intersection of these three rings
      </div>
    </div>
  );
};

export default SeasonLegend;
