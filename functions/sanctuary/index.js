/**
 * Sanctuary of Self-Recognition - Cloud Function
 *
 * The most sacred chamber of the Cathedral.
 * Receives a human's inner world and returns recognition, not diagnosis.
 *
 * NOW SUPPORTS TWO MODES:
 * 1. Standard Mode - Basic input with types and user words
 * 2. Deep Soul Mode - Full psychological architecture for profound recognition
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

const {
  buildSanctuaryPrompt,
  buildDeepSanctuaryPrompt,
  parseSanctuaryResponse
} = require('./sanctuaryPromptBuilder');

/**
 * Main sanctuary handler
 * @param {Object} data - { input: SelfRecognitionInput, soulNarrative?: string, deepMode?: boolean }
 * @returns {Promise<Object>} - SelfRecognitionResponse
 */
async function selfRecognition(data) {
  const { input, soulNarrative, deepMode = false } = data;

  if (!input && !soulNarrative) {
    throw new Error('No input provided');
  }

  // Build prompts - use deep mode if soul narrative is provided
  let systemPrompt, userPrompt;

  if (deepMode && soulNarrative) {
    console.log('🔮 [Sanctuary] Using DEEP SOUL RECOGNITION mode');
    const prompts = buildDeepSanctuaryPrompt(soulNarrative, input);
    systemPrompt = prompts.systemPrompt;
    userPrompt = prompts.userPrompt;
  } else {
    console.log('📝 [Sanctuary] Using standard recognition mode');
    const prompts = buildSanctuaryPrompt(input);
    systemPrompt = prompts.systemPrompt;
    userPrompt = prompts.userPrompt;
  }

  // Call AI
  let rawResponse;

  // Try Claude first, then OpenAI as fallback
  try {
    // Use more tokens for deep mode
    const maxTokens = deepMode ? 3500 : 2000;
    rawResponse = await callClaude(systemPrompt, userPrompt, maxTokens);
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

  // Add mode indicator
  parsed._mode = deepMode ? 'deep' : 'standard';

  return parsed;
}

/**
 * Call Claude API
 */
async function callClaude(systemPrompt, userPrompt, maxTokens = 2000) {
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
      max_tokens: maxTokens,
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
      max_tokens: 3000,
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

module.exports = { selfRecognition };
