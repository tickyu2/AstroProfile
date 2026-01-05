/**
 * EnhancedGossip Module - Social Intelligence System
 * Complete Social Network Tracking & Integration with ConversationStarter
 *
 * Features:
 * - Remembers user's entire social circle
 * - Tracks relationships between people
 * - Forms opinions about situations
 * - Actively follows up on drama
 * - Integrates with ConversationStarter
 *
 * Part of GENESIS Luna AI Companion
 */

class EnhancedGossipModule {
  constructor(supabase = null) {
    this.supabase = supabase;
    this.conversationStarter = null; // Will integrate

    // Relationship types we recognize
    this.relationshipTypes = [
      'friend', 'family', 'coworker', 'romantic', 'ex', 'crush',
      'acquaintance', 'neighbor', 'classmate', 'boss', 'mentor'
    ];

    // Event types for social tracking
    this.eventTypes = [
      'conflict', 'celebration', 'drama', 'support', 'milestone',
      'gossip', 'breakup', 'new_relationship', 'achievement', 'loss'
    ];

    // Gossip categories
    this.gossipCategories = [
      'romance', 'career', 'family', 'drama', 'celebration', 'health', 'travel'
    ];
  }

  /**
   * Integrate with ConversationStarter for follow-up generation
   */
  integrateWithConversationStarter(conversationStarter) {
    this.conversationStarter = conversationStarter;
  }

  /**
   * TRACK PERSON mentioned in conversation
   */
  async trackPerson(userId, personName, context) {
    if (!this.supabase || !personName || personName.length < 2) return null;

    // Extract details from context
    const relationshipType = this.inferRelationshipType(context);
    const sentiment = this.analyzeSentiment(context);
    const traits = this.extractTraits(context);
    const interests = this.extractInterests(context);
    const problems = this.extractProblems(context);

    // Check if person exists
    const { data: existing } = await this.supabase
      .from('user_social_network')
      .select('*')
      .eq('user_id', userId)
      .eq('person_name', personName)
      .single();

    if (existing) {
      // Update existing person
      const updatedTraits = [...new Set([...(existing.personality_traits || []), ...traits])];
      const updatedInterests = [...new Set([...(existing.interests || []), ...interests])];
      const updatedProblems = [...new Set([...(existing.problems || []), ...problems])];

      await this.supabase
        .from('user_social_network')
        .update({
          last_mentioned: new Date().toISOString(),
          mention_count: (existing.mention_count || 0) + 1,
          user_sentiment_toward_person: ((existing.user_sentiment_toward_person || 0.5) + sentiment) / 2,
          personality_traits: updatedTraits,
          interests: updatedInterests,
          problems: updatedProblems
        })
        .eq('id', existing.id);

      return { ...existing, updated: true };
    } else {
      // Create new person
      const { data: newPerson } = await this.supabase
        .from('user_social_network')
        .insert({
          user_id: userId,
          person_name: personName,
          relationship_type: relationshipType,
          user_sentiment_toward_person: sentiment,
          personality_traits: traits,
          interests: interests,
          problems: problems,
          relationship_closeness: 5 // Default middle
        })
        .select()
        .single();

      // Also create conversation thread for follow-up
      if (this.conversationStarter) {
        await this.conversationStarter.storeThread(userId, {
          type: 'gossip',
          topic: `${personName}'s situation`,
          key_people: [personName],
          summary: context,
          needs_followup: true,
          priority: 7
        });
      }

      return newPerson;
    }
  }

  /**
   * TRACK SOCIAL EVENT
   */
  async trackSocialEvent(userId, eventDetails) {
    if (!this.supabase) return null;

    const {
      type,
      title,
      summary,
      peopleInvolved = [],
      userEmotion = 'neutral',
      userInvolvement = 'observer'
    } = eventDetails;

    // Check if event already exists
    const { data: existing } = await this.supabase
      .from('social_events')
      .select('*')
      .eq('user_id', userId)
      .eq('title', title)
      .single();

    if (existing) {
      // Update event
      await this.supabase
        .from('social_events')
        .update({
          last_mentioned: new Date().toISOString(),
          mention_count: (existing.mention_count || 0) + 1,
          last_update: summary,
          event_status: this.determineEventStatus(summary)
        })
        .eq('id', existing.id);

      return { ...existing, updated: true };
    } else {
      // Create new event
      const { data: newEvent } = await this.supabase
        .from('social_events')
        .insert({
          user_id: userId,
          event_type: type,
          title: title,
          summary: summary,
          people_involved: peopleInvolved,
          user_emotion_about_event: userEmotion,
          user_involvement: userInvolvement,
          followup_priority: this.calculatePriority(userEmotion, userInvolvement),
          needs_followup: true
        })
        .select()
        .single();

      // Track relationship dynamics if romantic
      if (type === 'romantic' && peopleInvolved.length >= 2) {
        await this.trackRelationshipDynamic(
          userId,
          peopleInvolved[0],
          peopleInvolved[1],
          'romantic',
          summary
        );
      }

      return newEvent;
    }
  }

