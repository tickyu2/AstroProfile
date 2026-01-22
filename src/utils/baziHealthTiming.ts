/**
 * =============================================================================
 * BAZI HEALTH TIMING ENGINE (健康应期 / 身弱应期 / 冲害刑破应期)
 * =============================================================================
 *
 * This is the most subtle timing module in BaZi. Health Timing is NOT about
 * predicting illness — it's about identifying vulnerability windows, stress
 * cycles, and body-system activation patterns based on elemental flows.
 *
 * FIVE TIMING LAYERS:
 *   1. Luck Pillar (大运) → Long-term health themes (10-year cycles)
 *   2. Annual (流年)     → Yearly health patterns
 *   3. Monthly (流月)    → Monthly vulnerability windows
 *   4. Daily (流日)      → Daily energy management
 *   5. Hourly (流时)     → Fine-grained vitality timing
 *
 * CORE PRINCIPLES:
 *   - Element imbalance → Body system stress
 *   - DM weakness + draining elements → Vulnerability windows
 *   - Conflicts (冲害刑破) → Acute stress triggers
 *   - Health Shen Sha → Special vulnerability markers
 *   - Useful God support → Recovery and resilience
 *
 * ELEMENT-BODY SYSTEM MAPPING (Traditional Chinese Medicine):
 *   - Wood (木) → Liver, Gallbladder, Eyes, Tendons, Nails
 *   - Fire (火) → Heart, Small Intestine, Tongue, Blood Vessels
 *   - Earth (土) → Spleen, Stomach, Mouth, Muscles, Flesh
 *   - Metal (金) → Lungs, Large Intestine, Nose, Skin, Body Hair
 *   - Water (水) → Kidneys, Bladder, Ears, Bones, Head Hair
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

export type DMStrength = 'strong' | 'neutral' | 'weak';

export interface TimingPillar {
  stem: StemName;
  branch: BranchName;
}

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

export interface BodySystem {
  element: ElementName;
  name: string;
  organs: string[];
  sensoryOrgan: string;
  tissue: string;
  emotion: string;
  season: string;
}

export interface HealthVulnerability {
  system: BodySystem;
  severity: 'high' | 'moderate' | 'low';
  type: 'excess' | 'deficiency' | 'clash' | 'drain';
  description: string;
}

export interface HealthShenShaResult {
  name: string;
  chinese: string;
  present: boolean;
  impact: 'healing' | 'vulnerability' | 'caution';
  description: string;
  bonus: number;
}

export interface ConflictHealthImpact {
  type: 'clash' | 'harm' | 'punishment' | 'destruction';
  chinese: string;
  elements: [BranchName, BranchName];
  affectedSystems: BodySystem[];
  severity: number;
  description: string;
}

export interface DMHealthAnalysis {
  dmElement: ElementName;
  strength: DMStrength;
  supportElements: ElementName[];
  drainElements: ElementName[];
  vulnerableToExcess: ElementName[];
  vulnerableToDeficiency: ElementName[];
}

export type HealthTier = 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';

export interface HealthTimingResult {
  timingPillar: TimingPillar;
  score: number;
  tier: HealthTier;
  dmAnalysis: DMHealthAnalysis;
  vulnerabilities: HealthVulnerability[];
  conflicts: ConflictHealthImpact[];
  shensha: HealthShenShaResult[];
  transformations: TransformationHealthEffect[];
  usefulGodAlignment: UsefulGodHealthResult;
  recommendations: string[];
  narrative: string;
}

export interface TransformationHealthEffect {
  type: 'liuhe' | 'sanhe' | 'sanhui' | 'stem_combo';
  branches?: [BranchName, BranchName] | [BranchName, BranchName, BranchName];
  stems?: [StemName, StemName];
  resultElement: ElementName;
  healthImpact: 'beneficial' | 'neutral' | 'stressful';
  affectedSystem: BodySystem;
  description: string;
  bonus: number;
}

export interface UsefulGodHealthResult {
  usefulGod: ElementName | null;
  annoyingGod: ElementName | null;
  usefulGodPresent: boolean;
  annoyingGodPresent: boolean;
  supportScore: number;
  description: string;
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

// ─────────────────────────────────────────────────────────────────────────────
// BODY SYSTEM DEFINITIONS (TCM Five Element Theory)
// ─────────────────────────────────────────────────────────────────────────────

export const BODY_SYSTEMS: Record<ElementName, BodySystem> = {
  Wood: {
    element: 'Wood',
    name: 'Hepatobiliary System',
    organs: ['Liver', 'Gallbladder'],
    sensoryOrgan: 'Eyes',
    tissue: 'Tendons, Ligaments, Nails',
    emotion: 'Anger, Frustration',
    season: 'Spring'
  },
  Fire: {
    element: 'Fire',
    name: 'Cardiovascular System',
    organs: ['Heart', 'Small Intestine', 'Pericardium', 'Triple Burner'],
    sensoryOrgan: 'Tongue',
    tissue: 'Blood Vessels',
    emotion: 'Joy, Anxiety',
    season: 'Summer'
  },
  Earth: {
    element: 'Earth',
    name: 'Digestive System',
    organs: ['Spleen', 'Stomach'],
    sensoryOrgan: 'Mouth, Lips',
    tissue: 'Muscles, Flesh',
    emotion: 'Worry, Overthinking',
    season: 'Late Summer'
  },
  Metal: {
    element: 'Metal',
    name: 'Respiratory System',
    organs: ['Lungs', 'Large Intestine'],
    sensoryOrgan: 'Nose',
    tissue: 'Skin, Body Hair',
    emotion: 'Grief, Sadness',
    season: 'Autumn'
  },
  Water: {
    element: 'Water',
    name: 'Urogenital System',
    organs: ['Kidneys', 'Bladder'],
    sensoryOrgan: 'Ears',
    tissue: 'Bones, Head Hair, Teeth',
    emotion: 'Fear, Willpower',
    season: 'Winter'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ELEMENT CYCLE RELATIONSHIPS
// ─────────────────────────────────────────────────────────────────────────────

// Production cycle: Wood → Fire → Earth → Metal → Water → Wood
export const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood'
};

// Control cycle: Wood → Earth → Water → Fire → Metal → Wood
export const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth',
  Fire: 'Metal',
  Earth: 'Water',
  Metal: 'Wood',
  Water: 'Fire'
};

// What drains each element (reverse of production)
export const ELEMENT_DRAINED_BY: Record<ElementName, ElementName> = {
  Wood: 'Fire',    // Wood feeds Fire, so Fire drains Wood
  Fire: 'Earth',   // Fire creates Earth, so Earth drains Fire
  Earth: 'Metal',  // Earth creates Metal, so Metal drains Earth
  Metal: 'Water',  // Metal creates Water, so Water drains Metal
  Water: 'Wood'    // Water feeds Wood, so Wood drains Water
};

// What supports each element (reverse of production)
export const ELEMENT_SUPPORTED_BY: Record<ElementName, ElementName> = {
  Wood: 'Water',
  Fire: 'Wood',
  Earth: 'Fire',
  Metal: 'Earth',
  Water: 'Metal'
};

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH SHEN SHA MAPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 天医 (Heavenly Doctor) - Healing star, positive for recovery
 * Based on Year Branch
 */
