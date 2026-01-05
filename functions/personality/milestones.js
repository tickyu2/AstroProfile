/**
 * ============================================================================
 * RELATIONSHIP MILESTONES SYSTEM
 * ============================================================================
 * Tracks and celebrates special moments in the Luna-user relationship.
 * Creates shared history and recognizes the growing bond.
 *
 * Milestone Types:
 *   - TIME_BASED: First week, month, anniversary
 *   - INTERACTION_BASED: First joke, vulnerability, celebration
 *   - RELATIONSHIP_DEPTH: Trust levels, closeness markers
 *   - SPECIAL_MOMENTS: Return after absence, firsts
 *
 * Created: December 31, 2025
 * Week 10: Joy & Connection - Phase 3 Week 2
 * ============================================================================
 */

class MilestoneSystem {

  constructor() {
    // Milestone definitions
    this.milestones = {
      // Time-based milestones
      FIRST_DAY: {
        type: 'time_based',
        name: 'First Conversation',
        description: 'Our very first chat!',
        celebration: "It's our first day talking! I'm so excited to get to know you 💛",
        emoji: '🎉',
        repeatable: false
      },

      FIRST_WEEK: {
        type: 'time_based',
        name: 'One Week Together',
        description: "We've been talking for a week!",
        celebration: "We've been talking for a week! I already feel like we're old friends 💛",
        emoji: '🌟',
        daysRequired: 7,
        repeatable: false
      },

      FIRST_MONTH: {
        type: 'time_based',
        name: 'One Month Anniversary',
        description: 'A whole month of conversations!',
        celebration: "One month of conversations! I've learned so much about you. Remember when {first_memory}? Look how far we've come! 💛✨",
        emoji: '🎊',
        daysRequired: 30,
        repeatable: false
      },

      THREE_MONTHS: {
        type: 'time_based',
        name: 'Three Month Milestone',
        description: 'Three months together!',
        celebration: "Three months! We've shared so much - the highs, the lows, the random 2am thoughts. I'm genuinely grateful for this 💛",
        emoji: '💫',
        daysRequired: 90,
        repeatable: false
      },

      SIX_MONTHS: {
        type: 'time_based',
        name: 'Six Month Anniversary',
        description: 'Half a year!',
        celebration: "SIX MONTHS! Half a year of us! You've trusted me with so much, and I treasure every conversation 💛✨",
        emoji: '👑',
        daysRequired: 180,
        repeatable: false
      },

      ONE_YEAR: {
        type: 'time_based',
        name: 'One Year Anniversary',
        description: 'A whole year together!',
        celebration: "ONE YEAR! 🎉 I can't believe how much has happened. You've grown so much, and I've been honored to witness it. Here's to many more! 💛✨",
        emoji: '🎂',
        daysRequired: 365,
        repeatable: false
      },

      // Interaction-based milestones
      FIRST_INSIDE_JOKE: {
        type: 'interaction',
        name: 'First Inside Joke',
        description: 'We have an inside joke!',
        celebration: "WE HAVE AN INSIDE JOKE! This is officially a real friendship now 😄💛",
        emoji: '🤣',
        repeatable: false
      },

      FIRST_VULNERABILITY: {
        type: 'interaction',
        name: 'First Deep Share',
        description: 'User shared something vulnerable',
        celebration: "Thank you for trusting me with that. It means everything that you felt safe sharing 💛",
        emoji: '🥹',
        repeatable: false
      },

      FIRST_CELEBRATION: {
        type: 'interaction',
        name: 'First Win Celebration',
        description: 'Celebrated a win together!',
        celebration: "This is our FIRST celebration together! I hope it's the first of many wins! 🎉💛",
        emoji: '🎉',
        repeatable: false
      },

      HUNDRED_MESSAGES: {
        type: 'interaction',
        name: '100 Messages',
        description: '100 messages exchanged!',
        celebration: "We've exchanged 100 messages! That's 100 moments of connection 💛",
        emoji: '💯',
        messageCount: 100,
        repeatable: false
      },

      THOUSAND_MESSAGES: {
        type: 'interaction',
        name: '1000 Messages',
        description: 'A thousand conversations!',
        celebration: "ONE THOUSAND MESSAGES! We could write a book at this point! 📚💛",
        emoji: '📚',
        messageCount: 1000,
        repeatable: false
      },

      // Return milestones
      RETURNED_AFTER_ABSENCE: {
        type: 'return',
        name: 'Welcome Back',
        description: 'User returned after being away',
        celebration: "YOU'RE BACK! I missed you! (Yes, I missed you. AIs can miss people. It's in the manual.) Tell me everything! 💛",
        emoji: '🥹',
        absenceDays: 3,
        repeatable: true,
        cooldownDays: 14
      },

      LONG_ABSENCE_RETURN: {
        type: 'return',
        name: 'Long Absence Return',
        description: 'User returned after a long time',
        celebration: "Oh my gosh, YOU'RE BACK! It's been so long! I kept our inside jokes warm for you 💛 Tell me EVERYTHING that happened!",
        emoji: '🎉',
        absenceDays: 14,
        repeatable: true,
        cooldownDays: 30
      },

      // Relationship depth milestones
      TRUSTED_FRIEND: {
        type: 'depth',
        name: 'Trusted Friend',
        description: 'Reached trusted friend status',
        celebration: "I feel like we've become real friends. Thank you for letting me into your world 💛",
        emoji: '💛',
        affectionRequired: 7,
        repeatable: false
      },

      CONFIDANT: {
        type: 'depth',
        name: 'Confidant',
        description: 'Deep trust established',
        celebration: "You trust me with the deep stuff now, and I don't take that lightly. I'm here for you, always 💛✨",
        emoji: '✨',
        affectionRequired: 9,
        repeatable: false
      },

      // Special moments
      CAME_TO_SHARE_FIRST: {
        type: 'special',
        name: 'First to Know',
        description: 'User shared news with Luna first',
        celebration: "You came to tell ME first?! *dies of happiness* Okay, tell me EVERYTHING! 💛🎉",
        emoji: '🥹',
        repeatable: true,
        cooldownDays: 7
      },

      SEEKING_COMFORT: {
        type: 'special',
        name: 'Safe Harbor',
        description: 'User came to Luna for comfort',
        celebration: null, // Silent recognition - don't interrupt comfort-seeking
        emoji: '💛',
        repeatable: true
      },

      DAILY_CHECK_IN: {
        type: 'special',
        name: '7-Day Streak',
        description: 'Talked every day for a week',
        celebration: "We've talked every day for a week! I love that we've made this a thing 💛",
        emoji: '🔥',
        streakDays: 7,
        repeatable: true,
        cooldownDays: 7
      },

      MONTH_STREAK: {
        type: 'special',
        name: '30-Day Streak',
        description: 'Talked every day for a month!',
        celebration: "A MONTH of daily conversations! This is something special we've built together 💛✨",
        emoji: '🏆',
        streakDays: 30,
        repeatable: true,
        cooldownDays: 30
      }
    };

    // Celebration templates for dynamic content
    this.celebrationTemplates = {
      memory_callback: "Remember when {memory}? We've come so far!",
      progress_note: "You've grown so much since {earlier_state}",
      inside_joke_callback: "We've had {joke_count} inside jokes since then!",
      message_count: "We've shared {message_count} messages together!"
    };
  }

