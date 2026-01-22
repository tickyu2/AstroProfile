/**
 * =============================================================================
 * BAZI SYNASTRY HEATMAP ENGINE (合盘热力图)
 * =============================================================================
 *
 * A visual map of relational chemistry between two people, showing:
 *   - Where harmony lives
 *   - Where tension arises
 *   - Where attraction ignites
 *   - Where long-term stability resides
 *   - Where communication flows or breaks
 *
 * GRID STRUCTURE:
 *   5×5 matrix comparing Person A's pillars against Person B's pillars
 *   - Year Pillar
 *   - Month Pillar
 *   - Day Pillar
 *   - Hour Pillar
 *   - Day Master (DM)
 *
 * INTERACTION TYPES:
 *   Harmonies:  六合 (+20), 三合 (+25), 三会 (+25), 天干合 (+15), 生 (+10)
 *   Neutral:    Same element (+5), Same polarity (+3)
 *   Tensions:   破 (-22), 冲 (-20), 刑 (-18), 害 (-15), 克 (-10)
 *   Romance:    红鸾 (+20), 桃花 (+18), 天喜 (+15)
 *
 * Author: Brother Opus & Ticky
 * Version: 1.0.0
 * =============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type StemName = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type BranchName = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export type PillarLabel = 'Year' | 'Month' | 'Day' | 'Hour' | 'DM';
export type InteractionNature = 'harmony' | 'neutral' | 'tension' | 'romance';

export interface NatalPillarsInput {
  yearStem: StemName;
  yearBranch: BranchName;
  monthStem: StemName;
  monthBranch: BranchName;
  dayStem: StemName;
  dayBranch: BranchName;
  hourStem: StemName;
  hourBranch: BranchName;
}

export interface PillarInfo {
  label: PillarLabel;
  labelChinese: string;
  stem: StemName;
  branch: BranchName | null;
}

export interface InteractionHit {
  type: string;
  chinese: string;
  nature: InteractionNature;
  score: number;
  explanation: string;
}

export interface SynastryCell {
  aPillar: PillarLabel;
  aPillarChinese: string;
  bPillar: PillarLabel;
  bPillarChinese: string;
  interactions: InteractionHit[];
  totalScore: number;
  normalizedScore: number; // -100 to +100
  color: string;
  colorIntensity: number; // 0-1
  nature: InteractionNature;
  summary: string;
}

export interface SynastryHeatmap {
  personA: string;
  personB: string;
  grid: SynastryCell[][];
  rowLabels: string[];
  columnLabels: string[];
  overallScore: number;
  overallNature: InteractionNature;
  strongestHarmony: SynastryCell | null;
  strongestTension: SynastryCell | null;
  romanceHotspots: SynastryCell[];
  summary: string;
  nivoData: NivoHeatmapData[];
  echartsData: EChartsHeatmapData;
}

export interface NivoHeatmapData {
  id: string;
  data: Array<{ x: string; y: number }>;
}

export interface EChartsHeatmapData {
  xAxis: string[];
  yAxis: string[];
  data: Array<[number, number, number]>;
  visualMap: { min: number; max: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// ELEMENT MAPPINGS
// ─────────────────────────────────────────────────────────────────────────────

export const STEM_ELEMENT: Record<string, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

export const BRANCH_ELEMENT: Record<string, ElementName> = {
  '寅': 'Wood', '卯': 'Wood',
  '巳': 'Fire', '午': 'Fire',
  '辰': 'Earth', '丑': 'Earth', '未': 'Earth', '戌': 'Earth',
  '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water'
};

export const STEM_POLARITY: Record<string, 'Yang' | 'Yin'> = {
  '甲': 'Yang', '乙': 'Yin', '丙': 'Yang', '丁': 'Yin', '戊': 'Yang',
  '己': 'Yin', '庚': 'Yang', '辛': 'Yin', '壬': 'Yang', '癸': 'Yin'
};

export const BRANCH_POLARITY: Record<string, 'Yang' | 'Yin'> = {
  '子': 'Yang', '丑': 'Yin', '寅': 'Yang', '卯': 'Yin',
  '辰': 'Yang', '巳': 'Yin', '午': 'Yang', '未': 'Yin',
  '申': 'Yang', '酉': 'Yin', '戌': 'Yang', '亥': 'Yin'
};

export const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
};

export const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire'
};

// ─────────────────────────────────────────────────────────────────────────────
// COMBINATION DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 天干合 (Heavenly Stem Combinations)
 */
