/**
 * ModeAwarePilgrimMap.jsx
 *
 * A journey map that changes metaphor, layout, and visual style
 * depending on the current Cathedral mode.
 *
 * - Pilgrim: "The Lantern Path" — curved, glowing, mythic
 * - Scholar: "The Annotated Path" — linear, footnoted, academic
 * - Architect: "The Blueprint Sequence" — grid-aligned, dependencies
 * - Sovereign: "The Strategic Arc" — minimalist, decisive
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMode, CATHEDRAL_MODES } from './modeSystem';

// ============================================================================
// JOURNEY MAP CONFIGURATIONS
// ============================================================================

const MAP_CONFIGS = {
  pilgrim: {
    name: 'The Lantern Path',
    description: 'A mythic journey guided by gentle light',
    layout: 'curved',
    nodeStyle: 'lantern',
    lineStyle: 'flowing',
    animation: 'glow_pulse',
    labels: {
      birth: 'Birth',
      foundations: 'Foundations',
      persona: 'Persona',
      ritual: 'Ritual',
      ancestral: 'Ancestral',
      mythos: 'Mythos',
      sovereign: 'Sovereign',
      completion: 'Completion',
    },
  },
  scholar: {
    name: 'The Annotated Path',
    description: 'A manuscript-style journey with footnotes',
    layout: 'linear',
    nodeStyle: 'numbered',
    lineStyle: 'solid',
    animation: 'highlight',
    labels: {
      birth: 'Birth¹',
      foundations: 'Foundations²',
      persona: 'Persona³',
      ritual: 'Ritual⁴',
      ancestral: 'Ancestral⁵',
      mythos: 'Mythos⁶',
      sovereign: 'Sovereign⁷',
      completion: 'Completion⁸',
    },
    footnotes: {
      birth: 'Natal chart analysis',
      foundations: 'Elemental and modal distribution',
      persona: 'Archetype identification',
      ritual: 'Pattern transformation',
      ancestral: 'Generational inheritance',
      mythos: 'Symbolic narrative',
      sovereign: 'Leadership positioning',
      completion: 'Integration synthesis',
    },
  },
  architect: {
    name: 'The Blueprint Sequence',
    description: 'A structural system diagram with dependencies',
    layout: 'grid',
    nodeStyle: 'node',
    lineStyle: 'connector',
    animation: 'scan',
    labels: {
      birth: '[Birth]',
      foundations: '[Foundations]',
      persona: '[Persona]',
      ritual: '[Ritual]',
      ancestral: '[Ancestral]',
      mythos: '[Mythos]',
      sovereign: '[Sovereign]',
      completion: '[Completion]',
    },
    dependencies: {
      birth: [],
      foundations: ['birth'],
      persona: ['birth'],
      ritual: ['foundations', 'persona'],
      ancestral: ['ritual'],
      mythos: ['ancestral'],
      sovereign: ['mythos'],
      completion: ['sovereign'],
    },
  },
  sovereign: {
    name: 'The Strategic Arc',
    description: 'A decisive command path',
    layout: 'arc',
    nodeStyle: 'diamond',
    lineStyle: 'bold',
    animation: 'command',
    labels: {
      birth: 'ORIGIN',
      foundations: 'FOUNDATION',
      persona: 'IDENTITY',
      ritual: 'POWER',
      ancestral: 'LINEAGE',
      mythos: 'DESTINY',
      sovereign: 'AUTHORITY',
      completion: 'COMPLETION',
    },
  },
};

// ============================================================================
// JOURNEY STEPS
// ============================================================================

const JOURNEY_STEPS = [
  { id: 'birth', order: 0 },
  { id: 'foundations', order: 1 },
  { id: 'persona', order: 2 },
  { id: 'ritual', order: 3 },
  { id: 'ancestral', order: 4 },
  { id: 'mythos', order: 5 },
  { id: 'sovereign', order: 6 },
  { id: 'completion', order: 7 },
];

// ============================================================================
// PILGRIM (LANTERN) MAP
// ============================================================================

const LanternPathMap = ({ steps, current, completed, onStepClick, config }) => {
  const mapStyles = {
    container: {
      position: 'relative',
      padding: '40px 20px',
      minHeight: '200px',
    },
    path: {
      position: 'absolute',
      top: '50%',
      left: '5%',
      right: '5%',
      height: '4px',
      background: 'linear-gradient(90deg, rgba(255, 215, 128, 0.3), rgba(255, 215, 128, 0.1))',
      borderRadius: '2px',
      transform: 'translateY(-50%)',
    },
    pathFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #ffd780, #e6b84d)',
      borderRadius: '2px',
      boxShadow: '0 0 15px rgba(255, 215, 128, 0.5)',
      transition: 'width 0.5s ease',
    },
    nodesContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 1,
    },
    node: (isActive, isCompleted) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
    }),
    lantern: (isActive, isCompleted) => ({
      width: isActive ? '48px' : '36px',
      height: isActive ? '48px' : '36px',
      borderRadius: '50%',
      background: isCompleted
        ? 'radial-gradient(circle, #ffd780 0%, #e6b84d 100%)'
        : isActive
          ? 'radial-gradient(circle, #ffd780 0%, #c4a040 100%)'
          : 'rgba(255, 215, 128, 0.2)',
      boxShadow: isActive
        ? '0 0 30px rgba(255, 215, 128, 0.6), 0 0 60px rgba(255, 215, 128, 0.3)'
        : isCompleted
          ? '0 0 15px rgba(255, 215, 128, 0.4)'
          : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      animation: isActive ? 'lanternGlow 2s ease-in-out infinite' : 'none',
    }),
    label: (isActive) => ({
      marginTop: '12px',
      fontSize: '13px',
      fontWeight: isActive ? '600' : '400',
      color: isActive ? '#ffd780' : '#94a3b8',
      transition: 'all 0.2s ease',
    }),
    icon: {
      fontSize: '16px',
    },
  };

  const progress = useMemo(() => {
    const currentIndex = steps.findIndex(s => s.id === current);
    return ((currentIndex + 1) / steps.length) * 100;
  }, [steps, current]);

  return (
    <div style={mapStyles.container}>
      <div style={mapStyles.path}>
        <div style={{ ...mapStyles.pathFill, width: `${progress}%` }} />
      </div>
      <div style={mapStyles.nodesContainer}>
        {steps.map((step) => {
          const isActive = step.id === current;
          const isCompleted = completed.includes(step.id);
          return (
            <div
              key={step.id}
              style={mapStyles.node(isActive, isCompleted)}
              onClick={() => onStepClick?.(step.id)}
            >
              <div style={mapStyles.lantern(isActive, isCompleted)}>
                {isCompleted && <span style={mapStyles.icon}>✓</span>}
              </div>
              <span style={mapStyles.label(isActive)}>
                {config.labels[step.id]}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes lanternGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 128, 0.5); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 128, 0.8); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// SCHOLAR (ANNOTATED) MAP
// ============================================================================

const AnnotatedPathMap = ({ steps, current, completed, onStepClick, config }) => {
  const mapStyles = {
    container: {
      padding: '30px 20px',
    },
    timeline: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      borderBottom: '2px solid rgba(232, 213, 163, 0.3)',
      paddingBottom: '20px',
    },
    step: (isActive, isCompleted) => ({
      flex: 1,
      textAlign: 'center',
      cursor: 'pointer',
      opacity: isCompleted || isActive ? 1 : 0.6,
    }),
    marker: (isActive, isCompleted) => ({
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: `2px solid ${isCompleted ? '#e8d5a3' : isActive ? '#e8d5a3' : '#64748b'}`,
      background: isCompleted ? '#e8d5a3' : 'transparent',
      margin: '0 auto 8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: isCompleted ? '#1a1a20' : '#e8d5a3',
      fontWeight: '600',
    }),
    label: (isActive) => ({
      fontSize: '12px',
      fontWeight: isActive ? '600' : '400',
      color: isActive ? '#e8d5a3' : '#94a3b8',
    }),
    footnotes: {
      marginTop: '20px',
      padding: '16px',
      background: 'rgba(232, 213, 163, 0.05)',
      borderRadius: '8px',
      borderLeft: '3px solid rgba(232, 213, 163, 0.3)',
    },
    footnote: {
      fontSize: '12px',
      color: '#94a3b8',
      marginBottom: '4px',
    },
    footnoteNumber: {
      color: '#e8d5a3',
      marginRight: '8px',
    },
  };

  return (
    <div style={mapStyles.container}>
      <div style={mapStyles.timeline}>
        {steps.map((step, index) => {
          const isActive = step.id === current;
          const isCompleted = completed.includes(step.id);
          return (
            <div
              key={step.id}
              style={mapStyles.step(isActive, isCompleted)}
              onClick={() => onStepClick?.(step.id)}
            >
              <div style={mapStyles.marker(isActive, isCompleted)}>
                {index + 1}
              </div>
              <div style={mapStyles.label(isActive)}>
                {config.labels[step.id]}
              </div>
            </div>
          );
        })}
      </div>
      <div style={mapStyles.footnotes}>
        {steps.map((step, index) => (
          <div key={step.id} style={mapStyles.footnote}>
            <span style={mapStyles.footnoteNumber}>{index + 1}.</span>
            {config.footnotes[step.id]}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// ARCHITECT (BLUEPRINT) MAP
// ============================================================================

const BlueprintSequenceMap = ({ steps, current, completed, onStepClick, config }) => {
  const mapStyles = {
    container: {
      padding: '20px',
      background: `
        linear-gradient(rgba(96, 165, 250, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(96, 165, 250, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      borderRadius: '8px',
      border: '1px solid rgba(96, 165, 250, 0.2)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
    },
    node: (isActive, isCompleted) => ({
      padding: '12px',
      background: isActive
        ? 'rgba(96, 165, 250, 0.15)'
        : 'rgba(96, 165, 250, 0.05)',
      border: `1px solid ${isActive ? '#60a5fa' : 'rgba(96, 165, 250, 0.3)'}`,
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
    label: {
      fontSize: '12px',
      fontFamily: "'JetBrains Mono', monospace",
      color: '#60a5fa',
      marginBottom: '4px',
    },
    deps: {
      fontSize: '10px',
      color: '#64748b',
      fontFamily: "'JetBrains Mono', monospace",
    },
    arrow: {
      color: '#60a5fa',
      fontSize: '10px',
    },
    status: (isCompleted) => ({
      fontSize: '10px',
      color: isCompleted ? '#22c55e' : '#64748b',
      marginTop: '4px',
    }),
  };

  return (
    <div style={mapStyles.container}>
      <div style={mapStyles.grid}>
        {steps.map((step) => {
          const isActive = step.id === current;
          const isCompleted = completed.includes(step.id);
          const deps = config.dependencies[step.id] || [];
          return (
            <div
              key={step.id}
              style={mapStyles.node(isActive, isCompleted)}
              onClick={() => onStepClick?.(step.id)}
            >
              <div style={mapStyles.label}>{config.labels[step.id]}</div>
              {deps.length > 0 && (
                <div style={mapStyles.deps}>
                  <span style={mapStyles.arrow}>← </span>
                  {deps.map(d => config.labels[d]).join(', ')}
                </div>
              )}
              <div style={mapStyles.status(isCompleted)}>
                {isCompleted ? '✓ COMPLETE' : isActive ? '● ACTIVE' : '○ PENDING'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SOVEREIGN (STRATEGIC ARC) MAP
// ============================================================================

const StrategicArcMap = ({ steps, current, completed, onStepClick, config }) => {
  const mapStyles = {
    container: {
      padding: '40px 20px',
      position: 'relative',
    },
    arc: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    node: (isActive, isCompleted) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      opacity: isCompleted || isActive ? 1 : 0.5,
    }),
    diamond: (isActive, isCompleted) => ({
      width: isActive ? '32px' : '24px',
      height: isActive ? '32px' : '24px',
      background: isCompleted
        ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
        : isActive
          ? 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)'
          : 'rgba(251, 191, 36, 0.2)',
      transform: 'rotate(45deg)',
      boxShadow: isActive
        ? '0 0 20px rgba(251, 191, 36, 0.6)'
        : 'none',
      transition: 'all 0.2s ease',
    }),
    label: (isActive) => ({
      marginTop: '16px',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1px',
      color: isActive ? '#fbbf24' : '#a3a3a3',
    }),
    connector: (isCompleted) => ({
      flex: 1,
      height: '3px',
      background: isCompleted
        ? 'linear-gradient(90deg, #fbbf24, #d97706)'
        : 'rgba(251, 191, 36, 0.2)',
      margin: '0 8px',
    }),
  };

  return (
    <div style={mapStyles.container}>
      <div style={mapStyles.arc}>
        {steps.map((step, index) => {
          const isActive = step.id === current;
          const isCompleted = completed.includes(step.id);
          const prevCompleted = index > 0 && completed.includes(steps[index - 1].id);
          return (
            <React.Fragment key={step.id}>
              {index > 0 && <div style={mapStyles.connector(prevCompleted)} />}
              <div
                style={mapStyles.node(isActive, isCompleted)}
                onClick={() => onStepClick?.(step.id)}
              >
                <div style={mapStyles.diamond(isActive, isCompleted)} />
                <span style={mapStyles.label(isActive)}>
                  {config.labels[step.id]}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ModeAwarePilgrimMap = ({
  current,
  completed = [],
  onStepClick,
  className = '',
}) => {
  const { mode } = useMode();
  const config = MAP_CONFIGS[mode] || MAP_CONFIGS.pilgrim;

  const containerStyles = {
    container: {
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
  };

  const renderMap = () => {
    const props = {
      steps: JOURNEY_STEPS,
      current,
      completed,
      onStepClick,
      config,
    };

    switch (mode) {
      case 'pilgrim':
        return <LanternPathMap {...props} />;
      case 'scholar':
        return <AnnotatedPathMap {...props} />;
      case 'architect':
        return <BlueprintSequenceMap {...props} />;
      case 'sovereign':
        return <StrategicArcMap {...props} />;
      default:
        return <LanternPathMap {...props} />;
    }
  };

  return (
    <div style={containerStyles.container} className={`mode-aware-pilgrim-map ${className}`}>
      <header style={containerStyles.header}>
        <div style={containerStyles.title}>{config.name}</div>
        <div style={containerStyles.description}>{config.description}</div>
      </header>
      {renderMap()}
    </div>
  );
};

ModeAwarePilgrimMap.propTypes = {
  current: PropTypes.string.isRequired,
  completed: PropTypes.arrayOf(PropTypes.string),
  onStepClick: PropTypes.func,
  className: PropTypes.string,
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ModeAwarePilgrimMap;

export {
  MAP_CONFIGS,
  JOURNEY_STEPS,
  LanternPathMap,
  AnnotatedPathMap,
  BlueprintSequenceMap,
  StrategicArcMap,
};
