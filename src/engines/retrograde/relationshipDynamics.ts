/**
 * Relationship Dynamics Analyzer
 *
 * Analyzes how retrograde planets affect relationship patterns:
 * - Autonomy needs
 * - Communication style
 * - Emotional processing
 * - Conflict style
 * - Bonding patterns
 * - Projection patterns
 * - Sexual polarity
 * - Commitment style
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type {
  Planet,
  PlanetState,
  RelationshipDynamicsProfile,
  AutonomyProfile,
  CommunicationProfile,
  EmotionalProfile,
  ConflictProfile,
  BondingProfile,
  ProjectionProfile,
  SexualProfile,
  CommitmentProfile
} from './types';
import { RetrogradeMatrix, getRetrogradeProfile } from './matrix';

// ========================================
// MAIN ANALYZER
// ========================================

/**
 * Compute full relationship dynamics profile from planetary states
 */
export function computeRelationshipDynamics(
  planets: PlanetState[]
): RelationshipDynamicsProfile {
  const retrograde = planets.filter(p => p.isRetrograde);

  return {
    autonomy: computeAutonomy(retrograde),
    communication: computeCommunication(retrograde, planets),
    emotional: computeEmotional(retrograde, planets),
    conflict: computeConflict(retrograde, planets),
    bonding: computeBonding(retrograde),
    projection: computeProjection(retrograde),
    sexual: computeSexual(retrograde, planets),
    commitment: computeCommitment(retrograde)
  };
}

// ========================================
// AUTONOMY PROFILE
// ========================================

function computeAutonomy(retrograde: PlanetState[]): AutonomyProfile {
  // Base autonomy from retrograde count
  let level = retrograde.length * 0.12;

  const needs: string[] = [];
  const triggers: string[] = [];

  // Specific planet contributions
  for (const p of retrograde) {
    switch (p.planet) {
      case 'Jupiter':
        level += 0.1;
        needs.push('Freedom to hold personal beliefs without correction');
        triggers.push('Partners who lecture or try to teach');
        break;

      case 'Saturn':
        level += 0.15;
        needs.push('Self-defined boundaries and rules');
        triggers.push('Partners who impose structure or control');
        break;

      case 'Uranus':
        level += 0.15;
        needs.push('Space for unconventional choices');
        triggers.push('Partners who demand predictability');
        break;

      case 'Mars':
        level += 0.08;
        needs.push('Freedom to act at own timing');
        triggers.push('Partners who push for immediate action');
        break;

      case 'Mercury':
        level += 0.05;
        needs.push('Time to process thoughts internally');
        triggers.push('Partners who demand quick responses');
        break;

      case 'Venus':
        level += 0.05;
        needs.push('Space to develop feelings privately');
        triggers.push('Partners who rush emotional declarations');
        break;

      case 'Neptune':
        level += 0.05;
        needs.push('Private imaginative space');
        triggers.push('Partners who are excessively literal');
        break;

      case 'Pluto':
        level += 0.1;
        needs.push('Control over own transformation process');
        triggers.push('Partners who try to change or fix them');
        break;
    }
  }

  // Cap at 1.0
  level = Math.min(1, level);

  // Add base needs if none from retrogrades
  if (needs.length === 0) {
    needs.push('Standard autonomy - comfortable with shared decision-making');
  }

  return { level, needs, triggers };
}

// ========================================
// COMMUNICATION PROFILE
// ========================================

function computeCommunication(retrograde: PlanetState[], all: PlanetState[]): CommunicationProfile {
  const hasMercuryRx = retrograde.some(p => p.planet === 'Mercury');
  const hasNeptuneRx = retrograde.some(p => p.planet === 'Neptune');
  const hasJupiterRx = retrograde.some(p => p.planet === 'Jupiter');

  const strengths: string[] = [];
  const challenges: string[] = [];
  let style = 'Standard communication patterns';

  if (hasMercuryRx) {
    style = 'Thoughtful, internally-processed communication';
    strengths.push('Thorough thinking before speaking');
    strengths.push('Excellent at written communication');
    strengths.push('Catches what others miss in review');
    challenges.push('May appear hesitant or uncertain');
    challenges.push('Difficulty with on-the-spot verbal responses');
  }

  if (hasNeptuneRx) {
    style = hasMercuryRx
      ? 'Thoughtful and intuitive communication'
      : 'Intuitive, symbolic communication';
    strengths.push('Picks up on unspoken meaning');
    strengths.push('Communicates in metaphor and imagery');
    challenges.push('May be unclear when literal precision is needed');
  }

  if (hasJupiterRx) {
    strengths.push('Communicates from authentic conviction');
    strengths.push('Not swayed by popular opinion');
    challenges.push('May seem stubborn about personal views');
  }

  // If no communication-affecting retrogrades
  if (strengths.length === 0) {
    strengths.push('Flexible communication style');
    strengths.push('Adapts to partner preferences');
  }

  if (challenges.length === 0) {
    challenges.push('Standard communication challenges apply');
  }

  return { style, strengths, challenges };
}

