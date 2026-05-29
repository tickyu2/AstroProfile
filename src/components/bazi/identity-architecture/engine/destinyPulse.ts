/**
 * Destiny Pulse — Day Master heartbeat engine
 *
 * Maps the Day Master element to a rhythmic BPM, computes
 * amplitude from severity, and provides hue for color-shift pulsing.
 */

import type { BaZiPillar } from './identityTypes';

/** Extract the Day Master element from pillars */
export function getDayMasterElement(pillars: BaZiPillar[]): string {
  const day = pillars.find(p => p.name === 'Day');
  return day ? day.stem.element : 'Water';
}

/** Each element has a natural tempo — Fire is urgent, Water is calm */
export function destinyBeatFromElement(el: string): number {
  switch (el) {
    case 'Fire':  return 120;  // rapid, urgent
    case 'Wood':  return 110;  // growing, pushing
    case 'Earth': return 90;   // steady, grounded
    case 'Metal': return 80;   // precise, measured
    case 'Water': return 70;   // flowing, calm
    default:      return 90;
  }
}

/** Amplitude multiplier: 1.0 (calm) → 1.6 (intense conflict) */
export function destinyAmplitudeFromSeverity(severity: number): number {
  return 1 + severity * 0.6;
}

/** Map element to a base hue for color-shift animation */
export function hueFromElement(el: string): number {
  switch (el) {
    case 'Wood':  return 120;  // green
    case 'Fire':  return 0;    // red
    case 'Earth': return 45;   // gold
    case 'Metal': return 210;  // steel-blue
    case 'Water': return 240;  // deep blue
    default:      return 0;
  }
}

/** Synthesized Web Audio heartbeat frequency (60-80 Hz, shifts with tension) */
export function heartbeatFrequency(severity: number): number {
  return 60 + severity * 20;
}

/** Heartbeat volume (0.12 calm → 0.27 intense) */
export function heartbeatVolume(severity: number): number {
  return 0.12 + severity * 0.15;
}

/**
 * Storm Index — 0 when severity < 0.65, ramps to 1 at severity = 1.
 * Drives lightning flash frequency/intensity.
 */
export function stormIndex(severity: number): number {
  return Math.max(0, (severity - 0.65) / 0.35);
}

/** Map pillar role name to angular position (degrees, 0 = top) */
export function pillarAngle(role: string): number {
  switch (role) {
    case 'Year':  return 0;
    case 'Month': return 90;
    case 'Day':   return 180;
    case 'Hour':  return 270;
    default:      return 0;
  }
}
