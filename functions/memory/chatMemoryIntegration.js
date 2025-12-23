/**
 * Chat Memory Integration Module
 * ================================
 * Connects the 4-Brain PostgreSQL Memory System to Luna's conversations.
 *
 * This is where the synapses fire!
 *
 * Created: December 21, 2025
 * Mission: JOIE DE VIVRE - Help humans experience the LOVE of being alive
 */

const pgClient = require('../database/pgClient');

// ============================================================================
// MEMORY RETRIEVAL FOR CHAT
// ============================================================================

/**
 * Retrieve and format memories for inclusion in Luna's system prompt
 *
 * @param {string} userId - The user's Firebase UID
 * @param {string} profileId - The profile being discussed
 * @param {string} userMessage - The current user message (for semantic search)
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Formatted memory prompt for Luna
 */
async function retrieveMemoriesForChat(userId, profileId, userMessage, options = {}) {
  const {
    limit = 10,
    threshold = 0.6,
    includePartner = true,
    includeTimeline = true,
    includeCultural = false
  } = options;

  try {
    console.log(`[ChatMemory] Retrieving memories for user ${userId}, profile ${profileId}`);

    // Generate embedding for the user's message
    const queryEmbedding = await pgClient.generateEmbedding(userMessage);

    // Search all memory types in parallel for speed
    const [
      userSTMResults,
      userLTMResults,
      partnerSTMResults,
      partnerLTMResults,
      userTimelineResults
    ] = await Promise.all([
      // User's recent memories (STM)
      pgClient.searchUserSTM(userId, profileId, userMessage, Math.ceil(limit / 3), threshold),

      // User's deep memories (LTM)
      pgClient.searchUserLTM(userId, profileId, userMessage, Math.ceil(limit / 3), threshold),

      // Luna's recent observations (Partner STM)
      includePartner ? pgClient.searchPartnerSTM(userId, profileId, userMessage, Math.ceil(limit / 4), threshold) : [],

      // Luna's evolved understanding (Partner LTM)
      includePartner ? pgClient.searchPartnerLTM(userId, profileId, userMessage, Math.ceil(limit / 4), threshold) : [],

      // User's life events (Timeline)
      includeTimeline ? pgClient.searchUserTimeline(userId, profileId, userMessage, 3, threshold) : []
    ]);

    // Build the memory prompt
    let memoryPrompt = '';

    // User's Recent Memories (STM)
    if (userSTMResults && userSTMResults.length > 0) {
      memoryPrompt += `### Recent Context (User's Short-Term Memory)\n`;
      userSTMResults.forEach((mem, i) => {
        memoryPrompt += `${i + 1}. [${mem.content_type}] ${mem.content}\n`;
        if (mem.emotional_valence) {
          const emotion = mem.emotional_valence > 0 ? 'positive' : mem.emotional_valence < 0 ? 'difficult' : 'neutral';
          memoryPrompt += `   (Emotional context: ${emotion})\n`;
        }
      });
      memoryPrompt += '\n';
    }

    // User's Deep Memories (LTM)
    if (userLTMResults && userLTMResults.length > 0) {
      memoryPrompt += `### Deep Knowledge (User's Long-Term Memory)\n`;
      userLTMResults.forEach((mem, i) => {
        memoryPrompt += `${i + 1}. [${mem.content_type}] ${mem.content}\n`;
        if (mem.is_person && mem.person_name) {
          memoryPrompt += `   (Person: ${mem.person_name} - ${mem.person_relationship || 'relationship unknown'})\n`;
        }
      });
      memoryPrompt += '\n';
    }

    // Luna's Recent Observations (Partner STM)
    if (partnerSTMResults && partnerSTMResults.length > 0) {
      memoryPrompt += `### Your Recent Observations (What You've Noticed)\n`;
      partnerSTMResults.forEach((obs, i) => {
        memoryPrompt += `${i + 1}. ${obs.observation}\n`;
        if (obs.approach_used && obs.effectiveness_rating) {
          memoryPrompt += `   (Approach: ${obs.approach_used} - effectiveness: ${obs.effectiveness_rating})\n`;
        }
      });
      memoryPrompt += '\n';
    }

    // Luna's Evolved Understanding (Partner LTM)
    if (partnerLTMResults && partnerLTMResults.length > 0) {
      memoryPrompt += `### Your Evolved Understanding (What You've Learned About Them)\n`;
      partnerLTMResults.forEach((insight, i) => {
        memoryPrompt += `${i + 1}. [${insight.insight_type}] ${insight.insight}\n`;
        if (insight.confidence_score) {
          memoryPrompt += `   (Confidence: ${Math.round(insight.confidence_score * 100)}%)\n`;
        }
      });
      memoryPrompt += '\n';
    }

    // User Timeline Events
    if (userTimelineResults && userTimelineResults.length > 0) {
      memoryPrompt += `### Life Events (Biographical Timeline)\n`;
      userTimelineResults.forEach((event, i) => {
        const dateStr = event.event_date || `${event.event_year}`;
        memoryPrompt += `${i + 1}. [${dateStr}] ${event.event_description}\n`;
        if (event.life_impact) {
          memoryPrompt += `   (Impact: ${event.life_impact})\n`;
        }
      });
      memoryPrompt += '\n';
    }

    // Add summary stats
    const totalMemories =
      (userSTMResults?.length || 0) +
      (userLTMResults?.length || 0) +
      (partnerSTMResults?.length || 0) +
      (partnerLTMResults?.length || 0) +
      (userTimelineResults?.length || 0);

    if (totalMemories > 0) {
      console.log(`[ChatMemory] Retrieved ${totalMemories} relevant memories`);
    } else {
      console.log(`[ChatMemory] No relevant memories found for this context`);
      memoryPrompt = `No specific memories retrieved for this conversation context. This may be a new topic or early in the relationship.`;
    }

    return memoryPrompt;

  } catch (error) {
    console.error('[ChatMemory] Error retrieving memories:', error);
    // Fail gracefully - return empty prompt rather than breaking chat
    return '';
  }
}

