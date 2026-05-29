/**
 * CollapseModeVisualizer — Structure analysis showing element dominance,
 * collapse mode detection, and ratio explanation.
 *
 * Supports educationLevel: beginner | intermediate | advanced
 * Element-agnostic: detects the dominant element dynamically from the data.
 */
import React from 'react';
import { ELEMENTS, ELEM_COLORS, GENERATES, CONTROLS } from './elemConstants';

const MODE_LABELS = {
  'single-dominant': 'Single-Dominant',
  'bi-polar': 'Bi-Polar Bridge',
  'drained': 'Drained Element',
  'inverted': 'Inverted Structure',
};

const MODE_CLASSICAL = {
  'single-dominant': 'Follow the Strong',
  'bi-polar': 'Bridge the Poles',
  'drained': 'Feed the Mother',
  'inverted': 'Restore the Root',
};

export function CollapseModeVisualizer({ dynamicPool, yongShen, educationLevel = 'beginner' }) {
  if (!dynamicPool || !yongShen) return null;
  const total = ELEMENTS.reduce((s, el) => s + (dynamicPool[el] || 0), 0) || 1;
  const sorted = ELEMENTS
    .map(el => ({ el, val: dynamicPool[el] || 0, pct: ((dynamicPool[el] || 0) / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const dominant = sorted[0];
  const second = sorted[1];
  const weakest = sorted[sorted.length - 1];
  const ratio = second.pct > 0 ? (dominant.pct / second.pct) : 0;
  const ratioStr = ratio > 0 ? ratio.toFixed(1) : '---';
  const isCollapse = yongShen.status === 'collapse_override';
  const mode = yongShen.collapseMode || 'none';
  const lvl = educationLevel;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Structure Analysis</h4>
        {isCollapse && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300">
            {MODE_LABELS[mode] || mode}
          </span>
        )}
      </div>

      {/* Element bars */}
      <div className="space-y-1">
        {sorted.map(({ el, val, pct }) => (
          <div key={el} className="flex items-center gap-2">
            <span className="text-[10px] w-10 text-right" style={{ color: ELEM_COLORS[el] }}>{el}</span>
            <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
              <div className="h-full rounded" style={{
                width: `${pct}%`,
                backgroundColor: ELEM_COLORS[el],
                opacity: el === dominant.el && isCollapse ? 0.9 : 0.5,
              }} />
            </div>
            <span className="text-[10px] text-white/60 font-mono w-10">{pct.toFixed(1)}%</span>
            {/* Advanced: raw Qi points */}
            {lvl === 'advanced' && (
              <span className="text-[9px] text-white/50 font-mono w-10">{val.toFixed(2)}</span>
            )}
          </div>
        ))}
      </div>

      {/* ── BEGINNER: plain-language explanation ── */}
      {lvl === 'beginner' && isCollapse && (
        <div className="text-[10px] text-white/60 bg-white/5 rounded-lg p-2 space-y-1">
          {mode === 'single-dominant' && (
            <p><span className="text-purple-300 font-semibold">{dominant.el}</span> is very strong in this chart. Instead of fighting it, the bracelet works with it and channels the excess energy productively.</p>
          )}
          {mode === 'drained' && (
            <p>One element is very weak. The bracelet gently feeds it back to health through its parent element.</p>
          )}
          {mode === 'bi-polar' && (
            <p>Two elements are fighting for dominance. The bracelet adds a bridge element to create harmony.</p>
          )}
          {mode === 'inverted' && (
            <p>Your Day Master element is the weakest in the chart. The bracelet rebuilds your core identity element.</p>
          )}
          {!isCollapse && (
            <p>The chart is relatively balanced. Minor monthly adjustments keep things stable.</p>
          )}
        </div>
      )}

      {/* ── INTERMEDIATE: adds Qi math ── */}
      {lvl === 'intermediate' && (
        <div className="text-[10px] text-white/60 bg-white/5 rounded-lg p-2 space-y-1">
          <p>
            <span className="text-purple-300 font-semibold">{dominant.el}</span> = {dominant.pct.toFixed(1)}%,
            next = {second.el} {second.pct.toFixed(1)}% (ratio {ratioStr}x)
          </p>
          {isCollapse && mode === 'single-dominant' && (
            <p>Follow-structure: support {dominant.el}, exhaust via its child <span className="text-teal-300">{GENERATES[dominant.el]}</span>. Forbidden: {yongShen.forbidden?.join(', ') || 'none'}.</p>
          )}
          {isCollapse && mode === 'drained' && (
            <p>Weakest element: <span className="text-blue-300">{weakest.el}</span> at {weakest.pct.toFixed(1)}%. Feed through mother element.</p>
          )}
          {isCollapse && mode === 'bi-polar' && (
            <p>Two elements dominate equally. Bridge with shared child to prevent oscillation.</p>
          )}
          {!isCollapse && (
            <p>No structural collapse detected. Dominant/second ratio = {ratioStr}x (threshold: 2.0x).</p>
          )}
        </div>
      )}

      {/* ── ADVANCED: raw thresholds + classical rules ── */}
      {lvl === 'advanced' && (
        <div className="text-[10px] text-white/60 bg-white/5 rounded-lg p-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-white/50 font-semibold">Collapse Detection</span>
            {isCollapse && (
              <span className="text-[9px] text-amber-300 font-mono">{MODE_CLASSICAL[mode] || mode}</span>
            )}
          </div>
          <table className="w-full text-[9px] font-mono">
            <tbody>
              <tr><td className="text-white/55 pr-2">Dominant</td><td>{dominant.el} = {dominant.pct.toFixed(2)}% ({dominant.val.toFixed(3)} pts)</td></tr>
              <tr><td className="text-white/55 pr-2">Second</td><td>{second.el} = {second.pct.toFixed(2)}% ({second.val?.toFixed(3)} pts)</td></tr>
              <tr><td className="text-white/55 pr-2">Ratio</td><td>{ratioStr}x {ratio >= 2 ? '> 2.0 COLLAPSE' : '< 2.0 normal'}</td></tr>
              <tr><td className="text-white/55 pr-2">Weakest</td><td>{weakest.el} = {weakest.pct.toFixed(2)}% ({weakest.val.toFixed(3)} pts)</td></tr>
              <tr><td className="text-white/55 pr-2">Status</td><td>{yongShen.status}</td></tr>
              <tr><td className="text-white/55 pr-2">Mode</td><td>{mode}</td></tr>
            </tbody>
          </table>

          {isCollapse && mode === 'single-dominant' && (
            <div className="border-t border-white/10 pt-1">
              <p className="text-purple-300">Classical rule: When dominant element exceeds 2x the next, enter Follow-the-Strong mode. Support the dominant via its child ({GENERATES[dominant.el]}). Never control with {CONTROLS[dominant.el]} — it would trigger catastrophic rebound.</p>
            </div>
          )}
          {isCollapse && mode === 'drained' && (
            <div className="border-t border-white/10 pt-1">
              <p className="text-blue-300">Classical rule: When any element falls below 5% of total Qi, feed it through the Sheng cycle (mother element). Direct supplementation risks overcorrection.</p>
            </div>
          )}

          {/* All sorted elements with raw values */}
          <div className="border-t border-white/10 pt-1">
            <p className="text-white/55 mb-0.5">Full distribution:</p>
            {sorted.map(({ el, val, pct }) => (
              <span key={el} className="inline-block mr-2" style={{ color: ELEM_COLORS[el] }}>
                {el[0]}:{val.toFixed(2)}({pct.toFixed(1)}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollapseModeVisualizer;