// ========================================
// EMOTIONAL PROFILE
// ========================================

function computeEmotional(retrograde: PlanetState[], all: PlanetState[]): EmotionalProfile {
  const hasVenusRx = retrograde.some(p => p.planet === 'Venus');
  const hasNeptuneRx = retrograde.some(p => p.planet === 'Neptune');
  const hasPlutoRx = retrograde.some(p => p.planet === 'Pluto');
  const hasMoonRx = false; // Moon doesn't go retrograde, but check Mars for emotional action

  let processing = 'Standard emotional processing';
  let depth = 0.5;
  let expression = 'Balanced emotional expression';

  if (hasVenusRx) {
    processing = 'Feelings develop privately before expression';
    depth += 0.15;
    expression = 'Reserved initially, deep once committed';
  }

  if (hasNeptuneRx) {
    processing = hasVenusRx
      ? 'Deeply internalized, intuitive emotional processing'
      : 'Intuitive, symbolic emotional processing';
    depth += 0.2;
    expression = 'Expresses through imagery, art, or indirect means';
  }

  if (hasPlutoRx) {
    processing = 'Deep internal emotional transformation';
    depth += 0.25;
    expression = 'Intense when expressed, controlled presentation';
  }

  // Cap depth at 1.0
  depth = Math.min(1, depth);

  return { processing, depth, expression };
}

// ========================================
// CONFLICT PROFILE
// ========================================

function computeConflict(retrograde: PlanetState[], all: PlanetState[]): ConflictProfile {
  const hasMarsRx = retrograde.some(p => p.planet === 'Mars');
  const hasSaturnRx = retrograde.some(p => p.planet === 'Saturn');
  const hasPlutoRx = retrograde.some(p => p.planet === 'Pluto');

  let style = 'Standard conflict approach';
  const triggers: string[] = [];
  let resolution = 'Seeks fair resolution through discussion';

  if (hasMarsRx) {
    style = 'Strategic, indirect conflict style';
    triggers.push('Being pushed to confront before ready');
    triggers.push('Demands for immediate action');
    resolution = 'Prefers to wait for optimal timing; indirect approaches';
  }

  if (hasSaturnRx) {
    style = hasMarsRx
      ? 'Strategic and self-defined conflict approach'
      : 'Self-defined boundaries in conflict';
    triggers.push('Attempts to impose rules or structure');
    triggers.push('Authority figures demanding compliance');
    resolution = 'Creates own rules for engagement; tests boundaries';
  }

  if (hasPlutoRx) {
    style = 'Deep, transformative conflict processing';
    triggers.push('Superficial handling of serious issues');
    triggers.push('Attempts to control or manipulate');
    resolution = 'Needs deep processing; conflict becomes transformation';
  }

  if (triggers.length === 0) {
    triggers.push('Standard conflict triggers');
  }

  return { style, triggers, resolution };
}

// ========================================
// BONDING PROFILE
// ========================================

function computeBonding(retrograde: PlanetState[]): BondingProfile {
  const hasVenusRx = retrograde.some(p => p.planet === 'Venus');
  const hasNeptuneRx = retrograde.some(p => p.planet === 'Neptune');
  const hasPlutoRx = retrograde.some(p => p.planet === 'Pluto');
  const hasSaturnRx = retrograde.some(p => p.planet === 'Saturn');

  let style = 'Standard bonding patterns';
  let timeframe = 'Normal bonding timeline';
  let depth = 0.5;

  if (hasVenusRx) {
    style = 'Deep, karmic bonding - attracted to the unconventional';
    timeframe = 'Slower to bond, deeper when committed';
    depth += 0.15;
  }

  if (hasNeptuneRx) {
    style = hasVenusRx
      ? 'Karmic, mythic bonding with spiritual dimension'
      : 'Spiritual, mythic bonding';
    timeframe = 'Bonds through shared symbolic/spiritual language';
    depth += 0.2;
  }

  if (hasPlutoRx) {
    style = 'Intense, transformative bonding';
    timeframe = 'Seeks depth from the start; superficial bonds don\'t satisfy';
    depth += 0.25;
  }

  if (hasSaturnRx) {
    style += ' with self-defined commitment structure';
    timeframe = 'Commits on own terms and timeline';
  }

  depth = Math.min(1, depth);

  return { style, timeframe, depth };
}

