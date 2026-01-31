/**
 * Lens Presets
 *
 * Different relationship contexts have different compatibility priorities.
 * The same 9-cell matrix produces different scores depending on the lens.
 *
 * Key insight: A great coworker may not be a great romantic partner.
 * Same data, different weights.
 *
 * GENESIS AstroProfile - January 2025
 */

import type { RelationshipLens, AspectType, SynastryCellKey } from './types';

// =============================================================================
// LENS CONFIGURATION TYPE
// =============================================================================

export interface LensConfig {
  /**
   * How important each layer is for the total score (must sum to 1.0)
   */
  layerWeights: {
    aspect: number;
    element: number;
    modality: number;
    season: number;
  };

  /**
   * Which 9 cells matter most in this lens
   * Values are multipliers (1.0 = normal, >1 = more important, <1 = less)
   */
  cellWeights: Record<SynastryCellKey, number>;

  /**
   * Aspect bias per lens
   * Some aspects are better for certain relationship types
   */
  aspectMultiplier: Partial<Record<AspectType, number>>;

  /**
   * Description for UI display
   */
  description: string;

  /**
   * Key priorities for this lens
   */
  priorities: string[];
}

// =============================================================================
// BASE CELL WEIGHTS
// =============================================================================

/**
 * Default cell importance (before lens adjustments)
 *
 * Sun-Sun: Core values alignment
 * Moon-Moon: Emotional rhythm compatibility
 * Rising-Rising: Social/pacing compatibility
 *
 * Cross combinations show how one person's inner world
 * interacts with another's expression.
 */
const CELL_WEIGHTS_BASE: Record<SynastryCellKey, number> = {
  'Sun-Sun': 1.0,      // Core identity match
  'Sun-Moon': 1.0,     // Your values → their emotions
  'Sun-Rising': 0.9,   // Your values → their presentation
  'Moon-Sun': 1.0,     // Your emotions → their values
  'Moon-Moon': 1.0,    // Emotional rhythm sync
  'Moon-Rising': 0.9,  // Your emotions → their presentation
  'Rising-Sun': 0.9,   // Your presentation → their values
  'Rising-Moon': 0.9,  // Your presentation → their emotions
  'Rising-Rising': 0.8, // Social interface match
};

// =============================================================================
// LENS CONFIGURATIONS
// =============================================================================

