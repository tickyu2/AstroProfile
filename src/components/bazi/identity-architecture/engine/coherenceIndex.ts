/**
 * Coherence Index — measures internal consistency (0-100)
 *
 * Compares Heaven-Earth-Human element pairs within each pillar.
 */

import type { AlignmentData } from '../../../../utils/baziWheels';
import { isSame, isHarmonious } from './elementLogic';

function coherenceForPillar(a: AlignmentData): number {
  const pairs: [string, string][] = [
    [a.heaven, a.earth],
    [a.earth, a.human],
    [a.heaven, a.human],
  ];
  let score = 0;
  for (const [x, y] of pairs) {
    if (isSame(x, y)) score += 2;
    else if (isHarmonious(x, y)) score += 1;
  }
  return score; // 0-6
}

export function computeCoherenceIndex(alignments: AlignmentData[]): number {
  const total = alignments.reduce((sum, a) => sum + coherenceForPillar(a), 0);
  const max = alignments.length * 6;
  return Math.round((total / max) * 100);
}
