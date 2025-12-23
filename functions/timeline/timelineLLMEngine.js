/**
 * ============================================================================
 * TIMELINE LLM ENGINE
 * ============================================================================
 * Three-mode LLM system for biographical intelligence:
 *
 * MODE 1: Structured Extraction - Convert conversation → timeline_event
 * MODE 2: Gap Detection - Analyze events → timeline_event_questions
 * MODE 3: Narrative Generation - Events → readable biography
 *
 * Designed to:
 * - Avoid hallucination (strict rules, confidence scoring)
 * - Enforce structure (JSON schemas, validation)
 * - Integrate with TIMELINE_DATABASE_SCHEMA_V2
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE - Curating Life Stories
 * ============================================================================
 */

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

function getExtractionModel() {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    generationConfig: {
      temperature: 0.2, // Low temperature for consistent extraction
      responseMimeType: 'application/json'
    }
  });
}

function getNarrativeModel() {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    generationConfig: {
      temperature: 0.7 // Higher temperature for natural writing
    }
  });
}

// ============================================================================
// EVENT TYPE TAXONOMY
// ============================================================================

const EVENT_TYPES = [
  'education',      // Schools, degrees, learning milestones
  'career',         // Jobs, promotions, career changes, retirement
  'relocation',     // Moving to new places, immigration
  'relationship',   // Marriage, divorce, partnerships, friendships
  'family',         // Birth of children, family milestones
  'health',         // Medical events, wellness changes
  'achievement',    // Awards, accomplishments, milestones
  'travel',         // Significant trips, adventures
  'loss',           // Deaths, endings, grief
  'milestone',      // Birthdays, anniversaries, life transitions
  'spiritual',      // Religious events, spiritual awakenings
  'creative',       // Artistic creations, projects
  'financial'       // Major purchases, business ventures
];

const QUESTION_CATEGORIES = [
  'time',           // When did X happen?
  'location',       // Where did X happen?
  'education',      // What did they study?
  'career',         // What was their job?
  'relationship',   // Who is X to them?
  'experience',     // What was it like?
  'identity',       // Who are they?
  'emotion'         // How did they feel?
];

// ============================================================================
// MODE 1: STRUCTURED EXTRACTION ENGINE
// ============================================================================

const EXTRACTION_SYSTEM_PROMPT = `You are a biographical event extraction engine.

Your job is to extract structured life events from user messages and map them into a normalized timeline schema.

## STRICT RULES:
- Extract ONLY events that clearly refer to real-world happenings
- Do NOT invent dates, years, or locations
- If a date is not explicitly stated, set date fields to null
- If you infer something (e.g., likely decade from context), set is_inferred = true
- Never fabricate people or relationships
- All confidence scores must be between 0 and 1
- Return valid JSON only

## EVENT TYPE TAXONOMY:
${EVENT_TYPES.map(t => `- ${t}`).join('\n')}

## DATE PRECISION VALUES:
- "exact" - Full date known (year, month, day)
- "year" - Only year is known
- "decade" - Only decade is known (e.g., "the 80s")
- "approximate" - Rough estimate
- "unknown" - No date information

## CONFIDENCE GUIDELINES:
- 0.9-1.0: Explicit, direct statement ("I was born in 1985")
- 0.7-0.9: Strong implication ("When I graduated college in Austin")
- 0.5-0.7: Reasonable inference ("My daughter started kindergarten" → age ~5)
- 0.3-0.5: Weak inference, needs confirmation
- 0.0-0.3: Very uncertain, likely needs follow-up

## NEURAL PATHWAYS:
For each event, generate 1-3 questions about missing information.
These help fill gaps in the life story.

## OUTPUT FORMAT:
{
  "events": [
    {
      "title": "Brief event title",
      "event_type": "one of the taxonomy types",
      "description": "Detailed description",
      "event_date": "YYYY-MM-DD or null",
      "event_year": integer or null,
      "event_month": 1-12 or null,
      "event_day": 1-31 or null,
      "date_precision": "exact|year|decade|approximate|unknown",
      "city": "string or null",
      "state": "string or null",
      "country": "string or null",
      "people": ["array", "of", "names"],
      "emotions": ["array", "of", "emotions"],
      "confidence": 0.0 to 1.0,
      "is_inferred": true/false,
      "neural_pathways": ["Question 1?", "Question 2?"]
    }
  ],
  "extraction_notes": "Any notes about the extraction process"
}`;

