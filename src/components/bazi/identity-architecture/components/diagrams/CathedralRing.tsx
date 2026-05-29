/**
 * CathedralRing — static SVG with pulsing tension lines + coherence glow
 */

import React from 'react';
import type { BaZiPillar, TensionItem, Element } from '../../engine/identityTypes';
import { ELEMENT_COLORS, PILLAR_SHORT_LABELS } from '../../utils/elementTheme';
import { polarToXY, PILLAR_ANGLES } from '../../utils/svgUtils';

interface Props {
  pillars: BaZiPillar[];
  tensions: TensionItem[];
  coherenceIndex: number;
  selectedPillar?: string | null;
}

export const CathedralRing: React.FC<Props> = ({
  pillars, tensions, coherenceIndex, selectedPillar,
}) => {
  const cx = 150, cy = 150, r = 110;

  const nodes = pillars.map((p, i) => {
    const pos = polarToXY(cx, cy, r, PILLAR_ANGLES[i]);
    return {
      ...pos,
      element: p.stem.element as Element,
      label: PILLAR_SHORT_LABELS[i],
      name: p.name,
    };
  });

  // Build tension lines from enriched TensionItems
  const tensionLines = tensions
    .filter(t => t.sourcePillar !== t.targetPillar && t.sourcePillar >= 0 && t.targetPillar >= 0)
    .map(t => ({
      source: nodes[t.sourcePillar],
      target: nodes[t.targetPillar],
      severity: t.severity,
      involves: (role: string | null) =>
        role === pillars[t.sourcePillar]?.name || role === pillars[t.targetPillar]?.name,
    }));

  // Fallback: if no cross-pillar tensions, draw simple diagonal lines based on count
  const fallbackPairs: [number, number][] = [];
  if (tensionLines.length === 0 && tensions.length > 0) {
    const tc = tensions.length;
    if (tc >= 1) fallbackPairs.push([0, 2]);
    if (tc >= 2) fallbackPairs.push([1, 2]);
    if (tc >= 3) fallbackPairs.push([2, 3]);
    if (tc >= 4) fallbackPairs.push([0, 3]);
  }

  return (
    <svg viewBox="0 0 300 300" style={{ width: 220, height: 220 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#475569" strokeWidth={2.5} />

      {/* Inner coherence glow */}
      <circle
        cx={cx} cy={cy} r={r - 22}
        fill="#38bdf8"
        className="ia-coherence-glow"
        style={{ opacity: 0.06 + (coherenceIndex / 100) * 0.2 }}
      />

      {/* Harmony lines between adjacent pillars */}
      {nodes.map((a, i) => {
        const b = nodes[(i + 1) % nodes.length];
        return (
          <line key={`arc-${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="#334155" strokeWidth={1} opacity={0.5}
          />
        );
      })}

      {/* Pulsing tension lines from enriched data */}
      {tensionLines.map((t, i) => (
        <line key={`t-${i}`}
          className={`ia-tension-line${
            selectedPillar && t.involves(selectedPillar) ? ' ia-highlighted' :
            selectedPillar ? ' ia-dimmed' : ''
          }`}
          data-severity={t.severity}
          x1={t.source.x} y1={t.source.y}
          x2={t.target.x} y2={t.target.y}
          stroke="#ef4444" strokeDasharray="5 3"
        />
      ))}

      {/* Fallback tension lines */}
      {fallbackPairs.map(([ai, bi], i) => (
        <line key={`ft-${i}`}
          className="ia-tension-line"
          data-severity={2}
          x1={nodes[ai].x} y1={nodes[ai].y}
          x2={nodes[bi].x} y2={nodes[bi].y}
          stroke="#ef4444" strokeDasharray="5 3"
        />
      ))}

      {/* Pillar nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={18}
            fill="#0f172a" stroke={ELEMENT_COLORS[n.element] || '#64748b'} strokeWidth={2.5}
            style={{
              filter: selectedPillar === n.name
                ? `drop-shadow(0 0 6px ${ELEMENT_COLORS[n.element] || '#8b5cf6'})`
                : undefined,
            }}
          />
          <text x={n.x} y={n.y + 4} textAnchor="middle"
            fontSize="12" fontWeight={700} fill={ELEMENT_COLORS[n.element] || '#94a3b8'}
          >
            {n.label}
          </text>
        </g>
      ))}

      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">Coherence</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="16" fontWeight={700} fill="#e2e8f0">
        {coherenceIndex}%
      </text>
    </svg>
  );
};
