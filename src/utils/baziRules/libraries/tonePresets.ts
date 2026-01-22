/**
 * ============================================
 * TONE & STYLE PRESETS
 * Voice Transformation for Pro Reports
 *
 * Each preset transforms:
 * - Vocabulary
 * - Sentence structure
 * - Section headers
 * - Interpretation style
 * - Narrative voice
 * ============================================
 */

// ==================== TYPES ====================

export type TonePreset =
  | 'professional'
  | 'beginner'
  | 'poetic'
  | 'mythic'
  | 'clinical'
  | 'coaching'
  | 'spiritual'
  | 'casual';

export interface ToneStyle {
  id: TonePreset;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  headerStyle: (label: string) => string;
  headerStyleZh: (label: string) => string;
  paragraphStyle: (text: string) => string;
  paragraphStyleZh: (text: string) => string;
  transform: (section: string) => string;
  transformZh: (section: string) => string;
  vocabulary: Record<string, string>;
  vocabularyZh: Record<string, string>;
}

// ==================== TONE PRESETS ====================

export const TONE_PRESETS: Record<TonePreset, ToneStyle> = {
  // ===== PROFESSIONAL =====
  professional: {
    id: 'professional',
    name: 'Professional',
    nameZh: '专业',
    description: 'Clear, objective, business-appropriate language',
    descriptionZh: '清晰、客观、适合商务的语言',
    headerStyle: (label) => `## ${label}`,
    headerStyleZh: (label) => `## ${label}`,
    paragraphStyle: (text) => text,
    paragraphStyleZh: (text) => text,
    transform: (section) => section,
    transformZh: (section) => section,
    vocabulary: {
      'energy': 'influence',
      'power': 'strength',
      'destiny': 'trajectory',
      'soul': 'core self'
    },
    vocabularyZh: {
      '能量': '影响力',
      '力量': '实力',
      '命运': '轨迹',
      '灵魂': '核心自我'
    }
  },

  // ===== BEGINNER =====
  beginner: {
    id: 'beginner',
    name: 'Beginner-Friendly',
    nameZh: '新手友好',
    description: 'Simple explanations with minimal jargon',
    descriptionZh: '简单解释，少用术语',
    headerStyle: (label) => `## ${label} (Explained Simply)`,
    headerStyleZh: (label) => `## ${label}（简单解释）`,
    paragraphStyle: (text) => {
      return text
        .replace(/十神/g, 'Ten Gods (the roles in your chart)')
        .replace(/用神/g, 'Useful God (your helpful element)')
        .replace(/格局/g, 'Structure (your chart\'s pattern)')
        .replace(/大运/g, 'Luck Pillar (10-year period)')
        .replace(/流年/g, 'Annual influence');
    },
    paragraphStyleZh: (text) => {
      return text
        .replace(/十神/g, '十神（命盘中的角色）')
        .replace(/用神/g, '用神（对你有帮助的元素）')
        .replace(/格局/g, '格局（命盘的模式）')
        .replace(/大运/g, '大运（十年周期）');
    },
    transform: (section) => {
      return section + '\n\n> 💡 **In simple terms:** This section describes a key pattern in your chart that influences how you approach life.';
    },
    transformZh: (section) => {
      return section + '\n\n> 💡 **简单来说：** 这部分描述了你命盘中影响你生活方式的关键模式。';
    },
    vocabulary: {
      'complex': 'straightforward',
      'technical': 'easy-to-understand',
      'authority': 'leadership'
    },
    vocabularyZh: {
      '复杂': '直接',
      '技术性': '易于理解',
      '权威': '领导力'
    }
  },

  // ===== POETIC =====
  poetic: {
    id: 'poetic',
    name: 'Poetic',
    nameZh: '诗意',
    description: 'Lyrical, flowing language with metaphors',
    descriptionZh: '抒情、流畅、富有隐喻的语言',
    headerStyle: (label) => `## ✦ ${label} ✦`,
    headerStyleZh: (label) => `## ✦ ${label} ✦`,
    paragraphStyle: (text) => {
      return text
        .replace(/\./g, ' —')
        .replace(/energy/gi, 'current')
        .replace(/structure/gi, 'shape of your days')
        .replace(/strength/gi, 'inner light')
        .replace(/weakness/gi, 'tender places')
        .replace(/challenge/gi, 'invitation to grow');
    },
    paragraphStyleZh: (text) => {
      return text
        .replace(/。/g, ' ——')
        .replace(/能量/g, '流动')
        .replace(/格局/g, '日子的形状')
        .replace(/强/g, '内在之光')
        .replace(/弱/g, '柔软之处')
        .replace(/挑战/g, '成长的邀请');
    },
    transform: (section) => {
      const lines = section.split('\n');
      return lines.map((line, i) => {
        if (i === 0) return line;
        if (line.startsWith('#')) return line;
        if (line.trim() === '') return line;
        return `*${line}*`;
      }).join('\n');
    },
    transformZh: (section) => section,
    vocabulary: {
      'chart': 'celestial map',
      'element': 'essence',
      'pillar': 'tower of time'
    },
    vocabularyZh: {
      '命盘': '天象图',
      '元素': '本质',
      '柱': '时间之塔'
    }
  },

  // ===== MYTHIC =====
  mythic: {
    id: 'mythic',
    name: 'Mythic',
    nameZh: '神话',
    description: 'Archetypal, hero\'s journey narrative',
    descriptionZh: '原型叙事，英雄之旅风格',
    headerStyle: (label) => `## 🜁 ${label}`,
    headerStyleZh: (label) => `## 🜁 ${label}`,
    paragraphStyle: (text) => {
      return text
        .replace(/you/gi, 'the pilgrim')
        .replace(/your/gi, 'the pilgrim\'s')
        .replace(/challenge/gi, 'trial')
        .replace(/opportunity/gi, 'boon')
        .replace(/strength/gi, 'power')
        .replace(/weakness/gi, 'shadow')
        .replace(/career/gi, 'quest')
        .replace(/relationship/gi, 'sacred bond');
    },
    paragraphStyleZh: (text) => {
      return text
        .replace(/你/g, '朝圣者')
        .replace(/你的/g, '朝圣者的')
        .replace(/挑战/g, '试炼')
        .replace(/机会/g, '恩赐')
        .replace(/优势/g, '力量')
        .replace(/弱点/g, '阴影')
        .replace(/事业/g, '使命')
        .replace(/关系/g, '神圣之缘');
    },
    transform: (section) => {
      return `> *"In the great tapestry of fate..."*\n\n${section}\n\n> *The journey continues...*`;
    },
    transformZh: (section) => {
      return `> *"在命运的宏大织锦中..."*\n\n${section}\n\n> *旅程继续...*`;
    },
    vocabulary: {
      'chart': 'sacred scroll',
      'element': 'primal force',
      'analysis': 'divination',
      'reading': 'oracle'
    },
    vocabularyZh: {
      '命盘': '神圣卷轴',
      '元素': '原始力量',
      '分析': '占卜',
      '解读': '神谕'
    }
  },

  // ===== CLINICAL =====
  clinical: {
    id: 'clinical',
    name: 'Clinical',
    nameZh: '临床',
    description: 'Precise, analytical, data-focused',
    descriptionZh: '精确、分析性、关注数据',
    headerStyle: (label) => `## ${label}`,
    headerStyleZh: (label) => `## ${label}`,
    paragraphStyle: (text) => {
      return text
        .replace(/emotion|story|archetype/gi, 'pattern')
        .replace(/soul|spirit/gi, 'psychological profile')
        .replace(/destiny/gi, 'probabilistic tendency')
        .replace(/energy/gi, 'factor');
    },
    paragraphStyleZh: (text) => {
      return text
        .replace(/情感|故事|原型/g, '模式')
        .replace(/灵魂|精神/g, '心理档案')
        .replace(/命运/g, '概率倾向')
        .replace(/能量/g, '因素');
    },
    transform: (section) => {
      return `${section}\n\n**Confidence Level:** Moderate to High\n**Data Sources:** Classical BaZi algorithms`;
    },
    transformZh: (section) => {
      return `${section}\n\n**置信度：** 中高\n**数据来源：** 经典八字算法`;
    },
    vocabulary: {
      'mystical': 'calculated',
      'spiritual': 'psychological',
      'fate': 'tendency'
    },
    vocabularyZh: {
      '神秘': '计算的',
      '精神的': '心理的',
      '命运': '倾向'
    }
  },

  // ===== COACHING =====
  coaching: {
    id: 'coaching',
    name: 'Coaching',
    nameZh: '教练',
    description: 'Action-oriented with practical steps',
    descriptionZh: '以行动为导向，包含实际步骤',
    headerStyle: (label) => `## ${label} — Action Steps`,
    headerStyleZh: (label) => `## ${label} — 行动步骤`,
    paragraphStyle: (text) => text,
    paragraphStyleZh: (text) => text,
    transform: (section) => {
      return `${section}\n\n**🎯 Action Step:** Identify one small step you can take this week to align with this energy.\n\n**📝 Reflection Question:** How does this pattern show up in your daily life?`;
    },
    transformZh: (section) => {
      return `${section}\n\n**🎯 行动步骤：** 确定本周你可以采取的一个小步骤来配合这个能量。\n\n**📝 反思问题：** 这个模式在你的日常生活中如何体现？`;
    },
    vocabulary: {
      'destiny': 'potential',
      'fate': 'opportunity',
      'predetermined': 'tendency'
    },
    vocabularyZh: {
      '命运': '潜力',
      '宿命': '机会',
      '注定': '倾向'
    }
  },

  // ===== SPIRITUAL =====
  spiritual: {
    id: 'spiritual',
    name: 'Spiritual',
    nameZh: '灵性',
    description: 'Soul-focused, transformation-oriented',
    descriptionZh: '关注灵魂，以转化为导向',
    headerStyle: (label) => `## 🕯️ ${label}`,
    headerStyleZh: (label) => `## 🕯️ ${label}`,
    paragraphStyle: (text) => {
      return text
        .replace(/career/gi, 'life purpose')
        .replace(/success/gi, 'fulfillment')
        .replace(/wealth/gi, 'abundance')
        .replace(/power/gi, 'inner sovereignty');
    },
    paragraphStyleZh: (text) => {
      return text
        .replace(/事业/g, '人生使命')
        .replace(/成功/g, '圆满')
        .replace(/财富/g, '丰盛')
        .replace(/权力/g, '内在主权');
    },
    transform: (section) => {
      return `${section}\n\n> 🙏 *May this wisdom guide your soul's journey toward wholeness.*`;
    },
    transformZh: (section) => {
      return `${section}\n\n> 🙏 *愿这智慧引导你的灵魂走向完整。*`;
    },
    vocabulary: {
      'problem': 'growth opportunity',
      'weakness': 'area for healing',
      'conflict': 'invitation to integrate'
    },
    vocabularyZh: {
      '问题': '成长机会',
      '弱点': '疗愈领域',
      '冲突': '整合邀请'
    }
  },

  // ===== CASUAL =====
  casual: {
    id: 'casual',
    name: 'Casual',
    nameZh: '休闲',
    description: 'Friendly, conversational, approachable',
    descriptionZh: '友好、对话式、平易近人',
    headerStyle: (label) => `## ${label}`,
    headerStyleZh: (label) => `## ${label}`,
    paragraphStyle: (text) => {
      return text
        .replace(/Furthermore/gi, 'Also')
        .replace(/Additionally/gi, 'Plus')
        .replace(/However/gi, 'But')
        .replace(/Therefore/gi, 'So');
    },
    paragraphStyleZh: (text) => {
      return text
        .replace(/此外/g, '还有')
        .replace(/然而/g, '但是')
        .replace(/因此/g, '所以');
    },
    transform: (section) => {
      return section.replace(/\*\*/g, '').replace(/\n\n/g, '\n\n');
    },
    transformZh: (section) => {
      return section.replace(/\*\*/g, '');
    },
    vocabulary: {
      'utilize': 'use',
      'implement': 'try',
      'optimize': 'improve'
    },
    vocabularyZh: {
      '利用': '用',
      '实施': '试试',
      '优化': '改善'
    }
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get tone preset by ID
 */
export function getTonePreset(id: TonePreset): ToneStyle {
  return TONE_PRESETS[id] || TONE_PRESETS.professional;
}

/**
 * Get all available tone presets
 */
export function getAllTonePresets(): ToneStyle[] {
  return Object.values(TONE_PRESETS);
}

/**
 * Apply tone to content
 */
export function applyTone(content: string, toneId: TonePreset, language: 'en' | 'zh' = 'en'): string {
  const tone = getTonePreset(toneId);

  // Apply vocabulary replacements
  let result = content;
  const vocab = language === 'zh' ? tone.vocabularyZh : tone.vocabulary;

  for (const [from, to] of Object.entries(vocab)) {
    result = result.replace(new RegExp(from, 'gi'), to);
  }

  // Apply paragraph style
  result = language === 'zh' ? tone.paragraphStyleZh(result) : tone.paragraphStyle(result);

  // Apply transform
  result = language === 'zh' ? tone.transformZh(result) : tone.transform(result);

  return result;
}

/**
 * Apply tone to header
 */
export function applyToneToHeader(header: string, toneId: TonePreset, language: 'en' | 'zh' = 'en'): string {
  const tone = getTonePreset(toneId);
  return language === 'zh' ? tone.headerStyleZh(header) : tone.headerStyle(header);
}

/**
 * Get tone description
 */
export function getToneDescription(toneId: TonePreset, language: 'en' | 'zh' = 'en'): string {
  const tone = getTonePreset(toneId);
  return language === 'zh' ? tone.descriptionZh : tone.description;
}

/**
 * Get recommended tone for context
 */
export function recommendTone(context: {
  hasNarrative?: boolean;
  hasMythos?: boolean;
  isBusinessContext?: boolean;
  isBeginner?: boolean;
  wantsActionSteps?: boolean;
}): TonePreset {
  if (context.isBeginner) return 'beginner';
  if (context.wantsActionSteps) return 'coaching';
  if (context.isBusinessContext) return 'professional';
  if (context.hasMythos) return 'mythic';
  if (context.hasNarrative) return 'poetic';
  return 'professional';
}

// ==================== EXPORTS ====================

export {
  getTonePreset,
  getAllTonePresets,
  applyTone,
  applyToneToHeader,
  getToneDescription,
  recommendTone
};
