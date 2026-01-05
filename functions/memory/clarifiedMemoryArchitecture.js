/**
 * Clarified Memory Architecture - Week 21 Emotional Sophistication
 *
 * Three-tier memory system:
 * 1. STM (Short-Term Memory) - Last 24 hours, immediate context
 * 2. LTM (Long-Term Memory) - Vector RAG with semantic search
 * 3. Episodic Memory - Conversation summaries and significant events
 *
 * Based on Grok-Ani research + Cathedral architecture
 */

const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');

class ClarifiedMemoryArchitecture {
  constructor() {
    this.db = getFirestore();

    // Memory configuration
    this.config = {
      stm: {
        duration: 24 * 60 * 60 * 1000, // 24 hours in ms
        maxItems: 100,
        decayRate: 0.05 // per hour
      },
      ltm: {
        embeddingDimensions: 768,
        similarityThreshold: 0.7,
        maxRetrieved: 10,
        consolidationThreshold: 0.8 // When to promote STM to LTM
      },
      episodic: {
        summaryLength: 200,
        eventImportanceThreshold: 0.6,
        maxEventsPerDay: 5
      }
    };

    // Memory types
    this.memoryTypes = {
      FACT: 'fact',           // User facts (preferences, info)
      EMOTION: 'emotion',      // Emotional states and triggers
      EVENT: 'event',          // Significant events
      RELATIONSHIP: 'relationship', // Social info about others
      PREFERENCE: 'preference', // User preferences
      STORY: 'story',          // User's shared stories
      INSIGHT: 'insight',      // Luna's observations
      PROMISE: 'promise',      // Commitments made
      HAPPY_MOMENT: 'happy_moment' // Tagged joy moments
    };

    // Cathedral light mapping for memory types
    this.memoryLights = {
      fact: { color: 'sapphire', brightness: 0.6 },
      emotion: { color: 'rose', brightness: 0.8 },
      event: { color: 'gold', brightness: 0.7 },
      relationship: { color: 'amber', brightness: 0.65 },
      preference: { color: 'emerald', brightness: 0.5 },
      story: { color: 'violet', brightness: 0.75 },
      insight: { color: 'silver', brightness: 0.6 },
      promise: { color: 'ruby', brightness: 0.85 },
      happy_moment: { color: 'sunlight', brightness: 0.9 }
    };
  }

  // =====================================================
  // SHORT-TERM MEMORY (STM) - Last 24 Hours
  // =====================================================

