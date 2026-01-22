/**
 * Generational Constellation UI
 *
 * A living map of lineage, patterns, and relational inheritance.
 * Visualizes the generational ladder, ancestral threads,
 * and the Pilgrim's position within their lineage.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// ========================================
// CONSTELLATION NODE
// ========================================

function ConstellationNode({
  node,
  position,
  isActive,
  isPilgrim,
  onClick
}) {
  const { x, y, generation, archetype, patterns } = node;

  const nodeColors = {
    gift: 'var(--cathedral-emerald, #34d399)',
    wound: 'var(--cathedral-rose, #f472b6)',
    lesson: 'var(--cathedral-amber, #fbbf24)',
    fear: 'var(--cathedral-red, #ef4444)'
  };

  const primaryPattern = patterns?.[0];
  const nodeColor = primaryPattern ? nodeColors[primaryPattern.type] : 'var(--cathedral-gold, #ffd780)';

  return (
    <g
      className={`constellation-node ${isActive ? 'constellation-node--active' : ''} ${isPilgrim ? 'constellation-node--pilgrim' : ''}`}
      onClick={() => onClick?.(node)}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow effect for active/pilgrim */}
      {(isActive || isPilgrim) && (
        <circle
          cx={x}
          cy={y}
          r={isPilgrim ? 40 : 30}
          fill={isPilgrim ? 'rgba(255, 215, 128, 0.15)' : 'rgba(255, 255, 255, 0.1)'}
          className="constellation-node__glow"
        />
      )}

      {/* Main node */}
      <circle
        cx={x}
        cy={y}
        r={isPilgrim ? 24 : 16}
        fill="rgba(5, 5, 16, 0.9)"
        stroke={nodeColor}
        strokeWidth={isPilgrim ? 3 : 2}
      />

      {/* Inner indicator for pattern type */}
      {primaryPattern && (
        <circle
          cx={x}
          cy={y}
          r={6}
          fill={nodeColor}
        />
      )}

      {/* Generation label */}
      <text
        x={x}
        y={y - 30}
        textAnchor="middle"
        className="constellation-node__generation"
        fill="rgba(255, 255, 255, 0.5)"
        fontSize="10"
      >
        {generation}
      </text>

      {/* Archetype label */}
      <text
        x={x}
        y={y + 40}
        textAnchor="middle"
        className="constellation-node__archetype"
        fill="rgba(255, 255, 255, 0.7)"
        fontSize="11"
      >
        {archetype}
      </text>
    </g>
  );
}

ConstellationNode.propTypes = {
  node: PropTypes.object.isRequired,
  position: PropTypes.string,
  isActive: PropTypes.bool,
  isPilgrim: PropTypes.bool,
  onClick: PropTypes.func
};

// ========================================
// CONSTELLATION THREAD
// ========================================

function ConstellationThread({ from, to, pattern, isActive }) {
  const threadColors = {
    inherited: 'rgba(255, 215, 128, 0.4)',
    broken: 'rgba(248, 113, 113, 0.4)',
    healed: 'rgba(52, 211, 153, 0.4)',
    repeating: 'rgba(251, 191, 36, 0.4)'
  };

  const strokeDasharray = pattern === 'broken' ? '8 4' : pattern === 'healed' ? '2 2' : 'none';

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={threadColors[pattern] || threadColors.inherited}
      strokeWidth={isActive ? 3 : 1.5}
      strokeDasharray={strokeDasharray}
      className="constellation-thread"
    />
  );
}

ConstellationThread.propTypes = {
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  pattern: PropTypes.string,
  isActive: PropTypes.bool
};

// ========================================
// PATTERN LEGEND
// ========================================

