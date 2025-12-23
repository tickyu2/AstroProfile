/**
 * ============================================================================
 * BIOGRAPHY SERVICE
 * ============================================================================
 * Frontend service for intelligent biographical curation
 *
 * Features:
 * - Life event extraction from messages
 * - Biography timeline retrieval
 * - Neural pathways (gaps to explore)
 * - Life chapter organization
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

class BiographyService {
  constructor() {
    this.functions = null;
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutes
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
   * Get cached data
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
   * Set cache
   */
  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache for a profile
   */
  clearCache(profileId) {
    for (const key of this.cache.keys()) {
      if (key.includes(profileId)) {
        this.cache.delete(key);
      }
    }
  }

  // ============================================================================
  // LIFE EVENT EXTRACTION
  // ============================================================================

  /**
   * Extract life events from a message
   * Call this when user sends a message to automatically detect biographical info
   *
   * @param {Object} params
   * @param {string} params.message - The user's message
   * @param {string} params.userId - User ID
   * @param {string} params.profileId - Profile ID
   * @param {string} params.userName - User's name (for context)
   * @param {string} params.birthDate - User's birth date (for age calculation)
   * @param {string} params.conversationId - Conversation ID (for source tracking)
   * @param {string} params.messageId - Message ID (for source tracking)
   * @returns {Promise<Object>} Extracted events
   */
  async extractLifeEvents({ message, userId, profileId, userName, birthDate, conversationId, messageId }) {
    try {
      this.initialize();
      const fn = httpsCallable(this.functions, 'extractLifeEvents');
      const result = await fn({
        message,
        userId,
        profileId,
        userName,
        birthDate,
        conversationId,
        messageId
      });

      // Clear cache if events were stored
      if (result.data.has_life_events) {
        this.clearCache(profileId);
      }

      return result.data;
    } catch (error) {
      console.error('[Biography] Extract error:', error);
      return { success: false, has_life_events: false, error: error.message };
    }
  }

  // ============================================================================
  // BIOGRAPHY TIMELINE
  // ============================================================================

  /**
   * Get full biography timeline (curated life events)
   */
  async getBiographyTimeline(userId, profileId) {
    const cacheKey = `timeline:${userId}:${profileId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      this.initialize();
      const fn = httpsCallable(this.functions, 'getBiographyTimeline');
      const result = await fn({ userId, profileId });

      if (result.data.success) {
        this.setCache(cacheKey, result.data);
      }

      return result.data;
    } catch (error) {
      console.error('[Biography] Timeline error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get biography statistics and coverage
   */
  async getBiographyStats(userId, profileId) {
    const cacheKey = `stats:${userId}:${profileId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      this.initialize();
      const fn = httpsCallable(this.functions, 'getBiographyStats');
      const result = await fn({ userId, profileId });

      if (result.data.success) {
        this.setCache(cacheKey, result.data);
      }

      return result.data;
    } catch (error) {
      console.error('[Biography] Stats error:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // NEURAL PATHWAYS
  // ============================================================================

  /**
   * Get neural pathways (questions to explore)
   * These are gaps in the life story that can be explored
   */
  async getNeuralPathways(userId, profileId, limit = 10) {
    try {
      this.initialize();
      const fn = httpsCallable(this.functions, 'getNeuralPathways');
      const result = await fn({ userId, profileId, limit });
      return result.data;
    } catch (error) {
      console.error('[Biography] Neural pathways error:', error);
      return { success: false, pathways: [], error: error.message };
    }
  }

  /**
   * Mark a neural pathway as resolved
   */
  async resolveNeuralPathway(userId, profileId, eventId, question) {
    try {
      this.initialize();
      const fn = httpsCallable(this.functions, 'resolveNeuralPathway');
      const result = await fn({ userId, profileId, eventId, question });

      // Clear cache
      this.clearCache(profileId);

      return result.data;
    } catch (error) {
      console.error('[Biography] Resolve pathway error:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Get life chapter name from ID
   */
  getChapterName(chapterId) {
    const chapters = {
      childhood: 'Childhood',
      adolescence: 'Adolescence',
      early_adulthood: 'Early Adulthood',
      midlife: 'Midlife',
      mature_adulthood: 'Mature Adulthood',
      elder_years: 'Elder Years'
    };
    return chapters[chapterId] || chapterId;
  }

  /**
   * Get event type icon
   */
  getEventTypeIcon(eventType) {
    const icons = {
      education: '🎓',
      career: '💼',
      relocation: '🏠',
      relationship: '💕',
      family: '👨‍👩‍👧‍👦',
      health: '🏥',
      achievement: '🏆',
      travel: '✈️',
      loss: '🕯️',
      milestone: '🎉',
      spiritual: '🙏',
      creative: '🎨',
      financial: '💰'
    };
    return icons[eventType] || '📌';
  }

  /**
   * Get event type color
   */
  getEventTypeColor(eventType) {
    const colors = {
      education: '#8B5CF6', // purple
      career: '#3B82F6', // blue
      relocation: '#10B981', // green
      relationship: '#EC4899', // pink
      family: '#F59E0B', // amber
      health: '#EF4444', // red
      achievement: '#F97316', // orange
      travel: '#06B6D4', // cyan
      loss: '#6B7280', // gray
      milestone: '#FBBF24', // yellow
      spiritual: '#A855F7', // violet
      creative: '#D946EF', // fuchsia
      financial: '#22C55E' // emerald
    };
    return colors[eventType] || '#64748B';
  }

  /**
   * Format date precision display
   */
  formatDateDisplay(date) {
    if (!date) return 'Unknown date';

    if (date.precision === 'exact' && date.year && date.month && date.day) {
      return new Date(date.year, date.month - 1, date.day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    if (date.year && date.month) {
      return new Date(date.year, date.month - 1).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }

    if (date.year) {
      return date.year.toString();
    }

    if (date.decade) {
      return `${date.decade}s`;
    }

    return 'Unknown date';
  }

  /**
   * Calculate years span from events
   */
  calculateYearsSpan(events) {
    const years = events
      .filter(e => e.date?.year)
      .map(e => e.date.year);

    if (years.length === 0) return null;

    const min = Math.min(...years);
    const max = Math.max(...years);

    return { earliest: min, latest: max, span: max - min };
  }
}

// Export singleton
export const biographyService = new BiographyService();
