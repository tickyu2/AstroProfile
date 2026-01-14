/**
 * ============================================================================
 * BAZI SEASONALITY PAIRWISE COMPARISON ENGINE
 * ============================================================================
 *
 * Compares two people's seasonality to understand relational dynamics.
 *
 * Philosophy: "I see why you are like this, and I honor it."
 *
 * When you understand that each person's reactions, needs, and rhythms
 * are shaped by their elemental constitution and seasonality, it becomes
 * easier to respect differences instead of judging them.
 *
 * Created: January 2026
 * Based on: Classical BaZi compatibility principles
 * ============================================================================
 */

import {
  SeasonalityResult,
  Element,
  applySeasonality,
  ELEMENT_COLORS,
  ELEMENT_CHINESE
} from './baziSeasonality';
import { DMSeasonalityResult, computeSeasonalDMStrength } from './baziDmSeasonality';
import { TenGodsSeasonalityResult, computeTenGodsSeasonality, TenGodCategory } from './baziTenGodsSeasonality';

// ============================================================================
// TYPES
// ============================================================================

export interface PersonSeasonalityProfile {
  label: string;
  seasonality: SeasonalityResult;
  dmSeasonal: DMSeasonalityResult;
  tenGodsSeasonal: TenGodsSeasonalityResult;
}

export interface SeasonalityComparison {
  personA: PersonSeasonalityProfile;
  personB: PersonSeasonalityProfile;

  // Season comparison
  sameSeason: boolean;
  seasonRelation: 'same' | 'adjacent' | 'opposite' | 'transition';

  // Element harmony
  elementResonance: ElementResonanceResult;

  // DM interaction
  dmInteraction: DMInteractionResult;

  // Ten Gods compatibility
  tenGodsCompatibility: TenGodsCompatibilityResult;

  // Overall insights
  insights: PairInsights;

  // Numerical score (0-100)
  harmonicScore: number;
}

export interface ElementResonanceResult {
  sharedDominant: boolean;
  dominantRelation: 'same' | 'generating' | 'controlling' | 'clashing' | 'neutral';
  strengthBalance: 'A_stronger' | 'B_stronger' | 'balanced';
  complementaryElements: Element[];
  clashingElements: Element[];
  resonanceScore: number; // 0-100
}

export interface DMInteractionResult {
  relation: 'same_element' | 'A_supports_B' | 'B_supports_A' | 'A_controls_B' | 'B_controls_A' | 'neutral';
  strengthDifference: number; // -1 to 1
  dynamicDescription: string;
  compatibilityScore: number; // 0-100
}

export interface TenGodsCompatibilityResult {
  resourceHarmony: number;      // -1 to 1
  companionEnergy: number;      // -1 to 1
  outputSynergy: number;        // -1 to 1
  wealthAlignment: number;      // -1 to 1
  officerBalance: number;       // -1 to 1
  overallScore: number;         // 0-100
  strongestDomain: TenGodCategory;
  weakestDomain: TenGodCategory;
}

export interface PairInsights {
  strengths: string[];
  challenges: string[];
  growthAreas: string[];
  practicalAdvice: string[];
  mutualRespectReminder: string;
}

// ============================================================================
// ELEMENT RELATIONSHIP MAPS
// ============================================================================

const GENERATION_CYCLE: Record<Element, Element> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
};

const CONTROL_CYCLE: Record<Element, Element> = {
  wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire'
};

// Reverse lookups
const GENERATED_BY: Record<Element, Element> = {
  wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal'
};

const CONTROLLED_BY: Record<Element, Element> = {
  wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth'
};

// ============================================================================
// CORE COMPARISON FUNCTION
// ============================================================================

/**
 * Compare two people's seasonality profiles.
 */
