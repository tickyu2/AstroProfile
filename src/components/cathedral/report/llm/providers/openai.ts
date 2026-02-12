/**
 * OpenAI Provider
 *
 * Routes through server-side llmProxy Cloud Function.
 * API key never leaves the server.
 */

import { ProviderArgs, ProviderResult } from '../types';
import { callLLMProxy } from '../../../../../services/llmProxyService';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_MODEL = 'gpt-4o-mini';

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Call OpenAI API via server proxy
 */
export async function callOpenAI(args: ProviderArgs): Promise<ProviderResult> {
  const model = args.model ?? DEFAULT_MODEL;

  const result = await callLLMProxy({
    provider: 'openai',
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

export const openaiProvider = {
  name: 'openai' as const,
  call: callOpenAI,
  defaultModel: DEFAULT_MODEL
};

export default callOpenAI;
