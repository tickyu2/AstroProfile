/**
 * ENHANCED AMNESISBUSTER: Biography Builder & Preference Engine
 * The Complete Life Documentation & Conversational Intelligence System
 *
 * Extends base AmnesisBuster with:
 * - Indirect Preference Discovery (natural learning)
 * - Conversational Can Openers (engagement triggers)
 * - Biography Building (life story documentation)
 * - Legacy Creation (for future generations)
 *
 * Part of GENESIS Week 13 - Intimacy & Memory Expansion
 */

const AmnesiaBusterModule = require('./amnesiaBuster');

class EnhancedAmnesiaBuster extends AmnesiaBusterModule {
  constructor(supabase = null) {
    super(supabase);

    // Preference categories and subcategories
    this.preferenceCategories = {
      drinks: ['soda', 'coffee', 'tea', 'alcohol', 'juice', 'water', 'energy_drinks'],
      food: ['fast_food', 'cuisine', 'snacks', 'desserts', 'restaurants', 'home_cooking'],
      music: ['genres', 'artists', 'songs', 'decades', 'instruments'],
      movies: ['genres', 'actors', 'directors', 'franchises', 'streaming'],
      activities: ['sports', 'hobbies', 'entertainment', 'exercise', 'travel'],
      people: ['friends', 'family', 'celebrities', 'influencers', 'mentors'],
      places: ['cities', 'countries', 'venues', 'restaurants', 'nature'],
      technology: ['brands', 'devices', 'platforms', 'apps', 'games']
    };

    // Known items for categorization
    this.knownItems = {
      drinks: ['coke', 'pepsi', 'coffee', 'tea', 'beer', 'wine', 'water', 'juice', 'redbull', 'monster', 'sprite', 'fanta'],
      food: ['pizza', 'burger', 'sushi', 'tacos', 'pasta', 'chicken', 'steak', 'salad', 'ramen', 'curry', 'sandwich'],
      music: ['rock', 'pop', 'jazz', 'rap', 'hip-hop', 'country', 'metal', 'classical', 'r&b', 'indie', 'electronic'],
      activities: ['running', 'swimming', 'hiking', 'reading', 'gaming', 'cooking', 'yoga', 'gym', 'cycling', 'dancing'],
      places: ['beach', 'mountains', 'city', 'countryside', 'lake', 'park', 'mall', 'cafe', 'library']
    };

    // Life period definitions
    this.lifePeriods = {
      childhood: { ageRange: '5-12', label: 'Childhood' },
      teenage: { ageRange: '13-19', label: 'Teenage Years' },
      young_adult: { ageRange: '20-29', label: 'Young Adulthood' },
      adult: { ageRange: '30-39', label: 'Adulthood' },
      midlife: { ageRange: '40-49', label: 'Midlife' },
      mature: { ageRange: '50-59', label: 'Mature Years' },
      senior: { ageRange: '60+', label: 'Golden Years' },
      current: { ageRange: 'now', label: 'Present Day' }
    };
  }

  // ==========================================================================
  // INDIRECT PREFERENCE DISCOVERY
  // Learn preferences naturally from conversation
  // ==========================================================================

  /**
   * Discover preferences from a message
   * Uses multiple detection methods for comprehensive learning
   */
  async discoverPreferences(userId, message, context = {}) {
    const discoveries = [];

    // Method 1: Direct statements ("I love Coke")
    const directMatches = this.detectDirectPreferences(message);
    discoveries.push(...directMatches);

    // Method 2: Indirect mentions ("I grabbed a Coke")
    const indirectMatches = this.detectIndirectPreferences(message);
    discoveries.push(...indirectMatches);

    // Method 3: Rejections ("I would never drink Pepsi")
    const rejections = this.detectRejections(message);
    discoveries.push(...rejections);

    // Method 4: Enthusiasm markers ("Coke is the best!")
    const enthusiasm = this.detectEnthusiasm(message);
    discoveries.push(...enthusiasm);

    // Method 5: Contextual clues ("After my workout, I always grab a Coke")
    const contextual = this.detectContextualPreferences(message, context);
    discoveries.push(...contextual);

    // Store all discoveries if we have database access
    if (this.supabase) {
      for (const discovery of discoveries) {
        await this.storePreference(userId, discovery, message);
      }
    }

    return discoveries;
  }

