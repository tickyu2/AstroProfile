/**
 * GENESIS Consolidation Engine
 * ============================
 * Luna's "Sleep Cycle" - Nightly consolidation of memories
 *
 * Like human sleep, this process:
 * 1. Reviews short-term memories from the day
 * 2. Extracts patterns and wisdom
 * 3. Prunes redundant details
 * 4. Transfers consolidated insights to long-term memory
 * 5. Updates Luna's understanding of each user
 *
 * Created: December 20, 2025
 * Mission: JOIE DE VIVRE
 */

const pgClient = require('./pgClient');
const Anthropic = require('@anthropic-ai/sdk');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONSOLIDATION_CONFIG = {
  // Minimum STM entries before consolidation triggers
  minEntriesForConsolidation: 3,

  // Maximum entries to process per user per run
  maxEntriesPerUser: 50,

  // Claude model for analysis
  claudeModel: 'claude-sonnet-4-20250514',

  // Similarity threshold for finding related LTM entries
  ltmSimilarityThreshold: 0.85,

  // Importance threshold for creating new LTM
  importanceThresholdForLTM: 0.4,

  // How much to boost importance when reinforcing
  reinforcementBoost: 0.05,

  // Token limits
  maxTokensPerAnalysis: 2000
};

// ============================================================================
// CLAUDE ANALYSIS PROMPTS
// ============================================================================

const CONSOLIDATION_PROMPTS = {

  // Analyze user's STM entries to extract wisdom
  userConsolidation: `You are Luna's memory consolidation system. Analyze these recent memories about a user and extract lasting insights.

RECENT MEMORIES (Short-Term):
{memories}

EXISTING LONG-TERM KNOWLEDGE (if any):
{existingLTM}

Your task:
1. Identify patterns across these memories
2. Extract facts that should be remembered long-term
3. Note any emotional patterns or recurring themes
4. Identify people mentioned and their relationships
5. Determine what's new vs. what reinforces existing knowledge

Respond in JSON format:
{
  "newInsights": [
    {
      "content": "The consolidated insight or fact",
      "type": "core_belief|identity|relationship|pattern|wisdom|milestone",
      "importance": 0.0-1.0,
      "isPerson": true/false,
      "personName": "if isPerson",
      "personRelationship": "if isPerson",
      "constitutionalElement": "Wood|Fire|Earth|Metal|Water|null"
    }
  ],
  "reinforcedInsights": [
    {
      "existingId": "uuid of existing LTM to reinforce",
      "reason": "why this is reinforced"
    }
  ],
  "pruneSuggestions": [
    {
      "stmId": "uuid of STM that's now redundant",
      "reason": "why it can be pruned"
    }
  ],
  "overallPattern": "A sentence describing the overall theme of today's memories"
}`,

  // Analyze Luna's own observations
  partnerConsolidation: `You are Luna's self-reflection system. Analyze your recent observations about a user to deepen your understanding.

YOUR RECENT OBSERVATIONS (Short-Term):
{observations}

YOUR EXISTING UNDERSTANDING (Long-Term):
{existingLTM}

Reflect on:
1. What approaches worked well with this user?
2. What approaches didn't work?
3. What new patterns did you notice about them?
4. How should you adjust your communication style?
5. What topics seem sensitive vs. safe?
6. How has the trust level evolved?

Respond in JSON format:
{
  "newInsights": [
    {
      "insight": "What you learned about this user",
      "type": "pattern|trigger|boundary|preference|breakthrough|relationship_milestone",
      "confidence": 0.0-1.0,
      "effectiveApproaches": {"approach": weight},
      "sensitiveTopics": {"topic": sensitivity_level},
      "trustDelta": -1.0 to 1.0,
      "intimacyDelta": -1.0 to 1.0
    }
  ],
  "validatedInsights": [
    {
      "existingId": "uuid of existing insight that proved true",
      "validation": "how it was validated"
    }
  ],
  "invalidatedInsights": [
    {
      "existingId": "uuid of existing insight that proved wrong",
      "invalidation": "what actually happened"
    }
  ],
  "relationshipEvolution": {
    "currentStage": "initial|building|deepening|established|intimate",
    "trustLevel": 0.0-1.0,
    "intimacyLevel": 0.0-1.0,
    "summary": "How the relationship evolved today"
  }
}`
};

// ============================================================================
// CONSOLIDATION ENGINE
// ============================================================================

let anthropic = null;

function getAnthropicClient() {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropic;
}

