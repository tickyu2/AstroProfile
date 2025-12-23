/**
 * Focus Mode Toggle Component
 *
 * UI control for entering/exiting Focus Mode with Luna.
 * Provides visual feedback on current mode and energy requirements.
 *
 * Variants:
 * - Button: Simple toggle button
 * - Selector: Dropdown with all focus modes
 * - Widget: Full widget with status and energy display
 *
 * Part of GENESIS Phase 4 - Advanced Voice Features
 * December 19, 2024
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  focusModeService,
  FOCUS_MODES,
  FOCUS_MODE_CONFIG,
  FOCUS_VISUALS
} from '../../services/focusModeService';
import { lunaEnergyService } from '../../services/lunaEnergyService';
import { ZenRingCompact } from '../voice/ZenRingVisualizer';

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  // Toggle Button
  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 500,
    fontSize: '14px',
    backgroundColor: 'transparent'
  },

  toggleButtonActive: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderColor: '#8A2BE2',
    color: '#8A2BE2'
  },

  toggleButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#666',
    color: '#888'
  },

  // Selector
  selectorContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  selectorLabel: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },

  selectorOptions: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap'
  },

  selectorOption: {
    padding: '6px 12px',
    borderRadius: '16px',
    border: '1px solid #444',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#1a1a1a'
  },

  selectorOptionActive: {
    borderColor: '#8A2BE2',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    color: '#fff'
  },

  selectorOptionDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },

  // Widget
  widget: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333'
  },

  widgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },

  widgetTitle: {
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  widgetStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#252525'
  },

  energyBar: {
    width: '60px',
    height: '6px',
    backgroundColor: '#333',
    borderRadius: '3px',
    overflow: 'hidden'
  },

  energyFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  },

  // Warning
  warning: {
    marginTop: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    color: '#FFA500',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// TOGGLE BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function FocusModeButton({
  mode = FOCUS_MODES.DEEP,
  onChange,
  disabled = false,
  className = ''
}) {
  const [isActive, setIsActive] = useState(focusModeService.isActive());
  const [currentMode, setCurrentMode] = useState(focusModeService.getMode());

  useEffect(() => {
    // Listen to mode changes
    focusModeService.setOnModeChange((newMode) => {
      setCurrentMode(newMode);
      setIsActive(newMode !== FOCUS_MODES.OFF);
    });

    return () => {
      focusModeService.setOnModeChange(null);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;

    const result = focusModeService.toggle(mode);

    if (!result.success) {
      // Show error/warning
      console.warn('[FocusMode]', result.message);
    }

    onChange?.(result);
  }, [mode, disabled, onChange]);

  const visuals = FOCUS_VISUALS[isActive ? currentMode : 'off'];

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={{
        ...styles.toggleButton,
        ...(isActive ? styles.toggleButtonActive : styles.toggleButtonInactive),
        borderColor: isActive ? visuals.color : '#666',
        color: isActive ? visuals.color : '#888'
      }}
      title={isActive ? 'Exit Focus Mode' : 'Enter Focus Mode'}
    >
      <ZenRingCompact focusMode={currentMode} size={24} />
      <span>{isActive ? 'Focus On' : 'Focus Mode'}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODE SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function FocusModeSelector({
  value,
  onChange,
  showLabels = true,
  className = ''
}) {
  const [currentMode, setCurrentMode] = useState(value || focusModeService.getMode());
  const [energyLevel, setEnergyLevel] = useState(lunaEnergyService.getEnergy());

  useEffect(() => {
    // Sync with service
    setCurrentMode(focusModeService.getMode());

    // Listen to changes
    focusModeService.setOnModeChange((mode) => setCurrentMode(mode));
    lunaEnergyService.setOnEnergyChange((energy) => setEnergyLevel(energy));

    return () => {
      focusModeService.setOnModeChange(null);
      lunaEnergyService.setOnEnergyChange(null);
    };
  }, []);

  const handleSelect = useCallback((mode) => {
    let result;
    if (mode === FOCUS_MODES.OFF) {
      result = focusModeService.exitFocusMode('user');
    } else {
      result = focusModeService.enterFocusMode(mode);
    }

    if (result.success) {
      setCurrentMode(mode);
      onChange?.(mode, result);
    } else {
      console.warn('[FocusMode]', result.message);
    }
  }, [onChange]);

  const modes = [
    { key: FOCUS_MODES.OFF, label: 'Normal', minEnergy: 0 },
    { key: FOCUS_MODES.LIGHT, label: 'Light', minEnergy: FOCUS_MODE_CONFIG.minimumEnergy.light },
    { key: FOCUS_MODES.DEEP, label: 'Deep', minEnergy: FOCUS_MODE_CONFIG.minimumEnergy.deep },
    { key: FOCUS_MODES.ZEN, label: 'Zen', minEnergy: FOCUS_MODE_CONFIG.minimumEnergy.zen }
  ];

  return (
    <div className={className} style={styles.selectorContainer}>
      {showLabels && <span style={styles.selectorLabel}>Focus Mode</span>}

      <div style={styles.selectorOptions}>
        {modes.map(({ key, label, minEnergy }) => {
          const isSelected = currentMode === key;
          const isDisabled = energyLevel < minEnergy;
          const visuals = FOCUS_VISUALS[key];

          return (
            <button
              key={key}
              onClick={() => !isDisabled && handleSelect(key)}
              style={{
                ...styles.selectorOption,
                ...(isSelected ? {
                  ...styles.selectorOptionActive,
                  borderColor: visuals.color,
                  color: visuals.color
                } : {}),
                ...(isDisabled ? styles.selectorOptionDisabled : {})
              }}
              disabled={isDisabled}
              title={isDisabled ? `Requires ${minEnergy}% energy` : label}
            >
              <span>{visuals.icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL WIDGET COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function FocusModeWidget({
  onChange,
  showEnergy = true,
  compact = false,
  className = ''
}) {
  const [status, setStatus] = useState(focusModeService.getStatus());
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    // Initial status
    setStatus(focusModeService.getStatus());

    // Listen to changes
    focusModeService.setOnModeChange(() => {
      setStatus(focusModeService.getStatus());
    });

    focusModeService.setOnAutoExit((info) => {
      setWarning(info.message);
      setTimeout(() => setWarning(null), 5000);
    });

    focusModeService.setOnEnergyWarning((energy) => {
      setWarning(`Energy low (${energy}%). Focus mode may auto-exit.`);
      setTimeout(() => setWarning(null), 5000);
    });

    lunaEnergyService.setOnEnergyChange(() => {
      setStatus(focusModeService.getStatus());
    });

    return () => {
      focusModeService.setOnModeChange(null);
      focusModeService.setOnAutoExit(null);
      focusModeService.setOnEnergyWarning(null);
    };
  }, []);

  const getEnergyColor = (level) => {
    if (level >= 60) return '#00FF00';
    if (level >= 40) return '#FFD700';
    if (level >= 20) return '#FFA500';
    return '#FF4500';
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 1) return 'Just started';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  if (compact) {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FocusModeButton onChange={onChange} />
        {showEnergy && (
          <div style={styles.energyBar}>
            <div
              style={{
                ...styles.energyFill,
                width: `${status.energy.percent}%`,
                backgroundColor: getEnergyColor(status.energy.energy)
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className} style={styles.widget}>
      <div style={styles.widgetHeader}>
        <div style={styles.widgetTitle}>
          <ZenRingCompact focusMode={status.mode} energyState={status.energy.state} size={28} />
          <span>Focus Mode</span>
        </div>

        {status.isActive && (
          <span style={{ fontSize: '12px', color: '#888' }}>
            {formatDuration(status.duration)}
          </span>
        )}
      </div>

      <FocusModeSelector onChange={onChange} showLabels={false} />

      {showEnergy && (
        <div style={{ ...styles.widgetStatus, marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>Energy</span>
          <div style={{ ...styles.energyBar, flex: 1 }}>
            <div
              style={{
                ...styles.energyFill,
                width: `${status.energy.percent}%`,
                backgroundColor: getEnergyColor(status.energy.energy)
              }}
            />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: getEnergyColor(status.energy.energy) }}>
            {status.energy.percent}%
          </span>
        </div>
      )}

      {warning && (
        <div style={styles.warning}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span>{warning}</span>
        </div>
      )}

      {status.isActive && status.tasksCompleted > 0 && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
          {status.tasksCompleted} task{status.tasksCompleted > 1 ? 's' : ''} completed
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default FocusModeWidget;
