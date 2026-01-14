/**
 * ============================================================================
 * BAZI YIN/YANG PAIRWISE COMPATIBILITY UTILITY
 * ============================================================================
 *
 * Computes Yin/Yang compatibility between two BaZi charts.
 *
 * Classical principles:
 * - Yang + Yin = Complementary attraction (最佳)
 * - Yang + Yang = Resonant energy, potential competition
 * - Yin + Yin = Mutual understanding, gentle harmony
 * - DM polarity alignment enhances or softens these dynamics
 *
 * This utility extends baziYinYang.ts for pairwise relationship analysis.
 *
 * Created: January 2026
 * Based on: Classical BaZi compatibility theory (阴阳配合)
 * ============================================================================
 */

import {
  computeYinYangProfile,
  compareYinYangProfiles,
  YinYangProfile,
  FourPillars
} from './baziYinYang';

import {
  computeChartStemBranchRelations,
  ChartStemBranchAnalysis,
  FourPillars as SBFourPillars
} from './baziStemBranchRelations';

// ============================================================================
// TYPES
// ============================================================================

export interface YinYangPairResult {
  // Individual profiles
  profileA: YinYangProfile;
  profileB: YinYangProfile;

  // Rootedness data
  rootednessA: ChartStemBranchAnalysis;
  rootednessB: ChartStemBranchAnalysis;

  // Compatibility metrics
  polarityCompatibility: number;     // 0-1 score
  rootednessCompatibility: number;   // 0-1 score
  combinedScore: number;             // Weighted average

  // Dynamic classification
  dynamic: YinYangPairDynamic;

  // Narrative
  story: string;

  // Show your work
  breakdown: YinYangPairBreakdown;
}

export type YinYangPairDynamic =
  | 'perfect_complement'     // Yang + Yin with opposite DMs
  | 'strong_complement'      // Yang + Yin with same DMs
  | 'resonant_yang'          // Both Yang
  | 'resonant_yin'           // Both Yin
  | 'balanced_versatile'     // Both balanced
  | 'creative_tension'       // Mismatched energies
  | 'gentle_harmony';        // Both Yin, flowing

export interface YinYangPairBreakdown {
  // Polarity analysis
  polarityMatch: 'opposite' | 'same' | 'mixed';
  dmPolarityMatch: boolean;
  chartDominantA: 'yang' | 'yin' | 'balanced';
  chartDominantB: 'yang' | 'yin' | 'balanced';

  // Rootedness analysis
  rootednessDelta: number;           // Difference in rootedness
  combinedStability: number;         // Average rootedness

  // Scoring breakdown
  polarityScore: number;
  dmAlignmentBonus: number;
  rootednessScore: number;

  // Labels
  polarityLabel: string;
  rootednessLabel: string;
}

// ============================================================================
// COMPATIBILITY NARRATIVES
// ============================================================================

