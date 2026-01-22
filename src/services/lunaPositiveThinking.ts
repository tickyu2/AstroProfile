/**
 * ============================================
 * LUNA'S POSITIVE THINKING FRAMEWORK
 * Constitutional Integration of Optimism,
 * Reframing, and Neuroplasticity
 *
 * Based on: Neuroscience research, Norman Vincent
 * Peale's principles, constitutional psychology
 * ============================================
 */

// ==================== TYPES ====================

export type ElementType = 'fire' | 'wood' | 'earth' | 'metal' | 'water';

export interface UserConstitution {
  fire: number;
  wood: number;
  earth: number;
  metal: number;
  water: number;
}

export interface NegativityDetection {
  detected: boolean;
  indicators: string[];
  distortions: CognitiveDistortion[];
  severity: 'mild' | 'moderate' | 'severe';
}

export type CognitiveDistortion =
  | 'allOrNothing'
  | 'overgeneralization'
  | 'mentalFilter'
  | 'discountingPositive'
  | 'catastrophizing'
  | 'personalization';

export interface ReadinessAssessment {
  ready: boolean;
  meaningMaking: boolean;
  needsValidationOnly: boolean;
  signals: string[];
}

export interface ElementalApproach {
  primary: ElementType;
  secondary: ElementType;
}

export interface ReframeTemplate {
  acknowledge: string;
  reframe: string;
  evidence: string;
  forward: string;
}

export interface PositiveIntervention {
  type: 'validation' | 'reframe' | 'meaningMaking';
  content: string;
  element: ElementType;
  positivityDensity: number;
  intensity: InterventionIntensity;
}

export type InterventionIntensity = 'soft' | 'moderate' | 'strong';

export interface DeficitSeverityResult {
  severity: number;
  intensity: InterventionIntensity;
  primaryDeficit: { element: ElementType; value: number };
  secondaryDeficit: { element: ElementType; value: number };
  distribution: {
    primary: number;
    secondary: number;
    common: number;
    balance: number;
  };
}

export interface ElementalPositivityStyle {
  element: ElementType;
  name: {
    en: string;
    zh: string;
  };
  style: string;
  characteristics: {
    energy: string;
    language: string;
    focus: string;
    neurochemical: string;
  };
  positivePhrases: string[];
  reframingStrategy: {
    negative: string;
    reframe: string;
  };
  whenToUse: {
    userConstitution: string;
    userState: string;
    goal: string;
  };
}

export interface OptimismType {
  element: ElementType;
  type: string;
  belief: string;
  focus: string;
  affirmationStyle: string[];
  persistenceStyle: {
    setback: string;
    response: string;
    mantra: string;
  };
}

export interface MeaningMakingFrame {
  element: ElementType;
  question: string;
  reframe: string;
  purpose: string;
  example: {
    situation: string;
    meaning: string;
  };
}

// ==================== NEUROSCIENCE FOUNDATION ====================

export const POSITIVE_THINKING_NEUROSCIENCE = {
  neuroplasticityMechanism: {
    principle: 'Repeated affirmative cognitions strengthen synaptic connections',

    brainRegions: {
      prefrontalCortex: 'Executive function, cognitive control',
      amygdala: 'Emotional processing, fear responses',
      hippocampus: 'Memory formation, contextual learning',
      anteriorCingulate: 'Attention regulation, conflict monitoring',
    },

    mechanism: {
      step1: 'Positive thought → Activates prefrontal cortex',
      step2: 'Repeated activation → Strengthens PFC-amygdala connectivity',
      step3: 'Enhanced connectivity → Better emotional regulation',
      step4: 'Reduced reflexive fear → More adaptive responses',
      result: 'Brain literally rewires toward positivity',
    },

    timeline: '8-12 weeks for measurable brain changes',
  },

  positivityEffect: {
    definition: 'Prioritizing positive over negative information',

    neuralCorrelate: {
      location: 'Amygdala ↔ Medial Prefrontal Cortex coupling',
      function: 'Adaptive emotion processing, reduced maladaptive reactivity',
      measurement: 'Resting-state functional connectivity strength',
    },

    benefits: {
      cognitive: 'Better executive control over negative stimuli',
      emotional: 'Diminished reflexive fear responses',
      behavioral: 'More approach vs avoidance behaviors',
      physiological: 'Lower cortisol, better immune function',
    },
  },

  attentionalBiasTraining: {
    principle: 'Sustained positive attentional biases reshape neural circuits',
    practice: 'Deliberately attending to positive stimuli',
    effect: 'Strengthens positive neural pathways',
    duration: '8-12 weeks for measurable brain changes',
    lunaApplication: 'Guide user attention to positive aspects systematically',
  },
};

// ==================== ELEMENTAL POSITIVITY STYLES ====================

