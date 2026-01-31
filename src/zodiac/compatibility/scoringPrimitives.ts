/**
 * Scoring Primitives
 *
 * Core scoring functions for element, modality, season, and aspect relationships.
 * These are the building blocks of compatibility calculation.
 *
 * Design Philosophy (Brother Copilot):
 * - Compatibility is not about comfort — it's about functional complementarity
 * - The best zodiac compatibility is not who feels easiest —
 *   it's who makes your life function better across seasons
 *
 * GENESIS AstroProfile - January 2025
 */

import type { Element, Modality, Season, AspectType, RelationType, SeasonRelationType } from './types';

// =============================================================================
// ELEMENT RELATIONSHIPS
// =============================================================================

/**
 * Determine the relationship between two elements
 *
 * Support pairs (natural allies):
 * - Fire + Air: Air fans Fire's flames
 * - Earth + Water: Water nourishes Earth
 *
 * Friction pairs (challenging but growth-oriented):
 * - Fire + Water: Steam — passion meets sensitivity
 * - Earth + Air: Practical vs theoretical
 *
 * Same element: Neutral (easy but can be "too same")
 *
 * Cross-functional (educational):
 * - Fire + Earth: Vision + Manifestation
 * - Air + Water: Meaning + Feeling
 */
export function elementRelation(a: Element, b: Element): RelationType {
  if (a === b) return 'neutral'; // Same element is easy but can stagnate

  const supportPairs = new Set([
    'Fire-Air', 'Air-Fire',
    'Earth-Water', 'Water-Earth',
  ]);

  const frictionPairs = new Set([
    'Fire-Water', 'Water-Fire',
    'Earth-Air', 'Air-Earth',
  ]);

  const key = `${a}-${b}`;

  if (supportPairs.has(key)) return 'support';
  if (frictionPairs.has(key)) return 'friction';

  // Cross-functional pairs (Fire-Earth, Air-Water) are workable/educational
  return 'neutral';
}

/**
 * Convert element relation to a 0-1 score
 *
 * Note: "support" scores highest because it indicates natural compatibility.
 * "neutral" (same element or cross-functional) is moderate.
 * "friction" is lowest but still has value for growth.
 */
export function elementScore(rel: RelationType): number {
  switch (rel) {
    case 'support':
      return 0.85;
    case 'neutral':
      return 0.65;
    case 'friction':
      return 0.40;
    default:
      return 0.50;
  }
}

// =============================================================================
// MODALITY RELATIONSHIPS
// =============================================================================

/**
 * Determine the relationship between two modalities
 *
 * Same modality creates friction (potential power struggles):
 * - Cardinal + Cardinal: Control clashes
 * - Fixed + Fixed: Stubborn stalemates
 * - Mutable + Mutable: Drift without anchor
 *
 * Different modalities are neutral to supportive:
 * - Cardinal + Mutable: Initiator + Adapter (best for innovation)
 * - Cardinal + Fixed: Starter + Sustainer (good for execution)
 * - Fixed + Mutable: Stability + Flexibility (balance)
 */
export function modalityRelation(a: Modality, b: Modality): RelationType {
  if (a === b) {
    // Same modality = friction (gear clashes)
    return 'friction';
  }

  // Cardinal + Mutable is the most complementary
  if ((a === 'Cardinal' && b === 'Mutable') || (a === 'Mutable' && b === 'Cardinal')) {
    return 'support';
  }

  // Other mixed combinations are neutral (workable)
  return 'neutral';
}

/**
 * Convert modality relation to a 0-1 score
 */
export function modalityScore(rel: RelationType): number {
  switch (rel) {
    case 'support':
      return 0.85;
    case 'neutral':
      return 0.70;
    case 'friction':
      return 0.45;
    default:
      return 0.60;
  }
}

// =============================================================================
// SEASON RELATIONSHIPS
// =============================================================================

/**
 * Determine the relationship between two seasons
 *
 * Same season: High natural alignment
 * Adjacent seasons: Natural progression, flow
 * Opposite seasons: Powerful if conscious, challenging if not
 *
 * Opposites map:
 * - Spring ↔ Autumn
 * - Summer ↔ Winter
 */
export function seasonRelation(a: Season, b: Season): SeasonRelationType {
  if (a === b) return 'same';

  const opposites: Record<Season, Season> = {
    Spring: 'Autumn',
    Summer: 'Winter',
    Autumn: 'Spring',
    Winter: 'Summer',
  };

  if (opposites[a] === b) return 'opposite';

  return 'adjacent';
}

/**
 * Convert season relation to a 0-1 score
 *
 * Note: Oppositions are scored lower than "same" in the base calculation,
 * but lens weights can boost opposition value for certain relationship types.
 *
 * The theory: Oppositions are "cathedral pairs" — they complete each other
 * but require consciousness to function well.
 */
