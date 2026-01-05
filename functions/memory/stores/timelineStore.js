/**
 * ============================================================================
 * GENESIS LUNA - TIMELINE STORE
 * ============================================================================
 * User's life timeline with chapters and semantic search.
 * The backbone of the user's life story.
 *
 * Functions:
 * - getTimelineEvents: Retrieve chronological events
 * - searchTimeline: Semantic search across timeline
 * - getTimelineWithQuestions: Timeline with grouped pending questions
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  LIFE TIMELINE SYSTEM                                                   │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                    USER'S LIFE STORY                               ││
 * │  │                                                                     ││
 * │  │  1982 ───▶ 1995 ───▶ 2000 ───▶ 2010 ───▶ 2020 ───▶ Present       ││
 * │  │   │         │         │         │         │                        ││
 * │  │   ▼         ▼         ▼         ▼         ▼                        ││
 * │  │ Origins  Education  Career   Turning   Current                    ││
 * │  │                               Points                               ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  Event Structure:                                                        │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │ year: 1982 | era: null                                             ││
 * │  │ event: "Third major pivot - flew from Cyprus to UT Austin"        ││
 * │  │ chapter: "education"                                               ││
 * │  │ importance: 0.9                                                    ││
 * │  │ confirmed: false (until user verifies)                            ││
 * │  │ mentionCount: 3                                                    ││
 * │  │ questions: [{ "What were the first two pivots?", WHAT }]          ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Chapters:
 * - origins: Birth, early family, roots
 * - childhood: Formative years
 * - education: School, learning
 * - career: Work, professional life
 * - relationships: Love, marriage, family
 * - spiritual: Faith, meaning, growth
 * - turning_points: Major life changes
 * - general: Uncategorized events
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FieldValue,
  embedText,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

// ============================================================================
// GET TIMELINE EVENTS
// ============================================================================

/**
 * Retrieve user's life timeline chronologically
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} chapter - Optional chapter filter
 * @param {Object} yearRange - Optional { start, end } year range
 * @param {boolean} includeUnconfirmed - Include unconfirmed events
 */
const getTimelineEvents = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, chapter, yearRange, includeUnconfirmed } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

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

// ============================================================================
// SEARCH TIMELINE
// ============================================================================

/**
 * Semantic search across user's life timeline
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} query - Search query
 * @param {number} limit - Max results
 */
const searchTimeline = onCall(FUNCTION_OPTIONS.heavy, async (request) => {
  const { userId, profileId, query, limit = 10 } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'query']);

  try {
    // Generate embedding for the search query
    const queryEmbedding = await embedText(query);

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

    // Also extract discussion dates
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

// ============================================================================
// GET TIMELINE WITH QUESTIONS
// ============================================================================

/**
 * Get timeline grouped with pending questions
 * For navigating user's life story with conversation threads
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
const getTimelineWithQuestions = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

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

// ============================================================================
// STORE TIMELINE EVENT (Used by reflection)
// ============================================================================

/**
 * Store a timeline event with optional embedding
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} year - Event year
 * @param {string} era - Event era (if no specific year)
 * @param {string} event - Event description
 * @param {string} chapter - Life chapter
 * @param {number} importance - Importance score
 * @param {boolean} confirmed - Whether user verified
 */
const storeTimelineEvent = onCall(FUNCTION_OPTIONS.heavy, async (request) => {
  const { userId, profileId, year, era, event, chapter, importance, confirmed } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'event']);

  try {
    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('lifeTimeline');

    // Create unique ID based on year/era and event
    const eventKey = `${year || era || 'unknown'}_${event.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30)}`;

    await timelineRef.doc(eventKey).set({
      year: year || null,
      era: era || null,
      event: event,
      chapter: chapter || 'general',
      importance: importance || 0.7,
      confirmed: confirmed || false,
      mentionedAt: FieldValue.serverTimestamp(),
      conversationDate: new Date().toISOString().split('T')[0],
      mentionCount: FieldValue.increment(1)
    }, { merge: true });

    // Also store as a memory with embedding for semantic search
    const embedding = await embedText(event);
    const memoriesRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('memories');

    await memoriesRef.add({
      content: event,
      type: 'timeline_event',
      year: year || null,
      era: era || null,
      chapter: chapter || 'general',
      importance: importance || 0.7,
      confirmed: confirmed || false,
      embedding: FieldValue.vector(embedding),
      createdAt: FieldValue.serverTimestamp(),
      accessCount: 0
    });

    return { success: true, id: eventKey };

  } catch (error) {
    console.error('❌ Store timeline event error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getTimelineEvents,
  searchTimeline,
  getTimelineWithQuestions,
  storeTimelineEvent
};
