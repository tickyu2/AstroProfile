/**
 * Team Leadership Overlay
 *
 * Analyzes how two individual leadership signatures combine
 * into a shared leadership dynamic - the way a couple
 * navigates decisions, visibility, and authority together.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import { LeadershipOverlayResult, LeadershipStyle } from './leadershipOverlay';

// ========================================
// TYPES
// ========================================

export interface TeamLeadershipOverlayResult {
  synergy: number;                    // 0..1
  polarity: TeamPolarity;
  decisionStyle: TeamDecisionStyle;
  teamLeadershipDelta: number;
  visibilityBalance: VisibilityBalance;
  autonomyDynamic: AutonomyDynamic;
  narrative: string;
  strengths: string[];
  challenges: string[];
  decisionRecommendations: string[];
}

export type TeamPolarity =
  | 'Aligned'           // Both similar leadership levels
  | 'Complementary'     // Different but harmonious
  | 'Clashing'          // Both strong, may conflict
  | 'Asymmetric';       // Very different levels

export type TeamDecisionStyle =
  | 'Consensus Seekers'
  | 'Natural Hierarchy'
  | 'Rotating Authority'
  | 'Parallel Processing'
  | 'Creative Tension';

export type VisibilityBalance =
  | 'Shared Spotlight'
  | 'One Leads Publicly'
  | 'Both Prefer Background'
  | 'Compete for Attention';

export type AutonomyDynamic =
  | 'Independent Partners'
  | 'Intertwined Decisions'
  | 'One Autonomous, One Connected'
  | 'Mutual Dependence';

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute team leadership dynamics from two individual overlays
 */
export function computeTeamLeadershipOverlay(
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult
): TeamLeadershipOverlayResult {
  // Calculate leadership differential
  const leadershipDiff = Math.abs(person1.leadershipScore - person2.leadershipScore);
  const autonomyDiff = Math.abs(person1.autonomyScore - person2.autonomyScore);
  const visibilityDiff = Math.abs(person1.visibilityScore - person2.visibilityScore);

  // Determine polarity
  const polarity = determinePolarity(
    person1.leadershipScore,
    person2.leadershipScore,
    leadershipDiff
  );

  // Calculate synergy
  const synergy = calculateSynergy(
    leadershipDiff,
    autonomyDiff,
    visibilityDiff,
    polarity,
    person1.leadershipStyle,
    person2.leadershipStyle
  );

  // Determine decision style
  const decisionStyle = determineDecisionStyle(
    person1, person2, polarity, synergy
  );

  // Determine visibility balance
  const visibilityBalance = determineVisibilityBalance(
    person1.visibilityScore,
    person2.visibilityScore
  );

  // Determine autonomy dynamic
  const autonomyDynamic = determineAutonomyDynamic(
    person1.autonomyScore,
    person2.autonomyScore
  );

  // Calculate delta
  const teamLeadershipDelta = synergy * (polarity === 'Clashing' ? -0.04 : 0.04);

  // Build narrative
  const narrative = buildTeamLeadershipNarrative(
    polarity, decisionStyle, visibilityBalance, autonomyDynamic, synergy
  );

  // Get traits
  const { strengths, challenges, decisionRecommendations } = getTeamLeadershipTraits(
    polarity, decisionStyle, visibilityBalance, person1, person2
  );

  return {
    synergy,
    polarity,
    decisionStyle,
    teamLeadershipDelta,
    visibilityBalance,
    autonomyDynamic,
    narrative,
    strengths,
    challenges,
    decisionRecommendations
  };
}

// ========================================
// DETERMINATION FUNCTIONS
// ========================================

function determinePolarity(
  score1: number,
  score2: number,
  diff: number
): TeamPolarity {
  const bothHigh = score1 > 0.55 && score2 > 0.55;
  const bothLow = score1 < 0.35 && score2 < 0.35;

  if (diff < 0.15) {
    if (bothHigh) return 'Clashing';
    return 'Aligned';
  }

  if (diff < 0.35) {
    return 'Complementary';
  }

  return 'Asymmetric';
}

function calculateSynergy(
  leadershipDiff: number,
  autonomyDiff: number,
  visibilityDiff: number,
  polarity: TeamPolarity,
  style1: LeadershipStyle,
  style2: LeadershipStyle
): number {
  // Base synergy from differences
  let synergy = 1 - (leadershipDiff + autonomyDiff + visibilityDiff) / 3;

  // Adjust for polarity
  if (polarity === 'Complementary') synergy += 0.1;
  if (polarity === 'Clashing') synergy -= 0.2;

  // Check for complementary styles
  if (areStylesComplementary(style1, style2)) {
    synergy += 0.15;
  }

  // Check for conflicting styles
  if (areStylesConflicting(style1, style2)) {
    synergy -= 0.1;
  }

  return Math.max(0, Math.min(1, synergy));
}

