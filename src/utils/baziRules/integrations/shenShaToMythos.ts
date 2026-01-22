/**
 * ============================================
 * SHEN SHA TO MYTHOS INTEGRATION
 * Map Auxiliary Stars to Mythological Archetypes
 *
 * Transforms Shen Sha technical data into:
 * - Mythological archetypes
 * - Guardian spirits
 * - Hero companions
 * - Ancestral blessings
 * ============================================
 */

import { ShenShaStar, ShenShaHit, ShenShaAnalysis } from '../shenSha';

// ==================== TYPES ====================

export interface MythosArchetype {
  id: string;
  name: string;
  nameZh: string;
  mythologicalOrigin: string;
  mythologicalOriginZh: string;
  symbolism: string;
  symbolismZh: string;
  blessing: string;
  blessingZh: string;
  warning?: string;
  warningZh?: string;
  ritualActivation: string;
  ritualActivationZh: string;
  element?: string;
  celestialBody?: string;
}

export interface GuardianSpirit {
  starId: string;
  name: string;
  nameZh: string;
  domain: string;
  domainZh: string;
  gifts: string[];
  giftsZh: string[];
  protections: string[];
  protectionsZh: string[];
  invocation: string;
  invocationZh: string;
}

export interface AncestralBlessing {
  source: string;
  sourceZh: string;
  nature: 'protection' | 'talent' | 'fortune' | 'wisdom';
  description: string;
  descriptionZh: string;
  activation: string;
  activationZh: string;
}

export interface MythosProfile {
  primaryArchetypes: MythosArchetype[];
  guardianSpirits: GuardianSpirit[];
  ancestralBlessings: AncestralBlessing[];
  shadowWarnings: string[];
  shadowWarningsZh: string[];
  mythologicalNarrative: string;
  mythologicalNarrativeZh: string;
}

// ==================== MYTHOS MAPPINGS ====================

