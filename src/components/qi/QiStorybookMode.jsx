/**
 * QiStorybookMode — Mythic narrative mode that explains each month
 * like a chapter in a chronicle. Turns raw Qi math into poetic,
 * educational storytelling.
 */
import React from 'react';
import { ELEMENTS, ELEM_COLORS, GENERATES, CONTROLS } from './elemConstants';

const ELEMENT_REALM = {
  Wood: 'the Forest of Growth',
  Fire: 'the Forge of Illumination',
  Earth: 'the Mountain of Stability',
  Metal: 'the Hall of Precision',
  Water: 'the Deep of Wisdom',
};

const ELEMENT_ARCHETYPE = {
  Wood: 'Pioneer',
  Fire: 'the Visionary',
  Earth: 'the Guardian',
  Metal: 'the Strategist',
  Water: 'the Philosopher',
};

const SEASON_MOOD = {
  Spring: 'awakening',
  Summer: 'blazing intensity',
  Autumn: 'golden harvest',
  Winter: 'deep stillness',
};

function getSecondary(sorted) {
  return sorted.length > 1 ? sorted[1] : null;
}

function getWeakest(sorted) {
  return sorted[sorted.length - 1];
}

export function QiStorybookMode({
  monthName,
  season,
  mffq,
  userTfq,
  yongShen,
  braceletRatios,
  collapseMode,
  daYunPillar,     // optional: active 大運 pillar object from qiEngine snapshot
}) {
  if (!mffq || !monthName) return null;

  const total = ELEMENTS.reduce((s, el) => s + (mffq[el] || 0), 0) || 1;
  const sorted = ELEMENTS
    .map(el => ({ el, pct: ((mffq[el] || 0) / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const dominant = sorted[0];
  const secondary = getSecondary(sorted);
  const weakest = getWeakest(sorted);
  const isCollapse = collapseMode && collapseMode !== 'none';
  const useful = yongShen?.usefulElements || [];
  const forbidden = yongShen?.forbidden || [];

  // Build narrative paragraphs
  const paragraphs = [];

  // Opening — the month's character
  paragraphs.push(
    `In ${monthName}, the realm of Qi tilts toward ${ELEMENT_REALM[dominant.el] || dominant.el}. ` +
    `${dominant.el} rises to ${dominant.pct.toFixed(1)}% of functional energy, ` +
    `casting its ${ELEMENT_ARCHETYPE[dominant.el] || ''} influence across the landscape` +
    (season ? ` — a month of ${SEASON_MOOD[season] || season.toLowerCase()}` : '') + '.'
  );

  // 大運 Decade Wind — the background force shaping this month
  if (daYunPillar) {
    const dyEl = daYunPillar.element;
    const dyRelationship = (() => {
      const dm = dominant.el;
      if (dyEl === dm) return 'amplifying its dominant nature — a decade that doubles down on this month\'s prevailing element';
      if (GENERATES[dyEl] === dm) return `feeding ${dm} from below — the decade acts as a hidden wellspring behind this month's energy`;
      if (GENERATES[dm] === dyEl) return `drawing energy upward from ${dm} — the decade quietly channels this month's surplus into its own element`;
      if (CONTROLS[dyEl] === dm) return `exerting a steadying pressure on ${dm} — the decade acts as the unseen regulator holding this month in check`;
      if (CONTROLS[dm] === dyEl) return `pressing against the decade's root — a month that challenges the background tide`;
      return 'standing in a neutral relationship — the decade and month co-exist without strong friction or synergy';
    })();
    const remaining = daYunPillar.yearsRemaining > 0
      ? ` — ${daYunPillar.yearsRemaining} year${daYunPillar.yearsRemaining !== 1 ? 's' : ''} remain in this decade`
      : '';
    paragraphs.push(
      `Behind this month, the great wind of the decade blows. ` +
      `You are currently in the ${daYunPillar.stemEnglish} ${daYunPillar.branchAnimal} decade ` +
      `(${daYunPillar.stem}${daYunPillar.branch}, ages ${daYunPillar.ageStart}–${daYunPillar.ageEnd}${remaining}). ` +
      `This is a ${dyEl} decade, ${dyRelationship}. ` +
      `Every month this year is coloured by this decade's Qi — it flows into your TotalQi at ×0.9 weight, ` +
      `before the year and month layers arrive. The bracelet for this month has been designed with that background wind already accounted for.`
    );
  }

  // Tension — what's happening structurally
  if (isCollapse && collapseMode === 'single-dominant') {
    paragraphs.push(
      `This is a month of ${dominant.el}'s dominance — a structural pattern the ancients called Follow-the-Strong. ` +
      `${dominant.el} has grown so powerful that opposing it would be like shouting into a hurricane. ` +
      `Instead, wisdom demands we walk alongside it, channeling its excess through ${GENERATES[dominant.el]} ` +
      `to transform raw power into sustainable growth.`
    );
  } else if (isCollapse && collapseMode === 'drained') {
    paragraphs.push(
      `${weakest.el} has faded to barely ${weakest.pct.toFixed(1)}% — a whisper where once there was a voice. ` +
      `The chart enters a state of depletion. Rather than forcing ${weakest.el} back to strength directly, ` +
      `the ancient method feeds it through its mother element, allowing nature's generative cycle to do the healing.`
    );
  } else if (isCollapse && collapseMode === 'bi-polar') {
    paragraphs.push(
      `Two forces stand locked in tension: ${dominant.el} and ${secondary?.el || '?'} dominate together, ` +
      `pulling the chart between their opposed natures. The remedy is not to pick a side, ` +
      `but to introduce a mediating child element that gives both titans somewhere constructive to direct their energy.`
    );
  } else {
    paragraphs.push(
      `The month brings a gentle shift in the elemental landscape. ` +
      `${dominant.el} leads with ${dominant.pct.toFixed(0)}%, while ${weakest.el} ` +
      `holds quietly at ${weakest.pct.toFixed(0)}%. ` +
      `No dramatic collapse — just the natural breathing rhythm of the Five Elements.`
    );
  }

  // Bracelet response
  if (braceletRatios) {
    const braceletElements = ELEMENTS.filter(el => (braceletRatios[el] || 0) > 0);
    if (braceletElements.length > 0) {
      const beadDesc = braceletElements
        .map(el => `${el} (${braceletRatios[el]} bead${braceletRatios[el] > 1 ? 's' : ''})`)
        .join(', ');
      paragraphs.push(
        `The bracelet awakens in response — ${beadDesc} form a crystalline ring of intent. ` +
        (useful.length > 0
          ? `${useful.join(' and ')} serve as the Yong Shen — ${useful.length === 1 ? 'the' : ''} functional stabilizer${useful.length > 1 ? 's' : ''} for this month.`
          : 'Each stone carries a specific resonance tuned to this month\'s energetic signature.'
        )
      );
    }
  }

  // Forbidden elements warning
  if (forbidden.length > 0) {
    paragraphs.push(
      `A word of caution: ${forbidden.join(' and ')} ${forbidden.length > 1 ? 'are' : 'is'} forbidden this month. ` +
      `${forbidden.map(f => `${f} ${CONTROLS[f] ? `controls ${CONTROLS[f]}` : ''}`).join('; ')} — ` +
      `using ${forbidden.length > 1 ? 'them' : 'it'} would destabilize the very structure the bracelet works to maintain.`
    );
  }

  // Closing — the journey
  paragraphs.push(
    `As the month unfolds, remember: the bracelet does not change your destiny — ` +
    `it helps you walk it with clarity. The elements are not your masters; they are your companions ` +
    `on a path that only you can walk.`
  );

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 overflow-hidden">
      {/* Header with month name and dominant element color accent */}
      <div className="px-5 py-3 border-b border-slate-700/50" style={{
        background: `linear-gradient(135deg, ${ELEM_COLORS[dominant.el]}10, transparent)`,
      }}>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white/80">
            {monthName} — <span style={{ color: ELEM_COLORS[dominant.el] }}>{dominant.el}</span> Chapter
          </h4>
          <span className="text-[10px] text-white/50 font-mono italic">Storybook Mode</span>
        </div>
      </div>

      {/* Narrative */}
      <div className="px-5 py-4 space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[12px] text-slate-300/80 leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {/* Element footer — mini distribution */}
      <div className="px-5 py-2 border-t border-slate-700/30 flex items-center gap-2">
        {sorted.map(({ el, pct }) => (
          <div key={el} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ELEM_COLORS[el] }} />
            <span className="text-[9px] font-mono text-white/55">{el[0]}:{pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QiStorybookMode;
