/**
 * ============================================
 * FAVORABILITY TO RITUAL INTEGRATION
 * Map Element Favorability to Ritual Timing
 *
 * Transforms favorability analysis into:
 * - Optimal ritual timing
 * - Element-based practices
 * - Daily/monthly/yearly guidance
 * - Personal empowerment rituals
 * ============================================
 */

import {
  FavorabilityAnalysis,
  ElementFavorability,
  FavorabilityType
} from '../favorabilityEngine';

// ==================== TYPES ====================

export interface RitualTiming {
  element: string;
  optimalHours: string[];
  optimalDays: string[];
  optimalMonths: string[];
  avoidanceHours: string[];
  avoidanceDays: string[];
  avoidanceMonths: string[];
}

export interface ElementalRitual {
  id: string;
  element: string;
  name: string;
  nameZh: string;
  purpose: string;
  purposeZh: string;
  instructions: string[];
  instructionsZh: string[];
  materials: string[];
  materialsZh: string[];
  duration: string;
  durationZh: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'seasonal';
}

export interface EmpowermentPractice {
  forType: FavorabilityType;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  activities: string[];
  activitiesZh: string[];
  colors: string[];
  directions: string[];
  directionsZh: string[];
  timing: string;
  timingZh: string;
}

export interface RitualGuidance {
  yongShenPractice: EmpowermentPractice;
  xiShenPractice: EmpowermentPractice;
  jiShenAvoidance: EmpowermentPractice;
  timing: RitualTiming;
  dailyRituals: ElementalRitual[];
  weeklyRituals: ElementalRitual[];
  monthlyRituals: ElementalRitual[];
  personalMantra: string;
  personalMantraZh: string;
}

// ==================== RITUAL DATA ====================

const ELEMENT_HOURS: Record<string, string[]> = {
  Wood: ['3-5 AM (Yin)', '11 AM-1 PM (Wu)'],
  Fire: ['9-11 AM (Si)', '11 AM-1 PM (Wu)'],
  Earth: ['7-9 AM (Chen)', '1-3 PM (Wei)', '7-9 PM (Xu)'],
  Metal: ['3-5 PM (Shen)', '5-7 PM (You)'],
  Water: ['9-11 PM (Hai)', '11 PM-1 AM (Zi)']
};

const ELEMENT_DAYS: Record<string, string[]> = {
  Wood: ['Jia days', 'Yi days', 'Yin days', 'Mao days'],
  Fire: ['Bing days', 'Ding days', 'Si days', 'Wu days'],
  Earth: ['Wu days', 'Ji days', 'Chen days', 'Xu days', 'Chou days', 'Wei days'],
  Metal: ['Geng days', 'Xin days', 'Shen days', 'You days'],
  Water: ['Ren days', 'Gui days', 'Hai days', 'Zi days']
};

const ELEMENT_MONTHS: Record<string, string[]> = {
  Wood: ['Tiger month (Feb)', 'Rabbit month (Mar)'],
  Fire: ['Snake month (May)', 'Horse month (June)'],
  Earth: ['Dragon month (Apr)', 'Goat month (July)', 'Dog month (Oct)', 'Ox month (Jan)'],
  Metal: ['Monkey month (Aug)', 'Rooster month (Sep)'],
  Water: ['Pig month (Nov)', 'Rat month (Dec)']
};

