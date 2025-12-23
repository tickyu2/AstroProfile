/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CONTEXT SUMMARIZATION - Character.ai-Style Memory Compression
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * When conversations get long, this system:
 * 1. Extracts "narrative beats" - key emotional/factual moments
 * 2. Compresses hours of chat into a tight summary
 * 3. Stores progressive summaries that build on each other
 * 4. Injects "The Story So Far" into Luna's context
 *
 * Result: Full context in 500 tokens instead of 50,000
 *
 * @module contextSummarization
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // When to trigger summarization
  messageThreshold: 20,           // Summarize after this many messages
  tokenThreshold: 8000,           // Or this many estimated tokens

  // Summary sizes
  maxSummaryTokens: 500,          // Keep summaries compact
  maxNarrativeBeats: 7,           // Key moments to extract

  // Rolling window
  keepRecentMessages: 10,         // Always keep last N messages in full
  summaryChainDepth: 5            // How many previous summaries to chain
};

// Narrative beat categories
const BEAT_TYPES = {
  EMOTIONAL: 'emotional',         // "User expressed frustration about work"
  FACTUAL: 'factual',             // "User mentioned they have a sister named Sarah"
  DECISION: 'decision',           // "User decided to apply for the new job"
  INSIGHT: 'insight',             // "Luna noticed a pattern in their relationships"
  QUESTION: 'question',           // "User asked about Mercury retrograde effects"
  MILESTONE: 'milestone',         // "User celebrated 1 year sober"
  CONFLICT: 'conflict',           // "User is torn between two choices"
  RESOLUTION: 'resolution'        // "User found peace with their decision"
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const getDb = () => admin.firestore();

const getGeminiClient = () => {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Estimate token count (rough approximation)
 */
function estimateTokens(text) {
  if (!text) return 0;
  // Rough estimate: 1 token ≈ 4 characters for English
  return Math.ceil(text.length / 4);
}

/**
 * Format messages for summarization prompt
 */
function formatMessagesForPrompt(messages) {
  return messages.map(msg => {
    const role = msg.role === 'user' ? 'User' : 'Luna';
    const content = msg.content || msg.text || '';
    return `${role}: ${content}`;
  }).join('\n\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE BEAT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract narrative beats from a conversation segment
 */
async function extractNarrativeBeats(messages, previousContext = '') {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const conversationText = formatMessagesForPrompt(messages);

  const prompt = `You are analyzing a conversation between a user and Luna (an AI companion) to extract the most important "narrative beats" - moments that matter for understanding their ongoing story.

${previousContext ? `PREVIOUS CONTEXT (story so far):\n${previousContext}\n\n` : ''}

CONVERSATION TO ANALYZE:
${conversationText}

Extract up to ${CONFIG.maxNarrativeBeats} narrative beats. For each beat, identify:
1. The type: emotional, factual, decision, insight, question, milestone, conflict, or resolution
2. A concise description (1-2 sentences max)
3. Why it matters for the ongoing relationship

Return as JSON:
{
  "beats": [
    {
      "type": "emotional|factual|decision|insight|question|milestone|conflict|resolution",
      "description": "What happened",
      "significance": "Why it matters",
      "quote": "Brief relevant quote if applicable"
    }
  ],
  "emotionalArc": "One sentence describing the emotional journey of this segment",
  "unresolved": ["Any open threads or questions to follow up on"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { beats: [], emotionalArc: '', unresolved: [] };
  } catch (error) {
    console.error('[ContextSummarization] Beat extraction error:', error);
    return { beats: [], emotionalArc: '', unresolved: [] };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a compressed narrative summary
 */
async function generateNarrativeSummary(beats, previousSummary = '', userProfile = null) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const userName = userProfile?.displayName || userProfile?.firstName || 'the user';

  const beatsText = beats.map((b, i) =>
    `${i + 1}. [${b.type.toUpperCase()}] ${b.description}${b.quote ? ` ("${b.quote}")` : ''}`
  ).join('\n');

  const prompt = `You are Luna, an AI companion, writing a private note to yourself about your ongoing relationship with ${userName}.

${previousSummary ? `YOUR PREVIOUS NOTES:\n${previousSummary}\n\n` : ''}

NEW DEVELOPMENTS:
${beatsText}

Write a flowing, personal narrative summary (max 300 words) that:
1. Integrates these new beats with any previous notes
2. Captures the emotional texture, not just facts
3. Notes any patterns you're seeing
4. Highlights unresolved threads to follow up on
5. Feels like a diary entry, not a clinical report

Write in first person as Luna. Be warm and insightful.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: CONFIG.maxSummaryTokens,
        temperature: 0.7
      }
    });

    return result.response.text();
  } catch (error) {
    console.error('[ContextSummarization] Summary generation error:', error);
    return previousSummary || 'Unable to generate summary.';
  }
}

