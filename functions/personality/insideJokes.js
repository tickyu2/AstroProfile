/**
 * ============================================================================
 * INSIDE JOKES ENGINE
 * ============================================================================
 * Detects, stores, and uses personalized humor.
 * Creates shared references that deepen connection over time.
 *
 * Joke Types:
 *   - NICKNAME: Pet names for things ("brown motivation juice" for coffee)
 *   - PHRASE: Creative expressions user coins
 *   - MOMENT: Memorable shared experiences
 *   - REFERENCE: Shared cultural references
 *   - CHARACTER: Recurring people/pets in user's life
 *
 * Created: December 31, 2025
 * Week 10: Joy & Connection - Phase 3 Week 2
 * ============================================================================
 */

class InsideJokesEngine {

  constructor() {
    // Joke categories
    this.categories = {
      NICKNAME: 'nickname',
      PHRASE: 'creative_phrase',
      MOMENT: 'memorable_moment',
      REFERENCE: 'shared_reference',
      CHARACTER: 'recurring_character'
    };

    // Detection patterns
    this.patterns = {
      // Quoted phrases indicate user's own terminology
      quotedPhrase: /["']([^"']{3,50})["']/g,

      // Unusual/creative words that might become jokes
      creativeWords: [
        'bonkers', 'shenanigans', 'catastrophe', 'disaster', 'chaos',
        'apocalypse', 'nightmare', 'ridiculous', 'absurd', 'insane',
        'legendary', 'epic', 'masterpiece', 'situation', 'adventure'
      ],

      // Laugh indicators (user found something funny)
      laughReactions: [
        'haha', 'hahaha', 'lol', 'lmao', 'rofl', '😂', '🤣', '😄', '😆',
        'that\'s funny', 'love it', 'so true', 'exactly', 'omg yes',
        'dying', 'dead', 'i\'m screaming', 'can\'t breathe'
      ],

      // New terminology indicators
      namingPatterns: [
        /i call (?:it|them|this|that) ["']?(\w+)["']?/i,
        /my ["']?(\w+)["']? (?:moment|situation|thing)/i,
        /it's like ["']?([^"']+)["']?/i
      ]
    };

    // Joke usage cooldown (hours)
    this.cooldownHours = 24;
  }

  /**
   * Detect potential inside jokes from conversation
   * @param {string} userId - User ID
   * @param {string} message - User's message
   * @param {Object} context - Conversation context
   * @returns {Array} Detected joke candidates
   */
  async detectPotentialJokes(userId, message, context = {}) {
    const candidates = [];

    // Type 1: Check for quoted phrases (user's own terminology)
    const quotedMatches = [...message.matchAll(this.patterns.quotedPhrase)];
    for (const match of quotedMatches) {
      candidates.push({
        type: this.categories.PHRASE,
        content: match[1],
        trigger: 'user_quoted',
        confidence: 0.8,
        context: { originalMessage: message }
      });
    }

    // Type 2: Check for naming patterns
    for (const pattern of this.patterns.namingPatterns) {
      const match = message.match(pattern);
      if (match) {
        candidates.push({
          type: this.categories.NICKNAME,
          content: match[1],
          trigger: 'naming_pattern',
          confidence: 0.85,
          context: { originalMessage: message }
        });
      }
    }

    // Type 3: Check for laugh reactions to previous Luna message
    const hasLaugh = this.patterns.laughReactions.some(r =>
      message.toLowerCase().includes(r)
    );

    if (hasLaugh && context.previousLunaMessage) {
      candidates.push({
        type: this.categories.MOMENT,
        content: context.previousLunaMessage,
        trigger: 'user_laughed',
        confidence: 0.9,
        context: {
          userReaction: message,
          lunaMessage: context.previousLunaMessage
        }
      });
    }

    // Type 4: Check for creative word usage
    const words = message.toLowerCase().split(/\s+/);
    const creativeUsed = this.patterns.creativeWords.filter(w => words.includes(w));

    if (creativeUsed.length > 0 && this.hasCreativeContext(message)) {
      candidates.push({
        type: this.categories.PHRASE,
        content: message,
        trigger: 'creative_vocabulary',
        confidence: 0.6,
        context: { creativeWords: creativeUsed }
      });
    }

    // Type 5: Check for character mentions (pets, people with fun names)
    const characters = this.extractCharacters(message);
    for (const char of characters) {
      candidates.push({
        type: this.categories.CHARACTER,
        content: char.name,
        trigger: 'character_mention',
        confidence: 0.75,
        context: { characterType: char.type, originalMessage: message }
      });
    }

    // Store high-confidence candidates
    const stored = [];
    for (const candidate of candidates) {
      if (candidate.confidence >= 0.7) {
        const id = await this.storeJokeCandidate(userId, candidate);
        if (id) {
          stored.push({ ...candidate, id });
        }
      }
    }

    return stored;
  }

  /**
   * Check if message has creative/humorous context
   */
  hasCreativeContext(message) {
    // Check for humor indicators
    const humorIndicators = ['is like', 'basically', 'situation', 'level:', 'vibes'];
    return humorIndicators.some(i => message.toLowerCase().includes(i));
  }

  /**
   * Extract character mentions (pets, people with notable names)
   */
  extractCharacters(message) {
    const characters = [];

    // Pet patterns
    const petPatterns = [
      /my (?:cat|dog|pet|bird|fish|hamster|rabbit) (\w+)/i,
      /(\w+)(?:'s| is) (?:such a|being a|my) (?:cat|dog|pet)/i
    ];

    for (const pattern of petPatterns) {
      const match = message.match(pattern);
      if (match) {
        characters.push({
          name: match[1],
          type: 'pet'
        });
      }
    }

    // Fun/unusual name patterns (capitalized words with context)
    const titlePatterns = [
      /(?:Sir|Lord|Lady|Dr\.|Professor|Captain|King|Queen) (\w+)/i,
      /(\w+) the (?:Great|Magnificent|Terrible|Destroyer|Fluffy)/i
    ];

    for (const pattern of titlePatterns) {
      const match = message.match(pattern);
      if (match) {
        characters.push({
          name: match[0], // Full title + name
          type: 'titled_character'
        });
      }
    }

    return characters;
  }

  /**
   * Store joke candidate in database
   */
  async storeJokeCandidate(userId, jokeData) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        INSERT INTO luna_inside_jokes (
          user_id, category, content, original_context,
          confidence, status, first_seen
        ) VALUES ($1, $2, $3, $4, $5, 'candidate', NOW())
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [
        userId,
        jokeData.type,
        jokeData.content,
        JSON.stringify(jokeData.context),
        jokeData.confidence
      ]);

      if (result.rows.length > 0) {
        console.log(`[InsideJokes] Stored candidate: "${jokeData.content}" (${jokeData.type})`);
        return result.rows[0].id;
      }
      return null;
    } catch (error) {
      console.log('[InsideJokes] Could not store candidate:', error.message);
      return `mock_${Date.now()}`;
    }
  }

  /**
   * Confirm a joke (user reacted positively when Luna used it)
   */
  async confirmJoke(userId, jokeId) {
    try {
      const db = require('../config/genesisDatabase');

      await db.query(`
        UPDATE luna_inside_jokes
        SET
          status = 'confirmed',
          use_count = COALESCE(use_count, 0) + 1,
          last_used = NOW(),
          user_reaction = 'positive'
        WHERE user_id = $1 AND id = $2
      `, [userId, jokeId]);

      console.log(`[InsideJokes] Confirmed joke #${jokeId}`);
      return true;
    } catch (error) {
      console.log('[InsideJokes] Could not confirm joke:', error.message);
      return false;
    }
  }

  /**
   * Record joke usage (even if not confirmed yet)
   */
  async recordJokeUsage(userId, jokeId, userReaction = 'unknown') {
    try {
      const db = require('../config/genesisDatabase');

      await db.query(`
        UPDATE luna_inside_jokes
        SET
          use_count = COALESCE(use_count, 0) + 1,
          last_used = NOW(),
          user_reaction = $3
        WHERE user_id = $1 AND id = $2
      `, [userId, jokeId, userReaction]);

      return true;
    } catch (error) {
      console.log('[InsideJokes] Could not record usage:', error.message);
      return false;
    }
  }

  /**
   * Get active (confirmed) inside jokes for user
   */
  async getActiveJokes(userId, category = null) {
    try {
      const db = require('../config/genesisDatabase');

      let query = `
        SELECT * FROM luna_inside_jokes
        WHERE user_id = $1 AND status = 'confirmed'
      `;

      const params = [userId];

      if (category) {
        query += ' AND category = $2';
        params.push(category);
      }

      query += ' ORDER BY use_count DESC, last_used DESC';

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.log('[InsideJokes] Could not get active jokes:', error.message);
      return [];
    }
  }

  /**
   * Get joke candidates (not yet confirmed)
   */
  async getCandidateJokes(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT * FROM luna_inside_jokes
        WHERE user_id = $1 AND status = 'candidate'
        ORDER BY confidence DESC, first_seen DESC
      `, [userId]);

      return result.rows;
    } catch (error) {
      console.log('[InsideJokes] Could not get candidates:', error.message);
      return [];
    }
  }

  /**
   * Suggest when to use an inside joke
   */
  async suggestJokeUsage(userId, currentContext) {
    // Get confirmed jokes
    const jokes = await this.getActiveJokes(userId);

    if (jokes.length === 0) {
      // Try candidates with high confidence
      const candidates = await this.getCandidateJokes(userId);
      const highConfidence = candidates.filter(c => c.confidence >= 0.8);
      if (highConfidence.length > 0) {
        return {
          joke: highConfidence[0],
          isCandidate: true,
          reason: 'testing_new_joke'
        };
      }
      return null;
    }

    // Filter by relevance and cooldown
    const eligible = [];

    for (const joke of jokes) {
      // Check cooldown
      if (joke.last_used) {
        const hoursSince = this.getHoursSince(joke.last_used);
        if (hoursSince < this.cooldownHours) {
          continue; // Skip - used too recently
        }
      }

      // Check context relevance
      const relevanceScore = this.calculateRelevance(joke, currentContext);
      if (relevanceScore > 0.3) {
        eligible.push({
          joke,
          relevance: relevanceScore
        });
      }
    }

    if (eligible.length === 0) return null;

    // Sort by relevance * use_count (proven jokes + relevant context)
    eligible.sort((a, b) => {
      const scoreA = a.relevance * (1 + a.joke.use_count * 0.1);
      const scoreB = b.relevance * (1 + b.joke.use_count * 0.1);
      return scoreB - scoreA;
    });

    return {
      joke: eligible[0].joke,
      relevance: eligible[0].relevance,
      isCandidate: false,
      reason: 'context_match'
    };
  }

  /**
   * Calculate relevance of joke to current context
   */
  calculateRelevance(joke, context) {
    let score = 0;

    const jokeContext = typeof joke.original_context === 'string'
      ? JSON.parse(joke.original_context)
      : joke.original_context || {};

    // Topic overlap
    if (context.topics && jokeContext.topics) {
      const overlap = context.topics.filter(t => jokeContext.topics.includes(t));
      score += overlap.length * 0.2;
    }

    // Keyword match in current message
    if (context.message && joke.content) {
      const jokeWords = joke.content.toLowerCase().split(/\s+/);
      const messageWords = context.message.toLowerCase().split(/\s+/);
      const matches = jokeWords.filter(w => messageWords.includes(w));
      score += matches.length * 0.15;
    }

    // Similar emotion
    if (context.emotion && jokeContext.emotion) {
      if (context.emotion === jokeContext.emotion) {
        score += 0.3;
      }
    }

    // Character mentioned again
    if (joke.category === this.categories.CHARACTER) {
      if (context.message && context.message.toLowerCase().includes(joke.content.toLowerCase())) {
        score += 0.5;
      }
    }

    return Math.min(1.0, score);
  }

  /**
   * Generate a joke callback phrase
   */
  generateJokeCallback(joke) {
    const callbacks = {
      [this.categories.NICKNAME]: [
        `Need your ${joke.content} today?`,
        `How's the ${joke.content} situation?`,
        `${joke.content} time?`
      ],
      [this.categories.PHRASE]: [
        `*${joke.content}* 😄`,
        `As you would say: "${joke.content}"`,
        `Speaking of ${joke.content}...`
      ],
      [this.categories.CHARACTER]: [
        `How's ${joke.content} doing?`,
        `Has ${joke.content} caused any chaos today?`,
        `${joke.content} update?`
      ],
      [this.categories.MOMENT]: [
        `Remember when ${joke.content}? 😄`,
        `This reminds me of our "${joke.content}" moment`
      ]
    };

    const options = callbacks[joke.category] || [`Remember "${joke.content}"?`];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Get hours since timestamp
   */
  getHoursSince(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    return (now - then) / (1000 * 60 * 60);
  }

  /**
   * Get joke statistics for user
   */
  async getJokeStats(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT
          status,
          category,
          COUNT(*) as count,
          AVG(use_count) as avg_uses
        FROM luna_inside_jokes
        WHERE user_id = $1
        GROUP BY status, category
      `, [userId]);

      return result.rows;
    } catch (error) {
      console.log('[InsideJokes] Could not get stats:', error.message);
      return [];
    }
  }
}

module.exports = InsideJokesEngine;
