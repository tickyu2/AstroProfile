/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SUMMARIZATION SERVICE - Context Compression for Luna
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages automatic conversation summarization:
 * - Detects when summarization is needed
 * - Triggers background summarization
 * - Retrieves "Story So Far" for context injection
 * - Tracks compression metrics
 *
 * @module summarizationService
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const THRESHOLDS = {
  messageCount: 20,      // Trigger after this many messages
  tokenEstimate: 8000,   // Or this many estimated tokens
  checkInterval: 5       // Check every N messages
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARIZATION SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class SummarizationService {
  constructor() {
    this.functions = null;
    this.cache = new Map(); // profileId -> storySoFar
    this.pendingSummarizations = new Set();
  }

  /**
   * Initialize the service
   */
  initialize() {
    if (!this.functions) {
      this.functions = getFunctions();
    }
  }

  /**
   * Estimate token count for a message
   */
  estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  /**
   * Check if summarization is needed based on conversation state
   */
  shouldSummarize(messages) {
    if (!messages || messages.length === 0) return false;

    // Check message count
    if (messages.length >= THRESHOLDS.messageCount) {
      return true;
    }

    // Check token estimate
    const totalTokens = messages.reduce((sum, msg) =>
      sum + this.estimateTokens(msg.content || msg.text), 0);

    if (totalTokens >= THRESHOLDS.tokenEstimate) {
      return true;
    }

    return false;
  }

  /**
   * Trigger summarization for a conversation
   * Runs in background, doesn't block chat
   */
  async triggerSummarization(conversationId, profileId, messages) {
    this.initialize();

    // Prevent duplicate summarizations
    const key = `${profileId}-${conversationId}`;
    if (this.pendingSummarizations.has(key)) {
      console.log('[SummarizationService] Summarization already pending');
      return null;
    }

    this.pendingSummarizations.add(key);

    try {
      console.log(`[SummarizationService] Triggering summarization for ${messages.length} messages`);

      const summarizeConversation = httpsCallable(this.functions, 'summarizeConversation');
      const result = await summarizeConversation({
        conversationId,
        profileId,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content || m.text
        }))
      });

      // Update cache
      if (result.data.storySoFar) {
        this.cache.set(profileId, {
          storySoFar: result.data.storySoFar,
          lastUpdated: new Date()
        });
      }

      console.log(`[SummarizationService] Summarization complete, saved ${result.data.tokensSaved} tokens`);
      return result.data;

    } catch (error) {
      console.error('[SummarizationService] Summarization failed:', error);
      return null;
    } finally {
      this.pendingSummarizations.delete(key);
    }
  }

  /**
   * Get "The Story So Far" for a profile
   * Used to inject context into Luna's system prompt
   */
  async getStorySoFar(profileId, forceRefresh = false) {
    this.initialize();

    // Check cache first
    if (!forceRefresh && this.cache.has(profileId)) {
      const cached = this.cache.get(profileId);
      // Cache valid for 5 minutes
      if (Date.now() - cached.lastUpdated < 5 * 60 * 1000) {
        return cached.storySoFar;
      }
    }

    try {
      const getStorySoFar = httpsCallable(this.functions, 'getStorySoFar');
      const result = await getStorySoFar({ profileId });

      if (result.data.hasContext) {
        this.cache.set(profileId, {
          storySoFar: result.data.storySoFar,
          unresolved: result.data.unresolved,
          lastUpdated: new Date()
        });
        return result.data.storySoFar;
      }

      return null;

    } catch (error) {
      console.error('[SummarizationService] Failed to get story:', error);
      return null;
    }
  }

  /**
   * Get full context object including story and unresolved items
   */
  async getFullContext(profileId) {
    this.initialize();

    try {
      const getStorySoFar = httpsCallable(this.functions, 'getStorySoFar');
      const result = await getStorySoFar({ profileId });

      if (result.data.hasContext) {
        return {
          hasContext: true,
          storySoFar: result.data.storySoFar,
          latestBeats: result.data.latestBeats || [],
          unresolved: result.data.unresolved || [],
          lastUpdated: result.data.lastUpdated
        };
      }

      return { hasContext: false };

    } catch (error) {
      console.error('[SummarizationService] Failed to get context:', error);
      return { hasContext: false };
    }
  }

  /**
   * Build context injection string for system prompt
   */
  async buildContextInjection(profileId) {
    const context = await this.getFullContext(profileId);

    if (!context.hasContext || !context.storySoFar) {
      return '';
    }

    let injection = `\n\n## THE STORY SO FAR\n${context.storySoFar}`;

    if (context.unresolved && context.unresolved.length > 0) {
      injection += `\n\n## OPEN THREADS TO FOLLOW UP ON\n`;
      context.unresolved.forEach(item => {
        injection += `- ${item}\n`;
      });
    }

    if (context.latestBeats && context.latestBeats.length > 0) {
      injection += `\n\n## MOST RECENT DEVELOPMENTS\n`;
      context.latestBeats.forEach(beat => {
        injection += `- [${beat.type}] ${beat.description}\n`;
      });
    }

    return injection;
  }

  /**
   * Process a new message and check if summarization needed
   * Call this after each message exchange
   */
  async processMessage(conversationId, profileId, allMessages) {
    // Only check periodically
    if (allMessages.length % THRESHOLDS.checkInterval !== 0) {
      return;
    }

    if (this.shouldSummarize(allMessages)) {
      // Trigger in background (don't await)
      this.triggerSummarization(conversationId, profileId, allMessages)
        .catch(err => console.error('[SummarizationService] Background summarization error:', err));
    }
  }

  /**
   * Get summary history for viewing
   */
  async getSummaryHistory(profileId, limit = 10) {
    this.initialize();

    try {
      const getSummaryHistory = httpsCallable(this.functions, 'getSummaryHistory');
      const result = await getSummaryHistory({ profileId, limit });
      return result.data.summaries || [];

    } catch (error) {
      console.error('[SummarizationService] Failed to get history:', error);
      return [];
    }
  }

  /**
   * Force a full refresh of summaries
   */
  async refreshSummary(profileId, conversationId) {
    this.initialize();

    try {
      const refreshSummary = httpsCallable(this.functions, 'refreshSummary');
      const result = await refreshSummary({ profileId, conversationId });

      // Clear cache
      this.cache.delete(profileId);

      return result.data;

    } catch (error) {
      console.error('[SummarizationService] Refresh failed:', error);
      return null;
    }
  }

  /**
   * Clear cache for a profile
   */
  clearCache(profileId) {
    if (profileId) {
      this.cache.delete(profileId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get compression stats
   */
  getStats() {
    return {
      cachedProfiles: this.cache.size,
      pendingSummarizations: this.pendingSummarizations.size
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const summarizationService = new SummarizationService();
export default summarizationService;