  /**
   * Add item to short-term memory
   */
  async addToSTM(userId, memory) {
    const memoryItem = {
      id: `stm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: memory.content,
      type: memory.type || this.memoryTypes.FACT,
      emotionalContext: memory.emotionalContext || null,
      importance: memory.importance || 0.5,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: Timestamp.fromDate(
        new Date(Date.now() + this.config.stm.duration)
      ),
      accessCount: 0,
      lastAccessed: FieldValue.serverTimestamp(),
      conversationId: memory.conversationId || null,
      metadata: memory.metadata || {}
    };

    await this.db
      .collection('user_memory')
      .doc(userId)
      .collection('stm')
      .doc(memoryItem.id)
      .set(memoryItem);

    // Check if should consolidate to LTM
    if (memory.importance >= this.config.ltm.consolidationThreshold) {
      await this.promoteToLTM(userId, memoryItem);
    }

    return memoryItem;
  }

  /**
   * Get relevant STM items for current context
   */
  async getSTMContext(userId, currentContext = {}) {
    const now = new Date();
    const stmRef = this.db
      .collection('user_memory')
      .doc(userId)
      .collection('stm');

    // Get all non-expired STM items
    const snapshot = await stmRef
      .where('expiresAt', '>', Timestamp.fromDate(now))
      .orderBy('expiresAt')
      .orderBy('createdAt', 'desc')
      .limit(this.config.stm.maxItems)
      .get();

    let memories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate()
    }));

    // Apply decay based on time
    memories = memories.map(mem => ({
      ...mem,
      decayedImportance: this.calculateDecay(mem)
    }));

    // Filter by relevance to current context if provided
    if (currentContext.topic || currentContext.emotion) {
      memories = this.filterByRelevance(memories, currentContext);
    }

    // Sort by decayed importance
    memories.sort((a, b) => b.decayedImportance - a.decayedImportance);

    return memories.slice(0, 20); // Return top 20 most relevant
  }

  /**
   * Calculate memory decay based on time
   */
  calculateDecay(memory) {
    const now = new Date();
    const created = memory.createdAt || now;
    const hoursSinceCreation = (now - created) / (1000 * 60 * 60);

    const decay = Math.exp(-this.config.stm.decayRate * hoursSinceCreation);
    return memory.importance * decay;
  }

  /**
   * Clean expired STM items
   */
  async cleanExpiredSTM(userId) {
    const now = Timestamp.fromDate(new Date());
    const stmRef = this.db
      .collection('user_memory')
      .doc(userId)
      .collection('stm');

    const expired = await stmRef
      .where('expiresAt', '<=', now)
      .get();

    const batch = this.db.batch();
    expired.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return { deleted: expired.size };
  }

  // =====================================================
  // LONG-TERM MEMORY (LTM) - Vector RAG
  // =====================================================

  /**
   * Add item to long-term memory with embedding
   */
  async addToLTM(userId, memory, embedding = null) {
    const memoryItem = {
      id: `ltm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: memory.content,
      type: memory.type || this.memoryTypes.FACT,
      emotionalContext: memory.emotionalContext || null,
      importance: memory.importance || 0.5,
      createdAt: FieldValue.serverTimestamp(),
      accessCount: 0,
      lastAccessed: FieldValue.serverTimestamp(),
      embedding: embedding, // Vector for semantic search
      tags: memory.tags || [],
      source: memory.source || 'conversation',
      metadata: memory.metadata || {},
      light: this.memoryLights[memory.type] || this.memoryLights.fact
    };

    await this.db
      .collection('user_memory')
      .doc(userId)
      .collection('ltm')
      .doc(memoryItem.id)
      .set(memoryItem);

    return memoryItem;
  }

