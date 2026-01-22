/**
 * ============================================
 * SHEN SHA LIBRARY (神煞)
 * Complete Collection of Auxiliary Stars
 *
 * Shen Sha are auxiliary influences that add
 * nuance to chart interpretation. They are
 * derived from stem/branch combinations.
 *
 * Categories:
 * - Auspicious Stars (吉神)
 * - Inauspicious Stars (凶神)
 * - Neutral/Conditional Stars
 * ============================================
 */

// ==================== TYPES ====================

export interface ShenShaStar {
  id: string;
  name: string;
  nameZh: string;
  category: 'auspicious' | 'inauspicious' | 'neutral';
  description: string;
  descriptionZh: string;
  themes: string[];
  themesZh: string[];
  activation: string;
  activationZh: string;
}

export interface ShenShaHit {
  star: ShenShaStar;
  pillar: 'Year' | 'Month' | 'Day' | 'Hour' | 'Luck' | 'Annual';
  triggerBranch: string;
  triggerStem?: string;
  strength: number; // 0-100
}

export interface ShenShaAnalysis {
  hits: ShenShaHit[];
  auspiciousCount: number;
  inauspiciousCount: number;
  dominantThemes: string[];
  summary: string;
  summaryZh: string;
}

// ==================== STAR LIBRARY ====================

