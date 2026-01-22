/**
 * ============================================
 * TEN GOD INTERPRETATION LIBRARY
 * Complete Scripture for All Ten Gods
 *
 * Each Ten God carries archetypal meaning:
 * - Personality traits
 * - Career orientations
 * - Relationship patterns
 * - Timing influences
 * ============================================
 */

// ==================== TYPES ====================

export type TenGodId =
  | 'DO'   // Direct Officer (正官)
  | '7K'   // Seven Killings (七杀)
  | 'RW'   // Rob Wealth (劫财)
  | 'F'    // Friend/Companion (比肩)
  | 'HO'   // Hurting Officer (伤官)
  | 'EG'   // Eating God (食神)
  | 'DR'   // Direct Resource (正印)
  | 'IR'   // Indirect Resource (偏印)
  | 'DW'   // Direct Wealth (正财)
  | 'IW';  // Indirect Wealth (偏财)

export interface TenGodInterpretation {
  id: TenGodId;
  name: string;
  nameZh: string;
  element: string;
  relationship: string;
  overview: string;
  overviewZh: string;
  personality: string;
  personalityZh: string;
  career: string;
  careerZh: string;
  relationships: string;
  relationshipsZh: string;
  whenStrong: string;
  whenStrongZh: string;
  whenWeak: string;
  whenWeakZh: string;
  timingNotes: string;
  timingNotesZh: string;
  archetype: string;
  archetypeZh: string;
}

// ==================== LIBRARY ====================

