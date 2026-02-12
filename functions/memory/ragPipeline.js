/**
 * RAG Pipeline + Journal + Patterns
 *
 * Unified memory context retrieval (main RAG engine), pending questions,
 * timeline search, journal entries, emotion trends, and learned patterns.
 * Lines ~1094-2019 from the original memoryFunctions.js
 */

const { onCall, admin, db, getGeminiClient, generateEmbedding } = require('./memoryShared');

// Lazy-load sibling modules to avoid circular dependencies
// getMemoryContext calls functions from memoryCrud, reflectionEngine, and this module
let _memoryCrud, _reflectionEngine;
function getCrud() {
  if (!_memoryCrud) _memoryCrud = require('./memoryCrud');
  return _memoryCrud;
}
function getReflection() {
  if (!_reflectionEngine) _reflectionEngine = require('./reflectionEngine');
  return _reflectionEngine;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET FULL MEMORY CONTEXT - Unified retrieval for RAG pipeline
// ═══════════════════════════════════════════════════════════════════════════

exports.getMemoryContext = onCall({
  memory: '1GiB',
  timeoutSeconds: 90,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    userMessage,
    options = {}
  } = request.data;

  if (!userId || !profileId || !userMessage) {
    throw new Error('Missing required fields');
  }

  const startTime = Date.now();

  try {
    console.log('🧠 Getting full memory context for:', userId, profileId);

    const crud = getCrud();
    const reflection = getReflection();

    // Lazy-load personality module for getPersonalityWeights
    const personalitySystem = require('./personalitySystem');
    // Lazy-load tango module for getRelationshipStats
    const tangoRelationship = require('./tangoRelationship');

    // Parallel retrieval from all sources (User's Brain + Luna's Brain + Tango)
    const [
      factsResult,
      memoriesResult,
      peopleResult,
      anchorsResult,
      questionsResult,
      timelineResult,
      biographyEventsResult,  // Biography events from conversation extraction
      // Luna's Brain (SoulPartner's perspective)
      lunaJournalsResult,
      lunaPatternsResult,
      emotionTrendsResult,
      personalityWeightsResult,
      // Tango Identity System (Luna's relationship awareness)
      relationshipStatsResult
    ] = await Promise.all([
      // ═══ USER'S BRAIN ═══
      // Get permanent facts
      crud.getFacts.run({ data: { userId, profileId, limit: 10 } }),

      // Get semantic memories
      crud.retrieveMemories.run({
        data: {
          userId,
          profileId,
          query: userMessage,
          limit: 10,
          recencyDays: options.recencyDays || 90
        }
      }),

      // Get people mentioned (if any names detected)
      crud.getPeople.run({ data: { userId, profileId, limit: 5 } }),

      // Get happiness anchors (if mood seems low)
      options.moodIsLow
        ? crud.getHappinessAnchors.run({ data: { userId, profileId, limit: 3 } })
        : Promise.resolve({ anchors: [] }),

      // Get pending questions (for never-ending conversations)
      exports.getPendingQuestions.run({ data: { userId, profileId, limit: 3 } }),

      // Get timeline with grouped questions (for navigating user's life story)
      exports.getTimelineWithQuestions.run({ data: { userId, profileId } }),

      // Get biography events (Digital Souls format - from biographyExtractor)
      reflection.getBiographyEventsInternal(userId, profileId, 15),

      // ═══ LUNA'S BRAIN (SoulPartner's Private Insights) ═══
      // Get Luna's recent journal entries
      exports.getRecentJournalEntries.run({ data: { userId, profileId, limit: 3 } }),

      // Get Luna's learned patterns
      exports.getPatterns.run({ data: { userId, profileId } }),

      // Get emotion trends for context
      exports.getEmotionTrends.run({ data: { userId, profileId, dayRange: 30 } }),

      // Get evolved personality weights (Nomi-inspired)
      personalitySystem.getPersonalityWeights.run({ data: { userId, profileId } }),

      // ═══ TANGO IDENTITY SYSTEM (Luna's Relationship Awareness) ═══
      // Get relationship stats (birthday, milestones, bond level)
      tangoRelationship.getRelationshipStats.run({ data: { userId, profileId } })
    ]);

    // Refine memories if we have too many
    let refinedMemories = memoriesResult.memories || [];
    if (refinedMemories.length > 5) {
      const refineResult = await reflection.refineMemories.run({
        data: { userMessage, memories: refinedMemories, maxKeep: 5 }
      });
      refinedMemories = refineResult.refined || refinedMemories;
    }

    const context = {
      // User's Brain
      facts: factsResult.facts || [],
      memories: refinedMemories,
      people: peopleResult.people || [],
      happinessAnchors: anchorsResult.anchors || [],
      pendingQuestions: questionsResult.questions || [],
      timeline: timelineResult.timeline || [],
      orphanQuestions: timelineResult.orphanQuestions || [],
      biographyEvents: biographyEventsResult.events || [],  // Life events from conversation extraction
      // Luna's Brain
      lunaJournals: lunaJournalsResult.journals || [],
      lunaPatterns: lunaPatternsResult.patterns || [],
      emotionTrends: emotionTrendsResult.trends || null,
      // Personality Evolution (Nomi-inspired)
      personalityWeights: personalityWeightsResult.weights || null,
      significantTraits: personalityWeightsResult.significantTraits || [],
      personalitySessionCount: personalityWeightsResult.sessionCount || 0,
      // Tango Identity System (Luna's Relationship Awareness)
      relationshipStats: relationshipStatsResult.exists ? relationshipStatsResult : null,
      // Meta
      retrievalTimeMs: Date.now() - startTime
    };

    console.log('✅ Memory context retrieved in', context.retrievalTimeMs, 'ms');
    if (context.relationshipStats) {
      console.log('💞 Tango: Bond level', context.relationshipStats.bondLevel,
        '| Days together:', context.relationshipStats.ageInDays,
        '| Pending celebrations:', context.relationshipStats.pendingCelebration?.length || 0);
    }

    return { success: true, context };

  } catch (error) {
    console.error('❌ Get memory context error:', error);
    return {
      success: false,
      context: {
        // User's Brain
        facts: [], memories: [], people: [], happinessAnchors: [],
        pendingQuestions: [], timeline: [], orphanQuestions: [],
        biographyEvents: [],  // Life events from conversation extraction
        // Luna's Brain
        lunaJournals: [], lunaPatterns: [], emotionTrends: null,
        // Personality Evolution
        personalityWeights: null, significantTraits: [], personalitySessionCount: 0,
        // Tango Identity System
        relationshipStats: null
      },
      error: error.message
    };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET PENDING QUESTIONS - Unanswered questions for never-ending conversations
// ═══════════════════════════════════════════════════════════════════════════

exports.getPendingQuestions = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, limit = 5 } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

  try {
    const questionsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('pendingQuestions');

    const snapshot = await questionsRef
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    return { success: true, questions };

  } catch (error) {
    console.error('❌ Get pending questions error:', error);
    return { success: true, questions: [] };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// MARK QUESTION ANSWERED - Remove from pending when user answers
// ═══════════════════════════════════════════════════════════════════════════

exports.markQuestionAnswered = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, questionId, answer } = request.data;

  if (!userId || !profileId || !questionId) {
    throw new Error('Missing required fields');
  }

  try {
    const questionRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('pendingQuestions').doc(questionId);

    await questionRef.update({
      status: 'answered',
      answeredAt: admin.firestore.FieldValue.serverTimestamp(),
      answer: answer || null
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Mark question answered error:', error);
    return { success: false, error: error.message };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET TIMELINE EVENTS - Retrieve user's life timeline chronologically
// ═══════════════════════════════════════════════════════════════════════════

exports.getTimelineEvents = onCall(async (request) => {
  const { userId, profileId, chapter, yearRange, includeUnconfirmed } = request.data;

  if (!userId || !profileId) {
    return { success: false, error: 'Missing userId or profileId' };
  }

  try {
    let query = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('lifeTimeline');

    // Filter by chapter if specified
    if (chapter) {
      query = query.where('chapter', '==', chapter);
    }

    // Filter by year range if specified
    if (yearRange?.start) {
      query = query.where('year', '>=', yearRange.start);
    }
    if (yearRange?.end) {
      query = query.where('year', '<=', yearRange.end);
    }

    // Filter out unconfirmed if requested
    if (!includeUnconfirmed) {
      query = query.where('confirmed', '==', true);
    }

    const snapshot = await query.orderBy('year', 'asc').limit(50).get();

    const events = [];
    snapshot.forEach(doc => {
      events.push({
        id: doc.id,
        ...doc.data(),
        mentionedAt: doc.data().mentionedAt?.toDate?.() || null
      });
    });

    // Also get era-based events (no year, just era like "childhood")
    const eraSnapshot = await db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('lifeTimeline')
      .where('year', '==', null)
      .limit(20)
      .get();

    eraSnapshot.forEach(doc => {
      events.push({
        id: doc.id,
        ...doc.data(),
        mentionedAt: doc.data().mentionedAt?.toDate?.() || null
      });
    });

    // Sort: year-based first (chronologically), then era-based
    events.sort((a, b) => {
      if (a.year && b.year) return a.year - b.year;
      if (a.year && !b.year) return -1;
      if (!a.year && b.year) return 1;
      return 0;
    });

    console.log(`📅 Retrieved ${events.length} timeline events for ${profileId}`);
    return { success: true, events };

  } catch (error) {
    console.error('❌ Get timeline events error:', error);
    return { success: false, error: error.message };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH TIMELINE - Semantic search across user's life timeline
// ═══════════════════════════════════════════════════════════════════════════

exports.searchTimeline = onCall(async (request) => {
  const { userId, profileId, query, limit = 10 } = request.data;

  if (!userId || !profileId || !query) {
    return { success: false, error: 'Missing required parameters' };
  }

  try {
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    // Search timeline memories using vector similarity
    const memoriesRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('memories');

    const vectorQuery = memoriesRef
      .where('type', '==', 'timeline_event')
      .findNearest({
        vectorField: 'embedding',
        queryVector: queryEmbedding,
        limit: limit,
        distanceMeasure: 'COSINE'
      });

    const snapshot = await vectorQuery.get();

    const results = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      results.push({
        id: doc.id,
        event: data.content,
        year: data.year,
        era: data.era,
        chapter: data.chapter,
        confirmed: data.confirmed,
        importance: data.importance,
        createdAt: data.createdAt?.toDate?.() || null
      });
    });

    // Also search for when this topic was discussed (conversation dates)
    const discussionDates = results
      .filter(r => r.createdAt)
      .map(r => ({
        event: r.event,
        discussedOn: r.createdAt.toISOString().split('T')[0]
      }));

    console.log(`🔍 Timeline search for "${query}": found ${results.length} events`);
    return {
      success: true,
      events: results,
      discussionDates,
      searchedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Search timeline error:', error);
    return { success: false, error: error.message };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET TIMELINE WITH QUESTIONS - Get timeline grouped with pending questions
// ═══════════════════════════════════════════════════════════════════════════

exports.getTimelineWithQuestions = onCall(async (request) => {
  const { userId, profileId } = request.data;

  if (!userId || !profileId) {
    return { success: false, error: 'Missing userId or profileId' };
  }

  try {
    // Get all timeline events
    const timelineSnapshot = await db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('lifeTimeline')
      .orderBy('year', 'asc')
      .get();

    // Get pending questions
    const questionsSnapshot = await db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('pendingQuestions')
      .where('status', '==', 'pending')
      .get();

    // Build timeline with grouped questions
    const timeline = {};
    const orphanQuestions = [];

    // Initialize timeline entries
    timelineSnapshot.forEach(doc => {
      const data = doc.data();
      const key = data.year || data.era || 'unknown';
      if (!timeline[key]) {
        timeline[key] = {
          year: data.year,
          era: data.era,
          events: [],
          questions: [],
          chapter: data.chapter
        };
      }
      timeline[key].events.push({
        event: data.event,
        confirmed: data.confirmed,
        importance: data.importance,
        conversationDate: data.conversationDate
      });
    });

    // Group questions by their timeline anchor
    questionsSnapshot.forEach(doc => {
      const q = doc.data();
      if (q.timelineAnchor?.year || q.timelineAnchor?.era) {
        const key = q.timelineAnchor.year || q.timelineAnchor.era;
        if (timeline[key]) {
          timeline[key].questions.push({
            id: doc.id,
            question: q.question,
            framework: q.framework,
            anchoredEvent: q.timelineAnchor.event
          });
        } else {
          // Timeline entry doesn't exist yet, create it
          timeline[key] = {
            year: q.timelineAnchor.year,
            era: q.timelineAnchor.era,
            events: [{ event: q.timelineAnchor.event, confirmed: false }],
            questions: [{
              id: doc.id,
              question: q.question,
              framework: q.framework
            }]
          };
        }
      } else {
        // Question not anchored to timeline
        orphanQuestions.push({
          id: doc.id,
          question: q.question,
          framework: q.framework,
          conversationDate: q.conversationDate
        });
      }
    });

    // Convert to sorted array
    const sortedTimeline = Object.entries(timeline)
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => {
        if (a.year && b.year) return a.year - b.year;
        if (a.year) return -1;
        return 1;
      });

    console.log(`📅 Built timeline with ${sortedTimeline.length} entries, ${orphanQuestions.length} orphan questions`);

    return {
      success: true,
      timeline: sortedTimeline,
      orphanQuestions,
      totalQuestions: questionsSnapshot.size
    };

  } catch (error) {
    console.error('❌ Get timeline with questions error:', error);
    return { success: false, error: error.message };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// LUNA'S BRAIN: JOURNAL ENTRY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
// Inspired by Kindroid's 4-layer memory system
// This is Luna's PRIVATE perspective - her observations, not the user's facts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a journal entry from Luna's perspective after a conversation
 *
 * Path: users/{userId}/memory/{profileId}/soulPartner/journals/{date}
 *
 * This captures:
 * - Luna's emotional sensing of the user
 * - What communication approaches worked/didn't work
 * - Relationship evolution observations
 * - Open threads to revisit
 * - Luna's own "state" (curiosity, connection, clarity)
 */
exports.createJournalEntry = onCall({
  memory: '1GiB',
  timeoutSeconds: 120,
  cors: true
}, async (request) => {
  const { userId, profileId, messages, sessionMeta = {} } = request.data;

  if (!userId || !profileId || !messages || messages.length < 4) {
    return {
      success: true,
      skipped: 'Not enough messages for meaningful journal entry'
    };
  }

  try {
    console.log('📓 Luna creating journal entry for:', profileId);

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4 // Slightly higher for more personality
      }
    });

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
   - dominantMood: The overall emotional tone (e.g., "reflective", "anxious", "playful", "vulnerable")
   - emotionalArc: Array of emotions as they shifted through conversation ["curious", "nostalgic", "hopeful"]
   - intensityPeak: 0.0-1.0 how intense were their emotions at the peak moment?
   - vulnerabilityLevel: "low", "medium", "high" - how open were they?
   - energyLevel: "low", "medium", "high" - their apparent energy/exhaustion

2. WHAT_WORKED: Communication approaches that resonated
   - List 2-4 things you said/did that seemed to help or connect
   - Be specific about the approach, not just the topic

3. WHAT_DIDN'T_WORK: Approaches that fell flat or should be adjusted
   - What topics should you approach differently next time?
   - Did you miss any cues?

4. RELATIONSHIP_EVOLUTION: How did the relationship change?
   - trustLevel: "initial", "growing", "established", "deep"
   - newDynamics: Any new patterns emerging? New comfort zones?
   - breakthroughMoment: If there was one, what was it?
   - boundary: Any boundaries the user set (implicit or explicit)?

5. OPEN_THREADS: Topics/questions to revisit in future sessions
   - topic: What to follow up on
   - urgency: "low", "medium", "high" - how time-sensitive
   - reason: Why this matters to bring up again

6. LUNA_STATE: Your own internal state after this conversation
   - curiosity: What are you most curious about regarding this user?
   - connection: How connected do you feel to them?
   - clarity: What's still unclear about them that you want to understand?
   - note_to_self: A brief reminder for your future self

7. SESSION_SUMMARY: A 2-3 sentence summary of this session from YOUR perspective
   Write this as if you're reflecting in your diary. Be genuine.

Return valid JSON:
{
  "emotionSensing": {
    "dominantMood": string,
    "emotionalArc": string[],
    "intensityPeak": number,
    "vulnerabilityLevel": "low"|"medium"|"high",
    "energyLevel": "low"|"medium"|"high"
  },
  "whatWorked": string[],
  "whatDidntWork": string[],
  "relationshipEvolution": {
    "trustLevel": string,
    "newDynamics": string|null,
    "breakthroughMoment": string|null,
    "boundary": string|null
  },
  "openThreads": [{ "topic": string, "urgency": string, "reason": string }],
  "lunaState": {
    "curiosity": string,
    "connection": string,
    "clarity": string,
    "noteToSelf": string
  },
  "sessionSummary": string
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let journalData;
    try {
      journalData = JSON.parse(responseText);
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

    if (existingEntry.exists) {
      // Append to existing entry's sessions array
      const existing = existingEntry.data();
      const sessions = existing.sessions || [];

      sessions.push({
        timestamp: new Date().toISOString(),
        ...journalData,
        messageCount: messages.length
      });

      await journalRef.update({
        sessions,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        sessionCount: admin.firestore.FieldValue.increment(1)
      });

      console.log('📓 Appended to existing journal entry for:', today);
    } else {
      // Create new entry
      await journalRef.set({
        date: today,
        profileId,
        sessions: [{
          timestamp: new Date().toISOString(),
          ...journalData,
          messageCount: messages.length
        }],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        sessionCount: 1
      });

      console.log('📓 Created new journal entry for:', today);
    }

    // Also store emotion log separately for trend tracking
    const emotionLogRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('emotionLogs')
      .collection('entries');

    await emotionLogRef.add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
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

/**
 * Get Luna's recent journal entries for context
 *
 * Returns Luna's perspective to help her maintain consistent personality
 * and remember what worked/didn't work with this user
 */
exports.getRecentJournalEntries = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, limit = 3 } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

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

/**
 * Get emotion trends for a user over time
 *
 * Useful for Luna to understand long-term emotional patterns
 */
exports.getEmotionTrends = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, dayRange = 30 } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - dayRange);

    const emotionLogsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('emotionLogs')
      .collection('entries');

    const snapshot = await emotionLogsRef
      .where('timestamp', '>=', cutoffDate)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()?.toISOString()
    }));

    // Calculate trends
    const moodCounts = {};
    const arcMoods = [];
    let totalIntensity = 0;
    let highVulnerabilityCount = 0;

    for (const log of logs) {
      // Count moods
      if (log.dominantMood) {
        moodCounts[log.dominantMood] = (moodCounts[log.dominantMood] || 0) + 1;
      }
      // Collect arc moods
      if (log.emotionalArc) {
        arcMoods.push(...log.emotionalArc);
      }
      // Sum intensity
      totalIntensity += log.intensityPeak || 0;
      // Count high vulnerability
      if (log.vulnerabilityLevel === 'high') {
        highVulnerabilityCount++;
      }
    }

    const trends = {
      mostCommonMood: Object.entries(moodCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown',
      averageIntensity: logs.length > 0 ? (totalIntensity / logs.length).toFixed(2) : 0,
      highVulnerabilityRate: logs.length > 0 ? (highVulnerabilityCount / logs.length * 100).toFixed(1) + '%' : '0%',
      emotionalRange: [...new Set(Object.keys(moodCounts))],
      sessionCount: logs.length
    };

    console.log(`📊 Emotion trends for ${profileId}:`, trends);

    return { success: true, logs, trends };

  } catch (error) {
    console.error('❌ Get emotion trends error:', error);
    return { success: true, logs: [], trends: {} };
  }
});

/**
 * Store a pattern that Luna learned about what works with this user
 *
 * Path: users/{userId}/memory/{profileId}/soulPartner/patterns/{patternId}
 */
exports.storePattern = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, pattern, category, effectiveness, context } = request.data;

  if (!userId || !profileId || !pattern) {
    throw new Error('Missing required fields');
  }

  try {
    const patternsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('patterns')
      .collection('learned');

    // Create pattern ID from content
    const patternId = pattern.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 50);

    const existingPattern = await patternsRef.doc(patternId).get();

    if (existingPattern.exists) {
      // Reinforce existing pattern
      await patternsRef.doc(patternId).update({
        confirmations: admin.firestore.FieldValue.increment(1),
        effectiveness: effectiveness || existingPattern.data().effectiveness,
        lastConfirmed: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('📝 Pattern reinforced:', pattern.slice(0, 40));
      return { success: true, reinforced: true, id: patternId };
    } else {
      // Store new pattern
      await patternsRef.doc(patternId).set({
        pattern,
        category: category || 'communication',
        effectiveness: effectiveness || 'positive', // positive, negative, neutral
        context: context || null,
        confirmations: 1,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastConfirmed: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('📝 New pattern stored:', pattern.slice(0, 40));
      return { success: true, created: true, id: patternId };
    }

  } catch (error) {
    console.error('❌ Store pattern error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get Luna's learned patterns for a user
 */
exports.getPatterns = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, category = null, effectiveness = null } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

  try {
    let query = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('patterns')
      .collection('learned');

    if (category) {
      query = query.where('category', '==', category);
    }
    if (effectiveness) {
      query = query.where('effectiveness', '==', effectiveness);
    }

    const snapshot = await query
      .orderBy('confirmations', 'desc')
      .limit(20)
      .get();

    const patterns = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    return { success: true, patterns };

  } catch (error) {
    console.error('❌ Get patterns error:', error);
    return { success: true, patterns: [] };
  }
});
