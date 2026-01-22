/**
 * ============================================
 * NARRATIVE GENERATORS
 * Creates persona hooks and journey hints for
 * the Knowledge Codex entries
 * ============================================
 */

import { ClassicalEdgeCaseResult } from './types';

// ==================== STRUCTURE NARRATIVES ====================

export function buildStructurePersonaHook(rule: any, result: ClassicalEdgeCaseResult): string {
  const hooks: Record<string, string> = {
    'fake_follow_wealth': '我看见财星汹涌，却知你并非真正随财之命，而是身弱被财所逼。表面的富贵之象，实藏着内心的挣扎。',
    'pseudo_cong_officer': '你似乎想要追随官星，但根气未断，我知你并非真随。此格不稳，需要谨慎对待。',
    'half_cong_resource': '你站在从与不从之间，如秋叶半落枝头。这种格局易随大运而变，需时刻觉察。',
    'true_follow_wealth': '财星如海，你已选择随波而行。顺势而为是你的道路，不必逆流而上。',
    'true_follow_officer': '官星威严，你已选择随官而行。服从与秩序是你命中的主题。',
    'true_follow_output': '食伤如泉涌出，你已选择随才华而行。创作与表达是你的天命。',
    'special_structure_lu': '建禄格成，你根基稳固如山。但需知强者需泄，不可一味刚强。',
    'special_structure_yang_ren': '羊刃在命，你内藏锋芒。需以官杀制之，否则锐气伤人伤己。',
    'dominant_element_structure': '专旺格现，一气独强。顺其势则昌，逆其势则危。'
  };

  return hooks[rule.id] || '在此处，我微调了你的格局，使之更贴近命局本真。';
}

export function buildStructureJourneyHint(rule: any, result: ClassicalEdgeCaseResult): string {
  const hints: Record<string, string> = {
    'fake_follow_wealth': 'In the Structure Chamber, I reveal to you: though wealth stars abound, this is not a true follow-wealth destiny. You will learn how to maintain your core self while navigating external pressures, rather than blindly chasing material success.',
    'pseudo_cong_officer': 'In the Structure Chamber, we see an almost-but-not-quite surrender to authority. Your hidden root keeps you tethered to self. Here you will learn to balance compliance with autonomy.',
    'half_cong_resource': 'Standing at the threshold of the Structure Chamber, you are neither fully yourself nor fully surrendered. This instability is both vulnerability and flexibility - learn to dance with it.',
    'true_follow_wealth': 'In the Structure Chamber, we acknowledge your destiny to flow with wealth energy. Your path is not resistance but alignment. Here you learn the wisdom of going with your nature.',
    'special_structure_lu': 'In the Structure Chamber, your Established Rank stands firm. Like a mountain that needs valleys to drain its excess, you will learn when strength must yield to flow.',
    'special_structure_yang_ren': 'In the Structure Chamber, your Blade gleams with dangerous beauty. Here you learn that the sharpest sword needs a steady hand - officer energy to direct your power.'
  };

  return hints[rule.id] || 'In the Structure Chamber, we examine the fundamental pattern that shapes your destiny.';
}

// ==================== COMBINATION NARRATIVES ====================

export function buildCombinationPersonaHook(combo: any, result: ClassicalEdgeCaseResult): string {
  const type = combo.combination?.type || combo.type;
  const status = combo.finalStatus;

  if (status === 'transformed') {
    if (type === 'three_harmony') {
      return `三合化成，${combo.combination?.participants?.join('')}汇为一气。此乃天作之合，你命中有此贵气。`;
    }
    if (type === 'six_harmony') {
      return `六合相亲，${combo.combination?.participants?.join('')}私下情深。此合为你带来暗中助力。`;
    }
    return '合化成功，两气归一。';
  }

  if (status === 'broken') {
    return '合而不化，被冲所破。原本的和谐被外力打断，需要另寻出路。';
  }

  if (status === 'affinity_only') {
    return '有合之情，无化之实。如相慕而不得，徒有心意，难成大事。';
  }

  return '此组合影响着你命局中的气场流动。';
}

export function buildCombinationJourneyHint(combo: any, result: ClassicalEdgeCaseResult): string {
  const status = combo.finalStatus;

  if (status === 'transformed') {
    return 'In the Heavenly Combinations Hall, we witness the dance of merging energies. Your branches have successfully united, creating a unified force that amplifies your chart\'s potential.';
  }

  if (status === 'broken') {
    return 'In the Heavenly Combinations Hall, we see a dance interrupted. Though these energies sought union, conflict intervened. Here you learn that not all connections are meant to complete.';
  }

  return 'In the Heavenly Combinations Hall, we observe the subtle attractions between your chart\'s elements - affinities that color your relationships and opportunities.';
}

// ==================== USEFUL GOD NARRATIVES ====================

