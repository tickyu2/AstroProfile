/**
 * Zen Ring Visualizer
 *
 * A calm, steady visual for Focus Mode that replaces the active waveform.
 * Designed to minimize distraction while maintaining Luna's presence.
 *
 * Visual States:
 * - OFF: Pulsing cyan waveform (playful)
 * - LIGHT: Gentle purple breathing
 * - DEEP: Steady violet zen ring
 * - ZEN: Minimal gold zen ring
 *
 * Part of GENESIS Phase 4 - Advanced Voice Features
 * December 19, 2024
 */

import React, { useMemo } from 'react';
import { FOCUS_MODES, FOCUS_VISUALS } from '../../services/focusModeService';
import { ENERGY_STATES } from '../../services/lunaEnergyService';

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    minHeight: '120px',
    position: 'relative'
  },

  // Zen Ring base style
  zenRing: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '4px solid',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Inner glow ring
  innerRing: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    border: '2px solid',
    opacity: 0.5,
    position: 'absolute'
  },

  // Center icon
  centerIcon: {
    fontSize: '24px',
    position: 'absolute',
    zIndex: 2
  },

  // Energy indicator (small dot)
  energyDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    position: 'absolute',
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)'
  },

  // Status text
  statusText: {
    position: 'absolute',
    bottom: '-45px',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    opacity: 0.7
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CSS ANIMATIONS (injected into head)
// ═══════════════════════════════════════════════════════════════════════════

const animationStyles = `
@keyframes zenBreathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@keyframes zenPulse {
  0%, 100% {
    box-shadow: 0 0 15px currentColor;
  }
  50% {
    box-shadow: 0 0 30px currentColor, 0 0 45px currentColor;
  }
}

@keyframes zenFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes waveformPulse {
  0% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0.3);
  }
}

@keyframes iconGlow {
  0%, 100% {
    filter: drop-shadow(0 0 5px currentColor);
  }
  50% {
    filter: drop-shadow(0 0 15px currentColor);
  }
}

@keyframes lowEnergyPulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.zen-ring-breathe {
  animation: zenBreathe 4s ease-in-out infinite;
}

.zen-ring-pulse {
  animation: zenPulse 3s ease-in-out infinite;
}

.zen-ring-float {
  animation: zenFloat 6s ease-in-out infinite;
}

.zen-icon-glow {
  animation: iconGlow 2s ease-in-out infinite;
}

.low-energy-indicator {
  animation: lowEnergyPulse 1.5s ease-in-out infinite;
}
`;

// Inject animation styles
if (typeof document !== 'undefined') {
  const styleId = 'zen-ring-animations';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// WAVEFORM COMPONENT (for OFF mode)
// ═══════════════════════════════════════════════════════════════════════════

const Waveform = ({ color, isActive }) => {
  const bars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      delay: i * 0.1,
      height: 20 + Math.random() * 30
    }));
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      height: '60px'
    }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            width: '8px',
            height: `${bar.height}px`,
            backgroundColor: color,
            borderRadius: '4px',
            animation: isActive ? `waveformPulse 0.8s ease-in-out infinite` : 'none',
            animationDelay: `${bar.delay}s`,
            opacity: isActive ? 1 : 0.5
          }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ZEN RING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ZenRing = ({
  focusMode = FOCUS_MODES.OFF,
  energyState = ENERGY_STATES.RESTED,
  energyLevel = 80,
  isListening = false,
  isSpeaking = false,
  size = 100,
  showStatus = true
}) => {
  // Get visual config for current mode
  const visuals = FOCUS_VISUALS[focusMode] || FOCUS_VISUALS.off;
  const isActive = focusMode !== FOCUS_MODES.OFF;

  // Determine animation class based on mode
  const getAnimationClass = () => {
    if (focusMode === FOCUS_MODES.ZEN) {
      return 'zen-ring-pulse';
    }
    if (focusMode === FOCUS_MODES.DEEP) {
      return 'zen-ring-breathe zen-ring-pulse';
    }
    if (focusMode === FOCUS_MODES.LIGHT) {
      return 'zen-ring-breathe';
    }
    return '';
  };

  // Energy state colors
  const getEnergyColor = () => {
    switch (energyState) {
      case ENERGY_STATES.FULL: return '#00FF00';
      case ENERGY_STATES.RESTED: return '#7CFC00';
      case ENERGY_STATES.NORMAL: return '#FFD700';
      case ENERGY_STATES.TIRED: return '#FFA500';
      case ENERGY_STATES.EXHAUSTED: return '#FF4500';
      default: return '#888888';
    }
  };

  // Glow intensity based on focus mode
  const getGlowStyle = () => {
    const intensity = {
      off: '0 0 10px',
      light: '0 0 15px',
      deep: '0 0 20px, 0 0 40px',
      zen: '0 0 25px, 0 0 50px, 0 0 75px'
    };
    return `${intensity[focusMode] || intensity.off} ${visuals.color}`;
  };

  // Render waveform for OFF mode
  if (!isActive) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center' }}>
          <Waveform color={visuals.color} isActive={isListening || isSpeaking} />

          {showStatus && (
            <>
              <div
                style={{
                  ...styles.energyDot,
                  backgroundColor: getEnergyColor(),
                  marginTop: '15px'
                }}
                className={energyState === ENERGY_STATES.EXHAUSTED ? 'low-energy-indicator' : ''}
              />
              <div style={{ ...styles.statusText, color: visuals.color, marginTop: '30px' }}>
                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Render Zen Ring for focus modes
  return (
    <div style={styles.container}>
      <div style={{ textAlign: 'center', position: 'relative' }}>
        {/* Outer Ring */}
        <div
          className={`${getAnimationClass()} zen-ring-float`}
          style={{
            ...styles.zenRing,
            width: `${size}px`,
            height: `${size}px`,
            borderColor: visuals.color,
            boxShadow: getGlowStyle(),
            color: visuals.color
          }}
        >
          {/* Inner Ring */}
          <div
            style={{
              ...styles.innerRing,
              width: `${size * 0.7}px`,
              height: `${size * 0.7}px`,
              borderColor: visuals.color
            }}
          />

          {/* Center Icon */}
          <span
            className="zen-icon-glow"
            style={{
              ...styles.centerIcon,
              color: visuals.color
            }}
          >
            {visuals.icon}
          </span>
        </div>

        {showStatus && (
          <>
            {/* Energy Dot */}
            <div
              style={{
                ...styles.energyDot,
                backgroundColor: getEnergyColor(),
                boxShadow: `0 0 8px ${getEnergyColor()}`
              }}
              className={energyState === ENERGY_STATES.EXHAUSTED ? 'low-energy-indicator' : ''}
              title={`Energy: ${energyLevel}%`}
            />

            {/* Status Text */}
            <div style={{ ...styles.statusText, color: visuals.color }}>
              {focusMode === FOCUS_MODES.ZEN ? 'ZEN' :
               focusMode === FOCUS_MODES.DEEP ? 'DEEP FOCUS' :
               'FOCUS'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN VISUALIZER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ZenRingVisualizer - Adaptive visualizer that switches between waveform and zen ring
 *
 * @param {string} focusMode - Current focus mode (off, light, deep, zen)
 * @param {string} energyState - Current energy state
 * @param {number} energyLevel - Current energy level (0-100)
 * @param {boolean} isListening - Whether Luna is listening
 * @param {boolean} isSpeaking - Whether Luna is speaking
 * @param {number} size - Size of the visualizer in pixels
 * @param {boolean} showStatus - Whether to show status indicators
 * @param {string} className - Additional CSS classes
 */
export function ZenRingVisualizer({
  focusMode = FOCUS_MODES.OFF,
  energyState = ENERGY_STATES.RESTED,
  energyLevel = 80,
  isListening = false,
  isSpeaking = false,
  size = 100,
  showStatus = true,
  className = ''
}) {
  return (
    <div className={className}>
      <ZenRing
        focusMode={focusMode}
        energyState={energyState}
        energyLevel={energyLevel}
        isListening={isListening}
        isSpeaking={isSpeaking}
        size={size}
        showStatus={showStatus}
      />
    </div>
  );
}

// Compact version for inline use
export function ZenRingCompact({ focusMode, energyState, size = 40 }) {
  const visuals = FOCUS_VISUALS[focusMode] || FOCUS_VISUALS.off;
  const isActive = focusMode !== FOCUS_MODES.OFF;

  if (!isActive) {
    return (
      <span style={{ color: visuals.color, fontSize: '20px' }}>
        {visuals.icon}
      </span>
    );
  }

  return (
    <span
      className="zen-ring-breathe"
      style={{
        display: 'inline-flex',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: `2px solid ${visuals.color}`,
        boxShadow: `0 0 10px ${visuals.color}`,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px'
      }}
    >
      {visuals.icon}
    </span>
  );
}

export default ZenRingVisualizer;
