/**
 * Story Diff View Component
 *
 * Compares narrative cockpits between two days, showing
 * what story beats changed and why.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// ========================================
// BEAT DIFF ITEM
// ========================================

function BeatDiffItem({ beat, type, onSelect }) {
  const typeStyles = {
    added: 'story-diff__beat--added',
    removed: 'story-diff__beat--removed',
    modified: 'story-diff__beat--modified'
  };

  const typeIcons = {
    added: '+',
    removed: '-',
    modified: '\u{21C4}'
  };

  return (
    <div
      className={`story-diff__beat ${typeStyles[type]}`}
      onClick={() => onSelect?.(beat)}
      role="button"
      tabIndex={0}
    >
      <span className="story-diff__beat-icon">{typeIcons[type]}</span>
      <span className="story-diff__beat-category">{beat.category}</span>
      <span className="story-diff__beat-text">{beat.text.substring(0, 80)}...</span>
    </div>
  );
}

BeatDiffItem.propTypes = {
  beat: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['added', 'removed', 'modified']).isRequired,
  onSelect: PropTypes.func
};

// ========================================
// EMOTIONAL ARC CHART
// ========================================

function EmotionalArcChart({ before, after, shift }) {
  const maxVal = Math.max(...before, ...after, 1);
  const height = 60;
  const width = 200;

  const pointsToPath = (points, maxVal) => {
    const step = width / (points.length - 1);
    return points.map((val, i) => {
      const x = i * step;
      const y = height - (val / maxVal) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const avgShift = shift.reduce((a, b) => a + b, 0) / shift.length;

  return (
    <div className="story-diff__arc">
      <h5>Emotional Arc</h5>
      <svg viewBox={`0 0 ${width} ${height}`} className="story-diff__arc-svg">
        {/* Before line */}
        <path
          d={pointsToPath(before, maxVal)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        {/* After line */}
        <path
          d={pointsToPath(after, maxVal)}
          fill="none"
          stroke="var(--cathedral-gold)"
          strokeWidth="2"
        />
      </svg>
      <div className="story-diff__arc-legend">
        <span className="story-diff__arc-legend-before">Before</span>
        <span className="story-diff__arc-legend-after">After</span>
        <span className={`story-diff__arc-shift ${avgShift >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {avgShift >= 0 ? '+' : ''}{(avgShift * 100).toFixed(1)}% shift
        </span>
      </div>
    </div>
  );
}

EmotionalArcChart.propTypes = {
  before: PropTypes.arrayOf(PropTypes.number).isRequired,
  after: PropTypes.arrayOf(PropTypes.number).isRequired,
  shift: PropTypes.arrayOf(PropTypes.number).isRequired
};

// ========================================
// OVERLAY CHANGES
// ========================================

function OverlayChanges({ added, removed }) {
  if (added.length === 0 && removed.length === 0) {
    return (
      <div className="story-diff__overlays story-diff__overlays--empty">
        No overlay changes
      </div>
    );
  }

  return (
    <div className="story-diff__overlays">
      <h5>Overlay Changes</h5>
      {added.length > 0 && (
        <div className="story-diff__overlays-section">
          <span className="story-diff__overlays-label text-emerald-400">Added:</span>
          <div className="story-diff__overlays-list">
            {added.map(o => (
              <span key={o} className="story-diff__overlay story-diff__overlay--added">{o}</span>
            ))}
          </div>
        </div>
      )}
      {removed.length > 0 && (
        <div className="story-diff__overlays-section">
          <span className="story-diff__overlays-label text-red-400">Removed:</span>
          <div className="story-diff__overlays-list">
            {removed.map(o => (
              <span key={o} className="story-diff__overlay story-diff__overlay--removed">{o}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

OverlayChanges.propTypes = {
  added: PropTypes.arrayOf(PropTypes.string).isRequired,
  removed: PropTypes.arrayOf(PropTypes.string).isRequired
};

// ========================================
// SIGNIFICANT CHANGES SUMMARY
// ========================================

function SignificantChanges({ changes }) {
  if (changes.length === 0) {
    return null;
  }

  return (
    <div className="story-diff__significant">
      <h5>Significant Changes</h5>
      <ul>
        {changes.map((change, i) => (
          <li key={i}>{change}</li>
        ))}
      </ul>
    </div>
  );
}

SignificantChanges.propTypes = {
  changes: PropTypes.arrayOf(PropTypes.string).isRequired
};

// ========================================
// MAIN STORY DIFF VIEW
// ========================================

function StoryDiffView({
  diff,
  cockpitA,
  cockpitB,
  onBeatSelect,
  className = ''
}) {
  const [selectedBeat, setSelectedBeat] = useState(null);

  const handleBeatSelect = (beat) => {
    setSelectedBeat(beat);
    onBeatSelect?.(beat);
  };

  const key = `${diff.dateA}-${diff.dateB}`;

  return (
    <div className={`story-diff story-diff--animated ${className}`} key={key}>
      {/* Header */}
      <div className="story-diff__header">
        <h4>Story Diff</h4>
        <div className="story-diff__dates">
          <span className="story-diff__date story-diff__date--before">{diff.dateA}</span>
          <span className="story-diff__arrow">\u{2192}</span>
          <span className="story-diff__date story-diff__date--after">{diff.dateB}</span>
        </div>
      </div>

      {/* Outcome Change */}
      {diff.outcomeChanged && (
        <div className="story-diff__outcome-change">
          <span className={getOutcomeColor(diff.previousOutcome)}>{diff.previousOutcome}</span>
          <span className="story-diff__arrow">\u{2192}</span>
          <span className={getOutcomeColor(diff.newOutcome)}>{diff.newOutcome}</span>
        </div>
      )}

      {/* Significant Changes */}
      <SignificantChanges changes={diff.significantChanges} />

      {/* Beats Added */}
      {diff.beatsAdded.length > 0 && (
        <div className="story-diff__section">
          <h5 className="text-emerald-400">Beats Added ({diff.beatsAdded.length})</h5>
          {diff.beatsAdded.map(beat => (
            <BeatDiffItem
              key={beat.id}
              beat={beat}
              type="added"
              onSelect={handleBeatSelect}
            />
          ))}
        </div>
      )}

      {/* Beats Removed */}
      {diff.beatsRemoved.length > 0 && (
        <div className="story-diff__section">
          <h5 className="text-red-400">Beats Removed ({diff.beatsRemoved.length})</h5>
          {diff.beatsRemoved.map(beat => (
            <BeatDiffItem
              key={beat.id}
              beat={beat}
              type="removed"
              onSelect={handleBeatSelect}
            />
          ))}
        </div>
      )}

      {/* Beats Modified */}
      {diff.beatsModified.length > 0 && (
        <div className="story-diff__section">
          <h5 className="text-amber-400">Beats Modified ({diff.beatsModified.length})</h5>
          {diff.beatsModified.map(({ before, after }) => (
            <BeatDiffItem
              key={after.id}
              beat={after}
              type="modified"
              onSelect={handleBeatSelect}
            />
          ))}
        </div>
      )}

      {/* Emotional Arc */}
      {cockpitA && cockpitB && (
        <EmotionalArcChart
          before={cockpitA.emotionalArc}
          after={cockpitB.emotionalArc}
          shift={diff.emotionalShift}
        />
      )}

      {/* Overlay Changes */}
      <OverlayChanges
        added={diff.overlaysAdded}
        removed={diff.overlaysRemoved}
      />
    </div>
  );
}

StoryDiffView.propTypes = {
  diff: PropTypes.shape({
    dateA: PropTypes.string.isRequired,
    dateB: PropTypes.string.isRequired,
    beatsAdded: PropTypes.array.isRequired,
    beatsRemoved: PropTypes.array.isRequired,
    beatsModified: PropTypes.array.isRequired,
    emotionalShift: PropTypes.array.isRequired,
    timingShift: PropTypes.array.isRequired,
    overlaysAdded: PropTypes.array.isRequired,
    overlaysRemoved: PropTypes.array.isRequired,
    outcomeChanged: PropTypes.bool.isRequired,
    previousOutcome: PropTypes.string.isRequired,
    newOutcome: PropTypes.string.isRequired,
    significantChanges: PropTypes.array.isRequired
  }).isRequired,
  cockpitA: PropTypes.object,
  cockpitB: PropTypes.object,
  onBeatSelect: PropTypes.func,
  className: PropTypes.string
};

// ========================================
// HELPER
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

export const StoryDiffStyles = `
.story-diff {
  background: rgba(5, 5, 16, 0.9);
  border: 1px solid rgba(255, 215, 128, 0.15);
  border-radius: 12px;
  padding: 20px;
}

.story-diff--animated {
  animation: storyDiffFade 250ms ease-out;
}

@keyframes storyDiffFade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.story-diff__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 215, 128, 0.1);
}