export function computePairSeasonality(
  personA: PersonSeasonalityProfile,
  personB: PersonSeasonalityProfile
): SeasonalityComparison {

  // Season comparison
  const sameSeason = personA.seasonality.season === personB.seasonality.season;
  const seasonRelation = getSeasonRelation(personA.seasonality.season, personB.seasonality.season);

  // Element resonance
  const elementResonance = computeElementResonance(personA, personB);

  // DM interaction
  const dmInteraction = computeDMInteraction(personA.dmSeasonal, personB.dmSeasonal);

  // Ten Gods compatibility
  const tenGodsCompatibility = computeTenGodsCompatibility(
    personA.tenGodsSeasonal,
    personB.tenGodsSeasonal
  );

  // Generate insights
  const insights = generatePairInsights(
    personA, personB, elementResonance, dmInteraction, tenGodsCompatibility
  );

  // Calculate overall harmonic score
  const harmonicScore = calculateHarmonicScore(
    elementResonance.resonanceScore,
    dmInteraction.compatibilityScore,
    tenGodsCompatibility.overallScore,
    sameSeason
  );

  return {
    personA,
    personB,
    sameSeason,
    seasonRelation,
    elementResonance,
    dmInteraction,
    tenGodsCompatibility,
    insights,
    harmonicScore
  };
}

// ============================================================================
// SEASON RELATION
// ============================================================================

function getSeasonRelation(
  seasonA: string,
  seasonB: string
): 'same' | 'adjacent' | 'opposite' | 'transition' {
  // Normalize earth transitions
  const normalizedA = seasonA.startsWith('earth_transition') ? 'earth_transition' : seasonA;
  const normalizedB = seasonB.startsWith('earth_transition') ? 'earth_transition' : seasonB;

  if (normalizedA === normalizedB) return 'same';

  // Check for earth transition
  if (normalizedA === 'earth_transition' || normalizedB === 'earth_transition') {
    return 'transition';
  }

  // Adjacent and opposite seasons
  const seasonOrder = ['spring', 'summer', 'autumn', 'winter'];
  const indexA = seasonOrder.indexOf(normalizedA);
  const indexB = seasonOrder.indexOf(normalizedB);

  if (indexA === -1 || indexB === -1) return 'transition';

  const diff = Math.abs(indexA - indexB);

  if (diff === 1 || diff === 3) return 'adjacent';
  if (diff === 2) return 'opposite';

  return 'transition';
}

// ============================================================================
// ELEMENT RESONANCE
// ============================================================================

function computeElementResonance(
  personA: PersonSeasonalityProfile,
  personB: PersonSeasonalityProfile
): ElementResonanceResult {
  const domA = personA.seasonality.dominantAfter;
  const domB = personB.seasonality.dominantAfter;

  const sharedDominant = domA === domB;
  const dominantRelation = getElementRelation(domA, domB);

  // Calculate strength balance
  const strengthA = personA.seasonality.adjustedNormalized[domA];
  const strengthB = personB.seasonality.adjustedNormalized[domB];
  const strengthBalance =
    Math.abs(strengthA - strengthB) < 5 ? 'balanced' :
    strengthA > strengthB ? 'A_stronger' : 'B_stronger';

  // Find complementary elements (one generates the other)
  const complementaryElements: Element[] = [];
  const clashingElements: Element[] = [];

  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];

  for (const el of elements) {
    const strengthDiffA = personA.seasonality.adjustedNormalized[el];
    const strengthDiffB = personB.seasonality.adjustedNormalized[el];

    // If one has high and other has low, check relationship
    if (Math.abs(strengthDiffA - strengthDiffB) > 15) {
      const higher = strengthDiffA > strengthDiffB ? 'A' : 'B';
      const higherEl = higher === 'A' ? personA.seasonality.dominantAfter : personB.seasonality.dominantAfter;

      if (GENERATION_CYCLE[higherEl] === el || GENERATION_CYCLE[el] === higherEl) {
        complementaryElements.push(el);
      }
      if (CONTROL_CYCLE[higherEl] === el || CONTROL_CYCLE[el] === higherEl) {
        clashingElements.push(el);
      }
    }
  }

  // Calculate resonance score
  const resonanceScore = calculateResonanceScore(
    sharedDominant, dominantRelation, strengthBalance
  );

  return {
    sharedDominant,
    dominantRelation,
    strengthBalance,
    complementaryElements,
    clashingElements,
    resonanceScore
  };
}

