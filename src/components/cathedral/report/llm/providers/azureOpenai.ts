/**
 * Azure OpenAI Provider
 *
 * Azure-hosted OpenAI API with streaming support.
 */

import { ProviderArgs, ProviderResult, LLMStreamChunk } from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_API_VERSION = '2024-02-15-preview';
const DEFAULT_DEPLOYMENT = 'gpt-4o-mini';

interface AzureConfig {
  endpoint: string;
  apiKey: string;
  deployment: string;
  apiVersion: string;
}

/**
 * Get Azure OpenAI configuration from environment
 */
function getAzureConfig(): AzureConfig {
  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT ||
                   (typeof process !== 'undefined' && process.env?.AZURE_OPENAI_ENDPOINT);

  const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY ||
                 (typeof process !== 'undefined' && process.env?.AZURE_OPENAI_API_KEY);

  const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT ||
                     (typeof process !== 'undefined' && process.env?.AZURE_OPENAI_DEPLOYMENT) ||
                     DEFAULT_DEPLOYMENT;

  const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION ||
                     (typeof process !== 'undefined' && process.env?.AZURE_OPENAI_API_VERSION) ||
                     DEFAULT_API_VERSION;

  if (!endpoint) {
    throw new Error('Azure OpenAI endpoint not configured (VITE_AZURE_OPENAI_ENDPOINT)');
  }

  if (!apiKey) {
    throw new Error('Azure OpenAI API key not configured (VITE_AZURE_OPENAI_API_KEY)');
  }

  return { endpoint, apiKey, deployment, apiVersion };
}

/**
 * Build Azure OpenAI URL
 */
function buildAzureUrl(config: AzureConfig, deployment?: string): string {
  const baseEndpoint = config.endpoint.replace(/\/$/, '');
  const deploymentName = deployment ?? config.deployment;
  return `${baseEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${config.apiVersion}`;
}

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Call Azure OpenAI API
 */
export async function callAzureOpenAI(args: ProviderArgs): Promise<ProviderResult> {
  const config = getAzureConfig();
  const url = buildAzureUrl(config, args.model);

  const body = {
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
    return callAzureOpenAIStreaming(url, config.apiKey, body, args.onStreamChunk);
  }

  // Standard request
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.apiKey
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI API error (${response.status}): ${errorText}`);
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
async function callAzureOpenAIStreaming(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
  onChunk: (chunk: LLMStreamChunk) => void
): Promise<ProviderResult> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI API error (${response.status}): ${errorText}`);
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

export const azureOpenaiProvider = {
  name: 'azure-openai' as const,
  call: callAzureOpenAI,
  defaultModel: DEFAULT_DEPLOYMENT
};

export default callAzureOpenAI;
