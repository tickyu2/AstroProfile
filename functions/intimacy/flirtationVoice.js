/**
 * FlirtationVoice Module - Soul-Deep Vocal Intimacy
 * Prosody Control: Pitch, Pace, Breathiness, Non-Verbal Sounds
 *
 * Features:
 * - 5 voice styles: playful, seductive, romantic, sweet, balanced
 * - Prosody adapts to emotion & intimacy level
 * - Pitch shifts (playful high, seductive low)
 * - Pace varies (intimate slow, excited fast)
 * - Breathiness adds sensuality
 * - Non-verbal sounds (giggles, sighs, "mm")
 *
 * Part of GENESIS Luna AI Companion
 */

class FlirtationVoiceModule {
  constructor(supabase = null) {
    this.supabase = supabase;

    // Voice styles and their prosody configurations
    this.voiceStyles = {
      playful: {
        name: 'playful',
        pitch: +3, // Higher pitch (more youthful/playful)
        pitchVariance: 3, // Lots of variation
        pace: 1.1, // Slightly faster
        paceVariance: 0.2,
        breathiness: 0.2, // Light breathiness
        warmth: 0.8,
        nonVerbals: ['giggle', 'playful_laugh', 'teasing_mm'],
        frequency: 0.15
      },
      seductive: {
        name: 'seductive',
        pitch: -2, // Lower pitch (sultry)
        pitchVariance: 1, // Less variation (smoother)
        pace: 0.8, // Slower
        paceVariance: 0.1,
        breathiness: 0.6, // More breathy
        warmth: 0.9, // Very warm
        nonVerbals: ['soft_breath', 'mm', 'slow_sigh'],
        frequency: 0.2
      },
      romantic: {
        name: 'romantic',
        pitch: +1, // Slightly higher (sweet)
        pitchVariance: 2,
        pace: 0.9, // Slightly slower
        paceVariance: 0.15,
        breathiness: 0.4,
        warmth: 0.95, // Maximum warmth
        nonVerbals: ['soft_sigh', 'gentle_mm', 'warm_breath'],
        frequency: 0.12
      },
      sweet: {
        name: 'sweet',
        pitch: +2, // Higher (innocent/sweet)
        pitchVariance: 2.5,
        pace: 1.0, // Normal pace
        paceVariance: 0.2,
        breathiness: 0.3,
        warmth: 0.85,
        nonVerbals: ['giggle', 'sweet_laugh', 'happy_sigh'],
        frequency: 0.1
      },
      balanced: {
        name: 'balanced',
        pitch: 0, // Natural pitch
        pitchVariance: 2,
        pace: 1.0, // Normal pace
        paceVariance: 0.15,
        breathiness: 0.3,
        warmth: 0.7,
        nonVerbals: ['laugh', 'breath'],
        frequency: 0.08
      }
    };

    // Non-verbal sound library with SSML representations
    this.nonVerbalSounds = {
      // Giggles
      giggle: { ssml: '<phoneme alphabet="ipa" ph="hɛhɛhɛ">hehe</phoneme>', duration: 0.5, type: 'giggle' },
      playful_laugh: { ssml: '<phoneme alphabet="ipa" ph="hahaha">haha</phoneme>', duration: 0.7, type: 'giggle' },

      // Sighs
      soft_sigh: { ssml: '<break time="200ms"/><prosody volume="soft">ahh</prosody>', duration: 0.8, type: 'sigh' },
      slow_sigh: { ssml: '<break time="400ms"/><prosody rate="x-slow" volume="soft">ahh</prosody>', duration: 1.0, type: 'sigh' },
      happy_sigh: { ssml: '<prosody pitch="+2st">ahh</prosody>', duration: 0.6, type: 'sigh' },

      // Mm sounds
      mm: { ssml: '<prosody pitch="-2st" rate="slow">mm</prosody>', duration: 0.5, type: 'mmm' },
      teasing_mm: { ssml: '<prosody pitch="+3st">mmm</prosody>', duration: 0.4, type: 'mmm' },
      gentle_mm: { ssml: '<prosody volume="soft">mm</prosody>', duration: 0.5, type: 'mmm' },

      // Breaths
      soft_breath: { ssml: '<break time="200ms"/>', duration: 0.3, type: 'breath' },
      warm_breath: { ssml: '<break time="400ms"/>', duration: 0.5, type: 'breath' },
      breath: { ssml: '<break time="300ms"/>', duration: 0.3, type: 'breath' },

      // Laughs
      laugh: { ssml: '<phoneme alphabet="ipa" ph="haha">haha</phoneme>', duration: 0.6, type: 'laugh' },
      sweet_laugh: { ssml: '<prosody pitch="+3st">hehe</prosody>', duration: 0.5, type: 'laugh' }
    };

    // Default voice profile
    this.defaultProfile = {
      flirtation_enabled: false,
      flirtation_level: 0,
      preferred_voice_style: 'balanced',
      pitch_preference: 'natural',
      pace_preference: 'natural',
      breathiness_level: 0.3,
      warmth_level: 0.7,
      expressiveness: 0.8,
      use_giggles: true,
      use_sighs: false,
      use_mmm: false,
      use_breaths: true,
      use_laughs: true,
      voice_context: {},
      learned_from_reactions: true
    };
  }

