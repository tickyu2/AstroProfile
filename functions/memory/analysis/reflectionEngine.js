/**
 * ============================================================================
 * GENESIS LUNA - REFLECTION ENGINE
 * ============================================================================
 * Extract facts, people, events from conversation (background process).
 * Uses LLM to analyze conversation and populate memory stores.
 *
 * Functions:
 * - reflectOnConversation: Extract structured data from conversation
 * - refineMemories: Use small model to filter irrelevant memories
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  REFLECTION LOOP                                                        │
 * │                                                                          │
 * │  ┌─────────────────┐                                                     │
 * │  │ CONVERSATION    │                                                     │
 * │  │ (4+ messages)   │                                                     │
 * │  └────────┬────────┘                                                     │
 * │           │                                                               │
 * │           ▼                                                               │
 * │  ┌─────────────────┐     ┌─────────────────┐                             │
 * │  │ LLM EXTRACTION  │     │ STRUCTURED      │                             │
 * │  │ (Gemini Flash)  │────▶│ OUTPUT          │                             │
 * │  │                 │     │                 │                             │
 * │  └─────────────────┘     └─────────────────┘                             │
 * │                                   │                                       │
 * │           ┌───────────────────────┼───────────────────────┐              │
 * │           ▼                       ▼                       ▼              │
 * │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
 * │  │ FACTS           │  │ PEOPLE          │  │ TIMELINE        │          │
 * │  │ (confidence>=.7)│  │ (name, relation)│  │ (year, chapter) │          │
 * │  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
 * │           │                       │                       │              │
 * │           ▼                       ▼                       ▼              │
 * │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
 * │  │ HAPPY MOMENTS   │  │ PREFERENCES     │  │ QUESTIONS       │          │
 * │  │ (score >= 7)    │  │ (likes/dislikes)│  │ (5W+H+Soul)     │          │
 * │  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
 * └─────────────────────────────────────────────────────────────────────────┘
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

// ============================================================================
// REFLECT ON CONVERSATION
// ============================================================================

/**
 * Extract facts, people, events from conversation
 * Called after conversation ends (background)
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Array} messages - Conversation messages
 */