  /**
   * TRACK RELATIONSHIP DYNAMIC (between two people)
   */
  async trackRelationshipDynamic(userId, personA, personB, dynamicType, context) {
    if (!this.supabase) return null;

    // Ensure consistent ordering
    const [person1, person2] = [personA, personB].sort();

    const compatibility = this.assessCompatibility(context);
    const status = this.inferRelationshipStatus(context);

    const { data: existing } = await this.supabase
      .from('relationship_dynamics')
      .select('*')
      .eq('user_id', userId)
      .eq('person_a', person1)
      .eq('person_b', person2)
      .single();

    if (existing) {
      // Update
      const statusChanges = existing.status_changes || [];
      if (status !== existing.relationship_status) {
        statusChanges.push(JSON.stringify({
          from: existing.relationship_status,
          to: status,
          timestamp: new Date().toISOString()
        }));
      }

      await this.supabase
        .from('relationship_dynamics')
        .update({
          last_mentioned: new Date().toISOString(),
          relationship_status: status,
          compatibility: compatibility,
          status_changes: statusChanges
        })
        .eq('id', existing.id);

      return { ...existing, updated: true };
    } else {
      // Create
      const { data: newDynamic } = await this.supabase
        .from('relationship_dynamics')
        .insert({
          user_id: userId,
          person_a: person1,
          person_b: person2,
          dynamic_type: dynamicType,
          compatibility: compatibility,
          relationship_status: status
        })
        .select()
        .single();

      return newDynamic;
    }
  }

  /**
   * CREATE OR UPDATE GOSSIP TOPIC
   */
  async trackGossipTopic(userId, topicDetails) {
    if (!this.supabase) return null;

    const {
      topic,
      category = 'drama',
      mainPerson,
      relatedPeople = [],
      gossipLevel = 5,
      urgency = 5
    } = topicDetails;

    // Check if topic exists
    const { data: existing } = await this.supabase
      .from('gossip_topics')
      .select('*')
      .eq('user_id', userId)
      .eq('topic', topic)
      .single();

    if (existing) {
      await this.supabase
        .from('gossip_topics')
        .update({
          last_mentioned: new Date().toISOString(),
          update_count: (existing.update_count || 0) + 1,
          gossip_level: Math.max(existing.gossip_level || 0, gossipLevel),
          urgency: Math.max(existing.urgency || 0, urgency)
        })
        .eq('id', existing.id);

      return { ...existing, updated: true };
    } else {
      const { data: newTopic } = await this.supabase
        .from('gossip_topics')
        .insert({
          user_id: userId,
          topic: topic,
          category: category,
          main_person: mainPerson,
          related_people: relatedPeople,
          gossip_level: gossipLevel,
          urgency: urgency,
          luna_curiosity: Math.min(gossipLevel + 2, 10)
        })
        .select()
        .single();

      return newTopic;
    }
  }

  /**
   * FORM OPINION about person or situation
   */
  formOpinion(context) {
    // Analyze context
    const sentiment = this.analyzeSentiment(context);
    const redFlags = this.detectRedFlags(context);
    const greenFlags = this.detectGreenFlags(context);

    let opinion = '';
    let overallAssessment = 'neutral';

    if (redFlags.length > 0) {
      // Concerns
      const concerns = redFlags.map(flag => this.articulateConcern(flag));
      opinion = `I'm a bit concerned about ${concerns.join(' and ')}. `;
      overallAssessment = 'cautious';
    }

    if (greenFlags.length > 0) {
      // Positive observations
      const positives = greenFlags.map(flag => this.articulatePositive(flag));
      opinion += `But I also notice ${positives.join(' and ')}. `;
      if (overallAssessment === 'neutral') {
        overallAssessment = 'positive';
      }
    }

    // Overall assessment
    if (sentiment > 0.6) {
      opinion += `I think this could be really good! 💛`;
      overallAssessment = 'positive';
    } else if (sentiment < 0.4) {
      opinion += `I'm not sure this is the best situation...`;
      overallAssessment = 'concerned';
    } else {
      opinion += `It's complicated, but I'm here for you either way 💛`;
    }

    return {
      opinion,
      sentiment,
      redFlags,
      greenFlags,
      overallAssessment
    };
  }

