/**
 * ============================================================================
 * TIMELINE HTTP ENDPOINTS
 * ============================================================================
 * HTTP callable functions for Timeline Console.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { query, getClient } = require('../database/pool');

// ============================================================================
// EVENTS ENDPOINTS
// ============================================================================

/**
 * Get events for a person
 * Called by: getTimelineEvents Cloud Function
 */
async function handleGetEvents({ userId, profileId = 'default', personName, limit = 50 }) {
  if (!userId || !personName) {
    return { success: false, error: 'userId and personName required' };
  }

  const client = await getClient();
  try {
    // Find person
    const personRes = await client.query(
      `SELECT id, birth_year, birth_date FROM timeline_person
       WHERE user_id = $1 AND profile_id = $2 AND LOWER(name) = LOWER($3)`,
      [userId, profileId, personName]
    );

    if (personRes.rowCount === 0) {
      return { success: true, events: [], person: null };
    }

    const person = personRes.rows[0];
    const personId = person.id;

    // Get events
    const eventsRes = await client.query(
      `SELECT id, event_type, title, description,
              event_year, event_month, event_day, date_precision,
              city, state, country, emotions,
              mention_count, verified, confidence,
              created_at, updated_at
       FROM timeline_event
       WHERE user_id = $1 AND profile_id = $2 AND person_id = $3
       ORDER BY COALESCE(event_year, 9999), created_at
       LIMIT $4`,
      [userId, profileId, personId, limit]
    );

    return {
      success: true,
      person: {
        id: personId,
        name: personName,
        birthYear: person.birth_year
      },
      events: eventsRes.rows,
      count: eventsRes.rowCount
    };
  } finally {
    client.release();
  }
}

/**
 * Get a single event with full details
 */
async function handleGetEvent({ userId, eventId }) {
  if (!userId || !eventId) {
    return { success: false, error: 'userId and eventId required' };
  }

  const result = await query(
    `SELECT e.*, p.name as person_name
     FROM timeline_event e
     LEFT JOIN timeline_person p ON e.person_id = p.id
     WHERE e.id = $1 AND e.user_id = $2`,
    [eventId, userId]
  );

  if (result.rowCount === 0) {
    return { success: false, error: 'Event not found' };
  }

  // Get linked people
  const peopleRes = await query(
    `SELECT person_name, relationship_type, person_id
     FROM timeline_event_people
     WHERE event_id = $1`,
    [eventId]
  );

  return {
    success: true,
    event: result.rows[0],
    linkedPeople: peopleRes.rows
  };
}

/**
 * Update an event
 */
async function handleUpdateEvent({ userId, eventId, updates }) {
  if (!userId || !eventId || !updates) {
    return { success: false, error: 'userId, eventId, and updates required' };
  }

  const allowedFields = [
    'title', 'description', 'event_type',
    'event_year', 'event_month', 'event_day', 'date_precision',
    'city', 'state', 'country',
    'emotions', 'verified'
  ];

  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return { success: false, error: 'No valid fields to update' };
  }

  values.push(eventId, userId);
  await query(
    `UPDATE timeline_event
     SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${idx++} AND user_id = $${idx}`,
    values
  );

  return { success: true };
}

/**
 * Delete an event
 */
async function handleDeleteEvent({ userId, eventId }) {
  if (!userId || !eventId) {
    return { success: false, error: 'userId and eventId required' };
  }

  await query(
    `DELETE FROM timeline_event WHERE id = $1 AND user_id = $2`,
    [eventId, userId]
  );

  return { success: true };
}

// ============================================================================
// QUESTIONS ENDPOINTS
// ============================================================================

/**
 * Get questions for a person
 */
async function handleGetQuestions({ userId, profileId = 'default', personName, includeAnswered = false, limit = 50 }) {
  if (!userId || !personName) {
    return { success: false, error: 'userId and personName required' };
  }

  const client = await getClient();
  try {
    // Find person
    const personRes = await client.query(
      `SELECT id FROM timeline_person
       WHERE user_id = $1 AND profile_id = $2 AND LOWER(name) = LOWER($3)`,
      [userId, profileId, personName]
    );

    if (personRes.rowCount === 0) {
      return { success: true, questions: [] };
    }

    const personId = personRes.rows[0].id;

    // Build query
    let sql = `
      SELECT q.id, q.event_id, q.question, q.reason,
             q.priority, q.category, q.answered, q.skipped,
             q.created_at, q.answered_at,
             e.title as event_title
      FROM timeline_event_questions q
      LEFT JOIN timeline_event e ON q.event_id = e.id
      WHERE q.user_id = $1 AND q.profile_id = $2 AND q.person_id = $3
    `;

    if (!includeAnswered) {
      sql += ` AND q.answered = false AND q.skipped = false`;
    }

    sql += ` ORDER BY q.answered ASC, q.priority DESC, q.created_at ASC LIMIT $4`;

    const qRes = await client.query(sql, [userId, profileId, personId, limit]);

    return {
      success: true,
      questions: qRes.rows,
      count: qRes.rowCount
    };
  } finally {
    client.release();
  }
}

/**
 * Mark question as answered
 */
async function handleAnswerQuestion({ userId, questionId, eventId = null }) {
  if (!userId || !questionId) {
    return { success: false, error: 'userId and questionId required' };
  }

  await query(
    `UPDATE timeline_event_questions
     SET answered = true, answered_at = NOW(), answered_by = $2
     WHERE id = $1 AND user_id = $3`,
    [questionId, eventId, userId]
  );

  return { success: true };
}

