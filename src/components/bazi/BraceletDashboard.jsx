/**
 * BraceletDashboard — Full bracelet analysis panel with preview,
 * quality score, comparison, goal recommendations, and stone effectiveness.
 *
 * Designed to be embedded inside QiBraceletPage's monthly expanded view.
 * Positioned at TOP of month card for full width.
 */

import React, { useState, useMemo } from 'react';
import {
  designBracelet,
  scoreBracelet,
  scoreAllStones,
  compareBracelets,
  findSubstitutes,
  recommendBraceletForGoal,
  simulateRadarShift,
  GOAL_DESCRIPTIONS,
  GENERATES,
} from '../../data/stoneDatabase';
import EngineeredBraceletVisualizer, { CollapseDiagnosisPanel } from '../qi/EngineeredBraceletVisualizer';

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const GOALS = [
  { key: 'stability', label: 'Stability' },
  { key: 'creativity', label: 'Creativity' },
  { key: 'wealth', label: 'Wealth' },
  { key: 'protection', label: 'Protection' },
  { key: 'clarity', label: 'Clarity' },
  { key: 'emotionalHealing', label: 'Emotional Healing' },
  { key: 'careerGrowth', label: 'Career Growth' },
  { key: 'health', label: 'Health' },
];

const GRADE_COLORS = {
  S: 'text-yellow-300 bg-yellow-900/40 border-yellow-500/50',
  A: 'text-green-300 bg-green-900/40 border-green-500/50',
  B: 'text-blue-300 bg-blue-900/40 border-blue-500/50',
  C: 'text-orange-300 bg-orange-900/40 border-orange-500/50',
  D: 'text-red-300 bg-red-900/40 border-red-500/50',
  F: 'text-red-500 bg-red-900/60 border-red-500/70',
};

// ============================================================================
// BRACELET PREVIEW — Circular bead ring (SVG)
// ============================================================================

