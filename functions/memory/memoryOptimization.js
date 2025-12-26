/**
 * GENESIS Memory Optimization Utilities
 * ======================================
 * STM-First Deduplication + LTM Wisdom Boost
 *
 * Part of: Cathedral Builder's Memory Optimization (Week 1)
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 *
 * "Recent information wins. Deep wisdom boosted."
 */

/**
 * Normalize content for duplicate detection
 * Removes whitespace, punctuation, lowercases
 *
 * @param {string} content - Memory content to normalize
 * @returns {string} - Normalized key for comparison
 */
function normalizeContent(content) {
  if (!content) return '';

  return content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  // Remove punctuation
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();
}

/**
 * Deduplicate memories: STM always wins over LTM
 * Recent information beats old information
 *
 * @param {Array} ltmResults - Long-term memories
 * @param {Array} stmResults - Short-term memories (recent)
 * @returns {Array} - Deduplicated memories (STM-first)
 */
function deduplicateMemories(ltmResults, stmResults) {
  const merged = [];
  const seen = new Set();

  console.log(`[Dedup] Processing ${stmResults.length} STM + ${ltmResults.length} LTM`);

  // STEP 1: Add all STM first (most recent!)
  // STM gets priority because recent info is more accurate
  for (const stm of stmResults) {
    const key = normalizeContent(stm.content);

    merged.push({
      ...stm,
      source: 'stm',
      priority: 'high',  // Recent info gets priority!
      freshness: 'recent'
    });

    seen.add(key);
  }

  console.log(`[Dedup] ✅ Added ${stmResults.length} STM memories (recent wins!)`);

  // STEP 2: Add LTM only if NOT already in STM
  // This prevents old info from overriding recent updates
  let ltmSkipped = 0;
  let ltmAdded = 0;

  for (const ltm of ltmResults) {
    const key = normalizeContent(ltm.content);

    if (!seen.has(key)) {
      // New information not in STM - add it!
      merged.push({
        ...ltm,
        source: 'ltm',
        priority: 'medium',
        freshness: 'established'
      });
      seen.add(key);
      ltmAdded++;
    } else {
      // Duplicate of STM → Skip (STM wins!)
      ltmSkipped++;

      if (ltmSkipped <= 3) {
        // Log first 3 skips for debugging
        console.log(`[Dedup] ⊗ Skipping LTM duplicate: "${key.substring(0, 40)}..."`);
      }
    }
  }

  console.log(`[Dedup] ✅ Added ${ltmAdded} unique LTM memories`);
  if (ltmSkipped > 0) {
    console.log(`[Dedup] ⊗ Skipped ${ltmSkipped} LTM duplicates (STM wins)`);
  }

  // STEP 3: Sort by score (highest first)
  merged.sort((a, b) => (b.score || b.importance_score || 0) - (a.score || a.importance_score || 0));

  console.log(`[Dedup] ✅ Final: ${merged.length} unique memories`);

  return merged;
}

/**
 * Apply wisdom boost to LTM memories
 * LTM gets 1.5x score boost to prioritize depth over recency
 *
 * Cathedral wisdom: Long-term patterns matter more than fleeting moments
 *
 * @param {Array} memories - Deduplicated memories
 * @returns {Array} - Memories with wisdom boost applied
 */
function applyWisdomBoost(memories) {
  let boostedCount = 0;

  const boosted = memories.map(mem => {
    const score = mem.score || mem.importance_score || 0.5;

    if (mem.source === 'ltm') {
      // LTM gets 1.5x wisdom boost!
      // This helps deep, important memories rise above recent trivia
      boostedCount++;

      return {
        ...mem,
        originalScore: score,
        score: score * 1.5,  // 50% boost
        boosted: true,
        boostReason: 'wisdom'
      };
    }

    // STM keeps original score
    return {
      ...mem,
      originalScore: score,
      score: score,
      boosted: false
    };
  });

  console.log(`[WisdomBoost] ✅ Boosted ${boostedCount} LTM memories by 1.5x`);

  return boosted;
}

