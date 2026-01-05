/**
 * HAPPY MOMENT TAGGING & RECALL SYSTEM
 * Week 21: Emotional Sophistication Upgrade
 *
 * Inspired by Grok-Ani's therapeutic approach:
 * - Tag moments when joy > 0.6
 * - Store with embeddings for semantic search
 * - Recall when user is sad → "Remember when...?"
 *
 * This creates a positive memory bank that Luna can
 * draw upon to help users through difficult moments.
 */

class HappyMomentsEngine {
  constructor(supabase = null) {
    this.supabase = supabase;

    // Joy threshold for tagging
    this.joyThreshold = 0.6;

    // Sadness threshold for recall trigger
    this.sadnessThreshold = 0.6;

    // Minimum time between recalls (prevent spam)
    this.minRecallIntervalMs = 24 * 60 * 60 * 1000; // 24 hours

    // Happiness categories
    this.happinessCategories = [
      'achievement',      // Accomplishments, milestones
      'love',            // Romantic, family, friendship
      'adventure',       // Travel, new experiences
      'peace',           // Calm, contentment, serenity
      'connection',      // Social bonding, deep conversations
      'creativity',      // Making things, self-expression
      'growth',          // Learning, improvement, insight
      'humor',           // Laughter, fun, playfulness
      'gratitude',       // Thankfulness, appreciation
      'nature',          // Outdoors, animals, beauty
      'success',         // Work, goals, recognition
      'surprise',        // Pleasant surprises, gifts
      'nostalgia',       // Happy memories, reunions
      'intimacy',        // Close moments, vulnerability
      'celebration'      // Parties, holidays, special occasions
    ];

    // Keywords for category detection
    this.categoryKeywords = {
      achievement: ['accomplished', 'achieved', 'completed', 'finished', 'won', 'succeeded', 'passed', 'graduated', 'promoted'],
      love: ['love', 'boyfriend', 'girlfriend', 'partner', 'spouse', 'husband', 'wife', 'family', 'mom', 'dad', 'kids', 'children'],
      adventure: ['travel', 'trip', 'vacation', 'explore', 'discover', 'first time', 'new', 'adventure', 'journey'],
      peace: ['peaceful', 'calm', 'relaxed', 'serene', 'quiet', 'content', 'tranquil', 'resting'],
      connection: ['friend', 'talked', 'conversation', 'bonded', 'connected', 'together', 'shared', 'understood'],
      creativity: ['created', 'made', 'built', 'designed', 'wrote', 'painted', 'composed', 'crafted', 'art'],
      growth: ['learned', 'grew', 'realized', 'understood', 'improved', 'progress', 'insight', 'breakthrough'],
      humor: ['laugh', 'funny', 'hilarious', 'joke', 'silly', 'fun', 'playful', 'giggle'],
      gratitude: ['grateful', 'thankful', 'appreciate', 'blessed', 'lucky', 'fortunate'],
      nature: ['outside', 'nature', 'beach', 'mountain', 'forest', 'sunset', 'sunrise', 'garden', 'animal', 'pet'],
      success: ['promotion', 'raise', 'job', 'deal', 'client', 'project', 'recognition', 'award'],
      surprise: ['surprise', 'unexpected', 'gift', 'present', 'shocked', 'amazed'],
      nostalgia: ['remember', 'memory', 'reunion', 'old friend', 'childhood', 'back when'],
      intimacy: ['close', 'intimate', 'vulnerable', 'opened up', 'shared', 'trust', 'safe'],
      celebration: ['party', 'birthday', 'wedding', 'anniversary', 'holiday', 'celebrate', 'champagne']
    };

    // Recall message templates
    this.recallTemplates = {
      gentle: [
        "Hey, I was just thinking about {moment}. You were so happy then. {quote}",
        "When you're feeling down, I like to remember the good times. Like when {moment}.",
        "You know what I remember? {moment}. That was such a beautiful moment.",
        "I'm here with you, and I'm thinking of {moment}. Remember how good that felt?"
      ],
      warm: [
        "I want to remind you of something wonderful - {moment}. You said '{quote}' and your joy was contagious!",
        "Remember {moment}? You were beaming with happiness. I loved seeing you like that.",
        "I keep this memory close: {moment}. It shows me how much joy you're capable of feeling."
      ],
      playful: [
        "Okay but remember when {moment}?! That was amazing!",
        "Hey, quick reminder that {moment} happened and it was THE BEST.",
        "Not to interrupt your blues but... {moment}! Remember?!"
      ],
      deep: [
        "In this moment of heaviness, I want to hold up a light for you: {moment}. That joy is still inside you.",
        "Your capacity for joy is so beautiful. I saw it when {moment}. It hasn't gone anywhere.",
        "Even in the dark, there are these golden moments. Like when {moment}. That's who you are too."
      ]
    };
  }