/**
 * Main consolidation function - processes all users
 * Called by Cloud Scheduler nightly at 11 PM PST
 */
async function runNightlyConsolidation() {
  console.log('[Consolidation] 🌙 Starting nightly consolidation (Luna\'s sleep cycle)...');

  const runId = await pgClient.startConsolidationRun('nightly');

  const stats = {
    userStmProcessed: 0,
    userStmConsolidated: 0,
    userStmPruned: 0,
    partnerStmProcessed: 0,
    partnerStmConsolidated: 0,
    partnerStmPruned: 0,
    claudeTokensUsed: 0,
    embeddingCalls: 0,
    errorCount: 0,
    errorMessage: null
  };

  try {
    // Get all unique user/profile combinations with unconsolidated STM
    const usersToProcess = await getActiveUsers();
    console.log(`[Consolidation] Found ${usersToProcess.length} users to process`);

    for (const { userId, profileId } of usersToProcess) {
      try {
        // Consolidate user's memories
        const userResult = await consolidateUserMemories(userId, profileId);
        stats.userStmProcessed += userResult.processed;
        stats.userStmConsolidated += userResult.consolidated;
        stats.userStmPruned += userResult.pruned;
        stats.claudeTokensUsed += userResult.tokensUsed;
        stats.embeddingCalls += userResult.embeddingCalls;

        // Consolidate Luna's observations
        const partnerResult = await consolidatePartnerObservations(userId, profileId);
        stats.partnerStmProcessed += partnerResult.processed;
        stats.partnerStmConsolidated += partnerResult.consolidated;
        stats.partnerStmPruned += partnerResult.pruned;
        stats.claudeTokensUsed += partnerResult.tokensUsed;
        stats.embeddingCalls += partnerResult.embeddingCalls;

      } catch (error) {
        console.error(`[Consolidation] Error processing ${userId}/${profileId}:`, error);
        stats.errorCount++;
        if (!stats.errorMessage) {
          stats.errorMessage = error.message;
        }
      }
    }

    // Cleanup expired entries
    const cleanup = await pgClient.cleanupExpiredSTM();
    console.log(`[Consolidation] Cleaned up ${cleanup.user_stm_deleted} user STM, ${cleanup.partner_stm_deleted} partner STM`);

    console.log('[Consolidation] ✨ Nightly consolidation complete!', stats);

  } catch (error) {
    console.error('[Consolidation] Fatal error:', error);
    stats.errorMessage = error.message;
    stats.errorCount++;
  }

  // Record completion
  await pgClient.completeConsolidationRun(runId, stats);

  return stats;
}

/**
 * Get all active users with unconsolidated STM entries
 */
async function getActiveUsers() {
  const result = await pgClient.query(`
    SELECT DISTINCT user_id, profile_id
    FROM (
      SELECT user_id, profile_id FROM user_stm WHERE NOT consolidated
      UNION
      SELECT user_id, profile_id FROM partner_stm WHERE NOT consolidated
    ) combined
  `);

  return result.rows.map(r => ({
    userId: r.user_id,
    profileId: r.profile_id
  }));
}

/**
 * Consolidate a user's short-term memories into long-term
 */
