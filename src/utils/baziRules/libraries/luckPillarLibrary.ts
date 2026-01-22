/**
 * ============================================
 * LUCK PILLAR INTERPRETATION LIBRARY
 * Complete Scripture for 60 Jia-Zi Combinations
 *
 * Each 10-year Luck Pillar (大运) carries:
 * - General themes and energy
 * - Career implications
 * - Relationship patterns
 * - Inner development work
 * ============================================
 */

// ==================== TYPES ====================

export interface LuckPillarInterpretation {
  stem: string;
  stemZh: string;
  branch: string;
  branchZh: string;
  pillarZh: string;
  overview: string;
  overviewZh: string;
  lifeThemes: string;
  lifeThemesZh: string;
  careerThemes: string;
  careerThemesZh: string;
  relationshipThemes: string;
  relationshipThemesZh: string;
  innerWork: string;
  innerWorkZh: string;
  element: string;
  polarity: 'Yang' | 'Yin';
  animal: string;
  animalZh: string;
}

// ==================== STEM MEANINGS ====================

const STEM_MEANINGS: Record<string, { en: string; zh: string; element: string; polarity: 'Yang' | 'Yin' }> = {
  Jia: { en: 'Pioneer energy, growth initiation, leadership thrust', zh: '开拓能量、成长启动、领导冲劲', element: 'Wood', polarity: 'Yang' },
  Yi: { en: 'Gentle growth, flexibility, artistic flow', zh: '柔和成长、灵活性、艺术流动', element: 'Wood', polarity: 'Yin' },
  Bing: { en: 'Radiant visibility, passion, public presence', zh: '光芒可见、热情、公众存在', element: 'Fire', polarity: 'Yang' },
  Ding: { en: 'Refined warmth, insight, subtle transformation', zh: '精致温暖、洞察力、微妙转变', element: 'Fire', polarity: 'Yin' },
  Wu: { en: 'Solid foundation, stability, grounded authority', zh: '稳固基础、稳定、扎根权威', element: 'Earth', polarity: 'Yang' },
  Ji: { en: 'Nurturing stability, cultivation, patient growth', zh: '滋养稳定、培育、耐心成长', element: 'Earth', polarity: 'Yin' },
  Geng: { en: 'Decisive action, reform, structural change', zh: '果断行动、改革、结构变化', element: 'Metal', polarity: 'Yang' },
  Xin: { en: 'Refined precision, aesthetic discernment, polished output', zh: '精炼精确、审美辨别、精致产出', element: 'Metal', polarity: 'Yin' },
  Ren: { en: 'Expansive flow, networking, wisdom accumulation', zh: '广阔流动、社交网络、智慧积累', element: 'Water', polarity: 'Yang' },
  Gui: { en: 'Deep insight, intuition, hidden transformation', zh: '深度洞察、直觉、隐藏转变', element: 'Water', polarity: 'Yin' }
};

// ==================== BRANCH MEANINGS ====================

const BRANCH_MEANINGS: Record<string, { en: string; zh: string; animal: string; animalZh: string; element: string }> = {
  Zi: { en: 'New beginnings, hidden potential, midnight clarity', zh: '新开始、隐藏潜力、子夜清明', animal: 'Rat', animalZh: '鼠', element: 'Water' },
  Chou: { en: 'Patient accumulation, steady progress, winter storage', zh: '耐心积累、稳步前进、冬季储存', animal: 'Ox', animalZh: '牛', element: 'Earth' },
  Yin: { en: 'Spring awakening, ambitious growth, tiger courage', zh: '春天觉醒、雄心成长、虎之勇气', animal: 'Tiger', animalZh: '虎', element: 'Wood' },
  Mao: { en: 'Full bloom, diplomatic grace, gentle expansion', zh: '盛开绽放、外交风度、温和扩展', animal: 'Rabbit', animalZh: '兔', element: 'Wood' },
  Chen: { en: 'Transformative power, ambitious drive, dragon magic', zh: '变革力量、雄心驱动、龙之魔力', animal: 'Dragon', animalZh: '龙', element: 'Earth' },
  Si: { en: 'Wisdom refinement, strategic insight, snake intuition', zh: '智慧精炼、战略洞察、蛇之直觉', animal: 'Snake', animalZh: '蛇', element: 'Fire' },
  Wu: { en: 'Peak performance, public recognition, horse freedom', zh: '巅峰表现、公众认可、马之自由', animal: 'Horse', animalZh: '马', element: 'Fire' },
  Wei: { en: 'Artistic expression, nurturing growth, gentle creativity', zh: '艺术表达、滋养成长、温柔创造', animal: 'Goat', animalZh: '羊', element: 'Earth' },
  Shen: { en: 'Clever solutions, adaptive intelligence, monkey wit', zh: '聪明解决、适应智慧、猴之机智', animal: 'Monkey', animalZh: '猴', element: 'Metal' },
  You: { en: 'Refined output, precise timing, rooster precision', zh: '精炼产出、精确时机、鸡之精准', animal: 'Rooster', animalZh: '鸡', element: 'Metal' },
  Xu: { en: 'Loyal protection, transformation gateway, dog fidelity', zh: '忠诚保护、转变门户、犬之忠诚', animal: 'Dog', animalZh: '狗', element: 'Earth' },
  Hai: { en: 'Completion cycles, deep reflection, pig contentment', zh: '完成周期、深度反思、猪之满足', animal: 'Pig', animalZh: '猪', element: 'Water' }
};

// ==================== 60 JIA-ZI LIBRARY ====================

