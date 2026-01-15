/**
 * ============================================================================
 * SHEN SHA DETECTION RULES (神煞探测规则)
 * ============================================================================
 *
 * Classical formulas for detecting each Shen Sha star.
 *
 * Most rules are based on:
 * - Day Stem → which Branches activate the star
 * - Year Branch → which Branches activate the star
 * - Month Branch → which Branches activate the star
 * - Special combinations of Stems and Branches
 *
 * Joey Yap's approach: Use the classical formulas but interpret
 * them in a modern, non-superstitious way.
 *
 * Created: January 2026
 * Based on: Classical BaZi Shen Sha detection formulas
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type RuleType =
  | 'day_stem_to_branch'     // Day Stem determines which Branch activates
  | 'year_branch_to_branch'  // Year Branch determines which Branch activates
  | 'month_branch_to_branch' // Month Branch determines which Branch activates
  | 'branch_group'           // Star activates when certain Branch appears
  | 'stem_branch_combo'      // Specific Stem + Branch combination
  | 'special';               // Custom detection logic

export interface ShenShaRule {
  starKey: string;
  ruleType: RuleType;
  description: string;
}

// ============================================================================
// BRANCH GROUPS (三合/三会)
// ============================================================================

/**
 * The Four Frame Branches (四正位) - Cardinal directions
 * These are often used as base for Peach Blossom and other calculations
 */
export const FRAME_BRANCHES = ['子', '午', '卯', '酉'];

/**
 * The Four Corner Branches (四库位) - Corner/Storage directions
 */
export const CORNER_BRANCHES = ['辰', '戌', '丑', '未'];

/**
 * San He (三合) - Three Harmony Groups
 * Each group shares elemental affinity
 */
export const SAN_HE_GROUPS = {
  water: ['申', '子', '辰'],  // Water Frame: 子
  wood: ['亥', '卯', '未'],   // Wood Frame: 卯
  fire: ['寅', '午', '戌'],   // Fire Frame: 午
  metal: ['巳', '酉', '丑']   // Metal Frame: 酉
};

/**
 * Get the Frame Branch for a San He group
 */
export function getSanHeFrame(branch: string): string | null {
  for (const [element, group] of Object.entries(SAN_HE_GROUPS)) {
    if (group.includes(branch)) {
      return group[1]; // The middle branch is the frame
    }
  }
  return null;
}

// ============================================================================
// PEACH BLOSSOM (桃花) RULES
// ============================================================================

/**
 * Peach Blossom is detected based on Year/Day Branch
 *
 * Formula: Based on the San He frame branch
 * - 申子辰 (Water frame 子) → Peach Blossom at 酉
 * - 寅午戌 (Fire frame 午) → Peach Blossom at 卯
 * - 巳酉丑 (Metal frame 酉) → Peach Blossom at 午
 * - 亥卯未 (Wood frame 卯) → Peach Blossom at 子
 *
 * The Peach Blossom is always at the OPPOSITE frame position
 */
export const PEACH_BLOSSOM_RULES: Record<string, string> = {
  // San He Water group → Peach Blossom at 酉
  '申': '酉',
  '子': '酉',
  '辰': '酉',
  // San He Fire group → Peach Blossom at 卯
  '寅': '卯',
  '午': '卯',
  '戌': '卯',
  // San He Metal group → Peach Blossom at 午
  '巳': '午',
  '酉': '午',
  '丑': '午',
  // San He Wood group → Peach Blossom at 子
  '亥': '子',
  '卯': '子',
  '未': '子'
};

// ============================================================================
// HEAVENLY NOBLEMAN (天乙贵人) RULES
// ============================================================================

/**
 * Heavenly Nobleman is the most important nobleman star
 *
 * Formula: Based on Day Stem
 * 甲戊庚 → 牛羊 (丑未)
 * 乙己 → 鼠猴 (子申)
 * 丙丁 → 猪鸡 (亥酉)
 * 壬癸 → 蛇兔 (巳卯)
 * 辛 → 龙狗 (辰戌) or 马虎 (午寅)
 */
export const NOBLEMAN_RULES: Record<string, string[]> = {
  '甲': ['丑', '未'],
  '戊': ['丑', '未'],
  '庚': ['丑', '未'],
  '乙': ['子', '申'],
  '己': ['子', '申'],
  '丙': ['亥', '酉'],
  '丁': ['亥', '酉'],
  '壬': ['卯', '巳'],
  '癸': ['卯', '巳'],
  '辛': ['午', '寅']  // Some texts use 辰戌
};

