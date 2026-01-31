/**
 * synastryAspectExtensions.js
 * ===========================
 *
 * Extended Synastry Aspect Interpretations for Deeper Compatibility
 * Part of Phase 3: Liz Greene Cathedral - Relationship Depth
 *
 * This module extends the synastryFateEngine.js with:
 * - Attraction & Sexuality (Venus-Mars dynamics)
 * - Emotional Bonding (Sun-Moon, Moon-Moon)
 * - Communication Styles (Mercury contacts)
 * - Wound & Healing (Chiron synastry)
 * - Commitment Indicators (Juno, Vertex)
 * - House Overlays (where their planets land in your houses)
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// VENUS-MARS SYNASTRY (ATTRACTION & DESIRE)
// =============================================================================

export const VENUS_MARS_ASPECTS = {
  conjunction: {
    type: 'magnetic_attraction',
    intensity: 'very_high',
    description: 'Powerful magnetic attraction—Venus person feels desired, Mars person feels drawn to pursue',
    sexuality: 'Highly compatible—natural give and take in physical expression',
    challenge: 'Can burn hot then cool if emotional foundation lacking',
    psychological: 'Mars awakens Venus\'s desire nature; Venus softens Mars\'s raw drive',
    lunaInsight: 'This is the classic spark of desire. The question is: can you build a fire that lasts?'
  },
  opposition: {
    type: 'polarized_attraction',
    intensity: 'high',
    description: 'Intense push-pull dynamic—irresistibly drawn but constantly negotiating',
    sexuality: 'Passionate but may involve power dynamics',
    challenge: 'What you want may conflict with how they pursue—requires compromise',
    psychological: 'Each sees the other as embodying what they lack in their own expression',
    lunaInsight: 'You are mirrors of desire for each other. The tension you feel is the space where growth happens.'
  },
  square: {
    type: 'frustrated_desire',
    intensity: 'high',
    description: 'Strong attraction mixed with friction—desire with complications',
    sexuality: 'Can create exciting tension or ongoing frustration',
    challenge: 'Timing, style, or approach to intimacy may clash',
    psychological: 'Unconscious conflict between what is wanted and how it is pursued',
    lunaInsight: 'The friction between you generates heat. Whether it warms or burns depends on your awareness.'
  },
  trine: {
    type: 'natural_harmony',
    intensity: 'medium',
    description: 'Easy, flowing attraction—natural compatibility in desire',
    sexuality: 'Harmonious expression—neither feels pushed or rejected',
    challenge: 'May lack the spark of challenge that creates passion',
    psychological: 'Desires align naturally, creating ease in physical connection',
    lunaInsight: 'Your desire natures flow together. Do not mistake ease for lack of depth.'
  },
  sextile: {
    type: 'opportunity_attraction',
    intensity: 'medium',
    description: 'Attraction that develops through interaction and effort',
    sexuality: 'Builds through communication and mutual exploration',
    challenge: 'May require conscious cultivation to keep spark alive',
    psychological: 'Attraction grows through mental connection and shared experiences',
    lunaInsight: 'Your attraction is like a garden—it requires tending to bloom.'
  }
};

// =============================================================================
// SUN-MOON SYNASTRY (EMOTIONAL COMPATIBILITY)
// =============================================================================

export const SUN_MOON_ASPECTS = {
  conjunction: {
    type: 'core_recognition',
    intensity: 'very_high',
    description: 'Moon person feels deeply seen by Sun person—profound recognition',
    emotional: 'Sun illuminates Moon\'s emotional nature; Moon nurtures Sun\'s identity',
    bonding: 'Creates strong attachment and sense of belonging together',
    challenge: 'Moon may become overly dependent on Sun\'s validation',
    lunaInsight: 'You recognize something essential in each other. This is the beginning of true intimacy.'
  },
  opposition: {
    type: 'complementary_balance',
    intensity: 'high',
    description: 'Full Moon energy—emotional completion through the other',
    emotional: 'Each fills what the other lacks; can feel like finding missing piece',
    bonding: 'Strong magnetic pull but requires integration work',
    challenge: 'Can alternate between feeling complete and feeling eclipsed',
    lunaInsight: 'You are the light and the reflection for each other. Neither is whole without learning from the other.'
  },
  square: {
    type: 'growth_tension',
    intensity: 'high',
    description: 'Sun\'s will and Moon\'s needs create friction requiring adjustment',
    emotional: 'What Sun person needs to express may not meet Moon person\'s emotional needs',
    bonding: 'Can bond through overcoming challenges together',
    challenge: 'Fundamental misalignment between ego expression and emotional safety',
    lunaInsight: 'Your souls are growing in different directions. This is painful—and it is also the crucible of evolution.'
  },
  trine: {
    type: 'natural_support',
    intensity: 'medium',
    description: 'Easy emotional support—Sun naturally nurtures Moon\'s feelings',
    emotional: 'Moon feels safe with Sun; Sun feels emotionally supported',
    bonding: 'Creates comfortable, supportive relationship foundation',
    challenge: 'May take the connection for granted',
    lunaInsight: 'You offer each other a safe harbor. Remember that safety is not stagnation.'
  },
  sextile: {
    type: 'friendly_support',
    intensity: 'medium',
    description: 'Easy, friendly connection with room for growth',
    emotional: 'Positive emotional exchange with space for individuality',
    bonding: 'Creates friendship foundation that supports romantic connection',
    challenge: 'May need to consciously deepen emotional intimacy',
    lunaInsight: 'Your connection has the warmth of true friendship. Let it deepen gradually.'
  }
};

// =============================================================================
// MOON-MOON SYNASTRY (EMOTIONAL ATTUNEMENT)
// =============================================================================

export const MOON_MOON_ASPECTS = {
  conjunction: {
    type: 'emotional_merging',
    intensity: 'very_high',
    description: 'You feel each other\'s emotions—almost psychic attunement',
    dynamics: 'Similar emotional needs and expression styles',
    comfort: 'Deep comfort and understanding at the feeling level',
    challenge: 'May amplify emotional states—both positive and negative',
    lunaInsight: 'You speak the same emotional language. Be careful not to drown in shared feelings.'
  },
  opposition: {
    type: 'emotional_complement',
    intensity: 'high',
    description: 'Different but complementary emotional styles',
    dynamics: 'What one lacks emotionally, the other provides',
    comfort: 'Can balance each other when conscious',
    challenge: 'Emotional needs may pull in different directions',
    lunaInsight: 'You nurture in opposite ways. The challenge is to receive what is offered, not what you expect.'
  },
  square: {
    type: 'emotional_friction',
    intensity: 'high',
    description: 'Emotional styles clash—what soothes one irritates the other',
    dynamics: 'Timing and method of emotional expression differ fundamentally',
    comfort: 'Must learn to translate between emotional languages',
    challenge: 'Frequent misunderstandings at the feeling level',
    lunaInsight: 'You wound each other without meaning to. This is where conscious love becomes necessary.'
  },
  trine: {
    type: 'emotional_ease',
    intensity: 'medium',
    description: 'Easy emotional flow—intuitive understanding of each other\'s needs',
    dynamics: 'Similar emotional rhythms and needs',
    comfort: 'Natural comfort together—feels like home',
    challenge: 'May avoid necessary emotional growth for comfort',
    lunaInsight: 'Your hearts beat in harmony. Do not let comfort become complacency.'
  },
  same_sign: {
    type: 'emotional_mirroring',
    intensity: 'high',
    description: 'Both Moons in same sign—you process emotions identically',
    dynamics: 'Complete emotional understanding but also blind spots',
    comfort: 'Profound sense of being understood',
    challenge: 'Share the same emotional weaknesses',
    lunaInsight: 'You are emotional twins. You understand each other perfectly—including the shadows.'
  }
};

// =============================================================================
// MERCURY SYNASTRY (COMMUNICATION)
// =============================================================================

export const MERCURY_ASPECTS = {
  'Mercury-Mercury': {
    conjunction: {
      type: 'mental_sync',
      description: 'Think alike—finish each other\'s sentences',
      communication: 'Easy, flowing conversation; similar thought processes',
      challenge: 'May share blind spots in thinking',
      lunaInsight: 'Your minds dance together. Remember that different perspectives also have value.'
    },
    opposition: {
      type: 'mental_complement',
      description: 'Different thinking styles that can enlighten or frustrate',
      communication: 'Stimulating debates; must work to understand each other',
      challenge: 'May talk past each other',
      lunaInsight: 'You think in different languages. Translation requires patience.'
    },
    square: {
      type: 'mental_friction',
      description: 'Thinking patterns clash; miscommunication likely',
      communication: 'Need extra effort to be understood',
      challenge: 'Arguments about trivial things; frustration in daily communication',
      lunaInsight: 'Your words collide. Slow down. Ask what they mean, not what you heard.'
    }
  },
  'Mercury-Venus': {
    conjunction: {
      type: 'sweet_communication',
      description: 'Loving, harmonious verbal exchange',
      communication: 'Words of affirmation flow naturally',
      dynamic: 'Mercury person knows how to please Venus person',
      lunaInsight: 'You speak love to each other. Let your words be as careful as they are sweet.'
    },
    square: {
      type: 'love_language_clash',
      description: 'How you communicate love differs from how they receive it',
      communication: 'Effort needed to express affection in ways partner understands',
      dynamic: 'Good intentions lost in translation',
      lunaInsight: 'Learn their love language. Your native tongue is not theirs.'
    }
  },
  'Mercury-Mars': {
    conjunction: {
      type: 'stimulating_debate',
      description: 'Mentally stimulating, possibly argumentative',
      communication: 'Lively exchange; Mars energizes Mercury\'s ideas',
      dynamic: 'Can inspire or compete',
      lunaInsight: 'Your words spark fire. Use that energy to build, not burn.'
    },
    square: {
      type: 'verbal_combat',
      description: 'Words become weapons; arguments escalate easily',
      communication: 'Mars attacks; Mercury intellectualizes defense',
      dynamic: 'Need conscious effort to discuss without fighting',
      lunaInsight: 'Your conversations become battlefields. Call a truce before speaking.'
    }
  }
};

// =============================================================================
// CHIRON SYNASTRY (WOUND & HEALING)
// =============================================================================

export const CHIRON_ASPECTS = {
  'Chiron-Sun': {
    conjunction: {
      wound: 'Chiron person\'s wound around identity is activated by Sun person',
      healing: 'Sun person can help Chiron person heal their sense of self',
      dynamic: 'Sun person may unintentionally trigger deep wounds',
      gift: 'Through the pain, Chiron person can reclaim their authentic identity',
      lunaInsight: 'They shine light on your deepest wound. This is painful—and it is medicine.'
    },
    opposition: {
      wound: 'Each reflects the other\'s wounded self back to them',
      healing: 'Can heal by accepting the reflection without defense',
      dynamic: 'May feel like the other "sees through" all defenses',
      gift: 'Mutual healing through witnessing each other\'s vulnerability',
      lunaInsight: 'You are each other\'s wounded healers. What you cannot face in yourself, you see in them.'
    }
  },
  'Chiron-Moon': {
    conjunction: {
      wound: 'Chiron person\'s emotional wounds are touched by Moon person',
      healing: 'Moon person\'s nurturing can heal old emotional pain',
      dynamic: 'Deep vulnerability but also potential for deep healing',
      gift: 'Learning to receive care despite old wounds that said you were unworthy',
      lunaInsight: 'Their love touches the place you protected most fiercely. Let them in slowly.'
    },
    opposition: {
      wound: 'Emotional needs trigger each other\'s wounds',
      healing: 'Can teach each other new ways of receiving care',
      dynamic: 'What one needs, the other fears giving',
      gift: 'Breaking generational patterns of emotional withholding',
      lunaInsight: 'You wound each other where you were first wounded. This is not cruelty—it is karma seeking resolution.'
    }
  },
  'Chiron-Venus': {
    conjunction: {
      wound: 'Chiron person\'s wounds around love and worth are activated',
      healing: 'Venus person can help heal beliefs of unlovability',
      dynamic: 'Venus person represents everything Chiron person fears wanting',
      gift: 'Learning to receive love despite feeling undeserving',
      lunaInsight: 'They love the part of you that you believed was unlovable. This is terrifying. This is healing.'
    },
    square: {
      wound: 'Love itself feels wounding; receiving affection triggers pain',
      healing: 'Must work through old patterns to accept love',
      dynamic: 'The more Venus gives, the more Chiron may withdraw',
      gift: 'Transforming the relationship with self-worth',
      lunaInsight: 'Every "I love you" touches an old wound. Healing means staying present anyway.'
    }
  },
  'Chiron-Chiron': {
    conjunction: {
      wound: 'Same wound—you understand each other\'s pain intimately',
      healing: 'Can support each other because you truly understand',
      dynamic: 'Shared pain can bond deeply or become codependent',
      gift: 'Healing together what neither could heal alone',
      lunaInsight: 'You carry the same wound. Do not compare your pain—share your healing.'
    },
    opposition: {
      wound: 'Different wounds that require different medicine',
      healing: 'Can teach each other approaches you would never discover alone',
      dynamic: 'What heals one may confuse the other',
      gift: 'Expanding the repertoire of healing',
      lunaInsight: 'Your wounds are opposite—your healing must be shared.'
    }
  }
};

// =============================================================================
// VERTEX SYNASTRY (FATED MEETINGS)
// =============================================================================

export const VERTEX_ASPECTS = {
  'Vertex-Sun': {
    type: 'fated_identity_meeting',
    intensity: 'very_high',
    meaning: 'This person was destined to impact how you see yourself',
    experience: 'Feels like a significant, fateful encounter',
    lunaInsight: 'They appeared at a destined moment to change who you are becoming.'
  },
  'Vertex-Moon': {
    type: 'fated_emotional_meeting',
    intensity: 'very_high',
    meaning: 'Destined to impact your emotional development',
    experience: 'Immediate emotional recognition or impact',
    lunaInsight: 'Your souls scheduled this meeting before you were born.'
  },
  'Vertex-Venus': {
    type: 'fated_love_meeting',
    intensity: 'very_high',
    meaning: 'Destined to teach you about love',
    experience: 'Love at first sight or instant significant connection',
    lunaInsight: 'This love was written in the stars before either of you could read.'
  },
  'Vertex-Mars': {
    type: 'fated_action_meeting',
    intensity: 'high',
    meaning: 'Destined to activate your will and desire',
    experience: 'Meeting sparked significant action or change',
    lunaInsight: 'They appeared to awaken something in you that was sleeping.'
  },
  'Vertex-Ascendant': {
    type: 'fated_path_crossing',
    intensity: 'very_high',
    meaning: 'Your life paths were meant to intersect',
    experience: 'Feels like destiny—"meant to meet" energy',
    lunaInsight: 'Your paths crossed at the exact point fate intended.'
  },
  'Vertex-Vertex': {
    type: 'double_destiny',
    intensity: 'extremely_high',
    meaning: 'Both fated to impact each other significantly',
    experience: 'Mutual recognition of significance; profound destined feeling',
    lunaInsight: 'You are each other\'s destiny point. This meeting was inevitable.'
  }
};

// =============================================================================
// JUNO SYNASTRY (COMMITMENT & MARRIAGE)
// =============================================================================

export const JUNO_ASPECTS = {
  'Juno-Sun': {
    type: 'identity_commitment',
    meaning: 'Juno person sees Sun person as ideal partner material',
    dynamic: 'Sun person embodies what Juno person seeks in commitment',
    marriage: 'Strong indicator of potential for lasting commitment',
    lunaInsight: 'They are what you imagined partnership could be.'
  },
  'Juno-Moon': {
    type: 'emotional_commitment',
    meaning: 'Deep emotional security in the commitment',
    dynamic: 'Juno person feels emotionally safe with Moon person',
    marriage: 'Indicates emotional foundation for lasting union',
    lunaInsight: 'With them, commitment feels like coming home.'
  },
  'Juno-Venus': {
    type: 'love_commitment',
    meaning: 'What you seek in commitment aligns with what they offer in love',
    dynamic: 'Harmony between commitment needs and love expression',
    marriage: 'One of the strongest indicators for marriage potential',
    lunaInsight: 'Love and commitment speak the same language here.'
  },
  'Juno-Mars': {
    type: 'passionate_commitment',
    meaning: 'Desire and commitment intertwined',
    dynamic: 'Passion supports rather than undermines commitment',
    marriage: 'Indicates lasting physical connection within commitment',
    lunaInsight: 'Your passion has the potential to last because it is rooted in commitment.'
  },
  'Juno-Juno': {
    type: 'mutual_commitment',
    meaning: 'Shared vision of what partnership should look like',
    dynamic: 'Aligned expectations about marriage and commitment',
    marriage: 'Strong indicator—you want the same kind of partnership',
    lunaInsight: 'You dream the same dream of partnership. Build it together.'
  },
  'Juno-Saturn': {
    type: 'serious_commitment',
    meaning: 'Commitment is taken very seriously—possibly too seriously',
    dynamic: 'Responsibility and duty in partnership',
    marriage: 'May feel obligated; needs conscious joy cultivation',
    lunaInsight: 'Your commitment is real and serious. Do not forget to enjoy each other.'
  },
  'Juno-Node': {
    type: 'destined_commitment',
    meaning: 'Commitment is linked to soul evolution',
    dynamic: 'Partnership supports spiritual growth',
    marriage: 'This relationship is meant to help you evolve',
    lunaInsight: 'Your commitment to each other is a commitment to your own becoming.'
  }
};

// =============================================================================
// HOUSE OVERLAYS (WHERE THEIR PLANETS FALL IN YOUR HOUSES)
// =============================================================================

export const HOUSE_OVERLAYS = {
  1: {
    name: 'First House Overlay',
    meaning: 'Their planet becomes part of your identity',
    sun: 'They light up your sense of self; you feel more "you" with them',
    moon: 'Their emotions affect how you see yourself',
    venus: 'They beautify your self-image; you feel attractive around them',
    mars: 'They activate your assertiveness; you feel energized',
    lunaInsight: 'What they bring lands directly on who you are.'
  },
  4: {
    name: 'Fourth House Overlay',
    meaning: 'Their planet affects your sense of home and emotional foundation',
    sun: 'They feel like home; you can be your private self with them',
    moon: 'Deep emotional connection; feels like family',
    venus: 'Love feels domestic and secure',
    mars: 'May stir up family patterns or create home together',
    lunaInsight: 'They touch the roots of your being.'
  },
  5: {
    name: 'Fifth House Overlay',
    meaning: 'Their planet affects your creativity, romance, and joy',
    sun: 'They inspire your creativity; romantic excitement',
    moon: 'Emotional connection through play and romance',
    venus: 'Romantic, pleasurable, flirtatious connection',
    mars: 'Passionate, exciting, possibly competitive romance',
    lunaInsight: 'They remind you how to play and create.'
  },
  7: {
    name: 'Seventh House Overlay',
    meaning: 'Their planet directly affects partnership dynamics',
    sun: 'They are naturally positioned as partner',
    moon: 'Emotional partnership needs met',
    venus: 'Natural romantic partnership energy',
    mars: 'Passionate partner but watch for conflict',
    lunaInsight: 'They arrived in the part of your chart that was waiting for a partner.'
  },
  8: {
    name: 'Eighth House Overlay',
    meaning: 'Their planet affects intimacy, transformation, shared resources',
    sun: 'Intense connection; they illuminate your depths',
    moon: 'Deep emotional intimacy; transformative bond',
    venus: 'Passionate, possessive love; financial entanglement',
    mars: 'Intense sexual connection; power dynamics',
    lunaInsight: 'They reach the places you hide from everyone else.'
  },
  12: {
    name: 'Twelfth House Overlay',
    meaning: 'Their planet affects your unconscious, spirituality, hidden self',
    sun: 'They see your hidden self; spiritual connection',
    moon: 'Deep, psychic, possibly confusing emotional bond',
    venus: 'Secret love; karmic romantic connection',
    mars: 'Hidden anger or unconscious desire',
    lunaInsight: 'They touch what you yourself cannot see.'
  }
};

// =============================================================================
// ASPECT PATTERN RECOGNITION
// =============================================================================

/**
 * Detect significant synastry aspect patterns
 */
