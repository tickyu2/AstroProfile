/**
 * ============================================================================
 * TIMELINE PIPELINE - Main Orchestrator
 * ============================================================================
 * End-to-end pipeline that processes messages and builds biographical timelines.
 *
 * Flow:
 * 1. Extract structured events from message (Mode 1)
 * 2. Upsert into PostgreSQL with pgvector deduplication
 * 3. Refresh neural pathway questions (Mode 2)
 * 4. Optionally generate narrative summaries (Mode 3)
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { extractEvents } = require('./timelineLLMEngine');
const { upsertEventsWithDedup, getEventsForPerson, getPerson } = require('./timelineEventStore');
const { refreshQuestionsForPerson, getNextQuestion } = require('./timelineQuestionStore');
const { generateNarrative, generatePeriodSummary } = require('./timelineLLMEngine');

// ============================================================================
// MAIN PIPELINE
// ============================================================================

/**
 * Process a message for timeline extraction
 * This is the main entry point called after each user message
 *
 * @param {Object} params - Pipeline parameters
 * @returns {Promise<Object>} Processing results
 */
async function processTimelineForMessage({
  userId,
  profileId,
  personName,
  message,
  conversationId = null,
  messageId = null,
  existingEvents = [],
  skipQuestionRefresh = false
}) {
  const startTime = Date.now();

  console.log(`[Pipeline] Processing message for ${personName} (${message.length} chars)`);

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Extract structured events from message
    // ─────────────────────────────────────────────────────────────────────────
    const extractionResult = await extractEvents(message, {
      userId,
      profileId,
      personName,
      existingEvents,
      conversationContext: `Conversation ${conversationId || 'unknown'}`
    });

    if (!extractionResult.success) {
      console.warn('[Pipeline] Extraction failed:', extractionResult.error);
      return {
        success: false,
        error: extractionResult.error,
        events: [],
        questions: [],
        duration: Date.now() - startTime
      };
    }

    const events = extractionResult.events || [];

    if (events.length === 0) {
      console.log('[Pipeline] No biographical events found in message');
      return {
        success: true,
        events: [],
        questions: [],
        extractionNotes: extractionResult.extraction_notes,
        duration: Date.now() - startTime
      };
    }

    console.log(`[Pipeline] Extracted ${events.length} events`);

    // Add source metadata to events
    const enrichedEvents = events.map(event => ({
      ...event,
      source_type: 'conversation',
      conversation_id: conversationId,
      message_id: messageId
    }));

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Upsert events with deduplication
    // ─────────────────────────────────────────────────────────────────────────
    const eventIds = await upsertEventsWithDedup({
      userId,
      profileId,
      personName,
      events: enrichedEvents
    });

    console.log(`[Pipeline] Stored ${eventIds.length} events`);

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: Refresh neural pathway questions
    // ─────────────────────────────────────────────────────────────────────────
    let questions = [];
    if (!skipQuestionRefresh && eventIds.length > 0) {
      questions = await refreshQuestionsForPerson({
        userId,
        profileId,
        personName
      });
      console.log(`[Pipeline] Generated ${questions.length} questions`);
    }

    const duration = Date.now() - startTime;
    console.log(`[Pipeline] Complete in ${duration}ms`);

    return {
      success: true,
      events: eventIds,
      eventCount: events.length,
      questions,
      questionCount: questions.length,
      extractionNotes: extractionResult.extraction_notes,
      duration
    };

  } catch (error) {
    console.error('[Pipeline] Error:', error);
    return {
      success: false,
      error: error.message,
      events: [],
      questions: [],
      duration: Date.now() - startTime
    };
  }
}

/**
 * Process multiple messages in batch (for imports)
 *
 * @param {Object} params - Batch parameters
 * @returns {Promise<Object>} Batch results
 */
async function processBatchMessages({
  userId,
  profileId,
  personName,
  messages,
  conversationId = null
}) {
  console.log(`[Pipeline] Batch processing ${messages.length} messages for ${personName}`);

  const results = {
    processed: 0,
    events: [],
    errors: [],
    totalDuration: 0
  };

  // Process each message (don't refresh questions until end)
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    const result = await processTimelineForMessage({
      userId,
      profileId,
      personName,
      message: typeof message === 'string' ? message : message.content,
      conversationId,
      messageId: typeof message === 'object' ? message.id : `batch-${i}`,
      skipQuestionRefresh: true // Skip until final refresh
    });

    if (result.success) {
      results.processed++;
      results.events.push(...result.events);
    } else {
      results.errors.push({
        index: i,
        error: result.error
      });
    }

    results.totalDuration += result.duration;
  }

  // Final question refresh
  const questions = await refreshQuestionsForPerson({
    userId,
    profileId,
    personName
  });

  console.log(`[Pipeline] Batch complete: ${results.processed}/${messages.length} messages, ${results.events.length} events`);

  return {
    ...results,
    questions,
    questionCount: questions.length
  };
}

// ============================================================================
// NARRATIVE GENERATION
// ============================================================================

/**
 * Generate biography narrative for a person
 *
 * @param {Object} params - Narrative parameters
 * @returns {Promise<Object>} Narrative result
 */
