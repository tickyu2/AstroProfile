/**
 * ============================================================================
 * BIOGRAPHICAL LIFE EVENT EXTRACTOR
 * ============================================================================
 * Intelligently extracts life events from conversation messages
 * Creates structured timeline entries with temporal data
 * Identifies gaps as "neural pathways" for future exploration
 *
 * Architecture based on:
 * - Zep/Graphiti Temporal Knowledge Graph
 * - Episodic vs Semantic Memory separation
 * - Bi-temporal model (event time vs mention time)
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE - Curating Life Stories
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModel() {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    generationConfig: {
      temperature: 0.3, // Lower temperature for more consistent extraction
    }
  });
}

// ============================================================================
// LIFE EVENT CATEGORIES
// ============================================================================

const LIFE_EVENT_TYPES = {
  EDUCATION: 'education',
  CAREER: 'career',
  RELOCATION: 'relocation',
  RELATIONSHIP: 'relationship',
  FAMILY: 'family',
  HEALTH: 'health',
  ACHIEVEMENT: 'achievement',
  TRAVEL: 'travel',
  LOSS: 'loss',
  MILESTONE: 'milestone',
  SPIRITUAL: 'spiritual',
  CREATIVE: 'creative',
  FINANCIAL: 'financial'
};

const LIFE_CHAPTERS = {
  CHILDHOOD: { name: 'Childhood', ageRange: [0, 12] },
  ADOLESCENCE: { name: 'Adolescence', ageRange: [13, 19] },
  EARLY_ADULTHOOD: { name: 'Early Adulthood', ageRange: [20, 35] },
  MIDLIFE: { name: 'Midlife', ageRange: [36, 55] },
  MATURE_ADULTHOOD: { name: 'Mature Adulthood', ageRange: [56, 70] },
  ELDER_YEARS: { name: 'Elder Years', ageRange: [71, 150] }
};

// ============================================================================
// EXTRACTION PROMPT
// ============================================================================

const EXTRACTION_PROMPT = `You are a biographical intelligence system that extracts life events from conversation.

TASK: Analyze the message for any biographical life events mentioned. Extract structured data about the person's life story.

LIFE EVENT TYPES to detect:
- education: Schools, degrees, learning milestones
- career: Jobs, promotions, career changes, retirement
- relocation: Moving to new places, immigration
- relationship: Marriage, divorce, partnerships, friendships
- family: Birth of children, family milestones
- health: Medical events, wellness changes
- achievement: Awards, accomplishments, milestones
- travel: Significant trips, adventures
- loss: Deaths, endings, grief
- milestone: Birthdays, anniversaries, life transitions
- spiritual: Religious events, spiritual awakenings
- creative: Artistic creations, projects
- financial: Major purchases, business ventures

For each life event found, extract:
1. event_type: One of the types above
2. title: Brief descriptive title
3. description: What happened (from what was shared)
4. date: Any temporal information
   - year (if mentioned or inferable)
   - month (if mentioned)
   - day (if mentioned)
   - age_at_event (if inferable)
   - precision: "exact", "year", "decade", "approximate", "unknown"
5. location: Place information if mentioned
   - city, state, country
6. people_involved: Names of people mentioned
7. emotions: Emotional tone detected
8. confidence: 0-1 score for extraction accuracy
9. neural_pathways: Questions to ask to learn more (gaps in the story)

IMPORTANT RULES:
- Only extract ACTUAL life events mentioned, not hypotheticals
- Extract events from ANY time period (past, present, future plans)
- If a year is mentioned like "in 1982", that's HIGH confidence
- If relative time is used like "when I was young", note it and infer if possible
- Neural pathways should be natural follow-up questions a biographer would ask
- Do NOT extract trivial daily activities unless they represent milestones
- Look for BIOGRAPHICAL significance

OUTPUT FORMAT (JSON):
{
  "has_life_events": true/false,
  "events": [
    {
      "event_type": "education",
      "title": "University enrollment",
      "description": "Started attending University of Texas",
      "date": {
        "year": 1982,
        "month": null,
        "day": null,
        "precision": "year",
        "age_at_event": null
      },
      "location": {
        "city": "Austin",
        "state": "Texas",
        "country": "USA"
      },
      "people_involved": [],
      "emotions": ["excitement", "uncertainty"],
      "confidence": 0.9,
      "neural_pathways": [
        "What semester did you start?",
        "What motivated you to choose UT Austin?",
        "Where were you living before the move?",
        "What did you study?"
      ]
    }
  ],
  "conversation_topics": ["education", "relocation"],
  "biographical_richness": 0.8
}

If NO life events are detected, return:
{
  "has_life_events": false,
  "events": [],
  "conversation_topics": [],
  "biographical_richness": 0
}`;

// ============================================================================
// MAIN EXTRACTION FUNCTION
// ============================================================================

/**
 * Extract life events from a message
 * @param {string} message - The user's message
 * @param {Object} context - Additional context
 * @param {string} context.userName - User's name
 * @param {Date} context.birthDate - User's birth date (for age calculation)
 * @param {string} context.conversationId - For source tracking
 * @returns {Object} Extracted events and metadata
 */