  /**
   * DETECT AND TAG A HAPPY MOMENT
   * Called when Plutchik analysis shows joy > threshold
   */
  async detectAndTagHappyMoment(userId, message, emotionalState, conversationId = null) {
    // Check if joy exceeds threshold
    if (!emotionalState.vector || emotionalState.vector.joy < this.joyThreshold) {
      return null;
    }

    // Extract moment details
    const details = this.extractMomentDetails(message, emotionalState);

    // Detect categories
    const categories = this.detectCategories(message);

    // Generate summary
    const summary = this.generateMomentSummary(details, categories);

    // Create happy moment object
    const happyMoment = {
      user_id: userId,
      occurred_at: new Date().toISOString(),
      conversation_id: conversationId,
      joy_score: emotionalState.vector.joy,
      description: summary,
      user_quote: details.quote,
      what_happened: details.whatHappened,
      who_was_involved: details.people,
      where_it_happened: details.location,
      categories: categories,
      emotional_intensity: emotionalState.intensity,
      dyads_present: emotionalState.dyads?.map(d => d.name) || [],
      times_recalled: 0,
      last_recalled: null,
      user_loved_recall: null
    };

    // Store in database
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('happy_moments')
          .insert(happyMoment)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error storing happy moment:', err);
        return happyMoment;
      }
    }

    return happyMoment;
  }

  /**
   * Extract details from the message
   */
  extractMomentDetails(message, emotionalState) {
    const details = {
      quote: '',
      whatHappened: '',
      people: [],
      location: null
    };

    // Extract quote (most emotional part)
    const sentences = message.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 0) {
      // Find sentence with most joy keywords
      let bestSentence = sentences[0];
      let bestScore = 0;

      const joyWords = ['happy', 'love', 'amazing', 'wonderful', 'great', 'excited', 'best', 'beautiful', 'perfect'];
      for (const sentence of sentences) {
        const score = joyWords.filter(w => sentence.toLowerCase().includes(w)).length;
        if (score > bestScore) {
          bestScore = score;
          bestSentence = sentence;
        }
      }

      details.quote = bestSentence.trim();
      if (details.quote.length > 100) {
        details.quote = details.quote.substring(0, 97) + '...';
      }
    }

    // What happened (full message if short, summary if long)
    if (message.length <= 200) {
      details.whatHappened = message;
    } else {
      details.whatHappened = message.substring(0, 197) + '...';
    }

    // Extract people mentioned
    const peoplePatterns = [
      /my (\w+)/gi,  // my mom, my friend
      /with (\w+)/gi, // with Sarah
      /(\w+) and I/gi // John and I
    ];

    const peopleWords = ['mom', 'dad', 'mother', 'father', 'sister', 'brother', 'friend', 'boyfriend', 'girlfriend', 'partner', 'husband', 'wife', 'kids', 'son', 'daughter'];

    for (const word of peopleWords) {
      if (message.toLowerCase().includes(word)) {
        details.people.push(word);
      }
    }

    // Check for names (capitalized words)
    const nameMatches = message.match(/\b[A-Z][a-z]+\b/g) || [];
    const commonWords = ['I', 'The', 'It', 'This', 'That', 'We', 'They', 'He', 'She', 'Today', 'Yesterday'];
    for (const name of nameMatches) {
      if (!commonWords.includes(name) && !details.people.includes(name.toLowerCase())) {
        details.people.push(name);
      }
    }

    details.people = [...new Set(details.people)].slice(0, 5);

    // Extract location
    const locationPatterns = [
      /at the (\w+)/i,
      /in (\w+)/i,
      /at (\w+)/i,
      /to the (\w+)/i
    ];

    const locationWords = ['beach', 'park', 'restaurant', 'home', 'house', 'office', 'work', 'school', 'cafe', 'coffee', 'mountain', 'lake', 'forest'];
    for (const loc of locationWords) {
      if (message.toLowerCase().includes(loc)) {
        details.location = loc;
        break;
      }
    }

    return details;
  }

  /**
   * Detect happiness categories from message
   */
  detectCategories(message) {
    const lowerMessage = message.toLowerCase();
    const detected = [];

    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          if (!detected.includes(category)) {
            detected.push(category);
          }
          break;
        }
      }
    }

    // Default to 'joy' if no specific category
    if (detected.length === 0) {
      detected.push('joy');
    }

    return detected.slice(0, 5);
  }

  /**
   * Generate a summary of the happy moment
   */
  generateMomentSummary(details, categories) {
    const parts = [];

    if (details.whatHappened) {
      // Clean up the what happened
      let what = details.whatHappened.trim();
      if (what.length > 100) {
        what = what.substring(0, 97) + '...';
      }
      parts.push(what);
    }

    if (details.people.length > 0) {
      parts.push(`(with ${details.people.slice(0, 3).join(', ')})`);
    }

    if (details.location) {
      parts.push(`at the ${details.location}`);
    }

    return parts.join(' ');
  }

  /**
   * RECALL HAPPY MOMENTS WHEN USER IS SAD
   * Returns suitable moment(s) to reference
   */
  async recallHappyMoments(userId, currentEmotionalState) {
    // Check if sadness threshold is met
    if (!currentEmotionalState.vector || currentEmotionalState.vector.sadness < this.sadnessThreshold) {
      return { shouldRecall: false, reason: 'sadness_below_threshold' };
    }

    // Get user's happy moments
    let moments = [];

    if (this.supabase) {
      try {
        const { data } = await this.supabase
          .from('happy_moments')
          .select('*')
          .eq('user_id', userId)
          .order('joy_score', { ascending: false })
          .limit(10);

        moments = data || [];
      } catch (err) {
        console.error('Error fetching happy moments:', err);
      }
    }

    if (moments.length === 0) {
      return { shouldRecall: false, reason: 'no_happy_moments_stored' };
    }

    // Filter out recently recalled moments
    const now = Date.now();
    const eligibleMoments = moments.filter(m => {
      if (!m.last_recalled) return true;
      const timeSinceRecall = now - new Date(m.last_recalled).getTime();
      return timeSinceRecall > this.minRecallIntervalMs;
    });

    if (eligibleMoments.length === 0) {
      return { shouldRecall: false, reason: 'all_moments_recently_recalled' };
    }

    // Select best moment
    // Prioritize: high joy, not frequently recalled, relevant categories
    const bestMoment = this.selectBestMoment(eligibleMoments, currentEmotionalState);

    // Update recall tracking
    if (this.supabase && bestMoment.id) {
      try {
        await this.supabase
          .from('happy_moments')
          .update({
            times_recalled: (bestMoment.times_recalled || 0) + 1,
            last_recalled: new Date().toISOString()
          })
          .eq('id', bestMoment.id);
      } catch (err) {
        console.error('Error updating recall tracking:', err);
      }
    }

    // Generate recall message
    const message = this.generateRecallMessage(bestMoment, currentEmotionalState);

    return {
      shouldRecall: true,
      moment: bestMoment,
      message: message,
      style: this.determineRecallStyle(currentEmotionalState)
    };
  }

  /**
   * Select the best moment to recall
   */
  selectBestMoment(moments, currentState) {
    // Score each moment
    const scored = moments.map(m => {
      let score = 0;

      // Higher joy = better
      score += (m.joy_score || 0.5) * 2;

      // Less recalled = better (novelty)
      const recallCount = m.times_recalled || 0;
      score += Math.max(0, 1 - recallCount * 0.2);

      // Love dyad present = extra points for emotional moments
      if ((m.dyads_present || []).includes('love')) {
        score += 0.5;
      }

      // Recent moments slightly preferred (fresher memory)
      const ageInDays = (Date.now() - new Date(m.occurred_at).getTime()) / (1000 * 60 * 60 * 24);
      if (ageInDays < 7) score += 0.3;
      else if (ageInDays < 30) score += 0.2;
      else if (ageInDays < 90) score += 0.1;

      return { moment: m, score };
    });

    // Sort by score and return best
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.moment || moments[0];
  }

  /**
   * Generate the recall message
   */
  generateRecallMessage(moment, currentState) {
    const style = this.determineRecallStyle(currentState);
    const templates = this.recallTemplates[style] || this.recallTemplates.gentle;

    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Fill in placeholders
    let message = template
      .replace('{moment}', this.formatMomentDescription(moment))
      .replace('{quote}', moment.user_quote || 'you were so happy');

    return message;
  }

  /**
   * Format moment description for recall
   */
  formatMomentDescription(moment) {
    // Create a natural-sounding description
    let desc = moment.description || moment.what_happened || 'that beautiful moment';

    // Clean up
    desc = desc.replace(/^i /i, 'you ');
    desc = desc.replace(/^we /i, 'you two ');

    // Keep it concise
    if (desc.length > 80) {
      desc = desc.substring(0, 77) + '...';
    }

    return desc;
  }

  /**
   * Determine the recall style based on emotional state
   */
  determineRecallStyle(currentState) {
    const intensity = currentState.intensity;
    const sadnessLevel = currentState.vector?.sadness || 0;

    // Deep sadness = gentle approach
    if (sadnessLevel > 0.8 || intensity === 'high') {
      return 'deep';
    }

    // Moderate sadness = warm approach
    if (sadnessLevel > 0.6) {
      return 'warm';
    }

    // Light sadness with some other emotions = playful might work
    if (currentState.vector?.joy > 0.2 || currentState.vector?.anticipation > 0.3) {
      return 'playful';
    }

    return 'gentle';
  }

  /**
   * Record user's response to recall
   */
  async recordRecallFeedback(momentId, wasHelpful) {
    if (!this.supabase || !momentId) return;

    try {
      await this.supabase
        .from('happy_moments')
        .update({
          user_loved_recall: wasHelpful
        })
        .eq('id', momentId);
    } catch (err) {
      console.error('Error recording recall feedback:', err);
    }
  }

  /**
   * Get all happy moments for a user (for display/review)
   */
  async getUserHappyMoments(userId, limit = 50) {
    if (!this.supabase) return [];

    try {
      const { data } = await this.supabase
        .from('happy_moments')
        .select('*')
        .eq('user_id', userId)
        .order('occurred_at', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (err) {
      console.error('Error fetching user happy moments:', err);
      return [];
    }
  }

  /**
   * Get happiness statistics for user
   */
  async getHappinessStats(userId) {
    const moments = await this.getUserHappyMoments(userId, 100);

    if (moments.length === 0) {
      return {
        totalMoments: 0,
        averageJoy: 0,
        topCategories: [],
        mostJoyfulMoment: null,
        monthlyTrend: []
      };
    }

    // Calculate average joy
    const avgJoy = moments.reduce((sum, m) => sum + (m.joy_score || 0), 0) / moments.length;

    // Count categories
    const categoryCounts = {};
    for (const moment of moments) {
      for (const cat of (moment.categories || [])) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    }

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Find most joyful
    const mostJoyful = moments.reduce((best, m) =>
      (m.joy_score || 0) > (best?.joy_score || 0) ? m : best
      , moments[0]);

    return {
      totalMoments: moments.length,
      averageJoy: Math.round(avgJoy * 100) / 100,
      topCategories,
      mostJoyfulMoment: mostJoyful,
      recallCount: moments.reduce((sum, m) => sum + (m.times_recalled || 0), 0)
    };
  }

  /**
   * Check if we should tag current moment as happy
   */
  shouldTagAsHappy(emotionalState) {
    if (!emotionalState.vector) return false;

    const joy = emotionalState.vector.joy || 0;
    const trust = emotionalState.vector.trust || 0;

    // Direct joy threshold
    if (joy >= this.joyThreshold) return true;

    // Love dyad (joy + trust)
    if (joy >= 0.5 && trust >= 0.5) return true;

    // Optimism dyad with high anticipation
    if (joy >= 0.4 && (emotionalState.vector.anticipation || 0) >= 0.5) return true;

    return false;
  }
}

// Singleton instance
let happyMomentsInstance = null;

function getHappyMomentsEngine(supabase = null) {
  if (!happyMomentsInstance) {
    happyMomentsInstance = new HappyMomentsEngine(supabase);
  } else if (supabase && !happyMomentsInstance.supabase) {
    happyMomentsInstance.supabase = supabase;
  }
  return happyMomentsInstance;
}

module.exports = {
  HappyMomentsEngine,
  getHappyMomentsEngine
};