async function generateBiographyNarrative({
  userId,
  profileId,
  personName,
  length = 'medium',
  focus = null
}) {
  // Get person
  const person = await getPerson(userId, profileId, personName);
  if (!person) {
    return {
      success: false,
      error: `Person not found: ${personName}`
    };
  }

  // Get events
  const events = await getEventsForPerson({
    userId,
    profileId,
    personId: person.id,
    limit: 100
  });

  if (events.length === 0) {
    return {
      success: true,
      narrative: `${personName}'s story is just beginning to unfold.`,
      eventCount: 0
    };
  }

  // Generate narrative
  const result = await generateNarrative(events, {
    personName,
    length,
    focus,
    includeQuestions: true
  });

  return result;
}

/**
 * Generate period summaries (by decade or life chapter)
 *
 * @param {Object} params - Summary parameters
 * @returns {Promise<Object[]>} Period summaries
 */
async function generateAllPeriodSummaries({
  userId,
  profileId,
  personName,
  periodType = 'decade' // 'decade' | 'chapter'
}) {
  const person = await getPerson(userId, profileId, personName);
  if (!person) {
    return { success: false, error: 'Person not found' };
  }

  const events = await getEventsForPerson({
    userId,
    profileId,
    personId: person.id,
    limit: 200
  });

  if (events.length === 0) {
    return { success: true, summaries: [] };
  }

  // Group events by period
  const periods = groupEventsByPeriod(events, periodType);
  const summaries = [];

  for (const [periodLabel, periodEvents] of Object.entries(periods)) {
    const summary = await generatePeriodSummary(periodEvents, {
      type: periodType,
      label: periodLabel
    }, { personName });

    if (summary.success) {
      summaries.push({
        period: periodLabel,
        ...summary
      });
    }
  }

  return {
    success: true,
    summaries,
    periodType,
    totalPeriods: Object.keys(periods).length
  };
}

/**
 * Group events by time period
 */
function groupEventsByPeriod(events, periodType) {
  const groups = {};

  for (const event of events) {
    const year = event.event_year;
    if (!year) continue;

    let key;
    if (periodType === 'decade') {
      const decade = Math.floor(year / 10) * 10;
      key = `${decade}s`;
    } else if (periodType === 'chapter') {
      // Would need birth year for accurate chapters
      // For now, use rough age brackets
      key = getLifeChapter(year);
    } else {
      key = year.toString();
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(event);
  }

  return groups;
}

function getLifeChapter(year) {
  // Simplified - would need birth year for accuracy
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - year;

  if (yearsAgo > 50) return 'Distant Past';
  if (yearsAgo > 30) return 'Earlier Years';
  if (yearsAgo > 15) return 'Formative Years';
  if (yearsAgo > 5) return 'Recent Past';
  return 'Recent';
}

// ============================================================================
// CONTEXT FOR CHAT
// ============================================================================

/**
 * Get timeline context for chat system prompt
 * Returns a summary of known events and pending questions
 *
 * @param {Object} params - Context parameters
 * @returns {Promise<Object>} Timeline context
 */
async function getTimelineContextForChat({
  userId,
  profileId,
  personName,
  maxEvents = 20,
  maxQuestions = 5
}) {
  const person = await getPerson(userId, profileId, personName);
  if (!person) {
    return {
      hasTimeline: false,
      personName
    };
  }

  // Get recent events
  const events = await getEventsForPerson({
    userId,
    profileId,
    personId: person.id,
    limit: maxEvents
  });

  // Get pending questions
  const { getActiveQuestions } = require('./timelineQuestionStore');
  const questions = await getActiveQuestions({
    userId,
    profileId,
    personId: person.id,
    limit: maxQuestions
  });

  // Build context summary
  const eventSummaries = events.map(e => ({
    title: e.title,
    year: e.event_year,
    type: e.event_type
  }));

  const questionTexts = questions.map(q => q.question);

  return {
    hasTimeline: true,
    personName,
    personId: person.id,
    birthYear: person.birth_year,
    eventCount: events.length,
    events: eventSummaries,
    pendingQuestions: questionTexts,
    nextQuestion: questions[0]?.question || null
  };
}

/**
 * Format timeline context for system prompt
 */
function formatTimelineForPrompt(context) {
  if (!context.hasTimeline) {
    return `No biographical timeline exists for ${context.personName} yet.`;
  }

  let prompt = `## Known Timeline for ${context.personName}\n\n`;

  if (context.birthYear) {
    prompt += `Birth Year: ${context.birthYear}\n`;
  }

  prompt += `Events Recorded: ${context.eventCount}\n\n`;

  if (context.events.length > 0) {
    prompt += `### Key Events:\n`;
    for (const event of context.events.slice(0, 10)) {
      const yearStr = event.year ? `(${event.year})` : '';
      prompt += `- ${event.title} ${yearStr} [${event.type}]\n`;
    }
    prompt += '\n';
  }

  if (context.pendingQuestions.length > 0) {
    prompt += `### Questions to Explore:\n`;
    for (const q of context.pendingQuestions.slice(0, 3)) {
      prompt += `- ${q}\n`;
    }
  }

  return prompt;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main pipeline
  processTimelineForMessage,
  processBatchMessages,

  // Narrative generation
  generateBiographyNarrative,
  generateAllPeriodSummaries,

  // Chat integration
  getTimelineContextForChat,
  formatTimelineForPrompt
};
