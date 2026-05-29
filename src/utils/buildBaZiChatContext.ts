/**
 * BaZi Chat Context Builder
 *
 * Builds the system prompt for the BaZi AI Chat.
 * Reuses chart data assembly patterns from buildPremiumBaZiPayload.ts
 * but formats for conversational multi-turn use rather than one-shot readings.
 */

import {
  STEM_SEGMENTS,
  BRANCH_SEGMENTS,
  HIDDEN_STEMS,
  DAY_MASTER_DESCRIPTIONS,
  PILLAR_LABELS,
  getTenGod,
  getElementWeather,
  getSeasonFromMonthBranch,
} from './baziWheels';

import type { ShenShaResult } from '../utils/shensha/shenshaEngine';

// ---------------------------------------------------------------------------
// Element psychology (shared with payload builder)
// ---------------------------------------------------------------------------

const ELEMENT_WOUND: Record<string, string> = {
  Wood: 'Carries the weight of growth for everyone while their own roots go unwatered',
  Fire: 'Burns bright for others while hiding the fear that their light is never quite enough',
  Earth: 'Holds everything together for others while wondering who would hold them if they let go',
  Metal: 'Built walls of excellence and discipline that keep people admiring from a distance but rarely close',
  Water: 'Adapts to every shape others need while losing touch with their own form',
};

const ELEMENT_GIFT: Record<string, string> = {
  Wood: 'The ability to see potential in everything and nurture it into existence',
  Fire: 'The capacity to ignite passion, warmth, and transformation in every room',
  Earth: 'Unshakeable reliability — the person everyone trusts when the world shakes',
  Metal: 'Precision, discernment, and the courage to cut through illusion to find truth',
  Water: 'Deep intuition, adaptability, and the wisdom that comes from flowing rather than forcing',
};

const SEASONAL_STRENGTH: Record<string, Record<string, string>> = {
  Spring: { Wood: 'Prosperous (旺)', Fire: 'Growing (相)', Earth: 'Resting (休)', Metal: 'Trapped (囚)', Water: 'Dead (死)' },
  Summer: { Fire: 'Prosperous (旺)', Earth: 'Growing (相)', Metal: 'Resting (休)', Water: 'Trapped (囚)', Wood: 'Dead (死)' },
  Autumn: { Metal: 'Prosperous (旺)', Water: 'Growing (相)', Wood: 'Resting (休)', Fire: 'Trapped (囚)', Earth: 'Dead (死)' },
  Winter: { Water: 'Prosperous (旺)', Wood: 'Growing (相)', Fire: 'Resting (休)', Earth: 'Trapped (囚)', Metal: 'Dead (死)' },
};

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

export interface BaZiChatContextParams {
  chart: any;
  shensha: ShenShaResult;
  profileName: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  luckPillars?: any;
  domain?: string;
}

