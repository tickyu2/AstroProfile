/**
 * Message Annotation Component
 * Displays detailed analysis for each message
 */

import React, { useState } from 'react';
import './MessageAnnotation.css';

export function MessageAnnotation({ message, index }) {
  const [expanded, setExpanded] = useState(false);

  if (!message.analyzed) {
    // AI response - don't analyze
    return (
      <div className="message-annotation ai-message">
        <div className="message-header">
          <span className="speaker-badge ai">AI</span>
          <span className="message-text-preview">{message.text}</span>
        </div>
      </div>
    );
  }

  const { archetype, signals, congruence, voiceEmotion, text } = message;

  return (
    <div className={`message-annotation user-message ${expanded ? 'expanded' : ''}`}>
      <div className="message-header" onClick={() => setExpanded(!expanded)}>
        <div className="header-left">
          <span className="message-number">#{index + 1}</span>
          <span className="speaker-badge user">User</span>
          <span className="archetype-badge" style={{ background: getArchetypeColor(archetype.type) }}>
            {getArchetypeEmoji(archetype.type)} {archetype.type}
          </span>
          <span className="confidence-badge">
            {(archetype.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="header-right">
          {congruence.requiresSpecialHandling && (
            <span className="crisis-badge">Crisis</span>
          )}
          <span className={`congruence-badge ${congruence.level.toLowerCase()}`}>
            {congruence.level}
          </span>
          <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
        </div>
      </div>

      <div className="message-text">{text}</div>

      {expanded && (
        <div className="message-details">
          {/* Voice Emotion */}
          <div className="detail-section">
            <h4>Voice Emotion</h4>
            <div className="voice-emotion">
              <span className="emotion-name">{voiceEmotion.emotion}</span>
              <span className="emotion-confidence">
                {(voiceEmotion.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </div>

          {/* Patterns Detected */}
          {(congruence.patterns?.length > 0 || congruence.advancedPatterns?.length > 0) && (
            <div className="detail-section">
              <h4>Patterns Detected</h4>
              <div className="patterns-list">
                {congruence.patterns?.map((pattern, i) => (
                  <span key={i} className="pattern-tag basic">{pattern}</span>
                ))}
                {congruence.advancedPatterns?.map((ap, i) => (
                  <span key={i} className={`pattern-tag advanced ${ap.severity?.toLowerCase()}`}>
                    {ap.pattern}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Top Signals */}
          <div className="detail-section">
            <h4>Top Signals</h4>
            <div className="signals-list">
              {getTopSignals(signals, 5).map(([name, value]) => (
                <div key={name} className="signal-item">
                  <span className="signal-name">{formatSignalName(name)}</span>
                  <div className="signal-bar">
                    <div
                      className="signal-fill"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className="signal-value">{(value * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Keywords */}
          {signals.detectedKeywords?.length > 0 && (
            <div className="detail-section">
              <h4>Detected Keywords</h4>
              <div className="keywords-list">
                {signals.detectedKeywords.map((kw, i) => (
                  <span key={i} className={`keyword-tag ${kw.category}`}>
                    {kw.keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {congruence.priorityPattern && (
            <div className="detail-section recommendation">
              <h4>Recommendation</h4>
              <p>
                <strong>Pattern:</strong> {congruence.priorityPattern.pattern}
              </p>
              <p>
                <strong>Description:</strong> {congruence.priorityPattern.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper functions
function getArchetypeEmoji(type) {
  const emojis = {
    'Seed': '🌱',
    'Mirror': '🪞',
    'Mender': '💝',
    'Librarian': '📚',
    'Conductor': '🎼',
    'Companion': '🤝',
    'Guardian': '🛡️',
    'Flamebearer': '🔥',
    'Guide': '🧭'
  };
  return emojis[type] || '❓';
}

function getArchetypeColor(type) {
  const colors = {
    'Seed': '#10b981',
    'Mirror': '#3b82f6',
    'Mender': '#ec4899',
    'Librarian': '#8b5cf6',
    'Conductor': '#f59e0b',
    'Companion': '#06b6d4',
    'Guardian': '#ef4444',
    'Flamebearer': '#f97316',
    'Guide': '#6366f1'
  };
  return colors[type] || '#9ca3af';
}

function getTopSignals(signals, count) {
  const numericSignals = Object.entries(signals)
    .filter(([key, value]) => typeof value === 'number' && key !== 'detectedKeywords')
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, count);
  return numericSignals;
}

function formatSignalName(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
