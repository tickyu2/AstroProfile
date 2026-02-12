/**
 * ModeAwareConstellationMap.jsx
 *
 * An ancestral constellation map that transforms based on Cathedral mode.
 *
 * - Pilgrim: "Lantern Stars" — nodes glow softly, lines curve organically
 * - Scholar: "Annotated Lineage Diagram" — nodes have footnotes, labels
 * - Architect: "Structural Genealogy Grid" — geometric, weighted, dependencies
 * - Sovereign: "Lineage of Power" — key ancestors, influence arcs
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useMode } from './modeSystem';

// ============================================================================
// CONSTELLATION CONFIGURATIONS
// ============================================================================

const CONSTELLATION_CONFIGS = {
  pilgrim: {
    name: 'Lantern Stars',
    description: 'Ancestry as a living story',
    nodeStyle: 'lantern',
    lineStyle: 'curved',
    showLabels: true,
    showInfluence: false,
    showAnnotations: false,
    hoverEffect: 'emotional_note',
    animation: 'glow_pulse',
  },
  scholar: {
    name: 'Annotated Lineage Diagram',
    description: 'Ancestry as a text to study',
    nodeStyle: 'dot',
    lineStyle: 'solid',
    showLabels: true,
    showInfluence: false,
    showAnnotations: true,
    hoverEffect: 'definition',
    animation: 'highlight',
  },
  architect: {
    name: 'Structural Genealogy Grid',
    description: 'Ancestry as a system of forces',
    nodeStyle: 'geometric',
    lineStyle: 'connector',
    showLabels: true,
    showInfluence: true,
    showAnnotations: true,
    hoverEffect: 'data',
    animation: 'scan',
  },
  sovereign: {
    name: 'Lineage of Power',
    description: 'Ancestry as a legacy to command',
    nodeStyle: 'diamond',
    lineStyle: 'bold',
    showLabels: true,
    showInfluence: true,
    showAnnotations: false,
    hoverEffect: 'strategic',
    animation: 'pulse',
    filterByInfluence: true,
    influenceThreshold: 0.5,
  },
};

// ============================================================================
// SAMPLE ANCESTRAL DATA
// ============================================================================

const SAMPLE_ANCESTORS = [
  { id: 'self', label: 'You', generation: 0, type: 'self', influence: 1.0, x: 200, y: 250 },
  { id: 'mother', label: 'Mother', generation: 1, type: 'maternal', influence: 0.9, x: 120, y: 180 },
  { id: 'father', label: 'Father', generation: 1, type: 'paternal', influence: 0.85, x: 280, y: 180 },
  { id: 'mgm', label: 'Maternal Grandmother', generation: 2, type: 'maternal', influence: 0.7, x: 60, y: 100 },
  { id: 'mgf', label: 'Maternal Grandfather', generation: 2, type: 'maternal', influence: 0.6, x: 140, y: 100 },
  { id: 'pgm', label: 'Paternal Grandmother', generation: 2, type: 'paternal', influence: 0.65, x: 260, y: 100 },
  { id: 'pgf', label: 'Paternal Grandfather', generation: 2, type: 'paternal', influence: 0.75, x: 340, y: 100 },
];

const SAMPLE_EDGES = [
  { from: 'self', to: 'mother' },
  { from: 'self', to: 'father' },
  { from: 'mother', to: 'mgm' },
  { from: 'mother', to: 'mgf' },
  { from: 'father', to: 'pgm' },
  { from: 'father', to: 'pgf' },
];

// ============================================================================
// NODE COMPONENTS BY MODE
// ============================================================================

const LanternNode = ({ node, isSelected, onSelect }) => {
  const size = 20 + node.influence * 15;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect?.(node)}
    >
      <circle
        r={size}
        fill="rgba(255, 215, 128, 0.3)"
        stroke="rgba(255, 215, 128, 0.6)"
        strokeWidth={isSelected ? 3 : 1}
        style={{
          filter: isSelected ? 'drop-shadow(0 0 15px rgba(255, 215, 128, 0.8))' : 'drop-shadow(0 0 8px rgba(255, 215, 128, 0.4))',
        }}
      >
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        y={size + 16}
        textAnchor="middle"
        fill="#ffd780"
        fontSize="11"
        fontWeight={isSelected ? '600' : '400'}
      >
        {node.label}
      </text>
    </g>
  );
};

const DotNode = ({ node, isSelected, onSelect, annotation }) => {
  const size = 8 + node.generation * 2;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect?.(node)}
    >
      <circle
        r={size}
        fill={isSelected ? '#e8d5a3' : 'transparent'}
        stroke="#e8d5a3"
        strokeWidth={isSelected ? 2 : 1}
      />
      <text
        y={size + 14}
        textAnchor="middle"
        fill="#e8d5a3"
        fontSize="10"
        fontWeight={isSelected ? '600' : '400'}
      >
        {node.label}
      </text>
      {annotation && (
        <text
          y={size + 26}
          textAnchor="middle"
          fill="#64748b"
          fontSize="9"
          fontStyle="italic"
        >
          {annotation}
        </text>
      )}
    </g>
  );
};

const GeometricNode = ({ node, isSelected, onSelect }) => {
  const size = 12 + node.influence * 8;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect?.(node)}
    >
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        fill={isSelected ? 'rgba(96, 165, 250, 0.3)' : 'rgba(96, 165, 250, 0.1)'}
        stroke="#60a5fa"
        strokeWidth={isSelected ? 2 : 1}
        transform="rotate(45)"
      />
      <text
        y={size / 2 + 14}
        textAnchor="middle"
        fill="#60a5fa"
        fontSize="10"
        fontFamily="'JetBrains Mono', monospace"
      >
        [{node.id}]
      </text>
      <text
        y={size / 2 + 26}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="9"
      >
        w: {node.influence.toFixed(2)}
      </text>
    </g>
  );
};

const DiamondNode = ({ node, isSelected, onSelect }) => {
  // Filter low-influence nodes in Sovereign mode
  if (node.influence < 0.5 && node.generation > 0) return null;

  const size = 16 + node.influence * 12;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect?.(node)}
    >
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        fill={isSelected ? 'rgba(251, 191, 36, 0.4)' : 'rgba(251, 191, 36, 0.2)'}
        stroke="#fbbf24"
        strokeWidth={isSelected ? 2 : 1}
        transform="rotate(45)"
        style={{
          filter: isSelected ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.6))' : 'none',
        }}
      />
      <text
        y={size / 2 + 14}
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="10"
        fontWeight="600"
        textTransform="uppercase"
      >
        {node.label.split(' ')[0].toUpperCase()}
      </text>
    </g>
  );
};

// ============================================================================
// EDGE COMPONENTS BY MODE
// ============================================================================

const CurvedEdge = ({ from, to }) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 20;
  const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

  return (
    <path
      d={path}
      fill="none"
      stroke="rgba(255, 215, 128, 0.3)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  );
};

const SolidEdge = ({ from, to, label }) => (
  <g>
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="rgba(232, 213, 163, 0.4)"
      strokeWidth="1"
    />
    {label && (
      <text
        x={(from.x + to.x) / 2}
        y={(from.y + to.y) / 2 - 5}
        textAnchor="middle"
        fill="#64748b"
        fontSize="8"
      >
        {label}
      </text>
    )}
  </g>
);

const ConnectorEdge = ({ from, to, weight }) => {
  const opacity = 0.3 + weight * 0.5;

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={`rgba(96, 165, 250, ${opacity})`}
      strokeWidth={1 + weight * 2}
      strokeDasharray={weight < 0.5 ? '4 4' : 'none'}
    />
  );
};

const BoldEdge = ({ from, to }) => {
  // Filter edges for low-influence nodes
  if (from.influence < 0.5 || to.influence < 0.5) return null;

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="rgba(251, 191, 36, 0.5)"
      strokeWidth="3"
    />
  );
};

// ============================================================================
// HOVER PANELS BY MODE
// ============================================================================

const HoverPanel = ({ node, mode, position }) => {
  if (!node) return null;

  const panelStyles = {
    container: {
      position: 'absolute',
      left: position.x + 20,
      top: position.y - 10,
      padding: '12px 16px',
      background: 'rgba(15, 15, 30, 0.95)',
      borderRadius: '8px',
      border: '1px solid var(--aura-border-medium, rgba(255, 255, 255, 0.2))',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      maxWidth: '200px',
      zIndex: 100,
    },
    title: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--aura-text-highlight, #fff)',
      marginBottom: '8px',
    },
    content: {
      fontSize: '12px',
      color: '#94a3b8',
      lineHeight: '1.5',
    },
    stat: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '8px',
      fontSize: '11px',
    },
    statLabel: {
      color: '#64748b',
    },
    statValue: {
      color: 'var(--aura-primary, #a855f7)',
      fontWeight: '600',
    },
  };

  const getContent = () => {
    switch (mode) {
      case 'pilgrim':
        return (
          <>
            <div style={panelStyles.title}>{node.label}</div>
            <div style={panelStyles.content}>
              {node.type === 'maternal'
                ? 'Carries the emotional patterns of nurturing and intuition.'
                : 'Carries the patterns of action and external identity.'}
            </div>
          </>
        );
      case 'scholar':
        return (
          <>
            <div style={panelStyles.title}>{node.label}</div>
            <div style={panelStyles.content}>
              Generation {node.generation} • {node.type} lineage
            </div>
            <div style={panelStyles.stat}>
              <span style={panelStyles.statLabel}>Influence Factor</span>
              <span style={panelStyles.statValue}>{node.influence.toFixed(2)}</span>
            </div>
          </>
        );
      case 'architect':
        return (
          <>
            <div style={panelStyles.title}>[{node.id}] {node.label}</div>
            <div style={panelStyles.stat}>
              <span style={panelStyles.statLabel}>Generation</span>
              <span style={panelStyles.statValue}>{node.generation}</span>
            </div>
            <div style={panelStyles.stat}>
              <span style={panelStyles.statLabel}>Type</span>
              <span style={panelStyles.statValue}>{node.type}</span>
            </div>
            <div style={panelStyles.stat}>
              <span style={panelStyles.statLabel}>Weight</span>
              <span style={panelStyles.statValue}>{node.influence.toFixed(3)}</span>
            </div>
          </>
        );
      case 'sovereign':
        return (
          <>
            <div style={panelStyles.title}>{node.label.toUpperCase()}</div>
            <div style={panelStyles.content}>
              {node.influence >= 0.7
                ? 'Strong influence on your leadership patterns.'
                : 'Secondary influence in your lineage.'}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={panelStyles.container}>
      {getContent()}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ModeAwareConstellationMap = ({
  ancestors = SAMPLE_ANCESTORS,
  edges = SAMPLE_EDGES,
  onSelectAncestor,
  className = '',
}) => {
  const { mode } = useMode();
  const config = CONSTELLATION_CONFIGS[mode] || CONSTELLATION_CONFIGS.pilgrim;

  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Filter ancestors for Sovereign mode
  const visibleAncestors = useMemo(() => {
    if (config.filterByInfluence) {
      return ancestors.filter(a => a.influence >= config.influenceThreshold || a.generation === 0);
    }
    return ancestors;
  }, [ancestors, config]);

  // Get node data by ID
  const getNode = useCallback((id) => {
    return ancestors.find(a => a.id === id);
  }, [ancestors]);

  // Handle node selection
  const handleSelectNode = useCallback((node) => {
    setSelectedNode(node);
    onSelectAncestor?.(node);
  }, [onSelectAncestor]);

  // Handle mouse move for hover panel positioning
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Render node based on mode
  const renderNode = (node) => {
    const isSelected = selectedNode?.id === node.id;
    const props = { node, isSelected, onSelect: handleSelectNode };

    switch (config.nodeStyle) {
      case 'lantern':
        return <LanternNode key={node.id} {...props} />;
      case 'dot':
        return <DotNode key={node.id} {...props} annotation={config.showAnnotations ? `Gen ${node.generation}` : null} />;
      case 'geometric':
        return <GeometricNode key={node.id} {...props} />;
      case 'diamond':
        return <DiamondNode key={node.id} {...props} />;
      default:
        return <LanternNode key={node.id} {...props} />;
    }
  };

  // Render edge based on mode
  const renderEdge = (edge) => {
    const from = getNode(edge.from);
    const to = getNode(edge.to);
    if (!from || !to) return null;

    const key = `${edge.from}-${edge.to}`;

    switch (config.lineStyle) {
      case 'curved':
        return <CurvedEdge key={key} from={from} to={to} />;
      case 'solid':
        return <SolidEdge key={key} from={from} to={to} label={config.showAnnotations ? edge.label : null} />;
      case 'connector':
        return <ConnectorEdge key={key} from={from} to={to} weight={to.influence} />;
      case 'bold':
        return <BoldEdge key={key} from={from} to={to} />;
      default:
        return <CurvedEdge key={key} from={from} to={to} />;
    }
  };

  const containerStyles = {
    container: {
      position: 'relative',
      background: 'var(--aura-surface-1, rgba(0, 0, 0, 0.2))',
      borderRadius: '16px',
      border: '1px solid var(--aura-border-subtle, rgba(255, 255, 255, 0.1))',
      overflow: 'hidden',
    },
    header: {
      padding: '16px 20px',
      borderBottom: '1px solid var(--aura-border-subtle, rgba(255, 255, 255, 0.1))',
    },
    title: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--aura-text-highlight, #fff)',
      marginBottom: '4px',
    },
    description: {
      fontSize: '12px',
      color: '#64748b',
    },
    svgContainer: {
      padding: '20px',
    },
    svg: {
      width: '100%',
      height: '300px',
    },
  };

  return (
    <div
      style={containerStyles.container}
      className={`mode-aware-constellation-map ${className}`}
      onMouseMove={handleMouseMove}
    >
      <header style={containerStyles.header}>
        <div style={containerStyles.title}>{config.name}</div>
        <div style={containerStyles.description}>{config.description}</div>
      </header>

      <div style={containerStyles.svgContainer}>
        <svg style={containerStyles.svg} viewBox="0 0 400 300">
          {/* Render edges first (below nodes) */}
          <g className="edges">
            {edges.map(renderEdge)}
          </g>

          {/* Render nodes */}
          <g className="nodes">
            {visibleAncestors.map((node) => (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {renderNode(node)}
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Hover panel */}
      {hoveredNode && (
        <HoverPanel node={hoveredNode} mode={mode} position={mousePosition} />
      )}
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ModeAwareConstellationMap;

export {
  CONSTELLATION_CONFIGS,
  SAMPLE_ANCESTORS,
  SAMPLE_EDGES,
  LanternNode,
  DotNode,
  GeometricNode,
  DiamondNode,
  HoverPanel,
};
