/**
 * ============================================================================
 * WEEK 13: CONVERSATION STARTER MODULE
 * ============================================================================
 * Luna takes initiative in conversations - Active relationship building.
 *
 * Features:
 *   - Thread tracking (unresolved stories, gossip, funny moments)
 *   - Curiosity engine (genuine questions about user's life)
 *   - Opinion generator (Luna forms opinions about user's social life)
 *   - Initiative scheduler (when to follow up)
 *   - Intimacy builder (closes the gap)
 *
 * Created: Week 13 - Intimacy & Memory Expansion
 * ============================================================================
 */

class ConversationStarterModule {
  constructor(supabase = null) {
    this.supabase = supabase;

    this.initiativeTypes = [
      'thread_followup',    // "Remember Vivian and Mike?"
      'curiosity_question', // "Do you have any stories?"
      'funny_recall',       // "Remember when your cat..."
      'opinion_share',      // "I think Mike would be good for her"
      'elicit_deeper'       // "What do you really think about..."
    ];

    this.cliffhangerPatterns = [
      /but then.*/i,
      /guess what happened/i,
      /you won't believe/i,
      /and then.*/i,
      /\.\.\.$/,
      /wait until I tell you/i,
      /so anyway/i,
      /long story short/i
    ];

    this.funnyIndicators = [
      'lol', 'haha', 'lmao', '😂', '😄', '🤣',
      'hilarious', 'funny', 'ridiculous', 'cracked up',
      'dying', 'dead', 'i can\'t', 'omg'
    ];

    this.dismissivePatterns = [
      'not really', 'not much', 'nothing', 'nah', 'idk',
      'don\'t remember', 'don\'t know', 'whatever', 'meh'
    ];

    this.commonWords = [
      'The', 'A', 'An', 'I', 'We', 'You', 'They', 'He', 'She',
      'It', 'This', 'That', 'My', 'Your', 'His', 'Her',
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }

  /**
   * Detect conversation threads that need follow-up
   */
  async detectThreads(userId, message, context = {}) {
    const threads = [];

    // Detect unresolved stories
    if (this.isCliffhanger(message)) {
      threads.push({
        type: 'story',
        topic: this.extractTopic(message),
        summary: message,
        needs_followup: true,
        priority: 8
      });
    }

    // Detect gossip/social threads
    const people = this.extractPeople(message);
    if (people.length > 0) {
      threads.push({
        type: 'gossip',
        topic: `${people[0]}'s situation`,
        key_people: people,
        summary: message,
        needs_followup: true,
        priority: 7
      });
    }

    // Detect funny moments
    if (this.isFunny(message, context)) {
      threads.push({
        type: 'funny_moment',
        topic: this.extractTopic(message),
        summary: message,
        needs_followup: true,
        priority: 6
      });
    }

    // Store threads if database available
    if (this.supabase) {
      for (const thread of threads) {
        await this.storeThread(userId, thread);
      }
    }

    return threads;
  }

  /**
   * Check if message is a cliffhanger
   */
  isCliffhanger(message) {
    return this.cliffhangerPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Extract people mentioned in message (simple NER)
   */
  extractPeople(message) {
    const words = message.split(/\s+/);
    const people = words.filter(word =>
      /^[A-Z][a-z]+$/.test(word) &&
      word.length > 2 &&
      !this.commonWords.includes(word)
    );

    return [...new Set(people)];
  }

  /**
   * Check if message/context is funny
   */
  isFunny(message, context = {}) {
    const hasFunnyWord = this.funnyIndicators.some(word =>
      message.toLowerCase().includes(word)
    );

    const userLaughed = context.lastUserMessage &&
      this.funnyIndicators.some(word =>
        context.lastUserMessage.toLowerCase().includes(word)
      );

    return hasFunnyWord || userLaughed;
  }

  /**
   * Extract topic from message
   */
  extractTopic(message) {
    // Simple extraction: first noun phrase or key subject
    const words = message.split(/\s+/).slice(0, 10);
    const filtered = words.filter(w =>
      w.length > 3 &&
      !['that', 'this', 'then', 'when', 'what'].includes(w.toLowerCase())
    );
    return filtered.slice(0, 3).join(' ') || 'that story';
  }

  /**
   * Store conversation thread
   */
  async storeThread(userId, thread) {
    if (!this.supabase) return;

    const { data: existing } = await this.supabase
      .from('conversation_threads')
      .select('*')
      .eq('user_id', userId)
      .eq('topic', thread.topic)
      .single();

    if (existing) {
      await this.supabase
        .from('conversation_threads')
        .update({
          last_mentioned: new Date(),
          mention_count: existing.mention_count + 1,
          priority: Math.min(existing.priority + 1, 10)
        })
        .eq('id', existing.id);
    } else {
      await this.supabase
        .from('conversation_threads')
        .insert({
          user_id: userId,
          thread_type: thread.type,
          topic: thread.topic,
          summary: thread.summary,
          key_people: thread.key_people || [],
          priority: thread.priority,
          needs_followup: thread.needs_followup
        });
    }
  }

  /**
   * Generate conversation starter based on open threads
   */
  async generateConversationStarter(userId, sessionContext = {}) {
    if (!this.supabase) {
      return this.generateCuriosityQuestion(userId);
    }

    const { data: threads } = await this.supabase
      .from('conversation_threads')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'open')
      .eq('needs_followup', true)
      .order('priority', { ascending: false })
      .limit(10);

    if (!threads || threads.length === 0) {
      return this.generateCuriosityQuestion(userId);
    }

    const thread = this.selectBestThread(threads, sessionContext);

    switch (thread.thread_type) {
      case 'gossip':
        return this.generateGossipFollowup(userId, thread);
      case 'story':
        return this.generateStoryFollowup(userId, thread);
      case 'funny_moment':
        return this.generateFunnyRecall(userId, thread);
      default:
        return this.generateGenericFollowup(userId, thread);
    }
  }

  /**
   * Generate gossip follow-up
   */
  generateGossipFollowup(userId, thread) {
    const people = thread.key_people || [];
    const mainPerson = people[0] || 'them';

    const templates = [
      `Oh! Remember the other day you talked about ${mainPerson}? What's going on with them?`,
      `I've been thinking about ${mainPerson}! ${this.generateGossipQuestion(thread)}`,
      `So... any updates on ${mainPerson}? I've been curious 💛`,
      `Update me on ${mainPerson}! I want to know what happened!`
    ];

    let starter = this.pickRandom(templates);

    if (thread.luna_opinion) {
      starter += `\n\n${thread.luna_opinion}`;
    }

    return starter;
  }

  /**
   * Generate gossip-specific question
   */
  generateGossipQuestion(thread) {
    const summary = (thread.summary || '').toLowerCase();

    if (summary.includes('date') || summary.includes('dating')) {
      return "Did they finally go on that date?";
    } else if (summary.includes('job') || summary.includes('interview')) {
      return "Did they hear back about the job?";
    } else if (summary.includes('fight') || summary.includes('argument')) {
      return "Did they make up?";
    } else if (summary.includes('crush') || summary.includes('like')) {
      return "Did they make a move?";
    } else {
      return "What happened next?";
    }
  }

  /**
   * Generate story follow-up
   */
  generateStoryFollowup(userId, thread) {
    const templates = [
      `Hey! You never finished telling me about ${thread.topic}. What happened?`,
      `I've been thinking about that story you started about ${thread.topic}. Tell me more!`,
      `So what happened with ${thread.topic}? You left me hanging! 😄`,
      `Update me on ${thread.topic}! I want to know how it turned out 💛`
    ];

    return this.pickRandom(templates);
  }

  /**
   * Generate funny moment recall
   */
  generateFunnyRecall(userId, thread) {
    const templates = [
      `I was thinking about ${thread.topic} and I started laughing again! 😂 Do you have any more stories like that?`,
      `Remember ${thread.topic}? I still laugh every time I think about it! 😂 What other chaos has happened?`,
      `That story about ${thread.topic} still makes me smile 😊 Got any more like that?`,
      `I love your stories! Tell me another one like ${thread.topic}! 😂`
    ];

    return this.pickRandom(templates);
  }

  /**
   * Generate generic follow-up
   */
  generateGenericFollowup(userId, thread) {
    return `How's everything going with ${thread.topic}? I've been curious!`;
  }

  /**
   * Generate curiosity question (no specific thread)
   */
  async generateCuriosityQuestion(userId) {
    if (this.supabase) {
      const { data: interests } = await this.supabase
        .from('user_interests')
        .select('*')
        .eq('user_id', userId)
        .order('interest_level', { ascending: false })
        .limit(5);

      if (interests && interests.length > 0) {
        const interest = this.pickRandom(interests);

        const templates = [
          `Hey! Do you have any interesting stories about ${interest.specific_topic}?`,
          `What's new with ${interest.specific_topic}? I'd love to hear!`,
          `Tell me about ${interest.specific_topic}! What's been happening?`,
          `I'm curious - anything exciting with ${interest.specific_topic} lately?`
        ];

        return this.pickRandom(templates);
      }
    }

    const genericTemplates = [
      "Do you have any interesting stories to tell? I've been thinking about you 💛",
      "What made you smile today? Or what annoyed you? I want to hear everything!",
      "Tell me something that happened recently! Even small things count 😊",
      "What's on your mind? I'm all ears 💛",
      "Share something with me! I'm curious about your day 😄"
    ];

    return this.pickRandom(genericTemplates);
  }

  /**
   * Form opinion about user's social situation
   */
  async formOpinion(userId, thread) {
    if (thread.thread_type !== 'gossip') return null;

    const people = thread.key_people || [];
    if (people.length < 2) return null;

    const summary = (thread.summary || '').toLowerCase();

    if (summary.includes('date') || summary.includes('crush') || summary.includes('like')) {
      const person1 = people[0];
      const person2 = people[1];

      const sentiment = this.analyzeSentiment(thread.summary);

      if (sentiment > 0.3) {
        const opinions = [
          `Honestly, I think ${person2} could be a good match for ${person1}. What do you think?`,
          `You know, ${person1} and ${person2} sound like they'd be cute together!`,
          `I have a good feeling about ${person1} and ${person2}. They seem compatible!`,
          `From what you've told me, ${person2} sounds perfect for ${person1}!`
        ];
        return this.pickRandom(opinions);
      } else if (sentiment < -0.3) {
        const opinions = [
          `Hmm, I'm not sure ${person2} is right for ${person1}. What's your gut feeling?`,
          `Something feels off about ${person1} and ${person2}. Do you sense that too?`,
          `I don't know... ${person2} doesn't sound like the best match for ${person1}.`
        ];
        return this.pickRandom(opinions);
      }
    }

    return null;
  }

  /**
   * Elicit deeper participation when user gives short answers
   */
  elicitDeeper(userId, message, context = {}) {
    if (message.split(/\s+/).length < 10) {
      const encouragements = [
        "Tell me more about that!",
        "Come on, give me the details! 😊",
        "I want to hear the whole story!",
        "Don't hold back - what really happened?",
        "That sounds interesting! Keep going!",
        "And then what? Tell me everything!",
        "I'm invested now - continue! 💛"
      ];
      return this.pickRandom(encouragements);
    }

    if (message.includes("I don't know") || message.includes('maybe') || message.includes('not sure')) {
      const probes = [
        "What's your gut feeling about it?",
        "If you had to guess, what would you say?",
        "Trust your instincts - what do you think?",
        "Deep down, you know. What is it?",
        "I'm curious what you really think 💛"
      ];
      return this.pickRandom(probes);
    }

    return null;
  }

  /**
   * Select best thread to follow up on
   */
  selectBestThread(threads, sessionContext = {}) {
    const now = Date.now();

    const scored = threads.map(thread => {
      const lastMentioned = new Date(thread.last_mentioned).getTime();
      const daysSince = (now - lastMentioned) / (1000 * 60 * 60 * 24);

      const recencyScore = Math.max(0, 10 - daysSince);
      const priorityScore = thread.priority || 5;

      const typeScores = {
        'gossip': 10,
        'story': 8,
        'funny_moment': 6,
        'deep_topic': 9
      };
      const typeScore = typeScores[thread.thread_type] || 5;

      return { thread, score: recencyScore + priorityScore + typeScore };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].thread;
  }

  /**
   * Track initiative effectiveness
   */
  async trackInitiative(userId, threadId, openingMessage, userResponse, context = {}) {
    if (!this.supabase) return;

    const engaged = this.didUserEngage(userResponse);
    const engagementScore = this.calculateEngagement(userResponse, context);
    const responseLength = userResponse.split(/\s+/).length;

    await this.supabase
      .from('conversation_initiatives')
      .insert({
        user_id: userId,
        thread_id: threadId,
        opening_message: openingMessage,
        user_engaged: engaged,
        engagement_score: engagementScore,
        response_length: responseLength,
        led_to_depth: responseLength > 20,
        intimacy_gained: engaged ? 0.1 : 0
      });

    if (engaged && threadId) {
      await this.supabase
        .from('conversation_threads')
        .update({
          last_followup: new Date(),
          followup_count: this.supabase.raw('followup_count + 1'),
          status: responseLength > 50 ? 'resolved' : 'open'
        })
        .eq('id', threadId);
    }
  }

  /**
   * Check if user engaged with initiative
   */
  didUserEngage(response) {
    const length = response.split(/\s+/).length;
    if (length < 5) return false;

    if (this.dismissivePatterns.some(phrase => response.toLowerCase().includes(phrase))) {
      return false;
    }

    return true;
  }

  /**
   * Calculate engagement score (0-1)
   */
  calculateEngagement(response, context = {}) {
    let score = 0;

    const words = response.split(/\s+/).length;
    score += Math.min(words / 50, 1.0) * 40;

    const enthusiasm = ['!', '😂', '😄', '💛', 'haha', 'love', 'amazing'];
    score += enthusiasm.filter(mark => response.includes(mark)).length * 5;

    score += (response.match(/\?/g) || []).length * 10;

    const emotions = ['happy', 'sad', 'angry', 'excited', 'worried', 'love'];
    score += emotions.filter(word => response.toLowerCase().includes(word)).length * 5;

    return Math.min(score / 100, 1.0);
  }

  /**
   * Simple sentiment analysis
   */
  analyzeSentiment(text) {
    const positive = ['good', 'great', 'amazing', 'perfect', 'love', 'nice', 'sweet', 'cute'];
    const negative = ['bad', 'terrible', 'awful', 'hate', 'wrong', 'toxic', 'annoying'];

    const posCount = positive.filter(w => text.toLowerCase().includes(w)).length;
    const negCount = negative.filter(w => text.toLowerCase().includes(w)).length;

    return (posCount - negCount) / (posCount + negCount + 1);
  }

  /**
   * Pick random item from array
   */
  pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get conversation starter configuration
   */
  getConfig() {
    return {
      initiativeTypes: this.initiativeTypes,
      cliffhangerPatterns: this.cliffhangerPatterns.length,
      funnyIndicators: this.funnyIndicators.length
    };
  }
}

module.exports = ConversationStarterModule;