export const STEM_COMBINATIONS: Record<string, { partner: string; result: ElementName }> = {
  '甲': { partner: '己', result: 'Earth' },
  '己': { partner: '甲', result: 'Earth' },
  '乙': { partner: '庚', result: 'Metal' },
  '庚': { partner: '乙', result: 'Metal' },
  '丙': { partner: '辛', result: 'Water' },
  '辛': { partner: '丙', result: 'Water' },
  '丁': { partner: '壬', result: 'Wood' },
  '壬': { partner: '丁', result: 'Wood' },
  '戊': { partner: '癸', result: 'Fire' },
  '癸': { partner: '戊', result: 'Fire' }
};

/**
 * 六合 (Six Combinations)
 */
export const LIUHE_COMBINATIONS: Record<string, { partner: string; result: ElementName }> = {
  '子': { partner: '丑', result: 'Earth' },
  '丑': { partner: '子', result: 'Earth' },
  '寅': { partner: '亥', result: 'Wood' },
  '亥': { partner: '寅', result: 'Wood' },
  '卯': { partner: '戌', result: 'Fire' },
  '戌': { partner: '卯', result: 'Fire' },
  '辰': { partner: '酉', result: 'Metal' },
  '酉': { partner: '辰', result: 'Metal' },
  '巳': { partner: '申', result: 'Water' },
  '申': { partner: '巳', result: 'Water' },
  '午': { partner: '未', result: 'Fire' },
  '未': { partner: '午', result: 'Fire' }
};

/**
 * 三合 (Three Combinations) - Elemental Frames
 */
export const SANHE_FRAMES: Record<ElementName, [string, string, string]> = {
  Water: ['申', '子', '辰'],
  Wood: ['亥', '卯', '未'],
  Fire: ['寅', '午', '戌'],
  Metal: ['巳', '酉', '丑'],
  Earth: ['丑', '辰', '未'] // Note: Earth doesn't have traditional 三合
};

/**
 * 三会 (Seasonal Combinations)
 */
export const SANHUI_SEASONS: Record<string, { branches: [string, string, string]; result: ElementName }> = {
  Spring: { branches: ['寅', '卯', '辰'], result: 'Wood' },
  Summer: { branches: ['巳', '午', '未'], result: 'Fire' },
  Autumn: { branches: ['申', '酉', '戌'], result: 'Metal' },
  Winter: { branches: ['亥', '子', '丑'], result: 'Water' }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFLICT DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 六冲 (Six Clashes)
 */
export const SIX_CLASHES: Array<[string, string]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
];

/**
 * 六害 (Six Harms)
 */
export const SIX_HARMS: Array<[string, string]> = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌']
];

/**
 * 刑 (Punishments)
 */
export const PUNISHMENTS: Array<[string, string]> = [
  ['子', '卯'], ['卯', '子'],
  ['寅', '巳'], ['巳', '申'], ['申', '寅'],
  ['丑', '戌'], ['戌', '未'], ['未', '丑'],
  ['辰', '辰'], ['午', '午'], ['酉', '酉'], ['亥', '亥']
];

/**
 * 破 (Destructions)
 */
export const DESTRUCTIONS: Array<[string, string]> = [
  ['子', '酉'], ['酉', '子'],
  ['丑', '辰'], ['辰', '丑'],
  ['寅', '亥'], ['亥', '寅'],
  ['卯', '午'], ['午', '卯'],
  ['巳', '申'], ['申', '巳'],
  ['未', '戌'], ['戌', '未']
];

// ─────────────────────────────────────────────────────────────────────────────
// ROMANCE SHEN SHA
// ─────────────────────────────────────────────────────────────────────────────

export const RED_MATCHMAKER_MAP: Record<string, string> = {
  '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
  '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
  '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
};

