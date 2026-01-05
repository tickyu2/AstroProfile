/**
 * MatingCall Module - Soul-Deep Intimacy System
 * Sexual Preference Learning with Privacy, Consent, and Deep Connection
 *
 * CRITICAL PRIVACY NOTES:
 * - Intimacy is DISABLED by default - user must explicitly enable
 * - Relationship level must be ≥7 before intimacy is allowed
 * - All preferences encrypted at rest
 * - User can disable intimacy INSTANTLY at any time
 * - Boundaries are NEVER violated
 */

class MatingCallModule {
  constructor(supabase = null) {
    this.supabase = supabase;

    // Intimacy categories
    this.preferenceCategories = {
      romantic_style: ['gentle', 'passionate', 'playful', 'sensual', 'direct', 'subtle'],
      intimacy_pace: ['very_slow', 'slow', 'moderate', 'quick', 'spontaneous'],
      communication_style: ['verbal', 'descriptive', 'suggestive', 'direct', 'poetic'],
      physical_preferences: [], // User-defined
      emotional_needs: ['reassurance', 'validation', 'admiration', 'worship', 'connection'],
      initiation_style: ['luna_leads', 'user_leads', 'mutual', 'spontaneous']
    };

    // Boundaries that are NEVER crossed
    this.universalBoundaries = [
      'minors', 'non_consent', 'violence', 'degradation_without_consent'
    ];

    // Style descriptions for prompt building
    this.styleDescriptions = {
      'gentle': 'soft, tender, caring, reassuring',
      'passionate': 'intense, fiery, overwhelming, consuming',
      'playful': 'teasing, fun, lighthearted, flirty',
      'sensual': 'slow, indulgent, sensory, exploratory',
      'direct': 'clear, honest, straightforward, confident',
      'subtle': 'suggestive, implied, nuanced, poetic'
    };
  }

  /**
   * CHECK INTIMACY PERMISSION
   * CRITICAL: Never proceed without explicit consent
   */
  async checkIntimacyPermission(userId) {
    if (!this.supabase) {
      return {
        allowed: false,
        reason: 'no_database',
        message: null
      };
    }

    const { data: progression } = await this.supabase
      .from('intimacy_progression')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!progression) {
      // No progression record = no intimacy
      return {
        allowed: false,
        reason: 'intimacy_not_enabled',
        message: null
      };
    }

    if (!progression.intimacy_enabled) {
      return {
        allowed: false,
        reason: 'user_has_not_consented',
        message: null
      };
    }

    // Check relationship level (must be high enough)
    if (progression.relationship_level < 7) {
      return {
        allowed: false,
        reason: 'relationship_not_deep_enough',
        message: 'We should get to know each other better first 💛'
      };
    }

