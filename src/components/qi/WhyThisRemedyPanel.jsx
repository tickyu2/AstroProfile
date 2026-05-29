/**
 * WhyThisRemedyPanel — Explains why the bracelet uses these elements.
 * Shows element role badges (Rx/X/+/-) and context-aware explanation bullets.
 */
import React from 'react';
import { ELEMENTS, ELEM_COLORS, GENERATES, CONTROLS } from './elemConstants';

export function WhyThisRemedyPanel({ yongShen, dynamicPool, userTfq, bracelet }) {
  if (!yongShen || !dynamicPool || !bracelet) return null;

  const useful = yongShen.usefulElements || [];
  const forbidden = yongShen.forbidden || [];
  const isCollapse = yongShen.status === 'collapse_override';
  const mode = yongShen.collapseMode;

  const total = ELEMENTS.reduce((s, el) => s + (dynamicPool[el] || 0), 0) || 1;
  const sorted = ELEMENTS
    .map(el => ({ el, pct: ((dynamicPool[el] || 0) / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);
  const dominant = sorted[0];

  const roles = ELEMENTS.map(el => {
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
            : 'bg-white/5 border-white/10 text-white/55';
          const label = role === 'prescribed' ? 'Rx' : role === 'forbidden' ? 'X' : role === 'supporting' ? '+' : '-';
          return (
            <span key={el} className={`text-[10px] px-2 py-0.5 rounded border ${bg}`}>
              {label} {el}
            </span>
          );
        })}
      </div>

      {/* Explanation bullets */}
      <div className="text-[10px] text-white/60 space-y-1">
        {isCollapse && mode === 'single-dominant' && (
          <p><span className="text-purple-300">{dominant.el}</span> is {dominant.pct.toFixed(0)}% of functional Qi — too dominant to control. The bracelet follows the structure and exhausts {dominant.el} through <span className="text-teal-300">{GENERATES[dominant.el]}</span>.</p>
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
          <p>Prescribed elements: <span className="text-green-300">{useful.join(', ')}</span> — these are the Yong Shen remedy for this month.</p>
        )}
        {forbidden.length > 0 && (
          <p>Forbidden: <span className="text-red-300">{forbidden.join(', ')}</span> — {forbidden.map(f => `${f} ${CONTROLS[f] ? `controls ${CONTROLS[f]}` : ''}`).join('; ')}. Would destabilize the structure.</p>
        )}
      </div>
    </div>
  );
}

export default WhyThisRemedyPanel;
