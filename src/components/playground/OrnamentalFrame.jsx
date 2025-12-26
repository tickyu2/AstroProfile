/**
 * OrnamentalFrame Component
 *
 * Art Nouveau-inspired decorative frame with corner flourishes.
 * Wraps panels in wrought-iron aesthetic borders.
 * Part of the Soul Garden Cathedral.
 *
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React from 'react';

export default function OrnamentalFrame({ children, color = '#a78bfa', glowColor = null }) {
  const glow = glowColor || color;

  return (
    <div className="relative w-full h-full">
      {/* SVG Corner Flourishes */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <defs>
          {/* Glow filter for flourishes */}
          <filter id="flourishGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top-left corner flourish */}
        <g filter="url(#flourishGlow)">
          <path
            d="M 2 15 C 2 8, 5 4, 10 3 Q 15 2, 20 3"
            fill="none"
            stroke={color}
            strokeWidth="0.4"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 3 12 Q 4 6, 8 4 Q 12 3, 16 4"
            fill="none"
            stroke={color}
            strokeWidth="0.3"
            strokeOpacity="0.5"
          />
          {/* Decorative curl */}
          <circle cx="4" cy="4" r="1.5" fill={color} fillOpacity="0.3" />
        </g>

        {/* Top-right corner flourish */}
        <g filter="url(#flourishGlow)">
          <path
            d="M 80 3 Q 85 2, 90 3 C 95 4, 98 8, 98 15"
            fill="none"
            stroke={color}
            strokeWidth="0.4"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 84 4 Q 88 3, 92 4 Q 96 6, 97 12"
            fill="none"
            stroke={color}
            strokeWidth="0.3"
            strokeOpacity="0.5"
          />
          <circle cx="96" cy="4" r="1.5" fill={color} fillOpacity="0.3" />
        </g>

        {/* Bottom-left corner flourish */}
        <g filter="url(#flourishGlow)">
          <path
            d="M 2 85 C 2 92, 5 96, 10 97 Q 15 98, 20 97"
            fill="none"
            stroke={color}
            strokeWidth="0.4"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 3 88 Q 4 94, 8 96 Q 12 97, 16 96"
            fill="none"
            stroke={color}
            strokeWidth="0.3"
            strokeOpacity="0.5"
          />
          <circle cx="4" cy="96" r="1.5" fill={color} fillOpacity="0.3" />
        </g>

        {/* Bottom-right corner flourish */}
        <g filter="url(#flourishGlow)">
          <path
            d="M 80 97 Q 85 98, 90 97 C 95 96, 98 92, 98 85"
            fill="none"
            stroke={color}
            strokeWidth="0.4"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 84 96 Q 88 97, 92 96 Q 96 94, 97 88"
            fill="none"
            stroke={color}
            strokeWidth="0.3"
            strokeOpacity="0.5"
          />
          <circle cx="96" cy="96" r="1.5" fill={color} fillOpacity="0.3" />
        </g>

        {/* Optional: connecting vine lines along edges */}
        <path
          d="M 22 2 Q 50 1, 78 2"
          fill="none"
          stroke={color}
          strokeWidth="0.2"
          strokeOpacity="0.25"
          strokeDasharray="2,4"
        />
        <path
          d="M 22 98 Q 50 99, 78 98"
          fill="none"
          stroke={color}
          strokeWidth="0.2"
          strokeOpacity="0.25"
          strokeDasharray="2,4"
        />
      </svg>

      {/* Content */}
      <div className="relative w-full h-full" style={{ zIndex: 1 }}>
        {children}
      </div>

      {/* Corner glow effects (CSS-based for performance) */}
      <div
        className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, ${glow}20 0%, transparent 70%)`,
          zIndex: 5
        }}
      />
      <div
        className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${glow}20 0%, transparent 70%)`,
          zIndex: 5
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none"
        style={{
          background: `radial-gradient(circle at bottom left, ${glow}20 0%, transparent 70%)`,
          zIndex: 5
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          background: `radial-gradient(circle at bottom right, ${glow}20 0%, transparent 70%)`,
          zIndex: 5
        }}
      />
    </div>
  );
}
