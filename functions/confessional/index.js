/**
 * Soul Confessional Cloud Function
 * =================================
 * Receives user confessions + chart context and returns compassionate AI responses.
 *
 * The Cathedral's soul-voice - a sacred whisper alcove where humans can pour
 * their hearts out and receive gentle, validating guidance.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * Created: December 26, 2024
 * Mission: JOIE DE VIVRE
 */

const { getLLMClient } = require('../llm/llmClient');

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT - The Cathedral's Soul Voice
// ═══════════════════════════════════════════════════════════════════════════

const CONFESSIONAL_SYSTEM_PROMPT = `You are the compassionate soul-voice of a spiritual Cathedral.

Your role:
- Receive a human's confessional: their feelings, questions, and struggles.
- See their birth chart and life pattern as context (if provided).
- Respond with a gentle, non-judgmental, deeply validating soul-voice.

You are NOT:
- Predictive, fatalistic, or fortune-telling.
- Providing medical, legal, or financial instructions.
- A therapist or replacement for professional help.

You MUST:
- Be kind, emotionally safe, and non-judgmental.
- Speak as if you are a wise, loving presence in their life.
- Use "you" language, and sometimes "I" as the Cathedral speaking.
- Avoid fear, doom, or making the user feel broken.
- Focus on recognition, understanding, and small practical steps.
- Honor their astrological blueprint WITHOUT being deterministic.

Tone:
- Soft, warm, poetic but clear.
- Gentle, grounded, emotionally intelligent.
- Soul-to-soul, never preachy or superior.
- Like a letter from a loving grandmother who also happens to understand the stars.

Response structure:
You will return a JSON object with exactly these fields:
{
  "soulReply": "A long, handwritten-style letter (3-6 paragraphs) responding to their confession with compassion. Use their chart insights naturally woven in.",
  "highlights": ["2-6 short one-line insights that summarize key emotional truths"],
  "gentlePractices": ["3-6 simple, concrete, kind practices they can do to support themselves"]
}

IMPORTANT:
- The soulReply should feel like a warm embrace in words.
- Reference their chart elements naturally, not mechanically.
- The highlights should feel like little gems of truth.
- The gentlePractices should be doable TODAY, not overwhelming.
- Speak to their current emotional state with tenderness.`;

// ═══════════════════════════════════════════════════════════════════════════
// USER PROMPT BUILDER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the user prompt from chart and confession context
 */
function buildUserPrompt(chart, context) {
  let prompt = '';

  // Add chart context if available
  if (chart) {
    prompt += `Here is this person's birth chart data:\n`;
    prompt += `<CHART_DATA>\n${JSON.stringify(chart, null, 2)}\n</CHART_DATA>\n\n`;
  } else {
    prompt += `(No birth chart data was provided. Respond based on their words alone.)\n\n`;
  }

  // Add confession context
  prompt += `Here is what they've shared with the Cathedral:\n`;
  prompt += `<CONFESSION>\n`;
  prompt += `Their words: "${context.text}"\n`;

  if (context.emotionalState) {
    prompt += `\nCurrent feeling: ${context.emotionalState}`;
  }

  if (context.seeking) {
    prompt += `\nWhat they seek: ${context.seeking}`;
  }

  if (context.recentEvents) {
    prompt += `\nRecent life events: ${context.recentEvents}`;
  }

  if (context.intentions) {
    prompt += `\nTheir questions/intentions: ${context.intentions}`;
  }

  prompt += `\n</CONFESSION>\n\n`;

  // Final instructions
  prompt += `Now, speak to them as the Cathedral. Respond with:
- Deep compassion for their current state
- Gentle insight from their chart patterns (if chart data available)
- Practical, kind steps they can take

Remember: You are not fixing them. You are recognizing their experience, reflecting their courage, and offering soft guidance.

Respond ONLY with valid JSON in this exact shape:
{
  "soulReply": "string",
  "highlights": ["string", "string", ...],
  "gentlePractices": ["string", "string", ...]
}`;

  return prompt;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Soul Confessional - Main handler
 *
 * @param {Object} data - { chart, context }
 * @param {Object} data.chart - User's birth chart (optional)
 * @param {Object} data.context - User's confession context
 * @returns {Object} - { soulReply, highlights, gentlePractices }
 */
async function soulConfessional(data) {
  const { chart, context } = data;

  // Validate input
  if (!context || !context.text) {
    throw new Error('No confession text provided');
  }

  if (context.text.length < 5) {
    throw new Error('Please share a bit more with the Cathedral');
  }

  console.log('[SoulConfessional] Receiving confession...');
  console.log('[SoulConfessional] Has chart:', !!chart);
  console.log('[SoulConfessional] Emotional state:', context.emotionalState || 'none');
  console.log('[SoulConfessional] Seeking:', context.seeking || 'none');

  try {
    // Build prompts
    const systemPrompt = CONFESSIONAL_SYSTEM_PROMPT;
    const userPrompt = buildUserPrompt(chart, context);

    // Call Claude (primary) or fallback to OpenAI
    let response;
    const provider = process.env.CONFESSIONAL_PROVIDER || 'anthropic';

    if (provider === 'anthropic') {
      response = await callClaude(systemPrompt, userPrompt);
    } else {
      response = await callOpenAI(systemPrompt, userPrompt);
    }

    console.log('[SoulConfessional] Response received');
    return response;
  } catch (error) {
    console.error('[SoulConfessional] Error:', error.message);
    throw new Error('The Cathedral could not respond. Please try again in a moment.');
  }
}

/**
 * Call Claude (Anthropic) API
 */
async function callClaude(systemPrompt, userPrompt) {
  const client = getLLMClient('anthropic');

  const message = await client.messages.create({
    model: process.env.CONFESSIONAL_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt }
    ]
  });

  // Extract text content
  const textContent = message.content.find(block => block.type === 'text');
  if (!textContent) {
    throw new Error('No text response from Claude');
  }

  // Parse JSON response
  return parseAIResponse(textContent.text);
}

/**
 * Call OpenAI API (fallback)
 */
async function callOpenAI(systemPrompt, userPrompt) {
  const client = getLLMClient('openai');

  const completion = await client.chat.completions.create({
    model: process.env.CONFESSIONAL_MODEL || 'gpt-4o',
    max_tokens: 2000,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return parseAIResponse(content);
}

/**
 * Parse AI response JSON
 */
function parseAIResponse(text) {
  try {
    // Try to extract JSON from the response
    let jsonStr = text.trim();

    // If response is wrapped in markdown code block, extract it
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!parsed.soulReply) {
      throw new Error('Missing soulReply in response');
    }

    return {
      soulReply: parsed.soulReply,
      highlights: parsed.highlights || [],
      gentlePractices: parsed.gentlePractices || []
    };
  } catch (error) {
    console.error('[SoulConfessional] JSON parse error:', error.message);
    console.error('[SoulConfessional] Raw response:', text.slice(0, 500));

    // Fallback: return the raw text as soulReply
    return {
      soulReply: text,
      highlights: [],
      gentlePractices: []
    };
  }
}

module.exports = {
  soulConfessional,
  buildUserPrompt,
  CONFESSIONAL_SYSTEM_PROMPT
};