export const SHEN_SHA_STARS: ShenShaStar[] = [
  // ========== AUSPICIOUS STARS ==========
  {
    id: 'tian_yi_gui_ren',
    name: 'Nobleman Star',
    nameZh: '天乙贵人',
    category: 'auspicious',
    description: 'The most important benefactor star. Brings help from influential people, protection in difficulties.',
    descriptionZh: '最重要的贵人星。带来贵人相助，逢凶化吉。',
    themes: ['benefactors', 'help', 'protection', 'influence'],
    themesZh: ['贵人', '帮助', '保护', '影响力'],
    activation: 'When Year/Day Stem meets specific branches',
    activationZh: '年干或日干遇特定地支'
  },
  {
    id: 'wen_chang',
    name: 'Literary Star',
    nameZh: '文昌',
    category: 'auspicious',
    description: 'Academic and intellectual brilliance. Favors writing, education, examinations.',
    descriptionZh: '学术和智力上的卓越。有利于写作、教育、考试。',
    themes: ['academics', 'writing', 'intelligence', 'examinations'],
    themesZh: ['学业', '写作', '智慧', '考试'],
    activation: 'Based on Day Stem to specific branches',
    activationZh: '根据日干对应特定地支'
  },
  {
    id: 'tian_de',
    name: 'Heavenly Virtue',
    nameZh: '天德',
    category: 'auspicious',
    description: 'Divine blessing and moral protection. Reduces misfortune, promotes virtue.',
    descriptionZh: '天赐祝福和道德保护。减少灾祸，提升德行。',
    themes: ['virtue', 'blessing', 'protection', 'morality'],
    themesZh: ['德行', '祝福', '保护', '道德'],
    activation: 'Based on Month Branch',
    activationZh: '根据月支'
  },
  {
    id: 'yue_de',
    name: 'Monthly Virtue',
    nameZh: '月德',
    category: 'auspicious',
    description: 'Monthly blessing that smooths difficulties and attracts good fortune.',
    descriptionZh: '每月祝福，化解困难，吸引好运。',
    themes: ['blessing', 'smoothness', 'fortune'],
    themesZh: ['祝福', '顺利', '好运'],
    activation: 'Based on Month Branch',
    activationZh: '根据月支'
  },
  {
    id: 'jin_yu',
    name: 'Golden Carriage',
    nameZh: '金舆',
    category: 'auspicious',
    description: 'Vehicle of the Emperor. Brings status elevation and comfortable travel.',
    descriptionZh: '帝王之车。带来地位提升和舒适旅行。',
    themes: ['status', 'travel', 'vehicles', 'comfort'],
    themesZh: ['地位', '旅行', '车辆', '舒适'],
    activation: 'Based on Day Stem',
    activationZh: '根据日干'
  },
  {
    id: 'lu_shen',
    name: 'Prosperity Star',
    nameZh: '禄神',
    category: 'auspicious',
    description: 'Star of salary and sustenance. Indicates stable income and career success.',
    descriptionZh: '俸禄之神。表示稳定收入和事业成功。',
    themes: ['income', 'career', 'stability', 'sustenance'],
    themesZh: ['收入', '事业', '稳定', '生计'],
    activation: 'When Day Stem meets its Lu branch',
    activationZh: '日干遇禄支'
  },
  {
    id: 'yi_ma',
    name: 'Traveling Horse',
    nameZh: '驿马',
    category: 'auspicious',
    description: 'Star of movement and change. Favors travel, relocation, career changes.',
    descriptionZh: '动变之星。有利于旅行、搬迁、职业变动。',
    themes: ['travel', 'movement', 'change', 'relocation'],
    themesZh: ['旅行', '移动', '变化', '搬迁'],
    activation: 'Based on Year or Day Branch',
    activationZh: '根据年支或日支'
  },
  {
    id: 'jiang_xing',
    name: 'General Star',
    nameZh: '将星',
    category: 'auspicious',
    description: 'Leadership and command ability. Favors military, management, authority roles.',
    descriptionZh: '领导和指挥能力。有利于军事、管理、权威职位。',
    themes: ['leadership', 'authority', 'management', 'command'],
    themesZh: ['领导', '权威', '管理', '指挥'],
    activation: 'Based on Year or Day Branch',
    activationZh: '根据年支或日支'
  },
  {
    id: 'hua_gai',
    name: 'Canopy Star',
    nameZh: '华盖',
    category: 'auspicious',
    description: 'Star of spirituality and solitude. Favors religious pursuits, arts, metaphysics.',
    descriptionZh: '灵性和独处之星。有利于宗教追求、艺术、玄学。',
    themes: ['spirituality', 'solitude', 'arts', 'metaphysics'],
    themesZh: ['灵性', '独处', '艺术', '玄学'],
    activation: 'Based on Year or Day Branch',
    activationZh: '根据年支或日支'
  },
  {
    id: 'tian_xi',
    name: 'Heavenly Joy',
    nameZh: '天喜',
    category: 'auspicious',
    description: 'Star of happiness and celebration. Indicates joyful events, especially marriage.',
    descriptionZh: '喜庆之星。表示喜事，尤其是婚姻。',
    themes: ['joy', 'celebration', 'marriage', 'happiness'],
    themesZh: ['喜悦', '庆祝', '婚姻', '幸福'],
    activation: 'Based on Year Branch',
    activationZh: '根据年支'
  },
  {
    id: 'hong_luan',
    name: 'Red Phoenix',
    nameZh: '红鸾',
    category: 'auspicious',
    description: 'Primary romance and marriage star. Strong indicator of romantic relationships.',
    descriptionZh: '主要的姻缘星。强烈表示恋爱关系。',
    themes: ['romance', 'marriage', 'relationships', 'love'],
    themesZh: ['浪漫', '婚姻', '关系', '爱情'],
    activation: 'Based on Year Branch',
    activationZh: '根据年支'
  },

  // ========== INAUSPICIOUS STARS ==========
  {
    id: 'yang_ren',
    name: 'Blade Star',
    nameZh: '羊刃',
    category: 'inauspicious',
    description: 'Sharp, aggressive energy. Can indicate injuries, conflicts, or powerful willpower.',
    descriptionZh: '锐利、激进的能量。可能表示伤害、冲突或强大意志力。',
    themes: ['conflict', 'injury', 'aggression', 'willpower'],
    themesZh: ['冲突', '伤害', '激进', '意志力'],
    activation: 'When Day Stem meets its Blade branch',
    activationZh: '日干遇羊刃支'
  },
  {
    id: 'tao_hua',
    name: 'Peach Blossom',
    nameZh: '桃花',
    category: 'neutral',
    description: 'Star of charm and attraction. Can bring romance or scandal depending on context.',
    descriptionZh: '魅力和吸引力之星。根据情况可带来浪漫或绯闻。',
    themes: ['charm', 'attraction', 'romance', 'scandal'],
    themesZh: ['魅力', '吸引力', '浪漫', '绯闻'],
    activation: 'Based on Year or Day Branch',
    activationZh: '根据年支或日支'
  },
  {
    id: 'gu_chen',
    name: 'Lonely Star',
    nameZh: '孤辰',
    category: 'inauspicious',
    description: 'Star of isolation and loneliness. May indicate difficulty in relationships.',
    descriptionZh: '孤独之星。可能表示人际关系困难。',
    themes: ['isolation', 'loneliness', 'independence', 'solitude'],
    themesZh: ['孤立', '孤独', '独立', '独处'],
    activation: 'Based on Year Branch',
    activationZh: '根据年支'
  },
  {
    id: 'gua_su',
    name: 'Widowhood Star',
    nameZh: '寡宿',
    category: 'inauspicious',
    description: 'Star indicating difficulty maintaining relationships. Can indicate widowhood.',
    descriptionZh: '表示维持关系困难之星。可能表示守寡。',
    themes: ['widowhood', 'separation', 'loss', 'solitude'],
    themesZh: ['守寡', '分离', '失去', '独处'],
    activation: 'Based on Year Branch',
    activationZh: '根据年支'
  },
  {
    id: 'wang_shen',
    name: 'Robbery Star',
    nameZh: '亡神',
    category: 'inauspicious',
    description: 'Star of loss and robbery. Indicates potential for material or emotional loss.',
    descriptionZh: '损失和抢劫之星。表示物质或情感损失的可能。',
    themes: ['loss', 'robbery', 'deception', 'danger'],
    themesZh: ['损失', '抢劫', '欺骗', '危险'],
    activation: 'Based on Year or Day Branch',
    activationZh: '根据年支或日支'
  },
  {
    id: 'jie_sha',
    name: 'Disaster Star',
    nameZh: '劫煞',
    category: 'inauspicious',
    description: 'Star of calamity and robbery. Indicates potential for accidents or theft.',
    descriptionZh: '灾难和抢劫之星。表示意外或盗窃的可能。',
    themes: ['disaster', 'robbery', 'accident', 'loss'],
    themesZh: ['灾难', '抢劫', '意外', '损失'],
    activation: 'Based on Year or Day Branch',
    activationZh: '根据年支或日支'
  },
  {
    id: 'bai_hu',
    name: 'White Tiger',
    nameZh: '白虎',
    category: 'inauspicious',
    description: 'Star of bloodshed and surgery. Can indicate accidents, surgeries, or violence.',
    descriptionZh: '血光和手术之星。可能表示意外、手术或暴力。',
    themes: ['bloodshed', 'surgery', 'violence', 'accident'],
    themesZh: ['血光', '手术', '暴力', '意外'],
    activation: 'Based on Month or Year',
    activationZh: '根据月或年'
  },
  {
    id: 'diao_ke',
    name: 'Funeral Star',
    nameZh: '吊客',
    category: 'inauspicious',
    description: 'Star of mourning and funerals. May indicate attending funerals or grief.',
    descriptionZh: '丧事和葬礼之星。可能表示参加葬礼或悲伤。',
    themes: ['mourning', 'funerals', 'grief', 'death'],
    themesZh: ['哀悼', '葬礼', '悲伤', '死亡'],
    activation: 'Based on Year Branch',
    activationZh: '根据年支'
  },
  {
    id: 'sang_men',
    name: 'Mourning Gate',
    nameZh: '丧门',
    category: 'inauspicious',
    description: 'Similar to Funeral Star. Indicates bereavement or mourning periods.',
    descriptionZh: '类似吊客。表示丧亲或哀悼期。',
    themes: ['mourning', 'bereavement', 'grief', 'loss'],
    themesZh: ['哀悼', '丧亲', '悲伤', '损失'],
    activation: 'Based on Year Branch',
    activationZh: '根据年支'
  },

  // ========== NEUTRAL STARS ==========
  {
    id: 'tian_luo',
    name: 'Heaven Net',
    nameZh: '天罗',
    category: 'neutral',
    description: 'Entanglement from heaven. Can indicate legal issues or feeling trapped.',
    descriptionZh: '来自天的纠缠。可能表示法律问题或感觉被困。',
    themes: ['entanglement', 'legal', 'restriction', 'fate'],
    themesZh: ['纠缠', '法律', '限制', '命运'],
    activation: 'Specific branch combinations',
    activationZh: '特定地支组合'
  },
  {
    id: 'di_wang',
    name: 'Earth Net',
    nameZh: '地网',
    category: 'neutral',
    description: 'Entanglement from earth. Can indicate property issues or feeling grounded.',
    descriptionZh: '来自地的纠缠。可能表示财产问题或感觉扎根。',
    themes: ['entanglement', 'property', 'grounding', 'restriction'],
    themesZh: ['纠缠', '财产', '扎根', '限制'],
    activation: 'Specific branch combinations',
    activationZh: '特定地支组合'
  },
  {
    id: 'tai_ji',
    name: 'Tai Ji Star',
    nameZh: '太极贵人',
    category: 'auspicious',
    description: 'Star of wisdom and metaphysics. Favors philosophical and spiritual pursuits.',
    descriptionZh: '智慧和玄学之星。有利于哲学和灵性追求。',
    themes: ['wisdom', 'philosophy', 'spirituality', 'metaphysics'],
    themesZh: ['智慧', '哲学', '灵性', '玄学'],
    activation: 'Based on Day Stem',
    activationZh: '根据日干'
  },
  {
    id: 'fu_xing',
    name: 'Fortune Star',
    nameZh: '福星贵人',
    category: 'auspicious',
    description: 'General blessing star. Brings good fortune and positive outcomes.',
    descriptionZh: '一般祝福星。带来好运和积极结果。',
    themes: ['fortune', 'blessing', 'luck', 'positivity'],
    themesZh: ['财富', '祝福', '运气', '积极'],
    activation: 'Based on Day Stem',
    activationZh: '根据日干'
  }
];

