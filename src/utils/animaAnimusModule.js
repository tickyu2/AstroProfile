/**
 * animaAnimusModule.js
 * ====================
 *
 * Jungian Anima/Animus Analysis for the Liz Greene Cathedral
 * Part of Phase 3: Relationship Depth Enhancement
 *
 * Based on Jung's theory of the contrasexual archetype:
 * - Anima: The inner feminine in a man's psyche
 * - Animus: The inner masculine in a woman's psyche
 *
 * In astrology (per Liz Greene):
 * - Anima: Moon + Venus (what he projects onto women)
 * - Animus: Sun + Mars (what she projects onto men)
 * - 7th House: The "shadow partner" we attract
 * - Descendant ruler: The type of partner we need for wholeness
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// ANIMA ARCHETYPES (for masculine-identified individuals)
// =============================================================================

export const ANIMA_ARCHETYPES = {
  // Based on Moon sign
  moonArchetypes: {
    Aries: {
      archetype: 'The Amazon Warrior',
      projection: 'He seeks women who are fierce, independent, and unafraid',
      shadow: 'May reject his own emotional spontaneity and anger',
      integration: 'Learning that vulnerability and strength coexist',
      attractionPattern: 'Drawn to women who fight, then feels controlled by their intensity',
      lunaInsight: 'Your inner feminine is a warrior. She does not need rescuing—she needs respect.'
    },
    Taurus: {
      archetype: 'The Earth Mother',
      projection: 'He seeks women who are stable, sensual, and nurturing',
      shadow: 'May deny his own need for comfort and security',
      integration: 'Accepting his own earthiness without shame',
      attractionPattern: 'Drawn to women who ground him, then feels trapped by their stability',
      lunaInsight: 'Your inner feminine craves beauty and touch. She is not weakness—she is wisdom.'
    },
    Gemini: {
      archetype: 'The Eternal Girl',
      projection: 'He seeks women who are witty, curious, and ever-changing',
      shadow: 'May reject his own playfulness and intellectual needs',
      integration: 'Embracing mental connection as emotional nourishment',
      attractionPattern: 'Drawn to mercurial women, then feels they never settle',
      lunaInsight: 'Your inner feminine speaks in riddles. She does not want answers—she wants conversation.'
    },
    Cancer: {
      archetype: 'The Mother',
      projection: 'He seeks women who nurture, protect, and emotionally hold him',
      shadow: 'Deep denial of his own vulnerability and need for care',
      integration: 'Becoming his own source of emotional safety',
      attractionPattern: 'Drawn to maternal women, may infantilize himself or them',
      lunaInsight: 'Your inner feminine is the great mother. She lives in you, not just in those you love.'
    },
    Leo: {
      archetype: 'The Queen',
      projection: 'He seeks women who shine, perform, and command attention',
      shadow: 'May deny his own need for recognition and creative expression',
      integration: 'Owning his own radiance without needing a woman to reflect it',
      attractionPattern: 'Drawn to dramatic women, then competes with or diminishes them',
      lunaInsight: 'Your inner feminine is royalty. She does not need your throne—she has her own.'
    },
    Virgo: {
      archetype: 'The Priestess of Service',
      projection: 'He seeks women who are competent, helpful, and self-improving',
      shadow: 'May reject his own perfectionism and critical nature',
      integration: 'Accepting imperfection as part of wholeness',
      attractionPattern: 'Drawn to women who serve, then criticizes their imperfections',
      lunaInsight: 'Your inner feminine tends the sacred garden. She heals through presence, not perfection.'
    },
    Libra: {
      archetype: 'The Beautiful Other',
      projection: 'He seeks women who are graceful, harmonious, and aesthetically pleasing',
      shadow: 'May deny his own need for relationship and beauty',
      integration: 'Finding inner balance without external reflection',
      attractionPattern: 'Drawn to beautiful partners, may not see beyond the surface',
      lunaInsight: 'Your inner feminine is the mirror. She shows you what you refuse to see in yourself.'
    },
    Scorpio: {
      archetype: 'The Dark Goddess',
      projection: 'He seeks women of depth, intensity, and transformative power',
      shadow: 'Profound denial of his own emotional intensity and darker feelings',
      integration: 'Descending into his own underworld without a guide',
      attractionPattern: 'Drawn to powerful women, experiences love as death and rebirth',
      lunaInsight: 'Your inner feminine walks between worlds. She is not dangerous—she is your ally in the dark.'
    },
    Sagittarius: {
      archetype: 'The Wild Woman',
      projection: 'He seeks women who are free, adventurous, and truth-seeking',
      shadow: 'May reject his own need for meaning and expansion',
      integration: 'Following his own quest without needing a muse',
      attractionPattern: 'Drawn to free spirits, then tries to cage or follow them',
      lunaInsight: 'Your inner feminine runs with horses. She cannot be caught—only joined.'
    },
    Capricorn: {
      archetype: 'The Wise Elder',
      projection: 'He seeks women who are ambitious, accomplished, and mature',
      shadow: 'May deny his own need for structure and worldly achievement',
      integration: 'Building his own mountain without needing her at the summit',
      attractionPattern: 'Drawn to powerful women, may feel inadequate or competitive',
      lunaInsight: 'Your inner feminine is ancient. She knows things you are only beginning to learn.'
    },
    Aquarius: {
      archetype: 'The Revolutionary',
      projection: 'He seeks women who are unique, progressive, and independent',
      shadow: 'May reject his own unconventional emotional needs',
      integration: 'Accepting that his heart follows different rules',
      attractionPattern: 'Drawn to unusual women, keeps emotional distance',
      lunaInsight: 'Your inner feminine is from the future. She does not fit—and neither do you.'
    },
    Pisces: {
      archetype: 'The Divine Beloved',
      projection: 'He seeks women who are mystical, sacrificing, and transcendent',
      shadow: 'May deny his own spiritual sensitivity and need to merge',
      integration: 'Finding the divine feminine within, not only in her',
      attractionPattern: 'Idealizes women, then disappointed when they are human',
      lunaInsight: 'Your inner feminine dissolves boundaries. She is not weakness—she is infinity.'
    }
  },

  // Venus modifies the anima expression
  venusModifiers: {
    Aries: { style: 'conquest', need: 'challenge', shadow: 'may treat women as prizes' },
    Taurus: { style: 'devotion', need: 'sensuality', shadow: 'possessiveness' },
    Gemini: { style: 'variety', need: 'mental stimulation', shadow: 'superficiality' },
    Cancer: { style: 'nurturing', need: 'emotional safety', shadow: 'smothering' },
    Leo: { style: 'adoration', need: 'to be special', shadow: 'vanity' },
    Virgo: { style: 'service', need: 'perfection', shadow: 'criticism' },
    Libra: { style: 'partnership', need: 'harmony', shadow: 'codependency' },
    Scorpio: { style: 'intensity', need: 'depth', shadow: 'obsession' },
    Sagittarius: { style: 'adventure', need: 'freedom', shadow: 'restlessness' },
    Capricorn: { style: 'commitment', need: 'status', shadow: 'coldness' },
    Aquarius: { style: 'friendship', need: 'space', shadow: 'detachment' },
    Pisces: { style: 'romance', need: 'transcendence', shadow: 'delusion' }
  }
};

// =============================================================================
// ANIMUS ARCHETYPES (for feminine-identified individuals)
// =============================================================================

export const ANIMUS_ARCHETYPES = {
  // Based on Sun sign
  sunArchetypes: {
    Aries: {
      archetype: 'The Warrior Hero',
      projection: 'She seeks men who are bold, pioneering, and unafraid',
      shadow: 'May deny her own assertiveness and capacity for action',
      integration: 'Becoming her own hero, initiating her own battles',
      attractionPattern: 'Drawn to fighters, may enable aggression or compete',
      lunaInsight: 'Your inner masculine is a blade. You do not need him to cut—you already can.'
    },
    Taurus: {
      archetype: 'The Provider',
      projection: 'She seeks men who are stable, reliable, and materially secure',
      shadow: 'May deny her own capacity to build and sustain',
      integration: 'Creating her own security without a provider',
      attractionPattern: 'Drawn to solid men, may feel trapped by their immobility',
      lunaInsight: 'Your inner masculine builds slowly and permanently. Trust your own foundation.'
    },
    Gemini: {
      archetype: 'The Trickster',
      projection: 'She seeks men who are clever, communicative, and versatile',
      shadow: 'May deny her own intellectual brilliance and wit',
      integration: 'Speaking her own truth without needing his words',
      attractionPattern: 'Drawn to charming men, may be deceived by smooth talk',
      lunaInsight: 'Your inner masculine is quicksilver. He lives in your own thoughts and words.'
    },
    Cancer: {
      archetype: 'The Protector',
      projection: 'She seeks men who are sensitive, family-oriented, and emotionally present',
      shadow: 'May deny her own protective power and emotional leadership',
      integration: 'Becoming the shelter she seeks',
      attractionPattern: 'Drawn to nurturing men, may mother them',
      lunaInsight: 'Your inner masculine holds the home. He is your own capacity to create safety.'
    },
    Leo: {
      archetype: 'The King',
      projection: 'She seeks men who are powerful, creative, and commanding',
      shadow: 'May deny her own authority and right to rule',
      integration: 'Claiming her own throne and creative power',
      attractionPattern: 'Drawn to charismatic men, may give away her power',
      lunaInsight: 'Your inner masculine wears a crown. It was always meant for your own head.'
    },
    Virgo: {
      archetype: 'The Craftsman',
      projection: 'She seeks men who are skilled, practical, and self-improving',
      shadow: 'May deny her own competence and analytical power',
      integration: 'Mastering her own craft without his validation',
      attractionPattern: 'Drawn to capable men, may feel never good enough',
      lunaInsight: 'Your inner masculine perfects through patience. Your work is already worthy.'
    },
    Libra: {
      archetype: 'The Partner',
      projection: 'She seeks men who are balanced, diplomatic, and aesthetically refined',
      shadow: 'May deny her own judgment and decision-making capacity',
      integration: 'Making her own choices without external balance',
      attractionPattern: 'Drawn to charming men, may lose herself in relationship',
      lunaInsight: 'Your inner masculine is the scales. You can weigh your own truth.'
    },
    Scorpio: {
      archetype: 'The Transformer',
      projection: 'She seeks men of power, depth, and regenerative capacity',
      shadow: 'May deny her own intensity and transformative force',
      integration: 'Wielding her own power without needing his darkness',
      attractionPattern: 'Drawn to powerful men, power struggles ensue',
      lunaInsight: 'Your inner masculine descends to rise. His phoenix is already in your chest.'
    },
    Sagittarius: {
      archetype: 'The Sage',
      projection: 'She seeks men who are wise, adventurous, and truth-speaking',
      shadow: 'May deny her own wisdom and right to seek truth',
      integration: 'Becoming her own philosopher and explorer',
      attractionPattern: 'Drawn to gurus, may give away her own wisdom',
      lunaInsight: 'Your inner masculine carries the torch. Follow your own light.'
    },
    Capricorn: {
      archetype: 'The Father',
      projection: 'She seeks men who are authoritative, successful, and responsible',
      shadow: 'May deny her own ambition and capacity for worldly achievement',
      integration: 'Becoming her own authority figure',
      attractionPattern: 'Drawn to older/powerful men, may replay father dynamics',
      lunaInsight: 'Your inner masculine climbs mountains. The summit is already yours.'
    },
    Aquarius: {
      archetype: 'The Visionary',
      projection: 'She seeks men who are unique, progressive, and intellectually brilliant',
      shadow: 'May deny her own originality and capacity for revolution',
      integration: 'Becoming her own agent of change',
      attractionPattern: 'Drawn to rebels, may idealize detachment',
      lunaInsight: 'Your inner masculine sees tomorrow. Trust your own vision.'
    },
    Pisces: {
      archetype: 'The Mystic',
      projection: 'She seeks men who are spiritual, artistic, and transcendent',
      shadow: 'May deny her own connection to the divine and creative power',
      integration: 'Becoming her own channel to the infinite',
      attractionPattern: 'Drawn to suffering artists, may try to save them',
      lunaInsight: 'Your inner masculine dissolves into everything. You are already infinite.'
    }
  },

  // Mars modifies the animus expression
  marsModifiers: {
    Aries: { style: 'direct action', need: 'independence', shadow: 'aggression' },
    Taurus: { style: 'persistent effort', need: 'results', shadow: 'stubbornness' },
    Gemini: { style: 'mental strategy', need: 'variety', shadow: 'scattered energy' },
    Cancer: { style: 'protective action', need: 'emotional motivation', shadow: 'passive aggression' },
    Leo: { style: 'dramatic gesture', need: 'recognition', shadow: 'ego battles' },
    Virgo: { style: 'precise execution', need: 'improvement', shadow: 'criticism as weapon' },
    Libra: { style: 'strategic harmony', need: 'fairness', shadow: 'indecision' },
    Scorpio: { style: 'intense focus', need: 'transformation', shadow: 'manipulation' },
    Sagittarius: { style: 'expansive pursuit', need: 'meaning', shadow: 'overreach' },
    Capricorn: { style: 'disciplined effort', need: 'achievement', shadow: 'ruthlessness' },
    Aquarius: { style: 'revolutionary action', need: 'freedom', shadow: 'detachment' },
    Pisces: { style: 'inspired action', need: 'transcendence', shadow: 'escapism' }
  }
};

// =============================================================================
// 7TH HOUSE - THE SHADOW PARTNER
// =============================================================================

export const DESCENDANT_ANALYSIS = {
  Aries: {
    seeks: 'Someone who acts, initiates, and fights for what they want',
    shadow: 'Denies own assertiveness, attracts those who take charge',
    lesson: 'Learning to fight your own battles instead of outsourcing courage',
    compatibility: 'Needs partner who respects independence while providing spark',
    lunaGuidance: 'You seek the warrior in others because you have buried your own sword.'
  },
  Taurus: {
    seeks: 'Someone stable, sensual, and materially grounded',
    shadow: 'Denies own need for security, attracts possessive partners',
    lesson: 'Building your own stability instead of depending on another',
    compatibility: 'Needs partner who values consistency without stagnation',
    lunaGuidance: 'You seek the builder in others because you doubt your own foundation.'
  },
  Gemini: {
    seeks: 'Someone communicative, curious, and mentally stimulating',
    shadow: 'Denies own intellect, attracts scattered or superficial partners',
    lesson: 'Trusting your own thoughts and voice',
    compatibility: 'Needs partner who engages mind without constant change',
    lunaGuidance: 'You seek the communicator in others because you silence your own voice.'
  },
  Cancer: {
    seeks: 'Someone nurturing, emotionally present, and family-oriented',
    shadow: 'Denies own emotional needs, attracts dependent partners',
    lesson: 'Mothering yourself before seeking it in others',
    compatibility: 'Needs partner who provides warmth without smothering',
    lunaGuidance: 'You seek the mother in others because you abandoned the child within.'
  },
  Leo: {
    seeks: 'Someone dramatic, creative, and commanding attention',
    shadow: 'Denies own need for recognition, attracts narcissistic partners',
    lesson: 'Claiming your own stage instead of being audience to another',
    compatibility: 'Needs partner who shines without dimming your light',
    lunaGuidance: 'You seek the star in others because you forgot you are the sun.'
  },
  Virgo: {
    seeks: 'Someone competent, helpful, and dedicated to improvement',
    shadow: 'Denies own perfectionism, attracts critical partners',
    lesson: 'Accepting imperfection as wholeness',
    compatibility: 'Needs partner who serves without servitude',
    lunaGuidance: 'You seek the healer in others because you doubt your own medicine.'
  },
  Libra: {
    seeks: 'Someone balanced, diplomatic, and aesthetically refined',
    shadow: 'Denies own judgment, attracts indecisive or shallow partners',
    lesson: 'Making your own decisions without external validation',
    compatibility: 'Needs partner who harmonizes without losing self',
    lunaGuidance: 'You seek the partner in others because you abandoned partnership with yourself.'
  },
  Scorpio: {
    seeks: 'Someone intense, powerful, and psychologically deep',
    shadow: 'Denies own power, attracts controlling or obsessive partners',
    lesson: 'Owning your own darkness without needing it reflected',
    compatibility: 'Needs partner who goes deep without drowning',
    lunaGuidance: 'You seek the transformer in others because you fear your own power to change.'
  },
  Sagittarius: {
    seeks: 'Someone adventurous, philosophical, and freedom-loving',
    shadow: 'Denies own need for meaning, attracts commitment-phobic partners',
    lesson: 'Following your own truth without needing a guide',
    compatibility: 'Needs partner who explores without escaping',
    lunaGuidance: 'You seek the sage in others because you silence your own wisdom.'
  },
  Capricorn: {
    seeks: 'Someone ambitious, responsible, and worldly successful',
    shadow: 'Denies own ambition, attracts cold or controlling partners',
    lesson: 'Building your own legacy without needing someone else\'s structure',
    compatibility: 'Needs partner who achieves without workaholism',
    lunaGuidance: 'You seek the father in others because you abandoned your own authority.'
  },
  Aquarius: {
    seeks: 'Someone unique, progressive, and intellectually independent',
    shadow: 'Denies own uniqueness, attracts detached or eccentric partners',
    lesson: 'Being your own revolutionary without needing external rebellion',
    compatibility: 'Needs partner who innovates without alienating',
    lunaGuidance: 'You seek the visionary in others because you doubt your own future.'
  },
  Pisces: {
    seeks: 'Someone spiritual, artistic, and emotionally transcendent',
    shadow: 'Denies own spirituality, attracts victims or escapists',
    lesson: 'Finding the divine within instead of in a partner',
    compatibility: 'Needs partner who dreams without drowning',
    lunaGuidance: 'You seek the mystic in others because you forgot you are infinite.'
  }
};

// =============================================================================
// PROJECTION TRIGGERS (Aspects that activate projection)
// =============================================================================

export const PROJECTION_TRIGGERS = {
  // Hard aspects to anima/animus significators
  sunSquareMoon: {
    name: 'Inner Gender War',
    description: 'The masculine and feminine within are at odds',
    projection: 'May externalize this conflict in relationships',
    pattern: 'Attracts partners who embody the denied side',
    integration: 'Recognizing both warrior and nurturer live within',
    lunaInsight: 'Your inner man and woman are fighting. They need a mediator, not a referee.'
  },
  moonSquareVenus: {
    name: 'The Unlovable Feeling',
    description: 'Emotional needs conflict with love expression',
    projection: 'May seek partners who cannot give what is truly needed',
    pattern: 'Attracts unavailable or mismatched partners',
    integration: 'Learning that need and love can coexist',
    lunaInsight: 'What you need and what you think you deserve are at war.'
  },
  sunSquareMars: {
    name: 'The Inhibited Warrior',
    description: 'Will and action are at cross-purposes',
    projection: 'May attract aggressive or passive-aggressive partners',
    pattern: 'Either dominates or is dominated in relationships',
    integration: 'Aligning intention with action without violence',
    lunaInsight: 'Your inner king cannot command his own army.'
  },
  venusSquareMars: {
    name: 'Desire vs. Love',
    description: 'What you want conflicts with how you love',
    projection: 'May separate love and sex into different partners',
    pattern: 'The madonna/whore or nice guy/bad boy split',
    integration: 'Unifying passion and tenderness',
    lunaInsight: 'You have split your heart from your body. They belong together.'
  },
  moonOppositionSaturn: {
    name: 'The Withheld Mother',
    description: 'Emotional needs met with coldness or criticism',
    projection: 'May attract partners who cannot nurture',
    pattern: 'Repeats early emotional deprivation',
    integration: 'Becoming the nurturing parent you needed',
    lunaInsight: 'You learned love was conditional. It is time to unlearn.'
  },
  sunOppositionSaturn: {
    name: 'The Absent Father',
    description: 'Identity and authority are in conflict',
    projection: 'May attract authoritarian or absent partners',
    pattern: 'Repeats paternal dynamics in relationships',
    integration: 'Becoming your own authority',
    lunaInsight: 'The father you needed did not arrive. You must become him.'
  },
  venusSquarePluto: {
    name: 'Obsessive Love',
    description: 'Love and power are entangled',
    projection: 'May attract intense, controlling partners',
    pattern: 'Love as battlefield, possession, or death',
    integration: 'Loving without needing to own or be owned',
    lunaInsight: 'You confuse intensity with intimacy. They are not the same.'
  },
  marsSquarePluto: {
    name: 'Power Battles',
    description: 'Action triggers survival instincts',
    projection: 'May attract powerful enemies or abusive partners',
    pattern: 'Relationships become power struggles',
    integration: 'Transforming aggression into empowerment',
    lunaInsight: 'Every battle echoes your first fight for survival.'
  },
  venusNeptune: {
    name: 'The Impossible Beloved',
    description: 'Love is idealized beyond reality',
    projection: 'May fall for unavailable, addicted, or illusory partners',
    pattern: 'Perpetual disappointment when partners are human',
    integration: 'Finding the sacred in the real',
    lunaInsight: 'You love a dream. Can you love a person?'
  },
  marsNeptune: {
    name: 'The Invisible Warrior',
    description: 'Action dissolves or misdirects',
    projection: 'May attract weak, deceptive, or spiritual-bypass partners',
    pattern: 'Passive-aggressive dynamics or savior complexes',
    integration: 'Acting from inspiration rather than escape',
    lunaInsight: 'Your sword is made of water. Learn to wield the current.'
  }
};

// =============================================================================
// MAIN ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Determine if chart belongs to masculine or feminine-identified individual
 * (This is a simplification - in reality, users should specify)
 */
