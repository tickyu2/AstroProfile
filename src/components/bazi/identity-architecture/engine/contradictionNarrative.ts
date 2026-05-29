/**
 * Contradiction Narrative — synthesizes tension data into a readable story
 */

import type { IdentityTension } from './identityTypes';

export function buildNarrative(
  tension: IdentityTension,
  alignmentScore: number,
  coherenceIndex: number,
): string {
  const lines: string[] = [];

  lines.push(
    `Your inner architecture shows an alignment score of ${alignmentScore}/12 and an internal coherence of ${coherenceIndex}%.`
  );

  if (coherenceIndex >= 80) {
    lines.push(
      'You are largely internally consistent \u2014 the tensions that do exist are meaningful growth edges rather than fractures.'
    );
  } else if (coherenceIndex >= 60) {
    lines.push(
      'You hold a mix of coherence and contradiction, which can feel like living between multiple versions of yourself.'
    );
  } else if (coherenceIndex >= 40) {
    lines.push(
      'Your identity is built from strongly contrasting parts, which can feel confusing but also deeply creative.'
    );
  } else {
    lines.push(
      'Your inner world contains significant oppositions \u2014 the architecture of someone who holds paradox and lives at the intersection of competing forces.'
    );
  }

  if (tension.elementalConflicts.length) {
    lines.push('\nAt the core level, your elements sometimes argue:');
    for (const c of tension.elementalConflicts) lines.push(`\u2022 ${c.text}`);
  }

  if (tension.roleConflicts.length) {
    lines.push('\nAcross life roles, you show up differently:');
    for (const c of tension.roleConflicts) lines.push(`\u2022 ${c.text}`);
  }

  if (tension.subconsciousConflicts.length) {
    lines.push('\nBeneath the surface, your conscious and subconscious layers disagree:');
    for (const c of tension.subconsciousConflicts) lines.push(`\u2022 ${c.text}`);
  }

  return lines.join('\n');
}