const DYNAMIC_NARRATIVES: Record<YinYangPairDynamic, {
  title: string;
  metaphor: string;
  strength: string;
  challenge: string;
  practice: string;
}> = {
  perfect_complement: {
    title: 'Perfect Complement',
    metaphor: 'Like day and night, sun and moon - each completing what the other lacks',
    strength: 'Natural attraction and balance. One initiates, the other receives. One acts, the other reflects.',
    challenge: 'May feel like speaking different languages at times. Patience needed for different tempos.',
    practice: 'Celebrate your differences as gifts. When frustrated, remember: what annoys you is often what you need.'
  },
  strong_complement: {
    title: 'Strong Complement',
    metaphor: 'Like two musicians playing harmony - different notes creating beautiful chords',
    strength: 'Complementary charts with similar core expressions. Good understanding with balancing energy.',
    challenge: 'Occasional confusion between your own needs and adapting to the other.',
    practice: 'Let your chart differences create balance while your similar DMs create understanding.'
  },
  resonant_yang: {
    title: 'Resonant Yang',
    metaphor: 'Like two flames - bright, dynamic, mutually inspiring but needing space',
    strength: 'Deep understanding of each other\'s drive. Mutual respect for ambition and action.',
    challenge: 'Competition for leadership. Both want to initiate. May clash for dominance.',
    practice: 'Take turns leading. Create separate domains where each can shine. Compete externally, not internally.'
  },
  resonant_yin: {
    title: 'Resonant Yin',
    metaphor: 'Like two streams flowing together - naturally merging, deeply intuitive',
    strength: 'Profound mutual understanding. Gentle, receptive harmony. Intuitive communication.',
    challenge: 'May lack initiative together. Decision-making can stall. External pressure needed sometimes.',
    practice: 'Consciously take turns being the "initiator." Create structures that move you forward together.'
  },
  balanced_versatile: {
    title: 'Balanced & Versatile',
    metaphor: 'Like two chameleons - adaptable, flexible, able to meet each other anywhere',
    strength: 'Maximum flexibility. Both can lead or follow. Easy adjustment to each other\'s moods.',
    challenge: 'May lack strong polarity attraction. Can feel "too similar" or lacking spark.',
    practice: 'Consciously play with roles. Sometimes one leads strongly, sometimes the other. Keep dynamic alive.'
  },
  creative_tension: {
    title: 'Creative Tension',
    metaphor: 'Like fire and water - challenging but capable of creating steam (power)',
    strength: 'Strong growth catalyst. Each pushes the other out of comfort zones.',
    challenge: 'Frequent friction. Different rhythms and approaches. Requires conscious effort.',
    practice: 'Reframe conflict as creative fuel. Use tension for growth, not destruction. Regular check-ins essential.'
  },
  gentle_harmony: {
    title: 'Gentle Harmony',
    metaphor: 'Like moonlight on still water - soft, peaceful, mutually nurturing',
    strength: 'Easy, flowing connection. Natural empathy. Comfortable silence and shared reflection.',
    challenge: 'May avoid necessary confrontation. Growth edges might go unaddressed.',
    practice: 'Create space for honest feedback. Gently push each other toward growth while maintaining peace.'
  }
};

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Compute comprehensive Yin/Yang pairwise compatibility
 *
 * @param pillarsA - Four Pillars for Person A
 * @param pillarsB - Four Pillars for Person B
 * @param labelA - Display name for Person A
 * @param labelB - Display name for Person B
 * @returns YinYangPairResult with all compatibility data
 */
export function computeYinYangPairCompatibility(
  pillarsA: FourPillars,
  pillarsB: FourPillars,
  labelA: string = 'Person A',
  labelB: string = 'Person B'
): YinYangPairResult {
  // Compute individual profiles
  const profileA = computeYinYangProfile(pillarsA);
  const profileB = computeYinYangProfile(pillarsB);

  // Compute rootedness
  const rootednessA = computeChartStemBranchRelations(pillarsA as SBFourPillars);
  const rootednessB = computeChartStemBranchRelations(pillarsB as SBFourPillars);

  // Get basic compatibility
  const basicCompat = compareYinYangProfiles(profileA, profileB);

  // Compute detailed breakdown
  const breakdown = computeBreakdown(profileA, profileB, rootednessA, rootednessB);

  // Determine dynamic
  const dynamic = classifyDynamic(profileA, profileB, breakdown);

  // Calculate scores
  const polarityCompatibility = basicCompat.compatibility;
  const rootednessCompatibility = computeRootednessCompatibility(rootednessA, rootednessB);
  const combinedScore = (polarityCompatibility * 0.65) + (rootednessCompatibility * 0.35);

  // Build narrative
  const story = buildYinYangPairStory(
    profileA, profileB,
    rootednessA, rootednessB,
    dynamic, breakdown,
    labelA, labelB
  );

  return {
    profileA,
    profileB,
    rootednessA,
    rootednessB,
    polarityCompatibility,
    rootednessCompatibility,
    combinedScore,
    dynamic,
    story,
    breakdown
  };
}

