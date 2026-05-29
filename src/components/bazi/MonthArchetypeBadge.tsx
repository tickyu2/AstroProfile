/**
 * MonthArchetypeBadge — Compact badge showing archetype + stability for a month.
 * Designed to sit in the MonthCard header.
 *
 * Created: March 2026
 */

import React from 'react';
import type { QiMonthSnapshot, QiDist } from '../../utils/qiEngine';
import { computeStabilityIndex } from '../../utils/stabilityIndex';

const STABILITY_COLORS: Record<string, string> = {
  stable: '#4ade80',
  moderate: '#facc15',
  volatile: '#f97316',
  extreme: '#ef4444',
};

interface Props {
  snapshot: QiMonthSnapshot;
  natalQi: QiDist;
}

export default function MonthArchetypeBadge({ snapshot, natalQi }: Props) {
  const stability = computeStabilityIndex(natalQi, snapshot);

  const mode = snapshot.collapseInfo?.mode || 'none';
  const fqi = snapshot.functionalQi;
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
  let dominant = elements[0];
  let bestVal = -1;
  for (const el of elements) {
    if (fqi[el] > bestVal) { bestVal = fqi[el]; dominant = el; }
  }

  // Simplified archetype label based on collapse + dominant
  let archetypeLabel = '';
  if (mode === 'drained') archetypeLabel = 'Desert';
  else if (mode === 'inverted') archetypeLabel = 'Loom';
  else if (mode === 'bi-polar' && (stability.category === 'volatile' || stability.category === 'extreme')) archetypeLabel = 'Crucible';
  else if (mode === 'bi-polar') archetypeLabel = 'Mirror';
  else if (mode === 'single-dominant' && dominant === 'Fire') archetypeLabel = 'Forge';
  else if (mode === 'single-dominant' && dominant === 'Water') archetypeLabel = 'Flood';
  else if (mode === 'single-dominant' && dominant === 'Earth') archetypeLabel = 'Mountain';
  else if (mode === 'single-dominant' && dominant === 'Metal') archetypeLabel = 'Anvil';
  else if (mode === 'single-dominant') archetypeLabel = 'Garden';
  else if (stability.category === 'volatile' || stability.category === 'extreme') archetypeLabel = 'Storm';
  else if (dominant === 'Fire') archetypeLabel = 'Hearth';
  else if (dominant === 'Water') archetypeLabel = 'River';
  else if (dominant === 'Earth') archetypeLabel = 'Mountain';
  else if (dominant === 'Metal') archetypeLabel = 'Anvil';
  else archetypeLabel = 'Garden';

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300"
      >
        {archetypeLabel}
      </span>
      <span
        className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
        style={{
          backgroundColor: STABILITY_COLORS[stability.category] + '20',
          color: STABILITY_COLORS[stability.category],
        }}
      >
        {stability.index}
      </span>
    </div>
  );
}
