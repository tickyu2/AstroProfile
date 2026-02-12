/**
 * LLM Proxy Service
 *
 * All frontend LLM calls go through the server-side llmProxy Cloud Function.
 * API keys never leave the server.
 *
 * GENESIS AstroProfile — Security Hardening
 * February 2026
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

const llmProxyFn = httpsCallable(functions, 'llmProxy', { timeout: 120000 });

/**
 * Call an LLM provider through the server-side proxy.
 *
 * @param {Object} params
 * @param {'anthropic'|'openai'|'groq'} params.provider  — Which LLM provider
 * @param {string}  [params.model]       — Model ID (provider-specific)
 * @param {string}  [params.system]      — System prompt
 * @param {Array}   params.messages      — [{role, content}]
 * @param {number}  [params.temperature] — 0-1
 * @param {number}  [params.max_tokens]  — Max output tokens (capped at 16 000 server-side)
 * @returns {Promise<{text: string, tokens: number, finishReason: string}>}
 */
export async function callLLMProxy({ provider, model, system, messages, temperature, max_tokens }) {
  const result = await llmProxyFn({ provider, model, system, messages, temperature, max_tokens });
  return result.data;
}

/**
 * Convenience: call Anthropic Claude through proxy
 */
export async function callClaudeProxy({ model, system, messages, temperature, max_tokens }) {
  return callLLMProxy({ provider: 'anthropic', model, system, messages, temperature, max_tokens });
}

export default callLLMProxy;