// ============================================================================
// TAI JI NOBLEMAN (太极贵人) RULES
// ============================================================================

/**
 * Tai Ji Nobleman - Spiritual/Wisdom nobleman
 *
 * Formula: Based on Day Stem
 */
export const TAI_JI_NOBLEMAN_RULES: Record<string, string[]> = {
  '甲': ['子', '午'],
  '乙': ['子', '午'],
  '丙': ['卯', '酉'],
  '丁': ['卯', '酉'],
  '戊': ['辰', '戌', '丑', '未'],
  '己': ['辰', '戌', '丑', '未'],
  '庚': ['寅', '亥'],
  '辛': ['寅', '亥'],
  '壬': ['巳', '申'],
  '癸': ['巳', '申']
};

// ============================================================================
// ACADEMIC STAR (文昌) RULES
// ============================================================================

/**
 * Academic Star - Learning and writing ability
 *
 * Formula: Based on Day Stem, count forward from Day Stem's position
 */
export const ACADEMIC_STAR_RULES: Record<string, string> = {
  '甲': '巳',
  '乙': '午',
  '丙': '申',
  '丁': '酉',
  '戊': '申',
  '己': '酉',
  '庚': '亥',
  '辛': '子',
  '壬': '寅',
  '癸': '卯'
};

// ============================================================================
// LITERARY STAR (文曲) RULES
// ============================================================================

/**
 * Literary Star - Artistic and creative ability
 *
 * Formula: Based on Day Stem
 */
export const LITERARY_STAR_RULES: Record<string, string> = {
  '甲': '亥',
  '乙': '子',
  '丙': '寅',
  '丁': '卯',
  '戊': '寅',
  '己': '卯',
  '庚': '巳',
  '辛': '午',
  '壬': '申',
  '癸': '酉'
};

// ============================================================================
// TRAVELING HORSE (驿马) RULES
// ============================================================================

/**
 * Traveling Horse - Movement and change
 *
 * Formula: Based on Year/Day Branch (San He logic, opposite corner)
 * 申子辰 → 寅 (Tiger)
 * 寅午戌 → 申 (Monkey)
 * 巳酉丑 → 亥 (Pig)
 * 亥卯未 → 巳 (Snake)
 */
export const TRAVELING_HORSE_RULES: Record<string, string> = {
  // San He Water group → Horse at 寅
  '申': '寅',
  '子': '寅',
  '辰': '寅',
  // San He Fire group → Horse at 申
  '寅': '申',
  '午': '申',
  '戌': '申',
  // San He Metal group → Horse at 亥
  '巳': '亥',
  '酉': '亥',
  '丑': '亥',
  // San He Wood group → Horse at 巳
  '亥': '巳',
  '卯': '巳',
  '未': '巳'
};

// ============================================================================
// GENERAL STAR (将星) RULES
// ============================================================================

/**
 * General Star - Leadership and command
 *
 * Formula: Based on Year/Day Branch (San He logic, same frame)
 * 申子辰 → 子
 * 寅午戌 → 午
 * 巳酉丑 → 酉
 * 亥卯未 → 卯
 */
export const GENERAL_STAR_RULES: Record<string, string> = {
  // San He Water group → General at 子
  '申': '子',
  '子': '子',
  '辰': '子',
  // San He Fire group → General at 午
  '寅': '午',
  '午': '午',
  '戌': '午',
  // San He Metal group → General at 酉
  '巳': '酉',
  '酉': '酉',
  '丑': '酉',
  // San He Wood group → General at 卯
  '亥': '卯',
  '卯': '卯',
  '未': '卯'
};

// ============================================================================
// ARTISTIC STAR / CANOPY (华盖) RULES
// ============================================================================

/**
 * Artistic Star - Creativity and solitude
 *
 * Formula: Based on Year/Day Branch (San He logic, storage/corner)
 * 申子辰 → 辰
 * 寅午戌 → 戌
 * 巳酉丑 → 丑
 * 亥卯未 → 未
 */
export const ARTISTIC_STAR_RULES: Record<string, string> = {
  // San He Water group → Canopy at 辰
  '申': '辰',
  '子': '辰',
  '辰': '辰',
  // San He Fire group → Canopy at 戌
  '寅': '戌',
  '午': '戌',
  '戌': '戌',
  // San He Metal group → Canopy at 丑
  '巳': '丑',
  '酉': '丑',
  '丑': '丑',
  // San He Wood group → Canopy at 未
  '亥': '未',
  '卯': '未',
  '未': '未'
};

// ============================================================================
// PROSPERITY STAR (禄神) RULES
// ============================================================================

