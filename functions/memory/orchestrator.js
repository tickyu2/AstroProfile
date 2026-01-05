/**
 * ============================================================================
 * GENESIS LUNA - MEMORY ORCHESTRATOR
 * ============================================================================
 * Unified retrieval for the RAG pipeline.
 * Orchestrates parallel retrieval from all memory sources.
 *
 * Functions:
 * - getMemoryContext: Retrieve full context for system prompt
 * - buildMemoryPrompt: Format context for injection
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  MEMORY ORCHESTRATOR                                                    │
 * │                                                                          │
 * │  ┌─────────────────┐                                                     │
 * │  │ USER MESSAGE    │                                                     │
 * │  └────────┬────────┘                                                     │
 * │           │                                                               │
 * │           ▼                                                               │
 * │  ┌───────────────────────────────────────────────────────────────────┐  │
 * │  │                    PARALLEL RETRIEVAL                             │  │
 * │  │                                                                   │  │
 * │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 * │  │  │                    USER'S BRAIN                             │  │  │
 * │  │  │  Facts │ Memories │ People │ Anchors │ Questions │ Timeline │  │  │
 * │  │  └─────────────────────────────────────────────────────────────┘  │  │
 * │  │                                                                   │  │
 * │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 * │  │  │                    LUNA'S BRAIN                             │  │  │
 * │  │  │       Journals │ Patterns │ Emotion Trends                  │  │  │
 * │  │  └─────────────────────────────────────────────────────────────┘  │  │
 * │  │                                                                   │  │
 * │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 * │  │  │              PERSONALITY + TANGO                            │  │  │
 * │  │  │   Weights │ Relationship Stats │ Milestones                 │  │  │
 * │  │  └─────────────────────────────────────────────────────────────┘  │  │
 * │  └───────────────────────────────────────────────────────────────────┘  │
 * │                           │                                              │
 * │                           ▼                                              │
 * │  ┌───────────────────────────────────────────────────────────────────┐  │
 * │  │                    REFINE + FORMAT                                │  │
 * │  │            (filter irrelevant, build prompt)                      │  │
 * │  └───────────────────────────────────────────────────────────────────┘  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FUNCTION_OPTIONS,
  validateRequired
} = require('./shared');

// Import store modules
const stores = require('./stores');
const brain = require('./brain');
const personality = require('./personality');
const tango = require('./tango');
const analysis = require('./analysis');

// ============================================================================
// GET MEMORY CONTEXT
// ============================================================================

/**
 * Unified retrieval for RAG pipeline
 * Retrieves from all sources in parallel
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} userMessage - Current user message
 * @param {Object} options - Additional options
 */
const getMemoryContext = onCall(FUNCTION_OPTIONS.heavy, async (request) => {
  const { userId, profileId, userMessage, options = {} } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'userMessage']);

  const startTime = Date.now();

  try {
    console.log('🧠 Getting full memory context for:', userId, profileId);

    // Parallel retrieval from all sources
    const [
      factsResult,
      memoriesResult,
      peopleResult,
      anchorsResult,
      questionsResult,
      timelineResult,
      lunaJournalsResult,
      lunaPatternsResult,
      emotionTrendsResult,
      personalityWeightsResult,
      relationshipStatsResult
    ] = await Promise.all([
      // User's Brain
      stores.getFacts.run({ data: { userId, profileId, limit: 10 } }),
      stores.retrieveMemories.run({
        data: { userId, profileId, query: userMessage, limit: 10, recencyDays: options.recencyDays || 90 }
      }),
      stores.getPeople.run({ data: { userId, profileId, limit: 5 } }),
      options.moodIsLow
        ? stores.getHappinessAnchors.run({ data: { userId, profileId, limit: 3 } })
        : Promise.resolve({ anchors: [] }),
      stores.getPendingQuestions.run({ data: { userId, profileId, limit: 3 } }),
      stores.getTimelineWithQuestions.run({ data: { userId, profileId } }),

      // Luna's Brain
      brain.getRecentJournalEntries.run({ data: { userId, profileId, limit: 3 } }),
      brain.getPatterns.run({ data: { userId, profileId } }),
      brain.getEmotionTrends.run({ data: { userId, profileId, dayRange: 30 } }),

      // Personality
      personality.getPersonalityWeights.run({ data: { userId, profileId } }),

      // Tango
      tango.getRelationshipStats.run({ data: { userId, profileId } })
    ]);

    // Refine memories if too many
    let refinedMemories = memoriesResult.memories || [];
    if (refinedMemories.length > 5) {
      const refineResult = await analysis.refineMemories.run({
        data: { userMessage, memories: refinedMemories, maxKeep: 5 }
      });
      refinedMemories = refineResult.refined || refinedMemories;
    }

    const context = {
      // User's Brain
      facts: factsResult.facts || [],
      memories: refinedMemories,
      people: peopleResult.people || [],
      happinessAnchors: anchorsResult.anchors || [],
      pendingQuestions: questionsResult.questions || [],
      timeline: timelineResult.timeline || [],
      orphanQuestions: timelineResult.orphanQuestions || [],

      // Luna's Brain
      lunaJournals: lunaJournalsResult.journals || [],
      lunaPatterns: lunaPatternsResult.patterns || [],
      emotionTrends: emotionTrendsResult.trends || null,

      // Personality
      personalityWeights: personalityWeightsResult.weights || null,
      significantTraits: personalityWeightsResult.significantTraits || [],
      personalitySessionCount: personalityWeightsResult.sessionCount || 0,

      // Tango
      relationshipStats: relationshipStatsResult.exists ? relationshipStatsResult : null,

      // Meta
      retrievalTimeMs: Date.now() - startTime
    };

    console.log('✅ Memory context retrieved in', context.retrievalTimeMs, 'ms');

    return { success: true, context };

  } catch (error) {
    console.error('❌ Get memory context error:', error);
    return {
      success: false,
      context: {
        facts: [], memories: [], people: [], happinessAnchors: [],
        pendingQuestions: [], timeline: [], orphanQuestions: [],
        lunaJournals: [], lunaPatterns: [], emotionTrends: null,
        personalityWeights: null, significantTraits: [], personalitySessionCount: 0,
        relationshipStats: null
      },
      error: error.message
    };
  }
});

