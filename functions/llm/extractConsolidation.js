/**
 * LLM Consolidation Extraction
 * ============================
 * Safe, constrained LLM extraction for memory consolidation.
 * Enforces provenance, forbids invention, returns structured JSON.
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 */

const { getLLMClient, MODEL_CONFIG } = require('./llmClient');

// ============================================================================
// SYSTEM PROMPT (Tightly Constrained)
// ============================================================================

const CONSOLIDATION_SYSTEM_PROMPT = `You are a memory consolidation assistant. You will analyze the provided short-term memory evidence and extract concise, factual consolidated memories and Luna-observed patterns.

Rules:
1. Return valid JSON only. Do not include any explanation or extra text.
2. Do NOT invent facts. Every consolidated memory must include the list of source IDs (sourceIds) that support it.
3. For each consolidated memory include: timeframe (approx), consolidatedEvent (short title), emotionalEssence (1-2 sentences), coreThemes (array of short strings), sourceIds (array of STM ids), confidence (0.0-1.0).
4. For Luna patterns include: patternName, manifestations (short), triggers (array), recommendedResponse (short), confidence (0.0-1.0).
5. Keep consolidatedEvent to 10-12 words. Keep emotionalEssence to 1-2 sentences.
6. If you are not confident, set confidence low rather than inventing.
7. Output JSON schema exactly as requested.

Output JSON schema:
{
  "consolidatedMemories": [
    {
      "timeframe": "string",
      "consolidatedEvent": "string",
      "emotionalEssence": "string",
      "coreThemes": ["string"],
      "sourceIds": ["string"],
      "confidence": 0.0
    }
  ],
  "lunaPatterns": [
    {
      "patternName": "string",
      "manifestations": "string",
      "triggers": ["string"],
      "recommendedResponse": "string",
      "confidence": 0.0
    }
  ]
}`;

// ============================================================================
// EXTRACTION FUNCTION
// ============================================================================

/**
 * Extract consolidated memories using LLM
 *
 * @param {Object} params - Extraction parameters
 * @param {string} params.userId - User ID
 * @param {Array} params.stmBatch - STM entries to consolidate
 * @param {string} params.model - LLM model to use
 * @param {number} params.maxRetries - Max retry attempts
 * @returns {Promise<Object>} - { consolidatedMemories: [...], lunaPatterns: [...] }
 */
async function extractConsolidationWithLLM({
  userId,
  stmBatch,
  model = MODEL_CONFIG.consolidation.model,
  maxRetries = 2
}) {
  const client = getLLMClient('openai');

  // Build compact evidence list for the LLM
  const evidence = stmBatch.map(s => ({
    id: s.id,
    text: (s.content || '').slice(0, 1200), // Truncate to keep prompt size reasonable
    created_at: s.created_at,
    mention_count: s.mention_count || 1,
    emotional_weight: s.emotional_weight || 0.5
  }));

  const userPrompt = `User: ${userId}\nEvidence: ${JSON.stringify(evidence)}`;

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: CONSOLIDATION_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: MODEL_CONFIG.consolidation.maxTokens,
        temperature: MODEL_CONFIG.consolidation.temperature
      });

      const text = response.choices?.[0]?.message?.content ?? '';

      // Extract JSON block robustly
      const jsonText = extractJsonFromText(text);
      if (!jsonText) {
        throw new Error('No JSON found in LLM response');
      }

      const parsed = JSON.parse(jsonText);

      // Validate schema
      if (!Array.isArray(parsed.consolidatedMemories) || !Array.isArray(parsed.lunaPatterns)) {
        throw new Error('Invalid schema returned');
      }

      // Normalize and clamp confidence values
      parsed.consolidatedMemories = parsed.consolidatedMemories.map(m => ({
        ...m,
        confidence: clampNumber(m.confidence, 0, 1),
        sourceIds: Array.isArray(m.sourceIds) ? m.sourceIds : []
      }));

      parsed.lunaPatterns = parsed.lunaPatterns.map(p => ({
        ...p,
        confidence: clampNumber(p.confidence, 0, 1)
      }));

      return parsed;

    } catch (err) {
      attempt++;
      console.warn(`[extractConsolidationWithLLM] Attempt ${attempt} failed: ${err.message}`);

      if (attempt > maxRetries) {
        console.error('[extractConsolidationWithLLM] All retries exhausted');
        throw err;
      }

      await new Promise(r => setTimeout(r, 300 * attempt));
    }
  }

  // Should not reach here, but return empty result as fallback
  return { consolidatedMemories: [], lunaPatterns: [] };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract JSON from potentially messy LLM output
 * Finds first { and last } and attempts to parse
 *
 * @param {string} text - LLM response text
 * @returns {string|null} - Extracted JSON string or null
 */
function extractJsonFromText(text) {
  if (!text) return null;

  // Try to find JSON block
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');

  if (first === -1 || last === -1 || last <= first) {
    return null;
  }

  return text.slice(first, last + 1);
}

/**
 * Clamp a number to a range
 *
 * @param {*} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
function clampNumber(value, min, max) {
  const num = Number(value);
  if (Number.isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

/**
 * Validate that sourceIds exist in the original STM batch
 *
 * @param {string[]} sourceIds - Source IDs from LLM
 * @param {Array} stmBatch - Original STM entries
 * @returns {string[]} - Valid source IDs that exist in batch
 */
function validateSourceIds(sourceIds, stmBatch) {
  if (!Array.isArray(sourceIds)) return [];

  const validIds = new Set(stmBatch.map(s => s.id));
  return sourceIds.filter(id => validIds.has(id));
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  extractConsolidationWithLLM,
  extractJsonFromText,
  clampNumber,
  validateSourceIds,
  CONSOLIDATION_SYSTEM_PROMPT
};
