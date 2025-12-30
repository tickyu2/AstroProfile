/**
 * ===============================================================================
 * VOICE SETTINGS PANEL
 * ===============================================================================
 *
 * Settings UI for voice provider configuration.
 * Allows switching between Groq Whisper (STT) and OpenAI Realtime (Native Voice).
 *
 * FEATURES:
 * - Provider strategy selection (Groq Only, OpenAI First, OpenAI Only)
 * - Real-time provider status display
 * - Paralinguistic cue toggle
 * - Connection health indicator
 *
 * Part of GENESIS Voice Mode Enhancement
 * December 27, 2024
 */

import React, { useState, useEffect, useCallback } from 'react';
import { audioCapture } from '../../services/audioCapture';

// ===============================================================================
// VOICE STRATEGIES (mirror backend voiceManager.js)
// ===============================================================================

const VOICE_STRATEGIES = {
  OPENAI_FIRST: 'openai_first',   // Try OpenAI, fall back to Groq
  GROQ_ONLY: 'groq_only',         // Always use Groq (current)
  OPENAI_ONLY: 'openai_only'      // Always use OpenAI (fastest)
};

const VOICE_PROVIDERS = {
  GROQ_WHISPER: 'groq_whisper',
  OPENAI_REALTIME: 'openai_realtime'
};

// Noise suppression presets
const NOISE_PRESET_CONFIG = {
  light: {
    label: 'Light',
    description: 'Minimal filtering, preserves more audio',
    icon: '🔇',
    color: '#22c55e'
  },
  normal: {
    label: 'Normal',
    description: 'Balanced noise reduction',
    icon: '🔉',
    color: '#f59e0b'
  },
  aggressive: {
    label: 'Aggressive',
    description: 'Strong filtering for noisy environments',
    icon: '🔊',
    color: '#ef4444'
  },
  office: {
    label: 'Office',
    description: 'Optimized for keyboard, AC, chatter',
    icon: '🏢',
    color: '#3b82f6'
  },
  outdoor: {
    label: 'Outdoor',
    description: 'For wind, traffic, and outdoor noise',
    icon: '🌳',
    color: '#10b981'
  }
};

// Strategy display configuration
const STRATEGY_CONFIG = {
  [VOICE_STRATEGIES.GROQ_ONLY]: {
    label: 'Groq STT',
    description: 'Speech-to-Text pipeline. Reliable and accurate.',
    icon: '🎯',
    color: '#22c55e',
    pros: ['Reliable', 'Free tier', 'Fast STT'],
    cons: ['No emotion detection', 'Extra latency']
  },
  [VOICE_STRATEGIES.OPENAI_FIRST]: {
    label: 'Hybrid',
    description: 'Try OpenAI native, fallback to Groq if unavailable.',
    icon: '🔄',
    color: '#f59e0b',
    pros: ['Best of both', 'Auto-fallback', 'Emotion detection when available'],
    cons: ['Requires OpenAI key']
  },
  [VOICE_STRATEGIES.OPENAI_ONLY]: {
    label: 'Native Voice',
    description: 'OpenAI Realtime API. Fastest with emotion detection.',
    icon: '⚡',
    color: '#8b5cf6',
    pros: ['Sub-200ms latency', 'Emotion detection', 'Natural voice'],
    cons: ['Requires OpenAI key', 'Higher cost']
  }
};

// ===============================================================================
// STYLES
// ===============================================================================