function getElementRelation(elA: Element, elB: Element): 'same' | 'generating' | 'controlling' | 'clashing' | 'neutral' {
  if (elA === elB) return 'same';
  if (GENERATION_CYCLE[elA] === elB || GENERATION_CYCLE[elB] === elA) return 'generating';
  if (CONTROL_CYCLE[elA] === elB || CONTROL_CYCLE[elB] === elA) return 'controlling';
  return 'neutral';
}

function calculateResonanceScore(
  sharedDominant: boolean,
  dominantRelation: string,
  strengthBalance: string
): number {
  let score = 50; // Base score

  if (sharedDominant) score += 20;

  switch (dominantRelation) {
    case 'same': score += 15; break;
    case 'generating': score += 20; break;
    case 'controlling': score -= 10; break;
    case 'clashing': score -= 20; break;
  }

  if (strengthBalance === 'balanced') score += 10;

  return Math.min(100, Math.max(0, score));
}

// ============================================================================
// DM INTERACTION
// ============================================================================

function computeDMInteraction(
  dmA: DMSeasonalityResult,
  dmB: DMSeasonalityResult
): DMInteractionResult {
  const elA = dmA.dmElement;
  const elB = dmB.dmElement;

  // Determine relationship
  let relation: DMInteractionResult['relation'] = 'neutral';

  if (elA === elB) {
    relation = 'same_element';
  } else if (GENERATION_CYCLE[elA] === elB) {
    relation = 'A_supports_B';
  } else if (GENERATION_CYCLE[elB] === elA) {
    relation = 'B_supports_A';
  } else if (CONTROL_CYCLE[elA] === elB) {
    relation = 'A_controls_B';
  } else if (CONTROL_CYCLE[elB] === elA) {
    relation = 'B_controls_A';
  }

  // Strength difference
  const strengthDifference = dmA.adjustedStrength - dmB.adjustedStrength;

  // Dynamic description
  const dynamicDescription = generateDMDynamicDescription(
    relation, dmA, dmB, strengthDifference
  );

  // Compatibility score
  const compatibilityScore = calculateDMCompatibilityScore(
    relation, Math.abs(strengthDifference)
  );

  return {
    relation,
    strengthDifference,
    dynamicDescription,
    compatibilityScore
  };
}

function generateDMDynamicDescription(
  relation: string,
  dmA: DMSeasonalityResult,
  dmB: DMSeasonalityResult,
  strengthDiff: number
): string {
  const elA = capitalize(dmA.dmElement);
  const elB = capitalize(dmB.dmElement);

  switch (relation) {
    case 'same_element':
      return `Both share ${elA} as their core element - natural understanding and similar rhythms.`;
    case 'A_supports_B':
      return `${elA} nourishes ${elB} - Person A can provide energy and support to Person B.`;
    case 'B_supports_A':
      return `${elB} nourishes ${elA} - Person B can provide energy and support to Person A.`;
    case 'A_controls_B':
      return `${elA} controls ${elB} - Person A may naturally take the lead, which can be helpful or overwhelming.`;
    case 'B_controls_A':
      return `${elB} controls ${elA} - Person B may naturally take the lead, which can be helpful or overwhelming.`;
    default:
      return `${elA} and ${elB} have a neutral relationship - neither supporting nor challenging directly.`;
  }
}

function calculateDMCompatibilityScore(
  relation: string,
  strengthDiff: number
): number {
  let score = 60; // Base score

  switch (relation) {
    case 'same_element': score += 20; break;
    case 'A_supports_B':
    case 'B_supports_A': score += 25; break;
    case 'A_controls_B':
    case 'B_controls_A': score -= 5; break;
  }

  // Extreme strength differences reduce compatibility
  if (strengthDiff > 0.3) score -= 15;
  else if (strengthDiff > 0.2) score -= 10;
  else if (strengthDiff < 0.1) score += 10;

  return Math.min(100, Math.max(0, score));
}

