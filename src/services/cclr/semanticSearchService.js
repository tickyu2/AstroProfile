/**
 * CCLR Semantic Search Service
 *
 * Provides vector-based semantic search over CCLR conversations.
 * Uses Gemini embeddings (768-dim) following GENESIS Brain 2/8 pattern.
 *
 * Features:
 * - Search by semantic meaning (not just keywords)
 * - Filter by speaker, angel couple, time period
 * - Find related messages across conversations
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

/**
 * Semantic search over CCLR messages
 *
 * @param {string} sessionId - The session to search in
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results with relevance scores
 */
export async function searchCCLRMessages(sessionId, query, options = {}) {
  try {
    const searchCCLRConversations = httpsCallable(functions, 'searchCCLRConversations');

    const result = await searchCCLRConversations({
      sessionId,
      query,
      topK: options.topK || 10,
      filters: {
        speaker: options.speaker || null,           // "partnerA", "partnerB", "angelC", "angelD"
        guestCoupleId: options.guestCoupleId || null, // Filter by angel couple
        isHuman: options.isHuman,                   // true/false/null (any)
        isAI: options.isAI,                         // true/false/null (any)
        startDate: options.startDate || null,       // ISO date string
        endDate: options.endDate || null,           // ISO date string
        markedHelpful: options.markedHelpful || null
      }
    });

    return {
      success: true,
      results: result.data.results,
      query: query,
      searchTime: result.data.searchTime
    };
  } catch (error) {
    console.error('Error searching CCLR messages:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

/**
 * Search for messages by a specific angel across all sessions
 *
 * @param {string} userId - The user's ID (to find their sessions)
 * @param {string} guestPersonId - The angel's person ID (e.g., "michelle_obama")
 * @param {string} query - The search query
 * @returns {Promise<Object>} Search results
 */
export async function searchAngelWisdom(userId, guestPersonId, query) {
  try {
    const searchAngelMessages = httpsCallable(functions, 'searchAngelMessages');

    const result = await searchAngelMessages({
      userId,
      guestPersonId,
      query,
      topK: 15
    });

    return {
      success: true,
      results: result.data.results,
      angelName: result.data.angelName,
      query: query
    };
  } catch (error) {
    console.error('Error searching angel wisdom:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

/**
 * Search for messages about a specific topic across sessions
 *
 * @param {string} userId - The user's ID
 * @param {string} topic - The topic to search for
 * @returns {Promise<Object>} Search results grouped by angel
 */
export async function searchByTopic(userId, topic) {
  try {
    const searchCCLRByTopic = httpsCallable(functions, 'searchCCLRByTopic');

    const result = await searchCCLRByTopic({
      userId,
      topic,
      topK: 20
    });

    // Group results by angel for better presentation
    const groupedByAngel = {};
    result.data.results.forEach(msg => {
      if (msg.isAI && msg.guestPersonId) {
        if (!groupedByAngel[msg.guestPersonId]) {
          groupedByAngel[msg.guestPersonId] = {
            angelName: msg.speakerName,
            coupleName: msg.coupleName,
            messages: []
          };
        }
        groupedByAngel[msg.guestPersonId].messages.push(msg);
      }
    });

    return {
      success: true,
      results: result.data.results,
      groupedByAngel,
      topic: topic
    };
  } catch (error) {
    console.error('Error searching by topic:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

/**
 * Find similar messages to a given message
 *
 * @param {string} messageId - The message ID to find similar messages for
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Similar messages
 */
export async function findSimilarMessages(messageId, options = {}) {
  try {
    const findSimilarCCLRMessages = httpsCallable(functions, 'findSimilarCCLRMessages');

    const result = await findSimilarCCLRMessages({
      messageId,
      topK: options.topK || 5,
      excludeSameSession: options.excludeSameSession || false
    });

    return {
      success: true,
      results: result.data.results,
      sourceMessage: result.data.sourceMessage
    };
  } catch (error) {
    console.error('Error finding similar messages:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

/**
 * Get angel wisdom summary on a topic
 * Combines semantic search with AI synthesis
 *
 * @param {string} sessionId - The session ID
 * @param {string} query - The topic/question
 * @returns {Promise<Object>} Synthesized wisdom from angels
 */
export async function getAngelWisdomSummary(sessionId, query) {
  try {
    // First, search for relevant messages
    const searchResult = await searchCCLRMessages(sessionId, query, {
      isAI: true,
      topK: 10
    });

    if (!searchResult.success || searchResult.results.length === 0) {
      return {
        success: false,
        error: 'No relevant angel wisdom found',
        results: []
      };
    }

    // Then, synthesize the wisdom
    const synthesizeAngelWisdom = httpsCallable(functions, 'synthesizeAngelWisdom');

    const synthesisResult = await synthesizeAngelWisdom({
      messages: searchResult.results,
      query: query
    });

    return {
      success: true,
      synthesis: synthesisResult.data.synthesis,
      sources: searchResult.results,
      angelsConsulted: synthesisResult.data.angelsConsulted
    };
  } catch (error) {
    console.error('Error getting angel wisdom summary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Search partner messages for patterns
 *
 * @param {string} sessionId - The session ID
 * @param {string} partnerId - "partnerA" or "partnerB"
 * @param {string} query - What to search for
 * @returns {Promise<Object>} Relevant partner messages
 */
export async function searchPartnerMessages(sessionId, partnerId, query) {
  try {
    const result = await searchCCLRMessages(sessionId, query, {
      speaker: partnerId,
      topK: 10
    });

    return result;
  } catch (error) {
    console.error('Error searching partner messages:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

/**
 * Search for emotional themes in conversations
 *
 * @param {string} sessionId - The session ID
 * @param {string} emotion - The emotion to search for (e.g., "resentment", "gratitude", "fear")
 * @returns {Promise<Object>} Messages related to that emotion
 */
export async function searchByEmotion(sessionId, emotion) {
  try {
    // Map emotions to search terms for better results
    const emotionQueries = {
      'resentment': 'feeling resentful, resentment building, resent, bitter',
      'gratitude': 'thankful, grateful, appreciate, appreciation',
      'fear': 'scared, afraid, worried, anxious, fear',
      'love': 'love, cherish, adore, care deeply',
      'anger': 'angry, frustrated, mad, upset',
      'sadness': 'sad, hurt, disappointed, lonely',
      'joy': 'happy, joyful, delighted, excited',
      'hope': 'hopeful, optimistic, looking forward'
    };

    const query = emotionQueries[emotion.toLowerCase()] || emotion;

    const result = await searchCCLRMessages(sessionId, query, {
      topK: 15
    });

    return {
      success: true,
      emotion: emotion,
      results: result.results
    };
  } catch (error) {
    console.error('Error searching by emotion:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

/**
 * Get conversation highlights
 * Finds the most impactful messages based on helpfulness and semantic importance
 *
 * @param {string} sessionId - The session ID
 * @returns {Promise<Object>} Conversation highlights
 */
export async function getConversationHighlights(sessionId) {
  try {
    const getCCLRHighlights = httpsCallable(functions, 'getCCLRHighlights');

    const result = await getCCLRHighlights({
      sessionId,
      includeHelpful: true,
      includeSaved: true,
      topK: 10
    });

    return {
      success: true,
      highlights: result.data.highlights,
      helpfulMessages: result.data.helpfulMessages,
      savedMessages: result.data.savedMessages
    };
  } catch (error) {
    console.error('Error getting conversation highlights:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  searchCCLRMessages,
  searchAngelWisdom,
  searchByTopic,
  findSimilarMessages,
  getAngelWisdomSummary,
  searchPartnerMessages,
  searchByEmotion,
  getConversationHighlights
};
