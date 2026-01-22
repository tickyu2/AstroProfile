/**
 * OpenAI Provider
 *
 * Standard OpenAI API implementation with streaming support.
 */

import { ProviderArgs, ProviderResult, LLMStreamChunk } from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

/**
 * Get OpenAI API key from environment
 */
function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY ||
              (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY);

  if (!key) {
    throw new Error('OpenAI API key not configured (VITE_OPENAI_API_KEY or OPENAI_API_KEY)');
  }

  return key;
}

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Call OpenAI API
 */
export async function callOpenAI(args: ProviderArgs): Promise<ProviderResult> {
  const apiKey = getApiKey();
  const model = args.model ?? DEFAULT_MODEL;

  const body = {
    model,
    messages: [
      { role: 'system', content: args.system },
      { role: 'user', content: args.prompt }
    ],
    temperature: args.temperature,
    max_tokens: args.maxTokens,
    stream: args.stream ?? false
  };

  // Handle streaming
  if (args.stream && args.onStreamChunk) {
    return callOpenAIStreaming(apiKey, body, args.onStreamChunk);
  }

  // Standard request
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  return {
    text: data.choices?.[0]?.message?.content ?? '',
    tokens: (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0),
    finishReason: data.choices?.[0]?.finish_reason ?? 'unknown',
    raw: data
  };
}

/**
 * Streaming implementation
 */
async function callOpenAIStreaming(
  apiKey: string,
  body: Record<string, unknown>,
  onChunk: (chunk: LLMStreamChunk) => void
): Promise<ProviderResult> {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body reader available');
  }

  const decoder = new TextDecoder();
  let fullText = '';
  let finishReason = 'stream';
  let totalTokens = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onChunk({ textDelta: '', done: true });
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line === 'data: [DONE]') {
          continue;
        }

        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6));
            const delta = json.choices?.[0]?.delta?.content ?? '';

            if (delta) {
              fullText += delta;
              onChunk({ textDelta: delta, done: false });
            }

            if (json.choices?.[0]?.finish_reason) {
              finishReason = json.choices[0].finish_reason;
            }

            if (json.usage) {
              totalTokens = (json.usage.prompt_tokens ?? 0) + (json.usage.completion_tokens ?? 0);
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  // Estimate tokens if not provided (streaming often doesn't include usage)
  if (totalTokens === 0) {
    totalTokens = Math.ceil(fullText.length / 4);
  }

  return {
    text: fullText,
    tokens: totalTokens,
    finishReason
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const openaiProvider = {
  name: 'openai' as const,
  call: callOpenAI,
  defaultModel: DEFAULT_MODEL
};

export default callOpenAI;