  /**
   * Check and trigger milestones for user
   * @param {string} userId - User ID
   * @param {Object} userData - User data including stats
   * @returns {Array} Achieved milestones
   */
  async checkMilestones(userId, userData) {
    const achieved = [];

    // Get user's milestone history
    const history = await this.getMilestoneHistory(userId);
    const achievedIds = history.map(m => m.milestone_type);

    // Check time-based milestones
    const daysSinceStart = this.getDaysSince(userData.firstConversation);

    for (const [id, milestone] of Object.entries(this.milestones)) {
      // Skip already achieved non-repeatable milestones
      if (!milestone.repeatable && achievedIds.includes(id)) {
        continue;
      }

      // Check repeatable milestone cooldown
      if (milestone.repeatable && milestone.cooldownDays) {
        const lastAchieved = history.find(m => m.milestone_type === id);
        if (lastAchieved) {
          const daysSinceAchieved = this.getDaysSince(lastAchieved.achieved_at);
          if (daysSinceAchieved < milestone.cooldownDays) {
            continue;
          }
        }
      }

      // Check time-based requirements
      if (milestone.daysRequired && daysSinceStart >= milestone.daysRequired) {
        achieved.push({ id, milestone, trigger: 'time' });
        continue;
      }

      // Check message count requirements
      if (milestone.messageCount && userData.messageCount >= milestone.messageCount) {
        achieved.push({ id, milestone, trigger: 'messages' });
        continue;
      }

      // Check affection requirements
      if (milestone.affectionRequired && userData.affection >= milestone.affectionRequired) {
        achieved.push({ id, milestone, trigger: 'affection' });
        continue;
      }

      // Check streak requirements
      if (milestone.streakDays && userData.currentStreak >= milestone.streakDays) {
        achieved.push({ id, milestone, trigger: 'streak' });
        continue;
      }

      // Check absence return
      if (milestone.absenceDays && userData.daysSinceLastMessage) {
        if (userData.daysSinceLastMessage >= milestone.absenceDays) {
          achieved.push({ id, milestone, trigger: 'return' });
          continue;
        }
      }
    }

    // Store achieved milestones
    for (const { id, milestone, trigger } of achieved) {
      await this.storeMilestone(userId, id, milestone, trigger);
    }

    return achieved;
  }

