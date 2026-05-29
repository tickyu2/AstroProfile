/**
 * useDepthParallax — multi-layer mouse-tracking parallax
 *
 * Three depth layers move at different speeds as the user moves their mouse,
 * creating a cathedral-scale depth illusion in Temple Mode.
 *
 *   Background → slow drift  (10px)
 *   Midground  → medium drift (20px)
 *   Foreground → fast drift  (35px)
 *
 * GPU-friendly: uses CSS transform (composite-only, no layout/paint).
 */

import { useEffect, type RefObject } from 'react';

interface ParallaxRefs {
  bg?: RefObject<HTMLDivElement | null>;
  mg?: RefObject<HTMLDivElement | null>;
  fg?: RefObject<HTMLDivElement | null>;
}

export function useDepthParallax(refs: ParallaxRefs, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    function onMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      if (refs.bg?.current) {
        refs.bg.current.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
      }
      if (refs.mg?.current) {
        refs.mg.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      }
      if (refs.fg?.current) {
        refs.fg.current.style.transform = `translate(${x * 35}px, ${y * 35}px)`;
      }
    }

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [refs, enabled]);
}
