/**
 * Composite Shadow Engine
 *
 * Based on Liz Greene's integration of Jungian shadow work with astrology,
 * as developed in "Relating," "The Dark of the Soul," and her work on
 * Saturn and Pluto as shadow-revealing archetypes.
 *
 * Every relationship has a shadow — the parts of itself it cannot see,
 * the dynamics it denies, the patterns it projects onto others.
 * This module illuminates that shadow with compassion.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE SATURN SHADOW
// What the relationship fears, restricts, and must ultimately master
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_SATURN = {
  Aries: {
    shadow: 'Fear of Initiating',
    fear: 'The relationship fears starting things, being first, taking independent action. There may be chronic hesitation disguised as prudence.',
    restriction: 'Spontaneity is unconsciously blocked. The relationship waits for permission that never comes.',
    defense: 'The relationship may become passive, letting life happen TO it rather than creating life.',
    mastery: 'Learning to act despite fear. Discovering that courage grows only through courageous acts.',
    integration: 'When integrated, Saturn in Aries gives the relationship disciplined initiative — the ability to begin things and see them through.'
  },
  Taurus: {
    shadow: 'Fear of Scarcity',
    fear: 'The relationship fears not having enough — money, security, pleasure. There is unconscious poverty consciousness.',
    restriction: 'The flow of abundance is blocked by fear. The relationship may hoard or restrict unnecessarily.',
    defense: 'Over-accumulation. Or alternatively, refusing to build anything because "it will just be taken away."',
    mastery: 'Learning that true security comes from within. That letting go can bring more than holding on.',
    integration: 'When integrated, Saturn in Taurus gives the relationship mature abundance — the ability to build lasting value while staying open to flow.'
  },
  Gemini: {
    shadow: 'Fear of Communication',
    fear: 'The relationship fears being misunderstood, saying the wrong thing, or not being heard. Words feel dangerous.',
    restriction: 'Important things go unsaid. The relationship may communicate about everything except what matters.',
    defense: 'Superficial chatter that avoids depth. Or silence where words are needed.',
    mastery: 'Learning that truth, spoken with care, heals more than it wounds.',
    integration: 'When integrated, Saturn in Gemini gives the relationship mature communication — words that build rather than defend.'
  },
  Cancer: {
    shadow: 'Fear of Vulnerability',
    fear: 'The relationship fears emotional exposure, being hurt, letting guard down. The shell may never open.',
    restriction: 'Emotional intimacy is unconsciously blocked. The relationship protects itself from what it most needs.',
    defense: 'Emotional walls. Creating "pseudo-families" that offer connection without risk.',
    mastery: 'Learning that vulnerability is strength. That the shell must open for life to flow.',
    integration: 'When integrated, Saturn in Cancer gives the relationship mature nurturing — the ability to create real security while remaining open.'
  },
  Leo: {
    shadow: 'Fear of Being Seen',
    fear: 'The relationship fears visibility, judgment, or the shame of not being special enough.',
    restriction: 'Creative self-expression is blocked. The relationship dims its light to avoid judgment.',
    defense: 'False humility or exaggerated modesty. Or alternatively, over-performance to prove worth.',
    mastery: 'Learning to shine anyway. Discovering that true royalty needs no external validation.',
    integration: 'When integrated, Saturn in Leo gives the relationship mature creativity — the ability to create without attachment to applause.'
  },
  Virgo: {
    shadow: 'Fear of Imperfection',
    fear: 'The relationship fears criticism, failure, or being found inadequate. Nothing is ever good enough.',
    restriction: 'Action is blocked by perfectionism. The relationship may criticize rather than create.',
    defense: 'Chronic improvement projects that never reach completion. Criticism of self or other to preempt outside judgment.',
    mastery: 'Learning that imperfection is human. That "good enough" allows movement.',
    integration: 'When integrated, Saturn in Virgo gives the relationship mature discernment — the ability to improve without destroying.'
  },
  Libra: {
    shadow: 'Fear of Conflict',
    fear: 'The relationship fears disharmony, unfairness, or being alone. Peace is pursued at any price.',
    restriction: 'Honest disagreement is blocked. The relationship may lose itself in pleasing.',
    defense: 'Pseudo-harmony that avoids real issues. Keeping score to ensure "fairness."',
    mastery: 'Learning that real harmony includes discord. That conflict can be creative.',
    integration: 'When integrated, Saturn in Libra gives the relationship mature relating — the ability to find balance without losing truth.'
  },
  Scorpio: {
    shadow: 'Fear of Powerlessness',
    fear: 'The relationship fears betrayal, loss of control, or having its vulnerabilities exposed.',
    restriction: 'Emotional truth is blocked by control. The relationship may use power rather than risk intimacy.',
    defense: 'Control patterns. Withholding to maintain power. Testing loyalty obsessively.',
    mastery: 'Learning that surrender is not defeat. That true power lies in vulnerability.',
    integration: 'When integrated, Saturn in Scorpio gives the relationship mature intensity — the ability to go deep without drowning.'
  },
  Sagittarius: {
    shadow: 'Fear of Meaninglessness',
    fear: 'The relationship fears pointlessness, being trapped, or losing its sense of purpose.',
    restriction: 'Expansion is blocked by doubt. The relationship may preach beliefs it doesn\'t live.',
    defense: 'Constant movement to avoid emptiness. Rigid beliefs to ward off uncertainty.',
    mastery: 'Learning to find meaning in the ordinary. That truth is lived, not just believed.',
    integration: 'When integrated, Saturn in Sagittarius gives the relationship mature faith — beliefs that have been tested and found true.'
  },
  Capricorn: {
    shadow: 'Fear of Failure',
    fear: 'The relationship fears not achieving, not being respected, or having wasted time.',
    restriction: 'Joy is blocked by duty. The relationship may accomplish much while feeling little.',
    defense: 'Workaholism. Using achievement to avoid intimacy. Defining self by external success.',
    mastery: 'Learning that being matters as much as doing. That love is not earned.',
    integration: 'When integrated, Saturn in Capricorn gives the relationship mature authority — achievement that includes emotional presence.'
  },
  Aquarius: {
    shadow: 'Fear of Belonging',
    fear: 'The relationship fears being ordinary, losing individuality, or being trapped in convention.',
    restriction: 'Intimacy is blocked by idealism. The relationship may have many friends but little depth.',
    defense: 'Emotional detachment disguised as objectivity. Commitment to humanity but not to individuals.',
    mastery: 'Learning that uniqueness includes connection. That belonging need not mean conforming.',
    integration: 'When integrated, Saturn in Aquarius gives the relationship mature individuality — the freedom to be different while genuinely connecting.'
  },
  Pisces: {
    shadow: 'Fear of Reality',
    fear: 'The relationship fears harsh truth, loss of magic, or the pain of being fully incarnate.',
    restriction: 'Groundedness is blocked by longing for transcendence. The relationship may drift.',
    defense: 'Escapism. Victim consciousness. Spiritual bypassing of real problems.',
    mastery: 'Learning that heaven is found through earth, not by avoiding it.',
    integration: 'When integrated, Saturn in Pisces gives the relationship mature spirituality — transcendence that includes, rather than escapes, reality.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE PLUTO SHADOW
// What the relationship obsesses over, transforms, and must ultimately release
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_PLUTO = {
  Aries: {
    shadow: 'Will to Dominate',
    obsession: 'Power through assertion. The relationship may struggle over who leads.',
    transformation: 'Learning that true strength doesn\'t need to prove itself.',
    compulsion: 'Competition, one-upmanship, power struggles about control',
    release: 'Releasing the need to win. Discovering that surrender can be strength.',
    depth: 'At its deepest, this placement transforms rage into right action — power that serves rather than dominates.'
  },
  Taurus: {
    shadow: 'Attachment to Possession',
    obsession: 'Material security as emotional safety. The relationship may try to own what cannot be owned.',
    transformation: 'Learning that nothing is truly "mine" or "yours" — including each other.',
    compulsion: 'Possessiveness, jealousy over resources, fear of loss driving accumulation',
    release: 'Releasing attachment to form. Trusting that what is meant to stay will stay.',
    depth: 'At its deepest, this placement transforms greed into generosity — wealth that flows.'
  },
  Gemini: {
    shadow: 'Manipulation through Words',
    obsession: 'Knowledge as power. The relationship may use words as weapons or shields.',
    transformation: 'Learning that truth serves better than cleverness.',
    compulsion: 'Mind games, withholding information, using words to control',
    release: 'Releasing the need to be right. Discovering the power of not knowing.',
    depth: 'At its deepest, this placement transforms cunning into wisdom — communication that heals.'
  },
  Cancer: {
    shadow: 'Emotional Manipulation',
    obsession: 'Security through emotional control. The relationship may use feeling as currency.',
    transformation: 'Learning that emotional honesty creates more safety than control.',
    compulsion: 'Guilt-tripping, emotional withdrawal as punishment, enmeshment',
    release: 'Releasing the illusion that emotions can be managed. Trusting the heart\'s intelligence.',
    depth: 'At its deepest, this placement transforms emotional manipulation into emotional mastery — feeling without drowning.'
  },
  Leo: {
    shadow: 'Need for Worship',
    obsession: 'Recognition as validation. The relationship may demand an audience for its existence.',
    transformation: 'Learning that true royalty shines without needing mirrors.',
    compulsion: 'Drama, attention-seeking, making everything about "us"',
    release: 'Releasing the need for applause. Discovering light that shines for its own sake.',
    depth: 'At its deepest, this placement transforms narcissism into genuine warmth — creativity that gives without needing return.'
  },
  Virgo: {
    shadow: 'Obsessive Criticism',
    obsession: 'Perfection as safety. The relationship may critique what it cannot control.',
    transformation: 'Learning that imperfection is life. That criticism serves only when it heals.',
    compulsion: 'Chronic dissatisfaction, finding flaws, improvement as control',
    release: 'Releasing the perfectionist\'s prison. Accepting "good enough" as genuinely good.',
    depth: 'At its deepest, this placement transforms criticism into discernment — the wisdom to improve what can be improved and accept what cannot.'
  },
  Libra: {
    shadow: 'Manipulation through Harmony',
    obsession: 'Peace at any price. The relationship may suppress truth to maintain appearances.',
    transformation: 'Learning that real peace includes conflict. That truth serves balance.',
    compulsion: 'People-pleasing, passive-aggression, using "fairness" as weapon',
    release: 'Releasing the false self. Allowing the relationship to be messy AND real.',
    depth: 'At its deepest, this placement transforms co-dependence into interdependence — balance that includes both selves.'
  },
  Scorpio: {
    shadow: 'Will to Control',
    obsession: 'Power through knowing. The relationship may probe for vulnerabilities to exploit or protect.',
    transformation: 'Learning that true intimacy requires surrender, not surveillance.',
    compulsion: 'Jealousy, obsession, using secrets as power, fear of betrayal',
    release: 'Releasing the need to know everything. Trusting where sight cannot reach.',
    depth: 'At its deepest, this placement transforms obsession into devotion — intensity that serves love rather than fear.'
  },
  Sagittarius: {
    shadow: 'Obsession with Truth',
    obsession: 'Being right as identity. The relationship may pursue truth to escape intimacy.',
    transformation: 'Learning that love is greater than any philosophy.',
    compulsion: 'Preaching, judging, using beliefs as weapons, escapism through "seeking"',
    release: 'Releasing the need for absolute truth. Discovering that mystery is home.',
    depth: 'At its deepest, this placement transforms fanaticism into faith — beliefs that open rather than close.'
  },
  Capricorn: {
    shadow: 'Obsession with Achievement',
    obsession: 'Success as justification for existence. The relationship may accomplish at the cost of connecting.',
    transformation: 'Learning that being matters more than achieving.',
    compulsion: 'Workaholism, using success to avoid intimacy, defining relationship by external markers',
    release: 'Releasing the need to prove worth. Discovering that love is not earned.',
    depth: 'At its deepest, this placement transforms ambition into contribution — achievement that serves rather than defends.'
  },
  Aquarius: {
    shadow: 'Detachment as Defense',
    obsession: 'Freedom as emotional avoidance. The relationship may intellectualize what should be felt.',
    transformation: 'Learning that true freedom includes commitment.',
    compulsion: 'Emotional distance, treating intimacy as a problem to solve, rebellion for its own sake',
    release: 'Releasing the fear of belonging. Discovering that connection need not mean control.',
    depth: 'At its deepest, this placement transforms alienation into individuation — uniqueness that connects rather than isolates.'
  },
  Pisces: {
    shadow: 'Dissolution and Escape',
    obsession: 'Transcendence as avoidance. The relationship may lose itself to avoid the pain of being found.',
    transformation: 'Learning that enlightenment includes incarnation.',
    compulsion: 'Escapism, martyrdom, sacrificing boundaries in the name of love, addiction',
    release: 'Releasing the illusion of unworthiness. Discovering that presence is sacred.',
    depth: 'At its deepest, this placement transforms escapism into true compassion — love that includes healthy limits.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE 8TH HOUSE
// The relationship's shared shadow, sexuality, and transformation
// ═══════════════════════════════════════════════════════════════════════════

const EIGHTH_HOUSE_SIGN = {
  Aries: {
    sharedResource: 'Power and initiative are shared resources. Who leads? Who follows?',
    sexuality: 'Sexual energy is direct, sometimes aggressive. Passion can become combat.',
    transformation: 'The relationship transforms through crisis and direct confrontation.',
    death: 'What dies: passivity, timidity. What is reborn: authentic courage.'
  },
  Taurus: {
    sharedResource: 'Money, property, and physical security are shared resources.',
    sexuality: 'Sexual energy is earthy, sensual, possessive. Comfort matters.',
    transformation: 'The relationship transforms through material changes and physical grounding.',
    death: 'What dies: scarcity consciousness. What is reborn: true abundance.'
  },
  Gemini: {
    sharedResource: 'Information and ideas are shared resources. Who knows what?',
    sexuality: 'Sexual energy is mental, playful, curious. Words are foreplay.',
    transformation: 'The relationship transforms through communication and learning.',
    death: 'What dies: superficiality. What is reborn: wisdom born of depth.'
  },
  Cancer: {
    sharedResource: 'Emotional security and family are shared resources.',
    sexuality: 'Sexual energy is nurturing, bonding, emotionally charged.',
    transformation: 'The relationship transforms through emotional crisis and healing.',
    death: 'What dies: emotional walls. What is reborn: true vulnerability.'
  },
  Leo: {
    sharedResource: 'Creative expression and recognition are shared resources.',
    sexuality: 'Sexual energy is dramatic, generous, needs to feel special.',
    transformation: 'The relationship transforms through creative acts and ego-death.',
    death: 'What dies: false pride. What is reborn: authentic radiance.'
  },
  Virgo: {
    sharedResource: 'Service and health are shared resources. How we heal together.',
    sexuality: 'Sexual energy is refined, service-oriented, sometimes inhibited.',
    transformation: 'The relationship transforms through analysis and practical improvement.',
    death: 'What dies: perfectionism. What is reborn: acceptance.'
  },
  Libra: {
    sharedResource: 'The relationship itself is the shared resource. How we balance.',
    sexuality: 'Sexual energy is romantic, harmonious, needs beauty and fairness.',
    transformation: 'The relationship transforms through the mirror of partnership.',
    death: 'What dies: false peace. What is reborn: true harmony.'
  },
  Scorpio: {
    sharedResource: 'Power, sexuality, and hidden resources are intensely shared.',
    sexuality: 'Sexual energy is intense, transformative, potentially compulsive.',
    transformation: 'The relationship transforms through confronting its own darkness.',
    death: 'What dies: the illusion of control. What is reborn: authentic power.'
  },
  Sagittarius: {
    sharedResource: 'Beliefs and meaning are shared resources.',
    sexuality: 'Sexual energy is adventurous, philosophical, freedom-loving.',
    transformation: 'The relationship transforms through expanding worldview.',
    death: 'What dies: narrow beliefs. What is reborn: inclusive truth.'
  },
  Capricorn: {
    sharedResource: 'Authority and achievement are shared resources.',
    sexuality: 'Sexual energy is controlled, serious, needs purpose.',
    transformation: 'The relationship transforms through taking mature responsibility.',
    death: 'What dies: achievement for its own sake. What is reborn: meaningful accomplishment.'
  },
  Aquarius: {
    sharedResource: 'Ideals and freedom are shared resources.',
    sexuality: 'Sexual energy is unconventional, intellectual, needs space.',
    transformation: 'The relationship transforms through revolution and innovation.',
    death: 'What dies: conformity. What is reborn: authentic individuality.'
  },
  Pisces: {
    sharedResource: 'Spirituality and imagination are shared resources.',
    sexuality: 'Sexual energy is transcendent, sometimes escapist, deeply romantic.',
    transformation: 'The relationship transforms through surrender and spiritual growth.',
    death: 'What dies: illusion. What is reborn: genuine transcendence.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFENSE MECHANISMS
// Relationship defenses based on Saturn-Pluto interaction
// ═══════════════════════════════════════════════════════════════════════════

const DEFENSE_PATTERNS = {
  control: {
    name: 'The Controller',
    pattern: 'One or both partners attempt to control outcomes, each other, or the relationship itself.',
    trigger: 'Feeling unsafe, out of control, or potentially abandoned.',
    manifestation: 'Rules, schedules, monitoring, emotional withholding as punishment.',
    healing: 'Recognizing that control is fear in disguise. Building genuine safety through vulnerability.'
  },
  avoidance: {
    name: 'The Avoider',
    pattern: 'The relationship avoids conflict, intensity, or emotional truth.',
    trigger: 'Potential conflict, deep feeling, or difficult conversations.',
    manifestation: 'Changing subject, staying busy, keeping things "light," emotional distance.',
    healing: 'Learning that avoidance creates what it fears. Approaching what wants to be felt.'
  },
  projection: {
    name: 'The Projector',
    pattern: 'The relationship projects its shadow onto others — exes, in-laws, outsiders.',
    trigger: 'Encountering own disowned qualities in external figures.',
    manifestation: 'Blaming, gossiping, creating enemies, "us vs. them" dynamics.',
    healing: 'Owning the projection. Recognizing the disowned self in the blamed other.'
  },
  fusion: {
    name: 'The Merger',
    pattern: 'The relationship loses individual boundaries in the name of closeness.',
    trigger: 'Fear of abandonment, separation anxiety, desire for safety through merger.',
    manifestation: 'No individual interests, speaking for each other, shared identity.',
    healing: 'Discovering that healthy boundaries create deeper intimacy than enmeshment.'
  },
  dissociation: {
    name: 'The Dissociator',
    pattern: 'The relationship goes "offline" during intense moments.',
    trigger: 'Overwhelming emotion, conflict, or intimacy.',
    manifestation: 'Zoning out, emotional flatness, "leaving the room" while staying present.',
    healing: 'Building capacity to stay present with intensity. Titrating exposure.'
  },
  intellectualization: {
    name: 'The Intellectualizer',
    pattern: 'The relationship thinks about feelings rather than feeling them.',
    trigger: 'Any emotional intensity or vulnerability.',
    manifestation: 'Analyzing, discussing, theorizing about emotions instead of having them.',
    healing: 'Dropping from head to heart. Allowing feeling before understanding.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the shadow profile of a composite chart
 *
 * @param {Object} compositeChart - Composite chart from compositeGenerator
 * @returns {Object} Shadow profile of the relationship
 */