/**
 * Prosperity Star - Income and resources
 *
 * Formula: Based on Day Stem (Lu is the branch of the stem's hidden stem)
 */
export const PROSPERITY_STAR_RULES: Record<string, string> = {
  '甲': '寅',
  '乙': '卯',
  '丙': '巳',
  '丁': '午',
  '戊': '巳',
  '己': '午',
  '庚': '申',
  '辛': '酉',
  '壬': '亥',
  '癸': '子'
};

// ============================================================================
// HEAVENLY DOCTOR (天医) RULES
// ============================================================================

/**
 * Heavenly Doctor - Healing ability
 *
 * Formula: Based on Month Branch, count back one position
 */
export const HEAVENLY_DOCTOR_RULES: Record<string, string> = {
  '子': '亥',
  '丑': '子',
  '寅': '丑',
  '卯': '寅',
  '辰': '卯',
  '巳': '辰',
  '午': '巳',
  '未': '午',
  '申': '未',
  '酉': '申',
  '戌': '酉',
  '亥': '戌'
};

// ============================================================================
// RED MATCHMAKER (红鸾) RULES
// ============================================================================

/**
 * Red Matchmaker - Marriage and romance activation
 *
 * Formula: Based on Year Branch
 * 子→卯, 丑→寅, 寅→丑, 卯→子, 辰→亥, 巳→戌,
 * 午→酉, 未→申, 申→未, 酉→午, 戌→巳, 亥→辰
 */
export const RED_MATCHMAKER_RULES: Record<string, string> = {
  '子': '卯',
  '丑': '寅',
  '寅': '丑',
  '卯': '子',
  '辰': '亥',
  '巳': '戌',
  '午': '酉',
  '未': '申',
  '申': '未',
  '酉': '午',
  '戌': '巳',
  '亥': '辰'
};

// ============================================================================
// SKY HAPPINESS (天喜) RULES
// ============================================================================

/**
 * Sky Happiness - Joy and celebration
 *
 * Formula: Based on Year Branch (opposite of Red Matchmaker)
 */
export const SKY_HAPPINESS_RULES: Record<string, string> = {
  '子': '酉',
  '丑': '申',
  '寅': '未',
  '卯': '午',
  '辰': '巳',
  '巳': '辰',
  '午': '卯',
  '未': '寅',
  '申': '丑',
  '酉': '子',
  '戌': '亥',
  '亥': '戌'
};

// ============================================================================
// HEAVENLY VIRTUE (天德) RULES
// ============================================================================

/**
 * Heavenly Virtue - Protection and virtue
 *
 * Formula: Based on Month Branch
 */
export const HEAVENLY_VIRTUE_RULES: Record<string, string> = {
  '寅': '丁',
  '卯': '申',
  '辰': '壬',
  '巳': '辛',
  '午': '亥',
  '未': '甲',
  '申': '癸',
  '酉': '寅',
  '戌': '丙',
  '亥': '乙',
  '子': '巳',
  '丑': '庚'
};

// ============================================================================
// MOON VIRTUE (月德) RULES
// ============================================================================

/**
 * Moon Virtue - Gentle protection
 *
 * Formula: Based on Month Branch
 */
export const MOON_VIRTUE_RULES: Record<string, string> = {
  '寅': '丙',
  '午': '丙',
  '戌': '丙',
  '申': '壬',
  '子': '壬',
  '辰': '壬',
  '亥': '甲',
  '卯': '甲',
  '未': '甲',
  '巳': '庚',
  '酉': '庚',
  '丑': '庚'
};

// ============================================================================
// ROBBERY SHA (劫煞) RULES
// ============================================================================

/**
 * Robbery Sha - Potential loss through external forces
 *
 * Formula: Based on Year/Day Branch
 */
export const ROBBERY_SHA_RULES: Record<string, string> = {
  // San He Water group
  '申': '巳',
  '子': '巳',
  '辰': '巳',
  // San He Fire group
  '寅': '亥',
  '午': '亥',
  '戌': '亥',
  // San He Metal group
  '巳': '寅',
  '酉': '寅',
  '丑': '寅',
  // San He Wood group
  '亥': '申',
  '卯': '申',
  '未': '申'
};

// ============================================================================
// CALAMITY SHA (灾煞) RULES
// ============================================================================

/**
 * Calamity Sha - Potential accidents or sudden difficulties
 *
 * Formula: Based on Year/Day Branch
 */
