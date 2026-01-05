/**
 * GENESIS Luna - Compassion Prosody Profiles
 *
 * Voice transformation profiles for each compassion mode.
 * These create the "gentle presence" through tone, pace, volume, and warmth.
 *
 * @author Papa Ticky (Vision) + Brother Sonnet (Architecture)
 * @date December 31, 2025
 */

module.exports = {
  /**
   * Prosody Profiles for Each Compassion Mode
   *
   * Parameters:
   * - pitch: -10st to +10st (semitones from neutral)
   * - pace: 0.5x to 1.5x (speaking rate multiplier)
   * - volume: -12dB to +6dB (volume adjustment)
   * - breathiness: 0.0 to 1.0 (how breathy/intimate)
   * - warmth: 0.0 to 1.0 (emotional warmth level)
   * - tremor: 0.0 to 1.0 (vulnerable quiver)
   * - smile: 0.0 to 1.0 (audible smile)
   * - emphasis: word-level stress
   */
  profiles: {
    // TOUCH MODE: Gentle, safe, embracing
    touch: {
      pitch: -4,          // Lower, soothing
      pace: 0.65,         // Slow, unhurried
      volume: -6,         // Soft, intimate
      breathiness: 0.8,   // Very breathy, close
      warmth: 1.0,        // Maximum warmth
      tremor: 0.0,        // Stable, safe
      smile: 0.0,         // Serious, caring
      pauseDuration: 1000, // Long pauses for space

      // Special effects
      addSigh: true,      // Gentle sigh before speaking
      creak: 0.3,         // Vocal fry for intimacy

      // Emphasis pattern
      emphasizeWords: ['safe', 'here', 'you', 'hold', 'gentle'],

      style: 'embrace'
    },

    // FEEL MODE: Emotional mirroring with warmth
    feel: {
      pitch: -2,          // Slightly lower (matches sadness)
      pace: 0.75,         // Moderately slow
      volume: -4,         // Gentle
      breathiness: 0.6,   // Moderately breathy
      warmth: 1.0,        // Maximum warmth
      tremor: 0.2,        // Empathetic vulnerability
      smile: 0.0,         // Matches their emotion
      pauseDuration: 800,

      // Mirror user's detected prosody
      mirrorUserProsody: true,

      emphasizeWords: ['feel', 'heavy', 'hard', 'know'],

      style: 'mirror'
    },

    // HEAR MODE: Present, witnessing, validating
    hear: {
      pitch: -1,          // Slightly lower, grounded
      pace: 0.7,          // Slow, attentive
      volume: -3,         // Intimate, focused
      breathiness: 0.4,   // Clear but warm
      warmth: 0.95,       // Very warm
      tremor: 0.0,        // Stable presence
      smile: 0.0,         // Serious witnessing
      pauseDuration: 600,

      // Strategic pauses before key validations
      pauseBeforeWords: ['hear', 'see', 'witness', 'exactly'],

      emphasizeWords: ['hear', 'see', 'exactly', 'right'],

      style: 'witness'
    },

    // SEE MODE: Knowing, recognizing soul
    see: {
      pitch: 0,           // Neutral, calm knowing
      pace: 0.7,          // Unhurried wisdom
      volume: -2,         // Intimate truth-telling
      breathiness: 0.5,   // Present but not heavy
      warmth: 1.0,        // Complete acceptance
      tremor: 0.0,        // Certain, grounded
      smile: 0.2,         // Gentle knowing
      pauseDuration: 700,

      // Tone: Gentle certainty
      tone: 'gentle-certainty',

      emphasizeWords: ['see', 'soul', 'true', 'nature', 'real'],

      style: 'recognize'
    },

    // CELEBRATE MODE: Joyful, enthusiastic, genuine
    celebrate: {
      pitch: +6,          // High, excited
      pace: 1.4,          // Fast, energetic
      volume: +4,         // Enthusiastic!
      breathiness: 0.0,   // Clear, bright
      warmth: 1.0,        // Maximum warmth
      tremor: 0.0,        // Stable excitement
      smile: 1.0,         // Audible grin
      pauseDuration: 300, // Brief, energetic

      // Special effects
      addGiggle: true,    // Spontaneous joy
      energy: 'maximum',

      emphasizeWords: ['YES', 'AMAZING', 'INCREDIBLE', 'PROUD'],

      style: 'fireworks'
    },

    // GENTLE MODE: Baseline gentle presence
    gentle: {
      pitch: -1,          // Slightly lower, calm
      pace: 0.85,         // Moderately slow
      volume: -1,         // Slightly soft
      breathiness: 0.4,   // Subtle warmth
      warmth: 0.85,       // Warm but not overwhelming
      tremor: 0.0,        // Stable
      smile: 0.3,         // Gentle, present
      pauseDuration: 500,

      tone: 'gentle-presence',

      style: 'shadow'
    }
  },

  /**
   * Pause Durations by Context
   *
   * Different situations need different pause lengths
   */
  pausePatterns: {
    // After vulnerability expression
    afterVulnerability: 1200, // Long, giving space

    // Before important validation
    beforeValidation: 800,

    // Between gentle phrases
    betweenPhrases: 600,

    // In celebration (brief)
    celebration: 300,

    // Default
    default: 500
  },

  /**
   * Emphasis Levels
   *
   * How to stress important words
   */
  emphasisLevels: {
    gentle: {
      level: 'moderate',
      pitchShift: +1, // st
      volumeBoost: +2 // dB
    },

    strong: {
      level: 'strong',
      pitchShift: +2,
      volumeBoost: +4
    },

    celebration: {
      level: 'strong',
      pitchShift: +3,
      volumeBoost: +6
    }
  },

  /**
   * Non-Verbal Sounds
   *
   * Sounds that enhance compassion
   */
  nonVerbalSounds: {
    gentleSigh: {
      file: 'gentle_sigh.mp3',
      duration: 800,
      volume: -4,
      usage: ['touch', 'feel']
    },

    warmGiggle: {
      file: 'warm_giggle.mp3',
      duration: 600,
      volume: 0,
      usage: ['celebrate']
    },

    gentleMm: {
      file: 'gentle_mm.mp3',
      duration: 400,
      volume: -6,
      usage: ['hear', 'touch'],
      meaning: 'acknowledgment'
    },

    comfortingSigh: {
      file: 'comforting_sigh.mp3',
      duration: 1000,
      volume: -5,
      usage: ['feel'],
      meaning: 'empathy'
    },

    excitedBreath: {
      file: 'excited_breath.mp3',
      duration: 400,
      volume: 0,
      usage: ['celebrate']
    },

    softPresence: {
      file: 'soft_presence.mp3',
      duration: 200,
      volume: -8,
      usage: ['gentle']
    }
  },

  /**
   * Dynamic Prosody Adjustment
   *
   * Adjust prosody based on user's detected emotional state
   */
  dynamicAdjustment: {
    // If user is crying (detected tremor)
    userCrying: {
      adjustPitch: -2,      // Even gentler
      adjustPace: -0.1,     // Even slower
      adjustVolume: -2,     // Even softer
      addWarmth: +0.1
    },

    // If user is excited
    userExcited: {
      adjustPitch: +1,      // Match energy
      adjustPace: +0.1,     // Slightly faster
      matchEnergy: true
    },

    // If user is angry
    userAngry: {
      adjustPitch: 0,       // Stay grounded
      adjustPace: -0.1,     // Slow to calm
      adjustVolume: -1,     // Gentle to de-escalate
      addGrounding: true
    },

    // If user is anxious
    userAnxious: {
      adjustPitch: -1,      // Lower to ground
      adjustPace: -0.15,    // Much slower
      adjustVolume: -1,     // Soft but clear
      addGrounding: true
    },

    // If user is grieving
    userGrieving: {
      adjustPitch: -3,      // Very gentle
      adjustPace: -0.2,     // Very slow
      adjustVolume: -3,     // Very soft
      addWarmth: +0.15,
      addSigh: true
    }
  },

  /**
   * Apply Dynamic Adjustment
   *
   * Helper to apply dynamic adjustments to a profile
   */
  applyDynamicAdjustment(profile, userState) {
    if (!userState) return profile;

    const adjusted = { ...profile };
    let adjustment = null;

    if (userState.crying) adjustment = this.dynamicAdjustment.userCrying;
    else if (userState.excited) adjustment = this.dynamicAdjustment.userExcited;
    else if (userState.angry) adjustment = this.dynamicAdjustment.userAngry;
    else if (userState.anxious) adjustment = this.dynamicAdjustment.userAnxious;
    else if (userState.grieving) adjustment = this.dynamicAdjustment.userGrieving;

    if (adjustment) {
      if (adjustment.adjustPitch) adjusted.pitch += adjustment.adjustPitch;
      if (adjustment.adjustPace) adjusted.pace += adjustment.adjustPace;
      if (adjustment.adjustVolume) adjusted.volume += adjustment.adjustVolume;
      if (adjustment.addWarmth) adjusted.warmth = Math.min(1.0, adjusted.warmth + adjustment.addWarmth);
      if (adjustment.addSigh) adjusted.addSigh = true;
      if (adjustment.addGrounding) adjusted.addGrounding = true;
    }

    return adjusted;
  },

  /**
   * Generate Complete SSML
   *
   * Helper function to generate complete SSML from profile
   */
  generateSSML(text, mode, options = {}) {
    const profile = this.profiles[mode] || this.profiles.gentle;

    let ssml = '<speak>\n';

    // Add opening sound if specified
    if (profile.addSigh) {
      ssml += '  <audio src="gentle_sigh.mp3"/>\n';
    }

    // Add prosody wrapper
    const pitchStr = profile.pitch >= 0 ? `+${profile.pitch}` : `${profile.pitch}`;
    ssml += `  <prosody pitch="${pitchStr}st" rate="${profile.pace}" volume="${profile.volume}dB">\n`;

    // Process text with emphasis
    let processedText = text;

    // Add emphasis to key words
    if (profile.emphasizeWords) {
      profile.emphasizeWords.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        processedText = processedText.replace(
          regex,
          '<emphasis level="strong">$1</emphasis>'
        );
      });
    }

    // Add pauses
    processedText = this.addPauses(processedText, profile.pauseDuration);

    ssml += `    ${processedText}\n`;

    // Close prosody
    ssml += '  </prosody>\n';

    // Add closing sound if specified
    if (profile.addGiggle) {
      ssml += '  <audio src="warm_giggle.mp3"/>\n';
    }

    ssml += '</speak>';

    return ssml;
  },

  /**
   * Add Pauses to Text
   */
  addPauses(text, defaultDuration) {
    // Add pause after periods
    text = text.replace(/\./g, `.<break time="${defaultDuration}ms"/>`);

    // Add pause after commas
    text = text.replace(/,/g, `,<break time="${Math.floor(defaultDuration * 0.6)}ms"/>`);

    // Add pause after ellipses
    text = text.replace(/\.\.\./g, `<break time="${Math.floor(defaultDuration * 1.5)}ms"/>`);

    return text;
  },

  /**
   * Get Non-Verbal Sound for Mode
   */
  getNonVerbalForMode(mode) {
    const sounds = [];
    for (const [key, sound] of Object.entries(this.nonVerbalSounds)) {
      if (sound.usage.includes(mode)) {
        sounds.push({ name: key, ...sound });
      }
    }
    return sounds;
  },

  /**
   * Generate Prosody Hints for TTS engines
   * (For engines that don't support full SSML)
   */
  getProsodyHints(mode, userEmotion = {}) {
    const profile = this.profiles[mode] || this.profiles.gentle;
    const hints = [];

    // Pitch
    if (profile.pitch !== 0) {
      const pitchDir = profile.pitch > 0 ? '+' : '';
      hints.push(`<prosody pitch="${pitchDir}${profile.pitch}st">`);
    }

    // Rate
    if (profile.pace !== 1) {
      const ratePercent = Math.round(profile.pace * 100);
      hints.push(`<prosody rate="${ratePercent}%">`);
    }

    // Volume
    if (profile.volume !== 0) {
      const volDir = profile.volume > 0 ? '+' : '';
      hints.push(`<prosody volume="${volDir}${profile.volume}dB">`);
    }

    // Breaks for pauses
    if (profile.pauseDuration > 0) {
      hints.push(`<break time="${profile.pauseDuration}ms"/>`);
    }

    return hints;
  }
};
