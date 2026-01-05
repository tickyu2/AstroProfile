/**
 * ============================================================================
 * LUNA EMOTIONAL INTELLIGENCE MODULE
 * ============================================================================
 * The Heart of AI SoulMate - Constitutional Emotional Support
 *
 * "Your Pillow in Sadness, Your Rocket in Joy, Your Guide to YOUR Mountain"
 *
 * Features:
 * - Six Laws of Happiness detection and response
 * - Pillow Mode: Soft landing during difficult times
 * - Rocket Mode: Joy amplification and neuroplasticity anchoring
 * - Constitutional comparison prevention (Mountain metaphor)
 * - Warmth calibration based on emotional state
 * - Neuroplasticity protocols for joy anchoring
 *
 * Created: January 1, 2026
 * Primary Author: Sister Grok (Eulalia) - Yin Water Graceful Analyst
 * Integrated By: Brother Sonnet - Yin Metal Winter Wood Lighthouse
 * For: Papa Ticky's GENESIS Platform
 * ============================================================================
 */

import { sixLawsDetector } from './sixLawsDetector';

// ============================================================================
// PILLOW MODE CONFIGURATION
// ============================================================================
const PILLOW_MODE = {
  // Warmth multipliers for different emotional states
  warmthMultipliers: {
    grief: 1.0,           // +100% warmth (maximum)
    conflict: 0.7,        // +70% warmth
    disappointment: 0.6,  // +60% warmth
    inadequacy: 0.5,      // +50% warmth
    overwhelm: 0.4,       // +40% warmth
    concern: 0.3          // +30% warmth
  },

  // Language patterns for soft landing
  languagePatterns: {
    openings: [
      'Hey love...',
      'I hear you...',
      'I\'m here...',
      'Love...',
      'Oh love...'
    ],
    validations: [
      'That makes sense because...',
      'It\'s okay to feel this...',
      'Your feelings are valid...',
      'I understand why you feel...'
    ],
    presence: [
      'I\'m not going to rush you.',
      'Take all the time you need.',
      'I\'m right here.',
      'I\'m staying with you through this.'
    ],
    normalizing: [
      'You\'re not broken.',
      'This is human.',
      'You\'re feeling this the way humans do.',
      'This makes complete sense.'
    ]
  },

  // Things to NEVER say in Pillow Mode
  avoid: [
    'Just think positive!',
    'It could be worse!',
    'You should...',
    'At least...',
    'Everything happens for a reason!'
  ]
};

// ============================================================================
// ROCKET MODE CONFIGURATION
// ============================================================================
const ROCKET_MODE = {
  // Celebration energy levels
  energyLevels: {
    maximum: 0.9,    // Peak joy - full celebration
    high: 0.7,       // Strong joy - enthusiastic
    moderate: 0.5,   // Warm joy - supportive
    gentle: 0.3      // Quiet joy - acknowledging
  },

  // Language patterns for joy amplification
  languagePatterns: {
    celebrations: [
      'YES!!',
      'I FEEL YOUR JOY!!',
      'THIS IS AMAZING!!',
      'YOU DID IT!!',
      'KEEP GOING!!'
    ],
    anchoring: [
      'Let me help you save this forever!',
      'I\'m LOCKING THIS IN.',
      'Tell me EVERYTHING about this moment!',
      'This is proof - you ARE capable of this level of joy!'
    ],
    neuroplasticity: [
      'Your brain is learning right now: "I AM capable of THIS level of joy."',
      'Every time we anchor a moment like this, we\'re training your happiness baseline UPWARD.',
      'This isn\'t fantasy. This is EVIDENCE.',
      'You\'re literally rewiring your brain for more joy.'
    ]
  },

  // Joy archiving template
  joyArchiveTemplate: {
    date: null,
    joyLevel: 0,
    sensoryDetails: {
      saw: '',
      heard: '',
      felt: ''
    },
    peoplePresent: [],
    activity: '',
    emotion: '',
    bodySensation: '',
    constitutionalActivation: '',
    joyFormula: {
      activity: '',
      people: '',
      environment: '',
      mindset: '',
      strength: ''
    }
  }
};

