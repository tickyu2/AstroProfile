/**
 * Tropical Compatibility Scoring Engine - Types
 *
 * Core type definitions for the compatibility system.
 * Supports 9-cell synastry matrix with lens-based scoring.
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 * GENESIS AstroProfile - January 2025
 */

// =============================================================================
// ZODIAC PRIMITIVES
// =============================================================================

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

// =============================================================================
// ASPECT TYPES
// =============================================================================

export type AspectType =
  | 'conjunction'
  | 'semi_sextile'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'quincunx'
  | 'opposition';

// =============================================================================
// TRIAD (Sun/Moon/Rising)
// =============================================================================

export type TriadKey = 'Sun' | 'Moon' | 'Rising';

export type PersonTriad = {
  Sun: ZodiacSign;
  Moon: ZodiacSign;
  Rising: ZodiacSign;
};

// =============================================================================
// RELATIONSHIP LENSES
// =============================================================================

/**
 * Different relationship contexts have different compatibility priorities:
 * - romantic: emotional depth, passion, long-term bonding
 * - best_friend: mutual understanding, loyalty, shared fun
 * - friend: easy rapport, social compatibility
 * - coworker: productive collaboration, complementary skills
 */
export type RelationshipLens = 'romantic' | 'best_friend' | 'friend' | 'coworker';

// =============================================================================
// SYNASTRY CELL (Atomic Unit)
// =============================================================================

export type SynastryCellKey =
  | 'Sun-Sun' | 'Sun-Moon' | 'Sun-Rising'
  | 'Moon-Sun' | 'Moon-Moon' | 'Moon-Rising'
  | 'Rising-Sun' | 'Rising-Moon' | 'Rising-Rising';

export type RelationType = 'support' | 'neutral' | 'friction';
export type SeasonRelationType = 'same' | 'adjacent' | 'opposite';

export interface SynastryCell {
  key: SynastryCellKey;
  a: { point: TriadKey; sign: ZodiacSign };
  b: { point: TriadKey; sign: ZodiacSign };

  aspect: {
    type: AspectType;
    degrees: number;
    steps: number;  // Number of signs apart (0-6)
  };

  element: {
    a: Element;
    b: Element;
    relation: RelationType;
    score: number;  // 0-1
  };

  modality: {
    a: Modality;
    b: Modality;
    relation: RelationType;
    score: number;  // 0-1
  };

  season: {
    a: Season;
    b: Season;
    relation: SeasonRelationType;
    score: number;  // 0-1
  };

  // Final cell score in 0..10 (lens-adjusted)
  score10: number;

  // Human-readable hooks for UI
  tags: string[];
  summary: string;
}

// =============================================================================
// SYNASTRY MATRIX (9-Cell Grid)
// =============================================================================

export type SynastryMatrix = Record<SynastryCellKey, SynastryCell>;

// =============================================================================
// COMPATIBILITY REPORT (Final Output)
// =============================================================================

export type CompatibilityLabel = 'Excellent' | 'Strong' | 'Workable' | 'Challenging';

export interface CompatibilityBreakdown {
  aspect: number;   // 0-100 contribution percentage
  element: number;
  modality: number;
  season: number;
}

export interface SeasonalLeadership {
  Spring?: 'A' | 'B' | 'Share';
  Summer?: 'A' | 'B' | 'Share';
  Autumn?: 'A' | 'B' | 'Share';
  Winter?: 'A' | 'B' | 'Share';
}

export interface CompatibilityGuidance {
  leadInSeason: SeasonalLeadership;
  notes: string[];
}

export interface CompatibilityReport {
  lens: RelationshipLens;
  totalScore100: number;       // 0-100 overall score
  label: CompatibilityLabel;   // Human-friendly label

  matrix: SynastryMatrix;      // Full 9-cell detail

  strengths: SynastryCellKey[];    // Top 3 cells
  challenges: SynastryCellKey[];   // Bottom 3 cells

  breakdown: CompatibilityBreakdown;  // Layer contributions

  guidance: CompatibilityGuidance;    // Prescriptive advice
}

// =============================================================================
// COMPATIBILITY RANKING (Theoretical Framework)
// =============================================================================

/**
 * Brother Copilot's Theoretical Compatibility Ranking:
 *
 * 1. Conscious Opposition (180°) - Cathedral pairs, complete systems
 * 2. Cardinal-Mutable Complementarity - Initiator + Adapter
 * 3. Cross-Element Functional Pairs - Fire+Earth, Air+Water
 * 4. Mutable-Mutable (Different Elements) - Highly adaptive
 * 5. Cardinal-Fixed (Different Elements) - Starter + Sustainer
 * 6. Trines (Same Element) - Easy but low growth
 * 7. Fixed-Fixed (Same Element) - Durable but resistant to change
 *
 * Key Insight: The best compatibility is not who feels easiest —
 * it's who makes your life function better across seasons.
 */
export type CompatibilityRankType =
  | 'conscious_opposition'
  | 'cardinal_mutable'
  | 'cross_element'
  | 'mutable_mutable'
  | 'cardinal_fixed'
  | 'trine'
  | 'fixed_fixed';

export interface CompatibilityRankInfo {
  rank: number;           // 1 = best
  type: CompatibilityRankType;
  name: string;
  description: string;
  examples: string[];
  strengthNote: string;
  limitationNote?: string;
}
