/**
 * Retrograde Narrative Templates
 *
 * Generates natural language narratives for AI personas and UI display
 * based on retrograde analysis.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type {
  Planet,
  PlanetState,
  InternalAuthorityProfile,
  NarrativeTemplates,
  InteractionPattern,
  AuthorityTier
} from './types';
import { getRetrogradeProfile, RetrogradeMatrix } from './matrix';
import { computeInternalAuthorityProfile } from './calculators';
import { PLANET_SYMBOLS } from './types';

// ========================================
// MAIN NARRATIVE GENERATOR
// ========================================

/**
 * Generate complete narrative templates for a chart
 */
export function generateNarratives(planets: PlanetState[]): NarrativeTemplates {
  const retrograde = planets.filter(p => p.isRetrograde);
  const iap = computeInternalAuthorityProfile(planets);

  return {
    headline: generateHeadline(retrograde, iap),
    summary: generateSummary(retrograde, iap),
    description: generateDescription(retrograde, iap),
    keyPhrases: iap.keyPhrases,
    decisionGuidance: generateDecisionGuidance(retrograde, iap),
    relationshipGuidance: generateRelationshipGuidance(retrograde)
  };
}

// ========================================
// HEADLINE
// ========================================

function generateHeadline(retrograde: PlanetState[], iap: InternalAuthorityProfile): string {
  if (retrograde.length === 0) {
    return 'Externally Oriented - Consensus Seeker';
  }

  if (retrograde.length === 1) {
    const p = retrograde[0];
    const profile = getRetrogradeProfile(p.planet);
    return `${profile.archetype} (${PLANET_SYMBOLS[p.planet]} Rx)`;
  }

  // Multiple retrogrades
  const tierTitles: Record<AuthorityTier, string> = {
    external: 'Light Internal Orientation',
    balanced: 'Balanced Authority',
    internal: 'Internal Authority',
    autonomous: 'Autonomous Decision-Maker',
    sovereign: 'Self-Sovereign System'
  };

  const symbols = retrograde.map(p => PLANET_SYMBOLS[p.planet]).join(' ');
  return `${tierTitles[iap.tier]} (${symbols} Rx)`;
}

// ========================================
// SUMMARY (2-3 sentences)
// ========================================

function generateSummary(retrograde: PlanetState[], iap: InternalAuthorityProfile): string {
  if (retrograde.length === 0) {
    return 'This chart has no retrograde planets, indicating a naturally externally-oriented decision system. ' +
      'Seeks validation from experts, consensus, and established norms.';
  }

  const count = retrograde.length;
  const planets = retrograde.map(p => p.planet).join(', ');

  let summary = `With ${count} retrograde planet${count > 1 ? 's' : ''} (${planets}), `;

  // Add tier-based description
  const tierDescriptions: Record<AuthorityTier, string> = {
    external: 'this chart shows slight internal orientation while still valuing external input.',
    balanced: 'this chart balances internal conviction with external validation.',
    internal: 'this chart tends toward self-referential decision-making.',
    autonomous: 'this chart operates with strong internal authority.',
    sovereign: 'this chart represents a fully self-referential belief and rule system.'
  };

  summary += tierDescriptions[iap.tier];

  // Add dominant influence
  if (iap.dominant) {
    const profile = getRetrogradeProfile(iap.dominant);
    summary += ` The dominant influence is ${iap.dominant} Rx: "${profile.coreStatement}"`;
  }

  return summary;
}

// ========================================
// DESCRIPTION (full paragraph)
// ========================================

