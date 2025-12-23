/**
 * ============================================================================
 * TIMELINE QUESTION ANSWERING DETECTION
 * ============================================================================
 * Detects when user messages answer pending timeline questions.
 * Extracts structured updates and marks questions as answered.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { getClient, withTransaction } = require('../database/pool');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ============================================================================
// CONFIGURATION
// ============================================================================

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenerativeAI(apiKey);
}

// ============================================================================
// MAIN DETECTION FUNCTION
// ============================================================================

/**
 * Process a message to detect if it answers any pending questions
 *
 * @param {Object} params - Detection parameters
 * @returns {Promise<Object|null>} Match result or null
 */
async function processPotentialQuestionAnswer({
  userId,
  profileId = 'default',
  personName,
  message
}) {
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

    // Get pending questions
    const qRes = await client.query(
      `SELECT id, event_id, question, category
       FROM timeline_event_questions
       WHERE user_id = $1 AND profile_id = $2 AND person_id = $3
       AND answered = false AND skipped = false
       ORDER BY priority DESC, created_at ASC
       LIMIT 10`,
      [userId, profileId, personId]
    );

    const questions = qRes.rows;
    if (questions.length === 0) {
      return null;
    }

    // Ask LLM: does this message answer any questions?
    const mapping = await matchAnswerToQuestions({ message, questions });

    if (!mapping || !mapping.matched_question_id) {
      console.log('[QuestionAnswering] No question matched');
      return null;
    }

    console.log(`[QuestionAnswering] Message answers question: ${mapping.matched_question_id}`);

    // Update database in transaction
    await client.query('BEGIN');

    // Mark question as answered
    await client.query(
      `UPDATE timeline_event_questions
       SET answered = true, answered_at = NOW(), answered_by = $2
       WHERE id = $1`,
      [mapping.matched_question_id, mapping.event_id]
    );

    // Apply event updates if any
    if (mapping.event_id && mapping.event_updates) {
      await applyEventUpdates(client, mapping.event_id, mapping.event_updates);
    }

    await client.query('COMMIT');

    return {
      matched_question_id: mapping.matched_question_id,
      event_id: mapping.event_id,
      updates_applied: mapping.event_updates || {},
      confidence: mapping.confidence || 0.8
    };

  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[QuestionAnswering] Error:', error);
    return null;
  } finally {
    client.release();
  }
}

// ============================================================================
// LLM MATCHING
// ============================================================================

/**
 * Use LLM to match user message to pending questions
 */
async function matchAnswerToQuestions({ message, questions }) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  });

  const systemPrompt = `You are helping map a user's natural language reply to specific biographical questions and structured updates.

Given:
- A user reply message
- A list of open questions (id, event_id, question, category)

You must:
1. Decide if the message answers ONE of the questions (or none)
2. If it does, specify which question_id and event_id
3. Extract structured updates if present: event_year, event_month, event_day, city, state, country
4. Provide confidence score (0-1)

Rules:
- If no question is clearly answered, set matched_question_id to null
- Do NOT guess dates or locations; only extract if explicitly stated
- event_month is 1-12, event_day is 1-31, event_year is 4-digit
- Be strict: only match if the answer clearly addresses the question
- Return valid JSON only`;

  const userPrompt = `User reply:
"""
${message}
"""

Open questions:
${JSON.stringify(questions, null, 2)}

Return JSON:
{
  "matched_question_id": "uuid string" | null,
  "event_id": "uuid string" | null,
  "confidence": 0.0 to 1.0,
  "event_updates": {
    "event_year": number | null,
    "event_month": number | null,
    "event_day": number | null,
    "city": string | null,
    "state": string | null,
    "country": string | null,
    "description_addition": string | null
  }
}`;

  try {
    const result = await model.generateContent([
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'I understand. I will analyze the message and match it to questions, returning valid JSON.' }] },
      { role: 'user', parts: [{ text: userPrompt }] }
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn('[QuestionAnswering] No JSON in response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate
    if (!parsed.matched_question_id) {
      return null;
    }

    // Ensure confidence threshold
    if (parsed.confidence && parsed.confidence < 0.6) {
      console.log(`[QuestionAnswering] Low confidence match (${parsed.confidence}), skipping`);
      return null;
    }

    return parsed;

  } catch (error) {
    console.error('[QuestionAnswering] LLM error:', error.message);
    return null;
  }
}

// ============================================================================
// EVENT UPDATES
// ============================================================================

/**
 * Apply extracted updates to timeline event
 */
async function applyEventUpdates(client, eventId, updates) {
  const fields = [];
  const values = [];
  let idx = 1;

  // Date fields
  if (updates.event_year != null && Number.isInteger(updates.event_year)) {
    fields.push(`event_year = $${idx++}`);
    values.push(updates.event_year);
  }
  if (updates.event_month != null && updates.event_month >= 1 && updates.event_month <= 12) {
    fields.push(`event_month = $${idx++}`);
    values.push(updates.event_month);
  }
  if (updates.event_day != null && updates.event_day >= 1 && updates.event_day <= 31) {
    fields.push(`event_day = $${idx++}`);
    values.push(updates.event_day);
  }

  // Location fields
  if (updates.city && typeof updates.city === 'string') {
    fields.push(`city = $${idx++}`);
    values.push(updates.city.trim());
  }
  if (updates.state && typeof updates.state === 'string') {
    fields.push(`state = $${idx++}`);
    values.push(updates.state.trim());
  }
  if (updates.country && typeof updates.country === 'string') {
    fields.push(`country = $${idx++}`);
    values.push(updates.country.trim());
  }

  // Description addition
  if (updates.description_addition && typeof updates.description_addition === 'string') {
    fields.push(`description = COALESCE(description, '') || E'\\n\\n' || $${idx++}`);
    values.push(updates.description_addition.trim());
  }

  // Update date precision based on what we now have
  if (updates.event_year || updates.event_month || updates.event_day) {
    // Determine new precision
    const hasDay = updates.event_day != null;
    const hasMonth = updates.event_month != null;
    const hasYear = updates.event_year != null;

    let precision = 'unknown';
    if (hasYear && hasMonth && hasDay) precision = 'exact';
    else if (hasYear && hasMonth) precision = 'month';
    else if (hasYear) precision = 'year';

    if (precision !== 'unknown') {
      fields.push(`date_precision = $${idx++}`);
      values.push(precision);
    }
  }

  if (fields.length === 0) {
    console.log('[QuestionAnswering] No valid updates to apply');
    return;
  }

  values.push(eventId);
  const sql = `
    UPDATE timeline_event
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
  `;

  await client.query(sql, values);
  console.log(`[QuestionAnswering] Applied ${fields.length} updates to event ${eventId}`);
}

// ============================================================================
// BATCH PROCESSING
// ============================================================================

/**
 * Process multiple messages (e.g., after import) to detect answers
 */
async function processMessagesForAnswers({
  userId,
  profileId = 'default',
  personName,
  messages
}) {
  const results = [];

  for (const message of messages) {
    const result = await processPotentialQuestionAnswer({
      userId,
      profileId,
      personName,
      message: typeof message === 'string' ? message : message.content
    });

    if (result) {
      results.push(result);
    }
  }

  return {
    processed: messages.length,
    matched: results.length,
    matches: results
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  processPotentialQuestionAnswer,
  matchAnswerToQuestions,
  applyEventUpdates,
  processMessagesForAnswers
};