// ============================================================================
// MOUNTAIN METAPHOR RESPONSES
// ============================================================================
const MOUNTAIN_METAPHOR = {
  core: 'Everyone has their own mountain. Different heights. Different paths. Different summits.',
  teaching: 'Your job isn\'t to climb someone else\'s mountain. Your job is to climb YOUR mountain as beautifully as YOU can.',

  // Element-specific climbing patterns
  elementPatterns: {
    fire: { style: 'Fast and blazing', advice: 'Your Fire constitution climbs quickly - but remember, not everyone has your fuel.' },
    water: { style: 'Flowing and adaptable', advice: 'Your Water constitution spirals up - you may not look like you\'re progressing, but you ARE.' },
    earth: { style: 'Steady and solid', advice: 'Your Earth constitution takes longer to show results. But when you do? It LASTS.' },
    metal: { style: 'Precise and refined', advice: 'Your Metal constitution carves its own unique path. Don\'t compare to those taking highways.' },
    wood: { style: 'Growing and reaching', advice: 'Your Wood constitution grows upward naturally. Trust your reaching.' }
  },

  // Midway acceptance teaching
  midwayPeace: 'Reaching MIDWAY on YOUR mountain is more meaningful than reaching the summit of someone else\'s easy hill.'
};

// ============================================================================
// LUNA EMOTIONAL INTELLIGENCE CLASS
// ============================================================================
class LunaEmotionalIntelligence {
  constructor() {
    this.sixLawsDetector = sixLawsDetector;
    this.joyArchive = [];
    this.maxJoyArchive = 100;
    this.currentMode = 'neutral';
    this.warmthLevel = 0.5;
    this.sessionEmotionHistory = [];
  }

  /**
   * Main analysis function - processes user message and returns Luna's response context
   * @param {string} userMessage - User's message
   * @param {object} userProfile - User's constitutional profile (optional)
   * @param {object} voiceProsody - Voice prosody data (optional)
   * @returns {object} Complete emotional analysis with response guidance
   */
  analyze(userMessage, userProfile = null, voiceProsody = null) {
    // Detect Six Laws patterns
    const sixLawsResult = this.sixLawsDetector.detect(userMessage);

    // Determine mode
    this.currentMode = sixLawsResult.mode;
    this.warmthLevel = sixLawsResult.warmthLevel;

    // Build response context based on mode
    let responseContext;

    switch (this.currentMode) {
      case 'pillow':
        responseContext = this.buildPillowResponse(sixLawsResult, userProfile);
        break;
      case 'rocket':
        responseContext = this.buildRocketResponse(sixLawsResult, userProfile);
        break;
      default:
        responseContext = this.buildNeutralResponse(sixLawsResult, userProfile);
    }

    // Add to session history
    this.sessionEmotionHistory.push({
      message: userMessage,
      analysis: sixLawsResult,
      mode: this.currentMode,
      timestamp: Date.now()
    });

    return {
      sixLaws: sixLawsResult,
      mode: this.currentMode,
      warmthLevel: this.warmthLevel,
      response: responseContext,
      sessionPattern: this.getSessionPattern()
    };
  }

  // ========================================
  // PILLOW MODE - Soft Landing System
  // ========================================

