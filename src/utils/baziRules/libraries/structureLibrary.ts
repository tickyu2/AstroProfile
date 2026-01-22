/**
 * ============================================
 * STRUCTURE INTERPRETATION LIBRARY
 * Complete Scripture for All BaZi Structures
 *
 * Each structure type carries distinct themes:
 * - Life purpose
 * - Career orientations
 * - Relationship dynamics
 * - Balance indicators
 * ============================================
 */

// ==================== TYPES ====================

export type StructureType =
  | 'ProperWealth'
  | 'IndirectWealth'
  | 'ProperOfficer'
  | 'SevenKillings'
  | 'ProperResource'
  | 'IndirectResource'
  | 'ProperOutput'
  | 'IndirectOutput'
  | 'Companion'
  | 'RobWealth'
  | 'FollowStrong'
  | 'FollowWeak'
  | 'FollowWealth'
  | 'FollowKill'
  | 'FollowChild'
  | 'QuasiFollow'
  | 'Normal';

export interface StructureInterpretation {
  type: StructureType;
  name: string;
  nameZh: string;
  overview: string;
  overviewZh: string;
  lifeThemes: string;
  lifeThemesZh: string;
  careerThemes: string;
  careerThemesZh: string;
  relationshipThemes: string;
  relationshipThemesZh: string;
  whenBalanced: string;
  whenBalancedZh: string;
  whenImbalanced: string;
  whenImbalancedZh: string;
  usefulElements: string[];
  harmfulElements: string[];
  archetype: string;
  archetypeZh: string;
}

// ==================== LIBRARY ====================

