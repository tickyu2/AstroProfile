/**
 * ============================================================================
 * TIMELINE ADMIN ENDPOINTS
 * ============================================================================
 * Admin API for managing timeline events, merges, and questions.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { query, withTransaction, getClient } = require('../database/pool');
const { logAdminAction } = require('./middleware');

// ============================================================================
// MERGE CANDIDATES
// ============================================================================

/**
 * Get pending merge candidates
 */
async function getPendingMerges(limit = 50, offset = 0, status = 'pending') {
  const result = await query(`
    SELECT
      m.id as candidate_id,
      m.from_event_id,
      m.to_event_id,
      m.link_type,
      m.confidence,
      m.created_at,
      m.status,
      e1.title as from_title,
      e1.description as from_description,
      e1.event_year as from_year,
      e2.title as to_title,
      e2.description as to_description,
      e2.event_year as to_year,
      p.name as person_name,
      p.user_id
    FROM timeline_event_links m
    JOIN timeline_event e1 ON m.from_event_id = e1.id
    JOIN timeline_event e2 ON m.to_event_id = e2.id
    JOIN timeline_person p ON e1.person_id = p.id
    WHERE m.link_type = 'duplicate_of'
      AND m.status = $1
    ORDER BY m.confidence DESC, m.created_at ASC
    LIMIT $2 OFFSET $3
  `, [status, limit, offset]);

  return result.rows;
}

/**
 * Get merge candidate details
 */
async function getMergeCandidate(candidateId) {
  const result = await query(`
    SELECT
      m.*,
      e1.id as from_id, e1.title as from_title, e1.description as from_description,
      e1.event_year as from_year, e1.event_month as from_month, e1.event_day as from_day,
      e1.city as from_city, e1.state as from_state, e1.country as from_country,
      e1.emotions as from_emotions, e1.event_type as from_type,
      e2.id as to_id, e2.title as to_title, e2.description as to_description,
      e2.event_year as to_year, e2.event_month as to_month, e2.event_day as to_day,
      e2.city as to_city, e2.state as to_state, e2.country as to_country,
      e2.emotions as to_emotions, e2.event_type as to_type,
      p.name as person_name, p.user_id
    FROM timeline_event_links m
    JOIN timeline_event e1 ON m.from_event_id = e1.id
    JOIN timeline_event e2 ON m.to_event_id = e2.id
    JOIN timeline_person p ON e1.person_id = p.id
    WHERE m.id = $1
  `, [candidateId]);

  if (result.rowCount === 0) {
    throw new Error('Merge candidate not found');
  }

  const row = result.rows[0];

  return {
    candidate: {
      id: row.id,
      confidence: row.confidence,
      status: row.status,
      createdAt: row.created_at
    },
    fromEvent: {
      id: row.from_id,
      title: row.from_title,
      description: row.from_description,
      year: row.from_year,
      month: row.from_month,
      day: row.from_day,
      city: row.from_city,
      state: row.from_state,
      country: row.from_country,
      emotions: row.from_emotions,
      type: row.from_type
    },
    toEvent: {
      id: row.to_id,
      title: row.to_title,
      description: row.to_description,
      year: row.to_year,
      month: row.to_month,
      day: row.to_day,
      city: row.to_city,
      state: row.to_state,
      country: row.to_country,
      emotions: row.to_emotions,
      type: row.to_type
    },
    personName: row.person_name,
    userId: row.user_id
  };
}

/**
 * Approve merge
 */
async function approveMerge(actor, requestId, candidateId, action, note) {
  return withTransaction(async (client) => {
    // Get candidate
    const candidate = await getMergeCandidate(candidateId);

    if (action === 'merge') {
      // Merge events: keep toEvent, update with fromEvent data, delete fromEvent
      const merged = {
        title: candidate.toEvent.title || candidate.fromEvent.title,
        description: mergeDescriptions(candidate.fromEvent.description, candidate.toEvent.description),
        event_year: candidate.toEvent.year || candidate.fromEvent.year,
        event_month: candidate.toEvent.month || candidate.fromEvent.month,
        event_day: candidate.toEvent.day || candidate.fromEvent.day,
        city: candidate.toEvent.city || candidate.fromEvent.city,
        state: candidate.toEvent.state || candidate.fromEvent.state,
        country: candidate.toEvent.country || candidate.fromEvent.country,
        emotions: mergeArrays(candidate.fromEvent.emotions, candidate.toEvent.emotions)
      };

      // Update target event
      await client.query(`
        UPDATE timeline_event SET
          title = COALESCE($1, title),
          description = $2,
          event_year = COALESCE($3, event_year),
          event_month = COALESCE($4, event_month),
          event_day = COALESCE($5, event_day),
          city = COALESCE($6, city),
          state = COALESCE($7, state),
          country = COALESCE($8, country),
          emotions = $9,
          mention_count = mention_count + 1,
          updated_at = NOW()
        WHERE id = $10
      `, [
        merged.title,
        merged.description,
        merged.event_year,
        merged.event_month,
        merged.event_day,
        merged.city,
        merged.state,
        merged.country,
        JSON.stringify(merged.emotions),
        candidate.toEvent.id
      ]);

      // Move any questions from source to target
      await client.query(`
        UPDATE timeline_event_questions
        SET event_id = $1
        WHERE event_id = $2
      `, [candidate.toEvent.id, candidate.fromEvent.id]);

      // Delete source event
      await client.query(`DELETE FROM timeline_event WHERE id = $1`, [candidate.fromEvent.id]);

    } else if (action === 'split') {
      // Keep both events separate, mark as not duplicates
      // No data changes needed
    }

    // Update link status
    await client.query(`
      UPDATE timeline_event_links
      SET status = $1, resolved_at = NOW(), resolved_by = $2
      WHERE id = $3
    `, [action === 'ignore' ? 'ignored' : action === 'merge' ? 'merged' : 'split', actor.email, candidateId]);

    // Audit
    const auditId = await logAdminAction({
      actor,
      action: `merge_${action}`,
      targetType: 'timeline_merge',
      targetId: candidateId,
      before: candidate,
      after: { action, note },
      reason: note,
      requestId
    });

    return { action, candidateId, auditId };
  });
}