export const HEAVENLY_DOCTOR_MAP: Record<string, string> = {
  '子': '亥', '丑': '子', '寅': '丑', '卯': '寅',
  '辰': '卯', '巳': '辰', '午': '巳', '未': '午',
  '申': '未', '酉': '申', '戌': '酉', '亥': '戌'
};

/**
 * 灾煞 (Disaster Sha) - Vulnerability to accidents/illness
 * Based on Year Branch (三合局 clockwise one position from opposite)
 */
export const DISASTER_SHA_MAP: Record<string, string> = {
  '申': '午', '子': '午', '辰': '午',  // Water frame → Fire
  '寅': '子', '午': '子', '戌': '子',  // Fire frame → Water
  '亥': '酉', '卯': '酉', '未': '酉',  // Wood frame → Metal
  '巳': '卯', '酉': '卯', '丑': '卯'   // Metal frame → Wood
};

/**
 * 亡神 (Death Spirit) - Energy depletion marker
 * Based on Year Branch
 */
export const DEATH_SPIRIT_MAP: Record<string, string> = {
  '申': '亥', '子': '亥', '辰': '亥',  // Water frame
  '寅': '巳', '午': '巳', '戌': '巳',  // Fire frame
  '亥': '寅', '卯': '寅', '未': '寅',  // Wood frame
  '巳': '申', '酉': '申', '丑': '申'   // Metal frame
};

/**
 * 劫煞 (Robbery Sha) - Stress and pressure indicator
 * Based on Year Branch (三合局 opposite corner)
 */
export const ROBBERY_SHA_MAP: Record<string, string> = {
  '申': '巳', '子': '巳', '辰': '巳',  // Water frame
  '寅': '亥', '午': '亥', '戌': '亥',  // Fire frame
  '亥': '申', '卯': '申', '未': '申',  // Wood frame
  '巳': '寅', '酉': '寅', '丑': '寅'   // Metal frame
};

/**
 * 天罗地网 (Sky Net Earth Trap) - Entanglement, chronic issues
 * 天罗: 戌 for Fire DM (丙丁)
 * 地网: 辰 for Water DM (壬癸)
 */
export const SKY_NET_STEMS: string[] = ['丙', '丁'];
export const EARTH_TRAP_STEMS: string[] = ['壬', '癸'];
export const SKY_NET_BRANCH = '戌';
export const EARTH_TRAP_BRANCH = '辰';

// ─────────────────────────────────────────────────────────────────────────────
// CONFLICT DEFINITIONS (冲害刑破)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Six Clashes (六冲) - Direct opposition, acute stress
 */
export const SIX_CLASHES: Array<[string, string]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
];

/**
 * Six Harms (六害) - Undermining, chronic stress
 */
export const SIX_HARMS: Array<[string, string]> = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌']
];

/**
 * Punishments (刑) - Self-destructive patterns
 */
export const PUNISHMENTS: Array<[string, string]> = [
  // Uncivilized punishment (无礼之刑)
  ['子', '卯'], ['卯', '子'],
  // Bullying punishment (恃势之刑)
  ['寅', '巳'], ['巳', '申'], ['申', '寅'],
  // Ungrateful punishment (无恩之刑)
  ['丑', '戌'], ['戌', '未'], ['未', '丑'],
  // Self-punishment (自刑)
  ['辰', '辰'], ['午', '午'], ['酉', '酉'], ['亥', '亥']
];

/**
 * Destructions (破) - Breaking apart, disruption
 */
export const DESTRUCTIONS: Array<[string, string]> = [
  ['子', '酉'], ['酉', '子'],
  ['丑', '辰'], ['辰', '丑'],
  ['寅', '亥'], ['亥', '寅'],
  ['卯', '午'], ['午', '卯'],
  ['巳', '申'], ['申', '巳'],
  ['未', '戌'], ['戌', '未']
];

// Conflict severity scores (negative impact on health)
export const CONFLICT_SEVERITY: Record<string, number> = {
  destruction: -18,
  clash: -15,
  punishment: -12,
  harm: -10
};

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFORMATION MAPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 六合 (Six Combinations) - Harmonizing pairs
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
 * 三合 (Three Combinations) - Elemental frames
 * Note: Earth doesn't have a traditional 三合 frame
 */
export const SANHE_FRAMES: Partial<Record<ElementName, [string, string, string]>> = {
  Water: ['申', '子', '辰'],
  Wood: ['亥', '卯', '未'],
  Fire: ['寅', '午', '戌'],
  Metal: ['巳', '酉', '丑']
};

/**
 * 三会 (Seasonal Combinations) - Directional gatherings
 * Note: Earth is represented in late summer but has no pure 三会
 */
