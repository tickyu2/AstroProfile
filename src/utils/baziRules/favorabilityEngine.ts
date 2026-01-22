/**
 * ============================================
 * FAVORABILITY ENGINE (用神/忌神)
 * Enhanced Element Favorability Analysis
 *
 * Determines which elements are favorable (用神)
 * and unfavorable (忌神) based on:
 * - Day Master strength
 * - Element balance
 * - Structure type
 * - Seasonal influences
 * ============================================
 */

// ==================== TYPES ====================

export type FavorabilityType =
  | 'YongShen'     // 用神 - Most Useful God
  | 'XiShen'       // 喜神 - Favorable God
  | 'JiShen'       // 忌神 - Annoying God
  | 'ChouShen'     // 仇神 - Enemy God
  | 'XianShen';    // 闲神 - Idle God

export interface ElementFavorability {
  element: string;
  type: FavorabilityType;
  score: number; // -100 to 100, positive = favorable
  reason: string;
  reasonZh: string;
  priority: number; // 1 = most important
}

export interface FavorabilityAnalysis {
  yongShen: string;           // Primary Useful God
  xiShen: string;             // Secondary Favorable
  jiShen: string;             // Primary Annoying
  chouShen: string;           // Secondary Annoying
  xianShen: string;           // Neutral/Idle
  elements: ElementFavorability[];
  interpretation: string;
  interpretationZh: string;
  advice: string[];
  adviceZh: string[];
}

export interface FavorabilityInput {
  dayMasterElement: string;
  dayMasterStrength: number; // -100 to 100
  elementBalance: Record<string, number>; // percentages
  structureType?: string;
  monthBranch: string;
}

// ==================== CONSTANTS ====================

const FIVE_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const ELEMENT_PRODUCES: Record<string, string> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood'
};

const ELEMENT_CONTROLS: Record<string, string> = {
  Wood: 'Earth',
  Fire: 'Metal',
  Earth: 'Water',
  Metal: 'Wood',
  Water: 'Fire'
};

const ELEMENT_PRODUCED_BY: Record<string, string> = {
  Wood: 'Water',
  Fire: 'Wood',
  Earth: 'Fire',
  Metal: 'Earth',
  Water: 'Metal'
};

const ELEMENT_CONTROLLED_BY: Record<string, string> = {
  Wood: 'Metal',
  Fire: 'Water',
  Earth: 'Wood',
  Metal: 'Fire',
  Water: 'Earth'
};

// ==================== CORE FUNCTIONS ====================

/**
 * Compute element favorability analysis
 */
export function computeFavorability(input: FavorabilityInput): FavorabilityAnalysis {
  const {
    dayMasterElement,
    dayMasterStrength,
    elementBalance,
    structureType
  } = input;

  const elements: ElementFavorability[] = [];
  let priority = 1;

  // Determine DM condition
  const isStrong = dayMasterStrength > 20;
  const isWeak = dayMasterStrength < -20;
  const isBalanced = !isStrong && !isWeak;

  // Calculate favorability for each element
  FIVE_ELEMENTS.forEach(element => {
    const relationship = getElementRelationship(dayMasterElement, element);
    const balance = elementBalance[element] ?? 20;
    const { type, score, reason, reasonZh } = calculateElementFavorability(
      element,
      relationship,
      isStrong,
      isWeak,
      isBalanced,
      balance,
      dayMasterElement
    );

    elements.push({
      element,
      type,
      score,
      reason,
      reasonZh,
      priority: type === 'YongShen' ? 1 :
                type === 'XiShen' ? 2 :
                type === 'XianShen' ? 3 :
                type === 'JiShen' ? 4 : 5
    });
  });

  // Sort by priority and score
  elements.sort((a, b) => a.priority - b.priority || b.score - a.score);

  // Identify key elements
  const yongShen = elements.find(e => e.type === 'YongShen')?.element || '';
  const xiShen = elements.find(e => e.type === 'XiShen')?.element || '';
  const jiShen = elements.find(e => e.type === 'JiShen')?.element || '';
  const chouShen = elements.find(e => e.type === 'ChouShen')?.element || '';
  const xianShen = elements.find(e => e.type === 'XianShen')?.element || '';

  // Generate interpretation
  const { interpretation, interpretationZh } = generateInterpretation(
    yongShen, xiShen, jiShen, isStrong, isWeak, dayMasterElement
  );

  // Generate advice
  const { advice, adviceZh } = generateAdvice(yongShen, xiShen, jiShen);

  return {
    yongShen,
    xiShen,
    jiShen,
    chouShen,
    xianShen,
    elements,
    interpretation,
    interpretationZh,
    advice,
    adviceZh
  };
}