// ==================== DETECTION TABLES ====================

/**
 * Nobleman Star (天乙贵人) lookup
 * Key: Day Stem, Value: Array of branches that trigger
 */
const NOBLEMAN_TABLE: Record<string, string[]> = {
  'Jia': ['Chou', 'Wei'],
  'Yi': ['Zi', 'Shen'],
  'Bing': ['Hai', 'You'],
  'Ding': ['Hai', 'You'],
  'Wu': ['Chou', 'Wei'],
  'Ji': ['Zi', 'Shen'],
  'Geng': ['Chou', 'Wei'],
  'Xin': ['Yin', 'Wu'],
  'Ren': ['Mao', 'Si'],
  'Gui': ['Mao', 'Si']
};

/**
 * Literary Star (文昌) lookup
 */
const LITERARY_TABLE: Record<string, string> = {
  'Jia': 'Si',
  'Yi': 'Wu',
  'Bing': 'Shen',
  'Ding': 'You',
  'Wu': 'Shen',
  'Ji': 'You',
  'Geng': 'Hai',
  'Xin': 'Zi',
  'Ren': 'Yin',
  'Gui': 'Mao'
};

/**
 * Traveling Horse (驿马) lookup
 * Key: Year/Day Branch, Value: Traveling Horse branch
 */
