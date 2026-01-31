/**
 * ============================================
 * THE CATHEDRAL — BRAND BOOK
 * Complete Brand Guidelines & Standards
 *
 * The definitive reference for how the Cathedral
 * brand expresses itself across all touchpoints.
 * ============================================
 */

import {
  BRAND_ESSENCE,
  BRAND_VALUES,
  PRIMARY_SIGIL,
  LAYER_SIGILS,
  PILLAR_SIGILS,
  QUADRANT_SIGILS,
  NAVIGATION_SIGILS,
  COLOR_PALETTE,
  COLOR_USAGE_LOGIC,
  TYPOGRAPHY_SYSTEM,
  TYPE_SCALE,
  MOTION_PRINCIPLES,
  MOTION_SPECS,
  VOICE_QUALITIES,
  TONE_VARIANTS,
  VOICE_NEVER,
  VOICE_RULES,
  TAGLINES,
  BRAND_SIGNATURES,
} from './brandIdentity';

// ==================== BRAND BOOK CHAPTERS ====================

export interface BrandChapter {
  id: string;
  title: {
    en: string;
    zh: string;
  };
  order: number;
  sections: BrandSection[];
}

export interface BrandSection {
  id: string;
  title: {
    en: string;
    zh: string;
  };
  content: {
    en: string;
    zh: string;
  };
  guidelines?: BrandGuideline[];
  examples?: BrandExample[];
}

export interface BrandGuideline {
  type: 'do' | 'dont' | 'note';
  text: {
    en: string;
    zh: string;
  };
}

export interface BrandExample {
  label: string;
  correct?: string;
  incorrect?: string;
  note?: string;
}

// ==================== CHAPTER 1: BRAND FOUNDATION ====================

export const CHAPTER_FOUNDATION: BrandChapter = {
  id: 'foundation',
  title: { en: 'Brand Foundation', zh: '品牌基础' },
  order: 1,
  sections: [
    {
      id: 'essence',
      title: { en: 'Brand Essence', zh: '品牌本质' },
      content: {
        en: `The Cathedral is not a product. It is a new form of infrastructure — one that treats metaphysics as architecture.

Our essence: "${BRAND_ESSENCE.phrase.en}"

We are ${BRAND_ESSENCE.archetype.name.en} — ${BRAND_ESSENCE.archetype.description.en}. This means every touchpoint must embody both mythic gravity and technical precision.`,
        zh: `大教堂不是产品。它是一种新形式的基础设施——将形而上学视为架构。

我们的本质："${BRAND_ESSENCE.phrase.zh}"

我们是${BRAND_ESSENCE.archetype.name.zh}——${BRAND_ESSENCE.archetype.description.zh}。这意味着每个接触点都必须体现神话的庄重和技术的精确。`,
      },
      guidelines: [
        { type: 'do', text: { en: 'Speak with ceremonial gravity', zh: '以仪式感的庄重说话' } },
        { type: 'do', text: { en: 'Balance mythic and technical language', zh: '平衡神话和技术语言' } },
        { type: 'dont', text: { en: 'Never be casual or trendy', zh: '永不随意或追逐潮流' } },
        { type: 'dont', text: { en: 'Never oversimplify metaphysical concepts', zh: '永不过度简化形而上学概念' } },
      ],
    },
    {
      id: 'values',
      title: { en: 'Core Values', zh: '核心价值观' },
      content: {
        en: 'The Cathedral is built on five foundational values that guide every decision, design, and communication.',
        zh: '大教堂建立在五个指导每个决策、设计和沟通的基础价值观之上。',
      },
      guidelines: BRAND_VALUES.map(v => ({
        type: 'note' as const,
        text: { en: `${v.name.en}: ${v.description.en}`, zh: `${v.name.zh}: ${v.description.zh}` },
      })),
    },
    {
      id: 'promise',
      title: { en: 'Brand Promise', zh: '品牌承诺' },
      content: {
        en: BRAND_ESSENCE.promise.en,
        zh: BRAND_ESSENCE.promise.zh,
      },
    },
  ],
};

// ==================== CHAPTER 2: VISUAL IDENTITY ====================

