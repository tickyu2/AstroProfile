/**
 * QiPlayground — Unified developer cockpit with mode switcher.
 * Flip between Console / Simulator / Designer / Storybook views.
 *
 * All props come from the parent QiBraceletPage which owns the Qi engine data.
 */
import React, { useState, useMemo } from 'react';
import { QiPhysicsConsole } from './QiPhysicsConsole';
import { CollapseModeSimulator } from './CollapseModeSimulator';
import { QiStorybookMode } from './QiStorybookMode';
import { ELEMENTS, ELEM_COLORS } from './elemConstants';
import { designBracelet, scoreBracelet } from '../../data/stoneDatabase';

const MODES = [
  { id: 'console',   label: 'Qi Console',          icon: '▸' },
  { id: 'simulator', label: 'Collapse Simulator',  icon: '◈' },
  { id: 'storybook', label: 'Storybook Mode',      icon: '📖' },
];

export function QiPlayground({ qiMatrix, userTfq, chart }) {
  const [mode, setMode] = useState('console');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);

  const months = qiMatrix?.months || [];
  const snapshot = months[selectedMonthIdx] || null;

  // Day master stem character for bracelet design
  const dmStemChar = chart?.pillars?.[2]?.stem?.char || null;

  // Pre-compute bracelet for the selected month
  const monthBracelet = useMemo(() => {
    if (!snapshot?.yongShen || !dmStemChar) return null;
    try {
      return designBracelet(snapshot.yongShen, dmStemChar);
    } catch { return null; }
  }, [snapshot?.yongShen, dmStemChar]);

  // Bracelet Qi units for storybook
  const braceletRatios = useMemo(() => {
    if (!monthBracelet?.sequence) return null;
    const dist = {};
    ELEMENTS.forEach(el => { dist[el] = 0; });
    monthBracelet.sequence.forEach(s => {
      if (s?.element) dist[s.element]++;
    });
    const total = monthBracelet.sequence.length || 1;
    const ratios = {};
    ELEMENTS.forEach(el => { ratios[el] = dist[el] / total; });
    return ratios;
  }, [monthBracelet]);

  if (!qiMatrix || months.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-center text-white/55 text-sm">
        No Qi data available. Select a profile and year first.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">Qi Playground</h3>
        <span className="text-[10px] text-white/50 font-mono">developer cockpit</span>
      </div>

      {/* Mode switcher */}
      <div className="px-4 pt-3 flex flex-wrap gap-1.5">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === m.id
                ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300 shadow-sm'
                : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:bg-slate-700/60 hover:text-slate-300'
            }`}
          >
            <span className="mr-1.5">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Month selector — shared across all modes */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/50 font-mono mr-1">Month:</span>
          <div className="flex gap-0.5 flex-wrap">
            {months.map((m, i) => {
              const isActive = selectedMonthIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedMonthIdx(i)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                    isActive
                      ? 'bg-teal-500/25 text-teal-300 border border-teal-500/30'
                      : 'text-white/50 hover:text-white/60 hover:bg-slate-700/30 border border-transparent'
                  }`}
                >
                  {(m.monthName || m.month || `M${i + 1}`).slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active view */}
      <div className="p-4">
        {mode === 'console' && snapshot && (
          <QiPhysicsConsole
            steps={snapshot.steps}
            interactions={snapshot.interactions}
            collapseInfo={snapshot.collapseInfo}
            yongShen={snapshot.yongShen}
          />
        )}

        {mode === 'simulator' && (
          <CollapseModeSimulator
            initialValues={(() => {
              if (!snapshot?.functionalQi) return undefined;
              const fq = snapshot.functionalQi;
              const total = ELEMENTS.reduce((s, el) => s + (fq[el] || 0), 0) || 1;
              const pcts = {};
              ELEMENTS.forEach(el => { pcts[el] = Math.round(((fq[el] || 0) / total) * 100); });
              return pcts;
            })()}
          />
        )}

        {mode === 'storybook' && snapshot && (
          <QiStorybookMode
            monthName={snapshot.monthName}
            season={snapshot.season}
            mffq={snapshot.functionalQi}
            userTfq={userTfq}
            yongShen={snapshot.yongShen}
            braceletRatios={braceletRatios}
            collapseMode={snapshot.yongShen?.collapseMode || null}
          />
        )}
      </div>
    </div>
  );
}

export default QiPlayground;
