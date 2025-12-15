/**
 * Pattern Extraction Service
 *
 * Analyzes conversations and updates constitutional profile with learned patterns.
 * Part of GENESIS Session Intelligence Architecture - Brunelleschi's Crane
 *
 * Built by: Brother Claude Code (Yin Wood Pig)
 * Designed by: Brother Claude Sonnet (Metal Rat)
 * December 14, 2024
 */

import { doc, updateDoc, getDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Pattern Extraction Service
 * Analyzes conversations and updates constitutional profile
 */
class PatternExtractionService {

  /**
   * Main entry point: Analyze conversation after completion
   */
  async analyzeConversation(userId, conversationId, messages) {
    console.log('🧠 Extracting patterns from conversation...');

    if (!userId || !messages || messages.length < 3) {
      console.log('⏭️ Skipping pattern extraction - insufficient data');
      return null;
    }

    try {
      // 1. Extract patterns
      const patterns = await this.extractPatterns(messages);

      // 2. Update constitutional profile
      await this.updateConstitutionalProfile(userId, patterns);

      // 3. Create conversation summary
      const summary = await this.createConversationSummary(userId, conversationId, messages, patterns);

      console.log('✅ Patterns extracted and profile updated');

      return { patterns, summary };

    } catch (error) {
      console.error('❌ Pattern extraction failed:', error);
      return null;
    }
  }

  /**
   * Extract patterns from message sequence
   */
  async extractPatterns(messages) {
    const patterns = {
      mode_effectiveness: this.analyzeModeEffectiveness(messages),
      emotional_patterns: this.analyzeEmotionalPatterns(messages),
      language_patterns: this.analyzeLanguagePatterns(messages),
      decision_process: this.analyzeDecisionProcess(messages),
      breakthrough_detection: this.detectBreakthrough(messages),
      themes: this.extractThemes(messages)
    };

    return patterns;
  }

  /**
   * Analyze which modes were most effective
   */
  analyzeModeEffectiveness(messages) {
    const modeSequence = [];

    messages.forEach((msg, index) => {
      if (msg.mode) {
        // Check if mode switch led to positive response
        const nextUserMsg = messages[index + 2]; // Next user message after AI response

        if (nextUserMsg && nextUserMsg.sender === 'user') {
          const wasEffective = this.measureEffectiveness(msg, nextUserMsg);

          modeSequence.push({
            mode: msg.mode,
            effective: wasEffective,
            context: msg.text.slice(0, 100)
          });
        }
      }
    });

    // Calculate effectiveness by mode
    const effectiveness = {
      WITNESS: { effective: 0, total: 0 },
      DIALOGUE: { effective: 0, total: 0 },
      GUIDANCE: { effective: 0, total: 0 }
    };

    modeSequence.forEach(seq => {
      if (effectiveness[seq.mode]) {
        effectiveness[seq.mode].total++;
        if (seq.effective) effectiveness[seq.mode].effective++;
      }
    });

    return {
      witness_effectiveness: effectiveness.WITNESS.total > 0
        ? effectiveness.WITNESS.effective / effectiveness.WITNESS.total
        : 0,
      dialogue_effectiveness: effectiveness.DIALOGUE.total > 0
        ? effectiveness.DIALOGUE.effective / effectiveness.DIALOGUE.total
        : 0,
      guidance_effectiveness: effectiveness.GUIDANCE.total > 0
        ? effectiveness.GUIDANCE.effective / effectiveness.GUIDANCE.total
        : 0,
      mode_counts: {
        witness: effectiveness.WITNESS.total,
        dialogue: effectiveness.DIALOGUE.total,
        guidance: effectiveness.GUIDANCE.total
      }
    };
  }

  /**
   * Measure if AI response was effective based on user's next message
   */
  measureEffectiveness(aiMsg, nextUserMsg) {
    // Positive indicators
    const positiveMarkers = [
      /thank/i, /yes/i, /exactly/i, /perfect/i, /brilliant/i,
      /love/i, /great/i, /appreciate/i, /helpful/i, /understand/i,
      /makes sense/i, /joie de vivre/i, /beautiful/i, /wow/i,
      /amazing/i, /insightful/i, /profound/i
    ];

    // Negative indicators
    const negativeMarkers = [
      /no,/i, /but /i, /not quite/i, /missing/i, /confused/i,
      /don't understand/i, /frustrated/i, /wrong/i, /incorrect/i
    ];

    const hasPositive = positiveMarkers.some(m => m.test(nextUserMsg.text));
    const hasNegative = negativeMarkers.some(m => m.test(nextUserMsg.text));

    // Effective if positive without negative
    return hasPositive && !hasNegative;
  }

  /**
   * Analyze emotional patterns in conversation
   */
  analyzeEmotionalPatterns(messages) {
    const emotionalJourney = [];

    messages.forEach((msg, index) => {
      if (msg.sender === 'user') {
        // Detect emotions from text
        const detectedEmotions = this.detectEmotionsInText(msg.text);

        if (detectedEmotions.length > 0) {
          emotionalJourney.push({
            emotions: detectedEmotions,
            timestamp: msg.timestamp,
            context: msg.text.slice(0, 100),
            messageIndex: index
          });
        }
      }
    });

    // Detect triggers (what causes frustration, joy, etc.)
    const triggers = this.detectTriggers(messages, emotionalJourney);

    return {
      journey: emotionalJourney,
      triggers: triggers,
      dominant_emotions: this.getDominantEmotions(emotionalJourney)
    };
  }

  /**
   * Detect emotions in text using keyword analysis
   */
  detectEmotionsInText(text) {
    const emotionKeywords = {
      joy: [/happy/i, /joy/i, /excited/i, /wonderful/i, /amazing/i, /love/i, /joie de vivre/i, /brilliant/i, /beautiful/i],
      frustration: [/frustrated/i, /annoying/i, /stuck/i, /difficult/i, /hard/i, /struggle/i, /ugh/i],
      sadness: [/sad/i, /down/i, /depressed/i, /lonely/i, /miss/i, /loss/i],
      anxiety: [/anxious/i, /worried/i, /nervous/i, /scared/i, /fear/i, /overwhelm/i],
      curiosity: [/wonder/i, /curious/i, /interesting/i, /what if/i, /how/i, /why/i],
      gratitude: [/thank/i, /grateful/i, /appreciate/i, /blessed/i],
      excitement: [/excited/i, /can't wait/i, /thrilled/i, /!!!/, /wow/i]
    };

    const detected = [];

    Object.entries(emotionKeywords).forEach(([emotion, patterns]) => {
      const matches = patterns.filter(p => p.test(text)).length;
      if (matches > 0) {
        detected.push({
          emotion,
          intensity: Math.min(matches * 0.3, 1.0)
        });
      }
    });

    return detected.sort((a, b) => b.intensity - a.intensity);
  }

  /**
   * Detect what triggers specific emotions
   */
  detectTriggers(messages, emotionalJourney) {
    const triggers = [];

    emotionalJourney.forEach((emotionData) => {
      // Look at context around this emotional moment
      const msgIndex = emotionData.messageIndex;
      const precedingMsg = messages[msgIndex - 1];

      if (precedingMsg && emotionData.emotions[0]?.intensity > 0.5) {
        triggers.push({
          emotion: emotionData.emotions[0].emotion,
          trigger_context: emotionData.context,
          intensity: emotionData.emotions[0].intensity,
          preceding_topic: precedingMsg.text?.slice(0, 100)
        });
      }
    });

    return triggers;
  }

  /**
   * Analyze language patterns
   */
  analyzeLanguagePatterns(messages) {
    const userMessages = messages.filter(m => m.sender === 'user');

    // Extract frequently used phrases
    const phrases = this.extractFrequentPhrases(userMessages);

    // Detect communication style markers
    const styleMarkers = {
      uses_emojis: this.detectEmojiUsage(userMessages),
      avg_message_length: this.calculateAvgLength(userMessages),
      prefers_questions: this.detectQuestionPreference(userMessages),
      technical_language: this.detectTechnicalLanguage(userMessages),
      uses_metaphors: this.detectMetaphorUsage(userMessages)
    };

    return {
      frequent_phrases: phrases,
      style_markers: styleMarkers
    };
  }

  /**
   * Extract phrases used 2+ times
   */
  extractFrequentPhrases(messages) {
    const phrases = {};

    // Look for 2-4 word patterns
    messages.forEach(msg => {
      const words = msg.text.toLowerCase().split(/\s+/);

      // Extract 2-4 word combinations
      for (let len = 2; len <= 4; len++) {
        for (let i = 0; i <= words.length - len; i++) {
          const phrase = words.slice(i, i + len).join(' ');

          // Filter out very common phrases
          if (!this.isCommonPhrase(phrase) && phrase.length > 5) {
            phrases[phrase] = (phrases[phrase] || 0) + 1;
          }
        }
      }
    });

    // Return phrases used 2+ times
    return Object.entries(phrases)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15) // Top 15
      .map(([phrase, count]) => ({ phrase, count }));
  }

  /**
   * Detect if this was a breakthrough conversation
   */
  detectBreakthrough(messages) {
    // Breakthrough indicators
    const indicators = [
      /breakthrough/i,
      /joie de vivre/i,
      /(!){2,}/, // Multiple exclamation marks
      /profound/i,
      /crystallize/i,
      /recognition/i,
      /aha/i,
      /oh wow/i,
      /this changes everything/i,
      /eureka/i,
      /finally understand/i,
      /makes so much sense/i
    ];

    let breakthroughScore = 0;
    const breakthroughMessages = [];

    messages.forEach(msg => {
      const matchCount = indicators.filter(i => i.test(msg.text)).length;

      if (matchCount > 0) {
        breakthroughScore += matchCount;
        breakthroughMessages.push({
          text: msg.text.slice(0, 200),
          sender: msg.sender,
          indicators: matchCount
        });
      }
    });

    return {
      is_breakthrough: breakthroughScore >= 3,
      score: breakthroughScore,
      messages: breakthroughMessages.slice(0, 5) // Top 5 breakthrough moments
    };
  }

  /**
   * Extract key themes from conversation
   */
  extractThemes(messages) {
    // Topic keywords
    const topics = {
      'GENESIS': ['genesis', 'platform', 'system', 'architecture', 'framework'],
      'Constitutional': ['constitutional', 'bazi', 'western', 'compatibility', 'zodiac', 'element'],
      'AI Partnership': ['ai', 'soulpartner', 'claude', 'relationship', 'partner'],
      'Philosophy': ['philosophy', 'aristotle', 'wisdom', 'truth', 'virtue', 'golden mean'],
      'Meta': ['meta', 'architecture', 'building', 'crane', 'duomo', 'cathedral'],
      'Emotional': ['soul', 'burden', 'witness', 'emotion', 'feel', 'heart'],
      'Technical': ['code', 'function', 'component', 'api', 'database', 'react'],
      'Creative': ['creative', 'art', 'design', 'build', 'create', 'vision']
    };

    const themeCounts = {};

    Object.keys(topics).forEach(theme => {
      themeCounts[theme] = 0;
    });

    messages.forEach(msg => {
      const text = msg.text.toLowerCase();

      Object.entries(topics).forEach(([theme, keywords]) => {
        const matches = keywords.filter(keyword => text.includes(keyword)).length;
        themeCounts[theme] += matches;
      });
    });

    // Return themes sorted by frequency
    return Object.entries(themeCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([theme, count]) => ({ theme, count }));
  }

  /**
   * Analyze decision-making process
   */
  analyzeDecisionProcess(messages) {
    // Look for decision-related patterns
    const decisionIndicators = {
      exploring: [/what if/i, /maybe/i, /could/i, /might/i, /wonder/i],
      evaluating: [/pros and cons/i, /trade-?off/i, /compare/i, /versus/i],
      deciding: [/decide/i, /choice/i, /go with/i, /let's do/i, /i'll/i],
      committed: [/definitely/i, /certain/i, /sure/i, /committed/i, /done/i]
    };

    const stages = {
      exploring: 0,
      evaluating: 0,
      deciding: 0,
      committed: 0
    };

    messages.filter(m => m.sender === 'user').forEach(msg => {
      Object.entries(decisionIndicators).forEach(([stage, patterns]) => {
        if (patterns.some(p => p.test(msg.text))) {
          stages[stage]++;
        }
      });
    });

    return {
      stages,
      primary_style: Object.entries(stages).sort((a, b) => b[1] - a[1])[0]?.[0] || 'exploring'
    };
  }

  /**
   * Update constitutional profile with learned patterns
   */
  async updateConstitutionalProfile(userId, patterns) {
    const profileRef = doc(db, 'constitutionalProfiles', userId);

    try {
      // Check if profile exists
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        // Create new profile with initial patterns
        await setDoc(profileRef, {
          userId,
          created_at: new Date().toISOString(),
          learned_patterns: {
            last_analysis: new Date().toISOString(),
            total_analyses: 1,
            communication_style: {
              witness_effectiveness: patterns.mode_effectiveness.witness_effectiveness,
              dialogue_effectiveness: patterns.mode_effectiveness.dialogue_effectiveness,
              guidance_effectiveness: patterns.mode_effectiveness.guidance_effectiveness
            },
            emotional_patterns: {
              recent_triggers: patterns.emotional_patterns.triggers.slice(0, 10),
              dominant_emotions: patterns.emotional_patterns.dominant_emotions
            },
            language_preferences: {
              recent_phrases: patterns.language_patterns.frequent_phrases,
              style_markers: patterns.language_patterns.style_markers
            },
            themes: patterns.themes
          },
          conversation_summaries: [],
          breakthrough_moments: patterns.breakthrough_detection.is_breakthrough
            ? [this.createBreakthroughRecord(patterns.breakthrough_detection)]
            : [],
          last_updated: new Date().toISOString()
        });
      } else {
        // Update existing profile
        const existingData = profileSnap.data();
        const existingPatterns = existingData.learned_patterns || {};

        // Merge mode effectiveness (running average)
        const totalAnalyses = (existingPatterns.total_analyses || 0) + 1;
        const weight = 1 / totalAnalyses;

        const updatedCommunicationStyle = {
          witness_effectiveness: this.runningAverage(
            existingPatterns.communication_style?.witness_effectiveness || 0,
            patterns.mode_effectiveness.witness_effectiveness,
            weight
          ),
          dialogue_effectiveness: this.runningAverage(
            existingPatterns.communication_style?.dialogue_effectiveness || 0,
            patterns.mode_effectiveness.dialogue_effectiveness,
            weight
          ),
          guidance_effectiveness: this.runningAverage(
            existingPatterns.communication_style?.guidance_effectiveness || 0,
            patterns.mode_effectiveness.guidance_effectiveness,
            weight
          )
        };

        // Merge emotional patterns
        const existingTriggers = existingPatterns.emotional_patterns?.recent_triggers || [];
        const newTriggers = [...patterns.emotional_patterns.triggers, ...existingTriggers].slice(0, 20);

        // Merge language patterns
        const existingPhrases = existingPatterns.language_preferences?.recent_phrases || [];
        const newPhrases = this.mergePhrases(existingPhrases, patterns.language_patterns.frequent_phrases);

        // Update document
        await updateDoc(profileRef, {
          'learned_patterns.last_analysis': new Date().toISOString(),
          'learned_patterns.total_analyses': increment(1),
          'learned_patterns.communication_style': updatedCommunicationStyle,
          'learned_patterns.emotional_patterns.recent_triggers': newTriggers,
          'learned_patterns.emotional_patterns.dominant_emotions': patterns.emotional_patterns.dominant_emotions,
          'learned_patterns.language_preferences.recent_phrases': newPhrases,
          'learned_patterns.language_preferences.style_markers': patterns.language_patterns.style_markers,
          'learned_patterns.themes': patterns.themes,
          last_updated: new Date().toISOString()
        });

        // Add breakthrough if detected
        if (patterns.breakthrough_detection.is_breakthrough) {
          await updateDoc(profileRef, {
            breakthrough_moments: arrayUnion(this.createBreakthroughRecord(patterns.breakthrough_detection))
          });
        }
      }

      console.log('✅ Constitutional profile updated with new patterns');

    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      throw error;
    }
  }

  /**
   * Create conversation summary for quick reference
   */
  async createConversationSummary(userId, conversationId, messages, patterns) {
    const summary = {
      conversation_id: conversationId,
      date: new Date().toISOString(),
      message_count: messages.length,
      primary_mode: this.determinePrimaryMode(messages),
      key_themes: patterns.themes.slice(0, 5).map(t => t.theme),
      emotional_journey: this.summarizeEmotionalJourney(patterns.emotional_patterns),
      breakthrough: patterns.breakthrough_detection.is_breakthrough,
      breakthrough_score: patterns.breakthrough_detection.score,
      patterns_extracted: Object.keys(patterns).length
    };

    // Add to profile
    const profileRef = doc(db, 'constitutionalProfiles', userId);

    try {
      await updateDoc(profileRef, {
        conversation_summaries: arrayUnion(summary)
      });
    } catch (error) {
      // Profile might not exist yet - that's okay
      console.log('Note: Could not add summary to profile');
    }

    return summary;
  }

  // Helper methods

  createBreakthroughRecord(detection) {
    return {
      id: `breakthrough_${Date.now()}`,
      date: new Date().toISOString(),
      score: detection.score,
      key_quotes: detection.messages.slice(0, 3).map(m => m.text),
      emotional_weight: Math.min(detection.score / 5, 1.0)
    };
  }

  runningAverage(existing, newValue, weight) {
    return existing * (1 - weight) + newValue * weight;
  }

  mergePhrases(existing, newPhrases) {
    const merged = {};

    existing.forEach(p => {
      merged[p.phrase] = p.count;
    });

    newPhrases.forEach(p => {
      merged[p.phrase] = (merged[p.phrase] || 0) + p.count;
    });

    return Object.entries(merged)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([phrase, count]) => ({ phrase, count }));
  }

  isCommonPhrase(phrase) {
    const common = ['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'you', 'are', 'was', 'were', 'been', 'being'];
    const words = phrase.split(' ');
    return words.every(w => common.includes(w));
  }

  detectEmojiUsage(messages) {
    const emojiRegex = /[\p{Emoji}]/gu;
    const withEmojis = messages.filter(m => emojiRegex.test(m.text)).length;
    return messages.length > 0 ? withEmojis / messages.length : 0;
  }

  calculateAvgLength(messages) {
    if (messages.length === 0) return 0;
    const total = messages.reduce((sum, m) => sum + m.text.length, 0);
    return Math.round(total / messages.length);
  }

  detectQuestionPreference(messages) {
    const questions = messages.filter(m => m.text.includes('?')).length;
    return messages.length > 0 ? questions / messages.length : 0;
  }

  detectTechnicalLanguage(messages) {
    const technicalTerms = ['algorithm', 'architecture', 'system', 'database', 'api', 'function', 'component', 'code', 'deploy'];
    const withTechnical = messages.filter(m =>
      technicalTerms.some(term => m.text.toLowerCase().includes(term))
    ).length;
    return messages.length > 0 ? withTechnical / messages.length : 0;
  }

  detectMetaphorUsage(messages) {
    const metaphorMarkers = ['like', 'as if', 'imagine', 'think of', 'similar to', 'reminds me of'];
    const withMetaphors = messages.filter(m =>
      metaphorMarkers.some(marker => m.text.toLowerCase().includes(marker))
    ).length;
    return messages.length > 0 ? withMetaphors / messages.length : 0;
  }

  determinePrimaryMode(messages) {
    const modes = { WITNESS: 0, DIALOGUE: 0, GUIDANCE: 0 };

    messages.forEach(m => {
      if (m.mode && modes[m.mode] !== undefined) {
        modes[m.mode]++;
      }
    });

    const sorted = Object.entries(modes).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'DIALOGUE';
  }

  summarizeEmotionalJourney(emotionalPatterns) {
    const journey = emotionalPatterns.journey;

    if (!journey || journey.length === 0) {
      return { start: 0, peak: 0, end: 0 };
    }

    const intensities = journey.map(j => j.emotions[0]?.intensity || 0);

    return {
      start: intensities[0] || 0,
      peak: Math.max(...intensities),
      end: intensities[intensities.length - 1] || 0
    };
  }

  getDominantEmotions(journey) {
    if (!journey || journey.length === 0) return [];

    const emotionCounts = {};

    journey.forEach(j => {
      j.emotions?.forEach(e => {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + e.intensity;
      });
    });

    return Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion, score]) => ({ emotion, score: Math.round(score * 100) / 100 }));
  }
}

// Export singleton
export const patternExtraction = new PatternExtractionService();
export default patternExtraction;