export const SKY_HAPPINESS_MAP: Record<string, string> = {
  '子': '酉', '丑': '申', '寅': '未', '卯': '午',
  '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
  '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
};

export const PEACH_BLOSSOM_MAP: Record<string, string> = {
  '子': '酉', '丑': '午', '寅': '卯', '卯': '子',
  '辰': '酉', '巳': '午', '午': '卯', '未': '子',
  '申': '酉', '酉': '午', '戌': '卯', '亥': '子'
};

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR LABELS
// ─────────────────────────────────────────────────────────────────────────────

export const PILLAR_CHINESE: Record<PillarLabel, string> = {
  Year: '年柱',
  Month: '月柱',
  Day: '日柱',
  Hour: '时柱',
  DM: '日主'
};

// ─────────────────────────────────────────────────────────────────────────────
// SCORING CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const INTERACTION_SCORES: Record<string, number> = {
  // Harmonies
  '三合': 25,
  '三会': 25,
  '六合': 20,
  '天干合': 15,
  '生': 10,
  '同元': 5,   // Same element
  '同极': 3,   // Same polarity

  // Romance
  '红鸾': 20,
  '桃花': 18,
  '天喜': 15,

  // Tensions
  '破': -22,
  '冲': -20,
  '刑': -18,
  '害': -15,
  '克': -10
};

// ─────────────────────────────────────────────────────────────────────────────
// DETECTION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect stem combination (天干合)
 */
function detectStemCombination(stemA: StemName, stemB: StemName): InteractionHit | null {
  const comboInfo = STEM_COMBINATIONS[stemA];
  if (comboInfo && comboInfo.partner === stemB) {
    return {
      type: 'stem_combo',
      chinese: '天干合',
      nature: 'harmony',
      score: INTERACTION_SCORES['天干合'],
      explanation: `${stemA}${stemB} combine to produce ${comboInfo.result} energy - deep compatibility`
    };
  }
  return null;
}

/**
 * Detect branch combination (六合)
 */
function detectLiuheCombination(branchA: BranchName, branchB: BranchName): InteractionHit | null {
  const comboInfo = LIUHE_COMBINATIONS[branchA];
  if (comboInfo && comboInfo.partner === branchB) {
    return {
      type: 'liuhe',
      chinese: '六合',
      nature: 'harmony',
      score: INTERACTION_SCORES['六合'],
      explanation: `${branchA}${branchB} Six Combination produces ${comboInfo.result} - natural affinity`
    };
  }
  return null;
}

/**
 * Detect three combination (三合)
 */
function detectSanheCombination(branchA: BranchName, branchB: BranchName): InteractionHit | null {
  for (const [element, branches] of Object.entries(SANHE_FRAMES)) {
    if (element === 'Earth') continue; // Skip non-traditional Earth frame
    if (branches.includes(branchA) && branches.includes(branchB) && branchA !== branchB) {
      return {
        type: 'sanhe',
        chinese: '三合',
        nature: 'harmony',
        score: INTERACTION_SCORES['三合'],
        explanation: `${branchA}${branchB} are part of ${element} Three Combination - powerful harmony`
      };
    }
  }
  return null;
}

/**
 * Detect seasonal combination (三会)
 */
function detectSanhuiCombination(branchA: BranchName, branchB: BranchName): InteractionHit | null {
  for (const [season, info] of Object.entries(SANHUI_SEASONS)) {
    if (info.branches.includes(branchA) && info.branches.includes(branchB) && branchA !== branchB) {
      return {
        type: 'sanhui',
        chinese: '三会',
        nature: 'harmony',
        score: INTERACTION_SCORES['三会'],
        explanation: `${branchA}${branchB} belong to ${season} Seasonal Combination - environmental synergy`
      };
    }
  }
  return null;
}

/**
 * Detect clash (冲)
 */
function detectClash(branchA: BranchName, branchB: BranchName): InteractionHit | null {
  for (const [b1, b2] of SIX_CLASHES) {
    if ((branchA === b1 && branchB === b2) || (branchA === b2 && branchB === b1)) {
      return {
        type: 'clash',
        chinese: '冲',
        nature: 'tension',
        score: INTERACTION_SCORES['冲'],
        explanation: `${branchA}${branchB} Clash - direct opposition and friction`
      };
    }
  }
  return null;
}

