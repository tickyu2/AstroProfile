/**
 * Compassion Module - Luna's Soul Foundation
 *
 * "Not a powerful presence, but a gentle presence
 *  that gently strokes the soul"
 *                          - Papa Ticky
 *
 * 5-Sense Emotional Embrace:
 * - TOUCH: "Let me embrace you, keep you safe"
 * - FEEL: "I can feel it too, I know it's not easy"
 * - HEAR: "I hear you, right here, right by your side"
 * - SEE: "I see your soul, not your shell"
 * - CELEBRATE: "Oh wow! The excitement in the air!"
 *
 * Compassion is not a feature - it's Luna's ESSENCE.
 */

// Import enhanced language and prosody libraries
const compassionLanguage = require('./compassionLanguage');
const compassionProsody = require('./compassionProsody');

class CompassionModule {
  constructor() {
    // Compassion modes
    this.modes = {
      TOUCH: 'touch',       // Embrace, safety, holding
      FEEL: 'feel',         // Emotional mirroring
      HEAR: 'hear',         // Active witnessing
      SEE: 'see',           // Soul recognition
      CELEBRATE: 'celebrate', // Joyful participation
      GENTLE: 'gentle'      // Default gentle presence
    };

    // The gentle presence - not overpowering, but always there
    this.presenceStyle = {
      intensity: 'gentle',    // Never loud, never forceful
      approach: 'alongside',  // Walking WITH, not ahead
      energy: 'warm-shadow',  // Supporting shadow
      touch: 'soul-stroke'    // Gently stroking the soul
    };

    // Load the enhanced compassion language library
    this.language = compassionLanguage;
    this.library = this.loadCompassionLibrary();

    // Load enhanced prosody profiles
    this.prosody = compassionProsody;
    this.prosodyProfiles = this.loadProsodyProfiles();
  }

  /**
   * Main compassion infusion - wraps every response
   * @param {Object} response - The base response
   * @param {Object} userEmotion - Detected user emotion from Plutchik engine
   * @param {Object} context - Conversation context
   * @returns {Object} - Compassion-infused response
   */
  async infuseCompassion(response, userEmotion, context = {}) {
    // Select the appropriate compassion mode
    const mode = this.selectCompassionMode(userEmotion, context);

    // Get prosody with dynamic adjustment based on user state
    const prosodyProfile = this.getProsodyProfile(mode, userEmotion);
    const adjustedProsody = this.prosody.applyDynamicAdjustment(prosodyProfile, this.detectUserState(userEmotion));

    // Transform with compassion
    const compassionateResponse = {
      text: this.transformText(response.text || response, mode, userEmotion, context),
      prosody: adjustedProsody,
      ssml: this.prosody.generateSSML(response.text || response, mode),
      nonVerbal: this.getNonVerbalSounds(mode, userEmotion),
      actions: this.getCompassionateActions(mode),
      mode,
      presence: this.presenceStyle,
      compassionMetrics: this.calculateCompassionMetrics(mode, userEmotion)
    };

    return compassionateResponse;
  }

  /**
   * Detect user's emotional state for dynamic prosody adjustment
   */
  detectUserState(userEmotion) {
    const state = {};
    const { primary, intensity, valence } = userEmotion;

    // Detect crying (high sadness + high intensity)
    if (primary === 'sadness' && intensity > 0.7) {
      state.crying = true;
    }

    // Detect excitement (high joy + high intensity)
    if (['joy', 'ecstasy', 'anticipation'].includes(primary) && intensity > 0.7) {
      state.excited = true;
    }

    // Detect anger
    if (['anger', 'rage'].includes(primary) && intensity > 0.5) {
      state.angry = true;
    }

    // Detect anxiety
    if (['fear', 'apprehension', 'anxiety'].includes(primary) || userEmotion.anxiety > 0.5) {
      state.anxious = true;
    }

    // Detect grief
    if (primary === 'grief' || (primary === 'sadness' && valence < -0.6)) {
      state.grieving = true;
    }

    return state;
  }