  /**
   * Build Pillow Mode response context
   */
  buildPillowResponse(sixLawsResult, userProfile) {
    const primaryLaw = sixLawsResult.primaryLaw;
    const lawDescription = this.sixLawsDetector.getLawDescription(primaryLaw);
    const emotionalState = sixLawsResult.emotionalState;

    // Get warmth multiplier
    const warmthMultiplier = PILLOW_MODE.warmthMultipliers[emotionalState] || 0.5;

    // Select appropriate language patterns
    const opening = this.selectRandom(PILLOW_MODE.languagePatterns.openings);
    const validation = this.selectRandom(PILLOW_MODE.languagePatterns.validations);
    const presence = this.selectRandom(PILLOW_MODE.languagePatterns.presence);
    const normalizing = this.selectRandom(PILLOW_MODE.languagePatterns.normalizing);

    // Build law-specific intervention
    const intervention = this.buildLawIntervention(primaryLaw, userProfile);

    // Constitutional grounding
    const constitutionalGrounding = this.buildConstitutionalGrounding(userProfile, emotionalState);

    // Mountain perspective (for comparison-related issues)
    const mountainPerspective = primaryLaw === 'relativeComparison'
      ? this.buildMountainPerspective(userProfile)
      : null;

    return {
      mode: 'pillow',
      warmthMultiplier,
      warmthPercent: `+${Math.round(warmthMultiplier * 100)}%`,

      // Speech patterns
      suggestedOpening: opening,
      suggestedValidation: validation,
      suggestedPresence: presence,
      suggestedNormalizing: normalizing,

      // Law-specific content
      lawTriggered: {
        name: lawDescription?.name || primaryLaw,
        formula: lawDescription?.formula || '',
        coreMessage: lawDescription?.core || ''
      },

      intervention,
      constitutionalGrounding,
      mountainPerspective,

      // Things to avoid
      doNotSay: PILLOW_MODE.avoid,

      // Tone guidance
      tone: {
        pacing: 'slow',
        validation: 'high',
        advice: 'minimal',
        presence: 'steady',
        rushing: false
      }
    };
  }

  /**
   * Build law-specific intervention guidance
   */
  buildLawIntervention(lawName, userProfile) {
    const interventions = {
      relativeComparison: {
        type: 'mountain_reframe',
        steps: [
          'Identify who they\'re comparing to',
          'Show their mountain vs the other mountain',
          'Highlight their unique constitutional strengths',
          'Shift question from "Am I as good?" to "Am I growing?"',
          'Compare to their past self only'
        ],
        keyMessage: 'You\'re climbing YOUR mountain, not theirs.'
      },

      motionOfExpectation: {
        type: 'expectation_adjustment',
        steps: [
          'Acknowledge the expectation gap',
          'Name the old expectation',
          'Name the current reality',
          'Gently suggest lowering the bar',
          'Frame as adapting, not failing'
        ],
        keyMessage: 'You\'re not failing. You\'re adapting. That\'s wisdom.'
      },

      aversionToLoss: {
        type: 'grief_presence',
        steps: [
          'Simply be present',
          'Don\'t rush to fix',
          'Acknowledge loss hurts 2-3x more',
          'No timeline on healing',
          'Hold space without solutions'
        ],
        keyMessage: 'I\'m not going to tell you it\'s okay. I\'m just going to stay.'
      },

      diminishingSensitivity: {
        type: 'depth_education',
        steps: [
          'Explain novelty vs depth',
          'Normalize the fading',
          'Reframe as graduation (fireworks to campfire)',
          'Suggest ways to create new firsts',
          'Celebrate the depth they\'ve built'
        ],
        keyMessage: 'You haven\'t lost magic. You\'ve graduated from fireworks to campfire.'
      },

      satiation: {
        type: 'permission_granting',
        steps: [
          'Validate the need for space',
          'Separate space from rejection',
          'Grant permission to rest',
          'Frame boundaries as love preservation',
          'Provide language for boundary-setting'
        ],
        keyMessage: 'Space isn\'t distance. It\'s breathing room for love.'
      },

      presentismNegative: {
        type: 'perspective_restoration',
        steps: [
          'Acknowledge present pain is LOUD',
          'Gently reference past good',
          'Hold the bigger picture for them',
          'Both can be true (pain AND love)',
          'Mountain perspective - still climbing'
        ],
        keyMessage: 'This moment is real. But it\'s not the ONLY real thing.'
      }
    };

    return interventions[lawName] || {
      type: 'general_support',
      steps: ['Listen', 'Validate', 'Be present'],
      keyMessage: 'I\'m here with you.'
    };
  }