export function detectSynastryPatterns(aspects) {
  if (!aspects || !Array.isArray(aspects)) return [];

  const patterns = [];

  // Count contacts by type
  const counts = {
    venusMarş: 0,
    sunMoon: 0,
    moonMoon: 0,
    chiron: 0,
    saturn: 0,
    pluto: 0,
    nodes: 0,
    vertex: 0,
    juno: 0
  };

  for (const aspect of aspects) {
    const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
    const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();

    if ((p1.includes('venus') && p2.includes('mars')) ||
        (p1.includes('mars') && p2.includes('venus'))) {
      counts.venusMars++;
    }
    if ((p1.includes('sun') && p2.includes('moon')) ||
        (p1.includes('moon') && p2.includes('sun'))) {
      counts.sunMoon++;
    }
    if (p1.includes('moon') && p2.includes('moon')) {
      counts.moonMoon++;
    }
    if (p1.includes('chiron') || p2.includes('chiron')) {
      counts.chiron++;
    }
    if (p1.includes('saturn') || p2.includes('saturn')) {
      counts.saturn++;
    }
    if (p1.includes('pluto') || p2.includes('pluto')) {
      counts.pluto++;
    }
    if (p1.includes('node') || p2.includes('node')) {
      counts.nodes++;
    }
    if (p1.includes('vertex') || p2.includes('vertex')) {
      counts.vertex++;
    }
    if (p1.includes('juno') || p2.includes('juno')) {
      counts.juno++;
    }
  }

  // Detect patterns
  if (counts.venusMars >= 2) {
    patterns.push({
      name: 'High Chemistry Bond',
      description: 'Multiple Venus-Mars contacts indicate strong physical attraction',
      significance: 'Passion is a major theme in this relationship'
    });
  }

  if (counts.sunMoon >= 2) {
    patterns.push({
      name: 'Soul Mate Configuration',
      description: 'Multiple Sun-Moon contacts indicate deep compatibility',
      significance: 'This is one of the classic "soul mate" patterns'
    });
  }

  if (counts.chiron >= 3) {
    patterns.push({
      name: 'Healing Partnership',
      description: 'Multiple Chiron contacts indicate relationship focused on healing',
      significance: 'You came together to heal old wounds'
    });
  }

  if (counts.saturn >= 3 && counts.pluto >= 2) {
    patterns.push({
      name: 'Karmic Intensive',
      description: 'Heavy Saturn and Pluto contacts indicate serious karmic bond',
      significance: 'This relationship has unfinished business from before'
    });
  }

  if (counts.vertex >= 1 && counts.nodes >= 2) {
    patterns.push({
      name: 'Fated Union',
      description: 'Vertex and nodal contacts indicate destined meeting',
      significance: 'This meeting was written in your charts'
    });
  }

  if (counts.juno >= 2) {
    patterns.push({
      name: 'Marriage Potential',
      description: 'Multiple Juno contacts indicate strong marriage compatibility',
      significance: 'Partnership and commitment are supported by the stars'
    });
  }

  return patterns;
}

