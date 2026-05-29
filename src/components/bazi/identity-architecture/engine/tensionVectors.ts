/**
 * Tension Vectors — computes directional pull per pillar
 *
 * Each pillar has a "vector" representing which direction its internal
 * elemental tension pulls toward. Used by D3TensionField to draw arrows.
 */

import { HIDDEN_STEMS } from '../../../../utils/baziWheels';
import type { BaZiPillar } from './identityTypes';
import { isControlling, isHarmonious } from './elementLogic';

export interface TensionVector {
  role: string;
  pillarIdx: number;
  angleDeg: number;   // direction of pull (0-360)
  magnitude: number;  // 0-1 severity
  element: string;    // heaven element (for coloring)
}

/** Map each element to a compass angle (Wu Xing directional mapping) */
function elementAngle(el: string): number {
  switch (el) {
    case 'Wood':  return 90;   // East
    case 'Fire':  return 0;    // South
    case 'Earth': return 180;  // Center → mapped to West for spread
    case 'Metal': return 270;  // West
    case 'Water': return 225;  // North-West
    default:      return 0;
  }
}

/**
 * Compute a tension vector per pillar.
 * The angle is the average pull direction of Heaven, Earth, and dominant Hidden Stem.
 * The magnitude reflects how conflicted those three layers are.
 */
export function computeTensionVectors(pillars: BaZiPillar[]): TensionVector[] {
  return pillars.map((p, i) => {
    const h = p.stem.element;
    const e = p.branch.element;
    const hs = HIDDEN_STEMS[p.branch.index];
    const domHidden = hs && hs.length > 0 ? hs[0].element : h;

    // Average directional angle from all three layers
    const angles = [elementAngle(h), elementAngle(e), elementAngle(domHidden)];
    const avgAngle = angles.reduce((a, b) => a + b, 0) / angles.length;

    // Magnitude = how conflicted this pillar's layers are
    let mag = 0;
    if (isControlling(h, e)) mag += 0.4;
    else if (h !== e && !isHarmonious(h, e)) mag += 0.25;
    if (isControlling(h, domHidden)) mag += 0.35;
    else if (h !== domHidden && !isHarmonious(h, domHidden)) mag += 0.2;

    return {
      role: p.name,
      pillarIdx: i,
      angleDeg: avgAngle,
      magnitude: Math.min(mag, 1),
      element: h,
    };
  });
}