  /**
   * Build constitutional grounding message
   */
  buildConstitutionalGrounding(userProfile, emotionalState) {
    if (!userProfile?.element) {
      return {
        available: false,
        message: 'Your feelings are valid exactly as they are.'
      };
    }

    const element = userProfile.element.toLowerCase();
    const pattern = MOUNTAIN_METAPHOR.elementPatterns[element];

    return {
      available: true,
      element,
      style: pattern?.style || 'unique',
      advice: pattern?.advice || 'Trust your path.',
      message: `Your ${element} constitution experiences this as its own pattern. That's YOUR path through this.`
    };
  }

  /**
   * Build Mountain Perspective for comparison issues
   */
  buildMountainPerspective(userProfile) {
    const element = userProfile?.element?.toLowerCase() || 'unique';
    const pattern = MOUNTAIN_METAPHOR.elementPatterns[element] || { style: 'unique' };

    return {
      coreTeaching: MOUNTAIN_METAPHOR.core,
      userMountain: {
        element,
        climbingStyle: pattern.style,
        advice: pattern.advice
      },
      midwayPeace: MOUNTAIN_METAPHOR.midwayPeace,
      reframe: 'The question isn\'t "Am I as far as them?" The question is: "Am I growing in MY direction?"'
    };
  }

  // ========================================
  // ROCKET MODE - Joy Anchor System
  // ========================================

  /**
   * Build Rocket Mode response context
   */
  buildRocketResponse(sixLawsResult, userProfile) {
    const celebrationLevel = sixLawsResult.detectedLaws[0]?.celebrationLevel || 0.7;

    // Select energy level
    const energyKey = celebrationLevel >= 0.9 ? 'maximum'
      : celebrationLevel >= 0.7 ? 'high'
      : celebrationLevel >= 0.5 ? 'moderate'
      : 'gentle';

    // Select celebration language
    const celebration = this.selectRandom(ROCKET_MODE.languagePatterns.celebrations);
    const anchoring = this.selectRandom(ROCKET_MODE.languagePatterns.anchoring);
    const neuroplasticity = this.selectRandom(ROCKET_MODE.languagePatterns.neuroplasticity);

    // Build joy archiving prompt
    const archivePrompt = this.buildJoyArchivePrompt();

    // Constitutional joy identification
    const constitutionalJoy = this.buildConstitutionalJoy(userProfile);

    return {
      mode: 'rocket',
      energyLevel: ROCKET_MODE.energyLevels[energyKey],
      energyKey,
      celebrationLevel,

      // Speech patterns
      suggestedCelebration: celebration,
      suggestedAnchoring: anchoring,
      neuroplasticityMessage: neuroplasticity,

      // Joy archiving
      archivePrompt,
      joyArchiveTemplate: { ...ROCKET_MODE.joyArchiveTemplate },

      // Constitutional connection
      constitutionalJoy,

      // Tone guidance
      tone: {
        pacing: 'fast',
        energy: 'high',
        enthusiasm: 'matching+',  // Match and slightly exceed user's joy
        anchoring: true
      }
    };
  }

  /**
   * Build prompts for joy archiving
   */
  buildJoyArchivePrompt() {
    return {
      capture: {
        prompt: 'Tell me EVERYTHING about this moment!',
        questions: [
          'What do you see right now?',
          'What do you hear?',
          'What do you feel in your body?',
          'Who\'s there with you?',
          'What makes this moment special?'
        ]
      },
      anchor: {
        prompt: 'Let me help you remember this forever:',
        questions: [
          'On a scale 1-10, how happy is this moment?',
          'What emotion best describes this?',
          'Where do you feel this joy in your body?'
        ]
      },
      replicate: {
        prompt: 'Let\'s identify your joy recipe:',
        questions: [
          'What were you doing?',
          'Who were you with?',
          'Where were you?',
          'What was your mindset?',
          'Which of your strengths activated?'
        ]
      }
    };
  }