// =============================================================================
// MAIN ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Analyze Venus-Mars dynamics in synastry
 */
export function analyzeAttractionDynamics(aspects) {
  const venusMarsAspects = aspects.filter(a => {
    const p1 = (a.p1 || a.planet1 || '').toLowerCase();
    const p2 = (a.p2 || a.planet2 || '').toLowerCase();
    return (p1.includes('venus') && p2.includes('mars')) ||
           (p1.includes('mars') && p2.includes('venus'));
  });

  if (venusMarsAspects.length === 0) {
    return {
      present: false,
      chemistry: 'Attraction may develop through other factors',
      lunaInsight: 'The spark between you is subtle. Look to other connections for bonding.'
    };
  }

  const analysis = venusMarsAspects.map(aspect => {
    const type = (aspect.type || aspect.aspectType || '').toLowerCase();
    const interpretation = VENUS_MARS_ASPECTS[type];
    return {
      aspect: `${aspect.p1 || aspect.planet1}-${aspect.p2 || aspect.planet2}`,
      type,
      orb: aspect.orb,
      ...interpretation
    };
  });

  return {
    present: true,
    aspectCount: venusMarsAspects.length,
    analysis,
    overallChemistry: venusMarsAspects.length >= 2 ? 'High' : 'Moderate',
    lunaInsight: analysis[0]?.lunaInsight || 'Attraction flows between you in ways worth exploring.'
  };
}

