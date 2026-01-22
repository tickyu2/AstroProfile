/**
 * ============================================
 * USEFUL GOD INTERPRETATION LIBRARY
 * Complete Scripture for Element Favorability
 *
 * Each element as Useful God carries:
 * - Activation methods
 * - Timing guidance
 * - Balance strategies
 * ============================================
 */

// ==================== TYPES ====================

export type UsefulGodRole = 'Useful' | 'Supporting' | 'Balancing' | 'Harmful' | 'Neutral';

export interface UsefulGodInterpretation {
  element: string;
  elementZh: string;
  role: UsefulGodRole;
  overview: string;
  overviewZh: string;
  whyUseful: string;
  whyUsefulZh: string;
  howToActivate: string;
  howToActivateZh: string;
  careerActivation: string;
  careerActivationZh: string;
  relationshipActivation: string;
  relationshipActivationZh: string;
  healthActivation: string;
  healthActivationZh: string;
  pitfalls: string;
  pitfallsZh: string;
  timingNotes: string;
  timingNotesZh: string;
  colors: string[];
  directions: string[];
  activities: string[];
}

// ==================== LIBRARY ====================

export const USEFUL_GOD_LIBRARY: Record<string, UsefulGodInterpretation> = {
  Wood: {
    element: 'Wood',
    elementZh: '木',
    role: 'Useful',
    overview: 'Growth, expansion, creativity, flexibility, new beginnings.',
    overviewZh: '成长、扩展、创造力、灵活性、新开始。',
    whyUseful: 'Brings vitality, growth energy, and forward momentum. Helps break stagnation and initiate new cycles.',
    whyUsefulZh: '带来活力、成长能量和前进动力。帮助打破停滞并启动新周期。',
    howToActivate: 'Engage in learning, creative projects, morning activities, spending time in nature, and working with plants.',
    howToActivateZh: '参与学习、创意项目、早晨活动、亲近自然和与植物接触。',
    careerActivation: 'Education, writing, publishing, environmental work, counseling, creative industries, startups.',
    careerActivationZh: '教育、写作、出版、环境工作、咨询、创意产业、初创企业。',
    relationshipActivation: 'Nurture growth in relationships, support partner\'s development, plant seeds together.',
    relationshipActivationZh: '滋养关系中的成长，支持伴侣的发展，一起播种。',
    healthActivation: 'Liver care, stretching, morning exercise, green foods, managing anger constructively.',
    healthActivationZh: '肝脏护理、伸展运动、晨练、绿色食物、建设性地管理愤怒。',
    pitfalls: 'Over-activation can lead to scattered energy, overcommitment, or inability to complete what\'s started.',
    pitfallsZh: '过度激活可能导致能量分散、过度承诺或无法完成已开始的事情。',
    timingNotes: 'Wood Luck/Annual periods emphasize learning, new projects, emotional processing, and family matters.',
    timingNotesZh: '木大运/流年强调学习、新项目、情感处理和家庭事务。',
    colors: ['Green', 'Teal', 'Light Blue'],
    directions: ['East'],
    activities: ['Reading', 'Gardening', 'Walking in nature', 'Morning routines', 'Creative writing']
  },
  Fire: {
    element: 'Fire',
    elementZh: '火',
    role: 'Useful',
    overview: 'Passion, visibility, warmth, transformation, joy.',
    overviewZh: '热情、可见性、温暖、转变、喜悦。',
    whyUseful: 'Brings warmth, visibility, and transformative energy. Helps with recognition and emotional expression.',
    whyUsefulZh: '带来温暖、可见性和变革能量。帮助获得认可和情感表达。',
    howToActivate: 'Public activities, social events, exercise, candle meditation, warm environments.',
    howToActivateZh: '公共活动、社交活动、锻炼、烛光冥想、温暖的环境。',
    careerActivation: 'Marketing, entertainment, public speaking, hospitality, fashion, any visible role.',
    careerActivationZh: '营销、娱乐、公开演讲、酒店业、时尚，任何可见的角色。',
    relationshipActivation: 'Express warmth openly, celebrate together, maintain passion and visibility with partner.',
    relationshipActivationZh: '公开表达温暖、一起庆祝、与伴侣保持热情和可见性。',
    healthActivation: 'Heart health, circulation, joy cultivation, avoiding excess heat or inflammation.',
    healthActivationZh: '心脏健康、循环、培养喜悦、避免过热或炎症。',
    pitfalls: 'Over-activation can lead to burnout, conflict, attention-seeking, or inflammatory conditions.',
    pitfallsZh: '过度激活可能导致倦怠、冲突、寻求关注或炎症状况。',
    timingNotes: 'Fire periods emphasize visibility, recognition, passion projects, and social expansion.',
    timingNotesZh: '火时期强调可见性、认可、热情项目和社交扩展。',
    colors: ['Red', 'Orange', 'Purple', 'Pink'],
    directions: ['South'],
    activities: ['Social events', 'Exercise', 'Performance', 'Celebrations', 'Networking']
  },
  Earth: {
    element: 'Earth',
    elementZh: '土',
    role: 'Balancing',
    overview: 'Stability, grounding, nurturing, boundaries, integration.',
    overviewZh: '稳定、扎根、滋养、边界、整合。',
    whyUseful: 'Helps integrate scattered or overly intense energies. Provides stability and grounding.',
    whyUsefulZh: '帮助整合分散或过于强烈的能量。提供稳定和扎根。',
    howToActivate: 'Routines, physical practices, commitments, long-term projects, working with earth materials.',
    howToActivateZh: '常规、身体练习、承诺、长期项目、与土材料接触。',
    careerActivation: 'Real estate, agriculture, construction, management, operations, counseling.',
    careerActivationZh: '房地产、农业、建筑、管理、运营、咨询。',
    relationshipActivation: 'Build stable foundations, create routines together, provide consistent support.',
    relationshipActivationZh: '建立稳定的基础、一起创建常规、提供一致的支持。',
    healthActivation: 'Digestion, muscle health, grounding exercises, balanced eating, stress management.',
    healthActivationZh: '消化、肌肉健康、扎根练习、均衡饮食、压力管理。',
    pitfalls: 'Too much Earth can become stagnation, worry, overthinking, or excessive responsibility.',
    pitfallsZh: '过多的土可能变成停滞、担忧、过度思考或过度责任。',
    timingNotes: 'Earth periods favor consolidation, commitment, building foundations, and stabilizing.',
    timingNotesZh: '土时期有利于整合、承诺、打基础和稳定。',
    colors: ['Yellow', 'Brown', 'Beige', 'Terracotta'],
    directions: ['Center', 'Southwest', 'Northeast'],
    activities: ['Gardening', 'Cooking', 'Organization', 'Building', 'Grounding meditation']
  },
  Metal: {
    element: 'Metal',
    elementZh: '金',
    role: 'Useful',
    overview: 'Precision, refinement, structure, clarity, boundaries.',
    overviewZh: '精确、精炼、结构、清晰、边界。',
    whyUseful: 'Brings clarity, structure, and the ability to discern and refine. Helps with decision-making.',
    whyUsefulZh: '带来清晰、结构和辨别和精炼的能力。帮助决策。',
    howToActivate: 'Organization, decluttering, financial planning, precise communication, quality focus.',
    howToActivateZh: '组织、清理杂物、财务规划、精确沟通、关注质量。',
    careerActivation: 'Finance, law, engineering, quality control, jewelry, precision industries.',
    careerActivationZh: '金融、法律、工程、质量控制、珠宝、精密工业。',
    relationshipActivation: 'Clear communication, defined boundaries, quality time over quantity.',
    relationshipActivationZh: '清晰沟通、明确边界、注重质量而非数量。',
    healthActivation: 'Lung health, skin care, breathing exercises, releasing grief, immune support.',
    healthActivationZh: '肺部健康、皮肤护理、呼吸练习、释放悲伤、免疫支持。',
    pitfalls: 'Over-activation can lead to rigidity, harsh judgment, perfectionism, or cutting off relationships.',
    pitfallsZh: '过度激活可能导致僵化、严厉判断、完美主义或切断关系。',
    timingNotes: 'Metal periods emphasize refinement, decisions, financial matters, and letting go.',
    timingNotesZh: '金时期强调精炼、决策、财务事项和放手。',
    colors: ['White', 'Gold', 'Silver', 'Gray'],
    directions: ['West'],
    activities: ['Decluttering', 'Financial review', 'Breathing exercises', 'Precision crafts', 'Decision-making']
  },
  Water: {
    element: 'Water',
    elementZh: '水',
    role: 'Useful',
    overview: 'Flow, intelligence, communication, adaptability, depth.',
    overviewZh: '流动、智慧、沟通、适应性、深度。',
    whyUseful: 'Balances overly hot or rigid charts, brings flexibility, insight, and emotional depth.',
    whyUsefulZh: '平衡过热或僵化的命盘，带来灵活性、洞察力和情感深度。',
    howToActivate: 'Learning, travel, communication, environments with movement and change, water activities.',
    howToActivateZh: '学习、旅行、沟通、有流动和变化的环境、水上活动。',
    careerActivation: 'Research, consulting, logistics, trade, transportation, communication industries.',
    careerActivationZh: '研究、咨询、物流、贸易、运输、通信行业。',
    relationshipActivation: 'Deep conversations, emotional flow, adaptability to partner\'s needs.',
    relationshipActivationZh: '深度对话、情感流动、适应伴侣的需求。',
    healthActivation: 'Kidney health, hydration, rest, winter recovery, managing fear.',
    healthActivationZh: '肾脏健康、补水、休息、冬季恢复、管理恐惧。',
    pitfalls: 'Over-activation can lead to anxiety, overthinking, lack of grounding, or emotional flooding.',
    pitfallsZh: '过度激活可能导致焦虑、过度思考、缺乏扎根或情感泛滥。',
    timingNotes: 'Water periods emphasize learning, networking, emotional processing, and adaptability.',
    timingNotesZh: '水时期强调学习、社交、情感处理和适应性。',
    colors: ['Black', 'Dark Blue', 'Navy'],
    directions: ['North'],
    activities: ['Swimming', 'Research', 'Meditation', 'Night reflection', 'Travel']
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Lookup useful god interpretation by element
 */
export function getUsefulGodInterpretation(element: string): UsefulGodInterpretation | undefined {
  return USEFUL_GOD_LIBRARY[element];
}

/**
 * Get activation tips for an element
 */
export function getActivationTips(element: string, lang: 'en' | 'zh' = 'en'): string[] {
  const interp = USEFUL_GOD_LIBRARY[element];
  if (!interp) return [];

  const tips = [
    lang === 'zh' ? interp.howToActivateZh : interp.howToActivate,
    lang === 'zh' ? interp.careerActivationZh : interp.careerActivation,
    lang === 'zh' ? interp.relationshipActivationZh : interp.relationshipActivation,
    lang === 'zh' ? interp.healthActivationZh : interp.healthActivation
  ];

  return tips;
}

/**
 * Get element colors and directions
 */
export function getElementEnhancements(element: string): { colors: string[]; directions: string[]; activities: string[] } {
  const interp = USEFUL_GOD_LIBRARY[element];
  if (!interp) {
    return { colors: [], directions: [], activities: [] };
  }
  return {
    colors: interp.colors,
    directions: interp.directions,
    activities: interp.activities
  };
}

/**
 * Format useful god for display
 */
export function formatUsefulGodForDisplay(element: string, lang: 'en' | 'zh' = 'en'): string {
  const ug = USEFUL_GOD_LIBRARY[element];
  if (!ug) return '';

  if (lang === 'zh') {
    return `【${ug.elementZh}用神】\n${ug.overviewZh}\n\n为何有用：${ug.whyUsefulZh}\n如何激活：${ug.howToActivateZh}\n注意事项：${ug.pitfallsZh}`;
  }

  return `【${ug.element} as Useful God】\n${ug.overview}\n\nWhy Useful: ${ug.whyUseful}\nHow to Activate: ${ug.howToActivate}\nPitfalls: ${ug.pitfalls}`;
}

/**
 * Get all useful god interpretations
 */
export function getAllUsefulGodInterpretations(): UsefulGodInterpretation[] {
  return Object.values(USEFUL_GOD_LIBRARY);
}

// ==================== EXPORTS ====================

export {
  getUsefulGodInterpretation,
  getActivationTips,
  getElementEnhancements,
  formatUsefulGodForDisplay,
  getAllUsefulGodInterpretations
};