function BraceletPreview({ visualBeads, size = 280 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 24;
  const beadScale = size > 240 ? 0.85 : 0.7;

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Wrist circle */}
      <circle cx={cx} cy={cy} r={radius - 10} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      {visualBeads.map((bead, i) => {
        const angle = (bead.angleDeg - 90) * (Math.PI / 180);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const r = bead.sizeMm * beadScale;

        return (
          <g key={bead.id}>
            <circle
              cx={x} cy={y} r={r}
              fill={bead.color}
              stroke={bead.polarity === 'Yang' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}
              strokeWidth={1.2}
            />
            {/* Sheng arrow to next bead */}
            {i < visualBeads.length - 1 && GENERATES[bead.element] === visualBeads[i + 1]?.element && (
              <line
                x1={x} y1={y}
                x2={cx + radius * Math.cos(((visualBeads[i + 1].angleDeg - 90) * Math.PI) / 180)}
                y2={cy + radius * Math.sin(((visualBeads[i + 1].angleDeg - 90) * Math.PI) / 180)}
                stroke="rgba(34,197,94,0.15)" strokeWidth={0.5}
              />
            )}
            <title>{`${bead.stone.name} (${bead.element}, ${bead.polarity})`}</title>
          </g>
        );
      })}
      {/* Center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={12}>
        {visualBeads.length} beads
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9}>
        Sheng cycle
      </text>
    </svg>
  );
}

// ============================================================================
// QUALITY SCORE CARD
// ============================================================================

function QualityScoreCard({ quality }) {
  const { overall, grade, breakdown, warnings, strengths } = quality;
  const gradeStyle = GRADE_COLORS[grade] || GRADE_COLORS.C;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${gradeStyle}`}>
          {grade}
        </span>
        <div>
          <div className="text-sm font-semibold text-white/80">{overall}/100</div>
          <div className="text-[10px] text-white/40">Quality Score</div>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-2 text-xs">
        {[
          { label: 'Yong Shen', value: breakdown.yongShenAlignment, max: 30 },
          { label: 'Polarity', value: breakdown.polarityBalance, max: 20 },
          { label: 'Sheng Flow', value: breakdown.shengCycleFlow, max: 20 },
          { label: 'Forbidden', value: breakdown.forbiddenCheck, max: 15 },
          { label: 'Diversity', value: breakdown.diversityScore, max: 15 },
        ].map(({ label, value, max }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-16 text-white/50 shrink-0">{label}</span>
            <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
            <span className="text-white/40 w-10 text-right font-mono">{value}/{max}</span>
          </div>
        ))}
      </div>

      {/* Strengths / Warnings */}
      {strengths.length > 0 && (
        <div className="space-y-0.5">
          {strengths.map((s, i) => (
            <p key={i} className="text-xs text-green-400/80">+ {s}</p>
          ))}
        </div>
      )}
      {warnings.length > 0 && (
        <div className="space-y-0.5">
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-400/80">! {w}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ELEMENT RATIO BAR
// ============================================================================

function ElementRatioBar({ ratios }) {
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const total = els.reduce((s, el) => s + (ratios[el] || 0), 0) || 1;

  return (
    <div className="space-y-1.5">
      <div className="flex h-4 rounded-full overflow-hidden bg-white/5">
        {els.map(el => {
          const pct = ((ratios[el] || 0) / total) * 100;
          if (pct < 1) return null;
          return (
            <div
              key={el}
              style={{ width: `${pct}%`, backgroundColor: ELEM_COLORS[el] }}
              className="h-full transition-all duration-300"
              title={`${el}: ${pct.toFixed(0)}%`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-white/50 font-mono">
        {els.map(el => (
          <span key={el} style={{ color: ELEM_COLORS[el] }}>
            {el[0]} {((ratios[el] || 0) * 100).toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// STONE LIST
// ============================================================================

function StoneList({ bracelet, stoneScores, yongShen, dayMasterStem, onSubstitute }) {
  const uniqueStones = [];
  const seen = new Set();
  for (const bead of bracelet.sequence) {
    if (!seen.has(bead.stone.name)) {
      seen.add(bead.stone.name);
      uniqueStones.push(bead.stone);
    }
  }

  return (
    <div className="space-y-1.5">
      {uniqueStones.map(stone => {
        const score = stoneScores?.find(s => s.stone.name === stone.name);
        const count = bracelet.sequence.filter(b => b.stone.name === stone.name).length;
        const gradeStyle = score ? (GRADE_COLORS[score.grade] || '') : '';

        return (
          <div key={stone.name} className="bg-white/5 rounded-lg px-3 py-2 space-y-1">
            {/* Row 1: color dot + full name + swap button */}
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                style={{ backgroundColor: stone.color }}
              />
              <p className="text-xs text-white/80 flex-1">
                {stone.name} {stone.chineseName ? `(${stone.chineseName})` : ''}
              </p>
              {onSubstitute && (
                <button
                  onClick={() => onSubstitute(stone)}
                  className="text-[10px] text-teal-400/60 hover:text-teal-300 transition-colors shrink-0"
                  title="Find substitutes"
                >
                  swap
                </button>
              )}
            </div>
            {/* Row 2: element, polarity, count, grade, effectiveness % */}
            <div className="flex items-center gap-2 pl-6 text-[10px]">
              <span className="text-white/40">{stone.element} {stone.polarity}</span>
              <span className="text-white/30">x{count}</span>
              {score && (
                <>
                  <span className={`px-1.5 py-0.5 rounded border ${gradeStyle}`}>
                    {score.grade}
                  </span>
                  <span className="text-white/50 font-mono">{score.totalScore}%</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// COMPARISON PANEL
// ============================================================================

function ComparisonPanel({ comparison }) {
  if (!comparison) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-white/60">
        {comparison.from} vs {comparison.to}
      </h4>
      <div className="grid grid-cols-5 gap-2">
        {els.map(el => {
          const d = comparison.ratioDiff[el];
          const color = d > 0.05 ? 'text-green-400' : d < -0.05 ? 'text-red-400' : 'text-white/30';
          return (
            <div key={el} className="text-center bg-white/5 rounded-lg p-2">
              <div className="text-[10px] text-white/40">{el[0]}</div>
              <div className={`text-xs font-mono font-semibold ${color}`}>
                {d > 0 ? '+' : ''}{(d * 100).toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
      {comparison.addedStones.length > 0 && (
        <p className="text-[10px] text-green-400/70">+ {comparison.addedStones.join(', ')}</p>
      )}
      {comparison.removedStones.length > 0 && (
        <p className="text-[10px] text-red-400/70">- {comparison.removedStones.join(', ')}</p>
      )}
      <p className="text-[10px] text-white/40">{comparison.collapseShift}</p>
      {comparison.qualityDiff !== 0 && (
        <p className={`text-[10px] ${comparison.qualityDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
          Quality: {comparison.qualityDiff > 0 ? '+' : ''}{comparison.qualityDiff} pts
        </p>
      )}
    </div>
  );
}

// ============================================================================
// SUBSTITUTION PANEL
// ============================================================================

function SubstitutionPanel({ stone, substitutes, onClose }) {
  if (!stone || !substitutes) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/80">
          Substitutes for <span className="text-teal-300">{stone.name}</span>
        </h4>
        <button onClick={onClose} className="text-white/40 hover:text-white text-sm">x</button>
      </div>
      <div className="space-y-1.5">
        {substitutes.map((sub, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
            <div
              className="w-4 h-4 rounded-full shrink-0 border border-white/20"
              style={{ backgroundColor: sub.replacement.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80">{sub.replacement.name}</p>
              <p className="text-[10px] text-white/40">{sub.reason}</p>
            </div>
            <span className={`text-[10px] font-mono ${sub.qualityRetention >= 80 ? 'text-green-400' : sub.qualityRetention >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {sub.qualityRetention}%
            </span>
            {sub.isBudget && (
              <span className="text-[10px] text-amber-400/60 border border-amber-500/20 rounded px-1">$</span>
            )}
          </div>
        ))}
        {substitutes.length === 0 && (
          <p className="text-xs text-white/40">No substitutes found.</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// GOAL RECOMMENDATION PANEL
// ============================================================================

function GoalPanel({ monthBracelets, selectedGoal, onGoalChange }) {
  const recommendations = useMemo(() => {
    if (!selectedGoal || !monthBracelets || monthBracelets.length === 0) return [];
    return recommendBraceletForGoal(monthBracelets, selectedGoal).slice(0, 3);
  }, [monthBracelets, selectedGoal]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-xs font-semibold text-white/60">Goal Recommendation</h4>
        <select
          value={selectedGoal || ''}
          onChange={(e) => onGoalChange(e.target.value || null)}
          className="bg-slate-700 border border-white/10 rounded text-[11px] text-white/70 px-2 py-1"
        >
          <option value="">Select goal...</option>
          {GOALS.map(g => (
            <option key={g.key} value={g.key}>{g.label}</option>
          ))}
        </select>
      </div>

      {selectedGoal && GOAL_DESCRIPTIONS[selectedGoal] && (
        <p className="text-[10px] text-white/40 italic">{GOAL_DESCRIPTIONS[selectedGoal]}</p>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-1.5">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
              <span className="text-[10px] text-white/30 w-4">{i + 1}.</span>
              <span className="text-xs text-white/70 flex-1">{rec.monthLabel}</span>
              <span className="text-[10px] text-teal-400 font-mono">{rec.goalAlignment}%</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${GRADE_COLORS[rec.quality.grade] || ''}`}>
                {rec.quality.grade}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// RADAR SHIFT PANEL — Shows bracelet influence on the Five-Element radar
// ============================================================================

function RadarShiftPanel({ radarShift }) {
  if (!radarShift) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const { tfq, mffq, afterBracelet, delta, totalShiftPct, monthType } = radarShift;

  const monthLabel = monthType === 'drained' ? 'Drained (+25% leverage)'
    : monthType === 'overcrowded' ? 'Overcrowded (-25% leverage)'
    : 'Normal';

  return (
    <div className="bg-white/5 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Bracelet Qi Influence</h4>
        <span className="text-[10px] text-white/30 font-mono">{monthLabel}</span>
      </div>

      {/* Per-element shift bars */}
      <div className="space-y-2">
        {els.map(el => {
          const tfqVal = tfq[el] || 0;
          const mffqVal = mffq[el] || 0;
          const afterVal = afterBracelet[el] || 0;
          const d = delta[el] || 0;
          const maxVal = Math.max(tfqVal, mffqVal, afterVal, 1);
          const color = ELEM_COLORS[el];

          return (
            <div key={el} className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color }}>{el}</span>
                <span className={`font-mono font-semibold ${d > 0.1 ? 'text-green-400' : d < -0.1 ? 'text-red-400' : 'text-white/30'}`}>
                  {d > 0 ? '+' : ''}{d.toFixed(2)}
                </span>
              </div>
              {/* Three stacked bars: TFQ (faint), MFFQ (medium), After (bright) */}
              <div className="relative h-4 bg-white/5 rounded overflow-hidden">
                {/* TFQ baseline */}
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(tfqVal / maxVal) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.15,
                }} />
                {/* MFFQ */}
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(mffqVal / maxVal) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.35,
                }} />
                {/* After bracelet */}
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(afterVal / maxVal) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.85,
                }} />
                {/* Values */}
                <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[9px] font-mono text-white/70">
                  <span>{mffqVal.toFixed(1)}</span>
                  <span className="text-white/90">{afterVal.toFixed(1)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend + total shift */}
      <div className="flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-white/15 rounded" />
            <span className="text-white/30">Natal TFQ</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-white/35 rounded" />
            <span className="text-white/40">MFFQ</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-teal-400/80 rounded" />
            <span className="text-white/50">+ Bracelet</span>
          </div>
        </div>
        <span className="text-teal-400/70 font-mono">Total shift: {totalShiftPct.toFixed(1)}</span>
      </div>
    </div>
  );
}

// ============================================================================
// COLLAPSE MODE VISUALIZER — Why the system flags a structural collapse
// ============================================================================

function CollapseModePanel({ dynamicPool, yongShen }) {
  if (!dynamicPool || !yongShen) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const total = els.reduce((s, el) => s + (dynamicPool[el] || 0), 0) || 1;
  const sorted = els
    .map(el => ({ el, val: dynamicPool[el] || 0, pct: ((dynamicPool[el] || 0) / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const dominant = sorted[0];
  const second = sorted[1];
  const ratio = second.pct > 0 ? (dominant.pct / second.pct).toFixed(1) : '---';
  const isCollapse = yongShen.status === 'collapse_override';
  const mode = yongShen.collapseMode || 'none';

  const modeLabels = {
    'single-dominant': 'Single-Dominant',
    'bi-polar': 'Bi-Polar Bridge',
    'drained': 'Drained Element',
    'inverted': 'Inverted Structure',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Structure Analysis</h4>
        {isCollapse && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300">
            {modeLabels[mode] || mode}
          </span>
        )}
      </div>

      {/* Element bars */}
      <div className="space-y-1">
        {sorted.map(({ el, pct }) => (
          <div key={el} className="flex items-center gap-2">
            <span className="text-[10px] w-10 text-right" style={{ color: ELEM_COLORS[el] }}>{el}</span>
            <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
              <div className="h-full rounded" style={{
                width: `${pct}%`,
                backgroundColor: ELEM_COLORS[el],
                opacity: el === dominant.el && isCollapse ? 0.9 : 0.5,
              }} />
            </div>
            <span className="text-[10px] text-white/40 font-mono w-10">{pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Explanation */}
      {isCollapse && (
        <div className="text-[10px] text-white/40 bg-white/5 rounded-lg p-2 space-y-1">
          <p><span className="text-purple-300 font-semibold">{dominant.el}</span> = {dominant.pct.toFixed(1)}%, next = {second.el} {second.pct.toFixed(1)}% (ratio {ratio}x)</p>
          {mode === 'single-dominant' && (
            <p>Follow-structure: support {dominant.el}, exhaust via its child. Never control with {yongShen.forbidden?.[0] || 'the controlling element'}.</p>
          )}
          {mode === 'drained' && (
            <p>One element has nearly vanished. The bracelet feeds it through its mother element.</p>
          )}
          {mode === 'bi-polar' && (
            <p>Two elements dominate equally. The bracelet bridges them with a mediating element.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// YONG SHEN STABILITY HEATMAP — 12-month element stability overview
// ============================================================================

function StabilityHeatmap({ allMonthBracelets, userTfq }) {
  if (!allMonthBracelets || allMonthBracelets.length === 0 || !userTfq) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // For each month, compute stability per element (how close MFFQ is to TFQ)
  const months = allMonthBracelets.filter(m => m.mffq).map(m => {
    const total = els.reduce((s, el) => s + (m.mffq[el] || 0), 0) || 1;
    const tfqTotal = els.reduce((s, el) => s + (userTfq[el] || 0), 0) || 1;
    const cells = {};
    for (const el of els) {
      const mffqPct = ((m.mffq[el] || 0) / total) * 100;
      const tfqPct = ((userTfq[el] || 0) / tfqTotal) * 100;
      const drift = mffqPct - tfqPct; // positive = element grew, negative = element shrank
      cells[el] = drift;
    }
    return { label: m.label, cells, yongShen: m.yongShen };
  });

  if (months.length === 0) return null;

  const driftColor = (d) => {
    if (d > 8) return 'bg-red-500/60';
    if (d > 3) return 'bg-amber-500/40';
    if (d < -8) return 'bg-blue-500/60';
    if (d < -3) return 'bg-blue-500/30';
    return 'bg-green-500/25';
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-white/60">Monthly Element Drift from Natal</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-[9px] font-mono">
          <thead>
            <tr>
              <th className="text-left text-white/30 px-1 pb-1">Month</th>
              {els.map(el => (
                <th key={el} className="text-center px-1 pb-1" style={{ color: ELEM_COLORS[el] }}>{el[0]}</th>
              ))}
              <th className="text-center text-white/30 px-1 pb-1">Mode</th>
            </tr>
          </thead>
          <tbody>
            {months.map(m => (
              <tr key={m.label}>
                <td className="text-white/40 px-1 py-0.5 whitespace-nowrap">{m.label?.slice(0, 3)}</td>
                {els.map(el => (
                  <td key={el} className="text-center px-0.5 py-0.5">
                    <span className={`inline-block w-full rounded px-1 py-0.5 text-white/70 ${driftColor(m.cells[el])}`}>
                      {m.cells[el] > 0 ? '+' : ''}{m.cells[el].toFixed(0)}
                    </span>
                  </td>
                ))}
                <td className="text-center text-white/30 px-1 py-0.5 whitespace-nowrap">
                  {m.yongShen?.collapseMode?.slice(0, 5) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-3 text-[9px] text-white/30">
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-green-500/25" /> Stable</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-amber-500/40" /> Excess</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-500/60" /> Surge</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-blue-500/30" /> Deficit</span>
      </div>
    </div>
  );
}

// ============================================================================
// YONG SHEN PRESSURE CHART — Dominant element % over the year
// ============================================================================

function PressureChart({ allMonthBracelets, userTfq }) {
  if (!allMonthBracelets || allMonthBracelets.length === 0 || !userTfq) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const tfqTotal = els.reduce((s, el) => s + (userTfq[el] || 0), 0) || 1;

  // Find the dominant natal element
  const tfqPcts = els.map(el => ({ el, pct: ((userTfq[el] || 0) / tfqTotal) * 100 }));
  const dominant = tfqPcts.sort((a, b) => b.pct - a.pct)[0];

  const months = allMonthBracelets.filter(m => m.mffq).map(m => {
    const total = els.reduce((s, el) => s + (m.mffq[el] || 0), 0) || 1;
    return {
      label: m.label?.slice(0, 3) || '?',
      pct: ((m.mffq[dominant.el] || 0) / total) * 100,
    };
  });

  if (months.length === 0) return null;
  const maxPct = Math.max(...months.map(m => m.pct), dominant.pct, 1);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-white/60">
        <span style={{ color: ELEM_COLORS[dominant.el] }}>{dominant.el}</span> Pressure Over Year
      </h4>
      <div className="flex items-end gap-1 h-20">
        {months.map((m, i) => {
          const h = (m.pct / maxPct) * 100;
          const isHigh = m.pct > dominant.pct + 10;
          const isLow = m.pct < dominant.pct - 10;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-t relative" style={{
                height: `${h}%`,
                backgroundColor: ELEM_COLORS[dominant.el],
                opacity: isHigh ? 0.9 : isLow ? 0.25 : 0.5,
              }}>
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/50">
                  {m.pct.toFixed(0)}
                </span>
              </div>
              <span className="text-[8px] text-white/30">{m.label}</span>
            </div>
          );
        })}
      </div>
      {/* Natal baseline line */}
      <div className="flex items-center gap-2 text-[9px]">
        <div className="w-6 h-0.5 border-t border-dashed" style={{ borderColor: ELEM_COLORS[dominant.el] }} />
        <span className="text-white/30">Natal {dominant.el}: {dominant.pct.toFixed(1)}%</span>
      </div>
    </div>
  );
}

// ============================================================================
// WHY THIS REMEDY PANEL — Explains why the bracelet uses these elements
// ============================================================================

function WhyThisRemedyPanel({ yongShen, dynamicPool, userTfq, bracelet }) {
  if (!yongShen || !dynamicPool || !bracelet) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const useful = yongShen.usefulElements || [];
  const forbidden = yongShen.forbidden || [];
  const isCollapse = yongShen.status === 'collapse_override';
  const mode = yongShen.collapseMode;

  // Find dominant element in MFFQ
  const total = els.reduce((s, el) => s + (dynamicPool[el] || 0), 0) || 1;
  const sorted = els.map(el => ({ el, pct: ((dynamicPool[el] || 0) / total) * 100 })).sort((a, b) => b.pct - a.pct);
  const dominant = sorted[0];

  // Element role map for this month
  const GENERATES_MAP = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  const CONTROLS_MAP = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };

  const roles = els.map(el => {
    const isUseful = useful.includes(el);
    const isForbidden = forbidden.includes(el);
    const inBracelet = bracelet.ratios[el] > 0;
    let role = 'neutral';
    if (isForbidden) role = 'forbidden';
    else if (isUseful) role = 'prescribed';
    else if (inBracelet) role = 'supporting';
    return { el, role, pct: sorted.find(s => s.el === el)?.pct || 0 };
  });

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-white/60">Why This Remedy</h4>

      {/* Element role badges */}
      <div className="flex flex-wrap gap-1.5">
        {roles.map(({ el, role }) => {
          const bg = role === 'prescribed' ? 'bg-green-500/20 border-green-500/30 text-green-300'
            : role === 'forbidden' ? 'bg-red-500/20 border-red-500/30 text-red-300'
            : role === 'supporting' ? 'bg-teal-500/20 border-teal-500/30 text-teal-300'
            : 'bg-white/5 border-white/10 text-white/30';
          const label = role === 'prescribed' ? 'Rx' : role === 'forbidden' ? 'X' : role === 'supporting' ? '+' : '-';
          return (
            <span key={el} className={`text-[10px] px-2 py-0.5 rounded border ${bg}`}>
              {label} {el}
            </span>
          );
        })}
      </div>

      {/* Explanation bullets */}
      <div className="text-[10px] text-white/40 space-y-1">
        {isCollapse && mode === 'single-dominant' && (
          <p><span className="text-purple-300">{dominant.el}</span> is {dominant.pct.toFixed(0)}% of functional Qi - too dominant to control. The bracelet follows the structure and exhausts {dominant.el} through <span className="text-teal-300">{GENERATES_MAP[dominant.el]}</span>.</p>
        )}
        {isCollapse && mode === 'drained' && (
          <p>A key element has nearly vanished. The bracelet feeds it through its mother element to rebuild structural integrity.</p>
        )}
        {isCollapse && mode === 'bi-polar' && (
          <p>Two elements dominate equally. The bracelet bridges them with their shared child element to prevent oscillation.</p>
        )}
        {!isCollapse && yongShen.status === 'critical_imbalance' && (
          <p>Critical deficit detected. The bracelet supplies {useful.join(' + ')} to restore functional balance.</p>
        )}
        {!isCollapse && yongShen.status === 'balanced' && (
          <p>Chart is relatively balanced. The bracelet provides gentle maintenance for minor monthly deficits.</p>
        )}

        {useful.length > 0 && (
          <p>Prescribed elements: <span className="text-green-300">{useful.join(', ')}</span> - these are the Yong Shen remedy for this month.</p>
        )}
        {forbidden.length > 0 && (
          <p>Forbidden: <span className="text-red-300">{forbidden.join(', ')}</span> - {forbidden.map(f => `${f} ${CONTROLS_MAP[f] ? `controls ${CONTROLS_MAP[f]}` : ''}`).join('; ')}. Would destabilize the structure.</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SECONDARY PANEL — tabs for Comparison / Goals / Substitution
// ============================================================================

function SecondaryPanel({ comparison, subStone, substitutes, onCloseSub, allMonthBracelets, selectedGoal, onGoalChange }) {
  const [tab, setTab] = useState(subStone ? 'sub' : comparison ? 'compare' : 'goals');

  // If subStone just appeared, switch to it
  React.useEffect(() => {
    if (subStone) setTab('sub');
  }, [subStone]);

  const tabs = [];
  if (comparison) tabs.push({ key: 'compare', label: 'vs Prev Month' });
  tabs.push({ key: 'goals', label: 'Goals' });
  if (subStone) tabs.push({ key: 'sub', label: `Swap: ${subStone.name}` });

  const activeTab = tabs.find(t => t.key === tab) ? tab : tabs[0]?.key || 'goals';

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-3">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-[10px] px-2 py-1 rounded transition-colors ${
              activeTab === t.key
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-white/40 hover:text-white/60 border border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'compare' && <ComparisonPanel comparison={comparison} />}
      {activeTab === 'goals' && (
        <GoalPanel
          monthBracelets={allMonthBracelets}
          selectedGoal={selectedGoal}
          onGoalChange={onGoalChange}
        />
      )}
      {activeTab === 'sub' && (
        <SubstitutionPanel
          stone={subStone}
          substitutes={substitutes}
          onClose={() => { onCloseSub(); setTab(comparison ? 'compare' : 'goals'); }}
        />
      )}
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function BraceletDashboard({
  bracelet,
  yongShen,
  dayMasterStem,
  dynamicPool,
  userTfq,
  monthLabel,
  prevBracelet,
  prevYongShen,
  prevLabel,
  allMonthBracelets,
  engineeredBracelet,
  collapseReport,
}) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [subStone, setSubStone] = useState(null);
  const [whyOpen, setWhyOpen] = useState(false);

  const quality = useMemo(
    () => bracelet && yongShen ? scoreBracelet(bracelet, yongShen) : null,
    [bracelet, yongShen],
  );

  const stoneScores = useMemo(
    () => yongShen && dynamicPool && dayMasterStem
      ? scoreAllStones(yongShen, dynamicPool, dayMasterStem)
      : [],
    [yongShen, dynamicPool, dayMasterStem],
  );

  // Qi Physics: compute radar shift (TFQ → MFFQ → MFFQ + Bracelet)
  const radarShift = useMemo(() => {
    if (!bracelet || !yongShen || !userTfq || !dynamicPool) return null;
    return simulateRadarShift(userTfq, dynamicPool, bracelet, yongShen);
  }, [bracelet, yongShen, userTfq, dynamicPool]);

  const comparison = useMemo(() => {
    if (!prevBracelet || !prevYongShen || !bracelet || !yongShen) return null;
    return compareBracelets(prevBracelet, bracelet, prevLabel || 'Prev', monthLabel || 'Current', prevYongShen, yongShen);
  }, [prevBracelet, prevYongShen, bracelet, yongShen, prevLabel, monthLabel]);

  const substitutes = useMemo(() => {
    if (!subStone || !yongShen || !dayMasterStem) return [];
    return findSubstitutes(subStone, yongShen, dayMasterStem);
  }, [subStone, yongShen, dayMasterStem]);

  if (!bracelet || !yongShen) {
    return <p className="text-xs text-white/30">No bracelet data available.</p>;
  }

  return (
    <div className="rounded-xl border border-teal-500/20 bg-slate-900/60 p-4 space-y-4">
      {/* Bracelet preview — use engineered ring when available, fallback to old */}
      <div className="flex flex-col items-center">
        {engineeredBracelet ? (
          <EngineeredBraceletVisualizer
            beads={engineeredBracelet.beads}
            wrist={engineeredBracelet.wrist}
            wristReason={engineeredBracelet.wristReason}
            collapse={collapseReport}
            qiTotals={engineeredBracelet.qiTotals}
            size={300}
            isDark={true}
          />
        ) : (
          <>
            <BraceletPreview visualBeads={bracelet.visualBeads} size={280} />
            <p className="text-[11px] text-white/40 mt-1">
              Wear on <span className="text-teal-300">{bracelet.wristSide}</span> wrist
            </p>
          </>
        )}
      </div>

      {/* Quality + Element Distribution + Yong Shen — below bracelet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>{quality && <QualityScoreCard quality={quality} />}</div>

        <div>
          <h4 className="text-xs font-semibold text-white/60 mb-2">Element Distribution</h4>
          <ElementRatioBar ratios={bracelet.ratios} />
        </div>

        {/* Yong Shen context */}
        <div className="text-[10px] text-white/40 bg-white/5 rounded-lg p-2 self-start">
          <span className="text-teal-400/70 font-semibold">Yong Shen:</span>{' '}
          {yongShen.neededElement} ({yongShen.status === 'collapse_override' ? yongShen.collapseMode : yongShen.status})
          {yongShen.forbiddenElement && (
            <span className="text-red-400/70 ml-2">Avoid: {yongShen.forbiddenElement}</span>
          )}
        </div>
      </div>

      {/* Radar Shift — Bracelet Qi Influence on Five Elements */}
      <RadarShiftPanel radarShift={radarShift} />

      {/* Collapse Diagnosis — from new engine */}
      {collapseReport && collapseReport.isCollapsed && (
        <CollapseDiagnosisPanel collapse={collapseReport} isDark={true} />
      )}

      {/* Why This Remedy — collapsible deep-analysis section */}
      <div>
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-purple-400/70 hover:text-purple-300 transition-colors mb-2"
        >
          <span>Why This Remedy?</span>
          <span>{whyOpen ? '▾' : '▸'}</span>
        </button>
        {whyOpen && (
          <div className="space-y-4 bg-white/[0.02] rounded-lg p-3 border border-white/5">
            {/* 1. Collapse Mode Visualizer */}
            <CollapseModePanel dynamicPool={dynamicPool} yongShen={yongShen} />

            {/* 2. Why These Elements */}
            <WhyThisRemedyPanel yongShen={yongShen} dynamicPool={dynamicPool} userTfq={userTfq} bracelet={bracelet} />

            {/* 3. Dominant Element Pressure Chart */}
            <PressureChart allMonthBracelets={allMonthBracelets} userTfq={userTfq} />

            {/* 4. Monthly Element Drift Heatmap */}
            <StabilityHeatmap allMonthBracelets={allMonthBracelets} userTfq={userTfq} />
          </div>
        )}
      </div>

      {/* Row 2: Stones + Secondary panel (compare/goals/swap) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-semibold text-white/60 mb-2">Stones (effectiveness graded)</h4>
          <StoneList
            bracelet={bracelet}
            stoneScores={stoneScores}
            yongShen={yongShen}
            dayMasterStem={dayMasterStem}
            onSubstitute={setSubStone}
          />
        </div>

        <SecondaryPanel
          comparison={comparison}
          subStone={subStone}
          substitutes={substitutes}
          onCloseSub={() => setSubStone(null)}
          allMonthBracelets={allMonthBracelets}
          selectedGoal={selectedGoal}
          onGoalChange={setSelectedGoal}
        />
      </div>

      {/* Narrative */}
      {bracelet.narrative && (
        <div className="bg-white/5 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-white/60 mb-1">Remedy Narrative</h4>
          <p className="text-xs text-white/50 whitespace-pre-line leading-relaxed">{bracelet.narrative}</p>
        </div>
      )}

      {/* Notes */}
      {bracelet.notes?.length > 0 && (
        <div className="text-[10px] text-white/30 space-y-0.5">
          {bracelet.notes.map((note, i) => (
            <p key={i}>- {note}</p>
          ))}
        </div>
      )}
    </div>
  );
}