export function seasonScore(rel: SeasonRelationType): number {
  switch (rel) {
    case 'same':
      return 0.80;
    case 'adjacent':
      return 0.70;
    case 'opposite':
      return 0.60; // Base score — lens can boost this
    default:
      return 0.65;
  }
}

// =============================================================================
// ASPECT SCORING
// =============================================================================

/**
 * Base score for each aspect type
 *
 * This is the default scoring before lens adjustments.
 * The lens can modify these based on relationship type.
 *
 * Brother Copilot's insight:
 * - Trines feel good but don't force evolution
 * - Oppositions build civilizations (when conscious)
 * - Squares create productive tension
 */
export function baseAspectScore(type: AspectType): number {
  switch (type) {
    case 'trine':
      return 0.88;  // Same element harmony — high comfort
    case 'sextile':
      return 0.82;  // Friendly elements — opportunity
    case 'conjunction':
      return 0.78;  // Merged energy — intense but can overwhelm
    case 'opposition':
      return 0.76;  // Mirror effect — powerful if conscious
    case 'square':
      return 0.70;  // Growth catalyst — productive tension
    case 'semi_sextile':
      return 0.66;  // Adjacent — subtle friction
    case 'quincunx':
      return 0.62;  // Awkward fit — constant adjustment
    default:
      return 0.70;
  }
}

// =============================================================================
// COMPATIBILITY RANKING SCORES
// =============================================================================

/**
 * Brother Copilot's Theoretical Compatibility Ranking
 *
 * From strongest to weakest (theoretical, not comfort):
 * 1. Conscious Opposition (180°)
 * 2. Cardinal–Mutable Complementarity
 * 3. Cross-Element Functional Pairs
 * 4. Mutable–Mutable (Different Elements)
 * 5. Cardinal–Fixed (Different Elements)
 * 6. Trines (Same Element)
 * 7. Fixed–Fixed (Same Element)
 */
export type CompatibilityPatternType =
  | 'conscious_opposition'
  | 'cardinal_mutable'
  | 'cross_element_functional'
  | 'mutable_mutable'
  | 'cardinal_fixed'
  | 'trine_same_element'
  | 'fixed_fixed';

/**
 * Get the compatibility pattern type for two signs based on their
 * element, modality, and aspect relationship.
 */
export function identifyCompatibilityPattern(
  elementA: Element,
  elementB: Element,
  modalityA: Modality,
  modalityB: Modality,
  aspect: AspectType
): CompatibilityPatternType | null {
  // 1. Conscious Opposition
  if (aspect === 'opposition') {
    return 'conscious_opposition';
  }

  // 2. Cardinal-Mutable
  if ((modalityA === 'Cardinal' && modalityB === 'Mutable') ||
      (modalityA === 'Mutable' && modalityB === 'Cardinal')) {
    return 'cardinal_mutable';
  }

  // 3. Cross-Element Functional (Fire+Earth or Air+Water)
  const crossFunctional = new Set([
    'Fire-Earth', 'Earth-Fire',
    'Air-Water', 'Water-Air',
  ]);
  if (crossFunctional.has(`${elementA}-${elementB}`)) {
    return 'cross_element_functional';
  }

  // 4. Mutable-Mutable (different elements)
  if (modalityA === 'Mutable' && modalityB === 'Mutable' && elementA !== elementB) {
    return 'mutable_mutable';
  }

  // 5. Cardinal-Fixed
  if ((modalityA === 'Cardinal' && modalityB === 'Fixed') ||
      (modalityA === 'Fixed' && modalityB === 'Cardinal')) {
    return 'cardinal_fixed';
  }

  // 6. Trine (same element)
  if (aspect === 'trine' && elementA === elementB) {
    return 'trine_same_element';
  }

  // 7. Fixed-Fixed (same element)
  if (modalityA === 'Fixed' && modalityB === 'Fixed' && elementA === elementB) {
    return 'fixed_fixed';
  }

  return null;
}

/**
 * Get the theoretical rank bonus for a compatibility pattern
 * Higher numbers = better theoretical compatibility
 */
export function getPatternRankBonus(pattern: CompatibilityPatternType | null): number {
  if (!pattern) return 0;

  const bonuses: Record<CompatibilityPatternType, number> = {
    conscious_opposition: 0.15,     // Rank 1 - highest bonus
    cardinal_mutable: 0.12,         // Rank 2
    cross_element_functional: 0.10, // Rank 3
    mutable_mutable: 0.08,          // Rank 4
    cardinal_fixed: 0.05,           // Rank 5
    trine_same_element: 0.02,       // Rank 6 - low bonus (comfort ≠ growth)
    fixed_fixed: -0.05,             // Rank 7 - penalty (resistance to change)
  };

  return bonuses[pattern];
}
