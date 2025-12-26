/**
 * AlchemicalToggle Component
 *
 * A ritual lever that transforms the Soul Garden between:
 *   - Contemplative Mode (minimal, calm)
 *   - Alchemical Mode (full ceremony, golden shimmer, breath)
 *
 * Designed as an occult switch — subtle, elegant, intentional.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React from 'react';

export default function AlchemicalToggle({ enabled, onToggle }) {
  return (
    <div
      onClick={() => onToggle(!enabled)}
      className="group cursor-pointer select-none"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 14px',
        borderRadius: '16px',
        background: enabled
          ? 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.1) 100%)'
          : 'rgba(148,163,184,0.08)',
        border: enabled
          ? '1px solid rgba(251,191,36,0.4)'
          : '1px solid rgba(148,163,184,0.2)',
        boxShadow: enabled
          ? '0 0 20px rgba(251,191,36,0.15), inset 0 0 8px rgba(251,191,36,0.1)'
          : 'none',
        transition: 'all 0.4s ease'
      }}
    >
      {/* Alchemical symbol */}
      <span
        style={{
          fontSize: '14px',
          opacity: enabled ? 1 : 0.5,
          transition: 'all 0.3s ease',
          filter: enabled ? 'drop-shadow(0 0 4px rgba(251,191,36,0.6))' : 'none'
        }}
      >
        {enabled ? '⚗️' : '🔮'}
      </span>

      {/* Label */}
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: enabled ? '#fbbf24' : '#94a3b8',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          transition: 'all 0.3s ease'
        }}
      >
        Alchemical
      </span>

      {/* Toggle track */}
      <div
        style={{
          width: '32px',
          height: '16px',
          borderRadius: '16px',
          background: enabled
            ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
            : '#475569',
          position: 'relative',
          transition: 'all 0.4s ease',
          boxShadow: enabled
            ? '0 0 12px rgba(251,191,36,0.4)'
            : 'inset 0 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {/* Toggle knob */}
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: enabled
              ? 'radial-gradient(circle at 30% 30%, #fff 0%, #fef3c7 100%)'
              : '#e2e8f0',
            position: 'absolute',
            top: '1px',
            left: enabled ? '16px' : '1px',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: enabled
              ? '0 0 8px rgba(251,191,36,0.6), 0 2px 4px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.3)'
          }}
        />
      </div>

      {/* Mode indicator */}
      <span
        style={{
          fontSize: '9px',
          color: enabled ? 'rgba(251,191,36,0.7)' : 'rgba(148,163,184,0.5)',
          letterSpacing: '0.05em',
          transition: 'all 0.3s ease'
        }}
      >
        {enabled ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}
