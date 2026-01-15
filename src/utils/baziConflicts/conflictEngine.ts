/**
 * ============================================================================
 * CONFLICT ENGINE - Unified Detection
 * ============================================================================
 *
 * This engine combines all four conflict types into a unified detection system:
 * - Clash (冲) - Direct opposition, movement, change
 * - Harm (害) - Subtle friction, undermining, irritation
 * - Punishment (刑) - Internal tension, pressure, self-conflict
 * - Destruction (破) - Minor breaking, dissolution, interruption
 *
 * Severity Hierarchy (most to least severe):
 * 1. Clash (冲) - Most impactful, brings major change
 * 2. Punishment (刑) - Internal pressure, karmic patterns
 * 3. Harm (害) - Subtle but persistent friction
 * 4. Destruction (破) - Minor disruptions
 *
 * Joey Yap teaching:
 * "Understanding conflicts is not about fear - it's about awareness.
 *  When you know the weather forecast, you can bring an umbrella."
 *
 * Created: January 2026
 * ============================================================================
 */

import { detectClashes, ClashHit, PillarName } from './clashRules';
import { detectHarms, HarmHit } from './harmRules';
import { detectPunishments, PunishmentHit } from './punishmentRules';
import { detectDestructions, DestructionHit } from './destructionRules';

// ============================================================================
// TYPES
// ============================================================================

export type ConflictHit = ClashHit | HarmHit | PunishmentHit | DestructionHit;

export type ConflictType = 'clash' | 'harm' | 'punishment' | 'destruction';

export interface ConflictSummary {
  totalConflicts: number;
  byType: {
    clashes: ClashHit[];
    harms: HarmHit[];
    punishments: PunishmentHit[];
    destructions: DestructionHit[];
  };
  bySignificance: {
    major: ConflictHit[];
    moderate: ConflictHit[];
    minor: ConflictHit[];
  };
  severityScore: number;  // 0-100 scale
  hasConflict: boolean;
  dominantConflict: ConflictHit | null;
}

export interface ConflictAnalysis {
  summary: ConflictSummary;
  allHits: ConflictHit[];
  interpretation: string;
  recommendations: string[];
}

// ============================================================================
// SEVERITY WEIGHTS
// ============================================================================

/**
 * Severity weights for calculating overall conflict score
 */
export const CONFLICT_SEVERITY_WEIGHTS: Record<ConflictType, number> = {
  clash: 1.0,        // Most severe
  punishment: 0.8,   // Internal tension
  harm: 0.6,         // Subtle friction
  destruction: 0.4   // Minor disruption
};

const SIGNIFICANCE_MULTIPLIERS = {
  major: 1.0,
  moderate: 0.6,
  minor: 0.3
};

// ============================================================================
// MAIN DETECTION FUNCTION
// ============================================================================

/**
 * Detect all conflicts in a set of branches
 */
export function detectAllConflicts(branches: Record<PillarName, string>): ConflictAnalysis {
  // Detect each conflict type
  const clashes = detectClashes(branches);
  const harms = detectHarms(branches);
  const punishments = detectPunishments(branches);
  const destructions = detectDestructions(branches);

  // Combine all hits
  const allHits: ConflictHit[] = [
    ...clashes,
    ...harms,
    ...punishments,
    ...destructions
  ];

  // Sort by severity (clash > punishment > harm > destruction)
  const sortedHits = allHits.sort((a, b) => {
    const severityA = CONFLICT_SEVERITY_WEIGHTS[a.type as ConflictType];
    const severityB = CONFLICT_SEVERITY_WEIGHTS[b.type as ConflictType];
    if (severityA !== severityB) return severityB - severityA;

    // If same type, sort by significance
    const sigOrder = { major: 3, moderate: 2, minor: 1 };
    return sigOrder[b.significance] - sigOrder[a.significance];
  });

  // Group by significance
  const bySignificance = {
    major: sortedHits.filter(h => h.significance === 'major'),
    moderate: sortedHits.filter(h => h.significance === 'moderate'),
    minor: sortedHits.filter(h => h.significance === 'minor')
  };

  // Calculate severity score (0-100)
  const severityScore = calculateSeverityScore(allHits);

  // Build summary
  const summary: ConflictSummary = {
    totalConflicts: allHits.length,
    byType: {
      clashes,
      harms,
      punishments,
      destructions
    },
    bySignificance,
    severityScore,
    hasConflict: allHits.length > 0,
    dominantConflict: sortedHits[0] || null
  };

  // Generate interpretation and recommendations
  const interpretation = generateInterpretation(summary);
  const recommendations = generateRecommendations(summary);

  return {
    summary,
    allHits: sortedHits,
    interpretation,
    recommendations
  };
}

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Calculate overall severity score (0-100)
 */