function getGenderExpression(chartData) {
  // Default to checking if explicitly provided
  if (chartData.genderExpression) {
    return chartData.genderExpression;
  }
  // Otherwise return null to indicate both should be analyzed
  return null;
}

/**
 * Build complete anima analysis
 */
export function buildAnimaProfile(chartData) {
  const moonSign = chartData.moon?.sign || chartData.planets?.Moon?.sign;
  const venusSign = chartData.venus?.sign || chartData.planets?.Venus?.sign;
  const descendant = chartData.descendant?.sign || chartData.houses?.[7]?.sign;

  if (!moonSign) {
    return { error: 'Moon sign required for anima analysis' };
  }

  const moonArchetype = ANIMA_ARCHETYPES.moonArchetypes[moonSign];
  const venusModifier = venusSign ? ANIMA_ARCHETYPES.venusModifiers[venusSign] : null;
  const shadowPartner = descendant ? DESCENDANT_ANALYSIS[descendant] : null;

  return {
    type: 'anima',
    core: {
      moonSign,
      archetype: moonArchetype?.archetype,
      projection: moonArchetype?.projection,
      shadow: moonArchetype?.shadow,
      integration: moonArchetype?.integration,
      attractionPattern: moonArchetype?.attractionPattern,
      lunaInsight: moonArchetype?.lunaInsight
    },
    venusInfluence: venusModifier ? {
      sign: venusSign,
      style: venusModifier.style,
      need: venusModifier.need,
      shadow: venusModifier.shadow
    } : null,
    shadowPartner: shadowPartner ? {
      descendantSign: descendant,
      seeks: shadowPartner.seeks,
      lesson: shadowPartner.lesson,
      lunaGuidance: shadowPartner.lunaGuidance
    } : null,
    synthesis: generateAnimaSynthesis(moonArchetype, venusModifier, shadowPartner)
  };
}