async function extractLifeEvents(message, context = {}) {
  try {
    // Skip very short messages
    if (!message || message.length < 20) {
      return { has_life_events: false, events: [], biographical_richness: 0 };
    }

    // Build context string
    let contextInfo = '';
    if (context.userName) {
      contextInfo += `\nUser's name: ${context.userName}`;
    }
    if (context.birthDate) {
      const birthYear = new Date(context.birthDate).getFullYear();
      contextInfo += `\nUser's birth year: ${birthYear} (use this to calculate age_at_event)`;
    }

    const prompt = `${EXTRACTION_PROMPT}
${contextInfo}

MESSAGE TO ANALYZE:
"${message}"

Extract any life events as JSON:`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // Add metadata to each event
      if (parsed.events && parsed.events.length > 0) {
        const now = new Date();
        parsed.events = parsed.events.map((event, index) => ({
          ...event,
          id: `life_event_${now.getTime()}_${index}`,
          source: {
            type: 'conversation',
            conversationId: context.conversationId,
            messageId: context.messageId,
            extractedAt: now.toISOString()
          },
          chapter: inferLifeChapter(event, context.birthDate)
        }));
      }

      console.log('[Biography] Extracted events:', JSON.stringify(parsed, null, 2));
      return parsed;
    }

    return { has_life_events: false, events: [], biographical_richness: 0 };

  } catch (error) {
    console.error('[Biography] Extraction error:', error);
    return { has_life_events: false, events: [], error: error.message };
  }
}

/**
 * Infer life chapter based on event date and birth date
 */
function inferLifeChapter(event, birthDate) {
  if (!event.date?.year || !birthDate) {
    return null;
  }

  const birthYear = new Date(birthDate).getFullYear();
  const eventYear = event.date.year;
  const ageAtEvent = eventYear - birthYear;

  for (const [key, chapter] of Object.entries(LIFE_CHAPTERS)) {
    if (ageAtEvent >= chapter.ageRange[0] && ageAtEvent <= chapter.ageRange[1]) {
      return {
        id: key.toLowerCase(),
        name: chapter.name,
        ageAtEvent
      };
    }
  }

  return null;
}

// ============================================================================
// FIRESTORE OPERATIONS
// ============================================================================

/**
 * Store extracted life event in Firestore
 * @param {Object} db - Firestore instance
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} event - Extracted life event
 */
async function storeLifeEvent(db, userId, profileId, event) {
  try {
    const biographyRef = db
      .collection('users').doc(userId)
      .collection('biography').doc(profileId)
      .collection('life_events');

    // Check for duplicate/similar events
    const existing = await findSimilarEvent(db, userId, profileId, event);

    if (existing) {
      // Merge with existing event (update with new information)
      await biographyRef.doc(existing.id).update({
        ...mergeEvents(existing, event),
        updatedAt: new Date(),
        mentionCount: (existing.mentionCount || 1) + 1
      });
      console.log('[Biography] Updated existing event:', existing.id);
      return { action: 'updated', eventId: existing.id };
    }

    // Create new event
    const docRef = await biographyRef.add({
      ...event,
      createdAt: new Date(),
      updatedAt: new Date(),
      mentionCount: 1,
      verified: false
    });

    console.log('[Biography] Created new life event:', docRef.id);
    return { action: 'created', eventId: docRef.id };

  } catch (error) {
    console.error('[Biography] Store error:', error);
    throw error;
  }
}

/**
 * Find similar existing event to avoid duplicates
 * Enhanced to match events about the same person across different event types
 */
