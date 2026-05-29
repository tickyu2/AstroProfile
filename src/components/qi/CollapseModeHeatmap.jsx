/**
 * CollapseModeHeatmap — Year-at-a-glance heatmap showing collapse mode
 * for each month. Color-coded cells with element dominant indicator.
 */
import React from 'react';
import { ELEM_COLORS } from './elemConstants';

const MODE_COLORS = {
  'single-dominant': { bg: 'bg-red-500/70', border: 'border-red-400/30', label: 'SD' },
  'bi-polar':        { bg: 'bg-amber-500/70', border: 'border-amber-400/30', label: 'BP' },
  'drained':         { bg: 'bg-blue-500/70', border: 'border-blue-400/30', label: 'DR' },
  'inverted':        { bg: 'bg-purple-500/70', border: 'border-purple-400/30', label: 'IN' },
  'none':            { bg: 'bg-emerald-500/40', border: 'border-emerald-400/20', label: 'OK' },
};

export function CollapseModeHeatmap({ months }) {
  if (!months || months.length === 0) return null;

  // Count modes for summary
  const modeCounts = {};
  months.forEach(m => {
    const mode = m.mode || 'none';
    modeCounts[mode] = (modeCounts[mode] || 0) + 1;
  });

  const collapseMonths = months.filter(m => m.mode && m.mode !== 'none').length;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Collapse Mode Heatmap</h4>
        <span className="text-[10px] text-white/50 font-mono">
          {collapseMonths}/{months.length} months in collapse
        </span>
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-12 gap-1.5">
        {months.map((m, i) => {
          const mode = m.mode || 'none';
          const cfg = MODE_COLORS[mode] || MODE_COLORS.none;
          const dominant = m.dominant;

          return (
            <div key={i} className="flex flex-col items-center gap-0.5 group relative">
              {/* Cell */}
              <div className={`w-full aspect-square rounded-md ${cfg.bg} border ${cfg.border} flex items-center justify-center transition-transform group-hover:scale-110`}>
                {dominant && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: ELEM_COLORS[dominant], opacity: 0.9 }}
                  />
                )}
              </div>
              <span className="text-[7px] text-white/50 font-mono">
                {(m.month || '?').slice(0, 3)}
              </span>

              {/* Tooltip on hover */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="px-2 py-1 bg-slate-800 text-[9px] text-white/70 rounded shadow-xl border border-slate-600 whitespace-nowrap">
                  <div className="font-semibold">{m.month}</div>
                  <div>{mode === 'none' ? 'Balanced' : mode}{dominant ? ` (${dominant})` : ''}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 text-[9px]">
        {Object.entries(MODE_COLORS).map(([mode, cfg]) => (
          <div key={mode} className="flex items-center gap-1">
            <div className={`w-3 h-2 rounded ${cfg.bg}`} />
            <span className="text-white/50">{mode === 'none' ? 'Balanced' : mode.replace('-', ' ')}</span>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      {collapseMonths > 0 && (
        <div className="text-[10px] text-white/55 bg-white/5 rounded-lg p-2">
          {Object.entries(modeCounts)
            .filter(([mode]) => mode !== 'none')
            .map(([mode, count]) => (
              <span key={mode} className="mr-3">
                <span className="text-white/50">{mode}</span>: {count} month{count > 1 ? 's' : ''}
              </span>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default CollapseModeHeatmap;
