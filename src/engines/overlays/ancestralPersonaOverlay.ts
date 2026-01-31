/**
 * Ancestral Persona Overlay
 *
 * The lineage voice - Luna speaking as the lineage.
 * Integrates family constellations, generational patterns,
 * lunar ancestry, mythic lineage voice, and emotional inheritance.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface AncestralPersonaInput {
  moonSign: string;
  moonHouse?: number;
  fourthHouseSign?: string;
  fourthHouseRuler?: string;
  familyPatternScore: number;  // 0..1 - strength of family patterns
  nodeSouthSign?: string;      // Past life/ancestral karma
  saturnSign?: string;         // Karmic lessons
}

export interface AncestralPersonaOverlayResult {
  lineageArchetype: LineageArchetype;
  ancestralVoice: AncestralVoice;
  ancestralMessage: string;
  ancestralDelta: number;
  inheritedPatterns: InheritedPattern[];
  healingOpportunities: string[];
  lineageGifts: string[];
  narrative: string;
  emotionalInheritance: EmotionalInheritance;
}

export type LineageArchetype =
  | 'The Nurturers'        // Cancer/Moon emphasis
  | 'The Protectors'       // Scorpio/Pluto emphasis
  | 'The Achievers'        // Capricorn/Saturn emphasis
  | 'The Seekers'          // Sagittarius/Jupiter emphasis
  | 'The Healers'          // Virgo/Chiron emphasis
  | 'The Artists'          // Pisces/Neptune emphasis
  | 'The Warriors'         // Aries/Mars emphasis
  | 'The Stabilizers'      // Taurus/Venus emphasis
  | 'The Communicators'    // Gemini/Mercury emphasis
  | 'The Balancers'        // Libra/Venus emphasis
  | 'The Innovators'       // Aquarius/Uranus emphasis
  | 'The Rulers';          // Leo/Sun emphasis

export interface AncestralVoice {
  tone: 'warm' | 'wise' | 'stern' | 'protective' | 'encouraging' | 'mysterious';
  primaryMessage: string;
  blessing: string;
  warning: string;
}

export interface InheritedPattern {
  name: string;
  type: 'gift' | 'wound' | 'lesson' | 'fear';
  description: string;
  healingPath: string;
}

export interface EmotionalInheritance {
  primaryEmotion: string;
  secondaryEmotions: string[];
  bodyArea: string;
  releaseMethod: string;
}

// ========================================
// LINEAGE ARCHETYPES
// ========================================

const MOON_SIGN_LINEAGES: Record<string, {
  archetype: LineageArchetype;
  voice: AncestralVoice;
  patterns: InheritedPattern[];
  gifts: string[];
  emotionalInheritance: EmotionalInheritance;
}> = {
  Aries: {
    archetype: 'The Warriors',
    voice: {
      tone: 'encouraging',
      primaryMessage: 'We fought so you could choose. Your courage is our continuation.',
      blessing: 'May your fire burn without consuming.',
      warning: 'Remember—the true battle is within.'
    },
    patterns: [
      { name: 'Survival Drive', type: 'gift', description: 'Ability to fight for survival', healingPath: 'Channel into creation, not destruction' },
      { name: 'Unprocessed Anger', type: 'wound', description: 'Rage passed down unexpressed', healingPath: 'Healthy anger expression and physical release' }
    ],
    gifts: ['Courage', 'Initiative', 'Protective instincts', 'Resilience'],
    emotionalInheritance: {
      primaryEmotion: 'Anger',
      secondaryEmotions: ['Frustration', 'Impatience', 'Passion'],
      bodyArea: 'Head and jaw',
      releaseMethod: 'Physical movement and vocal expression'
    }
  },
  Taurus: {
    archetype: 'The Stabilizers',
    voice: {
      tone: 'warm',
      primaryMessage: 'We built what endures. Your roots are our legacy.',
      blessing: 'May you always have enough, and know it.',
      warning: 'Do not let possessions possess you.'
    },
    patterns: [
      { name: 'Material Security', type: 'gift', description: 'Ability to create material stability', healingPath: 'Expand definition of security beyond material' },
      { name: 'Scarcity Fear', type: 'fear', description: 'Deep fear of not having enough', healingPath: 'Practice abundance mindset and generosity' }
    ],
    gifts: ['Steadfastness', 'Sensory wisdom', 'Building capacity', 'Patience'],
    emotionalInheritance: {
      primaryEmotion: 'Fear of loss',
      secondaryEmotions: ['Stubbornness', 'Comfort-seeking', 'Loyalty'],
      bodyArea: 'Throat and neck',
      releaseMethod: 'Singing, bodywork, and grounding practices'
    }
  },
  Gemini: {
    archetype: 'The Communicators',
    voice: {
      tone: 'wise',
      primaryMessage: 'We carried stories across generations. Your words are our echoes.',
      blessing: 'May your curiosity never dim.',
      warning: 'Words can heal or wound—choose wisely.'
    },
    patterns: [
      { name: 'Story Carrying', type: 'gift', description: 'Ability to preserve and transmit wisdom', healingPath: 'Distinguish family stories from your own truth' },
      { name: 'Nervous Energy', type: 'wound', description: 'Anxiety passed through generations', healingPath: 'Grounding and mindfulness practices' }
    ],
    gifts: ['Adaptability', 'Communication skills', 'Curiosity', 'Mental agility'],
    emotionalInheritance: {
      primaryEmotion: 'Anxiety',
      secondaryEmotions: ['Restlessness', 'Curiosity', 'Scattered focus'],
      bodyArea: 'Hands and lungs',
      releaseMethod: 'Writing, talking, and breath work'
    }
  },
  Cancer: {
    archetype: 'The Nurturers',
    voice: {
      tone: 'warm',
      primaryMessage: 'We held the hearth through all storms. Your home is our haven.',
      blessing: 'May you nurture and be nurtured.',
      warning: 'Do not drown in others\' needs—save something for yourself.'
    },
    patterns: [
      { name: 'Deep Nurturing', type: 'gift', description: 'Instinctive ability to care and protect', healingPath: 'Include self in the circle of care' },
      { name: 'Boundary Confusion', type: 'wound', description: 'Difficulty knowing where self ends and other begins', healingPath: 'Practice healthy boundaries with love' }
    ],
    gifts: ['Emotional intelligence', 'Nurturing instincts', 'Memory keeping', 'Home-making'],
    emotionalInheritance: {
      primaryEmotion: 'Protective love',
      secondaryEmotions: ['Fear of abandonment', 'Nostalgia', 'Moodiness'],
      bodyArea: 'Chest and stomach',
      releaseMethod: 'Water, cooking, and holding/being held'
    }
  },
  Leo: {
    archetype: 'The Rulers',
    voice: {
      tone: 'encouraging',
      primaryMessage: 'We shone so you could be seen. Your light is our pride.',
      blessing: 'May you lead with heart, not ego.',
      warning: 'Remember—the sun also nourishes from behind clouds.'
    },
    patterns: [
      { name: 'Radiant Presence', type: 'gift', description: 'Natural capacity to inspire and lead', healingPath: 'Lead through service, not just charisma' },
      { name: 'Pride Wound', type: 'wound', description: 'Shame hidden behind confidence', healingPath: 'Practice vulnerability and receive praise gracefully' }
    ],
    gifts: ['Leadership', 'Generosity', 'Creativity', 'Warmth'],
    emotionalInheritance: {
      primaryEmotion: 'Pride',
      secondaryEmotions: ['Need for recognition', 'Generosity', 'Drama'],
      bodyArea: 'Heart and back',
      releaseMethod: 'Creative expression and celebration'
    }
  },
  Virgo: {
    archetype: 'The Healers',
    voice: {
      tone: 'wise',
      primaryMessage: 'We served so the whole could be well. Your healing is our hope.',
      blessing: 'May your service bring you peace.',
      warning: 'Perfection is a horizon—walk toward it, but rest along the way.'
    },
    patterns: [
      { name: 'Healing Hands', type: 'gift', description: 'Natural capacity to analyze and heal', healingPath: 'Turn the healing eye inward with compassion' },
      { name: 'Critical Voice', type: 'wound', description: 'Inner critic passed down', healingPath: 'Transform criticism into discernment' }
    ],
    gifts: ['Discernment', 'Service orientation', 'Practical wisdom', 'Healing ability'],
    emotionalInheritance: {
      primaryEmotion: 'Worry',
      secondaryEmotions: ['Self-criticism', 'Helpfulness', 'Perfectionism'],
      bodyArea: 'Digestive system',
      releaseMethod: 'Useful work and organizing'
    }
  },
  Libra: {
    archetype: 'The Balancers',
    voice: {
      tone: 'warm',
      primaryMessage: 'We sought harmony so you could know peace. Your balance is our beauty.',
      blessing: 'May you find equilibrium in all things.',
      warning: 'Do not lose yourself in the pursuit of peace.'
    },
    patterns: [
      { name: 'Harmony Making', type: 'gift', description: 'Natural ability to create balance and beauty', healingPath: 'Include your own needs in the balance' },
      { name: 'Conflict Avoidance', type: 'wound', description: 'Fear of disharmony at cost of truth', healingPath: 'Practice constructive conflict' }
    ],
    gifts: ['Diplomacy', 'Aesthetic sense', 'Partnership skills', 'Justice orientation'],
    emotionalInheritance: {
      primaryEmotion: 'Need for approval',
      secondaryEmotions: ['Indecision', 'Peacemaking', 'Codependency'],
      bodyArea: 'Kidneys and lower back',
      releaseMethod: 'Beauty, art, and balanced movement'
    }
  },
  Scorpio: {
    archetype: 'The Protectors',
    voice: {
      tone: 'protective',
      primaryMessage: 'We guarded secrets and survived betrayal. Your depth is our power.',
      blessing: 'May you transform all wounds into wisdom.',
      warning: 'Not all secrets need keeping—some need releasing.'
    },
    patterns: [
      { name: 'Deep Loyalty', type: 'gift', description: 'Fierce protection of those loved', healingPath: 'Extend trust gradually to those who earn it' },
      { name: 'Betrayal Wound', type: 'wound', description: 'Deep hurt from broken trust passed down', healingPath: 'Heal through witnessing and release' }
    ],
    gifts: ['Depth', 'Transformation ability', 'Loyalty', 'Psychological insight'],
    emotionalInheritance: {
      primaryEmotion: 'Intensity',
      secondaryEmotions: ['Jealousy', 'Suspicion', 'Passion'],
      bodyArea: 'Reproductive organs and pelvis',
      releaseMethod: 'Deep emotional processing and intimacy'
    }
  },
  Sagittarius: {
    archetype: 'The Seekers',
    voice: {
      tone: 'encouraging',
      primaryMessage: 'We sought meaning across horizons. Your truth is our adventure.',
      blessing: 'May your search always bring you home.',
      warning: 'The horizon moves as you approach—do not forget to arrive.'
    },
    patterns: [
      { name: 'Truth Seeking', type: 'gift', description: 'Relentless pursuit of meaning', healingPath: 'Find truth in ordinary moments too' },
      { name: 'Commitment Fear', type: 'fear', description: 'Fear of being trapped', healingPath: 'See commitment as freedom differently expressed' }
    ],
    gifts: ['Optimism', 'Wisdom', 'Teaching ability', 'Adventure spirit'],
    emotionalInheritance: {
      primaryEmotion: 'Restlessness',
      secondaryEmotions: ['Optimism', 'Avoidance', 'Inspiration'],
      bodyArea: 'Hips and thighs',
      releaseMethod: 'Travel, learning, and outdoor movement'
    }
  },
  Capricorn: {
    archetype: 'The Achievers',
    voice: {
      tone: 'stern',
      primaryMessage: 'We climbed so you could stand higher. Your achievement is our legacy.',
      blessing: 'May your success nourish your soul, not just your status.',
      warning: 'The summit is lonely—bring companions for the climb.'
    },
    patterns: [
      { name: 'Achievement Drive', type: 'gift', description: 'Capacity for sustained effort toward goals', healingPath: 'Define success beyond external measures' },
      { name: 'Emotional Suppression', type: 'wound', description: 'Feelings hidden for sake of duty', healingPath: 'Allow vulnerability while maintaining strength' }
    ],
    gifts: ['Determination', 'Responsibility', 'Maturity', 'Structure creation'],
    emotionalInheritance: {
      primaryEmotion: 'Duty',
      secondaryEmotions: ['Depression', 'Stoicism', 'Ambition'],
      bodyArea: 'Bones and knees',
      releaseMethod: 'Achievement and structured rest'
    }
  },
  Aquarius: {
    archetype: 'The Innovators',
    voice: {
      tone: 'wise',
      primaryMessage: 'We dreamed of better worlds. Your vision is our revolution.',
      blessing: 'May you change the world without losing your heart.',
      warning: 'Humanity needs innovation—but also connection.'
    },
    patterns: [
      { name: 'Visionary Thinking', type: 'gift', description: 'Ability to see beyond current paradigms', healingPath: 'Ground visions in human relationship' },
      { name: 'Detachment Pattern', type: 'wound', description: 'Emotional distance used for protection', healingPath: 'Practice intimacy without losing self' }
    ],
    gifts: ['Innovation', 'Humanitarian vision', 'Independence', 'Original thinking'],
    emotionalInheritance: {
      primaryEmotion: 'Detachment',
      secondaryEmotions: ['Rebellion', 'Idealism', 'Eccentricity'],
      bodyArea: 'Ankles and circulation',
      releaseMethod: 'Community involvement and unique expression'
    }
  },
  Pisces: {
    archetype: 'The Artists',
    voice: {
      tone: 'mysterious',
      primaryMessage: 'We carried dreams from beyond the veil. Your imagination is our gift.',
      blessing: 'May you dissolve what needs dissolving and manifest what needs forming.',
      warning: 'The ocean of feeling has shores—sometimes you must return to land.'
    },
    patterns: [
      { name: 'Spiritual Sensitivity', type: 'gift', description: 'Connection to unseen realms', healingPath: 'Ground spiritual gifts in practical living' },
      { name: 'Boundary Dissolution', type: 'wound', description: 'Difficulty maintaining personal boundaries', healingPath: 'Practice containment without closing heart' }
    ],
    gifts: ['Compassion', 'Artistic ability', 'Intuition', 'Spiritual connection'],
    emotionalInheritance: {
      primaryEmotion: 'Empathy',
      secondaryEmotions: ['Escapism', 'Sacrifice', 'Transcendence'],
      bodyArea: 'Feet and immune system',
      releaseMethod: 'Art, water, and spiritual practice'
    }
  }
};

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute ancestral persona overlay from chart inputs
 */