// ============================================================================
// TEN GODS COMPATIBILITY
// ============================================================================

function computeTenGodsCompatibility(
  tenGodsA: TenGodsSeasonalityResult,
  tenGodsB: TenGodsSeasonalityResult
): TenGodsCompatibilityResult {
  const categories: TenGodCategory[] = ['resource', 'companion', 'output', 'wealth', 'officer'];

  const harmony: Record<TenGodCategory, number> = {} as any;

  for (const cat of categories) {
    const adjustedA = tenGodsA.tenGods[cat].adjusted;
    const adjustedB = tenGodsB.tenGods[cat].adjusted;

    // Calculate harmony: closer values = higher harmony
    // Range -1 to 1, where 1 is perfect alignment
    harmony[cat] = 1 - Math.abs(adjustedA - adjustedB);
  }

  // Find strongest and weakest domains
  const sortedHarmony = categories
    .map(cat => ({ cat, score: harmony[cat] }))
    .sort((a, b) => b.score - a.score);

  const strongestDomain = sortedHarmony[0].cat;
  const weakestDomain = sortedHarmony[sortedHarmony.length - 1].cat;

  // Overall score (average * 100)
  const avgHarmony = categories.reduce((sum, cat) => sum + harmony[cat], 0) / categories.length;
  const overallScore = Math.round(avgHarmony * 100);

  return {
    resourceHarmony: harmony.resource,
    companionEnergy: harmony.companion,
    outputSynergy: harmony.output,
    wealthAlignment: harmony.wealth,
    officerBalance: harmony.officer,
    overallScore,
    strongestDomain,
    weakestDomain
  };
}

// ============================================================================
// PAIR INSIGHTS GENERATOR
// ============================================================================

function generatePairInsights(
  personA: PersonSeasonalityProfile,
  personB: PersonSeasonalityProfile,
  elementResonance: ElementResonanceResult,
  dmInteraction: DMInteractionResult,
  tenGodsCompat: TenGodsCompatibilityResult
): PairInsights {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const growthAreas: string[] = [];
  const practicalAdvice: string[] = [];

  // Element resonance insights
  if (elementResonance.sharedDominant) {
    strengths.push(`Both share ${capitalize(personA.seasonality.dominantAfter)} as their dominant element - natural understanding.`);
  }

  if (elementResonance.dominantRelation === 'generating') {
    strengths.push(`Your dominant elements form a generative relationship - you naturally nurture each other's energy.`);
  }

  if (elementResonance.dominantRelation === 'controlling') {
    challenges.push(`One dominant element controls the other - be mindful of power dynamics.`);
    practicalAdvice.push(`Practice conscious restraint and take turns leading.`);
  }

  if (elementResonance.complementaryElements.length > 0) {
    strengths.push(`Complementary strengths in: ${elementResonance.complementaryElements.map(capitalize).join(', ')}.`);
  }

  // DM interaction insights
  if (dmInteraction.relation === 'same_element') {
    strengths.push(`Same core element creates deep intuitive understanding.`);
    challenges.push(`Too much similarity can lead to blind spots - both may share the same weaknesses.`);
  }

  if (dmInteraction.relation.includes('supports')) {
    const supporter = dmInteraction.relation === 'A_supports_B' ? personA.label : personB.label;
    strengths.push(`${supporter} naturally supports and energizes the other.`);
    practicalAdvice.push(`Ensure support flows both ways - take turns giving and receiving.`);
  }

  if (dmInteraction.relation.includes('controls')) {
    const controller = dmInteraction.relation === 'A_controls_B' ? personA.label : personB.label;
    challenges.push(`${controller} may unconsciously dominate interactions.`);
    growthAreas.push(`Practice awareness of power dynamics and intentional balance.`);
  }

  // Strength balance insights
  if (Math.abs(dmInteraction.strengthDifference) > 0.2) {
    const stronger = dmInteraction.strengthDifference > 0 ? personA.label : personB.label;
    const weaker = dmInteraction.strengthDifference > 0 ? personB.label : personA.label;
    challenges.push(`Significant strength difference: ${stronger}'s energy may overwhelm ${weaker}.`);
    practicalAdvice.push(`${stronger} should practice gentle restraint; ${weaker} should voice needs clearly.`);
  }

  // Ten Gods insights
  const tenGodNames: Record<TenGodCategory, string> = {
    resource: 'Support & Learning',
    companion: 'Friendship & Competition',
    output: 'Expression & Creativity',
    wealth: 'Material Resources',
    officer: 'Career & Structure'
  };

  strengths.push(`Strongest alignment in ${tenGodNames[tenGodsCompat.strongestDomain]}.`);

  if (tenGodsCompat.overallScore < 60) {
    growthAreas.push(`Work on alignment in ${tenGodNames[tenGodsCompat.weakestDomain]}.`);
  }

  // Season insights
  const seasonA = personA.seasonality.season;
  const seasonB = personB.seasonality.season;

  if (seasonA === seasonB) {
    strengths.push(`Born in the same season - natural rhythm and timing alignment.`);
  } else {
    practicalAdvice.push(`Different seasonal energies mean different natural rhythms - honor each person's pace.`);
  }

  // Mutual respect reminder
  const mutualRespectReminder = `Remember: Understanding your different elemental constitutions is not about labeling each other. It's about seeing clearly why each person is the way they are, and honoring it. "I see why you are like this, and I honor it."`;

  return {
    strengths,
    challenges,
    growthAreas,
    practicalAdvice,
    mutualRespectReminder
  };
}