  /**
   * Semantic search in LTM using vector similarity
   */
  async searchLTM(userId, queryEmbedding, options = {}) {
    const {
      limit = this.config.ltm.maxRetrieved,
      type = null,
      minImportance = 0,
      includeEmotional = true
    } = options;

    const ltmRef = this.db
      .collection('user_memory')
      .doc(userId)
      .collection('ltm');

    // Build query
    let query = ltmRef.where('importance', '>=', minImportance);

    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();

    // Calculate similarities
    const memories = snapshot.docs.map(doc => {
      const data = doc.data();
      const similarity = data.embedding
        ? this.cosineSimilarity(queryEmbedding, data.embedding)
        : 0;

      return {
        id: doc.id,
        ...data,
        similarity,
        createdAt: data.createdAt?.toDate(),
        lastAccessed: data.lastAccessed?.toDate()
      };
    });

    // Filter by similarity threshold and sort
    const relevant = memories
      .filter(m => m.similarity >= this.config.ltm.similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    // Update access counts for retrieved memories
    await this.updateAccessCounts(userId, relevant.map(m => m.id));

    return relevant;
  }

  /**
   * Keyword-based search in LTM (fallback)
   */
  async searchLTMByKeywords(userId, keywords, options = {}) {
    const ltmRef = this.db
      .collection('user_memory')
      .doc(userId)
      .collection('ltm');

    const snapshot = await ltmRef.get();

    const memories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    // Simple keyword matching
    const matched = memories.filter(mem => {
      const content = mem.content.toLowerCase();
      const tags = (mem.tags || []).join(' ').toLowerCase();
      const combined = `${content} ${tags}`;

      return keywords.some(kw => combined.includes(kw.toLowerCase()));
    });

    // Sort by importance and recency
    matched.sort((a, b) => {
      const importanceScore = (b.importance - a.importance) * 2;
      const recencyScore = ((b.createdAt || 0) - (a.createdAt || 0)) / (1000 * 60 * 60 * 24);
      return importanceScore + recencyScore * 0.1;
    });

    return matched.slice(0, options.limit || 10);
  }

  /**
   * Promote STM item to LTM
   */
  async promoteToLTM(userId, stmItem) {
    // Create LTM version
    await this.addToLTM(userId, {
      content: stmItem.content,
      type: stmItem.type,
      emotionalContext: stmItem.emotionalContext,
      importance: stmItem.importance,
      tags: stmItem.metadata?.tags || [],
      source: 'stm_promotion',
      metadata: {
        ...stmItem.metadata,
        originalSTMId: stmItem.id,
        promotedAt: new Date().toISOString()
      }
    });

    return { promoted: true, originalId: stmItem.id };
  }

  // =====================================================
  // EPISODIC MEMORY - Conversation Summaries & Events
  // =====================================================

  /**
   * Create episodic memory (conversation summary)
   */
  async createEpisode(userId, episode) {
    const episodeItem = {
      id: `ep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: episode.type || 'conversation_summary',
      summary: episode.summary,
      keyMoments: episode.keyMoments || [],
      emotionalArc: episode.emotionalArc || null,
      topics: episode.topics || [],
      people: episode.people || [],
      startTime: episode.startTime || FieldValue.serverTimestamp(),
      endTime: episode.endTime || FieldValue.serverTimestamp(),
      duration: episode.duration || null,
      significance: episode.significance || 0.5,
      insights: episode.insights || [],
      conversationId: episode.conversationId,
      messageCount: episode.messageCount || 0,
      metadata: episode.metadata || {}
    };

    await this.db
      .collection('user_memory')
      .doc(userId)
      .collection('episodic')
      .doc(episodeItem.id)
      .set(episodeItem);

    // Also store significant events as separate LTM items
    for (const moment of episode.keyMoments || []) {
      if (moment.importance >= this.config.episodic.eventImportanceThreshold) {
        await this.addToLTM(userId, {
          content: moment.description,
          type: this.memoryTypes.EVENT,
          emotionalContext: moment.emotion,
          importance: moment.importance,
          tags: moment.tags || [],
          source: 'episodic_moment',
          metadata: {
            episodeId: episodeItem.id,
            timestamp: moment.timestamp
          }
        });
      }
    }

    return episodeItem;
  }

  /**
   * Get recent episodes
   */
  async getRecentEpisodes(userId, days = 7) {
    const cutoff = Timestamp.fromDate(
      new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    );

    const snapshot = await this.db
      .collection('user_memory')
      .doc(userId)
      .collection('episodic')
      .where('startTime', '>=', cutoff)
      .orderBy('startTime', 'desc')
      .limit(20)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate()
    }));
  }

  /**
   * Search episodes by topic or emotion
   */
  async searchEpisodes(userId, query) {
    const snapshot = await this.db
      .collection('user_memory')
      .doc(userId)
      .collection('episodic')
      .orderBy('startTime', 'desc')
      .limit(100)
      .get();

    const episodes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate()
    }));

    // Filter by query
    const queryLower = query.toLowerCase();
    const matched = episodes.filter(ep => {
      const searchable = [
        ep.summary,
        ...(ep.topics || []),
        ...(ep.people || []),
        ep.emotionalArc
      ].filter(Boolean).join(' ').toLowerCase();

      return searchable.includes(queryLower);
    });

    return matched;
  }

  /**
   * Generate conversation summary for episodic storage
   */
  generateConversationSummary(messages, emotionalStates) {
    // Extract key information
    const topics = this.extractTopics(messages);
    const people = this.extractPeopleMentioned(messages);
    const emotionalArc = this.analyzeEmotionalArc(emotionalStates);
    const keyMoments = this.identifyKeyMoments(messages, emotionalStates);

    // Generate summary
    const summary = this.createSummaryText(messages, topics, emotionalArc);

    return {
      summary,
      topics,
      people,
      emotionalArc,
      keyMoments,
      messageCount: messages.length
    };
  }

  /**
   * Extract topics from messages
   */
  extractTopics(messages) {
    const topics = new Set();

    // Simple topic extraction (would use NLP in production)
    const topicKeywords = {
      work: ['job', 'work', 'boss', 'meeting', 'project', 'deadline', 'colleague'],
      relationships: ['friend', 'family', 'partner', 'dating', 'love', 'relationship'],
      health: ['health', 'exercise', 'sick', 'doctor', 'tired', 'sleep'],
      hobbies: ['hobby', 'game', 'music', 'movie', 'book', 'art', 'sport'],
      emotions: ['feel', 'happy', 'sad', 'angry', 'anxious', 'excited', 'worried'],
      life_events: ['birthday', 'wedding', 'vacation', 'moving', 'graduation'],
      goals: ['goal', 'dream', 'want', 'hope', 'plan', 'future']
    };

    const allText = messages.map(m => m.content || m.text || '').join(' ').toLowerCase();

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(kw => allText.includes(kw))) {
        topics.add(topic);
      }
    }

    return Array.from(topics);
  }

  /**
   * Extract people mentioned
   */
  extractPeopleMentioned(messages) {
    const people = new Set();

    // Simple extraction - look for relationship terms
    const relationshipTerms = [
      'mom', 'dad', 'mother', 'father', 'sister', 'brother',
      'boyfriend', 'girlfriend', 'husband', 'wife', 'partner',
      'friend', 'boss', 'coworker', 'colleague'
    ];

    const allText = messages.map(m => m.content || m.text || '').join(' ').toLowerCase();

    for (const term of relationshipTerms) {
      if (allText.includes(term)) {
        people.add(term);
      }
    }

    return Array.from(people);
  }

  /**
   * Analyze emotional arc of conversation
   */
  analyzeEmotionalArc(emotionalStates) {
    if (!emotionalStates || emotionalStates.length === 0) {
      return 'neutral';
    }

    const startEmotion = emotionalStates[0];
    const endEmotion = emotionalStates[emotionalStates.length - 1];

    // Determine arc type
    const startValence = this.getEmotionValence(startEmotion);
    const endValence = this.getEmotionValence(endEmotion);

    if (endValence > startValence + 0.2) return 'uplifting';
    if (endValence < startValence - 0.2) return 'declining';
    if (startValence > 0.5 && endValence > 0.5) return 'positive';
    if (startValence < -0.2 && endValence < -0.2) return 'challenging';
    return 'neutral';
  }

  /**
   * Get valence of emotion
   */
  getEmotionValence(emotion) {
    const valenceMap = {
      joy: 1, happiness: 1, ecstasy: 1,
      trust: 0.7, admiration: 0.7,
      love: 0.9, optimism: 0.8,
      anticipation: 0.5, interest: 0.4,
      surprise: 0.1,
      sadness: -0.7, grief: -0.9,
      fear: -0.6, terror: -0.9,
      anger: -0.5, rage: -0.8,
      disgust: -0.6, loathing: -0.8,
      neutral: 0
    };

    if (typeof emotion === 'string') {
      return valenceMap[emotion.toLowerCase()] || 0;
    }
    if (emotion && emotion.primary) {
      return valenceMap[emotion.primary.toLowerCase()] || 0;
    }
    return 0;
  }

  /**
   * Identify key moments in conversation
   */
  identifyKeyMoments(messages, emotionalStates) {
    const keyMoments = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const emotion = emotionalStates[i];

      // Check for significance markers
      const isSignificant =
        (emotion && emotion.intensity > 0.7) ||
        (msg.content && msg.content.length > 200) ||
        this.containsSignificanceMarker(msg.content);

      if (isSignificant) {
        keyMoments.push({
          index: i,
          description: this.summarizeMoment(msg),
          emotion: emotion?.primary || 'neutral',
          importance: emotion?.intensity || 0.5,
          timestamp: msg.timestamp,
          tags: this.extractMomentTags(msg)
        });
      }
    }

    // Limit to most significant
    return keyMoments
      .sort((a, b) => b.importance - a.importance)
      .slice(0, this.config.episodic.maxEventsPerDay);
  }

  /**
   * Check for significance markers in text
   */
  containsSignificanceMarker(text) {
    if (!text) return false;

    const markers = [
      'important', 'big news', 'I need to tell you',
      'remember when', 'never forget', 'means a lot',
      'proud of', 'achieved', 'breakthrough', 'finally',
      'I love', 'hate', 'scared', 'terrified', 'ecstatic'
    ];

    const lowerText = text.toLowerCase();
    return markers.some(m => lowerText.includes(m));
  }

  /**
   * Summarize a moment
   */
  summarizeMoment(msg) {
    const content = msg.content || msg.text || '';
    if (content.length <= 100) return content;
    return content.substring(0, 100) + '...';
  }

  /**
   * Extract tags from moment
   */
  extractMomentTags(msg) {
    const content = msg.content || msg.text || '';
    const tags = [];

    // Simple tag extraction
    if (content.match(/\b(happy|joy|excited)\b/i)) tags.push('positive');
    if (content.match(/\b(sad|upset|crying)\b/i)) tags.push('emotional');
    if (content.match(/\b(work|job|career)\b/i)) tags.push('work');
    if (content.match(/\b(love|relationship|partner)\b/i)) tags.push('relationship');
    if (content.match(/\b(family|mom|dad|parent)\b/i)) tags.push('family');

    return tags;
  }

  /**
   * Create summary text
   */
  createSummaryText(messages, topics, emotionalArc) {
    const topicStr = topics.length > 0
      ? `Topics discussed: ${topics.join(', ')}.`
      : 'General conversation.';

    const arcStr = {
      uplifting: 'The conversation had an uplifting trajectory.',
      declining: 'The mood shifted downward during the conversation.',
      positive: 'A positive and warm conversation.',
      challenging: 'A conversation dealing with challenges.',
      neutral: 'A balanced conversation.'
    }[emotionalArc] || '';

    return `${topicStr} ${arcStr} (${messages.length} messages exchanged)`;
  }

  // =====================================================
  // UNIFIED MEMORY INTERFACE
  // =====================================================

  /**
   * Store memory (auto-routes to appropriate tier)
   */
  async storeMemory(userId, memory) {
    // High importance goes to LTM
    if (memory.importance >= 0.8) {
      return await this.addToLTM(userId, memory);
    }

    // Medium importance goes to STM (may be promoted)
    return await this.addToSTM(userId, memory);
  }

  /**
   * Recall memories (searches all tiers)
   */
  async recallMemories(userId, query, options = {}) {
    const {
      includeSTM = true,
      includeLTM = true,
      includeEpisodic = true,
      limit = 15
    } = options;

    const results = {
      stm: [],
      ltm: [],
      episodic: [],
      combined: []
    };

    // Get STM context
    if (includeSTM) {
      results.stm = await this.getSTMContext(userId, {
        topic: query.topic,
        emotion: query.emotion
      });
    }

    // Search LTM
    if (includeLTM) {
      if (query.embedding) {
        results.ltm = await this.searchLTM(userId, query.embedding, { limit: limit * 2 });
      } else if (query.keywords) {
        results.ltm = await this.searchLTMByKeywords(userId, query.keywords, { limit: limit * 2 });
      }
    }

    // Search episodes
    if (includeEpisodic && query.text) {
      results.episodic = await this.searchEpisodes(userId, query.text);
    }

    // Combine and rank
    results.combined = this.combineAndRankMemories(results, limit);

    return results;
  }

  /**
   * Combine and rank memories from all tiers
   */
  combineAndRankMemories(results, limit) {
    const combined = [];

    // Add STM with recency boost
    for (const mem of results.stm || []) {
      combined.push({
        ...mem,
        source: 'stm',
        score: (mem.decayedImportance || mem.importance) * 1.2 // Recency boost
      });
    }

    // Add LTM with similarity score
    for (const mem of results.ltm || []) {
      combined.push({
        ...mem,
        source: 'ltm',
        score: (mem.similarity || 0.5) * mem.importance
      });
    }

    // Add episodic summaries
    for (const ep of results.episodic || []) {
      combined.push({
        ...ep,
        source: 'episodic',
        score: ep.significance * 0.8
      });
    }

    // Sort by score
    combined.sort((a, b) => b.score - a.score);

    return combined.slice(0, limit);
  }

  /**
   * Update access counts for memories
   */
  async updateAccessCounts(userId, memoryIds) {
    const batch = this.db.batch();

    for (const id of memoryIds) {
      // Determine collection from ID prefix
      let collection = 'ltm';
      if (id.startsWith('stm_')) collection = 'stm';
      else if (id.startsWith('ep_')) collection = 'episodic';

      const ref = this.db
        .collection('user_memory')
        .doc(userId)
        .collection(collection)
        .doc(id);

      batch.update(ref, {
        accessCount: FieldValue.increment(1),
        lastAccessed: FieldValue.serverTimestamp()
      });
    }

    await batch.commit();
  }

  /**
   * Get memory statistics for user
   */
  async getMemoryStats(userId) {
    const [stmSnap, ltmSnap, epSnap] = await Promise.all([
      this.db.collection('user_memory').doc(userId).collection('stm').count().get(),
      this.db.collection('user_memory').doc(userId).collection('ltm').count().get(),
      this.db.collection('user_memory').doc(userId).collection('episodic').count().get()
    ]);

    return {
      stm: {
        count: stmSnap.data().count,
        maxCapacity: this.config.stm.maxItems
      },
      ltm: {
        count: ltmSnap.data().count
      },
      episodic: {
        count: epSnap.data().count
      },
      total: stmSnap.data().count + ltmSnap.data().count + epSnap.data().count
    };
  }

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Filter memories by relevance to context
   */
  filterByRelevance(memories, context) {
    return memories.filter(mem => {
      // Topic relevance
      if (context.topic) {
        const memText = `${mem.content} ${(mem.tags || []).join(' ')}`.toLowerCase();
        if (!memText.includes(context.topic.toLowerCase())) {
          return false;
        }
      }

      // Emotional relevance
      if (context.emotion && mem.emotionalContext) {
        const memEmotion = typeof mem.emotionalContext === 'string'
          ? mem.emotionalContext
          : mem.emotionalContext.primary;
        // Keep if emotions match or are complementary
        if (memEmotion !== context.emotion) {
          mem.importance *= 0.7; // Reduce importance but keep
        }
      }

      return true;
    });
  }
}

// Export singleton
const clarifiedMemory = new ClarifiedMemoryArchitecture();

module.exports = {
  ClarifiedMemoryArchitecture,
  clarifiedMemory,

  // Convenience exports
  storeMemory: (userId, memory) => clarifiedMemory.storeMemory(userId, memory),
  recallMemories: (userId, query, options) => clarifiedMemory.recallMemories(userId, query, options),
  createEpisode: (userId, episode) => clarifiedMemory.createEpisode(userId, episode),
  getRecentEpisodes: (userId, days) => clarifiedMemory.getRecentEpisodes(userId, days),
  getMemoryStats: (userId) => clarifiedMemory.getMemoryStats(userId),
  generateConversationSummary: (msgs, emotions) => clarifiedMemory.generateConversationSummary(msgs, emotions),

  // Memory types export
  MemoryTypes: clarifiedMemory.memoryTypes
};