export function computeAncestralPersonaOverlay(
  input: AncestralPersonaInput
): AncestralPersonaOverlayResult {
  // Get lineage info from Moon sign
  const lineageInfo = MOON_SIGN_LINEAGES[input.moonSign] ||
    MOON_SIGN_LINEAGES.Cancer; // Default to Cancer (Moon's home)

  const lineageArchetype = lineageInfo.archetype;
  const ancestralVoice = lineageInfo.voice;

  // Build inherited patterns
  const inheritedPatterns = [...lineageInfo.patterns];

  // Add South Node pattern if available
  if (input.nodeSouthSign) {
    const southNodeInfo = MOON_SIGN_LINEAGES[input.nodeSouthSign];
    if (southNodeInfo) {
      inheritedPatterns.push({
        name: 'Past Life Echo',
        type: 'lesson',
        description: `Karmic pattern from ${input.nodeSouthSign} past`,
        healingPath: southNodeInfo.patterns[0]?.healingPath || 'Integration through awareness'
      });
    }
  }

  // Calculate delta
  const ancestralDelta = (input.familyPatternScore - 0.5) * 0.05;

  // Build ancestral message
  const ancestralMessage = buildAncestralMessage(
    lineageArchetype,
    input.familyPatternScore,
    ancestralVoice
  );

  // Build healing opportunities
  const healingOpportunities = inheritedPatterns
    .filter(p => p.type === 'wound' || p.type === 'fear')
    .map(p => p.healingPath);

  // Get lineage gifts
  const lineageGifts = [...lineageInfo.gifts];

  // Build narrative
  const narrative = buildAncestralNarrative(
    lineageArchetype,
    ancestralVoice,
    inheritedPatterns,
    input
  );

  return {
    lineageArchetype,
    ancestralVoice,
    ancestralMessage,
    ancestralDelta,
    inheritedPatterns,
    healingOpportunities,
    lineageGifts,
    narrative,
    emotionalInheritance: lineageInfo.emotionalInheritance
  };
}