// ========================================
// PROJECTION PROFILE
// ========================================

function computeProjection(retrograde: PlanetState[]): ProjectionProfile {
  const projectionPlanets = retrograde.filter(p =>
    ['Venus', 'Neptune', 'Pluto'].includes(p.planet)
  );

  const blind_spots: string[] = [];
  let tendency = 'Minimal projection tendencies';

  if (projectionPlanets.some(p => p.planet === 'Venus')) {
    tendency = 'Projects idealized love onto partners';
    blind_spots.push('May see partner through lens of ideal, missing reality');
    blind_spots.push('Past relationship patterns can influence current perception');
  }

  if (projectionPlanets.some(p => p.planet === 'Neptune')) {
    tendency = projectionPlanets.some(p => p.planet === 'Venus')
      ? 'Strong projection of ideal and spiritual meaning onto partners'
      : 'Projects spiritual/mythic meaning onto partners';
    blind_spots.push('May confuse fantasy with partner\'s actual qualities');
    blind_spots.push('Symbolic interpretation may miss literal truth');
  }

  if (projectionPlanets.some(p => p.planet === 'Pluto')) {
    blind_spots.push('May project intensity or power dynamics onto partner');
    blind_spots.push('Could see depth where there is only surface');
  }

  if (blind_spots.length === 0) {
    blind_spots.push('Standard relational blind spots');
  }

  return { tendency, blind_spots };
}

// ========================================
// SEXUAL PROFILE
// ========================================

function computeSexual(retrograde: PlanetState[], all: PlanetState[]): SexualProfile {
  const hasMarsRx = retrograde.some(p => p.planet === 'Mars');
  const hasVenusRx = retrograde.some(p => p.planet === 'Venus');
  const hasPlutoRx = retrograde.some(p => p.planet === 'Pluto');

  let polarity = 'Balanced sexual expression';
  let intensity = 0.5;
  let connection = 'Standard sexual connection patterns';

  if (hasMarsRx) {
    polarity = 'Inverted or complex sexual polarity - initiates indirectly';
    intensity += 0.1;
    connection = 'Slow-burn intensity; strategic seduction';
  }

  if (hasVenusRx) {
    polarity = hasMarsRx
      ? 'Complex polarity with deep value alignment needed'
      : 'Attraction based on deep value alignment';
    intensity += 0.1;
    connection = 'Sexual connection tied to emotional depth';
  }

  if (hasPlutoRx) {
    polarity = 'Intense, transformative sexual energy';
    intensity += 0.3;
    connection = 'Sexuality as transformation; deep psychological dimension';
  }

  intensity = Math.min(1, intensity);

  return { polarity, intensity, connection };
}

// ========================================
// COMMITMENT PROFILE
// ========================================

function computeCommitment(retrograde: PlanetState[]): CommitmentProfile {
  const hasSaturnRx = retrograde.some(p => p.planet === 'Saturn');
  const hasVenusRx = retrograde.some(p => p.planet === 'Venus');
  const hasUranusRx = retrograde.some(p => p.planet === 'Uranus');

  let style = 'Standard commitment patterns';
  let timeline = 'Normal commitment timeline';
  let flexibility = 0.5;

  if (hasSaturnRx) {
    style = 'Commitment on self-defined terms';
    timeline = 'Commits when internal criteria are met, not external pressure';
    flexibility += 0.15;
  }

  if (hasVenusRx) {
    style = hasSaturnRx
      ? 'Self-defined commitment based on deep value alignment'
      : 'Commitment requires deep value alignment';
    timeline = 'Takes time but commits deeply once values align';
  }

  if (hasUranusRx) {
    style += ' with need for freedom within structure';
    timeline = 'May resist conventional commitment timelines';
    flexibility += 0.2;
  }

  flexibility = Math.min(1, flexibility);

  return { style, timeline, flexibility };
}

// ========================================
// COMPATIBILITY ANALYSIS
// ========================================

/**
 * Analyze relationship compatibility based on retrograde dynamics
 */
export function analyzeRelationshipCompatibility(
  person1: PlanetState[],
  person2: PlanetState[]
): CompatibilityAnalysis {
  const dynamics1 = computeRelationshipDynamics(person1);
  const dynamics2 = computeRelationshipDynamics(person2);

  const scores: CompatibilityScores = {
    autonomy: computeAutonomyCompatibility(dynamics1.autonomy, dynamics2.autonomy),
    communication: computeCommunicationCompatibility(dynamics1.communication, dynamics2.communication),
    emotional: computeEmotionalCompatibility(dynamics1.emotional, dynamics2.emotional),
    conflict: computeConflictCompatibility(dynamics1.conflict, dynamics2.conflict),
    sexual: computeSexualCompatibility(dynamics1.sexual, dynamics2.sexual),
    commitment: computeCommitmentCompatibility(dynamics1.commitment, dynamics2.commitment)
  };

  const overall = (
    scores.autonomy +
    scores.communication +
    scores.emotional +
    scores.conflict +
    scores.sexual +
    scores.commitment
  ) / 6;

  return {
    scores,
    overall,
    strengths: identifyStrengths(scores),
    challenges: identifyChallenges(scores),
    advice: generateCompatibilityAdvice(scores, dynamics1, dynamics2)
  };
}