export const TEN_GOD_LIBRARY: TenGodInterpretation[] = [
  {
    id: 'DO',
    name: 'Direct Officer',
    nameZh: '正官',
    element: 'Controls Day Master (same polarity)',
    relationship: 'Yin controls Yin, Yang controls Yang',
    overview: 'Order, responsibility, structure, rules, duty, reputation.',
    overviewZh: '秩序、责任、结构、规则、职责、声誉。',
    personality: 'Values order, discipline, and clear expectations. Often conscientious, principled, and respectful of hierarchy. Seeks recognition through proper channels.',
    personalityZh: '重视秩序、纪律和明确的期望。通常认真负责、有原则且尊重等级制度。通过正当途径寻求认可。',
    career: 'Suited for roles with clear hierarchy, responsibility, and accountability. Management, law, governance, corporate leadership, civil service.',
    careerZh: '适合有明确等级制度、责任和问责制的角色。管理、法律、治理、企业领导、公务员。',
    relationships: 'Prefers stability and reliability. Values commitment and loyalty. May become strict or demanding when unbalanced.',
    relationshipsZh: '偏好稳定和可靠。重视承诺和忠诚。失衡时可能变得严格或苛求。',
    whenStrong: 'Can become rigid, overly controlling, fearful of breaking rules, or excessively concerned with reputation and status.',
    whenStrongZh: '可能变得僵化、过度控制、害怕打破规则，或过分关注声誉和地位。',
    whenWeak: 'May struggle with boundaries, procrastination, fear of authority, or difficulty accepting responsibility.',
    whenWeakZh: '可能在边界、拖延、害怕权威或难以承担责任方面挣扎。',
    timingNotes: 'In Luck/Annual pillars, emphasizes responsibility, career advancement, encounters with authority figures, and reputation matters.',
    timingNotesZh: '在大运/流年中，强调责任、事业发展、与权威人物的相遇，以及声誉事项。',
    archetype: 'The Magistrate',
    archetypeZh: '长官'
  },
  {
    id: '7K',
    name: 'Seven Killings',
    nameZh: '七杀',
    element: 'Controls Day Master (opposite polarity)',
    relationship: 'Yin controls Yang, Yang controls Yin',
    overview: 'Risk, challenge, pressure, intensity, crisis, transformation, power.',
    overviewZh: '风险、挑战、压力、强度、危机、转变、权力。',
    personality: 'Drawn to challenge and intensity. Bold, sharp, competitive, and confrontational. High tolerance for risk and pressure.',
    personalityZh: '被挑战和强度所吸引。大胆、敏锐、有竞争力和对抗性。对风险和压力有很高的容忍度。',
    career: 'Thrives in high-pressure, competitive, or crisis-driven environments. Military, surgery, martial arts, stock trading, emergency services, entrepreneurship.',
    careerZh: '在高压、竞争激烈或危机驱动的环境中茁壮成长。军事、外科、武术、股票交易、紧急服务、创业。',
    relationships: 'Attracts intense, transformative relationships. May oscillate between strong attraction and conflict. Needs partner who can handle intensity.',
    relationshipsZh: '吸引强烈、变革性的关系。可能在强烈吸引和冲突之间摇摆。需要能够处理强度的伴侣。',
    whenStrong: 'May become reckless, combative, aggressive, or destructive. Can attract accidents, injuries, or conflicts.',
    whenStrongZh: '可能变得鲁莽、好斗、攻击性或破坏性。可能招致事故、伤害或冲突。',
    whenWeak: 'May avoid conflict excessively, feel easily overwhelmed by pressure, or lack courage to face challenges.',
    whenWeakZh: '可能过度回避冲突，容易被压力压垮，或缺乏面对挑战的勇气。',
    timingNotes: 'Brings tests, confrontations, and opportunities to step into courage and set boundaries. Can indicate surgery, accidents, or major life changes.',
    timingNotesZh: '带来考验、对抗和鼓起勇气设定界限的机会。可能表示手术、事故或重大生活变化。',
    archetype: 'The Warrior',
    archetypeZh: '战士'
  },
  {
    id: 'F',
    name: 'Friend',
    nameZh: '比肩',
    element: 'Same as Day Master (same polarity)',
    relationship: 'Same element, same polarity',
    overview: 'Independence, self-reliance, competition, peers, siblings, partnership.',
    overviewZh: '独立、自立、竞争、同辈、兄弟姐妹、伙伴关系。',
    personality: 'Strong sense of self, independent, competitive with peers. Values personal achievement and autonomy. Natural leader among equals.',
    personalityZh: '自我意识强、独立、与同龄人竞争。重视个人成就和自主权。同辈中的天然领袖。',
    career: 'Works well independently or in partnership. Entrepreneurship, athletics, sales, consulting, any field requiring self-motivation.',
    careerZh: '独立工作或合作都很出色。创业、体育、销售、咨询，任何需要自我激励的领域。',
    relationships: 'May compete with partner or struggle with compromise. Needs space for independence. Best with equally strong partners.',
    relationshipsZh: '可能与伴侣竞争或难以妥协。需要独立空间。最适合同样强大的伴侣。',
    whenStrong: 'Can become overly competitive, stubborn, unwilling to cooperate, or drain resources through rivalry.',
    whenStrongZh: '可能变得过度竞争、固执、不愿合作，或因竞争而消耗资源。',
    whenWeak: 'May lack confidence, depend too much on others, or struggle with self-identity.',
    whenWeakZh: '可能缺乏信心，过度依赖他人，或在自我认同方面挣扎。',
    timingNotes: 'Brings opportunities for partnership, competition, or challenges to resources. May indicate sibling or peer-related events.',
    timingNotesZh: '带来合作、竞争或资源挑战的机会。可能表示与兄弟姐妹或同辈相关的事件。',
    archetype: 'The Competitor',
    archetypeZh: '竞争者'
  },
  {
    id: 'RW',
    name: 'Rob Wealth',
    nameZh: '劫财',
    element: 'Same as Day Master (opposite polarity)',
    relationship: 'Same element, opposite polarity',
    overview: 'Rivalry, ambition, boldness, risk-taking, financial fluctuations.',
    overviewZh: '竞争、野心、大胆、冒险、财务波动。',
    personality: 'Bold and ambitious with strong drive to compete. May take risks others avoid. Charismatic but can be manipulative.',
    personalityZh: '大胆有野心，有强烈的竞争动力。可能承担他人回避的风险。有魅力但可能具有操纵性。',
    career: 'High-risk ventures, speculation, sales, negotiation, athletics. Needs dynamic environments with clear rewards.',
    careerZh: '高风险企业、投机、销售、谈判、体育。需要有明确回报的动态环境。',
    relationships: 'May compete with partner for resources or attention. Needs partner who won\'t be dominated but also won\'t challenge constantly.',
    relationshipsZh: '可能与伴侣争夺资源或关注。需要不会被支配但也不会不断挑战的伴侣。',
    whenStrong: 'Financial losses through risky ventures, conflicts over resources, or tendency to overreach and lose what was gained.',
    whenStrongZh: '因风险企业造成财务损失，因资源发生冲突，或有过度扩张失去所得的倾向。',
    whenWeak: 'May lack drive, fear competition, or miss opportunities due to excessive caution.',
    whenWeakZh: '可能缺乏动力，害怕竞争，或因过度谨慎而错失机会。',
    timingNotes: 'Indicates potential for wealth fluctuations, competitive situations, or challenges to assets. Exercise caution with investments.',
    timingNotesZh: '表示财富波动、竞争情况或资产挑战的可能性。投资时需谨慎。',
    archetype: 'The Gambler',
    archetypeZh: '赌徒'
  },
  {
    id: 'EG',
    name: 'Eating God',
    nameZh: '食神',
    element: 'Produced by Day Master (same polarity)',
    relationship: 'Day Master produces, same polarity',
    overview: 'Creativity, pleasure, contentment, artistic expression, enjoyment, leisure.',
    overviewZh: '创造力、愉悦、满足、艺术表达、享受、休闲。',
    personality: 'Gentle, artistic, pleasure-seeking. Enjoys life\'s comforts. Creative and expressive but in a harmonious way. Good appetite for life.',
    personalityZh: '温和、艺术、追求愉悦。享受生活的舒适。以和谐的方式创造性地表达。对生活有好胃口。',
    career: 'Arts, food industry, hospitality, teaching, counseling, any field requiring gentle creativity and nurturing.',
    careerZh: '艺术、食品行业、酒店业、教学、咨询，任何需要温和创造力和滋养的领域。',
    relationships: 'Nurturing and giving. May give too much without receiving. Creates harmony but can become complacent.',
    relationshipsZh: '滋养和给予。可能给予太多而不接受。创造和谐但可能变得自满。',
    whenStrong: 'Can become lazy, indulgent, overly focused on pleasure, or lose ambition due to contentment.',
    whenStrongZh: '可能变得懒惰、放纵、过度关注享乐，或因满足而失去野心。',
    whenWeak: 'May suppress creativity, deny pleasures, or struggle to express oneself comfortably.',
    whenWeakZh: '可能压制创造力，否认乐趣，或难以舒适地表达自己。',
    timingNotes: 'Favorable for creativity, relaxation, enjoyment, and gentle expression. Good for artistic projects and leisure activities.',
    timingNotesZh: '有利于创造力、放松、享受和温和表达。适合艺术项目和休闲活动。',
    archetype: 'The Artist',
    archetypeZh: '艺术家'
  },
  {
    id: 'HO',
    name: 'Hurting Officer',
    nameZh: '伤官',
    element: 'Produced by Day Master (opposite polarity)',
    relationship: 'Day Master produces, opposite polarity',
    overview: 'Rebellion, innovation, sharp expression, challenging authority, performance.',
    overviewZh: '叛逆、创新、尖锐表达、挑战权威、表演。',
    personality: 'Sharp-tongued, rebellious, innovative. Questions authority and conventions. Highly creative but can be cutting. Natural performer.',
    personalityZh: '言辞尖锐、叛逆、创新。质疑权威和传统。极具创造力但可能尖刻。天生的表演者。',
    career: 'Performance, innovation, disruption, advocacy, law (arguing), media, entertainment, any field requiring bold expression.',
    careerZh: '表演、创新、颠覆、倡导、法律（辩护）、媒体、娱乐，任何需要大胆表达的领域。',
    relationships: 'May challenge partner, be critical, or struggle with traditional relationship roles. Needs partner who appreciates directness.',
    relationshipsZh: '可能挑战伴侣，批评或在传统关系角色中挣扎。需要欣赏直接性的伴侣。',
    whenStrong: 'Can become destructively critical, alienate others through sharp words, or sabotage relationships with authority.',
    whenStrongZh: '可能变得破坏性地批评，通过尖锐的言辞疏远他人，或破坏与权威的关系。',
    whenWeak: 'May suppress voice, struggle to innovate, or feel unable to express true opinions.',
    whenWeakZh: '可能压制声音，难以创新，或感到无法表达真实意见。',
    timingNotes: 'Can clash with authority figures (Direct Officer). Brings opportunities for bold expression but also potential conflicts.',
    timingNotesZh: '可能与权威人物（正官）冲突。带来大胆表达的机会，但也有潜在冲突。',
    archetype: 'The Rebel',
    archetypeZh: '叛逆者'
  },
  {
    id: 'DR',
    name: 'Direct Resource',
    nameZh: '正印',
    element: 'Produces Day Master (same polarity)',
    relationship: 'Produces Day Master, same polarity',
    overview: 'Nurturing, education, support, protection, wisdom, maternal energy.',
    overviewZh: '滋养、教育、支持、保护、智慧、母性能量。',
    personality: 'Nurturing, supportive, wisdom-seeking. Values education and traditional knowledge. Patient and protective.',
    personalityZh: '滋养、支持、追求智慧。重视教育和传统知识。耐心和保护性。',
    career: 'Education, healthcare, counseling, research, academia, any field requiring nurturing and knowledge transmission.',
    careerZh: '教育、医疗保健、咨询、研究、学术，任何需要滋养和知识传递的领域。',
    relationships: 'Nurturing and supportive. May mother partners or become overly protective. Seeks intellectual connection.',
    relationshipsZh: '滋养和支持。可能母性化伴侣或变得过度保护。寻求智力连接。',
    whenStrong: 'Can become overprotective, too traditional, or stifle growth through excessive care. May resist necessary changes.',
    whenStrongZh: '可能变得过度保护、过于传统，或通过过度关怀抑制成长。可能抵制必要的变化。',
    whenWeak: 'May lack support system, struggle with learning, or feel unprotected and unsupported.',
    whenWeakZh: '可能缺乏支持系统，学习困难，或感到没有保护和支持。',
    timingNotes: 'Favorable for learning, receiving support, and connecting with mentors. Good for academic pursuits and certification.',
    timingNotesZh: '有利于学习、获得支持和与导师联系。适合学术追求和认证。',
    archetype: 'The Teacher',
    archetypeZh: '教师'
  },
  {
    id: 'IR',
    name: 'Indirect Resource',
    nameZh: '偏印',
    element: 'Produces Day Master (opposite polarity)',
    relationship: 'Produces Day Master, opposite polarity',
    overview: 'Unconventional wisdom, intuition, esoteric knowledge, solitude, uniqueness.',
    overviewZh: '非传统智慧、直觉、神秘知识、独处、独特性。',
    personality: 'Intuitive, unconventional, drawn to esoteric or unusual knowledge. May be eccentric or solitary. Deep thinker.',
    personalityZh: '直觉、非传统、被神秘或不寻常的知识所吸引。可能古怪或孤独。深度思考者。',
    career: 'Research, occult studies, psychology, technology, invention, any field requiring unconventional thinking.',
    careerZh: '研究、神秘学、心理学、技术、发明，任何需要非传统思维的领域。',
    relationships: 'May struggle with conventional relationships. Needs space and understanding of unique nature. Can be emotionally distant.',
    relationshipsZh: '可能在传统关系中挣扎。需要空间和对独特性的理解。可能情感疏离。',
    whenStrong: 'Can become paranoid, isolated, or lost in unusual pursuits. May develop strange beliefs or habits.',
    whenStrongZh: '可能变得偏执、孤立或沉迷于不寻常的追求。可能形成奇怪的信仰或习惯。',
    whenWeak: 'May lack intuition, miss deeper patterns, or feel disconnected from spiritual or intellectual depth.',
    whenWeakZh: '可能缺乏直觉，错过更深的模式，或感到与精神或智力深度脱节。',
    timingNotes: 'Good for unusual studies, spiritual pursuits, and unconventional paths. Can indicate unexpected support or strange situations.',
    timingNotesZh: '适合不寻常的研究、精神追求和非传统道路。可能表示意外的支持或奇怪的情况。',
    archetype: 'The Mystic',
    archetypeZh: '神秘者'
  },
  {
    id: 'DW',
    name: 'Direct Wealth',
    nameZh: '正财',
    element: 'Controlled by Day Master (same polarity)',
    relationship: 'Day Master controls, same polarity',
    overview: 'Stable income, responsibility, reliability, conventional wealth, spouse (for males).',
    overviewZh: '稳定收入、责任、可靠性、传统财富、配偶（对男性而言）。',
    personality: 'Practical, responsible, focused on stability. Values steady income over risky gains. Reliable and methodical.',
    personalityZh: '务实、负责、专注于稳定。重视稳定收入而非风险收益。可靠和有条理。',
    career: 'Finance, accounting, banking, real estate, any field requiring steady management of resources.',
    careerZh: '金融、会计、银行、房地产，任何需要稳定管理资源的领域。',
    relationships: 'Values stable, committed relationships. For males, represents spouse. Loyal but may become possessive.',
    relationshipsZh: '重视稳定、承诺的关系。对男性来说，代表配偶。忠诚但可能变得占有欲强。',
    whenStrong: 'Can become materialistic, overly focused on money, or too cautious with finances. May prioritize security over growth.',
    whenStrongZh: '可能变得物质主义，过度关注金钱，或在财务上过于谨慎。可能优先考虑安全而非成长。',
    whenWeak: 'May struggle with finances, lack stability, or have difficulty managing resources effectively.',
    whenWeakZh: '可能在财务上挣扎，缺乏稳定性，或难以有效管理资源。',
    timingNotes: 'Favorable for stable income opportunities, property matters, and committed relationships. Good for financial planning.',
    timingNotesZh: '有利于稳定收入机会、房产事务和承诺关系。适合财务规划。',
    archetype: 'The Banker',
    archetypeZh: '银行家'
  },
  {
    id: 'IW',
    name: 'Indirect Wealth',
    nameZh: '偏财',
    element: 'Controlled by Day Master (opposite polarity)',
    relationship: 'Day Master controls, opposite polarity',
    overview: 'Windfall, speculation, generosity, social connections, multiple income streams.',
    overviewZh: '意外之财、投机、慷慨、社会关系、多重收入来源。',
    personality: 'Generous, socially adept, opportunity-seeking. Good at networking and finding unconventional income sources.',
    personalityZh: '慷慨、社交能力强、寻求机会。善于社交和寻找非传统收入来源。',
    career: 'Sales, networking, speculation, entertainment, any field requiring social connections and multiple revenue streams.',
    careerZh: '销售、社交、投机、娱乐，任何需要社会关系和多重收入来源的领域。',
    relationships: 'Charming and generous. May have multiple romantic interests or difficulty with monogamy. Values freedom.',
    relationshipsZh: '有魅力且慷慨。可能有多重浪漫兴趣或一夫一妻制的困难。重视自由。',
    whenStrong: 'Can become scattered, unfocused, or lose wealth as quickly as gained. May struggle with commitment.',
    whenStrongZh: '可能变得分散、不专注，或财富来得快去得也快。可能在承诺方面挣扎。',
    whenWeak: 'May lack social connections, miss opportunities, or struggle to find unconventional income sources.',
    whenWeakZh: '可能缺乏社会关系，错过机会，或难以找到非传统收入来源。',
    timingNotes: 'Good for unexpected gains, networking opportunities, and speculative ventures. Also indicates social/romantic opportunities.',
    timingNotesZh: '适合意外收获、社交机会和投机企业。也表示社交/浪漫机会。',
    archetype: 'The Networker',
    archetypeZh: '社交达人'
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Lookup Ten God interpretation by ID
 */
export function getTenGodInterpretation(id: TenGodId): TenGodInterpretation | undefined {
  return TEN_GOD_LIBRARY.find(tg => tg.id === id);
}

/**
 * Get all Ten Gods of a specific type (e.g., output gods, resource gods)
 */
export function getTenGodsByCategory(category: 'output' | 'resource' | 'wealth' | 'power' | 'peer'): TenGodInterpretation[] {
  const categoryMap: Record<string, TenGodId[]> = {
    output: ['EG', 'HO'],
    resource: ['DR', 'IR'],
    wealth: ['DW', 'IW'],
    power: ['DO', '7K'],
    peer: ['F', 'RW']
  };
  return TEN_GOD_LIBRARY.filter(tg => categoryMap[category]?.includes(tg.id));
}

/**
 * Format Ten God for display
 */
export function formatTenGodForDisplay(id: TenGodId, lang: 'en' | 'zh' = 'en'): string {
  const tg = getTenGodInterpretation(id);
  if (!tg) return '';

  if (lang === 'zh') {
    return `【${tg.nameZh}】\n${tg.overviewZh}\n\n性格：${tg.personalityZh}\n事业：${tg.careerZh}\n关系：${tg.relationshipsZh}`;
  }

  return `【${tg.name}】\n${tg.overview}\n\nPersonality: ${tg.personality}\nCareer: ${tg.career}\nRelationships: ${tg.relationships}`;
}

// ==================== EXPORTS ====================

export {
  getTenGodInterpretation,
  getTenGodsByCategory,
  formatTenGodForDisplay
};