/**
 * Get relationship between day master and another element
 */
function getElementRelationship(dmElement: string, targetElement: string): string {
  if (dmElement === targetElement) return 'same';
  if (ELEMENT_PRODUCES[dmElement] === targetElement) return 'produces';
  if (ELEMENT_PRODUCED_BY[dmElement] === targetElement) return 'produced_by';
  if (ELEMENT_CONTROLS[dmElement] === targetElement) return 'controls';
  if (ELEMENT_CONTROLLED_BY[dmElement] === targetElement) return 'controlled_by';
  return 'neutral';
}

/**
 * Calculate favorability for a single element
 */
function calculateElementFavorability(
  element: string,
  relationship: string,
  isStrong: boolean,
  isWeak: boolean,
  isBalanced: boolean,
  balance: number,
  dmElement: string
): { type: FavorabilityType; score: number; reason: string; reasonZh: string } {

  // Weak Day Master needs support
  if (isWeak) {
    if (relationship === 'produced_by' || relationship === 'same') {
      return {
        type: 'YongShen',
        score: 80,
        reason: `${element} supports the weak Day Master through ${relationship === 'produced_by' ? 'nurturing' : 'companionship'}.`,
        reasonZh: `${getElementZh(element)}通过${relationship === 'produced_by' ? '滋养' : '比助'}支持弱日主。`
      };
    }
    if (relationship === 'controls') {
      return {
        type: 'XiShen',
        score: 50,
        reason: `${element} drains opposition, indirectly helping the weak Day Master.`,
        reasonZh: `${getElementZh(element)}耗泄克制，间接帮助弱日主。`
      };
    }
    if (relationship === 'controlled_by') {
      return {
        type: 'JiShen',
        score: -70,
        reason: `${element} attacks the already weak Day Master.`,
        reasonZh: `${getElementZh(element)}克制已经虚弱的日主。`
      };
    }
    if (relationship === 'produces') {
      return {
        type: 'ChouShen',
        score: -50,
        reason: `${element} drains the weak Day Master's limited energy.`,
        reasonZh: `${getElementZh(element)}耗泄弱日主有限的能量。`
      };
    }
  }

  // Strong Day Master needs drainage
  if (isStrong) {
    if (relationship === 'produces' || relationship === 'controls') {
      return {
        type: 'YongShen',
        score: 80,
        reason: `${element} helps drain the overly strong Day Master.`,
        reasonZh: `${getElementZh(element)}帮助耗泄过强的日主。`
      };
    }
    if (relationship === 'controlled_by') {
      return {
        type: 'XiShen',
        score: 60,
        reason: `${element} controls the excess strength of Day Master.`,
        reasonZh: `${getElementZh(element)}克制日主过剩的力量。`
      };
    }
    if (relationship === 'produced_by' || relationship === 'same') {
      return {
        type: 'JiShen',
        score: -70,
        reason: `${element} makes the already strong Day Master too powerful.`,
        reasonZh: `${getElementZh(element)}使已经强大的日主过于强大。`
      };
    }
  }

  // Balanced Day Master - maintain balance
  if (isBalanced) {
    // Favor elements that are lacking
    if (balance < 15) {
      return {
        type: 'YongShen',
        score: 60,
        reason: `${element} is lacking in the chart and needed for balance.`,
        reasonZh: `${getElementZh(element)}在命盘中缺失，需要平衡。`
      };
    }
    if (balance > 30) {
      return {
        type: 'JiShen',
        score: -40,
        reason: `${element} is excessive in the chart.`,
        reasonZh: `${getElementZh(element)}在命盘中过多。`
      };
    }
    return {
      type: 'XianShen',
      score: 0,
      reason: `${element} is neutral for the balanced chart.`,
      reasonZh: `${getElementZh(element)}对平衡命盘是中性的。`
    };
  }

  return {
    type: 'XianShen',
    score: 0,
    reason: `${element} has neutral effect.`,
    reasonZh: `${getElementZh(element)}影响中性。`
  };
}

function getElementZh(element: string): string {
  const map: Record<string, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };
  return map[element] || element;
}