function PatternLegend() {
  const patterns = [
    { type: 'gift', label: 'Gift', color: 'var(--cathedral-emerald)' },
    { type: 'wound', label: 'Wound', color: 'var(--cathedral-rose)' },
    { type: 'lesson', label: 'Lesson', color: 'var(--cathedral-amber)' },
    { type: 'fear', label: 'Fear', color: 'var(--cathedral-red)' }
  ];

  const threads = [
    { type: 'inherited', label: 'Inherited', dash: 'none' },
    { type: 'broken', label: 'Broken', dash: '8 4' },
    { type: 'healed', label: 'Healed', dash: '2 2' }
  ];

  return (
    <div className="constellation-legend">
      <div className="constellation-legend__section">
        <h5>Patterns</h5>
        <div className="constellation-legend__items">
          {patterns.map(p => (
            <div key={p.type} className="constellation-legend__item">
              <span className="constellation-legend__dot" style={{ backgroundColor: p.color }} />
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="constellation-legend__section">
        <h5>Threads</h5>
        <div className="constellation-legend__items">
          {threads.map(t => (
            <div key={t.type} className="constellation-legend__item">
              <svg width="24" height="8">
                <line
                  x1="0" y1="4" x2="24" y2="4"
                  stroke="rgba(255, 215, 128, 0.6)"
                  strokeWidth="2"
                  strokeDasharray={t.dash}
                />
              </svg>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========================================
// NODE DETAIL PANEL
// ========================================

function NodeDetailPanel({ node, onClose }) {
  if (!node) return null;

  return (
    <div className="constellation-detail">
      <button className="constellation-detail__close" onClick={onClose}>
        \u{2715}
      </button>

      <div className="constellation-detail__header">
        <span className="constellation-detail__generation">{node.generation}</span>
        <h4>{node.archetype}</h4>
      </div>

      {node.name && (
        <p className="constellation-detail__name">{node.name}</p>
      )}

      {node.patterns && node.patterns.length > 0 && (
        <div className="constellation-detail__patterns">
          <h5>Patterns</h5>
          {node.patterns.map((pattern, i) => (
            <div key={i} className={`constellation-detail__pattern constellation-detail__pattern--${pattern.type}`}>
              <span className="constellation-detail__pattern-type">{pattern.type}</span>
              <p className="constellation-detail__pattern-name">{pattern.name}</p>
              <p className="constellation-detail__pattern-desc">{pattern.description}</p>
              {pattern.healingPath && (
                <p className="constellation-detail__healing">
                  <strong>Healing:</strong> {pattern.healingPath}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {node.message && (
        <div className="constellation-detail__message">
          <h5>Ancestral Message</h5>
          <p>"{node.message}"</p>
        </div>
      )}
    </div>
  );
}

NodeDetailPanel.propTypes = {
  node: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

// ========================================
// MAIN CONSTELLATION COMPONENT
// ========================================

function GenerationalConstellation({
  pilgrim,
  ancestors,
  threads,
  activeOverlays = [],
  className = ''
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Calculate node positions in a radial layout
  const { nodes, connections } = useMemo(() => {
    const centerX = 300;
    const centerY = 300;

    // Pilgrim at center
    const pilgrimNode = {
      ...pilgrim,
      x: centerX,
      y: centerY,
      isPilgrim: true
    };

    // Position ancestors around the center
    const ancestorNodes = (ancestors || []).map((ancestor, i) => {
      const angle = (i / (ancestors?.length || 1)) * 2 * Math.PI - Math.PI / 2;
      const radius = 150 + (ancestor.generation || 1) * 30;

      return {
        ...ancestor,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    // Build connections
    const connections = (threads || []).map(thread => {
      const fromNode = thread.from === 'pilgrim' ? pilgrimNode :
        ancestorNodes.find(n => n.id === thread.from);
      const toNode = thread.to === 'pilgrim' ? pilgrimNode :
        ancestorNodes.find(n => n.id === thread.to);

      return {
        ...thread,
        fromNode,
        toNode
      };
    }).filter(c => c.fromNode && c.toNode);

    return {
      nodes: [pilgrimNode, ...ancestorNodes],
      connections
    };
  }, [pilgrim, ancestors, threads]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node.id === selectedNode?.id ? null : node);
  }, [selectedNode]);

  const isNodeActive = useCallback((node) => {
    return hoveredNode?.id === node.id || selectedNode?.id === node.id;
  }, [hoveredNode, selectedNode]);

  return (
    <div className={`generational-constellation ${className}`}>
      <div className="constellation-header">
        <h3>Generational Constellation</h3>
        <p className="constellation-subtitle">
          Your place in the lineage web
        </p>
      </div>

      <div className="constellation-container">
        <svg
          viewBox="0 0 600 600"
          className="constellation-svg"
        >
          {/* Background elements */}
          <defs>
            <radialGradient id="constellation-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 215, 128, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <circle cx="300" cy="300" r="280" fill="url(#constellation-bg)" />

          {/* Generation rings */}
          {[1, 2, 3, 4].map(ring => (
            <circle
              key={ring}
              cx="300"
              cy="300"
              r={120 + ring * 40}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Threads */}
          {connections.map((conn, i) => (
            <ConstellationThread
              key={i}
              from={conn.fromNode}
              to={conn.toNode}
              pattern={conn.pattern}
              isActive={
                isNodeActive(conn.fromNode) || isNodeActive(conn.toNode)
              }
            />
          ))}

          {/* Nodes */}
          {nodes.map(node => (
            <ConstellationNode
              key={node.id || 'pilgrim'}
              node={node}
              isActive={isNodeActive(node)}
              isPilgrim={node.isPilgrim}
              onClick={handleNodeClick}
            />
          ))}
        </svg>

        {/* Legend */}
        <PatternLegend />
      </div>

      {/* Detail panel */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Overlay indicators */}
      {activeOverlays.length > 0 && (
        <div className="constellation-overlays">
          <h5>Active Overlays</h5>
          <div className="constellation-overlays__list">
            {activeOverlays.map((overlay, i) => (
              <span key={i} className="constellation-overlay-badge">
                {overlay}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

GenerationalConstellation.propTypes = {
  pilgrim: PropTypes.shape({
    id: PropTypes.string,
    archetype: PropTypes.string,
    patterns: PropTypes.array,
    generation: PropTypes.string
  }).isRequired,
  ancestors: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    archetype: PropTypes.string,
    patterns: PropTypes.array,
    generation: PropTypes.string,
    name: PropTypes.string
  })),
  threads: PropTypes.arrayOf(PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    pattern: PropTypes.oneOf(['inherited', 'broken', 'healed', 'repeating'])
  })),
  activeOverlays: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string
};

// ========================================
// STYLES
// ========================================

export const GenerationalConstellationStyles = `
.generational-constellation {
  background: rgba(5, 5, 16, 0.95);
  border: 1px solid rgba(255, 215, 128, 0.15);
  border-radius: 16px;
  padding: 24px;
}

.constellation-header {
  text-align: center;
  margin-bottom: 20px;
}

.constellation-header h3 {
  color: var(--cathedral-gold, #ffd780);
  margin: 0 0 4px 0;
  font-size: 20px;
}

.constellation-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  margin: 0;
}

.constellation-container {
  position: relative;
}

.constellation-svg {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: block;
}

.constellation-node {
  transition: all 200ms ease;
}

.constellation-node:hover circle {
  filter: brightness(1.2);
}

.constellation-node--active circle,
.constellation-node--pilgrim circle {
  filter: drop-shadow(0 0 8px rgba(255, 215, 128, 0.5));
}

.constellation-node__glow {
  animation: constellationPulse 2s ease-in-out infinite;
}

@keyframes constellationPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.constellation-thread {
  transition: all 200ms ease;
}

.constellation-legend {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 12px;
  font-size: 11px;
}

.constellation-legend__section {
  margin-bottom: 12px;
}

.constellation-legend__section:last-child {
  margin-bottom: 0;
}

.constellation-legend__section h5 {
  margin: 0 0 6px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.constellation-legend__items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.constellation-legend__item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
}

.constellation-legend__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.constellation-detail {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(5, 5, 16, 0.95);
  border: 1px solid rgba(255, 215, 128, 0.2);
  border-radius: 12px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.constellation-detail__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 16px;
}

.constellation-detail__close:hover {
  color: white;
}

.constellation-detail__header {
  margin-bottom: 12px;
}

.constellation-detail__generation {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
}

.constellation-detail__header h4 {
  margin: 4px 0 0 0;
  color: var(--cathedral-gold, #ffd780);
}

.constellation-detail__name {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  margin: 0 0 12px 0;
}

.constellation-detail__patterns h5,
.constellation-detail__message h5 {
  margin: 0 0 8px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
}

.constellation-detail__pattern {
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.constellation-detail__pattern--gift {
  background: rgba(52, 211, 153, 0.1);
  border-left: 3px solid var(--cathedral-emerald);
}

.constellation-detail__pattern--wound {
  background: rgba(244, 114, 182, 0.1);
  border-left: 3px solid var(--cathedral-rose);
}

.constellation-detail__pattern--lesson {
  background: rgba(251, 191, 36, 0.1);
  border-left: 3px solid var(--cathedral-amber);
}

.constellation-detail__pattern--fear {
  background: rgba(239, 68, 68, 0.1);
  border-left: 3px solid var(--cathedral-red);
}

.constellation-detail__pattern-type {
  font-size: 10px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

.constellation-detail__pattern-name {
  margin: 4px 0;
  font-weight: 600;
  color: white;
}

.constellation-detail__pattern-desc {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.constellation-detail__healing {
  margin: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.constellation-detail__message {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.constellation-detail__message p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

.constellation-overlays {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.constellation-overlays h5 {
  margin: 0 0 8px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
}

.constellation-overlays__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.constellation-overlay-badge {
  padding: 4px 8px;
  background: rgba(255, 215, 128, 0.1);
  border: 1px solid rgba(255, 215, 128, 0.2);
  border-radius: 4px;
  font-size: 11px;
  color: var(--cathedral-gold, #ffd780);
}
`;

export default GenerationalConstellation;