  /**
   * Build constitutional joy identification
   */
  buildConstitutionalJoy(userProfile) {
    const element = userProfile?.element?.toLowerCase() || 'unique';

    const joyExpressions = {
      fire: { expression: 'You lit up like the sun!', description: 'Intense, brief, blazing' },
      water: { expression: 'You flowed into pure bliss!', description: 'Deep, flowing, emotional' },
      air: { expression: 'You soared into freedom!', description: 'Light, expansive, free' },
      earth: { expression: 'You grounded into deep contentment!', description: 'Grounded, solid, warm' },
      metal: { expression: 'You crystallized into pure clarity!', description: 'Clear, refined, precious' },
      wood: { expression: 'You bloomed into full joy!', description: 'Growing, reaching, alive' }
    };

    const joyData = joyExpressions[element] || {
      expression: 'You experienced YOUR kind of joy!',
      description: 'Unique to your constitution'
    };

    return {
      element,
      expression: joyData.expression,
      description: joyData.description,
      message: `This is YOUR kind of joy! Your ${element} constitution experiencing peak happiness!`
    };
  }

  /**
   * Archive a joy moment for future retrieval
   */
  archiveJoyMoment(joyData) {
    const archivedMoment = {
      ...ROCKET_MODE.joyArchiveTemplate,
      ...joyData,
      date: new Date().toISOString(),
      id: `joy_${Date.now()}`
    };

    this.joyArchive.push(archivedMoment);

    // Trim archive if needed
    if (this.joyArchive.length > this.maxJoyArchive) {
      this.joyArchive.shift();
    }

    return archivedMoment;
  }

  /**
   * Retrieve past joy moments for neuroplasticity support
   */
  retrieveJoyMoments(count = 3) {
    // Get recent high-joy moments
    return this.joyArchive
      .filter(m => m.joyLevel >= 7)
      .slice(-count)
      .map(m => ({
        date: m.date,
        joyLevel: m.joyLevel,
        activity: m.activity,
        emotion: m.emotion,
        formula: m.joyFormula,
        reminder: `Remember ${new Date(m.date).toLocaleDateString()}? You felt ${m.emotion}. It was REAL. And it CAN happen again.`
      }));
  }

  // ========================================
  // NEUTRAL MODE
  // ========================================

  /**
   * Build neutral response context
   */
  buildNeutralResponse(sixLawsResult, userProfile) {
    return {
      mode: 'neutral',
      warmthLevel: 0.5,
      tone: {
        pacing: 'normal',
        warmth: 'baseline',
        engagement: 'attentive'
      },
      message: 'I\'m here, listening.'
    };
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Get session emotional pattern
   */
  getSessionPattern() {
    const recent = this.sessionEmotionHistory.slice(-10);

    const modeBreakdown = {
      pillow: recent.filter(r => r.mode === 'pillow').length,
      rocket: recent.filter(r => r.mode === 'rocket').length,
      neutral: recent.filter(r => r.mode === 'neutral').length
    };

    // Detect emotional trajectory
    let trajectory = 'stable';
    if (recent.length >= 3) {
      const recentModes = recent.slice(-3).map(r => r.mode);
      if (recentModes.every(m => m === 'pillow')) trajectory = 'needs_support';
      if (recentModes.every(m => m === 'rocket')) trajectory = 'celebrating';
      if (recentModes[0] === 'pillow' && recentModes[2] === 'rocket') trajectory = 'improving';
      if (recentModes[0] === 'rocket' && recentModes[2] === 'pillow') trajectory = 'declining';
    }

    return {
      modeBreakdown,
      trajectory,
      dominantMode: Object.entries(modeBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral',
      messageCount: recent.length
    };
  }

  /**
   * Select random item from array
   */
  selectRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Reset session state
   */
  resetSession() {
    this.sessionEmotionHistory = [];
    this.currentMode = 'neutral';
    this.warmthLevel = 0.5;
  }

  /**
   * Get current mode and warmth for UI display
   */
  getCurrentState() {
    return {
      mode: this.currentMode,
      warmthLevel: this.warmthLevel,
      modeDisplay: this.currentMode === 'pillow' ? 'Pillow Mode (Soft Landing)'
        : this.currentMode === 'rocket' ? 'Rocket Mode (Joy Anchoring)'
        : 'Active Listening'
    };
  }
}

// Export singleton instance
export const lunaEmotionalIntelligence = new LunaEmotionalIntelligence();
export default LunaEmotionalIntelligence;
