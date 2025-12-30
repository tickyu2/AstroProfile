/**
 * ============================================================================
 * REALTIME ARCHETYPE DISPLAY
 * ============================================================================
 *
 * Real-time visualization of GENESIS archetype detection.
 * Shows current archetype, congruence status, and signal meters.
 *
 * Features:
 * - Live archetype display with icon and color
 * - Confidence meter
 * - Congruence indicator (matching, masking, sarcasm, etc.)
 * - Secondary archetypes
 * - Signal meters
 *
 * Part of: GENESIS Archetype Integration
 * Created: December 29, 2024
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  ARCHETYPE_COLORS,
  ARCHETYPE_ICONS,
  ARCHETYPE_NAMES,
  ARCHETYPE_DESCRIPTIONS
} from '../../services/archetype/lexicons.js';

/**
 * Main RealtimeArchetypeDisplay Component
 */
export default function RealtimeArchetypeDisplay({
  currentDetection,
  congruenceAnalysis,
  isLive = false,
  compact = false
}) {
  const [pulseOpacity, setPulseOpacity] = useState(1);

  // Pulse effect when live
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPulseOpacity(prev => prev === 1 ? 0.6 : 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  if (!currentDetection) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <div className="text-center text-slate-400">
          <span className="text-3xl block mb-2">🎭</span>
          <p className="text-sm">Waiting for speech...</p>
        </div>
      </div>
    );
  }

  const archetype = currentDetection.primary?.name || currentDetection.archetype;
  const score = currentDetection.primary?.score || currentDetection.score || 0;
  const color = ARCHETYPE_COLORS[archetype] || '#6366f1';
  const icon = ARCHETYPE_ICONS[archetype] || '✨';

  if (compact) {
    return (
      <CompactDisplay
        archetype={archetype}
        score={score}
        color={color}
        icon={icon}
        congruence={congruenceAnalysis}
        isLive={isLive}
        pulseOpacity={pulseOpacity}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Archetype Display */}
      <div
        className="relative rounded-xl p-6 shadow-lg overflow-hidden"
        style={{
          backgroundColor: color + '20',
          borderColor: color,
          borderWidth: '2px',
          borderStyle: 'solid'
        }}
      >
        {/* Live Indicator */}
        {isLive && (
          <div
            className="absolute top-4 right-4 flex items-center gap-2"
            style={{ opacity: pulseOpacity, transition: 'opacity 0.5s' }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#ef4444' }}
            />
            <span className="text-xs font-semibold text-white">LIVE</span>
          </div>
        )}

        {/* Archetype */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="text-5xl"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white capitalize">
              {ARCHETYPE_NAMES[archetype] || archetype}
            </h3>
            <p className="text-white/70 text-sm">
              {ARCHETYPE_DESCRIPTIONS[archetype] || 'Primary Archetype'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {(score * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-white/70">Confidence</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${score * 100}%`,
              backgroundColor: color
            }}
          />
        </div>

        {/* Secondary Archetypes */}
        {currentDetection.secondary && currentDetection.secondary.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-white/70">Also present:</span>
            {currentDetection.secondary.map(sec => (
              <span
                key={sec.name}
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: ARCHETYPE_COLORS[sec.name] + '60',
                  color: 'white'
                }}
              >
                {ARCHETYPE_ICONS[sec.name]} {sec.name} ({(sec.score * 100).toFixed(0)}%)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Congruence Analysis */}
      {congruenceAnalysis && (
        <CongruenceDisplay analysis={congruenceAnalysis} />
      )}

      {/* Signal Meters */}
      {currentDetection.signals && (
        <SignalMeters signals={currentDetection.signals} />
      )}
    </div>
  );
}

/**
 * Compact Display Component
 */
function CompactDisplay({ archetype, score, color, icon, congruence, isLive, pulseOpacity }) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-2"
      style={{
        backgroundColor: color + '30',
        borderColor: color,
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      {isLive && (
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            backgroundColor: '#ef4444',
            opacity: pulseOpacity,
            transition: 'opacity 0.5s'
          }}
        />
      )}
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium capitalize truncate">
          {ARCHETYPE_NAMES[archetype] || archetype}
        </div>
        {congruence && (
          <div className="text-xs text-white/70">
            {congruence.pattern} • {congruence.confirmedEmotion}
          </div>
        )}
      </div>
      <div className="text-white/80 text-sm font-medium">
        {(score * 100).toFixed(0)}%
      </div>
    </div>
  );
}

/**
 * Congruence Display Component
 */
function CongruenceDisplay({ analysis }) {
  const getCongruenceConfig = () => {
    switch (analysis.congruence) {
      case 'CONGRUENT':
        return { icon: '✓', color: '#22c55e', label: 'Congruent' };
      case 'INCONGRUENT':
        return { icon: '✗', color: '#ef4444', label: 'Incongruent' };
      default:
        return { icon: '~', color: '#f59e0b', label: 'Partial' };
    }
  };

  const getPatternConfig = () => {
    const patterns = {
      MATCHING: { icon: '🤝', color: '#22c55e', label: 'Matching' },
      MASKING: { icon: '🎭', color: '#f59e0b', label: 'Masking' },
      SARCASM: { icon: '😏', color: '#f97316', label: 'Sarcasm' },
      AMPLIFICATION: { icon: '📢', color: '#3b82f6', label: 'Amplified' },
      SUPPRESSION: { icon: '🔇', color: '#a855f7', label: 'Suppressing' },
      MIXED: { icon: '🔀', color: '#6366f1', label: 'Mixed' }
    };
    return patterns[analysis.pattern] || patterns.MATCHING;
  };

  const congruence = getCongruenceConfig();
  const pattern = getPatternConfig();

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-white/80">Voice + Text Analysis</h4>
        <div
          className="flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: congruence.color + '30', color: congruence.color }}
        >
          <span>{congruence.icon}</span>
          <span>{congruence.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pattern */}
        <div className="space-y-1">
          <div className="text-xs text-white/60">Pattern</div>
          <div
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: pattern.color }}
          >
            <span>{pattern.icon}</span>
            <span>{pattern.label}</span>
          </div>
        </div>

        {/* Confirmed Emotion */}
        <div className="space-y-1">
          <div className="text-xs text-white/60">Confirmed</div>
          <div className="text-sm font-medium text-white capitalize">
            {analysis.confirmedEmotion}
          </div>
        </div>

        {/* Voice Emotion */}
        <div className="space-y-1">
          <div className="text-xs text-white/60">Voice</div>
          <div className="text-sm text-white/80 capitalize">
            {analysis.voiceEmotion}
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-1">
          <div className="text-xs text-white/60">Confidence</div>
          <div className="text-sm text-white/80">
            {(analysis.confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Luna Guidance */}
      {analysis.lunaGuidance && (
        <div className="mt-4 pt-3 border-t border-slate-700">
          <div className="text-xs text-white/60 mb-1">Luna Guidance</div>
          <div className="text-sm text-white/90 italic">
            "{analysis.lunaGuidance.example}"
          </div>
          <div className="text-xs text-white/50 mt-1">
            Tone: {analysis.lunaGuidance.tone}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Signal Meters Component
 */
function SignalMeters({ signals }) {
  const meters = [
    { label: 'Intensity', value: signals.intensity || 0, color: '#ef4444' },
    { label: 'Valence', value: (signals.valence + 1) / 2 || 0.5, color: signals.valence > 0 ? '#22c55e' : '#f59e0b' },
    { label: 'Uncertainty', value: signals.uncertainty || 0, color: '#a855f7' },
    { label: 'Agency', value: (signals.agency + 1) / 2 || 0.5, color: '#3b82f6' }
  ];

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <h4 className="text-sm font-medium text-white/80 mb-3">Signal Analysis</h4>
      <div className="space-y-3">
        {meters.map(meter => (
          <div key={meter.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">{meter.label}</span>
              <span className="text-white/80">{(meter.value * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${meter.value * 100}%`,
                  backgroundColor: meter.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Emotion Words */}
      {signals.dominantEmotion && signals.dominantEmotion !== 'neutral' && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-white/60 mb-1">Dominant Emotion</div>
          <div className="text-sm text-white capitalize">
            {signals.dominantEmotion}
          </div>
        </div>
      )}
    </div>
  );
}

// Named exports
export { CongruenceDisplay, SignalMeters, CompactDisplay };