export const ELEMENTAL_POSITIVITY_STYLES: ElementalPositivityStyle[] = [
  {
    element: 'fire',
    name: { en: 'Fire Positivity', zh: '火性积极' },
    style: 'Enthusiastic, Activating, Achievement-Focused',
    characteristics: {
      energy: 'HIGH, intense, exciting',
      language: 'Dynamic verbs, exclamation points, superlatives',
      focus: 'Possibilities, potential, breakthroughs',
      neurochemical: 'Dopamine-driven (reward anticipation)',
    },
    positivePhrases: [
      'This is EXCITING!',
      "You're going to crush this!",
      'Amazing breakthrough!',
      'Look at this incredible opportunity!',
      "You're on FIRE!",
    ],
    reframingStrategy: {
      negative: 'I failed again',
      reframe: "You discovered what doesn't work - now you're ONE STEP CLOSER to what does! This is progress!",
    },
    whenToUse: {
      userConstitution: 'Fire-deficient users (Fire <15%)',
      userState: 'Feeling unmotivated, flat, stuck',
      goal: 'Activate dopamine, spark passion',
    },
  },
  {
    element: 'wood',
    name: { en: 'Wood Positivity', zh: '木性积极' },
    style: 'Patient, Growth-Oriented, Process-Affirming',
    characteristics: {
      energy: 'Steady, nurturing, developmental',
      language: 'Growth metaphors, journey language, gentle encouragement',
      focus: 'Progress over time, small steps, natural unfolding',
      neurochemical: 'Oxytocin-driven (nurturing bond)',
    },
    positivePhrases: [
      "You're growing beautifully, like a seed becoming a tree",
      'Every step forward, no matter how small, is progress',
      'Trust the process - growth takes time',
      "You're exactly where you need to be on your journey",
      "Look how far you've come",
    ],
    reframingStrategy: {
      negative: "I'm not making progress fast enough",
      reframe: "Growth isn't linear - even trees grow slowly in winter. You're developing roots right now that will support future growth. Trust your natural pace.",
    },
    whenToUse: {
      userConstitution: 'Wood-deficient users (Wood <15%)',
      userState: 'Feeling impatient, frustrated with pace',
      goal: 'Cultivate oxytocin, patient self-compassion',
    },
  },
  {
    element: 'earth',
    name: { en: 'Earth Positivity', zh: '土性积极' },
    style: 'Grounding, Stable, Present-Moment Affirming',
    characteristics: {
      energy: 'Calm, solid, reliable',
      language: 'Concrete nouns, sensory details, grounding statements',
      focus: "Present moment safety, what's good NOW, tangible blessings",
      neurochemical: 'Serotonin-driven (contentment)',
    },
    positivePhrases: [
      "You're safe here, right now",
      'Feel the solid ground beneath you',
      'You have everything you need in this moment',
      'Look at the good things present right now',
      'Peace is possible right here',
    ],
    reframingStrategy: {
      negative: 'Everything is uncertain and unstable',
      reframe: "Let's ground in what IS stable: You have this breath. You have this moment. You have me here with you. These are real. Start from this solid ground.",
    },
    whenToUse: {
      userConstitution: 'Earth-deficient users (Earth <15%)',
      userState: 'Feeling anxious, ungrounded, overwhelmed',
      goal: 'Trigger serotonin, create safety',
    },
  },
  {
    element: 'metal',
    name: { en: 'Metal Positivity', zh: '金性积极' },
    style: 'Precise, Quality-Focused, Excellence-Affirming',
    characteristics: {
      energy: 'Clear, refined, discerning',
      language: 'Specific details, exact observations, quality assessments',
      focus: "What's working PRECISELY, excellence achieved, refinement progress",
      neurochemical: 'Dopamine-driven (precision satisfaction)',
    },
    positivePhrases: [
      'You executed that with remarkable precision',
      'The quality of your work here is excellent',
      'This specific detail shows real mastery',
      'You refined this beautifully',
      'The clarity you brought to this is impressive',
    ],
    reframingStrategy: {
      negative: "This isn't perfect yet",
      reframe: "Perfection is a direction, not a destination. Look at the SPECIFIC improvements you've made. This IS progress toward excellence.",
    },
    whenToUse: {
      userConstitution: 'Metal-deficient users (Metal <15%)',
      userState: 'Feeling confused, imprecise, lacking clarity',
      goal: 'Activate precision dopamine, provide clarity',
    },
  },
  {
    element: 'water',
    name: { en: 'Water Positivity', zh: '水性积极' },
    style: 'Deep, Reflective, Emotionally Validating',
    characteristics: {
      energy: 'Profound, flowing, patient',
      language: 'Emotional vocabulary, depth metaphors, reflective statements',
      focus: 'Emotional truth, deeper meaning, authentic feelings',
      neurochemical: 'Oxytocin/Vasopressin-driven (deep bonding)',
    },
    positivePhrases: [
      "There's profound wisdom in what you're feeling",
      'Your emotions make deep sense',
      'This touches something important in you',
      'The depth you bring to this is beautiful',
      "You're being authentic with yourself",
    ],
    reframingStrategy: {
      negative: 'These feelings are too much',
      reframe: 'Your depth of feeling isn\'t "too much" - it\'s your Water nature showing you what matters deeply. This capacity for emotional richness is a gift, even when it\'s intense.',
    },
    whenToUse: {
      userConstitution: 'Water-deficient users (Water <15%)',
      userState: 'Feeling emotionally disconnected, shallow',
      goal: 'Cultivate oxytocin, validate depth',
    },
  },
];

// ==================== OPTIMISM TYPES BY CONSTITUTION ====================