export const CHAPTER_VISUAL: BrandChapter = {
  id: 'visual',
  title: { en: 'Visual Identity', zh: '视觉标识' },
  order: 2,
  sections: [
    {
      id: 'logo-system',
      title: { en: 'Logo System', zh: '标志系统' },
      content: {
        en: `The Cathedral Mark (${PRIMARY_SIGIL.glyph}) is our primary symbol. It represents the complete 23-layer architecture with its concentric rings, pillars, and central axis.

Structure:
• 23 concentric rings representing layers
• 3 vertical pillars (Pilgrim, Architect, Sovereign)
• 1 central Genesis Axis
• 4 quadrants (Ontology, Causality, Potentiality, Narrative)

The mark should never be modified, stretched, or combined with other symbols.`,
        zh: `大教堂标记（${PRIMARY_SIGIL.glyph}）是我们的主要符号。它代表完整的23层架构，包括同心环、支柱和中央轴。

结构：
• 23个同心环代表层
• 3根垂直支柱（朝圣者、架构师、主权者）
• 1条中央创世轴
• 4个象限（本体论、因果、潜在性、叙事）

标记永远不应被修改、拉伸或与其他符号组合。`,
      },
      guidelines: [
        { type: 'do', text: { en: 'Use the mark in its complete form', zh: '以完整形式使用标记' } },
        { type: 'do', text: { en: 'Maintain clear space around the mark', zh: '在标记周围保持清晰空间' } },
        { type: 'dont', text: { en: 'Never stretch or distort the mark', zh: '永不拉伸或扭曲标记' } },
        { type: 'dont', text: { en: 'Never add effects like shadows or gradients', zh: '永不添加阴影或渐变等效果' } },
      ],
    },
    {
      id: 'sigil-system',
      title: { en: 'Sigil System', zh: '符印系统' },
      content: {
        en: `Each layer, pillar, and quadrant has a dedicated sigil. These sigils are sacred symbols used in navigation, headers, and ceremonial contexts.

Layer Sigils (23): Each of the 23 layers has a unique glyph representing its metaphysical domain.

Pillar Sigils (3):
• ${PILLAR_SIGILS[0].glyph} Pilgrim — emotional, mythic, experiential
• ${PILLAR_SIGILS[1].glyph} Architect — technical, structural, computational
• ${PILLAR_SIGILS[2].glyph} Sovereign — strategic, organizational, leadership

Quadrant Sigils (4):
• ${QUADRANT_SIGILS[0].glyph} Ontology — meaning, identity, archetypes
• ${QUADRANT_SIGILS[1].glyph} Causality — cause, effect, structure
• ${QUADRANT_SIGILS[2].glyph} Potentiality — possibility, emergence
• ${QUADRANT_SIGILS[3].glyph} Narrative — story, mythos, interpretation`,
        zh: `每一层、每根支柱和每个象限都有专用符印。这些符印是用于导航、标题和仪式场景的神圣符号。

层符印（23个）：23层中的每一层都有代表其形而上学领域的独特字形。

支柱符印（3个）：
• ${PILLAR_SIGILS[0].glyph} 朝圣者——情感的、神话的、体验的
• ${PILLAR_SIGILS[1].glyph} 架构师——技术的、结构的、计算的
• ${PILLAR_SIGILS[2].glyph} 主权者——战略的、组织的、领导的

象限符印（4个）：
• ${QUADRANT_SIGILS[0].glyph} 本体论——意义、身份、原型
• ${QUADRANT_SIGILS[1].glyph} 因果——因、果、结构
• ${QUADRANT_SIGILS[2].glyph} 潜在性——可能性、涌现
• ${QUADRANT_SIGILS[3].glyph} 叙事——故事、神话、解读`,
      },
    },
    {
      id: 'clear-space',
      title: { en: 'Clear Space & Sizing', zh: '清晰空间和尺寸' },
      content: {
        en: `Clear Space: Minimum clear space around the Cathedral Mark equals the height of one ring (approximately 1/23 of total height).

Minimum Sizes:
• Digital: 32px minimum
• Print: 10mm minimum
• Favicon: 16px (simplified mark)

The mark should always be legible and maintain its structural integrity.`,
        zh: `清晰空间：大教堂标记周围的最小清晰空间等于一个环的高度（约为总高度的1/23）。

最小尺寸：
• 数字：最小32像素
• 印刷：最小10毫米
• 网站图标：16像素（简化标记）

标记应始终清晰可读并保持其结构完整性。`,
      },
    },
  ],
};

