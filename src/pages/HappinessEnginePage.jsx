/**
 * HUMAN HAPPINESS ENGINE PAGE
 *
 * 8-pillar radial wheel with:
 * - Central Happiness core (breathing, size = score)
 * - 8 pillar circles (bouncing, size = strength, distance = weight)
 * - Sub-circles orbiting each pillar on click
 * - Summary panel with all pillars numerically
 * - Geometric mean computation with R multiplier
 *
 * Data sourced from BaZi + Western Astrology + user input.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import {
  DEFAULT_PILLARS,
  computeHappiness,
  computePillarScore,
  pillarRadius,
  pillarDistance,
  pillarPosition,
  PILLAR_COLORS
} from '../utils/happinessEngine';

// ── Constants ──
const WHEEL_SIZE = 460;
const CENTER = WHEEL_SIZE / 2;

// ── Source badge colors ──
const SOURCE_COLORS = {
  bazi: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'BaZi' },
  western: { bg: 'bg-indigo-500/20', text: 'text-indigo-300', label: 'Western' },
  tcm: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'TCM' },
  user: { bg: 'bg-amber-500/20', text: 'text-amber-300', label: 'User' },
  computed: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', label: 'Computed' },
};

// ============================================================================
// HAPPINESS WHEEL — SVG radial visualization
// ============================================================================

function HappinessWheel({ pillars, happinessScore, selectedPillar, onSelectPillar }) {
  const [tick, setTick] = useState(0);

  // Animation loop
  useEffect(() => {
    let frame;
    let t = 0;
    const animate = () => {
      t += 0.006;
      setTick(t);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Core radius breathes with happiness score
  const coreBaseR = 20 + 30 * (happinessScore / 100);
  const coreR = coreBaseR + 3 * Math.sin(tick * 0.4);
  const coreGlow = Math.max(0, happinessScore / 100);

  return (
    <svg
      viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
      className="w-full max-w-[460px] mx-auto"
      style={{ filter: 'drop-shadow(0 0 30px rgba(120, 80, 255, 0.15))' }}
    >
      {/* Background radial guide rings */}
      {[120, 160, 200].map(r => (
        <circle key={r} cx={CENTER} cy={CENTER} r={r}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.6} />
      ))}

      {/* Connection lines from core to each pillar */}
      {pillars.map((p, i) => {
        const dist = pillarDistance(p.weight);
        const bounce = 3 * Math.sin(tick * 0.5 + i * 0.8);
        const pos = pillarPosition(i, pillars.length, dist + bounce, CENTER, CENTER);
        return (
          <line key={`line-${p.id}`}
            x1={CENTER} y1={CENTER} x2={pos.x} y2={pos.y}
            stroke="#fbbf24" strokeWidth={1.2} opacity={0.45}
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Pillar circles */}
      {pillars.map((p, i) => {
        const dist = pillarDistance(p.weight);
        const bounce = 3 * Math.sin(tick * 0.5 + i * 0.8);
        const pos = pillarPosition(i, pillars.length, dist + bounce, CENTER, CENTER);
        const r = pillarRadius(p.score);
        const isSelected = selectedPillar?.id === p.id;
        const pulseR = r + (isSelected ? 2.5 * Math.sin(tick * 0.8) : 1.2 * Math.sin(tick * 0.6 + i));

        return (
          <g key={p.id}
            onClick={() => onSelectPillar(isSelected ? null : p)}
            style={{ cursor: 'pointer' }}
          >
            {/* Glow */}
            <circle cx={pos.x} cy={pos.y} r={pulseR + 8}
              fill="none" stroke={p.color} strokeWidth={isSelected ? 2.5 : 1}
              opacity={isSelected ? 0.6 : 0.25}
            />
            {/* Main circle */}
            <circle cx={pos.x} cy={pos.y} r={pulseR}
              fill={p.color} fillOpacity={0.2 + 0.2 * p.score}
              stroke={p.color} strokeWidth={isSelected ? 2.5 : 2}
              opacity={1}
            />
            {/* Icon */}
            <text x={pos.x} y={pos.y - 6} textAnchor="middle" fontSize={15}
              dominantBaseline="central" fill="white"
            >
              {p.icon}
            </text>
            {/* Label */}
            <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize={10}
              fill="white" opacity={1} fontWeight={isSelected ? 700 : 600}
            >
              {p.shortName}
            </text>
            {/* Score */}
            <text x={pos.x} y={pos.y + 21} textAnchor="middle" fontSize={9}
              fill={p.color} opacity={1} fontWeight={600} fontFamily="monospace"
            >
              {Math.round(p.score * 100)}%
            </text>

            {/* Sub-circles (shown when selected) */}
            {isSelected && p.subs.map((sub, si) => {
              const subAngle = -Math.PI / 2 + (2 * Math.PI * si) / p.subs.length;
              const subDist = pulseR + 22 + 4 * Math.sin(tick * 0.7 + si);
              const sx = pos.x + subDist * Math.cos(subAngle);
              const sy = pos.y + subDist * Math.sin(subAngle);
              const subR = 4 + 8 * sub.score;
              return (
                <g key={sub.id}>
                  <line x1={pos.x} y1={pos.y} x2={sx} y2={sy}
                    stroke={p.color} strokeWidth={0.8} opacity={0.5}
                  />
                  <circle cx={sx} cy={sy} r={subR}
                    fill={p.color} fillOpacity={0.3 + 0.25 * sub.score}
                    stroke={p.color} strokeWidth={1.2} opacity={0.9}
                  />
                  <text x={sx} y={sy + subR + 9} textAnchor="middle"
                    fontSize={7.5} fill="white" opacity={0.9}
                  >
                    {sub.name.length > 10 ? sub.name.slice(0, 10) + '…' : sub.name}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Central Happiness core */}
      <circle cx={CENTER} cy={CENTER} r={coreR + 14}
        fill="none" stroke={`rgba(184, 107, 255, ${0.25 + 0.2 * coreGlow})`}
        strokeWidth={2}
      />
      <circle cx={CENTER} cy={CENTER} r={coreR}
        fill={`rgba(120, 60, 220, ${0.35 + 0.35 * coreGlow})`}
        stroke="rgba(200, 140, 255, 0.9)" strokeWidth={2.5}
      />
      <text x={CENTER} y={CENTER - 8} textAnchor="middle" fontSize={22}
        fontWeight={700} fill="white" dominantBaseline="central"
      >
        {happinessScore}
      </text>
      <text x={CENTER} y={CENTER + 12} textAnchor="middle" fontSize={10}
        fill="rgba(220, 200, 255, 0.95)" fontWeight={600}
      >
        Happiness
      </text>
    </svg>
  );
}

// ============================================================================
// PILLAR DETAIL PANEL — Shows breakdown when a pillar is selected
// ============================================================================

function PillarDetailPanel({ pillar, onUpdateSub }) {
  if (!pillar) {
    return (
      <div className="text-center text-white/40 py-8">
        <p className="text-sm">Select a pillar to see details</p>
        <p className="text-xs mt-1">Click any circle on the wheel</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{pillar.icon}</span>
        <div>
          <h3 className="text-white font-semibold text-lg">{pillar.name}</h3>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: pillar.color }} className="font-mono font-bold">
              {Math.round(pillar.score * 100)}%
            </span>
            <span className="text-white/40">Weight: {pillar.weight.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pillar.score * 100}%`,
            background: `linear-gradient(90deg, ${pillar.color}66, ${pillar.color})`,
          }}
        />
      </div>

      {/* Sub-components */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Sub-Components</h4>
        {pillar.subs.map(sub => {
          const src = SOURCE_COLORS[sub.source] || SOURCE_COLORS.computed;
          return (
            <div key={sub.id} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/80">{sub.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${src.bg} ${src.text}`}>
                    {src.label}
                  </span>
                  <span className="text-xs font-mono" style={{ color: pillar.color }}>
                    {Math.round(sub.score * 100)}%
                  </span>
                </div>
              </div>
              {/* Slider */}
              <input
                type="range" min={0} max={100} value={Math.round(sub.score * 100)}
                onChange={e => onUpdateSub(pillar.id, sub.id, parseInt(e.target.value) / 100)}
                className="w-full h-1 appearance-none bg-white/10 rounded-full cursor-pointer"
                style={{
                  accentColor: pillar.color,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// SUMMARY TABLE — All pillars at a glance
// ============================================================================

function SummaryTable({ pillars, result }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="bg-white/5 text-white/50">
            <th className="px-3 py-2 text-left">Pillar</th>
            <th className="px-3 py-2 text-right">Score</th>
            <th className="px-3 py-2 text-right">Weight</th>
            <th className="px-3 py-2 text-right">Contrib</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((p, i) => {
            const contrib = result.pillarContributions[i]?.contribution ?? 0;
            const isWeakest = result.weakest.id === p.id;
            const isStrongest = result.strongest.id === p.id;
            return (
              <tr key={p.id} className="border-t border-white/5">
                <td className="px-3 py-1.5 text-white/80">
                  <span className="mr-1.5">{p.icon}</span>
                  {p.shortName}
                  {isWeakest && <span className="ml-1 text-red-400 text-[9px]">LOW</span>}
                  {isStrongest && <span className="ml-1 text-green-400 text-[9px]">TOP</span>}
                </td>
                <td className="px-3 py-1.5 text-right" style={{ color: p.color }}>
                  {Math.round(p.score * 100)}%
                </td>
                <td className="px-3 py-1.5 text-right text-white/60">
                  {p.weight.toFixed(2)}
                </td>
                <td className="px-3 py-1.5 text-right text-white/60">
                  {contrib.toFixed(4)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer with equation */}
      <div className="px-3 py-2 bg-white/[0.03] border-t border-white/5 text-[11px] text-white/70">
        H = <span className="text-purple-300 font-semibold">{result.base.toFixed(4)}</span>
        {' × (1 + 0.35 × R) = '}
        <span className="text-purple-300 font-semibold">{result.boosted.toFixed(4)}</span>
        {' → '}
        <span className="text-white font-bold">{result.score100}</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function HappinessEnginePage() {
  const { profiles, loading: profilesLoading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  const [pillars, setPillars] = useState(() => {
    // Initialize with demo scores
    return DEFAULT_PILLARS.map(p => ({
      ...p,
      subs: p.subs.map(s => ({
        ...s,
        score: 0.3 + Math.random() * 0.5, // random 30–80% for demo
      })),
    })).map(p => ({
      ...p,
      score: computePillarScore(p.subs),
    }));
  });

  const [selectedPillar, setSelectedPillar] = useState(null);

  // Selected profile
  const selectedProfile = useMemo(() => {
    return profiles?.find(p => p.id === selectedProfileId) || null;
  }, [profiles, selectedProfileId]);

  // Show floating bar when scrolled past 250px
  useEffect(() => {
    const onScroll = () => setShowFloatingBar(window.scrollY > 250);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Recompute happiness when pillars change
  const result = useMemo(() => computeHappiness(pillars), [pillars]);

  // Update a sub-component score
  const handleUpdateSub = useCallback((pillarId, subId, newScore) => {
    setPillars(prev => prev.map(p => {
      if (p.id !== pillarId) return p;
      const newSubs = p.subs.map(s => s.id === subId ? { ...s, score: newScore } : s);
      return { ...p, subs: newSubs, score: computePillarScore(newSubs) };
    }));

    // Also update selectedPillar reference
    setSelectedPillar(prev => {
      if (!prev || prev.id !== pillarId) return prev;
      const updated = pillars.find(p => p.id === pillarId);
      if (!updated) return prev;
      const newSubs = updated.subs.map(s => s.id === subId ? { ...s, score: newScore } : s);
      return { ...updated, subs: newSubs, score: computePillarScore(newSubs) };
    });
  }, [pillars]);

  // Keep selectedPillar in sync with pillars state
  const activePillar = selectedPillar
    ? pillars.find(p => p.id === selectedPillar.id) || null
    : null;

  // Profile display name helper
  const profileDisplayName = selectedProfile
    ? `${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`.trim() || 'Selected'
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* ── Floating profile bar — appears when scrolled down ── */}
      {showFloatingBar && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-white/15 shadow-xl backdrop-blur-sm px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-[11px] font-mono">
            {/* Profile selector (compact) */}
            <select
              value={selectedProfileId || ''}
              onChange={(e) => setSelectedProfileId(e.target.value || null)}
              className="bg-slate-800 border border-white/15 rounded px-2 py-1 text-xs text-white shrink-0"
            >
              <option value="">Profile...</option>
              {profiles?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>

            {/* Profile info */}
            {selectedProfile && (
              <div className="flex items-center gap-2 text-gray-400 overflow-hidden min-w-0">
                <span className="text-gray-500">|</span>
                <span className="text-gray-300 shrink-0">
                  {selectedProfile.birthDate || ''}
                </span>
                {selectedProfile.birthTime && (
                  <span className="text-gray-200 shrink-0">{selectedProfile.birthTime}</span>
                )}
                {selectedProfile.location?.fullAddress && (
                  <span className="text-gray-300 truncate">{selectedProfile.location.fullAddress}</span>
                )}
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Happiness score (compact) */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-purple-400 font-bold text-sm">{result.score100}</span>
              <span className="text-purple-400/50 text-[9px]">Happiness</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-white/40 hover:text-white/70 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Human Happiness Engine</h1>
              <p className="text-xs text-white/60">8-Pillar Blueprint for Human Flourishing</p>
            </div>
          </div>

          {/* Happiness score card */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-5 py-2.5 text-right">
            <div className="text-2xl font-bold text-purple-300">{result.score100}</div>
            <div className="text-[10px] text-purple-400/70">Happiness Score</div>
            <div className="text-[9px] text-white/60 font-mono">
              base: {(result.base * 100).toFixed(1)} | R-boost: ×{(1 + 0.35 * (pillars.find(p => p.id === 'R')?.score || 0)).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile Selector Bar ── */}
      <div className="border-b border-white/5 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <select
            value={selectedProfileId || ''}
            onChange={(e) => setSelectedProfileId(e.target.value || null)}
            className="bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="">Select profile...</option>
            {profiles?.map(p => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>

          {selectedProfile && (
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {selectedProfile.birthDate && (
                <span className="text-gray-300">{selectedProfile.birthDate}</span>
              )}
              {selectedProfile.birthTime && (
                <span className="text-gray-200">{selectedProfile.birthTime}</span>
              )}
              {selectedProfile.location?.city && (
                <span className="text-gray-300">{selectedProfile.location.city}, {selectedProfile.location.country}</span>
              )}
            </div>
          )}

          {!selectedProfile && !profilesLoading && (
            <span className="text-xs text-white/50">Select a profile to compute happiness from BaZi + Western data</span>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Wheel */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white/60">Happiness Constellation</h2>
                <div className="flex items-center gap-2 text-[9px] text-white/60">
                  <span>Size = strength</span>
                  <span className="text-white/30">|</span>
                  <span>Distance = weight</span>
                  <span className="text-white/30">|</span>
                  <span>Click to expand</span>
                </div>
              </div>

              <HappinessWheel
                pillars={pillars}
                happinessScore={result.score100}
                selectedPillar={activePillar}
                onSelectPillar={setSelectedPillar}
              />

              {/* Equation display */}
              <div className="mt-3 text-center text-[11px] text-white/70 font-mono">
                H = (L<sup>0.15</sup> Q<sup>0.15</sup> C<sup>0.15</sup> N<sup>0.15</sup> E<sup>0.10</sup> M<sup>0.15</sup> P<sup>0.10</sup> R<sup>0.15</sup>) × (1 + 0.35R)
              </div>
            </div>

            {/* Summary table */}
            <div className="mt-4 bg-slate-900/50 rounded-2xl border border-white/5 p-4">
              <h2 className="text-sm font-semibold text-white/60 mb-3">All Pillars Summary</h2>
              <SummaryTable pillars={pillars} result={result} />

              {/* Insight */}
              <div className="mt-3 text-xs text-white/70 space-y-1">
                <p>
                  <span className="text-red-400">{result.weakest.icon} {result.weakest.name}</span> is your weakest pillar at{' '}
                  <span className="text-red-300 font-mono">{Math.round(result.weakest.score * 100)}%</span>.
                  {' '}Raising it would have the largest impact on your overall happiness.
                </p>
                <p className="text-[10px] text-white/50">
                  The multiplicative model means a single weak pillar drags everything down —
                  like a tide that must lift all boats.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Detail panel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 sticky top-4">
              <h2 className="text-sm font-semibold text-white/60 mb-3">Pillar Details</h2>
              <PillarDetailPanel
                pillar={activePillar}
                onUpdateSub={handleUpdateSub}
              />
            </div>

            {/* Data sources legend */}
            <div className="mt-4 bg-slate-900/50 rounded-2xl border border-white/5 p-4">
              <h2 className="text-sm font-semibold text-white/60 mb-3">Data Sources</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SOURCE_COLORS).map(([key, src]) => (
                  <span key={key} className={`text-[10px] px-2 py-1 rounded ${src.bg} ${src.text}`}>
                    {src.label}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-white/50 mt-2">
                Each sub-component is sourced from BaZi, Western Astrology, TCM, user input, or computed from other values.
                Adjust sliders to explore how changes affect your Happiness Score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
