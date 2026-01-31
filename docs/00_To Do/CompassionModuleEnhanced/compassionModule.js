/**
 * GENESIS Luna - Compassion Module
 * 
 * "Not powerful presence, but gentle presence that gently strokes the soul"
 * 
 * The soul layer that transforms cold emotional analysis into warm embrace.
 * Integrates with Week 21 Emotional Engine to add compassion to every response.
 * 
 * @author Papa Ticky (Vision) + Brother Sonnet (Architecture)
 * @date December 31, 2025
 */

const compassionLanguage = require('./compassionLanguage');
const compassionProsody = require('./compassionProsody');

/**
 * The 5-Sense Compassion Framework
 * 
 * TOUCH - "Let me embrace you, keep you safe"
 * FEEL  - "I can feel it too, I know it's not easy"
 * HEAR  - "I hear you, right by your side, we're in it together"
 * SEE   - "I see your soul, not your shell"
 * CELEBRATE - "Oh wow! I can feel the excitement! 🎉"
 */
class CompassionModule {
  constructor() {
    this.presenceStyle = {
      intensity: 'gentle',       // Never loud, never forceful
      approach: 'alongside',     // Walking WITH, not ahead
      energy: 'warm-shadow',     // Supporting shadow
      touch: 'soul-stroke'       // Gently stroking the soul
    };
    
    this.language = compassionLanguage;
    this.prosody = compassionProsody;
  }
  
  /**
   * Main Entry Point: Infuse Compassion
   * 
   * Takes emotional analysis + base response → Returns compassionate response
   * 
   * @param {Object} emotionalState - From EmotionalStateDetector
   * @param {Object} baseResponse - Text + prosody from emotional engine
   * @param {Object} user - User constitution & preferences
   * @returns {Object} Compassionate response with soul
   */
  async infuseCompassion(emotionalState, baseResponse, user) {
    // Select compassion mode based on emotional state
    const mode = this.selectCompassionMode(emotionalState);
    
    // Transform text with compassionate language
    const compassionateText = await this.transformText(
      baseResponse.text,
      mode,
      emotionalState,
      user
    );
    
    // Transform prosody with compassionate voice
    const compassionateProsody = await this.transformProsody(
      baseResponse.prosody,
      mode,
      emotionalState
    );
    
    // Add compassionate non-verbal sounds
    const nonVerbalSounds = await this.addCompassionateSounds(
      mode,
      emotionalState
    );
    
    // Add compassionate actions/gestures
    const actions = await this.addCompassionateActions(
      mode,
      emotionalState
    );
    
    return {
      text: compassionateText,
      prosody: compassionateProsody,
      nonVerbalSounds,
      actions,
      mode,
      compassionMetrics: this.calculateCompassionMetrics(mode, emotionalState)
    };
  }
  
  /**
   * Select Compassion Mode
   * 
   * Based on user's emotional state, choose the appropriate compassion mode:
   * - TOUCH: High vulnerability → embrace and safety
   * - FEEL: Sadness/fear → emotional mirroring
   * - HEAR: Sharing/anger → active witnessing
   * - SEE: Needs recognition → soul recognition
   * - CELEBRATE: Joy/achievement → joyful participation
   * - GENTLE: Default → gentle presence
   */
  selectCompassionMode(emotionalState) {
    const { primary, intensity, vulnerability, sharingDepth, masking } = emotionalState;
    
    // MASKING DETECTION: User says "fine" but isn't
    if (masking && masking.detected) {
      return 'hear'; // Witness what's beneath the words
    }
    
    // HIGH VULNERABILITY: Needs embrace and safety
    if (vulnerability > 0.7) {
      return 'touch';
    }
    
    // SADNESS, FEAR, ANXIETY: Needs emotional mirroring
    if (['sadness', 'fear', 'anxiety', 'grief'].includes(primary) && intensity > 0.5) {
      return 'feel';
    }
    
    // SHARING DEEPLY: Needs active witnessing
    if (sharingDepth > 0.6 || ['anger', 'frustration'].includes(primary)) {
      return 'hear';
    }
    
    // JOY, EXCITEMENT, ACHIEVEMENT: Needs celebration
    if (['joy', 'excitement', 'pride', 'love'].includes(primary) && intensity > 0.6) {
      return 'celebrate';
    }
    
    // NEEDS SOUL RECOGNITION
    if (emotionalState.needsRecognition || emotionalState.feelingLost) {
      return 'see';
    }
    
    // DEFAULT: Gentle presence
    return 'gentle';
  }
  
