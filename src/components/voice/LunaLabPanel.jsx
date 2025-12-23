/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA LAB PANEL - Live Behavior Tuning Interface
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Developer tool for live-tuning Luna's behavior parameters:
 * - Backchannel frequency
 * - Response length (max tokens)
 * - Pause timing scale
 * - Advice vs reflection bias
 * - Force style override
 *
 * Changes take effect immediately without restarting the backend.
 *
 * Created: December 21, 2025
 */

import React, { useState, useCallback } from 'react';

/**
 * Available styles for override
 */
const STYLES = [
  'balanced', 'gentle', 'reassuring', 'playful', 'enthusiastic',
  'grounding', 'curious', 'steady', 'protective', 'intimate', 'clarifying'
];

/**
 * Debug API base URL
 */
const DEBUG_API = import.meta.env.VITE_DEBUG_API_URL || 'http://localhost:8090';

/**
 * LunaLabPanel Component
 *
 * @param {Object} props
 * @param {string} props.userId - User ID for overrides
 * @param {Object} props.behavior - Current behavior profile
 * @param {Function} props.onClose - Called to close lab mode
 */
export function LunaLabPanel({ userId = 'anonymous', behavior, onClose }) {
  const [overrides, setOverrides] = useState({
    backchannelFrequency: null,
    maxResponseTokens: null,
    pauseScale: null,
    adviceBias: null,
    style: null
  });
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Apply overrides to backend
   */
  const applyOverrides = useCallback(async () => {
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${DEBUG_API}/debug/lab-overrides/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overrides)
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Overrides applied!' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to apply' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Backend not reachable' });
    }

    setIsLoading(false);
  }, [userId, overrides]);

  /**
   * Clear all overrides
   */
  const clearOverrides = useCallback(async () => {
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${DEBUG_API}/debug/lab-overrides/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setOverrides({
          backchannelFrequency: null,
          maxResponseTokens: null,
          pauseScale: null,
          adviceBias: null,
          style: null
        });
        setStatus({ type: 'success', message: 'Overrides cleared!' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to clear' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Backend not reachable' });
    }

    setIsLoading(false);
  }, [userId]);

  /**
   * Update a single override value
   */
  const updateOverride = (key, value) => {
    setOverrides(prev => ({
      ...prev,
      [key]: value === '' ? null : value
    }));
  };

  // Styles
  const boxStyle = {
    position: 'fixed',
    top: 56,
    right: 16,
    width: 300,
    background: 'linear-gradient(145deg, rgba(20,20,30,0.95), rgba(10,10,20,0.98))',
    color: '#fff',
    padding: '16px',
    borderRadius: 12,
    fontSize: 12,
    fontFamily: 'system-ui, sans-serif',
    zIndex: 9999,
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(100, 200, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  };

  const labelStyle = {
    display: 'block',
    marginTop: 12,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    marginTop: 4,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 6,
    color: '#fff',
    fontSize: 12
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    transition: 'all 0.2s ease'
  };

  const applyButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
    color: '#000'
  };

  const clearButtonStyle = {
    ...buttonStyle,
    background: 'rgba(255,255,255,0.1)',
    color: '#fff'
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    fontSize: 16,
    padding: 4
  };

  const currentValueStyle = {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2
  };

  const overrideActiveStyle = {
    color: '#4ade80',
    fontSize: 10,
    marginLeft: 6
  };

  return (
    <div style={boxStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#4ade80' }}>
            Luna Lab Mode
          </span>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            Live behavior tuning
          </div>
        </div>
        <button style={closeButtonStyle} onClick={onClose} title="Close Lab Mode">
          ✕
        </button>
      </div>

      {/* Current Behavior Display */}
      {behavior && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: 10,
          borderRadius: 8,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
            Current Effective Values
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 11 }}>
            <div>Style: <span style={{ color: '#4ade80' }}>{behavior.style}</span></div>
            <div>BC: <span style={{ color: '#4ade80' }}>{(behavior.backchannelFrequency || 0).toFixed(2)}</span></div>
            <div>Tokens: <span style={{ color: '#4ade80' }}>{behavior.maxResponseTokens}</span></div>
            <div>Advice: <span style={{ color: '#4ade80' }}>{(behavior.adviceBias || 0.5).toFixed(2)}</span></div>
          </div>
          {behavior._labOverride && (
            <div style={{ marginTop: 6, fontSize: 10, color: '#fbbf24' }}>
              Lab overrides active
            </div>
          )}
        </div>
      )}

      {/* Backchannel Frequency */}
      <label style={labelStyle}>
        Backchannel Frequency (0-1)
        {overrides.backchannelFrequency !== null && <span style={overrideActiveStyle}>override</span>}
        <input
          type="number"
          min="0"
          max="1"
          step="0.05"
          placeholder={behavior?.backchannelFrequency?.toFixed(2) || '0.30'}
          value={overrides.backchannelFrequency ?? ''}
          onChange={e => updateOverride('backchannelFrequency', e.target.value === '' ? null : parseFloat(e.target.value))}
          style={inputStyle}
        />
        <div style={currentValueStyle}>
          Lower = fewer cues, Higher = more cues
        </div>
      </label>

      {/* Max Response Tokens */}
      <label style={labelStyle}>
        Max Response Tokens (20-600)
        {overrides.maxResponseTokens !== null && <span style={overrideActiveStyle}>override</span>}
        <input
          type="number"
          min="20"
          max="600"
          step="10"
          placeholder={behavior?.maxResponseTokens || '200'}
          value={overrides.maxResponseTokens ?? ''}
          onChange={e => updateOverride('maxResponseTokens', e.target.value === '' ? null : parseInt(e.target.value, 10))}
          style={inputStyle}
        />
        <div style={currentValueStyle}>
          Lower = shorter replies, Higher = longer replies
        </div>
      </label>

      {/* Pause Scale */}
      <label style={labelStyle}>
        Pause Timing Scale (0.4-2.0)
        {overrides.pauseScale !== null && <span style={overrideActiveStyle}>override</span>}
        <input
          type="number"
          min="0.4"
          max="2.0"
          step="0.1"
          placeholder="1.0"
          value={overrides.pauseScale ?? ''}
          onChange={e => updateOverride('pauseScale', e.target.value === '' ? null : parseFloat(e.target.value))}
          style={inputStyle}
        />
        <div style={currentValueStyle}>
          Lower = faster response, Higher = more patience
        </div>
      </label>

      {/* Advice Bias */}
      <label style={labelStyle}>
        Advice Bias (0-1)
        {overrides.adviceBias !== null && <span style={overrideActiveStyle}>override</span>}
        <input
          type="number"
          min="0"
          max="1"
          step="0.05"
          placeholder={behavior?.adviceBias?.toFixed(2) || '0.50'}
          value={overrides.adviceBias ?? ''}
          onChange={e => updateOverride('adviceBias', e.target.value === '' ? null : parseFloat(e.target.value))}
          style={inputStyle}
        />
        <div style={currentValueStyle}>
          0 = reflective only, 1 = advisory
        </div>
      </label>

      {/* Style Override */}
      <label style={labelStyle}>
        Force Style
        {overrides.style !== null && <span style={overrideActiveStyle}>override</span>}
        <select
          value={overrides.style || ''}
          onChange={e => updateOverride('style', e.target.value || null)}
          style={selectStyle}
        >
          <option value="">Auto (based on emotion)</option>
          {STYLES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      {/* Status Message */}
      {status && (
        <div style={{
          marginTop: 12,
          padding: '8px 10px',
          borderRadius: 6,
          fontSize: 11,
          background: status.type === 'success' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
          color: status.type === 'success' ? '#4ade80' : '#f87171'
        }}>
          {status.message}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <button
          style={applyButtonStyle}
          onClick={applyOverrides}
          disabled={isLoading}
        >
          {isLoading ? 'Applying...' : 'Apply Overrides'}
        </button>
        <button
          style={clearButtonStyle}
          onClick={clearOverrides}
          disabled={isLoading}
        >
          Clear All
        </button>
      </div>

      {/* Hint */}
      <div style={{ marginTop: 12, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
        Changes apply to the next turn. Talk to Luna to see the effect!
      </div>
    </div>
  );
}

export default LunaLabPanel;