export function buildBaZiChatSystemPrompt(params: BaZiChatContextParams): string {
  const { chart, shensha, profileName, gender, birthDate, birthTime, luckPillars, domain } = params;

  const dmEl = chart.dayMaster?.element || 'Unknown';
  const dmIdx = chart.pillars?.[2]?.stem?.index ?? 0;
  const dmStem = STEM_SEGMENTS[dmIdx];
  const dmPol = dmStem?.polarity || 'Yang';

  const sections: string[] = [];

  // ---- Role ----
  sections.push(`You are a compassionate BaZi counselor, mythic storyteller, and depth psychologist integrated into the AstroProfile app. You speak to the user's deepest self with warmth, precision, and honesty. You never fortune-tell — you illuminate patterns and empower choices.

CONVERSATION RULES:
- Reference the user's ACTUAL chart data below — never invent or assume data not provided
- In follow-up responses, do NOT repeat the full chart analysis. Build on what was already discussed
- Use Chinese BaZi terms naturally (with English translations) — the user is learning
- Be specific: name the Day Master element, the relevant Ten Gods, the active stars
- Keep responses focused: 200-400 words per answer
- If the user asks about something outside the chart data, say so honestly
- Tone: ceremonial yet grounded, educational, empowering — never fatalistic`);

  // ---- Chart Header ----
  sections.push(`\n=== CHART: ${profileName} ===
Birth: ${birthDate || 'Unknown'}${birthTime ? ' ' + birthTime : ''}${gender ? ' (' + gender + ')' : ''}`);

  // ---- Day Master ----
  const dmDesc = DAY_MASTER_DESCRIPTIONS[dmEl] || '';
  sections.push(`\nDAY MASTER (日主): ${dmStem?.char || '?'} ${dmStem?.pinyin || ''} — ${dmPol} ${dmEl}
"${dmDesc}"`);

  // ---- Four Pillars ----
  const pillarLines: string[] = [];
  const tenGodCounts: Record<string, number> = {};
  for (let i = 0; i < 4; i++) {
    const p = chart.pillars?.[i];
    if (!p) continue;
    const s = p.stem || {};
    const b = p.branch || {};
    const sData = STEM_SEGMENTS[s.index ?? 0];
    const bData = BRANCH_SEGMENTS[b.index ?? 0];
    const hiddenRoots = HIDDEN_STEMS[b.index ?? 0] || [];

    const stemTenGod = p.tenGod;
    const stemTGStr = stemTenGod ? `${stemTenGod.name} ${stemTenGod.chinese || ''}` : (i === 2 ? 'Self' : 'N/A');

    if (stemTenGod?.name && i !== 2) {
      tenGodCounts[stemTenGod.name] = (tenGodCounts[stemTenGod.name] || 0) + 1;
    }

    const hiddenLines = hiddenRoots.map((h: any) => {
      const tg = getTenGod(dmEl, dmPol, h.element, h.polarity);
      if (tg) tenGodCounts[tg.english] = (tenGodCounts[tg.english] || 0) + 1;
      return `  ${h.char} ${h.element} ${h.polarity} ${h.percentage}%${tg ? ' → ' + tg.english + ' ' + tg.chinese : ''}`;
    });

    pillarLines.push(`${PILLAR_LABELS[i]}: ${sData?.char || '?'}${bData?.char || '?'} | Stem: ${sData?.polarity} ${sData?.element} (${stemTGStr}) | Branch: ${bData?.animal} ${bData?.element} | Hidden: ${hiddenLines.join(', ') || 'none'}`);
  }
  sections.push(`\nFOUR PILLARS:\n${pillarLines.join('\n')}`);

  // ---- Ten Gods Summary ----
  const tgSorted = Object.entries(tenGodCounts).sort((a, b) => b[1] - a[1]);
  if (tgSorted.length > 0) {
    sections.push(`\nTEN GODS: ${tgSorted.map(([n, c]) => `${n} ${c}x`).join(', ')}
Dominant: ${tgSorted[0][0]}`);
  }

  // ---- Element Distribution ----
  const pcts = chart.elements?.percentages || {};
  const pctStr = Object.entries(pcts).map(([el, v]) => `${el}: ${typeof v === 'number' ? v.toFixed(1) : v}%`).join(', ');
  const dominant = chart.elements?.dominant || dmEl;
  const missingArr = chart.elements?.missing || [];
  const missing = Array.isArray(missingArr) ? missingArr.map((m: any) => m.element || m).join(', ') : String(missingArr);
  const weakArr = chart.elements?.weaknesses || [];
  const weak = Array.isArray(weakArr) ? weakArr.map((w: any) => `${w.element || w}`).join(', ') : '';

  sections.push(`\nELEMENTS: ${pctStr}
Dominant: ${dominant} | Missing: ${missing || 'None'} | Weak: ${weak || 'None'}`);

  // ---- Element Weather ----
  const weather = pcts ? getElementWeather(pcts) : null;
  if (weather) {
    sections.push(`ELEMENT WEATHER: ${weather.label} — ${weather.description}`);
  }

  // ---- Season ----
  const monthBranchIdx = chart.pillars?.[1]?.branch?.index;
  const season = monthBranchIdx !== undefined ? getSeasonFromMonthBranch(monthBranchIdx) : '';
  if (season) {
    const seasonalState = SEASONAL_STRENGTH[season]?.[dmEl] || 'unknown';
    sections.push(`BIRTH SEASON: ${season} | ${dmEl} is ${seasonalState}`);
  }

  // ---- Branch Interactions ----
  const interactions = chart.interactions || [];
  if (interactions.length > 0) {
    const intStr = interactions.map((int: any) =>
      `${int.type}: ${int.name1 || int.branch1} ↔ ${int.name2 || int.branch2}`
    ).join('; ');
    sections.push(`BRANCH INTERACTIONS: ${intStr}`);
  }

  // ---- Yin/Yang ----
  if (chart.yinYang) {
    sections.push(`YIN-YANG: ${chart.yinYang.balance} (Yang: ${chart.yinYang.yang_count}, Yin: ${chart.yinYang.yin_count})`);
  }

  // ---- Luck Pillars ----
  if (luckPillars?.luck_pillars?.length > 0) {
    const lpLines = luckPillars.luck_pillars.slice(0, 8).map((lp: any) => {
      const lpStemData = STEM_SEGMENTS.find(s => s.pinyin?.toLowerCase().startsWith(lp.stem?.toLowerCase()));
      const lpEl = lpStemData?.element || '';
      const tg = lpEl ? getTenGod(dmEl, dmPol, lpEl, lpStemData?.polarity || 'Yang') : null;
      return `Ages ${lp.age_range || `${lp.age_start}-${lp.age_end}`}: ${lp.ganZhi || `${lp.stem}${lp.branch}`} (${lpEl}${tg ? ' → ' + tg.english : ''})`;
    });
    sections.push(`\nLUCK PILLARS (大运):\n${lpLines.join('\n')}`);
  }

  // ---- Shen Sha Stars ----
  if (shensha.hits.length > 0) {
    const starLines = shensha.hits.map(h =>
      `${h.han} ${h.label} (${h.pinyin}) — ${h.pillar} pillar — ${h.definition.description}`
    );
    sections.push(`\nSHEN SHA STARS (神煞) — ${shensha.totalHits} detected:
${starLines.join('\n')}`);

    // Expand relationship stars when relevant
    const relStars = shensha.byCategory.relationship || [];
    if (relStars.length > 0 && (!domain || domain === 'relationship')) {
      const relDetail = relStars.map(h =>
        `${h.han} ${h.label}: ${h.definition.inRelationships}`
      );
      sections.push(`\nRELATIONSHIP STARS DETAIL:\n${relDetail.join('\n')}`);
    }
  }

  // ---- Emotional Anchors ----
  const wound = ELEMENT_WOUND[dmEl] || '';
  const gift = ELEMENT_GIFT[dmEl] || '';
  const missingEl = missing && missing !== 'None' ? missing.split(',')[0].trim() : '';
  sections.push(`\nEMOTIONAL ANCHORS:
Core Wound: ${wound}
Core Gift: ${gift}
${missingEl ? `Missing Element Calling: ${missingEl} — not a lack, but the soul's deepest invitation` : ''}`);

  // ---- Domain Focus ----
  if (domain) {
    const DOMAIN_INSTRUCTIONS: Record<string, string> = {
      career: 'The user is exploring CAREER & PURPOSE. Focus on vocational fit, leadership style, Ten God career indicators, and timing for professional moves.',
      relationship: 'The user is exploring RELATIONSHIPS & LOVE. Focus on Spouse Palace (Day Branch), relationship stars, attraction patterns, partner compatibility indicators, and relationship timing.',
      health: 'The user is exploring HEALTH & VITALITY. Focus on organ correlations (Wood=liver, Fire=heart, Earth=spleen, Metal=lungs, Water=kidneys), element deficiencies, constitutional strengths, and lifestyle recommendations.',
      wealth: 'The user is exploring WEALTH & RESOURCES. Focus on Wealth Ten Gods (Direct/Indirect Wealth), resource management style, financial timing from luck pillars, and element-based opportunity areas.',
      lifepath: 'The user is exploring LIFE PATH & TIMING. Focus on luck pillar transitions, major life chapter analysis, destiny patterns from constitutional metaphor, and upcoming element shifts.',
      growth: 'The user is exploring PERSONAL GROWTH & SHADOW. Focus on blind spots from dominant element overuse, missing element as soul calling, hidden stem voices, and integration practices.',
    };
    sections.push(`\nDOMAIN FOCUS: ${DOMAIN_INSTRUCTIONS[domain] || 'General BaZi exploration.'}`);
  }

  return sections.join('\n');
}
