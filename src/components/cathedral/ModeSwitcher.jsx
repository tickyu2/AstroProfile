/**
 * ModeSwitcher.jsx
 *
 * UI component for switching between Cathedral modes:
 * Pilgrim, Scholar, Architect, Sovereign.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMode, CATHEDRAL_MODES, MODE_MATRIX } from './modeSystem';

// ============================================================================
// MODE BUTTON COMPONENT
// ============================================================================

const ModeButton = ({ mode, isActive, onClick, compact }) => {
  const config = MODE_MATRIX[mode];

  const buttonStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: compact ? '6px' : '10px',
      padding: compact ? '8px 12px' : '12px 20px',
      borderRadius: compact ? '8px' : '12px',
      border: isActive
        ? '2px solid var(--mode-accent, #a855f7)'
        : '1px solid rgba(255, 255, 255, 0.1)',
      background: isActive
        ? 'rgba(168, 85, 247, 0.15)'
        : 'rgba(255, 255, 255, 0.03)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: isActive ? '#fff' : '#94a3b8',
    },
    icon: {
      fontSize: compact ? '16px' : '20px',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    label: {
      fontSize: compact ? '13px' : '15px',
      fontWeight: '600',
    },
    description: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '2px',
    },
  };

  return (
    <button
      style={buttonStyles.container}
      onClick={() => onClick(mode)}
      onMouseOver={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
      }}
      onMouseOut={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
      title={config.description}
    >
      <span style={buttonStyles.icon}>{config.icon}</span>
      <div style={buttonStyles.content}>
        <span style={buttonStyles.label}>{config.label}</span>
        {!compact && (
          <span style={buttonStyles.description}>{config.description}</span>
        )}
      </div>
    </button>
  );
};

// ============================================================================
// MODE INFO PANEL
// ============================================================================

const ModeInfoPanel = ({ mode, effects }) => {
  const panelStyles = {
    container: {
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      padding: '16px 20px',
      marginTop: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
    },
    icon: {
      fontSize: '28px',
    },
    title: {
      color: '#fff',
      fontSize: '18px',
      fontWeight: '600',
    },
    description: {
      color: '#94a3b8',
      fontSize: '14px',
      lineHeight: '1.5',
      marginBottom: '16px',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
    },
    feature: (enabled) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      color: enabled ? '#22c55e' : '#64748b',
    }),
    indicator: (enabled) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: enabled ? '#22c55e' : '#374151',
    }),
  };

  const config = MODE_MATRIX[mode];
  const features = [
    { label: 'DevTools', enabled: effects.showDevTools },
    { label: 'Advanced Codex', enabled: effects.showAdvancedCodex },
    { label: 'Developer Notes', enabled: effects.showDeveloperNotes },
    { label: 'Ritual Mode', enabled: effects.ritualMode },
  ];

  return (
    <div style={panelStyles.container}>
      <div style={panelStyles.header}>
        <span style={panelStyles.icon}>{config.icon}</span>
        <span style={panelStyles.title}>{config.label} Mode</span>
      </div>
      <p style={panelStyles.description}>{config.description}</p>
      <div style={panelStyles.features}>
        {features.map((feature) => (
          <div key={feature.label} style={panelStyles.feature(feature.enabled)}>
            <span style={panelStyles.indicator(feature.enabled)} />
            <span>{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPACT MODE SELECTOR (Dropdown style)
// ============================================================================

const CompactModeSelector = ({ mode, setMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = MODE_MATRIX[mode];

  const selectorStyles = {
    container: {
      position: 'relative',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.03)',
      cursor: 'pointer',
      color: '#e2e8f0',
      fontSize: '13px',
      fontWeight: '500',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: '4px',
      background: 'rgba(26, 26, 46, 0.98)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '8px',
      zIndex: 100,
      minWidth: '180px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    },
    option: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      background: isActive ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
      color: isActive ? '#fff' : '#94a3b8',
      transition: 'all 0.15s ease',
    }),
    optionIcon: {
      fontSize: '18px',
    },
  };

  const handleSelect = (newMode) => {
    setMode(newMode);
    setIsOpen(false);
  };

  return (
    <div style={selectorStyles.container}>
      <button
        style={selectorStyles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
        <span style={{ marginLeft: '4px', opacity: 0.5 }}>▾</span>
      </button>

      {isOpen && (
        <div style={selectorStyles.dropdown}>
          {Object.values(CATHEDRAL_MODES).map((m) => {
            const mConfig = MODE_MATRIX[m];
            return (
              <div
                key={m}
                style={selectorStyles.option(m === mode)}
                onClick={() => handleSelect(m)}
                onMouseOver={(e) => {
                  if (m !== mode) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (m !== mode) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={selectorStyles.optionIcon}>{mConfig.icon}</span>
                <span>{mConfig.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN MODE SWITCHER COMPONENT
// ============================================================================

const ModeSwitcher = ({
  variant = 'full', // 'full', 'compact', 'dropdown'
  showInfo = true,
  className = '',
}) => {
  const { mode, effects, setMode } = useMode();

  const containerStyles = {
    full: {
      container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      header: {
        color: '#a78bfa',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '8px',
      },
      buttons: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      },
    },
    compact: {
      container: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
      },
    },
    dropdown: {
      container: {},
    },
  };

  const styles = containerStyles[variant];

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={className}>
        <CompactModeSelector mode={mode} setMode={setMode} />
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div style={styles.container} className={className}>
        {Object.values(CATHEDRAL_MODES).map((m) => (
          <ModeButton
            key={m}
            mode={m}
            isActive={m === mode}
            onClick={setMode}
            compact
          />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div style={styles.container} className={className}>
      <div style={styles.header}>Cathedral Mode</div>
      <div style={styles.buttons}>
        {Object.values(CATHEDRAL_MODES).map((m) => (
          <ModeButton
            key={m}
            mode={m}
            isActive={m === mode}
            onClick={setMode}
            compact={false}
          />
        ))}
      </div>
      {showInfo && <ModeInfoPanel mode={mode} effects={effects} />}
    </div>
  );
};

ModeSwitcher.propTypes = {
  variant: PropTypes.oneOf(['full', 'compact', 'dropdown']),
  showInfo: PropTypes.bool,
  className: PropTypes.string,
};

export default ModeSwitcher;

// Named exports
export { ModeButton, ModeInfoPanel, CompactModeSelector };