// ============================================================================
// BREAKDOWN COMPUTATION
// ============================================================================

function computeBreakdown(
  profileA: YinYangProfile,
  profileB: YinYangProfile,
  rootednessA: ChartStemBranchAnalysis,
  rootednessB: ChartStemBranchAnalysis
): YinYangPairBreakdown {
  // Determine chart dominants
  const chartDominantA = getChartDominant(profileA);
  const chartDominantB = getChartDominant(profileB);

  // Polarity match type
  let polarityMatch: 'opposite' | 'same' | 'mixed';
  if (chartDominantA === 'balanced' || chartDominantB === 'balanced') {
    polarityMatch = 'mixed';
  } else if (chartDominantA !== chartDominantB) {
    polarityMatch = 'opposite';
  } else {
    polarityMatch = 'same';
  }

  // DM polarity match
  const dmPolarityMatch = profileA.dmPolarity !== profileB.dmPolarity;

  // Rootedness analysis
  const rootednessDelta = Math.abs(
    rootednessA.overallRootedness - rootednessB.overallRootedness
  );
  const combinedStability = (
    rootednessA.overallRootedness + rootednessB.overallRootedness
  ) / 2;

  // Scoring breakdown
  let polarityScore = 0.5;
  if (polarityMatch === 'opposite') {
    polarityScore = 0.85;
  } else if (polarityMatch === 'same') {
    polarityScore = 0.65;
  } else {
    polarityScore = 0.75; // Mixed
  }

  // DM alignment bonus (opposite DMs = attraction)
  const dmAlignmentBonus = dmPolarityMatch ? 0.10 : 0.0;

  // Rootedness score (similar rootedness = easier understanding)
  const rootednessScore = 1 - (rootednessDelta * 0.5); // 0.5-1.0 range

  // Labels
  const polarityLabel = getPolarityLabel(polarityMatch, dmPolarityMatch);
  const rootednessLabel = getRootednessLabel(combinedStability, rootednessDelta);

  return {
    polarityMatch,
    dmPolarityMatch,
    chartDominantA,
    chartDominantB,
    rootednessDelta,
    combinedStability,
    polarityScore,
    dmAlignmentBonus,
    rootednessScore,
    polarityLabel,
    rootednessLabel
  };
}

function getChartDominant(profile: YinYangProfile): 'yang' | 'yin' | 'balanced' {
  if (profile.balance === 'balanced') return 'balanced';
  if (profile.balance.includes('yang')) return 'yang';
  return 'yin';
}

function getPolarityLabel(
  polarityMatch: 'opposite' | 'same' | 'mixed',
  dmMatch: boolean
): string {
  if (polarityMatch === 'opposite' && dmMatch) {
    return 'Perfect Polarity Complement';
  } else if (polarityMatch === 'opposite') {
    return 'Chart Polarity Complement';
  } else if (polarityMatch === 'same' && dmMatch) {
    return 'Resonant Charts, Attracting DMs';
  } else if (polarityMatch === 'same') {
    return 'Resonant Polarity';
  } else {
    return 'Balanced/Mixed Polarity';
  }
}

function getRootednessLabel(combined: number, delta: number): string {
  if (combined >= 0.6 && delta < 0.2) {
    return 'Both Well-Rooted (stable partnership)';
  } else if (combined >= 0.6 && delta >= 0.2) {
    return 'Mixed Rootedness (one anchors the other)';
  } else if (combined < 0.4 && delta < 0.2) {
    return 'Both Lightly Rooted (adaptable partnership)';
  } else if (combined < 0.4 && delta >= 0.2) {
    return 'Contrasting Rootedness (dynamic tension)';
  } else {
    return 'Moderate Rootedness (flexible foundation)';
  }
}

// ============================================================================
// DYNAMIC CLASSIFICATION
// ============================================================================