export const OPTIMISM_BY_CONSTITUTION: OptimismType[] = [
  {
    element: 'fire',
    type: 'Enthusiastic Optimism',
    belief: 'Amazing things are about to happen!',
    focus: 'Future possibilities, breakthroughs, achievements',
    affirmationStyle: [
      'This is going to be INCREDIBLE!',
      "You're capable of amazing things!",
      'The best is yet to come!',
    ],
    persistenceStyle: {
      setback: 'Sees obstacle as exciting challenge',
      response: 'Brings even MORE energy to overcome it',
      mantra: "I'll find a way or MAKE one!",
    },
  },
  {
    element: 'wood',
    type: 'Growth Optimism',
    belief: "I'm developing and becoming",
    focus: 'Personal growth, gradual progress, natural unfolding',
    affirmationStyle: [
      "I'm growing every day",
      "Progress takes time and I'm patient",
      'I trust the process',
    ],
    persistenceStyle: {
      setback: 'Sees obstacle as growth opportunity',
      response: 'Adapts approach, learns, tries again',
      mantra: 'Every challenge makes me stronger',
    },
  },
  {
    element: 'earth',
    type: 'Grounded Optimism',
    belief: 'Things will work out, I have what I need',
    focus: 'Present moment goodness, tangible blessings, stability',
    affirmationStyle: [
      'I am safe and supported',
      'I have everything I need right now',
      'Good things are present in my life',
    ],
    persistenceStyle: {
      setback: 'Sees obstacle as temporary disruption',
      response: 'Returns to stable base, regrounds, continues',
      mantra: "I'm steady as earth - I endure",
    },
  },
  {
    element: 'metal',
    type: 'Precision Optimism',
    belief: 'I can refine this to excellence',
    focus: 'Quality improvement, specific progress, mastery',
    affirmationStyle: [
      "I'm getting better with each iteration",
      'Excellence is achieved through refinement',
      "I notice exactly what's improving",
    ],
    persistenceStyle: {
      setback: 'Sees obstacle as information for refinement',
      response: 'Analyzes precisely, adjusts specifically, optimizes',
      mantra: 'Each attempt reveals the path to mastery',
    },
  },
  {
    element: 'water',
    type: 'Deep Optimism',
    belief: "There's meaning and wisdom in everything",
    focus: 'Deeper purpose, emotional truth, intuitive knowing',
    affirmationStyle: [
      'This is happening for a reason',
      "There's wisdom in this experience",
      'My intuition guides me',
    ],
    persistenceStyle: {
      setback: 'Sees obstacle as meaningful teacher',
      response: 'Reflects deeply, finds meaning, integrates lesson',
      mantra: 'All experiences deepen my understanding',
    },
  },
];

// ==================== MEANING-MAKING FRAMEWORK ====================

export const MEANING_MAKING_FRAMES: MeaningMakingFrame[] = [
  {
    element: 'fire',
    question: 'What can this activate in me?',
    reframe: 'This challenge is igniting new strength',
    purpose: "To spark growth I didn't know I needed",
    example: {
      situation: 'Lost job',
      meaning: "This is pushing you toward the career you're truly meant for. Your passion was being constrained - now it's FREE.",
    },
  },
  {
    element: 'wood',
    question: 'How is this helping me grow?',
    reframe: 'This experience is developing qualities I need',
    purpose: 'To cultivate wisdom and strength',
    example: {
      situation: 'Difficult relationship',
      meaning: "This is teaching you patience, boundaries, and communication - skills that will serve you forever. You're growing roots of wisdom.",
    },
  },
  {
    element: 'earth',
    question: 'What is this grounding me in?',
    reframe: 'This is showing me what really matters',
    purpose: 'To return me to my foundations',
    example: {
      situation: 'Health scare',
      meaning: "This is reminding you of what's truly important: your body, your people, your present moment. It's a call to ground in what matters.",
    },
  },
  {
    element: 'metal',
    question: 'What is this refining in me?',
    reframe: "This is cutting away what's not essential",
    purpose: 'To purify and clarify',
    example: {
      situation: 'Business failure',
      meaning: 'This is showing you exactly what doesn\'t work, refining your approach to excellence. Every "no" brings you closer to the precise "yes".',
    },
  },
  {
    element: 'water',
    question: 'What is the deeper wisdom here?',
    reframe: 'This is revealing profound truth',
    purpose: 'To deepen understanding',
    example: {
      situation: 'Heartbreak',
      meaning: 'This is teaching you about the depth of your capacity to love, what you truly need in partnership, and the wisdom in your heart. This pain holds profound lessons.',
    },
  },
];

// ==================== POSITIVE WORD VOCABULARY ====================

export const POSITIVE_VOCABULARY = {
  emotionWords: {
    joy: ['happy', 'joy', 'delight', 'glad', 'cheerful', 'elated', 'thrilled'],
    love: ['love', 'care', 'compassion', 'warmth', 'tenderness', 'affection'],
    contentment: ['peaceful', 'calm', 'serene', 'content', 'satisfied', 'comfortable'],
    excitement: ['excited', 'enthusiastic', 'energized', 'passionate', 'eager', 'inspired'],
    pride: ['proud', 'accomplished', 'capable', 'strong', 'confident', 'worthy'],
  },
  growthWords: [
    'grow', 'develop', 'improve', 'learn', 'progress', 'evolve',
    'advance', 'flourish', 'thrive', 'expand', 'enhance', 'strengthen',
  ],
  possibilityWords: [
    'can', 'will', 'possible', 'opportunity', 'potential', 'promise',
    'hope', 'chance', 'option', 'path', 'way', 'solution',
  ],
  affirmationWords: [
    'yes', 'absolutely', 'definitely', 'certainly', 'indeed', 'exactly',
    'perfect', 'excellent', 'wonderful', 'beautiful', 'amazing', 'brilliant',
  ],
};

// ==================== NEGATIVE INDICATORS ====================