export function buildUsefulGodPersonaHook(ug: any, result: ClassicalEdgeCaseResult): string {
  const element = ug.primaryUsefulGod;
  const status = ug.status;

  const elementNames: Record<string, string> = {
    'Wood': '木', 'Fire': '火', 'Earth': '土', 'Metal': '金', 'Water': '水'
  };

  const elementChinese = elementNames[element] || element;

  if (status === 'active') {
    return `你的用神是${elementChinese}，它如明灯指引你的道路。善用它，你将找到平衡与成功。`;
  }

  if (status === 'blocked') {
    return `你的用神${elementChinese}被困，如明珠蒙尘。需要找到解围之法，或启用次选用神。`;
  }

  if (status === 'weakened') {
    return `你的用神${elementChinese}力量不足，如烛火在风中摇曳。需要补强，方能发挥其功。`;
  }

  if (status === 'latent') {
    return `你的用神${elementChinese}深藏不露，待时而发。等待合适的大运，它将为你绽放。`;
  }

  return `用神${elementChinese}是你命局的关键，需要细心呵护。`;
}

export function buildUsefulGodJourneyHint(ug: any, result: ClassicalEdgeCaseResult): string {
  const status = ug.status;

  if (status === 'active') {
    return 'In the Useful God Sanctuary, your guiding star shines bright. Here you learn how to align your life with this balancing force - through colors, directions, activities, and timing.';
  }

  if (status === 'blocked') {
    return 'In the Useful God Sanctuary, we find your guiding star obscured. But do not despair - here you will learn alternative paths and how to clear the obstacles blocking your useful god.';
  }

  if (status === 'weakened') {
    return 'In the Useful God Sanctuary, your guiding star flickers but persists. Here you will learn how to strengthen and protect this vital energy through conscious cultivation.';
  }

  return 'In the Useful God Sanctuary, we discover the element that brings balance to your chart - your celestial guide through life\'s journey.';
}

// ==================== CLASH NARRATIVES ====================

export function buildClashPersonaHook(interaction: any, result: ClassicalEdgeCaseResult): string {
  // Handle clash
  if (interaction.clash) {
    const pair = interaction.clash.pair;
    if (interaction.effect === 'beneficial') {
      return `${pair.join('')}相冲，看似凶险，实则驱散了你命中的忌神。有时，冲突恰是解药。`;
    }
    return `${pair.join('')}相冲，如两军对垒。此处是你人生中容易起伏动荡之所在。`;
  }

  // Handle harm
  if (interaction.harm) {
    return `${interaction.harm.pair.join('')}相害，暗中生嫌。此为隐患，表面无恙，内里有伤。`;
  }

  // Handle punishment
  if (interaction.punishment) {
    const type = interaction.punishment.type;
    if (type === 'three_unkindness') {
      return '寅巳申三刑，无恩之刑也。此刑主恩将仇报、知恩不报之事。需修心养德以化之。';
    }
    if (type === 'self') {
      return '自刑之象，内心与自己为敌。此乃心魔，需以觉察破之。';
    }
    if (type === 'bullying') {
      return '丑戌未三刑，恃势之刑也。此刑主权力斗争、以强凌弱之事。';
    }
  }

  return '此处有气场冲突，需要留意应对。';
}

export function buildClashJourneyHint(interaction: any, result: ClassicalEdgeCaseResult): string {
  if (interaction.clash) {
    if (interaction.effect === 'beneficial') {
      return 'In the Clash & Conflict Court, we discover a surprising truth: this clash serves you well. Like surgery that heals, this conflict removes what harms you.';
    }
    return 'In the Clash & Conflict Court, we face the tensions woven into your destiny. These are not curses but teachers - here you learn to navigate conflict with wisdom.';
  }

  if (interaction.harm) {
    return 'In the Clash & Conflict Court, we uncover hidden frictions. Six Harm relationships work beneath the surface - awareness is your first defense.';
  }

  if (interaction.punishment) {
    return 'In the Clash & Conflict Court, we confront the deepest lessons. Punishment patterns speak to karmic themes that call for conscious growth and transformation.';
  }

  return 'In the Clash & Conflict Court, we acknowledge the tensions that shape your path.';
}

// ==================== SEASONAL NARRATIVES ====================

export function buildSeasonalPersonaHook(element: string, modifier: number, result: ClassicalEdgeCaseResult): string {
  const elementNames: Record<string, string> = {
    'Wood': '木', 'Fire': '火', 'Earth': '土', 'Metal': '金', 'Water': '水'
  };

  const chinese = elementNames[element] || element;
  const percent = Math.round(modifier * 100);
  const isWeak = modifier < 1.0;

  if (isWeak) {
    if (modifier < 0.5) {
      return `${chinese}气在此季极弱，仅存${percent}%之力。如寒冬之火、烈夏之水，需要额外呵护。`;
    }
    return `${chinese}气在此季受抑，约${percent}%之效。顺时而动，勿强求于此。`;
  }

  if (modifier > 1.2) {
    return `${chinese}气当令而旺，${percent}%之力。此为你的有利时节，宜善加利用。`;
  }

  return `${chinese}气在此季运行正常。`;
}