const ELEMENT_RITUALS: Record<string, ElementalRitual[]> = {
  Wood: [
    {
      id: 'wood-morning',
      element: 'Wood',
      name: 'Dawn Growth Meditation',
      nameZh: '晨曦成长冥想',
      purpose: 'Connect with Wood energy for creativity and growth',
      purposeZh: '连接木能量以获得创造力和成长',
      instructions: [
        'Rise before dawn',
        'Face east toward the rising sun',
        'Visualize green energy rising from the earth',
        'Set intentions for growth and new beginnings'
      ],
      instructionsZh: [
        '黎明前起床',
        '面向东方迎接日出',
        '想象绿色能量从大地升起',
        '设定成长和新开始的意图'
      ],
      materials: ['Green candle', 'Fresh plants', 'Wooden objects'],
      materialsZh: ['绿色蜡烛', '新鲜植物', '木制物品'],
      duration: '15-20 minutes',
      durationZh: '15-20分钟',
      frequency: 'daily'
    }
  ],
  Fire: [
    {
      id: 'fire-activation',
      element: 'Fire',
      name: 'Solar Activation',
      nameZh: '太阳激活仪式',
      purpose: 'Ignite passion and visibility',
      purposeZh: '点燃热情和可见性',
      instructions: [
        'Practice at midday when sun is highest',
        'Light a red candle',
        'Speak affirmations of confidence aloud',
        'Visualize your goals blazing into reality'
      ],
      instructionsZh: [
        '在正午阳光最高时练习',
        '点燃红色蜡烛',
        '大声说出自信的肯定语',
        '想象你的目标燃烧成现实'
      ],
      materials: ['Red candle', 'Cinnamon incense', 'Sunstone or carnelian'],
      materialsZh: ['红色蜡烛', '肉桂香', '日光石或红玉髓'],
      duration: '10-15 minutes',
      durationZh: '10-15分钟',
      frequency: 'daily'
    }
  ],
  Earth: [
    {
      id: 'earth-grounding',
      element: 'Earth',
      name: 'Grounding Stability Practice',
      nameZh: '扎根稳定练习',
      purpose: 'Build stability and nourishment',
      purposeZh: '建立稳定和滋养',
      instructions: [
        'Stand barefoot on natural ground if possible',
        'Feel connection to the earth beneath',
        'Breathe deeply, imagining roots growing down',
        'Affirm your stability and support'
      ],
      instructionsZh: [
        '如果可能，赤脚站在自然地面上',
        '感受与脚下大地的连接',
        '深呼吸，想象根部向下生长',
        '肯定你的稳定和支持'
      ],
      materials: ['Yellow or brown cloth', 'Clay or ceramic vessel', 'Crystals (citrine, tiger eye)'],
      materialsZh: ['黄色或棕色布', '陶土或陶瓷器皿', '水晶（黄水晶、虎眼石）'],
      duration: '15-20 minutes',
      durationZh: '15-20分钟',
      frequency: 'weekly'
    }
  ],
  Metal: [
    {
      id: 'metal-clarity',
      element: 'Metal',
      name: 'Clarity and Release Ritual',
      nameZh: '清晰与释放仪式',
      purpose: 'Refine thoughts and release attachments',
      purposeZh: '精炼思想和释放执着',
      instructions: [
        'Create a quiet, clean space',
        'Ring a bell or singing bowl',
        'Write down what needs releasing',
        'Symbolically cut or burn the paper'
      ],
      instructionsZh: [
        '创造一个安静、干净的空间',
        '敲响铃铛或唱碗',
        '写下需要释放的东西',
        '象征性地切割或燃烧纸张'
      ],
      materials: ['White candle', 'Metal bell or bowl', 'White paper', 'Scissors'],
      materialsZh: ['白色蜡烛', '金属铃铛或碗', '白纸', '剪刀'],
      duration: '20-30 minutes',
      durationZh: '20-30分钟',
      frequency: 'weekly'
    }
  ],
  Water: [
    {
      id: 'water-wisdom',
      element: 'Water',
      name: 'Deep Wisdom Meditation',
      nameZh: '深度智慧冥想',
      purpose: 'Access intuition and adaptability',
      purposeZh: '获取直觉和适应力',
      instructions: [
        'Practice in the evening or night',
        'Sit near water or place bowl of water nearby',
        'Listen to flowing water sounds',
        'Allow thoughts to flow without attachment'
      ],
      instructionsZh: [
        '在傍晚或夜间练习',
        '坐在水边或在附近放一碗水',
        '聆听流水声',
        '让思绪自由流动，不执着'
      ],
      materials: ['Blue or black candle', 'Bowl of water', 'Sea shells', 'Moon imagery'],
      materialsZh: ['蓝色或黑色蜡烛', '一碗水', '贝壳', '月亮图像'],
      duration: '20-30 minutes',
      durationZh: '20-30分钟',
      frequency: 'daily'
    }
  ]
};