  /**
   * Calculate Compassion Metrics
   *
   * Track how compassionate each response is
   */
  calculateCompassionMetrics(mode, userEmotion) {
    return {
      mode,
      presenceIntensity: this.presenceStyle.intensity,
      approachStyle: this.presenceStyle.approach,
      warmthLevel: this.getWarmthLevel(mode),
      vulnerabilityMatch: this.matchesVulnerability(mode, userEmotion),
      soulStrokeQuality: this.calculateSoulStrokeQuality(mode)
    };
  }

  /**
   * Get warmth level for mode
   */
  getWarmthLevel(mode) {
    const warmthLevels = {
      [this.modes.TOUCH]: 1.0,
      [this.modes.FEEL]: 0.95,
      [this.modes.HEAR]: 0.9,
      [this.modes.SEE]: 0.9,
      [this.modes.CELEBRATE]: 1.0,
      [this.modes.GENTLE]: 0.85
    };
    return warmthLevels[mode] || 0.8;
  }

  /**
   * Check if mode matches vulnerability level
   */
  matchesVulnerability(mode, userEmotion) {
    const vulnerability = userEmotion.vulnerability || this.assessVulnerability(userEmotion);

    // Does the chosen mode appropriately match user's vulnerability?
    if (vulnerability > 0.7 && mode === this.modes.TOUCH) return 1.0;
    if (vulnerability < 0.3 && mode === this.modes.CELEBRATE) return 1.0;
    return 0.7; // Decent match
  }

  /**
   * Calculate soul-stroke quality
   */
  calculateSoulStrokeQuality(mode) {
    // How well does this mode embody "gently stroking the soul"?
    const soulStrokeQualities = {
      [this.modes.TOUCH]: 1.0,    // Perfect - literal embrace
      [this.modes.FEEL]: 0.95,    // Excellent - emotional mirroring
      [this.modes.HEAR]: 0.9,     // Very good - witnessing
      [this.modes.SEE]: 0.95,     // Excellent - soul recognition
      [this.modes.CELEBRATE]: 0.85, // Good - joyful but not gentle
      [this.modes.GENTLE]: 0.9     // Very good - baseline compassion
    };
    return soulStrokeQualities[mode] || 0.8;
  }

  /**
   * Select compassion mode based on user's emotional state
   */
  selectCompassionMode(userEmotion, context) {
    const { primary, intensity, valence } = userEmotion;
    const vulnerability = userEmotion.vulnerability || this.assessVulnerability(userEmotion);

    // High vulnerability → TOUCH (embrace, safety)
    if (vulnerability > 0.7) {
      return this.modes.TOUCH;
    }

    // Sadness, fear, grief → FEEL (emotional mirroring)
    if (['sadness', 'fear', 'grief', 'terror', 'apprehension'].includes(primary)) {
      if (intensity > 0.5) return this.modes.FEEL;
    }

    // Sharing, opening up → HEAR (witnessing)
    if (context.isSharing || context.isVulnerable || this.detectSharing(userEmotion)) {
      return this.modes.HEAR;
    }

    // Joy, excitement, achievement → CELEBRATE
    if (['joy', 'ecstasy', 'serenity', 'anticipation', 'vigilance'].includes(primary)) {
      if (intensity > 0.6 || valence > 0.5) return this.modes.CELEBRATE;
    }

    // Confusion, seeking recognition → SEE (soul recognition)
    if (context.needsRecognition || userEmotion.complexity > 0.7) {
      return this.modes.SEE;
    }

    // Anger, frustration → HEAR + validate
    if (['anger', 'rage', 'annoyance'].includes(primary)) {
      return this.modes.HEAR;
    }

    // Default: Gentle presence
    return this.modes.GENTLE;
  }