export const SANHUI_SEASONS: Partial<Record<ElementName, [string, string, string]>> = {
  Wood: ['寅', '卯', '辰'],   // East / Spring
  Fire: ['巳', '午', '未'],   // South / Summer
  Metal: ['申', '酉', '戌'],  // West / Autumn
  Water: ['亥', '子', '丑']   // North / Winter
};

/**
 * Stem Combinations (天干合)
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

// ─────────────────────────────────────────────────────────────────────────────
// CORE ANALYSIS FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze Day Master health profile
 */
export function analyzeDMHealth(
  dayStem: StemName,
  dmStrength: DMStrength
): DMHealthAnalysis {
  const dmElement = STEM_ELEMENT[dayStem];

  // Elements that support DM (same element + resource)
  const supportElements: ElementName[] = [
    dmElement,
    ELEMENT_SUPPORTED_BY[dmElement]
  ];

  // Elements that drain DM (output + wealth)
  const drainElements: ElementName[] = [
    ELEMENT_PRODUCES[dmElement],           // Output drains
    ELEMENT_CONTROLS[dmElement]            // Wealth drains (DM controls it)
  ];

  // Vulnerability patterns based on DM strength
  let vulnerableToExcess: ElementName[] = [];
  let vulnerableToDeficiency: ElementName[] = [];

  if (dmStrength === 'weak') {
    // Weak DM is vulnerable to controlling element (Officer/Killings)
    // and to excessive output/wealth drain
    const controllingElement = Object.entries(ELEMENT_CONTROLS)
      .find(([_, controlled]) => controlled === dmElement)?.[0] as ElementName;
    if (controllingElement) {
      vulnerableToExcess = [controllingElement, ...drainElements];
    }
    vulnerableToDeficiency = [dmElement, ELEMENT_SUPPORTED_BY[dmElement]];
  } else if (dmStrength === 'strong') {
    // Strong DM needs outlet, vulnerable to stagnation
    vulnerableToExcess = [dmElement, ELEMENT_SUPPORTED_BY[dmElement]];
    vulnerableToDeficiency = drainElements;
  } else {
    // Neutral - moderate vulnerability across the board
    vulnerableToExcess = [];
    vulnerableToDeficiency = [];
  }

  return {
    dmElement,
    strength: dmStrength,
    supportElements,
    drainElements,
    vulnerableToExcess,
    vulnerableToDeficiency
  };
}

/**
 * Detect health vulnerabilities from timing pillar
 */
export function detectHealthVulnerabilities(
  timingPillar: TimingPillar,
  dmAnalysis: DMHealthAnalysis,
  _natalPillars: NatalPillarsInput
): HealthVulnerability[] {
  const vulnerabilities: HealthVulnerability[] = [];

  const timingStemElement = STEM_ELEMENT[timingPillar.stem];
  const timingBranchElement = BRANCH_ELEMENT[timingPillar.branch];

  // Check for excess patterns (too much of an element)
  for (const element of dmAnalysis.vulnerableToExcess) {
    if (timingStemElement === element || timingBranchElement === element) {
      vulnerabilities.push({
        system: BODY_SYSTEMS[element],
        severity: dmAnalysis.strength === 'weak' ? 'high' : 'moderate',
        type: 'excess',
        description: `Excess ${element} energy may stress the ${BODY_SYSTEMS[element].name}. ` +
          `Watch for ${BODY_SYSTEMS[element].emotion.toLowerCase()} and ${BODY_SYSTEMS[element].organs.join(', ')} issues.`
      });
    }
  }

  // Check for deficiency patterns
  for (const element of dmAnalysis.vulnerableToDeficiency) {
    // Deficiency occurs when the element is being controlled/drained
    const controllingElement = Object.entries(ELEMENT_CONTROLS)
      .find(([_, controlled]) => controlled === element)?.[0] as ElementName;

    if (controllingElement && (timingStemElement === controllingElement || timingBranchElement === controllingElement)) {
      vulnerabilities.push({
        system: BODY_SYSTEMS[element],
        severity: dmAnalysis.strength === 'weak' ? 'high' : 'moderate',
        type: 'deficiency',
        description: `${element} may be depleted by strong ${controllingElement}. ` +
          `Support the ${BODY_SYSTEMS[element].name} with rest and nourishment.`
      });
    }
  }

  // Check for drain on DM element
  if (dmAnalysis.drainElements.includes(timingStemElement) ||
      dmAnalysis.drainElements.includes(timingBranchElement)) {
    if (dmAnalysis.strength === 'weak') {
      vulnerabilities.push({
        system: BODY_SYSTEMS[dmAnalysis.dmElement],
        severity: 'high',
        type: 'drain',
        description: `Energy drain on weak Day Master. Conserve vitality, avoid overexertion. ` +
          `The ${BODY_SYSTEMS[dmAnalysis.dmElement].name} needs extra support.`
      });
    }
  }

  return vulnerabilities;
}

/**
 * Detect health-related conflicts between timing and natal pillars
 */
