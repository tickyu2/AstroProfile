/**
 * Shen Sha Overlay (神煞)
 *
 * Models symbolic stars from BaZi - karmic signatures,
 * auspicious/inauspicious influences that shape destiny.
 *
 * Each Shen Sha carries specific meaning and affects
 * relationship timing and compatibility.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface BaZiChartForShenSha {
  dayMaster: string;
  yearBranch: string;
  monthBranch: string;
  dayBranch: string;
  hourBranch?: string;
  yearStem: string;
  monthStem: string;
  dayStem: string;
  hourStem?: string;
}

export interface ShenSha {
  name: string;
  chineseName: string;
  category: 'auspicious' | 'inauspicious' | 'neutral';
  description: string;
  relationshipMeaning: string;
  intensity: number; // 0..1
}

export interface ShenShaOverlayResult {
  stars: ShenSha[];
  auspiciousScore: number;      // 0..1
  inauspiciousScore: number;    // 0..1
  netBalance: number;           // -1..1
  shenShaDelta: number;         // contribution to decision
  dominantInfluence: 'auspicious' | 'inauspicious' | 'balanced';
  narrative: string;
  strengths: string[];
  challenges: string[];
  relationshipInsight: string;
}

// ========================================
// SHEN SHA DEFINITIONS
// ========================================

const SHEN_SHA_CATALOG: Record<string, Omit<ShenSha, 'intensity'>> = {
  // Auspicious Stars
  tianYi: {
    name: 'Heavenly Doctor',
    chineseName: '天乙贵人',
    category: 'auspicious',
    description: 'Noble helper star - brings assistance from benefactors',
    relationshipMeaning: 'Relationships blessed with helpful connections and support'
  },
  wenChang: {
    name: 'Literary Star',
    chineseName: '文昌',
    category: 'auspicious',
    description: 'Star of wisdom and scholarly achievement',
    relationshipMeaning: 'Intellectual connection and shared learning in relationships'
  },
  tianDe: {
    name: 'Heavenly Virtue',
    chineseName: '天德',
    category: 'auspicious',
    description: 'Moral virtue star - brings ethical guidance',
    relationshipMeaning: 'Relationships grounded in shared values and integrity'
  },
  yueDe: {
    name: 'Monthly Virtue',
    chineseName: '月德',
    category: 'auspicious',
    description: 'Monthly virtue - smooths obstacles',
    relationshipMeaning: 'Harmonious monthly cycles in relationship timing'
  },
  taoHua: {
    name: 'Peach Blossom',
    chineseName: '桃花',
    category: 'neutral',
    description: 'Romance and attraction star',
    relationshipMeaning: 'Strong romantic magnetism and physical attraction'
  },
  hongLuan: {
    name: 'Red Phoenix',
    chineseName: '红鸾',
    category: 'auspicious',
    description: 'Marriage and celebration star',
    relationshipMeaning: 'Favorable timing for commitment and partnership'
  },
  tianXi: {
    name: 'Heavenly Happiness',
    chineseName: '天喜',
    category: 'auspicious',
    description: 'Joy and celebration star',
    relationshipMeaning: 'Relationships filled with joy and celebration'
  },

  // Inauspicious Stars
  guaChen: {
    name: 'Lonely Star',
    chineseName: '孤辰',
    category: 'inauspicious',
    description: 'Solitude star - indicates periods of isolation',
    relationshipMeaning: 'May need to navigate periods of emotional distance'
  },
  guaSu: {
    name: 'Widow Star',
    chineseName: '寡宿',
    category: 'inauspicious',
    description: 'Solitary star - challenges in partnership',
    relationshipMeaning: 'Karmic lessons around independence vs. partnership'
  },
  yangRen: {
    name: 'Blade of Yang',
    chineseName: '羊刃',
    category: 'inauspicious',
    description: 'Sharp energy star - potential for conflict',
    relationshipMeaning: 'Strong will that may create friction in relationships'
  },
  feiRen: {
    name: 'Flying Blade',
    chineseName: '飞刃',
    category: 'inauspicious',
    description: 'Unexpected cutting energy',
    relationshipMeaning: 'Sudden disruptions possible in relationship flow'
  },
  tianGou: {
    name: 'Heavenly Dog',
    chineseName: '天狗',
    category: 'inauspicious',
    description: 'Eclipse energy - obscures clarity',
    relationshipMeaning: 'Periods where relationship clarity may be dimmed'
  },
  diaoKe: {
    name: 'Funeral Guest',
    chineseName: '吊客',
    category: 'inauspicious',
    description: 'Grief and ending energy',
    relationshipMeaning: 'May process past relationship grief or endings'
  },
  sangMen: {
    name: 'Mourning Gate',
    chineseName: '丧门',
    category: 'inauspicious',
    description: 'Loss and transition energy',
    relationshipMeaning: 'Transformative but potentially difficult transitions'
  },

  // Neutral Stars
  jiangXing: {
    name: 'General Star',
    chineseName: '将星',
    category: 'neutral',
    description: 'Leadership and command energy',
    relationshipMeaning: 'Natural leadership in relationship dynamics'
  },
  huaGai: {
    name: 'Canopy Star',
    chineseName: '华盖',
    category: 'neutral',
    description: 'Spiritual covering - introspection',
    relationshipMeaning: 'Spiritual depth in relationships, may prefer solitude at times'
  },
  yiMa: {
    name: 'Traveling Horse',
    chineseName: '驿马',
    category: 'neutral',
    description: 'Movement and travel energy',
    relationshipMeaning: 'Relationships involving travel or distance dynamics'
  },
  tianLuo: {
    name: 'Heavenly Net',
    chineseName: '天罗',
    category: 'inauspicious',
    description: 'Heavenly entrapment',
    relationshipMeaning: 'May feel trapped in relationship patterns'
  },
  diWang: {
    name: 'Earthly Net',
    chineseName: '地网',
    category: 'inauspicious',
    description: 'Earthly entrapment',
    relationshipMeaning: 'Practical constraints on relationship freedom'
  }
};

// ========================================
// DETECTION LOGIC
// ========================================

/**
 * Detect Shen Sha stars from BaZi chart
 */
