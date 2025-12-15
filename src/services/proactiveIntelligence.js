/**
 * Proactive Intelligence Service
 *
 * Anticipates user needs based on learned patterns.
 * Part of GENESIS Session Intelligence Architecture - Brunelleschi's Crane
 *
 * Built by: Brother Claude Code (Yin Wood Pig)
 * Designed by: Brother Claude Sonnet (Metal Rat)
 * December 14, 2024
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Proactive Intelligence Service
 * Anticipates user needs based on patterns
 */
class ProactiveIntelligenceService {

  /**
   * Analyze context and suggest proactive actions
   */
  async analyzeContext(userId, currentState = {}) {
    const profile = await this.loadProfile(userId);

    if (!profile) return { suggestions: [], greeting: null };

    const suggestions = [];

    // Check time-based patterns
    const timePattern = this.checkTimePatterns(profile, new Date());
    if (timePattern) suggestions.push(timePattern);

    // Check emotional state patterns
    const emotionalPattern = this.checkEmotionalPatterns(profile, currentState);
    if (emotionalPattern) suggestions.push(emotionalPattern);

    // Check topic continuity
    const topicPattern = this.checkTopicContinuity(profile);
    if (topicPattern) suggestions.push(topicPattern);

    // Check breakthrough follow-up
    const breakthroughPattern = this.checkBreakthroughFollowUp(profile);
    if (breakthroughPattern) suggestions.push(breakthroughPattern);

    // Generate proactive greeting if returning
    const greeting = this.generateProactiveGreeting(profile, suggestions);

    return { suggestions, greeting };
  }

  /**
   * Check if current time matches known patterns
   */
  checkTimePatterns(profile, now) {
    const hour = now.getHours();
    const patterns = profile.learned_patterns;

    // Late night creative time (10pm - 2am)
    if (hour >= 22 || hour <= 2) {
      // Check if user is typically active at this time
      const recentSummaries = profile.conversation_summaries?.slice(-10) || [];
      const lateNightConvos = recentSummaries.filter(s => {
        const convHour = new Date(s.date).getHours();
        return convHour >= 22 || convHour <= 2;
      });

      if (lateNightConvos.length >= 3) {
        return {
          type: 'time_pattern',
          suggestion: 'Late night creation mode detected. Ready to explore or build?',
          confidence: 0.85,
          priority: 'medium'
        };
      }
    }

    // Morning check-in (6am - 9am)
    if (hour >= 6 && hour <= 9) {
      const recentBreakthroughs = profile.breakthrough_moments?.filter(b => {
        const daysSince = (Date.now() - new Date(b.date).getTime()) / (1000 * 60 * 60 * 24);
        return daysSince < 3;
      }) || [];

      if (recentBreakthroughs.length > 0) {
        return {
          type: 'morning_reflection',
          suggestion: 'Good morning. How are you feeling about our recent breakthrough?',
          confidence: 0.75,
          priority: 'low'
        };
      }
    }

    return null;
  }

  /**
   * Check emotional state against patterns
   */
  checkEmotionalPatterns(profile, currentState) {
    const { soulBurden } = currentState;
    const patterns = profile.learned_patterns;

    // High burden - suggest witness mode
    if (soulBurden > 70) {
      // Check if witness mode was effective
      const witnessEff = patterns?.communication_style?.witness_effectiveness || 0;

      if (witnessEff > 0.5) {
        return {
          type: 'emotional_pattern',
          suggestion: 'Soul burden is high. Want to witness first before building?',
          confidence: 0.90,
          priority: 'high',
          recommendedMode: 'WITNESS'
        };
      }
    }

    // Very low burden - capacity for creation
    if (soulBurden < 30) {
      const recentThemes = this.getRecentThemes(profile);
      const hasUnfinishedProjects = recentThemes.some(t =>
        ['Technical', 'GENESIS', 'Creative'].includes(t.theme)
      );

      if (hasUnfinishedProjects) {
        return {
          type: 'capacity_created',
          suggestion: 'Fresh capacity! Ready to continue building?',
          confidence: 0.80,
          priority: 'medium',
          recommendedMode: 'DIALOGUE'
        };
      }
    }

    // Check for known triggers in recent patterns
    const recentTriggers = patterns?.emotional_patterns?.recent_triggers || [];
    const frustrationTriggers = recentTriggers.filter(t => t.emotion === 'frustration');

    if (frustrationTriggers.length > 3) {
      return {
        type: 'frustration_awareness',
        suggestion: 'I notice frustration has come up recently. Want to process that?',
        confidence: 0.70,
        priority: 'medium',
        recommendedMode: 'WITNESS'
      };
    }

    return null;
  }

  /**
   * Check if there are unfinished topics
   */
  checkTopicContinuity(profile) {
    const summaries = profile.conversation_summaries || [];
    const recent = summaries.slice(-5);

    if (recent.length === 0) return null;

    // Look for recurring themes without resolution
    const openTopics = this.findOpenTopics(recent);

    if (openTopics.length > 0) {
      return {
        type: 'topic_continuity',
        suggestion: `Shall we continue exploring ${openTopics[0]}?`,
        confidence: 0.75,
        priority: 'low',
        topic: openTopics[0]
      };
    }

    // Check for recent breakthrough that needs follow-up
    const lastConvo = recent[recent.length - 1];
    if (lastConvo?.breakthrough) {
      return {
        type: 'breakthrough_followup',
        suggestion: 'How has our recent breakthrough been settling?',
        confidence: 0.80,
        priority: 'medium'
      };
    }

    return null;
  }