function calculateSeverityScore(hits: ConflictHit[]): number {
  if (hits.length === 0) return 0;

  let totalScore = 0;
  let maxPossible = 0;

  hits.forEach(hit => {
    const typeWeight = CONFLICT_SEVERITY_WEIGHTS[hit.type as ConflictType];
    const sigMultiplier = SIGNIFICANCE_MULTIPLIERS[hit.significance];
    totalScore += typeWeight * sigMultiplier * 25;  // 25 points base per conflict
    maxPossible += 25;
  });

  // Normalize to 0-100, cap at 100
  const normalizedScore = Math.min(100, (totalScore / Math.max(maxPossible, 1)) * 100);

  // Apply diminishing returns for many minor conflicts
  return Math.round(normalizedScore);
}

// ============================================================================
// INTERPRETATION FUNCTIONS
// ============================================================================

/**
 * Generate natural language interpretation
 */
function generateInterpretation(summary: ConflictSummary): string {
  if (!summary.hasConflict) {
    return 'This chart shows harmonious branch relationships. The pillars work together without significant friction, suggesting smooth energy flow between life areas.';
  }

  const parts: string[] = [];

  // Overall assessment
  if (summary.severityScore >= 70) {
    parts.push('This chart contains significant internal tensions that require careful navigation.');
  } else if (summary.severityScore >= 40) {
    parts.push('This chart has moderate conflict patterns that create dynamic energy.');
  } else {
    parts.push('This chart has minor conflict patterns that add texture without major disruption.');
  }

  // Dominant conflict
  if (summary.dominantConflict) {
    const dominant = summary.dominantConflict;
    if (dominant.type === 'clash') {
      parts.push(`The most significant pattern is a ${(dominant as ClashHit).definition.nature}, bringing movement and change.`);
    } else if (dominant.type === 'punishment') {
      parts.push(`Notable internal tension from ${(dominant as PunishmentHit).definition.nature}, creating pressure for growth.`);
    } else if (dominant.type === 'harm') {
      parts.push(`Subtle friction from ${(dominant as HarmHit).definition.nature} may cause persistent irritation.`);
    }
  }

  // Type counts
  const typeCounts: string[] = [];
  if (summary.byType.clashes.length > 0) {
    typeCounts.push(`${summary.byType.clashes.length} clash${summary.byType.clashes.length > 1 ? 'es' : ''}`);
  }
  if (summary.byType.punishments.length > 0) {
    typeCounts.push(`${summary.byType.punishments.length} punishment${summary.byType.punishments.length > 1 ? 's' : ''}`);
  }
  if (summary.byType.harms.length > 0) {
    typeCounts.push(`${summary.byType.harms.length} harm${summary.byType.harms.length > 1 ? 's' : ''}`);
  }
  if (summary.byType.destructions.length > 0) {
    typeCounts.push(`${summary.byType.destructions.length} destruction${summary.byType.destructions.length > 1 ? 's' : ''}`);
  }

  if (typeCounts.length > 0) {
    parts.push(`Detected: ${typeCounts.join(', ')}.`);
  }

  return parts.join(' ');
}

/**
 * Generate recommendations based on conflicts
 */