interface CompatibilityAnalysis {
  scores: CompatibilityScores;
  overall: number;
  strengths: string[];
  challenges: string[];
  advice: string[];
}

interface CompatibilityScores {
  autonomy: number;
  communication: number;
  emotional: number;
  conflict: number;
  sexual: number;
  commitment: number;
}

function computeAutonomyCompatibility(a1: AutonomyProfile, a2: AutonomyProfile): number {
  // Similar autonomy needs = good compatibility
  const levelDiff = Math.abs(a1.level - a2.level);
  return 1 - levelDiff;
}

function computeCommunicationCompatibility(c1: CommunicationProfile, c2: CommunicationProfile): number {
  // More strengths in common = better
  const sharedStrengths = c1.strengths.filter(s => c2.strengths.includes(s)).length;
  return Math.min(1, 0.5 + sharedStrengths * 0.15);
}

function computeEmotionalCompatibility(e1: EmotionalProfile, e2: EmotionalProfile): number {
  // Similar depth = better
  const depthDiff = Math.abs(e1.depth - e2.depth);
  return 1 - depthDiff;
}

function computeConflictCompatibility(c1: ConflictProfile, c2: ConflictProfile): number {
  // Complementary conflict styles work
  // Both strategic or both direct = good
  const styles = [c1.style, c2.style];
  if (styles.every(s => s.includes('Strategic')) || styles.every(s => s.includes('Standard'))) {
    return 0.8;
  }
  return 0.5;
}

function computeSexualCompatibility(s1: SexualProfile, s2: SexualProfile): number {
  // Similar intensity = better
  const intensityDiff = Math.abs(s1.intensity - s2.intensity);
  return 1 - intensityDiff;
}

function computeCommitmentCompatibility(c1: CommitmentProfile, c2: CommitmentProfile): number {
  // Similar flexibility = better
  const flexDiff = Math.abs(c1.flexibility - c2.flexibility);
  return 1 - flexDiff;
}

function identifyStrengths(scores: CompatibilityScores): string[] {
  const strengths: string[] = [];
  if (scores.autonomy > 0.7) strengths.push('Compatible autonomy needs');
  if (scores.communication > 0.7) strengths.push('Strong communication alignment');
  if (scores.emotional > 0.7) strengths.push('Emotional depth compatibility');
  if (scores.conflict > 0.7) strengths.push('Complementary conflict styles');
  if (scores.sexual > 0.7) strengths.push('Sexual intensity alignment');
  if (scores.commitment > 0.7) strengths.push('Compatible commitment styles');
  return strengths;
}

function identifyChallenges(scores: CompatibilityScores): string[] {
  const challenges: string[] = [];
  if (scores.autonomy < 0.4) challenges.push('Mismatched autonomy needs');
  if (scores.communication < 0.4) challenges.push('Communication style differences');
  if (scores.emotional < 0.4) challenges.push('Different emotional depths');
  if (scores.conflict < 0.4) challenges.push('Conflicting conflict styles');
  if (scores.sexual < 0.4) challenges.push('Sexual intensity mismatch');
  if (scores.commitment < 0.4) challenges.push('Different commitment approaches');
  return challenges;
}

function generateCompatibilityAdvice(
  scores: CompatibilityScores,
  d1: RelationshipDynamicsProfile,
  d2: RelationshipDynamicsProfile
): string[] {
  const advice: string[] = [];

  if (scores.autonomy < 0.5) {
    advice.push('Discuss and negotiate autonomy needs early - one partner may need more space');
  }

  if (scores.communication < 0.5) {
    advice.push('Develop patience with different communication styles - written vs. verbal, fast vs. slow');
  }

  if (scores.emotional < 0.5) {
    advice.push('Honor different emotional processing speeds - don\'t rush or judge depth differences');
  }

  if (scores.conflict < 0.5) {
    advice.push('Create explicit conflict protocols - timing, approach, and resolution methods');
  }

  if (advice.length === 0) {
    advice.push('Strong retrograde compatibility - maintain mutual respect for internal processes');
  }

  return advice;
}