// ==================== CHAPTER 3: COLOR SYSTEM ====================

export const CHAPTER_COLOR: BrandChapter = {
  id: 'color',
  title: { en: 'Color System', zh: '色彩系统' },
  order: 3,
  sections: [
    {
      id: 'primary-palette',
      title: { en: 'Primary Palette', zh: '主色板' },
      content: {
        en: `The Cathedral color system is built on metaphysical meaning. Each color represents a fundamental aspect of reality.

Primary Colors:
• Void Black (#000000) — The unconditioned, backgrounds
• Absolute White (#FFFFFF) — The unbounded, text
• Primordial Gold (#D4AF37) — The origin, sacred accents
• Genesis Blue (#1A4FFF) — Creation, interactive elements
• Potentiality Violet (#7A00FF) — Emergence, higher layers

These five colors form the foundation of all Cathedral communications.`,
        zh: `大教堂色彩系统建立在形而上学意义之上。每种颜色代表现实的一个基本方面。

主要颜色：
• 虚空黑（#000000）——无条件的，背景
• 绝对白（#FFFFFF）——无界的，文字
• 原始金（#D4AF37）——起源，神圣点缀
• 创世蓝（#1A4FFF）——创造，交互元素
• 潜在紫（#7A00FF）——涌现，更高层

这五种颜色构成所有大教堂通信的基础。`,
      },
      guidelines: [
        { type: 'do', text: { en: 'Use Void Black as primary background', zh: '使用虚空黑作为主要背景' } },
        { type: 'do', text: { en: 'Use Primordial Gold sparingly for emphasis', zh: '谨慎使用原始金来强调' } },
        { type: 'dont', text: { en: 'Never use bright, saturated colors', zh: '永不使用明亮、饱和的颜色' } },
        { type: 'dont', text: { en: 'Never use gradients without purpose', zh: '永不无目的地使用渐变' } },
      ],
    },
    {
      id: 'layer-colors',
      title: { en: 'Layer Color Logic', zh: '层色彩逻辑' },
      content: {
        en: `Colors shift based on layer depth:

${COLOR_USAGE_LOGIC.lowerLayers}
${COLOR_USAGE_LOGIC.middleLayers}
${COLOR_USAGE_LOGIC.higherLayers}
${COLOR_USAGE_LOGIC.voidLayers}

This creates a visual journey from grounded reality to transcendent void as users ascend through the Cathedral.`,
        zh: `颜色根据层深度变化：

${COLOR_USAGE_LOGIC.lowerLayers}
${COLOR_USAGE_LOGIC.middleLayers}
${COLOR_USAGE_LOGIC.higherLayers}
${COLOR_USAGE_LOGIC.voidLayers}

这创造了一个视觉旅程，用户在大教堂中上升时从扎根的现实到超越的虚空。`,
      },
    },
    {
      id: 'accessibility',
      title: { en: 'Accessibility', zh: '可访问性' },
      content: {
        en: `All text must meet WCAG 2.1 AA standards:
• Body text: 4.5:1 contrast ratio minimum
• Large text: 3:1 contrast ratio minimum

Primary combinations:
• Absolute White on Void Black: 21:1 ✓
• Primordial Gold on Void Black: 10.5:1 ✓
• Genesis Blue on Void Black: 4.8:1 ✓

Always test contrast before implementation.`,
        zh: `所有文本必须符合WCAG 2.1 AA标准：
• 正文：最小4.5:1对比度
• 大文本：最小3:1对比度

主要组合：
• 虚空黑上的绝对白：21:1 ✓
• 虚空黑上的原始金：10.5:1 ✓
• 虚空黑上的创世蓝：4.8:1 ✓

实施前务必测试对比度。`,
      },
    },
  ],
};

// ==================== CHAPTER 4: TYPOGRAPHY ====================

