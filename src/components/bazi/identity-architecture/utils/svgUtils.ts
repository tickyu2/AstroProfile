/**
 * SVG Utilities — polar coordinate math for cathedral rings
 */

/** Convert degrees to radians, with 0deg = 12 o'clock (top). */
export function toRad(deg: number): number {
  return ((deg - 90) * Math.PI) / 180;
}

/** Get (x, y) on a circle at a given angle. */
export function polarToXY(
  cx: number, cy: number, r: number, angleDeg: number,
): { x: number; y: number } {
  const rad = toRad(angleDeg);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Standard pillar angles at 12, 3, 6, 9 o'clock positions */
export const PILLAR_ANGLES = [0, 90, 180, 270] as const;