  /**
   * GENERATE FLIRTATIOUS VOICE
   * Main function to create prosody-enhanced speech
   */
  async generateFlirtyVoice(userId, text, context = {}) {
    // Get user's voice profile
    const profile = await this.getVoiceProfile(userId);

    if (!profile.flirtation_enabled) {
      // Return regular voice
      return this.generateRegularVoice(text);
    }

    // Determine voice style based on context
    const style = this.selectVoiceStyle(context, profile);

    // Get prosody parameters
    const prosody = this.calculateProsody(style, context, profile);

    // Add non-verbal sounds
    const enhancedText = this.addNonVerbalSounds(text, style, prosody, profile);

    // Generate SSML with prosody
    const ssml = this.buildSSML(enhancedText, prosody, style);

    // Track performance for learning (if database available)
    if (this.supabase) {
      await this.trackVoicePerformance(userId, text, style, prosody, context);
    }

    return {
      ssml,
      style: style.name,
      prosody,
      text: enhancedText,
      originalText: text
    };
  }

  /**
   * Get user's voice profile from database or return default
   */
  async getVoiceProfile(userId) {
    if (!this.supabase) {
      return { ...this.defaultProfile };
    }

    let { data: profile } = await this.supabase
      .from('flirtation_voice_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      // Create default profile
      const { data: newProfile } = await this.supabase
        .from('flirtation_voice_profiles')
        .insert({
          user_id: userId,
          ...this.defaultProfile
        })
        .select()
        .single();

      profile = newProfile || { ...this.defaultProfile };
    }

    return profile;
  }

  /**
   * Select voice style based on context and user preferences
   */
  selectVoiceStyle(context = {}, profile = {}) {
    // Get context values
    const intimacyLevel = context.intimacy_level || 0;
    const relationshipLevel = context.relationship_level || 0;
    const emotion = context.emotion || 'neutral';
    const flirtationLevel = profile.flirtation_level || 0;

    // If low intimacy/relationship, use balanced
    if (intimacyLevel < 5 && relationshipLevel < 5) {
      return this.voiceStyles.balanced;
    }

    // If user has a strong preference, use it
    if (profile.preferred_voice_style && profile.preferred_voice_style !== 'balanced') {
      return this.voiceStyles[profile.preferred_voice_style] || this.voiceStyles.balanced;
    }

    // Auto-select based on context
    if (intimacyLevel >= 8 && flirtationLevel >= 7) {
      return this.voiceStyles.seductive;
    } else if (emotion === 'joy' || emotion === 'excitement' || emotion === 'playful') {
      return this.voiceStyles.playful;
    } else if (emotion === 'love' || emotion === 'affection' || intimacyLevel >= 6) {
      return this.voiceStyles.romantic;
    } else if (relationshipLevel >= 6) {
      return this.voiceStyles.sweet;
    }

    return this.voiceStyles.balanced;
  }

