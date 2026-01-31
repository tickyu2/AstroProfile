/**
 * Cusp Narrative Generator
 *
 * Generates rich, human-readable narratives about cusp influences
 * in compatibility analysis. This gives personality and depth to
 * the cusp-aware scoring system.
 *
 * The narratives explain WHY someone on a cusp behaves differently
 * and how that affects their relationships.
 *
 * GENESIS AstroProfile - January 2025
 */

import type { ZodiacSign, Season } from './types';
import type { SignBlend } from './signBlendFromDate';
import { getCuspDisplayInfo, getPrimarySign, isCuspBlend } from './signBlendFromDate';
import { getCuspDescription, getCuspDisplayName, getCuspNameFromSigns } from './seasonalWeight';
import { getElement, getModality, getSeason } from './signMeta';

// =============================================================================
// CUSP PERSONALITY NARRATIVES
// =============================================================================

/**
 * Individual cusp personality descriptions
 * These describe how being on a specific cusp affects personality
 */
const CUSP_PERSONALITIES: Record<string, {
  essence: string;
  gifts: string[];
  challenges: string[];
  relationshipStyle: string;
}> = {
  'Pisces-Aries': {
    essence: 'The Dreamer-Doer who bridges imagination and action',
    gifts: [
      'Visionary initiative — turns dreams into reality',
      'Compassionate leadership — leads with empathy',
      'Creative courage — artistic expression meets boldness',
    ],
    challenges: [
      'May oscillate between withdrawal and aggression',
      'Impatience with own sensitivity',
      'Starting projects before emotional processing',
    ],
    relationshipStyle: 'Brings both tenderness and fire; needs a partner who appreciates their duality.',
  },

  'Aries-Taurus': {
    essence: 'The Energizer-Stabilizer who initiates and sustains',
    gifts: [
      'Determined follow-through — starts AND finishes',
      'Practical passion — enthusiasm grounded in reality',
      'Protective strength — fierce loyalty',
    ],
    challenges: [
      'Stubbornness amplified by impulsiveness',
      'May rush into commitments then resist change',
      'Conflict between need for action and comfort',
    ],
    relationshipStyle: 'Brings intensity and stability; needs a partner who values both passion and peace.',
  },

  'Taurus-Gemini': {
    essence: 'The Sensualist-Communicator who grounds and connects',
    gifts: [
      'Articulate appreciation — expresses beauty in words',
      'Flexible stability — adapts without losing center',
      'Social sensuality — brings warmth to conversations',
    ],
    challenges: [
      'May overthink simple pleasures',
      'Tension between routine and variety',
      'Can be indecisive about commitments',
    ],
    relationshipStyle: 'Brings both depth and lightness; needs a partner who enjoys both cozy nights and adventures.',
  },

  'Gemini-Cancer': {
    essence: 'The Thinker-Feeler who intellectualizes emotion',
    gifts: [
      'Emotional intelligence articulated — names feelings precisely',
      'Nurturing communication — words that heal',
      'Adaptive intuition — reads situations quickly',
    ],
    challenges: [
      'May rationalize rather than feel',
      'Mood swings confused with mental restlessness',
      'Difficulty distinguishing thoughts from emotions',
    ],
    relationshipStyle: 'Brings verbal intimacy; needs a partner who appreciates both heart-to-hearts and light banter.',
  },

  'Cancer-Leo': {
    essence: 'The Nurturer-Performer who protects and shines',
    gifts: [
      'Generous caretaking — gives with dramatic flair',
      'Emotional confidence — owns their feelings',
      'Creative home-making — domestic artistry',
    ],
    challenges: [
      'Needs both privacy and attention',
      'May dramatize emotional needs',
      'Conflict between self-focus and family focus',
    ],
    relationshipStyle: 'Brings warmth and sparkle; needs a partner who gives both security and admiration.',
  },

  'Leo-Virgo': {
    essence: 'The Star-Servant who shines through service',
    gifts: [
      'Humble leadership — leads by example, not ego',
      'Perfectionist creativity — artistic attention to detail',
      'Generous criticism — helps others improve',
    ],
    challenges: [
      'Self-criticism battles need for recognition',
      'May overwork to prove worth',
      'Tension between wanting praise and deflecting it',
    ],
    relationshipStyle: 'Brings devoted excellence; needs a partner who appreciates both their shine and their humility.',
  },

  'Virgo-Libra': {
    essence: 'The Analyst-Harmonizer who perfects relationships',
    gifts: [
      'Refined discernment — sees beauty in details',
      'Diplomatic precision — addresses issues gracefully',
      'Aesthetic practicality — beauty that functions',
    ],
    challenges: [
      'May over-analyze relationships',
      'Criticism hidden behind diplomacy',
      'Indecision amplified by perfectionism',
    ],
    relationshipStyle: 'Brings thoughtful partnership; needs someone who values both honesty and harmony.',
  },

  'Libra-Scorpio': {
    essence: 'The Diplomat-Detective who seeks deep fairness',
    gifts: [
      'Perceptive balance — sees both sides AND the hidden side',
      'Passionate partnership — deep relationship commitment',
      'Strategic charm — influence with integrity',
    ],
    challenges: [
      'May use charm to manipulate',
      'Jealousy conflicts with fairness ideals',
      'Difficulty being direct while staying diplomatic',
    ],
    relationshipStyle: 'Brings intense partnership; needs someone who handles both their charm and their depth.',
  },

  'Scorpio-Sagittarius': {
    essence: 'The Investigator-Explorer who seeks ultimate truth',
    gifts: [
      'Philosophical depth — questions everything meaningfully',
      'Adventurous intensity — explores with passion',
      'Transformative optimism — finds light in darkness',
    ],
    challenges: [
      'May run from emotional intensity',
      'Tendency to preach about personal transformations',
      'Conflict between commitment and freedom',
    ],
    relationshipStyle: 'Brings passionate adventure; needs a partner ready for both deep dives and wild explorations.',
  },

  'Sagittarius-Capricorn': {
    essence: 'The Prophet-Builder who envisions and constructs',
    gifts: [
      'Practical wisdom — philosophy that builds empires',
      'Ambitious faith — believes in their long-term vision',
      'Responsible freedom — structured adventure',
    ],
    challenges: [
      'May preach responsibility while wanting escape',
      'Tension between spontaneity and planning',
      'Can be both recklessly optimistic and pessimistic',
    ],
    relationshipStyle: 'Brings visionary stability; needs a partner who dreams big AND plans practically.',
  },

  'Capricorn-Aquarius': {
    essence: 'The Traditionalist-Revolutionary who reforms from within',
    gifts: [
      'Innovative discipline — revolutionizes structures',
      'Humanitarian ambition — success that serves society',
      'Independent authority — leads uniquely',
    ],
    challenges: [
      'May resist change while demanding it from others',
      'Emotional detachment conflicts with ambition',
      'Difficulty between convention and rebellion',
    ],
    relationshipStyle: 'Brings principled innovation; needs a partner who respects both their goals and their ideals.',
  },

  'Aquarius-Pisces': {
    essence: 'The Visionary-Mystic who dreams for humanity',
    gifts: [
      'Intuitive innovation — technology meets spirituality',
      'Compassionate detachment — cares without drowning',
      'Universal creativity — art that serves all',
    ],
    challenges: [
      'May disconnect from practical reality',
      'Confusion between intuition and logic',
      'Can seem both aloof and overwhelmed',
    ],
    relationshipStyle: 'Brings transcendent connection; needs a partner who honors both their vision and their sensitivity.',
  },
};

