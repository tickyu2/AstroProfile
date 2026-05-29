/**
 * useRitualGesture — mouse/touch gesture tracking
 *
 * Tracks pointer movement and detects ritual gestures (circle, swipe, z-shape).
 * Returns the last detected gesture and a ref to attach to the capture element.
 */

import { useRef, useCallback, useState, useEffect } from 'react';
import { detectGesture, type GestureType } from '../engine/ritualGestures';

interface Point {
  x: number;
  y: number;
}

interface RitualGestureResult {
  gesture: GestureType;
  /** Call this to clear the gesture after handling it */
  clearGesture: () => void;
  /** Pointer event handlers to spread on the gesture capture element */
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
  };
}

export function useRitualGesture(): RitualGestureResult {
  const pointsRef = useRef<Point[]>([]);
  const trackingRef = useRef(false);
  const [gesture, setGesture] = useState<GestureType>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointsRef.current = [{ x: e.clientX, y: e.clientY }];
    trackingRef.current = true;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!trackingRef.current) return;
    pointsRef.current.push({ x: e.clientX, y: e.clientY });
  }, []);

  const onPointerUp = useCallback(() => {
    if (!trackingRef.current) return;
    trackingRef.current = false;
    const detected = detectGesture(pointsRef.current);
    if (detected) {
      setGesture(detected);
    }
    pointsRef.current = [];
  }, []);

  const clearGesture = useCallback(() => setGesture(null), []);

  // Auto-clear gesture after 3 seconds
  useEffect(() => {
    if (!gesture) return;
    const timer = setTimeout(() => setGesture(null), 3000);
    return () => clearTimeout(timer);
  }, [gesture]);

  return {
    gesture,
    clearGesture,
    handlers: { onPointerDown, onPointerMove, onPointerUp },
  };
}