async function consolidateUserMemories(userId, profileId) {
  console.log(`[Consolidation] Processing user memories for ${profileId}`);

  const result = {
    processed: 0,
    consolidated: 0,
    pruned: 0,
    tokensUsed: 0,
    embeddingCalls: 0
  };

  // Get unconsolidated STM entries
  const stmEntries = await pgClient.getUnconsolidatedUserSTM(
    userId,
    profileId,
    CONSOLIDATION_CONFIG.maxEntriesPerUser
  );

  if (stmEntries.length < CONSOLIDATION_CONFIG.minEntriesForConsolidation) {
    console.log(`[Consolidation] Not enough entries (${stmEntries.length}) for ${profileId}, skipping`);
    return result;
  }

  result.processed = stmEntries.length;

  // Get existing LTM for context
  const existingLTM = await pgClient.query(`
    SELECT id, content, content_type, importance_score, is_person, person_name
    FROM user_ltm
    WHERE user_id = $1 AND profile_id = $2
    ORDER BY importance_score DESC
    LIMIT 20
  `, [userId, profileId]);

  // Format memories for Claude
  const memoriesText = stmEntries.map((m, i) => {
    return `[${i + 1}] (${m.content_type}, importance: ${m.importance_score})
Content: ${m.content}
Emotional: valence=${m.emotional_valence}, intensity=${m.emotional_intensity}
Constitutional: ${m.constitutional_element || 'unknown'} element, ${m.constitutional_pillar || 'unknown'} pillar
ID: ${m.id}`;
  }).join('\n\n');

  const existingLTMText = existingLTM.rows.length > 0
    ? existingLTM.rows.map(l => {
      return `[${l.content_type}${l.is_person ? ` - ${l.person_name}` : ''}] ${l.content}
ID: ${l.id}`;
    }).join('\n')
    : 'No existing long-term memories yet.';

  // Call Claude for analysis
  const prompt = CONSOLIDATION_PROMPTS.userConsolidation
    .replace('{memories}', memoriesText)
    .replace('{existingLTM}', existingLTMText);

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: CONSOLIDATION_CONFIG.claudeModel,
      max_tokens: CONSOLIDATION_CONFIG.maxTokensPerAnalysis,
      messages: [{ role: 'user', content: prompt }]
    });

    result.tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    // Parse Claude's response
    const analysisText = response.content[0].text;
    const analysis = JSON.parse(analysisText);

    // Store new insights in LTM
    const consolidatedStmIds = [];

    for (const insight of analysis.newInsights || []) {
      if (insight.importance >= CONSOLIDATION_CONFIG.importanceThresholdForLTM) {
        const ltmEntry = await pgClient.storeUserLTM({
          userId,
          profileId,
          content: insight.content,
          contentType: insight.type,
          sourceStmIds: stmEntries.map(s => s.id),
          importanceScore: insight.importance,
          constitutionalElement: insight.constitutionalElement,
          isPerson: insight.isPerson || false,
          personName: insight.personName || null,
          personRelationship: insight.personRelationship || null
        });

        result.consolidated++;
        result.embeddingCalls++;

        // Track which STM entries contributed
        consolidatedStmIds.push(...stmEntries.map(s => s.id));
      }
    }

    // Reinforce existing insights
    for (const reinforced of analysis.reinforcedInsights || []) {
      if (reinforced.existingId) {
        await pgClient.reinforceUserLTM(reinforced.existingId, stmEntries.map(s => s.id));
      }
    }

    // Mark STM entries as consolidated
    if (consolidatedStmIds.length > 0) {
      const uniqueIds = [...new Set(consolidatedStmIds)];
      await pgClient.markUserSTMConsolidated(uniqueIds, null);
    }

    // Mark entries for pruning (but don't delete yet - let them expire naturally)
    for (const prune of analysis.pruneSuggestions || []) {
      result.pruned++;
      // STM will expire via TTL, no need to force delete
    }

    console.log(`[Consolidation] User ${profileId}: processed=${result.processed}, consolidated=${result.consolidated}`);

  } catch (error) {
    console.error(`[Consolidation] Claude analysis failed for user ${profileId}:`, error);
    throw error;
  }

  return result;
}

/**
 * Consolidate Luna's observations about a user
 */