async function findSimilarEvent(db, userId, profileId, event) {
  const biographyRef = db
    .collection('users').doc(userId)
    .collection('biography').doc(profileId)
    .collection('life_events');

  // Extract person name from title (e.g., "Birth of Amy" -> "Amy")
  const personName = extractPersonName(event.title);

  // Strategy 1: Look for events with same type and similar date
  let query = biographyRef.where('event_type', '==', event.event_type);
  if (event.date?.year) {
    query = query.where('date.year', '==', event.date.year);
  }
  const sameTypeSnapshot = await query.limit(5).get();

  for (const doc of sameTypeSnapshot.docs) {
    const existing = { id: doc.id, ...doc.data() };
    if (isSimilarEvent(existing, event)) {
      return existing;
    }
  }

  // Strategy 2: Look for events about the same person (even different types)
  if (personName) {
    const allEventsSnapshot = await biographyRef
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    for (const doc of allEventsSnapshot.docs) {
      const existing = { id: doc.id, ...doc.data() };
      if (isSamePersonEvent(existing, event, personName)) {
        console.log(`[Biography] Found related event for ${personName}:`, existing.title);
        return existing;
      }
    }
  }

  return null;
}

/**
 * Extract person name from event title
 */
function extractPersonName(title) {
  if (!title) return null;

  // Common patterns: "Birth of Amy", "Amy's birth year", "Amy was born"
  const patterns = [
    /(?:birth of|born|marriage of|wedding of|death of)\s+(\w+)/i,
    /(\w+)'s?\s+(?:birth|wedding|marriage|graduation|career)/i,
    /^(\w+)\s+(?:was born|graduated|married|started)/i
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      const name = match[1];
      // Filter out common non-name words
      if (!['the', 'a', 'an', 'my', 'our', 'his', 'her'].includes(name.toLowerCase())) {
        return name;
      }
    }
  }
  return null;
}

/**
 * Check if two events are about the same person (for merging across types)
 */
