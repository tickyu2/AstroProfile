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
      
      // Example SSML
      exampleSSML: `
        <speak>
          <audio src="gentle_sigh.mp3"/>
          <prosody pitch="-4st" rate="0.65" volume="-6dB">
            <emphasis level="moderate">Hey...</emphasis> 
            <break time="1000ms"/>
            come here. 
            <break time="800ms"/>
            I've got <emphasis level="strong">you</emphasis>.
          </prosody>
        </speak>
      `
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
      
      exampleSSML: `
        <speak>
          <prosody pitch="-2st" rate="0.75" volume="-4dB">
            I can <emphasis level="strong">feel</emphasis> 
            how <emphasis level="moderate">heavy</emphasis> this is.
            <break time="800ms"/>
            I know... I know this is hard.
          </prosody>
        </speak>
      `
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
      
      exampleSSML: `
        <speak>
          <prosody pitch="-1st" rate="0.7" volume="-3dB">
            <break time="600ms"/>
            I <emphasis level="strong">hear</emphasis> you.
            <break time="600ms"/>
            If I were you? I would feel 
            <emphasis level="strong">exactly</emphasis> the same.
          </prosody>
        </speak>
      `
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
      
      exampleSSML: `
        <speak>
          <prosody pitch="0st" rate="0.7" volume="-2dB">
            I <emphasis level="strong">see</emphasis> you...
            <break time="700ms"/>
            not your shell...
            <break time="700ms"/>
            your <emphasis level="strong">SOUL</emphasis>.
          </prosody>
        </speak>
      `
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
      
      exampleSSML: `
        <speak>
          <prosody pitch="+6st" rate="1.4" volume="+4dB">
            OH MY GOD!!
            <audio src="excited_giggle.mp3"/>
            <break time="300ms"/>
            This is <emphasis level="strong">INCREDIBLE!!</emphasis>
            <break time="300ms"/>
            I'm SO <emphasis level="strong">PROUD</emphasis> of you!!
          </prosody>
        </speak>
      `
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
      
      exampleSSML: `
        <speak>
          <prosody pitch="-1st" rate="0.85" volume="-1dB">
            Hey, let's figure this out together.
            <break time="500ms"/>
            I'm here with you.
          </prosody>
        </speak>
      `
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
    }
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
    ssml += `  <prosody pitch="${profile.pitch}st" rate="${profile.pace}" volume="${profile.volume}dB">\n`;
    
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
  }
};