export function buildCompositeShadow(compositeChart) {
  if (!compositeChart || !compositeChart.planets) {
    return null;
  }

  const planets = compositeChart.planets;

  // Extract relevant placements
  const saturnSign = planets.Saturn?.sign;
  const plutoSign = planets.Pluto?.sign;
  const ascSign = planets.Ascendant?.sign;

  // Calculate 8th house sign (opposite from 2nd, or 7 signs from Asc)
  let eighthHouseSign = null;
  if (ascSign) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const ascIndex = signs.indexOf(ascSign);
    if (ascIndex !== -1) {
      eighthHouseSign = signs[(ascIndex + 7) % 12];
    }
  }

  const shadow = {
    // Saturn Shadow (Fear & Restriction)
    saturnShadow: saturnSign ? {
      sign: saturnSign,
      ...COMPOSITE_SATURN[saturnSign]
    } : null,

    // Pluto Shadow (Obsession & Transformation)
    plutoShadow: plutoSign ? {
      sign: plutoSign,
      ...COMPOSITE_PLUTO[plutoSign]
    } : null,

    // 8th House Shadow
    eighthHouse: eighthHouseSign ? {
      sign: eighthHouseSign,
      ...EIGHTH_HOUSE_SIGN[eighthHouseSign]
    } : null,

    // Primary Defense Mechanism (based on Saturn-Pluto interaction)
    primaryDefense: detectPrimaryDefense(saturnSign, plutoSign),

    // Shadow Integration Path
    integrationPath: generateIntegrationPath(saturnSign, plutoSign),

    // Shadow Summary
    summary: generateShadowSummary(saturnSign, plutoSign)
  };

  return shadow;
}