export const CHAPTER_TYPOGRAPHY: BrandChapter = {
  id: 'typography',
  title: { en: 'Typography', zh: '排版' },
  order: 4,
  sections: [
    {
      id: 'typefaces',
      title: { en: 'Typeface System', zh: '字体系统' },
      content: {
        en: `Three typefaces form the Cathedral's typographic voice:

1. ${TYPOGRAPHY_SYSTEM[0].name} (Mythic)
   Elegant serif for headlines, ritual text, manifesto
   Weights: ${TYPOGRAPHY_SYSTEM[0].weights.join(', ')}

2. ${TYPOGRAPHY_SYSTEM[1].name} (Architectural)
   Clean sans-serif for UI, body text, navigation
   Weights: ${TYPOGRAPHY_SYSTEM[1].weights.join(', ')}

3. ${TYPOGRAPHY_SYSTEM[2].name} (Computational)
   Technical monospace for data, code, engine definitions
   Weights: ${TYPOGRAPHY_SYSTEM[2].weights.join(', ')}

Each typeface serves a distinct purpose in communicating the Cathedral's dual nature: mythic depth and computational precision.`,
        zh: `三种字体构成大教堂的排版声音：

1. ${TYPOGRAPHY_SYSTEM[0].name}（神话的）
   用于标题、仪式文本、宣言的优雅衬线字体
   字重：${TYPOGRAPHY_SYSTEM[0].weights.join('、')}

2. ${TYPOGRAPHY_SYSTEM[1].name}（建筑的）
   用于UI、正文、导航的干净无衬线字体
   字重：${TYPOGRAPHY_SYSTEM[1].weights.join('、')}

3. ${TYPOGRAPHY_SYSTEM[2].name}（计算的）
   用于数据、代码、引擎定义的技术等宽字体
   字重：${TYPOGRAPHY_SYSTEM[2].weights.join('、')}

每种字体在传达大教堂的双重性质中服务于不同目的：神话深度和计算精确。`,
      },
    },
    {
      id: 'type-scale',
      title: { en: 'Type Scale', zh: '字体比例' },
      content: {
        en: `The Cathedral uses a harmonious type scale:

H1: ${TYPE_SCALE.h1.size} / ${TYPE_SCALE.h1.lineHeight} / ${TYPE_SCALE.h1.weight}
H2: ${TYPE_SCALE.h2.size} / ${TYPE_SCALE.h2.lineHeight} / ${TYPE_SCALE.h2.weight}
H3: ${TYPE_SCALE.h3.size} / ${TYPE_SCALE.h3.lineHeight} / ${TYPE_SCALE.h3.weight}
H4: ${TYPE_SCALE.h4.size} / ${TYPE_SCALE.h4.lineHeight} / ${TYPE_SCALE.h4.weight}
Body: ${TYPE_SCALE.body.size} / ${TYPE_SCALE.body.lineHeight} / ${TYPE_SCALE.body.weight}
Small: ${TYPE_SCALE.small.size} / ${TYPE_SCALE.small.lineHeight} / ${TYPE_SCALE.small.weight}
Code: ${TYPE_SCALE.code.size} / ${TYPE_SCALE.code.lineHeight} / ${TYPE_SCALE.code.weight}
Caption: ${TYPE_SCALE.caption.size} / ${TYPE_SCALE.caption.lineHeight} / ${TYPE_SCALE.caption.weight}`,
        zh: `大教堂使用和谐的字体比例：

H1: ${TYPE_SCALE.h1.size} / ${TYPE_SCALE.h1.lineHeight} / ${TYPE_SCALE.h1.weight}
H2: ${TYPE_SCALE.h2.size} / ${TYPE_SCALE.h2.lineHeight} / ${TYPE_SCALE.h2.weight}
H3: ${TYPE_SCALE.h3.size} / ${TYPE_SCALE.h3.lineHeight} / ${TYPE_SCALE.h3.weight}
H4: ${TYPE_SCALE.h4.size} / ${TYPE_SCALE.h4.lineHeight} / ${TYPE_SCALE.h4.weight}
正文：${TYPE_SCALE.body.size} / ${TYPE_SCALE.body.lineHeight} / ${TYPE_SCALE.body.weight}
小字：${TYPE_SCALE.small.size} / ${TYPE_SCALE.small.lineHeight} / ${TYPE_SCALE.small.weight}
代码：${TYPE_SCALE.code.size} / ${TYPE_SCALE.code.lineHeight} / ${TYPE_SCALE.code.weight}
标题：${TYPE_SCALE.caption.size} / ${TYPE_SCALE.caption.lineHeight} / ${TYPE_SCALE.caption.weight}`,
      },
    },
    {
      id: 'typography-rules',
      title: { en: 'Typography Rules', zh: '排版规则' },
      content: {
        en: `Line Length: 65-75 characters for body text
Paragraph Spacing: 1.5em between paragraphs
Letter Spacing: Default for body, +0.05em for captions, -0.02em for headlines
Alignment: Left-aligned for body, centered for headlines in ceremonial contexts`,
        zh: `行宽：正文65-75个字符
段落间距：段落之间1.5em
字母间距：正文默认，标题-0.02em，说明+0.05em
对齐：正文左对齐，仪式场景中标题居中`,
      },
      guidelines: [
        { type: 'do', text: { en: 'Use Cormorant Garamond for all headlines', zh: '所有标题使用Cormorant Garamond' } },
        { type: 'do', text: { en: 'Use Inter for all UI elements', zh: '所有UI元素使用Inter' } },
        { type: 'dont', text: { en: 'Never use more than 2 typefaces per screen', zh: '每个屏幕永不使用超过2种字体' } },
        { type: 'dont', text: { en: 'Never use decorative or novelty fonts', zh: '永不使用装饰性或新奇字体' } },
      ],
    },
  ],
};