const STAR_MYTHOS: Record<string, MythosArchetype> = {
  'nobleman': {
    id: 'nobleman',
    name: 'The Celestial Noble',
    nameZh: '天乙贵人',
    mythologicalOrigin: 'The Jade Emperor\'s personal messenger, sent to aid worthy mortals in times of need.',
    mythologicalOriginZh: '玉皇大帝的私人信使，在需要时被派来帮助有价值的凡人。',
    symbolism: 'Divine intervention, aristocratic protection, heavenly grace',
    symbolismZh: '神圣干预、贵族保护、天恩',
    blessing: 'In darkest moments, help will appear from unexpected quarters.',
    blessingZh: '在最黑暗的时刻，帮助将从意想不到的地方出现。',
    ritualActivation: 'Express gratitude to helpers, pay forward kindness received.',
    ritualActivationZh: '对帮助者表示感谢，传递收到的善意。',
    celestialBody: 'Jupiter'
  },

  'literary': {
    id: 'literary',
    name: 'The Star of Wisdom',
    nameZh: '文昌星君',
    mythologicalOrigin: 'Wen Chang, the god of literature and scholarly achievement, blesses those marked for intellectual pursuits.',
    mythologicalOriginZh: '文昌，文学和学术成就之神，祝福那些注定追求智慧的人。',
    symbolism: 'Intellectual brilliance, academic success, written legacy',
    symbolismZh: '智慧光芒、学业成功、文字遗产',
    blessing: 'The gift of clear thought and persuasive words.',
    blessingZh: '清晰思维和有说服力言辞的天赋。',
    ritualActivation: 'Honor learning, support education, document wisdom.',
    ritualActivationZh: '尊重学习、支持教育、记录智慧。',
    celestialBody: 'Mercury'
  },

  'travelling_horse': {
    id: 'travelling_horse',
    name: 'The Sky Horse',
    nameZh: '天马驿马',
    mythologicalOrigin: 'The divine steed that carries messages between heaven and earth, granting mobility and opportunity.',
    mythologicalOriginZh: '在天地之间传递信息的神马，赐予流动性和机会。',
    symbolism: 'Movement, travel, career advancement, international connections',
    symbolismZh: '移动、旅行、事业进步、国际联系',
    blessing: 'Doors open in distant lands; movement brings fortune.',
    blessingZh: '远方之门打开；移动带来财富。',
    ritualActivation: 'Embrace change, travel with purpose, build bridges.',
    ritualActivationZh: '拥抱变化、有目的地旅行、建立联系。',
    element: 'Fire'
  },

  'peach_blossom': {
    id: 'peach_blossom',
    name: 'The Flower of Romance',
    nameZh: '桃花仙子',
    mythologicalOrigin: 'The peach blossom fairy who enchants hearts and weaves connections of love and desire.',
    mythologicalOriginZh: '迷人心灵、编织爱与欲望的桃花仙子。',
    symbolism: 'Romance, charisma, artistic beauty, social magnetism',
    symbolismZh: '浪漫、魅力、艺术美、社交磁力',
    blessing: 'Natural charm that draws others near.',
    blessingZh: '吸引他人靠近的天生魅力。',
    warning: 'Beauty can attract both sincere love and shallow desire.',
    warningZh: '美丽可以吸引真诚的爱，也可以吸引肤浅的欲望。',
    ritualActivation: 'Cultivate inner beauty, be discerning in relationships.',
    ritualActivationZh: '培养内在美，在关系中保持辨别力。',
    element: 'Wood'
  },

  'heavenly_virtue': {
    id: 'heavenly_virtue',
    name: 'The Virtue Guardian',
    nameZh: '天德护法',
    mythologicalOrigin: 'A celestial protector who shields the virtuous from cosmic harm.',
    mythologicalOriginZh: '保护有德之人免受宇宙伤害的天界守护者。',
    symbolism: 'Divine protection, moral shield, disaster aversion',
    symbolismZh: '神圣保护、道德盾牌、灾难回避',
    blessing: 'Misfortune is deflected through accumulated merit.',
    blessingZh: '通过积累的功德偏转不幸。',
    ritualActivation: 'Act with integrity, help others selflessly.',
    ritualActivationZh: '正直行事，无私助人。',
    celestialBody: 'Sun'
  },

  'blade': {
    id: 'blade',
    name: 'The Warrior\'s Edge',
    nameZh: '羊刃战士',
    mythologicalOrigin: 'The spirit of the sharpened blade, granting power but demanding respect.',
    mythologicalOriginZh: '锋利刀刃之灵，赐予力量但要求尊重。',
    symbolism: 'Sharp power, cutting through obstacles, dangerous potential',
    symbolismZh: '锋利力量、突破障碍、危险潜力',
    blessing: 'The power to cut through what holds you back.',
    blessingZh: '切断阻碍你的力量。',
    warning: 'The blade that cuts enemies can also wound the wielder.',
    warningZh: '砍杀敌人的刀刃也可能伤害持刀者。',
    ritualActivation: 'Master your emotions, channel aggression constructively.',
    ritualActivationZh: '掌控情绪，建设性地引导攻击性。',
    element: 'Metal'
  },

  'lonely': {
    id: 'lonely',
    name: 'The Hermit\'s Path',
    nameZh: '孤辰隐士',
    mythologicalOrigin: 'The spirit of solitude, testing the soul through isolation.',
    mythologicalOriginZh: '孤独之灵，通过隔离考验灵魂。',
    symbolism: 'Solitude, self-reliance, spiritual depth, independence',
    symbolismZh: '孤独、自立、精神深度、独立',
    blessing: 'Independence becomes strength; solitude becomes wisdom.',
    blessingZh: '独立成为力量；孤独成为智慧。',
    warning: 'Guard against bitterness and isolation that blocks connection.',
    warningZh: '警惕阻碍联系的苦涩和孤立。',
    ritualActivation: 'Embrace meaningful solitude, but keep heart open.',
    ritualActivationZh: '拥抱有意义的孤独，但保持心灵开放。',
    element: 'Water'
  },

  'general': {
    id: 'general',
    name: 'The Celestial Commander',
    nameZh: '将星天将',
    mythologicalOrigin: 'The spirit of military command, bestowing leadership and strategic brilliance.',
    mythologicalOriginZh: '军事指挥之灵，赐予领导力和战略才华。',
    symbolism: 'Leadership, authority, strategic mind, command presence',
    symbolismZh: '领导力、权威、战略思维、指挥风范',
    blessing: 'Natural authority that others recognize and follow.',
    blessingZh: '他人认可并追随的天生权威。',
    ritualActivation: 'Lead with purpose, protect those under your command.',
    ritualActivationZh: '有目的地领导，保护麾下之人。',
    element: 'Metal'
  },

  'prosperity': {
    id: 'prosperity',
    name: 'The Golden Abundance',
    nameZh: '禄神财星',
    mythologicalOrigin: 'The deity of earthly blessings who grants material abundance to the worthy.',
    mythologicalOriginZh: '赐予有价值者物质丰盛的人间祝福之神。',
    symbolism: 'Wealth, abundance, salary, stable income',
    symbolismZh: '财富、丰盛、俸禄、稳定收入',
    blessing: 'Resources flow naturally to support your path.',
    blessingZh: '资源自然流动以支持你的道路。',
    ritualActivation: 'Be generous, manage resources wisely, share abundance.',
    ritualActivationZh: '慷慨大方，明智管理资源，分享丰盛。',
    element: 'Earth'
  }
};

