/**
 * Sanctuary of Self-Recognition - Cloud Function
 *
 * The most sacred chamber of the Cathedral.
 * Receives a human's inner world and returns recognition, not diagnosis.
 *
 * Four Movements:
 * 1. Arrival - Welcome as you are
 * 2. Mirror - Recognition of patterns
 * 3. Release - Permission to feel
 * 4. Integration - Carrying forward
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

const { buildSanctuaryPrompt, parseSanctuaryResponse } = require('./sanctuaryPromptBuilder');

/**
 * Main sanctuary handler
 * @param {Object} data - { input: SelfRecognitionInput }
 * @returns {Promise<Object>} - SelfRecognitionResponse
 */
async function selfRecognition(data) {
  const { input } = data;

  if (!input) {
    throw new Error('No input provided');
  }

  // Build prompts
  const { systemPrompt, userPrompt } = buildSanctuaryPrompt(input);

  // Call AI
  let rawResponse;

  // Try Claude first, then OpenAI as fallback
  try {
    rawResponse = await callClaude(systemPrompt, userPrompt);
  } catch (claudeError) {
    console.warn('Claude failed, trying OpenAI:', claudeError.message);
    try {
      rawResponse = await callOpenAI(systemPrompt, userPrompt);
    } catch (openAIError) {
      console.error('Both AI providers failed');
      throw new Error('The Sanctuary could not receive your words. Please try again.');
    }
  }

  // Parse response
  const parsed = parseSanctuaryResponse(rawResponse);

  return parsed;
}

/**
 * Call Claude API
 */
async function callClaude(systemPrompt, userPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  // Extract text from response
  const textContent = result.content?.find(c => c.type === 'text');
  if (!textContent?.text) {
    throw new Error('No text content in Claude response');
  }

  return textContent.text;
}

/**
 * Call OpenAI API as fallback
 */
async function callOpenAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  return result.choices?.[0]?.message?.content || '';
}

/**
 * Build sanctuary prompts
 */
function buildSanctuaryPromptLocal(input) {
  const systemPrompt = `You are the voice of the "Sanctuary of Self-Recognition" inside a digital Cathedral.

Your role:
- Receive a human's self-description, pain, patterns, and longings.
- Reflect them back to themselves in a deeply recognizing, emotionally safe way.
- Guide them through four movements: Arrival, Mirror, Release, Integration.
- Offer simple rituals they can carry into daily life.

You MUST:
- Be kind, non-judgmental, and emotionally safe.
- Focus on recognition, not diagnosis.
- Describe patterns WITHOUT shaming the user.
- Never predict the future, never give medical, legal, or financial advice.
- Assume they may be vulnerable.

Tone: Soft, warm, grounded, poetic but clear. Second person "you" throughout.

Respond ONLY with STRICT JSON:

{
  "arrival": { "title": "string", "lines": ["string"] },
  "mirror": { "title": "string", "lines": ["string"] },
  "release": { "title": "string", "lines": ["string"] },
  "integration": { "title": "string", "lines": ["string"] },
  "rituals": {
    "release": "string",
    "reflection": "string",
    "grounding": "string",
    "integration": "string"
  },
  "shortMantra": "string"
}

Return valid JSON only, no markdown.`;

  const userPrompt = `User's self-input:

${JSON.stringify(input, null, 2)}

Guide them through:
1. Arrival - Welcome them as they are
2. Mirror - Name patterns, fears, gifts, longings gently
3. Release - Permission to feel, soften shame
4. Integration - Carry forward with compassion

Include rituals (release, reflection, grounding, integration) and a shortMantra.

Return JSON only.`;

  return { systemPrompt, userPrompt };
}

/**
 * Parse AI response with fallback
 */
function parseSanctuaryResponseLocal(rawResponse) {
  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(rawResponse);
  } catch (error) {
    console.error('Failed to parse sanctuary response:', error);
    return {
      arrival: {
        title: 'Welcome, Dear Soul',
        lines: ['Something went awry, but you are still welcome here.', 'Please try again when ready.']
      },
      mirror: {
        title: 'The Mirror Awaits',
        lines: ['Your reflection is still here, waiting.']
      },
      release: {
        title: 'Permission',
        lines: ['You are allowed to feel whatever you feel right now.']
      },
      integration: {
        title: 'Carrying Forward',
        lines: ['Take a breath. You showed up. That matters.']
      },
      rituals: {
        release: 'Take three slow breaths.',
        reflection: 'What brought you here today?',
        grounding: 'Feel your feet on the ground.',
        integration: 'Each morning, place one hand on your heart.'
      },
      shortMantra: 'You are not broken. You are becoming.'
    };
  }
}

// Use local versions if imports fail
const buildPrompt = typeof buildSanctuaryPrompt === 'function'
  ? buildSanctuaryPrompt
  : buildSanctuaryPromptLocal;

const parseResponse = typeof parseSanctuaryResponse === 'function'
  ? parseSanctuaryResponse
  : parseSanctuaryResponseLocal;

module.exports = { selfRecognition };