// ========================================
// NARRATIVE BUILDERS
// ========================================

function buildAncestralMessage(
  archetype: LineageArchetype,
  patternScore: number,
  voice: AncestralVoice
): string {
  if (patternScore > 0.7) {
    return `Your lineage speaks through the ${archetype}, offering guidance and emotional clarity. ` +
      voice.primaryMessage + ' ' + voice.blessing;
  }

  if (patternScore < 0.3) {
    return `Your lineage whispers caution through the ${archetype}, urging reflection. ` +
      voice.primaryMessage + ' ' + voice.warning;
  }

  return `Your lineage presence is subtle, carried by the ${archetype}. ` +
    voice.primaryMessage;
}

function buildAncestralNarrative(
  archetype: LineageArchetype,
  voice: AncestralVoice,
  patterns: InheritedPattern[],
  input: AncestralPersonaInput
): string {
  let narrative = `Your Moon in ${input.moonSign} carries the voice of ${archetype}. `;
  narrative += `Your ancestors speak with a ${voice.tone} tone: "${voice.primaryMessage}" `;

  const gifts = patterns.filter(p => p.type === 'gift');
  const wounds = patterns.filter(p => p.type === 'wound' || p.type === 'fear');

  if (gifts.length > 0) {
    narrative += `They pass down the gift of ${gifts[0].name.toLowerCase()}. `;
  }

  if (wounds.length > 0) {
    narrative += `They also carry the unhealed ${wounds[0].name.toLowerCase()}, asking you to transform it. `;
  }

  narrative += `In relationships, this lineage shapes how you nurture, protect, and connect.`;

  return narrative;
}

