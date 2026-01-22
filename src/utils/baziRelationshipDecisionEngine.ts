/**
 * ============================================================================
 * BAZI RELATIONSHIP DECISION ENGINE (关系决策引擎)
 * ============================================================================
 *
 * A timing-aware guidance system for real-world relationship choices.
 * This is where metaphysics becomes decision intelligence.
 *
 * This module answers:
 * - "Is now a good time to commit?"
 * - "Is this a good window for reconciliation?"
 * - "Should we start a project together now?"
 * - "Is this a good time for difficult conversations?"
 * - "When is the relationship most supported?"
 * - "When should we avoid major decisions?"
 *
 * Four Decision Domains:
 * 1. Emotional Decisions (情感决策) - Vulnerability, bonding, deep conversations
 * 2. Commitment Decisions (承诺决策) - DTR, engagement, marriage, long-term
 * 3. Practical Decisions (实际决策) - Finances, projects, travel, relocation
 * 4. Conflict Decisions (冲突决策) - When to address issues, when to pause
 *
 * Decision Score Formula:
 *   0.35 × Composite Event Score
 * + 0.25 × Lifecycle Phase Score
 * + 0.20 × Synastry Resonance
 * + 0.20 × Useful God Alignment
 * + Adjustments for Shen Sha, destiny arc, clashes
 *
 * Based on: Classical 命理 timing wisdom
 * Aligned with: Practical relationship guidance
 * Created: January 2026
 * ============================================================================
 */

import type { CompositeChart } from './baziCompositeChart';
import type { SynastryHeatmap } from './baziSynastryHeatmap';
import type { RelationshipLifecycleResult, LifecyclePhase } from './baziRelationshipLifecycle';
import type { CompositeEventTriggerResult } from './baziCompositeEventTrigger';
import type { TrajectoryCurve } from './baziTrajectory';
import type { RelationshipArchetypeResult } from './baziRelationshipArchetypes';
import type { LifeThemes } from './baziLifeThemes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type StemName = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type BranchName = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/**
 * Time unit for decision analysis
 */
export type TimeUnit = 'year' | 'month' | 'day' | 'hour';

/**
 * Decision domain
 */
export type DecisionDomain = 'emotional' | 'commitment' | 'practical' | 'conflict';

/**
 * Decision tier classification
 */
export type DecisionTier = 'do_now' | 'good_window' | 'neutral' | 'delay' | 'avoid';

/**
 * Decision input data
 */
export interface DecisionInput {
  // Core data
  composite: CompositeChart;
  synastry: SynastryHeatmap;

  // Optional enrichment
  lifecycle?: RelationshipLifecycleResult;
  eventTrigger?: CompositeEventTriggerResult;
  trajectory?: TrajectoryCurve;
  archetype?: RelationshipArchetypeResult;
  lifeThemes?: LifeThemes;

  // Timing context
  targetYear?: number;
  targetMonth?: number;
  targetDay?: number;
  targetHour?: number;

  // Relationship context
  relationshipStartDate?: Date;
  relationshipType?: 'romantic' | 'business' | 'friendship' | 'family';
}

/**
 * Score breakdown for transparency
 */
export interface ScoreBreakdown {
  baseScore: number;
  eventContribution: number;
  lifecycleContribution: number;
  synastryContribution: number;
  usefulGodContribution: number;
  adjustments: Array<{
    factor: string;
    amount: number;
    reason: string;
  }>;
  finalScore: number;
}

/**
 * Single domain decision result
 */
export interface DomainDecision {
  domain: DecisionDomain;
  domainChinese: string;
  score: number;
  tier: DecisionTier;
  tierChinese: string;
  guidance: string;
  detailedGuidance: string;
  actions: string[];
  cautions: string[];
  scoreBreakdown: ScoreBreakdown;
}

/**
 * Timing window
 */
export interface TimingWindow {
  timeUnit: TimeUnit;
  period: string;
  score: number;
  tier: DecisionTier;
  domains: DecisionDomain[];
  theme: string;
  recommendation: string;
}

/**
 * Decision timeline entry
 */
export interface DecisionTimelineEntry {
  year: number;
  month?: number;
  overallScore: number;
  tier: DecisionTier;
  dominantDomain: DecisionDomain;
  keyFactors: string[];
  recommendation: string;
}

/**
 * Complete decision engine result
 */
export interface RelationshipDecisionResult {
  // Context
  targetPeriod: string;
  timeUnit: TimeUnit;

  // Overall decision
  overallScore: number;
  overallTier: DecisionTier;
  overallTierChinese: string;
  overallGuidance: string;

  // Domain-specific decisions
  emotional: DomainDecision;
  commitment: DomainDecision;
  practical: DomainDecision;
  conflict: DomainDecision;

  // Timing windows
  optimalWindows: TimingWindow[];
  cautionWindows: TimingWindow[];

  // Timeline
  timeline: DecisionTimelineEntry[];

  // Key insights
  keyInsights: string[];
  criticalFactors: string[];