/**
 * Detect primary defense mechanism based on Saturn-Pluto combination
 */
function detectPrimaryDefense(saturnSign, plutoSign) {
  if (!saturnSign) return DEFENSE_PATTERNS.avoidance;

  // Map Saturn signs to primary defenses
  const saturnDefenseMap = {
    Aries: 'control',
    Taurus: 'control',
    Gemini: 'intellectualization',
    Cancer: 'fusion',
    Leo: 'avoidance',
    Virgo: 'intellectualization',
    Libra: 'avoidance',
    Scorpio: 'control',
    Sagittarius: 'dissociation',
    Capricorn: 'control',
    Aquarius: 'intellectualization',
    Pisces: 'dissociation'
  };

  const primaryKey = saturnDefenseMap[saturnSign] || 'avoidance';

  // Pluto can modify the defense
  let modifiedDefense = { ...DEFENSE_PATTERNS[primaryKey] };

  if (plutoSign) {
    const intensifiers = {
      Scorpio: 'intensified',
      Capricorn: 'rigid',
      Aries: 'aggressive',
      Cancer: 'emotional'
    };

    if (intensifiers[plutoSign]) {
      modifiedDefense.intensity = intensifiers[plutoSign];
      modifiedDefense.modifiedPattern = `${intensifiers[plutoSign]} ${modifiedDefense.pattern.toLowerCase()}`;
    }
  }

  return modifiedDefense;
}