function generateDescription(retrograde: PlanetState[], iap: InternalAuthorityProfile): string {
  if (retrograde.length === 0) {
    return 'With no retrograde planets in this chart, the decision-making system is primarily externally oriented. ' +
      'This person naturally looks to experts, consensus, and established norms for validation. ' +
      'They tend to trust external authority and seek input before making major decisions. ' +
      'This is not a weakness - it indicates strong social integration and responsiveness to feedback.';
  }

  const parts: string[] = [];

  // Opening
  const count = retrograde.length;
  parts.push(
    `This chart features ${count} retrograde planet${count > 1 ? 's' : ''}, ` +
    `creating ${iap.tier === 'sovereign' ? 'a' : 'an'} ${iap.tier} internal authority profile.`
  );

  // Per-planet descriptions
  for (const p of retrograde) {
    const profile = getRetrogradeProfile(p.planet);
    parts.push(
      `${PLANET_SYMBOLS[p.planet]} ${p.planet} Rx (${profile.archetype}): ${profile.internalization.internalProcess}. ` +
      `Core statement: "${profile.coreStatement}"`
    );
  }

  // Integration statement
  if (retrograde.length >= 2) {
    const combined = retrograde.map(p => {
      const profile = getRetrogradeProfile(p.planet);
      return `${p.planet} (${profile.internalization.domain.split(',')[0]})`;
    }).join(' + ');

    parts.push(
      `Together, these retrogrades (${combined}) create a self-referential system where ` +
      `decisions emerge from internal processing rather than external validation.`
    );
  }

  return parts.join(' ');
}

// ========================================
// DECISION GUIDANCE
// ========================================

function generateDecisionGuidance(retrograde: PlanetState[], iap: InternalAuthorityProfile): string {
  if (retrograde.length === 0) {
    return 'Decision guidance: Seek input from trusted advisors and experts. ' +
      'Your strength is integrating external perspectives. Trust the process of consultation.';
  }

  const guidance: string[] = ['Decision guidance:'];

  // Tier-based opening
  const tierOpening: Record<AuthorityTier, string> = {
    external: 'While you have some internal orientation, continue to value external input.',
    balanced: 'Balance your internal intuition with external verification.',
    internal: 'Trust your internal conclusions while doing reality checks.',
    autonomous: 'Your internal authority is your strength - lead with conviction.',
    sovereign: 'You operate from a fully self-referential system. Trust your internal compass.'
  };

  guidance.push(tierOpening[iap.tier]);

  // Per-planet guidance
  for (const p of retrograde) {
    const profile = getRetrogradeProfile(p.planet);
    guidance.push(`${p.planet} Rx: ${profile.decision.strength}`);
  }

  return guidance.join(' ');
}

// ========================================
// RELATIONSHIP GUIDANCE
// ========================================

function generateRelationshipGuidance(retrograde: PlanetState[]): string {
  if (retrograde.length === 0) {
    return 'Relationship guidance: You naturally adapt to partners and value shared decision-making. ' +
      'Communicate needs clearly as partners may not realize how much you value their input.';
  }

  const guidance: string[] = ['Relationship guidance:'];

  // Key themes
  const hasVenusRx = retrograde.some(p => p.planet === 'Venus');
  const hasMarsRx = retrograde.some(p => p.planet === 'Mars');
  const hasSaturnRx = retrograde.some(p => p.planet === 'Saturn');
  const hasJupiterRx = retrograde.some(p => p.planet === 'Jupiter');

  if (hasVenusRx) {
    guidance.push('Love develops privately - give yourself time and communicate when ready.');
  }

  if (hasMarsRx) {
    guidance.push('Your timing is strategic - partners should understand this is strength, not avoidance.');
  }

  if (hasSaturnRx) {
    guidance.push('You commit on your own terms - find partners who respect self-defined boundaries.');
  }

  if (hasJupiterRx) {
    guidance.push('Partners who accept your worldview without trying to correct it work best.');
  }

  // General retrograde advice
  if (retrograde.length >= 2) {
    guidance.push('With multiple retrogrades, you need partners who respect internal processing time.');
  }

  return guidance.join(' ');
}

// ========================================
// INTERACTION PATTERNS
// ========================================

/**
 * Generate interaction patterns between retrogrades and chart features
 */