export const STRUCTURE_LIBRARY: StructureInterpretation[] = [
  {
    type: 'ProperWealth',
    name: 'Wealth Structure',
    nameZh: '正财格',
    overview: 'Focus on resources, responsibility, tangible outcomes, and material stability.',
    overviewZh: '注重资源、责任、切实成果和物质稳定。',
    lifeThemes: 'Building, managing, and stabilizing material and practical aspects of life. Values security and tangible results.',
    lifeThemesZh: '建设、管理和稳定生活的物质和实际方面。重视安全和切实成果。',
    careerThemes: 'Business, finance, management, operations, real estate, banking—anything requiring steady resource management.',
    careerThemesZh: '商业、金融、管理、运营、房地产、银行业——任何需要稳定资源管理的工作。',
    relationshipThemes: 'Values reliability and contribution. May measure worth by what is provided. Practical expressions of love.',
    relationshipThemesZh: '重视可靠性和贡献。可能通过提供的东西来衡量价值。实际的爱情表达。',
    whenBalanced: 'Grounded, responsible, generous, and capable of long-term building. Steady prosperity.',
    whenBalancedZh: '脚踏实地、负责任、慷慨，能够长期建设。稳定繁荣。',
    whenImbalanced: 'Can become transactional, controlling, or overly focused on money and status at the expense of relationships.',
    whenImbalancedZh: '可能变得交易化、控制欲强，或过分关注金钱和地位而牺牲关系。',
    usefulElements: ['Officer', 'Resource'],
    harmfulElements: ['Rob Wealth', 'Companion'],
    archetype: 'The Builder',
    archetypeZh: '建设者'
  },
  {
    type: 'IndirectWealth',
    name: 'Indirect Wealth Structure',
    nameZh: '偏财格',
    overview: 'Multiple income streams, networking, opportunity-seeking, and social wealth creation.',
    overviewZh: '多重收入来源、社交、寻求机会和社会财富创造。',
    lifeThemes: 'Creating wealth through connections, opportunities, and unconventional means. Values freedom and variety.',
    lifeThemesZh: '通过联系、机会和非传统方式创造财富。重视自由和多样性。',
    careerThemes: 'Sales, networking, entertainment, speculation, multiple businesses, social enterprises.',
    careerThemesZh: '销售、社交、娱乐、投机、多重业务、社会企业。',
    relationshipThemes: 'Charming and generous but may struggle with commitment. Values excitement and variety in relationships.',
    relationshipThemesZh: '有魅力且慷慨，但可能在承诺方面挣扎。在关系中重视刺激和多样性。',
    whenBalanced: 'Socially gifted, generous, able to create opportunities from connections, and adaptable to change.',
    whenBalancedZh: '社交天赋、慷慨、能够从联系中创造机会、适应变化。',
    whenImbalanced: 'Scattered finances, relationship instability, or chasing opportunities without follow-through.',
    whenImbalancedZh: '财务分散、关系不稳定，或追逐机会而不坚持到底。',
    usefulElements: ['Officer', 'Output'],
    harmfulElements: ['Companion', 'Resource'],
    archetype: 'The Opportunist',
    archetypeZh: '机会主义者'
  },
  {
    type: 'ProperOfficer',
    name: 'Officer Structure',
    nameZh: '正官格',
    overview: 'Leadership, responsibility, reputation, structure, and conventional success.',
    overviewZh: '领导力、责任、声誉、结构和传统成功。',
    lifeThemes: 'Building reputation through proper channels, accepting responsibility, and earning recognition through merit.',
    lifeThemesZh: '通过正当渠道建立声誉、承担责任、通过实力赢得认可。',
    careerThemes: 'Government, corporate leadership, law, management, academia—any field with clear hierarchy.',
    careerThemesZh: '政府、企业领导、法律、管理、学术——任何有明确等级制度的领域。',
    relationshipThemes: 'Values commitment and stability. May be traditional in relationship expectations. Reliable partner.',
    relationshipThemesZh: '重视承诺和稳定。在关系期望中可能比较传统。可靠的伴侣。',
    whenBalanced: 'Respected leader, principled, and able to balance authority with compassion.',
    whenBalancedZh: '受尊敬的领导者、有原则、能够平衡权威与同情心。',
    whenImbalanced: 'Rigid, overly concerned with rules and reputation, or fear of stepping outside conventions.',
    whenImbalancedZh: '僵化、过度关注规则和声誉，或害怕打破传统。',
    usefulElements: ['Resource', 'Wealth'],
    harmfulElements: ['Hurting Officer', 'Seven Killings'],
    archetype: 'The Magistrate',
    archetypeZh: '长官'
  },
  {
    type: 'SevenKillings',
    name: 'Seven Killings Structure',
    nameZh: '七杀格',
    overview: 'Intensity, power, transformation, crisis management, and unconventional authority.',
    overviewZh: '强度、权力、转变、危机管理和非传统权威。',
    lifeThemes: 'Transforming through challenges, wielding power, and thriving in high-stakes environments.',
    lifeThemesZh: '通过挑战转变、行使权力、在高风险环境中茁壮成长。',
    careerThemes: 'Military, surgery, martial arts, crisis management, competitive industries, entrepreneurship.',
    careerThemesZh: '军事、外科、武术、危机管理、竞争行业、创业。',
    relationshipThemes: 'Intense relationships with power dynamics. May attract or create conflict. Needs strong partner.',
    relationshipThemesZh: '有权力动态的强烈关系。可能吸引或制造冲突。需要强大的伴侣。',
    whenBalanced: 'Courageous, transformative, able to handle crisis with composure, and channel intensity productively.',
    whenBalancedZh: '勇敢、变革性、能够从容应对危机、并有建设性地引导强度。',
    whenImbalanced: 'Destructive, aggressive, accident-prone, or attracting conflict and enemies.',
    whenImbalancedZh: '破坏性、攻击性、易发生事故，或吸引冲突和敌人。',
    usefulElements: ['Resource', 'Eating God'],
    harmfulElements: ['Wealth', 'Companion'],
    archetype: 'The Warrior',
    archetypeZh: '战士'
  },
  {
    type: 'ProperResource',
    name: 'Resource Structure',
    nameZh: '正印格',
    overview: 'Wisdom, nurturing, education, protection, and traditional knowledge.',
    overviewZh: '智慧、滋养、教育、保护和传统知识。',
    lifeThemes: 'Learning, teaching, nurturing others, and preserving wisdom and traditions.',
    lifeThemesZh: '学习、教学、滋养他人，以及保存智慧和传统。',
    careerThemes: 'Education, research, healthcare, counseling, writing, academia.',
    careerThemesZh: '教育、研究、医疗保健、咨询、写作、学术。',
    relationshipThemes: 'Nurturing and supportive. May mother partners. Values intellectual and emotional connection.',
    relationshipThemesZh: '滋养和支持。可能母性化伴侣。重视智力和情感连接。',
    whenBalanced: 'Wise, supportive, good teacher, able to receive and transmit knowledge effectively.',
    whenBalancedZh: '智慧、支持、好老师、能够有效接受和传递知识。',
    whenImbalanced: 'Overprotective, too traditional, or using knowledge to control rather than empower.',
    whenImbalancedZh: '过度保护、过于传统，或用知识控制而非赋能。',
    usefulElements: ['Officer', 'Wealth'],
    harmfulElements: ['Output', 'Companion'],
    archetype: 'The Sage',
    archetypeZh: '智者'
  },
  {
    type: 'IndirectResource',
    name: 'Indirect Resource Structure',
    nameZh: '偏印格',
    overview: 'Unconventional wisdom, intuition, esoteric knowledge, and unique perspectives.',
    overviewZh: '非传统智慧、直觉、神秘知识和独特视角。',
    lifeThemes: 'Exploring unusual paths of knowledge, developing intuition, and embracing uniqueness.',
    lifeThemesZh: '探索不寻常的知识路径、发展直觉和拥抱独特性。',
    careerThemes: 'Research, technology, psychology, occult, astrology, invention, unconventional fields.',
    careerThemesZh: '研究、技术、心理学、神秘学、占星术、发明、非传统领域。',
    relationshipThemes: 'May struggle with conventional relationships. Needs understanding of unique nature.',
    relationshipThemesZh: '可能在传统关系中挣扎。需要对独特性的理解。',
    whenBalanced: 'Innovative, intuitive, able to see patterns others miss, and comfortable with uniqueness.',
    whenBalancedZh: '创新、直觉、能够看到他人遗漏的模式，并对独特性感到舒适。',
    whenImbalanced: 'Isolated, paranoid, lost in unusual beliefs, or disconnected from practical reality.',
    whenImbalancedZh: '孤立、偏执、迷失在不寻常的信仰中，或与实际现实脱节。',
    usefulElements: ['Seven Killings', 'Wealth'],
    harmfulElements: ['Eating God', 'Companion'],
    archetype: 'The Mystic',
    archetypeZh: '神秘者'
  },
  {
    type: 'ProperOutput',
    name: 'Output Structure',
    nameZh: '食神格',
    overview: 'Expression, creativity, visibility, influence, and artistic achievement.',
    overviewZh: '表达、创造力、可见性、影响力和艺术成就。',
    lifeThemes: 'Sharing ideas, creating, performing, teaching, or broadcasting to the world.',
    lifeThemesZh: '分享想法、创造、表演、教学，或向世界传播。',
    careerThemes: 'Art, media, teaching, design, content creation, public roles, entertainment.',
    careerThemesZh: '艺术、媒体、教学、设计、内容创作、公共角色、娱乐。',
    relationshipThemes: 'Needs to be seen and heard. May overshare or dominate conversations. Expressive in love.',
    relationshipThemesZh: '需要被看到和听到。可能过度分享或主导对话。在爱情中善于表达。',
    whenBalanced: 'Inspiring, expressive, generative, and able to create beauty and meaning.',
    whenBalancedZh: '鼓舞人心、善于表达、有创造力，并能够创造美和意义。',
    whenImbalanced: 'Scattered, dramatic, attention-seeking, or depleting self through excessive output.',
    whenImbalancedZh: '分散、戏剧化、寻求关注，或通过过度输出耗尽自己。',
    usefulElements: ['Wealth', 'Resource'],
    harmfulElements: ['Officer', 'Companion'],
    archetype: 'The Artist',
    archetypeZh: '艺术家'
  },
  {
    type: 'IndirectOutput',
    name: 'Hurting Officer Structure',
    nameZh: '伤官格',
    overview: 'Innovation, rebellion, sharp expression, challenging norms, and bold performance.',
    overviewZh: '创新、叛逆、尖锐表达、挑战规范和大胆表演。',
    lifeThemes: 'Breaking conventions, innovating, expressing controversial views, and performing boldly.',
    lifeThemesZh: '打破传统、创新、表达争议性观点和大胆表演。',
    careerThemes: 'Performance, innovation, disruption, advocacy, law (arguing), media, entertainment.',
    careerThemesZh: '表演、创新、颠覆、倡导、法律（辩护）、媒体、娱乐。',
    relationshipThemes: 'May challenge partner or struggle with traditional roles. Direct communication style.',
    relationshipThemesZh: '可能挑战伴侣或在传统角色中挣扎。直接的沟通风格。',
    whenBalanced: 'Innovative, courageous in expression, able to challenge constructively, and authentic.',
    whenBalancedZh: '创新、在表达中勇敢、能够建设性地挑战，并真实。',
    whenImbalanced: 'Destructively critical, alienating others, or sabotaging relationships with authority.',
    whenImbalancedZh: '破坏性地批评、疏远他人，或破坏与权威的关系。',
    usefulElements: ['Wealth', 'Resource'],
    harmfulElements: ['Officer'],
    archetype: 'The Rebel',
    archetypeZh: '叛逆者'
  },
  {
    type: 'Companion',
    name: 'Companion Structure',
    nameZh: '比肩格',
    overview: 'Independence, self-reliance, peer relationships, and competitive drive.',
    overviewZh: '独立、自立、同辈关系和竞争动力。',
    lifeThemes: 'Developing independence, competing with peers, and building through self-reliance.',
    lifeThemesZh: '发展独立性、与同辈竞争，并通过自立建设。',
    careerThemes: 'Entrepreneurship, athletics, sales, consulting, freelancing—independent work.',
    careerThemesZh: '创业、体育、销售、咨询、自由职业——独立工作。',
    relationshipThemes: 'May compete with partner. Needs space for independence. Best with equally strong partners.',
    relationshipThemesZh: '可能与伴侣竞争。需要独立空间。最适合同样强大的伴侣。',
    whenBalanced: 'Self-confident, independent, able to both compete and collaborate effectively.',
    whenBalancedZh: '自信、独立、能够有效地竞争和合作。',
    whenImbalanced: 'Overly competitive, stubborn, resource-draining through rivalry, or isolated.',
    whenImbalancedZh: '过度竞争、固执、因竞争而消耗资源，或孤立。',
    usefulElements: ['Output', 'Officer'],
    harmfulElements: ['Wealth'],
    archetype: 'The Competitor',
    archetypeZh: '竞争者'
  },
  {
    type: 'RobWealth',
    name: 'Rob Wealth Structure',
    nameZh: '劫财格',
    overview: 'Bold ambition, risk-taking, financial fluctuations, and competitive drive.',
    overviewZh: '大胆野心、冒险、财务波动和竞争动力。',
    lifeThemes: 'Taking risks, competing for resources, and building through bold action.',
    lifeThemesZh: '冒险、争夺资源，并通过大胆行动建设。',
    careerThemes: 'High-risk ventures, speculation, sales, negotiation, athletics, competitive fields.',
    careerThemesZh: '高风险企业、投机、销售、谈判、体育、竞争领域。',
    relationshipThemes: 'May compete with partner for resources or attention. Needs dynamic relationship.',
    relationshipThemesZh: '可能与伴侣争夺资源或关注。需要动态关系。',
    whenBalanced: 'Bold, action-oriented, able to create opportunity through calculated risks.',
    whenBalancedZh: '大胆、行动导向、能够通过有计算的风险创造机会。',
    whenImbalanced: 'Financial losses, relationship conflicts, or self-destructive risk-taking.',
    whenImbalancedZh: '财务损失、关系冲突，或自我毁灭性的冒险。',
    usefulElements: ['Output', 'Officer'],
    harmfulElements: ['Wealth', 'Resource'],
    archetype: 'The Gambler',
    archetypeZh: '赌徒'
  },
  {
    type: 'FollowStrong',
    name: 'Follow Strong Structure',
    nameZh: '从强格',
    overview: 'Yielding to supportive forces, finding power through alignment, and flowing with strength.',
    overviewZh: '顺从支持力量、通过协调找到力量、随强而流。',
    lifeThemes: 'Achieving through surrender to dominant supportive energies in the chart.',
    lifeThemesZh: '通过顺从命盘中主导的支持能量来实现。',
    careerThemes: 'Fields aligned with the supporting element. Success through working with natural talents.',
    careerThemesZh: '与支持元素一致的领域。通过发挥天赋取得成功。',
    relationshipThemes: 'Needs supportive partner who strengthens rather than challenges.',
    relationshipThemesZh: '需要支持而非挑战的伴侣。',
    whenBalanced: 'Effortless achievement, natural flow, and authentic expression of inherent nature.',
    whenBalancedZh: '毫不费力的成就、自然流动，以及固有本性的真实表达。',
    whenImbalanced: 'Pattern broken by opposing elements, leading to struggle and confusion.',
    whenImbalancedZh: '格局被对立元素破坏，导致挣扎和困惑。',
    usefulElements: ['Resource', 'Companion'],
    harmfulElements: ['Wealth', 'Officer'],
    archetype: 'The Sage',
    archetypeZh: '智者'
  },
  {
    type: 'FollowWealth',
    name: 'Follow Wealth Structure',
    nameZh: '从财格',
    overview: 'Destiny aligned with wealth creation through yielding to financial opportunities.',
    overviewZh: '命运与财富创造一致，通过顺从财务机会。',
    lifeThemes: 'Success comes through material pursuits, business, and embracing wealth energy.',
    lifeThemesZh: '成功来自物质追求、商业和拥抱财富能量。',
    careerThemes: 'Business, finance, commerce, trade—anything wealth-related.',
    careerThemesZh: '商业、金融、商业、贸易——任何与财富相关的。',
    relationshipThemes: 'Partner often brings financial opportunity or stability.',
    relationshipThemesZh: '伴侣通常带来财务机会或稳定。',
    whenBalanced: 'Natural wealth magnetism, business success, and material abundance.',
    whenBalancedZh: '天然的财富磁力、商业成功和物质丰富。',
    whenImbalanced: 'Resource or Companion elements disrupting pattern cause financial struggles.',
    whenImbalancedZh: '资源或同类元素破坏格局导致财务困难。',
    usefulElements: ['Wealth', 'Output'],
    harmfulElements: ['Resource', 'Companion'],
    archetype: 'The Merchant Prince',
    archetypeZh: '商业王子'
  },
  {
    type: 'FollowKill',
    name: 'Follow Killings Structure',
    nameZh: '从杀格',
    overview: 'Power through yielding to controlling forces and transforming pressure into strength.',
    overviewZh: '通过顺从控制力量并将压力转化为力量来获得权力。',
    lifeThemes: 'Achieving through embracing challenge, authority, and transformative pressure.',
    lifeThemesZh: '通过拥抱挑战、权威和变革性压力来实现。',
    careerThemes: 'Leadership under pressure, military, surgery, crisis roles, positions of authority.',
    careerThemesZh: '压力下的领导、军事、外科、危机角色、权威职位。',
    relationshipThemes: 'Intense relationships with clear power dynamics. Partner may be authority figure.',
    relationshipThemesZh: '有明确权力动态的强烈关系。伴侣可能是权威人物。',
    whenBalanced: 'Powerful, respected, able to wield authority effectively.',
    whenBalancedZh: '强大、受尊重、能够有效行使权威。',
    whenImbalanced: 'Resource or Companion elements cause power struggles and conflict.',
    whenImbalancedZh: '资源或同类元素导致权力斗争和冲突。',
    usefulElements: ['Officer', 'Seven Killings', 'Wealth'],
    harmfulElements: ['Resource', 'Companion'],
    archetype: 'The Dark Knight',
    archetypeZh: '黑暗骑士'
  },
  {
    type: 'FollowChild',
    name: 'Follow Child Structure',
    nameZh: '从儿格',
    overview: 'Achievement through creative expression and yielding to output energy.',
    overviewZh: '通过创意表达和顺从输出能量来实现。',
    lifeThemes: 'Living to create, express, and inspire. Success through artistic or intellectual output.',
    lifeThemesZh: '为创造、表达和激励而生。通过艺术或智力输出取得成功。',
    careerThemes: 'Arts, entertainment, education, writing, any creative or expressive field.',
    careerThemesZh: '艺术、娱乐、教育、写作，任何创意或表达领域。',
    relationshipThemes: 'May prioritize creation over relationship. Needs partner who supports creative life.',
    relationshipThemesZh: '可能将创作置于关系之上。需要支持创意生活的伴侣。',
    whenBalanced: 'Prolific creativity, artistic legacy, and inspiring others through expression.',
    whenBalancedZh: '多产的创造力、艺术遗产，并通过表达激励他人。',
    whenImbalanced: 'Resource or Companion elements block creative flow and cause frustration.',
    whenImbalancedZh: '资源或同类元素阻塞创意流动并导致挫折。',
    usefulElements: ['Output', 'Wealth'],
    harmfulElements: ['Resource', 'Companion'],
    archetype: 'The Creative Genius',
    archetypeZh: '创意天才'
  },
  {
    type: 'QuasiFollow',
    name: 'Quasi-Follow Structure',
    nameZh: '假从格',
    overview: 'Near-follow pattern with minor support for Day Master, creating partial surrender.',
    overviewZh: '接近从格，对日主有少许支持，形成部分顺从。',
    lifeThemes: 'Balance between following dominant forces and maintaining some independence.',
    lifeThemesZh: '在顺从主导力量和保持一定独立性之间取得平衡。',
    careerThemes: 'Depends on which element dominates; partial success in aligned fields.',
    careerThemesZh: '取决于哪种元素主导；在相关领域取得部分成功。',
    relationshipThemes: 'May oscillate between dependence and independence in relationships.',
    relationshipThemesZh: '可能在关系中在依赖和独立之间摇摆。',
    whenBalanced: 'Adaptive, able to work with both independence and support.',
    whenBalancedZh: '适应性强、能够同时处理独立和支持。',
    whenImbalanced: 'Confusion about direction, incomplete surrender causing struggle.',
    whenImbalancedZh: '对方向感到困惑，不完全的顺从导致挣扎。',
    usefulElements: ['Varies by dominant element'],
    harmfulElements: ['Elements that disrupt the quasi-pattern'],
    archetype: 'The Adaptable One',
    archetypeZh: '适应者'
  },
  {
    type: 'Normal',
    name: 'Normal Structure',
    nameZh: '普通格',
    overview: 'Balanced chart without dominant structure, requiring individual element analysis.',
    overviewZh: '没有主导结构的平衡命盘，需要个别元素分析。',
    lifeThemes: 'Balanced life requiring attention to individual strengths and weaknesses.',
    lifeThemesZh: '需要关注个人优势和劣势的平衡生活。',
    careerThemes: 'Flexible career options based on individual element balance.',
    careerThemesZh: '根据个人元素平衡的灵活职业选择。',
    relationshipThemes: 'Balanced relationships, adaptable to various partner types.',
    relationshipThemesZh: '平衡的关系，适应各种伴侣类型。',
    whenBalanced: 'Versatile, adaptable, and able to succeed in multiple areas.',
    whenBalancedZh: '多才多艺、适应性强，能够在多个领域取得成功。',
    whenImbalanced: 'May lack focus or clear direction; needs to identify personal useful god.',
    whenImbalancedZh: '可能缺乏重点或明确方向；需要确定个人用神。',
    usefulElements: ['Based on individual analysis'],
    harmfulElements: ['Based on individual analysis'],
    archetype: 'The Balanced One',
    archetypeZh: '平衡者'
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Lookup structure interpretation by type
 */
export function getStructureInterpretation(type: StructureType): StructureInterpretation | undefined {
  return STRUCTURE_LIBRARY.find(s => s.type === type);
}

/**
 * Get all follow structures
 */
export function getFollowStructures(): StructureInterpretation[] {
  return STRUCTURE_LIBRARY.filter(s =>
    s.type.startsWith('Follow') || s.type === 'QuasiFollow'
  );
}

/**
 * Get all normal (non-follow) structures
 */
export function getNormalStructures(): StructureInterpretation[] {
  return STRUCTURE_LIBRARY.filter(s =>
    !s.type.startsWith('Follow') && s.type !== 'QuasiFollow'
  );
}

/**
 * Format structure for display
 */
export function formatStructureForDisplay(type: StructureType, lang: 'en' | 'zh' = 'en'): string {
  const struct = getStructureInterpretation(type);
  if (!struct) return '';

  if (lang === 'zh') {
    return `【${struct.nameZh}】\n${struct.overviewZh}\n\n人生主题：${struct.lifeThemesZh}\n事业主题：${struct.careerThemesZh}\n关系主题：${struct.relationshipThemesZh}`;
  }

  return `【${struct.name}】\n${struct.overview}\n\nLife Themes: ${struct.lifeThemes}\nCareer Themes: ${struct.careerThemes}\nRelationship Themes: ${struct.relationshipThemes}`;
}

// ==================== EXPORTS ====================

export {
  getStructureInterpretation,
  getFollowStructures,
  getNormalStructures,
  formatStructureForDisplay
};
