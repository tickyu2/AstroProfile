/**
 * ============================================================================
 * TIMELINE CONTEXT - Prompt Integration
 * ============================================================================
 * Provides timeline context for LLM system prompts.
 * Retrieves relevant events based on conversation topic.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { query, getClient } = require('../database/pool');
const { embedText, formatForPgVector } = require('../llm/embeddings');

// ============================================================================
// TIMELINE CONTEXT RETRIEVAL
// ============================================================================

/**
 * Get timeline context for a person, optionally filtered by topic
 *
 * @param {Object} params - Context parameters
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} params.personName - Person name
 * @param {string} params.topicText - Optional topic to filter events semantically
 * @param {number} params.limit - Max events to return (default 5)
 * @returns {Promise<Object|null>} Timeline context or null
 */
async function getTimelineContext({ userId, profileId = 'default', personName, topicText = null, limit = 5 }) {
  const client = await getClient();

  try {
    // Find person
    const personRes = await client.query(
      `SELECT id, birth_year, birth_date FROM timeline_person
       WHERE user_id = $1 AND profile_id = $2 AND LOWER(name) = LOWER($3)`,
      [userId, profileId, personName]
    );

    if (personRes.rowCount === 0) {
      return null;
    }

    const person = personRes.rows[0];
    const personId = person.id;

    let events;

    if (topicText && topicText.trim().length > 10) {
      // Semantic search by topic
      const topicEmbedding = await embedText(topicText);
      const vectorStr = formatForPgVector(topicEmbedding);

      const res = await client.query(
        `SELECT id, event_type, title, description,
                event_year, event_month, event_day, date_precision,
                city, state, country, emotions,
                (embedding <-> $4::vector) AS distance
         FROM timeline_event
         WHERE user_id = $1 AND profile_id = $2 AND person_id = $3
         AND embedding IS NOT NULL
         ORDER BY embedding <-> $4::vector
         LIMIT $5`,
        [userId, profileId, personId, vectorStr, limit]
      );
      events = res.rows;
    } else {
      // Fallback: most important events (by mention_count / recency)
      const res = await client.query(
        `SELECT id, event_type, title, description,
                event_year, event_month, event_day, date_precision,
                city, state, country, emotions
         FROM timeline_event
         WHERE user_id = $1 AND profile_id = $2 AND person_id = $3
         ORDER BY mention_count DESC, COALESCE(event_year, 9999), created_at DESC
         LIMIT $4`,
        [userId, profileId, personId, limit]
      );
      events = res.rows;
    }

    if (events.length === 0) {
      return {
        personName,
        personId,
        birthYear: person.birth_year,
        events: [],
        formatted: `No timeline events recorded for ${personName} yet.`
      };
    }

    return {
      personName,
      personId,
      birthYear: person.birth_year,
      events,
      formatted: formatTimelineContext(personName, events, person.birth_year)
    };

  } finally {
    client.release();
  }
}

/**
 * Format timeline context for LLM system prompt
 */
