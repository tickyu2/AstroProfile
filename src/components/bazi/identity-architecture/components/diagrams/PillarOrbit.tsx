/**
 * PillarOrbit — four pillars orbiting the Destiny Pulse
 *
 * Each pillar marker orbits at a slightly different speed,
 * creating a celestial rotation effect in Temple Mode.
 */

import React from 'react';
import { ELEMENT_COLORS } from '../../utils/elementTheme';
import type { BaZiPillar } from '../../engine/identityTypes';

interface Props {
  pillars: BaZiPillar[];
  onSelectPillar?: (name: string) => void;
}

const ROLE_LABELS: Record<string, string> = {
  Year: 'Y', Month: 'M', Day: 'D', Hour: 'H',
};

export const PillarOrbit: React.FC<Props> = ({ pillars, onSelectPillar }) => (
  <div className="pillar-orbit-container">
    {pillars.map((p, i) => {
      const color = ELEMENT_COLORS[p.stem.element] || '#94a3b8';
      const duration = 40 + i * 8; // Y=40s, M=48s, D=56s, H=64s
      const delay = i * -10;       // stagger start positions

      return (
        <div
          key={p.name}
          className="pillar-orbit"
          style={{
            '--orbit-duration': `${duration}s`,
            animationDelay: `${delay}s`,
          } as React.CSSProperties}
          onClick={() => onSelectPillar?.(p.name)}
        >
          <div
            className="pillar-orbit-marker"
            style={{
              background: `radial-gradient(circle, ${color}44, ${color}11)`,
              borderColor: `${color}66`,
              color,
            }}
          >
            <div className="pillar-orbit-label">
              {ROLE_LABELS[p.name] || p.name[0]}
            </div>
            <div className="pillar-orbit-element">
              {p.stem.element}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
