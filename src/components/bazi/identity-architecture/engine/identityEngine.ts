/**
 * Identity Engine — main builder that assembles the full IdentityArchitecture
 */

import type { AlignmentData } from '../../../../utils/baziWheels';
import type { BaZiPillar, IdentityArchitecture } from './identityTypes';
import { computeAlignmentScore } from './alignmentScoring';
import { computeCoherenceIndex } from './coherenceIndex';
import { describeHeaven, describeEarth, describeHuman } from './personalityExtractors';
import { computeTension, computeTensionSeverity } from './tensionEngine';
import { buildNarrative } from './contradictionNarrative';

export function buildIdentityArchitecture(
  pillars: BaZiPillar[],
  alignments: AlignmentData[],
): IdentityArchitecture {
  const heavenPersonality = describeHeaven(pillars);
  const earthPersonality = describeEarth(pillars);
  const humanPersonality = describeHuman(pillars);

  const alignmentScore = computeAlignmentScore(alignments);
  const internalCoherenceIndex = computeCoherenceIndex(alignments);

  const identityTension = computeTension(pillars, alignments);
  const tensionSeverity = computeTensionSeverity(identityTension);
  const contradictionNarrative = buildNarrative(
    identityTension,
    alignmentScore,
    internalCoherenceIndex,
  );

  return {
    heavenPersonality,
    earthPersonality,
    humanPersonality,
    alignmentScore,
    internalCoherenceIndex,
    identityTension,
    tensionSeverity,
    contradictionNarrative,
    pillarAlignments: alignments,
  };
}
