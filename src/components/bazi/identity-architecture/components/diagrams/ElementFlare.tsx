/**
 * ElementFlare — CSS-only momentary elemental burst
 *
 * Triggered by pillar clicks, gestures, or storm spikes.
 * Each element has a unique color + gradient pattern:
 *   Fire  → radial orange/red ember burst
 *   Water → concentric blue ripple ring
 *   Wood  → green petal swirl
 *   Metal → white/silver spark scatter
 *   Earth → amber dust pulse
 *
 * Renders as a pure CSS radial gradient with burst animation.
 * Auto-removes after animation completes (1.2s).
 */

import React, { useState, useEffect, useRef } from 'react';
import { ELEMENT_COLORS } from '../../utils/elementTheme';

interface Props {
  element: string;
  /** Flare triggers when this value changes to a truthy string */
  trigger: string | null;
}

interface FlareInstance {
  id: number;
  element: string;
}

function flareGradient(element: string): string {
  const color = ELEMENT_COLORS[element] || '#94a3b8';
  switch (element) {
    case 'Fire':
      return `radial-gradient(circle, ${color}88 0%, ${color}44 30%, transparent 70%)`;
    case 'Water':
      return `radial-gradient(circle, transparent 20%, ${color}44 40%, transparent 50%, ${color}22 60%, transparent 70%)`;
    case 'Wood':
      return `radial-gradient(circle, ${color}66 0%, ${color}33 40%, transparent 65%)`;
    case 'Metal':
      return `radial-gradient(circle, #fff8 0%, ${color}44 25%, transparent 55%)`;
    case 'Earth':
      return `radial-gradient(circle, ${color}55 0%, ${color}22 45%, transparent 70%)`;
    default:
      return `radial-gradient(circle, ${color}44 0%, transparent 60%)`;
  }
}

export const ElementFlare: React.FC<Props> = ({ element, trigger }) => {
  const [flares, setFlares] = useState<FlareInstance[]>([]);
  const idRef = useRef(0);
  const prevTriggerRef = useRef<string | null>(null);

  // Spawn a flare when trigger changes to a new truthy value
  useEffect(() => {
    if (trigger && trigger !== prevTriggerRef.current) {
      const newFlare: FlareInstance = { id: idRef.current++, element };
      setFlares(prev => [...prev.slice(-3), newFlare]); // keep max 4

      // Auto-remove after animation (1.2s)
      const timer = setTimeout(() => {
        setFlares(prev => prev.filter(f => f.id !== newFlare.id));
      }, 1200);

      prevTriggerRef.current = trigger;
      return () => clearTimeout(timer);
    }
    if (!trigger) {
      prevTriggerRef.current = null;
    }
  }, [trigger, element]);

  if (flares.length === 0) return null;

  return (
    <>
      {flares.map(f => (
        <div
          key={f.id}
          className="element-flare"
          style={{ background: flareGradient(f.element) }}
        />
      ))}
    </>
  );
};