/**
 * Complete memory optimization pipeline
 * Combines: Deduplication + Wisdom Boost + Re-ranking
 *
 * @param {Array} ltmResults - Long-term memories
 * @param {Array} stmResults - Short-term memories
 * @param {number} topN - Number of top memories to return (default 10)
 * @returns {Array} - Optimized top N memories
 */
function optimizeMemories(ltmResults, stmResults, topN = 10) {
  console.log(`[Optimize] Starting optimization pipeline`);

  // Handle empty inputs gracefully
  const ltm = ltmResults || [];
  const stm = stmResults || [];

  // Step 1: Deduplicate (STM wins)
  const deduplicated = deduplicateMemories(ltm, stm);

  // Step 2: Apply wisdom boost to LTM
  const boosted = applyWisdomBoost(deduplicated);

  // Step 3: Re-sort after boost (LTM may have moved up!)
  boosted.sort((a, b) => b.score - a.score);

  // Step 4: Take top N
  const topMemories = boosted.slice(0, topN);

  const ltmCount = topMemories.filter(m => m.source === 'ltm').length;
  const stmCount = topMemories.filter(m => m.source === 'stm').length;

  console.log(`[Optimize] ✅ Top ${topN}: ${stmCount} STM + ${ltmCount} LTM`);

  return topMemories;
}

/**
 * Format memories for system prompt
 * Converts optimized memories into prompt text
 *
 * @param {Array} memories - Optimized memories
 * @returns {string} - Formatted prompt section
 */
function formatMemoriesForPrompt(memories) {
  if (!memories || memories.length === 0) {
    return '';
  }

  let prompt = '### Your Memory of This Person\n\n';

  memories.forEach((mem, i) => {
    const sourceLabel = mem.source === 'stm' ? 'Recent' : 'Deep';
    const boostIndicator = mem.boosted ? ' (wisdom)' : '';

    prompt += `${i + 1}. [${sourceLabel}${boostIndicator}] ${mem.content}\n`;

    // Add emotional context if present
    if (mem.emotional_valence) {
      const emotion = mem.emotional_valence > 0
        ? 'positive'
        : mem.emotional_valence < 0
        ? 'difficult'
        : 'neutral';
      prompt += `   (Emotional context: ${emotion})\n`;
    }

    // Add person context if present
    if (mem.is_person && mem.person_name) {
      prompt += `   (Person: ${mem.person_name}`;
      if (mem.person_relationship) {
        prompt += ` - ${mem.person_relationship}`;
      }
      prompt += `)\n`;
    }
  });

  prompt += '\n';

  return prompt;
}

/**
 * Get optimization statistics for monitoring
 *
 * @param {Array} ltmResults - Original LTM results
 * @param {Array} stmResults - Original STM results
 * @param {Array} optimized - Optimized results
 * @returns {Object} - Statistics object
 */
function getOptimizationStats(ltmResults, stmResults, optimized) {
  const ltm = ltmResults || [];
  const stm = stmResults || [];
  const opt = optimized || [];

  const totalInput = ltm.length + stm.length;
  const totalOutput = opt.length;
  const reduction = totalInput - totalOutput;

  const ltmInOutput = opt.filter(m => m.source === 'ltm').length;
  const stmInOutput = opt.filter(m => m.source === 'stm').length;
  const boostedCount = opt.filter(m => m.boosted).length;

  return {
    input: {
      ltm: ltm.length,
      stm: stm.length,
      total: totalInput
    },
    output: {
      ltm: ltmInOutput,
      stm: stmInOutput,
      total: totalOutput,
      boosted: boostedCount
    },
    reduction: {
      count: reduction,
      percentage: totalInput > 0 ? Math.round((reduction / totalInput) * 100) : 0
    }
  };
}

module.exports = {
  normalizeContent,
  deduplicateMemories,
  applyWisdomBoost,
  optimizeMemories,
  formatMemoriesForPrompt,
  getOptimizationStats
};