/**
 * Build complete animus analysis
 */
export function buildAnimusProfile(chartData) {
  const sunSign = chartData.sun?.sign || chartData.planets?.Sun?.sign;
  const marsSign = chartData.mars?.sign || chartData.planets?.Mars?.sign;
  const descendant = chartData.descendant?.sign || chartData.houses?.[7]?.sign;

  if (!sunSign) {
    return { error: 'Sun sign required for animus analysis' };
  }

  const sunArchetype = ANIMUS_ARCHETYPES.sunArchetypes[sunSign];
  const marsModifier = marsSign ? ANIMUS_ARCHETYPES.marsModifiers[marsSign] : null;
  const shadowPartner = descendant ? DESCENDANT_ANALYSIS[descendant] : null;

  return {
    type: 'animus',
    core: {
      sunSign,
      archetype: sunArchetype?.archetype,
      projection: sunArchetype?.projection,
      shadow: sunArchetype?.shadow,
      integration: sunArchetype?.integration,
      attractionPattern: sunArchetype?.attractionPattern,
      lunaInsight: sunArchetype?.lunaInsight
    },
    marsInfluence: marsModifier ? {
      sign: marsSign,
      style: marsModifier.style,
      need: marsModifier.need,
      shadow: marsModifier.shadow
    } : null,
    shadowPartner: shadowPartner ? {
      descendantSign: descendant,
      seeks: shadowPartner.seeks,
      lesson: shadowPartner.lesson,
      lunaGuidance: shadowPartner.lunaGuidance
    } : null,
    synthesis: generateAnimusSynthesis(sunArchetype, marsModifier, shadowPartner)
  };
}