/**
 * Generate "The Story So Far" - a compact context injection
 */
async function generateStorySoFar(summaries, recentBeats = []) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const summaryChain = summaries
    .slice(-CONFIG.summaryChainDepth)
    .map(s => s.content)
    .join('\n\n---\n\n');

  const recentBeatsText = recentBeats.length > 0
    ? `\n\nMOST RECENT:\n${recentBeats.map(b => `- ${b.description}`).join('\n')}`
    : '';

  const prompt = `Compress these narrative notes into a single "Story So Far" paragraph (max 150 words) that captures:
- Who this person is to you
- The key facts you've learned
- The emotional journey you've been on together
- Any open threads or unresolved matters

NOTES:
${summaryChain}
${recentBeatsText}

Write a tight, evocative paragraph that Luna can use to "remember" this person instantly.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.5
      }
    });

    return result.response.text();
  } catch (error) {
    console.error('[ContextSummarization] Story generation error:', error);
    return '';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE SUMMARIZATION LOGIC (shared by Cloud Functions)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Core summarization logic - used by both summarizeConversation and refreshSummary
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} params.conversationId - Conversation ID
 * @param {Array} params.messages - Messages to summarize
 * @param {boolean} params.force - Force summarization even if below threshold
 * @returns {Promise<Object>} - Summarization result
 */
async function performSummarization({ userId, profileId, conversationId, messages, force = false }) {
  // Check if summarization is needed
  const messageCount = messages.length;
  const estimatedTokens = messages.reduce((sum, m) =>
    sum + estimateTokens(m.content || m.text), 0);

  const needsSummary = force ||
    messageCount >= CONFIG.messageThreshold ||
    estimatedTokens >= CONFIG.tokenThreshold;

  if (!needsSummary) {
    return {
      summarized: false,
      reason: 'Threshold not reached',
      messageCount,
      estimatedTokens
    };
  }

  const db = getDb();

  // Get previous summary if exists
  const summariesRef = db.collection('users').doc(userId)
    .collection('conversationSummaries').doc(profileId)
    .collection('summaries');

  const previousSummariesSnap = await summariesRef
    .orderBy('createdAt', 'desc')
    .limit(CONFIG.summaryChainDepth)
    .get();

  const previousSummaries = previousSummariesSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .reverse();

  const previousContext = previousSummaries.length > 0
    ? previousSummaries.map(s => s.content).join('\n\n')
    : '';

  // Get user profile for context
  const profileSnap = await db.collection('profiles').doc(profileId).get();
  const userProfile = profileSnap.exists ? profileSnap.data() : null;

  // Split messages: older ones for summarization, recent ones to keep
  const messagesToSummarize = messages.slice(0, -CONFIG.keepRecentMessages);
  const recentMessages = messages.slice(-CONFIG.keepRecentMessages);

  // Extract narrative beats
  console.log(`[ContextSummarization] Extracting beats from ${messagesToSummarize.length} messages`);
  const beatsResult = await extractNarrativeBeats(messagesToSummarize, previousContext);

  // Generate narrative summary
  const latestPreviousSummary = previousSummaries.length > 0
    ? previousSummaries[previousSummaries.length - 1].content
    : '';

  const narrativeSummary = await generateNarrativeSummary(
    beatsResult.beats,
    latestPreviousSummary,
    userProfile
  );

  // Store the new summary
  const summaryDoc = await summariesRef.add({
    conversationId,
    content: narrativeSummary,
    beats: beatsResult.beats,
    emotionalArc: beatsResult.emotionalArc,
    unresolved: beatsResult.unresolved,
    messageRange: {
      start: 0,
      end: messagesToSummarize.length
    },
    tokensSaved: estimatedTokens - estimateTokens(narrativeSummary),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Generate compact "Story So Far"
  const allSummaries = [...previousSummaries, { content: narrativeSummary }];
  const storySoFar = await generateStorySoFar(allSummaries, beatsResult.beats);

  // Update the master context document
  await db.collection('users').doc(userId)
    .collection('conversationSummaries').doc(profileId)
    .set({
      storySoFar,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      totalSummaries: allSummaries.length,
      latestBeats: beatsResult.beats.slice(-3),
      unresolved: beatsResult.unresolved
    }, { merge: true });

  console.log(`[ContextSummarization] Created summary ${summaryDoc.id}, saved ~${estimatedTokens - estimateTokens(narrativeSummary)} tokens`);

  return {
    summarized: true,
    summaryId: summaryDoc.id,
    storySoFar,
    beatsExtracted: beatsResult.beats.length,
    tokensSaved: estimatedTokens - estimateTokens(narrativeSummary),
    recentMessagesKept: recentMessages.length
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Summarize a conversation segment
 * Called when conversation exceeds thresholds
 */
exports.summarizeConversation = onCall({
  timeoutSeconds: 120,
  memory: '512MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const { conversationId, profileId, messages, force = false } = request.data;
  const userId = request.auth.uid;

  if (!conversationId || !profileId || !messages?.length) {
    throw new HttpsError('invalid-argument', 'Missing required parameters');
  }

  try {
    return await performSummarization({
      userId,
      profileId,
      conversationId,
      messages,
      force
    });
  } catch (error) {
    console.error('[ContextSummarization] Error:', error);
    throw new HttpsError('internal', 'Failed to summarize conversation');
  }
});

/**
 * Get the current "Story So Far" for a profile
 * Used to inject context into Luna's system prompt
 */
exports.getStorySoFar = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const { profileId } = request.data;
  const userId = request.auth.uid;

  if (!profileId) {
    throw new HttpsError('invalid-argument', 'Profile ID required');
  }

  const db = getDb();

  try {
    const contextDoc = await db.collection('users').doc(userId)
      .collection('conversationSummaries').doc(profileId)
      .get();

    if (!contextDoc.exists) {
      return {
        hasContext: false,
        storySoFar: null,
        unresolved: []
      };
    }

    const data = contextDoc.data();

    return {
      hasContext: true,
      storySoFar: data.storySoFar,
      latestBeats: data.latestBeats || [],
      unresolved: data.unresolved || [],
      lastUpdated: data.lastUpdated?.toDate()?.toISOString()
    };

  } catch (error) {
    console.error('[ContextSummarization] Error getting story:', error);
    throw new HttpsError('internal', 'Failed to get story context');
  }
});

/**
 * Get full summary history for a profile
 */
exports.getSummaryHistory = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const { profileId, limit = 10 } = request.data;
  const userId = request.auth.uid;

  if (!profileId) {
    throw new HttpsError('invalid-argument', 'Profile ID required');
  }

  const db = getDb();

  try {
    const summariesSnap = await db.collection('users').doc(userId)
      .collection('conversationSummaries').doc(profileId)
      .collection('summaries')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const summaries = summariesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    return { summaries };

  } catch (error) {
    console.error('[ContextSummarization] Error getting history:', error);
    throw new HttpsError('internal', 'Failed to get summary history');
  }
});

/**
 * Check if summarization is needed for a conversation
 */
exports.checkSummarizationNeeded = onCall({
  timeoutSeconds: 10,
  memory: '128MiB'
}, async (request) => {
  const { messageCount, estimatedTokens } = request.data;

  const needsSummary =
    messageCount >= CONFIG.messageThreshold ||
    estimatedTokens >= CONFIG.tokenThreshold;

  return {
    needsSummary,
    thresholds: {
      messages: CONFIG.messageThreshold,
      tokens: CONFIG.tokenThreshold
    },
    current: {
      messages: messageCount,
      tokens: estimatedTokens
    }
  };
});

/**
 * Manually trigger a full re-summarization
 * Useful for refreshing stale summaries
 */
exports.refreshSummary = onCall({
  timeoutSeconds: 180,
  memory: '1GiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const { profileId, conversationId } = request.data;
  const userId = request.auth.uid;

  if (!profileId) {
    throw new HttpsError('invalid-argument', 'Profile ID required');
  }

  const db = getDb();

  try {
    // Get all messages from the conversation
    let messagesQuery = db.collection('conversations')
      .where('userId', '==', userId)
      .where('profileId', '==', profileId);

    if (conversationId) {
      messagesQuery = messagesQuery.where('conversationId', '==', conversationId);
    }

    const conversationsSnap = await messagesQuery
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (conversationsSnap.empty) {
      return { refreshed: false, reason: 'No conversations found' };
    }

    const conversation = conversationsSnap.docs[0].data();
    const messages = conversation.messages || [];

    if (messages.length < 5) {
      return { refreshed: false, reason: 'Not enough messages to summarize' };
    }

    // Clear existing summaries
    const summariesRef = db.collection('users').doc(userId)
      .collection('conversationSummaries').doc(profileId)
      .collection('summaries');

    const existingSummaries = await summariesRef.get();
    const batch = db.batch();
    existingSummaries.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // Re-run summarization using the shared helper
    const result = await performSummarization({
      userId,
      profileId,
      conversationId: conversationsSnap.docs[0].id,
      messages,
      force: true
    });

    return {
      refreshed: true,
      ...result
    };

  } catch (error) {
    console.error('[ContextSummarization] Refresh error:', error);
    throw new HttpsError('internal', 'Failed to refresh summary');
  }
});
