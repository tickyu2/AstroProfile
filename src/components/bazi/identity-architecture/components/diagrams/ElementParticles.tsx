/**
 * ElementParticles — CSS-based elemental particle system
 *
 * Renders drifting particles themed to the Day Master element:
 *   Fire  → orange/red embers (upward drift)
 *   Water → blue/white mist (downward drift)
 *   Wood  → green petals (gentle float)
 *   Metal → silver sparks (quick flash)
 *   Earth → amber dust (slow settle)
 *
 * Uses CSS animations — no Canvas required.
 */

import React, { useMemo } from 'react';

interface Props {
  element: string;
  /** Number of particles (default 20) */
  count?: number;
}

interface ParticleStyle {
  color: string;
  glow: string;
  /** CSS direction: 'up' | 'down' | 'float' */
  direction: 'up' | 'down' | 'float';
  sizeRange: [number, number];
  speedRange: [number, number];
}

function particleStyleForElement(el: string): ParticleStyle {
  switch (el) {
    case 'Fire':
      return { color: '#f97316', glow: 'rgba(249,115,22,0.4)', direction: 'up', sizeRange: [2, 5], speedRange: [6, 14] };
    case 'Water':
      return { color: '#60a5fa', glow: 'rgba(96,165,250,0.3)', direction: 'down', sizeRange: [3, 7], speedRange: [10, 20] };
    case 'Wood':
      return { color: '#4ade80', glow: 'rgba(74,222,128,0.3)', direction: 'float', sizeRange: [3, 6], speedRange: [12, 22] };
    case 'Metal':
      return { color: '#e2e8f0', glow: 'rgba(226,232,240,0.4)', direction: 'up', sizeRange: [1, 3], speedRange: [4, 10] };
    case 'Earth':
      return { color: '#d97706', glow: 'rgba(217,119,6,0.3)', direction: 'down', sizeRange: [2, 5], speedRange: [14, 24] };
    default:
      return { color: '#94a3b8', glow: 'rgba(148,163,184,0.3)', direction: 'float', sizeRange: [2, 5], speedRange: [10, 18] };
  }
}

function randomBetween(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

export const ElementParticles: React.FC<Props> = ({ element, count = 20 }) => {
  const style = particleStyleForElement(element);

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const size = randomBetween(style.sizeRange[0], style.sizeRange[1]);
      const duration = randomBetween(style.speedRange[0], style.speedRange[1]);
      const delay = randomBetween(0, duration);
      const left = randomBetween(0, 100);
      const startTop = style.direction === 'up' ? randomBetween(60, 100) :
                       style.direction === 'down' ? randomBetween(-10, 30) :
                       randomBetween(10, 90);
      return { id: i, size, duration, delay, left, startTop };
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [element, count],
  );

  const animName = style.direction === 'up' ? 'particleDriftUp' :
                   style.direction === 'down' ? 'particleDriftDown' :
                   'particleDriftFloat';

  return (
    <div className="element-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: style.color,
            boxShadow: `0 0 ${p.size * 2}px ${style.glow}`,
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.startTop}%`,
            opacity: 0,
            animation: `${animName} ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
};
