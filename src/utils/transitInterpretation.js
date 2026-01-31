/**
 * transitInterpretation.js
 * ========================
 *
 * Liz Greene-style psychological interpretations for planetary transits.
 * Part of the Liz Greene Cathedral - Phase 1: Living System
 *
 * Features:
 * - Transit meanings by planet combination
 * - Aspect-specific interpretations
 * - Shadow/Light expressions
 * - Integration guidance
 * - Luna dialogue prompts
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// TRANSIT PLANET THEMES (What the transiting planet brings)
// =============================================================================

export const TRANSIT_PLANET_THEMES = {
  Sun: {
    archetype: 'The Illuminator',
    duration: '1-2 days',
    theme: 'Consciousness, vitality, identity activation',
    bringsForth: 'Awareness, energy, focus on self-expression',
    shadow: 'Ego inflation, burnout, excessive self-focus',
    greeneInsight: 'The transiting Sun lights up whatever it touches, bringing conscious attention to dormant areas of the psyche.'
  },

  Moon: {
    archetype: 'The Emotional Tide',
    duration: 'Hours to 1 day',
    theme: 'Emotional fluctuations, instinctual responses',
    bringsForth: 'Feelings, memories, nurturing needs',
    shadow: 'Moodiness, emotional reactivity, regression',
    greeneInsight: 'Lunar transits reveal our emotional truth—what we actually feel beneath our conscious intentions.'
  },

  Mercury: {
    archetype: 'The Messenger',
    duration: '1-3 days (3 weeks retrograde)',
    theme: 'Communication, thinking patterns, connections',
    bringsForth: 'New ideas, conversations, mental clarity or confusion',
    shadow: 'Overthinking, miscommunication, mental anxiety',
    greeneInsight: 'Mercury transits activate the mind—for better or worse. The Trickster can enlighten or deceive.'
  },

  Venus: {
    archetype: 'The Lover',
    duration: '2-4 days (6 weeks retrograde)',
    theme: 'Values, relationships, pleasure, beauty',
    bringsForth: 'Attraction, appreciation, desire for harmony',
    shadow: 'Indulgence, superficiality, people-pleasing',
    greeneInsight: 'Venus transits awaken Aphrodite—the longing for beauty, love, and that which we truly value.'
  },

  Mars: {
    archetype: 'The Warrior',
    duration: '2-4 days (10 weeks retrograde)',
    theme: 'Action, assertion, desire, conflict',
    bringsForth: 'Energy, courage, drive, anger',
    shadow: 'Aggression, impulsiveness, destructive rage',
    greeneInsight: 'Mars transits mobilize the will. The question is whether we act consciously or react blindly.'
  },

  Jupiter: {
    archetype: 'The Sage',
    duration: '1-2 weeks (4 months retrograde)',
    theme: 'Expansion, opportunity, meaning, faith',
    bringsForth: 'Growth, optimism, philosophical insight',
    shadow: 'Over-expansion, grandiosity, excess',
    greeneInsight: 'Jupiter promises expansion, but wisdom lies in knowing what truly deserves to grow.'
  },

  Saturn: {
    archetype: 'The Teacher',
    duration: '2-3 weeks (4.5 months retrograde)',
    theme: 'Structure, limitation, responsibility, maturation',
    bringsForth: 'Reality checks, discipline, earned authority',
    shadow: 'Depression, rigidity, fear, self-criticism',
    greeneInsight: 'Saturn transits are initiations. What we resist, we cannot master. What we face, becomes our foundation.'
  },

  Uranus: {
    archetype: 'The Awakener',
    duration: '1-2 months (5 months retrograde)',
    theme: 'Liberation, disruption, individuation, revolution',
    bringsForth: 'Sudden change, breakthrough, authenticity',
    shadow: 'Chaos, instability, rebellion without purpose',
    greeneInsight: 'Uranus shatters what has become a prison. The liberation can feel like destruction—until we see what was freed.'
  },

  Neptune: {
    archetype: 'The Mystic',
    duration: '1-2 months (5 months retrograde)',
    theme: 'Dissolution, imagination, spirituality, illusion',
    bringsForth: 'Inspiration, compassion, transcendence',
    shadow: 'Confusion, escapism, deception, victim consciousness',
    greeneInsight: 'Neptune dissolves boundaries between self and other, real and imagined. Discernment is essential.'
  },

  Pluto: {
    archetype: 'The Transformer',
    duration: '1-3 months (5 months retrograde)',
    theme: 'Death/rebirth, power, compulsion, transformation',
    bringsForth: 'Profound change, empowerment, truth',
    shadow: 'Obsession, manipulation, destructiveness',
    greeneInsight: 'Pluto transits are descents to the underworld. We must die to who we were to become who we are meant to be.'
  },

  Chiron: {
    archetype: 'The Wounded Healer',
    duration: '2-4 weeks (5 months retrograde)',
    theme: 'Wounding, healing, teaching through pain',
    bringsForth: 'Healing crisis, compassion, wisdom from suffering',
    shadow: 'Re-wounding, victim identity, endless processing',
    greeneInsight: 'Chiron transits reopen old wounds—not to torment, but to finally heal what we once only survived.'
  }
};

// =============================================================================
// NATAL PLANET MEANINGS (What gets activated)
// =============================================================================

export const NATAL_PLANET_THEMES = {
  Sun: {
    represents: 'Core identity, conscious self, life purpose',
    whenActivated: 'Questions of identity, vitality, creative expression',
    sensitive: 'Father issues, authority, recognition needs'
  },

  Moon: {
    represents: 'Emotional nature, instincts, inner child, mother',
    whenActivated: 'Emotional security, nurturing needs, family patterns',
    sensitive: 'Mother issues, dependency, belonging'
  },

  Mercury: {
    represents: 'Mind, communication style, learning, siblings',
    whenActivated: 'Thinking patterns, communication, decisions',
    sensitive: 'Intellectual adequacy, being heard, sibling dynamics'
  },

  Venus: {
    represents: 'Values, love nature, aesthetic sense, self-worth',
    whenActivated: 'Relationships, finances, pleasure, beauty',
    sensitive: 'Worthiness, desirability, value in relationships'
  },

  Mars: {
    represents: 'Will, desire, assertion, anger, sexuality',
    whenActivated: 'Action, competition, conflict, sexual energy',
    sensitive: 'Aggression, powerlessness, masculine expression'
  },

  Jupiter: {
    represents: 'Beliefs, expansion, faith, meaning',
    whenActivated: 'Growth opportunities, philosophical questions',
    sensitive: 'Meaninglessness, over-expansion, spiritual doubt'
  },

  Saturn: {
    represents: 'Structure, limitations, authority, maturity',
    whenActivated: 'Responsibility, career, authority, time',
    sensitive: 'Inadequacy, failure, authority wounds'
  },

  Uranus: {
    represents: 'Individuality, freedom, uniqueness, rebellion',
    whenActivated: 'Need for change, authenticity, liberation',
    sensitive: 'Not belonging, alienation, suppressed uniqueness'
  },

  Neptune: {
    represents: 'Imagination, spirituality, ideals, dissolution',
    whenActivated: 'Dreams, creativity, spiritual longing',
    sensitive: 'Disillusionment, escapism, boundary confusion'
  },

  Pluto: {
    represents: 'Power, transformation, death/rebirth, shadow',
    whenActivated: 'Intensity, control issues, deep change',
    sensitive: 'Power/powerlessness, betrayal, survival'
  },

  NorthNode: {
    represents: 'Soul direction, evolutionary path, destiny',
    whenActivated: 'Life direction, karmic opportunities',
    sensitive: 'Purpose, belonging, evolutionary fear'
  },

  Chiron: {
    represents: 'Core wound, healing gift, shamanic bridge',
    whenActivated: 'Old wounds, healing opportunities',
    sensitive: 'Inadequacy, wounding, teaching through pain'
  }
};

// =============================================================================
// ASPECT INTERPRETATIONS
// =============================================================================

export const ASPECT_MEANINGS = {
  conjunction: {
    nature: 'Fusion',
    energy: 'Intense, merging, initiating',
    psychological: 'The transit planet\'s energy fuses with the natal function. New beginnings, but can be overwhelming.',
    challenge: 'Losing perspective, being consumed by the energy',
    gift: 'Pure activation, new cycle beginning',
    greeneInsight: 'A conjunction is a seed moment—something is being planted in the psyche.'
  },

  opposition: {
    nature: 'Confrontation',
    energy: 'Polarizing, projecting, relating',
    psychological: 'What we have denied becomes visible through others or circumstances. Integration required.',
    challenge: 'Projection, conflict, feeling attacked',
    gift: 'Awareness through relationship, balance',
    greeneInsight: 'Oppositions show us ourselves through the mirror of the other. What we resist in them, we deny in ourselves.'
  },

  square: {
    nature: 'Crisis',
    energy: 'Friction, tension, forcing action',
    psychological: 'Internal pressure demanding change. Cannot be ignored or transcended—must be worked through.',
    challenge: 'Frustration, blocked energy, destructive action',
    gift: 'Strength through adversity, necessary change',
    greeneInsight: 'Squares are the growing pains of the psyche. They hurt because growth is happening.'
  },

  trine: {
    nature: 'Flow',
    energy: 'Harmonious, supportive, easy',
    psychological: 'Natural talent or support. Can be taken for granted or used creatively.',
    challenge: 'Complacency, wasted potential, laziness',
    gift: 'Grace, natural ability, creative flow',
    greeneInsight: 'Trines offer gifts, but gifts unused become burdens. The ease can become stagnation.'
  },

  sextile: {
    nature: 'Opportunity',
    energy: 'Stimulating, connecting, opening',
    psychological: 'Opportunities that require conscious engagement. Won\'t happen automatically.',
    challenge: 'Missing opportunities, insufficient effort',
    gift: 'Creative potential, helpful connections',
    greeneInsight: 'Sextiles are invitations. The universe opens a door, but we must walk through it.'
  },

  quincunx: {
    nature: 'Adjustment',
    energy: 'Irritating, requiring adaptation',
    psychological: 'Two functions that don\'t understand each other. Constant small adjustments needed.',
    challenge: 'Chronic tension, health issues, never quite fitting',
    gift: 'Flexibility, creative problem-solving',
    greeneInsight: 'Quincunxes are the invisible friction of life—the places where we must constantly adapt without resolution.'
  },

  semisquare: {
    nature: 'Irritation',
    energy: 'Minor friction, nagging tension',
    psychological: 'Small but persistent discomfort prompting minor adjustments.',
    challenge: 'Chronic irritation, picking at wounds',
    gift: 'Attention to detail, fine-tuning',
    greeneInsight: 'Semi-squares are like small thorns—easy to ignore but causing quiet suffering.'
  },

  sesquiquadrate: {
    nature: 'Frustration',
    energy: 'Building tension, pressure',
    psychological: 'Accumulated frustration seeking release. Often precedes breakthrough.',
    challenge: 'Explosive release, accumulated resentment',
    gift: 'Motivation for change, building energy',
    greeneInsight: 'The sesquiquadrate builds pressure until something must change. The question is how we release it.'
  }
};

// =============================================================================
// SPECIFIC TRANSIT INTERPRETATIONS
// =============================================================================

export const TRANSIT_INTERPRETATIONS = {
  // Saturn transits (most psychologically significant)
  'Saturn-Sun': {
    theme: 'Authority and Identity Crisis',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'The father within demands accountability. Who are you when stripped of pretense? Time to take responsibility for your life direction.',
    challenge: 'Depression, low vitality, feeling blocked, father issues surfacing',
    opportunity: 'Claiming authentic authority, building lasting identity, maturation',
    shadow: 'Giving up, victim consciousness, blaming authority figures',
    integration: 'Accept limitations as the boundaries that define your true shape. Authority is earned, not given.',
    lunaPrompt: 'What would it mean to be your own father now—to give yourself the structure and approval you once sought from others?'
  },

  'Saturn-Moon': {
    theme: 'Emotional Maturation',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'The mother within must grow up. Emotional needs face reality. Time to provide for yourself what you once needed from mother.',
    challenge: 'Emotional coldness, depression, loneliness, mother issues surfacing',
    opportunity: 'Emotional self-sufficiency, healthy boundaries, nurturing maturity',
    shadow: 'Emotional shutdown, chronic depression, mother resentment',
    integration: 'Learn to mother yourself. Security comes from within, not from being held.',
    lunaPrompt: 'What emotional need have you been waiting for someone else to meet? How might you begin to meet it yourself?'
  },

  'Saturn-Mercury': {
    theme: 'Mental Discipline',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'Thinking must become structured. Ideas face reality testing. Time to communicate with authority.',
    challenge: 'Mental depression, negative thinking, communication blocks',
    opportunity: 'Mental mastery, serious study, authoritative communication',
    shadow: 'Rigid thinking, pessimism, intellectual arrogance',
    integration: 'Discipline the mind without imprisoning it. Structure serves thought.',
    lunaPrompt: 'What thought patterns have you outgrown? What would it mean to think like the authority you\'re becoming?'
  },

  'Saturn-Venus': {
    theme: 'Value and Relationship Testing',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'Love faces reality. What you value is tested. Relationships reveal their true worth.',
    challenge: 'Loneliness, feeling unloved, financial pressure, relationship crisis',
    opportunity: 'Mature love, lasting values, relationship commitment or completion',
    shadow: 'Bitterness about love, materialistic compensation, emotional coldness',
    integration: 'Real love survives reality. What cannot mature must end.',
    lunaPrompt: 'What relationship or value has been based on illusion? What would remain if stripped to its essence?'
  },

  'Saturn-Mars': {
    theme: 'Will and Action Structuring',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'Desire meets limitation. Action requires discipline. Anger must be channeled constructively.',
    challenge: 'Frustrated will, blocked action, suppressed anger, exhaustion',
    opportunity: 'Disciplined effort, strategic action, controlled power',
    shadow: 'Chronic anger, passive-aggression, burnout from over-effort',
    integration: 'Power comes from focused effort over time, not explosive force.',
    lunaPrompt: 'Where have you been fighting walls instead of finding doors? What would strategic patience look like?'
  },

  'Saturn-Jupiter': {
    theme: 'Faith Meets Reality',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'Beliefs are tested. Expansion meets limitation. Time to ground your faith in reality.',
    challenge: 'Loss of faith, blocked growth, philosophical crisis',
    opportunity: 'Grounded wisdom, realistic optimism, sustainable growth',
    shadow: 'Cynicism, over-caution, loss of meaning',
    integration: 'True faith survives doubt. Growth that lasts is growth that\'s earned.',
    lunaPrompt: 'What belief has been too easy, too convenient? What would mature faith look like?'
  },

  'Saturn-Saturn': {
    theme: 'Saturn Return / Saturn Cycle',
    duration: 'Major life transition, 1-2 years process',
    psychological: 'THE initiation into adulthood, mature adulthood, or elder wisdom. Everything built on false foundations crumbles.',
    challenge: 'Major life crisis, career upheaval, depression, confronting mortality',
    opportunity: 'Claiming your authority, building true foundations, mastery',
    shadow: 'Refusing to grow up, chronic failure patterns, authority collapse',
    integration: 'What you build now must be able to stand for decades. Choose wisely.',
    lunaPrompt: 'What structures in your life were built for who you were, not who you\'re becoming? What must be released to make room for your true foundation?'
  },

  'Saturn-Uranus': {
    theme: 'Freedom vs Structure',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'The rebel and the authority collide within. Old structures resist necessary change.',
    challenge: 'Feeling trapped, sudden disruptions, authority conflicts',
    opportunity: 'Revolutionary restructuring, innovative discipline, authentic authority',
    shadow: 'Rigid resistance, chaotic rebellion, structural collapse',
    integration: 'True freedom requires structure. True structure allows freedom.',
    lunaPrompt: 'Where has your need for security been limiting necessary change? Where has your need for change been avoiding necessary structure?'
  },

  'Saturn-Neptune': {
    theme: 'Dream Meets Reality',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'Illusions dissolve. Dreams must become concrete. Spiritual bypassing no longer works.',
    challenge: 'Disillusionment, confusion, loss of faith, escapism temptation',
    opportunity: 'Grounded spirituality, practical idealism, compassionate realism',
    shadow: 'Cynical materialism, spiritual despair, addiction as escape',
    integration: 'The sacred lives in the ordinary. Spirit needs matter to express.',
    lunaPrompt: 'What beautiful illusion has been protecting you from a difficult truth? What would grounded faith look like?'
  },

  'Saturn-Pluto': {
    theme: 'Power Transformation',
    duration: '6-9 months total, 2-3 weeks intense',
    psychological: 'The deepest structures face destruction and rebuilding. Power must be claimed or surrendered.',
    challenge: 'Extreme pressure, power struggles, confronting the shadow',
    opportunity: 'Fundamental transformation, phoenix rising, true power',
    shadow: 'Destruction, power obsession, paranoid control',
    integration: 'What cannot be transformed must be released. True power transforms the self first.',
    lunaPrompt: 'What power have you been afraid to claim? What power have you been afraid to release?'
  },

  // Pluto transits
  'Pluto-Sun': {
    theme: 'Identity Death and Rebirth',
    duration: '2-3 years',
    psychological: 'The ego must die to be reborn. Who you thought you were is being transformed.',
    challenge: 'Identity crisis, power struggles, confronting mortality',
    opportunity: 'Profound self-transformation, authentic power, rebirth',
    shadow: 'Ego destruction without rebuilding, power obsession',
    integration: 'Let the false self die. The true self cannot be destroyed.',
    lunaPrompt: 'Who have you been pretending to be? Who is waiting to be born from the ashes?'
  },

  'Pluto-Moon': {
    theme: 'Emotional Transformation',
    duration: '2-3 years',
    psychological: 'Deepest emotional patterns are purged. The inner child faces the underworld.',
    challenge: 'Emotional crisis, family secrets revealed, mother complex activation',
    opportunity: 'Emotional rebirth, healing ancestral patterns, profound nurturing',
    shadow: 'Emotional manipulation, destructive relating, victim-perpetrator cycles',
    integration: 'Feel everything. Suppress nothing. What we cannot feel, we cannot heal.',
    lunaPrompt: 'What emotional truth have you been avoiding your entire life? What would it mean to finally feel it fully?'
  },

  'Pluto-Venus': {
    theme: 'Love and Value Transformation',
    duration: '2-3 years',
    psychological: 'Relationships and values undergo profound transformation. Love faces power dynamics.',
    challenge: 'Intense relationships, jealousy, power struggles in love, financial transformation',
    opportunity: 'Soul-level intimacy, transformed values, empowered relating',
    shadow: 'Obsessive love, manipulation, destructive relationships',
    integration: 'True intimacy requires vulnerability to transformation.',
    lunaPrompt: 'What has your heart been afraid to want? What relationship pattern is ready to die?'
  },

  // Uranus transits
  'Uranus-Sun': {
    theme: 'Identity Liberation',
    duration: '1-2 years',
    psychological: 'The authentic self breaks free. Sudden changes in life direction.',
    challenge: 'Instability, identity confusion, disrupted life structures',
    opportunity: 'Authentic self-expression, liberation, individuation',
    shadow: 'Chaos for its own sake, destroying what works, alienation',
    integration: 'Freedom serves authenticity, not escape.',
    lunaPrompt: 'What part of you has been waiting for permission to exist? What would it look like to stop waiting?'
  },

  'Uranus-Moon': {
    theme: 'Emotional Liberation',
    duration: '1-2 years',
    psychological: 'Emotional patterns are disrupted. The inner child demands freedom.',
    challenge: 'Emotional volatility, family disruption, rootlessness',
    opportunity: 'Emotional authenticity, liberation from family patterns',
    shadow: 'Emotional disconnection, running from intimacy',
    integration: 'True security allows freedom. True freedom includes belonging.',
    lunaPrompt: 'What emotional need have you suppressed to belong? What would it mean to feel freely?'
  },

  // Neptune transits
  'Neptune-Sun': {
    theme: 'Identity Dissolution',
    duration: '2-3 years',
    psychological: 'The ego dissolves into something larger. Identity becomes fluid.',
    challenge: 'Confusion, loss of direction, idealization/disillusionment',
    opportunity: 'Spiritual awakening, transcendent creativity, compassion',
    shadow: 'Lost identity, escapism, savior/victim dynamics',
    integration: 'Dissolve the false self; the true self floats.',
    lunaPrompt: 'What would remain of you if you stopped trying so hard to be someone? What emerges in the space?'
  },

  'Neptune-Moon': {
    theme: 'Emotional Dissolution',
    duration: '2-3 years',
    psychological: 'Emotional boundaries dissolve. The longing for return to the mother/source.',
    challenge: 'Boundary confusion, emotional overwhelm, escapism',
    opportunity: 'Spiritual nurturing, universal compassion, creative sensitivity',
    shadow: 'Addiction, codependency, emotional martyrdom',
    integration: 'Feel everything; become nothing. Boundaries can be permeable yet present.',
    lunaPrompt: 'What are you trying to return to? What would it mean to find that source within?'
  },

  // Jupiter transits
  'Jupiter-Sun': {
    theme: 'Identity Expansion',
    duration: '2-3 weeks',
    psychological: 'The self wants to grow and express more fully.',
    challenge: 'Over-confidence, missed opportunities, inflation',
    opportunity: 'Growth, recognition, expanded self-expression',
    shadow: 'Grandiosity, over-extension, wasted potential',
    integration: 'Grow where you are. Bloom where planted.',
    lunaPrompt: 'What wants to grow in you right now? What opportunity are you being offered?'
  },

  'Jupiter-Saturn': {
    theme: 'Structured Growth',
    duration: '2-3 weeks',
    psychological: 'Expansion and limitation find balance. Sustainable growth.',
    challenge: 'Frustration between wanting more and accepting limits',
    opportunity: 'Wise growth, grounded expansion, realistic optimism',
    shadow: 'Cynical caution or reckless expansion',
    integration: 'True growth respects limits. True limits allow growth.',
    lunaPrompt: 'Where can you grow sustainably? What expansion would actually serve you?'
  }
};

// =============================================================================
// INTERPRETATION FUNCTIONS
// =============================================================================

/**
 * Get interpretation for a specific transit
 */
