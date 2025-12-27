/**
 * Momentum Scroll Control
 * =======================
 * Seesaw-style time navigation for voice transcript history.
 *
 * Interaction:
 * - Click near center = 1 minute increments (fine adjustment)
 * - Click further out = 5 minute increments (fast navigation)
 * - Visual feedback shows current position
 *
 * Part of GENESIS OS - Voice Mode Enhancement
 * Created: December 26, 2024
 */

import React, { useState, useRef, useCallback } from 'react';

/**
 * Calculate navigation magnitude based on click position
 * Center = 1 min, edges = 5 min
 */
function calculateMagnitude(clickX, containerWidth) {
  const center = containerWidth / 2;
  const distanceFromCenter = Math.abs(clickX - center);
  const normalizedDistance = distanceFromCenter / center; // 0 to 1

  // Near center (< 30%) = 1 minute
  // Middle (30-70%) = 2-3 minutes
  // Outer (> 70%) = 5 minutes
  if (normalizedDistance < 0.3) return 1;
  if (normalizedDistance < 0.5) return 2;
  if (normalizedDistance < 0.7) return 3;
  return 5;
}

/**
 * Format time difference for display
 */
function formatTimeDiff(ms) {
  const totalMinutes = Math.floor(Math.abs(ms) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function MomentumScrollControl({
  onNavigate,
  currentTime,
  minTime,
  maxTime
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [hoverMagnitude, setHoverMagnitude] = useState(1);
  const containerRef = useRef(null);

  // Calculate progress through the time range
  const totalRange = maxTime - minTime;
  const currentProgress = totalRange > 0 ? (currentTime - minTime) / totalRange : 1;

  /**
   * Handle mouse move to show preview
   */
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    setHoverPosition(x);
    setHoverMagnitude(calculateMagnitude(x, width));
  }, []);

  /**
   * Handle click to navigate
   */
  const handleClick = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const center = width / 2;

    const direction = x < center ? -1 : 1; // Left = backward, Right = forward
    const magnitude = calculateMagnitude(x, width);

    onNavigate(direction, magnitude);
  }, [onNavigate]);

  // Calculate time offset from now
  const timeOffset = currentTime - maxTime;
  const isLive = Math.abs(timeOffset) < 60000; // Within 1 minute of now

  return (
    <div style={styles.container}>
      {/* Time offset indicator */}
      <div style={styles.offsetIndicator}>
        {isLive ? (
          <span style={styles.liveIndicator}>● LIVE</span>
        ) : (
          <span style={styles.offsetText}>
            {formatTimeDiff(timeOffset)} ago
          </span>
        )}
      </div>

      {/* Seesaw control */}
      <div
        ref={containerRef}
        style={styles.seesawContainer}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Background track */}
        <div style={styles.track}>
          {/* Gradient zones showing magnitude */}
          <div style={styles.zone5Left}>5m</div>
          <div style={styles.zone1Left}>1m</div>
          <div style={styles.centerZone}>◆</div>
          <div style={styles.zone1Right}>1m</div>
          <div style={styles.zone5Right}>5m</div>
        </div>

        {/* Progress indicator */}
        <div
          style={{
            ...styles.progressFill,
            width: `${currentProgress * 100}%`
          }}
        />

        {/* Hover preview */}
        {isHovering && (
          <div
            style={{
              ...styles.hoverPreview,
              left: hoverPosition,
              opacity: 1
            }}
          >
            <div style={styles.hoverLabel}>
              {hoverPosition < (containerRef.current?.getBoundingClientRect().width || 0) / 2
                ? `← ${hoverMagnitude}m`
                : `${hoverMagnitude}m →`
              }
            </div>
          </div>
        )}

        {/* Current position marker */}
        <div
          style={{
            ...styles.currentMarker,
            left: `${currentProgress * 100}%`
          }}
        />
      </div>

      {/* Labels */}
      <div style={styles.labels}>
        <span style={styles.labelLeft}>◀ Earlier</span>
        <span style={styles.labelCenter}>Now</span>
        <span style={styles.labelRight}>Later ▶</span>
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        Click near center for 1min, edges for 5min jumps
      </div>
    </div>
  );
}

/**
 * Styles
 */
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    userSelect: 'none'
  },

  offsetIndicator: {
    textAlign: 'center',
    marginBottom: '4px'
  },

  liveIndicator: {
    color: '#22c55e',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px'
  },

  offsetText: {
    color: '#a5b4fc',
    fontSize: '11px'
  },

  seesawContainer: {
    position: 'relative',
    height: '32px',
    borderRadius: '16px',
    backgroundColor: 'rgba(30, 30, 46, 0.8)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    cursor: 'pointer',
    overflow: 'hidden'
  },

  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
    zIndex: 2
  },

  zone5Left: {
    fontSize: '9px',
    color: '#64748b',
    opacity: 0.7
  },

  zone1Left: {
    fontSize: '9px',
    color: '#94a3b8',
    opacity: 0.8
  },

  centerZone: {
    fontSize: '12px',
    color: '#a5b4fc'
  },

  zone1Right: {
    fontSize: '9px',
    color: '#94a3b8',
    opacity: 0.8
  },

  zone5Right: {
    fontSize: '9px',
    color: '#64748b',
    opacity: 0.7
  },

  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
    borderRadius: '16px 0 0 16px',
    zIndex: 1
  },

  hoverPreview: {
    position: 'absolute',
    top: '-24px',
    transform: 'translateX(-50%)',
    zIndex: 10
  },

  hoverLabel: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    color: '#fff',
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap'
  },

  currentMarker: {
    position: 'absolute',
    top: '50%',
    width: '4px',
    height: '20px',
    backgroundColor: '#a5b4fc',
    borderRadius: '2px',
    transform: 'translate(-50%, -50%)',
    zIndex: 3,
    boxShadow: '0 0 8px rgba(165, 180, 252, 0.5)'
  },

  labels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4px'
  },

  labelLeft: {
    fontSize: '10px',
    color: '#64748b'
  },

  labelCenter: {
    fontSize: '10px',
    color: '#a5b4fc',
    fontWeight: '500'
  },

  labelRight: {
    fontSize: '10px',
    color: '#64748b'
  },

  instructions: {
    textAlign: 'center',
    fontSize: '9px',
    color: '#475569',
    fontStyle: 'italic'
  }
};

export { MomentumScrollControl };
