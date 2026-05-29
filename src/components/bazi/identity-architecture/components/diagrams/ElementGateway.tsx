/**
 * ElementGateway — pillar-triggered portal animation
 *
 * When a pillar is selected in Temple Mode, a gateway opens behind it:
 *   Wood  → expanding spiral rings
 *   Fire  → radiating flame rays
 *   Earth → rotating square mandala
 *   Metal → crystalline octagon expansion
 *   Water → concentric ripple circles
 *
 * The gateway expands, glows, rotates, then dissolves over 2.8s.
 * Pure inline SVG — no external image files.
 */

import React, { useState, useEffect, useRef } from 'react';
import { ELEMENT_COLORS } from '../../utils/elementTheme';

interface Props {
  element: string;
  /** Gateway triggers when this changes to a new truthy value */
  active: boolean;
  pillarName: string | null;
}

interface GatewayInstance {
  id: number;
  element: string;
}

/** SVG path data for each element's gateway portal */
function gatewayPaths(element: string): string[] {
  switch (element) {
    case 'Wood':
      // Expanding spiral rings
      return [
        'M100,100 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0',
        'M100,100 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0',
        'M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0',
        'M60,60 Q80,40 100,60 Q120,80 140,60',
        'M60,140 Q80,160 100,140 Q120,120 140,140',
      ];
    case 'Fire':
      // Radiating flame rays from center
      return [
        'M100,100 L100,20', 'M100,100 L170,45', 'M100,100 L180,100',
        'M100,100 L170,155', 'M100,100 L100,180', 'M100,100 L30,155',
        'M100,100 L20,100', 'M100,100 L30,45',
        'M100,100 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0',
      ];
    case 'Earth':
      // Rotating nested squares — mandala pattern
      return [
        'M50,50 L150,50 L150,150 L50,150 Z',
        'M100,30 L170,100 L100,170 L30,100 Z',
        'M70,70 L130,70 L130,130 L70,130 Z',
        'M100,55 L145,100 L100,145 L55,100 Z',
      ];
    case 'Metal':
      // Crystalline octagon expanding
      return [
        'M100,40 L140,60 L160,100 L140,140 L100,160 L60,140 L40,100 L60,60 Z',
        'M100,60 L128,72 L140,100 L128,128 L100,140 L72,128 L60,100 L72,72 Z',
        'M100,25 L148,50 L175,100 L148,150 L100,175 L52,150 L25,100 L52,50 Z',
        'M100,100 L100,25', 'M100,100 L175,100', 'M100,100 L100,175', 'M100,100 L25,100',
      ];
    case 'Water':
      // Concentric ripple circles
      return [
        'M100,100 m-20,0 a20,20 0 1,1 40,0 a20,20 0 1,1 -40,0',
        'M100,100 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0',
        'M100,100 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0',
        'M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0',
        'M40,90 Q70,75 100,90 Q130,105 160,90',
        'M40,110 Q70,125 100,110 Q130,95 160,110',
      ];
    default:
      return ['M100,100 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0'];
  }
}

export const ElementGateway: React.FC<Props> = ({ element, active, pillarName }) => {
  const [gateways, setGateways] = useState<GatewayInstance[]>([]);
  const idRef = useRef(0);
  const prevPillarRef = useRef<string | null>(null);

  useEffect(() => {
    if (active && pillarName && pillarName !== prevPillarRef.current) {
      const gw: GatewayInstance = { id: idRef.current++, element };
      setGateways(prev => [...prev.slice(-2), gw]); // keep max 3

      const timer = setTimeout(() => {
        setGateways(prev => prev.filter(g => g.id !== gw.id));
      }, 2800);

      prevPillarRef.current = pillarName;
      return () => clearTimeout(timer);
    }
    if (!active || !pillarName) {
      prevPillarRef.current = null;
    }
  }, [active, pillarName, element]);

  if (gateways.length === 0) return null;

  return (
    <>
      {gateways.map(gw => {
        const color = ELEMENT_COLORS[gw.element] || '#94a3b8';
        const paths = gatewayPaths(gw.element);

        return (
          <div key={gw.id} className="element-gateway">
            <svg viewBox="0 0 200 200" width="240" height="240">
              <defs>
                <filter id={`gateway-glow-${gw.id}`}>
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.2}
                  strokeOpacity={0.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#gateway-glow-${gw.id})`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </svg>
          </div>
        );
      })}
    </>
  );
};
