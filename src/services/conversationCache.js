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
  enableMetrics: true
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION CACHE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class ConversationCache {
  constructor() {
    // Local message storage per profile
    this.messageCache = new Map(); // profileId -> messages[]

    // Story So Far cache
    this.storyCache = new Map(); // profileId -> { story, timestamp }

    // Metrics tracking
    this.metrics = {
      totalMessagesProcessed: 0,
      tokensSavedTotal: 0,
      apiCallsOptimized: 0
    };
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
   * Get all cached messages for a profile
   */
  getMessages(profileId) {
    return this.messageCache.get(profileId) || [];
  }

  /**
   * Add a message to the cache
   */
  addMessage(profileId, message) {
    if (!this.messageCache.has(profileId)) {
      this.messageCache.set(profileId, []);
    }
    this.messageCache.get(profileId).push({
      ...message,
      cachedAt: Date.now()
    });
    this.metrics.totalMessagesProcessed++;
  }

  /**
   * Set the full message history (e.g., on component mount)
   */
  setMessages(profileId, messages) {
    this.messageCache.set(profileId, messages.map(msg => ({
      ...msg,
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
   * @returns {Promise<Object>} - Optimized payload { storySoFar, recentMessages, metrics }
   */
  async buildOptimizedPayload(profileId, conversationId, options = {}) {
    const {
      recentCount = CONFIG.recentMessageCount,
      includeStory = true,
      forceRefresh = false
    } = options;

    const allMessages = this.getMessages(profileId);
    const startTime = Date.now();

    // Calculate what we WOULD have sent (for metrics)
    const fullPayloadTokens = this.estimateMessagesTokens(allMessages);

    // Get "Story So Far" if we have enough messages
    let storySoFar = null;
    let storyTokens = 0;

    if (includeStory && allMessages.length > recentCount) {
      storySoFar = await this.getOrFetchStorySoFar(profileId, forceRefresh);
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
        reactions: msg.reactions
      })),
      hasContext: !!storySoFar,
      messagesTruncated: allMessages.length - recentMessages.length
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
      console.log('📦 [ConversationCache] Payload optimized:', {
        ...metrics,
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
   */
  async getOrFetchStorySoFar(profileId, forceRefresh = false) {
    // Check cache first (valid for 5 minutes)
    const cached = this.storyCache.get(profileId);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.story;
    }

    // Fetch from summarization service
    try {
      const story = await summarizationService.getStorySoFar(profileId, forceRefresh);
      if (story) {
        this.storyCache.set(profileId, {
          story,
          timestamp: Date.now()
        });
      }
      return story;
    } catch (error) {
      console.error('[ConversationCache] Failed to fetch story:', error);
      return cached?.story || null; // Return stale cache if fetch fails
    }
  }

  /**
   * Check if summarization should be triggered
   */
  shouldTriggerSummarization(profileId) {
    const messages = this.getMessages(profileId);
    return summarizationService.shouldSummarize(messages);
  }

  /**
   * Trigger background summarization if needed
   */
  async maybeTriggersummarization(profileId, conversationId) {
    if (this.shouldTriggerSummarization(profileId)) {
      const messages = this.getMessages(profileId);
      // Non-blocking - runs in background
      summarizationService.triggerSummarization(conversationId, profileId, messages)
        .then(result => {
          if (result?.storySoFar) {
            // Update our local story cache
            this.storyCache.set(profileId, {
              story: result.storySoFar,
              timestamp: Date.now()
            });
            console.log('🔄 [ConversationCache] Story cache updated after summarization');
          }
        })
        .catch(err => {
          console.error('[ConversationCache] Background summarization failed:', err);
        });
    }
  }

  /**
   * Build context injection for system prompt
   * Includes Story So Far + unresolved threads
   */
  async buildContextInjection(profileId) {
    return summarizationService.buildContextInjection(profileId);
  }

  /**
   * Process a message exchange (call after each user/AI exchange)
   */
  async processExchange(profileId, conversationId, userMessage, aiResponse) {
    // Add messages to cache
    this.addMessage(profileId, { sender: 'user', ...userMessage });
    this.addMessage(profileId, { sender: 'ai', ...aiResponse });

    // Check for summarization trigger
    const messages = this.getMessages(profileId);
    if (messages.length % 5 === 0) { // Check every 5 messages
      await this.maybeTriggersummarization(profileId, conversationId);
    }
  }

  /**
   * Clear cache for a profile
   */
  clearCache(profileId) {
    if (profileId) {
      this.messageCache.delete(profileId);
      this.storyCache.delete(profileId);
    } else {
      this.messageCache.clear();
      this.storyCache.clear();
    }
  }

  /**
   * Get global metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cachedProfiles: this.messageCache.size,
      storyCacheSize: this.storyCache.size,
      averageTokensSaved: this.metrics.apiCallsOptimized > 0
        ? Math.round(this.metrics.tokensSavedTotal / this.metrics.apiCallsOptimized)
        : 0
    };
  }

  /**
   * Get detailed stats for a profile
   */
  getProfileStats(profileId) {
    const messages = this.getMessages(profileId);
    const story = this.storyCache.get(profileId);

    return {
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

  // If we have a story, inject it as a "system" context at the start
  if (optimizedPayload.storySoFar && optimizedPayload.hasContext) {
    history.push({
      sender: 'system',
      text: `[CONVERSATION CONTEXT - THE STORY SO FAR]\n${optimizedPayload.storySoFar}\n[${optimizedPayload.messagesTruncated} earlier messages summarized above]`,
      isContextInjection: true
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