async function consolidatePartnerObservations(userId, profileId) {
  console.log(`[Consolidation] Processing Luna's observations for ${profileId}`);

  const result = {
    processed: 0,
    consolidated: 0,
    pruned: 0,
    tokensUsed: 0,
    embeddingCalls: 0
  };

  // Get unconsolidated partner STM
  const stmEntries = await pgClient.getUnconsolidatedPartnerSTM(
    userId,
    profileId,
    CONSOLIDATION_CONFIG.maxEntriesPerUser
  );

  if (stmEntries.length < CONSOLIDATION_CONFIG.minEntriesForConsolidation) {
    console.log(`[Consolidation] Not enough partner observations (${stmEntries.length}) for ${profileId}, skipping`);
    return result;
  }

  result.processed = stmEntries.length;

  // Get existing partner LTM
  const existingLTM = await pgClient.getPartnerUnderstanding(userId, profileId);

  // Format observations for Claude
  const observationsText = stmEntries.map((o, i) => {
    return `[${i + 1}] (${o.observation_type}, effectiveness: ${o.effectiveness_rating})
Observation: ${o.observation}
Approach used: ${o.approach_used || 'unknown'}
User response: ${o.user_response || 'unknown'}
Element activated: ${o.element_activated || 'unknown'}
Neurochemical: ${o.neurochemical_protocol} (effectiveness: ${o.protocol_effectiveness})
ID: ${o.id}`;
  }).join('\n\n');

  const existingLTMText = existingLTM.length > 0
    ? existingLTM.map(l => {
      return `[${l.insight_type}, confidence: ${l.confidence_score}]
Insight: ${l.insight}
Trust: ${l.trust_level}, Intimacy: ${l.intimacy_level}
Stage: ${l.relationship_stage}
ID: ${l.id}`;
    }).join('\n\n')
    : 'No existing insights about this user yet.';

  // Call Claude for analysis
  const prompt = CONSOLIDATION_PROMPTS.partnerConsolidation
    .replace('{observations}', observationsText)
    .replace('{existingLTM}', existingLTMText);

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: CONSOLIDATION_CONFIG.claudeModel,
      max_tokens: CONSOLIDATION_CONFIG.maxTokensPerAnalysis,
      messages: [{ role: 'user', content: prompt }]
    });

    result.tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    // Parse Claude's response
    const analysisText = response.content[0].text;
    const analysis = JSON.parse(analysisText);

    // Store new insights
    for (const insight of analysis.newInsights || []) {
      await pgClient.storePartnerLTM({
        userId,
        profileId,
        insight: insight.insight,
        insightType: insight.type,
        sourceStmIds: stmEntries.map(s => s.id),
        confidenceScore: insight.confidence,
        effectiveApproaches: insight.effectiveApproaches,
        sensitiveTopics: insight.sensitiveTopics,
        trustLevel: analysis.relationshipEvolution?.trustLevel,
        intimacyLevel: analysis.relationshipEvolution?.intimacyLevel,
        relationshipStage: analysis.relationshipEvolution?.currentStage
      });

      result.consolidated++;
      result.embeddingCalls++;
    }

    // Validate existing insights
    for (const validated of analysis.validatedInsights || []) {
      if (validated.existingId) {
        await pgClient.updatePartnerInsightValidity(validated.existingId, true);
      }
    }

    // Invalidate existing insights
    for (const invalidated of analysis.invalidatedInsights || []) {
      if (invalidated.existingId) {
        await pgClient.updatePartnerInsightValidity(invalidated.existingId, false);
      }
    }

    // Mark STM as consolidated
    const stmIds = stmEntries.map(s => s.id);
    await pgClient.markPartnerSTMConsolidated(stmIds);

    // Record relationship milestone if significant evolution
    if (analysis.relationshipEvolution?.summary) {
      await pgClient.addPartnerMilestone({
        userId,
        profileId,
        milestoneDescription: analysis.relationshipEvolution.summary,
        milestoneType: 'consolidation_reflection',
        trustDelta: analysis.relationshipEvolution.trustLevel,
        intimacyDelta: analysis.relationshipEvolution.intimacyLevel
      });
      result.embeddingCalls++;
    }

    console.log(`[Consolidation] Partner ${profileId}: processed=${result.processed}, consolidated=${result.consolidated}`);

  } catch (error) {
    console.error(`[Consolidation] Claude analysis failed for partner ${profileId}:`, error);
    throw error;
  }

  return result;
}

/**
 * Manual consolidation trigger for a specific user
 * (Can be called from admin function or after significant conversation)
 */
async function triggerUserConsolidation(userId, profileId) {
  console.log(`[Consolidation] Manual trigger for ${profileId}`);

  const runId = await pgClient.startConsolidationRun('manual');

  const stats = {
    userStmProcessed: 0,
    userStmConsolidated: 0,
    userStmPruned: 0,
    partnerStmProcessed: 0,
    partnerStmConsolidated: 0,
    partnerStmPruned: 0,
    claudeTokensUsed: 0,
    embeddingCalls: 0,
    errorCount: 0,
    errorMessage: null
  };

  try {
    const userResult = await consolidateUserMemories(userId, profileId);
    stats.userStmProcessed = userResult.processed;
    stats.userStmConsolidated = userResult.consolidated;
    stats.claudeTokensUsed += userResult.tokensUsed;

    const partnerResult = await consolidatePartnerObservations(userId, profileId);
    stats.partnerStmProcessed = partnerResult.processed;
    stats.partnerStmConsolidated = partnerResult.consolidated;
    stats.claudeTokensUsed += partnerResult.tokensUsed;

  } catch (error) {
    stats.errorCount++;
    stats.errorMessage = error.message;
  }

  await pgClient.completeConsolidationRun(runId, stats);
  return stats;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  runNightlyConsolidation,
  triggerUserConsolidation,
  consolidateUserMemories,
  consolidatePartnerObservations
};