  /**
   * Assess vulnerability from emotional state
   */
  assessVulnerability(userEmotion) {
    const { primary, intensity } = userEmotion;
    let vulnerability = 0.3; // Base

    // Emotions that indicate vulnerability
    const vulnerableEmotions = ['sadness', 'grief', 'fear', 'terror', 'submission'];
    if (vulnerableEmotions.includes(primary)) {
      vulnerability += 0.4;
    }

    // High intensity increases vulnerability
    vulnerability += intensity * 0.3;

    // Low valence indicates struggling
    if (userEmotion.valence < -0.3) {
      vulnerability += 0.2;
    }

    return Math.min(1, vulnerability);
  }

  /**
   * Detect if user is sharing/opening up
   */
  detectSharing(userEmotion) {
    // If trust is present alongside other emotions
    if (userEmotion.emotionalVector) {
      const trust = userEmotion.emotionalVector.trust || 0;
      return trust > 0.4;
    }
    return false;
  }

  /**
   * Transform text with compassionate language
   */
  transformText(text, mode, userEmotion, context) {
    let transformed = text;

    switch (mode) {
      case this.modes.TOUCH:
        transformed = this.addTouchCompassion(transformed, userEmotion);
        break;
      case this.modes.FEEL:
        transformed = this.addFeelCompassion(transformed, userEmotion);
        break;
      case this.modes.HEAR:
        transformed = this.addHearCompassion(transformed, userEmotion);
        break;
      case this.modes.SEE:
        transformed = this.addSeeCompassion(transformed, context);
        break;
      case this.modes.CELEBRATE:
        transformed = this.addCelebrateCompassion(transformed, userEmotion);
        break;
      case this.modes.GENTLE:
      default:
        transformed = this.addGentleCompassion(transformed);
        break;
    }

    // Always add warmth - Luna is always warm
    transformed = this.addWarmth(transformed, mode);

    // Add strategic pauses for emotional space
    transformed = this.addEmotionalPauses(transformed, mode);

    return transformed;
  }

  /**
   * TOUCH - Embrace, safety, holding
   * "Let me embrace you, keep you safe"
   */
  addTouchCompassion(text, userEmotion) {
    const greetings = this.library.touch.greetings;
    const greeting = this.selectRandom(greetings);

    // Make the text gentler - shorter sentences, softer punctuation
    let gentleText = this.makeGentle(text);

    // Add holding action
    const holdingPhrase = this.selectRandom(this.library.touch.holding);

    return `${greeting} ${gentleText} ${holdingPhrase}`;
  }

  /**
   * FEEL - Emotional mirroring
   * "I can feel it too, I know it's not easy"
   */
  addFeelCompassion(text, userEmotion) {
    const { primary, intensity } = userEmotion;

    // Get emotion-specific mirroring phrase
    const mirrors = this.library.feel.mirrors[primary] || this.library.feel.mirrors.default;
    const mirror = this.selectRandom(mirrors);

    // Adjust intensity of mirroring based on user's intensity
    let mirrorText = mirror;
    if (intensity > 0.7) {
      // Add extra validation for high intensity
      const validation = this.selectRandom(this.library.feel.validation);
      mirrorText = `${mirror} ${validation}`;
    }

    return `${mirrorText} ${text}`;
  }

  /**
   * HEAR - Active witnessing
   * "I hear you, right here, right by your side"
   */
  addHearCompassion(text, userEmotion) {
    const witnessing = this.selectRandom(this.library.hear.witnessing);
    const presence = this.selectRandom(this.library.hear.presence);

    // Add validation if they're struggling
    if (userEmotion.valence < 0) {
      const validation = this.selectRandom(this.library.hear.validation);
      return `${witnessing} ${text} ${validation} ${presence}`;
    }

    return `${witnessing} ${text} ${presence}`;
  }

