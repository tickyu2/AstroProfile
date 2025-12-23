/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DRIFT TIMELINE COMPONENT
 * Luna Management Console - Personality Drift Visualization
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Features:
 * - Visualize drift dimensions over time
 * - Show current values with bounds
 * - Manual nudge controls
 * - Reset to defaults
 *
 * Created: December 21, 2025
 */

import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DRIFT DIMENSION DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const DRIFT_DIMENSIONS = {
  backchannelFrequency: {
    label: 'Backchannel',
    color: '#4ecdc4',
    icon: '💬',
    description: 'How often Luna provides verbal acknowledgments'
  },
  adviceBias: {
    label: 'Advice Bias',
    color: '#f093fb',
    icon: '💡',
    description: 'Balance between listening and giving advice'
  },
  timingScale: {
    label: 'Timing',
    color: '#f5a623',
    icon: '⏱️',
    description: 'Response timing multiplier'
  },
  baseWarmth: {
    label: 'Warmth',
    color: '#ff6b6b',
    icon: '❤️',
    description: 'Emotional warmth in responses'
  },
  basePace: {
    label: 'Pace',
    color: '#667eea',
    icon: '🎵',
    description: 'Speaking pace and energy level'
  },
  emotionalMirroring: {
    label: 'Mirroring',
    color: '#9b59b6',
    icon: '🪞',
    description: 'How much Luna mirrors user emotions'
  },
  responseLength: {
    label: 'Response Length',
    color: '#3498db',
    icon: '📏',
    description: 'Preferred response verbosity'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  controls: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  secondaryButton: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  dangerButton: {
    background: 'rgba(255,100,100,0.2)',
    color: '#ff6b6b',
    border: '1px solid rgba(255,100,100,0.3)'
  },
  dimensionsGrid: {
    display: 'grid',
    gap: '16px'
  },
  dimensionCard: {
    padding: '16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  dimensionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  dimensionName: {
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  dimensionValue: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  dimensionDesc: {
    fontSize: '11px',
    opacity: 0.5,
    marginBottom: '12px'
  },
  sliderContainer: {
    position: 'relative',
    marginBottom: '8px'
  },
  sliderTrack: {
    height: '8px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.1)',
    position: 'relative'
  },
  sliderFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: '4px',
    left: 0,
    transition: 'width 0.3s'
  },
  sliderThumb: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid white',
    top: '-4px',
    transform: 'translateX(-50%)',
    cursor: 'grab',
    transition: 'left 0.3s'
  },
  sliderBounds: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    opacity: 0.4,
    marginTop: '4px'
  },
  defaultMarker: {
    position: 'absolute',
    width: '2px',
    height: '12px',
    background: 'rgba(255,255,255,0.5)',
    top: '-2px',
    transform: 'translateX(-50%)'
  },
  nudgeButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px'
  },
  nudgeButton: {
    padding: '4px 12px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  timelineSection: {
    marginTop: '24px',
    padding: '16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  timelineTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  chartContainer: {
    height: '150px',
    position: 'relative'
  },
  chartGrid: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  chartGridLine: {
    height: '1px',
    background: 'rgba(255,255,255,0.05)'
  },
  chartSvg: {
    position: 'absolute',
    inset: 0
  },
  historyEmpty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    opacity: 0.5,
    fontSize: '13px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    opacity: 0.5
  },
  error: {
    background: 'rgba(255,100,100,0.1)',
    border: '1px solid rgba(255,100,100,0.3)',
    borderRadius: '8px',
    padding: '12px',
    color: '#ff6b6b',
    fontSize: '13px'
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '12px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    opacity: 0.7
  },
  legendColor: {
    width: '12px',
    height: '3px',
    borderRadius: '2px'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DriftTimeline({
  consoleBaseUrl = 'http://localhost:8091',
  onDriftChange
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driftState, setDriftState] = useState(null);
  const [history, setHistory] = useState([]);
  const [bounds, setBounds] = useState({});

  // ─────────────────────────────────────────────────────────────────────────────
  // DATA LOADING
  // ─────────────────────────────────────────────────────────────────────────────

  const loadDriftData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load current state and history in parallel
      const [stateRes, historyRes] = await Promise.all([
        fetch(`${consoleBaseUrl}/console/drift`),
        fetch(`${consoleBaseUrl}/console/drift/history?limit=20`)
      ]);

      const stateData = await stateRes.json();
      const historyData = await historyRes.json();

      if (stateData.success) {
        setDriftState(stateData.data.current);
        setBounds(stateData.data.bounds || {});
      } else {
        setError(stateData.error || 'Failed to load drift state');
      }

      if (historyData.success) {
        setHistory(historyData.data.history || []);
        if (historyData.data.bounds) {
          setBounds(historyData.data.bounds);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to console server');
    } finally {
      setLoading(false);
    }
  }, [consoleBaseUrl]);

  useEffect(() => {
    loadDriftData();
  }, [loadDriftData]);

  // ─────────────────────────────────────────────────────────────────────────────
  // DRIFT MANIPULATION
  // ─────────────────────────────────────────────────────────────────────────────

  async function handleNudge(dimension, amount) {
    try {
      const response = await fetch(`${consoleBaseUrl}/console/drift/nudge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimension, amount })
      });

      const data = await response.json();

      if (data.success) {
        setDriftState(data.data.current);
        onDriftChange?.(data.data.current);
      } else {
        setError(data.error || 'Failed to nudge drift');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReset(dimension = null) {
    try {
      const response = await fetch(`${consoleBaseUrl}/console/drift/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimension })
      });

      const data = await response.json();

      if (data.success) {
        setDriftState(data.data.current);
        onDriftChange?.(data.data.current);
      } else {
        setError(data.error || 'Failed to reset drift');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  function getValuePercent(dimension, value) {
    const b = bounds[dimension];
    if (!b) return 50;
    return ((value - b.min) / (b.max - b.min)) * 100;
  }

  function getDefaultPercent(dimension) {
    const b = bounds[dimension];
    if (!b) return 50;
    return ((b.default - b.min) / (b.max - b.min)) * 100;
  }

  function formatValue(value) {
    if (value === undefined || value === null) return '-';
    return value.toFixed(2);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading drift data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🌊</span> Personality Drift
        </div>
        <div style={styles.controls}>
          <button
            style={{ ...styles.button, ...styles.dangerButton }}
            onClick={() => handleReset()}
          >
            Reset All
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={loadDriftData}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Drift Dimensions */}
      <div style={styles.dimensionsGrid}>
        {Object.entries(DRIFT_DIMENSIONS).map(([dimension, meta]) => {
          const value = driftState?.[dimension];
          const b = bounds[dimension] || { min: 0, max: 1, default: 0.5 };
          const valuePercent = getValuePercent(dimension, value);
          const defaultPercent = getDefaultPercent(dimension);

          return (
            <div key={dimension} style={styles.dimensionCard}>
              <div style={styles.dimensionHeader}>
                <div style={styles.dimensionName}>
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </div>
                <div style={{ ...styles.dimensionValue, color: meta.color }}>
                  {formatValue(value)}
                </div>
              </div>

              <div style={styles.dimensionDesc}>{meta.description}</div>

              {/* Slider */}
              <div style={styles.sliderContainer}>
                <div style={styles.sliderTrack}>
                  {/* Default marker */}
                  <div
                    style={{
                      ...styles.defaultMarker,
                      left: `${defaultPercent}%`
                    }}
                    title={`Default: ${b.default}`}
                  />
                  {/* Fill */}
                  <div
                    style={{
                      ...styles.sliderFill,
                      width: `${valuePercent}%`,
                      background: meta.color
                    }}
                  />
                  {/* Thumb */}
                  <div
                    style={{
                      ...styles.sliderThumb,
                      left: `${valuePercent}%`,
                      background: meta.color
                    }}
                  />
                </div>
                <div style={styles.sliderBounds}>
                  <span>{b.min}</span>
                  <span>Default: {b.default}</span>
                  <span>{b.max}</span>
                </div>
              </div>

              {/* Nudge buttons */}
              <div style={styles.nudgeButtons}>
                <button
                  style={styles.nudgeButton}
                  onClick={() => handleNudge(dimension, -0.1)}
                >
                  - 0.1
                </button>
                <button
                  style={styles.nudgeButton}
                  onClick={() => handleNudge(dimension, -0.05)}
                >
                  - 0.05
                </button>
                <button
                  style={styles.nudgeButton}
                  onClick={() => handleReset(dimension)}
                >
                  Reset
                </button>
                <button
                  style={styles.nudgeButton}
                  onClick={() => handleNudge(dimension, 0.05)}
                >
                  + 0.05
                </button>
                <button
                  style={styles.nudgeButton}
                  onClick={() => handleNudge(dimension, 0.1)}
                >
                  + 0.1
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Chart */}
      <div style={styles.timelineSection}>
        <div style={styles.timelineTitle}>
          <span>📈</span> Drift History
        </div>

        {history.length === 0 ? (
          <div style={styles.historyEmpty}>
            No drift history yet. Changes will appear here over time.
          </div>
        ) : (
          <>
            <div style={styles.chartContainer}>
              {/* Grid lines */}
              <div style={styles.chartGrid}>
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} style={styles.chartGridLine} />
                ))}
              </div>

              {/* SVG Chart */}
              <svg style={styles.chartSvg} preserveAspectRatio="none">
                {Object.entries(DRIFT_DIMENSIONS).map(([dimension, meta]) => {
                  const points = history.map((entry, i) => {
                    const x = (i / (history.length - 1)) * 100 || 0;
                    const value = entry.state?.[dimension] || 0.5;
                    const b = bounds[dimension] || { min: 0, max: 1 };
                    const y = 100 - ((value - b.min) / (b.max - b.min)) * 100;
                    return `${x}%,${y}%`;
                  });

                  if (points.length < 2) return null;

                  return (
                    <polyline
                      key={dimension}
                      points={points.join(' ')}
                      fill="none"
                      stroke={meta.color}
                      strokeWidth="2"
                      strokeOpacity="0.7"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div style={styles.legend}>
              {Object.entries(DRIFT_DIMENSIONS).map(([dimension, meta]) => (
                <div key={dimension} style={styles.legendItem}>
                  <div style={{ ...styles.legendColor, background: meta.color }} />
                  <span>{meta.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