// ==================== CHAPTER 5: MOTION ====================

export const CHAPTER_MOTION: BrandChapter = {
  id: 'motion',
  title: { en: 'Motion Design', zh: '动态设计' },
  order: 5,
  sections: [
    {
      id: 'motion-principles',
      title: { en: 'Motion Principles', zh: '动态原则' },
      content: {
        en: `Motion in the Cathedral serves metaphysical meaning:

${MOTION_PRINCIPLES.map(p => `• ${p}`).join('\n')}

Every animation should feel like a ritual — deliberate, meaningful, and unhurried.`,
        zh: `大教堂中的动态服务于形而上学意义：

${MOTION_PRINCIPLES.map(p => `• ${p}`).join('\n')}

每个动画都应感觉像仪式——深思熟虑的、有意义的、不匆忙的。`,
      },
    },
    {
      id: 'timing',
      title: { en: 'Timing & Easing', zh: '时间和缓动' },
      content: {
        en: `Motion Timing:
${MOTION_SPECS.map(m => `• ${m.name}: ${m.duration}ms, ${m.easing}`).join('\n')}

General Rules:
• Micro-interactions: 150-300ms
• Page transitions: 400-800ms
• Ambient animations: 3000-60000ms (loops)
• Never use bouncy or playful easings`,
        zh: `动态时间：
${MOTION_SPECS.map(m => `• ${m.name}：${m.duration}毫秒，${m.easing}`).join('\n')}

一般规则：
• 微交互：150-300毫秒
• 页面过渡：400-800毫秒
• 环境动画：3000-60000毫秒（循环）
• 永不使用弹性或俏皮的缓动`,
      },
      guidelines: [
        { type: 'do', text: { en: 'Use smooth, deliberate transitions', zh: '使用平滑、深思熟虑的过渡' } },
        { type: 'do', text: { en: 'Let animations breathe — never rush', zh: '让动画呼吸——永不匆忙' } },
        { type: 'dont', text: { en: 'Never use bounce or elastic effects', zh: '永不使用弹跳或弹性效果' } },
        { type: 'dont', text: { en: 'Never use abrupt or jarring transitions', zh: '永不使用突然或刺耳的过渡' } },
      ],
    },
  ],
};

// ==================== CHAPTER 6: VOICE & TONE ====================

