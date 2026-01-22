/**
 * Relationship Axes Chart
 * Visualizes the 6-dimensional BaZi compatibility axes
 *
 * Axes:
 * 1. Elemental Harmony - How well elemental compositions support each other
 * 2. Day Master Affinity - Core identity compatibility
 * 3. Emotional Connection - Depth of intuitive understanding
 * 4. Practical Alignment - Shared approach to daily life
 * 5. Growth Potential - Opportunities for mutual development
 * 6. Timing Resonance - Alignment of life phases
 */

import React, { useState } from 'react';

// Axis display configuration
const AXIS_CONFIG = {
  elemental_harmony: {
    label: 'Elemental Harmony',
    labelCN: '五行和谐',
    color: '#10b981', // emerald
    icon: '+',
    description: 'How well your Five Element compositions support each other'
  },
  day_master_affinity: {
    label: 'Day Master Affinity',
    labelCN: '日主亲和',
    color: '#3b82f6', // blue
    icon: '+',
    description: 'Core identity compatibility between Day Masters'
  },
  emotional_connection: {
    label: 'Emotional Connection',
    labelCN: '情感连接',
    color: '#ec4899', // pink
    icon: '+',
    description: 'Depth of emotional and intuitive understanding'
  },
  practical_alignment: {
    label: 'Practical Alignment',
    labelCN: '务实对齐',
    color: '#f59e0b', // amber
    icon: '+',
    description: 'Shared approach to daily life and responsibilities'
  },
  growth_potential: {
    label: 'Growth Potential',
    labelCN: '成长潜力',
    color: '#8b5cf6', // violet
    icon: '+',
    description: 'Opportunities for mutual growth and development'
  },
  timing_resonance: {
    label: 'Timing Resonance',
    labelCN: '时机共振',
    color: '#06b6d4', // cyan
    icon: '+',
    description: 'Alignment of life phases and luck cycles'
  }
};

export default function RelationshipAxesChart({ axes, viewMode = 'bars' }) {
  const [selectedAxis, setSelectedAxis] = useState(null);
  const [currentView, setCurrentView] = useState(viewMode);

  if (!axes || Object.keys(axes).length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        No axes data available
      </div>
    );
  }

  // Convert axes object to array for rendering
  const axesArray = Object.entries(axes).map(([key, data]) => ({
    key,
    score: data.score || 0,
    description: data.description || AXIS_CONFIG[key]?.description || '',
    config: AXIS_CONFIG[key] || {
      label: key,
      color: '#6b7280',
      icon: '?',
      description: ''
    }
  }));

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setCurrentView('bars')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            currentView === 'bars'
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Bars
        </button>
        <button
          onClick={() => setCurrentView('radar')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            currentView === 'radar'
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Radar
        </button>
      </div>

      {/* Bar Chart View */}
      {currentView === 'bars' && (
        <div className="space-y-3">
          {axesArray.map((axis) => (
            <AxisBar
              key={axis.key}
              axis={axis}
              isSelected={selectedAxis === axis.key}
              onClick={() =>
                setSelectedAxis(selectedAxis === axis.key ? null : axis.key)
              }
            />
          ))}
        </div>
      )}

      {/* Radar Chart View */}
      {currentView === 'radar' && (
        <RadarChart
          axes={axesArray}
          selectedAxis={selectedAxis}
          onAxisClick={(key) =>
            setSelectedAxis(selectedAxis === key ? null : key)
          }
        />
      )}

      {/* Selected Axis Detail */}
      {selectedAxis && (
        <AxisDetail
          axis={axesArray.find((a) => a.key === selectedAxis)}
          onClose={() => setSelectedAxis(null)}
        />
      )}

      {/* Overall Average */}
      <div className="bg-black/20 rounded-lg p-4 text-center">
        <div className="text-xs text-white/60 mb-1">WEIGHTED AVERAGE</div>
        <div className="text-2xl font-bold text-white">
          {Math.round(
            axesArray.reduce((sum, a) => sum + a.score, 0) / axesArray.length * 100
          )}%
        </div>
      </div>
    </div>
  );
}

/**
 * Axis Bar Component
 */
function AxisBar({ axis, isSelected, onClick }) {
  const percent = Math.round(axis.score * 100);
  const { config } = axis;

  return (
    <div
      className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer transition-all border ${
        isSelected ? 'border-white/30 ring-1 ring-white/20' : 'border-white/5'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: config.color }}>
            {config.icon}
          </span>
          <span className="text-sm font-medium text-white">{config.label}</span>
          <span className="text-xs text-white/40">{config.labelCN}</span>
        </div>
        <span
          className="text-sm font-bold"
          style={{ color: getScoreColor(axis.score) }}
        >
          {percent}%
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: config.color
          }}
        />
      </div>
    </div>
  );
}

/**
 * Simple SVG Radar Chart
 */
