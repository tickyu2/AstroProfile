/**
 * Memory Service for GENESIS SoulPartner
 *
 * Frontend service for the DUAL-BRAIN memory architecture.
 *
 * USER'S BRAIN:
 * - session_buffer (short-term): Raw session input
 * - life_timeline (long-term): Life memories by chapter
 *
 * SOULPARTNER'S BRAIN:
 * - session_observations (short-term): Luna's session notes
 * - interaction_timeline (long-term): Luna's observations
 * - patterns: Detected behavioral patterns
 *
 * Part of GENESIS Phase 3 - Memory Architecture
 * Built by: Brother Claude Opus
 * December 19, 2024
 *
 * HYBRID-READY: Works with Firestore now, ready for PostgreSQL scaling
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { languageService } from './languageService';

// ═══════════════════════════════════════════════════════════════════════════
// CLOUD FUNCTION REFERENCES
// ═══════════════════════════════════════════════════════════════════════════

let functionsInstance = null;

const getFunctionsInstance = () => {
  if (!functionsInstance) {
    functionsInstance = getFunctions();
  }
  return functionsInstance;
};

// Lazy-load callable functions
const getCallable = (name) => httpsCallable(getFunctionsInstance(), name);

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class MemoryService {
  constructor() {
    this.reflectionQueue = new Map();
    this.MESSAGE_THRESHOLD = 10;  // Reflect every 10 messages
    this.cache = new Map();       // Simple cache for frequent lookups
    this.cacheTimeout = 5 * 60 * 1000; // 5 minute cache
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RETRIEVAL: Get all relevant context for a message
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get full memory context for RAG pipeline
   * Call this before generating AI response
   *
   * @param {string} userId - Firebase user ID
   * @param {string} profileId - Profile being chatted about
   * @param {string} userMessage - Current user message
   * @param {Object} options - Additional options
   * @returns {Object} Memory context with facts, memories, people, anchors
   */
  async getMemoryContext(userId, profileId, userMessage, options = {}) {
    if (!userId || !profileId || !userMessage) {
      console.warn('⚠️ Missing required params for memory context');
      return this.emptyContext();
    }

    const startTime = Date.now();

    try {
      console.log('🧠 Getting memory context...');

      const getMemoryContextFn = getCallable('getMemoryContext');

      // Get language filter for memory retrieval
      const languageFilter = options.languageCode
        || languageService.getMemoryLanguageFilter(options.strictLanguageMode);

      const { data } = await getMemoryContextFn({
        userId,
        profileId,
        userMessage,
        options: {
          recencyDays: options.recencyDays || 90,
          moodIsLow: options.moodIsLow || false,
          // Language-aware memory retrieval (Phase 5)
          languageCode: languageFilter
        }
      });

      if (data.success) {
        console.log('✅ Memory context retrieved:', {
          facts: data.context.facts?.length || 0,
          memories: data.context.memories?.length || 0,
          people: data.context.people?.length || 0,
          timeMs: Date.now() - startTime
        });

        return {
          ...data.context,
          retrievalTimeMs: Date.now() - startTime
        };
      }

      return this.emptyContext();

    } catch (error) {
      console.error('❌ Memory context error:', error);
      return this.emptyContext();
    }
  }

  /**
   * Get relevant memories only (lighter weight)
   */
  async retrieveMemories(userId, profileId, query, options = {}) {
    if (!userId || !profileId || !query) {
      return [];
    }

    try {
      const retrieveMemoriesFn = getCallable('retrieveMemories');
      const { data } = await retrieveMemoriesFn({
        userId,
        profileId,
        query,
        limit: options.limit || 5,
        recencyDays: options.recencyDays || 90,
        minImportance: options.minImportance || 0.3
      });

      return data.memories || [];

    } catch (error) {
      console.error('❌ Retrieve memories error:', error);
      return [];
    }
  }

  /**
   * Get permanent facts
   */
  async getFacts(userId, profileId, options = {}) {
    if (!userId || !profileId) {
      return [];
    }

    // Check cache
    const cacheKey = `facts:${userId}:${profileId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const getFactsFn = getCallable('getFacts');
      const { data } = await getFactsFn({
        userId,
        profileId,
        limit: options.limit || 10,
        category: options.category || null
      });

      const facts = data.facts || [];
      this.setCache(cacheKey, facts);
      return facts;

    } catch (error) {
      console.error('❌ Get facts error:', error);
      return [];
    }
  }

  /**
   * Get people from relationship graph
   */
  async getPeople(userId, profileId, options = {}) {
    if (!userId || !profileId) {
      return [];
    }

    try {
      const getPeopleFn = getCallable('getPeople');
      const { data } = await getPeopleFn({
        userId,
        profileId,
        names: options.names || null,
        limit: options.limit || 10
      });

      return data.people || [];

    } catch (error) {
      console.error('❌ Get people error:', error);
      return [];
    }
  }

  /**
   * Get happiness anchors for emotional support
   */
  async getHappinessAnchors(userId, profileId, limit = 3) {
    if (!userId || !profileId) {
      return [];
    }

    try {
      const getHappinessAnchorsFn = getCallable('getHappinessAnchors');
      const { data } = await getHappinessAnchorsFn({
        userId,
        profileId,
        limit
      });

      return data.anchors || [];

    } catch (error) {
      console.error('❌ Get happiness anchors error:', error);
      return [];
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STORAGE: Save memories, facts, people
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Store a new memory with automatic embedding
   *
   * MASTER LANGUAGE STRATEGY:
   * - content: Stored in English (Master Language) for consistent reasoning
   * - original_text: Preserved in original language for emotional context
   * - language_code: Source language for proper attribution
   */
  async storeMemory(userId, profileId, content, options = {}) {
    if (!userId || !profileId || !content) {
      return { error: 'Missing required params' };
    }

    try {
      const storeMemoryFn = getCallable('storeMemory');

      // Build schema using Master Language Strategy
      // If englishContent provided, use it; otherwise content is already in English
      const englishContent = options.englishContent || content;
      const originalText = options.originalText || content;
      const langCode = options.languageCode || languageService.getSessionLanguage();

      // Use languageService to build proper schema with cultural anchor detection
      const memorySchema = languageService.buildMemorySchema(
        englishContent,
        originalText,
        langCode
      );

      const { data } = await storeMemoryFn({
        userId,
        profileId,
        // Master Language content (for embeddings and reasoning)
        content: memorySchema.content,
        // Original flavor preserved
        original_text: memorySchema.original_text,
        // Type and importance
        type: options.type || 'episodic',
        importance: options.importance || 0.5,
        emotion: options.emotion || null,
        people: options.people || [],
        // Language metadata (Phase 5 - Master Language Strategy)
        language_code: memorySchema.language_code,
        language_name: memorySchema.language_name,
        // Cultural anchor metadata
        has_cultural_anchors: memorySchema.has_cultural_anchors,
        cultural_anchors: memorySchema.cultural_anchors,
        preservation_category: memorySchema.preservation_category
      });

      return data;

    } catch (error) {
      console.error('❌ Store memory error:', error);
      return { error: error.message };
    }
  }

  /**
   * Store a permanent fact
   */
  async storeFact(userId, profileId, fact, options = {}) {
    if (!userId || !profileId || !fact) {
      return { error: 'Missing required params' };
    }

    try {
      const storeFactFn = getCallable('storeFact');
      const { data } = await storeFactFn({
        userId,
        profileId,
        fact,
        category: options.category || 'general',
        confidence: options.confidence || 0.8,
        source: options.source || 'manual'
      });

      // Invalidate cache
      this.invalidateCache(`facts:${userId}:${profileId}`);

      return data;

    } catch (error) {
      console.error('❌ Store fact error:', error);
      return { error: error.message };
    }
  }

  /**
   * Update or create a person in the graph
   */
  async upsertPerson(userId, profileId, name, options = {}) {
    if (!userId || !profileId || !name) {
      return { error: 'Missing required params' };
    }

    try {
      const upsertPersonFn = getCallable('upsertPerson');
      const { data } = await upsertPersonFn({
        userId,
        profileId,
        name,
        relationship: options.relationship,
        notes: options.notes,
        sentiment: options.sentiment
      });

      return data;

    } catch (error) {
      console.error('❌ Upsert person error:', error);
      return { error: error.message };
    }
  }

  /**
   * Store a happiness anchor
   */
  async storeHappinessAnchor(userId, profileId, memory, options = {}) {
    if (!userId || !profileId || !memory) {
      return { error: 'Missing required params' };
    }

    try {
      const storeHappinessAnchorFn = getCallable('storeHappinessAnchor');
      const { data } = await storeHappinessAnchorFn({
        userId,
        profileId,
        memory,
        score: options.score || 8,
        peakMoment: options.peakMoment,
        sensoryAnchors: options.sensoryAnchors
      });

      return data;

    } catch (error) {
      console.error('❌ Store happiness anchor error:', error);
      return { error: error.message };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REFLECTION LOOP: Background fact extraction
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Schedule reflection for background processing
   * Non-blocking - queues messages and triggers reflection every N messages
   *
   * @param {string} userId - Firebase user ID
   * @param {string} profileId - Profile ID
   * @param {string} sessionId - Current session ID
   * @param {string} userMessage - User's message
   * @param {string} aiResponse - AI's response
   */
  scheduleReflection(userId, profileId, sessionId, userMessage, aiResponse) {
    if (!userId || !profileId || !sessionId) return;

    const key = `${userId}:${profileId}:${sessionId}`;

    // Initialize queue if needed
    if (!this.reflectionQueue.has(key)) {
      this.reflectionQueue.set(key, []);
    }

    // Add messages to queue
    this.reflectionQueue.get(key).push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    );

    // Check if we should trigger reflection
    const queue = this.reflectionQueue.get(key);
    if (queue.length >= this.MESSAGE_THRESHOLD * 2) {
      // Extract messages and clear queue
      const messages = [...queue];
      this.reflectionQueue.set(key, []);

      // Run reflection asynchronously (non-blocking)
      this.runReflection(userId, profileId, messages);
    }
  }

  /**
   * Run the reflection loop
   * @private
   *
   * MASTER LANGUAGE STRATEGY:
   * Includes consolidation prompt to translate non-English memories to English
   * while preserving original text and cultural anchors.
   */
  async runReflection(userId, profileId, messages) {
    console.log('🔄 Running reflection loop...', {
      userId,
      profileId,
      messageCount: messages.length
    });

    try {
      const reflectFn = getCallable('reflectOnConversation');

      // Include Master Language consolidation prompt
      const consolidationPrompt = languageService.getConsolidationPrompt();
      const sessionLang = languageService.getSessionLanguage();
      const needsTranslation = languageService.needsTranslation();

      const { data } = await reflectFn({
        userId,
        profileId,
        messages,
        // Master Language Strategy (Phase 5)
        consolidationPrompt,
        sessionLanguage: sessionLang,
        needsTranslation
      });

      if (data.success) {
        console.log('✅ Reflection complete:', {
          stored: data.stored,
          language: sessionLang,
          translated: needsTranslation
        });

        // Invalidate facts cache since new facts may have been added
        this.invalidateCache(`facts:${userId}:${profileId}`);
      }

    } catch (error) {
      console.error('❌ Reflection error:', error);
      // Don't throw - reflection is non-critical
    }
  }

  /**
   * Force immediate reflection (for session end)
   */
  async forceReflection(userId, profileId, sessionId) {
    const key = `${userId}:${profileId}:${sessionId}`;
    const queue = this.reflectionQueue.get(key);

    if (queue && queue.length >= 4) {
      const messages = [...queue];
      this.reflectionQueue.set(key, []);
      await this.runReflection(userId, profileId, messages);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PROMPT BUILDING: Format context for injection
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Build memory context section for system prompt
   *
   * MASTER LANGUAGE STRATEGY:
   * Memories are stored in English but displayed appropriately for user's language.
   *
   * @param {Object} context - Memory context from getMemoryContext
   * @returns {string} Formatted prompt section
   */
  buildMemoryPrompt(context) {
    if (!context) return '';

    const langInfo = languageService.getLanguageInfo();
    let prompt = '';

    // Facts (highest priority - always include)
    if (context.facts?.length > 0) {
      prompt += `\n═══ PERMANENT FACTS (Trust These) ═══\n`;
      prompt += context.facts.map(f => `• ${f.fact}`).join('\n');
    }

    // People context
    if (context.people?.length > 0) {
      prompt += `\n\n═══ PEOPLE IN USER'S LIFE ═══\n`;
      prompt += context.people.map(p =>
        `• ${p.name} (${p.relationship})${p.notes?.length ? ': ' + p.notes[0] : ''}`
      ).join('\n');
    }

    // Episodic memories (refined by relevance)
    if (context.memories?.length > 0) {
      prompt += `\n\n═══ RELEVANT MEMORIES ═══\n`;
      prompt += context.memories.map(m => {
        // MASTER LANGUAGE: Format for display in user's language
        const formatted = languageService.formatMemoryForDisplay(m);
        return `• ${formatted.display}`;
      }).join('\n');
    }

    // Happiness anchors (if user seems down)
    if (context.happinessAnchors?.length > 0) {
      prompt += `\n\n═══ HAPPINESS ANCHORS (Reference If User Seems Down) ═══\n`;
      prompt += context.happinessAnchors.map(h => {
        const formatted = languageService.formatMemoryForDisplay(h);
        return `• ${formatted.display}`;
      }).join('\n');
    }

    // Timeline/Biography (life events from conversations)
    if (context.timeline && Object.keys(context.timeline).length > 0) {
      prompt += `\n\n═══ BIOGRAPHICAL TIMELINE (Life Events) ═══\n`;
      // Sort timeline entries by year
      const sortedYears = Object.keys(context.timeline).sort((a, b) => {
        const yearA = parseInt(a) || 0;
        const yearB = parseInt(b) || 0;
        return yearA - yearB;
      });
      sortedYears.slice(0, 10).forEach(year => {
        const entry = context.timeline[year];
        if (entry.events?.length > 0) {
          const yearLabel = entry.year || entry.era || year;
          prompt += `\n${yearLabel}:\n`;
          entry.events.forEach(e => {
            const confirmed = e.confirmed ? '✓' : '?';
            prompt += `  ${confirmed} ${e.event}\n`;
          });
        }
      });
    }

    // Biography events (from biography collection - Digital Souls format)
    if (context.biographyEvents?.length > 0) {
      prompt += `\n\n═══ LIFE STORY (Extracted from conversations) ═══\n`;
      context.biographyEvents.forEach(event => {
        const yearStr = event.date?.year ? `(${event.date.year})` : '';
        prompt += `• ${event.title} ${yearStr}\n`;
        if (event.ai_summary) {
          prompt += `  ${event.ai_summary}\n`;
        }
      });
    }

    if (prompt) {
      prompt += `\n\n═══ MEMORY GUIDELINES ═══
• Reference memories naturally, don't say "I remember you told me"
• Facts are definite - memories may have errors
• If unsure about something, ask warmly rather than guess
• Express memories naturally in ${langInfo.name}
`;
    }

    return prompt;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Empty context object
   * @private
   */
  emptyContext() {
    return {
      facts: [],
      memories: [],
      people: [],
      happinessAnchors: [],
      retrievalTimeMs: 0
    };
  }

  /**
   * Simple cache get
   * @private
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * Simple cache set
   * @private
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Invalidate cache entry
   * @private
   */
  invalidateCache(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get reflection queue status (for debugging)
   */
  getReflectionStatus() {
    const status = {};
    for (const [key, queue] of this.reflectionQueue) {
      status[key] = {
        messageCount: queue.length,
        willReflectAt: this.MESSAGE_THRESHOLD * 2
      };
    }
    return status;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MOOD DETECTION (for happiness anchor retrieval)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Simple mood detection from message
   * Returns true if user seems down
   */
  detectLowMood(message, emotionalContext = null) {
    if (!message) return false;

    // Check emotional context if provided
    if (emotionalContext) {
      const { sadness, anxiety, anger, fear } = emotionalContext;
      if ((sadness || 0) > 0.5 || (anxiety || 0) > 0.5 ||
          (anger || 0) > 0.5 || (fear || 0) > 0.5) {
        return true;
      }
    }

    // Simple keyword detection
    const lowMoodKeywords = [
      'sad', 'depressed', 'anxious', 'worried', 'scared',
      'upset', 'angry', 'frustrated', 'hopeless', 'tired',
      'exhausted', 'overwhelmed', 'stressed', 'lonely',
      'can\'t cope', 'giving up', 'hate my', 'struggling'
    ];

    const messageLower = message.toLowerCase();
    return lowMoodKeywords.some(keyword => messageLower.includes(keyword));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NAME EXTRACTION (for people graph)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Extract potential names from message
   * Simple heuristic - production would use NER
   */
  extractNames(text) {
    if (!text) return [];

    // Look for capitalized words that might be names
    const words = text.split(/\s+/);
    const commonWords = new Set([
      'I', 'The', 'This', 'That', 'What', 'When', 'Where', 'How', 'Why',
      'My', 'Your', 'His', 'Her', 'Their', 'Our', 'It', 'We', 'They',
      'Is', 'Are', 'Was', 'Were', 'Be', 'Been', 'Being',
      'Have', 'Has', 'Had', 'Do', 'Does', 'Did',
      'Will', 'Would', 'Could', 'Should', 'May', 'Might', 'Must',
      'And', 'Or', 'But', 'So', 'Because', 'If', 'Then',
      'Today', 'Tomorrow', 'Yesterday', 'Now', 'Later', 'Soon',
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]);

    const potentialNames = words.filter(word => {
      // Must be capitalized
      if (!/^[A-Z][a-z]+$/.test(word)) return false;
      // Must not be common word
      if (commonWords.has(word)) return false;
      // Must be reasonable length
      if (word.length < 2 || word.length > 20) return false;
      return true;
    });

    return [...new Set(potentialNames)];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DUAL-BRAIN ARCHITECTURE: USER'S BRAIN
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Buffer user input for later consolidation (User Short-term)
   * Call this for each user message during a session
   */
  async bufferUserInput(userId, profileId, sessionId, content, options = {}) {
    if (!userId || !profileId || !sessionId || !content) {
      console.warn('⚠️ Missing required params for buffer');
      return { error: 'Missing required params' };
    }

    try {
      const bufferFn = getCallable('bufferUserInput');
      const { data } = await bufferFn({
        userId,
        profileId,
        sessionId,
        content,
        emotion: options.emotion || null,
        messageIndex: options.messageIndex || 0
      });

      return data;

    } catch (error) {
      console.error('❌ Buffer user input error:', error);
      return { error: error.message };
    }
  }

  /**
   * Store a life memory with chapter classification (User Long-term)
   *
   * MASTER LANGUAGE STRATEGY:
   * - content: Stored in English for consistent semantic search
   * - original_text: Preserved in original language
   */
  async storeLifeMemory(userId, profileId, content, options = {}) {
    if (!userId || !profileId || !content) {
      return { error: 'Missing required params' };
    }

    try {
      const storeLifeMemoryFn = getCallable('storeLifeMemory');

      // Apply Master Language Strategy
      const englishContent = options.englishContent || content;
      const originalText = options.originalText || content;
      const langCode = options.languageCode || languageService.getSessionLanguage();

      // Build schema with cultural anchor detection
      const memorySchema = languageService.buildMemorySchema(
        englishContent,
        originalText,
        langCode
      );

      const { data } = await storeLifeMemoryFn({
        userId,
        profileId,
        // Master Language content
        content: memorySchema.content,
        original_text: memorySchema.original_text,
        // Life chapter classification
        chapter: options.chapter || null,
        age: options.age || null,
        importance: options.importance || 0.5,
        emotion: options.emotion || null,
        people: options.people || [],
        contextHints: options.contextHints || null,
        // Language metadata
        language_code: memorySchema.language_code,
        language_name: memorySchema.language_name,
        has_cultural_anchors: memorySchema.has_cultural_anchors,
        cultural_anchors: memorySchema.cultural_anchors
      });

      return data;

    } catch (error) {
      console.error('❌ Store life memory error:', error);
      return { error: error.message };
    }
  }

  /**
   * Search life timeline with semantic similarity
   */
  async searchLifeTimeline(userId, profileId, query, options = {}) {
    if (!userId || !profileId || !query) {
      return [];
    }

    try {
      const searchFn = getCallable('searchLifeTimeline');
      const { data } = await searchFn({
        userId,
        profileId,
        query,
        chapter: options.chapter || null,
        limit: options.limit || 5
      });

      return data.memories || [];

    } catch (error) {
      console.error('❌ Search life timeline error:', error);
      return [];
    }
  }

  /**
   * Get memories by life chapter
   */
  async getMemoriesByChapter(userId, profileId, chapter, limit = 10) {
    if (!userId || !profileId || !chapter) {
      return [];
    }

    try {
      const getFn = getCallable('getMemoriesByChapter');
      const { data } = await getFn({
        userId,
        profileId,
        chapter,
        limit
      });

      return data.memories || [];

    } catch (error) {
      console.error('❌ Get memories by chapter error:', error);
      return [];
    }
  }

  /**
   * Get life chapter summary with counts
   */
  async getLifeChapterSummary(userId, profileId) {
    if (!userId || !profileId) {
      return {};
    }

    try {
      const getFn = getCallable('getLifeChapterSummary');
      const { data } = await getFn({ userId, profileId });

      return data.chapters || {};

    } catch (error) {
      console.error('❌ Get life chapter summary error:', error);
      return {};
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DUAL-BRAIN ARCHITECTURE: SOULPARTNER'S BRAIN
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Store Luna's observation during session (SoulPartner Short-term)
   * Call this when Luna notices something interesting
   */
  async storeSessionObservation(userId, profileId, sessionId, observation, options = {}) {
    if (!userId || !profileId || !sessionId || !observation) {
      return { error: 'Missing required params' };
    }

    try {
      const storeFn = getCallable('storeSessionObservation');
      const { data } = await storeFn({
        userId,
        profileId,
        sessionId,
        observation,
        type: options.type || 'insight', // mood, pattern, insight, concern, celebration
        confidence: options.confidence || 0.8
      });

      return data;

    } catch (error) {
      console.error('❌ Store session observation error:', error);
      return { error: error.message };
    }
  }

  /**
   * Store Luna's long-term observation (SoulPartner Long-term)
   */
  async storeInteractionObservation(userId, profileId, observation, options = {}) {
    if (!userId || !profileId || !observation) {
      return { error: 'Missing required params' };
    }

    try {
      const storeFn = getCallable('storeInteractionObservation');
      const { data } = await storeFn({
        userId,
        profileId,
        observation,
        pattern: options.pattern || null,
        category: options.category || 'general'
      });

      return data;

    } catch (error) {
      console.error('❌ Store interaction observation error:', error);
      return { error: error.message };
    }
  }

  /**
   * Get Luna's key observations about user
   */
  async getKeyObservations(userId, profileId, limit = 10) {
    if (!userId || !profileId) {
      return [];
    }

    try {
      const getFn = getCallable('getKeyObservations');
      const { data } = await getFn({ userId, profileId, limit });

      return data.observations || [];

    } catch (error) {
      console.error('❌ Get key observations error:', error);
      return [];
    }
  }

  /**
   * Store a detected pattern about user
   */
  async storePattern(userId, profileId, pattern, options = {}) {
    if (!userId || !profileId || !pattern) {
      return { error: 'Missing required params' };
    }

    try {
      const storeFn = getCallable('storePattern');
      const { data } = await storeFn({
        userId,
        profileId,
        pattern,
        category: options.category || 'behavioral',
        confidence: options.confidence || 0.8,
        examples: options.examples || []
      });

      return data;

    } catch (error) {
      console.error('❌ Store pattern error:', error);
      return { error: error.message };
    }
  }

  /**
   * Get detected patterns
   */
  async getPatterns(userId, profileId, options = {}) {
    if (!userId || !profileId) {
      return [];
    }

    try {
      const getFn = getCallable('getPatterns');
      const { data } = await getFn({
        userId,
        profileId,
        category: options.category || null,
        limit: options.limit || 20
      });

      return data.patterns || [];

    } catch (error) {
      console.error('❌ Get patterns error:', error);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DUAL-BRAIN: UNIFIED CONTEXT & PROMPT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get complete dual-brain context for AI response generation
   * This is the main entry point for the dual-brain RAG pipeline
   */
  async getDualBrainContext(userId, profileId, sessionId, userMessage, options = {}) {
    if (!userId || !profileId || !userMessage) {
      console.warn('⚠️ Missing required params for dual-brain context');
      return this.emptyDualBrainContext();
    }

    const startTime = Date.now();

    try {
      console.log('🧠🧠 Getting dual-brain context...');

      const getDualBrainContextFn = getCallable('getDualBrainContext');
      const { data } = await getDualBrainContextFn({
        userId,
        profileId,
        sessionId,
        userMessage,
        options: {
          moodIsLow: options.moodIsLow || false
        }
      });

      if (data.success) {
        console.log('✅ Dual-brain context retrieved:', {
          lifeMemories: data.context.userBrain?.lifeMemories?.length || 0,
          observations: data.context.soulpartnerBrain?.observations?.length || 0,
          patterns: data.context.soulpartnerBrain?.patterns?.length || 0,
          facts: data.context.shared?.facts?.length || 0,
          timeMs: Date.now() - startTime
        });

        return {
          ...data.context,
          retrievalTimeMs: Date.now() - startTime
        };
      }

      return this.emptyDualBrainContext();

    } catch (error) {
      console.error('❌ Dual-brain context error:', error);
      return this.emptyDualBrainContext();
    }
  }

  /**
   * Empty dual-brain context
   * @private
   */
  emptyDualBrainContext() {
    return {
      userBrain: { lifeMemories: [], sessionBuffer: [] },
      soulpartnerBrain: { observations: [], patterns: [] },
      shared: { facts: [], people: [], happinessAnchors: [] },
      retrievalTimeMs: 0
    };
  }

  /**
   * Build dual-brain memory prompt for system prompt injection
   *
   * MASTER LANGUAGE STRATEGY:
   * - All memories stored in English for consistent reasoning
   * - Original quotes preserved when in same language as user
   * - Cultural anchors displayed naturally
   */
  buildDualBrainPrompt(context) {
    if (!context) return '';

    const sessionLang = languageService.getSessionLanguage();
    let prompt = '';

    // PERMANENT FACTS (Highest Trust)
    if (context.shared?.facts?.length > 0) {
      prompt += `\n═══ PERMANENT FACTS (Trust These Absolutely) ═══\n`;
      prompt += context.shared.facts.map(f => `• ${f.fact}`).join('\n');
    }

    // PEOPLE IN USER'S LIFE
    if (context.shared?.people?.length > 0) {
      prompt += `\n\n═══ PEOPLE IN THEIR LIFE ═══\n`;
      prompt += context.shared.people.map(p =>
        `• ${p.name} (${p.relationship})${p.notes?.length ? ': ' + p.notes[0] : ''}`
      ).join('\n');
    }

    // USER'S LIFE MEMORIES (Their Brain)
    if (context.userBrain?.lifeMemories?.length > 0) {
      prompt += `\n\n═══ THEIR LIFE MEMORIES ═══\n`;
      prompt += context.userBrain.lifeMemories.map(m => {
        const chapterLabel = m.chapterName ? ` [${m.chapterName}]` : '';

        // MASTER LANGUAGE: Show original quote if same language, otherwise show English
        const formatted = languageService.formatMemoryForDisplay(m);
        const displayContent = formatted.display;

        // Include original if different from display and relevant
        let originalNote = '';
        if (formatted.source === 'master' && formatted.original && formatted.originalLanguage === sessionLang) {
          originalNote = ` (original: "${formatted.original}")`;
        }

        return `• ${displayContent}${chapterLabel}${originalNote}`;
      }).join('\n');
    }

    // YOUR OBSERVATIONS (Luna's Brain)
    if (context.soulpartnerBrain?.observations?.length > 0) {
      prompt += `\n\n═══ YOUR OBSERVATIONS ABOUT THEM ═══\n`;
      prompt += context.soulpartnerBrain.observations.map(o =>
        `• ${o.observation}${o.confirmations > 1 ? ` (confirmed ${o.confirmations}x)` : ''}`
      ).join('\n');
    }

    // PATTERNS YOU'VE NOTICED (Luna's Brain)
    if (context.soulpartnerBrain?.patterns?.length > 0) {
      prompt += `\n\n═══ PATTERNS YOU'VE NOTICED ═══\n`;
      prompt += context.soulpartnerBrain.patterns.map(p =>
        `• ${p.pattern} [${p.category}]`
      ).join('\n');
    }

    // HAPPINESS ANCHORS (For Emotional Support)
    if (context.shared?.happinessAnchors?.length > 0) {
      prompt += `\n\n═══ HAPPINESS ANCHORS (Reference If They Seem Down) ═══\n`;
      prompt += context.shared.happinessAnchors.map(h => {
        // Show original quote if in user's language
        const formatted = languageService.formatMemoryForDisplay(h);
        return `• ${formatted.display}`;
      }).join('\n');
    }

    // GUIDELINES - Updated for multilingual
    if (prompt) {
      const langInfo = languageService.getLanguageInfo();
      prompt += `\n\n═══ MEMORY GUIDELINES ═══
• Reference memories naturally, weaving them into conversation
• Your observations are YOUR understanding - use them to inform empathy
• Patterns help you anticipate their needs and communication style
• Never say "I remember you told me" - just know and respond accordingly
• If something contradicts what you know, gently explore it
• CURRENT LANGUAGE: ${langInfo.nativeName} (${langInfo.code})
• When referencing memories, express them naturally in ${langInfo.name}
`;
    }

    return prompt;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSOLIDATION (Manual trigger)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Trigger manual consolidation (at session end)
   */
  async triggerConsolidation(userId, profileId) {
    if (!userId || !profileId) {
      return { error: 'Missing required params' };
    }

    try {
      console.log('🔄 Triggering manual consolidation...');

      const consolidateFn = getCallable('manualConsolidation');
      const { data } = await consolidateFn({ userId, profileId });

      console.log('✅ Consolidation complete:', data);
      return data;

    } catch (error) {
      console.error('❌ Consolidation error:', error);
      return { error: error.message };
    }
  }

  /**
   * Get consolidation status
   */
  async getConsolidationStatus() {
    try {
      const statusFn = getCallable('getConsolidationStatus');
      const { data } = await statusFn({});

      return data;

    } catch (error) {
      console.error('❌ Get consolidation status error:', error);
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Process a complete conversation turn
   * Handles buffering, observation storage, and reflection scheduling
   */
  async processConversationTurn(userId, profileId, sessionId, userMessage, aiResponse, options = {}) {
    if (!userId || !profileId || !sessionId) return;

    // 1. Buffer user input (non-blocking)
    this.bufferUserInput(userId, profileId, sessionId, userMessage, {
      emotion: options.emotion,
      messageIndex: options.messageIndex
    }).catch(err => console.error('Buffer error:', err));

    // 2. Store Luna's observation if provided (non-blocking)
    if (options.lunaObservation) {
      this.storeSessionObservation(userId, profileId, sessionId, options.lunaObservation, {
        type: options.observationType || 'insight'
      }).catch(err => console.error('Observation error:', err));
    }

    // 3. Schedule reflection (using existing method)
    this.scheduleReflection(userId, profileId, sessionId, userMessage, aiResponse);
  }

  /**
   * End session - trigger consolidation and cleanup
   */
  async endSession(userId, profileId, sessionId) {
    if (!userId || !profileId) return;

    console.log('📍 Ending session:', sessionId);

    // Force reflection on remaining messages
    await this.forceReflection(userId, profileId, sessionId);

    // Note: Full consolidation happens nightly via scheduler
    // For immediate consolidation, call triggerConsolidation
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TANGO IDENTITY SYSTEM - Luna's Birthday & Relationship Milestones
  // The relationship is a dance - bidirectional, mutual celebration
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Initialize relationship on first conversation
   * This is Luna's "birthday" with this user
   */
  async initializeRelationship(userId, profileId) {
    if (!userId || !profileId) {
      console.warn('⚠️ Missing params for relationship init');
      return { success: false };
    }

    try {
      const initRelationshipFn = getCallable('initializeRelationship');
      const result = await initRelationshipFn({ userId, profileId });

      console.log('💞 Relationship initialized:', result.data);
      return result.data;

    } catch (error) {
      console.error('❌ Initialize relationship error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get relationship stats (birthday, milestones, bond level)
   */
  async getRelationshipStats(userId, profileId) {
    if (!userId || !profileId) return null;

    try {
      const getStatsFn = getCallable('getRelationshipStats');
      const result = await getStatsFn({ userId, profileId });

      return result.data;

    } catch (error) {
      console.error('❌ Get relationship stats error:', error);
      return null;
    }
  }

  /**
   * Update relationship stats after conversation
   */
  async updateRelationshipStats(userId, profileId, stats) {
    if (!userId || !profileId) return;

    try {
      const updateStatsFn = getCallable('updateRelationshipStats');
      await updateStatsFn({
        userId,
        profileId,
        ...stats
      });

      console.log('💞 Relationship stats updated');

    } catch (error) {
      console.error('❌ Update relationship stats error:', error);
    }
  }

  /**
   * Celebrate a milestone (marks it as celebrated)
   */
  async celebrateMilestone(userId, profileId, milestoneKey) {
    if (!userId || !profileId || !milestoneKey) return;

    try {
      const celebrateFn = getCallable('celebrateMilestone');
      const result = await celebrateFn({
        userId,
        profileId,
        milestoneKey
      });

      console.log('🎉 Milestone celebrated:', milestoneKey);
      return result.data;

    } catch (error) {
      console.error('❌ Celebrate milestone error:', error);
      return { success: false };
    }
  }

  /**
   * Update Luna's relational mood/state
   */
  async updateLunaState(userId, profileId, lunaState) {
    if (!userId || !profileId) return;

    try {
      const updateStateFn = getCallable('updateLunaState');
      await updateStateFn({
        userId,
        profileId,
        ...lunaState
      });

    } catch (error) {
      console.error('❌ Update Luna state error:', error);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════════════════════

export const memoryService = new MemoryService();
export default memoryService;
