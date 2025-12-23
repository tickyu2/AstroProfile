/**
 * ============================================================================
 * TIMELINE EVENT STORE
 * ============================================================================
 * PostgreSQL storage for timeline events with pgvector deduplication.
 *
 * Features:
 * - Semantic deduplication using embeddings
 * - Smart merging of duplicate events
 * - Firestore sync tracking
 * - Person management
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { getClient, query, withTransaction } = require('../database/pool');
const { embedTimelineEvent, formatForPgVector } = require('../llm/embeddings');

// ============================================================================
// CONFIGURATION
// ============================================================================

// Distance threshold for deduplication (L2 distance: lower = more similar)
// 0.25 is strict, 0.35 is looser - tweak based on testing
const DISTANCE_THRESHOLD = 0.25;

// Legacy: kept for exports
const SIMILARITY_THRESHOLD = 0.85;

// ============================================================================
// PERSON MANAGEMENT
// ============================================================================

/**
 * Ensure a person exists in the database, create if not
 *
 * @param {Object} client - Database client
 * @param {Object} params - Person parameters
 * @returns {Promise<string>} Person UUID
 */
async function ensurePerson(client, { userId, profileId, personName, birthDate = null, birthYear = null }) {
  // Check if person exists
  const existing = await client.query(
    `SELECT id FROM timeline_person
     WHERE user_id = $1 AND profile_id = $2 AND LOWER(name) = LOWER($3)`,
    [userId, profileId, personName]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  // Create new person
  const result = await client.query(
    `INSERT INTO timeline_person (user_id, profile_id, name, birth_date, birth_year)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [userId, profileId, personName, birthDate, birthYear]
  );

  console.log(`[EventStore] Created person: ${personName} (${result.rows[0].id})`);
  return result.rows[0].id;
}

/**
 * Get person by ID or name
 */
async function getPerson(userId, profileId, personNameOrId) {
  const result = await query(
    `SELECT * FROM timeline_person
     WHERE user_id = $1 AND profile_id = $2
     AND (id::text = $3 OR LOWER(name) = LOWER($3))`,
    [userId, profileId, personNameOrId]
  );

  return result.rows[0] || null;
}

// ============================================================================
// EVENT DEDUPLICATION
// ============================================================================

/**
 * Find similar events using pgvector L2 distance
 * Lower distance = more similar
 *
 * @param {Object} client - Database client
 * @param {Object} params - Search parameters
 * @returns {Promise<Object|null>} Most similar event or null
 */
async function findSimilarEvent(client, { userId, profileId, personId, embedding, eventType = null }) {
  const vectorStr = formatForPgVector(embedding);

  // Query for similar events using L2 distance (lower = more similar)
  let sql = `
    SELECT id, title, description, event_type, event_year, event_month, event_day,
           city, state, country, emotions, confidence, mention_count,
           (embedding <-> $4::vector) AS distance
    FROM timeline_event
    WHERE user_id = $1 AND profile_id = $2 AND person_id = $3
    AND embedding IS NOT NULL
  `;

  const params = [userId, profileId, personId, vectorStr];

  // Optionally filter by event type for stricter matching
  if (eventType) {
    sql += ` AND event_type = $5`;
    params.push(eventType);
  }

  sql += `
    ORDER BY embedding <-> $4::vector
    LIMIT 1
  `;

  const result = await client.query(sql, params);

  if (result.rowCount === 0) {
    return null;
  }

  const candidate = result.rows[0];

  // Check if distance is below threshold (lower = more similar)
  if (candidate.distance <= DISTANCE_THRESHOLD) {
    const similarityPercent = Math.max(0, (1 - candidate.distance) * 100).toFixed(1);
    console.log(`[EventStore] Found similar event: "${candidate.title}" (distance: ${candidate.distance.toFixed(3)}, ~${similarityPercent}% similar)`);
    return candidate;
  }

  // Not similar enough, treat as new event
  console.log(`[EventStore] No match found (nearest: "${candidate.title}" at distance ${candidate.distance.toFixed(3)})`);
  return null;
}

// ============================================================================
// EVENT INSERTION & MERGING
// ============================================================================

/**
 * Insert a new event
 *
 * @param {Object} client - Database client
 * @param {Object} params - Event parameters
 * @returns {Promise<string>} Event UUID
 */
async function insertEvent(client, {
  userId,
  profileId,
  personId,
  event,
  embedding,
  firestoreDocId = null
}) {
  const vectorStr = formatForPgVector(embedding);

  const result = await client.query(
    `INSERT INTO timeline_event (
      user_id, profile_id, person_id, firestore_doc_id,
      event_type, title, description,
      event_date, event_year, event_month, event_day, date_precision,
      city, state, country,
      emotions, confidence, mention_count, verified,
      source_type, conversation_id, message_id,
      embedding
    )
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7,
      $8, $9, $10, $11, $12,
      $13, $14, $15,
      $16, $17, 1, $18,
      $19, $20, $21,
      $22::vector
    )
    RETURNING id`,
    [
      userId,
      profileId,
      personId,
      firestoreDocId,
      event.event_type || 'milestone',
      event.title || 'Untitled Event',
      event.description || null,
      event.event_date || null,
      event.event_year || null,
      event.event_month || null,
      event.event_day || null,
      event.date_precision || 'unknown',
      event.city || null,
      event.state || null,
      event.country || null,
      event.emotions || [],
      event.confidence || 0.8,
      !event.is_inferred,
      event.source_type || 'conversation',
      event.conversation_id || null,
      event.message_id || null,
      vectorStr
    ]
  );

  const eventId = result.rows[0].id;
  console.log(`[EventStore] Inserted event: "${event.title}" (${eventId})`);

  // Insert people relationships
  if (Array.isArray(event.people) && event.people.length > 0) {
    await insertEventPeople(client, {
      userId,
      profileId,
      eventId,
      people: event.people
    });
  }

  // Insert neural pathway questions
  if (Array.isArray(event.neural_pathways) && event.neural_pathways.length > 0) {
    await insertEventQuestions(client, {
      userId,
      profileId,
      personId,
      eventId,
      questions: event.neural_pathways
    });
  }

  return eventId;
}

/**
 * Merge new information into existing event
 *
 * @param {Object} client - Database client
 * @param {Object} existing - Existing event
 * @param {Object} incoming - New event data
 * @param {number[]} embedding - New embedding
 * @returns {Promise<string>} Event UUID
 */
async function mergeEvent(client, existing, incoming, embedding) {
  const vectorStr = formatForPgVector(embedding);

  // Smart merge: prefer non-null values, combine arrays
  const mergedDescription = mergeDescriptions(existing.description, incoming.description);
  const mergedEmotions = mergeArrays(existing.emotions, incoming.emotions);

  // Update date if we have better precision
  let updateDate = false;
  let newYear = existing.event_year;
  let newMonth = existing.event_month;
  let newDay = existing.event_day;
  let newPrecision = existing.date_precision;

  if (incoming.event_year && !existing.event_year) {
    newYear = incoming.event_year;
    updateDate = true;
  }
  if (incoming.event_month && !existing.event_month) {
    newMonth = incoming.event_month;
    updateDate = true;
  }
  if (incoming.event_day && !existing.event_day) {
    newDay = incoming.event_day;
    updateDate = true;
  }

  // Determine new date precision
  if (newYear && newMonth && newDay) {
    newPrecision = 'exact';
  } else if (newYear && newMonth) {
    newPrecision = 'month';
  } else if (newYear) {
    newPrecision = 'year';
  }

  // Update location if we have better info
  const city = incoming.city || existing.city;
  const state = incoming.state || existing.state;
  const country = incoming.country || existing.country;

  // Higher confidence wins
  const newConfidence = Math.max(
    existing.confidence || 0.5,
    incoming.confidence || 0.5
  );

  await client.query(
    `UPDATE timeline_event
     SET description = $1,
         emotions = $2,
         event_year = $3,
         event_month = $4,
         event_day = $5,
         date_precision = $6,
         city = $7,
         state = $8,
         country = $9,
         confidence = $10,
         mention_count = mention_count + 1,
         updated_at = NOW(),
         embedding = $11::vector
     WHERE id = $12`,
    [
      mergedDescription,
      mergedEmotions,
      newYear,
      newMonth,
      newDay,
      newPrecision,
      city,
      state,
      country,
      newConfidence,
      vectorStr,
      existing.id
    ]
  );

  console.log(`[EventStore] Merged into event: "${existing.title}" (mention #${existing.mention_count + 1})`);
  return existing.id;
}

/**
 * Insert event-people relationships
 */
async function insertEventPeople(client, { userId, profileId, eventId, people }) {
  for (const personName of people) {
    if (!personName) continue;

    // Try to find or create the person
    let relatedPersonId = null;
    try {
      relatedPersonId = await ensurePerson(client, { userId, profileId, personName });
    } catch (e) {
      // Person might not need to be a timeline_person entry
      console.log(`[EventStore] Skipping person link for: ${personName}`);
    }

    await client.query(
      `INSERT INTO timeline_event_people (event_id, person_name, person_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (event_id, person_name) DO NOTHING`,
      [eventId, personName, relatedPersonId]
    );
  }
}

/**
 * Insert neural pathway questions for an event
 */
async function insertEventQuestions(client, { userId, profileId, personId, eventId, questions }) {
  for (const questionText of questions) {
    if (!questionText) continue;

    // Determine category from question content
    const category = categorizeQuestion(questionText);

    await client.query(
      `INSERT INTO timeline_event_questions (
        user_id, profile_id, person_id, event_id,
        question, category, priority
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, profileId, personId, eventId, questionText, category, 0.5]
    );
  }
}

// ============================================================================
// MAIN UPSERT FUNCTION
// ============================================================================

/**
 * Upsert events with semantic deduplication
 *
 * For each event:
 * 1. Generate embedding
 * 2. Search for similar events via pgvector
 * 3. If found → merge; else insert
 *
 * @param {Object} params - Upsert parameters
 * @returns {Promise<string[]>} Array of event UUIDs
 */
async function upsertEventsWithDedup({ userId, profileId, personName, events }) {
  if (!events || events.length === 0) {
    return [];
  }

  return withTransaction(async (client) => {
    // Ensure person exists
    const personId = await ensurePerson(client, { userId, profileId, personName });

    const eventIds = [];

    for (const event of events) {
      try {
        // Generate embedding for this event
        const embedding = await embedTimelineEvent(event);

        // Look for similar existing event
        const existing = await findSimilarEvent(client, {
          userId,
          profileId,
          personId,
          embedding,
          eventType: event.event_type
        });

        if (existing) {
          // Merge with existing event
          const id = await mergeEvent(client, existing, event, embedding);
          eventIds.push(id);
        } else {
          // Insert new event
          const id = await insertEvent(client, {
            userId,
            profileId,
            personId,
            event,
            embedding
          });
          eventIds.push(id);
        }
      } catch (error) {
        console.error(`[EventStore] Error upserting event "${event.title}":`, error.message);
        // Continue with other events
      }
    }

    console.log(`[EventStore] Upserted ${eventIds.length}/${events.length} events for ${personName}`);
    return eventIds;
  });
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get all events for a person
 */
async function getEventsForPerson({ userId, profileId, personId, limit = 100 }) {
  const result = await query(
    `SELECT e.*, p.name as person_name
     FROM timeline_event e
     LEFT JOIN timeline_person p ON e.person_id = p.id
     WHERE e.user_id = $1 AND e.profile_id = $2 AND e.person_id = $3
     ORDER BY COALESCE(e.event_year, 9999), e.created_at
     LIMIT $4`,
    [userId, profileId, personId, limit]
  );

  return result.rows;
}

/**
 * Search events semantically
 */
async function searchEventsSemantic({ userId, profileId, queryText, limit = 10 }) {
  const { embedText } = require('../llm/embeddings');
  const embedding = await embedText(queryText);
  const vectorStr = formatForPgVector(embedding);

  const result = await query(
    `SELECT e.*, p.name as person_name,
            1 - (e.embedding <=> $4::vector) as similarity
     FROM timeline_event e
     LEFT JOIN timeline_person p ON e.person_id = p.id
     WHERE e.user_id = $1 AND e.profile_id = $2
     AND e.embedding IS NOT NULL
     ORDER BY e.embedding <=> $4::vector
     LIMIT $3`,
    [userId, profileId, limit, vectorStr]
  );

  return result.rows;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function mergeDescriptions(a, b) {
  if (!a) return b || '';
  if (!b) return a;
  if (a.includes(b) || b.includes(a)) {
    return a.length >= b.length ? a : b;
  }
  return a + '\n\n' + b;
}

function mergeArrays(a = [], b = []) {
  const set = new Set([...(a || []), ...(b || [])].filter(Boolean));
  return Array.from(set);
}

function categorizeQuestion(question) {
  const q = question.toLowerCase();

  if (q.includes('when') || q.includes('year') || q.includes('date')) return 'time';
  if (q.includes('where') || q.includes('location') || q.includes('city')) return 'location';
  if (q.includes('school') || q.includes('study') || q.includes('degree')) return 'education';
  if (q.includes('job') || q.includes('work') || q.includes('career')) return 'career';
  if (q.includes('who') || q.includes('relationship') || q.includes('married')) return 'relationship';
  if (q.includes('feel') || q.includes('emotion') || q.includes('happy') || q.includes('sad')) return 'emotion';

  return 'experience';
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Person management
  ensurePerson,
  getPerson,

  // Event operations
  upsertEventsWithDedup,
  insertEvent,
  mergeEvent,
  findSimilarEvent,

  // Queries
  getEventsForPerson,
  searchEventsSemantic,

  // Constants
  SIMILARITY_THRESHOLD
};