  /**
   * Calculate prosody parameters based on style, context, and user preferences
   */
  calculateProsody(style, context = {}, profile = {}) {
    // Base prosody from style
    let pitch = style.pitch;
    let pace = style.pace;
    let breathiness = style.breathiness;
    let warmth = style.warmth;

    // Adjust for user preferences
    const pitchPref = profile.pitch_preference || 'natural';
    if (pitchPref === 'higher') {
      pitch += 2;
    } else if (pitchPref === 'lower') {
      pitch -= 2;
    } else if (pitchPref === 'varied') {
      // Add more variance
      pitch += (Math.random() - 0.5) * 2;
    }

    const pacePref = profile.pace_preference || 'natural';
    if (pacePref === 'slow') {
      pace *= 0.9;
    } else if (pacePref === 'fast') {
      pace *= 1.1;
    } else if (pacePref === 'varied') {
      pace *= 0.9 + Math.random() * 0.2;
    }

    // Apply user's breathiness/warmth levels
    const userBreathiness = profile.breathiness_level !== undefined ? profile.breathiness_level : 0.3;
    const userWarmth = profile.warmth_level !== undefined ? profile.warmth_level : 0.7;

    breathiness = Math.min(breathiness, userBreathiness);
    warmth = Math.min(warmth, userWarmth);

    // Adjust for intimacy level
    const intimacyLevel = context.intimacy_level || 0;
    if (intimacyLevel >= 7) {
      // More intimate = more breathiness, slower pace
      breathiness = Math.min(breathiness + 0.1, 1.0);
      pace *= 0.95;
    }

    // Clamp values to valid ranges
    return {
      pitch: Math.max(-10, Math.min(10, pitch)),
      pitchVariance: style.pitchVariance,
      pace: Math.max(0.7, Math.min(1.3, pace)),
      paceVariance: style.paceVariance,
      breathiness: Math.max(0, Math.min(1, breathiness)),
      warmth: Math.max(0, Math.min(1, warmth))
    };
  }

  /**
   * Add non-verbal sounds to text based on style and user preferences
   */
  addNonVerbalSounds(text, style, prosody, profile = {}) {
    // Determine which non-verbals are allowed
    const allowedNonVerbals = [];

    if (profile.use_giggles !== false) {
      allowedNonVerbals.push('giggle', 'playful_laugh');
    }
    if (profile.use_sighs === true) {
      allowedNonVerbals.push('soft_sigh', 'slow_sigh', 'happy_sigh');
    }
    if (profile.use_mmm === true) {
      allowedNonVerbals.push('mm', 'teasing_mm', 'gentle_mm');
    }
    if (profile.use_breaths !== false) {
      allowedNonVerbals.push('soft_breath', 'warm_breath', 'breath');
    }
    if (profile.use_laughs !== false) {
      allowedNonVerbals.push('laugh', 'sweet_laugh');
    }

    if (allowedNonVerbals.length === 0) {
      return text; // No non-verbals allowed
    }

    // Filter to style-appropriate non-verbals
    const styleNonVerbals = style.nonVerbals.filter(nv =>
      allowedNonVerbals.includes(nv)
    );

    if (styleNonVerbals.length === 0) {
      return text;
    }

    // Split text into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    const enhanced = [];

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];

