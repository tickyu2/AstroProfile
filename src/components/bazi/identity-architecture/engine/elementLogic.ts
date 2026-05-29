/**
 * Element Logic — Five Element relationship helpers
 */

export const SHENG_PRODUCES: Record<string, string> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
};

export const KE_CONTROLS: Record<string, string> = {
  Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
};

export function isSame(a: string, b: string): boolean {
  return a === b;
}

export function isHarmonious(a: string, b: string): boolean {
  return SHENG_PRODUCES[a] === b || SHENG_PRODUCES[b] === a;
}

export function isControlling(a: string, b: string): boolean {
  return KE_CONTROLS[a] === b || KE_CONTROLS[b] === a;
}
