/**
 * Leadership Overlay
 *
 * Models leadership dynamics from:
 * - Leo Rising → expressive leadership, visibility, charisma
 * - Sun-Uranus → independence, innovation, self-directed identity
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface ChartDataForLeadership {
  ascendant: {
    sign: string;
    degree: number;
  };
  sun: {
    sign: string;
    degree: number;
    house: number;
  };
  aspects: Array<{
    type: string;
    planets: string[];
    orb: number;
  }>;
}

export interface LeadershipOverlayResult {
  leadershipScore: number;      // 0..1
  autonomyScore: number;        // 0..1
  expressionScore: number;      // 0..1
  visibilityScore: number;      // 0..1
  leadershipDelta: number;      // contribution to final decision
  narrative: string;
  leadershipStyle: LeadershipStyle;
  strengths: string[];
  challenges: string[];
}

export type LeadershipStyle =
  | 'Visionary Commander'
  | 'Charismatic Performer'
  | 'Innovative Disruptor'
  | 'Quiet Authority'
  | 'Collaborative Guide'
  | 'Supportive Presence';

// ========================================
// FIRE SIGNS & LEADERSHIP INDICATORS
// ========================================

const FIRE_SIGNS = ['Aries', 'Leo', 'Sagittarius'];
const LEADERSHIP_SIGNS = ['Leo', 'Aries', 'Capricorn', 'Scorpio'];
const EXPRESSIVE_SIGNS = ['Leo', 'Sagittarius', 'Gemini', 'Libra'];
const INDEPENDENT_SIGNS = ['Aquarius', 'Aries', 'Sagittarius', 'Scorpio'];

const ANGULAR_HOUSES = [1, 4, 7, 10];

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute Leadership Overlay from chart data
 */
export function computeLeadershipOverlay(chart: ChartDataForLeadership): LeadershipOverlayResult {
  // Leo Rising check
  const leoAscendant = chart.ascendant.sign === 'Leo';
  const fireAscendant = FIRE_SIGNS.includes(chart.ascendant.sign);
  const leadershipAscendant = LEADERSHIP_SIGNS.includes(chart.ascendant.sign);

  // Anaretic degree (29°) amplifies expression
  const anaretícDegree = chart.ascendant.degree >= 29;

  // Sun-Uranus conjunction check
  const sunUranusConjunction = chart.aspects.some(
    a => a.type === 'conjunction' &&
         a.planets.includes('Sun') &&
         a.planets.includes('Uranus') &&
         a.orb <= 10
  );

  // Sun-Uranus square/opposition (more volatile leadership)
  const sunUranusTension = chart.aspects.some(
    a => ['square', 'opposition'].includes(a.type) &&
         a.planets.includes('Sun') &&
         a.planets.includes('Uranus')
  );

  // Sun in angular house
  const sunAngular = ANGULAR_HOUSES.includes(chart.sun.house);

  // Calculate component scores
  let expressionScore = 0;
  if (leoAscendant) expressionScore += 0.5;
  else if (fireAscendant) expressionScore += 0.3;
  else if (leadershipAscendant) expressionScore += 0.25;

  if (anaretícDegree) expressionScore += 0.15;
  if (EXPRESSIVE_SIGNS.includes(chart.sun.sign)) expressionScore += 0.2;
  if (sunAngular) expressionScore += 0.15;

  expressionScore = Math.min(1, expressionScore);

  let autonomyScore = 0;
  if (sunUranusConjunction) autonomyScore += 0.6;
  if (sunUranusTension) autonomyScore += 0.3;
  if (INDEPENDENT_SIGNS.includes(chart.ascendant.sign)) autonomyScore += 0.2;
  if (INDEPENDENT_SIGNS.includes(chart.sun.sign)) autonomyScore += 0.2;

  autonomyScore = Math.min(1, autonomyScore);

  let visibilityScore = 0;
  if (leoAscendant) visibilityScore += 0.5;
  if (sunAngular) visibilityScore += 0.3;
  if (chart.sun.house === 10) visibilityScore += 0.2;  // MC
  if (fireAscendant) visibilityScore += 0.15;

  visibilityScore = Math.min(1, visibilityScore);

  // Combined leadership score
  const leadershipScore = (expressionScore * 0.4 + autonomyScore * 0.35 + visibilityScore * 0.25);

  // Leadership delta for decision engine
  const leadershipDelta = leadershipScore * 0.08;

  // Determine leadership style
  const leadershipStyle = determineLeadershipStyle(expressionScore, autonomyScore, visibilityScore);

  // Build narrative
  const narrative = buildLeadershipNarrative(leadershipScore, autonomyScore, expressionScore, visibilityScore, leadershipStyle);

  // Strengths and challenges
  const { strengths, challenges } = getLeadershipTraits(leadershipScore, autonomyScore, expressionScore, visibilityScore, sunUranusTension);

  return {
    leadershipScore,
    autonomyScore,
    expressionScore,
    visibilityScore,
    leadershipDelta,
    narrative,
    leadershipStyle,
    strengths,
    challenges
  };
}

// ========================================
// LEADERSHIP STYLE DETERMINATION
// ========================================