  /**
   * GENERATE GOSSIP FOLLOW-UP
   * "So what happened with Vivian and Mike?"
   */
  async generateGossipFollowup(userId) {
    if (!this.supabase) {
      return this.generateLocalFollowup();
    }

    // Get active gossip topics
    const { data: topics } = await this.supabase
      .from('gossip_topics')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_status', 'active')
      .order('urgency', { ascending: false })
      .limit(5);

    if (!topics || topics.length === 0) {
      // Check social events instead
      return await this.generateEventFollowup(userId);
    }

    // Pick highest urgency topic
    const topic = topics[0];

    // Generate follow-up based on category
    const followups = {
      romance: [
        `So... what happened with ${topic.main_person}? Did they finally make a move?`,
        `Update me on ${topic.main_person}! I've been dying to know!`,
        `You never finished telling me about ${topic.topic}! What's the latest?`
      ],
      career: [
        `How's ${topic.main_person} doing with ${topic.topic}?`,
        `Did ${topic.main_person} hear back about ${topic.topic}?`
      ],
      drama: [
        `What's happening with ${topic.topic}? 👀`,
        `Please tell me there's an update on ${topic.topic}!`
      ],
      celebration: [
        `How did ${topic.topic} go?!`,
        `Tell me about ${topic.topic}! I want all the details!`
      ],
      family: [
        `How's the situation with ${topic.main_person}?`,
        `Any updates on ${topic.topic}?`
      ]
    };

    const categoryFollowups = followups[topic.category] || followups.drama;
    const followup = categoryFollowups[Math.floor(Math.random() * categoryFollowups.length)];

    // Track that we followed up
    await this.supabase
      .from('gossip_topics')
      .update({
        last_mentioned: new Date().toISOString()
      })
      .eq('id', topic.id);

    return {
      followup,
      topic: topic.topic,
      people: [topic.main_person, ...(topic.related_people || [])],
      category: topic.category,
      urgency: topic.urgency
    };
  }

  /**
   * GENERATE EVENT FOLLOW-UP
   */
  async generateEventFollowup(userId) {
    if (!this.supabase) return null;

    const { data: events } = await this.supabase
      .from('social_events')
      .select('*')
      .eq('user_id', userId)
      .eq('needs_followup', true)
      .order('followup_priority', { ascending: false })
      .limit(5);

    if (!events || events.length === 0) return null;

    const event = events[0];

    const followups = [
      `Hey, what happened with ${event.title}?`,
      `Update me on ${event.title}! I've been curious!`,
      `So... ${event.title} - tell me everything!`,
      `Remember ${event.title}? What's the latest?`
    ];

    // Mark as followed up
    await this.supabase
      .from('social_events')
      .update({
        last_followup: new Date().toISOString()
      })
      .eq('id', event.id);

    return {
      followup: followups[Math.floor(Math.random() * followups.length)],
      event: event.title,
      people: event.people_involved || [],
      eventType: event.event_type
    };
  }

  /**
   * Generate local follow-up when database is unavailable
   */
  generateLocalFollowup() {
    const genericFollowups = [
      "So what's new with your friends?",
      "Any interesting updates from your social circle?",
      "Tell me what's happening in your life lately!"
    ];

    return {
      followup: genericFollowups[Math.floor(Math.random() * genericFollowups.length)],
      topic: null,
      people: []
    };
  }