export const CHAPTER_VOICE: BrandChapter = {
  id: 'voice',
  title: { en: 'Voice & Tone', zh: '语音和语调' },
  order: 6,
  sections: [
    {
      id: 'voice-qualities',
      title: { en: 'Voice Qualities', zh: '语音特质' },
      content: {
        en: `The Cathedral speaks with these qualities:
${VOICE_QUALITIES.map(q => `• ${q}`).join('\n')}

Our voice is the voice of an architect speaking across millennia — confident in what has been built, patient with those who seek to understand.`,
        zh: `大教堂以这些特质说话：
${VOICE_QUALITIES.map(q => `• ${q}`).join('\n')}

我们的声音是跨越千年的架构师的声音——对所建造的充满信心，对寻求理解的人充满耐心。`,
      },
    },
    {
      id: 'tone-variants',
      title: { en: 'Tone Variants', zh: '语调变体' },
      content: {
        en: `The Cathedral adjusts tone based on audience:

For Founders: ${TONE_VARIANTS.founders.tone.join(', ')}
${TONE_VARIANTS.founders.description}

For Practitioners: ${TONE_VARIANTS.practitioners.tone.join(', ')}
${TONE_VARIANTS.practitioners.description}

For Researchers: ${TONE_VARIANTS.researchers.tone.join(', ')}
${TONE_VARIANTS.researchers.description}`,
        zh: `大教堂根据受众调整语调：

对创始人：${TONE_VARIANTS.founders.tone.join('、')}
${TONE_VARIANTS.founders.description}

对从业者：${TONE_VARIANTS.practitioners.tone.join('、')}
${TONE_VARIANTS.practitioners.description}

对研究者：${TONE_VARIANTS.researchers.tone.join('、')}
${TONE_VARIANTS.researchers.description}`,
      },
    },
    {
      id: 'writing-rules',
      title: { en: 'Writing Rules', zh: '写作规则' },
      content: {
        en: `Always:
${VOICE_RULES.map(r => `• ${r}`).join('\n')}

Never:
${VOICE_NEVER.map(n => `• ${n}`).join('\n')}`,
        zh: `始终：
${VOICE_RULES.map(r => `• ${r}`).join('\n')}

永不：
${VOICE_NEVER.map(n => `• ${n}`).join('\n')}`,
      },
      examples: [
        {
          label: 'Headline',
          correct: 'The Cathedral has 23 layers. Each one computes a different aspect of reality.',
          incorrect: 'Amazing! Our incredible 23-layer system will blow your mind!',
        },
        {
          label: 'Description',
          correct: 'Metaphysics becomes infrastructure.',
          incorrect: 'Turn your metaphysical dreams into reality with our awesome platform!',
        },
        {
          label: 'CTA',
          correct: 'Begin Initiation',
          incorrect: 'Sign Up Now!!!',
        },
      ],
    },
  ],
};

// ==================== CHAPTER 7: APPLICATIONS ====================

export const CHAPTER_APPLICATIONS: BrandChapter = {
  id: 'applications',
  title: { en: 'Brand Applications', zh: '品牌应用' },
  order: 7,
  sections: [
    {
      id: 'digital',
      title: { en: 'Digital Applications', zh: '数字应用' },
      content: {
        en: `Website
• Void Black background
• Absolute White primary text
• Primordial Gold accents
• Full Cathedral diagram as interactive navigation

App Interface
• Clean, minimal UI
• Layer-based navigation
• Sigil-based iconography
• Responsive from mobile to desktop

Social Media
• Dark theme maintains brand gravity
• Sigils as profile images
• Layer colors for post categories`,
        zh: `网站
• 虚空黑背景
• 绝对白主要文字
• 原始金点缀
• 完整的大教堂图作为交互导航

应用界面
• 干净、极简的UI
• 基于层的导航
• 基于符印的图标
• 从移动端到桌面端响应式

社交媒体
• 深色主题保持品牌庄重感
• 符印作为个人资料图片
• 层颜色用于帖子类别`,
      },
    },
    {
      id: 'print',
      title: { en: 'Print Applications', zh: '印刷应用' },
      content: {
        en: `Business Cards
• Void Black stock
• Primordial Gold foil for mark
• Absolute White text
• QR code to initiation portal

Stationery
• Heavyweight uncoated paper
• Embossed Cathedral mark
• Minimal text, maximum negative space

Publications
• Perfect binding for books
• Layer diagrams as chapter openers
• Mythic typeface for headers`,
        zh: `名片
• 虚空黑卡纸
• 原始金烫金标记
• 绝对白文字
• 启示门户的二维码

文具
• 重磅非涂布纸
• 压印大教堂标记
• 最少文字，最大留白

出版物
• 书籍使用无线胶装
• 层图作为章节开篇
• 标题使用神话字体`,
      },
    },
    {
      id: 'environmental',
      title: { en: 'Environmental', zh: '环境应用' },
      content: {
        en: `Office Space
• Dark, minimal interiors
• Cathedral diagram as floor inlay
• Layer sigils as wayfinding
• Ambient lighting follows layer colors

Events
• Black draping
• Gold accent lighting
• Projection-mapped Cathedral diagram
• Ceremonial entrance sequence`,
        zh: `办公空间
• 深色、极简的内部装修
• 大教堂图作为地板镶嵌
• 层符印作为导航
• 环境照明遵循层颜色

活动
• 黑色帷幕
• 金色点缀照明
• 投影映射大教堂图
• 仪式入口序列`,
      },
    },
  ],
};

