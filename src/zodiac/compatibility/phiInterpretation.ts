/**
 * phiInterpretation.ts
 *
 * Human-readable interpretation text for each cell in the 3x3 phi-Blend matrix.
 * Takes the same inputs already computed per cell and assembles a 3-sentence
 * paragraph describing the lens meaning, aspect dynamic, and harmony score.
 *
 * GENESIS AstroProfile - January 2026
 */

import { getAngleLesson, type AngleKey } from '../angles';
import { formatBlendPercent, type SignBlend } from '../cusp/phiCurve';
import type { SignKey } from '../tropicalMap';
import { getElement, getModality } from './signMeta';
import { elementLabel, modalityLabel, getSeasonalPhase, seasonalLabel, SEASONAL_PHASE_DISPLAY } from './elementModality';

// =============================================================================
// TYPES
// =============================================================================

type Lens = 'Sun' | 'Moon' | 'Rising' | 'Venus' | 'Mars' | 'Mercury'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

// =============================================================================
// LENS MEANING (from->to pair descriptions)
// =============================================================================

const LENS_MEANINGS: Record<string, string> = {
  'Sun-Sun':     'how your core identities interact',
  'Sun-Moon':    'how your identity affects their emotional world',
  'Sun-Rising':  'how your identity meets their social style',
  'Moon-Sun':    'how your emotional needs respond to their identity',
  'Moon-Moon':   'how your emotional rhythms align',
  'Moon-Rising': 'how your emotional style meets their outward behavior',
  'Rising-Sun':  'how your social style receives their identity',
  'Rising-Moon': 'how your social style interacts with their emotional needs',
  'Rising-Rising': 'how your outward behaviors mesh',
  // Mercury/Mars (Communication & Action)
  'Mercury-Mercury': 'how your communication styles and thinking patterns align',
  'Mercury-Mars':    'how your words and thinking meet their drive and assertion',
  'Mars-Mercury':    'how your assertive energy responds to their communication style',
  // Venus/Mars (Chemistry & Desire)
  'Venus-Venus': 'how your love languages harmonize',
  'Venus-Mars':  'how your affection meets their desire',
  'Mars-Venus':  'how your desire meets their affection style',
  'Mars-Mars':   'how your drives and ambitions interact',
  // Jupiter/Saturn (Growth & Structure)
  'Jupiter-Jupiter': 'how your shared beliefs and optimism align',
  'Jupiter-Saturn':  'how your expansion meets their structure',
  'Saturn-Jupiter':  'how your discipline responds to their growth',
  'Saturn-Saturn':   'how your shared commitments and lessons align',
  // Uranus/Neptune/Pluto (Transformation)
  'Uranus-Uranus':   'how your revolutionary instincts resonate',
  'Uranus-Neptune':  'how your awakening meets their dreams',
  'Uranus-Pluto':    'how your disruption meets their transformation',
  'Neptune-Uranus':  'how your idealism responds to their revolution',
  'Neptune-Neptune': 'how your shared spiritual visions align',
  'Neptune-Pluto':   'how your spirituality meets their primal force',
  'Pluto-Uranus':    'how your transformation responds to their disruption',
  'Pluto-Neptune':   'how your depth meets their transcendence',
  'Pluto-Pluto':     'how your shared transformative forces interact',
};

export function lensMeaning(from: Lens, to: Lens): string {
  return LENS_MEANINGS[`${from}-${to}`] ?? 'how these layers interact';
}

// =============================================================================
// ASPECT MEANING (uses existing AngleLesson.relationshipHint)
// =============================================================================

export function aspectMeaning(angleKey: AngleKey): string {
  try {
    const lesson = getAngleLesson(angleKey);
    return lesson.relationshipHint;
  } catch {
    return 'These signs share a unique energetic connection.';
  }
}

// =============================================================================
// DESCRIBE BLEND (human-readable cusp description)
// =============================================================================

export function describeBlend(blend: SignBlend[]): string {
  if (!blend.length) return 'unknown';
  const sorted = [...blend].sort((a, b) => b.weight - a.weight);
  const primary = sorted[0];

  if (primary.weight >= 0.95 || sorted.length === 1) {
    return `${primary.sign} (pure)`;
  }

  return sorted
    .filter(b => formatBlendPercent(b.weight) >= 1)
    .map(b => `${b.sign} ${formatBlendPercent(b.weight)}%`)
    .join(', ');
}

// =============================================================================
// INTERPRET CELL (assembles 3-sentence paragraph)
// =============================================================================

export function interpretCell(
  fromLens: Lens,
  toLens: Lens,
  fromBlend: SignBlend[],
  toBlend: SignBlend[],
  angleKey: AngleKey,
  score10: number,
): string {
  const meaning = lensMeaning(fromLens, toLens);

  let angleName: string;
  let angleDegrees: number;
  let angleVibe: string;
  try {
    const lesson = getAngleLesson(angleKey);
    angleName = lesson.name;
    angleDegrees = lesson.degrees;
    angleVibe = lesson.vibe.toLowerCase();
  } catch {
    angleName = 'Aspect';
    angleDegrees = 0;
    angleVibe = 'connection';
  }

  const fromDesc = describeBlend(fromBlend);
  const toDesc = describeBlend(toBlend);

  // Derive element + modality for dominant signs
  const domFrom = [...fromBlend].sort((a, b) => b.weight - a.weight)[0];
  const domTo = [...toBlend].sort((a, b) => b.weight - a.weight)[0];
  const elA = getElement(domFrom.sign as any);
  const elB = getElement(domTo.sign as any);
  const modA = getModality(domFrom.sign as any);
  const modB = getModality(domTo.sign as any);

  const elDesc = elA === elB
    ? `shared ${elA} element (${elementLabel(domFrom.sign as SignKey, domTo.sign as SignKey)})`
    : `${elA}\u2013${elB} elements (${elementLabel(domFrom.sign as SignKey, domTo.sign as SignKey)})`;

  const modDesc = modA === modB
    ? `shared ${modA} modality (${modalityLabel(domFrom.sign as SignKey, domTo.sign as SignKey)})`
    : `${modA}\u2013${modB} modality (${modalityLabel(domFrom.sign as SignKey, domTo.sign as SignKey)})`;

  const phaseA = getSeasonalPhase(domFrom.sign as SignKey);
  const phaseB = getSeasonalPhase(domTo.sign as SignKey);
  const seasDesc = phaseA === phaseB
    ? `shared ${SEASONAL_PHASE_DISPLAY[phaseA]} phase (${seasonalLabel(domFrom.sign as SignKey, domTo.sign as SignKey)})`
    : `${SEASONAL_PHASE_DISPLAY[phaseA]}\u2013${SEASONAL_PHASE_DISPLAY[phaseB]} phases (${seasonalLabel(domFrom.sign as SignKey, domTo.sign as SignKey)})`;

  const s1 = `This cell describes ${meaning}.`;
  const s2 = `Your ${fromLens} (${fromDesc}) meets their ${toLens} (${toDesc}) through ${angleName} (${angleDegrees}\u00B0) \u2014 ${angleVibe} \u2014 with ${elDesc}, ${modDesc}, and ${seasDesc}.`;
  const s3 = `The 4-layer harmony score is ${score10.toFixed(1)}/10.`;

  return `${s1} ${s2} ${s3}`;
}
