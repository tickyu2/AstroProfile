/**
 * Tension Engine — detects elemental, role, and subconscious conflicts
 *
 * Returns enriched TensionItems with source/target pillar indices
 * and severity ratings for interactive diagram highlighting.
 */

import { HIDDEN_STEMS } from '../../../../utils/baziWheels';
import type { AlignmentData } from '../../../../utils/baziWheels';
import { isSame, isHarmonious, isControlling } from './elementLogic';
import type { BaZiPillar, IdentityTension, TensionItem } from './identityTypes';

const ROLE_LABELS: Record<string, string> = {
  Year: 'public self',
  Month: 'work self',
  Day: 'true self',
  Hour: 'future self',
};

export function computeTension(
  pillars: BaZiPillar[],
  _alignments: AlignmentData[],
): IdentityTension {
  const tension: IdentityTension = {
    elementalConflicts: [],
    roleConflicts: [],
    subconsciousConflicts: [],
  };

  const dayIdx = pillars.findIndex(p => p.name === 'Day');
  if (dayIdx < 0) return tension;

  const dayHeaven = pillars[dayIdx].stem.element;
  const dayEarth = pillars[dayIdx].branch.element;

  // A. Core Day Heaven vs Earth
  if (isControlling(dayHeaven, dayEarth)) {
    tension.elementalConflicts.push({
      text: `Your core mindset (${dayHeaven}) and core instincts (${dayEarth}) often try to control each other, creating inner push\u2013pull.`,
      sourcePillar: dayIdx,
      targetPillar: dayIdx,
      severity: 3,
      category: 'elemental',
    });
  } else if (!isSame(dayHeaven, dayEarth) && !isHarmonious(dayHeaven, dayEarth)) {
    tension.elementalConflicts.push({
      text: `Your core mindset (${dayHeaven}) and core instincts (${dayEarth}) speak different languages, so you may feel torn between what you think and what you do.`,
      sourcePillar: dayIdx,
      targetPillar: dayIdx,
      severity: 2,
      category: 'elemental',
    });
  }

  // B. Role conflicts: compare each pillar's heaven to Day's heaven
  for (let i = 0; i < pillars.length; i++) {
    if (i === dayIdx) continue;
    const role = pillars[i].name;
    const el = pillars[i].stem.element;
    if (isControlling(el, dayHeaven)) {
      tension.roleConflicts.push({
        text: `Strong tension between your ${ROLE_LABELS[role] || role} and true self: ${el} clashes with ${dayHeaven} at your core.`,
        sourcePillar: i,
        targetPillar: dayIdx,
        severity: 3,
        category: 'role',
      });
    } else if (!isSame(el, dayHeaven) && !isHarmonious(el, dayHeaven)) {
      tension.roleConflicts.push({
        text: `Tension between your ${ROLE_LABELS[role] || role} and true self: ${el} mindset there vs ${dayHeaven} at your core.`,
        sourcePillar: i,
        targetPillar: dayIdx,
        severity: 2,
        category: 'role',
      });
    }
  }

  // C. Subconscious: dominant hidden stem vs heaven stem per pillar
  for (let i = 0; i < pillars.length; i++) {
    const hs = HIDDEN_STEMS[pillars[i].branch.index];
    if (!hs || hs.length === 0) continue;
    const domHidden = hs[0].element;
    const heaven = pillars[i].stem.element;
    if (isControlling(domHidden, heaven)) {
      tension.subconsciousConflicts.push({
        text: `In your ${pillars[i].name.toLowerCase()} pillar, your subconscious (${domHidden}) actively clashes with your conscious mindset (${heaven}).`,
        sourcePillar: i,
        targetPillar: i,
        severity: 3,
        category: 'subconscious',
      });
    } else if (!isSame(domHidden, heaven) && !isHarmonious(domHidden, heaven)) {
      tension.subconsciousConflicts.push({
        text: `In your ${pillars[i].name.toLowerCase()} pillar, your subconscious (${domHidden}) and conscious mindset (${heaven}) pull in different directions.`,
        sourcePillar: i,
        targetPillar: i,
        severity: 2,
        category: 'subconscious',
      });
    }
  }

  return tension;
}

/**
 * Compute a single 0-1 severity metric from the tension structure.
 * Weights: elemental conflicts (core) = 3, role = 2, subconscious = 1.
 * Used to drive D3 animation intensity — pulse speed, glow, rotation.
 */
export function computeTensionSeverity(tension: IdentityTension): number {
  let score = 0;
  for (const t of tension.elementalConflicts) score += t.severity;
  for (const t of tension.roleConflicts) score += t.severity * 0.7;
  for (const t of tension.subconsciousConflicts) score += t.severity * 0.4;

  // Normalize: max realistic score ~18 (3 elemental×3 + 3 role×3×0.7 + 4 sub×3×0.4)
  return Math.min(score / 18, 1);
}