export function detectHealthConflicts(
  timingPillar: TimingPillar,
  natalPillars: NatalPillarsInput
): ConflictHealthImpact[] {
  const conflicts: ConflictHealthImpact[] = [];
  const timingBranch = timingPillar.branch;

  const natalBranches = [
    natalPillars.yearBranch,
    natalPillars.monthBranch,
    natalPillars.dayBranch,
    natalPillars.hourBranch
  ];

  for (const natalBranch of natalBranches) {
    // Check Destructions (most severe for health)
    for (const [b1, b2] of DESTRUCTIONS) {
      if ((timingBranch === b1 && natalBranch === b2) ||
          (timingBranch === b2 && natalBranch === b1)) {
        const element1 = BRANCH_ELEMENT[b1];
        const element2 = BRANCH_ELEMENT[b2];
        conflicts.push({
          type: 'destruction',
          chinese: '破',
          elements: [b1 as BranchName, b2 as BranchName],
          affectedSystems: [BODY_SYSTEMS[element1], BODY_SYSTEMS[element2]],
          severity: Math.abs(CONFLICT_SEVERITY.destruction),
          description: `Destruction (破) between ${b1} and ${b2} creates disruptive energy. ` +
            `Both ${BODY_SYSTEMS[element1].name} and ${BODY_SYSTEMS[element2].name} may be affected.`
        });
      }
    }

    // Check Clashes
    for (const [b1, b2] of SIX_CLASHES) {
      if ((timingBranch === b1 && natalBranch === b2) ||
          (timingBranch === b2 && natalBranch === b1)) {
        const element1 = BRANCH_ELEMENT[b1];
        const element2 = BRANCH_ELEMENT[b2];
        conflicts.push({
          type: 'clash',
          chinese: '冲',
          elements: [b1 as BranchName, b2 as BranchName],
          affectedSystems: [BODY_SYSTEMS[element1], BODY_SYSTEMS[element2]],
          severity: Math.abs(CONFLICT_SEVERITY.clash),
          description: `Clash (冲) between ${b1} and ${b2} creates acute stress. ` +
            `Watch ${BODY_SYSTEMS[element1].organs[0]} and ${BODY_SYSTEMS[element2].organs[0]}.`
        });
      }
    }

    // Check Punishments
    for (const [b1, b2] of PUNISHMENTS) {
      if ((timingBranch === b1 && natalBranch === b2)) {
        const element = BRANCH_ELEMENT[b1];
        conflicts.push({
          type: 'punishment',
          chinese: '刑',
          elements: [b1 as BranchName, b2 as BranchName],
          affectedSystems: [BODY_SYSTEMS[element]],
          severity: Math.abs(CONFLICT_SEVERITY.punishment),
          description: `Punishment (刑) involving ${b1}-${b2} indicates self-destructive stress patterns. ` +
            `Mind your ${BODY_SYSTEMS[element].emotion.toLowerCase()} and ${BODY_SYSTEMS[element].organs[0]} health.`
        });
      }
    }

    // Check Harms
    for (const [b1, b2] of SIX_HARMS) {
      if ((timingBranch === b1 && natalBranch === b2) ||
          (timingBranch === b2 && natalBranch === b1)) {
        const element1 = BRANCH_ELEMENT[b1];
        const element2 = BRANCH_ELEMENT[b2];
        conflicts.push({
          type: 'harm',
          chinese: '害',
          elements: [b1 as BranchName, b2 as BranchName],
          affectedSystems: [BODY_SYSTEMS[element1], BODY_SYSTEMS[element2]],
          severity: Math.abs(CONFLICT_SEVERITY.harm),
          description: `Harm (害) between ${b1} and ${b2} creates undermining stress. ` +
            `Chronic issues may surface in ${BODY_SYSTEMS[element1].name} or ${BODY_SYSTEMS[element2].name}.`
        });
      }
    }
  }

  // Remove duplicates
  const unique = conflicts.filter((conflict, index, self) =>
    index === self.findIndex(c =>
      c.type === conflict.type &&
      c.elements[0] === conflict.elements[0] &&
      c.elements[1] === conflict.elements[1]
    )
  );

  return unique;
}

/**
 * Detect health-related Shen Sha
 */
export function detectHealthShensha(
  timingPillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  dayStem: StemName
): HealthShenShaResult[] {
  const results: HealthShenShaResult[] = [];
  const yearBranch = natalPillars.yearBranch;
  const timingBranch = timingPillar.branch;

  // 天医 (Heavenly Doctor) - Healing star
  const heavenlyDoctor = HEAVENLY_DOCTOR_MAP[yearBranch];
  if (timingBranch === heavenlyDoctor) {
    results.push({
      name: 'Heavenly Doctor',
      chinese: '天医',
      present: true,
      impact: 'healing',
      description: 'Healing energy is strong. Good time for medical treatments, recovery, and health improvements.',
      bonus: 12
    });
  }

  // 灾煞 (Disaster Sha) - Vulnerability marker
  const disasterSha = DISASTER_SHA_MAP[yearBranch];
  if (timingBranch === disasterSha) {
    results.push({
      name: 'Disaster Sha',
      chinese: '灾煞',
      present: true,
      impact: 'vulnerability',
      description: 'Increased vulnerability to accidents and illness. Exercise caution and avoid risky activities.',
      bonus: -15
    });
  }

  // 亡神 (Death Spirit) - Energy depletion
  const deathSpirit = DEATH_SPIRIT_MAP[yearBranch];
  if (timingBranch === deathSpirit) {
    results.push({
      name: 'Death Spirit',
      chinese: '亡神',
      present: true,
      impact: 'vulnerability',
      description: 'Energy depletion marker active. Conserve strength, prioritize rest, avoid overcommitment.',
      bonus: -12
    });
  }

  // 劫煞 (Robbery Sha) - Stress indicator
  const robberySha = ROBBERY_SHA_MAP[yearBranch];
  if (timingBranch === robberySha) {
    results.push({
      name: 'Robbery Sha',
      chinese: '劫煞',
      present: true,
      impact: 'caution',
      description: 'Heightened stress and pressure. Guard against burnout and external stressors.',
      bonus: -10
    });
  }

  // 天罗地网 (Sky Net / Earth Trap) - Entanglement
  if (SKY_NET_STEMS.includes(dayStem) && timingBranch === SKY_NET_BRANCH) {
    results.push({
      name: 'Sky Net',
      chinese: '天罗',
      present: true,
      impact: 'caution',
      description: 'Fire DM encounters entanglement. Chronic issues may surface. Seek clarity and avoid complications.',
      bonus: -8
    });
  }

  if (EARTH_TRAP_STEMS.includes(dayStem) && timingBranch === EARTH_TRAP_BRANCH) {
    results.push({
      name: 'Earth Trap',
      chinese: '地网',
      present: true,
      impact: 'caution',
      description: 'Water DM encounters restriction. Hidden health issues may emerge. Time for thorough check-ups.',
      bonus: -8
    });
  }

  return results;
}

/**
 * Detect health effects from transformations
 */