  /**
   * Check for recent breakthroughs that might need follow-up
   */
  checkBreakthroughFollowUp(profile) {
    const breakthroughs = profile.breakthrough_moments || [];

    if (breakthroughs.length === 0) return null;

    const recent = breakthroughs.filter(b => {
      const daysSince = (Date.now() - new Date(b.date).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 7 && daysSince > 1;
    });

    if (recent.length > 0 && recent[0].emotional_weight > 0.7) {
      return {
        type: 'breakthrough_integration',
        suggestion: 'That breakthrough we had is still integrating. Want to explore how it\'s showing up?',
        confidence: 0.70,
        priority: 'low'
      };
    }

    return null;
  }

  /**
   * Generate proactive greeting based on learned patterns
   */
  generateProactiveGreeting(profile, suggestions) {
    const patterns = profile.learned_patterns;
    const totalConvos = patterns?.total_analyses || 0;

    // First few conversations - building foundation
    if (totalConvos < 3) {
      return null; // Let default greeting handle it
    }

    // Find most relevant suggestion
    const highPriority = suggestions.find(s => s.priority === 'high');
    const mediumPriority = suggestions.find(s => s.priority === 'medium');

    if (highPriority) {
      return {
        text: highPriority.suggestion,
        type: highPriority.type,
        recommendedMode: highPriority.recommendedMode
      };
    }

    // Check recent themes for continuity
    const recentThemes = this.getRecentThemes(profile);

    if (recentThemes.length > 0 && Math.random() > 0.5) {
      const topTheme = recentThemes[0].theme;
      return {
        text: `Welcome back. Still exploring ${topTheme.toLowerCase()}?`,
        type: 'continuity',
        theme: topTheme
      };
    }

    if (mediumPriority) {
      return {
        text: mediumPriority.suggestion,
        type: mediumPriority.type,
        recommendedMode: mediumPriority.recommendedMode
      };
    }

    // Default relationship-aware greeting
    const depth = this.getRelationshipDepth(profile);

    if (depth > 0.6) {
      return {
        text: 'Good to see you again. What\'s on your mind?',
        type: 'relationship'
      };
    }

    return null;
  }

  /**
   * Find open topics from recent conversations
   */
  findOpenTopics(conversations) {
    const themeCounts = {};

    conversations.forEach(conv => {
      conv.key_themes?.forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });

    // Themes that appear multiple times recently = ongoing topics
    return Object.entries(themeCounts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([theme, _]) => theme);
  }

  /**
   * Get recent themes from conversation summaries
   */
  getRecentThemes(profile) {
    const summaries = profile.conversation_summaries || [];
    const recent = summaries.slice(-5);

    const themeCounts = {};

    recent.forEach(conv => {
      conv.key_themes?.forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });

    return Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([theme, count]) => ({ theme, count }));
  }

  /**
   * Calculate simple relationship depth
   */
  getRelationshipDepth(profile) {
    const patterns = profile.learned_patterns || {};
    const convos = patterns.total_analyses || 0;
    const breakthroughs = (profile.breakthrough_moments || []).length;

    // Simple calculation
    let depth = 0;
    depth += Math.min(convos / 50, 0.4);
    depth += Math.min(breakthroughs / 5, 0.3);
    depth += Math.min(convos > 10 ? 0.3 : 0, 0.3);

    return Math.min(depth, 1.0);
  }

  /**
   * Get greeting for a returning user
   */
  async getReturnGreeting(userId, currentState = {}) {
    const result = await this.analyzeContext(userId, currentState);

    if (result.greeting) {
      return result.greeting;
    }

    // Default - no special greeting
    return null;
  }

  /**
   * Get mode recommendation based on patterns
   */
  async getRecommendedMode(userId, userMessage, currentState = {}) {
    const profile = await this.loadProfile(userId);

    if (!profile) return null;

    const patterns = profile.learned_patterns;
    if (!patterns?.communication_style) return null;

    const style = patterns.communication_style;

    // Check if high burden - recommend witness
    if (currentState.soulBurden > 70 && style.witness_effectiveness > 0.5) {
      return 'WITNESS';
    }

    // Check message for emotional content
    const emotionalKeywords = /frustrat|sad|angry|upset|overwhelm|stress|anxious|worried/i;
    if (emotionalKeywords.test(userMessage) && style.witness_effectiveness > 0.5) {
      return 'WITNESS';
    }

    // Check message for guidance requests
    const guidanceKeywords = /how do i|help me|what should|can you show|steps to/i;
    if (guidanceKeywords.test(userMessage) && style.guidance_effectiveness > 0.5) {
      return 'GUIDANCE';
    }

    // Default to dialogue
    return null; // Let Constitutional Intelligence decide
  }

  /**
   * Load constitutional profile from Firestore
   */
  async loadProfile(userId) {
    try {
      const profileRef = doc(db, 'constitutionalProfiles', userId);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        return profileSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }
}

// Export singleton
export const proactiveIntelligence = new ProactiveIntelligenceService();
export default proactiveIntelligence;