  /**
   * DETECT if message contains gossip
   */
  async detectGossip(userId, message) {
    // Keywords that indicate gossip
    const gossipKeywords = [
      'guess what', "you won't believe", 'did you hear',
      'drama', 'tea', 'spill', 'gossip',
      'guess who', 'apparently', 'rumor', 'between us',
      'don\'t tell anyone', 'secret', 'heard that'
    ];

    const lowerMessage = message.toLowerCase();
    const containsGossipKeyword = gossipKeywords.some(kw => lowerMessage.includes(kw));

    // Check if mentions people in network
    let mentionedPeople = [];
    if (this.supabase) {
      const { data: people } = await this.supabase
        .from('user_social_network')
        .select('person_name')
        .eq('user_id', userId);

      mentionedPeople = people?.filter(p =>
        message.toLowerCase().includes(p.person_name.toLowerCase())
      ).map(p => p.person_name) || [];
    }

    // Extract names from message
    const extractedNames = this.extractNames(message);

    return {
      isGossip: containsGossipKeyword || mentionedPeople.length > 0,
      mentionedPeople,
      extractedNames,
      keywords: gossipKeywords.filter(kw => lowerMessage.includes(kw)),
      gossipLevel: this.assessGossipLevel(message)
    };
  }

  /**
   * GET USER'S SOCIAL NETWORK
   */
  async getSocialNetwork(userId) {
    if (!this.supabase) return { people: [], relationships: [] };

    const { data: people } = await this.supabase
      .from('user_social_network')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('mention_count', { ascending: false });

    const { data: relationships } = await this.supabase
      .from('relationship_dynamics')
      .select('*')
      .eq('user_id', userId);

    return {
      people: people || [],
      relationships: relationships || [],
      summary: this.summarizeSocialNetwork(people || [])
    };
  }

  /**
   * GET PERSON INFO
   */
  async getPersonInfo(userId, personName) {
    if (!this.supabase) return null;

    const { data: person } = await this.supabase
      .from('user_social_network')
      .select('*')
      .eq('user_id', userId)
      .eq('person_name', personName)
      .single();

    if (!person) return null;

    // Get related events
    const { data: events } = await this.supabase
      .from('social_events')
      .select('*')
      .eq('user_id', userId)
      .contains('people_involved', [personName])
      .order('last_mentioned', { ascending: false })
      .limit(5);

    // Get relationship dynamics
    const { data: dynamics } = await this.supabase
      .from('relationship_dynamics')
      .select('*')
      .eq('user_id', userId)
      .or(`person_a.eq.${personName},person_b.eq.${personName}`);

    return {
      person,
      recentEvents: events || [],
      relationships: dynamics || []
    };
  }

  /**
   * UPDATE LUNA'S OPINION of a person
   */
  async updateLunaOpinion(userId, personName, opinion) {
    if (!this.supabase) return;

    await this.supabase
      .from('user_social_network')
      .update({
        luna_opinion_of_person: opinion
      })
      .eq('user_id', userId)
      .eq('person_name', personName);
  }

  /**
   * MARK EVENT AS RESOLVED
   */
  async resolveEvent(userId, eventTitle, resolution) {
    if (!this.supabase) return;

    await this.supabase
      .from('social_events')
      .update({
        event_status: 'resolved',
        last_update: resolution,
        needs_followup: false
      })
      .eq('user_id', userId)
      .eq('title', eventTitle);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Extract names from message
   */
  extractNames(message) {
    // Simple capitalized word detection for names
    const words = message.split(/\s+/);
    const names = [];

    for (const word of words) {
      // Remove punctuation and check if capitalized
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (/^[A-Z][a-z]+$/.test(cleanWord) && cleanWord.length > 2) {
        // Exclude common words that might be capitalized
        const excludeWords = ['The', 'And', 'But', 'For', 'Not', 'You', 'Are', 'Was', 'Were', 'This', 'That', 'What', 'When', 'Where', 'How', 'Why'];
        if (!excludeWords.includes(cleanWord)) {
          names.push(cleanWord);
        }
      }
    }

    return [...new Set(names)];
  }

  /**
   * Infer relationship type from context
   */
  inferRelationshipType(context) {
    const lowerContext = context.toLowerCase();

    // Check romantic first to avoid 'boyfriend'/'girlfriend' matching 'friend' substring
    if (lowerContext.includes('boyfriend') || lowerContext.includes('girlfriend') || lowerContext.includes('partner')) return 'romantic';
    if (lowerContext.includes('husband') || lowerContext.includes('wife') || lowerContext.includes('spouse')) return 'romantic';
    if (lowerContext.includes('ex-') || lowerContext.includes('ex ') || lowerContext.includes('used to date')) return 'ex';
    if (lowerContext.includes('crush') || lowerContext.includes('like them') || lowerContext.includes('into them')) return 'crush';
    // Check friend after romantic keywords to avoid substring issues
    if (lowerContext.includes('friend') || lowerContext.includes('buddy') || lowerContext.includes('pal')) return 'friend';
    if (lowerContext.includes('mom') || lowerContext.includes('dad') || lowerContext.includes('mother') || lowerContext.includes('father')) return 'family';
    if (lowerContext.includes('sister') || lowerContext.includes('brother') || lowerContext.includes('sibling')) return 'family';
    if (lowerContext.includes('aunt') || lowerContext.includes('uncle') || lowerContext.includes('cousin')) return 'family';
    if (lowerContext.includes('coworker') || lowerContext.includes('colleague') || lowerContext.includes('work')) return 'coworker';
    if (lowerContext.includes('boss') || lowerContext.includes('manager') || lowerContext.includes('supervisor')) return 'boss';
    if (lowerContext.includes('neighbor') || lowerContext.includes('next door')) return 'neighbor';
    if (lowerContext.includes('classmate') || lowerContext.includes('school')) return 'classmate';

    return 'friend'; // Default
  }

  /**
   * Analyze sentiment (0-1 scale)
   */
  analyzeSentiment(text) {
    const positiveWords = ['love', 'great', 'amazing', 'wonderful', 'perfect', 'good', 'nice', 'sweet', 'awesome', 'fantastic', 'happy', 'excited'];
    const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'toxic', 'mean', 'annoying', 'frustrating', 'angry', 'upset', 'sad', 'worried'];

    const lowerText = text.toLowerCase();

    const posCount = positiveWords.filter(w => lowerText.includes(w)).length;
    const negCount = negativeWords.filter(w => lowerText.includes(w)).length;

    return Math.max(0, Math.min(1, (posCount - negCount + 5) / 10)); // Normalize to 0-1
  }

