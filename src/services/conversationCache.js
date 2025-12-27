/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CONVERSATION CACHE - Smart Payload Builder for 80%+ Token Reduction
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Reduces tokens sent per API call by sending only:
 * - "Story So Far" (compressed summary from summarizationService)
 * - Last N recent messages (configurable, default 10)
 * - Current message
 *
 * MODALITY ISOLATION (December 2024):
 * - Text and Voice conversations are kept separate
 * - Each modality has its own message buffer and "Story So Far"
 * - User can type about cats while speaking about work - no mixing!
 *
 * BEFORE: Every message → Send all 50 messages → 50,000 tokens
 * AFTER:  Every message → Send summary + 10 messages → 2,500 tokens (95% reduction)
 *
 * @module conversationCache
 */

import { summarizationService } from './summarizationService';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Number of recent messages to always include
  recentMessageCount: 10,

  // When to trigger auto-summarization
  summarizationThreshold: 20,

  // Token estimation (chars / 4)
  tokenEstimateRatio: 4,

  // Maximum tokens for "Story So Far"
  maxStorySoFarTokens: 500,

  // Whether to log metrics
  enableMetrics: true,

  // Default modality if not specified
  defaultModality: 'text'
};

// Valid modalities
export const MODALITIES = {
  TEXT: 'text',
  VOICE: 'voice'
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION CACHE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class ConversationCache {
  constructor() {
    // Local message storage per profile+modality
    // Key format: "profileId:modality" (e.g., "abc123:text", "abc123:voice")
    this.messageCache = new Map(); // "profileId:modality" -> messages[]

    // Story So Far cache per profile+modality
    this.storyCache = new Map(); // "profileId:modality" -> { story, timestamp }

    // Metrics tracking
    this.metrics = {
      totalMessagesProcessed: 0,
      tokensSavedTotal: 0,
      apiCallsOptimized: 0
    };
  }

  /**
   * Build cache key from profileId and modality
   * @param {string} profileId - Profile ID
   * @param {string} modality - 'text' or 'voice'
   * @returns {string} - Cache key
   */
  _buildCacheKey(profileId, modality = CONFIG.defaultModality) {
    const validModality = Object.values(MODALITIES).includes(modality)
      ? modality
      : CONFIG.defaultModality;
    return `${profileId}:${validModality}`;
  }

  /**
   * Parse cache key back to profileId and modality
   * @param {string} cacheKey
   * @returns {Object} - { profileId, modality }
   */
  _parseCacheKey(cacheKey) {
    const [profileId, modality] = cacheKey.split(':');
    return { profileId, modality: modality || CONFIG.defaultModality };
  }

  /**
   * Estimate token count for text
   */
  estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / CONFIG.tokenEstimateRatio);
  }

  /**
   * Estimate tokens for a message array
   */
  estimateMessagesTokens(messages) {
    if (!messages || messages.length === 0) return 0;
    return messages.reduce((sum, msg) => {
      const content = msg.text || msg.content || '';
      return sum + this.estimateTokens(content);
    }, 0);
  }

  /**
   * Get all cached messages for a profile+modality
   * @param {string} profileId - Profile ID
   * @param {string} modality - 'text' or 'voice' (default: 'text')
   */
  getMessages(profileId, modality = CONFIG.defaultModality) {
    const cacheKey = this._buildCacheKey(profileId, modality);
    return this.messageCache.get(cacheKey) || [];
  }

  /**
   * Add a message to the cache for a specific modality
   * @param {string} profileId - Profile ID
   * @param {Object} message - Message object
   * @param {string} modality - 'text' or 'voice' (default: 'text')
   */
  addMessage(profileId, message, modality = CONFIG.defaultModality) {
    const cacheKey = this._buildCacheKey(profileId, modality);
    if (!this.messageCache.has(cacheKey)) {
      this.messageCache.set(cacheKey, []);
    }
    this.messageCache.get(cacheKey).push({
      ...message,
      modality,  // Tag message with its modality
      cachedAt: Date.now()
    });
    this.metrics.totalMessagesProcessed++;

    if (CONFIG.enableMetrics) {
      console.log(`📝 [ConversationCache] Added ${modality} message to ${profileId?.slice(0, 8)}...`);
    }
  }

  /**
   * Set the full message history for a profile+modality (e.g., on component mount)
   * @param {string} profileId - Profile ID
   * @param {Array} messages - Message array
   * @param {string} modality - 'text' or 'voice' (default: 'text')
   */
  setMessages(profileId, messages, modality = CONFIG.defaultModality) {
    const cacheKey = this._buildCacheKey(profileId, modality);
    this.messageCache.set(cacheKey, messages.map(msg => ({
      ...msg,
      modality,
      cachedAt: Date.now()
    })));
  }

  /**
   * Build an optimized payload for API calls
   * This is the core function that reduces tokens by 80%+
   *
   * @param {string} profileId - Profile ID
   * @param {string} conversationId - Conversation ID for summarization
   * @param {Object} options - Optional configuration
   * @param {string} options.modality - 'text' or 'voice' (default: 'text')
   * @returns {Promise<Object>} - Optimized payload { storySoFar, recentMessages, metrics }
   */
  async buildOptimizedPayload(profileId, conversationId, options = {}) {
    const {
      recentCount = CONFIG.recentMessageCount,
      includeStory = true,
      forceRefresh = false,
      modality = CONFIG.defaultModality
    } = options;

    const allMessages = this.getMessages(profileId, modality);
    const startTime = Date.now();

    // Calculate what we WOULD have sent (for metrics)
    const fullPayloadTokens = this.estimateMessagesTokens(allMessages);

    // Get "Story So Far" if we have enough messages
    let storySoFar = null;
    let storyTokens = 0;

    if (includeStory && allMessages.length > recentCount) {
      storySoFar = await this.getOrFetchStorySoFar(profileId, modality, forceRefresh);
      storyTokens = this.estimateTokens(storySoFar);
    }

    // Get only recent messages
    const recentMessages = allMessages.slice(-recentCount);
    const recentTokens = this.estimateMessagesTokens(recentMessages);

    // Build optimized payload
    const optimizedPayload = {
      storySoFar,
      recentMessages: recentMessages.map(msg => ({
        sender: msg.sender,
        text: msg.text || msg.content,
        reactions: msg.reactions,
        modality: msg.modality || modality
      })),
      hasContext: !!storySoFar,
      messagesTruncated: allMessages.length - recentMessages.length,
      modality  // Include modality in payload
    };

    // Calculate metrics
    const optimizedTokens = storyTokens + recentTokens;
    const tokensSaved = fullPayloadTokens - optimizedTokens;
    const reductionPercent = fullPayloadTokens > 0
      ? Math.round((tokensSaved / fullPayloadTokens) * 100)
      : 0;

    // Update global metrics
    this.metrics.tokensSavedTotal += tokensSaved;
    this.metrics.apiCallsOptimized++;

    const metrics = {
      fullPayloadTokens,
      optimizedTokens,
      tokensSaved,
      reductionPercent,
      storyTokens,
      recentTokens,
      messagesInFull: allMessages.length,
      messagesInOptimized: recentMessages.length,
      processingTimeMs: Date.now() - startTime
    };

    if (CONFIG.enableMetrics) {
      console.log(`📦 [ConversationCache] ${modality.toUpperCase()} payload optimized:`, {
        ...metrics,
        modality,
        profileId: profileId?.slice(0, 8) + '...'
      });
    }

    return {
      ...optimizedPayload,
      metrics
    };
  }

  /**
   * Get Story So Far from cache or fetch from backend
   * @param {string} profileId - Profile ID
   * @param {string} modality - 'text' or 'voice'
   * @param {boolean} forceRefresh - Force refresh from backend
   */
  async getOrFetchStorySoFar(profileId, modality = CONFIG.defaultModality, forceRefresh = false) {
    const cacheKey = this._buildCacheKey(profileId, modality);

    // Check cache first (valid for 5 minutes)
    const cached = this.storyCache.get(cacheKey);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.story;
    }

    // Fetch from summarization service (pass modality for proper isolation)
    try {
      const story = await summarizationService.getStorySoFar(profileId, forceRefresh, modality);
      if (story) {
        this.storyCache.set(cacheKey, {
          story,
          modality,
          timestamp: Date.now()
        });
      }
      return story;
    } catch (error) {
      console.error(`[ConversationCache] Failed to fetch ${modality} story:`, error);
      return cached?.story || null; // Return stale cache if fetch fails
    }
  }

  /**
   * Check if summarization should be triggered for a modality
   * @param {string} profileId - Profile ID
   * @param {string} modality - 'text' or 'voice'
   */
  shouldTriggerSummarization(profileId, modality = CONFIG.defaultModality) {
    const messages = this.getMessages(profileId, modality);
    return summarizationService.shouldSummarize(messages);
  }

  /**
   * Trigger background summarization if needed for a modality
   * @param {string} profileId - Profile ID
   * @param {string} conversationId - Conversation ID
   * @param {string} modality - 'text' or 'voice'
   */
  async maybeTriggersummarization(profileId, conversationId, modality = CONFIG.defaultModality) {
    if (this.shouldTriggerSummarization(profileId, modality)) {
      const messages = this.getMessages(profileId, modality);
      const cacheKey = this._buildCacheKey(profileId, modality);

      // Non-blocking - runs in background
      summarizationService.triggerSummarization(conversationId, profileId, messages, modality)
        .then(result => {
          if (result?.storySoFar) {
            // Update our local story cache for this modality
            this.storyCache.set(cacheKey, {
              story: result.storySoFar,
              modality,
              timestamp: Date.now()
            });
            console.log(`🔄 [ConversationCache] ${modality.toUpperCase()} story cache updated after summarization`);
          }
        })
        .catch(err => {
          console.error(`[ConversationCache] Background ${modality} summarization failed:`, err);
        });
    }
  }

  /**
   * Build context injection for system prompt
   * Includes Story So Far + unresolved threads for a specific modality
   * @param {string} profileId - Profile ID
   * @param {string} modality - 'text' or 'voice'
   */
  async buildContextInjection(profileId, modality = CONFIG.defaultModality) {
    return summarizationService.buildContextInjection(profileId, modality);
  }

  /**
   * Process a message exchange (call after each user/AI exchange)
   * @param {string} profileId - Profile ID
   * @param {string} conversationId - Conversation ID
   * @param {Object} userMessage - User message object
   * @param {Object} aiResponse - AI response object
   * @param {string} modality - 'text' or 'voice'
   */
  async processExchange(profileId, conversationId, userMessage, aiResponse, modality = CONFIG.defaultModality) {
    // Add messages to cache with modality tagging
    this.addMessage(profileId, { sender: 'user', ...userMessage }, modality);
    this.addMessage(profileId, { sender: 'ai', ...aiResponse }, modality);

    // Check for summarization trigger
    const messages = this.getMessages(profileId, modality);
    if (messages.length % 5 === 0) { // Check every 5 messages
      await this.maybeTriggersummarization(profileId, conversationId, modality);
    }
  }

  /**
   * Clear cache for a profile (optionally for specific modality)
   * @param {string} profileId - Profile ID (optional - clears all if not provided)
   * @param {string} modality - 'text', 'voice', or null for both (default: null)
   */
  clearCache(profileId, modality = null) {
    if (profileId) {
      if (modality) {
        // Clear specific modality only
        const cacheKey = this._buildCacheKey(profileId, modality);
        this.messageCache.delete(cacheKey);
        this.storyCache.delete(cacheKey);
        console.log(`🧹 [ConversationCache] Cleared ${modality} cache for ${profileId?.slice(0, 8)}...`);
      } else {
        // Clear both modalities for this profile
        for (const mod of Object.values(MODALITIES)) {
          const cacheKey = this._buildCacheKey(profileId, mod);
          this.messageCache.delete(cacheKey);
          this.storyCache.delete(cacheKey);
        }
        console.log(`🧹 [ConversationCache] Cleared ALL modality caches for ${profileId?.slice(0, 8)}...`);
      }
    } else {
      this.messageCache.clear();
      this.storyCache.clear();
      console.log('🧹 [ConversationCache] Cleared entire cache');
    }
  }

  /**
   * Get global metrics
   */
  getMetrics() {
    // Count unique profiles (strip modality from keys)
    const uniqueProfiles = new Set();
    for (const key of this.messageCache.keys()) {
      const { profileId } = this._parseCacheKey(key);
      uniqueProfiles.add(profileId);
    }

    return {
      ...this.metrics,
      cachedProfiles: uniqueProfiles.size,
      cachedChannels: this.messageCache.size,  // Total channels (profile+modality combos)
      storyCacheSize: this.storyCache.size,
      averageTokensSaved: this.metrics.apiCallsOptimized > 0
        ? Math.round(this.metrics.tokensSavedTotal / this.metrics.apiCallsOptimized)
        : 0
    };
  }

  /**
   * Get detailed stats for a profile across all modalities
   * @param {string} profileId - Profile ID
   * @returns {Object} - Stats for both text and voice channels
   */
  getProfileStats(profileId) {
    const stats = {
      text: this._getModalityStats(profileId, MODALITIES.TEXT),
      voice: this._getModalityStats(profileId, MODALITIES.VOICE),
      combined: {
        totalMessages: 0,
        totalTokens: 0
      }
    };

    // Calculate combined stats
    stats.combined.totalMessages = stats.text.messageCount + stats.voice.messageCount;
    stats.combined.totalTokens = stats.text.totalTokens + stats.voice.totalTokens;

    return stats;
  }

  /**
   * Get stats for a specific modality
   * @private
   */
  _getModalityStats(profileId, modality) {
    const cacheKey = this._buildCacheKey(profileId, modality);
    const messages = this.messageCache.get(cacheKey) || [];
    const story = this.storyCache.get(cacheKey);

    return {
      modality,
      messageCount: messages.length,
      totalTokens: this.estimateMessagesTokens(messages),
      hasStorySoFar: !!story?.story,
      storyAge: story ? Date.now() - story.timestamp : null,
      storyTokens: story ? this.estimateTokens(story.story) : 0,
      wouldReduceBy: messages.length > CONFIG.recentMessageCount
        ? this.estimateMessagesTokens(messages.slice(0, -CONFIG.recentMessageCount))
        : 0
    };
  }

  /**
   * Get all active modalities for a profile
   * @param {string} profileId - Profile ID
   * @returns {string[]} - Array of active modalities
   */
  getActiveModalities(profileId) {
    const active = [];
    for (const modality of Object.values(MODALITIES)) {
      const messages = this.getMessages(profileId, modality);
      if (messages.length > 0) {
        active.push(modality);
      }
    }
    return active;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Convert optimized payload to conversation history format
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert optimized payload to the format expected by aiSoulPartnerService
 *
 * @param {Object} optimizedPayload - Result from buildOptimizedPayload
 * @returns {Array} - Conversation history array with story context prepended
 */
export function payloadToConversationHistory(optimizedPayload) {
  const history = [];
  const modality = optimizedPayload.modality || 'text';
  const modalityLabel = modality === 'voice' ? 'VOICE' : 'TEXT';

  // If we have a story, inject it as a "system" context at the start
  if (optimizedPayload.storySoFar && optimizedPayload.hasContext) {
    history.push({
      sender: 'system',
      text: `[${modalityLabel} CONVERSATION CONTEXT - THE STORY SO FAR]\n${optimizedPayload.storySoFar}\n[${optimizedPayload.messagesTruncated} earlier ${modality} messages summarized above]`,
      isContextInjection: true,
      modality
    });
  }

  // Add recent messages
  history.push(...optimizedPayload.recentMessages);

  return history;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const conversationCache = new ConversationCache();
export default conversationCache;