/**
 * Rollback a merge
 */
async function rollbackMerge(actor, requestId, candidateId, reason) {
  // This would require storing merge details to restore
  // For now, log the request for manual intervention
  const auditId = await logAdminAction({
    actor,
    action: 'request_merge_rollback',
    targetType: 'timeline_merge',
    targetId: candidateId,
    before: {},
    after: {},
    reason,
    requestId,
    metadata: { requiresManualIntervention: true }
  });

  return { requested: true, auditId, note: 'Merge rollback requires manual data restoration' };
}

// ============================================================================
// TIMELINE EVENTS
// ============================================================================

/**
 * Search timeline events
 */
async function searchTimelineEvents(searchTerm, userId = null, limit = 50, offset = 0) {
  let sql = `
    SELECT e.*, p.name as person_name, p.user_id
    FROM timeline_event e
    JOIN timeline_person p ON e.person_id = p.id
    WHERE (e.title ILIKE $1 OR e.description ILIKE $1)
  `;
  const params = [`%${searchTerm}%`];

  if (userId) {
    sql += ` AND p.user_id = $2`;
    params.push(userId);
  }

  sql += ` ORDER BY e.updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
}

/**
 * Get event with full details
 */
async function getEventDetails(eventId) {
  const eventResult = await query(`
    SELECT e.*, p.name as person_name, p.user_id, p.birth_year
    FROM timeline_event e
    JOIN timeline_person p ON e.person_id = p.id
    WHERE e.id = $1
  `, [eventId]);

  if (eventResult.rowCount === 0) {
    throw new Error('Event not found');
  }

  const questionsResult = await query(`
    SELECT * FROM timeline_event_questions
    WHERE event_id = $1
    ORDER BY priority DESC, created_at ASC
  `, [eventId]);

  const linksResult = await query(`
    SELECT l.*, e.title as linked_title
    FROM timeline_event_links l
    JOIN timeline_event e ON (
      CASE WHEN l.from_event_id = $1 THEN l.to_event_id ELSE l.from_event_id END = e.id
    )
    WHERE l.from_event_id = $1 OR l.to_event_id = $1
  `, [eventId]);

  return {
    event: eventResult.rows[0],
    questions: questionsResult.rows,
    links: linksResult.rows
  };
}

/**
 * Update event (admin override)
 */
async function updateEvent(actor, requestId, eventId, updates, reason) {
  const before = await getEventDetails(eventId);

  const allowedFields = [
    'title', 'description', 'event_type',
    'event_year', 'event_month', 'event_day', 'date_precision',
    'city', 'state', 'country', 'emotions', 'verified'
  ];

  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updates)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(snakeKey) && value !== undefined) {
      fields.push(`${snakeKey} = $${idx++}`);
      values.push(key === 'emotions' ? JSON.stringify(value) : value);
    }
  }

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(eventId);
  await query(`
    UPDATE timeline_event
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
  `, values);

  const after = await getEventDetails(eventId);

  const auditId = await logAdminAction({
    actor,
    action: 'update_timeline_event',
    targetType: 'timeline_event',
    targetId: eventId,
    before: before.event,
    after: after.event,
    reason,
    requestId
  });

  return { before: before.event, after: after.event, auditId };
}

/**
 * Delete event (admin)
 */
async function deleteEvent(actor, requestId, eventId, reason) {
  const before = await getEventDetails(eventId);

  await query(`DELETE FROM timeline_event_questions WHERE event_id = $1`, [eventId]);
  await query(`DELETE FROM timeline_event_links WHERE from_event_id = $1 OR to_event_id = $1`, [eventId]);
  await query(`DELETE FROM timeline_event WHERE id = $1`, [eventId]);

  const auditId = await logAdminAction({
    actor,
    action: 'delete_timeline_event',
    targetType: 'timeline_event',
    targetId: eventId,
    before: before.event,
    after: null,
    reason,
    requestId
  });

  return { deleted: true, auditId };
}

// ============================================================================
// QUESTIONS (NEURAL PATHWAYS)
// ============================================================================

/**
 * Get question queue
 */
async function getQuestionQueue(status = 'open', limit = 50, offset = 0) {
  let whereClause = '';
  if (status === 'open') {
    whereClause = 'WHERE q.answered = false AND q.skipped = false';
  } else if (status === 'answered') {
    whereClause = 'WHERE q.answered = true';
  } else if (status === 'skipped') {
    whereClause = 'WHERE q.skipped = true';
  }

  const result = await query(`
    SELECT
      q.*,
      e.title as event_title,
      e.event_year,
      p.name as person_name,
      p.user_id
    FROM timeline_event_questions q
    JOIN timeline_event e ON q.event_id = e.id
    JOIN timeline_person p ON q.person_id = p.id
    ${whereClause}
    ORDER BY q.priority DESC, q.created_at ASC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  return result.rows;
}

