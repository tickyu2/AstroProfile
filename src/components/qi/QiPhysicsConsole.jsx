/**
 * QiPhysicsConsole — Live scrolling log of every pipeline calculation step.
 * Accepts the snapshot.steps array from the Qi engine and renders them
 * as a debugger-style console with element color coding.
 */
import React, { useState, useRef, useEffect } from 'react';
import { ELEMENTS, ELEM_COLORS } from './elemConstants';

function fmtQi(qi) {
  return ELEMENTS.map(el => {
    const v = qi?.[el] || 0;
    return { el, v };
  });
}

export function QiPhysicsConsole({ steps, interactions, collapseInfo, yongShen }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all | natal | environmental | interactions | remedy
  const bottomRef = useRef(null);

  // Build log entries from steps + interactions + collapse + yongshen
  const logs = [];

  if (steps) {
    steps.forEach((step, i) => {
      const lbl = step.label || '';
      const category = lbl.match(/Step [12]:/) ? 'natal'
        : lbl.match(/Step [345]|Da Yun|MTFQ/) ? 'environmental'
        : lbl.match(/Step [67]:/) ? 'interactions'
        : 'remedy';
      logs.push({
        idx: i,
        category,
        label: step.label,
        detail: step.detail,
        qi: step.qi,
        totalQi: step.totalQi,
      });
    });
  }

  if (interactions?.length > 0) {
    interactions.forEach(hit => {
      logs.push({
        idx: logs.length,
        category: 'interactions',
        label: `${hit.type}: ${hit.branches?.join(' + ') || ''}`,
        detail: hit.description || `${hit.type} between ${hit.branches?.join(' and ') || 'branches'}`,
        qi: null,
        totalQi: null,
      });
    });
  }

  if (collapseInfo) {
    const isCollapse = collapseInfo.mode && collapseInfo.mode !== 'none';
    logs.push({
      idx: logs.length,
      category: 'remedy',
      label: 'Collapse Detection',
      detail: isCollapse
        ? `Mode: ${collapseInfo.mode} | Primary: ${collapseInfo.primary || '?'} (${((collapseInfo.primaryShare || 0) * 100).toFixed(1)}%)`
        : 'No structural collapse detected.',
      qi: null,
      totalQi: null,
    });
  }

  if (yongShen) {
    logs.push({
      idx: logs.length,
      category: 'remedy',
      label: 'Yong Shen Selection',
      detail: `Status: ${yongShen.status} | Rx: ${yongShen.usefulElements?.join(', ') || 'none'} | Forbidden: ${yongShen.forbidden?.join(', ') || 'none'}`,
      qi: null,
      totalQi: null,
    });
  }

  const filtered = filter === 'all' ? logs : logs.filter(l => l.category === filter);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, filtered.length]);

  const CATEGORY_COLORS = {
    natal: 'border-l-indigo-500',
    environmental: 'border-l-amber-500',
    interactions: 'border-l-red-500',
    remedy: 'border-l-teal-500',
  };

  const FILTER_BUTTONS = [
    { key: 'all', label: 'All' },
    { key: 'natal', label: 'Natal' },
    { key: 'environmental', label: 'Env' },
    { key: 'interactions', label: 'Clash' },
    { key: 'remedy', label: 'Remedy' },
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-green-400/80 font-mono">{'>'}_</span>
          <span className="text-xs font-semibold text-white/60">Qi Physics Console</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/55 font-mono">{logs.length} entries</span>
          <span className="text-white/55">{open ? '\u25B2' : '\u25BC'}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-700">
          {/* Filter bar */}
          <div className="flex gap-1 px-3 py-1.5 bg-slate-800/30 border-b border-slate-700/50">
            {FILTER_BUTTONS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                  filter === f.key
                    ? 'bg-slate-600 text-white'
                    : 'text-white/55 hover:text-white/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Log entries */}
          <div className="max-h-80 overflow-y-auto px-3 py-2 space-y-1.5 font-mono">
            {filtered.map((log, i) => (
              <div
                key={i}
                className={`border-l-2 ${CATEGORY_COLORS[log.category] || 'border-l-slate-600'} pl-2 py-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/60 font-semibold">{log.label}</span>
                  {log.totalQi != null && (
                    <span className="text-[9px] text-white/50">{log.totalQi.toFixed(3)} pts</span>
                  )}
                </div>
                <div className="text-[10px] text-white/35 leading-snug mt-0.5 whitespace-pre-wrap">{log.detail}</div>
                {log.qi && (
                  <div className="flex gap-2 mt-1">
                    {fmtQi(log.qi).map(({ el, v }) => (
                      <span key={el} className="text-[9px] font-mono" style={{ color: ELEM_COLORS[el], opacity: v > 0 ? 0.7 : 0.2 }}>
                        {el === 'Wood' ? 'Wd' : el === 'Water' ? 'Wa' : el[0]}:{v.toFixed(2)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}

export default QiPhysicsConsole;