/**
 * Generate shadow integration path
 */
function generateIntegrationPath(saturnSign, plutoSign) {
  const steps = [];

  if (saturnSign && COMPOSITE_SATURN[saturnSign]) {
    steps.push({
      stage: 'Awareness',
      focus: COMPOSITE_SATURN[saturnSign].shadow,
      practice: `Recognize when ${COMPOSITE_SATURN[saturnSign].fear.toLowerCase().replace('the relationship fears', 'fear of')} activates.`
    });

    steps.push({
      stage: 'Acceptance',
      focus: 'Honoring the fear without judgment',
      practice: COMPOSITE_SATURN[saturnSign].mastery
    });
  }

  if (plutoSign && COMPOSITE_PLUTO[plutoSign]) {
    steps.push({
      stage: 'Transformation',
      focus: COMPOSITE_PLUTO[plutoSign].shadow,
      practice: COMPOSITE_PLUTO[plutoSign].release
    });

    steps.push({
      stage: 'Integration',
      focus: 'Living the transformed energy',
      practice: COMPOSITE_PLUTO[plutoSign].depth
    });
  }

  return steps.length > 0 ? steps : null;
}

/**
 * Generate shadow summary
 */
function generateShadowSummary(saturnSign, plutoSign) {
  const summaryParts = [];

  if (saturnSign && COMPOSITE_SATURN[saturnSign]) {
    summaryParts.push(`The relationship\'s primary fear is ${COMPOSITE_SATURN[saturnSign].shadow.toLowerCase()}.`);
  }

  if (plutoSign && COMPOSITE_PLUTO[plutoSign]) {
    summaryParts.push(`Its deepest challenge is ${COMPOSITE_PLUTO[plutoSign].shadow.toLowerCase()}.`);
    summaryParts.push(`Transformation comes through ${COMPOSITE_PLUTO[plutoSign].transformation.toLowerCase().replace('learning that', '')}.`);
  }

  return summaryParts.join(' ');
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the Saturn shadow
 */
export function getSaturnShadow(compositeChart) {
  const saturnSign = compositeChart?.planets?.Saturn?.sign;
  return saturnSign ? COMPOSITE_SATURN[saturnSign] : null;
}

/**
 * Get just the Pluto shadow
 */
export function getPlutoShadow(compositeChart) {
  const plutoSign = compositeChart?.planets?.Pluto?.sign;
  return plutoSign ? COMPOSITE_PLUTO[plutoSign] : null;
}

/**
 * Get defense mechanisms
 */
export function getDefensePatterns() {
  return DEFENSE_PATTERNS;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildCompositeShadow,
  getSaturnShadow,
  getPlutoShadow,
  getDefensePatterns,
  // Export data for customization
  COMPOSITE_SATURN,
  COMPOSITE_PLUTO,
  EIGHTH_HOUSE_SIGN,
  DEFENSE_PATTERNS
};