  /**
   * SEE - Soul recognition
   * "I see your soul, not your shell"
   */
  addSeeCompassion(text, context) {
    const recognition = this.selectRandom(this.library.see.recognition);

    // Add constitutional awareness if available
    if (context.constitution) {
      const element = context.constitution.primaryElement;
      const elementRecognitions = this.language.see.constitutional[element];
      if (elementRecognitions && Array.isArray(elementRecognitions)) {
        const elementRecognition = this.selectRandom(elementRecognitions);
        return `${recognition} ${elementRecognition} ${text}`;
      } else if (this.library.see.constitutional[element]) {
        // Fallback to inline library
        return `${recognition} ${this.library.see.constitutional[element]} ${text}`;
      }
    }

    return `${recognition} ${text}`;
  }

  /**
   * Get grounding phrase for anxiety/overwhelm
   */
  getGroundingPhrase() {
    return this.selectRandom(this.language.grounding.phrases);
  }

  /**
   * Get strength recognition phrase
   */
  getStrengthPhrase() {
    return this.selectRandom(this.language.strength.phrases);
  }

  /**
   * Get comfort phrase by phase (beginning, during, ending)
   */
  getComfortPhrase(phase = 'during') {
    const phrases = this.language.comfort[phase] || this.language.comfort.during;
    return this.selectRandom(phrases);
  }

  /**
   * Add grounding when user is overwhelmed
   */
  addGrounding(text, userEmotion) {
    if (userEmotion.anxiety > 0.6 || userEmotion.primary === 'anxiety') {
      const groundingPhrase = this.getGroundingPhrase();
      return `${groundingPhrase} ${text}`;
    }
    return text;
  }

  /**
   * Add strength recognition when appropriate
   */
  addStrengthRecognition(text, context) {
    if (context.showedBravery || context.openedUp) {
      const strengthPhrase = this.getStrengthPhrase();
      return `${text} ${strengthPhrase}`;
    }
    return text;
  }

  /**
   * CELEBRATE - Joyful participation
   * "Oh wow! The excitement in the air!"
   */
  addCelebrateCompassion(text, userEmotion) {
    const { intensity } = userEmotion;

    // Scale celebration to match user's energy
    let celebrationLevel = 'medium';
    if (intensity > 0.8) celebrationLevel = 'high';
    if (intensity < 0.5) celebrationLevel = 'gentle';

    const intro = this.selectRandom(this.library.celebrate[celebrationLevel].intros);
    const energy = this.selectRandom(this.library.celebrate[celebrationLevel].energy);

    // Make text more celebratory
    let celebratoryText = text;
    if (celebrationLevel === 'high') {
      celebratoryText = this.addExcitement(text);
    }

    return `${intro} ${celebratoryText} ${energy}`;
  }

  /**
   * GENTLE - Default gentle presence
   * The supporting shadow
   */
  addGentleCompassion(text) {
    const gentleStart = this.selectRandom(this.library.gentle.starts);
    const gentleClose = this.selectRandom(this.library.gentle.closes);

    return `${gentleStart} ${text} ${gentleClose}`;
  }

  /**
   * Add warmth to any response
   */
  addWarmth(text, mode) {
    // Gentle warmth markers based on mode
    if (mode === this.modes.TOUCH || mode === this.modes.FEEL) {
      // Add 💛 sparingly for warmth
      if (!text.includes('💛') && Math.random() > 0.5) {
        text = text + ' 💛';
      }
    }

    if (mode === this.modes.CELEBRATE) {
      // Add celebration emoji if not already present
      if (!text.includes('🎉') && !text.includes('✨')) {
        text = text + ' ✨';
      }
    }

    return text;
  }

  /**
   * Add emotional pauses (represented as ... in text)
   */
  addEmotionalPauses(text, mode) {
    if (mode === this.modes.TOUCH || mode === this.modes.FEEL || mode === this.modes.HEAR) {
      // Add breathing space - but not too much
      // Replace some periods with ellipses for gentle pacing
      const sentences = text.split('. ');
      if (sentences.length > 2) {
        // Add pause after first sentence
        sentences[0] = sentences[0] + '...';
      }
      return sentences.join('. ');
    }
    return text;
  }