// =============================================================================
// NARRATIVE GENERATORS
// =============================================================================

/**
 * Generate a personality narrative for someone on a cusp
 */
export function generateCuspPersonalityNarrative(
  sunBlend: SignBlend[],
  personName: string
): string {
  if (!isCuspBlend(sunBlend)) {
    const sign = sunBlend[0].sign;
    return `${personName} is a pure ${sign}, expressing the sign's qualities in their undiluted form.`;
  }

  const info = getCuspDisplayInfo(sunBlend);
  if (!info.secondary) {
    return `${personName} is a ${info.primary}.`;
  }

  const cuspKey = `${info.secondary}-${info.primary}`;
  const personality = CUSP_PERSONALITIES[cuspKey];

  if (!personality) {
    // Fallback for any missing cusp
    return `${personName} bridges ${info.secondary} and ${info.primary} (${info.secondaryPercent}%/${info.primaryPercent}%), ` +
      `blending the qualities of both signs in their unique expression.`;
  }

  const cuspName = getCuspDisplayName(info.secondary, info.primary);

  return `${personName} is born on the ${cuspName} (${info.secondary} ${info.secondaryPercent}%, ${info.primary} ${info.primaryPercent}%).\n\n` +
    `**Essence**: ${personality.essence}\n\n` +
    `**Relationship Style**: ${personality.relationshipStyle}`;
}