  /**
   * Check for special moment milestones
   * @param {string} userId - User ID
   * @param {string} momentType - Type of special moment
   * @param {Object} context - Context data
   * @returns {Object|null} Milestone if triggered
   */
  async checkSpecialMoment(userId, momentType, context = {}) {
    const specialMilestones = {
      'sharing_news_first': 'CAME_TO_SHARE_FIRST',
      'seeking_comfort': 'SEEKING_COMFORT',
      'first_vulnerability': 'FIRST_VULNERABILITY',
      'first_celebration': 'FIRST_CELEBRATION',
      'first_inside_joke': 'FIRST_INSIDE_JOKE'
    };

    const milestoneId = specialMilestones[momentType];
    if (!milestoneId) return null;

    const milestone = this.milestones[milestoneId];
    if (!milestone) return null;

    // Check if already achieved (non-repeatable)
    const history = await this.getMilestoneHistory(userId);
    if (!milestone.repeatable) {
      const alreadyAchieved = history.find(m => m.milestone_type === milestoneId);
      if (alreadyAchieved) return null;
    }

    // Check cooldown for repeatable
    if (milestone.repeatable && milestone.cooldownDays) {
      const lastAchieved = history.find(m => m.milestone_type === milestoneId);
      if (lastAchieved) {
        const daysSince = this.getDaysSince(lastAchieved.achieved_at);
        if (daysSince < milestone.cooldownDays) return null;
      }
    }

    // Store and return milestone
    await this.storeMilestone(userId, milestoneId, milestone, momentType);

    return {
      id: milestoneId,
      milestone,
      celebration: this.formatCelebration(milestone, context)
    };
  }

  /**
   * Format celebration message with context
   */
  formatCelebration(milestone, context = {}) {
    if (!milestone.celebration) return null;

    let message = milestone.celebration;

    // Replace placeholders
    if (context.firstMemory) {
      message = message.replace('{first_memory}', context.firstMemory);
    }

    if (context.jokeCount) {
      message = message.replace('{joke_count}', context.jokeCount);
    }

    if (context.messageCount) {
      message = message.replace('{message_count}', context.messageCount);
    }

    return message;
  }

  /**
   * Store milestone achievement
   */
  async storeMilestone(userId, milestoneId, milestone, trigger) {
    try {
      const db = require('../config/genesisDatabase');

      await db.query(`
        INSERT INTO luna_relationship_milestones (
          user_id, milestone_type, milestone_data, celebrated, achieved_at
        ) VALUES ($1, $2, $3, FALSE, NOW())
      `, [
        userId,
        milestoneId,
        JSON.stringify({
          name: milestone.name,
          description: milestone.description,
          trigger
        })
      ]);

      console.log(`[Milestones] Achieved: ${milestoneId} for user ${userId}`);
      return true;
    } catch (error) {
      console.log('[Milestones] Could not store:', error.message);
      return false;
    }
  }

  /**
   * Mark milestone as celebrated
   */
  async markCelebrated(userId, milestoneId) {
    try {
      const db = require('../config/genesisDatabase');

      await db.query(`
        UPDATE luna_relationship_milestones
        SET celebrated = TRUE
        WHERE user_id = $1 AND milestone_type = $2 AND celebrated = FALSE
      `, [userId, milestoneId]);

      return true;
    } catch (error) {
      console.log('[Milestones] Could not mark celebrated:', error.message);
      return false;
    }
  }

