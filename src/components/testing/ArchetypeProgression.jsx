/**
 * Archetype Progression Visualization
 * Shows the emotional journey through archetypes
 */

import React from 'react';
import './ArchetypeProgression.css';

export function ArchetypeProgression({ messages }) {
  const userMessages = messages.filter(m => m.speaker === 'user' && m.analyzed);

  if (userMessages.length === 0) {
    return <div className="no-progression">No user messages to display</div>;
  }

  return (
    <div className="archetype-progression">
      <div className="progression-timeline">
        {userMessages.map((msg, index) => (
          <div key={index} className="progression-item">
            <div
              className="archetype-node"
              style={{ background: getArchetypeColor(msg.archetype.type) }}
              title={`${msg.archetype.type} (${(msg.archetype.confidence * 100).toFixed(0)}%)`}
            >
              <span className="node-emoji">{getArchetypeEmoji(msg.archetype.type)}</span>
              <span className="node-label">{msg.archetype.type}</span>
              <span className="node-confidence">
                {(msg.archetype.confidence * 100).toFixed(0)}%
              </span>
            </div>
            {index < userMessages.length - 1 && (
              <div className="progression-arrow">→</div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="progression-legend">
        <div className="legend-title">Emotional Journey:</div>
        <div className="legend-text">
          {describeProgression(userMessages)}
        </div>
      </div>
    </div>
  );
}

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

function describeProgression(messages) {
  const archetypes = messages.map(m => m.archetype.type);

  if (archetypes.length === 1) {
    return `Single ${archetypes[0]} state`;
  }

  const first = archetypes[0];
  const last = archetypes[archetypes.length - 1];
  const unique = new Set(archetypes);

  if (unique.size === 1) {
    return `Consistent ${first} state throughout conversation`;
  }

  const descriptions = {
    'Seed-Guide': 'Journey from uncertainty to wisdom and integration',
    'Mender-Companion': 'Healing journey leading to connection',
    'Guardian-Seed': 'From protection to new exploration',
    'Seed-Conductor': 'From uncertainty to clarity and structure',
    'Mender-Flamebearer': 'From healing to renewed purpose',
    'Seed-Mender': 'From exploration to vulnerability and healing',
    'Mender-Guide': 'From healing to wisdom and integration'
  };

  const key = `${first}-${last}`;
  return descriptions[key] || `Transition from ${first} through ${unique.size} states to ${last}`;
}