export function generateInteractionPatterns(
  planets: PlanetState[],
  ascendant?: { sign: string; degree: number },
  sunUranusConjunct?: boolean
): InteractionPattern[] {
  const retrograde = planets.filter(p => p.isRetrograde);
  const patterns: InteractionPattern[] = [];

  // Ascendant interactions
  if (ascendant) {
    for (const p of retrograde) {
      patterns.push(generateAscendantInteraction(p, ascendant));
    }
  }

  // Sun-Uranus conjunction interactions (if applicable)
  if (sunUranusConjunct) {
    for (const p of retrograde) {
      patterns.push(generateSunUranusInteraction(p));
    }
  }

  // Retrograde-retrograde interactions
  if (retrograde.length >= 2) {
    patterns.push(generateCombinedPattern(retrograde));
  }

  return patterns;
}

function generateAscendantInteraction(
  retrograde: PlanetState,
  ascendant: { sign: string; degree: number }
): InteractionPattern {
  const profile = getRetrogradeProfile(retrograde.planet);
  const isLeo = ascendant.sign === 'Leo';
  const isAnaretic = ascendant.degree >= 29;

  let interaction = `${retrograde.planet} Rx × ${ascendant.sign} Rising`;
  let effect: string[] = [];

  if (isLeo) {
    interaction = `${retrograde.planet} Rx × Leo Rising${isAnaretic ? ' (29°)' : ''}`;
    effect = [
      `Internal ${profile.internalization.domain.split(',')[0]} projected through bold Leo expression`,
      `${profile.archetype} energy amplified by dramatic self-presentation`,
      isAnaretic ? 'Anaretic degree intensifies both internal and external expression' : ''
    ].filter(Boolean);
  } else {
    effect = [
      `${profile.archetype} modified by ${ascendant.sign} presentation style`,
      `Internal processing meets ${ascendant.sign} outward persona`
    ];
  }

  return {
    retrograde: retrograde.planet,
    feature: `${ascendant.sign} Rising${isAnaretic ? ' 29°' : ''}`,
    interaction,
    archetype: `${profile.coreStatement} - expressed through ${ascendant.sign} lens`,
    effect
  };
}

function generateSunUranusInteraction(retrograde: PlanetState): InteractionPattern {
  const profile = getRetrogradeProfile(retrograde.planet);

  const effects: Record<Planet, string[]> = {
    Mercury: [
      'Unconventional thinking processed internally',
      'Unique communication style with internal filtering'
    ],
    Venus: [
      'Radical love processed privately',
      'Unconventional attraction with internal value system'
    ],
    Mars: [
      'Revolutionary action with strategic timing',
      'Independence expressed through calculated moves'
    ],
    Jupiter: [
      'Internal belief system fuels independence',
      'Self-generated philosophy supports contrarian instincts'
    ],
    Saturn: [
      'Self-defined rules intensify autonomy',
      'Internal authority reinforces rebellious independence'
    ],
    Uranus: [
      'Double independence - private revolution fueling public disruption',
      'Internally processed innovation expressed uniquely'
    ],
    Neptune: [
      'Private vision fuels unique self-expression',
      'Internal symbolism shapes distinctive identity'
    ],
    Pluto: [
      'Internal transformation powers radical self-expression',
      'Deep processing enables authentic independence'
    ]
  };

  return {
    retrograde: retrograde.planet,
    feature: 'Sun-Uranus Conjunction',
    interaction: `${retrograde.planet} Rx × Sun-Uranus: ${profile.archetype} meets Radical Self-Expression`,
    archetype: `"${profile.coreStatement}" + "I express myself uniquely"`,
    effect: effects[retrograde.planet]
  };
}