const TRAVELING_HORSE_TABLE: Record<string, string> = {
  'Yin': 'Shen', 'Wu': 'Shen', 'Xu': 'Shen',
  'Shen': 'Yin', 'Zi': 'Yin', 'Chen': 'Yin',
  'Si': 'Hai', 'You': 'Hai', 'Chou': 'Hai',
  'Hai': 'Si', 'Mao': 'Si', 'Wei': 'Si'
};

/**
 * Peach Blossom (桃花) lookup
 */
const PEACH_BLOSSOM_TABLE: Record<string, string> = {
  'Yin': 'Mao', 'Wu': 'Mao', 'Xu': 'Mao',
  'Shen': 'You', 'Zi': 'You', 'Chen': 'You',
  'Si': 'Wu', 'You': 'Wu', 'Chou': 'Wu',
  'Hai': 'Zi', 'Mao': 'Zi', 'Wei': 'Zi'
};

/**
 * Blade Star (羊刃) lookup
 */
const BLADE_TABLE: Record<string, string> = {
  'Jia': 'Mao',
  'Yi': 'Chen',
  'Bing': 'Wu',
  'Ding': 'Wei',
  'Wu': 'Wu',
  'Ji': 'Wei',
  'Geng': 'You',
  'Xin': 'Xu',
  'Ren': 'Zi',
  'Gui': 'Chou'
};

/**
 * Prosperity Star (禄神) lookup
 */
const PROSPERITY_TABLE: Record<string, string> = {
  'Jia': 'Yin',
  'Yi': 'Mao',
  'Bing': 'Si',
  'Ding': 'Wu',
  'Wu': 'Si',
  'Ji': 'Wu',
  'Geng': 'Shen',
  'Xin': 'You',
  'Ren': 'Hai',
  'Gui': 'Zi'
};