  // Metadata
  computedAt: string;
  dataQuality: 'full' | 'partial' | 'minimal';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEMENT_CHINESE: Record<ElementName, string> = {
  Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
};

const DOMAIN_CHINESE: Record<DecisionDomain, string> = {
  emotional: '情感决策',
  commitment: '承诺决策',
  practical: '实际决策',
  conflict: '冲突决策'
};

const TIER_CHINESE: Record<DecisionTier, string> = {
  do_now: '立即行动',
  good_window: '良好时机',
  neutral: '中性窗口',
  delay: '建议延迟',
  avoid: '避免行动'
};

const _TIER_THRESHOLDS: Record<DecisionTier, { min: number; max: number }> = {
  do_now: { min: 80, max: 100 },
  good_window: { min: 65, max: 79 },
  neutral: { min: 45, max: 64 },
  delay: { min: 30, max: 44 },
  avoid: { min: 0, max: 29 }
};

const LIFECYCLE_PHASE_SCORES: Record<LifecyclePhase, Record<DecisionDomain, number>> = {
  initiation: {
    emotional: 75,    // Good for emotional exploration
    commitment: 40,   // Too early for commitment
    practical: 50,    // Neutral for practical
    conflict: 30      // Avoid major conflicts early
  },
  fusion: {
    emotional: 85,    // Excellent for emotional bonding
    commitment: 60,   // Building toward commitment
    practical: 55,    // Starting to collaborate
    conflict: 45      // Can address minor issues
  },
  stabilization: {
    emotional: 70,    // Good ongoing emotional work
    commitment: 80,   // Excellent for commitment
    practical: 75,    // Good for shared projects
    conflict: 60      // Can address issues
  },
  expansion: {
    emotional: 65,    // Steady emotional state
    commitment: 75,   // Good for deepening
    practical: 85,    // Excellent for projects
    conflict: 55      // Moderate for conflicts
  },
  challenge: {
    emotional: 50,    // Challenging for emotions
    commitment: 35,   // Not ideal for commitment
    practical: 40,    // Difficult for new projects
    conflict: 70      // May need to address issues
  },
  recalibration: {
    emotional: 60,    // Healing emotional work
    commitment: 50,   // Reassessing commitment
    practical: 45,    // Pause on expansion
    conflict: 65      // Good for resolution
  },
  maturation: {
    emotional: 70,    // Deep emotional wisdom
    commitment: 85,   // Strong for long-term
    practical: 80,    // Mature collaboration
    conflict: 75      // Wise conflict handling
  }
};

// ============================================================================
// SCORE COMPUTATION
// ============================================================================

/**
 * Compute the base decision score for a specific domain
 */
export function computeDomainScore(
  domain: DecisionDomain,
  input: DecisionInput
): ScoreBreakdown {
  const { composite, synastry, lifecycle, eventTrigger, trajectory } = input;

  let baseScore = 50; // Start at neutral
  const adjustments: ScoreBreakdown['adjustments'] = [];

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Event Trigger Contribution (35%)
  // ─────────────────────────────────────────────────────────────────────────
  let eventContribution = 0;

  if (eventTrigger) {
    const eventScore = eventTrigger.overallScore ?? 50;
    eventContribution = eventScore * 0.35;

    // Domain-specific event adjustments using actual event types
    if (domain === 'emotional' && eventTrigger.synastryResonance?.romanticActivation) {
      adjustments.push({
        factor: 'Romantic Activation',
        amount: 8,
        reason: 'Romantic energy supports emotional bonding'
      });
    }

    if (domain === 'commitment' && eventTrigger.relationshipEvent?.tier === 'strong') {
      adjustments.push({
        factor: 'Commitment Window',
        amount: 12,
        reason: 'Strong relationship event timing supports commitment decisions'
      });
    }

    if (domain === 'practical' && eventTrigger.growthEvent?.tier === 'strong') {
      adjustments.push({
        factor: 'Project Window',
        amount: 10,
        reason: 'Growth event energy supports shared ventures'
      });
    }

    if (domain === 'conflict' && eventTrigger.challengeEvent?.tier !== 'strong') {
      adjustments.push({
        factor: 'Low Challenge Energy',
        amount: 10,
        reason: 'Minimal challenge activation aids conflict resolution'
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Lifecycle Phase Contribution (25%)
  // ─────────────────────────────────────────────────────────────────────────
  let lifecycleContribution = 0;

  if (lifecycle) {
    const phaseId = lifecycle.currentPhase.id;
    const phaseScore = LIFECYCLE_PHASE_SCORES[phaseId]?.[domain] ?? 50;
    lifecycleContribution = phaseScore * 0.25;

    // Phase-specific adjustments
    if (phaseId === 'challenge' && domain !== 'conflict') {
      adjustments.push({
        factor: 'Challenge Phase',
        amount: -10,
        reason: 'Relationship in challenge phase - proceed with care'
      });
    }

    if (phaseId === 'maturation' && domain === 'commitment') {
      adjustments.push({
        factor: 'Maturation Phase',
        amount: 8,
        reason: 'Mature relationship supports deep commitment'
      });
    }
  } else {
    // Default lifecycle contribution
    lifecycleContribution = 50 * 0.25;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Synastry Resonance Contribution (20%)
  // ─────────────────────────────────────────────────────────────────────────
  let synastryContribution = 0;

  if (synastry) {
    const synScore = synastry.overallScore ?? 50;
    synastryContribution = synScore * 0.20;

    // Domain-specific synastry adjustments
    if (domain === 'emotional' && synastry.romanceHotspots?.length > 0) {
      adjustments.push({
        factor: 'Romance Hotspots',
        amount: 6,
        reason: `${synastry.romanceHotspots.length} romance activation points`
      });
    }

    if (synastry.strongestTension && domain === 'conflict') {
      // Tension points are relevant for conflict decisions
      adjustments.push({
        factor: 'Tension Awareness',
        amount: 5,
        reason: 'Awareness of tension points aids conflict resolution'
      });
    }

    if (synastry.strongestHarmony && domain === 'commitment') {
      adjustments.push({
        factor: 'Strong Harmony',
        amount: 5,
        reason: 'Natural harmony supports commitment'
      });
    }
  } else {
    synastryContribution = 50 * 0.20;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Useful God Alignment Contribution (20%)
  // ─────────────────────────────────────────────────────────────────────────
  let usefulGodContribution = 0;

  if (composite.usefulGod) {
    const usefulGodElement = composite.usefulGod.element;

    // Check if current timing activates Useful God
    const currentYear = input.targetYear || new Date().getFullYear();
    const yearElement = getYearElement(currentYear);

    if (yearElement === usefulGodElement) {
      usefulGodContribution = 80 * 0.20;
      adjustments.push({
        factor: 'Useful God Year',
        amount: 15,
        reason: `${usefulGodElement} year aligns with relationship's Useful God`
      });
    } else if (producesElement(yearElement, usefulGodElement)) {
      usefulGodContribution = 65 * 0.20;
      adjustments.push({
        factor: 'Useful God Support',
        amount: 8,
        reason: `${yearElement} year supports ${usefulGodElement} Useful God`
      });
    } else if (composite.usefulGod.avoidElements?.includes(yearElement)) {
      usefulGodContribution = 30 * 0.20;
      adjustments.push({
        factor: 'Annoying God Active',
        amount: -12,
        reason: `${yearElement} year activates destabilizing energy`
      });
    } else {
      usefulGodContribution = 50 * 0.20;
    }
  } else {
    usefulGodContribution = 50 * 0.20;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Shen Sha Adjustments
  // ─────────────────────────────────────────────────────────────────────────
  if (composite.shenSha) {
    // Nobleman (贵人)
    const hasNobleman = composite.shenSha.some(s => s.name === 'Heavenly Nobleman');
    if (hasNobleman) {
      adjustments.push({
        factor: 'Heavenly Nobleman',
        amount: 10,
        reason: 'Noble energy protects and supports decisions'
      });
    }

    // Peach Blossom / Red Matchmaker for emotional
    if (domain === 'emotional') {
      const hasRomantic = composite.shenSha.some(s =>
        s.name === 'Peach Blossom' || s.name === 'Red Matchmaker'
      );
      if (hasRomantic) {
        adjustments.push({
          factor: 'Romantic Stars',
          amount: 8,
          reason: 'Romantic Shen Sha support emotional bonding'
        });
      }
    }

    // Academic Star for practical
    if (domain === 'practical') {
      const hasAcademic = composite.shenSha.some(s => s.name === 'Academic Star');
      if (hasAcademic) {
        adjustments.push({
          factor: 'Academic Star',
          amount: 6,
          reason: 'Supports intellectual collaboration'
        });
      }
    }

    // Challenging stars
    const hasLoneliness = composite.shenSha.some(s =>
      s.name === 'Loneliness Star' || s.name === 'Widow Star'
    );
    if (hasLoneliness && domain === 'commitment') {
      adjustments.push({
        factor: 'Separation Stars',
        amount: -8,
        reason: 'Navigate independence needs carefully'
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Trajectory Adjustments
  // ─────────────────────────────────────────────────────────────────────────
  if (trajectory) {
    const currentYear = input.targetYear || new Date().getFullYear();
    const currentPoint = trajectory.points?.find(p =>
      Math.round(p.t) === currentYear
    );

    if (currentPoint) {
      // Rising trajectory - use overallTrend instead of currentSlope
      if (trajectory.overallTrend === 'ascending') {
        adjustments.push({
          factor: 'Rising Destiny Arc',
          amount: 10,
          reason: 'Relationship trajectory is ascending'
        });
      }

      // Falling trajectory
      if (trajectory.overallTrend === 'descending') {
        adjustments.push({
          factor: 'Falling Destiny Arc',
          amount: -10,
          reason: 'Relationship trajectory is descending'
        });
      }

      // Peak period
      if (currentPoint.score >= 75) {
        adjustments.push({
          factor: 'Peak Period',
          amount: 12,
          reason: 'Currently in a high-energy window'
        });
      }

      // Valley period
      if (currentPoint.score <= 35) {
        adjustments.push({
          factor: 'Valley Period',
          amount: -10,
          reason: 'Currently in a low-energy window'
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Composite Day Branch Clash Check
  // ─────────────────────────────────────────────────────────────────────────
  if (composite.dayPillar?.branch) {
    const dayBranch = composite.dayPillar.branch;
    const currentYear = input.targetYear || new Date().getFullYear();
    const yearBranch = getYearBranch(currentYear);

    if (isClash(dayBranch, yearBranch)) {
      adjustments.push({
        factor: 'Day Branch Clash',
        amount: -12,
        reason: 'Year clashes with composite Day Branch'
      });
    }

    if (isHarm(dayBranch, yearBranch)) {
      adjustments.push({
        factor: 'Day Branch Harm',
        amount: -8,
        reason: 'Year harms composite Day Branch'
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Calculate Final Score
  // ─────────────────────────────────────────────────────────────────────────
  baseScore = eventContribution + lifecycleContribution + synastryContribution + usefulGodContribution;

  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const finalScore = Math.max(0, Math.min(100, baseScore + totalAdjustments));

  return {
    baseScore,
    eventContribution,
    lifecycleContribution,
    synastryContribution,
    usefulGodContribution,
    adjustments,
    finalScore
  };
}

/**
 * Convert score to decision tier
 */
export function scoreToTier(score: number): DecisionTier {
  if (score >= 80) return 'do_now';
  if (score >= 65) return 'good_window';
  if (score >= 45) return 'neutral';
  if (score >= 30) return 'delay';
  return 'avoid';
}

// ============================================================================
// GUIDANCE GENERATION
// ============================================================================

/**
 * Generate guidance for a specific domain and tier
 */
export function generateDomainGuidance(
  domain: DecisionDomain,
  tier: DecisionTier,
  input: DecisionInput
): { guidance: string; detailed: string; actions: string[]; cautions: string[] } {
  const partnerNames = getPartnerNames(input);

  // ─────────────────────────────────────────────────────────────────────────
  // EMOTIONAL DOMAIN
  // ─────────────────────────────────────────────────────────────────────────
  if (domain === 'emotional') {
    switch (tier) {
      case 'do_now':
        return {
          guidance: 'This is a powerful window for emotional bonding and vulnerability.',
          detailed: `${partnerNames} are in strong alignment for deep emotional work. The timing supports vulnerable conversations, emotional healing, and strengthening your heart connection. Trust the flow.`,
          actions: [
            'Share deeper feelings and vulnerabilities',
            'Have meaningful heart-to-heart conversations',
            'Express appreciation and gratitude',
            'Create intentional bonding experiences',
            'Address emotional needs openly'
          ],
          cautions: [
            'Don\'t overwhelm with too much at once',
            'Ensure both partners are ready for depth'
          ]
        };

      case 'good_window':
        return {
          guidance: 'Good timing for emotional connection and bonding.',
          detailed: `The timing supports emotional growth for ${partnerNames}. While not at peak intensity, this is a favorable window for nurturing your emotional bond and having meaningful exchanges.`,
          actions: [
            'Prioritize quality time together',
            'Share feelings and check in emotionally',
            'Plan activities that foster connection',
            'Practice active listening'
          ],
          cautions: [
            'Pace deeper conversations appropriately',
            'Be mindful of stress levels'
          ]
        };

      case 'neutral':
        return {
          guidance: 'Proceed with emotional conversations with awareness.',
          detailed: `The timing is neither strongly supportive nor challenging for emotional depth. ${partnerNames} can engage in emotional work, but should be mindful of the energy available.`,
          actions: [
            'Maintain regular emotional check-ins',
            'Address smaller emotional matters',
            'Build emotional safety gradually'
          ],
          cautions: [
            'Avoid forcing deep conversations',
            'Watch for signs of emotional fatigue',
            'Keep major emotional discussions brief'
          ]
        };

      case 'delay':
        return {
          guidance: 'Consider waiting for a better emotional window.',
          detailed: `The current timing may not fully support deep emotional work for ${partnerNames}. Minor emotional maintenance is fine, but consider delaying major heart-to-heart conversations.`,
          actions: [
            'Focus on emotional self-care',
            'Maintain supportive presence',
            'Note topics to address later'
          ],
          cautions: [
            'Avoid emotionally charged discussions',
            'Don\'t interpret distance as rejection',
            'Give space if needed'
          ]
        };

      case 'avoid':
        return {
          guidance: 'This is not an optimal time for emotional vulnerability.',
          detailed: `The timing strongly suggests ${partnerNames} should avoid major emotional discussions or vulnerability. Focus on stability and wait for a more supportive window.`,
          actions: [
            'Maintain emotional stability',
            'Practice individual self-care',
            'Keep interactions light and supportive'
          ],
          cautions: [
            'Avoid sensitive emotional topics',
            'Don\'t make emotional decisions now',
            'Resist the urge to force connection'
          ]
        };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COMMITMENT DOMAIN
  // ─────────────────────────────────────────────────────────────────────────
  if (domain === 'commitment') {
    switch (tier) {
      case 'do_now':
        return {
          guidance: 'Excellent timing for commitment and long-term decisions.',
          detailed: `${partnerNames} have strong cosmic support for commitment decisions. Whether defining the relationship, discussing the future, or making it official, the timing is highly favorable.`,
          actions: [
            'Have the "where is this going" conversation',
            'Make engagement or marriage plans',
            'Discuss long-term goals and alignment',
            'Take concrete steps toward commitment',
            'Celebrate and honor your bond'
          ],
          cautions: [
            'Ensure both partners are genuinely ready',
            'Don\'t rush just because timing is good'
          ]
        };

      case 'good_window':
        return {
          guidance: 'Good timing to advance commitment conversations.',
          detailed: `The timing supports commitment growth for ${partnerNames}. While not at peak, this is a favorable window to discuss the future and deepen your mutual dedication.`,
          actions: [
            'Discuss future plans and dreams',
            'Take incremental commitment steps',
            'Plan meaningful milestones',
            'Express dedication and intention'
          ],
          cautions: [
            'Don\'t pressure for immediate decisions',
            'Allow organic progression'
          ]
        };

      case 'neutral':
        return {
          guidance: 'Proceed with commitment discussions thoughtfully.',
          detailed: `The timing is neutral for major commitment decisions. ${partnerNames} can discuss the future, but shouldn't feel pressured to make binding decisions right now.`,
          actions: [
            'Continue building trust',
            'Have exploratory future conversations',
            'Assess relationship health'
          ],
          cautions: [
            'Avoid ultimatums',
            'Don\'t make major legal commitments',
            'Keep expectations reasonable'
          ]
        };

      case 'delay':
        return {
          guidance: 'Consider waiting before major commitment decisions.',
          detailed: `The current timing may not fully support major commitment decisions for ${partnerNames}. The relationship can continue growing, but formal commitments are better delayed.`,
          actions: [
            'Focus on present-moment connection',
            'Build foundation for future commitment',
            'Address any underlying concerns first'
          ],
          cautions: [
            'Avoid proposals or major announcements',
            'Don\'t interpret delay as rejection',
            'Resist external pressure to commit'
          ]
        };

      case 'avoid':
        return {
          guidance: 'This is not the right time for major commitments.',
          detailed: `The timing strongly suggests ${partnerNames} should avoid making major commitment decisions now. Wait for a more supportive window before taking significant steps.`,
          actions: [
            'Maintain current relationship status',
            'Focus on day-to-day connection',
            'Note timing for future planning'
          ],
          cautions: [
            'Avoid engagement, marriage, or major legal ties',
            'Don\'t make permanent decisions',
            'Be patient with the process'
          ]
        };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PRACTICAL DOMAIN
  // ─────────────────────────────────────────────────────────────────────────
  if (domain === 'practical') {
    switch (tier) {
      case 'do_now':
        return {
          guidance: 'Excellent timing for shared projects and practical ventures.',
          detailed: `${partnerNames} have strong support for practical collaboration. Whether starting a business, making joint purchases, or planning logistics, the timing is highly favorable.`,
          actions: [
            'Launch shared projects or ventures',
            'Make joint financial decisions',
            'Plan travel or relocation',
            'Tackle practical tasks together',
            'Align on financial goals'
          ],
          cautions: [
            'Maintain clear agreements',
            'Document important decisions'
          ]
        };

      case 'good_window':
        return {
          guidance: 'Good timing for practical collaboration.',
          detailed: `The timing supports practical endeavors for ${partnerNames}. Shared projects and practical planning are favored, though complex ventures may benefit from extra planning.`,
          actions: [
            'Work on shared goals',
            'Have financial discussions',
            'Plan practical next steps',
            'Collaborate on household matters'
          ],
          cautions: [
            'Double-check important details',
            'Build in flexibility'
          ]
        };

      case 'neutral':
        return {
          guidance: 'Proceed with practical matters with awareness.',
          detailed: `The timing is neutral for major practical decisions. ${partnerNames} can handle routine practical matters, but major ventures should be approached with extra care.`,
          actions: [
            'Handle routine practical needs',
            'Continue ongoing projects',
            'Research before major decisions'
          ],
          cautions: [
            'Avoid major purchases or investments',
            'Be conservative with finances',
            'Get professional advice for complex matters'
          ]
        };

      case 'delay':
        return {
          guidance: 'Consider waiting on major practical decisions.',
          detailed: `The current timing may not fully support major practical ventures for ${partnerNames}. Routine matters are fine, but big decisions are better postponed.`,
          actions: [
            'Maintain current practical arrangements',
            'Focus on planning and research',
            'Build resources for future action'
          ],
          cautions: [
            'Avoid major financial commitments',
            'Don\'t start new business ventures',
            'Postpone major purchases'
          ]
        };

      case 'avoid':
        return {
          guidance: 'This is not the right time for major practical decisions.',
          detailed: `The timing strongly suggests ${partnerNames} should avoid major practical decisions, joint ventures, or significant financial moves. Wait for better alignment.`,
          actions: [
            'Handle only essential practical matters',
            'Conserve resources',
            'Maintain stability'
          ],
          cautions: [
            'Avoid major purchases or investments',
            'Don\'t launch joint ventures',
            'Be very conservative with finances'
          ]
        };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CONFLICT DOMAIN
  // ─────────────────────────────────────────────────────────────────────────
  if (domain === 'conflict') {
    switch (tier) {
      case 'do_now':
        return {
          guidance: 'Good timing to address issues and resolve conflicts.',
          detailed: `${partnerNames} have favorable energy for addressing difficult topics. The timing supports clear communication, conflict resolution, and healing old wounds.`,
          actions: [
            'Address lingering issues directly',
            'Have difficult but necessary conversations',
            'Seek resolution on ongoing conflicts',
            'Clear the air on misunderstandings',
            'Set healthy boundaries'
          ],
          cautions: [
            'Approach with compassion',
            'Focus on resolution, not winning'
          ]
        };

      case 'good_window':
        return {
          guidance: 'Favorable timing for addressing concerns.',
          detailed: `The timing supports conflict navigation for ${partnerNames}. Issues can be addressed productively, though intense conflicts may need a gentler approach.`,
          actions: [
            'Bring up concerns respectfully',
            'Work through disagreements',
            'Establish better communication patterns',
            'Seek understanding over being right'
          ],
          cautions: [
            'Keep discussions focused',
            'Take breaks if tension rises'
          ]
        };

      case 'neutral':
        return {
          guidance: 'Proceed with conflict discussions carefully.',
          detailed: `The timing is neutral for conflict resolution. ${partnerNames} can address moderate issues, but may want to wait on highly charged topics.`,
          actions: [
            'Address minor concerns',
            'Practice active listening',
            'Build communication skills'
          ],
          cautions: [
            'Avoid volatile topics',
            'Don\'t escalate disagreements',
            'Consider timing for major issues'
          ]
        };

      case 'delay':
        return {
          guidance: 'Consider waiting to address major conflicts.',
          detailed: `The current timing may not support productive conflict resolution for ${partnerNames}. Minor concerns can be noted, but major issues should wait.`,
          actions: [
            'Focus on de-escalation',
            'Practice patience',
            'Journal concerns for later discussion'
          ],
          cautions: [
            'Avoid bringing up old issues',
            'Don\'t escalate disagreements',
            'Resist the urge to "have it out"'
          ]
        };

      case 'avoid':
        return {
          guidance: 'This is not the right time for conflict or confrontation.',
          detailed: `The timing strongly suggests ${partnerNames} should avoid major conflicts or confrontations. Focus on peace and wait for a more supportive window.`,
          actions: [
            'Prioritize harmony and peace',
            'Practice self-regulation',
            'Use cooling-off strategies'
          ],
          cautions: [
            'Avoid all confrontations',
            'Don\'t raise sensitive issues',
            'Postpone any "serious talks"'
          ]
        };
    }
  }

  // Default fallback
  return {
    guidance: 'Proceed with awareness.',
    detailed: 'Consider the timing and context before making decisions.',
    actions: ['Assess the situation carefully'],
    cautions: ['Be mindful of timing']
  };
}

/**
 * Get partner names from input
 */
function getPartnerNames(input: DecisionInput): string {
  const nameA = input.composite.personAName || 'Partner A';
  const nameB = input.composite.personBName || 'Partner B';
  return `${nameA} and ${nameB}`;
}

// ============================================================================
// TIMING HELPERS
// ============================================================================

/**
 * Get element for a given year
 */
function getYearElement(year: number): ElementName {
  const stemIndex = (year - 4) % 10;
  const stems: StemName[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const stemElement: Record<StemName, ElementName> = {
    '甲': 'Wood', '乙': 'Wood',
    '丙': 'Fire', '丁': 'Fire',
    '戊': 'Earth', '己': 'Earth',
    '庚': 'Metal', '辛': 'Metal',
    '壬': 'Water', '癸': 'Water'
  };

  return stemElement[stems[stemIndex]];
}

/**
 * Get branch for a given year
 */
function getYearBranch(year: number): BranchName {
  const branchIndex = (year - 4) % 12;
  const branches: BranchName[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return branches[branchIndex];
}

/**
 * Check if element A produces element B
 */
function producesElement(a: ElementName, b: ElementName): boolean {
  const produces: Record<ElementName, ElementName> = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
  };
  return produces[a] === b;
}

/**
 * Check if two branches clash
 */
function isClash(branchA: BranchName, branchB: BranchName): boolean {
  const clashes: Record<BranchName, BranchName> = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳'
  };
  return clashes[branchA] === branchB;
}

/**
 * Check if two branches harm
 */
function isHarm(branchA: BranchName, branchB: BranchName): boolean {
  const harms: Record<BranchName, BranchName> = {
    '子': '未', '未': '子',
    '丑': '午', '午': '丑',
    '寅': '巳', '巳': '寅',
    '卯': '辰', '辰': '卯',
    '申': '亥', '亥': '申',
    '酉': '戌', '戌': '酉'
  };
  return harms[branchA] === branchB;
}

// ============================================================================
// TIMING WINDOWS
// ============================================================================

/**
 * Find optimal timing windows
 */
export function findOptimalWindows(
  input: DecisionInput,
  years: number = 5
): TimingWindow[] {
  const windows: TimingWindow[] = [];
  const baseYear = input.targetYear || new Date().getFullYear();

  for (let i = 0; i < years; i++) {
    const year = baseYear + i;
    const yearInput = { ...input, targetYear: year };

    // Compute scores for all domains
    const emotionalScore = computeDomainScore('emotional', yearInput);
    const commitmentScore = computeDomainScore('commitment', yearInput);
    const practicalScore = computeDomainScore('practical', yearInput);
    const conflictScore = computeDomainScore('conflict', yearInput);

    const avgScore = (
      emotionalScore.finalScore +
      commitmentScore.finalScore +
      practicalScore.finalScore +
      conflictScore.finalScore
    ) / 4;

    const tier = scoreToTier(avgScore);

    // Find which domains are strongest
    const domains: DecisionDomain[] = [];
    if (emotionalScore.finalScore >= 65) domains.push('emotional');
    if (commitmentScore.finalScore >= 65) domains.push('commitment');
    if (practicalScore.finalScore >= 65) domains.push('practical');
    if (conflictScore.finalScore >= 65) domains.push('conflict');

    if (tier === 'do_now' || tier === 'good_window') {
      windows.push({
        timeUnit: 'year',
        period: `${year}`,
        score: Math.round(avgScore),
        tier,
        domains: domains.length > 0 ? domains : ['emotional'],
        theme: getWindowTheme(tier, domains),
        recommendation: getWindowRecommendation(tier, domains)
      });
    }
  }

  return windows.slice(0, 10);
}

/**
 * Find caution windows
 */
export function findCautionWindows(
  input: DecisionInput,
  years: number = 5
): TimingWindow[] {
  const windows: TimingWindow[] = [];
  const baseYear = input.targetYear || new Date().getFullYear();

  for (let i = 0; i < years; i++) {
    const year = baseYear + i;
    const yearInput = { ...input, targetYear: year };

    // Compute scores for all domains
    const emotionalScore = computeDomainScore('emotional', yearInput);
    const commitmentScore = computeDomainScore('commitment', yearInput);
    const practicalScore = computeDomainScore('practical', yearInput);
    const conflictScore = computeDomainScore('conflict', yearInput);

    const avgScore = (
      emotionalScore.finalScore +
      commitmentScore.finalScore +
      practicalScore.finalScore +
      conflictScore.finalScore
    ) / 4;

    const tier = scoreToTier(avgScore);

    // Find which domains are challenging
    const domains: DecisionDomain[] = [];
    if (emotionalScore.finalScore <= 40) domains.push('emotional');
    if (commitmentScore.finalScore <= 40) domains.push('commitment');
    if (practicalScore.finalScore <= 40) domains.push('practical');
    if (conflictScore.finalScore <= 40) domains.push('conflict');

    if (tier === 'delay' || tier === 'avoid') {
      windows.push({
        timeUnit: 'year',
        period: `${year}`,
        score: Math.round(avgScore),
        tier,
        domains: domains.length > 0 ? domains : ['commitment'],
        theme: getCautionTheme(tier, domains),
        recommendation: getCautionRecommendation(tier, domains)
      });
    }
  }

  return windows.slice(0, 10);
}

/**
 * Get window theme
 */
function getWindowTheme(tier: DecisionTier, domains: DecisionDomain[]): string {
  if (tier === 'do_now') {
    if (domains.includes('commitment')) return 'Peak commitment window';
    if (domains.includes('emotional')) return 'Deep emotional bonding window';
    if (domains.includes('practical')) return 'Collaborative action window';
    return 'High-energy relationship window';
  }
  return 'Favorable relationship timing';
}

/**
 * Get window recommendation
 */
function getWindowRecommendation(tier: DecisionTier, domains: DecisionDomain[]): string {
  if (tier === 'do_now') {
    return `Excellent timing for ${domains.join(', ')} decisions. Act with confidence.`;
  }
  return `Good timing for ${domains.join(', ')} decisions. Proceed thoughtfully.`;
}

/**
 * Get caution theme
 */
function getCautionTheme(tier: DecisionTier, _domains: DecisionDomain[]): string {
  if (tier === 'avoid') {
    return 'Navigate with extra care';
  }
  return 'Timing requires patience';
}

/**
 * Get caution recommendation
 */
function getCautionRecommendation(tier: DecisionTier, domains: DecisionDomain[]): string {
  if (tier === 'avoid') {
    return `Avoid major ${domains.join(', ')} decisions during this period.`;
  }
  return `Consider delaying ${domains.join(', ')} decisions if possible.`;
}

// ============================================================================
// TIMELINE GENERATION
// ============================================================================

/**
 * Generate decision timeline
 */
export function generateDecisionTimeline(
  input: DecisionInput,
  years: number = 10
): DecisionTimelineEntry[] {
  const timeline: DecisionTimelineEntry[] = [];
  const baseYear = input.targetYear || new Date().getFullYear();

  for (let i = 0; i < years; i++) {
    const year = baseYear + i;
    const yearInput = { ...input, targetYear: year };

    // Compute scores
    const emotionalScore = computeDomainScore('emotional', yearInput);
    const commitmentScore = computeDomainScore('commitment', yearInput);
    const practicalScore = computeDomainScore('practical', yearInput);
    const conflictScore = computeDomainScore('conflict', yearInput);

    const scores: Record<DecisionDomain, number> = {
      emotional: emotionalScore.finalScore,
      commitment: commitmentScore.finalScore,
      practical: practicalScore.finalScore,
      conflict: conflictScore.finalScore
    };

    // Overall score
    const overallScore = Math.round(
      (scores.emotional + scores.commitment + scores.practical + scores.conflict) / 4
    );

    // Find dominant domain
    let dominantDomain: DecisionDomain = 'emotional';
    let maxScore = 0;
    for (const [domain, score] of Object.entries(scores) as [DecisionDomain, number][]) {
      if (score > maxScore) {
        maxScore = score;
        dominantDomain = domain;
      }
    }

    // Key factors
    const keyFactors: string[] = [];
    const yearElement = getYearElement(year);
    keyFactors.push(`${yearElement} year energy`);

    if (input.composite.usefulGod?.element === yearElement) {
      keyFactors.push('Useful God alignment');
    }

    if (input.lifecycle?.currentPhase) {
      keyFactors.push(`${input.lifecycle.currentPhase} phase`);
    }

    // Recommendation
    const tier = scoreToTier(overallScore);
    const recommendation = getTimelineRecommendation(tier, dominantDomain, year);

    timeline.push({
      year,
      overallScore,
      tier,
      dominantDomain,
      keyFactors,
      recommendation
    });
  }

  return timeline;
}

/**
 * Get timeline recommendation
 */
function getTimelineRecommendation(
  tier: DecisionTier,
  domain: DecisionDomain,
  year: number
): string {
  switch (tier) {
    case 'do_now':
      return `${year} is excellent for ${domain} decisions. Take action with confidence.`;
    case 'good_window':
      return `${year} offers favorable timing for ${domain} decisions.`;
    case 'neutral':
      return `${year} requires awareness for ${domain} decisions.`;
    case 'delay':
      return `Consider postponing ${domain} decisions in ${year}.`;
    case 'avoid':
      return `${year} is not recommended for major ${domain} decisions.`;
  }
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute complete relationship decision analysis
 */
export function computeRelationshipDecision(input: DecisionInput): RelationshipDecisionResult {
  const targetYear = input.targetYear || new Date().getFullYear();
  const targetPeriod = `${targetYear}`;

  // Compute domain scores
  const emotionalBreakdown = computeDomainScore('emotional', input);
  const commitmentBreakdown = computeDomainScore('commitment', input);
  const practicalBreakdown = computeDomainScore('practical', input);
  const conflictBreakdown = computeDomainScore('conflict', input);

  // Generate domain decisions
  const emotional = buildDomainDecision('emotional', emotionalBreakdown, input);
  const commitment = buildDomainDecision('commitment', commitmentBreakdown, input);
  const practical = buildDomainDecision('practical', practicalBreakdown, input);
  const conflict = buildDomainDecision('conflict', conflictBreakdown, input);

  // Calculate overall score
  const overallScore = Math.round(
    (emotionalBreakdown.finalScore +
     commitmentBreakdown.finalScore +
     practicalBreakdown.finalScore +
     conflictBreakdown.finalScore) / 4
  );

  const overallTier = scoreToTier(overallScore);
  const overallGuidance = generateOverallGuidance(overallTier, input);

  // Find timing windows
  const optimalWindows = findOptimalWindows(input, 5);
  const cautionWindows = findCautionWindows(input, 5);

  // Generate timeline
  const timeline = generateDecisionTimeline(input, 10);

  // Generate insights
  const keyInsights = generateKeyInsights(
    emotional, commitment, practical, conflict, input
  );

  const criticalFactors = generateCriticalFactors(input);

  // Determine data quality
  const dataQuality = determineDataQuality(input);

  return {
    targetPeriod,
    timeUnit: 'year',
    overallScore,
    overallTier,
    overallTierChinese: TIER_CHINESE[overallTier],
    overallGuidance,
    emotional,
    commitment,
    practical,
    conflict,
    optimalWindows,
    cautionWindows,
    timeline,
    keyInsights,
    criticalFactors,
    computedAt: new Date().toISOString(),
    dataQuality
  };
}

/**
 * Build a domain decision object
 */
function buildDomainDecision(
  domain: DecisionDomain,
  breakdown: ScoreBreakdown,
  input: DecisionInput
): DomainDecision {
  const tier = scoreToTier(breakdown.finalScore);
  const guidance = generateDomainGuidance(domain, tier, input);

  return {
    domain,
    domainChinese: DOMAIN_CHINESE[domain],
    score: Math.round(breakdown.finalScore),
    tier,
    tierChinese: TIER_CHINESE[tier],
    guidance: guidance.guidance,
    detailedGuidance: guidance.detailed,
    actions: guidance.actions,
    cautions: guidance.cautions,
    scoreBreakdown: breakdown
  };
}

/**
 * Generate overall guidance
 */
function generateOverallGuidance(tier: DecisionTier, input: DecisionInput): string {
  const names = getPartnerNames(input);

  switch (tier) {
    case 'do_now':
      return `This is an excellent decision window for ${names}. The timing strongly supports taking action across emotional, commitment, practical, and conflict domains. Trust the flow and move forward with confidence.`;

    case 'good_window':
      return `The timing is favorable for ${names} to make relationship decisions. While not at peak alignment, most decisions are supported. Proceed with thoughtful action.`;

    case 'neutral':
      return `The timing is neutral for ${names}. Decisions can be made, but should be approached with awareness and care. Neither strongly supported nor challenged.`;

    case 'delay':
      return `The current timing suggests ${names} may benefit from delaying major relationship decisions. Focus on maintaining stability and preparing for better windows ahead.`;

    case 'avoid':
      return `This is not an optimal decision window for ${names}. Major relationship decisions should be postponed. Focus on stability, patience, and self-care until timing improves.`;
  }
}

/**
 * Generate key insights
 */
function generateKeyInsights(
  emotional: DomainDecision,
  commitment: DomainDecision,
  practical: DomainDecision,
  conflict: DomainDecision,
  input: DecisionInput
): string[] {
  const insights: string[] = [];

  // Best domain
  const scores = { emotional, commitment, practical, conflict };
  let bestDomain: DecisionDomain = 'emotional';
  let bestScore = 0;

  for (const [domain, decision] of Object.entries(scores) as [DecisionDomain, DomainDecision][]) {
    if (decision.score > bestScore) {
      bestScore = decision.score;
      bestDomain = domain;
    }
  }

  insights.push(`Strongest domain: ${DOMAIN_CHINESE[bestDomain]} (${bestScore}/100)`);

  // Lifecycle insight
  if (input.lifecycle) {
    insights.push(`Current lifecycle phase: ${input.lifecycle.currentPhase}`);
  }

  // Useful God insight
  if (input.composite.usefulGod) {
    insights.push(`Relationship thrives with ${input.composite.usefulGod.element} energy`);
  }

  // Shen Sha insights
  if (input.composite.shenSha?.length) {
    const auspicious = input.composite.shenSha.filter(s => s.nature === 'auspicious');
    if (auspicious.length > 0) {
      insights.push(`Supported by: ${auspicious.map(s => s.chineseName).join(', ')}`);
    }
  }

  // Trajectory insight
  if (input.trajectory?.overallTrend) {
    if (input.trajectory.overallTrend === 'ascending') {
      insights.push('Relationship trajectory is ascending');
    } else if (input.trajectory.overallTrend === 'descending') {
      insights.push('Relationship trajectory is descending — patience advised');
    }
  }

  return insights.slice(0, 6);
}

/**
 * Generate critical factors
 */
function generateCriticalFactors(input: DecisionInput): string[] {
  const factors: string[] = [];

  const currentYear = input.targetYear || new Date().getFullYear();
  const yearElement = getYearElement(currentYear);
  const yearBranch = getYearBranch(currentYear);

  factors.push(`Current year: ${currentYear} (${ELEMENT_CHINESE[yearElement]})`);

  if (input.composite.usefulGod) {
    factors.push(`Useful God: ${ELEMENT_CHINESE[input.composite.usefulGod.element]}`);
  }

  if (input.composite.dayPillar?.branch) {
    const dayBranch = input.composite.dayPillar.branch;
    if (isClash(dayBranch, yearBranch)) {
      factors.push('⚠️ Year clashes with composite Day Branch');
    }
  }

  if (input.lifecycle) {
    factors.push(`Lifecycle: ${input.lifecycle.currentPhase}`);
  }

  if (input.synastry) {
    factors.push(`Synastry score: ${input.synastry.overallScore}/100`);
  }

  return factors;
}

/**
 * Determine data quality
 */
function determineDataQuality(input: DecisionInput): 'full' | 'partial' | 'minimal' {
  let score = 0;

  if (input.composite) score += 2;
  if (input.synastry) score += 2;
  if (input.lifecycle) score += 1;
  if (input.eventTrigger) score += 1;
  if (input.trajectory) score += 1;
  if (input.archetype) score += 1;
  if (input.lifeThemes) score += 1;

  if (score >= 7) return 'full';
  if (score >= 4) return 'partial';
  return 'minimal';
}

// ============================================================================
// STORY MODE OUTPUT
// ============================================================================

/**
 * Format decision result as story
 */
export function formatDecisionStory(result: RelationshipDecisionResult): string {
  const parts: string[] = [];

  // Title
  parts.push(`# Relationship Decision Engine (关系决策引擎)`);
  parts.push('');
  parts.push(`**Analysis Period:** ${result.targetPeriod}`);
  parts.push(`**Overall Score:** ${result.overallScore}/100 — ${result.overallTierChinese}`);
  parts.push('');

  // Overall guidance
  parts.push('## Overall Guidance');
  parts.push('');
  parts.push(result.overallGuidance);
  parts.push('');

  // Domain decisions
  parts.push('## Decision Domains');
  parts.push('');

  // Emotional
  parts.push(`### ${result.emotional.domainChinese} (Emotional)`);
  parts.push(`**Score:** ${result.emotional.score}/100 — ${result.emotional.tierChinese}`);
  parts.push('');
  parts.push(result.emotional.guidance);
  parts.push('');
  parts.push('**Actions:**');
  result.emotional.actions.slice(0, 3).forEach(a => parts.push(`- ${a}`));
  parts.push('');

  // Commitment
  parts.push(`### ${result.commitment.domainChinese} (Commitment)`);
  parts.push(`**Score:** ${result.commitment.score}/100 — ${result.commitment.tierChinese}`);
  parts.push('');
  parts.push(result.commitment.guidance);
  parts.push('');
  parts.push('**Actions:**');
  result.commitment.actions.slice(0, 3).forEach(a => parts.push(`- ${a}`));
  parts.push('');

  // Practical
  parts.push(`### ${result.practical.domainChinese} (Practical)`);
  parts.push(`**Score:** ${result.practical.score}/100 — ${result.practical.tierChinese}`);
  parts.push('');
  parts.push(result.practical.guidance);
  parts.push('');
  parts.push('**Actions:**');
  result.practical.actions.slice(0, 3).forEach(a => parts.push(`- ${a}`));
  parts.push('');

  // Conflict
  parts.push(`### ${result.conflict.domainChinese} (Conflict)`);
  parts.push(`**Score:** ${result.conflict.score}/100 — ${result.conflict.tierChinese}`);
  parts.push('');
  parts.push(result.conflict.guidance);
  parts.push('');
  parts.push('**Actions:**');
  result.conflict.actions.slice(0, 3).forEach(a => parts.push(`- ${a}`));
  parts.push('');

  // Optimal windows
  if (result.optimalWindows.length > 0) {
    parts.push('## Optimal Timing Windows');
    parts.push('');
    for (const window of result.optimalWindows.slice(0, 5)) {
      parts.push(`- **${window.period}:** ${window.theme} (${window.score}/100)`);
      parts.push(`  ${window.recommendation}`);
    }
    parts.push('');
  }

  // Caution windows
  if (result.cautionWindows.length > 0) {
    parts.push('## Caution Windows');
    parts.push('');
    for (const window of result.cautionWindows.slice(0, 3)) {
      parts.push(`- **${window.period}:** ${window.theme}`);
      parts.push(`  ${window.recommendation}`);
    }
    parts.push('');
  }

  // Key insights
  parts.push('## Key Insights');
  parts.push('');
  for (const insight of result.keyInsights) {
    parts.push(`- ${insight}`);
  }
  parts.push('');

  // Critical factors
  parts.push('## Critical Factors');
  parts.push('');
  for (const factor of result.criticalFactors) {
    parts.push(`- ${factor}`);
  }

  return parts.join('\n');
}

// ============================================================================
// UI-READY OUTPUT
// ============================================================================

/**
 * Format decision result for UI
 */
export function formatDecisionForUI(result: RelationshipDecisionResult): {
  summary: {
    period: string;
    overallScore: number;
    overallTier: string;
    overallTierChinese: string;
    guidance: string;
  };
  domains: Array<{
    domain: string;
    domainChinese: string;
    score: number;
    tier: string;
    tierChinese: string;
    guidance: string;
    actions: string[];
    cautions: string[];
    color: string;
  }>;
  timeline: Array<{
    year: number;
    score: number;
    tier: string;
    color: string;
    recommendation: string;
  }>;
  windows: {
    optimal: Array<{
      period: string;
      score: number;
      theme: string;
    }>;
    caution: Array<{
      period: string;
      score: number;
      theme: string;
    }>;
  };
  insights: string[];
  factors: string[];
} {
  const tierColors: Record<DecisionTier, string> = {
    do_now: '#4CAF50',
    good_window: '#8BC34A',
    neutral: '#FF9800',
    delay: '#FF5722',
    avoid: '#F44336'
  };

  return {
    summary: {
      period: result.targetPeriod,
      overallScore: result.overallScore,
      overallTier: result.overallTier,
      overallTierChinese: result.overallTierChinese,
      guidance: result.overallGuidance
    },
    domains: [
      {
        domain: 'emotional',
        domainChinese: result.emotional.domainChinese,
        score: result.emotional.score,
        tier: result.emotional.tier,
        tierChinese: result.emotional.tierChinese,
        guidance: result.emotional.guidance,
        actions: result.emotional.actions,
        cautions: result.emotional.cautions,
        color: tierColors[result.emotional.tier]
      },
      {
        domain: 'commitment',
        domainChinese: result.commitment.domainChinese,
        score: result.commitment.score,
        tier: result.commitment.tier,
        tierChinese: result.commitment.tierChinese,
        guidance: result.commitment.guidance,
        actions: result.commitment.actions,
        cautions: result.commitment.cautions,
        color: tierColors[result.commitment.tier]
      },
      {
        domain: 'practical',
        domainChinese: result.practical.domainChinese,
        score: result.practical.score,
        tier: result.practical.tier,
        tierChinese: result.practical.tierChinese,
        guidance: result.practical.guidance,
        actions: result.practical.actions,
        cautions: result.practical.cautions,
        color: tierColors[result.practical.tier]
      },
      {
        domain: 'conflict',
        domainChinese: result.conflict.domainChinese,
        score: result.conflict.score,
        tier: result.conflict.tier,
        tierChinese: result.conflict.tierChinese,
        guidance: result.conflict.guidance,
        actions: result.conflict.actions,
        cautions: result.conflict.cautions,
        color: tierColors[result.conflict.tier]
      }
    ],
    timeline: result.timeline.map(t => ({
      year: t.year,
      score: t.overallScore,
      tier: t.tier,
      color: tierColors[t.tier],
      recommendation: t.recommendation
    })),
    windows: {
      optimal: result.optimalWindows.map(w => ({
        period: w.period,
        score: w.score,
        theme: w.theme
      })),
      caution: result.cautionWindows.map(w => ({
        period: w.period,
        score: w.score,
        theme: w.theme
      }))
    },
    insights: result.keyInsights,
    factors: result.criticalFactors
  };
}

// ============================================================================
// QUICK DECISION FUNCTIONS
// ============================================================================

/**
 * Quick check: Is now good for commitment?
 */
export function isGoodForCommitment(input: DecisionInput): {
  answer: boolean;
  score: number;
  tier: DecisionTier;
  reason: string;
} {
  const breakdown = computeDomainScore('commitment', input);
  const tier = scoreToTier(breakdown.finalScore);
  const isGood = tier === 'do_now' || tier === 'good_window';

  return {
    answer: isGood,
    score: Math.round(breakdown.finalScore),
    tier,
    reason: isGood
      ? 'The timing supports commitment decisions.'
      : 'Consider waiting for a more supportive window.'
  };
}

/**
 * Quick check: Is now good for emotional vulnerability?
 */
export function isGoodForEmotional(input: DecisionInput): {
  answer: boolean;
  score: number;
  tier: DecisionTier;
  reason: string;
} {
  const breakdown = computeDomainScore('emotional', input);
  const tier = scoreToTier(breakdown.finalScore);
  const isGood = tier === 'do_now' || tier === 'good_window';

  return {
    answer: isGood,
    score: Math.round(breakdown.finalScore),
    tier,
    reason: isGood
      ? 'The timing supports emotional bonding and vulnerability.'
      : 'Consider waiting for a more supportive window.'
  };
}

/**
 * Quick check: Is now good for difficult conversations?
 */
export function isGoodForConflict(input: DecisionInput): {
  answer: boolean;
  score: number;
  tier: DecisionTier;
  reason: string;
} {
  const breakdown = computeDomainScore('conflict', input);
  const tier = scoreToTier(breakdown.finalScore);
  const isGood = tier === 'do_now' || tier === 'good_window';

  return {
    answer: isGood,
    score: Math.round(breakdown.finalScore),
    tier,
    reason: isGood
      ? 'The timing supports addressing issues and conflict resolution.'
      : 'Consider waiting for a more supportive window.'
  };
}

/**
 * Quick check: Is now good for practical decisions?
 */
export function isGoodForPractical(input: DecisionInput): {
  answer: boolean;
  score: number;
  tier: DecisionTier;
  reason: string;
} {
  const breakdown = computeDomainScore('practical', input);
  const tier = scoreToTier(breakdown.finalScore);
  const isGood = tier === 'do_now' || tier === 'good_window';

  return {
    answer: isGood,
    score: Math.round(breakdown.finalScore),
    tier,
    reason: isGood
      ? 'The timing supports practical decisions and joint ventures.'
      : 'Consider waiting for a more supportive window.'
  };
}

/**
 * Get best year for a specific domain
 */
export function getBestYearFor(
  domain: DecisionDomain,
  input: DecisionInput,
  searchYears: number = 5
): { year: number; score: number; tier: DecisionTier } | null {
  const baseYear = input.targetYear || new Date().getFullYear();
  let bestYear: number | null = null;
  let bestScore = 0;

  for (let i = 0; i < searchYears; i++) {
    const year = baseYear + i;
    const yearInput = { ...input, targetYear: year };
    const breakdown = computeDomainScore(domain, yearInput);

    if (breakdown.finalScore > bestScore) {
      bestScore = breakdown.finalScore;
      bestYear = year;
    }
  }

  if (bestYear !== null) {
    return {
      year: bestYear,
      score: Math.round(bestScore),
      tier: scoreToTier(bestScore)
    };
  }

  return null;
}

// All functions are exported inline with 'export' keyword