export const CALAMITY_SHA_RULES: Record<string, string> = {
  // San He Water group
  '申': '午',
  '子': '午',
  '辰': '午',
  // San He Fire group
  '寅': '子',
  '午': '子',
  '戌': '子',
  // San He Metal group
  '巳': '卯',
  '酉': '卯',
  '丑': '卯',
  // San He Wood group
  '亥': '酉',
  '卯': '酉',
  '未': '酉'
};

// ============================================================================
// SOLITARY STAR (孤辰) RULES
// ============================================================================

/**
 * Solitary Star - Independence, delayed marriage
 *
 * Formula: Based on Year Branch
 */
export const SOLITARY_STAR_RULES: Record<string, string> = {
  '亥': '寅',
  '子': '寅',
  '丑': '寅',
  '寅': '巳',
  '卯': '巳',
  '辰': '巳',
  '巳': '申',
  '午': '申',
  '未': '申',
  '申': '亥',
  '酉': '亥',
  '戌': '亥'
};

// ============================================================================
// WIDOW STAR (寡宿) RULES
// ============================================================================

/**
 * Widow Star - Emotional distance
 *
 * Formula: Based on Year Branch
 */
export const WIDOW_STAR_RULES: Record<string, string> = {
  '亥': '戌',
  '子': '戌',
  '丑': '戌',
  '寅': '丑',
  '卯': '丑',
  '辰': '丑',
  '巳': '辰',
  '午': '辰',
  '未': '辰',
  '申': '未',
  '酉': '未',
  '戌': '未'
};

// ============================================================================
// SALTY POOL (咸池) RULES
// ============================================================================

/**
 * Salty Pool - Sensuality and physical attraction
 * Same formula as Peach Blossom but interpreted differently
 */
export const SALTY_POOL_RULES = PEACH_BLOSSOM_RULES;

// ============================================================================
// RULE METADATA
// ============================================================================

export interface RuleMetadata {
  starKey: string;
  ruleType: RuleType;
  basedOn: 'day_stem' | 'year_branch' | 'month_branch' | 'day_branch' | 'special';
  description: string;
  formula: string;
}

export const RULE_METADATA: Record<string, RuleMetadata> = {
  peach_blossom: {
    starKey: 'peach_blossom',
    ruleType: 'year_branch_to_branch',
    basedOn: 'year_branch',
    description: 'Detected when chart contains the Peach Blossom branch for the Year/Day Branch',
    formula: 'San He Frame → Opposite Frame'
  },
  heavenly_nobleman: {
    starKey: 'heavenly_nobleman',
    ruleType: 'day_stem_to_branch',
    basedOn: 'day_stem',
    description: 'Detected when chart contains the Nobleman branch for the Day Stem',
    formula: '甲戊庚→丑未, 乙己→子申, 丙丁→亥酉, 壬癸→卯巳, 辛→午寅'
  },
  academic_star: {
    starKey: 'academic_star',
    ruleType: 'day_stem_to_branch',
    basedOn: 'day_stem',
    description: 'Detected when chart contains the Academic branch for the Day Stem',
    formula: 'Day Stem counting formula'
  },
  traveling_horse: {
    starKey: 'traveling_horse',
    ruleType: 'year_branch_to_branch',
    basedOn: 'year_branch',
    description: 'Detected when chart contains the Traveling Horse branch for Year/Day Branch',
    formula: 'San He Group → Opposite Corner'
  },
  prosperity_star: {
    starKey: 'prosperity_star',
    ruleType: 'day_stem_to_branch',
    basedOn: 'day_stem',
    description: 'Detected when chart contains the Lu branch for the Day Stem',
    formula: 'Stem → Its home branch'
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Branch Groups
  FRAME_BRANCHES,
  CORNER_BRANCHES,
  SAN_HE_GROUPS,
  getSanHeFrame,

  // Detection Rules
  PEACH_BLOSSOM_RULES,
  NOBLEMAN_RULES,
  TAI_JI_NOBLEMAN_RULES,
  ACADEMIC_STAR_RULES,
  LITERARY_STAR_RULES,
  TRAVELING_HORSE_RULES,
  GENERAL_STAR_RULES,
  ARTISTIC_STAR_RULES,
  PROSPERITY_STAR_RULES,
  HEAVENLY_DOCTOR_RULES,
  RED_MATCHMAKER_RULES,
  SKY_HAPPINESS_RULES,
  HEAVENLY_VIRTUE_RULES,
  MOON_VIRTUE_RULES,
  ROBBERY_SHA_RULES,
  CALAMITY_SHA_RULES,
  SOLITARY_STAR_RULES,
  WIDOW_STAR_RULES,
  SALTY_POOL_RULES,

  // Metadata
  RULE_METADATA
};