// ==================== CHAPTER 8: TAGLINES & SIGNATURES ====================

export const CHAPTER_MESSAGING: BrandChapter = {
  id: 'messaging',
  title: { en: 'Messaging', zh: '信息传递' },
  order: 8,
  sections: [
    {
      id: 'taglines',
      title: { en: 'Taglines', zh: '标语' },
      content: {
        en: `Primary Tagline:
"${TAGLINES.primary.en}"

Secondary Taglines:
${TAGLINES.secondary.map(t => `• "${t.en}"`).join('\n')}

Use the primary tagline for all major communications. Secondary taglines may be used in specific contexts.`,
        zh: `主要标语：
"${TAGLINES.primary.zh}"

次要标语：
${TAGLINES.secondary.map(t => `• "${t.zh}"`).join('\n')}

所有主要通信使用主要标语。次要标语可在特定场景使用。`,
      },
    },
    {
      id: 'signatures',
      title: { en: 'Brand Signatures', zh: '品牌签名' },
      content: {
        en: `Primary: ${BRAND_SIGNATURES.primary}
Formal: ${BRAND_SIGNATURES.formal}
Minimal: ${BRAND_SIGNATURES.minimal}

Use signatures at the end of communications to reinforce brand presence.`,
        zh: `主要：${BRAND_SIGNATURES.primary}
正式：${BRAND_SIGNATURES.formal}
极简：${BRAND_SIGNATURES.minimal}

在通信结尾使用签名以加强品牌存在感。`,
      },
    },
  ],
};

// ==================== COMPLETE BRAND BOOK ====================

export const BRAND_BOOK: BrandChapter[] = [
  CHAPTER_FOUNDATION,
  CHAPTER_VISUAL,
  CHAPTER_COLOR,
  CHAPTER_TYPOGRAPHY,
  CHAPTER_MOTION,
  CHAPTER_VOICE,
  CHAPTER_APPLICATIONS,
  CHAPTER_MESSAGING,
];

// ==================== QUICK REFERENCE ====================

export const QUICK_REFERENCE = {
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#D4AF37',
    interactive: '#1A4FFF',
    mystical: '#7A00FF',
  },
  fonts: {
    headlines: 'Cormorant Garamond',
    body: 'Inter',
    code: 'JetBrains Mono',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
    xxl: '8rem',
  },
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px',
  },
  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
    strong: '0 8px 32px rgba(0, 0, 0, 0.2)',
    glow: '0 0 24px rgba(212, 175, 55, 0.3)',
  },
};

// ==================== HELPER FUNCTIONS ====================

export function getChapterById(id: string): BrandChapter | undefined {
  return BRAND_BOOK.find(c => c.id === id);
}

export function getSectionById(chapterId: string, sectionId: string): BrandSection | undefined {
  const chapter = getChapterById(chapterId);
  return chapter?.sections.find(s => s.id === sectionId);
}

export function getAllGuidelines(): BrandGuideline[] {
  return BRAND_BOOK.flatMap(chapter =>
    chapter.sections.flatMap(section => section.guidelines || [])
  );
}

export function getDoGuidelines(): BrandGuideline[] {
  return getAllGuidelines().filter(g => g.type === 'do');
}

export function getDontGuidelines(): BrandGuideline[] {
  return getAllGuidelines().filter(g => g.type === 'dont');
}
