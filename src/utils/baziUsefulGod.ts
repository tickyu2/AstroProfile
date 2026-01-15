/**
 * ============================================================================
 * USEFUL GOD (用神) & ANNOYING GOD (忌神) ENGINE
 * ============================================================================
 *
 * This is the CORE interpretive engine in classical BaZi.
 * Everything else we've built - seasonality, DM strength, polarity, rootedness,
 * growth stages, structure, follow structures, Shen Sha, transformations,
 * conflicts - all exists so we can compute the Useful God.
 *
 * What Useful God IS:
 * - The element (or Ten God) that RESTORES BALANCE to the chart
 * - The element the chart NEEDS to function optimally
 *
 * What Useful God is NOT:
 * - The strongest element
 * - The favorite element
 * - The element that makes you rich/lucky
 *
 * Classical Logic (Joey Yap):
 *
 * CASE A - Strong DM (身强):
 *   Useful = Wealth → Officer → Output (drain the excess)
 *   Annoying = Friend → Rob Wealth → Resource (adds more strength)
 *
 * CASE B - Weak DM (身弱):
 *   Useful = Resource → Friend → Rob Wealth (support the DM)
 *   Annoying = Wealth → Officer → Output (drains what little you have)
 *
 * CASE C - Follow Structure (从格):
 *   Useful = the element being followed
 *   Annoying = Day Master element + anything that breaks the follow
 *
 * CASE D - Special Structures (格局):
 *   Each structure has its own Useful/Annoying formula
 *
 * Created: January 2026
 * Based on: Classical BaZi Useful God (用神) doctrine, Joey Yap methodology
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type TenGodName =
  | 'Friend'        // 比肩
  | 'Rob Wealth'    // 劫财
  | 'Eating God'    // 食神
  | 'Hurting Officer' // 伤官
  | 'Direct Wealth' // 正财
  | 'Indirect Wealth' // 偏财
  | 'Direct Officer' // 正官
  | 'Seven Killings' // 七杀
  | 'Direct Resource' // 正印
  | 'Indirect Resource'; // 偏印

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export type UsefulGodCategory = 'support' | 'drain' | 'control' | 'produce' | 'same';

export interface UsefulGodResult {
  // Primary results
  usefulElements: ElementName[];
  usefulTenGods: TenGodName[];
  annoyingElements: ElementName[];
  annoyingTenGods: TenGodName[];

  // Prioritized order (most useful first)
  usefulPriority: { element: ElementName; tenGod: TenGodName; score: number }[];
  annoyingPriority: { element: ElementName; tenGod: TenGodName; score: number }[];

  // Classification
  dmCategory: 'strong' | 'weak' | 'balanced' | 'follow' | 'special';
  structureInfluence: string | null;
  followInfluence: string | null;

  // Reasoning (show your work)
  reasoning: string[];
  summary: string;

  // Confidence
  confidence: number; // 0-1
}

export interface UsefulGodInput {
  // Day Master
  dayMasterElement: ElementName;
  dmStrength: number; // Final composite strength

  // Structure info
  structure: string | null;
  structureElement: ElementName | null;
  isSpecialStructure: boolean;

  // Follow structure info
  isFollow: boolean;
  followType: string | null;
  followElement: ElementName | null;

  // Element distribution
  elementDistribution: Record<ElementName, number>;

  // Ten Gods distribution
  tenGodsDistribution: Record<string, number>;

  // Optional: Additional factors
  hasClash?: boolean;
  hasPunishment?: boolean;
  seasonElement?: ElementName;
}

// ============================================================================
// ELEMENT CYCLE RELATIONSHIPS
// ============================================================================

/**
 * Production Cycle: Wood → Fire → Earth → Metal → Water → Wood
 */
export const PRODUCTION_CYCLE: Record<ElementName, ElementName> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood'
};

/**
 * Control Cycle: Wood → Earth → Water → Fire → Metal → Wood
 */
export const CONTROL_CYCLE: Record<ElementName, ElementName> = {
  Wood: 'Earth',
  Earth: 'Water',
  Water: 'Fire',
  Fire: 'Metal',
  Metal: 'Wood'
};