// ==================== DETECTION FUNCTIONS ====================

export interface ChartInput {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
  luckBranch?: string;
  annualBranch?: string;
}

/**
 * Main function to detect all Shen Sha in a chart
 */
export function detectShenSha(chart: ChartInput): ShenShaAnalysis {
  const hits: ShenShaHit[] = [];

  // Detect each star type
  hits.push(...detectNobleman(chart));
  hits.push(...detectLiterary(chart));
  hits.push(...detectTravelingHorse(chart));
  hits.push(...detectPeachBlossom(chart));
  hits.push(...detectBlade(chart));
  hits.push(...detectProsperity(chart));

  // Count by category
  const auspiciousCount = hits.filter(h => h.star.category === 'auspicious').length;
  const inauspiciousCount = hits.filter(h => h.star.category === 'inauspicious').length;

  // Extract dominant themes
  const themeCount: Record<string, number> = {};
  hits.forEach(h => {
    h.star.themes.forEach(t => {
      themeCount[t] = (themeCount[t] ?? 0) + h.strength;
    });
  });
  const dominantThemes = Object.entries(themeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t);

  // Generate summary
  const summary = generateSummary(hits, auspiciousCount, inauspiciousCount);
  const summaryZh = generateSummaryZh(hits, auspiciousCount, inauspiciousCount);

  return {
    hits,
    auspiciousCount,
    inauspiciousCount,
    dominantThemes,
    summary,
    summaryZh
  };
}

function detectNobleman(chart: ChartInput): ShenShaHit[] {
  const hits: ShenShaHit[] = [];
  const star = SHEN_SHA_STARS.find(s => s.id === 'tian_yi_gui_ren')!;
  const triggerBranches = NOBLEMAN_TABLE[chart.dayStem] || [];

  const pillars = [
    { branch: chart.yearBranch, type: 'Year' as const },
    { branch: chart.monthBranch, type: 'Month' as const },
    { branch: chart.dayBranch, type: 'Day' as const },
    { branch: chart.hourBranch, type: 'Hour' as const }
  ];

  pillars.forEach(p => {
    if (triggerBranches.includes(p.branch)) {
      hits.push({
        star,
        pillar: p.type,
        triggerBranch: p.branch,
        strength: 80
      });
    }
  });

  return hits;
}

function detectLiterary(chart: ChartInput): ShenShaHit[] {
  const hits: ShenShaHit[] = [];
  const star = SHEN_SHA_STARS.find(s => s.id === 'wen_chang')!;
  const triggerBranch = LITERARY_TABLE[chart.dayStem];

  const pillars = [
    { branch: chart.yearBranch, type: 'Year' as const },
    { branch: chart.monthBranch, type: 'Month' as const },
    { branch: chart.dayBranch, type: 'Day' as const },
    { branch: chart.hourBranch, type: 'Hour' as const }
  ];

  pillars.forEach(p => {
    if (p.branch === triggerBranch) {
      hits.push({
        star,
        pillar: p.type,
        triggerBranch: p.branch,
        strength: 70
      });
    }
  });

  return hits;
}

function detectTravelingHorse(chart: ChartInput): ShenShaHit[] {
  const hits: ShenShaHit[] = [];
  const star = SHEN_SHA_STARS.find(s => s.id === 'yi_ma')!;
  const yearHorse = TRAVELING_HORSE_TABLE[chart.yearBranch];
  const dayHorse = TRAVELING_HORSE_TABLE[chart.dayBranch];

  const pillars = [
    { branch: chart.yearBranch, type: 'Year' as const },
    { branch: chart.monthBranch, type: 'Month' as const },
    { branch: chart.dayBranch, type: 'Day' as const },
    { branch: chart.hourBranch, type: 'Hour' as const }
  ];

  pillars.forEach(p => {
    if (p.branch === yearHorse || p.branch === dayHorse) {
      hits.push({
        star,
        pillar: p.type,
        triggerBranch: p.branch,
        strength: 65
      });
    }
  });

  return hits;
}