export function getTransitInterpretation(transitPlanet, natalPlanet, aspect = 'conjunction') {
  // Build lookup key
  const key = `${transitPlanet}-${natalPlanet}`;

  // Check for specific interpretation
  if (TRANSIT_INTERPRETATIONS[key]) {
    return {
      ...TRANSIT_INTERPRETATIONS[key],
      transitPlanet,
      natalPlanet,
      aspect,
      aspectMeaning: ASPECT_MEANINGS[aspect],
      transitPlanetTheme: TRANSIT_PLANET_THEMES[transitPlanet],
      natalPlanetTheme: NATAL_PLANET_THEMES[natalPlanet]
    };
  }

  // Generate generic interpretation
  return generateGenericInterpretation(transitPlanet, natalPlanet, aspect);
}

/**
 * Generate generic interpretation when specific one not available
 */
function generateGenericInterpretation(transitPlanet, natalPlanet, aspect) {
  const transitTheme = TRANSIT_PLANET_THEMES[transitPlanet] || {};
  const natalTheme = NATAL_PLANET_THEMES[natalPlanet] || {};
  const aspectMeaning = ASPECT_MEANINGS[aspect] || {};

  return {
    transitPlanet,
    natalPlanet,
    aspect,
    theme: `${transitTheme.archetype || transitPlanet} activates ${natalTheme.represents || natalPlanet}`,
    duration: transitTheme.duration || 'Variable',
    psychological: `The energy of ${transitPlanet} (${transitTheme.theme || 'transformation'}) is ${aspectMeaning.nature || 'interacting'} with your natal ${natalPlanet} (${natalTheme.represents || 'psychic function'}). This ${aspectMeaning.psychological || 'creates significant inner movement'}.`,
    challenge: `${aspectMeaning.challenge || 'Integration difficulties'} combined with ${transitTheme.shadow || 'transit shadows'}`,
    opportunity: `${aspectMeaning.gift || 'Growth potential'} through ${transitTheme.bringsForth || 'new awareness'}`,
    shadow: transitTheme.shadow || 'Unconscious expression of the transit energy',
    integration: aspectMeaning.greeneInsight || transitTheme.greeneInsight || 'Bring conscious awareness to this activation.',
    lunaPrompt: `How is the energy of ${transitPlanet} showing up in your life right now? What is your ${natalPlanet} trying to tell you?`,
    aspectMeaning,
    transitPlanetTheme: transitTheme,
    natalPlanetTheme: natalTheme,
    isGeneric: true
  };
}