/**
 * What produces this element
 */
export const PRODUCED_BY: Record<ElementName, ElementName> = {
  Wood: 'Water',
  Fire: 'Wood',
  Earth: 'Fire',
  Metal: 'Earth',
  Water: 'Metal'
};

/**
 * What controls this element
 */
export const CONTROLLED_BY: Record<ElementName, ElementName> = {
  Wood: 'Metal',
  Fire: 'Water',
  Earth: 'Wood',
  Metal: 'Fire',
  Water: 'Earth'
};

// ============================================================================
// TEN GOD TO ELEMENT MAPPING
// ============================================================================

/**
 * Get the element for a Ten God based on Day Master
 */
export function getTenGodElement(dayMaster: ElementName, tenGod: TenGodName): ElementName {
  const dm = dayMaster;

  switch (tenGod) {
    case 'Friend':
    case 'Rob Wealth':
      return dm; // Same element

    case 'Eating God':
    case 'Hurting Officer':
      return PRODUCTION_CYCLE[dm]; // DM produces this

    case 'Direct Wealth':
    case 'Indirect Wealth':
      return CONTROL_CYCLE[dm]; // DM controls this

    case 'Direct Officer':
    case 'Seven Killings':
      return CONTROLLED_BY[dm]; // This controls DM

    case 'Direct Resource':
    case 'Indirect Resource':
      return PRODUCED_BY[dm]; // This produces DM

    default:
      return dm;
  }
}

/**
 * Get Ten Gods for an element relative to Day Master
 */
export function getElementTenGods(dayMaster: ElementName, element: ElementName): TenGodName[] {
  if (element === dayMaster) {
    return ['Friend', 'Rob Wealth'];
  }
  if (element === PRODUCTION_CYCLE[dayMaster]) {
    return ['Eating God', 'Hurting Officer'];
  }
  if (element === CONTROL_CYCLE[dayMaster]) {
    return ['Direct Wealth', 'Indirect Wealth'];
  }
  if (element === CONTROLLED_BY[dayMaster]) {
    return ['Direct Officer', 'Seven Killings'];
  }
  if (element === PRODUCED_BY[dayMaster]) {
    return ['Direct Resource', 'Indirect Resource'];
  }
  return [];
}

// ============================================================================
// STRUCTURE-SPECIFIC RULES
// ============================================================================

/**
 * Structure-specific Useful God rules
 * Key: structure name pattern → { useful, annoying }
 */
