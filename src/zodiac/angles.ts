/**
 * Zodiac Angles - Khan Academy-style Lesson Data
 *
 * Teaches geometric relationships between signs one angle at a time:
 * 0° → 30° → 60° → 90° → 120° → 150° → 180°
 *
 * GENESIS AstroProfile - January 2026
 */

import { TROPICAL_ORDER, getSignIndex, getSignAtIndex, type SignKey } from './tropicalMap';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type AngleKey =
  | 'conjunction'
  | 'semi-sextile'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'quincunx'
  | 'opposition';

export type AngleNature = 'unified' | 'adjacent' | 'harmonious' | 'dynamic' | 'awkward' | 'polar';

export interface AngleLesson {
  key: AngleKey;
  degrees: number;
  steps: number;           // Signs away (clockwise)
  name: string;
  symbol: string;
  vibe: string;            // Short poetic label
  nature: AngleNature;
  color: string;
  academyMeaning: string;  // Educational explanation
  relationshipHint: string; // How it plays out in relationships
  growthOpportunity: string; // What it teaches
}

// =============================================================================
// ANGLE LESSONS DATA
// =============================================================================

export const ANGLE_LESSONS: AngleLesson[] = [
  {
    key: 'conjunction',
    degrees: 0,
    steps: 0,
    name: 'Conjunction',
    symbol: '☌',
    vibe: 'Unified Seed',
    nature: 'unified',
    color: '#fbbf24', // Amber
    academyMeaning:
      'Same sign energy: concentrated, intensified, hard to separate. Two planets or points in conjunction merge their energies into a single powerful expression.',
    relationshipHint:
      'Same-sign connections feel familiar — you "get" each other instinctively. The challenge is maintaining individuality when you\'re so similar.',
    growthOpportunity:
      'Learn to distinguish your voice from the echo. Similarity is a gift, but growth requires seeing where you differ.',
  },
  {
    key: 'semi-sextile',
    degrees: 30,
    steps: 1,
    name: 'Semi-sextile',
    symbol: '⚺',
    vibe: 'Adjacent Shift',
    nature: 'adjacent',
    color: '#94a3b8', // Slate
    academyMeaning:
      'Side-by-side signs: subtle friction + adjustment. Different elements, different modes — they share a border but speak different languages. Requires conscious bridging.',
    relationshipHint:
      'Adjacent signs often irritate each other in small ways. What feels natural to one seems odd to the other. Yet proximity creates opportunity for learning.',
    growthOpportunity:
      'Practice the art of translation. Your neighbor has wisdom you lack — but you\'ll need patience to receive it.',
  },
  {
    key: 'sextile',
    degrees: 60,
    steps: 2,
    name: 'Sextile',
    symbol: '⚹',
    vibe: 'Opportunity',
    nature: 'harmonious',
    color: '#4ade80', // Green
    academyMeaning:
      'Supportive angle: cooperation is available if you choose to use it. Sextiles connect compatible elements (Fire-Air, Earth-Water) with complementary rhythms.',
    relationshipHint:
      'Sextile connections feel easy and productive. You bring out the best in each other without trying too hard. The risk is taking each other for granted.',
    growthOpportunity:
      'Don\'t let ease become laziness. Sextiles offer potential — but potential requires action to become real.',
  },
  {
    key: 'square',
    degrees: 90,
    steps: 3,
    name: 'Square',
    symbol: '□',
    vibe: 'Turning Point',
    nature: 'dynamic',
    color: '#ef4444', // Red
    academyMeaning:
      'Friction that forces action. Squares connect signs of the same modality (Cardinal-Cardinal, Fixed-Fixed, Mutable-Mutable) but different elements — growth through pressure and creative tension.',
    relationshipHint:
      'Square connections are never boring. You challenge each other, sometimes productively, sometimes frustratingly. The friction generates heat — and heat can forge or burn.',
    growthOpportunity:
      'Resistance builds strength. The person who squares you is your unwitting trainer — they show you where you need to grow.',
  },
  {
    key: 'trine',
    degrees: 120,
    steps: 4,
    name: 'Trine',
    symbol: '△',
    vibe: 'Golden Triangle',
    nature: 'harmonious',
    color: '#60a5fa', // Blue
    academyMeaning:
      'Same element harmony: natural support and easy flow. Trines connect Fire-Fire, Earth-Earth, Air-Air, or Water-Water — a shared language, shared values, shared approach.',
    relationshipHint:
      'Trine connections feel like home. You understand each other without explanation. The shadow is complacency — things come so easily you may not push each other to grow.',
    growthOpportunity:
      'Don\'t mistake ease for completion. Your trine partner confirms your strengths — but growth often comes from discomfort, not comfort.',
  },
  {
    key: 'quincunx',
    degrees: 150,
    steps: 5,
    name: 'Quincunx',
    symbol: '⚻',
    vibe: 'Adjustment',
    nature: 'awkward',
    color: '#f59e0b', // Orange
    academyMeaning:
      'Awkward fit requiring constant adjustment. Quincunxes connect signs that share nothing — different element, different modality, different season. Like trying to connect two puzzle pieces that almost fit.',
    relationshipHint:
      'Quincunx connections feel persistently "off." You keep trying to understand each other and keep missing. Yet this very awkwardness can catalyze unexpected creativity.',
    growthOpportunity:
      'Accept that some connections require work without resolution. The quincunx teaches: not everything clicks, and that\'s okay.',
  },
  {
    key: 'opposition',
    degrees: 180,
    steps: 6,
    name: 'Opposition',
    symbol: '☍',
    vibe: 'Mirror',
    nature: 'polar',
    color: '#a855f7', // Purple
    academyMeaning:
      'Sister-sign polarity: balance self vs. other, awareness through contrast. Oppositions connect complementary pairs — each sign contains what the other lacks. They complete each other or polarize.',
    relationshipHint:
      'Opposition connections are magnetically attractive. You see in them what you\'ve denied in yourself. The relationship becomes a mirror — sometimes flattering, sometimes confronting.',
    growthOpportunity:
      'Your opposite is your teacher. What irritates you about them is often what you need to develop. Integration happens when you stop projecting.',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the angle lesson by key
 */
export function getAngleLesson(key: AngleKey): AngleLesson {
  const lesson = ANGLE_LESSONS.find(l => l.key === key);
  if (!lesson) throw new Error(`Unknown angle key: ${key}`);
  return lesson;
}

/**
 * Get angle lesson by degree
 */
export function getAngleLessonByDegree(degrees: number): AngleLesson | null {
  return ANGLE_LESSONS.find(l => l.degrees === degrees) || null;
}

/**
 * Get the target signs for a given angle from a source sign
 * Returns both clockwise and counter-clockwise targets
 */
export function getAngleTargets(
  from: SignKey,
  steps: number
): { clockwise: SignKey; counterClockwise: SignKey } {
  const fromIndex = getSignIndex(from);
  return {
    clockwise: getSignAtIndex(fromIndex + steps),
    counterClockwise: getSignAtIndex(fromIndex - steps),
  };
}

/**
 * Get all angle relationships from a source sign
 */
export function getAllAngleRelationships(from: SignKey): Array<{
  angle: AngleLesson;
  targets: { clockwise: SignKey; counterClockwise: SignKey };
}> {
  return ANGLE_LESSONS.map(angle => ({
    angle,
    targets: getAngleTargets(from, angle.steps),
  }));
}

/**
 * Determine what angle exists between two signs
 */
export function getAngleBetweenSigns(signA: SignKey, signB: SignKey): AngleLesson | null {
  const indexA = getSignIndex(signA);
  const indexB = getSignIndex(signB);
  const diff = Math.abs(indexA - indexB);
  const steps = Math.min(diff, 12 - diff); // Shortest path around wheel

  return ANGLE_LESSONS.find(l => l.steps === steps) || null;
}

/**
 * Get the nature description for an angle
 */
export function getAngleNatureDescription(nature: AngleNature): string {
  const descriptions: Record<AngleNature, string> = {
    unified: 'Merged energies, concentrated expression',
    adjacent: 'Side-by-side, requiring translation',
    harmonious: 'Flowing support, natural cooperation',
    dynamic: 'Creative tension, growth through friction',
    awkward: 'Persistent adjustment, no easy resolution',
    polar: 'Mirror opposites, complementary completion',
  };
  return descriptions[nature];
}

// =============================================================================
// TEACHING SEQUENCES
// =============================================================================

/**
 * The recommended teaching order (building complexity)
 */
export const TEACHING_SEQUENCE: AngleKey[] = [
  'conjunction',   // 0° - Start with the simplest: same sign
  'opposition',    // 180° - Then the clearest contrast: opposite sign
  'trine',         // 120° - Same element harmony
  'square',        // 90° - Same modality tension
  'sextile',       // 60° - Compatible element support
  'semi-sextile',  // 30° - Adjacent signs
  'quincunx',      // 150° - The awkward fit
];

/**
 * Get lessons in teaching order
 */
export function getLessonsInTeachingOrder(): AngleLesson[] {
  return TEACHING_SEQUENCE.map(key => getAngleLesson(key));
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ANGLE_LESSONS;
