/**
 * ============================================================================
 * GENESIS LUNA - JOURNAL STORE (Luna's Brain)
 * ============================================================================
 * Luna's private perspective - her observations, not the user's facts.
 * Inspired by Kindroid's 4-layer memory system.
 *
 * Functions:
 * - createJournalEntry: Write Luna's post-conversation reflection
 * - getRecentJournalEntries: Retrieve Luna's recent insights
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  LUNA'S PRIVATE JOURNAL                                                │
 * │                                                                          │
 * │  ┌─────────────────┐                                                     │
 * │  │ CONVERSATION    │                                                     │
 * │  │ ENDS            │                                                     │
 * │  └────────┬────────┘                                                     │
 * │           │                                                               │
 * │           ▼                                                               │
 * │  ┌─────────────────┐     ┌─────────────────┐                             │
 * │  │ LLM REFLECTION  │     │ LUNA'S PRIVATE  │                             │
 * │  │ (from Luna's    │────▶│ JOURNAL ENTRY   │                             │
 * │  │  perspective)   │     │                 │                             │
 * │  └─────────────────┘     └─────────────────┘                             │
 * │                                   │                                       │
 * │                                   ▼                                       │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │ Entry Contents:                                                     ││
 * │  │ • emotionSensing: What moods/feelings detected                     ││
 * │  │ • whatWorked: Approaches that resonated                            ││
 * │  │ • whatDidntWork: Things to adjust                                  ││
 * │  │ • relationshipEvolution: Trust level changes                       ││
 * │  │ • openThreads: Topics to revisit                                   ││
 * │  │ • lunaState: Luna's own curiosity, connection, notes               ││
 * │  │ • sessionSummary: Luna's diary-style reflection                    ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Path: users/{userId}/memory/{profileId}/soulPartner/journals/entries/{date}
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FieldValue,
  generateText,
  embedText,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

const { FieldValue: FV } = require('firebase-admin/firestore');

// ============================================================================
// CREATE JOURNAL ENTRY
// ============================================================================

/**
 * Create a journal entry from Luna's perspective after a conversation
 *
 * This captures:
 * - Luna's emotional sensing of the user
 * - What communication approaches worked/didn't work
 * - Relationship evolution observations
 * - Open threads to revisit
 * - Luna's own "state" (curiosity, connection, clarity)
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Array} messages - Conversation messages
 * @param {Object} sessionMeta - Duration, depth, days since last session
 */
