/**
 * Reflection Engine
 *
 * Background processing: fact extraction from conversations, memory refinement,
 * and biography event retrieval.
 * Lines ~684-1088 from the original memoryFunctions.js
 */

const { onCall, admin, db, getGeminiClient, generateEmbedding } = require('./memoryShared');

// ═══════════════════════════════════════════════════════════════════════════
// REFLECTION LOOP - Extract facts from conversation (background)
// ═══════════════════════════════════════════════════════════════════════════

exports.reflectOnConversation = onCall({
  memory: '1GiB',
  timeoutSeconds: 120,
  cors: true
}, async (request) => {
  const { userId, profileId, messages } = request.data;

  if (!userId || !profileId || !messages || messages.length < 4) {
    return {
      success: true,
      facts: [],
      people: [],
      events: [],
      skipped: 'Not enough messages'
    };
  }

  try {
    console.log('🔄 Running reflection for:', userId, profileId);

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const prompt = `Analyze this conversation and extract information for the user's LIFE TIMELINE.

CONVERSATION:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

EXTRACT THE FOLLOWING (only if clearly stated, not speculation):

1. FACTS: Permanent truths about the user
   Examples: "User's sister is named Sarah", "User works at Google", "User lives in Austin"

2. PEOPLE: New people mentioned with their relationship to user
   Examples: { name: "Sarah", relationship: "sister", context: "lives in Portland" }

3. TIMELINE_EVENTS: Life events WITH year/era for building chronological story
   Examples:
   - { year: 1982, event: "Third major pivot - flew from Cyprus to UT Austin", confirmed: false, chapter: "education" }
   - { year: 2015, event: "Started current company", confirmed: true, chapter: "career" }
   - { era: "childhood", event: "Moved to Cyprus with family", confirmed: false, chapter: "origins" }
   Chapters: origins, childhood, education, career, relationships, spiritual, turning_points

4. HAPPY_MOMENTS: Positive memories that made the user happy
   Examples: { memory: "Trip to beach with family", score: 9 }

5. PREFERENCES: Likes and dislikes revealed
   Examples: { preference: "loves rainy days", sentiment: "positive" }

6. UNANSWERED_QUESTIONS: Questions asked by AI that user hasn't answered yet
   Use the 5W+H+Soul+Thoughts framework to track what's missing:
   - WHO: People involved ("Who supported you?")
   - WHAT: Events/facts ("What happened next?")
   - WHEN: Timing ("When exactly was this?")
   - WHERE: Location ("Where were you living?")
   - WHY: Motivation ("Why did you decide to leave?")
   - HOW: Process ("How did you make it happen?")
   - FEELING: Emotions ("How did it feel?")
   - THOUGHTS: Decision process ("How did you reach that conclusion?", "What were you weighing?")

   Each question should ANCHOR to a timeline event when possible:
   Examples:
   - { question: "What were the first two major pivots?", framework: "WHAT", timelineAnchor: { year: 1982, event: "Third major pivot" } }
   - { question: "How did it feel leaving Cyprus?", framework: "FEELING", timelineAnchor: { year: 1982, event: "Third major pivot" } }

RULES:
- Only extract DEFINITE information, not speculation
- Skip conversational filler ("okay", "lol", "hmm", "I see")
- If user corrects something, extract the CORRECTED version
- Mark events as confirmed: false unless user explicitly verified details
- Return empty arrays if nothing meaningful to extract

Return valid JSON:
{
  "facts": [{ "fact": string, "category": string, "confidence": 0.0-1.0 }],
  "people": [{ "name": string, "relationship": string, "context": string }],
  "timelineEvents": [{ "year": number|null, "era": string|null, "event": string, "confirmed": boolean, "chapter": string, "importance": 0.0-1.0 }],
  "happyMoments": [{ "memory": string, "score": 1-10, "peakMoment": string }],
  "preferences": [{ "preference": string, "sentiment": "positive"|"negative" }],
  "unansweredQuestions": [{ "question": string, "framework": "WHO"|"WHAT"|"WHEN"|"WHERE"|"WHY"|"HOW"|"FEELING"|"THOUGHTS", "timelineAnchor": { "year": number|null, "era": string|null, "event": string }|null }]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let extracted;
    try {
      extracted = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse reflection response:', responseText.slice(0, 500));
      return { success: false, error: 'Failed to parse reflection' };
    }

    console.log('📊 Extracted:', {
      facts: extracted.facts?.length || 0,
      people: extracted.people?.length || 0,
      timelineEvents: extracted.timelineEvents?.length || 0,
      happyMoments: extracted.happyMoments?.length || 0,
      unansweredQuestions: extracted.unansweredQuestions?.length || 0
    });

    // Store extracted data
    const stored = {
      facts: 0,
      people: 0,
      timelineEvents: 0,
      happyMoments: 0,
      unansweredQuestions: 0
    };

    // Store facts (confidence >= 0.7)
    for (const fact of extracted.facts || []) {
      if (fact.confidence >= 0.7) {
        try {
          const factsRef = db
            .collection('users').doc(userId)
            .collection('memory').doc(profileId)
            .collection('facts');

          await factsRef.add({
            fact: fact.fact,
            category: fact.category || 'general',
            confidence: fact.confidence,
            weight: 2.0,
            source: 'reflection',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastConfirmed: admin.firestore.FieldValue.serverTimestamp(),
            confirmations: 1
          });
          stored.facts++;
        } catch (e) {
          console.error('Failed to store fact:', e.message);
        }
      }
    }

    // Store people
    for (const person of extracted.people || []) {
      try {
        const peopleRef = db
          .collection('users').doc(userId)
          .collection('memory').doc(profileId)
          .collection('people');

        const personId = person.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await peopleRef.doc(personId).set({
          name: person.name,
          relationship: person.relationship || 'unknown',
          notes: person.context ? [person.context] : [],
          sentiment: 0,
          firstMention: admin.firestore.FieldValue.serverTimestamp(),
          lastMention: admin.firestore.FieldValue.serverTimestamp(),
          mentionCount: 1
        }, { merge: true });
        stored.people++;
      } catch (e) {
        console.error('Failed to store person:', e.message);
      }
    }

    // Store timeline events (the backbone of the user's life story)
    for (const event of extracted.timelineEvents || []) {
      try {
        const timelineRef = db
          .collection('users').doc(userId)
          .collection('memory').doc(profileId)
          .collection('lifeTimeline');

        // Create unique ID based on year/era and event
        const eventKey = `${event.year || event.era || 'unknown'}_${event.event.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30)}`;

        await timelineRef.doc(eventKey).set({
          year: event.year || null,
          era: event.era || null,
          event: event.event,
          chapter: event.chapter || 'general',
          importance: event.importance || 0.7,
          confirmed: event.confirmed || false,
          mentionedAt: admin.firestore.FieldValue.serverTimestamp(),
          conversationDate: new Date().toISOString().split('T')[0], // When we discussed this
          mentionCount: admin.firestore.FieldValue.increment(1)
        }, { merge: true });

        // Also store as a memory with embedding for semantic search
        const embedding = await generateEmbedding(event.event);
        const memoriesRef = db
          .collection('users').doc(userId)
          .collection('memory').doc(profileId)
          .collection('memories');

        await memoriesRef.add({
          content: event.event,
          type: 'timeline_event',
          year: event.year || null,
          era: event.era || null,
          chapter: event.chapter || 'general',
          importance: event.importance || 0.7,
          confirmed: event.confirmed || false,
          embedding: admin.firestore.FieldValue.vector(embedding),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          accessCount: 0
        });

        stored.timelineEvents++;
      } catch (e) {
        console.error('Failed to store timeline event:', e.message);
      }
    }

    // Store happiness anchors (score >= 7)
    for (const happy of extracted.happyMoments || []) {
      if (happy.score >= 7) {
        try {
          const anchorsRef = db
            .collection('users').doc(userId)
            .collection('memory').doc(profileId)
            .collection('happinessAnchors');

          await anchorsRef.add({
            memory: happy.memory,
            score: happy.score,
            peakMoment: happy.peakMoment || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastRecalled: admin.firestore.FieldValue.serverTimestamp(),
            recallCount: 1
          });
          stored.happyMoments++;
        } catch (e) {
          console.error('Failed to store happiness anchor:', e.message);
        }
      }
    }

    // Store unanswered questions with timeline anchors (for never-ending conversations)
    for (const q of extracted.unansweredQuestions || []) {
      try {
        const questionsRef = db
          .collection('users').doc(userId)
          .collection('memory').doc(profileId)
          .collection('pendingQuestions');

        // Use question hash as ID to avoid duplicates
        const questionId = q.question.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 50);

        // Build timeline anchor if present
        const timelineAnchor = q.timelineAnchor ? {
          year: q.timelineAnchor.year || null,
          era: q.timelineAnchor.era || null,
          event: q.timelineAnchor.event || null
        } : null;

        await questionsRef.doc(questionId).set({
          question: q.question,
          framework: q.framework || 'WHAT',
          timelineAnchor: timelineAnchor,
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          conversationDate: new Date().toISOString().split('T')[0],
          askedCount: admin.firestore.FieldValue.increment(1)
        }, { merge: true });
        stored.unansweredQuestions++;
      } catch (e) {
        console.error('Failed to store pending question:', e.message);
      }
    }

    console.log('✅ Reflection complete. Stored:', stored);

    return {
      success: true,
      extracted,
      stored
    };

  } catch (error) {
    console.error('❌ Reflection error:', error);
    return { success: false, error: error.message };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// REFINE MEMORIES - Use small model to filter irrelevant memories
// ═══════════════════════════════════════════════════════════════════════════

exports.refineMemories = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const { userMessage, memories, maxKeep = 5 } = request.data;

  if (!userMessage || !memories || memories.length === 0) {
    return { success: true, refined: [] };
  }

  // If already under limit, return as-is
  if (memories.length <= maxKeep) {
    return { success: true, refined: memories };
  }

  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    const prompt = `You are a memory relevance scorer for an AI companion.

USER'S CURRENT MESSAGE:
"${userMessage}"

RETRIEVED MEMORIES (score each 0-10 for relevance):
${memories.map((m, i) => `[${i}] ${m.content}`).join('\n')}

SCORING CRITERIA:
- 10: Directly answers the user's question or references exact same topic
- 7-9: Related topic, person, or theme that provides useful context
- 4-6: Tangentially related, might be useful background
- 1-3: Different topic, unlikely to help
- 0: Completely irrelevant

Return JSON: { "scores": [7, 2, 9, ...] }`;

    const result = await model.generateContent(prompt);
    const { scores } = JSON.parse(result.response.text());

    // Pair scores with memories and sort
    const scored = memories.map((mem, i) => ({
      ...mem,
      relevanceScore: scores[i] || 0
    }));

    // Filter and sort by relevance
    const refined = scored
      .filter(m => m.relevanceScore >= 5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxKeep);

    console.log('🔄 Refined', memories.length, 'memories to', refined.length);

    return { success: true, refined };

  } catch (error) {
    console.error('❌ Refine memories error:', error);
    // On error, return top N by original score
    return {
      success: true,
      refined: memories.slice(0, maxKeep),
      fallback: true
    };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// BIOGRAPHY EVENTS RETRIEVAL (Internal helper)
// Queries the biography/life_events collection from biographyExtractor
// ═══════════════════════════════════════════════════════════════════════════

async function getBiographyEventsInternal(userId, profileId, limit = 15) {
  try {
    const biographyRef = db
      .collection('users').doc(userId)
      .collection('biography').doc(profileId)
      .collection('life_events');

    const snapshot = await biographyRef
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .get();

    const events = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        event_type: data.event_type,
        description: data.description,
        ai_summary: data.ai_summary,
        date: data.date,
        location: data.location,
        people_involved: data.people_involved,
        emotions: data.emotions,
        confidence: data.confidence,
        mentionCount: data.mentionCount || 1
      };
    });

    console.log(`📖 [Biography] Retrieved ${events.length} life events for context`);
    return { events };

  } catch (error) {
    console.warn('⚠️ Biography events retrieval error:', error.message);
    return { events: [] };
  }
}

exports.getBiographyEventsInternal = getBiographyEventsInternal;