// ============================================================================
// BUILD MEMORY PROMPT
// ============================================================================

/**
 * Format context for system prompt injection
 *
 * @param {Object} context - Memory context from getMemoryContext
 * @returns {string} Formatted prompt section
 */
function buildMemoryPrompt(context) {
  if (!context) return '';

  let prompt = '';

  // Facts (highest priority)
  if (context.facts?.length > 0) {
    prompt += `\n═══ PERMANENT FACTS (Trust These) ═══\n`;
    prompt += context.facts.map(f => `• ${f.fact}`).join('\n');
  }

  // People
  if (context.people?.length > 0) {
    prompt += `\n\n═══ PEOPLE IN USER'S LIFE ═══\n`;
    prompt += context.people.map(p =>
      `• ${p.name} (${p.relationship})${p.notes?.length ? ': ' + p.notes[0] : ''}`
    ).join('\n');
  }

  // Memories
  if (context.memories?.length > 0) {
    prompt += `\n\n═══ RELEVANT MEMORIES ═══\n`;
    prompt += context.memories.map(m => `• ${m.content}`).join('\n');
  }

  // Happiness anchors
  if (context.happinessAnchors?.length > 0) {
    prompt += `\n\n═══ HAPPINESS ANCHORS (If User Seems Down) ═══\n`;
    prompt += context.happinessAnchors.map(h => `• ${h.memory}`).join('\n');
  }

  // Luna's journal insights
  if (context.lunaJournals?.length > 0) {
    prompt += `\n\n═══ YOUR PRIVATE NOTES (Luna's Brain) ═══\n`;
    for (const journal of context.lunaJournals.slice(0, 2)) {
      const session = journal.sessions?.[journal.sessions.length - 1];
      if (!session) continue;

      prompt += `📓 ${journal.date}:\n`;
      if (session.emotionSensing) {
        prompt += `  Mood: ${session.emotionSensing.dominantMood}\n`;
      }
      if (session.whatWorked?.length > 0) {
        prompt += `  ✓ Worked: ${session.whatWorked.slice(0, 2).join('; ')}\n`;
      }
      if (session.lunaState?.noteToSelf) {
        prompt += `  💭 Note: ${session.lunaState.noteToSelf}\n`;
      }
    }
  }

  // Patterns
  if (context.lunaPatterns?.length > 0) {
    prompt += `\n═══ LEARNED PATTERNS ═══\n`;
    const positive = context.lunaPatterns.filter(p => p.effectiveness === 'positive');
    const negative = context.lunaPatterns.filter(p => p.effectiveness === 'negative');
    if (positive.length > 0) prompt += `✓ DO: ${positive.slice(0, 3).map(p => p.pattern).join(' | ')}\n`;
    if (negative.length > 0) prompt += `✗ AVOID: ${negative.slice(0, 2).map(p => p.pattern).join(' | ')}\n`;
  }

  // Timeline
  if (context.timeline?.length > 0) {
    prompt += `\n\n═══ USER'S LIFE TIMELINE ═══\n`;
    for (const entry of context.timeline.slice(0, 5)) {
      const label = entry.year ? `📅 ${entry.year}` : `🌙 ${entry.era || 'Earlier life'}`;
      prompt += `${label}: ${entry.events?.[0]?.event || ''}\n`;
      if (entry.questions?.length > 0) {
        prompt += `  💭 Open: ${entry.questions[0].question}\n`;
      }
    }
  }

  // Personality weights
  if (context.personalityWeights && context.personalitySessionCount > 0) {
    prompt += personality.buildPersonalityPrompt(
      context.personalityWeights,
      context.significantTraits
    );
  }

  return prompt;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getMemoryContext,
  buildMemoryPrompt
};