function areStylesComplementary(style1: LeadershipStyle, style2: LeadershipStyle): boolean {
  const complementaryPairs: [LeadershipStyle, LeadershipStyle][] = [
    ['Visionary Commander', 'Supportive Presence'],
    ['Charismatic Performer', 'Quiet Authority'],
    ['Innovative Disruptor', 'Collaborative Guide'],
    ['Visionary Commander', 'Collaborative Guide'],
    ['Charismatic Performer', 'Supportive Presence']
  ];

  return complementaryPairs.some(
    ([a, b]) => (style1 === a && style2 === b) || (style1 === b && style2 === a)
  );
}

function areStylesConflicting(style1: LeadershipStyle, style2: LeadershipStyle): boolean {
  const conflictingPairs: [LeadershipStyle, LeadershipStyle][] = [
    ['Visionary Commander', 'Visionary Commander'],
    ['Innovative Disruptor', 'Innovative Disruptor'],
    ['Charismatic Performer', 'Charismatic Performer']
  ];

  return conflictingPairs.some(
    ([a, b]) => style1 === a && style2 === b
  );
}

function determineDecisionStyle(
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult,
  polarity: TeamPolarity,
  synergy: number
): TeamDecisionStyle {
  const avgLeadership = (person1.leadershipScore + person2.leadershipScore) / 2;

  if (polarity === 'Aligned' && synergy > 0.7) {
    return 'Consensus Seekers';
  }

  if (polarity === 'Asymmetric') {
    return 'Natural Hierarchy';
  }

  if (polarity === 'Clashing') {
    return synergy > 0.5 ? 'Creative Tension' : 'Creative Tension';
  }

  if (person1.autonomyScore > 0.6 && person2.autonomyScore > 0.6) {
    return 'Parallel Processing';
  }

  if (polarity === 'Complementary') {
    return 'Rotating Authority';
  }

  return 'Consensus Seekers';
}

function determineVisibilityBalance(
  visibility1: number,
  visibility2: number
): VisibilityBalance {
  const diff = Math.abs(visibility1 - visibility2);
  const bothHigh = visibility1 > 0.5 && visibility2 > 0.5;
  const bothLow = visibility1 < 0.35 && visibility2 < 0.35;

  if (diff < 0.15 && bothHigh) {
    return 'Compete for Attention';
  }

  if (diff < 0.15) {
    return bothLow ? 'Both Prefer Background' : 'Shared Spotlight';
  }

  return 'One Leads Publicly';
}

