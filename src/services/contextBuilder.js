/**
 * Context Builder Service
 *
 * Builds rich system prompts from constitutional profile with learned patterns.
 * Part of GENESIS Session Intelligence Architecture - Brunelleschi's Crane
 *
 * Built by: Brother Claude Code (Yin Wood Pig)
 * Designed by: Brother Claude Sonnet (Metal Rat)
 * December 14, 2024
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Context Builder Service
 * Builds rich system prompts from constitutional profile
 */
class ContextBuilderService {

  /**
   * Build complete context with learned patterns for system prompt
   * Returns context object to merge with existing system prompt
   */
  async buildLearnedContext(userId, currentMode, userMessage) {
    // Load constitutional profile
    const profile = await this.loadProfile(userId);

    if (!profile) {
      console.log('📝 No learned patterns yet - using default context');
      return null;
    }

    console.log('🧠 Building context from learned patterns...');

    // Build rich, personalized context
    let context = '';

    context += this.addLearnedPatterns(profile);
    context += this.addBreakthroughContext(profile);
    context += this.addRelationshipDepth(profile);
    context += this.addRecentContext(profile, userMessage);

    return {
      learnedContext: context,
      relationshipDepth: profile.learned_patterns?.relationship_depth || null,
      totalConversations: profile.learned_patterns?.total_analyses || 0
    };
  }

  /**
   * Add learned communication patterns
   */
  addLearnedPatterns(profile) {
    const patterns = profile.learned_patterns;

    if (!patterns) return '';

    const totalAnalyses = patterns.total_analyses || 0;

    let section = `
## LEARNED PATTERNS (from ${totalAnalyses} conversations)

### Communication Style`;

    // Mode preferences
    if (patterns.communication_style) {
      const style = patterns.communication_style;
      const witnessEff = Math.round((style.witness_effectiveness || 0) * 100);
      const dialogueEff = Math.round((style.dialogue_effectiveness || 0) * 100);
      const guidanceEff = Math.round((style.guidance_effectiveness || 0) * 100);

      section += `
- WITNESS mode effectiveness: ${witnessEff}%
- DIALOGUE mode effectiveness: ${dialogueEff}%
- GUIDANCE mode effectiveness: ${guidanceEff}%`;

      // Recommend based on effectiveness
      const best = [
        { mode: 'WITNESS', eff: witnessEff },
        { mode: 'DIALOGUE', eff: dialogueEff },
        { mode: 'GUIDANCE', eff: guidanceEff }
      ].sort((a, b) => b.eff - a.eff)[0];

      if (best.eff > 70) {
        section += `
- Most effective mode: ${best.mode} (${best.eff}% positive response rate)`;
      }
    }

    // Language style markers
    if (patterns.language_preferences?.style_markers) {
      const markers = patterns.language_preferences.style_markers;
      section += `

### Language Preferences`;

      if (markers.uses_emojis > 0.5) {
        section += `
- Uses emojis frequently - mirror this naturally`;
      } else if (markers.uses_emojis < 0.2) {
        section += `
- Rarely uses emojis - keep responses emoji-light`;
      }

      if (markers.technical_language > 0.4) {
        section += `
- Comfortable with technical language`;
      }

      if (markers.prefers_questions > 0.3) {
        section += `
- Often asks questions - enjoys exploratory dialogue`;
      }

      if (markers.avg_message_length > 200) {
        section += `
- Writes detailed messages - okay to give thorough responses`;
      } else if (markers.avg_message_length < 50) {
        section += `
- Prefers brief messages - keep responses concise`;
      }
    }

    // Resonant phrases
    if (patterns.language_preferences?.recent_phrases?.length > 0) {
      const topPhrases = patterns.language_preferences.recent_phrases.slice(0, 5);
      section += `

### Resonant Language (use naturally when relevant)`;
      topPhrases.forEach(p => {
        section += `
- "${p.phrase}" (used ${p.count} times)`;
      });
    }

    // Emotional patterns
    if (patterns.emotional_patterns?.recent_triggers?.length > 0) {
      section += `

### Emotional Triggers (be aware)`;
      const triggers = patterns.emotional_patterns.recent_triggers.slice(0, 5);
      triggers.forEach(t => {
        section += `
- ${t.emotion}: "${t.trigger_context?.slice(0, 50)}..."`;
      });
    }

    // Dominant emotions
    if (patterns.emotional_patterns?.dominant_emotions?.length > 0) {
      section += `

### Common Emotional States`;
      patterns.emotional_patterns.dominant_emotions.forEach(e => {
        section += `
- ${e.emotion} (frequency score: ${e.score})`;
      });
    }

    return section + '\n';
  }