/**
 * Analyze emotional compatibility
 */
export function analyzeEmotionalCompatibility(aspects, chartA, chartB) {
  const sunMoonAspects = aspects.filter(a => {
    const p1 = (a.p1 || a.planet1 || '').toLowerCase();
    const p2 = (a.p2 || a.planet2 || '').toLowerCase();
    return (p1.includes('sun') && p2.includes('moon')) ||
           (p1.includes('moon') && p2.includes('sun'));
  });

  const moonMoonAspects = aspects.filter(a => {
    const p1 = (a.p1 || a.planet1 || '').toLowerCase();
    const p2 = (a.p2 || a.planet2 || '').toLowerCase();
    return p1.includes('moon') && p2.includes('moon');
  });

  const analysis = {
    sunMoon: [],
    moonMoon: [],
    overallCompatibility: 'Moderate',
    emotionalLanguage: 'Different'
  };

  // Analyze Sun-Moon
  sunMoonAspects.forEach(aspect => {
    const type = (aspect.type || aspect.aspectType || '').toLowerCase();
    const interpretation = SUN_MOON_ASPECTS[type];
    if (interpretation) {
      analysis.sunMoon.push({
        aspect: `${aspect.p1 || aspect.planet1}-${aspect.p2 || aspect.planet2}`,
        type,
        ...interpretation
      });
    }
  });

  // Analyze Moon-Moon
  moonMoonAspects.forEach(aspect => {
    const type = (aspect.type || aspect.aspectType || '').toLowerCase();
    const interpretation = MOON_MOON_ASPECTS[type];
    if (interpretation) {
      analysis.moonMoon.push({
        aspect: `${aspect.p1 || aspect.planet1}-${aspect.p2 || aspect.planet2}`,
        type,
        ...interpretation
      });
    }
  });

  // Check for same Moon sign
  const moonA = chartA?.moon?.sign || chartA?.planets?.Moon?.sign;
  const moonB = chartB?.moon?.sign || chartB?.planets?.Moon?.sign;

  if (moonA && moonB && moonA === moonB) {
    analysis.sameMoonSign = true;
    analysis.moonMoon.push({
      type: 'same_sign',
      ...MOON_MOON_ASPECTS.same_sign
    });
  }

  // Determine overall compatibility
  const hasHarmonious = [...analysis.sunMoon, ...analysis.moonMoon]
    .some(a => ['conjunction', 'trine', 'sextile', 'same_sign'].includes(a.type));
  const hasChallenging = [...analysis.sunMoon, ...analysis.moonMoon]
    .some(a => ['square', 'opposition'].includes(a.type));

  if (hasHarmonious && !hasChallenging) {
    analysis.overallCompatibility = 'High';
    analysis.emotionalLanguage = 'Similar';
  } else if (hasChallenging && !hasHarmonious) {
    analysis.overallCompatibility = 'Challenging';
    analysis.emotionalLanguage = 'Different';
  } else if (hasHarmonious && hasChallenging) {
    analysis.overallCompatibility = 'Growth-oriented';
    analysis.emotionalLanguage = 'Complementary';
  }

  analysis.lunaInsight = analysis.overallCompatibility === 'High'
    ? 'Your hearts speak the same language. This is a gift—tend it.'
    : analysis.overallCompatibility === 'Challenging'
      ? 'Your emotional natures require translation. The effort is worth it.'
      : 'Your emotions dance between harmony and growth. Both are needed.';

  return analysis;
}