export function detectHealthTransformations(
  timingPillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  dmAnalysis: DMHealthAnalysis
): TransformationHealthEffect[] {
  const effects: TransformationHealthEffect[] = [];
  const timingBranch = timingPillar.branch;
  const timingStem = timingPillar.stem;

  const natalBranches = [
    natalPillars.yearBranch,
    natalPillars.monthBranch,
    natalPillars.dayBranch,
    natalPillars.hourBranch
  ];

  const natalStems = [
    natalPillars.yearStem,
    natalPillars.monthStem,
    natalPillars.dayStem,
    natalPillars.hourStem
  ];

  // Check 六合 (Liu He) combinations
  const liuheInfo = LIUHE_COMBINATIONS[timingBranch];
  if (liuheInfo && natalBranches.includes(liuheInfo.partner as BranchName)) {
    const resultElement = liuheInfo.result;
    const isSupporting = dmAnalysis.supportElements.includes(resultElement);
    const isDraining = dmAnalysis.drainElements.includes(resultElement);

    let healthImpact: 'beneficial' | 'neutral' | 'stressful';
    let bonus: number;

    if (isSupporting) {
      healthImpact = 'beneficial';
      bonus = 10;
    } else if (isDraining && dmAnalysis.strength === 'weak') {
      healthImpact = 'stressful';
      bonus = -8;
    } else {
      healthImpact = 'neutral';
      bonus = 0;
    }

    effects.push({
      type: 'liuhe',
      branches: [timingBranch, liuheInfo.partner as BranchName],
      resultElement,
      healthImpact,
      affectedSystem: BODY_SYSTEMS[resultElement],
      description: `Six Combination (六合) produces ${resultElement}. ` +
        `${healthImpact === 'beneficial' ? 'Supports' : healthImpact === 'stressful' ? 'May stress' : 'Activates'} ` +
        `the ${BODY_SYSTEMS[resultElement].name}.`,
      bonus
    });
  }

  // Check 三合 (San He) frames
  for (const [element, frame] of Object.entries(SANHE_FRAMES)) {
    const matchingBranches = frame.filter(b =>
      natalBranches.includes(b as BranchName) || b === timingBranch
    );

    if (matchingBranches.length >= 2 && matchingBranches.includes(timingBranch)) {
      const resultElement = element as ElementName;
      const isSupporting = dmAnalysis.supportElements.includes(resultElement);
      const isDraining = dmAnalysis.drainElements.includes(resultElement);

      let healthImpact: 'beneficial' | 'neutral' | 'stressful';
      let bonus: number;

      if (isSupporting) {
        healthImpact = 'beneficial';
        bonus = matchingBranches.length === 3 ? 15 : 8;
      } else if (isDraining && dmAnalysis.strength === 'weak') {
        healthImpact = 'stressful';
        bonus = matchingBranches.length === 3 ? -12 : -6;
      } else {
        healthImpact = 'neutral';
        bonus = 0;
      }

      effects.push({
        type: 'sanhe',
        branches: matchingBranches.slice(0, 3) as [BranchName, BranchName, BranchName],
        resultElement,
        healthImpact,
        affectedSystem: BODY_SYSTEMS[resultElement],
        description: `Three Combination (三合) ${matchingBranches.length === 3 ? 'complete' : 'partial'} ` +
          `forms ${resultElement} frame. ${BODY_SYSTEMS[resultElement].name} is ${healthImpact === 'beneficial' ? 'strengthened' : healthImpact === 'stressful' ? 'overactivated' : 'activated'}.`,
        bonus
      });
    }
  }

  // Check Stem Combinations
  const stemComboInfo = STEM_COMBINATIONS[timingStem];
  if (stemComboInfo && natalStems.includes(stemComboInfo.partner as StemName)) {
    const resultElement = stemComboInfo.result;
    const isSupporting = dmAnalysis.supportElements.includes(resultElement);

    effects.push({
      type: 'stem_combo',
      stems: [timingStem, stemComboInfo.partner as StemName],
      resultElement,
      healthImpact: isSupporting ? 'beneficial' : 'neutral',
      affectedSystem: BODY_SYSTEMS[resultElement],
      description: `Stem combination produces ${resultElement}. ` +
        `${BODY_SYSTEMS[resultElement].name} receives ${isSupporting ? 'supportive' : 'neutral'} energy.`,
      bonus: isSupporting ? 8 : 0
    });
  }

  return effects;
}

/**
 * Analyze Useful God alignment for health
 */