/**
 * Detect harm (害)
 */
function detectHarm(branchA: BranchName, branchB: BranchName): InteractionHit | null {
  for (const [b1, b2] of SIX_HARMS) {
    if ((branchA === b1 && branchB === b2) || (branchA === b2 && branchB === b1)) {
      return {
        type: 'harm',
        chinese: '害',
        nature: 'tension',
        score: INTERACTION_SCORES['害'],
        explanation: `${branchA}${branchB} Harm - undermining and resentment`
      };
    }
  }
  return null;
}

/**
 * Detect punishment (刑)
 */
function detectPunishment(branchA: BranchName, branchB: BranchName): InteractionHit | null {
  for (const [b1, b2] of PUNISHMENTS) {
    if (branchA === b1 && branchB === b2) {
      return {
        type: 'punishment',
        chinese: '刑',
        nature: 'tension',
        score: INTERACTION_SCORES['刑'],
        explanation: `${branchA}${branchB} Punishment - destructive patterns`
      };
    }
  }
  return null;
}

/**
 * Detect destruction (破)
 */
function detectDestruction(branchA: BranchName, branchB: BranchName): InteractionHit | null {
  for (const [b1, b2] of DESTRUCTIONS) {
    if ((branchA === b1 && branchB === b2) || (branchA === b2 && branchB === b1)) {
      return {
        type: 'destruction',
        chinese: '破',
        nature: 'tension',
        score: INTERACTION_SCORES['破'],
        explanation: `${branchA}${branchB} Destruction - breaking apart`
      };
    }
  }
  return null;
}

/**
 * Detect element relationship (生/克)
 */
function detectElementRelationship(stemA: StemName, stemB: StemName): InteractionHit | null {
  const elementA = STEM_ELEMENT[stemA];
  const elementB = STEM_ELEMENT[stemB];

  // Same element
  if (elementA === elementB) {
    return {
      type: 'same_element',
      chinese: '同元',
      nature: 'neutral',
      score: INTERACTION_SCORES['同元'],
      explanation: `Both have ${elementA} - shared nature`
    };
  }

  // A produces B
  if (ELEMENT_PRODUCES[elementA] === elementB) {
    return {
      type: 'producing',
      chinese: '生',
      nature: 'harmony',
      score: INTERACTION_SCORES['生'],
      explanation: `${elementA} nurtures ${elementB} - supportive flow`
    };
  }

  // B produces A
  if (ELEMENT_PRODUCES[elementB] === elementA) {
    return {
      type: 'produced',
      chinese: '生',
      nature: 'harmony',
      score: INTERACTION_SCORES['生'],
      explanation: `${elementB} nurtures ${elementA} - receiving support`
    };
  }

  // A controls B
  if (ELEMENT_CONTROLS[elementA] === elementB) {
    return {
      type: 'controlling',
      chinese: '克',
      nature: 'tension',
      score: INTERACTION_SCORES['克'],
      explanation: `${elementA} controls ${elementB} - dominance dynamic`
    };
  }

  // B controls A
  if (ELEMENT_CONTROLS[elementB] === elementA) {
    return {
      type: 'controlled',
      chinese: '克',
      nature: 'tension',
      score: INTERACTION_SCORES['克'],
      explanation: `${elementB} controls ${elementA} - submission dynamic`
    };
  }

  return null;
}

/**
 * Detect polarity relationship
 */
function detectPolarityRelationship(stemA: StemName, stemB: StemName): InteractionHit | null {
  const polarityA = STEM_POLARITY[stemA];
  const polarityB = STEM_POLARITY[stemB];

  if (polarityA === polarityB) {
    return {
      type: 'same_polarity',
      chinese: '同极',
      nature: 'neutral',
      score: INTERACTION_SCORES['同极'],
      explanation: `Both ${polarityA} - similar energy expression`
    };
  }

  return null;
}

/**
 * Detect romance indicators
 */