const styles = {
  container: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },

  title: {
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#fff'
  },

  statusBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontWeight: 500
  },

  strategyGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px'
  },

  strategyOption: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #333',
    backgroundColor: '#252525',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  strategyOptionSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)'
  },

  strategyOptionDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },

  strategyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },

  strategyIcon: {
    fontSize: '18px'
  },

  strategyLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff'
  },

  strategyDescription: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px'
  },

  strategyTags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap'
  },

  tag: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },

  tagPro: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e'
  },

  tagCon: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444'
  },

  divider: {
    height: '1px',
    backgroundColor: '#333',
    margin: '16px 0'
  },

  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0'
  },

  settingLabel: {
    fontSize: '13px',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  toggle: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: '#333',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },

  toggleActive: {
    backgroundColor: '#8b5cf6'
  },

  toggleKnob: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '2px',
    left: '2px',
    transition: 'transform 0.2s ease'
  },

  toggleKnobActive: {
    transform: 'translateX(20px)'
  },

  statusSection: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#252525',
    marginTop: '12px'
  },

  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0'
  },

  statusLabel: {
    fontSize: '12px',
    color: '#888'
  },

  statusValue: {
    fontSize: '12px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },

  connectionDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },

  warning: {
    marginTop: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    color: '#FFA500',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px'
  },

  compact: {
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  compactLabel: {
    fontSize: '12px',
    color: '#888'
  },

  compactSelector: {
    display: 'flex',
    gap: '4px'
  },

  compactOption: {
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid #444',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#888',
    transition: 'all 0.2s ease'
  },

  compactOptionSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    color: '#fff'
  },

  // Noise suppression styles
  noiseSection: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#252525',
    border: '1px solid #333'
  },

  noiseSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },

  noiseSectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  noisePresetGrid: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '12px'
  },

  noisePresetButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '11px',
    color: '#888',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },

  noisePresetButtonSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
    color: '#fff'
  },

  calibrateButton: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  },

  calibrateButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderColor: '#3b82f6'
  },

  noiseStats: {
    marginTop: '8px',
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: '#1a1a1a',
    fontSize: '10px',
    color: '#666'
  },

  noiseStatsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 0'
  },

  // Streaming TTS styles
  streamingSection: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#252525',
    border: '1px solid #333'
  },

  streamingSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },

  streamingSectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  streamingDescription: {
    fontSize: '11px',
    color: '#888',
    marginBottom: '12px',
    lineHeight: 1.4
  },

  streamingProgress: {
    marginTop: '8px',
    padding: '8px',
    borderRadius: '6px',
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(139, 92, 246, 0.3)'
  },

  streamingProgressBar: {
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#333',
    marginBottom: '6px',
    overflow: 'hidden'
  },

  streamingProgressFill: {
    height: '100%',
    borderRadius: '2px',
    backgroundColor: '#8b5cf6',
    transition: 'width 0.3s ease'
  },

  streamingProgressText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '10px',
    color: '#888'
  },

  streamingChunk: {
    fontSize: '10px',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%'
  },

  streamingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#8b5cf6'
  }
};

// ===============================================================================
// TOGGLE COMPONENT
// ===============================================================================