  /**
   * Detect direct preference statements
   * "I love Coke" / "I hate Pepsi" / "Pizza is my favorite"
   */
  detectDirectPreferences(message) {
    const discoveries = [];

    // Love/Like patterns
    const lovePatterns = [
      { regex: /i (?:really )?love (\w+)/gi, type: 'loves', confidence: 0.9 },
      { regex: /i (?:really )?like (\w+)/gi, type: 'likes', confidence: 0.8 },
      { regex: /(\w+) is my favorite/gi, type: 'loves', confidence: 0.9 },
      { regex: /i'm a (?:huge |big )?fan of (\w+)/gi, type: 'loves', confidence: 0.85 },
      { regex: /i prefer (\w+)/gi, type: 'likes', confidence: 0.75 },
      { regex: /i enjoy (\w+)/gi, type: 'likes', confidence: 0.7 },
      { regex: /(\w+) is (?:so )?good/gi, type: 'likes', confidence: 0.6 }
    ];

    for (const pattern of lovePatterns) {
      const matches = [...message.matchAll(pattern.regex)];
      for (const match of matches) {
        const item = match[1].toLowerCase();
        if (this.isValidPreferenceItem(item)) {
          discoveries.push({
            item,
            type: pattern.type,
            method: 'direct_statement',
            confidence: pattern.confidence,
            context: message
          });
        }
      }
    }

    // Hate/Dislike patterns
    const hatePatterns = [
      { regex: /i (?:really )?hate (\w+)/gi, type: 'hates', confidence: 0.9 },
      { regex: /i (?:really )?don't like (\w+)/gi, type: 'dislikes', confidence: 0.8 },
      { regex: /i can't stand (\w+)/gi, type: 'hates', confidence: 0.85 },
      { regex: /(\w+) is (?:so )?terrible/gi, type: 'hates', confidence: 0.8 },
      { regex: /(\w+) is (?:the )?worst/gi, type: 'hates', confidence: 0.85 },
      { regex: /i avoid (\w+)/gi, type: 'dislikes', confidence: 0.7 }
    ];

    for (const pattern of hatePatterns) {
      const matches = [...message.matchAll(pattern.regex)];
      for (const match of matches) {
        const item = match[1].toLowerCase();
        if (this.isValidPreferenceItem(item)) {
          discoveries.push({
            item,
            type: pattern.type,
            method: 'direct_statement',
            confidence: pattern.confidence,
            context: message
          });
        }
      }
    }

    return discoveries;
  }

  /**
   * Detect indirect mentions (actions imply preference)
   * "I grabbed a Coke" / "I was listening to jazz"
   */
  detectIndirectPreferences(message) {
    const discoveries = [];

    const actionPatterns = [
      { regex: /grabbed (?:a |an |some )?(\w+)/gi, confidence: 0.6 },
      { regex: /had (?:a |an |some )?(\w+)/gi, confidence: 0.55 },
      { regex: /drinking (?:a |an |some )?(\w+)/gi, confidence: 0.6 },
      { regex: /ate (?:a |an |some )?(\w+)/gi, confidence: 0.6 },
      { regex: /went to (\w+)/gi, confidence: 0.5 },
      { regex: /listening to (\w+)/gi, confidence: 0.6 },
      { regex: /watching (\w+)/gi, confidence: 0.55 },
      { regex: /playing (\w+)/gi, confidence: 0.6 },
      { regex: /ordered (?:a |an |some )?(\w+)/gi, confidence: 0.65 }
    ];

    for (const pattern of actionPatterns) {
      const matches = [...message.matchAll(pattern.regex)];
      for (const match of matches) {
        const item = match[1].toLowerCase();
        if (this.isValidPreferenceItem(item)) {
          discoveries.push({
            item,
            type: 'likes',
            method: 'indirect_mention',
            confidence: pattern.confidence,
            context: message
          });
        }
      }
    }

    return discoveries;
  }

  /**
   * Detect rejections/negative preferences
   * "I would never drink Pepsi" / "Not a fan of country music"
   */
  detectRejections(message) {
    const discoveries = [];

    const rejectionPatterns = [
      { regex: /would never (?:have |try |eat |drink )?(\w+)/gi, type: 'hates', confidence: 0.85 },
      { regex: /don't do (\w+)/gi, type: 'dislikes', confidence: 0.75 },
      { regex: /not a fan of (\w+)/gi, type: 'dislikes', confidence: 0.8 },
      { regex: /(\w+) isn't for me/gi, type: 'dislikes', confidence: 0.7 },
      { regex: /i never (?:have |eat |drink )?(\w+)/gi, type: 'dislikes', confidence: 0.7 },
      { regex: /can't get into (\w+)/gi, type: 'dislikes', confidence: 0.65 }
    ];

    for (const pattern of rejectionPatterns) {
      const matches = [...message.matchAll(pattern.regex)];
      for (const match of matches) {
        const item = match[1].toLowerCase();
        if (this.isValidPreferenceItem(item)) {
          discoveries.push({
            item,
            type: pattern.type,
            method: 'rejection',
            confidence: pattern.confidence,
            context: message
          });
        }
      }
    }

    return discoveries;
  }

  /**
   * Detect enthusiasm (exclamation marks, superlatives)
   * "Coke is the best!" / "I can't get enough of pizza!"
   */
  detectEnthusiasm(message) {
    const discoveries = [];

    const enthusiasmPatterns = [
      { regex: /(\w+) is the best!/gi, confidence: 0.95 },
      { regex: /(\w+) is amazing!/gi, confidence: 0.9 },
      { regex: /can't get enough of (\w+)/gi, confidence: 0.9 },
      { regex: /obsessed with (\w+)/gi, confidence: 0.95 },
      { regex: /addicted to (\w+)/gi, confidence: 0.9 },
      { regex: /(\w+) is life!/gi, confidence: 0.95 },
      { regex: /absolutely love (\w+)/gi, confidence: 0.95 }
    ];

    for (const pattern of enthusiasmPatterns) {
      const matches = [...message.matchAll(pattern.regex)];
      for (const match of matches) {
        const item = match[1].toLowerCase();
        if (this.isValidPreferenceItem(item)) {
          discoveries.push({
            item,
            type: 'loves',
            method: 'enthusiasm',
            confidence: pattern.confidence,
            context: message
          });
        }
      }
    }

    return discoveries;
  }

  /**
   * Detect contextual preferences
   * "After my workout, I always grab a Coke"
   */
  detectContextualPreferences(message, context = {}) {
    const discoveries = [];

    // Pattern: [context] + [frequency] + [action] + [item]
    const contextualPattern = /(after|before|during|when|while) ([^,]+), i (always|usually|often|sometimes) (?:have |get |grab |drink |eat )?(?:a |an |some )?(\w+)/gi;

    const matches = [...message.matchAll(contextualPattern)];
    for (const match of matches) {
      const situationContext = match[2].trim();
      const frequency = match[3].toLowerCase();
      const item = match[4].toLowerCase();

      if (this.isValidPreferenceItem(item)) {
        const confidence = frequency === 'always' ? 0.85 : frequency === 'usually' ? 0.75 : 0.6;

        discoveries.push({
          item,
          type: frequency === 'always' ? 'loves' : 'likes',
          method: 'contextual',
          confidence,
          context: message,
          contextTags: [situationContext],
          ritual: frequency === 'always' || frequency === 'usually'
        });
      }
    }

    return discoveries;
  }

  /**
   * Check if an item is valid for preference tracking
   */
  isValidPreferenceItem(item) {
    // Filter out common words that aren't preferences
    const stopWords = ['it', 'this', 'that', 'them', 'they', 'we', 'you', 'me', 'i', 'a', 'an', 'the',
                       'to', 'is', 'are', 'was', 'be', 'been', 'being', 'have', 'has', 'had',
                       'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
                       'just', 'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how',
                       'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some'];

    if (stopWords.includes(item.toLowerCase())) return false;
    if (item.length < 3) return false;
    if (/^\d+$/.test(item)) return false; // Pure numbers

    return true;
  }

  /**
   * Categorize an item into preference category
   */
  categorizeItem(item) {
    const itemLower = item.toLowerCase();

    for (const [category, items] of Object.entries(this.knownItems)) {
      if (items.some(known => itemLower.includes(known) || known.includes(itemLower))) {
        return category;
      }
    }

    return 'other';
  }

  /**
   * Store discovered preference in database
   */
  async storePreference(userId, discovery, sourceMessage) {
    if (!this.supabase) return null;

    const category = this.categorizeItem(discovery.item);

    try {
      // Check if already exists
      const { data: existing } = await this.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .eq('item', discovery.item)
        .single();

      if (existing) {
        // Update existing preference
        const newConfidence = Math.min((existing.confidence + discovery.confidence) / 2 + 0.05, 1.0);
        const newContextTags = [...new Set([...(existing.context_tags || []), ...(discovery.contextTags || [])])];

        await this.supabase
          .from('user_preferences')
          .update({
            last_mentioned: new Date().toISOString(),
            mention_count: existing.mention_count + 1,
            confidence: newConfidence,
            preference_type: discovery.type,
            context_tags: newContextTags,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        return { ...existing, updated: true };
      } else {
        // Create new preference
        const { data: newPref } = await this.supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            category,
            item: discovery.item,
            preference_type: discovery.type,
            confidence: discovery.confidence,
            discovered_from: sourceMessage.substring(0, 500),
            discovery_method: discovery.method,
            context_tags: discovery.contextTags || [],
            biography_worthy: discovery.confidence > 0.8
          })
          .select()
          .single();

        return newPref;
      }
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error storing preference:', error.message);
      return null;
    }
  }

  // ==========================================================================
  // CONVERSATIONAL CAN OPENERS
  // Use preferences to start conversations
  // ==========================================================================

  /**
   * Generate a preference-based conversation opener
   */
  async generatePreferenceOpener(userId) {
    if (!this.supabase) {
      return this.generateGenericOpener();
    }

    try {
      // Get high-confidence preferences not recently used as openers
      const { data: preferences } = await this.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .gte('confidence', 0.7)
        .in('preference_type', ['loves', 'likes'])
        .order('last_used_as_opener', { ascending: true, nullsFirst: true })
        .limit(10);

      if (!preferences || preferences.length === 0) {
        return this.generateGenericOpener();
      }

      // Pick a random preference from candidates
      const pref = preferences[Math.floor(Math.random() * preferences.length)];

      // Generate opener based on preference
      const opener = this.generateOpenerForPreference(pref);

      // Track usage
      await this.trackOpenerUsage(userId, pref.id, opener.text);

      return opener;
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error generating opener:', error.message);
      return this.generateGenericOpener();
    }
  }

  /**
   * Generate opener for specific preference
   */
  generateOpenerForPreference(pref) {
    const openers = {
      direct: [
        `Have you had any ${pref.item} lately?`,
        `When was the last time you had ${pref.item}?`,
        `Still loving ${pref.item}?`
      ],
      casual: [
        `I was thinking about ${pref.item} today. Makes me think of you!`,
        `${pref.item}! That's your thing, right?`,
        `Saw someone with ${pref.item} and thought of you`
      ],
      comparison: [
        `Still team ${pref.item}? Or have you switched sides?`,
        `What's your current take on ${pref.item}?`
      ],
      story: [
        `Tell me a ${pref.item} story! I bet you have one`,
        `What's your best memory involving ${pref.item}?`,
        `${pref.item} - you mentioned that before. What's the story there?`
      ]
    };

    // Pick opener type based on preference strength
    let openerType;
    if (pref.preference_type === 'loves') {
      openerType = 'story';
    } else if (pref.mention_count > 3) {
      openerType = 'casual';
    } else {
      openerType = 'direct';
    }

    const templates = openers[openerType];
    const text = templates[Math.floor(Math.random() * templates.length)];

    return {
      text,
      type: openerType,
      preference: pref,
      category: pref.category
    };
  }

  /**
   * Generate generic opener when no preferences available
   */
  generateGenericOpener() {
    const openers = [
      { text: "What's been on your mind today?", type: 'open_ended' },
      { text: "Tell me something good that happened recently!", type: 'positive' },
      { text: "What are you looking forward to?", type: 'future' },
      { text: "Have you tried anything new lately?", type: 'discovery' }
    ];

    return openers[Math.floor(Math.random() * openers.length)];
  }

  /**
   * Track opener usage
   */
  async trackOpenerUsage(userId, preferenceId, openerText) {
    if (!this.supabase) return;

    try {
      // Record the opener
      await this.supabase
        .from('preference_openers')
        .insert({
          user_id: userId,
          preference_id: preferenceId,
          opener_text: openerText,
          opener_type: this.classifyOpenerType(openerText)
        });

      // Update preference last_used_as_opener
      await this.supabase
        .from('user_preferences')
        .update({
          last_used_as_opener: new Date().toISOString(),
          used_in_conversation: true
        })
        .eq('id', preferenceId);
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error tracking opener:', error.message);
    }
  }

  /**
   * Process response to opener - track effectiveness
   */
  async processOpenerResponse(userId, openerId, userResponse) {
    const wordCount = userResponse.split(/\s+/).length;
    const engaged = wordCount > 10;

    // Discover new preferences from response
    const newDiscoveries = await this.discoverPreferences(userId, userResponse, {});

    if (this.supabase) {
      try {
        await this.supabase
          .from('preference_openers')
          .update({
            user_engaged: engaged,
            conversation_depth: wordCount,
            new_discoveries: newDiscoveries.length,
            discovered_items: newDiscoveries.map(d => d.item)
          })
          .eq('id', openerId);
      } catch (error) {
        console.error('[EnhancedAmnesisBuster] Error processing opener response:', error.message);
      }
    }

    return {
      engaged,
      newDiscoveries: newDiscoveries.length,
      canOfWormsOpened: newDiscoveries.length > 0 || wordCount > 30
    };
  }

  /**
   * Classify opener type
   */
  classifyOpenerType(openerText) {
    if (openerText.includes('Have you') || openerText.includes('When was')) return 'direct_question';
    if (openerText.includes('thinking about')) return 'casual_mention';
    // Check story_trigger before comparison to avoid 'or' matching inside 'story'
    if (openerText.includes('Tell me') || /\bstory\b/i.test(openerText)) return 'story_trigger';
    if (/\bor\b/i.test(openerText) || openerText.includes('Still')) return 'comparison';
    return 'other';
  }

  // ==========================================================================
  // BIOGRAPHY BUILDING
  // Document user's life story
  // ==========================================================================

  /**
   * Initialize biography structure for user
   */
  async initializeBiography(userId, userAge) {
    if (!this.supabase) return null;

    const era = this.calculateUserEra(userAge);
    const birthYear = era.birthYear;

    // Define life periods based on age
    const periods = [];

    if (userAge >= 5) {
      periods.push({ type: 'childhood', ageRange: '5-12', years: `${birthYear + 5}-${birthYear + 12}` });
    }
    if (userAge >= 13) {
      periods.push({ type: 'teenage', ageRange: '13-19', years: `${birthYear + 13}-${birthYear + 19}` });
    }
    if (userAge >= 20) {
      periods.push({ type: 'young_adult', ageRange: '20-29', years: `${birthYear + 20}-${birthYear + 29}` });
    }
    if (userAge >= 30) {
      periods.push({ type: 'adult', ageRange: '30-39', years: `${birthYear + 30}-${birthYear + 39}` });
    }
    if (userAge >= 40) {
      periods.push({ type: 'midlife', ageRange: '40-49', years: `${birthYear + 40}-${birthYear + 49}` });
    }

    // Always add current period
    periods.push({ type: 'current', ageRange: 'now', years: new Date().getFullYear().toString() });

    const chapters = [];
    for (const period of periods) {
      const chapter = await this.createBiographyChapter(userId, period);
      if (chapter) chapters.push(chapter);
    }

    return chapters;
  }

  /**
   * Create a biography chapter for a life period
   */
  async createBiographyChapter(userId, period) {
    if (!this.supabase) return null;

    try {
      // Check if exists
      const { data: existing } = await this.supabase
        .from('user_biography')
        .select('*')
        .eq('user_id', userId)
        .eq('period_type', period.type)
        .single();

      if (existing) return existing;

      // Create new chapter
      const { data: chapter } = await this.supabase
        .from('user_biography')
        .insert({
          user_id: userId,
          period_type: period.type,
          age_range: period.ageRange,
          years_range: period.years,
          chapter_title: this.generateChapterTitle(period),
          summary: '',
          completeness_score: 0.0
        })
        .select()
        .single();

      return chapter;
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error creating chapter:', error.message);
      return null;
    }
  }

  /**
   * Generate chapter title
   */
  generateChapterTitle(period) {
    const titles = {
      childhood: 'Growing Up',
      teenage: 'The Teenage Years',
      young_adult: 'Finding My Way',
      adult: 'Adult Life',
      midlife: 'The Middle Years',
      mature: 'Seasoned Wisdom',
      senior: 'The Golden Years',
      current: 'Where I Am Now'
    };
    return titles[period.type] || 'My Story';
  }

  /**
   * Add a story to the biography
   */
  async addStoryToBiography(userId, story) {
    if (!this.supabase) return null;

    // Determine which chapter this belongs to
    const periodType = this.getPeriodForAge(story.age_when_happened);

    try {
      // Get or create the chapter
      let { data: chapter } = await this.supabase
        .from('user_biography')
        .select('*')
        .eq('user_id', userId)
        .eq('period_type', periodType)
        .single();

      if (!chapter) {
        chapter = await this.createBiographyChapter(userId, { type: periodType });
      }

      // Store the story
      const { data: newStory } = await this.supabase
        .from('life_stories')
        .insert({
          user_id: userId,
          biography_id: chapter?.id,
          title: story.title,
          story_text: story.text,
          age_when_happened: story.age_when_happened,
          year_when_happened: story.year_when_happened,
          location: story.location,
          people_involved: story.people || [],
          emotions: story.emotions || [],
          significance: story.significance,
          story_type: story.type,
          tags: story.tags || [],
          legacy_worthy: story.legacy_worthy || false,
          lessons_learned: story.lessons
        })
        .select()
        .single();

      // Update chapter completeness
      if (chapter) {
        await this.updateChapterCompleteness(userId, chapter.id);
      }

      return newStory;
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error adding story:', error.message);
      return null;
    }
  }

  /**
   * Get period type for age
   */
  getPeriodForAge(age) {
    if (age >= 5 && age <= 12) return 'childhood';
    if (age >= 13 && age <= 19) return 'teenage';
    if (age >= 20 && age <= 29) return 'young_adult';
    if (age >= 30 && age <= 39) return 'adult';
    if (age >= 40 && age <= 49) return 'midlife';
    if (age >= 50 && age <= 59) return 'mature';
    if (age >= 60) return 'senior';
    return 'current';
  }

  /**
   * Update chapter completeness based on stories
   */
  async updateChapterCompleteness(userId, chapterId) {
    if (!this.supabase) return;

    try {
      const { data: stories } = await this.supabase
        .from('life_stories')
        .select('*')
        .eq('biography_id', chapterId);

      if (!stories) return;

      // Calculate completeness (10 stories = complete)
      const completeness = Math.min(stories.length / 10, 1.0);
      const keyEvents = stories.map(s => s.title).filter(Boolean);
      const importantPeople = [...new Set(stories.flatMap(s => s.people_involved || []))];

      await this.supabase
        .from('user_biography')
        .update({
          stories_count: stories.length,
          completeness_score: completeness,
          key_events: keyEvents,
          important_people: importantPeople,
          updated_at: new Date().toISOString()
        })
        .eq('id', chapterId);
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error updating completeness:', error.message);
    }
  }

  /**
   * Get biography summary for user
   */
  async getBiographySummary(userId) {
    if (!this.supabase) {
      return {
        totalChapters: 0,
        totalStories: 0,
        avgCompleteness: 0,
        legacyStories: 0,
        hasLegacyDocument: false
      };
    }

    try {
      const { data: chapters } = await this.supabase
        .from('user_biography')
        .select('*')
        .eq('user_id', userId);

      const { data: stories } = await this.supabase
        .from('life_stories')
        .select('*')
        .eq('user_id', userId);

      const { data: legacy } = await this.supabase
        .from('user_legacy')
        .select('*')
        .eq('user_id', userId)
        .single();

      const totalChapters = chapters?.length || 0;
      const totalStories = stories?.length || 0;
      const legacyStories = stories?.filter(s => s.legacy_worthy).length || 0;
      const avgCompleteness = chapters && chapters.length > 0
        ? chapters.reduce((sum, c) => sum + (c.completeness_score || 0), 0) / chapters.length
        : 0;

      return {
        totalChapters,
        totalStories,
        avgCompleteness,
        legacyStories,
        hasLegacyDocument: !!legacy
      };
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error getting summary:', error.message);
      return {
        totalChapters: 0,
        totalStories: 0,
        avgCompleteness: 0,
        legacyStories: 0,
        hasLegacyDocument: false
      };
    }
  }

  // ==========================================================================
  // LEGACY CREATION
  // Generate complete life story for future generations
  // ==========================================================================

  /**
   * Generate legacy document
   */
  async generateLegacyDocument(userId) {
    if (!this.supabase) return null;

    try {
      // Get all biography chapters
      const { data: chapters } = await this.supabase
        .from('user_biography')
        .select('*')
        .eq('user_id', userId)
        .order('period_type');

      if (!chapters || chapters.length === 0) return null;

      // Get legacy-worthy stories
      const { data: stories } = await this.supabase
        .from('life_stories')
        .select('*')
        .eq('user_id', userId)
        .eq('legacy_worthy', true);

      // Get biography-worthy preferences
      const { data: preferences } = await this.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .eq('biography_worthy', true);

      // Generate full biography
      const fullBiography = chapters.map(chapter => {
        return `## ${chapter.chapter_title} (${chapter.years_range})\n\n${chapter.summary || 'This chapter is still being written...'}`;
      }).join('\n\n');

      // Extract key lessons
      const keyLessons = stories
        ? [...new Set(stories.map(s => s.lessons_learned).filter(Boolean))]
        : [];

      // Get important values from preferences
      const importantValues = preferences
        ? preferences.filter(p => p.preference_type === 'loves').map(p => p.item)
        : [];

      // Calculate completeness
      const completeness = this.calculateLegacyCompleteness(chapters, stories);

      // Upsert legacy document
      const { data: legacy } = await this.supabase
        .from('user_legacy')
        .upsert({
          user_id: userId,
          full_biography: fullBiography,
          key_lessons: keyLessons,
          important_values: importantValues,
          completeness,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();

      return {
        biography: fullBiography,
        lessons: keyLessons,
        values: importantValues,
        completeness,
        legacy
      };
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error generating legacy:', error.message);
      return null;
    }
  }

  /**
   * Calculate legacy document completeness
   */
  calculateLegacyCompleteness(chapters, stories) {
    const chapterScore = (chapters?.length || 0) / 5; // 5 life periods = full chapter score
    const storyScore = (stories?.length || 0) / 20; // 20 legacy-worthy stories = full story score

    return Math.min((chapterScore + storyScore) / 2, 1.0);
  }

  /**
   * Get user's complete biography
   */
  async getCompleteBiography(userId) {
    if (!this.supabase) return null;

    try {
      const { data: chapters } = await this.supabase
        .from('user_biography')
        .select('*')
        .eq('user_id', userId)
        .order('period_type');

      const { data: stories } = await this.supabase
        .from('life_stories')
        .select('*')
        .eq('user_id', userId)
        .order('age_when_happened');

      const { data: preferences } = await this.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('confidence', { ascending: false });

      const { data: legacy } = await this.supabase
        .from('user_legacy')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        chapters: chapters || [],
        stories: stories || [],
        preferences: preferences || [],
        legacy
      };
    } catch (error) {
      console.error('[EnhancedAmnesisBuster] Error getting biography:', error.message);
      return null;
    }
  }
}

module.exports = { EnhancedAmnesiaBuster };