/**
 * Generate synthesis for anima
 */
function generateAnimaSynthesis(moon, venus, shadow) {
  if (!moon) return null;

  let synthesis = `Your inner feminine takes the form of ${moon.archetype}. `;
  synthesis += moon.projection + ' ';

  if (venus) {
    synthesis += `This is expressed through a ${venus.style} approach to love, `;
    synthesis += `seeking ${venus.need}. `;
  }

  if (shadow) {
    synthesis += `In relationships, you unconsciously seek ${shadow.seeks.toLowerCase()}. `;
    synthesis += `The lesson: ${shadow.lesson}. `;
  }

  synthesis += `\n\nIntegration path: ${moon.integration}`;

  return synthesis;
}

/**
 * Generate synthesis for animus
 */
function generateAnimusSynthesis(sun, mars, shadow) {
  if (!sun) return null;

  let synthesis = `Your inner masculine takes the form of ${sun.archetype}. `;
  synthesis += sun.projection + ' ';

  if (mars) {
    synthesis += `This manifests through ${mars.style}, `;
    synthesis += `driven by a need for ${mars.need}. `;
  }

  if (shadow) {
    synthesis += `In relationships, you unconsciously seek ${shadow.seeks.toLowerCase()}. `;
    synthesis += `The lesson: ${shadow.lesson}. `;
  }

  synthesis += `\n\nIntegration path: ${sun.integration}`;

  return synthesis;
}