/**
 * Get question details
 */
async function getQuestionDetails(questionId) {
  const result = await query(`
    SELECT
      q.*,
      e.title as event_title,
      e.description as event_description,
      e.event_year, e.event_month, e.event_day,
      e.city, e.state, e.country,
      p.name as person_name,
      p.user_id
    FROM timeline_event_questions q
    JOIN timeline_event e ON q.event_id = e.id
    JOIN timeline_person p ON q.person_id = p.id
    WHERE q.id = $1
  `, [questionId]);

  if (result.rowCount === 0) {
    throw new Error('Question not found');
  }

  return result.rows[0];
}

/**
 * Mark question as answered
 */
async function markQuestionAnswered(actor, requestId, questionId, note) {
  const before = await getQuestionDetails(questionId);

  await query(`
    UPDATE timeline_event_questions
    SET answered = true, answered_at = NOW(), answered_by = $1
    WHERE id = $2
  `, [actor.email, questionId]);

  const after = await getQuestionDetails(questionId);

  const auditId = await logAdminAction({
    actor,
    action: 'mark_question_answered',
    targetType: 'timeline_question',
    targetId: questionId,
    before,
    after,
    reason: note,
    requestId
  });

  return { before, after, auditId };
}

/**
 * Apply answer to event and mark question answered
 */
async function applyQuestionAnswer(actor, requestId, questionId, eventUpdates, note) {
  return withTransaction(async (client) => {
    const question = await getQuestionDetails(questionId);

    // Update event with answer
    const allowedFields = ['event_year', 'event_month', 'event_day', 'city', 'state', 'country'];
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(eventUpdates)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(snakeKey) && value !== undefined) {
        fields.push(`${snakeKey} = $${idx++}`);
        values.push(value);
      }
    }

    if (fields.length > 0) {
      values.push(question.event_id);
      await client.query(`
        UPDATE timeline_event
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${idx}
      `, values);
    }

    // Mark question answered
    await client.query(`
      UPDATE timeline_event_questions
      SET answered = true, answered_at = NOW(), answered_by = $1
      WHERE id = $2
    `, [actor.email, questionId]);

    const auditId = await logAdminAction({
      actor,
      action: 'apply_question_answer',
      targetType: 'timeline_question',
      targetId: questionId,
      before: question,
      after: { eventUpdates, note },
      reason: note,
      requestId
    });

    return { questionId, eventUpdates, auditId };
  });
}

/**
 * Bulk mark questions answered
 */
async function bulkMarkQuestionsAnswered(actor, requestId, questionIds, note) {
  const results = [];

  for (const questionId of questionIds) {
    try {
      const result = await markQuestionAnswered(actor, requestId, questionId, note);
      results.push({ questionId, success: true, auditId: result.auditId });
    } catch (error) {
      results.push({ questionId, success: false, error: error.message });
    }
  }

  return results;
}

// ============================================================================
// HELPERS
// ============================================================================

function mergeDescriptions(desc1, desc2) {
  if (!desc1) return desc2;
  if (!desc2) return desc1;
  if (desc1 === desc2) return desc1;
  return `${desc1}\n\n[Additional context]: ${desc2}`;
}

function mergeArrays(arr1, arr2) {
  const set = new Set([...(arr1 || []), ...(arr2 || [])]);
  return Array.from(set);
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Merges
  getPendingMerges,
  getMergeCandidate,
  approveMerge,
  rollbackMerge,

  // Events
  searchTimelineEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,

  // Questions
  getQuestionQueue,
  getQuestionDetails,
  markQuestionAnswered,
  applyQuestionAnswer,
  bulkMarkQuestionsAnswered
};
