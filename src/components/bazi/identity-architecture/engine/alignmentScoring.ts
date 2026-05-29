/**
 * Alignment Scoring — computes 0-12 alignment score from pillar alignments
 */

import type { AlignmentData } from '../../../../utils/baziWheels';

function scoreAlignment(a: AlignmentData): number {
  if (a.aligned) return 3;
  if (a.harmonic) return 2;
  return 1;
}

export function computeAlignmentScore(alignments: AlignmentData[]): number {
  return alignments.reduce((sum, a) => sum + scoreAlignment(a), 0);
}