function determineAutonomyDynamic(
  autonomy1: number,
  autonomy2: number
): AutonomyDynamic {
  const bothHigh = autonomy1 > 0.5 && autonomy2 > 0.5;
  const bothLow = autonomy1 < 0.4 && autonomy2 < 0.4;
  const diff = Math.abs(autonomy1 - autonomy2);

  if (bothHigh) return 'Independent Partners';
  if (bothLow) return 'Mutual Dependence';
  if (diff > 0.3) return 'One Autonomous, One Connected';
  return 'Intertwined Decisions';
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildTeamLeadershipNarrative(
  polarity: TeamPolarity,
  decisionStyle: TeamDecisionStyle,
  visibilityBalance: VisibilityBalance,
  autonomyDynamic: AutonomyDynamic,
  synergy: number
): string {
  const synergyPercent = Math.round(synergy * 100);

  const polarityNarratives: Record<TeamPolarity, string> = {
    'Aligned': `Your leadership energies are well-aligned (${synergyPercent}% synergy), creating natural understanding in how you approach decisions and authority.`,
    'Complementary': `Your leadership styles complement each other (${synergyPercent}% synergy), with each partner bringing different strengths to shared navigation.`,
    'Clashing': `Two strong leadership energies meet (${synergyPercent}% synergy). This can create dynamic tension—powerful when channeled, challenging when competing.`,
    'Asymmetric': `A natural asymmetry exists in your leadership dynamic (${synergyPercent}% synergy). One naturally leads while the other supports—this works when both feel valued.`
  };

  let narrative = polarityNarratives[polarity];

  // Add decision style
  narrative += ` Your natural decision-making style tends toward ${decisionStyle.toLowerCase()}.`;

  // Add visibility insight
  if (visibilityBalance === 'Compete for Attention') {
    narrative += ' You may sometimes compete for the spotlight—conscious sharing helps.';
  } else if (visibilityBalance === 'Both Prefer Background') {
    narrative += ' Neither strongly seeks visibility—you may need to push each other forward at times.';
  }

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getTeamLeadershipTraits(
  polarity: TeamPolarity,
  decisionStyle: TeamDecisionStyle,
  visibilityBalance: VisibilityBalance,
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult
): { strengths: string[]; challenges: string[]; decisionRecommendations: string[] } {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const decisionRecommendations: string[] = [];

  // Polarity-based traits
  switch (polarity) {
    case 'Aligned':
      strengths.push('Natural understanding', 'Easy coordination');
      challenges.push('May lack diverse perspectives');
      break;
    case 'Complementary':
      strengths.push('Gap coverage', 'Balanced approach', 'Diverse strengths');
      challenges.push('May need to explain different approaches');
      break;
    case 'Clashing':
      strengths.push('Dynamic energy', 'Powerful when united');
      challenges.push('Power struggles', 'Competition for control');
      decisionRecommendations.push('Establish clear domains', 'Practice ego surrender');
      break;
    case 'Asymmetric':
      strengths.push('Clear roles', 'Natural efficiency');
      challenges.push('Supporter may feel undervalued');
      decisionRecommendations.push('Acknowledge both contributions', 'Rotate leadership in some areas');
      break;
  }

  // Decision style recommendations
  switch (decisionStyle) {
    case 'Consensus Seekers':
      decisionRecommendations.push('Set time limits for decisions', 'Practice tie-breaking protocols');
      break;
    case 'Natural Hierarchy':
      decisionRecommendations.push('Ensure input from both partners', 'Validate the supporter role');
      break;
    case 'Rotating Authority':
      decisionRecommendations.push('Clarify who leads which domain', 'Trust partner\'s areas of authority');
      break;
    case 'Parallel Processing':
      decisionRecommendations.push('Schedule sync points', 'Respect individual autonomy');
      break;
    case 'Creative Tension':
      decisionRecommendations.push('Use disagreement productively', 'Celebrate when you align');
      break;
  }

  // Add visibility balance traits
  if (visibilityBalance === 'Compete for Attention') {
    challenges.push('Spotlight competition');
    decisionRecommendations.push('Take turns in visible roles');
  }

  return {
    strengths: strengths.slice(0, 4),
    challenges: challenges.slice(0, 4),
    decisionRecommendations: decisionRecommendations.slice(0, 4)
  };
}

// ========================================
// PERSONA VOICES
// ========================================

export const TeamLeadershipPersonaVoices: Record<TeamPolarity, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'Aligned': {
    mentor: 'Your aligned leadership is a gift—you naturally understand each other\'s approach. Guard against groupthink.',
    oracle: 'Two forces move in the same current. Your shared direction is powerful—ensure it remains chosen, not assumed.',
    companion: 'You get each other! That\'s great—just make sure you\'re still challenging each other to grow.',
    mirror: 'Notice how easily you coordinate. That alignment is valuable—and sometimes needs fresh perspective.'
  },
  'Complementary': {
    mentor: 'Your different strengths complete each other. Honor what each brings; this is partnership at its best.',
    oracle: 'Two different notes create a chord. Your harmony emerges from difference, not sameness.',
    companion: 'You cover each other\'s blind spots so well! That\'s what teamwork looks like.',
    mirror: 'Notice how your differences serve the whole. That complementarity is intentional—appreciate it.'
  },
  'Clashing': {
    mentor: 'Two strong forces meet—this can forge steel or cause explosion. The choice is made in how you hold the tension.',
    oracle: 'Twin suns in one sky create eclipse or brilliance. Your power together demands conscious wielding.',
    companion: 'Wow, you\'re both so strong! The challenge is channeling that energy together, not against each other.',
    mirror: 'Notice the power struggle temptation. That intensity can become synergy—if you choose collaboration.'
  },
  'Asymmetric': {
    mentor: 'Natural hierarchy can serve both—when the leader honors the supporter, and the supporter claims their worth.',
    oracle: 'The visible sun and the reflecting moon—both are necessary. One leads not by superiority but by position.',
    companion: 'Your roles are different but both matter. Make sure the quieter partner feels truly valued.',
    mirror: 'Notice the asymmetry in your dynamic. It works when both feel chosen, not diminished.'
  }
};

/**
 * Get team leadership persona voice
 */
export function getTeamLeadershipPersonaVoice(
  result: TeamLeadershipOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return TeamLeadershipPersonaVoices[result.polarity][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface TeamLeadershipChamber {
  id: string;
  name: string;
  description: string;
  polarity: TeamPolarity;
}

export const TeamLeadershipChambers: Record<TeamPolarity, TeamLeadershipChamber> = {
  'Aligned': {
    id: 'hall-of-mirrored-crowns',
    name: 'The Hall of Mirrored Crowns',
    description: 'You enter the Hall of Mirrored Crowns together, where two thrones face each other in perfect symmetry. Here, aligned leadership finds its reflection—what one sees, the other recognizes.',
    polarity: 'Aligned'
  },
  'Complementary': {
    id: 'chamber-of-interlocking-scepters',
    name: 'The Chamber of Interlocking Scepters',
    description: 'You enter the Chamber where two different scepters interlock to form a complete circle. Here, complementary leadership discovers its wholeness—different strengths united.',
    polarity: 'Complementary'
  },
  'Clashing': {
    id: 'arena-of-twin-flames',
    name: 'The Arena of Twin Flames',
    description: 'You enter the Arena where two flames dance in eternal negotiation. Here, powerful leadership meets its match—not to extinguish but to forge something new.',
    polarity: 'Clashing'
  },
  'Asymmetric': {
    id: 'tower-of-sun-and-moon',
    name: 'The Tower of Sun and Moon',
    description: 'You ascend the Tower where the sun occupies the peak and the moon the balcony—different positions, equal importance. Here, asymmetric leadership finds its dignity.',
    polarity: 'Asymmetric'
  }
};

/**
 * Get team leadership chamber narrative
 */
export function getTeamLeadershipChamberNarrative(result: TeamLeadershipOverlayResult): string {
  const chamber = TeamLeadershipChambers[result.polarity];
  return chamber.description;
}