function generateCombinedPattern(retrograde: PlanetState[]): InteractionPattern {
  const count = retrograde.length;
  const planets = retrograde.map(p => p.planet);

  // Generate layered architecture
  const layers = retrograde.map((p, i) => {
    const profile = getRetrogradeProfile(p.planet);
    return `Layer ${i + 1}: ${profile.internalization.domain.split(',')[0]} (${p.planet} Rx)`;
  });

  const coreStatements = retrograde.map(p => {
    const profile = getRetrogradeProfile(p.planet);
    return profile.coreStatement;
  });

  return {
    retrograde: planets[0], // Primary (first)
    feature: `${count}-Planet Retrograde System`,
    interaction: `Combined ${planets.join(' + ')} Rx Architecture`,
    archetype: coreStatements.join(' → '),
    effect: [
      ...layers,
      `Unified system: Self-referential ${count}-layer decision architecture`,
      'Each retrograde reinforces internal authority of the others'
    ]
  };
}

// ========================================
// AI SYSTEM PROMPT GENERATOR
// ========================================

/**
 * Generate retrograde section for AI system prompts
 */
export function generateSystemPromptSection(
  planets: PlanetState[],
  ascendant?: { sign: string; degree: number }
): string {
  const retrograde = planets.filter(p => p.isRetrograde);

  if (retrograde.length === 0) {
    return `**Retrograde Pattern:** No retrograde planets - externally oriented decision-making.`;
  }

  const iap = computeInternalAuthorityProfile(planets);
  const sections: string[] = [];

  // Header
  sections.push(`**Retrograde Pattern (Internal Authority System):**`);

  // Per-planet
  for (const p of retrograde) {
    const profile = getRetrogradeProfile(p.planet);
    sections.push(`- ${PLANET_SYMBOLS[p.planet]} ${p.planet} Rx: "${profile.coreStatement}" - ${profile.internalization.internalProcess.toLowerCase()}`);
  }

  // Combined pattern
  if (retrograde.length >= 2) {
    sections.push(`- Combined: Self-referential decision system - ${retrograde.map(p => p.planet.toLowerCase()).join(', ')} all internally processed`);
  }

  // Ascendant interaction
  if (ascendant && retrograde.length > 0) {
    sections.push('');
    sections.push(`**${ascendant.sign} Rising × Retrogrades = Amplification:**`);
    for (const p of retrograde) {
      const profile = getRetrogradeProfile(p.planet);
      sections.push(`- ${p.planet} Rx × ${ascendant.sign} Rising: Internal ${profile.internalization.domain.split(',')[0]} → projected through ${ascendant.sign} expression`);
    }
    if (retrograde.length >= 2) {
      sections.push(`- Result: "I ${retrograde.map(p => getRetrogradeProfile(p.planet).coreStatement.toLowerCase().replace('i ', '')).join(', and I ')}—and I project it through ${ascendant.sign}"`);
    }
  }

  return sections.join('\n');
}

// ========================================
// EXPORT SINGLE PLANET NARRATIVE
// ========================================

/**
 * Get narrative for a single retrograde planet
 */
export function getSinglePlanetNarrative(planet: Planet): SinglePlanetNarrative {
  const profile = getRetrogradeProfile(planet);

  return {
    planet,
    symbol: PLANET_SYMBOLS[planet],
    archetype: profile.archetype,
    coreStatement: profile.coreStatement,
    internalization: profile.internalization,
    decision: profile.decision,
    synastry: profile.synastry,
    behaviors: profile.behaviors,
    strengths: profile.strengths,
    challenges: profile.challenges
  };
}

interface SinglePlanetNarrative {
  planet: Planet;
  symbol: string;
  archetype: string;
  coreStatement: string;
  internalization: {
    domain: string;
    internalProcess: string;
    externalManifest: string;
  };
  decision: {
    style: string;
    tendency: string;
    pitfall: string;
    strength: string;
  };
  synastry: {
    bonding: string;
    friction: string;
    resonance: string;
    projection: string;
  };
  behaviors: string[];
  strengths: string[];
  challenges: string[];
}