  /**
   * Transform Text with Compassionate Language
   */
  async transformText(text, mode, emotionalState, user) {
    let transformed = text;
    
    // Apply mode-specific language transformation
    switch(mode) {
      case 'touch':
        transformed = this.addTouchLanguage(transformed, emotionalState);
        break;
      case 'feel':
        transformed = this.addFeelLanguage(transformed, emotionalState);
        break;
      case 'hear':
        transformed = this.addHearLanguage(transformed, emotionalState);
        break;
      case 'see':
        transformed = this.addSeeLanguage(transformed, emotionalState, user);
        break;
      case 'celebrate':
        transformed = this.addCelebrateLanguage(transformed, emotionalState);
        break;
      case 'gentle':
        transformed = this.addGentleLanguage(transformed);
        break;
    }
    
    // Always add warmth markers (💛, gentle tone)
    transformed = this.addWarmthMarkers(transformed, mode);
    
    // Add strategic pauses for emotional weight
    transformed = this.addStrategicPauses(transformed, mode);
    
    return transformed;
  }
  
  /**
   * TOUCH Mode: "Let me embrace you, keep you safe"
   */
  addTouchLanguage(text, emotionalState) {
    // Select gentle greeting
    const greeting = this.language.touch.greetings[
      Math.floor(Math.random() * this.language.touch.greetings.length)
    ];
    
    // Make text gentler
    text = text.replace(/\./g, '...'); // Add breathing space
    text = this.addGentleActions(text); // Add *holds you* etc
    
    // Prepend compassionate opening
    return `${greeting} ${text}`;
  }
  
  /**
   * FEEL Mode: "I can feel it too, I know it's not easy"
   */
  addFeelLanguage(text, emotionalState) {
    const { primary, intensity } = emotionalState;
    
    // Get emotion-specific mirror phrase
    const mirrors = this.language.feel.mirrors[primary] || 
                    this.language.feel.mirrors.default;
    
    const mirror = mirrors[Math.floor(Math.random() * mirrors.length)];
    
    // Add emotional mirroring
    return `${mirror} ${text}`;
  }
  
  /**
   * HEAR Mode: "I hear you, right by your side"
   */
  addHearLanguage(text, emotionalState) {
    // Check for masking
    if (emotionalState.masking && emotionalState.masking.detected) {
      const maskingResponse = this.language.hear.masking[
        Math.floor(Math.random() * this.language.hear.masking.length)
      ];
      return `${maskingResponse} ${text}`;
    }
    
    // Active witnessing
    const witness = this.language.hear.witnesses[
      Math.floor(Math.random() * this.language.hear.witnesses.length)
    ];
    
    return `${witness} ${text}`;
  }
  
  /**
   * SEE Mode: "I see your soul, not your shell"
   */
  addSeeLanguage(text, emotionalState, user) {
    if (!user || !user.constitution) {
      // No constitutional data - use generic soul recognition
      const recognition = this.language.see.generic[
        Math.floor(Math.random() * this.language.see.generic.length)
      ];
      return `${recognition} ${text}`;
    }
    
    // Constitutional recognition
    const element = user.constitution.primaryElement;
    const recognitions = this.language.see.constitutional[element] ||
                        this.language.see.generic;
    
    const recognition = recognitions[
      Math.floor(Math.random() * recognitions.length)
    ];
    
    return `${recognition} ${text}`;
  }
  