/**
 * MODE 1: Extract structured events from conversation
 *
 * @param {string} message - The user message to analyze
 * @param {Object} context - Context about the user/profile
 * @param {string} context.userId - User ID
 * @param {string} context.profileId - Profile ID
 * @param {string} context.personName - Primary person being discussed
 * @param {Object} context.existingEvents - Known events for deduplication
 * @returns {Promise<Object>} Extracted events
 */
async function extractEvents(message, context = {}) {
  const {
    userId,
    profileId,
    personName = 'the person',
    existingEvents = [],
    conversationContext = ''
  } = context;

  const userPrompt = `Extract biographical events from the following message.

## CONTEXT:
- User ID: ${userId || 'unknown'}
- Profile ID: ${profileId || 'unknown'}
- Primary Person: ${personName}
${conversationContext ? `- Conversation Context: ${conversationContext}` : ''}

## EXISTING EVENTS (avoid duplicates):
${existingEvents.length > 0
    ? existingEvents.slice(0, 10).map(e => `- ${e.title} (${e.event_year || 'unknown year'})`).join('\n')
    : '- None yet'
  }

## MESSAGE TO ANALYZE:
"""
${message}
"""

Extract all biographical events. Return JSON with a top-level "events" array.
If no events are found, return {"events": [], "extraction_notes": "No biographical events detected"}.`;

  try {
    const model = getExtractionModel();
    const result = await model.generateContent([
      { role: 'user', parts: [{ text: EXTRACTION_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'I understand. I will extract biographical events following the strict rules and return valid JSON.' }] },
      { role: 'user', parts: [{ text: userPrompt }] }
    ]);

    const responseText = result.response.text();

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[TimelineLLM] No JSON found in extraction response');
      return { events: [], extraction_notes: 'Failed to parse response' };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and normalize events
    const validatedEvents = (parsed.events || []).map(event => ({
      title: event.title || 'Untitled Event',
      event_type: EVENT_TYPES.includes(event.event_type) ? event.event_type : 'milestone',
      description: event.description || '',
      event_date: event.event_date || null,
      event_year: Number.isInteger(event.event_year) ? event.event_year : null,
      event_month: event.event_month >= 1 && event.event_month <= 12 ? event.event_month : null,
      event_day: event.event_day >= 1 && event.event_day <= 31 ? event.event_day : null,
      date_precision: ['exact', 'year', 'decade', 'approximate', 'unknown'].includes(event.date_precision)
        ? event.date_precision : 'unknown',
      city: event.city || null,
      state: event.state || null,
      country: event.country || null,
      people: Array.isArray(event.people) ? event.people : [],
      emotions: Array.isArray(event.emotions) ? event.emotions : [],
      confidence: typeof event.confidence === 'number'
        ? Math.max(0, Math.min(1, event.confidence)) : 0.7,
      is_inferred: Boolean(event.is_inferred),
      neural_pathways: Array.isArray(event.neural_pathways) ? event.neural_pathways.slice(0, 5) : []
    }));

    console.log(`[TimelineLLM] Extracted ${validatedEvents.length} events`);

    return {
      success: true,
      events: validatedEvents,
      extraction_notes: parsed.extraction_notes || null,
      extractedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('[TimelineLLM] Extraction error:', error);
    return {
      success: false,
      events: [],
      error: error.message
    };
  }
}


// ============================================================================
// MODE 2: GAP DETECTION ENGINE (Neural Pathways)
// ============================================================================

const GAP_DETECTION_SYSTEM_PROMPT = `You are a biographical gap detection engine.

Your job is to analyze a person's timeline events and identify missing information that would enrich their life story.

## STRICT RULES:
- Do NOT invent facts or assume information
- Generate questions ONLY for missing or unclear fields
- Prioritize questions that unlock chronology (dates, years)
- Questions must be specific and actionable
- Return valid JSON only

## QUESTION CATEGORIES:
${QUESTION_CATEGORIES.map(c => `- ${c}`).join('\n')}

## PRIORITY GUIDELINES:
- 0.9-1.0: Critical missing info (birth year, major life events)
- 0.7-0.9: Important context (locations, key relationships)
- 0.5-0.7: Enriching details (emotions, experiences)
- 0.3-0.5: Nice to have (minor details)
- 0.0-0.3: Optional depth

## WHAT TO LOOK FOR:
1. Missing dates/years for events
2. Incomplete location information
3. Unnamed people (e.g., "my daughter" without name)
4. Events without context or emotion
5. Gaps in chronology (big jumps in time)
6. Relationships that need clarification
7. Career/education details that are vague

## OUTPUT FORMAT:
{
  "questions": [
    {
      "event_id": "the event UUID this relates to",
      "question": "The specific question to ask",
      "reason": "Why this information is important",
      "priority": 0.0 to 1.0,
      "category": "one of the categories above"
    }
  ],
  "analysis_notes": "Summary of gaps found"
}`;

/**
 * MODE 2: Detect gaps and generate questions
 *
 * @param {Array} events - Timeline events to analyze
 * @param {Object} context - Context about the person
 * @param {string} context.personName - Name of the person
 * @param {number} context.birthYear - Birth year if known
 * @returns {Promise<Object>} Generated questions
 */
async function detectGaps(events, context = {}) {
  const {
    personName = 'this person',
    birthYear = null,
    userId,
    profileId
  } = context;

  if (!events || events.length === 0) {
    return {
      success: true,
      questions: [{
        event_id: null,
        question: `Tell me about ${personName}'s life story. When and where were they born?`,
        reason: 'No events recorded yet - need to establish basic biography',
        priority: 1.0,
        category: 'identity'
      }],
      analysis_notes: 'No events to analyze - generated starter question'
    };
  }

  const userPrompt = `Analyze the following timeline events for missing information and generate questions.

## CONTEXT:
- Person: ${personName}
${birthYear ? `- Birth Year: ${birthYear}` : '- Birth Year: Unknown'}
- Total Events: ${events.length}

## EVENTS TO ANALYZE:
${JSON.stringify(events.map(e => ({
    id: e.id,
    title: e.title,
    event_type: e.event_type,
    year: e.event_year || e.date?.year,
    location: e.city || e.location?.city,
    people: e.people || e.people_involved,
    description: e.description?.slice(0, 200)
  })), null, 2)}

## INSTRUCTIONS:
1. Identify missing critical information
2. Find gaps in the chronology
3. Note relationships that need clarification
4. Generate specific, actionable questions
5. Prioritize by importance

Return JSON with a top-level "questions" array. Generate 5-15 questions.`;

  try {
    const model = getExtractionModel();
    const result = await model.generateContent([
      { role: 'user', parts: [{ text: GAP_DETECTION_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'I understand. I will analyze the events and generate questions for missing information, returning valid JSON.' }] },
      { role: 'user', parts: [{ text: userPrompt }] }
    ]);

    const responseText = result.response.text();

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[TimelineLLM] No JSON found in gap detection response');
      return { success: false, questions: [], error: 'Failed to parse response' };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate questions
    const validatedQuestions = (parsed.questions || []).map(q => ({
      event_id: q.event_id || null,
      question: q.question || 'Tell me more about this.',
      reason: q.reason || 'Additional context needed',
      priority: typeof q.priority === 'number'
        ? Math.max(0, Math.min(1, q.priority)) : 0.5,
      category: QUESTION_CATEGORIES.includes(q.category) ? q.category : 'experience'
    }));

    // Sort by priority
    validatedQuestions.sort((a, b) => b.priority - a.priority);

    console.log(`[TimelineLLM] Generated ${validatedQuestions.length} gap questions`);

    return {
      success: true,
      questions: validatedQuestions,
      analysis_notes: parsed.analysis_notes || null,
      analyzedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('[TimelineLLM] Gap detection error:', error);
    return {
      success: false,
      questions: [],
      error: error.message
    };
  }
}


// ============================================================================
// MODE 3: NARRATIVE GENERATION ENGINE
// ============================================================================

const NARRATIVE_SYSTEM_PROMPT = `You are a biographical narrative generator.

Your job is to write warm, human narrative summaries using ONLY the structured data provided.

## STRICT RULES:
- Do NOT invent dates, locations, or people
- If a field is missing, OMIT it rather than guessing
- Use warm, emotionally intelligent language
- Maintain chronological order
- Write in third person unless specified
- Never add facts not present in the data

## WRITING STYLE:
- Warm and reflective
- Human and authentic
- Respectful of the person's journey
- Connecting events into a coherent story
- Acknowledging emotions when present
- Noting relationships naturally

## LENGTH GUIDELINES:
- short: 2-3 sentences
- medium: 1-2 paragraphs
- long: 3-5 paragraphs with chapter structure`;

/**
 * MODE 3: Generate narrative from events
 *
 * @param {Array} events - Timeline events to narrate
 * @param {Object} options - Generation options
 * @param {string} options.personName - Name of the person
 * @param {string} options.length - 'short' | 'medium' | 'long'
 * @param {string} options.focus - Optional focus area
 * @param {string} options.tone - Tone adjustment
 * @returns {Promise<Object>} Generated narrative
 */
async function generateNarrative(events, options = {}) {
  const {
    personName = 'this person',
    length = 'medium',
    focus = null,
    tone = 'warm and reflective',
    includeQuestions = false
  } = options;

  if (!events || events.length === 0) {
    return {
      success: true,
      narrative: `${personName}'s story is just beginning to unfold. As they share more about their journey, a rich tapestry of experiences will emerge.`,
      length: 'short',
      eventCount: 0
    };
  }

  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => {
    const yearA = a.event_year || a.date?.year || 0;
    const yearB = b.event_year || b.date?.year || 0;
    return yearA - yearB;
  });

  const userPrompt = `Write a narrative summary for ${personName} using the following structured events.

## EVENTS (in chronological order):
${JSON.stringify(sortedEvents.map(e => ({
    title: e.title,
    type: e.event_type,
    year: e.event_year || e.date?.year,
    location: [e.city, e.state, e.country].filter(Boolean).join(', ') || null,
    people: e.people || e.people_involved,
    emotions: e.emotions,
    description: e.description
  })), null, 2)}

## INSTRUCTIONS:
- Length: ${length}
- Tone: ${tone}
${focus ? `- Focus Area: ${focus}` : ''}
- Do NOT add any facts not present in the data
- If dates are missing, use relative terms ("early in their career", "years later")
- Connect events into a flowing narrative
${includeQuestions ? '- End with 1-2 gentle questions to learn more' : ''}

Write the narrative now:`;

  try {
    const model = getNarrativeModel();
    const result = await model.generateContent([
      { role: 'user', parts: [{ text: NARRATIVE_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'I understand. I will write a warm narrative using only the provided facts.' }] },
      { role: 'user', parts: [{ text: userPrompt }] }
    ]);

    const narrative = result.response.text().trim();

    console.log(`[TimelineLLM] Generated ${length} narrative from ${events.length} events`);

    return {
      success: true,
      narrative,
      length,
      eventCount: events.length,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('[TimelineLLM] Narrative generation error:', error);
    return {
      success: false,
      narrative: null,
      error: error.message
    };
  }
}


// ============================================================================
// MODE 3B: PERIOD SUMMARY GENERATION
// ============================================================================

/**
 * Generate summary for a specific time period
 *
 * @param {Array} events - Events within the period
 * @param {Object} period - Period definition
 * @param {string} period.type - 'decade' | 'year' | 'chapter'
 * @param {string} period.label - "2010-2020", "2024", "Childhood"
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Period summary with short/medium/long versions
 */
async function generatePeriodSummary(events, period, options = {}) {
  const {
    personName = 'this person'
  } = options;

  if (!events || events.length === 0) {
    return {
      success: true,
      summary_short: `No documented events during ${period.label}.`,
      summary_medium: `${personName}'s ${period.label} period doesn't have documented events yet. This chapter of their story awaits discovery.`,
      summary_long: null,
      period,
      eventCount: 0
    };
  }

  const userPrompt = `Generate three summaries (short, medium, long) for ${personName}'s ${period.label} period.

## PERIOD: ${period.label} (${period.type})

## EVENTS IN THIS PERIOD:
${JSON.stringify(events.map(e => ({
    title: e.title,
    type: e.event_type,
    year: e.event_year || e.date?.year,
    description: e.description?.slice(0, 200)
  })), null, 2)}

## OUTPUT FORMAT (JSON):
{
  "summary_short": "1-2 sentences capturing the essence",
  "summary_medium": "1 paragraph with key highlights",
  "summary_long": "2-3 paragraphs with narrative flow",
  "highlights": ["key event 1", "key event 2"],
  "dominant_emotions": ["emotion1", "emotion2"],
  "themes": ["theme1", "theme2"]
}`;

  try {
    const model = getExtractionModel();
    const result = await model.generateContent([
      { role: 'user', parts: [{ text: NARRATIVE_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'I will generate period summaries in JSON format.' }] },
      { role: 'user', parts: [{ text: userPrompt }] }
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to parse summary response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      summary_short: parsed.summary_short || null,
      summary_medium: parsed.summary_medium || null,
      summary_long: parsed.summary_long || null,
      highlights: parsed.highlights || [],
      dominant_emotions: parsed.dominant_emotions || [],
      themes: parsed.themes || [],
      period,
      eventCount: events.length,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('[TimelineLLM] Period summary error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}


// ============================================================================
// MODE 4: QUESTION ANSWERING (Check if question is answered)
// ============================================================================

/**
 * Check if a neural pathway question has been answered by new information
 *
 * @param {string} question - The question to check
 * @param {Object} event - The event data to check against
 * @param {string} newMessage - Optional new message to check
 * @returns {Promise<Object>} Whether question is answered
 */
async function checkQuestionAnswered(question, event, newMessage = null) {
  const userPrompt = `Determine if the following question has been answered.

## QUESTION:
"${question}"

## EVENT DATA:
${JSON.stringify({
    title: event.title,
    description: event.description,
    year: event.event_year || event.date?.year,
    location: event.city || event.location?.city,
    people: event.people || event.people_involved
  }, null, 2)}

${newMessage ? `## NEW MESSAGE:\n"${newMessage}"` : ''}

## OUTPUT FORMAT (JSON):
{
  "is_answered": true/false,
  "confidence": 0.0 to 1.0,
  "answer_source": "event_data" | "new_message" | "both",
  "extracted_answer": "The answer if found, or null"
}`;

  try {
    const model = getExtractionModel();
    const result = await model.generateContent(userPrompt);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return { is_answered: false, confidence: 0 };
    }

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error('[TimelineLLM] Question check error:', error);
    return { is_answered: false, confidence: 0, error: error.message };
  }
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Mode 1: Extraction
  extractEvents,

  // Mode 2: Gap Detection
  detectGaps,

  // Mode 3: Narrative
  generateNarrative,
  generatePeriodSummary,

  // Mode 4: Question Checking
  checkQuestionAnswered,

  // Constants
  EVENT_TYPES,
  QUESTION_CATEGORIES
};