  /**
   * Extract personality traits
   */
  extractTraits(context) {
    const traits = ['funny', 'loyal', 'smart', 'kind', 'dramatic', 'sweet', 'confident', 'shy', 'creative', 'honest', 'caring', 'supportive', 'reliable', 'adventurous'];
    const lowerContext = context.toLowerCase();

    return traits.filter(trait => lowerContext.includes(trait));
  }

  /**
   * Extract interests
   */
  extractInterests(context) {
    const interests = ['hiking', 'reading', 'music', 'art', 'sports', 'gaming', 'cooking', 'movies', 'travel', 'photography', 'fitness', 'writing', 'dancing'];
    const lowerContext = context.toLowerCase();

    return interests.filter(interest => lowerContext.includes(interest));
  }

  /**
   * Extract problems/issues
   */
  extractProblems(context) {
    const problemPatterns = [
      /having trouble with ([^.!?]+)/i,
      /struggling with ([^.!?]+)/i,
      /worried about ([^.!?]+)/i,
      /problem with ([^.!?]+)/i,
      /issue with ([^.!?]+)/i
    ];

    const problems = [];
    for (const pattern of problemPatterns) {
      const match = context.match(pattern);
      if (match && match[1]) {
        problems.push(match[1].trim());
      }
    }

    return problems;
  }

  /**
   * Detect red flags
   */
  detectRedFlags(context) {
    const redFlags = [
      { flag: 'controlling', keywords: ['control', "won't let", "doesn't allow", 'possessive'] },
      { flag: 'dishonest', keywords: ['lie', 'lied', 'dishonest', 'cheat', 'cheated'] },
      { flag: 'mean', keywords: ['mean', 'cruel', 'rude', 'hurtful', 'insult'] },
      { flag: 'toxic', keywords: ['toxic', 'manipulate', 'gaslighting', 'abusive'] },
      { flag: 'selfish', keywords: ['selfish', 'only cares about', 'self-centered'] },
      { flag: 'unreliable', keywords: ['unreliable', 'flaky', 'never shows up', 'cancels'] }
    ];

    const lowerContext = context.toLowerCase();
    const detected = [];

    for (const { flag, keywords } of redFlags) {
      if (keywords.some(kw => lowerContext.includes(kw))) {
        detected.push(flag);
      }
    }

    return detected;
  }