const EMPOWERMENT_PRACTICES: Record<string, Record<FavorabilityType, Partial<EmpowermentPractice>>> = {
  Wood: {
    YongShen: {
      name: 'Wood Empowerment',
      nameZh: '木能量增强',
      description: 'Maximize Wood energy for growth and creativity',
      descriptionZh: '最大化木能量以促进成长和创造力',
      activities: ['Plant care', 'Morning walks', 'Creative projects', 'Reading'],
      activitiesZh: ['照顾植物', '晨间散步', '创意项目', '阅读'],
      colors: ['Green', 'Teal', 'Light blue'],
      directions: ['East'],
      directionsZh: ['东方'],
      timing: 'Early morning, Spring',
      timingZh: '清晨，春季'
    },
    XiShen: {
      name: 'Wood Support',
      nameZh: '木能量支持',
      description: 'Incorporate Wood energy for supplementary benefit',
      descriptionZh: '融入木能量以获得辅助益处',
      activities: ['Nature visits', 'Journaling', 'Green tea'],
      activitiesZh: ['亲近自然', '写日记', '绿茶'],
      colors: ['Soft green'],
      directions: ['East'],
      directionsZh: ['东方']
    },
    JiShen: {
      name: 'Wood Caution',
      nameZh: '木能量警惕',
      description: 'Minimize excessive Wood energy',
      descriptionZh: '减少过多的木能量',
      activities: ['Limit new projects', 'Avoid overexpansion', 'Rest more'],
      activitiesZh: ['限制新项目', '避免过度扩张', '多休息']
    },
    ChouShen: { name: 'Wood Avoidance', nameZh: '木能量回避' },
    XianShen: { name: 'Wood Neutral', nameZh: '木能量中性' }
  },
  Fire: {
    YongShen: {
      name: 'Fire Empowerment',
      nameZh: '火能量增强',
      description: 'Maximize Fire energy for passion and visibility',
      descriptionZh: '最大化火能量以获得热情和可见性',
      activities: ['Public speaking', 'Social events', 'Exercise', 'Marketing'],
      activitiesZh: ['公开演讲', '社交活动', '锻炼', '营销'],
      colors: ['Red', 'Orange', 'Purple'],
      directions: ['South'],
      directionsZh: ['南方'],
      timing: 'Midday, Summer',
      timingZh: '正午，夏季'
    },
    XiShen: {
      name: 'Fire Support',
      nameZh: '火能量支持',
      activities: ['Candle meditation', 'Warm colors in décor'],
      activitiesZh: ['烛光冥想', '装饰中使用暖色'],
      colors: ['Warm orange']
    },
    JiShen: {
      name: 'Fire Caution',
      nameZh: '火能量警惕',
      activities: ['Avoid confrontation', 'Cool colors', 'Quiet spaces'],
      activitiesZh: ['避免冲突', '冷色调', '安静空间']
    },
    ChouShen: { name: 'Fire Avoidance', nameZh: '火能量回避' },
    XianShen: { name: 'Fire Neutral', nameZh: '火能量中性' }
  },
  Earth: {
    YongShen: {
      name: 'Earth Empowerment',
      nameZh: '土能量增强',
      activities: ['Grounding exercises', 'Real estate', 'Cooking', 'Organization'],
      activitiesZh: ['扎根练习', '房地产', '烹饪', '组织整理'],
      colors: ['Yellow', 'Brown', 'Terracotta'],
      directions: ['Center', 'Southwest', 'Northeast'],
      directionsZh: ['中央', '西南', '东北']
    },
    XiShen: { name: 'Earth Support', nameZh: '土能量支持' },
    JiShen: { name: 'Earth Caution', nameZh: '土能量警惕' },
    ChouShen: { name: 'Earth Avoidance', nameZh: '土能量回避' },
    XianShen: { name: 'Earth Neutral', nameZh: '土能量中性' }
  },
  Metal: {
    YongShen: {
      name: 'Metal Empowerment',
      nameZh: '金能量增强',
      activities: ['Organization', 'Decluttering', 'Financial planning', 'Analysis'],
      activitiesZh: ['组织', '清理杂物', '财务规划', '分析'],
      colors: ['White', 'Gold', 'Silver'],
      directions: ['West'],
      directionsZh: ['西方'],
      timing: 'Afternoon, Autumn',
      timingZh: '下午，秋季'
    },
    XiShen: { name: 'Metal Support', nameZh: '金能量支持' },
    JiShen: { name: 'Metal Caution', nameZh: '金能量警惕' },
    ChouShen: { name: 'Metal Avoidance', nameZh: '金能量回避' },
    XianShen: { name: 'Metal Neutral', nameZh: '金能量中性' }
  },
  Water: {
    YongShen: {
      name: 'Water Empowerment',
      nameZh: '水能量增强',
      activities: ['Meditation', 'Research', 'Swimming', 'Night reflection'],
      activitiesZh: ['冥想', '研究', '游泳', '夜间反思'],
      colors: ['Black', 'Blue', 'Navy'],
      directions: ['North'],
      directionsZh: ['北方'],
      timing: 'Night, Winter',
      timingZh: '夜间，冬季'
    },
    XiShen: { name: 'Water Support', nameZh: '水能量支持' },
    JiShen: { name: 'Water Caution', nameZh: '水能量警惕' },
    ChouShen: { name: 'Water Avoidance', nameZh: '水能量回避' },
    XianShen: { name: 'Water Neutral', nameZh: '水能量中性' }
  }
};

// ==================== CORE FUNCTIONS ====================

/**
 * Generate ritual guidance from favorability analysis
 */