// ============================================================================
// MEMORY EXTRACTION & STORAGE
// ============================================================================

/**
 * Analyze a user message and extract memories worth storing
 * Uses lightweight heuristics - not every message needs to be stored
 *
 * @param {string} message - The user's message
 * @param {Object} context - Conversation context
 * @returns {Object|null} - Memory data to store, or null if not worth storing
 */
function analyzeMessageForMemory(message, context = {}) {
  // Skip very short messages
  if (!message || message.length < 20) {
    return null;
  }

  // Indicators of memory-worthy content
  const memoryIndicators = {
    // Personal facts
    facts: /\b(my|i am|i'm|i have|i've|i work|i live|i was born|my name|i grew up)\b/i,

    // Relationships/People
    people: /\b(my (mother|father|mom|dad|wife|husband|son|daughter|brother|sister|friend|boss|partner|girlfriend|boyfriend)|named|called)\b/i,

    // Emotions
    emotions: /\b(i feel|i felt|makes me|i love|i hate|i'm (happy|sad|angry|anxious|excited|worried|scared|frustrated))\b/i,

    // Life events
    events: /\b(happened|yesterday|last (week|month|year)|when i was|i remember|i used to|we went|i started|i quit|i got (married|divorced|promoted|fired))\b/i,

    // Goals/Dreams
    goals: /\b(i want to|i hope|i dream|i wish|my goal|someday|planning to|going to)\b/i,

    // Values/Beliefs
    values: /\b(i believe|i think|important to me|matters to me|i value)\b/i,

    // Struggles
    struggles: /\b(struggling with|hard for me|difficult|challenge|problem|issue|can't seem to)\b/i
  };

  // Check for indicators
  const matchedTypes = [];
  let importanceScore = 0.3; // Base score

  for (const [type, pattern] of Object.entries(memoryIndicators)) {
    if (pattern.test(message)) {
      matchedTypes.push(type);
      importanceScore += 0.1; // Increase importance for each match
    }
  }

  // If no indicators matched, not worth storing
  if (matchedTypes.length === 0) {
    return null;
  }

  // Determine content type
  let contentType = 'general';
  if (matchedTypes.includes('people')) contentType = 'relationship';
  else if (matchedTypes.includes('emotions')) contentType = 'emotion';
  else if (matchedTypes.includes('events')) contentType = 'event';
  else if (matchedTypes.includes('goals')) contentType = 'goal';
  else if (matchedTypes.includes('facts')) contentType = 'fact';
  else if (matchedTypes.includes('struggles')) contentType = 'concern';

  // Detect emotional valence (simplified)
  let emotionalValence = 0;
  if (/\b(happy|excited|love|great|wonderful|amazing|grateful)\b/i.test(message)) {
    emotionalValence = 0.7;
  } else if (/\b(sad|angry|frustrated|worried|scared|hate|terrible|awful)\b/i.test(message)) {
    emotionalValence = -0.7;
  }

  // Cap importance score
  importanceScore = Math.min(importanceScore, 0.9);

  return {
    content: message,
    contentType,
    importanceScore,
    emotionalValence,
    emotionalIntensity: Math.abs(emotionalValence),
    matchedTypes
  };
}

/**
 * Store a user's message as a memory if it's worth remembering
 *
 * @param {string} userId - The user's Firebase UID
 * @param {string} profileId - The profile being discussed
 * @param {string} message - The user's message
 * @param {string} sessionId - Current session ID
 * @returns {Promise<Object|null>} - Stored memory or null if not stored
 */
async function storeUserMessageAsMemory(userId, profileId, message, sessionId = null) {
  try {
    const memoryData = analyzeMessageForMemory(message);

    if (!memoryData) {
      return null; // Not worth storing
    }

    console.log(`[ChatMemory] Storing user memory: ${memoryData.contentType} (importance: ${memoryData.importanceScore})`);

    const result = await pgClient.storeUserSTM({
      userId,
      profileId,
      content: memoryData.content,
      contentType: memoryData.contentType,
      importanceScore: memoryData.importanceScore,
      emotionalValence: memoryData.emotionalValence,
      emotionalIntensity: memoryData.emotionalIntensity,
      sourceSessionId: sessionId,
      sourceMessageRole: 'user'
    });

    return result;

  } catch (error) {
    console.error('[ChatMemory] Error storing user memory:', error);
    return null; // Fail gracefully
  }
}

/**
 * Store Luna's observation about the conversation
 * Called after Luna responds with notable insights
 *
 * @param {string} userId - The user's Firebase UID
 * @param {string} profileId - The profile being discussed
 * @param {string} observation - Luna's observation
 * @param {Object} metadata - Additional context
 * @returns {Promise<Object|null>} - Stored observation or null
 */
async function storeLunaObservation(userId, profileId, observation, metadata = {}) {
  try {
    const {
      sessionId = null,
      observationType = 'session_note',
      emotionalArc = null,
      effectivenessRating = null,
      approachUsed = null,
      userResponse = null
    } = metadata;

    console.log(`[ChatMemory] Storing Luna observation: ${observationType}`);

    const result = await pgClient.storePartnerSTM({
      userId,
      profileId,
      observation,
      observationType,
      sessionId,
      emotionalArc,
      effectivenessRating,
      approachUsed,
      userResponse
    });

    return result;

  } catch (error) {
    console.error('[ChatMemory] Error storing Luna observation:', error);
    return null; // Fail gracefully
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Memory Retrieval
  retrieveMemoriesForChat,

  // Memory Storage
  analyzeMessageForMemory,
  storeUserMessageAsMemory,
  storeLunaObservation
};
