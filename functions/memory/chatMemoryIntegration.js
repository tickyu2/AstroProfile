/**
 * Chat Memory Integration Module
 * ================================
 * Connects the 4-Brain PostgreSQL Memory System to Luna's conversations.
 *
 * This is where the synapses fire!
 *
 * Created: December 21, 2025
 * Updated: December 23, 2025 - Added Session Cache + Memory Optimization
 * Updated: December 28, 2024 - Added Knowledge RAG Integration (v2)
 * Mission: JOIE DE VIVRE - Help humans experience the LOVE of being alive
 */

const pgClient = require('../database/pgClient');
const { sessionCache } = require('./sessionCache');
const { optimizeMemories, formatMemoriesForPrompt, getOptimizationStats } = require('./memoryOptimization');

// Knowledge RAG integration (v2)
let knowledgeModule = null;
try {
  knowledgeModule = require('../knowledge');
  console.log('[ChatMemory] ✅ Knowledge RAG module loaded');
} catch (e) {
  console.log('[ChatMemory] ℹ️ Knowledge RAG module not available');
}

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
    includeCultural = false,
    conversationId = null  // NEW: For session cache
  } = options;

  try {
    console.log(`[ChatMemory] Retrieving memories for user ${userId}, profile ${profileId}`);

    // ========================================
    // OPTIMIZATION 1: Check Session Cache First
    // Auto-initialize on cache miss (first message of conversation)
    // ========================================
    let cachedIdentity = null;
    if (conversationId) {
      cachedIdentity = sessionCache.getSessionContext(conversationId);

      // Auto-initialize on cache miss (first message)
      if (!cachedIdentity && userId && profileId) {
        console.log('[ChatMemory] Session cache miss - initializing...');
        const initSuccess = await sessionCache.initSession(userId, conversationId, profileId);
        if (initSuccess) {
          cachedIdentity = sessionCache.getSessionContext(conversationId);
        }
      }
    }

    // Generate embedding for the user's message
    const queryEmbedding = await pgClient.generateEmbedding(userMessage);

    // ========================================
    // OPTIMIZATION 2: Parallel Retrieval (skip cached data)
    // ========================================
    const [
      userSTMResults,
      userLTMResults,
      partnerSTMResults,
      partnerLTMResults,
      userTimelineResults
    ] = await Promise.all([
      // User's recent memories (STM) - always fetch fresh
      pgClient.searchUserSTM(userId, profileId, userMessage, Math.ceil(limit / 2), threshold),

      // User's deep memories (LTM) - skip if we have cached core memories
      !cachedIdentity?.coreMemories?.length
        ? pgClient.searchUserLTM(userId, profileId, userMessage, Math.ceil(limit / 2), threshold)
        : [],

      // Luna's recent observations (Partner STM)
      includePartner ? pgClient.searchPartnerSTM(userId, profileId, userMessage, Math.ceil(limit / 4), threshold) : [],

      // Luna's evolved understanding (Partner LTM) - skip if we have cached calibration
      includePartner && !cachedIdentity?.calibration
        ? pgClient.searchPartnerLTM(userId, profileId, userMessage, Math.ceil(limit / 4), threshold)
        : [],

      // User's life events (Timeline)
      includeTimeline ? pgClient.searchUserTimeline(userId, profileId, userMessage, 3, threshold) : []
    ]);

    // ========================================
    // OPTIMIZATION 3: Deduplicate + Wisdom Boost
    // ========================================
    // Combine cached LTM with fetched LTM, then optimize
    const combinedUserLTM = [
      ...(cachedIdentity?.coreMemories || []),
      ...(userLTMResults || [])
    ];

    const optimizedUserMemories = optimizeMemories(combinedUserLTM, userSTMResults || [], limit);
    const optimizedPartnerMemories = optimizeMemories(partnerLTMResults || [], partnerSTMResults || [], Math.ceil(limit / 2));

    // Log optimization stats
    const userStats = getOptimizationStats(combinedUserLTM, userSTMResults || [], optimizedUserMemories);
    console.log(`[ChatMemory] User memories: ${userStats.input.total} → ${userStats.output.total} (${userStats.reduction.percentage}% reduction)`);

    // ========================================
    // Build the memory prompt with optimized memories
    // ========================================
    let memoryPrompt = '';

    // Cached facts (from session cache)
    if (cachedIdentity?.facts && cachedIdentity.facts.length > 0) {
      memoryPrompt += `### Core Facts (Cached Identity)\n`;
      cachedIdentity.facts.forEach((fact, i) => {
        memoryPrompt += `${i + 1}. ${fact.content}\n`;
      });
      memoryPrompt += '\n';
    }

    // Cached people (from session cache)
    if (cachedIdentity?.people && cachedIdentity.people.length > 0) {
      memoryPrompt += `### Important People in Their Life\n`;
      cachedIdentity.people.forEach((person, i) => {
        memoryPrompt += `${i + 1}. ${person.person_name} (${person.person_relationship || 'relationship unknown'})\n`;
      });
      memoryPrompt += '\n';
    }

    // Optimized user memories (STM-first, LTM boosted)
    if (optimizedUserMemories && optimizedUserMemories.length > 0) {
      memoryPrompt += formatMemoriesForPrompt(optimizedUserMemories);
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

    // Luna's Evolved Understanding (Partner LTM or Cached Calibration)
    if (cachedIdentity?.calibration) {
      memoryPrompt += `### Your Calibration (How to Best Support Them)\n`;
      const cal = cachedIdentity.calibration;
      if (cal.effective_approaches) {
        memoryPrompt += `Effective approaches: ${JSON.stringify(cal.effective_approaches)}\n`;
      }
      if (cal.sensitive_topics) {
        memoryPrompt += `Sensitive topics: ${JSON.stringify(cal.sensitive_topics)}\n`;
      }
      memoryPrompt += '\n';
    } else if (partnerLTMResults && partnerLTMResults.length > 0) {
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
      (cachedIdentity?.facts?.length || 0) +
      (cachedIdentity?.people?.length || 0) +
      (optimizedUserMemories?.length || 0) +
      (partnerSTMResults?.length || 0) +
      (optimizedPartnerMemories?.length || 0) +
      (userTimelineResults?.length || 0);

    if (totalMemories > 0) {
      console.log(`[ChatMemory] Retrieved ${totalMemories} relevant memories (optimized)`);
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
// KNOWLEDGE RAG INTEGRATION (v2)
// ============================================================================

/**
 * Retrieve full context combining personal memory + universal knowledge
 *
 * @param {string} userId - The user's Firebase UID
 * @param {string} profileId - The profile being discussed
 * @param {string} userMessage - The current user message
 * @param {Object} options - Additional options
 * @param {Object} options.userProfile - User's personality profile for knowledge lookup
 * @param {string} options.mode - 'voice' (<50ms) or 'text' (<500ms)
 * @returns {Promise<Object>} - { memoryPrompt, knowledgePrompt, fullContext }
 */
async function retrieveFullContext(userId, profileId, userMessage, options = {}) {
  const {
    userProfile = null,
    mode = 'text',
    conversationId = null,
    includeKnowledge = true,
    knowledgeTimeout = 400
  } = options;

  const startTime = Date.now();

  // Parallel retrieval: personal memory + universal knowledge
  const [memoryPrompt, knowledgeContext] = await Promise.all([
    // Personal memory (4-brain system)
    retrieveMemoriesForChat(userId, profileId, userMessage, {
      ...options,
      conversationId
    }),

    // Universal knowledge (Enneagram, BaZi, Big 5)
    includeKnowledge && knowledgeModule
      ? knowledgeModule.getKnowledgeContext({
          query: userMessage,
          profile: userProfile,
          mode,
          timeout: knowledgeTimeout
        })
      : { results: [], source: 'disabled' }
  ]);

  // Build knowledge prompt
  let knowledgePrompt = '';
  if (knowledgeContext.results?.length > 0 && knowledgeModule) {
    knowledgePrompt = knowledgeModule.buildKnowledgePromptContext(knowledgeContext);
  }

  // Combine into full context
  const fullContext = [memoryPrompt, knowledgePrompt].filter(Boolean).join('\n');

  const latency = Date.now() - startTime;
  console.log(`[ChatMemory] Full context retrieved in ${latency}ms (memory + ${knowledgeContext.source || 'no'} knowledge)`);

  return {
    memoryPrompt,
    knowledgePrompt,
    knowledgeSource: knowledgeContext.source,
    knowledgeResults: knowledgeContext.results?.length || 0,
    fullContext,
    latency
  };
}

/**
 * Get knowledge context only (without personal memory)
 * Useful for quick knowledge lookups in voice mode
 */
async function getKnowledgeOnly(query, userProfile = null, mode = 'text') {
  if (!knowledgeModule) {
    return { results: [], source: 'unavailable', promptContext: '' };
  }

  const context = await knowledgeModule.getKnowledgeContext({
    query,
    profile: userProfile,
    mode,
    timeout: mode === 'voice' ? 50 : 400
  });

  return {
    results: context.results,
    source: context.source,
    promptContext: knowledgeModule.buildKnowledgePromptContext(context)
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Memory Retrieval
  retrieveMemoriesForChat,

  // Full Context (Memory + Knowledge) - v2
  retrieveFullContext,
  getKnowledgeOnly,

  // Memory Storage
  analyzeMessageForMemory,
  storeUserMessageAsMemory,
  storeLunaObservation,

  // Session Cache (for init/clear at conversation boundaries)
  sessionCache,

  // Knowledge module reference
  knowledgeModule
};
