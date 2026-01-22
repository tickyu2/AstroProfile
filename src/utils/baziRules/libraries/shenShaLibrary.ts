/**
 * ============================================
 * SHEN SHA INTERPRETATION LIBRARY
 * Complete Scripture for Auxiliary Stars
 *
 * Each Shen Sha star carries:
 * - Life domain influence
 * - Activation conditions
 * - Timing guidance
 * - Balance strategies
 * ============================================
 */

// ==================== TYPES ====================

export type ShenShaCategory = 'auspicious' | 'inauspicious' | 'neutral';

export interface ShenShaInterpretation {
  id: string;
  name: string;
  nameZh: string;
  category: ShenShaCategory;
  overview: string;
  overviewZh: string;
  lifeDomains: string;
  lifeDomainsZh: string;
  whenActivated: string;
  whenActivatedZh: string;
  whenChallenged: string;
  whenChallengedZh: string;
  timingNotes: string;
  timingNotesZh: string;
  ritualGuidance: string;
  ritualGuidanceZh: string;
  pillarMeaning: Record<string, string>;
  pillarMeaningZh: Record<string, string>;
}

// ==================== LIBRARY ====================

export const SHEN_SHA_INTERPRETATION_LIBRARY: ShenShaInterpretation[] = [
  // AUSPICIOUS STARS
  {
    id: 'nobleman',
    name: 'Nobleman Star',
    nameZh: '天乙贵人',
    category: 'auspicious',
    overview: 'Help, support, benefactors, timely assistance in times of need.',
    overviewZh: '帮助、支持、贵人、在需要时及时援助。',
    lifeDomains: 'Career advancement, problem-solving, crisis support, mentorship, social connections.',
    lifeDomainsZh: '事业发展、问题解决、危机支持、导师、社会关系。',
    whenActivated: 'In active pillars or transits, help appears when you take initiative. Seek mentors and allies.',
    whenActivatedZh: '在活跃柱位或流年中，当你主动时帮助会出现。寻求导师和盟友。',
    whenChallenged: 'Relying too much on others without developing your own capacity. Help may not come if you don\'t act.',
    whenChallengedZh: '过度依赖他人而不发展自己的能力。如果不行动，帮助可能不会来。',
    timingNotes: 'Nobleman years/pillars are excellent for seeking mentors, allies, support, and making important requests.',
    timingNotesZh: '贵人年/柱非常适合寻求导师、盟友、支持和提出重要请求。',
    ritualGuidance: 'Honor helpers in your life. Pay forward kindness received. Express gratitude actively.',
    ritualGuidanceZh: '尊重生活中的帮助者。传递收到的善意。积极表达感激。',
    pillarMeaning: {
      year: 'Ancestral protection, help from elders, early life benefactors',
      month: 'Career mentors, professional allies, peer support',
      day: 'Personal luck, spouse as helper, self-reliance with support',
      hour: 'Help through children, later life support, legacy assistance'
    },
    pillarMeaningZh: {
      year: '祖先保护、长辈帮助、早年贵人',
      month: '事业导师、职业盟友、同辈支持',
      day: '个人运气、配偶作为帮助者、有支持的自立',
      hour: '通过子女获得帮助、晚年支持、遗产援助'
    }
  },
  {
    id: 'literary',
    name: 'Literary Star',
    nameZh: '文昌星',
    category: 'auspicious',
    overview: 'Intellect, academic success, writing ability, examinations, scholarly achievement.',
    overviewZh: '智力、学业成功、写作能力、考试、学术成就。',
    lifeDomains: 'Education, writing, examinations, certifications, intellectual pursuits, communication.',
    lifeDomainsZh: '教育、写作、考试、认证、智力追求、沟通。',
    whenActivated: 'Excellent for study, writing projects, taking exams, and intellectual work.',
    whenActivatedZh: '非常适合学习、写作项目、考试和智力工作。',
    whenChallenged: 'Overthinking, academic pressure, writer\'s block, or intellectual arrogance.',
    whenChallengedZh: '过度思考、学业压力、写作障碍或智力傲慢。',
    timingNotes: 'Literary periods favor exams, publications, study, and intellectual recognition.',
    timingNotesZh: '文昌时期有利于考试、出版、学习和智力认可。',
    ritualGuidance: 'Honor learning through practice. Support education. Document wisdom.',
    ritualGuidanceZh: '通过实践尊重学习。支持教育。记录智慧。',
    pillarMeaning: {
      year: 'Family emphasis on education, early intellectual gifts',
      month: 'Career through intellect, professional recognition for knowledge',
      day: 'Personal intelligence, spouse values learning',
      hour: 'Intelligent children, intellectual legacy'
    },
    pillarMeaningZh: {
      year: '家庭重视教育、早期智力天赋',
      month: '通过智力发展事业、因知识获得专业认可',
      day: '个人智慧、配偶重视学习',
      hour: '聪明的孩子、智力遗产'
    }
  },
  {
    id: 'travelling_horse',
    name: 'Traveling Horse',
    nameZh: '驿马',
    category: 'auspicious',
    overview: 'Movement, travel, career advancement, international connections, change.',
    overviewZh: '移动、旅行、事业发展、国际联系、变化。',
    lifeDomains: 'Travel, relocation, career moves, transportation, trade, international opportunities.',
    lifeDomainsZh: '旅行、搬迁、职业变动、运输、贸易、国际机会。',
    whenActivated: 'Doors open in distant places. Movement brings fortune. Embrace change.',
    whenActivatedZh: '远方之门打开。移动带来财运。拥抱变化。',
    whenChallenged: 'Restlessness, inability to settle, scattered energy, or forced relocation.',
    whenChallengedZh: '不安、无法安定、能量分散或被迫搬迁。',
    timingNotes: 'Traveling Horse periods favor travel, relocation, career changes, and international ventures.',
    timingNotesZh: '驿马时期有利于旅行、搬迁、职业变化和国际企业。',
    ritualGuidance: 'Embrace change with intention. Travel with purpose. Build bridges across distances.',
    ritualGuidanceZh: '有意识地拥抱变化。有目的地旅行。跨越距离建立联系。',
    pillarMeaning: {
      year: 'Family history of movement, ancestral travel, early relocation',
      month: 'Career requires travel, professional mobility',
      day: 'Personal restlessness, spouse from afar',
      hour: 'Children travel, later life movement, legacy spreads'
    },
    pillarMeaningZh: {
      year: '家族移动历史、祖先旅行、早期搬迁',
      month: '事业需要旅行、职业流动性',
      day: '个人不安、来自远方的配偶',
      hour: '孩子旅行、晚年移动、遗产传播'
    }
  },
  {
    id: 'peach_blossom',
    name: 'Peach Blossom',
    nameZh: '桃花',
    category: 'neutral',
    overview: 'Charm, attraction, romance, aesthetics, social magnetism, artistic sensitivity.',
    overviewZh: '魅力、吸引力、浪漫、美学、社交磁力、艺术敏感性。',
    lifeDomains: 'Romance, social life, public image, art, entertainment, beauty industries.',
    lifeDomainsZh: '浪漫、社交生活、公众形象、艺术、娱乐、美容行业。',
    whenActivated: 'Visibility and attraction increase. Good for networking, art, and romantic opportunities.',
    whenActivatedZh: '可见性和吸引力增加。适合社交、艺术和浪漫机会。',
    whenChallenged: 'Risk of entanglements, scandals, distractions, or reputation issues from romantic affairs.',
    whenChallengedZh: '有纠葛、丑闻、分心或因浪漫事件导致声誉问题的风险。',
    timingNotes: 'Peach Blossom periods favor art, networking, and relationship work—with boundaries.',
    timingNotesZh: '桃花时期有利于艺术、社交和关系工作——需要有边界。',
    ritualGuidance: 'Cultivate inner beauty alongside outer charm. Be discerning in relationships.',
    ritualGuidanceZh: '在外在魅力的同时培养内在美。在关系中保持辨别力。',
    pillarMeaning: {
      year: 'Attractive family, early romantic attention',
      month: 'Career charm, workplace attraction, public appeal',
      day: 'Personal magnetism, spouse attraction, romantic self',
      hour: 'Attractive children, later life romance, artistic legacy'
    },
    pillarMeaningZh: {
      year: '有魅力的家庭、早期浪漫关注',
      month: '事业魅力、职场吸引力、公众吸引力',
      day: '个人磁力、配偶吸引力、浪漫的自我',
      hour: '有魅力的孩子、晚年浪漫、艺术遗产'
    }
  },
  {
    id: 'heavenly_virtue',
    name: 'Heavenly Virtue',
    nameZh: '天德贵人',
    category: 'auspicious',
    overview: 'Divine protection, moral shield, disaster aversion, accumulated merit.',
    overviewZh: '神圣保护、道德盾牌、灾难回避、累积功德。',
    lifeDomains: 'Protection from harm, moral guidance, spiritual growth, crisis aversion.',
    lifeDomainsZh: '免受伤害、道德指导、精神成长、危机回避。',
    whenActivated: 'Misfortune is deflected through accumulated merit. Protected in dangerous situations.',
    whenActivatedZh: '通过累积的功德偏转不幸。在危险情况下受到保护。',
    whenChallenged: 'Protection may fade if virtue is not maintained through ethical actions.',
    whenChallengedZh: '如果不通过道德行为保持美德，保护可能会消退。',
    timingNotes: 'Virtue periods provide extra protection. Good for risky ventures when behaving ethically.',
    timingNotesZh: '德星时期提供额外保护。在行为道德时适合冒险企业。',
    ritualGuidance: 'Act with integrity. Help others selflessly. Maintain ethical standards.',
    ritualGuidanceZh: '正直行事。无私助人。保持道德标准。',
    pillarMeaning: {
      year: 'Ancestral virtue, family protection, inherited moral compass',
      month: 'Professional ethics, career protection',
      day: 'Personal virtue, protected self and spouse',
      hour: 'Virtuous children, protected legacy'
    },
    pillarMeaningZh: {
      year: '祖先美德、家庭保护、继承的道德指南针',
      month: '职业道德、事业保护',
      day: '个人美德、受保护的自己和配偶',
      hour: '有美德的孩子、受保护的遗产'
    }
  },
  {
    id: 'general',
    name: 'General Star',
    nameZh: '将星',
    category: 'auspicious',
    overview: 'Leadership, authority, command presence, strategic ability, military success.',
    overviewZh: '领导力、权威、指挥风范、战略能力、军事成功。',
    lifeDomains: 'Leadership roles, management, military, strategic planning, authority positions.',
    lifeDomainsZh: '领导角色、管理、军事、战略规划、权威职位。',
    whenActivated: 'Natural authority recognized. Good for taking command and leading teams.',
    whenActivatedZh: '天生的权威被认可。适合指挥和领导团队。',
    whenChallenged: 'May become dictatorial or struggle with collaborative leadership.',
    whenChallengedZh: '可能变得专制或在协作领导方面挣扎。',
    timingNotes: 'General periods favor leadership opportunities and authority recognition.',
    timingNotesZh: '将星时期有利于领导机会和权威认可。',
    ritualGuidance: 'Lead with purpose. Protect those under your command. Use authority wisely.',
    ritualGuidanceZh: '有目的地领导。保护麾下之人。明智地使用权威。',
    pillarMeaning: {
      year: 'Family leadership tradition, early authority',
      month: 'Career leadership, professional authority',
      day: 'Personal command, authoritative spouse',
      hour: 'Leadership legacy, authoritative children'
    },
    pillarMeaningZh: {
      year: '家族领导传统、早期权威',
      month: '事业领导、职业权威',
      day: '个人指挥、有权威的配偶',
      hour: '领导遗产、有权威的孩子'
    }
  },
  // INAUSPICIOUS STARS
  {
    id: 'blade',
    name: 'Blade Star',
    nameZh: '羊刃',
    category: 'inauspicious',
    overview: 'Sharp power, cutting energy, potential for injury, aggressive force.',
    overviewZh: '锋利力量、切割能量、受伤潜力、攻击力。',
    lifeDomains: 'Surgery, martial arts, cutting through obstacles, but also injury and conflict.',
    lifeDomainsZh: '外科、武术、突破障碍，但也有伤害和冲突。',
    whenActivated: 'Power to cut through obstacles, but also risk of cutting self or others.',
    whenActivatedZh: '有突破障碍的力量，但也有伤害自己或他人的风险。',
    whenChallenged: 'The blade that cuts enemies can wound the wielder. Risk of accidents and conflicts.',
    whenChallengedZh: '砍杀敌人的刀刃可能伤害持刀者。有事故和冲突的风险。',
    timingNotes: 'Blade periods require caution with sharp objects, conflicts, and aggressive action.',
    timingNotesZh: '羊刃时期需要对锐器、冲突和攻击性行为保持谨慎。',
    ritualGuidance: 'Master emotions. Channel aggression constructively. Exercise caution with sharp objects.',
    ritualGuidanceZh: '掌控情绪。建设性地引导攻击性。对锐器保持谨慎。',
    pillarMeaning: {
      year: 'Family intensity, ancestral aggression, early conflicts',
      month: 'Career competition, professional conflicts',
      day: 'Personal intensity, sharp spouse, self-conflict',
      hour: 'Intense children, aggressive legacy'
    },
    pillarMeaningZh: {
      year: '家庭强度、祖先攻击性、早期冲突',
      month: '事业竞争、职业冲突',
      day: '个人强度、尖锐的配偶、自我冲突',
      hour: '强烈的孩子、攻击性遗产'
    }
  },
  {
    id: 'lonely',
    name: 'Lonely Star',
    nameZh: '孤辰',
    category: 'inauspicious',
    overview: 'Solitude, isolation, self-reliance, but also loneliness and disconnection.',
    overviewZh: '孤独、隔离、自立，但也有寂寞和脱节。',
    lifeDomains: 'Spiritual solitude, independence, self-reliance, but relationship challenges.',
    lifeDomainsZh: '精神孤独、独立、自立，但关系挑战。',
    whenActivated: 'Independence becomes strength. Solitude can become wisdom.',
    whenActivatedZh: '独立成为力量。孤独可以成为智慧。',
    whenChallenged: 'Guard against bitterness and isolation that blocks meaningful connection.',
    whenChallengedZh: '警惕阻碍有意义联系的苦涩和孤立。',
    timingNotes: 'Lonely periods favor spiritual retreat and self-development, but may challenge relationships.',
    timingNotesZh: '孤辰时期有利于精神退修和自我发展，但可能挑战关系。',
    ritualGuidance: 'Embrace meaningful solitude. Keep heart open. Develop self-reliance without isolation.',
    ritualGuidanceZh: '拥抱有意义的孤独。保持心灵开放。发展自立而不孤立。',
    pillarMeaning: {
      year: 'Early solitude, family isolation',
      month: 'Career independence, professional isolation',
      day: 'Personal solitude, relationship challenges',
      hour: 'Later life solitude, independent children'
    },
    pillarMeaningZh: {
      year: '早期孤独、家庭隔离',
      month: '事业独立、职业隔离',
      day: '个人孤独、关系挑战',
      hour: '晚年孤独、独立的孩子'
    }
  },
  {
    id: 'robbery',
    name: 'Robbery Star',
    nameZh: '劫煞',
    category: 'inauspicious',
    overview: 'Loss of resources, theft, unexpected setbacks, financial challenges.',
    overviewZh: '资源损失、盗窃、意外挫折、财务挑战。',
    lifeDomains: 'Financial protection, resource management, security concerns.',
    lifeDomainsZh: '财务保护、资源管理、安全关注。',
    whenActivated: 'Exercise extra caution with finances and valuables.',
    whenActivatedZh: '对财务和贵重物品格外小心。',
    whenChallenged: 'Risk of theft, fraud, or unexpected financial losses.',
    whenChallengedZh: '有盗窃、欺诈或意外财务损失的风险。',
    timingNotes: 'Robbery periods require financial caution and security awareness.',
    timingNotesZh: '劫煞时期需要财务谨慎和安全意识。',
    ritualGuidance: 'Protect valuables. Be cautious with investments. Strengthen security.',
    ritualGuidanceZh: '保护贵重物品。投资谨慎。加强安全。',
    pillarMeaning: {
      year: 'Family financial challenges, early losses',
      month: 'Career financial risks, professional losses',
      day: 'Personal financial challenges, spouse losses',
      hour: 'Later life financial concerns, children\'s losses'
    },
    pillarMeaningZh: {
      year: '家庭财务挑战、早期损失',
      month: '事业财务风险、职业损失',
      day: '个人财务挑战、配偶损失',
      hour: '晚年财务关注、孩子的损失'
    }
  },
  {
    id: 'disaster',
    name: 'Disaster Star',
    nameZh: '灾煞',
    category: 'inauspicious',
    overview: 'Accidents, misfortune, unexpected challenges, need for caution.',
    overviewZh: '事故、不幸、意外挑战、需要谨慎。',
    lifeDomains: 'Safety, health, accident prevention, crisis management.',
    lifeDomainsZh: '安全、健康、事故预防、危机管理。',
    whenActivated: 'Exercise extra caution in all activities.',
    whenActivatedZh: '在所有活动中格外小心。',
    whenChallenged: 'Increased risk of accidents and unexpected difficulties.',
    whenChallengedZh: '事故和意外困难的风险增加。',
    timingNotes: 'Disaster periods require heightened awareness and caution.',
    timingNotesZh: '灾煞时期需要加强警觉和谨慎。',
    ritualGuidance: 'Prioritize safety. Avoid unnecessary risks. Prepare for challenges.',
    ritualGuidanceZh: '优先考虑安全。避免不必要的风险。为挑战做准备。',
    pillarMeaning: {
      year: 'Early life challenges, family accidents',
      month: 'Career challenges, professional accidents',
      day: 'Personal challenges, spouse accidents',
      hour: 'Later life challenges, children\'s accidents'
    },
    pillarMeaningZh: {
      year: '早年挑战、家庭事故',
      month: '事业挑战、职业事故',
      day: '个人挑战、配偶事故',
      hour: '晚年挑战、孩子的事故'
    }
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Lookup Shen Sha interpretation by ID
 */
export function getShenShaInterpretation(id: string): ShenShaInterpretation | undefined {
  return SHEN_SHA_INTERPRETATION_LIBRARY.find(s => s.id === id);
}

/**
 * Get all Shen Sha by category
 */
export function getShenShaByCategory(category: ShenShaCategory): ShenShaInterpretation[] {
  return SHEN_SHA_INTERPRETATION_LIBRARY.filter(s => s.category === category);
}

/**
 * Get pillar-specific meaning
 */
export function getShenShaPillarMeaning(id: string, pillar: string, lang: 'en' | 'zh' = 'en'): string {
  const interp = getShenShaInterpretation(id);
  if (!interp) return '';

  if (lang === 'zh') {
    return interp.pillarMeaningZh[pillar] || '';
  }
  return interp.pillarMeaning[pillar] || '';
}

/**
 * Format Shen Sha for display
 */
export function formatShenShaInterpretationForDisplay(id: string, pillar: string, lang: 'en' | 'zh' = 'en'): string {
  const ss = getShenShaInterpretation(id);
  if (!ss) return '';

  const pillarMeaning = getShenShaPillarMeaning(id, pillar, lang);

  if (lang === 'zh') {
    return `【${ss.nameZh}】(${pillar}柱)\n${ss.overviewZh}\n\n生活领域：${ss.lifeDomainsZh}\n激活时：${ss.whenActivatedZh}\n${pillarMeaning ? `柱位含义：${pillarMeaning}` : ''}`;
  }

  return `【${ss.name}】(${pillar} Pillar)\n${ss.overview}\n\nLife Domains: ${ss.lifeDomains}\nWhen Activated: ${ss.whenActivated}\n${pillarMeaning ? `Pillar Meaning: ${pillarMeaning}` : ''}`;
}

// ==================== EXPORTS ====================

export {
  getShenShaInterpretation,
  getShenShaByCategory,
  getShenShaPillarMeaning,
  formatShenShaInterpretationForDisplay
};