/**
 * Generate a brief cusp gift summary
 */
export function getCuspGiftSummary(sunBlend: SignBlend[]): string[] {
  if (!isCuspBlend(sunBlend)) {
    return [];
  }

  const info = getCuspDisplayInfo(sunBlend);
  if (!info.secondary) return [];

  const cuspKey = `${info.secondary}-${info.primary}`;
  const personality = CUSP_PERSONALITIES[cuspKey];

  return personality?.gifts || [];
}

/**
 * Generate a brief cusp challenge summary
 */
export function getCuspChallengeSummary(sunBlend: SignBlend[]): string[] {
  if (!isCuspBlend(sunBlend)) {
    return [];
  }

  const info = getCuspDisplayInfo(sunBlend);
  if (!info.secondary) return [];

  const cuspKey = `${info.secondary}-${info.primary}`;
  const personality = CUSP_PERSONALITIES[cuspKey];

  return personality?.challenges || [];
}

// =============================================================================
// COMPATIBILITY NARRATIVES
// =============================================================================

/**
 * Generate a narrative about how two people's cusps interact
 */
export function generateCuspCompatibilityNarrative(
  personAName: string,
  personASunBlend: SignBlend[],
  personBName: string,
  personBSunBlend: SignBlend[]
): string {
  const aIsCusp = isCuspBlend(personASunBlend);
  const bIsCusp = isCuspBlend(personBSunBlend);

  // Neither is on a cusp
  if (!aIsCusp && !bIsCusp) {
    return `Both ${personAName} and ${personBName} express their Sun signs in pure form. ` +
      `The compatibility analysis is straightforward, based on the core sign energies.`;
  }

  // Only A is on a cusp
  if (aIsCusp && !bIsCusp) {
    const aInfo = getCuspDisplayInfo(personASunBlend);
    const bSign = personBSunBlend[0].sign;

    return `${personAName}'s cusp nature (${aInfo.primary}↔${aInfo.secondary}) brings flexibility to the relationship. ` +
      `They can relate to ${personBName}'s ${bSign} energy through either aspect of their dual nature, ` +
      `finding the bridge that works best.`;
  }

  // Only B is on a cusp
  if (!aIsCusp && bIsCusp) {
    const aSign = personASunBlend[0].sign;
    const bInfo = getCuspDisplayInfo(personBSunBlend);

    return `${personBName}'s cusp nature (${bInfo.primary}↔${bInfo.secondary}) adds nuance to the connection. ` +
      `${personAName}'s ${aSign} energy may resonate more with one side of ${personBName}'s dual expression, ` +
      `creating an evolving dynamic.`;
  }

  // Both are on cusps
  const aInfo = getCuspDisplayInfo(personASunBlend);
  const bInfo = getCuspDisplayInfo(personBSunBlend);

  return `Both ${personAName} (${aInfo.primary}↔${aInfo.secondary}) and ${personBName} (${bInfo.primary}↔${bInfo.secondary}) ` +
    `are cusp-born, creating a richly layered connection. With four sign energies in play, ` +
    `this relationship has exceptional flexibility — multiple pathways for understanding and ` +
    `multiple dimensions to explore together.`;
}

/**
 * Generate insight about how cusps affect a specific compatibility cell
 */