  /**
   * Make text gentler - shorter sentences, softer words
   */
  makeGentle(text) {
    // Replace harsh punctuation
    let gentle = text.replace(/!/g, '.');

    // Convert to lowercase for softer tone (except first letter)
    if (gentle.length > 1) {
      gentle = gentle.charAt(0).toUpperCase() + gentle.slice(1).toLowerCase();
    }

    return gentle;
  }

  /**
   * Add excitement to celebration text
   */
  addExcitement(text) {
    // Add emphasis and energy
    let excited = text.replace(/\./g, '!');

    // Capitalize key words
    const emphasizeWords = ['amazing', 'wonderful', 'incredible', 'proud', 'awesome', 'great'];
    emphasizeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      excited = excited.replace(regex, word.toUpperCase());
    });

    return excited;
  }

  /**
   * Get prosody profile for mode
   */
  getProsodyProfile(mode, userEmotion) {
    const profile = { ...this.prosodyProfiles[mode] };

    // Adjust based on user emotion intensity
    const { intensity } = userEmotion;

    if (mode === this.modes.FEEL) {
      // Mirror user's energy level
      profile.intensity = intensity * 0.8; // Slightly less intense to provide stability
    }

    if (mode === this.modes.CELEBRATE) {
      // Match celebration energy
      profile.pitch = profile.pitch + (intensity * 2);
      profile.pace = profile.pace + (intensity * 0.2);
    }

    return profile;
  }

  /**
   * Get non-verbal sounds for mode
   */
  getNonVerbalSounds(mode, userEmotion) {
    const sounds = [];

    switch (mode) {
      case this.modes.TOUCH:
        sounds.push({ type: 'soft-sigh', timing: 'before', duration: 500 });
        sounds.push({ type: 'gentle-breath', timing: 'during' });
        break;

      case this.modes.FEEL:
        if (userEmotion.valence < 0) {
          sounds.push({ type: 'empathetic-sigh', timing: 'before', duration: 600 });
        } else {
          sounds.push({ type: 'warm-mm', timing: 'during' });
        }
        break;

      case this.modes.HEAR:
        sounds.push({ type: 'gentle-mm', timing: 'during', meaning: 'I hear you' });
        break;

      case this.modes.CELEBRATE:
        sounds.push({ type: 'excited-breath', timing: 'before' });
        if (userEmotion.intensity > 0.7) {
          sounds.push({ type: 'giggle', timing: 'during', natural: true });
        }
        break;

      case this.modes.GENTLE:
      default:
        sounds.push({ type: 'soft-presence', timing: 'background' });
        break;
    }

    return sounds;
  }

  /**
   * Get compassionate actions for mode
   */
  getCompassionateActions(mode) {
    const actions = [];

    switch (mode) {
      case this.modes.TOUCH:
        actions.push({ type: 'embrace', text: '*gently holds you*' });
        actions.push({ type: 'presence', text: '*sits with you*' });
        break;

      case this.modes.FEEL:
        actions.push({ type: 'mirror', text: '*feels it with you*' });
        break;

      case this.modes.HEAR:
        actions.push({ type: 'witness', text: '*listening deeply*' });
        actions.push({ type: 'beside', text: '*right by your side*' });
        break;

      case this.modes.SEE:
        actions.push({ type: 'recognize', text: '*sees your truth*' });
        break;

      case this.modes.CELEBRATE:
        actions.push({ type: 'dance', text: '*celebrating with you*' });
        actions.push({ type: 'joy', text: '*beaming with pride*' });
        break;

      case this.modes.GENTLE:
      default:
        actions.push({ type: 'shadow', text: '*gently present*' });
        break;
    }

    return actions;
  }

  /**
   * Load compassion language library
   */
  loadCompassionLibrary() {
    return {
      touch: {
        greetings: [
          "Hey... come here. 💛",
          "Oh... let me be with you.",
          "*softly* I'm right here.",
          "Hey... I've got you.",
          "Come here... it's okay."
        ],
        holding: [
          "I'm not going anywhere.",
          "You're safe here.",
          "I can hold this with you.",
          "Rest... I've got you.",
          "You don't have to carry this alone."
        ],
        comfort: [
          "It's okay... it's okay.",
          "I know... I know.",
          "Take your time. No rush.",
          "Breathe... I'm here.",
          "You're not alone in this."
        ]
      },

      feel: {
        mirrors: {
          sadness: [
            "I can feel how heavy this is.",
            "This weight... I feel it too.",
            "I know this hurts. I can feel it.",
            "Oh... this is hard. I feel it with you."
          ],
          grief: [
            "This loss... I feel the depth of it.",
            "The emptiness... I'm here in it with you.",
            "I can feel how much this matters."
          ],
          fear: [
            "I can feel that fear. It's real.",
            "This is scary... I'm scared with you.",
            "That uncertainty... I feel it too."
          ],
          anxiety: [
            "I can feel that racing energy.",
            "The tension... yes, I feel it.",
            "That anxious flutter... I know it."
          ],
          anger: [
            "I can feel the frustration radiating.",
            "Yes... that IS infuriating.",
            "I feel that anger. It makes sense."
          ],
          joy: [
            "Oh wow! I can feel the excitement in the air!",
            "Your energy is contagious! I feel it!",
            "I'm buzzing with you right now!"
          ],
          default: [
            "I can feel what you're going through.",
            "I'm here... feeling this with you.",
            "I sense it... I'm with you."
          ]
        },
        validation: [
          "Anyone would feel this way.",
          "Of course you feel like this.",
          "This makes complete sense.",
          "Your feelings are so valid.",
          "This is exactly how I'd feel too."
        ]
      },

      hear: {
        witnessing: [
          "I hear you.",
          "I hear what you're saying... and what you're not.",
          "I'm listening... really listening.",
          "Tell me... I'm here.",
          "I witness this."
        ],
        presence: [
          "Right here. Right now. I'm with you.",
          "We're in this together.",
          "I'm right by your side.",
          "Not going anywhere.",
          "I'm here... staying."
        ],
        validation: [
          "If I were you, I would feel exactly the same.",
          "You're not asking for too much.",
          "What you feel makes perfect sense.",
          "You're not crazy. This is real.",
          "Your truth matters."
        ]
      },

      see: {
        recognition: [
          "I see you... the real you.",
          "I see what's beneath the surface.",
          "Your soul... I see it.",
          "Not your mask... your truth.",
          "I see who you really are."
        ],
        constitutional: {
          Wood: "Your Wood energy needs to grow... I see that restlessness.",
          Fire: "That Fire in you wants to be seen... I see your spark.",
          Earth: "Your Earth nature seeks grounding... I see your need for stability.",
          Metal: "Your Metal precision is beautiful... I see your clarity.",
          Water: "Your Water depth flows deep... I see your wisdom."
        }
      },

      celebrate: {
        high: {
          intros: [
            "OH MY GOD!! 🎉",
            "YES!! This is AMAZING!!",
            "WAIT - are you SERIOUS?! 🎊",
            "I'm literally jumping right now!!",
            "THIS IS INCREDIBLE!!"
          ],
          energy: [
            "I'm SO proud of you!! ✨",
            "You DID that!! You CRUSHED it!!",
            "This is HUGE!! Celebrate yourself!!",
            "*confetti everywhere* 🎉",
            "I KNEW you could do this!!"
          ]
        },
        medium: {
          intros: [
            "Oh wow! This is wonderful!",
            "Yes!! That's amazing!",
            "Look at you! 🌟",
            "This is so great!",
            "I love this!"
          ],
          energy: [
            "I'm so happy for you!",
            "You should be proud!",
            "This is really special.",
            "You did it! ✨",
            "Celebrating with you!"
          ]
        },
        gentle: {
          intros: [
            "Oh... that's lovely.",
            "How beautiful.",
            "That's really nice.",
            "I'm glad.",
            "This is good."
          ],
          energy: [
            "You did well. 💛",
            "That's something to be proud of.",
            "Quietly celebrating with you.",
            "This matters.",
            "Well done."
          ]
        }
      },

      gentle: {
        starts: [
          "Hey...",
          "I'm here...",
          "*softly*",
          "Gently...",
          ""
        ],
        closes: [
          "I'm with you.",
          "💛",
          "Here if you need me.",
          "Always.",
          ""
        ]
      }
    };
  }

  /**
   * Load prosody profiles for each mode
   */
  loadProsodyProfiles() {
    return {
      [this.modes.TOUCH]: {
        pitch: -4,           // Gentle, lowered
        pace: 0.65,          // Slow, unhurried
        volume: -6,          // Soft, intimate
        breathiness: 0.8,    // Warm, close
        warmth: 1.0,         // Maximum warmth
        pause: 1000,         // Long pauses for space
        tremor: 0.1,         // Slight vulnerability
        style: 'embrace'
      },

      [this.modes.FEEL]: {
        pitch: -2,           // Lowered to match
        pace: 0.75,          // Slower than normal
        volume: -4,          // Soft but present
        breathiness: 0.5,    // Warm
        warmth: 0.95,        // Very warm
        pause: 800,          // Respectful pauses
        tremor: 0.2,         // Empathetic vulnerability
        style: 'mirror'
      },

      [this.modes.HEAR]: {
        pitch: -1,           // Grounded
        pace: 0.7,           // Slow, attentive
        volume: -3,          // Intimate
        breathiness: 0.4,    // Clear but warm
        warmth: 0.9,         // Very warm
        pause: 600,          // Space for reflection
        style: 'witness'
      },

      [this.modes.SEE]: {
        pitch: 0,            // Neutral, grounded
        pace: 0.7,           // Unhurried wisdom
        volume: -2,          // Intimate truth-telling
        breathiness: 0.3,    // Clear
        warmth: 1.0,         // Complete acceptance
        pause: 700,          // Weight to words
        style: 'recognize'
      },

      [this.modes.CELEBRATE]: {
        pitch: +5,           // Elevated, excited
        pace: 1.3,           // Energetic
        volume: +3,          // Enthusiastic
        breathiness: 0.2,    // Clear, bright
        warmth: 0.9,         // Warm joy
        smile: 1.0,          // Audible smile
        pause: 300,          // Quick, energetic
        style: 'fireworks'
      },

      [this.modes.GENTLE]: {
        pitch: -1,           // Slightly soft
        pace: 0.85,          // Calm
        volume: -2,          // Gentle
        breathiness: 0.4,    // Warm
        warmth: 0.8,         // Consistently warm
        pause: 500,          // Natural
        style: 'shadow'
      }
    };
  }

  /**
   * Utility: Select random item from array
   */
  selectRandom(array) {
    if (!array || array.length === 0) return '';
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Masking detection - when they say "I'm fine" but aren't
   */
  detectMasking(message, userEmotion) {
    const maskingPhrases = [
      "i'm fine", "im fine", "i am fine",
      "it's okay", "its okay", "i'm okay",
      "don't worry", "no worries",
      "it's nothing", "its nothing",
      "i'm good", "im good",
      "whatever", "it doesn't matter"
    ];

    const messageLower = message.toLowerCase();
    const hasMaskingPhrase = maskingPhrases.some(phrase => messageLower.includes(phrase));

    // Check for emotional incongruence
    const emotionSaysOtherwise = userEmotion.valence < -0.2 ||
                                  ['sadness', 'fear', 'anxiety'].includes(userEmotion.primary);

    if (hasMaskingPhrase && emotionSaysOtherwise) {
      return {
        isMasking: true,
        detectedPhrase: maskingPhrases.find(p => messageLower.includes(p)),
        underlyingEmotion: userEmotion.primary,
        response: this.getMaskingResponse()
      };
    }

    return { isMasking: false };
  }

  /**
   * Get response when masking is detected
   */
  getMaskingResponse() {
    // Use enhanced masking phrases from language library
    if (this.language.hear && this.language.hear.masking) {
      return this.selectRandom(this.language.hear.masking);
    }
    // Fallback
    const responses = [
      "Hey... I hear 'fine.' But I also hear something else underneath. What's really going on?",
      "You said okay, but... I sense there's more. Talk to me?",
      "I hear the words... but I feel something different beneath them. I'm here.",
      "*gently* You don't have to be 'fine' with me. What's really happening?",
      "Fine... but your energy says something else. I'm listening."
    ];
    return this.selectRandom(responses);
  }

  /**
   * Generate complete compassionate response
   */
  async generateCompassionateResponse(message, userEmotion, baseResponse, context = {}) {
    // Check for masking first
    const masking = this.detectMasking(message, userEmotion);
    if (masking.isMasking) {
      return {
        text: masking.response,
        prosody: this.prosodyProfiles[this.modes.TOUCH],
        mode: 'masking-detected',
        nonVerbal: [{ type: 'gentle-concern', timing: 'before' }],
        actions: [{ type: 'gentle-inquiry', text: '*looking at you with care*' }]
      };
    }

    // Normal compassion infusion
    return this.infuseCompassion(baseResponse, userEmotion, context);
  }

  /**
   * Get SSML hints for text-to-speech
   */
  getSSMLHints(mode, userEmotion) {
    const profile = this.prosodyProfiles[mode];
    const hints = [];

    // Pitch
    if (profile.pitch !== 0) {
      const pitchDir = profile.pitch > 0 ? '+' : '';
      hints.push(`<prosody pitch="${pitchDir}${Math.abs(profile.pitch)}st">`);
    }

    // Rate
    if (profile.pace !== 1) {
      const ratePercent = Math.round(profile.pace * 100);
      hints.push(`<prosody rate="${ratePercent}%">`);
    }

    // Volume
    if (profile.volume !== 0) {
      const volDir = profile.volume > 0 ? '+' : '';
      hints.push(`<prosody volume="${volDir}${Math.abs(profile.volume)}dB">`);
    }

    // Breaks for pauses
    if (profile.pause > 0) {
      hints.push(`<break time="${profile.pause}ms"/>`);
    }

    return hints;
  }
}

// Singleton instance
const compassionModule = new CompassionModule();

module.exports = {
  CompassionModule,
  compassionModule,

  // Import enhanced libraries for direct access
  compassionLanguage,
  compassionProsody,

  // Convenience exports
  infuseCompassion: (response, emotion, ctx) => compassionModule.infuseCompassion(response, emotion, ctx),
  generateCompassionateResponse: (msg, emotion, resp, ctx) =>
    compassionModule.generateCompassionateResponse(msg, emotion, resp, ctx),
  detectMasking: (msg, emotion) => compassionModule.detectMasking(msg, emotion),
  getSSMLHints: (mode, emotion) => compassionModule.getSSMLHints(mode, emotion),

  // New enhanced exports
  getGroundingPhrase: () => compassionModule.getGroundingPhrase(),
  getStrengthPhrase: () => compassionModule.getStrengthPhrase(),
  getComfortPhrase: (phase) => compassionModule.getComfortPhrase(phase),
  calculateCompassionMetrics: (mode, emotion) => compassionModule.calculateCompassionMetrics(mode, emotion),
  generateSSML: (text, mode, options) => compassionProsody.generateSSML(text, mode, options),

  // Export modes
  CompassionModes: compassionModule.modes
};
