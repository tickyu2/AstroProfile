/**
 * ThreeRingCathedral — concentric Heaven/Earth/Human rings
 *
 * Each pillar gets 3 nodes at different radii, connected by spoke lines.
 * Click a pillar to select it.
 */

import React from 'react';
import { HIDDEN_STEMS } from '../../../../../utils/baziWheels';
import type { BaZiPillar } from '../../engine/identityTypes';
import { ELEMENT_COLORS, PILLAR_SHORT_LABELS } from '../../utils/elementTheme';
import { polarToXY, PILLAR_ANGLES } from '../../utils/svgUtils';

interface Props {
  pillars: BaZiPillar[];
  onSelectPillar?: (role: string) => void;
  selectedPillar?: string | null;
}

export const ThreeRingCathedral: React.FC<Props> = ({ pillars, onSelectPillar, selectedPillar }) => {
  const cx = 160, cy = 160;
  const radii = { heaven: 130, earth: 95, human: 60 };

  const ringData = pillars.map((p, i) => {
    const hs = HIDDEN_STEMS[p.branch.index];
    const humanEl = hs?.[0]?.element || p.branch.element;
    return {
      role: PILLAR_SHORT_LABELS[i],
      roleName: p.name,
      angle: PILLAR_ANGLES[i],
      heaven: p.stem.element,
      earth: p.branch.element,
      human: humanEl,
    };
  });

  return (
    <svg viewBox="0 0 320 320" style={{ width: 260, height: 260 }}>
      {/* Ring circles */}
      <circle cx={cx} cy={cy} r={radii.heaven} fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={cx} cy={cy} r={radii.earth} fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={cx} cy={cy} r={radii.human} fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="3 2" />

      {/* Ring labels */}
      <text x={cx} y={cy - radii.heaven - 6} textAnchor="middle" fontSize="9" fill="#64748b">Heaven</text>
      <text x={cx} y={cy - radii.earth - 6} textAnchor="middle" fontSize="9" fill="#64748b">Earth</text>
      <text x={cx} y={cy - radii.human - 6} textAnchor="middle" fontSize="9" fill="#64748b">Human</text>

      {ringData.map((d, i) => {
        const h = polarToXY(cx, cy, radii.heaven, d.angle);
        const e = polarToXY(cx, cy, radii.earth, d.angle);
        const u = polarToXY(cx, cy, radii.human, d.angle);
        const outer = polarToXY(cx, cy, radii.heaven + 18, d.angle);
        const isSelected = selectedPillar === d.roleName;
        const glowFilter = isSelected ? 'url(#selectedGlow)' : undefined;

        return (
          <g key={i}
            className="ia-ring-node"
            style={{ cursor: onSelectPillar ? 'pointer' : undefined }}
            onClick={() => onSelectPillar?.(d.roleName)}
          >
            {/* Connecting spoke */}
            <line x1={h.x} y1={h.y} x2={u.x} y2={u.y}
              stroke={isSelected ? '#94a3b8' : '#1e293b'} strokeWidth={isSelected ? 1.5 : 1} opacity={isSelected ? 0.8 : 0.5}
            />

            {/* Heaven node */}
            <circle cx={h.x} cy={h.y} r={12}
              fill="#0f172a" stroke={ELEMENT_COLORS[d.heaven] || '#64748b'} strokeWidth={2.5}
              filter={glowFilter}
            />
            <text x={h.x} y={h.y + 3.5} textAnchor="middle" fontSize="8" fontWeight={700}
              fill={ELEMENT_COLORS[d.heaven] || '#94a3b8'}
            >
              {d.heaven.charAt(0)}
            </text>

            {/* Earth node */}
            <circle cx={e.x} cy={e.y} r={10}
              fill="#0f172a" stroke={ELEMENT_COLORS[d.earth] || '#64748b'} strokeWidth={2}
              filter={glowFilter}
            />
            <text x={e.x} y={e.y + 3} textAnchor="middle" fontSize="7" fontWeight={600}
              fill={ELEMENT_COLORS[d.earth] || '#94a3b8'}
            >
              {d.earth.charAt(0)}
            </text>

            {/* Human node */}
            <circle cx={u.x} cy={u.y} r={8}
              fill="#0f172a" stroke={ELEMENT_COLORS[d.human] || '#64748b'} strokeWidth={2}
              filter={glowFilter}
            />
            <text x={u.x} y={u.y + 3} textAnchor="middle" fontSize="7" fontWeight={600}
              fill={ELEMENT_COLORS[d.human] || '#94a3b8'}
            >
              {d.human.charAt(0)}
            </text>

            {/* Role label */}
            <text
              x={outer.x} y={outer.y + 4}
              textAnchor="middle" fontSize="11" fontWeight={700}
              fill={isSelected ? '#e2e8f0' : '#94a3b8'}
            >
              {d.role}
            </text>
          </g>
        );
      })}

      {/* Glow filter for selected nodes */}
      <defs>
        <filter id="selectedGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};