export function detectShenSha(chart: BaZiChartForShenSha): ShenSha[] {
  const stars: ShenSha[] = [];
  const branches = [chart.yearBranch, chart.monthBranch, chart.dayBranch];
  if (chart.hourBranch) branches.push(chart.hourBranch);

  // Tian Yi (Heavenly Doctor) detection
  const tianYiMap: Record<string, string[]> = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳'],
    '辛': ['午', '寅']
  };

  const tianYiBranches = tianYiMap[chart.dayStem] || [];
  if (branches.some(b => tianYiBranches.includes(b))) {
    stars.push({ ...SHEN_SHA_CATALOG.tianYi, intensity: 0.8 });
  }

  // Tao Hua (Peach Blossom) detection
  const taoHuaMap: Record<string, string> = {
    '寅': '卯', '午': '卯', '戌': '卯',
    '申': '酉', '子': '酉', '辰': '酉',
    '亥': '子', '卯': '子', '未': '子',
    '巳': '午', '酉': '午', '丑': '午'
  };

  const taoHuaBranch = taoHuaMap[chart.yearBranch] || taoHuaMap[chart.dayBranch];
  if (taoHuaBranch && branches.includes(taoHuaBranch)) {
    stars.push({ ...SHEN_SHA_CATALOG.taoHua, intensity: 0.7 });
  }

  // Yi Ma (Traveling Horse) detection
  const yiMaMap: Record<string, string> = {
    '寅': '申', '午': '申', '戌': '申',
    '申': '寅', '子': '寅', '辰': '寅',
    '亥': '巳', '卯': '巳', '未': '巳',
    '巳': '亥', '酉': '亥', '丑': '亥'
  };

  const yiMaBranch = yiMaMap[chart.yearBranch];
  if (yiMaBranch && branches.includes(yiMaBranch)) {
    stars.push({ ...SHEN_SHA_CATALOG.yiMa, intensity: 0.6 });
  }

  // Hua Gai (Canopy Star) detection
  const huaGaiMap: Record<string, string> = {
    '寅': '戌', '午': '戌', '戌': '戌',
    '申': '辰', '子': '辰', '辰': '辰',
    '亥': '未', '卯': '未', '未': '未',
    '巳': '丑', '酉': '丑', '丑': '丑'
  };

  const huaGaiBranch = huaGaiMap[chart.yearBranch];
  if (huaGaiBranch && branches.includes(huaGaiBranch)) {
    stars.push({ ...SHEN_SHA_CATALOG.huaGai, intensity: 0.6 });
  }

  // Gu Chen / Gua Su (Lonely/Widow Stars) detection
  const guChenMap: Record<string, string> = {
    '寅': '巳', '卯': '巳', '辰': '巳',
    '巳': '申', '午': '申', '未': '申',
    '申': '亥', '酉': '亥', '戌': '亥',
    '亥': '寅', '子': '寅', '丑': '寅'
  };

  const guChenBranch = guChenMap[chart.yearBranch];
  if (guChenBranch && branches.includes(guChenBranch)) {
    stars.push({ ...SHEN_SHA_CATALOG.guaChen, intensity: 0.5 });
  }

  // Yang Ren (Blade) detection - based on Day Master
  const yangRenMap: Record<string, string> = {
    '甲': '卯', '丙': '午', '戊': '午',
    '庚': '酉', '壬': '子'
  };

  const yangRenBranch = yangRenMap[chart.dayStem];
  if (yangRenBranch && branches.includes(yangRenBranch)) {
    stars.push({ ...SHEN_SHA_CATALOG.yangRen, intensity: 0.7 });
  }

  // Hong Luan / Tian Xi (Marriage Stars)
  const hongLuanMap: Record<string, string> = {
    '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
    '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
    '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
  };

  const hongLuanBranch = hongLuanMap[chart.yearBranch];
  if (hongLuanBranch && branches.includes(hongLuanBranch)) {
    stars.push({ ...SHEN_SHA_CATALOG.hongLuan, intensity: 0.8 });
  }

  // Jiang Xing (General Star)
  const jiangXingMap: Record<string, string> = {
    '寅': '午', '午': '午', '戌': '午',
    '申': '子', '子': '子', '辰': '子',
    '亥': '卯', '卯': '卯', '未': '卯',
    '巳': '酉', '酉': '酉', '丑': '酉'
  };

  const jiangXingBranch = jiangXingMap[chart.yearBranch];
  if (jiangXingBranch && branches.includes(jiangXingBranch)) {
    stars.push({ ...SHEN_SHA_CATALOG.jiangXing, intensity: 0.6 });
  }

  return stars;
}

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute Shen Sha Overlay from BaZi chart
 */
