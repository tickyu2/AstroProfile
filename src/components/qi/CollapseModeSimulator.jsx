/**
 * CollapseModeSimulator — Interactive slider panel to experiment with
 * element distributions and see real-time collapse detection results.
 *
 * Uses the actual detectCollapse logic from stoneDatabase.
 */
import React, { useState, useMemo } from 'react';
import { ELEMENTS, ELEM_COLORS, GENERATES, CONTROLS } from './elemConstants';
import { detectCollapse } from '../../data/stoneDatabase';

const MODE_LABELS = {
  'single-dominant': 'Single-Dominant (從旺格)',
  'bi-polar': 'Bi-Polar Bridge',
  'drained': 'Drained Element',
  'inverted': 'Inverted Structure',
  'none': 'No Collapse — Balanced',
};

const MODE_COLORS = {
  'single-dominant': 'bg-red-500/20 border-red-500/40 text-red-300',
  'bi-polar': 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  'drained': 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  'inverted': 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  'none': 'bg-green-500/20 border-green-500/40 text-green-300',
};

export function CollapseModeSimulator({ initialValues }) {
  const [values, setValues] = useState(() =>
    initialValues || { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 }
  );

  const total = ELEMENTS.reduce((s, el) => s + (values[el] || 0), 0) || 1;

  // Run real collapse detection
  const collapse = useMemo(() => {
    const pctPool = {};
    ELEMENTS.forEach(el => { pctPool[el] = ((values[el] || 0) / total) * 100; });
    return detectCollapse(pctPool);
  }, [values, total]);

  const sorted = ELEMENTS
    .map(el => ({ el, val: values[el] || 0, pct: ((values[el] || 0) / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const dominant = sorted[0];
  const second = sorted[1];
  const ratio = second.pct > 0 ? (dominant.pct / second.pct).toFixed(2) : '---';

  const handleChange = (el, val) => {
    setValues(prev => ({ ...prev, [el]: val }));
  };

  const presets = [
    { label: 'Balanced', vals: { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 } },
    { label: 'Fire Dominant', vals: { Wood: 5, Fire: 55, Earth: 25, Metal: 5, Water: 10 } },
    { label: 'Bi-Polar', vals: { Wood: 40, Fire: 3, Earth: 5, Metal: 42, Water: 10 } },
    { label: 'Drained Metal', vals: { Wood: 25, Fire: 30, Earth: 25, Metal: 2, Water: 18 } },
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white/70">Collapse Mode Simulator</h4>
        <div className="flex gap-1">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setValues(p.vals)}
              className="text-[9px] px-2 py-0.5 rounded bg-slate-700/50 text-white/60 hover:text-white/60 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {ELEMENTS.map(el => {
          const pct = ((values[el] || 0) / total) * 100;
          return (
            <div key={el} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/60">{values[el]}</span>
                  <span className="font-mono text-white/50">({pct.toFixed(1)}%)</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={values[el] || 0}
                onChange={e => handleChange(el, Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${ELEM_COLORS[el]}80 0%, ${ELEM_COLORS[el]}80 ${pct}%, #1e293b ${pct}%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Result */}
      <div className={`rounded-lg border p-3 space-y-2 ${MODE_COLORS[collapse.mode] || MODE_COLORS.none}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">{MODE_LABELS[collapse.mode] || 'Unknown'}</span>
          <span className="text-[10px] font-mono">ratio: {ratio}x</span>
        </div>

        {collapse.mode !== 'none' && (
          <div className="text-[10px] opacity-80 space-y-0.5">
            <p>Primary: <span className="font-semibold">{collapse.primary}</span> ({((collapse.primaryShare || 0) * 100).toFixed(1)}%)</p>
            {collapse.secondary && (
              <p>Secondary: <span className="font-semibold">{collapse.secondary}</span> ({((collapse.secondaryShare || 0) * 100).toFixed(1)}%)</p>
            )}
            {collapse.mode === 'single-dominant' && (
              <p className="mt-1">Follow the Strong: support {collapse.primary}, exhaust via {GENERATES[collapse.primary]}. Never use {CONTROLS[collapse.primary]}.</p>
            )}
            {collapse.mode === 'drained' && (
              <p className="mt-1">Feed {collapse.primary} through its mother element to restore balance.</p>
            )}
          </div>
        )}

        {/* Distribution bars */}
        <div className="flex h-4 rounded overflow-hidden gap-px mt-2">
          {sorted.map(({ el, pct }) => (
            <div
              key={el}
              style={{ width: `${pct}%`, backgroundColor: ELEM_COLORS[el], opacity: 0.7 }}
              title={`${el}: ${pct.toFixed(1)}%`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollapseModeSimulator;