export const STRUCTURE_USEFUL_GOD_RULES: Record<string, {
  useful: TenGodName[];
  annoying: TenGodName[];
  reasoning: string;
}> = {
  // 正官格 - Direct Officer Structure
  'Direct Officer': {
    useful: ['Direct Resource', 'Indirect Resource', 'Direct Wealth', 'Indirect Wealth'],
    annoying: ['Hurting Officer', 'Rob Wealth', 'Seven Killings'],
    reasoning: 'Direct Officer Structure needs Resource to protect the Officer and Wealth to support it. Hurting Officer attacks the Officer directly.'
  },

  // 七杀格 - Seven Killings Structure
  'Seven Killings': {
    useful: ['Eating God', 'Direct Resource', 'Indirect Resource'],
    annoying: ['Direct Wealth', 'Indirect Wealth', 'Friend', 'Rob Wealth'],
    reasoning: 'Seven Killings needs Eating God to control its aggression and Resource for protection. Wealth strengthens the Killings too much.'
  },

  // 正印格 - Direct Resource Structure
  'Direct Resource': {
    useful: ['Direct Officer', 'Seven Killings'],
    annoying: ['Direct Wealth', 'Indirect Wealth'],
    reasoning: 'Direct Resource Structure benefits from Officer (which produces Resource). Wealth attacks and depletes the Resource.'
  },

  // 偏印格 - Indirect Resource Structure
  'Indirect Resource': {
    useful: ['Direct Officer', 'Seven Killings', 'Eating God'],
    annoying: ['Direct Wealth', 'Indirect Wealth'],
    reasoning: 'Indirect Resource benefits from Officer. Eating God can balance the Indirect Resource. Wealth damages Resource.'
  },

  // 食神格 - Eating God Structure
  'Eating God': {
    useful: ['Direct Wealth', 'Indirect Wealth'],
    annoying: ['Direct Resource', 'Indirect Resource', 'Direct Officer'],
    reasoning: 'Eating God Structure thrives when Wealth is present (Output produces Wealth). Resource and Officer suppress the Eating God.'
  },

  // 伤官格 - Hurting Officer Structure
  'Hurting Officer': {
    useful: ['Direct Wealth', 'Indirect Wealth', 'Direct Resource'],
    annoying: ['Direct Officer'],
    reasoning: 'Hurting Officer needs Wealth for productive expression. Direct Officer is the classical enemy of Hurting Officer.'
  },

  // 正财格 - Direct Wealth Structure
  'Direct Wealth': {
    useful: ['Eating God', 'Hurting Officer', 'Direct Officer'],
    annoying: ['Rob Wealth', 'Friend'],
    reasoning: 'Direct Wealth benefits from Output (which produces Wealth) and Officer (which controls Rob Wealth). Friends steal the Wealth.'
  },

  // 偏财格 - Indirect Wealth Structure
  'Indirect Wealth': {
    useful: ['Eating God', 'Hurting Officer', 'Direct Officer', 'Seven Killings'],
    annoying: ['Rob Wealth', 'Friend'],
    reasoning: 'Indirect Wealth benefits from Output and Officer. Friends and Rob Wealth compete for the Wealth.'
  },

  // 建禄格 - Month Companion Structure (Friend in Month)
  'Month Companion': {
    useful: ['Direct Wealth', 'Indirect Wealth', 'Direct Officer', 'Seven Killings'],
    annoying: ['Direct Resource', 'Indirect Resource'],
    reasoning: 'Month Companion has strong DM, needs draining through Wealth and Officer. Resource makes DM too strong.'
  },

  // 羊刃格 - Blade Structure (Rob Wealth in Month)
  'Blade': {
    useful: ['Direct Officer', 'Seven Killings'],
    annoying: ['Direct Resource', 'Indirect Resource', 'Friend'],
    reasoning: 'Blade Structure needs Officer/Killings to control the aggressive Blade. Resource and Friend add too much strength.'
  }
};

// ============================================================================
// FOLLOW STRUCTURE RULES
// ============================================================================

/**
 * Follow Structure Useful God rules
 */
export const FOLLOW_USEFUL_GOD_RULES: Record<string, {
  useful: TenGodName[];
  annoying: TenGodName[];
  reasoning: string;
}> = {
  // 从财格 - Follow Wealth
  'follow_wealth': {
    useful: ['Direct Wealth', 'Indirect Wealth', 'Eating God', 'Hurting Officer'],
    annoying: ['Direct Resource', 'Indirect Resource', 'Friend', 'Rob Wealth'],
    reasoning: 'Follow Wealth must continue following Wealth. Resource and Friend break the follow by supporting DM.'
  },

  // 从官格 - Follow Officer
  'follow_officer': {
    useful: ['Direct Officer', 'Seven Killings', 'Direct Wealth', 'Indirect Wealth'],
    annoying: ['Direct Resource', 'Indirect Resource', 'Friend', 'Rob Wealth', 'Eating God'],
    reasoning: 'Follow Officer must continue following Officer/Killings. Anything supporting DM breaks the follow.'
  },

  // 从杀格 - Follow Killings (subset of Follow Officer)
  'follow_killings': {
    useful: ['Seven Killings', 'Direct Wealth', 'Indirect Wealth'],
    annoying: ['Direct Resource', 'Indirect Resource', 'Friend', 'Rob Wealth', 'Eating God'],
    reasoning: 'Follow Killings surrenders to Seven Killings completely. DM support breaks this surrender.'
  },

  // 从儿格 - Follow Output
  'follow_output': {
    useful: ['Eating God', 'Hurting Officer', 'Direct Wealth', 'Indirect Wealth'],
    annoying: ['Direct Resource', 'Indirect Resource', 'Direct Officer', 'Seven Killings'],
    reasoning: 'Follow Output expresses through Eating God/Hurting Officer. Resource suppresses Output; Officer clashes with Hurting Officer.'
  },

  // 从强格 - Follow Strong (DM + Resource dominant)
  'follow_strong': {
    useful: ['Friend', 'Rob Wealth', 'Direct Resource', 'Indirect Resource'],
    annoying: ['Direct Wealth', 'Indirect Wealth', 'Direct Officer', 'Seven Killings'],
    reasoning: 'Follow Strong embraces the dominant DM strength. Wealth and Officer drain and attack the DM.'
  },

  // 从弱格 - Follow Weak (deprecated term, use specific follows)
  'follow_weak': {
    useful: ['Direct Wealth', 'Indirect Wealth', 'Direct Officer', 'Seven Killings'],
    annoying: ['Friend', 'Rob Wealth', 'Direct Resource', 'Indirect Resource'],
    reasoning: 'Follow Weak surrenders to the dominant opposing force. DM support disrupts this surrender.'
  }
};