// ============================================================================
// HARMONIC SCORE CALCULATION
// ============================================================================

function calculateHarmonicScore(
  resonanceScore: number,
  dmCompatScore: number,
  tenGodsScore: number,
  sameSeason: boolean
): number {
  // Weighted average
  let score = (
    resonanceScore * 0.35 +
    dmCompatScore * 0.35 +
    tenGodsScore * 0.25
  );

  // Season bonus
  if (sameSeason) score += 5;

  return Math.round(Math.min(100, Math.max(0, score)));
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create a full PersonSeasonalityProfile from basic inputs.
 */
export function createPersonProfile(
  label: string,
  rawElements: Record<Element, number>,
  monthBranch: string,
  dmStem: string,
  rawDmStrength: number = 0.5
): PersonSeasonalityProfile {
  const seasonality = applySeasonality(rawElements, monthBranch);
  const dmSeasonal = computeSeasonalDMStrength(dmStem, monthBranch, rawDmStrength);
  const tenGodsSeasonal = computeTenGodsSeasonality(dmSeasonal.dmElement, monthBranch);

  return {
    label,
    seasonality,
    dmSeasonal,
    tenGodsSeasonal
  };
}

/**
 * Quick comparison function that creates profiles and compares.
 */
export function quickPairComparison(
  personAConfig: {
    label: string;
    rawElements: Record<Element, number>;
    monthBranch: string;
    dmStem: string;
    rawDmStrength?: number;
  },
  personBConfig: {
    label: string;
    rawElements: Record<Element, number>;
    monthBranch: string;
    dmStem: string;
    rawDmStrength?: number;
  }
): SeasonalityComparison {
  const profileA = createPersonProfile(
    personAConfig.label,
    personAConfig.rawElements,
    personAConfig.monthBranch,
    personAConfig.dmStem,
    personAConfig.rawDmStrength
  );

  const profileB = createPersonProfile(
    personBConfig.label,
    personBConfig.rawElements,
    personBConfig.monthBranch,
    personBConfig.dmStem,
    personBConfig.rawDmStrength
  );

  return computePairSeasonality(profileA, profileB);
}

// ============================================================================
// HELPERS
// ============================================================================

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computePairSeasonality,
  createPersonProfile,
  quickPairComparison
};