/**
 * Detect active projection triggers from aspects
 */
export function detectProjectionTriggers(aspects) {
  if (!aspects || !Array.isArray(aspects)) {
    return [];
  }

  const triggers = [];

  aspects.forEach(aspect => {
    const bodies = [aspect.planet1, aspect.planet2].sort().join('-');
    const aspectType = aspect.aspectType || aspect.type;

    // Check for specific trigger patterns
    if (bodies === 'Moon-Sun' && ['square', 'opposition'].includes(aspectType)) {
      triggers.push({
        ...PROJECTION_TRIGGERS.sunSquareMoon,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Moon-Venus' && ['square', 'opposition'].includes(aspectType)) {
      triggers.push({
        ...PROJECTION_TRIGGERS.moonSquareVenus,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Mars-Sun' && ['square', 'opposition'].includes(aspectType)) {
      triggers.push({
        ...PROJECTION_TRIGGERS.sunSquareMars,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Mars-Venus' && ['square', 'opposition'].includes(aspectType)) {
      triggers.push({
        ...PROJECTION_TRIGGERS.venusSquareMars,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Moon-Saturn' && ['opposition', 'square', 'conjunction'].includes(aspectType)) {
      triggers.push({
        ...PROJECTION_TRIGGERS.moonOppositionSaturn,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Saturn-Sun' && ['opposition', 'square', 'conjunction'].includes(aspectType)) {
      triggers.push({
        ...PROJECTION_TRIGGERS.sunOppositionSaturn,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Pluto-Venus' && ['square', 'opposition', 'conjunction'].includes(aspectType)) {
      triggers.push({
        ...PROJECTION_TRIGGERS.venusSquarePluto,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Mars-Pluto' && ['square', 'opposition', 'conjunction'].includes(aspectType)) {
      triggers.push({
        ...PROJECTION_TRIGGERS.marsSquarePluto,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Neptune-Venus') {
      triggers.push({
        ...PROJECTION_TRIGGERS.venusNeptune,
        aspect: aspectType,
        orb: aspect.orb
      });
    }

    if (bodies === 'Mars-Neptune') {
      triggers.push({
        ...PROJECTION_TRIGGERS.marsNeptune,
        aspect: aspectType,
        orb: aspect.orb
      });
    }
  });

  return triggers;
}

/**
 * Build complete shadow partner analysis
 */
export function buildShadowPartnerAnalysis(chartData) {
  const genderExpression = getGenderExpression(chartData);

  const analysis = {
    generated: new Date().toISOString(),
    genderExpression: genderExpression || 'universal'
  };

  // Build both profiles if gender not specified
  if (!genderExpression || genderExpression === 'masculine') {
    analysis.anima = buildAnimaProfile(chartData);
  }

  if (!genderExpression || genderExpression === 'feminine') {
    analysis.animus = buildAnimusProfile(chartData);
  }

  // Detect projection triggers from aspects
  const aspects = chartData.aspects || [];
  analysis.projectionTriggers = detectProjectionTriggers(aspects);

  // Generate Luna guidance
  analysis.lunaGuidance = generateLunaGuidance(analysis);

  return analysis;
}

/**
 * Generate Luna's integrated guidance
 */
function generateLunaGuidance(analysis) {
  const guidance = {
    opening: "The partner you seek is always, in some way, yourself in disguise.",
    sections: []
  };

  if (analysis.anima?.core?.lunaInsight) {
    guidance.sections.push({
      title: 'Your Inner Feminine',
      insight: analysis.anima.core.lunaInsight
    });
  }

  if (analysis.animus?.core?.lunaInsight) {
    guidance.sections.push({
      title: 'Your Inner Masculine',
      insight: analysis.animus.core.lunaInsight
    });
  }

  if (analysis.projectionTriggers?.length > 0) {
    const triggerInsights = analysis.projectionTriggers
      .slice(0, 3)
      .map(t => t.lunaInsight);

    guidance.sections.push({
      title: 'Projection Patterns',
      insights: triggerInsights
    });
  }

  // Shadow partner integration
  const shadowInsight = analysis.anima?.shadowPartner?.lunaGuidance ||
    analysis.animus?.shadowPartner?.lunaGuidance;

  if (shadowInsight) {
    guidance.sections.push({
      title: 'The Shadow Partner',
      insight: shadowInsight
    });
  }

  guidance.closing = "Every attraction is an invitation to wholeness. What you seek in another already lives within you.";

  return guidance;
}

/**
 * Analyze partner compatibility from anima/animus perspective
 */
export function analyzeAnimaAnimusCompatibility(chart1, chart2) {
  const analysis1 = buildShadowPartnerAnalysis(chart1);
  const analysis2 = buildShadowPartnerAnalysis(chart2);

  const compatibility = {
    generated: new Date().toISOString(),
    person1: analysis1,
    person2: analysis2,
    dynamics: []
  };

  // Check if person1's anima matches person2's expression
  if (analysis1.anima && chart2.sun) {
    const animaSeeks = analysis1.anima.core?.moonSign;
    const partnerSun = chart2.sun?.sign || chart2.planets?.Sun?.sign;

    if (animaSeeks && partnerSun) {
      compatibility.dynamics.push({
        type: 'anima-projection',
        description: `Person 1's inner feminine (${analysis1.anima.core.archetype}) meets Person 2's solar expression (${partnerSun})`,
        insight: animaSeeks === partnerSun
          ? 'Strong anima projection - Person 1 may idealize Person 2'
          : 'Moderate projection - room for growth beyond projection'
      });
    }
  }

  // Check if person2's animus matches person1's expression
  if (analysis2.animus && chart1.sun) {
    const animusSeeks = analysis2.animus.core?.sunSign;
    const partnerSun = chart1.sun?.sign || chart1.planets?.Sun?.sign;

    if (animusSeeks && partnerSun) {
      compatibility.dynamics.push({
        type: 'animus-projection',
        description: `Person 2's inner masculine (${analysis2.animus.core.archetype}) meets Person 1's solar expression (${partnerSun})`,
        insight: animusSeeks === partnerSun
          ? 'Strong animus projection - Person 2 may idealize Person 1'
          : 'Moderate projection - room for growth beyond projection'
      });
    }
  }

  // Luna's compatibility guidance
  compatibility.lunaGuidance = {
    opening: "You did not find each other by accident. You are each other's unfinished business.",
    insight: "The projections that brought you together will eventually demand to be reclaimed. This is not failure—it is the hidden purpose of love.",
    question: "What part of yourself did you find in this person? And can you love them when you finally see they are not that part?"
  };

  return compatibility;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  buildAnimaProfile,
  buildAnimusProfile,
  buildShadowPartnerAnalysis,
  detectProjectionTriggers,
  analyzeAnimaAnimusCompatibility,
  ANIMA_ARCHETYPES,
  ANIMUS_ARCHETYPES,
  DESCENDANT_ANALYSIS,
  PROJECTION_TRIGGERS
};