function classifyDynamic(
  profileA: YinYangProfile,
  profileB: YinYangProfile,
  breakdown: YinYangPairBreakdown
): YinYangPairDynamic {
  const { polarityMatch, dmPolarityMatch, chartDominantA, chartDominantB } = breakdown;

  // Both balanced
  if (chartDominantA === 'balanced' && chartDominantB === 'balanced') {
    return 'balanced_versatile';
  }

  // Opposite chart polarities
  if (polarityMatch === 'opposite') {
    return dmPolarityMatch ? 'perfect_complement' : 'strong_complement';
  }

  // Same chart polarity
  if (polarityMatch === 'same') {
    if (chartDominantA === 'yang') {
      return 'resonant_yang';
    } else if (chartDominantA === 'yin') {
      // Check if both are very_yin for gentle harmony
      if (profileA.balance === 'very_yin' && profileB.balance === 'very_yin') {
        return 'gentle_harmony';
      }
      return 'resonant_yin';
    }
  }

  // Mixed/complex cases
  if (dmPolarityMatch && polarityMatch === 'mixed') {
    return 'strong_complement';
  }

  return 'creative_tension';
}

// ============================================================================
// ROOTEDNESS COMPATIBILITY
// ============================================================================

function computeRootednessCompatibility(
  rootednessA: ChartStemBranchAnalysis,
  rootednessB: ChartStemBranchAnalysis
): number {
  const scoreA = rootednessA.overallRootedness;
  const scoreB = rootednessB.overallRootedness;

  // Similarity bonus (similar rootedness = easier understanding)
  const delta = Math.abs(scoreA - scoreB);
  const similarityScore = 1 - (delta * 0.3); // 0.7-1.0 range

  // Combined stability bonus
  const combined = (scoreA + scoreB) / 2;
  const stabilityScore = 0.5 + (combined * 0.3); // 0.5-0.8 range

  // One well-rooted can anchor the other (complementary bonus)
  let anchoringBonus = 0;
  if ((scoreA > 0.6 && scoreB < 0.4) || (scoreB > 0.6 && scoreA < 0.4)) {
    anchoringBonus = 0.1; // One anchors the other
  }

  return Math.min(1, (similarityScore * 0.5) + (stabilityScore * 0.4) + anchoringBonus);
}

// ============================================================================
// STORY BUILDER
// ============================================================================

/**
 * Build a narrative story about the Yin/Yang pair compatibility
 */
export function buildYinYangPairStory(
  profileA: YinYangProfile,
  profileB: YinYangProfile,
  rootednessA: ChartStemBranchAnalysis,
  rootednessB: ChartStemBranchAnalysis,
  dynamic: YinYangPairDynamic,
  breakdown: YinYangPairBreakdown,
  labelA: string,
  labelB: string
): string {
  const narrative = DYNAMIC_NARRATIVES[dynamic];

  const story = `
${'═'.repeat(60)}
YIN/YANG COMPATIBILITY: ${labelA} & ${labelB}
${'═'.repeat(60)}

YOUR DYNAMIC: ${narrative.title}
${'─'.repeat(50)}

${narrative.metaphor}.

${labelA}'s Profile:
• Chart Energy: ${breakdown.chartDominantA === 'balanced' ? 'Balanced' : breakdown.chartDominantA === 'yang' ? 'Yang-dominant' : 'Yin-dominant'}
• Day Master: ${profileA.dmPolarity === 'yang' ? 'Yang' : 'Yin'}
• Rootedness: ${(rootednessA.overallRootedness * 100).toFixed(0)}%

${labelB}'s Profile:
• Chart Energy: ${breakdown.chartDominantB === 'balanced' ? 'Balanced' : breakdown.chartDominantB === 'yang' ? 'Yang-dominant' : 'Yin-dominant'}
• Day Master: ${profileB.dmPolarity === 'yang' ? 'Yang' : 'Yin'}
• Rootedness: ${(rootednessB.overallRootedness * 100).toFixed(0)}%


YOUR STRENGTH
${'─'.repeat(50)}

${narrative.strength}


YOUR CHALLENGE
${'─'.repeat(50)}

${narrative.challenge}


PRACTICE FOR GROWTH
${'─'.repeat(50)}

${narrative.practice}


POLARITY ANALYSIS
${'─'.repeat(50)}

${breakdown.polarityLabel}

${breakdown.dmPolarityMatch ?
    'Your Day Masters have opposite polarities - this creates a natural magnetic attraction at the core level.' :
    'Your Day Masters share the same polarity - this creates natural understanding but may need conscious balancing.'
  }

Chart Polarity: ${(profileA.weightedYang * 100).toFixed(0)}% Yang (${labelA}) vs ${(profileB.weightedYang * 100).toFixed(0)}% Yang (${labelB})


ROOTEDNESS ANALYSIS
${'─'.repeat(50)}

${breakdown.rootednessLabel}

${getRootednessNarrative(rootednessA, rootednessB, labelA, labelB)}


${'═'.repeat(60)}
COMPATIBILITY SCORES
${'═'.repeat(60)}

Polarity Compatibility: ${((breakdown.polarityScore + breakdown.dmAlignmentBonus) * 100).toFixed(0)}%
Rootedness Compatibility: ${(breakdown.rootednessScore * 100).toFixed(0)}%

"Understanding each other's polarity and rootedness is the foundation
of true harmony. You can't change each other's charts - but you can
learn to dance with them."
`;

  return story.trim();
}

