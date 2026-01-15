/**
 * ============================================================================
 * BAZI CONFLICTS MODULE - 冲害刑破
 * ============================================================================
 *
 * Complete conflict detection system for BaZi Four Pillars analysis.
 * Detects and interprets the four classical branch conflict types:
 *
 * 1. Clash (冲) - Direct opposition, movement, change
 * 2. Harm (害) - Subtle friction, undermining, irritation
 * 3. Punishment (刑) - Internal tension, pressure, self-conflict
 * 4. Destruction (破) - Minor breaking, dissolution, interruption
 *
 * Severity Hierarchy (most to least severe):
 * Clash > Punishment > Harm > Destruction
 *
 * Usage:
 * ```typescript
 * import { detectAllConflicts, buildConflictStory } from '@/utils/baziConflicts';
 *
 * const branches = {
 *   year: '子',
 *   month: '午',
 *   day: '寅',
 *   hour: '申'
 * };
 *
 * const analysis = detectAllConflicts(branches);
 * const story = buildConflictStory(analysis);
 * ```
 *
 * Created: January 2026
 * Based on: Classical BaZi conflict doctrine (Joey Yap methodology)
 * ============================================================================
 */

// ============================================================================
// CLASH EXPORTS (冲)
// ============================================================================

export {
  CLASH_PAIRS,
  CLASH_DEFINITIONS,
  detectClashes,
  doTheyClash,
  getClashPartner,
  getClashDefinition,
  getClashSignificance,
  type ClashDefinition,
  type ClashHit,
  type PillarName
} from './clashRules';

// ============================================================================
// HARM EXPORTS (害)
// ============================================================================

export {
  HARM_PAIRS,
  HARM_DEFINITIONS,
  detectHarms,
  doTheyHarm,
  getHarmPartner,
  getHarmDefinition,
  getHarmSignificance,
  type HarmDefinition,
  type HarmHit
} from './harmRules';

// ============================================================================
// PUNISHMENT EXPORTS (刑)
// ============================================================================

export {
  SELF_PUNISHMENT_BRANCHES,
  SELF_PUNISHMENT_DEFINITIONS,
  MUTUAL_PUNISHMENT_GROUPS,
  MUTUAL_PUNISHMENT_DEFINITIONS,
  MUTUAL_PUNISHMENT_PAIRS,
  UNCIVILIZED_PUNISHMENT_PAIR,
  UNCIVILIZED_PUNISHMENT_DEFINITION,
  detectPunishments,
  doTheyPunish,
  getPunishmentPartners,
  getPunishmentSignificance,
  type PunishmentType,
  type PunishmentDefinition,
  type PunishmentHit
} from './punishmentRules';

// ============================================================================
// DESTRUCTION EXPORTS (破)
// ============================================================================

export {
  DESTRUCTION_PAIRS,
  DESTRUCTION_DEFINITIONS,
  detectDestructions,
  doTheyDestroy,
  getDestructionPartner,
  getDestructionDefinition,
  getDestructionSignificance,
  type DestructionDefinition,
  type DestructionHit
} from './destructionRules';

// ============================================================================
// CONFLICT ENGINE EXPORTS
// ============================================================================

export {
  detectAllConflicts,
  getConflictBetween,
  getConflictPartners,
  analyzeConflictSynastry,
  CONFLICT_SEVERITY_WEIGHTS,
  type ConflictHit,
  type ConflictType,
  type ConflictSummary,
  type ConflictAnalysis
} from './conflictEngine';

// ============================================================================
// NARRATIVE EXPORTS
// ============================================================================

export {
  buildConflictStory,
  buildConflictSummaryText,
  type ConflictStory
} from './conflictNarrative';

// ============================================================================
// CONVENIENCE CONSTANTS
// ============================================================================

/**
 * All conflict types in severity order
 */
export const CONFLICT_TYPES = ['clash', 'punishment', 'harm', 'destruction'] as const;

/**
 * Chinese names for conflict types
 */
export const CONFLICT_CHINESE_NAMES: Record<string, string> = {
  clash: '冲',
  harm: '害',
  punishment: '刑',
  destruction: '破'
};

/**
 * English descriptions for conflict types
 */
export const CONFLICT_DESCRIPTIONS: Record<string, string> = {
  clash: 'Direct opposition bringing movement and change',
  harm: 'Subtle friction causing persistent irritation',
  punishment: 'Internal tension creating pressure for growth',
  destruction: 'Minor disruption causing small setbacks'
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

import { detectAllConflicts, analyzeConflictSynastry } from './conflictEngine';
import { buildConflictStory, buildConflictSummaryText } from './conflictNarrative';

export default {
  // Main detection
  detectAllConflicts,
  analyzeConflictSynastry,

  // Narrative
  buildConflictStory,
  buildConflictSummaryText,

  // Constants
  CONFLICT_TYPES,
  CONFLICT_CHINESE_NAMES,
  CONFLICT_DESCRIPTIONS
};