function detectRomanceIndicators(
  aYearBranch: BranchName,
  bYearBranch: BranchName,
  branchA: BranchName | null,
  branchB: BranchName | null
): InteractionHit[] {
  const hits: InteractionHit[] = [];

  if (!branchA || !branchB) return hits;

  // Red Matchmaker - A's 红鸾 matches B's branch
  if (RED_MATCHMAKER_MAP[aYearBranch] === branchB) {
    hits.push({
      type: 'red_matchmaker',
      chinese: '红鸾',
      nature: 'romance',
      score: INTERACTION_SCORES['红鸾'],
      explanation: `Red Matchmaker (红鸾) activated - marriage affinity`
    });
  }

  // Sky Happiness - A's 天喜 matches B's branch
  if (SKY_HAPPINESS_MAP[aYearBranch] === branchB) {
    hits.push({
      type: 'sky_happiness',
      chinese: '天喜',
      nature: 'romance',
      score: INTERACTION_SCORES['天喜'],
      explanation: `Sky Happiness (天喜) activated - joyful connection`
    });
  }

  // Peach Blossom - A's 桃花 matches B's branch
  if (PEACH_BLOSSOM_MAP[aYearBranch] === branchB) {
    hits.push({
      type: 'peach_blossom',
      chinese: '桃花',
      nature: 'romance',
      score: INTERACTION_SCORES['桃花'],
      explanation: `Peach Blossom (桃花) activated - romantic attraction`
    });
  }

  return hits;
}

// ─────────────────────────────────────────────────────────────────────────────
// CELL COMPUTATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute all interactions for a single cell
 */
function computeCellInteractions(
  aPillar: PillarInfo,
  bPillar: PillarInfo,
  aYearBranch: BranchName,
  bYearBranch: BranchName
): InteractionHit[] {
  const interactions: InteractionHit[] = [];

  // 1. Stem combination
  const stemCombo = detectStemCombination(aPillar.stem, bPillar.stem);
  if (stemCombo) interactions.push(stemCombo);

  // 2. Branch combinations (only if both have branches)
  if (aPillar.branch && bPillar.branch) {
    const liuhe = detectLiuheCombination(aPillar.branch, bPillar.branch);
    if (liuhe) interactions.push(liuhe);

    const sanhe = detectSanheCombination(aPillar.branch, bPillar.branch);
    if (sanhe) interactions.push(sanhe);

    const sanhui = detectSanhuiCombination(aPillar.branch, bPillar.branch);
    if (sanhui) interactions.push(sanhui);
  }

  // 3. Conflicts (only if both have branches)
  if (aPillar.branch && bPillar.branch) {
    const destruction = detectDestruction(aPillar.branch, bPillar.branch);
    if (destruction) interactions.push(destruction);

    const clash = detectClash(aPillar.branch, bPillar.branch);
    if (clash) interactions.push(clash);

    const punishment = detectPunishment(aPillar.branch, bPillar.branch);
    if (punishment) interactions.push(punishment);

    const harm = detectHarm(aPillar.branch, bPillar.branch);
    if (harm) interactions.push(harm);
  }

  // 4. Element relationships
  const elementRel = detectElementRelationship(aPillar.stem, bPillar.stem);
  if (elementRel) interactions.push(elementRel);

  // 5. Polarity
  const polarity = detectPolarityRelationship(aPillar.stem, bPillar.stem);
  if (polarity) interactions.push(polarity);

  // 6. Romance indicators
  const romance = detectRomanceIndicators(
    aYearBranch,
    bYearBranch,
    aPillar.branch,
    bPillar.branch
  );
  interactions.push(...romance);

  return interactions;
}

/**
 * Convert score to color
 */