function formatTimelineContext(personName, events, birthYear = null) {
  const lines = [];
  lines.push('## BIOGRAPHIC CONTEXT');
  lines.push(`Person: ${personName}`);

  if (birthYear) {
    lines.push(`Birth Year: ${birthYear}`);
  }

  lines.push('');
  lines.push('### Key Life Events:');

  for (const ev of events) {
    const dateStr = formatEventDate(ev);
    const loc = [ev.city, ev.state, ev.country].filter(Boolean).join(', ');
    const emotionStr = (ev.emotions || []).join(', ');

    lines.push(`- **[${ev.event_type}] ${ev.title}**`);
    if (dateStr) lines.push(`  • When: ${dateStr}`);
    if (loc) lines.push(`  • Where: ${loc}`);
    if (ev.description) lines.push(`  • What: ${ev.description.slice(0, 300)}`);
    if (emotionStr) lines.push(`  • Emotions: ${emotionStr}`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format event date for display
 */
function formatEventDate(ev) {
  if (ev.event_year && ev.event_month && ev.event_day) {
    return `${ev.event_year}-${String(ev.event_month).padStart(2, '0')}-${String(ev.event_day).padStart(2, '0')} (${ev.date_precision || 'exact'})`;
  }
  if (ev.event_year && ev.event_month) {
    return `${ev.event_year}-${String(ev.event_month).padStart(2, '0')} (${ev.date_precision || 'month'})`;
  }
  if (ev.event_year) {
    return `${ev.event_year} (${ev.date_precision || 'year'})`;
  }
  return null;
}

// ============================================================================
// QUESTION CONTEXT
// ============================================================================

/**
 * Get pending questions context for prompt
 */
async function getQuestionsContext({ userId, profileId = 'default', personName, limit = 3 }) {
  const client = await getClient();

  try {
    // Find person
    const personRes = await client.query(
      `SELECT id FROM timeline_person
       WHERE user_id = $1 AND profile_id = $2 AND LOWER(name) = LOWER($3)`,
      [userId, profileId, personName]
    );

    if (personRes.rowCount === 0) {
      return null;
    }

    const personId = personRes.rows[0].id;

    // Get top pending questions
    const qRes = await client.query(
      `SELECT q.question, q.reason, q.category, q.priority, e.title as event_title
       FROM timeline_event_questions q
       LEFT JOIN timeline_event e ON q.event_id = e.id
       WHERE q.user_id = $1 AND q.profile_id = $2 AND q.person_id = $3
       AND q.answered = false AND q.skipped = false
       ORDER BY q.priority DESC, q.created_at ASC
       LIMIT $4`,
      [userId, profileId, personId, limit]
    );

    if (qRes.rowCount === 0) {
      return null;
    }

    const questions = qRes.rows;

    return {
      personName,
      questions,
      formatted: formatQuestionsContext(personName, questions)
    };

  } finally {
    client.release();
  }
}

/**
 * Format questions context for prompt
 */
function formatQuestionsContext(personName, questions) {
  const lines = [];
  lines.push(`### Open Questions About ${personName}:`);
  lines.push('(These gaps in their biography could be gently explored)');
  lines.push('');

  for (const q of questions) {
    lines.push(`- ${q.question}`);
    if (q.event_title) {
      lines.push(`  (Related to: ${q.event_title})`);
    }
  }

  return lines.join('\n');
}

// ============================================================================
// COMBINED CONTEXT FOR SOULPARTNER
// ============================================================================

/**
 * Get full timeline + questions context for SoulPartner prompt
 *
 * @param {Object} params - Context parameters
 * @returns {Promise<Object>} Combined context
 */
async function getFullTimelineContext({
  userId,
  profileId = 'default',
  personName,
  topicText = null,
  eventLimit = 5,
  questionLimit = 3
}) {
  const [timelineCtx, questionsCtx] = await Promise.all([
    getTimelineContext({ userId, profileId, personName, topicText, limit: eventLimit }),
    getQuestionsContext({ userId, profileId, personName, limit: questionLimit })
  ]);

  const parts = [];

  if (timelineCtx && timelineCtx.events.length > 0) {
    parts.push(timelineCtx.formatted);
  }

  if (questionsCtx && questionsCtx.questions.length > 0) {
    parts.push('');
    parts.push(questionsCtx.formatted);
  }

  if (parts.length === 0) {
    return {
      hasContext: false,
      personName,
      formatted: `No biographical timeline exists for ${personName} yet. As they share their story, events will be recorded.`
    };
  }

  parts.push('');
  parts.push('---');
  parts.push('Use this biographic context when answering questions. Do not invent new facts beyond this data, but you may ask clarifying questions to fill gaps.');

  return {
    hasContext: true,
    personName,
    birthYear: timelineCtx?.birthYear || null,
    eventCount: timelineCtx?.events?.length || 0,
    questionCount: questionsCtx?.questions?.length || 0,
    formatted: parts.join('\n')
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getTimelineContext,
  getQuestionsContext,
  getFullTimelineContext,
  formatTimelineContext,
  formatQuestionsContext
};
