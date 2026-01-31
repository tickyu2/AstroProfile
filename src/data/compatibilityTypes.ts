/**
 * compatibilityTypes.ts
 * =====================
 *
 * Core types for the elemental compatibility system.
 * Based on the φ-curve zodiac blend wheel, this system calculates
 * compatibility grades (A, B, Neutral) between elemental profiles.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// ELEMENT TYPES
// =============================================================================

export type Element = 'fire' | 'earth' | 'air' | 'water';

export interface ElementVector {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

// =============================================================================
// PERSON PROFILE
// =============================================================================

export interface PersonProfile {
  id: string;
  date: string;           // "YYYY-MM-DD" or display format
  sign: string;           // Primary zodiac sign
  elements: ElementVector;
  blendSign?: string;     // Optional blend sign for cusp days
  blendPercent?: number;  // 0-1 blend percentage
}

// =============================================================================
// COMPATIBILITY GRADES
// =============================================================================

/**
 * Compatibility Grade System:
 * - A: Natural harmony (Fire-Air, Earth-Water)
 * - B: Growth potential with effort (Fire-Earth, Air-Water, Fire-Water, Earth-Air)
 * - Neutral: Same element pairs (can be intense or stagnant)
 */
export type CompatibilityGrade = 'A' | 'B' | 'Neutral';

// =============================================================================
// NARRATIVE STRUCTURE
// =============================================================================

export interface ElementPairNarrative {
  pairId: string;              // e.g. "fire-air" (sorted alphabetically)
  grade: CompatibilityGrade;
  title: string;               // e.g. "Fire & Air — Spark and Wind"
  chemistry: string;           // How you energize each other
  communication: string;       // How you talk and connect
  loveLanguage: string;        // How you show and receive love
  conflict: string;            // Your friction patterns
  growth: string;              // Your growth opportunity together
  emoji: string;               // Visual representation
}

// =============================================================================
// COMPATIBILITY RESULT
// =============================================================================

export interface CompatibilityResult {
  personA: PersonProfile;
  personB: PersonProfile;
  dominantA: Element;
  dominantB: Element;
  grade: CompatibilityGrade;
  pairId: string;
  narrative: ElementPairNarrative;
  score: number;               // 0-1 fine-tuned compatibility score
  secondaryElements?: {        // For nuanced readings
    a: Element;
    b: Element;
  };
}

// =============================================================================
// WHEEL HIGHLIGHT TYPES
// =============================================================================

export interface CompatibilityHighlight {
  date: string;
  grade: CompatibilityGrade;
  score: number;
  dominantElement: Element;
}

export interface CompatibilityMode {
  active: boolean;
  anchorProfile: PersonProfile | null;
  highlights: Map<string, CompatibilityHighlight>;
}

// =============================================================================
// GRADE COLORS FOR VISUALIZATION
// =============================================================================

export const GRADE_COLORS: Record<CompatibilityGrade, { fill: string; glow: string; opacity: number }> = {
  A: {
    fill: '#ffd700',      // Golden
    glow: 'rgba(255, 215, 0, 0.6)',
    opacity: 1.0,
  },
  B: {
    fill: '#87ceeb',      // Sky blue
    glow: 'rgba(135, 206, 235, 0.4)',
    opacity: 0.85,
  },
  Neutral: {
    fill: '#666666',
    glow: 'rgba(100, 100, 100, 0.2)',
    opacity: 0.4,
  },
};

// =============================================================================
// ELEMENT EMOJIS
// =============================================================================

export const ELEMENT_EMOJI: Record<Element, string> = {
  fire: '🔥',
  earth: '🌍',
  air: '💨',
  water: '💧',
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  GRADE_COLORS,
  ELEMENT_EMOJI,
};
