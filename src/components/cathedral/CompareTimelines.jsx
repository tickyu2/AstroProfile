/**
 * Compare Timelines Component
 *
 * Side-by-side comparison of two relationship timelines.
 * Shows alignment and divergence between two partners' outcomes.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import OutcomeTimeline from './OutcomeTimeline';
import RelationshipDevToolsOverlay from './RelationshipDevTools';

// ========================================
// ALIGNMENT INDICATOR
// ========================================

function AlignmentIndicator({ alignment }) {
  const percentage = (alignment * 100).toFixed(0);

  let color = 'text-red-400';
  let label = 'Divergent';

  if (alignment >= 0.8) {
    color = 'text-emerald-400';
    label = 'Highly Aligned';
  } else if (alignment >= 0.6) {
    color = 'text-amber-400';
    label = 'Moderately Aligned';
  } else if (alignment >= 0.4) {
    color = 'text-orange-400';
    label = 'Partially Aligned';
  }

  return (
    <div className="compare-timelines__alignment">
      <div className="compare-timelines__alignment-bar">
        <div
          className="compare-timelines__alignment-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="compare-timelines__alignment-text">
        <span className={color}>{percentage}%</span>
        <span className="text-cathedral-slate-400 ml-2">{label}</span>
      </div>
    </div>
  );
}

AlignmentIndicator.propTypes = {
  alignment: PropTypes.number.isRequired
};

// ========================================
// COMPARISON HEADER
// ========================================

function ComparisonHeader({ left, right }) {
  return (
    <div className="compare-timelines__header">
      <div className="compare-timelines__person compare-timelines__person--left">
        <div className="compare-timelines__person-name">{left.personId}</div>
        <div className="compare-timelines__person-stats">
          Avg: {(left.summary.averageScore * 100).toFixed(0)}%
        </div>
      </div>

      <div className="compare-timelines__vs">VS</div>

      <div className="compare-timelines__person compare-timelines__person--right">
        <div className="compare-timelines__person-name">{right.personId}</div>
        <div className="compare-timelines__person-stats">
          Avg: {(right.summary.averageScore * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

ComparisonHeader.propTypes = {
  left: PropTypes.object.isRequired,
  right: PropTypes.object.isRequired
};

// ========================================
// MAIN COMPARE COMPONENT
// ========================================

function CompareTimelines({
  comparison,
  syncPlayback = true,
  showDevTools = true,
  className = ''
}) {
  const { left, right, alignment } = comparison;

  const [activePointLeft, setActivePointLeft] = useState(left.points[0]);
  const [activePointRight, setActivePointRight] = useState(right.points[0]);
  const [syncedIndex, setSyncedIndex] = useState(0);
  const [showLeftDevTools, setShowLeftDevTools] = useState(false);
  const [showRightDevTools, setShowRightDevTools] = useState(false);

  const handleLeftHover = useCallback((point) => {
    setActivePointLeft(point);
    if (syncPlayback) {
      const idx = left.points.findIndex(p => p.date === point.date);
      if (idx >= 0 && idx < right.points.length) {
        setActivePointRight(right.points[idx]);
        setSyncedIndex(idx);
      }
    }
  }, [left.points, right.points, syncPlayback]);

  const handleRightHover = useCallback((point) => {
    setActivePointRight(point);
    if (syncPlayback) {
      const idx = right.points.findIndex(p => p.date === point.date);
      if (idx >= 0 && idx < left.points.length) {
        setActivePointLeft(left.points[idx]);
        setSyncedIndex(idx);
      }
    }
  }, [left.points, right.points, syncPlayback]);

  return (
    <div className={`compare-timelines ${className}`}>
      {/* Header */}
      <ComparisonHeader left={left} right={right} />

      {/* Alignment */}
      <AlignmentIndicator alignment={alignment} />

      {/* Timelines */}
      <div className="compare-timelines__tracks">
        <div className="compare-timelines__track">
          <OutcomeTimeline
            series={left}
            activeDate={activePointLeft?.date}
            onHover={handleLeftHover}
            showPlayback={false}
            showZoom={false}
            compact
          />
          {showDevTools && (
            <button
              className="compare-timelines__devtools-toggle"
              onClick={() => setShowLeftDevTools(v => !v)}
            >
              {showLeftDevTools ? 'Hide' : 'Show'} Debug
            </button>
          )}
        </div>

        <div className="compare-timelines__divider" />

        <div className="compare-timelines__track">
          <OutcomeTimeline
            series={right}
            activeDate={activePointRight?.date}
            onHover={handleRightHover}
            showPlayback={false}
            showZoom={false}
            compact
          />
          {showDevTools && (
            <button
              className="compare-timelines__devtools-toggle"
              onClick={() => setShowRightDevTools(v => !v)}
            >
              {showRightDevTools ? 'Hide' : 'Show'} Debug
            </button>
          )}
        </div>
      </div>

      {/* DevTools Panels */}
      {showDevTools && (showLeftDevTools || showRightDevTools) && (
        <div className="compare-timelines__devtools">
          {showLeftDevTools && activePointLeft?.breakdown && (
            <RelationshipDevToolsOverlay
              breakdown={activePointLeft.breakdown}
              onClose={() => setShowLeftDevTools(false)}
            />
          )}
          {showRightDevTools && activePointRight?.breakdown && (
            <RelationshipDevToolsOverlay
              breakdown={activePointRight.breakdown}
              onClose={() => setShowRightDevTools(false)}
            />
          )}
        </div>
      )}

      {/* Comparison Summary */}
      <div className="compare-timelines__comparison-summary">
        <div className="compare-timelines__comparison-row">
          <span className="compare-timelines__comparison-label">Date</span>
          <span>{activePointLeft?.date || '-'}</span>
        </div>
        <div className="compare-timelines__comparison-row">
          <span className="compare-timelines__comparison-label">Left Outcome</span>
          <span className={getOutcomeColor(activePointLeft?.outcome)}>
            {activePointLeft?.outcome || '-'}
          </span>
        </div>
        <div className="compare-timelines__comparison-row">
          <span className="compare-timelines__comparison-label">Right Outcome</span>
          <span className={getOutcomeColor(activePointRight?.outcome)}>
            {activePointRight?.outcome || '-'}
          </span>
        </div>
        <div className="compare-timelines__comparison-row">
          <span className="compare-timelines__comparison-label">Match</span>
          <span className={activePointLeft?.outcome === activePointRight?.outcome ? 'text-emerald-400' : 'text-red-400'}>
            {activePointLeft?.outcome === activePointRight?.outcome ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
}