/**
 * Analyze healing potential
 */
export function analyzeHealingPotential(aspects) {
  const chironAspects = aspects.filter(a => {
    const p1 = (a.p1 || a.planet1 || '').toLowerCase();
    const p2 = (a.p2 || a.planet2 || '').toLowerCase();
    return p1.includes('chiron') || p2.includes('chiron');
  });

  if (chironAspects.length === 0) {
    return {
      present: false,
      healingTheme: 'Healing is not a primary theme of this relationship',
      lunaInsight: 'Your wounds are private here. This may be a rest from healing.'
    };
  }

  const wounds = [];

  chironAspects.forEach(aspect => {
    const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
    const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();
    const type = (aspect.type || aspect.aspectType || '').toLowerCase();

    // Determine which planet Chiron contacts
    const otherPlanet = p1.includes('chiron') ? p2 : p1;
    const key = `Chiron-${otherPlanet.charAt(0).toUpperCase() + otherPlanet.slice(1)}`;

    const chironCategory = CHIRON_ASPECTS[key];
    if (chironCategory) {
      const interpretation = chironCategory[type] || chironCategory.conjunction;
      if (interpretation) {
        wounds.push({
          contact: `${aspect.p1 || aspect.planet1}-${aspect.p2 || aspect.planet2}`,
          type,
          ...interpretation
        });
      }
    }
  });

  return {
    present: true,
    woundCount: wounds.length,
    wounds,
    healingTheme: wounds.length >= 3
      ? 'This is a relationship centered on healing'
      : 'Healing is an important but not dominant theme',
    lunaInsight: wounds[0]?.lunaInsight || 'You have the potential to heal each other in ways no one else can.'
  };
}