export function generateCellCuspNarrative(
  cellKey: string,
  aPoint: string,
  aBlend: SignBlend[],
  bPoint: string,
  bBlend: SignBlend[],
  finalScore: number
): string {
  const aIsCusp = isCuspBlend(aBlend);
  const bIsCusp = isCuspBlend(bBlend);

  if (!aIsCusp && !bIsCusp) {
    return `${cellKey}: Pure ${aBlend[0].sign} ${aPoint} meets pure ${bBlend[0].sign} ${bPoint}.`;
  }

  const aDisplay = aIsCusp
    ? `${aBlend[0].sign}↔${aBlend[1].sign}`
    : aBlend[0].sign;

  const bDisplay = bIsCusp
    ? `${bBlend[0].sign}↔${bBlend[1].sign}`
    : bBlend[0].sign;

  const cuspNote = aIsCusp && bIsCusp
    ? 'Both bring cusp flexibility'
    : aIsCusp
      ? `${aPoint} cusp adds adaptability`
      : `${bPoint} cusp adds adaptability`;

  return `${cellKey}: ${aDisplay} ${aPoint} × ${bDisplay} ${bPoint} — ${cuspNote}. Score: ${finalScore}/10`;
}

// =============================================================================
// CUSP TIMING NARRATIVES
// =============================================================================

/**
 * Generate a narrative about someone's position within the cusp window
 */
export function generateCuspTimingNarrative(
  sunBlend: SignBlend[],
  birthDate: Date
): string {
  if (!isCuspBlend(sunBlend)) {
    return `Born in the heart of ${sunBlend[0].sign} season, expressing the sign's full strength.`;
  }

  const info = getCuspDisplayInfo(sunBlend);
  if (!info.secondary) return '';

  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // Determine if near start or end of sign
  const primaryWeight = info.primaryPercent;

  if (primaryWeight >= 85) {
    return `Born just ${100 - primaryWeight}% into the cusp transition, ` +
      `${info.primary} energy is dominant with a subtle ${info.secondary} undertone.`;
  } else if (primaryWeight >= 60) {
    return `Born in the middle of the ${info.secondary}-${info.primary} cusp window, ` +
      `balancing both sign energies (${info.secondaryPercent}%/${primaryWeight}%).`;
  } else {
    return `Born early in the ${info.secondary}-${info.primary} transition, ` +
      `${info.secondary} energy still strongly present (${info.secondaryPercent}%) alongside emerging ${info.primary}.`;
  }
}

// =============================================================================
// ELEMENT BLENDING NARRATIVES
// =============================================================================

/**
 * Describe how cusp blending affects elemental expression
 */
export function generateElementBlendNarrative(sunBlend: SignBlend[]): string {
  if (!isCuspBlend(sunBlend)) {
    const element = getElement(sunBlend[0].sign);
    return `Pure ${element} element expression through ${sunBlend[0].sign}.`;
  }

  const primary = sunBlend[0];
  const secondary = sunBlend[1];

  const primaryElement = getElement(primary.sign);
  const secondaryElement = getElement(secondary.sign);

  if (primaryElement === secondaryElement) {
    // Same element cusp (e.g., Aries-Taurus doesn't happen, but just in case)
    return `Double ${primaryElement} energy: ${secondary.sign} and ${primary.sign} amplify the elemental qualities.`;
  }

  // Different elements
  const elementPairs: Record<string, string> = {
    'Fire-Earth': 'Spirit grounds into matter — visionary energy finds practical expression',
    'Earth-Fire': 'Matter ignites with spirit — practical foundation fuels passionate action',
    'Fire-Air': 'Flames spread on wind — passion communicates and inspires',
    'Air-Fire': 'Ideas catch fire — thoughts become action',
    'Fire-Water': 'Steam and transformation — passion meets depth',
    'Water-Fire': 'Emotions drive action — feeling becomes doing',
    'Earth-Air': 'Concepts take form — ideas manifest physically',
    'Air-Earth': 'Forms seek meaning — material reality seeks understanding',
    'Earth-Water': 'Fertile ground — practical nurturing, emotional stability',
    'Water-Earth': 'Emotions solidify — feelings become commitments',
    'Air-Water': 'Thoughts dissolve into feeling — logic meets intuition',
    'Water-Air': 'Feelings seek expression — emotions find words',
  };

  const pairKey = `${secondaryElement}-${primaryElement}`;
  const description = elementPairs[pairKey] || 'Elemental blending creates unique expression';

  return `${secondary.sign} (${secondaryElement}) transitions to ${primary.sign} (${primaryElement}): ${description}.`;
}