function RadarChart({ axes, selectedAxis, onAxisClick }) {
  const size = 280;
  const center = size / 2;
  const radius = (size - 60) / 2;
  const angleStep = (2 * Math.PI) / axes.length;

  // Calculate points for the polygon
  const dataPoints = axes.map((axis, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = radius * axis.score;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 25) * Math.cos(angle),
      labelY: center + (radius + 25) * Math.sin(angle),
      axis
    };
  });

  // Create polygon path
  const polygonPath = dataPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ') + ' Z';

  // Create grid circles
  const gridCircles = [0.25, 0.5, 0.75, 1].map((scale) => (
    <circle
      key={scale}
      cx={center}
      cy={center}
      r={radius * scale}
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="1"
    />
  ));

  // Create axis lines
  const axisLines = dataPoints.map((p, i) => {
    const angle = angleStep * i - Math.PI / 2;
    return (
      <line
        key={i}
        x1={center}
        y1={center}
        x2={center + radius * Math.cos(angle)}
        y2={center + radius * Math.sin(angle)}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
    );
  });

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid */}
        {gridCircles}
        {axisLines}

        {/* Data polygon */}
        <path
          d={polygonPath}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill={p.axis.config.color}
              className="cursor-pointer hover:r-8"
              onClick={() => onAxisClick(p.axis.key)}
            />
            <text
              x={p.labelX}
              y={p.labelY}
              fill={selectedAxis === p.axis.key ? 'white' : 'rgba(255,255,255,0.6)'}
              fontSize="10"
              textAnchor="middle"
              dominantBaseline="middle"
              className="cursor-pointer"
              onClick={() => onAxisClick(p.axis.key)}
            >
              {Math.round(p.axis.score * 100)}%
            </text>
          </g>
        ))}

        {/* Center score */}
        <text
          x={center}
          y={center}
          fill="white"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {Math.round(
            axes.reduce((sum, a) => sum + a.score, 0) / axes.length * 100
          )}%
        </text>
      </svg>
    </div>
  );
}

/**
 * Axis Detail Panel
 */
function AxisDetail({ axis, onClose }) {
  if (!axis) return null;

  const percent = Math.round(axis.score * 100);
  const { config } = axis;

  return (
    <div
      className="bg-slate-800/80 rounded-lg p-4 border"
      style={{ borderColor: config.color }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" style={{ color: config.color }}>
            {config.icon}
          </span>
          <span className="font-bold text-white">{config.label}</span>
          <span className="text-sm text-white/40">{config.labelCN}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors"
        >
          X
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div
          className="text-3xl font-bold"
          style={{ color: getScoreColor(axis.score) }}
        >
          {percent}%
        </div>
        <div className="text-sm text-white/70">{getScoreLabel(axis.score)}</div>
      </div>

      <div className="text-sm text-white/60">{axis.description || config.description}</div>

      {/* Score Interpretation */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs text-white/40 mb-1">Interpretation:</div>
        <div className="text-sm text-white/80">
          {getAxisInterpretation(axis.key, axis.score)}
        </div>
      </div>
    </div>
  );
}

/**
 * Helper Functions
 */
function getScoreColor(score) {
  if (score >= 0.8) return '#10b981'; // emerald
  if (score >= 0.6) return '#3b82f6'; // blue
  if (score >= 0.4) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

function getScoreLabel(score) {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  if (score >= 0.4) return 'Moderate';
  return 'Needs Attention';
}

function getAxisInterpretation(axis, score) {
  const interpretations = {
    elemental_harmony: {
      high: 'Your elemental compositions naturally support and nourish each other. Energy flows smoothly between you.',
      mid: 'Some elemental resonance exists. You complement each other in certain areas but may need conscious balancing.',
      low: 'Your elemental profiles have significant differences. This creates dynamic tension that requires understanding.'
    },
    day_master_affinity: {
      high: 'Your core identities resonate deeply. You understand each other at a fundamental level.',
      mid: 'Your Day Masters have a working relationship. With awareness, you can support each other well.',
      low: 'Your Day Masters express differently. This creates variety but requires patience and acceptance.'
    },
    emotional_connection: {
      high: 'Strong emotional attunement. You sense and respond to each other intuitively.',
      mid: 'Emotional connection is present but may need cultivation. Communication helps bridge gaps.',
      low: 'Emotional wavelengths differ. Building understanding requires intentional effort.'
    },
    practical_alignment: {
      high: 'You approach daily life similarly. Practical matters flow with minimal friction.',
      mid: 'Some differences in practical approach. Coordination and compromise smooth the way.',
      low: 'Different approaches to daily life. Clear agreements help navigate practical matters.'
    },
    growth_potential: {
      high: 'Strong potential for mutual growth. You naturally catalyze each other\'s development.',
      mid: 'Growth opportunities exist through conscious effort. Challenge each other constructively.',
      low: 'Growth may come through challenge rather than ease. Embrace differences as teachers.'
    },
    timing_resonance: {
      high: 'Your life phases align well. You\'re in sync with where you each are in life.',
      mid: 'Some timing alignment. Be aware of different life phase needs and priorities.',
      low: 'Life phases may be out of sync. Patience and understanding of different timings helps.'
    }
  };

  const level = score >= 0.7 ? 'high' : score >= 0.4 ? 'mid' : 'low';
  return interpretations[axis]?.[level] || 'No interpretation available.';
}