function Toggle({ value, onChange, disabled = false }) {
  return (
    <div
      onClick={() => !disabled && onChange(!value)}
      style={{
        ...styles.toggle,
        ...(value ? styles.toggleActive : {}),
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      <div
        style={{
          ...styles.toggleKnob,
          ...(value ? styles.toggleKnobActive : {})
        }}
      />
    </div>
  );
}

// ===============================================================================
// STRATEGY OPTION COMPONENT
// ===============================================================================

function StrategyOption({
  strategy,
  isSelected,
  isAvailable = true,
  onClick,
  showDetails = true
}) {
  const config = STRATEGY_CONFIG[strategy];

  return (
    <div
      onClick={() => isAvailable && onClick(strategy)}
      style={{
        ...styles.strategyOption,
        ...(isSelected ? styles.strategyOptionSelected : {}),
        ...(!isAvailable ? styles.strategyOptionDisabled : {}),
        borderColor: isSelected ? config.color : '#333'
      }}
    >
      <div style={styles.strategyHeader}>
        <span style={styles.strategyIcon}>{config.icon}</span>
        <span style={{ ...styles.strategyLabel, color: isSelected ? config.color : '#fff' }}>
          {config.label}
        </span>
        {isSelected && (
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: config.color }}>
            Active
          </span>
        )}
      </div>

      <div style={styles.strategyDescription}>{config.description}</div>

      {showDetails && (
        <div style={styles.strategyTags}>
          {config.pros.slice(0, 2).map((pro, i) => (
            <span key={`pro-${i}`} style={{ ...styles.tag, ...styles.tagPro }}>
              + {pro}
            </span>
          ))}
          {config.cons.slice(0, 1).map((con, i) => (
            <span key={`con-${i}`} style={{ ...styles.tag, ...styles.tagCon }}>
              - {con}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ===============================================================================
// MAIN VOICE SETTINGS PANEL
// ===============================================================================

export default function VoiceSettingsPanel({
  strategy = VOICE_STRATEGIES.GROQ_ONLY,
  onStrategyChange,
  showCues = true,
  onShowCuesChange,
  providerStatus = null,
  compact = false,
  className = '',
  // Noise suppression props
  noiseSuppressionEnabled = false,
  onNoiseSuppressionChange,
  noisePreset = 'normal',
  onNoisePresetChange,
  // Streaming TTS props
  streamingEnabled = false,
  onStreamingChange,
  isStreaming = false,
  streamingProgress = null
}) {
  const [currentStrategy, setCurrentStrategy] = useState(strategy);
  const [cuesEnabled, setCuesEnabled] = useState(showCues);
  const [openAIAvailable, setOpenAIAvailable] = useState(true); // Would be checked via API

  // Noise suppression state
  const [noiseEnabled, setNoiseEnabled] = useState(noiseSuppressionEnabled);
  const [currentNoisePreset, setCurrentNoisePreset] = useState(noisePreset);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [noiseStats, setNoiseStats] = useState(null);

  // Streaming TTS state
  const [streamingTTSEnabled, setStreamingTTSEnabled] = useState(streamingEnabled);

  // Sync with props
  useEffect(() => {
    setCurrentStrategy(strategy);
  }, [strategy]);

  useEffect(() => {
    setCuesEnabled(showCues);
  }, [showCues]);

  useEffect(() => {
    setNoiseEnabled(noiseSuppressionEnabled);
  }, [noiseSuppressionEnabled]);

  useEffect(() => {
    setCurrentNoisePreset(noisePreset);
  }, [noisePreset]);

  useEffect(() => {
    setStreamingTTSEnabled(streamingEnabled);
  }, [streamingEnabled]);

  // Update noise stats periodically when enabled
  useEffect(() => {
    if (noiseEnabled) {
      const interval = setInterval(() => {
        setNoiseStats(audioCapture.getNoiseSuppressionStats());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [noiseEnabled]);

  // Noise suppression handlers
  const handleNoiseToggle = useCallback((enabled) => {
    setNoiseEnabled(enabled);
    if (enabled) {
      audioCapture.enableNoiseSuppression(currentNoisePreset);
    } else {
      audioCapture.disableNoiseSuppression();
    }
    onNoiseSuppressionChange?.(enabled);
  }, [currentNoisePreset, onNoiseSuppressionChange]);

  const handleNoisePresetChange = useCallback((preset) => {
    setCurrentNoisePreset(preset);
    if (noiseEnabled) {
      audioCapture.setNoisePreset(preset);
    }
    onNoisePresetChange?.(preset);
  }, [noiseEnabled, onNoisePresetChange]);

  const handleCalibrate = useCallback(async () => {
    if (isCalibrating) return;

    setIsCalibrating(true);
    try {
      const result = await audioCapture.calibrateNoise(2000);
      console.log('[VoiceSettings] Calibration result:', result);
      setNoiseStats(audioCapture.getNoiseSuppressionStats());
    } catch (error) {
      console.error('[VoiceSettings] Calibration failed:', error);
    }
    setIsCalibrating(false);
  }, [isCalibrating]);

  // Streaming TTS handler
  const handleStreamingToggle = useCallback((enabled) => {
    setStreamingTTSEnabled(enabled);
    onStreamingChange?.(enabled);
  }, [onStreamingChange]);

  const handleStrategyChange = useCallback((newStrategy) => {
    // Check if OpenAI is required but not available
    if (newStrategy !== VOICE_STRATEGIES.GROQ_ONLY && !openAIAvailable) {
      console.warn('[VoiceSettings] OpenAI not available for this strategy');
      return;
    }

    setCurrentStrategy(newStrategy);
    onStrategyChange?.(newStrategy);
  }, [openAIAvailable, onStrategyChange]);

  const handleCuesToggle = useCallback((enabled) => {
    setCuesEnabled(enabled);
    onShowCuesChange?.(enabled);
  }, [onShowCuesChange]);

  // Determine current provider based on strategy
  const getCurrentProvider = () => {
    if (currentStrategy === VOICE_STRATEGIES.GROQ_ONLY) {
      return VOICE_PROVIDERS.GROQ_WHISPER;
    }
    if (currentStrategy === VOICE_STRATEGIES.OPENAI_ONLY) {
      return VOICE_PROVIDERS.OPENAI_REALTIME;
    }
    // Hybrid - check providerStatus
    return providerStatus?.provider || VOICE_PROVIDERS.GROQ_WHISPER;
  };

  const supportsCues = getCurrentProvider() === VOICE_PROVIDERS.OPENAI_REALTIME;

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPACT VIEW
  // ─────────────────────────────────────────────────────────────────────────────

  if (compact) {
    return (
      <div className={className} style={styles.compact}>
        <span style={styles.compactLabel}>Voice:</span>
        <div style={styles.compactSelector}>
          {Object.keys(VOICE_STRATEGIES).map(key => {
            const strat = VOICE_STRATEGIES[key];
            const config = STRATEGY_CONFIG[strat];
            const isSelected = currentStrategy === strat;
            const isAvailable = strat === VOICE_STRATEGIES.GROQ_ONLY || openAIAvailable;

            return (
              <button
                key={key}
                onClick={() => isAvailable && handleStrategyChange(strat)}
                disabled={!isAvailable}
                style={{
                  ...styles.compactOption,
                  ...(isSelected ? {
                    ...styles.compactOptionSelected,
                    borderColor: config.color
                  } : {}),
                  opacity: isAvailable ? 1 : 0.5
                }}
                title={config.description}
              >
                {config.icon} {config.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FULL VIEW
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className={className} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🎤</span>
          <span>Voice Settings</span>
        </div>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: providerStatus?.isConnected
              ? 'rgba(34, 197, 94, 0.2)'
              : 'rgba(239, 68, 68, 0.2)',
            color: providerStatus?.isConnected ? '#22c55e' : '#ef4444'
          }}
        >
          {providerStatus?.isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Strategy Selection */}
      <div style={styles.strategyGrid}>
        {Object.keys(VOICE_STRATEGIES).map(key => {
          const strat = VOICE_STRATEGIES[key];
          const isAvailable = strat === VOICE_STRATEGIES.GROQ_ONLY || openAIAvailable;

          return (
            <StrategyOption
              key={key}
              strategy={strat}
              isSelected={currentStrategy === strat}
              isAvailable={isAvailable}
              onClick={handleStrategyChange}
              showDetails={true}
            />
          );
        })}
      </div>

      <div style={styles.divider} />

      {/* Additional Settings */}
      <div style={styles.settingRow}>
        <div style={styles.settingLabel}>
          <span>😊</span>
          <span>Show Emotional Cues</span>
          {!supportsCues && (
            <span style={{ fontSize: '10px', color: '#666' }}>(Native only)</span>
          )}
        </div>
        <Toggle
          value={cuesEnabled && supportsCues}
          onChange={handleCuesToggle}
          disabled={!supportsCues}
        />
      </div>

      {/* Status Section */}
      <div style={styles.statusSection}>
        <div style={styles.statusRow}>
          <span style={styles.statusLabel}>Active Provider</span>
          <span style={styles.statusValue}>
            {getCurrentProvider() === VOICE_PROVIDERS.OPENAI_REALTIME ? (
              <>
                <span style={{ ...styles.connectionDot, backgroundColor: '#8b5cf6' }} />
                OpenAI Native
              </>
            ) : (
              <>
                <span style={{ ...styles.connectionDot, backgroundColor: '#22c55e' }} />
                Groq Whisper
              </>
            )}
          </span>
        </div>

        <div style={styles.statusRow}>
          <span style={styles.statusLabel}>Cue Detection</span>
          <span style={styles.statusValue}>
            {supportsCues ? (
              <span style={{ color: '#22c55e' }}>Available</span>
            ) : (
              <span style={{ color: '#888' }}>Not available</span>
            )}
          </span>
        </div>

        <div style={styles.statusRow}>
          <span style={styles.statusLabel}>Strategy</span>
          <span style={styles.statusValue}>
            {STRATEGY_CONFIG[currentStrategy].label}
          </span>
        </div>
      </div>

      {/* Warning for missing API key */}
      {!openAIAvailable && currentStrategy !== VOICE_STRATEGIES.GROQ_ONLY && (
        <div style={styles.warning}>
          <span>⚠️</span>
          <span>
            OpenAI API key not configured. Native voice and Hybrid modes require an OpenAI API key.
            Currently falling back to Groq Whisper.
          </span>
        </div>
      )}

      {/* Noise Suppression Section */}
      <div style={styles.noiseSection}>
        <div style={styles.noiseSectionHeader}>
          <div style={styles.noiseSectionTitle}>
            <span>🔇</span>
            <span>Noise Suppression</span>
          </div>
          <Toggle
            value={noiseEnabled}
            onChange={handleNoiseToggle}
          />
        </div>

        {noiseEnabled && (
          <>
            {/* Preset Selection */}
            <div style={styles.noisePresetGrid}>
              {Object.entries(NOISE_PRESET_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleNoisePresetChange(key)}
                  style={{
                    ...styles.noisePresetButton,
                    ...(currentNoisePreset === key ? {
                      ...styles.noisePresetButtonSelected,
                      borderColor: config.color
                    } : {})
                  }}
                  title={config.description}
                >
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                </button>
              ))}
            </div>

            {/* Calibrate Button */}
            <button
              onClick={handleCalibrate}
              disabled={isCalibrating}
              style={{
                ...styles.calibrateButton,
                ...(isCalibrating ? styles.calibrateButtonActive : {})
              }}
            >
              {isCalibrating ? (
                <>
                  <span className="animate-pulse">●</span>
                  <span>Calibrating... (stay quiet)</span>
                </>
              ) : (
                <>
                  <span>🎚️</span>
                  <span>Calibrate Noise Floor</span>
                </>
              )}
            </button>

            {/* Stats (when available) */}
            {noiseStats && noiseStats.isCalibrated && (
              <div style={styles.noiseStats}>
                <div style={styles.noiseStatsRow}>
                  <span>Noise Floor:</span>
                  <span>{(noiseStats.noiseFloor * 100).toFixed(2)}%</span>
                </div>
                <div style={styles.noiseStatsRow}>
                  <span>Gate:</span>
                  <span style={{
                    color: noiseStats.gateState === 'open' ? '#22c55e' : '#ef4444'
                  }}>
                    {noiseStats.gateState}
                  </span>
                </div>
                <div style={styles.noiseStatsRow}>
                  <span>Reduction:</span>
                  <span>{noiseStats.averageReduction?.toFixed(1) || 0}%</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Streaming TTS Section */}
      <div style={styles.streamingSection}>
        <div style={styles.streamingSectionHeader}>
          <div style={styles.streamingSectionTitle}>
            <span>🎵</span>
            <span>Streaming TTS</span>
          </div>
          <Toggle
            value={streamingTTSEnabled}
            onChange={handleStreamingToggle}
          />
        </div>

        <div style={styles.streamingDescription}>
          Progressive audio playback for faster response. Luna starts speaking before
          the full response is generated, reducing perceived latency.
        </div>

        {streamingTTSEnabled && (
          <>
            {/* Active streaming indicator */}
            {isStreaming && (
              <div style={styles.streamingProgress}>
                {/* Progress bar */}
                <div style={styles.streamingProgressBar}>
                  <div
                    style={{
                      ...styles.streamingProgressFill,
                      width: `${streamingProgress?.percent || 0}%`
                    }}
                  />
                </div>

                {/* Progress text */}
                <div style={styles.streamingProgressText}>
                  <div style={styles.streamingBadge}>
                    <span className="animate-pulse">●</span>
                    <span>Streaming...</span>
                  </div>
                  <span>
                    {streamingProgress?.current || 0} / {streamingProgress?.total || 0} chunks
                  </span>
                </div>

                {/* Current chunk preview */}
                {streamingProgress?.currentChunk && (
                  <div style={styles.streamingChunk}>
                    "{streamingProgress.currentChunk.substring(0, 50)}..."
                  </div>
                )}
              </div>
            )}

            {/* Info when not actively streaming */}
            {!isStreaming && (
              <div style={{
                fontSize: '11px',
                color: '#666',
                padding: '8px',
                backgroundColor: '#1a1a1a',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: '#22c55e' }}>Ready</span>
                <span>Next long response will stream progressively</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ===============================================================================
// NAMED EXPORTS
// ===============================================================================

export {
  VOICE_STRATEGIES,
  VOICE_PROVIDERS,
  STRATEGY_CONFIG,
  NOISE_PRESET_CONFIG
};
