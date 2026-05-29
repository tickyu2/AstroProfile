/**
 * DestinyPulse — Day Master heartbeat visualization
 *
 * Multi-layer seasonal fog, element color-shift pulsing, severity-driven amplitude,
 * resonance paths from clicked pillars, storm lightning at high tension,
 * audio heartbeat toggle, seasonal modulation.
 *
 * This is the living heart of the Identity Architecture.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ELEMENT_COLORS } from '../../utils/elementTheme';
import {
  getDayMasterElement,
  destinyBeatFromElement,
  destinyAmplitudeFromSeverity,
  hueFromElement,
  stormIndex,
  pillarAngle,
} from '../../engine/destinyPulse';
import { getCurrentSeason, modulationFromSeason, fogColorForSeason } from '../../engine/seasonalModulation';
import { useHeartbeatAudio } from '../../hooks/useHeartbeatAudio';
import { usePulseResonance } from '../../hooks/usePulseResonance';
import type { BaZiPillar } from '../../engine/identityTypes';

interface Props {
  pillars: BaZiPillar[];
  severity: number;            // 0-1 from tensionSeverity
  selectedPillar: string | null;
}

interface LightningBolt {
  id: number;
  x1: number; y1: number;
  x2: number; y2: number;
  opacity: number;
  width: number;
}

const SEASON_ICONS: Record<string, string> = {
  spring: '\u{1F331}', summer: '\u2600\uFE0F', autumn: '\u{1F342}', winter: '\u2744\uFE0F',
};

export const DestinyPulse: React.FC<Props> = ({ pillars, severity, selectedPillar }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [bolts, setBolts] = useState<LightningBolt[]>([]);
  const boltIdRef = useRef(0);

  const dayMaster = getDayMasterElement(pillars);
  const season = getCurrentSeason();
  const mod = modulationFromSeason(season);
  const fogColors = fogColorForSeason(season);
  const resonance = usePulseResonance(selectedPillar);
  const storm = stormIndex(severity);

  // Computed pulse parameters
  const baseBpm = destinyBeatFromElement(dayMaster);
  const bpm = baseBpm * mod.speedMultiplier;
  const duration = 60000 / bpm;
  const baseAmplitude = destinyAmplitudeFromSeverity(severity);
  const amplitude = baseAmplitude * mod.amplitudeMultiplier + resonance * 0.4;
  const baseHue = hueFromElement(dayMaster) + mod.hueShift;
  const color = ELEMENT_COLORS[dayMaster] || '#38bdf8';
  const bpmDisplay = Math.round(bpm);

  // Audio heartbeat
  useHeartbeatAudio(bpm, severity, audioEnabled);

  // Storm lightning generator
  useEffect(() => {
    if (storm <= 0) {
      setBolts([]);
      return;
    }
    // Spawn lightning bolts at random intervals (faster when storm is higher)
    const interval = setInterval(() => {
      const cx = 100, cy = 100;
      const angle = Math.random() * Math.PI * 2;
      const r1 = 30 + Math.random() * 25;
      const r2 = 55 + Math.random() * 30;
      const newBolt: LightningBolt = {
        id: boltIdRef.current++,
        x1: cx + r1 * Math.cos(angle),
        y1: cy + r1 * Math.sin(angle),
        x2: cx + r2 * Math.cos(angle + (Math.random() - 0.5) * 0.8),
        y2: cy + r2 * Math.sin(angle + (Math.random() - 0.5) * 0.8),
        opacity: 0.5 + storm * 0.5,
        width: 1 + storm * 2,
      };
      setBolts(prev => [...prev.slice(-4), newBolt]); // keep max 5 bolts
    }, 400 - storm * 250); // 400ms (mild) → 150ms (intense)

    return () => clearInterval(interval);
  }, [storm]);

  // Auto-fade bolts after 300ms
  useEffect(() => {
    if (bolts.length === 0) return;
    const timeout = setTimeout(() => {
      setBolts(prev => prev.slice(1));
    }, 300);
    return () => clearTimeout(timeout);
  }, [bolts]);

  // Resonance path: line from center to selected pillar's angular position
  const resonancePath = useMemo(() => {
    if (!selectedPillar) return null;
    const angle = pillarAngle(selectedPillar);
    const rad = (angle - 90) * (Math.PI / 180);
    const pathR = 75;
    const x2 = 100 + pathR * Math.cos(rad);
    const y2 = 100 + pathR * Math.sin(rad);
    return { x2, y2, label: selectedPillar[0] };
  }, [selectedPillar]);

  const cssVars = useMemo(() => ({
    '--pulse-scale': amplitude,
    '--base-hue': baseHue,
    '--pulse-duration': `${duration}ms`,
  } as React.CSSProperties), [amplitude, baseHue, duration]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* SVG Pulse with seasonal fog, resonance paths, storm lightning */}
      <svg viewBox="0 0 200 200" style={{ width: 220, height: 220 }}>
        {/* Outer fog — seasonal color, wide, diffuse */}
        <circle
          cx={100} cy={100} r={70}
          className="fog-outer"
          style={{
            fill: fogColors.outer,
            opacity: 0.18 + resonance * 0.15 + storm * 0.1,
            ...cssVars,
          }}
        />

        {/* Inner fog — seasonal color, tight, warm */}
        <circle
          cx={100} cy={100} r={50}
          className="fog-inner"
          style={{
            fill: fogColors.inner,
            opacity: 0.25 + resonance * 0.2 + storm * 0.08,
            ...cssVars,
          }}
        />

        {/* Resonance path — glowing arc from center to selected pillar */}
        {resonancePath && (
          <>
            <line
              x1={100} y1={100}
              x2={resonancePath.x2} y2={resonancePath.y2}
              className="resonance-path"
              stroke={color}
              strokeWidth={2 + resonance * 2.5}
              strokeOpacity={0.3 + resonance * 0.5}
              strokeDasharray="4 3"
            />
            {/* Pillar endpoint glow */}
            <circle
              cx={resonancePath.x2} cy={resonancePath.y2} r={6 + resonance * 3}
              fill={color}
              opacity={0.2 + resonance * 0.4}
              className="resonance-endpoint"
            />
            <text
              x={resonancePath.x2} y={resonancePath.y2 + 3}
              textAnchor="middle"
              fontSize={7}
              fontWeight={700}
              fill={color}
              opacity={0.7}
            >
              {resonancePath.label}
            </text>
          </>
        )}

        {/* Storm lightning bolts */}
        {bolts.map(b => (
          <line
            key={b.id}
            x1={b.x1} y1={b.y1}
            x2={b.x2} y2={b.y2}
            className="lightning-bolt"
            stroke="#fff"
            strokeWidth={b.width}
            strokeOpacity={b.opacity}
            strokeLinecap="round"
          />
        ))}

        {/* Color-shift layer */}
        <circle
          cx={100} cy={100} r={42}
          className="color-shift-pulse"
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.3}
          style={cssVars}
        />

        {/* Main pulse ring */}
        <circle
          cx={100} cy={100} r={38}
          className="destiny-pulse-ring"
          fill="none"
          stroke={color}
          strokeWidth={3 + severity * 2}
          style={{
            animation: `destinyPulse ${duration}ms ease-in-out infinite`,
            transformOrigin: 'center',
            ...cssVars,
          }}
        />

        {/* Inner glow disc */}
        <circle
          cx={100} cy={100} r={28}
          fill={`hsl(${baseHue}, 50%, 20%)`}
          opacity={0.4 + severity * 0.3 + resonance * 0.2}
        />

        {/* Storm aura — red glow when storming */}
        {storm > 0 && (
          <circle
            cx={100} cy={100} r={55}
            fill="none"
            stroke="#ef4444"
            strokeWidth={1 + storm * 2}
            strokeOpacity={storm * 0.3}
            className="storm-aura"
            style={{ animation: `destinyPulse ${duration * 0.5}ms ease-in-out infinite` }}
          />
        )}

        {/* Day Master label */}
        <text
          x={100} y={94}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={color}
          letterSpacing="0.05em"
        >
          {dayMaster}
        </text>
        <text
          x={100} y={108}
          textAnchor="middle"
          fontSize={8}
          fill="#94a3b8"
        >
          Day Master
        </text>
        <text
          x={100} y={125}
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          fill="#64748b"
        >
          {bpmDisplay} bpm
        </text>

        {/* Storm indicator */}
        {storm > 0 && (
          <text
            x={100} y={140}
            textAnchor="middle"
            fontSize={8}
            fontWeight={600}
            fill="#f87171"
            opacity={0.6 + storm * 0.4}
          >
            {'⚡'} Storm Active
          </text>
        )}
      </svg>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className={`audio-toggle${audioEnabled ? ' active' : ''}`}
          onClick={() => setAudioEnabled(!audioEnabled)}
        >
          {audioEnabled ? '\u{1F50A} Mute' : '\u{1F508} Heartbeat'}
        </button>
        <span className="seasonal-badge">
          {SEASON_ICONS[season] || ''} {mod.label}
          {mod.speedMultiplier !== 1 && (
            <span style={{ opacity: 0.7 }}>
              {mod.speedMultiplier > 1 ? ' +tempo' : ' -tempo'}
            </span>
          )}
        </span>
        {storm > 0 && (
          <span className="seasonal-badge" style={{
            background: 'rgba(239,68,68,0.15)',
            color: '#fca5a5',
            borderColor: 'rgba(239,68,68,0.3)',
          }}>
            {'⚡'} Storm {Math.round(storm * 100)}%
          </span>
        )}
      </div>

      {/* Severity bar */}
      <div style={{ width: '100%', maxWidth: 200 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '9px', color: '#475569', marginBottom: '2px',
        }}>
          <span>Calm</span>
          <span>Tension: {Math.round(severity * 100)}%</span>
          <span>Intense</span>
        </div>
        <div style={{
          height: 4, borderRadius: 2,
          background: 'rgba(51,65,85,0.4)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${severity * 100}%`,
            borderRadius: 2,
            background: `linear-gradient(90deg, #22c55e, #eab308, #ef4444)`,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    </div>
  );
};
