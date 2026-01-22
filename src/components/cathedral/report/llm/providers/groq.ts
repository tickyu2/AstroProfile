/**
 * Groq Provider
 *
 * Groq API for fast LLaMA-3 inference with streaming support.
 */

import { ProviderArgs, ProviderResult, LLMStreamChunk } from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.1-70b-versatile';

/**
 * Get Groq API key from environment
 */
function getApiKey(): string {
  const key = import.meta.env.VITE_GROQ_API_KEY ||
              (typeof process !== 'undefined' && process.env?.GROQ_API_KEY);

  if (!key) {
    throw new Error('Groq API key not configured (VITE_GROQ_API_KEY or GROQ_API_KEY)');
  }

  return key;
}

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Call Groq API
 */
export async function callGroq(args: ProviderArgs): Promise<ProviderResult> {
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
    return callGroqStreaming(apiKey, body, args.onStreamChunk);
  }

  // Standard request
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
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
async function callGroqStreaming(
  apiKey: string,
  body: Record<string, unknown>,
  onChunk: (chunk: LLMStreamChunk) => void
): Promise<ProviderResult> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
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

            // Groq provides usage in x_groq field
            if (json.x_groq?.usage) {
              totalTokens = (json.x_groq.usage.prompt_tokens ?? 0) +
                           (json.x_groq.usage.completion_tokens ?? 0);
            }

            if (json.usage) {
              totalTokens = (json.usage.prompt_tokens ?? 0) +
                           (json.usage.completion_tokens ?? 0);
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

  // Estimate tokens if not provided
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

export const groqProvider = {
  name: 'groq' as const,
  call: callGroq,
  defaultModel: DEFAULT_MODEL
};

export default callGroq;