export function generateRitualGuidance(analysis: FavorabilityAnalysis): RitualGuidance {
  const yongShenPractice = createEmpowermentPractice(analysis.yongShen, 'YongShen');
  const xiShenPractice = createEmpowermentPractice(analysis.xiShen, 'XiShen');
  const jiShenAvoidance = createEmpowermentPractice(analysis.jiShen, 'JiShen');

  const timing = createRitualTiming(analysis.yongShen, analysis.jiShen);

  const dailyRituals = ELEMENT_RITUALS[analysis.yongShen]?.filter(r => r.frequency === 'daily') || [];
  const weeklyRituals = ELEMENT_RITUALS[analysis.yongShen]?.filter(r => r.frequency === 'weekly') || [];
  const monthlyRituals = ELEMENT_RITUALS[analysis.yongShen]?.filter(r => r.frequency === 'monthly') || [];

  const { mantra, mantraZh } = generatePersonalMantra(analysis);

  return {
    yongShenPractice,
    xiShenPractice,
    jiShenAvoidance,
    timing,
    dailyRituals,
    weeklyRituals,
    monthlyRituals,
    personalMantra: mantra,
    personalMantraZh: mantraZh
  };
}

/**
 * Create empowerment practice for an element
 */
function createEmpowermentPractice(element: string, type: FavorabilityType): EmpowermentPractice {
  const practice = EMPOWERMENT_PRACTICES[element]?.[type] || {};

  return {
    forType: type,
    name: practice.name || `${element} ${type}`,
    nameZh: practice.nameZh || `${getElementZh(element)}${getTypeZh(type)}`,
    description: practice.description || `${type} practice for ${element}`,
    descriptionZh: practice.descriptionZh || `${getElementZh(element)}的${getTypeZh(type)}练习`,
    activities: practice.activities || [],
    activitiesZh: practice.activitiesZh || [],
    colors: practice.colors || [],
    directions: practice.directions || [],
    directionsZh: practice.directionsZh || [],
    timing: practice.timing || '',
    timingZh: practice.timingZh || ''
  };
}

/**
 * Create ritual timing guidance
 */
function createRitualTiming(yongShen: string, jiShen: string): RitualTiming {
  return {
    element: yongShen,
    optimalHours: ELEMENT_HOURS[yongShen] || [],
    optimalDays: ELEMENT_DAYS[yongShen] || [],
    optimalMonths: ELEMENT_MONTHS[yongShen] || [],
    avoidanceHours: ELEMENT_HOURS[jiShen] || [],
    avoidanceDays: ELEMENT_DAYS[jiShen] || [],
    avoidanceMonths: ELEMENT_MONTHS[jiShen] || []
  };
}

/**
 * Generate personal mantra based on favorability
 */
function generatePersonalMantra(analysis: FavorabilityAnalysis): { mantra: string; mantraZh: string } {
  const mantras: Record<string, { en: string; zh: string }> = {
    Wood: {
      en: 'I grow with purpose, rooted in wisdom, reaching toward light.',
      zh: '我有目的地成长，扎根于智慧，向着光明伸展。'
    },
    Fire: {
      en: 'My inner flame illuminates my path and inspires others.',
      zh: '我内心的火焰照亮我的道路，激励他人。'
    },
    Earth: {
      en: 'I am grounded, stable, and a source of nurturing strength.',
      zh: '我扎根稳定，是滋养力量的源泉。'
    },
    Metal: {
      en: 'I refine my path with clarity, releasing what no longer serves.',
      zh: '我以清晰精炼我的道路，释放不再需要的。'
    },
    Water: {
      en: 'I flow with wisdom, adapting to change while staying true to my depth.',
      zh: '我以智慧流动，适应变化同时保持深度。'
    }
  };

  const base = mantras[analysis.yongShen] || mantras['Earth'];
  return { mantra: base.en, mantraZh: base.zh };
}

function getElementZh(element: string): string {
  const map: Record<string, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };
  return map[element] || element;
}

function getTypeZh(type: FavorabilityType): string {
  const map: Record<FavorabilityType, string> = {
    YongShen: '用神',
    XiShen: '喜神',
    JiShen: '忌神',
    ChouShen: '仇神',
    XianShen: '闲神'
  };
  return map[type] || type;
}

/**
 * Get optimal activity timing
 */
export function getOptimalTiming(
  activity: string,
  analysis: FavorabilityAnalysis
): { hours: string[]; days: string[]; recommendation: string; recommendationZh: string } {
  const yongShen = analysis.yongShen;

  return {
    hours: ELEMENT_HOURS[yongShen] || [],
    days: ELEMENT_DAYS[yongShen] || [],
    recommendation: `Best performed during ${yongShen} hours and days for maximum benefit.`,
    recommendationZh: `在${getElementZh(yongShen)}时辰和日子进行效果最佳。`
  };
}

/**
 * Get element rituals
 */
export function getElementRituals(element: string): ElementalRitual[] {
  return ELEMENT_RITUALS[element] || [];
}

// ==================== EXPORTS ====================

export {
  generateRitualGuidance,
  getOptimalTiming,
  getElementRituals,
  ELEMENT_HOURS,
  ELEMENT_DAYS,
  ELEMENT_MONTHS,
  ELEMENT_RITUALS
};