// =============================================================================
// MODALITY BLENDING NARRATIVES
// =============================================================================

/**
 * Describe how cusp blending affects modality expression
 */
export function generateModalityBlendNarrative(sunBlend: SignBlend[]): string {
  if (!isCuspBlend(sunBlend)) {
    const modality = getModality(sunBlend[0].sign);
    return `Pure ${modality} modality: ${getModalityDescription(modality)}`;
  }

  const primary = sunBlend[0];
  const secondary = sunBlend[1];

  const primaryModality = getModality(primary.sign);
  const secondaryModality = getModality(secondary.sign);

  if (primaryModality === secondaryModality) {
    return `Both signs share ${primaryModality} modality — enhanced but single-geared approach.`;
  }

  const modalityPairs: Record<string, string> = {
    'Cardinal-Fixed': 'Initiates then sustains — starts projects and sees them through',
    'Fixed-Cardinal': 'Stability seeks new direction — established patterns embrace fresh starts',
    'Cardinal-Mutable': 'Initiates then adapts — starts with purpose, flows with change',
    'Mutable-Cardinal': 'Flexibility finds focus — adaptable nature gains decisive direction',
    'Fixed-Mutable': 'Stability meets flexibility — holds center while adjusting approach',
    'Mutable-Fixed': 'Adaptability gains staying power — changeable nature finds commitment',
  };

  const pairKey = `${secondaryModality}-${primaryModality}`;
  const description = modalityPairs[pairKey] || 'Modality blending creates unique rhythm';

  return `${secondaryModality} transitions to ${primaryModality}: ${description}.`;
}

function getModalityDescription(modality: string): string {
  switch (modality) {
    case 'Cardinal': return 'Initiating energy that starts new cycles';
    case 'Fixed': return 'Sustaining energy that maintains and deepens';
    case 'Mutable': return 'Adapting energy that transforms and transitions';
    default: return '';
  }
}

// =============================================================================
// FULL CUSP PROFILE NARRATIVE
// =============================================================================

/**
 * Generate a complete cusp profile narrative for UI display
 */
export interface CuspProfileNarrative {
  headline: string;
  personalityEssence: string;
  elementBlend: string;
  modalityBlend: string;
  gifts: string[];
  challenges: string[];
  relationshipStyle: string;
  timing: string;
}

export function generateFullCuspProfileNarrative(
  sunBlend: SignBlend[],
  personName: string,
  birthDate: Date
): CuspProfileNarrative {
  const info = getCuspDisplayInfo(sunBlend);

  if (!isCuspBlend(sunBlend)) {
    return {
      headline: `${personName}: Pure ${info.primary}`,
      personalityEssence: `${personName} expresses ${info.primary} energy in its undiluted form.`,
      elementBlend: generateElementBlendNarrative(sunBlend),
      modalityBlend: generateModalityBlendNarrative(sunBlend),
      gifts: [],
      challenges: [],
      relationshipStyle: `Brings clear ${info.primary} energy to relationships.`,
      timing: generateCuspTimingNarrative(sunBlend, birthDate),
    };
  }

  const cuspKey = info.secondary ? `${info.secondary}-${info.primary}` : '';
  const personality = cuspKey ? CUSP_PERSONALITIES[cuspKey] : undefined;
  const cuspName = info.secondary ? getCuspDisplayName(info.secondary, info.primary) : '';

  return {
    headline: `${personName}: ${cuspName} (${info.secondaryPercent}%/${info.primaryPercent}%)`,
    personalityEssence: personality?.essence || `Bridges ${info.secondary} and ${info.primary}`,
    elementBlend: generateElementBlendNarrative(sunBlend),
    modalityBlend: generateModalityBlendNarrative(sunBlend),
    gifts: personality?.gifts || [],
    challenges: personality?.challenges || [],
    relationshipStyle: personality?.relationshipStyle || `Brings both ${info.secondary} and ${info.primary} qualities to connections.`,
    timing: generateCuspTimingNarrative(sunBlend, birthDate),
  };
}