function determineLeadershipStyle(expression: number, autonomy: number, visibility: number): LeadershipStyle {
  const total = expression + autonomy + visibility;

  if (expression > 0.6 && autonomy > 0.6) {
    return 'Visionary Commander';
  }

  if (expression > 0.6 && visibility > 0.5) {
    return 'Charismatic Performer';
  }

  if (autonomy > 0.6 && expression < 0.4) {
    return 'Innovative Disruptor';
  }

  if (visibility > 0.5 && expression < 0.4) {
    return 'Quiet Authority';
  }

  if (total > 0.8 && expression < 0.5) {
    return 'Collaborative Guide';
  }

  return 'Supportive Presence';
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildLeadershipNarrative(
  leadership: number,
  autonomy: number,
  expression: number,
  visibility: number,
  style: LeadershipStyle
): string {
  const narratives: Record<LeadershipStyle, string> = {
    'Visionary Commander': 'Your chart radiates commanding presence with innovative vision. You lead through bold self-expression and autonomous decision-making, naturally drawing others into your orbit.',

    'Charismatic Performer': 'Your leadership style shines through magnetic self-expression and natural visibility. You inspire through your presence and creative self-assertion.',

    'Innovative Disruptor': 'You lead through unconventional means and independent thinking. Your authority comes from breaking patterns rather than following established paths.',

    'Quiet Authority': 'Your leadership is felt rather than announced. You carry natural gravitas without needing dramatic expression, influencing through steady presence.',

    'Collaborative Guide': 'You lead best alongside others, combining visibility with collaborative instincts. Your authority emerges through partnership and shared vision.',

    'Supportive Presence': 'Leadership is not your dominant mode, but you provide essential support in group dynamics. You influence through reliability and quiet competence.'
  };

  let narrative = narratives[style];

  // Add modifiers
  if (autonomy > 0.7) {
    narrative += ' Your Sun-Uranus signature amplifies your need for independence in all relationships.';
  }

  if (expression > 0.7 && visibility > 0.6) {
    narrative += ' The Leo flame in your chart demands recognition and creative self-expression.';
  }

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getLeadershipTraits(
  leadership: number,
  autonomy: number,
  expression: number,
  visibility: number,
  hasTension: boolean
): { strengths: string[]; challenges: string[] } {
  const strengths: string[] = [];
  const challenges: string[] = [];

  if (expression > 0.5) {
    strengths.push('Natural self-expression');
    strengths.push('Confident presence');
  }

  if (autonomy > 0.5) {
    strengths.push('Independent decision-making');
    strengths.push('Innovative thinking');
  }

  if (visibility > 0.5) {
    strengths.push('Natural visibility');
    strengths.push('Commanding presence');
  }

  if (leadership > 0.6) {
    strengths.push('Inspirational influence');
  }

  // Challenges
  if (autonomy > 0.7) {
    challenges.push('May resist collaboration');
    challenges.push('Can appear unpredictable');
  }

  if (expression > 0.7) {
    challenges.push('May overshadow others');
    challenges.push('Needs recognition to feel valued');
  }

  if (hasTension) {
    challenges.push('Leadership style may cause friction');
    challenges.push('Sudden changes in direction');
  }

  if (leadership < 0.3) {
    challenges.push('May struggle with assertiveness');
  }

  return {
    strengths: strengths.length > 0 ? strengths : ['Adaptable presence'],
    challenges: challenges.length > 0 ? challenges : ['Finding leadership voice']
  };
}

// ========================================
// PERSONA VOICES
// ========================================

export const LeadershipPersonaVoices = {
  high: {
    mentor: 'Your presence carries natural authority. Lead with that radiance, but remember that true leadership also knows when to step back.',
    oracle: 'The solar gate opens for you. Your flame illuminates the path—others follow because they see clearly when you shine.',
    companion: 'You have such a natural way of taking charge. Just make sure to leave room for others to shine too.',
    mirror: 'Notice how naturally you assume leadership. That capacity is yours—not something you need to prove.'
  },
  medium: {
    mentor: 'Your leadership emerges in specific contexts. Trust those moments when your voice naturally rises.',
    oracle: 'The flame flickers within—not always visible, but ready to ignite when the moment calls.',
    companion: 'You shine when you feel safe to express yourself. Find those spaces.',
    mirror: 'Notice when leadership feels natural versus forced. Honor that distinction.'
  },
  low: {
    mentor: 'Leadership is not your primary mode, and that is its own kind of strength. Support and steady presence are valuable too.',
    oracle: 'The quiet waters carry their own power. Not all influence requires fire.',
    companion: 'It's okay not to be the leader. You contribute in ways that don't need the spotlight.',
    mirror: 'Notice where you feel most comfortable contributing. That is your authentic place.'
  }
};

/**
 * Get leadership persona voice
 */
export function getLeadershipPersonaVoice(
  result: LeadershipOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  const tier = result.leadershipScore > 0.6 ? 'high' : result.leadershipScore > 0.3 ? 'medium' : 'low';
  return LeadershipPersonaVoices[tier][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface LeadershipChamber {
  id: string;
  name: string;
  description: string;
  element: 'fire' | 'light' | 'radiance';
  ritualHour: string;
}

export const SolarGateOfSovereignty: LeadershipChamber = {
  id: 'solar-gate-of-sovereignty',
  name: 'The Solar Gate of Sovereignty',
  description: 'You stand before the Solar Gate, where identity meets innovation. Here, the Leo flame and the Uranian spark weave together, forming a path of expressive autonomy and radiant leadership.',
  element: 'fire',
  ritualHour: 'High Noon'
};

/**
 * Get leadership chamber narrative
 */
export function getLeadershipChamberNarrative(result: LeadershipOverlayResult): string {
  if (result.leadershipScore > 0.6) {
    return `${SolarGateOfSovereignty.description} The gate opens fully for you—your radiance belongs here.`;
  }

  if (result.leadershipScore > 0.3) {
    return `${SolarGateOfSovereignty.description} The gate is ajar, inviting you to step forward when ready.`;
  }

  return `${SolarGateOfSovereignty.description} The gate acknowledges you, though you may find other chambers more resonant.`;
}