export const LENSES: Record<RelationshipLens, LensConfig> = {
  // ===========================================================================
  // ROMANTIC LENS
  // ===========================================================================
  romantic: {
    layerWeights: {
      aspect: 0.40,   // Aspects matter most for chemistry
      element: 0.25,  // Element harmony for passion
      modality: 0.15, // Modality for rhythm
      season: 0.20,   // Season for life timing
    },

    cellWeights: {
      ...CELL_WEIGHTS_BASE,
      'Sun-Moon': 1.25,   // Your values touching their heart — crucial
      'Moon-Sun': 1.25,   // Their values touching your heart — crucial
      'Moon-Moon': 1.20,  // Emotional rhythm sync — very important
    },

    aspectMultiplier: {
      trine: 1.05,        // Comfort matters in romance
      sextile: 1.03,      // Opportunity aspects are good
      opposition: 1.00,   // Can be magnetic but challenging
      square: 0.95,       // Tension can be passion or pain
      quincunx: 0.92,     // Awkwardness is harder romantically
      semi_sextile: 0.95, // Subtle friction
    },

    description: 'Emotional depth, passion, and long-term bonding potential',

    priorities: [
      'Sun-Moon connections (values touching heart)',
      'Moon-Moon emotional rhythm',
      'Aspect chemistry (trines and sextiles preferred)',
    ],
  },

  // ===========================================================================
  // BEST FRIEND LENS
  // ===========================================================================
  best_friend: {
    layerWeights: {
      aspect: 0.35,   // Still important but less than romance
      element: 0.25,  // Element harmony for understanding
      modality: 0.20, // Modality for compatible pacing
      season: 0.20,   // Season for shared rhythms
    },

    cellWeights: {
      ...CELL_WEIGHTS_BASE,
      'Moon-Moon': 1.20,    // Emotional understanding — key for best friends
      'Rising-Rising': 1.10, // How you appear together socially
    },

    aspectMultiplier: {
      trine: 1.02,          // Easy flow is nice
      sextile: 1.04,        // Opportunity aspects are great
      opposition: 1.05,     // Friends can thrive on polarity!
      square: 0.98,         // Some tension is fine
      quincunx: 0.95,       // Awkwardness is manageable
      semi_sextile: 0.97,   // Adjacent signs can be good friends
    },

    description: 'Mutual understanding, loyalty, and shared enjoyment',

    priorities: [
      'Moon-Moon emotional sync',
      'Rising-Rising social compatibility',
      'Opposition aspects can enhance friendship diversity',
    ],
  },

  // ===========================================================================
  // FRIEND LENS
  // ===========================================================================
  friend: {
    layerWeights: {
      aspect: 0.30,   // Less critical than close relationships
      element: 0.30,  // Element understanding helps casual rapport
      modality: 0.20, // Pacing matters
      season: 0.20,   // Seasonal alignment
    },

    cellWeights: {
      ...CELL_WEIGHTS_BASE,
      // All cells roughly equal for casual friendship
    },

    aspectMultiplier: {
      sextile: 1.05,        // Opportunity aspects are ideal
      trine: 1.03,          // Easy flow
      opposition: 1.02,     // Can work well
      square: 0.98,         // Minor challenge
      quincunx: 0.95,       // Slight awkwardness
      semi_sextile: 0.97,   // Neighbors can be friends
    },

    description: 'Easy rapport and social compatibility',

    priorities: [
      'Balanced cell weights',
      'Sextile aspects (opportunity for connection)',
      'Element harmony',
    ],
  },

  // ===========================================================================
  // COWORKER LENS
  // ===========================================================================
  coworker: {
    layerWeights: {
      aspect: 0.25,   // Less about emotional chemistry
      element: 0.20,  // Some element harmony helps
      modality: 0.35, // Modality is KEY for work — pacing matters!
      season: 0.20,   // Seasonal leadership rotation
    },

    cellWeights: {
      ...CELL_WEIGHTS_BASE,
      'Sun-Sun': 1.15,      // Shared mission/values alignment
      'Rising-Rising': 1.20, // How you work together publicly
      'Moon-Moon': 0.85,    // Emotional sync less critical at work
    },

    aspectMultiplier: {
      sextile: 1.06,        // Opportunity aspects are ideal for collaboration
      trine: 1.02,          // Easy cooperation
      opposition: 1.06,     // Division of labor potential!
      square: 1.00,         // Productive tension can be useful
      quincunx: 0.92,       // Awkwardness is harder professionally
      semi_sextile: 0.95,   // Adjacent signs need bridging
    },

    description: 'Productive collaboration and complementary skills',

    priorities: [
      'Modality alignment (pacing)',
      'Sun-Sun mission alignment',
      'Rising-Rising professional interface',
      'Opposition aspects enable division of labor',
    ],
  },
};

// =============================================================================
// LENS HELPERS
// =============================================================================

/**
 * Get all available lens types
 */
export function getLensTypes(): RelationshipLens[] {
  return ['romantic', 'best_friend', 'friend', 'coworker'];
}

/**
 * Get lens display name
 */
export function getLensDisplayName(lens: RelationshipLens): string {
  const names: Record<RelationshipLens, string> = {
    romantic: 'Romantic Partner',
    best_friend: 'Best Friend',
    friend: 'Friend',
    coworker: 'Coworker',
  };
  return names[lens];
}

/**
 * Get lens emoji for UI
 */
export function getLensEmoji(lens: RelationshipLens): string {
  const emojis: Record<RelationshipLens, string> = {
    romantic: '💕',
    best_friend: '🤝',
    friend: '👋',
    coworker: '💼',
  };
  return emojis[lens];
}