function scoreToColor(score: number): { color: string; intensity: number } {
  // Normalize score to -50 to +50 range
  const normalizedScore = Math.max(-50, Math.min(50, score));
  const intensity = Math.abs(normalizedScore) / 50;

  if (normalizedScore >= 25) {
    return { color: 'rgba(34, 197, 94, 0.9)', intensity };    // Strong harmony (green)
  } else if (normalizedScore >= 10) {
    return { color: 'rgba(59, 130, 246, 0.7)', intensity };   // Soft harmony (blue)
  } else if (normalizedScore >= -5) {
    return { color: 'rgba(156, 163, 175, 0.4)', intensity };  // Neutral (gray)
  } else if (normalizedScore >= -15) {
    return { color: 'rgba(251, 191, 36, 0.7)', intensity };   // Mild tension (amber)
  } else {
    return { color: 'rgba(239, 68, 68, 0.85)', intensity };   // Strong tension (red)
  }
}

/**
 * Determine overall nature of a cell
 */
function determineNature(score: number, interactions: InteractionHit[]): InteractionNature {
  const hasRomance = interactions.some(i => i.nature === 'romance');
  if (hasRomance && score > 0) return 'romance';

  if (score >= 10) return 'harmony';
  if (score <= -10) return 'tension';
  return 'neutral';
}

/**
 * Generate cell summary
 */