export function buildSeasonalJourneyHint(element: string, modifier: number, result: ClassicalEdgeCaseResult): string {
  const isWeak = modifier < 1.0;

  if (isWeak) {
    return `In the Elemental Winds Gallery, we feel how the seasonal currents suppress ${element} energy. Here you learn to work with nature's rhythms rather than against them.`;
  }

  if (modifier > 1.2) {
    return `In the Elemental Winds Gallery, we feel the seasonal winds empowering ${element} energy. This is your element's time to shine - learn to ride these favorable currents.`;
  }

  return `In the Elemental Winds Gallery, we observe the steady flow of ${element} energy through the seasons.`;
}

// ==================== HIDDEN STEM NARRATIVES ====================

export function buildHiddenStemPersonaHook(stem: any, result: ClassicalEdgeCaseResult): string {
  const status = stem.status;
  const element = stem.stem.element;
  const pillar = stem.pillar;

  const pillarNames: Record<string, string> = {
    'year': '年', 'month': '月', 'day': '日', 'hour': '时'
  };

  const elementNames: Record<string, string> = {
    'Wood': '木', 'Fire': '火', 'Earth': '土', 'Metal': '金', 'Water': '水'
  };

  const pillarChinese = pillarNames[pillar] || pillar;
  const elementChinese = elementNames[element] || element;

  if (status === 'active') {
    return `${pillarChinese}支中藏${elementChinese}气，透出于天干，明暗相应。此为你的实力所在。`;
  }

  if (status === 'disrupted') {
    return `${pillarChinese}支中的${elementChinese}气被冲动，根基不稳。如地下暗流被搅动，需要时间沉淀。`;
  }

  if (status === 'dormant') {
    return `${pillarChinese}支中的${elementChinese}气沉睡未醒，待机而发。它在等待那个唤醒它的时刻。`;
  }

  if (status === 'transformed') {
    return `${pillarChinese}支中的${elementChinese}气已化入合局，本性改变。如蚕化蝶，不可再以旧眼光看。`;
  }

  return `${pillarChinese}支中藏有${elementChinese}气，暗中影响着你的命运。`;
}

export function buildHiddenStemJourneyHint(stem: any, result: ClassicalEdgeCaseResult): string {
  const status = stem.status;

  if (status === 'active') {
    return 'In the Hidden Roots Crypt, we unearth a fully revealed treasure. This hidden stem has surfaced in your Heavenly Stems, giving you conscious access to its power.';
  }

  if (status === 'disrupted') {
    return 'In the Hidden Roots Crypt, we find disturbed earth. Clashes have unsettled this hidden energy - here you learn to stabilize what lies beneath.';
  }

  if (status === 'dormant') {
    return 'In the Hidden Roots Crypt, we discover sleeping potential. This energy awaits the right luck pillar to awaken it - patience is required.';
  }

  if (status === 'transformed') {
    return 'In the Hidden Roots Crypt, we witness transformation. This hidden stem has joined a greater combination, its nature fundamentally changed.';
  }

  return 'In the Hidden Roots Crypt, we explore the underground rivers of energy that secretly nourish your chart.';
}

// ==================== LUCK PILLAR NARRATIVES ====================

export function buildLuckPillarPersonaHook(lp: any, result: ClassicalEdgeCaseResult): string {
  const quality = lp.periodQuality;

  if (quality === 'favorable') {
    return '此运当头，如春风送暖。天时地利具备，是你展翅高飞的时节。善用此运，可事半功倍。';
  }

  if (quality === 'neutral') {
    return '此运平稳，无大起大落。是休养生息、厚积薄发的时期。不宜冒进，稳扎稳打为上。';
  }

  if (quality === 'challenging') {
    return '此运多磨，如逆水行舟。需要加倍努力，谨慎行事。挑战之中藏有成长的契机。';
  }

  if (quality === 'turbulent') {
    return '此运动荡，如风雨飘摇。是命运考验你的时期。守住本心，等待转机。';
  }

  return '大运流转，影响着你这十年的命运走向。';
}

export function buildLuckPillarJourneyHint(lp: any, result: ClassicalEdgeCaseResult): string {
  const quality = lp.periodQuality;

  if (quality === 'favorable') {
    return 'In the DaYun Corridor, the decade ahead glows with promise. Here you learn to recognize and seize the opportunities this fortunate timing brings.';
  }

  if (quality === 'neutral') {
    return 'In the DaYun Corridor, the decade ahead offers steady ground. Here you learn the wisdom of consolidation - building foundations for future fortune.';
  }

  if (quality === 'challenging') {
    return 'In the DaYun Corridor, the decade ahead calls for vigilance. Here you learn that challenges, met with awareness, become stepping stones to growth.';
  }

  if (quality === 'turbulent') {
    return 'In the DaYun Corridor, the decade ahead promises transformation. Here you learn that even storms pass, and sometimes destruction clears the way for renewal.';
  }

  return 'In the DaYun Corridor, we walk the timeline of your luck pillars, seeing how cosmic tides shape each decade of your life.';
}