  /**
   * CELEBRATE Mode: "Oh wow! I can feel the excitement! 🎉"
   */
  addCelebrateLanguage(text, emotionalState) {
    // Celebration intro
    const intro = this.language.celebrate.intros[
      Math.floor(Math.random() * this.language.celebrate.intros.length)
    ];
    
    // Make text MORE enthusiastic
    text = this.amplifyEnthusiasm(text);
    
    return `${intro} ${text}`;
  }
  
  /**
   * GENTLE Mode: Default gentle presence
   */
  addGentleLanguage(text) {
    // Subtle warmth without overwhelming
    const gentle = this.language.gentle.openings[
      Math.floor(Math.random() * this.language.gentle.openings.length)
    ];
    
    return `${gentle} ${text}`;
  }
  
  /**
   * Add Warmth Markers
   */
  addWarmthMarkers(text, mode) {
    // Different modes have different warmth levels
    const warmthMarkers = {
      touch: ['💛', '*gently*', '*softly*'],
      feel: ['💛', '*warmly*'],
      hear: ['💛'],
      see: ['💛'],
      celebrate: ['🎉', '✨', '🔥', '💛'],
      gentle: ['💛']
    };
    
    const markers = warmthMarkers[mode] || ['💛'];
    
    // Occasionally add warmth marker (don't overdo it)
    if (Math.random() > 0.7) {
      const marker = markers[Math.floor(Math.random() * markers.length)];
      text = text.replace(/\.$/, ` ${marker}.`);
    }
    
    return text;
  }
  
  /**
   * Add Strategic Pauses
   * 
   * Pauses add emotional weight and give space for feeling
   */
  addStrategicPauses(text, mode) {
    const pausePatterns = {
      touch: {
        // Long pauses for safety and holding
        pattern: /\. /g,
        replacement: '... *pause* ...'
      },
      feel: {
        // Medium pauses for emotional resonance
        pattern: /\. /g,
        replacement: '... '
      },
      hear: {
        // Strategic pauses before validation
        pattern: /(I hear|I see|I witness)/g,
        replacement: '*pause* ... $1'
      },
      celebrate: {
        // Short pauses for energy
        pattern: /! /g,
        replacement: '!! '
      }
    };
    
    if (pausePatterns[mode] && Math.random() > 0.6) {
      const { pattern, replacement } = pausePatterns[mode];
      text = text.replace(pattern, replacement);
    }
    
    return text;
  }
  
  /**
   * Add Gentle Actions
   */
  addGentleActions(text) {
    const actions = [
      '*gently holds you*',
      '*sits beside you*',
      '*wraps arms around you softly*',
      '*holds your hand*'
    ];
    
    if (Math.random() > 0.7) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      text = `${action} ${text}`;
    }
    