CompareTimelines.propTypes = {
  comparison: PropTypes.shape({
    left: PropTypes.object.isRequired,
    right: PropTypes.object.isRequired,
    alignment: PropTypes.number.isRequired
  }).isRequired,
  syncPlayback: PropTypes.bool,
  showDevTools: PropTypes.bool,
  className: PropTypes.string
};

// ========================================
// HELPER FUNCTIONS
// ========================================

function getOutcomeColor(outcome) {
  const colors = {
    DoNow: 'text-emerald-400',
    GoodWindow: 'text-amber-400',
    Neutral: 'text-slate-400',
    Delay: 'text-orange-400',
    Avoid: 'text-red-400'
  };
  return colors[outcome] || 'text-white';
}

// ========================================
// STYLES
// ========================================

export const CompareStyles = `
.compare-timelines {
  background: rgba(5, 5, 16, 0.8);
  border: 1px solid rgba(255, 215, 128, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.compare-timelines__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.compare-timelines__person {
  flex: 1;
}

.compare-timelines__person--left {
  text-align: left;
}

.compare-timelines__person--right {
  text-align: right;
}

.compare-timelines__person-name {
  font-weight: 600;
  font-size: 16px;
  color: white;
}

.compare-timelines__person-stats {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.compare-timelines__vs {
  padding: 0 20px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
}

.compare-timelines__alignment {
  margin-bottom: 20px;
}

.compare-timelines__alignment-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.compare-timelines__alignment-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--cathedral-emerald), var(--cathedral-gold));
  transition: width 500ms ease;
}

.compare-timelines__alignment-text {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  font-size: 14px;
}

.compare-timelines__tracks {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.compare-timelines__track {
  flex: 1;
}

.compare-timelines__divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.compare-timelines__devtools-toggle {
  margin-top: 8px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  cursor: pointer;
}

.compare-timelines__devtools-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.compare-timelines__devtools {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.compare-timelines__devtools > * {
  flex: 1;
}

.compare-timelines__comparison-summary {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 12px;
}

.compare-timelines__comparison-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 12px;
}

.compare-timelines__comparison-label {
  color: rgba(255, 255, 255, 0.5);
}
`;

export default CompareTimelines;
