/**
 * Reverse Mapping Component
 *
 * Click a story beat to see which rules created it.
 * Provides deep inspection into the metaphysical machinery.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// ========================================
// RULE CATEGORY COLORS
// ========================================

const CATEGORY_COLORS = {
  retrograde: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400'
  },
  synastry: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-400'
  },
  timing: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400'
  },
  authority: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400'
  },
  composite: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400'
  }
};

// ========================================
// RULE CARD
// ========================================

function RuleCard({ rule, contribution }) {
  const colors = CATEGORY_COLORS[rule.category] || CATEGORY_COLORS.retrograde;

  const directionIcon = {
    positive: '\u{2191}',
    negative: '\u{2193}',
    neutral: '\u{2194}'
  };

  const directionColor = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400'
  };

  return (
    <div className={`reverse-mapping__rule ${colors.bg} ${colors.border}`}>
      <div className="reverse-mapping__rule-header">
        <span className={`reverse-mapping__rule-category ${colors.text}`}>
          {rule.category}
        </span>
        {contribution && (
          <span className={`reverse-mapping__rule-direction ${directionColor[contribution.direction]}`}>
            {directionIcon[contribution.direction]} {(contribution.contribution * 100).toFixed(1)}%
          </span>
        )}
      </div>

      <h5 className="reverse-mapping__rule-name">{rule.name}</h5>
      <p className="reverse-mapping__rule-description">{rule.description}</p>

      {contribution && (
        <div className="reverse-mapping__rule-explanation">
          {contribution.explanation}
        </div>
      )}

      <div className="reverse-mapping__rule-weight">
        <span>Weight:</span>
        <div className="reverse-mapping__weight-bar">
          <div
            className="reverse-mapping__weight-fill"
            style={{ width: `${(rule.weight / rule.maxWeight) * 100}%` }}
          />
        </div>
        <span>{rule.weight.toFixed(2)}</span>
      </div>
    </div>
  );
}

RuleCard.propTypes = {
  rule: PropTypes.object.isRequired,
  contribution: PropTypes.object
};

// ========================================
// STORY BEAT INSPECTOR
// ========================================

function StoryBeatInspector({ beat, rules, contributions }) {
  if (!beat) {
    return (
      <div className="reverse-mapping__inspector reverse-mapping__inspector--empty">
        <p>Click a story beat to inspect its rules</p>
      </div>
    );
  }

  const contributingRules = rules.filter(r => beat.ruleIds.includes(r.id));
  const ruleContributions = contributions
    ? new Map(contributions.map(c => [c.rule.id, c]))
    : new Map();

  return (
    <div className="reverse-mapping__inspector">
      <div className="reverse-mapping__beat-preview">
        <span className="reverse-mapping__beat-category">{beat.category}</span>
        <p className="reverse-mapping__beat-text">{beat.text}</p>
      </div>

      <h5 className="reverse-mapping__contributing-title">
        Contributing Rules ({contributingRules.length})
      </h5>

      <div className="reverse-mapping__rules-list">
        {contributingRules.map(rule => (
          <RuleCard
            key={rule.id}
            rule={rule}
            contribution={ruleContributions.get(rule.id)}
          />
        ))}
      </div>

      {contributingRules.length === 0 && (
        <div className="reverse-mapping__no-rules">
          No specific rules attributed to this beat
        </div>
      )}
    </div>
  );
}

StoryBeatInspector.propTypes = {
  beat: PropTypes.object,
  rules: PropTypes.array.isRequired,
  contributions: PropTypes.array
};

// ========================================
// BEATS LIST
// ========================================

function BeatsList({ beats, selectedBeat, onSelect }) {
  const groupedBeats = useMemo(() => {
    const groups = new Map();
    for (const beat of beats) {
      if (!groups.has(beat.category)) {
        groups.set(beat.category, []);
      }
      groups.get(beat.category).push(beat);
    }
    return groups;
  }, [beats]);

  return (
    <div className="reverse-mapping__beats">
      {Array.from(groupedBeats.entries()).map(([category, categoryBeats]) => (
        <div key={category} className="reverse-mapping__beats-group">
          <h6 className="reverse-mapping__group-title">{category}</h6>
          {categoryBeats.map(beat => (
            <button
              key={beat.id}
              className={`reverse-mapping__beat-btn ${
                selectedBeat?.id === beat.id ? 'reverse-mapping__beat-btn--selected' : ''
              }`}
              onClick={() => onSelect(beat)}
            >
              <span className="reverse-mapping__beat-preview-text">
                {beat.text.substring(0, 50)}...
              </span>
              <span className="reverse-mapping__beat-rules-count">
                {beat.ruleIds.length} rules
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

BeatsList.propTypes = {
  beats: PropTypes.array.isRequired,
  selectedBeat: PropTypes.object,
  onSelect: PropTypes.func.isRequired
};

// ========================================
// MAIN REVERSE MAPPING COMPONENT
// ========================================

function ReverseMapping({
  cockpit,
  rules,
  contributions,
  className = ''
}) {
  const [selectedBeat, setSelectedBeat] = useState(null);

  if (!cockpit) {
    return (
      <div className={`reverse-mapping ${className}`}>
        <p className="text-cathedral-slate-400">No cockpit data available</p>
      </div>
    );
  }

  return (
    <div className={`reverse-mapping ${className}`}>
      <div className="reverse-mapping__header">
        <h4>Reverse Mapping</h4>
        <span className="reverse-mapping__date">{cockpit.date}</span>
      </div>

      <div className="reverse-mapping__content">
        <div className="reverse-mapping__left">
          <h5>Story Beats</h5>
          <BeatsList
            beats={cockpit.beats}
            selectedBeat={selectedBeat}
            onSelect={setSelectedBeat}
          />
        </div>

        <div className="reverse-mapping__right">
          <StoryBeatInspector
            beat={selectedBeat}
            rules={rules}
            contributions={contributions}
          />
        </div>
      </div>
    </div>
  );
}

ReverseMapping.propTypes = {
  cockpit: PropTypes.object,
  rules: PropTypes.array.isRequired,
  contributions: PropTypes.array,
  className: PropTypes.string
};

// ========================================
// STYLES
// ========================================

export const ReverseMappingStyles = `
.reverse-mapping {
  background: rgba(5, 5, 16, 0.9);
  border: 1px solid rgba(255, 215, 128, 0.15);
  border-radius: 12px;
  padding: 20px;
}

.reverse-mapping__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 215, 128, 0.1);
}

.reverse-mapping__header h4 {
  margin: 0;
  color: var(--cathedral-gold, #ffd780);
}

.reverse-mapping__date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.reverse-mapping__content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.reverse-mapping__left h5,
.reverse-mapping__right h5 {
  margin: 0 0 12px 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
}

.reverse-mapping__beats {
  max-height: 400px;
  overflow-y: auto;
}

.reverse-mapping__beats-group {
  margin-bottom: 12px;
}

.reverse-mapping__group-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.3);
  margin: 0 0 6px 0;
}

.reverse-mapping__beat-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 150ms ease;
}

.reverse-mapping__beat-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 215, 128, 0.2);
}

.reverse-mapping__beat-btn--selected {
  background: rgba(255, 215, 128, 0.1);
  border-color: rgba(255, 215, 128, 0.3);
}

.reverse-mapping__beat-preview-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reverse-mapping__beat-rules-count {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 8px;
}

.reverse-mapping__inspector {
  min-height: 300px;
}

.reverse-mapping__inspector--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

.reverse-mapping__beat-preview {
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 16px;
}

.reverse-mapping__beat-category {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cathedral-gold, #ffd780);
}

.reverse-mapping__beat-text {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.reverse-mapping__contributing-title {
  margin: 0 0 12px 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
}

.reverse-mapping__rules-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reverse-mapping__rule {
  padding: 12px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
}

.reverse-mapping__rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reverse-mapping__rule-category {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.reverse-mapping__rule-direction {
  font-size: 12px;
  font-weight: 600;
}

.reverse-mapping__rule-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: white;
}

.reverse-mapping__rule-description {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.reverse-mapping__rule-explanation {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 8px;
}

.reverse-mapping__rule-weight {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.reverse-mapping__weight-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.reverse-mapping__weight-fill {
  height: 100%;
  background: var(--cathedral-gold, #ffd780);
}

.reverse-mapping__no-rules {
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
  font-size: 12px;
  text-align: center;
  padding: 20px;
}
`;

export default ReverseMapping;