/**
 * Mark question as skipped
 */
async function handleSkipQuestion({ userId, questionId }) {
  if (!userId || !questionId) {
    return { success: false, error: 'userId and questionId required' };
  }

  await query(
    `UPDATE timeline_event_questions
     SET skipped = true
     WHERE id = $1 AND user_id = $2`,
    [questionId, userId]
  );

  return { success: true };
}

// ============================================================================
// PERSON ENDPOINTS
// ============================================================================

/**
 * Get all people for a user/profile
 */
async function handleGetPeople({ userId, profileId = 'default' }) {
  if (!userId) {
    return { success: false, error: 'userId required' };
  }

  const result = await query(
    `SELECT p.id, p.name, p.birth_year, p.birth_date, p.is_main_subject,
            COUNT(e.id) as event_count
     FROM timeline_person p
     LEFT JOIN timeline_event e ON p.id = e.person_id
     WHERE p.user_id = $1 AND p.profile_id = $2
     GROUP BY p.id
     ORDER BY p.is_main_subject DESC, event_count DESC, p.name`,
    [userId, profileId]
  );

  return {
    success: true,
    people: result.rows
  };
}

/**
 * Create or update a person
 */
async function handleUpsertPerson({ userId, profileId = 'default', name, birthYear = null, birthDate = null, isMainSubject = false }) {
  if (!userId || !name) {
    return { success: false, error: 'userId and name required' };
  }

  const result = await query(
    `INSERT INTO timeline_person (user_id, profile_id, name, birth_year, birth_date, is_main_subject)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, profile_id, name)
     DO UPDATE SET
       birth_year = COALESCE($4, timeline_person.birth_year),
       birth_date = COALESCE($5, timeline_person.birth_date),
       is_main_subject = $6,
       updated_at = NOW()
     RETURNING id`,
    [userId, profileId, name, birthYear, birthDate, isMainSubject]
  );

  return {
    success: true,
    personId: result.rows[0].id
  };
}

// ============================================================================
// STATS ENDPOINT
// ============================================================================

/**
 * Get timeline stats for a person
 */
async function handleGetStats({ userId, profileId = 'default', personName }) {
  if (!userId || !personName) {
    return { success: false, error: 'userId and personName required' };
  }

  const client = await getClient();
  try {
    // Find person
    const personRes = await client.query(
      `SELECT id FROM timeline_person
       WHERE user_id = $1 AND profile_id = $2 AND LOWER(name) = LOWER($3)`,
      [userId, profileId, personName]
    );

    if (personRes.rowCount === 0) {
      return {
        success: true,
        stats: {
          eventCount: 0,
          questionsPending: 0,
          questionsAnswered: 0,
          eventTypes: [],
          yearRange: null
        }
      };
    }

    const personId = personRes.rows[0].id;

    // Get event stats
    const eventStats = await client.query(
      `SELECT
         COUNT(*) as event_count,
         MIN(event_year) as min_year,
         MAX(event_year) as max_year
       FROM timeline_event
       WHERE user_id = $1 AND profile_id = $2 AND person_id = $3`,
      [userId, profileId, personId]
    );

    // Get event type breakdown
    const typeStats = await client.query(
      `SELECT event_type, COUNT(*) as count
       FROM timeline_event
       WHERE user_id = $1 AND profile_id = $2 AND person_id = $3
       GROUP BY event_type
       ORDER BY count DESC`,
      [userId, profileId, personId]
    );

    // Get question stats
    const questionStats = await client.query(
      `SELECT
         COUNT(*) FILTER (WHERE answered = false AND skipped = false) as pending,
         COUNT(*) FILTER (WHERE answered = true) as answered,
         COUNT(*) FILTER (WHERE skipped = true) as skipped
       FROM timeline_event_questions
       WHERE user_id = $1 AND profile_id = $2 AND person_id = $3`,
      [userId, profileId, personId]
    );

    const es = eventStats.rows[0];
    const qs = questionStats.rows[0];

    return {
      success: true,
      stats: {
        eventCount: parseInt(es.event_count) || 0,
        yearRange: es.min_year ? { min: es.min_year, max: es.max_year } : null,
        eventTypes: typeStats.rows,
        questionsPending: parseInt(qs.pending) || 0,
        questionsAnswered: parseInt(qs.answered) || 0,
        questionsSkipped: parseInt(qs.skipped) || 0
      }
    };
  } finally {
    client.release();
  }
}

// ============================================================================
// SEARCH ENDPOINT
// ============================================================================

/**
 * Semantic search across events
 */
async function handleSearchEvents({ userId, profileId = 'default', query: searchQuery, limit = 10 }) {
  if (!userId || !searchQuery) {
    return { success: false, error: 'userId and query required' };
  }

  const { searchEventsSemantic } = require('./timelineEventStore');

  const events = await searchEventsSemantic({
    userId,
    profileId,
    queryText: searchQuery,
    limit
  });

  return {
    success: true,
    events,
    count: events.length
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Events
  handleGetEvents,
  handleGetEvent,
  handleUpdateEvent,
  handleDeleteEvent,

  // Questions
  handleGetQuestions,
  handleAnswerQuestion,
  handleSkipQuestion,

  // People
  handleGetPeople,
  handleUpsertPerson,

  // Stats & Search
  handleGetStats,
  handleSearchEvents
};