.story-diff__header h4 {
  margin: 0;
  color: var(--cathedral-gold, #ffd780);
}

.story-diff__dates {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.story-diff__date--before {
  color: rgba(255, 255, 255, 0.5);
}

.story-diff__date--after {
  color: white;
}

.story-diff__arrow {
  color: rgba(255, 255, 255, 0.3);
}

.story-diff__outcome-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 215, 128, 0.05);
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.story-diff__section {
  margin-bottom: 16px;
}

.story-diff__section h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.story-diff__beat {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 150ms ease;
}

.story-diff__beat:hover {
  transform: translateX(4px);
}

.story-diff__beat--added {
  background: rgba(52, 211, 153, 0.1);
  border-left: 3px solid var(--cathedral-emerald, #34d399);
}

.story-diff__beat--removed {
  background: rgba(248, 113, 113, 0.1);
  border-left: 3px solid #f87171;
}

.story-diff__beat--modified {
  background: rgba(251, 191, 36, 0.1);
  border-left: 3px solid var(--cathedral-amber, #fbbf24);
}

.story-diff__beat-icon {
  font-weight: 700;
  width: 16px;
  text-align: center;
}

.story-diff__beat-category {
  font-size: 10px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 3px;
}

.story-diff__beat-text {
  flex: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.story-diff__arc {
  margin: 20px 0;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.story-diff__arc h5 {
  margin: 0 0 12px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
}

.story-diff__arc-svg {
  width: 100%;
  height: 60px;
}

.story-diff__arc-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
  font-size: 11px;
}

.story-diff__arc-legend-before {
  color: rgba(255, 255, 255, 0.4);
}

.story-diff__arc-legend-before::before {
  content: "---";
  margin-right: 4px;
}

.story-diff__arc-legend-after {
  color: var(--cathedral-gold, #ffd780);
}

.story-diff__arc-legend-after::before {
  content: "\u2014";
  margin-right: 4px;
}

.story-diff__overlays {
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.story-diff__overlays h5 {
  margin: 0 0 8px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
}

.story-diff__overlays--empty {
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
  font-size: 12px;
}

.story-diff__overlays-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.story-diff__overlays-label {
  font-size: 11px;
  font-weight: 600;
}

.story-diff__overlays-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.story-diff__overlay {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
}

.story-diff__overlay--added {
  background: rgba(52, 211, 153, 0.2);
  color: var(--cathedral-emerald, #34d399);
}

.story-diff__overlay--removed {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
}

.story-diff__significant {
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 215, 128, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--cathedral-gold, #ffd780);
}

.story-diff__significant h5 {
  margin: 0 0 8px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cathedral-gold, #ffd780);
}

.story-diff__significant ul {
  margin: 0;
  padding-left: 16px;
}

.story-diff__significant li {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
}
`;

export default StoryDiffView;
