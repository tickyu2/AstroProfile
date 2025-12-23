/**
 * ============================================================================
 * TIMELINE QUESTION STORE (Neural Pathways)
 * ============================================================================
 * Manages biographical gap detection questions in PostgreSQL.
 *
 * Features:
 * - LLM-powered gap detection (Mode 2)
 * - Priority-based question ordering
 * - Question lifecycle (answered/skipped)
 * - Question refresh on new events
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { query, withTransaction } = require('../database/pool');
const { detectGaps } = require('./timelineLLMEngine');
const { getPerson, getEventsForPerson } = require('./timelineEventStore');

// ============================================================================
// QUESTION LIFECYCLE
// ============================================================================

/**
 * Refresh neural pathway questions for a person
 * Uses LLM gap detection to generate new questions based on current events
 *
 * @param {Object} params - Parameters
 * @returns {Promise<Object[]>} Active questions
 */
async function refreshQuestionsForPerson({ userId, profileId, personName }) {
  // Get person
  const person = await getPerson(userId, profileId, personName);
  if (!person) {
    console.log(`[QuestionStore] Person not found: ${personName}`);
    return [];
  }

  const personId = person.id;

  // Get current events for this person
  const events = await getEventsForPerson({ userId, profileId, personId, limit: 50 });

  if (events.length === 0) {
    // No events yet - return starter question
    return [{
      id: null,
      question: `Tell me about ${personName}'s life story. When and where were they born?`,
      reason: 'No events recorded yet',
      priority: 1.0,
      category: 'identity'
    }];
  }

  // Use LLM to detect gaps
  const gapResult = await detectGaps(events, {
    personName,
    birthYear: person.birth_year,
    userId,
    profileId
  });

  if (!gapResult.success || !gapResult.questions.length) {
    console.log(`[QuestionStore] No gaps detected for ${personName}`);
    return [];
  }

  return withTransaction(async (client) => {
    // Clear old unanswered questions
    await client.query(
      `DELETE FROM timeline_event_questions
       WHERE user_id = $1 AND profile_id = $2 AND person_id = $3
       AND answered = false AND skipped = false`,
      [userId, profileId, personId]
    );

    // Insert new questions
    for (const q of gapResult.questions) {
      await client.query(
        `INSERT INTO timeline_event_questions (
          user_id, profile_id, person_id, event_id,
          question, reason, priority, category
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          profileId,
          personId,
          q.event_id || null,
          q.question,
          q.reason || null,
          q.priority ?? 0.5,
          q.category || 'experience'
        ]
      );
    }

    console.log(`[QuestionStore] Generated ${gapResult.questions.length} questions for ${personName}`);

    // Return active questions
    return getActiveQuestions({ userId, profileId, personId });
  });
}

/**
 * Get active (unanswered, not skipped) questions for a person
 */
async function getActiveQuestions({ userId, profileId, personId, limit = 20 }) {
  const result = await query(
    `SELECT q.*, e.title as event_title
     FROM timeline_event_questions q
     LEFT JOIN timeline_event e ON q.event_id = e.id
     WHERE q.user_id = $1 AND q.profile_id = $2 AND q.person_id = $3
     AND q.answered = false AND q.skipped = false
     ORDER BY q.priority DESC, q.created_at ASC
     LIMIT $4`,
    [userId, profileId, personId, limit]
  );

  return result.rows;
}

/**
 * Get the next high-priority question to ask
 */
async function getNextQuestion({ userId, profileId, personId }) {
  const result = await query(
    `SELECT q.*, e.title as event_title
     FROM timeline_event_questions q
     LEFT JOIN timeline_event e ON q.event_id = e.id
     WHERE q.user_id = $1 AND q.profile_id = $2 AND q.person_id = $3
     AND q.answered = false AND q.skipped = false
     ORDER BY q.priority DESC, q.created_at ASC
     LIMIT 1`,
    [userId, profileId, personId]
  );

  return result.rows[0] || null;
}

/**
 * Mark a question as answered
 */
async function markQuestionAnswered({ questionId, answeredBy = null }) {
  await query(
    `UPDATE timeline_event_questions
     SET answered = true, answered_at = NOW(), answered_by = $2
     WHERE id = $1`,
    [questionId, answeredBy]
  );

  console.log(`[QuestionStore] Question ${questionId} marked as answered`);
}

/**
 * Mark a question as skipped
 */
async function markQuestionSkipped({ questionId }) {
  await query(
    `UPDATE timeline_event_questions
     SET skipped = true
     WHERE id = $1`,
    [questionId]
  );

  console.log(`[QuestionStore] Question ${questionId} marked as skipped`);
}

/**
 * Check if a question was answered by new event data
 * Uses LLM to determine if the question is now answered
 */
async function checkQuestionAnsweredByEvent({ questionId, eventId, newMessage = null }) {
  // Get question and event
  const questionResult = await query(
    `SELECT * FROM timeline_event_questions WHERE id = $1`,
    [questionId]
  );
  const eventResult = await query(
    `SELECT * FROM timeline_event WHERE id = $1`,
    [eventId]
  );

  if (!questionResult.rows[0] || !eventResult.rows[0]) {
    return { is_answered: false };
  }

  const question = questionResult.rows[0];
  const event = eventResult.rows[0];

  // Use LLM to check
  const { checkQuestionAnswered } = require('./timelineLLMEngine');
  const result = await checkQuestionAnswered(question.question, event, newMessage);

  if (result.is_answered && result.confidence >= 0.7) {
    await markQuestionAnswered({
      questionId,
      answeredBy: eventId
    });
  }

  return result;
}

// ============================================================================
// QUESTION STATS
// ============================================================================

/**
 * Get question statistics for a person
 */
async function getQuestionStats({ userId, profileId, personId }) {
  const result = await query(
    `SELECT
       COUNT(*) FILTER (WHERE answered = false AND skipped = false) as pending,
       COUNT(*) FILTER (WHERE answered = true) as answered,
       COUNT(*) FILTER (WHERE skipped = true) as skipped,
       COUNT(*) as total,
       AVG(priority) FILTER (WHERE answered = false AND skipped = false) as avg_priority
     FROM timeline_event_questions
     WHERE user_id = $1 AND profile_id = $2 AND person_id = $3`,
    [userId, profileId, personId]
  );

  const stats = result.rows[0];
  return {
    pending: parseInt(stats.pending) || 0,
    answered: parseInt(stats.answered) || 0,
    skipped: parseInt(stats.skipped) || 0,
    total: parseInt(stats.total) || 0,
    avgPriority: parseFloat(stats.avg_priority) || 0
  };
}

/**
 * Get questions by category for a person
 */
async function getQuestionsByCategory({ userId, profileId, personId }) {
  const result = await query(
    `SELECT category, COUNT(*) as count,
            COUNT(*) FILTER (WHERE answered = true) as answered
     FROM timeline_event_questions
     WHERE user_id = $1 AND profile_id = $2 AND person_id = $3
     GROUP BY category
     ORDER BY count DESC`,
    [userId, profileId, personId]
  );

  return result.rows;
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Re-check all pending questions against current events
 * Useful after batch imports
 */
async function recheckAllQuestions({ userId, profileId, personId }) {
  const questions = await getActiveQuestions({ userId, profileId, personId, limit: 100 });
  const events = await getEventsForPerson({ userId, profileId, personId, limit: 100 });

  const { checkQuestionAnswered } = require('./timelineLLMEngine');
  let answeredCount = 0;

  for (const question of questions) {
    for (const event of events) {
      const result = await checkQuestionAnswered(question.question, event);

      if (result.is_answered && result.confidence >= 0.7) {
        await markQuestionAnswered({
          questionId: question.id,
          answeredBy: event.id
        });
        answeredCount++;
        break; // Move to next question
      }
    }
  }

  console.log(`[QuestionStore] Rechecked ${questions.length} questions, ${answeredCount} now answered`);
  return { checked: questions.length, answered: answeredCount };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Question generation
  refreshQuestionsForPerson,

  // Query
  getActiveQuestions,
  getNextQuestion,

  // Lifecycle
  markQuestionAnswered,
  markQuestionSkipped,
  checkQuestionAnsweredByEvent,

  // Stats
  getQuestionStats,
  getQuestionsByCategory,

  // Bulk
  recheckAllQuestions
};
