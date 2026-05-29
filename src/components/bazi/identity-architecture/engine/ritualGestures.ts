/**
 * Ritual Gestures — mouse/touch pattern detection
 *
 * Detects ceremonial gestures drawn on the Temple Mode canvas:
 *   - circle    → activate/intensify Temple aura
 *   - swipe-up  → intensify fog
 *   - swipe-down → calm fog
 *   - z-gesture → trigger lightning burst
 */

export type GestureType = 'circle' | 'swipe-up' | 'swipe-down' | 'z-gesture' | null;

interface Point {
  x: number;
  y: number;
}

/** Minimum number of points needed for a valid gesture */
const MIN_POINTS = 12;

/** Detect gesture from a sequence of pointer positions */
export function detectGesture(points: Point[]): GestureType {
  if (points.length < MIN_POINTS) return null;

  const first = points[0];
  const last = points[points.length - 1];
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // Swipe up: large upward movement, relatively narrow horizontal
  if (dy < -80 && absDx < 60) return 'swipe-up';

  // Swipe down: large downward movement
  if (dy > 80 && absDx < 60) return 'swipe-down';

  // Circle: bounding box is roughly square and large, and end is near start
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const bbWidth = Math.max(...xs) - Math.min(...xs);
  const bbHeight = Math.max(...ys) - Math.min(...ys);
  const distStartEnd = Math.sqrt(dx * dx + dy * dy);

  if (
    bbWidth > 80 && bbHeight > 80 &&
    distStartEnd < Math.max(bbWidth, bbHeight) * 0.5
  ) {
    return 'circle';
  }

  // Z-gesture: significant rightward + downward movement
  if (dx > 80 && dy > 40 && points.length > 15) return 'z-gesture';

  return null;
}