function isSamePersonEvent(existing, newEvent, personName) {
  const existingPersonName = extractPersonName(existing.title);

  // Same person name in title
  if (existingPersonName && personName &&
      existingPersonName.toLowerCase() === personName.toLowerCase()) {

    // Both are birth-related events
    const birthKeywords = ['birth', 'born', 'baby', 'child'];
    const existingIsBirth = birthKeywords.some(k => existing.title?.toLowerCase().includes(k));
    const newIsBirth = birthKeywords.some(k => newEvent.title?.toLowerCase().includes(k));

    if (existingIsBirth && newIsBirth) {
      return true;
    }

    // Same year = likely same event
    if (existing.date?.year && newEvent.date?.year &&
        existing.date.year === newEvent.date.year) {
      return true;
    }
  }

  // Check people_involved overlap
  const existingPeople = (existing.people_involved || []).map(p => p.toLowerCase());
  const newPeople = (newEvent.people_involved || []).map(p => p.toLowerCase());
  const overlap = existingPeople.filter(p => newPeople.includes(p));

  if (overlap.length > 0) {
    // Same person involved in both events
    const existingType = existing.event_type;
    const newType = newEvent.event_type;

    // Birth events can be categorized as family, milestone, or personal
    if (['family', 'milestone', 'personal'].includes(existingType) &&
        ['family', 'milestone', 'personal'].includes(newType)) {
      // Check if both mention birth
      const isBirthRelated = (e) =>
        e.title?.toLowerCase().includes('birth') ||
        e.title?.toLowerCase().includes('born');

      if (isBirthRelated(existing) && isBirthRelated(newEvent)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if two events are similar (likely the same event)
 */
function isSimilarEvent(existing, newEvent) {
  // Same type and year is a strong indicator
  if (existing.event_type !== newEvent.event_type) return false;

  // Check location match
  if (existing.location?.city && newEvent.location?.city) {
    if (existing.location.city.toLowerCase() === newEvent.location.city.toLowerCase()) {
      return true;
    }
  }

  // Check title similarity
  if (existing.title && newEvent.title) {
    const existingWords = existing.title.toLowerCase().split(' ');
    const newWords = newEvent.title.toLowerCase().split(' ');
    const commonWords = existingWords.filter(w => newWords.includes(w));
    if (commonWords.length >= 2) return true;
  }

  return false;
}

/**
 * Merge two events, keeping the most complete information
 */
function mergeEvents(existing, newEvent) {
  // First merge all the data
  const mergedDescription = (newEvent.description?.length > (existing.description?.length || 0))
    ? newEvent.description
    : existing.description;

  const mergedDate = {
    ...existing.date,
    year: existing.date?.year || newEvent.date?.year,
    month: existing.date?.month || newEvent.date?.month,
    day: existing.date?.day || newEvent.date?.day,
    precision: getBetterPrecision(existing.date?.precision, newEvent.date?.precision)
  };

  const mergedLocation = {
    ...existing.location,
    city: existing.location?.city || newEvent.location?.city,
    state: existing.location?.state || newEvent.location?.state,
    country: existing.location?.country || newEvent.location?.country
  };

  const mergedPeople = [...new Set([
    ...(existing.people_involved || []),
    ...(newEvent.people_involved || [])
  ])];

  // Build merged event for intelligent pathway filtering
  const mergedEventData = {
    title: existing.title,
    description: mergedDescription,
    date: mergedDate,
    location: mergedLocation,
    people_involved: mergedPeople,
    event_type: existing.event_type
  };

  return {
    ...existing,
    description: mergedDescription,
    date: mergedDate,
    location: mergedLocation,
    people_involved: mergedPeople,
    // Merge neural pathways with intelligent filtering of answered questions
    neural_pathways: mergeNeuralPathways(
      existing.neural_pathways,
      newEvent.neural_pathways,
      mergedEventData  // Pass merged data for intelligent filtering
    ),
    confidence: Math.max(existing.confidence || 0, newEvent.confidence || 0),
    sources: [
      ...(existing.sources || [existing.source]),
      newEvent.source
    ].filter(Boolean)
  };
}

function getBetterPrecision(existing, newPrecision) {
  const order = ['exact', 'year', 'decade', 'approximate', 'unknown'];
  const existingIdx = order.indexOf(existing) ?? 4;
  const newIdx = order.indexOf(newPrecision) ?? 4;
  return existingIdx <= newIdx ? existing : newPrecision;
}

function mergeNeuralPathways(existing = [], newPathways = [], eventData = {}) {
  // Keep unique questions, but filter out those that are now answered
  const all = [...existing, ...newPathways];
  const unique = [...new Set(all)];

  // Filter out questions that are now answered based on event data
  const unanswered = unique.filter(q => !isQuestionAnswered(q, eventData));

  return unanswered.slice(0, 10); // Keep max 10 questions
}

/**
 * Check if a neural pathway question has been answered by the event data
 * Uses heuristics to detect answered questions
 */
function isQuestionAnswered(question, event) {
  const q = question.toLowerCase();

  // "Who is X to you?" - answered if we have relationship context
  if (q.includes('who is') && q.includes('to you')) {
    if (event.description?.length > 50 || event.people_involved?.length > 1) {
      return true;
    }
  }

  // TIME questions: "When was/did X born?", "What year did X..."
  // Broad pattern: any question with "when" + birth-related OR has year data
  if (q.includes('when') && (q.includes('born') || q.includes('birth'))) {
    if (event.date?.year) {
      console.log(`[NeuralPathways] Question "${q}" answered - has year ${event.date.year}`);
      return true;
    }
  }

  // General time questions
  if (q.startsWith('when') || q.includes('what year') || q.includes('what date')) {
    if (event.date?.year && event.date.precision !== 'unknown') {
      return true;
    }
  }

  // LOCATION questions: "Where was/did X born?", "Where did X live?"
  if (q.includes('where') && (q.includes('born') || q.includes('birth'))) {
    if (event.location?.city || event.location?.state || event.location?.country) {
      console.log(`[NeuralPathways] Question "${q}" answered - has location`);
      return true;
    }
  }

  // General location questions
  if (q.startsWith('where') || q.includes('what location') || q.includes('what city')) {
    if (event.location?.city || event.location?.state || event.location?.country) {
      return true;
    }
  }

  // EDUCATION questions
  if (q.includes('study') || q.includes('degree') || q.includes('major') || q.includes('school') || q.includes('university')) {
    if (event.description?.toLowerCase().includes('study') ||
        event.description?.toLowerCase().includes('major') ||
        event.description?.toLowerCase().includes('degree') ||
        event.event_type === 'education') {
      return true;
    }
  }

  // CAREER questions
  if (q.includes('career') || q.includes('job') || q.includes('work') || q.includes('profession')) {
    if (event.event_type === 'career' && event.description?.length > 30) {
      return true;
    }
  }

  // EXPERIENCE questions: "What was it like..."
  if (q.includes('what was it like') || q.includes('how did it feel')) {
    // If we have a rich description, likely answered
    if (event.description?.length > 100) {
      return true;
    }
  }

  return false;
}

// ============================================================================
// NEURAL PATHWAY QUERIES
// ============================================================================

/**
 * Get unanswered neural pathways for a profile
 * These are questions to explore to fill gaps in the life story
 */
async function getNeuralPathways(db, userId, profileId, limit = 10) {
  const biographyRef = db
    .collection('users').doc(userId)
    .collection('biography').doc(profileId)
    .collection('life_events');

  const snapshot = await biographyRef
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  const allPathways = [];

  snapshot.forEach(doc => {
    const event = doc.data();
    if (event.neural_pathways && event.neural_pathways.length > 0) {
      event.neural_pathways.forEach(question => {
        // Skip questions that have been answered based on current event data
        if (isQuestionAnswered(question, event)) {
          console.log(`[NeuralPathways] Skipping answered question: "${question}"`);
          return;
        }

        allPathways.push({
          question,
          relatedEvent: {
            id: doc.id,
            title: event.title,
            year: event.date?.year,
            type: event.event_type
          },
          priority: calculateQuestionPriority(question, event)
        });
      });
    }
  });

  // Sort by priority and return top N
  return allPathways
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

/**
 * Calculate priority for a neural pathway question
 */
function calculateQuestionPriority(question, event) {
  let priority = 0.5;

  // Higher priority for fundamental questions
  if (question.toLowerCase().includes('why')) priority += 0.2;
  if (question.toLowerCase().includes('who')) priority += 0.15;
  if (question.toLowerCase().includes('when')) priority += 0.1;

  // Higher priority for less confident events
  if (event.confidence < 0.7) priority += 0.2;

  // Higher priority for significant event types
  if (['career', 'education', 'relocation', 'relationship'].includes(event.event_type)) {
    priority += 0.1;
  }

  return Math.min(1, priority);
}

// ============================================================================
// BIOGRAPHY TIMELINE RETRIEVAL
// ============================================================================

/**
 * Get full biography timeline for a profile
 */
async function getBiographyTimeline(db, userId, profileId) {
  const biographyRef = db
    .collection('users').doc(userId)
    .collection('biography').doc(profileId)
    .collection('life_events');

  const snapshot = await biographyRef
    .orderBy('date.year', 'asc')
    .get();

  const events = [];
  const byYear = {};
  const byChapter = {};

  snapshot.forEach(doc => {
    const event = { id: doc.id, ...doc.data() };
    events.push(event);

    // Group by year
    const year = event.date?.year || 'unknown';
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(event);

    // Group by chapter
    const chapter = event.chapter?.id || 'unknown';
    if (!byChapter[chapter]) byChapter[chapter] = [];
    byChapter[chapter].push(event);
  });

  return {
    events,
    byYear,
    byChapter,
    totalEvents: events.length,
    yearsSpan: Object.keys(byYear).filter(y => y !== 'unknown').length,
    chaptersWithEvents: Object.keys(byChapter).filter(c => c !== 'unknown')
  };
}

/**
 * Get biography summary stats
 */
async function getBiographyStats(db, userId, profileId) {
  const timeline = await getBiographyTimeline(db, userId, profileId);
  const pathways = await getNeuralPathways(db, userId, profileId, 20);

  // Calculate coverage by life chapter
  const chapterCoverage = {};
  for (const [chapterId, chapter] of Object.entries(LIFE_CHAPTERS)) {
    const key = chapterId.toLowerCase();
    chapterCoverage[key] = {
      name: chapter.name,
      eventCount: (timeline.byChapter[key] || []).length,
      hasGaps: (timeline.byChapter[key] || []).length < 3
    };
  }

  return {
    totalEvents: timeline.totalEvents,
    yearsDocumented: timeline.yearsSpan,
    chapterCoverage,
    openQuestions: pathways.length,
    topQuestions: pathways.slice(0, 5),
    eventTypes: Object.entries(
      timeline.events.reduce((acc, e) => {
        acc[e.event_type] = (acc[e.event_type] || 0) + 1;
        return acc;
      }, {})
    ).map(([type, count]) => ({ type, count }))
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  extractLifeEvents,
  storeLifeEvent,
  getNeuralPathways,
  getBiographyTimeline,
  getBiographyStats,
  LIFE_EVENT_TYPES,
  LIFE_CHAPTERS
};
