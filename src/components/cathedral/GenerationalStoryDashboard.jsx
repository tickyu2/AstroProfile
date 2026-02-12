/**
 * GenerationalStoryDashboard.jsx
 *
 * Narrative cockpit for viewing generational patterns as an unfolding story.
 * Combines timeline, heatmap, story beats, emotional arc, and timing overlay.
 *
 * Part of the Cathedral UI system for GENESIS OS Soul Discovery Engine.
 */

import React, { useState, useMemo } from 'react';
// ============================================================================
// STORY LADDER COMPONENT - Vertical Timeline G1-G7
// ============================================================================

const StoryLadder = ({ generations, selectedGen, onSelectGen }) => {
  const ladderStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 10px',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      minWidth: '120px',
    },
    rung: (isSelected, hasData) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100px',
      height: '50px',
      margin: '4px 0',
      background: isSelected
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : hasData
          ? 'rgba(102, 126, 234, 0.3)'
          : 'rgba(255, 255, 255, 0.05)',
      border: isSelected
        ? '2px solid #a855f7'
        : hasData
          ? '1px solid rgba(102, 126, 234, 0.5)'
          : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      cursor: hasData ? 'pointer' : 'default',
      opacity: hasData ? 1 : 0.4,
      transition: 'all 0.3s ease',
    }),
    label: {
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
    },
    connector: {
      width: '2px',
      height: '20px',
      background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.3) 100%)',
    },
    title: {
      color: '#a78bfa',
      fontSize: '12px',
      fontWeight: '500',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  };

  const generationLabels = ['G7', 'G6', 'G5', 'G4', 'G3', 'G2', 'G1'];
  const generationNames = [
    '5x Great',
    '4x Great',
    '3x Great',
    'Great-Great',
    'Great',
    'Grand',
    'Parents'
  ];

  return (
    <div style={ladderStyles.container}>
      <div style={ladderStyles.title}>Story Ladder</div>
      {generationLabels.map((label, index) => {
        const genData = generations?.find(g => g.id === label);
        const hasData = !!genData;
        const isSelected = selectedGen === label;

        return (
          <React.Fragment key={label}>
            <div
              style={ladderStyles.rung(isSelected, hasData)}
              onClick={() => hasData && onSelectGen(label)}
              title={generationNames[index]}
            >
              <span style={ladderStyles.label}>{label}</span>
            </div>
            {index < generationLabels.length - 1 && (
              <div style={ladderStyles.connector} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================================================
// PATTERN HEATMAP COMPONENT
// ============================================================================

const PatternHeatmap = ({ patterns, generations }) => {
  const heatmapStyles = {
    container: {
      background: 'rgba(26, 26, 46, 0.8)',
      borderRadius: '12px',
      padding: '20px',
      flex: 1,
    },
    title: {
      color: '#a78bfa',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'auto repeat(7, 1fr)',
      gap: '4px',
    },
    headerCell: {
      color: '#94a3b8',
      fontSize: '11px',
      textAlign: 'center',
      padding: '8px 4px',
    },
    rowLabel: {
      color: '#cbd5e1',
      fontSize: '12px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
    },
    cell: (intensity, type) => {
      const baseColors = {
        gift: { r: 34, g: 197, b: 94 },      // Green
        wound: { r: 239, g: 68, b: 68 },     // Red
        lesson: { r: 251, g: 191, b: 36 },   // Yellow
        fear: { r: 147, g: 51, b: 234 },     // Purple
        pattern: { r: 59, g: 130, b: 246 },  // Blue
      };
      const color = baseColors[type] || baseColors.pattern;
      const alpha = intensity * 0.8;

      return {
        width: '36px',
        height: '36px',
        borderRadius: '6px',
        background: intensity > 0
          ? `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
          : 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        cursor: intensity > 0 ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
      };
    },
    legend: {
      display: 'flex',
      gap: '16px',
      marginTop: '16px',
      flexWrap: 'wrap',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11px',
      color: '#94a3b8',
    },
    legendDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '3px',
      background: color,
    }),
  };

  const patternTypes = ['gift', 'wound', 'lesson', 'fear', 'pattern'];
  const patternLabels = {
    gift: 'Gifts',
    wound: 'Wounds',
    lesson: 'Lessons',
    fear: 'Fears',
    pattern: 'Patterns',
  };
  const genLabels = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'];

  const getIntensity = (type, gen) => {
    const patternData = patterns?.find(p => p.type === type && p.generation === gen);
    return patternData?.intensity || 0;
  };

  return (
    <div style={heatmapStyles.container}>
      <div style={heatmapStyles.title}>Pattern Heatmap</div>
      <div style={heatmapStyles.grid}>
        {/* Header row */}
        <div style={heatmapStyles.headerCell}></div>
        {genLabels.map(gen => (
          <div key={gen} style={heatmapStyles.headerCell}>{gen}</div>
        ))}

        {/* Data rows */}
        {patternTypes.map(type => (
          <React.Fragment key={type}>
            <div style={heatmapStyles.rowLabel}>{patternLabels[type]}</div>
            {genLabels.map(gen => (
              <div
                key={`${type}-${gen}`}
                style={heatmapStyles.cell(getIntensity(type, gen), type)}
                title={`${patternLabels[type]} in ${gen}: ${Math.round(getIntensity(type, gen) * 100)}%`}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={heatmapStyles.legend}>
        <div style={heatmapStyles.legendItem}>
          <div style={heatmapStyles.legendDot('rgb(34, 197, 94)')} />
          <span>Gifts</span>
        </div>
        <div style={heatmapStyles.legendItem}>
          <div style={heatmapStyles.legendDot('rgb(239, 68, 68)')} />
          <span>Wounds</span>
        </div>
        <div style={heatmapStyles.legendItem}>
          <div style={heatmapStyles.legendDot('rgb(251, 191, 36)')} />
          <span>Lessons</span>
        </div>
        <div style={heatmapStyles.legendItem}>
          <div style={heatmapStyles.legendDot('rgb(147, 51, 234)')} />
          <span>Fears</span>
        </div>
        <div style={heatmapStyles.legendItem}>
          <div style={heatmapStyles.legendDot('rgb(59, 130, 246)')} />
          <span>Patterns</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STORY BEATS COMPONENT - Clickable Narratives
// ============================================================================

const StoryBeats = ({ beats, selectedBeat, onSelectBeat }) => {
  const beatsStyles = {
    container: {
      background: 'rgba(26, 26, 46, 0.8)',
      borderRadius: '12px',
      padding: '20px',
      maxHeight: '300px',
      overflowY: 'auto',
    },
    title: {
      color: '#a78bfa',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    beat: (isSelected, beatType) => {
      const typeColors = {
        origin: '#22c55e',
        crisis: '#ef4444',
        triumph: '#fbbf24',
        transformation: '#a855f7',
        inheritance: '#3b82f6',
      };
      const color = typeColors[beatType] || '#64748b';

      return {
        padding: '12px 16px',
        marginBottom: '8px',
        background: isSelected
          ? `rgba(${hexToRgb(color)}, 0.2)`
          : 'rgba(255, 255, 255, 0.03)',
        border: isSelected
          ? `2px solid ${color}`
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      };
    },
    beatHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px',
    },
    beatTitle: {
      color: '#e2e8f0',
      fontSize: '14px',
      fontWeight: '600',
    },
    beatGen: {
      color: '#94a3b8',
      fontSize: '11px',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '2px 8px',
      borderRadius: '4px',
    },
    beatNarrative: {
      color: '#cbd5e1',
      fontSize: '13px',
      lineHeight: '1.5',
    },
    beatType: (type) => {
      const typeColors = {
        origin: '#22c55e',
        crisis: '#ef4444',
        triumph: '#fbbf24',
        transformation: '#a855f7',
        inheritance: '#3b82f6',
      };
      return {
        fontSize: '10px',
        color: typeColors[type] || '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginTop: '8px',
      };
    },
    emptyState: {
      color: '#64748b',
      fontSize: '13px',
      textAlign: 'center',
      padding: '40px 20px',
    },
  };

  // Helper to convert hex to rgb
  function hexToRgb(hex) {
    const colors = {
      '#22c55e': '34, 197, 94',
      '#ef4444': '239, 68, 68',
      '#fbbf24': '251, 191, 36',
      '#a855f7': '168, 85, 247',
      '#3b82f6': '59, 130, 246',
      '#64748b': '100, 116, 139',
    };
    return colors[hex] || '100, 116, 139';
  }

  if (!beats || beats.length === 0) {
    return (
      <div style={beatsStyles.container}>
        <div style={beatsStyles.title}>Story Beats</div>
        <div style={beatsStyles.emptyState}>
          No story beats discovered yet. Explore your generational patterns to reveal the narrative.
        </div>
      </div>
    );
  }

  return (
    <div style={beatsStyles.container}>
      <div style={beatsStyles.title}>Story Beats</div>
      {beats.map((beat, index) => (
        <div
          key={beat.id || index}
          style={beatsStyles.beat(selectedBeat === beat.id, beat.type)}
          onClick={() => onSelectBeat(beat.id)}
        >
          <div style={beatsStyles.beatHeader}>
            <span style={beatsStyles.beatTitle}>{beat.title}</span>
            <span style={beatsStyles.beatGen}>{beat.generation}</span>
          </div>
          <div style={beatsStyles.beatNarrative}>{beat.narrative}</div>
          <div style={beatsStyles.beatType(beat.type)}>{beat.type}</div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// EMOTIONAL ARC COMPONENT - SVG Curve
// ============================================================================

const EmotionalArc = ({ arcData, width = 400, height = 150 }) => {
  const arcStyles = {
    container: {
      background: 'rgba(26, 26, 46, 0.8)',
      borderRadius: '12px',
      padding: '20px',
    },
    title: {
      color: '#a78bfa',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    svg: {
      width: '100%',
      height: 'auto',
    },
  };

  // Generate smooth curve path from data points
  const generatePath = (points) => {
    if (!points || points.length < 2) return '';

    const xStep = width / (points.length - 1);
    const yScale = height * 0.8;
    const yOffset = height * 0.1;

    let path = `M 0 ${height - (points[0].value * yScale) - yOffset}`;

    for (let i = 1; i < points.length; i++) {
      const x = i * xStep;
      const y = height - (points[i].value * yScale) - yOffset;
      const prevX = (i - 1) * xStep;
      const prevY = height - (points[i - 1].value * yScale) - yOffset;

      // Bezier curve control points
      const cpX1 = prevX + xStep / 3;
      const cpY1 = prevY;
      const cpX2 = x - xStep / 3;
      const cpY2 = y;

      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
    }

    return path;
  };

  // Default data if none provided
  const defaultArcData = [
    { generation: 'G7', value: 0.3, emotion: 'uncertainty' },
    { generation: 'G6', value: 0.4, emotion: 'struggle' },
    { generation: 'G5', value: 0.5, emotion: 'resilience' },
    { generation: 'G4', value: 0.6, emotion: 'growth' },
    { generation: 'G3', value: 0.7, emotion: 'hope' },
    { generation: 'G2', value: 0.6, emotion: 'challenge' },
    { generation: 'G1', value: 0.8, emotion: 'integration' },
  ];

  const data = arcData || defaultArcData;
  const path = generatePath(data);
  const xStep = width / (data.length - 1);

  return (
    <div style={arcStyles.container}>
      <div style={arcStyles.title}>Emotional Arc</div>
      <svg viewBox={`0 0 ${width} ${height}`} style={arcStyles.svg}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(level => (
          <line
            key={level}
            x1="0"
            y1={height - (level * height * 0.8) - height * 0.1}
            x2={width}
            y2={height - (level * height * 0.8) - height * 0.1}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="arcFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
          </linearGradient>
        </defs>

        {/* Fill area under curve */}
        <path
          d={`${path} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#arcFill)"
        />

        {/* Main curve */}
        <path
          d={path}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = index * xStep;
          const y = height - (point.value * height * 0.8) - height * 0.1;

          return (
            <g key={point.generation}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="#1a1a2e"
                stroke="#a855f7"
                strokeWidth="2"
              />
              <text
                x={x}
                y={height - 5}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
              >
                {point.generation}
              </text>
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="9"
              >
                {point.emotion}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ============================================================================
// TIMING OVERLAY DISPLAY
// ============================================================================

const TimingOverlay = ({ timing }) => {
  const timingStyles = {
    container: {
      background: 'rgba(26, 26, 46, 0.8)',
      borderRadius: '12px',
      padding: '20px',
    },
    title: {
      color: '#a78bfa',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
    },
    item: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
      padding: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    label: {
      color: '#94a3b8',
      fontSize: '11px',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    value: {
      color: '#e2e8f0',
      fontSize: '14px',
      fontWeight: '500',
    },
    indicator: (status) => {
      const colors = {
        active: '#22c55e',
        dormant: '#64748b',
        awakening: '#fbbf24',
        integrating: '#3b82f6',
      };
      return {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: colors[status] || '#64748b',
        marginRight: '8px',
      };
    },
    narrative: {
      gridColumn: '1 / -1',
      color: '#cbd5e1',
      fontSize: '13px',
      lineHeight: '1.5',
      fontStyle: 'italic',
      padding: '12px',
      background: 'rgba(168, 85, 247, 0.1)',
      borderRadius: '8px',
      borderLeft: '3px solid #a855f7',
    },
  };

  const defaultTiming = {
    currentPhase: 'Integration',
    cyclePosition: 'Waxing',
    ancestralWindow: 'Open',
    status: 'active',
    narrative: 'The patterns of your lineage are currently in an active integration phase. This is an optimal time for ancestral healing work.',
  };

  const data = timing || defaultTiming;

  return (
    <div style={timingStyles.container}>
      <div style={timingStyles.title}>Timing Overlay</div>
      <div style={timingStyles.grid}>
        <div style={timingStyles.item}>
          <div style={timingStyles.label}>Current Phase</div>
          <div style={timingStyles.value}>
            <span style={timingStyles.indicator(data.status)} />
            {data.currentPhase}
          </div>
        </div>
        <div style={timingStyles.item}>
          <div style={timingStyles.label}>Cycle Position</div>
          <div style={timingStyles.value}>{data.cyclePosition}</div>
        </div>
        <div style={timingStyles.item}>
          <div style={timingStyles.label}>Ancestral Window</div>
          <div style={timingStyles.value}>{data.ancestralWindow}</div>
        </div>
        <div style={timingStyles.item}>
          <div style={timingStyles.label}>Status</div>
          <div style={timingStyles.value} style={{ textTransform: 'capitalize' }}>
            {data.status}
          </div>
        </div>
        <div style={timingStyles.narrative}>
          {data.narrative}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const GenerationalStoryDashboard = ({
  generations = [],
  patterns = [],
  storyBeats = [],
  emotionalArc = null,
  timing = null,
  onGenerationSelect,
  onBeatSelect,
  onPatternClick,
}) => {
  const [selectedGeneration, setSelectedGeneration] = useState('G1');
  const [selectedBeat, setSelectedBeat] = useState(null);

  const dashboardStyles = {
    container: {
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      borderRadius: '16px',
      padding: '24px',
      minHeight: '600px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    title: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    titleIcon: {
      fontSize: '28px',
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '14px',
      marginTop: '4px',
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      gap: '20px',
    },
    rightPanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    topRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    bottomRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    fullWidth: {
      gridColumn: '1 / -1',
    },
  };

  const handleGenerationSelect = (gen) => {
    setSelectedGeneration(gen);
    onGenerationSelect?.(gen);
  };

  const handleBeatSelect = (beatId) => {
    setSelectedBeat(beatId);
    onBeatSelect?.(beatId);
  };

  // Filter data by selected generation
  const filteredPatterns = useMemo(() => {
    return patterns.filter(p => !selectedGeneration || p.generation === selectedGeneration);
  }, [patterns, selectedGeneration]);

  const filteredBeats = useMemo(() => {
    return storyBeats.filter(b => !selectedGeneration || b.generation === selectedGeneration);
  }, [storyBeats, selectedGeneration]);

  return (
    <div style={dashboardStyles.container}>
      {/* Header */}
      <div style={dashboardStyles.header}>
        <div>
          <div style={dashboardStyles.title}>
            <span style={dashboardStyles.titleIcon}>📖</span>
            Generational Story Dashboard
          </div>
          <div style={dashboardStyles.subtitle}>
            Your family's narrative unfolds across seven generations
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={dashboardStyles.mainContent}>
        {/* Story Ladder */}
        <StoryLadder
          generations={generations}
          selectedGen={selectedGeneration}
          onSelectGen={handleGenerationSelect}
        />

        {/* Right Panel */}
        <div style={dashboardStyles.rightPanel}>
          {/* Top Row: Heatmap and Emotional Arc */}
          <div style={dashboardStyles.topRow}>
            <PatternHeatmap
              patterns={patterns}
              generations={generations}
            />
            <EmotionalArc arcData={emotionalArc} />
          </div>

          {/* Bottom Row: Story Beats and Timing */}
          <div style={dashboardStyles.bottomRow}>
            <StoryBeats
              beats={filteredBeats.length > 0 ? filteredBeats : storyBeats}
              selectedBeat={selectedBeat}
              onSelectBeat={handleBeatSelect}
            />
            <TimingOverlay timing={timing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationalStoryDashboard;