/**
 * Get Saturn-specific transit interpretation
 */
export function getSaturnTransitInterpretation(natalPlanet, saturnPhase) {
  const baseInterpretation = getTransitInterpretation('Saturn', natalPlanet);

  // Add phase-specific context
  const phaseModifiers = {
    'post-return': {
      context: 'You are integrating the lessons of your recent Saturn Return.',
      emphasis: 'Building new structures on the foundations you have claimed.'
    },
    'waxing-square': {
      context: 'The first major test of your Saturn cycle structures.',
      emphasis: 'What you built at your Return is now being challenged. Adjust or strengthen.'
    },
    'opposition': {
      context: 'The halfway point of your Saturn cycle. Maximum visibility.',
      emphasis: 'Others can now see what you have been building. External challenges reveal internal weaknesses.'
    },
    'waning-square': {
      context: 'The final crisis before your next Return.',
      emphasis: 'What no longer serves must be released. Prepare for the next cycle.'
    },
    'return-approaching': {
      context: 'Your Saturn Return approaches. The reckoning is near.',
      emphasis: 'Everything built on false foundations will be tested. Prepare by getting honest with yourself.'
    }
  };

  const modifier = phaseModifiers[saturnPhase] || {};

  return {
    ...baseInterpretation,
    saturnPhase,
    phaseContext: modifier.context,
    phaseEmphasis: modifier.emphasis
  };
}