// ==================== CORE FUNCTIONS ====================

/**
 * Convert Shen Sha analysis to mythological profile
 */
export function convertToMythos(analysis: ShenShaAnalysis): MythosProfile {
  const primaryArchetypes: MythosArchetype[] = [];
  const guardianSpirits: GuardianSpirit[] = [];
  const ancestralBlessings: AncestralBlessing[] = [];
  const shadowWarnings: string[] = [];
  const shadowWarningsZh: string[] = [];

  // Process each hit
  analysis.hits.forEach(hit => {
    const mythos = STAR_MYTHOS[hit.star.id];

    if (mythos) {
      primaryArchetypes.push(mythos);

      // Create guardian spirit
      guardianSpirits.push(createGuardianSpirit(hit, mythos));

      // Add ancestral blessing for auspicious stars
      if (hit.star.category === 'auspicious') {
        ancestralBlessings.push(createAncestralBlessing(hit, mythos));
      }

      // Add warnings for inauspicious stars
      if (hit.star.category === 'inauspicious' && mythos.warning) {
        shadowWarnings.push(mythos.warning);
        shadowWarningsZh.push(mythos.warningZh || '');
      }
    }
  });

  // Generate narrative
  const { narrative, narrativeZh } = generateMythologicalNarrative(primaryArchetypes);

  return {
    primaryArchetypes,
    guardianSpirits,
    ancestralBlessings,
    shadowWarnings,
    shadowWarningsZh,
    mythologicalNarrative: narrative,
    mythologicalNarrativeZh: narrativeZh
  };
}

/**
 * Get mythos archetype for a specific star
 */
export function getStarMythos(starId: string): MythosArchetype | undefined {
  return STAR_MYTHOS[starId];
}

/**
 * Create guardian spirit from hit
 */
function createGuardianSpirit(hit: ShenShaHit, mythos: MythosArchetype): GuardianSpirit {
  return {
    starId: hit.star.id,
    name: mythos.name,
    nameZh: mythos.nameZh,
    domain: getDomainFromStar(hit.star),
    domainZh: getDomainFromStarZh(hit.star),
    gifts: getGiftsFromStar(hit.star),
    giftsZh: getGiftsFromStarZh(hit.star),
    protections: getProtectionsFromStar(hit.star),
    protectionsZh: getProtectionsFromStarZh(hit.star),
    invocation: mythos.ritualActivation,
    invocationZh: mythos.ritualActivationZh
  };
}

/**
 * Create ancestral blessing from hit
 */
function createAncestralBlessing(hit: ShenShaHit, mythos: MythosArchetype): AncestralBlessing {
  const pillarSource: Record<string, { en: string; zh: string }> = {
    year: { en: 'Ancestral lineage', zh: '祖先血脉' },
    month: { en: 'Parental blessing', zh: '父母祝福' },
    day: { en: 'Personal karma', zh: '个人业力' },
    hour: { en: 'Future legacy', zh: '未来遗产' }
  };

  const source = pillarSource[hit.pillar] || pillarSource.day;
  const nature = determineNature(hit.star);

  return {
    source: source.en,
    sourceZh: source.zh,
    nature,
    description: mythos.blessing,
    descriptionZh: mythos.blessingZh,
    activation: mythos.ritualActivation,
    activationZh: mythos.ritualActivationZh
  };
}