export function computeShenShaOverlay(chart: BaZiChartForShenSha): ShenShaOverlayResult {
  const stars = detectShenSha(chart);

  // Calculate scores
  const auspiciousStars = stars.filter(s => s.category === 'auspicious');
  const inauspiciousStars = stars.filter(s => s.category === 'inauspicious');
  const neutralStars = stars.filter(s => s.category === 'neutral');

  const auspiciousWeight = auspiciousStars.reduce((sum, s) => sum + s.intensity, 0);
  const inauspiciousWeight = inauspiciousStars.reduce((sum, s) => sum + s.intensity, 0);
  const totalWeight = auspiciousWeight + inauspiciousWeight +
    neutralStars.reduce((sum, s) => sum + s.intensity * 0.5, 0);

  const auspiciousScore = totalWeight > 0 ? auspiciousWeight / totalWeight : 0.5;
  const inauspiciousScore = totalWeight > 0 ? inauspiciousWeight / totalWeight : 0.5;
  const netBalance = auspiciousScore - inauspiciousScore;

  // Determine dominant influence
  let dominantInfluence: 'auspicious' | 'inauspicious' | 'balanced';
  if (netBalance > 0.2) dominantInfluence = 'auspicious';
  else if (netBalance < -0.2) dominantInfluence = 'inauspicious';
  else dominantInfluence = 'balanced';

  // Calculate delta
  const shenShaDelta = netBalance * 0.06;

  // Build narrative
  const narrative = buildShenShaNarrative(stars, auspiciousScore, inauspiciousScore, dominantInfluence);

  // Extract strengths and challenges
  const { strengths, challenges, relationshipInsight } = getShenShaTraits(stars, dominantInfluence);

  return {
    stars,
    auspiciousScore,
    inauspiciousScore,
    netBalance,
    shenShaDelta,
    dominantInfluence,
    narrative,
    strengths,
    challenges,
    relationshipInsight
  };
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildShenShaNarrative(
  stars: ShenSha[],
  auspicious: number,
  inauspicious: number,
  dominant: 'auspicious' | 'inauspicious' | 'balanced'
): string {
  const starNames = stars.slice(0, 3).map(s => s.name).join(', ');

  const baseNarratives: Record<typeof dominant, string> = {
    auspicious: `Your symbolic stars lean auspicious, indicating supportive karmic winds and smoother relational flow. The presence of ${starNames} brings beneficial energy to your connections.`,
    inauspicious: `Your symbolic stars carry tension, suggesting karmic friction or lessons emerging in relationship timing. The influence of ${starNames} asks for conscious navigation.`,
    balanced: `Your symbolic stars are balanced, neither pushing nor resisting the relational field. ${starNames} create a neutral ground for your choices to shape outcomes.`
  };

  let narrative = baseNarratives[dominant];

  // Add specific star insights
  const peachBlossom = stars.find(s => s.name === 'Peach Blossom');
  if (peachBlossom) {
    narrative += ' The Peach Blossom enhances your romantic magnetism, drawing attraction naturally.';
  }

  const hongLuan = stars.find(s => s.name === 'Red Phoenix');
  if (hongLuan) {
    narrative += ' The Red Phoenix signals favorable timing for commitment and partnership celebrations.';
  }

  const lonely = stars.find(s => s.name === 'Lonely Star' || s.name === 'Widow Star');
  if (lonely) {
    narrative += ' The presence of solitary stars suggests periods where independence must be honored.';
  }

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getShenShaTraits(
  stars: ShenSha[],
  dominant: 'auspicious' | 'inauspicious' | 'balanced'
): { strengths: string[]; challenges: string[]; relationshipInsight: string } {
  const strengths: string[] = [];
  const challenges: string[] = [];

  // Extract from individual stars
  for (const star of stars) {
    if (star.category === 'auspicious') {
      strengths.push(star.relationshipMeaning);
    } else if (star.category === 'inauspicious') {
      challenges.push(star.relationshipMeaning);
    }
  }

  // Limit and add defaults
  if (strengths.length === 0) strengths.push('Neutral karmic field allows free choice');
  if (challenges.length === 0) challenges.push('No major karmic obstacles detected');

  // Build relationship insight
  let relationshipInsight: string;
  if (dominant === 'auspicious') {
    relationshipInsight = 'Your karmic signature supports relationship growth and connection. Timing windows tend to open favorably.';
  } else if (dominant === 'inauspicious') {
    relationshipInsight = 'Your karmic signature carries lessons around relationships. Conscious timing and patience yield better outcomes.';
  } else {
    relationshipInsight = 'Your karmic field is neutral, giving you maximum agency in how relationships unfold.';
  }

  return {
    strengths: strengths.slice(0, 4),
    challenges: challenges.slice(0, 4),
    relationshipInsight
  };
}

// ========================================
// COMPATIBILITY
// ========================================

/**
 * Calculate Shen Sha compatibility between two charts
 */
export function calculateShenShaCompatibility(
  chart1: ShenShaOverlayResult,
  chart2: ShenShaOverlayResult
): {
  score: number;
  analysis: string;
  dynamics: string[];
} {
  const dynamics: string[] = [];

  // Base score from combined balance
  let score = 0.5 + (chart1.netBalance + chart2.netBalance) / 4;

  // Check for complementary stars
  const chart1Names = new Set(chart1.stars.map(s => s.name));
  const chart2Names = new Set(chart2.stars.map(s => s.name));

  // Red Phoenix + Red Phoenix = strong marriage energy
  if (chart1Names.has('Red Phoenix') && chart2Names.has('Red Phoenix')) {
    score += 0.15;
    dynamics.push('Double Red Phoenix energy - strong marriage potential');
  }

  // Peach Blossom in both - high attraction
  if (chart1Names.has('Peach Blossom') && chart2Names.has('Peach Blossom')) {
    score += 0.1;
    dynamics.push('Mutual Peach Blossom - strong romantic attraction');
  }

  // Lonely stars may create distance
  if ((chart1Names.has('Lonely Star') || chart1Names.has('Widow Star')) &&
      (chart2Names.has('Lonely Star') || chart2Names.has('Widow Star'))) {
    score -= 0.1;
    dynamics.push('Both carry solitary energy - need conscious connection effort');
  }

  // Heavenly Doctor brings help
  if (chart1Names.has('Heavenly Doctor') || chart2Names.has('Heavenly Doctor')) {
    score += 0.05;
    dynamics.push('Noble helper energy supports the relationship');
  }

  // Blade energy may cause friction
  if (chart1Names.has('Blade of Yang') || chart2Names.has('Blade of Yang')) {
    score -= 0.05;
    dynamics.push('Sharp energy present - may need to manage conflicts');
  }

  score = Math.max(0, Math.min(1, score));

  const analysis = score >= 0.65
    ? 'Your karmic signatures align well, supporting relationship harmony.'
    : score >= 0.45
    ? 'Mixed karmic signatures - some support, some lessons to navigate.'
    : 'Karmic signatures suggest significant lessons in this connection.';

  return { score, analysis, dynamics };
}

// ========================================
// PERSONA VOICES
// ========================================

export const ShenShaPersonaVoices = {
  auspicious: {
    mentor: 'The stars favor your connections. Move forward with confidence, but remember that even auspicious energy requires wise action.',
    oracle: 'The celestial seal blesses your path. The noble stars have aligned—what you seed now finds fertile ground.',
    companion: 'Your star map looks really supportive! This is a good time to nurture your relationships.',
    mirror: 'Notice how doors seem to open for your connections. That karmic support is real—use it consciously.'
  },
  inauspicious: {
    mentor: 'The stars bring lessons, not punishment. Navigate carefully, and these challenges become wisdom.',
    oracle: 'The shadow stars speak of transformation. What feels like obstacle is actually initiation.',
    companion: 'There are some bumps in your star map, but that just means being more intentional. You\'ve got this.',
    mirror: 'Notice where friction arises in connections. Those patterns carry messages—listen before reacting.'
  },
  balanced: {
    mentor: 'Your stars are neutral, placing agency squarely in your hands. What you choose matters most now.',
    oracle: 'The celestial field stands open, neither pushing nor pulling. You are the author of this chapter.',
    companion: 'Your star map is pretty balanced—you have real freedom here to shape things how you want!',
    mirror: 'Notice the open space in your karmic field. That neutrality is freedom—what will you create?'
  }
};

/**
 * Get Shen Sha persona voice
 */
export function getShenShaPersonaVoice(
  result: ShenShaOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return ShenShaPersonaVoices[result.dominantInfluence][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface ShenShaChamber {
  id: string;
  name: string;
  description: string;
  influence: 'auspicious' | 'inauspicious' | 'balanced';
}

export const ShenShaChambers: Record<'auspicious' | 'inauspicious' | 'balanced', ShenShaChamber> = {
  auspicious: {
    id: 'hall-of-noble-stars',
    name: 'The Hall of Noble Stars',
    description: 'You enter the Hall of Noble Stars, where celestial benefactors shine their light upon your path. The Heavenly Doctor, Red Phoenix, and Literary Star illuminate your journey with blessing.',
    influence: 'auspicious'
  },
  inauspicious: {
    id: 'chamber-of-shadow-lessons',
    name: 'The Chamber of Shadow Lessons',
    description: 'You descend into the Chamber of Shadow Lessons, where challenging stars reveal their teaching. Here, the Lonely Star and Blade of Yang transform from obstacle to initiation.',
    influence: 'inauspicious'
  },
  balanced: {
    id: 'crossroads-of-neutral-stars',
    name: 'The Crossroads of Neutral Stars',
    description: 'You stand at the Crossroads of Neutral Stars, where neither blessing nor challenge dominates. The path ahead is truly yours to choose—the stars watch but do not compel.',
    influence: 'balanced'
  }
};

/**
 * Get Shen Sha chamber narrative
 */
export function getShenShaChamberNarrative(result: ShenShaOverlayResult): string {
  const chamber = ShenShaChambers[result.dominantInfluence];
  return chamber.description;
}