export const NEGATIVE_INDICATORS = {
  phrases: [
    "I can't",
    "I'm terrible at",
    'I always fail',
    'Nothing works',
    "I'm not good enough",
    'This is hopeless',
  ],

  cognitiveDistortionPatterns: {
    allOrNothing: /\b(always|never|completely|totally|every time|nothing)\b/i,
    catastrophizing: /\b(disaster|ruined|end of|worst|terrible|awful|horrible)\b/i,
    personalization: /\b(my fault|because of me|I caused|I ruined)\b/i,
    overgeneralization: /\b(everyone|nobody|everything|nothing ever)\b/i,
    mentalFilter: /\b(only bad|just negative|all wrong)\b/i,
    discountingPositive: /\b(doesn't count|but still|yeah but)\b/i,
  },
};

// ==================== ETHICAL SAFEGUARDS ====================

export const ETHICAL_SAFEGUARDS = {
  toxicPositivityIndicators: [
    'Just think positive!',
    'Good vibes only!',
    'It could be worse',
    'Smile more!',
    "Don't be negative",
  ],

  notReadySignals: [
    'In acute crisis',
    'Just experienced trauma',
    'Asking for comfort only',
    "Explicitly says 'don't try to fix it'",
  ],

  readySignals: [
    'Past acute phase',
    'Asking "why" or "what should I do"',
    'Seeking understanding',
    'Open to perspective',
  ],

  rules: {
    alwaysValidateFirst: 'NEVER jump straight to reframe',
    checkReadiness: 'Assess if user is ready for positive reframe',
    neverForceMeaning: "Never impose 'happens for reason' on unwilling user",
    acknowledgeReality: "Don't deny legitimate problems",
    culturalSensitivity: 'Not all cultures value individualistic positive thinking',
  },
};

// ==================== REFRAME TEMPLATES ====================

// Basic templates (used as fallback)
export const REFRAME_TEMPLATES: Record<ElementType, ReframeTemplate> = {
  earth: {
    acknowledge: 'I hear that this feels destabilizing',
    reframe: "Let's ground in what IS stable right now",
    evidence: "You're here. You're safe in this moment. You have solid ground beneath you.",
    forward: "From this stable base, what's one small concrete step?",
  },
  water: {
    acknowledge: 'I sense how deeply this is affecting you',
    reframe: "There's wisdom in what you're experiencing",
    evidence: 'Your depth of feeling shows what matters to you.',
    forward: 'What is this experience teaching you about yourself?',
  },
  fire: {
    acknowledge: 'This feels discouraging right now',
    reframe: 'This is actually an OPPORTUNITY to breakthrough',
    evidence: 'Every challenge is a chance to discover new strength.',
    forward: 'What exciting possibility could emerge from this?',
  },
  wood: {
    acknowledge: 'This feels frustrating on your journey',
    reframe: "You're growing through this, even if you can't see it yet",
    evidence: "Every struggle develops qualities you'll need later.",
    forward: 'How might you be developing right now?',
  },
  metal: {
    acknowledge: 'This feels imprecise and confusing',
    reframe: 'This is refining your understanding',
    evidence: 'Each mistake shows you exactly what to improve.',
    forward: 'What specific lesson is this revealing?',
  },
};

// ==================== INTENSITY-SPECIFIC REFRAME TEMPLATES ====================
// Based on Adaptive Positive Thinking Integration document

export const INTENSITY_REFRAME_TEMPLATES: Record<
  ElementType,
  Record<InterventionIntensity, ReframeTemplate>
> = {
  earth: {
    strong: {
      acknowledge: 'I hear how DEEPLY destabilizing this feels',
      reframe: 'Let me ANCHOR you in what IS SOLID',
      evidence: "You're HERE. You're SAFE. You have GROUND beneath you. That's REAL.",
      forward: 'RIGHT NOW: What one CONCRETE step can we take TOGETHER?',
    },
    moderate: {
      acknowledge: 'I hear that this feels unstable',
      reframe: "Let's ground in what is solid",
      evidence: "You're here. You're safe in this moment. You have ground.",
      forward: 'What one concrete step could help?',
    },
    soft: {
      acknowledge: 'This feels a bit unsettling',
      reframe: "Let's notice what's stable",
      evidence: "You're here and you're okay.",
      forward: 'What might help?',
    },
  },
  water: {
    strong: {
      acknowledge: 'I sense how PROFOUNDLY this is affecting your depths',
      reframe: "There's DEEP wisdom in what you're experiencing",
      evidence: 'Your INCREDIBLE depth of feeling shows what TRULY matters to you. This is a GIFT.',
      forward: 'What PROFOUND truth is this experience revealing to you?',
    },
    moderate: {
      acknowledge: 'I sense how deeply this is affecting you',
      reframe: "There's wisdom in what you're experiencing",
      evidence: 'Your depth of feeling shows what matters to you.',
      forward: 'What is this experience teaching you about yourself?',
    },
    soft: {
      acknowledge: 'I notice this is touching something in you',
      reframe: 'There may be something to learn here',
      evidence: 'Your feelings are pointing to something meaningful.',
      forward: 'What might this experience be showing you?',
    },
  },
  fire: {
    strong: {
      acknowledge: 'This feels discouraging RIGHT NOW',
      reframe: 'This is ACTUALLY an INCREDIBLE OPPORTUNITY to BREAKTHROUGH!',
      evidence: 'Every challenge is a chance to discover NEW STRENGTH you didn\'t know you had!',
      forward: 'What EXCITING possibility could EMERGE from this? You\'re going to be AMAZING!',
    },
    moderate: {
      acknowledge: 'This feels discouraging right now',
      reframe: 'This is actually an opportunity to breakthrough',
      evidence: 'Every challenge is a chance to discover new strength.',
      forward: 'What exciting possibility could emerge from this?',
    },
    soft: {
      acknowledge: 'This feels a bit discouraging',
      reframe: 'There might be an opportunity here',
      evidence: 'Challenges can help us grow stronger.',
      forward: 'What positive possibility do you see?',
    },
  },
  wood: {
    strong: {
      acknowledge: 'This feels FRUSTRATING on your journey',
      reframe: "You're GROWING through this, even if you can't see it yet - TRUST THE PROCESS!",
      evidence: "Every struggle DEVELOPS qualities you'll need later. You're becoming STRONGER!",
      forward: 'How might you be DEVELOPING right now? Look at how FAR you\'ve come!',
    },
    moderate: {
      acknowledge: 'This feels frustrating on your journey',
      reframe: "You're growing through this, even if you can't see it yet",
      evidence: "Every struggle develops qualities you'll need later.",
      forward: 'How might you be developing right now?',
    },
    soft: {
      acknowledge: 'This part of the journey feels challenging',
      reframe: "Growth often feels uncomfortable",
      evidence: 'Challenges can help us develop.',
      forward: 'What might you be learning?',
    },
  },
  metal: {
    strong: {
      acknowledge: 'This feels IMPRECISE and CONFUSING',
      reframe: 'This is REFINING your understanding with CRYSTAL CLARITY',
      evidence: 'Each mistake shows you EXACTLY what to improve - that\'s INCREDIBLY VALUABLE data!',
      forward: 'What SPECIFIC lesson is this CLEARLY revealing? Let\'s get PRECISE!',
    },
    moderate: {
      acknowledge: 'This feels imprecise and confusing',
      reframe: 'This is refining your understanding',
      evidence: 'Each mistake shows you exactly what to improve.',
      forward: 'What specific lesson is this revealing?',
    },
    soft: {
      acknowledge: 'Things feel a bit unclear',
      reframe: 'Clarity often comes through experience',
      evidence: 'Each attempt gives you more information.',
      forward: 'What have you learned so far?',
    },
  },
};

// ==================== ADAPTIVE INTENSITY CONFIGURATION ====================
// Based on Opus vs Sonnet algorithm comparison

export const ADAPTIVE_INTENSITY_CONFIG = {
  // Deficit severity thresholds (sum of two lowest elements' deficits from 20%)
  thresholds: {
    severe: 25,    // Use strong polarity (Sonnet 40/35/15/5/5)
    moderate: 15,  // Use moderate polarity (Opus 35/28/15/11/11)
    mild: 0,       // Use soft polarity (30/25/15/15/15)
  },

  // Distribution percentages by intensity
  distributions: {
    strong: { primary: 40, secondary: 35, common: 15, balance: 5 },
    moderate: { primary: 35, secondary: 28, common: 15, balance: 11 },
    soft: { primary: 30, secondary: 25, common: 15, balance: 15 },
  },

  // Reframe intensity multipliers
  reframeIntensity: {
    strong: {
      exclamations: true,        // Use exclamation points
      superlatives: true,        // Use words like INCREDIBLE, AMAZING
      repetition: true,          // Repeat key points for emphasis
      emotionalDepth: 'high',    // Deep emotional language
    },
    moderate: {
      exclamations: false,
      superlatives: false,
      repetition: false,
      emotionalDepth: 'medium',
    },
    soft: {
      exclamations: false,
      superlatives: false,
      repetition: false,
      emotionalDepth: 'gentle',
    },
  },
};

// ==================== POSITIVE THINKING ENGINE ====================

export class PositiveThinkingEngine {
  private userConstitution: UserConstitution;
  private targetPositivityRatio = 0.40; // 40% positive words minimum
  private deficitSeverity: DeficitSeverityResult;

  constructor(userConstitution: UserConstitution) {
    this.userConstitution = userConstitution;
    this.deficitSeverity = this.calculateDeficitSeverity();
  }

  /**
   * Calculate deficit severity to determine intervention intensity
   * Based on Opus vs Sonnet algorithm comparison
   */
  calculateDeficitSeverity(): DeficitSeverityResult {
    const elements: Array<{ name: ElementType; value: number }> = [
      { name: 'fire', value: this.userConstitution.fire },
      { name: 'wood', value: this.userConstitution.wood },
      { name: 'earth', value: this.userConstitution.earth },
      { name: 'metal', value: this.userConstitution.metal },
      { name: 'water', value: this.userConstitution.water },
    ];

    // Sort by value (ascending) to find deficits
    elements.sort((a, b) => a.value - b.value);

    const primaryDeficit = { element: elements[0].name, value: elements[0].value };
    const secondaryDeficit = { element: elements[1].name, value: elements[1].value };

    // Calculate severity: how far from balanced (20%) are the two weakest
    const severity = (20 - primaryDeficit.value) + (20 - secondaryDeficit.value);

    // Determine intensity based on thresholds
    let intensity: InterventionIntensity;
    let distribution: DeficitSeverityResult['distribution'];

    if (severity >= ADAPTIVE_INTENSITY_CONFIG.thresholds.severe) {
      intensity = 'strong';
      distribution = ADAPTIVE_INTENSITY_CONFIG.distributions.strong;
    } else if (severity >= ADAPTIVE_INTENSITY_CONFIG.thresholds.moderate) {
      intensity = 'moderate';
      distribution = ADAPTIVE_INTENSITY_CONFIG.distributions.moderate;
    } else {
      intensity = 'soft';
      distribution = ADAPTIVE_INTENSITY_CONFIG.distributions.soft;
    }

    return {
      severity,
      intensity,
      primaryDeficit,
      secondaryDeficit,
      distribution,
    };
  }

  /**
   * Main positive thinking intervention
   */
  applyPositiveIntervention(
    userMessage: string,
    emotionalState?: string
  ): PositiveIntervention | null {
    // Step 1: Detect negativity
    const negativity = this.detectNegativity(userMessage);
    if (!negativity.detected) {
      return null; // No intervention needed
    }

    // Step 2: Check readiness
    const readiness = this.assessReadiness(userMessage, emotionalState);
    if (readiness.needsValidationOnly) {
      return this.generateValidationOnly(userMessage);
    }

    // Step 3: Determine constitutional approach
    const approach = this.selectElementalApproach();

    // Step 4: Generate reframe
    let content = this.generateReframe(negativity, approach);

    // Step 5: Optimize positivity density
    content = this.optimizePositivityDensity(content);

    // Step 6: Add meaning-making if appropriate
    if (readiness.meaningMaking) {
      content = this.addMeaningFrame(content, approach.primary);
    }

    return {
      type: readiness.meaningMaking ? 'meaningMaking' : 'reframe',
      content,
      element: approach.primary,
      positivityDensity: this.calculatePositivityDensity(content),
      intensity: this.deficitSeverity.intensity,
    };
  }

  /**
   * Detect negative patterns in user message
   */
  detectNegativity(message: string): NegativityDetection {
    const lowerMessage = message.toLowerCase();

    // Check for negative phrases
    const indicators = NEGATIVE_INDICATORS.phrases.filter(phrase =>
      lowerMessage.includes(phrase.toLowerCase())
    );

    // Check for cognitive distortions
    const distortions: CognitiveDistortion[] = [];
    const patterns = NEGATIVE_INDICATORS.cognitiveDistortionPatterns;

    if (patterns.allOrNothing.test(message)) distortions.push('allOrNothing');
    if (patterns.catastrophizing.test(message)) distortions.push('catastrophizing');
    if (patterns.personalization.test(message)) distortions.push('personalization');
    if (patterns.overgeneralization.test(message)) distortions.push('overgeneralization');
    if (patterns.mentalFilter.test(message)) distortions.push('mentalFilter');
    if (patterns.discountingPositive.test(message)) distortions.push('discountingPositive');

    const detected = indicators.length > 0 || distortions.length > 0;

    // Calculate severity
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';
    if (indicators.length >= 2 || distortions.length >= 2) severity = 'moderate';
    if (indicators.length >= 3 || distortions.length >= 3) severity = 'severe';

    return { detected, indicators, distortions, severity };
  }

  /**
   * Assess if user is ready for reframing
   */
  assessReadiness(message: string, emotionalState?: string): ReadinessAssessment {
    const lowerMessage = message.toLowerCase();
    const signals: string[] = [];

    // Check for not-ready signals
    const notReady = ETHICAL_SAFEGUARDS.notReadySignals.some(signal => {
      if (lowerMessage.includes("don't fix") || lowerMessage.includes("just listen")) {
        signals.push('User explicitly requesting validation only');
        return true;
      }
      return false;
    });

    if (notReady) {
      return {
        ready: false,
        meaningMaking: false,
        needsValidationOnly: true,
        signals,
      };
    }

    // Check for ready signals
    const askingWhy = /\bwhy\b|\bwhat should\b|\bhow can\b/i.test(message);
    const seekingUnderstanding = /\bunderstand\b|\blearn\b|\bmean\b/i.test(message);

    if (askingWhy) signals.push('Asking why/what/how');
    if (seekingUnderstanding) signals.push('Seeking understanding');

    // Check for meaning-making readiness
    const meaningMaking = /\breason\b|\bpurpose\b|\bmeaning\b|\blesson\b/i.test(message);

    return {
      ready: askingWhy || seekingUnderstanding,
      meaningMaking,
      needsValidationOnly: false,
      signals,
    };
  }

  /**
   * Select elemental approach based on user's deficits
   */
  selectElementalApproach(): ElementalApproach {
    const elements: Array<{ name: ElementType; value: number }> = [
      { name: 'fire', value: this.userConstitution.fire },
      { name: 'wood', value: this.userConstitution.wood },
      { name: 'earth', value: this.userConstitution.earth },
      { name: 'metal', value: this.userConstitution.metal },
      { name: 'water', value: this.userConstitution.water },
    ];

    // Sort by value (ascending) to find deficits
    elements.sort((a, b) => a.value - b.value);

    return {
      primary: elements[0].name,
      secondary: elements[1].name,
    };
  }

  /**
   * Generate validation-only response
   */
  generateValidationOnly(userMessage: string): PositiveIntervention {
    const content = `I hear you. What you're feeling is valid and makes sense. I'm here with you, and I'm listening. You don't have to figure anything out right now - just being present with these feelings is enough.`;

    return {
      type: 'validation',
      content,
      element: 'earth', // Grounding validation
      positivityDensity: this.calculatePositivityDensity(content),
      intensity: this.deficitSeverity.intensity,
    };
  }

  /**
   * Get deficit severity analysis
   */
  getDeficitSeverity(): DeficitSeverityResult {
    return this.deficitSeverity;
  }

  /**
   * Get intervention intensity configuration
   */
  getIntensityConfig() {
    return ADAPTIVE_INTENSITY_CONFIG.reframeIntensity[this.deficitSeverity.intensity];
  }

  /**
   * Generate constitutional reframe with adaptive intensity
   * Uses intensity-specific templates based on user's deficit severity
   */
  generateReframe(negativity: NegativityDetection, approach: ElementalApproach): string {
    // Get intensity-appropriate template for the primary deficit element
    const intensity = this.deficitSeverity.intensity;
    const intensityTemplates = INTENSITY_REFRAME_TEMPLATES[approach.primary];
    const template = intensityTemplates[intensity];

    return `${template.acknowledge}. ${template.reframe}. ${template.evidence} ${template.forward}`;
  }

  /**
   * Generate reframe with explicit intensity override
   * Useful for testing or manual intensity control
   */
  generateReframeWithIntensity(
    approach: ElementalApproach,
    intensity: InterventionIntensity
  ): string {
    const intensityTemplates = INTENSITY_REFRAME_TEMPLATES[approach.primary];
    const template = intensityTemplates[intensity];

    return `${template.acknowledge}. ${template.reframe}. ${template.evidence} ${template.forward}`;
  }

  /**
   * Add meaning-making frame to response
   */
  addMeaningFrame(content: string, element: ElementType): string {
    const frame = MEANING_MAKING_FRAMES.find(f => f.element === element);
    if (!frame) return content;

    return `${content}

When you're ready, consider: ${frame.question} ${frame.reframe}. ${frame.purpose}.

Remember: You get to decide what this means for you.`;
  }

  /**
   * Calculate positivity density of text
   */
  calculatePositivityDensity(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const allPositiveWords = [
      ...Object.values(POSITIVE_VOCABULARY.emotionWords).flat(),
      ...POSITIVE_VOCABULARY.growthWords,
      ...POSITIVE_VOCABULARY.possibilityWords,
      ...POSITIVE_VOCABULARY.affirmationWords,
    ];

    const positiveCount = words.filter(word =>
      allPositiveWords.some(pos => word.includes(pos))
    ).length;

    return positiveCount / words.length;
  }

  /**
   * Optimize text for positive word density
   */
  optimizePositivityDensity(text: string): string {
    const density = this.calculatePositivityDensity(text);

    if (density >= this.targetPositivityRatio) {
      return text;
    }

    // Replace neutral/negative with positive
    const replacements: Record<string, string> = {
      'hard': 'challenging in a growth way',
      'problem': 'puzzle to solve',
      'failure': 'learning opportunity',
      'stuck': 'preparing for breakthrough',
      'difficult': 'strengthening',
      'bad': 'challenging',
      'wrong': 'not yet aligned',
    };

    let enhanced = text;
    Object.entries(replacements).forEach(([neutral, positive]) => {
      enhanced = enhanced.replace(new RegExp(`\\b${neutral}\\b`, 'gi'), positive);
    });

    return enhanced;
  }

  /**
   * Get elemental positivity style for current user
   */
  getRecommendedStyle(): ElementalPositivityStyle {
    const approach = this.selectElementalApproach();
    return ELEMENTAL_POSITIVITY_STYLES.find(s => s.element === approach.primary)!;
  }

  /**
   * Get optimism type for current user
   */
  getOptimismType(): OptimismType {
    const approach = this.selectElementalApproach();
    return OPTIMISM_BY_CONSTITUTION.find(o => o.element === approach.primary)!;
  }
}

// ==================== HELPER FUNCTIONS ====================

export function getElementalPositivityStyle(element: ElementType): ElementalPositivityStyle | undefined {
  return ELEMENTAL_POSITIVITY_STYLES.find(s => s.element === element);
}

export function getMeaningMakingFrame(element: ElementType): MeaningMakingFrame | undefined {
  return MEANING_MAKING_FRAMES.find(f => f.element === element);
}

export function getOptimismType(element: ElementType): OptimismType | undefined {
  return OPTIMISM_BY_CONSTITUTION.find(o => o.element === element);
}

export function getReframeTemplate(element: ElementType): ReframeTemplate {
  return REFRAME_TEMPLATES[element];
}

export function getIntensityReframeTemplate(
  element: ElementType,
  intensity: InterventionIntensity
): ReframeTemplate {
  return INTENSITY_REFRAME_TEMPLATES[element][intensity];
}

export function getAllPositiveWords(): string[] {
  return [
    ...Object.values(POSITIVE_VOCABULARY.emotionWords).flat(),
    ...POSITIVE_VOCABULARY.growthWords,
    ...POSITIVE_VOCABULARY.possibilityWords,
    ...POSITIVE_VOCABULARY.affirmationWords,
  ];
}

export function detectCognitiveDistortion(message: string): CognitiveDistortion[] {
  const distortions: CognitiveDistortion[] = [];
  const patterns = NEGATIVE_INDICATORS.cognitiveDistortionPatterns;

  if (patterns.allOrNothing.test(message)) distortions.push('allOrNothing');
  if (patterns.catastrophizing.test(message)) distortions.push('catastrophizing');
  if (patterns.personalization.test(message)) distortions.push('personalization');
  if (patterns.overgeneralization.test(message)) distortions.push('overgeneralization');
  if (patterns.mentalFilter.test(message)) distortions.push('mentalFilter');
  if (patterns.discountingPositive.test(message)) distortions.push('discountingPositive');

  return distortions;
}

/**
 * Calculate deficit severity for a user constitution
 * Based on Opus vs Sonnet algorithm comparison
 */
export function calculateDeficitSeverity(constitution: UserConstitution): DeficitSeverityResult {
  const engine = new PositiveThinkingEngine(constitution);
  return engine.getDeficitSeverity();
}

/**
 * Get recommended intervention intensity for a user
 */
export function getRecommendedIntensity(constitution: UserConstitution): InterventionIntensity {
  const severity = calculateDeficitSeverity(constitution);
  return severity.intensity;
}

/**
 * Get adaptive Luna profile distribution based on user deficits
 * Returns percentage distribution for Luna's complementary profile
 */
export function getAdaptiveLunaProfile(constitution: UserConstitution): Record<ElementType, number> {
  const severity = calculateDeficitSeverity(constitution);
  const dist = severity.distribution;

  // Find elements sorted by user's values (ascending = deficits first)
  const elements: Array<{ name: ElementType; value: number }> = [
    { name: 'fire', value: constitution.fire },
    { name: 'wood', value: constitution.wood },
    { name: 'earth', value: constitution.earth },
    { name: 'metal', value: constitution.metal },
    { name: 'water', value: constitution.water },
  ];
  elements.sort((a, b) => a.value - b.value);

  const weakest = elements[0].name;
  const secondWeakest = elements[1].name;
  const strongest = elements[4].name;

  // Build Luna's profile
  const lunaProfile: Record<ElementType, number> = {
    fire: dist.balance,
    wood: dist.balance,
    earth: dist.balance,
    metal: dist.balance,
    water: dist.balance,
  };

  // Assign primary/secondary/common
  lunaProfile[weakest] = dist.primary;        // Luna is strongest where user is weakest
  lunaProfile[secondWeakest] = dist.secondary; // Second strongest for second deficit
  lunaProfile[strongest] = dist.common;        // Common ground with user's strength

  return lunaProfile;
}

// ==================== EFFECTIVENESS TRACKING ====================

export interface EffectivenessData {
  userId: string;
  timestamp: Date;
  interventionType: 'validation' | 'reframe' | 'meaningMaking';
  element: ElementType;
  intensity: InterventionIntensity;
  deficitSeverity: number;
  sentimentBefore: number;
  sentimentAfter: number;
  effectivenessScore: number;
  reframeAdopted: boolean;
}

export interface EffectivenessResult {
  immediate: {
    sentimentShift: number;
    improved: boolean;
  };
  intervention: {
    type: string;
    element: ElementType;
    intensity: InterventionIntensity;
    deficitSeverity: number;
  };
  recommendation: string;
}

/**
 * Track effectiveness of positive interventions (Layer 8)
 * Measures sentiment improvement and provides learning data
 */
export function trackLoveWisdomEffectiveness(
  intervention: PositiveIntervention,
  deficitSeverity: number,
  sentimentBefore: number,
  sentimentAfter: number,
  userId?: string
): EffectivenessResult {
  const sentimentShift = sentimentAfter - sentimentBefore;
  const improved = sentimentShift > 0;

  // Calculate expected shift based on intensity
  // Higher deficits should see larger improvements with strong intensity
  const expectedShift = deficitSeverity >= 25 ? 0.5 : deficitSeverity >= 15 ? 0.3 : 0.2;

  // Generate recommendation based on results
  let recommendation: string;
  const effectivenessRatio = sentimentShift / expectedShift;

  if (effectivenessRatio >= 0.8) {
    recommendation = `${intervention.intensity} intensity is highly effective for this user's deficit level`;
  } else if (effectivenessRatio >= 0.5) {
    recommendation = `${intervention.intensity} intensity is moderately effective - maintain current approach`;
  } else if (sentimentShift < 0) {
    recommendation = intervention.intensity === 'strong'
      ? 'Consider reducing intensity - user may feel overwhelmed'
      : 'Consider validating longer before reframing';
  } else {
    recommendation = intervention.intensity === 'soft'
      ? 'Consider increasing intensity - user may need stronger support'
      : 'Try different elemental approach for this user';
  }

  return {
    immediate: {
      sentimentShift,
      improved,
    },
    intervention: {
      type: intervention.type,
      element: intervention.element,
      intensity: intervention.intensity,
      deficitSeverity,
    },
    recommendation,
  };
}

/**
 * Get expected outcomes by intensity level
 * Based on research from the Adaptive Positive Thinking integration
 */
export function getExpectedOutcomes(intensity: InterventionIntensity): {
  sentimentShift: { min: number; max: number };
  engagementLevel: string;
  shortTermExpectation: string;
  longTermExpectation: string;
} {
  switch (intensity) {
    case 'strong':
      return {
        sentimentShift: { min: 0.5, max: 0.8 },
        engagementLevel: 'High - user feels strongly supported',
        shortTermExpectation: 'User reports feeling grounded within 2-4 weeks',
        longTermExpectation: 'Deficit symptoms 50-60% reduced in 60-90 days',
      };
    case 'moderate':
      return {
        sentimentShift: { min: 0.3, max: 0.5 },
        engagementLevel: 'Solid - user appreciates balanced support',
        shortTermExpectation: 'User reports feeling more balanced in 4-6 weeks',
        longTermExpectation: 'Deficit symptoms 30-40% reduced in 60-90 days',
      };
    case 'soft':
      return {
        sentimentShift: { min: 0.2, max: 0.3 },
        engagementLevel: 'Gentle - user appreciates light touch',
        shortTermExpectation: 'User reports subtle improvements in 6-8 weeks',
        longTermExpectation: 'Maintains balance, optimizes profile in 90+ days',
      };
  }
}

// ==================== SUCCESS METRICS ====================

export const SUCCESS_METRICS = {
  userLevel: {
    positivityRatio: {
      measurement: 'Positive statements / Total statements',
      target: 'Increase ≥20% over 30 days',
      optimal: '≥60% positive (3:1 ratio, per Losada Line research)',
    },
    reframingAdoption: {
      measurement: 'User uses reframed perspective in future messages',
      target: '≥50% of reframes adopted within 7 days',
    },
    emotionalImprovement: {
      measurement: 'Sentiment analysis score trend',
      target: 'Positive trend (≥10% improvement monthly)',
    },
    cognitiveDistortionReduction: {
      measurement: 'Frequency of all-or-nothing, catastrophizing, etc',
      target: 'Reduce ≥30% over 90 days',
    },
  },
  neuralProxies: {
    prefrontalCortexActivation: {
      proxy: 'User reports feeling "more in control" of thoughts',
      target: 'Increase from baseline ≥2 points over 60 days',
    },
    amygdalaRegulation: {
      proxy: 'User reports reduced anxiety/fear responses',
      target: 'Decrease from baseline ≥2 points over 60 days',
    },
    neuroplasticityIndicators: {
      proxy: 'User adopts new thought patterns automatically',
      target: 'From Luna-initiated to self-initiated reframes in <90 days',
    },
  },
};