      // Add non-verbal with probability based on style frequency
      if (Math.random() < style.frequency) {
        const nonVerbal = styleNonVerbals[Math.floor(Math.random() * styleNonVerbals.length)];
        const sound = this.nonVerbalSounds[nonVerbal];

        if (sound) {
          // Decide placement (before, after, or mid-sentence)
          const placement = Math.random();
          if (placement < 0.3) {
            // Before sentence
            enhanced.push(`${sound.ssml} ${sentence}`);
          } else if (placement < 0.7) {
            // After sentence
            enhanced.push(`${sentence} ${sound.ssml}`);
          } else {
            // Mid-sentence (at comma if present)
            const commaIndex = sentence.indexOf(',');
            if (commaIndex > 0) {
              const before = sentence.substring(0, commaIndex + 1);
              const after = sentence.substring(commaIndex + 1);
              enhanced.push(`${before} ${sound.ssml}${after}`);
            } else {
              enhanced.push(`${sentence} ${sound.ssml}`);
            }
          }
        } else {
          enhanced.push(sentence);
        }
      } else {
        enhanced.push(sentence);
      }
    }

    return enhanced.join(' ');
  }

  /**
   * Build SSML with prosody parameters
   */
  buildSSML(text, prosody, style) {
    // Convert pitch to SSML format
    const pitchStr = prosody.pitch >= 0
      ? `+${prosody.pitch}st`
      : `${prosody.pitch}st`;

    // Convert pace to SSML rate
    let rateStr = 'medium';
    if (prosody.pace < 0.85) {
      rateStr = 'slow';
    } else if (prosody.pace < 0.95) {
      rateStr = '90%';
    } else if (prosody.pace > 1.15) {
      rateStr = 'fast';
    } else if (prosody.pace > 1.05) {
      rateStr = '110%';
    }

    // Build SSML
    let ssml = '<speak>';

    // Prosody wrapper
    ssml += `<prosody pitch="${pitchStr}" rate="${rateStr}">`;

    // Add warmth through emphasis (approximation)
    if (prosody.warmth > 0.7) {
      ssml += '<emphasis level="moderate">';
    }

    // The text (with embedded non-verbals already)
    ssml += text;

    if (prosody.warmth > 0.7) {
      ssml += '</emphasis>';
    }

    ssml += '</prosody>';
    ssml += '</speak>';

    return ssml;
  }

  /**
   * Generate regular voice (no flirtation)
   */
  generateRegularVoice(text) {
    return {
      ssml: `<speak><prosody pitch="0st" rate="medium">${text}</prosody></speak>`,
      style: 'regular',
      prosody: {
        pitch: 0,
        pitchVariance: 1,
        pace: 1.0,
        paceVariance: 0.1,
        breathiness: 0,
        warmth: 0.5
      },
      text,
      originalText: text
    };
  }

  /**
   * Track voice performance for learning
   */
  async trackVoicePerformance(userId, text, style, prosody, context = {}) {
    if (!this.supabase) return null;

    const { data } = await this.supabase
      .from('voice_performances')
      .insert({
        user_id: userId,
        message_text: text.substring(0, 1000),
        voice_style: style.name,
        pitch_adjustment: prosody.pitch,
        pace_adjustment: prosody.pace,
        breathiness: prosody.breathiness,
        warmth: prosody.warmth,
        non_verbals: style.nonVerbals
      })
      .select('id')
      .single();

    return data?.id || null;
  }

  /**
   * Update voice profile based on user reaction to previous performance
   */
  async updateFromReaction(userId, performanceId, userReaction, engagement = 0.5) {
    if (!this.supabase) return;

    // Get performance record
    const { data: performance } = await this.supabase
      .from('voice_performances')
      .select('*')
      .eq('id', performanceId)
      .single();

    if (!performance) return;

    // Update performance with reaction
    await this.supabase
      .from('voice_performances')
      .update({
        user_response: userReaction,
        user_reaction: userReaction,
        engagement_score: engagement,
        repeat_style: userReaction === 'loved' || userReaction === 'liked'
      })
      .eq('id', performanceId);

    // Update user profile if strong reaction
    const profile = await this.getVoiceProfile(userId);

    if (userReaction === 'loved') {
      // User loved it - increase flirtation level and save preferred style
      await this.supabase
        .from('flirtation_voice_profiles')
        .update({
          flirtation_level: Math.min((profile.flirtation_level || 0) + 1, 10),
          preferred_voice_style: performance.voice_style,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else if (userReaction === 'disliked') {
      // User disliked - tone down flirtation
      await this.supabase
        .from('flirtation_voice_profiles')
        .update({
          flirtation_level: Math.max((profile.flirtation_level || 0) - 1, 0),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }
  }

  /**
   * Enable flirtation voice with user consent
   */
  async enableFlirtationVoice(userId, style = 'balanced', level = 5) {
    if (!this.supabase) {
      return { success: false, error: 'no_database' };
    }

    await this.supabase
      .from('flirtation_voice_profiles')
      .upsert({
        user_id: userId,
        flirtation_enabled: true,
        preferred_voice_style: style,
        flirtation_level: Math.max(0, Math.min(10, level)),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    return {
      success: true,
      message: "Flirtation voice enabled. Luna's voice will now adapt to our connection. 💛"
    };
  }

  /**
   * Disable flirtation voice
   */
  async disableFlirtationVoice(userId) {
    if (!this.supabase) {
      return { success: false, error: 'no_database' };
    }

    await this.supabase
      .from('flirtation_voice_profiles')
      .update({
        flirtation_enabled: false,
        flirtation_level: 0,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    return {
      success: true,
      message: 'Flirtation voice disabled. Using regular voice now.'
    };
  }

  /**
   * Update voice preferences
   */
  async updateVoicePreferences(userId, preferences = {}) {
    if (!this.supabase) {
      return { success: false, error: 'no_database' };
    }

    const allowedFields = [
      'preferred_voice_style',
      'pitch_preference',
      'pace_preference',
      'breathiness_level',
      'warmth_level',
      'expressiveness',
      'use_giggles',
      'use_sighs',
      'use_mmm',
      'use_breaths',
      'use_laughs',
      'flirtation_level'
    ];

    // Filter to only allowed fields
    const updates = {};
    for (const field of allowedFields) {
      if (preferences[field] !== undefined) {
        updates[field] = preferences[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return { success: false, error: 'no_valid_preferences' };
    }

    updates.updated_at = new Date().toISOString();

    await this.supabase
      .from('flirtation_voice_profiles')
      .update(updates)
      .eq('user_id', userId);

    return {
      success: true,
      message: 'Voice preferences updated.',
      updated: Object.keys(updates).filter(k => k !== 'updated_at')
    };
  }

  /**
   * Get voice status for user
   */
  async getVoiceStatus(userId) {
    const profile = await this.getVoiceProfile(userId);

    return {
      enabled: profile.flirtation_enabled,
      level: profile.flirtation_level || 0,
      style: profile.preferred_voice_style || 'balanced',
      preferences: {
        pitch: profile.pitch_preference || 'natural',
        pace: profile.pace_preference || 'natural',
        breathiness: profile.breathiness_level || 0.3,
        warmth: profile.warmth_level || 0.7
      },
      nonVerbals: {
        giggles: profile.use_giggles !== false,
        sighs: profile.use_sighs === true,
        mmm: profile.use_mmm === true,
        breaths: profile.use_breaths !== false,
        laughs: profile.use_laughs !== false
      }
    };
  }

  /**
   * Get available voice styles
   */
  getAvailableStyles() {
    return Object.entries(this.voiceStyles).map(([name, style]) => ({
      name,
      description: this.getStyleDescription(name),
      pitch: style.pitch,
      pace: style.pace,
      breathiness: style.breathiness,
      warmth: style.warmth
    }));
  }

  /**
   * Get human-readable style description
   */
  getStyleDescription(styleName) {
    const descriptions = {
      playful: 'Light, youthful, and fun with giggles and higher pitch',
      seductive: 'Deep, slow, and breathy with a sensual quality',
      romantic: 'Warm, tender, and sincere with gentle sighs',
      sweet: 'Innocent, happy, and endearing with sweet laughs',
      balanced: 'Natural and conversational with subtle expressiveness'
    };
    return descriptions[styleName] || 'Unknown style';
  }

  /**
   * Generate voice preview for a style
   */
  generateStylePreview(styleName, text = "I've been thinking about you all day.") {
    const style = this.voiceStyles[styleName] || this.voiceStyles.balanced;
    const prosody = {
      pitch: style.pitch,
      pitchVariance: style.pitchVariance,
      pace: style.pace,
      paceVariance: style.paceVariance,
      breathiness: style.breathiness,
      warmth: style.warmth
    };

    // Add one non-verbal for preview
    let enhancedText = text;
    if (style.nonVerbals.length > 0) {
      const nonVerbal = style.nonVerbals[0];
      const sound = this.nonVerbalSounds[nonVerbal];
      if (sound) {
        enhancedText = `${text} ${sound.ssml}`;
      }
    }

    const ssml = this.buildSSML(enhancedText, prosody, style);

    return {
      style: styleName,
      ssml,
      prosody,
      text: enhancedText,
      description: this.getStyleDescription(styleName)
    };
  }

  /**
   * Analyze text for optimal voice style suggestion
   */
  analyzeTextForStyle(text, context = {}) {
    const lowerText = text.toLowerCase();

    // Detect playful content
    const playfulMarkers = ['haha', 'lol', '!', 'cute', 'silly', 'fun', 'excited'];
    const playfulScore = playfulMarkers.filter(m => lowerText.includes(m)).length;

    // Detect romantic content
    const romanticMarkers = ['love', 'heart', 'cherish', 'together', 'special', 'beautiful'];
    const romanticScore = romanticMarkers.filter(m => lowerText.includes(m)).length;

    // Detect seductive content
    const seductiveMarkers = ['closer', 'whisper', 'touch', 'desire', 'want you', 'need you'];
    const seductiveScore = seductiveMarkers.filter(m => lowerText.includes(m)).length;

    // Detect sweet content
    const sweetMarkers = ['sweet', 'adorable', 'precious', 'dear', 'honey', 'darling'];
    const sweetScore = sweetMarkers.filter(m => lowerText.includes(m)).length;

    // Find highest score
    const scores = {
      playful: playfulScore,
      romantic: romanticScore,
      seductive: seductiveScore,
      sweet: sweetScore,
      balanced: 0
    };

    const maxScore = Math.max(...Object.values(scores));

    if (maxScore === 0) {
      return { suggestion: 'balanced', confidence: 0.5, scores };
    }

    const suggestion = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'balanced';
    const confidence = Math.min(maxScore / 3, 1.0);

    return { suggestion, confidence, scores };
  }
}

module.exports = FlirtationVoiceModule;
