/**
 * ElementSigil — inline SVG elemental glyphs that awaken at high tension
 *
 * Each element has a unique sigil rendered as pure SVG paths:
 *   Wood  → spiral growth rune
 *   Fire  → radiating flame star
 *   Earth → square mandala
 *   Metal → geometric blade octagon
 *   Water → flowing wave seal
 *
 * When severity crosses the activation threshold (0.55), the sigil
 * awakens with a rotation + glow + scale animation.
 */

import React from 'react';
import { ELEMENT_COLORS } from '../../utils/elementTheme';

interface Props {
  element: string;
  severity: number;
}

const ACTIVATION_THRESHOLD = 0.55;

/** Inline SVG path data for each element's sigil */
function sigilPath(element: string): string {
  switch (element) {
    case 'Wood':
      // Spiral growth rune — organic double helix
      return 'M100,30 C130,50 130,80 100,100 C70,120 70,150 100,170 M100,30 C70,50 70,80 100,100 C130,120 130,150 100,170 M100,10 L100,190 M60,100 L140,100';
    case 'Fire':
      // Radiating flame star — 8-point burst
      return 'M100,20 L110,80 L170,60 L120,110 L180,100 L120,130 L170,170 L110,130 L100,190 L90,130 L30,170 L80,130 L20,100 L80,110 L30,60 L90,80 Z';
    case 'Earth':
      // Square mandala — nested rotated squares
      return 'M60,60 L140,60 L140,140 L60,140 Z M100,40 L160,100 L100,160 L40,100 Z M80,80 L120,80 L120,120 L80,120 Z M100,70 L130,100 L100,130 L70,100 Z';
    case 'Metal':
      // Geometric blade octagon — sharp facets
      return 'M100,30 L145,55 L170,100 L145,145 L100,170 L55,145 L30,100 L55,55 Z M100,55 L130,72 L148,100 L130,128 L100,145 L70,128 L52,100 L70,72 Z M100,75 L100,125 M75,100 L125,100';
    case 'Water':
      // Flowing wave seal — concentric ripples
      return 'M40,100 Q70,70 100,100 Q130,130 160,100 M30,100 Q65,60 100,100 Q135,140 170,100 M50,100 Q75,80 100,100 Q125,120 150,100 M100,50 Q110,75 100,100 Q90,125 100,150';
    default:
      // Default: simple circle cross
      return 'M100,30 L100,170 M30,100 L170,100 M100,100 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0';
  }
}

export const ElementSigil: React.FC<Props> = ({ element, severity }) => {
  const activated = severity > ACTIVATION_THRESHOLD;
  const color = ELEMENT_COLORS[element] || '#94a3b8';
  const scale = activated ? 1 + (severity - ACTIVATION_THRESHOLD) * 0.9 : 0.8;

  return (
    <div
      className={`element-sigil${activated ? ' sigil-activation' : ''}`}
      style={{
        '--sigil-scale': scale,
        '--sigil-color': color,
      } as React.CSSProperties}
    >
      <svg viewBox="0 0 200 200" width="180" height="180">
        <defs>
          <filter id="sigil-glow">
            <feGaussianBlur stdDeviation={activated ? 4 : 2} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={sigilPath(element)}
          fill="none"
          stroke={color}
          strokeWidth={activated ? 1.5 : 0.8}
          strokeOpacity={activated ? 0.7 : 0.15}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#sigil-glow)"
        />
      </svg>
    </div>
  );
};