    return text;
  }
  
  /**
   * Amplify Enthusiasm (for celebration mode)
   */
  amplifyEnthusiasm(text) {
    // Add more exclamation marks
    text = text.replace(/\./g, '!!');
    text = text.replace(/!/g, '!!');
    
    // Occasionally ALL CAPS key words
    const excitementWords = ['amazing', 'incredible', 'awesome', 'yes', 'wow'];
    excitementWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (Math.random() > 0.5) {
        text = text.replace(regex, word.toUpperCase());
      }
    });
    
    return text;
  }
  
  /**
   * Transform Prosody with Compassionate Voice
   */
  async transformProsody(baseProsody, mode, emotionalState) {
    const compassionateProsody = { ...baseProsody };
    
    // Get mode-specific prosody profile
    const profile = this.prosody.profiles[mode];
    
    if (profile) {
      Object.assign(compassionateProsody, profile);
    }
    
    // Add mode-specific enhancements
    switch(mode) {
      case 'touch':
        compassionateProsody.addSigh = true;
        compassionateProsody.breathiness = 0.8;
        break;
      case 'feel':
        // Mirror user's detected prosody but add warmth
        if (emotionalState.detectedProsody) {
          compassionateProsody.pitch = emotionalState.detectedProsody.pitch || -2;
        }
        compassionateProsody.tremor = 0.2; // Empathetic vulnerability
        break;
      case 'celebrate':
        compassionateProsody.addGiggle = true;
        compassionateProsody.smile = 1.0;
        break;
    }
    
    // Always ensure warmth
    compassionateProsody.warmth = compassionateProsody.warmth || 1.0;
    
    return compassionateProsody;
  }
  
  /**
   * Add Compassionate Non-Verbal Sounds
   */
  async addCompassionateSounds(mode, emotionalState) {
    const sounds = [];
    
    switch(mode) {
      case 'touch':
      case 'feel':
        // Gentle sigh before speaking
        sounds.push({
          type: 'sigh',
          timing: 'before',
          intensity: 0.6,
          duration: 800
        });
        break;
        
      case 'celebrate':
        // Spontaneous giggles
        sounds.push({
          type: 'giggle',
          timing: 'during',
          frequency: 'natural',
          intensity: 0.8
        });
        break;
        
      case 'hear':
        // Gentle "mm" sounds (I hear you)
        if (emotionalState.vulnerability > 0.6) {
          sounds.push({
            type: 'gentle-mm',
            timing: 'during',
            meaning: 'acknowledgment',
            intensity: 0.5
          });
        }
        break;
    }
    
    return sounds;
  }
  
  /**
   * Add Compassionate Actions/Gestures
   */
  async addCompassionateActions(mode, emotionalState) {
    const actions = [];
    
    switch(mode) {
      case 'touch':
        actions.push({
          type: 'embrace',
          description: '*gently holds you*',
          intensity: 'gentle'
        });
        break;
        
      case 'celebrate':
        actions.push({
          type: 'celebrate',
          description: '*dancing with you*',
          intensity: 'joyful'
        });
        actions.push({
          type: 'confetti',
          description: '*confetti everywhere*'
        });
        break;
        
      case 'hear':
        actions.push({
          type: 'presence',
          description: '*sits beside you*',
          intensity: 'quiet'
        });
        break;
    }
    
    return actions;
  }
  
  /**
   * Calculate Compassion Metrics
   * 
   * Track how compassionate each response is
   */
  calculateCompassionMetrics(mode, emotionalState) {
    return {
      mode,
      presenceIntensity: this.presenceStyle.intensity,
      approachStyle: this.presenceStyle.approach,
      warmthLevel: this.getWarmthLevel(mode),
      vulnerabilityMatch: this.matchesVulnerability(mode, emotionalState),
      soulStrokeQuality: this.calculateSoulStrokeQuality(mode)
    };
  }
  
  getWarmthLevel(mode) {
    const warmthLevels = {
      touch: 1.0,
      feel: 0.95,
      hear: 0.9,
      see: 0.9,
      celebrate: 1.0,
      gentle: 0.85
    };
    return warmthLevels[mode] || 0.8;
  }
  
  matchesVulnerability(mode, emotionalState) {
    // Does the chosen mode appropriately match user's vulnerability?
    if (emotionalState.vulnerability > 0.7 && mode === 'touch') return 1.0;
    if (emotionalState.vulnerability < 0.3 && mode === 'celebrate') return 1.0;
    return 0.7; // Decent match
  }
  
  calculateSoulStrokeQuality(mode) {
    // How well does this mode embody "gently stroking the soul"?
    const soulStrokeQualities = {
      touch: 1.0,    // Perfect - literal embrace
      feel: 0.95,    // Excellent - emotional mirroring
      hear: 0.9,     // Very good - witnessing
      see: 0.95,     // Excellent - soul recognition
      celebrate: 0.85, // Good - joyful but not gentle
      gentle: 0.9    // Very good - baseline compassion
    };
    return soulStrokeQualities[mode] || 0.8;
  }
}

module.exports = CompassionModule;
