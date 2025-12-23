/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BEHAVIOR DEBUG OVERLAY - Real-time Behavior Profile Visualization
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Shows live behavior profile values as you talk to Luna:
 * - Current emotion + confidence
 * - Response style
 * - Backchannel frequency
 * - Timing zones
 * - User preference biases
 * - Session stats
 *
 * Useful for development and tuning the personalization system.
 *
 * Created: December 21, 2025
 */

import React from 'react';

/**
 * Small progress bar component
 */
const MiniBar = ({ value, max = 1, color = '#4ade80' }) => (
  <div
    style={{
      width: '60px',
      height: '6px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '3px',
      overflow: 'hidden',
      display: 'inline-block',
      marginLeft: '8px',
      verticalAlign: 'middle'
    }}
  >
    <div
      style={{
        width: `${(value / max) * 100}%`,
        height: '100%',
        background: color,
        transition: 'width 0.3s ease'
      }}
    />
  </div>
);

/**
 * BehaviorDebugOverlay Component
 *
 * @param {Object} props
 * @param {Object} props.emotion - Current emotion { primary, secondary, confidence }
 * @param {Object} props.behavior - Behavior profile from backend
 * @param {Object} props.sessionStats - Session statistics
 * @param {Object} props.userPrefs - User preference biases (optional)
 * @param {boolean} props.isVisible - Whether to show the overlay
 * @param {Function} props.onToggle - Toggle visibility
 */
export function BehaviorDebugOverlay({
  emotion,
  behavior,
  sessionStats,
  userPrefs,
  isVisible = true,
  onToggle
}) {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 36,
          height: 36,
          cursor: 'pointer',
          fontSize: 14,
          zIndex: 9999
        }}
        title="Show behavior debug"
      >
        🧠
      </button>
    );
  }

  const boxStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 11,
    fontFamily: 'monospace',
    maxWidth: 280,
    zIndex: 9999,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  };

  const sectionStyle = {
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1px solid rgba(255,255,255,0.1)'
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.6)',
    marginRight: 6
  };

  const valueStyle = {
    color: '#4ade80'
  };

  const getBiasColor = (val) => {
    if (val > 0.05) return '#4ade80';  // green - increased
    if (val < -0.05) return '#f87171'; // red - decreased
    return '#fff';                      // neutral
  };

  return (
    <div style={boxStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 'bold', color: '#4ade80' }}>🧠 Behavior Engine</span>
        <button
          onClick={onToggle}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          ✕
        </button>
      </div>

      {/* Emotion */}
      <div>
        <span style={labelStyle}>Emotion:</span>
        <span style={{ ...valueStyle, textTransform: 'capitalize' }}>
          {emotion?.primary || 'neutral'}
        </span>
        {emotion?.secondary && (
          <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
            ({emotion.secondary})
          </span>
        )}
        <MiniBar
          value={emotion?.confidence || 0}
          color={emotion?.confidence > 0.6 ? '#4ade80' : '#fbbf24'}
        />
        <span style={{ marginLeft: 4, color: 'rgba(255,255,255,0.4)' }}>
          {Math.round((emotion?.confidence || 0) * 100)}%
        </span>
      </div>

      {/* Behavior Profile */}
      {behavior && (
        <div style={sectionStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4, color: 'rgba(255,255,255,0.8)' }}>
            Profile
          </div>
          <div>
            <span style={labelStyle}>Style:</span>
            <span style={valueStyle}>{behavior.style}</span>
          </div>
          <div>
            <span style={labelStyle}>Backchannels:</span>
            <span style={valueStyle}>{(behavior.backchannelFrequency || 0).toFixed(2)}</span>
            <MiniBar value={behavior.backchannelFrequency || 0} />
          </div>
          <div>
            <span style={labelStyle}>Max tokens:</span>
            <span style={valueStyle}>{behavior.maxResponseTokens}</span>
          </div>
          <div>
            <span style={labelStyle}>Advice bias:</span>
            <span style={valueStyle}>{(behavior.adviceBias || 0.5).toFixed(2)}</span>
            <MiniBar value={behavior.adviceBias || 0.5} />
          </div>
          {behavior.timing && (
            <div>
              <span style={labelStyle}>Zones:</span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                {behavior.timing.zone1}/{behavior.timing.zone2}/{behavior.timing.zone3} ms
              </span>
            </div>
          )}
        </div>
      )}

      {/* User Preferences */}
      {userPrefs && (
        <div style={sectionStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4, color: 'rgba(255,255,255,0.8)' }}>
            Learned Prefs
          </div>
          <div>
            <span style={labelStyle}>BC bias:</span>
            <span style={{ color: getBiasColor(userPrefs.backchannelBias) }}>
              {userPrefs.backchannelBias > 0 ? '+' : ''}{(userPrefs.backchannelBias || 0).toFixed(3)}
            </span>
          </div>
          <div>
            <span style={labelStyle}>Length bias:</span>
            <span style={{ color: getBiasColor(userPrefs.responseLengthBias) }}>
              {userPrefs.responseLengthBias > 0 ? '+' : ''}{(userPrefs.responseLengthBias || 0).toFixed(3)}
            </span>
          </div>
          <div>
            <span style={labelStyle}>Pause bias:</span>
            <span style={{ color: getBiasColor(userPrefs.pauseToleranceBias) }}>
              {userPrefs.pauseToleranceBias > 0 ? '+' : ''}{(userPrefs.pauseToleranceBias || 0).toFixed(3)}
            </span>
          </div>
          <div>
            <span style={labelStyle}>Advice bias:</span>
            <span style={{ color: getBiasColor(userPrefs.adviceBias) }}>
              {userPrefs.adviceBias > 0 ? '+' : ''}{(userPrefs.adviceBias || 0).toFixed(3)}
            </span>
          </div>
        </div>
      )}

      {/* Session Stats */}
      {sessionStats && (
        <div style={sectionStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4, color: 'rgba(255,255,255,0.8)' }}>
            Session
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px' }}>
            <div>
              <span style={labelStyle}>Turns:</span>
              <span style={valueStyle}>{sessionStats.turns || 0}</span>
            </div>
            <div>
              <span style={labelStyle}>BC used:</span>
              <span style={valueStyle}>{sessionStats.backchannelsUsed || 0}</span>
            </div>
            <div>
              <span style={labelStyle}>BC rejected:</span>
              <span style={{ color: sessionStats.backchannelsOverSpoken > 0 ? '#f87171' : valueStyle.color }}>
                {sessionStats.backchannelsOverSpoken || 0}
              </span>
            </div>
            <div>
              <span style={labelStyle}>Interrupts:</span>
              <span style={{ color: sessionStats.interruptions > 0 ? '#fbbf24' : valueStyle.color }}>
                {sessionStats.interruptions || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No data state */}
      {!behavior && !sessionStats && (
        <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
          Waiting for first turn...
        </div>
      )}
    </div>
  );
}

/**
 * Mini version for compact display
 */
export function BehaviorDebugMini({ emotion, behavior }) {
  if (!behavior) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: 6,
        fontSize: 10,
        fontFamily: 'monospace',
        zIndex: 9999
      }}
    >
      <span style={{ marginRight: 8 }}>
        {emotion?.primary || 'neutral'} {Math.round((emotion?.confidence || 0) * 100)}%
      </span>
      <span style={{ color: '#4ade80' }}>
        {behavior.style} | BC: {(behavior.backchannelFrequency || 0).toFixed(2)}
      </span>
    </div>
  );
}

export default BehaviorDebugOverlay;
