/**
 * Chart-Aware Question Generator for BaZi AI Chat
 *
 * Pure function: (chart, shensha, profileName) -> domain questions
 * Questions are dynamically seeded from the user's actual BaZi chart data.
 */

import type { ShenShaResult, ShenShaHit } from '../../utils/shensha/shenshaEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DomainId = 'career' | 'relationship' | 'health' | 'wealth' | 'lifepath' | 'growth';

export interface DomainQuestion {
  text: string;
  context: string; // Brief note about why this question was generated
}

export interface DomainQuestions {
  domain: DomainId;
  label: string;
  icon: string;
  color: string;       // Accent color for the domain
  description: string;
  questions: DomainQuestion[];
}

// ---------------------------------------------------------------------------
// Domain metadata
// ---------------------------------------------------------------------------

const DOMAIN_META: Record<DomainId, { label: string; icon: string; color: string; description: string }> = {
  career:       { label: 'Career & Purpose',         icon: '\u{1F4BC}', color: '#60a5fa', description: 'Work, vocation, leadership, and professional path' },
  relationship: { label: 'Relationships & Love',     icon: '\u{1F496}', color: '#f472b6', description: 'Romance, partnership, family, and connection' },
  health:       { label: 'Health & Vitality',         icon: '\u{1F33F}', color: '#4ade80', description: 'Physical constitution, organ sensitivity, and energy' },
  wealth:       { label: 'Wealth & Resources',        icon: '\u{1FA99}', color: '#fbbf24', description: 'Finances, opportunity, and resource management' },
  lifepath:     { label: 'Life Path & Timing',        icon: '\u{1F9ED}', color: '#a78bfa', description: 'Destiny, luck pillars, and major life transitions' },
  growth:       { label: 'Personal Growth & Shadow',  icon: '\u{1F331}', color: '#34d399', description: 'Self-development, blind spots, and integration' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check if a specific star was detected */
function hasStar(shensha: ShenShaResult, key: string): boolean {
  return shensha.hits.some(h => h.key === key);
}

/** Get all hits in a category */
function starsInCategory(shensha: ShenShaResult, cat: string): ShenShaHit[] {
  return shensha.byCategory[cat as keyof typeof shensha.byCategory] || [];
}

/** Get the Ten God for a specific pillar by name like 'Direct Officer' */
function hasTenGod(chart: any, name: string): boolean {
  return chart.pillars?.some((p: any) => p.tenGod?.name === name || p.tenGod?.english === name);
}

/** Get dominant Ten God from chart */
function getDominantTenGod(chart: any): string {
  const counts: Record<string, number> = {};
  for (const p of (chart.pillars || [])) {
    const name = p.tenGod?.name || p.tenGod?.english || '';
    if (name && name !== 'Self') counts[name] = (counts[name] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || '';
}

/** Get element emoji */
function elEmoji(el: string): string {
  const map: Record<string, string> = { Wood: '\u{1F332}', Fire: '\u{1F525}', Earth: '\u{26F0}\u{FE0F}', Metal: '\u{2699}\u{FE0F}', Water: '\u{1F30A}' };
  return map[el] || '';
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateChartAwareQuestions(
  chart: any,
  shensha: ShenShaResult,
  profileName: string,
): DomainQuestions[] {
  const dmEl = chart.dayMaster?.element || 'Water';
  const dmPolarity = chart.pillars?.[2]?.stem?.polarity || 'Yin';
  const dmFull = `${dmPolarity} ${dmEl}`;
  const dominant = chart.elements?.dominant || dmEl;
  const missing = chart.elements?.missing || '';
  const dayBranch = chart.pillars?.[2]?.branch?.animal || '';
  const name = profileName || 'you';

  const domains: DomainQuestions[] = [];

  // ===== CAREER =====
  const careerQs: DomainQuestion[] = [];
  const domTG = getDominantTenGod(chart);

  careerQs.push({
    text: `As a ${dmFull} Day Master, what career paths naturally align with my elemental energy?`,
    context: `Day Master: ${dmFull}`,
  });

  if (domTG) {
    careerQs.push({
      text: `My chart's dominant Ten God is ${domTG}. How does this shape my leadership style and professional strengths?`,
      context: `Dominant Ten God: ${domTG}`,
    });
  }

  if (hasStar(shensha, 'traveling_horse')) {
    careerQs.push({
      text: `With the Traveling Horse (\u{9A7F}\u{9A6C}) active, should I pursue opportunities involving relocation or international work?`,
      context: 'Traveling Horse detected',
    });
  }

  if (hasStar(shensha, 'academic_star')) {
    careerQs.push({
      text: `My Academic Star (\u{6587}\u{660C}) is active. How can I best channel my intellectual gifts into career advancement?`,
      context: 'Academic Star detected',
    });
  }

  careerQs.push({
    text: `What does my element distribution say about my ideal work environment and the kind of team I thrive in?`,
    context: `Dominant: ${dominant}, Missing: ${missing || 'none'}`,
  });

  if (missing) {
    careerQs.push({
      text: `I'm missing ${missing} energy in my chart. Are there career paths that help me develop this quality?`,
      context: `Missing element: ${missing}`,
    });
  }

  domains.push({ ...DOMAIN_META.career, domain: 'career', questions: careerQs.slice(0, 5) });

  // ===== RELATIONSHIP =====
  const relQs: DomainQuestion[] = [];
  const relStars = starsInCategory(shensha, 'relationship');

  relQs.push({
    text: `As a ${dmFull} Day Master with ${dayBranch} as my Spouse Palace, what partner qualities create the deepest harmony?`,
    context: `Spouse Palace: ${dayBranch} (Day Branch)`,
  });

  if (hasStar(shensha, 'peach_blossom')) {
    relQs.push({
      text: `My Peach Blossom (\u{6843}\u{82B1}) is active — how do I best navigate this heightened romantic magnetism?`,
      context: 'Peach Blossom detected',
    });
  }

  if (hasStar(shensha, 'red_matchmaker')) {
    relQs.push({
      text: `The Red Matchmaker (\u{7EA2}\u{9E3E}) star appears in my chart. What does this mean for my marriage timing and partnership formation?`,
      context: 'Red Matchmaker detected',
    });
  }

  if (hasStar(shensha, 'solitary_star') || hasStar(shensha, 'widow_star')) {
    const starName = hasStar(shensha, 'solitary_star') ? 'Solitary Star (\u{5B64}\u{8FB0})' : 'Widow Star (\u{5BE1}\u{5BBF})';
    relQs.push({
      text: `My chart carries the ${starName}. How do I honor my need for independence while building deep connection?`,
      context: `${starName} detected — independence theme`,
    });
  }

  if (hasStar(shensha, 'salty_pool')) {
    relQs.push({
      text: `With Salty Pool (\u{54B8}\u{6C60}) energy present, how can I balance physical attraction with emotional depth in relationships?`,
      context: 'Salty Pool detected',
    });
  }

  if (relStars.length === 0) {
    relQs.push({
      text: `My chart doesn't activate major romance stars. What does this mean for my relationship approach — and what strengths does it reveal?`,
      context: 'No relationship stars detected',
    });
  }

  relQs.push({
    text: `What relationship patterns does my ${dmEl} Day Master naturally attract, and which ones support my growth?`,
    context: `Day Master element: ${dmEl}`,
  });

  domains.push({ ...DOMAIN_META.relationship, domain: 'relationship', questions: relQs.slice(0, 5) });

  // ===== HEALTH =====
  const healthQs: DomainQuestion[] = [];
  const weakEls = chart.elements?.weaknesses || [];
  const strongEls = chart.elements?.strengths || [];

  const ORGAN_MAP: Record<string, string> = {
    Wood: 'liver and gallbladder', Fire: 'heart and small intestine',
    Earth: 'spleen and stomach', Metal: 'lungs and large intestine',
    Water: 'kidneys and bladder',
  };

  healthQs.push({
    text: `Based on my ${dmFull} constitution, which organs and body systems need the most attention?`,
    context: `Day Master organ: ${ORGAN_MAP[dmEl] || dmEl}`,
  });

  if (missing) {
    healthQs.push({
      text: `I'm deficient in ${missing} energy (${ORGAN_MAP[missing] || missing}). What lifestyle adjustments support these organs?`,
      context: `Missing element: ${missing}`,
    });
  }

  if (weakEls.length > 0) {
    healthQs.push({
      text: `My weak elements are ${weakEls.join(' and ')}. How might these show up as physical or emotional patterns?`,
      context: `Weak elements: ${weakEls.join(', ')}`,
    });
  }

  if (hasStar(shensha, 'heavenly_doctor')) {
    healthQs.push({
      text: `The Heavenly Doctor (\u{5929}\u{533B}) star is present in my chart. Does this indicate healing abilities or health protection?`,
      context: 'Heavenly Doctor detected',
    });
  }

  healthQs.push({
    text: `How does my element distribution affect my energy levels, sleep patterns, and stress response?`,
    context: `Dominant: ${dominant}`,
  });

  domains.push({ ...DOMAIN_META.health, domain: 'health', questions: healthQs.slice(0, 5) });

  // ===== WEALTH =====
  const wealthQs: DomainQuestion[] = [];

  if (hasStar(shensha, 'prosperity_star')) {
    wealthQs.push({
      text: `My Prosperity Star (\u{7984}\u{795E}) is active. How can I best leverage this natural earning ability?`,
      context: 'Prosperity Star detected',
    });
  }

  const hasDirectWealth = hasTenGod(chart, 'Direct Wealth');
  const hasIndirectWealth = hasTenGod(chart, 'Indirect Wealth');
  const hasRobWealth = hasTenGod(chart, 'Rob Wealth');

  if (hasDirectWealth || hasIndirectWealth) {
    const wType = hasDirectWealth ? 'Direct Wealth (\u{6B63}\u{8D22})' : 'Indirect Wealth (\u{504F}\u{8D22})';
    wealthQs.push({
      text: `I have ${wType} in my chart. Does this favor steady salary income or entrepreneurial/investment returns?`,
      context: `${wType} present`,
    });
  }

  if (hasRobWealth) {
    wealthQs.push({
      text: `Rob Wealth (\u{52AB}\u{8D22}) appears in my pillars. How do I protect against financial leakage or overcommitment?`,
      context: 'Rob Wealth detected',
    });
  }

  wealthQs.push({
    text: `As a ${dmFull} Day Master, what's my natural relationship with money and resources?`,
    context: `Day Master: ${dmFull}`,
  });

  wealthQs.push({
    text: `Which elements in my chart support wealth accumulation, and which ones challenge it?`,
    context: `Strong: ${strongEls.join(', ') || dominant}, Weak: ${weakEls.join(', ') || 'balanced'}`,
  });

  domains.push({ ...DOMAIN_META.wealth, domain: 'wealth', questions: wealthQs.slice(0, 5) });

  // ===== LIFE PATH =====
  const lifepathQs: DomainQuestion[] = [];

  lifepathQs.push({
    text: `What does my chart reveal about my core life purpose and the role I was born to play?`,
    context: `Day Master: ${dmFull}, Metaphor: ${chart.metaphor?.metaphor || 'unique pattern'}`,
  });

  lifepathQs.push({
    text: `How do my luck pillars describe the major chapters of my life? What element transitions should I prepare for?`,
    context: 'Luck pillar trajectory',
  });

  const interactions = chart.interactions || [];
  if (interactions.length > 0) {
    const clash = interactions.find((i: any) => i.type === 'clash' || i.interaction === 'clash');
    if (clash) {
      lifepathQs.push({
        text: `My chart has a ${clash.name1 || clash.branch1}-${clash.name2 || clash.branch2} clash. How does this inner tension drive my life's biggest transformations?`,
        context: `Branch clash detected`,
      });
    }
  }

  if (hasStar(shensha, 'general_star')) {
    lifepathQs.push({
      text: `The General Star (\u{5C06}\u{661F}) is present. Does my chart suggest a leadership destiny or positions of authority?`,
      context: 'General Star detected',
    });
  }

  lifepathQs.push({
    text: `What major life shifts do my current and upcoming luck pillars suggest in the next 5-10 years?`,
    context: 'Timing and transitions',
  });

  domains.push({ ...DOMAIN_META.lifepath, domain: 'lifepath', questions: lifepathQs.slice(0, 5) });

  // ===== PERSONAL GROWTH =====
  const growthQs: DomainQuestion[] = [];

  growthQs.push({
    text: `What are my ${dmEl} Day Master's blind spots — the patterns I repeat without seeing?`,
    context: `Day Master shadow patterns`,
  });

  if (missing) {
    growthQs.push({
      text: `My chart is missing ${missing} energy. What would it look like to consciously invite ${missing} ${elEmoji(missing)} into my life?`,
      context: `Missing element as calling: ${missing}`,
    });
  }

  growthQs.push({
    text: `How does my dominant ${dominant} energy serve me — and where does it become my armor instead of my gift?`,
    context: `Dominant element: ${dominant}`,
  });

  if (chart.yinYang) {
    const balance = chart.yinYang.balance || '';
    if (balance.includes('Yang') || (chart.yinYang.yang_count > chart.yinYang.yin_count)) {
      growthQs.push({
        text: `My chart leans Yang-dominant. How do I develop the Yin qualities (receptivity, patience, stillness) that would balance me?`,
        context: `Yin/Yang: ${balance}`,
      });
    } else if (balance.includes('Yin') || (chart.yinYang.yin_count > chart.yinYang.yang_count)) {
      growthQs.push({
        text: `My chart leans Yin-dominant. How do I cultivate more Yang energy (assertiveness, action, visibility)?`,
        context: `Yin/Yang: ${balance}`,
      });
    }
  }

  growthQs.push({
    text: `What hidden stems in my chart reveal about parts of myself I haven't fully embraced yet?`,
    context: 'Hidden stems as subconscious voices',
  });

  domains.push({ ...DOMAIN_META.growth, domain: 'growth', questions: growthQs.slice(0, 5) });

  return domains;
}

export { DOMAIN_META };