function getRootednessNarrative(
  rootednessA: ChartStemBranchAnalysis,
  rootednessB: ChartStemBranchAnalysis,
  labelA: string,
  labelB: string
): string {
  const scoreA = rootednessA.overallRootedness;
  const scoreB = rootednessB.overallRootedness;

  if (scoreA > 0.6 && scoreB > 0.6) {
    return `Both ${labelA} and ${labelB} are well-rooted. This creates a stable, secure partnership where both partners have strong internal resources to draw upon during challenges.`;
  } else if (scoreA < 0.4 && scoreB < 0.4) {
    return `Both ${labelA} and ${labelB} are lightly rooted. This creates an adaptable, flexible partnership - but you may need to consciously create external structures and routines for stability.`;
  } else if (scoreA > 0.6 && scoreB < 0.4) {
    return `${labelA} is more rooted, ${labelB} more flexible. ${labelA} can provide grounding and stability, while ${labelB} brings adaptability and fresh perspectives.`;
  } else if (scoreB > 0.6 && scoreA < 0.4) {
    return `${labelB} is more rooted, ${labelA} more flexible. ${labelB} can provide grounding and stability, while ${labelA} brings adaptability and fresh perspectives.`;
  } else {
    return `You have moderate rootedness levels - neither too rigid nor too ungrounded. This gives your partnership a good balance of stability and flexibility.`;
  }
}

// ============================================================================
// QUICK COMPARISON
// ============================================================================

/**
 * Quick comparison function for UI display (lighter weight)
 */
export function quickYinYangComparison(
  pillarsA: FourPillars,
  pillarsB: FourPillars
): {
  compatibility: number;
  dynamic: YinYangPairDynamic;
  polarityMatchLabel: string;
  dmAttraction: boolean;
} {
  const profileA = computeYinYangProfile(pillarsA);
  const profileB = computeYinYangProfile(pillarsB);
  const rootednessA = computeChartStemBranchRelations(pillarsA as SBFourPillars);
  const rootednessB = computeChartStemBranchRelations(pillarsB as SBFourPillars);

  const breakdown = computeBreakdown(profileA, profileB, rootednessA, rootednessB);
  const dynamic = classifyDynamic(profileA, profileB, breakdown);
  const basicCompat = compareYinYangProfiles(profileA, profileB);

  return {
    compatibility: basicCompat.compatibility,
    dynamic,
    polarityMatchLabel: breakdown.polarityLabel,
    dmAttraction: breakdown.dmPolarityMatch
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeYinYangPairCompatibility,
  buildYinYangPairStory,
  quickYinYangComparison,
  DYNAMIC_NARRATIVES
};

export { DYNAMIC_NARRATIVES };