/**
 * Generate daily transit guidance
 */
export function generateDailyTransitGuidance(transits, natalChart) {
  if (!transits || transits.length === 0) {
    return {
      headline: 'A Quiet Day',
      summary: 'No major transits are active today. Use this time for integration and reflection.',
      focus: 'Rest and consolidation',
      lunaWhisper: 'Sometimes the most profound work happens in the spaces between storms.'
    };
  }

  // Find the most significant transit
  const primaryTransit = transits[0];
  const interpretation = getTransitInterpretation(
    primaryTransit.transitPlanet,
    primaryTransit.natalPlanet,
    primaryTransit.aspect
  );

  // Count transit types
  const challengingCount = transits.filter(t => ['square', 'opposition', 'quincunx'].includes(t.aspect)).length;
  const supportiveCount = transits.filter(t => ['trine', 'sextile'].includes(t.aspect)).length;

  let headline, overallTone;
  if (challengingCount > supportiveCount * 2) {
    headline = 'A Day of Growth Through Challenge';
    overallTone = 'challenging';
  } else if (supportiveCount > challengingCount * 2) {
    headline = 'A Day of Flow and Opportunity';
    overallTone = 'supportive';
  } else {
    headline = 'A Day of Dynamic Balance';
    overallTone = 'mixed';
  }

  return {
    headline,
    overallTone,
    primaryTransit: {
      description: `${primaryTransit.transitPlanet} ${primaryTransit.aspect} your ${primaryTransit.natalPlanet}`,
      interpretation: interpretation.psychological,
      challenge: interpretation.challenge,
      opportunity: interpretation.opportunity
    },
    transitsCount: transits.length,
    challengingCount,
    supportiveCount,
    focus: interpretation.theme,
    lunaWhisper: interpretation.lunaPrompt,
    allTransits: transits.map(t => ({
      description: `${t.transitPlanet} ${t.symbol} ${t.natalPlanet}`,
      aspect: t.aspect,
      orb: t.orb,
      applying: t.applying,
      importance: t.importance
    }))
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  TRANSIT_PLANET_THEMES,
  NATAL_PLANET_THEMES,
  ASPECT_MEANINGS,
  TRANSIT_INTERPRETATIONS,
  getTransitInterpretation,
  getSaturnTransitInterpretation,
  generateDailyTransitGuidance
};
