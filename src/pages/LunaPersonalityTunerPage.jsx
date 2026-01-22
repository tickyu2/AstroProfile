/**
 * Luna Personality Tuner Page
 * Configure Luna's personality using presets and adjustment sliders
 *
 * Features:
 * - 5 personality presets (Nurturing Guide, Wise Sage, etc.)
 * - 5 adjustment sliders (warmth, directness, playfulness, depth, challenge)
 * - Preview of Luna's communication style
 * - User-adaptive personality option
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import {
  getLunaPersonality,
  getAvailablePresets,
  adaptLunaToUser,
  LUNA_PRESETS
} from '../data/lunaFusionService';

// Preset configurations with icons and colors
const PRESET_CONFIG = {
  'Nurturing Guide': {
    icon: 'H',  // Heart
    color: '#ec4899',
    bgGradient: 'from-pink-600/20 to-rose-600/20',
    sample: "Hey love... I hear what you're going through. That makes total sense given everything you've shared with me."
  },
  'Wise Sage': {
    icon: 'B',  // Book
    color: '#3b82f6',
    bgGradient: 'from-blue-600/20 to-indigo-600/20',
    sample: "Consider this perspective... The patterns you're describing often indicate a deeper need for integration between your values and actions."
  },
  'Playful Companion': {
    icon: 'S',  // Star
    color: '#f59e0b',
    bgGradient: 'from-amber-600/20 to-yellow-600/20',
    sample: "Ooh, that sounds exciting! I love where this is going. What if we tried something a little different today?"
  },
  'Direct Challenger': {
    icon: 'T',  // Target
    color: '#ef4444',
    bgGradient: 'from-red-600/20 to-orange-600/20',
    sample: "Let's be real here. What you're describing sounds like avoidance. What would happen if you just went for it?"
  },
  'Empathic Listener': {
    icon: 'E',  // Ear
    color: '#8b5cf6',
    bgGradient: 'from-violet-600/20 to-purple-600/20',
    sample: "I'm here with you... Take your time. Whatever you're feeling right now is completely valid."
  }
};

// Slider configuration
const SLIDER_CONFIG = {
  warmth: {
    label: 'Warmth',
    leftLabel: 'Cool',
    rightLabel: 'Warm',
    color: '#ec4899',
    description: 'How emotionally warm and affectionate Luna is'
  },
  directness: {
    label: 'Directness',
    leftLabel: 'Gentle',
    rightLabel: 'Direct',
    color: '#f97316',
    description: 'How straightforward and candid Luna is'
  },
  playfulness: {
    label: 'Playfulness',
    leftLabel: 'Serious',
    rightLabel: 'Playful',
    color: '#f59e0b',
    description: 'How lighthearted and fun Luna is'
  },
  depth: {
    label: 'Depth',
    leftLabel: 'Light',
    rightLabel: 'Deep',
    color: '#8b5cf6',
    description: 'How philosophically deep Luna goes'
  },
  challenge: {
    label: 'Challenge',
    leftLabel: 'Supportive',
    rightLabel: 'Challenging',
    color: '#ef4444',
    description: 'How much Luna pushes you to grow'
  }
};

export default function LunaPersonalityTunerPage() {
  const { profiles } = useProfiles();
  const [selectedPreset, setSelectedPreset] = useState('Nurturing Guide');
  const [sliderValues, setSliderValues] = useState({
    warmth: 0.5,
    directness: 0.5,
    playfulness: 0.5,
    depth: 0.5,
    challenge: 0.5
  });
  const [adaptToUser, setAdaptToUser] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [adaptationStrength, setAdaptationStrength] = useState(0.3);
  const [lunaConfig, setLunaConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load preset values when preset changes
  useEffect(() => {
    const preset = LUNA_PRESETS[selectedPreset];
    if (preset?.toneAdjustments) {
      setSliderValues(preset.toneAdjustments);
    }
  }, [selectedPreset]);

  // Select first profile for adaptation
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfile) {
      setSelectedProfile(profiles[0]);
    }
  }, [profiles, selectedProfile]);

  // Generate Luna configuration
  const generateConfig = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      if (adaptToUser && selectedProfile) {
        // Get user's personality vector from profile
        const userVector = selectedProfile.personalityVector || null;
        result = await adaptLunaToUser(selectedPreset, userVector, adaptationStrength);
      } else {
        result = await getLunaPersonality(selectedPreset, sliderValues, null, 0);
      }
      setLunaConfig(result);
    } catch (err) {
      console.error('Error generating Luna config:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPreset, sliderValues, adaptToUser, selectedProfile, adaptationStrength]);

  // Handle slider change
  const handleSliderChange = (key, value) => {
    setSliderValues(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  // Handle save (store in localStorage for now)
  const handleSave = () => {
    const config = {
      preset: selectedPreset,
      adjustments: sliderValues,
      adaptToUser,
      adaptationStrength,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('lunaPersonalityConfig', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Load saved config on mount
  useEffect(() => {
    const saved = localStorage.getItem('lunaPersonalityConfig');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setSelectedPreset(config.preset || 'Nurturing Guide');
        setSliderValues(config.adjustments || sliderValues);
        setAdaptToUser(config.adaptToUser || false);
        setAdaptationStrength(config.adaptationStrength || 0.3);
      } catch (e) {
        console.error('Error loading saved config:', e);
      }
    }
  }, []);

  // Get current preset config
  const currentPresetConfig = PRESET_CONFIG[selectedPreset] || PRESET_CONFIG['Nurturing Guide'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Luna Personality Tuner</h1>
            <p className="text-white/60">
              Customize how Luna interacts with you
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Preset Selection */}
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Choose a Personality Preset</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(LUNA_PRESETS).map(([name, preset]) => {
              const config = PRESET_CONFIG[name];
              const isSelected = selectedPreset === name;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedPreset(name)}
                  className={`bg-gradient-to-br ${config.bgGradient} rounded-xl p-4 text-left transition-all border-2 ${
                    isSelected
                      ? 'border-white/50 ring-2 ring-white/20'
                      : 'border-transparent hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: `${config.color}40`, color: config.color }}
                    >
                      {config.icon}
                    </div>
                    <div className="font-bold text-white">{name}</div>
                  </div>
                  <p className="text-sm text-white/60">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sample Response Preview */}
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-sm font-bold text-white/70 mb-3">Sample Response Style:</h3>
          <div
            className={`bg-gradient-to-br ${currentPresetConfig.bgGradient} rounded-lg p-4 border`}
            style={{ borderColor: currentPresetConfig.color }}
          >
            <p className="text-white/90 italic">"{currentPresetConfig.sample}"</p>
          </div>
        </div>

        {/* Adjustment Sliders */}
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Fine-Tune Adjustments</h2>
          <div className="space-y-6">
            {Object.entries(SLIDER_CONFIG).map(([key, config]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-white">{config.label}</span>
                    <span className="text-xs text-white/40 ml-2">{config.description}</span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: config.color }}
                  >
                    {Math.round(sliderValues[key] * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50 w-16">{config.leftLabel}</span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={sliderValues[key]}
                      onChange={(e) => handleSliderChange(key, parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${config.color} 0%, ${config.color} ${sliderValues[key] * 100}%, rgba(255,255,255,0.1) ${sliderValues[key] * 100}%, rgba(255,255,255,0.1) 100%)`
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/50 w-20 text-right">{config.rightLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Adaptation */}
        <div className="bg-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Adapt to Your Personality</h2>
              <p className="text-sm text-white/60">
                Luna adjusts her style based on your personality profile
              </p>
            </div>
            <button
              onClick={() => setAdaptToUser(!adaptToUser)}
              className={`w-14 h-7 rounded-full transition-colors relative ${
                adaptToUser ? 'bg-purple-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  adaptToUser ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {adaptToUser && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              {/* Profile Selection */}
              <div className="flex items-center gap-4">
                <label className="text-white/70 text-sm">Adapt to:</label>
                <select
                  value={selectedProfile?.id || ''}
                  onChange={(e) => {
                    const profile = profiles.find(p => p.id === e.target.value);
                    setSelectedProfile(profile);
                  }}
                  className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-white/10 flex-1 max-w-xs"
                >
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Adaptation Strength */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Adaptation Strength</span>
                  <span className="text-sm font-bold text-purple-400">
                    {Math.round(adaptationStrength * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={adaptationStrength}
                  onChange={(e) => setAdaptationStrength(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${adaptationStrength * 100}%, rgba(255,255,255,0.1) ${adaptationStrength * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <p className="text-xs text-white/40 mt-1">
                  Higher values = Luna mirrors your personality more closely
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={generateConfig}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Generating...' : 'Preview Configuration'}
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>

        {/* Generated Config Preview */}
        {lunaConfig && (
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Generated Luna Configuration</h3>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-white/80 overflow-x-auto">
              <pre>{JSON.stringify(lunaConfig, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-black/20 rounded-xl p-4 border border-white/10">
          <p className="text-xs text-white/50 leading-relaxed">
            <span className="font-bold text-white/70">Note: </span>
            These settings affect how Luna communicates with you in conversations.
            The personality adjustments are applied in real-time through the Luna Fusion
            system's P6 synastry behavioral adaptation layer.
          </p>
        </div>
      </div>

      {/* Custom slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