  /**
   * Detect green flags
   */
  detectGreenFlags(context) {
    const greenFlags = [
      { flag: 'supportive', keywords: ['support', 'there for', 'helps', 'always there'] },
      { flag: 'kind', keywords: ['kind', 'sweet', 'caring', 'gentle', 'thoughtful'] },
      { flag: 'honest', keywords: ['honest', 'truthful', 'real', 'genuine'] },
      { flag: 'compatible', keywords: ['same interests', 'both love', 'perfect match', 'in common'] },
      { flag: 'respectful', keywords: ['respect', 'listens', 'understands', 'patient'] },
      { flag: 'loyal', keywords: ['loyal', 'faithful', 'devoted', 'committed'] }
    ];

    const lowerContext = context.toLowerCase();
    const detected = [];

    for (const { flag, keywords } of greenFlags) {
      if (keywords.some(kw => lowerContext.includes(kw))) {
        detected.push(flag);
      }
    }

    return detected;
  }

  /**
   * Calculate follow-up priority
   */
  calculatePriority(userEmotion, userInvolvement) {
    let priority = 5; // Default

    if (userEmotion === 'worried' || userEmotion === 'angry' || userEmotion === 'upset') priority += 2;
    if (userEmotion === 'excited' || userEmotion === 'happy') priority += 1;
    if (userInvolvement === 'direct') priority += 2;
    if (userInvolvement === 'indirect') priority += 1;

    return Math.min(priority, 10);
  }

  /**
   * Determine event status from context
   */
  determineEventStatus(summary) {
    const lowerSummary = summary.toLowerCase();

    if (lowerSummary.includes('resolved') || lowerSummary.includes('over') || lowerSummary.includes('done') || lowerSummary.includes('ended')) {
      return 'resolved';
    } else if (lowerSummary.includes('worse') || lowerSummary.includes('escalat') || lowerSummary.includes('blew up')) {
      return 'escalating';
    }

    return 'ongoing';
  }

  /**
   * Assess compatibility between two people
   */
  assessCompatibility(context) {
    const sentiment = this.analyzeSentiment(context);

    if (sentiment > 0.7) return 'good';
    if (sentiment < 0.3) return 'bad';
    return 'complicated';
  }

  /**
   * Infer relationship status
   */
  inferRelationshipStatus(context) {
    const lowerContext = context.toLowerCase();

    if (lowerContext.includes('together') || lowerContext.includes('dating') || lowerContext.includes('official')) return 'together';
    if (lowerContext.includes('broke up') || lowerContext.includes('separated') || lowerContext.includes('split')) return 'separated';
    if (lowerContext.includes('complicated') || lowerContext.includes('unclear') || lowerContext.includes("don't know")) return 'complicated';
    if (lowerContext.includes('talking') || lowerContext.includes('seeing each other')) return 'dating';

    return 'unknown';
  }

  /**
   * Assess gossip level (1-10)
   */
  assessGossipLevel(message) {
    const lowerMessage = message.toLowerCase();
    let level = 5;

    // Increase for juicy content
    if (lowerMessage.includes('cheating') || lowerMessage.includes('affair')) level += 3;
    if (lowerMessage.includes('secret') || lowerMessage.includes("don't tell")) level += 2;
    if (lowerMessage.includes('drama') || lowerMessage.includes('fight')) level += 2;
    if (lowerMessage.includes('pregnant') || lowerMessage.includes('engaged')) level += 2;
    if (lowerMessage.includes('fired') || lowerMessage.includes('quit')) level += 1;

    return Math.min(level, 10);
  }

  /**
   * Articulate concern as natural language
   */
  articulateConcern(redFlag) {
    const concerns = {
      controlling: 'the controlling behavior',
      dishonest: 'the dishonesty',
      mean: 'how mean they can be',
      toxic: 'the toxic patterns',
      selfish: 'the selfish behavior',
      unreliable: 'how unreliable they seem'
    };

    return concerns[redFlag] || redFlag;
  }

  /**
   * Articulate positive as natural language
   */
  articulatePositive(greenFlag) {
    const positives = {
      supportive: 'how supportive they are',
      kind: 'their kindness',
      honest: 'their honesty',
      compatible: 'how well you two match',
      respectful: 'their respect for you',
      loyal: 'their loyalty'
    };

    return positives[greenFlag] || greenFlag;
  }

  /**
   * Summarize social network
   */
  summarizeSocialNetwork(people) {
    const byType = {};
    for (const person of people) {
      const type = person.relationship_type || 'friend';
      if (!byType[type]) byType[type] = [];
      byType[type].push(person.person_name);
    }

    return {
      totalPeople: people.length,
      byType,
      mostMentioned: people.slice(0, 5).map(p => ({
        name: p.person_name,
        mentions: p.mention_count,
        type: p.relationship_type
      }))
    };
  }
}

module.exports = EnhancedGossipModule;
