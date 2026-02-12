/**
 * Groq Provider
 *
 * Routes through server-side llmProxy Cloud Function.
 * API key never leaves the server.
 */

import { ProviderArgs, ProviderResult } from '../types';
import { callLLMProxy } from '../../../../../services/llmProxyService';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_MODEL = 'llama-3.1-70b-versatile';

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Call Groq API via server proxy
 */
export async function callGroq(args: ProviderArgs): Promise<ProviderResult> {
  const model = args.model ?? DEFAULT_MODEL;

  const result = await callLLMProxy({
    provider: 'groq',
    model,
    system: args.system,
    messages: [{ role: 'user', content: args.prompt }],
    temperature: args.temperature,
    max_tokens: args.maxTokens
  });

  return {
    text: result.text,
    tokens: result.tokens || 0,
    finishReason: result.finishReason || 'stop'
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
