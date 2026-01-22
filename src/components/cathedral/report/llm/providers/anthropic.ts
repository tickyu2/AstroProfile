/**
 * Anthropic Claude Provider
 *
 * Anthropic Claude API with streaming support.
 */

import { ProviderArgs, ProviderResult, LLMStreamChunk } from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';
const API_VERSION = '2023-06-01';

/**
 * Get Anthropic API key from environment
 */
function getApiKey(): string {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY ||
              (typeof process !== 'undefined' && process.env?.ANTHROPIC_API_KEY);

  if (!key) {
    throw new Error('Anthropic API key not configured (VITE_ANTHROPIC_API_KEY or ANTHROPIC_API_KEY)');
  }

  return key;
}

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Call Anthropic API
 */
export async function callAnthropic(args: ProviderArgs): Promise<ProviderResult> {
  const apiKey = getApiKey();
  const model = args.model ?? DEFAULT_MODEL;

  const body = {
    model,
    max_tokens: args.maxTokens,
    system: args.system,
    messages: [
      { role: 'user', content: args.prompt }
    ],
    stream: args.stream ?? false
  };

  // Note: Anthropic doesn't support temperature in the same way
  // We map it but it behaves differently
  if (args.temperature !== undefined) {
    Object.assign(body, { temperature: args.temperature });
  }

  // Handle streaming
  if (args.stream && args.onStreamChunk) {
    return callAnthropicStreaming(apiKey, body, args.onStreamChunk);
  }

  // Standard request
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': API_VERSION
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Extract text from content blocks
  const text = data.content
    ?.filter((block: { type: string }) => block.type === 'text')
    .map((block: { text: string }) => block.text)
    .join('') ?? '';

  return {
    text,
    tokens: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
    finishReason: data.stop_reason ?? 'unknown',
    raw: data
  };
}

/**
 * Streaming implementation
 */
async function callAnthropicStreaming(
  apiKey: string,
  body: Record<string, unknown>,
  onChunk: (chunk: LLMStreamChunk) => void
): Promise<ProviderResult> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': API_VERSION
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body reader available');
  }

  const decoder = new TextDecoder();
  let fullText = '';
  let finishReason = 'stream';
  let inputTokens = 0;
  let outputTokens = 0;

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
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6));

            // Handle different event types
            switch (json.type) {
              case 'message_start':
                if (json.message?.usage) {
                  inputTokens = json.message.usage.input_tokens ?? 0;
                }
                break;

              case 'content_block_delta':
                if (json.delta?.type === 'text_delta' && json.delta?.text) {
                  const delta = json.delta.text;
                  fullText += delta;
                  onChunk({ textDelta: delta, done: false });
                }
                break;

              case 'message_delta':
                if (json.delta?.stop_reason) {
                  finishReason = json.delta.stop_reason;
                }
                if (json.usage?.output_tokens) {
                  outputTokens = json.usage.output_tokens;
                }
                break;

              case 'message_stop':
                // Stream complete
                break;
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
  const totalTokens = inputTokens + outputTokens;
  const estimatedTokens = totalTokens > 0 ? totalTokens : Math.ceil(fullText.length / 4);

  return {
    text: fullText,
    tokens: estimatedTokens,
    finishReason
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const anthropicProvider = {
  name: 'anthropic' as const,
  call: callAnthropic,
  defaultModel: DEFAULT_MODEL
};

export default callAnthropic;