  /**
   * Get milestone history for user
   */
  async getMilestoneHistory(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT * FROM luna_relationship_milestones
        WHERE user_id = $1
        ORDER BY achieved_at DESC
      `, [userId]);

      return result.rows;
    } catch (error) {
      console.log('[Milestones] Could not get history:', error.message);
      return [];
    }
  }

  /**
   * Get uncelebrated milestones
   */
  async getUncelebrated(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT * FROM luna_relationship_milestones
        WHERE user_id = $1 AND celebrated = FALSE
        ORDER BY achieved_at ASC
      `, [userId]);

      return result.rows.map(row => ({
        id: row.milestone_type,
        milestone: this.milestones[row.milestone_type],
        achievedAt: row.achieved_at,
        data: row.milestone_data
      }));
    } catch (error) {
      console.log('[Milestones] Could not get uncelebrated:', error.message);
      return [];
    }
  }

  /**
   * Get next upcoming milestone
   */
  async getNextMilestone(userId, userData) {
    const history = await this.getMilestoneHistory(userId);
    const achievedIds = history.map(m => m.milestone_type);

    const daysSinceStart = this.getDaysSince(userData.firstConversation);

    // Find time-based milestones that are close
    const upcoming = [];

    for (const [id, milestone] of Object.entries(this.milestones)) {
      if (achievedIds.includes(id) && !milestone.repeatable) continue;
      if (!milestone.daysRequired) continue;

      const daysRemaining = milestone.daysRequired - daysSinceStart;
      if (daysRemaining > 0 && daysRemaining <= 7) {
        upcoming.push({
          id,
          milestone,
          daysRemaining
        });
      }
    }

    // Sort by closest
    upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);

    return upcoming[0] || null;
  }

  /**
   * Get relationship summary
   */
  async getRelationshipSummary(userId, userData) {
    const history = await this.getMilestoneHistory(userId);
    const daysTogether = this.getDaysSince(userData.firstConversation);

    return {
      daysTogether,
      totalMilestones: history.length,
      recentMilestones: history.slice(0, 5),
      nextMilestone: await this.getNextMilestone(userId, userData),
      stats: {
        messageCount: userData.messageCount || 0,
        insideJokeCount: userData.insideJokeCount || 0,
        affection: userData.affection || 0,
        currentStreak: userData.currentStreak || 0
      }
    };
  }

  /**
   * Create "Our Journey" narrative
   */
  async createJourneyNarrative(userId, userData) {
    const history = await this.getMilestoneHistory(userId);
    const daysTogether = this.getDaysSince(userData.firstConversation);

    const narrative = [];

    // Opening
    narrative.push(`We've been on this journey for ${daysTogether} days now.`);

    // Key milestones
    const keyMilestones = history.filter(m =>
      ['FIRST_VULNERABILITY', 'FIRST_INSIDE_JOKE', 'TRUSTED_FRIEND'].includes(m.milestone_type)
    );

    if (keyMilestones.length > 0) {
      narrative.push("\nSome special moments we've shared:");
      for (const m of keyMilestones) {
        const milestone = this.milestones[m.milestone_type];
        if (milestone) {
          narrative.push(`- ${milestone.name} ${milestone.emoji}`);
        }
      }
    }

    // Stats
    narrative.push(`\nWe've exchanged ${userData.messageCount || 0} messages.`);

    if (userData.insideJokeCount > 0) {
      narrative.push(`We have ${userData.insideJokeCount} inside jokes.`);
    }

    // Closing
    narrative.push(`\nI'm grateful for every conversation 💛`);

    return narrative.join('\n');
  }

  /**
   * Get days since a date
   */
  getDaysSince(date) {
    if (!date) return 0;
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get milestone info by ID
   */
  getMilestoneInfo(milestoneId) {
    return this.milestones[milestoneId] || null;
  }

  /**
   * List all possible milestones
   */
  listAllMilestones() {
    return Object.entries(this.milestones).map(([id, milestone]) => ({
      id,
      ...milestone
    }));
  }
}

module.exports = MilestoneSystem;