// ============================================================================
// DM STRENGTH THRESHOLDS
// ============================================================================

export const DM_STRENGTH_THRESHOLDS = {
  veryWeak: 0.3,
  weak: 0.7,
  balanced: 1.0,
  strong: 1.3,
  veryStrong: 1.6
};

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute Useful God (用神) and Annoying God (忌神)
 *
 * This is the master function that determines what elements/Ten Gods
 * help or harm the chart based on all available information.
 */
export function computeUsefulGod(input: UsefulGodInput): UsefulGodResult {
  const {
    dayMasterElement,
    dmStrength,
    structure,
    structureElement,
    isSpecialStructure,
    isFollow,
    followType,
    followElement,
    elementDistribution,
    tenGodsDistribution
  } = input;

  const reasoning: string[] = [];
  let usefulElements: ElementName[] = [];
  let annoyingElements: ElementName[] = [];
  let usefulTenGods: TenGodName[] = [];
  let annoyingTenGods: TenGodName[] = [];
  let dmCategory: UsefulGodResult['dmCategory'] = 'balanced';
  let structureInfluence: string | null = null;
  let followInfluence: string | null = null;
  let confidence = 0.8;

  // ========================================
  // STEP 1: Classify DM Strength
  // ========================================
  reasoning.push(`📊 Day Master Analysis:`);
  reasoning.push(`   Day Master Element: ${dayMasterElement}`);
  reasoning.push(`   DM Strength Score: ${dmStrength.toFixed(2)}`);

  if (dmStrength < DM_STRENGTH_THRESHOLDS.veryWeak) {
    reasoning.push(`   Classification: VERY WEAK (身极弱) - Score < ${DM_STRENGTH_THRESHOLDS.veryWeak}`);
    dmCategory = 'weak';
  } else if (dmStrength < DM_STRENGTH_THRESHOLDS.weak) {
    reasoning.push(`   Classification: WEAK (身弱) - Score < ${DM_STRENGTH_THRESHOLDS.weak}`);
    dmCategory = 'weak';
  } else if (dmStrength <= DM_STRENGTH_THRESHOLDS.balanced) {
    reasoning.push(`   Classification: BALANCED (中和) - Score ≈ ${DM_STRENGTH_THRESHOLDS.balanced}`);
    dmCategory = 'balanced';
  } else if (dmStrength <= DM_STRENGTH_THRESHOLDS.strong) {
    reasoning.push(`   Classification: STRONG (身强) - Score > ${DM_STRENGTH_THRESHOLDS.balanced}`);
    dmCategory = 'strong';
  } else {
    reasoning.push(`   Classification: VERY STRONG (身极强) - Score > ${DM_STRENGTH_THRESHOLDS.strong}`);
    dmCategory = 'strong';
  }

  // ========================================
  // STEP 2: Check Follow Structure (overrides everything)
  // ========================================
  if (isFollow && followType) {
    reasoning.push(``);
    reasoning.push(`🌀 Follow Structure Detected: ${followType}`);
    dmCategory = 'follow';
    followInfluence = followType;

    const followRules = FOLLOW_USEFUL_GOD_RULES[followType];
    if (followRules) {
      usefulTenGods = [...followRules.useful];
      annoyingTenGods = [...followRules.annoying];
      reasoning.push(`   ${followRules.reasoning}`);

      // Convert Ten Gods to Elements
      usefulElements = Array.from(new Set(usefulTenGods.map(tg => getTenGodElement(dayMasterElement, tg))));
      annoyingElements = Array.from(new Set(annoyingTenGods.map(tg => getTenGodElement(dayMasterElement, tg))));

      reasoning.push(``);
      reasoning.push(`   ✅ Useful Elements: ${usefulElements.join(', ')}`);
      reasoning.push(`   ❌ Annoying Elements: ${annoyingElements.join(', ')}`);

      confidence = 0.9; // High confidence for follow structures
    } else {
      // Generic follow logic
      if (followElement) {
        usefulElements = [followElement];
        reasoning.push(`   Following ${followElement} element.`);
        reasoning.push(`   ✅ Useful: ${followElement}`);
        reasoning.push(`   ❌ Annoying: ${dayMasterElement} (Day Master), ${PRODUCED_BY[dayMasterElement]} (Resource)`);
        annoyingElements = [dayMasterElement, PRODUCED_BY[dayMasterElement]];
      }
    }
  }

  // ========================================
  // STEP 3: Check Special Structure
  // ========================================
  else if (isSpecialStructure && structure) {
    reasoning.push(``);
    reasoning.push(`🏛️ Special Structure Detected: ${structure}`);
    dmCategory = 'special';
    structureInfluence = structure;

    // Find matching structure rules
    let matchedRule = null;
    for (const [key, rules] of Object.entries(STRUCTURE_USEFUL_GOD_RULES)) {
      if (structure.includes(key)) {
        matchedRule = { key, ...rules };
        break;
      }
    }

    if (matchedRule) {
      usefulTenGods = [...matchedRule.useful];
      annoyingTenGods = [...matchedRule.annoying];
      reasoning.push(`   ${matchedRule.reasoning}`);

      // Convert Ten Gods to Elements
      usefulElements = Array.from(new Set(usefulTenGods.map(tg => getTenGodElement(dayMasterElement, tg))));
      annoyingElements = Array.from(new Set(annoyingTenGods.map(tg => getTenGodElement(dayMasterElement, tg))));

      reasoning.push(``);
      reasoning.push(`   ✅ Useful Ten Gods: ${usefulTenGods.join(', ')}`);
      reasoning.push(`   ❌ Annoying Ten Gods: ${annoyingTenGods.join(', ')}`);

      confidence = 0.85;
    } else {
      // Fall through to standard logic
      reasoning.push(`   No specific rules for this structure; using standard DM logic.`);
    }
  }

  // ========================================
  // STEP 4: Standard DM Strength Logic
  // ========================================
  if (usefulElements.length === 0) {
    reasoning.push(``);
    reasoning.push(`⚖️ Applying Standard DM Strength Logic:`);

    if (dmCategory === 'strong' || dmStrength > DM_STRENGTH_THRESHOLDS.balanced) {
      // Strong DM needs draining
      reasoning.push(`   Strong DM needs to be DRAINED and CONTROLLED.`);
      reasoning.push(`   Priority: Wealth (drain) → Officer (control) → Output (drain)`);

      usefulTenGods = [
        'Direct Wealth', 'Indirect Wealth',     // Wealth drains DM
        'Direct Officer', 'Seven Killings',     // Officer controls DM
        'Eating God', 'Hurting Officer'         // Output drains DM
      ];
      annoyingTenGods = [
        'Friend', 'Rob Wealth',                 // Same element adds strength
        'Direct Resource', 'Indirect Resource'  // Resource produces DM
      ];

      // Map to elements
      usefulElements = [
        CONTROL_CYCLE[dayMasterElement],        // Wealth
        CONTROLLED_BY[dayMasterElement],        // Officer
        PRODUCTION_CYCLE[dayMasterElement]      // Output
      ];
      annoyingElements = [
        dayMasterElement,                       // Same element
        PRODUCED_BY[dayMasterElement]           // Resource
      ];

    } else if (dmCategory === 'weak' || dmStrength < DM_STRENGTH_THRESHOLDS.balanced) {
      // Weak DM needs support
      reasoning.push(`   Weak DM needs SUPPORT and PRODUCTION.`);
      reasoning.push(`   Priority: Resource (produce DM) → Friend (support) → sometimes Output`);

      usefulTenGods = [
        'Direct Resource', 'Indirect Resource', // Resource produces DM
        'Friend', 'Rob Wealth'                  // Same element supports
      ];
      annoyingTenGods = [
        'Direct Wealth', 'Indirect Wealth',     // Wealth drains DM
        'Direct Officer', 'Seven Killings',     // Officer attacks DM
        'Eating God', 'Hurting Officer'         // Output drains DM
      ];

      // Map to elements
      usefulElements = [
        PRODUCED_BY[dayMasterElement],          // Resource
        dayMasterElement                        // Same element
      ];
      annoyingElements = [
        CONTROL_CYCLE[dayMasterElement],        // Wealth
        CONTROLLED_BY[dayMasterElement],        // Officer
        PRODUCTION_CYCLE[dayMasterElement]      // Output
      ];

    } else {
      // Balanced DM - context dependent
      reasoning.push(`   Balanced DM - context dependent.`);
      reasoning.push(`   Slight preference for maintaining balance.`);

      // For balanced charts, useful god depends on what's missing
      const missing = findDeficientElements(elementDistribution);
      usefulElements = missing.length > 0 ? missing : [PRODUCED_BY[dayMasterElement]];
      annoyingElements = findExcessElements(elementDistribution);

      usefulTenGods = usefulElements.flatMap(el => getElementTenGods(dayMasterElement, el));
      annoyingTenGods = annoyingElements.flatMap(el => getElementTenGods(dayMasterElement, el));

      confidence = 0.7; // Lower confidence for balanced charts
    }

    reasoning.push(``);
    reasoning.push(`   ✅ Useful Elements: ${usefulElements.join(', ')}`);
    reasoning.push(`   ❌ Annoying Elements: ${annoyingElements.join(', ')}`);
  }

  // ========================================
  // STEP 5: Calculate Priority Scores
  // ========================================
  const usefulPriority = calculatePriorityScores(
    usefulElements,
    usefulTenGods,
    dayMasterElement,
    dmStrength,
    elementDistribution,
    true
  );

  const annoyingPriority = calculatePriorityScores(
    annoyingElements,
    annoyingTenGods,
    dayMasterElement,
    dmStrength,
    elementDistribution,
    false
  );

  // ========================================
  // STEP 6: Generate Summary
  // ========================================
  const summary = generateSummary(
    dmCategory,
    usefulElements,
    annoyingElements,
    dmStrength,
    structureInfluence,
    followInfluence
  );

  return {
    usefulElements,
    usefulTenGods,
    annoyingElements,
    annoyingTenGods,
    usefulPriority,
    annoyingPriority,
    dmCategory,
    structureInfluence,
    followInfluence,
    reasoning,
    summary,
    confidence
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Find elements that are deficient in the chart
 */
function findDeficientElements(distribution: Record<ElementName, number>): ElementName[] {
  const threshold = 0.15; // Less than 15% is deficient
  return (Object.entries(distribution) as [ElementName, number][])
    .filter(([_, value]) => value < threshold)
    .map(([element]) => element);
}

/**
 * Find elements that are in excess
 */
function findExcessElements(distribution: Record<ElementName, number>): ElementName[] {
  const threshold = 0.30; // More than 30% is excess
  return (Object.entries(distribution) as [ElementName, number][])
    .filter(([_, value]) => value > threshold)
    .map(([element]) => element);
}

/**
 * Calculate priority scores for useful/annoying elements
 */
function calculatePriorityScores(
  elements: ElementName[],
  tenGods: TenGodName[],
  dayMaster: ElementName,
  dmStrength: number,
  distribution: Record<ElementName, number>,
  isUseful: boolean
): { element: ElementName; tenGod: TenGodName; score: number }[] {
  const result: { element: ElementName; tenGod: TenGodName; score: number }[] = [];

  elements.forEach((element, index) => {
    const basePriority = 1 - (index * 0.15); // First in list = highest priority
    const presenceBonus = isUseful
      ? (1 - (distribution[element] || 0)) * 0.3 // Less present = more needed
      : (distribution[element] || 0) * 0.3;      // More present = more problematic

    const relatedTenGods = getElementTenGods(dayMaster, element);
    const tenGod = relatedTenGods[0] || tenGods[index] || 'Friend';

    result.push({
      element,
      tenGod,
      score: Math.min(1, Math.max(0, basePriority + presenceBonus))
    });
  });

  return result.sort((a, b) => b.score - a.score);
}

/**
 * Generate human-readable summary
 */
function generateSummary(
  category: UsefulGodResult['dmCategory'],
  useful: ElementName[],
  annoying: ElementName[],
  strength: number,
  structure: string | null,
  follow: string | null
): string {
  const parts: string[] = [];

  if (follow) {
    parts.push(`This is a Follow Structure chart (${follow}).`);
    parts.push(`The chart has surrendered to the dominant force and should continue following ${useful[0] || 'that direction'}.`);
  } else if (structure) {
    parts.push(`This chart has a ${structure}.`);
    parts.push(`The structure determines what elements help or harm the chart.`);
  } else if (category === 'strong') {
    parts.push(`This is a Strong Day Master chart (strength: ${strength.toFixed(2)}).`);
    parts.push(`The chart needs to be drained and controlled, not strengthened further.`);
  } else if (category === 'weak') {
    parts.push(`This is a Weak Day Master chart (strength: ${strength.toFixed(2)}).`);
    parts.push(`The chart needs support and nourishment to function optimally.`);
  } else {
    parts.push(`This chart has a Balanced Day Master (strength: ${strength.toFixed(2)}).`);
    parts.push(`The goal is to maintain this equilibrium.`);
  }

  parts.push(``);
  parts.push(`Useful Elements: ${useful.join(', ') || 'None identified'}`);
  parts.push(`Annoying Elements: ${annoying.join(', ') || 'None identified'}`);

  return parts.join('\n');
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Quick check if an element is useful for this chart
 */
export function isElementUseful(
  element: ElementName,
  result: UsefulGodResult
): boolean {
  return result.usefulElements.includes(element);
}

/**
 * Quick check if an element is annoying for this chart
 */
export function isElementAnnoying(
  element: ElementName,
  result: UsefulGodResult
): boolean {
  return result.annoyingElements.includes(element);
}

/**
 * Get the priority rank of an element (1 = most useful, higher = less useful)
 * Returns 0 if not in the useful list
 */
export function getElementUsefulRank(
  element: ElementName,
  result: UsefulGodResult
): number {
  const index = result.usefulPriority.findIndex(p => p.element === element);
  return index === -1 ? 0 : index + 1;
}

/**
 * Get luck pillar favorability based on useful/annoying elements
 */
export function evaluateLuckPillarElement(
  element: ElementName,
  result: UsefulGodResult
): { favorable: boolean; score: number; reason: string } {
  if (result.usefulElements.includes(element)) {
    const priority = result.usefulPriority.find(p => p.element === element);
    return {
      favorable: true,
      score: priority?.score || 0.7,
      reason: `${element} is a Useful Element (用神) for this chart.`
    };
  }

  if (result.annoyingElements.includes(element)) {
    const priority = result.annoyingPriority.find(p => p.element === element);
    return {
      favorable: false,
      score: -(priority?.score || 0.7),
      reason: `${element} is an Annoying Element (忌神) for this chart.`
    };
  }

  return {
    favorable: true, // Neutral is slightly favorable
    score: 0.1,
    reason: `${element} is neutral for this chart.`
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeUsefulGod,
  isElementUseful,
  isElementAnnoying,
  getElementUsefulRank,
  evaluateLuckPillarElement,
  getTenGodElement,
  getElementTenGods,
  PRODUCTION_CYCLE,
  CONTROL_CYCLE,
  PRODUCED_BY,
  CONTROLLED_BY,
  STRUCTURE_USEFUL_GOD_RULES,
  FOLLOW_USEFUL_GOD_RULES,
  DM_STRENGTH_THRESHOLDS
};
