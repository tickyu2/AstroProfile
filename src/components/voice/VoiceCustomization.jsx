/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOICE CUSTOMIZATION COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Allows users to:
 * - Select from 5 Luna voice personalities
 * - Preview each voice before selecting
 * - Customize voice settings (stability, style, speed)
 * - Enable/disable constitutional calibration
 * - Choose voice quality model
 *
 * Created: December 21, 2025
 * Mission: "One Luna voice for each soul"
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  voicePreferencesService,
  LUNA_VOICES,
  VOICE_MODELS,
  DEFAULT_VOICE_SETTINGS
} from '../../services/voicePreferencesService';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5'
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  voiceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px'
  },
  voiceCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    backgroundColor: '#fff'
  },
  voiceCardSelected: {
    borderColor: '#6B4EE6',
    backgroundColor: '#f8f6ff',
    boxShadow: '0 4px 12px rgba(107, 78, 230, 0.15)'
  },
  voiceCardRecommended: {
    position: 'relative'
  },
  recommendedBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#10B981',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '12px',
    textTransform: 'uppercase'
  },
  voiceEmoji: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  voiceName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '4px'
  },
  voiceDescription: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '12px',
    lineHeight: '1.4'
  },
  voiceTraits: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px'
  },
  trait: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '12px',
    backgroundColor: '#f0f0f0',
    color: '#555'
  },
  previewButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    padding: '8px',
    border: '1px solid #6B4EE6',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#6B4EE6',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  previewButtonPlaying: {
    backgroundColor: '#6B4EE6',
    color: '#fff'
  },
  settingsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px'
  },
  sliderContainer: {
    marginBottom: '20px'
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  sliderLabelText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a2e'
  },
  sliderValue: {
    fontSize: '13px',
    color: '#6B4EE6',
    fontWeight: '500'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    appearance: 'none',
    backgroundColor: '#e0e0e0',
    cursor: 'pointer'
  },
  sliderDescription: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px'
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    marginBottom: '16px'
  },
  toggleLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a2e'
  },
  toggleDescription: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px'
  },
  toggle: {
    width: '48px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: '#e0e0e0',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  toggleActive: {
    backgroundColor: '#6B4EE6'
  },
  toggleKnob: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  toggleKnobActive: {
    transform: 'translateX(24px)'
  },
  modelSelector: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  modelOption: {
    flex: '1',
    minWidth: '140px',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  modelOptionSelected: {
    borderColor: '#6B4EE6',
    backgroundColor: '#f8f6ff'
  },
  modelIcon: {
    fontSize: '20px',
    marginBottom: '4px'
  },
  modelName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a2e'
  },
  modelDescription: {
    fontSize: '11px',
    color: '#666',
    marginTop: '2px'
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#6B4EE6',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  saveButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function VoiceCustomization({ profileId, constitution, onSave, onClose }) {
  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewingVoice, setPreviewingVoice] = useState(null);

  // Voice preferences
  const [selectedVoice, setSelectedVoice] = useState('present');
  const [recommendedVoice, setRecommendedVoice] = useState(null);
  const [customSettings, setCustomSettings] = useState({ ...DEFAULT_VOICE_SETTINGS });
  const [useConstitutionalCalibration, setUseConstitutionalCalibration] = useState(true);
  const [preferredModel, setPreferredModel] = useState('turbo');

  // Has changes
  const [hasChanges, setHasChanges] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
    return () => {
      voicePreferencesService.stopSpeaking();
    };
  }, [profileId]);

  /**
   * Load current preferences
   */
  const loadPreferences = async () => {
    setLoading(true);
    try {
      const data = await voicePreferencesService.getAvailableVoices(profileId);

      // Set recommended voice
      if (data.recommendedVoice) {
        setRecommendedVoice(data.recommendedVoice.id);
      }

      // Set current preferences
      if (data.currentPreferences) {
        setSelectedVoice(data.currentPreferences.selectedVoice || 'present');
        setCustomSettings(data.currentPreferences.customSettings || { ...DEFAULT_VOICE_SETTINGS });
        setUseConstitutionalCalibration(data.currentPreferences.useConstitutionalCalibration ?? true);
        setPreferredModel(data.currentPreferences.preferredModel || 'turbo');
      } else if (data.recommendedVoice) {
        setSelectedVoice(data.recommendedVoice.id);
      }

    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle voice selection
   */
  const handleSelectVoice = useCallback((voiceId) => {
    setSelectedVoice(voiceId);
    setHasChanges(true);
  }, []);

  /**
   * Handle voice preview
   */
  const handlePreviewVoice = useCallback(async (voiceId, e) => {
    e.stopPropagation();

    if (previewingVoice === voiceId) {
      voicePreferencesService.stopSpeaking();
      setPreviewingVoice(null);
      return;
    }

    setPreviewingVoice(voiceId);

    try {
      await voicePreferencesService.playVoicePreview(voiceId);
    } catch (error) {
      console.error('Preview failed:', error);
    } finally {
      setPreviewingVoice(null);
    }
  }, [previewingVoice]);

  /**
   * Handle slider change
   */
  const handleSliderChange = useCallback((key, value) => {
    setCustomSettings(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }));
    setHasChanges(true);
  }, []);

  /**
   * Handle toggle change
   */
  const handleToggleCalibration = useCallback(() => {
    setUseConstitutionalCalibration(prev => !prev);
    setHasChanges(true);
  }, []);

  /**
   * Handle model change
   */
  const handleModelChange = useCallback((modelId) => {
    setPreferredModel(modelId);
    setHasChanges(true);
  }, []);

  /**
   * Save preferences
   */
  const handleSave = async () => {
    setSaving(true);
    try {
      await voicePreferencesService.savePreferences(profileId, {
        selectedVoice,
        customSettings,
        useConstitutionalCalibration,
        preferredModel
      });

      setHasChanges(false);
      onSave?.({
        selectedVoice,
        customSettings,
        useConstitutionalCalibration,
        preferredModel
      });

    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div style={{ ...styles.container, textAlign: 'center', padding: '60px 24px' }}>
        <div style={styles.loadingSpinner} />
        <p style={{ marginTop: '16px', color: '#666' }}>Loading voice preferences...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span>🎙️</span>
          Luna's Voice
        </h2>
        <p style={styles.subtitle}>
          Choose how Luna speaks to you. Each voice reflects a different way of connecting,
          calibrated to your unique nature.
        </p>
      </div>

      {/* Voice Selection */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>💫</span>
          Choose Your Voice
        </h3>

        <div style={styles.voiceGrid}>
          {Object.entries(LUNA_VOICES).map(([id, voice]) => (
            <div
              key={id}
              style={{
                ...styles.voiceCard,
                ...(selectedVoice === id ? styles.voiceCardSelected : {}),
                ...(recommendedVoice === id ? styles.voiceCardRecommended : {}),
                borderColor: selectedVoice === id ? voice.color : '#e0e0e0'
              }}
              onClick={() => handleSelectVoice(id)}
            >
              {recommendedVoice === id && (
                <div style={styles.recommendedBadge}>Recommended</div>
              )}

              <div style={styles.voiceEmoji}>{voice.emoji}</div>
              <div style={styles.voiceName}>{voice.name}</div>
              <div style={styles.voiceDescription}>{voice.description}</div>

              <div style={styles.voiceTraits}>
                {voice.traits.slice(0, 3).map((trait, i) => (
                  <span key={i} style={{
                    ...styles.trait,
                    backgroundColor: selectedVoice === id ? `${voice.color}20` : '#f0f0f0'
                  }}>
                    {trait}
                  </span>
                ))}
              </div>

              <button
                style={{
                  ...styles.previewButton,
                  ...(previewingVoice === id ? styles.previewButtonPlaying : {}),
                  borderColor: voice.color,
                  color: previewingVoice === id ? '#fff' : voice.color,
                  backgroundColor: previewingVoice === id ? voice.color : 'transparent'
                }}
                onClick={(e) => handlePreviewVoice(id, e)}
              >
                {previewingVoice === id ? (
                  <>
                    <span>⏹️</span> Stop
                  </>
                ) : (
                  <>
                    <span>▶️</span> Preview
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Constitutional Calibration Toggle */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>🌟</span>
          Constitutional Calibration
        </h3>

        <div style={styles.toggleContainer}>
          <div>
            <div style={styles.toggleLabel}>
              Adapt voice to my elemental nature
            </div>
            <div style={styles.toggleDescription}>
              {constitution ? (
                <>Calibrates Luna's voice for your <strong>{constitution}</strong> constitution</>
              ) : (
                'Automatically adjusts voice energy, pacing, and style based on your chart'
              )}
            </div>
          </div>

          <div
            style={{
              ...styles.toggle,
              ...(useConstitutionalCalibration ? styles.toggleActive : {})
            }}
            onClick={handleToggleCalibration}
          >
            <div style={{
              ...styles.toggleKnob,
              ...(useConstitutionalCalibration ? styles.toggleKnobActive : {})
            }} />
          </div>
        </div>
      </div>

      {/* Custom Settings */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>🎛️</span>
          Fine-Tune Voice
        </h3>

        <div style={styles.settingsCard}>
          {/* Stability */}
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span style={styles.sliderLabelText}>Stability</span>
              <span style={styles.sliderValue}>{Math.round(customSettings.stability * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={customSettings.stability}
              onChange={(e) => handleSliderChange('stability', e.target.value)}
              style={styles.slider}
            />
            <div style={styles.sliderDescription}>
              Lower = more expressive & varied. Higher = more consistent & stable.
            </div>
          </div>

          {/* Style */}
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span style={styles.sliderLabelText}>Style</span>
              <span style={styles.sliderValue}>{Math.round(customSettings.style * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={customSettings.style}
              onChange={(e) => handleSliderChange('style', e.target.value)}
              style={styles.slider}
            />
            <div style={styles.sliderDescription}>
              Lower = calm & measured. Higher = dynamic & emotional.
            </div>
          </div>

          {/* Speed */}
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span style={styles.sliderLabelText}>Speed</span>
              <span style={styles.sliderValue}>{customSettings.speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={customSettings.speed}
              onChange={(e) => handleSliderChange('speed', e.target.value)}
              style={styles.slider}
            />
            <div style={styles.sliderDescription}>
              Adjust how fast Luna speaks.
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>⚡</span>
          Voice Quality
        </h3>

        <div style={styles.modelSelector}>
          {Object.entries(VOICE_MODELS).map(([id, model]) => (
            <div
              key={id}
              style={{
                ...styles.modelOption,
                ...(preferredModel === id ? styles.modelOptionSelected : {})
              }}
              onClick={() => handleModelChange(id)}
            >
              <div style={styles.modelIcon}>{model.icon}</div>
              <div style={styles.modelName}>{model.name}</div>
              <div style={styles.modelDescription}>{model.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        style={{
          ...styles.saveButton,
          ...((!hasChanges || saving) ? styles.saveButtonDisabled : {})
        }}
        onClick={handleSave}
        disabled={!hasChanges || saving}
      >
        {saving ? (
          <>
            <div style={styles.loadingSpinner} />
            Saving...
          </>
        ) : (
          <>
            <span>✓</span>
            Save Voice Preferences
          </>
        )}
      </button>
    </div>
  );
}