export const LUCK_PILLAR_LIBRARY: LuckPillarInterpretation[] = [
  // ===== CYCLE 1: Jia (甲) =====
  {
    stem: 'Jia', stemZh: '甲', branch: 'Zi', branchZh: '子', pillarZh: '甲子',
    element: 'Wood', polarity: 'Yang', animal: 'Rat', animalZh: '鼠',
    overview: 'A powerful period of new beginnings and pioneering ventures. The strong Wood energy sits atop the Water of Zi, creating excellent conditions for growth and initiative.',
    overviewZh: '新开始和开拓性事业的强大时期。强劲的木能量坐于子的水之上，为成长和主动性创造了良好条件。',
    lifeThemes: 'Fresh starts, career launches, educational pursuits, building foundations for long-term growth.',
    lifeThemesZh: '全新开始、事业启动、教育追求、为长期成长奠定基础。',
    careerThemes: 'Leadership opportunities, starting new projects, educational advancement, creative entrepreneurship.',
    careerThemesZh: '领导机会、启动新项目、教育进步、创意创业。',
    relationshipThemes: 'New connections, nurturing relationships with potential, supportive partnerships for growth.',
    relationshipThemesZh: '新的联系、培养有潜力的关系、支持成长的伙伴关系。',
    innerWork: 'Cultivating patience for the growth process, balancing ambition with wisdom, trusting the timing of development.',
    innerWorkZh: '培养对成长过程的耐心、平衡雄心与智慧、相信发展的时机。'
  },
  {
    stem: 'Jia', stemZh: '甲', branch: 'Xu', branchZh: '戌', pillarZh: '甲戌',
    element: 'Wood', polarity: 'Yang', animal: 'Dog', animalZh: '狗',
    overview: 'Wood energy meets the storage vault of Earth. A period of establishing structures and loyal commitments while maintaining growth momentum.',
    overviewZh: '木能量遇到土的储存库。建立结构和忠诚承诺的时期，同时保持成长势头。',
    lifeThemes: 'Building lasting structures, establishing loyal relationships, balancing growth with stability.',
    lifeThemesZh: '建立持久结构、建立忠诚关系、平衡成长与稳定。',
    careerThemes: 'Leadership in established organizations, building teams, creating lasting systems.',
    careerThemesZh: '在既有组织中的领导、建立团队、创建持久系统。',
    relationshipThemes: 'Loyal partnerships, committed relationships, family building.',
    relationshipThemesZh: '忠诚的伙伴关系、承诺的关系、家庭建设。',
    innerWork: 'Learning to balance innovation with tradition, growing roots while reaching upward.',
    innerWorkZh: '学习平衡创新与传统，在向上发展的同时扎根。'
  },
  {
    stem: 'Jia', stemZh: '甲', branch: 'Shen', branchZh: '申', pillarZh: '甲申',
    element: 'Wood', polarity: 'Yang', animal: 'Monkey', animalZh: '猴',
    overview: 'Wood meets Metal in tension. A period requiring adaptability and clever solutions to overcome obstacles.',
    overviewZh: '木遇金产生张力。需要适应性和聪明解决方案来克服障碍的时期。',
    lifeThemes: 'Overcoming obstacles through intelligence, adapting plans, learning from challenges.',
    lifeThemesZh: '通过智慧克服障碍、调整计划、从挑战中学习。',
    careerThemes: 'Problem-solving roles, technology adaptation, strategic pivots, consulting.',
    careerThemesZh: '解决问题的角色、技术适应、战略转型、咨询。',
    relationshipThemes: 'Working through differences, finding clever compromises, intellectual connections.',
    relationshipThemesZh: '解决分歧、找到聪明的妥协、智力连接。',
    innerWork: 'Developing resilience, learning to bend without breaking, finding creative solutions.',
    innerWorkZh: '培养韧性、学会弯曲而不断裂、找到创造性解决方案。'
  },
  {
    stem: 'Jia', stemZh: '甲', branch: 'Wu', branchZh: '午', pillarZh: '甲午',
    element: 'Wood', polarity: 'Yang', animal: 'Horse', animalZh: '马',
    overview: 'Wood fuels Fire brilliantly. A period of high visibility, passion, and rapid expansion of influence.',
    overviewZh: '木生火辉煌。高可见度、热情和影响力快速扩展的时期。',
    lifeThemes: 'Public recognition, passionate pursuits, freedom and expansion, peak performance.',
    lifeThemesZh: '公众认可、热情追求、自由和扩展、巅峰表现。',
    careerThemes: 'Public-facing roles, entertainment, marketing, leadership visibility, entrepreneurship.',
    careerThemesZh: '面向公众的角色、娱乐、营销、领导可见度、创业。',
    relationshipThemes: 'Passionate connections, exciting relationships, romantic adventures.',
    relationshipThemesZh: '热情的联系、令人兴奋的关系、浪漫冒险。',
    innerWork: 'Managing the ego with success, sustaining energy without burnout, staying grounded during expansion.',
    innerWorkZh: '在成功中管理自我、保持能量而不倦怠、在扩展中保持脚踏实地。'
  },
  {
    stem: 'Jia', stemZh: '甲', branch: 'Chen', branchZh: '辰', pillarZh: '甲辰',
    element: 'Wood', polarity: 'Yang', animal: 'Dragon', animalZh: '龙',
    overview: 'Wood rooted in the Dragon\'s treasure vault. A period of ambitious transformation and powerful growth.',
    overviewZh: '木扎根于龙的宝库。雄心勃勃的转变和强劲增长的时期。',
    lifeThemes: 'Major life transformations, ambitious projects, leveraging hidden resources.',
    lifeThemesZh: '重大人生转变、雄心勃勃的项目、利用隐藏资源。',
    careerThemes: 'Leadership transformation, accessing hidden opportunities, building empires.',
    careerThemesZh: '领导力转型、获取隐藏机会、建立帝国。',
    relationshipThemes: 'Transformative partnerships, powerful alliances, dragon-like protection.',
    relationshipThemesZh: '变革性伙伴关系、强大联盟、龙般的保护。',
    innerWork: 'Embracing transformation, accessing inner power, aligning ambition with integrity.',
    innerWorkZh: '拥抱转变、获取内在力量、将雄心与诚信对齐。'
  },
  {
    stem: 'Jia', stemZh: '甲', branch: 'Yin', branchZh: '寅', pillarZh: '甲寅',
    element: 'Wood', polarity: 'Yang', animal: 'Tiger', animalZh: '虎',
    overview: 'Double Wood power - Jia sitting in its home. A period of maximum growth energy, courage, and pioneering spirit.',
    overviewZh: '双木力量——甲坐在自己的家中。最大成长能量、勇气和开拓精神的时期。',
    lifeThemes: 'Bold initiatives, courageous expansion, maximum growth potential, leadership emergence.',
    lifeThemesZh: '大胆举措、勇敢扩展、最大成长潜力、领导力涌现。',
    careerThemes: 'Entrepreneurship, leadership positions, pioneering new fields, bold career moves.',
    careerThemesZh: '创业、领导职位、开拓新领域、大胆的职业举措。',
    relationshipThemes: 'Courageous love, protecting loved ones, building family legacy.',
    relationshipThemesZh: '勇敢的爱、保护亲人、建立家族遗产。',
    innerWork: 'Channeling courage constructively, balancing boldness with wisdom, sustainable leadership.',
    innerWorkZh: '建设性地引导勇气、平衡大胆与智慧、可持续的领导力。'
  },

  // ===== CYCLE 2: Yi (乙) =====
  {
    stem: 'Yi', stemZh: '乙', branch: 'Chou', branchZh: '丑', pillarZh: '乙丑',
    element: 'Wood', polarity: 'Yin', animal: 'Ox', animalZh: '牛',
    overview: 'Gentle Wood in winter storage. A period of patient cultivation, steady accumulation, and artistic development.',
    overviewZh: '柔和的木在冬季储存中。耐心培养、稳步积累和艺术发展的时期。',
    lifeThemes: 'Patient growth, artistic refinement, building quietly, steady accumulation.',
    lifeThemesZh: '耐心成长、艺术精炼、默默建设、稳步积累。',
    careerThemes: 'Artistic careers, patient skill building, behind-scenes work, gradual advancement.',
    careerThemesZh: '艺术事业、耐心技能建设、幕后工作、逐步晋升。',
    relationshipThemes: 'Patient relationship building, steady commitment, nurturing bonds.',
    relationshipThemesZh: '耐心建立关系、稳定承诺、培育情感。',
    innerWork: 'Developing patience, trusting slow growth, finding beauty in the process.',
    innerWorkZh: '培养耐心、相信缓慢成长、在过程中发现美。'
  },
  {
    stem: 'Yi', stemZh: '乙', branch: 'Hai', branchZh: '亥', pillarZh: '乙亥',
    element: 'Wood', polarity: 'Yin', animal: 'Pig', animalZh: '猪',
    overview: 'Gentle Wood nourished by deep Water. A period of creative flow, artistic inspiration, and contented growth.',
    overviewZh: '柔和的木由深水滋养。创意流动、艺术灵感和满足成长的时期。',
    lifeThemes: 'Creative abundance, spiritual growth, contented development, artistic flow.',
    lifeThemesZh: '创意丰富、精神成长、满足的发展、艺术流动。',
    careerThemes: 'Creative industries, writing, music, spiritual work, healing arts.',
    careerThemesZh: '创意产业、写作、音乐、精神工作、治愈艺术。',
    relationshipThemes: 'Deeply nurturing connections, spiritual partnerships, creative collaboration.',
    relationshipThemesZh: '深度滋养的连接、精神伙伴关系、创意合作。',
    innerWork: 'Allowing creative flow, trusting intuition, finding contentment in the journey.',
    innerWorkZh: '允许创意流动、相信直觉、在旅途中找到满足。'
  },
  {
    stem: 'Yi', stemZh: '乙', branch: 'You', branchZh: '酉', pillarZh: '乙酉',
    element: 'Wood', polarity: 'Yin', animal: 'Rooster', animalZh: '鸡',
    overview: 'Gentle Wood pruned by Metal precision. A period of refinement through challenge, artistic precision.',
    overviewZh: '柔和的木被金的精确修剪。通过挑战精炼、艺术精确的时期。',
    lifeThemes: 'Refinement through challenge, precision in craft, learning from critique.',
    lifeThemesZh: '通过挑战精炼、工艺精确、从批评中学习。',
    careerThemes: 'Precision crafts, refined arts, quality focus, working with critics.',
    careerThemesZh: '精密工艺、精致艺术、质量关注、与评论家合作。',
    relationshipThemes: 'Learning from differences, refining communication, appreciating contrast.',
    relationshipThemesZh: '从差异中学习、精炼沟通、欣赏对比。',
    innerWork: 'Accepting constructive criticism, growing through pruning, finding strength in flexibility.',
    innerWorkZh: '接受建设性批评、通过修剪成长、在灵活性中找到力量。'
  },
  {
    stem: 'Yi', stemZh: '乙', branch: 'Wei', branchZh: '未', pillarZh: '乙未',
    element: 'Wood', polarity: 'Yin', animal: 'Goat', animalZh: '羊',
    overview: 'Gentle Wood in nurturing Earth. A period of artistic expression, gentle cultivation, and creative abundance.',
    overviewZh: '柔和的木在滋养的土中。艺术表达、温和培育和创意丰富的时期。',
    lifeThemes: 'Artistic expression, nurturing creativity, gentle growth, community building.',
    lifeThemesZh: '艺术表达、滋养创造力、温和成长、社区建设。',
    careerThemes: 'Arts and crafts, community leadership, nurturing professions, design.',
    careerThemesZh: '艺术和工艺、社区领导、滋养性职业、设计。',
    relationshipThemes: 'Artistic partnerships, nurturing bonds, creative family life.',
    relationshipThemesZh: '艺术伙伴关系、滋养情感、创意家庭生活。',
    innerWork: 'Expressing creativity gently, nurturing self and others, finding artistic voice.',
    innerWorkZh: '温和地表达创意、滋养自己和他人、找到艺术声音。'
  },
  {
    stem: 'Yi', stemZh: '乙', branch: 'Si', branchZh: '巳', pillarZh: '乙巳',
    element: 'Wood', polarity: 'Yin', animal: 'Snake', animalZh: '蛇',
    overview: 'Gentle Wood transformed by Fire. A period of creative refinement, strategic wisdom, and subtle influence.',
    overviewZh: '柔和的木被火转化。创意精炼、战略智慧和微妙影响的时期。',
    lifeThemes: 'Strategic creativity, wisdom cultivation, subtle influence, refined expression.',
    lifeThemesZh: '战略创意、智慧培养、微妙影响、精炼表达。',
    careerThemes: 'Strategic consulting, refined arts, diplomatic roles, wisdom professions.',
    careerThemesZh: '战略咨询、精致艺术、外交角色、智慧职业。',
    relationshipThemes: 'Intuitive connections, wise partnerships, transformative relationships.',
    relationshipThemesZh: '直觉连接、智慧伙伴关系、变革性关系。',
    innerWork: 'Developing intuition, strategic patience, transforming creativity into wisdom.',
    innerWorkZh: '培养直觉、战略耐心、将创造力转化为智慧。'
  },
  {
    stem: 'Yi', stemZh: '乙', branch: 'Mao', branchZh: '卯', pillarZh: '乙卯',
    element: 'Wood', polarity: 'Yin', animal: 'Rabbit', animalZh: '兔',
    overview: 'Gentle Wood in its home - maximum artistic and diplomatic energy. A period of full creative bloom.',
    overviewZh: '柔和的木在自己的家中——最大的艺术和外交能量。完全创意绽放的时期。',
    lifeThemes: 'Full artistic bloom, diplomatic success, graceful achievement, creative peak.',
    lifeThemesZh: '完全艺术绽放、外交成功、优雅成就、创意巅峰。',
    careerThemes: 'Arts, diplomacy, design, counseling, any role requiring grace and creativity.',
    careerThemesZh: '艺术、外交、设计、咨询，任何需要优雅和创造力的角色。',
    relationshipThemes: 'Harmonious partnerships, diplomatic relationships, artistic collaboration.',
    relationshipThemesZh: '和谐的伙伴关系、外交关系、艺术合作。',
    innerWork: 'Embracing full creative expression, diplomatic mastery, graceful influence.',
    innerWorkZh: '拥抱完整的创意表达、外交精通、优雅影响。'
  },

  // ===== CYCLE 3: Bing (丙) =====
  {
    stem: 'Bing', stemZh: '丙', branch: 'Zi', branchZh: '子', pillarZh: '丙子',
    element: 'Fire', polarity: 'Yang', animal: 'Rat', animalZh: '鼠',
    overview: 'Radiant Fire over deep Water - tension between visibility and introspection. A period of balancing public life with inner wisdom.',
    overviewZh: '光芒四射的火在深水之上——可见性与内省之间的张力。平衡公共生活与内在智慧的时期。',
    lifeThemes: 'Balancing visibility with depth, public success with private wisdom, external and internal.',
    lifeThemesZh: '平衡可见性与深度、公共成功与私人智慧、外部与内部。',
    careerThemes: 'Public roles requiring depth, media with substance, leadership with wisdom.',
    careerThemesZh: '需要深度的公共角色、有实质的媒体、有智慧的领导。',
    relationshipThemes: 'Deep connections with visible partners, balancing privacy and publicity.',
    relationshipThemesZh: '与可见伴侣的深度连接、平衡隐私和公开。',
    innerWork: 'Integrating public persona with private self, finding wisdom in visibility.',
    innerWorkZh: '整合公众形象与私人自我、在可见性中找到智慧。'
  },
  {
    stem: 'Bing', stemZh: '丙', branch: 'Xu', branchZh: '戌', pillarZh: '丙戌',
    element: 'Fire', polarity: 'Yang', animal: 'Dog', animalZh: '狗',
    overview: 'Radiant Fire in Earth storage. A period of establishing lasting visibility and loyal influence.',
    overviewZh: '光芒四射的火在土的储存中。建立持久可见性和忠诚影响的时期。',
    lifeThemes: 'Lasting recognition, loyal following, sustained visibility, grounded fame.',
    lifeThemesZh: '持久认可、忠诚追随、持续可见性、扎根的名声。',
    careerThemes: 'Building lasting reputation, loyal team leadership, sustained public presence.',
    careerThemesZh: '建立持久声誉、忠诚团队领导、持续公众存在。',
    relationshipThemes: 'Loyal and visible partnerships, protective relationships, lasting bonds.',
    relationshipThemesZh: '忠诚和可见的伙伴关系、保护性关系、持久情感。',
    innerWork: 'Creating sustainable visibility, balancing passion with loyalty, grounded radiance.',
    innerWorkZh: '创造可持续的可见性、平衡热情与忠诚、扎根的光芒。'
  },
  {
    stem: 'Bing', stemZh: '丙', branch: 'Shen', branchZh: '申', pillarZh: '丙申',
    element: 'Fire', polarity: 'Yang', animal: 'Monkey', animalZh: '猴',
    overview: 'Radiant Fire illuminating Metal intelligence. A period of clever visibility and strategic brilliance.',
    overviewZh: '光芒四射的火照亮金的智慧。聪明可见性和战略光彩的时期。',
    lifeThemes: 'Strategic visibility, clever public moves, illuminating intelligence.',
    lifeThemesZh: '战略可见性、聪明的公众举措、照亮智慧。',
    careerThemes: 'Technology leadership, strategic communications, innovative public roles.',
    careerThemesZh: '技术领导、战略沟通、创新公众角色。',
    relationshipThemes: 'Clever partnerships, intellectually stimulating connections, adaptive relationships.',
    relationshipThemesZh: '聪明的伙伴关系、智力刺激的连接、适应性关系。',
    innerWork: 'Balancing brilliance with warmth, using intelligence visibly, adaptive radiance.',
    innerWorkZh: '平衡光彩与温暖、可见地使用智慧、适应性光芒。'
  },
  {
    stem: 'Bing', stemZh: '丙', branch: 'Wu', branchZh: '午', pillarZh: '丙午',
    element: 'Fire', polarity: 'Yang', animal: 'Horse', animalZh: '马',
    overview: 'Maximum Fire energy - Bing in its home. A period of peak visibility, passion, and radiant success.',
    overviewZh: '最大火能量——丙在自己的家中。巅峰可见性、热情和光芒成功的时期。',
    lifeThemes: 'Peak recognition, maximum passion, radiant achievement, freedom and fame.',
    lifeThemesZh: '巅峰认可、最大热情、光芒成就、自由与名声。',
    careerThemes: 'Star careers, peak public visibility, entertainment, passionate leadership.',
    careerThemesZh: '明星事业、巅峰公众可见性、娱乐、热情领导。',
    relationshipThemes: 'Passionate romances, exciting partnerships, high-visibility relationships.',
    relationshipThemesZh: '热情浪漫、令人兴奋的伙伴关系、高可见性关系。',
    innerWork: 'Managing fame sustainably, channeling passion constructively, staying humble in brilliance.',
    innerWorkZh: '可持续地管理名声、建设性地引导热情、在光彩中保持谦逊。'
  },
  {
    stem: 'Bing', stemZh: '丙', branch: 'Chen', branchZh: '辰', pillarZh: '丙辰',
    element: 'Fire', polarity: 'Yang', animal: 'Dragon', animalZh: '龙',
    overview: 'Radiant Fire in Dragon\'s reservoir. A period of transformative visibility and powerful recognition.',
    overviewZh: '光芒四射的火在龙的水库中。变革性可见性和强大认可的时期。',
    lifeThemes: 'Transformative fame, powerful visibility, dragon-like radiance.',
    lifeThemesZh: '变革性名声、强大可见性、龙般的光芒。',
    careerThemes: 'Transformative leadership, powerful public roles, visionary positions.',
    careerThemesZh: '变革性领导、强大公众角色、有远见的职位。',
    relationshipThemes: 'Powerful partnerships, transformative connections, legendary relationships.',
    relationshipThemesZh: '强大伙伴关系、变革性连接、传奇关系。',
    innerWork: 'Using power and visibility responsibly, transforming others through radiance.',
    innerWorkZh: '负责任地使用权力和可见性、通过光芒转变他人。'
  },
  {
    stem: 'Bing', stemZh: '丙', branch: 'Yin', branchZh: '寅', pillarZh: '丙寅',
    element: 'Fire', polarity: 'Yang', animal: 'Tiger', animalZh: '虎',
    overview: 'Radiant Fire fueled by Tiger\'s Wood. A period of bold visibility and courageous public presence.',
    overviewZh: '光芒四射的火由虎的木助燃。大胆可见性和勇敢公众存在的时期。',
    lifeThemes: 'Courageous visibility, bold public moves, pioneering recognition.',
    lifeThemesZh: '勇敢的可见性、大胆的公众举措、开拓性认可。',
    careerThemes: 'Bold leadership, pioneering public roles, courageous entrepreneurship.',
    careerThemesZh: '大胆领导、开拓性公众角色、勇敢创业。',
    relationshipThemes: 'Courageous love, passionate protection, bold partnerships.',
    relationshipThemesZh: '勇敢的爱、热情保护、大胆伙伴关系。',
    innerWork: 'Channeling courage into visible achievement, bold yet sustainable brilliance.',
    innerWorkZh: '将勇气引导到可见成就、大胆而可持续的光彩。'
  },

  // ===== CYCLE 4: Ding (丁) =====
  {
    stem: 'Ding', stemZh: '丁', branch: 'Chou', branchZh: '丑', pillarZh: '丁丑',
    element: 'Fire', polarity: 'Yin', animal: 'Ox', animalZh: '牛',
    overview: 'Refined Fire in winter storage. A period of patient illumination and steady warmth.',
    overviewZh: '精致的火在冬季储存中。耐心照亮和稳定温暖的时期。',
    lifeThemes: 'Patient illumination, steady warmth, quiet influence, accumulated insight.',
    lifeThemesZh: '耐心照亮、稳定温暖、安静影响、积累洞察。',
    careerThemes: 'Research, counseling, teaching, patient leadership, behind-scenes influence.',
    careerThemesZh: '研究、咨询、教学、耐心领导、幕后影响。',
    relationshipThemes: 'Steady warmth in relationships, patient nurturing, quiet devotion.',
    relationshipThemesZh: '关系中的稳定温暖、耐心培育、安静奉献。',
    innerWork: 'Cultivating patient insight, finding warmth in stillness, quiet transformation.',
    innerWorkZh: '培养耐心洞察、在静止中找到温暖、安静转变。'
  },
  {
    stem: 'Ding', stemZh: '丁', branch: 'Hai', branchZh: '亥', pillarZh: '丁亥',
    element: 'Fire', polarity: 'Yin', animal: 'Pig', animalZh: '猪',
    overview: 'Refined Fire challenged by deep Water. A period of finding insight through depth and reflection.',
    overviewZh: '精致的火被深水挑战。通过深度和反思找到洞察的时期。',
    lifeThemes: 'Deep reflection, finding light in darkness, transformative insight.',
    lifeThemesZh: '深度反思、在黑暗中找到光明、变革性洞察。',
    careerThemes: 'Psychology, spiritual counseling, deep research, transformative healing.',
    careerThemesZh: '心理学、精神咨询、深度研究、变革性治愈。',
    relationshipThemes: 'Deep emotional connections, finding warmth in intimacy, transformative bonds.',
    relationshipThemesZh: '深度情感连接、在亲密中找到温暖、变革性情感。',
    innerWork: 'Finding inner light in challenges, transforming darkness into insight.',
    innerWorkZh: '在挑战中找到内在光明、将黑暗转化为洞察。'
  },
  {
    stem: 'Ding', stemZh: '丁', branch: 'You', branchZh: '酉', pillarZh: '丁酉',
    element: 'Fire', polarity: 'Yin', animal: 'Rooster', animalZh: '鸡',
    overview: 'Refined Fire illuminating Metal precision. A period of insightful refinement and precise warmth.',
    overviewZh: '精致的火照亮金的精确。洞察精炼和精确温暖的时期。',
    lifeThemes: 'Precise insight, refined warmth, discriminating wisdom, polished expression.',
    lifeThemesZh: '精确洞察、精炼温暖、辨别智慧、精致表达。',
    careerThemes: 'Precision arts, refined counseling, quality-focused work, detailed analysis.',
    careerThemesZh: '精密艺术、精炼咨询、关注质量的工作、详细分析。',
    relationshipThemes: 'Refined connections, precise communication, quality relationships.',
    relationshipThemesZh: '精炼连接、精确沟通、高质量关系。',
    innerWork: 'Refining insight through precision, polishing warmth, discerning wisdom.',
    innerWorkZh: '通过精确精炼洞察、磨练温暖、辨别智慧。'
  },
  {
    stem: 'Ding', stemZh: '丁', branch: 'Wei', branchZh: '未', pillarZh: '丁未',
    element: 'Fire', polarity: 'Yin', animal: 'Goat', animalZh: '羊',
    overview: 'Refined Fire in nurturing Earth. A period of warm cultivation and gentle transformation.',
    overviewZh: '精致的火在滋养的土中。温暖培养和温和转变的时期。',
    lifeThemes: 'Gentle warmth, nurturing insight, artistic transformation, community warmth.',
    lifeThemesZh: '温和温暖、滋养洞察、艺术转变、社区温暖。',
    careerThemes: 'Nurturing professions, artistic expression, community leadership, healing arts.',
    careerThemesZh: '滋养性职业、艺术表达、社区领导、治愈艺术。',
    relationshipThemes: 'Warm nurturing bonds, artistic partnerships, gentle transformative love.',
    relationshipThemesZh: '温暖滋养的情感、艺术伙伴关系、温和变革性的爱。',
    innerWork: 'Cultivating gentle warmth, nurturing self and others through insight.',
    innerWorkZh: '培养温和温暖、通过洞察滋养自己和他人。'
  },
  {
    stem: 'Ding', stemZh: '丁', branch: 'Si', branchZh: '巳', pillarZh: '丁巳',
    element: 'Fire', polarity: 'Yin', animal: 'Snake', animalZh: '蛇',
    overview: 'Refined Fire in its home - maximum Ding energy. A period of peak insight, wisdom, and subtle influence.',
    overviewZh: '精致的火在自己的家中——最大丁能量。巅峰洞察、智慧和微妙影响的时期。',
    lifeThemes: 'Peak insight, maximum wisdom, subtle but powerful influence.',
    lifeThemesZh: '巅峰洞察、最大智慧、微妙但强大的影响。',
    careerThemes: 'Wisdom professions, strategic counseling, intuitive leadership, deep teaching.',
    careerThemesZh: '智慧职业、战略咨询、直觉领导、深度教学。',
    relationshipThemes: 'Deeply intuitive connections, wise partnerships, transformative bonds.',
    relationshipThemesZh: '深度直觉连接、智慧伙伴关系、变革性情感。',
    innerWork: 'Embracing full wisdom capacity, subtle yet powerful transformation, intuitive mastery.',
    innerWorkZh: '拥抱完整智慧能力、微妙而强大的转变、直觉精通。'
  },
  {
    stem: 'Ding', stemZh: '丁', branch: 'Mao', branchZh: '卯', pillarZh: '丁卯',
    element: 'Fire', polarity: 'Yin', animal: 'Rabbit', animalZh: '兔',
    overview: 'Refined Fire fueled by gentle Wood. A period of artistic insight and graceful transformation.',
    overviewZh: '精致的火由柔和的木助燃。艺术洞察和优雅转变的时期。',
    lifeThemes: 'Artistic insight, graceful transformation, creative wisdom, diplomatic warmth.',
    lifeThemesZh: '艺术洞察、优雅转变、创意智慧、外交温暖。',
    careerThemes: 'Creative leadership, artistic counseling, design with depth, graceful influence.',
    careerThemesZh: '创意领导、艺术咨询、有深度的设计、优雅影响。',
    relationshipThemes: 'Graceful partnerships, artistic love, creative transformation together.',
    relationshipThemesZh: '优雅伙伴关系、艺术之爱、一起创意转变。',
    innerWork: 'Integrating artistry with insight, graceful wisdom, creative transformation.',
    innerWorkZh: '整合艺术与洞察、优雅智慧、创意转变。'
  },

  // ===== CYCLE 5: Wu (戊) =====
  {
    stem: 'Wu', stemZh: '戊', branch: 'Zi', branchZh: '子', pillarZh: '戊子',
    element: 'Earth', polarity: 'Yang', animal: 'Rat', animalZh: '鼠',
    overview: 'Mountain Earth over deep Water. A period of grounded wisdom and stable foundation-building.',
    overviewZh: '山土在深水之上。扎根智慧和稳定基础建设的时期。',
    lifeThemes: 'Stable foundations, grounded wisdom, practical intelligence, lasting structure.',
    lifeThemesZh: '稳定基础、扎根智慧、实际智慧、持久结构。',
    careerThemes: 'Real estate, management, operations, practical consulting, structural work.',
    careerThemesZh: '房地产、管理、运营、实际咨询、结构性工作。',
    relationshipThemes: 'Stable partnerships, grounded love, practical support in relationships.',
    relationshipThemesZh: '稳定伙伴关系、扎根之爱、关系中的实际支持。',
    innerWork: 'Building inner stability, grounding wisdom, creating lasting inner structures.',
    innerWorkZh: '建立内在稳定、扎根智慧、创造持久的内在结构。'
  },
  {
    stem: 'Wu', stemZh: '戊', branch: 'Xu', branchZh: '戌', pillarZh: '戊戌',
    element: 'Earth', polarity: 'Yang', animal: 'Dog', animalZh: '狗',
    overview: 'Double Earth energy - ultimate stability and loyal grounding. A period of maximum foundation strength.',
    overviewZh: '双土能量——终极稳定和忠诚扎根。最大基础力量的时期。',
    lifeThemes: 'Maximum stability, loyal foundations, protective structures, lasting commitments.',
    lifeThemesZh: '最大稳定、忠诚基础、保护性结构、持久承诺。',
    careerThemes: 'Property development, institutional leadership, protective services, long-term management.',
    careerThemesZh: '房产开发、机构领导、保护服务、长期管理。',
    relationshipThemes: 'Deeply loyal bonds, protective partnerships, family foundation building.',
    relationshipThemesZh: '深度忠诚情感、保护性伙伴关系、家庭基础建设。',
    innerWork: 'Creating unshakeable inner stability, loyal self-commitment, protective boundaries.',
    innerWorkZh: '创造不可动摇的内在稳定、忠诚的自我承诺、保护性边界。'
  },
  {
    stem: 'Wu', stemZh: '戊', branch: 'Shen', branchZh: '申', pillarZh: '戊申',
    element: 'Earth', polarity: 'Yang', animal: 'Monkey', animalZh: '猴',
    overview: 'Stable Earth producing Metal intelligence. A period of practical wisdom and structured innovation.',
    overviewZh: '稳定的土产生金的智慧。实际智慧和结构化创新的时期。',
    lifeThemes: 'Practical intelligence, structured innovation, clever foundations, systematic progress.',
    lifeThemesZh: '实际智慧、结构化创新、聪明基础、系统进步。',
    careerThemes: 'Technology management, systematic innovation, practical engineering, structured consulting.',
    careerThemesZh: '技术管理、系统创新、实际工程、结构化咨询。',
    relationshipThemes: 'Clever partnerships, intellectual stability, problem-solving together.',
    relationshipThemesZh: '聪明伙伴关系、智力稳定、一起解决问题。',
    innerWork: 'Integrating practicality with cleverness, stable yet adaptive foundations.',
    innerWorkZh: '整合实用性与聪明、稳定而适应性的基础。'
  },
  {
    stem: 'Wu', stemZh: '戊', branch: 'Wu', branchZh: '午', pillarZh: '戊午',
    element: 'Earth', polarity: 'Yang', animal: 'Horse', animalZh: '马',
    overview: 'Stable Earth energized by Fire. A period of grounded passion and visible stability.',
    overviewZh: '稳定的土被火能量激活。扎根热情和可见稳定的时期。',
    lifeThemes: 'Visible stability, passionate grounding, energized foundations, dynamic structure.',
    lifeThemesZh: '可见稳定、热情扎根、能量充沛的基础、动态结构。',
    careerThemes: 'Public management, visible leadership, energetic operations, hospitality.',
    careerThemesZh: '公共管理、可见领导、充满活力的运营、酒店业。',
    relationshipThemes: 'Passionate stability, exciting yet grounded love, dynamic partnerships.',
    relationshipThemesZh: '热情稳定、令人兴奋而扎根的爱、动态伙伴关系。',
    innerWork: 'Balancing passion with stability, grounded enthusiasm, sustainable energy.',
    innerWorkZh: '平衡热情与稳定、扎根的热情、可持续能量。'
  },
  {
    stem: 'Wu', stemZh: '戊', branch: 'Chen', branchZh: '辰', pillarZh: '戊辰',
    element: 'Earth', polarity: 'Yang', animal: 'Dragon', animalZh: '龙',
    overview: 'Mountain Earth in Dragon\'s reservoir - powerful Earth energy. A period of transformative stability.',
    overviewZh: '山土在龙的水库中——强大的土能量。变革性稳定的时期。',
    lifeThemes: 'Powerful foundations, transformative stability, accessing deep resources.',
    lifeThemesZh: '强大基础、变革性稳定、获取深层资源。',
    careerThemes: 'Major developments, transformative management, resource extraction, powerful operations.',
    careerThemesZh: '重大发展、变革性管理、资源开发、强大运营。',
    relationshipThemes: 'Powerful partnerships, transformative commitments, dragon-strength bonds.',
    relationshipThemesZh: '强大伙伴关系、变革性承诺、龙之力量的情感。',
    innerWork: 'Accessing deep inner resources, transformative grounding, powerful stability.',
    innerWorkZh: '获取深层内在资源、变革性扎根、强大稳定。'
  },
  {
    stem: 'Wu', stemZh: '戊', branch: 'Yin', branchZh: '寅', pillarZh: '戊寅',
    element: 'Earth', polarity: 'Yang', animal: 'Tiger', animalZh: '虎',
    overview: 'Stable Earth challenged by Wood growth. A period of structured expansion and grounded courage.',
    overviewZh: '稳定的土被木的成长挑战。结构化扩展和扎根勇气的时期。',
    lifeThemes: 'Structured growth, grounded courage, stable expansion, foundational pioneering.',
    lifeThemesZh: '结构化成长、扎根勇气、稳定扩展、基础性开拓。',
    careerThemes: 'Structured entrepreneurship, grounded leadership, stable innovation.',
    careerThemesZh: '结构化创业、扎根领导、稳定创新。',
    relationshipThemes: 'Courageous stability, pioneering partnerships with foundations.',
    relationshipThemesZh: '勇敢的稳定、有基础的开拓性伙伴关系。',
    innerWork: 'Balancing stability with growth, grounded courage, structured expansion.',
    innerWorkZh: '平衡稳定与成长、扎根的勇气、结构化扩展。'
  },

  // ===== CYCLE 6: Ji (己) =====
  {
    stem: 'Ji', stemZh: '己', branch: 'Chou', branchZh: '丑', pillarZh: '己丑',
    element: 'Earth', polarity: 'Yin', animal: 'Ox', animalZh: '牛',
    overview: 'Nurturing Earth in maximum storage. A period of patient cultivation and deep nourishment.',
    overviewZh: '滋养的土在最大储存中。耐心培养和深度滋养的时期。',
    lifeThemes: 'Deep cultivation, patient nurturing, accumulated nourishment, winter preparation.',
    lifeThemesZh: '深度培养、耐心滋养、积累的营养、冬季准备。',
    careerThemes: 'Agriculture, patient management, nurturing professions, long-term cultivation.',
    careerThemesZh: '农业、耐心管理、滋养性职业、长期培养。',
    relationshipThemes: 'Patient nurturing, deep cultivation of bonds, accumulated love.',
    relationshipThemesZh: '耐心滋养、深度培养情感、积累的爱。',
    innerWork: 'Deep self-cultivation, patient inner growth, accumulated wisdom.',
    innerWorkZh: '深度自我培养、耐心内在成长、积累的智慧。'
  },
  {
    stem: 'Ji', stemZh: '己', branch: 'Hai', branchZh: '亥', pillarZh: '己亥',
    element: 'Earth', polarity: 'Yin', animal: 'Pig', animalZh: '猪',
    overview: 'Nurturing Earth meeting deep Water. A period of fertile cultivation and abundant nourishment.',
    overviewZh: '滋养的土遇到深水。肥沃培养和丰富营养的时期。',
    lifeThemes: 'Fertile abundance, deep nourishment, contented cultivation, spiritual grounding.',
    lifeThemesZh: '肥沃丰富、深度滋养、满足培养、精神扎根。',
    careerThemes: 'Abundant cultivation, spiritual professions, nurturing with depth.',
    careerThemesZh: '丰富培养、精神职业、有深度的滋养。',
    relationshipThemes: 'Deeply nurturing bonds, fertile partnerships, contented love.',
    relationshipThemesZh: '深度滋养情感、肥沃伙伴关系、满足之爱。',
    innerWork: 'Finding abundance in nurturing, deep spiritual grounding, fertile inner life.',
    innerWorkZh: '在滋养中找到丰富、深度精神扎根、肥沃的内在生活。'
  },
  {
    stem: 'Ji', stemZh: '己', branch: 'You', branchZh: '酉', pillarZh: '己酉',
    element: 'Earth', polarity: 'Yin', animal: 'Rooster', animalZh: '鸡',
    overview: 'Nurturing Earth producing Metal precision. A period of refined cultivation and precise nourishment.',
    overviewZh: '滋养的土产生金的精确。精炼培养和精确滋养的时期。',
    lifeThemes: 'Refined nurturing, precise cultivation, discerning nourishment, quality growth.',
    lifeThemesZh: '精炼滋养、精确培养、辨别营养、高质量成长。',
    careerThemes: 'Quality-focused nurturing, precise management, refined cultivation.',
    careerThemesZh: '关注质量的滋养、精确管理、精炼培养。',
    relationshipThemes: 'Refined care, precise nurturing, quality-focused bonds.',
    relationshipThemesZh: '精炼关怀、精确滋养、关注质量的情感。',
    innerWork: 'Refining self-care, precise inner cultivation, discerning self-nurturing.',
    innerWorkZh: '精炼自我关怀、精确内在培养、辨别性自我滋养。'
  },
  {
    stem: 'Ji', stemZh: '己', branch: 'Wei', branchZh: '未', pillarZh: '己未',
    element: 'Earth', polarity: 'Yin', animal: 'Goat', animalZh: '羊',
    overview: 'Maximum nurturing Earth energy - Ji in its home. A period of peak cultivation and abundant care.',
    overviewZh: '最大滋养土能量——己在自己的家中。巅峰培养和丰富关怀的时期。',
    lifeThemes: 'Maximum nurturing, peak cultivation, abundant care, creative nourishment.',
    lifeThemesZh: '最大滋养、巅峰培养、丰富关怀、创意营养。',
    careerThemes: 'Peak nurturing professions, abundant cultivation, creative caretaking.',
    careerThemesZh: '巅峰滋养职业、丰富培养、创意照顾。',
    relationshipThemes: 'Abundant love, peak nurturing, creative partnerships.',
    relationshipThemesZh: '丰富之爱、巅峰滋养、创意伙伴关系。',
    innerWork: 'Embracing full nurturing capacity, abundant self-care, creative inner growth.',
    innerWorkZh: '拥抱完整滋养能力、丰富自我关怀、创意内在成长。'
  },
  {
    stem: 'Ji', stemZh: '己', branch: 'Si', branchZh: '巳', pillarZh: '己巳',
    element: 'Earth', polarity: 'Yin', animal: 'Snake', animalZh: '蛇',
    overview: 'Nurturing Earth warmed by Fire. A period of insightful cultivation and wise nourishment.',
    overviewZh: '滋养的土被火温暖。洞察培养和智慧滋养的时期。',
    lifeThemes: 'Wise nurturing, insightful cultivation, strategic care, transformative growth.',
    lifeThemesZh: '智慧滋养、洞察培养、战略关怀、变革性成长。',
    careerThemes: 'Strategic nurturing, wise management, insightful cultivation.',
    careerThemesZh: '战略滋养、智慧管理、洞察培养。',
    relationshipThemes: 'Wise care, intuitive nurturing, transformative partnerships.',
    relationshipThemesZh: '智慧关怀、直觉滋养、变革性伙伴关系。',
    innerWork: 'Cultivating with wisdom, intuitive self-care, transformative inner nurturing.',
    innerWorkZh: '用智慧培养、直觉自我关怀、变革性内在滋养。'
  },
  {
    stem: 'Ji', stemZh: '己', branch: 'Mao', branchZh: '卯', pillarZh: '己卯',
    element: 'Earth', polarity: 'Yin', animal: 'Rabbit', animalZh: '兔',
    overview: 'Nurturing Earth challenged by Wood. A period of growth through nurturing and cultivated flexibility.',
    overviewZh: '滋养的土被木挑战。通过滋养成长和培养灵活性的时期。',
    lifeThemes: 'Nurturing growth, flexible cultivation, diplomatic care, artistic nourishment.',
    lifeThemesZh: '滋养成长、灵活培养、外交关怀、艺术营养。',
    careerThemes: 'Creative nurturing, artistic cultivation, diplomatic management.',
    careerThemesZh: '创意滋养、艺术培养、外交管理。',
    relationshipThemes: 'Nurturing creative partners, flexible love, artistic bonds.',
    relationshipThemesZh: '滋养创意伙伴、灵活之爱、艺术情感。',
    innerWork: 'Balancing nurturing with growth, flexible self-care, creative cultivation.',
    innerWorkZh: '平衡滋养与成长、灵活自我关怀、创意培养。'
  },

  // ===== CYCLE 7: Geng (庚) =====
  {
    stem: 'Geng', stemZh: '庚', branch: 'Zi', branchZh: '子', pillarZh: '庚子',
    element: 'Metal', polarity: 'Yang', animal: 'Rat', animalZh: '鼠',
    overview: 'Decisive Metal over deep Water. A period of sharp intelligence and decisive wisdom.',
    overviewZh: '果断的金在深水之上。锐利智慧和果断智力的时期。',
    lifeThemes: 'Sharp wisdom, decisive intelligence, structural clarity, precise beginnings.',
    lifeThemesZh: '锐利智慧、果断智力、结构清晰、精确开始。',
    careerThemes: 'Financial analysis, legal work, strategic consulting, precision industries.',
    careerThemesZh: '金融分析、法律工作、战略咨询、精密产业。',
    relationshipThemes: 'Clear communication, defined boundaries, intelligent partnerships.',
    relationshipThemesZh: '清晰沟通、明确边界、智慧伙伴关系。',
    innerWork: 'Sharpening wisdom, decisive clarity, structural inner organization.',
    innerWorkZh: '磨砺智慧、果断清晰、结构化内在组织。'
  },
  {
    stem: 'Geng', stemZh: '庚', branch: 'Xu', branchZh: '戌', pillarZh: '庚戌',
    element: 'Metal', polarity: 'Yang', animal: 'Dog', animalZh: '狗',
    overview: 'Decisive Metal in Earth storage. A period of structured reform and loyal refinement.',
    overviewZh: '果断的金在土的储存中。结构化改革和忠诚精炼的时期。',
    lifeThemes: 'Structural reform, loyal decisions, protected refinement, lasting precision.',
    lifeThemesZh: '结构化改革、忠诚决策、受保护的精炼、持久精确。',
    careerThemes: 'Institutional reform, protective legal work, loyal management, quality systems.',
    careerThemesZh: '机构改革、保护性法律工作、忠诚管理、质量系统。',
    relationshipThemes: 'Loyal precision, protected partnerships, structured commitments.',
    relationshipThemesZh: '忠诚精确、受保护的伙伴关系、结构化承诺。',
    innerWork: 'Creating lasting inner structures, loyal self-discipline, protected refinement.',
    innerWorkZh: '创建持久内在结构、忠诚自律、受保护的精炼。'
  },
  {
    stem: 'Geng', stemZh: '庚', branch: 'Shen', branchZh: '申', pillarZh: '庚申',
    element: 'Metal', polarity: 'Yang', animal: 'Monkey', animalZh: '猴',
    overview: 'Maximum Metal energy - Geng in its home. A period of peak decisiveness and maximum reform power.',
    overviewZh: '最大金能量——庚在自己的家中。巅峰果断和最大改革力量的时期。',
    lifeThemes: 'Maximum decisiveness, peak reform, powerful precision, structural mastery.',
    lifeThemesZh: '最大果断、巅峰改革、强大精确、结构精通。',
    careerThemes: 'Major reforms, decisive leadership, powerful precision work, peak financial success.',
    careerThemesZh: '重大改革、果断领导、强大精确工作、巅峰财务成功。',
    relationshipThemes: 'Clear powerful bonds, decisive partnerships, structural relationships.',
    relationshipThemesZh: '清晰强大的情感、果断伙伴关系、结构化关系。',
    innerWork: 'Embracing full decisiveness, powerful self-discipline, mastering inner structure.',
    innerWorkZh: '拥抱完整果断、强大自律、精通内在结构。'
  },
  {
    stem: 'Geng', stemZh: '庚', branch: 'Wu', branchZh: '午', pillarZh: '庚午',
    element: 'Metal', polarity: 'Yang', animal: 'Horse', animalZh: '马',
    overview: 'Decisive Metal refined by Fire. A period of visible reform and passionate precision.',
    overviewZh: '果断的金被火精炼。可见改革和热情精确的时期。',
    lifeThemes: 'Visible reform, passionate precision, refined through fire, tested decisions.',
    lifeThemesZh: '可见改革、热情精确、火中精炼、经受考验的决策。',
    careerThemes: 'Public reform work, visible leadership, tested precision, refined excellence.',
    careerThemesZh: '公共改革工作、可见领导、经受考验的精确、精炼卓越。',
    relationshipThemes: 'Passionate clarity, refined partnerships, tested commitments.',
    relationshipThemesZh: '热情清晰、精炼伙伴关系、经受考验的承诺。',
    innerWork: 'Refining through challenges, passionate discipline, tested inner strength.',
    innerWorkZh: '通过挑战精炼、热情纪律、经受考验的内在力量。'
  },
  {
    stem: 'Geng', stemZh: '庚', branch: 'Chen', branchZh: '辰', pillarZh: '庚辰',
    element: 'Metal', polarity: 'Yang', animal: 'Dragon', animalZh: '龙',
    overview: 'Decisive Metal in Dragon\'s treasury. A period of powerful reform and transformative precision.',
    overviewZh: '果断的金在龙的宝库中。强大改革和变革性精确的时期。',
    lifeThemes: 'Powerful reform, transformative precision, accessing deep structural resources.',
    lifeThemesZh: '强大改革、变革性精确、获取深层结构资源。',
    careerThemes: 'Major structural changes, transformative leadership, powerful precision work.',
    careerThemesZh: '重大结构变化、变革性领导、强大精确工作。',
    relationshipThemes: 'Transformative partnerships, powerful commitments, dragon-strength decisions.',
    relationshipThemesZh: '变革性伙伴关系、强大承诺、龙之力量的决策。',
    innerWork: 'Accessing deep structural power, transformative self-discipline, powerful inner reform.',
    innerWorkZh: '获取深层结构力量、变革性自律、强大内在改革。'
  },
  {
    stem: 'Geng', stemZh: '庚', branch: 'Yin', branchZh: '寅', pillarZh: '庚寅',
    element: 'Metal', polarity: 'Yang', animal: 'Tiger', animalZh: '虎',
    overview: 'Decisive Metal facing Wood challenge. A period of reform through growth and precision through courage.',
    overviewZh: '果断的金面对木的挑战。通过成长改革和通过勇气精确的时期。',
    lifeThemes: 'Courageous reform, growth through precision, decisive expansion.',
    lifeThemesZh: '勇敢改革、通过精确成长、果断扩展。',
    careerThemes: 'Pioneering reform, structural innovation, courageous leadership.',
    careerThemesZh: '开拓性改革、结构创新、勇敢领导。',
    relationshipThemes: 'Courageous clarity, pioneering partnerships, decisive growth together.',
    relationshipThemesZh: '勇敢清晰、开拓性伙伴关系、一起果断成长。',
    innerWork: 'Balancing precision with growth, courageous self-discipline, expanding structure.',
    innerWorkZh: '平衡精确与成长、勇敢自律、扩展结构。'
  },

  // ===== CYCLE 8: Xin (辛) =====
  {
    stem: 'Xin', stemZh: '辛', branch: 'Chou', branchZh: '丑', pillarZh: '辛丑',
    element: 'Metal', polarity: 'Yin', animal: 'Ox', animalZh: '牛',
    overview: 'Refined Metal in deep storage. A period of accumulated precision and patient refinement.',
    overviewZh: '精炼的金在深度储存中。积累精确和耐心精炼的时期。',
    lifeThemes: 'Patient refinement, accumulated precision, stored quality, winter polishing.',
    lifeThemesZh: '耐心精炼、积累精确、储存质量、冬季打磨。',
    careerThemes: 'Long-term quality work, patient craftsmanship, accumulated expertise.',
    careerThemesZh: '长期质量工作、耐心工艺、积累专业知识。',
    relationshipThemes: 'Patient quality time, accumulated trust, refined bonds over time.',
    relationshipThemesZh: '耐心的高质量时间、积累信任、随时间精炼的情感。',
    innerWork: 'Patient self-refinement, accumulated inner quality, winter inner work.',
    innerWorkZh: '耐心自我精炼、积累内在质量、冬季内在工作。'
  },
  {
    stem: 'Xin', stemZh: '辛', branch: 'Hai', branchZh: '亥', pillarZh: '辛亥',
    element: 'Metal', polarity: 'Yin', animal: 'Pig', animalZh: '猪',
    overview: 'Refined Metal washed by Water. A period of polished flow and contented refinement.',
    overviewZh: '精炼的金被水洗涤。磨光流动和满足精炼的时期。',
    lifeThemes: 'Flowing refinement, polished contentment, washed clarity, deep precision.',
    lifeThemesZh: '流动精炼、磨光满足、洗涤清晰、深度精确。',
    careerThemes: 'Refined communications, polished consulting, flowing quality work.',
    careerThemesZh: '精炼沟通、磨光咨询、流动质量工作。',
    relationshipThemes: 'Flowing quality connections, polished partnerships, contented precision.',
    relationshipThemesZh: '流动质量连接、磨光伙伴关系、满足精确。',
    innerWork: 'Flowing self-refinement, washed inner clarity, contented inner precision.',
    innerWorkZh: '流动自我精炼、洗涤内在清晰、满足内在精确。'
  },
  {
    stem: 'Xin', stemZh: '辛', branch: 'You', branchZh: '酉', pillarZh: '辛酉',
    element: 'Metal', polarity: 'Yin', animal: 'Rooster', animalZh: '鸡',
    overview: 'Maximum refined Metal - Xin in its home. A period of peak refinement and polished precision.',
    overviewZh: '最大精炼金——辛在自己的家中。巅峰精炼和磨光精确的时期。',
    lifeThemes: 'Peak refinement, maximum polish, precise elegance, aesthetic mastery.',
    lifeThemesZh: '巅峰精炼、最大打磨、精确优雅、审美精通。',
    careerThemes: 'Peak craftsmanship, refined arts, jewelry, precision aesthetics.',
    careerThemesZh: '巅峰工艺、精炼艺术、珠宝、精确美学。',
    relationshipThemes: 'Refined elegance, polished partnerships, aesthetic bonds.',
    relationshipThemesZh: '精炼优雅、磨光伙伴关系、美学情感。',
    innerWork: 'Embracing full refinement, polished inner self, aesthetic inner mastery.',
    innerWorkZh: '拥抱完整精炼、磨光内在自我、美学内在精通。'
  },
  {
    stem: 'Xin', stemZh: '辛', branch: 'Wei', branchZh: '未', pillarZh: '辛未',
    element: 'Metal', polarity: 'Yin', animal: 'Goat', animalZh: '羊',
    overview: 'Refined Metal nurtured in Earth. A period of cultivated refinement and nurtured precision.',
    overviewZh: '精炼的金在土中滋养。培养精炼和滋养精确的时期。',
    lifeThemes: 'Nurtured refinement, cultivated precision, artistic quality, gentle polish.',
    lifeThemesZh: '滋养精炼、培养精确、艺术质量、温和打磨。',
    careerThemes: 'Artistic crafts, nurtured quality, creative precision, gentle refinement.',
    careerThemesZh: '艺术工艺、滋养质量、创意精确、温和精炼。',
    relationshipThemes: 'Nurturing precision, cultivated quality time, artistic partnerships.',
    relationshipThemesZh: '滋养精确、培养高质量时间、艺术伙伴关系。',
    innerWork: 'Gentle self-refinement, nurtured inner quality, cultivated precision.',
    innerWorkZh: '温和自我精炼、滋养内在质量、培养精确。'
  },
  {
    stem: 'Xin', stemZh: '辛', branch: 'Si', branchZh: '巳', pillarZh: '辛巳',
    element: 'Metal', polarity: 'Yin', animal: 'Snake', animalZh: '蛇',
    overview: 'Refined Metal transformed by Fire. A period of wise refinement and insightful precision.',
    overviewZh: '精炼的金被火转化。智慧精炼和洞察精确的时期。',
    lifeThemes: 'Wise refinement, transformative precision, strategic polish, insightful quality.',
    lifeThemesZh: '智慧精炼、变革性精确、战略打磨、洞察质量。',
    careerThemes: 'Strategic quality work, wise consulting, transformative refinement.',
    careerThemesZh: '战略质量工作、智慧咨询、变革性精炼。',
    relationshipThemes: 'Wise precision, intuitive quality, transformative partnerships.',
    relationshipThemesZh: '智慧精确、直觉质量、变革性伙伴关系。',
    innerWork: 'Transformative self-refinement, wise inner precision, strategic inner quality.',
    innerWorkZh: '变革性自我精炼、智慧内在精确、战略内在质量。'
  },
  {
    stem: 'Xin', stemZh: '辛', branch: 'Mao', branchZh: '卯', pillarZh: '辛卯',
    element: 'Metal', polarity: 'Yin', animal: 'Rabbit', animalZh: '兔',
    overview: 'Refined Metal cutting Wood. A period of artistic precision and refined creativity.',
    overviewZh: '精炼的金切木。艺术精确和精炼创造力的时期。',
    lifeThemes: 'Artistic precision, refined creativity, graceful quality, diplomatic refinement.',
    lifeThemesZh: '艺术精确、精炼创造力、优雅质量、外交精炼。',
    careerThemes: 'Creative precision, artistic quality, refined design, graceful craftsmanship.',
    careerThemesZh: '创意精确、艺术质量、精炼设计、优雅工艺。',
    relationshipThemes: 'Graceful precision, creative quality partnerships, refined diplomacy.',
    relationshipThemesZh: '优雅精确、创意质量伙伴关系、精炼外交。',
    innerWork: 'Balancing precision with creativity, graceful self-refinement, artistic discipline.',
    innerWorkZh: '平衡精确与创造力、优雅自我精炼、艺术纪律。'
  },

  // ===== CYCLE 9: Ren (壬) =====
  {
    stem: 'Ren', stemZh: '壬', branch: 'Zi', branchZh: '子', pillarZh: '壬子',
    element: 'Water', polarity: 'Yang', animal: 'Rat', animalZh: '鼠',
    overview: 'Maximum Water energy - Ren in its home. A period of peak flow, networking, and wisdom accumulation.',
    overviewZh: '最大水能量——壬在自己的家中。巅峰流动、社交网络和智慧积累的时期。',
    lifeThemes: 'Maximum flow, peak wisdom, expansive networking, deep intelligence.',
    lifeThemesZh: '最大流动、巅峰智慧、广泛社交、深度智慧。',
    careerThemes: 'Peak networking, maximum communications, wisdom professions, flow industries.',
    careerThemesZh: '巅峰社交、最大沟通、智慧职业、流动产业。',
    relationshipThemes: 'Flowing connections, deep partnerships, expansive love.',
    relationshipThemesZh: '流动连接、深度伙伴关系、广阔之爱。',
    innerWork: 'Embracing full flow, deep wisdom cultivation, expansive inner networks.',
    innerWorkZh: '拥抱完整流动、深度智慧培养、广阔内在网络。'
  },
  {
    stem: 'Ren', stemZh: '壬', branch: 'Xu', branchZh: '戌', pillarZh: '壬戌',
    element: 'Water', polarity: 'Yang', animal: 'Dog', animalZh: '狗',
    overview: 'Expansive Water in Earth dam. A period of channeled flow and loyal intelligence.',
    overviewZh: '广阔的水在土坝中。引导流动和忠诚智慧的时期。',
    lifeThemes: 'Channeled wisdom, loyal networking, protected flow, structured intelligence.',
    lifeThemesZh: '引导智慧、忠诚社交、受保护的流动、结构化智慧。',
    careerThemes: 'Structured communications, loyal consulting, protected networking.',
    careerThemesZh: '结构化沟通、忠诚咨询、受保护的社交。',
    relationshipThemes: 'Loyal connections, protected partnerships, channeled love.',
    relationshipThemesZh: '忠诚连接、受保护的伙伴关系、引导之爱。',
    innerWork: 'Channeling flow constructively, loyal wisdom, protected inner depth.',
    innerWorkZh: '建设性地引导流动、忠诚智慧、受保护的内在深度。'
  },
  {
    stem: 'Ren', stemZh: '壬', branch: 'Shen', branchZh: '申', pillarZh: '壬申',
    element: 'Water', polarity: 'Yang', animal: 'Monkey', animalZh: '猴',
    overview: 'Expansive Water from Metal source. A period of brilliant flow and clever networking.',
    overviewZh: '从金源流出的广阔水。光彩流动和聪明社交的时期。',
    lifeThemes: 'Clever wisdom, brilliant networking, innovative flow, adaptive intelligence.',
    lifeThemesZh: '聪明智慧、光彩社交、创新流动、适应性智慧。',
    careerThemes: 'Innovative communications, clever consulting, technology flow.',
    careerThemesZh: '创新沟通、聪明咨询、技术流动。',
    relationshipThemes: 'Clever connections, adaptive partnerships, innovative love.',
    relationshipThemesZh: '聪明连接、适应性伙伴关系、创新之爱。',
    innerWork: 'Cultivating clever wisdom, adaptive inner flow, innovative intelligence.',
    innerWorkZh: '培养聪明智慧、适应性内在流动、创新智慧。'
  },
  {
    stem: 'Ren', stemZh: '壬', branch: 'Wu', branchZh: '午', pillarZh: '壬午',
    element: 'Water', polarity: 'Yang', animal: 'Horse', animalZh: '马',
    overview: 'Expansive Water challenging Fire. A period of visible flow and networking under spotlight.',
    overviewZh: '广阔的水挑战火。可见流动和聚光灯下的社交的时期。',
    lifeThemes: 'Visible wisdom, public networking, passionate flow, fame through intelligence.',
    lifeThemesZh: '可见智慧、公众社交、热情流动、通过智慧获得名声。',
    careerThemes: 'Public communications, visible consulting, media flow, fame networking.',
    careerThemesZh: '公众沟通、可见咨询、媒体流动、名声社交。',
    relationshipThemes: 'Passionate connections, visible partnerships, exciting flow.',
    relationshipThemesZh: '热情连接、可见伙伴关系、令人兴奋的流动。',
    innerWork: 'Balancing depth with visibility, passionate wisdom, sustainable flow.',
    innerWorkZh: '平衡深度与可见性、热情智慧、可持续流动。'
  },
  {
    stem: 'Ren', stemZh: '壬', branch: 'Chen', branchZh: '辰', pillarZh: '壬辰',
    element: 'Water', polarity: 'Yang', animal: 'Dragon', animalZh: '龙',
    overview: 'Expansive Water in Dragon reservoir. A period of powerful flow and transformative networking.',
    overviewZh: '广阔的水在龙的水库中。强大流动和变革性社交的时期。',
    lifeThemes: 'Powerful wisdom, transformative networking, dragon-depth flow.',
    lifeThemesZh: '强大智慧、变革性社交、龙之深度流动。',
    careerThemes: 'Powerful communications, transformative consulting, major networking.',
    careerThemesZh: '强大沟通、变革性咨询、重大社交。',
    relationshipThemes: 'Powerful connections, transformative partnerships, deep love.',
    relationshipThemesZh: '强大连接、变革性伙伴关系、深度之爱。',
    innerWork: 'Accessing deep wisdom power, transformative inner flow, dragon-depth intelligence.',
    innerWorkZh: '获取深度智慧力量、变革性内在流动、龙之深度智慧。'
  },
  {
    stem: 'Ren', stemZh: '壬', branch: 'Yin', branchZh: '寅', pillarZh: '壬寅',
    element: 'Water', polarity: 'Yang', animal: 'Tiger', animalZh: '虎',
    overview: 'Expansive Water nourishing Wood. A period of wisdom-fueled growth and courageous networking.',
    overviewZh: '广阔的水滋养木。智慧驱动成长和勇敢社交的时期。',
    lifeThemes: 'Wisdom-fueled growth, courageous networking, pioneering flow.',
    lifeThemesZh: '智慧驱动成长、勇敢社交、开拓性流动。',
    careerThemes: 'Growth communications, pioneering consulting, courageous networking.',
    careerThemesZh: '成长沟通、开拓性咨询、勇敢社交。',
    relationshipThemes: 'Growing connections, courageous partnerships, nurturing through wisdom.',
    relationshipThemesZh: '成长连接、勇敢伙伴关系、通过智慧滋养。',
    innerWork: 'Using wisdom to fuel growth, courageous inner flow, pioneering intelligence.',
    innerWorkZh: '用智慧驱动成长、勇敢内在流动、开拓性智慧。'
  },

  // ===== CYCLE 10: Gui (癸) =====
  {
    stem: 'Gui', stemZh: '癸', branch: 'Chou', branchZh: '丑', pillarZh: '癸丑',
    element: 'Water', polarity: 'Yin', animal: 'Ox', animalZh: '牛',
    overview: 'Deep Water in winter storage. A period of accumulated intuition and patient reflection.',
    overviewZh: '深水在冬季储存中。积累直觉和耐心反思的时期。',
    lifeThemes: 'Patient intuition, accumulated depth, winter reflection, stored wisdom.',
    lifeThemesZh: '耐心直觉、积累深度、冬季反思、储存智慧。',
    careerThemes: 'Deep research, patient consulting, accumulated insights, winter professions.',
    careerThemesZh: '深度研究、耐心咨询、积累洞察、冬季职业。',
    relationshipThemes: 'Patient depth, accumulated trust, winter nurturing.',
    relationshipThemesZh: '耐心深度、积累信任、冬季滋养。',
    innerWork: 'Deep patient reflection, accumulated inner wisdom, winter inner work.',
    innerWorkZh: '深度耐心反思、积累内在智慧、冬季内在工作。'
  },
  {
    stem: 'Gui', stemZh: '癸', branch: 'Hai', branchZh: '亥', pillarZh: '癸亥',
    element: 'Water', polarity: 'Yin', animal: 'Pig', animalZh: '猪',
    overview: 'Maximum deep Water energy - Gui in its home. A period of peak intuition and deepest reflection.',
    overviewZh: '最大深水能量——癸在自己的家中。巅峰直觉和最深反思的时期。',
    lifeThemes: 'Maximum intuition, deepest reflection, peak inner wisdom, complete depth.',
    lifeThemesZh: '最大直觉、最深反思、巅峰内在智慧、完整深度。',
    careerThemes: 'Deep spiritual work, peak intuitive professions, complete reflection work.',
    careerThemesZh: '深度精神工作、巅峰直觉职业、完整反思工作。',
    relationshipThemes: 'Deepest connections, complete depth partnerships, intuitive love.',
    relationshipThemesZh: '最深连接、完整深度伙伴关系、直觉之爱。',
    innerWork: 'Embracing full depth, complete intuition, deepest inner reflection.',
    innerWorkZh: '拥抱完整深度、完整直觉、最深内在反思。'
  },
  {
    stem: 'Gui', stemZh: '癸', branch: 'You', branchZh: '酉', pillarZh: '癸酉',
    element: 'Water', polarity: 'Yin', animal: 'Rooster', animalZh: '鸡',
    overview: 'Deep Water from Metal source. A period of refined intuition and precise reflection.',
    overviewZh: '从金源流出的深水。精炼直觉和精确反思的时期。',
    lifeThemes: 'Refined intuition, precise reflection, polished depth, discerning insight.',
    lifeThemesZh: '精炼直觉、精确反思、磨光深度、辨别洞察。',
    careerThemes: 'Precise intuitive work, refined consulting, discerning research.',
    careerThemesZh: '精确直觉工作、精炼咨询、辨别研究。',
    relationshipThemes: 'Refined depth, precise connections, polished partnerships.',
    relationshipThemesZh: '精炼深度、精确连接、磨光伙伴关系。',
    innerWork: 'Refining intuition, precise inner reflection, polished inner depth.',
    innerWorkZh: '精炼直觉、精确内在反思、磨光内在深度。'
  },
  {
    stem: 'Gui', stemZh: '癸', branch: 'Wei', branchZh: '未', pillarZh: '癸未',
    element: 'Water', polarity: 'Yin', animal: 'Goat', animalZh: '羊',
    overview: 'Deep Water absorbed by Earth. A period of grounded intuition and nurtured reflection.',
    overviewZh: '深水被土吸收。扎根直觉和滋养反思的时期。',
    lifeThemes: 'Grounded intuition, nurtured depth, artistic reflection, gentle insight.',
    lifeThemesZh: '扎根直觉、滋养深度、艺术反思、温和洞察。',
    careerThemes: 'Grounded intuitive work, nurtured consulting, artistic depth.',
    careerThemesZh: '扎根直觉工作、滋养咨询、艺术深度。',
    relationshipThemes: 'Nurtured depth, gentle connections, artistic partnerships.',
    relationshipThemesZh: '滋养深度、温和连接、艺术伙伴关系。',
    innerWork: 'Grounding intuition, nurturing inner depth, gentle inner reflection.',
    innerWorkZh: '扎根直觉、滋养内在深度、温和内在反思。'
  },
  {
    stem: 'Gui', stemZh: '癸', branch: 'Si', branchZh: '巳', pillarZh: '癸巳',
    element: 'Water', polarity: 'Yin', animal: 'Snake', animalZh: '蛇',
    overview: 'Deep Water challenged by Fire. A period of tested intuition and transformative reflection.',
    overviewZh: '深水被火挑战。经受考验的直觉和变革性反思的时期。',
    lifeThemes: 'Tested intuition, transformative depth, strategic reflection, wisdom through fire.',
    lifeThemesZh: '经受考验的直觉、变革性深度、战略反思、火中智慧。',
    careerThemes: 'Strategic intuitive work, transformative consulting, tested research.',
    careerThemesZh: '战略直觉工作、变革性咨询、经受考验的研究。',
    relationshipThemes: 'Transformative depth, tested connections, strategic partnerships.',
    relationshipThemesZh: '变革性深度、经受考验的连接、战略伙伴关系。',
    innerWork: 'Testing intuition through challenge, transformative inner reflection, strategic depth.',
    innerWorkZh: '通过挑战考验直觉、变革性内在反思、战略深度。'
  },
  {
    stem: 'Gui', stemZh: '癸', branch: 'Mao', branchZh: '卯', pillarZh: '癸卯',
    element: 'Water', polarity: 'Yin', animal: 'Rabbit', animalZh: '兔',
    overview: 'Deep Water nourishing gentle Wood. A period of intuitive growth and reflective creativity.',
    overviewZh: '深水滋养柔和的木。直觉成长和反思创造力的时期。',
    lifeThemes: 'Intuitive growth, creative reflection, graceful depth, artistic insight.',
    lifeThemesZh: '直觉成长、创意反思、优雅深度、艺术洞察。',
    careerThemes: 'Creative intuitive work, artistic consulting, graceful depth professions.',
    careerThemesZh: '创意直觉工作、艺术咨询、优雅深度职业。',
    relationshipThemes: 'Creative depth, graceful connections, artistic partnerships.',
    relationshipThemesZh: '创意深度、优雅连接、艺术伙伴关系。',
    innerWork: 'Nurturing inner creativity, graceful intuition, artistic inner growth.',
    innerWorkZh: '滋养内在创造力、优雅直觉、艺术内在成长。'
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Lookup luck pillar interpretation by stem and branch
 */
export function getLuckPillarInterpretation(stem: string, branch: string): LuckPillarInterpretation | undefined {
  return LUCK_PILLAR_LIBRARY.find(lp => lp.stem === stem && lp.branch === branch);
}

/**
 * Lookup luck pillar by Chinese characters
 */
export function getLuckPillarByZh(pillarZh: string): LuckPillarInterpretation | undefined {
  return LUCK_PILLAR_LIBRARY.find(lp => lp.pillarZh === pillarZh);
}

/**
 * Get all luck pillars for a specific element
 */
export function getLuckPillarsByElement(element: string): LuckPillarInterpretation[] {
  return LUCK_PILLAR_LIBRARY.filter(lp => lp.element === element);
}

/**
 * Get all luck pillars for a specific animal
 */
export function getLuckPillarsByAnimal(animal: string): LuckPillarInterpretation[] {
  return LUCK_PILLAR_LIBRARY.filter(lp => lp.animal === animal);
}

/**
 * Format luck pillar for display
 */
export function formatLuckPillarForDisplay(stem: string, branch: string, lang: 'en' | 'zh' = 'en'): string {
  const lp = getLuckPillarInterpretation(stem, branch);
  if (!lp) return '';

  if (lang === 'zh') {
    return `【${lp.pillarZh} 大运】\n${lp.overviewZh}\n\n生活主题：${lp.lifeThemesZh}\n事业主题：${lp.careerThemesZh}\n关系主题：${lp.relationshipThemesZh}\n内在功课：${lp.innerWorkZh}`;
  }

  return `【${lp.stem} ${lp.branch} Luck Pillar】\n${lp.overview}\n\nLife Themes: ${lp.lifeThemes}\nCareer Themes: ${lp.careerThemes}\nRelationship Themes: ${lp.relationshipThemes}\nInner Work: ${lp.innerWork}`;
}

/**
 * Get stem meaning
 */
export function getStemMeaning(stem: string, lang: 'en' | 'zh' = 'en'): string {
  const meaning = STEM_MEANINGS[stem];
  if (!meaning) return '';
  return lang === 'zh' ? meaning.zh : meaning.en;
}

/**
 * Get branch meaning
 */
export function getBranchMeaning(branch: string, lang: 'en' | 'zh' = 'en'): string {
  const meaning = BRANCH_MEANINGS[branch];
  if (!meaning) return '';
  return lang === 'zh' ? meaning.zh : meaning.en;
}

/**
 * Get all luck pillar interpretations
 */
export function getAllLuckPillarInterpretations(): LuckPillarInterpretation[] {
  return LUCK_PILLAR_LIBRARY;
}

// ==================== EXPORTS ====================

export {
  STEM_MEANINGS,
  BRANCH_MEANINGS,
  getLuckPillarInterpretation,
  getLuckPillarByZh,
  getLuckPillarsByElement,
  getLuckPillarsByAnimal,
  formatLuckPillarForDisplay,
  getStemMeaning,
  getBranchMeaning,
  getAllLuckPillarInterpretations
};
