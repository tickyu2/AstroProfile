/**
 * Taurus Zoom Strip Component
 *
 * Horizontal 0-30° visualization with:
 * - Exact degree marker
 * - Clickable/draggable interface
 * - Decan and zone indicators
 * - Bidirectional sync with main wheel
 */

import React, { useRef, useState, useEffect } from 'react';
import './TaurusZoomStrip.css';

interface TaurusZoomStripProps {
  degree: number; // 0-30 within Taurus
  onDegreeChange?: (degree: number) => void;
  animated?: boolean;
}

const DECAN_BOUNDARIES = [0, 10, 20, 30];
const ZONE_BOUNDARIES = [0, 5, 10, 15, 20, 25, 30];

const ZONE_NAMES = [
  'The Seed',
  'The Builder',
  'The Artisan',
  'The Stabilizer',
  'The Loyal Nurturer',
  'The Empire Builder'
];

export const TaurusZoomStrip: React.FC<TaurusZoomStripProps> = ({
  degree,
  onDegreeChange,
  animated = true
}) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayDegree, setDisplayDegree] = useState(degree);

  // Smooth animation for degree changes
  useEffect(() => {
    if (!animated) {
      setDisplayDegree(degree);
      return;
    }

    let animationFrame: number;
    const animate = () => {
      setDisplayDegree(prev => {
        const diff = degree - prev;
        if (Math.abs(diff) < 0.01) return degree;
        return prev + diff * 0.15;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [degree, animated]);

  const decan = displayDegree < 10 ? 1 : displayDegree < 20 ? 2 : 3;
  const zone = Math.floor(displayDegree / 5);
  const percentage = (displayDegree / 30) * 100;

  const handleInteraction = (clientX: number) => {
    if (!stripRef.current || !onDegreeChange) return;

    const rect = stripRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newDegree = (x / rect.width) * 30;
    onDegreeChange(Math.max(0, Math.min(30, newDegree)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleInteraction(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      handleInteraction(e.clientX);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleInteraction(e.clientX);
      };

      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove as EventListener);

      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('mousemove', handleGlobalMouseMove as EventListener);
      };
    }
  }, [isDragging]);

  return (
    <div className="taurus-zoom-strip">
      <div className="strip-header">
        <div className="strip-title">Taurus Spectrum Explorer</div>
        <div className="strip-degree-display">
          {displayDegree.toFixed(2)}° Taurus
        </div>
      </div>

      <div className="strip-labels">
        <span className="strip-label-start">0° Taurus</span>
        <span className="strip-label-end">30° Gemini</span>
      </div>

      <div
        ref={stripRef}
        className={`strip-bar ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        {/* Zone dividers */}
        {ZONE_BOUNDARIES.slice(1, -1).map((zoneDeg, idx) => (
          <div
            key={idx}
            className="zone-divider"
            style={{ left: `${(zoneDeg / 30) * 100}%` }}
          >
            <div className="zone-divider-line" />
            <div className="zone-label">{zoneDeg}°</div>
          </div>
        ))}

        {/* Decan dividers */}
        {DECAN_BOUNDARIES.slice(1, -1).map((decanDeg, idx) => (
          <div
            key={`decan-${idx}`}
            className="decan-divider"
            style={{ left: `${(decanDeg / 30) * 100}%` }}
          >
            <div className="decan-divider-line" />
            <div className="decan-label">Decan {idx + 2}</div>
          </div>
        ))}

        {/* Progress fill */}
        <div
          className="strip-fill"
          style={{ width: `${percentage}%` }}
        />

        {/* Current degree marker */}
        <div
          className="strip-marker"
          style={{ left: `${percentage}%` }}
        >
          <div className="marker-line" />
          <div className="marker-dot" />
          <div className="marker-handle" />
        </div>
      </div>

      <div className="strip-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Decan:</span>
          <span className="metadata-value">{decan}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Zone:</span>
          <span className="metadata-value">{zone + 1} - {ZONE_NAMES[zone]}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Phase:</span>
          <span className="metadata-value">
            {displayDegree < 10 ? 'Early' : displayDegree < 20 ? 'Middle' : 'Late'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaurusZoomStrip;
