/**
 * CLAUDE API WRAPPER
 *
 * Handles calls to Claude API for Einstein responses
 */

export async function callClaudeAPI({ model, temperature, max_tokens, system, messages }) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY, // Vite env variable
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        temperature: temperature || 0.8,
        max_tokens: max_tokens || 2000,
        system,
        messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
}

/**
 * Call Claude API via Firebase Cloud Function (recommended for production)
 * This keeps API key server-side
 */
export async function callClaudeViaFunction({ model, temperature, max_tokens, system, messages }) {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        temperature: temperature || 0.8,
        max_tokens: max_tokens || 2000,
        system,
        messages
      })
    });

    if (!response.ok) {
      throw new Error(`Cloud Function error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Claude Cloud Function call failed:', error);
    throw error;
  }
}

export default {
  callClaudeAPI,
  callClaudeViaFunction
};