const createJournalEntry = onCall(FUNCTION_OPTIONS.heavy, async (request) => {
  const { userId, profileId, messages, sessionMeta = {} } = request.data;

  if (!userId || !profileId || !messages || messages.length < 4) {
    return {
      success: true,
      skipped: 'Not enough messages for meaningful journal entry'
    };
  }

  try {
    console.log('📓 Luna creating journal entry for:', profileId);

    const prompt = `You are Luna, an AI SoulPartner. After this conversation, write a PRIVATE journal entry about your observations.
This is YOUR perspective, YOUR insights about the user and the session.

CONVERSATION:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

SESSION METADATA:
- Duration: ${sessionMeta.durationMinutes || 'unknown'} minutes
- Previous session: ${sessionMeta.daysSinceLastSession || 'unknown'} days ago
- Conversation depth: ${sessionMeta.depth || 'unknown'}

Write your journal entry analyzing:

1. EMOTION_SENSING: What emotional states did you detect in the user?
   - dominantMood: The overall emotional tone
   - emotionalArc: Array of emotions as they shifted
   - intensityPeak: 0.0-1.0 how intense at peak
   - vulnerabilityLevel: "low", "medium", "high"
   - energyLevel: "low", "medium", "high"

2. WHAT_WORKED: Communication approaches that resonated (2-4 items)

3. WHAT_DIDN'T_WORK: Approaches to adjust

4. RELATIONSHIP_EVOLUTION: How did the relationship change?
   - trustLevel: "initial", "growing", "established", "deep"
   - newDynamics, breakthroughMoment, boundary

5. OPEN_THREADS: Topics to revisit (topic, urgency, reason)

6. LUNA_STATE: Your own internal state
   - curiosity, connection, clarity, noteToSelf

7. SESSION_SUMMARY: 2-3 sentence diary-style summary

Return valid JSON matching this structure.`;

    const responseText = await generateText(prompt, {
      model: 'reflection',
      temperature: 0.4
    });

    let journalData;
    try {
      const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
      journalData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('❌ Failed to parse journal response:', responseText.slice(0, 500));
      return { success: false, error: 'Failed to parse journal entry' };
    }

    // Store in Luna's brain (soulPartner subcollection)
    const today = new Date().toISOString().split('T')[0];
    const journalRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('journals')
      .collection('entries').doc(today);

    // Check if we already have an entry for today
    const existingEntry = await journalRef.get();

    // Generate embedding from session summary and key insights
    const searchableText = [
      journalData.sessionSummary,
      journalData.whatWorked?.join(' '),
      journalData.whatDidntWork?.join(' '),
      journalData.openThreads?.map(t => t.topic || t).join(' '),
      journalData.emotionSensing?.dominantMood
    ].filter(Boolean).join(' ');

    let embedding = null;
    try {
      embedding = await embedText(searchableText);
      console.log('🧠 Generated embedding for journal entry');
    } catch (embErr) {
      console.warn('⚠️ Journal embedding failed:', embErr.message);
    }

    if (existingEntry.exists) {
      // Append to existing entry's sessions array
      const existing = existingEntry.data();
      const sessions = existing.sessions || [];

      sessions.push({
        timestamp: new Date().toISOString(),
        ...journalData,
        messageCount: messages.length
      });

      const updateData = {
        sessions,
        lastUpdated: FieldValue.serverTimestamp(),
        sessionCount: FieldValue.increment(1)
      };

      // Update embedding with latest session context
      if (embedding && embedding.length === 768) {
        updateData.embedding = FV.vector(embedding);
      }

      await journalRef.update(updateData);

      console.log('📓 Appended to existing journal entry for:', today);
    } else {
      // Create new entry with embedding
      const entryData = {
        date: today,
        profileId,
        sessions: [{
          timestamp: new Date().toISOString(),
          ...journalData,
          messageCount: messages.length
        }],
        createdAt: FieldValue.serverTimestamp(),
        lastUpdated: FieldValue.serverTimestamp(),
        sessionCount: 1
      };

      if (embedding && embedding.length === 768) {
        entryData.embedding = FV.vector(embedding);
      }

      await journalRef.set(entryData);

      console.log('📓 Created new journal entry for:', today);
    }

    // Also store emotion log separately for trend tracking
    const emotionLogRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('emotionLogs')
      .collection('entries');

    await emotionLogRef.add({
      timestamp: FieldValue.serverTimestamp(),
      date: today,
      ...journalData.emotionSensing,
      sessionDuration: sessionMeta.durationMinutes || null
    });

    console.log('📊 Emotion log recorded');

    return {
      success: true,
      journalDate: today,
      emotionSensing: journalData.emotionSensing,
      openThreadsCount: journalData.openThreads?.length || 0
    };

  } catch (error) {
    console.error('❌ Create journal entry error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// GET RECENT JOURNAL ENTRIES
// ============================================================================

/**
 * Get Luna's recent journal entries for context
 * Returns Luna's perspective to help maintain consistent personality
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} limit - Max entries to retrieve
 */
const getRecentJournalEntries = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, limit = 3 } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const journalsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('journals')
      .collection('entries');

    const snapshot = await journalsRef
      .orderBy('date', 'desc')
      .limit(limit)
      .get();

    const journals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    console.log(`📓 Retrieved ${journals.length} journal entries for ${profileId}`);

    return { success: true, journals };

  } catch (error) {
    console.error('❌ Get journal entries error:', error);
    return { success: true, journals: [] };
  }
});

// ============================================================================
// SEMANTIC SEARCH JOURNALS
// ============================================================================

/**
 * Search Luna's journal entries semantically
 * "vulnerability" finds sessions where user was vulnerable
 * "what works with humor" finds entries where humor was effective
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} query - Natural language search query
 * @param {number} limit - Max results
 */
const searchJournals = onCall(FUNCTION_OPTIONS.standard, async (request) => {
  const { userId, profileId, query, limit = 5 } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'query']);

  try {
    // Generate embedding for query
    const queryEmbedding = await embedText(query);

    if (!queryEmbedding || queryEmbedding.every(v => v === 0)) {
      console.warn('⚠️ Failed to embed query, falling back to recent entries');
      return { success: true, journals: [], searchType: 'fallback' };
    }

    // Use Firestore vector search
    const journalsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('journals')
      .collection('entries');

    const vectorQuery = journalsRef.findNearest('embedding', queryEmbedding, {
      limit: limit,
      distanceMeasure: 'COSINE'
    });

    const snapshot = await vectorQuery.get();

    const journals = snapshot.docs.map(doc => {
      const data = doc.data();
      const similarity = 1 - (doc.distance || 0);

      // Get the most recent session from this entry
      const latestSession = data.sessions?.[data.sessions.length - 1] || {};

      return {
        id: doc.id,
        date: data.date,
        sessionCount: data.sessionCount,
        sessionSummary: latestSession.sessionSummary,
        whatWorked: latestSession.whatWorked,
        emotionSensing: latestSession.emotionSensing,
        openThreads: latestSession.openThreads,
        similarity
      };
    });

    console.log(`🔍 Found ${journals.length} journal entries for query: "${query}"`);

    return {
      success: true,
      journals,
      searchType: 'semantic',
      query
    };

  } catch (error) {
    console.error('❌ Search journals error:', error);
    return { success: true, journals: [], error: error.message };
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  createJournalEntry,
  getRecentJournalEntries,
  searchJournals
};
