/**
 * ============================================================================
 * TIMELINE CONSOLE SERVICE
 * ============================================================================
 * Frontend service for Timeline Console Firebase functions
 *
 * Provides:
 * - Timeline navigation data (overview, stats, memories)
 * - AI-generated period summaries
 * - Cultural context retrieval
 * - Memory trigger tracking
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

class TimelineService {
  constructor() {
    this.functions = null;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Initialize Firebase Functions
   */
  initialize() {
    if (!this.functions) {
      this.functions = getFunctions();
    }
    return this.functions;
  }

  /**
   * Get cached data or null if expired
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Set cache data
   */
  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // ============================================================================
  // TIMELINE NAVIGATION
  // ============================================================================

  /**
   * Get timeline overview (all years with memory counts)
   */
  async getTimelineOverview(userId, profileId) {
    const cacheKey = `overview:${userId}:${profileId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    this.initialize();
    const fn = httpsCallable(this.functions, 'getTimelineOverview');
    const result = await fn({ userId, profileId });

    if (result.data.success) {
      this.setCache(cacheKey, result.data);
    }
    return result.data;
  }

  /**
   * Get timeline statistics for dashboard
   */
  async getTimelineStats(userId, profileId) {
    const cacheKey = `stats:${userId}:${profileId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    this.initialize();
    const fn = httpsCallable(this.functions, 'getTimelineStats');
    const result = await fn({ userId, profileId });

    if (result.data.success) {
      this.setCache(cacheKey, result.data);
    }
    return result.data;
  }

  /**
   * Get monthly memory counts for a year (heatmap)
   */
  async getMonthlyMemoryCounts(userId, profileId, year) {
    const cacheKey = `monthly:${userId}:${profileId}:${year}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    this.initialize();
    const fn = httpsCallable(this.functions, 'getMonthlyMemoryCounts');
    const result = await fn({ userId, profileId, year });

    if (result.data.success) {
      this.setCache(cacheKey, result.data);
    }
    return result.data;
  }

  /**
   * Get memories for a specific day
   */
  async getMemoriesForDay(userId, profileId, date) {
    this.initialize();
    const fn = httpsCallable(this.functions, 'getMemoriesForDay');
    const result = await fn({ userId, profileId, date });
    return result.data;
  }

  /**
   * Find memory gaps (sparse periods)
   */
  async findMemoryGaps(userId, profileId, threshold = 10) {
    this.initialize();
    const fn = httpsCallable(this.functions, 'findMemoryGaps');
    const result = await fn({ userId, profileId, threshold });
    return result.data;
  }

  /**
   * Search timeline by keyword
   */
  async searchTimeline(userId, profileId, searchTerm, limit = 20) {
    this.initialize();
    const fn = httpsCallable(this.functions, 'searchTimeline');
    const result = await fn({ userId, profileId, searchTerm, limit });
    return result.data;
  }

  // ============================================================================
  // SUMMARIES
  // ============================================================================

  /**
   * Get or generate period summary
   */
  async getTimelineSummary(userId, profileId, periodType, periodStart, periodEnd, forceRegenerate = false) {
    const cacheKey = `summary:${userId}:${profileId}:${periodType}:${periodStart}`;

    if (!forceRegenerate) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    this.initialize();
    const fn = httpsCallable(this.functions, 'getTimelineSummary');
    const result = await fn({ userId, profileId, periodType, periodStart, periodEnd, forceRegenerate });

    if (result.data.success) {
      this.setCache(cacheKey, result.data);
    }
    return result.data;
  }

  /**
   * Get all summaries for a user
   */
  async getAllTimelineSummaries(userId, profileId, periodType = null) {
    this.initialize();
    const fn = httpsCallable(this.functions, 'getAllTimelineSummaries');
    const result = await fn({ userId, profileId, periodType });
    return result.data;
  }

  /**
   * Generate all summaries (batch)
   */
  async generateAllTimelineSummaries(userId, profileId, forceRegenerate = false) {
    this.initialize();
    const fn = httpsCallable(this.functions, 'generateAllTimelineSummaries');
    const result = await fn({ userId, profileId, forceRegenerate });
    return result.data;
  }

  // ============================================================================
  // CULTURAL CONTEXT
  // ============================================================================

  /**
   * Get cultural context for a year/month
   */
  async getCulturalContext(year, options = {}) {
    const cacheKey = `culture:${year}:${options.month || 'all'}:${options.category || 'all'}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    this.initialize();
    const fn = httpsCallable(this.functions, 'getTimelineCulturalContext');
    const result = await fn({ year, ...options });

    if (result.data.success) {
      this.setCache(cacheKey, result.data);
    }
    return result.data;
  }

  /**
   * Search cultural context
   */
  async searchCulturalContext(searchTerm, options = {}) {
    this.initialize();
    const fn = httpsCallable(this.functions, 'searchCulturalContext');
    const result = await fn({ searchTerm, ...options });
    return result.data;
  }

  // ============================================================================
  // MEMORY TRIGGERS
  // ============================================================================

  /**
   * Record a memory trigger
   */
  async recordMemoryTrigger(triggerData) {
    this.initialize();
    const fn = httpsCallable(this.functions, 'recordMemoryTrigger');
    const result = await fn(triggerData);
    return result.data;
  }

  /**
   * Get trigger analytics
   */
  async getTriggerAnalytics(userId, profileId) {
    this.initialize();
    const fn = httpsCallable(this.functions, 'getTriggerAnalytics');
    const result = await fn({ userId, profileId });
    return result.data;
  }

  // ============================================================================
  // UTILITY
  // ============================================================================

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get period date range
   */
  getPeriodRange(periodType, year, month = 1, quarter = 1) {
    switch (periodType) {
      case 'decade':
        const decadeStart = Math.floor(year / 10) * 10;
        return {
          start: `${decadeStart}-01-01`,
          end: `${decadeStart + 9}-12-31`,
          label: `${decadeStart}s`
        };
      case '5year':
        const fiveYearStart = Math.floor(year / 5) * 5;
        return {
          start: `${fiveYearStart}-01-01`,
          end: `${fiveYearStart + 4}-12-31`,
          label: `${fiveYearStart}-${fiveYearStart + 4}`
        };
      case 'year':
        return {
          start: `${year}-01-01`,
          end: `${year}-12-31`,
          label: `${year}`
        };
      case 'quarter':
        const qStart = (quarter - 1) * 3 + 1;
        const qEnd = quarter * 3;
        const lastDay = new Date(year, qEnd, 0).getDate();
        return {
          start: `${year}-${String(qStart).padStart(2, '0')}-01`,
          end: `${year}-${String(qEnd).padStart(2, '0')}-${lastDay}`,
          label: `Q${quarter} ${year}`
        };
      case 'month':
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        return {
          start: `${year}-${String(month).padStart(2, '0')}-01`,
          end: `${year}-${String(month).padStart(2, '0')}-${lastDayOfMonth}`,
          label: new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
      default:
        return { start: `${year}-01-01`, end: `${year}-12-31`, label: `${year}` };
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateStr, format = 'medium') {
    const date = new Date(dateStr);
    const options = {
      short: { month: 'short', day: 'numeric' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };
    return date.toLocaleDateString('en-US', options[format] || options.medium);
  }

  /**
   * Get happiness color based on score (1-5)
   */
  getHappinessColor(score) {
    if (score >= 4.5) return '#10b981'; // Emerald
    if (score >= 4.0) return '#34d399'; // Green
    if (score >= 3.5) return '#fbbf24'; // Amber
    if (score >= 3.0) return '#fb923c'; // Orange
    if (score >= 2.5) return '#f87171'; // Red
    return '#ef4444'; // Deep red
  }

  /**
   * Get category icon
   */
  getCategoryIcon(category) {
    const icons = {
      movies: '🎬',
      music: '🎵',
      news: '📰',
      tv: '📺',
      tech: '💻',
      culture: '🎭',
      sports: '⚽',
      books: '📚',
      games: '🎮'
    };
    return icons[category] || '📌';
  }

  // ============================================================================
  // CONVERSATION TO MEMORY
  // ============================================================================

  /**
   * Save conversation message to timeline as a memory
   * @param {string} userId - Firebase user ID
   * @param {string} profileId - Profile ID
   * @param {Object} message - The message to save
   * @param {Object} context - Additional context (userMessage, mode, etc.)
   */
  async saveConversationToTimeline(userId, profileId, message, context = {}) {
    if (!userId || !profileId || !message?.text) {
      return { success: false, error: 'Missing required parameters' };
    }

    this.initialize();

    try {
      // Use the storeLifeMemory function from memory architecture
      const fn = httpsCallable(this.functions, 'storeLifeMemory');

      // Build the memory content with context (truncate to avoid embedding limits)
      const maxLength = 4000; // Safe limit for embedding
      const truncate = (text) => text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

      const rawContent = context.userQuestion
        ? `**Question:** ${context.userQuestion}\n\n**Insight:** ${message.text}`
        : message.text;

      const content = truncate(rawContent) + `\n\n[Mode: ${context.mode || 'DIALOGUE'}] [Saved: ${new Date().toLocaleDateString()}]`;

      // storeLifeMemory expects: userId, profileId, content, chapter, age, importance, emotion, people, contextHints
      const result = await fn({
        userId,
        profileId,
        content,
        chapter: 'adult', // Valid chapter from LIFE_CHAPTERS
        importance: context.importance || 0.7,
        emotion: context.mode === 'WITNESS' ? 'reflective' : 'curious',
        contextHints: {
          source: 'ai_soulpartner_conversation',
          userQuestion: context.userQuestion || null,
          memoryDate: context.memoryDate || new Date().toISOString().split('T')[0]
        }
      });

      if (result.data?.success) {
        // Clear relevant caches
        this.cache.delete(`overview:${userId}:${profileId}`);
        this.cache.delete(`stats:${userId}:${profileId}`);
        console.log('📅 Conversation saved to timeline:', result.data.id);
      }

      return result.data;
    } catch (error) {
      console.error('[Timeline] Error saving conversation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Parse conversation exchange for timeline storage
   * Extracts key information from user question + AI response
   */
  parseConversationForTimeline(userMessage, aiMessage, profileName = 'User') {
    // Extract potential date references from conversation
    const datePatterns = [
      /(\d{4})/g, // Year
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{1,2})?,?\s*(\d{4})?/gi,
      /(\d{1,2})\s*(years?|months?|weeks?|days?)\s*ago/gi
    ];

    let extractedYear = null;
    const combinedText = `${userMessage} ${aiMessage}`;

    for (const pattern of datePatterns) {
      const matches = combinedText.match(pattern);
      if (matches) {
        // Try to extract a year
        const yearMatch = matches.find(m => /^\d{4}$/.test(m) && parseInt(m) > 1900 && parseInt(m) <= new Date().getFullYear());
        if (yearMatch) {
          extractedYear = parseInt(yearMatch);
          break;
        }
      }
    }

    // Generate a title from the first line of user message
    const title = userMessage.split('\n')[0].slice(0, 80);

    return {
      title,
      content: aiMessage,
      userQuestion: userMessage,
      extractedYear,
      memoryDate: extractedYear ? `${extractedYear}-06-15` : new Date().toISOString().split('T')[0]
    };
  }
}

// Export singleton instance
export const timelineService = new TimelineService();
export default timelineService;