function generateInterpretation(
  yongShen: string,
  xiShen: string,
  jiShen: string,
  isStrong: boolean,
  isWeak: boolean,
  dmElement: string
): { interpretation: string; interpretationZh: string } {
  let en = '';
  let zh = '';

  if (isWeak) {
    en = `The ${dmElement} Day Master is weak and needs support. `;
    zh = `${getElementZh(dmElement)}日主偏弱，需要支持。`;
  } else if (isStrong) {
    en = `The ${dmElement} Day Master is strong and needs drainage. `;
    zh = `${getElementZh(dmElement)}日主偏强，需要耗泄。`;
  } else {
    en = `The ${dmElement} Day Master is balanced. `;
    zh = `${getElementZh(dmElement)}日主平衡。`;
  }

  if (yongShen) {
    en += `${yongShen} is the most useful element (用神). `;
    zh += `${getElementZh(yongShen)}是用神。`;
  }

  if (xiShen) {
    en += `${xiShen} is also favorable (喜神). `;
    zh += `${getElementZh(xiShen)}是喜神。`;
  }

  if (jiShen) {
    en += `Avoid excessive ${jiShen} (忌神).`;
    zh += `避免过多${getElementZh(jiShen)}（忌神）。`;
  }

  return { interpretation: en, interpretationZh: zh };
}

function generateAdvice(
  yongShen: string,
  xiShen: string,
  jiShen: string
): { advice: string[]; adviceZh: string[] } {
  const advice: string[] = [];
  const adviceZh: string[] = [];

  const elementAdvice: Record<string, { en: string; zh: string }> = {
    Wood: { en: 'Plants, green colors, east direction, spring activities', zh: '植物、绿色、东方、春季活动' },
    Fire: { en: 'Warmth, red colors, south direction, summer activities', zh: '温暖、红色、南方、夏季活动' },
    Earth: { en: 'Stability, yellow/brown colors, center, seasonal transitions', zh: '稳定、黄/褐色、中央、季节过渡' },
    Metal: { en: 'Structure, white/gold colors, west direction, autumn activities', zh: '结构、白/金色、西方、秋季活动' },
    Water: { en: 'Flow, black/blue colors, north direction, winter activities', zh: '流动、黑/蓝色、北方、冬季活动' }
  };

  if (yongShen && elementAdvice[yongShen]) {
    advice.push(`Embrace ${yongShen}: ${elementAdvice[yongShen].en}`);
    adviceZh.push(`拥抱${getElementZh(yongShen)}：${elementAdvice[yongShen].zh}`);
  }

  if (xiShen && elementAdvice[xiShen]) {
    advice.push(`Also beneficial - ${xiShen}: ${elementAdvice[xiShen].en}`);
    adviceZh.push(`同样有益 - ${getElementZh(xiShen)}：${elementAdvice[xiShen].zh}`);
  }

  if (jiShen) {
    advice.push(`Minimize exposure to ${jiShen} energy`);
    adviceZh.push(`减少接触${getElementZh(jiShen)}能量`);
  }

  return { advice, adviceZh };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if an element is favorable for the chart
 */
export function isElementFavorable(
  element: string,
  analysis: FavorabilityAnalysis
): boolean {
  return analysis.yongShen === element || analysis.xiShen === element;
}

/**
 * Check if an element is unfavorable for the chart
 */
export function isElementUnfavorable(
  element: string,
  analysis: FavorabilityAnalysis
): boolean {
  return analysis.jiShen === element || analysis.chouShen === element;
}

/**
 * Get favorability score for a specific element
 */
export function getElementScore(
  element: string,
  analysis: FavorabilityAnalysis
): number {
  const found = analysis.elements.find(e => e.element === element);
  return found?.score ?? 0;
}

/**
 * Evaluate a timing period based on its element
 */
export function evaluateTimingElement(
  element: string,
  analysis: FavorabilityAnalysis
): { rating: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult'; explanation: string; explanationZh: string } {
  const score = getElementScore(element, analysis);

  if (score >= 60) {
    return {
      rating: 'excellent',
      explanation: `${element} is highly favorable for you.`,
      explanationZh: `${getElementZh(element)}对您非常有利。`
    };
  }
  if (score >= 30) {
    return {
      rating: 'good',
      explanation: `${element} is moderately favorable.`,
      explanationZh: `${getElementZh(element)}较为有利。`
    };
  }
  if (score >= -30) {
    return {
      rating: 'neutral',
      explanation: `${element} has neutral effects.`,
      explanationZh: `${getElementZh(element)}影响中性。`
    };
  }
  if (score >= -60) {
    return {
      rating: 'challenging',
      explanation: `${element} presents some challenges.`,
      explanationZh: `${getElementZh(element)}带来一些挑战。`
    };
  }
  return {
    rating: 'difficult',
    explanation: `${element} is unfavorable - exercise caution.`,
    explanationZh: `${getElementZh(element)}不利——需谨慎。`
  };
}

// ==================== EXPORTS ====================

export {
  computeFavorability,
  isElementFavorable,
  isElementUnfavorable,
  getElementScore,
  evaluateTimingElement,
  FIVE_ELEMENTS,
  ELEMENT_PRODUCES,
  ELEMENT_CONTROLS,
  ELEMENT_PRODUCED_BY,
  ELEMENT_CONTROLLED_BY
};