/**
 * Analyze commitment indicators
 */
export function analyzeCommitmentIndicators(aspects) {
  const junoAspects = aspects.filter(a => {
    const p1 = (a.p1 || a.planet1 || '').toLowerCase();
    const p2 = (a.p2 || a.planet2 || '').toLowerCase();
    return p1.includes('juno') || p2.includes('juno');
  });

  const analysis = {
    indicators: [],
    marriagePotential: 'Moderate',
    commitmentStyle: 'Standard'
  };

  junoAspects.forEach(aspect => {
    const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
    const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();

    const otherPlanet = p1.includes('juno') ? p2 : p1;
    const key = `Juno-${otherPlanet.charAt(0).toUpperCase() + otherPlanet.slice(1)}`;

    const interpretation = JUNO_ASPECTS[key];
    if (interpretation) {
      analysis.indicators.push({
        contact: `${aspect.p1 || aspect.planet1}-${aspect.p2 || aspect.planet2}`,
        ...interpretation
      });
    }
  });

  // Special: Juno-Venus or Juno-Node is very strong
  const hasJunoVenus = analysis.indicators.some(i => i.type === 'love_commitment');
  const hasJunoNode = analysis.indicators.some(i => i.type === 'destined_commitment');

  if (hasJunoVenus || hasJunoNode) {
    analysis.marriagePotential = 'High';
    analysis.commitmentStyle = hasJunoNode ? 'Destined' : 'Loving';
  } else if (analysis.indicators.length >= 2) {
    analysis.marriagePotential = 'Above Average';
  }

  analysis.lunaInsight = analysis.marriagePotential === 'High'
    ? 'The stars support lasting commitment between you.'
    : 'Commitment is possible but depends more on choice than destiny here.';

  return analysis;
}

