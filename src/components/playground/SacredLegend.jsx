/**
 * SacredLegend Component
 *
 * A poetic micro-legend naming the three sacred naves of the Soul Garden:
 *   - The Nave (Human Effort, Vertical Ascent)
 *   - The Cloister (Living Soul, Organic Breath)
 *   - The Rose Window (Divine Order, Sacred Geometry)
 *
 * Architecture explained through poetry.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React from 'react';

const SACRED_NAVES = [
  {
    name: 'The Nave',
    color: '#34d399',
    glowColor: 'rgba(52,211,153,0.3)',
    description: 'Human Effort',
    subtitle: 'Vertical Ascent',
    symbol: '△'
  },
  {
    name: 'The Cloister',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    description: 'Living Soul',
    subtitle: 'Organic Breath',
    symbol: '◎'
  },
  {
    name: 'The Rose Window',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    description: 'Divine Order',
    subtitle: 'Sacred Geometry',
    symbol: '✦'
  }
];

export default function SacredLegend({ alchemical = true }) {
  return (
    <div
      className={alchemical ? 'soul-panel' : ''}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        marginBottom: '16px',
        background: 'linear-gradient(90deg, rgba(30,27,75,0.5) 0%, rgba(15,23,42,0.3) 50%, rgba(30,27,75,0.5) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(148,163,184,0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle connecting line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.2) 20%, rgba(148,163,184,0.2) 80%, transparent 100%)',
          zIndex: 0
        }}
      />

      {SACRED_NAVES.map((nave, idx) => (
        <div
          key={nave.name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            zIndex: 1,
            padding: '4px 12px',
            borderRadius: '8px',
            background: alchemical ? `radial-gradient(circle at center, ${nave.glowColor} 0%, transparent 70%)` : 'transparent',
            transition: 'all 0.4s ease'
          }}
        >
          {/* Symbol */}
          <span
            style={{
              fontSize: '12px',
              color: nave.color,
              opacity: alchemical ? 1 : 0.6,
              filter: alchemical ? `drop-shadow(0 0 4px ${nave.color})` : 'none',
              transition: 'all 0.4s ease'
            }}
          >
            {nave.symbol}
          </span>

          {/* Nave name */}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: nave.color,
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease'
            }}
          >
            {nave.name}
          </span>

          {/* Description */}
          <span
            style={{
              fontSize: '9px',
              color: 'rgba(226,232,240,0.6)',
              letterSpacing: '0.03em',
              textAlign: 'center'
            }}
          >
            {nave.description}
          </span>

          {/* Subtitle */}
          <span
            style={{
              fontSize: '8px',
              color: 'rgba(148,163,184,0.5)',
              fontStyle: 'italic',
              letterSpacing: '0.02em'
            }}
          >
            {nave.subtitle}
          </span>
        </div>
      ))}
    </div>
  );
}
