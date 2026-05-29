/**
 * RitualGestureLayer — transparent pointer-capture overlay
 *
 * Covers the temple and captures mouse/touch gestures.
 * Passes detected gestures up to the parent via onGesture callback.
 */

import React from 'react';

interface Props {
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
  };
}

export const RitualGestureLayer: React.FC<Props> = ({ handlers }) => (
  <div
    className="ritual-gesture-layer"
    onPointerDown={handlers.onPointerDown}
    onPointerMove={handlers.onPointerMove}
    onPointerUp={handlers.onPointerUp}
  />
);
