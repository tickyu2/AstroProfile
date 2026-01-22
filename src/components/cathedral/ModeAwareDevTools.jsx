/**
 * ModeAwareDevTools.jsx
 *
 * DevTools overlay that transforms based on Cathedral mode.
 * Each mode presents information through its own lens.
 *
 * - Pilgrim: "Emotional Weather" — tone, narrative arcs, supportive interpretations
 * - Scholar: "Annotated Breakdown" — deltas, definitions, references
 * - Architect: "Rule Engine Inspector" — raw rules, dependencies, graphs
 * - Sovereign: "Strategic Dashboard" — windows, peaks, recommendations
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMode, useModeFeature } from './modeSystem';

// ============================================================================
// DEVTOOLS CONFIGURATIONS
// ============================================================================

const DEVTOOLS_CONFIGS = {
  pilgrim: {
    name: 'Emotional Weather',
    description: 'How the energy feels right now',
    showNumbers: false,
    showRules: false,
    showReferences: false,
    showStrategic: false,
    panels: ['emotionalTone', 'narrativeArcs', 'supportiveNotes'],
  },
  scholar: {
    name: 'Annotated Breakdown',
    description: 'Detailed analysis with references',
    showNumbers: true,
    showRules: false,
    showReferences: true,
    showStrategic: false,
    panels: ['deltas', 'definitions', 'footnotes', 'references'],
  },
  architect: {
    name: 'Rule Engine Inspector',
    description: 'Full system transparency',
    showNumbers: true,
    showRules: true,
    showReferences: true,
    showStrategic: false,
    panels: ['ruleEvaluations', 'dependencies', 'overlayStack', 'rawData'],
  },
  sovereign: {
    name: 'Strategic Dashboard',
    description: 'Key windows and recommendations',
    showNumbers: false,
    showRules: false,
    showReferences: false,
    showStrategic: true,
    panels: ['opportunityWindows', 'dangerWindows', 'recommendations'],
  },
};

// ============================================================================
// PILGRIM DEVTOOLS - Emotional Weather
// ============================================================================

const PilgrimDevTools = ({ data }) => {
  const styles = {
    container: {
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(255, 215, 128, 0.05) 0%, transparent 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 215, 128, 0.2)',
    },
    header: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#ffd780',
      marginBottom: '16px',
    },
    section: {
      marginBottom: '16px',
    },
    label: {
      fontSize: '11px',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    tone: {
      fontSize: '16px',
      color: '#fff',
      lineHeight: '1.6',
      padding: '12px 16px',
      background: 'rgba(255, 215, 128, 0.1)',
      borderRadius: '8px',
      borderLeft: '3px solid #ffd780',
    },
    arcList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    arc: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 0',
      color: '#cbd5e1',
      fontSize: '14px',
    },
    arcIcon: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#ffd780',
    },
    note: {
      fontSize: '13px',
      color: '#94a3b8',
      fontStyle: 'italic',
      padding: '12px',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Emotional Weather</h3>

      <div style={styles.section}>
        <div style={styles.label}>How Today Feels</div>
        <div style={styles.tone}>
          {data.emotionalTone || 'A day for quiet reflection and gentle self-compassion.'}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Themes Rising</div>
        <ul style={styles.arcList}>
          {(data.narrativeArcs || ['Inner growth is asking for attention', 'Relationships seek deeper honesty']).map((arc, i) => (
            <li key={i} style={styles.arc}>
              <span style={styles.arcIcon} />
              {arc}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>A Kind Note</div>
        <div style={styles.note}>
          {data.supportiveNote || 'Whatever you\'re feeling is valid. There\'s no rush to understand it all.'}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCHOLAR DEVTOOLS - Annotated Breakdown
// ============================================================================

const ScholarDevTools = ({ data }) => {
  const styles = {
    container: {
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(232, 213, 163, 0.05) 0%, transparent 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(232, 213, 163, 0.2)',
    },
    header: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#e8d5a3',
      marginBottom: '16px',
    },
    section: {
      marginBottom: '20px',
    },
    label: {
      fontSize: '11px',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    deltaGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
    },
    deltaItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 12px',
      background: 'rgba(232, 213, 163, 0.05)',
      borderRadius: '6px',
      fontSize: '13px',
    },
    deltaName: {
      color: '#cbd5e1',
    },
    deltaValue: (value) => ({
      color: value >= 0 ? '#22c55e' : '#ef4444',
      fontWeight: '600',
    }),
    definition: {
      padding: '12px',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      marginBottom: '8px',
    },
    definitionTerm: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#e8d5a3',
      marginBottom: '4px',
    },
    definitionText: {
      fontSize: '12px',
      color: '#94a3b8',
    },
    footnote: {
      fontSize: '11px',
      color: '#64748b',
      marginBottom: '4px',
    },
    footnoteNumber: {
      color: '#e8d5a3',
      marginRight: '6px',
    },
  };

  const deltas = data.deltas || {
    'Leadership Overlay': 2.4,
    'Archetype Overlay': 1.8,
    'Elemental Overlay': -0.5,
    'Retrograde Overlay': -1.2,
  };

  const definitions = data.definitions || [
    { term: 'Delta', definition: 'The contribution of an overlay to the final compatibility score.' },
    { term: 'Overlay', definition: 'A computational lens analyzing a specific aspect of the chart.' },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Annotated Breakdown</h3>

      <div style={styles.section}>
        <div style={styles.label}>Overlay Deltas</div>
        <div style={styles.deltaGrid}>
          {Object.entries(deltas).map(([name, value]) => (
            <div key={name} style={styles.deltaItem}>
              <span style={styles.deltaName}>{name}</span>
              <span style={styles.deltaValue(value)}>
                {value >= 0 ? '+' : ''}{value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Definitions</div>
        {definitions.map((def, i) => (
          <div key={i} style={styles.definition}>
            <div style={styles.definitionTerm}>{def.term}</div>
            <div style={styles.definitionText}>{def.definition}</div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <div style={styles.label}>References</div>
        <div style={styles.footnote}>
          <span style={styles.footnoteNumber}>1.</span>
          See Codex Vol. II, Chapter III: Overlay Architecture
        </div>
        <div style={styles.footnote}>
          <span style={styles.footnoteNumber}>2.</span>
          Rudhyar, D. (1936). The Astrology of Personality
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ARCHITECT DEVTOOLS - Rule Engine Inspector
// ============================================================================

const ArchitectDevTools = ({ data }) => {
  const [activeTab, setActiveTab] = useState('rules');

  const styles = {
    container: {
      padding: '16px',
      background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.05) 0%, transparent 100%)',
      borderRadius: '8px',
      border: '1px solid rgba(96, 165, 250, 0.3)',
      fontFamily: "'JetBrains Mono', monospace",
    },
    header: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#60a5fa',
      marginBottom: '12px',
    },
    tabs: {
      display: 'flex',
      gap: '4px',
      marginBottom: '12px',
    },
    tab: (isActive) => ({
      padding: '6px 12px',
      fontSize: '11px',
      background: isActive ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
      border: `1px solid ${isActive ? '#60a5fa' : 'rgba(96, 165, 250, 0.3)'}`,
      borderRadius: '4px',
      color: isActive ? '#60a5fa' : '#64748b',
      cursor: 'pointer',
    }),
    panel: {
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '6px',
      padding: '12px',
      maxHeight: '300px',
      overflow: 'auto',
    },
    ruleItem: {
      marginBottom: '12px',
      padding: '8px',
      background: 'rgba(96, 165, 250, 0.05)',
      borderRadius: '4px',
      border: '1px solid rgba(96, 165, 250, 0.1)',
    },
    ruleName: {
      fontSize: '12px',
      color: '#60a5fa',
      marginBottom: '4px',
    },
    ruleDetails: {
      fontSize: '11px',
      color: '#94a3b8',
    },
    codeBlock: {
      fontSize: '11px',
      color: '#cbd5e1',
      whiteSpace: 'pre-wrap',
    },
    deltaRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 0',
      borderBottom: '1px solid rgba(96, 165, 250, 0.1)',
    },
  };

  const rules = data.rules || [
    { id: 'L-12', name: 'Leadership Conjunction', fired: true, delta: 2.4 },
    { id: 'A-3', name: 'Archetype Match', fired: true, delta: 1.8 },
    { id: 'E-7', name: 'Element Imbalance', fired: true, delta: -0.5 },
  ];

  const rawData = data.rawData || {
    overlayCount: 17,
    rulesEvaluated: 234,
    cacheHits: 189,
    computeTime: '45ms',
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Rule Engine Inspector</h3>

      <div style={styles.tabs}>
        {['rules', 'dependencies', 'raw'].map((tab) => (
          <button
            key={tab}
            style={styles.tab(activeTab === tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={styles.panel}>
        {activeTab === 'rules' && (
          <>
            {rules.map((rule) => (
              <div key={rule.id} style={styles.ruleItem}>
                <div style={styles.ruleName}>[{rule.id}] {rule.name}</div>
                <div style={styles.ruleDetails}>
                  Fired: {rule.fired ? 'YES' : 'NO'} | Delta: {rule.delta >= 0 ? '+' : ''}{rule.delta}
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'dependencies' && (
          <pre style={styles.codeBlock}>
{`Overlay Pipeline:
1. Birth → Elemental
2. Birth → Archetype
3. Elemental + Archetype → Leadership
4. Leadership → Composite
5. All → Decision Engine`}
          </pre>
        )}

        {activeTab === 'raw' && (
          <>
            {Object.entries(rawData).map(([key, value]) => (
              <div key={key} style={styles.deltaRow}>
                <span>{key}</span>
                <span style={{ color: '#60a5fa' }}>{value}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SOVEREIGN DEVTOOLS - Strategic Dashboard
// ============================================================================

const SovereignDevTools = ({ data }) => {
  const styles = {
    container: {
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, transparent 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(251, 191, 36, 0.3)',
    },
    header: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#fbbf24',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    section: {
      marginBottom: '20px',
    },
    label: {
      fontSize: '11px',
      color: '#a3a3a3',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    windowList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    windowItem: (type) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      background: type === 'opportunity'
        ? 'rgba(34, 197, 94, 0.1)'
        : 'rgba(239, 68, 68, 0.1)',
      borderRadius: '6px',
      marginBottom: '8px',
      borderLeft: `3px solid ${type === 'opportunity' ? '#22c55e' : '#ef4444'}`,
    }),
    windowDate: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#fff',
    },
    windowDesc: {
      fontSize: '12px',
      color: '#94a3b8',
    },
    recommendation: {
      padding: '16px',
      background: 'rgba(251, 191, 36, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(251, 191, 36, 0.2)',
    },
    recommendationText: {
      fontSize: '14px',
      color: '#fefce8',
      fontWeight: '500',
      lineHeight: '1.5',
    },
  };

  const windows = data.windows || {
    opportunity: [
      { date: 'Jan 22–Feb 4', desc: 'High influence period' },
      { date: 'March 3', desc: 'Destiny pivot point' },
    ],
    danger: [
      { date: 'Feb 9–12', desc: 'Avoid major decisions' },
    ],
  };

  const recommendation = data.recommendation ||
    'The strategic outlook favors consolidation this week. Reserve decisive action for the upcoming high-influence window.';

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Strategic Dashboard</h3>

      <div style={styles.section}>
        <div style={styles.label}>Opportunity Windows</div>
        <ul style={styles.windowList}>
          {windows.opportunity.map((w, i) => (
            <li key={i} style={styles.windowItem('opportunity')}>
              <div>
                <div style={styles.windowDate}>{w.date}</div>
                <div style={styles.windowDesc}>{w.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Caution Windows</div>
        <ul style={styles.windowList}>
          {windows.danger.map((w, i) => (
            <li key={i} style={styles.windowItem('danger')}>
              <div>
                <div style={styles.windowDate}>{w.date}</div>
                <div style={styles.windowDesc}>{w.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Strategic Recommendation</div>
        <div style={styles.recommendation}>
          <div style={styles.recommendationText}>{recommendation}</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ModeAwareDevTools = ({
  data = {},
  isOpen = true,
  onClose,
  position = 'right',
  className = '',
}) => {
  const { mode } = useMode();
  const showDevTools = useModeFeature('showDevTools');
  const config = DEVTOOLS_CONFIGS[mode] || DEVTOOLS_CONFIGS.pilgrim;

  const containerStyles = {
    container: {
      position: 'fixed',
      [position]: '20px',
      top: '80px',
      width: '320px',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
      background: 'rgba(15, 15, 30, 0.95)',
      borderRadius: '16px',
      border: '1px solid var(--aura-border-medium, rgba(255, 255, 255, 0.1))',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      transform: isOpen ? 'translateX(0)' : `translateX(${position === 'right' ? '120%' : '-120%'})`,
      transition: 'transform 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid var(--aura-border-subtle, rgba(255, 255, 255, 0.1))',
    },
    title: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--aura-text-highlight, #fff)',
    },
    subtitle: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '2px',
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: '#64748b',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px',
    },
    content: {
      padding: '16px',
    },
    modeIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      background: 'var(--aura-surface-1, rgba(0, 0, 0, 0.2))',
      fontSize: '12px',
      color: '#94a3b8',
    },
    modeIcon: {
      fontSize: '14px',
    },
  };

  // For non-architect modes, only show if explicitly enabled
  // Architect mode always shows DevTools
  if (!isOpen) return null;

  const renderDevToolsPanel = () => {
    switch (mode) {
      case 'pilgrim':
        return <PilgrimDevTools data={data} />;
      case 'scholar':
        return <ScholarDevTools data={data} />;
      case 'architect':
        return <ArchitectDevTools data={data} />;
      case 'sovereign':
        return <SovereignDevTools data={data} />;
      default:
        return <PilgrimDevTools data={data} />;
    }
  };

  return (
    <div style={containerStyles.container} className={`mode-aware-devtools ${className}`}>
      <header style={containerStyles.header}>
        <div>
          <div style={containerStyles.title}>{config.name}</div>
          <div style={containerStyles.subtitle}>{config.description}</div>
        </div>
        {onClose && (
          <button style={containerStyles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
      </header>

      <div style={containerStyles.modeIndicator}>
        <span style={containerStyles.modeIcon}>
          {mode === 'pilgrim' && '🌙'}
          {mode === 'scholar' && '📚'}
          {mode === 'architect' && '🏛️'}
          {mode === 'sovereign' && '👑'}
        </span>
        <span>{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</span>
      </div>

      <div style={containerStyles.content}>
        {renderDevToolsPanel()}
      </div>
    </div>
  );
};

ModeAwareDevTools.propTypes = {
  data: PropTypes.shape({
    emotionalTone: PropTypes.string,
    narrativeArcs: PropTypes.arrayOf(PropTypes.string),
    supportiveNote: PropTypes.string,
    deltas: PropTypes.object,
    definitions: PropTypes.arrayOf(PropTypes.shape({
      term: PropTypes.string,
      definition: PropTypes.string,
    })),
    rules: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      fired: PropTypes.bool,
      delta: PropTypes.number,
    })),
    rawData: PropTypes.object,
    windows: PropTypes.shape({
      opportunity: PropTypes.array,
      danger: PropTypes.array,
    }),
    recommendation: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ModeAwareDevTools;

export {
  DEVTOOLS_CONFIGS,
  PilgrimDevTools,
  ScholarDevTools,
  ArchitectDevTools,
  SovereignDevTools,
};
