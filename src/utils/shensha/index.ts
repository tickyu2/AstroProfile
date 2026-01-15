/**
 * ============================================================================
 * SHEN SHA MODULE (神煞模块)
 * ============================================================================
 *
 * The complete Shen Sha (Symbolic Stars) module for BaZi chart analysis.
 *
 * This module provides:
 * - 30+ classical Shen Sha definitions (shenshaDefs)
 * - Detection rules based on classical formulas (shenshaRules)
 * - Detection engine for finding stars in charts (shenshaEngine)
 * - Story mode narratives for beginner-friendly explanations (shenshaNarrative)
 *
 * Usage:
 * ```typescript
 * import { detectShenSha, buildShenShaStory } from '@/utils/shensha';
 *
 * const pillars = {
 *   yearStem: '甲', yearBranch: '子',
 *   monthStem: '丙', monthBranch: '寅',
 *   dayStem: '戊', dayBranch: '午',
 *   hourStem: '庚', hourBranch: '申'
 * };
 *
 * const result = detectShenSha(pillars);
 * const story = buildShenShaStory(result);
 * ```
 *
 * Created: January 2026
 * Based on: Joey Yap's classical, non-superstitious Shen Sha methodology
 * ============================================================================
 */

// ============================================================================
// DEFINITIONS
// ============================================================================

export {
  // Types
  ShenShaCategory,
  ShenShaPolarity,
  ShenShaDefinition,

  // Libraries
  SHEN_SHA_LIBRARY,
  CATEGORY_META,
  RELATIONSHIP_STARS,
  INTELLIGENCE_STARS,
  NOBLEMAN_STARS,
  MOVEMENT_STARS,
  WEALTH_STARS,
  CHALLENGE_STARS,
  SPIRITUAL_STARS,

  // Helpers
  getStarsByCategory,
  getAuspiciousStars,
  getInauspiciousStars,
  getStarDefinition
} from './shenshaDefs';

// ============================================================================
// DETECTION RULES
// ============================================================================

export {
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
} from './shenshaRules';

// ============================================================================
// DETECTION ENGINE
// ============================================================================

export {
  // Types
  FourPillarsInput,
  PillarName,
  ShenShaHit,
  ShenShaResult,

  // Main function
  detectShenSha,

  // Quick helpers
  hasStarInChart,
  getStarsInCategory,
  hasNobleman,
  hasPeachBlossom,
  hasTravelingHorse
} from './shenshaEngine';

// ============================================================================
// NARRATIVE / STORY MODE
// ============================================================================

export {
  // Main builders
  buildShenShaStory,
  buildPairShenShaStory,

  // UI helpers
  getStarSummary,
  getStarSummaries,

  // Metaphors
  STAR_METAPHORS,
  PILLAR_MEANINGS
} from './shenshaNarrative';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

import { detectShenSha } from './shenshaEngine';
import { buildShenShaStory, buildPairShenShaStory } from './shenshaNarrative';
import { SHEN_SHA_LIBRARY, CATEGORY_META } from './shenshaDefs';

export default {
  // Core functions
  detectShenSha,
  buildShenShaStory,
  buildPairShenShaStory,

  // Libraries
  SHEN_SHA_LIBRARY,
  CATEGORY_META
};