// ========================================
// PERSONA VOICES
// ========================================

export const AncestralPersonaVoices: Record<LineageArchetype, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'The Nurturers': {
    mentor: 'Your lineage held the hearth. Now you carry that warmth—share it, but save some for yourself.',
    oracle: 'The mothers and caretakers speak through you. Their love is your foundation.',
    companion: 'Your family line is all about caring for others. That\'s beautiful—just don\'t forget yourself.',
    mirror: 'Notice the caretaking in your blood. That nurturing is your lineage gift.'
  },
  'The Protectors': {
    mentor: 'Your lineage guarded secrets and survived depths. That intensity is your inheritance.',
    oracle: 'The guardians and survivors speak through you. Their vigilance is your power.',
    companion: 'Your family has been through a lot. That resilience lives in you.',
    mirror: 'Notice the protectiveness in your blood. That depth is your lineage gift.'
  },
  'The Achievers': {
    mentor: 'Your lineage climbed and built. That determination is your inheritance—use it wisely.',
    oracle: 'The builders and climbers speak through you. Their ambition is your foundation.',
    companion: 'Your family knows about working hard. That drive is in your bones.',
    mirror: 'Notice the ambition in your blood. That achievement orientation is your lineage gift.'
  },
  'The Seekers': {
    mentor: 'Your lineage sought meaning across horizons. That restless wisdom is your inheritance.',
    oracle: 'The seekers and teachers speak through you. Their quest is your compass.',
    companion: 'Your family has always been searching for something bigger. That\'s in you too.',
    mirror: 'Notice the seeking in your blood. That quest for meaning is your lineage gift.'
  },
  'The Healers': {
    mentor: 'Your lineage served and healed. That discernment is your inheritance—apply it with compassion.',
    oracle: 'The healers and servants speak through you. Their devotion is your medicine.',
    companion: 'Your family knows about helping others. That healing instinct is yours.',
    mirror: 'Notice the healing in your blood. That service orientation is your lineage gift.'
  },
  'The Artists': {
    mentor: 'Your lineage dreamed and dissolved boundaries. That sensitivity is your inheritance—protect it.',
    oracle: 'The dreamers and mystics speak through you. Their vision is your gift.',
    companion: 'Your family has deep sensitivity. That artistic soul is in you.',
    mirror: 'Notice the sensitivity in your blood. That imagination is your lineage gift.'
  },
  'The Warriors': {
    mentor: 'Your lineage fought and pioneered. That courage is your inheritance—direct it wisely.',
    oracle: 'The warriors and pioneers speak through you. Their fire is your spark.',
    companion: 'Your family knows about fighting for what matters. That courage is yours.',
    mirror: 'Notice the warrior in your blood. That courage is your lineage gift.'
  },
  'The Stabilizers': {
    mentor: 'Your lineage built what endures. That steadfastness is your inheritance.',
    oracle: 'The builders and providers speak through you. Their patience is your power.',
    companion: 'Your family knows about creating security. That stability is in you.',
    mirror: 'Notice the steadiness in your blood. That reliability is your lineage gift.'
  },
  'The Communicators': {
    mentor: 'Your lineage carried stories and connected minds. That gift of words is your inheritance.',
    oracle: 'The messengers and storytellers speak through you. Their voices are your chorus.',
    companion: 'Your family has always been good with words and ideas. That\'s in you too.',
    mirror: 'Notice the communication gift in your blood. That articulation is your lineage gift.'
  },
  'The Balancers': {
    mentor: 'Your lineage sought harmony and beauty. That diplomatic gift is your inheritance.',
    oracle: 'The peacemakers and artists speak through you. Their grace is your foundation.',
    companion: 'Your family values harmony and fairness. That balance-seeking is yours.',
    mirror: 'Notice the balance-seeking in your blood. That diplomacy is your lineage gift.'
  },
  'The Innovators': {
    mentor: 'Your lineage dreamed of better futures. That revolutionary spirit is your inheritance.',
    oracle: 'The visionaries and rebels speak through you. Their future-sight is your compass.',
    companion: 'Your family has always thought differently. That innovative spirit is in you.',
    mirror: 'Notice the innovation in your blood. That vision is your lineage gift.'
  },
  'The Rulers': {
    mentor: 'Your lineage led and inspired. That radiant confidence is your inheritance.',
    oracle: 'The leaders and creators speak through you. Their light is your flame.',
    companion: 'Your family knows about shining and leading. That presence is yours.',
    mirror: 'Notice the leadership in your blood. That radiance is your lineage gift.'
  }
};

/**
 * Get ancestral persona voice
 */
export function getAncestralPersonaVoice(
  result: AncestralPersonaOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return AncestralPersonaVoices[result.lineageArchetype][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface AncestralChamber {
  id: string;
  name: string;
  description: string;
  archetype: LineageArchetype;
}

export const AncestralChambers: Record<string, AncestralChamber> = {
  default: {
    id: 'hall-of-ancestors',
    name: 'The Hall of Ancestors',
    description: 'You enter the Hall of Ancestors, where the portraits of your lineage line the walls. Here, their eyes hold blessing and warning; their voices whisper through the generations.',
    archetype: 'The Nurturers'
  }
};

/**
 * Get ancestral chamber narrative
 */
export function getAncestralChamberNarrative(result: AncestralPersonaOverlayResult): string {
  return `You enter the Hall of Ancestors, where the presence of ${result.lineageArchetype} fills the chamber. ` +
    `${result.ancestralVoice.primaryMessage} Their ${result.ancestralVoice.tone} voice carries both blessing and warning: ` +
    `"${result.ancestralVoice.blessing}" And also: "${result.ancestralVoice.warning}"`;
}