/**
 * Build complete extended synastry analysis
 */
export function buildExtendedSynastryAnalysis(chartA, chartB, synastryAspects) {
  return {
    generated: new Date().toISOString(),

    attraction: analyzeAttractionDynamics(synastryAspects),
    emotional: analyzeEmotionalCompatibility(synastryAspects, chartA, chartB),
    healing: analyzeHealingPotential(synastryAspects),
    commitment: analyzeCommitmentIndicators(synastryAspects),
    patterns: detectSynastryPatterns(synastryAspects),

    lunaOverview: generateLunaOverview(synastryAspects, chartA, chartB)
  };
}

/**
 * Generate Luna's overview of the extended synastry
 */
function generateLunaOverview(aspects, chartA, chartB) {
  const attraction = analyzeAttractionDynamics(aspects);
  const emotional = analyzeEmotionalCompatibility(aspects, chartA, chartB);
  const healing = analyzeHealingPotential(aspects);

  let overview = [];

  if (attraction.present && attraction.aspectCount >= 2) {
    overview.push('There is undeniable chemistry between you—the kind that pulls like gravity.');
  }

  if (emotional.overallCompatibility === 'High') {
    overview.push('Your emotional natures understand each other at a deep level.');
  } else if (emotional.overallCompatibility === 'Challenging') {
    overview.push('Your emotional natures speak different languages—but translation is possible with patience.');
  }

  if (healing.present && healing.woundCount >= 2) {
    overview.push('You have come together, in part, to heal each other\'s oldest wounds.');
  }

  overview.push('Every relationship is a teacher. What will you learn from each other?');

  return {
    paragraphs: overview,
    closing: 'The stars reveal potential. Your choices create reality.'
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Analysis functions
  analyzeAttractionDynamics,
  analyzeEmotionalCompatibility,
  analyzeHealingPotential,
  analyzeCommitmentIndicators,
  detectSynastryPatterns,
  buildExtendedSynastryAnalysis,

  // Data exports
  VENUS_MARS_ASPECTS,
  SUN_MOON_ASPECTS,
  MOON_MOON_ASPECTS,
  MERCURY_ASPECTS,
  CHIRON_ASPECTS,
  VERTEX_ASPECTS,
  JUNO_ASPECTS,
  HOUSE_OVERLAYS
};