export function analyzeUsefulGodHealth(
  timingPillar: TimingPillar,
  usefulGod: ElementName | null,
  annoyingGod: ElementName | null
): UsefulGodHealthResult {
  const timingStemElement = STEM_ELEMENT[timingPillar.stem];
  const timingBranchElement = BRANCH_ELEMENT[timingPillar.branch];

  const usefulGodPresent = usefulGod !== null &&
    (timingStemElement === usefulGod || timingBranchElement === usefulGod);

  const annoyingGodPresent = annoyingGod !== null &&
    (timingStemElement === annoyingGod || timingBranchElement === annoyingGod);

  let supportScore = 0;
  let description = '';

  if (usefulGodPresent && !annoyingGodPresent) {
    supportScore = 15;
    description = `Useful God (${usefulGod}) present - excellent for recovery and vitality. ` +
      `The body's natural healing is enhanced.`;
  } else if (annoyingGodPresent && !usefulGodPresent) {
    supportScore = -15;
    description = `Annoying God (${annoyingGod}) present - vulnerability window. ` +
      `Extra care needed for health and energy management.`;
  } else if (usefulGodPresent && annoyingGodPresent) {
    supportScore = 0;
    description = `Both Useful and Annoying Gods present - mixed energy. ` +
      `Balance is key; don't overexert but don't stagnate either.`;
  } else {
    supportScore = 0;
    description = 'Neutral timing for health. Maintain regular wellness practices.';
  }

  return {
    usefulGod,
    annoyingGod,
    usefulGodPresent,
    annoyingGodPresent,
    supportScore,
    description
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORING AND TIER CALCULATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate health score from all factors
 */
export function calculateHealthScore(
  vulnerabilities: HealthVulnerability[],
  conflicts: ConflictHealthImpact[],
  shensha: HealthShenShaResult[],
  transformations: TransformationHealthEffect[],
  usefulGodResult: UsefulGodHealthResult,
  dmStrength: DMStrength
): number {
  let score = 50; // Base score

  // Vulnerability penalties
  for (const vuln of vulnerabilities) {
    if (vuln.severity === 'high') score -= 15;
    else if (vuln.severity === 'moderate') score -= 10;
    else score -= 5;
  }

  // Conflict penalties
  for (const conflict of conflicts) {
    if (conflict.type === 'destruction') score += CONFLICT_SEVERITY.destruction;
    else if (conflict.type === 'clash') score += CONFLICT_SEVERITY.clash;
    else if (conflict.type === 'punishment') score += CONFLICT_SEVERITY.punishment;
    else if (conflict.type === 'harm') score += CONFLICT_SEVERITY.harm;
  }

  // Shen Sha bonuses/penalties
  for (const sha of shensha) {
    score += sha.bonus;
  }

  // Transformation effects
  for (const trans of transformations) {
    score += trans.bonus;
  }

  // Useful God alignment
  score += usefulGodResult.supportScore;

  // DM strength modifier
  if (dmStrength === 'strong') {
    score += 5; // Strong DM has more resilience
  } else if (dmStrength === 'weak') {
    score -= 5; // Weak DM is more vulnerable
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Determine health tier from score
 */
export function getHealthTier(score: number): HealthTier {
  if (score >= 75) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'neutral';
  if (score >= 25) return 'challenging';
  return 'difficult';
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATION GENERATORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate health recommendations based on analysis
 */
export function generateHealthRecommendations(
  tier: HealthTier,
  vulnerabilities: HealthVulnerability[],
  conflicts: ConflictHealthImpact[],
  shensha: HealthShenShaResult[],
  dmAnalysis: DMHealthAnalysis
): string[] {
  const recommendations: string[] = [];

  // Tier-based general recommendations
  switch (tier) {
    case 'excellent':
      recommendations.push('Optimal time for physical activities and health improvements.');
      recommendations.push('Good period for starting new fitness routines or treatments.');
      break;
    case 'good':
      recommendations.push('Favorable conditions for maintaining health practices.');
      recommendations.push('Moderate exercise and balanced diet are well-supported.');
      break;
    case 'neutral':
      recommendations.push('Maintain regular health routines without major changes.');
      recommendations.push('Listen to your body and adjust activities accordingly.');
      break;
    case 'challenging':
      recommendations.push('Take extra precautions with health. Avoid overexertion.');
      recommendations.push('Prioritize rest and stress management.');
      break;
    case 'difficult':
      recommendations.push('Vulnerability window - minimize stress and risky activities.');
      recommendations.push('Focus on rest, recovery, and preventive care.');
      recommendations.push('Consider postponing demanding physical activities.');
      break;
  }

  // Vulnerability-specific recommendations
  for (const vuln of vulnerabilities) {
    if (vuln.severity === 'high') {
      recommendations.push(`Support your ${vuln.system.name} with appropriate nutrition and rest.`);
      if (vuln.type === 'excess') {
        recommendations.push(`Calm ${vuln.system.emotion.split(',')[0].toLowerCase()} through mindfulness or gentle exercise.`);
      }
    }
  }

  // Conflict-specific recommendations
  if (conflicts.some(c => c.type === 'clash')) {
    recommendations.push('Be cautious of sudden changes or accidents. Stay grounded.');
  }
  if (conflicts.some(c => c.type === 'punishment')) {
    recommendations.push('Watch for self-sabotaging patterns. Practice self-compassion.');
  }

  // Shen Sha recommendations
  for (const sha of shensha) {
    if (sha.name === 'Heavenly Doctor') {
      recommendations.push('Excellent time for medical consultations or healing treatments.');
    }
    if (sha.name === 'Disaster Sha') {
      recommendations.push('Extra caution with travel and physical activities.');
    }
    if (sha.name === 'Death Spirit') {
      recommendations.push('Prioritize sleep and energy conservation.');
    }
  }

  // DM strength recommendations
  if (dmAnalysis.strength === 'weak') {
    recommendations.push(`Strengthen with ${dmAnalysis.supportElements.join(' and ')} element activities.`);
  }

  return recommendations.slice(0, 5); // Limit to 5 recommendations
}

/**
 * Build health narrative
 */
export function buildHealthNarrative(
  tier: HealthTier,
  vulnerabilities: HealthVulnerability[],
  conflicts: ConflictHealthImpact[],
  shensha: HealthShenShaResult[],
  transformations: TransformationHealthEffect[],
  usefulGodResult: UsefulGodHealthResult,
  _dmAnalysis: DMHealthAnalysis
): string {
  const parts: string[] = [];

  // Opening based on tier
  switch (tier) {
    case 'excellent':
      parts.push('This timing brings excellent health energy.');
      break;
    case 'good':
      parts.push('Health conditions are favorable during this period.');
      break;
    case 'neutral':
      parts.push('Health energy is stable with no major concerns.');
      break;
    case 'challenging':
      parts.push('This period requires extra attention to health.');
      break;
    case 'difficult':
      parts.push('A challenging health window - prioritize self-care.');
      break;
  }

  // Vulnerabilities
  if (vulnerabilities.length > 0) {
    const systems = vulnerabilities.map(v => v.system.name).join(', ');
    parts.push(`Watch the ${systems}.`);
  }

  // Conflicts
  if (conflicts.length > 0) {
    const conflictTypes = Array.from(new Set(conflicts.map(c => c.chinese))).join(', ');
    parts.push(`Conflicts (${conflictTypes}) may create stress.`);
  }

  // Positive Shen Sha
  const healingShensha = shensha.filter(s => s.impact === 'healing');
  if (healingShensha.length > 0) {
    parts.push(`${healingShensha[0].chinese} (${healingShensha[0].name}) supports healing.`);
  }

  // Negative Shen Sha
  const warningShensha = shensha.filter(s => s.impact === 'vulnerability');
  if (warningShensha.length > 0) {
    parts.push(`${warningShensha.map(s => s.chinese).join(', ')} present - stay cautious.`);
  }

  // Useful God
  if (usefulGodResult.usefulGodPresent) {
    parts.push(`Useful God (${usefulGodResult.usefulGod}) enhances vitality.`);
  }
  if (usefulGodResult.annoyingGodPresent) {
    parts.push(`Annoying God (${usefulGodResult.annoyingGod}) may drain energy.`);
  }

  // Beneficial transformations
  const beneficialTrans = transformations.filter(t => t.healthImpact === 'beneficial');
  if (beneficialTrans.length > 0) {
    parts.push(`${beneficialTrans[0].type === 'liuhe' ? 'Six Combination' : 'Transformation'} supports the ${beneficialTrans[0].affectedSystem.name}.`);
  }

  return parts.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TIMING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute health timing for a Luck Pillar (大运健康)
 */
export function computeHealthLuckPillarTiming(
  luckPillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  usefulGod: ElementName | null = null,
  annoyingGod: ElementName | null = null
): HealthTimingResult {
  const dmAnalysis = analyzeDMHealth(natalPillars.dayStem, dmStrength);
  const vulnerabilities = detectHealthVulnerabilities(luckPillar, dmAnalysis, natalPillars);
  const conflicts = detectHealthConflicts(luckPillar, natalPillars);
  const shensha = detectHealthShensha(luckPillar, natalPillars, natalPillars.dayStem);
  const transformations = detectHealthTransformations(luckPillar, natalPillars, dmAnalysis);
  const usefulGodResult = analyzeUsefulGodHealth(luckPillar, usefulGod, annoyingGod);

  const score = calculateHealthScore(vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmStrength);
  const tier = getHealthTier(score);
  const recommendations = generateHealthRecommendations(tier, vulnerabilities, conflicts, shensha, dmAnalysis);
  const narrative = buildHealthNarrative(tier, vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmAnalysis);

  return {
    timingPillar: luckPillar,
    score,
    tier,
    dmAnalysis,
    vulnerabilities,
    conflicts,
    shensha,
    transformations,
    usefulGodAlignment: usefulGodResult,
    recommendations,
    narrative
  };
}

/**
 * Compute health timing for a year (流年健康)
 */
export function computeHealthYearlyTiming(
  yearPillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  usefulGod: ElementName | null = null,
  annoyingGod: ElementName | null = null
): HealthTimingResult {
  const dmAnalysis = analyzeDMHealth(natalPillars.dayStem, dmStrength);
  const vulnerabilities = detectHealthVulnerabilities(yearPillar, dmAnalysis, natalPillars);
  const conflicts = detectHealthConflicts(yearPillar, natalPillars);
  const shensha = detectHealthShensha(yearPillar, natalPillars, natalPillars.dayStem);
  const transformations = detectHealthTransformations(yearPillar, natalPillars, dmAnalysis);
  const usefulGodResult = analyzeUsefulGodHealth(yearPillar, usefulGod, annoyingGod);

  const score = calculateHealthScore(vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmStrength);
  const tier = getHealthTier(score);
  const recommendations = generateHealthRecommendations(tier, vulnerabilities, conflicts, shensha, dmAnalysis);
  const narrative = buildHealthNarrative(tier, vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmAnalysis);

  return {
    timingPillar: yearPillar,
    score,
    tier,
    dmAnalysis,
    vulnerabilities,
    conflicts,
    shensha,
    transformations,
    usefulGodAlignment: usefulGodResult,
    recommendations,
    narrative
  };
}

/**
 * Compute health timing for a month (流月健康)
 */
export function computeHealthMonthlyTiming(
  monthPillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  usefulGod: ElementName | null = null,
  annoyingGod: ElementName | null = null
): HealthTimingResult {
  const dmAnalysis = analyzeDMHealth(natalPillars.dayStem, dmStrength);
  const vulnerabilities = detectHealthVulnerabilities(monthPillar, dmAnalysis, natalPillars);
  const conflicts = detectHealthConflicts(monthPillar, natalPillars);
  const shensha = detectHealthShensha(monthPillar, natalPillars, natalPillars.dayStem);
  const transformations = detectHealthTransformations(monthPillar, natalPillars, dmAnalysis);
  const usefulGodResult = analyzeUsefulGodHealth(monthPillar, usefulGod, annoyingGod);

  const score = calculateHealthScore(vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmStrength);
  const tier = getHealthTier(score);
  const recommendations = generateHealthRecommendations(tier, vulnerabilities, conflicts, shensha, dmAnalysis);
  const narrative = buildHealthNarrative(tier, vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmAnalysis);

  return {
    timingPillar: monthPillar,
    score,
    tier,
    dmAnalysis,
    vulnerabilities,
    conflicts,
    shensha,
    transformations,
    usefulGodAlignment: usefulGodResult,
    recommendations,
    narrative
  };
}

/**
 * Compute health timing for a day (流日健康)
 */
export function computeHealthDailyTiming(
  dayPillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  usefulGod: ElementName | null = null,
  annoyingGod: ElementName | null = null
): HealthTimingResult {
  const dmAnalysis = analyzeDMHealth(natalPillars.dayStem, dmStrength);
  const vulnerabilities = detectHealthVulnerabilities(dayPillar, dmAnalysis, natalPillars);
  const conflicts = detectHealthConflicts(dayPillar, natalPillars);
  const shensha = detectHealthShensha(dayPillar, natalPillars, natalPillars.dayStem);
  const transformations = detectHealthTransformations(dayPillar, natalPillars, dmAnalysis);
  const usefulGodResult = analyzeUsefulGodHealth(dayPillar, usefulGod, annoyingGod);

  const score = calculateHealthScore(vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmStrength);
  const tier = getHealthTier(score);
  const recommendations = generateHealthRecommendations(tier, vulnerabilities, conflicts, shensha, dmAnalysis);
  const narrative = buildHealthNarrative(tier, vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmAnalysis);

  return {
    timingPillar: dayPillar,
    score,
    tier,
    dmAnalysis,
    vulnerabilities,
    conflicts,
    shensha,
    transformations,
    usefulGodAlignment: usefulGodResult,
    recommendations,
    narrative
  };
}

/**
 * Compute health timing for an hour (流时健康)
 */
export function computeHealthHourlyTiming(
  hourPillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  usefulGod: ElementName | null = null,
  annoyingGod: ElementName | null = null
): HealthTimingResult {
  const dmAnalysis = analyzeDMHealth(natalPillars.dayStem, dmStrength);
  const vulnerabilities = detectHealthVulnerabilities(hourPillar, dmAnalysis, natalPillars);
  const conflicts = detectHealthConflicts(hourPillar, natalPillars);
  const shensha = detectHealthShensha(hourPillar, natalPillars, natalPillars.dayStem);
  const transformations = detectHealthTransformations(hourPillar, natalPillars, dmAnalysis);
  const usefulGodResult = analyzeUsefulGodHealth(hourPillar, usefulGod, annoyingGod);

  const score = calculateHealthScore(vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmStrength);
  const tier = getHealthTier(score);
  const recommendations = generateHealthRecommendations(tier, vulnerabilities, conflicts, shensha, dmAnalysis);
  const narrative = buildHealthNarrative(tier, vulnerabilities, conflicts, shensha, transformations, usefulGodResult, dmAnalysis);

  return {
    timingPillar: hourPillar,
    score,
    tier,
    dmAnalysis,
    vulnerabilities,
    conflicts,
    shensha,
    transformations,
    usefulGodAlignment: usefulGodResult,
    recommendations,
    narrative
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE HEALTH TIMING
// ─────────────────────────────────────────────────────────────────────────────

export interface ComprehensiveHealthTiming {
  luckPillar?: HealthTimingResult;
  yearly: HealthTimingResult;
  monthly: HealthTimingResult;
  daily: HealthTimingResult;
  hourly: HealthTimingResult;
  combinedScore: number;
  combinedTier: HealthTier;
  summary: string;
  criticalSystems: BodySystem[];
  overallRecommendations: string[];
}

/**
 * Compute comprehensive health timing across all layers
 */
export function computeHealthTiming(
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  yearPillar: TimingPillar,
  monthPillar: TimingPillar,
  dayPillar: TimingPillar,
  hourPillar: TimingPillar,
  usefulGod: ElementName | null = null,
  annoyingGod: ElementName | null = null,
  luckPillar?: TimingPillar
): ComprehensiveHealthTiming {

  const luckPillarResult = luckPillar
    ? computeHealthLuckPillarTiming(luckPillar, natalPillars, dmStrength, usefulGod, annoyingGod)
    : undefined;

  const yearlyResult = computeHealthYearlyTiming(yearPillar, natalPillars, dmStrength, usefulGod, annoyingGod);
  const monthlyResult = computeHealthMonthlyTiming(monthPillar, natalPillars, dmStrength, usefulGod, annoyingGod);
  const dailyResult = computeHealthDailyTiming(dayPillar, natalPillars, dmStrength, usefulGod, annoyingGod);
  const hourlyResult = computeHealthHourlyTiming(hourPillar, natalPillars, dmStrength, usefulGod, annoyingGod);

  // Calculate combined score with weighted layers
  // Luck Pillar: 15%, Year: 25%, Month: 25%, Day: 20%, Hour: 15%
  let combinedScore: number;

  if (luckPillarResult) {
    combinedScore =
      luckPillarResult.score * 0.15 +
      yearlyResult.score * 0.25 +
      monthlyResult.score * 0.25 +
      dailyResult.score * 0.20 +
      hourlyResult.score * 0.15;
  } else {
    combinedScore =
      yearlyResult.score * 0.30 +
      monthlyResult.score * 0.30 +
      dailyResult.score * 0.25 +
      hourlyResult.score * 0.15;
  }

  combinedScore = Math.round(combinedScore);
  const combinedTier = getHealthTier(combinedScore);

  // Identify critical body systems across all layers
  const allVulnerabilities = [
    ...(luckPillarResult?.vulnerabilities || []),
    ...yearlyResult.vulnerabilities,
    ...monthlyResult.vulnerabilities,
    ...dailyResult.vulnerabilities,
    ...hourlyResult.vulnerabilities
  ];

  const systemCounts = new Map<string, number>();
  for (const vuln of allVulnerabilities) {
    const count = systemCounts.get(vuln.system.name) || 0;
    systemCounts.set(vuln.system.name, count + (vuln.severity === 'high' ? 3 : vuln.severity === 'moderate' ? 2 : 1));
  }

  const criticalSystems = Array.from(systemCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => Object.values(BODY_SYSTEMS).find(s => s.name === name)!)
    .filter(Boolean);

  // Build summary
  const summaryParts: string[] = [];

  if (combinedTier === 'excellent' || combinedTier === 'good') {
    summaryParts.push('Health energy is strong across all time layers.');
  } else if (combinedTier === 'neutral') {
    summaryParts.push('Health timing is balanced. Maintain regular wellness practices.');
  } else if (combinedTier === 'challenging') {
    summaryParts.push('Multiple vulnerability factors present. Extra care advised.');
  } else {
    summaryParts.push('Significant health caution period. Prioritize rest and prevention.');
  }

  if (criticalSystems.length > 0) {
    summaryParts.push(`Focus areas: ${criticalSystems.map(s => s.name).join(', ')}.`);
  }

  // Consolidate recommendations
  const allRecommendations = new Set<string>();
  [luckPillarResult, yearlyResult, monthlyResult, dailyResult, hourlyResult]
    .filter(Boolean)
    .forEach(result => {
      result?.recommendations.forEach(rec => allRecommendations.add(rec));
    });

  const overallRecommendations = Array.from(allRecommendations).slice(0, 6);

  return {
    luckPillar: luckPillarResult,
    yearly: yearlyResult,
    monthly: monthlyResult,
    daily: dailyResult,
    hourly: hourlyResult,
    combinedScore,
    combinedTier,
    summary: summaryParts.join(' '),
    criticalSystems,
    overallRecommendations
  };
}