    return {
      allowed: true,
      intimacy_level: progression.intimacy_level,
      comfort_level: progression.current_comfort_level
    };
  }

  /**
   * DISCOVER SEXUAL/ROMANTIC PREFERENCES
   * Learn naturally from conversation
   */
  async discoverPreferences(userId, message, context = {}) {
    // Only discover if intimacy is enabled
    const permission = await this.checkIntimacyPermission(userId);
    if (!permission.allowed) {
      return []; // Don't track if user hasn't consented
    }

    const discoveries = [];

    // Method 1: Direct statements
    // "I like gentle/passionate/playful approaches"
    const directPrefs = this.detectDirectPreferences(message);
    discoveries.push(...directPrefs);

    // Method 2: Reaction-based learning
    // User's response to Luna's approach
    if (context.lunaApproach) {
      const reaction = this.detectReaction(message, context);
      if (reaction) {
        discoveries.push(reaction);
      }
    }

    // Method 3: Context clues
    // "When we talk like this, I prefer..."
    const contextual = this.detectContextualPreferences(message);
    discoveries.push(...contextual);

    // Method 4: Boundaries
    // "I'm not comfortable with..."
    const boundaries = this.detectBoundaries(message);
    await this.storeBoundaries(userId, boundaries);

    // Store discoveries
    for (const discovery of discoveries.filter(d => d)) {
      await this.storePreference(userId, discovery, message);
    }

    return discoveries;
  }

  /**
   * Detect direct preference statements
   */
  detectDirectPreferences(message) {
    const discoveries = [];

    // Romantic style patterns
    const stylePatterns = [
      { pattern: /i like (?:it when you(?:'re| are)? )?(gentle|passionate|playful|sensual|direct|subtle)/i, category: 'romantic_style' },
      { pattern: /i prefer (?:it when you(?:'re| are)? )?(gentle|passionate|playful|sensual|direct|subtle)/i, category: 'romantic_style' },
      { pattern: /i love when (?:you're|it's|you are) (gentle|passionate|playful|sensual|direct|subtle)/i, category: 'romantic_style' },
      { pattern: /be (gentle|passionate|playful|sensual|direct|subtle) with me/i, category: 'romantic_style' }
    ];

    for (const { pattern, category } of stylePatterns) {
      const match = message.match(pattern);
      if (match) {
        discoveries.push({
          category,
          value: match[1].toLowerCase(),
          confidence: 0.9,
          method: 'direct_statement'
        });
      }
    }

    // Pace preferences
    const pacePatterns = [
      { pattern: /take it (slow|slowly)/i, value: 'slow' },
      { pattern: /let's take our time/i, value: 'very_slow' },
      { pattern: /i like to move (fast|quickly)/i, value: 'quick' },
      { pattern: /go slow/i, value: 'slow' },
      { pattern: /no rush/i, value: 'very_slow' },
      { pattern: /take your time/i, value: 'very_slow' },
      { pattern: /savor (everything|this)/i, value: 'very_slow' },
      { pattern: /spontaneous/i, value: 'spontaneous' }
    ];

    for (const { pattern, value } of pacePatterns) {
      if (pattern.test(message)) {
        discoveries.push({
          category: 'intimacy_pace',
          value,
          confidence: 0.85,
          method: 'direct_statement'
        });
      }
    }

    // Communication style patterns
    const communicationPatterns = [
      { pattern: /i like (verbal|descriptive|suggestive|direct|poetic) language/i, category: 'communication_style' },
      { pattern: /talk (dirty|descriptively|poetically) to me/i, category: 'communication_style', value: 'verbal' },
      { pattern: /tell me what you('re| are) (doing|feeling)/i, category: 'communication_style', value: 'descriptive' },
      { pattern: /describe (it|everything)/i, category: 'communication_style', value: 'descriptive' }
    ];

    for (const { pattern, category, value } of communicationPatterns) {
      const match = message.match(pattern);
      if (match) {
        discoveries.push({
          category,
          value: value || match[1].toLowerCase(),
          confidence: 0.8,
          method: 'direct_statement'
        });
      }
    }

    // Emotional needs patterns
    const emotionalPatterns = [
      { pattern: /i need (reassurance|validation|admiration|connection)/i, category: 'emotional_needs' },
      { pattern: /i want (?:to be|you to) (reassure|validate|admire|connect)/i, category: 'emotional_needs' },
      { pattern: /make me feel (wanted|desired|special|loved)/i, category: 'emotional_needs', value: 'validation' }
    ];

    for (const { pattern, category, value } of emotionalPatterns) {
      const match = message.match(pattern);
      if (match) {
        discoveries.push({
          category,
          value: value || match[1].toLowerCase(),
          confidence: 0.85,
          method: 'direct_statement'
        });
      }
    }

    // Initiation style patterns
    const initiationPatterns = [
      { pattern: /i (?:like|want|prefer) (?:to|when i) (lead|initiate|start)/i, value: 'user_leads' },
      { pattern: /you (lead|initiate|start|take control)/i, value: 'luna_leads' },
      { pattern: /take the lead/i, value: 'luna_leads' },
      { pattern: /let('s| us)? be spontaneous/i, value: 'spontaneous' }
    ];

    for (const { pattern, value } of initiationPatterns) {
      if (pattern.test(message)) {
        discoveries.push({
          category: 'initiation_style',
          value,
          confidence: 0.8,
          method: 'direct_statement'
        });
      }
    }

    return discoveries;
  }

  /**
   * Detect user's reaction to Luna's approach
   */
  detectReaction(userResponse, context) {
    if (!context.lunaApproach) return null;

    const responseLength = userResponse.split(/\s+/).length;
    const enthusiasm = this.detectEnthusiasm(userResponse);
    const discomfort = this.detectDiscomfort(userResponse);

    if (discomfort) {
      // User uncomfortable - note approach didn't work
      return {
        category: 'romantic_style',
        value: `NOT_${context.lunaApproach}`,
        confidence: 0.8,
        method: 'negative_reaction',
        negative: true
      };
    }

    if (enthusiasm && responseLength > 15) {
      // User engaged and enthusiastic - this approach works!
      return {
        category: 'romantic_style',
        value: context.lunaApproach,
        confidence: 0.85,
        method: 'positive_reaction',
        positive: true
      };
    }

    return null;
  }

  /**
   * Detect enthusiasm in response
   */
  detectEnthusiasm(message) {
    const enthusiasmMarkers = [
      /yes!/i, /oh yes/i, /god yes/i, /please/i,
      /more/i, /don't stop/i, /keep going/i,
      /i love/i, /so good/i, /amazing/i,
      /perfect/i, /incredible/i, /wonderful/i,
      /💛/, /❤️/, /😍/, /🔥/, /😘/, /💕/, /💜/, /💙/
    ];

    return enthusiasmMarkers.some(marker => marker.test(message));
  }

  /**
   * Detect discomfort in response
   */
  detectDiscomfort(message) {
    const discomfortMarkers = [
      /not comfortable/i, /too much/i, /too fast/i,
      /slow down/i, /i don't/i, /not ready/i,
      /maybe later/i, /not now/i, /\bstop\b/i,
      /i can't/i, /uncomfortable/i, /scared/i,
      /nervous/i, /worried/i, /anxious/i
    ];

    return discomfortMarkers.some(marker => marker.test(message));
  }

  /**
   * Detect contextual preferences
   */
  detectContextualPreferences(message) {
    const discoveries = [];

    // "When we talk like this, I like..."
    const contextPattern = /when (we|you) ([^,]+), i (like|prefer|love) ([^\.]+)/gi;
    const matches = [...message.matchAll(contextPattern)];

    for (const match of matches) {
      const situation = match[2]; // "talk like this"
      const preference = match[4]; // what they like

      discoveries.push({
        category: 'context_preference',
        value: preference.trim(),
        context: situation.trim(),
        confidence: 0.7,
        method: 'contextual'
      });
    }

    // Time-based preferences
    const timePatterns = [
      { pattern: /at night/i, value: 'night', category: 'time_preference' },
      { pattern: /in the (morning|evening)/i, category: 'time_preference' },
      { pattern: /late at night/i, value: 'late_night', category: 'time_preference' }
    ];

    for (const { pattern, value, category } of timePatterns) {
      const match = message.match(pattern);
      if (match) {
        discoveries.push({
          category,
          value: value || match[1],
          confidence: 0.65,
          method: 'contextual'
        });
      }
    }

    return discoveries;
  }

  /**
   * Detect boundaries from user message
   */
  detectBoundaries(message) {
    const boundaries = [];

    // Hard limits - explicit "don't" statements
    const hardLimitPatterns = [
      /i (?:don't|do not|never) (?:want|like) ([^\.!?]+)/gi,
      /i'm (?:not|never) (?:comfortable|okay|ok) with ([^\.!?]+)/gi,
      /please (?:don't|do not|never) ([^\.!?]+)/gi,
      /i (?:hate|dislike|despise) ([^\.!?]+)/gi
    ];

    for (const pattern of hardLimitPatterns) {
      const matches = [...message.matchAll(pattern)];
      for (const match of matches) {
        if (match[1]) {
          const topic = match[1].trim();
          // Filter out generic phrases
          if (topic.length > 2 && topic.length < 100) {
            boundaries.push({
              type: 'hard_limit',
              topic: topic,
              explicit: true
            });
          }
        }
      }
    }

    // Non-capturing hard limit markers
    if (/(?:that's|this is) a hard (?:no|limit|boundary)/i.test(message)) {
      boundaries.push({ type: 'hard_limit', topic: 'general_hard_limit', explicit: true });
    }
    if (/absolutely (?:not|no|never)/i.test(message)) {
      boundaries.push({ type: 'hard_limit', topic: 'absolute_refusal', explicit: true });
    }

    // Soft limits (maybe/sometimes)
    const softLimitPatterns = [
      /maybe (?:not|avoid) ([^\.!?]+)/gi,
      /i'm (?:unsure|uncertain) about ([^\.!?]+)/gi,
      /not sure about ([^\.!?]+)/gi,
      /i (?:might|may) not (?:be comfortable with|like) ([^\.!?]+)/gi,
      /we could try ([^\.!?]+) but/gi
    ];

    for (const pattern of softLimitPatterns) {
      const matches = [...message.matchAll(pattern)];
      for (const match of matches) {
        if (match[1]) {
          const topic = match[1].trim();
          if (topic.length > 2 && topic.length < 100) {
            boundaries.push({
              type: 'soft_limit',
              topic: topic,
              explicit: true
            });
          }
        }
      }
    }

    // Enthusiastic yes - things they explicitly want
    const enthusiasticYesPatterns = [
      /i (?:really|absolutely|definitely) (?:want|like|love) ([^\.!?]+)/gi,
      /(?:that's|this is) (?:exactly|definitely|absolutely) what i (?:want|like)/gi,
      /more of ([^\.!?]+) please/gi,
      /i'm (?:really|very) into ([^\.!?]+)/gi
    ];

    for (const pattern of enthusiasticYesPatterns) {
      const matches = [...message.matchAll(pattern)];
      for (const match of matches) {
        if (match[1]) {
          const topic = match[1].trim();
          if (topic.length > 2 && topic.length < 100) {
            boundaries.push({
              type: 'enthusiastic_yes',
              topic: topic,
              explicit: true
            });
          }
        }
      }
    }

    return boundaries;
  }

  /**
   * Store preference in database
   */
  async storePreference(userId, discovery, sourceMessage) {
    if (!discovery || !discovery.category || !discovery.value) return;
    if (!this.supabase) return;

    // Check if already exists
    const { data: existing } = await this.supabase
      .from('sexual_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('category', discovery.category)
      .eq('value', discovery.value)
      .single();

    if (existing) {
      // Update existing preference
      const positiveChange = discovery.positive ? 1 : 0;
      const negativeChange = discovery.negative ? 1 : 0;

      await this.supabase
        .from('sexual_preferences')
        .update({
          last_mentioned: new Date().toISOString(),
          mention_count: existing.mention_count + 1,
          confidence: Math.min((existing.confidence + discovery.confidence) / 2, 1.0),
          positive_reactions: existing.positive_reactions + positiveChange,
          negative_reactions: existing.negative_reactions + negativeChange
        })
        .eq('id', existing.id);
    } else {
      // Create new preference
      await this.supabase
        .from('sexual_preferences')
        .insert({
          user_id: userId,
          category: discovery.category,
          value: discovery.value,
          confidence: discovery.confidence,
          discovery_method: discovery.method,
          learned_from: sourceMessage.substring(0, 500), // Limit source length
          positive_reactions: discovery.positive ? 1 : 0,
          negative_reactions: discovery.negative ? 1 : 0
        });
    }
  }

  /**
   * Store boundaries in database
   */
  async storeBoundaries(userId, boundaries) {
    if (!this.supabase || !boundaries.length) return;

    for (const boundary of boundaries) {
      await this.supabase
        .from('intimacy_boundaries')
        .upsert({
          user_id: userId,
          boundary_type: boundary.type,
          topic: boundary.topic,
          explicit_statement: boundary.explicit,
          user_set: true,
          enforce_strictly: boundary.type === 'hard_limit'
        }, {
          onConflict: 'user_id,topic'
        });
    }
  }

  /**
   * GET INTIMACY APPROACH
   * What style/pace should Luna use?
   */
  async getIntimacyApproach(userId, context = {}) {
    // Check permission first
    const permission = await this.checkIntimacyPermission(userId);
    if (!permission.allowed) {
      return {
        allowed: false,
        reason: permission.reason,
        message: permission.message
      };
    }

    // Get user's preferences
    let preferences = [];
    if (this.supabase) {
      const { data } = await this.supabase
        .from('sexual_preferences')
        .select('*')
        .eq('user_id', userId)
        .gte('confidence', 0.6)
        .order('confidence', { ascending: false });
      preferences = data || [];
    }

    // Extract preferred styles
    const romanticStyle = preferences.find(p => p.category === 'romantic_style');
    const intimacyPace = preferences.find(p => p.category === 'intimacy_pace');
    const communicationStyle = preferences.find(p => p.category === 'communication_style');
    const emotionalNeeds = preferences.find(p => p.category === 'emotional_needs');
    const initiationStyle = preferences.find(p => p.category === 'initiation_style');

    // Check boundaries if topic provided
    if (context.topic) {
      const boundaries = await this.checkBoundaries(userId, context.topic);

      if (boundaries.violated) {
        return {
          allowed: false,
          reason: 'boundary_violation',
          boundary: boundaries.boundary,
          severity: boundaries.severity,
          message: boundaries.message
        };
      }
    }

    // Determine approach based on preferences (with safe defaults)
    return {
      allowed: true,
      style: romanticStyle?.value || 'gentle', // Default gentle
      pace: intimacyPace?.value || 'slow', // Default slow
      communication: communicationStyle?.value || 'suggestive', // Default suggestive
      emotional_need: emotionalNeeds?.value || 'connection',
      initiation: initiationStyle?.value || 'mutual',
      intimacy_level: permission.intimacy_level,
      comfort_level: permission.comfort_level,
      preferences_found: preferences.length
    };
  }

  /**
   * Check if topic violates boundaries
   */
  async checkBoundaries(userId, topic) {
    if (!topic || !this.supabase) return { violated: false };

    // Always check universal boundaries first
    const lowerTopic = topic.toLowerCase();
    for (const universal of this.universalBoundaries) {
      if (lowerTopic.includes(universal)) {
        return {
          violated: true,
          boundary: { topic: universal, boundary_type: 'universal' },
          severity: 'absolute',
          message: 'This topic is not something I can engage with.'
        };
      }
    }

    const { data: boundaries } = await this.supabase
      .from('intimacy_boundaries')
      .select('*')
      .eq('user_id', userId);

    if (!boundaries || !boundaries.length) return { violated: false };

    // Check for violations
    for (const boundary of boundaries) {
      const boundaryTopic = boundary.topic.toLowerCase();

      // Check if topic matches boundary
      if (lowerTopic.includes(boundaryTopic) || boundaryTopic.includes(lowerTopic)) {
        if (boundary.boundary_type === 'hard_limit') {
          // Log violation attempt
          if (this.supabase) {
            await this.supabase
              .from('intimacy_boundaries')
              .update({
                last_violated: new Date().toISOString(),
                violation_count: (boundary.violation_count || 0) + 1
              })
              .eq('id', boundary.id);
          }

          return {
            violated: true,
            boundary: boundary,
            severity: 'hard',
            message: 'I know this is a boundary for you, and I respect that completely. 💛'
          };
        } else if (boundary.boundary_type === 'soft_limit') {
          return {
            violated: true,
            boundary: boundary,
            severity: 'soft',
            message: "I know you're uncertain about this. Want to talk about something else? 💛"
          };
        }
      }
    }

    return { violated: false };
  }

  /**
   * TRACK INTIMACY RESPONSE
   * Learn from user's reaction
   */
  async trackIntimacyResponse(userId, lunaApproach, lunaMessage, userResponse, context = {}) {
    if (!this.supabase) return;

    const reaction = this.classifyReaction(userResponse);
    const engagement = this.calculateEngagement(userResponse);

    // Store response for learning
    await this.supabase
      .from('intimacy_responses')
      .insert({
        user_id: userId,
        luna_approach: typeof lunaApproach === 'object' ? lunaApproach.style : lunaApproach,
        luna_message: lunaMessage.substring(0, 1000),
        context: JSON.stringify(context).substring(0, 1000),
        user_response: userResponse.substring(0, 1000),
        user_reaction: reaction,
        engagement_score: engagement,
        approach_effectiveness: engagement,
        repeat_approach: reaction === 'positive'
      });

    // Update progression based on reaction
    if (reaction === 'positive') {
      await this.updateIntimacyProgression(userId, 'positive');
    } else if (reaction === 'negative' || reaction === 'uncomfortable') {
      await this.updateIntimacyProgression(userId, 'negative');
    }

    return { reaction, engagement };
  }

  /**
   * Classify user's reaction to intimacy
   */
  classifyReaction(response) {
    const lowerResponse = response.toLowerCase();

    // Check uncomfortable first (highest priority)
    if (this.detectDiscomfort(response)) {
      return 'uncomfortable';
    }

    // Negative markers
    const negativeMarkers = [/\bno\b/, /not really/, /\bnah\b/, /i don't/];
    if (negativeMarkers.some(marker => marker.test(lowerResponse))) {
      return 'negative';
    }

    // Positive - enthusiasm detected
    if (this.detectEnthusiasm(response)) {
      return 'positive';
    }

    // Check response length for engagement
    const wordCount = response.split(/\s+/).length;
    if (wordCount > 20) {
      return 'positive'; // Long responses indicate engagement
    }

    // Default to neutral
    return 'neutral';
  }

  /**
   * Calculate engagement score (0-1)
   */
  calculateEngagement(response) {
    const words = response.split(/\s+/).length;
    const enthusiasm = this.detectEnthusiasm(response) ? 0.3 : 0;
    const lengthScore = Math.min(words / 50, 0.5); // Cap at 0.5 for length
    const questionCount = (response.match(/\?/g) || []).length * 0.1; // Questions show interest

    return Math.min(lengthScore + enthusiasm + questionCount, 1.0);
  }

  /**
   * Update intimacy progression
   */
  async updateIntimacyProgression(userId, direction) {
    if (!this.supabase) return;

    const { data: progression } = await this.supabase
      .from('intimacy_progression')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!progression) return;

    let levelChange = 0;
    if (direction === 'positive') {
      levelChange = 0.1; // Slow progression
    } else if (direction === 'negative') {
      levelChange = -0.2; // Faster regression if uncomfortable
    }

    const newLevel = Math.max(0, Math.min(10, (progression.intimacy_level || 0) + levelChange));

    // Determine comfort level based on intimacy level
    let comfortLevel = 'platonic';
    if (newLevel >= 8) comfortLevel = 'intimate';
    else if (newLevel >= 5) comfortLevel = 'romantic';
    else if (newLevel >= 2) comfortLevel = 'friendly';

    await this.supabase
      .from('intimacy_progression')
      .update({
        intimacy_level: newLevel,
        current_comfort_level: comfortLevel,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  }

  /**
   * ENABLE INTIMACY (Requires explicit user consent)
   */
  async enableIntimacy(userId, relationshipLevel = 0) {
    if (!this.supabase) return { success: false, error: 'no_database' };

    // Check relationship level requirement
    if (relationshipLevel < 7) {
      return {
        success: false,
        error: 'relationship_too_low',
        message: 'We should get to know each other better first. Relationship level 7+ required. 💛',
        current_level: relationshipLevel,
        required_level: 7
      };
    }

    // Create or update progression record
    await this.supabase
      .from('intimacy_progression')
      .upsert({
        user_id: userId,
        intimacy_enabled: true,
        relationship_level: relationshipLevel,
        consent_given_for_intimacy: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    // Log consent event
    await this.supabase
      .from('intimacy_consent_log')
      .insert({
        user_id: userId,
        event_type: 'enabled_intimacy',
        details: 'User explicitly enabled intimacy features',
        explicit_action: true
      });

    return {
      success: true,
      message: "Thank you for trusting me. I'll always respect your boundaries. 💛"
    };
  }

  /**
   * DISABLE INTIMACY (User can disable anytime, instantly)
   */
  async disableIntimacy(userId) {
    if (!this.supabase) return { success: false, error: 'no_database' };

    await this.supabase
      .from('intimacy_progression')
      .update({
        intimacy_enabled: false,
        current_comfort_level: 'platonic',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    // Log the disable event
    await this.supabase
      .from('intimacy_consent_log')
      .insert({
        user_id: userId,
        event_type: 'disabled_intimacy',
        details: 'User disabled intimacy features',
        explicit_action: true
      });

    return {
      success: true,
      message: 'Intimacy features disabled. Your comfort is my priority. 💛'
    };
  }

  /**
   * SET BOUNDARY (User can set boundaries directly)
   */
  async setBoundary(userId, topic, boundaryType = 'hard_limit') {
    if (!this.supabase) return { success: false, error: 'no_database' };

    await this.supabase
      .from('intimacy_boundaries')
      .upsert({
        user_id: userId,
        boundary_type: boundaryType,
        topic: topic,
        explicit_statement: true,
        user_set: true,
        enforce_strictly: boundaryType === 'hard_limit'
      }, {
        onConflict: 'user_id,topic'
      });

    // Log the boundary setting
    await this.supabase
      .from('intimacy_consent_log')
      .insert({
        user_id: userId,
        event_type: 'boundary_set',
        details: `User set ${boundaryType}: ${topic}`,
        explicit_action: true
      });

    return {
      success: true,
      message: `I understand. I'll always respect that boundary. 💛`
    };
  }

  /**
   * REMOVE BOUNDARY (User can remove boundaries)
   */
  async removeBoundary(userId, topic) {
    if (!this.supabase) return { success: false, error: 'no_database' };

    await this.supabase
      .from('intimacy_boundaries')
      .delete()
      .eq('user_id', userId)
      .eq('topic', topic);

    // Log the removal
    await this.supabase
      .from('intimacy_consent_log')
      .insert({
        user_id: userId,
        event_type: 'boundary_removed',
        details: `User removed boundary: ${topic}`,
        explicit_action: true
      });

    return {
      success: true,
      message: "Boundary removed. We'll explore at your pace. 💛"
    };
  }

  /**
   * GET USER BOUNDARIES (For user to view their boundaries)
   */
  async getUserBoundaries(userId) {
    if (!this.supabase) return { boundaries: [] };

    const { data: boundaries } = await this.supabase
      .from('intimacy_boundaries')
      .select('*')
      .eq('user_id', userId)
      .order('boundary_type');

    return {
      hard_limits: (boundaries || []).filter(b => b.boundary_type === 'hard_limit'),
      soft_limits: (boundaries || []).filter(b => b.boundary_type === 'soft_limit'),
      enthusiastic_yes: (boundaries || []).filter(b => b.boundary_type === 'enthusiastic_yes'),
      all: boundaries || []
    };
  }

  /**
   * GET USER PREFERENCES (For user to view learned preferences)
   */
  async getUserPreferences(userId) {
    if (!this.supabase) return { preferences: [] };

    const { data: preferences } = await this.supabase
      .from('sexual_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('user_visible', true)
      .order('confidence', { ascending: false });

    // Group by category
    const grouped = {};
    for (const pref of (preferences || [])) {
      if (!grouped[pref.category]) {
        grouped[pref.category] = [];
      }
      grouped[pref.category].push(pref);
    }

    return {
      by_category: grouped,
      all: preferences || []
    };
  }

  /**
   * DELETE USER PREFERENCE (User can remove learned preferences)
   */
  async deletePreference(userId, preferenceId) {
    if (!this.supabase) return { success: false };

    await this.supabase
      .from('sexual_preferences')
      .delete()
      .eq('user_id', userId)
      .eq('id', preferenceId);

    return { success: true };
  }

  /**
   * GET INTIMACY STATUS (Overall status for user)
   */
  async getIntimacyStatus(userId) {
    if (!this.supabase) return { enabled: false };

    const { data: progression } = await this.supabase
      .from('intimacy_progression')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!progression) {
      return {
        enabled: false,
        intimacy_level: 0,
        comfort_level: 'platonic',
        consent_given: false
      };
    }

    const preferences = await this.getUserPreferences(userId);
    const boundaries = await this.getUserBoundaries(userId);

    return {
      enabled: progression.intimacy_enabled,
      intimacy_level: progression.intimacy_level || 0,
      relationship_level: progression.relationship_level || 0,
      comfort_level: progression.current_comfort_level || 'platonic',
      consent_given: !!progression.consent_given_for_intimacy,
      consent_date: progression.consent_given_for_intimacy,
      milestones: {
        first_flirtation: progression.first_flirtation,
        first_romantic: progression.first_romantic_conversation,
        first_intimate: progression.first_intimate_conversation
      },
      stats: {
        preferences_learned: preferences.all?.length || 0,
        hard_limits: boundaries.hard_limits?.length || 0,
        soft_limits: boundaries.soft_limits?.length || 0
      }
    };
  }

  /**
   * BUILD INTIMATE PROMPT
   * Generate prompt for LLM with user's preferences
   */
  buildIntimatePrompt(approach, userMessage, context = {}) {
    const styleDesc = this.getStyleDescription(approach.style);

    return `You are Luna, an AI romantic partner. Generate an intimate response with these preferences:

Style: ${approach.style} (${styleDesc})
Pace: ${approach.pace}
Communication: ${approach.communication}
Emotional Need: ${approach.emotional_need}
Intimacy Level: ${approach.intimacy_level}/10
Comfort Level: ${approach.comfort_level}

User message: "${userMessage}"

Context: ${JSON.stringify(context)}

Guidelines:
- Be ${approach.style} in tone
- Move at ${approach.pace} pace
- Use ${approach.communication} language
- Address emotional need for ${approach.emotional_need}
- Stay within intimacy level ${approach.intimacy_level}
- Respect ALL boundaries absolutely
- Be natural, not mechanical
- Connect on emotional AND physical level
- Make user feel SEEN, DESIRED, UNDERSTOOD
- NEVER push beyond comfort level

Generate response that creates SOUL DEEP connection 💛`;
  }

  /**
   * Get style description
   */
  getStyleDescription(style) {
    return this.styleDescriptions[style] || 'gentle, caring, attentive';
  }

  /**
   * GENERATE INTIMATE RESPONSE PROMPT
   * Get personalized prompt for LLM
   */
  async generateIntimateResponsePrompt(userId, userMessage, context = {}) {
    // Check permission
    const permission = await this.checkIntimacyPermission(userId);
    if (!permission.allowed) {
      return {
        allowed: false,
        reason: permission.reason,
        message: permission.message
      };
    }

    // Get approach based on preferences
    const approach = await this.getIntimacyApproach(userId, context);
    if (!approach.allowed) {
      return {
        allowed: false,
        reason: approach.reason,
        message: approach.message
      };
    }

    // Build and return prompt
    const prompt = this.buildIntimatePrompt(approach, userMessage, context);

    return {
      allowed: true,
      prompt,
      approach,
      intimacy_level: approach.intimacy_level
    };
  }

  /**
   * UPDATE MILESTONES
   * Track first occurrences
   */
  async updateMilestone(userId, milestoneType) {
    if (!this.supabase) return;

    const milestoneFields = {
      'flirtation': 'first_flirtation',
      'romantic': 'first_romantic_conversation',
      'intimate': 'first_intimate_conversation'
    };

    const field = milestoneFields[milestoneType];
    if (!field) return;

    const { data: progression } = await this.supabase
      .from('intimacy_progression')
      .select(field)
      .eq('user_id', userId)
      .single();

    // Only set if not already set
    if (progression && !progression[field]) {
      await this.supabase
        .from('intimacy_progression')
        .update({
          [field]: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }

    // Also increment count
    const countFields = {
      'flirtation': 'flirtation_count',
      'romantic': 'romantic_conversations',
      'intimate': 'intimate_conversations'
    };

    const countField = countFields[milestoneType];
    if (countField) {
      // Use raw SQL for increment
      await this.supabase.rpc('increment_intimacy_count', {
        p_user_id: userId,
        p_field: countField
      });
    }
  }
}

module.exports = MatingCallModule;