function generateCellSummary(interactions: InteractionHit[], score: number): string {
  if (interactions.length === 0) return 'No significant interaction';

  const positives = interactions.filter(i => i.score > 0);
  const negatives = interactions.filter(i => i.score < 0);

  const parts: string[] = [];

  if (positives.length > 0) {
    parts.push(positives.map(i => i.chinese).join('、'));
  }
  if (negatives.length > 0) {
    parts.push(negatives.map(i => i.chinese).join('、'));
  }

  return parts.join(' | ') || 'Neutral';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HEATMAP FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute full synastry heatmap between two people
 */
export function computeSynastryHeatmap(
  personA: NatalPillarsInput,
  personB: NatalPillarsInput,
  personAName: string = 'Person A',
  personBName: string = 'Person B'
): SynastryHeatmap {

  // Build pillar info lists
  const aPillars: PillarInfo[] = [
    { label: 'Year', labelChinese: '年柱', stem: personA.yearStem, branch: personA.yearBranch },
    { label: 'Month', labelChinese: '月柱', stem: personA.monthStem, branch: personA.monthBranch },
    { label: 'Day', labelChinese: '日柱', stem: personA.dayStem, branch: personA.dayBranch },
    { label: 'Hour', labelChinese: '时柱', stem: personA.hourStem, branch: personA.hourBranch },
    { label: 'DM', labelChinese: '日主', stem: personA.dayStem, branch: null }
  ];

  const bPillars: PillarInfo[] = [
    { label: 'Year', labelChinese: '年柱', stem: personB.yearStem, branch: personB.yearBranch },
    { label: 'Month', labelChinese: '月柱', stem: personB.monthStem, branch: personB.monthBranch },
    { label: 'Day', labelChinese: '日柱', stem: personB.dayStem, branch: personB.dayBranch },
    { label: 'Hour', labelChinese: '时柱', stem: personB.hourStem, branch: personB.hourBranch },
    { label: 'DM', labelChinese: '日主', stem: personB.dayStem, branch: null }
  ];

  // Compute grid
  const grid: SynastryCell[][] = [];
  let totalScore = 0;
  let strongestHarmony: SynastryCell | null = null;
  let strongestTension: SynastryCell | null = null;
  const romanceHotspots: SynastryCell[] = [];

  for (const aPillar of aPillars) {
    const row: SynastryCell[] = [];

    for (const bPillar of bPillars) {
      const interactions = computeCellInteractions(
        aPillar,
        bPillar,
        personA.yearBranch,
        personB.yearBranch
      );

      const cellScore = interactions.reduce((sum, i) => sum + i.score, 0);
      const { color, intensity } = scoreToColor(cellScore);
      const nature = determineNature(cellScore, interactions);
      const summary = generateCellSummary(interactions, cellScore);

      const cell: SynastryCell = {
        aPillar: aPillar.label,
        aPillarChinese: aPillar.labelChinese,
        bPillar: bPillar.label,
        bPillarChinese: bPillar.labelChinese,
        interactions,
        totalScore: cellScore,
        normalizedScore: Math.max(-100, Math.min(100, cellScore * 2)),
        color,
        colorIntensity: intensity,
        nature,
        summary
      };

      row.push(cell);
      totalScore += cellScore;

      // Track extremes
      if (!strongestHarmony || cellScore > strongestHarmony.totalScore) {
        if (cellScore > 0) strongestHarmony = cell;
      }
      if (!strongestTension || cellScore < strongestTension.totalScore) {
        if (cellScore < 0) strongestTension = cell;
      }
      if (nature === 'romance') {
        romanceHotspots.push(cell);
      }
    }

    grid.push(row);
  }

  // Calculate overall metrics
  const cellCount = grid.length * grid[0].length;
  const averageScore = totalScore / cellCount;
  const overallNature: InteractionNature =
    averageScore >= 5 ? 'harmony' :
    averageScore <= -5 ? 'tension' : 'neutral';

  // Generate summary
  const summary = generateHeatmapSummary(
    averageScore,
    strongestHarmony,
    strongestTension,
    romanceHotspots
  );

  // Format for visualization libraries
  const nivoData = formatForNivo(grid, aPillars, bPillars);
  const echartsData = formatForECharts(grid, aPillars, bPillars);

  return {
    personA: personAName,
    personB: personBName,
    grid,
    rowLabels: aPillars.map(p => p.labelChinese),
    columnLabels: bPillars.map(p => p.labelChinese),
    overallScore: Math.round(averageScore * 10) / 10,
    overallNature,
    strongestHarmony,
    strongestTension,
    romanceHotspots,
    summary,
    nivoData,
    echartsData
  };
}

/**
 * Generate overall summary
 */
function generateHeatmapSummary(
  averageScore: number,
  strongestHarmony: SynastryCell | null,
  strongestTension: SynastryCell | null,
  romanceHotspots: SynastryCell[]
): string {
  const parts: string[] = [];

  if (averageScore >= 10) {
    parts.push('This pairing shows strong natural compatibility.');
  } else if (averageScore >= 5) {
    parts.push('This pairing has good overall harmony.');
  } else if (averageScore >= -5) {
    parts.push('This pairing shows balanced dynamics.');
  } else if (averageScore >= -10) {
    parts.push('This pairing has some tension points to navigate.');
  } else {
    parts.push('This pairing requires conscious effort to harmonize.');
  }

  if (strongestHarmony) {
    parts.push(`Strongest connection: ${strongestHarmony.aPillarChinese}↔${strongestHarmony.bPillarChinese} (${strongestHarmony.summary}).`);
  }

  if (strongestTension && strongestTension.totalScore < -10) {
    parts.push(`Watch for: ${strongestTension.aPillarChinese}↔${strongestTension.bPillarChinese} (${strongestTension.summary}).`);
  }

  if (romanceHotspots.length > 0) {
    parts.push(`Romance energy: ${romanceHotspots.length} hotspot(s) detected.`);
  }

  return parts.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// VISUALIZATION FORMATTERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format for Nivo Heatmap
 */
function formatForNivo(
  grid: SynastryCell[][],
  aPillars: PillarInfo[],
  bPillars: PillarInfo[]
): NivoHeatmapData[] {
  return aPillars.map((aPillar, rowIndex) => ({
    id: aPillar.labelChinese,
    data: bPillars.map((bPillar, colIndex) => ({
      x: bPillar.labelChinese,
      y: grid[rowIndex][colIndex].normalizedScore
    }))
  }));
}

/**
 * Format for ECharts Heatmap
 */
function formatForECharts(
  grid: SynastryCell[][],
  aPillars: PillarInfo[],
  bPillars: PillarInfo[]
): EChartsHeatmapData {
  const data: Array<[number, number, number]> = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      data.push([col, row, grid[row][col].normalizedScore]);
    }
  }

  return {
    xAxis: bPillars.map(p => p.labelChinese),
    yAxis: aPillars.map(p => p.labelChinese),
    data,
    visualMap: { min: -100, max: 100 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY MODE FORMATTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate story mode narrative
 */
export function formatSynastryHeatmapStory(heatmap: SynastryHeatmap): string {
  const lines: string[] = [];

  lines.push('# 合盘热力图 Synastry Heatmap');
  lines.push('');
  lines.push(`**${heatmap.personA} × ${heatmap.personB}**`);
  lines.push('');
  lines.push(`**Overall Score:** ${heatmap.overallScore} (${heatmap.overallNature})`);
  lines.push('');
  lines.push(`**Summary:** ${heatmap.summary}`);
  lines.push('');

  // Grid visualization (text-based)
  lines.push('## Heatmap Grid');
  lines.push('');

  // Header row
  const header = ['', ...heatmap.columnLabels].join(' | ');
  lines.push(`| ${header} |`);
  lines.push(`| ${['---', ...heatmap.columnLabels.map(() => '---')].join(' | ')} |`);

  // Data rows
  for (let row = 0; row < heatmap.grid.length; row++) {
    const rowData = heatmap.grid[row].map(cell => {
      const sign = cell.totalScore >= 0 ? '+' : '';
      return `${sign}${cell.totalScore}`;
    });
    lines.push(`| ${heatmap.rowLabels[row]} | ${rowData.join(' | ')} |`);
  }
  lines.push('');

  // Strongest harmony
  if (heatmap.strongestHarmony) {
    lines.push('## Strongest Harmony');
    lines.push(`**${heatmap.strongestHarmony.aPillarChinese} ↔ ${heatmap.strongestHarmony.bPillarChinese}** (Score: ${heatmap.strongestHarmony.totalScore})`);
    for (const interaction of heatmap.strongestHarmony.interactions.filter(i => i.score > 0)) {
      lines.push(`- ${interaction.chinese}: ${interaction.explanation}`);
    }
    lines.push('');
  }

  // Strongest tension
  if (heatmap.strongestTension && heatmap.strongestTension.totalScore < -5) {
    lines.push('## Points of Tension');
    lines.push(`**${heatmap.strongestTension.aPillarChinese} ↔ ${heatmap.strongestTension.bPillarChinese}** (Score: ${heatmap.strongestTension.totalScore})`);
    for (const interaction of heatmap.strongestTension.interactions.filter(i => i.score < 0)) {
      lines.push(`- ${interaction.chinese}: ${interaction.explanation}`);
    }
    lines.push('');
  }

  // Romance hotspots
  if (heatmap.romanceHotspots.length > 0) {
    lines.push('## Romance Hotspots');
    for (const hotspot of heatmap.romanceHotspots) {
      lines.push(`**${hotspot.aPillarChinese} ↔ ${hotspot.bPillarChinese}**`);
      for (const interaction of hotspot.interactions.filter(i => i.nature === 'romance')) {
        lines.push(`- ${interaction.chinese}: ${interaction.explanation}`);
      }
    }
    lines.push('');
  }

  // Interpretation guidance
  lines.push('## Interpretation Guide');
  lines.push('- **Green cells (+15 to +50):** Natural harmony, easy flow');
  lines.push('- **Blue cells (+5 to +14):** Soft compatibility, supportive');
  lines.push('- **Gray cells (-4 to +4):** Neutral, neither help nor hinder');
  lines.push('- **Amber cells (-5 to -14):** Mild tension, manageable');
  lines.push('- **Red cells (-15 to -50):** Strong tension, requires work');

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG MODE FORMATTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate debug output
 */
export function formatSynastryHeatmapDebug(heatmap: SynastryHeatmap): string {
  const lines: string[] = [];

  lines.push('=== SYNASTRY HEATMAP DEBUG ===');
  lines.push(`Overall Score: ${heatmap.overallScore}`);
  lines.push(`Overall Nature: ${heatmap.overallNature}`);
  lines.push('');

  lines.push('Cell Details:');
  for (const row of heatmap.grid) {
    for (const cell of row) {
      if (cell.interactions.length > 0) {
        lines.push(`  ${cell.aPillarChinese}×${cell.bPillarChinese}: ${cell.totalScore}`);
        for (const i of cell.interactions) {
          lines.push(`    - ${i.chinese} (${i.score}): ${i.type}`);
        }
      }
    }
  }

  lines.push('');
  lines.push('ECharts Data:');
  lines.push(JSON.stringify(heatmap.echartsData, null, 2));

  return lines.join('\n');
}