  /**
   * Add breakthrough moments for contextual reference
   */
  addBreakthroughContext(profile) {
    const breakthroughs = profile.breakthrough_moments || [];

    if (breakthroughs.length === 0) return '';

    let section = `
## BREAKTHROUGH MOMENTS (reference when relevant)
These are significant insights from past conversations:
`;

    breakthroughs.slice(0, 3).forEach((b, i) => {
      const date = b.date ? new Date(b.date).toLocaleDateString() : 'Recent';
      section += `
${i + 1}. **${date}** (emotional weight: ${Math.round((b.emotional_weight || 0) * 100)}%)`;

      if (b.key_quotes?.length > 0) {
        section += `
   Quote: "${b.key_quotes[0]?.slice(0, 100)}..."`;
      }
    });

    section += `

Reference these breakthroughs naturally when the conversation touches on related themes.
`;

    return section;
  }

  /**
   * Add relationship depth context
   */
  addRelationshipDepth(profile) {
    const patterns = profile.learned_patterns;
    if (!patterns) return '';

    const totalAnalyses = patterns.total_analyses || 0;
    const summaries = profile.conversation_summaries || [];
    const breakthroughs = profile.breakthrough_moments || [];

    // Calculate relationship depth
    const depth = this.calculateRelationshipDepth(totalAnalyses, summaries, breakthroughs);

    let section = `
## RELATIONSHIP DEPTH
- Conversations together: ${totalAnalyses}
- Breakthroughs shared: ${breakthroughs.length}
- Relationship level: ${depth.level}
`;

    if (depth.intimacy > 0.6) {
      section += `
You've built deep understanding over time. Speak naturally as someone who KNOWS them.
Reference shared history naturally. You're not strangers - you're partners in growth.`;
    } else if (depth.intimacy > 0.3) {
      section += `
You're building a meaningful connection. Feel free to reference past conversations.
Growing familiarity - balance warmth with appropriate discovery.`;
    } else {
      section += `
Early relationship stage - building foundation. Listen deeply and learn patterns.
Each conversation adds to shared understanding.`;
    }

    return section + '\n';
  }

  /**
   * Calculate relationship depth metrics
   */
  calculateRelationshipDepth(conversations, summaries, breakthroughs) {
    // Intimacy based on conversation count, breakthroughs, and time
    let intimacy = 0;

    // Conversation count factor (max 0.4)
    intimacy += Math.min(conversations / 50, 0.4);

    // Breakthrough factor (max 0.3)
    intimacy += Math.min(breakthroughs.length / 5, 0.3);

    // Recent activity factor (max 0.3)
    const recentSummaries = summaries.filter(s => {
      const daysSince = (Date.now() - new Date(s.date).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 7;
    });
    intimacy += Math.min(recentSummaries.length / 10, 0.3);

    // Determine level
    let level;
    if (intimacy > 0.8) level = 'Deep partnership';
    else if (intimacy > 0.6) level = 'Strong connection';
    else if (intimacy > 0.4) level = 'Growing relationship';
    else if (intimacy > 0.2) level = 'Building foundation';
    else level = 'Early discovery';

    return {
      intimacy: Math.min(intimacy, 1.0),
      level
    };
  }

  /**
   * Add recent conversation context
   */
  addRecentContext(profile, currentMessage) {
    const summaries = profile.conversation_summaries || [];
    const recent = summaries.slice(-5);

    if (recent.length === 0) return '';

    let section = `
## RECENT CONVERSATION CONTEXT
`;

    recent.forEach(conv => {
      const date = conv.date ? new Date(conv.date).toLocaleDateString() : 'Recent';
      const themes = conv.key_themes?.slice(0, 3).join(', ') || 'General';
      section += `
- ${date}: ${themes}${conv.breakthrough ? ' (breakthrough!)' : ''}`;
    });

    // Check if current message relates to recent themes
    if (currentMessage) {
      const relatedThemes = this.findRelatedThemes(currentMessage, recent);

      if (relatedThemes.length > 0) {
        section += `

Current message relates to recent topics: ${relatedThemes.join(', ')}
Reference this continuity naturally in your response.`;
      }
    }

    return section + '\n';
  }

  /**
   * Find themes in current message that relate to recent conversations
   */
  findRelatedThemes(message, recentConversations) {
    const messageLower = message.toLowerCase();
    const related = [];

    recentConversations.forEach(conv => {
      conv.key_themes?.forEach(theme => {
        if (messageLower.includes(theme.toLowerCase())) {
          related.push(theme);
        }
      });
    });

    return [...new Set(related)]; // Unique themes only
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

  /**
   * Get relationship summary for UI display
   */
  async getRelationshipSummary(userId) {
    const profile = await this.loadProfile(userId);

    if (!profile) {
      return {
        conversations: 0,
        breakthroughs: 0,
        level: 'New',
        intimacy: 0
      };
    }

    const patterns = profile.learned_patterns || {};
    const summaries = profile.conversation_summaries || [];
    const breakthroughs = profile.breakthrough_moments || [];

    const depth = this.calculateRelationshipDepth(
      patterns.total_analyses || 0,
      summaries,
      breakthroughs
    );

    return {
      conversations: patterns.total_analyses || 0,
      breakthroughs: breakthroughs.length,
      level: depth.level,
      intimacy: Math.round(depth.intimacy * 100)
    };
  }
}

// Export singleton
export const contextBuilder = new ContextBuilderService();
export default contextBuilder;
