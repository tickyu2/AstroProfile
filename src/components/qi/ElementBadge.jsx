/**
 * ElementBadge — Reusable badge for Wood / Fire / Earth / Metal / Water.
 * Uses the Tailwind elemental theme pack.
 */
import React from 'react';

const COLOR_MAP = {
  Wood:  'bg-element-wood text-white',
  Fire:  'bg-element-fire text-white',
  Earth: 'bg-element-earth text-white',
  Metal: 'bg-element-metal text-slate-900',
  Water: 'bg-element-water text-white',
};

export function ElementBadge({ element, children, className = '' }) {
  const color = COLOR_MAP[element] || 'bg-slate-600 text-white';
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${color} ${className}`}>
      {children ?? element}
    </span>
  );
}

export default ElementBadge;