function generateRecommendations(summary: ConflictSummary): string[] {
  const recommendations: string[] = [];

  if (!summary.hasConflict) {
    recommendations.push('Continue leveraging the harmonious energy flow between life areas.');
    return recommendations;
  }

  // Add recommendations based on conflict types present
  if (summary.byType.clashes.length > 0) {
    recommendations.push('Embrace change rather than resisting it. Clashes bring movement and new opportunities.');
  }

  if (summary.byType.punishments.length > 0) {
    const hasSelfPunishment = summary.byType.punishments.some(p => p.punishmentType === 'self');
    if (hasSelfPunishment) {
      recommendations.push('Practice self-compassion. Your inner critic may be too harsh.');
    }
    recommendations.push('Transform internal pressure into productive drive. Channel tension constructively.');
  }

  if (summary.byType.harms.length > 0) {
    recommendations.push('Address small irritations before they accumulate. Clear communication prevents resentment.');
  }

  if (summary.byType.destructions.length > 0) {
    recommendations.push('Build in buffer time for minor setbacks. Expect small interruptions and plan accordingly.');
  }

  // General recommendation based on severity
  if (summary.severityScore >= 60) {
    recommendations.push('Consider meditation or mindfulness practices to manage the dynamic energy in your chart.');
  }

  return recommendations;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a specific conflict exists between two branches
 */
export function getConflictBetween(branch1: string, branch2: string): ConflictType[] {
  const conflicts: ConflictType[] = [];

  // Import individual check functions
  const { doTheyClash } = require('./clashRules');
  const { doTheyHarm } = require('./harmRules');
  const { doTheyPunish } = require('./punishmentRules');
  const { doTheyDestroy } = require('./destructionRules');

  if (doTheyClash(branch1, branch2)) conflicts.push('clash');
  if (doTheyHarm(branch1, branch2)) conflicts.push('harm');
  if (doTheyPunish(branch1, branch2)) conflicts.push('punishment');
  if (doTheyDestroy(branch1, branch2)) conflicts.push('destruction');

  return conflicts;
}

/**
 * Get all potential conflict partners for a branch
 */
export function getConflictPartners(branch: string): Record<ConflictType, string[]> {
  const { getClashPartner } = require('./clashRules');
  const { getHarmPartner } = require('./harmRules');
  const { getPunishmentPartners } = require('./punishmentRules');
  const { getDestructionPartner } = require('./destructionRules');

  const clashPartner = getClashPartner(branch);
  const harmPartner = getHarmPartner(branch);
  const punishmentInfo = getPunishmentPartners(branch);
  const destructionPartner = getDestructionPartner(branch);

  return {
    clash: clashPartner ? [clashPartner] : [],
    harm: harmPartner ? [harmPartner] : [],
    punishment: punishmentInfo ? punishmentInfo.partners : [],
    destruction: destructionPartner ? [destructionPartner] : []
  };
}

/**
 * Analyze conflicts between two different people's charts (synastry)
 */
export function analyzeConflictSynastry(
  person1Branches: Record<PillarName, string>,
  person2Branches: Record<PillarName, string>
): {
  crossConflicts: ConflictHit[];
  compatibilityScore: number;
  interpretation: string;
} {
  const crossConflicts: ConflictHit[] = [];

  // Check each pillar combination between the two charts
  const p1Entries = Object.entries(person1Branches) as [PillarName, string][];
  const p2Entries = Object.entries(person2Branches) as [PillarName, string][];

  for (const [pillar1, branch1] of p1Entries) {
    for (const [pillar2, branch2] of p2Entries) {
      const conflicts = getConflictBetween(branch1, branch2);

      for (const conflictType of conflicts) {
        crossConflicts.push({
          type: conflictType,
          branch1,
          branch2,
          pillar1: `Person1-${pillar1}`,
          pillar2: `Person2-${pillar2}`,
          significance: 'moderate',  // Cross-chart conflicts are generally moderate
          explanation: `${branch1}↔${branch2} ${conflictType} between Person 1's ${pillar1} and Person 2's ${pillar2}`
        } as ConflictHit);
      }
    }
  }

  // Calculate compatibility score (inverse of conflict severity)
  const conflictPenalty = crossConflicts.reduce((sum, hit) => {
    return sum + CONFLICT_SEVERITY_WEIGHTS[hit.type as ConflictType] * 5;
  }, 0);

  const compatibilityScore = Math.max(0, 100 - conflictPenalty);

  // Generate interpretation
  let interpretation: string;
  if (crossConflicts.length === 0) {
    interpretation = 'No significant branch conflicts between charts. Energy flows smoothly in the relationship.';
  } else if (compatibilityScore >= 70) {
    interpretation = 'Minor friction points exist but overall compatibility is good. Small adjustments needed.';
  } else if (compatibilityScore >= 40) {
    interpretation = 'Moderate conflict patterns require conscious navigation. Growth through challenge.';
  } else {
    interpretation = 'Significant friction in the relationship. Requires strong commitment and communication.';
  }

  return {
    crossConflicts,
    compatibilityScore,
    interpretation
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  detectAllConflicts,
  getConflictBetween,
  getConflictPartners,
  analyzeConflictSynastry,
  CONFLICT_SEVERITY_WEIGHTS
};
