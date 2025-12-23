/**
 * Usage Service - Cost Control & Rate Limiting
 *
 * Tracks API usage to prevent runaway costs and ensure fair usage.
 * Integrates with Luna's energy system for natural rate limiting UX.
 *
 * Features:
 * - Message rate limiting (per minute, per day)
 * - Token usage tracking
 * - Budget alerts
 * - Usage analytics
 *
 * Part of GENESIS Phase 6 - Production Hardening
 * December 19, 2024
 */

import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMITS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const RATE_LIMITS = {
  // Free tier limits
  free: {
    messagesPerMinute: 5,
    messagesPerHour: 30,
    messagesPerDay: 100,
    tokensPerDay: 50000,
    voiceMinutesPerDay: 10
  },

  // Premium tier (future)
  premium: {
    messagesPerMinute: 15,
    messagesPerHour: 100,
    messagesPerDay: 500,
    tokensPerDay: 250000,
    voiceMinutesPerDay: 60
  },

  // Unlimited tier (admin/testing)
  unlimited: {
    messagesPerMinute: 999,
    messagesPerHour: 9999,
    messagesPerDay: 99999,
    tokensPerDay: 9999999,
    voiceMinutesPerDay: 9999
  }
};

// Cost estimates (for budget tracking)
export const COST_ESTIMATES = {
  // Gemini 2.5 Flash pricing (approximate)
  inputTokenPer1K: 0.00035,
  outputTokenPer1K: 0.00105,

  // Average message costs
  avgInputTokens: 2000,   // Context + message
  avgOutputTokens: 500,   // Luna's response

  // Calculated per-message cost
  get avgMessageCost() {
    return (this.avgInputTokens / 1000 * this.inputTokenPer1K) +
           (this.avgOutputTokens / 1000 * this.outputTokenPer1K);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// USAGE SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class UsageService {
  constructor() {
    // Local cache for quick checks
    this.usageCache = new Map();
    this.cacheExpiry = 60000; // 1 minute cache

    // Current user context
    this.userId = null;
    this.userTier = 'free';

    // Callbacks
    this.onRateLimitHit = null;
    this.onBudgetWarning = null;
    this.onUsageUpdate = null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Initialize usage service for a user
   * @param {string} userId - Firebase user ID
   */
  async initialize(userId) {
    this.userId = userId;

    // Load user tier
    await this.loadUserTier();

    // Initialize today's usage doc if needed
    await this.ensureUsageDoc();

    console.log('[UsageService] Initialized for user:', userId, 'tier:', this.userTier);
  }

  /**
   * Load user's subscription tier
   */
  async loadUserTier() {
    if (!this.userId) return;

    try {
      const userRef = doc(db, 'users', this.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        this.userTier = userSnap.data().subscriptionTier || 'free';
      }
    } catch (error) {
      console.warn('[UsageService] Failed to load user tier:', error);
      this.userTier = 'free';
    }
  }

  /**
   * Ensure usage document exists for today
   */
  async ensureUsageDoc() {
    if (!this.userId) return;

    const today = this.getTodayKey();
    const usageRef = doc(db, 'users', this.userId, 'usage', today);

    try {
      const usageSnap = await getDoc(usageRef);

      if (!usageSnap.exists()) {
        await setDoc(usageRef, {
          date: today,
          messages: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          voiceMinutes: 0,
          estimatedCost: 0,
          createdAt: serverTimestamp(),
          lastMessageAt: null,
          // Hourly breakdown for rate limiting
          hourlyMessages: {},
          // Per-profile breakdown
          profileUsage: {}
        });
      }
    } catch (error) {
      console.error('[UsageService] Failed to ensure usage doc:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RATE LIMITING
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Check if user can send a message (rate limit check)
   * @param {string} profileId - Optional profile ID for per-profile limits
   * @returns {Object} - { allowed: boolean, reason?: string, retryAfter?: number }
   */
  async checkRateLimit(profileId = null) {
    if (!this.userId) {
      return { allowed: false, reason: 'Not authenticated' };
    }

    const limits = RATE_LIMITS[this.userTier] || RATE_LIMITS.free;
    const usage = await this.getTodayUsage();

    if (!usage) {
      return { allowed: true }; // Can't check, allow (fail open)
    }

    // Check daily limit
    if (usage.messages >= limits.messagesPerDay) {
      return {
        allowed: false,
        reason: 'daily_limit',
        message: `You've reached your daily limit of ${limits.messagesPerDay} messages. Luna will be refreshed tomorrow!`,
        retryAfter: this.getSecondsUntilMidnight()
      };
    }

    // Check hourly limit
    const currentHour = new Date().getHours().toString();
    const hourlyMessages = usage.hourlyMessages?.[currentHour] || 0;

    if (hourlyMessages >= limits.messagesPerHour) {
      return {
        allowed: false,
        reason: 'hourly_limit',
        message: `You've sent ${limits.messagesPerHour} messages this hour. Let's take a short break!`,
        retryAfter: this.getSecondsUntilNextHour()
      };
    }

    // Check per-minute limit (using recent timestamps)
    const recentMessages = await this.getRecentMessageCount(60); // Last 60 seconds

    if (recentMessages >= limits.messagesPerMinute) {
      return {
        allowed: false,
        reason: 'minute_limit',
        message: 'Please slow down a bit. Luna needs a moment to catch her breath!',
        retryAfter: 10 // Suggest waiting 10 seconds
      };
    }

    // Check token budget
    if (usage.totalTokens >= limits.tokensPerDay) {
      return {
        allowed: false,
        reason: 'token_limit',
        message: 'Daily token budget reached. Luna will be back at full capacity tomorrow!',
        retryAfter: this.getSecondsUntilMidnight()
      };
    }

    return { allowed: true };
  }

  /**
   * Get recent message count within time window
   * @param {number} seconds - Time window in seconds
   */
  async getRecentMessageCount(seconds) {
    if (!this.userId) return 0;

    const cutoff = new Date(Date.now() - seconds * 1000);

    try {
      const messagesRef = collection(db, 'users', this.userId, 'usage_events');
      const q = query(
        messagesRef,
        where('type', '==', 'message'),
        where('timestamp', '>', cutoff),
        orderBy('timestamp', 'desc'),
        limit(20) // We only need to count up to the limit
      );

      const snapshot = await getDocs(q);
      return snapshot.size;

    } catch (error) {
      // Index might not exist, fall back to cache
      return this.usageCache.get('recentMessages') || 0;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // USAGE RECORDING
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Record a message being sent (call BEFORE sending to API)
   * @param {Object} options - Message metadata
   * @returns {Object} - { allowed: boolean, usageId?: string }
   */
  async recordMessageStart(options = {}) {
    const { profileId = null, thinkingLevel = 'low' } = options;

    // Check rate limits first
    const rateCheck = await this.checkRateLimit(profileId);

    if (!rateCheck.allowed) {
      this.onRateLimitHit?.(rateCheck);
      return { allowed: false, ...rateCheck };
    }

    // Record the usage event
    const usageId = await this.recordUsageEvent({
      type: 'message_start',
      profileId,
      thinkingLevel,
      timestamp: new Date()
    });

    return { allowed: true, usageId };
  }

  /**
   * Complete a message recording (call AFTER receiving response)
   * @param {string} usageId - Usage event ID from recordMessageStart
   * @param {Object} data - Response data including token counts
   */
  async recordMessageComplete(usageId, data = {}) {
    const {
      inputTokens = COST_ESTIMATES.avgInputTokens,
      outputTokens = COST_ESTIMATES.avgOutputTokens,
      profileId = null,
      success = true
    } = data;

    const totalTokens = inputTokens + outputTokens;
    const estimatedCost =
      (inputTokens / 1000 * COST_ESTIMATES.inputTokenPer1K) +
      (outputTokens / 1000 * COST_ESTIMATES.outputTokenPer1K);

    // Update today's usage
    await this.updateDailyUsage({
      messages: 1,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost,
      profileId
    });

    // Record completion event
    await this.recordUsageEvent({
      type: 'message_complete',
      usageId,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost,
      success,
      timestamp: new Date()
    });

    // Check budget warnings
    await this.checkBudgetWarnings();

    // Notify listeners
    this.onUsageUpdate?.({
      type: 'message',
      tokens: totalTokens,
      cost: estimatedCost
    });

    return { success: true, tokens: totalTokens, cost: estimatedCost };
  }

  /**
   * Record voice usage
   * @param {number} durationSeconds - Voice session duration
   */
  async recordVoiceUsage(durationSeconds) {
    const minutes = durationSeconds / 60;

    await this.updateDailyUsage({
      voiceMinutes: minutes
    });

    // Check voice limit
    const usage = await this.getTodayUsage();
    const limits = RATE_LIMITS[this.userTier];

    if (usage.voiceMinutes >= limits.voiceMinutesPerDay * 0.8) {
      this.onBudgetWarning?.({
        type: 'voice_limit_warning',
        used: usage.voiceMinutes,
        limit: limits.voiceMinutesPerDay,
        message: `You've used ${Math.round(usage.voiceMinutes)} of ${limits.voiceMinutesPerDay} voice minutes today.`
      });
    }
  }

  /**
   * Update daily usage document
   */
  async updateDailyUsage(updates) {
    if (!this.userId) return;

    const today = this.getTodayKey();
    const usageRef = doc(db, 'users', this.userId, 'usage', today);
    const currentHour = new Date().getHours().toString();

    try {
      const updateData = {
        lastMessageAt: serverTimestamp()
      };

      // Increment counters
      if (updates.messages) {
        updateData.messages = increment(updates.messages);
        updateData[`hourlyMessages.${currentHour}`] = increment(updates.messages);
      }
      if (updates.inputTokens) {
        updateData.inputTokens = increment(updates.inputTokens);
      }
      if (updates.outputTokens) {
        updateData.outputTokens = increment(updates.outputTokens);
      }
      if (updates.totalTokens) {
        updateData.totalTokens = increment(updates.totalTokens);
      }
      if (updates.estimatedCost) {
        updateData.estimatedCost = increment(updates.estimatedCost);
      }
      if (updates.voiceMinutes) {
        updateData.voiceMinutes = increment(updates.voiceMinutes);
      }

      // Per-profile tracking
      if (updates.profileId) {
        updateData[`profileUsage.${updates.profileId}.messages`] = increment(1);
        updateData[`profileUsage.${updates.profileId}.tokens`] = increment(updates.totalTokens || 0);
      }

      await updateDoc(usageRef, updateData);

      // Invalidate cache
      this.usageCache.delete(today);

    } catch (error) {
      console.error('[UsageService] Failed to update daily usage:', error);
    }
  }

  /**
   * Record a usage event (for rate limiting and analytics)
   */
  async recordUsageEvent(event) {
    if (!this.userId) return null;

    try {
      const eventsRef = collection(db, 'users', this.userId, 'usage_events');
      const eventDoc = doc(eventsRef);

      await setDoc(eventDoc, {
        ...event,
        userId: this.userId,
        createdAt: serverTimestamp()
      });

      return eventDoc.id;

    } catch (error) {
      console.error('[UsageService] Failed to record usage event:', error);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // USAGE RETRIEVAL
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get today's usage data
   */
  async getTodayUsage() {
    if (!this.userId) return null;

    const today = this.getTodayKey();

    // Check cache first
    const cached = this.usageCache.get(today);
    if (cached && cached.timestamp > Date.now() - this.cacheExpiry) {
      return cached.data;
    }

    try {
      const usageRef = doc(db, 'users', this.userId, 'usage', today);
      const usageSnap = await getDoc(usageRef);

      if (usageSnap.exists()) {
        const data = usageSnap.data();
        this.usageCache.set(today, { data, timestamp: Date.now() });
        return data;
      }

      // Initialize if doesn't exist
      await this.ensureUsageDoc();
      return {
        messages: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        voiceMinutes: 0,
        estimatedCost: 0,
        hourlyMessages: {},
        profileUsage: {}
      };

    } catch (error) {
      console.error('[UsageService] Failed to get today usage:', error);
      return null;
    }
  }

  /**
   * Get usage summary with limits
   */
  async getUsageSummary() {
    const usage = await this.getTodayUsage();
    const limits = RATE_LIMITS[this.userTier] || RATE_LIMITS.free;

    if (!usage) {
      return { error: 'Failed to load usage' };
    }

    return {
      tier: this.userTier,
      today: {
        messages: {
          used: usage.messages,
          limit: limits.messagesPerDay,
          percent: Math.round((usage.messages / limits.messagesPerDay) * 100)
        },
        tokens: {
          used: usage.totalTokens,
          limit: limits.tokensPerDay,
          percent: Math.round((usage.totalTokens / limits.tokensPerDay) * 100)
        },
        voice: {
          used: Math.round(usage.voiceMinutes * 10) / 10,
          limit: limits.voiceMinutesPerDay,
          percent: Math.round((usage.voiceMinutes / limits.voiceMinutesPerDay) * 100)
        },
        cost: {
          estimated: Math.round(usage.estimatedCost * 1000) / 1000
        }
      },
      limits
    };
  }

  /**
   * Get usage history for the past N days
   */
  async getUsageHistory(days = 7) {
    if (!this.userId) return [];

    const history = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = this.formatDateKey(date);

      try {
        const usageRef = doc(db, 'users', this.userId, 'usage', dateKey);
        const usageSnap = await getDoc(usageRef);

        if (usageSnap.exists()) {
          history.push({
            date: dateKey,
            ...usageSnap.data()
          });
        } else {
          history.push({
            date: dateKey,
            messages: 0,
            totalTokens: 0,
            estimatedCost: 0
          });
        }
      } catch (error) {
        console.warn(`[UsageService] Failed to get usage for ${dateKey}:`, error);
      }
    }

    return history;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // BUDGET WARNINGS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Check and trigger budget warnings
   */
  async checkBudgetWarnings() {
    const usage = await this.getTodayUsage();
    const limits = RATE_LIMITS[this.userTier];

    if (!usage || !limits) return;

    // Message warning at 80%
    const messagePercent = usage.messages / limits.messagesPerDay;
    if (messagePercent >= 0.8 && messagePercent < 0.9) {
      this.onBudgetWarning?.({
        type: 'message_warning',
        level: 'warning',
        used: usage.messages,
        limit: limits.messagesPerDay,
        message: `You've used ${usage.messages} of ${limits.messagesPerDay} messages today.`
      });
    } else if (messagePercent >= 0.9) {
      this.onBudgetWarning?.({
        type: 'message_warning',
        level: 'critical',
        used: usage.messages,
        limit: limits.messagesPerDay,
        message: `Almost at limit! ${limits.messagesPerDay - usage.messages} messages remaining today.`
      });
    }

    // Token warning at 80%
    const tokenPercent = usage.totalTokens / limits.tokensPerDay;
    if (tokenPercent >= 0.8) {
      this.onBudgetWarning?.({
        type: 'token_warning',
        level: tokenPercent >= 0.9 ? 'critical' : 'warning',
        used: usage.totalTokens,
        limit: limits.tokensPerDay,
        message: `Token usage at ${Math.round(tokenPercent * 100)}% of daily limit.`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════

  getTodayKey() {
    return this.formatDateKey(new Date());
  }

  formatDateKey(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  getSecondsUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight - now) / 1000);
  }

  getSecondsUntilNextHour() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    return Math.floor((nextHour - now) / 1000);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CALLBACKS
  // ═══════════════════════════════════════════════════════════════════════

  setOnRateLimitHit(callback) {
    this.onRateLimitHit = callback;
  }

  setOnBudgetWarning(callback) {
    this.onBudgetWarning = callback;
  }

  setOnUsageUpdate(callback) {
    this.onUsageUpdate = callback;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════

  cleanup() {
    this.usageCache.clear();
    this.userId = null;
    this.onRateLimitHit = null;
    this.onBudgetWarning = null;
    this.onUsageUpdate = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const usageService = new UsageService();
export default usageService;