function getDomainFromStar(star: ShenShaStar): string {
  const domains: Record<string, string> = {
    auspicious: 'Blessings and Protection',
    inauspicious: 'Challenges and Warnings',
    neutral: 'Guidance and Balance'
  };
  return domains[star.category] || 'Universal Forces';
}

function getDomainFromStarZh(star: ShenShaStar): string {
  const domains: Record<string, string> = {
    auspicious: '祝福与保护',
    inauspicious: '挑战与警告',
    neutral: '指引与平衡'
  };
  return domains[star.category] || '宇宙力量';
}

function getGiftsFromStar(star: ShenShaStar): string[] {
  const gifts: string[] = [];
  if (star.effect.includes('help')) gifts.push('Timely assistance');
  if (star.effect.includes('intellect')) gifts.push('Mental clarity');
  if (star.effect.includes('charm')) gifts.push('Natural charisma');
  if (star.effect.includes('protection')) gifts.push('Divine shield');
  if (star.effect.includes('career')) gifts.push('Professional success');
  return gifts.length > 0 ? gifts : ['General blessing'];
}

function getGiftsFromStarZh(star: ShenShaStar): string[] {
  const gifts: string[] = [];
  if (star.effectZh.includes('帮助')) gifts.push('及时援助');
  if (star.effectZh.includes('智')) gifts.push('思维清晰');
  if (star.effectZh.includes('魅力')) gifts.push('天生魅力');
  if (star.effectZh.includes('保护')) gifts.push('神圣护盾');
  if (star.effectZh.includes('事业')) gifts.push('事业成功');
  return gifts.length > 0 ? gifts : ['一般祝福'];
}

function getProtectionsFromStar(star: ShenShaStar): string[] {
  if (star.category === 'auspicious') {
    return ['Against misfortune', 'Against negative energies', 'Against missed opportunities'];
  }
  return ['Awareness of dangers', 'Preparation for challenges'];
}

function getProtectionsFromStarZh(star: ShenShaStar): string[] {
  if (star.category === 'auspicious') {
    return ['防止不幸', '防止负能量', '防止错过机会'];
  }
  return ['察觉危险', '准备应对挑战'];
}

function determineNature(star: ShenShaStar): AncestralBlessing['nature'] {
  if (star.id.includes('nobleman') || star.id.includes('virtue')) return 'protection';
  if (star.id.includes('literary') || star.id.includes('general')) return 'talent';
  if (star.id.includes('prosperity') || star.id.includes('wealth')) return 'fortune';
  return 'wisdom';
}

function generateMythologicalNarrative(archetypes: MythosArchetype[]): {
  narrative: string;
  narrativeZh: string;
} {
  if (archetypes.length === 0) {
    return {
      narrative: 'Your mythological canvas awaits the stars to reveal their stories.',
      narrativeZh: '您的神话画布等待星星揭示它们的故事。'
    };
  }

  const names = archetypes.map(a => a.name).join(', ');
  const namesZh = archetypes.map(a => a.nameZh).join('、');

  let narrative = `Your soul is touched by ${names}. `;
  let narrativeZh = `您的灵魂被${namesZh}所触及。`;

  const blessings = archetypes.map(a => a.blessing).join(' ');
  const blessingsZh = archetypes.map(a => a.blessingZh).join(' ');

  narrative += blessings;
  narrativeZh += blessingsZh;

  const warnings = archetypes.filter(a => a.warning).map(a => a.warning);
  const warningsZh = archetypes.filter(a => a.warningZh).map(a => a.warningZh);

  if (warnings.length > 0) {
    narrative += ` Yet remember: ${warnings.join(' ')}`;
    narrativeZh += ` 但请记住：${warningsZh.join(' ')}`;
  }

  return { narrative, narrativeZh };
}

/**
 * Get all available mythos archetypes
 */
export function getAllMythosArchetypes(): MythosArchetype[] {
  return Object.values(STAR_MYTHOS);
}

// ==================== EXPORTS ====================

export {
  convertToMythos,
  getStarMythos,
  getAllMythosArchetypes,
  STAR_MYTHOS
};