const reflectOnConversation = onCall(FUNCTION_OPTIONS.heavy, async (request) => {
  const { userId, profileId, messages } = request.data;

  if (!userId || !profileId || !messages || messages.length < 4) {
    return { success: true, facts: [], people: [], events: [], skipped: 'Not enough messages' };
  }

  try {
    console.log('🔄 Running reflection for:', userId, profileId);

    const prompt = `Analyze this conversation and extract information for the user's LIFE TIMELINE.

CONVERSATION:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

EXTRACT THE FOLLOWING (only if clearly stated, not speculation):

1. FACTS: Permanent truths about the user
   Examples: "User's sister is named Sarah", "User works at Google"

2. PEOPLE: New people mentioned with their relationship
   Examples: { name: "Sarah", relationship: "sister", context: "lives in Portland" }

3. TIMELINE_EVENTS: Life events WITH year/era
   Examples: { year: 1982, event: "Flew from Cyprus to UT Austin", confirmed: false, chapter: "education" }
   Chapters: origins, childhood, education, career, relationships, spiritual, turning_points

4. HAPPY_MOMENTS: Positive memories (score 1-10)
   Examples: { memory: "Trip to beach with family", score: 9 }

5. PREFERENCES: Likes and dislikes
   Examples: { preference: "loves rainy days", sentiment: "positive" }

6. UNANSWERED_QUESTIONS: Questions asked by AI that user hasn't answered
   Framework: WHO, WHAT, WHEN, WHERE, WHY, HOW, FEELING, THOUGHTS
   Examples: { question: "What were the first two pivots?", framework: "WHAT" }

RULES:
- Only extract DEFINITE information, not speculation
- Skip conversational filler
- If user corrects something, extract the CORRECTED version
- Mark events as confirmed: false unless user explicitly verified

Return valid JSON:
{
  "facts": [{ "fact": string, "category": string, "confidence": 0.0-1.0 }],
  "people": [{ "name": string, "relationship": string, "context": string }],
  "timelineEvents": [{ "year": number|null, "era": string|null, "event": string, "confirmed": boolean, "chapter": string, "importance": 0.0-1.0 }],
  "happyMoments": [{ "memory": string, "score": 1-10, "peakMoment": string }],
  "preferences": [{ "preference": string, "sentiment": "positive"|"negative" }],
  "unansweredQuestions": [{ "question": string, "framework": string, "timelineAnchor": object|null }]
}`;

    const responseText = await generateText(prompt, {
      model: 'reflection',
      temperature: 0.2
    });

    let extracted;
    try {
      const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
      extracted = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('❌ Failed to parse reflection response');
      return { success: false, error: 'Failed to parse reflection' };
    }

    console.log('📊 Extracted:', {
      facts: extracted.facts?.length || 0,
      people: extracted.people?.length || 0,
      timelineEvents: extracted.timelineEvents?.length || 0,
      happyMoments: extracted.happyMoments?.length || 0
    });

    // Store extracted data
    const stored = { facts: 0, people: 0, timelineEvents: 0, happyMoments: 0, unansweredQuestions: 0 };

    // Store facts (confidence >= 0.7)
    for (const fact of extracted.facts || []) {
      if (fact.confidence >= 0.7) {
        try {
          const factsRef = db.collection('users').doc(userId)
            .collection('memory').doc(profileId).collection('facts');
          await factsRef.add({
            fact: fact.fact,
            category: fact.category || 'general',
            confidence: fact.confidence,
            weight: 2.0,
            source: 'reflection',
            createdAt: FieldValue.serverTimestamp(),
            lastConfirmed: FieldValue.serverTimestamp(),
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
        const peopleRef = db.collection('users').doc(userId)
          .collection('memory').doc(profileId).collection('people');
        const personId = person.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await peopleRef.doc(personId).set({
          name: person.name,
          relationship: person.relationship || 'unknown',
          notes: person.context ? [person.context] : [],
          sentiment: 0,
          firstMention: FieldValue.serverTimestamp(),
          lastMention: FieldValue.serverTimestamp(),
          mentionCount: 1
        }, { merge: true });
        stored.people++;
      } catch (e) {
        console.error('Failed to store person:', e.message);
      }
    }

    // Store timeline events
    for (const event of extracted.timelineEvents || []) {
      try {
        const timelineRef = db.collection('users').doc(userId)
          .collection('memory').doc(profileId).collection('lifeTimeline');
        const eventKey = `${event.year || event.era || 'unknown'}_${event.event.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30)}`;

        await timelineRef.doc(eventKey).set({
          year: event.year || null,
          era: event.era || null,
          event: event.event,
          chapter: event.chapter || 'general',
          importance: event.importance || 0.7,
          confirmed: event.confirmed || false,
          mentionedAt: FieldValue.serverTimestamp(),
          conversationDate: new Date().toISOString().split('T')[0],
          mentionCount: FieldValue.increment(1)
        }, { merge: true });

        // Also store with embedding
        const embedding = await embedText(event.event);
        const memoriesRef = db.collection('users').doc(userId)
          .collection('memory').doc(profileId).collection('memories');
        await memoriesRef.add({
          content: event.event,
          type: 'timeline_event',
          year: event.year || null,
          era: event.era || null,
          chapter: event.chapter || 'general',
          importance: event.importance || 0.7,
          confirmed: event.confirmed || false,
          embedding: FieldValue.vector(embedding),
          createdAt: FieldValue.serverTimestamp(),
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
          const anchorsRef = db.collection('users').doc(userId)
            .collection('memory').doc(profileId).collection('happinessAnchors');
          await anchorsRef.add({
            memory: happy.memory,
            score: happy.score,
            peakMoment: happy.peakMoment || null,
            createdAt: FieldValue.serverTimestamp(),
            lastRecalled: FieldValue.serverTimestamp(),
            recallCount: 1
          });
          stored.happyMoments++;
        } catch (e) {
          console.error('Failed to store happiness anchor:', e.message);
        }
      }
    }

    // Store unanswered questions
    for (const q of extracted.unansweredQuestions || []) {
      try {
        const questionsRef = db.collection('users').doc(userId)
          .collection('memory').doc(profileId).collection('pendingQuestions');
        const questionId = q.question.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 50);
        await questionsRef.doc(questionId).set({
          question: q.question,
          framework: q.framework || 'WHAT',
          timelineAnchor: q.timelineAnchor || null,
          status: 'pending',
          createdAt: FieldValue.serverTimestamp(),
          conversationDate: new Date().toISOString().split('T')[0],
          askedCount: FieldValue.increment(1)
        }, { merge: true });
        stored.unansweredQuestions++;
      } catch (e) {
        console.error('Failed to store question:', e.message);
      }
    }

    console.log('✅ Reflection complete. Stored:', stored);

    return { success: true, extracted, stored };

  } catch (error) {
    console.error('❌ Reflection error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// REFINE MEMORIES
// ============================================================================

/**
 * Use small model to filter irrelevant memories
 *
 * @param {string} userMessage - Current user message
 * @param {Array} memories - Retrieved memories to filter
 * @param {number} maxKeep - Maximum memories to keep
 */
const refineMemories = onCall(FUNCTION_OPTIONS.medium, async (request) => {
  const { userMessage, memories, maxKeep = 5 } = request.data;

  if (!userMessage || !memories || memories.length === 0) {
    return { success: true, refined: [] };
  }

  if (memories.length <= maxKeep) {
    return { success: true, refined: memories };
  }

  try {
    const prompt = `You are a memory relevance scorer for an AI companion.

USER'S CURRENT MESSAGE:
"${userMessage}"

RETRIEVED MEMORIES (score each 0-10 for relevance):
${memories.map((m, i) => `[${i}] ${m.content}`).join('\n')}

SCORING CRITERIA:
- 10: Directly answers the user's question
- 7-9: Related topic that provides useful context
- 4-6: Tangentially related
- 1-3: Different topic
- 0: Completely irrelevant

Return JSON: { "scores": [7, 2, 9, ...] }`;

    const responseText = await generateText(prompt, {
      model: 'chat',
      temperature: 0.1
    });

    const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const { scores } = JSON.parse(cleaned);

    // Pair scores with memories and sort
    const scored = memories.map((mem, i) => ({
      ...mem,
      relevanceScore: scores[i] || 0
    }));

    const refined = scored
      .filter(m => m.relevanceScore >= 5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxKeep);

    console.log('🔄 Refined', memories.length, 'memories to', refined.length);

    return { success: true, refined };

  } catch (error) {
    console.error('❌ Refine memories error:', error);
    return { success: true, refined: memories.slice(0, maxKeep), fallback: true };
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  reflectOnConversation,
  refineMemories
};