function detectPeachBlossom(chart: ChartInput): ShenShaHit[] {
  const hits: ShenShaHit[] = [];
  const star = SHEN_SHA_STARS.find(s => s.id === 'tao_hua')!;
  const yearPeach = PEACH_BLOSSOM_TABLE[chart.yearBranch];
  const dayPeach = PEACH_BLOSSOM_TABLE[chart.dayBranch];

  const pillars = [
    { branch: chart.yearBranch, type: 'Year' as const },
    { branch: chart.monthBranch, type: 'Month' as const },
    { branch: chart.dayBranch, type: 'Day' as const },
    { branch: chart.hourBranch, type: 'Hour' as const }
  ];

  pillars.forEach(p => {
    if (p.branch === yearPeach || p.branch === dayPeach) {
      hits.push({
        star,
        pillar: p.type,
        triggerBranch: p.branch,
        strength: 60
      });
    }
  });

  return hits;
}

function detectBlade(chart: ChartInput): ShenShaHit[] {
  const hits: ShenShaHit[] = [];
  const star = SHEN_SHA_STARS.find(s => s.id === 'yang_ren')!;
  const bladeBranch = BLADE_TABLE[chart.dayStem];

  const pillars = [
    { branch: chart.yearBranch, type: 'Year' as const },
    { branch: chart.monthBranch, type: 'Month' as const },
    { branch: chart.dayBranch, type: 'Day' as const },
    { branch: chart.hourBranch, type: 'Hour' as const }
  ];

  pillars.forEach(p => {
    if (p.branch === bladeBranch) {
      hits.push({
        star,
        pillar: p.type,
        triggerBranch: p.branch,
        strength: 75
      });
    }
  });

  return hits;
}

function detectProsperity(chart: ChartInput): ShenShaHit[] {
  const hits: ShenShaHit[] = [];
  const star = SHEN_SHA_STARS.find(s => s.id === 'lu_shen')!;
  const prosperityBranch = PROSPERITY_TABLE[chart.dayStem];

  const pillars = [
    { branch: chart.yearBranch, type: 'Year' as const },
    { branch: chart.monthBranch, type: 'Month' as const },
    { branch: chart.dayBranch, type: 'Day' as const },
    { branch: chart.hourBranch, type: 'Hour' as const }
  ];

  pillars.forEach(p => {
    if (p.branch === prosperityBranch) {
      hits.push({
        star,
        pillar: p.type,
        triggerBranch: p.branch,
        strength: 70
      });
    }
  });

  return hits;
}

// ==================== SUMMARY FUNCTIONS ====================

function generateSummary(hits: ShenShaHit[], auspicious: number, inauspicious: number): string {
  if (hits.length === 0) {
    return 'No significant Shen Sha stars detected in this chart.';
  }

  let summary = `Found ${hits.length} Shen Sha stars: ${auspicious} auspicious, ${inauspicious} inauspicious. `;

  const notable = hits.filter(h => h.strength >= 70);
  if (notable.length > 0) {
    summary += `Notable stars: ${notable.map(h => h.star.name).join(', ')}.`;
  }

  return summary;
}

function generateSummaryZh(hits: ShenShaHit[], auspicious: number, inauspicious: number): string {
  if (hits.length === 0) {
    return '此命盘未检测到显著神煞。';
  }

  let summary = `发现${hits.length}个神煞：${auspicious}个吉神，${inauspicious}个凶神。`;

  const notable = hits.filter(h => h.strength >= 70);
  if (notable.length > 0) {
    summary += `重要神煞：${notable.map(h => h.star.nameZh).join('、')}。`;
  }

  return summary;
}

/**
 * Get a star by ID
 */
export function getShenShaStar(id: string): ShenShaStar | undefined {
  return SHEN_SHA_STARS.find(s => s.id === id);
}

/**
 * Get all stars by category
 */
export function getStarsByCategory(category: 'auspicious' | 'inauspicious' | 'neutral'): ShenShaStar[] {
  return SHEN_SHA_STARS.filter(s => s.category === category);
}

// ==================== EXPORTS ====================

export {
  detectShenSha,
  getShenShaStar,
  getStarsByCategory,
  SHEN_SHA_STARS,
  NOBLEMAN_TABLE,
  LITERARY_TABLE,
  TRAVELING_HORSE_TABLE,
  PEACH_BLOSSOM_TABLE,
  BLADE_TABLE,
  PROSPERITY_TABLE
};
